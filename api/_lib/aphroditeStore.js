/**
 * Aphrodite data layer — profiles, swipes, matches, subscription fields.
 * Prefers Supabase; falls back to in-memory demo store when unset.
 */

import { getSupabase, isSupabaseConfigured } from './supabase.js'

const INTENT_OPTIONS = ['love', 'friends', 'competition']
const COMPETITION_OPTIONS = [
  'chess',
  'sports',
  'clash-royale',
  'esports',
  'track',
  'other',
]

/** @type {Map<string, object>} */
const memProfiles = new Map()
/** @type {Map<string, object>} */
const memSwipes = new Map()
/** @type {Map<string, object>} */
const memMatches = new Map()

function nowIso() {
  return new Date().toISOString()
}

function publicProfile(row) {
  if (!row) return null
  return {
    id: row.id,
    email: row.email || null,
    displayName: row.display_name || row.displayName || '',
    bio: row.bio || '',
    birthDate: row.birth_date || row.birthDate || null,
    intents: row.intents || [],
    competitions: row.competitions || [],
    chessCom: row.chess_com || row.chessCom || '',
    maxpreps: row.maxpreps || '',
    instagram: row.instagram || '',
    clashRoyale: row.clash_royale || row.clashRoyale || '',
    avatarUrl: row.avatar_url || row.avatarUrl || '',
    signedUpAt: row.signed_up_at || row.signedUpAt || null,
    approvedAt: row.approved_at || row.approvedAt || null,
    subscriptionStatus: row.subscription_status || row.subscriptionStatus || 'none',
    subscriptionCurrentPeriodEnd:
      row.subscription_current_period_end || row.subscriptionCurrentPeriodEnd || null,
    authProviders: row.auth_providers || row.authProviders || [],
    active: row.active !== false,
  }
}

function hasActiveSub(row) {
  const status = row?.subscription_status || row?.subscriptionStatus || 'none'
  return status === 'active' || status === 'trialing'
}

function seedDemoDeck() {
  if (memProfiles.size > 0) return
  const seeds = [
    {
      id: 'demo-a',
      auth_user_id: 'demo-a',
      email: 'rook@example.com',
      display_name: 'Rook',
      bio: 'Chess first. Competition always.',
      intents: ['competition', 'friends'],
      competitions: ['chess'],
      chess_com: 'rook_demo',
      maxpreps: '',
      instagram: '',
      clash_royale: '',
      signed_up_at: nowIso(),
      approved_at: nowIso(),
      subscription_status: 'active',
      active: true,
    },
    {
      id: 'demo-b',
      auth_user_id: 'demo-b',
      email: 'ace@example.com',
      display_name: 'Ace',
      bio: 'Track + Clash Royale ladder climbs.',
      intents: ['love', 'competition'],
      competitions: ['track', 'clash-royale'],
      chess_com: '',
      maxpreps: 'ace-demo',
      instagram: 'ace.demo',
      clash_royale: '#2PP0DEMO',
      signed_up_at: nowIso(),
      approved_at: nowIso(),
      subscription_status: 'active',
      active: true,
    },
    {
      id: 'demo-c',
      auth_user_id: 'demo-c',
      email: 'storm@example.com',
      display_name: 'Storm',
      bio: 'Varsity tennis. Looking for sparring partners.',
      intents: ['friends', 'competition'],
      competitions: ['sports'],
      chess_com: '',
      maxpreps: 'storm-hs',
      instagram: '',
      clash_royale: '',
      signed_up_at: nowIso(),
      approved_at: nowIso(),
      subscription_status: 'active',
      active: true,
    },
  ]
  for (const s of seeds) memProfiles.set(s.id, s)
}

function sanitizeHandle(value, max = 80) {
  return String(value || '')
    .trim()
    .replace(/^@/, '')
    .slice(0, max)
}

function sanitizeList(list, allowed) {
  const set = new Set(allowed)
  return (Array.isArray(list) ? list : [])
    .map((x) => String(x || '').trim().toLowerCase())
    .filter((x) => set.has(x))
    .slice(0, 12)
}

export function aphroditeCatalog() {
  return {
    intents: INTENT_OPTIONS,
    competitions: COMPETITION_OPTIONS,
    priceCents: 2000,
    priceLabel: '$20/month',
  }
}

export async function upsertProfileFromAuth(user, extras = {}) {
  const authUserId = user.id
  const email = String(user.email || '')
    .trim()
    .toLowerCase() || null
  const provider = String(
    user.app_metadata?.provider ||
      extras.provider ||
      user.identities?.[0]?.provider ||
      'email',
  ).toLowerCase()

  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { data: existing } = await sb
      .from('aphrodite_profiles')
      .select('*')
      .eq('auth_user_id', authUserId)
      .maybeSingle()

    if (existing) {
      const providers = Array.from(
        new Set([...(existing.auth_providers || []), provider].filter(Boolean)),
      )
      const patch = {
        email: email || existing.email,
        auth_providers: providers,
        updated_at: nowIso(),
      }
      const { data, error } = await sb
        .from('aphrodite_profiles')
        .update(patch)
        .eq('id', existing.id)
        .select('*')
        .single()
      if (error) throw error
      return publicProfile(data)
    }

    const row = {
      auth_user_id: authUserId,
      email,
      display_name:
        extras.displayName ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        (email ? email.split('@')[0] : 'Member'),
      bio: '',
      intents: sanitizeList(extras.intents, INTENT_OPTIONS),
      competitions: sanitizeList(extras.competitions, COMPETITION_OPTIONS),
      chess_com: sanitizeHandle(extras.chessCom),
      maxpreps: sanitizeHandle(extras.maxpreps),
      instagram: sanitizeHandle(extras.instagram),
      clash_royale: sanitizeHandle(extras.clashRoyale, 120),
      signed_up_at: nowIso(),
      approved_at: nowIso(),
      subscription_status: 'none',
      auth_providers: [provider],
      active: true,
      updated_at: nowIso(),
    }
    const { data, error } = await sb
      .from('aphrodite_profiles')
      .insert(row)
      .select('*')
      .single()
    if (error) throw error
    return publicProfile(data)
  }

  // Memory fallback
  seedDemoDeck()
  let found = null
  for (const p of memProfiles.values()) {
    if (p.auth_user_id === authUserId) {
      found = p
      break
    }
  }
  if (found) {
    found.email = email || found.email
    found.auth_providers = Array.from(
      new Set([...(found.auth_providers || []), provider].filter(Boolean)),
    )
    found.updated_at = nowIso()
    return publicProfile(found)
  }

  const id = `mem-${authUserId}`
  const row = {
    id,
    auth_user_id: authUserId,
    email,
    display_name:
      extras.displayName ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      (email ? email.split('@')[0] : 'Member'),
    bio: '',
    intents: sanitizeList(extras.intents, INTENT_OPTIONS),
    competitions: sanitizeList(extras.competitions, COMPETITION_OPTIONS),
    chess_com: sanitizeHandle(extras.chessCom),
    maxpreps: sanitizeHandle(extras.maxpreps),
    instagram: sanitizeHandle(extras.instagram),
    clash_royale: sanitizeHandle(extras.clashRoyale, 120),
    signed_up_at: nowIso(),
    approved_at: nowIso(),
    subscription_status: 'none',
    auth_providers: [provider],
    active: true,
    updated_at: nowIso(),
  }
  memProfiles.set(id, row)
  return publicProfile(row)
}

export async function getProfileByAuthUserId(authUserId) {
  if (!authUserId) return null
  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('aphrodite_profiles')
      .select('*')
      .eq('auth_user_id', authUserId)
      .maybeSingle()
    if (error) throw error
    return publicProfile(data)
  }
  seedDemoDeck()
  for (const p of memProfiles.values()) {
    if (p.auth_user_id === authUserId) return publicProfile(p)
  }
  return null
}

export async function getProfileById(id) {
  if (!id) return null
  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('aphrodite_profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data
  }
  seedDemoDeck()
  return memProfiles.get(id) || null
}

export async function updateProfile(profileId, patch) {
  const fields = {}
  if (patch.displayName != null) fields.display_name = String(patch.displayName).slice(0, 80)
  if (patch.bio != null) fields.bio = String(patch.bio).slice(0, 600)
  if (patch.birthDate != null) fields.birth_date = patch.birthDate || null
  if (patch.intents != null) fields.intents = sanitizeList(patch.intents, INTENT_OPTIONS)
  if (patch.competitions != null) {
    fields.competitions = sanitizeList(patch.competitions, COMPETITION_OPTIONS)
  }
  if (patch.chessCom != null) fields.chess_com = sanitizeHandle(patch.chessCom)
  if (patch.maxpreps != null) fields.maxpreps = sanitizeHandle(patch.maxpreps)
  if (patch.instagram != null) fields.instagram = sanitizeHandle(patch.instagram)
  if (patch.clashRoyale != null) fields.clash_royale = sanitizeHandle(patch.clashRoyale, 120)
  if (patch.avatarUrl != null) fields.avatar_url = String(patch.avatarUrl).slice(0, 500)
  fields.updated_at = nowIso()

  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('aphrodite_profiles')
      .update(fields)
      .eq('id', profileId)
      .select('*')
      .single()
    if (error) throw error
    return publicProfile(data)
  }

  const row = memProfiles.get(profileId)
  if (!row) throw new Error('Profile not found')
  Object.assign(row, fields, {
    display_name: fields.display_name ?? row.display_name,
    chess_com: fields.chess_com ?? row.chess_com,
    clash_royale: fields.clash_royale ?? row.clash_royale,
  })
  return publicProfile(row)
}

export async function setSubscriptionState(profileId, state) {
  const fields = {
    subscription_status: state.status || 'none',
    stripe_customer_id: state.customerId || null,
    stripe_subscription_id: state.subscriptionId || null,
    subscription_current_period_end: state.currentPeriodEnd || null,
    updated_at: nowIso(),
  }
  if (state.status === 'active' || state.status === 'trialing') {
    fields.approved_at = nowIso()
  }

  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('aphrodite_profiles')
      .update(fields)
      .eq('id', profileId)
      .select('*')
      .single()
    if (error) throw error
    return publicProfile(data)
  }

  const row = memProfiles.get(profileId)
  if (!row) throw new Error('Profile not found')
  Object.assign(row, fields)
  if (fields.approved_at) row.approved_at = fields.approved_at
  return publicProfile(row)
}

export async function setSubscriptionByCustomerId(customerId, state) {
  if (!customerId) return null
  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { data: existing } = await sb
      .from('aphrodite_profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .maybeSingle()
    if (!existing) return null
    return setSubscriptionState(existing.id, state)
  }
  for (const p of memProfiles.values()) {
    if (p.stripe_customer_id === customerId) {
      return setSubscriptionState(p.id, state)
    }
  }
  return null
}

export async function setSubscriptionByAuthOrProfile({ profileId, customerId, state }) {
  if (profileId) return setSubscriptionState(profileId, { ...state, customerId })
  if (customerId) return setSubscriptionByCustomerId(customerId, state)
  return null
}

export async function listDeck(viewerProfileId, { limit = 20 } = {}) {
  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { data: swiped } = await sb
      .from('aphrodite_swipes')
      .select('to_profile_id')
      .eq('from_profile_id', viewerProfileId)
    const exclude = new Set((swiped || []).map((s) => s.to_profile_id))
    exclude.add(viewerProfileId)

    const { data, error } = await sb
      .from('aphrodite_profiles')
      .select('*')
      .eq('active', true)
      .in('subscription_status', ['active', 'trialing'])
      .order('signed_up_at', { ascending: false })
      .limit(80)
    if (error) throw error
    return (data || [])
      .filter((p) => !exclude.has(p.id))
      .slice(0, limit)
      .map(publicProfile)
  }

  seedDemoDeck()
  const swiped = new Set()
  for (const s of memSwipes.values()) {
    if (s.from_profile_id === viewerProfileId) swiped.add(s.to_profile_id)
  }
  return [...memProfiles.values()]
    .filter(
      (p) =>
        p.id !== viewerProfileId &&
        p.active !== false &&
        hasActiveSub(p) &&
        !swiped.has(p.id),
    )
    .slice(0, limit)
    .map(publicProfile)
}

export async function recordSwipe(fromId, toId, direction) {
  const dir = direction === 'like' ? 'like' : 'pass'
  if (fromId === toId) throw new Error('Cannot swipe yourself')

  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { error } = await sb.from('aphrodite_swipes').upsert(
      {
        from_profile_id: fromId,
        to_profile_id: toId,
        direction: dir,
      },
      { onConflict: 'from_profile_id,to_profile_id' },
    )
    if (error) throw error

    let match = null
    if (dir === 'like') {
      const { data: reciprocal } = await sb
        .from('aphrodite_swipes')
        .select('id')
        .eq('from_profile_id', toId)
        .eq('to_profile_id', fromId)
        .eq('direction', 'like')
        .maybeSingle()
      if (reciprocal) {
        const [a, b] = fromId < toId ? [fromId, toId] : [toId, fromId]
        const { data: m, error: mErr } = await sb
          .from('aphrodite_matches')
          .upsert({ profile_a: a, profile_b: b }, { onConflict: 'profile_a,profile_b' })
          .select('*')
          .single()
        if (mErr) throw mErr
        match = { id: m.id, createdAt: m.created_at, otherProfileId: toId }
      }
    }
    return { ok: true, matched: Boolean(match), match }
  }

  const key = `${fromId}:${toId}`
  memSwipes.set(key, {
    from_profile_id: fromId,
    to_profile_id: toId,
    direction: dir,
    created_at: nowIso(),
  })

  let match = null
  if (dir === 'like') {
    const back = memSwipes.get(`${toId}:${fromId}`)
    if (back?.direction === 'like') {
      const [a, b] = fromId < toId ? [fromId, toId] : [toId, fromId]
      const mKey = `${a}:${b}`
      const m = {
        id: mKey,
        profile_a: a,
        profile_b: b,
        created_at: nowIso(),
      }
      memMatches.set(mKey, m)
      match = { id: m.id, createdAt: m.created_at, otherProfileId: toId }
    }
  }
  return { ok: true, matched: Boolean(match), match }
}

export async function listMatches(profileId) {
  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('aphrodite_matches')
      .select('*')
      .or(`profile_a.eq.${profileId},profile_b.eq.${profileId}`)
      .order('created_at', { ascending: false })
    if (error) throw error

    const otherIds = (data || []).map((m) =>
      m.profile_a === profileId ? m.profile_b : m.profile_a,
    )
    if (!otherIds.length) return []

    const { data: profiles } = await sb
      .from('aphrodite_profiles')
      .select('*')
      .in('id', otherIds)
    const byId = new Map((profiles || []).map((p) => [p.id, publicProfile(p)]))
    return (data || []).map((m) => {
      const otherId = m.profile_a === profileId ? m.profile_b : m.profile_a
      return {
        id: m.id,
        createdAt: m.created_at,
        profile: byId.get(otherId) || { id: otherId },
      }
    })
  }

  const out = []
  for (const m of memMatches.values()) {
    if (m.profile_a !== profileId && m.profile_b !== profileId) continue
    const otherId = m.profile_a === profileId ? m.profile_b : m.profile_a
    out.push({
      id: m.id,
      createdAt: m.created_at,
      profile: publicProfile(memProfiles.get(otherId)),
    })
  }
  return out
}

export function isSubscribed(profile) {
  return (
    profile?.subscriptionStatus === 'active' || profile?.subscriptionStatus === 'trialing'
  )
}
