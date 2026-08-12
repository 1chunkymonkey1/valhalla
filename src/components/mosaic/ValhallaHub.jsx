import { getEventStart } from '../../lib/launchSchedule'
import { useSimulationClock } from '../../hooks/useSimulationClock'
import CountdownClock from './CountdownClock'
import MosaicGrid from './MosaicGrid'
import DemoControls from './DemoControls'

export default function ValhallaHub() {
  const { now, mode } = useSimulationClock()
  const eventStart = getEventStart()
  const showCountdown = now < eventStart

  return (
    <div className="vh-hub">
      <div className="vh-hub__grain" aria-hidden />
      <div className="vh-hub__inner">
        <DemoControls mode={mode} />

        {showCountdown && (
          <header className="vh-hub__header">
            <CountdownClock
              targetDate={eventStart}
              now={now}
              label="August 13 · 8:00 AM PDT"
            />
          </header>
        )}

        {!showCountdown && (
          <header className="vh-hub__header vh-hub__header--quiet">
            <p className="vh-hub__mark">Valhalla</p>
          </header>
        )}

        <MosaicGrid now={now} />
      </div>
    </div>
  )
}
