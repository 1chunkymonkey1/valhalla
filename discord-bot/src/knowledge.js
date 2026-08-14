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
      'Valhalla is a civilization platform of 12 mosaic companies across land, water, air, and space — movement, habitation, energy, and intelligence — with Meridian as the materials layer beneath.',
  },
  companies: [
    { id: 'wolf', domain: 'Land', pillar: 'Movement', blurb: 'Wolf Transit matrix — Fenrir motorcycle (Jan 13, 2027), then Hati/Sköll/Geri/Freki; Dire Wolf railroad SF→NY aiming 5.8 hours by Aug 13, 2031.' },
    { id: 'holm', domain: 'Land', pillar: 'Habitation', blurb: 'Twelve linkable modules: timber, sod, or adobe by terrain.' },
    { id: 'demeter', domain: 'Land', pillar: 'Energy', blurb: 'California-first land energy: agrivoltaics, geothermal, wind, green hydrogen, SMR, 75-year Dyson roadmap.' },
    { id: 'viking', domain: 'Water', pillar: 'Movement', blurb: 'Vinland Saga narrative voyages. Board as yourself; disembark as Ragnar.' },
    { id: 'atoll', domain: 'Water', pillar: 'Habitation', blurb: 'Atoll 01 single family, 02 twelve families, 03 municipal. First delivery target: Tuvalu.' },
    { id: 'njord', domain: 'Water', pillar: 'Energy', blurb: 'Full water energy layer: clean, reuse, split, manufacture, atmospheric water, green hydrogen.' },
    { id: 'eagle', domain: 'Air', pillar: 'Movement', blurb: 'Clean aviation with SAF and electric propulsion; talks toward Spirit Airlines. Not tickets.' },
    { id: 'olympus', domain: 'Air', pillar: 'Habitation', blurb: 'Pressurized cloud cities; Venus 50 km / 2035 north star.' },
    { id: 'aeolus', domain: 'Air', pillar: 'Energy', blurb: 'Atmospheric OS that intends to own the atmospheric substrate: climate, oxygen for habitats, radiation protection. No atmospheric-rights sales on the public site.' },
    { id: 'phenix', domain: 'Space', pillar: 'Movement', blurb: 'Hawk Mark 1, Bifröst lunar south-pole base camp, Zeus Venus cloud city by 2035.' },
    { id: 'aether', domain: 'Space', pillar: 'Habitation', blurb: 'Claims and real estate beyond Earth. Phenix marks the territory; Aether claims it.' },
    { id: 'corvus', domain: 'Space', pillar: 'Intelligence', blurb: 'Sovereign AI compute. Raven OS substrate; Odin consumer product. Prompt 21 badge.' },
    { id: 'meridian', domain: 'Materials', pillar: 'Materials', blurb: 'Materials layer: Earth garment (Sept 2026 research), Venus Suit, Stealth Armor.' },
  ],
  reservations:
    'Most halls collect fully refundable reservation holds when Pay Links are live. Wolf is email-list only for now. No non-refundable deposit is forced on the public pages.',
  roadmapCaveats:
    'Roadmaps fade into mystery. Wolf uses a product-line × model matrix. Theoretical products are email-capture only. Mystery cells are intentionally unexplained. Do not invent operational claims beyond published target windows.',
  bifrost:
    'Bifröst is Phenix’s lunar south-pole base camp. Dire Wolf is Wolf’s SF→NY railroad (5.8-hour network target). They are different programs.',
  direWolf:
    'Dire Wolf is Wolf Transit’s San Francisco to New York railroad program aiming for a 5.8-hour crossing: Phase I west from late 2027, Phase II central through 2029, Phase III east through 2030, network target August 13, 2031. Blueprint-honest — permits and partners first.',
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
      'Twelve halls in a 4×3 mosaic: Land (Wolf, Holm, Demeter), Water (Viking, Atoll, Njord), Air (Eagle, Olympus, Aeolus), Space (Phenix, Aether, Corvus). Rows are Movement, Habitation, Energy / Intelligence. Meridian materials sits beneath at /meridian.'
    )
  }

  return (
    'I can talk about the twelve mosaic halls, Meridian materials, refundable reservations, Raven OS, Dire Wolf (SF→NY 5.8 hours), Bifröst lunar base, and roadmap caveats. Ask about a hall by name, or visit valhallaco.org. I will not invent operational claims.'
  )
}
