# Founder visual page editor

Edit and publish layouts for the **Hub** and all **12 company halls** without redeploying.

## Open the editor

1. Sign in at [https://valhallaco.org/admin](https://valhallaco.org/admin) (email + password + 2FA).
2. Click **Page editor**, or go directly to:
   - `https://valhallaco.org/admin/editor/hub`
   - `https://valhallaco.org/admin/editor/wolf` (any hall slug)

Same founder cookie as `/admin` (`requireAdmin`).

## Editor UX (v1)

| Control | Behavior |
|---|---|
| Page switcher | Hub + 12 halls |
| Add blocks | Hero text, body text, image, spacer, CTA |
| Drag | Free-move on canvas; **snaps to 8px grid** (not a strict vertical stack) |
| Inspector | Font family, size, color, align, content, href, geometry |
| Image upload | Prefer Supabase Storage bucket `page-assets` |
| **Publish custom layout** | When checked + Save, live site uses published blocks |
| **Save** | Writes Supabase (or memory fallback) → public `GET /api/hub/page?id=` |

Uncheck **Publish custom layout** and Save to restore the default React UI for that page.

## Page IDs

`hub`, `wolf`, `viking`, `eagle`, `phenix`, `holm`, `atoll`, `olympus`, `aether`, `demeter`, `njord`, `aeolus`, `corvus`

## How live pages render

- **Company sites:** if a published layout exists (`enabled` + blocks), custom blocks replace the default hero/about/gallery/roadmap band. Reservation form + NextDoor + footer stay.
- **Hub:** countdown-only dormant mode is unchanged. After event start, published hub blocks appear **below the mosaic** (does not replace Living Mosaic / unlock / email).
- **No layout / disabled:** existing components unchanged.

## Supabase setup

### 1. Run migration SQL

In Supabase **SQL Editor**, run:

`supabase/migrations/20260813_page_layouts.sql`

Creates:

- `page_layouts` (`page_id`, `layout` jsonb, `updated_at`, `updated_by`)
- `page_assets` (upload metadata)

### 2. Create Storage bucket `page-assets`

Dashboard → **Storage** → **New bucket**:

- Name: `page-assets`
- **Public** bucket: yes (public read URLs for images)

Or uncomment the storage SQL at the bottom of the migration file.

Uploads go through the server service role (`POST /api/admin/pages/upload`). No anon write policy required.

### 3. Env (already used by admin)

`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` on Vercel.

## API (catch-alls — no new serverless functions)

| Route | Auth | Purpose |
|---|---|---|
| `GET /api/admin/pages` | founder | List layouts |
| `GET /api/admin/pages?id=wolf` | founder | One layout |
| `PUT /api/admin/pages` | founder | Save `{ pageId, layout }` |
| `POST /api/admin/pages/upload` | founder | `{ pageId, dataUrl, filename }` |
| `GET /api/hub/page?id=wolf` | public | Published layout only |

## Limits (honest v1)

- Snap is **8px free-move**, not auto-aligning columns or a stack reorder list.
- No undo/history, no multi-select, no responsive breakpoints per block.
- Hub custom content is a **band under the mosaic**, not a full hub redesign (Living Mosaic / countdown / hall codes stay authoritative).
- Without Storage, images fall back to **data URLs capped at ~400KB** (and memory layouts are lost on cold starts if Supabase tables are missing).
- Company custom layouts still keep reservation + NextDoor; they do not edit pay links or roadmaps as first-class blocks yet.
