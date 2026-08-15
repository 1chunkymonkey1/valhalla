import { Link } from 'react-router-dom'

export default function AphroditeHomePage() {
  return (
    <div className="aph-home">
      <section className="aph-hero">
        <p className="aph-hero__eyebrow">Valhalla · Aphrodite</p>
        <h1>Match through competition.</h1>
        <p className="aph-hero__lede">
          Dating for people who keep score — chess, sports, Clash Royale, and every arena
          where skill shows first.
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
          <h2>Match, then meet</h2>
          <p>
            Swipe a focused deck of members. Mutual likes become matches — no endless feed, no
            noise for noise’s sake.
          </p>
        </article>
        <article>
          <h2>Membership, not ads</h2>
          <p>
            Twenty dollars a month keeps the room paid and intentional. Card on file via Stripe.
            Your signup and approval dates stay on your account.
          </p>
        </article>
      </section>
    </div>
  )
}
