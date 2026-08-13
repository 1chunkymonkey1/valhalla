# Domain: valhallaco.org → Vercel (preserve Google Workspace email)

Deploy target: https://valhalla-hazel.vercel.app  
Custom domain goal: **valhallaco.org** (+ www)

## Critical: do not break email

Squarespace DNS currently includes Google Workspace records. **Keep these:**

| Type | Host | Data |
|---|---|---|
| MX | `@` | `smtp.google.com` (priority 1) |
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` |
| TXT | `google._domainkey` | (existing DKIM value — do not delete) |

Do **not** remove or overwrite MX / SPF / DKIM when pointing the website to Vercel.

## Replace website records only

Remove (or stop using) Squarespace website defaults:

- A `@` → `198.49.23.144`, `198.185.159.144`, `198.49.23.145`, `198.185.159.145`
- CNAME `www` → `ext-sq.squarespace.com`
- Related HTTPS/ALPN hints for Squarespace if present

Then in Vercel:

```bash
npx vercel domains add valhallaco.org
npx vercel domains add www.valhallaco.org
```

Vercel will show the exact records. Typical pattern:

- **A** `@` → `76.76.21.21` (confirm in Vercel dashboard — IPs can change)
- **CNAME** `www` → `cname.vercel-dns.com` (confirm in dashboard)

Add those in Squarespace DNS → Custom records. Leave Google MX/TXT untouched.

## Verification checklist

1. `https://valhallaco.org` loads the Valhalla hub
2. `https://www.valhallaaco.org` redirects or loads (after www domain added)
3. Send test email to `info@valhallaco.org` and reply — MX still Google
4. Admin login only via serverless auth (see README)

## Squarespace Pay Links

Prefer **Squarespace Payments** (unlimited links) over PayPal (10-link cap).  
Create Pay Links in Squarespace, then paste URLs into `src/data/payLinks.js` and Corvus tiers in `src/data/corvusPricing.js`.
