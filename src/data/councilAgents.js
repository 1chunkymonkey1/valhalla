/** Council agent roster (prompts live server-side in api/_lib/councilAgentDefs.js). */
export const COUNCIL_AGENTS = [
  {
    "id": "athena",
    "name": "Athena",
    "role": "Strategic intelligence",
    "hall": "corvus"
  },
  {
    "id": "apollo",
    "name": "Apollo",
    "role": "Brand, narrative, and public presence",
    "hall": "hub"
  },
  {
    "id": "asclepius",
    "name": "Asclepius",
    "role": "Health, recovery, and founder stamina",
    "hall": "hub"
  },
  {
    "id": "daedalus",
    "name": "Daedalus",
    "role": "Systems design and architecture",
    "hall": "corvus"
  },
  {
    "id": "demeter",
    "name": "Demeter",
    "role": "Land energy and agrivoltaics",
    "hall": "demeter"
  },
  {
    "id": "helios",
    "name": "Helios",
    "role": "Brand and narrative intelligence",
    "hall": "hub"
  },
  {
    "id": "hephaestus",
    "name": "Hephaestus",
    "role": "Manufacturing, build, and platforms",
    "hall": "corvus"
  },
  {
    "id": "hermes",
    "name": "Hermes",
    "role": "Communications, routing, and outreach",
    "hall": "hub"
  },
  {
    "id": "icarus",
    "name": "Icarus",
    "role": "Commander \u2014 Raven Intelligence Network",
    "hall": "hub"
  },
  {
    "id": "lex",
    "name": "Lex",
    "role": "Legal intelligence",
    "hall": "hub"
  },
  {
    "id": "natasha",
    "name": "Natasha",
    "role": "Frameworks and operating systems",
    "hall": "hub"
  },
  {
    "id": "poseidon",
    "name": "Poseidon",
    "role": "Maritime and water domain",
    "hall": "viking"
  },
  {
    "id": "seshat",
    "name": "Seshat",
    "role": "Language, measurement, and canon",
    "hall": "hub"
  },
  {
    "id": "sol",
    "name": "Sol",
    "role": "Atoll product & solar presentation",
    "hall": "atoll"
  },
  {
    "id": "teddy",
    "name": "Teddy",
    "role": "Abundance doctrine and Jefferson line",
    "hall": "hub"
  },
  {
    "id": "thor",
    "name": "Thor",
    "role": "Wolf / land movement doctrine",
    "hall": "wolf"
  },
  {
    "id": "victory",
    "name": "Victory",
    "role": "Performance and competitive excellence",
    "hall": "hub"
  },
  {
    "id": "zeus",
    "name": "Zeus",
    "role": "Sky/space boundary and Phenix",
    "hall": "phenix"
  }
]

export const COUNCIL_AGENT_BY_ID = Object.fromEntries(
  COUNCIL_AGENTS.map((a) => [a.id, a]),
)
