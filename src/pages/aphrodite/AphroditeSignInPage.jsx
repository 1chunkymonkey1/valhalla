import { useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import {
  APHRODITE_PROVIDERS,
  demoLoginAphrodite,
  getAphroditeSession,
  isAphroditeAuthConfigured,
  signInAphroditeEmail,
  startAphroditeOAuth,
  syncAphroditeSession,
  getAphroditeAccessToken,
} from '../../lib/aphroditeClient'
import { takeOAuthIntent } from '../../lib/supabaseBrowser'

export default function AphroditeSignInPage() {
  const navigate = useNavigate()
  const { setBoot } = useOutletContext()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [booting, setBooting] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const configured = isAphroditeAuthConfigured()

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const intent = takeOAuthIntent()
      let token = null
      if (configured && intent?.kind === 'aphrodite') {
        token = await getAphroditeAccessToken()
      } else if (configured) {
        const session = await getAphroditeSession()
        token = session?.access_token || null
      }
      if (configured && token) {
        setBusy(true)
        try {
            let onboarding = {}
            try {
              const raw = sessionStorage.getItem('aph_onboarding')
              if (raw) {
                onboarding = JSON.parse(raw)
                sessionStorage.removeItem('aph_onboarding')
              }
            } catch {
              // ignore
            }
            const data = await syncAphroditeSession({
              provider: intent?.provider || 'email',
              intents: onboarding.intents,
              competitions: onboarding.competitions,
              birthDate: onboarding.birthDate,
            })
            if (!cancelled) {
              setBoot({
                loading: false,
                profile: data.profile,
                subscribed: Boolean(data.subscribed),
              })
              navigate(data.subscribed ? '/aphrodite/matches' : '/aphrodite/subscribe')
              return
            }
        } catch (err) {
          if (!cancelled) setError(err.message || 'Sign-in failed')
        } finally {
          if (!cancelled) setBusy(false)
        }
      }
      if (!cancelled) setBooting(false)
    })()
    return () => {
      cancelled = true
    }
  }, [configured, navigate, setBoot])

  async function onProvider(id) {
    setError('')
    setBusy(true)
    try {
      await startAphroditeOAuth(id, `${window.location.origin}/aphrodite/sign-in`)
    } catch (err) {
      setError(err.message || 'Could not start sign-in')
      setBusy(false)
    }
  }

  async function onEmail(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signInAphroditeEmail({ email, password })
      let onboarding = {}
      try {
        const raw = sessionStorage.getItem('aph_onboarding')
        if (raw) {
          onboarding = JSON.parse(raw)
          sessionStorage.removeItem('aph_onboarding')
        }
      } catch {
        // ignore
      }
      const data = await syncAphroditeSession({
        provider: 'email',
        intents: onboarding.intents,
        competitions: onboarding.competitions,
        birthDate: onboarding.birthDate,
      })
      setBoot({
        loading: false,
        profile: data.profile,
        subscribed: Boolean(data.subscribed),
      })
      navigate(data.subscribed ? '/aphrodite/matches' : '/aphrodite/subscribe')
    } catch (err) {
      setError(err.message || 'Sign-in failed')
    } finally {
      setBusy(false)
    }
  }

  async function onDemoLogin() {
    setError('')
    setBusy(true)
    try {
      const data = await demoLoginAphrodite({
        displayName: 'Eason',
        email: 'eason@aphrodite.local',
        intents: ['competition'],
        competitions: ['chess', 'sports'],
        birthDate: '1990-05-17',
      })
      setBoot({
        loading: false,
        profile: data.profile,
        subscribed: Boolean(data.subscribed),
      })
      navigate(data.subscribed ? '/aphrodite/matches' : '/aphrodite/subscribe')
    } catch (err) {
      setError(err.message || 'Demo login failed')
    } finally {
      setBusy(false)
    }
  }

  if (booting && busy) {
    return <p className="aph-muted">Finishing sign-in…</p>
  }

  return (
    <div className="aph-auth">
      <h1>Welcome back</h1>
      <p className="aph-lede">Sign in to Aphrodite — competition dating in the Valhalla ecosystem.</p>

      {!configured && (
        <p className="aph-banner">
          Supabase Auth is not configured here. Use <strong>Continue as Eason (demo)</strong> for a
          memory-mode session, or set <code>VITE_SUPABASE_URL</code> +{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> and enable providers (docs/aphrodite.md).
        </p>
      )}

      {!configured && (
        <button
          type="button"
          className="aph-btn aph-btn--solid"
          disabled={busy}
          onClick={onDemoLogin}
          style={{ width: '100%', marginBottom: '0.75rem' }}
        >
          Continue as Eason (demo)
        </button>
      )}

      <form className="aph-form" onSubmit={onEmail}>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="aph-btn aph-btn--solid" disabled={busy || !configured}>
          Sign in with email
        </button>
      </form>

      <div className="aph-provider-list">
        {APHRODITE_PROVIDERS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`aph-btn aph-btn--provider ${p.stub ? 'aph-btn--stub' : ''}`}
            disabled={busy || !configured || p.stub}
            onClick={() => onProvider(p.id)}
            title={p.note}
          >
            {p.label}
            {p.stub ? ' · stub' : ''}
          </button>
        ))}
      </div>

      {error && <p className="aph-error">{error}</p>}

      <p className="aph-fine">
        New here? <Link to="/aphrodite/sign-up">Create an account</Link>
        {' · '}
        <Link to="/aphrodite/privacy">Privacy</Link>
        {' · '}
        <Link to="/aphrodite/safety">Safety</Link>
      </p>
    </div>
  )
}
