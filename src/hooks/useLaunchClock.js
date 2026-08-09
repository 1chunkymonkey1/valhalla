import { useEffect, useState } from 'react'
import { getLaunchStates } from '../utils/launchState'

export function useLaunchClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return getLaunchStates(now)
}
