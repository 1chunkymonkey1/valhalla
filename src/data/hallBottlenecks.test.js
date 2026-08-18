import assert from 'node:assert/strict'
import test from 'node:test'
import { EXTRA_BOTTLENECKS, HALL_BOTTLENECKS, getBottleneck } from './hallBottlenecks.js'
import { GRID_ORDER } from '../lib/companies.js'

test('twelve halls each have one OS bottleneck', () => {
  assert.equal(HALL_BOTTLENECKS.length, 12)
  assert.deepEqual(
    HALL_BOTTLENECKS.map((b) => b.hall),
    GRID_ORDER,
  )
  for (const row of HALL_BOTTLENECKS) {
    assert.ok(row.decision, row.id)
    assert.ok(row.lockedRule, row.id)
    assert.equal(getBottleneck(row.id)?.id, row.id)
  }
})

test('Apollo Music and Meridian Apparel are extra bottlenecks, not halls', () => {
  const apollo = EXTRA_BOTTLENECKS.find((b) => b.id === 'apollo.music-lane')
  const meridian = EXTRA_BOTTLENECKS.find((b) => b.id === 'meridian.list-not-cart')
  assert.match(apollo.lockedRule, /not a thirteenth hall/i)
  assert.match(apollo.lockedRule, /Helios/)
  assert.match(meridian.lockedRule, /not a cart/)
  assert.match(meridian.lockedRule, /cutter/)
  assert.equal(GRID_ORDER.includes('apollo'), false)
  assert.equal(GRID_ORDER.includes('meridian'), false)
})

test('Sunday three is a standing scoreboard, not twelve hall todos', () => {
  const sunday = EXTRA_BOTTLENECKS.find((b) => b.id === 'hub.sunday-three')
  assert.match(sunday.lockedRule, /Do not score twelve halls/)
  assert.match(sunday.lockedRule, /Sleep is not a todo/)
})
