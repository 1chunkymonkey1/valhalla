/**
 * Signups + reservations — Supabase when configured, else in-memory fallback.
 */

import { randomBytes } from 'node:crypto'
import { getSupabase, isSupabaseConfigured } from './supabase.js'

function mem() {
  const g = globalThis
  if (!g.__vhStore) g.__vhStore = { signups: [], reservations: [] }
  return g.__vhStore
}

function nid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${randomBytes(4).toString('hex')}`
}

function mapSignup(row) {
  if (!row) return null
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    audience: row.audience,
    source: row.source,
    companyId: row.company_id,
    receivedAt: row.received_at,
    ...(row.payload || {}),
  }
}

function mapReservation(row) {
  if (!row) return null
  return {
    id: row.id,
    companyId: row.company_id,
    companyName: row.company_name,
    product: row.product,
    name: row.name,
    email: row.email,
    phone: row.phone,
    zip: row.zip,
    interestGroup: row.interest_group,
    reservationType: row.reservation_type,
    refundable: row.refundable,
    paymentCaptured: row.payment_captured,
    payLinkId: row.pay_link_id,
    amountEstimateUsd: row.amount_estimate_usd,
    status: row.status,
    submittedAt: row.submitted_at,
    receivedAt: row.received_at,
    imported: row.imported,
    source: row.source,
    ...(row.payload || {}),
  }
}

export async function addSignup(entry) {
  const id = nid('sig')
  const receivedAt = new Date().toISOString()
  const row = {
    id,
    email: entry.email,
    name: entry.name ?? null,
    audience: entry.audience ?? null,
    source: entry.source ?? null,
    companyId: entry.companyId ?? null,
    receivedAt,
  }

  if (!isSupabaseConfigured()) {
    mem().signups.unshift(row)
    if (mem().signups.length > 2000) mem().signups.length = 2000
    return row
  }

  const sb = getSupabase()
  const { data, error } = await sb
    .from('signups')
    .insert({
      id,
      email: entry.email,
      name: entry.name ?? null,
      audience: entry.audience ?? null,
      source: entry.source ?? null,
      company_id: entry.companyId ?? null,
      received_at: receivedAt,
      payload: {},
    })
    .select()
    .single()
  if (error) throw error
  return mapSignup(data)
}

export async function listSignups() {
  if (!isSupabaseConfigured()) return [...mem().signups]

  const sb = getSupabase()
  const { data, error } = await sb
    .from('signups')
    .select('*')
    .order('received_at', { ascending: false })
    .limit(2000)
  if (error) throw error
  return (data || []).map(mapSignup)
}

export async function addReservation(entry) {
  const id = nid('res')
  const receivedAt = new Date().toISOString()
  const row = {
    id,
    ...entry,
    receivedAt,
  }

  if (!isSupabaseConfigured()) {
    mem().reservations.unshift(row)
    if (mem().reservations.length > 5000) mem().reservations.length = 5000
    return row
  }

  const sb = getSupabase()
  const { data, error } = await sb
    .from('reservations')
    .insert({
      id,
      company_id: entry.companyId ?? null,
      company_name: entry.companyName ?? null,
      product: entry.product ?? null,
      name: entry.name ?? null,
      email: entry.email ?? null,
      phone: entry.phone ?? null,
      zip: entry.zip ?? null,
      interest_group: entry.interestGroup ?? null,
      reservation_type: entry.reservationType ?? null,
      refundable: entry.refundable !== false,
      payment_captured: Boolean(entry.paymentCaptured),
      pay_link_id: entry.payLinkId ?? null,
      amount_estimate_usd: entry.amountEstimateUsd ?? null,
      status: entry.status ?? null,
      submitted_at: entry.submittedAt ?? null,
      received_at: receivedAt,
      imported: Boolean(entry.imported),
      source: entry.source ?? null,
      payload: {},
    })
    .select()
    .single()
  if (error) throw error
  return mapReservation(data)
}

export async function listReservations() {
  if (!isSupabaseConfigured()) return [...mem().reservations]

  const sb = getSupabase()
  const { data, error } = await sb
    .from('reservations')
    .select('*')
    .order('received_at', { ascending: false })
    .limit(5000)
  if (error) throw error
  return (data || []).map(mapReservation)
}

export async function importReservations(rows) {
  if (!Array.isArray(rows)) return 0
  let n = 0
  for (const row of rows) {
    await addReservation({
      ...row,
      companyId: row.companyId || row.company_id,
      companyName: row.companyName || row.company_name,
      interestGroup: row.interestGroup || row.interest_group,
      imported: true,
      source: row.source || 'ledger_upload',
    })
    n += 1
  }
  return n
}
