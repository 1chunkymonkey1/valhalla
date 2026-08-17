/**
 * Founder-todo policy. Automate first, tools second, todo third.
 * Inbox already has needsHuman. /team already has tasks. /capital already has dispatch.
 * This queue is founder-only acts with a kill condition.
 */

import { getBottleneck, isLockedKind } from '../data/hallBottlenecks.js'

export const KINDS = ['sign', 'send', 'choose', 'pay', 'hire', 'claim', 'unblock']
export const STATUSES = ['open', 'waiting', 'decided', 'swept']
export const FAILED_LANES = ['automate', 'tool', 'team', 'inbox', 'capital', 'council']
export const SOURCES = ['founder', 'inbox-escalation', 'council-extract']
export const MAX_OPEN = 7
export const MAX_TTL_DAYS = 7
export const MAX_OPTIONS = 3
export const MAX_TITLE = 80
export const KIND_RANK = {
  claim: 0,
  sign: 1,
  pay: 2,
  send: 3,
  choose: 4,
  hire: 5,
  unblock: 6,
}

const JUNK_TITLE = /\b(think about|follow up|remember|maybe|circle back|later)\b/i
const REPLY_SHAPE = /\b(reply to visitor|answer the chat|respond in thread)\b/i

export const CADENCE_0800 = [
  'Open /admin. This tab is the morning board. Do not open Council first.',
  'Read counts only: Capital remaining, Inbox needsHuman, Team open. Those are other queues.',
  'Work open acts, top to bottom. Clock-bound today, then claim, sign, pay, send, choose, hire, unblock.',
  'Each act: Decide, Wait (name the person or clock), or mark junk so sweep can close it.',
  'If Capital remaining > 0, open /capital and send at most one NOW item. Do not copy dispatch rows here.',
  'If Inbox needsHuman > 0, reply in the thread. Promote here only when the visitor needs a signature, money movement, or a legal claim.',
  'Open Council only when this list is empty or waiting.',
  'Hard stop at seven acts or twenty-five minutes, whichever first. The rest is TIDE.',
]

export function slugDecision(decision) {
  return String(decision || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

export function makeDedupeKey({ kind, bottleneckId, decision }) {
  return `${kind}:${bottleneckId}:${slugDecision(decision)}`
}

export function daysFromNow(iso, now = Date.now()) {
  const end = Date.parse(iso)
  if (Number.isNaN(end)) return null
  return (end - now) / 86400000
}

function asList(options) {
  if (!Array.isArray(options)) return []
  return options.map((o) => String(o || '').trim()).filter(Boolean).slice(0, MAX_OPTIONS)
}

function isClockBound(item, now) {
  if (!item.dueAt) return false
  const due = Date.parse(item.dueAt)
  if (Number.isNaN(due)) return false
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return due >= start.getTime() && due < end.getTime()
}

export function sortMorning(items, now = Date.now()) {
  return [...items].sort((a, b) => {
    const aClock = Number(isClockBound(a, now))
    const bClock = Number(isClockBound(b, now))
    if (aClock !== bClock) return bClock - aClock
    const aRank = KIND_RANK[a.kind] ?? 9
    const bRank = KIND_RANK[b.kind] ?? 9
    if (aRank !== bRank) return aRank - bRank
    return String(a.createdAt || '').localeCompare(String(b.createdAt || ''))
  })
}

function reject(code, error) {
  return { ok: false, code, error }
}

/**
 * Admission gate. Chat is not a source. Sweep does not create.
 */
export function admit(input, { existing = [], now = Date.now() } = {}) {
  const kind = String(input.kind || '').trim()
  const bottleneckId = String(input.bottleneckId || '').trim()
  const title = String(input.title || '').trim()
  const whyEason = String(input.whyEason || '').trim()
  const decision = String(input.decision || '').trim()
  const failedLane = String(input.failedLane || '').trim()
  const source = String(input.source || 'founder').trim()
  const evidenceRef = String(input.evidenceRef || '').trim()
  const waitingOn = String(input.waitingOn || '').trim()
  const options = asList(input.options)
  const bottleneck = getBottleneck(bottleneckId)

  if (!KINDS.includes(kind)) return reject('kind', 'Kind must be sign, send, choose, pay, hire, claim, or unblock.')
  if (!bottleneck) return reject('bottleneck', 'Cite a standing bottleneck. Recurring chat is not a new item.')
  if (!FAILED_LANES.includes(failedLane)) {
    return reject('lane', 'Say which lane already failed: automate, tool, team, inbox, capital, or council.')
  }
  if (!SOURCES.includes(source)) return reject('source', 'Source must be founder, inbox-escalation, or council-extract.')
  if (!title || title.length > MAX_TITLE) return reject('title', 'Title is a verb-first line, 80 characters max.')
  if (JUNK_TITLE.test(title) || JUNK_TITLE.test(decision)) {
    return reject('junk', 'Think-about / follow-up / remember is not an act. Write a standing rule or drop it.')
  }
  if (REPLY_SHAPE.test(title) || REPLY_SHAPE.test(decision)) {
    return reject('inbox', 'Visitor replies stay in Inbox. This queue is not a second inbox.')
  }
  if (!whyEason) return reject('why', 'whyEason must name the act only Eason’s body can do.')
  if (!decision || !decision.includes('?')) return reject('decision', 'Decision must be a question.')
  if (options.length < 2) return reject('options', 'Give two or three options. A todo without a choice is a note.')
  if (isLockedKind(bottleneck, kind, decision) || isLockedKind(bottleneck, kind, title)) {
    return reject('locked', `Standing rule already covers this: ${bottleneck.lockedRule}`)
  }

  const evidence = evidenceRef.toLowerCase()
  if (evidence.includes('/capital') || evidence.startsWith('dispatch:')) {
    return reject('capital', 'Use the Capital desk. Do not copy dispatch rows into the founder queue.')
  }
  if (evidence.includes('/team') || evidence.startsWith('task:')) {
    return reject('team', 'Team work stays on /team. Escalate here only after that lane failed.')
  }
  if (kind === 'send' && bottleneckId === 'demeter.next-send' && !evidence) {
    return reject('capital', 'Demeter sends live in /capital. This queue may choose the path, not clone the letter.')
  }
  if (/(appoint|fill|hire).{0,24}space seat|pathfinder/i.test(`${title} ${decision}`)) {
    return reject('locked', 'Space seat stays OPEN. Encoding the hall, Launch cloth, and interior sound is the work. Recruiting a vacant title ships nothing.')
  }

  if (source === 'inbox-escalation') {
    if (failedLane !== 'inbox') return reject('inbox', 'Inbox escalation must record failedLane=inbox.')
    if (!['sign', 'pay', 'claim'].includes(kind)) {
      return reject('inbox', 'Inbox may promote only signature, money, or legal claim. Replies stay in the thread.')
    }
    if (!evidence.startsWith('inbox:')) return reject('inbox', 'Inbox escalation needs evidenceRef inbox:<threadId>.')
  }
  if (source === 'council-extract') {
    if (failedLane !== 'council') return reject('council', 'Council extract must record failedLane=council.')
    if (!/founder_act/i.test(evidenceRef) && !/founder_act/i.test(String(input.note || ''))) {
      return reject('council', 'Council may create an item only from a typed FOUNDER_ACT. Chat residue is junk.')
    }
  }

  if (!input.expiresAt) return reject('expiry', 'Every item needs expiresAt. Immortal todos are a junk drawer.')
  const ttl = daysFromNow(input.expiresAt, now)
  if (ttl == null) return reject('expiry', 'expiresAt must be an ISO timestamp.')
  if (ttl > MAX_TTL_DAYS) return reject('expiry', 'Expiry must be seven days or less.')
  if (ttl < 0) return reject('expiry', 'Expiry is already in the past.')

  if (input.dueAt && Number.isNaN(Date.parse(input.dueAt))) return reject('due', 'dueAt must be ISO if set.')
  if (input.status === 'waiting' && !waitingOn) return reject('wait', 'Waiting requires waitingOn (person or clock).')

  const dedupeKey = makeDedupeKey({ kind, bottleneckId, decision })
  const openish = existing.filter((i) => i.status === 'open' || i.status === 'waiting')
  if (openish.some((i) => i.dedupeKey === dedupeKey)) {
    return reject('dedupe', 'An open item already holds this decision. Update that row.')
  }
  if (openish.length >= MAX_OPEN) {
    return reject('cap', 'Seven open founder acts is the cap. Decide, wait, or let sweep drop ballast.')
  }

  return {
    ok: true,
    item: {
      dedupeKey,
      title,
      bottleneckId,
      hall: bottleneck.hall,
      kind,
      whyEason,
      decision,
      options,
      failedLane,
      source,
      evidenceRef,
      status: input.status === 'waiting' ? 'waiting' : 'open',
      dueAt: input.dueAt || null,
      expiresAt: input.expiresAt,
      waitingOn: input.status === 'waiting' ? waitingOn : '',
      decisionRecord: '',
    },
  }
}

export function mayCreate(input, ctx) {
  return admit(input, ctx)
}

/**
 * Sweep must auto-close when any of these fire.
 * Returns a reason string or null if the item stays.
 */
export function sweepReason(item, { existing = [], now = Date.now() } = {}) {
  if (item.status === 'decided' || item.status === 'swept') return null
  if (!item.decision || !item.whyEason) return 'missing decision or whyEason'
  if (!getBottleneck(item.bottleneckId)) return 'unknown bottleneck'
  if (!KINDS.includes(item.kind)) return 'invalid kind'
  if (JUNK_TITLE.test(item.title || '') || JUNK_TITLE.test(item.decision || '')) return 'junk language'
  if (REPLY_SHAPE.test(item.title || '') || REPLY_SHAPE.test(item.decision || '')) return 'belongs in inbox'
  const ttl = daysFromNow(item.expiresAt, now)
  if (ttl == null || ttl < 0) return 'expired'
  const evidence = String(item.evidenceRef || '').toLowerCase()
  if (evidence.includes('/capital') || evidence.startsWith('dispatch:')) return 'belongs in capital'
  if (evidence.includes('/team') || evidence.startsWith('task:')) return 'belongs on /team'
  if (item.source === 'council-extract' && !/founder_act/i.test(item.evidenceRef || '')) {
    return 'council chat without FOUNDER_ACT'
  }
  if (item.status === 'waiting' && !item.waitingOn) return 'waiting without waitingOn'
  const bottleneck = getBottleneck(item.bottleneckId)
  if (bottleneck && isLockedKind(bottleneck, item.kind, item.decision)) return 'standing rule covers this'
  const twins = existing.filter(
    (i) =>
      i.dedupeKey === item.dedupeKey &&
      i.id !== item.id &&
      (i.status === 'open' || i.status === 'waiting'),
  )
  if (twins.length) {
    const oldest = [item, ...twins].sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')))[0]
    if (oldest.id !== item.id) return 'duplicate dedupe key'
  }
  return null
}

export function applySweep(items, now = Date.now()) {
  const next = items.map((item) => ({ ...item }))
  for (const item of next) {
    const reason = sweepReason(item, { existing: next, now })
    if (reason) {
      item.status = 'swept'
      item.closedAt = new Date(now).toISOString()
      item.closedReason = reason
    }
  }
  const openOf = () => next.filter((i) => i.status === 'open')
  while (openOf().length > MAX_OPEN) {
    const droppable = openOf()
      .filter((i) => !isClockBound(i, now))
      .sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')))
    if (!droppable.length) break
    const victim = droppable[0]
    victim.status = 'swept'
    victim.closedAt = new Date(now).toISOString()
    victim.closedReason = 'ballast: over seven open non-clock acts'
  }
  return next
}

export function decidePatch(option, note = '') {
  const choice = String(option || '').trim()
  if (!choice) return { ok: false, error: 'Pick an option.' }
  return {
    ok: true,
    patch: {
      status: 'decided',
      decisionRecord: note ? `${choice}: ${String(note).trim()}` : choice,
      closedReason: 'founder decided',
    },
  }
}

export function waitPatch(waitingOn) {
  const who = String(waitingOn || '').trim()
  if (!who) return { ok: false, error: 'Waiting requires a person or a clock.' }
  return { ok: true, patch: { status: 'waiting', waitingOn: who } }
}

export function morningView(items, counts = {}, now = Date.now()) {
  const live = items.filter((i) => i.status === 'open' || i.status === 'waiting')
  const open = sortMorning(
    live.filter((i) => i.status === 'open'),
    now,
  )
  const waiting = live.filter((i) => i.status === 'waiting')
  return {
    policy: 'Automate first. Tools second. Todo third. Founder-only.',
    cadence: CADENCE_0800,
    open,
    waiting,
    counts: {
      capitalRemaining: counts.capitalRemaining ?? 0,
      inboxNeedsHuman: counts.inboxNeedsHuman ?? 0,
      teamOpen: counts.teamOpen ?? 0,
      founderOpen: open.length,
    },
  }
}
