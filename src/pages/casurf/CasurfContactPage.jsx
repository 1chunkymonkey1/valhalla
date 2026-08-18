import { useState } from 'react'
import { CASURF } from '../../data/casurf'

export default function CasurfContactPage() {
  const [done, setDone] = useState(false)

  function onSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      year: String(form.get('year') || ''),
      interest: String(form.get('interest') || ''),
      message: String(form.get('message') || ''),
      chapter: 'UC Berkeley',
      submittedAt: new Date().toISOString(),
    }
    try {
      const key = 'casurf_berkeley_join'
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      existing.push(payload)
      localStorage.setItem(key, JSON.stringify(existing))
    } catch {
      /* ignore */
    }
    setDone(true)
  }

  return (
    <section className="cs-sec cs-sec--white">
      <div className="cs-wrap">
        <p className="cs-eyebrow">Get involved</p>
        <h1 className="cs-h2">Join Berkeley</h1>
        <p className="cs-lead">
          Reach the chapter on Instagram at{' '}
          <a href={CASURF.instagramUrl} target="_blank" rel="noreferrer">
            @{CASURF.instagram}
          </a>
          . To connect with the statewide network, use{' '}
          <a href={CASURF.parentUrl} target="_blank" rel="noreferrer">
            casurf.vote
          </a>{' '}
          or email {CASURF.parentEmail}. This site does not collect donations.
        </p>

        {done ? (
          <p className="cs-lead">Received. Your interest is saved in this browser for the chapter.</p>
        ) : (
          <form className="cs-form" onSubmit={onSubmit}>
            <label>
              <span>Name</span>
              <input name="name" required autoComplete="name" />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              <span>Year / affiliation</span>
              <input name="year" placeholder="e.g. Class of 2028, community" />
            </label>
            <label>
              <span>How do you want to help?</span>
              <select name="interest" defaultValue="organizing">
                <option value="organizing">Campus organizing</option>
                <option value="comms">Communications</option>
                <option value="outreach">Outreach</option>
                <option value="other">Something else</option>
              </select>
            </label>
            <label>
              <span>Message</span>
              <textarea name="message" rows={4} />
            </label>
            <button className="cs-btn cs-btn--navy" type="submit">
              Send
            </button>
          </form>
        )}

        <p className="cs-lead" style={{ marginTop: 40 }}>
          Statewide get-involved form:{' '}
          <a href={CASURF.parentForm} target="_blank" rel="noreferrer">
            Open on casurf.vote
          </a>
        </p>
      </div>
    </section>
  )
}
