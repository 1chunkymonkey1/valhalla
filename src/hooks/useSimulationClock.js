import { useEffect, useState } from 'react'
import {
  getClockMode,
  getDemoRate,
  getSimulatedNow,
  isDemoPaused,
} from '../lib/simulationClock'

export function useSimulationClock() {
  const [now, setNow] = useState(() => getSimulatedNow())
  const [mode, setMode] = useState(() => getClockMode())
  const [rate, setRate] = useState(() => getDemoRate())
  const [paused, setPaused] = useState(() => isDemoPaused())

  useEffect(() => {
    const sync = () => {
      setMode(getClockMode())
      setRate(getDemoRate())
      setPaused(isDemoPaused())
      setNow(getSimulatedNow())
    }
    sync()
    const id = setInterval(sync, 100)
    window.addEventListener('valhalla-clock', sync)
    window.addEventListener('storage', sync)
    return () => {
      clearInterval(id)
      window.removeEventListener('valhalla-clock', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return { now, mode, rate, paused }
}
