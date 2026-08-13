/**
 * Published page layouts for founder visual editor.
 * page_id: hub | company slug. Memory fallback when Supabase unset.
 */

import { getSupabase, isSupabaseConfigured } from './supabase.js'

export const PAGE_IDS = [
  'hub',
  'wolf',
  'viking',
  'eagle',
  'phenix',
  'holm',
  'atoll',
  'olympus',
  'aether',
  'demeter',
  'njord',
  'aeolus',
  'corvus',
]

export const BLOCK_TYPES = ['hero', 'text', 'image', 'spacer', 'cta']

export const FONT_FAMILIES = [
  'Source Serif 4, Literata, Georgia, serif',
  'Literata, Georgia, serif',
  'Sora, system-ui, sans-serif',
  'Syne, system-ui, sans-serif',
  'IBM Plex Mono, ui-monospace, monospace',
]

const SNAP = 8
const MAX_BLOCKS = 48
const MAX_TEXT = 8000
const MAX_DATA_URL_BYTES = 400 * 1024

function mem() {
  const g = globalThis
  if (!g.__vhPageLayouts) g.__vhPageLayouts = {}
  return g.__vhPageLayouts
}

function memAssets() {
  const g = globalThis
  if (!g.__vhPageAssets) g.__vhPageAssets = []
  return g.__vhPageAssets
}

export function isValidPageId(pageId) {
  return PAGE_IDS.includes(pageId)
}

export function snap(n, grid = SNAP) {
  const v = Number(n)
  if (!Number.isFinite(v)) return 0
  return Math.round(v / grid) * grid
}

function emptyLayout() {
  return {
    version: 1,
    enabled: false,
    grid: SNAP,
    canvasHeight: 720,
    blocks: [],
  }
}

function sanitizeStyle(style = {}) {
  const fontFamily = String(style.fontFamily || FONT_FAMILIES[0]).slice(0, 120)
  const fontSize = Math.min(120, Math.max(10, snap(style.fontSize ?? 18)))
  const color = String(style.color || '#1a1a1a').slice(0, 40)
  const align = ['left', 'center', 'right'].includes(style.align) ? style.align : 'left'
  const fontWeight = String(style.fontWeight || '500').slice(0, 16)
  return { fontFamily, fontSize, color, align, fontWeight }
}

function sanitizeBlock(raw, index) {
  if (!raw || typeof raw !== 'object') return null
  const type = BLOCK_TYPES.includes(raw.type) ? raw.type : 'text'
  const id = String(raw.id || `b_${index}_${Date.now()}`).slice(0, 64)
  const x = snap(raw.x ?? 24)
  const y = snap(raw.y ?? index * 80)
  const w = Math.min(1200, Math.max(40, snap(raw.w ?? 640)))
  let h = Math.min(1200, Math.max(type === 'spacer' ? 8 : 24, snap(raw.h ?? (type === 'spacer' ? 40 : 80))))
  const content = String(raw.content ?? '').slice(0, MAX_TEXT)
  const href = String(raw.href ?? '').slice(0, 500)
  const src = String(raw.src ?? '').slice(0, MAX_DATA_URL_BYTES + 100)
  const alt = String(raw.alt ?? '').slice(0, 200)
  return {
    id,
    type,
    x,
    y,
    w,
    h,
    content,
    href,
    src,
    alt,
    style: sanitizeStyle(raw.style),
  }
}

export function sanitizeLayout(input) {
  const base = emptyLayout()
  if (!input || typeof input !== 'object') return base
  const blocksIn = Array.isArray(input.blocks) ? input.blocks.slice(0, MAX_BLOCKS) : []
  const blocks = blocksIn.map(sanitizeBlock).filter(Boolean)
  const canvasHeight = Math.min(
    4000,
    Math.max(320, snap(input.canvasHeight ?? Math.max(720, ...blocks.map((b) => b.y + b.h + 48)))),
  )
  return {
    version: 1,
    enabled: Boolean(input.enabled),
    grid: SNAP,
    canvasHeight,
    blocks,
  }
}

function mapRow(row) {
  if (!row) return null
  return {
    pageId: row.page_id || row.pageId,
    layout: sanitizeLayout(row.layout),
    updatedAt: row.updated_at || row.updatedAt || null,
    updatedBy: row.updated_by || row.updatedBy || '',
  }
}

export async function listPageLayouts() {
  if (!isSupabaseConfigured()) {
    return PAGE_IDS.map((pageId) => {
      const hit = mem()[pageId]
      return (
        hit || {
          pageId,
          layout: emptyLayout(),
          updatedAt: null,
          updatedBy: '',
        }
      )
    })
  }

  const sb = getSupabase()
  const { data, error } = await sb.from('page_layouts').select('*')
  if (error) throw error
  const byId = Object.fromEntries((data || []).map((r) => [r.page_id, mapRow(r)]))
  return PAGE_IDS.map(
    (pageId) =>
      byId[pageId] || {
        pageId,
        layout: emptyLayout(),
        updatedAt: null,
        updatedBy: '',
      },
  )
}

export async function getPageLayout(pageId) {
  if (!isValidPageId(pageId)) return null
  if (!isSupabaseConfigured()) {
    return (
      mem()[pageId] || {
        pageId,
        layout: emptyLayout(),
        updatedAt: null,
        updatedBy: '',
      }
    )
  }
  const sb = getSupabase()
  const { data, error } = await sb.from('page_layouts').select('*').eq('page_id', pageId).maybeSingle()
  if (error) throw error
  return (
    mapRow(data) || {
      pageId,
      layout: emptyLayout(),
      updatedAt: null,
      updatedBy: '',
    }
  )
}

/** Public: only return when enabled and has blocks. */
export async function getPublishedPageLayout(pageId) {
  const row = await getPageLayout(pageId)
  if (!row?.layout?.enabled || !row.layout.blocks?.length) return null
  return {
    pageId: row.pageId,
    layout: row.layout,
    updatedAt: row.updatedAt,
  }
}

export async function upsertPageLayout(pageId, layoutInput, updatedBy = '') {
  if (!isValidPageId(pageId)) throw new Error('Unknown page id')
  const layout = sanitizeLayout(layoutInput)
  const now = new Date().toISOString()
  const by = String(updatedBy || '').slice(0, 200)

  if (!isSupabaseConfigured()) {
    mem()[pageId] = { pageId, layout, updatedAt: now, updatedBy: by }
    return mem()[pageId]
  }

  const sb = getSupabase()
  const { error } = await sb.from('page_layouts').upsert(
    {
      page_id: pageId,
      layout,
      updated_at: now,
      updated_by: by,
    },
    { onConflict: 'page_id' },
  )
  if (error) throw error
  return getPageLayout(pageId)
}

function parseDataUrl(dataUrl) {
  const m = String(dataUrl || '').match(/^data:([^;]+);base64,(.+)$/)
  if (!m) return null
  const contentType = m[1]
  const buf = Buffer.from(m[2], 'base64')
  return { contentType, buf }
}

/**
 * Upload image bytes to Supabase Storage bucket `page-assets`.
 * Falls back to returning a capped data URL when storage is missing/fails.
 */
export async function uploadPageAsset({ pageId, dataUrl, filename, createdBy = '' }) {
  if (!isValidPageId(pageId)) throw new Error('Unknown page id')
  const parsed = parseDataUrl(dataUrl)
  if (!parsed) throw new Error('Expected a data URL image')
  const { contentType, buf } = parsed
  if (!contentType.startsWith('image/')) throw new Error('Only image uploads allowed')
  if (buf.length > 2.5 * 1024 * 1024) throw new Error('Image too large (max 2.5MB)')

  const safeName = String(filename || 'asset')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 80)
  const ext = contentType.includes('png')
    ? 'png'
    : contentType.includes('webp')
      ? 'webp'
      : contentType.includes('gif')
        ? 'gif'
        : 'jpg'
  const path = `${pageId}/${Date.now()}-${safeName || 'img'}.${ext}`
  const now = new Date().toISOString()
  const by = String(createdBy || '').slice(0, 200)

  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { error: upErr } = await sb.storage.from('page-assets').upload(path, buf, {
      contentType,
      upsert: false,
    })
    if (!upErr) {
      const { data: pub } = sb.storage.from('page-assets').getPublicUrl(path)
      const publicUrl = pub?.publicUrl || ''
      try {
        await sb.from('page_assets').insert({
          page_id: pageId,
          path,
          public_url: publicUrl,
          content_type: contentType,
          byte_size: buf.length,
          created_at: now,
          created_by: by,
        })
      } catch {
        // metadata table optional
      }
      return {
        ok: true,
        storage: 'supabase',
        path,
        url: publicUrl,
        byteSize: buf.length,
      }
    }
    // Storage missing → fall through to data URL if small enough
    if (buf.length > MAX_DATA_URL_BYTES) {
      throw new Error(
        `Storage upload failed (${upErr.message}). Create public bucket "page-assets", or use an image under 400KB for data-URL fallback.`,
      )
    }
  }

  if (buf.length > MAX_DATA_URL_BYTES) {
    throw new Error(
      'Supabase Storage not available and image exceeds 400KB data-URL cap. Create bucket page-assets.',
    )
  }

  const url = `data:${contentType};base64,${buf.toString('base64')}`
  memAssets().push({ pageId, path, url, contentType, byteSize: buf.length, createdAt: now, createdBy: by })
  return {
    ok: true,
    storage: 'data-url',
    path,
    url,
    byteSize: buf.length,
    note: 'Stored as data URL (memory/layout). Prefer Supabase Storage bucket page-assets.',
  }
}
