import { useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom'
import { aphroditeFetch } from '../../lib/aphroditeClient'

export default function AphroditeSettingsPage() {
  const navigate = useNavigate()
  const { profile, subscribed, loading, refreshMe } = useOutletContext()
  const [params] = useSearchParams()
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (loading) return
    if (!profile) navigate('/aphrodite/sign-in')
  }, [loading, profile, navigate])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetch('/api/aphrodite/status').then((r) => r.json())
        if (!cancelled) setStatus(data)
      } catch {
        if (!cancelled) setStatus(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const sessionId = params.get('session_id')
    const checkout = params.get('checkout')
    if (checkout === 'success' && sessionId && profile) {
      ;(async () => {
        try {
          await aphroditeFetch('confirm-checkout', {
            method: 'POST',
            body: { sessionId },
          })
          await refreshMe()
          setMessage('Membership activated.')
        } catch (err) {
          setError(err.message)
        }
      })()
    }
  }, [params, profile, refreshMe])

  if (loading || !profile) {
    return <p className="aph-muted">Loading…</p>
  }

  return (
    <div className="aph-settings">
      <header className="aph-section-head">
        <h1>Settings</h1>
        <p>Account, membership, and provider status.</p>
      </header>

      {message && <p className="aph-flash">{message}</p>}
      {error && <p className="aph-error">{error}</p>}

      <section className="aph-panel">
        <h2>Account</h2>
        <dl className="aph-links">
          <dt>Email</dt>
          <dd>{profile.email || '—'}</dd>
          <dt>Signed up</dt>
          <dd>
            {profile.signedUpAt ? new Date(profile.signedUpAt).toLocaleString() : '—'}
          </dd>
          <dt>Approved</dt>
          <dd>
            {profile.approvedAt ? new Date(profile.approvedAt).toLocaleString() : 'Pending'}
          </dd>
          <dt>Auth providers</dt>
          <dd>{(profile.authProviders || []).join(', ') || '—'}</dd>
        </dl>
        <p>
          <Link to="/aphrodite/profile">Edit profile &amp; linked accounts</Link>
        </p>
      </section>

      <section className="aph-panel">
        <h2>Membership</h2>
        <p>
          Status:{' '}
          <strong>{subscribed ? profile.subscriptionStatus || 'active' : 'none'}</strong>
          {profile.subscriptionCurrentPeriodEnd
            ? ` · renews / ends ${new Date(profile.subscriptionCurrentPeriodEnd).toLocaleDateString()}`
            : ''}
        </p>
        {!subscribed && (
          <Link className="aph-btn aph-btn--solid" to="/aphrodite/subscribe">
            Subscribe · $20/month
          </Link>
        )}
      </section>

      <section className="aph-panel">
        <h2>Backend</h2>
        <ul className="aph-notes">
          <li>Supabase: {status?.supabase ? 'configured' : 'not configured (memory demo)'}</li>
          <li>Stripe: {status?.stripeConfigured ? 'configured' : 'missing STRIPE_SECRET_KEY'}</li>
          <li>
            Instagram auth: stub — link handle on profile; Meta Instagram Login needs Dashboard
            setup
          </li>
        </ul>
      </section>
    </div>
  )
}
