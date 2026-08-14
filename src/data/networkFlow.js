/**
 * Network flow — how Valhalla’s twelve halls interconnect and grow.
 * Grid: Land | Water | Air | Space × Movement | Habitation | Substrate.
 */

export const flowDomains = [
  {
    id: 'land',
    name: 'Land',
    accent: '#2f5c45',
    companies: [
      { id: 'wolf', name: 'Wolf', pillar: 'Movement' },
      { id: 'holm', name: 'Holm', pillar: 'Habitation' },
      { id: 'demeter', name: 'Demeter', pillar: 'Substrate' },
    ],
  },
  {
    id: 'water',
    name: 'Water',
    accent: '#1a4a6e',
    companies: [
      { id: 'viking', name: 'Viking', pillar: 'Movement' },
      { id: 'atoll', name: 'Atoll', pillar: 'Habitation' },
      { id: 'njord', name: 'Njord', pillar: 'Substrate' },
    ],
  },
  {
    id: 'air',
    name: 'Air',
    accent: '#4a7fa0',
    companies: [
      { id: 'eagle', name: 'Eagle', pillar: 'Movement' },
      { id: 'olympus', name: 'Olympus', pillar: 'Habitation' },
      { id: 'aeolus', name: 'Aeolus', pillar: 'Substrate' },
    ],
  },
  {
    id: 'space',
    name: 'Space',
    accent: '#c45a28',
    companies: [
      { id: 'phenix', name: 'Phenix', pillar: 'Movement' },
      { id: 'aether', name: 'Aether', pillar: 'Habitation' },
      { id: 'corvus', name: 'Corvus', pillar: 'Substrate' },
    ],
  },
]

/** Mosaic board positions (percent of SVG board). Do not reorder grid semantics. */
export const boardPositions = {
  wolf: { x: 14, y: 18, col: 0, row: 0 },
  viking: { x: 38, y: 18, col: 1, row: 0 },
  eagle: { x: 62, y: 18, col: 2, row: 0 },
  phenix: { x: 86, y: 18, col: 3, row: 0 },
  holm: { x: 14, y: 50, col: 0, row: 1 },
  atoll: { x: 38, y: 50, col: 1, row: 1 },
  olympus: { x: 62, y: 50, col: 2, row: 1 },
  aether: { x: 86, y: 50, col: 3, row: 1 },
  demeter: { x: 14, y: 82, col: 0, row: 2 },
  njord: { x: 38, y: 82, col: 1, row: 2 },
  aeolus: { x: 62, y: 82, col: 2, row: 2 },
  corvus: { x: 86, y: 82, col: 3, row: 2 },
}

export const edgeKinds = [
  {
    id: 'column',
    label: 'Domain stack',
    color: '#5a4634',
    description: 'Movement → Habitation → Substrate within a domain',
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
    detail: 'Phenix mission concepts open Aether habitation partner ledgers.',
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
    detail: 'Aviation discipline graduates into Phenix mission-concept rigor.',
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
      'Wolf’s Dire Wolf railroad (phased SF→NYC, target Aug 2031) ties land movement to national air/rail catch-up—a civilization-scale spine.',
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
    detail: 'Phenix mission concepts lean on Corvus for requirements and status-labeled documentation.',
  },
]

/** Short “how it ties in” blurbs for node selection. */
export const companyTies = {
  wolf: {
    title: 'Wolf · Movement · Land',
    body: 'The mosaic’s land-mobility spine: Fenrir → Freki → Dire Wolf. Feeds Holm sites, pulls Demeter ethanol for Tier 3, and receives Corvus intelligence. Dire Wolf aims coast-to-coast by Aug 2031.',
  },
  viking: {
    title: 'Viking · Movement · Water',
    body: 'Narrative voyages that seed Atoll interest and share transit DNA with Wolf and Eagle. Njord Harbor Power and Demeter flex-fuel studies sit under the hull.',
  },
  eagle: {
    title: 'Eagle · Movement · Air',
    body: 'Aviation research climbing from sea patterns toward Phenix rigor. Feeds Olympus thin-air habitation queues—no flight timetable claims.',
  },
  phenix: {
    title: 'Phenix · Movement · Space',
    body: 'Mission concepts that open Aether habitation ledgers. Corvus holds the docs; Eagle discipline is the ladder up.',
  },
  holm: {
    title: 'Holm · Habitation · Land',
    body: 'Modular land homes fed by Wolf logistics and Demeter site energy. Shares modular DNA with Atoll; Corvus keeps feasibility honest.',
  },
  atoll: {
    title: 'Atoll · Habitation · Water',
    body: 'Floating rings along Viking routes, powered by Njord research, climbing the habitat ladder toward Olympus and Aether.',
  },
  olympus: {
    title: 'Olympus · Habitation · Air',
    body: 'Upper-atmosphere habitation requirements between Eagle access and Aeolus climate fields—bridge to Aether orbit.',
  },
  aether: {
    title: 'Aether · Habitation · Space',
    body: 'Orbital habitation research registry. Phenix opens the door; Corvus is the local intelligence layer. No territory deeds.',
  },
  demeter: {
    title: 'Demeter · Substrate · Land',
    body: 'Soil-first agrivoltaics and Ethanol Grove. Powers Holm, fuels Wolf Tier 3, and bunkers with Njord—claims last.',
  },
  njord: {
    title: 'Njord · Substrate · Water',
    body: 'Maritime power and water systems for Atoll and Viking. Links Demeter energy diligence to Aeolus atmospheric sensing.',
  },
  aeolus: {
    title: 'Aeolus · Substrate · Air',
    body: 'Atmosphere governance informed by Olympus platforms and Njord sensing. Touched by Dire Wolf ambition and Corvus provenance.',
  },
  corvus: {
    title: 'Corvus · Substrate · Space',
    body: 'Raven OS / Odin—the intelligence spine looping knowledge back to Wolf and across halls without false ops claims.',
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
    text: 'Each column (Land/Water/Air/Space) stacks Movement → Habitation → Substrate so communities, vehicles, and power co-evolve.',
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
  return flowDomains.flatMap((d) =>
    d.companies.map((c) => ({
      ...c,
      domainId: d.id,
      domainName: d.name,
      accent: d.accent,
    })),
  )
}
