import assert from 'node:assert/strict'
import test from 'node:test'
import {
  activateIapMembership,
  adultStatus,
  blockProfile,
  listDeck,
  listMatches,
  listMessages,
  recordSwipe,
  reportProfile,
  resetAphroditeMemory,
  sendMessage,
  setSubscriptionState,
  updateProfile,
  upsertProfileFromAuth,
} from './aphroditeStore.js'

const prevSupabaseUrl = process.env.SUPABASE_URL
const prevSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
delete process.env.SUPABASE_URL
delete process.env.SUPABASE_SERVICE_ROLE_KEY

test.after(() => {
  if (prevSupabaseUrl) process.env.SUPABASE_URL = prevSupabaseUrl
  if (prevSupabaseKey) process.env.SUPABASE_SERVICE_ROLE_KEY = prevSupabaseKey
})

function user(id, name) {
  return {
    id,
    email: `${id}@aphrodite.test`,
    app_metadata: { provider: 'email' },
    user_metadata: { full_name: name },
  }
}

async function member(id, name, extras = {}) {
  const profile = await upsertProfileFromAuth(user(id, name), {
    provider: 'email',
    displayName: name,
    birthDate: extras.birthDate || '1994-01-15',
    intents: ['competition'],
    competitions: ['chess'],
  })
  await setSubscriptionState(profile.id, { status: 'active' })
  return { ...profile, subscriptionStatus: 'active' }
}

test('Aphrodite rejects underage birth dates', async () => {
  resetAphroditeMemory()
  await assert.rejects(
    () =>
      upsertProfileFromAuth(user('kid', 'Kid'), {
        birthDate: '2015-01-01',
      }),
    /18/,
  )
  const adult = await upsertProfileFromAuth(user('ok', 'Ok'), { birthDate: '1990-01-01' })
  await assert.rejects(() => updateProfile(adult.id, { birthDate: '2012-06-01' }), /18/)
  assert.equal(adultStatus('1990-01-01').ok, true)
})

test('Aphrodite swipe match opens messages; block removes the pair', async () => {
  resetAphroditeMemory()
  const a = await member('alpha', 'Alpha')
  const b = await member('bravo', 'Bravo')

  const first = await recordSwipe(a.id, b.id, 'like')
  assert.equal(first.matched, false)
  const second = await recordSwipe(b.id, a.id, 'like')
  assert.equal(second.matched, true)

  const matches = await listMatches(a.id)
  assert.equal(matches.length, 1)
  assert.equal(matches[0].profile.displayName, 'Bravo')

  const matchId = matches[0].id
  const sent = await sendMessage(matchId, a.id, 'Chess at 7?')
  assert.match(sent.body, /Chess/)
  const thread = await listMessages(matchId, b.id)
  assert.equal(thread.length, 1)
  assert.equal(thread[0].mine, false)

  await reportProfile(a.id, b.id, 'spam', 'test')
  await blockProfile(a.id, b.id)

  const after = await listMatches(a.id)
  assert.equal(after.length, 0)
  const deck = await listDeck(a.id)
  assert.equal(
    deck.some((p) => p.id === b.id),
    false,
  )
  await assert.rejects(() => sendMessage(matchId, a.id, 'still here?'), /Match not found/)
})

test('Aphrodite IAP product activates membership in memory', async () => {
  resetAphroditeMemory()
  const a = await upsertProfileFromAuth(user('iap', 'Iap'), { birthDate: '1992-02-02' })
  assert.equal(a.subscriptionStatus, 'none')
  const live = await activateIapMembership(a.id, {
    productId: 'aphrodite_monthly',
    transactionId: '1000000123',
  })
  assert.equal(live.subscriptionStatus, 'active')
})
