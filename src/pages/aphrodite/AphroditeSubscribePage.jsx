import { useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom'
import { aphroditeFetch } from '../../lib/aphroditeClient'

export default function AphroditeSubscribePage() {
  const navigate = useNavigate()
  const { profile, subscribed, loading, refreshMe } = useOutletContext()
  const [params] = useSearchParams()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => {
    if (loading) return
    if (!profile) {
      navigate('/aphrodite/sign-in')
      return
    }
    if (subscribed) {
      navigate('/aphrodite/matches', { replace: true })
    }
  }, [loading, profile, subscribed, navigate])

  useEffect(() => {
    const sessionId = params.get('session_id')
    const checkout = params.get('checkout')
    if (checkout === 'cancel') setNote('Checkout canceled.')
    if (!sessionId || !profile) return

    let cancelled = false
    ;(async () => {
      setBusy(true)
      try {
        await aphroditeFetch('confirm-checkout', {
          method: 'POST',
          body: { sessionId },
        })
        await refreshMe()
        if (!cancelled) navigate('/aphrodite/matches', { replace: true })
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setBusy(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [params, profile, refreshMe, navigate])

  async function startCheckout() {
    setBusy(true)
    setError('')
    try {
      const data = await aphroditeFetch('subscribe', { method: 'POST', body: {} })
      if (data.url) {
        window.location.href = data.url
        return
      }
      setError('No checkout URL returned')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function demoActivate() {
    setBusy(true)
    setError('')
    try {
      await aphroditeFetch('demo-activate', { method: 'POST', body: {} })
      await refreshMe()
      navigate('/aphrodite/matches')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (loading || !profile) {
    return <p className="aph-muted">Loading…</p>
  }

  return (
    <div className="aph-subscribe">
      <header className="aph-section-head">
        <h1>Membership</h1>
        <p>$20 / month · card via Stripe · unlock matches</p>
      </header>

      <div className="aph-price-block">
        <p className="aph-price">$20</p>
        <p className="aph-price__sub">per month</p>
        <ul>
          <li>Swipe deck of competitors</li>
          <li>Mutual-match inbox</li>
          <li>Linked Chess.com, MaxPreps, Instagram, Clash Royale</li>
          <li>Signup &amp; approval dates on your account</li>
        </ul>
        <button
          type="button"
          className="aph-btn aph-btn--solid"
          disabled={busy}
          onClick={startCheckout}
        >
          {busy ? 'Opening Stripe…' : 'Subscribe with card'}
        </button>
        <button
          type="button"
          className="aph-btn aph-btn--ghost"
          disabled={busy}
          onClick={demoActivate}
        >
          Demo activate (test / no live Stripe)
        </button>
        {note && <p className="aph-muted">{note}</p>}
        {error && <p className="aph-error">{error}</p>}
        <p className="aph-fine">
          Needs <code>STRIPE_SECRET_KEY</code> on the server. See{' '}
          <code>docs/aphrodite.md</code>.
        </p>
      </div>
    </div>
  )
}
