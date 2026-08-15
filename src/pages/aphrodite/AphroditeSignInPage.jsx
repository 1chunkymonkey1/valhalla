import { useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import {
  APHRODITE_PROVIDERS,
  demoLoginAphrodite,
  isAphroditeAuthConfigured,
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
  const configured = isAphroditeAuthConfigured()

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const intent = takeOAuthIntent()
      if (intent?.kind === 'aphrodite' && configured) {
        setBusy(true)
        try {
          const token = await getAphroditeAccessToken()
          if (token) {
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
              provider: intent.provider,
              intents: onboarding.intents,
              competitions: onboarding.competitions,
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

  async function onDemoLogin() {
    setError('')
    setBusy(true)
    try {
      const data = await demoLoginAphrodite({
        displayName: 'Eason',
        email: 'eason@aphrodite.local',
        intents: ['competition'],
        competitions: ['chess', 'sports'],
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
      </p>
      <ul className="aph-notes">
        {APHRODITE_PROVIDERS.map((p) => (
          <li key={`n-${p.id}`}>
            <strong>{p.id}</strong> — {p.note}
          </li>
        ))}
      </ul>
    </div>
  )
}
