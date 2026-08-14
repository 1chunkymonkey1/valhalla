import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  clearBrowserSupabaseSession,
  getGoogleAccessToken,
  isSupabaseBrowserConfigured,
  startGoogleOAuth,
  takeOAuthIntent,
} from '../lib/supabaseBrowser'

export default function TeamJoinPage() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const navigate = useNavigate()
  const [invite, setInvite] = useState(null)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [googleReady, setGoogleReady] = useState(false)
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!token) {
        setError('Missing invite token')
        setBooting(false)
        return
      }

      try {
        const [inviteRes, optsRes] = await Promise.all([
          fetch(`/api/team/accept-invite?token=${encodeURIComponent(token)}`),
          fetch('/api/team/auth-options'),
        ])
        const data = await inviteRes.json()
        const opts = await optsRes.json().catch(() => ({}))
        if (!cancelled) {
          setGoogleReady(Boolean(opts.google && isSupabaseBrowserConfigured()))
          if (!data.ok) setError(data.error || 'Invite invalid')
          else {
            setInvite(data.invite)
            setName(data.invite.name || '')
          }
        }
      } catch {
        if (!cancelled) setError('Could not load invite')
      }

      const intent = takeOAuthIntent()
      if (intent?.kind === 'join' && intent.token === token && isSupabaseBrowserConfigured()) {
        setBusy(true)
        try {
          const accessToken = await getGoogleAccessToken()
          if (accessToken) {
            const res = await fetch('/api/team/accept-invite', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                token,
                name: intent.name || name,
                accessToken,
              }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
              if (!cancelled) setError(data.error || 'Could not accept invite with Google')
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
  }, [token, navigate])

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters (or use Continue with Google).')
      setBusy(false)
      return
    }
    const res = await fetch('/api/team/accept-invite', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, name, password }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error || 'Could not accept invite')
      setBusy(false)
      return
    }
    navigate('/team')
  }

  async function continueWithGoogle() {
    setError('')
    setBusy(true)
    try {
      const redirectTo = `${window.location.origin}/team/join?token=${encodeURIComponent(token)}`
      await startGoogleOAuth(redirectTo, { kind: 'join', token, name })
    } catch (err) {
      setError(err.message || 'Could not start Google sign-in')
      setBusy(false)
    }
  }

  if (booting && busy) {
    return (
      <div className="vh-page vh-team">
        <p className="vh-admin__loading">Finishing Google join…</p>
      </div>
    )
  }

  return (
    <div className="vh-page vh-team">
      <form className="vh-team__gate vh-team__gate--solo" onSubmit={onSubmit}>
        <p className="vh-team__mark">Join Valhalla</p>
        <h1>Accept invite</h1>
        {invite ? (
          <>
            <p>
              Seat for <strong>{invite.email}</strong> as <strong>{invite.roleLabel}</strong>
              {invite.halls?.length ? ` · halls: ${invite.halls.join(', ')}` : ''}.
            </p>
            <label>
              Your name
              <input required value={name} onChange={(e) => setName(e.target.value)} />
            </label>
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
                <p className="vh-admin__hint">
                  Use the Google account for <strong>{invite.email}</strong>. No separate app
                  password is stored.
                </p>
                <p className="vh-admin__divider" aria-hidden="true">
                  or set a password
                </p>
              </>
            )}
            <label>
              Create password (8+ characters)
              <input
                type="password"
                required={!googleReady}
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error && <p className="vh-admin__error">{error}</p>}
            <button type="submit" disabled={busy}>
              {busy ? 'Creating seat…' : 'Enter the empire'}
            </button>
          </>
        ) : (
          <p className="vh-admin__error">{error || 'Loading invite…'}</p>
        )}
        <Link to="/team/login">Already joined? Sign in</Link>
      </form>
    </div>
  )
}
