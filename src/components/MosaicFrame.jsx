import { Link } from 'react-router-dom'
import {
  COLUMN_THEMES,
  getBrandImage,
  getBuildProgress,
  getPhaseName,
} from '../data/schedule'
import { hasBrandArt } from '../utils/demoTime'

export default function MosaicFrame({ company, now }) {
  const theme = COLUMN_THEMES[company.domain]
  const ready = hasBrandArt(company.slug)

  const phase = ready ? getPhaseName(company, now) : 'clickable'
  const progress = ready ? getBuildProgress(company, now) : 1
  const image = getBrandImage(company.slug)

  const showImage = ready && (phase === 'image' || phase === 'clickable')
  const showPlaceholder = !ready
  const showClick = phase === 'clickable'
  const showWorkers = ready && phase === 'building'
  const visible = phase !== 'idle' || showPlaceholder

  const cell = (
    <div className="mosaic-cell flex flex-col items-stretch">
      <div
        className={`mosaic-frame relative aspect-[3/2] w-full overflow-hidden mosaic-frame--${theme.key}`}
        data-column={theme.key}
        data-phase={phase}
      >
        {/* Living frame rim — always visible around content */}
        {visible && (
          <div className={`mosaic-rim mosaic-rim--${theme.key}`} aria-hidden>
            {theme.key === 'land' && <Vines />}
            {theme.key === 'water' && <Ocean />}
            {theme.key === 'air' && <AirPhysics />}
            {theme.key === 'space' && <SpaceSparks />}
          </div>
        )}

        {/* Build progress accent */}
        {(phase === 'building' || phase === 'framed') && (
          <svg
            className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <rect
              x="2"
              y="2"
              width="96"
              height="96"
              fill="none"
              stroke={theme.secondary}
              strokeWidth="1.5"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={100 - progress * 100}
              className="mosaic-frame__stroke"
            />
          </svg>
        )}

        {/* Inner window */}
        <div className="mosaic-window absolute inset-[14px] z-[2] overflow-hidden bg-white">
          {showImage && (
            <img
              src={image}
              alt={company.name}
              className="h-full w-full object-cover mosaic-frame__image"
            />
          )}

          {showPlaceholder && (
            <div
              className="flex h-full w-full flex-col items-center justify-center"
              style={{
                background:
                  theme.key === 'space'
                    ? '#050505'
                    : theme.key === 'water'
                      ? '#E8EEF5'
                      : theme.key === 'air'
                        ? '#F4FAFF'
                        : '#F3F7F1',
              }}
            >
              <p
                className="mb-1 font-mono text-[9px] uppercase tracking-[0.3em] opacity-50"
                style={{ color: theme.key === 'space' ? '#FFB347' : theme.primary }}
              >
                {company.domain}
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: theme.key === 'space' ? '#F5F5F5' : theme.primary }}
              >
                {company.name}
              </p>
            </div>
          )}

          {!showImage && !showPlaceholder && visible && (
            <div
              className="h-full w-full"
              style={{
                background: theme.key === 'space' ? '#050505' : '#fafafa',
              }}
            />
          )}
        </div>

        {showWorkers && <Workers theme={theme} progress={progress} />}
      </div>

      <div className="flex h-5 shrink-0 items-start justify-center pt-1.5">
        {showClick ? (
          <span className="mosaic-frame__click font-mono text-[7px] uppercase tracking-[0.32em] text-black/30">
            click
          </span>
        ) : (
          <span className="invisible text-[7px]">.</span>
        )}
      </div>
    </div>
  )

  if (showClick) {
    return (
      <Link
        to={`/${company.slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
      >
        {cell}
      </Link>
    )
  }

  return cell
}

function Vines() {
  return (
    <div className="mosaic-vines absolute inset-0">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 200" preserveAspectRatio="none">
        <path
          className="vine vine-a"
          d="M6 190 C 30 140, 22 80, 40 20 C 55 55, 70 110, 85 160"
          fill="none"
          stroke="#14532D"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          className="vine vine-b"
          d="M294 12 C 270 50, 278 110, 255 185 C 240 140, 220 80, 200 40"
          fill="none"
          stroke="#1B4D3E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          className="vine vine-c"
          d="M50 195 C 100 175, 160 185, 250 170"
          fill="none"
          stroke="#C5A028"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="vine vine-d"
          d="M20 30 C 80 25, 140 40, 280 28"
          fill="none"
          stroke="#2F6B4F"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <span key={i} className={`vine-leaf vine-leaf-${i}`} />
      ))}
    </div>
  )
}

function Ocean() {
  return (
    <div className="mosaic-ocean absolute inset-0">
      <div className="ocean-layer ocean-layer-1" />
      <div className="ocean-layer ocean-layer-2" />
      <div className="ocean-layer ocean-layer-3" />
      <div className="ocean-foam" />
    </div>
  )
}

function AirPhysics() {
  return (
    <div className="mosaic-air absolute inset-0">
      <div className="air-current air-current-1" />
      <div className="air-current air-current-2" />
      <div className="air-current air-current-3" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <span key={i} className={`air-mote air-mote-${i}`} />
      ))}
      <div className="air-shear" />
    </div>
  )
}

function SpaceSparks() {
  return (
    <div className="mosaic-space absolute inset-0">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
        <span key={i} className={`space-spark space-spark-${i}`} />
      ))}
      <div className="space-ember" />
    </div>
  )
}

function Workers({ theme, progress }) {
  const positions = [
    { t: 0.08, side: 'top' },
    { t: 0.35, side: 'right' },
    { t: 0.62, side: 'bottom' },
    { t: 0.88, side: 'left' },
  ].filter((p) => progress >= p.t - 0.05)

  return (
    <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden" aria-hidden>
      {positions.map((p, i) => (
        <span
          key={i}
          className="mosaic-worker"
          style={{ color: theme.worker, ...workerStyle(p.side, progress, i) }}
        >
          <WorkerSvg />
        </span>
      ))}
    </div>
  )
}

function workerStyle(side, progress, i) {
  const pad = 4
  const travel = ((progress * 4 + i * 0.2) % 1) * 100
  if (side === 'top') return { top: pad, left: `calc(${travel}% - 10px)` }
  if (side === 'right') return { right: pad, top: `calc(${travel}% - 10px)` }
  if (side === 'bottom') return { bottom: pad, right: `calc(${travel}% - 10px)` }
  return { left: pad, bottom: `calc(${travel}% - 10px)` }
}

function WorkerSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M6 7h8v2H6z" opacity="0.95" />
      <path d="M5 9h10v1H5z" />
      <rect x="8" y="10" width="4" height="5" rx="0.5" />
      <rect className="mosaic-worker__arm" x="11" y="11" width="5" height="1.2" rx="0.4" />
      <rect x="15.2" y="9.5" width="1.4" height="4" rx="0.3" opacity="0.85" />
      <rect x="8" y="15" width="1.5" height="3" />
      <rect x="10.5" y="15" width="1.5" height="3" />
    </svg>
  )
}
