/**
 * Product matrices for all twelve halls.
 * Shared shape: lines (columns) × model rows → product detail routes /{company}/{slug}.
 */

import { POWERTRAIN_TIERS } from './powertrainTiers'
import { wolfMatrix } from './wolfMatrix'

function mysteryRow() {
  return { id: 'mystery', label: '?', mystery: true, cells: null }
}

function line(partial) {
  return {
    powertrain: false,
    benefits: [],
    savings: [],
    addOns: [],
    ...partial,
    stencil: partial.stencil || partial.vehicle || 'module',
    vehicle: partial.vehicle || partial.stencil || 'module',
  }
}

function cell(partial) {
  return {
    capture: 'email',
    status: partial.status || 'planned',
    benefits: partial.benefits || [],
    savings: partial.savings || [],
    addOns: partial.addOns || [],
    ...partial,
  }
}

function row01(cells) {
  return { id: '01', label: '01', cells }
}

function row02(cells) {
  return { id: '02', label: '02', cells }
}

function matrix(def) {
  return {
    kicker: 'Product path',
    powertrainTiers: POWERTRAIN_TIERS,
    emailHint: '',
    emailDone: '',
    community: null,
    phases: null,
    phasesForLineId: null,
    ...def,
  }
}

const emailCapture = { capture: 'email' }

/* ─── Viking ─── */
const vikingLines = [
  line({
    id: 'knarr',
    name: 'Knarr',
    stencil: 'boat',
    epithet: 'Coastal craft',
    naming: 'Workhorse merchant hull of the north, quiet harbor miles first.',
    overview:
      'Coastal craft concept for short northern waterways: electric harbor mode, hydrogen range studies, ethanol-capable dual injection for mixed ports.',
    powertrain: true,
    does: 'Moves small crews and gear along coasts and fjord approaches on a three-tier marine energy story.',
    benefits: ['Harbor-quiet electric mode', 'Partner-operator path', 'Voyage-adjacent logistics'],
    savings: ['Harbor electric cuts idling fuel burn in concept duty cycles', 'Shared dock kits across Knarr / Dreki'],
    addOns: [
      { id: 'dock-kit', name: 'Dock kit', text: 'Shore-power and tie-up package for partner harbors.' },
      { id: 'cold-cabin', name: 'Cold cabin liner', text: 'Insulated short-stay liner for coastal nights.' },
    ],
  }),
  line({
    id: 'dreki',
    name: 'Dreki',
    stencil: 'craft',
    epithet: 'Expedition longship',
    naming: 'Dragon-prowed expedition hull, story miles, hard cliffs, quiet nights.',
    overview: 'Expedition longship concept for story-led northern voyages under partner fleets, not a ticketed cruise line claim.',
    powertrain: true,
    does: 'Carries voyage cohorts on partner-operated expedition circuits when itineraries confirm.',
    benefits: ['Story-led cabin cadence', 'Cold-water expedition geometry', 'Partner fleet first'],
    savings: ['Shared Saga Cabin modules reduce one-off fit-outs', 'Seasonal circuits reuse hull packages'],
    addOns: [
      { id: 'saga-kit', name: 'Saga kit', text: 'Narrative and guide pack for voyage crews.' },
    ],
  }),
  line({
    id: 'skidbladnir',
    name: 'Skíðblaðnir',
    stencil: 'craft',
    epithet: 'Modular ferry',
    naming: 'Folding ship of myth, modular decks that reconfigure with the season.',
    overview: 'Modular ferry concept for community and corridor water links, research and partner diligence only.',
    powertrain: true,
    does: 'Studies reconfigurable decks for seasonal community ferry duty.',
    benefits: ['Modular deck studies', 'Community link framing', 'Demeter/Njord energy adjacency'],
    savings: ['Reconfigurable decks aim to cut seasonal refit waste'],
    addOns: [{ id: 'deck-module', name: 'Deck module', text: 'Swap deck packages for cargo vs passengers (concept).' }],
  }),
  line({
    id: 'harbor-ring',
    name: 'Harbor Ring',
    stencil: 'platform',
    epithet: 'Shore logistics',
    naming: 'The ring of piers and sheds that feed every hull.',
    overview: 'Shore logistics ring: charging, hydrogen staging, and ethanol bunkering studies with Njord.',
    does: 'Coordinates shore energy and logistics for Viking hulls.',
    benefits: ['Shared shore energy', 'Njord adjacency', 'Partner harbor path'],
    savings: ['Shared bunkering studies across hulls'],
    addOns: [{ id: 'bunker-node', name: 'Bunker node', text: 'Concept shore node for electric / H₂ / ethanol.' }],
  }),
  line({
    id: 'saga-cabin',
    name: 'Saga Cabin',
    stencil: 'habitat',
    epithet: 'Voyage lodging',
    naming: 'The quiet cabin where the story lands overnight.',
    overview: 'Cabin lodging concept paired to voyage circuits, reservation interest email-only until itineraries lock.',
    does: 'Provides overnight lodging concepts tied to voyage routes.',
    benefits: ['Quiet cold-country lodging', 'Tied to voyage narrative', 'Quiet lodging interest'],
    savings: ['Shared cabin modules with Atoll/Holm learnings'],
    addOns: [{ id: 'berth-pack', name: 'Berth pack', text: 'Sleep and kit package for voyage nights.' }],
  }),
  line({
    id: 'midgard',
    name: 'Midgard Circuit',
    stencil: 'craft',
    epithet: 'Multi-leg voyage',
    naming: 'The long circuit that stitches coasts into one saga.',
    overview: 'Multi-leg voyage program vision, partner fleets, transparent milestones, no false “sailing tomorrow” claim.',
    does: 'Stitches multi-leg northern circuits once partner fleets and permits clear.',
    benefits: ['Multi-leg narrative', 'Partner-gated honesty', 'Mosaic water-movement spine'],
    savings: ['Circuit reuse of Knarr/Dreki packages'],
    addOns: [],
  }),
]

const vikingMatrix = matrix({
  companyId: 'viking',
  title: 'Viking matrix',
  mission: {
    title: 'What Viking Voyage is building',
    body: 'Viking Voyage is a water-movement arch: coastal craft, expedition hulls, modular ferry studies, shore logistics, saga cabins, and a multi-leg Midgard Circuit, all partner-gated.',
    cadence:
      'Cadence: Knarr 01 leads the coastal craft research queue; Dreki and Saga Cabin follow as partner fleets confirm. No ticketed sailing date on this surface.',
  },
  lines: vikingLines,
  rows: [
    row01({
      knarr: cell({
        id: 'knarr-01',
        status: 'planned',
        targetDate: '2027-06-01',
        summary: 'Coastal craft research lead.',
        description: 'Knarr 01 opens coastal craft studies, electric harbor mode first.',
        does: vikingLines[0].does,
        benefits: vikingLines[0].benefits,
        savings: vikingLines[0].savings,
        addOns: vikingLines[0].addOns,
        hostAlias: 'knarr01',
        ...emailCapture,
      }),
      dreki: cell({
        id: 'dreki-01',
        status: 'planned',
        summary: 'Expedition longship concept.',
        description: 'Dreki 01 studies expedition geometry under partner operators.',
        does: vikingLines[1].does,
        benefits: vikingLines[1].benefits,
        savings: vikingLines[1].savings,
        addOns: vikingLines[1].addOns,
        hostAlias: 'dreki01',
      }),
      skidbladnir: cell({
        id: 'skidbladnir-01',
        status: 'theoretical',
        summary: 'Modular ferry studies.',
        description: 'Skíðblaðnir 01 explores reconfigurable community ferry decks.',
        does: vikingLines[2].does,
        benefits: vikingLines[2].benefits,
        savings: vikingLines[2].savings,
        addOns: vikingLines[2].addOns,
        hostAlias: 'skidbladnir01',
      }),
      'harbor-ring': cell({
        id: 'harbor-ring-01',
        status: 'planned',
        summary: 'Shore logistics ring.',
        description: 'Harbor Ring 01 coordinates shore energy and bunkering studies with Njord.',
        does: vikingLines[3].does,
        benefits: vikingLines[3].benefits,
        savings: vikingLines[3].savings,
        addOns: vikingLines[3].addOns,
        hostAlias: 'harborring01',
      }),
      'saga-cabin': cell({
        id: 'saga-cabin-01',
        status: 'planned',
        summary: 'Voyage lodging concept.',
        description: 'Saga Cabin 01 is the quiet overnight lodging concept for voyage circuits.',
        does: vikingLines[4].does,
        benefits: vikingLines[4].benefits,
        savings: vikingLines[4].savings,
        addOns: vikingLines[4].addOns,
        hostAlias: 'sagacabin01',
      }),
      midgard: cell({
        id: 'midgard-01',
        status: 'vision',
        summary: 'Multi-leg circuit vision.',
        description: 'Midgard Circuit 01 sketches multi-leg northern voyages, vision until fleets confirm.',
        does: vikingLines[5].does,
        benefits: vikingLines[5].benefits,
        savings: vikingLines[5].savings,
        addOns: vikingLines[5].addOns,
        hostAlias: 'midgard01',
      }),
    }),
    row02({
      knarr: cell({
        id: 'knarr-02',
        status: 'theoretical',
        summary: 'Coastal craft follow-on.',
        description: 'Knarr 02 refines cold-harbor packaging after 01 studies.',
        does: 'Follow-on coastal craft refinements.',
        benefits: vikingLines[0].benefits,
        savings: vikingLines[0].savings,
        addOns: vikingLines[0].addOns,
        hostAlias: 'knarr02',
      }),
      dreki: cell({
        id: 'dreki-02',
        status: 'theoretical',
        summary: 'Expedition follow-on.',
        description: 'Dreki 02 extends expedition range concepts.',
        does: 'Extended expedition hull studies.',
        benefits: vikingLines[1].benefits,
        savings: vikingLines[1].savings,
        addOns: vikingLines[1].addOns,
        hostAlias: 'dreki02',
      }),
      skidbladnir: cell({
        id: 'skidbladnir-02',
        status: 'theoretical',
        summary: 'Ferry follow-on.',
        description: 'Skíðblaðnir 02 studies winter deck packages.',
        does: 'Winter modular ferry packages.',
        benefits: vikingLines[2].benefits,
        savings: vikingLines[2].savings,
        addOns: vikingLines[2].addOns,
        hostAlias: 'skidbladnir02',
      }),
      'harbor-ring': cell({
        id: 'harbor-ring-02',
        status: 'theoretical',
        summary: 'Shore ring expansion.',
        description: 'Harbor Ring 02 expands partner harbor nodes.',
        does: 'Expanded shore logistics nodes.',
        benefits: vikingLines[3].benefits,
        savings: vikingLines[3].savings,
        addOns: vikingLines[3].addOns,
        hostAlias: 'harborring02',
      }),
      'saga-cabin': cell({
        id: 'saga-cabin-02',
        status: 'theoretical',
        summary: 'Cabin follow-on.',
        description: 'Saga Cabin 02 studies family and group berths.',
        does: 'Group berth lodging concepts.',
        benefits: vikingLines[4].benefits,
        savings: vikingLines[4].savings,
        addOns: vikingLines[4].addOns,
        hostAlias: 'sagacabin02',
      }),
      midgard: cell({
        id: 'midgard-02',
        status: 'vision',
        summary: 'Circuit expansion.',
        description: 'Midgard Circuit 02 adds secondary coastal legs, vision only.',
        does: 'Secondary circuit legs in vision form.',
        benefits: vikingLines[5].benefits,
        savings: vikingLines[5].savings,
        addOns: vikingLines[5].addOns,
        hostAlias: 'midgard02',
      }),
    }),
    mysteryRow(),
  ],
})

/* ─── Eagle ─── */
const eagleLines = [
  line({
    id: 'talon',
    name: 'Talon',
    stencil: 'aircraft',
    epithet: 'STOL utility',
    naming: 'The grasping foot, short-field utility for hard strips.',
    overview: 'STOL utility aircraft concept for remote strips, partner operators, not scheduled airline service.',
    powertrain: true,
    does: 'Studies short-field utility access for remote and partner strips.',
    benefits: ['Short-field research', 'Partner-operator path', 'Three-tier propulsion packages'],
    savings: ['Shared ground kits with Nest line'],
    addOns: [{ id: 'stol-kit', name: 'STOL kit', text: 'Short-field mission package (concept).' }],
  }),
  line({
    id: 'thermal',
    name: 'Thermal',
    stencil: 'aircraft',
    epithet: 'Research glider',
    naming: 'Riding the rising air, research before thrust.',
    overview: 'Atmospheric research craft concept with Aeolus adjacency.',
    powertrain: false,
    does: 'Supports atmosphere research flights under partner scientific programs.',
    benefits: ['Aeolus synergy', 'Low-impact research profile'],
    savings: ['Shared sensors with Aeolus Field Choir'],
    addOns: [],
  }),
  line({
    id: 'aerie',
    name: 'Aerie',
    stencil: 'aircraft',
    epithet: 'Regional access',
    naming: 'The high nest, regional hops studied, not sold as tickets.',
    overview: 'Regional access interest queue; not a flight schedule.',
    powertrain: true,
    does: 'Collects regional aviation access interest for partner route studies.',
    benefits: ['Access interest without ticket fiction', 'Corridor studies with Skyway'],
    savings: ['Shared corridor diligence'],
    addOns: [],
  }),
  line({
    id: 'skyway',
    name: 'Skyway',
    stencil: 'platform',
    epithet: 'Air corridor',
    naming: 'Invisible roads above the weather line.',
    overview: 'Partner route and corridor concepts, research CRM, not acquisitions.',
    does: 'Maps partner sky corridors as research opportunities.',
    benefits: ['Transparent research status', 'Airport partner path'],
    savings: ['Shared diligence across Aerie/Talon'],
    addOns: [],
  }),
  line({
    id: 'nest',
    name: 'Nest',
    stencil: 'platform',
    epithet: 'Ground support',
    naming: 'Where every flight returns.',
    overview: 'Ground support and charging / hydrogen staging concepts for Eagle craft.',
    powertrain: true,
    does: 'Stages ground energy and support for Eagle airframes.',
    benefits: ['Electric / H₂ / flex-fuel ground story', 'Freki/Wolf adjacency for rescue staging'],
    savings: ['Shared ground energy with Freki concepts'],
    addOns: [{ id: 'ground-boost', name: 'Ground boost', text: 'Hydrogen ground-boost cart concept.' }],
  }),
  line({
    id: 'apex',
    name: 'Apex',
    stencil: 'aircraft',
    epithet: 'Long-range concept',
    naming: 'The highest perch, longest legs, latest opacity.',
    overview: 'Long-range aviation concept, theoretical until nearer lines clear gates.',
    powertrain: true,
    does: 'Explores long-range partner aviation concepts without schedule claims.',
    benefits: ['Honest opacity', 'Tiered propulsion research'],
    savings: [],
    addOns: [],
  }),
]

const eagleMatrix = matrix({
  companyId: 'eagle',
  title: 'Eagle matrix',
  mission: {
    title: 'What Eagle Aviation is building',
    body: 'Eagle Aviation hosts aviation access interest and partner/route research, Talon utility, Thermal research craft, Aerie regional access, Skyway corridors, Nest ground support, and Apex long-range concepts. Not tickets.',
    cadence: 'Cadence: access and partner queues first; airframe concepts stay assumption-labeled. No flight schedule on this surface.',
  },
  lines: eagleLines,
  rows: [
    row01({
      talon: cell({
        id: 'talon-01',
        status: 'planned',
        summary: 'STOL utility research lead.',
        description: 'Talon 01 opens short-field utility studies with partner operators.',
        does: eagleLines[0].does,
        benefits: eagleLines[0].benefits,
        savings: eagleLines[0].savings,
        addOns: eagleLines[0].addOns,
        hostAlias: 'talon01',
      }),
      thermal: cell({
        id: 'thermal-01',
        status: 'planned',
        summary: 'Research glider concept.',
        description: 'Thermal 01 pairs with Aeolus for atmosphere research profiles.',
        does: eagleLines[1].does,
        benefits: eagleLines[1].benefits,
        savings: eagleLines[1].savings,
        addOns: eagleLines[1].addOns,
        hostAlias: 'thermal01',
      }),
      aerie: cell({
        id: 'aerie-01',
        status: 'planned',
        summary: 'Regional access queue.',
        description: 'Aerie 01 is the regional access interest queue, not a ticket.',
        does: eagleLines[2].does,
        benefits: eagleLines[2].benefits,
        savings: eagleLines[2].savings,
        addOns: eagleLines[2].addOns,
        hostAlias: 'aerie01',
      }),
      skyway: cell({
        id: 'skyway-01',
        status: 'theoretical',
        summary: 'Corridor research.',
        description: 'Skyway 01 maps partner corridor concepts.',
        does: eagleLines[3].does,
        benefits: eagleLines[3].benefits,
        savings: eagleLines[3].savings,
        addOns: eagleLines[3].addOns,
        hostAlias: 'skyway01',
      }),
      nest: cell({
        id: 'nest-01',
        status: 'planned',
        summary: 'Ground support node.',
        description: 'Nest 01 stages ground energy for Eagle craft concepts.',
        does: eagleLines[4].does,
        benefits: eagleLines[4].benefits,
        savings: eagleLines[4].savings,
        addOns: eagleLines[4].addOns,
        hostAlias: 'nest01',
      }),
      apex: cell({
        id: 'apex-01',
        status: 'vision',
        summary: 'Long-range vision.',
        description: 'Apex 01 is long-range vision, opacity intentional.',
        does: eagleLines[5].does,
        benefits: eagleLines[5].benefits,
        savings: eagleLines[5].savings,
        addOns: eagleLines[5].addOns,
        hostAlias: 'apex01',
      }),
    }),
    row02({
      talon: cell({ id: 'talon-02', status: 'theoretical', summary: 'STOL follow-on.', description: 'Talon 02 refines cold-strip packages.', does: 'Cold-strip STOL follow-on.', benefits: eagleLines[0].benefits, savings: eagleLines[0].savings, addOns: eagleLines[0].addOns, hostAlias: 'talon02' }),
      thermal: cell({ id: 'thermal-02', status: 'theoretical', summary: 'Glider follow-on.', description: 'Thermal 02 adds night research profiles.', does: 'Night research profiles.', benefits: eagleLines[1].benefits, savings: eagleLines[1].savings, addOns: [], hostAlias: 'thermal02' }),
      aerie: cell({ id: 'aerie-02', status: 'theoretical', summary: 'Access follow-on.', description: 'Aerie 02 expands regional partner queues.', does: 'Expanded regional queues.', benefits: eagleLines[2].benefits, savings: eagleLines[2].savings, addOns: [], hostAlias: 'aerie02' }),
      skyway: cell({ id: 'skyway-02', status: 'vision', summary: 'Corridor expansion.', description: 'Skyway 02 vision for multi-region corridors.', does: 'Multi-region corridor vision.', benefits: eagleLines[3].benefits, savings: [], addOns: [], hostAlias: 'skyway02' }),
      nest: cell({ id: 'nest-02', status: 'theoretical', summary: 'Ground follow-on.', description: 'Nest 02 adds hydrogen staging depth.', does: 'Deeper hydrogen ground staging.', benefits: eagleLines[4].benefits, savings: eagleLines[4].savings, addOns: eagleLines[4].addOns, hostAlias: 'nest02' }),
      apex: cell({ id: 'apex-02', status: 'vision', summary: 'Long-range follow-on.', description: 'Apex 02 remains sealed vision.', does: 'Extended long-range vision.', benefits: eagleLines[5].benefits, savings: [], addOns: [], hostAlias: 'apex02' }),
    }),
    mysteryRow(),
  ],
})

/* ─── Phenix ─── */
const phenixLines = [
  line({ id: 'ember', name: 'Ember', stencil: 'rocket', epithet: 'Suborbital spark', naming: 'First heat, the spark before ascent.', overview: 'Suborbital mission-concept workspace for payload inquiry, not a launch booking.', powertrain: true, does: 'Hosts payload inquiry for suborbital mission concepts.', benefits: ['Honest non-booking framing', 'Partner engineering path'], savings: ['Shared ground systems with Nest/Corona'], addOns: [{ id: 'payload-bay', name: 'Payload bay study', text: 'Bay geometry studies for inquiry partners.' }] }),
  line({ id: 'ascent', name: 'Ascent', stencil: 'rocket', epithet: 'Payload path', naming: 'The climb through fire.', overview: 'Ascent architecture studies for payload customers (prospective).', powertrain: true, does: 'Studies ascent paths for prospective payload partners.', benefits: ['Transparent research status', 'No launch date fiction'], savings: [], addOns: [] }),
  line({ id: 'return', name: 'Return', stencil: 'rocket', epithet: 'Recovery path', naming: 'What goes up must be studied coming home.', overview: 'Recovery architecture studies.', does: 'Explores recovery and return architectures.', benefits: ['Recovery-first honesty'], savings: [], addOns: [] }),
  line({ id: 'corona', name: 'Corona', stencil: 'platform', epithet: 'Heat shield study', naming: 'The bright edge of reentry research.', overview: 'Heat-shield and thermal path research, not tourism.', does: 'Researches thermal protection concepts.', benefits: ['Materials research framing'], savings: [], addOns: [] }),
  line({ id: 'ground-nest', name: 'Ground Nest', stencil: 'platform', epithet: 'Mission ops', naming: 'Earthside nest for every spark.', overview: 'Ground mission-ops and energy staging concepts.', powertrain: true, does: 'Stages ground ops and energy for Phenix concepts.', benefits: ['Electric/H₂ ground story'], savings: [], addOns: [{ id: 'h2-pad', name: 'H₂ pad study', text: 'Hydrogen ground pad concept.' }] }),
  line({ id: 'phoenix-gate', name: 'Phoenix Gate', stencil: 'platform', epithet: 'Mission gate', naming: 'The gate that only opens when diligence clears.', overview: 'Program gate for briefings and collaboration queues.', does: 'Queues partner briefings when gates clear.', benefits: ['Diligence-first access'], savings: [], addOns: [] }),
]

const phenixMatrix = matrix({
  companyId: 'phenix',
  title: 'Phenix matrix',
  mission: {
    title: 'What Phenix Mission is building',
    body: 'Phenix is a mission-concept workspace: Ember, Ascent, Return, Corona, Ground Nest, and Phoenix Gate. Heat, ascent, return, researched without launch-booking fiction.',
    cadence: 'Cadence: inquiry and recovery studies lead; ascent claims wait on engineering and counsel gates.',
  },
  lines: phenixLines,
  rows: [
    row01({
      ember: cell({ id: 'ember-01', status: 'planned', summary: 'Suborbital inquiry lead.', description: 'Ember 01 opens payload inquiry, not a booking.', does: phenixLines[0].does, benefits: phenixLines[0].benefits, savings: phenixLines[0].savings, addOns: phenixLines[0].addOns, hostAlias: 'ember01' }),
      ascent: cell({ id: 'ascent-01', status: 'planned', summary: 'Ascent architecture.', description: 'Ascent 01 studies payload paths.', does: phenixLines[1].does, benefits: phenixLines[1].benefits, savings: [], addOns: [], hostAlias: 'ascent01' }),
      return: cell({ id: 'return-01', status: 'planned', summary: 'Recovery studies.', description: 'Return 01 explores recovery architectures.', does: phenixLines[2].does, benefits: phenixLines[2].benefits, savings: [], addOns: [], hostAlias: 'return01' }),
      corona: cell({ id: 'corona-01', status: 'theoretical', summary: 'Heat shield research.', description: 'Corona 01 is thermal path research.', does: phenixLines[3].does, benefits: phenixLines[3].benefits, savings: [], addOns: [], hostAlias: 'corona01' }),
      'ground-nest': cell({ id: 'ground-nest-01', status: 'planned', summary: 'Ground ops node.', description: 'Ground Nest 01 stages mission ops energy.', does: phenixLines[4].does, benefits: phenixLines[4].benefits, savings: [], addOns: phenixLines[4].addOns, hostAlias: 'groundnest01' }),
      'phoenix-gate': cell({ id: 'phoenix-gate-01', status: 'vision', summary: 'Program gate.', description: 'Phoenix Gate 01 queues briefings when diligence clears.', does: phenixLines[5].does, benefits: phenixLines[5].benefits, savings: [], addOns: [], hostAlias: 'phoenixgate01' }),
    }),
    row02({
      ember: cell({ id: 'ember-02', status: 'theoretical', summary: 'Ember follow-on.', description: 'Ember 02 refines bay studies.', does: 'Refined payload bay studies.', benefits: phenixLines[0].benefits, savings: [], addOns: phenixLines[0].addOns, hostAlias: 'ember02' }),
      ascent: cell({ id: 'ascent-02', status: 'theoretical', summary: 'Ascent follow-on.', description: 'Ascent 02 deepens architecture options.', does: 'Deeper ascent options.', benefits: phenixLines[1].benefits, savings: [], addOns: [], hostAlias: 'ascent02' }),
      return: cell({ id: 'return-02', status: 'theoretical', summary: 'Return follow-on.', description: 'Return 02 adds contingency paths.', does: 'Recovery contingency studies.', benefits: phenixLines[2].benefits, savings: [], addOns: [], hostAlias: 'return02' }),
      corona: cell({ id: 'corona-02', status: 'vision', summary: 'Corona follow-on.', description: 'Corona 02 materials vision.', does: 'Advanced thermal materials vision.', benefits: phenixLines[3].benefits, savings: [], addOns: [], hostAlias: 'corona02' }),
      'ground-nest': cell({ id: 'ground-nest-02', status: 'theoretical', summary: 'Ground follow-on.', description: 'Ground Nest 02 expands pad energy.', does: 'Expanded pad energy.', benefits: phenixLines[4].benefits, savings: [], addOns: phenixLines[4].addOns, hostAlias: 'groundnest02' }),
      'phoenix-gate': cell({ id: 'phoenix-gate-02', status: 'vision', summary: 'Gate expansion.', description: 'Phoenix Gate 02 multi-partner queues.', does: 'Multi-partner briefing queues.', benefits: phenixLines[5].benefits, savings: [], addOns: [], hostAlias: 'phoenixgate02' }),
    }),
    mysteryRow(),
  ],
})

/* ─── Holm ─── */
const holmLines = [
  line({ id: 'timber', name: 'Timber', stencil: 'module', epithet: 'Timber volume', naming: 'Forest-born rooms that land where the site allows.', overview: 'Core timber modular dwelling volumes, quiet weather seals, not stamped plans.', does: 'Provides timber habitation modules for site-feasible homes.', benefits: ['Quiet weather seals', 'Linkable volumes', 'Owner-maintainable assemblies'], savings: ['Shared fasteners across Timber/Sod/Adobe', 'Factory repetition aims to cut site waste'], addOns: [{ id: 'hearth-kit', name: 'Hearth kit', text: 'Interior hearth and quiet HVAC package (concept).' }, { id: 'fix-kit', name: 'Site fix-it kit', text: 'Owner tool and fastener kit for module care.' }] }),
  line({ id: 'sod', name: 'Sod', stencil: 'module', epithet: 'Sod house', naming: 'Earth-backed shelter of the prairie memory.', overview: 'Sod-inspired modular system for land-linked sites.', does: 'Offers sod-inspired modules where site and climate fit.', benefits: ['Thermal mass studies', 'Land-linked aesthetic'], savings: ['Shared utility ring with Commons'], addOns: [] }),
  line({ id: 'adobe', name: 'Adobe', stencil: 'module', epithet: 'Adobe-inspired', naming: 'Sun-dried memory, modern seals.', overview: 'Adobe-inspired modular volumes for arid and high-desert sites.', does: 'Studies adobe-inspired modules for appropriate climates.', benefits: ['Climate-matched envelopes'], savings: [], addOns: [] }),
  line({ id: 'commons', name: 'Commons', stencil: 'habitat', epithet: 'Shared ring', naming: 'The courtyard that turns modules into a hamlet.', overview: 'Shared courtyard / utilities ring.', does: 'Links modules with shared utilities and courtyard logic.', benefits: ['Shared infrastructure', 'Community adjacency'], savings: ['One ring serving many modules'], addOns: [{ id: 'utility-spine', name: 'Utility spine', text: 'Shared power/water spine concept.' }] }),
  line({ id: 'bridge', name: 'Bridge', stencil: 'module', epithet: 'Link module', naming: 'The short hall that makes two homes one.', overview: 'Link modules for double and family configurations.', does: 'Connects dwelling modules into larger homes.', benefits: ['Flexible household growth'], savings: ['Add links instead of full rebuilds'], addOns: [] }),
  line({ id: 'hearth', name: 'Hearth', stencil: 'habitat', epithet: 'Heart volume', naming: 'Where the household gathers.', overview: 'Central hearth volume concepts for family and studio work.', does: 'Centers the household with a gather volume.', benefits: ['Studio + living flexibility'], savings: [], addOns: [] }),
]

const holmMatrix = matrix({
  companyId: 'holm',
  title: 'Holm matrix',
  mission: {
    title: 'What Holm Modular Home is building',
    body: 'Holm lands linkable habitation modules, Timber, Sod, Adobe, Commons, Bridge, and Hearth, where the site allows. Not stamped plans or a construction contract.',
    cadence: 'Cadence: Timber 01 leads; paired modules unlock as site partnerships clear. No false “move-in date” on this surface.',
  },
  lines: holmLines,
  rows: [
    row01({
      timber: cell({ id: 'timber-01', status: 'planned', summary: 'Core timber dwelling.', description: 'Timber 01 is the core modular dwelling volume.', does: holmLines[0].does, benefits: holmLines[0].benefits, savings: holmLines[0].savings, addOns: holmLines[0].addOns, hostAlias: 'timber01' }),
      sod: cell({ id: 'sod-01', status: 'planned', summary: 'Sod-inspired module.', description: 'Sod 01 opens earth-backed module studies.', does: holmLines[1].does, benefits: holmLines[1].benefits, savings: holmLines[1].savings, addOns: [], hostAlias: 'sod01' }),
      adobe: cell({ id: 'adobe-01', status: 'planned', summary: 'Adobe-inspired module.', description: 'Adobe 01 for arid and high-desert sites.', does: holmLines[2].does, benefits: holmLines[2].benefits, savings: [], addOns: [], hostAlias: 'adobe01' }),
      commons: cell({ id: 'commons-01', status: 'theoretical', summary: 'Shared utilities ring.', description: 'Commons 01 studies courtyard and utility rings.', does: holmLines[3].does, benefits: holmLines[3].benefits, savings: holmLines[3].savings, addOns: holmLines[3].addOns, hostAlias: 'commons01' }),
      bridge: cell({ id: 'bridge-01', status: 'planned', summary: 'Link module.', description: 'Bridge 01 connects dwelling volumes.', does: holmLines[4].does, benefits: holmLines[4].benefits, savings: holmLines[4].savings, addOns: [], hostAlias: 'bridge01' }),
      hearth: cell({ id: 'hearth-01', status: 'theoretical', summary: 'Heart volume.', description: 'Hearth 01 centers gather and studio space.', does: holmLines[5].does, benefits: holmLines[5].benefits, savings: [], addOns: [], hostAlias: 'hearth01' }),
    }),
    row02({
      timber: cell({ id: 'timber-02', status: 'theoretical', summary: 'Timber follow-on.', description: 'Timber 02 family-scale volumes.', does: 'Family-scale timber volumes.', benefits: holmLines[0].benefits, savings: holmLines[0].savings, addOns: holmLines[0].addOns, hostAlias: 'timber02' }),
      sod: cell({ id: 'sod-02', status: 'theoretical', summary: 'Sod follow-on.', description: 'Sod 02 linked pairs.', does: 'Linked sod pairs.', benefits: holmLines[1].benefits, savings: [], addOns: [], hostAlias: 'sod02' }),
      adobe: cell({ id: 'adobe-02', status: 'theoretical', summary: 'Adobe follow-on.', description: 'Adobe 02 courtyard links.', does: 'Adobe courtyard links.', benefits: holmLines[2].benefits, savings: [], addOns: [], hostAlias: 'adobe02' }),
      commons: cell({ id: 'commons-02', status: 'vision', summary: 'Commons expansion.', description: 'Commons 02 multi-household rings.', does: 'Multi-household commons.', benefits: holmLines[3].benefits, savings: holmLines[3].savings, addOns: holmLines[3].addOns, hostAlias: 'commons02' }),
      bridge: cell({ id: 'bridge-02', status: 'theoretical', summary: 'Bridge follow-on.', description: 'Bridge 02 longer links.', does: 'Longer link modules.', benefits: holmLines[4].benefits, savings: [], addOns: [], hostAlias: 'bridge02' }),
      hearth: cell({ id: 'hearth-02', status: 'vision', summary: 'Hearth follow-on.', description: 'Hearth 02 workshop hearth.', does: 'Workshop hearth volumes.', benefits: holmLines[5].benefits, savings: [], addOns: [], hostAlias: 'hearth02' }),
    }),
    mysteryRow(),
  ],
})

/* ─── Atoll ─── */
const atollLines = [
  line({ id: 'lagoon', name: 'Lagoon', stencil: 'habitat', epithet: 'Calm-water habitat', naming: 'Still water rooms inside the reef’s arm.', overview: 'Floating modular habitat for sheltered water, Atoll 01 lineage.', does: 'Provides sheltered floating habitation modules.', benefits: ['Sheltered-water first', 'Linkable rings', 'Marine engineer partner path'], savings: ['Shared hull modules across Lagoon/Reef'], addOns: [{ id: 'mooring-kit', name: 'Mooring kit', text: 'Harbor mooring and gangway package (concept).' }] }),
  line({ id: 'reef', name: 'Reef', stencil: 'habitat', epithet: 'Edge habitat', naming: 'Living on the breaking line.', overview: 'Second-ring habitats that cascade with harbor partnership.', does: 'Extends habitats toward more energetic water edges.', benefits: ['Harbor partnership gated'], savings: [], addOns: [] }),
  line({ id: 'tide', name: 'Tide', stencil: 'platform', epithet: 'Tide platform', naming: 'Platforms that rise and fall with honesty.', overview: 'Tide-aware platform studies with Njord adjacency.', powertrain: true, does: 'Studies tide-responsive platform energy and structure.', benefits: ['Njord synergy', 'Electric/H₂ platform assists'], savings: [], addOns: [] }),
  line({ id: 'dock', name: 'Harbor Dock', stencil: 'platform', epithet: 'Dock ring', naming: 'Where floating homes meet the shore.', overview: 'Dock and transfer ring for Atoll clusters.', does: 'Links floating habitats to shore logistics.', benefits: ['Viking/Njord adjacency'], savings: ['Shared dock kits'], addOns: [] }),
  line({ id: 'ring', name: 'Atoll Ring', stencil: 'habitat', epithet: 'Cluster ring', naming: 'The circle that makes a village on water.', overview: 'Cluster ring concepts for multi-habitat communities.', does: 'Arranges habitats into community rings.', benefits: ['Community scale'], savings: [], addOns: [] }),
  line({ id: 'deep', name: 'Deep Mooring', stencil: 'platform', epithet: 'Deep-water', naming: 'Anchors for the open blue, latest opacity.', overview: 'Deep-water cluster, theoretical.', does: 'Studies deep-water mooring for future clusters.', benefits: ['Honest opacity'], savings: [], addOns: [] }),
]

const atollMatrix = matrix({
  companyId: 'atoll',
  title: 'Atoll matrix',
  mission: {
    title: 'What Atoll Habitat is building',
    body: 'Atoll builds floating modular habitats, Lagoon, Reef, Tide, Harbor Dock, Atoll Ring, and Deep Mooring. Interest ledger and email first; not a deed.',
    cadence: 'Cadence: Lagoon 01 leads; Reef cascades with harbor partnership. Deep Mooring stays theoretical.',
  },
  lines: atollLines,
  rows: [
    row01({
      lagoon: cell({ id: 'lagoon-01', status: 'planned', summary: 'Calm-water habitat lead.', description: 'Lagoon 01 is the sheltered floating habitat concept.', does: atollLines[0].does, benefits: atollLines[0].benefits, savings: atollLines[0].savings, addOns: atollLines[0].addOns, hostAlias: 'lagoon01' }),
      reef: cell({ id: 'reef-01', status: 'planned', summary: 'Edge habitat.', description: 'Reef 01 cascades with harbor partnership.', does: atollLines[1].does, benefits: atollLines[1].benefits, savings: [], addOns: [], hostAlias: 'reef01' }),
      tide: cell({ id: 'tide-01', status: 'theoretical', summary: 'Tide platform.', description: 'Tide 01 studies tide-aware platforms.', does: atollLines[2].does, benefits: atollLines[2].benefits, savings: [], addOns: [], hostAlias: 'tide01' }),
      dock: cell({ id: 'dock-01', status: 'planned', summary: 'Harbor dock ring.', description: 'Harbor Dock 01 links habitats to shore.', does: atollLines[3].does, benefits: atollLines[3].benefits, savings: atollLines[3].savings, addOns: [], hostAlias: 'dock01' }),
      ring: cell({ id: 'ring-01', status: 'theoretical', summary: 'Cluster ring.', description: 'Atoll Ring 01 arranges community clusters.', does: atollLines[4].does, benefits: atollLines[4].benefits, savings: [], addOns: [], hostAlias: 'ring01' }),
      deep: cell({ id: 'deep-01', status: 'vision', summary: 'Deep mooring vision.', description: 'Deep Mooring 01 is theoretical deep-water anchoring.', does: atollLines[5].does, benefits: atollLines[5].benefits, savings: [], addOns: [], hostAlias: 'deep01' }),
    }),
    row02({
      lagoon: cell({ id: 'lagoon-02', status: 'theoretical', summary: 'Lagoon follow-on.', description: 'Lagoon 02 linked pairs.', does: 'Linked lagoon pairs.', benefits: atollLines[0].benefits, savings: atollLines[0].savings, addOns: atollLines[0].addOns, hostAlias: 'lagoon02' }),
      reef: cell({ id: 'reef-02', status: 'theoretical', summary: 'Reef follow-on.', description: 'Reef 02 second-ring expansion.', does: 'Second-ring expansion.', benefits: atollLines[1].benefits, savings: [], addOns: [], hostAlias: 'reef02' }),
      tide: cell({ id: 'tide-02', status: 'vision', summary: 'Tide follow-on.', description: 'Tide 02 energy assist vision.', does: 'Tide energy assists.', benefits: atollLines[2].benefits, savings: [], addOns: [], hostAlias: 'tide02' }),
      dock: cell({ id: 'dock-02', status: 'theoretical', summary: 'Dock follow-on.', description: 'Harbor Dock 02 multi-berth.', does: 'Multi-berth docks.', benefits: atollLines[3].benefits, savings: [], addOns: [], hostAlias: 'dock02' }),
      ring: cell({ id: 'ring-02', status: 'vision', summary: 'Ring follow-on.', description: 'Atoll Ring 02 village scale.', does: 'Village-scale rings.', benefits: atollLines[4].benefits, savings: [], addOns: [], hostAlias: 'ring02' }),
      deep: cell({ id: 'deep-02', status: 'vision', summary: 'Deep follow-on.', description: 'Deep Mooring 02 remains sealed.', does: 'Extended deep mooring vision.', benefits: atollLines[5].benefits, savings: [], addOns: [], hostAlias: 'deep02' }),
    }),
    mysteryRow(),
  ],
})

/* ─── Olympus ─── */
const olympusLines = [
  line({ id: 'summit', name: 'Summit', stencil: 'habitat', epithet: 'Thin-air platform', naming: 'Habitation at the edge of breath.', overview: 'Upper-atmosphere habitation research platform, not tourism.', does: 'Studies thin-air habitation platforms for research partners.', benefits: ['Research-not-tourism framing', 'Academic partner path'], savings: [], addOns: [{ id: 'life-kit', name: 'Life support kit', text: 'Research life-support package study.' }] }),
  line({ id: 'veil', name: 'Veil', stencil: 'platform', epithet: 'Veil lab', naming: 'Lab work behind the cloud veil.', overview: 'Longer-duration research lab concepts.', does: 'Hosts longer-duration atmospheric research concepts.', benefits: ['Duration studies'], savings: [], addOns: [] }),
  line({ id: 'aerie-lab', name: 'Aerie Lab', stencil: 'habitat', epithet: 'High lab', naming: 'Eagle’s nest as laboratory.', overview: 'High-altitude lab modules with Eagle adjacency.', does: 'Pairs lab modules with Eagle research craft concepts.', benefits: ['Eagle synergy'], savings: ['Shared sensors'], addOns: [] }),
  line({ id: 'thin-air', name: 'Thin Air', stencil: 'platform', epithet: 'Pressure systems', naming: 'Pressure and breath as infrastructure.', overview: 'Pressure and environmental system studies.', does: 'Researches pressure and environmental systems.', benefits: ['Systems honesty'], savings: [], addOns: [] }),
  line({ id: 'cloud-deck', name: 'Cloud Deck', stencil: 'platform', epithet: 'Deck structure', naming: 'Decks among the clouds, structural studies.', overview: 'Structural deck concepts for thin-air platforms.', does: 'Studies structural decks for high platforms.', benefits: [], savings: [], addOns: [] }),
  line({ id: 'strat', name: 'Strat Platform', stencil: 'platform', epithet: 'Strat concept', naming: 'Highest opacity by design.', overview: 'Stratospheric platform vision.', does: 'Vision register for stratospheric platforms.', benefits: ['Honest opacity'], savings: [], addOns: [] }),
]

const olympusMatrix = matrix({
  companyId: 'olympus',
  title: 'Olympus matrix',
  mission: {
    title: 'What Olympus Habitat Research is building',
    body: 'Olympus studies habitation in the thin air, Summit, Veil, Aerie Lab, Thin Air systems, Cloud Deck, and Strat Platform. Research briefings and email queues; not tourism.',
    cadence: 'Cadence: Summit research leads; Strat stays vision until nearer gates clear.',
  },
  lines: olympusLines,
  rows: [
    row01({
      summit: cell({ id: 'summit-01', status: 'planned', summary: 'Thin-air platform lead.', description: 'Summit 01 opens upper-atmosphere habitation research.', does: olympusLines[0].does, benefits: olympusLines[0].benefits, savings: [], addOns: olympusLines[0].addOns, hostAlias: 'summit01' }),
      veil: cell({ id: 'veil-01', status: 'planned', summary: 'Veil lab.', description: 'Veil 01 longer-duration research concepts.', does: olympusLines[1].does, benefits: olympusLines[1].benefits, savings: [], addOns: [], hostAlias: 'veil01' }),
      'aerie-lab': cell({ id: 'aerie-lab-01', status: 'theoretical', summary: 'High lab.', description: 'Aerie Lab 01 pairs with Eagle research.', does: olympusLines[2].does, benefits: olympusLines[2].benefits, savings: olympusLines[2].savings, addOns: [], hostAlias: 'aerielab01' }),
      'thin-air': cell({ id: 'thin-air-01', status: 'theoretical', summary: 'Pressure systems.', description: 'Thin Air 01 environmental system studies.', does: olympusLines[3].does, benefits: olympusLines[3].benefits, savings: [], addOns: [], hostAlias: 'thinair01' }),
      'cloud-deck': cell({ id: 'cloud-deck-01', status: 'theoretical', summary: 'Deck structure.', description: 'Cloud Deck 01 structural studies.', does: olympusLines[4].does, benefits: [], savings: [], addOns: [], hostAlias: 'clouddeck01' }),
      strat: cell({ id: 'strat-01', status: 'vision', summary: 'Strat vision.', description: 'Strat Platform 01 is sealed vision.', does: olympusLines[5].does, benefits: olympusLines[5].benefits, savings: [], addOns: [], hostAlias: 'strat01' }),
    }),
    row02({
      summit: cell({ id: 'summit-02', status: 'theoretical', summary: 'Summit follow-on.', description: 'Summit 02 duration extensions.', does: 'Extended summit duration.', benefits: olympusLines[0].benefits, savings: [], addOns: olympusLines[0].addOns, hostAlias: 'summit02' }),
      veil: cell({ id: 'veil-02', status: 'theoretical', summary: 'Veil follow-on.', description: 'Veil 02 multi-instrument labs.', does: 'Multi-instrument veil labs.', benefits: olympusLines[1].benefits, savings: [], addOns: [], hostAlias: 'veil02' }),
      'aerie-lab': cell({ id: 'aerie-lab-02', status: 'vision', summary: 'Aerie lab follow-on.', description: 'Aerie Lab 02 vision coupling.', does: 'Deeper Eagle coupling.', benefits: olympusLines[2].benefits, savings: [], addOns: [], hostAlias: 'aerielab02' }),
      'thin-air': cell({ id: 'thin-air-02', status: 'vision', summary: 'Thin air follow-on.', description: 'Thin Air 02 advanced life support vision.', does: 'Advanced life support vision.', benefits: [], savings: [], addOns: [], hostAlias: 'thinair02' }),
      'cloud-deck': cell({ id: 'cloud-deck-02', status: 'vision', summary: 'Deck follow-on.', description: 'Cloud Deck 02 remains vision.', does: 'Extended deck vision.', benefits: [], savings: [], addOns: [], hostAlias: 'clouddeck02' }),
      strat: cell({ id: 'strat-02', status: 'vision', summary: 'Strat follow-on.', description: 'Strat Platform 02 sealed.', does: 'Extended strat vision.', benefits: [], savings: [], addOns: [], hostAlias: 'strat02' }),
    }),
    mysteryRow(),
  ],
})

/* ─── Aether ─── */
const aetherLines = [
  line({ id: 'quiet-room', name: 'Quiet Room', stencil: 'habitat', epithet: 'Habitation cell', naming: 'Quiet rooms above the curve.', overview: 'Space habitation concept with legal status disclosed, never a territorial claim.', does: 'Offers habitation cell concepts for partner research ledgers.', benefits: ['Legal status disclosed', 'No territorial claim'], savings: [], addOns: [{ id: 'quiet-pack', name: 'Quiet pack', text: 'Acoustic and lighting research pack.' }] }),
  line({ id: 'ring-study', name: 'Ring Study', stencil: 'platform', epithet: 'Orbital ring', naming: 'A ring studied, not claimed.', overview: 'Orbital ring partner research.', does: 'Studies orbital ring architectures with partners.', benefits: ['Partner research framing'], savings: [], addOns: [] }),
  line({ id: 'solarium', name: 'Solarium', stencil: 'habitat', epithet: 'Light volume', naming: 'Sun rooms in the dark.', overview: 'Light and radiation-aware volume studies.', does: 'Researches light volumes for habitation concepts.', benefits: [], savings: [], addOns: [] }),
  line({ id: 'dock-node', name: 'Dock Node', stencil: 'platform', epithet: 'Docking', naming: 'Where visiting craft meet the quiet.', overview: 'Docking node concepts for partner missions.', does: 'Studies docking nodes for habitation stacks.', benefits: ['Phenix adjacency'], savings: [], addOns: [] }),
  line({ id: 'spine', name: 'Habitat Spine', stencil: 'habitat', epithet: 'Spine structure', naming: 'The backbone that rooms attach to.', overview: 'Structural spine for multi-cell habitats.', does: 'Provides structural spine concepts for cell clusters.', benefits: ['Modular growth'], savings: ['Add cells without full redesign'], addOns: [] }),
  line({ id: 'halo', name: 'Halo', stencil: 'platform', epithet: 'Halo vision', naming: 'Widest ring, latest opacity.', overview: 'Halo-scale vision, sealed until nearer gates.', does: 'Vision register for large halo architectures.', benefits: ['Honest opacity'], savings: [], addOns: [] }),
]

const aetherMatrix = matrix({
  companyId: 'aether',
  title: 'Aether matrix',
  mission: {
    title: 'What Aether Habitation is building',
    body: 'Aether studies quiet rooms above the curve, Quiet Room, Ring Study, Solarium, Dock Node, Habitat Spine, and Halo, with legal status disclosed and no territorial claim. Email partner ledger',
    cadence: 'Cadence: Quiet Room research leads; Halo stays vision.',
  },
  lines: aetherLines,
  rows: [
    row01({
      'quiet-room': cell({ id: 'quiet-room-01', status: 'planned', summary: 'Habitation cell lead.', description: 'Quiet Room 01 opens habitation cell research.', does: aetherLines[0].does, benefits: aetherLines[0].benefits, savings: [], addOns: aetherLines[0].addOns, hostAlias: 'quietroom01' }),
      'ring-study': cell({ id: 'ring-study-01', status: 'theoretical', summary: 'Orbital ring study.', description: 'Ring Study 01 partner research.', does: aetherLines[1].does, benefits: aetherLines[1].benefits, savings: [], addOns: [], hostAlias: 'ringstudy01' }),
      solarium: cell({ id: 'solarium-01', status: 'planned', summary: 'Light volume.', description: 'Solarium 01 light-volume studies.', does: aetherLines[2].does, benefits: [], savings: [], addOns: [], hostAlias: 'solarium01' }),
      'dock-node': cell({ id: 'dock-node-01', status: 'planned', summary: 'Docking node.', description: 'Dock Node 01 for partner missions.', does: aetherLines[3].does, benefits: aetherLines[3].benefits, savings: [], addOns: [], hostAlias: 'docknode01' }),
      spine: cell({ id: 'spine-01', status: 'theoretical', summary: 'Habitat spine.', description: 'Habitat Spine 01 structural backbone.', does: aetherLines[4].does, benefits: aetherLines[4].benefits, savings: aetherLines[4].savings, addOns: [], hostAlias: 'spine01' }),
      halo: cell({ id: 'halo-01', status: 'vision', summary: 'Halo vision.', description: 'Halo 01 sealed large-architecture vision.', does: aetherLines[5].does, benefits: aetherLines[5].benefits, savings: [], addOns: [], hostAlias: 'halo01' }),
    }),
    row02({
      'quiet-room': cell({ id: 'quiet-room-02', status: 'theoretical', summary: 'Quiet room follow-on.', description: 'Quiet Room 02 multi-cell clusters.', does: 'Multi-cell quiet clusters.', benefits: aetherLines[0].benefits, savings: [], addOns: aetherLines[0].addOns, hostAlias: 'quietroom02' }),
      'ring-study': cell({ id: 'ring-study-02', status: 'vision', summary: 'Ring follow-on.', description: 'Ring Study 02 extended partner vision.', does: 'Extended ring vision.', benefits: [], savings: [], addOns: [], hostAlias: 'ringstudy02' }),
      solarium: cell({ id: 'solarium-02', status: 'theoretical', summary: 'Solarium follow-on.', description: 'Solarium 02 radiation-aware packs.', does: 'Radiation-aware solarium packs.', benefits: [], savings: [], addOns: [], hostAlias: 'solarium02' }),
      'dock-node': cell({ id: 'dock-node-02', status: 'theoretical', summary: 'Dock follow-on.', description: 'Dock Node 02 multi-craft.', does: 'Multi-craft docking.', benefits: [], savings: [], addOns: [], hostAlias: 'docknode02' }),
      spine: cell({ id: 'spine-02', status: 'vision', summary: 'Spine follow-on.', description: 'Habitat Spine 02 long spine vision.', does: 'Long spine vision.', benefits: aetherLines[4].benefits, savings: [], addOns: [], hostAlias: 'spine02' }),
      halo: cell({ id: 'halo-02', status: 'vision', summary: 'Halo follow-on.', description: 'Halo 02 remains sealed.', does: 'Extended halo vision.', benefits: [], savings: [], addOns: [], hostAlias: 'halo02' }),
    }),
    mysteryRow(),
  ],
})

/* ─── Demeter ─── */
const demeterLines = [
  line({ id: 'field', name: 'Field Lattice', stencil: 'field', epithet: 'Agrivoltaic lattice', naming: 'Fields that work twice, soil and sun.', overview: 'Agrivoltaic diligence pathway, soil first, claims last.', powertrain: true, does: 'Structures agrivoltaic diligence so fields can host energy without abandoning soil.', benefits: ['Soil-first diligence', 'No CO₂/ROI fiction without methodology', 'Ethanol feedstock synergy for Wolf Tier 3'], savings: ['Dual-use land narratives when diligence clears', 'Shared sensors with Root Net'], addOns: [{ id: 'soil-kit', name: 'Soil kit', text: 'Sensor and sampling kit for landowners (concept).' }] }),
  line({ id: 'root', name: 'Root Net', stencil: 'field', epithet: 'Soil net', naming: 'What the roots know across parcels.', overview: 'Shared soil-sensor and canopy logic across parcels.', does: 'Links soil and canopy sensing across partner parcels.', benefits: ['Parcel network effects'], savings: [], addOns: [] }),
  line({ id: 'canopy', name: 'Canopy', stencil: 'field', epithet: 'Canopy array', naming: 'Shade that still feeds the ground.', overview: 'Canopy array concepts balanced with crop light budgets.', does: 'Studies canopy arrays with crop-light honesty.', benefits: ['Crop-light budgets labeled'], savings: [], addOns: [] }),
  line({ id: 'ethanol', name: 'Ethanol Grove', stencil: 'field', epithet: 'Ethanol pathway', naming: 'Crops that can fuel Tier 3 dual injection.', overview: 'Ethanol feedstock pathway, Demeter’s explicit synergy with Wolf / machine Tier 3 dual injection.', powertrain: true, does: 'Develops ethanol feedstock pathways that can feed flexible-fuel machines across the mosaic.', benefits: ['Direct Wolf Tier 3 synergy', 'Regional fuel story', 'Soil-first still applies'], savings: ['Regional fuel shortens some logistics legs in concept models'], addOns: [{ id: 'still-study', name: 'Still study', text: 'Small-batch ethanol processing study, research only.' }] }),
  line({ id: 'ledger', name: 'Soil Ledger', stencil: 'software', epithet: 'Land ledger', naming: 'The book of what the land can bear.', overview: 'Diligence ledger for landowners and partners, not an investment offer.', does: 'Tracks land-energy diligence status for partners.', benefits: ['Transparent gates'], savings: [], addOns: [] }),
  line({ id: 'season', name: 'Season Ring', stencil: 'field', epithet: 'Season cycle', naming: 'The year as infrastructure.', overview: 'Seasonal planning ring for agrivoltaic and crop cycles.', does: 'Plans seasonal cycles across energy and crop duties.', benefits: ['Season honesty'], savings: [], addOns: [] }),
]

const demeterMatrix = matrix({
  companyId: 'demeter',
  title: 'Demeter matrix',
  mission: {
    title: 'What Demeter Land Energy is building',
    body: 'Demeter runs land-energy diligence: Field Lattice, Root Net, Canopy, Ethanol Grove (Wolf Tier 3 synergy), Soil Ledger, and Season Ring. Soil first. Not an investment offer.',
    cadence: 'Cadence: Field Lattice diligence leads; Ethanol Grove matures with Wolf powertrain studies. No capacity claims without reviewed methodology.',
  },
  lines: demeterLines,
  rows: [
    row01({
      field: cell({ id: 'field-01', status: 'planned', summary: 'Agrivoltaic diligence lead.', description: 'Field Lattice 01 opens soil-first agrivoltaic diligence.', does: demeterLines[0].does, benefits: demeterLines[0].benefits, savings: demeterLines[0].savings, addOns: demeterLines[0].addOns, hostAlias: 'field01' }),
      root: cell({ id: 'root-01', status: 'planned', summary: 'Soil sensor net.', description: 'Root Net 01 shared sensing across parcels.', does: demeterLines[1].does, benefits: demeterLines[1].benefits, savings: [], addOns: [], hostAlias: 'root01' }),
      canopy: cell({ id: 'canopy-01', status: 'theoretical', summary: 'Canopy arrays.', description: 'Canopy 01 crop-light balanced arrays.', does: demeterLines[2].does, benefits: demeterLines[2].benefits, savings: [], addOns: [], hostAlias: 'canopy01' }),
      ethanol: cell({ id: 'ethanol-01', status: 'planned', summary: 'Ethanol feedstock path.', description: 'Ethanol Grove 01, feedstock synergy for Tier 3 dual injection across halls.', does: demeterLines[3].does, benefits: demeterLines[3].benefits, savings: demeterLines[3].savings, addOns: demeterLines[3].addOns, hostAlias: 'ethanol01' }),
      ledger: cell({ id: 'ledger-01', status: 'planned', summary: 'Soil diligence ledger.', description: 'Soil Ledger 01 tracks diligence gates.', does: demeterLines[4].does, benefits: demeterLines[4].benefits, savings: [], addOns: [], hostAlias: 'ledger01' }),
      season: cell({ id: 'season-01', status: 'theoretical', summary: 'Season planning ring.', description: 'Season Ring 01 seasonal cycle planning.', does: demeterLines[5].does, benefits: demeterLines[5].benefits, savings: [], addOns: [], hostAlias: 'season01' }),
    }),
    row02({
      field: cell({ id: 'field-02', status: 'theoretical', summary: 'Field follow-on.', description: 'Field Lattice 02 multi-parcel lattices.', does: 'Multi-parcel lattices.', benefits: demeterLines[0].benefits, savings: demeterLines[0].savings, addOns: demeterLines[0].addOns, hostAlias: 'field02' }),
      root: cell({ id: 'root-02', status: 'theoretical', summary: 'Root follow-on.', description: 'Root Net 02 regional meshes.', does: 'Regional root meshes.', benefits: [], savings: [], addOns: [], hostAlias: 'root02' }),
      canopy: cell({ id: 'canopy-02', status: 'vision', summary: 'Canopy follow-on.', description: 'Canopy 02 vision arrays.', does: 'Vision canopy arrays.', benefits: [], savings: [], addOns: [], hostAlias: 'canopy02' }),
      ethanol: cell({ id: 'ethanol-02', status: 'theoretical', summary: 'Ethanol follow-on.', description: 'Ethanol Grove 02 regional still studies.', does: 'Regional ethanol processing studies.', benefits: demeterLines[3].benefits, savings: demeterLines[3].savings, addOns: demeterLines[3].addOns, hostAlias: 'ethanol02' }),
      ledger: cell({ id: 'ledger-02', status: 'theoretical', summary: 'Ledger follow-on.', description: 'Soil Ledger 02 partner APIs (concept).', does: 'Partner ledger interfaces.', benefits: [], savings: [], addOns: [], hostAlias: 'ledger02' }),
      season: cell({ id: 'season-02', status: 'vision', summary: 'Season follow-on.', description: 'Season Ring 02 multi-climate vision.', does: 'Multi-climate season vision.', benefits: [], savings: [], addOns: [], hostAlias: 'season02' }),
    }),
    mysteryRow(),
  ],
})

/* ─── Njord ─── */
const njordLines = [
  line({ id: 'otec', name: 'OTEC Brief', stencil: 'water', epithet: 'Ocean thermal', naming: 'Heat from the deep gradient.', overview: 'OTEC research queue, no output claim on this surface.', powertrain: true, does: 'Queues OTEC research and partner diligence.', benefits: ['Research before promises', 'Municipal/utility path'], savings: [], addOns: [{ id: 'brief-pack', name: 'Brief pack', text: 'Diligence briefing packet for site owners.' }] }),
  line({ id: 'atmo', name: 'Atmospheric Well', stencil: 'water', epithet: 'Atmospheric water', naming: 'Water pulled from air with humility.', overview: 'Atmospheric water research, quality claims withheld until methods review.', does: 'Studies atmospheric water pathways.', benefits: ['Method-gated claims'], savings: [], addOns: [] }),
  line({ id: 'depth', name: 'Depth Array', stencil: 'platform', epithet: 'Offshore lattice', naming: 'Arrays in the deep blue.', overview: 'Offshore energy lattice.', powertrain: true, does: 'Studies offshore energy lattices.', benefits: ['Maritime partner path', 'Electric/H₂/flex staging'], savings: [], addOns: [{ id: 'h2-offshore', name: 'Offshore H₂ node', text: 'Hydrogen staging node concept.' }] }),
  line({ id: 'tide-mill', name: 'Tide Mill', stencil: 'water', epithet: 'Tidal assist', naming: 'Old mill logic, new water.', overview: 'Tidal assist research adjacent to Atoll Tide platforms.', powertrain: true, does: 'Researches tidal assist energy.', benefits: ['Atoll adjacency'], savings: [], addOns: [] }),
  line({ id: 'harbor-power', name: 'Harbor Power', stencil: 'platform', epithet: 'Harbor energy', naming: 'Power at the pier for Viking and Atoll.', overview: 'Harbor energy nodes for mosaic water halls.', powertrain: true, does: 'Stages harbor energy for Viking/Atoll.', benefits: ['Cross-hall shore power', 'Ethanol bunkering studies with Demeter'], savings: ['Shared Harbor Ring kits'], addOns: [] }),
  line({ id: 'brine', name: 'Brine Path', stencil: 'water', epithet: 'Brine research', naming: 'What the salt teaches.', overview: 'Brine and concentrate research path, theoretical.', does: 'Studies brine pathways without quality claims.', benefits: ['Honest opacity'], savings: [], addOns: [] }),
]

const njordMatrix = matrix({
  companyId: 'njord',
  title: 'Njord matrix',
  mission: {
    title: 'What Njord Water Systems is building',
    body: 'Njord is the water substrate: OTEC Brief, Atmospheric Well, Depth Array, Tide Mill, Harbor Power, and Brine Path. Research before promises.',
    cadence: 'Cadence: OTEC and harbor energy diligence lead; brine stays theoretical. No water-quality claim here.',
  },
  lines: njordLines,
  rows: [
    row01({
      otec: cell({ id: 'otec-01', status: 'planned', summary: 'OTEC research queue.', description: 'OTEC Brief 01 opens ocean-thermal diligence.', does: njordLines[0].does, benefits: njordLines[0].benefits, savings: [], addOns: njordLines[0].addOns, hostAlias: 'otec01' }),
      atmo: cell({ id: 'atmo-01', status: 'planned', summary: 'Atmospheric water.', description: 'Atmospheric Well 01 method-gated research.', does: njordLines[1].does, benefits: njordLines[1].benefits, savings: [], addOns: [], hostAlias: 'atmo01' }),
      depth: cell({ id: 'depth-01', status: 'theoretical', summary: 'Offshore lattice.', description: 'Depth Array 01 offshore energy studies.', does: njordLines[2].does, benefits: njordLines[2].benefits, savings: [], addOns: njordLines[2].addOns, hostAlias: 'depth01' }),
      'tide-mill': cell({ id: 'tide-mill-01', status: 'theoretical', summary: 'Tidal assist.', description: 'Tide Mill 01 tidal research.', does: njordLines[3].does, benefits: njordLines[3].benefits, savings: [], addOns: [], hostAlias: 'tidemill01' }),
      'harbor-power': cell({ id: 'harbor-power-01', status: 'planned', summary: 'Harbor energy node.', description: 'Harbor Power 01 for Viking/Atoll shore energy.', does: njordLines[4].does, benefits: njordLines[4].benefits, savings: njordLines[4].savings, addOns: [], hostAlias: 'harborpower01' }),
      brine: cell({ id: 'brine-01', status: 'vision', summary: 'Brine research vision.', description: 'Brine Path 01 theoretical concentrate research.', does: njordLines[5].does, benefits: njordLines[5].benefits, savings: [], addOns: [], hostAlias: 'brine01' }),
    }),
    row02({
      otec: cell({ id: 'otec-02', status: 'theoretical', summary: 'OTEC follow-on.', description: 'OTEC Brief 02 site cohort expansion.', does: 'Expanded OTEC site cohorts.', benefits: njordLines[0].benefits, savings: [], addOns: njordLines[0].addOns, hostAlias: 'otec02' }),
      atmo: cell({ id: 'atmo-02', status: 'theoretical', summary: 'Atmo follow-on.', description: 'Atmospheric Well 02 arid-site studies.', does: 'Arid-site atmospheric water.', benefits: [], savings: [], addOns: [], hostAlias: 'atmo02' }),
      depth: cell({ id: 'depth-02', status: 'vision', summary: 'Depth follow-on.', description: 'Depth Array 02 vision lattice.', does: 'Vision offshore lattice.', benefits: [], savings: [], addOns: [], hostAlias: 'depth02' }),
      'tide-mill': cell({ id: 'tide-mill-02', status: 'vision', summary: 'Tide follow-on.', description: 'Tide Mill 02 vision.', does: 'Extended tidal vision.', benefits: [], savings: [], addOns: [], hostAlias: 'tidemill02' }),
      'harbor-power': cell({ id: 'harbor-power-02', status: 'theoretical', summary: 'Harbor follow-on.', description: 'Harbor Power 02 multi-pier nodes.', does: 'Multi-pier harbor energy.', benefits: njordLines[4].benefits, savings: [], addOns: [], hostAlias: 'harborpower02' }),
      brine: cell({ id: 'brine-02', status: 'vision', summary: 'Brine follow-on.', description: 'Brine Path 02 sealed.', does: 'Extended brine vision.', benefits: [], savings: [], addOns: [], hostAlias: 'brine02' }),
    }),
    mysteryRow(),
  ],
})

/* ─── Aeolus ─── */
const aeolusLines = [
  line({ id: 'gauge', name: 'Wind Gauge', stencil: 'wind', epithet: 'Governance gauge', naming: 'Measuring wind as infrastructure.', overview: 'Climate-atmosphere research governance updates, not deployment authority.', does: 'Publishes research governance updates for atmosphere programs.', benefits: ['Governance before deployment claims', 'Policy partner path'], savings: [], addOns: [{ id: 'ethics-pack', name: 'Ethics pack', text: 'Reviewer briefing pack for counsel/NGO partners.' }] }),
  line({ id: 'choir', name: 'Field Choir', stencil: 'wind', epithet: 'Multi-region sensing', naming: 'Many instruments singing one weather.', overview: 'Multi-region sensing.', does: 'Coordinates multi-region atmospheric sensing concepts.', benefits: ['Eagle Thermal adjacency'], savings: ['Shared sensors'], addOns: [] }),
  line({ id: 'pressure', name: 'Pressure Net', stencil: 'wind', epithet: 'Pressure mesh', naming: 'Pressure as a readable mesh.', overview: 'Pressure mesh research for climate partners.', does: 'Studies pressure meshes across regions.', benefits: [], savings: [], addOns: [] }),
  line({ id: 'jet', name: 'Jet Stream', stencil: 'wind', epithet: 'Jet studies', naming: 'High roads of air.', overview: 'Jet-stream research notes, theoretical.', does: 'Researches jet-stream relevant governance questions.', benefits: [], savings: [], addOns: [] }),
  line({ id: 'whisper', name: 'Whisper Array', stencil: 'wind', epithet: 'Quiet sensing', naming: 'Listening without shouting claims.', overview: 'Low-impact sensing array concepts.', does: 'Designs low-impact sensing arrays.', benefits: ['Low-impact ethic'], savings: [], addOns: [] }),
  line({ id: 'climate', name: 'Climate Choir', stencil: 'software', epithet: 'Program choir', naming: 'The wide song, latest opacity.', overview: 'Program-scale climate choir vision.', does: 'Vision register for program-scale coordination.', benefits: ['Honest opacity'], savings: [], addOns: [] }),
]

const aeolusMatrix = matrix({
  companyId: 'aeolus',
  title: 'Aeolus matrix',
  mission: {
    title: 'What Aeolus Atmosphere is building',
    body: 'Aeolus treats wind as infrastructure under research governance: Wind Gauge, Field Choir, Pressure Net, Jet Stream studies, Whisper Array, and Climate Choir. Updates, not deployment authority. Email consultation queues',
    cadence: 'Cadence: Wind Gauge governance leads; Climate Choir stays vision.',
  },
  lines: aeolusLines,
  rows: [
    row01({
      gauge: cell({ id: 'gauge-01', status: 'planned', summary: 'Governance gauge lead.', description: 'Wind Gauge 01 research governance updates.', does: aeolusLines[0].does, benefits: aeolusLines[0].benefits, savings: [], addOns: aeolusLines[0].addOns, hostAlias: 'gauge01' }),
      choir: cell({ id: 'choir-01', status: 'planned', summary: 'Multi-region sensing.', description: 'Field Choir 01 multi-region sensing concepts.', does: aeolusLines[1].does, benefits: aeolusLines[1].benefits, savings: aeolusLines[1].savings, addOns: [], hostAlias: 'choir01' }),
      pressure: cell({ id: 'pressure-01', status: 'theoretical', summary: 'Pressure mesh.', description: 'Pressure Net 01 mesh research.', does: aeolusLines[2].does, benefits: [], savings: [], addOns: [], hostAlias: 'pressure01' }),
      jet: cell({ id: 'jet-01', status: 'theoretical', summary: 'Jet stream studies.', description: 'Jet Stream 01 research notes.', does: aeolusLines[3].does, benefits: [], savings: [], addOns: [], hostAlias: 'jet01' }),
      whisper: cell({ id: 'whisper-01', status: 'planned', summary: 'Quiet sensing array.', description: 'Whisper Array 01 low-impact sensing.', does: aeolusLines[4].does, benefits: aeolusLines[4].benefits, savings: [], addOns: [], hostAlias: 'whisper01' }),
      climate: cell({ id: 'climate-01', status: 'vision', summary: 'Climate choir vision.', description: 'Climate Choir 01 program-scale vision.', does: aeolusLines[5].does, benefits: aeolusLines[5].benefits, savings: [], addOns: [], hostAlias: 'climate01' }),
    }),
    row02({
      gauge: cell({ id: 'gauge-02', status: 'theoretical', summary: 'Gauge follow-on.', description: 'Wind Gauge 02 multi-jurisdiction notes.', does: 'Multi-jurisdiction governance.', benefits: aeolusLines[0].benefits, savings: [], addOns: aeolusLines[0].addOns, hostAlias: 'gauge02' }),
      choir: cell({ id: 'choir-02', status: 'theoretical', summary: 'Choir follow-on.', description: 'Field Choir 02 denser meshes.', does: 'Denser sensing meshes.', benefits: [], savings: [], addOns: [], hostAlias: 'choir02' }),
      pressure: cell({ id: 'pressure-02', status: 'vision', summary: 'Pressure follow-on.', description: 'Pressure Net 02 vision.', does: 'Extended pressure vision.', benefits: [], savings: [], addOns: [], hostAlias: 'pressure02' }),
      jet: cell({ id: 'jet-02', status: 'vision', summary: 'Jet follow-on.', description: 'Jet Stream 02 sealed.', does: 'Extended jet vision.', benefits: [], savings: [], addOns: [], hostAlias: 'jet02' }),
      whisper: cell({ id: 'whisper-02', status: 'theoretical', summary: 'Whisper follow-on.', description: 'Whisper Array 02 quiet expansion.', does: 'Expanded quiet arrays.', benefits: aeolusLines[4].benefits, savings: [], addOns: [], hostAlias: 'whisper02' }),
      climate: cell({ id: 'climate-02', status: 'vision', summary: 'Climate follow-on.', description: 'Climate Choir 02 sealed.', does: 'Extended climate vision.', benefits: [], savings: [], addOns: [], hostAlias: 'climate02' }),
    }),
    mysteryRow(),
  ],
})

/* ─── Corvus ─── */
const corvusLines = [
  line({ id: 'raven-os', name: 'Raven OS', stencil: 'software', epithet: '21 prompts', naming: 'Twenty-one prompts. One badge at the summit.', overview: 'Raven OS, phased prompt tiers. Prompt 21 unlocks the Twenty-First Raven community badge.', does: 'Delivers a phased prompt product for founders and operators, with badge at Prompt 21.', benefits: ['Clear phase pricing when links live', 'Community badge at the summit', 'Odin Discord knowledge path'], savings: ['Phased entry instead of all-upfront enterprise fiction'], addOns: [{ id: 'badge', name: 'Twenty-First Raven badge', text: 'Community badge unlocked at Prompt 21.' }] }),
  line({ id: 'odin-local', name: 'Odin Local', stencil: 'software', epithet: 'Local workspace', naming: 'Wisdom that stays on your machine.', overview: 'Founder workspace that stays local, cascades after early Raven cohort.', does: 'Keeps founder workspace local-first.', benefits: ['Local-first data', 'Privacy-minded'], savings: [], addOns: [] }),
  line({ id: 'mesh', name: 'Corvus Mesh', stencil: 'software', epithet: 'Hall mesh', naming: 'Intelligence across the twelve halls.', overview: 'Intelligence layer across halls, theoretical.', does: 'Studies cross-hall intelligence mesh.', benefits: ['Mosaic awareness'], savings: [], addOns: [] }),
  line({ id: 'forge', name: 'Prompt Forge', stencil: 'software', epithet: 'Prompt tools', naming: 'Where prompts are tempered.', overview: 'Tools for authoring and reviewing prompts inside Raven OS.', does: 'Helps teams forge and review prompts.', benefits: ['Team workflow'], savings: [], addOns: [] }),
  line({ id: 'badge-path', name: 'Badge Path', stencil: 'software', epithet: 'Community path', naming: 'The climb to the twenty-first raven.', overview: 'Community and badge progression path.', does: 'Tracks community progression toward Prompt 21 badge.', benefits: ['Visible community arc'], savings: [], addOns: [] }),
  line({ id: 'knowledge', name: 'Knowledge Nest', stencil: 'software', epithet: 'Knowledge base', naming: 'What Odin answers from.', overview: 'Curated knowledge base feeding Discord Odin, research governance, not omniscience.', does: 'Curates hall knowledge for Odin answers.', benefits: ['Grounded answers', 'No invented ops claims'], savings: [], addOns: [] }),
]

const corvusMatrix = matrix({
  companyId: 'corvus',
  title: 'Corvus matrix',
  mission: {
    title: 'What Corvus is building',
    body: 'Corvus builds Raven OS and the surrounding nest: Odin Local, Corvus Mesh, Prompt Forge, Badge Path, and Knowledge Nest. Prompt 21 unlocks the Twenty-First Raven badge.',
    cadence: 'Cadence: Raven OS phases lead; Odin Local cascades after early cohort; Mesh stays theoretical.',
  },
  lines: corvusLines,
  rows: [
    row01({
      'raven-os': cell({ id: 'raven-os-01', status: 'planned', summary: 'Raven OS entry.', description: 'Raven OS 01, phased prompts. Prompt 21 badge at the summit.', does: corvusLines[0].does, benefits: corvusLines[0].benefits, savings: corvusLines[0].savings, addOns: corvusLines[0].addOns, hostAlias: 'ravenos01', corvusPrompts: true }),
      'odin-local': cell({ id: 'odin-local-01', status: 'planned', summary: 'Local workspace.', description: 'Odin Local 01 founder workspace, local-first.', does: corvusLines[1].does, benefits: corvusLines[1].benefits, savings: [], addOns: [], hostAlias: 'odinlocal01' }),
      mesh: cell({ id: 'mesh-01', status: 'theoretical', summary: 'Hall mesh.', description: 'Corvus Mesh 01 cross-hall intelligence, theoretical.', does: corvusLines[2].does, benefits: corvusLines[2].benefits, savings: [], addOns: [], hostAlias: 'mesh01' }),
      forge: cell({ id: 'forge-01', status: 'planned', summary: 'Prompt forge tools.', description: 'Prompt Forge 01 authoring tools.', does: corvusLines[3].does, benefits: corvusLines[3].benefits, savings: [], addOns: [], hostAlias: 'forge01' }),
      'badge-path': cell({ id: 'badge-path-01', status: 'planned', summary: 'Community badge path.', description: 'Badge Path 01 progression to Prompt 21.', does: corvusLines[4].does, benefits: corvusLines[4].benefits, savings: [], addOns: [], hostAlias: 'badgepath01' }),
      knowledge: cell({ id: 'knowledge-01', status: 'planned', summary: 'Knowledge nest.', description: 'Knowledge Nest 01 curated base for Odin.', does: corvusLines[5].does, benefits: corvusLines[5].benefits, savings: [], addOns: [], hostAlias: 'knowledge01' }),
    }),
    row02({
      'raven-os': cell({ id: 'raven-os-02', status: 'theoretical', summary: 'Raven OS follow-on.', description: 'Raven OS 02 cohort tools after early prompts.', does: 'Cohort tools for later Raven phases.', benefits: corvusLines[0].benefits, savings: [], addOns: corvusLines[0].addOns, hostAlias: 'ravenos02' }),
      'odin-local': cell({ id: 'odin-local-02', status: 'theoretical', summary: 'Odin follow-on.', description: 'Odin Local 02 team local sync (concept).', does: 'Team local sync concepts.', benefits: corvusLines[1].benefits, savings: [], addOns: [], hostAlias: 'odinlocal02' }),
      mesh: cell({ id: 'mesh-02', status: 'vision', summary: 'Mesh follow-on.', description: 'Corvus Mesh 02 vision.', does: 'Extended mesh vision.', benefits: [], savings: [], addOns: [], hostAlias: 'mesh02' }),
      forge: cell({ id: 'forge-02', status: 'theoretical', summary: 'Forge follow-on.', description: 'Prompt Forge 02 review workflows.', does: 'Prompt review workflows.', benefits: [], savings: [], addOns: [], hostAlias: 'forge02' }),
      'badge-path': cell({ id: 'badge-path-02', status: 'theoretical', summary: 'Badge follow-on.', description: 'Badge Path 02 community rituals.', does: 'Community badge rituals.', benefits: [], savings: [], addOns: [], hostAlias: 'badgepath02' }),
      knowledge: cell({ id: 'knowledge-02', status: 'theoretical', summary: 'Knowledge follow-on.', description: 'Knowledge Nest 02 hall depth packs.', does: 'Per-hall knowledge depth.', benefits: corvusLines[5].benefits, savings: [], addOns: [], hostAlias: 'knowledge02' }),
    }),
    mysteryRow(),
  ],
})

/** All twelve hall matrices */
export const hallMatrices = {
  wolf: wolfMatrix,
  viking: vikingMatrix,
  eagle: eagleMatrix,
  phenix: phenixMatrix,
  holm: holmMatrix,
  atoll: atollMatrix,
  olympus: olympusMatrix,
  aether: aetherMatrix,
  demeter: demeterMatrix,
  njord: njordMatrix,
  aeolus: aeolusMatrix,
  corvus: corvusMatrix,
}

export function getHallMatrix(companyId) {
  return hallMatrices[companyId] || null
}

/** Resolve a product cell + line by company and product slug (e.g. fenrir-01). */
export function getProductDetail(companyId, productSlug) {
  const matrix = getHallMatrix(companyId)
  if (!matrix || !productSlug) return null
  for (const row of matrix.rows) {
    if (row.mystery || !row.cells) continue
    for (const line of matrix.lines) {
      const c = row.cells[line.id]
      if (c?.id === productSlug) {
        return {
          matrix,
          line,
          row,
          cell: c,
          companyId,
          displayName: `${line.name} ${row.label}`,
        }
      }
    }
  }
  return null
}

/** Map compact host labels (fenrir01) → { companyId, slug }. */
export function buildProductHostIndex() {
  const index = {}
  for (const [companyId, matrix] of Object.entries(hallMatrices)) {
    for (const row of matrix.rows) {
      if (row.mystery || !row.cells) continue
      for (const line of matrix.lines) {
        const c = row.cells[line.id]
        if (!c) continue
        if (c.hostAlias) index[c.hostAlias.toLowerCase()] = { companyId, slug: c.id }
        const compact = c.id.replace(/-/g, '').toLowerCase()
        index[compact] = { companyId, slug: c.id }
      }
    }
  }
  return index
}

const productHostIndex = buildProductHostIndex()

/**
 * Resolve product hostnames like fenrir01.valhallaco.org.
 * Requires wildcard DNS (*.valhallaco.org) pointed at this Vercel project.
 * Path routes /{company}/{slug} remain the reliable default.
 */
export function resolveProductHost(hostname) {
  if (!hostname) return null
  const host = String(hostname).toLowerCase().split(':')[0]
  const parts = host.split('.')
  if (parts.length < 2) return null
  const sub = parts[0]
  if (!sub || sub === 'www' || sub === 'valhallaco') return null
  // company subdomains (wolf.valhallaco.org) are not product pages
  if (hallMatrices[sub]) return null
  return productHostIndex[sub] || null
}

export function matrixCellOpacity(rowIndex, lineIndex, lineCount, rowCount) {
  const t =
    (rowIndex + lineIndex * 0.15) / Math.max(1, rowCount + lineCount * 0.15 - 1)
  return Math.max(0.2, 1 - t * 0.75)
}

export function formatMatrixDate(iso) {
  if (!iso) return null
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export { wolfMatrix }