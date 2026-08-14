# AI setup (Council + hall Ask)

> **REMIND EASON:** Finish Vercel AI keys (`CURSOR_API_KEY` / `AI_GATEWAY_API_KEY` / `OPENAI_API_KEY`), run `20260814_ai_settings.sql`, redeploy, then Admin → AI setup. You said you’d do this later.

Dead-simple path to turn on AI replies for **Admin → Council** and public **Ask** chat.

## Tonight: connect a key (numbered)

1. Open [Vercel Dashboard](https://vercel.com) → this project → **Settings → Environment Variables**.
2. Add **one** of these for both **Production** and **Preview** (and Development if you use `vercel env pull`):
   - **`AI_GATEWAY_API_KEY`** — preferred fast path (Vercel AI Gateway)
   - **`OPENAI_API_KEY`** — direct OpenAI fallback
   - **`CURSOR_API_KEY`** — Cursor Agent API (frontier model switching; slower cloud agents)
3. Optional defaults:
   - `VH_CHAT_MODEL` — Gateway/OpenAI model id (default `openai/gpt-5.4-mini`)
   - `VH_CURSOR_MODEL` — Cursor model id (default `composer-2.5`)
4. For durable threads + saved Admin model prefs, also set:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. In Supabase SQL Editor, run migrations listed below (if not already).
6. **Redeploy** the project (env vars apply on the next deployment). Server-only keys do **not** need a Vite rebuild; only `VITE_*` keys require a client rebuild/redeploy.
7. Sign in at `/admin` → **Overview** or **Council** → check **AI setup**:
   - Each provider shows **ready** or **missing**
   - Pick provider + model → **Save AI prefs**
8. Send a Council message or Ask chat. If status says missing keys, go back to step 2.

Never commit `.env` / secrets. Keys live only in Vercel (or local `.env` for `vercel dev`).

## Provider order

When Admin provider is **Auto** (default):

1. **Cursor** — if `CURSOR_API_KEY` is set **and** a Cursor model is selected  
2. **AI Gateway** — if `AI_GATEWAY_API_KEY` or Vercel OIDC is present  
3. **OpenAI** — if `OPENAI_API_KEY` is set  
4. Else graceful fallback: “AI not configured” / heuristic hall reply

You can force **Cursor only**, **Gateway only**, or **OpenAI only** in Admin → AI setup.

## Model switching (Cursor)

1. Set `CURSOR_API_KEY` from [Cursor Dashboard → API Keys](https://cursor.com/dashboard/api) (user key) or a team service-account key. Team Admin keys are not supported by the SDK yet.
2. Redeploy.
3. In Admin → AI setup, open **Cursor model** — list comes from `Cursor.models.list` / `GET /v1/models` for your account.
4. Save. Council + Ask use that model on the next reply.

Gateway/OpenAI model is a separate picker (`VH_CHAT_MODEL` / Admin chat model).

## Env var names

| Variable | Role |
| --- | --- |
| `CURSOR_API_KEY` | Cursor Agent API (`@cursor/sdk` / Cloud Agents REST) |
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway |
| `OPENAI_API_KEY` | Direct OpenAI via `@ai-sdk/openai` |
| `VH_CURSOR_MODEL` | Default Cursor model id |
| `VH_CHAT_MODEL` | Default Gateway/OpenAI model id |
| `SUPABASE_URL` | Durable chat/council/AI prefs |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Supabase writes |
| `VERCEL` + OIDC | Automatic Gateway auth on Vercel deployments when OIDC is available |

## SQL migrations (run in order if missing)

1. `supabase/migrations/20260813_site_chat.sql`
2. `supabase/migrations/20260814_chat_ai_flags.sql`
3. `supabase/migrations/20260814_council.sql`
4. `supabase/migrations/20260814_ai_settings.sql` ← Admin provider/model prefs

Also useful for the rest of Admin: empire, hall codes, page layouts, dispatch (see `docs/supabase-setup.md`).

## Code path (verified)

- Hall Ask: `api/hub/[...slug].js` → `api/_lib/siteChat.js` → `api/_lib/chatAi.js` → provider stack
- Council: `api/admin/[...slug].js` (`/api/admin/council`) → `api/_lib/councilStore.js` → `api/_lib/councilAi.js` → same stack
- Status / prefs: `/api/admin/ai` → `api/_lib/aiStatus.js` + `api/_lib/aiSettings.js`
- Cursor: `api/_lib/cursorAi.js` — `@cursor/sdk` `Agent.prompt` with **`cloud: { repos: [] }`** (no-repo cloud agent). REST create+poll fallback if SDK fails.

## Cursor on Vercel — limitations (honest)

- **Cloud only on serverless.** Local SDK runtime needs a machine `cwd`; Valhalla uses **no-repo cloud agents** so replies work from Vercel Functions.
- **Latency.** Each Cursor reply provisions/runs a cloud agent. Often slower than Gateway/OpenAI; can exceed **Hobby 10s** function limits. Prefer Pro / longer `maxDuration`, or use Gateway for Ask and Cursor for Council.
- **No-repo agents** must be enabled for your Cursor account/team; repo-scoped keys cannot create them.
- **Billing** follows Cursor SDK/cloud usage (same pools as IDE cloud agents).
- **Node ≥ 22.13** required by `@cursor/sdk`.
- Prefer Gateway/OpenAI when you need fast visitor Ask replies.

## Admin UI

- **Overview** and **Council** show **AI setup**: credential ready/missing, active provider, model pickers, Save.
- Status never returns secret values — only `set` / `missing`.

## Related

- Council product notes: [council.md](./council.md)
- Supabase overview: [supabase-setup.md](./supabase-setup.md)
