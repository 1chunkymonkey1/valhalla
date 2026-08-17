import assert from 'node:assert/strict'
import test from 'node:test'
import { heuristicNeedsHuman } from '../../api/_lib/chatAi.js'

test('Ask widget flags quarantined claim speech for a human', () => {
  assert.equal(heuristicNeedsHuman('Are you acquiring Spirit Airlines?').needsHuman, true)
  assert.equal(heuristicNeedsHuman('Is Taylor Swift the first consumer?').needsHuman, true)
  assert.equal(heuristicNeedsHuman('Is the Atoll pre-sale live?').needsHuman, true)
  assert.equal(heuristicNeedsHuman('Can I join the Wolf waitlist?').needsHuman, false)
})
