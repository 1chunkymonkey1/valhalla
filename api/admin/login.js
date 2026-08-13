import {
  ADMIN_EMAIL,
  createSessionPayload,
  isTotpConfigured,
  json,
  readBody,
  setSessionCookie,
  signSession,
  verifyAdminTotp,
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

  if (!isTotpConfigured()) {
    return json(res, 503, {
      ok: false,
      error:
        '2FA required but ADMIN_TOTP_SECRET is not set. Generate a secret (npm run admin:totp), add it on Vercel, then redeploy.',
    })
  }

  try {
    const body = await readBody(req)
    const email = String(body.email || '')
      .trim()
      .toLowerCase()
    const password = String(body.password || '')
    const totp = String(body.totp || body.code || '')

    if (email !== ADMIN_EMAIL) {
      return json(res, 401, { ok: false, error: 'Invalid credentials' })
    }
    if (!verifyPassword(password)) {
      return json(res, 401, { ok: false, error: 'Invalid credentials' })
    }
    if (!verifyAdminTotp(totp)) {
      return json(res, 401, { ok: false, error: 'Invalid authenticator code' })
    }

    const token = signSession(createSessionPayload(ADMIN_EMAIL))
    setSessionCookie(res, token)
    return json(res, 200, { ok: true, email: ADMIN_EMAIL })
  } catch {
    return json(res, 400, { ok: false, error: 'Bad request' })
  }
}
