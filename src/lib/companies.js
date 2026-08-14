/** Visual grid order (row-major). Do not reorder. */
export const GRID_ORDER = [
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

/** Chronological reveal order (wave 1 then wave 2, top-to-bottom within domains). */
export const REVEAL_ORDER = [
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

/** Off-mosaic company routes (materials layer, etc.). Not in GRID_ORDER / REVEAL_ORDER. */
export const EXTRA_COMPANY_ROUTES = ['meridian']

/**
 * Company matrix source of truth.
 * Timing fields are derived in launchSchedule.js, do not hard-code clocks in UI.
 * Swap Wolf art by setting imageSrc only.
 */
export const companies = [
  {
    id: 'wolf',
    name: 'Wolf',
    domain: 'land',
    pillar: 'movement',
    wave: 1,
    imageSrc: '/images/wolf.png',
    placeholderSrc: '/images/placeholders/default.svg',
    frameSeed: 101,
  },
  {
    id: 'viking',
    name: 'Viking',
    domain: 'water',
    pillar: 'movement',
    wave: 1,
    imageSrc: '/images/viking.png',
    placeholderSrc: '/images/placeholders/default.svg',
    frameSeed: 202,
  },
  {
    id: 'eagle',
    name: 'Eagle',
    domain: 'air',
    pillar: 'movement',
    wave: 2,
    imageSrc: '/images/eagle.png',
    placeholderSrc: '/images/placeholders/default.svg',
    frameSeed: 303,
  },
  {
    id: 'phenix',
    name: 'Phenix',
    domain: 'space',
    pillar: 'movement',
    wave: 2,
    imageSrc: '/images/phenix.png',
    placeholderSrc: '/images/placeholders/default.svg',
    frameSeed: 404,
  },
  {
    id: 'holm',
    name: 'Holm',
    domain: 'land',
    pillar: 'habitation',
    wave: 1,
    imageSrc: '/images/holm.png',
    placeholderSrc: '/images/placeholders/default.svg',
    frameSeed: 111,
  },
  {
    id: 'atoll',
    name: 'Atoll',
    domain: 'water',
    pillar: 'habitation',
    wave: 1,
    imageSrc: '/images/atoll.png',
    placeholderSrc: '/images/placeholders/default.svg',
    frameSeed: 212,
  },
  {
    id: 'olympus',
    name: 'Olympus',
    domain: 'air',
    pillar: 'habitation',
    wave: 2,
    imageSrc: '/images/olympus.png',
    placeholderSrc: '/images/placeholders/default.svg',
    frameSeed: 313,
  },
  {
    id: 'aether',
    name: 'Aether',
    domain: 'space',
    pillar: 'habitation',
    wave: 2,
    imageSrc: '/images/aether.png',
    placeholderSrc: '/images/placeholders/default.svg',
    frameSeed: 414,
  },
  {
    id: 'demeter',
    name: 'Demeter',
    domain: 'land',
    pillar: 'energy',
    wave: 1,
    imageSrc: '/images/demeter.png',
    placeholderSrc: '/images/placeholders/default.svg',
    frameSeed: 121,
  },
  {
    id: 'njord',
    name: 'Njord',
    domain: 'water',
    pillar: 'energy',
    wave: 1,
    imageSrc: '/images/njord.png',
    placeholderSrc: '/images/placeholders/default.svg',
    frameSeed: 222,
  },
  {
    id: 'aeolus',
    name: 'Aeolus',
    domain: 'air',
    pillar: 'energy',
    wave: 2,
    imageSrc: '/images/aeolus.png',
    placeholderSrc: '/images/placeholders/default.svg',
    frameSeed: 323,
  },
  {
    id: 'corvus',
    name: 'Corvus',
    domain: 'space',
    pillar: 'intelligence',
    wave: 2,
    imageSrc: '/images/corvus.png',
    placeholderSrc: '/images/placeholders/default.svg',
    frameSeed: 424,
  },
  /**
   * Materials layer beneath the 4×3 mosaic (not a mosaic tile).
   * Routed at /meridian; excluded from GRID_ORDER / REVEAL_ORDER.
   */
  {
    id: 'meridian',
    name: 'Meridian',
    domain: 'materials',
    pillar: 'materials',
    wave: 0,
    mosaic: false,
    imageSrc: '/images/placeholders/default.svg',
    placeholderSrc: '/images/placeholders/default.svg',
    frameSeed: 505,
  },
]

export function getCompany(id) {
  return companies.find((c) => c.id === id)
}

export function getGridCompanies() {
  return GRID_ORDER.map(getCompany)
}

export function getRevealCompanies() {
  return REVEAL_ORDER.map(getCompany)
}
