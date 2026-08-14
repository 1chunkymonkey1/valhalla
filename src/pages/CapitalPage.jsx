import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import CapitalDesk from '../components/CapitalDesk'
import { fetchAdminSession } from '../lib/adminSession'

const NEXT = '/capital'

export default function CapitalPage() {
  const location = useLocation()
  const [auth, setAuth] = useState({ loading: true, ok: false })

  useEffect(() => {
    document.title = 'Capital · Demeter'
    let cancelled = false
    fetchAdminSession({ force: true }).then((s) => {
      if (!cancelled) setAuth({ loading: false, ok: s.ok })
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (auth.loading) {
    return (
      <div className="vh-page vh-capital-page vh-capital-page--gate">
        <p className="vh-admin__loading">Checking session…</p>
      </div>
    )
  }

  if (!auth.ok) {
    try {
      sessionStorage.setItem('vh_admin_next', NEXT)
    } catch {
      /* ignore */
    }
    return <Navigate to={`/admin?next=${encodeURIComponent(NEXT)}`} replace state={{ from: location }} />
  }

  return (
    <div className="vh-page vh-capital-page">
      <nav className="vh-capital__nav">
        <Link to="/admin">Admin</Link>
        <span aria-hidden="true">·</span>
        <Link to="/">Hub</Link>
      </nav>
      <CapitalDesk />
    </div>
  )
}
