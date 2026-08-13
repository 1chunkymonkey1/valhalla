import { useState } from 'react'
import EmailCapture from '../EmailCapture'
import WolfStencil from './WolfStencils'
import {
  wolfLines,
  wolfModelRows,
  wolfMission,
  direWolfPhases,
  formatWolfDate,
  wolfCellOpacity,
} from '../../data/wolfMatrix'

export default function WolfProductMatrix() {
  const [active, setActive] = useState(null)
  // active: { lineId, rowId } | null

  const activeLine = active ? wolfLines.find((l) => l.id === active.lineId) : null
  const activeRow = active ? wolfModelRows.find((r) => r.id === active.rowId) : null
  const activeCell =
    activeLine && activeRow && !activeRow.mystery && activeRow.cells
      ? activeRow.cells[activeLine.id]
      : null

  function selectCell(lineId, rowId, mystery) {
    if (mystery) return
    setActive((prev) =>
      prev?.lineId === lineId && prev?.rowId === rowId ? null : { lineId, rowId },
    )
  }

  return (
    <section className="vh-road wolf-matrix" id="roadmap">
      <p className="vh-road__kicker">Product path</p>
      <h2 className="vh-road__title">Wolf matrix</h2>

      <div className="wolf-matrix__mission">
        <h3>{wolfMission.title}</h3>
        <p>{wolfMission.body}</p>
        <p className="wolf-matrix__cadence">{wolfMission.cadence}</p>
      </div>

      <div className="wolf-matrix__scroll">
        <table className="wolf-matrix__table">
          <caption className="wolf-matrix__sr">
            Product lines across columns, model generations down rows. Fenrir leads on the left.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="wolf-matrix__corner">
                <span className="wolf-matrix__corner-label">Model</span>
              </th>
              {wolfLines.map((line) => (
                <th key={line.id} scope="col" className="wolf-matrix__colhead">
                  <span className="wolf-matrix__line-name">{line.name}</span>
                  <span className="wolf-matrix__line-epithet">{line.epithet}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {wolfModelRows.map((row, rowIndex) => (
              <tr key={row.id} className={row.mystery ? 'wolf-matrix__row--mystery' : ''}>
                <th scope="row" className="wolf-matrix__rowhead">
                  {row.label}
                </th>
                {wolfLines.map((line, lineIndex) => {
                  if (row.mystery) {
                    return (
                      <td key={line.id}>
                        <button
                          type="button"
                          className="wolf-matrix__cell wolf-matrix__cell--mystery"
                          disabled
                          aria-label="Sealed future"
                          style={{ opacity: 0.22 + lineIndex * 0.02 }}
                        >
                          ?
                        </button>
                      </td>
                    )
                  }
                  const cell = row.cells[line.id]
                  const isActive =
                    active?.lineId === line.id && active?.rowId === row.id
                  const opacity = wolfCellOpacity(
                    rowIndex,
                    lineIndex,
                    wolfLines.length,
                    wolfModelRows.length,
                  )
                  return (
                    <td key={line.id}>
                      <button
                        type="button"
                        className={`wolf-matrix__cell ${isActive ? 'wolf-matrix__cell--active' : ''}`}
                        style={{ opacity }}
                        aria-label={`${line.name} ${row.label}`}
                        aria-pressed={isActive}
                        onClick={() => selectCell(line.id, row.id, false)}
                      >
                        <span className="wolf-matrix__cell-name">
                          {line.name} {row.label}
                        </span>
                        {cell?.status && (
                          <span className="wolf-matrix__cell-status">{cell.status}</span>
                        )}
                        {cell?.targetDate && (
                          <span className="wolf-matrix__cell-date">
                            {formatWolfDate(cell.targetDate)}
                          </span>
                        )}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="wolf-matrix__hint">
        Columns are product lines · rows are subsequent models · tap a cell for the parchment
        stencil
      </p>

      {activeCell && activeLine && (
        <div className="wolf-matrix__detail vh-road__detail">
          <div className="wolf-matrix__detail-grid">
            <WolfStencil vehicle={activeLine.vehicle} />
            <div className="wolf-matrix__detail-copy">
              <p className="wolf-matrix__detail-kicker">{activeLine.epithet}</p>
              <h3>
                {activeLine.name} {activeRow.label}
              </h3>
              <p className="wolf-matrix__naming">{activeLine.naming}</p>
              <p>{activeCell.description || activeCell.summary}</p>
              <p className="wolf-matrix__line-overview">{activeLine.overview}</p>
              {activeCell.targetDate && (
                <p className="wolf-matrix__target">
                  Target window · {formatWolfDate(activeCell.targetDate)}
                  {activeCell.id === 'fenrir-01' ? ' · predeposits opening soon' : ''}
                </p>
              )}

              {activeLine.id === 'dire-wolf' && (
                <div className="wolf-matrix__phases">
                  <h4>Dire Wolf · rail phases</h4>
                  <ol>
                    {direWolfPhases.map((phase) => (
                      <li key={phase.id}>
                        <strong>{phase.name}</strong>
                        <span className="wolf-matrix__phase-window">{phase.window}</span>
                        <p>{phase.text}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <EmailCapture
                title="Join the list"
                hint="Email only for now. Predeposits opening soon — no payment hold on this page."
                doneHint="You’re on the Wolf list. We’ll write when this line moves or predeposits open."
                source={`roadmap:wolf:${activeCell.id}`}
                companyId="wolf"
                audience="roadmap"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
