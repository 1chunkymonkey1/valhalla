/**
 * Grounding pack for Ask-the-hall AI replies.
 * Keep claims conservative — research / waitlist / interest only.
 */

const HALLS = {
  hub: {
    name: 'Valhalla',
    hero: 'Civilization platform across twelve halls plus Meridian materials.',
    body: 'Valhalla coordinates twelve mosaic companies across land, water, air, and space for movement, habitation, energy, and intelligence, with Meridian as the materials layer beneath. Public pages are research and interest surfaces, not checkout or shipping claims.',
    bullets: [
      'Twelve mosaic halls unlock on the launch schedule (Pacific time)',
      'Meridian is the materials layer at /meridian (not a mosaic tile)',
      'Ask widgets reach the Valhalla team',
      'No false “shipping now” or funded reservation claims on this surface',
    ],
  },
  wolf: {
    name: 'Wolf',
    hero: 'The pack moves first.',
    body: 'Wolf Transit is a land-mobility arch: Fenrir motorcycle, Hati ATV, Sköll car, Geri truck, Freki rescue air, and Dire Wolf rail aiming San Francisco to New York in 5.8 hours. Lines named for wolf species and myth. Transparent research, not checkout.',
    bullets: [
      'Fenrir 01 target January 13, 2027 (research cadence, not a guaranteed ship date)',
      'Dealer and OEM inquiry routing',
      'Dire Wolf: SF→NY 5.8-hour network target, phased railroad complete by August 13, 2031',
      'Bifröst is the Phenix lunar base camp, not the Earth railroad',
    ],
  },
  viking: {
    name: 'Viking',
    hero: 'Board as yourself. Disembark as Ragnar.',
    body: 'Viking is a narrative voyage concept. The Vinland Saga is the full arc available to anyone who boards. Tickets wait on licensed operators.',
    bullets: ['Vinland Saga narrative arc', 'Guest interest registry', 'Charter / operator partner inquiry'],
  },
  eagle: {
    name: 'Eagle',
    hero: 'The more you fly, the better it is for the atmosphere.',
    body: 'Eagle hosts clean aviation research with SAF and electric propulsion. In talks toward acquiring Spirit Airlines. No flight schedule on this surface.',
    bullets: ['SAF and electric propulsion research', 'Traveler interest waitlist', 'Spirit Airlines talks as network path'],
  },
  phenix: {
    name: 'Phenix',
    hero: 'Every launch is a death. Every orbit is a resurrection.',
    body: 'Phenix tracks Hawk Mark 1, Bifröst Base Camp at the lunar south pole, and Zeus toward a crewed Venus cloud city by 2035. No launch booking here.',
    bullets: ['Hawk Mark 1 launch vehicle', 'Bifröst lunar south-pole base camp', 'Zeus / Venus 2035 north star'],
  },
  holm: {
    name: 'Holm',
    hero: 'Built for the terrain you chose.',
    body: 'Holm is twelve linkable modules: timber, sod, or adobe by terrain. Logistics, financing, and real estate sit on the interest path. Not stamped plans.',
    bullets: ['Twelve linkable modules', 'Site feasibility checklist', 'Financing / logistics / real estate partner path'],
  },
  atoll: {
    name: 'Atoll',
    hero: 'Where land ends, Atoll begins.',
    body: 'Atoll 01 single family, Atoll 02 twelve families, Atoll 03 municipal. First delivery target: Tuvalu government. No fund collection on this surface.',
    bullets: ['Atoll 01 / 02 / 03 scale tiers', 'Tuvalu first-delivery target', 'Partner pipeline intake'],
  },
  olympus: {
    name: 'Olympus',
    hero: 'The first home above the clouds.',
    body: 'Olympus studies floating cloud cities as modular pressurized habitats. Long-range target: Venus at 50 km by 2035 with Phenix Zeus.',
    bullets: ['Pressurized cloud-city research', 'Venus 50 km / 2035 north star', 'Conceptual partner intake'],
  },
  aether: {
    name: 'Aether',
    hero: 'Phenix marks the territory. Aether claims it.',
    body: 'Aether is the claims and real estate company beyond Earth: orbital stations, lunar parcels, asteroid rights, planetary surfaces. Legal status disclosed. No deed sales on this surface.',
    bullets: ['Claims / registry framing', 'Lunar, asteroid, and planetary claim studies', 'Partner interest portal'],
  },
  demeter: {
    name: 'Demeter',
    hero: 'The same acre feeds a family and powers twenty homes.',
    body: 'Demeter tracks California-first land energy: agrivoltaics, green hydrogen, geothermal, wind, and SMR on a 75-year path toward a Dyson swarm. Research status only.',
    bullets: [
      'Agrivoltaics, geothermal, wind, green hydrogen, SMR diligence',
      'California-first framing',
      '75-year / Dyson roadmap (vision)',
      'No capacity, CO₂, or ROI claims without reviewed methodology',
    ],
  },
  njord: {
    name: 'Njord',
    hero: 'Every molecule of water in the galaxy. Ours.',
    body: 'Njord is the full water energy layer: clean, reuse, split, manufacture, turn air into water, plus offshore energy, maritime power, and green hydrogen. Research before output promises.',
    bullets: [
      'Atmospheric water, OTEC, offshore energy, harbor power',
      'Green hydrogen from water',
      'Clean / reuse / manufacture research pathways',
    ],
  },
  aeolus: {
    name: 'Aeolus',
    hero: 'Fix the atmosphere. Then own it.',
    body: 'Aeolus is the atmospheric operating system: Phase 1 climate, Phase 2 oxygen for habitats, Phase 3 radiation protection. Research governance leads; deployment authority is not claimed here.',
    bullets: ['Three-phase atmospheric OS', 'Oxygen path for Olympus / Aether', 'Radiation protection in Phase 3'],
  },
  corvus: {
    name: 'Corvus',
    hero: 'The mind that runs eleven companies. And counting.',
    body: 'Corvus is sovereign AI compute: Raven OS (solar-aware, offline-capable, modular substrate) and Odin as the founder consumer product. Prompt ladder is the access path; Prompt 21 unlocks the Twenty-First Raven badge.',
    bullets: [
      'Sovereign intelligence substrate, not a cloud AI company',
      'Odin consumer product for founders',
      'Raven OS phased prompts; Prompt 21 badge',
    ],
  },
  meridian: {
    name: 'Meridian',
    hero: 'Worn by everyone. Built to last forever.',
    body: 'Meridian is the materials layer beneath all four domains: Earth garment (self-cleaning polymer pants, September 2026 research target), Venus-rated spacesuit, and Stealth body-armor supply chain.',
    bullets: ['Earth garment research toward September 2026', 'Venus Suit', 'Stealth Armor supply chain'],
  },
}

const SCHEDULE_BLURB =
  'Launch day schedule (Pacific): Wave 1 halls unlock in chain from morning (Wolf → Holm → Demeter → Viking → Atoll → Njord). Wave 2 starts 2:00 PM PDT (Eagle → Olympus → Aeolus → Phenix → Aether → Corvus). Mosaic tiles become clickable on that schedule; Meridian materials is available at /meridian outside the mosaic clock. There are no public unlock codes.'

export function getHallKnowledge(pageId) {
  const id = String(pageId || 'hub').toLowerCase()
  const hall = HALLS[id] || HALLS.hub
  return {
    pageId: HALLS[id] ? id : 'hub',
    ...hall,
    schedule: SCHEDULE_BLURB,
    empire:
      'Valhalla is the umbrella. Each mosaic hall is a company domain (land/water/air/space × movement/habitation/energy/intelligence). Meridian is the materials layer beneath. Interest forms and Ask chat are non-binding.',
  }
}

export function buildKnowledgePrompt(pageId) {
  const k = getHallKnowledge(pageId)
  return [
    `You are the Ask assistant for ${k.name} (Valhalla hall page: ${k.pageId}).`,
    `Hero line: ${k.hero}`,
    `About: ${k.body}`,
    `Key points:\n- ${k.bullets.join('\n- ')}`,
    `Schedule: ${k.schedule}`,
    `Empire context: ${k.empire}`,
    'Rules:',
    '- Answer helpfully in 2–5 short sentences.',
    '- Never claim products are shipping, available to buy, funded, licensed, or bookable unless the knowledge pack says so.',
    '- Never invent prices, capacity, CO₂, ROI, flight times as proven, or that deeds for extraterrestrial territory are for sale on this site.',
    '- Interest lists, research status, partner inquiries, blueprint targets (including 5.8-hour rail, Venus 2035, Tuvalu), and concept work are OK to mention.',
    '- If the user needs a human (money, legal, sensitive personal data, explicit person request, or you are unsure), set needs_human true and say a Valhalla person will follow up in this thread.',
  ].join('\n')
}
