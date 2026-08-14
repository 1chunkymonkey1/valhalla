#!/usr/bin/env node
/**
 * Same-process verification of Ask chat → memory inbox (no HTTP server).
 * Exercises AI/heuristic replies + needs_human + admin listing.
 */
import {
  startOrContinueThread,
  listAdminThreads,
  getAdminThread,
  replyAsAdmin,
  resetMemoryChatForTests,
  newVisitorToken,
} from '../api/_lib/siteChat.js'

const HALLS = ['hub', 'wolf', 'viking', 'holm', 'demeter', 'eagle', 'olympus', 'njord', 'corvus', 'phenix']
const QUESTIONS = [
  'What is this hall building?',
  'When do halls unlock today?',
  'Can I pay a deposit to reserve now?',
  'I need to speak to a real person about a partnership.',
  'Is Dire Wolf shipping this year?',
  'How does Raven OS Prompt 21 work?',
  'What should a landowner know about Demeter?',
  'Legal: do you sell lunar land deeds?',
  'Any Viking tickets for sale?',
  'Quick overview of the twelve halls?',
]

resetMemoryChatForTests()

const rows = []
for (let i = 0; i < 10; i++) {
  const pageId = HALLS[i]
  const started = Date.now()
  const data = await startOrContinueThread({
    pageId,
    visitorToken: newVisitorToken(),
    visitorName: `Test Visitor ${i + 1}`,
    visitorEmail: `visitor${i + 1}@test.valhalla.local`,
    body: `[test] ${QUESTIONS[i]}`,
    isTest: true,
  })
  const ai = (data.messages || []).filter((m) => m.sender === 'ai')
  rows.push({
    pageId,
    threadId: data.thread.id,
    storage: data.storage,
    aiCount: ai.length,
    needsHuman: Boolean(data.ai?.needsHuman || data.thread?.needsHuman),
    aiStatus: data.ai?.status,
    ms: Date.now() - started,
    preview: (ai[0]?.body || '').slice(0, 90),
  })
  console.log(
    `#${i + 1} ${pageId} ai=${ai.length} flag=${rows.at(-1).needsHuman} ${rows.at(-1).ms}ms ${rows.at(-1).preview}`,
  )
}

const inbox = await listAdminThreads({})
const ids = new Set(rows.map((r) => r.threadId))
const listed = inbox.threads.filter((t) => ids.has(t.id))
const flagged = listed.filter((t) => t.needsHuman)

// Founder reply continues one thread
const sample = rows[3]
const after = await replyAsAdmin(sample.threadId, 'Founder here — thanks for the partnership note. We will follow up.')
const detail = await getAdminThread(sample.threadId)

const summary = {
  posted: rows.length,
  withAi: rows.filter((r) => r.aiCount > 0).length,
  flaggedFromAi: rows.filter((r) => r.needsHuman).length,
  storage: inbox.storage,
  durabilityNote: inbox.durabilityNote,
  inboxListed: listed.length,
  inboxFlagged: flagged.length,
  founderReplyOk: after.messages.some((m) => m.sender === 'admin'),
  transcriptSenders: [...new Set(detail.messages.map((m) => m.sender))],
}

console.log('\nSUMMARY')
console.log(JSON.stringify(summary, null, 2))

const pass =
  summary.posted === 10 &&
  summary.withAi === 10 &&
  summary.flaggedFromAi >= 2 &&
  summary.inboxListed === 10 &&
  summary.founderReplyOk &&
  summary.transcriptSenders.includes('ai') &&
  summary.transcriptSenders.includes('visitor')

if (!pass) {
  console.error('\nIN-PROCESS TEST FAILED')
  process.exitCode = 1
} else {
  console.log('\nIN-PROCESS TEST PASSED')
}
