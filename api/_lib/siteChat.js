/**
 * Visitor ↔ founder hall chat (human relay).
 * Supabase when configured; otherwise in-memory (lost on cold start).
 */

import { randomBytes } from 'node:crypto'
import { getSupabase, isSupabaseConfigured } from './supabase.js'
import { plainText } from './sanitize.js'

export const CHAT_PAGE_IDS = [
  'hub',
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

const GREETING =
  'Welcome — ask anything about this hall. A person from Valhalla will reply here (not an automated AI).'

function mem() {
  const g = globalThis
  if (!g.__vhChat) g.__vhChat = { threads: [], messages: [] }
  return g.__vhChat
}

function nid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${randomBytes(4).toString('hex')}`
}

export function newVisitorToken() {
  return randomBytes(24).toString('hex')
}

export function isValidPageId(pageId) {
  return CHAT_PAGE_IDS.includes(pageId)
}

function mapThread(row) {
  if (!row) return null
  return {
    id: row.id,
    pageId: row.page_id || row.pageId,
    visitorToken: row.visitor_token || row.visitorToken,
    visitorName: row.visitor_name || row.visitorName || '',
    visitorEmail: row.visitor_email || row.visitorEmail || '',
    status: row.status || 'open',
    unreadAdmin: Number(row.unread_admin ?? row.unreadAdmin ?? 0),
    unreadVisitor: Number(row.unread_visitor ?? row.unreadVisitor ?? 0),
    preview: row.preview || '',
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt,
    lastMessageAt: row.last_message_at || row.lastMessageAt,
  }
}

function mapMessage(row) {
  if (!row) return null
  return {
    id: row.id,
    threadId: row.thread_id || row.threadId,
    sender: row.sender,
    body: row.body,
    createdAt: row.created_at || row.createdAt,
  }
}

function publicThread(t) {
  if (!t) return null
  return {
    id: t.id,
    pageId: t.pageId,
    visitorName: t.visitorName,
    status: t.status,
    unreadVisitor: t.unreadVisitor,
    preview: t.preview,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    lastMessageAt: t.lastMessageAt,
  }
}

function adminThread(t) {
  if (!t) return null
  return {
    ...publicThread(t),
    visitorEmail: t.visitorEmail,
    unreadAdmin: t.unreadAdmin,
  }
}

async function getThreadRaw(threadId) {
  if (!isSupabaseConfigured()) {
    return mem().threads.find((t) => t.id === threadId) || null
  }
  const sb = getSupabase()
  const { data, error } = await sb.from('chat_threads').select('*').eq('id', threadId).maybeSingle()
  if (error) throw error
  return mapThread(data)
}

async function listMessagesRaw(threadId) {
  if (!isSupabaseConfigured()) {
    return mem()
      .messages.filter((m) => m.threadId === threadId)
      .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)))
  }
  const sb = getSupabase()
  const { data, error } = await sb
    .from('chat_messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })
    .limit(200)
  if (error) throw error
  return (data || []).map(mapMessage)
}

async function insertThread(thread) {
  if (!isSupabaseConfigured()) {
    mem().threads.unshift(thread)
    return thread
  }
  const sb = getSupabase()
  const payload = {
    id: thread.id,
    page_id: thread.pageId,
    visitor_token: thread.visitorToken,
    visitor_name: thread.visitorName,
    visitor_email: thread.visitorEmail,
    status: thread.status,
    unread_admin: thread.unreadAdmin,
    unread_visitor: thread.unreadVisitor,
    preview: thread.preview,
    created_at: thread.createdAt,
    updated_at: thread.updatedAt,
    last_message_at: thread.lastMessageAt,
  }
  const { error } = await sb.from('chat_threads').insert(payload)
  if (error) throw error
  return thread
}

async function updateThread(threadId, patch) {
  const now = new Date().toISOString()
  if (!isSupabaseConfigured()) {
    const t = mem().threads.find((x) => x.id === threadId)
    if (!t) return null
    Object.assign(t, patch, { updatedAt: now })
    return t
  }
  const sb = getSupabase()
  const payload = { updated_at: now }
  if (patch.visitorName !== undefined) payload.visitor_name = patch.visitorName
  if (patch.visitorEmail !== undefined) payload.visitor_email = patch.visitorEmail
  if (patch.status !== undefined) payload.status = patch.status
  if (patch.unreadAdmin !== undefined) payload.unread_admin = patch.unreadAdmin
  if (patch.unreadVisitor !== undefined) payload.unread_visitor = patch.unreadVisitor
  if (patch.preview !== undefined) payload.preview = patch.preview
  if (patch.lastMessageAt !== undefined) payload.last_message_at = patch.lastMessageAt
  const { error } = await sb.from('chat_threads').update(payload).eq('id', threadId)
  if (error) throw error
  return getThreadRaw(threadId)
}

async function insertMessage(msg) {
  if (!isSupabaseConfigured()) {
    mem().messages.push(msg)
    return msg
  }
  const sb = getSupabase()
  const payload = {
    id: msg.id,
    thread_id: msg.threadId,
    sender: msg.sender,
    body: msg.body,
    created_at: msg.createdAt,
  }
  const { error } = await sb.from('chat_messages').insert(payload)
  if (error) throw error
  return msg
}

export async function startOrContinueThread({
  pageId,
  visitorToken,
  threadId,
  visitorName,
  visitorEmail,
  body,
}) {
  if (!isValidPageId(pageId)) throw new Error('Unknown page')
  const token = String(visitorToken || '').trim()
  if (!token || token.length < 16 || token.length > 128) {
    throw new Error('Invalid visitor session')
  }
  const text = plainText(body, 2000)
  if (!text) throw new Error('Message required')

  const name = plainText(visitorName || '', 80)
  const email = plainText(visitorEmail || '', 160).toLowerCase()
  const now = new Date().toISOString()

  let thread = null
  if (threadId) {
    thread = await getThreadRaw(threadId)
    if (!thread || thread.visitorToken !== token) {
      throw new Error('Thread not found')
    }
    if (thread.pageId !== pageId) throw new Error('Thread page mismatch')
  } else if (!isSupabaseConfigured()) {
    thread =
      mem().threads.find(
        (t) => t.visitorToken === token && t.pageId === pageId && t.status === 'open',
      ) || null
  } else {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('chat_threads')
      .select('*')
      .eq('visitor_token', token)
      .eq('page_id', pageId)
      .eq('status', 'open')
      .order('last_message_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error) throw error
    thread = mapThread(data)
  }

  const created = !thread
  if (!thread) {
    thread = await insertThread({
      id: nid('cth'),
      pageId,
      visitorToken: token,
      visitorName: name,
      visitorEmail: email,
      status: 'open',
      unreadAdmin: 0,
      unreadVisitor: 0,
      preview: '',
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
    })
    await insertMessage({
      id: nid('cmsg'),
      threadId: thread.id,
      sender: 'system',
      body: GREETING,
      createdAt: now,
    })
  } else if (name || email) {
    thread = await updateThread(thread.id, {
      visitorName: name || thread.visitorName,
      visitorEmail: email || thread.visitorEmail,
    })
  }

  const msg = await insertMessage({
    id: nid('cmsg'),
    threadId: thread.id,
    sender: 'visitor',
    body: text,
    createdAt: new Date().toISOString(),
  })

  thread = await updateThread(thread.id, {
    preview: text.slice(0, 160),
    lastMessageAt: msg.createdAt,
    unreadAdmin: (thread.unreadAdmin || 0) + 1,
    unreadVisitor: 0,
    status: 'open',
  })

  const messages = await listMessagesRaw(thread.id)
  return {
    thread: publicThread(thread),
    messages,
    visitorToken: token,
    created,
    storage: isSupabaseConfigured() ? 'supabase' : 'memory',
  }
}

export async function getVisitorThread(threadId, visitorToken) {
  const thread = await getThreadRaw(threadId)
  if (!thread || thread.visitorToken !== visitorToken) {
    throw new Error('Thread not found')
  }
  const messages = await listMessagesRaw(threadId)
  return {
    thread: publicThread(thread),
    messages,
    storage: isSupabaseConfigured() ? 'supabase' : 'memory',
  }
}

export async function listAdminThreads({ pageId, limit = 60 } = {}) {
  const cap = Math.min(Math.max(Number(limit) || 60, 1), 120)
  let threads
  if (!isSupabaseConfigured()) {
    threads = [...mem().threads].sort((a, b) =>
      String(b.lastMessageAt).localeCompare(String(a.lastMessageAt)),
    )
    if (pageId && isValidPageId(pageId)) {
      threads = threads.filter((t) => t.pageId === pageId)
    }
    threads = threads.slice(0, cap)
  } else {
    const sb = getSupabase()
    let q = sb
      .from('chat_threads')
      .select('*')
      .order('last_message_at', { ascending: false })
      .limit(cap)
    if (pageId && isValidPageId(pageId)) q = q.eq('page_id', pageId)
    const { data, error } = await q
    if (error) throw error
    threads = (data || []).map(mapThread)
  }
  const unreadTotal = threads.reduce((n, t) => n + (t.unreadAdmin > 0 ? 1 : 0), 0)
  return {
    threads: threads.map(adminThread),
    unreadTotal,
    storage: isSupabaseConfigured() ? 'supabase' : 'memory',
  }
}

export async function getAdminThread(threadId) {
  const thread = await getThreadRaw(threadId)
  if (!thread) throw new Error('Thread not found')
  const messages = await listMessagesRaw(threadId)
  return {
    thread: adminThread(thread),
    messages,
    storage: isSupabaseConfigured() ? 'supabase' : 'memory',
  }
}

export async function replyAsAdmin(threadId, body) {
  const text = plainText(body, 4000)
  if (!text) throw new Error('Message required')
  const thread = await getThreadRaw(threadId)
  if (!thread) throw new Error('Thread not found')

  const msg = await insertMessage({
    id: nid('cmsg'),
    threadId,
    sender: 'admin',
    body: text,
    createdAt: new Date().toISOString(),
  })

  const updated = await updateThread(threadId, {
    preview: text.slice(0, 160),
    lastMessageAt: msg.createdAt,
    unreadVisitor: (thread.unreadVisitor || 0) + 1,
    unreadAdmin: 0,
    status: 'open',
  })

  const messages = await listMessagesRaw(threadId)
  return {
    thread: adminThread(updated),
    messages,
    storage: isSupabaseConfigured() ? 'supabase' : 'memory',
  }
}

export async function markAdminRead(threadId) {
  const thread = await getThreadRaw(threadId)
  if (!thread) throw new Error('Thread not found')
  const updated = await updateThread(threadId, { unreadAdmin: 0 })
  return { thread: adminThread(updated) }
}

export async function markVisitorRead(threadId, visitorToken) {
  const thread = await getThreadRaw(threadId)
  if (!thread || thread.visitorToken !== visitorToken) {
    throw new Error('Thread not found')
  }
  const updated = await updateThread(threadId, { unreadVisitor: 0 })
  return { thread: publicThread(updated) }
}

export async function setThreadStatus(threadId, status) {
  if (!['open', 'closed'].includes(status)) throw new Error('Invalid status')
  const thread = await getThreadRaw(threadId)
  if (!thread) throw new Error('Thread not found')
  const updated = await updateThread(threadId, { status })
  return { thread: adminThread(updated) }
}
