/**
 * One Civilization marks: hall + garment + anthem.
 * Merch marks are public (Meridian cuts, halls wear).
 * Music marks are interior until the founder authorizes an Apollo Music surface.
 */

import { GRID_ORDER } from '../lib/companies.js'

export const APOLLO_MUSIC_PUBLIC = false
export const MERIDIAN_CUTTER = 'Meridian'

export const HALL_MARKS = {
  wolf: { verb: 'moves', musicMark: 'Pack Crossing', merchMark: 'Pack' },
  holm: { verb: 'stands', musicMark: 'House Timber', merchMark: 'House' },
  demeter: { verb: 'feeds', musicMark: 'Field Hymn', merchMark: 'Field' },
  viking: { verb: 'boards', musicMark: 'Deck Saga', merchMark: 'Deck' },
  atoll: { verb: 'begins', musicMark: 'Shore Tide', merchMark: 'Shore' },
  njord: { verb: 'holds', musicMark: 'Water Deep', merchMark: 'Water' },
  eagle: { verb: 'rises', musicMark: 'Flight Rise', merchMark: 'Flight' },
  olympus: { verb: 'homes', musicMark: 'Cloud Calm', merchMark: 'Cloud' },
  aeolus: { verb: 'presses', musicMark: 'Sky Pressure', merchMark: 'Sky' },
  phenix: { verb: 'returns', musicMark: 'Launch Fire', merchMark: 'Launch' },
  aether: { verb: 'claims', musicMark: 'Quiet Orbit', merchMark: 'Orbit' },
  corvus: { verb: 'runs', musicMark: 'Mind Spine', merchMark: 'Mind' },
}

export function getHallMarks(companyId) {
  return HALL_MARKS[companyId] || null
}

export function mosaicHallMarks() {
  return GRID_ORDER.map((id) => ({ id, ...HALL_MARKS[id] }))
}
