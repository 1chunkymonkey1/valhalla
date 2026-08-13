/**
 * Per-company social links for the admin social tower.
 */

import { getSupabase, isSupabaseConfigured } from './supabase.js'

export const SOCIAL_HALLS = [
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

const EMPTY = {
  linkedin: '',
  instagram: '',
  x: '',
  discord: '',
  followerNotes: '',
  lastChecked: null,
}

function mem() {
  const g = globalThis
  if (!g.__vhSocials) g.__vhSocials = {}
  return g.__vhSocials
}

function mapRow(row) {
  if (!row) return null
  return {
    companyId: row.company_id || row.companyId,
    linkedin: row.linkedin || '',
    instagram: row.instagram || '',
    x: row.x || row.twitter || '',
    discord: row.discord || '',
    followerNotes: row.follower_notes || row.followerNotes || '',
    lastChecked: row.last_checked || row.lastChecked || null,
    updatedAt: row.updated_at || row.updatedAt || null,
  }
}

export async function listCompanySocials() {
  if (!isSupabaseConfigured()) {
    return SOCIAL_HALLS.map((id) => ({
      companyId: id,
      ...(mem()[id] || EMPTY),
    }))
  }

  const sb = getSupabase()
  const { data, error } = await sb.from('company_socials').select('*')
  if (error) throw error
  const byId = Object.fromEntries((data || []).map((r) => [r.company_id, mapRow(r)]))
  return SOCIAL_HALLS.map((id) => byId[id] || { companyId: id, ...EMPTY })
}

export async function getCompanySocial(companyId) {
  if (!SOCIAL_HALLS.includes(companyId)) return null
  if (!isSupabaseConfigured()) {
    return { companyId, ...(mem()[companyId] || EMPTY) }
  }
  const sb = getSupabase()
  const { data, error } = await sb
    .from('company_socials')
    .select('*')
    .eq('company_id', companyId)
    .maybeSingle()
  if (error) throw error
  return mapRow(data) || { companyId, ...EMPTY }
}

export async function upsertCompanySocial(companyId, patch) {
  if (!SOCIAL_HALLS.includes(companyId)) throw new Error('Unknown company')
  const now = new Date().toISOString()
  const row = {
    companyId,
    linkedin: String(patch.linkedin ?? '').trim().slice(0, 500),
    instagram: String(patch.instagram ?? '').trim().slice(0, 500),
    x: String(patch.x ?? patch.twitter ?? '').trim().slice(0, 500),
    discord: String(patch.discord ?? '').trim().slice(0, 500),
    followerNotes: String(patch.followerNotes ?? '').trim().slice(0, 1000),
    lastChecked: patch.lastChecked || null,
    updatedAt: now,
  }

  if (!isSupabaseConfigured()) {
    mem()[companyId] = {
      linkedin: row.linkedin,
      instagram: row.instagram,
      x: row.x,
      discord: row.discord,
      followerNotes: row.followerNotes,
      lastChecked: row.lastChecked,
      updatedAt: now,
    }
    return { companyId, ...mem()[companyId] }
  }

  const sb = getSupabase()
  const payload = {
    company_id: companyId,
    linkedin: row.linkedin,
    instagram: row.instagram,
    x: row.x,
    discord: row.discord,
    follower_notes: row.followerNotes,
    last_checked: row.lastChecked,
    updated_at: now,
  }
  const { error } = await sb.from('company_socials').upsert(payload, { onConflict: 'company_id' })
  if (error) throw error
  return getCompanySocial(companyId)
}

/** Public-safe socials (URLs only, no internal notes). */
export function toPublicSocial(row) {
  if (!row) return null
  const out = { companyId: row.companyId }
  if (row.linkedin) out.linkedin = row.linkedin
  if (row.instagram) out.instagram = row.instagram
  if (row.x) out.x = row.x
  if (row.discord) out.discord = row.discord
  return out
}
