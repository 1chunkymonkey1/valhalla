import { Lock, ExternalLink, Zap } from 'lucide-react'
import { formatCountdown, formatDropHour } from '../utils/launchState'

export default function LaunchCard({ item, msToNext }) {
  const { state, name, concept, tag, url, launchTime } = item

  if (state === 'locked') {
    return (
      <article className="launch-card launch-card--locked group">
        <div className="flex items-start justify-between mb-3">
          <span className="font-mono text-xs text-stone-600">#{String(item.id).padStart(2, '0')}</span>
          <Lock className="w-4 h-4 text-stone-600" />
        </div>
        <h3 className="text-base font-medium text-stone-500 mb-1">{name}</h3>
        <p className="text-xs text-stone-600 line-clamp-2 mb-4">{concept}</p>
        <div className="mt-auto pt-3 border-t border-stone-800">
          <p className="font-mono text-xs text-stone-600 uppercase tracking-wider">Scheduled</p>
          <p className="font-mono text-sm text-stone-500 tabular-nums">{formatDropHour(launchTime)}</p>
        </div>
      </article>
    )
  }

  if (state === 'next') {
    return (
      <article className="launch-card launch-card--next">
        <div className="absolute inset-0 rounded cyber-border pointer-events-none" />
        <div className="flex items-start justify-between mb-3">
          <span className="font-mono text-xs text-emerald/70">#{String(item.id).padStart(2, '0')}</span>
          <Zap className="w-4 h-4 text-emerald animate-pulse" />
        </div>
        <h3 className="text-base font-medium text-emerald text-glow mb-1">{name}</h3>
        <p className="text-xs text-stone-400 line-clamp-2 mb-2">{concept}</p>
        <p className="font-mono text-[10px] text-rust-light uppercase tracking-wider mb-4">{tag}</p>
        <div className="mt-auto pt-3 border-t border-emerald/20">
          <p className="font-mono text-xs text-emerald/60 uppercase tracking-wider mb-1">Drops In</p>
          <p className="font-mono text-xl text-emerald tabular-nums text-glow tracking-wider">
            {formatCountdown(msToNext)}
          </p>
        </div>
      </article>
    )
  }

  return (
    <article className="launch-card launch-card--live">
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono text-xs text-emerald">#{String(item.id).padStart(2, '0')}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-emerald px-2 py-0.5 rounded bg-emerald/10 border border-emerald/30">
          Live
        </span>
      </div>
      <h3 className="text-base font-medium text-stone-100 mb-1">{name}</h3>
      <p className="text-xs text-stone-400 line-clamp-2 mb-2">{concept}</p>
      <p className="font-mono text-[10px] text-rust-light uppercase tracking-wider mb-4">{tag}</p>
      <div className="mt-auto">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded font-mono text-xs uppercase tracking-widest
                     bg-emerald/10 border border-emerald/50 text-emerald
                     hover:bg-emerald/20 hover:border-emerald hover:shadow-[0_0_20px_rgba(0,255,157,0.3)]
                     transition-all duration-200"
        >
          Enter Platform
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  )
}
