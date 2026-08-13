import { json, readBody } from './_lib/auth.js'
import { addSignup } from './_lib/store.js'
import { clientKey, rateLimit } from './_lib/rateLimit.js'
import { plainText } from './_lib/sanitize.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  const rl = rateLimit(clientKey(req, 'signup'), { limit: 40, windowMs: 60 * 60 * 1000 })
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfterSec))
    return json(res, 429, { ok: false, error: 'Too many signups from this network. Try later.' })
  }

  try {
    const body = await readBody(req)
    const email = String(body.email || '')
      .trim()
      .toLowerCase()
    if (!email || !email.includes('@') || email.length > 254) {
      return json(res, 400, { ok: false, error: 'Valid email required' })
    }

    const row = await addSignup({
      email,
      name: plainText(body.name || '', 120) || null,
      audience: plainText(body.audience || 'general', 64) || 'general',
      source: plainText(body.source || 'hub', 64) || 'hub',
      companyId: body.companyId ? plainText(body.companyId, 32) : null,
    })

    return json(res, 200, { ok: true, id: row.id })
  } catch (err) {
    return json(res, 400, { ok: false, error: err.message || 'Bad request' })
  }
}
