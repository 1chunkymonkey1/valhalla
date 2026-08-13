/**
 * Corvus · Raven OS prompt pricing
 *
 * Curve intent:
 * - Prompt 1 = $100, Prompt 2 = $200, Prompt 3 = $300 (stated start)
 * - Prompt 21 = $21,000 and unlocks a community badge
 * - Middle tiers use phase transitions (not a single linear formula)
 */

export const CORVUS_BADGE = {
  id: 'raven-twenty-first',
  name: 'Twenty-First Raven',
  unlocksAtPrompt: 21,
  description: 'Community badge unlocked by completing Prompt 21.',
}

export const CORVUS_PHASES = [
  {
    id: 'awakening',
    name: 'Awakening',
    prompts: [1, 2, 3],
    blurb: 'First sparks. Linear hundred-dollar steps.',
  },
  {
    id: 'kindling',
    name: 'Kindling',
    prompts: [4, 5, 6, 7],
    blurb: 'Commitment steepens — still reachable for early builders.',
  },
  {
    id: 'ember',
    name: 'Ember',
    prompts: [8, 9, 10, 11, 12],
    blurb: 'Serious signal. Pricing marks scarcity of attention.',
  },
  {
    id: 'forge',
    name: 'Forge',
    prompts: [13, 14, 15, 16, 17],
    blurb: 'High-stakes collaboration tiers.',
  },
  {
    id: 'apex',
    name: 'Apex',
    prompts: [18, 19, 20],
    blurb: 'Approach the summit before the Twenty-First.',
  },
  {
    id: 'twenty-first',
    name: 'The Twenty-First',
    prompts: [21],
    blurb: 'Climax prompt. Unlocks the community badge.',
  },
]

/** Explicit USD table — source of truth for amounts. */
export const CORVUS_PROMPT_PRICES_USD = {
  1: 100,
  2: 200,
  3: 300,
  4: 500,
  5: 800,
  6: 1200,
  7: 1800,
  8: 2500,
  9: 3500,
  10: 4500,
  11: 6000,
  12: 7500,
  13: 9000,
  14: 10500,
  15: 12000,
  16: 14000,
  17: 16000,
  18: 17500,
  19: 19000,
  20: 20000,
  21: 21000,
}

function phaseForPrompt(n) {
  return CORVUS_PHASES.find((p) => p.prompts.includes(n)) || null
}

export const corvusPromptPayLinks = Array.from({ length: 21 }, (_, i) => {
  const prompt = i + 1
  const phase = phaseForPrompt(prompt)
  return {
    id: `corvus-prompt-${String(prompt).padStart(2, '0')}`,
    prompt,
    label: `Raven OS · Prompt ${String(prompt).padStart(2, '0')}`,
    estimateUsd: CORVUS_PROMPT_PRICES_USD[prompt],
    payUrl: '',
    phaseId: phase?.id,
    phaseName: phase?.name,
    badge: prompt === 21 ? CORVUS_BADGE : null,
    refundable: true,
  }
})

export function getCorvusPrompt(n) {
  return corvusPromptPayLinks.find((p) => p.prompt === n) || null
}
