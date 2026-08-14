/**
 * Immediate AI replies for Ask-the-hall, grounded in hallKnowledge.
 *
 * Provider order (when Admin provider = auto):
 * 1. Cursor cloud agent when CURSOR_API_KEY + cursor model selected
 * 2. Vercel AI Gateway (AI_GATEWAY_API_KEY or OIDC)
 * 3. OpenAI (OPENAI_API_KEY)
 */

import { generateText, Output } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { buildKnowledgePrompt, getHallKnowledge } from './hallKnowledge.js'
import {
  getAiSettings,
  getCredentialFlags,
  isAiConfigured,
  resolveProviderChain,
} from './aiSettings.js'
import { generateCursorText } from './cursorAi.js'

export { isAiConfigured }

const ReplySchema = z.object({
  reply: z.string().min(1).max(1200),
  needs_human: z.boolean(),
  reason: z.string().max(240).optional().default(''),
})

const HUMAN_PATTERNS = [
  /\b(human|person|founder|someone|agent|manager|call me|speak (to|with)|talk to|real (person|human))\b/i,
  /\b(lawyer|legal|attorney|sue|lawsuit|liability|nda|contract)\b/i,
  /\b(pay|payment|wire|invoice|refund|deposit|money|crypto|bitcoin|bank|credit card)\b/i,
  /\b(reserv(e|ation)|book(ing)?|purchase|buy now|checkout|pre-?sale)\b/i,
  /\b(ssn|passport|social security|password|secret|confidential)\b/i,
]

export function heuristicNeedsHuman(text) {
  const body = String(text || '')
  for (const re of HUMAN_PATTERNS) {
    if (re.test(body)) {
      return { needsHuman: true, reason: `Matched escalation pattern: ${re.source}` }
    }
  }
  return { needsHuman: false, reason: '' }
}

function fallbackReply(pageId, visitorText, needsHuman, reason) {
  const k = getHallKnowledge(pageId)
  const base = `${k.name}: ${k.body} ${k.bullets[0] || ''}`.trim()
  const humanLine = needsHuman
    ? ' A Valhalla person will follow up in this thread for the parts that need a human.'
    : ' If you need a person, say so and we will escalate.'
  return {
    reply: `${base.slice(0, 420)}${humanLine}`,
    needsHuman,
    reason: reason || (isAiConfigured() ? '' : 'AI keys not configured; heuristic reply'),
    model: 'heuristic',
    status: 'fallback',
  }
}

function gatewayOrOpenaiModel(active) {
  if (active.provider === 'openai') {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
    return { model: openai(active.model), label: active.label }
  }
  return { model: active.model, label: active.label }
}

async function replyViaCursor(active, { system, prompt, heur }) {
  const out = await generateCursorText({
    system: `${system}\n\nReturn plain text only (the visitor-facing reply). If a human should follow up, end with the line: NEEDS_HUMAN: yes — <short reason>`,
    prompt,
    modelId: active.model,
  })
  const raw = String(out.text || '').trim()
  const needsLine = raw.match(/NEEDS_HUMAN:\s*(yes|no)\s*[—\-:]?\s*(.*)$/im)
  let reply = raw
  let needsHuman = heur.needsHuman
  let reason = heur.reason || ''
  if (needsLine) {
    needsHuman = needsHuman || /^yes$/i.test(needsLine[1])
    reason = [reason, needsLine[2]].filter(Boolean).join(' · ').slice(0, 240)
    reply = raw.replace(needsLine[0], '').trim()
  }
  if (!reply) throw new Error('Empty Cursor reply')
  return {
    reply: reply.slice(0, 1200),
    needsHuman,
    reason,
    model: out.model || active.label,
    status: 'ok',
  }
}

async function replyViaLlm(active, { system, prompt, history, pageId, visitorText, heur }) {
  const { model, label } = gatewayOrOpenaiModel(active)
  try {
    const { output } = await generateText({
      model,
      output: Output.object({ schema: ReplySchema }),
      system: `${system}\nRespond with JSON matching the schema.`,
      prompt,
      maxOutputTokens: 400,
      temperature: 0.4,
    })

    const needsHuman = Boolean(output?.needs_human) || heur.needsHuman
    const reason = [output?.reason, heur.reason].filter(Boolean).join(' · ').slice(0, 240)
    const reply = String(output?.reply || '').trim()
    if (!reply) throw new Error('Empty model reply')
    return {
      reply: reply.slice(0, 1200),
      needsHuman,
      reason,
      model: label,
      status: 'ok',
    }
  } catch (err) {
    const { text } = await generateText({
      model,
      system: buildKnowledgePrompt(pageId),
      prompt: `Recent thread:\n${history || '(new thread)'}\n\nVisitor: ${visitorText}\n\nReply in plain text only.`,
      maxOutputTokens: 350,
      temperature: 0.4,
    })
    const reply = String(text || '').trim()
    if (!reply) throw err
    return {
      reply: reply.slice(0, 1200),
      needsHuman: heur.needsHuman || /follow up|human|someone from valhalla/i.test(reply),
      reason: heur.reason || '',
      model: label,
      status: 'ok_text',
    }
  }
}

/**
 * Generate an immediate reply for a visitor message.
 * @returns {{ reply: string, needsHuman: boolean, reason: string, model: string, status: string }}
 */
export async function generateHallReply({ pageId, visitorText, recentMessages = [] }) {
  const heur = heuristicNeedsHuman(visitorText)
  const flags = getCredentialFlags()

  if (!isAiConfigured(flags)) {
    return fallbackReply(
      pageId,
      visitorText,
      true,
      heur.reason || 'No AI credentials — heuristic reply; needs human review',
    )
  }

  const settings = await getAiSettings()
  const chain = resolveProviderChain(settings, flags)
  if (!chain.length) {
    return fallbackReply(pageId, visitorText, true, 'AI not configured')
  }

  const history = recentMessages
    .slice(-8)
    .map((m) => `${m.sender}: ${m.body}`)
    .join('\n')
  const system = `${buildKnowledgePrompt(pageId)}

Respond briefly. Set needs_human true when uncertain, sensitive, money/reservation/legal, or the user asks for a person.`
  const prompt = `Recent thread:\n${history || '(new thread)'}\n\nVisitor message:\n${visitorText}`

  const errors = []
  for (const active of chain) {
    try {
      if (active.provider === 'cursor') {
        return await replyViaCursor(active, { system, prompt, heur })
      }
      return await replyViaLlm(active, { system, prompt, history, pageId, visitorText, heur })
    } catch (err) {
      errors.push(`${active.provider}: ${(err?.message || 'failed').slice(0, 120)}`)
    }
  }

  return fallbackReply(
    pageId,
    visitorText,
    true,
    `AI error: ${errors.join(' · ') || 'unknown'}`.slice(0, 240),
  )
}
