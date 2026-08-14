import { createClient } from '@supabase/supabase-js'

let cached = null

export function isSupabaseBrowserConfigured() {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
  )
}

/** Browser Supabase client (anon key only). Used for Google OAuth UX. */
export function getBrowserSupabase() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anon) return null
  if (cached) return cached
  cached = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  })
  return cached
}

const INTENT_KEY = 'vh_oauth_intent'

export function setOAuthIntent(intent) {
  try {
    sessionStorage.setItem(INTENT_KEY, JSON.stringify(intent))
  } catch {
    // ignore
  }
}

export function takeOAuthIntent() {
  try {
    const raw = sessionStorage.getItem(INTENT_KEY)
    if (!raw) return null
    sessionStorage.removeItem(INTENT_KEY)
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function peekOAuthIntent() {
  try {
    const raw = sessionStorage.getItem(INTENT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Start Google OAuth via Supabase. redirectTo must be allowlisted in Supabase Auth.
 */
export async function startGoogleOAuth(redirectTo, intent) {
  const sb = getBrowserSupabase()
  if (!sb) {
    throw new Error(
      'Google sign-in is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    )
  }
  setOAuthIntent(intent)
  const { data, error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'online',
        prompt: 'select_account',
      },
    },
  })
  if (error) throw error
  return data
}

/** Read current Supabase session access token after OAuth redirect. */
export async function getGoogleAccessToken() {
  const sb = getBrowserSupabase()
  if (!sb) return null

  const first = await sb.auth.getSession()
  if (first.data?.session?.access_token) return first.data.session.access_token

  // PKCE / hash parse can finish just after client init
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      subscription.unsubscribe()
      resolve(null)
    }, 4000)
    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        clearTimeout(timer)
        subscription.unsubscribe()
        resolve(session.access_token)
      }
    })
  })
}

/** Clear browser Supabase session after we minted our HttpOnly app cookie. */
export async function clearBrowserSupabaseSession() {
  const sb = getBrowserSupabase()
  if (!sb) return
  try {
    await sb.auth.signOut({ scope: 'local' })
  } catch {
    // ignore
  }
}
