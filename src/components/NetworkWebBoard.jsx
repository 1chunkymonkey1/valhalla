import { useId, useMemo, useRef, useState } from 'react'
import {
  allCompanies,
  boardPositions,
  edgeKindMap,
  edgeKinds,
  flowEdges,
} from '../data/networkFlow'

const VB = { w: 1000, h: 720 }
const DOMAIN_HEADERS = [
  { id: 'land', label: 'Land', x: 14 },
  { id: 'water', label: 'Water', x: 38 },
  { id: 'air', label: 'Air', x: 62 },
  { id: 'space', label: 'Space', x: 86 },
]
const PILLAR_LABELS = [
  { id: 'movement', label: 'Movement', y: 18 },
  { id: 'habitation', label: 'Habitation', y: 50 },
  { id: 'energy', label: 'Energy / Intelligence', y: 82 },
]

function pct(n, total) {
  return (n / 100) * total
}

function nodePoint(id) {
  const p = boardPositions[id]
  return { x: pct(p.x, VB.w), y: pct(p.y, VB.h) }
}

/** Quadratic curve between nodes with a sideways bend. */
function edgePath(fromId, toId, curve = 0) {
  const a = nodePoint(fromId)
  const b = nodePoint(toId)
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const bend = curve * 2.4
  const cx = mx + nx * bend
  const cy = my + ny * bend
  return {
    d: `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`,
    mid: { x: (a.x + 2 * cx + b.x) / 4, y: (a.y + 2 * cy + b.y) / 4 },
  }
}

export default function NetworkWebBoard({
  focusId = null,
  selectedId = null,
  onHover,
  onSelect,
  onSelectEdge,
}) {
  const uid = useId().replace(/:/g, '')
  const companies = useMemo(() => allCompanies(), [])
  const boardRef = useRef(null)
  const [kindFilter, setKindFilter] = useState(null)

  const activeId = focusId || selectedId

  const paths = useMemo(
    () =>
      flowEdges.map((edge) => {
        const geo = edgePath(edge.from, edge.to, edge.curve ?? 0)
        return { ...edge, ...geo, color: edgeKindMap[edge.kind]?.color || '#5a4634' }
      }),
    [],
  )

  const connected = useMemo(() => {
    if (!activeId) return null
    const ids = new Set([activeId])
    const edgeIds = new Set()
    for (const e of flowEdges) {
      if (e.from === activeId || e.to === activeId) {
        edgeIds.add(e.id)
        ids.add(e.from)
        ids.add(e.to)
      }
    }
    return { ids, edgeIds }
  }, [activeId])

  function edgeClass(edge) {
    const classes = ['vh-web__edge']
    if (edge.major) classes.push('is-major')
    if (kindFilter && edge.kind !== kindFilter) classes.push('is-filtered')
    if (connected) {
      classes.push(connected.edgeIds.has(edge.id) ? 'is-lit' : 'is-dim')
    }
    if (selectedId && (edge.from === selectedId || edge.to === selectedId)) {
      classes.push('is-selected')
    }
    return classes.join(' ')
  }

  function nodeClass(company) {
    const classes = ['vh-web__node']
    if (selectedId === company.id) classes.push('is-selected')
    if (focusId === company.id) classes.push('is-focus')
    if (connected) {
      classes.push(connected.ids.has(company.id) ? 'is-lit' : 'is-dim')
    }
    return classes.join(' ')
  }

  return (
    <div className="vh-web">
      <div className="vh-web__legend" role="list" aria-label="Relationship kinds">
        {edgeKinds.map((kind) => (
          <button
            key={kind.id}
            type="button"
            role="listitem"
            className={`vh-web__legend-item ${kindFilter === kind.id ? 'is-active' : ''}`}
            style={{ '--kind-color': kind.color }}
            title={kind.description}
            aria-pressed={kindFilter === kind.id}
            onClick={() => setKindFilter((k) => (k === kind.id ? null : kind.id))}
          >
            <span className="vh-web__legend-swatch" aria-hidden="true" />
            <span>{kind.label}</span>
          </button>
        ))}
      </div>

      <div className="vh-web__stage" ref={boardRef} data-lenis-prevent>
        <svg
          className="vh-web__svg"
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          role="img"
          aria-label="Valhalla twelve-hall network board. Hover or focus a hall to highlight its connections."
        >
          <defs>
            <pattern
              id={`${uid}-parchment`}
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <rect width="48" height="48" fill="#efe6d4" />
              <path
                d="M0 24h48M24 0v48"
                stroke="rgba(90,70,52,0.05)"
                strokeWidth="1"
              />
            </pattern>
            <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {edgeKinds.map((kind) => (
              <marker
                key={kind.id}
                id={`${uid}-arrow-${kind.id}`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.2 L 9 5 L 0 8.8 Z" fill={kind.color} />
              </marker>
            ))}
          </defs>

          <rect
            className="vh-web__felt"
            x="0"
            y="0"
            width={VB.w}
            height={VB.h}
            rx="28"
            fill={`url(#${uid}-parchment)`}
          />
          <rect
            x="18"
            y="18"
            width={VB.w - 36}
            height={VB.h - 36}
            rx="22"
            fill="none"
            stroke="rgba(90,70,52,0.22)"
            strokeWidth="2"
          />
          <rect
            x="28"
            y="28"
            width={VB.w - 56}
            height={VB.h - 56}
            rx="18"
            fill="none"
            stroke="rgba(90,70,52,0.1)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />

          {/* Domain / pillar guides */}
          {DOMAIN_HEADERS.map((d) => (
            <text
              key={d.id}
              className="vh-web__axis"
              x={pct(d.x, VB.w)}
              y="52"
              textAnchor="middle"
            >
              {d.label}
            </text>
          ))}
          {PILLAR_LABELS.map((p) => (
            <text
              key={p.id}
              className="vh-web__axis vh-web__axis--pillar"
              x="48"
              y={pct(p.y, VB.h) + 4}
              textAnchor="start"
            >
              {p.label}
            </text>
          ))}

          {/* Faint grid intersections */}
          {DOMAIN_HEADERS.map((d) =>
            PILLAR_LABELS.map((p) => (
              <circle
                key={`${d.id}-${p.id}`}
                cx={pct(d.x, VB.w)}
                cy={pct(p.y, VB.h)}
                r="2.5"
                fill="rgba(90,70,52,0.12)"
              />
            )),
          )}

          {/* Edges */}
          <g className="vh-web__edges" filter={`url(#${uid}-soft)`}>
            {paths.map((edge, i) => (
              <g key={edge.id} className={edgeClass(edge)}>
                <path
                  className="vh-web__edge-hit"
                  d={edge.d}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="18"
                  onClick={() => onSelectEdge?.(edge.id)}
                  onMouseEnter={() => onHover?.(null)}
                />
                <path
                  className="vh-web__edge-glow"
                  d={edge.d}
                  fill="none"
                  stroke={edge.color}
                  strokeWidth={edge.major ? 5 : 3.5}
                  strokeLinecap="round"
                  opacity="0.18"
                />
                <path
                  className="vh-web__edge-stroke"
                  d={edge.d}
                  fill="none"
                  stroke={edge.color}
                  strokeWidth={edge.major ? 2.4 : 1.6}
                  strokeLinecap="round"
                  markerEnd={`url(#${uid}-arrow-${edge.kind})`}
                  style={{
                    '--dash-delay': `${(i % 8) * 0.18}s`,
                    '--dash-dur': `${2.8 + (i % 5) * 0.35}s`,
                  }}
                />
                <circle className="vh-web__pulse" r="3.5" fill={edge.color}>
                  <animateMotion
                    dur={`${3.2 + (i % 4) * 0.5}s`}
                    begin={`${(i % 6) * 0.25}s`}
                    repeatCount="indefinite"
                    path={edge.d}
                  />
                </circle>
                {edge.major && (
                  <text
                    className="vh-web__edge-label"
                    x={edge.mid.x}
                    y={edge.mid.y - 8}
                    textAnchor="middle"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            ))}
          </g>

          {/* Nodes */}
          <g className="vh-web__nodes">
            {companies.map((company) => {
              const pt = nodePoint(company.id)
              return (
                <g
                  key={company.id}
                  className={nodeClass(company)}
                  transform={`translate(${pt.x} ${pt.y})`}
                  style={{ '--node-accent': company.accent }}
                >
                  <circle className="vh-web__node-halo" r="38" />
                  <circle className="vh-web__node-ring" r="30" />
                  <circle className="vh-web__node-disc" r="24" />
                  <text className="vh-web__node-name" y="5" textAnchor="middle">
                    {company.name}
                  </text>
                  <text className="vh-web__node-pillar" y="42" textAnchor="middle">
                    {company.pillar}
                  </text>
                  <circle
                    className="vh-web__node-hit"
                    r="36"
                    role="button"
                    tabIndex={0}
                    aria-label={`${company.name}, ${company.domainName} ${company.pillar}. Activate to see how it ties in.`}
                    aria-pressed={selectedId === company.id}
                    onMouseEnter={() => onHover?.(company.id)}
                    onMouseLeave={() => onHover?.(null)}
                    onFocus={() => onHover?.(company.id)}
                    onBlur={() => onHover?.(null)}
                    onClick={() => onSelect?.(company.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onSelect?.(company.id)
                      }
                    }}
                  />
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      <p className="vh-web__hint">
        Hover a hall to light its spiderweb. Click for the tie-in story. Tap a legend chip to
        isolate a relationship kind.
      </p>
    </div>
  )
}
