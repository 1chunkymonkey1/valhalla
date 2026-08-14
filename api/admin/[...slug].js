/**
 * Single Hobby-plan serverless function for all /api/admin/* routes.
 * (Vercel Hobby allows max 12 functions per deployment.)
 */
import {
  ADMIN_EMAIL,
  clearSessionCookie,
  createSessionPayload,
  getSession,
  isAdminEmail,
  isTotpConfigured,
  json,
  readBody,
  requireAdmin,
  requirePeopleAdmin,
  requireTotpForGoogleAdmin,
  setSessionCookie,
  signSession,
  verifyAdminTotp,
  verifyPassword,
} from '../_lib/auth.js'
import { isSupabaseConfigured } from '../_lib/supabase.js'
import { authEmail, getSupabaseAuthUser, isGoogleAuthBackendReady } from '../_lib/supabaseAuth.js'
import {
  importReservations,
  listReservations,
  listSignups,
} from '../_lib/store.js'
import {
  ROLES,
  createInvite,
  exportEmpire,
  importEmpire,
  listActivity,
  listHallIds,
  listInvites,
  listUsers,
  upsertUser,
  getUserByEmail,
  hashPassword,
} from '../_lib/empireStore.js'
import { listHallCodesAdmin, setHallCode, WAVE2_HALLS } from '../_lib/hallCodes.js'
import { listCompanySocials, upsertCompanySocial } from '../_lib/companySocials.js'
import {
  FONT_FAMILIES,
  PAGE_IDS,
  getPageLayout,
  listPageLayouts,
  uploadPageAsset,
  upsertPageLayout,
} from '../_lib/pageLayouts.js'
import {
  getAdminThread,
  listAdminThreads,
  markAdminRead,
  replyAsAdmin,
  setThreadStatus,
} from '../_lib/siteChat.js'
import { clientKey, rateLimit } from '../_lib/rateLimit.js'

const COMPANY_SUMMARY = [
  { id: 'wolf', name: 'Wolf', domain: 'land', pillar: 'movement', wave: 1 },
  { id: 'viking', name: 'Viking', domain: 'water', pillar: 'movement', wave: 1 },
  { id: 'eagle', name: 'Eagle', domain: 'air', pillar: 'movement', wave: 2 },
  { id: 'phenix', name: 'Phenix', domain: 'space', pillar: 'movement', wave: 2 },
  { id: 'holm', name: 'Holm', domain: 'land', pillar: 'habitation', wave: 1 },
  { id: 'atoll', name: 'Atoll', domain: 'water', pillar: 'habitation', wave: 1 },
  { id: 'olympus', name: 'Olympus', domain: 'air', pillar: 'habitation', wave: 2 },
  { id: 'aether', name: 'Aether', domain: 'space', pillar: 'habitation', wave: 2 },
  { id: 'demeter', name: 'Demeter', domain: 'land', pillar: 'substrate', wave: 1 },
  { id: 'njord', name: 'Njord', domain: 'water', pillar: 'substrate', wave: 1 },
  { id: 'aeolus', name: 'Aeolus', domain: 'air', pillar: 'substrate', wave: 2 },
  { id: 'corvus', name: 'Corvus', domain: 'space', pillar: 'substrate', wave: 2 },
]

function routeKey(req) {
  const slug = req.query?.slug
  if (Array.isArray(slug)) return slug.filter(Boolean).join('/')
  if (typeof slug === 'string' && slug) return slug
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`)
  return url.pathname.replace(/^\/api\/admin\/?/, '').replace(/\/$/, '')
}

async function handleLogin(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  const rl = rateLimit(clientKey(req, 'admin-login'), { limit: 12, windowMs: 15 * 60 * 1000 })
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfterSec))
    return json(res, 429, { ok: false, error: 'Too many login attempts. Try again later.' })
  }

  if (!process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH) {
    return json(res, 503, {
      ok: false,
      error: 'Admin auth not configured. Set ADMIN_PASSWORD or ADMIN_PASSWORD_HASH on Vercel.',
    })
  }

  if (!isTotpConfigured()) {
    return json(res, 503, {
      ok: false,
      error:
        '2FA required but ADMIN_TOTP_SECRET is not set. Generate a secret (npm run admin:totp), add it on Vercel, then redeploy.',
    })
  }

  try {
    const body = await readBody(req)
    const email = String(body.email || '')
      .trim()
      .toLowerCase()
    const password = String(body.password || '')
    const totp = String(body.totp || body.code || '')

    if (!isAdminEmail(email)) {
      return json(res, 401, { ok: false, error: 'Invalid credentials' })
    }
    if (!verifyPassword(password)) {
      return json(res, 401, { ok: false, error: 'Invalid credentials' })
    }
    if (!verifyAdminTotp(totp)) {
      return json(res, 401, { ok: false, error: 'Invalid authenticator code' })
    }

    const token = signSession(createSessionPayload(email))
    setSessionCookie(res, token)
    return json(res, 200, { ok: true, email, authMethod: 'password' })
  } catch {
    return json(res, 400, { ok: false, error: 'Bad request' })
  }
}

/**
 * Exchange a Supabase Auth access token (Google OAuth) for the admin session cookie.
 * Does not store Google passwords. Allowlist: info@valhallaco.org + ADMIN_GOOGLE_EMAILS.
 */
async function handleLoginGoogle(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  const rl = rateLimit(clientKey(req, 'admin-google'), { limit: 20, windowMs: 15 * 60 * 1000 })
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfterSec))
    return json(res, 429, { ok: false, error: 'Too many login attempts. Try again later.' })
  }

  if (!isGoogleAuthBackendReady()) {
    return json(res, 503, {
      ok: false,
      error: 'Google sign-in needs SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY on Vercel.',
    })
  }

  if (!process.env.ADMIN_SESSION_SECRET && !process.env.ADMIN_PASSWORD) {
    return json(res, 503, {
      ok: false,
      error: 'Set ADMIN_SESSION_SECRET on Vercel to issue admin sessions.',
    })
  }

  try {
    const body = await readBody(req)
    const accessToken = String(body.accessToken || body.access_token || '')
    const totp = String(body.totp || body.code || '')
    const user = await getSupabaseAuthUser(accessToken)
    const email = authEmail(user)

    if (!email || !isAdminEmail(email)) {
      return json(res, 403, {
        ok: false,
        error: `Google account is not on the founder allowlist (${ADMIN_EMAIL}).`,
      })
    }

    if (requireTotpForGoogleAdmin()) {
      if (!isTotpConfigured()) {
        return json(res, 503, {
          ok: false,
          error: 'ADMIN_GOOGLE_REQUIRE_TOTP is on but ADMIN_TOTP_SECRET is missing.',
        })
      }
      if (!totp) {
        return json(res, 401, {
          ok: false,
          needTotp: true,
          email,
          error: 'Enter your authenticator code to finish Google sign-in.',
        })
      }
      if (!verifyAdminTotp(totp)) {
        return json(res, 401, { ok: false, needTotp: true, error: 'Invalid authenticator code' })
      }
    }

    const token = signSession(createSessionPayload(email))
    setSessionCookie(res, token)
    return json(res, 200, {
      ok: true,
      email,
      authMethod: 'google',
      totpRequired: requireTotpForGoogleAdmin(),
    })
  } catch (err) {
    return json(res, 400, { ok: false, error: err.message || 'Bad request' })
  }
}

async function handleAuthOptions(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  return json(res, 200, {
    ok: true,
    google: isGoogleAuthBackendReady(),
    password: Boolean(process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH),
    totp: isTotpConfigured(),
    googleRequiresTotp: requireTotpForGoogleAdmin(),
    storage: isSupabaseConfigured() ? 'supabase' : 'memory',
    adminEmail: ADMIN_EMAIL,
  })
}

async function handleLogout(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  clearSessionCookie(res)
  return json(res, 200, { ok: true })
}

async function handleSession(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  const session = getSession(req)
  if (!session) {
    return json(res, 200, { ok: true, authenticated: false })
  }
  return json(res, 200, {
    ok: true,
    authenticated: true,
    email: session.email,
    exp: session.exp,
  })
}

async function handleLedger(req, res) {
  const session = requireAdmin(req, res)
  if (!session) return

  if (req.method === 'GET') {
    try {
      const [signups, reservations] = await Promise.all([listSignups(), listReservations()])
      const supabase = isSupabaseConfigured()
      return json(res, 200, {
        ok: true,
        email: session.email,
        signups,
        reservations,
        companies: COMPANY_SUMMARY,
        storage: supabase ? 'supabase' : 'memory',
        note: supabase
          ? 'Durable storage via Supabase.'
          : 'Memory fallback — set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY for durable empire data.',
      })
    } catch (err) {
      return json(res, 500, { ok: false, error: err.message || 'Storage error' })
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await readBody(req)
      const rows = body.reservations || body.ledger || []
      const imported = await importReservations(rows)
      return json(res, 200, { ok: true, imported })
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message || 'Bad request' })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}

async function handlePeople(req, res) {
  const session = requirePeopleAdmin(req, res)
  if (!session) return

  if (req.method === 'GET') {
    try {
      const [users, invites, activity] = await Promise.all([
        listUsers(),
        listInvites(),
        listActivity(80),
      ])
      return json(res, 200, {
        ok: true,
        roles: ROLES,
        halls: listHallIds(),
        users,
        invites,
        activity,
        storage: isSupabaseConfigured() ? 'supabase' : 'memory',
      })
    } catch (err) {
      return json(res, 500, { ok: false, error: err.message || 'Storage error' })
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await readBody(req)
      const action = body.action || 'invite'

      if (action === 'invite') {
        if (!body.email) return json(res, 400, { ok: false, error: 'Email required' })
        const invite = await createInvite({
          email: body.email,
          name: body.name || '',
          role: body.role || 'hall_lead',
          halls: body.halls || [],
          invitedBy: session.email,
        })
        const origin = req.headers.origin || `https://${req.headers.host}`
        return json(res, 200, {
          ok: true,
          invite,
          acceptUrl: `${origin}/team/join?token=${invite.token}`,
        })
      }

      if (action === 'update_user') {
        const existing = await getUserByEmail(body.email)
        if (!existing) return json(res, 404, { ok: false, error: 'User not found' })
        const patch = {
          ...existing,
          name: body.name ?? existing.name,
          role: body.role ?? existing.role,
          halls: body.halls ?? existing.halls,
          active: body.active ?? existing.active,
        }
        if (body.password) patch.passwordHash = hashPassword(body.password)
        const user = await upsertUser(patch)
        return json(res, 200, { ok: true, user })
      }

      if (action === 'export') {
        const empire = await exportEmpire()
        return json(res, 200, { ok: true, empire })
      }

      if (action === 'import') {
        const ok = await importEmpire(body.empire)
        return json(res, ok ? 200 : 400, { ok })
      }

      return json(res, 400, { ok: false, error: 'Unknown action' })
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message || 'Bad request' })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}

async function handleCodes(req, res) {
  const session = requireAdmin(req, res)
  if (!session) return

  if (req.method === 'GET') {
    try {
      const codes = await listHallCodesAdmin()
      return json(res, 200, {
        ok: true,
        codes,
        wave2Halls: WAVE2_HALLS,
        storage: isSupabaseConfigured() ? 'supabase' : 'memory',
        note: 'Codes unlock Eagle→Corvus after the post-Njord break. Publish on Instagram.',
      })
    } catch (err) {
      return json(res, 500, { ok: false, error: err.message || 'Codes error' })
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await readBody(req)
      const hallId = String(body.hallId || body.hall || '')
        .trim()
        .toLowerCase()
      const row = await setHallCode(hallId, body.code, body.note || '')
      return json(res, 200, { ok: true, code: row })
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message || 'Bad request' })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}

async function handleSocials(req, res) {
  const session = requireAdmin(req, res)
  if (!session) return

  if (req.method === 'GET') {
    try {
      const socials = await listCompanySocials()
      return json(res, 200, {
        ok: true,
        socials,
        storage: isSupabaseConfigured() ? 'supabase' : 'memory',
      })
    } catch (err) {
      return json(res, 500, { ok: false, error: err.message || 'Socials error' })
    }
  }

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const body = await readBody(req)
      const companyId = String(body.companyId || body.hall || '')
        .trim()
        .toLowerCase()
      const row = await upsertCompanySocial(companyId, body)
      return json(res, 200, { ok: true, social: row })
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message || 'Bad request' })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}

async function handlePages(req, res) {
  const session = requireAdmin(req, res)
  if (!session) return

  if (req.method === 'GET') {
    try {
      const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`)
      const pageId = String(url.searchParams.get('id') || '')
        .trim()
        .toLowerCase()
      if (pageId) {
        const page = await getPageLayout(pageId)
        if (!page) return json(res, 404, { ok: false, error: 'Unknown page id' })
        return json(res, 200, {
          ok: true,
          page,
          pageIds: PAGE_IDS,
          fonts: FONT_FAMILIES,
          storage: isSupabaseConfigured() ? 'supabase' : 'memory',
        })
      }
      const pages = await listPageLayouts()
      return json(res, 200, {
        ok: true,
        pages,
        pageIds: PAGE_IDS,
        fonts: FONT_FAMILIES,
        storage: isSupabaseConfigured() ? 'supabase' : 'memory',
      })
    } catch (err) {
      return json(res, 500, { ok: false, error: err.message || 'Pages error' })
    }
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    try {
      const body = await readBody(req)
      const pageId = String(body.pageId || body.id || '')
        .trim()
        .toLowerCase()
      const page = await upsertPageLayout(pageId, body.layout || body, session.email)
      return json(res, 200, {
        ok: true,
        page,
        storage: isSupabaseConfigured() ? 'supabase' : 'memory',
      })
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message || 'Bad request' })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}

async function handlePagesUpload(req, res) {
  const session = requireAdmin(req, res)
  if (!session) return
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  try {
    const body = await readBody(req)
    const pageId = String(body.pageId || body.id || '')
      .trim()
      .toLowerCase()
    const result = await uploadPageAsset({
      pageId,
      dataUrl: body.dataUrl || body.data || body.image,
      filename: body.filename || body.name || 'upload',
      createdBy: session.email,
    })
    return json(res, 200, result)
  } catch (err) {
    return json(res, 400, { ok: false, error: err.message || 'Upload failed' })
  }
}

async function handleInbox(req, res) {
  const session = requireAdmin(req, res)
  if (!session) return

  if (req.method === 'GET') {
    try {
      const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`)
      const threadId = String(url.searchParams.get('id') || url.searchParams.get('threadId') || '')
        .trim()
      if (threadId) {
        const data = await getAdminThread(threadId)
        return json(res, 200, { ok: true, ...data })
      }
      const pageId = String(url.searchParams.get('pageId') || url.searchParams.get('page') || '')
        .trim()
        .toLowerCase()
      const data = await listAdminThreads({ pageId: pageId || undefined })
      return json(res, 200, { ok: true, ...data })
    } catch (err) {
      return json(res, 500, { ok: false, error: err.message || 'Inbox error' })
    }
  }

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const body = await readBody(req)
      const threadId = String(body.threadId || body.id || '').trim()
      if (!threadId) return json(res, 400, { ok: false, error: 'threadId required' })
      const action = String(body.action || 'reply').trim().toLowerCase()
      if (action === 'read') {
        const data = await markAdminRead(threadId)
        return json(res, 200, { ok: true, ...data })
      }
      if (action === 'close' || action === 'open') {
        const data = await setThreadStatus(threadId, action === 'close' ? 'closed' : 'open')
        return json(res, 200, { ok: true, ...data })
      }
      const data = await replyAsAdmin(threadId, body.body || body.message || body.text || '')
      return json(res, 200, { ok: true, ...data })
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message || 'Bad request' })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}

export default async function handler(req, res) {
  const key = routeKey(req)
  if (key === 'login') return handleLogin(req, res)
  if (key === 'login-google') return handleLoginGoogle(req, res)
  if (key === 'auth-options') return handleAuthOptions(req, res)
  if (key === 'logout') return handleLogout(req, res)
  if (key === 'session') return handleSession(req, res)
  if (key === 'ledger') return handleLedger(req, res)
  if (key === 'people') return handlePeople(req, res)
  if (key === 'codes') return handleCodes(req, res)
  if (key === 'socials') return handleSocials(req, res)
  if (key === 'pages') return handlePages(req, res)
  if (key === 'pages/upload') return handlePagesUpload(req, res)
  if (key === 'inbox') return handleInbox(req, res)
  return json(res, 404, { ok: false, error: 'Not found' })
}
