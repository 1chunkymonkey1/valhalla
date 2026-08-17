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
import {
  EXAMPLE_CODES,
  ensureStarterCodes,
  generateInvestorCode,
  investorCodesStorageLabel,
  listInvestorCodesAdmin,
  setInvestorCodeActive,
} from '../_lib/investorCodes.js'
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
  setNeedsHuman,
  setThreadStatus,
} from '../_lib/siteChat.js'
import { clientKey, rateLimit } from '../_lib/rateLimit.js'
import {
  approveDispatchItem,
  listDispatchItems,
  markDispatchSent,
  prepareSend,
  unapproveDispatchItem,
  updateDispatchItem,
} from '../_lib/dispatchStore.js'
import {
  createCouncilThread,
  getCouncilThread,
  listCouncilAgents,
  listCouncilThreads,
  postFounderMessage,
  requestAgentReply,
  runCouncilRound,
  setCouncilThreadGoal,
  setCouncilThreadStatus,
} from '../_lib/councilStore.js'
import { buildAiStatus } from '../_lib/aiStatus.js'
import { setAiSettings } from '../_lib/aiSettings.js'
import {
  actOnFounderTodo,
  createFounderTodo,
  listFounderTodos,
} from '../_lib/founderTodoStore.js'

const COMPANY_SUMMARY = [
  { id: 'wolf', name: 'Wolf', domain: 'land', pillar: 'movement', wave: 1 },
  { id: 'viking', name: 'Viking', domain: 'water', pillar: 'movement', wave: 1 },
  { id: 'eagle', name: 'Eagle', domain: 'air', pillar: 'movement', wave: 2 },
  { id: 'phenix', name: 'Phénix', domain: 'space', pillar: 'movement', wave: 2 },
  { id: 'holm', name: 'Holm', domain: 'land', pillar: 'habitation', wave: 1 },
  { id: 'atoll', name: 'Atoll', domain: 'water', pillar: 'habitation', wave: 1 },
  { id: 'olympus', name: 'Olympus', domain: 'air', pillar: 'habitation', wave: 2 },
  { id: 'aether', name: 'Aether', domain: 'space', pillar: 'habitation', wave: 2 },
  { id: 'demeter', name: 'Demeter', domain: 'land', pillar: 'energy', wave: 1 },
  { id: 'njord', name: 'Njord', domain: 'water', pillar: 'energy', wave: 1 },
  { id: 'aeolus', name: 'Aeolus', domain: 'air', pillar: 'energy', wave: 2 },
  { id: 'corvus', name: 'Corvus', domain: 'space', pillar: 'intelligence', wave: 2 },
  { id: 'meridian', name: 'Meridian', domain: 'materials', pillar: 'materials', wave: 0 },
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

async function handleInvestorCodes(req, res) {
  const session = requireAdmin(req, res)
  if (!session) return

  if (req.method === 'GET') {
    try {
      const codes = await listInvestorCodesAdmin()
      return json(res, 200, {
        ok: true,
        codes,
        examples: EXAMPLE_CODES,
        storage: investorCodesStorageLabel(),
        note: 'P = small investors, E = elephant. Editor unlock a5861 opens materials editor on /investors (docs/investor-codes.md — do not publish algorithm on /investors).',
      })
    } catch (err) {
      return json(res, 500, { ok: false, error: err.message || 'Investor codes error' })
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await readBody(req)
      const action = String(body.action || 'generate')
        .trim()
        .toLowerCase()

      if (action === 'revoke' || action === 'disable' || action === 'set-active') {
        const id = String(body.id || '').trim()
        if (!id) return json(res, 400, { ok: false, error: 'id required' })
        const active =
          action === 'set-active' ? Boolean(body.active) : action === 'revoke' || action === 'disable' ? false : true
        const row = await setInvestorCodeActive(id, active)
        return json(res, 200, { ok: true, code: row })
      }

      if (action === 'enable') {
        const id = String(body.id || '').trim()
        if (!id) return json(res, 400, { ok: false, error: 'id required' })
        const row = await setInvestorCodeActive(id, true)
        return json(res, 200, { ok: true, code: row })
      }

      if (action === 'seed' || action === 'seed-starters' || action === 'seed-starter') {
        const seeded = await ensureStarterCodes(session.email || 'admin-seed')
        const codes = await listInvestorCodesAdmin()
        return json(res, 200, {
          ok: true,
          seeded,
          codes,
          examples: EXAMPLE_CODES,
          storage: investorCodesStorageLabel(),
        })
      }

      const tier = String(body.tier || body.type || '')
        .trim()
        .toLowerCase()
      const row = await generateInvestorCode(tier, session.email || '')
      return json(res, 200, { ok: true, code: row })
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message || 'Bad request' })
    }
  }

  if (req.method === 'PATCH') {
    try {
      const body = await readBody(req)
      const id = String(body.id || '').trim()
      if (!id) return json(res, 400, { ok: false, error: 'id required' })
      const row = await setInvestorCodeActive(id, Boolean(body.active))
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
      const needsHumanOnly =
        url.searchParams.get('needsHuman') === '1' ||
        url.searchParams.get('needs_human') === '1'
      const data = await listAdminThreads({
        pageId: pageId || undefined,
        needsHumanOnly,
      })
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
      if (action === 'flag' || action === 'unflag' || action === 'needs_human') {
        const on = action === 'unflag' ? false : body.needsHuman !== false
        const data = await setNeedsHuman(threadId, on, body.reason || body.needsHumanReason || '')
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

async function handleDispatch(req, res) {
  const session = requireAdmin(req, res)
  if (!session) return

  if (req.method === 'GET') {
    try {
      const data = await listDispatchItems()
      return json(res, 200, { ok: true, ...data })
    } catch (err) {
      return json(res, 500, { ok: false, error: err.message || 'Dispatch error' })
    }
  }

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const body = await readBody(req)
      const id = String(body.id || body.itemId || '').trim()
      const action = String(body.action || 'save').trim().toLowerCase()
      if (!id) return json(res, 400, { ok: false, error: 'id required' })
      const actor = session.email

      if (action === 'save') {
        const item = await updateDispatchItem(id, body, actor)
        return json(res, 200, { ok: true, item })
      }
      if (action === 'approve') {
        const item = await approveDispatchItem(id, actor)
        return json(res, 200, { ok: true, item })
      }
      if (action === 'unapprove') {
        const item = await unapproveDispatchItem(id, actor)
        return json(res, 200, { ok: true, item })
      }
      if (action === 'send') {
        const data = await prepareSend(id)
        return json(res, 200, { ok: true, ...data })
      }
      if (action === 'mark-sent' || action === 'sent') {
        const item = await markDispatchSent(id, actor)
        return json(res, 200, { ok: true, item })
      }
      if (action === 'hold' || action === 'unhold') {
        const item = await updateDispatchItem(id, { held: action === 'hold' }, actor)
        return json(res, 200, { ok: true, item })
      }
      return json(res, 400, { ok: false, error: 'Unknown action' })
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message || 'Bad request' })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}

async function handleCouncil(req, res) {
  const session = requireAdmin(req, res)
  if (!session) return

  if (req.method === 'GET') {
    try {
      const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`)
      const view = String(url.searchParams.get('view') || '').trim().toLowerCase()
      const threadId = String(url.searchParams.get('id') || url.searchParams.get('threadId') || '').trim()

      if (view === 'agents' || (!threadId && view === '')) {
        // default list: threads + agents summary when no id
      }
      if (view === 'agents') {
        const data = await listCouncilAgents()
        return json(res, 200, { ok: true, ...data })
      }
      if (threadId) {
        const data = await getCouncilThread(threadId)
        return json(res, 200, { ok: true, ...data })
      }
      const [threads, agents] = await Promise.all([listCouncilThreads(), listCouncilAgents()])
      return json(res, 200, {
        ok: true,
        threads: threads.threads,
        agents: agents.agents,
        storage: threads.storage,
        durabilityNote: threads.durabilityNote,
        aiConfigured: threads.aiConfigured,
      })
    } catch (err) {
      return json(res, 500, { ok: false, error: err.message || 'Council error' })
    }
  }

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const body = await readBody(req)
      const action = String(body.action || 'message').trim().toLowerCase()

      if (action === 'create' || action === 'open') {
        const data = await createCouncilThread({
          agentId: body.agentId || body.agent,
          title: body.title,
          kind: body.kind || 'direct',
          goal: body.goal,
          participants: body.participants,
        })
        return json(res, 200, { ok: true, ...data })
      }

      const threadId = String(body.threadId || body.id || '').trim()
      if (!threadId && action !== 'create') {
        return json(res, 400, { ok: false, error: 'threadId required' })
      }

      if (action === 'message' || action === 'say' || action === 'chat') {
        const data = await postFounderMessage(threadId, body.body || body.message || body.text || '', {
          replyAgents: body.replyAgents !== false,
        })
        return json(res, 200, { ok: true, ...data })
      }
      if (action === 'ask' || action === 'reply') {
        const data = await requestAgentReply(
          threadId,
          body.agentId || body.agent,
          body.body || body.message || body.prompt || '',
        )
        return json(res, 200, { ok: true, ...data })
      }
      if (action === 'round' || action === 'run-round' || action === 'autonomous') {
        const data = await runCouncilRound(threadId, {
          agentIds: body.agentIds || body.agents,
          goal: body.goal,
          maxRounds: body.maxRounds || body.rounds || 1,
        })
        return json(res, 200, { ok: true, ...data })
      }
      if (action === 'goal') {
        const data = await setCouncilThreadGoal(threadId, body.goal || body.body || '')
        return json(res, 200, { ok: true, ...data })
      }
      if (action === 'close' || action === 'open-thread') {
        const data = await setCouncilThreadStatus(
          threadId,
          action === 'close' ? 'closed' : 'open',
        )
        return json(res, 200, { ok: true, ...data })
      }

      return json(res, 400, { ok: false, error: 'Unknown action' })
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message || 'Bad request' })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}

async function handleAi(req, res) {
  const session = requireAdmin(req, res)
  if (!session) return

  if (req.method === 'GET') {
    try {
      const data = await buildAiStatus()
      return json(res, 200, data)
    } catch (err) {
      return json(res, 500, { ok: false, error: err.message || 'AI status error' })
    }
  }

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const body = await readBody(req)
      const action = String(body.action || 'save').trim().toLowerCase()
      if (action !== 'save' && action !== 'set' && action !== 'update') {
        return json(res, 400, { ok: false, error: 'Unknown action' })
      }
      const settings = await setAiSettings(
        {
          provider: body.provider,
          cursorModel: body.cursorModel ?? body.cursor_model,
          chatModel: body.chatModel ?? body.chat_model,
        },
        session.email || '',
      )
      const status = await buildAiStatus()
      return json(res, 200, { ok: true, settings, ...status })
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message || 'Bad request' })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}

async function handleFounderTodo(req, res) {
  const session = requireAdmin(req, res)
  if (!session) return

  if (req.method === 'GET') {
    try {
      const data = await listFounderTodos()
      return json(res, 200, data)
    } catch (err) {
      return json(res, 500, { ok: false, error: err.message || 'Founder queue error' })
    }
  }

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const body = await readBody(req)
      const action = String(body.action || 'create').trim().toLowerCase()
      if (action === 'create') {
        const item = await createFounderTodo(body, session.email)
        return json(res, 200, { ok: true, item })
      }
      if (action === 'seed') {
        return json(res, 400, { ok: false, error: 'Sweep does not create. Standing bottlenecks are rules, not todos.' })
      }
      const id = String(body.id || '').trim()
      if (!id) return json(res, 400, { ok: false, error: 'id required' })
      const item = await actOnFounderTodo(id, action, body, session.email)
      return json(res, 200, { ok: true, item })
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
  if (key === 'investor-codes') return handleInvestorCodes(req, res)
  if (key === 'socials') return handleSocials(req, res)
  if (key === 'pages') return handlePages(req, res)
  if (key === 'pages/upload') return handlePagesUpload(req, res)
  if (key === 'inbox') return handleInbox(req, res)
  if (key === 'dispatch') return handleDispatch(req, res)
  if (key === 'council') return handleCouncil(req, res)
  if (key === 'ai') return handleAi(req, res)
  if (key === 'founder-todo' || key === 'founder-queue') return handleFounderTodo(req, res)
  return json(res, 404, { ok: false, error: 'Not found' })
}
