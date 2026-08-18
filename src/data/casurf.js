/**
 * CA-SURF Berkeley chapter — public site data.
 * Original photos live in public/casurf/ (copied unmodified from Desktop/CASURF).
 * CasurfPhoto tries png/jpg/jpeg/webp so original extensions still load.
 */

export const CAL = {
  blue: '#003262',
  gold: '#FDB515',
  white: '#FFFFFF',
}

export const CASURF = {
  name: 'CA-SURF Berkeley',
  short: 'CA-SURF',
  chapter: 'UC Berkeley',
  parentName: 'CA-SURF',
  parentUrl: 'https://casurf.vote',
  parentHandle: 'casurf_',
  instagram: 'casurfberkeley',
  instagramUrl: 'https://www.instagram.com/casurfberkeley/',
  parentForm:
    'https://docs.google.com/forms/d/e/1FAIpQLSdrod8TLQZHspNbhqRQCL9xM66I90Z2E2crjv-zt6n67BFAqA/viewform',
  parentEmail: 'edell@casurf.vote',
  tagline: 'California Alliance of Students United for a Reformed Future',
  kicker: 'Est. 2026 · UC Berkeley Chapter · CA-SURF',
}

export const TEAM = [
  {
    id: 'lisette',
    name: 'Lisette Martinez',
    role: 'President',
    photo: '/casurf/team/lisette',
    photoSoon: false,
  },
  {
    id: 'eason',
    name: 'Eason Greene',
    role: 'Director of Outreach',
    photo: '/casurf/team/eason',
    photoSoon: false,
  },
  {
    id: 'emily',
    name: 'Emily Rodriguez',
    role: 'Social Media Manager',
    photo: '/casurf/team/emily',
    photoSoon: false,
  },
  {
    id: 'cielo',
    name: 'Cielo Aguirre',
    role: 'Communication Director',
    photo: null,
    photoSoon: true,
  },
]

export const GALLERY_SETS = [
  { id: 'all', label: 'All' },
  { id: 'campus', label: 'Campus' },
  { id: 'bay', label: 'Bay' },
  { id: 'golden-hour', label: 'Golden Hour' },
  { id: 'night', label: 'Night' },
]

export const GALLERY = [
  {
    id: 'underhill-field',
    src: '/casurf/gallery/underhill-field',
    title: 'Underhill Field',
    set: 'campus',
    filename: 'underhill-field',
  },
  {
    id: 'campus-dusk',
    src: '/casurf/gallery/campus-dusk',
    title: 'Campus at dusk',
    set: 'campus',
    filename: 'campus-dusk',
  },
  {
    id: 'stiles-hall',
    src: '/casurf/gallery/stiles-hall',
    title: 'Stiles Hall',
    set: 'campus',
    filename: 'stiles-hall',
  },
  {
    id: 'campanile-path',
    src: '/casurf/gallery/campanile-path',
    title: 'Sather Tower path',
    set: 'campus',
    filename: 'campanile-path',
  },
  {
    id: 'memorial-glade',
    src: '/casurf/gallery/memorial-glade',
    title: 'Memorial Glade',
    set: 'campus',
    filename: 'memorial-glade',
  },
  {
    id: 'bay-view',
    src: '/casurf/gallery/bay-view',
    title: 'Bay from the hills',
    set: 'bay',
    filename: 'bay-view',
  },
  {
    id: 'gg-sunset',
    src: '/casurf/gallery/gg-sunset',
    title: 'Golden Gate sunset',
    set: 'bay',
    filename: 'gg-sunset',
  },
  {
    id: 'golden-hour',
    src: '/casurf/gallery/golden-hour',
    title: 'Berkeley golden hour',
    set: 'golden-hour',
    filename: 'golden-hour',
  },
  {
    id: 'night-city',
    src: '/casurf/gallery/night-city',
    title: 'East Bay night',
    set: 'night',
    filename: 'night-city',
  },
  {
    id: 'night-campanile',
    src: '/casurf/gallery/night-campanile',
    title: 'Campanile at night',
    set: 'night',
    filename: 'night-campanile',
  },
]

export const DIRECTIVES = [
  {
    n: '01',
    scale: 'Micro — Local',
    title: 'Local Action',
    body: 'On the micro level, CA-SURF focuses on progressive grassroots campaigns within local municipalities near each chapter. Chapters keep autonomy over which local candidates they support. The network does not make statewide endorsements; it works closely with the Progressive Caucus.',
  },
  {
    n: '02',
    scale: 'Macro — Statewide',
    title: 'Statewide Unity',
    body: 'On the macro level, CA-SURF is building a rapid-response network of California colleges to meet national crises with unified action. The aim is to lower the barrier to political involvement and create widespread unity among California’s youth.',
  },
]
