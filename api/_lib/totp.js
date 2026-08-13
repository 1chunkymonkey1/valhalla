import { createHmac, randomBytes } from 'node:crypto'

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function generateTotpSecret(bytes = 20) {
  const buf = randomBytes(bytes)
  let bits = ''
  for (const b of buf) bits += b.toString(2).padStart(8, '0')
  let out = ''
  for (let i = 0; i + 5 <= bits.length; i += 5) {
    out += BASE32_ALPHABET[parseInt(bits.slice(i, i + 5), 2)]
  }
  return out
}

export function base32Decode(secret) {
  const cleaned = String(secret || '')
    .toUpperCase()
    .replace(/=+$/g, '')
    .replace(/\s+/g, '')
  let bits = ''
  for (const ch of cleaned) {
    const val = BASE32_ALPHABET.indexOf(ch)
    if (val < 0) throw new Error('Invalid base32 secret')
    bits += val.toString(2).padStart(5, '0')
  }
  const bytes = []
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2))
  }
  return Buffer.from(bytes)
}

function hotp(secretBuf, counter, digits = 6) {
  const counterBuf = Buffer.alloc(8)
  counterBuf.writeBigUInt64BE(BigInt(counter))
  const hmac = createHmac('sha1', secretBuf).update(counterBuf).digest()
  const offset = hmac[hmac.length - 1] & 0xf
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)
  return String(code % 10 ** digits).padStart(digits, '0')
}

/** RFC 6238 TOTP with ±1 step window (30s). */
export function verifyTotp(token, secret, { step = 30, window = 1, digits = 6 } = {}) {
  if (!token || !secret) return false
  const cleaned = String(token).replace(/\s+/g, '')
  if (!/^\d{6}$/.test(cleaned)) return false
  let secretBuf
  try {
    secretBuf = base32Decode(secret)
  } catch {
    return false
  }
  const counter = Math.floor(Date.now() / 1000 / step)
  for (let w = -window; w <= window; w++) {
    if (hotp(secretBuf, counter + w, digits) === cleaned) return true
  }
  return false
}

export function otpauthUrl({ secret, email, issuer = 'Valhalla Admin' }) {
  const label = encodeURIComponent(`${issuer}:${email}`)
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: 'SHA1',
    digits: '6',
    period: '30',
  })
  return `otpauth://totp/${label}?${params.toString()}`
}
