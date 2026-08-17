/**
 * Founder side-projects hidden behind rune marks in the hub social row.
 * No password gates — discovery is the only lock (click the mark).
 */
export const HIDDEN_PORTALS = [
  {
    id: 'purpology',
    path: '/purpology',
    name: 'Purpology',
    rune: 'perthro',
    glyph: 'ᛈ',
    label: 'Perthro',
    source: 'https://purpology.netlify.app/',
    accent: '#c940b0',
    barBg: '#0d0010',
    barInk: '#e8c8f5',
  },
  {
    id: 'eason',
    path: '/eason',
    name: 'Eason Greene',
    rune: 'ansuz',
    glyph: 'ᚨ',
    label: 'Ansuz',
    source: 'https://easongreene.netlify.app/',
    accent: '#b8962e',
    barBg: '#1e2d40',
    barInk: '#f4f6f9',
  },
  {
    id: 'seshat',
    path: '/seshat',
    name: 'Seshat',
    rune: 'seshat-star',
    glyph: '✶',
    label: 'Seshat',
    source: 'https://seshat314.netlify.app/',
    accent: '#C4923A',
    barBg: '#0A0A0F',
    barInk: '#F5F0E8',
  },
  {
    id: 'raven',
    path: '/raven',
    name: 'Raven OS',
    rune: 'raidho',
    glyph: 'ᚱ',
    label: 'Raidho',
    source: 'https://ravenoperatingsystem.netlify.app/',
    accent: '#C8A86B',
    barBg: '#08080A',
    barInk: '#E8E8F0',
  },
  {
    id: 'data8',
    path: '/data8',
    name: 'Data 8 Study',
    rune: 'dagaz',
    glyph: 'ᛞ',
    label: 'Dagaz',
    source: 'https://data8-study.netlify.app/',
    accent: '#2d6a4f',
    barBg: '#f7f5f0',
    barInk: '#1a1814',
  },
  {
    id: 'orca',
    path: '/orca',
    name: 'Orca Capital',
    rune: 'orca',
    glyph: 'ᚢ',
    label: 'Uruz',
    source: 'https://orcacapital.netlify.app/',
    accent: '#C6A15B',
    barBg: '#0A0A0C',
    barInk: '#FAFAF8',
  },
  {
    id: 'natasha',
    path: '/natasha',
    name: 'Natasha Framework',
    rune: 'psi',
    glyph: 'Ψ',
    label: 'Psi',
    source: 'https://natashaframework.netlify.app/',
    accent: '#C4923A',
    barBg: '#F5F0E8',
    barInk: '#0A0A0F',
  },
]

export const HIDDEN_PORTAL_PATHS = HIDDEN_PORTALS.map((p) => p.path)

export function getHiddenPortal(idOrPath) {
  const key = String(idOrPath || '').replace(/^\//, '')
  return HIDDEN_PORTALS.find((p) => p.id === key || p.path === `/${key}`) || null
}
