import { json, readBody } from './_lib/auth.js'
import { addReservation } from './_lib/store.js'
import { clientKey, rateLimit } from './_lib/rateLimit.js'
import { plainText } from './_lib/sanitize.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  const rl = rateLimit(clientKey(req, 'reservation'), { limit: 30, windowMs: 60 * 60 * 1000 })
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfterSec))
    return json(res, 429, { ok: false, error: 'Too many reservations from this network. Try later.' })
  }

  try {
    const body = await readBody(req)
    const email = String(body.email || '')
      .trim()
      .toLowerCase()
    const companyId = plainText(body.companyId || '', 32)
    if (!email || !email.includes('@') || email.length > 254 || !companyId) {
      return json(res, 400, { ok: false, error: 'email and companyId required' })
    }

    const row = await addReservation({
      companyId,
      companyName: plainText(body.companyName || companyId, 80),
      product: body.product ? plainText(body.product, 120) : null,
      name: plainText(body.name || '', 120),
      email,
      phone: plainText(body.phone || '', 40) || null,
      zip: plainText(body.zip || '', 20) || null,
      interestGroup: body.interestGroup ? plainText(body.interestGroup, 120) : null,
      reservationType: 'fully_refundable',
      refundable: true,
      paymentCaptured: Boolean(body.paymentCaptured),
      payLinkId: body.payLinkId ? plainText(body.payLinkId, 120) : null,
      amountEstimateUsd: body.amountEstimateUsd || null,
      status: body.status ? plainText(body.status, 64) : 'held_refundable',
      submittedAt: body.submittedAt || new Date().toISOString(),
    })

    return json(res, 200, { ok: true, id: row.id })
  } catch (err) {
    return json(res, 400, { ok: false, error: err.message || 'Bad request' })
  }
}
