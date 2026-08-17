import { Link } from 'react-router-dom'
import {
  MERCH_POSTURE,
  MERCH_STATUS,
  getHallAnnouncement,
  merchItemsForCompany,
  mosaicHallsWithMerch,
} from '../data/meridianMerch'
import { useI18n } from '../i18n/I18nProvider'
import GarmentMark from './GarmentMark'

export default function MeridianMerch({ companyId, variant = 'hall' }) {
  const { t } = useI18n()
  const announcement = getHallAnnouncement(companyId)
  const items = merchItemsForCompany(companyId)
  if (!announcement || items.length === 0) return null

  const halls = variant === 'cutter' ? mosaicHallsWithMerch() : null

  return (
    <section id="merch" className="cs-merch" aria-labelledby="cs-merch-title">
      <p className="cs-kicker">{t('merch.kicker')}</p>
      <h2 id="cs-merch-title" className="cs-about__title">
        {announcement.statement}
      </h2>
      <p className="cs-about__body">{announcement.body}</p>
      <p className="cs-about__note">{MERCH_STATUS}</p>
      <p className="cs-merch__posture">{MERCH_POSTURE}</p>

      <ul className="cs-merch__grid">
        {items.map((item) => (
          <li key={item.id}>
            <MerchCard item={item} />
          </li>
        ))}
      </ul>

      <p className="cs-merch__links">
        <Link to={`/${companyId}/merch`}>{t('merch.shop')}</Link>
        {companyId !== 'meridian' ? (
          <Link to="/meridian#merch">{t('merch.openMeridian')}</Link>
        ) : null}
      </p>

      {halls ? (
        <div className="cs-merch__halls">
          <h3 className="cs-merch__halls-title">{t('merch.allHalls')}</h3>
          <ul className="cs-merch__hall-grid">
            {halls.map((hall) => (
              <li key={hall.id}>
                <Link to={hall.shopHref} className="cs-merch__hall">
                  <img src={hall.imageSrc} alt="" aria-hidden="true" />
                  <span>
                    <strong>{hall.name}</strong>
                    <em>{hall.announcement.statement}</em>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}

export function MerchCard({ item }) {
  const { t } = useI18n()
  return (
    <Link to={item.href} className="cs-merch-card">
      <div className="cs-merch-card__media">
        <img src={item.imageSrc} alt="" aria-hidden="true" />
        <GarmentMark piece={item.piece} />
      </div>
      <p className="cs-merch-card__kicker">{t('merch.madeBy')}</p>
      <h3>{item.name}</h3>
      <p>{item.does}</p>
      <span className="cs-merch-card__cue">{t('merch.viewPiece')}</span>
    </Link>
  )
}
