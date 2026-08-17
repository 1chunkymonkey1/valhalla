import assert from 'node:assert/strict'
import test from 'node:test'
import { EXTRA_COMPANY_ROUTES, GRID_ORDER, getCompany } from '../lib/companies.js'
import {
  APOLLO_MUSIC,
  CANON,
  FORBIDDEN_HALL_IDS,
  FOUNDER_QUEUE,
  FOUR_WORDS,
  HALL_ROWS,
  MERIDIAN_APPAREL,
  MOSAIC_HALL_IDS,
  NAMING_RULES,
  REGISTRY_FIELDS,
  SEAT,
  UNIFYING_BOTTLENECK,
  allTodoKeys,
  assertNotHallAlias,
  bottleneckRegistry,
  confirmMosaicIds,
  hallRow,
  isMosaicHallId,
  resetSpawnedTodos,
  spawnTodo,
  todoKey,
  uniqueTodoKeys,
} from './bottlenecks.js'

test('seat and unifying bottleneck ids are stable kebab-case', () => {
  assert.equal(SEAT, 'seshat')
  assert.equal(UNIFYING_BOTTLENECK.id, 'unencoded-ballast')
  assert.match(UNIFYING_BOTTLENECK.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  assert.equal(UNIFYING_BOTTLENECK.publicLabel, 'Unencoded BALLAST')
  assert.equal(UNIFYING_BOTTLENECK.adminLabel, 'Founder Runtime')
  assert.equal(UNIFYING_BOTTLENECK.todoKey, 'bn:unencoded-ballast')
  assert.deepEqual(UNIFYING_BOTTLENECK.aliases, ['founder-runtime', 'layer-key-collision'])
  assert.equal(UNIFYING_BOTTLENECK.mosaic, false)
  assert.deepEqual(FOUR_WORDS, ['hall', 'operating-company', 'chartered', 'future'])
})

test('mosaic hall ids match GRID_ORDER and exclude Apollo and Meridian', () => {
  assert.deepEqual(MOSAIC_HALL_IDS, GRID_ORDER)
  assert.equal(MOSAIC_HALL_IDS.length, 12)
  const confirmed = confirmMosaicIds()
  assert.deepEqual(confirmed.mosaic, GRID_ORDER)
  assert.deepEqual(confirmed.extra, ['meridian'])
  assert.equal(confirmed.meridianIsMosaic, false)
  assert.equal(confirmed.apolloIsHall, false)
  assert.equal(getCompany('meridian').mosaic, false)
  assert.deepEqual(EXTRA_COMPANY_ROUTES, ['meridian'])
  assert.equal(isMosaicHallId('apollo'), false)
  assert.equal(isMosaicHallId('apollo-music'), false)
  assert.equal(isMosaicHallId('meridian'), false)
})

test('canon sentences keep the three layers distinct', () => {
  assert.match(CANON.halls, /twelve halls/)
  assert.match(CANON.halls, /chartered/)
  assert.match(CANON.apolloMusic, /not a mosaic hall/)
  assert.match(CANON.apolloMusic, /not the council seat apollo/)
  assert.match(CANON.meridianApparel, /not a thirteenth hall/)
  assert.match(CANON.meridianApparel, /off-mosaic materials/)
})

test('twelve hall rows: unique bottleneck, music, and merch ids', () => {
  assert.equal(HALL_ROWS.length, 12)
  assert.deepEqual(
    HALL_ROWS.map((row) => row.hallId),
    GRID_ORDER,
  )
  const bottleneckIds = new Set()
  const musicIds = new Set()
  const merchIds = new Set()
  for (const row of HALL_ROWS) {
    assert.ok(hallRow(row.hallId))
    assert.notEqual(row.bottleneckId, row.hallId)
    assert.notEqual(row.musicId, row.hallId)
    assert.notEqual(row.merchId, row.hallId)
    assert.match(row.bottleneckId, /^bn-[a-z0-9-]+$/)
    assert.match(row.musicId, /^am-theme-[a-z]+$/)
    assert.match(row.merchId, /^merch-[a-z]+$/)
    assert.equal(bottleneckIds.has(row.bottleneckId), false, row.bottleneckId)
    assert.equal(musicIds.has(row.musicId), false, row.musicId)
    assert.equal(merchIds.has(row.merchId), false, row.merchId)
    bottleneckIds.add(row.bottleneckId)
    musicIds.add(row.musicId)
    merchIds.add(row.merchId)
  }
})

test('Apollo Music and Meridian apparel are off-mosaic registry rows', () => {
  assert.equal(APOLLO_MUSIC.id, 'apollo-music')
  assert.equal(APOLLO_MUSIC.mosaic, false)
  assert.equal(APOLLO_MUSIC.seatId, 'apollo')
  assert.equal(APOLLO_MUSIC.musicId, 'am-label')
  assert.equal(APOLLO_MUSIC.launchThemeId, 'am-valhalla-launch')
  assert.equal(MERIDIAN_APPAREL.id, 'meridian')
  assert.equal(MERIDIAN_APPAREL.mosaic, false)
  assert.equal(MERIDIAN_APPAREL.merchId, 'merch-carbon')
  assert.deepEqual(MERIDIAN_APPAREL.carbonSkus, [
    'meridian-pants',
    'meridian-shirt',
    'meridian-jacket',
  ])
})

test('registry schema fields are present on every record', () => {
  const records = bottleneckRegistry()
  assert.equal(records.length, 15)
  for (const record of records) {
    for (const field of REGISTRY_FIELDS) {
      assert.ok(field in record, `missing ${field} on ${record.id}`)
    }
    assert.match(record.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    assert.match(record.todoKey, /^(hall|music|merch|bn|seat):[a-z0-9-]+$/)
  }
})

test('todo keys are unique and spawn refuses duplicate aliases', () => {
  const keys = allTodoKeys()
  const unique = uniqueTodoKeys()
  assert.equal(keys.length, unique.length, 'duplicate todoKey in registry')
  resetSpawnedTodos()
  const first = spawnTodo('bn', 'unencoded-ballast')
  assert.equal(first, 'bn:unencoded-ballast')
  assert.throws(() => spawnTodo('bn', 'layer-key-collision'), /duplicate todo refused/)
  assert.throws(() => spawnTodo('bn', 'founder-runtime'), /duplicate todo refused/)
  assert.throws(() => spawnTodo('hall', 'apollo'), /not a mosaic hall/)
  assert.throws(() => spawnTodo('hall', 'meridian'), /not a mosaic hall/)
  assert.throws(() => assertNotHallAlias('apollo-music'), /not a mosaic hall id/)
  assert.ok(FORBIDDEN_HALL_IDS.includes('phoenix'))
  assert.equal(todoKey('hall', 'wolf'), 'hall:wolf')
  assert.equal(todoKey('bn', 'wolf.first-product'), 'bn:bn-wolf-oem-path')
  assert.ok(NAMING_RULES.length >= 8)
  assert.ok(FOUNDER_QUEUE.some((item) => item.id === 'fq-demeter-safe'))
  const registered = new Set(unique)
  for (const item of FOUNDER_QUEUE) {
    assert.equal(registered.has(item.todoKey), true, item.todoKey)
  }
})
