import { json, readBody, requireTeam } from '../_lib/auth.js'
import { addNote, listNotes, getUserByEmail, hallAccessFor } from '../_lib/empireStore.js'

export default async function handler(req, res) {
  const session = requireTeam(req, res)
  if (!session) return
  const user = await getUserByEmail(session.email)
  if (!user) return json(res, 401, { ok: false, error: 'Unauthorized' })
  const halls = hallAccessFor(user)

  if (req.method === 'GET') {
    try {
      const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`)
      const hall = url.searchParams.get('hall')
      if (hall && !halls.includes(hall)) {
        return json(res, 403, { ok: false, error: 'No access' })
      }
      const notes = hall
        ? await listNotes(hall)
        : (await Promise.all(halls.map((h) => listNotes(h)))).flat()
      return json(res, 200, { ok: true, notes })
    } catch (err) {
      return json(res, 500, { ok: false, error: err.message || 'Notes error' })
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await readBody(req)
      if (!body.hall || !halls.includes(body.hall)) {
        return json(res, 403, { ok: false, error: 'No access to that hall' })
      }
      if (!body.body?.trim()) {
        return json(res, 400, { ok: false, error: 'Note body required' })
      }
      const note = await addNote({
        hall: body.hall,
        body: body.body.trim(),
        author: user.email,
      })
      return json(res, 200, { ok: true, note })
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message || 'Bad request' })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}
