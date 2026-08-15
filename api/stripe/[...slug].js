/**
 * Single Hobby-plan serverless function for all /api/stripe/* routes.
 * Payments (Checkout Sessions), Invoicing, Tax-aware drafts, webhook stub.
 */
import { json, readBody, requireAdmin } from '../_lib/auth.js'
import { clientKey, rateLimit } from '../_lib/rateLimit.js'
import { plainText } from '../_lib/sanitize.js'
import {
  DEFAULT_TAX_CODE,
  getCatalogItem,
  getStripe,
  isAutomaticTaxEnabled,
  isCheckoutEnabled,
  publicStripeStatus,
  siteOrigin,
} from '../_lib/stripeClient.js'
import { setSubscriptionByAuthOrProfile } from '../_lib/aphroditeStore.js'

export const config = {
  api: {
    bodyParser: false,
  },
}

function routeKey(req) {
  const slug = req.query?.slug
  if (Array.isArray(slug)) return slug.filter(Boolean).join('/')
  if (typeof slug === 'string' && slug) return slug
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`)
  return url.pathname.replace(/^\/api\/stripe\/?/, '').replace(/\/$/, '')
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

async function parseJsonBody(req) {
  const raw = await readRawBody(req)
  if (!raw.length) return { raw, body: {} }
  try {
    return { raw, body: JSON.parse(raw.toString('utf8')) }
  } catch {
    const err = new Error('Invalid JSON')
    err.statusCode = 400
    throw err
  }
}

function requireStripe(res) {
  const stripe = getStripe()
  if (!stripe) {
    json(res, 503, {
      ok: false,
      error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in Vercel env.',
    })
    return null
  }
  return stripe
}

async function handleStatus(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }
  return json(res, 200, { ok: true, stripe: publicStripeStatus() })
}

/**
 * Create a hosted Checkout Session for a catalog SKU.
 * Off by default (STRIPE_CHECKOUT_ENABLED) — public halls stay email-only.
 */
async function handleCheckout(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  const rl = rateLimit(clientKey(req, 'stripe-checkout'), {
    limit: 20,
    windowMs: 15 * 60 * 1000,
  })
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfterSec))
    return json(res, 429, { ok: false, error: 'Too many attempts. Try again later.' })
  }

  const stripe = requireStripe(res)
  if (!stripe) return

  let body
  try {
    ;({ body } = await parseJsonBody(req))
  } catch (err) {
    return json(res, err.statusCode || 400, { ok: false, error: err.message })
  }

  const sku = plainText(body.sku || body.companyId || '', 64).toLowerCase()
  const item = getCatalogItem(sku)
  if (!item) {
    return json(res, 400, { ok: false, error: 'Unknown catalog SKU' })
  }

  // Hall interest holds stay gated; Aphrodite subscriptions checkout when Stripe is configured.
  const isSubscription = item.kind === 'subscription'
  if (!isSubscription && !isCheckoutEnabled()) {
    return json(res, 403, {
      ok: false,
      error:
        'Checkout is not enabled yet. Public halls remain email interest only — no deposits or shipping claims.',
      checkoutEnabled: false,
    })
  }

  const email = plainText(body.email || '', 200)
  const origin = siteOrigin(req)
  const automaticTax = isAutomaticTaxEnabled()

  try {
    const session = await stripe.checkout.sessions.create(
      isSubscription
        ? {
            mode: 'subscription',
            customer_email: email || undefined,
            line_items: [
              {
                quantity: 1,
                price_data: {
                  currency: 'usd',
                  unit_amount: item.amountCents,
                  recurring: { interval: item.interval || 'month' },
                  product_data: {
                    name: item.label,
                    description: 'Aphrodite competition dating membership — Valhalla ecosystem.',
                    metadata: {
                      sku: item.id,
                      kind: item.kind,
                      brand: 'valhalla',
                    },
                  },
                },
              },
            ],
            success_url: `${origin}/aphrodite/settings?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/aphrodite/subscribe?checkout=cancel`,
            metadata: {
              sku: item.id,
              kind: item.kind,
              source: 'aphrodite',
              profile_id: plainText(body.profileId || '', 80),
            },
            subscription_data: {
              metadata: {
                sku: item.id,
                profile_id: plainText(body.profileId || '', 80),
              },
            },
          }
        : {
            mode: 'payment',
            customer_email: email || undefined,
            line_items: [
              {
                quantity: 1,
                price_data: {
                  currency: 'usd',
                  unit_amount: item.amountCents,
                  tax_behavior: 'exclusive',
                  product_data: {
                    name: item.label,
                    description:
                      'Fully refundable interest hold. Not a product shipment or confirmed delivery date.',
                    tax_code: DEFAULT_TAX_CODE,
                    metadata: {
                      sku: item.id,
                      kind: item.kind,
                      brand: 'valhalla',
                    },
                  },
                },
              },
            ],
            automatic_tax: { enabled: automaticTax },
            invoice_creation: { enabled: true },
            success_url: `${origin}/${item.id}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/${item.id}?checkout=cancel`,
            metadata: {
              sku: item.id,
              kind: item.kind,
              source: 'valhalla-hub',
            },
            payment_intent_data: {
              metadata: {
                sku: item.id,
                kind: item.kind,
              },
            },
          },
      {
        idempotencyKey: plainText(body.idempotencyKey || '', 200) || undefined,
      },
    )

    return json(res, 200, {
      ok: true,
      id: session.id,
      url: session.url,
      mode: session.mode,
      automaticTax: isSubscription ? false : automaticTax,
    })
  } catch (err) {
    console.error('[stripe/checkout]', err.message)
    return json(res, 502, {
      ok: false,
      error: err.message || 'Checkout session failed',
    })
  }
}

/**
 * Admin-only: create a draft Invoice for investor/partner billing.
 * Uses Stripe Tax when enabled; finalize + send from Dashboard or a later endpoint.
 */
async function handleInvoice(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  if (!requireAdmin(req, res)) return

  const stripe = requireStripe(res)
  if (!stripe) return

  let body
  try {
    ;({ body } = await parseJsonBody(req))
  } catch (err) {
    return json(res, err.statusCode || 400, { ok: false, error: err.message })
  }

  const email = plainText(body.email || '', 200)
  if (!email || !email.includes('@')) {
    return json(res, 400, { ok: false, error: 'Valid customer email required' })
  }

  const name = plainText(body.name || body.customerName || '', 200)
  const description = plainText(
    body.description || body.memo || 'Valhalla partner / investor invoice',
    500,
  )
  const amountCents = Number(body.amountCents ?? body.amount_cents)
  if (!Number.isFinite(amountCents) || amountCents < 50 || amountCents > 50_000_000) {
    return json(res, 400, {
      ok: false,
      error: 'amountCents must be between 50 and 50000000',
    })
  }

  const lineLabel = plainText(body.lineLabel || description, 200) || description
  const automaticTax = isAutomaticTaxEnabled()
  const address = body.address && typeof body.address === 'object' ? body.address : null

  try {
    const customer = await stripe.customers.create({
      email,
      name: name || undefined,
      description: plainText(body.customerDescription || 'Valhalla invoice customer', 200),
      address: address
        ? {
            line1: plainText(address.line1 || '', 200) || undefined,
            line2: plainText(address.line2 || '', 200) || undefined,
            city: plainText(address.city || '', 120) || undefined,
            state: plainText(address.state || '', 80) || undefined,
            postal_code: plainText(address.postal_code || address.postalCode || '', 32) || undefined,
            country: plainText(address.country || 'US', 2).toUpperCase() || 'US',
          }
        : undefined,
      metadata: {
        source: 'valhalla-admin-invoice',
        audience: plainText(body.audience || 'partner', 40),
      },
      ...(automaticTax && address
        ? { tax: { validate_location: 'immediately' } }
        : {}),
    })

    const invoice = await stripe.invoices.create({
      customer: customer.id,
      collection_method: 'send_invoice',
      days_until_due: Math.min(90, Math.max(1, Number(body.daysUntilDue) || 30)),
      automatic_tax: { enabled: automaticTax },
      metadata: {
        source: 'valhalla-hub',
        audience: plainText(body.audience || 'partner', 40),
      },
      description,
    })

    await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: invoice.id,
      amount: Math.round(amountCents),
      currency: 'usd',
      description: lineLabel,
      tax_behavior: 'exclusive',
      // tax_code on invoice items via price preferred; description-only for one-off drafts
    })

    const refreshed = await stripe.invoices.retrieve(invoice.id)

    return json(res, 200, {
      ok: true,
      customerId: customer.id,
      invoiceId: refreshed.id,
      status: refreshed.status,
      hostedInvoiceUrl: refreshed.hosted_invoice_url,
      invoicePdf: refreshed.invoice_pdf,
      automaticTax,
      note: 'Draft invoice created. Finalize and send from Stripe Dashboard, or call invoices.finalizeInvoice / sendInvoice when ready.',
    })
  } catch (err) {
    console.error('[stripe/invoice]', err.message)
    return json(res, 502, {
      ok: false,
      error: err.message || 'Invoice creation failed',
    })
  }
}

/**
 * Webhook endpoint stub. Verifies signature when STRIPE_WEBHOOK_SECRET is set.
 * Extend handlers as Checkout / Invoicing go live.
 */
async function handleWebhook(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  const stripe = requireStripe(res)
  if (!stripe) return

  const webhookSecret = String(process.env.STRIPE_WEBHOOK_SECRET || '').trim()
  const raw = await readRawBody(req)
  const sig = req.headers['stripe-signature']

  let event
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(raw, sig, webhookSecret)
    } else {
      // Dev-only fallback: parse without verify (never use in production without secret)
      event = JSON.parse(raw.toString('utf8'))
      console.warn('[stripe/webhook] STRIPE_WEBHOOK_SECRET missing — signature not verified')
    }
  } catch (err) {
    console.error('[stripe/webhook] verify failed', err.message)
    return json(res, 400, { ok: false, error: `Webhook Error: ${err.message}` })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data?.object
      console.info('[stripe/webhook] checkout.session.completed', session?.id)
      if (session?.metadata?.sku === 'aphrodite' || session?.metadata?.source === 'aphrodite') {
        try {
          await setSubscriptionByAuthOrProfile({
            profileId: session.metadata?.profile_id || session.client_reference_id,
            customerId: session.customer,
            state: {
              status: 'active',
              customerId: session.customer || null,
              subscriptionId: session.subscription || null,
              currentPeriodEnd: null,
            },
          })
        } catch (err) {
          console.error('[stripe/webhook] aphrodite activate failed', err.message)
        }
      }
      break
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data?.object
      const status =
        event.type === 'customer.subscription.deleted'
          ? 'canceled'
          : sub?.status === 'active' || sub?.status === 'trialing'
            ? sub.status
            : sub?.status === 'past_due'
              ? 'past_due'
              : 'canceled'
      try {
        await setSubscriptionByAuthOrProfile({
          profileId: sub?.metadata?.profile_id,
          customerId: sub?.customer,
          state: {
            status,
            customerId: sub?.customer || null,
            subscriptionId: sub?.id || null,
            currentPeriodEnd: sub?.current_period_end
              ? new Date(sub.current_period_end * 1000).toISOString()
              : null,
          },
        })
      } catch (err) {
        console.error('[stripe/webhook] aphrodite sub sync failed', err.message)
      }
      console.info('[stripe/webhook]', event.type, sub?.id, status)
      break
    }
    case 'invoice.paid':
      console.info('[stripe/webhook] invoice.paid', event.data?.object?.id)
      break
    case 'invoice.payment_failed':
      console.info('[stripe/webhook] invoice.payment_failed', event.data?.object?.id)
      break
    case 'payment_intent.succeeded':
      console.info('[stripe/webhook] payment_intent.succeeded', event.data?.object?.id)
      break
    default:
      console.info('[stripe/webhook] unhandled', event.type)
  }

  return json(res, 200, { ok: true, received: true, type: event.type })
}

export default async function handler(req, res) {
  const key = routeKey(req)

  try {
    if (key === 'status' || key === '') return handleStatus(req, res)
    if (key === 'checkout') return handleCheckout(req, res)
    if (key === 'invoice' || key === 'invoices') return handleInvoice(req, res)
    if (key === 'webhook') return handleWebhook(req, res)
    return json(res, 404, { ok: false, error: `Unknown stripe route: ${key}` })
  } catch (err) {
    console.error('[stripe]', err)
    return json(res, 500, { ok: false, error: err.message || 'Stripe route error' })
  }
}
