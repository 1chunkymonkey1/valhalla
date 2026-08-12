import { getEventStart } from './launchSchedule'

export const DEMO_RATE = 100
export const DEMO_START_BEFORE_MS = 60 * 60 * 1000 // T−01:00:00

const MODE_KEY = 'valhalla_clock_mode'
const SESSION_KEY = 'valhalla_demo_session_wall'

export function getClockMode() {
  if (typeof window === 'undefined') return 'live'
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.get('demo') === '1') {
      localStorage.setItem(MODE_KEY, 'demo')
      return 'demo'
    }
    if (params.get('demo') === '0') {
      localStorage.setItem(MODE_KEY, 'live')
      return 'live'
    }
    return localStorage.getItem(MODE_KEY) === 'demo' ? 'demo' : 'live'
  } catch {
    return 'live'
  }
}

export function setClockMode(mode) {
  if (typeof window === 'undefined') return
  localStorage.setItem(MODE_KEY, mode === 'demo' ? 'demo' : 'live')
  if (mode === 'demo') {
    localStorage.setItem(SESSION_KEY, String(Date.now()))
  }
}

export function resetDemoSession() {
  if (typeof window === 'undefined') return
  localStorage.setItem(SESSION_KEY, String(Date.now()))
  localStorage.setItem(MODE_KEY, 'demo')
}

function getDemoSessionWall() {
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

/** Simulated now — same clock drives countdown, construction, reveal, and click. */
export function getSimulatedNow(wallNow = Date.now()) {
  if (getClockMode() !== 'demo') return new Date(wallNow)

  const origin = getEventStart().getTime() - DEMO_START_BEFORE_MS
  const elapsedWall = wallNow - getDemoSessionWall()
  return new Date(origin + elapsedWall * DEMO_RATE)
}
