import { useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom'
import { aphroditeFetch } from '../../lib/aphroditeClient'
import { isAphroditeNative } from '../../lib/aphroditeNative'

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

  const native = isAphroditeNative()

  async function startCheckout() {
    setBusy(true)
    setError('')
    try {
      if (native) {
        const data = await aphroditeFetch('iap', {
          method: 'POST',
          body: { productId: 'aphrodite_monthly' },
        })
        if (data.subscribed) {
          await refreshMe()
          navigate('/aphrodite/matches')
          return
        }
        setError(data.error || 'App Store billing is not live on this build yet.')
        return
      }
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
        <p>$20 / month · web via Stripe · iOS via App Store</p>
      </header>

      <div className="aph-price-block">
        <p className="aph-price">$20</p>
        <p className="aph-price__sub">per month</p>
        <ul>
          <li>Swipe deck of competitors</li>
          <li>Mutual-match messages</li>
          <li>Block and report on every card</li>
          <li>Linked Chess.com, MaxPreps, Instagram, Clash Royale</li>
        </ul>
        <button
          type="button"
          className="aph-btn aph-btn--solid"
          disabled={busy}
          onClick={startCheckout}
        >
          {busy
            ? 'Opening…'
            : native
              ? 'Subscribe with Apple'
              : 'Subscribe with card'}
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
          Web needs <code>STRIPE_SECRET_KEY</code>. iOS needs StoreKit product{' '}
          <code>aphrodite_monthly</code> — see <code>docs/aphrodite-app-store.md</code>.
        </p>
      </div>
    </div>
  )
}
