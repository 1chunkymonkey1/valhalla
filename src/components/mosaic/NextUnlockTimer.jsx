import { getNextHubUnlock } from '../../lib/launchSchedule'
import { getCompany } from '../../lib/companies'
import { formatCountdown } from '../../utils/time'

/**
 * Subtle top-of-viewport countdown to the next mosaic unlock.
 * Only meaningful once the mosaic is live (caller gates on !dormant).
 */
export default function NextUnlockTimer({ now }) {
  const next = getNextHubUnlock(now)
  if (!next || next.kind === 'all-open') return null

  const name = next.companyId ? getCompany(next.companyId)?.name : null
  const ms = next.at.getTime() - now.getTime()

  return (
    <div className="vh-next-timer" aria-live="polite">
      <span className="vh-next-timer__label">Next opens in</span>
      <span className="vh-next-timer__time">{formatCountdown(ms)}</span>
      {name && <span className="vh-next-timer__name">{name}</span>}
    </div>
  )
}
