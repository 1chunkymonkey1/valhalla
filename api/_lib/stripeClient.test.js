import assert from 'node:assert/strict'
import test from 'node:test'
import { isCheckoutEnabled, getCatalogItem } from './stripeClient.js'

test('public hall checkout stays off unless STRIPE_CHECKOUT_ENABLED is set', () => {
  const prev = process.env.STRIPE_CHECKOUT_ENABLED
  delete process.env.STRIPE_CHECKOUT_ENABLED
  assert.equal(isCheckoutEnabled(), false)
  assert.equal(getCatalogItem('atoll')?.id, 'atoll')
  process.env.STRIPE_CHECKOUT_ENABLED = prev
})
