# Aphrodite — competition dating (Valhalla ecosystem)

> **Name:** Aphrodite (no product collision in this repo; council “Aphrodite” is a Media & Style agent pairing only). Alternate shortlist if ever needed: **Thalia**.

Match-based dating for competitors — chess, sports, Clash Royale, track, esports. Valhalla black/white + brand-mark, Source Serif 4. **Not** a Checkmate clone (no Checkmate trademarks, logos, or verbatim copy). Feature parity inspiration only.

**Live path:** `/aphrodite` on [valhallaco.org](https://valhallaco.org)

App Store packaging and Eason-only Apple clicks: [docs/aphrodite-app-store.md](./aphrodite-app-store.md).

## Product

| Item | Value |
|---|---|
| Price | **$20/month** Stripe subscription |
| Auth | Google, Apple, X, Discord, Facebook, **email/password** via Supabase; Instagram Login **stub** |
| Profile links | Chess.com, MaxPreps, Instagram, Clash Royale |
| Dates stored | `signed_up_at`, `approved_at` |
| Gating | Matches/deck/messages require `subscription_status` in `active` \| `trialing` **and** birth date 18+ |
| Safety | Block, report (harassment / fake / underage / spam / other), deactivate |
| Legal | `/aphrodite/privacy` `/aphrodite/terms` `/aphrodite/safety` (App Store URLs) |

## Routes

| Path | Purpose |
|---|---|
| `/aphrodite` | Marketing home |
| `/aphrodite/sign-up` | Intents + competitions + OAuth |
| `/aphrodite/sign-in` | Email + OAuth providers |
| `/aphrodite/matches` | Swipe deck + mutual matches |
| `/aphrodite/matches/:id` | Match thread (block/report) |
| `/aphrodite/profile` | Edit profile + linked accounts + birth date |
| `/aphrodite/settings` | Account, membership, deactivate |
| `/aphrodite/subscribe` | $20/mo Stripe (web) or Apple IAP (native) |
| `/aphrodite/privacy` | Privacy notice |
| `/aphrodite/terms` | Terms |
| `/aphrodite/safety` | Safety / block-report |

Subtle entry: site menu fine print → **Aphrodite**.

## API (Hobby-safe catch-all)

`api/aphrodite/[...slug].js` — one Vercel function.

| Route | Method | Auth |
|---|---|---|
| `/api/aphrodite/status` | GET | public |
| `/api/aphrodite/session` | POST | Bearer |
| `/api/aphrodite/me` | GET/PATCH | Bearer |
| `/api/aphrodite/deck` | GET | Bearer + sub |
| `/api/aphrodite/swipe` | POST | Bearer + sub |
| `/api/aphrodite/matches` | GET | Bearer + sub + 18+ |
| `/api/aphrodite/messages` | GET/POST | Bearer + sub + 18+ |
| `/api/aphrodite/block` | POST | Bearer + sub + 18+ |
| `/api/aphrodite/report` | POST | Bearer + sub + 18+ |
| `/api/aphrodite/deactivate` | POST | Bearer |
| `/api/aphrodite/iap` | POST | Bearer · StoreKit / test unlock |
| `/api/aphrodite/subscribe` | POST | Bearer → Stripe Checkout |
| `/api/aphrodite/confirm-checkout` | POST | Bearer |
| `/api/aphrodite/demo-activate` | POST | Bearer (blocked if `sk_live`) |

Stripe catalog SKU `aphrodite` also lives in `api/_lib/stripeClient.js`. Webhook activates membership on `checkout.session.completed` / subscription events.

## Supabase

1. Run migration: `supabase/migrations/20260815_aphrodite.sql` (profiles, swipes, matches)
2. Run migration: `supabase/migrations/20260818_aphrodite_ops.sql` (messages, blocks, reports)
3. Env:
   - Server (on Vercel today): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - Client (**still missing on Vercel** — required for OAuth buttons): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. **Authentication → URL Configuration** — redirect allowlist must include:
   - `https://valhallaco.org/aphrodite/sign-in`
   - `https://valhallaco.org/aphrodite/**`
   - `http://localhost:5173/aphrodite/sign-in`
   - `http://localhost:5173/aphrodite/**`

App OAuth uses `redirectTo = ${origin}/aphrodite/sign-in` (see `src/lib/aphroditeClient.js`). Provider consoles must use Supabase’s callback, not the app URL:

```text
https://bhivwdibbykbcbdxetob.supabase.co/auth/v1/callback
```

### OAuth providers (Dashboard credentials required)

| Provider | Supabase provider | What you must configure |
|---|---|---|
| **Google (Gmail)** | Google | Google Cloud OAuth client; enable in Supabase Auth → Google |
| **Apple** | Apple | Apple Developer Services ID, key, team ID; enable Apple in Supabase |
| **X (Twitter)** | Twitter | X Developer app API key/secret; enable Twitter in Supabase |
| **Discord** | Discord | Discord app Client ID/secret; enable Discord in Supabase |
| **Facebook** | Facebook | Meta app; enable Facebook in Supabase (Instagram-adjacent login) |
| **Instagram** | — | **Stub.** Instagram Login needs Meta Instagram product + special setup. MVP: Facebook OAuth for auth + **Instagram handle** field on Profile. Document when Meta app is ready. |

Until a provider is enabled in Supabase, its button will error with the provider’s Dashboard message — that is expected.

## Stripe

Uses the same foundation as [docs/stripe-setup.md](./stripe-setup.md).

| Env | Vercel (2026-08-16) | Notes |
|---|---|---|
| `VITE_STRIPE_PUBLISHABLE_KEY` | **Set** (Prod + Preview) | `pk_test_…` — public; redeploy so Vite picks it up |
| `STRIPE_SECRET_KEY` | **Missing** | Eason must paste `sk_test_…` in Vercel (never chat) |
| `STRIPE_WEBHOOK_SECRET` | **Missing** | After webhook endpoint exists |
| `STRIPE_CHECKOUT_ENABLED` | unset / off | Gates **hall interest holds** only — Aphrodite Checkout works whenever `STRIPE_SECRET_KEY` is set |

### Webhook (shared Valhalla endpoint)

- **URL:** `https://valhallaco.org/api/stripe/webhook`
- **Code:** `api/stripe/[...slug].js` → `webhook` branch
- Aphrodite membership activates on `checkout.session.completed` when `metadata.sku` / `metadata.source` is `aphrodite`, and syncs on `customer.subscription.updated` / `deleted`

**Demo activate** on `/aphrodite/subscribe` marks the member active without Stripe when not in `sk_live` (local/memory or test).

## Do this now (Eason — ordered clicks)

Agents cannot finish secrets or OAuth consoles. Do these in order:

### 1. Supabase — Aphrodite tables

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → project **valhalla** (URL host `bhivwdibbykbcbdxetob`)
2. **SQL Editor** → **New query**
3. Paste entire contents of `supabase/migrations/20260815_aphrodite.sql`
4. **Run** → confirm tables `aphrodite_profiles`, `aphrodite_swipes`, `aphrodite_matches` in **Table Editor**

### 2. Supabase — Auth redirect URLs

1. **Authentication** → **URL Configuration**
2. **Site URL:** `https://valhallaco.org`
3. Add to **Redirect URLs** (keep existing admin/team entries):

```text
https://valhallaco.org/aphrodite/sign-in
https://valhallaco.org/aphrodite/**
http://localhost:5173/aphrodite/sign-in
http://localhost:5173/aphrodite/**
```

### 3. Supabase — OAuth providers (start with Google)

For each provider you want live on `/aphrodite/sign-in`:

1. Create app credentials in that provider’s console (Google Cloud / Apple / X / Discord / Meta)
2. **Authorized redirect URI** = `https://bhivwdibbykbcbdxetob.supabase.co/auth/v1/callback`
3. Supabase → **Authentication** → **Providers** → enable provider → paste Client ID + secret → Save

MVP minimum: **Google** only. Others can wait.

### 4. Vercel — client Supabase keys (required for OAuth UI)

These are **not** on Vercel yet (only server `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are):

1. Supabase → **Settings** → **API**
2. Vercel → Project **valhalla** → **Settings** → **Environment Variables**
3. Add for **Production + Preview**:
   - `VITE_SUPABASE_URL` = Project URL
   - `VITE_SUPABASE_ANON_KEY` = anon/public key
4. **Redeploy** Production after any `VITE_*` change

### 5. Vercel — Stripe secret (publishable already set)

1. Stripe Dashboard → **Developers** → **API keys** (test mode)
2. Vercel → add `STRIPE_SECRET_KEY` = `sk_test_…` for **Production + Preview** (paste only in Vercel UI — never chat)
3. Leave `STRIPE_CHECKOUT_ENABLED` unset/false (hall holds stay email-only)

### 6. Stripe — Tax + webhook

1. [Tax settings](https://dashboard.stripe.com/settings/tax) → register jurisdictions
2. **Developers** → **Webhooks** → **Add endpoint**
   - Endpoint URL: `https://valhallaco.org/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`
3. Copy signing secret `whsec_…` → Vercel `STRIPE_WEBHOOK_SECRET` (Prod + Preview)
4. Redeploy

### 7. Smoke `/aphrodite` on production

1. `curl -s https://valhallaco.org/api/aphrodite/status` → expect `supabase: true`, `stripeConfigured: true`
2. `curl -s https://valhallaco.org/api/stripe/status` → expect `configured: true`, `webhookConfigured: true`
3. Browser: `/aphrodite` → Sign up / Sign in (Google) → `/aphrodite/subscribe` → Checkout with `4242 4242 4242 4242` → `/aphrodite/matches`
4. Or use **Demo activate** on subscribe when `sk_test` is set but you want to skip card entry

## Prior agent status

| Item | State |
|---|---|
| Hall CEO leads (`public/investors/leads.md`) | **Done** — 12 halls filled (`cb512c3`). Meridian still `[[FILL]]`. |
| Stripe reminder in `docs/stripe-setup.md` | **Done** — REMIND block present. |
| `VITE_STRIPE_PUBLISHABLE_KEY` on Vercel | **Done** this session (Prod + Preview). |
| Aphrodite SQL migration applied | **Eason click** (SQL Editor) — no Supabase CLI/MCP in this workspace. |
| `STRIPE_SECRET_KEY` / webhook secret | **Eason click** |
| `VITE_SUPABASE_*` on Vercel | **Eason click** |
| OAuth provider consoles | **Eason click** |

## Checkmate feature catalog (research — do not copy)

Public pages observed on checkmate.li:

- Home, About, Contact
- Sign in (Apple / Google / Email)
- Sign up / waitlist (intents: Love, Hookup, Friends, Competition; hobbies; DOB; invite code)
- Reset password
- Legal: Terms, Privacy, Acceptable use, Law enforcement, Unsubscribe, Sitemap
- Product thesis: verified members, games-first (chess/crossword), paid ($35/mo), no swiping on their marketing

Aphrodite MVP maps: marketing + OAuth + profile links + **swipe/match** (requested) + **$20/mo** paywall + Valhalla chrome. No ID-verification pipeline in this MVP.

## Local smoke

```bash
npm run dev
# open /aphrodite
# without Supabase: status shows memory demo; OAuth buttons explain missing env
# with Supabase + Stripe test keys: sign-in → subscribe → matches
```
