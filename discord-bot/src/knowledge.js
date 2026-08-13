/**
 * Curated Valhalla knowledge for Odin.
 * Keep claims conservative — no false operational readiness.
 */

export const knowledge = {
  identity: {
    org: 'Valhalla',
    domain: 'valhallaco.org',
    email: 'info@valhallaco.org',
    discord: 'https://discord.gg/JA6wrNg6n',
    summary:
      'Valhalla is a civilization platform of 12 companies across land, water, air, and space — movement, habitation, and energy.',
  },
  companies: [
    { id: 'wolf', domain: 'Land', pillar: 'Movement', blurb: 'Adventure mobility; Fenrir motorcycle path; Bifröst Line maglev vision.' },
    { id: 'holm', domain: 'Land', pillar: 'Habitation', blurb: 'Modular homes.' },
    { id: 'demeter', domain: 'Land', pillar: 'Energy', blurb: 'Agrivoltaic / land-energy diligence.' },
    { id: 'viking', domain: 'Water', pillar: 'Movement', blurb: 'Story-led northern voyages.' },
    { id: 'atoll', domain: 'Water', pillar: 'Habitation', blurb: 'Floating modular habitats.' },
    { id: 'njord', domain: 'Water', pillar: 'Energy', blurb: 'Water systems research (OTEC, atmospheric water).' },
    { id: 'eagle', domain: 'Air', pillar: 'Movement', blurb: 'Aviation access interest — not tickets.' },
    { id: 'olympus', domain: 'Air', pillar: 'Habitation', blurb: 'Upper-atmosphere habitation research.' },
    { id: 'aeolus', domain: 'Air', pillar: 'Energy', blurb: 'Climate-atmosphere research governance.' },
    { id: 'phenix', domain: 'Space', pillar: 'Movement', blurb: 'Mission-concept workspace — not launch booking.' },
    { id: 'aether', domain: 'Space', pillar: 'Habitation', blurb: 'Space habitation concepts with legal status disclosed.' },
    { id: 'corvus', domain: 'Space', pillar: 'Energy', blurb: 'Raven OS — 21 prompts; Prompt 21 is $21,000 + community badge.' },
  ],
  reservations:
    'Company sites collect fully refundable reservation holds. Squarespace Pay Links are configured per product when live. No non-refundable deposit is forced on the public pages.',
  roadmapCaveats:
    'Roadmaps fade into mystery. Theoretical products are email-capture only. Mystery ovals are intentionally unexplained. Do not invent ship dates or operational claims.',
  bifrost:
    'Wolf’s second-to-last roadmap vision is the Bifröst Line: a five-year SF→NYC maglev ambition targeting about 5.8 hours. It is a vision with objectives — not an operating railroad.',
  admin:
    'Public admin is at /admin and accepts only info@valhallaco.org after serverless auth. Never share passwords in Discord.',
}

export function answerQuestion(text) {
  const q = text.toLowerCase()

  if (/who (are|is) (you|odin)|what (is|are) (valhalla|you)/.test(q)) {
    return `${knowledge.identity.summary} I’m Odin — Q&A and moderation for the halls. Site: ${knowledge.identity.domain}`
  }

  if (/bifrost|bifröst|maglev|sf.?nyc|coast.?to.?coast/.test(q)) {
    return knowledge.bifrost
  }

  if (/refund|reserv|pay.?link|deposit|squarespace/.test(q)) {
    return knowledge.reservations
  }

  if (/roadmap|mystery|theoretical|fenrir|hati/.test(q)) {
    return knowledge.roadmapCaveats
  }

  if (/corvus|raven.?os|prompt|badge|21000|\$21/.test(q)) {
    return 'Corvus Raven OS sells 21 prompts with phase pricing: Prompt 1 $100, 2 $200, 3 $300, then steeper phases through Prompt 21 at $21,000 which unlocks the Twenty-First Raven community badge. Holds are fully refundable when Pay Links are live.'
  }

  if (/discord|invite|community/.test(q)) {
    return `Community invite: ${knowledge.identity.discord}`
  }

  if (/email|contact|press/.test(q)) {
    return `Contact ${knowledge.identity.email}. Press lives at /press on the site.`
  }

  if (/password|admin login|credentials/.test(q)) {
    return 'I will never share admin credentials. Use the site admin gate if you are authorized.'
  }

  const hit = knowledge.companies.find((c) => q.includes(c.id) || q.includes(c.id.replace('-', ' ')))
  if (hit) {
    return `${hit.id[0].toUpperCase()}${hit.id.slice(1)} — ${hit.domain} · ${hit.pillar}. ${hit.blurb} Open /${hit.id} on the hub when that hall is unlocked.`
  }

  if (/12 compan|halls|mosaic|domains|land|water|air|space/.test(q)) {
    return (
      'Twelve halls in a 4×3 mosaic: Land (Wolf, Holm, Demeter), Water (Viking, Atoll, Njord), Air (Eagle, Olympus, Aeolus), Space (Phenix, Aether, Corvus). Rows are Movement, Habitation, Energy.'
    )
  }

  return (
    'I can talk about the twelve companies, refundable reservations, Raven OS pricing, Bifröst Line vision, and roadmap caveats. Ask about a hall by name, or visit valhallaco.org. I will not invent operational claims.'
  )
}
