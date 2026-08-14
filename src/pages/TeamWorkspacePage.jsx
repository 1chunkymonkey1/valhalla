import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import CompanySocialLinks from '../components/CompanySocialLinks'

export default function TeamWorkspacePage() {
  const navigate = useNavigate()
  const [state, setState] = useState({ loading: true, data: null, error: '' })
  const [tab, setTab] = useState('home')
  const [taskTitle, setTaskTitle] = useState('')
  const [taskHall, setTaskHall] = useState('')
  const [noteHall, setNoteHall] = useState('')
  const [noteBody, setNoteBody] = useState('')

  async function load() {
    try {
      const res = await fetch('/api/team/workspace', { credentials: 'include' })
      if (res.status === 401) {
        setState({ loading: false, data: null, error: 'auth' })
        return
      }
      const data = await res.json()
      setState({ loading: false, data, error: '' })
      if (!taskHall && data.user?.halls?.[0]) setTaskHall(data.user.halls[0])
      if (!noteHall && data.user?.halls?.[0]) setNoteHall(data.user.halls[0])
    } catch {
      setState({ loading: false, data: null, error: 'network' })
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function logout() {
    await fetch('/api/team/logout', { method: 'POST', credentials: 'include' })
    navigate('/team/login')
  }

  async function createTask(e) {
    e.preventDefault()
    if (!taskTitle.trim()) return
    await fetch('/api/team/tasks', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: taskTitle, hall: taskHall || null }),
    })
    setTaskTitle('')
    load()
  }

  async function setTaskStatus(id, status) {
    await fetch('/api/team/tasks', {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    load()
  }

  async function addNote(e) {
    e.preventDefault()
    if (!noteBody.trim() || !noteHall) return
    await fetch('/api/team/notes', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hall: noteHall, body: noteBody }),
    })
    setNoteBody('')
    load()
  }

  if (state.loading) {
    return (
      <div className="vh-page vh-team">
        <p className="vh-admin__loading">Opening workspace…</p>
      </div>
    )
  }

  if (state.error === 'auth' || !state.data) {
    return <Navigate to="/team/login" replace />
  }

  const { user, halls, tasks, notes, reservations, signups, guides } = state.data

  return (
    <div className="vh-page vh-team vh-team--in">
      <header className="vh-team__top">
        <div>
          <p className="vh-team__mark">Team workspace</p>
          <h1>
            {user.name}{' '}
            <span className="vh-team__role">
              {user.roleLabel}
            </span>
          </h1>
          <p className="vh-team__blurb">{user.roleBlurb}</p>
        </div>
        <button type="button" onClick={logout}>
          Sign out
        </button>
      </header>

      <nav className="vh-team__tabs">
        {[
          ['home', 'Home'],
          ['halls', 'Halls'],
          ['tasks', 'Tasks'],
          ['inbox', 'Inbox'],
          ['notes', 'Notes'],
          ['socials', 'Socials'],
          ['guide', 'Guide'],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? 'is-active' : ''}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === 'home' && (
        <section className="vh-team__grid">
          <div className="vh-team__card">
            <h2>Your halls</h2>
            <p className="vh-admin__count">{halls.length}</p>
            <ul className="vh-admin__list">
              {halls.map((h) => (
                <li key={h.id}>
                  <strong>
                    <Link to={`/${h.id}`}>{h.name}</Link>
                  </strong>
                  <span>
                    {h.domain} · {h.pillar} · {h.openTasks} open tasks · {h.reservations} holds
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="vh-team__card">
            <h2>Open tasks</h2>
            <p className="vh-admin__count">
              {tasks.filter((t) => t.status !== 'done').length}
            </p>
            <ul className="vh-admin__list">
              {tasks
                .filter((t) => t.status !== 'done')
                .slice(0, 8)
                .map((t) => (
                  <li key={t.id}>
                    <strong>{t.title}</strong>
                    <span>
                      {t.hall || 'empire'} · {t.status}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
          <div className="vh-team__card">
            <h2>Interest</h2>
            <p className="vh-admin__count">
              {reservations.length} holds · {signups.length} emails
            </p>
            <p className="vh-team__blurb">
              Refundable holds and email signups for halls you can see.
            </p>
          </div>
        </section>
      )}

      {tab === 'halls' && (
        <section className="vh-team__halls">
          {halls.map((h) => (
            <article key={h.id} className="vh-team__hall">
              <div>
                <p className="vh-team__mark">
                  {h.domain} · {h.pillar}
                </p>
                <h2>{h.name}</h2>
                <p>
                  {h.openTasks} tasks · {h.reservations} reservations · {h.notes} notes
                </p>
                <CompanySocialLinks social={h.social} />
              </div>
              <div className="vh-team__hall-actions">
                <Link to={`/${h.id}`}>Public site</Link>
                <button type="button" onClick={() => { setTab('tasks'); setTaskHall(h.id) }}>
                  Tasks
                </button>
                <button type="button" onClick={() => { setTab('notes'); setNoteHall(h.id) }}>
                  Notes
                </button>
              </div>
            </article>
          ))}
          {!halls.length && (
            <p className="vh-admin__empty">No halls assigned yet.</p>
          )}
        </section>
      )}

      {tab === 'tasks' && (
        <section className="vh-team__panel">
          <form className="vh-team__inline" onSubmit={createTask}>
            <input
              placeholder="New task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <select value={taskHall} onChange={(e) => setTaskHall(e.target.value)}>
              <option value="">Empire-wide</option>
              {user.halls.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <button type="submit">Add task</button>
          </form>
          <div className="vh-team__columns">
            {['todo', 'doing', 'done'].map((status) => (
              <div key={status} className="vh-team__card">
                <h2>{status}</h2>
                <ul className="vh-admin__list">
                  {tasks
                    .filter((t) => t.status === status)
                    .map((t) => (
                      <li key={t.id}>
                        <strong>{t.title}</strong>
                        <span>{t.hall || 'empire'}</span>
                        <span className="vh-team__task-actions">
                          {status !== 'todo' && (
                            <button type="button" onClick={() => setTaskStatus(t.id, 'todo')}>
                              Todo
                            </button>
                          )}
                          {status !== 'doing' && (
                            <button type="button" onClick={() => setTaskStatus(t.id, 'doing')}>
                              Doing
                            </button>
                          )}
                          {status !== 'done' && (
                            <button type="button" onClick={() => setTaskStatus(t.id, 'done')}>
                              Done
                            </button>
                          )}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'inbox' && (
        <section className="vh-team__grid">
          <div className="vh-team__card">
            <h2>Reservations</h2>
            <ul className="vh-admin__list">
              {reservations.slice(0, 40).map((r) => (
                <li key={r.id}>
                  <strong>
                    {r.companyId || r.companyName} · {r.email}
                  </strong>
                  <span>
                    {r.interestGroup || r.product || 'hold'}
                    {r.refundable ? ' · refundable' : ''}
                  </span>
                </li>
              ))}
              {!reservations.length && <p className="vh-admin__empty">None yet.</p>}
            </ul>
          </div>
          <div className="vh-team__card">
            <h2>Email signups</h2>
            <ul className="vh-admin__list">
              {signups.slice(0, 40).map((r) => (
                <li key={r.id}>
                  <strong>{r.email}</strong>
                  <span>{r.audience || r.source || '-'}</span>
                </li>
              ))}
              {!signups.length && <p className="vh-admin__empty">None yet.</p>}
            </ul>
          </div>
        </section>
      )}

      {tab === 'notes' && (
        <section className="vh-team__panel">
          <form className="vh-team__inline" onSubmit={addNote}>
            <select value={noteHall} onChange={(e) => setNoteHall(e.target.value)}>
              {user.halls.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <input
              placeholder="Note, decision, or blocker"
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
            />
            <button type="submit">Pin note</button>
          </form>
          <ul className="vh-admin__list">
            {notes.map((n) => (
              <li key={n.id}>
                <strong>
                  {n.hall} · {n.author}
                </strong>
                <span>{n.body}</span>
              </li>
            ))}
            {!notes.length && <p className="vh-admin__empty">No notes yet.</p>}
          </ul>
        </section>
      )}

      {tab === 'socials' && (
        <section className="vh-team__grid">
          {halls.map((h) => (
            <div key={h.id} className="vh-team__card">
              <h2>{h.name}</h2>
              <CompanySocialLinks social={h.social} />
              {h.social?.followerNotes && (
                <p className="vh-team__blurb">{h.social.followerNotes}</p>
              )}
              {!h.social?.linkedin && !h.social?.instagram && !h.social?.x && (
                  <p className="vh-admin__empty">No links yet, set in /admin → Socials.</p>
                )}
            </div>
          ))}
        </section>
      )}

      {tab === 'guide' && (
        <section className="vh-team__grid">
          {guides.map((g) => (
            <div key={g.title} className="vh-team__card">
              <h2>{g.title}</h2>
              <p>{g.body}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
