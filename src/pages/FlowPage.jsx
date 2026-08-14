import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import NetworkWebBoard from '../components/NetworkWebBoard'
import SiteMenu from '../components/layout/SiteMenu'
import {
  allCompanies,
  companyTies,
  edgesForCompany,
  flowEdges,
  growthLoops,
} from '../data/networkFlow'

export default function FlowPage() {
  const [hoverId, setHoverId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [edgeId, setEdgeId] = useState(null)

  const selectedEdge = useMemo(
    () => (edgeId ? flowEdges.find((e) => e.id === edgeId) : null),
    [edgeId],
  )

  const companyBlurb = selectedId ? companyTies[selectedId] : null
  const companyEdges = selectedId ? edgesForCompany(selectedId) : []

  const detail = selectedEdge
    ? {
        kicker: 'Pathway',
        title: selectedEdge.label,
        body: selectedEdge.detail,
        href: null,
        links: [
          { id: selectedEdge.from, to: `/${selectedEdge.from}` },
          { id: selectedEdge.to, to: `/${selectedEdge.to}` },
        ],
      }
    : companyBlurb
      ? {
          kicker: 'Hall',
          title: companyBlurb.title,
          body: companyBlurb.body,
          href: `/${selectedId}`,
          links: companyEdges.slice(0, 6).map((e) => ({
            id: e.id,
            label: e.label,
            onPick: () => {
              setEdgeId(e.id)
              setSelectedId(null)
            },
          })),
        }
      : {
          kicker: 'The board',
          title: 'Twelve halls. One civilization web.',
          body: 'Land, Water, Air, and Space stack Movement → Habitation → Substrate. Pathways carry transit, housing, power, ethanol, supply, and compute. Light a node to read its spiderweb.',
          href: null,
          links: [],
        }

  function selectCompany(id) {
    setSelectedId(id)
    setEdgeId(null)
  }

  function selectEdge(id) {
    setEdgeId(id)
    setSelectedId(null)
  }

  return (
    <div className="vh-page vh-flow-page">
      <SiteMenu />
      <header className="vh-flow__hero">
        <p className="vh-flow__mark">Valhalla</p>
        <h1>Empire web</h1>
        <p>
          A game-board spiderweb of how the twelve halls feed each other—pathways, not spaghetti.
        </p>
      </header>

      <div className="vh-flow vh-flow--board">
        <NetworkWebBoard
          focusId={hoverId}
          selectedId={selectedId}
          onHover={setHoverId}
          onSelect={selectCompany}
          onSelectEdge={selectEdge}
        />

        <aside className="vh-flow__aside" aria-live="polite">
          <p className="vh-flow__aside-kicker">{detail.kicker}</p>
          <h2>{detail.title}</h2>
          <p>{detail.body}</p>
          {detail.href && (
            <Link className="vh-flow__link" to={detail.href}>
              Enter hall →
            </Link>
          )}
          {detail.links?.length > 0 && (
            <div className="vh-flow__arcs">
              <p className="vh-flow__aside-kicker">
                {selectedEdge ? 'Halls on this path' : 'Connected pathways'}
              </p>
              {selectedEdge
                ? detail.links.map((l) => (
                    <Link key={l.id} className="vh-flow__arc-link" to={l.to}>
                      {l.id}
                    </Link>
                  ))
                : detail.links.map((l) => (
                    <button key={l.id} type="button" onClick={l.onPick}>
                      {l.label}
                    </button>
                  ))}
            </div>
          )}
          {(selectedId || edgeId) && (
            <button
              type="button"
              className="vh-flow__clear"
              onClick={() => {
                setSelectedId(null)
                setEdgeId(null)
              }}
            >
              Clear selection
            </button>
          )}
        </aside>
      </div>

      <section className="vh-flow__mobile-list" aria-label="Hall connections for small screens">
        <h2>Halls &amp; ties</h2>
        <ul>
          {allCompanies().map((company) => {
            const tie = companyTies[company.id]
            return (
              <li key={company.id}>
                <button type="button" onClick={() => selectCompany(company.id)}>
                  <strong>{company.name}</strong>
                  <span>{tie.body}</span>
                </button>
                <Link to={`/${company.id}`}>Open {company.name}</Link>
              </li>
            )
          })}
        </ul>
      </section>

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
