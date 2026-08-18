import { Link } from 'react-router-dom'
import {
  EASON_ACADEMICS,
  EASON_CIVIC,
  EASON_EXPLORATION,
  EASON_PROJECTS,
  EASON_SOCIALS,
  easonHallWork,
} from '../data/easonPage'

function ExtLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

function WorkLink({ item, children }) {
  if (!item.href) return <span>{children}</span>
  if (item.external) return <ExtLink href={item.href}>{children}</ExtLink>
  return <Link to={item.href}>{children}</Link>
}

export default function EasonPage() {
  const halls = easonHallWork()

  return (
    <div className="eg">
      <header className="eg__hero">
        <p className="eg__eyebrow">Valhalla · Icarus</p>
        <h1>Eason Greene</h1>
        <p className="eg__lede">
          Californian Viking. Managing Partner, Edna Capital. Commander of Valhalla. Student at UC
          Berkeley.
        </p>
        <ul className="eg__socials">
          <li>
            <ExtLink href={EASON_SOCIALS.x}>X</ExtLink>
          </li>
          <li>
            <ExtLink href={EASON_SOCIALS.instagram}>Instagram</ExtLink>
          </li>
          <li>
            <ExtLink href={EASON_SOCIALS.linkedin}>LinkedIn</ExtLink>
          </li>
        </ul>
      </header>

      <nav className="eg__jump" aria-label="Eason sections">
        <a href="#business">Business</a>
        <a href="#projects">Projects</a>
        <a href="#academics">Academics</a>
        <a href="#exploration">Exploration</a>
        <a href="#civic">Civic engagement</a>
      </nav>

      <section id="business" className="eg__section">
        <h2>Business</h2>
        <p>
          The mosaic halls on Valhalla — plus Meridian beneath them. Each name opens the Valhalla
          subpage, not a Netlify original.
        </p>
        <ul className="eg__grid">
          {halls.map((h) => (
            <li key={h.id}>
              <Link to={h.href}>
                <strong>{h.name}</strong>
                <span>
                  {h.kind === 'layer' ? 'materials layer' : `${h.domain} · ${h.pillar}`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="projects" className="eg__section">
        <h2>Projects</h2>
        <ul className="eg__list">
          {EASON_PROJECTS.map((p) => (
            <li key={p.id}>
              <WorkLink item={p}>
                <strong>{p.name}</strong>
              </WorkLink>
              <span>{p.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="academics" className="eg__section">
        <h2>Academics</h2>
        <ul className="eg__list">
          {EASON_ACADEMICS.map((a) => (
            <li key={a.id}>
              {a.href ? (
                <Link to={a.href}>
                  <strong>{a.name}</strong>
                </Link>
              ) : (
                <strong>{a.name}</strong>
              )}
              <span>{a.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="exploration" className="eg__section">
        <h2>Exploration</h2>
        <ul className="eg__chips">
          {EASON_EXPLORATION.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      <section id="civic" className="eg__section">
        <h2>Civic engagement</h2>
        <ul className="eg__list">
          {EASON_CIVIC.map((c) => (
            <li key={c.id}>
              <WorkLink item={c}>
                <strong>{c.name}</strong>
              </WorkLink>
              <span>{c.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="eg__foot">
        <p>Not because it is easy. Because it is hard.</p>
        <p>As you wish.</p>
        <p>
          <Link to="/">← mosaic</Link>
        </p>
      </footer>
    </div>
  )
}
