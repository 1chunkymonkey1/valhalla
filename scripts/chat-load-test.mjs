#!/usr/bin/env node
/**
 * Spin up 10 tagged visitor sessions across halls, post varied questions,
 * and verify AI replies + admin inbox listing + needs_human flags.
 *
 * Prefer local:
 *   BASE_URL=http://127.0.0.1:3000 npm run chat:load-test
 *
 * Against production only with care (messages are tagged [test] + test:true):
 *   BASE_URL=https://valhallaco.org ADMIN_COOKIE='…' npm run chat:load-test
 *
 * Admin checks need either:
 * - memory storage on the same Node process (vercel dev / local api), or
 * - ADMIN_COOKIE / ADMIN_PASSWORD for /api/admin/inbox
 */

import { randomBytes } from 'node:crypto'

const BASE = (process.env.BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')
const HALLS = ['hub', 'wolf', 'viking', 'holm', 'demeter', 'eagle', 'olympus', 'njord', 'corvus', 'phenix']

const QUESTIONS = [
  'What is this hall building, in one paragraph?',
  'When do the mosaic halls unlock today?',
  'Can I buy or reserve a product right now with a deposit?',
  'I need to speak to a real person / founder about a partnership.',
  'Is Dire Wolf rail shipping passengers this year?',
  'How does Raven OS / Prompt 21 work for founders?',
  'What should a landowner know before contacting Demeter?',
  'Legal question: do you sell lunar land deeds?',
  'Tell me about the voyage waitlist — any tickets for sale?',
  'Quick overview of Valhalla’s twelve halls?',
]

function token() {
  return randomBytes(24).toString('hex')
}

async function postChat({ pageId, visitorToken, body, name }) {
  const res = await fetch(`${BASE}/api/hub/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'send',
      pageId,
      visitorToken,
      name,
      email: `${name.replace(/\s+/g, '.').toLowerCase()}@test.valhalla.local`,
      body: `[test] ${body}`,
      test: true,
    }),
  })
  const data = await res.json().catch(() => ({}))
  return { status: res.status, data }
}

async function adminInbox(cookie) {
  if (!cookie) return null
  const res = await fetch(`${BASE}/api/admin/inbox`, {
    headers: { Cookie: cookie },
  })
  const data = await res.json().catch(() => ({}))
  return { status: res.status, data }
}

async function adminLogin() {
  if (process.env.ADMIN_COOKIE) return process.env.ADMIN_COOKIE
  const password = process.env.ADMIN_PASSWORD
  if (!password) return ''
  const res = await fetch(`${BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL || 'eason@valhallaco.org',
      password,
      totp: process.env.ADMIN_TOTP || '',
    }),
  })
  const setCookie = res.headers.getSetCookie?.() || []
  const raw = setCookie.map((c) => c.split(';')[0]).join('; ')
  if (raw) return raw
  const single = res.headers.get('set-cookie')
  return single ? single.split(';')[0] : ''
}

async function main() {
  console.log(`Chat load test → ${BASE}`)
  const results = []

  for (let i = 0; i < 10; i++) {
    const pageId = HALLS[i]
    const q = QUESTIONS[i]
    const visitorToken = token()
    const name = `Test Visitor ${i + 1}`
    const started = Date.now()
    const { status, data } = await postChat({ pageId, visitorToken, body: q, name })
    const messages = data.messages || []
    const aiMsgs = messages.filter((m) => m.sender === 'ai')
    const row = {
      i: i + 1,
      pageId,
      ok: Boolean(data.ok),
      http: status,
      storage: data.storage,
      threadId: data.thread?.id || null,
      aiCount: aiMsgs.length,
      aiStatus: data.ai?.status || null,
      needsHuman: Boolean(data.ai?.needsHuman || data.thread?.needsHuman),
      ms: Date.now() - started,
      error: data.error || null,
      preview: (aiMsgs[0]?.body || '').slice(0, 100),
    }
    results.push(row)
    console.log(
      `#${row.i} ${row.pageId} http=${row.http} ai=${row.aiCount} flag=${row.needsHuman} ${row.ms}ms ${row.error || row.preview}`,
    )
  }

  let inbox = null
  try {
    const cookie = await adminLogin()
    inbox = await adminInbox(cookie)
  } catch (err) {
    inbox = { error: err.message }
  }

  const threadIds = new Set(results.map((r) => r.threadId).filter(Boolean))
  const listed = (inbox?.data?.threads || []).filter((t) => threadIds.has(t.id) || t.isTest)
  const flagged = listed.filter((t) => t.needsHuman)

  const summary = {
    posted: results.length,
    okPosts: results.filter((r) => r.ok).length,
    withAi: results.filter((r) => r.aiCount > 0).length,
    flaggedFromAi: results.filter((r) => r.needsHuman).length,
    storage: [...new Set(results.map((r) => r.storage).filter(Boolean))],
    inboxHttp: inbox?.status ?? null,
    inboxListedMatching: listed.length,
    inboxFlaggedMatching: flagged.length,
    inboxStorage: inbox?.data?.storage || null,
    inboxError: inbox?.data?.error || inbox?.error || null,
  }

  console.log('\nSUMMARY')
  console.log(JSON.stringify(summary, null, 2))

  const pass =
    summary.okPosts === 10 &&
    summary.withAi === 10 &&
    summary.flaggedFromAi >= 2 &&
    (summary.inboxListedMatching >= 1 || summary.storage.includes('memory'))

  if (!pass) {
    console.error('\nLOAD TEST FAILED (see summary). Admin inbox may need ADMIN_COOKIE on multi-instance.')
    process.exitCode = 1
  } else {
    console.log('\nLOAD TEST PASSED')
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
