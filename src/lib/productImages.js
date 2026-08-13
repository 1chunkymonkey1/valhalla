import { productImageUrl } from '../data/productImageManifest'

/**
 * Resolve a product still for matrix / detail pages.
 * Prefers an explicit cell.image or line.image; otherwise uses the
 * filesystem manifest from `npm run sync:product-images`.
 */
export function resolveProductImage(companyId, cell, line) {
  if (cell?.image) return cell.image
  if (line?.image) return line.image
  if (cell?.id) return productImageUrl(companyId, cell.id)
  return null
}
