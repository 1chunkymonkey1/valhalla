# Valhalla Council

Founder-only AI workspace in **Admin → Council**. Eighteen Raven agents, each preloaded from Desktop `Valhalla/Council` source files (copied into this repo).

## Open it

1. Sign in at `/admin` (founder session + 2FA).
2. Open the **Council** tab.
3. Click an agent for a direct thread, or **Open chamber (all 18)** for multi-agent traffic.
4. Type normally. Use `@athena`, `@lex`, `@all` (or `@council`) to route or broadcast.
5. Set a **Shared goal**, then **Run round** for one bounded autonomous pass (cooldown + caps — not an infinite loop).

Hall **Inbox** (visitor Ask chat) stays separate. Council is the primary internal AI desk.

## Connect AI tonight

Full steps: **[ai-setup.md](./ai-setup.md)**.

Short version:

1. Vercel → Environment Variables → set `AI_GATEWAY_API_KEY` **or** `OPENAI_API_KEY` **or** `CURSOR_API_KEY` (Production + Preview).
2. Optional: `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` + run `20260814_council.sql` and `20260814_ai_settings.sql`.
3. Redeploy.
4. `/admin` → AI setup panel shows **ready** / **missing** per provider. Pick Cursor model to switch frontier models. Save.

## The 18 agents

| ID | Name | Role |
| --- | --- | --- |
| `athena` | Athena | Strategic intelligence |
| `apollo` | Apollo | Brand, narrative, and public presence |
| `asclepius` | Asclepius | Health, recovery, and founder stamina |
| `daedalus` | Daedalus | Systems design and architecture |
| `demeter` | Demeter | Land energy and agrivoltaics |
| `helios` | Helios | Brand and narrative intelligence |
| `hephaestus` | Hephaestus | Manufacturing, build, and platforms |
| `hermes` | Hermes | Communications, routing, and outreach |
| `icarus` | Icarus | Commander — Raven Intelligence Network |
| `lex` | Lex | Legal intelligence |
| `natasha` | Natasha | Frameworks and operating systems |
| `poseidon` | Poseidon | Maritime and water domain |
| `seshat` | Seshat | Language, measurement, and canon |
| `sol` | Sol | Atoll product & solar presentation |
| `teddy` | Teddy | Abundance doctrine and Jefferson line |
| `thor` | Thor | Wolf / land movement doctrine |
| `victory` | Victory | Performance and competitive excellence |
| `zeus` | Zeus | Sky/space boundary and Phenix |

Full doctrine/knowledge: `council/agents/<id>.md`. Runtime prompts (truncated): `api/_lib/councilAgentDefs.js`. Roster for UI: `src/data/councilAgents.js`.

## API (founder cookie only)

Catch-all: `/api/admin/council` (Hobby-safe).

- `GET` — threads + agents (or `?id=<threadId>`, `?view=agents`)
- `POST` actions: `create`, `message`, `ask`, `round`, `goal`, `close`, `open-thread`

AI status/prefs: `/api/admin/ai` (`GET` status, `POST` save provider + models).

## Env

See [ai-setup.md](./ai-setup.md). Summary:

- `CURSOR_API_KEY` (frontier models via Cursor cloud agents) **and/or**
- `AI_GATEWAY_API_KEY` (preferred fast path) **and/or**
- `OPENAI_API_KEY` **or**
- Vercel OIDC on deployment

Optional: `VH_CHAT_MODEL`, `VH_CURSOR_MODEL`.

Persistence:

- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- Migrations: `supabase/migrations/20260814_council.sql`, `20260814_ai_settings.sql`

Without Supabase, threads + AI prefs live in memory (same instance only).

## Safety

- **Run round** is explicit; max 3 passes, ≤6 speakers/round, 8s cooldown.
- Mentions fan-out capped at 6 replies per founder message.
- Public mosaic, Ask chat, and SiteChrome are unchanged.
