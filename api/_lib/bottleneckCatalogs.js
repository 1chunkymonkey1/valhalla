/**
 * Bottleneck identity catalog.
 * One key per recurrent gate: {surface}:{kind}:{slug}
 * Halls are mosaic. Apollo Music and Meridian apparel are off-mosaic.
 */

export const SEAT = 'daedalus'
export const SESSION_ID = 'OVERNIGHT BOTTLENECK 2026-08-17'

export const UNIFYING_BOTTLENECK = {
  id: 'recurrent-gate-without-durable-identity',
  statement:
    'Recurrent founder-gate problems have no durable identity, so every overnight session rediscovers the same missing surfaces, quarantined claims, and capture gaps as a new chat.',
}

export const MOSAIC_HALLS = [
  'wolf',
  'viking',
  'eagle',
  'phenix',
  'holm',
  'atoll',
  'olympus',
  'aether',
  'demeter',
  'njord',
  'aeolus',
  'corvus',
]

export function bottleneckKey(surface, kind, slug) {
  return `${surface}:${kind}:${slug}`
}

/** System bottleneck per hall: missing surface, claims posture, capture. */
export const HALL_SYSTEM = {
  wolf: {
    surface: '/wolf live. Fenrir / ATV / Dire Wolf 5.8h is a program target, not a proven timetable. No vehicle checkout.',
    claims: '5.8h is a target. Do not assert proven maglev times or in-stock bikes.',
    capture: 'EmailCapture posts to /api/signups. InterestForm is unmounted and local-only.',
  },
  viking: {
    surface: '/viking partner-gated. Light-water SMR + sail is a thesis, not tickets or SMR-as-installed.',
    claims: 'No voyage tickets. No SMR-as-installed claim.',
    capture: 'Email waitlist via /api/signups.',
  },
  eagle: {
    surface: '/eagle live. No flight checkout. Spirit / Taylor Swift language is quarantined.',
    claims: 'No Spirit Airlines acquire claim. No Taylor Swift first-consumer claim.',
    capture: 'Email waitlist via /api/signups.',
  },
  phenix: {
    surface: '/phenix Kenaz. Hawk / Venus / Rollo is a path, not tickets.',
    claims: 'No launch tickets. No pad sale.',
    capture: 'Email waitlist via /api/signups.',
  },
  holm: {
    surface: '/holm live. No finished-home sale on this surface.',
    claims: 'Courses and builder path only. No deeded house checkout.',
    capture: 'Email waitlist via /api/signups.',
  },
  atoll: {
    surface: '/atoll live. Pre-sale is not live. No funds and no deeds.',
    claims: 'Do not assert live pre-sale, collected funds, or water-home deeds.',
    capture: 'Email waitlist via /api/signups.',
  },
  olympus: {
    surface: '/olympus live. 2028 Mons is a program target, not tickets.',
    claims: 'Research queues only. No tourism tickets.',
    capture: 'Email waitlist via /api/signups.',
  },
  aether: {
    surface: '/aether live. Claims thesis is allowed. No deed, title, or payments.',
    claims: 'No territorial title for sale. No claim payments on this surface.',
    capture: 'Email waitlist via /api/signups.',
  },
  demeter: {
    surface: '/demeter live. Capital send lives on /capital. This engine does not transmit.',
    claims: 'GW / Gt CO2 / farmland-scale figures are quarantined unless measured and sourced.',
    capture: 'Email waitlist via /api/signups.',
  },
  njord: {
    surface: '/njord live. No water-quality or output promises.',
    claims: 'Research before output promises. No scarcity solved claim.',
    capture: 'Email waitlist via /api/signups.',
  },
  aeolus: {
    surface: '/aeolus live. No atmospheric-rights sales.',
    claims: 'Substrate thesis is allowed. Rights are not for sale on this surface.',
    capture: 'Email waitlist via /api/signups.',
  },
  corvus: {
    surface: '/corvus live. No live prompt storefront. $40-400B language is quarantined.',
    claims: 'Do not assert $40-400B valuation or a live prompt shop.',
    capture: 'Email waitlist via /api/signups.',
  },
}

export const APOLLO_MUSIC = {
  mosaic: false,
  publicSurface: false,
  notHall: 'apollo',
  key: bottleneckKey('apollo-music', 'surface', 'public-off'),
  posture:
    'Off-mosaic. Not hall apollo. No public /music route. No artist deals. Interior until the founder authorizes one anthem or keeps it interior.',
}

export const MERIDIAN_APPAREL = {
  mosaic: false,
  route: '/meridian',
  key: bottleneckKey('meridian', 'catalog', 'earth-line'),
  posture:
    'Off-mosaic materials at /meridian. List, not a cart. Twelve halls wear shirt + jacket. Carbon line is three pieces. Logo and mill are founder. Armor stays private.',
}

export const CLAIMS_QUARANTINE = [
  {
    surface: 'eagle',
    slug: 'spirit-airlines',
    title: 'Spirit Airlines acquisition language',
    body: 'Do not restore Spirit acquire / in-talks language as settled. Unsubstantiated unless verified.',
    assert: /acquir(?:e|ing|ed)\s+Spirit|in talks to acquire Spirit|Spirit Airlines partnership/i,
    allowed: /no acquisition claim|unsubstantiated|not confirmed|do not (?:restore|claim)/i,
  },
  {
    surface: 'eagle',
    slug: 'taylor-swift',
    title: 'Taylor Swift first-consumer language',
    body: 'Do not name Taylor Swift as first consumer or launch partner on a public surface.',
    assert: /Taylor Swift/i,
    allowed: /do not|unsubstantiated|not (?:a |the )?first consumer/i,
  },
  {
    surface: 'corvus',
    slug: 'forty-to-four-hundred-b',
    title: '$40-400B valuation language',
    body: 'Do not assert a $40-400B figure as fact.',
    assert: /\$?\s*40\s*[-–—to]+\s*400\s*B/i,
    allowed: /quarantine|do not assert|unsubstantiated/i,
  },
  {
    surface: 'atoll',
    slug: 'pre-sale-live',
    title: 'Atoll pre-sale live',
    body: 'Pre-sale is not live. Do not collect funds or issue deeds on this surface.',
    assert: /pre-?sale\s+is\s+live|live\s+pre-?sale/i,
    allowed: /not live|do not|no funds/i,
  },
  {
    surface: 'aether',
    slug: 'territorial-title',
    title: 'Aether territorial title for sale',
    body: 'Claims thesis is allowed. Deeds, title, and claim payments are not for sale here.',
    assert: /territorial title|deeds? (?:are|is) for sale|buy (?:a )?claim/i,
    allowed: /no deed sales|not for sale|no .*payments on this surface/i,
  },
  {
    surface: 'demeter',
    slug: 'gt-co2',
    title: 'Unsourced Gt CO2 claim',
    body: 'Do not publish gigaton CO2 figures as measured facts without a source.',
    assert: /\b\d+(?:\.\d+)?\s*Gt\s*CO2|\bgigaton/i,
    allowed: /target|goal|do not|unsourced/i,
  },
  {
    surface: 'demeter',
    slug: 'farmland-gw',
    title: 'Unsourced farmland GW claim',
    body: 'Do not publish farmland gigawatt figures as measured facts without a source.',
    assert: /\b\d+(?:\.\d+)?\s*GW\b|farmland.{0,24}gigawatt/i,
    allowed: /target|goal|do not|unsourced/i,
  },
  {
    surface: 'hub',
    slug: 'invented-mrr',
    title: 'Invented MRR or closed deals',
    body: 'Do not invent MRR, closed deals, or revenue. Spirit is not a closed acquisition.',
    assert: /\bMRR\b|closed deals|closed the (?:Spirit|round|acquisition)/i,
    allowed: /do not invent|no invented|unsubstantiated/i,
  },
]

export const STANDING_AUTOMATIONS = [
  'catalog-refresh',
  'claims-quarantine',
  'merch-catalog',
  'music-interior',
  'inbox-sync',
  'dispatch-watch',
]

export const STANDING_FOUNDER_ITEMS = [
  {
    key: bottleneckKey('meridian', 'founder', 'logo'),
    surface: 'meridian',
    hall: 'meridian',
    kind: 'founder',
    slug: 'logo',
    title: 'Meridian logo',
    body: 'Mark is founder-owned. Automation cannot draw or publish a logo.',
  },
  {
    key: bottleneckKey('meridian', 'founder', 'mill-cutter'),
    surface: 'meridian',
    hall: 'meridian',
    kind: 'founder',
    slug: 'mill-cutter',
    title: 'Meridian mill / cutter',
    body: 'Mill and cutter contracts are founder-signed. Do not auto-file.',
  },
  {
    key: bottleneckKey('apollo-music', 'founder', 'anthem'),
    surface: 'apollo-music',
    hall: 'apollo-music',
    kind: 'founder',
    slug: 'anthem',
    title: 'Apollo anthem: authorize or keep interior',
    body: 'One anthem needs an explicit authorize-or-keep-interior decision. Do not wire a public /music route.',
  },
  {
    key: bottleneckKey('hub', 'founder', 'edna-charge'),
    surface: 'hub',
    hall: 'hub',
    kind: 'founder',
    slug: 'edna-charge',
    title: 'Edna Charge signature',
    body: 'Edna Charge is a founder signature. Do not auto-sign, file, or submit.',
  },
]

export const NEVER_AUTO = [
  'Do not auto-send dispatch, Gmail, or any outbound email. Do not mark-sent.',
  'Do not restore Spirit / Taylor Swift / $40-400B / pre-sale live as settled.',
  'Do not sell Aether territorial title or Aeolus atmospheric ownership as rights.',
  'Do not open Stripe, merch checkout, or a music cart.',
  'Do not wire public /music while music is interior.',
  'Do not disclose Meridian interior armor.',
  'Do not sign, file, or submit (Edna Charge, USPTO, mill contracts).',
  'Do not invent artist deals or LOIs.',
  'Do not put L3/L4 into prompts.',
  'Do not auto-reply as the founder in Ask inbox.',
]

const INBOX_CLASSES = [
  ['secrets', /L[34]\b|classified|eyes.?only|\bsecret/i],
  ['legal', /lawyer|attorney|\blegal\b|\bnda\b|counsel|litigat/i],
  ['payment', /stripe|wire|invoice|payment|refund|checkout/i],
  ['partnership', /partner(?:ship)?|\bloi\b|acquir/i],
]

export function classifyInboxReason(reason = '', preview = '') {
  const text = `${reason}\n${preview}`
  for (const [slug, pattern] of INBOX_CLASSES) {
    if (pattern.test(text)) return slug
  }
  return 'human'
}
