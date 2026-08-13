/**
 * Wave-2 Instagram hall unlock codes.
 * Prefer Supabase hall_codes; fall back to HALL_CODE_<HALL> env vars.
 */

import { createHmac, timingSafeEqual } from 'node:crypto'
import { getSupabase, isSupabaseConfigured } from './supabase.js'

export const WAVE2_HALLS = ['eagle', 'olympus', 'aeolus', 'phenix', 'aether', 'corvus']

const UNLOCK_COOKIE = 'vh_hall_unlocks'
const UNLOCK_TTL_MS = 30 * 24 * 60 * 60 * 1000

function mem() {
  const g = globalThis
  if (!g.__vhHallCodes) g.__vhHallCodes = {}
  return g.__vhHallCodes
}

function normalizeCode(code) {
  return String(code || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
}

function envCode(hallId) {
  const key = `HALL_CODE_${String(hallId).toUpperCase()}`
  const raw = process.env[key]
  return raw ? normalizeCode(raw) : ''
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''
}

function b64url(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function fromB64url(str) {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4))
  const s = str.replace(/-/g, '+').replace(/_/g, '/') + pad
  return Buffer.from(s, 'base64')
}

export function isWave2Hall(hallId) {
  return WAVE2_HALLS.includes(hallId)
}

export async function getHallCode(hallId) {
  if (!isWave2Hall(hallId)) return null

  if (isSupabaseConfigured()) {
    try {
      const sb = getSupabase()
      const { data, error } = await sb
        .from('hall_codes')
        .select('hall_id, code')
        .eq('hall_id', hallId)
        .maybeSingle()
      if (!error && data?.code) return normalizeCode(data.code)
    } catch {
      // fall through to env / memory
    }
  } else {
    const fromMem = mem()[hallId]
    if (fromMem) return normalizeCode(fromMem)
  }

  const fromEnv = envCode(hallId)
  return fromEnv || null
}

export async function listHallCodesAdmin() {
  const rows = []
  for (const hallId of WAVE2_HALLS) {
    let code = null
    let source = 'unset'

    if (isSupabaseConfigured()) {
      const sb = getSupabase()
      const { data } = await sb
        .from('hall_codes')
        .select('hall_id, code, updated_at, note')
        .eq('hall_id', hallId)
        .maybeSingle()
      if (data?.code) {
        code = normalizeCode(data.code)
        source = 'supabase'
        rows.push({
          hallId,
          code,
          note: data.note || '',
          updatedAt: data.updated_at || null,
          source,
          configured: true,
        })
        continue
      }
    } else if (mem()[hallId]) {
      code = normalizeCode(mem()[hallId])
      source = 'memory'
    }

    if (!code) {
      const fromEnv = envCode(hallId)
      if (fromEnv) {
        code = fromEnv
        source = 'env'
      }
    }

    rows.push({
      hallId,
      code: code || '',
      note: '',
      updatedAt: null,
      source: code ? source : 'unset',
      configured: Boolean(code),
    })
  }
  return rows
}

export async function setHallCode(hallId, code, note = '') {
  if (!isWave2Hall(hallId)) throw new Error('Not a wave-2 hall')
  const normalized = normalizeCode(code)
  if (!normalized || normalized.length < 4) {
    throw new Error('Code must be at least 4 characters')
  }
  if (normalized.length > 64) throw new Error('Code too long')

  if (!isSupabaseConfigured()) {
    mem()[hallId] = normalized
    return { hallId, code: normalized, source: 'memory', configured: true }
  }

  const sb = getSupabase()
  const payload = {
    hall_id: hallId,
    code: normalized,
    note: String(note || '').slice(0, 280),
    updated_at: new Date().toISOString(),
  }
  const { error } = await sb.from('hall_codes').upsert(payload, { onConflict: 'hall_id' })
  if (error) throw error
  return { hallId, code: normalized, source: 'supabase', configured: true }
}

export async function verifyHallCode(hallId, attempt) {
  const expected = await getHallCode(hallId)
  if (!expected) return { ok: false, error: 'Code not configured for this hall yet' }
  const given = normalizeCode(attempt)
  if (!given) return { ok: false, error: 'Enter a code' }
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, error: 'Wrong code' }
  }
  return { ok: true }
}

export function parseUnlockCookie(req) {
  const header = req.headers.cookie || ''
  let raw = ''
  for (const part of header.split(';')) {
    const i = part.indexOf('=')
    if (i < 0) continue
    const k = part.slice(0, i).trim()
    if (k === UNLOCK_COOKIE) {
      raw = decodeURIComponent(part.slice(i + 1).trim())
      break
    }
  }
  if (!raw) return []
  const secret = sessionSecret()
  if (!secret) return []
  const [body, sig] = raw.split('.')
  if (!body || !sig) return []
  const expected = createHmac('sha256', secret).update(`unlock:${body}`).digest()
  let given
  try {
    given = fromB64url(sig)
  } catch {
    return []
  }
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return []
  try {
    const payload = JSON.parse(fromB64url(body).toString('utf8'))
    if (!payload?.exp || Date.now() > payload.exp) return []
    const halls = Array.isArray(payload.halls) ? payload.halls : []
    return halls.filter((h) => isWave2Hall(h))
  } catch {
    return []
  }
}

export function signUnlockCookie(halls) {
  const secret = sessionSecret()
  if (!secret) throw new Error('ADMIN_SESSION_SECRET not configured')
  const unique = [...new Set(halls.filter(isWave2Hall))]
  const payload = {
    halls: unique,
    iat: Date.now(),
    exp: Date.now() + UNLOCK_TTL_MS,
  }
  const body = b64url(JSON.stringify(payload))
  const sig = createHmac('sha256', secret).update(`unlock:${body}`).digest()
  return `${body}.${b64url(sig)}`
}

export function setUnlockCookie(res, halls) {
  const token = signUnlockCookie(halls)
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  const parts = [
    `${UNLOCK_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.floor(UNLOCK_TTL_MS / 1000)}`,
  ]
  if (secure) parts.push('Secure')
  const prev = res.getHeader?.('Set-Cookie')
  if (!prev) {
    res.setHeader('Set-Cookie', parts.join('; '))
  } else if (Array.isArray(prev)) {
    res.setHeader('Set-Cookie', [...prev, parts.join('; ')])
  } else {
    res.setHeader('Set-Cookie', [prev, parts.join('; ')])
  }
}

export function publicCodeStatus(adminRows, unlocked) {
  const unlockedSet = new Set(unlocked)
  return WAVE2_HALLS.map((hallId) => {
    const row = adminRows.find((r) => r.hallId === hallId)
    return {
      hallId,
      configured: Boolean(row?.configured),
      unlocked: unlockedSet.has(hallId),
    }
  })
}
