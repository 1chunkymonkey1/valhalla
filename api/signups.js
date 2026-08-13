import { json, readBody } from './_lib/auth.js'
import { addSignup } from './_lib/store.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  try {
    const body = await readBody(req)
    const email = String(body.email || '')
      .trim()
      .toLowerCase()
    if (!email || !email.includes('@')) {
      return json(res, 400, { ok: false, error: 'Valid email required' })
    }

    const row = addSignup({
      email,
      name: String(body.name || '').trim() || null,
      audience: String(body.audience || 'general').trim(),
      source: String(body.source || 'hub').trim(),
      companyId: body.companyId || null,
    })

    return json(res, 200, { ok: true, id: row.id })
  } catch {
    return json(res, 400, { ok: false, error: 'Bad request' })
  }
}
