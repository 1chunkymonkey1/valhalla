/**
 * Single source of truth for Valhalla reveal timing.
 *
 * Assumptions encoded here:
 * - EVENT_START (T=0) = 2026-08-13 08:00:00 PDT (−07:00)
 * - Wave 1 frame-complete cadence (relative to EVENT_START):
 *     Wolf −40m, Holm −20m, Demeter 0, Viking +20m, Atoll +40m, Njord +60m
 * - Wave 2 begins 2026-08-13 14:00:00 PDT with the same 20-minute steps:
 *     Eagle, Olympus, Aeolus, Phenix, Aether, Corvus
 * - Construction ritual length: 15s at live speed (midpoint of 12–18s)
 * - Image reveal = frameCompleteAt
 * - Click cue = frameCompleteAt + 5s
 */

export const EVENT_START_ISO = '2026-08-13T08:00:00-07:00'
export const WAVE2_START_ISO = '2026-08-13T14:00:00-07:00'

export const REVEAL_INTERVAL_MS = 20 * 60 * 1000
export const BUILD_DURATION_MS = 15 * 1000
export const CLICK_DELAY_MS = 5 * 1000
export const VEIL_DURATION_MS = 2 * 1000

/** Wave 1 offsets from EVENT_START for frameCompleteAt */
const WAVE1_OFFSETS_MS = {
  wolf: -40 * 60 * 1000,
  holm: -20 * 60 * 1000,
  demeter: 0,
  viking: 20 * 60 * 1000,
  atoll: 40 * 60 * 1000,
  njord: 60 * 60 * 1000,
}

/** Wave 2 offsets from WAVE2_START for frameCompleteAt */
const WAVE2_OFFSETS_MS = {
  eagle: 0,
  olympus: 20 * 60 * 1000,
  aeolus: 40 * 60 * 1000,
  phenix: 60 * 60 * 1000,
  aether: 80 * 60 * 1000,
  corvus: 100 * 60 * 1000,
}

export function getEventStart() {
  return new Date(EVENT_START_ISO)
}

export function getWave2Start() {
  return new Date(WAVE2_START_ISO)
}

export function getFrameCompleteAt(companyId) {
  if (companyId in WAVE1_OFFSETS_MS) {
    return new Date(getEventStart().getTime() + WAVE1_OFFSETS_MS[companyId])
  }
  if (companyId in WAVE2_OFFSETS_MS) {
    return new Date(getWave2Start().getTime() + WAVE2_OFFSETS_MS[companyId])
  }
  throw new Error(`Unknown company schedule: ${companyId}`)
}

export function getConstructionStartAt(companyId) {
  return new Date(getFrameCompleteAt(companyId).getTime() - BUILD_DURATION_MS)
}

export function getRevealAt(companyId) {
  return getFrameCompleteAt(companyId)
}

export function getClickEnabledAt(companyId) {
  return new Date(getFrameCompleteAt(companyId).getTime() + CLICK_DELAY_MS)
}

/**
 * Portal phases for Phase 1 (simple state machine).
 * dormant → constructing → revealed → clickable
 */
export function getPortalPhase(companyId, now) {
  const t = now.getTime()
  const buildStart = getConstructionStartAt(companyId).getTime()
  const reveal = getRevealAt(companyId).getTime()
  const clickAt = getClickEnabledAt(companyId).getTime()

  if (t < buildStart) return 'dormant'
  if (t < reveal) return 'constructing'
  if (t < clickAt) return 'revealed'
  return 'clickable'
}

export function getBuildProgress(companyId, now) {
  const t = now.getTime()
  const start = getConstructionStartAt(companyId).getTime()
  const end = getFrameCompleteAt(companyId).getTime()
  if (t <= start) return 0
  if (t >= end) return 1
  return (t - start) / (end - start)
}

export function enrichCompany(company) {
  const frameCompleteAt = getFrameCompleteAt(company.id)
  return {
    ...company,
    frameCompleteAt: frameCompleteAt.toISOString(),
    revealAt: getRevealAt(company.id).toISOString(),
    clickEnabledAt: getClickEnabledAt(company.id).toISOString(),
    constructionStartAt: getConstructionStartAt(company.id).toISOString(),
  }
}
