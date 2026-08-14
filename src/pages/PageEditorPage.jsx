import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  BLOCK_TYPES,
  FONT_FAMILIES,
  PAGE_IDS,
  PAGE_LABELS,
  SNAP,
  emptyLayout,
  fileToDataUrl,
  newBlock,
  snap,
} from '../lib/pageEditor'
import { getDefaultPageLayout, isEmptyLayout } from '../lib/defaultPageLayouts'

const ADMIN_EMAIL = 'info@valhallaco.org'

export default function PageEditorPage() {
  const { pageId: routePageId } = useParams()
  const navigate = useNavigate()
  const pageId = PAGE_IDS.includes(routePageId) ? routePageId : 'hub'

  const [auth, setAuth] = useState({ loading: true, ok: false, email: null })
  const [email, setEmail] = useState(ADMIN_EMAIL)
  const [password, setPassword] = useState('')
  const [totp, setTotp] = useState('')
  const [loginError, setLoginError] = useState('')

  const [layout, setLayout] = useState(emptyLayout())
  const [selectedId, setSelectedId] = useState(null)
  const [storage, setStorage] = useState('…')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  const dragRef = useRef(null)
  const canvasRef = useRef(null)

  async function refreshSession() {
    try {
      const res = await fetch('/api/admin/session', { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (data.authenticated) {
        setAuth({ loading: false, ok: true, email: data.email })
      } else {
        setAuth({ loading: false, ok: false, email: null })
      }
    } catch {
      setAuth({ loading: false, ok: false, email: null })
    }
  }

  async function loadPage(id) {
    setStatus('Loading…')
    try {
      const res = await fetch(`/api/admin/pages?id=${encodeURIComponent(id)}`, {
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus(data.error || 'Failed to load')
        return
      }
      const stored = data.page?.layout || emptyLayout()
      if (isEmptyLayout(stored)) {
        setLayout(getDefaultPageLayout(id))
        setDirty(true)
        setStatus('Loaded · site defaults (unsaved, Save to persist)')
      } else {
        setLayout(stored)
        setDirty(false)
        setStatus(
          data.page?.updatedAt
            ? `Loaded · updated ${new Date(data.page.updatedAt).toLocaleString()}`
            : 'Loaded',
        )
      }
      setStorage(data.storage || 'memory')
      setSelectedId(null)
    } catch {
      setStatus('Failed to load')
    }
  }

  useEffect(() => {
    refreshSession()
  }, [])

  useEffect(() => {
    if (auth.ok) loadPage(pageId)
  }, [auth.ok, pageId])

  useEffect(() => {
    if (routePageId && !PAGE_IDS.includes(routePageId)) {
      navigate('/admin/editor/hub', { replace: true })
    }
  }, [routePageId, navigate])

  async function login(e) {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, totp }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLoginError(data.error || 'Login failed')
        return
      }
      setPassword('')
      setTotp('')
      setAuth({ loading: false, ok: true, email: data.email })
    } catch {
      setLoginError('Login failed')
    }
  }

  function patchLayout(updater) {
    setLayout((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      return next
    })
    setDirty(true)
  }

  function updateBlock(id, patch) {
    patchLayout((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }))
  }

  function updateBlockStyle(id, stylePatch) {
    patchLayout((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === id ? { ...b, style: { ...b.style, ...stylePatch } } : b,
      ),
    }))
  }

  function addBlock(type) {
    const block = newBlock(type, layout.blocks.length)
    patchLayout((prev) => ({
      ...prev,
      enabled: true,
      blocks: [...prev.blocks, block],
      canvasHeight: Math.max(prev.canvasHeight, block.y + block.h + 80),
    }))
    setSelectedId(block.id)
  }

  function removeSelected() {
    if (!selectedId) return
    patchLayout((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== selectedId),
    }))
    setSelectedId(null)
  }

  function onPointerDown(e, block) {
    if (e.button != null && e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    setSelectedId(block.id)
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    dragRef.current = {
      id: block.id,
      ox: e.clientX - rect.left - block.x,
      oy: e.clientY - rect.top - block.y,
    }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  function onPointerMove(e) {
    const drag = dragRef.current
    if (!drag) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    let x = snap(e.clientX - rect.left - drag.ox)
    let y = snap(e.clientY - rect.top - drag.oy)
    x = Math.max(0, Math.min(x, 960))
    y = Math.max(0, y)
    patchLayout((prev) => {
      const block = prev.blocks.find((b) => b.id === drag.id)
      const h = block?.h || 80
      const canvasHeight =
        y + h + 48 > prev.canvasHeight ? snap(y + h + 80) : prev.canvasHeight
      return {
        ...prev,
        canvasHeight,
        blocks: prev.blocks.map((b) => (b.id === drag.id ? { ...b, x, y } : b)),
      }
    })
  }

  function onPointerUp() {
    dragRef.current = null
  }

  async function save() {
    setSaving(true)
    setStatus('Saving…')
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, layout }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus(data.error || 'Save failed')
        return
      }
      setLayout(data.page?.layout || layout)
      setStorage(data.storage || storage)
      setDirty(false)
      setStatus(
        data.page?.layout?.enabled
          ? 'Saved · published to live site'
          : 'Saved · layout disabled (live site keeps default UI)',
      )
    } catch {
      setStatus('Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function onUploadImage(file) {
    if (!file || !selectedId) return
    setStatus('Uploading…')
    try {
      const dataUrl = await fileToDataUrl(file)
      const res = await fetch('/api/admin/pages/upload', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId,
          dataUrl,
          filename: file.name,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus(data.error || 'Upload failed')
        return
      }
      updateBlock(selectedId, { src: data.url, type: 'image' })
      setStatus(
        data.storage === 'supabase'
          ? 'Image uploaded to Storage'
          : 'Image stored as data URL (create page-assets bucket for durable CDN URLs)',
      )
    } catch (err) {
      setStatus(err.message || 'Upload failed')
    }
  }

  const selected = layout.blocks.find((b) => b.id === selectedId) || null

  if (auth.loading) {
    return (
      <div className="vh-page vh-admin vh-editor">
        <p className="vh-admin__hint">Checking session…</p>
      </div>
    )
  }

  if (!auth.ok) {
    return (
      <div className="vh-page vh-admin vh-admin__gate vh-editor">
        <p className="vh-admin__mark">Valhalla</p>
        <h1>Page editor</h1>
        <p className="vh-admin__hint">Founder 2FA, same session as /admin.</p>
        <form onSubmit={login}>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          <label className="vh-admin__totp">
            Authenticator
            <input
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          </label>
          {loginError && <p className="vh-admin__error">{loginError}</p>}
          <button type="submit">Sign in</button>
        </form>
        <p className="vh-admin__fine">
          <Link to="/admin">← Admin</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="vh-page vh-editor">
      <header className="vh-editor__top">
        <div className="vh-editor__brand">
          <p className="vh-admin__mark">Valhalla</p>
          <h1>Page editor</h1>
          <p className="vh-editor__meta">
            {auth.email} · storage: {storage}
            {dirty ? ' · unsaved' : ''}
          </p>
        </div>
        <div className="vh-editor__actions">
          <label className="vh-editor__switcher">
            Page
            <select
              value={pageId}
              onChange={(e) => navigate(`/admin/editor/${e.target.value}`)}
            >
              {PAGE_IDS.map((id) => (
                <option key={id} value={id}>
                  {PAGE_LABELS[id]}
                </option>
              ))}
            </select>
          </label>
          <label className="vh-editor__toggle">
            <input
              type="checkbox"
              checked={Boolean(layout.enabled)}
              onChange={(e) => patchLayout((prev) => ({ ...prev, enabled: e.target.checked }))}
            />
            Publish custom layout
          </label>
          <button type="button" className="vh-editor__save" disabled={saving} onClick={save}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            className="vh-editor__link"
            onClick={() => {
              setLayout(getDefaultPageLayout(pageId))
              setSelectedId(null)
              setDirty(true)
              setStatus('Restored site defaults (unsaved)')
            }}
          >
            Site defaults
          </button>
          <Link to="/admin" className="vh-editor__link">
            Admin
          </Link>
          {pageId !== 'hub' && (
            <a className="vh-editor__link" href={`/${pageId}`} target="_blank" rel="noreferrer">
              View live
            </a>
          )}
          {pageId === 'hub' && (
            <a className="vh-editor__link" href="/" target="_blank" rel="noreferrer">
              View hub
            </a>
          )}
        </div>
      </header>

      <p className="vh-editor__status" role="status">
        {status}
      </p>

      <div className="vh-editor__body">
        <aside className="vh-editor__rail">
          <h2>Blocks</h2>
          <div className="vh-editor__add">
            {BLOCK_TYPES.map((b) => (
              <button key={b.type} type="button" onClick={() => addBlock(b.type)}>
                + {b.label}
              </button>
            ))}
          </div>
          <ul className="vh-editor__list">
            {[...layout.blocks]
              .sort((a, b) => a.y - b.y)
              .map((b) => (
                <li key={b.id}>
                  <button
                    type="button"
                    className={b.id === selectedId ? 'is-active' : ''}
                    onClick={() => setSelectedId(b.id)}
                  >
                    {b.type}
                    {b.content ? ` · ${b.content.slice(0, 24)}` : ''}
                  </button>
                </li>
              ))}
          </ul>
          <p className="vh-editor__hint">
            Drag blocks on the canvas. Positions snap to an {SNAP}px grid. Reorder is free-move with
            snap, not a strict vertical stack.
          </p>
        </aside>

        <div
          className="vh-editor__stage"
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div
            ref={canvasRef}
            className="vh-editor__canvas"
            style={{
              height: layout.canvasHeight,
              backgroundSize: `${SNAP}px ${SNAP}px`,
            }}
            onPointerDown={() => setSelectedId(null)}
          >
            {layout.blocks.map((block) => (
              <div
                key={block.id}
                className={`vh-editor__block vh-editor__block--${block.type} ${
                  block.id === selectedId ? 'is-selected' : ''
                }`}
                style={{
                  left: block.x,
                  top: block.y,
                  width: block.w,
                  minHeight: block.h,
                  fontFamily: block.style?.fontFamily,
                  fontSize: block.style?.fontSize,
                  color: block.type === 'spacer' ? 'transparent' : block.style?.color,
                  textAlign: block.style?.align,
                  fontWeight: block.style?.fontWeight,
                }}
                onPointerDown={(e) => onPointerDown(e, block)}
              >
                {block.type === 'image' && block.src ? (
                  <img src={block.src} alt={block.alt || ''} draggable={false} />
                ) : block.type === 'spacer' ? (
                  <span className="vh-editor__spacer-label">spacer {block.h}px</span>
                ) : block.type === 'cta' ? (
                  <span className="vh-editor__cta-chip">{block.content || 'CTA'}</span>
                ) : (
                  block.content || <em>Empty</em>
                )}
              </div>
            ))}
          </div>
        </div>

        <aside className="vh-editor__inspector">
          <h2>Inspector</h2>
          {!selected && <p className="vh-editor__hint">Select a block to edit.</p>}
          {selected && (
            <>
              <label>
                Type
                <select
                  value={selected.type}
                  onChange={(e) => updateBlock(selected.id, { type: e.target.value })}
                >
                  {BLOCK_TYPES.map((b) => (
                    <option key={b.type} value={b.type}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </label>

              {selected.type !== 'spacer' && selected.type !== 'image' && (
                <label>
                  Content
                  <textarea
                    rows={4}
                    value={selected.content}
                    onChange={(e) => updateBlock(selected.id, { content: e.target.value })}
                  />
                </label>
              )}

              {selected.type === 'cta' && (
                <label>
                  Link href
                  <input
                    value={selected.href}
                    onChange={(e) => updateBlock(selected.id, { href: e.target.value })}
                  />
                </label>
              )}

              {selected.type === 'image' && (
                <>
                  <label>
                    Alt text
                    <input
                      value={selected.alt}
                      onChange={(e) => updateBlock(selected.id, { alt: e.target.value })}
                    />
                  </label>
                  <label className="vh-editor__file">
                    Upload image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onUploadImage(e.target.files?.[0])}
                    />
                  </label>
                  {selected.src && (
                    <p className="vh-editor__hint truncate" title={selected.src}>
                      {selected.src.startsWith('data:') ? 'data URL' : selected.src}
                    </p>
                  )}
                </>
              )}

              {selected.type !== 'spacer' && selected.type !== 'image' && (
                <>
                  <label>
                    Font
                    <select
                      value={selected.style?.fontFamily || FONT_FAMILIES[0]}
                      onChange={(e) => updateBlockStyle(selected.id, { fontFamily: e.target.value })}
                    >
                      {FONT_FAMILIES.map((f) => (
                        <option key={f} value={f} style={{ fontFamily: f }}>
                          {f.split(',')[0]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Size (px)
                    <input
                      type="number"
                      step={SNAP}
                      min={10}
                      max={120}
                      value={selected.style?.fontSize || 18}
                      onChange={(e) =>
                        updateBlockStyle(selected.id, { fontSize: snap(e.target.value) })
                      }
                    />
                  </label>
                  <label>
                    Color
                    <input
                      type="color"
                      value={normalizeColor(selected.style?.color)}
                      onChange={(e) => updateBlockStyle(selected.id, { color: e.target.value })}
                    />
                  </label>
                  <label>
                    Align
                    <select
                      value={selected.style?.align || 'left'}
                      onChange={(e) => updateBlockStyle(selected.id, { align: e.target.value })}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </label>
                </>
              )}

              <div className="vh-editor__geom">
                <label>
                  X
                  <input
                    type="number"
                    step={SNAP}
                    value={selected.x}
                    onChange={(e) => updateBlock(selected.id, { x: snap(e.target.value) })}
                  />
                </label>
                <label>
                  Y
                  <input
                    type="number"
                    step={SNAP}
                    value={selected.y}
                    onChange={(e) => updateBlock(selected.id, { y: snap(e.target.value) })}
                  />
                </label>
                <label>
                  W
                  <input
                    type="number"
                    step={SNAP}
                    min={40}
                    value={selected.w}
                    onChange={(e) => updateBlock(selected.id, { w: snap(e.target.value) })}
                  />
                </label>
                <label>
                  H
                  <input
                    type="number"
                    step={SNAP}
                    min={8}
                    value={selected.h}
                    onChange={(e) => updateBlock(selected.id, { h: snap(e.target.value) })}
                  />
                </label>
              </div>

              <button type="button" className="vh-editor__danger" onClick={removeSelected}>
                Delete block
              </button>
            </>
          )}

          <label className="vh-editor__canvas-h">
            Canvas height
            <input
              type="number"
              step={SNAP}
              min={320}
              value={layout.canvasHeight}
              onChange={(e) =>
                patchLayout((prev) => ({ ...prev, canvasHeight: snap(e.target.value) }))
              }
            />
          </label>
        </aside>
      </div>
    </div>
  )
}

function normalizeColor(c) {
  const s = String(c || '#1a1a1a')
  if (/^#[0-9a-fA-F]{6}$/.test(s)) return s
  return '#1a1a1a'
}
