import { Zap, Clock, Radio } from 'lucide-react'
import { formatCountdown } from '../utils/launchState'

export default function MasterCountdown({ liveItem, nextItem, msToNext, allLaunched, eventStarted }) {
  const countdown = formatCountdown(msToNext)

  return (
    <header className="relative overflow-hidden border border-rust/30 bg-slate-deep/90 backdrop-blur-sm">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,157,0.08),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.04] bg-concrete" />

      <div className="relative px-4 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col items-center gap-2 mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-emerald/70">
            Valhalla Multi-Launch Hub
          </p>
          <h1 className="text-2xl sm:text-3xl font-medium text-stone-100 tracking-tight">
            August 13 — Sequential Drop Protocol
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Live Now */}
          <div className="flex flex-col items-center justify-center p-4 rounded border border-emerald/20 bg-emerald/5">
            <div className="flex items-center gap-2 mb-2">
              <Radio className="w-4 h-4 text-emerald animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-emerald/80">
                Live Now
              </span>
            </div>
            {liveItem ? (
              <p className="text-lg font-medium text-emerald text-glow">{liveItem.name}</p>
            ) : (
              <p className="text-sm text-stone-500">Awaiting first drop</p>
            )}
          </div>

          {/* Master Countdown */}
          <div className="flex flex-col items-center justify-center p-4 rounded border border-rust/40 bg-iron/10">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-rust-light" />
              <span className="font-mono text-xs uppercase tracking-widest text-stone-400">
                {allLaunched ? 'Sequence Complete' : 'Next Drop In'}
              </span>
            </div>
            {!allLaunched ? (
              <p className="font-mono text-3xl sm:text-4xl text-emerald tabular-nums text-glow tracking-wider">
                {countdown}
              </p>
            ) : (
              <p className="font-mono text-xl text-emerald/80">ALL LIVE</p>
            )}
          </div>

          {/* Next Up */}
          <div className="flex flex-col items-center justify-center p-4 rounded border border-emerald/30 bg-slate-mid/50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-emerald" />
              <span className="font-mono text-xs uppercase tracking-widest text-emerald/80">
                Next Up
              </span>
            </div>
            {nextItem ? (
              <p className="text-lg font-medium text-stone-100">{nextItem.name}</p>
            ) : eventStarted ? (
              <p className="text-sm text-stone-500">Final drop deployed</p>
            ) : (
              <p className="text-sm text-stone-500">Preparing sequence</p>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
