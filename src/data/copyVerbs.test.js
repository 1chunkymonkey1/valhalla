import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { GRID_ORDER } from '../lib/companies.js'
import {
  BAN_PATTERNS,
  L0_SCAN_FILES,
  REQUIRE_VERBS,
  findCopyVerbHits,
} from './copyVerbs.js'
import { getHallAnnouncement, getMerchItem } from './meridianMerch.js'
import {
  APOLLO_MUSIC_PUBLIC,
  HALL_MARKS,
  MERIDIAN_CUTTER,
  mosaicHallMarks,
} from './oneCivilizationMarks.js'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../..')

test('BALLAST keeps three layers and no Apollo Music public surface', () => {
  assert.equal(APOLLO_MUSIC_PUBLIC, false)
  assert.equal(MERIDIAN_CUTTER, 'Meridian')
  assert.ok(REQUIRE_VERBS.includes('wears'))
  assert.ok(REQUIRE_VERBS.includes('cuts'))
  assert.ok(REQUIRE_VERBS.includes('moves'))
  assert.ok(REQUIRE_VERBS.includes('marks'))
  assert.ok(BAN_PATTERNS.some((r) => r.id === 'is-a-company'))
  assert.ok(BAN_PATTERNS.some((r) => r.id === 'n-companies'))
  assert.ok(BAN_PATTERNS.some((r) => r.id === 'owns-land-transit'))
  assert.ok(BAN_PATTERNS.some((r) => r.id === 'stealth-armor-public'))
})

test('twelve halls each carry brand bottleneck, music mark, merch mark, verb', () => {
  const rows = mosaicHallMarks()
  assert.equal(rows.length, 12)
  assert.deepEqual(
    rows.map((r) => r.id),
    GRID_ORDER,
  )
  for (const row of rows) {
    assert.ok(row.brandBottleneck, `${row.id} missing brand bottleneck`)
    assert.doesNotMatch(row.brandBottleneck, /is a .+ company/i)
    assert.ok(row.musicMark, `${row.id} missing music mark`)
    assert.ok(row.merchMark, `${row.id} missing merch mark`)
    assert.ok(REQUIRE_VERBS.includes(row.verb), `${row.id} verb ${row.verb} not in REQUIRE_VERBS`)
    assert.equal(HALL_MARKS[row.id].musicMark, row.musicMark)
  }
})

test('merch marks match public cloth names and wear/cut verbs', () => {
  for (const id of GRID_ORDER) {
    const marks = HALL_MARKS[id]
    const announcement = getHallAnnouncement(id)
    assert.match(announcement.statement, /wears Meridian/)
    assert.doesNotMatch(announcement.body, /is a .+ company/i)
    const shirt = getMerchItem(id, 'shirt')
    const jacket = getMerchItem(id, 'jacket')
    assert.equal(shirt.name, `${marks.merchMark} Shirt`)
    assert.equal(jacket.name, `${marks.merchMark} Jacket`)
    assert.equal(shirt.cutter, MERIDIAN_CUTTER)
  }
  assert.equal(getMerchItem('aether', 'shirt')?.name, 'Orbit Shirt')
  assert.doesNotMatch(getMerchItem('aether', 'shirt').name, /claim/i)
})

test('L0 public copy does not speak as twelve operating companies', () => {
  const failures = []
  for (const rel of L0_SCAN_FILES) {
    const text = readFileSync(join(repoRoot, rel), 'utf8')
    for (const hit of findCopyVerbHits(text)) {
      failures.push(`${rel}: ${hit.id} → "${hit.snippet}"`)
    }
  }
  assert.equal(failures.length, 0, failures.join('\n'))
})

test('Wolf OpCo speech and Fenrir shipping claims are banned on L0', () => {
  assert.ok(findCopyVerbHits('Wolf owns land transit under two principles.').some((h) => h.id === 'owns-land-transit'))
  assert.ok(findCopyVerbHits('QJ Motor USA is our OEM partner.').some((h) => h.id === 'qj-ssr-closed'))
  assert.ok(findCopyVerbHits('Fenrir is shipping now from the pack.').some((h) => h.id === 'fenrir-shipping'))
  assert.equal(findCopyVerbHits('QJ Motor USA via SSR Motorsports is a target.').length, 0)
  assert.equal(findCopyVerbHits('The pack moves. Fenrir is the first product named.').length, 0)
})

test('Water column identity and Atoll deposit drafts are banned on L0', () => {
  assert.ok(findCopyVerbHits('Njord owns the H₂O substrate: clean and split.').some((h) => h.id === 'owns-substrate'))
  assert.ok(findCopyVerbHits('Charter Membership is open.').some((h) => h.id === 'atoll-charter'))
  assert.ok(findCopyVerbHits('Production Slots 43 of 50 remaining').some((h) => h.id === 'atoll-slots'))
  assert.ok(findCopyVerbHits('Brian Sheng is our Aquaria partner.').some((h) => h.id === 'aquaria-closed'))
  assert.equal(findCopyVerbHits('Njord holds the water. Atoll begins. Email only.').length, 0)
  assert.equal(findCopyVerbHits('Brian Sheng / Aquaria is a warm lead.').length, 0)
})

test('Aeolus ownership speech and live-hold copy are banned on L0', () => {
  assert.ok(
    findCopyVerbHits('Aeolus intends to own the atmospheric substrate.').some((h) => h.id === 'owns-atmosphere'),
  )
  assert.ok(findCopyVerbHits('toward owning the atmospheric substrate').some((h) => h.id === 'owns-atmosphere'))
  assert.ok(findCopyVerbHits('Refundable holds show demand.').some((h) => h.id === 'refundable-holds-live'))
  assert.ok(findCopyVerbHits('Fully refundable until gates clear.').some((h) => h.id === 'refundable-holds-live'))
  assert.ok(findCopyVerbHits('Douze sociétés sur terre.').some((h) => h.id === 'n-companies-i18n'))
  assert.ok(findCopyVerbHits('可退款预留展示需求').some((h) => h.id === 'refundable-holds-i18n'))
  assert.equal(findCopyVerbHits('Aeolus presses the sky. Email until gates clear.').length, 0)
})

test('App does not stand a public /music route while Apollo Music is interior', () => {
  assert.equal(APOLLO_MUSIC_PUBLIC, false)
  const app = readFileSync(join(repoRoot, 'src/App.jsx'), 'utf8')
  assert.doesNotMatch(app, /path=["']\/music["']/)
  assert.doesNotMatch(app, /from ['"].*Music/)
})
