/**
 * Fundraising hub catalog for /investors (unlocked view).
 * Assets live in public/investors/ — copied from Desktop valhalla_fundraising.
 * Blueprint-honest: no fabricated MRR or closed terms.
 */

export const FUNDRAISING_PITCH_PDF = '/investors/Valhalla-Pitch-Deck.pdf'
export const FUNDRAISING_DECK_HTML = '/investors/deck.html'
export const FUNDRAISING_APPLICATION = '/investors/APPLICATION.md'
export const FUNDRAISING_LEADS = '/investors/leads.md'
export const FUNDRAISING_COMPANY_ZIP = '/investors/company-decks.zip'

/** Business model excerpt (honest; MRR $0). */
export const BUSINESS_MODEL = `Valhalla creates value as a holdco + 12 specialized companies (“halls”) across Land, Water, Air, and Space (Meridian materials optional beneath). Today: public mosaic, interest/email lists, and research/partner queues per hall — no fabricated revenue (MRR $0). Future capture: products and services as each hall reaches readiness (mobility, habitation, energy/water, clean aviation, atmosphere systems, space transport, claims/habitation platforms, sovereign compute), with cross-hall demand so each company feeds the other eleven. We do not claim deed sales, booked flights, or capacity/ROI figures that are not diligence-ready.`

export const ELEVATOR_PITCH =
  'Valhalla builds 12 companies across Land, Water, Air, and Space solving transit, housing, energy, water, clean aviation, atmosphere, space transport, claims, and sovereign compute—as one civilization system. Everyone is a king. Kings don’t wait for the throne; they build it. valhallaco.org'

/** Reveal-order halls with dedicated decks + lead seats. */
export const COMPANY_DECKS = [
  { id: 'wolf', name: 'Wolf', domain: 'Land', pillar: 'Movement' },
  { id: 'holm', name: 'Holm', domain: 'Land', pillar: 'Habitation' },
  { id: 'demeter', name: 'Demeter', domain: 'Land', pillar: 'Energy' },
  { id: 'viking', name: 'Viking', domain: 'Water', pillar: 'Movement' },
  { id: 'atoll', name: 'Atoll', domain: 'Water', pillar: 'Habitation' },
  { id: 'njord', name: 'Njord', domain: 'Water', pillar: 'Energy' },
  { id: 'eagle', name: 'Eagle', domain: 'Air', pillar: 'Movement' },
  { id: 'olympus', name: 'Olympus', domain: 'Air', pillar: 'Habitation' },
  { id: 'aeolus', name: 'Aeolus', domain: 'Air', pillar: 'Energy' },
  { id: 'phenix', name: 'Phenix', domain: 'Space', pillar: 'Movement' },
  { id: 'aether', name: 'Aether', domain: 'Space', pillar: 'Habitation' },
  { id: 'corvus', name: 'Corvus', domain: 'Space', pillar: 'Intelligence' },
].map((c) => ({
  ...c,
  pdf: `/investors/company-decks/${c.id}.pdf`,
  html: `/investors/company-decks/${c.id}.html`,
}))
