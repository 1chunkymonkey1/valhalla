import { Link } from 'react-router-dom'
import { getBrandImage, isHubRevealed } from '../data/schedule'

/** Legacy tile kept for compatibility; hub uses MosaicFrame. */
export default function MosaicTile({ company, now }) {
  const revealed = isHubRevealed(company, now)

  if (!revealed) {
    return <div className="aspect-[3/2] border border-black/[0.04] bg-white" aria-hidden />
  }

  return (
    <Link
      to={`/${company.slug}`}
      className="group relative aspect-[3/2] overflow-hidden animate-tile-in"
    >
      <img
        src={getBrandImage(company.slug)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-end p-2 pb-3 text-center text-white">
        <span className="text-xs font-medium sm:text-sm">{company.name}</span>
      </div>
    </Link>
  )
}
