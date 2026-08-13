/**
 * Single source of truth for Valhalla reveal + click timing.
 *
 * Wave 1 (Wolf → Njord): time chain
 * - Hub countdown hits 0 at EVENT_START → Wolf tile becomes clickable.
 * - On each open company site, a 1-hour countdown runs to the next hall.
 * - When that countdown hits 0, the next name becomes a clickable link.
 * - 30 minutes later, that next hall's tile becomes clickable on the mosaic.
 *
 * After Njord: break until WAVE2_START (2:00 PM PDT).
 *
 * Wave 2 (Eagle → Corvus): Instagram unlock codes (server-validated).
 * - Codes published on Valhalla Instagram; enter on hub / locked hall page.
 * - Sequential: unlock Eagle before Olympus, etc.
 */

import { REVEAL_ORDER } from './companies'

export const EVENT_START_ISO = '2026-08-13T08:00:00-07:00'

/** How long the next-door blank countdown runs on an open company site. */
export const PREVIEW_COUNTDOWN_MS = 60 * 60 * 1000

/** How long after the previous-site link appears before the mosaic tile unlocks. */
export const HUB_AFTER_PREVIEW_MS = 30 * 60 * 1000

export const BUILD_DURATION_MS = 15 * 1000
export const VEIL_DURATION_MS = 2 * 1000

/** @deprecated kept for older imports */
export const CLICK_DELAY_MS = 0
export const REVEAL_INTERVAL_MS = PREVIEW_COUNTDOWN_MS

/** Break after Njord ends here — wave-2 Instagram codes become available. */
export const WAVE2_START_ISO = '2026-08-13T14:00:00-07:00'

export const WAVE1_ORDER = ['wolf', 'holm', 'demeter', 'viking', 'atoll', 'njord']
export const WAVE2_ORDER = ['eagle', 'olympus', 'aeolus', 'phenix', 'aether', 'corvus']

export const INSTAGRAM_URL = 'https://www.instagram.com/valhallaco/'

export function getEventStart() {
  return new Date(EVENT_START_ISO)
}

export function getWave2Start() {
  return new Date(WAVE2_START_ISO)
}

export function isWave2Hall(companyId) {
  return WAVE2_ORDER.includes(companyId)
}

export function isWave1Hall(companyId) {
  return WAVE1_ORDER.includes(companyId)
}

function revealIndex(companyId) {
  const idx = REVEAL_ORDER.indexOf(companyId)
  if (idx < 0) throw new Error(`Unknown company schedule: ${companyId}`)
  return idx
}

/**
 * When this company becomes reachable as a link from the previous hall.
 * Wolf has no previous hall — equals event start.
 * Wave-2 halls do not auto-open by time; use code unlocks instead.
 *
 * preview[i] = EVENT_START + i × 60 minutes  (wave 1 only)
 */
export function getPreviewUnlockAt(companyId) {
  if (isWave2Hall(companyId)) return getWave2Start()
  const idx = revealIndex(companyId)
  return new Date(getEventStart().getTime() + idx * PREVIEW_COUNTDOWN_MS)
}

/**
 * When this company's mosaic tile becomes clickable (wave 1).
 * Wave 2: returns WAVE2_START as the earliest code-entry time; actual click needs unlock.
 */
export function getHubClickAt(companyId) {
  if (isWave2Hall(companyId)) return getWave2Start()
  const idx = revealIndex(companyId)
  if (idx === 0) return getEventStart()
  return new Date(getPreviewUnlockAt(companyId).getTime() + HUB_AFTER_PREVIEW_MS)
}

/** Previous company in the reveal chain, or null for Wolf. */
export function getPreviousCompanyId(companyId) {
  const idx = revealIndex(companyId)
  return idx > 0 ? REVEAL_ORDER[idx - 1] : null
}

/** Next company in the reveal chain, or null for Corvus. */
export function getNextCompanyId(companyId) {
  const idx = revealIndex(companyId)
  return idx >= 0 && idx < REVEAL_ORDER.length - 1 ? REVEAL_ORDER[idx + 1] : null
}

/**
 * On `fromCompanyId`'s site: when the next hall's name stops being a blank
 * and becomes a clickable word. Wave 2 next halls never auto-unlock by time.
 */
export function getNextPreviewUnlockAt(fromCompanyId) {
  const nextId = getNextCompanyId(fromCompanyId)
  if (!nextId) return null
  if (isWave2Hall(nextId)) return null
  return getPreviewUnlockAt(nextId)
}

export function getFrameCompleteAt(companyId) {
  return getHubClickAt(companyId)
}

export function getConstructionStartAt(companyId) {
  return new Date(getHubClickAt(companyId).getTime() - BUILD_DURATION_MS)
}

export function getRevealAt(companyId) {
  return getHubClickAt(companyId)
}

export function getClickEnabledAt(companyId) {
  return getHubClickAt(companyId)
}

/**
 * Next wave-2 hall that still needs a code, or null if all unlocked / before window.
 */
export function getNextCodeHall(unlockedSet, now) {
  if (now.getTime() < getWave2Start().getTime()) return null
  const set = unlockedSet instanceof Set ? unlockedSet : new Set(unlockedSet || [])
  for (const id of WAVE2_ORDER) {
    if (!set.has(id)) return id
  }
  return null
}

export function canAttemptCode(hallId, unlockedSet, now) {
  if (!isWave2Hall(hallId)) return false
  if (now.getTime() < getWave2Start().getTime()) return false
  const set = unlockedSet instanceof Set ? unlockedSet : new Set(unlockedSet || [])
  const idx = WAVE2_ORDER.indexOf(hallId)
  for (let i = 0; i < idx; i += 1) {
    if (!set.has(WAVE2_ORDER[i])) return false
  }
  return !set.has(hallId)
}

/**
 * Portal phases for the mosaic:
 * dormant → constructing → revealed → clickable
 * Wave-2 halls stay dormant until their Instagram code is unlocked.
 */
export function getPortalPhase(companyId, now, unlockedSet = new Set()) {
  if (isWave2Hall(companyId)) {
    const set = unlockedSet instanceof Set ? unlockedSet : new Set(unlockedSet || [])
    return set.has(companyId) ? 'clickable' : 'dormant'
  }

  const t = now.getTime()
  const buildStart = getConstructionStartAt(companyId).getTime()
  const reveal = getRevealAt(companyId).getTime()
  const clickAt = getClickEnabledAt(companyId).getTime()

  if (t < buildStart) return 'dormant'
  if (t < reveal) return 'constructing'
  if (t < clickAt) return 'revealed'
  return 'clickable'
}

/** Site is open once the previous hall's next-door link has unlocked (wave 1) or code (wave 2). */
export function isCompanySiteOpen(companyId, now, unlockedSet = new Set()) {
  if (isWave2Hall(companyId)) {
    const set = unlockedSet instanceof Set ? unlockedSet : new Set(unlockedSet || [])
    return set.has(companyId)
  }
  return now.getTime() >= getPreviewUnlockAt(companyId).getTime()
}

/** Mosaic tile may be clicked only after hub unlock (wave 1) or code (wave 2). */
export function isHubTileClickable(companyId, now, unlockedSet = new Set()) {
  if (isWave2Hall(companyId)) {
    const set = unlockedSet instanceof Set ? unlockedSet : new Set(unlockedSet || [])
    return set.has(companyId)
  }
  return now.getTime() >= getHubClickAt(companyId).getTime()
}

export function getBuildProgress(companyId, now, unlockedSet = new Set()) {
  if (isWave2Hall(companyId)) {
    const set = unlockedSet instanceof Set ? unlockedSet : new Set(unlockedSet || [])
    return set.has(companyId) ? 1 : 0
  }
  const t = now.getTime()
  const start = getConstructionStartAt(companyId).getTime()
  const end = getFrameCompleteAt(companyId).getTime()
  if (t <= start) return 0
  if (t >= end) return 1
  return (t - start) / (end - start)
}

export function enrichCompany(company) {
  return {
    ...company,
    frameCompleteAt: getFrameCompleteAt(company.id).toISOString(),
    revealAt: getRevealAt(company.id).toISOString(),
    clickEnabledAt: getClickEnabledAt(company.id).toISOString(),
    constructionStartAt: getConstructionStartAt(company.id).toISOString(),
    previewUnlockAt: getPreviewUnlockAt(company.id).toISOString(),
    hubClickAt: getHubClickAt(company.id).toISOString(),
    requiresCode: isWave2Hall(company.id),
  }
}
