# Stripe setup (Valhalla / valhallaco.org)

Payments, Invoicing, and Tax for civilization-level interest holds and partner/investor invoices — **without** false “shipping now” claims on public halls.

## Status

| Piece | State |
|---|---|
| MCP / Stripe plugin | **Unavailable** in this Cursor workspace (no `stripe_*` MCP tools). Plan + code from Stripe docs. |
| `npx skills add https://docs.stripe.com` | Failed (fetch). |
| Code slice | Shipped: `/api/stripe/*` catch-all, client publishable helpers, this doc. |
| Public halls | Still **email-only**. Checkout is gated by `STRIPE_CHECKOUT_ENABLED` (default off). |

## Architecture (Hobby-safe)

One serverless function covers all Stripe routes (keeps Vercel Hobby under the 12-function limit):

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/stripe/status` | GET | public | Config flags (no secrets) |
| `/api/stripe/checkout` | POST | public + rate limit | Hosted Checkout Session for catalog SKU |
| `/api/stripe/invoice` | POST | admin cookie | Draft Invoice for partner/investor billing |
| `/api/stripe/webhook` | POST | Stripe signature | Event stub (`checkout.session.completed`, `invoice.paid`, …) |

Server catalog (amounts authoritative): `api/_lib/stripeClient.js`  
Browser helpers: `src/lib/stripeBrowser.js`  
Existing pay-link stubs remain disabled in `src/data/payLinks.js`.

## Environment variables

Set in **Vercel → Project → Settings → Environment Variables** (Production + Preview). Never commit `sk_*`.

| Name | Where | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | Server only | `sk_test_…` first. Paste privately in Vercel UI / CLI — **do not paste in chat**. |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Build / client | `pk_test_…` (OK to expose). Redeploy after changing. |
| `STRIPE_WEBHOOK_SECRET` | Server only | `whsec_…` from Dashboard → Developers → Webhooks |
| `STRIPE_CHECKOUT_ENABLED` | Server | `true` only when ready to accept real holds. Default: unset/false. |
| `STRIPE_AUTOMATIC_TAX` | Server | Default `true`. Set `false` to disable Stripe Tax on sessions/invoices. |
| `SITE_ORIGIN` | Server | Optional. e.g. `https://valhallaco.org` for success/cancel URLs. |

### Publishable test key (safe for `VITE_*`)

```text
pk_test_51U4S4vBYRx1URli7Pi2zEQU0ZETdSeXZW8LwaMS4wscGLRQrBrWrPYRa43CADq3a6J8tD3dnIEWxvcQb8EW6Ak3t004f4hkyAp
```

```bash
npx vercel env add VITE_STRIPE_PUBLISHABLE_KEY
# paste pk_test_… above

npx vercel env add STRIPE_SECRET_KEY
# paste sk_test_… privately — never commit

# After webhook endpoint exists:
npx vercel env add STRIPE_WEBHOOK_SECRET
```

Local (gitignored):

```bash
# .env.local
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_…
STRIPE_SECRET_KEY=sk_test_…   # server via `vercel dev` / local API only
```

## Stripe Dashboard checklist

1. **Activate Stripe Tax** — [Tax settings](https://dashboard.stripe.com/settings/tax) → register jurisdictions you collect in. Without registrations, calculated tax is $0.
2. **Default tax behavior** — prefer **exclusive** for US B2B/partner invoices (matches API).
3. **Preset tax code** — review `txcd_10000000` (general services) used in Checkout; change with counsel if holds/software need a different code.
4. **Invoicing** — [Invoice template](https://dashboard.stripe.com/settings/billing/invoice) (logo, memo, footer). Enable **automatic tax** on new invoices.
5. **Customer emails** — ensure Stripe can send invoice/receipt emails (or send hosted invoice links yourself).
6. **Webhook** — endpoint URL: `https://valhallaco.org/api/stripe/webhook`  
   Events to start: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `payment_intent.succeeded`.
7. **Business details** — legal entity, statement descriptor, payouts bank account (Schwab / Atlas as applicable).

## Product plan (honest checkout)

| Product | Stripe surface | Notes |
|---|---|---|
| **Payments** | Checkout Sessions (`mode: payment`) | Catalog SKUs mirror hall hold estimates. Copy says **refundable interest hold**, not shipment. |
| **Invoicing** | `invoices` + `invoiceItems` (admin API) | Investor/partner drafts; finalize/send from Dashboard initially. |
| **Tax** | `automatic_tax: { enabled: true }` | On Checkout + Invoices. Needs Tax registrations + customer address for accurate calc. |

Public CTAs stay on email capture until `STRIPE_CHECKOUT_ENABLED=true`. Do not wire “Buy now / ships today” UI.

## Test cards (test mode)

| Card | Result |
|---|---|
| `4242 4242 4242 4242` | Succeeds |
| `4000 0000 0000 9995` | Declines (insufficient funds) |
| `4000 0025 0000 3155` | Requires 3D Secure |

Any future expiry, any CVC, any postal code (US tax tests often use a real ZIP). See [Stripe testing](https://docs.stripe.com/testing).

Tax location testing: create customers with full US address (street + 5-digit ZIP) or use [Tax testing docs](https://docs.stripe.com/tax/testing).

## API examples

### Status

```bash
curl -s https://valhallaco.org/api/stripe/status | jq
```

### Checkout (requires secret + STRIPE_CHECKOUT_ENABLED=true)

```bash
curl -s -X POST https://valhallaco.org/api/stripe/checkout \
  -H 'content-type: application/json' \
  -d '{"sku":"corvus","email":"you@example.com"}'
# → { "ok": true, "url": "https://checkout.stripe.com/..." }
```

### Admin invoice draft

```bash
curl -s -X POST https://valhallaco.org/api/stripe/invoice \
  -H 'content-type: application/json' \
  -H 'cookie: vh_admin_session=…' \
  -d '{
    "email":"partner@example.com",
    "name":"Partner LLC",
    "amountCents":250000,
    "lineLabel":"Valhalla partner briefing",
    "audience":"partner",
    "address":{
      "line1":"510 Townsend St",
      "city":"San Francisco",
      "state":"CA",
      "postal_code":"94103",
      "country":"US"
    }
  }'
```

## Next steps

1. Eason sets `STRIPE_SECRET_KEY` (`sk_test_…`) in Vercel — privately.
2. Set `VITE_STRIPE_PUBLISHABLE_KEY` to the `pk_test_…` above; redeploy.
3. Enable Tax + Invoicing in Dashboard; add webhook + `STRIPE_WEBHOOK_SECRET`.
4. Smoke-test `/api/stripe/status` then a test Checkout with `STRIPE_CHECKOUT_ENABLED=true` on Preview only.
5. Persist paid sessions (Supabase) from webhook handlers when ledgers need it.
6. Optionally create Dashboard Products/Prices and switch Checkout from `price_data` to Price IDs.
7. Flip production checkout only when legal/compliance is ready; keep public copy as interest/holds, not fulfillment.

## Files

- `api/stripe/[...slug].js` — routes
- `api/_lib/stripeClient.js` — client + catalog + flags
- `src/lib/stripeBrowser.js` — publishable key + fetch helpers
- `package.json` — `stripe` dependency
