import { useEffect, useState } from 'react'
import {
  DEMO_RATE,
  DEMO_RATE_OPTIONS,
  DEMO_START_BEFORE_MS,
  exitDemoToLive,
  formatSimOffset,
  getClockMode,
  getDemoRate,
  getRevealBookmarks,
  getSimulatedNow,
  isDemoPaused,
  pauseDemoClock,
  resetDemoSession,
  resumeDemoClock,
  seekToEventOffsetMs,
  setDemoRate,
  startFullReveal,
} from '../lib/simulationClock'
import { getEventStart, getWave2Start } from '../lib/launchSchedule'

const SCRUB_MIN = -DEMO_START_BEFORE_MS
const SCRUB_MAX = () => getWave2Start().getTime() - getEventStart().getTime() + 60 * 60 * 1000

export default function AdminRevealControls() {
  const [mode, setMode] = useState(() => getClockMode())
  const [rate, setRate] = useState(() => getDemoRate())
  const [paused, setPaused] = useState(() => isDemoPaused())
  const [simLabel, setSimLabel] = useState(() => formatSimOffset())
  const [scrub, setScrub] = useState(() => {
    const now = getSimulatedNow().getTime()
    return now - getEventStart().getTime()
  })

  useEffect(() => {
    const sync = () => {
      setMode(getClockMode())
      setRate(getDemoRate())
      setPaused(isDemoPaused())
      const sim = getSimulatedNow()
      setSimLabel(formatSimOffset(sim))
      setScrub(sim.getTime() - getEventStart().getTime())
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

  function watchReveal() {
    startFullReveal({ rate: rate || DEMO_RATE, openHub: true })
  }

  function onRate(next) {
    setDemoRate(next)
    setRate(getDemoRate())
  }

  function onScrub(value) {
    const offset = Number(value)
    setScrub(offset)
    seekToEventOffsetMs(offset)
    if (!isDemoPaused()) pauseDemoClock()
  }

  return (
    <section className="vh-admin__reveal">
      <div className="vh-admin__card">
        <h2>Launch reveal clock</h2>
        <p className="vh-admin__note">
          Drives the same demo clock as <code>/?demo=1</code> (shared via localStorage). Open the
          hub in another tab to watch countdown → unlocks → NextDoor chain. Public visitors stay on
          live time unless they use the demo query themselves.
        </p>

        <div className="vh-admin__reveal-status">
          <span>
            Mode: <strong>{mode}</strong>
          </span>
          <span>
            Sim: <strong>{simLabel}</strong>
          </span>
          <span>
            Speed: <strong>{rate}×</strong>
          </span>
          <span>
            {paused ? 'Paused' : 'Running'}
          </span>
        </div>

        <div className="vh-admin__reveal-actions">
          <button type="button" onClick={watchReveal}>
            Watch full reveal
          </button>
          <button type="button" onClick={() => (paused ? resumeDemoClock() : pauseDemoClock())}>
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button
            type="button"
            onClick={() => {
              resetDemoSession()
              window.open('/?demo=1', '_blank', 'noopener,noreferrer')
            }}
          >
            Restart at T−1h
          </button>
          <button
            type="button"
            onClick={() => {
              exitDemoToLive()
            }}
          >
            Exit to live
          </button>
        </div>
      </div>

      <div className="vh-admin__card">
        <h2>Speed</h2>
        <p className="vh-admin__note">Default demo is 100× (one real second = 100 simulated seconds).</p>
        <div className="vh-admin__reveal-rates">
          {DEMO_RATE_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              className={rate === r ? 'is-active' : ''}
              onClick={() => onRate(r)}
            >
              {r}×
            </button>
          ))}
        </div>
      </div>

      <div className="vh-admin__card">
        <h2>Time scrub</h2>
        <p className="vh-admin__note">
          Drag to jump the shared sim clock. Scrubbing pauses playback so you can inspect a moment.
        </p>
        <label className="vh-admin__reveal-scrub">
          <span>{simLabel}</span>
          <input
            type="range"
            min={SCRUB_MIN}
            max={SCRUB_MAX()}
            step={60 * 1000}
            value={Math.min(SCRUB_MAX(), Math.max(SCRUB_MIN, scrub))}
            onChange={(e) => onScrub(e.target.value)}
          />
        </label>
        <div className="vh-admin__reveal-jumps">
          {getRevealBookmarks().map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                seekToEventOffsetMs(b.offsetMs)
                pauseDemoClock()
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="vh-admin__card">
        <h2>How to use</h2>
        <ol className="vh-admin__reveal-help">
          <li>
            Click <strong>Watch full reveal</strong>, opens the hub at T−1h in demo mode.
          </li>
          <li>Adjust speed or pause here; the hub tab follows the same clock.</li>
          <li>Scrub or jump to Wave 2 / Njord / Event open to preview those beats.</li>
          <li>
            <strong>Exit to live</strong> restores real wall time for this browser.
          </li>
        </ol>
      </div>
    </section>
  )
}
