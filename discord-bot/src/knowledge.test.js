import assert from 'node:assert/strict'
import test from 'node:test'
import { knowledge } from './knowledge.js'
import { findCopyVerbHits } from '../../src/data/copyVerbs.js'

test('Discord hall blurbs do not speak as twelve operating companies', () => {
  const text = JSON.stringify(knowledge)
  assert.equal(findCopyVerbHits(text).length, 0, JSON.stringify(findCopyVerbHits(text)))
  assert.equal(knowledge.companies.length, 13)
  assert.match(knowledge.companies.find((c) => c.id === 'atoll').blurb, /No funds/)
  assert.match(knowledge.companies.find((c) => c.id === 'njord').blurb, /Holds the water/)
})
