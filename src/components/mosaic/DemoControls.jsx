import { resetDemoSession, setClockMode, DEMO_RATE } from '../../lib/simulationClock'

export default function DemoControls({ mode }) {
  if (mode !== 'demo') return null

  function restart() {
    resetDemoSession()
    window.location.href = '/?demo=1'
  }

  function exitDemo() {
    setClockMode('live')
    window.location.href = '/?demo=0'
  }

  return (
    <div className="vh-demo-controls">
      <span>
        Demo · {DEMO_RATE}× · start T−1h
      </span>
      <button type="button" onClick={restart}>
        Restart
      </button>
      <button type="button" onClick={exitDemo}>
        Live
      </button>
    </div>
  )
}
