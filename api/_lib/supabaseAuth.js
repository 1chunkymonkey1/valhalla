import { getSupabase, isSupabaseConfigured } from './supabase.js'

/**
 * Verify a Supabase Auth access token (e.g. after Google OAuth).
 * Returns the Auth user or null. Never trusts client-supplied email alone.
 */
export async function getSupabaseAuthUser(accessToken) {
  if (!accessToken || typeof accessToken !== 'string') return null
  if (!isSupabaseConfigured()) return null

  const sb = getSupabase()
  const { data, error } = await sb.auth.getUser(accessToken.trim())
  if (error || !data?.user) return null
  return data.user
}

export function authEmail(user) {
  const email = String(user?.email || '')
    .trim()
    .toLowerCase()
  return email || null
}

/** True when server has Supabase (needed to verify Google JWTs). */
export function isGoogleAuthBackendReady() {
  return isSupabaseConfigured()
}
