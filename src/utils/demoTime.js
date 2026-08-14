import { EVENT_START } from '../data/schedule'
import { getClockMode, isDemoAuthorized } from '../lib/simulationClock'

export const DEMO_RATE = 100
/** Simulated clock starts with 1 hour until Wolf / event open */
export const DEMO_START_BEFORE_MS = 60 * 60 * 1000

const SESSION_KEY = 'valhalla_demo_session_start'

/** Legacy helper — demo only when founder admin session authorizes the sim clock. */
export function isDemoMode() {
  if (typeof window === 'undefined') return false
  if (!isDemoAuthorized()) return false
  return getClockMode() === 'demo'
}

/** Wall-clock moment when this demo session began */
export function getDemoSessionStart() {
  if (typeof window === 'undefined') return Date.now()
  try {
    let start = localStorage.getItem(SESSION_KEY)
    if (!start) {
      start = String(Date.now())
      localStorage.setItem(SESSION_KEY, start)
    }
    return Number(start)
  } catch {
    return Date.now()
  }
}

export function resetDemoSession() {
  if (typeof window === 'undefined') return
  localStorage.setItem(SESSION_KEY, String(Date.now()))
}

/** Simulated “now” advancing DEMO_RATE × faster from (event − 1h). */
export function getDemoNow(wallNow = Date.now()) {
  const simOrigin = new Date(EVENT_START).getTime() - DEMO_START_BEFORE_MS
  const elapsedWall = wallNow - getDemoSessionStart()
  return new Date(simOrigin + elapsedWall * DEMO_RATE)
}

/** Slugs with real art installed, others use themed placeholders. */
export const READY_BRANDS = new Set(['wolf'])

export function hasBrandArt(slug) {
  return READY_BRANDS.has(slug)
}
