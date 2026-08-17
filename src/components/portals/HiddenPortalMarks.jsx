import { Link } from 'react-router-dom'
import { HIDDEN_PORTALS } from '../../data/hiddenPortals'
import PortalRuneIcon from './PortalRuneIcon'

/**
 * Subtle rune / hieroglyph marks for the social icon row.
 * Same size/weight as Discord & Instagram — discoverable, not nav chrome.
 */
export default function HiddenPortalMarks() {
  return (
    <>
      {HIDDEN_PORTALS.map((portal) => (
        <li key={portal.id} className="vh-socials__extra">
          <Link
            to={portal.path}
            className="hp-rune"
            aria-label={portal.name}
            title=""
          >
            <PortalRuneIcon rune={portal.rune} />
          </Link>
        </li>
      ))}
    </>
  )
}
