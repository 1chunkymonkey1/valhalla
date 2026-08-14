import { useEffect, useState } from 'react'
import { getEventStart, getHubClickAt, getWave2Start } from '../../lib/launchSchedule'
import { useSimulationClock } from '../../hooks/useSimulationClock'
import CountdownClock from './CountdownClock'
import MosaicGrid from './MosaicGrid'
import NextUnlockTimer from './NextUnlockTimer'
import DemoControls from './DemoControls'
import EmailCapture from '../EmailCapture'
import CompanySocialLinks from '../CompanySocialLinks'
import AskHallWidget from '../AskHallWidget'
import PublishedBlocks, { fetchPublishedLayout } from '../PublishedBlocks'
import { DISCORD_URL, INSTAGRAM_URL, LINKEDIN_URL } from '../../lib/launchSchedule'
import { Link } from 'react-router-dom'
import SimpleCountdown from '../SimpleCountdown'

const HUB_SOCIAL = {
  companyId: 'hub',
  linkedin: LINKEDIN_URL,
  instagram: INSTAGRAM_URL,
  x: '',
  discord: DISCORD_URL,
}

export default function ValhallaHub() {
  const { now, mode, rate, paused } = useSimulationClock()
  const eventStart = getEventStart()
  const wave2Start = getWave2Start()
  const showCountdown = now < eventStart
  const njordLive = !showCountdown && now >= getHubClickAt('njord')
  const inWave2Break = njordLive && now < wave2Start
  const [hubLayout, setHubLayout] = useState(null)
  const [hubSocial, setHubSocial] = useState(HUB_SOCIAL)

  useEffect(() => {
    if (showCountdown) return
    let cancelled = false
    fetchPublishedLayout('hub').then((layout) => {
      if (!cancelled) setHubLayout(layout)
    })
    return () => {
      cancelled = true
    }
  }, [showCountdown])

  useEffect(() => {
    let cancelled = false
    fetch('/api/hub/socials')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data?.socials) return
        const hit = data.socials.find((s) => s.companyId === 'hub')
        if (!hit) return
        setHubSocial({
          ...HUB_SOCIAL,
          linkedin: hit.linkedin || HUB_SOCIAL.linkedin,
          instagram: hit.instagram || HUB_SOCIAL.instagram,
          x: hit.x || HUB_SOCIAL.x,
          discord: hit.discord || HUB_SOCIAL.discord,
        })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className={`vh-hub ${showCountdown ? 'vh-hub--dormant' : ''}`}>
      <div className="vh-hub__grain" aria-hidden />
      {!showCountdown && <NextUnlockTimer now={now} />}
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

            <MosaicGrid now={now} />

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
                  label="Wave 2 · 2:00 PM PDT"
                />
                <p className="vh-hub__hint">Eagle through Corvus open on the afternoon schedule.</p>
              </section>
            )}

            <section className="vh-hub__capture" aria-label="Email signup">
              <EmailCapture source="hub" audience="newsletter" />
            </section>

            <footer className="vh-hub__foot">
              <nav className="vh-hub__foot-nav" aria-label="Hub links">
                <Link to="/press">Press</Link>
                <Link to="/flow">Flow</Link>
                <Link to="/contact">Contact</Link>
              </nav>
              <CompanySocialLinks social={hubSocial} className="vh-hub__socials" />
            </footer>
            <AskHallWidget pageId="hub" hallName="Valhalla" dormant={false} />
          </>
        )}
      </div>
    </div>
  )
}
