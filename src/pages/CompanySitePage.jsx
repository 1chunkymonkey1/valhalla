import { Link, Navigate } from 'react-router-dom'
import { getCompany } from '../lib/companies'
import {
  getHubClickAt,
  getPreviewUnlockAt,
  isCompanySiteOpen,
} from '../lib/launchSchedule'
import { useSimulationClock } from '../hooks/useSimulationClock'
import SimpleCountdown from '../components/SimpleCountdown'
import CompanySite from '../components/CompanySite'
import { formatPDT } from '../utils/time'

export default function CompanySitePage({ slug }) {
  const { now } = useSimulationClock()
  const company = getCompany(slug)

  if (!company) return <Navigate to="/" replace />

  const open = isCompanySiteOpen(company.id, now)
  const previewAt = getPreviewUnlockAt(company.id)
  const hubAt = getHubClickAt(company.id)

  if (!open) {
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

  return <CompanySite company={mapLegacy(company)} now={now} />
}

/** Adapt Phase 1 company shape to existing CompanySite props. */
function mapLegacy(company) {
  return {
    id: ['wolf','holm','demeter','viking','atoll','njord','eagle','olympus','aeolus','phenix','aether','corvus'].indexOf(company.id) + 1,
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
