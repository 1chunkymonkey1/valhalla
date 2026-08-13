# Supabase setup for Valhalla durable memory

Team users, invites, tasks, notes, activity, email signups, and reservations persist in Supabase Postgres.

## 1. Create a project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project** → name it e.g. `valhalla`
3. Set a strong database password (save it)
4. Wait until the project is ready

## 2. Run the SQL schema

1. Left sidebar → **SQL Editor** → **New query**
2. Paste the full contents of:

   `supabase/migrations/20260813_valhalla_empire.sql`

3. Click **Run**
4. Confirm tables exist under **Table Editor**:
   `team_users`, `invites`, `tasks`, `notes`, `activity`, `signups`, `reservations`

5. Also run the second migration for hall codes + socials:

   `supabase/migrations/20260813_hall_codes_socials.sql`

   Tables: `hall_codes`, `company_socials`

6. Also run the site chat migration:

   `supabase/migrations/20260813_site_chat.sql`

   Tables: `chat_threads`, `chat_messages`

## 3. Copy API keys

1. Project **Settings** → **API**
2. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key (secret) → `SUPABASE_SERVICE_ROLE_KEY`

Prefer the **Legacy** `service_role` JWT (`eyJ…`) for Vercel server routes. Newer `sb_secret_…` keys can fail auth with `@supabase/supabase-js` in some setups — if admin/team APIs return auth errors after a Ready deploy, switch the Vercel env var to the Legacy JWT and redeploy.

Do **not** put the service role key in any `VITE_*` variable or commit it to git. It bypasses RLS and must stay server-only on Vercel.

## 4. Add env vars on Vercel

Project **valhalla** → **Settings** → **Environment Variables** → add both for **Production and Preview**:

| Key | Value |
|---|---|
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role secret |

Keep existing admin vars:

- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `ADMIN_TOTP_SECRET`

## 5. Redeploy

Deployments → latest Production → **Redeploy** (or push to `main`).

## 6. Verify

1. `/admin` → **People** should show **Storage: supabase** (not `memory`).
2. Overview / Ledgers should note **Durable storage via Supabase**.
3. Invite a teammate under **People** → accept at `/team/join` → sign in at `/team`.
4. Redeploy again — the seat should still exist.

## Hall codes + socials

- `/admin` → **Hall codes**: set Instagram unlock codes for Eagle → Corvus (or use `HALL_CODE_<HALL>` env vars).
- `/admin` → **Socials**: LinkedIn / Instagram / X / Discord URLs per company.
- Public: `GET /api/hub/status`, `POST /api/hub/unlock`, `GET /api/hub/socials`.
- Empty social rows auto-seed suggested placeholder handles (e.g. `wolf_transit`, `holm_development`, `phenix_aerospace`) plus the shared Discord invite. **Create/claim those accounts**, then replace URLs in Admin → Socials. LinkedIn stays empty until you add real company pages.

## Site chat (Ask the hall)

1. Run `supabase/migrations/20260813_site_chat.sql` in the SQL Editor.
2. Visitors use the compact **Ask** widget on each open company page and on the live (non-dormant) hub.
3. Messages land in `/admin` → **Inbox**. Founder replies there; the visitor sees replies in the same session/thread.
4. Public: `GET|POST /api/hub/chat`. Admin: `GET|POST /api/admin/inbox`.
5. Without Supabase, chat falls back to memory (lost on cold starts) — same pattern as other empire features.

## Page layouts (founder visual editor)

1. Run `supabase/migrations/20260813_page_layouts.sql` in the SQL Editor.
2. Create a **public** Storage bucket named `page-assets` (Dashboard → Storage).
3. Open `/admin/editor/hub` (or any hall) after founder 2FA login → edit → **Save**.

See [page-editor.md](./page-editor.md) for UX, page IDs, and v1 limits.

## Fallback

If Supabase env vars are missing, the API falls back to in-memory storage (data lost on cold starts). Export/import JSON still works as a backup. Hall codes can still come from `HALL_CODE_*` env vars.

## Local `.env` (optional, for `vercel dev`)

```bash
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_SESSION_SECRET=...
ADMIN_PASSWORD=...
ADMIN_TOTP_SECRET=...
```

Never commit `.env` / `.env.local`.
