export const LAUNCH_DATE = '2026-08-13'
export const TIMEZONE = 'America/Los_Angeles'
export const HUB_REVEAL_DELAY_MS = 30 * 60 * 1000

/** First drop — grid appears and tile #1 unlocks at 8:00 AM PDT */
export const EVENT_START = `${LAUNCH_DATE}T08:00:00-07:00`

export const schedule = [
  {
    id: 1,
    slug: 'aegis-forge',
    name: 'Aegis Forge',
    launchTime: `${LAUNCH_DATE}T08:00:00-07:00`,
    concept: 'Modular exoskeletal armor forged from reclaimed battlefield steel',
    tag: 'Viking Smithy × Nano-Fabrication',
    accent: '#1a1a2e',
  },
  {
    id: 2,
    slug: 'runelink-systems',
    name: 'RuneLink Systems',
    launchTime: `${LAUNCH_DATE}T09:00:00-07:00`,
    concept: 'Quantum-encrypted mesh networks inscribed with elder rune protocols',
    tag: 'Elder Futhark × Mesh Computing',
    accent: '#16213e',
  },
  {
    id: 3,
    slug: 'obsidian-cartography',
    name: 'Obsidian Cartography',
    launchTime: `${LAUNCH_DATE}T10:00:00-07:00`,
    concept: 'Holographic terrain mapping etched on volcanic glass substrates',
    tag: 'Ptolemaic Charts × LiDAR Holography',
    accent: '#0f3460',
  },
  {
    id: 4,
    slug: 'iron-covenant',
    name: 'Iron Covenant',
    launchTime: `${LAUNCH_DATE}T11:00:00-07:00`,
    concept: 'Decentralized guild contracts bound by smart-chain oaths',
    tag: 'Medieval Guild Law × Smart Contracts',
    accent: '#533483',
  },
  {
    id: 5,
    slug: 'helios-reactor',
    name: 'Helios Reactor',
    launchTime: `${LAUNCH_DATE}T13:00:00-07:00`,
    concept: 'Micro-fusion cells harnessing solar plasma in palm-sized cores',
    tag: 'Apollo Cult × Fusion Microreactors',
    accent: '#e94560',
  },
  {
    id: 6,
    slug: 'bifrost-transit',
    name: 'Bifrost Transit',
    launchTime: `${LAUNCH_DATE}T14:00:00-07:00`,
    concept: 'Hyperloop corridors bridging continents through prismatic gateways',
    tag: 'Rainbow Bridge Myth × Maglev Networks',
    accent: '#f39422',
  },
  {
    id: 7,
    slug: 'oracle-nexus',
    name: 'Oracle Nexus',
    launchTime: `${LAUNCH_DATE}T15:00:00-07:00`,
    concept: 'Predictive AI oracles channeling Delphi-grade probabilistic foresight',
    tag: 'Delphic Prophecy × Neural Forecasting',
    accent: '#2d6a4f',
  },
  {
    id: 8,
    slug: 'titan-foundry',
    name: 'Titan Foundry',
    launchTime: `${LAUNCH_DATE}T16:00:00-07:00`,
    concept: 'Industrial 3D printing at scale using asteroid-mined alloys',
    tag: 'Hephaestus Forge × Orbital Manufacturing',
    accent: '#606c38',
  },
  {
    id: 9,
    slug: 'valkyrie-medical',
    name: 'Valkyrie Medical',
    launchTime: `${LAUNCH_DATE}T17:00:00-07:00`,
    concept: 'Battlefield triage drones deploying regenerative nanomed pods',
    tag: 'Battlefield Healers × Autonomous Medevac',
    accent: '#bc6c25',
  },
  {
    id: 10,
    slug: 'midgard-agriculture',
    name: 'Midgard Agriculture',
    launchTime: `${LAUNCH_DATE}T18:00:00-07:00`,
    concept: 'Vertical terraforming farms growing crops in permafrost domes',
    tag: 'Fertile Crescent × Vertical Terraforming',
    accent: '#386641',
  },
  {
    id: 11,
    slug: 'einherjar-defense',
    name: 'Einherjar Defense',
    launchTime: `${LAUNCH_DATE}T19:00:00-07:00`,
    concept: 'Autonomous drone swarms coordinated by warrior-AI command nodes',
    tag: 'Einherjar Legion × Swarm Robotics',
    accent: '#283618',
  },
  {
    id: 12,
    slug: 'valhalla-collective',
    name: 'Valhalla Collective',
    launchTime: `${LAUNCH_DATE}T20:00:00-07:00`,
    concept: 'The culminating drop — unified access pass to all twelve platforms',
    tag: 'Great Hall × Unified Platform Pass',
    accent: '#03045e',
  },
]

export function getCompanyBySlug(slug) {
  return schedule.find((c) => c.slug === slug)
}

export function getNextCompany(company) {
  return schedule.find((c) => c.id === company.id + 1) ?? null
}

/** Site goes live at the top of its hour */
export function getSiteLiveTime(company) {
  return new Date(company.launchTime)
}

/**
 * Hub mosaic reveal:
 * - Tile #1 at 8:00 AM (when the grid first appears)
 * - Tiles #2–12 at launch + 30 minutes
 */
export function getHubRevealTime(company) {
  const launch = new Date(company.launchTime)
  if (company.id === 1) return launch
  return new Date(launch.getTime() + HUB_REVEAL_DELAY_MS)
}

export function isSiteLive(company, now = new Date()) {
  return now >= getSiteLiveTime(company)
}

export function isHubRevealed(company, now = new Date()) {
  return now >= getHubRevealTime(company)
}

export function isEventStarted(now = new Date()) {
  return now >= new Date(EVENT_START)
}
