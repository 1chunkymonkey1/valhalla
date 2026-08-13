import { Link } from 'react-router-dom'
import {
  getHallMatrix,
  matrixCellOpacity,
  formatMatrixDate,
} from '../../data/hallMatrices'

export default function ProductMatrix({ companyId }) {
  const matrix = getHallMatrix(companyId)
  if (!matrix) return null

  const { lines, rows, mission, title, kicker, community } = matrix

  return (
    <section className="vh-road product-matrix wolf-matrix" id="roadmap">
      <p className="vh-road__kicker">{kicker || 'Product path'}</p>
      <h2 className="vh-road__title">{title || 'Product matrix'}</h2>

      <div className="product-matrix__mission wolf-matrix__mission">
        <h3>{mission.title}</h3>
        <p>{mission.body}</p>
        {mission.cadence && (
          <p className="product-matrix__cadence wolf-matrix__cadence">{mission.cadence}</p>
        )}
      </div>

      {community && (
        <div className="product-matrix__community">
          <h3>{community.title}</h3>
          <p>{community.body}</p>
          {community.addOns?.length > 0 && (
            <ul className="product-matrix__community-addons">
              {community.addOns.map((a) => (
                <li key={a.id}>
                  <strong>{a.name}</strong> — {a.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="product-matrix__scroll wolf-matrix__scroll">
        <table className="product-matrix__table wolf-matrix__table">
          <caption className="product-matrix__sr wolf-matrix__sr">
            Product lines across columns, model generations down rows.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="product-matrix__corner wolf-matrix__corner">
                <span className="wolf-matrix__corner-label">Model</span>
              </th>
              {lines.map((line) => (
                <th key={line.id} scope="col" className="product-matrix__colhead wolf-matrix__colhead">
                  <span className="wolf-matrix__line-name">{line.name}</span>
                  <span className="wolf-matrix__line-epithet">{line.epithet}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id} className={row.mystery ? 'wolf-matrix__row--mystery' : ''}>
                <th scope="row" className="product-matrix__rowhead wolf-matrix__rowhead">
                  {row.label}
                </th>
                {lines.map((line, lineIndex) => {
                  if (row.mystery) {
                    return (
                      <td key={line.id}>
                        <button
                          type="button"
                          className="product-matrix__cell wolf-matrix__cell wolf-matrix__cell--mystery"
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
                  if (!cell) {
                    return (
                      <td key={line.id}>
                        <span className="product-matrix__cell wolf-matrix__cell wolf-matrix__cell--mystery">
                          —
                        </span>
                      </td>
                    )
                  }
                  const opacity = matrixCellOpacity(
                    rowIndex,
                    lineIndex,
                    lines.length,
                    rows.length,
                  )
                  const href = `/${companyId}/${cell.id}`
                  return (
                    <td key={line.id}>
                      <Link
                        to={href}
                        className="product-matrix__cell wolf-matrix__cell"
                        style={{ opacity }}
                        aria-label={`${line.name} ${row.label}`}
                      >
                        <span className="wolf-matrix__cell-name">
                          {line.name} {row.label}
                        </span>
                        {cell.status && (
                          <span className="wolf-matrix__cell-status">{cell.status}</span>
                        )}
                        {cell.targetDate && (
                          <span className="wolf-matrix__cell-date">
                            {formatMatrixDate(cell.targetDate)}
                          </span>
                        )}
                      </Link>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="product-matrix__hint wolf-matrix__hint">
        Columns are product lines · rows are subsequent models · tap a cell for the parchment
        product page
      </p>
    </section>
  )
}
