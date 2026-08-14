/**
 * Stripe server helpers for Valhalla (Payments, Invoicing, Tax).
 * Secret key never leaves the server. Missing STRIPE_SECRET_KEY → callers get 503.
 */

import Stripe from 'stripe'

/** Default Stripe Tax product tax code (general services). Review with tax counsel. */
export const DEFAULT_TAX_CODE = 'txcd_10000000'

/**
 * Server-side catalog: amounts are authoritative (never trust client unit_amount).
 * Public halls stay email-only until STRIPE_CHECKOUT_ENABLED=true.
 */
export const STRIPE_CATALOG = {
  wolf: {
    id: 'wolf',
    label: 'Wolf · Fenrir 01 interest hold',
    amountCents: 250_000,
    kind: 'hold',
  },
  holm: {
    id: 'holm',
    label: 'Holm · modular home configuration hold',
    amountCents: 500_000,
    kind: 'hold',
  },
  demeter: {
    id: 'demeter',
    label: 'Demeter · land-energy program hold',
    amountCents: 150_000,
    kind: 'hold',
  },
  viking: {
    id: 'viking',
    label: 'Viking · voyage cabin hold',
    amountCents: 120_000,
    kind: 'hold',
  },
  atoll: {
    id: 'atoll',
    label: 'Atoll · habitat interest hold',
    amountCents: 750_000,
    kind: 'hold',
  },
  njord: {
    id: 'njord',
    label: 'Njord · water systems briefing hold',
    amountCents: 100_000,
    kind: 'hold',
  },
  eagle: {
    id: 'eagle',
    label: 'Eagle · aviation access hold',
    amountCents: 200_000,
    kind: 'hold',
  },
  olympus: {
    id: 'olympus',
    label: 'Olympus · habitat research hold',
    amountCents: 150_000,
    kind: 'hold',
  },
  aeolus: {
    id: 'aeolus',
    label: 'Aeolus · atmosphere program hold',
    amountCents: 100_000,
    kind: 'hold',
  },
  phenix: {
    id: 'phenix',
    label: 'Phenix · mission inquiry hold',
    amountCents: 500_000,
    kind: 'hold',
  },
  aether: {
    id: 'aether',
    label: 'Aether · claims partner hold',
    amountCents: 400_000,
    kind: 'hold',
  },
  corvus: {
    id: 'corvus',
    label: 'Corvus · Raven OS entry hold',
    amountCents: 10_000,
    kind: 'hold',
  },
  meridian: {
    id: 'meridian',
    label: 'Meridian · materials interest hold',
    amountCents: 15_000,
    kind: 'hold',
  },
}

let stripeSingleton = null

export function getStripeSecretKey() {
  return String(process.env.STRIPE_SECRET_KEY || '').trim()
}

export function isStripeConfigured() {
  return getStripeSecretKey().length > 0
}

/** Public checkout stays off until explicitly enabled (honest “not shipping” posture). */
export function isCheckoutEnabled() {
  const v = String(process.env.STRIPE_CHECKOUT_ENABLED || '')
    .trim()
    .toLowerCase()
  return v === '1' || v === 'true' || v === 'yes'
}

export function isAutomaticTaxEnabled() {
  const v = String(process.env.STRIPE_AUTOMATIC_TAX || 'true')
    .trim()
    .toLowerCase()
  return !(v === '0' || v === 'false' || v === 'no')
}

export function getStripe() {
  const key = getStripeSecretKey()
  if (!key) return null
  if (!stripeSingleton) {
    // Use SDK default API version (pinned by the installed `stripe` package).
    stripeSingleton = new Stripe(key)
  }
  return stripeSingleton
}

export function getCatalogItem(sku) {
  const id = String(sku || '')
    .trim()
    .toLowerCase()
  return STRIPE_CATALOG[id] || null
}

export function siteOrigin(req) {
  const fromEnv = String(process.env.SITE_ORIGIN || process.env.VITE_SITE_ORIGIN || '')
    .trim()
    .replace(/\/$/, '')
  if (fromEnv) return fromEnv
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim()
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || 'valhallaco.org')
    .split(',')[0]
    .trim()
  return `${proto}://${host}`
}

export function publicStripeStatus() {
  const key = getStripeSecretKey()
  const mode = key.startsWith('sk_live')
    ? 'live'
    : key.startsWith('sk_test')
      ? 'test'
      : key
        ? 'unknown'
        : null
  return {
    configured: Boolean(key),
    mode,
    checkoutEnabled: isCheckoutEnabled(),
    automaticTax: isAutomaticTaxEnabled(),
    webhookConfigured: Boolean(String(process.env.STRIPE_WEBHOOK_SECRET || '').trim()),
    catalogSkus: Object.keys(STRIPE_CATALOG),
  }
}
