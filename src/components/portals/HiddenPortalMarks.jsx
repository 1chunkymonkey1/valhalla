import { Link } from 'react-router-dom'
import { HIDDEN_PORTALS } from '../../data/hiddenPortals'
import PortalRuneIcon from './PortalRuneIcon'

/**
 * Subtle founder rune cluster — all marks at the mosaic page bottom.
 * Discoverable like Prometheus/Kenaz, not nav chrome.
 */
export default function HiddenPortalMarks() {
  return (
    <nav className="hp-runes" aria-label="Founder portals">
      {HIDDEN_PORTALS.map((portal) => (
        <Link
          key={portal.id}
          to={portal.path}
          className="hp-rune"
          aria-label={portal.name}
          title=""
        >
          <PortalRuneIcon rune={portal.rune} />
        </Link>
      ))}
    </nav>
  )
}
