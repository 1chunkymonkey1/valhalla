import { getGridCompanies, getRevealCompanies } from '../../lib/companies'
import CompanyPortal from './CompanyPortal'

export default function MosaicGrid({ now, unlockedSet }) {
  const desktop = getGridCompanies()
  const mobile = getRevealCompanies()

  return (
    <>
      <div className="vh-mosaic vh-mosaic--desktop" role="list">
        {desktop.map((company) => (
          <div key={company.id} role="listitem">
            <CompanyPortal company={company} now={now} unlockedSet={unlockedSet} />
          </div>
        ))}
      </div>
      <div className="vh-mosaic vh-mosaic--mobile" role="list">
        {mobile.map((company) => (
          <div key={company.id} role="listitem">
            <CompanyPortal company={company} now={now} unlockedSet={unlockedSet} />
          </div>
        ))}
      </div>
    </>
  )
}
