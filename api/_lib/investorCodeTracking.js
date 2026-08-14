/**
 * Investor code send / next-step tracker for the a5861 materials editor.
 * 12 rows per tier (E = elephant, P = small). Codes 1–12 prefilled via π/e generator.
 * Persist in Supabase investor_code_tracking; memory fallback when unset.
 */

import { getSupabase, isSupabaseConfigured } from './supabase.js'
import { buildInvestorCode } from './investorCodes.js'

const ROW_COUNT = 12
const TIERS = ['e', 'p']
const MAX_TEXT = 500

function mem() {
  const g = globalThis
  if (!g.__vhInvestorCodeTracking) {
    g.__vhInvestorCodeTracking = { rows: defaultRows() }
  }
  return g.__vhInvestorCodeTracking
}

/** When investor_code_tracking table is missing, stay on memory for this process. */
let forceMemory = false

function useSupabaseStore() {
  return isSupabaseConfigured() && !forceMemory
}

function isMissingTrackingTable(err) {
  if (!err) return false
  if (err.code === '42P01') return true
  const msg = `${err.message || ''} ${err.details || ''} ${err.hint || ''}`
  return (
    /investor_code_tracking/i.test(msg) &&
    /(does not exist|could not find the table|schema cache)/i.test(msg)
  )
}

function noteMissingTable(err) {
  if (isMissingTrackingTable(err)) {
    forceMemory = true
    return true
  }
  return false
}

function emptyRow(tier, rowIndex) {
  const t = String(tier).toLowerCase()
  const i = Number(rowIndex)
  return {
    tier: t,
    rowIndex: i,
    code: buildInvestorCode(t, i),
    recipient: '',
    sentAt: '',
    nextStep: '',
  }
}

function defaultRows() {
  const rows = []
  for (const tier of TIERS) {
    for (let i = 1; i <= ROW_COUNT; i += 1) {
      rows.push(emptyRow(tier, i))
    }
  }
  return rows
}

function rowFromDb(r) {
  if (!r) return null
  const tier = String(r.tier || '').toLowerCase()
  const rowIndex = Number(r.row_index)
  const code = String(r.code || '').trim() || buildInvestorCode(tier, rowIndex)
  return {
    tier,
    rowIndex,
    code,
    recipient: String(r.recipient || ''),
    sentAt: String(r.sent_at || ''),
    nextStep: String(r.next_step || ''),
  }
}

function publicRow(row) {
  return {
    tier: row.tier,
    rowIndex: row.rowIndex,
    code: row.code,
    recipient: row.recipient,
    sentAt: row.sentAt,
    nextStep: row.nextStep,
  }
}

function mergeWithDefaults(stored) {
  const byKey = new Map()
  for (const r of stored || []) {
    if (!r) continue
    byKey.set(`${r.tier}:${r.rowIndex}`, publicRow(r))
  }
  const out = []
  for (const tier of TIERS) {
    for (let i = 1; i <= ROW_COUNT; i += 1) {
      const key = `${tier}:${i}`
      const existing = byKey.get(key)
      if (existing) {
        out.push({
          ...emptyRow(tier, i),
          ...existing,
          code: existing.code || buildInvestorCode(tier, i),
        })
      } else {
        out.push(emptyRow(tier, i))
      }
    }
  }
  return out
}

function clip(value, max = MAX_TEXT) {
  return String(value ?? '').slice(0, max)
}

function normalizeIncomingRows(input) {
  const list = Array.isArray(input)
    ? input
    : Array.isArray(input?.rows)
      ? input.rows
      : [
          ...(Array.isArray(input?.e) ? input.e : []),
          ...(Array.isArray(input?.p) ? input.p : []),
          ...(Array.isArray(input?.tables?.e) ? input.tables.e : []),
          ...(Array.isArray(input?.tables?.p) ? input.tables.p : []),
        ]

  const byKey = new Map()
  for (const raw of list) {
    if (!raw || typeof raw !== 'object') continue
    const tier = String(raw.tier || '')
      .trim()
      .toLowerCase()
    if (tier !== 'e' && tier !== 'p') continue
    const rowIndex = Number(raw.rowIndex ?? raw.row_index)
    if (!Number.isInteger(rowIndex) || rowIndex < 1 || rowIndex > ROW_COUNT) continue
    byKey.set(`${tier}:${rowIndex}`, {
      tier,
      rowIndex,
      code: clip(raw.code || buildInvestorCode(tier, rowIndex), 64),
      recipient: clip(raw.recipient ?? raw.who ?? '', MAX_TEXT),
      sentAt: clip(raw.sentAt ?? raw.sent_at ?? raw.when ?? '', 120),
      nextStep: clip(raw.nextStep ?? raw.next_step ?? raw.tracker ?? '', MAX_TEXT),
    })
  }
  return byKey
}

/**
 * List all 24 tracker rows (E1–12, P1–12), codes always prefilled.
 */
export async function listInvestorCodeTracking() {
  if (useSupabaseStore()) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('investor_code_tracking')
      .select('*')
      .order('tier', { ascending: true })
      .order('row_index', { ascending: true })
    if (error) {
      if (noteMissingTable(error)) {
        return mergeWithDefaults(mem().rows)
      }
      throw error
    }
    return mergeWithDefaults((data || []).map(rowFromDb))
  }
  return mergeWithDefaults(mem().rows)
}

/**
 * Upsert editable fields for provided rows; returns full 24-row tables.
 */
export async function upsertInvestorCodeTracking(input) {
  const patch = normalizeIncomingRows(input)
  if (patch.size === 0) {
    throw new Error('No valid tracking rows to save')
  }

  const now = new Date().toISOString()

  if (!useSupabaseStore()) {
    const m = mem()
    const current = mergeWithDefaults(m.rows)
    const next = current.map((row) => {
      const hit = patch.get(`${row.tier}:${row.rowIndex}`)
      if (!hit) return row
      return {
        ...row,
        code: hit.code || row.code,
        recipient: hit.recipient,
        sentAt: hit.sentAt,
        nextStep: hit.nextStep,
      }
    })
    m.rows = next
    return next
  }

  const sb = getSupabase()
  const payload = [...patch.values()].map((row) => ({
    tier: row.tier,
    row_index: row.rowIndex,
    code: row.code || buildInvestorCode(row.tier, row.rowIndex),
    recipient: row.recipient,
    sent_at: row.sentAt,
    next_step: row.nextStep,
    updated_at: now,
  }))

  const { error } = await sb.from('investor_code_tracking').upsert(payload, {
    onConflict: 'tier,row_index',
  })
  if (error) {
    if (noteMissingTable(error)) {
      const m = mem()
      const current = mergeWithDefaults(m.rows)
      const next = current.map((row) => {
        const hit = patch.get(`${row.tier}:${row.rowIndex}`)
        if (!hit) return row
        return {
          ...row,
          code: hit.code || row.code,
          recipient: hit.recipient,
          sentAt: hit.sentAt,
          nextStep: hit.nextStep,
        }
      })
      m.rows = next
      return next
    }
    throw error
  }

  return listInvestorCodeTracking()
}

export function groupTrackingByTier(rows) {
  const e = []
  const p = []
  for (const row of rows || []) {
    if (row.tier === 'e') e.push(row)
    else if (row.tier === 'p') p.push(row)
  }
  return { e, p }
}

export function investorCodeTrackingStorageLabel() {
  return useSupabaseStore() ? 'supabase' : 'memory'
}
