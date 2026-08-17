/**
 * One Civilization marks: hall + garment + anthem.
 * Merch marks are public (Meridian cuts, halls wear).
 * Music marks are interior until the founder authorizes an Apollo Music surface.
 * Do not ship a thirteenth company page for either layer.
 */

import { GRID_ORDER } from '../lib/companies.js'
import { hallMerch } from './meridianMerch.js'

export const APOLLO_MUSIC_PUBLIC = false
export const MERIDIAN_CUTTER = 'Meridian'

const BRAND = {
  wolf: {
    verb: 'moves',
    brandBottleneck: 'Land-transit OpCo vs the pack that moves',
    musicMark: 'Pack Crossing',
  },
  holm: {
    verb: 'stands',
    brandBottleneck: 'Housing company vs the house that stands on chosen terrain',
    musicMark: 'House Timber',
  },
  demeter: {
    verb: 'feeds',
    brandBottleneck: 'Energy company vs the acre that feeds',
    musicMark: 'Field Hymn',
  },
  viking: {
    verb: 'boards',
    brandBottleneck: 'Cruise company vs the deck that boards and returns',
    musicMark: 'Deck Saga',
  },
  atoll: {
    verb: 'begins',
    brandBottleneck: 'Floating-home company vs the shore where land ends',
    musicMark: 'Shore Tide',
  },
  njord: {
    verb: 'holds',
    brandBottleneck: 'Water utility OpCo vs the molecule the hall holds',
    musicMark: 'Water Deep',
  },
  eagle: {
    verb: 'rises',
    brandBottleneck: 'Airline OpCo vs flight that rises for the atmosphere',
    musicMark: 'Flight Rise',
  },
  olympus: {
    verb: 'homes',
    brandBottleneck: 'Cloud-city developer vs the first home above the clouds',
    musicMark: 'Cloud Calm',
  },
  aeolus: {
    verb: 'presses',
    brandBottleneck: 'Atmosphere-owner OpCo vs sky that presses and is fixed',
    musicMark: 'Sky Pressure',
  },
  phenix: {
    verb: 'returns',
    brandBottleneck: 'Aerospace company vs launch that dies and returns',
    musicMark: 'Launch Fire',
  },
  aether: {
    verb: 'marks',
    brandBottleneck: 'Real-estate company vs orbit the hall marks. Garment is Orbit, not Claim.',
    musicMark: 'Quiet Orbit',
  },
  corvus: {
    verb: 'runs',
    brandBottleneck: 'OpCo-mind vs the mind that runs the mosaic',
    musicMark: 'Mind Spine',
  },
}

function merchMarkFromHall(id) {
  const name = hallMerch[id]?.shirtName || ''
  return name.replace(/ Shirt$/, '')
}

export const HALL_MARKS = Object.fromEntries(
  GRID_ORDER.map((id) => [
    id,
    {
      ...BRAND[id],
      merchMark: merchMarkFromHall(id),
    },
  ]),
)

export function getHallMarks(companyId) {
  return HALL_MARKS[companyId] || null
}

export function mosaicHallMarks() {
  return GRID_ORDER.map((id) => ({ id, ...HALL_MARKS[id] }))
}
