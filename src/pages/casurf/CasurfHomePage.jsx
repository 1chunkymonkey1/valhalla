import { Link } from 'react-router-dom'
import { CASURF, TEAM } from '../../data/casurf'
import CasurfPhoto from '../../components/casurf/CasurfPhoto'

export default function CasurfHomePage() {
  return (
    <>
      <section className="cs-hero">
        <div className="cs-hero__bg" aria-hidden>
          <CasurfPhoto stem="/casurf/gallery/night-campanile" alt="" />
        </div>
        <div className="cs-hero__copy">
          <p className="cs-kicker">{CASURF.kicker}</p>
          <h1>
            Berkeley
            <br />
            <em>Chapter of</em>
            <br />
            CA-SURF
          </h1>
          <p>
            A grassroots campus chapter of the California Alliance of Students United for a
            Reformed Future — organizing locally, linked statewide.
          </p>
          <div className="cs-row">
            <Link className="cs-btn cs-btn--gold" to="/casurfberkeley/contact">
              Join the chapter
            </Link>
            <Link className="cs-btn cs-btn--ghost" to="/casurfberkeley/gallery">
              View gallery
            </Link>
            <a className="cs-btn cs-btn--ghost" href={CASURF.instagramUrl} target="_blank" rel="noreferrer">
              @{CASURF.instagram}
            </a>
          </div>
        </div>
        <aside className="cs-hero__aside">
          <div className="cs-stat">
            <b>Cal</b>
            <span>UC Berkeley</span>
          </div>
          <div className="cs-stat">
            <b>4</b>
            <span>Chapter officers</span>
          </div>
          <div className="cs-stat">
            <b>
              <a href={CASURF.parentUrl} style={{ color: 'inherit', textDecoration: 'none' }}>
                Network
              </a>
            </b>
            <span>casurf.vote</span>
          </div>
        </aside>
      </section>

      <section className="cs-sec cs-sec--white">
        <div className="cs-wrap">
          <p className="cs-eyebrow">The chapter</p>
          <h2 className="cs-h2">Who we are</h2>
          <p className="cs-lead">
            CA-SURF Berkeley is the UC Berkeley chapter of a confirmed statewide student network.
            We organize on campus and in nearby cities, and we plug into CA-SURF’s rapid-response
            work across California.
          </p>
          <div className="cs-row">
            <Link className="cs-btn cs-btn--navy" to="/casurfberkeley/about">
              Mission
            </Link>
            <a className="cs-btn cs-btn--navy" href={CASURF.parentUrl} target="_blank" rel="noreferrer">
              Parent organization
            </a>
          </div>
        </div>
      </section>

      <section className="cs-sec">
        <div className="cs-wrap">
          <p className="cs-eyebrow">Leadership</p>
          <h2 className="cs-h2">The team</h2>
          <div className="cs-team">
            {TEAM.map((person) => (
              <article key={person.id} className="cs-card">
                <CasurfPhoto
                  stem={person.photo}
                  alt={person.name}
                  comingSoon={person.photoSoon}
                />
                <div className="cs-card__meta">
                  <h3>{person.name}</h3>
                  <p>{person.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cs-sec cs-sec--white">
        <div className="cs-wrap">
          <p className="cs-eyebrow">From Berkeley</p>
          <h2 className="cs-h2">Gallery</h2>
          <p className="cs-lead">Browse campus and Bay photos. Favorite, share, download, or start a slideshow — no donations on this site.</p>
          <Link className="cs-btn cs-btn--navy" to="/casurfberkeley/gallery">
            Open gallery
          </Link>
        </div>
      </section>
    </>
  )
}
