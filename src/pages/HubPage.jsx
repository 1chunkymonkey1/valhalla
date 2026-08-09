import { EVENT_START, schedule, isEventStarted, isHubRevealed } from '../data/schedule'
import { useNow } from '../hooks/useNow'
import SimpleCountdown from '../components/SimpleCountdown'
import MosaicTile from '../components/MosaicTile'

export default function HubPage() {
  const now = useNow()
  const eventStarted = isEventStarted(now)
  const eventStart = new Date(EVENT_START)
  const unlocked = schedule.filter((c) => isHubRevealed(c, now)).length

  if (!eventStarted) {
    return (
      <div className="min-h-svh bg-white text-black flex items-center justify-center px-6">
        <SimpleCountdown
          targetDate={eventStart}
          now={now}
          label="August 13 · 8:00 AM PDT"
        />
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-white text-black">
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-3xl mx-auto">
        {unlocked < 12 && (
          <p className="text-center text-sm text-black/40 mb-6 font-mono">
            {unlocked} of 12
          </p>
        )}

        <div className="grid grid-cols-4 grid-rows-3 gap-1 sm:gap-1.5">
          {schedule.map((company) => (
            <MosaicTile key={company.id} company={company} now={now} />
          ))}
        </div>

        {unlocked === 12 && (
          <p className="text-center mt-8 text-sm text-black/60">
            Twelve companies. One day. The world shifts.
          </p>
        )}
      </div>
    </div>
  )
}
