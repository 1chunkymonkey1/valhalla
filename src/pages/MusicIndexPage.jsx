import { Link } from 'react-router-dom'
import {
  MUSIC_POSTURE,
  MUSIC_STATUS,
  apolloHouseAnnouncement,
  apolloHouseTracks,
  mosaicHallsWithMusic,
} from '../data/apolloMusic'
import EmailCapture from '../components/EmailCapture'
import { MusicCard } from '../components/ApolloMusic'
import { useI18n } from '../i18n/I18nProvider'

export default function MusicIndexPage() {
  const { t } = useI18n()
  const halls = mosaicHallsWithMusic()

  return (
    <div
      className="cs cs--land cs-merch-page"
      style={{
        '--cs-ink': '#1a1a16',
        '--cs-paper': '#f7f7f3',
        '--cs-accent': '#4a3d2a',
        '--cs-muted': 'rgba(26, 26, 22, 0.62)',
      }}
    >
      <header className="cs-merch-page__header">
        <div className="cs-merch-page__bar">
          <Link to="/">← Valhalla</Link>
          <Link to="/meridian/merch">{t('merch.shop')}</Link>
        </div>
        <p className="cs-kicker">{t('music.kicker')}</p>
        <h1>{apolloHouseAnnouncement.statement}</h1>
        <p>{apolloHouseAnnouncement.body}</p>
        <p className="cs-about__note">{MUSIC_STATUS}</p>
        <p className="cs-merch__posture">{MUSIC_POSTURE}</p>
      </header>

      <main className="cs-merch-page__main">
        <ul className="cs-merch__grid cs-merch__grid--page">
          {apolloHouseTracks.map((item) => (
            <li key={item.id}>
              <MusicCard item={item} />
            </li>
          ))}
        </ul>

        <div className="cs-merch__halls">
          <h2 className="cs-merch__halls-title">{t('music.allHalls')}</h2>
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

        <section id="reserve" className="cs-reserve">
          <EmailCapture
            title={t('music.joinList')}
            hint={MUSIC_POSTURE}
            source="music:catalog"
            audience="music"
          />
        </section>
      </main>
    </div>
  )
}
