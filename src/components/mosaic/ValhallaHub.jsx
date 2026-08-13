import { getEventStart } from '../../lib/launchSchedule'
import { useSimulationClock } from '../../hooks/useSimulationClock'
import CountdownClock from './CountdownClock'
import MosaicGrid from './MosaicGrid'
import DemoControls from './DemoControls'
import SiteMenu from '../layout/SiteMenu'
import EmailCapture from '../EmailCapture'
import { DISCORD_INVITE } from '../../data/pressRelease'
import { Link } from 'react-router-dom'

export default function ValhallaHub() {
  const { now, mode } = useSimulationClock()
  const eventStart = getEventStart()
  const showCountdown = now < eventStart

  return (
    <div className="vh-hub">
      <div className="vh-hub__grain" aria-hidden />
      <SiteMenu tone="hub" />
      <div className="vh-hub__inner">
        <DemoControls mode={mode} />

        {showCountdown && (
          <header className="vh-hub__header">
            <CountdownClock
              targetDate={eventStart}
              now={now}
              label="August 13 · 8:00 AM PDT"
            />
            <p className="vh-hub__hint">
              Halls unlock when this clock hits zero — then each opens the next.
            </p>
          </header>
        )}

        {!showCountdown && (
          <header className="vh-hub__header vh-hub__header--quiet">
            <p className="vh-hub__mark">Valhalla</p>
          </header>
        )}

        <MosaicGrid now={now} />

        <section className="vh-hub__capture" aria-label="Email signup">
          <EmailCapture source="hub" audience="newsletter" />
        </section>

        <footer className="vh-hub__foot">
          <Link to="/press">Press</Link>
          <Link to="/flow">Flow</Link>
          <a href={DISCORD_INVITE} target="_blank" rel="noreferrer">
            Discord
          </a>
          <Link to="/contact">Contact</Link>
        </footer>
      </div>
    </div>
  )
}
