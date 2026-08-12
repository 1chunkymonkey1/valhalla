import { useEffect, useState } from 'react'
import { getClockMode, getSimulatedNow } from '../lib/simulationClock'

export function useSimulationClock() {
  const [now, setNow] = useState(() => getSimulatedNow())
  const [mode, setMode] = useState(() => getClockMode())

  useEffect(() => {
    const tick = () => {
      setMode(getClockMode())
      setNow(getSimulatedNow())
    }
    tick()
    const ms = getClockMode() === 'demo' ? 50 : 250
    const id = setInterval(tick, ms)
    return () => clearInterval(id)
  }, [])

  return { now, mode }
}
