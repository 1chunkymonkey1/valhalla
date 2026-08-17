import PrometheusMark from './PrometheusMark'
import {
  audiences,
  channels,
  competitors,
  objections,
  palette,
  principles,
  systems,
  talkingPoints,
  voiceTraits,
} from '../data/prometheus'

export default function PrometheusInterior({ onLock }) {
  return (
    <div className="pm-hall">
      <section className="pm-hall__hero">
        <div className="pm-hall__hero-copy">
          <p className="pm-mono pm-hall__kicker">{'// INTERNAL  ·  KENAZ'}</p>
          <div className="pm-hall__brand">
            <PrometheusMark size={52} uid="hall" />
            <div>
              <p className="pm-display pm-hall__word">PROMETHEUS</p>
              <p className="pm-hall__sub">DEFENSE</p>
            </div>
          </div>
          <h1 className="pm-display">Marketing research</h1>
          <p className="pm-hall__lede">
            Not for mosaic. Not for decks. This is how we talk, who we sell to, and who has asked to
            be let in.
          </p>
        </div>
        <button type="button" className="pm-hall__lock" onClick={onLock}>
          LOCK
        </button>
      </section>

      <section className="pm-hall__block">
        <p className="pm-mono pm-hall__kicker">{'// SYSTEMS'}</p>
        <div className="pm-hall__grid pm-hall__grid--3">
          {systems.map((row) => (
            <article key={row.id} className="pm-hall__card">
              <p className="pm-mono pm-hall__id">
                {row.id} {row.klass}
              </p>
              <h2 className="pm-display">{row.name}</h2>
              <p>{row.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pm-hall__block">
        <p className="pm-mono pm-hall__kicker">{'// AUDIENCES'}</p>
        <div className="pm-hall__grid pm-hall__grid--2">
          {audiences.map((row) => (
            <article key={row.id} className="pm-hall__card">
              <p className="pm-mono pm-hall__id">
                {row.id} {row.weight}
              </p>
              <h2 className="pm-display">{row.name}</h2>
              <p>{row.notes}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pm-hall__block">
        <p className="pm-mono pm-hall__kicker">{'// COMPETITIVE FIELD'}</p>
        <div className="pm-hall__stack">
          {competitors.map((row) => (
            <article key={row.name} className="pm-hall__row">
              <div>
                <h3 className="pm-display">{row.name}</h3>
                <p className="pm-hall__stance">{row.stance}</p>
              </div>
              <p>{row.vs}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pm-hall__grid pm-hall__grid--2 pm-hall__block">
        <article className="pm-hall__card">
          <p className="pm-mono pm-hall__kicker">OBJECTIONS</p>
          {objections.map((row) => (
            <div key={row.objection} className="pm-hall__item">
              <h3>{row.objection}</h3>
              <p>{row.answer}</p>
            </div>
          ))}
        </article>
        <article className="pm-hall__card">
          <p className="pm-mono pm-hall__kicker">CHANNELS · SHORT FORM</p>
          {channels.map((row) => (
            <p key={row.channel} className="pm-hall__item">
              <strong>{row.channel}.</strong> {row.use}
            </p>
          ))}
          <div className="pm-hall__points">
            {talkingPoints.map((line, i) => (
              <p key={line}>
                <span className="pm-mono">{String(i + 1).padStart(2, '0')}</span> {line}
              </p>
            ))}
          </div>
        </article>
      </section>

      <section className="pm-hall__block">
        <p className="pm-mono pm-hall__kicker">{'// THE PROMETHEAN OATH'}</p>
        <h2 className="pm-display pm-hall__title">Fire Is Not the Enemy.</h2>
        <p className="pm-hall__lede">
          We support prescribed burns, Indigenous cultural fire, and land stewardship. We are not here
          to extinguish fire from the world. We are here to defend human life when fire forgets its
          place.
        </p>
        <div className="pm-hall__grid pm-hall__grid--4">
          {principles.map((row) => (
            <article key={row.label} className="pm-hall__card">
              <h3 className="pm-display">{row.label}</h3>
              <p className="pm-hall__stance">{row.sub}</p>
              <p>{row.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pm-hall__block">
        <p className="pm-mono pm-hall__kicker">{'// BRAND VOICE'}</p>
        <div className="pm-hall__grid pm-hall__grid--4">
          {voiceTraits.map((row) => (
            <article key={row.trait} className="pm-hall__card">
              <h3 className="pm-display">{row.trait}</h3>
              <p className="pm-hall__stance">{row.not}</p>
              <p>{row.note}</p>
            </article>
          ))}
        </div>
        <div className="pm-hall__swatches">
          {palette.map((c) => (
            <div key={c.hex} className="pm-hall__swatch">
              <span style={{ background: c.hex }} />
              <p className="pm-mono">
                {c.name}
                <br />
                {c.hex}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
