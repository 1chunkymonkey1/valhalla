import ProductMatrix from './ProductMatrix'
import { getHallMatrix } from '../../data/hallMatrices'

/**
 * All twelve halls use the square product matrix.
 * Legacy oval track removed, detail lives on /{company}/{product-slug}.
 */
export default function ProductRoadmap({ companyId }) {
  const matrix = getHallMatrix(companyId)
  if (!matrix) return null
  return <ProductMatrix companyId={companyId} />
}
