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

const FALLBACK_MATERIALS = {
  elevatorPitch: ELEVATOR_PITCH,
  businessModel: BUSINESS_MODEL,
  structureNote:
    'Valhalla is a civilization platform: one holdco thesis, twelve specialized companies across Land, Water, Air, and Space. Legal entity in formation. No fabricated revenue. Contact info@valhallaco.org.',
  leadsMarkdown: '',
  companyBlurbs: Object.fromEntries(COMPANY_DECKS.map((c) => [c.id, ''])),
  links: {
    pitchPdf: FUNDRAISING_PITCH_PDF,
    deckHtml: FUNDRAISING_DECK_HTML,
    application: FUNDRAISING_APPLICATION,
    leads: FUNDRAISING_LEADS,
    companyZip: FUNDRAISING_COMPANY_ZIP,
  },
  companyDeckOverrides: {},
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}

function MaterialsReadView({ materials, companies, tier, onLock, busy }) {
  const isElephant = tier === 'e'
  const links = materials?.links || FALLBACK_MATERIALS.links
  const list = companies?.length ? companies : COMPANY_DECKS

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
        <button type="button" className="vh-inv__lock" onClick={onLock} disabled={busy}>
          Lock
        </button>
      </header>

      <section className="vh-inv__section">
        <h2>Main deck</h2>
        <p className="vh-inv__muted">Primary Valhalla pitch (PDF). Blueprint-honest: MRR $0.</p>
        <div className="vh-inv__actions">
          <a href={links.pitchPdf} target="_blank" rel="noreferrer">
            Open PDF
          </a>
          <a href={links.pitchPdf} download>
            Download
          </a>
          <a href={links.deckHtml} target="_blank" rel="noreferrer">
            HTML source
          </a>
        </div>
        <div className="vh-inv__embed">
          <iframe title="Valhalla pitch deck" src={links.pitchPdf} />
        </div>
      </section>

      <section className="vh-inv__section">
        <h2>Elevator pitch</h2>
        <p className="vh-inv__quote">{materials?.elevatorPitch || ELEVATOR_PITCH}</p>
      </section>

      <section className="vh-inv__section">
        <h2>Business model</h2>
        <p>{materials?.businessModel || BUSINESS_MODEL}</p>
        <p className="vh-inv__muted">
          Full application copy pack:{' '}
          <a href={links.application} target="_blank" rel="noreferrer">
            APPLICATION.md
          </a>
        </p>
      </section>

      <section className="vh-inv__section">
        <h2>Twelve company decks</h2>
        <p className="vh-inv__muted">
          Each of the 12 halls has a dedicated deck. Each company also has a Hall Lead seat (roster
          in leads — names filled as confirmed).
        </p>
        <div className="vh-inv__actions">
          <a href={links.companyZip} download>
            Download all PDFs (zip)
          </a>
          <a href={links.leads} target="_blank" rel="noreferrer">
            Leads roster
          </a>
        </div>
        <ul className="vh-inv__deck-list">
          {list.map((c) => (
            <li key={c.id}>
              <strong>{c.name}</strong>
              <span>
                {c.domain} · {c.pillar}
                {c.blurb ? ` — ${c.blurb}` : ''}
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

      {materials?.leadsMarkdown ? (
        <section className="vh-inv__section">
          <h2>Leads</h2>
          <pre className="vh-inv__pre">{materials.leadsMarkdown}</pre>
        </section>
      ) : null}

      <section className="vh-inv__section vh-inv__section--note">
        <h2>Structure note</h2>
        <p>
          {materials?.structureNote || (
            <>
              Valhalla is a civilization platform: one holdco thesis, twelve specialized companies
              across Land, Water, Air, and Space. Legal entity in formation. No fabricated revenue.
              Contact <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </>
          )}
        </p>
      </section>
    </div>
  )
}

function MaterialsEditor({ draft, setDraft, companies, onSave, onUpload, onLock, busy, msg, storage }) {
  function setField(key, value) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  function setLink(key, value) {
    setDraft((d) => ({ ...d, links: { ...d.links, [key]: value } }))
  }

  function setBlurb(id, value) {
    setDraft((d) => ({
      ...d,
      companyBlurbs: { ...d.companyBlurbs, [id]: value },
    }))
  }

  function setDeckOverride(id, field, value) {
    setDraft((d) => {
      const prev = d.companyDeckOverrides?.[id] || {}
      const next = { ...prev, [field]: value }
      if (!next.pdf && !next.html) {
        const rest = { ...(d.companyDeckOverrides || {}) }
        delete rest[id]
        return { ...d, companyDeckOverrides: rest }
      }
      return {
        ...d,
        companyDeckOverrides: { ...(d.companyDeckOverrides || {}), [id]: next },
      }
    })
  }

  async function handleFile(slot, file, applyUrl) {
    if (!file) return
    await onUpload(slot, file, applyUrl)
  }

  return (
    <div className="vh-page vh-inv vh-inv--open vh-inv--editor">
      <header className="vh-inv__open-head">
        <div>
          <p className="vh-inv__mark">Valhalla · Editor</p>
          <h1>Investor materials</h1>
          <p className="vh-inv__lede">
            Edit the fundraising pack shown to unlocked investors. Saves to{' '}
            {storage === 'supabase' ? 'Supabase' : 'server memory (run migration for durability)'}.
          </p>
        </div>
        <div className="vh-inv__head-actions">
          <button type="button" className="vh-inv__save" onClick={onSave} disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </button>
          <button type="button" className="vh-inv__lock" onClick={onLock} disabled={busy}>
            Lock
          </button>
        </div>
      </header>

      {msg ? <p className={msg.ok ? 'vh-inv__ok' : 'vh-inv__error'}>{msg.text}</p> : null}

      <section className="vh-inv__section">
        <h2>Elevator pitch</h2>
        <textarea
          className="vh-inv__textarea"
          rows={4}
          value={draft.elevatorPitch}
          onChange={(e) => setField('elevatorPitch', e.target.value)}
          disabled={busy}
        />
      </section>

      <section className="vh-inv__section">
        <h2>Business model</h2>
        <textarea
          className="vh-inv__textarea"
          rows={6}
          value={draft.businessModel}
          onChange={(e) => setField('businessModel', e.target.value)}
          disabled={busy}
        />
      </section>

      <section className="vh-inv__section">
        <h2>Structure note</h2>
        <textarea
          className="vh-inv__textarea"
          rows={4}
          value={draft.structureNote}
          onChange={(e) => setField('structureNote', e.target.value)}
          disabled={busy}
        />
      </section>

      <section className="vh-inv__section">
        <h2>Leads roster (markdown)</h2>
        <textarea
          className="vh-inv__textarea vh-inv__textarea--mono"
          rows={14}
          value={draft.leadsMarkdown}
          onChange={(e) => setField('leadsMarkdown', e.target.value)}
          disabled={busy}
        />
      </section>

      <section className="vh-inv__section">
        <h2>Deck & pack links</h2>
        <p className="vh-inv__muted">
          Point at files under <code>/investors/</code>, or upload a replacement PDF / markdown.
        </p>
        <div className="vh-inv__form-grid">
          {[
            ['pitchPdf', 'Main pitch PDF'],
            ['deckHtml', 'Deck HTML'],
            ['application', 'APPLICATION.md'],
            ['leads', 'Leads URL (static fallback)'],
            ['companyZip', 'Company decks zip'],
          ].map(([key, label]) => (
            <label key={key} className="vh-inv__field">
              <span>{label}</span>
              <input
                value={draft.links?.[key] || ''}
                onChange={(e) => setLink(key, e.target.value)}
                disabled={busy}
              />
              {(key === 'pitchPdf' || key === 'application') && (
                <input
                  type="file"
                  accept={
                    key === 'pitchPdf'
                      ? '.pdf,application/pdf'
                      : '.md,text/markdown,text/plain'
                  }
                  disabled={busy}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    e.target.value = ''
                    handleFile(key, file, (url) => setLink(key, url))
                  }}
                />
              )}
            </label>
          ))}
        </div>
      </section>

      <section className="vh-inv__section">
        <h2>Company blurbs & deck overrides</h2>
        <ul className="vh-inv__edit-list">
          {(companies?.length ? companies : COMPANY_DECKS).map((c) => (
            <li key={c.id}>
              <strong>
                {c.name}{' '}
                <span>
                  {c.domain} · {c.pillar}
                </span>
              </strong>
              <textarea
                className="vh-inv__textarea"
                rows={2}
                placeholder="Short blurb for unlocked investor view"
                value={draft.companyBlurbs?.[c.id] || ''}
                onChange={(e) => setBlurb(c.id, e.target.value)}
                disabled={busy}
              />
              <div className="vh-inv__form-grid vh-inv__form-grid--tight">
                <label className="vh-inv__field">
                  <span>PDF URL</span>
                  <input
                    value={draft.companyDeckOverrides?.[c.id]?.pdf || ''}
                    placeholder={`/investors/company-decks/${c.id}.pdf`}
                    onChange={(e) => setDeckOverride(c.id, 'pdf', e.target.value)}
                    disabled={busy}
                  />
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    disabled={busy}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      e.target.value = ''
                      handleFile(`${c.id}-pdf`, file, (url) => setDeckOverride(c.id, 'pdf', url))
                    }}
                  />
                </label>
                <label className="vh-inv__field">
                  <span>HTML URL</span>
                  <input
                    value={draft.companyDeckOverrides?.[c.id]?.html || ''}
                    placeholder={`/investors/company-decks/${c.id}.html`}
                    onChange={(e) => setDeckOverride(c.id, 'html', e.target.value)}
                    disabled={busy}
                  />
                </label>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default function InvestorsPage() {
  const [status, setStatus] = useState({
    loading: true,
    unlocked: false,
    tier: null,
    canEdit: false,
  })
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [materials, setMaterials] = useState(FALLBACK_MATERIALS)
  const [draft, setDraft] = useState(FALLBACK_MATERIALS)
  const [companies, setCompanies] = useState(COMPANY_DECKS)
  const [storage, setStorage] = useState('')
  const [msg, setMsg] = useState(null)
  const [materialsReady, setMaterialsReady] = useState(false)

  async function loadMaterials() {
    const res = await fetch('/api/hub/investor-materials', { credentials: 'include' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.ok) {
      setMaterials(FALLBACK_MATERIALS)
      setDraft(FALLBACK_MATERIALS)
      setCompanies(COMPANY_DECKS)
      setMaterialsReady(true)
      return
    }
    const next = { ...FALLBACK_MATERIALS, ...(data.materials || {}) }
    next.links = { ...FALLBACK_MATERIALS.links, ...(data.materials?.links || {}) }
    next.companyBlurbs = {
      ...FALLBACK_MATERIALS.companyBlurbs,
      ...(data.materials?.companyBlurbs || {}),
    }
    next.companyDeckOverrides = data.materials?.companyDeckOverrides || {}
    setMaterials(next)
    setDraft(next)
    setCompanies(data.companies?.length ? data.companies : COMPANY_DECKS)
    setStorage(data.storage || '')
    setMaterialsReady(true)
  }

  useEffect(() => {
    document.title = 'Investors · Valhalla'
    let cancelled = false
    fetch('/api/hub/investor-code', { credentials: 'include' })
      .then((r) => r.json())
      .then(async (data) => {
        if (cancelled) return
        const unlocked = Boolean(data.unlocked)
        setStatus({
          loading: false,
          unlocked,
          tier: data.tier || null,
          canEdit: Boolean(data.canEdit),
        })
        if (unlocked) await loadMaterials()
        else setMaterialsReady(true)
      })
      .catch(() => {
        if (!cancelled) {
          setStatus({ loading: false, unlocked: false, tier: null, canEdit: false })
          setMaterialsReady(true)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function submitCode(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    setMsg(null)
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
      setStatus({
        loading: false,
        unlocked: true,
        tier: data.tier || null,
        canEdit: Boolean(data.canEdit),
      })
      setCode('')
      setMaterialsReady(false)
      await loadMaterials()
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
    setStatus({ loading: false, unlocked: false, tier: null, canEdit: false })
    setMsg(null)
    setBusy(false)
  }

  async function saveMaterials() {
    setBusy(true)
    setMsg(null)
    try {
      const res = await fetch('/api/hub/investor-materials', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materials: draft }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) {
        setMsg({ ok: false, text: data.error || 'Save failed' })
        return
      }
      const next = { ...FALLBACK_MATERIALS, ...(data.materials || {}) }
      next.links = { ...FALLBACK_MATERIALS.links, ...(data.materials?.links || {}) }
      next.companyBlurbs = {
        ...FALLBACK_MATERIALS.companyBlurbs,
        ...(data.materials?.companyBlurbs || {}),
      }
      next.companyDeckOverrides = data.materials?.companyDeckOverrides || {}
      setMaterials(next)
      setDraft(next)
      setCompanies(data.companies?.length ? data.companies : COMPANY_DECKS)
      setStorage(data.storage || storage)
      setMsg({ ok: true, text: `Saved${data.storage ? ` (${data.storage})` : ''}.` })
    } catch {
      setMsg({ ok: false, text: 'Could not reach the server' })
    } finally {
      setBusy(false)
    }
  }

  async function uploadAsset(slot, file, applyUrl) {
    setBusy(true)
    setMsg(null)
    try {
      const dataUrl = await fileToDataUrl(file)
      const res = await fetch('/api/hub/investor-materials', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upload',
          slot,
          filename: file.name,
          dataUrl,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok || !data.url) {
        setMsg({ ok: false, text: data.error || 'Upload failed' })
        return
      }
      applyUrl(data.url)
      setMsg({
        ok: true,
        text: data.note || 'Uploaded — click Save to persist link overrides.',
      })
    } catch (err) {
      setMsg({ ok: false, text: err.message || 'Upload failed' })
    } finally {
      setBusy(false)
    }
  }

  if (status.loading || (status.unlocked && !materialsReady)) {
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
          Inquiries: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </div>
    )
  }

  if (status.canEdit) {
    return (
      <MaterialsEditor
        draft={draft}
        setDraft={setDraft}
        companies={companies}
        onSave={saveMaterials}
        onUpload={uploadAsset}
        onLock={lockSession}
        busy={busy}
        msg={msg}
        storage={storage}
      />
    )
  }

  return (
    <MaterialsReadView
      materials={materials}
      companies={companies}
      tier={status.tier}
      onLock={lockSession}
      busy={busy}
    />
  )
}
