import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import NetworkWebBoard from '../components/NetworkWebBoard'
import {
  allCompanies,
  companyTies,
  edgesForCompany,
  flowEdges,
  growthLoops,
} from '../data/networkFlow'
import { useI18n } from '../i18n/I18nProvider'

export default function FlowPage() {
  const { t } = useI18n()
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
        kicker: t('flow.pathway'),
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
          kicker: t('flow.hall'),
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
          kicker: t('flow.boardKicker'),
          title: t('flow.boardTitle'),
          body: t('flow.boardBody'),
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
      <header className="vh-flow__hero">
        <p className="vh-flow__mark">{t('flow.mark')}</p>
        <h1>{t('flow.title')}</h1>
        <p>{t('flow.lead')}</p>
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
              {t('flow.enterHall')}
            </Link>
          )}
          {detail.links?.length > 0 && (
            <div className="vh-flow__arcs">
              <p className="vh-flow__aside-kicker">
                {selectedEdge ? t('flow.hallsOnPath') : t('flow.connectedPathways')}
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
              {t('flow.clearSelection')}
            </button>
          )}
        </aside>
      </div>

      <section className="vh-flow__mobile-list" aria-label={t('flow.hallsAndTies')}>
        <h2>{t('flow.hallsAndTies')}</h2>
        <ul>
          {allCompanies().map((company) => {
            const tie = companyTies[company.id]
            return (
              <li key={company.id}>
                <button type="button" onClick={() => selectCompany(company.id)}>
                  <strong>{company.name}</strong>
                  <span>{tie.body}</span>
                </button>
                <Link to={`/${company.id}`}>{t('flow.openHall', { name: company.name })}</Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="vh-flow__loops">
        <h2>{t('flow.growthLoops')}</h2>
        <ul>
          {growthLoops.map((loop) => (
            <li key={loop.id}>
              <strong>{loop.title}</strong>
              <span>{loop.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Secret founder entry — subtle rune in the parchment corner; not advertised in the public menu */}
      <Link to="/admin" className="vh-flow__rune" aria-label={t('flow.adminRune')} title="">
        <svg viewBox="0 0 24 28" aria-hidden="true" focusable="false">
          <path
            d="M12 2 L20 7.5 L20 18.5 L12 24 L4 18.5 L4 7.5 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <path
            d="M12 6.5 V17.5 M8.2 10.2 L12 14 L15.8 10.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  )
}
