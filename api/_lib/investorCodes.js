/**
 * Investor access codes (P = small / retail, E = elephant / large).
 *
 * Generation algorithm (admin + docs only — never expose on /investors):
 *
 * E codes (digits of e ≈ 2.718281828459045…):
 *   Decimal digit stream after the point: 718281828459045…
 *   4-digit blocks: [7182, 8182, 8459, 0452, …]
 *   For release k (1-based): use the (k+1)-th block (0-based index k),
 *   code = "e" + block + String(k)
 *   Examples: E#1 = e81821, E#2 = e84592
 *
 * P codes (digits of pi ≈ 3.141592653589793…):
 *   Decimal digit stream: 141592653589793…
 *   4-digit blocks: [1415, 9265, 3589, 7932, …]
 *   For release k (1-based): use the (k+2)-th block (0-based index k+1),
 *   code = "p" + block + String(k)
 *   Examples: P#1 = p35891, P#2 = p79322
 *
 * Persist in Supabase investor_codes; memory fallback when unset.
 */

import { createHmac, timingSafeEqual } from 'node:crypto'
import { getSupabase, isSupabaseConfigured } from './supabase.js'

const COOKIE = 'vh_investor'
const COOKIE_TTL_MS = 30 * 24 * 60 * 60 * 1000

/** Enough digits for many releases (admin-generated sequentially). */
const E_DECIMALS =
  '718281828459045235360287471352662497757247093699959574966967627724076630353547594571382178525166427427466391932003059921817413596629043572900334295260595630738132328627943490763233829880753195251019011573834187930702154089149934884554845323456848001869606493822656526356370942'
const PI_DECIMALS =
  '14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196442881097566593344612847564823378678316527120190914564856692346034861045432664821339360726024914127'

function mem() {
  const g = globalThis
  if (!g.__vhInvestorCodes) {
    g.__vhInvestorCodes = { rows: [], seq: { p: 0, e: 0 } }
  }
  return g.__vhInvestorCodes
}

/** When investor_codes table is missing, stay on memory for this process. */
let forceMemory = false

function useSupabaseStore() {
  return isSupabaseConfigured() && !forceMemory
}

function isMissingInvestorTable(err) {
  if (!err) return false
  if (err.code === '42P01') return true
  const msg = `${err.message || ''} ${err.details || ''} ${err.hint || ''}`
  return /investor_codes/i.test(msg) && /(does not exist|could not find the table|schema cache)/i.test(msg)
}

function noteMissingTable(err) {
  if (isMissingInvestorTable(err)) {
    forceMemory = true
    return true
  }
  return false
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''
}

function b64url(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function fromB64url(str) {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4))
  const s = str.replace(/-/g, '+').replace(/_/g, '/') + pad
  return Buffer.from(s, 'base64')
}

export function normalizeInvestorCode(code) {
  return String(code || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
}

function fourDigitBlock(digits, zeroBasedIndex) {
  const start = zeroBasedIndex * 4
  if (start + 4 > digits.length) {
    throw new Error(`Digit stream exhausted at block index ${zeroBasedIndex}`)
  }
  return digits.slice(start, start + 4)
}

/**
 * Build the next code string for tier + 1-based sequence.
 * @param {'p'|'e'} tier
 * @param {number} sequence 1-based release index k
 */
export function buildInvestorCode(tier, sequence) {
  const k = Number(sequence)
  if (!Number.isInteger(k) || k < 1) throw new Error('sequence must be a positive integer')
  const t = String(tier || '').toLowerCase()
  if (t === 'e') {
    const block = fourDigitBlock(E_DECIMALS, k) // (k+1)-th block → 0-based index k
    return `e${block}${k}`
  }
  if (t === 'p') {
    const block = fourDigitBlock(PI_DECIMALS, k + 1) // (k+2)-th block → 0-based index k+1
    return `p${block}${k}`
  }
  throw new Error('tier must be p or e')
}

function rowFromDb(r) {
  if (!r) return null
  return {
    id: r.id,
    code: normalizeInvestorCode(r.code),
    tier: r.tier,
    sequence: r.sequence_number,
    createdAt: r.created_at || null,
    createdBy: r.created_by || '',
    redeemedAt: r.redeemed_at || null,
    redeemerNote: r.redeemer_note || '',
    active: r.active !== false,
  }
}

function publicRow(row) {
  return {
    id: row.id,
    code: row.code,
    tier: row.tier,
    sequence: row.sequence,
    createdAt: row.createdAt,
    createdBy: row.createdBy,
    redeemedAt: row.redeemedAt,
    redeemerNote: row.redeemerNote,
    active: row.active,
  }
}

async function nextSequence(tier) {
  const t = String(tier).toLowerCase()
  if (useSupabaseStore()) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('investor_codes')
      .select('sequence_number')
      .eq('tier', t)
      .order('sequence_number', { ascending: false })
      .limit(1)
    if (error) {
      if (noteMissingTable(error)) {
        /* fall through to memory */
      } else {
        throw error
      }
    } else {
      const max = data?.[0]?.sequence_number || 0
      return max + 1
    }
  }
  const m = mem()
  const maxExisting = m.rows
    .filter((r) => r.tier === t)
    .reduce((acc, r) => Math.max(acc, r.sequence), 0)
  const next = maxExisting + 1
  m.seq[t] = next
  return next
}

function seedStartersIntoMemory(createdBySafe) {
  const starters = [
    { tier: 'e', sequence: 1 },
    { tier: 'p', sequence: 1 },
  ]
  const m = mem()
  const now = new Date().toISOString()
  const seeded = []
  for (const s of starters) {
    const code = buildInvestorCode(s.tier, s.sequence)
    let row = m.rows.find((r) => r.code === code)
    if (!row) {
      row = {
        id: `mem-${s.tier}-${s.sequence}`,
        code,
        tier: s.tier,
        sequence: s.sequence,
        createdAt: now,
        createdBy: createdBySafe,
        redeemedAt: null,
        redeemerNote: '',
        active: true,
      }
      m.rows.push(row)
      m.seq[s.tier] = Math.max(m.seq[s.tier] || 0, s.sequence)
    }
    seeded.push(publicRow(row))
  }
  return seeded
}

/**
 * Idempotent seed of E#1 (e81821) and P#1 (p35891).
 * Runs on admin list / redeem / generate so production unlocks without a manual issue
 * when the table is empty (or memory fallback is cold).
 */
export async function ensureStarterCodes(createdBy = 'system-seed') {
  const starters = [
    { tier: 'e', sequence: 1 },
    { tier: 'p', sequence: 1 },
  ]
  const createdBySafe = String(createdBy || 'system-seed').slice(0, 120)

  if (useSupabaseStore()) {
    const sb = getSupabase()
    const seeded = []
    for (const s of starters) {
      const code = buildInvestorCode(s.tier, s.sequence)
      const { data: existing, error: findErr } = await sb
        .from('investor_codes')
        .select('*')
        .eq('code', code)
        .maybeSingle()
      if (findErr) {
        if (noteMissingTable(findErr)) return seedStartersIntoMemory(createdBySafe)
        throw findErr
      }
      if (existing) {
        seeded.push(publicRow(rowFromDb(existing)))
        continue
      }
      const { data, error } = await sb
        .from('investor_codes')
        .insert({
          code,
          tier: s.tier,
          sequence_number: s.sequence,
          created_by: createdBySafe,
          active: true,
        })
        .select('*')
        .maybeSingle()
      if (error) {
        if (noteMissingTable(error)) return seedStartersIntoMemory(createdBySafe)
        // Concurrent seed / unique race — re-read
        if (error.code === '23505') {
          const { data: again } = await sb
            .from('investor_codes')
            .select('*')
            .eq('code', code)
            .maybeSingle()
          if (again) seeded.push(publicRow(rowFromDb(again)))
          continue
        }
        throw error
      }
      if (data) seeded.push(publicRow(rowFromDb(data)))
    }
    return seeded
  }

  return seedStartersIntoMemory(createdBySafe)
}

export async function listInvestorCodesAdmin() {
  await ensureStarterCodes()
  if (useSupabaseStore()) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('investor_codes')
      .select('*')
      .order('tier', { ascending: true })
      .order('sequence_number', { ascending: true })
    if (error) {
      if (noteMissingTable(error)) return mem().rows.map(publicRow)
      throw error
    }
    return (data || []).map((r) => publicRow(rowFromDb(r)))
  }
  return mem().rows.map(publicRow)
}

export async function generateInvestorCode(tier, createdBy = '') {
  const t = String(tier || '')
    .trim()
    .toLowerCase()
  if (t !== 'p' && t !== 'e') throw new Error('tier must be p (small) or e (elephant)')

  await ensureStarterCodes(createdBy || 'system-seed')

  const sequence = await nextSequence(t)
  const code = buildInvestorCode(t, sequence)
  const now = new Date().toISOString()
  const createdBySafe = String(createdBy || '').slice(0, 120)

  if (!useSupabaseStore()) {
    const row = {
      id: `mem-${t}-${sequence}`,
      code,
      tier: t,
      sequence,
      createdAt: now,
      createdBy: createdBySafe,
      redeemedAt: null,
      redeemerNote: '',
      active: true,
    }
    mem().rows.push(row)
    return publicRow(row)
  }

  const sb = getSupabase()
  const { data, error } = await sb
    .from('investor_codes')
    .insert({
      code,
      tier: t,
      sequence_number: sequence,
      created_by: createdBySafe,
      active: true,
    })
    .select('*')
    .single()
  if (error) {
    if (noteMissingTable(error)) {
      const row = {
        id: `mem-${t}-${sequence}`,
        code,
        tier: t,
        sequence,
        createdAt: now,
        createdBy: createdBySafe,
        redeemedAt: null,
        redeemerNote: '',
        active: true,
      }
      mem().rows.push(row)
      return publicRow(row)
    }
    throw error
  }
  return publicRow(rowFromDb(data))
}

export async function setInvestorCodeActive(id, active) {
  const want = Boolean(active)
  if (!useSupabaseStore()) {
    const row = mem().rows.find((r) => r.id === id)
    if (!row) throw new Error('Code not found')
    row.active = want
    return publicRow(row)
  }
  const sb = getSupabase()
  const { data, error } = await sb
    .from('investor_codes')
    .update({ active: want })
    .eq('id', id)
    .select('*')
    .maybeSingle()
  if (error) {
    if (noteMissingTable(error)) {
      const row = mem().rows.find((r) => r.id === id)
      if (!row) throw new Error('Code not found')
      row.active = want
      return publicRow(row)
    }
    throw error
  }
  if (!data) throw new Error('Code not found')
  return publicRow(rowFromDb(data))
}

async function findActiveByCode(normalized) {
  if (!normalized) return null
  if (useSupabaseStore()) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('investor_codes')
      .select('*')
      .eq('code', normalized)
      .eq('active', true)
      .maybeSingle()
    if (error) {
      if (noteMissingTable(error)) {
        return mem().rows.find((r) => r.code === normalized && r.active) || null
      }
      throw error
    }
    return rowFromDb(data)
  }
  return mem().rows.find((r) => r.code === normalized && r.active) || null
}

export async function redeemInvestorCode(attempt, redeemerNote = '') {
  const normalized = normalizeInvestorCode(attempt)
  if (!normalized) return { ok: false, error: 'Enter a code' }

  // Ensure E1/P1 exist before lookup (cold memory instances + empty Supabase table).
  await ensureStarterCodes()

  const row = await findActiveByCode(normalized)
  if (!row) return { ok: false, error: 'Invalid or inactive code' }

  const note = String(redeemerNote || '').slice(0, 280)
  const now = new Date().toISOString()

  if (useSupabaseStore()) {
    const sb = getSupabase()
    const patch = { redeemed_at: row.redeemedAt || now }
    if (note) patch.redeemer_note = note
    const { error } = await sb.from('investor_codes').update(patch).eq('id', row.id)
    if (error && !noteMissingTable(error)) {
      // Non-fatal for unlock if redeem stamp fails after a valid match
      console.error('[investorCodes] redeem stamp failed', error.message || error)
    }
  } else {
    if (!row.redeemedAt) row.redeemedAt = now
    if (note) row.redeemerNote = note
  }

  return {
    ok: true,
    tier: row.tier,
    sequence: row.sequence,
    code: row.code,
  }
}

export function parseInvestorCookie(req) {
  const header = req.headers.cookie || ''
  let raw = ''
  for (const part of header.split(';')) {
    const i = part.indexOf('=')
    if (i < 0) continue
    const k = part.slice(0, i).trim()
    if (k === COOKIE) {
      raw = decodeURIComponent(part.slice(i + 1).trim())
      break
    }
  }
  if (!raw) return null
  const secret = sessionSecret()
  if (!secret) return null
  const [body, sig] = raw.split('.')
  if (!body || !sig) return null
  const expected = createHmac('sha256', secret).update(`investor:${body}`).digest()
  let given
  try {
    given = fromB64url(sig)
  } catch {
    return null
  }
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  try {
    const payload = JSON.parse(fromB64url(body).toString('utf8'))
    if (!payload?.exp || Date.now() > payload.exp) return null
    if (payload.tier !== 'p' && payload.tier !== 'e') return null
    return { tier: payload.tier, sequence: payload.sequence || null, code: payload.code || '' }
  } catch {
    return null
  }
}

export function signInvestorCookie({ tier, sequence, code }) {
  const secret = sessionSecret()
  if (!secret) throw new Error('ADMIN_SESSION_SECRET not configured')
  const payload = {
    tier,
    sequence: sequence || null,
    code: normalizeInvestorCode(code),
    iat: Date.now(),
    exp: Date.now() + COOKIE_TTL_MS,
  }
  const body = b64url(JSON.stringify(payload))
  const sig = createHmac('sha256', secret).update(`investor:${body}`).digest()
  return `${body}.${b64url(sig)}`
}

export function setInvestorCookie(res, session) {
  const token = signInvestorCookie(session)
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  const parts = [
    `${COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.floor(COOKIE_TTL_MS / 1000)}`,
  ]
  if (secure) parts.push('Secure')
  const prev = res.getHeader?.('Set-Cookie')
  if (!prev) {
    res.setHeader('Set-Cookie', parts.join('; '))
  } else if (Array.isArray(prev)) {
    res.setHeader('Set-Cookie', [...prev, parts.join('; ')])
  } else {
    res.setHeader('Set-Cookie', [prev, parts.join('; ')])
  }
}

export function clearInvestorCookie(res) {
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  const parts = [`${COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0']
  if (secure) parts.push('Secure')
  const prev = res.getHeader?.('Set-Cookie')
  if (!prev) {
    res.setHeader('Set-Cookie', parts.join('; '))
  } else if (Array.isArray(prev)) {
    res.setHeader('Set-Cookie', [...prev, parts.join('; ')])
  } else {
    res.setHeader('Set-Cookie', [prev, parts.join('; ')])
  }
}

/** Deterministic first codes (also auto-seeded via ensureStarterCodes). */
export const EXAMPLE_CODES = {
  e1: buildInvestorCode('e', 1),
  p1: buildInvestorCode('p', 1),
}

export function investorCodesStorageLabel() {
  return useSupabaseStore() ? 'supabase' : 'memory'
}
