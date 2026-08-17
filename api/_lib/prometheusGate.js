import { createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE = 'vh_prometheus'
const COOKIE_TTL_MS = 12 * 60 * 60 * 1000
const HANDOFF_TTL_MS = 5 * 60 * 1000

function gateCode() {
  return String(process.env.PROMETHEUS_GATE_CODE || 'f451').trim().toLowerCase()
}

function secret() {
  return (
    process.env.PROMETHEUS_HANDOFF_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    'prometheus-kenaz-local'
  )
}

export function prometheusSiteUrl() {
  return String(process.env.PROMETHEUS_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
}

function b64url(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function fromB64url(input) {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((input.length + 3) % 4)
  return Buffer.from(padded, 'base64')
}

export function codesMatch(input) {
  const a = Buffer.from(String(input || '').trim().toLowerCase())
  const b = Buffer.from(gateCode())
  if (a.length !== b.length) {
    timingSafeEqual(b, b)
    return false
  }
  return timingSafeEqual(a, b)
}

function sign(prefix, payload) {
  const body = b64url(JSON.stringify(payload))
  const sig = createHmac('sha256', secret()).update(`${prefix}:${body}`).digest()
  return `${body}.${b64url(sig)}`
}

function verify(prefix, token) {
  if (!token || !token.includes('.')) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expected = b64url(createHmac('sha256', secret()).update(`${prefix}:${body}`).digest())
  const left = Buffer.from(sig)
  const right = Buffer.from(expected)
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null
  try {
    const payload = JSON.parse(fromB64url(body).toString('utf8'))
    if (!payload?.exp || Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export function signHandoff() {
  return sign('handoff', { sub: 'prometheus', iat: Date.now(), exp: Date.now() + HANDOFF_TTL_MS })
}

export function signPrometheusCookie() {
  return sign('vh-prom', { sub: 'prometheus', iat: Date.now(), exp: Date.now() + COOKIE_TTL_MS })
}

export function parsePrometheusCookie(req) {
  const header = req.headers?.cookie || ''
  const hit = header.split(';').map((p) => p.trim()).find((p) => p.startsWith(`${COOKIE}=`))
  if (!hit) return null
  const token = decodeURIComponent(hit.slice(COOKIE.length + 1))
  return verify('vh-prom', token)
}

function appendCookie(res, value) {
  const prev = res.getHeader?.('Set-Cookie')
  if (!prev) res.setHeader('Set-Cookie', value)
  else if (Array.isArray(prev)) res.setHeader('Set-Cookie', [...prev, value])
  else res.setHeader('Set-Cookie', [prev, value])
}

function cookieFlags() {
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  const parts = ['Path=/', 'HttpOnly', 'SameSite=Lax']
  if (secure) parts.push('Secure')
  return parts
}

export function setPrometheusCookie(res) {
  const token = signPrometheusCookie()
  appendCookie(
    res,
    [`${COOKIE}=${encodeURIComponent(token)}`, `Max-Age=${Math.floor(COOKIE_TTL_MS / 1000)}`, ...cookieFlags()].join(
      '; ',
    ),
  )
}

export function clearPrometheusCookie(res) {
  appendCookie(res, [`${COOKIE}=`, 'Max-Age=0', ...cookieFlags()].join('; '))
}

export function prometheusRedirectUrl() {
  return `${prometheusSiteUrl()}/enter?token=${encodeURIComponent(signHandoff())}`
}
