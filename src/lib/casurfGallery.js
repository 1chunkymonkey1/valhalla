const FAVORITES_KEY = 'casurf_berkeley_favorites'
const EMAIL_KEY = 'casurf_berkeley_email'

export function toggleFavorite(list, id) {
  const ids = Array.isArray(list) ? list : []
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
}

export function readFavorites() {
  try {
    const raw = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
    return Array.isArray(raw) ? raw.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function writeFavorites(ids) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
}

export function readSavedEmail() {
  try {
    return String(localStorage.getItem(EMAIL_KEY) || '')
  } catch {
    return ''
  }
}

export function writeSavedEmail(email) {
  localStorage.setItem(EMAIL_KEY, String(email || ''))
}

export function photosInSet(photos, setId) {
  if (!setId || setId === 'all') return photos
  return photos.filter((p) => p.set === setId)
}

export function shareUrl(origin, path, params = {}) {
  const url = new URL(path, origin)
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== '') url.searchParams.set(k, String(v))
  }
  return url.toString()
}
