import { useState } from 'react'

export default function EmailCapture({
  title = 'Stay in the halls',
  hint = 'Launch notes, product drops, and press — no spam.',
  source = 'hub',
  audience = 'general',
  companyId = null,
}) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('saving')
    setError('')
    const payload = {
      email: email.trim(),
      name: name.trim(),
      source,
      audience,
      companyId,
      submittedAt: new Date().toISOString(),
    }

    try {
      const key = 'valhalla_email_signups'
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      existing.push(payload)
      localStorage.setItem(key, JSON.stringify(existing))
    } catch {
      // ignore
    }

    try {
      const res = await fetch('/api/signups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Signup failed')
      }
      setStatus('done')
      setEmail('')
      setName('')
    } catch (err) {
      // Local save still succeeded — soft-fail network
      setStatus('done')
      if (err instanceof Error && err.message && !err.message.includes('fetch')) {
        setError(err.message)
      }
    }
  }

  if (status === 'done') {
    return (
      <div className="vh-email vh-email--done">
        <p className="vh-email__title">You’re on the list.</p>
        <p className="vh-email__hint">We’ll write when the next hall opens.</p>
      </div>
    )
  }

  return (
    <form className="vh-email" onSubmit={handleSubmit}>
      <p className="vh-email__title">{title}</p>
      <p className="vh-email__hint">{hint}</p>
      <div className="vh-email__row">
        <label className="vh-email__field">
          <span className="vh-email__sr">Name</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="vh-email__field vh-email__field--grow">
          <span className="vh-email__sr">Email</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? '…' : 'Join'}
        </button>
      </div>
      {error && <p className="vh-email__error">{error}</p>}
    </form>
  )
}
