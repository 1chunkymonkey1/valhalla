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
      'Valhalla holds twelve halls across Land, Water, Air, and Space. Each hall holds a human problem and ties into the other eleven. Meridian is materials beneath. Everyone is a king: kings don’t wait for the throne; they build it.',
  },
  companies: [
    { id: 'wolf', domain: 'Land', pillar: 'Movement', blurb: 'Land transit: Fenrir electric motorcycle, tri-fuel ATV, pack through Dire Wolf maglev SF→NYC in 5.8 hours. Clean and fixable.' },
    { id: 'holm', domain: 'Land', pillar: 'Habitation', blurb: 'Buyers become builders: courses, financing, sod/log/adobe, twelve interlocking container Holms.' },
    { id: 'demeter', domain: 'Land', pillar: 'Energy', blurb: 'Energy production: agrivoltaics (2% US farms by Q4 2027 goal), SMR, geothermal, Stirling, wind; 75-year Dyson swarm.' },
    { id: 'viking', domain: 'Water', pillar: 'Movement', blurb: 'Sustainable cruises; SMR + sail; Stockholm→London; Phénix pad + moon leg. Board as yourself; disembark as Ragnar or Leif.' },
    { id: 'atoll', domain: 'Water', pillar: 'Habitation', blurb: 'Surface/subsurface habitation for sea-level displacement by 2040. Atoll 01/02/03 + Atlantis line.' },
    { id: 'njord', domain: 'Water', pillar: 'Energy', blurb: 'Owns H₂O substrate: clean, recycle, develop, split, transport. Earth scarcity first.' },
    { id: 'eagle', domain: 'Air', pillar: 'Movement', blurb: 'Clean air travel; bird-named jets; active carbon removal. More you fly, better for atmosphere.' },
    { id: 'olympus', domain: 'Air', pillar: 'Habitation', blurb: 'Cloud cities; Eagle in, Njord water. Olympus Mons first cloud city targets 2028.' },
    { id: 'aeolus', domain: 'Air', pillar: 'Energy', blurb: 'Owns substrate gas; climate by 2031; Venus acid shielding. No atmospheric-rights sales on the public site.' },
    { id: 'phenix', domain: 'Space', pillar: 'Movement', blurb: 'Space transport: Moon, Venus/Mars, Rollo (Alpha Centauri B), O’Neill spheres. Hawk Mark 1/02.' },
    { id: 'aether', domain: 'Space', pillar: 'Habitation', blurb: 'Galactic real estate claims; Hawk Mark 02 plants flags. Phénix marks; Aether claims.' },
    { id: 'corvus', domain: 'Space', pillar: 'Intelligence', blurb: 'Sovereign solar computers, space data centers, Raven OS for the empire. Prompt waitlist.' },
    { id: 'meridian', domain: 'Materials', pillar: 'Materials', blurb: 'Materials layer: Earth garment, Venus Suit, merch for every hall. List, not a cart.' },
  ],
  reservations:
    'Halls gather email interest on the public site. Do not invent deposit or checkout claims.',
  roadmapCaveats:
    'Roadmaps fade into mystery. Wolf uses a product-line × model matrix. Do not invent operational claims beyond published target windows.',
  bifrost:
    'Bifröst is Phénix’s lunar south-pole base camp. Dire Wolf is Wolf’s SF→NYC maglev (5.8-hour network target). They are different programs.',
  direWolf:
    'Dire Wolf is Wolf Transit’s San Francisco to New York maglev program aiming for a 5.8-hour crossing, completed in segments by August 13, 2031. By then the pack has assembled. Blueprint-honest — permits and partners first.',
  admin:
    'Public admin is at /admin and accepts only info@valhallaco.org after serverless auth. Never share passwords in Discord.',
}

export function answerQuestion(text) {
  const q = text.toLowerCase()

  if (/who (are|is) (you|odin)|what (is|are) (valhalla|you)/.test(q)) {
    return `${knowledge.identity.summary} I’m Odin — Q&A and moderation for the halls. Site: ${knowledge.identity.domain}`
  }

  if (/bifrost|bifröst/.test(q)) {
    return knowledge.bifrost
  }

  if (/dire.?wolf|maglev|sf.?nyc|5\.8|coast.?to.?coast|railroad|rail/.test(q)) {
    return knowledge.direWolf
  }

  if (/tuvalu|vinland|hawk.?mark|zeus|venus|spirit|saf|geothermal|smr|dyson|meridian/.test(q)) {
    const hit = knowledge.companies.find((c) => {
      if (/tuvalu|atoll/.test(q)) return c.id === 'atoll'
      if (/vinland|viking/.test(q)) return c.id === 'viking'
      if (/hawk|zeus|phenix/.test(q)) return c.id === 'phenix'
      if (/venus|olympus/.test(q) && !/suit/.test(q)) return c.id === 'olympus'
      if (/spirit|saf|eagle/.test(q)) return c.id === 'eagle'
      if (/geothermal|smr|dyson|demeter/.test(q)) return c.id === 'demeter'
      if (/meridian|garment|armor/.test(q)) return c.id === 'meridian'
      return false
    })
    if (hit) {
      return `${hit.id[0].toUpperCase()}${hit.id.slice(1)} — ${hit.domain} · ${hit.pillar}. ${hit.blurb}`
    }
  }

  if (/refund|reserv|pay.?link|deposit|squarespace/.test(q)) {
    return knowledge.reservations
  }

  if (/roadmap|mystery|theoretical|fenrir|hati|sköll|skoll|geri|freki|wolf.?matrix|product.?path/.test(q)) {
    return knowledge.roadmapCaveats
  }

  if (/corvus|raven.?os|prompt|badge|21000|\$21/.test(q)) {
    return 'Corvus is sovereign AI compute. Raven OS is the substrate; Odin is the founder consumer product. Phased prompts remain the access path: Prompt 1 $100 through Prompt 21 at $21,000 which unlocks the Twenty-First Raven community badge. Holds are fully refundable when Pay Links are live.'
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
      'Twelve halls in a 4×3 mosaic: Land (Wolf, Holm, Demeter), Water (Viking, Atoll, Njord), Air (Eagle, Olympus, Aeolus), Space (Phénix, Aether, Corvus). Rows are Movement, Habitation, Energy / Intelligence. Meridian materials sits beneath at /meridian.'
    )
  }

  return (
    'I can talk about the twelve mosaic halls, Meridian materials, refundable reservations, Raven OS, Dire Wolf (SF→NY 5.8 hours), Bifröst lunar base, and roadmap caveats. Ask about a hall by name, or visit valhallaco.org. I will not invent operational claims.'
  )
}
