import assert from 'node:assert/strict'
import test from 'node:test'
import { GRID_ORDER } from '../lib/companies.js'
import {
  allHallMerch,
  allMerchItems,
  getHallAnnouncement,
  getMerchItem,
  merchItemsForCompany,
  mosaicHallsWithMerch,
} from './meridianMerch.js'

test('every mosaic hall announces Meridian and lists shirt + jacket', () => {
  for (const id of GRID_ORDER) {
    const announcement = getHallAnnouncement(id)
    assert.ok(announcement?.statement, `${id} missing announcement`)
    assert.match(announcement.statement, /wears Meridian/)
    const items = merchItemsForCompany(id)
    assert.equal(items.length, 2, `${id} should have two merch pieces`)
    assert.deepEqual(
      items.map((i) => i.sku),
      ['shirt', 'jacket'],
    )
    for (const item of items) {
      assert.equal(item.cutter, 'Meridian')
      assert.equal(item.companyId, id)
      assert.equal(item.href, `/${id}/merch/${item.sku}`)
      assert.doesNotMatch(item.does, /in stock|shipping now|buy now/i)
    }
  }
})

test('Meridian Carbon line is pants, shirt, jacket and not a cart', () => {
  const carbon = merchItemsForCompany('meridian')
  assert.deepEqual(
    carbon.map((i) => i.sku),
    ['pants', 'shirt', 'jacket'],
  )
  const announcement = getHallAnnouncement('meridian')
  assert.match(announcement.statement, /every hall/)
  assert.match(announcement.body, /not a cart/)
})

test('catalog counts and lookups', () => {
  assert.equal(allHallMerch().length, 24)
  assert.equal(allMerchItems().length, 27)
  assert.equal(mosaicHallsWithMerch().length, 12)
  assert.equal(getMerchItem('wolf', 'shirt')?.name, 'Pack Shirt')
  assert.equal(getMerchItem('phenix', 'jacket')?.hallName, 'Phénix')
  assert.equal(getMerchItem('meridian', 'pants')?.garment, 'The Pants')
  assert.equal(getMerchItem('wolf', 'pants'), null)
  assert.equal(getMerchItem('aether', 'shirt')?.name, 'Orbit Shirt')
  assert.equal(getMerchItem('aether', 'jacket')?.name, 'Orbit Jacket')
  assert.doesNotMatch(getMerchItem('aether', 'shirt').name, /claim/i)
})
