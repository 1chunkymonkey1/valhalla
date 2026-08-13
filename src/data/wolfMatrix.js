/**
 * Wolf Transit product matrix — Wolf-only layout.
 * Columns = product lines (L→R). Rows = subsequent models (01, 02, …).
 * Fenrir leads left; Dire Wolf (train) closes the arch.
 */

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

/**
 * Product lines L→R. Each nestles models under a wolf-species / myth name.
 */
export const wolfLines = [
  {
    id: 'fenrir',
    name: 'Fenrir',
    vehicle: 'motorcycle',
    epithet: 'Adventure motorcycle',
    naming:
      'Bound wolf of the north — the first trail machine that opens the pack.',
    overview:
      'Electric adventure motorcycle for cold-country and backroad travel. Quiet torque, weather-minded ergonomics, and trail range labeled as planned until engineering review closes. No fossil cloud on the concept path.',
  },
  {
    id: 'hati',
    name: 'Hati',
    vehicle: 'atv',
    epithet: 'Tri-fuel ATV',
    naming: 'Moon-chaser — off-road pack runner for night trails and rough ground.',
    overview:
      'Intelligent ATV concept with a tri-fuel architecture: hydrogen, battery pack, and a dual-infusion engine that can accept conventional fuels including ethanol. Built for work sites, ranch miles, and rescue staging — not a toy quad.',
  },
  {
    id: 'skoll',
    name: 'Sköll',
    vehicle: 'car',
    epithet: 'Small electric car',
    naming: 'Sun-chaser — compact day-road wolf for the settled frontier.',
    overview:
      'Compact electric car for town-to-trail days: short wheelbase, high seating sightlines, and cargo that fits a week of gear. Specs stay assumption-labeled until prototype gates clear.',
  },
  {
    id: 'geri',
    name: 'Geri',
    vehicle: 'truck',
    epithet: 'Utility truck',
    naming: 'One of Odin’s wolves — the hauler that feeds the pack.',
    overview:
      'Electric-forward utility truck for freight, farm, and corridor support. Designed as the logistics sibling to Fenrir and Hati: payload first, trail clearance second, showroom gloss last.',
  },
  {
    id: 'freki',
    name: 'Freki',
    vehicle: 'heli',
    epithet: 'Rescue helicopter',
    naming: 'Odin’s other wolf — ravenous for the rescue call.',
    overview:
      'Compact rescue helicopter concept for mountain, ice, and remote corridor response. Mission profile is medevac and search support under partner operators — not scheduled passenger service.',
  },
  {
    id: 'dire-wolf',
    name: 'Dire Wolf',
    vehicle: 'train',
    epithet: 'Transcontinental railroad',
    naming:
      'Ice-age namesake — the heavy spine. Formerly sketched as the Bifröst Line.',
    overview:
      'Segmented transcontinental rail program: San Francisco toward New York in buildable phases, not a single overnight claim. Right-of-way, energy, and regional partners unlock each segment. Target network completion August 13, 2031.',
  },
]

/**
 * Model rows. Cells keyed by lineId. Mystery row seals the far future.
 */
export const wolfModelRows = [
  {
    id: '01',
    label: '01',
    cells: {
      fenrir: {
        id: 'fenrir-01',
        status: 'scheduled',
        targetDate: '2027-01-13',
        summary: 'First wolf on the trail — electric adventure motorcycle.',
        description:
          'Fenrir 01 is the lead product: an electric adventure motorcycle aimed at riders who want frontier miles without a fossil cloud. Target window January 13, 2027. Predeposits opening soon — today we collect email interest only. Planned specs (range, pack chemistry, service network) stay labeled until engineering review.',
        capture: 'email',
      },
      hati: {
        id: 'hati-01',
        status: 'planned',
        targetDate: '2027-03-13',
        summary: 'Tri-fuel intelligent ATV — hydrogen, battery, dual-infusion.',
        description:
          'Hati 01 opens the ATV line two months after Fenrir 01. Tri-fuel intelligence for remote work and trail logistics. Blueprint stage: architecture studies and partner OEM inquiry, not a shipping SKU.',
        capture: 'email',
      },
      skoll: {
        id: 'skoll-01',
        status: 'planned',
        targetDate: '2027-05-13',
        summary: 'Compact electric car for town-to-trail days.',
        description:
          'Sköll 01 is the small-car arch: quiet cabin, gear-friendly cargo, winter-minded traction concept. Cadence places the line debut May 13, 2027 — four months after Fenrir 01.',
        capture: 'email',
      },
      geri: {
        id: 'geri-01',
        status: 'planned',
        targetDate: '2027-07-13',
        summary: 'Utility truck for payload and corridor support.',
        description:
          'Geri 01 hauls what the pack needs: tools, modules, and corridor freight. Electric-forward with work-site duty cycles. July 13, 2027 target for line open — research and partner diligence only until then.',
        capture: 'email',
      },
      freki: {
        id: 'freki-01',
        status: 'planned',
        targetDate: '2027-09-13',
        summary: 'Rescue helicopter concept for remote response.',
        description:
          'Freki 01 studies a compact rescue rotorcraft for mountain and ice corridors. Operator partnerships and airworthiness paths come before any passenger or charter claim. Line open target September 13, 2027.',
        capture: 'email',
      },
      'dire-wolf': {
        id: 'dire-wolf-01',
        status: 'vision',
        targetDate: '2027-11-13',
        summary: 'Phase I — western rail segment groundbreaking path.',
        description:
          'Dire Wolf 01 marks Phase I: western corridor planning and first-segment partnerships (Bay Area toward the Sierra / Intermountain approach). Not maglev marketing copy — phased heavy rail and high-speed studies with transparent milestones. Segment work begins on the two-month cadence after Freki 01.',
        capture: 'email',
        phases: true,
      },
    },
  },
  {
    id: '02',
    label: '02',
    cells: {
      fenrir: {
        id: 'fenrir-02',
        status: 'planned',
        targetDate: '2028-01-13',
        summary: 'Second-generation adventure motorcycle.',
        description:
          'Fenrir 02 refines range, serviceability, and cold-weather packaging from the 01 program. Drops on the annual anniversary of Fenrir 01 under the every-two-months matrix cadence (line 01s fill 2027; model 02s begin 2028).',
        capture: 'email',
      },
      hati: {
        id: 'hati-02',
        status: 'planned',
        targetDate: '2028-03-13',
        summary: 'ATV follow-on — pack logistics and work variants.',
        description:
          'Hati 02 extends the tri-fuel ATV into fleet and rescue-staging variants. Still concept-gated; email interest only.',
        capture: 'email',
      },
      skoll: {
        id: 'skoll-02',
        status: 'theoretical',
        targetDate: '2028-05-13',
        summary: 'Small-car follow-on — longer range pack studies.',
        description:
          'Sköll 02 explores longer-range packs and family cargo without leaving the compact footprint. Theoretical until 01 gates clear.',
        capture: 'email',
      },
      geri: {
        id: 'geri-02',
        status: 'theoretical',
        targetDate: '2028-07-13',
        summary: 'Truck follow-on — heavier duty cycle.',
        description:
          'Geri 02 studies higher payload and corridor-support upfits for Demeter / Holm site logistics across the mosaic.',
        capture: 'email',
      },
      freki: {
        id: 'freki-02',
        status: 'theoretical',
        targetDate: '2028-09-13',
        summary: 'Rescue heli follow-on — night and ice packages.',
        description:
          'Freki 02 adds night-ops and extreme-cold mission kits in concept form. No flight schedule implied.',
        capture: 'email',
      },
      'dire-wolf': {
        id: 'dire-wolf-02',
        status: 'vision',
        targetDate: '2029-01-13',
        summary: 'Phase II — central plains segment.',
        description:
          'Phase II pushes Dire Wolf across the central plains: right-of-way coalitions, energy substations, and freight/people mix studies. Still a multi-year build — not an operating timetable.',
        capture: 'email',
        phases: true,
      },
    },
  },
  {
    id: '03',
    label: '03',
    cells: {
      fenrir: {
        id: 'fenrir-03',
        status: 'theoretical',
        targetDate: '2029-01-13',
        summary: 'Third motorcycle generation — pack systems mature.',
        description:
          'Fenrir 03 is a longer-horizon motorcycle generation once 01/02 field learning exists. Opacity rises; claims stay blueprint-honest.',
        capture: 'email',
      },
      hati: {
        id: 'hati-03',
        status: 'theoretical',
        targetDate: '2029-03-13',
        summary: 'ATV third wave — autonomous assist research.',
        description:
          'Hati 03 sketches driver-assist and convoy logic for remote work. Research register only.',
        capture: 'email',
      },
      skoll: {
        id: 'skoll-03',
        status: 'theoretical',
        targetDate: '2029-05-13',
        summary: 'Small-car third wave — shared fleet concepts.',
        description:
          'Sköll 03 explores shared and corridor-linked compact fleets. No consumer lease offer on this surface.',
        capture: 'email',
      },
      geri: {
        id: 'geri-03',
        status: 'theoretical',
        targetDate: '2029-07-13',
        summary: 'Truck third wave — rail-yard and site hybrids.',
        description:
          'Geri 03 ties truck logistics tighter to Dire Wolf yards and Holm/Demeter sites — concept coupling across halls.',
        capture: 'email',
      },
      freki: {
        id: 'freki-03',
        status: 'theoretical',
        targetDate: '2029-09-13',
        summary: 'Rescue heli third wave — corridor coverage net.',
        description:
          'Freki 03 studies a coverage net along the rail spine. Partner-operated; no Valhalla airline claim.',
        capture: 'email',
      },
      'dire-wolf': {
        id: 'dire-wolf-03',
        status: 'vision',
        targetDate: '2030-06-13',
        summary: 'Phase III — eastern approach toward NYC.',
        description:
          'Phase III carries Dire Wolf into the eastern approach and NYC metro interface. Permitting and urban interfaces dominate. Full transcontinental completion target remains August 13, 2031.',
        capture: 'email',
        phases: true,
      },
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
  body: 'Wolf Transit is a land-mobility arch: electric trail machines first, then ATV, car, truck, and rescue air — each named for a wolf of myth or deep history — culminating in Dire Wolf, a phased transcontinental railroad. We publish a product matrix, not a checkout cart. Fenrir 01 targets January 13, 2027; a new line or model lands every two months on that cadence. Predeposits opening soon. Until then, join the list with your email.',
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
    text: 'Central plains segment — freight and people mix, substations, and multi-state coalitions. Buildable chunks, not a single megabid fantasy.',
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

export function getWolfCell(lineId, rowId) {
  const row = wolfModelRows.find((r) => r.id === rowId)
  if (!row || row.mystery || !row.cells) return null
  return row.cells[lineId] || null
}

export function wolfCellOpacity(rowIndex, lineIndex, lineCount, rowCount) {
  const t = (rowIndex + lineIndex * 0.15) / Math.max(1, rowCount + lineCount * 0.15 - 1)
  return Math.max(0.2, 1 - t * 0.75)
}
