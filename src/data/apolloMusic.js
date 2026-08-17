/**
 * Apollo Music for the twelve halls.
 * Catalog of hall sonic identities. List, not a cart. No player, no audio files.
 * Helios holds sonic doctrine. Apollo holds the public voice.
 */

import { GRID_ORDER, getCompany } from '../lib/companies.js'

export const MUSIC_STATUS = 'Apollo Music · composition, not released'
export const MUSIC_POSTURE =
  'This is the list, not a cart. No funds are taken for music on this surface. No player and no streaming storefront.'

export const hallMusic = {
  wolf: {
    statement: 'Wolf is scored by Apollo.',
    body: 'Pack Crossing is the land-movement mark. Identity list, not a released single.',
    trackName: 'Pack Crossing',
    does: 'Unreleased hall score for the corridor. Composition target, not a drop.',
  },
  viking: {
    statement: 'Viking is scored by Apollo.',
    body: 'Deck Saga is the water-movement mark. Identity list, not a ticketed soundtrack.',
    trackName: 'Deck Saga',
    does: 'Unreleased hall score for the voyage. Not a soundtrack sale.',
  },
  eagle: {
    statement: 'Eagle is scored by Apollo.',
    body: 'Flight Rise is the air-movement mark. Not a celebrity anthem.',
    trackName: 'Flight Rise',
    does: 'Unreleased hall score for the sky. No named celebrity consumer is attached.',
  },
  phenix: {
    statement: 'Phénix is scored by Apollo.',
    body: 'Launch Fire is the space-movement mark. Identity list, not a launch-day drop.',
    trackName: 'Launch Fire',
    does: 'Unreleased hall score for the pad. Not a launch booking cue.',
  },
  holm: {
    statement: 'Holm is scored by Apollo.',
    body: 'House Timber is the land-habitation mark. Identity list, not a sold album.',
    trackName: 'House Timber',
    does: 'Unreleased hall score for the build site. Not a sold album.',
  },
  atoll: {
    statement: 'Atoll is scored by Apollo.',
    body: 'Shore Tide is the water-habitation mark. Identity list, not a pre-sale.',
    trackName: 'Shore Tide',
    does: 'Unreleased hall score for the lagoon edge. Not a pre-sale.',
  },
  olympus: {
    statement: 'Olympus is scored by Apollo.',
    body: 'Cloud Calm is the air-habitation mark. Identity list, not a tourism soundtrack.',
    trackName: 'Cloud Calm',
    does: 'Unreleased hall score for the platform. Not a tourism ticket.',
  },
  aether: {
    statement: 'Aether is scored by Apollo.',
    body: 'Quiet Orbit is the space-habitation mark. Identity list, not a deed jingle.',
    trackName: 'Quiet Orbit',
    does: 'Unreleased hall score for quiet orbit. Not a deed or title cue.',
  },
  demeter: {
    statement: 'Demeter is scored by Apollo.',
    body: 'Field Hymn is the land-energy mark. Identity list, not a fundraise anthem.',
    trackName: 'Field Hymn',
    does: 'Unreleased hall score for the field. Not a fundraise anthem for sale.',
  },
  njord: {
    statement: 'Njord is scored by Apollo.',
    body: 'Water Deep is the water-energy mark. Identity list, not an output promise.',
    trackName: 'Water Deep',
    does: 'Unreleased hall score for H2O. Not an output promise.',
  },
  aeolus: {
    statement: 'Aeolus is scored by Apollo.',
    body: 'Sky Pressure is the air-energy mark. Identity list, not a rights sale.',
    trackName: 'Sky Pressure',
    does: 'Unreleased hall score for the atmosphere. Not a rights sale.',
  },
  corvus: {
    statement: 'Corvus is scored by Apollo.',
    body: 'Mind Spine is the intelligence mark. Identity list, not a product unlock.',
    trackName: 'Mind Spine',
    does: 'Unreleased hall score for the spine. Not a product unlock.',
  },
}

export const apolloHouseAnnouncement = {
  statement: 'Apollo Music scores every hall.',
  body: 'One sonic identity per hall. Composition targets, not released singles. Archive mentioned an August 16 announce; unverified, this list does not claim it shipped.',
}

function hallTrack(companyId) {
  const company = getCompany(companyId)
  const hall = hallMusic[companyId]
  return {
    id: `${companyId}-anthem`,
    sku: 'anthem',
    companyId,
    hallName: company.name,
    name: hall.trackName,
    piece: 'anthem',
    does: hall.does,
    imageSrc: company.imageSrc,
    statement: hall.statement,
    href: `/${companyId}/music/anthem`,
    house: 'Apollo Music',
    status: MUSIC_STATUS,
    audioSrc: null,
  }
}

export const apolloHouseTracks = [
  {
    id: 'apollo-music-house',
    sku: 'house',
    companyId: 'apollo-music',
    hallName: 'Apollo Music',
    name: 'One Civilization',
    piece: 'house',
    does: 'House mark for the mosaic. Listed as identity, not as a confirmed public drop.',
    imageSrc: '/images/placeholders/default.svg',
    statement: apolloHouseAnnouncement.statement,
    href: '/music/house',
    house: 'Apollo Music',
    status: MUSIC_STATUS,
    audioSrc: null,
  },
]

export function getMusicAnnouncement(companyId) {
  if (companyId === 'apollo-music' || companyId === 'music') return apolloHouseAnnouncement
  const hall = hallMusic[companyId]
  if (!hall) return null
  return { statement: hall.statement, body: hall.body }
}

export function musicItemsForCompany(companyId) {
  if (companyId === 'apollo-music' || companyId === 'music') return apolloHouseTracks
  if (!hallMusic[companyId]) return []
  return [hallTrack(companyId)]
}

export function getMusicItem(companyId, sku) {
  const id = companyId === 'music' ? 'apollo-music' : companyId
  return musicItemsForCompany(id).find((item) => item.sku === sku) || null
}

export function allHallMusic() {
  return GRID_ORDER.flatMap((id) => musicItemsForCompany(id))
}

export function allMusicItems() {
  return [...apolloHouseTracks, ...allHallMusic()]
}

export function mosaicHallsWithMusic() {
  return GRID_ORDER.map((id) => {
    const company = getCompany(id)
    const announcement = getMusicAnnouncement(id)
    return {
      id,
      name: company.name,
      domain: company.domain,
      imageSrc: company.imageSrc,
      announcement,
      items: musicItemsForCompany(id),
      href: `/${id}#music`,
      shopHref: `/${id}/music`,
    }
  })
}

export function musicCompleteForHall(id) {
  const items = musicItemsForCompany(id)
  return items.length >= 1 && items.every((item) => item.sku && item.house === 'Apollo Music')
}
