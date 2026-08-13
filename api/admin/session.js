import { getSession, json } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  const session = getSession(req)
  if (!session) return json(res, 401, { ok: false, authenticated: false })
  return json(res, 200, {
    ok: true,
    authenticated: true,
    email: session.email,
    exp: session.exp,
  })
}
