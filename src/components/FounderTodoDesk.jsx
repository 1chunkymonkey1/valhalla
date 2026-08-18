import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const EMPTY_FORM = {
  title: '',
  bottleneckId: '',
  kind: 'choose',
  whyEason: '',
  decision: '',
  optionA: '',
  optionB: '',
  optionC: '',
  failedLane: 'automate',
  source: 'founder',
  evidenceRef: '',
  expiresAt: '',
  dueAt: '',
}

function defaultExpiry() {
  const d = new Date()
  d.setDate(d.getDate() + 3)
  d.setHours(17, 0, 0, 0)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function FounderTodoDesk() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [form, setForm] = useState({ ...EMPTY_FORM, expiresAt: defaultExpiry() })
  const [waitFor, setWaitFor] = useState({})

  async function load() {
    const res = await fetch('/api/admin/founder-todo', { credentials: 'include' })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(json.error || 'Could not load founder queue')
      return
    }
    setData(json)
    setError('')
  }

  useEffect(() => {
    load().catch(() => setError('Could not load founder queue'))
  }, [])

  const bottlenecks = data?.bottlenecks || []
  const kinds = data?.kinds || ['choose']
  const lanes = data?.failedLanes || ['automate']
  const selectedRule = bottlenecks.find((b) => b.id === form.bottleneckId) || null

  async function post(body) {
    setBusy(body.action || 'create')
    setMsg('')
    setError('')
    try {
      const res = await fetch('/api/admin/founder-todo', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json.ok === false) {
        setError(json.error || 'Request failed')
        return
      }
      setMsg(body.action === 'create' ? 'Act admitted.' : 'Queue updated.')
      if (body.action === 'create') {
        setShowForm(false)
        setForm({ ...EMPTY_FORM, expiresAt: defaultExpiry() })
      }
      await load()
    } finally {
      setBusy('')
    }
  }

  function submitCreate(e) {
    e.preventDefault()
    const options = [form.optionA, form.optionB, form.optionC].map((s) => s.trim()).filter(Boolean)
    post({
      action: 'create',
      title: form.title,
      bottleneckId: form.bottleneckId,
      kind: form.kind,
      whyEason: form.whyEason,
      decision: form.decision,
      options,
      failedLane: form.failedLane,
      source: form.source,
      evidenceRef: form.evidenceRef,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : '',
      dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : '',
    })
  }

  const counts = data?.counts || {}
  const open = data?.open || []
  const waiting = data?.waiting || []

  return (
    <section className="vh-admin__founder">
      <div className="vh-admin__card">
        <h2>Founder queue</h2>
        <p className="vh-admin__note">
          {data?.policy || 'Automate first. Tools second. Todo third. Founder-only.'} Storage:{' '}
          <strong>{data?.storage || '…'}</strong>
          {data?.durabilityNote ? ` · ${data.durabilityNote}` : ''}
        </p>
        <ol className="vh-admin__founder-cadence">
          {(data?.cadence || []).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </div>

      {(data?.sundayBoards || []).length > 0 && (
        <div className="vh-admin__card">
          <h2>Sunday three</h2>
          <p className="vh-admin__note">
            Score these objects. Not twelve halls. Not todos. Green is an honest status line. Red is
            capacity, ROI, closed-farm, or funds-on-Atoll language.
          </p>
          <div className="vh-admin__sunday">
            {(data.sundayBoards || []).map((board) => (
              <div key={board.id}>
                <h2>{board.name}</h2>
                <p className="vh-admin__note">{board.metric}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="vh-admin__grid">
        <div className="vh-admin__card">
          <h2>Capital remaining</h2>
          <p className="vh-admin__count">{counts.capitalRemaining ?? '…'}</p>
          <p className="vh-admin__note">
            Tool, not a todo. <Link to="/capital">Open /capital</Link>. Send at most one NOW item.
          </p>
        </div>
        <div className="vh-admin__card">
          <h2>Inbox needs human</h2>
          <p className="vh-admin__count">{counts.inboxNeedsHuman ?? '…'}</p>
          <p className="vh-admin__note">Reply in Inbox. Promote here only for signature, money, or a legal claim.</p>
        </div>
        <div className="vh-admin__card">
          <h2>Team open</h2>
          <p className="vh-admin__count">{counts.teamOpen ?? '…'}</p>
          <p className="vh-admin__note">
            Stays on <Link to="/team">/team</Link>. This queue is not a second task list.
          </p>
        </div>
        <div className="vh-admin__card">
          <h2>Founder open</h2>
          <p className="vh-admin__count">
            {counts.founderOpen ?? 0}/{data?.maxOpen || 7}
          </p>
          <p className="vh-admin__note">Cap seven. Sweep drops oldest non-clock ballast.</p>
        </div>
      </div>

      <div className="vh-admin__card">
        <div className="vh-admin__inbox-head">
          <h2>Open acts</h2>
          <button type="button" className="vh-admin__secondary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Close form' : 'New founder act'}
          </button>
        </div>
        {open.length === 0 && (
          <p className="vh-admin__empty">Empty is the win. Open Council only after this, or when waiting.</p>
        )}
        <ul className="vh-admin__founder-list">
          {open.map((item) => (
            <li key={item.id} className="vh-admin__founder-act">
              <p>
                <strong>{item.title}</strong>
                <span>
                  {item.kind} · {item.hall} · {item.bottleneckId}
                </span>
              </p>
              <p>{item.decision}</p>
              <p className="vh-admin__note">{item.whyEason}</p>
              <div className="vh-admin__founder-options">
                {(item.options || []).map((option) => (
                  <button
                    key={option}
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() => post({ action: 'decide', id: item.id, option })}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="vh-admin__row">
                <input
                  value={waitFor[item.id] || ''}
                  onChange={(e) => setWaitFor((w) => ({ ...w, [item.id]: e.target.value }))}
                  placeholder="Waiting on person or clock"
                />
                <button
                  type="button"
                  className="vh-admin__secondary"
                  disabled={Boolean(busy)}
                  onClick={() => post({ action: 'wait', id: item.id, waitingOn: waitFor[item.id] })}
                >
                  Wait
                </button>
                <button
                  type="button"
                  className="vh-admin__secondary"
                  disabled={Boolean(busy)}
                  onClick={() => post({ action: 'junk', id: item.id, reason: 'founder marked junk' })}
                >
                  Junk
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {waiting.length > 0 && (
        <div className="vh-admin__card">
          <h2>Waiting</h2>
          <ul className="vh-admin__list">
            {waiting.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <span>
                  {item.waitingOn} · {item.kind} · {item.bottleneckId}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showForm && (
        <form className="vh-admin__card vh-admin__founder-form" onSubmit={submitCreate}>
          <h2>Admit an act</h2>
          <p className="vh-admin__note">
            If automate, a tool, Inbox, /team, or /capital can close it, do not create this. Expiry max seven days.
          </p>
          <label>
            Standing bottleneck
            <select
              required
              value={form.bottleneckId}
              onChange={(e) => setForm((f) => ({ ...f, bottleneckId: e.target.value }))}
            >
              <option value="">Select the decision that keeps coming back</option>
              {bottlenecks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}: {b.decision}
                </option>
              ))}
            </select>
          </label>
          {selectedRule && <p className="vh-admin__founder-rule">{selectedRule.lockedRule}</p>}
          <label>
            Title
            <input
              required
              maxLength={80}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Verb-first. Not remember / follow up."
            />
          </label>
          <div className="vh-admin__row">
            <label>
              Kind
              <select value={form.kind} onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value }))}>
                {kinds.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Lane that already failed
              <select
                value={form.failedLane}
                onChange={(e) => setForm((f) => ({ ...f, failedLane: e.target.value }))}
              >
                {lanes.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Source
              <select value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}>
                <option value="founder">founder</option>
                <option value="inbox-escalation">inbox-escalation</option>
                <option value="council-extract">council-extract</option>
              </select>
            </label>
          </div>
          <label>
            Why only Eason
            <input
              required
              maxLength={280}
              value={form.whyEason}
              onChange={(e) => setForm((f) => ({ ...f, whyEason: e.target.value }))}
              placeholder="The act only Eason’s body can do."
            />
          </label>
          <label>
            Decision (must be a question)
            <input
              required
              maxLength={240}
              value={form.decision}
              onChange={(e) => setForm((f) => ({ ...f, decision: e.target.value }))}
            />
          </label>
          <div className="vh-admin__row">
            <label>
              Option A
              <input
                required
                value={form.optionA}
                onChange={(e) => setForm((f) => ({ ...f, optionA: e.target.value }))}
              />
            </label>
            <label>
              Option B
              <input
                required
                value={form.optionB}
                onChange={(e) => setForm((f) => ({ ...f, optionB: e.target.value }))}
              />
            </label>
            <label>
              Option C
              <input value={form.optionC} onChange={(e) => setForm((f) => ({ ...f, optionC: e.target.value }))} />
            </label>
          </div>
          <label>
            Evidence
            <input
              value={form.evidenceRef}
              onChange={(e) => setForm((f) => ({ ...f, evidenceRef: e.target.value }))}
              placeholder="inbox:id · council:id FOUNDER_ACT · note:…  (not /capital or /team)"
            />
          </label>
          <div className="vh-admin__row">
            <label>
              Expires
              <input
                required
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
              />
            </label>
            <label>
              Due (clock-bound only)
              <input
                type="datetime-local"
                value={form.dueAt}
                onChange={(e) => setForm((f) => ({ ...f, dueAt: e.target.value }))}
              />
            </label>
          </div>
          <button type="submit" disabled={Boolean(busy)}>
            {busy === 'create' ? 'Checking gate…' : 'Admit'}
          </button>
        </form>
      )}

      <div className="vh-admin__card">
        <button type="button" className="vh-admin__secondary" onClick={() => setShowRules((v) => !v)}>
          {showRules ? 'Hide standing rules' : 'Standing rules (not todos)'}
        </button>
        {showRules && (
          <ul className="vh-admin__founder-rules">
            {bottlenecks.map((b) => (
              <li key={b.id}>
                <strong>
                  {b.name} · {b.id}
                </strong>
                <span>{b.decision}</span>
                <span>{b.lockedRule}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="vh-admin__error">{error}</p>}
      {msg && <p className="vh-admin__note">{msg}</p>}
    </section>
  )
}
