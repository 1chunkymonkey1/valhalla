import { useEffect, useState } from 'react'
import { getDemoNow, isDemoMode } from '../utils/demoTime'

export function useNow(intervalMs = 100) {
  const [now, setNow] = useState(() => (isDemoMode() ? getDemoNow() : new Date()))

  useEffect(() => {
    const tick = () => {
      setNow(isDemoMode() ? getDemoNow() : new Date())
    }
    tick()
    // Faster UI refresh in demo so 100× clock feels smooth
    const ms = isDemoMode() ? 50 : intervalMs
    const id = setInterval(tick, ms)
    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
