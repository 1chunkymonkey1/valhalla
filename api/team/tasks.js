import { json, readBody, requireTeam } from '../_lib/auth.js'
import { addTask, listTasks, updateTask, getUserByEmail, hallAccessFor } from '../_lib/empireStore.js'

export default async function handler(req, res) {
  const session = requireTeam(req, res)
  if (!session) return
  const user = getUserByEmail(session.email)
  if (!user) return json(res, 401, { ok: false, error: 'Unauthorized' })

  if (req.method === 'GET') {
    return json(res, 200, {
      ok: true,
      tasks: listTasks({
        email: user.email,
        halls: hallAccessFor(user),
        role: user.role,
      }),
    })
  }

  if (req.method === 'POST') {
    try {
      const body = await readBody(req)
      if (!body.title?.trim()) {
        return json(res, 400, { ok: false, error: 'Title required' })
      }
      const halls = hallAccessFor(user)
      if (body.hall && !halls.includes(body.hall) && user.role === 'hall_lead') {
        return json(res, 403, { ok: false, error: 'No access to that hall' })
      }
      const task = addTask({
        title: body.title.trim(),
        body: body.body || '',
        hall: body.hall || null,
        status: body.status || 'todo',
        assignee: body.assignee || user.email,
        createdBy: user.email,
      })
      return json(res, 200, { ok: true, task })
    } catch {
      return json(res, 400, { ok: false, error: 'Bad request' })
    }
  }

  if (req.method === 'PATCH') {
    try {
      const body = await readBody(req)
      const task = updateTask(
        body.id,
        {
          title: body.title,
          body: body.body,
          status: body.status,
          assignee: body.assignee,
          hall: body.hall,
        },
        user.email,
      )
      if (!task) return json(res, 404, { ok: false, error: 'Task not found' })
      return json(res, 200, { ok: true, task })
    } catch {
      return json(res, 400, { ok: false, error: 'Bad request' })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}
