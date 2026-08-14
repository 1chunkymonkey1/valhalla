/**
 * Council agent replies via Cursor / AI Gateway / OpenAI (same provider stack as hall chat).
 */

import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { buildAgentSystemPrompt, getCouncilAgentDef } from './councilAgents.js'
import {
  getAiSettings,
  getCredentialFlags,
  isAiConfigured,
  resolveProviderChain,
} from './aiSettings.js'
import { generateCursorText } from './cursorAi.js'

export { isAiConfigured }

function fallbackReply(agentId, reason) {
  const agent = getCouncilAgentDef(agentId)
  const name = agent?.name || agentId
  return {
    reply: `${name} standing by. AI credentials are not configured or the model failed (${reason}). Set CURSOR_API_KEY, AI_GATEWAY_API_KEY, or OPENAI_API_KEY, then retry.`,
    model: 'heuristic',
    status: 'fallback',
    reason,
  }
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

function gatewayOrOpenaiModel(active) {
  if (active.provider === 'openai') {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
    return { model: openai(active.model), label: active.label }
  }
  return { model: active.model, label: active.label }
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

  const flags = getCredentialFlags()
  if (!isAiConfigured(flags)) {
    return fallbackReply(agentId, 'no AI keys')
  }

  const settings = await getAiSettings()
  const chain = resolveProviderChain(settings, flags)
  if (!chain.length) {
    return fallbackReply(agentId, 'AI not configured')
  }

  const history = formatHistory(recentMessages)
  const prompt = `Recent council thread:\n${history || '(empty)'}\n\nTrigger:\n${triggerText || '(continue)'}\n\nRespond in character as ${agentId} only. Plain text. No emoji.`

  const errors = []
  for (const active of chain) {
    try {
      if (active.provider === 'cursor') {
        const out = await generateCursorText({
          system,
          prompt,
          modelId: active.model,
        })
        const reply = String(out.text || '').trim()
        if (!reply) throw new Error('empty Cursor reply')
        return {
          reply: reply.slice(0, 4000),
          model: out.model || active.label,
          status: 'ok',
        }
      }

      const { model, label } = gatewayOrOpenaiModel(active)
      const { text } = await generateText({
        model,
        system,
        prompt,
        maxOutputTokens: mode === 'autonomous' ? 500 : 700,
        temperature: mode === 'autonomous' ? 0.5 : 0.4,
      })
      const reply = String(text || '').trim()
      if (!reply) throw new Error('empty model reply')
      return {
        reply: reply.slice(0, 4000),
        model: label,
        status: 'ok',
      }
    } catch (err) {
      errors.push(`${active.provider}: ${(err?.message || 'failed').slice(0, 120)}`)
    }
  }

  return fallbackReply(agentId, errors.join(' · ') || 'AI error')
}
