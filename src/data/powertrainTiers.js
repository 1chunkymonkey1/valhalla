/**
 * Three-tier powertrain story for vehicle / machine lines across halls.
 * Tier 3 emphasizes flexible fuels with ethanol focus (Demeter synergy).
 */

export const POWERTRAIN_TIERS = [
  {
    id: 'tier-1',
    name: 'Tier 1 — Electric',
    short: 'Electric',
    summary:
      'Battery-electric drive as the quiet baseline: local charging, low mechanical complexity, and clean trail or corridor miles where the grid or pack can carry the day.',
  },
  {
    id: 'tier-2',
    name: 'Tier 2 — Hydrogen',
    short: 'Hydrogen',
    summary:
      'Hydrogen path for longer legs and faster energy top-ups where battery mass becomes the bottleneck — still blueprint-honest until partner fueling and pack/stack gates clear.',
  },
  {
    id: 'tier-3',
    name: 'Tier 3 — Dual injection',
    short: 'Dual injection',
    summary:
      'Flexible-fuel dual injection that can burn conventional fuels with a clear ethanol focus — land synergy with Demeter’s agrivoltaic and crop pathways so the pack can run on what the fields can grow.',
  },
]

/** Compact copy for product pages that adapt tiers to non-road machines. */
export function powertrainNoteForStencil(stencil) {
  const notes = {
    motorcycle: 'Adventure bikes lead electric; hydrogen and dual-injection studies follow for range and remote fuel flexibility.',
    atv: 'Work ATVs are the natural tri-path proving ground: electric yard duty, hydrogen remote legs, dual-injection ethanol-capable work.',
    car: 'Sköll-class cars are electric and hydrogen in the story; dual injection remains the flexible third path for hard country.',
    truck: 'Utility trucks prioritize payload cycles — electric for sites, hydrogen for corridor hauls, dual injection for mixed fuel regions.',
    heli: 'Rescue air adapts the tiers as mission energy packages (electric ground taxi / hybrid studies, hydrogen range concepts, flexible fuel contingency) — not a consumer trim chart.',
    train: 'Rail frames tiers as corridor energy: electrified segments, hydrogen or dual-fuel locomotives on ungirded spans, ethanol-capable flex where Demeter feedstock makes sense.',
    boat: 'Marine lines adapt tiers as quiet electric harbor mode, hydrogen range legs, and ethanol-capable dual injection offshore.',
    craft: 'Craft and ferry lines keep the same three energy stories scaled to hull and duty cycle.',
    aircraft: 'Aviation adapts tiers as propulsion research packages — electric short hops, hydrogen range studies, flexible fuel contingency — never as ticketed service.',
    module: null,
    habitat: null,
    platform: null,
    field: 'Field machines and pumps where powertrains apply follow the same electric → hydrogen → dual-injection (ethanol-forward) ladder.',
    water: null,
    wind: null,
    software: null,
    rocket: 'Ascent concepts discuss energy as mission architecture, not consumer trims — electric ground systems, hydrogen stages where studied, flexible ground fuels.',
  }
  return notes[stencil] ?? null
}
