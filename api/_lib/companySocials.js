/**
 * Per-company social links for the admin social tower.
 * Empty rows are filled with suggested placeholder URLs (not yet claimed accounts).
 */

import { getSupabase, isSupabaseConfigured } from './supabase.js'

export const SOCIAL_HALLS = [
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

/** Shared Valhalla Discord — safe default for every hall until hall-specific invites exist. */
export const VALHALLA_DISCORD = 'https://discord.gg/JA6wrNg6n'

/** Empire hub Instagram (real account). */
export const VALHALLA_INSTAGRAM = 'https://www.instagram.com/valhalla__42/'

/**
 * Default public socials for empty rows (memory seed + first Supabase write).
 * Wolf / Holm Instagram are live accounts. Other IG/X handles are suggested
 * placeholders until claimed — LinkedIn stays empty until real pages exist.
 * Placeholders only fill empty fields.
 */
export const SOCIAL_PLACEHOLDERS = {
  hub: {
    instagram: VALHALLA_INSTAGRAM,
    x: '',
    linkedin: '',
    discord: VALHALLA_DISCORD,
  },
  wolf: {
    instagram: 'https://www.instagram.com/wolf_transit/',
    x: '',
    linkedin: '',
    discord: VALHALLA_DISCORD,
  },
  viking: {
    instagram: 'https://www.instagram.com/viking_marine/',
    x: 'https://x.com/viking_marine',
    linkedin: '',
    discord: VALHALLA_DISCORD,
  },
  eagle: {
    instagram: 'https://www.instagram.com/eagle_aviation/',
    x: 'https://x.com/eagle_aviation',
    linkedin: '',
    discord: VALHALLA_DISCORD,
  },
  phenix: {
    instagram: 'https://www.instagram.com/phenix_aerospace/',
    x: 'https://x.com/phenix_aerospace',
    linkedin: '',
    discord: VALHALLA_DISCORD,
  },
  holm: {
    instagram: 'https://www.instagram.com/holm_development/',
    x: '',
    linkedin: '',
    discord: VALHALLA_DISCORD,
  },
  atoll: {
    instagram: 'https://www.instagram.com/atoll_living/',
    x: 'https://x.com/atoll_living',
    linkedin: '',
    discord: VALHALLA_DISCORD,
  },
  olympus: {
    instagram: 'https://www.instagram.com/olympus_habitat/',
    x: 'https://x.com/olympus_habitat',
    linkedin: '',
    discord: VALHALLA_DISCORD,
  },
  aether: {
    instagram: 'https://www.instagram.com/aether_orbit/',
    x: 'https://x.com/aether_orbit',
    linkedin: '',
    discord: VALHALLA_DISCORD,
  },
  demeter: {
    instagram: 'https://www.instagram.com/demeter_energy/',
    x: 'https://x.com/demeter_energy',
    linkedin: '',
    discord: VALHALLA_DISCORD,
  },
  njord: {
    instagram: 'https://www.instagram.com/njord_water/',
    x: 'https://x.com/njord_water',
    linkedin: '',
    discord: VALHALLA_DISCORD,
  },
  aeolus: {
    instagram: 'https://www.instagram.com/aeolus_climate/',
    x: 'https://x.com/aeolus_climate',
    linkedin: '',
    discord: VALHALLA_DISCORD,
  },
  corvus: {
    instagram: 'https://www.instagram.com/corvus_intel/',
    x: 'https://x.com/corvus_intel',
    linkedin: '',
    discord: VALHALLA_DISCORD,
  },
}

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

function applyPlaceholders(companyId, row) {
  const ph = SOCIAL_PLACEHOLDERS[companyId] || {}
  const base = { companyId, ...EMPTY, ...(row || {}) }
  const out = { ...base }
  const seededFields = []
  for (const key of ['linkedin', 'instagram', 'x', 'discord']) {
    if (!String(out[key] || '').trim() && ph[key]) {
      out[key] = ph[key]
      seededFields.push(key)
    }
  }
  out.placeholderFields = seededFields
  out.isPlaceholder = seededFields.length > 0
  return out
}

let seedAttempted = false

/** Persist placeholders into empty store rows once per cold start (best-effort). */
async function seedEmptyRows(rows) {
  if (seedAttempted) return rows
  seedAttempted = true
  const next = []
  for (const row of rows) {
    const filled = applyPlaceholders(row.companyId, row)
    const needsWrite =
      filled.placeholderFields.length > 0 &&
      !row.linkedin &&
      !row.instagram &&
      !row.x &&
      !row.discord
    if (needsWrite) {
      try {
        const saved = await upsertCompanySocial(row.companyId, {
          linkedin: filled.linkedin,
          instagram: filled.instagram,
          x: filled.x,
          discord: filled.discord,
          followerNotes:
            row.followerNotes ||
            'Placeholder URLs — create/claim accounts, then replace with real links.',
          lastChecked: row.lastChecked,
        })
        next.push(applyPlaceholders(row.companyId, saved))
      } catch {
        next.push(filled)
      }
    } else {
      next.push(filled)
    }
  }
  return next
}

export async function listCompanySocials() {
  let rows
  if (!isSupabaseConfigured()) {
    rows = SOCIAL_HALLS.map((id) => ({
      companyId: id,
      ...(mem()[id] || EMPTY),
    }))
  } else {
    const sb = getSupabase()
    const { data, error } = await sb.from('company_socials').select('*')
    if (error) throw error
    const byId = Object.fromEntries((data || []).map((r) => [r.company_id, mapRow(r)]))
    rows = SOCIAL_HALLS.map((id) => byId[id] || { companyId: id, ...EMPTY })
  }
  return seedEmptyRows(rows)
}

export async function getCompanySocial(companyId) {
  if (!SOCIAL_HALLS.includes(companyId)) return null
  if (!isSupabaseConfigured()) {
    return applyPlaceholders(companyId, { companyId, ...(mem()[companyId] || EMPTY) })
  }
  const sb = getSupabase()
  const { data, error } = await sb
    .from('company_socials')
    .select('*')
    .eq('company_id', companyId)
    .maybeSingle()
  if (error) throw error
  return applyPlaceholders(companyId, mapRow(data) || { companyId, ...EMPTY })
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
    return applyPlaceholders(companyId, { companyId, ...mem()[companyId] })
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
  if (row.isPlaceholder) out.placeholder = true
  return out
}
