/**
 * Single Hobby-plan serverless function for all /api/admin/* routes.
 * (Vercel Hobby allows max 12 functions per deployment.)
 */
import {
  ADMIN_EMAIL,
  clearSessionCookie,
  createSessionPayload,
  getSession,
  isTotpConfigured,
  json,
  readBody,
  requireAdmin,
  requirePeopleAdmin,
  setSessionCookie,
  signSession,
  verifyAdminTotp,
  verifyPassword,
} from '../_lib/auth.js'
import { isSupabaseConfigured } from '../_lib/supabase.js'
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
  { id: 'demeter', name: 'Demeter', domain: 'land', pillar: 'energy', wave: 1 },
  { id: 'njord', name: 'Njord', domain: 'water', pillar: 'energy', wave: 1 },
  { id: 'aeolus', name: 'Aeolus', domain: 'air', pillar: 'energy', wave: 2 },
  { id: 'corvus', name: 'Corvus', domain: 'space', pillar: 'energy', wave: 2 },
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

    if (email !== ADMIN_EMAIL) {
      return json(res, 401, { ok: false, error: 'Invalid credentials' })
    }
    if (!verifyPassword(password)) {
      return json(res, 401, { ok: false, error: 'Invalid credentials' })
    }
    if (!verifyAdminTotp(totp)) {
      return json(res, 401, { ok: false, error: 'Invalid authenticator code' })
    }

    const token = signSession(createSessionPayload(ADMIN_EMAIL))
    setSessionCookie(res, token)
    return json(res, 200, { ok: true, email: ADMIN_EMAIL })
  } catch {
    return json(res, 400, { ok: false, error: 'Bad request' })
  }
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

export default async function handler(req, res) {
  const key = routeKey(req)
  if (key === 'login') return handleLogin(req, res)
  if (key === 'logout') return handleLogout(req, res)
  if (key === 'session') return handleSession(req, res)
  if (key === 'ledger') return handleLedger(req, res)
  if (key === 'people') return handlePeople(req, res)
  if (key === 'codes') return handleCodes(req, res)
  if (key === 'socials') return handleSocials(req, res)
  return json(res, 404, { ok: false, error: 'Not found' })
}
