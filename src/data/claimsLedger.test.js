import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { CAPITAL_POSTURE } from '../lib/capitalQueue.js'
import { L0_SCAN_FILES } from './copyVerbs.js'
import { DEMETER_RAISE_SOURCED, QUARANTINED_PHRASES } from './claimsLedger.js'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../..')

test('capital desk is the sourced Demeter raise sentence', () => {
  assert.equal(CAPITAL_POSTURE.entity, DEMETER_RAISE_SOURCED.entity)
  assert.equal(CAPITAL_POSTURE.raise, DEMETER_RAISE_SOURCED.raise)
  assert.equal(CAPITAL_POSTURE.cap, DEMETER_RAISE_SOURCED.cap)
  assert.equal(CAPITAL_POSTURE.min, DEMETER_RAISE_SOURCED.min)
})

test('quarantined phrases stay off L0 scan files', () => {
  const failures = []
  for (const rel of L0_SCAN_FILES) {
    const text = readFileSync(join(repoRoot, rel), 'utf8')
    for (const phrase of QUARANTINED_PHRASES) {
      if (text.includes(phrase)) failures.push(`${rel}: ${phrase}`)
    }
  }
  assert.equal(failures.length, 0, failures.join('\n'))
})
