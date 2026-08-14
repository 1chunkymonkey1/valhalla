export const LAUNCH_DATE = '2026-08-13'
export const TIMEZONE = 'America/Los_Angeles'
export const HUB_REVEAL_DELAY_MS = 30 * 60 * 1000
export const EVENT_START = `${LAUNCH_DATE}T08:00:00-07:00`

/** Frame build cadence relative to each hall's launch time */
export const FRAME_BUILD_START_MS = 60 * 60 * 1000 // T-60m, workers appear
export const FRAME_BUILT_MS = 20 * 60 * 1000 // T-20m, frame complete
export const CLICK_DELAY_MS = 5 * 1000 // T+5s, "click" appears

/**
 * Mosaic display order (row-major for CSS grid-cols-4):
 *   Movement → Habitation → Substrate (rows)
 *   Land | Water | Air | Space (columns)
 */
export const MOSAIC_ORDER = [
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

/** Column themes: Land, Water, Air, Space */
export const COLUMN_THEMES = {
  Land: {
    key: 'land',
    label: 'Land',
    primary: '#1B4D3E', // forest green
    secondary: '#C5A028', // gold
    fill: '#F4F7F2',
    worker: '#C5A028',
  },
  Water: {
    key: 'water',
    label: 'Water',
    primary: '#0B1F3A', // deep navy
    secondary: '#C0C7D1', // silver
    fill: '#EEF2F7',
    worker: '#C0C7D1',
  },
  Air: {
    key: 'air',
    label: 'Air',
    primary: '#7EB6D9', // sky blue
    secondary: '#E8EEF2', // silver-white
    accent: '#F5F8FC',
    fill: '#F7FBFF',
    worker: '#9CC7E8',
    lightning: true,
  },
  Space: {
    key: 'space',
    label: 'Space',
    primary: '#111111',
    secondary: '#FF6A00',
    accent: '#FFB347',
    fill: '#030303',
    worker: '#FF6A00',
    flames: true,
  },
}

/**
 * Launch order follows sequential drop hours (for next-door chain).
 * Lunch halt: no drop between 12:00–13:00 PDT.
 */
export const schedule = [
  {
    id: 1,
    slug: 'wolf',
    name: 'Wolf',
    domain: 'Land',
    pillar: 'Movement',
    launchTime: `${LAUNCH_DATE}T08:00:00-07:00`,
    publicStatus: 'waitlist',
    pattern: 'interest',
    tagline: 'Electric adventure motorcycles, and the long road ahead.',
    concept:
      'A land-movement hall for electric adventure motorcycles, rider interest, and transparent transport research. No sales or availability claims yet.',
    accent: '#1C1917',
    ink: '#FAFAF9',
  },
  {
    id: 2,
    slug: 'holm',
    name: 'Holm',
    domain: 'Land',
    pillar: 'Habitation',
    launchTime: `${LAUNCH_DATE}T09:00:00-07:00`,
    publicStatus: 'concept',
    pattern: 'interest',
    tagline: 'Modular homes, configured for the site, not the catalog.',
    concept:
      'A habitation hall for modular home concepts, site feasibility intake, and partner coordination. Concepts and checklists only, not engineered plans.',
    accent: '#3F2E1F',
    ink: '#F5F0E8',
  },
  {
    id: 3,
    slug: 'demeter',
    name: 'Demeter',
    domain: 'Land',
    pillar: 'Substrate',
    launchTime: `${LAUNCH_DATE}T10:00:00-07:00`,
    publicStatus: 'research',
    pattern: 'project',
    tagline: 'Deployable land energy, researched before it is promised.',
    concept:
      'An energy-development workspace for agrivoltaics and related pathways. Internal project diligence first. No investor solicitation or dispatch claims.',
    accent: '#14532D',
    ink: '#ECFDF5',
  },
  {
    id: 4,
    slug: 'viking',
    name: 'Viking',
    domain: 'Water',
    pillar: 'Movement',
    launchTime: `${LAUNCH_DATE}T11:00:00-07:00`,
    publicStatus: 'waitlist',
    pattern: 'interest',
    tagline: 'Board as yourself. Disembark as Ragnar.',
    concept:
      'A narrative cruise concept and interest registry. Story first. No tickets, no “clean” environmental claim until methodology is reviewed.',
    accent: '#0C4A6E',
    ink: '#F0F9FF',
  },
  {
    id: 5,
    slug: 'atoll',
    name: 'Atoll',
    domain: 'Water',
    pillar: 'Habitation',
    launchTime: `${LAUNCH_DATE}T13:00:00-07:00`,
    publicStatus: 'seeking_partners',
    pattern: 'interest',
    tagline: 'Floating modular habitats, Atoll 01, 02, 03.',
    concept:
      'A concept catalogue and controlled interest ledger for floating habitats. Funds and habitability claims stay gated until counsel and engineering clear.',
    accent: '#164E63',
    ink: '#ECFEFF',
  },
  {
    id: 6,
    slug: 'njord',
    name: 'Njord',
    domain: 'Water',
    pillar: 'Substrate',
    launchTime: `${LAUNCH_DATE}T14:00:00-07:00`,
    publicStatus: 'research',
    pattern: 'project',
    tagline: 'Water as substrate, OTEC, atmospheric water, maritime power.',
    concept:
      'A research and opportunity register for water-energy systems. No water-quality or energy-output promises.',
    accent: '#1E3A5F',
    ink: '#E8F1F8',
  },
  {
    id: 7,
    slug: 'eagle',
    name: 'Eagle',
    domain: 'Air',
    pillar: 'Movement',
    launchTime: `${LAUNCH_DATE}T15:00:00-07:00`,
    publicStatus: 'research',
    pattern: 'interest',
    tagline: 'Aviation innovation research, not a flight schedule.',
    concept:
      'A public interest and partner-opportunity surface for aviation research. No flight service, acquisition, endorsement, or emissions claims.',
    accent: '#1E293B',
    ink: '#F8FAFC',
  },
  {
    id: 8,
    slug: 'olympus',
    name: 'Olympus',
    domain: 'Air',
    pillar: 'Habitation',
    launchTime: `${LAUNCH_DATE}T16:00:00-07:00`,
    publicStatus: 'research',
    pattern: 'research',
    tagline: 'Upper-atmosphere habitat research, assumptions made visible.',
    concept:
      'A research library for atmospheric habitat concepts, requirements, and hazards. Conceptual interest only, no habitability timeline.',
    accent: '#312E81',
    ink: '#EEF2FF',
  },
  {
    id: 9,
    slug: 'aeolus',
    name: 'Aeolus',
    domain: 'Air',
    pillar: 'Substrate',
    launchTime: `${LAUNCH_DATE}T17:00:00-07:00`,
    publicStatus: 'research',
    pattern: 'research',
    tagline: 'Atmosphere research with governance first.',
    concept:
      'A climate-atmosphere research registry and opportunity tracker. Vision language is not ownership, permission, or deployment authority.',
    accent: '#0F766E',
    ink: '#F0FDFA',
  },
  {
    id: 10,
    slug: 'phenix',
    name: 'Phenix',
    domain: 'Space',
    pillar: 'Movement',
    launchTime: `${LAUNCH_DATE}T18:00:00-07:00`,
    publicStatus: 'concept',
    pattern: 'research',
    tagline: 'Mission concepts and requirements, labeled as such.',
    concept:
      'A mission-concept and payload-interest workspace. No launch booking, payload acceptance, or destination promises.',
    accent: '#431407',
    ink: '#FFF7ED',
  },
  {
    id: 11,
    slug: 'aether',
    name: 'Aether',
    domain: 'Space',
    pillar: 'Habitation',
    launchTime: `${LAUNCH_DATE}T19:00:00-07:00`,
    publicStatus: 'research',
    pattern: 'research',
    tagline: 'Space habitation concepts, with legal status disclosed.',
    concept:
      'A research and opportunity registry for space-habitation concepts. Does not sell, grant, or imply ownership of extraterrestrial territory.',
    accent: '#1E1B4B',
    ink: '#F5F3FF',
  },
  {
    id: 12,
    slug: 'corvus',
    name: 'Corvus',
    domain: 'Space',
    pillar: 'Substrate',
    launchTime: `${LAUNCH_DATE}T20:00:00-07:00`,
    publicStatus: 'concept',
    pattern: 'local',
    tagline: 'Odin, a local-first founder workspace.',
    concept:
      'Odin: projects, documents, tasks, and decision logs for founders. No sovereign-infrastructure, solar, or orbital-debris claims until demonstrated.',
    accent: '#09090B',
    ink: '#FAFAFA',
  },
]

export function getMosaicCompanies() {
  return MOSAIC_ORDER.map((slug) => getCompanyBySlug(slug)).filter(Boolean)
}

/**
 * Frame phases for hub mosaic cells:
 * - idle: nothing yet
 * - building: workers constructing border (T-60m → T-20m)
 * - framed: empty window complete (T-20m → T-0)
 * - image: photo materialized (T-0 → T+5s)
 * - clickable: "click" shown, link live (T+5s+)
 */
export function getFramePhase(company, now = new Date()) {
  if (isPreviewUnlocked()) return 'clickable'

  const launch = getSiteLiveTime(company).getTime()
  const t = now.getTime()
  const msToLaunch = launch - t

  if (msToLaunch > FRAME_BUILD_START_MS) return 'idle'
  if (msToLaunch > FRAME_BUILT_MS) {
    // Progress 0→1 across the 40-minute build window
    const elapsed = FRAME_BUILD_START_MS - msToLaunch
    const duration = FRAME_BUILD_START_MS - FRAME_BUILT_MS
    return { phase: 'building', progress: Math.min(1, Math.max(0, elapsed / duration)) }
  }
  if (msToLaunch > 0) return 'framed'
  if (t < launch + CLICK_DELAY_MS) return 'image'
  return 'clickable'
}

export function getBuildProgress(company, now = new Date()) {
  const phase = getFramePhase(company, now)
  if (typeof phase === 'object') return phase.progress
  if (phase === 'idle') return 0
  return 1
}

export function getPhaseName(company, now = new Date()) {
  const phase = getFramePhase(company, now)
  return typeof phase === 'object' ? phase.phase : phase
}

export function isPreviewUnlocked() {
  // Demo clock owns timing, don't force-unlock frames
  try {
    if (typeof window !== 'undefined' && localStorage.getItem('valhalla_demo') === '1') {
      return false
    }
  } catch {
    /* ignore */
  }
  if (import.meta.env.VITE_PREVIEW_UNLOCK === 'true') return true
  if (typeof window === 'undefined') return false
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.get('preview') === '1') {
      localStorage.setItem('valhalla_preview', '1')
      return true
    }
    return localStorage.getItem('valhalla_preview') === '1'
  } catch {
    return false
  }
}

export function getBrandImage(slug) {
  return `/brands/${slug}.png`
}

export function getCompanyBySlug(slug) {
  return schedule.find((c) => c.slug === slug)
}

export function getNextCompany(company) {
  return schedule.find((c) => c.id === company.id + 1) ?? null
}

export function getSiteLiveTime(company) {
  return new Date(company.launchTime)
}

export function getHubRevealTime(company) {
  const launch = new Date(company.launchTime)
  if (company.id === 1) return launch
  return new Date(launch.getTime() + HUB_REVEAL_DELAY_MS)
}

export function isSiteLive(company, now = new Date()) {
  if (isPreviewUnlocked()) return true
  // Demo: all halls open so placeholders are clickable
  try {
    if (typeof window !== 'undefined' && localStorage.getItem('valhalla_demo') === '1') {
      return true
    }
  } catch {
    /* ignore */
  }
  return now >= getSiteLiveTime(company)
}

export function isHubRevealed(company, now = new Date()) {
  if (isPreviewUnlocked()) return true
  return now >= getHubRevealTime(company)
}

export function isEventStarted(now = new Date()) {
  if (isPreviewUnlocked()) return true
  return now >= new Date(EVENT_START)
}
