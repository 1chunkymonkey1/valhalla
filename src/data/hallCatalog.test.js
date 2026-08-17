/**
 * Catalog completeness gate.
 * Fails CI if a mosaic hall loses Meridian merch or Apollo Music.
 * Does not assert inventory, checkout, or audio files.
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import { GRID_ORDER } from '../lib/companies.js'
import { merchItemsForCompany, getMerchItem } from './meridianMerch.js'
import { musicItemsForCompany, musicCompleteForHall } from './apolloMusic.js'

const CART_SPEECH =
  /in stock|shipping now|buy now|checkout|add to cart|stream now|play now/i

test('twelve mosaic halls keep wearable and sonic SKUs', () => {
  assert.equal(GRID_ORDER.length, 12, 'mosaic must stay twelve halls')

  const merchMissing = []
  const musicMissing = []

  for (const id of GRID_ORDER) {
    const merch = merchItemsForCompany(id)
    const skus = merch.map((item) => item.sku)
    if (merch.length !== 2 || skus[0] !== 'shirt' || skus[1] !== 'jacket') {
      merchMissing.push(id)
    }
    if (!musicCompleteForHall(id) || musicItemsForCompany(id)[0]?.sku !== 'anthem') {
      musicMissing.push(id)
    }
    for (const item of merch) {
      assert.equal(item.cutter, 'Meridian', `${id} merch must be cut by Meridian`)
      assert.doesNotMatch(item.does, CART_SPEECH, `${id} merch cart speech`)
    }
    for (const item of musicItemsForCompany(id)) {
      assert.equal(item.house, 'Apollo Music', `${id} music must be Apollo Music`)
      assert.equal(item.audioSrc, null, `${id} must not fake an audio file`)
      assert.doesNotMatch(item.does, CART_SPEECH, `${id} music cart speech`)
    }
  }

  assert.deepEqual(merchMissing, [], `halls missing merch SKUs: ${merchMissing.join(', ')}`)
  assert.deepEqual(musicMissing, [], `halls missing music SKUs: ${musicMissing.join(', ')}`)
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
