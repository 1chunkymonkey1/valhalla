import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { GRID_ORDER } from '../lib/companies.js'
import { APOLLO_MUSIC_PUBLIC, HALL_MARKS, mosaicHallMarks } from './oneCivilizationMarks.js'
import { getMerchItem } from './meridianMerch.js'

test('Apollo Music stays interior until founder authorization', () => {
  assert.equal(APOLLO_MUSIC_PUBLIC, false)
})

test('twelve halls have merch mark, interior anthem, and Orbit not Claim on Aether cloth', () => {
  assert.deepEqual(
    mosaicHallMarks().map((r) => r.id),
    GRID_ORDER,
  )
  for (const id of GRID_ORDER) {
    assert.ok(HALL_MARKS[id].musicMark)
    assert.ok(HALL_MARKS[id].merchMark)
    const shirt = getMerchItem(id, 'shirt')
    assert.equal(shirt.name, `${HALL_MARKS[id].merchMark} Shirt`)
    assert.equal(shirt.musicMark, HALL_MARKS[id].musicMark)
  }
  assert.equal(getMerchItem('aether', 'shirt').name, 'Orbit Shirt')
})

test('council agent defs keep banned claims inside the quarantine block', () => {
  const text = readFileSync(new URL('../../api/_lib/councilAgentDefs.js', import.meta.url), 'utf8')
  const begin = text.indexOf('BEGIN CLAIMS QUARANTINE')
  const end = text.indexOf('END CLAIMS QUARANTINE')
  assert.ok(begin >= 0 && end > begin, 'quarantine block missing')
  const outside = `${text.slice(0, begin)}\n${text.slice(end + 'END CLAIMS QUARANTINE'.length)}`
  assert.equal(outside.includes('Actively in talks to acquire Spirit Airlines'), false)
  assert.equal(outside.includes('Taylor Swift is first consumer'), false)
  assert.equal(/ATOLL[^\n]*Pre-sale live/.test(outside), false)
})
