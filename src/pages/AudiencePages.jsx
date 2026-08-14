import { Link } from 'react-router-dom'
import EmailCapture from '../components/EmailCapture'
import { CONTACT_EMAIL, DISCORD_INVITE } from '../data/pressRelease'

function AudiencePage({ kind, title, lead, bullets }) {
  return (
    <div className="vh-page">
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
          title="Get updates"
          hint="Replies come from info@valhallaco.org."
          source={kind}
          audience={kind}
        />
        <p className="vh-aud__links">
          <Link to="/flow">Network flow</Link>
          <a href={DISCORD_INVITE} target="_blank" rel="noreferrer">
            Discord
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
      lead="Twelve companies across land, water, air, and space. Diligence first, no public securities offer here."
      bullets={[
        'One operating framework across the four domains.',
        'Refundable holds show demand before capital locks.',
        'Inquiries only: info@valhallaco.org.',
      ]}
    />
  )
}

export function ConsumersPage() {
  return (
    <AudiencePage
      kind="consumers"
      title="Consumers"
      lead="Hold a place on products you care about. Fully refundable until gates clear."
      bullets={[
        'Watch halls unlock on the mosaic.',
        'Company sites gather interest for each hall.',
        'Discord for drops and questions.',
      ]}
    />
  )
}

export function PartnersPage() {
  return (
    <AudiencePage
      kind="partners"
      title="Partners"
      lead="Manufacturers, operators, harbors, landowners, research labs."
      bullets={[
        'Each hall lists partner interest groups on its form.',
        'Flow chart shows how columns and pillars connect.',
        'Odin on Discord answers from the knowledge base.',
      ]}
    />
  )
}

export function ContactPage() {
  return (
    <div className="vh-page">
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
      <header className="vh-aud__hero">
        <p className="vh-aud__mark">Valhalla</p>
        <h1>Roadmap</h1>
        <p>
          Each hall has its own product path. Wolf’s later vision includes{' '}
          <strong>Dire Wolf</strong>, a phased SF→NYC railroad (complete by 2031).
        </p>
      </header>
      <main className="vh-aud__main">
        <p>
          Open a company from the <Link to="/">mosaic</Link> or the{' '}
          <Link to="/flow">flow</Link> for its product sequence.
        </p>
      </main>
    </div>
  )
}
