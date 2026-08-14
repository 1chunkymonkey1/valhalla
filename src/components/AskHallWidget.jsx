import { useEffect, useEffectEvent, useRef, useState } from 'react'

const TOKEN_KEY = 'vh_chat_visitor_token'
const THREAD_KEY = (pageId) => `vh_chat_thread_${pageId}`

function getOrCreateToken() {
  try {
    let t = localStorage.getItem(TOKEN_KEY)
    if (t && t.length >= 16) return t
    t = Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    localStorage.setItem(TOKEN_KEY, t)
    return t
  } catch {
    return `tmp_${Date.now().toString(36)}`
  }
}

function loadThreadId(pageId) {
  try {
    return localStorage.getItem(THREAD_KEY(pageId)) || ''
  } catch {
    return ''
  }
}

function saveThreadId(pageId, id) {
  try {
    if (id) localStorage.setItem(THREAD_KEY(pageId), id)
  } catch {
    // ignore
  }
}

/**
 * Compact "ask the hall" widget, human relay to /admin inbox.
 * Keep off dormant countdown hub (pass dormant).
 */
export default function AskHallWidget({ pageId, hallName = 'Valhalla', dormant = false }) {
  const [open, setOpen] = useState(false)
  const [token] = useState(() => getOrCreateToken())
  const [threadId, setThreadId] = useState(() => loadThreadId(pageId))
  const [messages, setMessages] = useState([])
  const [body, setBody] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [unread, setUnread] = useState(0)
  const listRef = useRef(null)

  const onPoll = useEffectEvent(async () => {
    if (!threadId || !token) return
    try {
      const res = await fetch(
        `/api/hub/chat?threadId=${encodeURIComponent(threadId)}&token=${encodeURIComponent(token)}`,
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) return
      setMessages(data.messages || [])
      setUnread(Number(data.thread?.unreadVisitor || 0))
    } catch {
      // ignore transient poll errors
    }
  })

  useEffect(() => {
    setThreadId(loadThreadId(pageId))
    setMessages([])
    setUnread(0)
  }, [pageId])

  useEffect(() => {
    if (dormant || !open || !threadId) return
    onPoll()
    const id = setInterval(() => onPoll(), 4000)
    return () => clearInterval(id)
  }, [dormant, open, threadId])

  useEffect(() => {
    if (!open || !listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [open, messages])

  if (dormant || !pageId) return null

  async function send(e) {
    e.preventDefault()
    setError('')
    const text = body.trim()
    if (!text) return
    setBusy(true)
    try {
      const res = await fetch('/api/hub/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          pageId,
          visitorToken: token,
          threadId: threadId || undefined,
          name,
          email,
          body: text,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) {
        setError(data.error || 'Could not send')
        return
      }
      setBody('')
      if (data.thread?.id) {
        setThreadId(data.thread.id)
        saveThreadId(pageId, data.thread.id)
      }
      setMessages(data.messages || [])
      setUnread(0)
      fetch('/api/hub/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'read',
          threadId: data.thread?.id,
          visitorToken: token,
        }),
      }).catch(() => {})
    } catch {
      setError('Network error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="vh-ask">
      {!open && (
        <button
          type="button"
          className="vh-ask__launcher"
          onClick={() => setOpen(true)}
          aria-label={`Ask ${hallName}`}
        >
          Ask
          {unread > 0 && <span className="vh-ask__badge">{unread > 9 ? '9+' : unread}</span>}
        </button>
      )}

      {open && (
        <section className="vh-ask__panel" aria-label={`Ask ${hallName}`}>
          <header className="vh-ask__head">
            <div>
              <p className="vh-ask__kicker">Ask the hall</p>
              <h2 className="vh-ask__title">{hallName}</h2>
            </div>
            <button type="button" className="vh-ask__close" onClick={() => setOpen(false)}>
              Close
            </button>
          </header>
          <p className="vh-ask__blurb">
            Messages go to Valhalla. A person replies here, not an automated chatbot.
          </p>
          <div className="vh-ask__msgs" ref={listRef}>
            {!messages.length && (
              <p className="vh-ask__empty">Say hello: questions, reservations, partnerships.</p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`vh-ask__bubble vh-ask__bubble--${m.sender === 'visitor' ? 'me' : m.sender}`}
              >
                <span className="vh-ask__who">
                  {m.sender === 'visitor' ? 'You' : m.sender === 'admin' ? 'Valhalla' : 'Hall'}
                </span>
                <p>{m.body}</p>
              </div>
            ))}
          </div>
          <form className="vh-ask__form" onSubmit={send}>
            <div className="vh-ask__meta">
              <input
                type="text"
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Your question…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={2000}
              required
            />
            {error && <p className="vh-ask__error">{error}</p>}
            <button type="submit" disabled={busy || !body.trim()}>
              {busy ? 'Sending…' : 'Send'}
            </button>
          </form>
        </section>
      )}
    </div>
  )
}
