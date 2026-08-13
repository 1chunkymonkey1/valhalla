import {
  ADMIN_EMAIL,
  createSessionPayload,
  json,
  readBody,
  setSessionCookie,
  signSession,
  verifyPassword,
} from '../_lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  if (!process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH) {
    return json(res, 503, {
      ok: false,
      error: 'Admin auth not configured. Set ADMIN_PASSWORD or ADMIN_PASSWORD_HASH on Vercel.',
    })
  }

  try {
    const body = await readBody(req)
    const email = String(body.email || '')
      .trim()
      .toLowerCase()
    const password = String(body.password || '')

    if (email !== ADMIN_EMAIL) {
      return json(res, 401, { ok: false, error: 'Invalid credentials' })
    }
    if (!verifyPassword(password)) {
      return json(res, 401, { ok: false, error: 'Invalid credentials' })
    }

    const token = signSession(createSessionPayload(ADMIN_EMAIL))
    setSessionCookie(res, token)
    return json(res, 200, { ok: true, email: ADMIN_EMAIL })
  } catch {
    return json(res, 400, { ok: false, error: 'Bad request' })
  }
}
