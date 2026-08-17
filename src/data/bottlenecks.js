/**
 * Seshat canon — overnight bottleneck registry (2026-08-17).
 * Three layers, three keyspaces. Do not treat Apollo Music or Meridian as mosaic halls.
 */

import { EXTRA_COMPANY_ROUTES, GRID_ORDER, getCompany } from '../lib/companies.js'

export const SESSION_ID = 'overnight-bottleneck-2026-08-17'
export const SEAT = 'seshat'

/** Mosaic hall ids — frozen to GRID_ORDER. Never add apollo or meridian. */
export const MOSAIC_HALL_IDS = [...GRID_ORDER]

export const LAYERS = {
  hall: 'mosaic-hall',
  music: 'apollo-music',
  merch: 'meridian-apparel',
  bn: 'bottleneck',
  seat: 'council-seat',
}

/**
 * Unifying overnight bottleneck: unnamed layers share one keyspace,
 * so agents spawn the same work as a hall, a track, and a garment.
 */
export const UNIFYING_BOTTLENECK = {
  id: 'layer-key-collision',
  kind: 'unifying',
  publicLabel: 'Three layers',
  adminLabel: 'Layer-key collision',
  layer: 'hub',
  mosaic: false,
  hallId: null,
  musicId: null,
  merchId: null,
  bottleneckId: 'layer-key-collision',
  todoKey: 'bn:layer-key-collision',
  ownerSeat: 'seshat',
  status: 'named',
  note: 'Overnight duplicate todos spawn when mosaic halls, Apollo Music, and Meridian apparel share names without distinct keys.',
}

export const CANON = {
  halls:
    'The twelve halls are the 4x3 mosaic companies (Land/Water/Air/Space x Movement/Habitation/Substrate), ids frozen to GRID_ORDER, and they are the only mosaic tiles.',
  apolloMusic:
    'Apollo Music is the off-mosaic music label (artist deals, originals, sync); it is not a mosaic hall and is not the council seat apollo.',
  meridianApparel:
    'Meridian is the off-mosaic materials layer that cuts Earth Line apparel and hall-marked merch; it is not a thirteenth hall and is not on the launch clock.',
}

export const APOLLO_MUSIC = {
  id: 'apollo-music',
  kind: 'music',
  publicLabel: 'Apollo Music',
  adminLabel: 'Apollo Music (off-mosaic label)',
  layer: LAYERS.music,
  mosaic: false,
  hallId: null,
  seatId: 'apollo',
  musicId: 'am-label',
  merchId: null,
  bottleneckId: 'bn-apollo-music-identity',
  todoKey: 'music:apollo-music',
  ownerSeat: 'apollo',
  status: 'named',
  tagline: 'Music for the empire.',
  model: 'Artist deals + Apollo originals + sync licensing',
  launchThemeId: 'am-valhalla-launch',
  note: 'Council seat id apollo is a Raven agent. Catalog ids use the am- prefix. Never spawn a hall named apollo or apollo-music.',
}

export const MERIDIAN_APPAREL = {
  id: 'meridian',
  kind: 'apparel',
  publicLabel: 'Meridian',
  adminLabel: 'Meridian apparel (off-mosaic materials)',
  layer: LAYERS.merch,
  mosaic: false,
  hallId: null,
  musicId: null,
  merchId: 'merch-carbon',
  bottleneckId: 'bn-meridian-cutter-identity',
  todoKey: 'merch:meridian',
  ownerSeat: 'hephaestus',
  status: 'named',
  cutter: 'Meridian',
  carbonSkus: ['meridian-pants', 'meridian-shirt', 'meridian-jacket'],
  note: 'Company id meridian stays in EXTRA_COMPANY_ROUTES. Hall merch collections are merch-{hall}; SKUs stay {hall}-shirt and {hall}-jacket.',
}

/**
 * Per-hall bottleneck, music theme, and merch collection.
 * bottleneckId / musicId / merchId must never equal the hall id.
 */
export const HALL_ROWS = [
  {
    hallId: 'wolf',
    bottleneckId: 'bn-wolf-oem-path',
    musicId: 'am-theme-wolf',
    merchId: 'merch-wolf',
    publicLabel: 'OEM path',
    adminLabel: 'Wolf OEM / manufacturing path',
    note: 'Fenrir and the pack stay email-first until a manufacturing partner path is real.',
  },
  {
    hallId: 'viking',
    bottleneckId: 'bn-viking-partner-voyage',
    musicId: 'am-theme-viking',
    merchId: 'merch-viking',
    publicLabel: 'Partner voyage',
    adminLabel: 'Viking partner-gated voyage',
    note: 'Itineraries are partner-gated interest, not a ticketed cruise on this surface.',
  },
  {
    hallId: 'eagle',
    bottleneckId: 'bn-eagle-faa-dialogue',
    musicId: 'am-theme-eagle',
    merchId: 'merch-eagle',
    publicLabel: 'Flight dialogue',
    adminLabel: 'Eagle FAA-gated dialogue',
    note: 'Implementation stays FAA-gated. Spirit talks are unsubstantiated until verified.',
  },
  {
    hallId: 'phenix',
    bottleneckId: 'bn-phenix-pad-path',
    musicId: 'am-theme-phenix',
    merchId: 'merch-phenix',
    publicLabel: 'Pad path',
    adminLabel: 'Phénix pad / launch path',
    note: 'Pad and launch path are research. Display name is Phénix; id stays phenix.',
  },
  {
    hallId: 'holm',
    bottleneckId: 'bn-holm-site-builder',
    musicId: 'am-theme-holm',
    merchId: 'merch-holm',
    publicLabel: 'Site builder',
    adminLabel: 'Holm first-time builder / site path',
    note: 'First-time builder conversion needs a real site and compliance path.',
  },
  {
    hallId: 'atoll',
    bottleneckId: 'bn-atoll-harbor-partner',
    musicId: 'am-theme-atoll',
    merchId: 'merch-atoll',
    publicLabel: 'Harbor partner',
    adminLabel: 'Atoll harbor / site partner',
    note: 'Habitation interest only. Not a deed sale on this surface.',
  },
  {
    hallId: 'olympus',
    bottleneckId: 'bn-olympus-platform-partner',
    musicId: 'am-theme-olympus',
    merchId: 'merch-olympus',
    publicLabel: 'Platform partner',
    adminLabel: 'Olympus thin-air platform partner',
    note: 'Air habitation stays partner-gated platform research.',
  },
  {
    hallId: 'aether',
    bottleneckId: 'bn-aether-claim-platform',
    musicId: 'am-theme-aether',
    merchId: 'merch-aether',
    publicLabel: 'Claim platform',
    adminLabel: 'Aether claim platform (no territorial ownership)',
    note: 'Claims and habitation platforms are research. Do not claim ownership beyond Earth.',
  },
  {
    hallId: 'demeter',
    bottleneckId: 'bn-demeter-site-control',
    musicId: 'am-theme-demeter',
    merchId: 'merch-demeter',
    publicLabel: 'Site control',
    adminLabel: 'Demeter Nebraska site control',
    note: 'Site control in Nebraska is the live bottleneck for the land-energy path.',
  },
  {
    hallId: 'njord',
    bottleneckId: 'bn-njord-water-energy',
    musicId: 'am-theme-njord',
    merchId: 'merch-njord',
    publicLabel: 'Water energy',
    adminLabel: 'Njord water-energy partner path',
    note: 'Water and harbor energy stay partner and research until a real node exists.',
  },
  {
    hallId: 'aeolus',
    bottleneckId: 'bn-aeolus-atmosphere-path',
    musicId: 'am-theme-aeolus',
    merchId: 'merch-aeolus',
    publicLabel: 'Atmosphere path',
    adminLabel: 'Aeolus atmosphere systems path',
    note: 'Atmosphere systems remain a research path, not an operational weather product.',
  },
  {
    hallId: 'corvus',
    bottleneckId: 'bn-corvus-raven-product',
    musicId: 'am-theme-corvus',
    merchId: 'merch-corvus',
    publicLabel: 'Raven product',
    adminLabel: 'Corvus Raven OS / Odin productization',
    note: 'Raven OS and Odin stay productization work, not claimed compute revenue.',
  },
]

export const FORBIDDEN_HALL_IDS = Object.freeze([
  'apollo',
  'apollo-music',
  'meridian',
  'phoenix',
  'phenix-hall',
  'music',
  'apparel',
  'merch',
  'hub',
])

/**
 * Overnight spawn rules. Duplicate todoKey is a refuse, not a merge.
 * Display names, epithets, and council seats are never keys.
 */
export const NAMING_RULES = [
  'todoKey is {layer}:{id} with layer in hall | music | merch | bn | seat.',
  'Hall ids are exactly GRID_ORDER (12). Refuse any other hall spawn.',
  'apollo is the council seat only. Music catalog uses apollo-music and am-* ids.',
  'meridian is EXTRA_COMPANY_ROUTES only. Never add it to GRID_ORDER or REVEAL_ORDER.',
  'bottleneckId, musicId, and merchId must never equal a hall id.',
  'Phénix display stays Phénix; id is phenix. phoenix is a forbidden alias.',
  'Hall merch SKUs stay {hall}-shirt and {hall}-jacket; collections are merch-{hall}.',
  'Meridian Carbon SKUs stay meridian-pants, meridian-shirt, meridian-jacket.',
  'Spawn is refused when todoKey already exists (exact match, case-sensitive).',
  'Cross-layer work must cite two keys. Never collapse music or merch into a hall todo.',
]

export const FOUNDER_QUEUE = [
  {
    id: 'fq-ratify-layer-keys',
    todoKey: 'bn:layer-key-collision',
    label: 'Ratify Three layers / Layer-key collision as canon',
    owner: 'Eason',
    note: 'Overnight agents may name and register. Only the founder locks canon.',
  },
  {
    id: 'fq-meridian-logo',
    todoKey: 'merch:meridian',
    label: 'Lock the Meridian mark',
    owner: 'Eason',
    note: 'Logo lock unblocks Apollo brand assets. Do not invent a locked mark in copy.',
  },
  {
    id: 'fq-apollo-music-deals',
    todoKey: 'music:apollo-music',
    label: 'Artist deals stay unsigned until the founder signs',
    owner: 'Eason',
    note: 'Do not announce Apollo Music artist deals as closed.',
  },
  {
    id: 'fq-eagle-spirit',
    todoKey: 'hall:eagle',
    label: 'Eagle / Spirit stays unsubstantiated',
    owner: 'Eason',
    note: 'No overnight copy may claim Spirit partnership or acquisition as confirmed.',
  },
]

const spawnedTodoKeys = new Set()

export function todoKey(layer, id) {
  const layerKey = String(layer || '').trim()
  const stableId = String(id || '').trim()
  if (!layerKey || !stableId) {
    throw new Error('todoKey requires layer and id')
  }
  if (!Object.hasOwn(LAYERS, layerKey)) {
    throw new Error(`unknown todo layer: ${layerKey}`)
  }
  return `${layerKey}:${stableId}`
}

export function isMosaicHallId(id) {
  return MOSAIC_HALL_IDS.includes(id)
}

export function assertNotHallAlias(id) {
  if (FORBIDDEN_HALL_IDS.includes(id)) {
    throw new Error(`${id} is not a mosaic hall id`)
  }
}

export function hallRow(hallId) {
  return HALL_ROWS.find((row) => row.hallId === hallId) || null
}

export function allTodoKeys() {
  const keys = [
    UNIFYING_BOTTLENECK.todoKey,
    APOLLO_MUSIC.todoKey,
    MERIDIAN_APPAREL.todoKey,
    todoKey('bn', APOLLO_MUSIC.bottleneckId),
    todoKey('bn', MERIDIAN_APPAREL.bottleneckId),
    todoKey('music', APOLLO_MUSIC.musicId),
    todoKey('music', APOLLO_MUSIC.launchThemeId),
    todoKey('merch', MERIDIAN_APPAREL.merchId),
    ...MERIDIAN_APPAREL.carbonSkus.map((sku) => todoKey('merch', sku)),
    ...HALL_ROWS.flatMap((row) => [
      todoKey('hall', row.hallId),
      todoKey('bn', row.bottleneckId),
      todoKey('music', row.musicId),
      todoKey('merch', row.merchId),
    ]),
  ]
  return keys
}

export function uniqueTodoKeys() {
  return [...new Set(allTodoKeys())]
}

/**
 * Overnight spawn gate. Returns the key on first use; throws on duplicate.
 */
export function spawnTodo(layer, id) {
  assertNotHallAlias(id)
  if (layer === 'hall' && !isMosaicHallId(id)) {
    throw new Error(`${id} is not a mosaic hall`)
  }
  const key = todoKey(layer, id)
  if (spawnedTodoKeys.has(key)) {
    throw new Error(`duplicate todo refused: ${key}`)
  }
  spawnedTodoKeys.add(key)
  return key
}

export function resetSpawnedTodos() {
  spawnedTodoKeys.clear()
}

export function bottleneckRecord(row) {
  const company = getCompany(row.hallId)
  return {
    id: row.bottleneckId,
    kind: 'hall',
    publicLabel: row.publicLabel,
    adminLabel: row.adminLabel,
    layer: LAYERS.hall,
    mosaic: true,
    hallId: row.hallId,
    hallName: company?.name || row.hallId,
    domain: company?.domain || null,
    pillar: company?.pillar || null,
    musicId: row.musicId,
    merchId: row.merchId,
    bottleneckId: row.bottleneckId,
    todoKey: todoKey('bn', row.bottleneckId),
    ownerSeat: 'seshat',
    status: 'named',
    note: row.note,
  }
}

export const REGISTRY_FIELDS = [
  'id',
  'kind',
  'publicLabel',
  'adminLabel',
  'layer',
  'mosaic',
  'hallId',
  'musicId',
  'merchId',
  'bottleneckId',
  'todoKey',
  'ownerSeat',
  'status',
  'note',
]

export function bottleneckRegistry() {
  return [
    UNIFYING_BOTTLENECK,
    APOLLO_MUSIC,
    MERIDIAN_APPAREL,
    ...HALL_ROWS.map(bottleneckRecord),
  ]
}

export function confirmMosaicIds() {
  const extra = EXTRA_COMPANY_ROUTES
  return {
    mosaic: MOSAIC_HALL_IDS,
    extra,
    meridianIsMosaic: getCompany('meridian')?.mosaic === true,
    apolloIsHall: isMosaicHallId('apollo') || isMosaicHallId('apollo-music'),
  }
}
