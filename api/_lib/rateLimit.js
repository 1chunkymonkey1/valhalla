/**
 * Simple in-memory rate limiter (per serverless instance).
 * Good enough to slow credential stuffing / code guessing on Hobby.
 */

const bags = new Map()

export function rateLimit(key, { limit = 20, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now()
  let entry = bags.get(key)
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs }
    bags.set(key, entry)
  }
  entry.count += 1
  if (entry.count > limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    }
  }
  return { ok: true, remaining: limit - entry.count }
}

export function clientKey(req, suffix = '') {
  const xf = req.headers['x-forwarded-for']
  const ip = (typeof xf === 'string' ? xf.split(',')[0] : '') || req.socket?.remoteAddress || 'unknown'
  return `${ip.trim()}:${suffix}`
}
