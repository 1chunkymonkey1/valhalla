/**
 * Founder dispatch queue — drafts only.
 * Nothing here is a send. Approve + Send in /capital is the only outbound path.
 *
 * Capital posture (Aug 13 2026): raise Demeter $1.0–1.5M SAFE at $8M cap.
 * Valhalla is the story inside the room, not the entity on the instrument.
 * Corvus is sequenced after Demeter. REAP grants paused; loans still live.
 */

export const DISPATCH_FROM = {
  name: 'Eason Greene',
  email: 'easongreene@gmail.com',
  phone: '(209) 768-4306',
}

export const DISPATCH_LANES = [
  { id: 'demeter', label: 'Demeter' },
  { id: 'corvus', label: 'Corvus' },
  { id: 'capital', label: 'Non-dilutive' },
  { id: 'fellowship', label: 'Fellowships' },
  { id: 'claims', label: 'Claims' },
]

const SIGN_DEMETER = `Eason Greene
Founder, Demeter Energy
easongreene@gmail.com
Berkeley / Sonora, California`

const SIGN_EASON = `Eason Greene
easongreene@gmail.com
UC Berkeley · Sonora, California`

export const DISPATCH_SEED = [
  {
    id: 'demeter-investor-signals',
    lane: 'demeter',
    channel: 'email',
    title: 'Investor Signals — Sam',
    toName: 'Sam',
    to: 'sam@investorsignals.co',
    toHint:
      'Founder-authorized 17 Aug 2026. Pitch-review room, not a confirmed check. Do not ask him to blast a list. Name on the public site is unverified; address is the authorization.',
    subject: 'Demeter Energy — $1.0–1.5M SAFE, $8M cap',
    applyUrl: '',
    gated: '',
    flags: ['one-to-one', 'no-redistribution'],
    notes:
      'Do not attach the twelve HTML files as company decks. Do not send leads.md. Mosaic is charter in one sentence. Gmail compose only; founder clicks Send. Do not mark sent until Gmail actually sends.',
    body: `Sam,

I am Eason Greene. I am raising Demeter Energy, not Valhalla.

This note is to you only. Please do not forward or post.

If useful as map, not as raise: twelve halls on valhallaco.org (Land, Water, Air, Space). Those are charter rooms of One Civilization. They are not twelve issuers raising.

The round is Demeter only: $1.0–1.5M on a YC post-money SAFE, $8M cap, $25K minimum. Agrivoltaic solar on working land, hydrogen as the second product. First site lead is Gothenburg, Nebraska. Land not signed. Delaware entity in formation. I am 19, at Berkeley.

I am not attaching twelve company decks. Those files were internal stubs. I can send the farm one-pager or do twenty minutes if this stays a one-to-one thread.

Eason Greene
Founder, Demeter Energy
easongreene@gmail.com
(209) 768-4306`,
  },
  {
    id: 'demeter-flyer-one',
    lane: 'demeter',
    channel: 'email',
    title: 'Flyer One follow-up',
    toName: 'Vital Laptenok',
    to: '',
    toHint: 'Confirm the Flyer One address before send. Meeting was set for Aug 11; outcome is not in the files.',
    subject: 'Demeter Energy — $1.0–1.5M SAFE, $8M cap',
    applyUrl: '',
    gated: '',
    flags: ['confirm-email', 'confirm-meeting-outcome'],
    notes:
      'Fund V is €50M. Ask for a seed check into Demeter, not a Valhalla umbrella. Do not mention a $5M raise or REAP grants.',
    body: `Vital,

I am raising Demeter Energy, not Valhalla.

Demeter is agrivoltaic solar plus on-farm green hydrogen. The first site lead is a farm in Gothenburg, Nebraska. The land is not signed. The Delaware entity is in formation. I am 19, at Berkeley, and I am the founder.

The round is $1.0–1.5M on a YC post-money SAFE, $8M cap, $25K minimum. Use of proceeds is entity, land LOI, interconnection filing, and a project-finance CEO search. Not construction.

USDA REAP grants are paused. Guaranteed loans are still live. The hydrogen production credit still requires construction to begin before 1 January 2028. That clock is why this raise exists now.

Valhalla is why a farm sits next to a vehicle company and a compute company. It is the story in the room. It is not the name on the SAFE.

If Fund V still has a climate or infrastructure sleeve, I would like twenty minutes on the farm, the stack, and the clock.

${SIGN_DEMETER}`,
  },
  {
    id: 'demeter-yc',
    lane: 'demeter',
    channel: 'application',
    title: 'Y Combinator — Demeter',
    toName: 'Y Combinator',
    to: '',
    toHint: '',
    subject: '',
    applyUrl: 'https://www.ycombinator.com/apply',
    gated: '',
    flags: ['entity-formation'],
    notes:
      'Apply as Demeter Energy. F26 late apps still accepted as of Aug 13 (on-time closed 27 Jul). Batch is in-person SF Oct–Dec. Entity required to take the check. Do not apply as Valhalla.',
    body: `COMPANY
Demeter Energy

ONE LINER
Agrivoltaic farms that grow crops and make green hydrogen on the same acres.

WHAT WE DO
Dual-use solar over working farmland, with surplus power to on-site PEM electrolysis. First site lead: Gothenburg, Nebraska. Land not signed. Entity in formation.

PROGRESS
Technical thesis written (Kyle Chu, November 2025). Farm lead identified. USDA REAP grant window is paused; we are packaging the guaranteed-loan path and a 2027 construction start so the hydrogen credit still applies. No revenue yet. Year-1 plan is consulting plus site control, not a 50MW build.

THE ASK
$1.0–1.5M on a YC post-money SAFE, $8M cap.

FOUNDER
Eason Greene, 19, UC Berkeley (Economics, Public Policy, Sociology). Acting founder/CEO until a project-finance operator is seated.

WHAT THIS IS NOT
Not a thirteen-company holdco raise. Not a claim that we own the US grid. Not a live REAP grant.

WHY NOW
Hydrogen credit construction deadline is 31 December 2027. Site control and a CEO who has closed project finance have to happen in 2026 or the credit is gone.`,
  },
  {
    id: 'demeter-climate-capital',
    lane: 'demeter',
    channel: 'application',
    title: 'Climate Capital — Airtable (this week)',
    toName: 'Climate Capital',
    to: 'x@climatecap.co',
    toHint: 'Airtable is the apply path. x@climatecap.co is the public founder inbox.',
    subject: 'Demeter Energy — $1.0–1.5M SAFE, $8M cap',
    applyUrl: 'https://airtable.com/appzXNxMxIfAx9eMc/shr0tMVvP68gllVQt',
    gated: '',
    flags: [],
    notes:
      'Verified Aug 13 2026. Fastest $25K–$200K climate check. Founders page: climatecapital.co/founders. Do not pitch Valhalla. Entity still in formation — say so.',
    body: `Demeter Energy. Agrivoltaic solar over working farmland, surplus power to green hydrogen. First site lead: Gothenburg, Nebraska. Land not signed. Delaware entity in formation.

Raising $1.0–1.5M on a YC post-money SAFE, $8M cap, $25K minimum.

Founder: Eason Greene, 19, UC Berkeley (Economics, Public Policy, Sociology). easongreene@gmail.com.

Use of proceeds: entity, land LOI, interconnection filing, project-finance CEO search. Not construction.

USDA REAP grants are paused. Guaranteed loans are still live. Hydrogen production credit requires construction to begin before 1 January 2028.

Not raising as Valhalla. Not claiming a live grant. Not claiming site control.`,
  },
  {
    id: 'demeter-pelayo-angel',
    lane: 'demeter',
    channel: 'email',
    title: 'Pelayo — solar installer angel intro',
    toName: 'Adrian Pelayo',
    to: '',
    toHint: 'Need Adrian’s address. He flagged a solar-installation investor at $25K minimum, $5M cap. We are now at $8M cap — say that plainly.',
    subject: 'Demeter SAFE — please intro the installer',
    applyUrl: '',
    gated: '',
    flags: ['confirm-email', 'cap-changed'],
    notes:
      'Archive said $5M cap. Current recommendation is $8M cap. Tell the truth. Do not put Pelayo in a CEO title; files conflict.',
    body: `Adrian,

Please intro the solar installer who said he could do $25K into Demeter.

Terms I want in the room: YC post-money SAFE, $8M cap (not $5M), $25K minimum, raising $1.0–1.5M total. Entity still in formation with Jared.

I will not pitch Valhalla as the company. Demeter only. Land in Gothenburg is still a lead, not a lease.

If he wants a call this week I can do it.

${SIGN_DEMETER}`,
  },
  {
    id: 'demeter-kocher-intros',
    lane: 'demeter',
    channel: 'email',
    title: 'Paul Kocher — climate intros',
    toName: 'Paul Kocher',
    to: '',
    toHint: 'Advisor. Confirm personal email before send. Ask for intros, not a check, unless he offers.',
    subject: 'Demeter — asking for two intros, not a check',
    applyUrl: '',
    gated: '',
    flags: ['confirm-email'],
    notes: 'NAE advisor. Highest-leverage intro path you have. Keep it short.',
    body: `Paul,

I am raising Demeter Energy: $1.0–1.5M on an $8M cap SAFE. Agrivoltaic + hydrogen, first site lead in Nebraska, land unsigned, entity in formation.

I am not asking you for the check. I am asking for two intros to people who have actually financed a first farm or a first hydrogen project.

I will not send them a Valhalla deck. Demeter only. No Spirit, no Swift, no $40B.

If you have names, I will write the notes.

${SIGN_DEMETER}`,
  },
  {
    id: 'demeter-lowercarbon',
    lane: 'demeter',
    channel: 'email',
    title: 'Lowercarbon — cold note',
    toName: 'Lowercarbon Capital',
    to: '',
    toHint: 'Do not invent a partner email. Use their public intake if listed; otherwise hold until Kocher or another intro.',
    subject: 'Demeter Energy — agrivoltaic hydrogen, Nebraska lead',
    applyUrl: 'https://lowercarboncapital.com/',
    gated: '',
    flags: ['needs-intro-or-intake'],
    notes: 'Cold email without a named partner is weak. Prefer intro. Intake URL is a fallback.',
    body: `Lowercarbon team,

Demeter Energy. Agrivoltaic solar over working farmland, surplus power to green hydrogen. First site lead: Gothenburg, Nebraska. Land not signed. Entity in formation.

Raising $1.0–1.5M on a YC post-money SAFE, $8M cap.

I am 19, at Berkeley. The technical thesis is a 2025 agrivoltaics paper by Kyle Chu. I need site control and a CEO who has closed project finance before the hydrogen credit’s 31 Dec 2027 construction deadline.

Happy to send a one-pager. I will not send a thirteen-company deck.

${SIGN_DEMETER}`,
  },
  {
    id: 'demeter-agfunder',
    lane: 'demeter',
    channel: 'email',
    title: 'AgFunder — cold note',
    toName: 'AgFunder',
    to: 'info@agfunder.com',
    toHint: 'Listed on AgFunder LinkedIn. Confirm on agfunder.com before send.',
    subject: 'Demeter Energy — dual-use farmland, Nebraska lead',
    applyUrl: 'https://agfunder.com/',
    gated: '',
    flags: ['needs-intro-or-intake'],
    notes: 'Ag thesis fit. Same discipline: Demeter only, unsigned land, $8M cap.',
    body: `AgFunder team,

Farmers should not have to choose between crops and kilowatts. Demeter is dual-use solar over working land, with on-farm hydrogen as the second product.

First site lead is in Gothenburg, Nebraska. No lease yet. Raising $1.0–1.5M SAFE, $8M cap, to get entity, land, and interconnection in motion.

Founder: Eason Greene, 19, UC Berkeley.

${SIGN_DEMETER}`,
  },
  {
    id: 'demeter-ponderosa',
    lane: 'demeter',
    channel: 'email',
    title: 'Ponderosa Ventures — farm thesis',
    toName: 'Ponderosa Ventures',
    to: 'contact@ponderosavc.com',
    toHint: 'Verified public inbox. Lead with crop and farmer economics, not GW.',
    subject: 'Demeter Energy — dual-use farmland, Nebraska lead',
    applyUrl: 'https://ponderosavc.com/',
    gated: '',
    flags: [],
    notes:
      'Verified Aug 13 2026. $100–750K, food/ag/land, 25% of deals are first institutional check. Do not pitch energy-dev. Pitch farmer P&L.',
    body: `Ponderosa team,

Demeter Energy. Dual-use solar over working farmland so the acre still grows a crop. On-farm hydrogen is the second product, not the pitch.

First site lead: Gothenburg, Nebraska. Land not signed. Entity in formation. Raising $1.0–1.5M on a YC post-money SAFE, $8M cap, $25K minimum.

I am 19, at Berkeley. I need site control and a CEO who has closed project finance. USDA REAP grants are paused; guaranteed loans are still live.

I will not send a thirteen-company deck. Happy to send a one-pager on the farm.

${SIGN_DEMETER}`,
  },
  {
    id: 'demeter-skydeck',
    lane: 'demeter',
    channel: 'application',
    title: 'Berkeley SkyDeck — closes 21 Aug',
    toName: 'Berkeley SkyDeck',
    to: '',
    toHint: '',
    subject: '',
    applyUrl: 'https://skydeck.berkeley.edu/apply/',
    gated: '',
    flags: ['deadline'],
    notes:
      'Batch 23 climate track. Deadline 21 August 2026. $210K. Eason is a Cal student. Entity required to take the fund SAFE. Cohort Nov 2026–Apr 2027 in Berkeley.',
    body: `Company: Demeter Energy
Founder: Eason Greene, 19, UC Berkeley Interdisciplinary Studies (Economics, Public Policy, Sociology)

One liner: Agrivoltaic farms that keep growing food and make green hydrogen on the same acres.

Progress: Farm lead in Gothenburg, Nebraska (unsigned). Technical thesis written. Delaware entity in formation. Raising $1.0–1.5M SAFE at $8M cap into Demeter only.

Why SkyDeck: I am already at Cal. The climate track is the right room. I need six months of operator pressure while I close land, not a civilization story.

Honest constraints: no signed lease, no REAP grant (paused), hydrogen credit requires construction start before 2028.`,
  },
  {
    id: 'demeter-congruent',
    lane: 'demeter',
    channel: 'email',
    title: 'Congruent Ventures',
    toName: 'Congruent Ventures',
    to: 'investors@congruentvc.com',
    toHint: 'Verified public inbox. Formation checks exist. Send after the one-pager is honest, not after mythology.',
    subject: 'Demeter Energy — formation check, agrivoltaic + hydrogen',
    applyUrl: 'https://www.congruentvc.com/',
    gated: '',
    flags: [],
    notes:
      'Verified Aug 13 2026. Formation ~$250–750K. Energy + food/ag. They underwrite technology and unit economics. Unsigned land is a pass unless the development playbook is clear.',
    body: `Abe / Joshua,

Demeter Energy. Agrivoltaics on working land, hydrogen as the second product on the same site. First lead: Gothenburg, Nebraska. Not signed. Entity in formation.

Round: $1.0–1.5M, YC post-money SAFE, $8M cap.

I am 19, at Berkeley. I am hiring a project-finance CEO. I am not claiming a prototype or a grant. REAP grants are paused; loans are not. The hydrogen credit still requires construction before 1 January 2028.

If formation-stage energy + food is still on the book, I would like twenty minutes.

${SIGN_DEMETER}`,
  },
  {
    id: 'corvus-hold',
    lane: 'corvus',
    channel: 'email',
    title: 'Corvus — staged investor note',
    toName: '',
    to: '',
    toHint: 'Do not send until Demeter land LOI, unless you override the gate.',
    subject: 'Corvus — $2.5M pre-seed, $12M cap',
    applyUrl: '',
    gated: 'demeter-first',
    flags: ['sequenced'],
    notes:
      'Archive: $2.5M / $12M cap. Software + owned compute. Sequence after Demeter. Override only if you choose the umbrella you already rejected.',
    body: `I am raising Corvus, not Valhalla.

Corvus is sovereign AI compute for founders: hardware you own, software (Raven / Odin) that runs on it. Pre-seed $2.5M, YC post-money SAFE, $12M cap.

I am sequencing this after Demeter’s land agreement. This note is staged. If you are reading it in a send window, that gate has been lifted on purpose.

I will not claim we are the fourth hyperscaler. I will not put a $40B number in this email.

${SIGN_EASON}`,
  },
  {
    id: 'capital-reap-loan',
    lane: 'capital',
    channel: 'email',
    title: 'USDA Kearney — REAP loan, 1 MW hydrogen (not 50 MW solar)',
    toName: 'Jolene Jones / Bill Sheppard',
    to: 'jolene.jones@usda.gov',
    toHint: 'Cc bill.sheppard@usda.gov and RD.NE.General.Inquiries@usda.gov before send. Do not use the old general mailbox as the only To.',
    subject: 'Dawson County rural hydrogen pilot — REAP guaranteed loan eligibility (not a grant)',
    applyUrl: 'https://www.rd.usda.gov/programs-services/energy-programs/rural-energy-america-program-renewable-energy-systems-energy-efficiency-improvement-guaranteed-loans-ne',
    gated: '',
    flags: [],
    notes:
      'Verified Aug 13 2026. Grants paused. Loans live, but Strong Stewardship letter bars ground-mount PV >50 kW. Ask about a 1 MW PEM with no large solar, not Plains Prime 50 MW. Lender files, not you. Kearney 308-455-9840. After Approve, add Sheppard to Cc in Gmail.',
    body: `Dear Ms. Jones and Mr. Sheppard,

I am Eason Greene, founder of Demeter Energy (Delaware C-Corp in formation). We have a farm lead near Gothenburg, Dawson County. Land is not under contract.

I am not requesting a REAP grant. USDA’s March 31, 2026 FAQ and the October 16, 2024 NOFO rescission are clear: grants are paused until new 7 CFR 4280-B rules and a new NOFO.

I would like a short eligibility conversation on REAP guaranteed loans under OneRD / 7 CFR 5001 and the Strong Stewardship Unnumbered Letter:

1. Whether a hydrogen electrolyzer on the order of 1 MW PEM, with no ground-mount PV above 50 kW, not on FSA-certified cropland, and with documented on-site load, can be considered.
2. What an approved OneRD lender should bring to a preliminary eligibility review.
3. Whether REDLG via Dawson PPD or the City of Gothenburg is a better first step (Nebraska deadline September 30, 2026).

I will not ask you to finance a 50 MW solar array. That is a later, separate question after site control.

I can come to the Kearney office.

Phone: (209) 768-4306
easongreene@gmail.com

Eason Greene
Founder, Demeter Energy`,
  },
  {
    id: 'capital-invest-nebraska',
    lane: 'capital',
    channel: 'email',
    title: 'Invest Nebraska — seed match (after LOI)',
    toName: 'Shelby Strattan',
    to: 'shelby@investnebraska.com',
    toHint: 'Verified public contact. Must operate in Nebraska. Unsigned farm is not operating. Approve is the override.',
    subject: 'Demeter Energy — Gothenburg agrivoltaic, seed investment inquiry',
    applyUrl: 'https://opportunity.nebraska.gov/programs/business/nebraska-seed-investment-program/',
    gated: 'land-loi',
    flags: ['gated-on-land'],
    notes:
      'Up to $500K with match. Value-added ag match is 25%. Delaware entity can operate in NE. Do not send until there is a real Nebraska operation or you override.',
    body: `Shelby,

I am Eason Greene, founder of Demeter Energy (Delaware C-Corp in formation). We have a farm lead in Gothenburg, Dawson County. The land is not signed yet.

I am writing early so I understand the Nebraska Seed Investment Program requirements, matching capital, and whether a value-added agriculture path applies to dual-use agrivoltaics with on-farm hydrogen.

I will not claim we are operating in Nebraska until there is a lease or option. I want the conversation queued for when that closes.

Raising $1.0–1.5M into Demeter at an $8M cap. Phone: (209) 768-4306.

${SIGN_DEMETER}`,
  },
  {
    id: 'capital-nppd',
    lane: 'capital',
    channel: 'email',
    title: 'NPPD — interconnection (hold until LOI)',
    toName: 'Nebraska Public Power District',
    to: '',
    toHint: 'Find the interconnection / generation interconnection contact on nppd.com. Do not file a queue position without a land path.',
    subject: 'Generation interconnection inquiry — Gothenburg area agrivoltaic',
    applyUrl: 'https://www.nppd.com/',
    gated: 'land-loi',
    flags: ['gated-on-land'],
    notes: 'Queue positions cost money and credibility. Hold until a land LOI exists.',
    body: `Hello,

Demeter Energy is preparing an agrivoltaic project near Gothenburg, Nebraska. We do not yet have a signed land agreement. I am asking for the current generation interconnection process, study fees, and typical timeline for a project in the 10–50 MW range, so we do not file a premature queue position.

A call with the interconnection team after we have an LOI would be the useful next step.

${SIGN_DEMETER}`,
  },
  {
    id: 'capital-45v-memo',
    lane: 'capital',
    channel: 'internal',
    title: '§45V construction clock — internal',
    toName: 'Eason (file this)',
    to: 'easongreene@gmail.com',
    toHint: 'Internal. Approve = you accept the clock. Send emails a copy to yourself.',
    subject: 'Demeter: hydrogen credit dies if construction has not begun by 31 Dec 2027',
    applyUrl: '',
    gated: '',
    flags: ['internal'],
    notes: 'Not a pitch. This is the forcing function. Keep it off investor decks as a scare line; use it as an operating constraint.',
    body: `INTERNAL — not for investors as a boast.

Section 45V still pays up to $3/kg for qualifying clean hydrogen, with direct pay / transferability still in the statute as of the July 2025 tax bill. Facilities must begin construction before 1 January 2028.

Begin construction is either physical work of a significant nature or a 5% safe harbor under IRS guidance. We have neither. We do not have land. We do not have an entity. We do not have an electrolyzer PO.

Implication: 2026 is site control + CEO + interconnection. 2027 is construction start on the hydrogen pilot, even if the 50MW array slips. Missing the date does not kill Demeter. It kills the credit that makes the hydrogen pencil.

Solar ITC / PTC for new wind and solar starts is a separate, worse picture after the same bill. Path A (begin construction by 4 July 2026) is already missed. Path B (placed in service by 31 Dec 2027) is not realistic with unsigned land. Do not put "40% tax equity" or "48E on the array" in a live model.

REAP guaranteed loans are live, but USDA’s Strong Stewardship letter makes ground-mount PV larger than 50 kW ineligible. A 50 MW Plains Prime array is not a REAP loan. A 1 MW PEM with no large solar might be discussable. Nebraska is not in the Heartland Hydrogen Hub.

Next physical actions:
1. Pay Jared. Form Demeter Energy Inc. SAM.gov UEI.
2. Nebraska trip. LOI.
3. USDA Kearney (Jones) + Sheppard: hydrogen / ≤50 kW only. REDLG via Dawson PPD, deadline 30 Sep 2026.
4. CEO search with project-finance requirement.
5. 1 MW PEM pilot scoped as the 45V vehicle. Binding equipment contract or physical work before 1 Jan 2028.
6. Do not underwrite 48E/45Y on the solar.`,
  },
  {
    id: 'capital-dawson-ppd',
    lane: 'capital',
    channel: 'email',
    title: 'Dawson PPD — REDLG by 30 Sep',
    toName: 'Marsha Banzhaf / Casandra Way',
    to: 'cway@dawsonpower.com',
    toHint: 'Engineering: Casandra Way. Economic development: Marsha Banzhaf, 308-324-2386. Add Banzhaf in Gmail Cc if you have the address.',
    subject: 'Large generation / hydrogen load — interconnection path and REDLG',
    applyUrl: '',
    gated: '',
    flags: [],
    notes:
      'REDLG: utility is the applicant, max $1M, NE deadline 30 Sep 2026. Ask about a small hydrogen/equipment package, not 50 MW solar. Site control not required for a 20-minute call.',
    body: `Dear Ms. Banzhaf and Ms. Way,

We are in early diligence on a Dawson County agrivoltaic and green-hydrogen concept near Gothenburg. Land is not under contract. Entity is not yet formed.

We need to understand:
1. Whether the site would be Dawson PPD or City of Gothenburg electric.
2. The handoff to NPPD / SPP for anything above distribution scale.
3. Whether Dawson PPD would consider sponsoring a USDA REDLG application (next Nebraska deadline 30 September 2026) for a small hydrogen/equipment package, not a 50 MW solar plant.

We are not asking for an interconnection study until we have site control. A 20-minute call would help us sequence this correctly.

Phone: (209) 768-4306
easongreene@gmail.com

Eason Greene
Founder, Demeter Energy`,
  },
  {
    id: 'capital-berkeley-cf',
    lane: 'capital',
    channel: 'application',
    title: 'Berkeley Crowdfunding — apply by 24 Aug',
    toName: 'Berkeley Crowdfunding',
    to: '',
    toHint: 'Campus affiliates only. $5K goal. Needs a sponsoring Berkeley department.',
    subject: '',
    applyUrl: 'https://crowdfund.berkeley.edu/about',
    gated: '',
    flags: ['deadline'],
    notes:
      'October cohort campaign Sep 28–Oct 31. Apply by Monday 24 August 2026 11:59 pm. UC Berkeley affiliation + nonprofit + sponsoring department. $3–5K typical. Not project finance. Archive said already applied — confirm status internally before a second apply.',
    body: `Project: Demeter Energy — dual-use farmland diligence (agrivoltaics + green hydrogen pathway). Site lead in Nebraska, unsigned. Funds: travel to the farm, landowner meetings, basic site notes. Not construction. Not a 50 MW plant.

Applicant: Eason Greene, UC Berkeley Interdisciplinary Studies. easongreene@gmail.com.

Goal: $5,000. October 2026 cohort.

Honest: this is campus seed money so I can be on the land, not a substitute for the SAFE.`,
  },
  {
    id: 'demeter-elemental',
    lane: 'demeter',
    channel: 'application',
    title: 'Elemental Impact — after land LOI',
    toName: 'Elemental Impact',
    to: 'apply@elementalimpact.com',
    toHint: 'FOAK project capital. They will ask for site, community, offtake. Unsigned land is a blocker.',
    subject: '',
    applyUrl: 'https://elementalimpact.com/funding-opportunities/apply/',
    gated: 'land-loi',
    flags: ['gated-on-land'],
    notes:
      'Closest cultural fit to a first US agrivoltaic farm. Rolling. Approving is the override. Do not claim site control.',
    body: `Demeter Energy. Dual-use farmland: agrivoltaics that keep a crop, plus a 1 MW green-hydrogen pilot as the 45V vehicle. First site lead: Gothenburg, Nebraska. Land not signed. Entity in formation.

Raising $1.0–1.5M SAFE at $8M cap into Demeter for site control and a project-finance CEO. Not a 50 MW construction raise.

Founder: Eason Greene, 19, UC Berkeley. easongreene@gmail.com.`,
  },
  {
    id: 'demeter-azolla',
    lane: 'demeter',
    channel: 'application',
    title: 'Azolla Ventures (Prime Coalition)',
    toName: 'Azolla Ventures',
    to: '',
    toHint: '',
    subject: '',
    applyUrl: 'https://azollaventures.typeform.com/to/zgHBtjoX',
    gated: '',
    flags: [],
    notes:
      'Catalytic climate for companies conventional VCs skip. Pitch a scalable US dual-use land company, not one farm’s gigatons. Not Prime Impact Fund (deployed).',
    body: `Demeter Energy is dual-use farmland: food and energy on the same acres, with a green-hydrogen pathway on the first site. Lead in Gothenburg, Nebraska, unsigned. Entity in formation. Raising $1.0–1.5M at an $8M cap.

The additionality is land-use: solar developers and farmers compete for the same acre. We refuse that fight. We are not claiming gigatons today. We are claiming a repeatable farm-energy platform that has to start with one signed lease.

Eason Greene, 19, UC Berkeley. easongreene@gmail.com.`,
  },
  {
    id: 'demeter-breakthrough',
    lane: 'demeter',
    channel: 'application',
    title: 'Breakthrough Energy Fellows — Cohort 7 interest',
    toName: 'Breakthrough Energy Fellows',
    to: '',
    toHint: 'Cohort 6 closed. Cohort 7 reopens Fall 2026. Sign interest now; do not claim you are in a live cohort.',
    subject: '',
    applyUrl: 'https://portal.befellows.org/submit-interest/',
    gated: '',
    flags: [],
    notes:
      'Hydrogen is an explicit category. Must be incorporated before program start. 500 Mt/yr bar is brutal for one farm — pitch the national dual-use land platform, not Plains Prime as the whole company. Apply form: befellows.smapply.org when Cohort 7 opens.',
    body: `Interest only, Cohort 7.

Demeter Energy: agrivoltaics + green hydrogen on working farmland. First site lead in Nebraska, unsigned. Founder Eason Greene, 19, UC Berkeley. Entity in formation.

We are not claiming 500 Mt/year from one farm. We are building the first dual-use land-energy company that can be copied across US farmland. Hydrogen construction must begin before 2028 to keep §45V.

easongreene@gmail.com`,
  },
  {
    id: 'fellowship-thiel',
    lane: 'fellowship',
    channel: 'application',
    title: 'Thiel Fellowship',
    toName: 'Thiel Fellowship',
    to: '',
    toHint: '',
    subject: '',
    applyUrl: 'https://thielfellowship.org/apply',
    gated: '',
    flags: ['dropout'],
    notes:
      'Verified Aug 13 2026. Rolling. $250k grant / 2 years, 0%. Age 22 or under, no degree. Must drop out to accept. Apply as Eason. Only send if leaving Berkeley is a live decision.',
    body: `I am 19. I am at Berkeley. I am building Demeter Energy: farms that keep growing food and also make hydrogen.

I do not need two years to "explore." I need two years where the university calendar is not the clock. The hydrogen credit requires construction to begin before 2028. Site control in Nebraska is the bottleneck. A fellowship that pays me, not the cap table, is the fastest way to sit on that land and close it.

I will not tell you Valhalla is worth forty billion dollars. I will not tell you I am buying an airline. I will tell you I have a farm lead, a technical paper, an unpaid lawyer, and a deadline that does not care that I am a sophomore.

If you fund people who leave school to build a real thing, this is the thing.`,
  },
  {
    id: 'fellowship-z',
    lane: 'fellowship',
    channel: 'application',
    title: 'Z Fellows',
    toName: 'Z Fellows',
    to: '',
    toHint: '',
    subject: '',
    applyUrl: 'https://www.zfellows.com/',
    gated: '',
    flags: ['confirm-deadline'],
    notes:
      'Verified Aug 13 2026. Rolling. Optional $10k SAFE at $1B cap, or $0. Apply path is zfellows.com (text Cory Levy 650-505-9984). /apply 404s. Stay in school.',
    body: `I am Eason Greene, 19, Berkeley. Demeter Energy: agrivoltaic + green hydrogen, Nebraska farm lead, entity in formation. Raising a $1.0–1.5M SAFE at an $8M cap into Demeter, not into a holdco.

I want Z Fellows for speed and the network, not for the dollar amount. The constraint is time to site control before the 2027 hydrogen-credit construction cutoff.`,
  },
  {
    id: 'fellowship-neo',
    lane: 'fellowship',
    channel: 'application',
    title: 'Neo — 2026 window closed',
    toName: 'Neo',
    to: '',
    toHint: '',
    subject: '',
    applyUrl: 'https://neo.com/scholars',
    gated: 'no-send',
    flags: ['closed'],
    notes:
      'Verified Aug 13 2026. Scholars deadline was June 14. Residency April 30. CS-weighted. Save the draft for the next spring window. Do not submit now.',
    body: `Name: Eason Greene
Age: 19
School: UC Berkeley, Interdisciplinary Studies (Economics, Public Policy, Sociology)
Company: Demeter Energy
Location: Berkeley / Sonora, California

I am building the energy company that has to exist if the rest of what I am assembling is more than a story. Dual-use farmland. Green hydrogen. First site in Nebraska, unsigned. I am raising a small SAFE into that company and I am applying here because Neo funds founders earlier than a farm is supposed to look fundable.

I can tell the longer story. I will not put it on the cap table.`,
  },
  {
    id: 'fellowship-contrary',
    lane: 'fellowship',
    channel: 'application',
    title: 'Contrary — no founder form',
    toName: 'Contrary',
    to: '',
    toHint: '',
    subject: '',
    applyUrl: 'https://contrary.com/',
    gated: 'no-send',
    flags: ['closed'],
    notes:
      'Verified Aug 13 2026. No public founder-fellowship apply. VP is campus scouting. Research fellowship writes memos, not farm checks. Hold.',
    body: `Eason Greene, 19, UC Berkeley. Building Demeter Energy (agrivoltaic + hydrogen). First farm lead in Gothenburg, Nebraska. Raising $1.0–1.5M at $8M cap. Looking for the Contrary talent network and, if it fits, a check into Demeter only.`,
  },
  {
    id: 'fellowship-776',
    lane: 'fellowship',
    channel: 'application',
    title: '776 Foundation — waitlist only',
    toName: '776',
    to: '',
    toHint: 'Join the email list on 776.org. No live form as of Aug 13 2026.',
    subject: '',
    applyUrl: 'https://776.org/',
    gated: 'no-send',
    flags: ['closed'],
    notes:
      'Verified Aug 13 2026. No live form. $100k grant / 2 years when it opens. Dropout required. Keep the draft. Join the waitlist only.',
    body: `I am 19 and I am building an energy company on farmland, not a consumer app. Demeter Energy. Nebraska lead. Hydrogen clock. I want 776 if you still back young founders who pick a hard physical thing and stay on it.`,
  },
  {
    id: 'fellowship-emergent',
    lane: 'fellowship',
    channel: 'application',
    title: 'Emergent Ventures',
    toName: 'Emergent Ventures (Mercatus)',
    to: '',
    toHint: '',
    subject: '',
    applyUrl: 'https://mercatus.tfaforms.net/5099527',
    gated: '',
    flags: ['open-now'],
    notes:
      'Verified Aug 13 2026. OPEN, rolling. Form: mercatus.tfaforms.net/5099527. Person grant. No dropout. Proposal ≤ 1,500 words. Do this first. Paste tweet, then the numbered sections.',
    body: `TWEET
I’m 19. Fund months on a Nebraska farm so Demeter can test agrivoltaics and green hydrogen on working land, not on a slide.

1. ME
Eason Greene, 19. UC Berkeley Interdisciplinary Studies (Economics, Public Policy, Sociology). Berkeley / Sonora, California. I am not an electrical engineer. I am the person holding land-use, policy, and founder problems in one head long enough that a real farm can host dual-use energy.

Demeter: the same acre grows food and makes energy. Agrivoltaics plus a green-hydrogen pathway. Farm lead in Gothenburg, Nebraska. Unsigned. That sentence is the honesty test. I am raising a small SAFE into Demeter so the company can exist. I am applying here so I can exist as a person who can go to that farm.

Valhalla is how I think about infrastructure. It is not the applicant and not the fundraising entity.

2. CONSENSUS VIEW I AGREE WITH
Markets need prices. Dual-use agriculture-energy only matters if a landowner is paid, a crop still works, and an offtaker can buy what the site produces.

3. THE IDEA
Solar developers and farmers compete for the same acres. Policy treats food and power as separate ministries. Demeter’s bet is dual use on working land, Plains-sited: agrivoltaic layout that keeps cultivation possible, plus a hydrogen pathway studied against that same site. What is unusual is not the physics. It is treating a Nebraska farm lead as the unit of progress and refusing a civilization-scale fairy tale as the raise.

I am not claiming a signed lease, a live plant, federal awards, or a closed large round.

4. BUDGET
Living cost to split time between Berkeley and Nebraska; travel; basic site diligence (soil, layout, interconnection, hydrogen siting) with people who know those trades; writing other funders can diligence. Demeter’s SAFE stays separate. I will not spend a grant as growth equity.

5. STATUS
Named company, public thesis, part-time student / full-time founder. Technical seat is thin; I will not pretend otherwise. Point of contact: easongreene@gmail.com.`,
  },
  {
    id: 'fellowship-ef',
    lane: 'fellowship',
    channel: 'application',
    title: 'Entrepreneurs First — Bridge by 30 Aug',
    toName: 'Entrepreneurs First',
    to: '',
    toHint: '',
    subject: '',
    applyUrl: 'https://apply.joinef.com/',
    gated: '',
    flags: ['deadline'],
    notes:
      'Verified Aug 13 2026. Bridge Residency SF Fall 2026 apply by 30 August. Prefer the $10k grant path. $125k for 8% is optional and expensive. Full-time SF. Apply as Eason. Disclose that Demeter already exists.',
    body: `I am 19. At Berkeley I chose Interdisciplinary Studies so I could hold economics, public policy, and sociology in one degree while I found.

The checkable thing is Demeter Energy: agrivoltaics plus green hydrogen, an unsigned Nebraska farm lead, a small SAFE into that company. I did not wait for permission to start. I am not a CS prodigy. My edge is insisting that energy projects begin with land and politics, which is where they actually die.

I would use the $10k Fellowship / Bridge path if you want me in the house without forcing an 8% SAFE on day one. I would only take the $250k path if the instrument is Demeter, not a new matched company that orphans the farm lead.

easongreene@gmail.com`,
  },
  {
    id: 'fellowship-human-capital',
    lane: 'fellowship',
    channel: 'application',
    title: 'Human Capital — only with a technical cofounder',
    toName: 'Human Capital Fellowship',
    to: 'fellowship@human.capital',
    toHint: 'Solo is allowed on paper. They want at least one technical person on the team. Do not list Kyle as committed CTO.',
    subject: '',
    applyUrl: 'https://human.capital/hc-fellowship',
    gated: '',
    flags: ['needs-technical-cofounder'],
    notes:
      'Verified Aug 13 2026. OPEN, rolling. $50k/person equity-free, up to $250k/team. Awarded to you, not the cap table. Apply only if a real technical teammate submits too.',
    body: `I’m Eason Greene, 19, Berkeley Interdisciplinary Studies (Econ, Public Policy, Sociology). I want the $50k as a person-grant so I can live between California and a Nebraska farm lead and run landowner discovery for Demeter: agrivoltaics + green hydrogen on working farmland. Unsigned site. Small SAFE into Demeter separately.

I am the land/policy founder, not the electrolyzer designer. I will not apply as a fake technical team. If you need an engineer on the application, I need a committed technical cofounder on the application. Valhalla is narrative. Demeter is the company.

easongreene@gmail.com`,
  },
  {
    id: 'claims-seven',
    lane: 'claims',
    channel: 'internal',
    title: 'Seven claims — keep out of every send',
    toName: 'Eason (do not send this to anyone)',
    to: '',
    toHint: 'Internal lock. Approve = you will not put these in a deck or email. There is no Send.',
    subject: 'LOCKED — do not put these in investor materials',
    applyUrl: '',
    gated: 'no-send',
    flags: ['lock'],
    notes: 'Website copy and a statement to an investor are different legal categories. Approve to acknowledge.',
    body: `Do not put any of the following in a SAFE, deck, application, or email until a document exists behind it:

1. Eagle acquiring Spirit Airlines, or being "in talks" to acquire it. Stripped from the public site 13 Aug 2026. Do not restore.
2. Taylor Swift is the first Eagle consumer. Never on the live site. Keep it that way.
3. Atoll pre-sale is live (the public site says no funds are accepted; pay links disabled). Keep it that way.
4. Aether owns territory or property beyond Earth, as a present legal fact. Site thesis copy may stay; never put title-as-fact in a SAFE or deck.
5. Valhalla is valued in a $40–400B range. Not on the live site. Keep it that way.
6. "1% of US farmland = 4,500 GW" stated as an operating result rather than a back-of-envelope thesis.
7. "10–17 Gt CO2/year" stated as Demeter’s current impact.

Also do not say:
- USDA REAP will finance a 50 MW farm. Grants are paused. Loans bar ground-mount PV >50 kW.
- We are raising $5M. The raise is $1.0–1.5M.
- Adrian Pelayo is CEO. Files conflict. Use founder Eason Greene only.
- Nebraska is in the Heartland Hydrogen Hub. It is not.
- Solar 48E/45Y is available on Plains Prime. Begin-construction by 4 July 2026 was missed.

If a partner has already seen any of (1)(2)(5), the cleanup email is a separate item. Write it only after you list who received the old materials.`,
  },
]
