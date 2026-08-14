export const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'pt']

export const LOCALE_STORAGE_KEY = 'valhalla_locale'

/** Map BCP-47 / Accept-Language style tags → supported locale. */
export function matchLocale(tag) {
  if (!tag || typeof tag !== 'string') return null
  const raw = tag.trim().toLowerCase().replace(/_/g, '-')
  if (!raw) return null
  const base = raw.split('-')[0]
  if (SUPPORTED_LOCALES.includes(raw)) return raw
  if (base === 'zh') return 'zh'
  if (SUPPORTED_LOCALES.includes(base)) return base
  return null
}

export function detectBrowserLocale() {
  if (typeof navigator === 'undefined') return 'en'
  const candidates = []
  if (Array.isArray(navigator.languages)) candidates.push(...navigator.languages)
  if (navigator.language) candidates.push(navigator.language)
  for (const tag of candidates) {
    const hit = matchLocale(tag)
    if (hit) return hit
  }
  return 'en'
}

export function readStoredLocale() {
  if (typeof window === 'undefined') return null
  try {
    return matchLocale(localStorage.getItem(LOCALE_STORAGE_KEY) || '')
  } catch {
    return null
  }
}

export function writeStoredLocale(locale) {
  if (typeof window === 'undefined') return
  try {
    if (!locale) {
      localStorage.removeItem(LOCALE_STORAGE_KEY)
      return
    }
    const hit = matchLocale(locale)
    if (hit) localStorage.setItem(LOCALE_STORAGE_KEY, hit)
  } catch {
    /* ignore */
  }
}

export function resolveLocale() {
  return readStoredLocale() || detectBrowserLocale() || 'en'
}

/**
 * Nested-key lookup: t(dict, 'nav.hub')
 * Supports {{name}} interpolation via vars.
 */
export function translate(dict, key, vars) {
  if (!key) return ''
  const parts = String(key).split('.')
  let cur = dict
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') {
      cur = undefined
      break
    }
    cur = cur[p]
  }
  let str = typeof cur === 'string' ? cur : null
  if (str == null) return key
  if (vars && typeof vars === 'object') {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{{${k}}}`, String(v))
    }
  }
  return str
}
