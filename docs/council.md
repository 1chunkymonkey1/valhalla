# Valhalla Council

Founder-only AI workspace in **Admin → Council**. Eighteen Raven agents, each preloaded from Desktop `Valhalla/Council` source files (copied into this repo).

## Open it

1. Sign in at `/admin` (founder session + 2FA).
2. Open the **Council** tab.
3. Click an agent for a direct thread, or **Open chamber (all 18)** for multi-agent traffic.
4. Type normally. Use `@athena`, `@lex`, `@all` (or `@council`) to route or broadcast.
5. Set a **Shared goal**, then **Run round** for one bounded autonomous pass (cooldown + caps — not an infinite loop).

Hall **Inbox** (visitor Ask chat) stays separate. Council is the primary internal AI desk.

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

## Env

Same AI surface as hall chat:

- `AI_GATEWAY_API_KEY` (preferred) **or**
- `OPENAI_API_KEY` **or**
- Vercel OIDC on deployment

Optional: `VH_CHAT_MODEL` (default `openai/gpt-5.4-mini`).

Persistence:

- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- Run migration `supabase/migrations/20260814_council.sql`

Without Supabase, threads live in memory (same instance only).

## Safety

- **Run round** is explicit; max 3 passes, ≤6 speakers/round, 8s cooldown.
- Mentions fan-out capped at 6 replies per founder message.
- Public mosaic, Ask chat, and SiteChrome are unchanged.
