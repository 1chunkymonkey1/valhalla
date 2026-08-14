/**
 * Client-side founder admin session probe (cookie `vh_admin_session`).
 * Used to gate demo / simulation clock — never trust localStorage alone.
 */

let cached = { known: false, ok: false, email: null, promise: null }

const LISTENERS = new Set()

function notify() {
  for (const fn of LISTENERS) {
    try {
      fn(cached)
    } catch {
      /* ignore */
    }
  }
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(
        new CustomEvent('valhalla-admin-session', { detail: { ok: cached.ok } }),
      )
    } catch {
      /* ignore */
    }
  }
}

export function getAdminSessionCache() {
  return { known: cached.known, ok: cached.ok, email: cached.email }
}

export function subscribeAdminSession(fn) {
  LISTENERS.add(fn)
  return () => LISTENERS.delete(fn)
}

/** Force a fresh check (e.g. after login/logout). */
export function invalidateAdminSession() {
  cached = { known: false, ok: false, email: null, promise: null }
}

/**
 * @returns {Promise<{ known: boolean, ok: boolean, email: string | null }>}
 */
export async function fetchAdminSession({ force = false } = {}) {
  if (!force && cached.promise) return cached.promise
  if (!force && cached.known) {
    return { known: true, ok: cached.ok, email: cached.email }
  }

  cached.promise = (async () => {
    try {
      const res = await fetch('/api/admin/session', { credentials: 'include' })
      if (!res.ok) {
        cached = { known: true, ok: false, email: null, promise: null }
        notify()
        return { known: true, ok: false, email: null }
      }
      const data = await res.json().catch(() => ({}))
      // API shape: { ok: true, authenticated: boolean, email? }
      const ok = Boolean(data?.authenticated)
      cached = {
        known: true,
        ok,
        email: ok ? data.email || null : null,
        promise: null,
      }
      notify()
      return { known: true, ok: cached.ok, email: cached.email }
    } catch {
      cached = { known: true, ok: false, email: null, promise: null }
      notify()
      return { known: true, ok: false, email: null }
    }
  })()

  return cached.promise
}

/** Mark session known after an in-page login (avoids waiting for another round-trip). */
export function markAdminSessionOk(email) {
  cached = {
    known: true,
    ok: true,
    email: email || null,
    promise: null,
  }
  notify()
}

export function markAdminSessionLoggedOut() {
  cached = { known: true, ok: false, email: null, promise: null }
  notify()
}
