import { useEffect, useRef, useState } from 'react'
import { COUNCIL_AGENTS } from '../data/councilAgents'

export default function CouncilDesk() {
  const [agents, setAgents] = useState(COUNCIL_AGENTS)
  const [threads, setThreads] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [thread, setThread] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [goal, setGoal] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [storage, setStorage] = useState('')
  const [aiConfigured, setAiConfigured] = useState(null)
  const [filter, setFilter] = useState('')
  const bottomRef = useRef(null)

  async function loadRoster() {
    const res = await fetch('/api/admin/council', { credentials: 'include' })
    if (!res.ok) return
    const data = await res.json()
    if (data.agents?.length) setAgents(data.agents)
    setThreads(data.threads || [])
    setStorage(data.storage || '')
    setAiConfigured(Boolean(data.aiConfigured))
  }

  async function openThread(id) {
    setMsg('')
    const res = await fetch(`/api/admin/council?id=${encodeURIComponent(id)}`, {
      credentials: 'include',
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setMsg(data.error || 'Could not open thread')
      return
    }
    setActiveId(id)
    setThread(data.thread || null)
    setMessages(data.messages || [])
    setGoal(data.thread?.goal || '')
  }

  async function startWithAgent(agentId) {
    setBusy(true)
    setMsg('')
    try {
      const existing = threads.find(
        (t) => t.kind === 'direct' && t.agentId === agentId && t.status !== 'closed',
      )
      if (existing) {
        await openThread(existing.id)
        return
      }
      const res = await fetch('/api/admin/council', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', agentId, kind: 'direct' }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg(data.error || 'Could not open agent')
        return
      }
      setActiveId(data.thread?.id)
      setThread(data.thread)
      setMessages(data.messages || [])
      setGoal(data.thread?.goal || '')
      await loadRoster()
    } finally {
      setBusy(false)
    }
  }

  async function openChamber() {
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/council', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          kind: 'chamber',
          title: 'Council chamber',
          goal: goal || '',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg(data.error || 'Could not open chamber')
        return
      }
      setActiveId(data.thread?.id)
      setThread(data.thread)
      setMessages(data.messages || [])
      await loadRoster()
    } finally {
      setBusy(false)
    }
  }

  async function sendMessage(e) {
    e?.preventDefault?.()
    if (!activeId || !draft.trim() || busy) return
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/council', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'message',
          threadId: activeId,
          body: draft,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg(data.error || 'Send failed')
        return
      }
      setDraft('')
      setThread(data.thread || thread)
      setMessages(data.messages || [])
      await loadRoster()
    } finally {
      setBusy(false)
    }
  }

  async function saveGoal() {
    if (!activeId) return
    setBusy(true)
    try {
      const res = await fetch('/api/admin/council', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'goal', threadId: activeId, goal }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) setMsg(data.error || 'Goal save failed')
      else setThread(data.thread || thread)
    } finally {
      setBusy(false)
    }
  }

  async function runRound() {
    if (!activeId || busy) return
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/council', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'round',
          threadId: activeId,
          goal,
          maxRounds: 1,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg(data.error || 'Round failed')
        return
      }
      setThread(data.thread || thread)
      setMessages(data.messages || [])
      setMsg(`Round complete · ${data.producedCount || 0} agent messages`)
      await loadRoster()
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    loadRoster().catch(() => {})
    const id = setInterval(() => {
      loadRoster().catch(() => {})
      if (activeId) openThread(activeId).catch(() => {})
    }, 12000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'end' })
  }, [messages.length])

  const filteredAgents = agents.filter((a) => {
    if (!filter.trim()) return true
    const q = filter.toLowerCase()
    return (
      a.name.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      a.id.includes(q) ||
      (a.hall || '').includes(q)
    )
  })

  return (
    <section className="vh-admin__council">
      <div className="vh-admin__card">
        <h2>Council</h2>
        <p className="vh-admin__note">
          Primary AI workspace. Open an agent, @mention peers, or run a bounded autonomous round.
          Storage: <strong>{storage || '…'}</strong>
          {aiConfigured === false ? ' · AI keys not configured' : ''}
          {aiConfigured ? ' · AI ready' : ''}
        </p>
        <div className="vh-admin__row vh-admin__council-toolbar">
          <button type="button" disabled={busy} onClick={openChamber}>
            Open chamber (all 18)
          </button>
          <label className="vh-admin__council-filter">
            Filter agents
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="athena, wolf, legal…"
            />
          </label>
        </div>
        {msg && <p className="vh-admin__note">{msg}</p>}
      </div>

      <div className="vh-admin__council-grid">
        <div className="vh-admin__council-sidebar">
          <h3>Agents</h3>
          <ul className="vh-admin__council-agents">
            {filteredAgents.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  className={thread?.agentId === a.id && thread?.kind === 'direct' ? 'is-active' : ''}
                  disabled={busy}
                  onClick={() => startWithAgent(a.id)}
                >
                  <strong>{a.name}</strong>
                  <span>{a.role}</span>
                </button>
              </li>
            ))}
          </ul>
          <h3>Threads</h3>
          <ul className="vh-admin__inbox-list">
            {threads.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className={`vh-admin__inbox-item ${activeId === t.id ? 'is-active' : ''}`}
                  onClick={() => openThread(t.id)}
                >
                  <strong>{t.title || t.agentId || 'Thread'}</strong>
                  <span className="vh-admin__inbox-preview">{t.preview || t.kind}</span>
                </button>
              </li>
            ))}
            {!threads.length && <li className="vh-admin__note">No threads yet</li>}
          </ul>
        </div>

        <div className="vh-admin__inbox-thread vh-admin__council-thread">
          {!thread ? (
            <p className="vh-admin__note">Select an agent to begin. Use @athena or @all in chamber.</p>
          ) : (
            <>
              <div className="vh-admin__inbox-head">
                <div>
                  <h2>{thread.title}</h2>
                  <p className="vh-admin__note">
                    {thread.kind} · {thread.participants?.length || 0} seats · rounds{' '}
                    {thread.roundCount || 0}
                  </p>
                </div>
              </div>

              <div className="vh-admin__council-goal">
                <label>
                  Shared goal
                  <input
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="What should this thread optimize for?"
                  />
                </label>
                <button type="button" disabled={busy} onClick={saveGoal}>
                  Save goal
                </button>
                <button type="button" disabled={busy} onClick={runRound}>
                  Run round
                </button>
              </div>

              <div className="vh-admin__inbox-msgs vh-admin__council-msgs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`vh-admin__council-bubble vh-admin__council-bubble--${m.kind || 'chat'}`}
                  >
                    <header>
                      <strong>{m.fromId}</strong>
                      {m.toId ? <span> → {m.toId}</span> : null}
                      {m.model ? <em>{m.model}</em> : null}
                    </header>
                    <p>{m.body}</p>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <form className="vh-admin__inbox-compose" onSubmit={sendMessage}>
                <textarea
                  rows={3}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Message the council. @athena @lex @all …"
                  disabled={busy}
                />
                <button type="submit" disabled={busy || !draft.trim()}>
                  {busy ? 'Working…' : 'Send'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
