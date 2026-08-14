import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT_EMAIL } from '../data/pressRelease'
import {
  BUSINESS_MODEL,
  COMPANY_DECKS,
  ELEVATOR_PITCH,
  FUNDRAISING_APPLICATION,
  FUNDRAISING_COMPANY_ZIP,
  FUNDRAISING_DECK_HTML,
  FUNDRAISING_LEADS,
  FUNDRAISING_PITCH_PDF,
} from '../data/fundraising/materials'

export default function InvestorsPage() {
  const [status, setStatus] = useState({ loading: true, unlocked: false, tier: null })
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    document.title = 'Investors · Valhalla'
    let cancelled = false
    fetch('/api/hub/investor-code', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        setStatus({
          loading: false,
          unlocked: Boolean(data.unlocked),
          tier: data.tier || null,
        })
      })
      .catch(() => {
        if (!cancelled) setStatus({ loading: false, unlocked: false, tier: null })
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function submitCode(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const res = await fetch('/api/hub/investor-code', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!data.ok) {
        setError(data.error || 'Invalid code')
        return
      }
      setStatus({ loading: false, unlocked: true, tier: data.tier || null })
      setCode('')
    } catch {
      setError('Could not reach the server')
    } finally {
      setBusy(false)
    }
  }

  async function lockSession() {
    setBusy(true)
    try {
      await fetch('/api/hub/investor-code', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'lock' }),
      })
    } catch {
      /* ignore */
    }
    setStatus({ loading: false, unlocked: false, tier: null })
    setBusy(false)
  }

  if (status.loading) {
    return (
      <div className="vh-page vh-inv">
        <p className="vh-inv__muted">Loading…</p>
      </div>
    )
  }

  if (!status.unlocked) {
    return (
      <div className="vh-page vh-inv vh-inv--gate">
        <header className="vh-inv__gate-head">
          <p className="vh-inv__mark">Valhalla</p>
          <h1>Investors</h1>
          <p className="vh-inv__lede">Enter your access code to open fundraising materials.</p>
        </header>
        <form className="vh-inv__gate-box" onSubmit={submitCode}>
          <label htmlFor="investor-code">Access code</label>
          <input
            id="investor-code"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            autoCapitalize="off"
            placeholder="Enter code"
            disabled={busy}
          />
          <button type="submit" disabled={busy || !code.trim()}>
            {busy ? 'Checking…' : 'Unlock'}
          </button>
          {error && <p className="vh-inv__error">{error}</p>}
        </form>
        <p className="vh-inv__foot">
          Inquiries:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </div>
    )
  }

  const isElephant = status.tier === 'e'

  return (
    <div className="vh-page vh-inv vh-inv--open">
      <header className="vh-inv__open-head">
        <div>
          <p className="vh-inv__mark">Valhalla</p>
          <h1>Fundraising</h1>
          <p className="vh-inv__lede">
            {isElephant
              ? 'Large-allocation briefing — same materials, framed for institutional scale. Diligence first; no public securities offering here.'
              : 'Investor materials for diligence. Same package for all issued codes; inquiries only beyond what’s published.'}
          </p>
        </div>
        <button type="button" className="vh-inv__lock" onClick={lockSession} disabled={busy}>
          Lock
        </button>
      </header>

      <section className="vh-inv__section">
        <h2>Main deck</h2>
        <p className="vh-inv__muted">Primary Valhalla pitch (PDF). Blueprint-honest: MRR $0.</p>
        <div className="vh-inv__actions">
          <a href={FUNDRAISING_PITCH_PDF} target="_blank" rel="noreferrer">
            Open PDF
          </a>
          <a href={FUNDRAISING_PITCH_PDF} download>
            Download
          </a>
          <a href={FUNDRAISING_DECK_HTML} target="_blank" rel="noreferrer">
            HTML source
          </a>
        </div>
        <div className="vh-inv__embed">
          <iframe title="Valhalla pitch deck" src={FUNDRAISING_PITCH_PDF} />
        </div>
      </section>

      <section className="vh-inv__section">
        <h2>Elevator pitch</h2>
        <p className="vh-inv__quote">{ELEVATOR_PITCH}</p>
      </section>

      <section className="vh-inv__section">
        <h2>Business model</h2>
        <p>{BUSINESS_MODEL}</p>
        <p className="vh-inv__muted">
          Full application copy pack:{' '}
          <a href={FUNDRAISING_APPLICATION} target="_blank" rel="noreferrer">
            APPLICATION.md
          </a>
        </p>
      </section>

      <section className="vh-inv__section">
        <h2>Twelve company decks</h2>
        <p className="vh-inv__muted">
          Each of the 12 halls has a dedicated deck. Each company also has a Hall Lead seat (roster
          in leads.md — names filled as confirmed).
        </p>
        <div className="vh-inv__actions">
          <a href={FUNDRAISING_COMPANY_ZIP} download>
            Download all PDFs (zip)
          </a>
          <a href={FUNDRAISING_LEADS} target="_blank" rel="noreferrer">
            Leads roster
          </a>
        </div>
        <ul className="vh-inv__deck-list">
          {COMPANY_DECKS.map((c) => (
            <li key={c.id}>
              <strong>{c.name}</strong>
              <span>
                {c.domain} · {c.pillar}
              </span>
              <a href={c.pdf} target="_blank" rel="noreferrer">
                PDF
              </a>
              <a href={c.html} target="_blank" rel="noreferrer">
                HTML
              </a>
              <Link to={`/${c.id}`}>Site</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="vh-inv__section vh-inv__section--note">
        <h2>Structure note</h2>
        <p>
          Valhalla is a civilization platform: one holdco thesis, twelve specialized companies across
          Land, Water, Air, and Space. Legal entity in formation. No fabricated revenue. Contact{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </div>
  )
}
