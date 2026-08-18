import { Link } from 'react-router-dom'
import { GAMES_COMING_SOON } from '../../data/fallingRunes'

export default function GamesHubPage() {
  return (
    <>
      <h1>Games</h1>
      <p className="vg__lede">
        Practice tables. No money, no servers live, no invented player counts. Chess and poker run
        in the browser. Everything else is a placeholder until it actually ships.
      </p>

      <section className="vg__section">
        <h2>Play now</h2>
        <ul className="vg__grid">
          <li>
            <Link to="/games/chess">
              <strong>Chess</strong>
              <span>Learn the pieces. Play a game. Run a clock.</span>
            </Link>
          </li>
          <li>
            <Link to="/games/poker">
              <strong>Poker</strong>
              <span>Learn rankings. Practice a Hold’em showdown. No stakes.</span>
            </Link>
          </li>
        </ul>
      </section>

      <section className="vg__section">
        <h2>Coming soon</h2>
        <p>Not live. There is nothing to join yet.</p>
        <ul className="vg__soon">
          {GAMES_COMING_SOON.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong>
              <span>Coming soon</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
