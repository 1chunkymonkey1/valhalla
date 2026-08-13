/**
 * Public hub endpoints (unlock codes, status, socials).
 * Single Hobby-plan function for /api/hub/*.
 */
import { json, readBody } from '../_lib/auth.js'
import { clientKey, rateLimit } from '../_lib/rateLimit.js'
import {
  WAVE2_HALLS,
  getHallCode,
  isWave2Hall,
  listHallCodesAdmin,
  parseUnlockCookie,
  publicCodeStatus,
  setUnlockCookie,
  verifyHallCode,
} from '../_lib/hallCodes.js'
import { listCompanySocials, toPublicSocial } from '../_lib/companySocials.js'
import { isSupabaseConfigured } from '../_lib/supabase.js'

function routeKey(req) {
  const slug = req.query?.slug
  if (Array.isArray(slug)) return slug.filter(Boolean).join('/')
  if (typeof slug === 'string' && slug) return slug
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`)
  return url.pathname.replace(/^\/api\/hub\/?/, '').replace(/\/$/, '')
}

async function handleStatus(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  try {
    const unlocked = parseUnlockCookie(req)
    const adminRows = await listHallCodesAdmin()
    const codes = publicCodeStatus(adminRows, unlocked)
    const nextHall = WAVE2_HALLS.find((id) => !unlocked.includes(id)) || null
    return json(res, 200, {
      ok: true,
      unlocked,
      codes,
      nextHall,
      wave2Halls: WAVE2_HALLS,
      storage: isSupabaseConfigured() ? 'supabase' : 'memory',
    })
  } catch (err) {
    return json(res, 500, { ok: false, error: err.message || 'Status error' })
  }
}

async function handleUnlock(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  const rl = rateLimit(clientKey(req, 'hub-unlock'), { limit: 30, windowMs: 15 * 60 * 1000 })
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfterSec))
    return json(res, 429, { ok: false, error: 'Too many attempts. Try again later.' })
  }

  try {
    const body = await readBody(req)
    const hallId = String(body.hall || body.hallId || '')
      .trim()
      .toLowerCase()
    if (!isWave2Hall(hallId)) {
      return json(res, 400, { ok: false, error: 'Unknown wave-2 hall' })
    }

    const unlocked = parseUnlockCookie(req)
    const idx = WAVE2_HALLS.indexOf(hallId)
    for (let i = 0; i < idx; i += 1) {
      if (!unlocked.includes(WAVE2_HALLS[i])) {
        return json(res, 403, {
          ok: false,
          error: `Unlock ${WAVE2_HALLS[i]} first`,
        })
      }
    }

    if (unlocked.includes(hallId)) {
      return json(res, 200, { ok: true, hallId, unlocked, already: true })
    }

    const configured = await getHallCode(hallId)
    if (!configured) {
      return json(res, 503, {
        ok: false,
        error: 'Code not published yet. Check Instagram or try again soon.',
      })
    }

    const result = await verifyHallCode(hallId, body.code)
    if (!result.ok) {
      return json(res, 401, { ok: false, error: result.error })
    }

    const next = [...unlocked, hallId]
    try {
      setUnlockCookie(res, next)
    } catch {
      // Cookie signing needs ADMIN_SESSION_SECRET; client still mirrors via localStorage
    }
    return json(res, 200, { ok: true, hallId, unlocked: next })
  } catch (err) {
    return json(res, 400, { ok: false, error: err.message || 'Bad request' })
  }
}

async function handleSocials(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  try {
    const rows = await listCompanySocials()
    return json(res, 200, {
      ok: true,
      socials: rows.map(toPublicSocial).filter((r) => r && (r.linkedin || r.instagram || r.x || r.discord)),
    })
  } catch (err) {
    return json(res, 500, { ok: false, error: err.message || 'Socials error' })
  }
}

export default async function handler(req, res) {
  const key = routeKey(req)
  if (key === 'status' || key === 'unlocks') return handleStatus(req, res)
  if (key === 'unlock') return handleUnlock(req, res)
  if (key === 'socials') return handleSocials(req, res)
  return json(res, 404, { ok: false, error: 'Not found' })
}
