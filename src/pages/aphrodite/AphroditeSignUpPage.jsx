import { useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import {
  APHRODITE_PROVIDERS,
  isAphroditeAuthConfigured,
  signUpAphroditeEmail,
  startAphroditeOAuth,
} from '../../lib/aphroditeClient'
import { aphroditeAdultStatus } from '../../lib/aphroditeAge'

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
  const [birthDate, setBirthDate] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const configured = isAphroditeAuthConfigured()

  useEffect(() => {
    if (profile) navigate('/aphrodite/profile', { replace: true })
  }, [profile, navigate])

  function toggle(list, setList, id) {
    setList((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function storeOnboarding() {
    const age = aphroditeAdultStatus(birthDate)
    if (!age.ok) {
      throw new Error(age.error)
    }
    try {
      sessionStorage.setItem(
        'aph_onboarding',
        JSON.stringify({ intents, competitions, birthDate }),
      )
    } catch {
      // ignore
    }
  }

  async function onProvider(id) {
    setError('')
    setBusy(true)
    try {
      storeOnboarding()
      await startAphroditeOAuth(id, `${window.location.origin}/aphrodite/sign-in`)
    } catch (err) {
      setError(err.message || 'Could not start sign-up')
      setBusy(false)
    }
  }

  async function onEmail(e) {
    e.preventDefault()
    setError('')
    setNote('')
    setBusy(true)
    try {
      storeOnboarding()
      const data = await signUpAphroditeEmail({ email, password })
      if (data?.session) {
        navigate('/aphrodite/sign-in')
        return
      }
      setNote('Check your email to confirm, then sign in.')
    } catch (err) {
      setError(err.message || 'Could not create account')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="aph-auth">
      <h1>Join Aphrodite</h1>
      <p className="aph-lede">
        Members-only competition dating. Membership is <strong>$20/month</strong> after you create
        an account. You must be 18 or older.
      </p>

      <label className="aph-form-block">
        Birth date
        <input
          type="date"
          required
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </label>

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
          Configure Supabase Auth env vars before OAuth or email signup will work
          (docs/aphrodite.md). Demo login stays on Sign in.
        </p>
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
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="aph-btn aph-btn--solid" disabled={busy || !configured}>
          Create account with email
        </button>
      </form>

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
        Sign in with Apple is required for the iOS App Store listing. Instagram Login is stubbed —
        link your handle on Profile. By joining you agree to the{' '}
        <Link to="/aphrodite/terms">Terms</Link>, <Link to="/aphrodite/privacy">Privacy</Link>, and{' '}
        <Link to="/aphrodite/safety">Safety</Link> rules.
      </p>

      {note && <p className="aph-flash">{note}</p>}
      {error && <p className="aph-error">{error}</p>}

      <p className="aph-fine">
        Already a member? <Link to="/aphrodite/sign-in">Sign in</Link>
      </p>
    </div>
  )
}
