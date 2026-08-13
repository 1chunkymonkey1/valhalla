# Valhalla Multi-Launch Hub

Living Mosaic hub for twelve companies across land, water, air, and space.

- Production: https://valhalla-hazel.vercel.app
- Domain (pending DNS): https://valhallaco.org
- Discord: https://discord.gg/JA6wrNg6n

## Stack

React + Vite + Tailwind · Vercel serverless `/api` · Discord bot in `/discord-bot`

## Local

```bash
npm install
npm run dev
```

Admin API needs env (see below). Without it, `/admin` login returns 503.

## Vercel environment (required for admin)

Set in Vercel → Project → Settings → Environment Variables (Production):

| Name | Notes |
|---|---|
| `ADMIN_PASSWORD` | Server-only. Never `VITE_*`. Rotate if exposed in chat. |
| `ADMIN_SESSION_SECRET` | Long random string for signing httpOnly session cookies |
| `ADMIN_PASSWORD_HASH` | Optional instead of `ADMIN_PASSWORD`: `salt:hex` from scrypt |

Admin email is fixed: **info@valhallaco.org**

```bash
npx vercel env add ADMIN_PASSWORD
npx vercel env add ADMIN_SESSION_SECRET
npx vercel --prod
```

## Routes

| Path | Purpose |
|---|---|
| `/` | Mosaic + email capture + menu |
| `/flow` | Network interconnection chart |
| `/press` | Press release |
| `/investors` `/consumers` `/partners` | Audience pages |
| `/roadmap` | Roadmap index |
| `/contact` | Contact |
| `/admin` | Password-gated ledger |
| `/{company}` | Company hall (chain unlock timing preserved) |

## Pay Links

Stubs in `src/data/payLinks.js`. Paste Squarespace Pay Link URLs when ready. All holds are **fully refundable**.

## Discord Odin

See `discord-bot/README.md`. Needs `DISCORD_TOKEN` on a persistent host.

## DNS

See `docs/domain-dns.md`. Keep Google Workspace MX/SPF/DKIM; replace Squarespace A/CNAME with Vercel only.
