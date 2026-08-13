import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteMenu from '../components/layout/SiteMenu'
import { formatUsd } from '../data/payLinks'
import { HALL_IDS, TEAM_ROLES } from '../data/teamRoles'

const ADMIN_EMAIL = 'info@valhallaco.org'

export default function AdminPage() {
  const [auth, setAuth] = useState({ loading: true, ok: false, email: null })
  const [email, setEmail] = useState(ADMIN_EMAIL)
  const [password, setPassword] = useState('')
  const [totp, setTotp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [ledger, setLedger] = useState(null)
  const [localPreview, setLocalPreview] = useState({ reservations: [], signups: [] })
  const [adminTab, setAdminTab] = useState('overview')
  const [people, setPeople] = useState(null)
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    role: 'hall_lead',
    halls: [],
  })
  const [lastInviteUrl, setLastInviteUrl] = useState('')
  const [peopleMsg, setPeopleMsg] = useState('')
  const [codes, setCodes] = useState([])
  const [codeDrafts, setCodeDrafts] = useState({})
  const [codesMsg, setCodesMsg] = useState('')
  const [socials, setSocials] = useState([])
  const [socialMsg, setSocialMsg] = useState('')

  async function refreshSession() {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    try {
      const res = await fetch('/api/admin/session', {
        credentials: 'include',
        signal: controller.signal,
      })
      const data = await res.json().catch(() => ({}))
      if (data.authenticated) {
        setAuth({ loading: false, ok: true, email: data.email })
        loadLedger().catch(() => {})
        loadPeople().catch(() => {})
        loadCodes().catch(() => {})
        loadSocials().catch(() => {})
      } else {
        setAuth({ loading: false, ok: false, email: null })
      }
    } catch {
      setAuth({ loading: false, ok: false, email: null })
    } finally {
      clearTimeout(timer)
    }
  }

  async function loadLedger() {
    const res = await fetch('/api/admin/ledger', { credentials: 'include' })
    if (!res.ok) return
    const data = await res.json()
    setLedger(data)
  }

  async function loadPeople() {
    const res = await fetch('/api/admin/people', { credentials: 'include' })
    if (!res.ok) return
    const data = await res.json()
    setPeople(data)
  }

  async function loadCodes() {
    const res = await fetch('/api/admin/codes', { credentials: 'include' })
    if (!res.ok) return
    const data = await res.json()
    setCodes(data.codes || [])
    const drafts = {}
    for (const row of data.codes || []) {
      drafts[row.hallId] = { code: row.code || '', note: row.note || '' }
    }
    setCodeDrafts(drafts)
  }

  async function loadSocials() {
    const res = await fetch('/api/admin/socials', { credentials: 'include' })
    if (!res.ok) return
    const data = await res.json()
    setSocials(data.socials || [])
  }

  useEffect(() => {
    refreshSession()
    try {
      setLocalPreview({
        reservations: JSON.parse(localStorage.getItem('valhalla_reservation_ledger') || '[]'),
        signups: JSON.parse(localStorage.getItem('valhalla_email_signups') || '[]'),
      })
    } catch {
      // ignore
    }
  }, [])

  async function pastePassword() {
    setError('')
    try {
      const text = await navigator.clipboard.readText()
      if (!text) {
        setError('Clipboard is empty — copy the password first, then Paste.')
        return
      }
      setPassword(text.trim())
    } catch {
      setError('Clipboard blocked by the browser. Type the password, or allow paste for this site.')
    }
  }

  async function login(e) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, totp }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error || 'Login failed')
      return
    }
    setPassword('')
    setTotp('')
    setAuth({ loading: false, ok: true, email: data.email })
    await loadLedger()
    await loadPeople()
    await loadCodes()
    await loadSocials()
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    setAuth({ loading: false, ok: false, email: null })
    setLedger(null)
    setCodes([])
    setSocials([])
  }

  async function saveCode(hallId) {
    setCodesMsg('')
    const draft = codeDrafts[hallId] || { code: '', note: '' }
    const res = await fetch('/api/admin/codes', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hallId, code: draft.code, note: draft.note }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setCodesMsg(data.error || 'Save failed')
      return
    }
    setCodesMsg(`Saved ${hallId}`)
    await loadCodes()
  }

  async function saveSocial(companyId) {
    setSocialMsg('')
    const row = socials.find((s) => s.companyId === companyId)
    if (!row) return
    const res = await fetch('/api/admin/socials', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setSocialMsg(data.error || 'Save failed')
      return
    }
    setSocialMsg(`Saved ${companyId}`)
    await loadSocials()
  }

  function patchSocial(companyId, field, value) {
    setSocials((prev) =>
      prev.map((s) => (s.companyId === companyId ? { ...s, [field]: value } : s)),
    )
  }

  async function uploadLocalLedger() {
    const reservations = localPreview.reservations || []
    const res = await fetch('/api/admin/ledger', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservations }),
    })
    const data = await res.json()
    if (res.ok) {
      await loadLedger()
      alert(`Imported ${data.imported} reservation rows from this browser.`)
    } else {
      alert(data.error || 'Import failed')
    }
  }

  if (auth.loading) {
    return (
      <div className="vh-page vh-admin">
        <p className="vh-admin__loading">Checking session…</p>
      </div>
    )
  }

  if (!auth.ok) {
    return (
      <div className="vh-page vh-admin">
        <SiteMenu />
        <form className="vh-admin__gate" onSubmit={login} autoComplete="on">
          <p className="vh-admin__mark">Valhalla</p>
          <h1>Admin</h1>
          <p className="vh-admin__hint">
            Restricted to {ADMIN_EMAIL} · password + authenticator code
          </p>
          <label>
            Email
            <input
              type="email"
              name="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              inputMode="email"
            />
          </label>
          <label>
            Password
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onPaste={(e) => {
                const text = e.clipboardData?.getData('text')
                if (text != null) {
                  e.preventDefault()
                  setPassword(text)
                }
              }}
              autoComplete="current-password"
              spellCheck={false}
            />
          </label>
          <div className="vh-admin__row">
            <button type="button" className="vh-admin__secondary" onClick={pastePassword}>
              Paste password
            </button>
            <button
              type="button"
              className="vh-admin__secondary"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? 'Hide' : 'Show'} password
            </button>
          </div>
          <label className="vh-admin__totp">
            6-digit authenticator code
            <input
              type="text"
              name="one-time-code"
              required
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="000000"
              value={totp}
              onChange={(e) => setTotp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onPaste={(e) => {
                const text = e.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6)
                if (text) {
                  e.preventDefault()
                  setTotp(text)
                }
              }}
              autoComplete="one-time-code"
              autoFocus={false}
            />
            <span className="vh-admin__totp-help">
              From Google Authenticator / Authy / 1Password for info@valhallaco.org
            </span>
          </label>
          {error && <p className="vh-admin__error">{error}</p>}
          <button type="submit">Enter</button>
          <p className="vh-admin__fine">
            Needs <code>ADMIN_PASSWORD</code>, <code>ADMIN_SESSION_SECRET</code>, and{' '}
            <code>ADMIN_TOTP_SECRET</code> on Vercel. Generate the TOTP secret with{' '}
            <code>npm run admin:totp</code>.
          </p>
          <Link to="/">← Hub</Link>
        </form>
      </div>
    )
  }

  async function sendInvite(e) {
    e.preventDefault()
    setPeopleMsg('')
    const res = await fetch('/api/admin/people', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'invite', ...inviteForm }),
    })
    const data = await res.json()
    if (!res.ok) {
      setPeopleMsg(data.error || 'Invite failed')
      return
    }
    setLastInviteUrl(data.acceptUrl)
    setPeopleMsg(`Invite ready for ${data.invite.email}`)
    setInviteForm({ email: '', name: '', role: 'hall_lead', halls: [] })
    loadPeople()
  }

  function toggleHall(hall) {
    setInviteForm((prev) => {
      const has = prev.halls.includes(hall)
      return {
        ...prev,
        halls: has ? prev.halls.filter((h) => h !== hall) : [...prev.halls, hall],
      }
    })
  }

  async function exportEmpire() {
    const res = await fetch('/api/admin/people', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'export' }),
    })
    const data = await res.json()
    if (!res.ok) return
    const blob = new Blob([JSON.stringify(data.empire, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `valhalla-empire-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function importEmpireFile(file) {
    if (!file) return
    const text = await file.text()
    const empire = JSON.parse(text)
    const res = await fetch('/api/admin/people', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'import', empire }),
    })
    const data = await res.json()
    setPeopleMsg(data.ok ? 'Empire state imported' : 'Import failed')
    loadPeople()
  }

  return (
    <div className="vh-page vh-admin vh-admin--in">
      <SiteMenu />
      <header className="vh-admin__top">
        <div>
          <p className="vh-admin__mark">Valhalla</p>
          <p>{auth.email} · admin</p>
        </div>
        <button type="button" onClick={logout}>
          Sign out
        </button>
      </header>

      <nav className="vh-team__tabs">
        {[
          ['overview', 'Overview'],
          ['people', 'People'],
          ['codes', 'Hall codes'],
          ['socials', 'Socials'],
          ['ledgers', 'Ledgers'],
          ['activity', 'Activity'],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={adminTab === id ? 'is-active' : ''}
            onClick={() => setAdminTab(id)}
          >
            {label}
          </button>
        ))}
        <Link to="/admin/editor/hub" className="vh-admin__editor-link">
          Page editor
        </Link>
      </nav>

      {adminTab === 'overview' && (
        <section className="vh-admin__grid">
          <div className="vh-admin__card">
            <h2>Team seats</h2>
            <p className="vh-admin__count">{people?.users?.length ?? 0}</p>
            <p className="vh-admin__note">
              Teammates work at <Link to="/team">/team</Link>. You stay here with 2FA.
            </p>
          </div>
          <div className="vh-admin__card">
            <h2>Open invites</h2>
            <p className="vh-admin__count">
              {people?.invites?.filter((i) => !i.acceptedAt).length ?? 0}
            </p>
          </div>
          <div className="vh-admin__card">
            <h2>Interest</h2>
            <p className="vh-admin__count">
              {(ledger?.reservations?.length ?? 0) + (ledger?.signups?.length ?? 0)}
            </p>
            <p className="vh-admin__note">Reservations + email signups on server.</p>
          </div>
          <div className="vh-admin__card">
            <h2>Twelve halls</h2>
            <ul className="vh-admin__companies">
              {(ledger?.companies || []).map((c) => (
                <li key={c.id}>
                  <Link to={`/${c.id}`}>{c.name}</Link>
                  <span>
                    {c.domain} · {c.pillar}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {adminTab === 'people' && (
        <section className="vh-admin__people">
          <form className="vh-admin__card" onSubmit={sendInvite}>
            <h2>Invite teammate</h2>
            <p className="vh-admin__note">
              They get a simple email+password seat. Roles: hall lead, empire ops, growth, finance,
              comms.
            </p>
            <label>
              Email
              <input
                type="email"
                required
                value={inviteForm.email}
                onChange={(e) => setInviteForm((p) => ({ ...p, email: e.target.value }))}
              />
            </label>
            <label>
              Name
              <input
                value={inviteForm.name}
                onChange={(e) => setInviteForm((p) => ({ ...p, name: e.target.value }))}
              />
            </label>
            <label>
              Role
              <select
                value={inviteForm.role}
                onChange={(e) => setInviteForm((p) => ({ ...p, role: e.target.value }))}
              >
                {Object.entries(people?.roles || TEAM_ROLES).map(([id, meta]) => (
                  <option key={id} value={id}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </label>
            <fieldset className="vh-admin__halls">
              <legend>Hall access (for hall leads)</legend>
              {(people?.halls || HALL_IDS).map((h) => (
                <label key={h} className="vh-admin__check">
                  <input
                    type="checkbox"
                    checked={inviteForm.halls.includes(h)}
                    onChange={() => toggleHall(h)}
                  />
                  {h}
                </label>
              ))}
            </fieldset>
            <button type="submit">Create invite link</button>
            {peopleMsg && <p className="vh-admin__note">{peopleMsg}</p>}
            {lastInviteUrl && (
              <p className="vh-admin__invite">
                Share this once:{' '}
                <a href={lastInviteUrl} target="_blank" rel="noreferrer">
                  {lastInviteUrl}
                </a>
              </p>
            )}
          </form>

          <div className="vh-admin__card">
            <h2>Team</h2>
            <ul className="vh-admin__list">
              {(people?.users || []).map((u) => (
                <li key={u.id}>
                  <strong>
                    {u.name} · {u.email}
                  </strong>
                  <span>
                    {u.role}
                    {u.halls?.length ? ` · ${u.halls.join(', ')}` : ''}
                    {u.active === false ? ' · inactive' : ''}
                  </span>
                </li>
              ))}
              {!people?.users?.length && (
                <p className="vh-admin__empty">No seats yet — send the first invite.</p>
              )}
            </ul>
          </div>

          <div className="vh-admin__card">
            <h2>Pending invites</h2>
            <ul className="vh-admin__list">
              {(people?.invites || [])
                .filter((i) => !i.acceptedAt)
                .map((i) => (
                  <li key={i.id}>
                    <strong>{i.email}</strong>
                    <span>
                      {i.role} · expires {i.expiresAt?.slice(0, 10)}
                    </span>
                  </li>
                ))}
            </ul>
            <div className="vh-admin__row">
              <button type="button" className="vh-admin__secondary" onClick={exportEmpire}>
                Export empire JSON
              </button>
              <label className="vh-admin__secondary vh-admin__file">
                Import empire JSON
                <input
                  type="file"
                  accept="application/json"
                  hidden
                  onChange={(e) => importEmpireFile(e.target.files?.[0])}
                />
              </label>
            </div>
            <p className="vh-admin__note">
              Storage: <strong>{people?.storage || '…'}</strong>
              {people?.storage === 'supabase'
                ? ' — durable via Supabase.'
                : ' — memory fallback. Add SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (see docs/supabase-setup.md).'}
            </p>
          </div>
        </section>
      )}

      {adminTab === 'codes' && (
        <section className="vh-admin__people">
          <div className="vh-admin__card">
            <h2>Wave 2 Instagram codes</h2>
            <p className="vh-admin__note">
              After Njord + the 2:00 PM PDT break, visitors unlock Eagle → Corvus with these codes.
              Publish each on Instagram. Env fallback: <code>HALL_CODE_EAGLE</code>, etc.
            </p>
            {codesMsg && <p className="vh-admin__note">{codesMsg}</p>}
            <ul className="vh-admin__code-list">
              {codes.map((row) => (
                <li key={row.hallId} className="vh-admin__code-row">
                  <strong>{row.hallId}</strong>
                  <span className="vh-admin__note">
                    {row.configured ? `via ${row.source}` : 'not set'}
                  </span>
                  <input
                    value={codeDrafts[row.hallId]?.code || ''}
                    onChange={(e) =>
                      setCodeDrafts((p) => ({
                        ...p,
                        [row.hallId]: {
                          ...(p[row.hallId] || {}),
                          code: e.target.value.toUpperCase(),
                        },
                      }))
                    }
                    placeholder="CODE"
                    spellCheck={false}
                    autoComplete="off"
                  />
                  <input
                    value={codeDrafts[row.hallId]?.note || ''}
                    onChange={(e) =>
                      setCodeDrafts((p) => ({
                        ...p,
                        [row.hallId]: {
                          ...(p[row.hallId] || {}),
                          note: e.target.value,
                        },
                      }))
                    }
                    placeholder="Optional note"
                  />
                  <button type="button" onClick={() => saveCode(row.hallId)}>
                    Save
                  </button>
                </li>
              ))}
              {!codes.length && (
                <p className="vh-admin__empty">Loading codes…</p>
              )}
            </ul>
          </div>
        </section>
      )}

      {adminTab === 'socials' && (
        <section className="vh-admin__people">
          <div className="vh-admin__card">
            <h2>Social tower</h2>
            <p className="vh-admin__note">
              LinkedIn, Instagram, X, Discord per hall. Shown on team workspace and company pages
              when set.
            </p>
            {socialMsg && <p className="vh-admin__note">{socialMsg}</p>}
          </div>
          {socials.map((row) => (
            <form
              key={row.companyId}
              className="vh-admin__card"
              onSubmit={(e) => {
                e.preventDefault()
                saveSocial(row.companyId)
              }}
            >
              <h2>{row.companyId}</h2>
              <label>
                LinkedIn
                <input
                  value={row.linkedin || ''}
                  onChange={(e) => patchSocial(row.companyId, 'linkedin', e.target.value)}
                  placeholder="https://linkedin.com/…"
                />
              </label>
              <label>
                Instagram
                <input
                  value={row.instagram || ''}
                  onChange={(e) => patchSocial(row.companyId, 'instagram', e.target.value)}
                  placeholder="https://instagram.com/…"
                />
              </label>
              <label>
                X
                <input
                  value={row.x || ''}
                  onChange={(e) => patchSocial(row.companyId, 'x', e.target.value)}
                  placeholder="https://x.com/…"
                />
              </label>
              <label>
                Discord
                <input
                  value={row.discord || ''}
                  onChange={(e) => patchSocial(row.companyId, 'discord', e.target.value)}
                  placeholder="https://discord.gg/…"
                />
              </label>
              <label>
                Follower notes
                <input
                  value={row.followerNotes || ''}
                  onChange={(e) => patchSocial(row.companyId, 'followerNotes', e.target.value)}
                  placeholder="Counts, last check…"
                />
              </label>
              <label>
                Last checked
                <input
                  type="date"
                  value={row.lastChecked ? String(row.lastChecked).slice(0, 10) : ''}
                  onChange={(e) =>
                    patchSocial(
                      row.companyId,
                      'lastChecked',
                      e.target.value ? new Date(e.target.value).toISOString() : null,
                    )
                  }
                />
              </label>
              <button type="submit">Save {row.companyId}</button>
            </form>
          ))}
          {!socials.length && (
            <p className="vh-admin__empty">Loading socials…</p>
          )}
        </section>
      )}

      {adminTab === 'ledgers' && (
        <section className="vh-admin__grid">
          <div className="vh-admin__card">
            <h2>Email signups (server)</h2>
            <p className="vh-admin__count">{ledger?.signups?.length ?? 0}</p>
            <SignupList rows={ledger?.signups || []} />
          </div>
          <div className="vh-admin__card">
            <h2>Reservations (server)</h2>
            <p className="vh-admin__count">{ledger?.reservations?.length ?? 0}</p>
            <ReservationList rows={ledger?.reservations || []} />
          </div>
          <div className="vh-admin__card">
            <h2>This browser ledger</h2>
            <p className="vh-admin__count">
              {localPreview.reservations.length} reservations · {localPreview.signups.length} emails
            </p>
            <button type="button" className="vh-admin__secondary" onClick={uploadLocalLedger}>
              Upload browser reservations to server
            </button>
            <ReservationList rows={localPreview.reservations} />
          </div>
        </section>
      )}

      {adminTab === 'activity' && (
        <section className="vh-admin__card">
          <h2>Activity</h2>
          <ul className="vh-admin__list">
            {(people?.activity || []).map((a) => (
              <li key={a.id}>
                <strong>
                  {a.type} · {a.actor || '—'}
                </strong>
                <span>
                  {a.at}
                  {a.hall ? ` · ${a.hall}` : ''}
                  {a.title ? ` · ${a.title}` : ''}
                  {a.email ? ` · ${a.email}` : ''}
                </span>
              </li>
            ))}
            {!people?.activity?.length && (
              <p className="vh-admin__empty">Activity appears as the team works.</p>
            )}
          </ul>
        </section>
      )}
    </div>
  )
}

function SignupList({ rows }) {
  if (!rows.length) return <p className="vh-admin__empty">None yet.</p>
  return (
    <ul className="vh-admin__list">
      {rows.slice(0, 40).map((r, i) => (
        <li key={r.id || `${r.email}-${i}`}>
          <strong>{r.email}</strong>
          <span>
            {r.audience || r.source || '—'} · {r.receivedAt || r.submittedAt || ''}
          </span>
        </li>
      ))}
    </ul>
  )
}

function ReservationList({ rows }) {
  if (!rows.length) return <p className="vh-admin__empty">None yet.</p>
  return (
    <ul className="vh-admin__list">
      {rows.slice(0, 40).map((r, i) => (
        <li key={r.id || `${r.email}-${i}`}>
          <strong>
            {r.companyName || r.companyId} · {r.email}
          </strong>
          <span>
            {r.interestGroup || r.product || 'hold'}
            {r.amountEstimateUsd != null ? ` · ${formatUsd(r.amountEstimateUsd)}` : ''}
            {r.refundable ? ' · refundable' : ''}
          </span>
        </li>
      ))}
    </ul>
  )
}
