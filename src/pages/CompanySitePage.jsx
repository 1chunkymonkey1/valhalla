import { Link, Navigate } from 'react-router-dom'
import { getCompany } from '../lib/companies'
import {
  canAttemptCode,
  getHubClickAt,
  getPreviewUnlockAt,
  getWave2Start,
  INSTAGRAM_URL,
  isCompanySiteOpen,
  isWave2Hall,
} from '../lib/launchSchedule'
import { useSimulationClock } from '../hooks/useSimulationClock'
import { useHallUnlocks } from '../hooks/useHallUnlocks'
import SimpleCountdown from '../components/SimpleCountdown'
import HallUnlockForm from '../components/HallUnlockForm'
import CompanySite from '../components/CompanySite'
import { formatPDT } from '../utils/time'

export default function CompanySitePage({ slug }) {
  const { now } = useSimulationClock()
  const { unlockedSet, unlock, error } = useHallUnlocks()
  const company = getCompany(slug)

  if (!company) return <Navigate to="/" replace />

  const open = isCompanySiteOpen(company.id, now, unlockedSet)
  const previewAt = getPreviewUnlockAt(company.id)
  const hubAt = getHubClickAt(company.id)

  if (!open) {
    if (isWave2Hall(company.id)) {
      const wave2Start = getWave2Start()
      const canTry = canAttemptCode(company.id, unlockedSet, now)

      return (
        <div className="vh-hub min-h-svh flex flex-col items-center justify-center px-6">
          <p className="vh-countdown__label mb-6">{company.name}</p>
          {now < wave2Start ? (
            <>
              <SimpleCountdown
                targetDate={wave2Start}
                now={now}
                label={`Wave 2 codes · ${formatPDT(wave2Start)}`}
              />
              <p className="mt-4 text-center text-xs text-black/35 max-w-xs">
                Codes publish on{' '}
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                  Instagram
                </a>{' '}
                after the break.
              </p>
            </>
          ) : canTry ? (
            <HallUnlockForm hallId={company.id} onUnlock={unlock} error={error} />
          ) : (
            <p className="text-center text-sm text-black/45 max-w-sm">
              Unlock the previous wave-2 hall first, then come back for {company.name}.
            </p>
          )}
          <Link to="/?demo=1" className="mt-12 text-sm text-black/30 hover:text-black/55">
            ← hub
          </Link>
        </div>
      )
    }

    return (
      <div className="vh-hub min-h-svh flex flex-col items-center justify-center px-6">
        <p className="vh-countdown__label mb-6">{company.name}</p>
        <SimpleCountdown
          targetDate={previewAt}
          now={now}
          label={`Opens via previous hall · ${formatPDT(previewAt)}`}
        />
        <p className="mt-4 text-center text-xs text-black/35 max-w-xs">
          Mosaic tile unlocks {formatPDT(hubAt)} — thirty minutes after the link appears next door.
        </p>
        <Link to="/?demo=1" className="mt-12 text-sm text-black/30 hover:text-black/55">
          ← hub
        </Link>
      </div>
    )
  }

  return (
    <CompanySite
      company={mapLegacy(company)}
      now={now}
      unlockedSet={unlockedSet}
      unlock={unlock}
      unlockError={error}
    />
  )
}

/** Adapt Phase 1 company shape to existing CompanySite props. */
function mapLegacy(company) {
  return {
    id:
      [
        'wolf',
        'holm',
        'demeter',
        'viking',
        'atoll',
        'njord',
        'eagle',
        'olympus',
        'aeolus',
        'phenix',
        'aether',
        'corvus',
      ].indexOf(company.id) + 1,
    slug: company.id,
    name: company.name,
    domain: company.domain[0].toUpperCase() + company.domain.slice(1),
    pillar: company.pillar[0].toUpperCase() + company.pillar.slice(1),
    publicStatus: 'concept',
    pattern: 'interest',
    tagline: company.name,
    concept: '',
    accent: '#1C1917',
    ink: '#FAFAF9',
    imageSrc: company.imageSrc,
    placeholderSrc: company.placeholderSrc,
  }
}
