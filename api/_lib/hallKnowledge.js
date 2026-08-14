/**
 * Grounding pack for Ask-the-hall AI replies.
 * Keep claims conservative — research / waitlist / interest only.
 */

const HALLS = {
  hub: {
    name: 'Valhalla',
    hero: 'Civilization platform across twelve halls.',
    body: 'Valhalla coordinates twelve companies across land, water, air, and space for movement, habitation, energy, and intelligence. Public pages are research and interest surfaces, not checkout or shipping claims.',
    bullets: [
      'Twelve halls unlock on the launch schedule (Pacific time)',
      'Ask widgets reach the Valhalla team',
      'No false “shipping now” or funded reservation claims on this surface',
    ],
  },
  wolf: {
    name: 'Wolf',
    hero: 'Ride the frontier. Research the route.',
    body: 'Wolf Transit is a land-mobility arch: Fenrir motorcycle, Hati ATV, Sköll car, Geri truck, Freki rescue air, and Dire Wolf rail. Transparent research, not checkout.',
    bullets: [
      'Fenrir 01 target January 13, 2027 (research cadence, not a guaranteed ship date)',
      'Dealer and OEM inquiry routing',
      'Dire Wolf phased railroad concept, network target August 13, 2031',
    ],
  },
  viking: {
    name: 'Viking',
    hero: 'Board as yourself. Disembark as Ragnar.',
    body: 'Viking is a narrative voyage concept. Tickets and environmental performance claims stay off until licensed operators exist.',
    bullets: ['Voyage concept pages', 'Guest interest registry', 'Charter / operator partner inquiry'],
  },
  eagle: {
    name: 'Eagle',
    hero: 'Aviation research. Not a timetable.',
    body: 'Eagle hosts aviation innovation research and partner/route opportunity CRM. No flight service claims on this surface.',
    bullets: ['Research overview', 'Traveler interest waitlist', 'Operator / airport partner inquiry'],
  },
  phenix: {
    name: 'Phenix',
    hero: 'Missions in concept mode.',
    body: 'Phenix tracks launch-vehicle documentation and mission requirements. No launch booking or payload acceptance here.',
    bullets: ['Mission concept overview', 'Payload inquiry intake', 'Partner coordination (controlled)'],
  },
  holm: {
    name: 'Holm',
    hero: 'Twelve modules. One home, when the site allows it.',
    body: 'Holm is a modular habitation concept. This MVP is a configurator sketch and feasibility intake, not stamped plans or a construction contract.',
    bullets: ['Module concept explorer', 'Site feasibility checklist', 'Buyer and partner lead capture'],
  },
  atoll: {
    name: 'Atoll',
    hero: 'Atoll 01 · 02 · 03',
    body: 'Floating modular habitats under controlled interest. No fund collection on this surface.',
    bullets: ['Concept catalogue', 'Site-fit questionnaire', 'Partner pipeline intake'],
  },
  olympus: {
    name: 'Olympus',
    hero: 'Cloud cities as research problems.',
    body: 'Olympus maintains a systems-requirements library for upper-atmosphere habitat concepts. Habitability timelines are not promised.',
    bullets: ['Source-linked research library', 'Requirements and hazard framing', 'Conceptual partner intake'],
  },
  aether: {
    name: 'Aether',
    hero: 'Space habitation, legally disclosed.',
    body: 'Aether is a research registry for orbital stations. It does not sell or imply ownership of extraterrestrial territory.',
    bullets: ['Station / habitat concept pages', 'Legal-status disclosures', 'Partner interest portal'],
  },
  demeter: {
    name: 'Demeter',
    hero: 'Land energy, diligence first.',
    body: 'Demeter tracks energy-project origination. Public surface is research status only.',
    bullets: [
      'Technology pathway overview (assumption-labeled)',
      'Partner / landowner inquiry',
      'No capacity, CO₂, or ROI claims without reviewed methodology',
    ],
  },
  njord: {
    name: 'Njord',
    hero: 'The water substrate.',
    body: 'Njord maps OTEC, atmospheric water, and maritime power research. Never water-quality or energy-output promises on public pages.',
    bullets: ['Technology research register', 'Site / partner intake', 'Scenario library with assumption disclosures'],
  },
  aeolus: {
    name: 'Aeolus',
    hero: 'Atmosphere research with a risk register.',
    body: 'Aeolus is a climate-atmosphere research governance workspace. Vision language is not ownership or deployment authority.',
    bullets: ['Research registry overview', 'Hypothesis provenance framing', 'Stakeholder / ethics review intake'],
  },
  corvus: {
    name: 'Corvus',
    hero: 'Odin, think locally.',
    body: 'Corvus ships Odin: a local-first founder workspace. Sovereign infrastructure and orbital claims stay off until demonstrated.',
    bullets: [
      'Local workspace preview',
      'Projects · docs · tasks · decisions',
      'Raven OS phased prompts; Prompt 21 unlocks the Twenty-First Raven badge',
    ],
  },
}

const SCHEDULE_BLURB =
  'Launch day schedule (Pacific): Wave 1 halls unlock in chain from morning (Wolf → Holm → Demeter → Viking → Atoll → Njord). Wave 2 starts 2:00 PM PDT (Eagle → Olympus → Aeolus → Phenix → Aether → Corvus). Mosaic tiles become clickable on that schedule; there are no public unlock codes.'

export function getHallKnowledge(pageId) {
  const id = String(pageId || 'hub').toLowerCase()
  const hall = HALLS[id] || HALLS.hub
  return {
    pageId: HALLS[id] ? id : 'hub',
    ...hall,
    schedule: SCHEDULE_BLURB,
    empire:
      'Valhalla is the umbrella. Each hall is a company domain (land/water/air/space × movement/habitation/energy/intelligence). Interest forms and Ask chat are non-binding.',
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
    '- Never invent prices, capacity, CO₂, ROI, flight times, or legal ownership of territory.',
    '- Interest lists, research status, partner inquiries, and concept work are OK to mention.',
    '- If the user needs a human (money, legal, sensitive personal data, explicit person request, or you are unsure), set needs_human true and say a Valhalla person will follow up in this thread.',
  ].join('\n')
}
