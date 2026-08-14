/**
 * Empire team store — Supabase when configured, else in-memory fallback.
 */

import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { getSupabase, isSupabaseConfigured } from './supabase.js'

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
  'meridian',
]

export const ROLES = {
  super_admin: {
    label: 'Founder / Super Admin',
    blurb: 'Full access. Invites, halls, export.',
  },
  empire_ops: {
    label: 'Empire Ops',
    blurb: 'Cross-hall coordination and launch timing.',
  },
  hall_lead: {
    label: 'Hall Lead',
    blurb: 'Owns one or more halls — holds, notes, drops.',
  },
  growth: {
    label: 'Growth',
    blurb: 'Email, waitlists, community.',
  },
  finance: {
    label: 'Finance',
    blurb: 'Refundable holds and pay-link status.',
  },
  comms: {
    label: 'Comms',
    blurb: 'Press, partners, Discord.',
  },
}

function mem() {
  const g = globalThis
  if (!g.__vhEmpire) {
    g.__vhEmpire = { users: [], invites: [], tasks: [], notes: [], activity: [] }
  }
  return g.__vhEmpire
}

function nid(prefix) {
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

function mapUser(row) {
  if (!row) return null
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    halls: row.halls || [],
    passwordHash: row.password_hash ?? row.passwordHash,
    authUserId: row.auth_user_id ?? row.authUserId ?? null,
    active: row.active !== false,
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt,
  }
}

function mapInvite(row) {
  if (!row) return null
  return {
    id: row.id,
    email: row.email,
    name: row.name || '',
    role: row.role,
    halls: row.halls || [],
    token: row.token,
    invitedBy: row.invited_by || row.invitedBy,
    createdAt: row.created_at || row.createdAt,
    expiresAt: row.expires_at || row.expiresAt,
    acceptedAt: row.accepted_at || row.acceptedAt || null,
  }
}

function mapTask(row) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    body: row.body || '',
    hall: row.hall,
    status: row.status || 'todo',
    assignee: row.assignee,
    createdBy: row.created_by || row.createdBy,
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt,
  }
}

function mapNote(row) {
  if (!row) return null
  return {
    id: row.id,
    hall: row.hall,
    body: row.body,
    author: row.author,
    createdAt: row.created_at || row.createdAt,
  }
}

function mapActivity(row) {
  if (!row) return null
  return {
    id: row.id,
    type: row.type,
    actor: row.actor,
    email: row.email,
    role: row.role,
    hall: row.hall,
    title: row.title,
    taskId: row.task_id || row.taskId,
    status: row.status,
    at: row.at,
    ...(row.meta || {}),
  }
}

export function sanitizeUser(u) {
  if (!u) return null
  const { passwordHash, ...rest } = u
  return rest
}

export async function linkAuthUserId(email, authUserId) {
  const e = String(email || '')
    .trim()
    .toLowerCase()
  const uid = authUserId ? String(authUserId) : null
  if (!e || !uid) return null

  if (!isSupabaseConfigured()) {
    const u = mem().users.find((row) => row.email === e)
    if (!u) return null
    u.authUserId = uid
    u.updatedAt = new Date().toISOString()
    return sanitizeUser(u)
  }

  const sb = getSupabase()
  const { error } = await sb
    .from('team_users')
    .update({ auth_user_id: uid, updated_at: new Date().toISOString() })
    .eq('email', e)
  if (error) throw error
  return sanitizeUser(await getUserByEmail(e))
}

export async function logActivity(entry) {
  const row = {
    id: nid('act'),
    at: new Date().toISOString(),
    ...entry,
  }

  if (!isSupabaseConfigured()) {
    mem().activity.unshift(row)
    if (mem().activity.length > 2000) mem().activity.length = 2000
    return row
  }

  const sb = getSupabase()
  const { error } = await sb.from('activity').insert({
    id: row.id,
    type: entry.type,
    actor: entry.actor ?? null,
    email: entry.email ?? null,
    role: entry.role ?? null,
    hall: entry.hall ?? null,
    title: entry.title ?? null,
    task_id: entry.taskId ?? null,
    status: entry.status ?? null,
    at: row.at,
    meta: {},
  })
  if (error) throw error
  return row
}

export async function listActivity(limit = 100) {
  if (!isSupabaseConfigured()) return mem().activity.slice(0, limit)

  const sb = getSupabase()
  const { data, error } = await sb
    .from('activity')
    .select('*')
    .order('at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data || []).map(mapActivity)
}

export async function listUsers() {
  if (!isSupabaseConfigured()) return mem().users.map((u) => sanitizeUser(u))

  const sb = getSupabase()
  const { data, error } = await sb.from('team_users').select('*').order('created_at', {
    ascending: false,
  })
  if (error) throw error
  return (data || []).map((r) => sanitizeUser(mapUser(r)))
}

export async function getUserByEmail(email) {
  const e = String(email || '')
    .trim()
    .toLowerCase()
  if (!e) return null

  if (!isSupabaseConfigured()) {
    return mem().users.find((u) => u.email === e) || null
  }

  const sb = getSupabase()
  const { data, error } = await sb.from('team_users').select('*').eq('email', e).maybeSingle()
  if (error) throw error
  return mapUser(data)
}

export async function upsertUser(user) {
  const email = user.email.trim().toLowerCase()
  const now = new Date().toISOString()
  const row = {
    id: user.id || nid('usr'),
    email,
    name: user.name || email.split('@')[0],
    role: user.role || 'hall_lead',
    halls: Array.isArray(user.halls) ? user.halls : [],
    passwordHash: user.passwordHash,
    authUserId: user.authUserId,
    active: user.active !== false,
    createdAt: user.createdAt || now,
    updatedAt: now,
  }

  if (!isSupabaseConfigured()) {
    const bag = mem().users
    const idx = bag.findIndex((u) => u.email === email)
    if (idx >= 0) {
      const prev = bag[idx]
      bag[idx] = {
        ...prev,
        ...row,
        id: prev.id,
        passwordHash:
          user.passwordHash !== undefined ? user.passwordHash : prev.passwordHash,
        authUserId: user.authUserId !== undefined ? user.authUserId : prev.authUserId,
      }
    } else bag.push(row)
    return sanitizeUser(await getUserByEmail(email))
  }

  const existing = await getUserByEmail(email)
  const sb = getSupabase()
  const payload = {
    id: existing?.id || row.id,
    email,
    name: row.name,
    role: row.role,
    halls: row.halls,
    password_hash:
      user.passwordHash !== undefined
        ? user.passwordHash
        : (existing?.passwordHash ?? null),
    auth_user_id:
      user.authUserId !== undefined ? user.authUserId : (existing?.authUserId ?? null),
    active: row.active,
    created_at: existing?.createdAt || row.createdAt,
    updated_at: now,
  }
  const { error } = await sb.from('team_users').upsert(payload, { onConflict: 'email' })
  if (error) throw error
  return sanitizeUser(await getUserByEmail(email))
}

export async function createInvite({ email, name, role, halls, invitedBy }) {
  const token = randomBytes(24).toString('hex')
  const invite = {
    id: nid('inv'),
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

  if (!isSupabaseConfigured()) {
    mem().invites.unshift(invite)
    await logActivity({
      type: 'invite_created',
      actor: invitedBy,
      email: invite.email,
      role: invite.role,
    })
    return invite
  }

  const sb = getSupabase()
  const { error } = await sb.from('invites').insert({
    id: invite.id,
    email: invite.email,
    name: invite.name,
    role: invite.role,
    halls: invite.halls,
    token: invite.token,
    invited_by: invite.invitedBy,
    created_at: invite.createdAt,
    expires_at: invite.expiresAt,
    accepted_at: null,
  })
  if (error) throw error
  await logActivity({
    type: 'invite_created',
    actor: invitedBy,
    email: invite.email,
    role: invite.role,
  })
  return invite
}

export async function listInvites() {
  if (!isSupabaseConfigured()) {
    return mem().invites.map((inv) => {
      const { token, ...rest } = inv
      return { ...rest, tokenPreview: `${token.slice(0, 6)}…` }
    })
  }

  const sb = getSupabase()
  const { data, error } = await sb
    .from('invites')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map((r) => {
    const inv = mapInvite(r)
    const { token, ...rest } = inv
    return { ...rest, tokenPreview: `${token.slice(0, 6)}…` }
  })
}

export async function getInviteByToken(token) {
  if (!token) return null

  if (!isSupabaseConfigured()) {
    const inv = mem().invites.find((i) => i.token === token)
    if (!inv) return null
    if (inv.acceptedAt) return null
    if (Date.now() > new Date(inv.expiresAt).getTime()) return null
    return inv
  }

  const sb = getSupabase()
  const { data, error } = await sb.from('invites').select('*').eq('token', token).maybeSingle()
  if (error) throw error
  const inv = mapInvite(data)
  if (!inv) return null
  if (inv.acceptedAt) return null
  if (Date.now() > new Date(inv.expiresAt).getTime()) return null
  return inv
}

export async function acceptInvite(token, { name, password, authUserId } = {}) {
  const inv = await getInviteByToken(token)
  if (!inv) return { ok: false, error: 'Invite invalid or expired' }

  const viaGoogle = Boolean(authUserId)
  if (!viaGoogle && (!password || password.length < 8)) {
    return { ok: false, error: 'Password must be at least 8 characters' }
  }

  const user = await upsertUser({
    email: inv.email,
    name: name || inv.name || inv.email.split('@')[0],
    role: inv.role,
    halls: inv.halls,
    ...(viaGoogle
      ? { authUserId }
      : { passwordHash: hashPassword(password) }),
    active: true,
  })

  if (!isSupabaseConfigured()) {
    inv.acceptedAt = new Date().toISOString()
  } else {
    const sb = getSupabase()
    const { error } = await sb
      .from('invites')
      .update({ accepted_at: new Date().toISOString() })
      .eq('token', token)
    if (error) throw error
  }

  await logActivity({ type: 'invite_accepted', actor: inv.email, role: inv.role })
  return { ok: true, user }
}

export async function listTasks({ email, halls, role } = {}) {
  let tasks
  if (!isSupabaseConfigured()) {
    tasks = [...mem().tasks]
  } else {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    tasks = (data || []).map(mapTask)
  }

  if (role === 'super_admin' || role === 'empire_ops') return tasks
  if (role === 'growth' || role === 'finance' || role === 'comms') return tasks
  if (halls?.length) {
    return tasks.filter((t) => !t.hall || halls.includes(t.hall) || t.assignee === email)
  }
  if (email) return tasks.filter((t) => t.assignee === email || !t.hall)
  return tasks
}

export async function addTask(task) {
  const row = {
    id: nid('tsk'),
    title: task.title,
    body: task.body || '',
    hall: task.hall || null,
    status: task.status || 'todo',
    assignee: task.assignee || null,
    createdBy: task.createdBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  if (!isSupabaseConfigured()) {
    mem().tasks.unshift(row)
  } else {
    const sb = getSupabase()
    const { error } = await sb.from('tasks').insert({
      id: row.id,
      title: row.title,
      body: row.body,
      hall: row.hall,
      status: row.status,
      assignee: row.assignee,
      created_by: row.createdBy,
      created_at: row.createdAt,
      updated_at: row.updatedAt,
    })
    if (error) throw error
  }

  await logActivity({
    type: 'task_created',
    actor: task.createdBy,
    hall: row.hall,
    title: row.title,
  })
  return row
}

export async function updateTask(taskId, patch, actor) {
  if (!isSupabaseConfigured()) {
    const list = mem().tasks
    const idx = list.findIndex((t) => t.id === taskId)
    if (idx < 0) return null
    list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() }
    await logActivity({
      type: 'task_updated',
      actor,
      taskId,
      status: list[idx].status,
    })
    return list[idx]
  }

  const sb = getSupabase()
  const updates = { updated_at: new Date().toISOString() }
  if (patch.title !== undefined) updates.title = patch.title
  if (patch.body !== undefined) updates.body = patch.body
  if (patch.status !== undefined) updates.status = patch.status
  if (patch.assignee !== undefined) updates.assignee = patch.assignee
  if (patch.hall !== undefined) updates.hall = patch.hall

  const { data, error } = await sb
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  await logActivity({
    type: 'task_updated',
    actor,
    taskId,
    status: data.status,
  })
  return mapTask(data)
}

export async function listNotes(hall) {
  if (!isSupabaseConfigured()) {
    return mem().notes.filter((n) => !hall || n.hall === hall)
  }

  const sb = getSupabase()
  let q = sb.from('notes').select('*').order('created_at', { ascending: false })
  if (hall) q = q.eq('hall', hall)
  const { data, error } = await q.limit(500)
  if (error) throw error
  return (data || []).map(mapNote)
}

export async function addNote({ hall, body, author }) {
  const row = {
    id: nid('note'),
    hall,
    body,
    author,
    createdAt: new Date().toISOString(),
  }

  if (!isSupabaseConfigured()) {
    mem().notes.unshift(row)
  } else {
    const sb = getSupabase()
    const { error } = await sb.from('notes').insert({
      id: row.id,
      hall: row.hall,
      body: row.body,
      author: row.author,
      created_at: row.createdAt,
    })
    if (error) throw error
  }

  await logActivity({ type: 'note_added', actor: author, hall })
  return row
}

export async function exportEmpire() {
  if (!isSupabaseConfigured()) {
    return { exportedAt: new Date().toISOString(), ...mem(), backend: 'memory' }
  }

  const [users, invites, tasks, notes, activity] = await Promise.all([
    listUsersRaw(),
    listInvites(),
    listTasks({ role: 'super_admin' }),
    listNotes(),
    listActivity(2000),
  ])

  return {
    exportedAt: new Date().toISOString(),
    backend: 'supabase',
    users,
    invites,
    tasks,
    notes,
    activity,
  }
}

async function listUsersRaw() {
  if (!isSupabaseConfigured()) return [...mem().users]
  const sb = getSupabase()
  const { data, error } = await sb.from('team_users').select('*')
  if (error) throw error
  return (data || []).map(mapUser)
}

export async function importEmpire(data) {
  if (!data || typeof data !== 'object') return false

  if (!isSupabaseConfigured()) {
    const g = mem()
    if (Array.isArray(data.users)) g.users = data.users
    if (Array.isArray(data.invites)) g.invites = data.invites
    if (Array.isArray(data.tasks)) g.tasks = data.tasks
    if (Array.isArray(data.notes)) g.notes = data.notes
    if (Array.isArray(data.activity)) g.activity = data.activity
    await logActivity({ type: 'empire_imported', actor: 'system' })
    return true
  }

  const sb = getSupabase()

  if (Array.isArray(data.users) && data.users.length) {
    const rows = data.users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name || '',
      role: u.role || 'hall_lead',
      halls: u.halls || [],
      password_hash: u.passwordHash || u.password_hash || null,
      active: u.active !== false,
      created_at: u.createdAt || u.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
    const { error } = await sb.from('team_users').upsert(rows, { onConflict: 'email' })
    if (error) throw error
  }

  if (Array.isArray(data.invites) && data.invites.length) {
    const rows = data.invites.map((i) => ({
      id: i.id,
      email: i.email,
      name: i.name || '',
      role: i.role || 'hall_lead',
      halls: i.halls || [],
      token: i.token,
      invited_by: i.invitedBy || i.invited_by || null,
      created_at: i.createdAt || i.created_at || new Date().toISOString(),
      expires_at: i.expiresAt || i.expires_at,
      accepted_at: i.acceptedAt || i.accepted_at || null,
    }))
    const { error } = await sb.from('invites').upsert(rows, { onConflict: 'id' })
    if (error) throw error
  }

  if (Array.isArray(data.tasks) && data.tasks.length) {
    const rows = data.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      body: t.body || '',
      hall: t.hall || null,
      status: t.status || 'todo',
      assignee: t.assignee || null,
      created_by: t.createdBy || t.created_by || null,
      created_at: t.createdAt || t.created_at || new Date().toISOString(),
      updated_at: t.updatedAt || t.updated_at || new Date().toISOString(),
    }))
    const { error } = await sb.from('tasks').upsert(rows, { onConflict: 'id' })
    if (error) throw error
  }

  if (Array.isArray(data.notes) && data.notes.length) {
    const rows = data.notes.map((n) => ({
      id: n.id,
      hall: n.hall,
      body: n.body,
      author: n.author || null,
      created_at: n.createdAt || n.created_at || new Date().toISOString(),
    }))
    const { error } = await sb.from('notes').upsert(rows, { onConflict: 'id' })
    if (error) throw error
  }

  await logActivity({ type: 'empire_imported', actor: 'system' })
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
