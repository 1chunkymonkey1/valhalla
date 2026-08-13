# Valhalla Multi-Launch Hub

Living Mosaic hub for twelve companies across land, water, air, and space.

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

1. **Before 8:00 AM PDT** — hub shows only Valhalla + countdown (no mosaic, email, or menu chrome).
2. **8:00 AM** — mosaic + email appear; wave 1 (Wolf → Njord) unlocks on the time chain.
3. **After Njord** — break until **2:00 PM PDT**.
4. **Wave 2 (Eagle → Corvus)** — each hall needs an Instagram unlock code (sequential). Enter on the hub or the locked hall page.

Demo the full clock with `/?demo=1`.

### Hall codes

- Founder sets codes in `/admin` → **Hall codes** (stored in Supabase `hall_codes`, or memory fallback).
- Env fallbacks: `HALL_CODE_EAGLE`, `HALL_CODE_OLYMPUS`, `HALL_CODE_AEOLUS`, `HALL_CODE_PHENIX`, `HALL_CODE_AETHER`, `HALL_CODE_CORVUS`.
- Public redeem: `POST /api/hub/unlock` → httpOnly unlock cookie.
- Status: `GET /api/hub/status`.

### Social tower

- `/admin` → **Socials**: LinkedIn, Instagram, X, Discord (+ follower notes / last-checked) per company.
- Persists in Supabase `company_socials` (see migration). Empty rows auto-seed suggested placeholder handles.
- Surfaces on company pages (about + footer), `/team`, and lightly on the live hub.

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
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only — never `VITE_*` |
| `HALL_CODE_*` | Optional wave-2 code fallbacks |

See **[docs/supabase-setup.md](docs/supabase-setup.md)**.

Admin email is fixed: **info@valhallaco.org**. Login needs password **and** a 6-digit authenticator code.

```bash
npm run admin:totp   # prints ADMIN_TOTP_SECRET — do not commit it
npx vercel env add ADMIN_PASSWORD
npx vercel env add ADMIN_SESSION_SECRET
npx vercel env add ADMIN_TOTP_SECRET
npx vercel --prod
```

## Routes

| Path | Purpose |
|---|---|
| `/` | Hub (countdown-gated, then mosaic) |
| `/flow` | Network interconnection chart |
| `/press` | Press release |
| `/investors` `/consumers` `/partners` | Audience pages |
| `/roadmap` | Roadmap index |
| `/contact` | Contact |
| `/admin` | Founder control tower (2FA) — people, codes, socials, ledgers |
| `/team` | Team workspace |
| `/team/login` | Email + password |
| `/team/join?token=` | Accept invite |
| `/{company}` | Company hall |

### Team seats

1. Sign in at `/admin` as founder.
2. Open **People** → invite email + role + halls → copy invite link.
3. Teammate opens link, sets password, works at `/team`.

## Pay Links

Stubs in `src/data/payLinks.js`. Paste Squarespace Pay Link URLs when ready. All holds are **fully refundable**.

## Discord Odin

See `discord-bot/README.md`. Needs `DISCORD_TOKEN` on a persistent host.

## DNS

See `docs/domain-dns.md`. Keep Google Workspace MX/SPF/DKIM; replace Squarespace A/CNAME with Vercel only.
