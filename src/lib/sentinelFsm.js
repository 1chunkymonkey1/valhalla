/** Sentinel detection-to-suppression states. Garden-hose mule and listed product share this machine. */

export const STATES = Object.freeze([
  'boot',
  'watch',
  'suspect',
  'confirm',
  'suppress',
  'hold',
  'fault',
  'lockout',
])

const TRANSITIONS = {
  boot: { ready: 'watch', fault: 'fault' },
  watch: { thermal_rise: 'suspect', smoke: 'suspect', fault: 'fault' },
  suspect: {
    thermal_confirm: 'confirm',
    timeout_clear: 'watch',
    smoke_and_thermal: 'confirm',
    fault: 'fault',
    abort: 'watch',
  },
  confirm: { suppress: 'suppress', abort: 'watch', fault: 'fault' },
  suppress: { suppress_ok: 'hold', suppress_fail: 'fault', abort: 'hold', fault: 'fault' },
  hold: { clear: 'watch', reheat: 'confirm', fault: 'fault' },
  fault: { reset: 'boot', trip: 'lockout' },
  lockout: { technician: 'boot' },
}

export function nextState(state, event) {
  if (!STATES.includes(state)) return { ok: false, state, error: 'unknown_state' }
  const dest = TRANSITIONS[state]?.[event]
  if (!dest) return { ok: false, state, error: 'illegal_event' }
  return { ok: true, state: dest }
}

export function canOpenValve(state) {
  return state === 'suppress'
}

export function cycleMs(fromEventAt, suppressAt) {
  if (!Number.isFinite(fromEventAt) || !Number.isFinite(suppressAt)) return null
  return Math.max(0, suppressAt - fromEventAt)
}

export const TARGET_CYCLE_MS = 3000
