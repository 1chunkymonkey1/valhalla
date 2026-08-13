import { useState } from 'react'
import { Link } from 'react-router-dom'
import SiteMenu from '../components/layout/SiteMenu'
import { flowDomains, flowEdges, growthLoops } from '../data/networkFlow'

export default function FlowPage() {
  const [active, setActive] = useState(null)
  const edge = flowEdges.find((e) => e.id === active)
  const company =
    active &&
    flowDomains.flatMap((d) => d.companies).find((c) => c.id === active)

  const detail = edge
    ? { title: edge.label, body: edge.detail }
    : company
      ? {
          title: `${company.name} · ${company.pillar}`,
          body: `${company.name} sits in the ${
            flowDomains.find((d) => d.companies.some((c) => c.id === company.id))?.name
          } domain. Open the hall for product path and refundable holds.`,
          href: `/${company.id}`,
        }
      : {
          title: 'How the empire grows',
          body: 'Select a company node or a relationship arc. Columns are domains; rows are Movement, Habitation, Energy. Loops feed intelligence and product cascades back through the mosaic.',
        }

  return (
    <div className="vh-page vh-flow-page">
      <SiteMenu />
      <header className="vh-flow__hero">
        <p className="vh-flow__mark">Valhalla</p>
        <h1>Network flow</h1>
        <p>Land · Water · Air · Space — movement, habitation, energy interlocking.</p>
      </header>

      <div className="vh-flow">
        <div className="vh-flow__matrix" role="group" aria-label="Domain matrix">
          <div className="vh-flow__corner" />
          {flowDomains.map((d) => (
            <div key={d.id} className="vh-flow__domain-head" style={{ '--flow-accent': d.accent }}>
              {d.name}
            </div>
          ))}

          {['Movement', 'Habitation', 'Energy'].map((pillar, row) => (
            <FragmentRow
              key={pillar}
              pillar={pillar}
              row={row}
              active={active}
              setActive={setActive}
            />
          ))}
        </div>

        <aside className="vh-flow__aside">
          <p className="vh-flow__aside-kicker">Selected</p>
          <h2>{detail.title}</h2>
          <p>{detail.body}</p>
          {detail.href && (
            <Link className="vh-flow__link" to={detail.href}>
              Enter hall →
            </Link>
          )}

          <div className="vh-flow__arcs">
            <p className="vh-flow__aside-kicker">Relationships</p>
            {flowEdges.map((e) => (
              <button
                key={e.id}
                type="button"
                className={active === e.id ? 'is-active' : ''}
                onClick={() => setActive(e.id)}
              >
                {e.label}
              </button>
            ))}
          </div>
        </aside>
      </div>

      <section className="vh-flow__loops">
        <h2>Growth loops</h2>
        <ul>
          {growthLoops.map((loop) => (
            <li key={loop.id}>
              <strong>{loop.title}</strong>
              <span>{loop.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function FragmentRow({ pillar, row, active, setActive }) {
  return (
    <>
      <div className="vh-flow__pillar">{pillar}</div>
      {flowDomains.map((d) => {
        const company = d.companies[row]
        return (
          <button
            key={company.id}
            type="button"
            className={`vh-flow__node ${active === company.id ? 'is-active' : ''}`}
            style={{ '--flow-accent': d.accent }}
            onClick={() => setActive(company.id)}
          >
            <span>{company.name}</span>
          </button>
        )
      })}
    </>
  )
}
