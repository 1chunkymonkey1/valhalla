import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getBuildProgress,
  getPortalPhase,
  isHubTileClickable,
} from '../../lib/launchSchedule'

export default function CompanyPortal({ company, now, unlockedSet = new Set() }) {
  const phase = getPortalPhase(company.id, now, unlockedSet)
  const progress = getBuildProgress(company.id, now, unlockedSet)
  const interactive = isHubTileClickable(company.id, now, unlockedSet)
  const showImage = phase === 'revealed' || phase === 'clickable' || interactive
  const src = company.imageSrc || company.placeholderSrc
  const isPlaceholder = !company.imageSrc

  // Bump to remount the article and restart the 0→100% fade on appear/unlock.
  const [appearGen, setAppearGen] = useState(() => (phase !== 'dormant' ? 1 : 0))
  const prevPhase = useRef(phase)

  useEffect(() => {
    const was = prevPhase.current
    prevPhase.current = phase
    if (phase === 'dormant') return
    if (was === 'dormant' || (was === 'constructing' && phase !== 'constructing')) {
      setAppearGen((n) => n + 1)
    }
  }, [phase])

  const body = (
    <article
      key={appearGen}
      className={`vh-portal vh-portal--${phase} vh-portal--${company.domain}${
        phase !== 'dormant' ? ' vh-portal--appear' : ''
      }`}
      data-company={company.id}
      data-phase={phase}
    >
      <div className="vh-portal__frame">
        {phase === 'constructing' && (
          <div className="vh-portal__constructing" aria-hidden>
            <span className="vh-portal__pixel vh-portal__pixel--a" />
            <span className="vh-portal__pixel vh-portal__pixel--b" />
            <div
              className="vh-portal__trace"
              style={{ opacity: 0.25 + progress * 0.55 }}
            />
          </div>
        )}

        {showImage && (
          <img
            className={`vh-portal__image ${isPlaceholder ? 'vh-portal__image--placeholder' : ''}`}
            src={src}
            alt={interactive ? company.name : ''}
            loading="lazy"
          />
        )}

        {showImage && phase === 'revealed' && <div className="vh-portal__veil" />}
      </div>

      {showImage && <p className="vh-portal__name">{company.name}</p>}
    </article>
  )

  if (!interactive) {
    return <div className="vh-portal-slot">{body}</div>
  }

  return (
    <Link
      to={`/${company.id}`}
      className="vh-portal-slot vh-portal-slot--link"
      aria-label={`Open ${company.name}`}
    >
      {body}
    </Link>
  )
}
