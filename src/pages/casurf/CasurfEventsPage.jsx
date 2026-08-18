import { CASURF } from '../../data/casurf'

export default function CasurfEventsPage() {
  return (
    <section className="cs-sec cs-sec--white">
      <div className="cs-wrap">
        <p className="cs-eyebrow">Calendar</p>
        <h1 className="cs-h2">Events</h1>
        <p className="cs-lead">
          Upcoming chapter meetings and actions will be posted here. Until then, follow{' '}
          <a href={CASURF.instagramUrl} target="_blank" rel="noreferrer">
            @{CASURF.instagram}
          </a>{' '}
          for calls to action. We do not invent event dates.
        </p>
        <a className="cs-btn cs-btn--navy" href={CASURF.instagramUrl} target="_blank" rel="noreferrer">
          Instagram
        </a>
      </div>
    </section>
  )
}
