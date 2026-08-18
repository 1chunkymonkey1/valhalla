import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { aphroditeFetch } from '../../lib/aphroditeClient'

export default function AphroditeChatPage() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const { profile, subscribed, loading } = useOutletContext()
  const [match, setMatch] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const scroller = useRef(null)

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
        const data = await aphroditeFetch(`messages?matchId=${encodeURIComponent(matchId)}`)
        if (!cancelled) {
          setMatch(data.match)
          setMessages(data.messages || [])
        }
      } catch (err) {
        if (!cancelled) {
          if (err.code === 'age_required') navigate('/aphrodite/profile')
          else setError(err.message)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [loading, profile, subscribed, matchId, navigate])

  useEffect(() => {
    scroller.current?.scrollTo(0, scroller.current.scrollHeight)
  }, [messages])

  async function onSend(e) {
    e.preventDefault()
    if (!draft.trim() || busy) return
    setBusy(true)
    setError('')
    try {
      const data = await aphroditeFetch('messages', {
        method: 'POST',
        body: { matchId, body: draft },
      })
      setMessages((list) => [...list, data.message])
      setDraft('')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function onBlock() {
    if (!match?.profile?.id) return
    if (!window.confirm(`Block ${match.profile.displayName}? This closes the thread.`)) return
    try {
      await aphroditeFetch('block', {
        method: 'POST',
        body: { toProfileId: match.profile.id },
      })
      navigate('/aphrodite/matches')
    } catch (err) {
      setError(err.message)
    }
  }

  async function onReport() {
    if (!match?.profile?.id) return
    const details = window.prompt('Describe the issue (optional)') || ''
    try {
      await aphroditeFetch('report', {
        method: 'POST',
        body: { toProfileId: match.profile.id, reason: 'other', details },
      })
      setError('')
      window.alert('Report received.')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading || !profile) return <p className="aph-muted">Loading…</p>

  return (
    <div className="aph-chat">
      <header className="aph-section-head">
        <p className="aph-fine">
          <Link to="/aphrodite/matches">← Matches</Link>
        </p>
        <h1>{match?.profile?.displayName || 'Match'}</h1>
        <p>{match?.profile?.competitions?.join(' · ') || 'Private thread'}</p>
        <div className="aph-safety-actions">
          <button type="button" className="aph__text-btn" onClick={onBlock}>
            Block
          </button>
          <button type="button" className="aph__text-btn" onClick={onReport}>
            Report
          </button>
        </div>
      </header>

      {error && <p className="aph-error">{error}</p>}

      <div className="aph-thread" ref={scroller}>
        {messages.length === 0 ? (
          <p className="aph-muted">Say hello. Keep it competitive.</p>
        ) : (
          messages.map((m) => (
            <p key={m.id} className={`aph-bubble ${m.mine ? 'aph-bubble--mine' : ''}`}>
              {m.body}
            </p>
          ))
        )}
      </div>

      <form className="aph-compose" onSubmit={onSend}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={2000}
          placeholder="Message"
          aria-label="Message"
        />
        <button type="submit" className="aph-btn aph-btn--solid" disabled={busy || !draft.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}
