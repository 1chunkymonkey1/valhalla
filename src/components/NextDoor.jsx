import { Link } from 'react-router-dom'
import SimpleCountdown from './SimpleCountdown'
import { formatPDT } from '../utils/time'
import { REVEAL_ORDER, getCompany } from '../lib/companies'
import { getPortalPhase, getRevealAt } from '../lib/launchSchedule'

export default function NextDoor({ company, now }) {
  const idx = REVEAL_ORDER.indexOf(company.slug)
  const nextId = idx >= 0 && idx < REVEAL_ORDER.length - 1 ? REVEAL_ORDER[idx + 1] : null
  const next = nextId ? getCompany(nextId) : null
  const nextOpen = next ? ['revealed', 'clickable'].includes(getPortalPhase(next.id, now)) : false
  const nextLaunch = next ? getRevealAt(next.id) : null

  return (
    <div className="border-t border-black/10 pt-10 mt-16">
      {next ? (
        nextOpen ? (
          <Link
            to={`/${next.id}`}
            className="block text-center font-mono text-sm tracking-wide hover:underline underline-offset-4"
          >
            Continue to {next.name} →
          </Link>
        ) : (
          <SimpleCountdown
            targetDate={nextLaunch}
            now={now}
            label={`Next door opens · ${next.name} · ${formatPDT(nextLaunch)}`}
          />
        )
      ) : (
        <p className="text-center text-sm opacity-50">
          Sequence complete.{' '}
          <Link to="/" className="underline underline-offset-2">
            View the mosaic
          </Link>
        </p>
      )}
    </div>
  )
}
