import assert from 'node:assert/strict'
import test from 'node:test'
import { GRID_ORDER } from '../lib/companies.js'
import {
  allHallMusic,
  allMusicItems,
  getMusicAnnouncement,
  getMusicItem,
  mosaicHallsWithMusic,
  musicCompleteForHall,
  musicItemsForCompany,
} from './apolloMusic.js'

const CART_SPEECH =
  /in stock|shipping now|buy now|checkout|add to cart|stream now|play now|now streaming|artist deals are signed/i

test('every mosaic hall lists one Apollo anthem, list not cart, no audio file', () => {
  for (const id of GRID_ORDER) {
    const announcement = getMusicAnnouncement(id)
    assert.ok(announcement?.statement, `${id} missing music announcement`)
    assert.match(announcement.statement, /scored by Apollo/)
    assert.doesNotMatch(announcement.body, CART_SPEECH)
    const items = musicItemsForCompany(id)
    assert.equal(items.length, 1, `${id} should have one sonic SKU`)
    assert.equal(items[0].sku, 'anthem')
    assert.equal(items[0].house, 'Apollo Music')
    assert.equal(items[0].audioSrc, null)
    assert.equal(items[0].href, `/${id}/music/anthem`)
    assert.doesNotMatch(items[0].does, CART_SPEECH)
    assert.equal(musicCompleteForHall(id), true)
  }
})

test('Apollo house list is identity, not a shipped announce', () => {
  const house = musicItemsForCompany('apollo-music')
  assert.equal(house.length, 1)
  assert.equal(house[0].sku, 'house')
  assert.equal(house[0].audioSrc, null)
  const announcement = getMusicAnnouncement('music')
  assert.match(announcement.body, /does not claim it shipped/)
  assert.equal(musicItemsForCompany('meridian').length, 0)
})

test('music catalog counts', () => {
  assert.equal(allHallMusic().length, 12)
  assert.equal(allMusicItems().length, 13)
  assert.equal(mosaicHallsWithMusic().length, 12)
  assert.equal(getMusicItem('wolf', 'anthem')?.name, 'Pack Crossing')
  assert.equal(getMusicItem('phenix', 'anthem')?.hallName, 'Phénix')
  assert.equal(getMusicItem('aether', 'anthem')?.name, 'Quiet Orbit')
})
