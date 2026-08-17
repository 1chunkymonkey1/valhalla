import { Link } from 'react-router-dom'
import { getHiddenPortal } from '../../data/hiddenPortals'
import PortalRuneIcon from './PortalRuneIcon'

/**
 * Full-bleed embed of the live Netlify original — preserves exact branding
 * and imagery. Thin Valhalla escape bar only; no password gate.
 */
export default function PortalEmbedPage({ portalId }) {
  const portal = getHiddenPortal(portalId)
  if (!portal) {
    return (
      <div className="hp-missing">
        <p>Portal not found.</p>
        <Link to="/">← mosaic</Link>
      </div>
    )
  }

  return (
    <div
      className="hp-embed"
      style={{
        '--hp-accent': portal.accent,
        '--hp-bar-bg': portal.barBg,
        '--hp-bar-ink': portal.barInk,
      }}
    >
      <header className="hp-embed__bar">
        <Link to="/" className="hp-embed__back">
          ← mosaic
        </Link>
        <span className="hp-embed__brand">
          <span className="hp-embed__rune" aria-hidden>
            <PortalRuneIcon rune={portal.rune} />
          </span>
          {portal.name}
        </span>
        <a
          className="hp-embed__source"
          href={portal.source}
          target="_blank"
          rel="noreferrer"
        >
          open source
        </a>
      </header>
      <iframe
        className="hp-embed__frame"
        title={portal.name}
        src={portal.source}
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
        allow="fullscreen"
      />
    </div>
  )
}
