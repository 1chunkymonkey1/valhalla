import assert from 'node:assert/strict'
import test from 'node:test'
import { compareHands, evaluateHand } from './poker.js'

test('a pair outranks high card', () => {
  const pair = evaluateHand(['Ah', 'Ad', '2c', '7d', '9s'])
  const high = evaluateHand(['Kh', 'Qd', 'Jc', '9d', '7s'])
  assert.equal(pair.rank, 1)
  assert.equal(high.rank, 0)
  assert.ok(compareHands(['Ah', 'Ad', '2c', '7d', '9s'], ['Kh', 'Qd', 'Jc', '9d', '7s']) > 0)
})

test('royal flush is the top rank', () => {
  const royal = evaluateHand(['Ah', 'Kh', 'Qh', 'Jh', 'Th'])
  assert.equal(royal.rank, 9)
  assert.equal(royal.name, 'Royal flush')
})

test('seven-card holdem uses the best five', () => {
  const hand = evaluateHand(['Ah', 'Ad', '2c', '2d', '9s', '9h', '3c'])
  assert.equal(hand.rank, 2)
  assert.equal(hand.name, 'Two pair')
})
