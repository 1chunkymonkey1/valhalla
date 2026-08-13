/**
 * Network flow — how Valhalla interconnects and grows.
 * Land/Water/Air/Space × Movement/Habitation/Energy + cascade loops.
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
    accent: '#e07030',
    companies: [
      { id: 'phenix', name: 'Phenix', pillar: 'Movement' },
      { id: 'aether', name: 'Aether', pillar: 'Habitation' },
      { id: 'corvus', name: 'Corvus', pillar: 'Energy' },
    ],
  },
]

export const flowEdges = [
  {
    id: 'column-land',
    from: 'wolf',
    to: 'holm',
    label: 'Trail → dwelling',
    detail:
      'Wolf mobility routes demand and logistics into Holm sites; habitation follows movement corridors.',
  },
  {
    id: 'column-land-2',
    from: 'holm',
    to: 'demeter',
    label: 'Dwelling → field power',
    detail:
      'Holm communities need Demeter agrivoltaic and land-energy diligence to stay sovereign.',
  },
  {
    id: 'column-water',
    from: 'viking',
    to: 'atoll',
    label: 'Voyage → habitat',
    detail: 'Viking story-routes seed Atoll floating habitation interest along water lines.',
  },
  {
    id: 'column-water-2',
    from: 'atoll',
    to: 'njord',
    label: 'Habitat → water systems',
    detail: 'Atoll rings depend on Njord water and maritime power research.',
  },
  {
    id: 'column-air',
    from: 'eagle',
    to: 'olympus',
    label: 'Flight → thin air',
    detail: 'Eagle access queues feed Olympus upper-atmosphere habitation research.',
  },
  {
    id: 'column-air-2',
    from: 'olympus',
    to: 'aeolus',
    label: 'Platform → climate field',
    detail: 'Olympus platforms inform Aeolus atmosphere governance and sensing.',
  },
  {
    id: 'column-space',
    from: 'phenix',
    to: 'aether',
    label: 'Ascent → quiet rooms',
    detail: 'Phenix mission concepts open Aether habitation partner ledgers.',
  },
  {
    id: 'column-space-2',
    from: 'aether',
    to: 'corvus',
    label: 'Habitat → intelligence',
    detail: 'Aether operations need Corvus Raven OS as the local intelligence layer.',
  },
  {
    id: 'pillar-move',
    from: 'wolf',
    to: 'viking',
    label: 'Movement row',
    detail: 'Land and water movement share booking, safety, and story frameworks.',
  },
  {
    id: 'pillar-move-2',
    from: 'viking',
    to: 'eagle',
    label: 'Sea → sky',
    detail: 'Guest and logistics patterns climb from voyage into aviation access.',
  },
  {
    id: 'pillar-move-3',
    from: 'eagle',
    to: 'phenix',
    label: 'Sky → space',
    detail: 'Aviation discipline graduates into Phenix mission-concept rigor.',
  },
  {
    id: 'loop-corvus',
    from: 'corvus',
    to: 'wolf',
    label: 'Empire intelligence loop',
    detail:
      'Corvus feeds signal back into Wolf and the mosaic — product drops, moderation, and founder tooling across halls.',
  },
  {
    id: 'loop-bifrost',
    from: 'wolf',
    to: 'eagle',
    label: 'Bifröst ambition',
    detail:
      'Wolf’s Bifröst Line (SF→NYC maglev vision) ties land movement to national air/rail catch-up — a five-year civilization bet.',
  },
]

export const growthLoops = [
  {
    id: 'product-cascade',
    title: 'Product cascade',
    text: 'When a lead product drops, a paired sibling can drop in the same window (Fenrir 02 → Hati 01; Atoll 02 → Atoll 03).',
  },
  {
    id: 'reservation-flywheel',
    title: 'Refundable reservation flywheel',
    text: 'Fully refundable holds gather serious interest without trapping capital — converting later only after entity and payment gates.',
  },
  {
    id: 'domain-reinforcement',
    title: 'Domain reinforcement',
    text: 'Each column (Land/Water/Air/Space) stacks Movement → Habitation → Energy so communities, vehicles, and power co-evolve.',
  },
  {
    id: 'intelligence-spine',
    title: 'Intelligence spine',
    text: 'Corvus Raven OS and Discord Odin keep the empire’s knowledge coherent — Q&A without false operational claims.',
  },
]
