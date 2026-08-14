/**
 * Immediate AI replies for Ask-the-hall, grounded in hallKnowledge.
 * Uses Vercel AI Gateway via AI SDK when gateway/OIDC auth is present,
 * or @ai-sdk/openai when OPENAI_API_KEY is set.
 *
 * Env (any one):
 * - AI_GATEWAY_API_KEY (best for local + Hobby)
 * - Vercel deployment OIDC (automatic when VERCEL=1)
 * - OPENAI_API_KEY (direct OpenAI-compatible via @ai-sdk/openai)
 * - VH_CHAT_MODEL (default openai/gpt-5.4-mini)
 */

import { generateText, Output } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { buildKnowledgePrompt, getHallKnowledge } from './hallKnowledge.js'

const DEFAULT_MODEL_ID = process.env.VH_CHAT_MODEL || 'openai/gpt-5.4-mini'

const HUMAN_PATTERNS = [
  /\b(human|person|founder|someone|agent|manager|call me|speak (to|with)|talk to|real (person|human))\b/i,
  /\b(lawyer|legal|attorney|sue|lawsuit|liability|nda|contract)\b/i,
  /\b(pay|payment|wire|invoice|refund|deposit|money|crypto|bitcoin|bank|credit card)\b/i,
  /\b(reserv(e|ation)|book(ing)?|purchase|buy now|checkout|pre-?sale)\b/i,
  /\b(ssn|passport|social security|password|secret|confidential)\b/i,
]

const ReplySchema = z.object({
  reply: z.string().min(1).max(1200),
  needs_human: z.boolean(),
  reason: z.string().max(240).optional().default(''),
})

export function isAiConfigured() {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY ||
      process.env.OPENAI_API_KEY ||
      (process.env.VERCEL && process.env.VERCEL_OIDC_TOKEN),
  )
}

function resolveModel() {
  const id = DEFAULT_MODEL_ID
  // Gateway path: string model id (provider/model)
  if (process.env.AI_GATEWAY_API_KEY || (process.env.VERCEL && process.env.VERCEL_OIDC_TOKEN)) {
    return { model: id, label: id }
  }
  if (process.env.OPENAI_API_KEY) {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const bare = id.includes('/') ? id.split('/').slice(1).join('/') : id
    return { model: openai(bare), label: `openai:${bare}` }
  }
  return { model: id, label: id }
}

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

/**
 * Generate an immediate reply for a visitor message.
 * @returns {{ reply: string, needsHuman: boolean, reason: string, model: string, status: string }}
 */
export async function generateHallReply({ pageId, visitorText, recentMessages = [] }) {
  const heur = heuristicNeedsHuman(visitorText)

  if (!isAiConfigured()) {
    return fallbackReply(
      pageId,
      visitorText,
      true,
      heur.reason || 'No AI gateway / OpenAI credentials — heuristic reply; needs human review',
    )
  }

  const { model, label } = resolveModel()
  const history = recentMessages
    .slice(-8)
    .map((m) => `${m.sender}: ${m.body}`)
    .join('\n')

  try {
    const { output } = await generateText({
      model,
      output: Output.object({ schema: ReplySchema }),
      system: `${buildKnowledgePrompt(pageId)}

Respond with JSON matching the schema. Set needs_human true when uncertain, sensitive, money/reservation/legal, or the user asks for a person.`,
      prompt: `Recent thread:\n${history || '(new thread)'}\n\nVisitor message:\n${visitorText}`,
      maxOutputTokens: 400,
      temperature: 0.4,
    })

    const needsHuman = Boolean(output?.needs_human) || heur.needsHuman
    const reason = [output?.reason, heur.reason].filter(Boolean).join(' · ').slice(0, 240)
    const reply = String(output?.reply || '').trim()
    if (!reply) {
      return fallbackReply(pageId, visitorText, true, 'Empty model reply')
    }
    return {
      reply: reply.slice(0, 1200),
      needsHuman,
      reason,
      model: label,
      status: 'ok',
    }
  } catch (err) {
    try {
      const { text } = await generateText({
        model,
        system: buildKnowledgePrompt(pageId),
        prompt: `Recent thread:\n${history || '(new thread)'}\n\nVisitor: ${visitorText}\n\nReply in plain text only.`,
        maxOutputTokens: 350,
        temperature: 0.4,
      })
      const reply = String(text || '').trim()
      if (!reply) throw new Error('empty')
      return {
        reply: reply.slice(0, 1200),
        needsHuman: heur.needsHuman || /follow up|human|someone from valhalla/i.test(reply),
        reason: heur.reason || '',
        model: label,
        status: 'ok_text',
      }
    } catch (err2) {
      return fallbackReply(
        pageId,
        visitorText,
        true,
        `AI error: ${err2?.message || err?.message || 'unknown'}`.slice(0, 240),
      )
    }
  }
}
