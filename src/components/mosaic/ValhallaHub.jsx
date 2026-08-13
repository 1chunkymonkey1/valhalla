import {
  getEventStart,
  getHubClickAt,
  getNextCodeHall,
  getWave2Start,
} from '../../lib/launchSchedule'
import { useSimulationClock } from '../../hooks/useSimulationClock'
import { useHallUnlocks } from '../../hooks/useHallUnlocks'
import CountdownClock from './CountdownClock'
import MosaicGrid from './MosaicGrid'
import DemoControls from './DemoControls'
import SiteMenu from '../layout/SiteMenu'
import EmailCapture from '../EmailCapture'
import HallUnlockForm from '../HallUnlockForm'
import { DISCORD_INVITE } from '../../data/pressRelease'
import { Link } from 'react-router-dom'
import SimpleCountdown from '../SimpleCountdown'

export default function ValhallaHub() {
  const { now, mode } = useSimulationClock()
  const eventStart = getEventStart()
  const wave2Start = getWave2Start()
  const showCountdown = now < eventStart
  const { unlockedSet, unlock, error, nextHall } = useHallUnlocks()
  const njordLive = !showCountdown && now >= getHubClickAt('njord')
  const inWave2Break = njordLive && now < wave2Start
  const codeHall =
    !showCountdown && now >= wave2Start ? getNextCodeHall(unlockedSet, now) || nextHall : null

  return (
    <div className={`vh-hub ${showCountdown ? 'vh-hub--dormant' : ''}`}>
      <div className="vh-hub__grain" aria-hidden />
      {!showCountdown && <SiteMenu tone="hub" />}
      <div className="vh-hub__inner">
        <DemoControls mode={mode} />

        {showCountdown ? (
          <header className="vh-hub__header vh-hub__header--solo">
            <img
              className="vh-hub__glyph"
              src="/brand-mark.svg"
              alt=""
              width={28}
              height={28}
              decoding="async"
            />
            <p className="vh-hub__mark">Valhalla</p>
            <CountdownClock
              targetDate={eventStart}
              now={now}
              label="August 13 · 8:00 AM PDT"
            />
          </header>
        ) : (
          <>
            <header className="vh-hub__header vh-hub__header--quiet">
              <p className="vh-hub__mark">Valhalla</p>
            </header>

            <MosaicGrid now={now} unlockedSet={unlockedSet} />

            {inWave2Break && (
              <section className="vh-hub__break" aria-label="Wave 2 break">
                <p className="vh-hub__break-kicker">After Njord</p>
                <SimpleCountdown
                  targetDate={wave2Start}
                  now={now}
                  label="Wave 2 codes · 2:00 PM PDT"
                />
                <p className="vh-hub__hint">
                  Eagle through Corvus open with Instagram codes after this break.
                </p>
              </section>
            )}

            {codeHall && (
              <section className="vh-hub__unlock" aria-label="Hall unlock">
                <HallUnlockForm hallId={codeHall} onUnlock={unlock} error={error} />
              </section>
            )}

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
          </>
        )}
      </div>
    </div>
  )
}
