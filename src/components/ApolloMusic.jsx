import { Link } from 'react-router-dom'
import {
  MUSIC_POSTURE,
  MUSIC_STATUS,
  getMusicAnnouncement,
  mosaicHallsWithMusic,
  musicItemsForCompany,
} from '../data/apolloMusic'
import { useI18n } from '../i18n/I18nProvider'
import ScoreMark from './ScoreMark'

export default function ApolloMusic({ companyId, variant = 'hall' }) {
  const { t } = useI18n()
  const announcement = getMusicAnnouncement(companyId)
  const items = musicItemsForCompany(companyId)
  if (!announcement) return null
  if (variant !== 'house' && items.length === 0) return null

  const halls = variant === 'house' ? mosaicHallsWithMusic() : null

  return (
    <section id="music" className="cs-merch" aria-labelledby="cs-music-title">
      <p className="cs-kicker">{t('music.kicker')}</p>
      <h2 id="cs-music-title" className="cs-about__title">
        {announcement.statement}
      </h2>
      <p className="cs-about__body">{announcement.body}</p>
      {items[0]?.merchTie ? (
        <p className="cs-about__body">{t('music.wearsWith', { garment: items[0].merchTie })}</p>
      ) : null}
      <p className="cs-about__note">{MUSIC_STATUS}</p>
      <p className="cs-merch__posture">{MUSIC_POSTURE}</p>

      {items.length > 0 ? (
        <ul className="cs-merch__grid">
          {items.map((item) => (
            <li key={item.id}>
              <MusicCard item={item} />
            </li>
          ))}
        </ul>
      ) : null}

      <p className="cs-merch__links">
        <Link to={companyId === 'apollo-music' ? '/music' : `/${companyId}/music`}>
          {t('music.shop')}
        </Link>
        {items[0]?.merchHref ? <Link to={items[0].merchHref}>{t('merch.shop')}</Link> : null}
        {companyId !== 'apollo-music' ? <Link to="/music">{t('music.openHouse')}</Link> : null}
      </p>

      {halls ? (
        <div className="cs-merch__halls">
          <h3 className="cs-merch__halls-title">{t('music.allHalls')}</h3>
          <ul className="cs-merch__hall-grid">
            {halls.map((hall) => (
              <li key={hall.id}>
                <Link to={hall.shopHref} className="cs-merch__hall">
                  <img src={hall.imageSrc} alt="" aria-hidden="true" />
                  <span>
                    <strong>{hall.name}</strong>
                    <em>{hall.epithet}</em>
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

export function MusicCard({ item }) {
  const { t } = useI18n()
  if (!item) return null
  return (
    <Link to={item.href} className="cs-merch-card">
      <div className="cs-merch-card__media">
        <img src={item.imageSrc} alt="" aria-hidden="true" />
        <ScoreMark />
      </div>
      <p className="cs-merch-card__kicker">{t('music.madeBy')}</p>
      <h3>{item.name}</h3>
      <p>{item.does}</p>
      <span className="cs-merch-card__cue">{t('music.viewScore')}</span>
    </Link>
  )
}
