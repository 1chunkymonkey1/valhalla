import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AdminRevealControls from '../components/AdminRevealControls'
import CouncilDesk from '../components/CouncilDesk'
import AiSetupPanel from '../components/AiSetupPanel'
import { formatUsd } from '../data/payLinks'
import { HALL_IDS, TEAM_ROLES } from '../data/teamRoles'
import {
  clearBrowserSupabaseSession,
  getGoogleAccessToken,
  isSupabaseBrowserConfigured,
  startGoogleOAuth,
  takeOAuthIntent,
} from '../lib/supabaseBrowser'
import {
  markAdminSessionLoggedOut,
  markAdminSessionOk,
} from '../lib/adminSession'
import { exitDemoToLive, setDemoAuthorized } from '../lib/simulationClock'

const ADMIN_EMAIL = 'info@valhallaco.org'
const ADMIN_NEXT_ALLOW = new Set(['/capital'])

function takeAdminNext(searchParams) {
  const fromQuery = searchParams.get('next')
  let fromStore = ''
  try {
    fromStore = sessionStorage.getItem('vh_admin_next') || ''
  } catch {
    fromStore = ''
  }
  const next = ADMIN_NEXT_ALLOW.has(fromQuery)
    ? fromQuery
    : ADMIN_NEXT_ALLOW.has(fromStore)
      ? fromStore
      : ''
  try {
    sessionStorage.removeItem('vh_admin_next')
  } catch {
    /* ignore */
  }
  return next
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [auth, setAuth] = useState({ loading: true, ok: false, email: null })
  const [email, setEmail] = useState(ADMIN_EMAIL)
  const [password, setPassword] = useState('')
  const [totp, setTotp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [googleReady, setGoogleReady] = useState(false)
  const [googleBusy, setGoogleBusy] = useState(false)
  const [pendingGoogleToken, setPendingGoogleToken] = useState('')
  const [needGoogleTotp, setNeedGoogleTotp] = useState(false)
  const [authOptions, setAuthOptions] = useState(null)
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
  const [investorCodes, setInvestorCodes] = useState([])
  const [investorCodesMsg, setInvestorCodesMsg] = useState('')
  const [investorCodesStorage, setInvestorCodesStorage] = useState('')
  const [investorBusy, setInvestorBusy] = useState(false)
  const [socials, setSocials] = useState([])
  const [socialMsg, setSocialMsg] = useState('')
  const [inboxThreads, setInboxThreads] = useState([])
  const [inboxUnread, setInboxUnread] = useState(0)
  const [inboxNeedsHuman, setInboxNeedsHuman] = useState(0)
  const [inboxActive, setInboxActive] = useState(null)
  const [inboxMessages, setInboxMessages] = useState([])
  const [inboxReply, setInboxReply] = useState('')
  const [inboxMsg, setInboxMsg] = useState('')
  const [inboxFilter, setInboxFilter] = useState('')
  const [inboxNeedsOnly, setInboxNeedsOnly] = useState(false)
  const [inboxStorage, setInboxStorage] = useState('')
  const [inboxDurability, setInboxDurability] = useState('')

  async function enterAuthenticated(adminEmail) {
    setAuth({ loading: false, ok: true, email: adminEmail })
    setPendingGoogleToken('')
    setNeedGoogleTotp(false)
    markAdminSessionOk(adminEmail)
    setDemoAuthorized(true)
    const next = takeAdminNext(searchParams)
    if (next) {
      navigate(next, { replace: true })
      return
    }
    await Promise.all([
      loadLedger().catch(() => {}),
      loadPeople().catch(() => {}),
      loadCodes().catch(() => {}),
      loadInvestorCodes().catch(() => {}),
      loadSocials().catch(() => {}),
      loadInbox().catch(() => {}),
    ])
  }

  async function exchangeGoogleToken(accessToken, totpCode = '') {
    const res = await fetch('/api/admin/login-google', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken, totp: totpCode }),
    })
    const data = await res.json().catch(() => ({}))
    if (data.needTotp) {
      setPendingGoogleToken(accessToken)
      setNeedGoogleTotp(true)
      setError(data.error || 'Enter your authenticator code to finish Google sign-in.')
      return false
    }
    if (!res.ok) {
      setError(data.error || 'Google sign-in failed')
      return false
    }
    await clearBrowserSupabaseSession()
    await enterAuthenticated(data.email)
    return true
  }

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
        await enterAuthenticated(data.email)
      } else {
        markAdminSessionLoggedOut()
        setDemoAuthorized(false)
        setAuth({ loading: false, ok: false, email: null })
      }
    } catch {
      markAdminSessionLoggedOut()
      setDemoAuthorized(false)
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

  async function loadInvestorCodes() {
    const res = await fetch('/api/admin/investor-codes', { credentials: 'include' })
    if (!res.ok) return
    const data = await res.json()
    setInvestorCodes(data.codes || [])
    setInvestorCodesStorage(data.storage || '')
  }

  async function loadSocials() {
    const res = await fetch('/api/admin/socials', { credentials: 'include' })
    if (!res.ok) return
    const data = await res.json()
    setSocials(data.socials || [])
  }

  async function loadInbox(pageId = inboxFilter) {
    const params = new URLSearchParams()
    if (pageId) params.set('pageId', pageId)
    if (inboxNeedsOnly) params.set('needsHuman', '1')
    const q = params.toString() ? `?${params}` : ''
    const res = await fetch(`/api/admin/inbox${q}`, { credentials: 'include' })
    if (!res.ok) return
    const data = await res.json()
    setInboxThreads(data.threads || [])
    setInboxUnread(data.unreadTotal || 0)
    setInboxNeedsHuman(data.needsHumanTotal || 0)
    setInboxStorage(data.storage || '')
    setInboxDurability(data.durabilityNote || '')
  }

  async function openInboxThread(threadId) {
    setInboxMsg('')
    const res = await fetch(`/api/admin/inbox?id=${encodeURIComponent(threadId)}`, {
      credentials: 'include',
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setInboxMsg(data.error || 'Could not open thread')
      return
    }
    setInboxActive(data.thread || null)
    setInboxMessages(data.messages || [])
    await fetch('/api/admin/inbox', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, action: 'read' }),
    })
    await loadInbox()
  }

  async function sendInboxReply(e) {
    e.preventDefault()
    if (!inboxActive?.id || !inboxReply.trim()) return
    setInboxMsg('')
    const res = await fetch('/api/admin/inbox', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId: inboxActive.id, action: 'reply', body: inboxReply }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setInboxMsg(data.error || 'Reply failed')
      return
    }
    setInboxReply('')
    setInboxActive(data.thread || inboxActive)
    setInboxMessages(data.messages || [])
    await loadInbox()
  }

  async function setInboxFlag(needsHuman) {
    if (!inboxActive?.id) return
    const res = await fetch('/api/admin/inbox', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        threadId: inboxActive.id,
        action: needsHuman ? 'flag' : 'unflag',
        reason: needsHuman ? 'Founder flagged' : '',
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.ok) {
      setInboxMsg(data.error || 'Flag update failed')
      return
    }
    setInboxActive(data.thread || inboxActive)
    await loadInbox()
  }

  async function setInboxStatus(status) {
    if (!inboxActive?.id) return
    const res = await fetch('/api/admin/inbox', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId: inboxActive.id, action: status }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setInboxMsg(data.error || 'Update failed')
      return
    }
    setInboxActive(data.thread || inboxActive)
    await loadInbox()
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/admin/auth-options')
        const data = await res.json().catch(() => ({}))
        if (!cancelled) {
          setAuthOptions(data)
          setGoogleReady(Boolean(data.google && isSupabaseBrowserConfigured()))
        }
      } catch {
        if (!cancelled) setGoogleReady(isSupabaseBrowserConfigured())
      }

      const intent = takeOAuthIntent()
      if (intent?.kind === 'admin' && isSupabaseBrowserConfigured()) {
        setGoogleBusy(true)
        try {
          const accessToken = await getGoogleAccessToken()
          if (accessToken) {
            const ok = await exchangeGoogleToken(accessToken)
            if (ok || cancelled) return
          }
        } catch (err) {
          if (!cancelled) setError(err.message || 'Google sign-in failed')
        } finally {
          if (!cancelled) setGoogleBusy(false)
        }
      }

      if (!cancelled) await refreshSession()
    })()

    try {
      setLocalPreview({
        reservations: JSON.parse(localStorage.getItem('valhalla_reservation_ledger') || '[]'),
        signups: JSON.parse(localStorage.getItem('valhalla_email_signups') || '[]'),
      })
    } catch {
      // ignore
    }

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!auth.ok || adminTab !== 'inbox') return
    loadInbox()
    const id = setInterval(() => loadInbox(), 8000)
    return () => clearInterval(id)
  }, [auth.ok, adminTab, inboxFilter, inboxNeedsOnly])

  async function pastePassword() {
    setError('')
    try {
      const text = await navigator.clipboard.readText()
      if (!text) {
        setError('Clipboard is empty, copy the password first, then Paste.')
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
    if (needGoogleTotp && pendingGoogleToken) {
      setGoogleBusy(true)
      try {
        await exchangeGoogleToken(pendingGoogleToken, totp)
      } finally {
        setGoogleBusy(false)
      }
      return
    }
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
    await enterAuthenticated(data.email)
  }

  async function continueWithGoogle() {
    setError('')
    const next = searchParams.get('next')
    if (ADMIN_NEXT_ALLOW.has(next)) {
      try {
        sessionStorage.setItem('vh_admin_next', next)
      } catch {
        /* ignore */
      }
    }
    setGoogleBusy(true)
    try {
      await startGoogleOAuth(`${window.location.origin}/admin`, { kind: 'admin' })
    } catch (err) {
      setError(err.message || 'Could not start Google sign-in')
      setGoogleBusy(false)
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    exitDemoToLive()
    markAdminSessionLoggedOut()
    setDemoAuthorized(false)
    setAuth({ loading: false, ok: false, email: null })
    setLedger(null)
    setCodes([])
    setInvestorCodes([])
    setSocials([])
    setInboxThreads([])
    setInboxActive(null)
    setInboxMessages([])
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

  async function generateInvestorCode(tier) {
    setInvestorCodesMsg('')
    setInvestorBusy(true)
    try {
      const res = await fetch('/api/admin/investor-codes', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', tier }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setInvestorCodesMsg(data.error || 'Generate failed')
        return
      }
      setInvestorCodesMsg(`Issued ${data.code?.code} (${data.code?.tier?.toUpperCase()}#${data.code?.sequence})`)
      await loadInvestorCodes()
    } finally {
      setInvestorBusy(false)
    }
  }

  async function setInvestorActive(id, active) {
    setInvestorCodesMsg('')
    setInvestorBusy(true)
    try {
      const res = await fetch('/api/admin/investor-codes', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set-active', id, active }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setInvestorCodesMsg(data.error || 'Update failed')
        return
      }
      setInvestorCodesMsg(active ? `Re-enabled ${data.code?.code}` : `Revoked ${data.code?.code}`)
      await loadInvestorCodes()
    } finally {
      setInvestorBusy(false)
    }
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

  if (auth.loading || googleBusy) {
    return (
      <div className="vh-page vh-admin">
        <p className="vh-admin__loading">
          {googleBusy ? 'Finishing Google sign-in…' : 'Checking session…'}
        </p>
      </div>
    )
  }

  if (!auth.ok) {
    return (
      <div className="vh-page vh-admin">
        <form className="vh-admin__gate" onSubmit={login} autoComplete="on">
          <p className="vh-admin__mark">Valhalla</p>
          <h1>{searchParams.get('next') === '/capital' ? 'Capital' : 'Admin'}</h1>
          <p className="vh-admin__hint">
            Restricted to {ADMIN_EMAIL}
            {authOptions?.googleRequiresTotp
              ? ' · Google SSO + authenticator, or password + authenticator'
              : ' · Continue with Google, or password + authenticator'}
            {searchParams.get('next') === '/capital' ? ' · then the capital desk' : ''}
          </p>
          {googleReady && !needGoogleTotp && (
            <>
              <button
                type="button"
                className="vh-admin__google"
                onClick={continueWithGoogle}
                disabled={googleBusy}
              >
                Continue with Google
              </button>
              <p className="vh-admin__divider" aria-hidden="true">
                or password
              </p>
            </>
          )}
          {needGoogleTotp ? (
            <p className="vh-admin__hint">
              Google verified. Enter your authenticator code to finish.
            </p>
          ) : (
            <>
              <label>
                Email
                <input
                  type="email"
                  name="username"
                  required={!needGoogleTotp}
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
                  required={!needGoogleTotp}
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
            </>
          )}
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
          <button type="submit">{needGoogleTotp ? 'Finish Google sign-in' : 'Enter'}</button>
          <p className="vh-admin__fine">
            Google SSO uses Supabase Auth (no app password stored). Password path still needs{' '}
            <code>ADMIN_PASSWORD</code>, <code>ADMIN_SESSION_SECRET</code>, and{' '}
            <code>ADMIN_TOTP_SECRET</code>. See <code>docs/supabase-setup.md</code>.
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
          ['council', 'Council'],
          ['dispatch', 'Capital'],
          ['reveal', 'Reveal'],
          ['inbox', inboxUnread ? `Inbox (${inboxUnread})` : 'Inbox'],
          ['people', 'People'],
          ['codes', 'Hall codes'],
          ['investor-codes', 'Investor codes'],
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
            <h2>Site inbox</h2>
            <p className="vh-admin__count">{inboxUnread}</p>
            <p className="vh-admin__note">
              Unread hall chats from Ask widgets
              {inboxNeedsHuman ? ` · ${inboxNeedsHuman} need human` : ''}. Open the Inbox tab to
              review AI answers and reply.
            </p>
          </div>
          <div className="vh-admin__card">
            <h2>Council</h2>
            <p className="vh-admin__note">
              Talk with the 18 Raven agents, @mention peers, run bounded autonomous rounds. Primary AI
              workspace — open the Council tab.
            </p>
          </div>
          <AiSetupPanel />
          <div className="vh-admin__card">
            <h2>Capital desk</h2>
            <p className="vh-admin__note">
              Demeter raise and person-grants. Approve, then Send. Nothing leaves without both clicks.{' '}
              <Link to="/capital">Open /capital</Link>
            </p>
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

      {adminTab === 'council' && <CouncilDesk />}

      {adminTab === 'dispatch' && (
        <section className="vh-admin__card">
          <h2>Capital desk</h2>
          <p className="vh-admin__note">
            Outreach is its own app now. Same queue, same Approve then Send. It does not transmit.
          </p>
          <p>
            <Link to="/capital">Open /capital</Link>
          </p>
        </section>
      )}

      {adminTab === 'reveal' && <AdminRevealControls />}

      {adminTab === 'inbox' && (
        <section className="vh-admin__inbox">
          <div className="vh-admin__card">
            <h2>Hall inbox</h2>
            <p className="vh-admin__note">
              Visitors get an immediate AI reply; you see the full transcript and can continue as a
              person. Storage: <strong>{inboxStorage || '…'}</strong>
              {inboxStorage === 'memory'
                ? ' — memory is same-instance only; set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY and run chat migrations for durable multi-instance threads.'
                : ''}
              {inboxDurability && inboxStorage === 'memory' ? '' : ''}
              {inboxNeedsHuman ? ` · ${inboxNeedsHuman} need human` : ''}
            </p>
            <div className="vh-admin__row">
              <label>
                Filter hall
                <select
                  value={inboxFilter}
                  onChange={(e) => {
                    setInboxFilter(e.target.value)
                    setInboxActive(null)
                    setInboxMessages([])
                  }}
                >
                  <option value="">All pages</option>
                  <option value="hub">hub</option>
                  {HALL_IDS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </label>
              <label className="vh-admin__check">
                <input
                  type="checkbox"
                  checked={inboxNeedsOnly}
                  onChange={(e) => {
                    setInboxNeedsOnly(e.target.checked)
                    setInboxActive(null)
                    setInboxMessages([])
                  }}
                />
                Needs human only
              </label>
            </div>
            {inboxMsg && <p className="vh-admin__note">{inboxMsg}</p>}
          </div>
          <div className="vh-admin__inbox-split">
            <ul className="vh-admin__inbox-list">
              {inboxThreads.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    className={`vh-admin__inbox-item ${inboxActive?.id === t.id ? 'is-active' : ''} ${t.unreadAdmin ? 'is-unread' : ''} ${t.needsHuman ? 'needs-human' : ''}`}
                    onClick={() => openInboxThread(t.id)}
                  >
                    <strong>
                      {t.needsHuman ? '⚑ ' : ''}
                      {t.pageId}
                      {t.unreadAdmin ? ` · ${t.unreadAdmin} new` : ''}
                      {t.isTest ? ' · test' : ''}
                    </strong>
                    <span>
                      {t.visitorName || t.visitorEmail || 'Visitor'} · {t.status}
                      {t.lastAiModel ? ` · AI ${t.lastAiStatus || 'ok'}` : ''}
                    </span>
                    <span className="vh-admin__inbox-preview">{t.preview || '-'}</span>
                  </button>
                </li>
              ))}
              {!inboxThreads.length && (
                <p className="vh-admin__empty">No messages yet, Ask widgets write here.</p>
              )}
            </ul>
            <div className="vh-admin__inbox-thread">
              {!inboxActive && (
                <p className="vh-admin__empty">Select a thread to reply.</p>
              )}
              {inboxActive && (
                <>
                  <header className="vh-admin__inbox-head">
                    <div>
                      <h2>
                        {inboxActive.needsHuman ? '⚑ ' : ''}
                        {inboxActive.pageId}
                        {inboxActive.visitorName ? ` · ${inboxActive.visitorName}` : ''}
                      </h2>
                      <p className="vh-admin__note">
                        {inboxActive.visitorEmail || 'No email'} · {inboxActive.status}
                        {inboxActive.lastAiModel
                          ? ` · model ${inboxActive.lastAiModel} (${inboxActive.lastAiStatus || '…'})`
                          : ''}
                        {inboxActive.needsHumanReason
                          ? ` · ${inboxActive.needsHumanReason}`
                          : ''}
                      </p>
                    </div>
                    <div className="vh-admin__row">
                      {inboxActive.needsHuman ? (
                        <button
                          type="button"
                          className="vh-admin__secondary"
                          onClick={() => setInboxFlag(false)}
                        >
                          Clear flag
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="vh-admin__secondary"
                          onClick={() => setInboxFlag(true)}
                        >
                          Flag human
                        </button>
                      )}
                      {inboxActive.status === 'open' ? (
                        <button
                          type="button"
                          className="vh-admin__secondary"
                          onClick={() => setInboxStatus('close')}
                        >
                          Close
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="vh-admin__secondary"
                          onClick={() => setInboxStatus('open')}
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </header>
                  <div className="vh-admin__inbox-msgs">
                    {inboxMessages.map((m) => (
                      <div
                        key={m.id}
                        className={`vh-admin__bubble vh-admin__bubble--${m.sender}`}
                      >
                        <span>
                          {m.sender === 'visitor'
                            ? 'Visitor'
                            : m.sender === 'admin'
                              ? 'You'
                              : m.sender === 'ai'
                                ? `AI${m.model ? ` · ${m.model}` : ''}${m.meta?.status ? ` · ${m.meta.status}` : ''}`
                                : 'System'}
                        </span>
                        <p>{m.body}</p>
                      </div>
                    ))}
                  </div>
                  <form className="vh-admin__inbox-compose" onSubmit={sendInboxReply}>
                    <textarea
                      rows={3}
                      value={inboxReply}
                      onChange={(e) => setInboxReply(e.target.value)}
                      placeholder="Founder reply continues the thread…"
                      required
                    />
                    <button type="submit" disabled={!inboxReply.trim()}>
                      Send reply
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {adminTab === 'people' && (
        <section className="vh-admin__people">
          <form className="vh-admin__card" onSubmit={sendInvite}>
            <h2>Invite teammate</h2>
            <p className="vh-admin__note">
              They get a Google SSO seat (recommended) or email+password. Roles: hall lead, empire ops, growth, finance,
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
                <p className="vh-admin__empty">No seats yet, send the first invite.</p>
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
                ? ', durable via Supabase.'
                : ', memory fallback. Add SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (see docs/supabase-setup.md).'}
            </p>
          </div>
        </section>
      )}

      {adminTab === 'codes' && (
        <section className="vh-admin__people">
          <div className="vh-admin__card">
            <h2>Wave 2 hall codes</h2>
            <p className="vh-admin__note">
              Optional archive. Public wave 2 unlocks by schedule after the 2:00 PM PDT break
              (no visitor code entry). Env fallback: <code>HALL_CODE_EAGLE</code>, etc.
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

      {adminTab === 'investor-codes' && (
        <section className="vh-admin__people">
          <div className="vh-admin__card">
            <h2>Investor codes</h2>
            <p className="vh-admin__note">
              P = small investors · E = elephant. Generation rules are internal (
              <code>docs/investor-codes.md</code>) — never put the algorithm on{' '}
              <Link to="/investors">/investors</Link>. Storage:{' '}
              {investorCodesStorage || '…'}
              {investorCodesStorage === 'memory'
                ? ' (add Supabase + run 20260814_investor_codes.sql for durable codes)'
                : ''}
            </p>
            <div className="vh-admin__invite-actions">
              <button type="button" disabled={investorBusy} onClick={() => generateInvestorCode('p')}>
                Generate next P
              </button>
              <button type="button" disabled={investorBusy} onClick={() => generateInvestorCode('e')}>
                Generate next E
              </button>
            </div>
            {investorCodesMsg && <p className="vh-admin__note">{investorCodesMsg}</p>}
            <ul className="vh-admin__code-list">
              {investorCodes.map((row) => (
                <li key={row.id} className="vh-admin__code-row">
                  <strong>{row.code}</strong>
                  <span className="vh-admin__note">
                    {String(row.tier).toUpperCase()}#{row.sequence}
                    {row.active ? '' : ' · revoked'}
                    {row.redeemedAt ? ' · redeemed' : ''}
                  </span>
                  <span className="vh-admin__note">{row.createdBy || '—'}</span>
                  <button
                    type="button"
                    disabled={investorBusy}
                    onClick={() => setInvestorActive(row.id, !row.active)}
                  >
                    {row.active ? 'Revoke' : 'Re-enable'}
                  </button>
                </li>
              ))}
              {!investorCodes.length && (
                <p className="vh-admin__empty">No investor codes issued yet.</p>
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
              LinkedIn, Instagram, X, Discord per hall (including hub). Public pages show LinkedIn /
              Instagram / X / Discord as icons (only when a URL is set). Wolf →{' '}
              <code>wolf_transit</code>, Holm → <code>holm_development</code>. Hub / empire Instagram
              is <code>valhalla__42</code>. Leave LinkedIn empty until real pages exist; other halls
              may still show suggested placeholder handles.
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
                  {a.type} · {a.actor || '-'}
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
            {r.audience || r.source || '-'} · {r.receivedAt || r.submittedAt || ''}
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
