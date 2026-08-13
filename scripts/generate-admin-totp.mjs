#!/usr/bin/env node
/**
 * Generate ADMIN_TOTP_SECRET for Google Authenticator / Authy / 1Password.
 * Do not commit the printed secret. Add it as a Sensitive env var on Vercel.
 */
import { generateTotpSecret, otpauthUrl } from '../api/_lib/totp.js'

const email = 'info@valhallaco.org'
const secret = generateTotpSecret()
const uri = otpauthUrl({ secret, email })

console.log(`
Valhalla Admin 2FA setup
========================

1. Add this Sensitive env var on Vercel (Production + Preview):

   Key:   ADMIN_TOTP_SECRET
   Value: ${secret}

2. Redeploy the project.

3. In Google Authenticator / Authy / 1Password, add account via "Enter a setup key"
   or scan an otpauth URL. Account: ${email}

   Setup key (base32): ${secret}
   otpauth URI:
   ${uri}

4. Login at /admin with email + password + 6-digit code.

Keep the secret offline. Never commit it.
`)
