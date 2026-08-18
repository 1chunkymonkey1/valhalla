import { useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { aphroditeFetch } from '../../lib/aphroditeClient'

const REPORT_REASONS = [
  { id: 'harassment', label: 'Harassment' },
  { id: 'fake', label: 'Fake profile' },
  { id: 'underage', label: 'Under 18' },
  { id: 'spam', label: 'Spam' },
  { id: 'other', label: 'Other' },
]

export default function AphroditeMatchesPage() {
  const navigate = useNavigate()
  const { profile, subscribed, loading } = useOutletContext()
  const [deck, setDeck] = useState([])
  const [matches, setMatches] = useState([])
  const [error, setError] = useState('')
  const [flash, setFlash] = useState('')
  const [busy, setBusy] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState('harassment')
  const [reportDetails, setReportDetails] = useState('')

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
          else if (err.code === 'age_required' || err.code === 'underage') {
            navigate('/aphrodite/profile')
          } else setError(err.message)
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

  async function onBlock() {
    if (!current || busy) return
    if (!window.confirm(`Block ${current.displayName}? They leave your deck and cannot message you.`)) {
      return
    }
    setBusy(true)
    setError('')
    try {
      await aphroditeFetch('block', { method: 'POST', body: { toProfileId: current.id } })
      setFlash(`${current.displayName} blocked`)
      setDeck((d) => d.slice(1))
      const m = await aphroditeFetch('matches')
      setMatches(m.matches || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function onReport(e) {
    e.preventDefault()
    if (!current || busy) return
    setBusy(true)
    setError('')
    try {
      await aphroditeFetch('report', {
        method: 'POST',
        body: {
          toProfileId: current.id,
          reason: reportReason,
          details: reportDetails,
        },
      })
      setFlash('Report received. Thank you.')
      setReportOpen(false)
      setReportDetails('')
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
        <p>Swipe the deck. Mutual likes open a thread. Block and report stay on every card.</p>
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
              <div className="aph-safety-actions">
                <button type="button" className="aph__text-btn" disabled={busy} onClick={onBlock}>
                  Block
                </button>
                <button
                  type="button"
                  className="aph__text-btn"
                  disabled={busy}
                  onClick={() => setReportOpen((o) => !o)}
                >
                  Report
                </button>
              </div>
              {reportOpen && (
                <form className="aph-report" onSubmit={onReport}>
                  <label>
                    Reason
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                    >
                      {REPORT_REASONS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Details
                    <textarea
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      maxLength={800}
                      rows={2}
                    />
                  </label>
                  <button type="submit" className="aph-btn aph-btn--ghost" disabled={busy}>
                    Submit report
                  </button>
                </form>
              )}
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
                  <Link to={`/aphrodite/matches/${m.id}`}>
                    <strong>{m.profile?.displayName || 'Member'}</strong>
                    <span>
                      {m.lastMessage?.body
                        ? m.lastMessage.body
                        : m.profile?.competitions?.join(' · ')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  )
}
