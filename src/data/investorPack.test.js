/**
 * Investor pack: twelve hall charters, not twelve issuers.
 * FILL stubs and myth CEO names must not go to an inbox.
 */

import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { DISPATCH_SEED } from '../../api/_lib/dispatchSeed.js'
import { NOW_ORDER } from '../lib/capitalQueue.js'
import { GRID_ORDER } from '../lib/companies.js'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../..')
const decksDir = join(repoRoot, 'public/investors/company-decks')

const MYTH_OFFICERS = [
  'Anubis Chavez',
  'Hestia Barker',
  'Ceres Johnson',
  'Maui Muller',
  'Yemoja Williams',
  'Garuda Hernandez',
  'Amaterasu Tran',
  'Vayu Dubois',
  'Bennu Kimura',
  'Nut Garcia',
  'Thoth Martinez',
]

const PACK_FILES = [
  'public/investors/leads.md',
  'public/investors/halls.html',
  'public/investors/deck.html',
  'public/investors/APPLICATION.md',
  'api/_lib/investorMaterials.js',
  ...GRID_ORDER.map((id) => `public/investors/company-decks/${id}.html`),
]

test('twelve hall charter one-pagers exist without FILL or company-deck badges', () => {
  const files = readdirSync(decksDir).filter((f) => f.endsWith('.html')).sort()
  assert.deepEqual(
    files,
    [...GRID_ORDER].sort().map((id) => `${id}.html`),
  )
  for (const id of GRID_ORDER) {
    const text = readFileSync(join(decksDir, `${id}.html`), 'utf8')
    assert.equal(text.includes('[[FILL'), false, `${id} still has FILL`)
    assert.equal(text.includes('Dedicated company deck'), false, `${id} still a company deck`)
    assert.equal(text.includes('per-company deck stub'), false, `${id} still a stub`)
    assert.match(text, /Hall charter one-pager/)
  }
})

test('investor pack does not name myth officers as CEOs', () => {
  const failures = []
  for (const rel of PACK_FILES) {
    const text = readFileSync(join(repoRoot, rel), 'utf8')
    for (const name of MYTH_OFFICERS) {
      if (text.includes(name)) failures.push(`${rel}: ${name}`)
    }
  }
  assert.equal(failures.length, 0, failures.join('\n'))
})

test('LvlUp paste pack uses the sourced Demeter raise, not a priced midpoint', () => {
  const text = readFileSync(join(repoRoot, 'public/investors/APPLICATION.md'), 'utf8')
  assert.match(text, /\$1\.0–1\.5M SAFE/)
  assert.match(text, /\$8M cap/)
  assert.equal(text.includes('$50M'), false)
  assert.equal(text.includes('[[FILL: Raise Amount]]'), false)
  assert.equal(text.includes('[[FILL: Valuation]]'), false)
})

test('Investor Signals Sam note is staged on the capital desk, not auto-sent', () => {
  const item = DISPATCH_SEED.find((row) => row.id === 'demeter-investor-signals')
  assert.ok(item)
  assert.equal(item.to, 'sam@investorsignals.co')
  assert.equal(item.channel, 'email')
  assert.equal(NOW_ORDER[0], 'demeter-investor-signals')
  assert.match(item.body, /Demeter Energy/)
  assert.match(item.body, /not attaching twelve company decks/i)
  assert.equal(item.body.includes('Anubis Chavez'), false)
})
