import { CASURF, DIRECTIVES } from '../../data/casurf'

export default function CasurfAboutPage() {
  return (
    <section className="cs-sec cs-sec--white">
      <div className="cs-wrap">
        <p className="cs-eyebrow">Our mission</p>
        <h1 className="cs-h2">Two directives</h1>
        <p className="cs-lead">
          {CASURF.name} follows the same two-level charge as the statewide network:{' '}
          {CASURF.tagline}. Local work stays with the chapter. Statewide unity is coordinated
          through{' '}
          <a href={CASURF.parentUrl} target="_blank" rel="noreferrer">
            casurf.vote
          </a>
          .
        </p>
        <div className="cs-dir">
          {DIRECTIVES.map((d) => (
            <article key={d.n}>
              <b>
                {d.n} · {d.scale}
              </b>
              <h3>{d.title}</h3>
              <p>{d.body}</p>
            </article>
          ))}
        </div>
        <p className="cs-lead" style={{ marginTop: 40 }}>
          CA-SURF lists UC Berkeley among confirmed chapter creations, alongside UC Davis, UC
          Santa Cruz, Pepperdine, UCLA, Cal State Fullerton, and De Anza College.
        </p>
      </div>
    </section>
  )
}
