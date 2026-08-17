# Valhalla Multi-Launch Hub

Living Mosaic hub for twelve halls across land, water, air, and space.

- Production: https://valhallaco.org
- Discord: https://discord.gg/JA6wrNg6n

## Stack

React + Vite + Tailwind · Vercel serverless `/api` · Discord bot in `/discord-bot`

## Local

```bash
npm install
npm run dev
```

Admin API needs env (see below). Without it, `/admin` login returns 503.

## Launch day flow

1. **Before 8:00 AM PDT**, hub shows only Valhalla + countdown (no mosaic, email, or menu chrome).
2. **8:00 AM**, mosaic + email appear; wave 1 (Wolf → Njord) unlocks on the time chain.
3. **After Njord**, break until **2:00 PM PDT**.
4. **Wave 2 (Eagle → Corvus)** opens on the same timed chain starting at **2:00 PM PDT** (no visitor unlock codes).

Demo / time-travel is **admin-only**. Unauthenticated `/?demo=1` redirects to `/admin` login; leftover demo localStorage is ignored for public visitors. After founder login, use `/admin` → **Reveal** (watch full reveal, pause, speed, scrub) or open `/?demo=1` while the session cookie is active. Same localStorage clock as the hub; live schedule is unchanged for everyone else.

**Founder entry (secret rune):** On `/flow`, a faint runic hex sits in the **bottom-right** corner of the parchment board. Click → `/admin`. The public hamburger no longer lists Admin (Team login remains). Bookmarks to `/admin` still work.

**Locale:** UI chrome (nav, hub countdown labels, flow board chrome, email form, audience pages) auto-detects `navigator.language` (en, es, fr, de, zh, ja, pt). Optional override via `localStorage` key `valhalla_locale` if a picker is added later. Long-form company product copy stays English for now.

### Hall codes (admin optional)

- Founder can still manage codes in `/admin` → **Hall codes** (Supabase `hall_codes` or memory fallback).
- Env fallbacks: `HALL_CODE_EAGLE`, `HALL_CODE_OLYMPUS`, `HALL_CODE_AEOLUS`, `HALL_CODE_PHENIX`, `HALL_CODE_AETHER`, `HALL_CODE_CORVUS`.
- Public experience is schedule-only; visitor code entry UI is removed.

### Social tower

- `/admin` → **Socials**: LinkedIn, Instagram, X, Discord (+ follower notes / last-checked) per company.
- Persists in Supabase `company_socials` (see migration). Empty rows auto-seed defaults (Wolf `wolf_transit`, Holm `holm_development`; other halls may use placeholders). Hub / empire Instagram is `valhalla__42`.
- Public company pages + hub footer render LinkedIn / Instagram / X as compact icons (only when a URL is set).

### Site chat

- Compact **Ask** widget on each open hall + live hub → `/admin` → **Inbox** (human reply).
- APIs: `POST/GET /api/hub/chat`, `GET/POST /api/admin/inbox`.
- Run `supabase/migrations/20260813_site_chat.sql` for durable storage.

## Vercel environment

Set in Vercel → Project → Settings → Environment Variables (Production + Preview):

| Name | Notes |
|---|---|
| `ADMIN_PASSWORD` | Server-only. Never `VITE_*`. |
| `ADMIN_SESSION_SECRET` | Long random string for signing httpOnly cookies |
| `ADMIN_TOTP_SECRET` | Base32 secret for authenticator 2FA. `npm run admin:totp` |
| `ADMIN_PASSWORD_HASH` | Optional instead of `ADMIN_PASSWORD`: `salt:hex` from scrypt |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only, never `VITE_*` |
| `HALL_CODE_*` | Optional wave-2 code fallbacks |
| `STRIPE_SECRET_KEY` | Server-only `sk_test`/`sk_live`. Never `VITE_*`, never commit. |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Browser `pk_test`/`pk_live`. Redeploy after change. |
| `STRIPE_WEBHOOK_SECRET` | Server-only `whsec_…` for `/api/stripe/webhook` |
| `STRIPE_CHECKOUT_ENABLED` | Set `true` only when ready; public halls stay email-only by default |

See **[docs/supabase-setup.md](docs/supabase-setup.md)** and **[docs/stripe-setup.md](docs/stripe-setup.md)**.

Admin email is fixed: **info@valhallaco.org**. Login needs password **and** a 6-digit authenticator code.

```bash
npm run admin:totp   # prints ADMIN_TOTP_SECRET, do not commit it
npx vercel env add ADMIN_PASSWORD
npx vercel env add ADMIN_SESSION_SECRET
npx vercel env add ADMIN_TOTP_SECRET
npx vercel --prod
```

## Routes

| Path | Purpose |
|---|---|
| `/` | Hub (countdown-gated, then mosaic) |
| `/flow` | Network board; secret founder rune (bottom-right) → `/admin` |
| `/press` | Press release |
| `/investors` `/consumers` `/partners` | Audience pages |
| `/roadmap` | Roadmap index |
| `/contact` | Contact |
| `/admin` | Founder control tower (2FA), reveal clock, people, codes, socials, ledgers |
| `/team` | Team workspace |
| `/team/login` | Email + password |
| `/team/join?token=` | Accept invite |
| `/{company}` | Company hall |
| `/aphrodite` | Aphrodite — competition dating MVP ($20/mo) |

### Aphrodite

Competition dating for Valhalla. See **[docs/aphrodite.md](docs/aphrodite.md)** (OAuth Dashboard setup, Stripe subscription, Instagram stub). Menu → fine print **Aphrodite**.

### Team seats

1. Sign in at `/admin` as founder.
2. Open **People** → invite email + role + halls → copy invite link.
3. Teammate opens link, sets password, works at `/team`.

## Payments (Stripe)

See **[docs/stripe-setup.md](docs/stripe-setup.md)**. Catch-all: `/api/stripe/*`. Hall estimate stubs remain in `src/data/payLinks.js` (email-only until `STRIPE_CHECKOUT_ENABLED`). Holds are **fully refundable**; no shipping claims on public CTAs.

## Discord Odin

See `discord-bot/README.md`. Needs `DISCORD_TOKEN` on a persistent host.

## DNS

See `docs/domain-dns.md`. Keep Google Workspace MX/SPF/DKIM; replace Squarespace A/CNAME with Vercel only.
