import { useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { aphroditeFetch } from '../../lib/aphroditeClient'

const INTENT_OPTS = ['love', 'friends', 'competition']
const COMP_OPTS = ['chess', 'sports', 'clash-royale', 'esports', 'track', 'other']

export default function AphroditeProfilePage() {
  const navigate = useNavigate()
  const { profile, subscribed, loading, refreshMe } = useOutletContext()
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!profile) {
      navigate('/aphrodite/sign-in')
      return
    }
    setForm({
      displayName: profile.displayName || '',
      bio: profile.bio || '',
      birthDate: profile.birthDate || '',
      intents: profile.intents || [],
      competitions: profile.competitions || [],
      chessCom: profile.chessCom || '',
      maxpreps: profile.maxpreps || '',
      instagram: profile.instagram || '',
      clashRoyale: profile.clashRoyale || '',
    })
  }, [loading, profile, navigate])

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    setSaved(false)
  }

  function toggle(key, id) {
    setForm((f) => {
      const list = f[key] || []
      return {
        ...f,
        [key]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
      }
    })
    setSaved(false)
  }

  async function onSave(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await aphroditeFetch('me', { method: 'PATCH', body: form })
      await refreshMe()
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (loading || !form) {
    return <p className="aph-muted">Loading profile…</p>
  }

  return (
    <div className="aph-profile">
      <header className="aph-section-head">
        <h1>Profile</h1>
        <p>
          Signed up {profile.signedUpAt ? new Date(profile.signedUpAt).toLocaleDateString() : '—'}
          {profile.approvedAt
            ? ` · Approved ${new Date(profile.approvedAt).toLocaleDateString()}`
            : ''}
          {!subscribed && (
            <>
              {' '}
              · <Link to="/aphrodite/subscribe">Subscribe to match</Link>
            </>
          )}
        </p>
      </header>

      <form className="aph-form" onSubmit={onSave}>
        <label>
          Display name
          <input
            value={form.displayName}
            onChange={(e) => setField('displayName', e.target.value)}
            required
            maxLength={80}
          />
        </label>
        <label>
          Bio
          <textarea
            value={form.bio}
            onChange={(e) => setField('bio', e.target.value)}
            rows={3}
            maxLength={600}
          />
        </label>
        <label>
          Birth date
          <input
            type="date"
            value={form.birthDate || ''}
            onChange={(e) => setField('birthDate', e.target.value)}
          />
        </label>

        <fieldset className="aph-fieldset">
          <legend>Intents</legend>
          <div className="aph-chips">
            {INTENT_OPTS.map((id) => (
              <button
                key={id}
                type="button"
                className={`aph-chip ${form.intents.includes(id) ? 'aph-chip--on' : ''}`}
                onClick={() => toggle('intents', id)}
              >
                {id}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="aph-fieldset">
          <legend>Competitions</legend>
          <div className="aph-chips">
            {COMP_OPTS.map((id) => (
              <button
                key={id}
                type="button"
                className={`aph-chip ${form.competitions.includes(id) ? 'aph-chip--on' : ''}`}
                onClick={() => toggle('competitions', id)}
              >
                {id}
              </button>
            ))}
          </div>
        </fieldset>

        <h2 className="aph-form__sub">Linked accounts</h2>
        <label>
          Chess.com username
          <input
            value={form.chessCom}
            onChange={(e) => setField('chessCom', e.target.value)}
            placeholder="username"
          />
        </label>
        <label>
          MaxPreps
          <input
            value={form.maxpreps}
            onChange={(e) => setField('maxpreps', e.target.value)}
            placeholder="athlete or school handle"
          />
        </label>
        <label>
          Instagram
          <input
            value={form.instagram}
            onChange={(e) => setField('instagram', e.target.value)}
            placeholder="handle (no @)"
          />
        </label>
        <label>
          Clash Royale player tag
          <input
            value={form.clashRoyale}
            onChange={(e) => setField('clashRoyale', e.target.value)}
            placeholder="#XXXXXXXX"
          />
        </label>

        {error && <p className="aph-error">{error}</p>}
        {saved && <p className="aph-flash">Saved.</p>}

        <button type="submit" className="aph-btn aph-btn--solid" disabled={busy}>
          {busy ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </div>
  )
}
