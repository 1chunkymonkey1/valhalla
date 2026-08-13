import { getTeamSession, json } from '../_lib/auth.js'
import { ROLES, hallAccessFor, getUserByEmail } from '../_lib/empireStore.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  try {
    const session = getTeamSession(req)
    if (!session) {
      return json(res, 200, { ok: true, authenticated: false })
    }
    const user = await getUserByEmail(session.email)
    if (!user || !user.active) {
      return json(res, 200, { ok: true, authenticated: false })
    }
    return json(res, 200, {
      ok: true,
      authenticated: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        roleLabel: ROLES[user.role]?.label || user.role,
        roleBlurb: ROLES[user.role]?.blurb || '',
        halls: hallAccessFor(user),
      },
    })
  } catch (err) {
    return json(res, 500, { ok: false, error: err.message || 'Session error' })
  }
}
