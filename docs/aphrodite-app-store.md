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

## App Store Connect — wrong door

**Cancel the App Bundle screen.** That form (Name + “Apps in This Bundle” + “Drag up to 10 apps here”) is for grouping apps that are already **Released**. Create stays gray because Aphrodite is not on the store yet. A bundle is not a first listing.

**If + only shows New App Bundle:** You are on the **Edna Charge** Apple team as **Marketing**. Marketing cannot create apps. Do not ask Gabby for Admin on that team to ship Aphrodite — Edna Charge is a separate project; its Account Holder is `admin@ednacharge.com` (Gabrielle Jade Siy Wong). Aphrodite needs **your** team.

### Own Connect page (separate from Edna Charge)

Apple IDs can sit on many teams. Yours (`easongreene@gmail.com`) is only a member of Gabby’s paid team until you enroll your own Program.

1. Top-right in Connect: click **Eason Greene / Gabrielle Jade Siy Wong**. If another team is listed, switch to it. If not, you do not have your own enrollment yet.
2. Enroll **your** Apple Developer Program ($99/year) as Account Holder: [developer.apple.com/programs/enroll](https://developer.apple.com/programs/enroll/) while signed in as `easongreene@gmail.com`.
   - **Individual** — App Store seller name is your legal name. Honest path if no formed entity is ready (do not invent a company in the enrollment form).
   - **Organization** — only if a real legal entity exists, with DUNS. Counsel owns that choice; not this click list.
3. After Apple approves, Connect shows a **team switcher**. Pick **your** team (you are Account Holder). Apps list is empty. **+** → **New App**.
4. Stay Marketing on Edna Charge if you still work that app. Switch teams in the top-right; do not create Aphrodite under Gabby’s account.

You cannot split “an admin page” inside someone else’s Program. A second Program enrollment is the split.

**If + only shows New App Bundle on YOUR team:** then also check Business agreements and an unused App ID (below). On Gabby’s team, the cause is the Marketing role — leave that team for Aphrodite.

On **your** team, New App also requires ([Apple: Add a new app](https://developer.apple.com/help/app-store-connect/create-an-app-record/add-a-new-app)):

1. **Latest agreement is signed.** Account Holder: App Store Connect → **Business** (Agreements, Tax, and Banking). Sign the current Paid/Free Apps agreement. Apple: you cannot add an app until this is done. The EU trader-status banner is the same neighborhood — fill it, but the unsigned contract is what removes New App.
2. **Your role can create apps.** On your team you are Account Holder. Required roles: Account Holder, Admin, or App Manager.
3. **An unused explicit App ID exists** on **that same team**: [developer.apple.com/account/resources/identifiers/list](https://developer.apple.com/account/resources/identifiers/list) → confirm the team switcher is yours (not Gabby) → **+** → App IDs → App → explicit `org.valhallaco.aphrodite` (no `*`). Enable Sign In with Apple + In-App Purchase. Then hard-refresh Connect.

Do not create a bundle while waiting. After 1–3, **+** should list **New App**.

When New App is in the menu:

1. [developer.apple.com/account](https://developer.apple.com/account) → **Identifiers** → **+** → **App IDs** → App. Bundle ID `org.valhallaco.aphrodite`. Enable **Sign In with Apple** and **In-App Purchase**.
2. [App Store Connect](https://appstoreconnect.apple.com) → **Apps** → **+** → **New App** (not New App Bundle, not New In-App Event).
3. New App fields:

| Field | Value |
|---|---|
| Platforms | iOS |
| Name | Aphrodite |
| Primary Language | English (U.S.) |
| Bundle ID | `org.valhallaco.aphrodite` (must already exist from step 1) |
| SKU | `aphrodite` |
| User Access | Full Access |

If Bundle ID is empty in the dropdown, the identifier is not registered yet — go back to step 1. Do not create a wildcard ID.

Create an App Bundle only after Aphrodite is **Ready for Sale** and you have a second released app to group with it. That is not this ship.

**Apps list (Edna Charge team):** Edna Charge already sits here as iOS 1.0 Prepare for Submission. That is not Aphrodite. Do not reuse that record. Switch to **your** team before clicking New App.

Yellow banners on that page are account-level:

- **Trader status (EU DSA)** — Business / Compliance in Connect. Fill it for this team or EU storefronts can be pulled. Use the legal entity that actually ships. Do not invent a new company name in chat.
- **Age rating social-media questions** — answer on each app’s App Information. For Aphrodite: it is dating (18+), not a social-media network; still answer the new questions honestly after the record exists.

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
