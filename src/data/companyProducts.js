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
      'Clean and fixable land transit. Fenrir first, then the tri-fuel ATV, through the pack to Dire Wolf: a transcontinental maglev aiming San Francisco to New York in 5.8 hours.',
    body: 'The pack moves. Wolf is the first hall seen, not an operating company that ships. Fenrir is the adventure electric motorcycle named first; next is a tri-fuel ATV; the sixth name is Dire Wolf, a transcontinental maglev aiming San Francisco to New York in 5.8 hours. Two unifying principles run the pack: clean, and fixable. By the time Dire Wolf is built, the pack has assembled. Interest and email only; Fenrir is not a shipping SKU on this surface.',
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
    product: 'Holm',
    headline: 'Built for the terrain you chose.',
    support:
      'First-time home buyers become first-time home builders: courses, financing, compliance, designers, and twelve interlocking container Holms you configure on the site.',
    body: 'Holm turns first-time home buyers into first-time home builders. Courses and support for your first home: sod houses on the plains, log cabins in forests, adobe in the desert. Financing, real estate, compliance, workshops, and in-person designers help you make the home you want. The modular suite is twelve container Holms that interlock and configure in any arrangement you can imagine. You design it on the website; we build it and get it in place.',
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
    product: 'Demeter',
    headline: 'The same acre feeds a family and powers twenty homes.',
    support:
      'Energy production from agrivoltaic farms toward SMRs, geothermal, Stirling, wind, and a 75-year path to Earth’s first Dyson swarm.',
    body: 'Demeter owns energy production. The flagship is agrivoltaic solar grids on US farms, with a goal of 2% of US farms by Q4 2027, enough in the thesis to power the US economy many times over. The wider machine set includes SMRs, geothermal, Stirling engines, high-altitude wind, and standard wind. The 75-year plan culminates in Earth’s first Dyson swarm. Blueprint targets, not a securities offer.',
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
    product: 'Viking Cruises',
    headline: 'Board as yourself. Disembark as Ragnar.',
    support:
      'Sustainable cruises powered by light-water SMRs and emerging sail. Stockholm to London first; later a Phénix pad and a moon leg on the same vacation.',
    body: 'Viking boards. Embark as yourself; disembark as Ragnar Lothbrok or Leif Erikson. Ships are researched for light-water SMRs and emerging sail. The first route studied is Stockholm to London. A later arc would add a Phénix launch-pad call and a moon leg. Partner-gated itineraries; interest only on this surface. No ticketed sailing date here.',
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
    product: 'Atoll',
    headline: 'Where land ends, Atoll begins.',
    support:
      'Floating modular Atolls for the billion people facing sea-level displacement by 2040, plus the Atlantis subsurface line.',
    body: 'Atoll begins where land ends. Surface and subsurface habitation is the path, not a floating-home company that ships. First objective: help the one billion people who will be displaced by sea-level rise by 2040. Atoll 01 / 02 / 03 and Atlantis are thesis scales, not inventory. No funds on this surface. Email only. Not a deed sale.',
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
      'Government / municipal',
      'Investor (info only)',
    ],
  },
  njord: {
    product: 'Njord',
    headline: 'Every molecule of water in the galaxy. Ours.',
    support:
      'The hall holds the water: clean, recycle, develop, split, and transport on Earth and above. First objective: water scarcity on Earth.',
    body: 'Njord holds the water. Clean, recycle, develop, split, and transport the molecule, on Earth and above. The first objective is solving water scarcity on Earth. Research and partner paths before output promises. MARAD-2026-0729 stays with Demeter and Argo, not this hall.',
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
    product: 'Eagle Air',
    headline: 'The more you fly, the better it is for the atmosphere.',
    support:
      'Clean air transport from private jets to long-distance Earth travel. Every plane is named for a bird. Active carbon removal on every flight.',
    body: 'Eagle rises. Clean air transport from private jets to long-distance Earth travel. Every plane is named after a bird species to remind us who holds the skies. Every Eagle jet is designed with active carbon removal: the more you fly it, the better it is for the atmosphere. Access and partner interest only; not a published flight schedule. Open dialogue is not an acquisition.',
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
    product: 'Olympus',
    headline: 'The first home above the clouds.',
    support:
      'Cities of the future above the clouds. Fly Eagle to your Olympus Holm; drink through Njord pipes. Olympus Mons, the first cloud city, targets 2028.',
    body: 'Olympus builds the cities of the future above the clouds. You will be able to fly your Eagle jet to your Olympus Holm and use Njord pipes to drink water above the clouds. Olympus Mons, the first cloud city, finishes in 2028 on the program target. Briefings and research queues, not tourism tickets.',
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
    product: 'Aeolus',
    headline: 'Fix the atmosphere. Then own it.',
    support:
      'The hall presses the sky: gas and fine particles. Climate on Earth by 2031; acid shielding for Venus habitats next.',
    body: 'Aeolus presses the sky. Anything that is gas or small particles, Aeolus researches, develops, and builds. The first objective is solving climate change on Earth by 2031. The second is acid shielding for Venus habitats. Present title to the atmospheric substrate is not claimed here. No atmospheric-rights sales or fund collection against ownership claims on this surface.',
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
    product: 'Phénix Aerospace',
    headline: 'Every launch is a death. Every orbit is a resurrection.',
    support:
      'Space transportation: Moon first, then Moon to Venus and Mars, then Alpha Centauri B (Rollo). O’Neill spheres on the long road.',
    body: 'Phénix Aerospace builds transportation in space. Routes to the Moon are the first priority; second is routes from the Moon to Venus and Mars; third is Alpha Centauri B, henceforth named Rollo. Phénix is also building O’Neill spheres. Hawk Mark vehicles carry the fire; Bifröst and Zeus sit on the lunar and Venus path. No launch booking on this surface.',
    tone: 'space',
    ...emailFirst,
    gallery: [
      { src: '/images/phenix.png', alt: 'Phénix bird' },
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
    product: 'Aether Real Estate',
    headline: 'Phénix marks the territory. Aether claims it.',
    support:
      'Claim land in the galaxy. Manage claims, defend claim jumpers, protect territory. Hawk Mark 02 plants flags for Earth-originated claims.',
    body: 'Aether marks orbit as a registry research hall. Manage claims as ledger instruments, defend claim-jumper framing, and disclose legal status. Hawk Mark 02, a Phénix launch vehicle, is tasked with planting flags for claims made on Earth. The goal is a fair and regulated system for human expansion into the cosmos. Territorial ownership beyond Earth is not present title. No deed sales or fund collection against claims on this surface.',
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
    product: 'Corvus',
    headline: 'The mind that runs the mosaic. And counting.',
    support:
      'Equitable intelligence infrastructure: sovereign solar computers, space data centers, and Raven OS for the empire. Waitlist for early prompts.',
    body: 'Corvus builds the equitable intelligence infrastructure life on Earth will use to thrive. Sovereign computers: medium-sized, solar-powered machines so you can access intelligence without giving your data to giant tech. Space data centers sit on the long path. Corvus Raven OS is what the rest of the empire runs on. Join the waitlist for early access to prompts and other products.',
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
    body: 'Meridian is the materials layer under the twelve halls. Earth: one pair of self-cleaning white stain-trapping polymer pants meant to replace dozens of purchases a year. Space: a spacesuit rated for Venus. Every hall wears Meridian merch. Blueprint and interest only on this surface.',
    tone: 'land',
    ...emailFirst,
    gallery: [
      { src: '/images/placeholders/default.svg', alt: 'Meridian materials placeholder' },
    ],
    interestGroups: [
      'Consumer / wearer interest',
      'Textile / materials partner',
      'Aerospace suit partner',
      'Hall-mark / mill partner',
      'Press / research',
    ],
  },
}
