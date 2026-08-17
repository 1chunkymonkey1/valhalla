export const TABS = [
  { id: 'founder', label: 'Founder' },
  { id: 'viable', label: 'Viable' },
  { id: 'code', label: 'Code path' },
  { id: 'forge', label: 'Forge' },
  { id: 'atlas', label: 'Atlas' },
  { id: 'capital', label: 'Capital' },
  { id: 'money', label: 'Unit economics' },
  { id: 'risk', label: 'Risk' },
  { id: 'plan', label: '90 days' },
  { id: 'install', label: 'Install' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'outreach', label: 'Outreach' },
  { id: 'log', label: 'Night log' },
]

/** Only Eason (or Chris, where named) can close these. Agent cannot. */
export const founderTodos = [
  {
    id: 'e-entity',
    owner: 'Eason + Chris',
    need: 'You',
    title: 'Form the company',
    why: 'NSF, bank, UL, and insurance all require an EIN. Pitching without an entity wastes the conversation.',
    do: 'Delaware C-corp (or CA C-corp if you want simplicity). File, get EIN, open a bank account, founder IP assignment from both of you. Do not skip the IP assignment.',
  },
  {
    id: 'e-psi',
    owner: 'Eason',
    need: 'You',
    title: 'Measure the Sierra house',
    why: 'Notes asked min PSI. The number that matters is YOUR static pressure at the hose bibb and at an interior fixture, not a blog average.',
    do: 'Buy a $12 hose-bibb gauge. Photograph static PSI at the outdoor bibb, then one sink. Write both numbers here. Typical CA homes sit 40–60 PSI at the tap.',
  },
  {
    id: 'e-chiefs',
    owner: 'Eason',
    need: 'You',
    title: 'Talk to fire captains — feedback, not sign-off',
    why: 'A captain cannot certify a product. Asking them to “sign off” is how you get politely ejected. Ask what kills firefighters and what they will not trust.',
    do: 'Three conversations: one Sierra/El Dorado or Placer, one LA County or LAFD, one wildland (CAL FIRE unit). Script is in Outreach. Record objections verbatim.',
  },
  {
    id: 'e-fpe',
    owner: 'Eason',
    need: 'You',
    title: 'Retain a licensed fire protection engineer',
    why: 'AHJ packages without an FPE stamp are hobbies. Automist ships a full AHJ submission. We will not.',
    do: 'Find a CA FPE who has done NFPA 13D or NFPA 750 residential. Pay for a scoping call. Do not ask them to invent the product.',
  },
  {
    id: 'e-chris',
    owner: 'Eason',
    need: 'You',
    title: 'Walk Chris through this desk',
    why: 'Split-brain founders stall hardware. He owns LA; you own Sierra. Both must agree Sentinel is Model One and Atlas is not the raise.',
    do: 'Share Kenaz. Agree: no public “any situation.” No “we’re with the government.”',
  },
  {
    id: 'e-nsf',
    owner: 'Eason',
    need: 'You',
    title: 'SAM.gov + NSF Project Pitch',
    why: 'NSF 26-510 Phase I is up to $305k, no equity. The 27 Jul 2026 full-proposal deadline is already past. Next is 4 Nov 2026. Pitches are rolling; NSF says a response typically takes 1–2 months. Two pitches per company per 12 months. Do not invent eligibility.',
    do: 'Incorporate first. Do not submit the pitch as if Prometheus Defense already exists. Pitch does not require SAM.gov; a full proposal does (SAM UEI, Research.gov, SBA Company Registry). PI must be >50% employed by the small business for the duration of the award — NSF treats other employment above 19.6 hours/week as conflicting. Student status may collide with that. Paste-ready fields are in Capital. You submit. Agent cannot.',
  },
  {
    id: 'e-broker',
    owner: 'Eason',
    need: 'You',
    title: 'Product-liability conversation (do not buy yet)',
    why: 'A suppression product that can flood a house is uninsurable as a gadget. Brokers will tell you the listing you actually need.',
    do: 'One call with a surplus-lines broker who has done fire equipment. Ask what they refuse to write without UL.',
  },
  {
    id: 'e-mule',
    owner: 'Eason',
    need: 'You',
    title: 'Authorize the garden-hose mule',
    why: 'A hose mule is a lab. It is not Sentinel. Confusing the two in a pitch is fatal.',
    do: 'Yes/no on the Forge cart (~$800–850, vendor URLs verified 17 Aug 2026). If yes, buy it. Do not connect the mule to interior potable plumbing. Do not leave it armed unattended.',
  },
  {
    id: 'e-utah',
    owner: 'Eason',
    need: 'You',
    title: 'Do not lead with Utah Fire Marshal',
    why: 'Your notes said “we’re with the government, convince a.” That sentence never leaves this hall. Utah is one AHJ. The market is CA WUI.',
    do: 'If you have a personal Utah contact, use it as a technical review. Do not claim government affiliation.',
  },
  {
    id: 'e-atlas-language',
    owner: 'Eason',
    need: 'You',
    title: 'Approve Atlas public language',
    why: '“Saves lives in any situation” is a lawsuit and a fire-chief walk-out. Vision stays. Claim does not.',
    do: 'Keep: Atlas is line three, humanoid extraction research. Kill: any situation, 1,100 °C sustained, replace firefighters.',
  },
]

export const viability = [
  {
    id: '01',
    name: 'Legal entity + IP',
    status: 'Blocked on you',
    note: 'C-corp, EIN, founder assignment, 83(b) if stock. Without this, grants and UL applications bounce.',
  },
  {
    id: '02',
    name: 'One product',
    status: 'Sentinel only',
    note: 'Centry was the working name. Public name is Sentinel. Titan is a Cushman mule then a tracked platform. Atlas is research. Raise on one SKU.',
  },
  {
    id: '03',
    name: 'Listing path',
    status: 'UL 2167A / NFPA 750',
    note: 'Wall-mounted targeted water mist already has a UL outline (Jul 2024). Plumis Automist is listed (EX29276). Copy their AHJ package shape, not their spray.',
  },
  {
    id: '04',
    name: 'AHJ, not “the fire code”',
    status: 'Years, not a weekend',
    note: 'ICC/IFC adoption is a 5–10 year campaign. Near-term: IFC 904.11 listed systems, or 104.11 alternative methods, county by county. Getting “into fire code” is not a Q1 task.',
  },
  {
    id: '05',
    name: 'Insurance writeable',
    status: 'Needs listing + logs',
    note: 'CA Safer from Wildfires / AB 888 pays for roofs and Zone Zero, not gadgets. Carriers want listed equipment and evidence. Do not promise premium cuts.',
  },
  {
    id: '06',
    name: 'Liability',
    status: 'Existential',
    note: 'False discharge and failed discharge are both claims. Dual-sensor confirm before valve. Fail-safe = no water, plus a loud fault — never silent.',
  },
  {
    id: '07',
    name: 'Team',
    status: 'Two founders, no FPE',
    note: 'Need: FPE (contract), EE/firmware, mechanical for the pump/nozzle, and later a licensed installer channel. You two cannot UL-list a suppression system alone.',
  },
  {
    id: '08',
    name: 'Manufacturing',
    status: 'Not yet',
    note: 'First 10 units are built by you. Contract manufacturer only after listing plan exists. No China-only thermal if you want NDAA-friendly FLIR Lepton.',
  },
  {
    id: '09',
    name: 'Capital',
    status: 'Non-dilutive first',
    note: 'NSF SBIR pitch now. Friends/family after mule video. Seed after UL engagement letter. Do not raise a humanoid round.',
  },
  {
    id: '10',
    name: 'Distribution',
    status: 'Founder-sold',
    note: 'WUI homeowners and HOAs. Not Home Depot. Not a consumer app. Licensed installer later.',
  },
]

export const codePath = [
  {
    title: 'NFPA 13D — residential sprinklers',
    fact: 'Minimum operating pressure at any listed head is 7 psi. That is a floor, not a design target. Source pressure for a house is typically 40–100+ psi after elevation and friction.',
    forUs: 'Sentinel is not a 13D sprinkler. Do not tell an AHJ it “meets 13D.” If we ever claim equivalence, an FPE writes it.',
  },
  {
    title: 'Are sprinklers localized?',
    fact: 'Yes. A fusible head opens only itself. Hydraulic design assumes 1–2 heads in 13D, up to 4 in 13/13R. The rest of the house does not flood from one head.',
    forUs: 'Zone isolation is our product story, but 13D already zones by physics. Our edge is detection-before-flame and directed spray, not “we invented zones.”',
  },
  {
    title: 'Garden hose',
    fact: 'A hose has no PSI of its own. It carries household pressure, usually 40–60 psi, sometimes to 80. Long hose and small ID kill flow, not just pressure.',
    forUs: 'Hose bibb mule is allowed in the garage. Production Sentinel ties into potable plumbing with a listed valve, backflow, and a pump — same class as Automist, not a hose robot.',
  },
  {
    title: 'UL 2167A',
    fact: 'Outline of Investigation for targeting water-mist units in 1–2 family dwellings (8 Jul 2024). Wall-mounted, normally unpressurized. Explicitly not a substitute for a household fire alarm.',
    forUs: 'This is the listing we aim at. Buy the outline. Budget real UL money (tens to low hundreds of thousands, not a Kickstarter).',
  },
  {
    title: 'NFPA 750 + IFC 904.11',
    fact: 'Listed water mist installs to 750 and the manufacturer DIOM. Some AHJs take 904.11 as prescriptive; others demand a 104.11 alternative-methods package.',
    forUs: 'First CA counties: El Dorado, Placer, LA County. Not Utah unless you have a named relationship.',
  },
  {
    title: 'UL 217 smoke alarms',
    fact: 'Household smoke alarms are a separate listing. UL 2167A says mist units do not replace the fire alarm.',
    forUs: 'Do not launch an “own brand of smoke detector.” Interconnect with listed alarms. Localized signal = our thermal + their smoke, not a new detector SKU.',
  },
  {
    title: 'Utah Fire Marshal',
    fact: 'firemarshal.utah.gov is a legitimate AHJ site. It is not a go-to-market.',
    forUs: 'CA WUI is the beachhead. Government-affiliation language is forbidden in every draft.',
  },
]

export const forge = {
  cameras: [
    {
      name: 'FLIR Lepton 3.5',
      spec: '160×120 radiometric, 57° HFOV, <50 mK, ~150 mW, MSRP $172, NDAA, ITAR-free, 8.6 Hz exportable.',
      use: 'Model One sensor. Dual units or Lepton 3.1R 95° if we must fake 180° with two boards. True 180° is a lens + two modules, not marketing.',
    },
    {
      name: 'FLIR Lepton 3.1R',
      spec: '160×120, 95° HFOV, radiometric, ~$149.',
      use: 'Wide hallways. Pair with 3.5 on the nozzle axis.',
    },
    {
      name: 'Visible 5 MP',
      spec: 'Cheap OV5647 / Pi cam. Lepton XDS bundles thermal+visible if we pay.',
      use: 'False-alarm rejection (stove vs structure) and post-event evidence for insurers.',
    },
  ],
  power: [
    {
      q: 'Battery or wired?',
      a: 'Wired primary. Battery backup sized for PSPS / outage — fires do not wait for grid. AA cells are for a sensor coin-cell experiment, not the pump.',
    },
    {
      q: 'Two AAs double as?',
      a: 'They do not. A solenoid + pump wants 12–24 V and amps. Keep 2×AA only if we add a wireless heat puck later. Do not design Model One around them.',
    },
  ],
  muleBom: [
    { item: 'Raspberry Pi 5 8GB + 27W PSU', est: 90 },
    { item: 'FLIR Lepton 3.5 + breakout (PureThermal or equivalent)', est: 280 },
    { item: 'Pi Camera Module 3', est: 25 },
    { item: '12V diaphragm pump (low-GPM, not 2800 PSI)', est: 60 },
    { item: '12V solenoid + check valve + 3/4" fittings', est: 45 },
    { item: 'SLA or LiFePO4 12V 7–12Ah + charger', est: 70 },
    { item: 'Hose-bibb gauge + 25 ft 3/4" hose', est: 35 },
    { item: 'IP65 enclosure, gland, silicone', est: 40 },
    { item: 'Relay HAT / MOSFET, wiring, fuse', est: 30 },
    { item: 'Misc (SD, standoffs, labels)', est: 25 },
  ],
  cushman: {
    fact: 'Cushman Titan HD/XD is a 14 mph electric burden carrier. Payload ~2,500–3,000 lb. Custom Solutions will put boxes and strobes on it. It is not a 40° wildland crawler.',
    use: 'Lab mule for Titan tank + pump + siren only. Production Titan needs tracks or a UTV with a real slope rating. Do not put “Cushman” on a pitch slide.',
  },
  states: [
    { id: 'boot', label: 'BOOT', detail: 'Self-test. Valve commanded closed. No water.' },
    { id: 'watch', label: 'WATCH', detail: 'Thermal + visible streaming. Heartbeat to log.' },
    { id: 'suspect', label: 'SUSPECT', detail: 'Single cue (heat rise or smoke interconnect). Timer starts. Valve still closed.' },
    { id: 'confirm', label: 'CONFIRM', detail: 'Second cue or radiometric threshold. Human abort window in lab; production may be sub-second.' },
    { id: 'suppress', label: 'SUPPRESS', detail: 'Only state that may energize the valve. Target <3 s from first confirmed cue.' },
    { id: 'hold', label: 'HOLD', detail: 'Spray complete or aborted. Watch for reheat. Log duration and volume estimate.' },
    { id: 'fault', label: 'FAULT', detail: 'Sensor, pump, or leak. Loud local alarm. Valve closed.' },
    { id: 'lockout', label: 'LOCKOUT', detail: 'Needs a person. Not a reboot.' },
  ],
}

export const atlasDoctrine = {
  mission:
    'Atlas is the humanoid that goes into unsurvivable interiors so a firefighter does not have to. That is the line-three vision. It is not a 2026 product and it does not “save lives in any situation.”',
  forbidden: [
    'any situation',
    'replaces firefighters',
    '1,100 °C sustained (no humanoid on earth is listed for that)',
    'fully autonomous victim extraction this decade as a SKU',
  ],
  field: [
    {
      name: 'Hyundai / Korea NFA unmanned firefighter (2026)',
      vs: 'Six-wheel teleop vehicle, ~800 °C with self-spray, already donated to 119 units. Not a humanoid. This is the real agency buy.',
    },
    {
      name: 'Shark Robotics Colossus',
      vs: 'Tracked; Notre-Dame 2019. Agencies buy tracks, not bipeds, when the floor may collapse.',
    },
    {
      name: 'Boston Dynamics Atlas',
      vs: 'Electric humanoid for Hyundai factories. 2026 production is logistics, not fire. Same parent as Hyundai’s wheeled firefighter. Do not confuse the two in a sentence.',
    },
  ],
  stages: [
    {
      id: '0',
      name: 'Doctrine',
      when: 'Now',
      body: 'Write the oath: Atlas exists so that calculus is never asked of a person. No hardware.',
    },
    {
      id: '1',
      name: 'Titan as the body',
      when: 'After Sentinel mule',
      body: 'Put a hose, thermal, and teleop on a ground vehicle. Learn heat, water, radio, and incident command. Cushman is acceptable as a parking-lot mule only.',
    },
    {
      id: '2',
      name: 'Interior recon platform',
      when: 'Partner, do not build',
      body: 'Quadruped or existing UGV with thermal + two-way audio. Goal is search, not extraction. Buy or partner (Spot-class, Colossus-class).',
    },
    {
      id: '3',
      name: 'Manipulation',
      when: 'Research collaboration',
      body: 'Doors, BA delivery, drag a dummy. University or Hyundai/BD conversation — not a garage humanoid. Heat shielding is the actual invention if we have one.',
    },
    {
      id: '4',
      name: 'Humanoid firefighter',
      when: 'Only if 1–3 are real',
      body: 'Bipedal extraction is the north star. It is a decade-class, nine-figure problem if you mean it. Do not staff it before Sentinel is listed.',
    },
  ],
}

export const capital = [
  {
    name: 'NSF SBIR Phase I',
    amount: 'Up to $305k',
    timing: 'Pitch rolling; 27 Jul 2026 full-proposal window closed; next 4 Nov 2026, then 4 Mar and 7 Jul 2027',
    fit: 'Thermal+valve targeting, dual-cue FSM, water-mist for WUI dwellings. Deep tech, not an app.',
    catch: 'Needs small-business entity, SAM.gov, Project Pitch invitation. 10–20% historical hit rate.',
  },
  {
    name: 'NSF SBIR Phase II',
    amount: 'Up to $1.25M',
    timing: 'After Phase I',
    fit: 'UL engagement, DIOM, 10-home instrumented pilot.',
    catch: 'Only Phase I awardees.',
  },
  {
    name: 'CalSEED / CEC',
    amount: 'Concept ~$150k historically',
    timing: 'Watch next cycle',
    fit: 'CA climate hardware. Wildfire sensing alumni exist (Perch).',
    catch: 'March 2026 window may already be closed. Do not invent a deadline.',
  },
  {
    name: 'Friends / Sierra + LA',
    amount: '$50–150k',
    timing: 'After mule video',
    fit: 'Buy parts, FPE scoping, first enclosure.',
    catch: 'Only after you can show detect→spray on camera. Not on renders.',
  },
  {
    name: 'Climate / insurtech seed',
    amount: '$1–3M later',
    timing: 'Post UL kickoff',
    fit: 'Loss-prevention story.',
    catch: 'They will ask for Automist differentiation on slide 2.',
  },
  {
    name: 'FEMA AFG',
    amount: 'N/A to us',
    timing: 'Never as applicant',
    fit: 'Fire departments buy gear.',
    catch: 'Startups are not eligible. Do not write an AFG. Partner a department later.',
  },
  {
    name: 'AB 888 Safe Homes',
    amount: 'Homeowner grants',
    timing: 'Portal expected 2026',
    fit: 'Roofs, Zone Zero.',
    catch: 'Not a Sentinel subsidy. Do not tell customers the state will pay for us.',
  },
  {
    name: 'YC / SkyDeck / Activate',
    amount: 'Varies',
    timing: 'After mule',
    fit: 'Network, not the product.',
    catch: 'Hardware fire is a hard YC story. SkyDeck is closer to Berkeley.',
  },
]

/** NSF 26-510 Project Pitch fields. Limits from seedfund.nsf.gov/apply/project-pitch/ (characters, not words). */
export const nsfMeta = {
  solicitation: 'NSF 26-510',
  solicitationUrl:
    'https://www.nsf.gov/funding/opportunities/small-business-innovation-research-small-business-technology/nsf26-510/solicitation',
  pitchUrl: 'https://seedfund.nsf.gov/apply/project-pitch/',
  eligibilityUrl: 'https://seedfund.nsf.gov/solicitation-eligibility/',
  phaseI: 'Up to $305,000 for 6–18 months, inclusive of TABA, I-Corps, fee, and indirects. Funds availability applies.',
  deadlines:
    'Full proposals due 5 p.m. submitting-organization local time: 27 Jul 2026 (passed), 4 Nov 2026, 4 Mar 2027, 7 Jul 2027.',
  pitchRules:
    'Invitation required before a Phase I proposal. Invitation valid for the next two deadlines after the invitation date. Typically 1–2 months for a pitch decision. One pitch under review at a time. Two pitches per company per 12 months. Three pitches total for the same project. SAM.gov is not required to pitch; it is required to submit a full proposal.',
}

export const nsfGates = [
  'Do not submit until a U.S. for-profit small business exists. Do not type a company that is not incorporated.',
  'Do not claim we are eligible. NSF: <500 employees including affiliates; ≥51% owned by U.S. citizens or permanent residents (or by such small businesses); R&D in the U.S.; no majority VC/PE/hedge ownership.',
  'PI primary employment (>50% with the small business) is required at award, not at proposal submission. NSF treats other employment above 19.6 hours/week as conflicting. Eason’s student load has to be checked against that before you name a PI.',
  'Do not submit Fast-Track. Fast-Track needs NSF research lineage, customer discovery, and a complete team. We have none of those.',
  'Do not claim a hit rate. Do not claim NSF affiliation after a pitch, an invitation, or a decline.',
]

export const nsfFields = [
  {
    id: 'tech',
    title: 'The Technology Innovation',
    limit: 3500,
    body: `The technical uncertainty is not whether a solenoid can open a water circuit. Residential fire suppression already does that with fusible sprinkler heads under NFPA 13D, and with at least one listed targeting water-mist unit (UL 2167A Outline of Investigation, 8 July 2024; Plumis Automist, UL file EX29276). The unsolved problem is reliable, fail-closed confirmation of a residential fire from radiometric longwave infrared fused with a listed-smoke-alarm interconnect, fast enough to wet the seat before a fusible element operates, without flooding the house from cooking, sunlight, pets, or a single noisy sensor.

We propose research toward a wall-mounted, normally-unpressurized targeting water circuit for one- and two-family dwellings on the California wildland-urban interface. Dual FLIR Lepton-class radiometric modules (160x120, <50 mK NETD, 8.6 Hz exportable) watch a room. A visible camera is used only as a local false-alarm discriminator and is processed on-device. A listed household smoke-alarm interconnect is the second independent cue. A formal finite-state machine permits the valve to energize only in a confirmed SUPPRESS state. Any sensor, pump, or leak fault fails closed (no water) and raises a loud local alarm. UL 2167A is explicit that units of this type do not replace a household fire alarm; we treat that as a constraint.

The R&D is the confirmation policy: radiometric thresholds and temporal filters that separate a stove plume from a structure fire, fusion with the smoke interconnect, and a lockout a homeowner cannot reboot away. Existing cameras notify. Existing heads wait for the plume. The gap is a measured, fail-closed decision that an authority having jurisdiction could someday evaluate under UL 2167A and NFPA 750. We do not claim NFPA 13D compliance or equivalence. We do not claim a listing. Phase I is to produce evidence that the confirmation problem is tractable.`,
  },
  {
    id: 'objectives',
    title: 'The Technical Objectives and Challenges',
    limit: 3500,
    body: `Phase I (6-18 months; up to $305,000 under NSF 26-510) has four technical objectives.

O1. Dual-cue confirmation study. Collect labeled radiometric and visible sequences of cooking, toaster, candle, direct sun on a wall, space heater, pets, and staged safe heat sources in a garage or lab. Quantify false-positive rate of thermal-only versus thermal plus smoke-interconnect versus the proposed state machine. Success: a written threshold policy with a measured false-positive rate on a held-out set, and a documented failure reel.

O2. Fail-closed finite-state machine on hardware. Implement eight states (BOOT, WATCH, SUSPECT, CONFIRM, SUPPRESS, HOLD, FAULT, LOCKOUT) on a Raspberry Pi 5-class mule with a Lepton 3.5 and a 12 V solenoid. The valve may energize only in SUPPRESS. Target: confirmed-cue to valve command under three seconds on the mule, with a log of every transition. Success: hardware tests of illegal-event rejection and lockout-until-technician.

O3. Hose-bibb then plumbing mule. First water circuit is a garden-hose mule at household bibb pressure (typically 40-60 psi), not a pressure-washer pump. Second, if O1-O2 hold, a plumber-supervised connection with a check valve — still a lab, not a product. Success: timed spray, estimated volume, and a hard maximum duration.

O4. Listing-gap analysis. Paid scoping with a California fire protection engineer against UL 2167A and the Automist AHJ-package shape. Success: a written gap list (sensors, DIOM, inspection, backflow) an NSF reviewer can read. We will not submit for listing in Phase I.

Challenges: (a) Lepton 8.6 Hz and 160x120 are coarse — temporal integration and dual modules may be required; (b) smoke-interconnect timing versus thermal rise is unknown in WUI ember attack; (c) a mule is not a listed valve — lab parts will not be described as fire-service hardware; (d) two founders, no staff FPE — O4 is contracted. Titan (ground vehicle) and Atlas (humanoid) are out of scope.`,
  },
  {
    id: 'market',
    title: 'The Market Opportunity',
    limit: 1750,
    body: `Near-term customer: owner-occupants and estate managers of one- and two-family dwellings in California WUI counties (El Dorado, Placer, Los Angeles), including households that have already evacuated. Pain: notification cameras do not put water on the seat; NFPA 13D is not in every existing home; wildfire insurance is tightening and carriers want listed equipment and evidence, not gadgets. We will not promise premium cuts.

Competition: Plumis Automist is already UL 2167A listed (EX29276). Residential sprinklers are code-driven and reactive. Consumer cameras notify. Our wedge, if we earn it, is pre-flame thermal confirmation plus fail-closed dual-cue on household plumbing for homes that will not retrofit 13D — not a claim that we replace 13D.

Channel: founder-sold, licensed plumber install, manufacturer commissioning. Not Home Depot. Not an app. Line-two Titan and line-three Atlas are not this market.`,
  },
  {
    id: 'team',
    title: 'The Company and Team',
    limit: 1750,
    body: `Prometheus Defense is not yet incorporated. Founders: Eason Greene (Sierra Nevada / UC Berkeley student) and Chris Dawson (Los Angeles). No EIN, no SAM.gov UEI, no employees, no fire protection engineer on staff. This pitch must not be submitted until a U.S. small-business entity exists and the named PI can meet NSF's primary-employment rule for the award period.

Technical work to date is internal: a Kenaz-gated research desk, a tested eight-state suppress finite-state machine, and a UL 2167A / NFPA 750 gap analysis versus Automist. No listing, no field installs, no government affiliation or endorsement.

Team gaps we will name: fire protection engineer (contract), electrical/firmware, and a licensed installer channel. A Phase I SBIR budget would keep at least two-thirds of the work inside the small business, with FPE and listing-gap work as consultants. We are not Fast-Track eligible (no NSF research-lineage award).`,
  },
]

export const nsfPitch = nsfFields.map((row) => `${row.title}\n\n${row.body}`).join('\n\n')

export const emails = [
  {
    id: 'chief',
    to: 'A named captain, via the department public information officer',
    subject: 'Request: 20 minutes on what you will not trust on a WUI wall',
    body: `Captain [Name] —

I am Eason Greene. My co-founder Chris Dawson and I are building a wall-mounted thermal unit that is meant to put water on a residential fire before a sprinkler head fuses. We are not asking you to endorse, sign off, or put this in a station.

I would like twenty minutes on what you have seen fail: false alarms, junk sensors, and vendors who talk like they replace a crew.

We will come to you. No deck required.

Eason Greene
Prometheus Defense
[phone]`,
  },
  {
    id: 'fpe',
    to: 'CA fire protection engineer (NFPA 13D / 750 experience)',
    subject: 'Scoping call: UL 2167A path for a targeting residential mist unit',
    body: `[Name] —

We are two founders building a wall-mounted, normally-unpressurized targeting suppression unit for 1–2 family WUI dwellings. We know Plumis Automist already holds UL 2167A EX29276. We are not pretending that listing is a weekend.

I want a paid scoping call: what an AHJ in El Dorado or LA County will actually read, what we must not claim versus NFPA 13D, and a realistic UL budget and sequence.

Are you open to a 45-minute consult?

Eason Greene
Prometheus Defense`,
  },
  {
    id: 'flir',
    to: 'Teledyne FLIR OEM (oem.flir.com/developer)',
    subject: 'OEM inquiry: dual Lepton 3.5 for residential fire confirmation',
    body: `FLIR OEM team —

We are evaluating Lepton 3.5 (500-0771-01) and 3.1R for a wall-mounted residential fire-confirmation unit (not a phone accessory). Dual radiometric modules, fail-closed water circuit, CA WUI.

Please send volume pricing at 10 / 100 / 1,000 and any constraints on using radiometric data in a life-safety-adjacent product that is not yet listed.

Eason Greene
Prometheus Defense`,
  },
  {
    id: 'cushman',
    to: 'Cushman Custom Solutions',
    subject: 'Titan HD as a parking-lot fire-mule — tank, pump, strobe',
    body: `Custom Solutions —

We need a Titan HD or XD as a lab mule: IBC or baffled tank, 12–24 V pump skid, strobe/siren, thermal mast. Parking lot and estate drive use only. Not a wildland spec.

Can you quote a Titan HD with toolbox/strobe package and remaining deck capacity for a ~200–400 gallon tank (payload-limited)? We will not exceed your GVWR.

Eason Greene
Prometheus Defense`,
  },
  {
    id: 'skydeck',
    to: 'Berkeley SkyDeck (founders@ / program intake)',
    subject: 'SkyDeck: WUI targeting suppression, Berkeley founder',
    body: `SkyDeck team —

I am a UC Berkeley student. Co-founder in Los Angeles. We are building Sentinel, a dual-cue wall unit for WUI homes, with a long-horizon humanoid rescue line we are not raising against.

We have a Kenaz-gated research desk, a formal suppress FSM, and a UL 2167A gap analysis versus Automist. Looking for hardware mentors and FPE introductions, not a consumer-app track.

Eason Greene`,
  },
  {
    id: 'nsf',
    to: 'NSF Project Pitch (portal, not an email)',
    subject: 'Project Pitch — targeting water mist confirmation for WUI dwellings',
    body: nsfPitch,
  },
]

export const nightLog = [
  {
    t: '2026-08-16 23:50 PT',
    who: 'Agent',
    entry:
      'Overnight sprint opened. Ingested Eason todos (code, PSI, hose, power, thermal, smoke, chiefs, prototype, raise) and the Centry / Cushman / government-code notes. Product 3 confirmed as humanoid firefighter.',
  },
  {
    t: '2026-08-17 00:20 PT',
    who: 'Agent',
    entry:
      'Hard findings: NFPA 13D floor is 7 psi at the head; homes run ~40–60 at the tap. UL 2167A is the real listing; Automist is already there. Cushman Titan is a 14 mph warehouse mule, not a 40° crawler. Hyundai’s 2026 firefighter is wheeled teleop, not a humanoid. NSF Phase I up to $305k with pitches rolling.',
  },
  {
    t: '2026-08-17 00:40 PT',
    who: 'Agent',
    entry:
      'Kenaz desk expanded: Founder queue (Eason-only), viability stack, code path, forge BOM, Atlas staged doctrine, capital map, cold drafts. Sentinel FSM tested. Public language “any situation” parked as forbidden.',
  },
  {
    t: '2026-08-17 10:15 PT',
    who: 'Agent',
    entry:
      'Next artifacts: hose-bibb mule shopping list with live vendor URLs (Forge), NSF 26-510 four-field paste block (Capital; 27 Jul window closed, 4 Nov next), dated 90-day calendar from 17 Aug, install/service model plus false-discharge SOP (Install), in-home telemetry/privacy spec (Privacy, Kenaz only). Titan 2,800 PSI language pulled off the internal systems blurb.',
  },
]

export const muleTotal = forge.muleBom.reduce((n, row) => n + row.est, 0)

/** Order-of-magnitude only. Every number here is an assumption until a real quote replaces it. */
export const unitEconomics = {
  caveat:
    'These are assumptions, not quotes. The only honest number today is the mule BOM. Replace each line as real vendor pricing arrives, and never show this tab to an investor as if it were measured.',
  rows: [
    { line: 'Thermal module (Lepton 3.5, qty 100)', low: 120, high: 172, note: 'MSRP $172 at qty 1. Volume discount unknown until FLIR OEM replies.' },
    { line: 'Compute + visible camera', low: 40, high: 90, note: 'A Pi is a prototype answer. A listed product wants a dedicated MCU/SoM.' },
    { line: 'Valve, pump, nozzle, plumbing', low: 90, high: 220, note: 'Listed fire-service valves cost multiples of hardware-store parts.' },
    { line: 'Enclosure, mount, wiring, PSU', low: 60, high: 140, note: 'Injection molding is a tooling cheque, not a per-unit cost, until volume.' },
    { line: 'Assembly and test', low: 40, high: 100, note: 'Hand-built in the first hundred. Functional test fixture required for listing.' },
  ],
  truths: [
    'Hardware gross margin under 50% cannot carry a direct sales motion. If BOM lands near $500, the unit cannot retail at $999.',
    'Install is the hidden cost. A licensed plumber touching potable supply is a real trade, priced per home, and it is the bottleneck on scale — not manufacturing.',
    'The listing is a fixed cost measured in six figures and years, amortized across every unit. Model it as a gate, not a line item.',
    'Service, annual inspection, and false-discharge response are recurring obligations. UL 2167A units are inspected annually by qualified people. That is either a revenue line or a liability.',
    'Do not price before a site survey. Early access is an invitation, not a checkout.',
  ],
}

export const ninetyDay = [
  {
    id: '01',
    window: 'Weeks 1–2',
    theme: 'Standing',
    items: [
      'Entity, EIN, bank, founder IP assignment (Eason + Chris).',
      'Measure static pressure at the Sierra house — bibb and interior fixture.',
      'Buy the UL 2167A outline and read it before writing another spec.',
    ],
  },
  {
    id: '02',
    window: 'Weeks 3–5',
    theme: 'Evidence',
    items: [
      'Build the hose-bibb mule. Detect → confirm → valve, logged, on video.',
      'Run the false-alarm gauntlet: stove, toaster, candle, sunlight on a wall, space heater, dog.',
      'Record every false positive. The failure reel is more persuasive than the success clip.',
    ],
  },
  {
    id: '03',
    window: 'Weeks 4–7',
    theme: 'Judgment',
    items: [
      'Three fire-service conversations. Feedback, not endorsement.',
      'Paid scoping call with a California fire protection engineer.',
      'Write the Automist gap analysis honestly — where we are behind and what is genuinely different.',
    ],
  },
  {
    id: '04',
    window: 'Weeks 6–10',
    theme: 'Capital',
    items: [
      'SAM.gov registration after the entity exists, then NSF Project Pitch. The 27 Jul 2026 full-proposal window is closed. Target 4 Nov 2026 only if a pitch invitation arrives in time (NSF: typically 1–2 months).',
      'If the invitation misses November, the next full-proposal dates are 4 Mar 2027 and 7 Jul 2027. Do not rush a dishonest pitch to catch November.',
      'Do not open a friends round until the mule video exists.',
    ],
  },
  {
    id: '05',
    window: 'Weeks 10–13',
    theme: 'Decide',
    items: [
      'Go/no-go on the plumbing-integrated prototype versus staying on a hose circuit.',
      'Decide whether Titan is a mule, a product, or a distraction this year.',
      'Write down what would make you stop. Founders who skip this step raise for five years on a dead thesis.',
    ],
  },
]

export const risks = [
  {
    id: '01',
    risk: 'False discharge floods a home',
    severity: 'Company-ending',
    control:
      'Dual-cue confirm before the valve can open. Fail-closed on any sensor fault. Flow sensor with a hard maximum duration and a physical shutoff the homeowner can reach.',
  },
  {
    id: '02',
    risk: 'Failure to discharge in a real fire',
    severity: 'Company-ending',
    control:
      'Loud, visible fault state — never a silent failure. Weekly self-test with a logged heartbeat. Never sold as the only line of defense; the house keeps its listed alarms.',
  },
  {
    id: '03',
    risk: 'Cameras inside homes',
    severity: 'High',
    control:
      'This is the blind spot nobody flags. Thermal plus visible imaging inside a residence is a surveillance product unless you design against it. Process on-device, retain nothing by default, no cloud video without explicit opt-in, and publish the policy before the first install. Spec is on the Privacy tab. Do not put it on the public site as if it were shipping.',
  },
  {
    id: '04',
    risk: 'Backflow into potable water',
    severity: 'High',
    control: 'Listed backflow prevention, plumbing permit, licensed installer. Non-negotiable and inspected.',
  },
  {
    id: '05',
    risk: 'Selling an unlisted suppression system',
    severity: 'High',
    control:
      'Until UL 2167A, position as supplemental detection and response, disclose development status in writing, and let the AHJ conversation happen before the sale — not after.',
  },
  {
    id: '06',
    risk: 'Founder bandwidth',
    severity: 'Real',
    control:
      'Two founders, one in school, no FPE, no EE. Three product lines is the fastest way to ship none. Sentinel only until it is listed.',
  },
  {
    id: '07',
    risk: 'Automist is ahead',
    severity: 'Strategic',
    control:
      'They are listed and we are not. Differentiate on WUI ember threat and pre-flame thermal confirmation, or concede the interior-mist category and pick a different wedge. Do not pretend they are not there.',
  },
]

/** Dated from 17 Aug 2026. Owner column is who has to move that week. */
export const ninetyDayCalendar = [
  {
    dates: '17–23 Aug 2026',
    week: '01',
    owner: 'Eason + Chris',
    items: [
      'Start entity + IP assignment. NSF November is already tight without an EIN.',
      'Buy the hose-bibb gauge from the Forge cart and photograph static PSI at the Sierra bibb and one interior fixture.',
      'Order the mule cart (or explicitly refuse the spend).',
      'Buy the UL 2167A outline (shopulstandards.com UniqueKey=46789).',
    ],
  },
  {
    dates: '24–30 Aug 2026',
    week: '02',
    owner: 'Eason',
    items: [
      'Pi 5 + Lepton 3.5 + PureThermal Mini on the bench. USB UVC first, not custom SPI.',
      'If the entity exists, open the NSF Project Pitch and paste Capital fields. Do not submit a fictional company.',
      'Draft, do not send, the fire-captain email with a real name.',
    ],
  },
  {
    dates: '31 Aug–13 Sep 2026',
    week: '03–04',
    owner: 'Eason',
    items: [
      'Hose-bibb mule: detect → confirm → valve, logged, on video. Fail-closed on fault.',
      'Hard maximum spray duration on the mule. Physical shutoff you can reach without software.',
    ],
  },
  {
    dates: '14–27 Sep 2026',
    week: '05–06',
    owner: 'Eason',
    items: [
      'False-alarm gauntlet: stove, toaster, candle, sun on a wall, space heater, dog.',
      'First fire-service conversation. Feedback, not sign-off.',
    ],
  },
  {
    dates: '28 Sep–11 Oct 2026',
    week: '07–08',
    owner: 'Eason',
    items: [
      'Paid FPE scoping call (CA, NFPA 13D or 750).',
      'If the pitch is still unanswered, wait. Do not send a second pitch while one is under review.',
    ],
  },
  {
    dates: '12 Oct–1 Nov 2026',
    week: '09–11',
    owner: 'Eason + Chris',
    items: [
      'NSF 4 Nov 2026 full proposal exists only with an invitation, SAM.gov UEI, Research.gov, and SBA Company Registry. If any of those are missing, skip November.',
      'Walk Chris through this desk. Sentinel is Model One. Atlas is not the raise.',
    ],
  },
  {
    dates: '2–15 Nov 2026',
    week: '12–13',
    owner: 'Both',
    items: [
      'Go/no-go on plumbing-integrated prototype versus staying on a hose circuit.',
      'Write the stop condition. If the mule cannot tell a stove from a structure fire, stop.',
    ],
  },
]

/**
 * Shoppable mule cart. Prices checked 17 Aug 2026 against live product pages.
 * A Pi 5 8GB now lists at $175 (PiShop / Raspberry Pi brief). 4GB keeps the cart near $800.
 */
export const muleCart = {
  verified: '17 Aug 2026',
  caveat:
    'Lab mule for a hose bibb. Not Sentinel. Not listed. Not potable-plumbing. Prices move; tax and shipping are extra. Adafruit 997 is 1/2 in. NPS plastic with a 3 PSI minimum — household bibb pressure is enough. Do not buy a 2,800 PSI washer pump.',
  doNot:
    'DO NOT: tie this into interior potable plumbing, leave it armed unattended, claim UL or NFPA 13D, use a pressure-washer pump, or pitch this cart as the product.',
  rows: [
    {
      item: 'Raspberry Pi 5 4GB (mule default)',
      sku: 'Adafruit 5812',
      vendor: 'Adafruit',
      url: 'https://www.adafruit.com/product/5812',
      est: 130,
      note: '4GB is enough for Lepton UVC + Camera Module 3 + FSM. 8GB Adafruit 5813 was $200 the same day; official list $175 at PiShop.',
    },
    {
      item: 'Raspberry Pi 5 8GB (optional headroom)',
      sku: 'SC1112 / PiShop 8GB-9028',
      vendor: 'PiShop.us (authorized)',
      url: 'https://www.pishop.us/product/raspberry-pi-5-8gb/',
      est: 175,
      note: 'Do not buy both. Official Raspberry Pi brief lists 8GB at $175, 4GB at $110. Skip this line if you take the 4GB.',
      optional: true,
    },
    {
      item: 'Official 27W USB-C PD PSU (US, 5.1V 5A)',
      sku: 'Raspberry Pi 27W',
      vendor: 'CanaKit',
      url: 'https://www.canakit.com/official-raspberry-pi-5-power-supply-27w-usb-c.html',
      est: 13,
      note: 'Canonical spec page: https://www.raspberrypi.com/products/27w-power-supply/ — CanaKit had the US SKU at $12.95.',
    },
    {
      item: 'Raspberry Pi Camera Module 3 (standard)',
      sku: 'Camera Module 3',
      vendor: 'Raspberry Pi',
      url: 'https://www.raspberrypi.com/products/camera-module-3/',
      est: 25,
      note: 'From $25. Visible discriminator only. On-device. Do not stream this off the property.',
    },
    {
      item: 'Pi 5 camera cable (22-way to 15-way, 200mm)',
      sku: 'Standard–Mini 200mm',
      vendor: 'Raspberry Pi',
      url: 'https://www.raspberrypi.com/products/camera-cable/',
      est: 5,
      note: 'Pi 5 uses a different FPC than Pi 4. The camera will not talk without this cable.',
    },
    {
      item: 'FLIR Lepton 3.5 radiometric 160×120 57°',
      sku: '500-0771-01',
      vendor: 'GroupGets / Teledyne FLIR OEM',
      url: 'https://groupgets.com/products/flir-lepton-3-5',
      est: 164,
      note: 'OEM page https://oem.flir.com/products/lepton/?model=500-0771-01 also $164. NDAA, ITAR-free, 8.6 Hz exportable. GroupGets emails an end-use statement.',
    },
    {
      item: 'PureThermal Mini USB (Lepton UVC breakout)',
      sku: 'PURETHERMAL-MINI-USB',
      vendor: 'GroupGets',
      url: 'https://groupgets.com/products/purethermal-mini-usb',
      est: 115,
      note: 'Plug-and-play UVC on Linux. Faster than SPI breakout for a mule. Board was in stock 17 Aug 2026 at $114.99. Lepton sold separately.',
    },
    {
      item: 'SEAFLO 12V diaphragm pump 3.0 GPM / 55 PSI shut-off',
      sku: 'SFDP1-030-055-42',
      vendor: 'Home Depot',
      url: 'https://www.homedepot.com/p/SEAFLO-12-Volt-3-0-GPM-0-064-HP-Variable-Flow-Water-Pressure-Diaphragm-Pump-SFDP1-030-055-42/312082230',
      est: 60,
      note: 'Household-pressure class. Max draw ~7 A. Not 2,800 PSI. Manufacturer: seaflo.com 42-series.',
    },
    {
      item: 'Plastic 12V water solenoid, 1/2 in. NPS',
      sku: 'Adafruit 997',
      vendor: 'Adafruit',
      url: 'https://www.adafruit.com/product/997',
      est: 7,
      note: 'Normally closed. 3 PSI minimum, one-way flow, ~320 mA at 12V. Lab only, not food-safe, not a listed fire valve. Brass BSP alt: Adafruit 996 at $24.95 if the plastic weeps.',
    },
    {
      item: 'N-channel MOSFET 30V/60A (valve + pump switch)',
      sku: 'Adafruit 355',
      vendor: 'Adafruit',
      url: 'https://www.adafruit.com/product/355',
      est: 2,
      note: 'Drive from 3.3V GPIO. You still need a 1N4001 kickback diode across the solenoid coil. Adafruit 755 (10-pack) was out of stock 17 Aug 2026 — buy 1N4001 from DigiKey or Mouser (~$2).',
    },
    {
      item: 'Bioenno 12V 12Ah LiFePO4 + 2A charger',
      sku: 'BLF-1212A',
      vendor: 'Bioenno Power',
      url: 'https://www.bioennopower.com/products/12volt-12ah-lifepo4-battery',
      est: 165,
      note: 'Battery-only $124.99; use the Battery+Charger(2A) option on the same page. 14.6V LiFePO4 charger only — not an SLA charger. Pump and solenoid ride this pack, not the Pi PSU.',
    },
    {
      item: 'Orbit 0–200 PSI hose-end pressure gauge',
      sku: '26268',
      vendor: 'Home Depot',
      url: 'https://www.homedepot.com/p/Orbit-0-200-PSI-Hose-End-Water-Pressure-Gauge-26268/205074399',
      est: 15,
      note: 'This is also the founder PSI task. Photograph static pressure at the bibb, then one sink. Typical CA homes 40–60 psi at the tap.',
    },
    {
      item: 'IP66 weatherproof enclosure (Pi + MOSFET, not the pump)',
      sku: 'Adafruit 905',
      vendor: 'Adafruit',
      url: 'https://www.adafruit.com/product/905',
      est: 20,
      note: '125×175×75 mm, clear lid. Pump and battery stay outside the box. Add a PG-7 gland if you split cables.',
    },
    {
      item: 'Hose, check valve, 1/2 in. fittings, 10A fuse, wire',
      sku: 'Hardware aisle',
      vendor: 'Local plumbing / electrical',
      url: 'https://www.homedepot.com/b/Plumbing/N-5yc1vZbqpw',
      est: 55,
      note: '25 ft hose, 1/2 in. NPS adapters for Adafruit 997, brass in-line check, blade fuse + holder, 16 AWG. Do not remove the bibb vacuum breaker.',
    },
  ],
}

export const muleCartCore = muleCart.rows.filter((row) => !row.optional)
export const muleCartTotal = muleCartCore.reduce((n, row) => n + row.est, 0)

export function formatMuleCart() {
  const lines = [
    'HOSE-BIBB MULE — ORDER LIST',
    `Lab only. Not Sentinel. Not listed. Prices checked ${muleCart.verified}.`,
    muleCart.caveat,
    '',
  ]
  for (const row of muleCartCore) {
    lines.push(row.item)
    lines.push(`  ${row.sku}  ·  ${row.vendor}  ·  ~$${row.est}`)
    lines.push(`  ${row.url}`)
    lines.push(`  ${row.note}`)
    lines.push('')
  }
  const eight = muleCart.rows.find((row) => row.optional)
  if (eight) {
    lines.push('OPTIONAL 8GB INSTEAD OF 4GB')
    lines.push(`  ${eight.sku}  ·  ${eight.vendor}  ·  ~$${eight.est}`)
    lines.push(`  ${eight.url}`)
    lines.push(`  ${eight.note}`)
    lines.push('')
  }
  lines.push(`ESTIMATED CORE TOTAL  ~$${muleCartTotal}  (tax/shipping extra)`)
  lines.push(muleCart.doNot)
  return lines.join('\n')
}

export const installModel = {
  status:
    'Draft operating model for a future listed product. Sentinel is not UL listed. Do not sell installs. Do not tell a homeowner this is a code sprinkler.',
  sources: [
    {
      name: 'UL Solutions on targeting residential water mist',
      url: 'https://www.ul.com/thecodeauthority/knowledge/water-mist-fire-protection-one-and-two-family-homes',
      take: 'For the listed class, installation, commissioning, and annual maintenance are to be done only by people qualified by the manufacturer. Evaluated for one- and two-family dwellings; ceiling-height limit in that write-up is 8 ft.',
    },
    {
      name: 'Automist / IFC 904.11.3 analog (they are listed; we are not)',
      url: 'https://automist.us/faq/can-automist-be-approved-as-an-alternative-to-a-13d-sprinkler-system/',
      take: 'Where an AHJ applies IFC/CFC 904.11.3, water mist is maintained to NFPA 25: nozzles inspected annually and the system operated annually per the manufacturer DIOM. That is the obligation we inherit if we ever list. It is not a claim we hold the listing.',
    },
    {
      name: 'California C-36 plumbing contractor',
      url: 'https://www.cslb.ca.gov/About_Us/Library/Licensing_Classifications/C-36_Plumbing.aspx',
      take: 'A connection to potable supply is plumbing. In California that is a licensed C-36, plus local permit and listed backflow prevention. Founders do not DIY a house into a product.',
    },
  ],
  roles: [
    {
      who: 'Licensed plumber (CA C-36 or local equivalent)',
      does: 'Permit, tap, isolation valve, listed backflow, drain, labeling. Owns the potable-water interface. Does not program the unit and does not declare it listed.',
    },
    {
      who: 'Prometheus commissioning (manufacturer-qualified, once we have a DIOM)',
      does: 'Mount, aim, interconnect to listed smoke alarms, FSM self-test, flow-duration cap, homeowner abort, event-log sample, privacy defaults on. Signs a commissioning sheet. Until we have a qualification program, only founders commission the mule — and only on a bibb.',
    },
    {
      who: 'Homeowner',
      does: 'Knows the physical shutoff. Keeps listed smoke alarms. Calls 911 on fire. Does not reboot a FAULT into WATCH.',
    },
    {
      who: 'AHJ / inspector',
      does: 'Accepts or refuses the system. Until we are listed, there is nothing for them to accept as 904.11 equipment.',
    },
  ],
  annual: [
    'Visual: nozzle, leaks, mounting, labels, shutoff reach.',
    'Power: mains present, backup pack health, heartbeat log for the prior year.',
    'Sensors: thermal self-test, visible lens clean, smoke-interconnect continuity. Not a substitute for listed-alarm testing.',
    'Water: operate the circuit per the (future) DIOM into a catch, confirm volume estimate, confirm fail-closed.',
    'Who: manufacturer-qualified person, not a random handy person, not a Ring installer.',
    'Until listed: no paid inspection product. Do not invoice homeowners for a listing we do not hold.',
  ],
  falseDischarge: {
    label: 'DRAFT SOP — false discharge / unintended water',
    steps: [
      'If there is fire or smoke, 911 first. This SOP is for water where there is no fire.',
      'Hit the physical shutoff. Do not debug in software while water is moving.',
      'The unit must go FAULT then LOCKOUT. A reboot is not a reset. Technician only.',
      'Contain: towels, move electronics, shut the home water main if the isolation valve failed.',
      'Estimate volume: pump rating × open time from the log, then photograph the standing water. Phone photos. Not Sentinel video.',
      'Export the event packet: timestamps, FSM states, event class, zone/unit ID, estimated gallons, abort/fault flags. No frames, no faces.',
      'Notify the homeowner in person or by phone. Then, if a policy exists, the carrier — with the packet, not a video dump.',
      'Water-damage mitigation is a restoration contractor. We do not dry houses.',
      'Root cause on the Kenaz desk before the unit is ever re-armed. Dual-cue logs only.',
      'Never tell the homeowner insurance will pay. Never blame them. Never leave the unit armed.',
    ],
  },
}

export const privacySpec = {
  status:
    'Internal design intent for a future in-home unit. Not a shipping privacy policy. Not a public-site claim. Not CCPA certification.',
  default:
    'On-device. The unit must be able to watch, confirm, and (if ever authorized) open a valve with no cloud and no account. If the network is down, the FSM still runs.',
  rules: [
    {
      id: '01',
      title: 'No cloud video without opt-in',
      body: 'Thermal and visible frames are processed in RAM on the device. They are discarded after the decision unless the owner has explicitly opted into event-clip upload. Opt-in is per household, written, revocable. Default is off.',
    },
    {
      id: '02',
      title: 'Visible camera is a discriminator, not a nanny cam',
      body: 'The visible sensor exists to reject stoves, sun, and pets. It is not a viewing product. No live view in an app. No audio. No night-vision marketing.',
    },
    {
      id: '03',
      title: 'Thermal is still imaging',
      body: 'Radiometric frames can outline a person. Treat them as personal data, not as “just heat.” Same retention as visible.',
    },
    {
      id: '04',
      title: 'What we store by default',
      body: 'Event log only: UTC timestamp, unit/zone ID, FSM state transitions, event class (suspect / confirm / suppress / abort / fault / lockout), spray duration, estimated volume, self-test heartbeat, firmware hash. Retention target: 3 years for incident logs, 90 days for heartbeats. No frames in that log.',
    },
    {
      id: '05',
      title: 'What insurers actually need',
      body: 'A claims packet is timestamps, event class, duration, estimated gallons, and whether the valve commanded open. It is not video. Do not volunteer footage. If a carrier later demands a clip, that is a legal process plus owner consent — not a product feature.',
    },
    {
      id: '06',
      title: 'Opt-in clips, if ever',
      body: 'If an owner opts in: clip window is 30 seconds before confirm through 30 seconds after hold. Encrypted at rest. Delete 72 hours after upload unless the owner freezes a claim. We do not train models on customer homes.',
    },
    {
      id: '07',
      title: 'Access and deletion',
      body: 'Owner can export the event log. Owner can request deletion of clips. Incident logs needed for a live claim or a safety investigation are retained until that matter closes. California residents get a real CCPA/CPRA notice before any install — written later with counsel, not invented here.',
    },
    {
      id: '08',
      title: 'Kids’ rooms and bathrooms',
      body: 'No unit in a bathroom. Visible sensor disabled in any room the owner marks as a child’s room; thermal-only. That marking is local, not a cloud profile.',
    },
  ],
  publicSite:
    'Do not put this spec on prometheusdefense.com as if it were a live product policy. The public site may say we do not operate in-home cameras today. It may not promise a certified privacy program we have not built.',
}
