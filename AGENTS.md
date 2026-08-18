# AGENTS.md

## Cursor Cloud specific instructions

Non-obvious context for developing this repo in a Cloud Agent VM. Standard setup/run commands live in `README.md`, `discord-bot/README.md`, and `docs/`.

### Layout: two independent npm projects
- Root (`/workspace`): React 19 + Vite 8 + Tailwind 4 web app, plus Vercel serverless functions under `api/`. Package manager is npm (has `package-lock.json`).
- `discord-bot/`: standalone `discord.js` bot ("Odin"), its own `package.json` with **no lockfile** (use `npm install`, not `npm ci`). Requires `DISCORD_TOKEN` + a persistent host; not needed to run/test the website.
- Requires Node >= 20 (VM has Node 22, which works).

### Running the app (important gotcha)
- `npm run dev` runs plain Vite and serves **only the frontend** on port `5173`. `vite.config.js` has **no proxy**, so `/api/*` serverless routes are **not** served locally by Vite and will 404. The frontend still renders fully with client-side fallbacks.
- True full-stack local dev (frontend + `/api` together) is `vercel dev` (default port `3000`). This needs the Vercel CLI plus Vercel auth/project link, so it generally **cannot run offline** in the Cloud VM without a Vercel token. Prefer `npm run dev` for UI work.
- The `api/` handlers are Vercel-style `(req, res)` functions; there is no committed local HTTP harness besides `vercel dev`.

### Exercising the API without an HTTP server
- `npm run chat:inprocess` imports `api/_lib/siteChat.js` directly and validates the "Ask the hall" chat + admin inbox flow using the in-memory fallback store. This is the fastest way to sanity-check API library logic without `vercel dev`. (`npm run chat:load-test` targets a running `BASE_URL`, default `http://127.0.0.1:3000`.)

### Env / degraded-mode behavior
- No env vars are committed (`.env*` is gitignored). Without `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`, the API falls back to **in-memory** storage (not durable across cold starts / instances). Without AI keys (`AI_GATEWAY_API_KEY`/`OPENAI_API_KEY`), chat uses a heuristic reply.
- `/admin` login returns **503** unless admin env is set (`ADMIN_PASSWORD`/`ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, `ADMIN_TOTP_SECRET`). Generate a TOTP secret with `npm run admin:totp`. See `docs/supabase-setup.md` for DB setup + SQL migrations in `supabase/migrations/`.

### Launch clock (affects what the hub renders)
- The launch schedule date is `2026-08-13` (`src/data/schedule.js`). Because that date is in the past, the hub renders the **full 12-company mosaic** live (no countdown gate). If tests need the pre-reveal countdown state, change/mocking the clock is required.
- Demo / time-travel (`/?demo=1`) is gated behind founder admin login (`DemoAccessGate`); unauthenticated `?demo=1` redirects to `/admin`.

### Lint / build
- Lint: `npm run lint` (oxlint) — currently emits warnings only, exits 0.
- Build: `npm run build` (Vite → `dist/`).
