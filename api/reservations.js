import { json, readBody } from './_lib/auth.js'
import { addReservation } from './_lib/store.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  try {
    const body = await readBody(req)
    const email = String(body.email || '')
      .trim()
      .toLowerCase()
    const companyId = String(body.companyId || '').trim()
    if (!email || !companyId) {
      return json(res, 400, { ok: false, error: 'email and companyId required' })
    }

    const row = await addReservation({
      companyId,
      companyName: body.companyName || companyId,
      product: body.product || null,
      name: String(body.name || '').trim(),
      email,
      phone: String(body.phone || '').trim() || null,
      zip: String(body.zip || '').trim() || null,
      interestGroup: body.interestGroup || null,
      reservationType: 'fully_refundable',
      refundable: true,
      paymentCaptured: Boolean(body.paymentCaptured),
      payLinkId: body.payLinkId || null,
      amountEstimateUsd: body.amountEstimateUsd || null,
      status: body.status || 'held_refundable',
      submittedAt: body.submittedAt || new Date().toISOString(),
    })

    return json(res, 200, { ok: true, id: row.id })
  } catch (err) {
    return json(res, 400, { ok: false, error: err.message || 'Bad request' })
  }
}
