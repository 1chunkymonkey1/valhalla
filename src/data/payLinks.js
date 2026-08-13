/**
 * Squarespace Pay Link stubs.
 *
 * Public hall CTAs are email-only until predeposits open (`disabled: true`).
 * Keep estimate amounts for when Pay Links go live.
 */

export const PAY_LINK_STATUS = {
  pending: 'pending',
  live: 'live',
}

const openingSoon = {
  disabled: true,
  payUrl: '',
  notes: 'Predeposits opening soon. Email list only on the public path.',
}

/** Estimated fully refundable hold amounts by company (USD). */
export const companyPayLinks = {
  wolf: {
    label: 'Wolf · Fenrir 01 (predeposits opening soon)',
    estimateUsd: 2500,
    ...openingSoon,
  },
  holm: {
    label: 'Holm · modular home configuration hold',
    estimateUsd: 5000,
    ...openingSoon,
  },
  demeter: {
    label: 'Demeter · land-energy program hold',
    estimateUsd: 1500,
    ...openingSoon,
  },
  viking: {
    label: 'Viking · voyage cabin hold',
    estimateUsd: 1200,
    ...openingSoon,
  },
  atoll: {
    label: 'Atoll · habitat interest hold',
    estimateUsd: 7500,
    ...openingSoon,
  },
  njord: {
    label: 'Njord · water systems briefing hold',
    estimateUsd: 1000,
    ...openingSoon,
  },
  eagle: {
    label: 'Eagle · aviation access hold',
    estimateUsd: 2000,
    ...openingSoon,
  },
  olympus: {
    label: 'Olympus · habitat research hold',
    estimateUsd: 1500,
    ...openingSoon,
  },
  aeolus: {
    label: 'Aeolus · atmosphere program hold',
    estimateUsd: 1000,
    ...openingSoon,
  },
  phenix: {
    label: 'Phenix · mission inquiry hold',
    estimateUsd: 5000,
    ...openingSoon,
  },
  aether: {
    label: 'Aether · habitation partner hold',
    estimateUsd: 4000,
    ...openingSoon,
  },
  corvus: {
    label: 'Corvus · Raven OS entry (see prompt tiers)',
    estimateUsd: 100,
    ...openingSoon,
    notes:
      'Prompt Pay Links opening soon. Email list only on the public Corvus path today.',
  },
}

/**
 * Corvus Raven OS — 21 prompt tiers.
 * payUrl left empty until Squarespace Pay Links are created.
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
