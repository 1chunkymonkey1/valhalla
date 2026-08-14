/**
 * Council agent replies via AI Gateway / OpenAI (same env as hall chat).
 */

import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { buildAgentSystemPrompt, getCouncilAgentDef } from './councilAgents.js'
import { isAiConfigured } from './chatAi.js'

export { isAiConfigured }

const DEFAULT_MODEL_ID = process.env.VH_CHAT_MODEL || 'openai/gpt-5.4-mini'

function resolveModel() {
  const id = DEFAULT_MODEL_ID
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

function formatHistory(recentMessages) {
  return (recentMessages || [])
    .slice(-16)
    .map((m) => {
      const from = m.fromId || m.sender || '?'
      const to = m.toId ? ` → ${m.toId}` : ''
      return `${from}${to}: ${m.body}`
    })
    .join('\n')
}

function fallbackReply(agentId, reason) {
  const agent = getCouncilAgentDef(agentId)
  const name = agent?.name || agentId
  return {
    reply: `${name} standing by. AI credentials are not configured or the model failed (${reason}). Set AI_GATEWAY_API_KEY or OPENAI_API_KEY, then retry.`,
    model: 'heuristic',
    status: 'fallback',
    reason,
  }
}

/**
 * @returns {{ reply: string, model: string, status: string, reason?: string }}
 */
export async function generateCouncilReply({
  agentId,
  recentMessages = [],
  triggerText = '',
  mode = 'direct',
  goal = '',
}) {
  const system = buildAgentSystemPrompt(agentId, { mode, goal })
  if (!system) {
    return fallbackReply(agentId, 'unknown agent')
  }

  if (!isAiConfigured()) {
    return fallbackReply(agentId, 'no AI keys')
  }

  const { model, label } = resolveModel()
  const history = formatHistory(recentMessages)
  const prompt = `Recent council thread:\n${history || '(empty)'}\n\nTrigger:\n${triggerText || '(continue)'}\n\nRespond in character as ${agentId} only. Plain text. No emoji.`

  try {
    const { text } = await generateText({
      model,
      system,
      prompt,
      maxOutputTokens: mode === 'autonomous' ? 500 : 700,
      temperature: mode === 'autonomous' ? 0.5 : 0.4,
    })
    const reply = String(text || '').trim()
    if (!reply) return fallbackReply(agentId, 'empty model reply')
    return {
      reply: reply.slice(0, 4000),
      model: label,
      status: 'ok',
    }
  } catch (err) {
    return fallbackReply(agentId, (err?.message || 'AI error').slice(0, 200))
  }
}
