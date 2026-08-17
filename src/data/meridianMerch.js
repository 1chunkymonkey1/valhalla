/**
 * Meridian merch for the twelve halls.
 * Each hall announces that merch is cut by Meridian (Earth Line).
 * Public surface is a list, not a cart. No shipping or in-stock claims.
 */

import { GRID_ORDER, getCompany } from '../lib/companies.js'

export const MERCH_STATUS = 'Earth Line · September 2026 target'
export const MERCH_POSTURE =
  'This is the list, not a cart. No funds are taken for merch on this surface.'

const PIECES = {
  shirt: {
    piece: 'shirt',
    garment: 'The Shirt',
    material: 'Cotton-modal. Meridian Earth Line, hall-marked.',
  },
  jacket: {
    piece: 'jacket',
    garment: 'The Jacket',
    material:
      'Waxed organic cotton twill with internal Dyneema panels. Meridian Earth Line, hall-marked.',
  },
  pants: {
    piece: 'pants',
    garment: 'The Pants',
    material:
      'Self-cleaning stain-trapping polymer. Carbon colorway. The Earth Line founding piece.',
  },
}

/** Hall announcement + merch naming. Mosaic halls only; Meridian is the cutter. */
export const hallMerch = {
  wolf: {
    statement: 'Wolf wears Meridian.',
    body: 'Pack merch is cut from the materials layer. Shirt and jacket, hall-marked.',
    shirtName: 'Pack Shirt',
    jacketName: 'Pack Jacket',
    shirtDoes: 'Cotton-modal shirt with the Wolf mark. Built to be worn and repaired.',
    jacketDoes: 'Field jacket for the corridor. Waxed twill, Dyneema inside, Wolf mark.',
  },
  holm: {
    statement: 'Holm wears Meridian.',
    body: 'House merch is cut from the materials layer. Shirt and jacket, hall-marked.',
    shirtName: 'House Shirt',
    jacketName: 'House Jacket',
    shirtDoes: 'Cotton-modal shirt for the build site. Holm mark on the cloth.',
    jacketDoes: 'Field jacket for terrain work. Waxed twill, Dyneema inside, Holm mark.',
  },
  demeter: {
    statement: 'Demeter wears Meridian.',
    body: 'Field merch is cut from the materials layer. Shirt and jacket, hall-marked.',
    shirtName: 'Field Shirt',
    jacketName: 'Field Jacket',
    shirtDoes: 'Cotton-modal shirt for the acre. Demeter mark on the cloth.',
    jacketDoes: 'Field jacket for farm days. Waxed twill, Dyneema inside, Demeter mark.',
  },
  viking: {
    statement: 'Viking wears Meridian.',
    body: 'Deck merch is cut from the materials layer. Shirt and jacket, hall-marked.',
    shirtName: 'Deck Shirt',
    jacketName: 'Deck Jacket',
    shirtDoes: 'Cotton-modal shirt for the voyage. Viking mark on the cloth.',
    jacketDoes: 'Field jacket for cold water. Waxed twill, Dyneema inside, Viking mark.',
  },
  atoll: {
    statement: 'Atoll wears Meridian.',
    body: 'Shore merch is cut from the materials layer. Shirt and jacket, hall-marked.',
    shirtName: 'Shore Shirt',
    jacketName: 'Shore Jacket',
    shirtDoes: 'Cotton-modal shirt for the lagoon edge. Atoll mark on the cloth.',
    jacketDoes: 'Field jacket for wet air. Waxed twill, Dyneema inside, Atoll mark.',
  },
  njord: {
    statement: 'Njord wears Meridian.',
    body: 'Water merch is cut from the materials layer. Shirt and jacket, hall-marked.',
    shirtName: 'Water Shirt',
    jacketName: 'Water Jacket',
    shirtDoes: 'Cotton-modal shirt for the molecule. Njord mark on the cloth.',
    jacketDoes: 'Field jacket for spray and mist. Waxed twill, Dyneema inside, Njord mark.',
  },
  eagle: {
    statement: 'Eagle wears Meridian.',
    body: 'Flight merch is cut from the materials layer. Shirt and jacket, hall-marked.',
    shirtName: 'Flight Shirt',
    jacketName: 'Flight Jacket',
    shirtDoes: 'Cotton-modal shirt for the sky. Eagle mark on the cloth.',
    jacketDoes: 'Field jacket for thin air. Waxed twill, Dyneema inside, Eagle mark.',
  },
  olympus: {
    statement: 'Olympus wears Meridian.',
    body: 'Cloud merch is cut from the materials layer. Shirt and jacket, hall-marked.',
    shirtName: 'Cloud Shirt',
    jacketName: 'Cloud Jacket',
    shirtDoes: 'Cotton-modal shirt for the platform. Olympus mark on the cloth.',
    jacketDoes: 'Field jacket for altitude. Waxed twill, Dyneema inside, Olympus mark.',
  },
  aeolus: {
    statement: 'Aeolus wears Meridian.',
    body: 'Sky merch is cut from the materials layer. Shirt and jacket, hall-marked.',
    shirtName: 'Sky Shirt',
    jacketName: 'Sky Jacket',
    shirtDoes: 'Cotton-modal shirt for the atmosphere. Aeolus mark on the cloth.',
    jacketDoes: 'Field jacket for wind. Waxed twill, Dyneema inside, Aeolus mark.',
  },
  phenix: {
    statement: 'Phénix wears Meridian.',
    body: 'Launch merch is cut from the materials layer. Shirt and jacket, hall-marked.',
    shirtName: 'Launch Shirt',
    jacketName: 'Launch Jacket',
    shirtDoes: 'Cotton-modal shirt for the pad. Phénix mark on the cloth.',
    jacketDoes: 'Field jacket for ember heat. Waxed twill, Dyneema inside, Phénix mark.',
  },
  aether: {
    statement: 'Aether wears Meridian.',
    body: 'Orbit merch is cut from the materials layer. Shirt and jacket, hall-marked. The garment name is Orbit, not Claim.',
    shirtName: 'Orbit Shirt',
    jacketName: 'Orbit Jacket',
    shirtDoes: 'Cotton-modal shirt for quiet orbit. Aether mark on the cloth. Not a deed.',
    jacketDoes: 'Field jacket for quiet orbit. Waxed twill, Dyneema inside, Aether mark. Not a title.',
  },
  corvus: {
    statement: 'Corvus wears Meridian.',
    body: 'Mind merch is cut from the materials layer. Shirt and jacket, hall-marked.',
    shirtName: 'Mind Shirt',
    jacketName: 'Mind Jacket',
    shirtDoes: 'Cotton-modal shirt for the spine. Corvus mark on the cloth.',
    jacketDoes: 'Field jacket for the night desk. Waxed twill, Dyneema inside, Corvus mark.',
  },
}

export const meridianAnnouncement = {
  statement: 'Meridian cuts merch for every hall.',
  body: 'Earth Line founding pieces in Carbon, then hall-marked shirts and jackets for the twelve. September 2026 research target. This is the list, not a cart.',
}

function hallItem(companyId, piece) {
  const company = getCompany(companyId)
  const hall = hallMerch[companyId]
  const spec = PIECES[piece]
  const name = piece === 'shirt' ? hall.shirtName : hall.jacketName
  const does = piece === 'shirt' ? hall.shirtDoes : hall.jacketDoes
  return {
    id: `${companyId}-${piece}`,
    sku: piece,
    companyId,
    hallName: company.name,
    name,
    garment: spec.garment,
    piece,
    material: spec.material,
    does,
    imageSrc: company.imageSrc,
    statement: hall.statement,
    href: `/${companyId}/merch/${piece}`,
    cutter: 'Meridian',
    status: MERCH_STATUS,
  }
}

function meridianItem(piece, name, does) {
  const spec = PIECES[piece]
  const company = getCompany('meridian')
  return {
    id: `meridian-${piece}`,
    sku: piece,
    companyId: 'meridian',
    hallName: 'Meridian',
    name,
    garment: spec.garment,
    piece,
    material: spec.material,
    does,
    imageSrc: company.imageSrc || company.placeholderSrc,
    statement: meridianAnnouncement.statement,
    href: `/meridian/merch/${piece}`,
    cutter: 'Meridian',
    status: MERCH_STATUS,
  }
}

export const meridianCarbonLine = [
  meridianItem(
    'pants',
    'The Pants',
    'One pair meant to replace dozens of purchases a year. Carbon colorway. Earth Line founding piece.',
  ),
  meridianItem(
    'shirt',
    'The Shirt',
    'Cotton-modal shirt in Carbon. Founding Earth Line piece, unmarked by hall.',
  ),
  meridianItem(
    'jacket',
    'The Jacket',
    'Waxed organic cotton twill field jacket with internal Dyneema panels. Carbon colorway.',
  ),
]

export function getHallAnnouncement(companyId) {
  if (companyId === 'meridian') return meridianAnnouncement
  const hall = hallMerch[companyId]
  if (!hall) return null
  return { statement: hall.statement, body: hall.body }
}

export function merchItemsForCompany(companyId) {
  if (companyId === 'meridian') return meridianCarbonLine
  if (!hallMerch[companyId]) return []
  return [hallItem(companyId, 'shirt'), hallItem(companyId, 'jacket')]
}

export function getMerchItem(companyId, sku) {
  return merchItemsForCompany(companyId).find((item) => item.sku === sku) || null
}

/** All hall-marked merch, mosaic order, then Meridian Carbon. */
export function allHallMerch() {
  return GRID_ORDER.flatMap((id) => merchItemsForCompany(id))
}

export function allMerchItems() {
  return [...meridianCarbonLine, ...allHallMerch()]
}

export function mosaicHallsWithMerch() {
  return GRID_ORDER.map((id) => {
    const company = getCompany(id)
    const announcement = getHallAnnouncement(id)
    return {
      id,
      name: company.name,
      domain: company.domain,
      imageSrc: company.imageSrc,
      announcement,
      items: merchItemsForCompany(id),
      href: `/${id}#merch`,
      shopHref: `/${id}/merch`,
    }
  })
}
