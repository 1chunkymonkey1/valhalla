import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PhenixKenazGate({ placement = 'social', onUnlocked }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      const res = await fetch('/api/hub/prometheus-gate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.unlocked) {
        setError('Denied.')
        setPending(false)
        return
      }
      setOpen(false)
      setCode('')
      setPending(false)
      if (onUnlocked) onUnlocked()
      else navigate('/phenix/prometheus')
    } catch {
      setError('Gate unreachable.')
      setPending(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className={placement === 'hall' ? 'cs-kenaz cs-kenaz--hall' : 'cs-kenaz'}
        aria-label="Kenaz"
        title=""
        onClick={() => setOpen(true)}
      >
        {placement === 'hall' ? (
          <>
            <span aria-hidden>ᚲ</span> Kenaz
          </>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M18 4 L7 12 L18 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </svg>
        )}
      </button>

      {open ? (
        <div className="cs-kenaz-modal" role="dialog" aria-modal="true" aria-label="Kenaz">
          <button type="button" className="cs-kenaz-modal__scrim" aria-label="Close" onClick={() => setOpen(false)} />
          <form className="cs-kenaz-modal__box" onSubmit={onSubmit}>
            <p className="cs-kenaz-modal__rune" aria-hidden>
              ᚲ
            </p>
            <p className="cs-kenaz-modal__label">Kenaz</p>
            <input
              type="password"
              name="code"
              autoComplete="off"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              aria-label="Access code"
            />
            {error ? <p className="cs-kenaz-modal__error">{error}</p> : null}
            <button type="submit" disabled={pending}>
              Enter
            </button>
          </form>
        </div>
      ) : null}
    </>
  )
}
