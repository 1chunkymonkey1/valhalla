/**
 * Helios BALLAST — copy verbs for One Civilization.
 * Halls wear, cut, mark, name, carry, hold, feed, move, board, land, sound, belong, enter, return.
 * L0 public copy does not speak as twelve operating companies.
 * Thor: Wolf is first hall seen, not a land-transit OpCo. The pack moves.
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
  'claims',
]

/**
 * Ban OpCo present tense on L0 public copy.
 * Do not scan council briefs, investor FILL decks, or Helios kings-lines archive.
 * is-a-company stays word-bounded (no [\\s\\S]) so comments and later sentences do not trip it.
 */
export const BAN_PATTERNS = [
  {
    id: 'is-a-company',
    pattern: /\bis (?:a|the)(?:\s+\w+){0,5}\s+compan(?:y|ies)\b/i,
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
  {
    id: 'owns-land-transit',
    pattern: /\bowns land transit\b/i,
    note: 'The pack moves. Wolf is not a land-transit OpCo.',
  },
  {
    id: 'claims-property-beyond-earth',
    pattern: /\bclaims property beyond Earth\b/i,
    note: 'Registry research, not present title.',
  },
  {
    id: 'stealth-armor-public',
    pattern: /\bStealth Armor\b/,
    note: 'L4 stays off L0. Hall Mark is the public third Meridian line.',
  },
  {
    id: 'qj-ssr-closed',
    pattern: /\b(?:QJ Motor|SSR Motorsports)\b.{0,48}\b(?:partner(?:ed|ship)?|signed|deal closed|OEM partner)\b/i,
    note: 'QJ via SSR is a target, not a deal.',
  },
  {
    id: 'fenrir-shipping',
    pattern: /\bFenrir\b.{0,48}\b(?:shipping now|in stock|buy now)\b/i,
    note: 'Fenrir is not a shipping SKU on L0.',
  },
  {
    id: 'demeter-5m-raise',
    pattern: /\bRaising \$5M(?:\s+pre-money)?\s+SAFE\b/i,
    note: 'Raise-size is inconsistent. Do not speak $5M as the public raise.',
  },
  {
    id: 'owns-substrate',
    pattern: /\bowns the (?:H₂O |H2O )?substrate\b/i,
    note: 'Njord holds. Aeolus presses. Owns is not the public identity.',
  },
  {
    id: 'atoll-charter',
    pattern: /\bCharter Membership\b/,
    note: 'Charter membership is a presentation draft, not L0.',
  },
  {
    id: 'atoll-slots',
    pattern: /\b43 of 50\b/,
    note: 'Slot counts are not public inventory.',
  },
  {
    id: 'aquaria-closed',
    pattern: /\b(?:Aquaria|Brian Sheng)\b.{0,48}\b(?:partner(?:ed|ship)?|customer|closed deal|integration)\b/i,
    note: 'Aquaria / Brian Sheng is a warm lead, not a deal.',
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
  'src/data/wolfMatrix.js',
  'src/data/roadmaps.js',
  'src/data/fundraising/materials.js',
  'src/pages/InvestorsPage.jsx',
  'src/pages/AudiencePages.jsx',
  'public/investors/APPLICATION.md',
  'public/investors/leads.md',
  'public/investors/deck.html',
  'public/investors/company-decks/wolf.html',
  'public/investors/company-decks/holm.html',
  'public/investors/company-decks/demeter.html',
  'public/investors/company-decks/viking.html',
  'public/investors/company-decks/atoll.html',
  'public/investors/company-decks/njord.html',
  'public/investors/company-decks/eagle.html',
  'public/investors/company-decks/olympus.html',
  'public/investors/company-decks/aeolus.html',
  'public/investors/company-decks/phenix.html',
  'public/investors/company-decks/aether.html',
  'public/investors/company-decks/corvus.html',
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
