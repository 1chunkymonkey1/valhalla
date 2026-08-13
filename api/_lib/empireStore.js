/**
 * Empire team store (users, invites, tasks, notes, activity).
 * In-process on Vercel — durable via Admin Export/Import JSON until KV/Postgres.
 */

import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const HALLS = [
  'wolf',
  'viking',
  'eagle',
  'phenix',
  'holm',
  'atoll',
  'olympus',
  'aether',
  'demeter',
  'njord',
  'aeolus',
  'corvus',
]

export const ROLES = {
  super_admin: {
    label: 'Founder / Super Admin',
    blurb: 'Sees the entire empire. Invites people, assigns halls, exports state.',
  },
  empire_ops: {
    label: 'Empire Ops',
    blurb: 'Cross-hall coordination, launch timing, and task oversight.',
  },
  hall_lead: {
    label: 'Hall Lead',
    blurb: 'Owns one or more company halls — reservations, notes, product drops.',
  },
  growth: {
    label: 'Growth',
    blurb: 'Email signups, waitlists, community, and consumer interest.',
  },
  finance: {
    label: 'Finance',
    blurb: 'Refundable holds, pay-link status, and reservation money capture.',
  },
  comms: {
    label: 'Comms',
    blurb: 'Press, partners, Discord, and external narrative.',
  },
}

function root() {
  const g = globalThis
  if (!g.__vhEmpire) {
    g.__vhEmpire = {
      users: [],
      invites: [],
      tasks: [],
      notes: [],
      activity: [],
    }
  }
  return g.__vhEmpire
}

function id(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${randomBytes(4).toString('hex')}`
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPasswordHash(password, stored) {
  if (!password || !stored || !stored.includes(':')) return false
  const [salt, hashHex] = stored.split(':')
  const derived = scryptSync(password, salt, 64)
  const expected = Buffer.from(hashHex, 'hex')
  if (derived.length !== expected.length) return false
  return timingSafeEqual(derived, expected)
}

export function listHallIds() {
  return [...HALLS]
}

export function logActivity(entry) {
  const list = root().activity
  list.unshift({
    id: id('act'),
    at: new Date().toISOString(),
    ...entry,
  })
  if (list.length > 2000) list.length = 2000
}

export function listActivity(limit = 100) {
  return root().activity.slice(0, limit)
}

export function listUsers() {
  return root().users.map((u) => sanitizeUser(u))
}

export function getUserByEmail(email) {
  const e = String(email || '')
    .trim()
    .toLowerCase()
  return root().users.find((u) => u.email === e) || null
}

export function sanitizeUser(u) {
  if (!u) return null
  const { passwordHash, ...rest } = u
  return rest
}

export function upsertUser(user) {
  const bag = root().users
  const email = user.email.trim().toLowerCase()
  const idx = bag.findIndex((u) => u.email === email)
  const row = {
    id: user.id || id('usr'),
    email,
    name: user.name || email.split('@')[0],
    role: user.role || 'hall_lead',
    halls: Array.isArray(user.halls) ? user.halls : [],
    passwordHash: user.passwordHash,
    active: user.active !== false,
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  if (idx >= 0) bag[idx] = { ...bag[idx], ...row, id: bag[idx].id }
  else bag.push(row)
  return sanitizeUser(getUserByEmail(email))
}

export function createInvite({ email, name, role, halls, invitedBy }) {
  const token = randomBytes(24).toString('hex')
  const invite = {
    id: id('inv'),
    email: String(email).trim().toLowerCase(),
    name: name || '',
    role: role || 'hall_lead',
    halls: halls || [],
    token,
    invitedBy,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    acceptedAt: null,
  }
  root().invites.unshift(invite)
  logActivity({
    type: 'invite_created',
    actor: invitedBy,
    email: invite.email,
    role: invite.role,
  })
  return invite
}

export function listInvites() {
  return root().invites.map(({ token, ...rest }) => ({
    ...rest,
    tokenPreview: `${token.slice(0, 6)}…`,
    token, // founder needs full token once to share link
  }))
}

export function getInviteByToken(token) {
  const inv = root().invites.find((i) => i.token === token)
  if (!inv) return null
  if (inv.acceptedAt) return null
  if (Date.now() > new Date(inv.expiresAt).getTime()) return null
  return inv
}

export function acceptInvite(token, { name, password }) {
  const inv = getInviteByToken(token)
  if (!inv) return { ok: false, error: 'Invite invalid or expired' }
  if (!password || password.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters' }
  }
  const user = upsertUser({
    email: inv.email,
    name: name || inv.name || inv.email.split('@')[0],
    role: inv.role,
    halls: inv.halls,
    passwordHash: hashPassword(password),
    active: true,
  })
  inv.acceptedAt = new Date().toISOString()
  logActivity({ type: 'invite_accepted', actor: inv.email, role: inv.role })
  return { ok: true, user }
}

export function listTasks({ email, halls, role } = {}) {
  let tasks = [...root().tasks]
  if (role === 'super_admin' || role === 'empire_ops') return tasks
  if (role === 'growth' || role === 'finance' || role === 'comms') return tasks
  if (halls?.length) {
    tasks = tasks.filter(
      (t) => !t.hall || halls.includes(t.hall) || t.assignee === email,
    )
  } else if (email) {
    tasks = tasks.filter((t) => t.assignee === email || !t.hall)
  }
  return tasks
}

export function addTask(task) {
  const row = {
    id: id('tsk'),
    title: task.title,
    body: task.body || '',
    hall: task.hall || null,
    status: task.status || 'todo',
    assignee: task.assignee || null,
    createdBy: task.createdBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  root().tasks.unshift(row)
  logActivity({
    type: 'task_created',
    actor: task.createdBy,
    hall: row.hall,
    title: row.title,
  })
  return row
}

export function updateTask(taskId, patch, actor) {
  const list = root().tasks
  const idx = list.findIndex((t) => t.id === taskId)
  if (idx < 0) return null
  list[idx] = {
    ...list[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  logActivity({
    type: 'task_updated',
    actor,
    taskId,
    status: list[idx].status,
  })
  return list[idx]
}

export function listNotes(hall) {
  return root().notes.filter((n) => !hall || n.hall === hall)
}

export function addNote({ hall, body, author }) {
  const row = {
    id: id('note'),
    hall,
    body,
    author,
    createdAt: new Date().toISOString(),
  }
  root().notes.unshift(row)
  logActivity({ type: 'note_added', actor: author, hall })
  return row
}

export function exportEmpire() {
  return {
    exportedAt: new Date().toISOString(),
    ...root(),
  }
}

export function importEmpire(data) {
  if (!data || typeof data !== 'object') return false
  const g = root()
  if (Array.isArray(data.users)) g.users = data.users
  if (Array.isArray(data.invites)) g.invites = data.invites
  if (Array.isArray(data.tasks)) g.tasks = data.tasks
  if (Array.isArray(data.notes)) g.notes = data.notes
  if (Array.isArray(data.activity)) g.activity = data.activity
  logActivity({ type: 'empire_imported', actor: 'system' })
  return true
}

export function hallAccessFor(user) {
  if (!user) return []
  if (user.role === 'super_admin' || user.role === 'empire_ops') return listHallIds()
  if (user.role === 'growth' || user.role === 'finance' || user.role === 'comms') {
    return listHallIds()
  }
  return user.halls || []
}

export function canManagePeople(user) {
  return user?.role === 'super_admin'
}
