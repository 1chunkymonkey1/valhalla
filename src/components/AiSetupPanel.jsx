import { useEffect, useState } from 'react'

const PROVIDERS = [
  { id: 'auto', label: 'Auto (Cursor → Gateway → OpenAI)' },
  { id: 'cursor', label: 'Cursor only' },
  { id: 'gateway', label: 'AI Gateway only' },
  { id: 'openai', label: 'OpenAI only' },
]

function credLabel(value) {
  if (value === 'set') return 'ready'
  if (value === 'missing') return 'missing'
  return value || '…'
}

export default function AiSetupPanel({ compact = false }) {
  const [status, setStatus] = useState(null)
  const [provider, setProvider] = useState('auto')
  const [cursorModel, setCursorModel] = useState('composer-2.5')
  const [chatModel, setChatModel] = useState('openai/gpt-5.4-mini')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    const res = await fetch('/api/admin/ai', { credentials: 'include' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setMsg(data.error || 'Could not load AI status')
      return
    }
    setStatus(data)
    setProvider(data.settings?.provider || 'auto')
    setCursorModel(data.settings?.cursorModel || 'composer-2.5')
    setChatModel(data.settings?.chatModel || 'openai/gpt-5.4-mini')
  }

  useEffect(() => {
    load()
  }, [])

  async function save(e) {
    e?.preventDefault?.()
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          provider,
          cursorModel,
          chatModel,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg(data.error || 'Save failed')
        return
      }
      setStatus(data)
      setMsg('Saved. New Council / Ask replies use this provider + model.')
    } finally {
      setBusy(false)
    }
  }

  const creds = status?.credentials || {}
  const active = status?.active || {}
  const cursorModels = status?.models?.cursor || []
  const gatewayModels = status?.models?.gateway || []

  return (
    <div className={`vh-admin__card ${compact ? 'vh-admin__ai-compact' : ''}`}>
      <h2>AI setup</h2>
      <p className="vh-admin__note">
        {status?.message || 'Loading…'}
        {status?.settings?.storage ? ` · prefs: ${status.settings.storage}` : ''}
      </p>

      <ul className="vh-admin__ai-creds">
        <li data-state={creds.cursor}>
          Cursor <strong>{credLabel(creds.cursor)}</strong>
        </li>
        <li data-state={creds.gateway}>
          AI Gateway <strong>{credLabel(creds.gateway)}</strong>
        </li>
        <li data-state={creds.openai}>
          OpenAI <strong>{credLabel(creds.openai)}</strong>
        </li>
        <li data-state={creds.supabase}>
          Supabase <strong>{credLabel(creds.supabase)}</strong>
        </li>
      </ul>

      {active.provider ? (
        <p className="vh-admin__note">
          Active now: <strong>{active.provider}</strong> · {active.label || active.model}
        </p>
      ) : (
        <p className="vh-admin__note">
          Active now: none — add a key on Vercel, then redeploy. See docs/ai-setup.md.
        </p>
      )}

      <form className="vh-admin__ai-form" onSubmit={save}>
        <label>
          Provider
          <select value={provider} onChange={(e) => setProvider(e.target.value)} disabled={busy}>
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Cursor model (frontier switch)
          <select
            value={cursorModel}
            onChange={(e) => setCursorModel(e.target.value)}
            disabled={busy || creds.cursor !== 'set'}
          >
            {(cursorModels.length
              ? cursorModels
              : [{ id: cursorModel || 'composer-2.5', displayName: cursorModel || 'composer-2.5' }]
            ).map((m) => (
              <option key={m.id} value={m.id}>
                {m.displayName || m.id}
              </option>
            ))}
          </select>
        </label>

        <label>
          Gateway / OpenAI model
          <select value={chatModel} onChange={(e) => setChatModel(e.target.value)} disabled={busy}>
            {(gatewayModels.length
              ? gatewayModels
              : [{ id: chatModel, displayName: chatModel }]
            ).map((m) => (
              <option key={m.id} value={m.id}>
                {m.displayName || m.id}
              </option>
            ))}
            {!gatewayModels.some((m) => m.id === chatModel) && chatModel ? (
              <option value={chatModel}>{chatModel}</option>
            ) : null}
          </select>
        </label>

        <div className="vh-admin__row">
          <button type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Save AI prefs'}
          </button>
          <button type="button" disabled={busy} onClick={load}>
            Refresh status
          </button>
        </div>
      </form>

      {msg && <p className="vh-admin__note">{msg}</p>}
    </div>
  )
}
