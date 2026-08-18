/**
 * One Civilization marks: hall + garment + anthem.
 * Merch marks are public (Meridian cuts, halls wear).
 * Music marks are interior until the founder authorizes an Apollo Music surface.
 * Do not ship a thirteenth company page for either layer.
 */

import { GRID_ORDER } from '../lib/companies.js'

export const APOLLO_MUSIC_PUBLIC = false
export const MERIDIAN_CUTTER = 'Meridian'

export const HALL_MARKS = {
  wolf: {
    verb: 'moves',
    brandBottleneck: 'Land-transit OpCo vs the pack that moves',
    musicMark: 'Pack Crossing',
    merchMark: 'Pack',
  },
  holm: {
    verb: 'stands',
    brandBottleneck: 'Housing company vs the house that stands on chosen terrain',
    musicMark: 'House Timber',
    merchMark: 'House',
  },
  demeter: {
    verb: 'feeds',
    brandBottleneck: 'Energy company vs the acre that feeds',
    musicMark: 'Field Hymn',
    merchMark: 'Field',
  },
  viking: {
    verb: 'boards',
    brandBottleneck: 'Cruise company vs the deck that boards and returns',
    musicMark: 'Deck Saga',
    merchMark: 'Deck',
  },
  atoll: {
    verb: 'begins',
    brandBottleneck: 'Floating-home company vs the shore where land ends',
    musicMark: 'Shore Tide',
    merchMark: 'Shore',
  },
  njord: {
    verb: 'holds',
    brandBottleneck: 'Water utility OpCo vs the molecule the hall holds',
    musicMark: 'Water Deep',
    merchMark: 'Water',
  },
  eagle: {
    verb: 'rises',
    brandBottleneck: 'Airline OpCo vs flight that rises for the atmosphere',
    musicMark: 'Flight Rise',
    merchMark: 'Flight',
  },
  olympus: {
    verb: 'homes',
    brandBottleneck: 'Cloud-city developer vs the first home above the clouds',
    musicMark: 'Cloud Calm',
    merchMark: 'Cloud',
  },
  aeolus: {
    verb: 'presses',
    brandBottleneck: 'Atmosphere-owner OpCo vs sky that presses and is fixed',
    musicMark: 'Sky Pressure',
    merchMark: 'Sky',
  },
  phenix: {
    verb: 'returns',
    brandBottleneck: 'Aerospace company vs launch that dies and returns',
    musicMark: 'Launch Fire',
    merchMark: 'Launch',
  },
  aether: {
    verb: 'marks',
    brandBottleneck: 'Real-estate company vs orbit the hall marks. Garment is Orbit, not Claim.',
    musicMark: 'Quiet Orbit',
    merchMark: 'Orbit',
  },
  corvus: {
    verb: 'runs',
    brandBottleneck: 'OpCo-mind vs the mind that runs the mosaic',
    musicMark: 'Mind Spine',
    merchMark: 'Mind',
  },
}

export function getHallMarks(companyId) {
  return HALL_MARKS[companyId] || null
}

export function mosaicHallMarks() {
  return GRID_ORDER.map((id) => ({ id, ...HALL_MARKS[id] }))
}
