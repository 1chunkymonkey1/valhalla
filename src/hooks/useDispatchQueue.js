import { useCallback, useEffect, useState } from 'react'

async function copyText(text) {
  if (!text) return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

function draftFrom(item) {
  return {
    to: item?.to || '',
    subject: item?.subject || '',
    body: item?.body || '',
    applyUrl: item?.applyUrl || '',
  }
}

export function useDispatchQueue(opts = {}) {
  const preferIds = opts.preferIds
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [activeId, setActiveId] = useState('')
  const [draft, setDraft] = useState({ to: '', subject: '', body: '', applyUrl: '' })
  const [busy, setBusy] = useState('')
  const [sendWarn, setSendWarn] = useState('')

  const items = data?.items || []
  const active = items.find((i) => i.id === activeId) || null

  const selectItem = useCallback((item, opts = {}) => {
    if (!item) return
    setActiveId(item.id)
    setDraft(draftFrom(item))
    if (!opts.keepMsg) {
      setMsg('')
      setSendWarn('')
    }
    if (typeof window !== 'undefined' && window.location.pathname === '/capital') {
      window.history.replaceState(null, '', `#${item.id}`)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/dispatch', { credentials: 'include' })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}))
        if (cancelled) return
        if (!res.ok) {
          setError(json.error || 'Could not load dispatch')
          return
        }
        setData(json)
        setError('')
        const list = json.items || []
        const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''
        const preferred = (preferIds || [])
          .map((id) => list.find((i) => i.id === id && i.status !== 'sent'))
          .find(Boolean)
        const first = list.find((i) => i.id === hash) || preferred || list[0]
        if (first) {
          setActiveId(first.id)
          setDraft(draftFrom(first))
        }
      })
      .catch(() => {
        if (!cancelled) setError('Could not load dispatch')
      })
    return () => {
      cancelled = true
    }
  }, [preferIds])

  const post = useCallback(
    async (action, extra = {}, targetId = activeId) => {
      if (!targetId) return null
      setBusy(action)
      setError('')
      try {
        const res = await fetch('/api/admin/dispatch', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: targetId, action, ...extra }),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(json.error || 'Request failed')
          return null
        }
        if (json.item) {
          setData((prev) => ({
            ...prev,
            items: (prev?.items || []).map((i) => (i.id === json.item.id ? json.item : i)),
          }))
          selectItem(json.item, { keepMsg: true })
        }
        return json
      } finally {
        setBusy('')
      }
    },
    [activeId, selectItem],
  )

  async function save() {
    const json = await post('save', draft)
    if (json?.item) {
      setMsg(
        json.item.status === 'draft' && active?.status === 'approved'
          ? 'Saved. Re-approve after the edit.'
          : 'Saved.',
      )
    }
  }

  async function approve() {
    const dirty =
      draft.to !== (active?.to || '') ||
      draft.subject !== (active?.subject || '') ||
      draft.body !== (active?.body || '') ||
      draft.applyUrl !== (active?.applyUrl || '')
    if (dirty) {
      const saved = await post('save', draft)
      if (!saved) return
    }
    const json = await post('approve')
    if (json?.item) setMsg('Approved. Send is unlocked for this item only.')
  }

  async function send() {
    const json = await post('send')
    if (!json?.compose) return
    setSendWarn(json.compose.warning || '')
    const copied = await copyText(json.compose.copy || draft.body)
    if (copied) setMsg('Body copied. Opening compose. Click Send there, then Mark sent here.')
    else setMsg('Could not copy automatically. Copy the body below, then send.')
    if (json.compose.url) window.open(json.compose.url, '_blank', 'noopener,noreferrer')
  }

  async function markSent() {
    const json = await post('mark-sent')
    if (json?.item) {
      setSendWarn('')
      setMsg('Marked sent.')
    }
  }

  async function copyBody() {
    const ok = await copyText(draft.body)
    setMsg(ok ? 'Copied.' : 'Copy failed.')
  }

  const sendDisabled =
    !active ||
    busy ||
    active.status !== 'approved' ||
    active.gated === 'no-send' ||
    active.held ||
    (active.channel === 'email' && !(draft.to || '').includes('@')) ||
    (active.channel === 'application' && !(draft.applyUrl || active.applyUrl))

  const sendLabel =
    active?.channel === 'application'
      ? 'Open application'
      : active?.channel === 'internal'
        ? 'Email me a copy'
        : 'Open Gmail'

  return {
    data,
    error,
    msg,
    setMsg,
    items,
    active,
    draft,
    setDraft,
    busy,
    sendWarn,
    selectItem,
    save,
    approve,
    unapprove: () => post('unapprove'),
    send,
    markSent,
    copyBody,
    sendDisabled,
    sendLabel,
    post,
  }
}
