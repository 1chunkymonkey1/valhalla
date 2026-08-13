/**
 * Single source of truth for Valhalla reveal + click timing.
 *
 * Chain model (PDT):
 * - Hub countdown hits 0 at EVENT_START → Wolf tile becomes clickable on the mosaic.
 * - On each open company site, a 1-hour countdown runs to the next hall's name.
 * - When that countdown hits 0, the next name becomes a clickable link on that site
 *   (and that next site becomes reachable).
 * - 30 minutes later, that next hall's tile becomes clickable on the mosaic.
 *
 * Wolf → Holm example:
 *   8:00  Wolf hub-clickable; Wolf page starts 1h countdown
 *   9:00  "Holm" link appears on Wolf; Holm site opens via that link
 *   9:30  Holm tile becomes clickable on the mosaic
 *   …same +60m preview / +30m hub lag continues down REVEAL_ORDER.
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
export const WAVE2_START_ISO = '2026-08-13T14:00:00-07:00'

export function getEventStart() {
  return new Date(EVENT_START_ISO)
}

export function getWave2Start() {
  return new Date(WAVE2_START_ISO)
}

function revealIndex(companyId) {
  const idx = REVEAL_ORDER.indexOf(companyId)
  if (idx < 0) throw new Error(`Unknown company schedule: ${companyId}`)
  return idx
}

/**
 * When this company becomes reachable as a link from the previous hall.
 * Wolf has no previous hall — equals event start.
 *
 * preview[i] = EVENT_START + i × 60 minutes
 */
export function getPreviewUnlockAt(companyId) {
  const idx = revealIndex(companyId)
  return new Date(getEventStart().getTime() + idx * PREVIEW_COUNTDOWN_MS)
}

/**
 * When this company's mosaic tile becomes clickable.
 * Wolf: event start. Everyone else: 30 minutes after their preview link appears.
 */
export function getHubClickAt(companyId) {
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
 * and becomes a clickable word.
 */
export function getNextPreviewUnlockAt(fromCompanyId) {
  const nextId = getNextCompanyId(fromCompanyId)
  if (!nextId) return null
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
 * Portal phases for the mosaic:
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

/** Site is open once the previous hall's next-door link has unlocked. */
export function isCompanySiteOpen(companyId, now) {
  return now.getTime() >= getPreviewUnlockAt(companyId).getTime()
}

/** Mosaic tile may be clicked only after hub unlock. */
export function isHubTileClickable(companyId, now) {
  return now.getTime() >= getHubClickAt(companyId).getTime()
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
  return {
    ...company,
    frameCompleteAt: getFrameCompleteAt(company.id).toISOString(),
    revealAt: getRevealAt(company.id).toISOString(),
    clickEnabledAt: getClickEnabledAt(company.id).toISOString(),
    constructionStartAt: getConstructionStartAt(company.id).toISOString(),
    previewUnlockAt: getPreviewUnlockAt(company.id).toISOString(),
    hubClickAt: getHubClickAt(company.id).toISOString(),
  }
}
