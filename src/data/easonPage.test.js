import assert from 'node:assert/strict'
import test from 'node:test'
import {
  assertNoArgo,
  assertNoNetlify,
  EASON_ACADEMICS,
  EASON_CIVIC,
  EASON_PROJECTS,
  EASON_SECTIONS,
  EASON_SOCIALS,
  JEFFERSON_MANIFESTO_URL,
  PHOTO_TILE_URL,
  TILE_RUNE,
  easonHallWork,
  mosaicFloatRunes,
} from './easonPage.js'
import { GRID_ORDER } from '../lib/companies.js'

test('eason page highlights five public sections', () => {
  assert.deepEqual(EASON_SECTIONS, [
    'business',
    'projects',
    'academics',
    'exploration',
    'civic',
  ])
})

test('eason civic links Jefferson manifesto and CASURF outreach', () => {
  const jefferson = EASON_CIVIC.find((c) => c.id === 'jefferson')
  const casurf = EASON_CIVIC.find((c) => c.id === 'casurf')
  assert.equal(jefferson.href, JEFFERSON_MANIFESTO_URL)
  assert.equal(casurf.href, 'https://casurf.vote')
  assert.match(casurf.note, /Executive Director of Outreach/)
  assert.match(casurf.note, /Berkeley/)
})

test('eason socials are X, Instagram eason_greene, and LinkedIn', () => {
  assert.match(EASON_SOCIALS.instagram, /eason_greene/)
  assert.match(EASON_SOCIALS.x, /x\.com/)
  assert.match(EASON_SOCIALS.linkedin, /linkedin\.com\/in\/easongreene/)
})

test('eason halls link to Valhalla subpages, not Netlify, and omit Argo', () => {
  const halls = easonHallWork()
  assert.equal(halls.length, GRID_ORDER.length + 1)
  assert.ok(halls.every((h) => h.href.startsWith('/')))
  assert.ok(assertNoNetlify(halls))
  assert.ok(assertNoArgo(halls))
  assert.ok(assertNoArgo(EASON_PROJECTS))
  assert.ok(assertNoNetlify(EASON_PROJECTS))
  assert.ok(EASON_ACADEMICS.some((a) => a.href === '/data8'))
})

test('tile rune on the mosaic opens photo-tile.com', () => {
  assert.equal(TILE_RUNE.href, PHOTO_TILE_URL)
  const tile = mosaicFloatRunes([{ id: 'eason', name: 'Eason', path: '/eason', rune: 'ansuz' }]).find(
    (r) => r.id === 'tiles',
  )
  assert.equal(tile.href, 'https://photo-tile.com')
  assert.equal(tile.external, true)
})

test('games rune on the mosaic opens /games', () => {
  const games = mosaicFloatRunes([]).find((r) => r.id === 'games')
  assert.equal(games.href, '/games')
  assert.equal(games.external, false)
  assert.equal(games.rune, 'games')
})
