import { Link } from 'react-router-dom'
import SiteMenu from '../components/layout/SiteMenu'
import { pressRelease, DISCORD_INVITE, CONTACT_EMAIL } from '../data/pressRelease'

export default function PressPage() {
  const p = pressRelease
  return (
    <div className="vh-page">
      <SiteMenu />
      <article className="vh-press">
        <header className="vh-press__mast">
          <p className="vh-press__org">{p.org}</p>
          <p>
            {p.contactName}
            <br />
            <a href={`mailto:${p.contactEmail}`}>{p.contactEmail}</a>
            <br />
            {p.contactPhone}
            <br />
            {p.date}
          </p>
          <p className="vh-press__status">{p.status}</p>
          <h1>{p.headline}</h1>
        </header>

        {p.paragraphs.map((para) => (
          <p key={para.slice(0, 48)}>
            {para.startsWith('VALHALLA announced') ? (
              <>
                <strong>{p.dateline} — </strong>
                {para}
              </>
            ) : (
              para
            )}
          </p>
        ))}

        <ul className="vh-press__domains">
          {p.domains.map((d) => (
            <li key={d.name}>
              <strong>{d.name}:</strong> {d.text}
            </li>
          ))}
        </ul>

        <blockquote className="vh-press__quote">
          <p>“{p.quote.text}”</p>
          <cite>— {p.quote.attribution}</cite>
        </blockquote>

        {p.closingParagraphs.map((para) => (
          <p key={para.slice(0, 40)}>{para}</p>
        ))}

        <ul>
          {p.capabilities.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>

        <p>{p.finale}</p>

        <footer className="vh-press__foot">
          <Link to="/">← Hub</Link>
          <a href={DISCORD_INVITE} target="_blank" rel="noreferrer">
            Discord
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
        </footer>
      </article>
    </div>
  )
}
