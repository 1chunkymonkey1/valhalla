import { Link } from 'react-router-dom'
import SimpleCountdown from './SimpleCountdown'
import HallUnlockForm from './HallUnlockForm'
import { formatPDT } from '../utils/time'
import { getCompany } from '../lib/companies'
import { getNextDoorCue } from '../data/nextDoorCues'
import {
  getHubClickAt,
  getNextCompanyId,
  getNextPreviewUnlockAt,
  getWave2Start,
  INSTAGRAM_URL,
  isWave2Hall,
} from '../lib/launchSchedule'

/**
 * Chain bridge on each company site:
 * Wave 1 — cue + blank + 1h countdown, then clickable next name
 * Into / within wave 2 — Instagram code unlock
 */
export default function NextDoor({
  company,
  now,
  unlockedSet = new Set(),
  unlock,
  unlockError,
}) {
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

  if (isWave2Hall(next.id)) {
    const wave2Start = getWave2Start()
    const beforeBreak = now.getTime() < wave2Start.getTime()
    const unlocked = unlockedSet.has(next.id)

    if (unlocked) {
      return (
        <div className="cs-nextdoor">
          <p className="cs-nextdoor__kicker">Next door</p>
          <p className="cs-nextdoor__line">
            <Link to={`/${next.id}`} className="cs-nextdoor__name">
              {next.name}
            </Link>{' '}
            is open.
          </p>
        </div>
      )
    }

    if (beforeBreak) {
      return (
        <div className="cs-nextdoor">
          <p className="cs-nextdoor__kicker">Next door</p>
          <p className="cs-nextdoor__line">
            Wave 2 begins after a short break. Codes land on{' '}
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              Instagram
            </a>
            .
          </p>
          <div className="cs-nextdoor__clock">
            <SimpleCountdown
              targetDate={wave2Start}
              now={now}
              label={`Codes from ${formatPDT(wave2Start)}`}
            />
          </div>
        </div>
      )
    }

    return (
      <div className="cs-nextdoor">
        <HallUnlockForm
          hallId={next.id}
          onUnlock={unlock}
          error={unlockError}
          compact
        />
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
        <p className="cs-nextdoor__note">{next.name} is also live on the mosaic.</p>
      )}
    </div>
  )
}
