# Domain: valhallaco.org → Vercel (preserve Google Workspace email)

Live preview today: https://valhalla-hazel.vercel.app  
After DNS cutover: **https://valhallaco.org** and **https://www.valhallaco.org**

Vercel project: `valhalla` (`prj_AKVcmwuIrGDuFyVSlt7jXyJJdotP`)  
DNS host: **Squarespace** (keep their nameservers). Do **not** switch NS to Vercel.

Verified 12 Aug 2026 via `npx vercel domains verify` + live `dig`.

## Vercel attachment status (already done)

| Hostname | On Vercel team | Attached to project `valhalla` | Ownership verified | DNS valid |
|---|---|---|---|---|
| `valhallaco.org` | yes | **yes** | yes | **no** — still Squarespace website A records |
| `www.valhallaco.org` | yes | **yes** | yes | **no** — still `www` CNAME → `ext-sq.squarespace.com` |

Aliases already point at the current production deployment. After you click the Squarespace DNS changes below, SSL will issue automatically (usually minutes, up to 48h).

Re-check anytime:

```bash
npx vercel domains verify valhallaco.org --non-interactive
npx vercel domains verify www.valhallaco.org --non-interactive
```

## KEEP — Google Workspace email (do not touch)

Live records as of 12 Aug 2026. Leave nameservers on Squarespace.

| Type | Host / Name | Priority | Value | TTL (live) |
|---|---|---|---|---|
| NS | `@` | — | `nsd1.squarespacedns.com` … `nsd4.squarespacedns.com` | — |
| MX | `@` | **1** | `smtp.google.com` | 3600 |
| TXT | `@` | — | `v=spf1 include:_spf.google.com ~all` | 3600 |
| TXT | `google._domainkey` | — | existing DKIM (`v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8…IDAQAB`) | 3600 |

Do **not** delete, edit, or overwrite MX / SPF / DKIM.  
Do **not** change nameservers to `ns1.vercel-dns.com` / `ns2.vercel-dns.com` — that would drop Google mail unless you recreate every record on Vercel.

## DELETE / REPLACE — Squarespace website records only

Live website records to remove (TTL 14400 / 4h):

| Type | Host / Name | Value | Why |
|---|---|---|---|
| A | `@` | `198.49.23.144` | Squarespace site IP |
| A | `@` | `198.49.23.145` | Squarespace site IP |
| A | `@` | `198.185.159.144` | Squarespace site IP |
| A | `@` | `198.185.159.145` | Squarespace site IP |
| CNAME | `www` | `ext-sq.squarespace.com` | Squarespace www |

Also delete if the Squarespace DNS UI shows them:

- **HTTPS** / **ALIAS** / **ANAME** records for `@` or `www` that mention Squarespace
- Extra **A** / **AAAA** on `@` besides the two Vercel IPs below

Leave any Google TXT/MX alone even if they sit next to these rows.

## ADD — Vercel records (CLI rank-1, 12 Aug 2026)

Use these **exact** values from `npx vercel domains verify`. Prefer rank 1 (project-specific anycast), not the older generic `76.76.21.21`.

| Type | Host / Name | Value | TTL |
|---|---|---|---|
| A | `@` | `216.198.79.1` | 1 hour (or Squarespace default) |
| A | `@` | `64.29.17.1` | 1 hour (or Squarespace default) |
| CNAME | `www` | `73499724c2f81a04.vercel-dns-017.com` | 1 hour (or Squarespace default) |

Trailing dot is optional (`73499724c2f81a04.vercel-dns-017.com.`).  
After adding, `@` should have **exactly two** A records (those two IPs). No leftover Squarespace A records.

Rank-2 fallback (only if rank 1 will not save in the UI):

| Type | Host / Name | Value |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

## What to click in Squarespace

1. Log into Squarespace → **Settings** → **Domains** → **valhallaco.org**.
2. Open **DNS** / **DNS Settings**. Confirm nameservers still list `nsd1.squarespacedns.com` … `nsd4` — do not change them.
3. In the DNS records list, **delete** the four Squarespace **A** rows (`198.49.23.*` / `198.185.159.*`) and the **www CNAME** to `ext-sq.squarespace.com`. Delete any **HTTPS** row for `@` or `www` if present.
4. **Add** two **A** records for host `@` with `216.198.79.1` and `64.29.17.1`.
5. **Add** one **CNAME** for host `www` with `73499724c2f81a04.vercel-dns-017.com`.
6. Scroll the list and confirm MX `smtp.google.com`, SPF TXT, and `google._domainkey` are still there. Save.
7. If Squarespace immediately restores the old A records, the domain is still bound as a Squarespace *website*. Disconnect the site connection, but **keep DNS hosted at Squarespace** (do not transfer the domain or change nameservers).
8. Wait 5–30 minutes (current A/CNAME TTL is 4 hours, so some resolvers may take up to that). Then visit:
   - https://valhallaco.org
   - https://www.valhallaco.org

Vercel will provision the certificate once the new A/CNAME answers are visible. Until then the old Squarespace site or a cert warning is possible.

## After it propagates

Expected live URLs:

- **https://valhallaco.org** — Valhalla hub (this repo)
- **https://www.valhallaco.org** — same project (Vercel will serve or redirect)
- https://valhalla-hazel.vercel.app — still works

Email check: send to `info@valhallaco.org` (or any Workspace inbox) and reply. MX must still be `smtp.google.com`.

CLI check:

```bash
npx vercel domains verify valhallaco.org --non-interactive
npx vercel domains verify www.valhallaco.org --non-interactive
dig +short A valhallaco.org          # expect 216.198.79.1 and 64.29.17.1
dig +short CNAME www.valhallaco.org  # expect 73499724c2f81a04.vercel-dns-017.com
dig +short MX valhallaco.org         # still 1 smtp.google.com.
```

## Squarespace Pay Links

Prefer **Squarespace Payments** (unlimited links) over PayPal (10-link cap).  
Create Pay Links in Squarespace, then paste URLs into `src/data/payLinks.js` and Corvus tiers in `src/data/corvusPricing.js`.
