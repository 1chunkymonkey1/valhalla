/**
 * Ephemeral in-process store for signups + reservations.
 * Survives warm Vercel instances only — paste/upload ledger in admin for durable view.
 * Swap for Vercel KV / Postgres when ready.
 */

function bag(key) {
  const g = globalThis
  if (!g.__vhStore) g.__vhStore = { signups: [], reservations: [] }
  return g.__vhStore[key]
}

export function addSignup(entry) {
  const list = bag('signups')
  const row = {
    id: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...entry,
    receivedAt: new Date().toISOString(),
  }
  list.unshift(row)
  if (list.length > 2000) list.length = 2000
  return row
}

export function listSignups() {
  return [...bag('signups')]
}

export function addReservation(entry) {
  const list = bag('reservations')
  const row = {
    id: `res_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...entry,
    receivedAt: new Date().toISOString(),
  }
  list.unshift(row)
  if (list.length > 5000) list.length = 5000
  return row
}

export function listReservations() {
  return [...bag('reservations')]
}

export function importReservations(rows) {
  if (!Array.isArray(rows)) return 0
  let n = 0
  for (const row of rows) {
    addReservation({
      ...row,
      imported: true,
      source: row.source || 'ledger_upload',
    })
    n += 1
  }
  return n
}
