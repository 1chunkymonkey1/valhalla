import { useEffect, useMemo, useState } from 'react'
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
import {
  TABS,
  atlasDoctrine,
  capital,
  codePath,
  emails,
  forge,
  founderTodos,
  muleTotal,
  nightLog,
  ninetyDay,
  nsfPitch,
  risks,
  unitEconomics,
  viability,
} from '../data/prometheusOps'
import { STATES, TARGET_CYCLE_MS, canOpenValve, nextState } from '../lib/sentinelFsm'

const TODO_KEY = 'pd_founder_todos_v1'

function loadDone() {
  try {
    const raw = localStorage.getItem(TODO_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set()
  }
}

function FounderQueue() {
  const [done, setDone] = useState(() => new Set())

  useEffect(() => {
    setDone(loadDone())
  }, [])

  function toggle(id) {
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      localStorage.setItem(TODO_KEY, JSON.stringify([...next]))
      return next
    })
  }

  const remaining = founderTodos.filter((t) => !done.has(t.id)).length

  return (
    <section className="pm-hall__block">
      <p className="pm-mono pm-hall__kicker">{`// EASON — ${remaining} OPEN`}</p>
      <h2 className="pm-display pm-hall__title">Only you can close these.</h2>
      <p className="pm-hall__lede">
        Agent work is everywhere else on this desk. Incorporation, fire captains, EIN, and the Sierra
        pressure reading require a person. Check a box when it is actually done.
      </p>
      <ul className="pm-todo">
        {founderTodos.map((row) => (
          <li key={row.id} className={done.has(row.id) ? 'pm-todo__item is-done' : 'pm-todo__item'}>
            <label>
              <input type="checkbox" checked={done.has(row.id)} onChange={() => toggle(row.id)} />
              <span>
                <strong>{row.title}</strong>
                <em>
                  {row.need} · {row.owner}
                </em>
                <b>{row.why}</b>
                {row.do}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}

function CopyBlock({ label, text }) {
  const [copied, setCopied] = useState(false)
  return (
    <article className="pm-hall__card pm-mail">
      <div className="pm-mail__bar">
        <p className="pm-mono pm-hall__kicker">{label}</p>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text)
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            } catch {
              setCopied(false)
            }
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre>{text}</pre>
    </article>
  )
}

function FsmPlayground() {
  const [state, setState] = useState('boot')
  const [note, setNote] = useState('Valve closed.')
  const events = useMemo(
    () => ['ready', 'thermal_rise', 'thermal_confirm', 'smoke', 'smoke_and_thermal', 'suppress', 'suppress_ok', 'timeout_clear', 'abort', 'fault', 'reset', 'trip', 'technician', 'clear', 'reheat'],
    [],
  )

  function fire(event) {
    const r = nextState(state, event)
    if (!r.ok) {
      setNote(`Illegal: ${event} from ${state}`)
      return
    }
    setState(r.state)
    setNote(canOpenValve(r.state) ? 'VALVE MAY OPEN' : 'Valve closed.')
  }

  return (
    <div className="pm-fsm">
      <ol>
        {forge.states.map((row) => (
          <li key={row.id} className={row.id === state ? 'is-on' : ''}>
            <span className="pm-mono">{row.label}</span>
            {row.detail}
          </li>
        ))}
      </ol>
      <div>
        <p className="pm-mono">
          NOW {state.toUpperCase()} · TARGET {TARGET_CYCLE_MS} ms · {STATES.length} STATES
        </p>
        <p className={canOpenValve(state) ? 'pm-fsm__hot' : ''}>{note}</p>
        <div className="pm-fsm__btns">
          {events.map((ev) => (
            <button type="button" key={ev} onClick={() => fire(ev)}>
              {ev}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PrometheusInterior({ onLock }) {
  const [tab, setTab] = useState('founder')

  return (
    <div className="pm-hall">
      <section className="pm-hall__hero">
        <div className="pm-hall__hero-copy">
          <p className="pm-mono pm-hall__kicker">{'// INTERNAL  ·  KENAZ  ·  OVERNIGHT DESK'}</p>
          <div className="pm-hall__brand">
            <PrometheusMark size={52} uid="hall" />
            <div>
              <p className="pm-display pm-hall__word">PROMETHEUS</p>
              <p className="pm-hall__sub">DEFENSE</p>
            </div>
          </div>
          <h1 className="pm-display">Forge desk</h1>
          <p className="pm-hall__lede">
            What it takes to be a company, not a mood. Sentinel is Model One. Titan is a mule then a
            tracked line. Atlas is the humanoid north star — staged, not a raise.
          </p>
        </div>
        <button type="button" className="pm-hall__lock" onClick={onLock}>
          LOCK
        </button>
      </section>

      <nav className="pm-tabs" aria-label="Desk sections">
        {TABS.map((row) => (
          <button
            key={row.id}
            type="button"
            className={tab === row.id ? 'is-on' : ''}
            onClick={() => setTab(row.id)}
          >
            {row.label}
          </button>
        ))}
      </nav>

      {tab === 'founder' ? <FounderQueue /> : null}

      {tab === 'viable' ? (
        <section className="pm-hall__block">
          <p className="pm-mono pm-hall__kicker">{'// COMPANY STACK'}</p>
          <h2 className="pm-display pm-hall__title">Ten things that make this real.</h2>
          <div className="pm-hall__stack">
            {viability.map((row) => (
              <article key={row.id} className="pm-hall__row">
                <div>
                  <p className="pm-mono pm-hall__id">
                    {row.id} {row.status}
                  </p>
                  <h3 className="pm-display">{row.name}</h3>
                </div>
                <p>{row.note}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {tab === 'code' ? (
        <section className="pm-hall__block">
          <p className="pm-mono pm-hall__kicker">{'// FIRE CODE · PRESSURE · LISTING'}</p>
          <h2 className="pm-display pm-hall__title">You do not get written into the code. You get listed.</h2>
          <div className="pm-hall__stack">
            {codePath.map((row) => (
              <article key={row.title} className="pm-hall__row">
                <div>
                  <h3 className="pm-display">{row.title}</h3>
                </div>
                <div>
                  <p>{row.fact}</p>
                  <p className="pm-hall__stance">{row.forUs}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {tab === 'forge' ? (
        <>
          <section className="pm-hall__block">
            <p className="pm-mono pm-hall__kicker">{'// MICRO THERMAL'}</p>
            <div className="pm-hall__grid pm-hall__grid--3">
              {forge.cameras.map((row) => (
                <article key={row.name} className="pm-hall__card">
                  <h3 className="pm-display">{row.name}</h3>
                  <p>{row.spec}</p>
                  <p className="pm-hall__stance">{row.use}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="pm-hall__block">
            <p className="pm-mono pm-hall__kicker">{'// POWER'}</p>
            <div className="pm-hall__grid pm-hall__grid--2">
              {forge.power.map((row) => (
                <article key={row.q} className="pm-hall__card">
                  <h3>{row.q}</h3>
                  <p>{row.a}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="pm-hall__block">
            <p className="pm-mono pm-hall__kicker">{`// HOSE MULE BOM  ·  ~$${muleTotal}`}</p>
            <div className="pm-hall__stack">
              {forge.muleBom.map((row) => (
                <article key={row.item} className="pm-hall__row">
                  <h3>{row.item}</h3>
                  <p>${row.est}</p>
                </article>
              ))}
            </div>
            <p className="pm-hall__lede">{forge.cushman.fact}</p>
            <p className="pm-hall__lede">{forge.cushman.use}</p>
          </section>
          <section className="pm-hall__block">
            <p className="pm-mono pm-hall__kicker">{'// DETECTION STATES'}</p>
            <FsmPlayground />
          </section>
        </>
      ) : null}

      {tab === 'atlas' ? (
        <section className="pm-hall__block">
          <p className="pm-mono pm-hall__kicker">{'// LINE THREE — HUMANOID'}</p>
          <h2 className="pm-display pm-hall__title">Save lives. Not “any situation.”</h2>
          <p className="pm-hall__lede">{atlasDoctrine.mission}</p>
          <p className="pm-mono pm-hall__kicker">FORBIDDEN IN PUBLIC</p>
          <ul className="pm-list">
            {atlasDoctrine.forbidden.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="pm-hall__stack">
            {atlasDoctrine.field.map((row) => (
              <article key={row.name} className="pm-hall__row">
                <h3 className="pm-display">{row.name}</h3>
                <p>{row.vs}</p>
              </article>
            ))}
          </div>
          <div className="pm-hall__grid pm-hall__grid--2" style={{ marginTop: '1.5rem' }}>
            {atlasDoctrine.stages.map((row) => (
              <article key={row.id} className="pm-hall__card">
                <p className="pm-mono pm-hall__id">
                  {row.id} {row.when}
                </p>
                <h3 className="pm-display">{row.name}</h3>
                <p>{row.body}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {tab === 'capital' ? (
        <section className="pm-hall__block">
          <p className="pm-mono pm-hall__kicker">{'// FUNDING'}</p>
          <h2 className="pm-display pm-hall__title">Non-dilutive first. Humanoid never as the round.</h2>
          <div className="pm-hall__stack">
            {capital.map((row) => (
              <article key={row.name} className="pm-hall__row">
                <div>
                  <h3 className="pm-display">{row.name}</h3>
                  <p className="pm-hall__stance">
                    {row.amount} · {row.timing}
                  </p>
                </div>
                <div>
                  <p>{row.fit}</p>
                  <p>{row.catch}</p>
                </div>
              </article>
            ))}
          </div>
          <CopyBlock label="NSF Project Pitch draft" text={nsfPitch} />
        </section>
      ) : null}

      {tab === 'money' ? (
        <section className="pm-hall__block">
          <p className="pm-mono pm-hall__kicker">{'// UNIT ECONOMICS — ASSUMPTIONS, NOT QUOTES'}</p>
          <h2 className="pm-display pm-hall__title">The BOM is not the cost.</h2>
          <p className="pm-hall__lede">{unitEconomics.caveat}</p>
          <div className="pm-hall__stack">
            {unitEconomics.rows.map((row) => (
              <article key={row.line} className="pm-hall__row">
                <div>
                  <h3>{row.line}</h3>
                  <p className="pm-hall__stance">
                    ${row.low}–${row.high}
                  </p>
                </div>
                <p>{row.note}</p>
              </article>
            ))}
          </div>
          <ul className="pm-list pm-list--plain">
            {unitEconomics.truths.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === 'risk' ? (
        <section className="pm-hall__block">
          <p className="pm-mono pm-hall__kicker">{'// WHAT KILLS THIS COMPANY'}</p>
          <h2 className="pm-display pm-hall__title">Name it, then control it.</h2>
          <div className="pm-hall__stack">
            {risks.map((row) => (
              <article key={row.id} className="pm-hall__row">
                <div>
                  <p className="pm-mono pm-hall__id">
                    {row.id} {row.severity}
                  </p>
                  <h3 className="pm-display">{row.risk}</h3>
                </div>
                <p>{row.control}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {tab === 'plan' ? (
        <section className="pm-hall__block">
          <p className="pm-mono pm-hall__kicker">{'// NEXT 90 DAYS'}</p>
          <h2 className="pm-display pm-hall__title">Evidence before capital.</h2>
          <div className="pm-hall__grid pm-hall__grid--2">
            {ninetyDay.map((row) => (
              <article key={row.id} className="pm-hall__card">
                <p className="pm-mono pm-hall__id">
                  {row.id} {row.window}
                </p>
                <h3 className="pm-display">{row.theme}</h3>
                <ul className="pm-list pm-list--plain">
                  {row.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {tab === 'outreach' ? (
        <section className="pm-hall__block">
          <p className="pm-mono pm-hall__kicker">{'// DRAFTS — DO NOT SEND AS-IS WITHOUT A NAME'}</p>
          {emails.map((row) => (
            <CopyBlock
              key={row.id}
              label={`${row.subject} · ${row.to}`}
              text={`To: ${row.to}\nSubject: ${row.subject}\n\n${row.body}`}
            />
          ))}
        </section>
      ) : null}

      {tab === 'log' ? (
        <>
          <section className="pm-hall__block">
            <p className="pm-mono pm-hall__kicker">{'// NIGHT LOG'}</p>
            <div className="pm-hall__stack">
              {nightLog.map((row) => (
                <article key={row.t} className="pm-hall__row">
                  <div>
                    <p className="pm-mono">{row.t}</p>
                    <h3>{row.who}</h3>
                  </div>
                  <p>{row.entry}</p>
                </article>
              ))}
            </div>
          </section>
          <BrandRest />
        </>
      ) : null}
    </div>
  )
}

function BrandRest() {
  return (
    <>
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
    </>
  )
}
