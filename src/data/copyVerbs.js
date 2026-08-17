/**
 * Helios BALLAST — copy verbs for One Civilization.
 * Halls wear, cut, mark, name, carry, hold, feed, move, board, land, sound, belong, enter, return.
 * L0 public copy does not speak as twelve operating companies.
 * Session: OVERNIGHT BOTTLENECK 2026-08-17.
 */

export const CIVILIZATION_LAYERS = {
  hall: 'The room you enter.',
  garment: 'The cloth you wear. Meridian cuts. The hall marks.',
  anthem: 'The sound you hear. Apollo Music names. The hall marks. No public surface.',
}

/** Civilization verbs halls may use on L0. */
export const REQUIRE_VERBS = [
  'wears',
  'cuts',
  'marks',
  'names',
  'carries',
  'holds',
  'feeds',
  'moves',
  'boards',
  'lands',
  'sounds',
  'belongs',
  'enters',
  'returns',
  'stands',
  'begins',
  'rises',
  'homes',
  'presses',
  'runs',
]

/**
 * Ban OpCo present tense on L0 public copy.
 * Do not scan council briefs, investor FILL decks, or Helios kings-lines archive.
 */
export const BAN_PATTERNS = [
  {
    id: 'is-a-company',
    pattern: /\bis (?:a|the)\b.{0,80}\bcompan(?:y|ies)\b/i,
    note: 'Halls are rooms of One Civilization, not operating-company bios.',
  },
  {
    id: 'n-companies',
    pattern: /\b(?:twelve|12|eleven|11)\b.{0,40}\bcompanies\b/i,
    note: 'Say twelve halls. Never twelve companies on L0.',
  },
  {
    id: 'mosaic-companies',
    pattern: /\bmosaic companies\b/i,
    note: 'Mosaic halls, not mosaic companies.',
  },
  {
    id: 'each-company',
    pattern: /\beach company\b/i,
    note: 'Each hall. Company is interior legal language.',
  },
  {
    id: 'we-offer',
    pattern: /\bwe (?:offer|sell|ship)\b/i,
    note: 'No vendor present tense on L0.',
  },
  {
    id: 'cart-claim',
    pattern: /\b(?:buy now|in stock|shipping now|pre-sale live)\b/i,
    note: 'List not cart. No shipping claims.',
  },
]

/** L0 surfaces Helios auto-enforces. Interior canon (council/) stays out. */
export const L0_SCAN_FILES = [
  'src/i18n/locales/en.js',
  'src/data/pressRelease.js',
  'src/data/companyProducts.js',
  'src/data/meridianMerch.js',
  'src/data/oneCivilizationMarks.js',
  'src/data/schedule.js',
  'src/data/hallMatrices.js',
  'api/_lib/hallKnowledge.js',
  'discord-bot/src/knowledge.js',
  'README.md',
]

export function findCopyVerbHits(text) {
  const hits = []
  for (const rule of BAN_PATTERNS) {
    const re = new RegExp(
      rule.pattern.source,
      rule.pattern.flags.includes('g') ? rule.pattern.flags : `${rule.pattern.flags}g`,
    )
    let match
    while ((match = re.exec(text))) {
      hits.push({
        id: rule.id,
        note: rule.note,
        snippet: match[0].replace(/\s+/g, ' ').slice(0, 80),
        index: match.index,
      })
    }
  }
  return hits
}
