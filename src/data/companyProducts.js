/** Per-company product windows: copy, interest groups, and site photography */

const emailFirst = {
  emailOnly: true,
  ctaPrimary: 'Email',
  ctaSecondary: 'Product path',
  aboutNote: '',
}

export const companyProducts = {
  wolf: {
    product: 'Wolf Transit',
    headline: 'The pack moves first.',
    support:
      'Electric adventure motorcycle first, then ATV, car, truck, rescue air, and the Dire Wolf railroad: San Francisco to New York in 5.8 hours on the network target.',
    body: 'Wolf Transit builds a named pack of land machines under wolf species and myth, culminating in Dire Wolf, a phased San Francisco to New York railroad aiming for a 5.8-hour crossing. Community fix-it culture under every line. Fenrir 01 targets January 13, 2027.',
    tone: 'land',
    ...emailFirst,
    gallery: [
      { src: '/images/wolf.png', alt: 'Wolf in snow' },
      { src: '/images/sites/wolf-ref.jpg', alt: 'Wolf reference' },
      { src: '/images/sites/viking-bridge.jpg', alt: 'Mountain valley' },
    ],
    interestGroups: [
      'Rider / consumer',
      'Dealer / service partner',
      'OEM / manufacturing partner',
      'Fleet / adventure operator',
      'Press / research',
    ],
  },
  holm: {
    product: 'Holm Modular Home',
    headline: 'Built for the terrain you chose.',
    support:
      'Twelve linkable modules: timber, sod, or adobe by terrain, with logistics, financing, and real estate handled as part of the path.',
    body: 'Holm is a modular habitation concept: twelve linkable modules across Timber, Sod, Adobe, Commons, Bridge, and Hearth. Log cabin, sod house, or adobe depending on the site. Not stamped plans or a construction contract.',
    tone: 'land',
    ...emailFirst,
    gallery: [
      { src: '/images/holm.png', alt: 'Modular cabin in snow' },
      { src: '/images/sites/holm-cabin.jpg', alt: 'Holm modular cabin' },
      { src: '/images/sites/holm-fjord-house.jpg', alt: 'House by the fjord' },
      { src: '/images/sites/holm-meadow.jpg', alt: 'Frost meadow bridge' },
    ],
    interestGroups: [
      'Prospective homeowner',
      'Site / land owner',
      'Builder / installer',
      'Architect / designer',
      'Financing partner',
      'Logistics / real estate partner',
    ],
  },
  demeter: {
    product: 'Demeter Land Energy',
    headline: 'The same acre feeds a family and powers twenty homes.',
    support:
      'California-first land energy: agrivoltaics, green hydrogen, geothermal, wind, and SMR diligence on a 75-year path toward a Dyson swarm.',
    body: 'Demeter runs soil-first land-energy diligence across agrivoltaic solar, green hydrogen, geothermal, wind, and SMR pathways, California first. Ethanol Grove still feeds Wolf Tier 3 dual injection. Long roadmap ends at a Dyson swarm. Not an investment offer.',
    tone: 'land',
    ...emailFirst,
    gallery: [
      { src: '/images/demeter.png', alt: 'Agrivoltaic field' },
      { src: '/images/sites/demeter-field.jpg', alt: 'Wheat field' },
      { src: '/images/sites/demeter-solar.jpg', alt: 'Solar arrays' },
      { src: '/images/sites/demeter-rainbow.jpg', alt: 'Open field light' },
    ],
    interestGroups: [
      'Landowner',
      'Project developer',
      'Engineering partner',
      'Community / municipal',
      'Grant / research',
    ],
  },
  viking: {
    product: 'Viking Voyage',
    headline: 'Board as yourself. Disembark as Ragnar.',
    support: 'Clean consumer cruises with a full narrative arc: the Vinland Saga is available to anyone who boards.',
    body: 'Viking Voyage is a water-movement arch: Knarr, Dreki, Skíðblaðnir, Harbor Ring, Saga Cabin, and the Vinland Saga. Partner-gated. Story first; tickets wait on licensed operators.',
    tone: 'water',
    ...emailFirst,
    gallery: [
      { src: '/images/viking.png', alt: 'Longship on fjord' },
      { src: '/images/sites/viking-fjord.jpg', alt: 'Fjord water' },
      { src: '/images/sites/viking-dawn.jpg', alt: 'Cabins at dawn' },
      { src: '/images/sites/viking-shore.jpg', alt: 'Shore at dusk' },
    ],
    interestGroups: [
      'Traveler / guest',
      'Travel advisor',
      'Charter / operator partner',
      'Corporate / group',
      'Press',
    ],
  },
  atoll: {
    product: 'Atoll Habitat',
    headline: 'Where land ends, Atoll begins.',
    support:
      'Atoll 01 single family, Atoll 02 twelve families, Atoll 03 municipal. First delivery target: Tuvalu government.',
    body: 'Atoll builds floating modular habitats at three scales: Atoll 01 for a single family, Atoll 02 for twelve families, Atoll 03 as a municipal facility. First delivery target is the Tuvalu government. Not a deed.',
    tone: 'water',
    ...emailFirst,
    gallery: [
      { src: '/images/atoll.png', alt: 'Floating habitat' },
      { src: '/images/sites/atoll-lagoon.jpg', alt: 'Lagoon water' },
      { src: '/images/sites/water-orcas.jpg', alt: 'Open ocean life' },
    ],
    interestGroups: [
      'Prospective resident',
      'Harbor / site partner',
      'Marine engineer',
      'Manufacturer',
      'Government / municipal (Tuvalu and peers)',
      'Investor (info only)',
    ],
  },
  njord: {
    product: 'Njord Water Systems',
    headline: 'Every molecule of water in the galaxy. Ours.',
    support:
      'The full water energy layer: clean, reuse, split, manufacture, and turn air into water, plus offshore energy, maritime power, and green hydrogen.',
    body: 'Njord is the full water energy layer. Clean it, reuse it, split it, manufacture it, turn air into water. Offshore energy, atmospheric water generation, maritime power, and green hydrogen from water. Research before output promises.',
    tone: 'water',
    ...emailFirst,
    gallery: [
      { src: '/images/njord.png', alt: 'Offshore platform' },
      { src: '/images/sites/njord-ocean.jpg', alt: 'Deep ocean' },
      { src: '/images/sites/water-orcas.jpg', alt: 'Marine life' },
    ],
    interestGroups: [
      'Site owner',
      'Municipal / utility',
      'Research engineer',
      'Maritime partner',
      'Policy / counsel',
    ],
  },
  eagle: {
    product: 'Eagle Aviation',
    headline: 'The more you fly, the better it is for the atmosphere.',
    support:
      'Clean planes and jets across types, sustainable aviation fuel and electric propulsion, with talks toward acquiring Spirit Airlines.',
    body: 'Eagle builds clean aviation across craft types with sustainable aviation fuel and electric propulsion research. Access interest and partner queues only: not a flight schedule. Exploring talks toward acquiring Spirit Airlines as a network path.',
    tone: 'air',
    ...emailFirst,
    gallery: [
      { src: '/images/eagle.png', alt: 'Eagle in snow' },
      { src: '/images/sites/air-clouds.jpg', alt: 'Cloud deck' },
      { src: '/images/sites/aeolus-wind.jpg', alt: 'Wind sky' },
    ],
    interestGroups: [
      'Prospective traveler',
      'Airline / operator partner',
      'Airport partner',
      'SAF / propulsion partner',
      'Advisor / engineer',
      'Press',
    ],
  },
  olympus: {
    product: 'Olympus Habitat Research',
    headline: 'The first home above the clouds.',
    support:
      'Floating cloud cities: modular pressurized habitats in the upper atmosphere, with a long-range target of Venus at 50 km by 2035.',
    body: 'Olympus studies floating cloud cities as modular pressurized habitats in the thin air. Earth research first; long-range north star is Venus at roughly 50 km altitude by 2035. Briefings and research queues, not tourism.',
    tone: 'air',
    ...emailFirst,
    gallery: [
      { src: '/images/olympus.png', alt: 'Cloud platforms' },
      { src: '/images/sites/air-clouds.jpg', alt: 'High clouds' },
      { src: '/images/sites/aeolus-wind.jpg', alt: 'Atmospheric wind' },
    ],
    interestGroups: [
      'Aerospace engineer',
      'Academic partner',
      'Industrial partner',
      'Reviewer / counsel',
      'Student / researcher',
    ],
  },
  aeolus: {
    product: 'Aeolus Atmosphere',
    headline: 'Fix the atmosphere. Then own it.',
    support:
      'Atmospheric operating system in three phases: fix climate, then oxygen for space habitats, then radiation protection.',
    body: 'Aeolus is the atmospheric operating system that intends to own the atmospheric substrate. Phase 1: fix climate change. Phase 2: oxygen and breathable air for space habitats (Olympus and Aether adjacency). Phase 3: radiation protection. Research governance leads Phase 1 work. No atmospheric-rights sales or fund collection against ownership claims on this surface.',
    tone: 'air',
    ...emailFirst,
    gallery: [
      { src: '/images/aeolus.png', alt: 'Wind-swept sky' },
      { src: '/images/sites/aeolus-wind.jpg', alt: 'Turbines in cloud' },
      { src: '/images/sites/air-clouds.jpg', alt: 'Sky layers' },
    ],
    interestGroups: [
      'Climate scientist',
      'Policy partner',
      'Ethics / legal reviewer',
      'Civic / NGO',
      'Program staff',
    ],
  },
  phenix: {
    product: 'Phenix Mission',
    headline: 'Every launch is a death. Every orbit is a resurrection.',
    support:
      'Hawk Mark 1 launch vehicle, Bifröst Base Camp at the lunar south pole, and Zeus: a crewed Venus cloud city by 2035.',
    body: 'Phenix is a mission-concept workspace: Hawk Mark 1, ascent and return architectures, Bifröst Base Camp at the lunar south pole, and Zeus aiming at a crewed Venus cloud city by 2035. Heat, ascent, return, researched without launch-booking fiction.',
    tone: 'space',
    ...emailFirst,
    gallery: [
      { src: '/images/phenix.png', alt: 'Phenix bird' },
      { src: '/images/sites/aether-orbit.jpg', alt: 'Earth from orbit' },
      { src: '/images/sites/city-bridge.jpg', alt: 'Ground infrastructure' },
    ],
    interestGroups: [
      'Payload customer (prospective)',
      'Engineering partner',
      'Advisor',
      'Research institution',
      'Press',
    ],
  },
  aether: {
    product: 'Aether Claims',
    headline: 'Phenix marks the territory. Aether claims it.',
    support:
      'Space real estate and territorial claims: orbital stations, lunar land claims, asteroid rights, and planetary surfaces.',
    body: 'Aether is the claims and real estate company beyond Earth: a formal registry for orbital stations, lunar parcels, asteroid rights, and planetary surfaces. Not a habitat company. Station and volume studies support the claims layer; legal status is disclosed. No deed sales on this surface.',
    tone: 'space',
    ...emailFirst,
    gallery: [
      { src: '/images/aether.png', alt: 'Orbital habitat' },
      { src: '/images/sites/aether-orbit.jpg', alt: 'Earth orbit' },
      { src: '/images/sites/air-clouds.jpg', alt: 'Atmosphere edge' },
    ],
    interestGroups: [
      'Mission / station partner',
      'Counsel / policy',
      'Research staff',
      'Approved investor inquiry',
      'Press',
    ],
  },
  corvus: {
    product: 'Corvus Intelligence',
    headline: 'The mind that runs eleven companies. And counting.',
    support:
      'Sovereign AI compute: solar-powered, offline-capable, modular. Raven OS is the substrate; Odin is the consumer product for founders.',
    body: 'Corvus is a sovereign intelligence layer, not a cloud AI company. Raven OS is the modular, solar-aware, offline-capable substrate across the halls. Odin is the consumer product for founders. Phased Raven prompts remain the access path; Prompt 21 unlocks the Twenty-First Raven badge.',
    tone: 'space',
    ...emailFirst,
    gallery: [
      { src: '/images/corvus.png', alt: 'Raven in snow' },
      { src: '/images/sites/city-canyon.jpg', alt: 'City canyon' },
      { src: '/images/sites/city-towers.jpg', alt: 'Towers' },
      { src: '/images/sites/city-plaza.jpg', alt: 'Urban plaza' },
    ],
    interestGroups: [
      'Founder',
      'Small team',
      'Portfolio operator',
      'Security reviewer',
      'Enterprise pilot',
    ],
  },
  meridian: {
    product: 'Meridian Materials',
    headline: 'Worn by everyone. Built to last forever.',
    support:
      'The materials layer beneath all four domains: Earth garment systems and space-rated suits.',
    body: 'Meridian is the materials layer under the twelve halls. Earth: one pair of self-cleaning white stain-trapping polymer pants meant to replace dozens of purchases a year, targeting a September 2026 research launch. Space: a spacesuit rated for Venus, plus the Stealth body-armor supply chain. Blueprint and interest only on this surface.',
    tone: 'land',
    ...emailFirst,
    gallery: [
      { src: '/images/placeholders/default.svg', alt: 'Meridian materials placeholder' },
    ],
    interestGroups: [
      'Consumer / wearer interest',
      'Textile / materials partner',
      'Aerospace suit partner',
      'Defense / armor supply inquiry',
      'Press / research',
    ],
  },
}
