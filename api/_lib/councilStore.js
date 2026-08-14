/**
 * Council threads + messages. Supabase when configured; otherwise in-memory.
 */

import { randomBytes } from 'node:crypto'
import { getSupabase, isSupabaseConfigured } from './supabase.js'
import { plainText } from './sanitize.js'
import {
  COUNCIL_AGENT_IDS,
  getCouncilAgentDef,
  isCouncilAgentId,
  listCouncilAgentsPublic,
  parseMentions,
} from './councilAgents.js'
import { generateCouncilReply, isAiConfigured } from './councilAi.js'

const MAX_AUTONOMOUS_ROUNDS = 3
const MAX_REPLIES_PER_ROUND = 6
const ROUND_COOLDOWN_MS = 8_000

function mem() {
  const g = globalThis
  if (!g.__vhCouncil) {
    g.__vhCouncil = {
      threads: [],
      messages: [],
      lastRoundAt: 0,
    }
  }
  return g.__vhCouncil
}

function nid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${randomBytes(4).toString('hex')}`
}

function mapThread(row) {
  if (!row) return null
  return {
    id: row.id,
    kind: row.kind || 'direct',
    title: row.title || '',
    agentId: row.agent_id || row.agentId || null,
    participants: row.participants || [],
    status: row.status || 'open',
    goal: row.goal || '',
    preview: row.preview || '',
    lastRoundAt: row.last_round_at || row.lastRoundAt || null,
    roundCount: Number(row.round_count ?? row.roundCount ?? 0),
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
    fromId: row.from_id || row.fromId || '',
    toId: row.to_id || row.toId || '',
    body: row.body,
    kind: row.kind || 'chat',
    model: row.model || '',
    meta: row.meta || {},
    createdAt: row.created_at || row.createdAt,
  }
}

async function getThreadRaw(threadId) {
  if (!isSupabaseConfigured()) {
    return mem().threads.find((t) => t.id === threadId) || null
  }
  const sb = getSupabase()
  const { data, error } = await sb.from('council_threads').select('*').eq('id', threadId).maybeSingle()
  if (error) throw error
  return mapThread(data)
}

async function saveThread(thread) {
  if (!isSupabaseConfigured()) {
    const store = mem()
    const i = store.threads.findIndex((t) => t.id === thread.id)
    if (i >= 0) store.threads[i] = thread
    else store.threads.unshift(thread)
    return thread
  }
  const sb = getSupabase()
  const row = {
    id: thread.id,
    kind: thread.kind,
    title: thread.title,
    agent_id: thread.agentId,
    participants: thread.participants,
    status: thread.status,
    goal: thread.goal,
    preview: thread.preview,
    last_round_at: thread.lastRoundAt,
    round_count: thread.roundCount,
    created_at: thread.createdAt,
    updated_at: thread.updatedAt,
    last_message_at: thread.lastMessageAt,
  }
  const { error } = await sb.from('council_threads').upsert(row)
  if (error) throw error
  return thread
}

async function insertMessage(msg) {
  if (!isSupabaseConfigured()) {
    mem().messages.push(msg)
    return msg
  }
  const sb = getSupabase()
  const row = {
    id: msg.id,
    thread_id: msg.threadId,
    from_id: msg.fromId,
    to_id: msg.toId,
    body: msg.body,
    kind: msg.kind,
    model: msg.model || '',
    meta: msg.meta || {},
    created_at: msg.createdAt,
  }
  const { error } = await sb.from('council_messages').insert(row)
  if (error) throw error
  return msg
}

async function listMessagesRaw(threadId, limit = 200) {
  if (!isSupabaseConfigured()) {
    return mem()
      .messages.filter((m) => m.threadId === threadId)
      .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)))
      .slice(-limit)
  }
  const sb = getSupabase()
  const { data, error } = await sb
    .from('council_messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })
    .limit(limit)
  if (error) throw error
  return (data || []).map(mapMessage)
}

export function councilStorageMeta() {
  if (isSupabaseConfigured()) {
    return {
      storage: 'supabase',
      durabilityNote: 'Persisted in Supabase council_threads / council_messages.',
      aiConfigured: isAiConfigured(),
    }
  }
  return {
    storage: 'memory',
    durabilityNote:
      'In-memory only (same serverless instance). Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY and run council migration for durable threads.',
    aiConfigured: isAiConfigured(),
  }
}

export async function listCouncilAgents() {
  return {
    agents: listCouncilAgentsPublic(),
    ...councilStorageMeta(),
  }
}

export async function listCouncilThreads() {
  let threads
  if (!isSupabaseConfigured()) {
    threads = [...mem().threads].sort((a, b) =>
      String(b.lastMessageAt || b.updatedAt || '').localeCompare(
        String(a.lastMessageAt || a.updatedAt || ''),
      ),
    )
  } else {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('council_threads')
      .select('*')
      .order('last_message_at', { ascending: false })
      .limit(100)
    if (error) throw error
    threads = (data || []).map(mapThread)
  }
  return { threads, ...councilStorageMeta() }
}

export async function getCouncilThread(threadId) {
  const thread = await getThreadRaw(threadId)
  if (!thread) throw new Error('Thread not found')
  const messages = await listMessagesRaw(threadId)
  return { thread, messages, ...councilStorageMeta() }
}

export async function createCouncilThread({
  agentId = null,
  title = '',
  kind = 'direct',
  goal = '',
  participants = [],
} = {}) {
  const now = new Date().toISOString()
  let agent = null
  let parts = []

  if (kind === 'chamber' || kind === 'broadcast') {
    parts = COUNCIL_AGENT_IDS.slice()
    kind = kind === 'broadcast' ? 'chamber' : kind
  } else {
    const id = String(agentId || '').trim().toLowerCase()
    if (!isCouncilAgentId(id)) throw new Error('Valid agentId required for direct thread')
    agent = getCouncilAgentDef(id)
    parts = [id]
  }

  if (Array.isArray(participants) && participants.length) {
    parts = [...new Set(participants.map((p) => String(p).toLowerCase()).filter(isCouncilAgentId))]
    if (!parts.length) throw new Error('No valid participants')
  }

  const thread = {
    id: nid('cth'),
    kind: kind === 'chamber' ? 'chamber' : 'direct',
    title:
      plainText(title, 120) ||
      (agent ? `${agent.name}` : 'Council chamber') ||
      'Council',
    agentId: agent?.id || parts[0] || null,
    participants: parts,
    status: 'open',
    goal: plainText(goal, 500),
    preview: '',
    lastRoundAt: null,
    roundCount: 0,
    createdAt: now,
    updatedAt: now,
    lastMessageAt: now,
  }
  await saveThread(thread)
  return { thread, messages: [], ...councilStorageMeta() }
}

async function appendMessage(thread, { fromId, toId = '', body, kind = 'chat', model = '', meta = {} }) {
  const now = new Date().toISOString()
  const clean = plainText(body, 8000)
  if (!clean) throw new Error('Empty message')
  const msg = {
    id: nid('cmsg'),
    threadId: thread.id,
    fromId: String(fromId || '').slice(0, 40),
    toId: String(toId || '').slice(0, 40),
    body: clean,
    kind,
    model,
    meta,
    createdAt: now,
  }
  await insertMessage(msg)
  thread.preview = clean.slice(0, 160)
  thread.updatedAt = now
  thread.lastMessageAt = now
  await saveThread(thread)
  return msg
}

/**
 * Founder message. Optional @mentions trigger agent replies.
 * @all / @council broadcasts to all participants (capped).
 */
export async function postFounderMessage(threadId, text, { replyAgents = true } = {}) {
  const thread = await getThreadRaw(threadId)
  if (!thread) throw new Error('Thread not found')
  if (thread.status === 'closed') throw new Error('Thread is closed')

  const body = plainText(text, 4000)
  if (!body) throw new Error('Message required')

  const mentions = parseMentions(body)
  let targets = mentions
  if (!targets.length) {
    if (thread.kind === 'direct' && thread.agentId) targets = [thread.agentId]
    else targets = []
  }

  // Cap fan-out
  targets = targets.filter((id) => thread.participants.includes(id) || thread.kind === 'chamber')
  if (thread.kind === 'chamber' && mentions.some((m) => m)) {
    /* already filtered */
  }
  if (targets.length > MAX_REPLIES_PER_ROUND) {
    targets = targets.slice(0, MAX_REPLIES_PER_ROUND)
  }

  const toLabel =
    targets.length === 1 ? targets[0] : targets.length > 1 ? 'council' : thread.agentId || 'council'

  await appendMessage(thread, {
    fromId: 'founder',
    toId: toLabel,
    body,
    kind: 'founder',
  })

  const replies = []
  if (replyAgents && targets.length) {
    const history = await listMessagesRaw(threadId, 40)
    for (const agentId of targets) {
      const ai = await generateCouncilReply({
        agentId,
        recentMessages: history,
        triggerText: body,
        mode: 'direct',
        goal: thread.goal,
      })
      const msg = await appendMessage(thread, {
        fromId: agentId,
        toId: 'founder',
        body: ai.reply,
        kind: 'agent',
        model: ai.model,
        meta: { status: ai.status, reason: ai.reason || '' },
      })
      replies.push(msg)
      history.push(msg)
    }
  }

  const messages = await listMessagesRaw(threadId)
  return { thread: await getThreadRaw(threadId), messages, replies, ...councilStorageMeta() }
}

/**
 * Explicit one-shot agent turn (e.g. ask Athena without @ in body).
 */
export async function requestAgentReply(threadId, agentId, prompt = '') {
  const thread = await getThreadRaw(threadId)
  if (!thread) throw new Error('Thread not found')
  const id = String(agentId || '').trim().toLowerCase()
  if (!isCouncilAgentId(id)) throw new Error('Unknown agent')

  if (prompt) {
    await appendMessage(thread, {
      fromId: 'founder',
      toId: id,
      body: plainText(prompt, 4000),
      kind: 'founder',
    })
  }

  const history = await listMessagesRaw(threadId, 40)
  const ai = await generateCouncilReply({
    agentId: id,
    recentMessages: history,
    triggerText: prompt || history[history.length - 1]?.body || 'Continue.',
    mode: 'direct',
    goal: thread.goal,
  })
  await appendMessage(thread, {
    fromId: id,
    toId: 'founder',
    body: ai.reply,
    kind: 'agent',
    model: ai.model,
    meta: { status: ai.status },
  })
  return getCouncilThread(threadId)
}

/**
 * Bounded autonomous round: selected agents speak once, may @mention peers;
 * peer replies capped. Requires explicit Run round from admin.
 */
export async function runCouncilRound(threadId, { agentIds = null, goal = '', maxRounds = 1 } = {}) {
  const thread = await getThreadRaw(threadId)
  if (!thread) throw new Error('Thread not found')

  const store = mem()
  const nowMs = Date.now()
  if (store.lastRoundAt && nowMs - store.lastRoundAt < ROUND_COOLDOWN_MS) {
    throw new Error(`Round cooldown: wait ${Math.ceil((ROUND_COOLDOWN_MS - (nowMs - store.lastRoundAt)) / 1000)}s`)
  }
  if (thread.lastRoundAt) {
    const last = Date.parse(thread.lastRoundAt)
    if (Number.isFinite(last) && nowMs - last < ROUND_COOLDOWN_MS) {
      throw new Error('Round cooldown active for this thread')
    }
  }

  const rounds = Math.min(Math.max(Number(maxRounds) || 1, 1), MAX_AUTONOMOUS_ROUNDS)
  if (goal) {
    thread.goal = plainText(goal, 500)
  }

  let speakers = Array.isArray(agentIds) && agentIds.length
    ? agentIds.map((a) => String(a).toLowerCase()).filter(isCouncilAgentId)
    : thread.participants.slice()

  if (!speakers.length) speakers = thread.agentId ? [thread.agentId] : COUNCIL_AGENT_IDS.slice(0, 4)
  speakers = speakers.slice(0, MAX_REPLIES_PER_ROUND)

  await appendMessage(thread, {
    fromId: 'system',
    toId: 'council',
    body: `Autonomous round started (${speakers.length} speakers, up to ${rounds} pass${rounds > 1 ? 'es' : ''}). Goal: ${thread.goal || '(none — advance open threads)'}`,
    kind: 'system',
  })

  const produced = []
  for (let r = 0; r < rounds; r++) {
    const history = await listMessagesRaw(threadId, 50)
    const mentioned = new Set()

    for (const agentId of speakers) {
      const ai = await generateCouncilReply({
        agentId,
        recentMessages: history,
        triggerText:
          r === 0
            ? `Run your autonomous turn. Goal: ${thread.goal || 'Coordinate useful next steps for Valhalla.'}`
            : `Continue the autonomous round (pass ${r + 1}). Build on peers; do not repeat.`,
        mode: 'autonomous',
        goal: thread.goal,
      })
      const msg = await appendMessage(thread, {
        fromId: agentId,
        toId: 'council',
        body: ai.reply,
        kind: 'agent',
        model: ai.model,
        meta: { round: r + 1, status: ai.status },
      })
      produced.push(msg)
      history.push(msg)
      for (const m of parseMentions(ai.reply)) {
        if (m !== agentId) mentioned.add(m)
      }
    }

    // One follow-up pass for newly mentioned peers not already speaking this round
    const follow = [...mentioned].filter((id) => !speakers.includes(id)).slice(0, 3)
    for (const agentId of follow) {
      const history2 = await listMessagesRaw(threadId, 50)
      const ai = await generateCouncilReply({
        agentId,
        recentMessages: history2,
        triggerText: 'You were @mentioned in an autonomous round. Respond briefly to what was asked of you.',
        mode: 'autonomous',
        goal: thread.goal,
      })
      const msg = await appendMessage(thread, {
        fromId: agentId,
        toId: 'council',
        body: ai.reply,
        kind: 'agent',
        model: ai.model,
        meta: { round: r + 1, followUp: true, status: ai.status },
      })
      produced.push(msg)
    }
  }

  thread.roundCount = Number(thread.roundCount || 0) + rounds
  thread.lastRoundAt = new Date().toISOString()
  store.lastRoundAt = Date.now()
  await saveThread(thread)

  return {
    thread: await getThreadRaw(threadId),
    messages: await listMessagesRaw(threadId),
    producedCount: produced.length,
    ...councilStorageMeta(),
  }
}

export async function setCouncilThreadStatus(threadId, status) {
  const thread = await getThreadRaw(threadId)
  if (!thread) throw new Error('Thread not found')
  thread.status = status === 'closed' ? 'closed' : 'open'
  thread.updatedAt = new Date().toISOString()
  await saveThread(thread)
  return getCouncilThread(threadId)
}

export async function setCouncilThreadGoal(threadId, goal) {
  const thread = await getThreadRaw(threadId)
  if (!thread) throw new Error('Thread not found')
  thread.goal = plainText(goal, 500)
  thread.updatedAt = new Date().toISOString()
  await saveThread(thread)
  return { thread, ...councilStorageMeta() }
}
