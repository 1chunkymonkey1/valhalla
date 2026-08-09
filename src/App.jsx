import MasterCountdown from './components/MasterCountdown'
import LaunchCard from './components/LaunchCard'
import { useLaunchClock } from './hooks/useLaunchClock'
import { LAUNCH_DATE } from './data/schedule'

export default function App() {
  const { cardStates, liveItem, nextItem, msToNext, allLaunched, eventStarted } =
    useLaunchClock()

  return (
    <div className="min-h-svh bg-slate-deep text-stone-300">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,90,43,0.06),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-concrete" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-10">
        <MasterCountdown
          liveItem={liveItem}
          nextItem={nextItem}
          msToNext={msToNext}
          allLaunched={allLaunched}
          eventStarted={eventStarted}
        />

        <section className="mt-8 sm:mt-10">
          <div className="flex items-center justify-between mb-5 px-1">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
              Launch Sequence Matrix
            </h2>
            <p className="font-mono text-xs text-stone-600 tabular-nums">{LAUNCH_DATE}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cardStates.map((item) => (
              <LaunchCard
                key={item.id}
                item={item}
                msToNext={item.state === 'next' ? msToNext : 0}
              />
            ))}
          </div>
        </section>

        <footer className="mt-10 pt-6 border-t border-rust/20 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-stone-600">
            0800 — 2000 HRS · Lunch Halt 1200 — 1300
          </p>
        </footer>
      </div>
    </div>
  )
}
