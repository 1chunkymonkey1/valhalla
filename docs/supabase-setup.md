# Supabase setup for Valhalla durable memory

Team users, invites, tasks, notes, activity, email signups, reservations, hall codes, socials, site chat, and page layouts persist in Supabase Postgres. **Google sign-in** uses Supabase Auth (OAuth). We never store Google passwords in our database.

## 1. Create a project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project** → name it e.g. `valhalla`
3. Set a strong database password (save it)
4. Wait until the project is ready

Project URL used in production (example): `https://bhivwdibbykbcbdxetob.supabase.co`

## 2. Run the SQL schema

1. Left sidebar → **SQL Editor** → **New query**
2. Paste and **Run** each migration in order:

| File | Tables / changes |
|---|---|
| `supabase/migrations/20260813_valhalla_empire.sql` | `team_users`, `invites`, `tasks`, `notes`, `activity`, `signups`, `reservations` |
| `supabase/migrations/20260813_hall_codes_socials.sql` | `hall_codes`, `company_socials` |
| `supabase/migrations/20260813_site_chat.sql` | `chat_threads`, `chat_messages` |
| `supabase/migrations/20260814_chat_ai_flags.sql` | `needs_human`, AI model/meta on chat |
| `supabase/migrations/20260813_page_layouts.sql` | page layout tables + Storage notes |
| `supabase/migrations/20260813_auth_user_link.sql` | `team_users.auth_user_id` for Google SSO linkage |
| `supabase/migrations/20260814_dispatch_queue.sql` | `dispatch_items` founder approve/send queue |

3. Confirm tables under **Table Editor**.

## 3. Copy API keys

1. Project **Settings** → **API**
2. Copy:
   - **Project URL** → `SUPABASE_URL` (server) and `VITE_SUPABASE_URL` (client)
   - **anon / public** key → `VITE_SUPABASE_ANON_KEY` (safe in the browser)
   - **service_role** key (secret) → `SUPABASE_SERVICE_ROLE_KEY` (server only)

Prefer the **Legacy** `service_role` JWT (`eyJ…`) for Vercel server routes. Newer `sb_secret_…` keys can fail auth with `@supabase/supabase-js` in some setups — if admin/team APIs return auth errors after a Ready deploy, switch the Vercel env var to the Legacy JWT and redeploy.

Do **not** put the service role key in any `VITE_*` variable or commit it to git. It bypasses RLS and must stay server-only on Vercel.

## 4. Enable Google Auth (Eason checklist)

### A. Google Cloud OAuth client

1. Open [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → **Credentials**
2. **Create credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: e.g. `Valhalla Supabase`
5. **Authorized JavaScript origins** (optional for this flow):
   - `https://valhallaco.org`
   - `http://localhost:5173` (local Vite)
6. **Authorized redirect URIs** — must include Supabase’s callback (not your app URL):

   ```text
   https://bhivwdibbykbcbdxetob.supabase.co/auth/v1/callback
   ```

   (Replace the host if your Supabase project URL differs.)

7. Copy the **Client ID** and **Client secret**

### B. Supabase Auth → Google provider

1. Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Enable Google
3. Paste **Client ID** and **Client secret** from Google Cloud
4. Save

You must paste the client secret in the Supabase dashboard yourself — it is never committed to git and is not required on Vercel when Supabase hosts the OAuth exchange.

### C. Supabase Auth URL config

1. **Authentication** → **URL Configuration**
2. **Site URL**: `https://valhallaco.org`
3. **Redirect URLs** (add all that apply):

   ```text
   https://valhallaco.org/**
   https://valhallaco.org/admin
   https://valhallaco.org/team/login
   https://valhallaco.org/team/join
   http://localhost:5173/**
   http://localhost:5173/admin
   http://localhost:5173/team/login
   http://localhost:5173/team/join
   ```

### D. Optional founder TOTP after Google

By default, allowlisted Google email replaces password **and** TOTP for `/admin` Google SSO. Password login still always requires TOTP.

To also require authenticator after Google SSO, set on Vercel:

```bash
ADMIN_GOOGLE_REQUIRE_TOTP=true
```

## 5. Add env vars on Vercel

Project **valhalla** → **Settings** → **Environment Variables** → add for **Production and Preview**:

| Key | Where | Notes |
|---|---|---|
| `SUPABASE_URL` | Server | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Legacy `eyJ…` JWT preferred |
| `VITE_SUPABASE_URL` | Build / client | Same URL as `SUPABASE_URL` |
| `VITE_SUPABASE_ANON_KEY` | Build / client | anon/public key (OK to expose) |
| `ADMIN_PASSWORD` | Server | Fallback password path |
| `ADMIN_SESSION_SECRET` | Server | Signs admin + team cookies |
| `ADMIN_TOTP_SECRET` | Server | Required for password path 2FA |
| `ADMIN_GOOGLE_EMAILS` | Server | Optional comma-separated extra founder emails |
| `ADMIN_GOOGLE_REQUIRE_TOTP` | Server | Optional `true` to require TOTP after Google |

Google Client ID/secret stay in the **Supabase dashboard**, not in Vercel (unless you later move OAuth off Supabase).

After changing any `VITE_*` var, **Redeploy** so the frontend build picks them up.

## 6. Redeploy

Deployments → latest Production → **Redeploy** (or push to `main`).

## 7. Verify

1. `/admin` → **Continue with Google** as `info@valhallaco.org` → enters admin.
2. People / Overview should show **Storage: supabase** (not `memory`).
3. Invite a teammate → `/team/join?token=…` → **Continue with Google** with that invite email → `/team`.
4. Existing password seats still work at `/team/login`.
5. Password + TOTP still works at `/admin` as fallback.
6. Mosaic unlock, page editor, and Ask-the-hall chat still work.

## How Google sign-in works

1. Browser starts Supabase `signInWithOAuth({ provider: 'google' })` using the **anon** key.
2. Google → Supabase callback → redirect back to `/admin`, `/team/login`, or `/team/join`.
3. Frontend posts the Supabase **access token** to:
   - `POST /api/admin/login-google`
   - `POST /api/team/login-google`
   - `POST /api/team/accept-invite` (with invite token + access token)
4. Server verifies the JWT with the **service role**, maps email to founder allowlist or `team_users`, then issues the existing HttpOnly cookies (`vh_admin_session` / `vh_team_session`).
5. Browser Supabase session is cleared locally; the app cookie remains the source of truth for APIs.

We do **not** store Google passwords. Team seats may have `password_hash` (password path) and/or `auth_user_id` (Google path).

## Hall codes + socials

- `/admin` → **Hall codes**: set Instagram unlock codes for Eagle → Corvus (or use `HALL_CODE_<HALL>` env vars).
- `/admin` → **Socials**: LinkedIn / Instagram / X / Discord URLs per company.
- Public: `GET /api/hub/status`, `POST /api/hub/unlock`, `GET /api/hub/socials`.
- Empty social rows auto-seed suggested handles. Live Instagram defaults: hub `valhalla__42`, Wolf `wolf_transit`, Holm `holm_development`. Other halls may still use placeholder handles until claimed. LinkedIn stays empty until you add real company pages. Shared Discord invite is stored on rows but public pages show LinkedIn / Instagram / X as icons.

## Site chat (Ask the hall)

1. Run `supabase/migrations/20260813_site_chat.sql` then `20260814_chat_ai_flags.sql` in the SQL Editor.
2. Visitors use the compact **Ask** widget on each open company page and on the live (non-dormant) hub.
3. Each visitor message gets an **immediate AI reply** (Vercel AI Gateway / AI SDK). Hard questions are flagged `needs_human` for the founder Inbox.
4. Messages land in `/admin` → **Inbox** (full transcript: visitor + AI + founder). Founder replies continue the same thread.
5. Public: `GET|POST /api/hub/chat`. Admin: `GET|POST /api/admin/inbox`.
6. **Durability:** Without `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`, chat uses in-memory storage. That works for same-instance local testing (`vercel dev`) but **will not** show visitor messages in admin across Vercel serverless instances / cold starts. Supabase is required for multi-instance production durability.
7. AI env (set on Vercel; any one works):
   - `AI_GATEWAY_API_KEY` (preferred for Hobby / non-OIDC)
   - or rely on Vercel OIDC (`VERCEL_OIDC_TOKEN` auto on deployments)
   - or `OPENAI_API_KEY` as a fallback credential surface
   - optional: `VH_CHAT_MODEL` (default `openai/gpt-5.4-mini`)
8. Load test (tagged `[test]`): `BASE_URL=http://127.0.0.1:3000 npm run chat:load-test`

## Council (founder agents)

1. Run `supabase/migrations/20260814_council.sql` in the SQL Editor.
2. Open `/admin` → **Council**. Same AI env as site chat (`AI_GATEWAY_API_KEY` / `OPENAI_API_KEY`).
3. Agent source files: `council/agents/*.md`. Usage: [council.md](./council.md).

## Page layouts (founder visual editor)

1. Run `supabase/migrations/20260813_page_layouts.sql` in the SQL Editor.
2. Create a **public** Storage bucket named `page-assets` (Dashboard → Storage).
3. Open `/admin/editor/hub` (or any hall) after founder login → edit → **Save**.

See [page-editor.md](./page-editor.md) for UX, page IDs, and v1 limits.

## Fallback

If Supabase env vars are missing, the API falls back to in-memory storage (data lost on cold starts). Export/import JSON still works as a backup. Hall codes can still come from `HALL_CODE_*` env vars. Google buttons stay hidden unless both server Supabase and `VITE_*` anon keys are present.

## Local `.env` (optional, for `vercel dev` / Vite)

```bash
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
ADMIN_SESSION_SECRET=...
ADMIN_PASSWORD=...
ADMIN_TOTP_SECRET=...
# Ask chat AI (pick one)
# AI_GATEWAY_API_KEY=...
# OPENAI_API_KEY=...
# VH_CHAT_MODEL=openai/gpt-5.4-mini
# ADMIN_GOOGLE_EMAILS=you@valhallaco.org
# ADMIN_GOOGLE_REQUIRE_TOTP=true
```

Never commit `.env` / `.env.local`.
