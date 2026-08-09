import { formatCountdown } from '../utils/time'

export default function SimpleCountdown({ targetDate, now, label }) {
  const ms = targetDate - now

  return (
    <div className="text-center">
      {label && <p className="text-sm mb-2">{label}</p>}
      <p className="font-mono text-4xl sm:text-5xl tabular-nums tracking-tight">
        {formatCountdown(ms)}
      </p>
    </div>
  )
}
