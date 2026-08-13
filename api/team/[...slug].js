/**
 * Single Hobby-plan serverless function for all /api/team/* routes.
 * (Vercel Hobby allows max 12 functions per deployment.)
 */
import {
  clearTeamSessionCookie,
  createTeamSessionPayload,
  getTeamSession,
  json,
  readBody,
  requireTeam,
  setTeamSessionCookie,
  signTeamSession,
} from '../_lib/auth.js'
import { isSupabaseConfigured } from '../_lib/supabase.js'
import { listReservations, listSignups } from '../_lib/store.js'
import {
  ROLES,
  acceptInvite,
  addNote,
  addTask,
  getInviteByToken,
  getUserByEmail,
  hallAccessFor,
  listNotes,
  listTasks,
  logActivity,
  updateTask,
  verifyPasswordHash,
} from '../_lib/empireStore.js'

const HALL_META = {
  wolf: { name: 'Wolf', domain: 'land', pillar: 'movement' },
  viking: { name: 'Viking', domain: 'water', pillar: 'movement' },
  eagle: { name: 'Eagle', domain: 'air', pillar: 'movement' },
  phenix: { name: 'Phenix', domain: 'space', pillar: 'movement' },
  holm: { name: 'Holm', domain: 'land', pillar: 'habitation' },
  atoll: { name: 'Atoll', domain: 'water', pillar: 'habitation' },
  olympus: { name: 'Olympus', domain: 'air', pillar: 'habitation' },
  aether: { name: 'Aether', domain: 'space', pillar: 'habitation' },
  demeter: { name: 'Demeter', domain: 'land', pillar: 'energy' },
  njord: { name: 'Njord', domain: 'water', pillar: 'energy' },
  aeolus: { name: 'Aeolus', domain: 'air', pillar: 'energy' },
  corvus: { name: 'Corvus', domain: 'space', pillar: 'energy' },
}

function routeKey(req) {
  const slug = req.query?.slug
  if (Array.isArray(slug)) return slug.filter(Boolean).join('/')
  if (typeof slug === 'string' && slug) return slug
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`)
  return url.pathname.replace(/^\/api\/team\/?/, '').replace(/\/$/, '')
}

async function handleLogin(req, res) {
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

async function handleLogout(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  clearTeamSessionCookie(res)
  return json(res, 200, { ok: true })
}

async function handleSession(req, res) {
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

async function handleAcceptInvite(req, res) {
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

async function handleNotes(req, res) {
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

async function handleTasks(req, res) {
  const session = requireTeam(req, res)
  if (!session) return
  const user = await getUserByEmail(session.email)
  if (!user) return json(res, 401, { ok: false, error: 'Unauthorized' })

  if (req.method === 'GET') {
    try {
      const tasks = await listTasks({
        email: user.email,
        halls: hallAccessFor(user),
        role: user.role,
      })
      return json(res, 200, { ok: true, tasks })
    } catch (err) {
      return json(res, 500, { ok: false, error: err.message || 'Tasks error' })
    }
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
      const task = await addTask({
        title: body.title.trim(),
        body: body.body || '',
        hall: body.hall || null,
        status: body.status || 'todo',
        assignee: body.assignee || user.email,
        createdBy: user.email,
      })
      return json(res, 200, { ok: true, task })
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message || 'Bad request' })
    }
  }

  if (req.method === 'PATCH') {
    try {
      const body = await readBody(req)
      const task = await updateTask(
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
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message || 'Bad request' })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}

async function handleWorkspace(req, res) {
  const session = requireTeam(req, res)
  if (!session) return
  if (req.method !== 'GET') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  try {
    const user = await getUserByEmail(session.email)
    if (!user) return json(res, 401, { ok: false, error: 'Unauthorized' })

    const halls = hallAccessFor(user)
    const [tasks, reservations, signups] = await Promise.all([
      listTasks({ email: user.email, halls, role: user.role }),
      listReservations(),
      listSignups(),
    ])

    const notesNested = await Promise.all(halls.map((h) => listNotes(h)))
    const notes = notesNested.flat().slice(0, 40)

    const scopedReservations = reservations.filter(
      (r) => !r.companyId || halls.includes(r.companyId),
    )

    return json(res, 200, {
      ok: true,
      storage: isSupabaseConfigured() ? 'supabase' : 'memory',
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        roleLabel: ROLES[user.role]?.label,
        roleBlurb: ROLES[user.role]?.blurb,
        halls,
      },
      halls: halls.map((id) => ({
        id,
        ...HALL_META[id],
        openTasks: tasks.filter((t) => t.hall === id && t.status !== 'done').length,
        reservations: scopedReservations.filter((r) => r.companyId === id).length,
        notes: notes.filter((n) => n.hall === id).length,
      })),
      tasks: tasks.slice(0, 80),
      notes: notes.slice(0, 40),
      reservations: scopedReservations.slice(0, 80),
      signups: signups.slice(0, 80),
      guides: [
        {
          title: 'How team login works',
          body: 'You receive an invite link from the founder. Set your password once, then sign in at /team with email + password. No authenticator required for team seats.',
        },
        {
          title: 'Your halls',
          body: 'Each company is a hall. Open a hall to manage notes, tasks, and the refundable interest flowing into that company.',
        },
        {
          title: 'Founder control tower',
          body: 'Only info@valhallaco.org uses /admin with password + 2FA. That view watches people, ledgers, and activity across the empire.',
        },
      ],
    })
  } catch (err) {
    return json(res, 500, { ok: false, error: err.message || 'Workspace error' })
  }
}

export default async function handler(req, res) {
  const key = routeKey(req)
  if (key === 'login') return handleLogin(req, res)
  if (key === 'logout') return handleLogout(req, res)
  if (key === 'session') return handleSession(req, res)
  if (key === 'accept-invite') return handleAcceptInvite(req, res)
  if (key === 'notes') return handleNotes(req, res)
  if (key === 'tasks') return handleTasks(req, res)
  if (key === 'workspace') return handleWorkspace(req, res)
  return json(res, 404, { ok: false, error: 'Not found' })
}
