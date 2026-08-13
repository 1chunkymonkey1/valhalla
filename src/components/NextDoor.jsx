import { Link } from 'react-router-dom'
import SimpleCountdown from './SimpleCountdown'
import { formatPDT } from '../utils/time'
import { getCompany } from '../lib/companies'
import {
  getHubClickAt,
  getNextCompanyId,
  getNextPreviewUnlockAt,
} from '../lib/launchSchedule'
import { getNextDoorCue } from '../data/nextDoorCues'

/**
 * Chain bridge on each company site:
 * 1) Cue + blank + 1h countdown until next preview unlock
 * 2) Cue + clickable next name when countdown hits 0
 * 3) Soft note that the mosaic tile opens 30 minutes later
 */
export default function NextDoor({ company, now }) {
  const nextId = getNextCompanyId(company.slug)
  const next = nextId ? getCompany(nextId) : null

  if (!next) {
    return (
      <div className="cs-nextdoor">
        <p className="cs-nextdoor__done">
          Sequence complete.{' '}
          <Link to="/?demo=1" className="cs-nextdoor__hub-link">
            View the mosaic
          </Link>
        </p>
      </div>
    )
  }

  const cue = getNextDoorCue(company.slug)
  const previewAt = getNextPreviewUnlockAt(company.slug)
  const hubAt = getHubClickAt(next.id)
  const previewOpen = previewAt && now.getTime() >= previewAt.getTime()
  const hubOpen = now.getTime() >= hubAt.getTime()

  return (
    <div className="cs-nextdoor">
      <p className="cs-nextdoor__kicker">Next door</p>

      <p className="cs-nextdoor__line">
        <span>{previewOpen ? cue.after : cue.before}</span>{' '}
        {previewOpen ? (
          <Link to={`/${next.id}`} className="cs-nextdoor__name">
            {next.name}
          </Link>
        ) : (
          <span className="cs-nextdoor__blank" aria-label="locked destination">
            ____
          </span>
        )}
      </p>

      {!previewOpen && previewAt && (
        <div className="cs-nextdoor__clock">
          <SimpleCountdown
            targetDate={previewAt}
            now={now}
            label={`Unlocks ${formatPDT(previewAt)}`}
          />
        </div>
      )}

      {previewOpen && !hubOpen && (
        <p className="cs-nextdoor__note">
          {next.name} is open from here. Mosaic tile unlocks {formatPDT(hubAt)}.
        </p>
      )}

      {hubOpen && (
        <p className="cs-nextdoor__note">
          {next.name} is also live on the mosaic.
        </p>
      )}
    </div>
  )
}
