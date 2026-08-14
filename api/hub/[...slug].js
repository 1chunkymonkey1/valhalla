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
import { getPublishedPageLayout, isValidPageId } from '../_lib/pageLayouts.js'
import { isSupabaseConfigured } from '../_lib/supabase.js'
import {
  getVisitorThread,
  markVisitorRead,
  newVisitorToken,
  startOrContinueThread,
} from '../_lib/siteChat.js'
import {
  clearInvestorCookie,
  parseInvestorCookie,
  redeemInvestorCode,
  setInvestorCookie,
  investorCodesStorageLabel,
} from '../_lib/investorCodes.js'

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

async function handlePage(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  try {
    const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`)
    const pageId = String(url.searchParams.get('id') || '')
      .trim()
      .toLowerCase()
    if (!isValidPageId(pageId)) {
      return json(res, 400, { ok: false, error: 'Unknown page id' })
    }
    const page = await getPublishedPageLayout(pageId)
    return json(res, 200, {
      ok: true,
      page,
      storage: isSupabaseConfigured() ? 'supabase' : 'memory',
    })
  } catch (err) {
    return json(res, 500, { ok: false, error: err.message || 'Page error' })
  }
}

async function handleChat(req, res) {
  if (req.method === 'GET') {
    try {
      const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`)
      const threadId = String(url.searchParams.get('threadId') || url.searchParams.get('id') || '')
        .trim()
      const token = String(url.searchParams.get('token') || '').trim()
      if (!threadId || !token) {
        return json(res, 400, { ok: false, error: 'threadId and token required' })
      }
      const data = await getVisitorThread(threadId, token)
      return json(res, 200, { ok: true, ...data })
    } catch (err) {
      return json(res, 404, { ok: false, error: err.message || 'Not found' })
    }
  }

  if (req.method === 'POST') {
    const rl = rateLimit(clientKey(req, 'hub-chat'), { limit: 40, windowMs: 15 * 60 * 1000 })
    if (!rl.ok) {
      res.setHeader('Retry-After', String(rl.retryAfterSec))
      return json(res, 429, { ok: false, error: 'Too many messages. Try again later.' })
    }
    try {
      const body = await readBody(req)
      const action = String(body.action || 'send').trim().toLowerCase()
      if (action === 'token') {
        return json(res, 200, { ok: true, visitorToken: newVisitorToken() })
      }
      if (action === 'read') {
        const threadId = String(body.threadId || '').trim()
        const token = String(body.visitorToken || body.token || '').trim()
        const data = await markVisitorRead(threadId, token)
        return json(res, 200, { ok: true, ...data })
      }
      let visitorToken = String(body.visitorToken || body.token || '').trim()
      if (!visitorToken) visitorToken = newVisitorToken()
      const data = await startOrContinueThread({
        pageId: String(body.pageId || body.page || body.hall || '')
          .trim()
          .toLowerCase(),
        visitorToken,
        threadId: body.threadId ? String(body.threadId).trim() : '',
        visitorName: body.name || body.visitorName || '',
        visitorEmail: body.email || body.visitorEmail || '',
        body: body.body || body.message || body.text || '',
        isTest: Boolean(body.test || body.isTest),
        skipAi: Boolean(body.skipAi),
      })
      return json(res, 200, { ok: true, ...data })
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message || 'Bad request' })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}

async function handleInvestorCode(req, res) {
  if (req.method === 'GET') {
    const session = parseInvestorCookie(req)
    return json(res, 200, {
      ok: true,
      unlocked: Boolean(session),
      tier: session?.tier || null,
      storage: investorCodesStorageLabel(),
    })
  }

  if (req.method === 'POST') {
    const rl = rateLimit(clientKey(req, 'hub-investor'), { limit: 20, windowMs: 15 * 60 * 1000 })
    if (!rl.ok) {
      res.setHeader('Retry-After', String(rl.retryAfterSec))
      return json(res, 429, { ok: false, error: 'Too many attempts. Try again later.' })
    }

    try {
      const body = await readBody(req)
      const action = String(body.action || 'redeem')
        .trim()
        .toLowerCase()

      if (action === 'lock' || action === 'logout' || action === 'clear') {
        clearInvestorCookie(res)
        return json(res, 200, { ok: true, unlocked: false })
      }

      const result = await redeemInvestorCode(body.code, body.note || body.redeemerNote || '')
      if (!result.ok) {
        return json(res, 401, { ok: false, error: result.error })
      }

      try {
        setInvestorCookie(res, {
          tier: result.tier,
          sequence: result.sequence,
          code: result.code,
        })
      } catch (err) {
        return json(res, 503, {
          ok: false,
          error:
            err?.message?.includes('ADMIN_SESSION_SECRET')
              ? 'Server misconfigured: ADMIN_SESSION_SECRET (or ADMIN_PASSWORD) required to unlock.'
              : 'Could not create investor session cookie.',
        })
      }

      return json(res, 200, {
        ok: true,
        unlocked: true,
        tier: result.tier,
      })
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message || 'Bad request' })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}

export default async function handler(req, res) {
  const key = routeKey(req)
  if (key === 'status' || key === 'unlocks') return handleStatus(req, res)
  if (key === 'unlock') return handleUnlock(req, res)
  if (key === 'investor-code' || key === 'investor-codes') return handleInvestorCode(req, res)
  if (key === 'socials') return handleSocials(req, res)
  if (key === 'page') return handlePage(req, res)
  if (key === 'chat') return handleChat(req, res)
  return json(res, 404, { ok: false, error: 'Not found' })
}

export const config = {
  maxDuration: 20,
}
