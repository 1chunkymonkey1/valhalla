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
    why: 'Phase I ceiling is $305k, no equity. Pitch is rolling; full proposals 27 Jul and 4 Nov 2026. Needs EIN.',
    do: 'After entity: SAM.gov, then seedfund.nsf.gov Project Pitch. Draft is in Capital. You submit. Agent cannot.',
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
    do: 'Yes/no: spend ~$800 on Lepton + Pi + solenoid + 12V pump on a hose bibb at the Sierra house. If yes, agent will spec the cart next.',
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
    timing: 'Pitch rolling; full proposals 27 Jul & 4 Nov 2026',
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

export const nsfPitch = `Company: Prometheus Defense (to be incorporated)
Technology: Dual-cue (radiometric LWIR + listed-smoke interconnect) wall unit that confirms a residential fire and opens a directed, normally-unpressurized water circuit in under three seconds.
Problem: NFPA 13D heads wait for a fusible element in the plume. In WUI ember attack and fast interior growth, that wait is the house. Notification cameras do not put water on the seat.
Why NSF: The uncertainty is not “can a solenoid open.” It is reliable confirmation against cooking, sunlight, and pets, with a fail-closed valve, on household pressure, in a form an AHJ can someday list under UL 2167A / NFPA 750.
Not claiming: We do not replace 13D. We do not replace UL 217 alarms. We do not humanoid-rescue in this award.
Work: (1) Lepton 3.5 + visible false-alarm study, (2) formal FSM with lockout, (3) hose-bibb then plumbing mule, (4) FPE-scoped listing gap analysis vs Automist.
Commercial: Direct to CA WUI homeowners and HOAs. Line two (Titan) and line three (Atlas) are out of scope.`

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
      'SAM.gov registration, then NSF Project Pitch.',
      'If the pitch is invited, target the 4 Nov 2026 full proposal.',
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
      'This is the blind spot nobody flags. Thermal plus visible imaging inside a residence is a surveillance product unless you design against it. Process on-device, retain nothing by default, no cloud video without explicit opt-in, and publish the policy before the first install.',
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
