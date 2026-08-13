import { createHmac, timingSafeEqual, scryptSync, randomBytes } from 'node:crypto'
import { verifyTotp } from './totp.js'

export const ADMIN_EMAIL = 'info@valhallaco.org'
const COOKIE_NAME = 'vh_admin_session'
const SESSION_TTL_MS = 12 * 60 * 60 * 1000

export function getTotpSecret() {
  return (process.env.ADMIN_TOTP_SECRET || '').trim()
}

export function isTotpConfigured() {
  return getTotpSecret().length >= 16
}

export function verifyAdminTotp(code) {
  return verifyTotp(code, getTotpSecret())
}

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''
}

export function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

export function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch {
        reject(new Error('Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
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

export function signSession(payload) {
  const secret = getSecret()
  if (!secret) throw new Error('ADMIN_SESSION_SECRET (or ADMIN_PASSWORD) not configured')
  const body = b64url(JSON.stringify(payload))
  const sig = createHmac('sha256', secret).update(body).digest()
  return `${body}.${b64url(sig)}`
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null
  const secret = getSecret()
  if (!secret) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expected = createHmac('sha256', secret).update(body).digest()
  let given
  try {
    given = fromB64url(sig)
  } catch {
    return null
  }
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  try {
    const payload = JSON.parse(fromB64url(body).toString('utf8'))
    if (!payload?.exp || Date.now() > payload.exp) return null
    if (payload.email !== ADMIN_EMAIL) return null
    return payload
  } catch {
    return null
  }
}

export function parseCookies(req) {
  const header = req.headers.cookie || ''
  const out = {}
  for (const part of header.split(';')) {
    const i = part.indexOf('=')
    if (i < 0) continue
    const k = part.slice(0, i).trim()
    const v = part.slice(i + 1).trim()
    out[k] = decodeURIComponent(v)
  }
  return out
}

export function getSession(req) {
  const cookies = parseCookies(req)
  return verifySessionToken(cookies[COOKIE_NAME])
}

export function setSessionCookie(res, token) {
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
  ]
  if (secure) parts.push('Secure')
  res.setHeader('Set-Cookie', parts.join('; '))
}

export function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  const parts = [`${COOKIE_NAME}=`, 'Path=/', 'HttpOnly', 'SameSite=Strict', 'Max-Age=0']
  if (secure) parts.push('Secure')
  res.setHeader('Set-Cookie', parts.join('; '))
}

export function createSessionPayload(email) {
  return {
    email,
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_MS,
  }
}

/** Verify password against ADMIN_PASSWORD or ADMIN_PASSWORD_HASH (salt:hash scrypt). */
export function verifyPassword(password) {
  if (!password || typeof password !== 'string') return false

  const plain = process.env.ADMIN_PASSWORD
  if (plain) {
    const a = Buffer.from(password)
    const b = Buffer.from(plain)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  }

  const stored = process.env.ADMIN_PASSWORD_HASH
  if (!stored || !stored.includes(':')) return false
  const [salt, hashHex] = stored.split(':')
  if (!salt || !hashHex) return false
  const derived = scryptSync(password, salt, 64)
  const expected = Buffer.from(hashHex, 'hex')
  if (derived.length !== expected.length) return false
  return timingSafeEqual(derived, expected)
}

/** Helper for operators — never commit the output. */
export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function requireAdmin(req, res) {
  const session = getSession(req)
  if (!session) {
    json(res, 401, { ok: false, error: 'Unauthorized' })
    return null
  }
  return session
}

/* —— Team sessions (separate cookie from founder admin TOTP) —— */
const TEAM_COOKIE = 'vh_team_session'
const TEAM_TTL_MS = 14 * 24 * 60 * 60 * 1000

export function signTeamSession(payload) {
  const secret = getSecret()
  if (!secret) throw new Error('ADMIN_SESSION_SECRET not configured')
  const body = b64url(JSON.stringify(payload))
  const sig = createHmac('sha256', secret).update(`team:${body}`).digest()
  return `${body}.${b64url(sig)}`
}

export function verifyTeamToken(token) {
  if (!token || typeof token !== 'string') return null
  const secret = getSecret()
  if (!secret) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expected = createHmac('sha256', secret).update(`team:${body}`).digest()
  let given
  try {
    given = fromB64url(sig)
  } catch {
    return null
  }
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  try {
    const payload = JSON.parse(fromB64url(body).toString('utf8'))
    if (!payload?.exp || Date.now() > payload.exp) return null
    if (!payload.email || !payload.role) return null
    return payload
  } catch {
    return null
  }
}

export function getTeamSession(req) {
  const cookies = parseCookies(req)
  return verifyTeamToken(cookies[TEAM_COOKIE])
}

export function setTeamSessionCookie(res, token) {
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  const parts = [
    `${TEAM_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${Math.floor(TEAM_TTL_MS / 1000)}`,
  ]
  if (secure) parts.push('Secure')
  res.setHeader('Set-Cookie', parts.join('; '))
}

export function clearTeamSessionCookie(res) {
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  const parts = [`${TEAM_COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Strict', 'Max-Age=0']
  if (secure) parts.push('Secure')
  res.setHeader('Set-Cookie', parts.join('; '))
}

export function createTeamSessionPayload(user) {
  return {
    kind: 'team',
    email: user.email,
    name: user.name,
    role: user.role,
    halls: user.halls || [],
    iat: Date.now(),
    exp: Date.now() + TEAM_TTL_MS,
  }
}

export function requireTeam(req, res) {
  const session = getTeamSession(req)
  if (!session) {
    json(res, 401, { ok: false, error: 'Unauthorized' })
    return null
  }
  return session
}

/** Founder admin OR team super_admin may manage people. */
export function requirePeopleAdmin(req, res) {
  const admin = getSession(req)
  if (admin) return { ...admin, kind: 'admin' }
  const team = getTeamSession(req)
  if (team?.role === 'super_admin') return { ...team, kind: 'team' }
  json(res, 401, { ok: false, error: 'Unauthorized' })
  return null
}
