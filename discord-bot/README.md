# Odin — Valhalla Discord Bot

Q&A + light content moderation for the Valhalla community.

Invite: https://discord.gg/JA6wrNg6n

## Setup

1. Create an application at https://discord.com/developers/applications
2. Bot → Reset Token → copy token (never commit it)
3. Enable **Message Content Intent** (and Server Members if you expand moderation)
4. OAuth2 → URL Generator → scopes `bot` + `applications.commands`
5. Bot permissions: Send Messages, Manage Messages, Read Message History, Moderate Members (optional)
6. Invite the bot to your server

```bash
cd discord-bot
cp .env.example .env   # set DISCORD_TOKEN
npm install
npm start
```

## Environment

| Var | Required | Purpose |
|---|---|---|
| `DISCORD_TOKEN` | yes | Bot token |
| `ODIN_MOD_LOG_CHANNEL_ID` | no | Channel for moderation notices |
| `ODIN_BANNED_PHRASES` | no | Comma-separated scam phrases |

## How to ask Odin

- Mention: `@Odin what is Wolf?`
- Prefix: `odin, explain refundable reservations`
- Prefix: `!odin bifrost`

Answers come from `src/knowledge.js` — curated, no false operational claims.

## Proposed channel structure

```
#announcements          — official drops only
#general                — community
#investors              — diligence Q&A (no solicit spam)
#partners               — manufacturers / operators / sites
#consumers              — riders, travelers, homeowners
#moderation-log         — Odin + mod notes
#hall-wolf … #hall-corvus  — one hall per company (12)
#press                  — embargoed / released copy
```

Optional categories: **Land**, **Water**, **Air**, **Space**, **Empire**.

## Deploy

Run on a small always-on host (Railway, Fly.io, a VPS). Discord bots need a persistent WebSocket — not a Vercel serverless function.
