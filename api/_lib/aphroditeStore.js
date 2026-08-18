/**
 * Aphrodite data layer — profiles, swipes, matches, messages, safety, subscription.
 * Prefers Supabase; falls back to in-memory demo store when unset.
 */

import { getSupabase, isSupabaseConfigured } from './supabase.js'

export const APHRODITE_MIN_AGE = 18
export const REPORT_REASONS = ['harassment', 'fake', 'underage', 'spam', 'other']
export const IAP_PRODUCT_ID = 'aphrodite_monthly'

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
/** @type {Map<string, object>} */
const memBlocks = new Map()
/** @type {object[]} */
const memReports = []
/** @type {Map<string, object[]>} */
const memMessages = new Map()

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
      birth_date: '1994-03-12',
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
      birth_date: '1996-07-04',
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
      birth_date: '1995-11-21',
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
    minAge: APHRODITE_MIN_AGE,
    iapProductId: IAP_PRODUCT_ID,
    reportReasons: REPORT_REASONS,
  }
}

export function ageYears(birthDate, now = new Date()) {
  const raw = String(birthDate || '').trim().slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null
  const [y, m, d] = raw.split('-').map(Number)
  const birth = new Date(Date.UTC(y, m - 1, d))
  if (Number.isNaN(birth.getTime())) return null
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  let age = today.getUTCFullYear() - birth.getUTCFullYear()
  const monthDelta = today.getUTCMonth() - birth.getUTCMonth()
  if (monthDelta < 0 || (monthDelta === 0 && today.getUTCDate() < birth.getUTCDate())) age -= 1
  return age
}

export function adultStatus(birthDate, now = new Date()) {
  const age = ageYears(birthDate, now)
  if (age == null) {
    return {
      ok: false,
      code: 'age_required',
      error: 'Birth date required. Aphrodite is 18+.',
    }
  }
  if (age < APHRODITE_MIN_AGE) {
    return {
      ok: false,
      code: 'underage',
      error: 'Aphrodite is for people 18 and older.',
    }
  }
  return { ok: true, age }
}

export function isAdult(profile) {
  return adultStatus(profile?.birthDate || profile?.birth_date).ok
}

export function resetAphroditeMemory() {
  memProfiles.clear()
  memSwipes.clear()
  memMatches.clear()
  memBlocks.clear()
  memReports.length = 0
  memMessages.clear()
}

function blockKey(fromId, toId) {
  return `${fromId}:${toId}`
}

function pairKey(a, b) {
  return a < b ? `${a}:${b}` : `${b}:${a}`
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
      if (extras.birthDate || extras.birth_date) {
        const status = adultStatus(extras.birthDate || extras.birth_date)
        if (!status.ok) {
          const err = new Error(status.error)
          err.code = status.code
          throw err
        }
        patch.birth_date = String(extras.birthDate || extras.birth_date).slice(0, 10)
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

  const birth = extras.birthDate || extras.birth_date || null
  if (birth) {
    const status = adultStatus(birth)
    if (!status.ok) {
      const err = new Error(status.error)
      err.code = status.code
      throw err
    }
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
      birth_date: extras.birthDate || extras.birth_date || null,
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
    if (extras.birthDate || extras.birth_date) {
      const status = adultStatus(extras.birthDate || extras.birth_date)
      if (!status.ok) {
        const err = new Error(status.error)
        err.code = status.code
        throw err
      }
      found.birth_date = String(extras.birthDate || extras.birth_date).slice(0, 10)
    }
    found.updated_at = nowIso()
    return publicProfile(found)
  }

  const birthMem = extras.birthDate || extras.birth_date || null
  if (birthMem) {
    const status = adultStatus(birthMem)
    if (!status.ok) {
      const err = new Error(status.error)
      err.code = status.code
      throw err
    }
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
    birth_date: extras.birthDate || extras.birth_date || null,
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
  if (patch.birthDate != null || patch.birth_date != null) {
    const nextBirth = patch.birthDate ?? patch.birth_date
    const status = adultStatus(nextBirth)
    if (!status.ok) {
      const err = new Error(status.error)
      err.code = status.code
      throw err
    }
    fields.birth_date = String(nextBirth).slice(0, 10)
  }
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

async function blockedIdsFor(profileId) {
  const ids = new Set()
  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { data } = await sb
      .from('aphrodite_blocks')
      .select('from_profile_id, to_profile_id')
      .or(`from_profile_id.eq.${profileId},to_profile_id.eq.${profileId}`)
    for (const row of data || []) {
      ids.add(row.from_profile_id === profileId ? row.to_profile_id : row.from_profile_id)
    }
    return ids
  }
  for (const b of memBlocks.values()) {
    if (b.from_profile_id === profileId) ids.add(b.to_profile_id)
    if (b.to_profile_id === profileId) ids.add(b.from_profile_id)
  }
  return ids
}

export async function isBlockedPair(a, b) {
  if (!a || !b || a === b) return false
  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { data } = await sb
      .from('aphrodite_blocks')
      .select('id')
      .or(
        `and(from_profile_id.eq.${a},to_profile_id.eq.${b}),and(from_profile_id.eq.${b},to_profile_id.eq.${a})`,
      )
      .limit(1)
    return Boolean(data?.length)
  }
  return memBlocks.has(blockKey(a, b)) || memBlocks.has(blockKey(b, a))
}

export async function listDeck(viewerProfileId, { limit = 20 } = {}) {
  const blocked = await blockedIdsFor(viewerProfileId)
  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { data: swiped } = await sb
      .from('aphrodite_swipes')
      .select('to_profile_id')
      .eq('from_profile_id', viewerProfileId)
    const exclude = new Set((swiped || []).map((s) => s.to_profile_id))
    exclude.add(viewerProfileId)
    for (const id of blocked) exclude.add(id)

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
        !swiped.has(p.id) &&
        !blocked.has(p.id),
    )
    .slice(0, limit)
    .map(publicProfile)
}

export async function recordSwipe(fromId, toId, direction) {
  const dir = direction === 'like' ? 'like' : 'pass'
  if (fromId === toId) throw new Error('Cannot swipe yourself')
  if (await isBlockedPair(fromId, toId)) throw new Error('This member is not available')

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
    const blocked = await blockedIdsFor(profileId)
    const rows = (data || []).filter((m) => {
      const otherId = m.profile_a === profileId ? m.profile_b : m.profile_a
      return !blocked.has(otherId)
    })
    const previews = await lastMessagesForMatches(rows.map((m) => m.id))
    return rows.map((m) => {
      const otherId = m.profile_a === profileId ? m.profile_b : m.profile_a
      return {
        id: m.id,
        createdAt: m.created_at,
        lastMessage: previews.get(m.id) || null,
        profile: byId.get(otherId) || { id: otherId },
      }
    })
  }

  const blocked = await blockedIdsFor(profileId)
  const out = []
  for (const m of memMatches.values()) {
    if (m.profile_a !== profileId && m.profile_b !== profileId) continue
    const otherId = m.profile_a === profileId ? m.profile_b : m.profile_a
    if (blocked.has(otherId)) continue
    const thread = memMessages.get(m.id) || []
    const last = thread[thread.length - 1]
    out.push({
      id: m.id,
      createdAt: m.created_at,
      lastMessage: last
        ? { id: last.id, body: last.body, createdAt: last.created_at, fromProfileId: last.from_profile_id }
        : null,
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

async function lastMessagesForMatches(matchIds) {
  const map = new Map()
  if (!matchIds.length) return map
  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { data } = await sb
      .from('aphrodite_messages')
      .select('id, match_id, from_profile_id, body, created_at')
      .in('match_id', matchIds)
      .order('created_at', { ascending: false })
    for (const row of data || []) {
      if (map.has(row.match_id)) continue
      map.set(row.match_id, {
        id: row.id,
        body: row.body,
        createdAt: row.created_at,
        fromProfileId: row.from_profile_id,
      })
    }
  }
  return map
}

export async function getMatchForViewer(matchId, viewerId) {
  if (!matchId || !viewerId) return null
  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('aphrodite_matches')
      .select('*')
      .eq('id', matchId)
      .maybeSingle()
    if (error) throw error
    if (!data) return null
    if (data.profile_a !== viewerId && data.profile_b !== viewerId) return null
    const otherId = data.profile_a === viewerId ? data.profile_b : data.profile_a
    if (await isBlockedPair(viewerId, otherId)) return null
    const other = await getProfileById(otherId)
    return {
      id: data.id,
      createdAt: data.created_at,
      otherProfileId: otherId,
      profile: publicProfile(other),
    }
  }
  const m = memMatches.get(matchId)
  if (!m) return null
  if (m.profile_a !== viewerId && m.profile_b !== viewerId) return null
  const otherId = m.profile_a === viewerId ? m.profile_b : m.profile_a
  if (await isBlockedPair(viewerId, otherId)) return null
  return {
    id: m.id,
    createdAt: m.created_at,
    otherProfileId: otherId,
    profile: publicProfile(memProfiles.get(otherId)),
  }
}

export async function listMessages(matchId, viewerId, { limit = 80 } = {}) {
  const match = await getMatchForViewer(matchId, viewerId)
  if (!match) {
    const err = new Error('Match not found')
    err.code = 'not_found'
    throw err
  }
  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('aphrodite_messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true })
      .limit(limit)
    if (error) throw error
    return (data || []).map((row) => ({
      id: row.id,
      matchId: row.match_id,
      fromProfileId: row.from_profile_id,
      body: row.body,
      createdAt: row.created_at,
      mine: row.from_profile_id === viewerId,
    }))
  }
  const thread = memMessages.get(matchId) || []
  return thread.slice(-limit).map((row) => ({
    id: row.id,
    matchId: row.match_id,
    fromProfileId: row.from_profile_id,
    body: row.body,
    createdAt: row.created_at,
    mine: row.from_profile_id === viewerId,
  }))
}

export async function sendMessage(matchId, fromId, body) {
  const text = String(body || '').trim().slice(0, 2000)
  if (!text) {
    const err = new Error('Message required')
    err.code = 'empty'
    throw err
  }
  const match = await getMatchForViewer(matchId, fromId)
  if (!match) {
    const err = new Error('Match not found')
    err.code = 'not_found'
    throw err
  }
  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('aphrodite_messages')
      .insert({
        match_id: matchId,
        from_profile_id: fromId,
        body: text,
      })
      .select('*')
      .single()
    if (error) throw error
    return {
      id: data.id,
      matchId: data.match_id,
      fromProfileId: data.from_profile_id,
      body: data.body,
      createdAt: data.created_at,
      mine: true,
    }
  }
  const row = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    match_id: matchId,
    from_profile_id: fromId,
    body: text,
    created_at: nowIso(),
  }
  const thread = memMessages.get(matchId) || []
  thread.push(row)
  memMessages.set(matchId, thread)
  return {
    id: row.id,
    matchId: row.match_id,
    fromProfileId: row.from_profile_id,
    body: row.body,
    createdAt: row.created_at,
    mine: true,
  }
}

export async function blockProfile(fromId, toId) {
  if (!fromId || !toId || fromId === toId) throw new Error('Invalid block')
  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { error } = await sb.from('aphrodite_blocks').upsert(
      { from_profile_id: fromId, to_profile_id: toId },
      { onConflict: 'from_profile_id,to_profile_id' },
    )
    if (error) throw error
    const [a, b] = fromId < toId ? [fromId, toId] : [toId, fromId]
    await sb.from('aphrodite_matches').delete().eq('profile_a', a).eq('profile_b', b)
    return { ok: true, blocked: toId }
  }
  memBlocks.set(blockKey(fromId, toId), {
    from_profile_id: fromId,
    to_profile_id: toId,
    created_at: nowIso(),
  })
  memMatches.delete(pairKey(fromId, toId))
  return { ok: true, blocked: toId }
}

export async function reportProfile(fromId, toId, reason, details = '') {
  if (!fromId || !toId || fromId === toId) throw new Error('Invalid report')
  const why = String(reason || '').trim().toLowerCase()
  if (!REPORT_REASONS.includes(why)) throw new Error('Invalid report reason')
  const note = String(details || '').trim().slice(0, 800)
  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('aphrodite_reports')
      .insert({
        from_profile_id: fromId,
        to_profile_id: toId,
        reason: why,
        details: note,
      })
      .select('id, created_at')
      .single()
    if (error) throw error
    return { ok: true, id: data.id, createdAt: data.created_at, reason: why }
  }
  const row = {
    id: `rep-${Date.now()}`,
    from_profile_id: fromId,
    to_profile_id: toId,
    reason: why,
    details: note,
    created_at: nowIso(),
  }
  memReports.push(row)
  return { ok: true, id: row.id, createdAt: row.created_at, reason: why }
}

export async function deactivateProfile(profileId) {
  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('aphrodite_profiles')
      .update({ active: false, updated_at: nowIso() })
      .eq('id', profileId)
      .select('*')
      .single()
    if (error) throw error
    return publicProfile(data)
  }
  const row = memProfiles.get(profileId)
  if (!row) throw new Error('Profile not found')
  row.active = false
  row.updated_at = nowIso()
  return publicProfile(row)
}

export async function activateIapMembership(profileId, { productId, transactionId } = {}) {
  if (productId && productId !== IAP_PRODUCT_ID) {
    const err = new Error('Unknown App Store product')
    err.code = 'iap_product'
    throw err
  }
  return setSubscriptionState(profileId, {
    status: 'active',
    customerId: transactionId ? `iap_${transactionId}` : 'iap_apple',
    subscriptionId: transactionId || 'iap_sub',
    currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
  })
}
