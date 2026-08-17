import assert from 'node:assert/strict'
import test from 'node:test'
import {
  APOLLO_MUSIC,
  CLAIMS_QUARANTINE,
  HALL_SYSTEM,
  MERIDIAN_APPAREL,
  MOSAIC_HALLS,
  NEVER_AUTO,
  UNIFYING_BOTTLENECK,
  bottleneckKey,
  classifyInboxReason,
} from './bottleneckCatalogs.js'
import { resetMemoryBottlenecksForTests } from './bottleneckStore.js'
import {
  createManualQueueItem,
  detectAll,
  getBottleneckState,
  resolveQueueItem,
  runSweep,
} from './bottleneckEngine.js'
import {
  newVisitorToken,
  resetMemoryChatForTests,
  setNeedsHuman,
  startOrContinueThread,
} from './siteChat.js'

test('catalog identity: 12 halls, off-mosaic music and merch', () => {
  assert.equal(MOSAIC_HALLS.length, 12)
  assert.equal(Object.keys(HALL_SYSTEM).length, 12)
  assert.equal(APOLLO_MUSIC.publicSurface, false)
  assert.equal(MERIDIAN_APPAREL.mosaic, false)
  assert.equal(bottleneckKey('eagle', 'claim', 'spirit-airlines'), 'eagle:claim:spirit-airlines')
  assert.ok(CLAIMS_QUARANTINE.some((r) => r.slug === 'spirit-airlines'))
  assert.ok(NEVER_AUTO.some((line) => /auto-reply/i.test(line)))
  assert.equal(classifyInboxReason('Matched escalation pattern: lawyer'), 'legal')
  assert.match(UNIFYING_BOTTLENECK.statement, /durable identity/)
})

test('sweep automates catalogs and does not duplicate founder rows', async () => {
  resetMemoryBottlenecksForTests()
  resetMemoryChatForTests()

  const first = await runSweep({ actor: 'test' })
  assert.equal(first.ok, true)
  assert.equal(first.storage, 'memory')
  assert.equal(first.report.halls.length, 12)
  assert.equal(first.completeness.apolloOk, true)
  assert.equal(first.report.apolloMusic.publicSurface, false)

  const keys = first.items.filter((i) => i.status === 'needs_eason').map((i) => i.bottleneckId)
  assert.equal(new Set(keys).size, keys.length)
  assert.ok(keys.includes('meridian:founder:logo'))
  assert.ok(keys.includes('dispatch:dispatch:unsent'))
  assert.equal(first.items.filter((i) => i.bottleneckId === 'meridian:founder:logo').length, 1)

  const automated = first.findings.filter((f) => f.status === 'automated')
  assert.ok(automated.some((f) => f.key === 'wolf:capture:email-signup'))
  assert.ok(automated.some((f) => f.key === 'apollo-music:surface:public-off'))
  assert.ok(automated.some((f) => f.key === 'eagle:claim:spirit-airlines' && f.founderRequired === false))

  const second = await runSweep({ actor: 'test' })
  const logoRows = second.items.filter(
    (i) => i.bottleneckId === 'meridian:founder:logo' && (i.status === 'needs_eason' || i.status === 'open'),
  )
  assert.equal(logoRows.length, 1)
  assert.ok(second.counts.deduped > 0)
  assert.equal(second.counts.needsEason, first.counts.needsEason)
})

test('inbox sync collapses threads by reason and does not auto-reply', async () => {
  resetMemoryBottlenecksForTests()
  resetMemoryChatForTests()
  const a = await startOrContinueThread({
    pageId: 'eagle',
    visitorToken: newVisitorToken(),
    body: '[test] partnership legal NDA',
    skipAi: true,
    isTest: true,
  })
  const b = await startOrContinueThread({
    pageId: 'wolf',
    visitorToken: newVisitorToken(),
    body: '[test] another lawyer question',
    skipAi: true,
    isTest: true,
  })
  await setNeedsHuman(a.thread.id, true, 'lawyer NDA')
  await setNeedsHuman(b.thread.id, true, 'legal attorney')

  const detected = await detectAll()
  const legal = detected.detections.find((d) => d.key === 'inbox:inbox:legal')
  assert.ok(legal)
  assert.equal(legal.evidence.threadIds.length, 2)
  assert.equal(legal.founderRequired, true)
  assert.equal(legal.automation, 'inbox-sync')
})

test('manual create dedupes on surface:kind:slug and resolve stays closed', async () => {
  resetMemoryBottlenecksForTests()
  const created = await createManualQueueItem({
    title: 'Appoint Space seat',
    body: 'Space war-council seat is OPEN.',
    hall: 'phenix',
    actor: 'test',
  })
  assert.equal(created.item.bottleneckId, 'phenix:founder:appoint-space-seat')
  const again = await createManualQueueItem({
    title: 'Appoint Space seat',
    body: 'duplicate',
    hall: 'phenix',
    actor: 'test',
  })
  assert.equal(again.deduped, true)
  assert.equal(again.item.id, created.item.id)

  const done = await resolveQueueItem(created.item.id, 'test', 'decided')
  assert.equal(done.status, 'done')

  await runSweep({ actor: 'test' })
  const state = await getBottleneckState()
  const reopened = state.items.filter(
    (i) => i.bottleneckId === 'phenix:founder:appoint-space-seat' && i.status === 'needs_eason',
  )
  assert.equal(reopened.length, 0)
})
