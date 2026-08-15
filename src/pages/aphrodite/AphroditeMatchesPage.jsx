import { useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { aphroditeFetch } from '../../lib/aphroditeClient'

export default function AphroditeMatchesPage() {
  const navigate = useNavigate()
  const { profile, subscribed, loading } = useOutletContext()
  const [deck, setDeck] = useState([])
  const [matches, setMatches] = useState([])
  const [error, setError] = useState('')
  const [flash, setFlash] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!profile) {
      navigate('/aphrodite/sign-in')
      return
    }
    if (!subscribed) {
      navigate('/aphrodite/subscribe')
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const [d, m] = await Promise.all([
          aphroditeFetch('deck'),
          aphroditeFetch('matches'),
        ])
        if (!cancelled) {
          setDeck(d.deck || [])
          setMatches(m.matches || [])
        }
      } catch (err) {
        if (!cancelled) {
          if (err.code === 'subscription_required') navigate('/aphrodite/subscribe')
          else setError(err.message)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [loading, profile, subscribed, navigate])

  const current = deck[0]

  async function swipe(direction) {
    if (!current || busy) return
    setBusy(true)
    setFlash('')
    setError('')
    try {
      const result = await aphroditeFetch('swipe', {
        method: 'POST',
        body: { toProfileId: current.id, direction },
      })
      setDeck((d) => d.slice(1))
      if (result.matched) {
        setFlash(`Match with ${current.displayName}`)
        const m = await aphroditeFetch('matches')
        setMatches(m.matches || [])
      }
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
    <div className="aph-matches">
      <header className="aph-section-head">
        <h1>Matches</h1>
        <p>Swipe the deck. Mutual likes become matches.</p>
      </header>

      {error && <p className="aph-error">{error}</p>}
      {flash && <p className="aph-flash">{flash}</p>}

      <div className="aph-match-layout">
        <section className="aph-deck" aria-live="polite">
          {current ? (
            <article className="aph-card-face">
              <div className="aph-card-face__mark" aria-hidden>
                {String(current.displayName || '?')
                  .slice(0, 1)
                  .toUpperCase()}
              </div>
              <h2>{current.displayName}</h2>
              <p>{current.bio || 'Competitor · Aphrodite member'}</p>
              <ul className="aph-tags">
                {(current.competitions || []).map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <dl className="aph-links">
                {current.chessCom && (
                  <>
                    <dt>Chess.com</dt>
                    <dd>{current.chessCom}</dd>
                  </>
                )}
                {current.maxpreps && (
                  <>
                    <dt>MaxPreps</dt>
                    <dd>{current.maxpreps}</dd>
                  </>
                )}
                {current.instagram && (
                  <>
                    <dt>Instagram</dt>
                    <dd>@{current.instagram}</dd>
                  </>
                )}
                {current.clashRoyale && (
                  <>
                    <dt>Clash Royale</dt>
                    <dd>{current.clashRoyale}</dd>
                  </>
                )}
              </dl>
              <div className="aph-swipe-actions">
                <button
                  type="button"
                  className="aph-btn aph-btn--ghost"
                  disabled={busy}
                  onClick={() => swipe('pass')}
                >
                  Pass
                </button>
                <button
                  type="button"
                  className="aph-btn aph-btn--solid"
                  disabled={busy}
                  onClick={() => swipe('like')}
                >
                  Like
                </button>
              </div>
            </article>
          ) : (
            <div className="aph-empty">
              <p>Deck clear for now. Check back as more members subscribe.</p>
              <Link to="/aphrodite/profile">Edit your profile</Link>
            </div>
          )}
        </section>

        <aside className="aph-match-list">
          <h2>Your matches</h2>
          {matches.length === 0 ? (
            <p className="aph-muted">No mutual matches yet.</p>
          ) : (
            <ul>
              {matches.map((m) => (
                <li key={m.id}>
                  <strong>{m.profile?.displayName || 'Member'}</strong>
                  <span>{m.profile?.competitions?.join(' · ')}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  )
}
