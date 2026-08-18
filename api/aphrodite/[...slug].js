/**
 * Hobby-safe catch-all for /api/aphrodite/*
 * Auth via Supabase Bearer token. Stripe subscription via shared stripe helpers.
 */
import { createHmac, timingSafeEqual } from 'node:crypto'
import { json, readBody } from '../_lib/auth.js'
import { plainText } from '../_lib/sanitize.js'
import { clientKey, rateLimit } from '../_lib/rateLimit.js'
import { getSupabaseAuthUser, isGoogleAuthBackendReady } from '../_lib/supabaseAuth.js'
import { isSupabaseConfigured } from '../_lib/supabase.js'
import {
  activateIapMembership,
  aphroditeCatalog,
  adultStatus,
  blockProfile,
  deactivateProfile,
  getMatchForViewer,
  getProfileByAuthUserId,
  isAdult,
  isSubscribed,
  IAP_PRODUCT_ID,
  listDeck,
  listMatches,
  listMessages,
  recordSwipe,
  reportProfile,
  sendMessage,
  setSubscriptionState,
  updateProfile,
  upsertProfileFromAuth,
} from '../_lib/aphroditeStore.js'
import {
  getStripe,
  isStripeConfigured,
  siteOrigin,
} from '../_lib/stripeClient.js'

const APHRODITE_PRICE_CENTS = 2000
const DEMO_PREFIX = 'aphdemo.'

function demoSecret() {
  return (
    String(process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'aphrodite-dev').trim() ||
    'aphrodite-dev'
  )
}

function signDemoToken(authUserId, email) {
  const payload = Buffer.from(
    JSON.stringify({ sub: authUserId, email, exp: Date.now() + 12 * 60 * 60 * 1000 }),
  ).toString('base64url')
  const sig = createHmac('sha256', demoSecret()).update(payload).digest('base64url')
  return `${DEMO_PREFIX}${payload}.${sig}`
}

function verifyDemoToken(token) {
  if (!token?.startsWith(DEMO_PREFIX)) return null
  const raw = token.slice(DEMO_PREFIX.length)
  const [payload, sig] = raw.split('.')
  if (!payload || !sig) return null
  const expected = createHmac('sha256', demoSecret()).update(payload).digest('base64url')
  try {
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (!data?.sub || !data?.exp || data.exp < Date.now()) return null
    return { id: data.sub, email: data.email || null, app_metadata: { provider: 'demo' } }
  } catch {
    return null
  }
}

function routeKey(req) {
  const slug = req.query?.slug
  if (Array.isArray(slug)) return slug.filter(Boolean).join('/')
  if (typeof slug === 'string' && slug) return slug
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`)
  return url.pathname.replace(/^\/api\/aphrodite\/?/, '').replace(/\/$/, '')
}

function bearerToken(req) {
  const h = String(req.headers.authorization || '')
  const m = h.match(/^Bearer\s+(.+)$/i)
  return m ? m[1].trim() : ''
}

async function requireAphroditeUser(req, res) {
  const token = bearerToken(req)
  if (!token) {
    json(res, 401, { ok: false, error: 'Sign in required' })
    return null
  }
  if (token.startsWith(DEMO_PREFIX)) {
    if (isSupabaseConfigured()) {
      json(res, 401, { ok: false, error: 'Demo tokens disabled when Supabase is configured' })
      return null
    }
    const user = verifyDemoToken(token)
    if (!user) {
      json(res, 401, { ok: false, error: 'Invalid or expired demo session' })
      return null
    }
    return user
  }
  const user = await getSupabaseAuthUser(token)
  if (!user) {
    json(res, 401, { ok: false, error: 'Invalid or expired session' })
    return null
  }
  return user
}

async function requireProfile(req, res) {
  const user = await requireAphroditeUser(req, res)
  if (!user) return null
  let profile = await getProfileByAuthUserId(user.id)
  if (!profile) {
    profile = await upsertProfileFromAuth(user)
  }
  return { user, profile }
}

async function handleStatus(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  const catalog = aphroditeCatalog()
  return json(res, 200, {
    ok: true,
    product: 'aphrodite',
    catalog,
    supabase: isSupabaseConfigured(),
    authBackend: isGoogleAuthBackendReady(),
    stripeConfigured: isStripeConfigured(),
    providers: {
      google: true,
      apple: true,
      twitter: true,
      discord: true,
      facebook: true,
      email: true,
      instagram: 'stub',
    },
    safety: {
      minAge: catalog.minAge,
      reportReasons: catalog.reportReasons,
      block: true,
      messages: true,
    },
    store: {
      stripeWeb: true,
      iapProductId: catalog.iapProductId,
      privacyUrl: '/aphrodite/privacy',
      termsUrl: '/aphrodite/terms',
      safetyUrl: '/aphrodite/safety',
    },
    note:
      'OAuth providers need Dashboard credentials. Instagram Login is stubbed — use Facebook provider or link Instagram handle on profile. iOS App Store billing uses StoreKit product aphrodite_monthly; web uses Stripe.',
  })
}

async function requireReadyMember(req, res) {
  const ctx = await requireProfile(req, res)
  if (!ctx) return null
  if (!ctx.profile.active) {
    json(res, 403, { ok: false, error: 'Account deactivated', code: 'deactivated' })
    return null
  }
  if (!isSubscribed(ctx.profile)) {
    json(res, 402, {
      ok: false,
      error: 'Active $20/month membership required',
      code: 'subscription_required',
    })
    return null
  }
  const age = adultStatus(ctx.profile.birthDate)
  if (!age.ok) {
    json(res, 403, { ok: false, error: age.error, code: age.code })
    return null
  }
  return ctx
}

async function handleSession(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  const rl = rateLimit(clientKey(req, 'aphrodite-session'), {
    limit: 40,
    windowMs: 15 * 60 * 1000,
  })
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfterSec))
    return json(res, 429, { ok: false, error: 'Too many attempts' })
  }

  const user = await requireAphroditeUser(req, res)
  if (!user) return

  let body = {}
  try {
    body = await readBody(req)
  } catch {
    body = {}
  }

  try {
    const profile = await upsertProfileFromAuth(user, {
      provider: plainText(body.provider || '', 40),
      displayName: plainText(body.displayName || '', 80),
      intents: body.intents,
      competitions: body.competitions,
      chessCom: body.chessCom,
      maxpreps: body.maxpreps,
      instagram: body.instagram,
      clashRoyale: body.clashRoyale,
      birthDate: plainText(body.birthDate || body.birth_date || '', 12),
    })

    return json(res, 200, {
      ok: true,
      profile,
      subscribed: isSubscribed(profile),
      adult: isAdult(profile),
    })
  } catch (err) {
    const status = err.code === 'underage' || err.code === 'age_required' ? 403 : 400
    return json(res, status, { ok: false, error: err.message, code: err.code })
  }
}

async function handleMe(req, res) {
  const ctx = await requireProfile(req, res)
  if (!ctx) return

  if (req.method === 'GET') {
    return json(res, 200, {
      ok: true,
      profile: ctx.profile,
      subscribed: isSubscribed(ctx.profile),
      adult: isAdult(ctx.profile),
    })
  }

  if (req.method === 'PATCH') {
    let body
    try {
      body = await readBody(req)
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message })
    }
    try {
      const profile = await updateProfile(ctx.profile.id, body)
      return json(res, 200, {
        ok: true,
        profile,
        subscribed: isSubscribed(profile),
        adult: isAdult(profile),
      })
    } catch (err) {
      const status = err.code === 'underage' || err.code === 'age_required' ? 403 : 400
      return json(res, status, { ok: false, error: err.message, code: err.code })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}

async function handleDeck(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  const ctx = await requireReadyMember(req, res)
  if (!ctx) return
  const deck = await listDeck(ctx.profile.id)
  return json(res, 200, { ok: true, deck })
}

async function handleSwipe(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  const ctx = await requireReadyMember(req, res)
  if (!ctx) return

  let body
  try {
    body = await readBody(req)
  } catch (err) {
    return json(res, 400, { ok: false, error: err.message })
  }

  const toId = plainText(body.toProfileId || body.toId || '', 80)
  const direction = plainText(body.direction || '', 16)
  if (!toId) return json(res, 400, { ok: false, error: 'toProfileId required' })

  try {
    const result = await recordSwipe(ctx.profile.id, toId, direction)
    return json(res, 200, { ok: true, ...result })
  } catch (err) {
    return json(res, 400, { ok: false, error: err.message })
  }
}

async function handleMatches(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  const ctx = await requireReadyMember(req, res)
  if (!ctx) return
  const matches = await listMatches(ctx.profile.id)
  return json(res, 200, { ok: true, matches })
}

/**
 * Stripe Checkout in subscription mode for Aphrodite ($20/mo).
 * Enabled whenever STRIPE_SECRET_KEY is set (independent of hall hold gate).
 */
async function handleSubscribe(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  const rl = rateLimit(clientKey(req, 'aphrodite-subscribe'), {
    limit: 20,
    windowMs: 15 * 60 * 1000,
  })
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfterSec))
    return json(res, 429, { ok: false, error: 'Too many attempts' })
  }

  const ctx = await requireProfile(req, res)
  if (!ctx) return

  const stripe = getStripe()
  if (!stripe) {
    return json(res, 503, {
      ok: false,
      error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in Vercel env.',
    })
  }

  const origin = siteOrigin(req)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: ctx.profile.email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: APHRODITE_PRICE_CENTS,
            recurring: { interval: 'month' },
            product_data: {
              name: 'Aphrodite membership',
              description: 'Competition dating — Valhalla ecosystem. $20/month.',
              metadata: {
                sku: 'aphrodite',
                kind: 'subscription',
                brand: 'valhalla',
              },
            },
          },
        },
      ],
      success_url: `${origin}/aphrodite/settings?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/aphrodite/subscribe?checkout=cancel`,
      client_reference_id: ctx.profile.id,
      metadata: {
        sku: 'aphrodite',
        kind: 'subscription',
        source: 'aphrodite',
        profile_id: ctx.profile.id,
        auth_user_id: ctx.user.id,
      },
      subscription_data: {
        metadata: {
          sku: 'aphrodite',
          profile_id: ctx.profile.id,
          auth_user_id: ctx.user.id,
        },
      },
    })

    return json(res, 200, {
      ok: true,
      id: session.id,
      url: session.url,
      mode: session.mode,
    })
  } catch (err) {
    console.error('[aphrodite/subscribe]', err.message)
    return json(res, 502, {
      ok: false,
      error: err.message || 'Checkout session failed',
    })
  }
}

/** Dev/test helper: mark subscribed after Checkout return when webhooks lag. */
async function handleConfirmCheckout(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  const ctx = await requireProfile(req, res)
  if (!ctx) return

  const stripe = getStripe()
  if (!stripe) {
    return json(res, 503, { ok: false, error: 'Stripe not configured' })
  }

  let body
  try {
    body = await readBody(req)
  } catch (err) {
    return json(res, 400, { ok: false, error: err.message })
  }

  const sessionId = plainText(body.sessionId || '', 200)
  if (!sessionId) {
    return json(res, 400, { ok: false, error: 'sessionId required' })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.metadata?.profile_id && session.metadata.profile_id !== ctx.profile.id) {
      return json(res, 403, { ok: false, error: 'Session does not belong to this profile' })
    }
    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return json(res, 400, {
        ok: false,
        error: 'Checkout not complete',
        paymentStatus: session.payment_status,
        status: session.status,
      })
    }

    const profile = await setSubscriptionState(ctx.profile.id, {
      status: 'active',
      customerId: session.customer || null,
      subscriptionId: session.subscription || null,
      currentPeriodEnd: null,
    })

    return json(res, 200, {
      ok: true,
      profile,
      subscribed: isSubscribed(profile),
    })
  } catch (err) {
    console.error('[aphrodite/confirm]', err.message)
    return json(res, 502, { ok: false, error: err.message })
  }
}

/**
 * Memory-only demo: activate membership without Stripe (local / preview).
 * Disabled when Stripe is configured in live mode.
 */
async function handleDemoActivate(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  const ctx = await requireProfile(req, res)
  if (!ctx) return

  const key = String(process.env.STRIPE_SECRET_KEY || '')
  if (key.startsWith('sk_live')) {
    return json(res, 403, {
      ok: false,
      error: 'Demo activate disabled in live Stripe mode',
    })
  }

  const profile = await setSubscriptionState(ctx.profile.id, {
    status: 'active',
    customerId: ctx.profile.stripeCustomerId || 'demo_cus',
    subscriptionId: 'demo_sub',
    currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
  })

  return json(res, 200, {
    ok: true,
    profile,
    subscribed: true,
    note: 'Demo membership activated (test / memory mode).',
  })
}

async function handleDemoLogin(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  if (isSupabaseConfigured()) {
    return json(res, 403, {
      ok: false,
      error: 'Demo login only when Supabase is not configured. Use OAuth instead.',
    })
  }

  const rl = rateLimit(clientKey(req, 'aphrodite-demo-login'), {
    limit: 30,
    windowMs: 15 * 60 * 1000,
  })
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfterSec))
    return json(res, 429, { ok: false, error: 'Too many attempts' })
  }

  let body = {}
  try {
    body = await readBody(req)
  } catch {
    body = {}
  }

  const displayName = plainText(body.displayName || 'Eason', 80) || 'Eason'
  const email = plainText(body.email || 'eason@aphrodite.local', 200).toLowerCase()
  const authUserId = `demo-user-${email}`
  const user = {
    id: authUserId,
    email,
    app_metadata: { provider: 'demo' },
    user_metadata: { full_name: displayName },
  }
  const profile = await upsertProfileFromAuth(user, {
    provider: 'demo',
    displayName,
    intents: body.intents,
    competitions: body.competitions,
    birthDate: plainText(body.birthDate || '1990-05-17', 12) || '1990-05-17',
  })
  const token = signDemoToken(authUserId, email)
  return json(res, 200, {
    ok: true,
    accessToken: token,
    profile,
    subscribed: isSubscribed(profile),
    adult: isAdult(profile),
    note: 'Memory-mode demo session. Configure Supabase for real OAuth.',
  })
}

async function handleMatch(req, res, matchId) {
  if (req.method !== 'GET') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  const ctx = await requireReadyMember(req, res)
  if (!ctx) return
  const match = await getMatchForViewer(matchId, ctx.profile.id)
  if (!match) return json(res, 404, { ok: false, error: 'Match not found' })
  return json(res, 200, { ok: true, match })
}

async function handleMessages(req, res) {
  const ctx = await requireReadyMember(req, res)
  if (!ctx) return

  let body = {}
  if (req.method !== 'GET') {
    try {
      body = await readBody(req)
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message })
    }
  }
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`)
  const matchId = plainText(body.matchId || url.searchParams.get('matchId') || '', 80)
  if (!matchId) return json(res, 400, { ok: false, error: 'matchId required' })

  if (req.method === 'GET') {
    const messages = await listMessages(matchId, ctx.profile.id)
    const match = await getMatchForViewer(matchId, ctx.profile.id)
    return json(res, 200, { ok: true, match, messages })
  }

  if (req.method === 'POST') {
    const rl = rateLimit(clientKey(req, 'aphrodite-msg'), {
      limit: 60,
      windowMs: 10 * 60 * 1000,
    })
    if (!rl.ok) {
      res.setHeader('Retry-After', String(rl.retryAfterSec))
      return json(res, 429, { ok: false, error: 'Too many messages' })
    }
    try {
      const message = await sendMessage(matchId, ctx.profile.id, body.body || body.text || '')
      return json(res, 200, { ok: true, message })
    } catch (err) {
      const status = err.code === 'not_found' ? 404 : 400
      return json(res, status, { ok: false, error: err.message, code: err.code })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}

async function handleBlock(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  const ctx = await requireReadyMember(req, res)
  if (!ctx) return
  let body
  try {
    body = await readBody(req)
  } catch (err) {
    return json(res, 400, { ok: false, error: err.message })
  }
  const toId = plainText(body.toProfileId || body.toId || '', 80)
  if (!toId) return json(res, 400, { ok: false, error: 'toProfileId required' })
  try {
    const result = await blockProfile(ctx.profile.id, toId)
    return json(res, 200, result)
  } catch (err) {
    return json(res, 400, { ok: false, error: err.message })
  }
}

async function handleReport(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  const ctx = await requireReadyMember(req, res)
  if (!ctx) return
  const rl = rateLimit(clientKey(req, 'aphrodite-report'), {
    limit: 20,
    windowMs: 60 * 60 * 1000,
  })
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfterSec))
    return json(res, 429, { ok: false, error: 'Too many reports' })
  }
  let body
  try {
    body = await readBody(req)
  } catch (err) {
    return json(res, 400, { ok: false, error: err.message })
  }
  const toId = plainText(body.toProfileId || body.toId || '', 80)
  const reason = plainText(body.reason || '', 40)
  const details = plainText(body.details || '', 800)
  if (!toId) return json(res, 400, { ok: false, error: 'toProfileId required' })
  try {
    const result = await reportProfile(ctx.profile.id, toId, reason, details)
    return json(res, 200, result)
  } catch (err) {
    return json(res, 400, { ok: false, error: err.message })
  }
}

async function handleDeactivate(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  const ctx = await requireProfile(req, res)
  if (!ctx) return
  const profile = await deactivateProfile(ctx.profile.id)
  return json(res, 200, { ok: true, profile, deactivated: true })
}

/**
 * App Store membership. Live iOS uses StoreKit product aphrodite_monthly.
 * Test unlock is only allowed when Stripe is not live and APHRODITE_IAP_TEST=1
 * or Supabase is unset (local memory).
 */
async function handleIap(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  const ctx = await requireProfile(req, res)
  if (!ctx) return
  if (!isAdult(ctx.profile)) {
    const age = adultStatus(ctx.profile.birthDate)
    return json(res, 403, { ok: false, error: age.error, code: age.code })
  }

  let body
  try {
    body = await readBody(req)
  } catch (err) {
    return json(res, 400, { ok: false, error: err.message })
  }

  const productId = plainText(body.productId || IAP_PRODUCT_ID, 80) || IAP_PRODUCT_ID
  const transactionId = plainText(body.transactionId || '', 120)
  const signedTransaction = plainText(body.signedTransaction || '', 8000)
  const liveStripe = String(process.env.STRIPE_SECRET_KEY || '').startsWith('sk_live')
  const testAllowed =
    !liveStripe &&
    (process.env.APHRODITE_IAP_TEST === '1' || !isSupabaseConfigured())

  if (body.testUnlock && testAllowed) {
    const profile = await activateIapMembership(ctx.profile.id, {
      productId,
      transactionId: transactionId || 'test-iap',
    })
    return json(res, 200, {
      ok: true,
      profile,
      subscribed: true,
      source: 'iap-test',
    })
  }

  if (!signedTransaction) {
    return json(res, 503, {
      ok: false,
      error:
        'App Store receipt not present. Web membership uses Stripe. Native IAP completes on a Mac with StoreKit + Apple Server API keys.',
      code: 'iap_not_configured',
      productId: IAP_PRODUCT_ID,
    })
  }

  return json(res, 503, {
    ok: false,
    error:
      'Apple Server API verification is not wired in this environment. Set keys on a Mac build, then retry.',
    code: 'iap_verify_pending',
    productId,
  })
}

export default async function handler(req, res) {
  const key = routeKey(req)

  try {
    if (key === 'status' || key === '') return handleStatus(req, res)
    if (key === 'session') return handleSession(req, res)
    if (key === 'me') return handleMe(req, res)
    if (key === 'deck') return handleDeck(req, res)
    if (key === 'swipe') return handleSwipe(req, res)
    if (key === 'matches') return handleMatches(req, res)
    if (key.startsWith('matches/')) {
      const matchId = key.slice('matches/'.length).split('/')[0]
      return handleMatch(req, res, matchId)
    }
    if (key === 'messages') return handleMessages(req, res)
    if (key === 'block') return handleBlock(req, res)
    if (key === 'report') return handleReport(req, res)
    if (key === 'deactivate') return handleDeactivate(req, res)
    if (key === 'iap') return handleIap(req, res)
    if (key === 'subscribe') return handleSubscribe(req, res)
    if (key === 'confirm-checkout') return handleConfirmCheckout(req, res)
    if (key === 'demo-activate') return handleDemoActivate(req, res)
    if (key === 'demo-login') return handleDemoLogin(req, res)
    return json(res, 404, { ok: false, error: `Unknown aphrodite route: ${key}` })
  } catch (err) {
    console.error('[aphrodite]', err)
    return json(res, 500, { ok: false, error: err.message || 'Aphrodite route error' })
  }
}
