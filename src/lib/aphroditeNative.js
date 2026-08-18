/**
 * Native vs web billing. Apple requires StoreKit for digital subscriptions
 * inside an App Store binary. Web (and PWA) uses Stripe.
 */

export const APHRODITE_IAP_PRODUCT = 'aphrodite_monthly'
export const APHRODITE_BUNDLE_ID = 'org.valhallaco.aphrodite'

export function isAphroditeNative() {
  if (typeof window === 'undefined') return false
  const cap = window.Capacitor
  if (!cap) return false
  if (typeof cap.isNativePlatform === 'function') return cap.isNativePlatform()
  return Boolean(cap.isNative)
}

export function aphroditePlatform() {
  if (!isAphroditeNative()) return 'web'
  const cap = window.Capacitor
  const getPlatform = cap?.getPlatform
  if (typeof getPlatform === 'function') return getPlatform()
  return cap?.platform || 'ios'
}
