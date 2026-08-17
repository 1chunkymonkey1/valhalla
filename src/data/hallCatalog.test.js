/**
 * Catalog completeness gate.
 * Fails CI if a mosaic hall loses Meridian merch or an interior Apollo Music mark.
 * Does not assert inventory, checkout, or audio files.
 * Public /music stays off while APOLLO_MUSIC_PUBLIC is false (see copyVerbs.test.js).
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import { GRID_ORDER } from '../lib/companies.js'
import { merchItemsForCompany, getMerchItem } from './meridianMerch.js'
import { APOLLO_MUSIC_PUBLIC, HALL_MARKS, mosaicHallMarks } from './oneCivilizationMarks.js'

const CART_SPEECH = /in stock|shipping now|buy now|checkout|add to cart|stream now|play now/i

test('Apollo Music stays interior and twelve halls keep merch plus anthem marks', () => {
  assert.equal(APOLLO_MUSIC_PUBLIC, false)
  assert.equal(GRID_ORDER.length, 12)
  const merchMissing = []
  const musicMissing = []
  for (const id of GRID_ORDER) {
    const merch = merchItemsForCompany(id)
    const skus = merch.map((item) => item.sku)
    if (merch.length !== 2 || skus[0] !== 'shirt' || skus[1] !== 'jacket') {
      merchMissing.push(id)
    }
    if (!HALL_MARKS[id]?.musicMark) musicMissing.push(id)
    for (const item of merch) {
      assert.equal(item.cutter, 'Meridian', `${id} merch must be cut by Meridian`)
      assert.doesNotMatch(item.does, CART_SPEECH, `${id} merch cart speech`)
    }
  }
  assert.deepEqual(merchMissing, [], `halls missing merch SKUs: ${merchMissing.join(', ')}`)
  assert.deepEqual(musicMissing, [], `halls missing interior music marks: ${musicMissing.join(', ')}`)
  assert.deepEqual(
    mosaicHallMarks().map((row) => row.id),
    GRID_ORDER,
  )
})

test('Meridian Carbon line stays three Earth Line pieces, not a cart', () => {
  const carbon = merchItemsForCompany('meridian')
  assert.deepEqual(
    carbon.map((item) => item.sku),
    ['pants', 'shirt', 'jacket'],
  )
  for (const item of carbon) {
    assert.doesNotMatch(item.does, CART_SPEECH)
  }
})

test('Aether garment SKU is Orbit, not Claim', () => {
  assert.equal(getMerchItem('aether', 'shirt')?.name, 'Orbit Shirt')
  assert.equal(getMerchItem('aether', 'jacket')?.name, 'Orbit Jacket')
  assert.doesNotMatch(getMerchItem('aether', 'shirt').name, /claim/i)
  assert.doesNotMatch(getMerchItem('aether', 'jacket').name, /claim/i)
})
