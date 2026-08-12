import { formatCountdown } from '../../utils/time'

export default function CountdownClock({ targetDate, now, label }) {
  const ms = targetDate - now

  return (
    <div className="vh-countdown">
      {label && <p className="vh-countdown__label">{label}</p>}
      <p className="vh-countdown__time" aria-live="polite">
        {formatCountdown(ms)}
      </p>
    </div>
  )
}
