/**
 * Falling rune field: linked portals + tile + games, plus 26 extra glyphs.
 */
import { GAMES_RUNE, TILE_RUNE } from './easonPage.js'

export { GAMES_RUNE, TILE_RUNE }

/** 26 extra runes (Elder Futhark 24 + Yr, Ear). Visual fallers. */
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

export function leafStyle(index) {
  const left = (index * 37 + 11) % 96
  const top = (index * 23 + 7) % 88
  const dur = 16 + ((index * 7) % 18)
  const delay = -((index * 1.7) % 22)
  const sway = 24 + ((index * 13) % 72)
  const size = 0.9 + ((index * 11) % 12) / 16
  const spin = index % 2 === 0 ? 1 : -1
  return {
    '--leaf-left': `${left}vw`,
    '--leaf-top': `${top}vh`,
    '--leaf-dur': `${dur}s`,
    '--leaf-delay': `${delay}s`,
    '--leaf-sway': `${sway}px`,
    '--leaf-size': `${size}rem`,
    '--leaf-spin': String(spin),
  }
}
