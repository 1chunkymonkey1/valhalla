import assert from 'node:assert/strict'
import test from 'node:test'
import { HIDDEN_PORTALS } from './hiddenPortals.js'
import { GAMES_RUNE, mosaicFloatRunes } from './easonPage.js'
import {
  EXTRA_FALLING_RUNES,
  GAMES_COMING_SOON,
  GUTTER_SLOTS,
  driftStyle,
  fallingRunes,
} from './fallingRunes.js'

test('mosaic float runes include the games portal', () => {
  const runes = mosaicFloatRunes(HIDDEN_PORTALS)
  const games = runes.find((r) => r.id === GAMES_RUNE.id)
  assert.equal(games.href, '/games')
  assert.equal(games.external, false)
})

test('falling field adds 26 extra runes and a games leaf', () => {
  assert.equal(EXTRA_FALLING_RUNES.length, 26)
  const field = fallingRunes(HIDDEN_PORTALS)
  assert.equal(field.filter((r) => !r.clickable).length, 26)
  const games = field.find((r) => r.id === 'games')
  assert.equal(games.href, '/games')
  assert.equal(games.clickable, true)
  assert.equal(field.length, HIDDEN_PORTALS.length + 2 + 26)
})

test('coming soon games are named and not live', () => {
  assert.deepEqual(
    GAMES_COMING_SOON.map((g) => g.id),
    ['minecraft', 'clash-royale', 'roblox'],
  )
})

test('drift styles sit in mosaic gutters, not a full-viewport fall', () => {
  const style = driftStyle(3)
  assert.match(style['--leaf-left'], /%$/)
  assert.match(style['--leaf-top'], /%$/)
  assert.match(style['--leaf-drift'], /px$/)
  assert.equal(GUTTER_SLOTS.length, 35)
  assert.ok(GUTTER_SLOTS.every((s) => s.left >= 0 && s.left <= 100 && s.top >= 0 && s.top <= 100))
  const inner = GUTTER_SLOTS.filter((s) => s.inner)
  assert.equal(inner.length, 6)
  assert.ok(
    GUTTER_SLOTS.every((s) => {
      if (s.inner) return true
      return s.left <= 5 || s.left >= 85 || s.top <= 9 || s.top >= 90
    }),
  )
})
