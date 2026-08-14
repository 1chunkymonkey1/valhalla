/**
 * Browser Stripe helpers (publishable key only).
 * Never put sk_test / sk_live in VITE_* vars.
 */

export function getStripePublishableKey() {
  return String(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '').trim()
}

export function isStripeBrowserConfigured() {
  const key = getStripePublishableKey()
  return key.startsWith('pk_test_') || key.startsWith('pk_live_')
}

export function stripeMode() {
  const key = getStripePublishableKey()
  if (key.startsWith('pk_live_')) return 'live'
  if (key.startsWith('pk_test_')) return 'test'
  return null
}

/**
 * Fetch server Stripe status (configured / checkout gate / tax).
 */
export async function fetchStripeStatus() {
  const res = await fetch('/api/stripe/status')
  if (!res.ok) {
    throw new Error(`Stripe status ${res.status}`)
  }
  return res.json()
}

/**
 * Ask the server for a Checkout Session URL.
 * Fails closed while STRIPE_CHECKOUT_ENABLED is false (public halls stay email-only).
 */
export async function createCheckoutSession({ sku, email, idempotencyKey } = {}) {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sku, email, idempotencyKey }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `Checkout failed (${res.status})`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}
