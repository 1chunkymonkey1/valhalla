import {
  createTeamSessionPayload,
  json,
  readBody,
  setTeamSessionCookie,
  signTeamSession,
} from '../_lib/auth.js'
import { acceptInvite, getInviteByToken, ROLES } from '../_lib/empireStore.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`)
      const token = url.searchParams.get('token') || ''
      const inv = await getInviteByToken(token)
      if (!inv) {
        return json(res, 404, { ok: false, error: 'Invite invalid or expired' })
      }
      return json(res, 200, {
        ok: true,
        invite: {
          email: inv.email,
          name: inv.name,
          role: inv.role,
          roleLabel: ROLES[inv.role]?.label,
          halls: inv.halls,
        },
      })
    } catch (err) {
      return json(res, 500, { ok: false, error: err.message || 'Invite error' })
    }
  }

  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  try {
    const body = await readBody(req)
    const result = await acceptInvite(body.token, {
      name: body.name,
      password: body.password,
    })
    if (!result.ok) return json(res, 400, result)

    const token = signTeamSession(createTeamSessionPayload(result.user))
    setTeamSessionCookie(res, token)
    return json(res, 200, { ok: true, user: result.user })
  } catch (err) {
    return json(res, 400, { ok: false, error: err.message || 'Bad request' })
  }
}
