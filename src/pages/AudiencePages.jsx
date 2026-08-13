import { Link } from 'react-router-dom'
import SiteMenu from '../components/layout/SiteMenu'
import EmailCapture from '../components/EmailCapture'
import { CONTACT_EMAIL, DISCORD_INVITE } from '../data/pressRelease'

function AudiencePage({ kind, title, lead, bullets }) {
  return (
    <div className="vh-page">
      <SiteMenu />
      <header className="vh-aud__hero">
        <p className="vh-aud__mark">Valhalla</p>
        <h1>{title}</h1>
        <p>{lead}</p>
      </header>
      <main className="vh-aud__main">
        <ul>
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <EmailCapture
          title="Request briefings"
          hint="We’ll reply from info@valhallaco.org when the next window opens."
          source={kind}
          audience={kind}
        />
        <p className="vh-aud__links">
          <Link to="/flow">See the network flow</Link>
          <a href={DISCORD_INVITE} target="_blank" rel="noreferrer">
            Join Discord
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`}>Email</a>
        </p>
      </main>
    </div>
  )
}

export function InvestorsPage() {
  return (
    <AudiencePage
      kind="investors"
      title="Investors"
      lead="Civilization infrastructure across twelve companies — diligence with clear non-claims."
      bullets={[
        'Unified operating framework across land, water, air, and space.',
        'Refundable reservation ledgers measure real demand before capital locks.',
        'No public securities offer on this surface — inquiries only via info@valhallaco.org.',
      ]}
    />
  )
}

export function ConsumersPage() {
  return (
    <AudiencePage
      kind="consumers"
      title="Consumers"
      lead="Hold a place on products you believe in — fully refundable until gates clear."
      bullets={[
        'Browse the living mosaic as halls unlock.',
        'Company sites take refundable holds and email interest — not forced deposits.',
        'Discord community for drops, questions, and hall talk.',
      ]}
    />
  )
}

export function PartnersPage() {
  return (
    <AudiencePage
      kind="partners"
      title="Partners"
      lead="Manufacturers, operators, harbors, landowners, and research labs — build with the matrix."
      bullets={[
        'Each hall lists partner interest groups on its reservation form.',
        'Flow chart shows how columns and pillars reinforce each other.',
        'Odin (Discord) answers from the curated knowledge base — no false ops claims.',
      ]}
    />
  )
}

export function ContactPage() {
  return (
    <div className="vh-page">
      <SiteMenu />
      <header className="vh-aud__hero">
        <p className="vh-aud__mark">Valhalla</p>
        <h1>Contact</h1>
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <br />
          (209) 768-4306
        </p>
      </header>
      <main className="vh-aud__main">
        <EmailCapture source="contact" audience="contact" title="Write us" />
        <p className="vh-aud__links">
          <a href={DISCORD_INVITE} target="_blank" rel="noreferrer">
            Discord
          </a>
          <Link to="/press">Press release</Link>
          <Link to="/admin">Admin</Link>
        </p>
      </main>
    </div>
  )
}

export function RoadmapIndexPage() {
  return (
    <div className="vh-page">
      <SiteMenu />
      <header className="vh-aud__hero">
        <p className="vh-aud__mark">Valhalla</p>
        <h1>Roadmap</h1>
        <p>
          Each hall carries its own oval path — first product clear, later ones fading into mystery.
          Wolf’s second-to-last vision is the <strong>Bifröst Line</strong> (SF→NYC maglev).
        </p>
      </header>
      <main className="vh-aud__main">
        <p>
          Open a company from the <Link to="/">mosaic</Link> or the{' '}
          <Link to="/flow">flow chart</Link> to walk its product sequence. Theoretical items take
          email only; mystery ovals stay sealed.
        </p>
      </main>
    </div>
  )
}
