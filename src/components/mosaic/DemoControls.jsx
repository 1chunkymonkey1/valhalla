import {
  resetDemoSession,
  exitDemoToLive,
  getDemoRate,
  isDemoPaused,
  toggleDemoPause,
} from '../../lib/simulationClock'

export default function DemoControls({ mode, rate, paused }) {
  if (mode !== 'demo') return null

  const displayRate = rate || getDemoRate()
  const isPaused = typeof paused === 'boolean' ? paused : isDemoPaused()

  function restart() {
    resetDemoSession()
    window.location.href = '/?demo=1'
  }

  function exitDemo() {
    exitDemoToLive()
    window.location.href = '/?demo=0'
  }

  function onPauseToggle() {
    toggleDemoPause()
  }

  return (
    <div className="vh-demo-controls">
      <span>
        Demo · {displayRate}× · start T−1h{isPaused ? ' · paused' : ''}
      </span>
      <button type="button" onClick={onPauseToggle}>
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <button type="button" onClick={restart}>
        Restart
      </button>
      <button type="button" onClick={exitDemo}>
        Live
      </button>
    </div>
  )
}
