# Aphrodite — competition dating (Valhalla ecosystem)

> **Name:** Aphrodite (no product collision in this repo; council “Aphrodite” is a Media & Style agent pairing only). Alternate shortlist if ever needed: **Thalia**.

Match-based dating for competitors — chess, sports, Clash Royale, track, esports. Valhalla black/white + brand-mark, Source Serif 4. **Not** a Checkmate clone (no Checkmate trademarks, logos, or verbatim copy). Feature parity inspiration only.

**Live path:** `/aphrodite` on [valhallaco.org](https://valhallaco.org)

## Product

| Item | Value |
|---|---|
| Price | **$20/month** Stripe subscription |
| Auth | Google, Apple, X (Twitter), Discord, Facebook (Meta) via Supabase; Instagram Login **stub** |
| Profile links | Chess.com, MaxPreps, Instagram, Clash Royale |
| Dates stored | `signed_up_at`, `approved_at` |
| Gating | Matches/deck require `subscription_status` in `active` \| `trialing` |

## Routes

| Path | Purpose |
|---|---|
| `/aphrodite` | Marketing home |
| `/aphrodite/sign-up` | Intents + competitions + OAuth |
| `/aphrodite/sign-in` | OAuth providers |
| `/aphrodite/subscribe` | $20/mo Stripe Checkout (or demo activate in test) |
| `/aphrodite/matches` | Swipe deck + mutual matches |
| `/aphrodite/profile` | Edit profile + linked accounts |
| `/aphrodite/settings` | Account dates, membership, backend flags |

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
| `/api/aphrodite/matches` | GET | Bearer + sub |
| `/api/aphrodite/subscribe` | POST | Bearer → Stripe Checkout |
| `/api/aphrodite/confirm-checkout` | POST | Bearer |
| `/api/aphrodite/demo-activate` | POST | Bearer (blocked if `sk_live`) |

Stripe catalog SKU `aphrodite` also lives in `api/_lib/stripeClient.js`. Webhook activates membership on `checkout.session.completed` / subscription events.

## Supabase

1. Run migration: `supabase/migrations/20260815_aphrodite.sql`
2. Env (already used by Valhalla):
   - Server: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - Client: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
3. **Authentication → URL config** — add redirect allowlist:
   - `https://valhallaco.org/aphrodite/sign-in`
   - `http://localhost:5173/aphrodite/sign-in` (local)

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

| Env | Notes |
|---|---|
| `STRIPE_SECRET_KEY` | Required for real Checkout (`sk_test_…` first) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Client publishable key |
| `STRIPE_WEBHOOK_SECRET` | Recommended; events include Aphrodite subscription sync |
| `STRIPE_CHECKOUT_ENABLED` | Still gates **hall interest holds** only — Aphrodite subscriptions work whenever the secret key is set |

### Dashboard steps for Aphrodite

1. Ensure test mode keys are on Vercel (see pending reminder below).
2. Webhook endpoint: `https://valhallaco.org/api/stripe/webhook`
3. Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`
4. Test card: `4242 4242 4242 4242`
5. Optional: create a reusable Product/Price in Dashboard later; MVP uses `price_data` inline at $20/mo.

**Demo activate** on `/aphrodite/subscribe` marks the member active without Stripe when not in `sk_live` (local/memory or test).

## Checkmate feature catalog (research — do not copy)

Public pages observed on checkmate.li:

- Home, About, Contact
- Sign in (Apple / Google / Email)
- Sign up / waitlist (intents: Love, Hookup, Friends, Competition; hobbies; DOB; invite code)
- Reset password
- Legal: Terms, Privacy, Acceptable use, Law enforcement, Unsubscribe, Sitemap
- Product thesis: verified members, games-first (chess/crossword), paid ($35/mo), no swiping on their marketing

Aphrodite MVP maps: marketing + OAuth + profile links + **swipe/match** (requested) + **$20/mo** paywall + Valhalla chrome. No ID-verification pipeline in this MVP.

## Pending reminders for Eason

### Stripe on Vercel (from stripe-setup — still pending if not finished)

- Set `STRIPE_SECRET_KEY` + `VITE_STRIPE_PUBLISHABLE_KEY`, redeploy
- Activate Stripe Tax, add webhook + `STRIPE_WEBHOOK_SECRET`
- Keep `STRIPE_CHECKOUT_ENABLED` off until hall holds are intentionally live

### Hall leads roster

`public/investors/leads.md` — **12 hall CEOs filled**. Meridian lead still `[[FILL]]`.

## Local smoke

```bash
npm run dev
# open /aphrodite
# without Supabase: status shows memory demo; OAuth buttons explain missing env
# with Supabase + Stripe test keys: sign-in → subscribe → matches
```
