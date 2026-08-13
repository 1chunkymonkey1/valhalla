/**
 * Squarespace Pay Link stubs.
 *
 * Create real links in Squarespace → Pay Links (prefer Squarespace Payments
 * for unlimited links), then paste URLs into `payUrl` fields below.
 * Until then, CTAs show estimated hold amounts and a “link pending” state.
 *
 * All holds are marketed as fully refundable reservation deposits.
 */

export const PAY_LINK_STATUS = {
  pending: 'pending',
  live: 'live',
}

/** Estimated fully refundable hold amounts by company (USD). */
export const companyPayLinks = {
  wolf: {
    label: 'Wolf · Fenrir 01 (predeposits opening soon)',
    estimateUsd: 2500,
    payUrl: '',
    /** Wolf CTAs are email-only until predeposits open — do not surface Pay Links. */
    disabled: true,
    notes: 'Predeposits opening soon. Email list only on the public Wolf path.',
  },
  holm: {
    label: 'Holm · modular home configuration hold',
    estimateUsd: 5000,
    payUrl: '',
    notes: 'Refundable configuration interest — not a construction contract.',
  },
  demeter: {
    label: 'Demeter · land-energy program hold',
    estimateUsd: 1500,
    payUrl: '',
    notes: 'Refundable diligence queue — not an investment offer.',
  },
  viking: {
    label: 'Viking · voyage cabin hold',
    estimateUsd: 1200,
    payUrl: '',
    notes: 'Refundable cabin reservation while itineraries confirm.',
  },
  atoll: {
    label: 'Atoll · habitat interest hold',
    estimateUsd: 7500,
    payUrl: '',
    notes: 'Refundable ledger place — not a deed.',
  },
  njord: {
    label: 'Njord · water systems briefing hold',
    estimateUsd: 1000,
    payUrl: '',
    notes: 'Refundable follow-up reservation.',
  },
  eagle: {
    label: 'Eagle · aviation access hold',
    estimateUsd: 2000,
    payUrl: '',
    notes: 'Refundable interest — not a ticket.',
  },
  olympus: {
    label: 'Olympus · habitat research hold',
    estimateUsd: 1500,
    payUrl: '',
    notes: 'Refundable briefing / collaboration queue.',
  },
  aeolus: {
    label: 'Aeolus · atmosphere program hold',
    estimateUsd: 1000,
    payUrl: '',
    notes: 'Refundable consultation reservation.',
  },
  phenix: {
    label: 'Phenix · mission inquiry hold',
    estimateUsd: 5000,
    payUrl: '',
    notes: 'Refundable payload inquiry — not a launch booking.',
  },
  aether: {
    label: 'Aether · habitation partner hold',
    estimateUsd: 4000,
    payUrl: '',
    notes: 'Refundable partner / research ledger.',
  },
  corvus: {
    label: 'Corvus · Raven OS entry (see prompt tiers)',
    estimateUsd: 100,
    payUrl: '',
    notes: 'Entry tier mirrors Prompt 01. Higher tiers in corvusPromptPayLinks.',
  },
}

/**
 * Corvus Raven OS — 21 prompt tiers.
 * payUrl left empty until Squarespace Pay Links are created.
 * Pricing defined in corvusPricing.js; amounts mirrored here for checkout wiring.
 */
export { corvusPromptPayLinks } from './corvusPricing.js'

export function getCompanyPayLink(companyId) {
  return companyPayLinks[companyId] || null
}

export function formatUsd(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}
