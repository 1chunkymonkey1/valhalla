import { Link } from 'react-router-dom'

export default function AphroditeHomePage() {
  return (
    <div className="aph-home">
      <section className="aph-hero">
        <p className="aph-hero__eyebrow">Valhalla · Aphrodite · 18+</p>
        <h1>Match through competition.</h1>
        <p className="aph-hero__lede">
          Dating for people who keep score — chess, sports, Clash Royale, and every arena
          where skill shows first. Membership is $20/month. Members are 18 and older.
        </p>
        <div className="aph-hero__actions">
          <Link className="aph-btn aph-btn--solid" to="/aphrodite/sign-up">
            Join · $20/month
          </Link>
          <Link className="aph-btn aph-btn--ghost" to="/aphrodite/sign-in">
            Sign in
          </Link>
        </div>
      </section>

      <section className="aph-grid">
        <article>
          <h2>Competitors only</h2>
          <p>
            Link Chess.com, MaxPreps, Instagram, and Clash Royale so your profile reads like a
            record, not a brochure.
          </p>
        </article>
        <article>
          <h2>Match, then talk</h2>
          <p>
            Swipe a focused deck. Mutual likes open a private thread. Block and report stay one
            tap away.
          </p>
        </article>
        <article>
          <h2>Membership, not ads</h2>
          <p>
            Twenty dollars a month keeps the room paid. Web billing is Stripe. The iOS App Store
            build bills through Apple.
          </p>
        </article>
      </section>
    </div>
  )
}
