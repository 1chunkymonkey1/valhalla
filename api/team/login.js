import {
  createTeamSessionPayload,
  json,
  readBody,
  setTeamSessionCookie,
  signTeamSession,
} from '../_lib/auth.js'
import { getUserByEmail, logActivity, verifyPasswordHash } from '../_lib/empireStore.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  if (!process.env.ADMIN_SESSION_SECRET && !process.env.ADMIN_PASSWORD) {
    return json(res, 503, {
      ok: false,
      error: 'Team auth not configured. Set ADMIN_SESSION_SECRET on Vercel.',
    })
  }

  try {
    const body = await readBody(req)
    const email = String(body.email || '')
      .trim()
      .toLowerCase()
    const password = String(body.password || '')
    const user = await getUserByEmail(email)
    if (!user || !user.active || !user.passwordHash) {
      return json(res, 401, { ok: false, error: 'Invalid email or password' })
    }
    if (!verifyPasswordHash(password, user.passwordHash)) {
      return json(res, 401, { ok: false, error: 'Invalid email or password' })
    }
    const token = signTeamSession(createTeamSessionPayload(user))
    setTeamSessionCookie(res, token)
    await logActivity({ type: 'team_login', actor: user.email, role: user.role })
    return json(res, 200, {
      ok: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        halls: user.halls,
      },
    })
  } catch (err) {
    return json(res, 400, { ok: false, error: err.message || 'Bad request' })
  }
}
