import { useEffect, useState } from 'react'
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
import NextUnlockTimer from './NextUnlockTimer'
import DemoControls from './DemoControls'
import SiteMenu from '../layout/SiteMenu'
import EmailCapture from '../EmailCapture'
import HallUnlockForm from '../HallUnlockForm'
import CompanySocialLinks from '../CompanySocialLinks'
import AskHallWidget from '../AskHallWidget'
import PublishedBlocks, { fetchPublishedLayout } from '../PublishedBlocks'
import { DISCORD_INVITE } from '../../data/pressRelease'
import { INSTAGRAM_URL } from '../../lib/launchSchedule'
import { Link } from 'react-router-dom'
import SimpleCountdown from '../SimpleCountdown'

export default function ValhallaHub() {
  const { now, mode, rate, paused } = useSimulationClock()
  const eventStart = getEventStart()
  const wave2Start = getWave2Start()
  const showCountdown = now < eventStart
  const { unlockedSet, unlock, error, nextHall } = useHallUnlocks()
  const njordLive = !showCountdown && now >= getHubClickAt('njord')
  const inWave2Break = njordLive && now < wave2Start
  const codeHall =
    !showCountdown && now >= wave2Start ? getNextCodeHall(unlockedSet, now) || nextHall : null
  const [hubLayout, setHubLayout] = useState(null)
  const [hubSocial, setHubSocial] = useState({
    companyId: 'hub',
    instagram: INSTAGRAM_URL,
    discord: DISCORD_INVITE,
  })

  useEffect(() => {
    if (showCountdown) return
    let cancelled = false
    fetchPublishedLayout('hub').then((layout) => {
      if (!cancelled) setHubLayout(layout)
    })
    fetch('/api/hub/socials')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data?.socials?.length) return
        // Hub shows Valhalla IG/Discord plus a light sample of hall links (Wolf).
        const wolf = data.socials.find((s) => s.companyId === 'wolf')
        setHubSocial({
          companyId: 'hub',
          instagram: INSTAGRAM_URL,
          discord: DISCORD_INVITE,
          x: wolf?.x || '',
        })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [showCountdown])

  return (
    <div className={`vh-hub ${showCountdown ? 'vh-hub--dormant' : ''}`}>
      <div className="vh-hub__grain" aria-hidden />
      {showCountdown && (
        <img
          className="vh-hub__brand-corner"
          src="/brand-mark.png"
          alt="Valhalla"
          width={32}
          height={32}
          decoding="async"
        />
      )}
      {!showCountdown && <SiteMenu tone="hub" />}
      {!showCountdown && <NextUnlockTimer now={now} unlockedSet={unlockedSet} />}
      <div className="vh-hub__inner">
        <DemoControls mode={mode} rate={rate} paused={paused} />

        {showCountdown ? (
          <header className="vh-hub__header vh-hub__header--solo">
            <CountdownClock targetDate={eventStart} now={now} />
          </header>
        ) : (
          <>
            <header className="vh-hub__header vh-hub__header--quiet">
              <p className="vh-hub__mark">Valhalla</p>
            </header>

            <MosaicGrid now={now} unlockedSet={unlockedSet} />

            {hubLayout?.enabled && hubLayout.blocks?.length > 0 && (
              <section className="vh-hub__pub" aria-label="Hub custom content">
                <PublishedBlocks layout={hubLayout} />
              </section>
            )}

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
              <Link to="/contact">Contact</Link>
              <CompanySocialLinks social={hubSocial} className="vh-hub__socials" />
            </footer>
            <AskHallWidget pageId="hub" hallName="Valhalla" dormant={false} />
          </>
        )}
      </div>
    </div>
  )
}
