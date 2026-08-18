import { Link, Outlet } from 'react-router-dom'

export default function GamesLayout() {
  return (
    <div className="vg">
      <header className="vg__hero">
        <p className="vg__eyebrow">Valhalla · Games</p>
        <nav className="vg__nav" aria-label="Games">
          <Link to="/games">Hall</Link>
          <Link to="/games/chess">Chess</Link>
          <Link to="/games/poker">Poker</Link>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
