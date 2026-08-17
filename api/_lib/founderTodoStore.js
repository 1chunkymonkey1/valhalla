/**
 * Founder-todo store. Founder cookie only. Sweep on read. Does not create from chat.
 */

import { randomBytes } from 'node:crypto'
import { getSupabase, isSupabaseConfigured } from './supabase.js'
import { plainText } from './sanitize.js'
import {
  FAILED_LANES,
  KINDS,
  MAX_OPEN,
  SOURCES,
  admit,
  applySweep,
  decidePatch,
  waitPatch,
  morningView,
} from '../../src/lib/founderTodo.js'
import { BOTTLENECKS } from '../../src/data/hallBottlenecks.js'
import { nowProgress } from '../../src/lib/capitalQueue.js'
import { listDispatchItems } from './dispatchStore.js'
import { listTasks } from './empireStore.js'
import { listAdminThreads } from './siteChat.js'

function nid() {
  return `ft_${Date.now().toString(36)}_${randomBytes(4).toString('hex')}`
}

function mem() {
  const g = globalThis
  if (!g.__vhFounderTodo) g.__vhFounderTodo = { items: [] }
  return g.__vhFounderTodo
}

function mapRow(row) {
  if (!row) return null
  const options = row.options
  return {
    id: row.id,
    dedupeKey: row.dedupe_key || row.dedupeKey,
    title: row.title,
    bottleneckId: row.bottleneck_id || row.bottleneckId,
    hall: row.hall,
    kind: row.kind,
    whyEason: row.why_eason || row.whyEason,
    decision: row.decision,
    options: Array.isArray(options) ? options : options ? JSON.parse(options) : [],
    failedLane: row.failed_lane || row.failedLane,
    source: row.source,
    evidenceRef: row.evidence_ref || row.evidenceRef || '',
    status: row.status || 'open',
    dueAt: row.due_at || row.dueAt || null,
    expiresAt: row.expires_at || row.expiresAt,
    waitingOn: row.waiting_on || row.waitingOn || '',
    decisionRecord: row.decision_record || row.decisionRecord || '',
    createdAt: row.created_at || row.createdAt,
    createdBy: row.created_by || row.createdBy || '',
    updatedAt: row.updated_at || row.updatedAt,
    closedAt: row.closed_at || row.closedAt || null,
    closedReason: row.closed_reason || row.closedReason || '',
  }
}

function toRow(item) {
  return {
    id: item.id,
    dedupe_key: item.dedupeKey,
    title: item.title,
    bottleneck_id: item.bottleneckId,
    hall: item.hall,
    kind: item.kind,
    why_eason: item.whyEason,
    decision: item.decision,
    options: item.options,
    failed_lane: item.failedLane,
    source: item.source,
    evidence_ref: item.evidenceRef || '',
    status: item.status,
    due_at: item.dueAt,
    expires_at: item.expiresAt,
    waiting_on: item.waitingOn || '',
    decision_record: item.decisionRecord || '',
    created_at: item.createdAt,
    created_by: item.createdBy || '',
    updated_at: item.updatedAt,
    closed_at: item.closedAt,
    closed_reason: item.closedReason || '',
  }
}

function storageMeta() {
  if (isSupabaseConfigured()) {
    return {
      storage: 'supabase',
      durabilityNote: 'Persisted in founder_todos. Sweep closes junk; it does not create.',
    }
  }
  return {
    storage: 'memory',
    durabilityNote:
      'In-memory only (same serverless instance). Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY and run 20260817_founder_todo.sql.',
  }
}

async function loadAll() {
  if (!isSupabaseConfigured()) {
    return mem().items.map((i) => ({ ...i }))
  }
  const sb = getSupabase()
  const { data, error } = await sb.from('founder_todos').select('*').order('created_at', { ascending: true })
  if (error) {
    if (/founder_todos|schema cache|does not exist/i.test(error.message || '')) {
      return mem().items.map((i) => ({ ...i }))
    }
    throw error
  }
  return (data || []).map(mapRow)
}

async function saveItem(item) {
  const row = { ...item, updatedAt: new Date().toISOString() }
  if (!isSupabaseConfigured()) {
    const list = mem().items
    const idx = list.findIndex((i) => i.id === row.id)
    if (idx === -1) list.push(row)
    else list[idx] = row
    return row
  }
  const sb = getSupabase()
  const { error } = await sb.from('founder_todos').upsert(toRow(row))
  if (error) {
    if (/founder_todos|schema cache|does not exist/i.test(error.message || '')) {
      const list = mem().items
      const idx = list.findIndex((i) => i.id === row.id)
      if (idx === -1) list.push(row)
      else list[idx] = row
      return row
    }
    throw error
  }
  return row
}

async function persistSwept(before, after) {
  const changed = after.filter((a) => {
    const b = before.find((x) => x.id === a.id)
    return !b || b.status !== a.status || b.closedReason !== a.closedReason
  })
  for (const item of changed) {
    await saveItem(item)
  }
  if (!isSupabaseConfigured()) mem().items = after
  return after
}

export async function sweepFounderTodos(now = Date.now()) {
  const before = await loadAll()
  const after = applySweep(before, now)
  return persistSwept(before, after)
}

async function laneCounts() {
  const [dispatch, tasks, inbox] = await Promise.all([
    listDispatchItems().catch(() => ({ items: [] })),
    listTasks({ role: 'super_admin' }).catch(() => []),
    listAdminThreads({ needsHumanOnly: true, limit: 80 }).catch(() => ({ needsHumanTotal: 0 })),
  ])
  const progress = nowProgress(dispatch.items || [])
  return {
    capitalRemaining: progress.remaining,
    inboxNeedsHuman: inbox.needsHumanTotal || 0,
    teamOpen: (tasks || []).filter((t) => t.status !== 'done').length,
  }
}

export async function listFounderTodos() {
  const items = await sweepFounderTodos()
  const counts = await laneCounts()
  const view = morningView(items, counts)
  return {
    ok: true,
    ...storageMeta(),
    ...view,
    bottlenecks: BOTTLENECKS.map((b) => ({
      id: b.id,
      hall: b.hall,
      name: b.name,
      decision: b.decision,
      lockedRule: b.lockedRule,
    })),
    kinds: KINDS,
    failedLanes: FAILED_LANES,
    sources: SOURCES,
    maxOpen: MAX_OPEN,
    items,
  }
}

export async function createFounderTodo(input, actor) {
  const items = await sweepFounderTodos()
  const admitted = admit(
    {
      ...input,
      title: plainText(input.title, 80),
      whyEason: plainText(input.whyEason, 280),
      decision: plainText(input.decision, 240),
      evidenceRef: plainText(input.evidenceRef, 240),
      waitingOn: plainText(input.waitingOn, 120),
      note: plainText(input.note, 240),
      options: Array.isArray(input.options)
        ? input.options.map((o) => plainText(o, 80))
        : [],
    },
    { existing: items },
  )
  if (!admitted.ok) {
    const err = new Error(admitted.error)
    err.code = admitted.code
    throw err
  }
  const now = new Date().toISOString()
  const row = {
    ...admitted.item,
    id: nid(),
    createdAt: now,
    createdBy: actor || '',
    updatedAt: now,
    closedAt: null,
    closedReason: '',
  }
  await saveItem(row)
  return row
}

export async function seedStandingActs(actor = 'sweep') {
  const expires = new Date(Date.now() + 7 * 86400000).toISOString()
  const standing = [
    {
      kind: 'choose',
      bottleneckId: 'demeter.next-send',
      title: 'Pick this week’s Demeter capital path',
      whyEason: 'Only Eason can authorize the next investor send.',
      decision: 'Which capital path is this week’s send?',
      options: ['SAFE desk', 'fellowship', 'farm lead'],
      failedLane: 'capital',
      source: 'founder',
      evidenceRef: 'note:path-choice',
      expiresAt: expires,
    },
    {
      kind: 'choose',
      bottleneckId: 'apollo.music-lane',
      title: 'Keep Apollo Music interior or authorize a list',
      whyEason: 'Only Eason can authorize a public music surface.',
      decision: 'Authorize a public Apollo Music list this week?',
      options: ['keep interior', 'authorize identity list'],
      failedLane: 'tool',
      source: 'founder',
      evidenceRef: 'note:apollo-music-public-flag',
      expiresAt: expires,
    },
    {
      kind: 'hire',
      bottleneckId: 'meridian.list-not-cart',
      title: 'Appoint Meridian lead',
      whyEason: 'Roster is still FILL. Only Eason appoints.',
      decision: 'Appoint a Meridian lead this week?',
      options: ['leave FILL', 'name a lead privately'],
      failedLane: 'tool',
      source: 'founder',
      evidenceRef: 'note:meridian-lead',
      expiresAt: expires,
    },
    {
      kind: 'choose',
      bottleneckId: 'eagle.spirit-language',
      title: 'Lock Eagle Spirit sentence',
      whyEason: 'Only Eason can lock the public claim sentence.',
      decision: 'Which Spirit sentence is allowed this week?',
      options: ['open dialogue only', 'silent'],
      failedLane: 'automate',
      source: 'founder',
      evidenceRef: 'note:eagle-spirit-quarantine',
      expiresAt: expires,
    },
  ]
  const created = []
  for (const act of standing) {
    try {
      created.push(await createFounderTodo(act, actor))
    } catch {
      // Dedupe / cap / locked — skip.
    }
  }
  return created
}
  const items = await sweepFounderTodos()
  const item = items.find((i) => i.id === id)
  if (!item) throw new Error('Founder act not found')
  if (item.status === 'decided' || item.status === 'swept') {
    throw new Error('That act is already closed.')
  }
  let patch
  if (action === 'decide') {
    const result = decidePatch(body.option || body.decisionRecord, body.note || '')
    if (!result.ok) throw new Error(result.error)
    if (item.options?.length && !item.options.includes(String(body.option || '').trim())) {
      throw new Error('Pick one of the listed options.')
    }
    patch = result.patch
  } else if (action === 'wait') {
    const result = waitPatch(plainText(body.waitingOn || body.wait || '', 120))
    if (!result.ok) throw new Error(result.error)
    patch = result.patch
  } else if (action === 'sweep' || action === 'junk') {
    patch = {
      status: 'swept',
      closedReason: plainText(body.reason || 'founder marked junk', 160),
    }
  } else {
    throw new Error('Unknown action')
  }
  const next = {
    ...item,
    ...patch,
    closedAt: patch.status === 'open' || patch.status === 'waiting' ? null : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: item.createdBy || actor || '',
  }
  if (patch.status === 'waiting') next.closedAt = null
  await saveItem(next)
  return next
}
