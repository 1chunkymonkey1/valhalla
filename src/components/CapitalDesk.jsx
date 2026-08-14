import { useMemo, useState } from 'react'
import { useDispatchQueue } from '../hooks/useDispatchQueue'
import {
  CAPITAL_POSTURE,
  DEADLINES,
  VIEWS,
  bucketOf,
  daysUntil,
  deadlineFor,
  itemsForView,
  nowProgress,
  nowRank,
  NOW_ORDER,
} from '../lib/capitalQueue'

function statusLabel(item) {
  if (item.status === 'sent') return 'Sent'
  if (item.held) return 'Held'
  if (item.status === 'approved') return 'Approved'
  if (item.gated === 'no-send') return 'Lock'
  if (item.gated) return 'Gated'
  if (item.flags?.includes('closed')) return 'Closed'
  return 'Draft'
}

function dueLine(item) {
  const due = deadlineFor(item.id)
  if (!due) return ''
  const days = daysUntil(due.date)
  if (days == null) return due.date
  if (days < 0) return `${due.label} closed ${Math.abs(days)}d ago`
  if (days === 0) return `${due.label} today`
  return `${due.label} in ${days}d`
}

export default function CapitalDesk() {
  const q = useDispatchQueue({ preferIds: NOW_ORDER })
  const [view, setView] = useState('now')
  const visible = useMemo(() => itemsForView(q.items, view), [q.items, view])
  const progress = nowProgress(q.items)
  const { active, draft } = q

  return (
    <div className="vh-capital" data-lenis-prevent>
      <header className="vh-capital__mast">
        <div>
          <p className="vh-capital__kicker">Founder desk</p>
          <h1>Capital</h1>
        </div>
        <div className="vh-capital__posture">
          <strong>
            {CAPITAL_POSTURE.entity} · {CAPITAL_POSTURE.raise} · {CAPITAL_POSTURE.cap} cap
          </strong>
          <span>
            From {q.data?.from?.email || CAPITAL_POSTURE.from}
            {q.data?.storage ? ` · ${q.data.storage}` : ''}
            {q.data?.storage === 'memory' ? ' (approvals die on deploy until the SQL migration runs)' : ''}
          </span>
          <span>
            This week {progress.sent}/{progress.total} sent
            {progress.approved ? ` · ${progress.approved} approved` : ''}
          </span>
        </div>
      </header>

      <p className="vh-capital__rule">{CAPITAL_POSTURE.rule}</p>
      <p className="vh-capital__fine">
        Drafts until you Approve, then Open Gmail or the application. That click does not transmit.
        After it actually goes out, Mark sent.
      </p>

      <ol className="vh-capital__clocks">
        {DEADLINES.map((d) => {
          const days = daysUntil(d.date)
          const item = q.items.find((i) => i.id === d.id)
          const sent = item?.status === 'sent'
          return (
            <li key={d.id}>
              <button
                type="button"
                className={`vh-capital__clock ${sent ? 'is-sent' : ''} ${days != null && days <= 7 && !sent ? 'is-soon' : ''}`}
                onClick={() => {
                  if (item) {
                    setView('all')
                    q.selectItem(item)
                  }
                }}
              >
                <em>{d.label}</em>
                <span>
                  {sent
                    ? 'Sent'
                    : days == null
                      ? d.date
                      : days < 0
                        ? 'Passed'
                        : days === 0
                          ? 'Today'
                          : `${days}d`}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      {q.error && <p className="vh-admin__error">{q.error}</p>}
      {q.msg && <p className="vh-capital__msg">{q.msg}</p>}

      <div className="vh-capital__split">
        <aside className="vh-capital__rail">
          <div className="vh-capital__views">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                className={view === v.id ? 'is-active' : ''}
                onClick={() => setView(v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>
          <ul className="vh-capital__list">
            {visible.map((item) => {
              const rank = nowRank(item.id)
              const due = dueLine(item)
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`vh-capital__item vh-capital__item--${item.status} ${q.active?.id === item.id ? 'is-active' : ''} ${item.held ? 'is-held' : ''}`}
                    onClick={() => q.selectItem(item)}
                  >
                    <strong>
                      {view === 'now' && rank ? <span className="vh-capital__rank">{rank}</span> : null}
                      {item.title}
                    </strong>
                    <span>
                      {statusLabel(item)}
                      {due ? ` · ${due}` : ` · ${item.toName || item.lane}`}
                    </span>
                  </button>
                </li>
              )
            })}
            {!visible.length && (
              <li className="vh-capital__empty">
                {view === 'now' ? "This week's queue is clear." : 'Nothing in this view.'}
              </li>
            )}
          </ul>
        </aside>

        {active ? (
          <section className="vh-capital__editor">
            <header className="vh-capital__head">
              <div>
                <p className="vh-capital__kicker">
                  {active.lane} · {active.channel}
                  {nowRank(active.id) ? ` · now #${nowRank(active.id)}` : ''}
                </p>
                <h2>{active.title}</h2>
                <p>
                  {statusLabel(active)}
                  {active.approvedBy ? ` by ${active.approvedBy}` : ''}
                  {active.sentAt ? ` · sent ${new Date(active.sentAt).toLocaleString()}` : ''}
                </p>
              </div>
            </header>

            {active.notes && <p className="vh-capital__notes">{active.notes}</p>}
            {active.toHint && <p className="vh-capital__hint">{active.toHint}</p>}
            {active.gated === 'demeter-first' && (
              <p className="vh-capital__gate">Sequenced after Demeter. Approving is the override.</p>
            )}
            {active.gated === 'land-loi' && (
              <p className="vh-capital__gate">Gated on a land LOI. Approving is the override.</p>
            )}
            {active.gated === 'no-send' && (
              <p className="vh-capital__gate">This is a lock. Approve to acknowledge. There is no Send.</p>
            )}
            {active.flags?.includes('needs-technical-cofounder') && (
              <p className="vh-capital__gate">
                Needs a real technical cofounder on the application. Do not list a decorative CTO.
              </p>
            )}
            {active.flags?.includes('dropout') && (
              <p className="vh-capital__gate">
                Accepting this program means leaving Berkeley. Apply only if that is a live decision.
              </p>
            )}
            {active.flags?.includes('closed') && (
              <p className="vh-capital__gate">
                Window is closed. Draft is stored for the next cycle. Do not submit now.
              </p>
            )}
            {bucketOf(active) === 'later' && nowRank(active.id) == null && (
              <p className="vh-capital__gate">Not this week. Open it if you have a reason to jump the sequence.</p>
            )}

            {active.channel !== 'application' && (
              <label>
                To
                <input
                  type="email"
                  value={draft.to}
                  onChange={(e) => q.setDraft((p) => ({ ...p, to: e.target.value }))}
                  placeholder={active.toHint || 'name@fund.com'}
                  disabled={active.status === 'sent'}
                />
              </label>
            )}
            {active.channel !== 'application' && (
              <label>
                Subject
                <input
                  value={draft.subject}
                  onChange={(e) => q.setDraft((p) => ({ ...p, subject: e.target.value }))}
                  disabled={active.status === 'sent'}
                />
              </label>
            )}
            {(active.channel === 'application' || active.applyUrl) && (
              <label>
                Application URL
                <input
                  value={draft.applyUrl}
                  onChange={(e) => q.setDraft((p) => ({ ...p, applyUrl: e.target.value }))}
                  disabled={active.status === 'sent'}
                />
              </label>
            )}
            <label>
              {active.channel === 'application' ? 'Answers to paste' : 'Body'}
              <textarea
                rows={18}
                value={draft.body}
                onChange={(e) => q.setDraft((p) => ({ ...p, body: e.target.value }))}
                disabled={active.status === 'sent'}
              />
            </label>

            {q.sendWarn && <p className="vh-capital__warn">{q.sendWarn}</p>}

            <div className="vh-capital__actions">
              <button
                type="button"
                className="vh-admin__secondary"
                onClick={q.save}
                disabled={!!q.busy || active.status === 'sent'}
              >
                Save
              </button>
              {active.status !== 'approved' && active.status !== 'sent' && (
                <button type="button" onClick={q.approve} disabled={!!q.busy}>
                  Approve
                </button>
              )}
              {active.status === 'approved' && (
                <button type="button" className="vh-admin__secondary" onClick={q.unapprove} disabled={!!q.busy}>
                  Unapprove
                </button>
              )}
              {active.gated !== 'no-send' && active.status !== 'sent' && (
                <button type="button" onClick={q.send} disabled={q.sendDisabled}>
                  {q.busy === 'send' ? 'Opening…' : q.sendLabel}
                </button>
              )}
              {active.status === 'approved' && (
                <button type="button" className="vh-admin__secondary" onClick={q.markSent} disabled={!!q.busy}>
                  Mark sent
                </button>
              )}
              <button type="button" className="vh-admin__secondary" onClick={q.copyBody}>
                Copy body
              </button>
            </div>
          </section>
        ) : (
          <p className="vh-capital__empty">Select an item.</p>
        )}
      </div>
    </div>
  )
}
