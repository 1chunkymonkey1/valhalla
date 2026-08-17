import assert from 'node:assert/strict'
import test from 'node:test'
import { canOpenValve, cycleMs, nextState, TARGET_CYCLE_MS } from './sentinelFsm.js'

test('happy path reaches suppress under the 3s target', () => {
  let s = 'boot'
  for (const ev of ['ready', 'thermal_rise', 'thermal_confirm', 'suppress']) {
    const r = nextState(s, ev)
    assert.equal(r.ok, true, ev)
    s = r.state
  }
  assert.equal(s, 'suppress')
  assert.equal(canOpenValve(s), true)
  assert.equal(cycleMs(0, 2800) < TARGET_CYCLE_MS, true)
})

test('valve stays closed until confirm commits', () => {
  assert.equal(canOpenValve('watch'), false)
  assert.equal(canOpenValve('suspect'), false)
  assert.equal(canOpenValve('confirm'), false)
})

test('single-sensor smoke does not open the valve', () => {
  let s = nextState('watch', 'smoke').state
  assert.equal(s, 'suspect')
  assert.equal(canOpenValve(s), false)
  s = nextState(s, 'timeout_clear').state
  assert.equal(s, 'watch')
})

test('illegal events do not skip lockout', () => {
  const r = nextState('watch', 'suppress')
  assert.equal(r.ok, false)
  assert.equal(r.state, 'watch')
})

test('fault trips to lockout until a technician reset', () => {
  let s = nextState('watch', 'fault').state
  s = nextState(s, 'trip').state
  assert.equal(s, 'lockout')
  assert.equal(nextState(s, 'reset').ok, false)
  assert.equal(nextState(s, 'technician').state, 'boot')
})
