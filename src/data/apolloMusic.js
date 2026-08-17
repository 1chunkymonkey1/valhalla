/**
 * Apollo Music: public list of hall sonic identities.
 * Helios owns sonic-universe doctrine. Apollo owns this public surface.
 * Catalog, not a cart and not a stream. No audio player. No fake plays.
 * Archive dated an August 16 announce; that date is not a public fact of shipment.
 */

import { GRID_ORDER, getCompany } from '../lib/companies.js'
import { hallMerch } from './meridianMerch.js'

export const MUSIC_STATUS = 'Hall identities · named tracks held'
export const MUSIC_POSTURE =
  'This is the catalog, not a cart and not a stream. No funds and no play counts on this surface.'

export const MUSIC_DOCTRINE = {
  helios: 'Helios holds sonic universe doctrine.',
  apollo: 'Apollo holds the public list and the voice.',
  meridian: 'Meridian cuts the garment. Apollo names the air around it.',
}

export const MUSIC_FORBIDDEN_PUBLIC = [
  /\bsigned (artists?|acts?|labels?)\b/i,
  /\bnow streaming\b/i,
  /\bmonthly listeners\b/i,
  /\b\d[\d,.]*\s*(streams?|plays|listeners)\b/i,
  /\bavailable on (spotify|apple music|youtube music|tidal|soundcloud)\b/i,
  /\bapollo music (is|went|has) (live|launched|announced)\b/i,
  /\blaunch theme (dropped|drops|is live|shipped)\b/i,
  /\bbuy now\b/i,
  /\badd to cart\b/i,
  /\bcheckout\b/i,
  /\blicensed (from|with)\b/i,
  /\bspirit airlines\b/i,
  /\btaylor swift\b/i,
]

const HALLS = {
  wolf: {
    epithet: 'Pack Crossing',
    body: 'Iron on granite. The pack keeps time on the corridor.',
    does: 'Unreleased hall score for the corridor. Composition target, not a drop.',
    doNotClaim: 'no I-80 soundtrack drop, no licensed ritual-folk deal, no streaming counts',
  },
  holm: {
    epithet: 'House Timber',
    body: 'Timber and sod. A measure you can live inside.',
    does: 'Unreleased hall score for the build site. Not a sold album.',
    doNotClaim: 'no housing album, no sold home anthem, no streaming counts',
  },
  demeter: {
    epithet: 'Field Hymn',
    body: 'Soil and gold pollen. The acre sung, not sold as a single.',
    does: 'Unreleased hall score for the field. Not a fundraise anthem for sale.',
    doNotClaim: 'no harvest single, no signed hymn act, no streaming counts',
  },
  viking: {
    epithet: 'Deck Saga',
    body: 'Wet bronze and rope. The voyage keeps a walking pulse.',
    does: 'Unreleased hall score for the voyage. Not a soundtrack sale.',
    doNotClaim: 'no Ragnar drop, no closed folk-ritual artist deal, no streaming counts',
  },
  atoll: {
    epithet: 'Shore Tide',
    body: 'Warm shallows. Shore cloth and a held breath.',
    does: 'Unreleased hall score for the lagoon edge. Not a pre-sale.',
    doNotClaim: 'no pre-sale soundtrack, no Atoll live album, no streaming counts',
  },
  njord: {
    epithet: 'Water Deep',
    body: 'Cold mist over engineered water. The molecule has a tone, not a title for sale.',
    does: 'Unreleased hall score for H2O. Not an output promise.',
    doNotClaim: 'no water-ownership single, no DSP title claiming every molecule, no streaming counts',
  },
  eagle: {
    epithet: 'Flight Rise',
    body: 'White metal and clear air. A line through weather, not a ticket.',
    does: 'Unreleased hall score for the sky. No named celebrity consumer is attached.',
    doNotClaim: 'no Spirit Airlines, no Taylor Swift, no flight-schedule anthem, no streaming counts',
  },
  olympus: {
    epithet: 'Cloud Calm',
    body: 'Glass and vapor. The platform holds a quiet interval.',
    does: 'Unreleased hall score for the platform. Not a tourism ticket.',
    doNotClaim: 'no first-home single, no 2028 release date, no streaming counts',
  },
  aeolus: {
    epithet: 'Sky Pressure',
    body: 'Wind as a field, not a chart. Instruments stay unnamed.',
    does: 'Unreleased hall score for the atmosphere. Not a rights sale.',
    doNotClaim: 'no weather-product sonification for sale, no atmospheric-rights song, no streaming counts',
  },
  phenix: {
    epithet: 'Launch Fire',
    body: 'Copper heat and volcanic dust. Ascent held at the threshold.',
    does: 'Unreleased hall score for the pad. Not a launch booking cue.',
    doNotClaim: 'no August 12 launch-theme drop, no Tomorrow caption as a public release, no streaming counts',
  },
  aether: {
    epithet: 'Claim Quiet',
    body: 'Soft silver over indigo. Rooms above the curve, not a deed set to music.',
    does: 'Unreleased hall score for quiet orbit. Not a deed or title cue.',
    doNotClaim: 'no territorial anthem for sale, no deeds or parcels as tracks, no streaming counts',
  },
  corvus: {
    epithet: 'Mind Spine',
    body: 'Obsidian and warm amber. The spine thinks in the dark.',
    does: 'Unreleased hall score for the spine. Not a product unlock.',
    doNotClaim: 'no Raven OS theme as a paid prompt, no 21-track ladder, no streaming counts',
  },
}

function merchTie(companyId) {
  const merch = hallMerch[companyId]
  return `${merch.shirtName} + ${merch.jacketName}`
}

function hallRecord(companyId) {
  const company = getCompany(companyId)
  const spec = HALLS[companyId]
  const merch = hallMerch[companyId]
  return {
    id: `${companyId}-anthem`,
    sku: 'anthem',
    companyId,
    hallName: company.name,
    domain: company.domain,
    epithet: spec.epithet,
    name: spec.epithet,
    trackName: spec.epithet,
    piece: 'anthem',
    statement: `${company.name} sounds as ${spec.epithet}.`,
    body: spec.body,
    does: spec.does,
    merchTie: merchTie(companyId),
    merchStatement: merch.statement,
    merchHref: `/${companyId}/merch`,
    shirtName: merch.shirtName,
    jacketName: merch.jacketName,
    doNotClaim: spec.doNotClaim,
    imageSrc: company.imageSrc,
    href: `/${companyId}/music/anthem`,
    catalogHref: `/${companyId}/music`,
    house: 'Apollo Music',
    status: MUSIC_STATUS,
    audioSrc: null,
  }
}

export const hallMusic = Object.fromEntries(
  GRID_ORDER.map((id) => {
    const hall = hallRecord(id)
    return [
      id,
      {
        statement: hall.statement,
        body: hall.body,
        trackName: hall.epithet,
        does: hall.does,
      },
    ]
  }),
)

export const apolloHouseAnnouncement = {
  statement: 'Apollo Music names the air around every hall.',
  body: 'One sonic identity per hall. Composition targets, not public drops. Archive mentioned an August 16 announce; unverified, this list does not claim it shipped.',
}

export const civilizationHeld = {
  epithet: 'One Civilization',
  statement: apolloHouseAnnouncement.statement,
  body: apolloHouseAnnouncement.body,
  status: MUSIC_STATUS,
}

export const apolloHouseTracks = [
  {
    id: 'apollo-music-house',
    sku: 'house',
    companyId: 'apollo-music',
    hallName: 'Apollo Music',
    epithet: 'One Civilization',
    name: 'One Civilization',
    piece: 'house',
    does: 'House mark for the mosaic. Listed as identity, not as a confirmed public drop.',
    body: apolloHouseAnnouncement.body,
    statement: apolloHouseAnnouncement.statement,
    merchTie: null,
    merchHref: '/meridian/merch',
    imageSrc: '/images/placeholders/default.svg',
    href: '/music/house',
    catalogHref: '/music',
    house: 'Apollo Music',
    status: MUSIC_STATUS,
    audioSrc: null,
    doNotClaim: 'no August 16 ship claim, no streaming counts, no closed artist deals',
  },
]

export function getHallMusic(companyId) {
  if (!HALLS[companyId]) return null
  return hallRecord(companyId)
}

export function getMusicAnnouncement(companyId) {
  if (companyId === 'apollo-music' || companyId === 'music') return apolloHouseAnnouncement
  if (companyId === 'meridian') {
    return {
      statement: MUSIC_DOCTRINE.meridian,
      body: 'Cloth and anthem share one hall mark. Open the catalog, not a stream.',
    }
  }
  const hall = getHallMusic(companyId)
  if (!hall) return null
  return { statement: hall.statement, body: hall.body }
}

export function musicItemsForCompany(companyId) {
  if (companyId === 'apollo-music' || companyId === 'music') return apolloHouseTracks
  if (companyId === 'meridian') return []
  const hall = getHallMusic(companyId)
  return hall ? [hall] : []
}

export function getMusicItem(companyId, sku) {
  const id = companyId === 'music' ? 'apollo-music' : companyId
  return musicItemsForCompany(id).find((item) => item.sku === sku) || null
}

export function allHallMusic() {
  return GRID_ORDER.map((id) => getHallMusic(id))
}

export function allMusicItems() {
  return [...apolloHouseTracks, ...allHallMusic()]
}

export function mosaicHallsWithMusic() {
  return allHallMusic().map((hall) => ({
    id: hall.companyId,
    name: hall.hallName,
    domain: hall.domain,
    imageSrc: hall.imageSrc,
    epithet: hall.epithet,
    announcement: { statement: hall.statement, body: hall.body },
    items: [hall],
    merchTie: hall.merchTie,
    href: `/${hall.companyId}#music`,
    shopHref: hall.catalogHref,
  }))
}

export function musicCompleteForHall(id) {
  const items = musicItemsForCompany(id)
  return items.length >= 1 && items.every((item) => item.sku && item.house === 'Apollo Music')
}

export function publicMusicCopy() {
  const held = [
    civilizationHeld.epithet,
    civilizationHeld.statement,
    civilizationHeld.body,
    MUSIC_POSTURE,
    MUSIC_STATUS,
    MUSIC_DOCTRINE.helios,
    MUSIC_DOCTRINE.apollo,
    MUSIC_DOCTRINE.meridian,
    apolloHouseTracks[0].does,
  ]
  const halls = allHallMusic().flatMap((h) => [
    h.epithet,
    h.statement,
    h.body,
    h.does,
    h.merchTie,
    h.merchStatement,
  ])
  return [...held, ...halls].join('\n')
}
