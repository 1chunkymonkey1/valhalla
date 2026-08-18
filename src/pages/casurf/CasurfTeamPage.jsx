import { TEAM } from '../../data/casurf'
import CasurfPhoto from '../../components/casurf/CasurfPhoto'

export default function CasurfTeamPage() {
  return (
    <section className="cs-sec cs-sec--white">
      <div className="cs-wrap">
        <p className="cs-eyebrow">Leadership</p>
        <h1 className="cs-h2">The team</h1>
        <p className="cs-lead">UC Berkeley chapter officers for CA-SURF.</p>
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
  )
}
