import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import SiteMenu from '../components/layout/SiteMenu'

export default function TeamJoinPage() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const navigate = useNavigate()
  const [invite, setInvite] = useState(null)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Missing invite token')
      return
    }
    fetch(`/api/team/accept-invite?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok) setError(data.error || 'Invite invalid')
        else {
          setInvite(data.invite)
          setName(data.invite.name || '')
        }
      })
      .catch(() => setError('Could not load invite'))
  }, [token])

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const res = await fetch('/api/team/accept-invite', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, name, password }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error || 'Could not accept invite')
      setBusy(false)
      return
    }
    navigate('/team')
  }

  return (
    <div className="vh-page vh-team">
      <SiteMenu />
      <form className="vh-team__gate vh-team__gate--solo" onSubmit={onSubmit}>
        <p className="vh-team__mark">Join Valhalla</p>
        <h1>Accept invite</h1>
        {invite ? (
          <>
            <p>
              Seat for <strong>{invite.email}</strong> as <strong>{invite.roleLabel}</strong>
              {invite.halls?.length ? ` · halls: ${invite.halls.join(', ')}` : ''}.
            </p>
            <label>
              Your name
              <input required value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              Create password (8+ characters)
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error && <p className="vh-admin__error">{error}</p>}
            <button type="submit" disabled={busy}>
              {busy ? 'Creating seat…' : 'Enter the empire'}
            </button>
          </>
        ) : (
          <p className="vh-admin__error">{error || 'Loading invite…'}</p>
        )}
        <Link to="/team/login">Already joined? Sign in</Link>
      </form>
    </div>
  )
}
