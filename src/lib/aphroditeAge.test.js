import assert from 'node:assert/strict'
import test from 'node:test'
import { aphroditeAdultStatus, aphroditeAgeYears, APHRODITE_MIN_AGE } from './aphroditeAge.js'

test('Aphrodite age gate is 18+', () => {
  assert.equal(APHRODITE_MIN_AGE, 18)
  const now = new Date('2026-08-18T00:00:00Z')
  assert.equal(aphroditeAgeYears('2008-08-18', now), 18)
  assert.equal(aphroditeAgeYears('2008-08-19', now), 17)
  assert.equal(aphroditeAdultStatus('2008-08-18', now).ok, true)
  assert.equal(aphroditeAdultStatus('2008-08-19', now).code, 'underage')
  assert.equal(aphroditeAdultStatus('', now).code, 'age_required')
})
