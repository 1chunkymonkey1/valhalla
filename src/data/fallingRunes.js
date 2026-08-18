/**
 * Mosaic rune field: linked portals + tile + games, plus 26 extra glyphs.
 * Positions sit in the paper gutters around a 4×3 mosaic, not on the tiles.
 */
import { GAMES_RUNE, TILE_RUNE } from './easonPage.js'

export { GAMES_RUNE, TILE_RUNE }

/** 26 extra runes (Elder Futhark 24 + Yr, Ear). */
export const EXTRA_FALLING_RUNES = [
  { id: 'fall-fehu', glyph: 'ᚠ', name: 'Fehu' },
  { id: 'fall-uruz', glyph: 'ᚢ', name: 'Uruz' },
  { id: 'fall-thurisaz', glyph: 'ᚦ', name: 'Thurisaz' },
  { id: 'fall-ansuz', glyph: 'ᚨ', name: 'Ansuz' },
  { id: 'fall-raidho', glyph: 'ᚱ', name: 'Raidho' },
  { id: 'fall-kenaz', glyph: 'ᚲ', name: 'Kenaz' },
  { id: 'fall-gebo', glyph: 'ᚷ', name: 'Gebo' },
  { id: 'fall-wunjo', glyph: 'ᚹ', name: 'Wunjo' },
  { id: 'fall-hagalaz', glyph: 'ᚺ', name: 'Hagalaz' },
  { id: 'fall-naudhiz', glyph: 'ᚾ', name: 'Naudhiz' },
  { id: 'fall-isa', glyph: 'ᛁ', name: 'Isa' },
  { id: 'fall-jera', glyph: 'ᛃ', name: 'Jera' },
  { id: 'fall-eihwaz', glyph: 'ᛇ', name: 'Eihwaz' },
  { id: 'fall-perthro', glyph: 'ᛈ', name: 'Perthro' },
  { id: 'fall-algiz', glyph: 'ᛉ', name: 'Algiz' },
  { id: 'fall-sowilo', glyph: 'ᛊ', name: 'Sowilo' },
  { id: 'fall-tiwaz', glyph: 'ᛏ', name: 'Tiwaz' },
  { id: 'fall-berkana', glyph: 'ᛒ', name: 'Berkana' },
  { id: 'fall-ehwaz', glyph: 'ᛖ', name: 'Ehwaz' },
  { id: 'fall-mannaz', glyph: 'ᛗ', name: 'Mannaz' },
  { id: 'fall-laguz', glyph: 'ᛚ', name: 'Laguz' },
  { id: 'fall-ingwaz', glyph: 'ᛜ', name: 'Ingwaz' },
  { id: 'fall-dagaz', glyph: 'ᛞ', name: 'Dagaz' },
  { id: 'fall-othala', glyph: 'ᛟ', name: 'Othala' },
  { id: 'fall-yr', glyph: 'ᚣ', name: 'Yr' },
  { id: 'fall-ear', glyph: 'ᛠ', name: 'Ear' },
]

export const GAMES_COMING_SOON = [
  { id: 'minecraft', name: 'Minecraft server' },
  { id: 'clash-royale', name: 'Clash Royale server' },
  { id: 'roblox', name: 'Roblox game' },
]

/**
 * Paper-gutter slots as % of `.vh-mosaic-stage`.
 * Frame slots sit in stage padding. Inner slots sit in the 30px mosaic gaps.
 */
export const GUTTER_SLOTS = [
  { left: 2.2, top: 5.2 },
  { left: 14, top: 3.6 },
  { left: 26, top: 6.4 },
  { left: 38, top: 4.1 },
  { left: 50, top: 5.8 },
  { left: 62, top: 3.9 },
  { left: 74, top: 6.1 },
  { left: 86, top: 4.4 },
  { left: 97.4, top: 5.5 },
  { left: 1.8, top: 18 },
  { left: 97.8, top: 20 },
  { left: 2.6, top: 32 },
  { left: 97.2, top: 34 },
  { left: 27.2, top: 36.8, inner: true },
  { left: 49.8, top: 35.4, inner: true },
  { left: 72.6, top: 37.6, inner: true },
  { left: 2.0, top: 46 },
  { left: 97.6, top: 48 },
  { left: 1.9, top: 58 },
  { left: 97.3, top: 60 },
  { left: 27.4, top: 63.2, inner: true },
  { left: 50.2, top: 64.8, inner: true },
  { left: 72.4, top: 62.6, inner: true },
  { left: 2.4, top: 72 },
  { left: 97.5, top: 74 },
  { left: 2.1, top: 84 },
  { left: 97.7, top: 82 },
  { left: 8, top: 93.4 },
  { left: 20, top: 95.1 },
  { left: 32, top: 92.6 },
  { left: 44, top: 94.8 },
  { left: 56, top: 93.1 },
  { left: 68, top: 95.4 },
  { left: 80, top: 92.8 },
  { left: 92, top: 94.2 },
]

export function fallingRunes(portals) {
  const linked = [
    ...portals.map((p) => ({
      id: p.id,
      name: p.name,
      href: p.path,
      external: false,
      rune: p.rune,
      clickable: true,
    })),
    { ...TILE_RUNE, clickable: true },
    { ...GAMES_RUNE, clickable: true },
  ]
  const extra = EXTRA_FALLING_RUNES.map((r) => ({
    ...r,
    href: null,
    clickable: false,
  }))
  return [...linked, ...extra]
}

export function driftStyle(index) {
  const slot = GUTTER_SLOTS[index % GUTTER_SLOTS.length]
  const dur = 8 + ((index * 7) % 9)
  const pulse = 5.5 + ((index * 3) % 5)
  const delay = -((index * 1.15) % 12)
  const drift = (8 + ((index * 5) % 10)) * (index % 2 === 0 ? 1 : -1)
  const size = 0.95 + ((index * 11) % 8) / 20
  return {
    '--leaf-left': `${slot.left}%`,
    '--leaf-top': `${slot.top}%`,
    '--leaf-dur': `${dur}s`,
    '--leaf-pulse': `${pulse}s`,
    '--leaf-delay': `${delay}s`,
    '--leaf-drift': `${drift}px`,
    '--leaf-size': `${size}rem`,
  }
}

/** @deprecated use driftStyle */
export const leafStyle = driftStyle
