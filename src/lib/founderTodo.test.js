import assert from 'node:assert/strict'
import test from 'node:test'
import {
  MAX_OPEN,
  admit,
  applySweep,
  decidePatch,
  makeDedupeKey,
  morningView,
  sweepReason,
  waitPatch,
} from './founderTodo.js'

const NOW = Date.parse('2026-08-17T15:00:00Z')
const EXPIRES = '2026-08-20T15:00:00Z'

function act(over = {}) {
  return {
    kind: 'choose',
    bottleneckId: 'demeter.next-send',
    title: 'Pick this week’s Demeter capital path',
    whyEason: 'Only Eason can authorize the next investor send.',
    decision: 'Which capital path is this week’s send?',
    options: ['SAFE desk', 'fellowship', 'farm lead'],
    failedLane: 'capital',
    source: 'founder',
    evidenceRef: 'note:path-choice',
    expiresAt: EXPIRES,
    ...over,
  }
}

test('dedupe key is kind:bottleneck:slug', () => {
  assert.equal(
    makeDedupeKey({
      kind: 'choose',
      bottleneckId: 'demeter.next-send',
      decision: 'Which capital path is this week’s send?',
    }),
    'choose:demeter.next-send:which-capital-path-is-this-week-s-send',
  )
})

test('admit rejects junk drawer shapes', () => {
  assert.equal(admit(act({ title: 'Remember to think about Wolf' }), { now: NOW }).code, 'junk')
  assert.equal(admit(act({ bottleneckId: 'nope' }), { now: NOW }).code, 'bottleneck')
  assert.equal(admit(act({ decision: 'Do the thing' }), { now: NOW }).code, 'decision')
  assert.equal(admit(act({ options: ['only one'] }), { now: NOW }).code, 'options')
  assert.equal(admit(act({ expiresAt: '2026-09-01T00:00:00Z' }), { now: NOW }).code, 'expiry')
  assert.equal(
    admit(act({ evidenceRef: '/capital#fellowship-ef', kind: 'send' }), { now: NOW }).code,
    'capital',
  )
  assert.equal(
    admit(act({ title: 'Reply to visitor about Holm', decision: 'Should we reply to visitor?' }), { now: NOW }).code,
    'inbox',
  )
})

test('inbox may promote only signature, money, or claim', () => {
  const bad = admit(
    act({
      source: 'inbox-escalation',
      failedLane: 'inbox',
      kind: 'choose',
      evidenceRef: 'inbox:abc',
    }),
    { now: NOW },
  )
  assert.equal(bad.code, 'inbox')
  const good = admit(
    act({
      source: 'inbox-escalation',
      failedLane: 'inbox',
      kind: 'claim',
      title: 'Quarantine Spirit language in a visitor thread',
      whyEason: 'Only Eason can lock the public claim sentence.',
      decision: 'Which Spirit sentence is allowed this week?',
      options: ['open dialogue only', 'silent'],
      bottleneckId: 'eagle.spirit-language',
      evidenceRef: 'inbox:thread1',
    }),
    { now: NOW },
  )
  assert.equal(good.ok, true)
})

test('council extract requires FOUNDER_ACT', () => {
  const bad = admit(
    act({ source: 'council-extract', failedLane: 'council', evidenceRef: 'council:thread' }),
    { now: NOW },
  )
  assert.equal(bad.code, 'council')
  const good = admit(
    act({ source: 'council-extract', failedLane: 'council', evidenceRef: 'council:t1 FOUNDER_ACT' }),
    { now: NOW },
  )
  assert.equal(good.ok, true)
})

test('locked meridian checkout cannot enter as send', () => {
  const blocked = admit(
    act({
      kind: 'send',
      bottleneckId: 'meridian.list-not-cart',
      title: 'Turn merch into checkout',
      decision: 'Should we take funds and open a cart?',
      options: ['open cart', 'keep list'],
    }),
    { now: NOW },
  )
  assert.equal(blocked.code, 'locked')
  const change = admit(
    act({
      kind: 'choose',
      bottleneckId: 'meridian.list-not-cart',
      title: 'Change list-not-cart rule',
      decision: 'Change the list-not-cart rule this week?',
      options: ['keep list', 'sign a mill first'],
    }),
    { now: NOW },
  )
  assert.equal(change.ok, true)
})

test('duplicate open dedupe is rejected', () => {
  const first = admit(act(), { now: NOW })
  const existing = [{ ...first.item, id: 'a', status: 'open' }]
  const second = admit(act(), { existing, now: NOW })
  assert.equal(second.code, 'dedupe')
})

test('sweep auto-closes expired, capital copies, and inbox-shaped rows', () => {
  const expired = {
    id: '1',
    status: 'open',
    kind: 'choose',
    bottleneckId: 'wolf.first-product',
    title: 'Pick Wolf live sentence',
    whyEason: 'Eason locks copy.',
    decision: 'What is live?',
    expiresAt: '2026-08-10T00:00:00Z',
    dedupeKey: 'choose:wolf.first-product:what-is-live',
  }
  assert.equal(sweepReason(expired, { now: NOW }), 'expired')
  assert.equal(
    sweepReason(
      { ...expired, expiresAt: EXPIRES, evidenceRef: 'dispatch:fellowship-ef' },
      { now: NOW },
    ),
    'belongs in capital',
  )
})

test('ballast sweep drops oldest non-clock open when over cap', () => {
  const items = []
  for (let i = 0; i < MAX_OPEN + 2; i += 1) {
    items.push({
      id: `n${i}`,
      status: 'open',
      kind: 'choose',
      bottleneckId: 'holm.first-artifact',
      title: `Act ${i}`,
      whyEason: 'Eason picks.',
      decision: 'Which artifact?',
      expiresAt: EXPIRES,
      createdAt: `2026-08-17T0${i}:00:00Z`,
      dueAt: null,
      dedupeKey: `choose:holm.first-artifact:act-${i}`,
    })
  }
  items[0].dueAt = '2026-08-17T20:00:00Z'
  const swept = applySweep(items, NOW)
  const open = swept.filter((i) => i.status === 'open')
  const closed = swept.filter((i) => i.status === 'swept')
  assert.equal(open.length, MAX_OPEN)
  assert.equal(closed.length, 2)
  assert.equal(open.some((i) => i.id === 'n0'), true)
  assert.equal(closed[0].closedReason.startsWith('ballast'), true)
})

test('decide and wait patches', () => {
  assert.equal(decidePatch('').ok, false)
  assert.equal(decidePatch('SAFE desk').patch.status, 'decided')
  assert.equal(waitPatch('').ok, false)
  assert.equal(waitPatch('Adrian Pelayo').patch.status, 'waiting')
})

test('morning view sorts clock-bound first and keeps counts off the todo list', () => {
  const items = [
    {
      id: 'a',
      status: 'open',
      kind: 'hire',
      dueAt: null,
      createdAt: '2026-08-17T10:00:00Z',
    },
    {
      id: 'b',
      status: 'open',
      kind: 'claim',
      dueAt: '2026-08-17T18:00:00Z',
      createdAt: '2026-08-17T11:00:00Z',
    },
    { id: 'c', status: 'waiting', kind: 'sign' },
  ]
  const view = morningView(items, { capitalRemaining: 4, inboxNeedsHuman: 2, teamOpen: 9 }, NOW)
  assert.equal(view.open[0].id, 'b')
  assert.equal(view.counts.capitalRemaining, 4)
  assert.equal(view.counts.founderOpen, 2)
  assert.equal(view.waiting.length, 1)
  assert.match(view.policy, /Todo third/)
})
