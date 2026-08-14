/**
 * Wolf Transit product matrix, deep product docs for the pack.
 * Columns = product lines (L→R). Rows = subsequent models (01, 02, …).
 * Fenrir leads left; Dire Wolf (train) closes the arch.
 */

import { POWERTRAIN_TIERS } from './powertrainTiers'

export const WOLF_CADENCE = {
  fenrir01: '2027-01-13',
  intervalMonths: 2,
  railroadComplete: '2031-08-13',
}

/** Format ISO date for display */
export function formatWolfDate(iso) {
  if (!iso) return null
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export const formatMatrixDate = formatWolfDate

const sharedVehicleBenefits = [
  'Quiet torque and frontier-minded ergonomics',
  'Serviceability designed for owner and community shops',
  'Assumption-labeled range and duty claims until engineering gates clear',
]

const sharedVehicleSavings = [
  'Fewer fossil fill-ups on the electric and hydrogen paths',
  'Owner-fixable modules meant to cut dealer lock-in over the life of the machine',
  'Ethanol-capable Tier 3 path can lean on regional Demeter feedstock when available',
]

/** Community / fix-it value-add across Wolf */
export const wolfCommunity = {
  title: 'Community building and fixing',
  body: 'Wolf is built for riders and wrenchers who want the machine to stay theirs. Everything is yours to fix, manuals, modular fasteners, and community shops come before sealed black boxes. The pack grows when neighbors can wrench together.',
  addOns: [
    {
      id: 'helmets',
      name: 'Helmets',
      text: 'Trail and cold-country helmet kits matched to Fenrir and Hati duty, protective gear as a pack add-on, not an afterthought.',
    },
    {
      id: 'fix-it-kits',
      name: 'Fix-it kits',
      text: 'Owner tool rolls, wear parts, and stencil-labeled fasteners so roadside and garage repairs stay in your hands.',
    },
    {
      id: 'hydrogen-boost',
      name: 'Hydrogen boost power',
      text: 'Optional hydrogen boost packages for longer remote legs once Tier 2 fueling partners and safety gates clear.',
    },
  ],
}

/**
 * Product lines L→R. Each nestles models under a wolf-species / myth name.
 */
export const wolfLines = [
  {
    id: 'fenrir',
    name: 'Fenrir',
    stencil: 'motorcycle',
    vehicle: 'motorcycle',
    epithet: 'Adventure motorcycle',
    naming:
      'Bound wolf of the north, the first trail machine that opens the pack.',
    overview:
      'Electric adventure motorcycle for cold-country and backroad travel. Quiet torque, weather-minded ergonomics, and trail range labeled as planned until engineering review closes. No fossil cloud on the concept path.',
    powertrain: true,
    does: 'Carries a single rider (and light gear) into cold trails and backroads on quiet electric torque, with later tiers for hydrogen range and ethanol-capable dual injection.',
    benefits: [
      ...sharedVehicleBenefits,
      'Adventure geometry for mixed pavement and dirt',
      'Community fix-it culture from day one',
    ],
    savings: sharedVehicleSavings,
    addOns: wolfCommunity.addOns,
  },
  {
    id: 'hati',
    name: 'Hati',
    stencil: 'atv',
    vehicle: 'atv',
    epithet: 'Tri-fuel ATV',
    naming: 'Moon-chaser, off-road pack runner for night trails and rough ground.',
    overview:
      'Intelligent ATV concept with a tri-fuel architecture: hydrogen, battery pack, and a dual-infusion engine that can accept conventional fuels including ethanol. Built for work sites, ranch miles, and rescue staging, not a toy quad.',
    powertrain: true,
    does: 'Moves tools, people, and light cargo across rough ground with a tri-path energy story, electric, hydrogen, and dual injection.',
    benefits: [
      'Work-site and ranch duty cycles first',
      'Tri-fuel intelligence for remote logistics',
      'Rescue-staging friendly cargo points',
    ],
    savings: sharedVehicleSavings,
    addOns: wolfCommunity.addOns,
  },
  {
    id: 'skoll',
    name: 'Sköll',
    stencil: 'car',
    vehicle: 'car',
    epithet: 'Small electric + hydrogen car',
    naming: 'Sun-chaser, compact day-road wolf for the settled frontier.',
    overview:
      'Compact car for town-to-trail days: electric and hydrogen in the lead story, self-driving mode engaged by a Launch switch that feels like taking off, outward-facing cameras only (no cabin surveillance framing), hardy longevity, and data stored on your car, local-first.',
    powertrain: true,
    does: 'A hardy small car for town-to-trail days, electric and hydrogen drive, optional self-driving via Launch switch, privacy-minded outward cameras, and local-first data that stays on the vehicle.',
    benefits: [
      'Electric and hydrogen in the product story from the start',
      'Self-driving mode for corridor and trail-adjacent miles',
      'Only outward-facing cameras, cabin is not a surveillance product',
      'Launch switch, a deliberate takeoff gesture that engages self-driving',
      'Hardy build aimed at long service life',
      'Data stored on your car (local-first), not a remote behavioral profile by default',
    ],
    savings: [
      'Fewer fossil fill-ups on electric / hydrogen paths',
      'Longevity-minded parts and owner serviceability',
      'Local data means you are not paying forever for cloud telemetry you did not ask for',
    ],
    addOns: [
      ...wolfCommunity.addOns,
      {
        id: 'launch-switch-kit',
        name: 'Launch switch kit',
        text: 'Tactile Launch hardware and software profile that engages self-driving with a takeoff feel, deliberate, not accidental.',
      },
      {
        id: 'outward-cam-pack',
        name: 'Outward camera pack',
        text: 'Road and trail outward-facing camera suite only. No cabin-facing surveillance framing in the product story.',
      },
    ],
    highlights: [
      {
        title: 'Privacy · outward cameras only',
        text: 'Sköll watches the road and trail, not the cabin. No cabin-surveillance framing in the product promise.',
      },
      {
        title: 'Launch switch',
        text: 'One deliberate control that feels like taking off and engages self-driving mode.',
      },
      {
        title: 'Local-first data',
        text: 'Trip and vehicle data live on your car first. Cloud sync is opt-in later, never the default story.',
      },
    ],
  },
  {
    id: 'geri',
    name: 'Geri',
    stencil: 'truck',
    vehicle: 'truck',
    epithet: 'Utility truck',
    naming: 'One of Odin’s wolves, the hauler that feeds the pack.',
    overview:
      'Electric-forward utility truck for freight, farm, and corridor support. Designed as the logistics sibling to Fenrir and Hati: payload first, trail clearance second, showroom gloss last.',
    powertrain: true,
    does: 'Hauls tools, modules, and corridor freight for farm, site, and pack logistics with the three-tier energy ladder.',
    benefits: [
      'Payload-first utility geometry',
      'Site and corridor logistics sibling to the trail machines',
      'Owner and fleet serviceability',
    ],
    savings: sharedVehicleSavings,
    addOns: wolfCommunity.addOns,
  },
  {
    id: 'freki',
    name: 'Freki',
    stencil: 'heli',
    vehicle: 'heli',
    epithet: 'Rescue helicopter',
    naming: 'Odin’s other wolf, ravenous for the rescue call.',
    overview:
      'Compact rescue helicopter concept for mountain, ice, and remote corridor response. Mission profile is medevac and search support under partner operators, not scheduled passenger service.',
    powertrain: true,
    does: 'Supports medevac and search response in mountain and ice corridors under partner operators, energy tiers framed as mission packages, not airline trims.',
    benefits: [
      'Mission profile: rescue and search support',
      'Partner-operator path before any passenger claim',
      'Corridor coverage studies tied to Dire Wolf spine',
    ],
    savings: [
      'Shared corridor basing can cut duplicate remote staging costs over time',
      'Mission-kit modularity aims to reduce one-off airframe custom programs',
    ],
    addOns: [
      {
        id: 'night-ice-kit',
        name: 'Night & ice kit',
        text: 'Concept mission kit for night-ops and extreme-cold response, research register until airworthiness paths clear.',
      },
      ...wolfCommunity.addOns.filter((a) => a.id !== 'helmets'),
    ],
  },
  {
    id: 'dire-wolf',
    name: 'Dire Wolf',
    stencil: 'train',
    vehicle: 'train',
    epithet: 'Transcontinental railroad',
    naming:
      'Ice-age namesake, the heavy spine. Formerly sketched as the Bifröst Line.',
    overview:
      'Segmented transcontinental rail program: San Francisco toward New York in buildable phases, not a single overnight claim. Right-of-way, energy, and regional partners unlock each segment. Target network completion August 13, 2031.',
    powertrain: true,
    does: 'Builds a phased coast-to-coast rail spine so freight and people can move on partner-backed segments, the heavy corridor under the rest of the pack.',
    benefits: [
      'Phased, buildable segments, not a single megabid fantasy',
      'Freight and people mix studies per corridor',
      'Civilization-scale spine for the rest of Wolf Transit',
    ],
    savings: [
      'Segmented capital gates reduce all-or-nothing spend narratives',
      'Shared energy substations studied across phases',
    ],
    addOns: [
      {
        id: 'yard-modules',
        name: 'Yard modules',
        text: 'Concept rail-yard and transfer modules that couple to Geri trucks and Holm/Demeter site logistics.',
      },
    ],
  },
]

function cellBase(partial) {
  return {
    capture: 'email',
    benefits: partial.benefits,
    savings: partial.savings,
    addOns: partial.addOns,
    ...partial,
  }
}

/**
 * Model rows. Cells keyed by lineId. Mystery row seals the far future.
 */
export const wolfModelRows = [
  {
    id: '01',
    label: '01',
    cells: {
      fenrir: cellBase({
        id: 'fenrir-01',
        status: 'scheduled',
        targetDate: '2027-01-13',
        image: '/images/products/wolf/fenrir-01.jpg',
        summary: 'First wolf on the trail, electric adventure motorcycle.',
        description:
          'Fenrir 01 is the lead product: an electric adventure motorcycle aimed at riders who want frontier miles without a fossil cloud. Target window January 13, 2027. Planned specs (range, pack chemistry, service network) stay labeled until engineering review.',
        does: 'Opens the Wolf pack as the first trail machine, electric-led adventure motorcycle with community fix-it DNA and the three-tier energy ladder ahead.',
        benefits: wolfLines[0].benefits,
        savings: wolfLines[0].savings,
        addOns: wolfLines[0].addOns,
        hostAlias: 'fenrir01',
      }),
      hati: cellBase({
        id: 'hati-01',
        status: 'planned',
        targetDate: '2027-03-13',
        summary: 'Tri-fuel intelligent ATV, hydrogen, battery, dual-infusion.',
        description:
          'Hati 01 opens the ATV line two months after Fenrir 01. Tri-fuel intelligence for remote work and trail logistics. Blueprint stage: architecture studies and partner OEM inquiry, not a shipping SKU.',
        does: 'Brings the tri-fuel ATV online for ranch, work-site, and rescue-staging miles.',
        benefits: wolfLines[1].benefits,
        savings: wolfLines[1].savings,
        addOns: wolfLines[1].addOns,
        hostAlias: 'hati01',
      }),
      skoll: cellBase({
        id: 'skoll-01',
        status: 'planned',
        targetDate: '2027-05-13',
        summary: 'Compact electric + hydrogen car with Launch self-driving.',
        description:
          'Sköll 01 is the small-car arch: electric and hydrogen, Launch-switch self-driving, outward-facing cameras only, hardy longevity, and local-first vehicle data. Cadence places the line debut May 13, 2027, four months after Fenrir 01.',
        does: wolfLines[2].does,
        benefits: wolfLines[2].benefits,
        savings: wolfLines[2].savings,
        addOns: wolfLines[2].addOns,
        highlights: wolfLines[2].highlights,
        hostAlias: 'skoll01',
      }),
      geri: cellBase({
        id: 'geri-01',
        status: 'planned',
        targetDate: '2027-07-13',
        summary: 'Utility truck for payload and corridor support.',
        description:
          'Geri 01 hauls what the pack needs: tools, modules, and corridor freight. Electric-forward with work-site duty cycles. July 13, 2027 target for line open, research and partner diligence only until then.',
        does: wolfLines[3].does,
        benefits: wolfLines[3].benefits,
        savings: wolfLines[3].savings,
        addOns: wolfLines[3].addOns,
        hostAlias: 'geri01',
      }),
      freki: cellBase({
        id: 'freki-01',
        status: 'planned',
        targetDate: '2027-09-13',
        summary: 'Rescue helicopter concept for remote response.',
        description:
          'Freki 01 studies a compact rescue rotorcraft for mountain and ice corridors. Operator partnerships and airworthiness paths come before any passenger or charter claim. Line open target September 13, 2027.',
        does: wolfLines[4].does,
        benefits: wolfLines[4].benefits,
        savings: wolfLines[4].savings,
        addOns: wolfLines[4].addOns,
        hostAlias: 'freki01',
      }),
      'dire-wolf': cellBase({
        id: 'dire-wolf-01',
        status: 'vision',
        targetDate: '2027-11-13',
        summary: 'Phase I, western rail segment groundbreaking path.',
        description:
          'Dire Wolf 01 marks Phase I: western corridor planning and first-segment partnerships (Bay Area toward the Sierra / Intermountain approach). Not maglev marketing copy, phased heavy rail and high-speed studies with transparent milestones. Segment work begins on the two-month cadence after Freki 01.',
        does: 'Opens Phase I of the transcontinental spine, western corridor planning and partnerships.',
        benefits: wolfLines[5].benefits,
        savings: wolfLines[5].savings,
        addOns: wolfLines[5].addOns,
        phases: true,
        hostAlias: 'direwolf01',
      }),
    },
  },
  {
    id: '02',
    label: '02',
    cells: {
      fenrir: cellBase({
        id: 'fenrir-02',
        status: 'planned',
        targetDate: '2028-01-13',
        image: '/images/products/wolf/fenrir-02.jpg',
        summary: 'Second-generation adventure motorcycle.',
        description:
          'Fenrir 02 refines range, serviceability, and cold-weather packaging from the 01 program. Drops on the annual anniversary of Fenrir 01 under the every-two-months matrix cadence (line 01s fill 2027; model 02s begin 2028).',
        does: 'Second-generation adventure motorcycle refining pack learning from Fenrir 01.',
        benefits: wolfLines[0].benefits,
        savings: wolfLines[0].savings,
        addOns: wolfLines[0].addOns,
        hostAlias: 'fenrir02',
      }),
      hati: cellBase({
        id: 'hati-02',
        status: 'planned',
        targetDate: '2028-03-13',
        summary: 'ATV follow-on, pack logistics and work variants.',
        description:
          'Hati 02 extends the tri-fuel ATV into fleet and rescue-staging variants. Still concept-gated.',
        does: 'Fleet and rescue-staging variants of the tri-fuel ATV.',
        benefits: wolfLines[1].benefits,
        savings: wolfLines[1].savings,
        addOns: wolfLines[1].addOns,
        hostAlias: 'hati02',
      }),
      skoll: cellBase({
        id: 'skoll-02',
        status: 'theoretical',
        targetDate: '2028-05-13',
        summary: 'Small-car follow-on, longer range pack studies.',
        description:
          'Sköll 02 explores longer-range packs and family cargo without leaving the compact footprint. Theoretical until 01 gates clear. Same privacy and Launch-switch story.',
        does: 'Longer-range and family-cargo studies inside the compact Sköll footprint.',
        benefits: wolfLines[2].benefits,
        savings: wolfLines[2].savings,
        addOns: wolfLines[2].addOns,
        highlights: wolfLines[2].highlights,
        hostAlias: 'skoll02',
      }),
      geri: cellBase({
        id: 'geri-02',
        status: 'theoretical',
        targetDate: '2028-07-13',
        summary: 'Truck follow-on, heavier duty cycle.',
        description:
          'Geri 02 studies higher payload and corridor-support upfits for Demeter / Holm site logistics across the mosaic.',
        does: 'Heavier duty-cycle utility truck for mosaic site logistics.',
        benefits: wolfLines[3].benefits,
        savings: wolfLines[3].savings,
        addOns: wolfLines[3].addOns,
        hostAlias: 'geri02',
      }),
      freki: cellBase({
        id: 'freki-02',
        status: 'theoretical',
        targetDate: '2028-09-13',
        summary: 'Rescue heli follow-on, night and ice packages.',
        description:
          'Freki 02 adds night-ops and extreme-cold mission kits in concept form. No flight schedule implied.',
        does: 'Night and ice mission packages for the rescue rotorcraft concept.',
        benefits: wolfLines[4].benefits,
        savings: wolfLines[4].savings,
        addOns: wolfLines[4].addOns,
        hostAlias: 'freki02',
      }),
      'dire-wolf': cellBase({
        id: 'dire-wolf-02',
        status: 'vision',
        targetDate: '2029-01-13',
        summary: 'Phase II, central plains segment.',
        description:
          'Phase II pushes Dire Wolf across the central plains: right-of-way coalitions, energy substations, and freight/people mix studies. Still a multi-year build, not an operating timetable.',
        does: 'Central plains segment, coalitions, substations, freight/people mix.',
        benefits: wolfLines[5].benefits,
        savings: wolfLines[5].savings,
        addOns: wolfLines[5].addOns,
        phases: true,
        hostAlias: 'direwolf02',
      }),
    },
  },
  {
    id: '03',
    label: '03',
    cells: {
      fenrir: cellBase({
        id: 'fenrir-03',
        status: 'theoretical',
        targetDate: '2029-01-13',
        image: '/images/products/wolf/fenrir-03.jpg',
        summary: 'Third motorcycle generation, pack systems mature.',
        description:
          'Fenrir 03 is a longer-horizon motorcycle generation once 01/02 field learning exists. Opacity rises; claims stay blueprint-honest.',
        does: 'Longer-horizon motorcycle generation after field learning.',
        benefits: wolfLines[0].benefits,
        savings: wolfLines[0].savings,
        addOns: wolfLines[0].addOns,
        hostAlias: 'fenrir03',
      }),
      hati: cellBase({
        id: 'hati-03',
        status: 'theoretical',
        targetDate: '2029-03-13',
        summary: 'ATV third wave, autonomous assist research.',
        description:
          'Hati 03 sketches driver-assist and convoy logic for remote work. Research register only.',
        does: 'Driver-assist and convoy research for remote ATV work.',
        benefits: wolfLines[1].benefits,
        savings: wolfLines[1].savings,
        addOns: wolfLines[1].addOns,
        hostAlias: 'hati03',
      }),
      skoll: cellBase({
        id: 'skoll-03',
        status: 'theoretical',
        targetDate: '2029-05-13',
        summary: 'Small-car third wave, shared fleet concepts.',
        description:
          'Sköll 03 explores shared and corridor-linked compact fleets. No consumer lease offer on this surface. Local-first data story remains.',
        does: 'Shared and corridor-linked compact fleet concepts, research only.',
        benefits: wolfLines[2].benefits,
        savings: wolfLines[2].savings,
        addOns: wolfLines[2].addOns,
        highlights: wolfLines[2].highlights,
        hostAlias: 'skoll03',
      }),
      geri: cellBase({
        id: 'geri-03',
        status: 'theoretical',
        targetDate: '2029-07-13',
        summary: 'Truck third wave, rail-yard and site hybrids.',
        description:
          'Geri 03 ties truck logistics tighter to Dire Wolf yards and Holm/Demeter sites, concept coupling across halls.',
        does: 'Rail-yard and site-hybrid truck logistics across halls.',
        benefits: wolfLines[3].benefits,
        savings: wolfLines[3].savings,
        addOns: wolfLines[3].addOns,
        hostAlias: 'geri03',
      }),
      freki: cellBase({
        id: 'freki-03',
        status: 'theoretical',
        targetDate: '2029-09-13',
        summary: 'Rescue heli third wave, corridor coverage net.',
        description:
          'Freki 03 studies a coverage net along the rail spine. Partner-operated; no Valhalla airline claim.',
        does: 'Corridor coverage-net studies along the Dire Wolf spine.',
        benefits: wolfLines[4].benefits,
        savings: wolfLines[4].savings,
        addOns: wolfLines[4].addOns,
        hostAlias: 'freki03',
      }),
      'dire-wolf': cellBase({
        id: 'dire-wolf-03',
        status: 'vision',
        targetDate: '2030-06-13',
        summary: 'Phase III, eastern approach toward NYC.',
        description:
          'Phase III carries Dire Wolf into the eastern approach and NYC metro interface. Permitting and urban interfaces dominate. Full transcontinental completion target remains August 13, 2031.',
        does: 'Eastern approach and NYC interface, permitting-led phase.',
        benefits: wolfLines[5].benefits,
        savings: wolfLines[5].savings,
        addOns: wolfLines[5].addOns,
        phases: true,
        hostAlias: 'direwolf03',
      }),
    },
  },
  {
    id: 'mystery',
    label: '?',
    mystery: true,
    cells: null,
  },
]

export const wolfMission = {
  title: 'What Wolf Transit is building',
  body: 'Wolf Transit is a land-mobility arch: electric trail machines first, then ATV, car, truck, and rescue air, each named for a wolf of myth or deep history, culminating in Dire Wolf, a phased transcontinental railroad. Community building and fixing sit under every line: everything is yours to fix, with add-ons from helmets and fix-it kits to hydrogen boost power. We publish a product matrix, not a checkout cart. Fenrir 01 targets January 13, 2027; a new line or model lands every two months on that cadence.',
  cadence:
    'Cadence: Fenrir 01 on January 13, 2027 → new product line 01 every two months through Dire Wolf Phase I → model 02/03 generations continue on the same drumbeat. Dire Wolf completes in segments by August 13, 2031.',
}

export const direWolfPhases = [
  {
    id: 'phase-1',
    name: 'Phase I · West',
    window: 'From Nov 2027',
    text: 'Western corridor planning, first-segment partnerships, and energy/right-of-way diligence from the Bay toward the Intermountain west.',
  },
  {
    id: 'phase-2',
    name: 'Phase II · Central',
    window: 'Through 2029',
    text: 'Central plains segment, freight and people mix, substations, and multi-state coalitions. Buildable chunks, not a single megabid fantasy.',
  },
  {
    id: 'phase-3',
    name: 'Phase III · East',
    window: 'Through 2030',
    text: 'Eastern approach and NYC interface. Urban permitting and terminal studies lead; operational claims wait on cleared gates.',
  },
  {
    id: 'complete',
    name: 'Network target',
    window: 'August 13, 2031',
    text: 'Segment spine complete as a researched, partner-backed transcontinental path. Status stays vision until each phase’s permits and capital gates clear.',
  },
]

export const wolfMatrix = {
  companyId: 'wolf',
  title: 'Wolf matrix',
  kicker: 'Product path',
  mission: wolfMission,
  community: wolfCommunity,
  lines: wolfLines,
  rows: wolfModelRows,
  phases: direWolfPhases,
  phasesForLineId: 'dire-wolf',
  powertrainTiers: POWERTRAIN_TIERS,
  emailHint: '',
  emailDone: '',
}

export function getWolfCell(lineId, rowId) {
  const row = wolfModelRows.find((r) => r.id === rowId)
  if (!row || row.mystery || !row.cells) return null
  return row.cells[lineId] || null
}

export function wolfCellOpacity(rowIndex, lineIndex, lineCount, rowCount) {
  const t =
    (rowIndex + lineIndex * 0.15) / Math.max(1, rowCount + lineCount * 0.15 - 1)
  return Math.max(0.2, 1 - t * 0.75)
}

export const matrixCellOpacity = wolfCellOpacity
