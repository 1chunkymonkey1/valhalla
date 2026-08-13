import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SiteMenu from '../components/layout/SiteMenu'

export default function TeamLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/team/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Login failed')
        setBusy(false)
        return
      }
      navigate('/team')
    } catch {
      setError('Network error')
      setBusy(false)
    }
  }

  return (
    <div className="vh-page vh-team">
      <SiteMenu />
      <div className="vh-team__split">
        <section className="vh-team__explain">
          <p className="vh-team__mark">Valhalla Empire</p>
          <h1>Team login</h1>
          <p>
            Simple seat for people building the twelve halls. You get an invite from the founder,
            set a password once, then sign in here with email + password.
          </p>
          <ol>
            <li>Founder invites you from Admin → People</li>
            <li>Open your invite link and choose a password</li>
            <li>Return here anytime to work your halls, tasks, and inbox</li>
          </ol>
          <p className="vh-team__note">
            Founder control tower (password + 2FA) stays at <Link to="/admin">/admin</Link>.
          </p>
        </section>

        <form className="vh-team__gate" onSubmit={onSubmit}>
          <h2>Sign in</h2>
          <label>
            Work email
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p className="vh-admin__error">{error}</p>}
          <button type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Enter workspace'}
          </button>
          <p className="vh-team__fine">
            Have an invite link? It looks like <code>/team/join?token=…</code>
          </p>
        </form>
      </div>
    </div>
  )
}
