import { getNextHubUnlock } from '../../lib/launchSchedule'
import { getCompany } from '../../lib/companies'
import { formatCountdown } from '../../utils/time'

/**
 * Subtle top-of-viewport countdown to the next mosaic unlock.
 * Only meaningful once the mosaic is live (caller gates on !dormant).
 */
export default function NextUnlockTimer({ now, unlockedSet }) {
  const next = getNextHubUnlock(now, unlockedSet)
  if (!next) return null

  if (next.kind === 'all-open') {
    return (
      <div className="vh-next-timer" aria-live="polite">
        <span className="vh-next-timer__idle">All open</span>
      </div>
    )
  }

  const name = next.companyId ? getCompany(next.companyId)?.name : null

  if (next.kind === 'code') {
    return (
      <div className="vh-next-timer" aria-live="polite">
        <span className="vh-next-timer__idle">Code required</span>
        {name && <span className="vh-next-timer__name">{name}</span>}
      </div>
    )
  }

  const ms = next.at.getTime() - now.getTime()

  return (
    <div className="vh-next-timer" aria-live="polite">
      <span className="vh-next-timer__label">Next opens in</span>
      <span className="vh-next-timer__time">{formatCountdown(ms)}</span>
      {name && <span className="vh-next-timer__name">{name}</span>}
    </div>
  )
}
