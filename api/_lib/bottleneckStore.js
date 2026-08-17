/**
 * Bottleneck findings + founder queue.
 * Supabase when configured; otherwise in-memory (same-instance only).
 * Missing tables fall back to memory, same as dispatchStore.
 */

import { randomBytes } from 'node:crypto'
import { getSupabase, isSupabaseConfigured } from './supabase.js'

const MISSING_TABLE = /bottlenecks|founder_queue|bottleneck_sweeps|schema cache|does not exist/i
const OPEN_QUEUE = new Set(['open', 'needs_eason'])

function mem() {
  const g = globalThis
  if (!g.__vhBottlenecks) {
    g.__vhBottlenecks = { findings: new Map(), queue: [], sweeps: [] }
  }
  return g.__vhBottlenecks
}

export function resetMemoryBottlenecksForTests() {
  globalThis.__vhBottleneckForceMemory = true
  globalThis.__vhBottlenecks = { findings: new Map(), queue: [], sweeps: [] }
}

function useDb() {
  if (globalThis.__vhBottleneckForceMemory) return false
  return isSupabaseConfigured()
}

function nid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${randomBytes(4).toString('hex')}`
}

function nowIso() {
  return new Date().toISOString()
}

function mapFinding(row) {
  if (!row) return null
  return {
    id: row.id,
    key: row.dedupe_key || row.key,
    surface: row.surface,
    kind: row.kind,
    slug: row.slug,
    title: row.title,
    body: row.body || '',
    status: row.status || 'open',
    founderRequired: Boolean(row.founder_required ?? row.founderRequired),
    automation: row.automation || 'none',
    evidence: row.evidence || {},
    seenCount: Number(row.seen_count ?? row.seenCount ?? 1),
    firstSeenAt: row.first_seen_at || row.firstSeenAt,
    lastSeenAt: row.last_seen_at || row.lastSeenAt,
    resolvedAt: row.resolved_at || row.resolvedAt || null,
    resolvedBy: row.resolved_by || row.resolvedBy || '',
    snoozeUntil: row.snooze_until || row.snoozeUntil || null,
  }
}

function mapQueue(row) {
  if (!row) return null
  return {
    id: row.id,
    bottleneckId: row.bottleneck_id || row.bottleneckId,
    hall: row.hall || '',
    title: row.title,
    body: row.body || '',
    status: row.status || 'needs_eason',
    automatable: Boolean(row.automatable),
    resolution: row.resolution || '',
    source: row.source || 'sweep',
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt,
    resolvedAt: row.resolved_at || row.resolvedAt || null,
    resolvedBy: row.resolved_by || row.resolvedBy || '',
  }
}

function mapSweep(row) {
  if (!row) return null
  return {
    id: row.id,
    ranAt: row.ran_at || row.ranAt,
    actor: row.actor || '',
    findings: Number(row.findings || 0),
    queued: Number(row.queued || 0),
    automated: Number(row.automated || 0),
    deduped: Number(row.deduped || 0),
    report: row.report || {},
  }
}

export function storageLabel() {
  return useDb() ? 'supabase' : 'memory'
}

export async function listFindings() {
  if (!useDb()) {
    return [...mem().findings.values()].sort((a, b) => String(a.key).localeCompare(String(b.key)))
  }
  const sb = getSupabase()
  const { data, error } = await sb.from('bottlenecks').select('*').order('last_seen_at', { ascending: false })
  if (error) {
    if (MISSING_TABLE.test(error.message || '')) return [...mem().findings.values()]
    throw error
  }
  return (data || []).map(mapFinding)
}

export async function getFindingByKey(key) {
  if (!useDb()) return mem().findings.get(key) || null
  const sb = getSupabase()
  const { data, error } = await sb.from('bottlenecks').select('*').eq('dedupe_key', key).maybeSingle()
  if (error) {
    if (MISSING_TABLE.test(error.message || '')) return mem().findings.get(key) || null
    throw error
  }
  return mapFinding(data)
}

export async function upsertFinding(input) {
  const existing = input.key ? await getFindingByKey(input.key) : null
  const stamp = nowIso()
  const finding = {
    id: existing?.id || input.id || input.key,
    key: input.key,
    surface: input.surface,
    kind: input.kind,
    slug: input.slug,
    title: input.title,
    body: input.body || '',
    status: input.status || existing?.status || 'open',
    founderRequired: Boolean(input.founderRequired),
    automation: input.automation || 'none',
    evidence: input.evidence || existing?.evidence || {},
    seenCount: (existing?.seenCount || 0) + (input.bump || !existing ? 1 : 0) || 1,
    firstSeenAt: existing?.firstSeenAt || stamp,
    lastSeenAt: stamp,
    resolvedAt: input.resolvedAt ?? existing?.resolvedAt ?? null,
    resolvedBy: input.resolvedBy ?? existing?.resolvedBy ?? '',
    snoozeUntil: input.snoozeUntil ?? existing?.snoozeUntil ?? null,
  }
  mem().findings.set(finding.key, finding)
  if (!useDb()) return finding
  const sb = getSupabase()
  const payload = {
    id: finding.id,
    dedupe_key: finding.key,
    surface: finding.surface,
    kind: finding.kind,
    slug: finding.slug,
    title: finding.title,
    body: finding.body,
    status: finding.status,
    founder_required: finding.founderRequired,
    automation: finding.automation,
    evidence: finding.evidence,
    seen_count: finding.seenCount,
    first_seen_at: finding.firstSeenAt,
    last_seen_at: finding.lastSeenAt,
    resolved_at: finding.resolvedAt,
    resolved_by: finding.resolvedBy,
    snooze_until: finding.snoozeUntil,
  }
  const { error } = await sb.from('bottlenecks').upsert(payload, { onConflict: 'id' })
  if (error) {
    if (MISSING_TABLE.test(error.message || '')) return finding
    throw error
  }
  return finding
}

export async function listQueue({ status = 'all' } = {}) {
  let items
  if (!useDb()) {
    items = [...mem().queue]
  } else {
    const sb = getSupabase()
    const { data, error } = await sb.from('founder_queue').select('*').order('created_at', { ascending: true })
    if (error) {
      if (MISSING_TABLE.test(error.message || '')) items = [...mem().queue]
      else throw error
    } else {
      items = (data || []).map(mapQueue)
    }
  }
  if (status === 'all') return items
  return items.filter((item) => item.status === status)
}

export async function getQueueByBottleneck(bottleneckId) {
  const items = await listQueue({ status: 'all' })
  const open = items.find((item) => item.bottleneckId === bottleneckId && OPEN_QUEUE.has(item.status))
  if (open) return open
  const done = [...items].reverse().find((item) => item.bottleneckId === bottleneckId)
  return done || null
}

export async function upsertQueueItem(input) {
  const existing = await getQueueByBottleneck(input.bottleneckId)
  const stamp = nowIso()
  if (existing && OPEN_QUEUE.has(existing.status)) {
    const item = {
      ...existing,
      title: input.title || existing.title,
      body: input.body || existing.body,
      hall: input.hall || existing.hall,
      status: input.status || existing.status,
      automatable: input.automatable ?? existing.automatable,
      source: existing.source || input.source || 'sweep',
      updatedAt: stamp,
    }
    const idx = mem().queue.findIndex((row) => row.id === item.id)
    if (idx >= 0) mem().queue[idx] = item
    else mem().queue.push(item)
    if (useDb()) {
      const sb = getSupabase()
      const { error } = await sb
        .from('founder_queue')
        .update({
          title: item.title,
          body: item.body,
          hall: item.hall,
          status: item.status,
          automatable: item.automatable,
          updated_at: item.updatedAt,
        })
        .eq('id', item.id)
      if (error && !MISSING_TABLE.test(error.message || '')) throw error
    }
    return { item, deduped: true }
  }

  const item = {
    id: nid('fq'),
    bottleneckId: input.bottleneckId,
    hall: input.hall || '',
    title: input.title,
    body: input.body || '',
    status: input.status || 'needs_eason',
    automatable: Boolean(input.automatable),
    resolution: '',
    source: input.source || 'sweep',
    createdAt: stamp,
    updatedAt: stamp,
    resolvedAt: null,
    resolvedBy: '',
  }
  mem().queue.push(item)
  if (!useDb()) return { item, deduped: false }
  const sb = getSupabase()
  const payload = {
    id: item.id,
    bottleneck_id: item.bottleneckId,
    hall: item.hall,
    title: item.title,
    body: item.body,
    status: item.status,
    automatable: item.automatable,
    resolution: item.resolution,
    source: item.source,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
    resolved_at: item.resolvedAt,
    resolved_by: item.resolvedBy,
  }
  const { error } = await sb.from('founder_queue').insert(payload)
  if (error) {
    if (MISSING_TABLE.test(error.message || '')) return { item, deduped: false }
    if (/duplicate|unique/i.test(error.message || '')) {
      const open = await getQueueByBottleneck(item.bottleneckId)
      if (open) return { item: open, deduped: true }
    }
    throw error
  }
  return { item, deduped: false }
}

export async function updateQueueItem(id, patch, actor = '') {
  const items = await listQueue({ status: 'all' })
  const existing = items.find((row) => row.id === id)
  if (!existing) return null
  const stamp = nowIso()
  const item = {
    ...existing,
    ...patch,
    updatedAt: stamp,
    resolvedAt: patch.status === 'done' ? stamp : existing.resolvedAt,
    resolvedBy: patch.status === 'done' ? actor || patch.resolvedBy || '' : existing.resolvedBy,
  }
  const idx = mem().queue.findIndex((row) => row.id === id)
  if (idx >= 0) mem().queue[idx] = item
  else mem().queue.push(item)
  if (!useDb()) return item
  const sb = getSupabase()
  const { error } = await sb
    .from('founder_queue')
    .update({
      status: item.status,
      resolution: item.resolution || '',
      updated_at: item.updatedAt,
      resolved_at: item.resolvedAt,
      resolved_by: item.resolvedBy,
    })
    .eq('id', id)
  if (error && !MISSING_TABLE.test(error.message || '')) throw error
  return item
}

export async function recordSweep(stats) {
  const sweep = {
    id: nid('sw'),
    ranAt: nowIso(),
    actor: stats.actor || 'sweep',
    findings: stats.findings || 0,
    queued: stats.queued || 0,
    automated: stats.automated || 0,
    deduped: stats.deduped || 0,
    report: stats.report || {},
  }
  mem().sweeps.unshift(sweep)
  mem().sweeps.splice(40)
  if (!useDb()) return sweep
  const sb = getSupabase()
  const { error } = await sb.from('bottleneck_sweeps').insert({
    id: sweep.id,
    ran_at: sweep.ranAt,
    actor: sweep.actor,
    findings: sweep.findings,
    queued: sweep.queued,
    automated: sweep.automated,
    deduped: sweep.deduped,
    report: sweep.report,
  })
  if (error && !MISSING_TABLE.test(error.message || '')) throw error
  return sweep
}

export async function lastSweep() {
  if (!useDb()) return mem().sweeps[0] || null
  const sb = getSupabase()
  const { data, error } = await sb
    .from('bottleneck_sweeps')
    .select('*')
    .order('ran_at', { ascending: false })
    .limit(1)
  if (error) {
    if (MISSING_TABLE.test(error.message || '')) return mem().sweeps[0] || null
    throw error
  }
  return mapSweep((data || [])[0])
}
