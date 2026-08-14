# Investor access codes

Admin / internal documentation only. Do **not** put this algorithm on the public `/investors` page.

## Tiers

| Prefix | Audience |
|--------|----------|
| **P** | Small / retail investors |
| **E** | Elephant / large allocation conversations |

## Format

- `e` + (4 digits from **e**) + (release index `k`)
- `p` + (4 digits from **pi**) + (release index `k`)

`k` is 1-based and increments separately per tier.

## Digit-block rules

### E codes (from *e*)

\[
e \approx 2.718281828459045\ldots
\]

Decimal digit stream (after the point): `718281828459045…`

4-digit blocks: `[7182, 8182, 8459, 0452, …]`

For release **`k`** (1-based), use the **`(k+1)`-th** 4-digit block (0-based index `k`):

```
code = "e" + block + String(k)
```

| Release | Block used | Code |
|---------|------------|------|
| E#1 | 2nd → `8182` | **`e81821`** |
| E#2 | 3rd → `8459` | **`e84592`** |
| E#3 | 4th → `0452` | `e04523` |

### P codes (from *π*)

\[
\pi \approx 3.141592653589793\ldots
\]

Decimal digit stream: `141592653589793…`

4-digit blocks: `[1415, 9265, 3589, 7932, …]`

For release **`k`** (1-based), use the **`(k+2)`-th** 4-digit block (0-based index `k+1`):

```
code = "p" + block + String(k)
```

| Release | Block used | Code |
|---------|------------|------|
| P#1 | 3rd → `3589` | **`p35891`** |
| P#2 | 4th → `7932` | `p79322` |
| P#3 | 5th → `3846` | `p38463` |

## Issuing

1. Sign in at `/admin`
2. Open the **Investor codes** tab
3. Starters **E1 (`e81821`)** and **P1 (`p35891`)** auto-seed on first admin open or first `/investors` unlock attempt (also via **Seed starter codes**)
4. Generate next **P** or **E** for later releases (stored in Supabase `investor_codes`, or memory fallback)
5. Share the code privately with the investor
6. Revoke/disable if needed

### Migration

Run `supabase/migrations/20260814_investor_codes.sql` in the Supabase SQL editor if the table is missing. That migration also inserts starter E1/P1 (`on conflict do nothing`). Without the table, the API falls back to **memory** (works per cold instance after auto-seed, but not durable across Vercel instances — prefer Supabase).

Codes beyond the starters are only valid once they have been **generated and stored** (and remain `active`). Knowing the algorithm alone does not unlock materials for unissued sequences.

## Public unlock

- Path: `/investors`
- API: `POST /api/hub/investor-code` with `{ "code": "…" }`
- On success: HttpOnly cookie `vh_investor` (signed with `ADMIN_SESSION_SECRET` or `ADMIN_PASSWORD`) unlocks the fundraising hub UI
- Status: `GET /api/hub/investor-code`
- If cookie signing fails, unlock returns **503** (do not treat as success)

## Materials

Served from `public/investors/` after unlock (pitch PDF, business model copy, 12 company decks, leads note). Blueprint-honest: MRR is $0; no fabricated terms.
