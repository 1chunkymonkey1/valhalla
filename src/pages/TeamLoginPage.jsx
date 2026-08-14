import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SiteMenu from '../components/layout/SiteMenu'
import {
  clearBrowserSupabaseSession,
  getGoogleAccessToken,
  isSupabaseBrowserConfigured,
  startGoogleOAuth,
  takeOAuthIntent,
} from '../lib/supabaseBrowser'

export default function TeamLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [googleReady, setGoogleReady] = useState(false)
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/team/auth-options')
        const data = await res.json().catch(() => ({}))
        if (!cancelled) setGoogleReady(Boolean(data.google && isSupabaseBrowserConfigured()))
      } catch {
        if (!cancelled) setGoogleReady(isSupabaseBrowserConfigured())
      }

      const intent = takeOAuthIntent()
      if (intent?.kind === 'team' && isSupabaseBrowserConfigured()) {
        setBusy(true)
        try {
          const accessToken = await getGoogleAccessToken()
          if (accessToken) {
            const res = await fetch('/api/team/login-google', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ accessToken }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
              if (!cancelled) setError(data.error || 'Google sign-in failed')
            } else {
              await clearBrowserSupabaseSession()
              if (!cancelled) navigate('/team')
              return
            }
          }
        } catch (err) {
          if (!cancelled) setError(err.message || 'Google sign-in failed')
        } finally {
          if (!cancelled) setBusy(false)
        }
      }
      if (!cancelled) setBooting(false)
    })()
    return () => {
      cancelled = true
    }
  }, [navigate])

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/team/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Login failed')
        setBusy(false)
        return
      }
      navigate('/team')
    } catch {
      setError('Network error')
      setBusy(false)
    }
  }

  async function continueWithGoogle() {
    setError('')
    setBusy(true)
    try {
      await startGoogleOAuth(`${window.location.origin}/team/login`, { kind: 'team' })
    } catch (err) {
      setError(err.message || 'Could not start Google sign-in')
      setBusy(false)
    }
  }

  if (booting && busy) {
    return (
      <div className="vh-page vh-team">
        <p className="vh-admin__loading">Finishing Google sign-in…</p>
      </div>
    )
  }

  return (
    <div className="vh-page vh-team">
      <SiteMenu />
      <div className="vh-team__split">
        <section className="vh-team__explain">
          <p className="vh-team__mark">Valhalla Empire</p>
          <h1>Team login</h1>
          <p>
            Simple seat for people building the twelve halls. Accept an invite from the founder,
            then sign in with Google (recommended) or the password you set.
          </p>
          <ol>
            <li>Founder invites you from Admin → People</li>
            <li>Open your invite link — Continue with Google, or choose a password</li>
            <li>Return here anytime to work your halls, tasks, and inbox</li>
          </ol>
          <p className="vh-team__note">
            Founder control tower stays at <Link to="/admin">/admin</Link>.
          </p>
        </section>

        <form className="vh-team__gate" onSubmit={onSubmit}>
          <h2>Sign in</h2>
          {googleReady && (
            <>
              <button
                type="button"
                className="vh-admin__google"
                onClick={continueWithGoogle}
                disabled={busy}
              >
                Continue with Google
              </button>
              <p className="vh-admin__divider" aria-hidden="true">
                or email
              </p>
            </>
          )}
          <label>
            Work email
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p className="vh-admin__error">{error}</p>}
          <button type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Enter workspace'}
          </button>
          <p className="vh-team__fine">
            Have an invite link? It looks like <code>/team/join?token=…</code>
          </p>
        </form>
      </div>
    </div>
  )
}
