import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  fetchAdminSession,
  getAdminSessionCache,
  subscribeAdminSession,
} from '../lib/adminSession'
import {
  clearDemoQueryFromUrl,
  setDemoAuthorized,
  wantsDemoFromQuery,
} from '../lib/simulationClock'

/**
 * Gates demo / time-travel behind founder admin cookie.
 * - Public + ?demo=1 → /admin login
 * - Public + leftover demo localStorage → forced live
 * - Admin session → demo allowed (Reveal controls + ?demo=1)
 */
export default function DemoAccessGate({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [ready, setReady] = useState(() => getAdminSessionCache().known)

  useEffect(() => {
    let cancelled = false

    function apply(session) {
      if (cancelled) return
      setDemoAuthorized(Boolean(session.ok))
      setReady(true)

      if (wantsDemoFromQuery() && !session.ok) {
        clearDemoQueryFromUrl()
        navigate('/admin', { replace: true })
      }
    }

    const unsub = subscribeAdminSession(apply)
    fetchAdminSession().then(apply)

    return () => {
      cancelled = true
      unsub()
    }
  }, [navigate])

  // Re-check when landing on hub with demo query after login in another flow
  useEffect(() => {
    if (!wantsDemoFromQuery()) return
    fetchAdminSession({ force: true }).then((session) => {
      setDemoAuthorized(Boolean(session.ok))
      if (!session.ok) {
        clearDemoQueryFromUrl()
        navigate('/admin', { replace: true })
      }
    })
  }, [location.search, navigate])

  // Don't flash demo UI before we know auth — children still render live clock
  if (!ready && wantsDemoFromQuery()) {
    return children
  }

  return children
}
