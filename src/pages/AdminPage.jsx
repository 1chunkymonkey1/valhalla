import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteMenu from '../components/layout/SiteMenu'
import { formatUsd } from '../data/payLinks'

const ADMIN_EMAIL = 'info@valhallaco.org'

export default function AdminPage() {
  const [auth, setAuth] = useState({ loading: true, ok: false, email: null })
  const [email, setEmail] = useState(ADMIN_EMAIL)
  const [password, setPassword] = useState('')
  const [totp, setTotp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [ledger, setLedger] = useState(null)
  const [localPreview, setLocalPreview] = useState({ reservations: [], signups: [] })

  async function refreshSession() {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    try {
      const res = await fetch('/api/admin/session', {
        credentials: 'include',
        signal: controller.signal,
      })
      const data = await res.json().catch(() => ({}))
      if (data.authenticated) {
        setAuth({ loading: false, ok: true, email: data.email })
        loadLedger().catch(() => {})
      } else {
        setAuth({ loading: false, ok: false, email: null })
      }
    } catch {
      setAuth({ loading: false, ok: false, email: null })
    } finally {
      clearTimeout(timer)
    }
  }

  async function loadLedger() {
    const res = await fetch('/api/admin/ledger', { credentials: 'include' })
    if (!res.ok) return
    const data = await res.json()
    setLedger(data)
  }

  useEffect(() => {
    refreshSession()
    try {
      setLocalPreview({
        reservations: JSON.parse(localStorage.getItem('valhalla_reservation_ledger') || '[]'),
        signups: JSON.parse(localStorage.getItem('valhalla_email_signups') || '[]'),
      })
    } catch {
      // ignore
    }
  }, [])

  async function pastePassword() {
    setError('')
    try {
      const text = await navigator.clipboard.readText()
      if (!text) {
        setError('Clipboard is empty — copy the password first, then Paste.')
        return
      }
      setPassword(text.trim())
    } catch {
      setError('Clipboard blocked by the browser. Type the password, or allow paste for this site.')
    }
  }

  async function login(e) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, totp }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error || 'Login failed')
      return
    }
    setPassword('')
    setTotp('')
    setAuth({ loading: false, ok: true, email: data.email })
    await loadLedger()
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    setAuth({ loading: false, ok: false, email: null })
    setLedger(null)
  }

  async function uploadLocalLedger() {
    const reservations = localPreview.reservations || []
    const res = await fetch('/api/admin/ledger', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservations }),
    })
    const data = await res.json()
    if (res.ok) {
      await loadLedger()
      alert(`Imported ${data.imported} reservation rows from this browser.`)
    } else {
      alert(data.error || 'Import failed')
    }
  }

  if (auth.loading) {
    return (
      <div className="vh-page vh-admin">
        <p className="vh-admin__loading">Checking session…</p>
      </div>
    )
  }

  if (!auth.ok) {
    return (
      <div className="vh-page vh-admin">
        <SiteMenu />
        <form className="vh-admin__gate" onSubmit={login} autoComplete="on">
          <p className="vh-admin__mark">Valhalla</p>
          <h1>Admin</h1>
          <p className="vh-admin__hint">
            Restricted to {ADMIN_EMAIL} · password + authenticator code
          </p>
          <label>
            Email
            <input
              type="email"
              name="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              inputMode="email"
            />
          </label>
          <label>
            Password
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onPaste={(e) => {
                const text = e.clipboardData?.getData('text')
                if (text != null) {
                  e.preventDefault()
                  setPassword(text)
                }
              }}
              autoComplete="current-password"
              spellCheck={false}
            />
          </label>
          <div className="vh-admin__row">
            <button type="button" className="vh-admin__secondary" onClick={pastePassword}>
              Paste password
            </button>
            <button
              type="button"
              className="vh-admin__secondary"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? 'Hide' : 'Show'} password
            </button>
          </div>
          <label className="vh-admin__totp">
            6-digit authenticator code
            <input
              type="text"
              name="one-time-code"
              required
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="000000"
              value={totp}
              onChange={(e) => setTotp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onPaste={(e) => {
                const text = e.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6)
                if (text) {
                  e.preventDefault()
                  setTotp(text)
                }
              }}
              autoComplete="one-time-code"
              autoFocus={false}
            />
            <span className="vh-admin__totp-help">
              From Google Authenticator / Authy / 1Password for info@valhallaco.org
            </span>
          </label>
          {error && <p className="vh-admin__error">{error}</p>}
          <button type="submit">Enter</button>
          <p className="vh-admin__fine">
            Needs <code>ADMIN_PASSWORD</code>, <code>ADMIN_SESSION_SECRET</code>, and{' '}
            <code>ADMIN_TOTP_SECRET</code> on Vercel. Generate the TOTP secret with{' '}
            <code>npm run admin:totp</code>.
          </p>
          <Link to="/">← Hub</Link>
        </form>
      </div>
    )
  }

  return (
    <div className="vh-page vh-admin vh-admin--in">
      <SiteMenu />
      <header className="vh-admin__top">
        <div>
          <p className="vh-admin__mark">Valhalla Admin</p>
          <p>{auth.email}</p>
        </div>
        <button type="button" onClick={logout}>
          Sign out
        </button>
      </header>

      <section className="vh-admin__grid">
        <div className="vh-admin__card">
          <h2>Email signups (server)</h2>
          <p className="vh-admin__count">{ledger?.signups?.length ?? 0}</p>
          <SignupList rows={ledger?.signups || []} />
        </div>
        <div className="vh-admin__card">
          <h2>Reservations (server)</h2>
          <p className="vh-admin__count">{ledger?.reservations?.length ?? 0}</p>
          <ReservationList rows={ledger?.reservations || []} />
        </div>
        <div className="vh-admin__card">
          <h2>This browser ledger</h2>
          <p className="vh-admin__count">
            {localPreview.reservations.length} reservations · {localPreview.signups.length} emails
          </p>
          <button type="button" className="vh-admin__secondary" onClick={uploadLocalLedger}>
            Upload browser reservations to server
          </button>
          <ReservationList rows={localPreview.reservations} />
        </div>
        <div className="vh-admin__card">
          <h2>Company status</h2>
          <ul className="vh-admin__companies">
            {(ledger?.companies || []).map((c) => (
              <li key={c.id}>
                <Link to={`/${c.id}`}>{c.name}</Link>
                <span>
                  {c.domain} · {c.pillar}
                </span>
              </li>
            ))}
          </ul>
          {ledger?.note && <p className="vh-admin__note">{ledger.note}</p>}
        </div>
      </section>
    </div>
  )
}

function SignupList({ rows }) {
  if (!rows.length) return <p className="vh-admin__empty">None yet.</p>
  return (
    <ul className="vh-admin__list">
      {rows.slice(0, 40).map((r, i) => (
        <li key={r.id || `${r.email}-${i}`}>
          <strong>{r.email}</strong>
          <span>
            {r.audience || r.source || '—'} · {r.receivedAt || r.submittedAt || ''}
          </span>
        </li>
      ))}
    </ul>
  )
}

function ReservationList({ rows }) {
  if (!rows.length) return <p className="vh-admin__empty">None yet.</p>
  return (
    <ul className="vh-admin__list">
      {rows.slice(0, 40).map((r, i) => (
        <li key={r.id || `${r.email}-${i}`}>
          <strong>
            {r.companyName || r.companyId} · {r.email}
          </strong>
          <span>
            {r.interestGroup || r.product || 'hold'}
            {r.amountEstimateUsd != null ? ` · ${formatUsd(r.amountEstimateUsd)}` : ''}
            {r.refundable ? ' · refundable' : ''}
          </span>
        </li>
      ))}
    </ul>
  )
}
