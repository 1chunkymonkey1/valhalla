# Aphrodite — App Store (Eason clicks)

This Linux workspace cannot compile an `.ipa` or submit to App Store Connect. The product is operational on the web. This file is the Mac + Apple checklist to put **Aphrodite** in the App Store.

**Bundle ID:** `org.valhallaco.aphrodite`  
**IAP product:** `aphrodite_monthly` · auto-renewable · $19.99 or $20.00 USD / month  
**Privacy / Terms / Safety URLs (required):**

- https://valhallaco.org/aphrodite/privacy
- https://valhallaco.org/aphrodite/terms
- https://valhallaco.org/aphrodite/safety

## Honest split

| Surface | Status |
|---|---|
| Web `/aphrodite` | Operational: auth, 18+, $20 Stripe, swipe, match messages, block/report |
| PWA (Add to Home Screen) | Manifest at `/aphrodite.webmanifest` |
| Capacitor iOS shell | `capacitor.config.json` — run on a Mac |
| TestFlight / App Store | Eason: Apple Developer + Xcode + App Store Connect |
| StoreKit receipt verify | Endpoint `/api/aphrodite/iap` exists; Apple Server API keys are Eason-only |

Do not claim App Store presence, download counts, or membership revenue until the listing is live.

## Before Xcode (already in this repo)

1. Merge this branch. Confirm production: `https://valhallaco.org/aphrodite` signs in, subscribes, matches, messages, blocks.
2. Run both SQL files in Supabase SQL Editor:
   - `supabase/migrations/20260815_aphrodite.sql`
   - `supabase/migrations/20260818_aphrodite_ops.sql`
3. Finish secrets in `docs/aphrodite.md` (Vercel `VITE_SUPABASE_*`, `STRIPE_SECRET_KEY`, webhook, Google OAuth).
4. Enable **Sign in with Apple** in Supabase (Apple requires it if other social logins exist).

## Mac — first binary

Apple Developer Program ($99/year) must already be on the team that will ship this.

```bash
npm install
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/app @capacitor/status-bar
npx cap add ios
npx cap sync ios
npx cap open ios
```

In Xcode:

1. Team = your Apple Developer team. Bundle ID `org.valhallaco.aphrodite`.
2. Signing → automatically manage.
3. Capability: **Sign in with Apple**.
4. Capability: **In-App Purchase**.
5. Version 1.0, build 1.
6. Archive → Distribute → App Store Connect / TestFlight.

The Capacitor config loads the live site (`https://valhallaco.org/aphrodite`) so the binary tracks production. Do not point a store build at localhost.

## App Store Connect listing

| Field | Value |
|---|---|
| Name | Aphrodite |
| Subtitle | Competition dating |
| Category | Lifestyle (secondary: Social Networking) |
| Age rating | 17+ (frequent mature/suggestive; unrestricted web access if the shell loads the site) |
| Price | Free app + auto-renewable IAP |
| IAP | `aphrodite_monthly` — Aphrodite membership — $20/month |
| Privacy policy | https://valhallaco.org/aphrodite/privacy |
| EULA | Standard Apple + https://valhallaco.org/aphrodite/terms |
| Support URL | https://valhallaco.org/aphrodite/safety |
| Marketing URL | https://valhallaco.org/aphrodite |
| Description | Dating for competitors — chess, sports, Clash Royale, track, esports. 18+. Membership $20/month. Mutual likes open a private thread. Block and report on every card. |

Screenshots (required sizes): 6.7" iPhone and 6.5" or 5.5" as Connect asks. Capture `/aphrodite`, sign-in, a deck card with Block/Report visible, a match thread. No invented member photos — use the demo deck on a staging build or your own test accounts.

Review notes for Apple:

- Dating app. 18+ birth-date gate. Block and report on cards and threads.
- Web membership is Stripe; iOS membership must be StoreKit product `aphrodite_monthly` (Guideline 3.1.1). Complete StoreKit in the iOS target before the first store review if the binary can start a subscription.
- Sign in with Apple is offered next to Google and email.

## StoreKit (required for store review)

The web Subscribe button uses Stripe. An App Store binary that sells membership **must** use IAP, not Stripe Safari checkout.

1. App Store Connect → Features → In-App Purchases → auto-renewable `aphrodite_monthly`.
2. On the Mac, add StoreKit 2 (or RevenueCat) to the iOS target.
3. After a successful purchase, POST `{ productId, transactionId, signedTransaction }` to `/api/aphrodite/iap`.
4. Wire Apple Server API keys when that plugin lands. Until then the endpoint returns `iap_verify_pending` in production and allows `testUnlock` only when `APHRODITE_IAP_TEST=1` and Stripe is not `sk_live`.

Shipping TestFlight **as a web shell first** is fine for internal testing. For App Review, IAP must complete or Review will reject.

## Info.plist / privacy nutrition

- Camera / Photo Library: not used in this version (avatar is a URL field). Do not add unused permission strings.
- Tracking: not used. Do not attach the App Tracking Transparency prompt until ads exist (they do not).
- Data types in App Privacy: contact info (email), user content (profile, messages), identifiers (account), purchases (membership). Not used for tracking.

## After submit

Leave this agent out of App Store Connect. Status mail goes to the Apple ID on the team. When the listing is **Ready for Sale**, say so in `docs/aphrodite.md` with the date — do not backfill.
