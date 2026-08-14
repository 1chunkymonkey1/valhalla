/**
 * Founder dispatch queue. Seed is canonical content. Overlay holds edits + status.
 * Nothing is emailed by this module. "Send" returns a compose URL for the founder.
 */

import { getSupabase, isSupabaseConfigured } from './supabase.js'
import { DISPATCH_FROM, DISPATCH_SEED } from './dispatchSeed.js'

const STATUSES = new Set(['draft', 'approved', 'sent'])

function mem() {
  const g = globalThis
  if (!g.__vhDispatch) g.__vhDispatch = { overlays: new Map() }
  return g.__vhDispatch
}

function blankOverlay(id) {
  return {
    id,
    status: 'draft',
    held: false,
    recipient: null,
    subject: null,
    body: null,
    applyUrl: null,
    approvedAt: null,
    approvedBy: null,
    sentAt: null,
    sentBy: null,
    updatedAt: null,
    updatedBy: null,
  }
}

function mapRow(row) {
  if (!row) return null
  return {
    id: row.id,
    status: row.status || 'draft',
    held: Boolean(row.held),
    recipient: row.recipient ?? null,
    subject: row.subject ?? null,
    body: row.body ?? null,
    applyUrl: row.apply_url ?? row.applyUrl ?? null,
    approvedAt: row.approved_at || row.approvedAt || null,
    approvedBy: row.approved_by || row.approvedBy || null,
    sentAt: row.sent_at || row.sentAt || null,
    sentBy: row.sent_by || row.sentBy || null,
    updatedAt: row.updated_at || row.updatedAt || null,
    updatedBy: row.updated_by || row.updatedBy || null,
  }
}

function mergeItem(seed, overlay) {
  const o = overlay || blankOverlay(seed.id)
  const to = o.recipient != null && o.recipient !== '' ? o.recipient : seed.to
  const subject = o.subject != null && o.subject !== '' ? o.subject : seed.subject
  const body = o.body != null && o.body !== '' ? o.body : seed.body
  const applyUrl = o.applyUrl != null && o.applyUrl !== '' ? o.applyUrl : seed.applyUrl
  const status = STATUSES.has(o.status) ? o.status : 'draft'
  return {
    ...seed,
    to,
    subject,
    body,
    applyUrl,
    status,
    held: Boolean(o.held),
    approvedAt: o.approvedAt,
    approvedBy: o.approvedBy,
    sentAt: o.sentAt,
    sentBy: o.sentBy,
    updatedAt: o.updatedAt,
    updatedBy: o.updatedBy,
    canSend: canSend({ ...seed, to, applyUrl, status, held: Boolean(o.held) }),
  }
}

function canSend(item) {
  if (item.gated === 'no-send') return false
  if (item.held) return false
  if (item.status !== 'approved') return false
  if (item.channel === 'internal' && item.gated === 'no-send') return false
  if (item.channel === 'email') return Boolean(item.to && item.to.includes('@'))
  if (item.channel === 'application') return Boolean(item.applyUrl)
  if (item.channel === 'internal') return Boolean(item.to && item.to.includes('@'))
  return false
}

async function loadOverlays() {
  if (!isSupabaseConfigured()) {
    return mem().overlays
  }
  const sb = getSupabase()
  const { data, error } = await sb.from('dispatch_items').select('*')
  if (error) {
    if (/dispatch_items|schema cache|does not exist/i.test(error.message || '')) {
      return mem().overlays
    }
    throw error
  }
  const map = new Map()
  for (const row of data || []) {
    const overlay = mapRow(row)
    if (overlay) map.set(overlay.id, overlay)
  }
  return map
}

async function saveOverlay(overlay) {
  mem().overlays.set(overlay.id, overlay)
  if (!isSupabaseConfigured()) return overlay
  const sb = getSupabase()
  const payload = {
    id: overlay.id,
    status: overlay.status,
    held: overlay.held,
    recipient: overlay.recipient ?? '',
    subject: overlay.subject ?? '',
    body: overlay.body ?? '',
    apply_url: overlay.applyUrl ?? '',
    approved_at: overlay.approvedAt,
    approved_by: overlay.approvedBy,
    sent_at: overlay.sentAt,
    sent_by: overlay.sentBy,
    updated_at: overlay.updatedAt || new Date().toISOString(),
    updated_by: overlay.updatedBy,
  }
  const { error } = await sb.from('dispatch_items').upsert(payload, { onConflict: 'id' })
  if (error) {
    if (/dispatch_items|schema cache|does not exist/i.test(error.message || '')) {
      return overlay
    }
    throw error
  }
  return overlay
}

export async function listDispatchItems() {
  const overlays = await loadOverlays()
  const items = DISPATCH_SEED.map((seed) => mergeItem(seed, overlays.get(seed.id)))
  const pending = items.filter((i) => i.status !== 'sent' && i.gated !== 'no-send').length
  const approved = items.filter((i) => i.status === 'approved').length
  return {
    from: DISPATCH_FROM,
    storage: isSupabaseConfigured() ? 'supabase' : 'memory',
    pending,
    approved,
    items,
  }
}

export async function getDispatchItem(id) {
  const { items, storage, from } = await listDispatchItems()
  const item = items.find((i) => i.id === id)
  if (!item) return null
  return { item, storage, from }
}

function seedById(id) {
  return DISPATCH_SEED.find((s) => s.id === id) || null
}

export async function updateDispatchItem(id, patch, actor) {
  const seed = seedById(id)
  if (!seed) throw new Error('Unknown dispatch item')
  const overlays = await loadOverlays()
  const prev = overlays.get(id) || blankOverlay(id)
  const next = { ...prev, id, updatedAt: new Date().toISOString(), updatedBy: actor }

  if (patch.to != null) next.recipient = String(patch.to)
  if (patch.subject != null) next.subject = String(patch.subject)
  if (patch.body != null) next.body = String(patch.body)
  if (patch.applyUrl != null) next.applyUrl = String(patch.applyUrl)
  if (patch.held != null) next.held = Boolean(patch.held)

  const contentChanged =
    (patch.to != null && patch.to !== (prev.recipient ?? seed.to)) ||
    (patch.subject != null && patch.subject !== (prev.subject ?? seed.subject)) ||
    (patch.body != null && patch.body !== (prev.body ?? seed.body)) ||
    (patch.applyUrl != null && patch.applyUrl !== (prev.applyUrl ?? seed.applyUrl))

  if (contentChanged && prev.status === 'approved') {
    next.status = 'draft'
    next.approvedAt = null
    next.approvedBy = null
  }

  await saveOverlay(next)
  const merged = await getDispatchItem(id)
  return merged.item
}

export async function approveDispatchItem(id, actor) {
  const seed = seedById(id)
  if (!seed) throw new Error('Unknown dispatch item')
  const overlays = await loadOverlays()
  const prev = overlays.get(id) || blankOverlay(id)
  if (prev.status === 'sent') throw new Error('Already sent')
  const next = {
    ...prev,
    id,
    status: 'approved',
    approvedAt: new Date().toISOString(),
    approvedBy: actor,
    updatedAt: new Date().toISOString(),
    updatedBy: actor,
  }
  await saveOverlay(next)
  return (await getDispatchItem(id)).item
}

export async function unapproveDispatchItem(id, actor) {
  const overlays = await loadOverlays()
  const prev = overlays.get(id) || blankOverlay(id)
  if (prev.status === 'sent') throw new Error('Already sent')
  const next = {
    ...prev,
    id,
    status: 'draft',
    approvedAt: null,
    approvedBy: null,
    updatedAt: new Date().toISOString(),
    updatedBy: actor,
  }
  await saveOverlay(next)
  return (await getDispatchItem(id)).item
}

export function buildCompose(item) {
  if (!canSend(item)) {
    const reasons = []
    if (item.gated === 'no-send') reasons.push('This item cannot be sent')
    if (item.held) reasons.push('Held')
    if (item.status !== 'approved') reasons.push('Approve first')
    if (item.gated === 'demeter-first') reasons.push('Sequenced after Demeter — override by approving, then send')
    if (item.gated === 'land-loi') reasons.push('Gated on a land LOI')
    if (item.channel === 'email' && !(item.to && item.to.includes('@'))) {
      reasons.push('Add a recipient email')
    }
    if (item.channel === 'application' && !item.applyUrl) reasons.push('Add an application URL')
    throw new Error(reasons[0] || 'Cannot send')
  }

  if (item.channel === 'application') {
    return {
      method: 'application',
      url: item.applyUrl,
      copy: item.body,
      warning:
        'Opens the application page. Paste the answers. Nothing is submitted until you submit on that site. Come back and Mark sent.',
    }
  }

  const params = new URLSearchParams()
  params.set('view', 'cm')
  params.set('fs', '1')
  params.set('to', item.to)
  if (item.subject) params.set('su', item.subject)
  const body = item.body || ''
  if (body.length <= 1800) params.set('body', body)
  const gmail = `https://mail.google.com/mail/?${params.toString()}`
  const mailto = `mailto:${encodeURIComponent(item.to)}?subject=${encodeURIComponent(item.subject || '')}&body=${encodeURIComponent(body)}`
  return {
    method: 'email',
    url: gmail,
    mailto,
    copy: body,
    from: DISPATCH_FROM,
    warning:
      body.length > 1800
        ? 'Body is long. Gmail compose has the address and subject. Paste the body from the clipboard. Click Send in Gmail, then Mark sent here.'
        : 'Gmail will open. Click Send in Gmail. Then come back and Mark sent. This button does not transmit the email.',
  }
}

export async function prepareSend(id) {
  const found = await getDispatchItem(id)
  if (!found) throw new Error('Unknown dispatch item')
  if (found.item.gated === 'demeter-first' && found.item.status === 'approved') {
    // Founder overrode sequence by approving. Allow send.
  }
  if (found.item.gated === 'land-loi' && found.item.status === 'approved') {
    // Same: approve is the override.
  }
  return { item: found.item, compose: buildCompose(found.item) }
}

export async function markDispatchSent(id, actor) {
  const found = await getDispatchItem(id)
  if (!found) throw new Error('Unknown dispatch item')
  if (found.item.status !== 'approved' && found.item.status !== 'sent') {
    throw new Error('Approve and open Send before marking sent')
  }
  const overlays = await loadOverlays()
  const prev = overlays.get(id) || blankOverlay(id)
  const next = {
    ...prev,
    id,
    status: 'sent',
    sentAt: new Date().toISOString(),
    sentBy: actor,
    updatedAt: new Date().toISOString(),
    updatedBy: actor,
  }
  await saveOverlay(next)
  return (await getDispatchItem(id)).item
}
