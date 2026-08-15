import { useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import {
  APHRODITE_PROVIDERS,
  isAphroditeAuthConfigured,
  startAphroditeOAuth,
} from '../../lib/aphroditeClient'

const INTENTS = [
  { id: 'love', label: 'Love' },
  { id: 'friends', label: 'Friends' },
  { id: 'competition', label: 'Competition' },
]

const COMPETITIONS = [
  { id: 'chess', label: 'Chess' },
  { id: 'sports', label: 'Sports' },
  { id: 'clash-royale', label: 'Clash Royale' },
  { id: 'esports', label: 'Esports' },
  { id: 'track', label: 'Track' },
  { id: 'other', label: 'Other' },
]

export default function AphroditeSignUpPage() {
  const navigate = useNavigate()
  const { profile } = useOutletContext()
  const [intents, setIntents] = useState(['competition'])
  const [competitions, setCompetitions] = useState(['chess'])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const configured = isAphroditeAuthConfigured()

  useEffect(() => {
    if (profile) navigate('/aphrodite/profile', { replace: true })
  }, [profile, navigate])

  function toggle(list, setList, id) {
    setList((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  async function onProvider(id) {
    setError('')
    setBusy(true)
    try {
      try {
        sessionStorage.setItem(
          'aph_onboarding',
          JSON.stringify({ intents, competitions }),
        )
      } catch {
        // ignore
      }
      await startAphroditeOAuth(id, `${window.location.origin}/aphrodite/sign-in`)
    } catch (err) {
      setError(err.message || 'Could not start sign-up')
      setBusy(false)
    }
  }

  return (
    <div className="aph-auth">
      <h1>Join Aphrodite</h1>
      <p className="aph-lede">
        Members-only competition dating. Membership is <strong>$20/month</strong> after you create
        an account. Signup and approval dates are stored on your profile.
      </p>

      <fieldset className="aph-fieldset">
        <legend>I&apos;m here for</legend>
        <div className="aph-chips">
          {INTENTS.map((i) => (
            <button
              key={i.id}
              type="button"
              className={`aph-chip ${intents.includes(i.id) ? 'aph-chip--on' : ''}`}
              onClick={() => toggle(intents, setIntents, i.id)}
            >
              {i.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="aph-fieldset">
        <legend>Competitions</legend>
        <div className="aph-chips">
          {COMPETITIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`aph-chip ${competitions.includes(c.id) ? 'aph-chip--on' : ''}`}
              onClick={() => toggle(competitions, setCompetitions, c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </fieldset>

      {!configured && (
        <p className="aph-banner">
          Configure Supabase Auth env vars before OAuth will work (docs/aphrodite.md).
        </p>
      )}

      <div className="aph-provider-list">
        {APHRODITE_PROVIDERS.filter((p) => !p.stub).map((p) => (
          <button
            key={p.id}
            type="button"
            className="aph-btn aph-btn--provider"
            disabled={busy || !configured}
            onClick={() => onProvider(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p className="aph-fine aph-muted">
        Instagram Login is stubbed — after signup, link your Instagram handle on Profile. Facebook
        OAuth is the interim Meta path.
      </p>

      {error && <p className="aph-error">{error}</p>}

      <p className="aph-fine">
        Already a member? <Link to="/aphrodite/sign-in">Sign in</Link>
      </p>
    </div>
  )
}
