import { Link } from 'react-router-dom'
import { isHubRevealed } from '../data/schedule'

export default function MosaicTile({ company, now }) {
  const revealed = isHubRevealed(company, now)

  if (!revealed) {
    return (
      <div
        className="aspect-square border border-black/5 bg-white transition-all duration-700"
        aria-hidden
      />
    )
  }

  return (
    <Link
      to={`/${company.slug}`}
      className="group aspect-square flex flex-col items-center justify-center p-3 text-center transition-all duration-700 animate-tile-in"
      style={{ backgroundColor: company.accent }}
    >
      <span className="font-mono text-[10px] text-white/50 mb-1">
        {String(company.id).padStart(2, '0')}
      </span>
      <span className="text-sm sm:text-base font-medium text-white leading-tight group-hover:underline underline-offset-2">
        {company.name}
      </span>
    </Link>
  )
}
