/**
 * Public /eason page — sourced roles and links only.
 * Halls route on valhallaco.org. Argo Atomics is not listed.
 */
import { EXTRA_COMPANY_ROUTES, GRID_ORDER, getCompany } from '../lib/companies.js'

export const EASON_SOCIALS = {
  x: 'https://x.com/easongreene',
  instagram: 'https://www.instagram.com/eason_greene/',
  linkedin: 'https://www.linkedin.com/in/easongreene',
}

export const JEFFERSON_MANIFESTO_URL =
  'https://jeffersonabundance.substack.com/p/the-jefferson-manifesto'

export const CASURF_URL = 'https://casurf.vote'
export const PHOTO_TILE_URL = 'https://photo-tile.com'

export const EASON_SECTIONS = ['business', 'projects', 'academics', 'exploration', 'civic']

function hallHref(id) {
  return `/${id}`
}

/** Mosaic halls + Meridian. No Netlify. No Argo. */
export function easonHallWork() {
  return [...GRID_ORDER, ...EXTRA_COMPANY_ROUTES].map((id) => {
    const c = getCompany(id)
    return {
      id,
      name: c.name,
      href: hallHref(id),
      kind: c.mosaic === false ? 'layer' : 'hall',
      domain: c.domain,
      pillar: c.pillar,
    }
  })
}

export const EASON_PROJECTS = [
  {
    id: 'photo-tile',
    name: 'Photo Tile',
    href: PHOTO_TILE_URL,
    external: true,
    note: 'Print a photo as a tile.',
  },
  {
    id: 'aphrodite',
    name: 'Aphrodite',
    href: '/aphrodite',
    note: 'Competition dating.',
  },
  {
    id: 'orca',
    name: 'Orca Capital',
    href: '/orca',
    note: 'Venture pod.',
  },
  {
    id: 'seshat',
    name: 'Seshat',
    href: '/seshat',
    note: 'Language-acquisition work.',
  },
  {
    id: 'natasha',
    name: 'Natasha Framework',
    href: '/natasha',
    note: 'Consciousness / phase-space notes.',
  },
  {
    id: 'raven',
    name: 'Raven OS',
    href: '/raven',
    note: 'Founder operating system.',
  },
  {
    id: 'purpology',
    name: 'Purpology',
    href: '/purpology',
    note: 'Side study.',
  },
  {
    id: 'edna-charge',
    name: 'Edna Charge',
    href: null,
    note: 'Peer-to-peer EV charging. Separate project — not a Valhalla hall.',
  },
  {
    id: 'mentiforce',
    name: 'Mentiforce',
    href: 'https://mentiforce.ai',
    external: true,
    note: 'Employee 3.',
  },
]

export const EASON_ACADEMICS = [
  {
    id: 'berkeley',
    name: 'UC Berkeley',
    note: 'Interdisciplinary Studies — Economics, Public Policy, Sociology.',
  },
  {
    id: 'data8',
    name: 'Data 8',
    href: '/data8',
    note: 'Study notes.',
  },
]

export const EASON_EXPLORATION = [
  'Mandarin',
  'Swedish',
  'Tuolumne County',
  'Climate technologies',
  'Fabrics',
  'Photography',
]

export const EASON_CIVIC = [
  {
    id: 'casurf',
    name: 'CA-SURF',
    href: CASURF_URL,
    external: true,
    note: 'Executive Director of Outreach, Berkeley chapter.',
  },
  {
    id: 'jefferson',
    name: 'The Jefferson Manifesto',
    href: JEFFERSON_MANIFESTO_URL,
    external: true,
    note: 'Civic writing on Substack.',
  },
]

export const TILE_RUNE = {
  id: 'tiles',
  name: 'Tiles',
  href: PHOTO_TILE_URL,
  external: true,
  rune: 'tile',
  glyph: '▣',
  label: 'Tiles',
}

export function mosaicFloatRunes(portals) {
  return [
    ...portals.map((p) => ({
      id: p.id,
      name: p.name,
      href: p.path,
      external: false,
      rune: p.rune,
    })),
    {
      id: TILE_RUNE.id,
      name: TILE_RUNE.name,
      href: TILE_RUNE.href,
      external: true,
      rune: TILE_RUNE.rune,
    },
  ]
}

export function assertNoArgo(items) {
  return items.every((item) => !/argo/i.test(item.id || '') && !/argo/i.test(item.name || ''))
}

export function assertNoNetlify(items) {
  return items.every((item) => !String(item.href || '').includes('netlify'))
}
