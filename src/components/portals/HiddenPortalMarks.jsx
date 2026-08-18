import { Link } from 'react-router-dom'
import { HIDDEN_PORTALS } from '../../data/hiddenPortals'
import { GAMES_RUNE, TILE_RUNE, mosaicFloatRunes } from '../../data/easonPage'
import { GUTTER_SLOTS, driftStyle, fallingRunes } from '../../data/fallingRunes'
import PortalRuneIcon from './PortalRuneIcon'

export const MOSAIC_FLOAT_RUNES = mosaicFloatRunes(HIDDEN_PORTALS)
const FIELD_RUNES = fallingRunes(HIDDEN_PORTALS)

function RuneMark({ item, className, style }) {
  const inner = item.rune ? <PortalRuneIcon rune={item.rune} /> : <span>{item.glyph}</span>
  if (!item.clickable && !item.href) {
    return (
      <span className={className} style={style} aria-hidden="true" title={item.name}>
        {inner}
      </span>
    )
  }
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

/** Runes that drift in the paper gutters behind the mosaic tiles. */
export function MosaicRuneField() {
  return (
    <div className="vh-rune-field" aria-label="Founder runes in the mosaic gutters">
      {FIELD_RUNES.map((item, i) => {
        const inner = GUTTER_SLOTS[i % GUTTER_SLOTS.length]?.inner
        return (
          <RuneMark
            key={item.id}
            item={item}
            className={`vh-float-rune ${item.clickable ? 'vh-float-rune--hot' : 'vh-float-rune--deco'}${inner ? ' vh-float-rune--inner' : ''}`}
            style={driftStyle(i)}
          />
        )
      })}
    </div>
  )
}

export default function HiddenPortalMarks({ includeTile = true }) {
  const items = MOSAIC_FLOAT_RUNES.filter((r) => {
    if (!includeTile && r.id === TILE_RUNE.id) return false
    return true
  })
  return (
    <nav className="hp-runes" aria-label="Founder portals">
      {items.map((item) => (
        <RuneMark
          key={`foot-${item.id}`}
          item={{ ...item, clickable: true }}
          className={item.id === GAMES_RUNE.id ? 'hp-rune hp-rune--games' : 'hp-rune'}
        />
      ))}
    </nav>
  )
}
