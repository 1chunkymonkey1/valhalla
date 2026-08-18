/**
 * Aphrodite browser helpers — Supabase Auth + API client.
 */

import {
  getBrowserSupabase,
  isSupabaseBrowserConfigured,
  setOAuthIntent,
} from './supabaseBrowser'

export const APHRODITE_PROVIDERS = [
  {
    id: 'google',
    label: 'Continue with Google',
    supabase: 'google',
    ready: true,
    note: 'Enable Google in Supabase Auth → Providers',
  },
  {
    id: 'apple',
    label: 'Continue with Apple',
    supabase: 'apple',
    ready: true,
    note: 'Needs Apple Developer Services ID + Supabase Apple provider',
  },
  {
    id: 'twitter',
    label: 'Continue with X',
    supabase: 'twitter',
    ready: true,
    note: 'Needs X Developer app + Supabase Twitter provider',
  },
  {
    id: 'discord',
    label: 'Continue with Discord',
    supabase: 'discord',
    ready: true,
    note: 'Needs Discord OAuth app + Supabase Discord provider',
  },
  {
    id: 'facebook',
    label: 'Continue with Facebook',
    supabase: 'facebook',
    ready: true,
    note: 'Meta app; closest path for Instagram-adjacent login',
  },
  {
    id: 'instagram',
    label: 'Instagram (profile link)',
    supabase: null,
    ready: false,
    stub: true,
    note: 'Instagram Login needs Meta Instagram product — link handle on Profile; auth via Facebook for now',
  },
]

export function isAphroditeAuthConfigured() {
  return isSupabaseBrowserConfigured()
}

export async function signUpAphroditeEmail({ email, password }) {
  const sb = getBrowserSupabase()
  if (!sb) {
    throw new Error(
      'Auth is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    )
  }
  const { data, error } = await sb.auth.signUp({
    email: String(email || '').trim(),
    password: String(password || ''),
    options: {
      emailRedirectTo: `${window.location.origin}/aphrodite/sign-in`,
    },
  })
  if (error) throw error
  return data
}

export async function signInAphroditeEmail({ email, password }) {
  const sb = getBrowserSupabase()
  if (!sb) {
    throw new Error(
      'Auth is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    )
  }
  const { data, error } = await sb.auth.signInWithPassword({
    email: String(email || '').trim(),
    password: String(password || ''),
  })
  if (error) throw error
  return data
}

export async function getAphroditeAccessToken() {
  const sb = getBrowserSupabase()
  if (!sb) return null
  const { data } = await sb.auth.getSession()
  if (data?.session?.access_token) return data.session.access_token

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

export async function getAphroditeSession() {
  const sb = getBrowserSupabase()
  if (!sb) return null
  const { data } = await sb.auth.getSession()
  return data?.session || null
}

export async function startAphroditeOAuth(provider, redirectTo) {
  const sb = getBrowserSupabase()
  if (!sb) {
    throw new Error(
      'Auth is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    )
  }
  const def = APHRODITE_PROVIDERS.find((p) => p.id === provider)
  if (!def?.supabase) {
    throw new Error(
      'Instagram Login is not wired yet. Use Facebook, or add your Instagram handle on Profile.',
    )
  }
  setOAuthIntent({ kind: 'aphrodite', provider })
  const { data, error } = await sb.auth.signInWithOAuth({
    provider: def.supabase,
    options: {
      redirectTo,
      queryParams:
        provider === 'google'
          ? { access_type: 'online', prompt: 'select_account' }
          : undefined,
    },
  })
  if (error) throw error
  return data
}

export async function signOutAphrodite() {
  setDemoAccessToken(null)
  const sb = getBrowserSupabase()
  if (!sb) return
  try {
    await sb.auth.signOut()
  } catch {
    // ignore
  }
}

export async function aphroditeFetch(path, { method = 'GET', body, token } = {}) {
  const accessToken = token || (await getAphroditeAccessToken()) || getDemoAccessToken()
  const headers = { 'Content-Type': 'application/json' }
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`
  const res = await fetch(`/api/aphrodite/${path.replace(/^\//, '')}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`)
    err.status = res.status
    err.data = data
    err.code = data.code
    throw err
  }
  return data
}

const DEMO_TOKEN_KEY = 'aph_demo_access_token'

export function getDemoAccessToken() {
  try {
    return sessionStorage.getItem(DEMO_TOKEN_KEY) || null
  } catch {
    return null
  }
}

export function setDemoAccessToken(token) {
  try {
    if (token) sessionStorage.setItem(DEMO_TOKEN_KEY, token)
    else sessionStorage.removeItem(DEMO_TOKEN_KEY)
  } catch {
    // ignore
  }
}

export async function demoLoginAphrodite(extras = {}) {
  const res = await fetch('/api/aphrodite/demo-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(extras),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'Demo login failed')
  }
  setDemoAccessToken(data.accessToken)
  return data
}

export async function syncAphroditeSession(extras = {}) {
  return aphroditeFetch('session', { method: 'POST', body: extras })
}
