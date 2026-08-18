import { Link } from 'react-router-dom'
import { HIDDEN_PORTALS } from '../../data/hiddenPortals'
import { mosaicFloatRunes, TILE_RUNE } from '../../data/easonPage'
import PortalRuneIcon from './PortalRuneIcon'

const FLOAT_SLOTS = [
  { top: '2%', left: '3%' },
  { top: '0%', left: '28%' },
  { top: '4%', right: '6%' },
  { top: '38%', left: '-0.5%' },
  { top: '42%', right: '-0.5%' },
  { bottom: '18%', left: '2%' },
  { bottom: '6%', left: '32%' },
  { bottom: '14%', right: '4%' },
  { top: '18%', right: '18%' },
]

export const MOSAIC_FLOAT_RUNES = mosaicFloatRunes(HIDDEN_PORTALS)

function RuneMark({ item, className, style }) {
  const inner = <PortalRuneIcon rune={item.rune} />
  if (item.external) {
    return (
      <a
        className={className}
        href={item.href}
        style={style}
        target="_blank"
        rel="noreferrer"
        aria-label={item.name}
        title={item.name}
      >
        {inner}
      </a>
    )
  }
  return (
    <Link className={className} to={item.href} style={style} aria-label={item.name} title={item.name}>
      {inner}
    </Link>
  )
}

/** Runes that fade in and out around the mosaic. Tile opens photo-tile.com. */
export function MosaicRuneField() {
  return (
    <div className="vh-rune-field" aria-label="Founder portals around the mosaic">
      {MOSAIC_FLOAT_RUNES.map((item, i) => (
        <RuneMark
          key={item.id}
          item={item}
          className="vh-float-rune"
          style={{
            ...FLOAT_SLOTS[i % FLOAT_SLOTS.length],
            animationDelay: `${i * 1.15}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function HiddenPortalMarks({ includeTile = true }) {
  const items = includeTile
    ? MOSAIC_FLOAT_RUNES
    : MOSAIC_FLOAT_RUNES.filter((r) => r.id !== TILE_RUNE.id)
  return (
    <nav className="hp-runes" aria-label="Founder portals">
      {items.map((item) => (
        <RuneMark key={`foot-${item.id}`} item={item} className="hp-rune" />
      ))}
    </nav>
  )
}
