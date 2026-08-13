import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'vh_hall_unlocks_v1'

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

function writeLocal(halls) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(halls))
  } catch {
    // ignore
  }
}

/**
 * Wave-2 Instagram unlock state (cookie + localStorage mirror).
 */
export function useHallUnlocks() {
  const [unlocked, setUnlocked] = useState(() =>
    typeof window !== 'undefined' ? readLocal() : [],
  )
  const [nextHall, setNextHall] = useState(null)
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/hub/status', { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Could not load unlock status')
        setLoading(false)
        return
      }
      const list = Array.isArray(data.unlocked) ? data.unlocked : []
      const merged = [...new Set([...readLocal(), ...list])]
      writeLocal(merged)
      setUnlocked(merged)
      setNextHall(data.nextHall || null)
      setCodes(data.codes || [])
      setError('')
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const unlock = useCallback(
    async (hallId, code) => {
      setError('')
      const res = await fetch('/api/hub/unlock', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hall: hallId, code }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Unlock failed')
        return { ok: false, error: data.error || 'Unlock failed' }
      }
      const list = Array.isArray(data.unlocked) ? data.unlocked : []
      writeLocal(list)
      setUnlocked(list)
      await refresh()
      return { ok: true, unlocked: list }
    },
    [refresh],
  )

  return {
    unlocked,
    unlockedSet: new Set(unlocked),
    nextHall,
    codes,
    loading,
    error,
    unlock,
    refresh,
  }
}
