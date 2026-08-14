/**
 * Editable fundraising materials for /investors.
 * Stored in Supabase investor_materials (single row); memory fallback when unset.
 */

import { getSupabase, isSupabaseConfigured } from './supabase.js'

const ROW_ID = 'default'
const MAX_TEXT = 20000
const MAX_BLURB = 2000
const MAX_URL = 800
const MAX_DATA_URL_BYTES = 6 * 1024 * 1024

export const COMPANY_IDS = [
  'wolf',
  'holm',
  'demeter',
  'viking',
  'atoll',
  'njord',
  'eagle',
  'olympus',
  'aeolus',
  'phenix',
  'aether',
  'corvus',
]

const COMPANY_META = {
  wolf: { name: 'Wolf', domain: 'Land', pillar: 'Movement' },
  holm: { name: 'Holm', domain: 'Land', pillar: 'Habitation' },
  demeter: { name: 'Demeter', domain: 'Land', pillar: 'Energy' },
  viking: { name: 'Viking', domain: 'Water', pillar: 'Movement' },
  atoll: { name: 'Atoll', domain: 'Water', pillar: 'Habitation' },
  njord: { name: 'Njord', domain: 'Water', pillar: 'Energy' },
  eagle: { name: 'Eagle', domain: 'Air', pillar: 'Movement' },
  olympus: { name: 'Olympus', domain: 'Air', pillar: 'Habitation' },
  aeolus: { name: 'Aeolus', domain: 'Air', pillar: 'Energy' },
  phenix: { name: 'Phenix', domain: 'Space', pillar: 'Movement' },
  aether: { name: 'Aether', domain: 'Space', pillar: 'Habitation' },
  corvus: { name: 'Corvus', domain: 'Space', pillar: 'Intelligence' },
}

const DEFAULT_LEADS = `# Valhalla — Hall Leads Roster

Dedicated lead (CEO) seat for each of the 12 companies.

| # | Company | Domain | Pillar | Lead | Notes |
|---|---------|--------|--------|------|-------|
| 1 | Wolf | Land | Movement | Anubis Chavez | CEO / Hall Lead |
| 2 | Holm | Land | Habitation | Hestia Barker | CEO / Hall Lead |
| 3 | Demeter | Land | Energy | Ceres Johnson | CEO / Hall Lead |
| 4 | Viking | Water | Movement | Maui Muller | CEO / Hall Lead |
| 5 | Atoll | Water | Habitation | Yemoja Williams | CEO / Hall Lead |
| 6 | Njord | Water | Energy | Eason Greene | CEO / Hall Lead |
| 7 | Eagle | Air | Movement | Garuda Hernandez | CEO / Hall Lead |
| 8 | Olympus | Air | Habitation | Amaterasu Tran | CEO / Hall Lead |
| 9 | Aeolus | Air | Energy | Vayu Dubois | CEO / Hall Lead |
| 10 | Phenix | Space | Movement | Bennu Kimura | CEO / Hall Lead |
| 11 | Aether | Space | Habitation | Nut Garcia | CEO / Hall Lead |
| 12 | Corvus | Space | Intelligence | Thoth Martinez | CEO / Hall Lead |

## Credo
We are all kings. Kings don't wait for the throne — they build it.

## Structure note
Valhalla intends a **lead for each of the 12** halls and a **dedicated pitch deck for each of the 12 companies** (see \`company-decks/\`).

## Meridian (materials layer — optional)
| Entity | Domain | Pillar | Lead |
|--------|--------|--------|------|
| Meridian | Materials | Materials | [[FILL: Meridian Lead Name]] |
`

function mem() {
  const g = globalThis
  if (!g.__vhInvestorMaterials) g.__vhInvestorMaterials = null
  return g
}

/** When investor_materials table is missing, stay on memory for this process. */
let forceMemory = false

function useSupabaseStore() {
  return isSupabaseConfigured() && !forceMemory
}

function isMissingMaterialsTable(err) {
  if (!err) return false
  if (err.code === '42P01') return true
  const msg = `${err.message || ''} ${err.details || ''} ${err.hint || ''}`
  return /investor_materials/i.test(msg) && /(does not exist|could not find the table|schema cache)/i.test(msg)
}

function noteMissingTable(err) {
  if (isMissingMaterialsTable(err)) {
    forceMemory = true
    return true
  }
  return false
}

function emptyBlurbs() {
  return Object.fromEntries(COMPANY_IDS.map((id) => [id, '']))
}

export function defaultMaterials() {
  return {
    elevatorPitch:
      'Valhalla builds 12 companies across Land, Water, Air, and Space solving transit, housing, energy, water, clean aviation, atmosphere, space transport, claims, and sovereign compute—as one civilization system. Everyone is a king. Kings don’t wait for the throne; they build it. valhallaco.org',
    businessModel:
      'Valhalla creates value as a holdco + 12 specialized companies (“halls”) across Land, Water, Air, and Space (Meridian materials optional beneath). Today: public mosaic, interest/email lists, and research/partner queues per hall — no fabricated revenue (MRR $0). Future capture: products and services as each hall reaches readiness (mobility, habitation, energy/water, clean aviation, atmosphere systems, space transport, claims/habitation platforms, sovereign compute), with cross-hall demand so each company feeds the other eleven. We do not claim deed sales, booked flights, or capacity/ROI figures that are not diligence-ready.',
    structureNote:
      'Valhalla is a civilization platform: one holdco thesis, twelve specialized companies across Land, Water, Air, and Space. Legal entity in formation. No fabricated revenue. Contact info@valhallaco.org.',
    leadsMarkdown: DEFAULT_LEADS,
    companyBlurbs: emptyBlurbs(),
    links: {
      pitchPdf: '/investors/Valhalla-Pitch-Deck.pdf',
      deckHtml: '/investors/deck.html',
      application: '/investors/APPLICATION.md',
      leads: '/investors/leads.md',
      companyZip: '/investors/company-decks.zip',
    },
    companyDeckOverrides: {},
  }
}

function sanitizeUrl(v, fallback = '') {
  const s = String(v ?? '').trim().slice(0, MAX_URL)
  if (!s) return fallback
  if (s.startsWith('/') || s.startsWith('https://') || s.startsWith('http://') || s.startsWith('data:')) {
    return s
  }
  return fallback
}

export function sanitizeMaterials(input) {
  const base = defaultMaterials()
  if (!input || typeof input !== 'object') return base

  const blurbsIn = input.companyBlurbs && typeof input.companyBlurbs === 'object' ? input.companyBlurbs : {}
  const companyBlurbs = emptyBlurbs()
  for (const id of COMPANY_IDS) {
    companyBlurbs[id] = String(blurbsIn[id] ?? '').slice(0, MAX_BLURB)
  }

  const linksIn = input.links && typeof input.links === 'object' ? input.links : {}
  const links = {
    pitchPdf: sanitizeUrl(linksIn.pitchPdf, base.links.pitchPdf),
    deckHtml: sanitizeUrl(linksIn.deckHtml, base.links.deckHtml),
    application: sanitizeUrl(linksIn.application, base.links.application),
    leads: sanitizeUrl(linksIn.leads, base.links.leads),
    companyZip: sanitizeUrl(linksIn.companyZip, base.links.companyZip),
  }

  const overridesIn =
    input.companyDeckOverrides && typeof input.companyDeckOverrides === 'object'
      ? input.companyDeckOverrides
      : {}
  const companyDeckOverrides = {}
  for (const id of COMPANY_IDS) {
    const row = overridesIn[id]
    if (!row || typeof row !== 'object') continue
    const pdf = sanitizeUrl(row.pdf, '')
    const html = sanitizeUrl(row.html, '')
    if (pdf || html) {
      companyDeckOverrides[id] = {}
      if (pdf) companyDeckOverrides[id].pdf = pdf
      if (html) companyDeckOverrides[id].html = html
    }
  }

  return {
    elevatorPitch: String(input.elevatorPitch ?? base.elevatorPitch).slice(0, MAX_TEXT),
    businessModel: String(input.businessModel ?? base.businessModel).slice(0, MAX_TEXT),
    structureNote: String(input.structureNote ?? base.structureNote).slice(0, MAX_TEXT),
    leadsMarkdown: String(input.leadsMarkdown ?? base.leadsMarkdown).slice(0, MAX_TEXT),
    companyBlurbs,
    links,
    companyDeckOverrides,
  }
}

function mapRow(row) {
  const content = sanitizeMaterials(row?.content || row)
  return {
    id: ROW_ID,
    content,
    updatedAt: row?.updated_at || row?.updatedAt || null,
    updatedBy: row?.updated_by || row?.updatedBy || '',
  }
}

export function companyCatalog(content) {
  const materials = sanitizeMaterials(content)
  return COMPANY_IDS.map((id) => {
    const meta = COMPANY_META[id]
    const override = materials.companyDeckOverrides[id] || {}
    return {
      id,
      name: meta.name,
      domain: meta.domain,
      pillar: meta.pillar,
      blurb: materials.companyBlurbs[id] || '',
      pdf: override.pdf || `/investors/company-decks/${id}.pdf`,
      html: override.html || `/investors/company-decks/${id}.html`,
    }
  })
}

export async function getInvestorMaterials() {
  if (useSupabaseStore()) {
    const sb = getSupabase()
    const { data, error } = await sb.from('investor_materials').select('*').eq('id', ROW_ID).maybeSingle()
    if (error) {
      if (noteMissingTable(error)) {
        /* fall through */
      } else {
        throw error
      }
    } else if (data) {
      return mapRow(data)
    }
  }

  const g = mem()
  if (g.__vhInvestorMaterials) return g.__vhInvestorMaterials
  return {
    id: ROW_ID,
    content: defaultMaterials(),
    updatedAt: null,
    updatedBy: '',
  }
}

export async function upsertInvestorMaterials(input, updatedBy = '') {
  const content = sanitizeMaterials(input)
  const now = new Date().toISOString()
  const by = String(updatedBy || '').slice(0, 200)
  const row = { id: ROW_ID, content, updatedAt: now, updatedBy: by }

  if (!useSupabaseStore()) {
    mem().__vhInvestorMaterials = row
    return row
  }

  const sb = getSupabase()
  const { data, error } = await sb
    .from('investor_materials')
    .upsert({
      id: ROW_ID,
      content,
      updated_at: now,
      updated_by: by,
    })
    .select('*')
    .single()

  if (error) {
    if (noteMissingTable(error)) {
      mem().__vhInvestorMaterials = row
      return row
    }
    throw error
  }
  return mapRow(data)
}

/**
 * Upload a PDF (or other binary) for investor pack overrides.
 * Prefer Supabase Storage bucket `investor-assets`; small files may use data URLs in memory.
 */
export async function uploadInvestorAsset({ slot, dataUrl, filename = '', updatedBy = '' }) {
  const slotSafe = String(slot || 'file')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 40)
  if (!slotSafe) throw new Error('slot required')

  const raw = String(dataUrl || '')
  const m = raw.match(/^data:([^;]+);base64,(.+)$/s)
  if (!m) throw new Error('Expected data URL')
  const contentType = m[1].toLowerCase()
  const buf = Buffer.from(m[2], 'base64')
  if (!buf.length) throw new Error('Empty file')
  if (buf.length > MAX_DATA_URL_BYTES) {
    throw new Error(`File too large (max ${Math.floor(MAX_DATA_URL_BYTES / (1024 * 1024))}MB)`)
  }

  const allowed = ['application/pdf', 'text/markdown', 'text/plain', 'text/html']
  if (!allowed.some((t) => contentType.startsWith(t))) {
    throw new Error('Only PDF, markdown, plain text, or HTML uploads allowed')
  }

  const ext =
    contentType.includes('pdf')
      ? 'pdf'
      : contentType.includes('html')
        ? 'html'
        : contentType.includes('markdown')
          ? 'md'
          : 'txt'
  const nameSafe = String(filename || `${slotSafe}.${ext}`)
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 80)
  const path = `materials/${slotSafe}/${Date.now()}-${nameSafe}`

  if (isSupabaseConfigured()) {
    const sb = getSupabase()
    const { error: upErr } = await sb.storage.from('investor-assets').upload(path, buf, {
      contentType,
      upsert: true,
    })
    if (!upErr) {
      const { data: pub } = sb.storage.from('investor-assets').getPublicUrl(path)
      return {
        ok: true,
        url: pub?.publicUrl || '',
        path,
        contentType,
        note: 'Stored in Supabase Storage bucket investor-assets',
        updatedBy: String(updatedBy || '').slice(0, 200),
      }
    }
    // Bucket missing → fall through to data URL if small enough for link override
    if (buf.length > 400 * 1024) {
      throw new Error(
        `Storage upload failed (${upErr.message}). Create public bucket "investor-assets", or use a file under 400KB.`,
      )
    }
  }

  if (buf.length > 400 * 1024) {
    throw new Error(
      'Supabase Storage not available and file exceeds 400KB data-URL cap. Create bucket investor-assets.',
    )
  }

  return {
    ok: true,
    url: raw.slice(0, MAX_DATA_URL_BYTES + 100),
    path: null,
    contentType,
    note: 'Stored as data URL (prefer Supabase Storage bucket investor-assets).',
    updatedBy: String(updatedBy || '').slice(0, 200),
  }
}

export function investorMaterialsStorageLabel() {
  return useSupabaseStore() ? 'supabase' : 'memory'
}
