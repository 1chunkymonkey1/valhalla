/**
 * Network flow — how Valhalla’s twelve halls interconnect and grow.
 * Grid: Land | Water | Air | Space × Movement | Habitation | Energy / Intelligence.
 */

export const flowDomains = [
  {
    id: 'land',
    name: 'Land',
    accent: '#2f5c45',
    companies: [
      { id: 'wolf', name: 'Wolf', pillar: 'Movement' },
      { id: 'holm', name: 'Holm', pillar: 'Habitation' },
      { id: 'demeter', name: 'Demeter', pillar: 'Energy' },
    ],
  },
  {
    id: 'water',
    name: 'Water',
    accent: '#1a4a6e',
    companies: [
      { id: 'viking', name: 'Viking', pillar: 'Movement' },
      { id: 'atoll', name: 'Atoll', pillar: 'Habitation' },
      { id: 'njord', name: 'Njord', pillar: 'Energy' },
    ],
  },
  {
    id: 'air',
    name: 'Air',
    accent: '#4a7fa0',
    companies: [
      { id: 'eagle', name: 'Eagle', pillar: 'Movement' },
      { id: 'olympus', name: 'Olympus', pillar: 'Habitation' },
      { id: 'aeolus', name: 'Aeolus', pillar: 'Energy' },
    ],
  },
  {
    id: 'space',
    name: 'Space',
    accent: '#c45a28',
    companies: [
      { id: 'phenix', name: 'Phénix', pillar: 'Movement' },
      { id: 'aether', name: 'Aether', pillar: 'Habitation' },
      { id: 'corvus', name: 'Corvus', pillar: 'Intelligence' },
    ],
  },
]

/** Mosaic board positions (percent of SVG board). Do not reorder grid semantics. */
export const boardPositions = {
  wolf: { x: 14, y: 18, col: 0, row: 0 },
  viking: { x: 38, y: 18, col: 1, row: 0 },
  eagle: { x: 62, y: 18, col: 2, row: 0 },
  phenix: { x: 86, y: 18, col: 3, row: 0 },
  holm: { x: 14, y: 48, col: 0, row: 1 },
  atoll: { x: 38, y: 48, col: 1, row: 1 },
  olympus: { x: 62, y: 48, col: 2, row: 1 },
  aether: { x: 86, y: 48, col: 3, row: 1 },
  demeter: { x: 14, y: 78, col: 0, row: 2 },
  njord: { x: 38, y: 78, col: 1, row: 2 },
  aeolus: { x: 62, y: 78, col: 2, row: 2 },
  corvus: { x: 86, y: 78, col: 3, row: 2 },
  /** Off-grid materials layer — beneath the 4×3 mosaic, not a tile. */
  meridian: { x: 50, y: 96, col: -1, row: 3 },
}

export const edgeKinds = [
  {
    id: 'column',
    label: 'Domain stack',
    color: '#5a4634',
    description: 'Movement → Habitation → Energy / Intelligence within a domain',
  },
  {
    id: 'transit',
    label: 'Transit',
    color: '#8a5a2b',
    description: 'Movement corridors across land, sea, sky, space',
  },
  {
    id: 'housing',
    label: 'Housing',
    color: '#3d6b52',
    description: 'Habitation adjacency and site logistics',
  },
  {
    id: 'power',
    label: 'Power',
    color: '#1f6a8a',
    description: 'Energy, shore power, agrivoltaics, staging',
  },
  {
    id: 'ethanol',
    label: 'Ethanol / fuel',
    color: '#9a7b2f',
    description: 'Demeter feedstock ↔ Tier 3 dual-injection machines',
  },
  {
    id: 'compute',
    label: 'Compute',
    color: '#6b3d2e',
    description: 'Corvus Raven OS / Odin intelligence spine',
  },
  {
    id: 'supply',
    label: 'Supply',
    color: '#4a5560',
    description: 'Freight, harbor, and corridor logistics',
  },
  {
    id: 'materials',
    label: 'Materials',
    color: '#6a5a48',
    description: 'Meridian materials layer beneath the mosaic',
  },
]

export const edgeKindMap = Object.fromEntries(edgeKinds.map((k) => [k.id, k]))

/**
 * Interaction edges. `major` edges get on-board labels.
 * `curve` nudges the quadratic control point (negative = bend “up” in SVG).
 */
export const flowEdges = [
  // —— Domain columns ——
  {
    id: 'column-land',
    from: 'wolf',
    to: 'holm',
    kind: 'column',
    major: true,
    curve: -6,
    label: 'Trail → dwelling',
    detail:
      'Wolf mobility routes demand and logistics into Holm sites; habitation follows movement corridors.',
  },
  {
    id: 'column-land-2',
    from: 'holm',
    to: 'demeter',
    kind: 'column',
    major: true,
    curve: -6,
    label: 'Dwelling → field',
    detail:
      'Holm communities need Demeter agrivoltaic and land-energy diligence to stay sovereign.',
  },
  {
    id: 'column-water',
    from: 'viking',
    to: 'atoll',
    kind: 'column',
    major: true,
    curve: -6,
    label: 'Voyage → habitat',
    detail: 'Viking story-routes seed Atoll floating habitation interest along water lines.',
  },
  {
    id: 'column-water-2',
    from: 'atoll',
    to: 'njord',
    kind: 'column',
    major: true,
    curve: -6,
    label: 'Habitat → water',
    detail: 'Atoll rings depend on Njord water and maritime power research.',
  },
  {
    id: 'column-air',
    from: 'eagle',
    to: 'olympus',
    kind: 'column',
    major: true,
    curve: -6,
    label: 'Flight → thin air',
    detail: 'Eagle access queues feed Olympus upper-atmosphere habitation research.',
  },
  {
    id: 'column-air-2',
    from: 'olympus',
    to: 'aeolus',
    kind: 'column',
    major: true,
    curve: -6,
    label: 'Platform → climate',
    detail: 'Olympus platforms inform Aeolus atmosphere governance and sensing.',
  },
  {
    id: 'column-space',
    from: 'phenix',
    to: 'aether',
    kind: 'column',
    major: true,
    curve: -6,
    label: 'Ascent → quiet rooms',
    detail: 'Phénix mission concepts open Aether habitation partner ledgers.',
  },
  {
    id: 'column-space-2',
    from: 'aether',
    to: 'corvus',
    kind: 'column',
    major: true,
    curve: -6,
    label: 'Habitat → intelligence',
    detail: 'Aether operations need Corvus Raven OS as the local intelligence layer.',
  },

  // —— Movement transit row ——
  {
    id: 'pillar-move',
    from: 'wolf',
    to: 'viking',
    kind: 'transit',
    major: true,
    curve: 8,
    label: 'Land ↔ sea',
    detail: 'Land and water movement share booking, safety, and story frameworks.',
  },
  {
    id: 'pillar-move-2',
    from: 'viking',
    to: 'eagle',
    kind: 'transit',
    major: true,
    curve: 8,
    label: 'Sea → sky',
    detail: 'Guest and logistics patterns climb from voyage into aviation access.',
  },
  {
    id: 'pillar-move-3',
    from: 'eagle',
    to: 'phenix',
    kind: 'transit',
    major: true,
    curve: 8,
    label: 'Sky → space',
    detail: 'Aviation discipline graduates into Phénix mission-concept rigor.',
  },

  // —— Habitation housing row ——
  {
    id: 'housing-holm-atoll',
    from: 'holm',
    to: 'atoll',
    kind: 'housing',
    major: false,
    curve: 10,
    label: 'Modular homes',
    detail:
      'Holm land modules and Atoll floating rings share modular habitation DNA—different medium, same “site first” honesty.',
  },
  {
    id: 'housing-atoll-olympus',
    from: 'atoll',
    to: 'olympus',
    kind: 'housing',
    major: false,
    curve: 10,
    label: 'Habitat ladder',
    detail: 'From water rings to upper-atmosphere platforms, habitation research climbs the mosaic.',
  },
  {
    id: 'housing-olympus-aether',
    from: 'olympus',
    to: 'aether',
    kind: 'housing',
    major: true,
    curve: 10,
    label: 'Air → orbit',
    detail: 'Olympus thin-air requirements inform Aether orbital habitation research registries.',
  },

  // —— Power / substrate ——
  {
    id: 'power-demeter-njord',
    from: 'demeter',
    to: 'njord',
    kind: 'power',
    major: true,
    curve: -10,
    label: 'Land ↔ water energy',
    detail:
      'Demeter agrivoltaics and Njord maritime power research share diligence posture—claims last, methodology first.',
  },
  {
    id: 'power-njord-aeolus',
    from: 'njord',
    to: 'aeolus',
    kind: 'power',
    major: false,
    curve: -10,
    label: 'Water ↔ air sensing',
    detail: 'Njord atmospheric-water and Aeolus climate fields share sensing and risk-register habits.',
  },
  {
    id: 'power-njord-viking',
    from: 'njord',
    to: 'viking',
    kind: 'power',
    major: false,
    curve: 14,
    label: 'Harbor power',
    detail: 'Njord Harbor Power stages shore energy for Viking craft and Atoll rings.',
  },
  {
    id: 'power-njord-atoll',
    from: 'njord',
    to: 'atoll',
    kind: 'power',
    major: false,
    curve: -4,
    label: 'Tide assist',
    detail: 'Atoll Tide platforms sit adjacent to Njord Tide Mill research.',
  },
  {
    id: 'power-demeter-holm',
    from: 'demeter',
    to: 'holm',
    kind: 'power',
    major: false,
    curve: 4,
    label: 'Site energy',
    detail: 'Holm sites lean on Demeter field and canopy diligence for sovereign land energy.',
  },

  // —— Ethanol / fuel ——
  {
    id: 'ethanol-demeter-wolf',
    from: 'demeter',
    to: 'wolf',
    kind: 'ethanol',
    major: true,
    curve: 18,
    label: 'Ethanol Grove → Tier 3',
    detail:
      'Demeter Ethanol Grove feeds Wolf’s Tier 3 dual-injection story—fields that can fuel the pack when diligence clears.',
  },
  {
    id: 'ethanol-demeter-njord',
    from: 'demeter',
    to: 'njord',
    kind: 'ethanol',
    major: false,
    curve: 12,
    label: 'Ethanol bunkering',
    detail: 'Njord Harbor Power studies ethanol bunkering alongside Demeter feedstock pathways.',
  },
  {
    id: 'ethanol-demeter-viking',
    from: 'demeter',
    to: 'viking',
    kind: 'ethanol',
    major: false,
    curve: -16,
    label: 'Marine flex fuel',
    detail: 'Viking marine lines adapt Tier 3 dual injection with Demeter ethanol adjacency.',
  },

  // —— Supply / logistics ——
  {
    id: 'supply-wolf-holm',
    from: 'wolf',
    to: 'holm',
    kind: 'supply',
    major: false,
    curve: 10,
    label: 'Yard freight',
    detail: 'Wolf trucks and corridor freight serve Holm module and site logistics.',
  },
  {
    id: 'supply-wolf-demeter',
    from: 'wolf',
    to: 'demeter',
    kind: 'supply',
    major: false,
    curve: -14,
    label: 'Field logistics',
    detail: 'Geri-class freight concepts couple to Demeter field and Holm site yards.',
  },
  {
    id: 'loop-dire-wolf',
    from: 'wolf',
    to: 'aeolus',
    kind: 'transit',
    major: true,
    curve: -22,
    label: 'Dire Wolf spine',
    detail:
      'Wolf’s Dire Wolf railroad (phased SF→NY aiming 5.8 hours, target Aug 2031) ties land movement to national air/rail catch-up: a civilization-scale spine.',
  },

  // —— Compute / intelligence ——
  {
    id: 'loop-corvus',
    from: 'corvus',
    to: 'wolf',
    kind: 'compute',
    major: true,
    curve: -28,
    label: 'Empire intelligence',
    detail:
      'Corvus feeds signal back into Wolf and the mosaic—product drops, moderation, and founder tooling across halls.',
  },
  {
    id: 'compute-corvus-holm',
    from: 'corvus',
    to: 'holm',
    kind: 'compute',
    major: false,
    curve: -20,
    label: 'Site ops OS',
    detail: 'Corvus Odin keeps Holm feasibility and partner ledgers coherent without false operational claims.',
  },
  {
    id: 'compute-corvus-aeolus',
    from: 'corvus',
    to: 'aeolus',
    kind: 'compute',
    major: false,
    curve: 8,
    label: 'Research governance',
    detail: 'Aeolus risk registers and Corvus decision logs share provenance-first habits.',
  },
  {
    id: 'compute-corvus-phenix',
    from: 'corvus',
    to: 'phenix',
    kind: 'compute',
    major: false,
    curve: 12,
    label: 'Mission docs',
    detail: 'Phénix mission concepts lean on Corvus for requirements and status-labeled documentation.',
  },
  // —— Meridian materials (off-grid) ——
  {
    id: 'mat-meridian-holm',
    from: 'meridian',
    to: 'holm',
    kind: 'materials',
    major: false,
    curve: -10,
    label: 'Build textiles',
    detail: 'Meridian cuts Holm merch and feeds habitation build culture across Holm modules.',
  },
  {
    id: 'mat-meridian-olympus',
    from: 'meridian',
    to: 'olympus',
    kind: 'materials',
    major: false,
    curve: 8,
    label: 'Suit path',
    detail: 'Venus-rated suit research under Meridian supports Olympus thin-air habitation. Olympus also wears Meridian merch.',
  },
  {
    id: 'mat-meridian-wolf',
    from: 'meridian',
    to: 'wolf',
    kind: 'materials',
    major: false,
    curve: -8,
    label: 'Pack merch',
    detail: 'Wolf announces Meridian merch. Pack shirt and jacket are Earth Line, list not cart.',
  },
  {
    id: 'mat-meridian-demeter',
    from: 'meridian',
    to: 'demeter',
    kind: 'materials',
    major: false,
    curve: 6,
    label: 'Field merch',
    detail: 'Demeter announces Meridian merch. Field shirt and jacket are Earth Line, list not cart.',
  },
  {
    id: 'mat-meridian-viking',
    from: 'meridian',
    to: 'viking',
    kind: 'materials',
    major: false,
    curve: -4,
    label: 'Deck merch',
    detail: 'Viking announces Meridian merch. Deck shirt and jacket are Earth Line, list not cart.',
  },
  {
    id: 'mat-meridian-atoll',
    from: 'meridian',
    to: 'atoll',
    kind: 'materials',
    major: false,
    curve: 10,
    label: 'Shore merch',
    detail: 'Atoll announces Meridian merch. Shore shirt and jacket are Earth Line, list not cart.',
  },
  {
    id: 'mat-meridian-njord',
    from: 'meridian',
    to: 'njord',
    kind: 'materials',
    major: false,
    curve: -12,
    label: 'Water merch',
    detail: 'Njord announces Meridian merch. Water shirt and jacket are Earth Line, list not cart.',
  },
  {
    id: 'mat-meridian-eagle',
    from: 'meridian',
    to: 'eagle',
    kind: 'materials',
    major: false,
    curve: 7,
    label: 'Flight merch',
    detail: 'Eagle announces Meridian merch. Flight shirt and jacket are Earth Line, list not cart.',
  },
  {
    id: 'mat-meridian-aeolus',
    from: 'meridian',
    to: 'aeolus',
    kind: 'materials',
    major: false,
    curve: -6,
    label: 'Sky merch',
    detail: 'Aeolus announces Meridian merch. Sky shirt and jacket are Earth Line, list not cart.',
  },
  {
    id: 'mat-meridian-phenix',
    from: 'meridian',
    to: 'phenix',
    kind: 'materials',
    major: false,
    curve: 11,
    label: 'Launch merch',
    detail: 'Phénix announces Meridian merch. Launch shirt and jacket are Earth Line, list not cart.',
  },
  {
    id: 'mat-meridian-corvus',
    from: 'meridian',
    to: 'corvus',
    kind: 'materials',
    major: false,
    curve: -9,
    label: 'Mind merch',
    detail: 'Corvus announces Meridian merch. Mind shirt and jacket are Earth Line, list not cart.',
  },
  {
    id: 'mat-meridian-aether',
    from: 'meridian',
    to: 'aether',
    kind: 'materials',
    major: false,
    curve: 14,
    label: 'Orbit merch',
    detail: 'Aether announces Meridian merch. Orbit shirt and jacket are Earth Line, list not cart. The garment is not a claim or a deed.',
  },
]

/** Short “how it ties in” blurbs for node selection. */
export const companyTies = {
  wolf: {
    title: 'Wolf · Movement · Land',
    body: 'The mosaic’s land-mobility spine: Fenrir → Freki → Dire Wolf. Feeds Holm sites, pulls Demeter ethanol for Tier 3, and receives Corvus intelligence. Dire Wolf aims SF→NY in 5.8 hours by Aug 2031.',
  },
  viking: {
    title: 'Viking · Movement · Water',
    body: 'Vinland Saga voyages that seed Atoll interest and share transit DNA with Wolf and Eagle. Njord Harbor Power and Demeter flex-fuel studies sit under the hull.',
  },
  eagle: {
    title: 'Eagle · Movement · Air',
    body: 'Clean aviation: bird-named jets with active carbon removal, the more you fly the better for the atmosphere. Feeds Olympus thin-air habitation. No flight timetable claims.',
  },
  phenix: {
    title: 'Phénix · Movement · Space',
    body: 'Hawk Mark 1, Bifröst lunar base camp, and Zeus Venus 2035. Opens Aether claims ledgers. Corvus holds the docs; Eagle discipline is the ladder up.',
  },
  holm: {
    title: 'Holm · Habitation · Land',
    body: 'Twelve linkable modules fed by Wolf logistics and Demeter site energy. Shares modular DNA with Atoll; Corvus keeps feasibility honest.',
  },
  atoll: {
    title: 'Atoll · Habitation · Water',
    body: 'Atoll 01/02/03 scales along Viking routes, powered by Njord research, first delivery target Tuvalu, climbing toward Olympus and Aether.',
  },
  olympus: {
    title: 'Olympus · Habitation · Air',
    body: 'Pressurized cloud cities between Eagle access and Aeolus climate fields—bridge to Aether claims and Venus 50 km / 2035 with Phénix Zeus.',
  },
  aether: {
    title: 'Aether · Habitation · Space',
    body: 'Claims and real estate beyond Earth. Phénix marks the territory; Aether claims it. Corvus is the local intelligence layer. No deed sales on this surface.',
  },
  demeter: {
    title: 'Demeter · Energy · Land',
    body: 'California-first agrivoltaics, geothermal, wind, green hydrogen, SMR, and a 75-year Dyson roadmap. Powers Holm, fuels Wolf Tier 3, bunkers with Njord.',
  },
  njord: {
    title: 'Njord · Energy · Water',
    body: 'Full water energy layer for Atoll and Viking: clean, reuse, split, manufacture, atmospheric water, green hydrogen. Links Demeter diligence to Aeolus sensing.',
  },
  aeolus: {
    title: 'Aeolus · Energy · Air',
    body: 'Atmospheric OS that intends to own the atmospheric substrate: Phase 1 climate, Phase 2 oxygen for habitats, Phase 3 radiation protection. Informed by Olympus platforms and Njord sensing; Corvus holds provenance. No atmospheric-rights sales on this surface.',
  },
  corvus: {
    title: 'Corvus · Intelligence · Space',
    body: 'Raven OS / Odin—the sovereign intelligence spine looping knowledge back to Wolf and across halls without false ops claims.',
  },
  meridian: {
    title: 'Meridian · Materials',
    body: 'Materials layer beneath the mosaic (not a tile): Earth garment research toward September 2026, Venus Suit, and merch for every hall. List, not a cart.',
  },
}

export const growthLoops = [
  {
    id: 'product-cascade',
    title: 'Product cascade',
    text: 'Wolf opens a new line or model every two months after Fenrir 01 (Jan 13, 2027). Other halls may still pair drops in the same window (e.g. Atoll 02 → Atoll 03).',
  },
  {
    id: 'reservation-flywheel',
    title: 'Refundable reservation flywheel',
    text: 'Fully refundable holds gather serious interest without trapping capital, converting later only after entity and payment gates.',
  },
  {
    id: 'domain-reinforcement',
    title: 'Domain reinforcement',
    text: 'Each column (Land/Water/Air/Space) stacks Movement → Habitation → Energy / Intelligence so communities, vehicles, and power co-evolve. Meridian materials sits beneath.',
  },
  {
    id: 'intelligence-spine',
    title: 'Intelligence spine',
    text: 'Corvus Raven OS and Discord Odin keep the empire’s knowledge coherent, Q&A without false operational claims.',
  },
]

export function edgesForCompany(companyId) {
  return flowEdges.filter((e) => e.from === companyId || e.to === companyId)
}

export function companyDomain(companyId) {
  return flowDomains.find((d) => d.companies.some((c) => c.id === companyId))
}

export function allCompanies() {
  const mosaic = flowDomains.flatMap((d) =>
    d.companies.map((c) => ({
      ...c,
      domainId: d.id,
      domainName: d.name,
      accent: d.accent,
    })),
  )
  return [
    ...mosaic,
    {
      id: 'meridian',
      name: 'Meridian',
      pillar: 'Materials',
      domainId: 'materials',
      domainName: 'Materials',
      accent: '#6a5a48',
      offGrid: true,
    },
  ]
}
