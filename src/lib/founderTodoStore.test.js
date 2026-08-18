import assert from 'node:assert/strict'
import test from 'node:test'
import {
  actOnFounderTodo,
  createFounderTodo,
  listFounderTodos,
} from '../../api/_lib/founderTodoStore.js'

test('store admits a founder choose and sweep leaves it open', async () => {
  globalThis.__vhFounderTodo = { items: [] }
  const expires = new Date(Date.now() + 2 * 86400000).toISOString()
  const item = await createFounderTodo(
    {
      kind: 'choose',
      bottleneckId: 'demeter.next-send',
      title: 'Pick this week’s Demeter path',
      whyEason: 'Only Eason can authorize the next investor send.',
      decision: 'Which capital path is this week’s send?',
      options: ['SAFE desk', 'fellowship'],
      failedLane: 'capital',
      source: 'founder',
      evidenceRef: 'note:path-choice',
      expiresAt: expires,
    },
    'info@valhallaco.org',
  )
  assert.equal(item.status, 'open')
  const listed = await listFounderTodos()
  assert.equal(listed.open.some((row) => row.id === item.id), true)
  assert.ok(listed.cadence.length >= 6)
  const decided = await actOnFounderTodo(item.id, 'decide', { option: 'SAFE desk' }, 'info@valhallaco.org')
  assert.equal(decided.status, 'decided')
  const after = await listFounderTodos()
  assert.equal(after.open.some((row) => row.id === item.id), false)
})

test('store refuses a capital dispatch clone', async () => {
  globalThis.__vhFounderTodo = { items: [] }
  await assert.rejects(
    () =>
      createFounderTodo(
        {
          kind: 'send',
          bottleneckId: 'demeter.next-send',
          title: 'Send SkyDeck letter',
          whyEason: 'Eason must send.',
          decision: 'Send SkyDeck today?',
          options: ['send', 'hold'],
          failedLane: 'capital',
          source: 'founder',
          evidenceRef: 'dispatch:demeter-skydeck',
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
        'info@valhallaco.org',
      ),
    /Capital desk/,
  )
})
