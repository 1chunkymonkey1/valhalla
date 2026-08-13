import { useState } from 'react'
import { getCompany } from '../lib/companies'
import { INSTAGRAM_URL } from '../lib/launchSchedule'

export default function HallUnlockForm({
  hallId,
  onUnlock,
  error,
  compact = false,
}) {
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [localError, setLocalError] = useState('')
  const company = getCompany(hallId)

  if (!company) return null

  async function submit(e) {
    e.preventDefault()
    setLocalError('')
    setBusy(true)
    try {
      const result = await onUnlock(hallId, code)
      if (!result?.ok) {
        setLocalError(result?.error || 'Wrong code')
        return
      }
      setCode('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      className={`vh-unlock ${compact ? 'vh-unlock--compact' : ''}`}
      onSubmit={submit}
    >
      <p className="vh-unlock__kicker">Instagram code</p>
      <h2 className="vh-unlock__title">Unlock {company.name}</h2>
      <p className="vh-unlock__hint">
        Codes post on{' '}
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
          Instagram
        </a>
        . Enter the one for {company.name}.
      </p>
      <label className="vh-unlock__label">
        Code
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          autoComplete="off"
          spellCheck={false}
          placeholder="••••••••"
          required
          minLength={4}
          maxLength={64}
        />
      </label>
      {(localError || error) && (
        <p className="vh-unlock__error">{localError || error}</p>
      )}
      <button type="submit" disabled={busy || !code.trim()}>
        {busy ? 'Checking…' : `Unlock ${company.name}`}
      </button>
    </form>
  )
}
