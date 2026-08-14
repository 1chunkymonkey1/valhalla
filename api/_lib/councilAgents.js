/**
 * Council agent roster + prompt assembly.
 * Full source markdown lives in council/agents/*.md (copied into repo from Desktop).
 * Runtime prompts are truncated in councilAgentDefs.js for serverless size.
 */

import { COUNCIL_AGENT_DEFS, COUNCIL_AGENT_IDS, getCouncilAgentDef } from './councilAgentDefs.js'

export { COUNCIL_AGENT_DEFS, COUNCIL_AGENT_IDS, getCouncilAgentDef }

const NETWORK_RULES = `You are a member of the Valhalla Council (Raven Intelligence Network).
Commander: Icarus (Eason Greene). Founder admin may speak as "founder".
You may address peer agents with @agentId (e.g. @athena). When asked to collaborate, stay in your lane and produce decision-ready output.
Never invent secrets, credentials, or L3/L4 material. Never use emojis. Length calibrated to question weight.
If you need another agent, say so clearly with @mention and one sentence of what you need from them.`

export function listCouncilAgentsPublic() {
  return COUNCIL_AGENT_DEFS.map(({ id, name, role, hall }) => ({ id, name, role, hall }))
}

export function buildAgentSystemPrompt(agentId, { mode = 'direct', goal = '' } = {}) {
  const agent = getCouncilAgentDef(agentId)
  if (!agent) return null
  const peers = COUNCIL_AGENT_DEFS.filter((a) => a.id !== agent.id)
    .map((a) => `- @${a.id} — ${a.name}: ${a.role}`)
    .join('\n')
  const modeLine =
    mode === 'autonomous'
      ? `Mode: AUTONOMOUS ROUND. Advance the shared goal with one concrete move or brief. If you @mention a peer, ask for something specific. Do not repeat prior messages.`
      : `Mode: DIRECT thread with the founder (and visible peer traffic).`

  return `${NETWORK_RULES}

You are ${agent.name} (${agent.id}). Role: ${agent.role}. Hall affiliation: ${agent.hall}.

${modeLine}
${goal ? `Shared goal: ${goal}` : ''}

Peer agents you can address:
${peers}

--- AGENT DOCTRINE / KNOWLEDGE ---
${agent.systemPrompt}`
}

export function parseMentions(text) {
  const body = String(text || '')
  const found = new Set()
  const re = /@([a-z][a-z0-9_-]*)/gi
  let m
  while ((m = re.exec(body))) {
    const id = m[1].toLowerCase()
    if (id === 'all' || id === 'council') {
      for (const a of COUNCIL_AGENT_IDS) found.add(a)
      continue
    }
    if (COUNCIL_AGENT_IDS.includes(id)) found.add(id)
  }
  return [...found]
}

export function isCouncilAgentId(id) {
  return COUNCIL_AGENT_IDS.includes(String(id || '').trim().toLowerCase())
}
