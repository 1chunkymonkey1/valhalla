import { getEventStart, getWave2Start } from './launchSchedule'

export const DEMO_RATE = 100
export const DEMO_START_BEFORE_MS = 60 * 60 * 1000 // T−01:00:00

const MODE_KEY = 'valhalla_clock_mode'
const SESSION_KEY = 'valhalla_demo_session_wall'
const RATE_KEY = 'valhalla_demo_rate'
const PAUSED_KEY = 'valhalla_demo_paused'
const PAUSED_SIM_KEY = 'valhalla_demo_paused_sim'
const LEGACY_DEMO_FLAG = 'valhalla_demo'

export const DEMO_RATE_OPTIONS = [1, 10, 50, 100, 500]

function storageGet(key) {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function storageSet(key, value) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ignore */
  }
}

function storageRemove(key) {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

function notifyClockChange() {
  if (typeof window === 'undefined') return
  try {
    window.dispatchEvent(new Event('valhalla-clock'))
  } catch {
    /* ignore */
  }
}

export function getClockMode() {
  if (typeof window === 'undefined') return 'live'
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.get('demo') === '1') {
      storageSet(MODE_KEY, 'demo')
      storageSet(LEGACY_DEMO_FLAG, '1')
      return 'demo'
    }
    if (params.get('demo') === '0') {
      storageSet(MODE_KEY, 'live')
      storageRemove(LEGACY_DEMO_FLAG)
      return 'live'
    }
    return storageGet(MODE_KEY) === 'demo' || storageGet(LEGACY_DEMO_FLAG) === '1'
      ? 'demo'
      : 'live'
  } catch {
    return 'live'
  }
}

export function setClockMode(mode) {
  if (typeof window === 'undefined') return
  const next = mode === 'demo' ? 'demo' : 'live'
  storageSet(MODE_KEY, next)
  if (next === 'demo') {
    storageSet(LEGACY_DEMO_FLAG, '1')
    if (!storageGet(SESSION_KEY)) {
      storageSet(SESSION_KEY, String(Date.now()))
    }
  } else {
    storageRemove(LEGACY_DEMO_FLAG)
    clearPauseState()
  }
  notifyClockChange()
}

export function getDemoRate() {
  const raw = Number(storageGet(RATE_KEY))
  if (Number.isFinite(raw) && raw > 0) return raw
  return DEMO_RATE
}

export function setDemoRate(rate) {
  const next = Number(rate)
  if (!Number.isFinite(next) || next <= 0) return
  const simNow = getSimulatedNow().getTime()
  storageSet(RATE_KEY, String(next))
  seekToSimulatedTime(simNow)
  notifyClockChange()
}

export function isDemoPaused() {
  return storageGet(PAUSED_KEY) === '1'
}

function clearPauseState() {
  storageRemove(PAUSED_KEY)
  storageRemove(PAUSED_SIM_KEY)
}

export function pauseDemoClock() {
  if (getClockMode() !== 'demo') setClockMode('demo')
  const sim = getSimulatedNow().getTime()
  storageSet(PAUSED_KEY, '1')
  storageSet(PAUSED_SIM_KEY, String(sim))
  notifyClockChange()
}

export function resumeDemoClock() {
  const pausedSim = Number(storageGet(PAUSED_SIM_KEY))
  clearPauseState()
  if (Number.isFinite(pausedSim)) {
    seekToSimulatedTime(pausedSim)
  }
  notifyClockChange()
}

export function toggleDemoPause() {
  if (isDemoPaused()) resumeDemoClock()
  else pauseDemoClock()
}

function getDemoSessionWall() {
  if (typeof window === 'undefined') return Date.now()
  let start = storageGet(SESSION_KEY)
  if (!start) {
    start = String(Date.now())
    storageSet(SESSION_KEY, start)
  }
  return Number(start)
}

/**
 * Adjust session wall so simulated clock equals `simMs` at the current wall time.
 * Formula: sim = origin + (wallNow - sessionWall) * rate
 * ⇒ sessionWall = wallNow - (sim - origin) / rate
 */
export function seekToSimulatedTime(simMs) {
  if (typeof window === 'undefined') return
  const rate = getDemoRate()
  const origin = getEventStart().getTime() - DEMO_START_BEFORE_MS
  const wallNow = Date.now()
  const sessionWall = wallNow - (Number(simMs) - origin) / rate
  storageSet(SESSION_KEY, String(sessionWall))
  storageSet(MODE_KEY, 'demo')
  storageSet(LEGACY_DEMO_FLAG, '1')
  if (isDemoPaused()) {
    storageSet(PAUSED_SIM_KEY, String(simMs))
  }
  notifyClockChange()
}

/** Seek relative to event start (negative = before T0). */
export function seekToEventOffsetMs(offsetMs) {
  seekToSimulatedTime(getEventStart().getTime() + Number(offsetMs))
}

export function resetDemoSession() {
  if (typeof window === 'undefined') return
  clearPauseState()
  storageSet(SESSION_KEY, String(Date.now()))
  storageSet(MODE_KEY, 'demo')
  storageSet(LEGACY_DEMO_FLAG, '1')
  if (!storageGet(RATE_KEY)) storageSet(RATE_KEY, String(DEMO_RATE))
  notifyClockChange()
}

/** Start (or restart) a full reveal from T−1h at the given rate. */
export function startFullReveal({ rate = DEMO_RATE, openHub = false } = {}) {
  clearPauseState()
  storageSet(RATE_KEY, String(rate > 0 ? rate : DEMO_RATE))
  storageSet(MODE_KEY, 'demo')
  storageSet(LEGACY_DEMO_FLAG, '1')
  storageSet(SESSION_KEY, String(Date.now()))
  notifyClockChange()
  if (openHub && typeof window !== 'undefined') {
    window.open('/?demo=1', '_blank', 'noopener,noreferrer')
  }
}

export function exitDemoToLive() {
  storageSet(MODE_KEY, 'live')
  storageRemove(LEGACY_DEMO_FLAG)
  clearPauseState()
  notifyClockChange()
}

/** Simulated now — same clock drives countdown, construction, reveal, and click. */
export function getSimulatedNow(wallNow = Date.now()) {
  if (getClockMode() !== 'demo') return new Date(wallNow)

  if (isDemoPaused()) {
    const paused = Number(storageGet(PAUSED_SIM_KEY))
    if (Number.isFinite(paused)) return new Date(paused)
  }

  const origin = getEventStart().getTime() - DEMO_START_BEFORE_MS
  const elapsedWall = wallNow - getDemoSessionWall()
  return new Date(origin + elapsedWall * getDemoRate())
}

/** Useful bookmarks for admin scrub UI (ms from event start). */
export function getRevealBookmarks() {
  const event = getEventStart().getTime()
  const wave2 = getWave2Start().getTime()
  return [
    { id: 't-1h', label: 'T−1h (demo start)', offsetMs: -DEMO_START_BEFORE_MS },
    { id: 't0', label: 'Event open (Wolf)', offsetMs: 0 },
    { id: 'holm', label: 'Holm preview', offsetMs: 60 * 60 * 1000 },
    { id: 'demeter', label: 'Demeter preview', offsetMs: 2 * 60 * 60 * 1000 },
    { id: 'njord', label: 'Njord preview', offsetMs: 5 * 60 * 60 * 1000 },
    { id: 'wave2', label: 'Wave 2 codes', offsetMs: wave2 - event },
  ]
}

export function formatSimOffset(now = getSimulatedNow()) {
  const delta = now.getTime() - getEventStart().getTime()
  const sign = delta < 0 ? '−' : '+'
  const abs = Math.abs(delta)
  const h = Math.floor(abs / 3_600_000)
  const m = Math.floor((abs % 3_600_000) / 60_000)
  const s = Math.floor((abs % 60_000) / 1000)
  const pad = (n) => String(n).padStart(2, '0')
  return `T${sign}${pad(h)}:${pad(m)}:${pad(s)}`
}
