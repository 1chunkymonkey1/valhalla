import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { GRID_ORDER } from '../lib/companies.js'
import { hallMerch } from './meridianMerch.js'
import {
  MUSIC_FORBIDDEN_PUBLIC,
  MUSIC_POSTURE,
  allHallMusic,
  allMusicItems,
  apolloHouseAnnouncement,
  civilizationHeld,
  getHallMusic,
  getMusicAnnouncement,
  getMusicItem,
  mosaicHallsWithMusic,
  musicCompleteForHall,
  musicItemsForCompany,
  publicMusicCopy,
} from './apolloMusic.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')

const PUBLIC_SURFACE_FILES = [
  'src/data/apolloMusic.js',
  'src/components/ApolloMusic.jsx',
  'src/pages/MusicIndexPage.jsx',
  'src/pages/MusicShopPage.jsx',
  'src/pages/MusicDetailPage.jsx',
  'src/i18n/locales/en.js',
]

const CART_SPEECH =
  /in stock|shipping now|buy now|checkout|add to cart|stream now|play now/i

test('every mosaic hall lists one Apollo anthem paired to Meridian merch', () => {
  for (const id of GRID_ORDER) {
    const announcement = getMusicAnnouncement(id)
    const merch = hallMerch[id]
    assert.ok(announcement?.statement, `${id} missing music announcement`)
    assert.match(announcement.statement, /sounds as/)
    assert.doesNotMatch(announcement.body, CART_SPEECH)
    const items = musicItemsForCompany(id)
    assert.equal(items.length, 1, `${id} should have one sonic SKU`)
    const item = items[0]
    assert.equal(item.sku, 'anthem')
    assert.equal(item.house, 'Apollo Music')
    assert.equal(item.audioSrc, null)
    assert.equal(item.href, `/${id}/music/anthem`)
    assert.equal(item.merchTie, `${merch.shirtName} + ${merch.jacketName}`)
    assert.equal(item.merchHref, `/${id}/merch`)
    assert.doesNotMatch(item.does, CART_SPEECH)
    assert.ok(item.doNotClaim)
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
  assert.match(MUSIC_POSTURE, /not a cart/)
  assert.match(MUSIC_POSTURE, /not a stream/)
  assert.match(civilizationHeld.body, /does not claim it shipped/)
})

test('music catalog counts', () => {
  assert.equal(allHallMusic().length, 12)
  assert.equal(allMusicItems().length, 13)
  assert.equal(mosaicHallsWithMusic().length, 12)
  assert.equal(getMusicItem('wolf', 'anthem')?.name, 'Pack Crossing')
  assert.equal(getMusicItem('phenix', 'anthem')?.hallName, 'Phénix')
  assert.equal(getMusicItem('aether', 'anthem')?.name, 'Claim Quiet')
  assert.equal(
    getMusicItem('aether', 'anthem')?.merchTie,
    `${hallMerch.aether.shirtName} + ${hallMerch.aether.jacketName}`,
  )
})

test('public music copy never makes forbidden claims', () => {
  const copy = publicMusicCopy()
  for (const re of MUSIC_FORBIDDEN_PUBLIC) {
    assert.doesNotMatch(copy, re, `public copy tripped ${re}`)
  }
  assert.doesNotMatch(copy, CART_SPEECH)
})

test('public music surfaces have no audio element and no autoplay', () => {
  for (const rel of PUBLIC_SURFACE_FILES) {
    const src = readFileSync(join(root, rel), 'utf8')
    assert.doesNotMatch(src, /<audio\b/i, `${rel} contains audio`)
    assert.doesNotMatch(src, /\bautoPlay\b/, `${rel} contains autoPlay`)
    assert.doesNotMatch(src, /\bautoplay\b/i, `${rel} contains autoplay`)
  }
})

test('Eagle and Phénix keep the hard not-claims on the interior field', () => {
  assert.match(getHallMusic('eagle').doNotClaim, /Spirit Airlines/)
  assert.match(getHallMusic('eagle').doNotClaim, /Taylor Swift/)
  assert.match(getHallMusic('phenix').doNotClaim, /August 12/)
  assert.match(apolloHouseAnnouncement.body, /August 16/)
})
