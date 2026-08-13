import { json, readBody, requirePeopleAdmin } from '../_lib/auth.js'
import { isSupabaseConfigured } from '../_lib/supabase.js'
import {
  ROLES,
  createInvite,
  exportEmpire,
  importEmpire,
  listActivity,
  listHallIds,
  listInvites,
  listUsers,
  upsertUser,
  getUserByEmail,
  hashPassword,
} from '../_lib/empireStore.js'

export default async function handler(req, res) {
  const session = requirePeopleAdmin(req, res)
  if (!session) return

  if (req.method === 'GET') {
    try {
      const [users, invites, activity] = await Promise.all([
        listUsers(),
        listInvites(),
        listActivity(80),
      ])
      return json(res, 200, {
        ok: true,
        roles: ROLES,
        halls: listHallIds(),
        users,
        invites,
        activity,
        storage: isSupabaseConfigured() ? 'supabase' : 'memory',
      })
    } catch (err) {
      return json(res, 500, { ok: false, error: err.message || 'Storage error' })
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await readBody(req)
      const action = body.action || 'invite'

      if (action === 'invite') {
        if (!body.email) return json(res, 400, { ok: false, error: 'Email required' })
        const invite = await createInvite({
          email: body.email,
          name: body.name || '',
          role: body.role || 'hall_lead',
          halls: body.halls || [],
          invitedBy: session.email,
        })
        const origin = req.headers.origin || `https://${req.headers.host}`
        return json(res, 200, {
          ok: true,
          invite,
          acceptUrl: `${origin}/team/join?token=${invite.token}`,
        })
      }

      if (action === 'update_user') {
        const existing = await getUserByEmail(body.email)
        if (!existing) return json(res, 404, { ok: false, error: 'User not found' })
        const patch = {
          ...existing,
          name: body.name ?? existing.name,
          role: body.role ?? existing.role,
          halls: body.halls ?? existing.halls,
          active: body.active ?? existing.active,
        }
        if (body.password) patch.passwordHash = hashPassword(body.password)
        const user = await upsertUser(patch)
        return json(res, 200, { ok: true, user })
      }

      if (action === 'export') {
        const empire = await exportEmpire()
        return json(res, 200, { ok: true, empire })
      }

      if (action === 'import') {
        const ok = await importEmpire(body.empire)
        return json(res, ok ? 200 : 400, { ok })
      }

      return json(res, 400, { ok: false, error: 'Unknown action' })
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message || 'Bad request' })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}
