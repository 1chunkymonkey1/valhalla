/** Client-side 18+ helpers. Server copy lives in api/_lib/aphroditeStore.js. */

export const APHRODITE_MIN_AGE = 18

export function aphroditeAgeYears(birthDate, now = new Date()) {
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

export function aphroditeAdultStatus(birthDate, now = new Date()) {
  const age = aphroditeAgeYears(birthDate, now)
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
