import {
  EVENT_START,
  getMosaicCompanies,
  getPhaseName,
} from '../data/schedule'
import { useNow } from '../hooks/useNow'
import SimpleCountdown from '../components/SimpleCountdown'
import MosaicFrame from '../components/MosaicFrame'
import { DEMO_RATE, isDemoMode, resetDemoSession } from '../utils/demoTime'

export default function HubPage() {
  const now = useNow()
  const eventStart = new Date(EVENT_START)
  const companies = getMosaicCompanies()
  const demo = isDemoMode()
  const msToEvent = eventStart - now
  const showCountdown = msToEvent > 0
  const anyActive = companies.some((c) => getPhaseName(c, now) !== 'idle') || demo

  function restartDemo() {
    if (!demo) return
    resetDemoSession()
    window.location.href = '/?demo=1'
  }

  return (
    <div className="min-h-svh bg-white text-black">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
        {demo && (
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-black/40">
            <span>Demo · {DEMO_RATE}× time · start T−1h</span>
            <button
              type="button"
              onClick={restartDemo}
              className="underline underline-offset-2 hover:text-black/70"
            >
              Restart
            </button>
          </div>
        )}

        {showCountdown && (
          <div
            className={`${anyActive ? 'mb-10' : 'mb-10 flex min-h-[40vh] items-center justify-center'}`}
          >
            <SimpleCountdown
              targetDate={eventStart}
              now={now}
              label="August 13 · 8:00 AM PDT"
            />
          </div>
        )}

        {!showCountdown && (
          <div className="mb-8 text-center">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-black/35">
              Valhalla
            </p>
            <p className="text-sm text-black/50">Twelve halls. One civilization.</p>
          </div>
        )}

        {(anyActive || !showCountdown) && (
          <div className="mosaic-grid grid grid-cols-4">
            {companies.map((company) => (
              <MosaicFrame key={company.slug} company={company} now={now} />
            ))}
          </div>
        )}

        {anyActive && showCountdown && (
          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-black/30">
            Frames under construction
          </p>
        )}
      </div>
    </div>
  )
}
