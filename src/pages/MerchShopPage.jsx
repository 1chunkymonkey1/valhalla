import { Link, Navigate } from 'react-router-dom'
import { getCompany } from '../lib/companies'
import { isCompanySiteOpen } from '../lib/launchSchedule'
import { useSimulationClock } from '../hooks/useSimulationClock'
import {
  MERCH_POSTURE,
  MERCH_STATUS,
  getHallAnnouncement,
  merchItemsForCompany,
} from '../data/meridianMerch'
import { companyProducts } from '../data/companyProducts'
import EmailCapture from '../components/EmailCapture'
import { MerchCard } from '../components/MeridianMerch'
import { useI18n } from '../i18n/I18nProvider'

const TONES = {
  land: {
    ink: '#14201a',
    paper: '#f3f1eb',
    accent: '#2f5c45',
    muted: 'rgba(20, 32, 26, 0.62)',
  },
  water: {
    ink: '#0b1a2a',
    paper: '#eef2f6',
    accent: '#1a4a6e',
    muted: 'rgba(11, 26, 42, 0.62)',
  },
  air: {
    ink: '#1c2833',
    paper: '#f4f7fa',
    accent: '#4a7fa0',
    muted: 'rgba(28, 40, 51, 0.58)',
  },
  space: {
    ink: '#f4efe8',
    paper: '#0c0c0c',
    accent: '#e07030',
    muted: 'rgba(244, 239, 232, 0.62)',
  },
}

export default function MerchShopPage({ companyId }) {
  const { t } = useI18n()
  const { now } = useSimulationClock()
  const company = getCompany(companyId)
  const announcement = getHallAnnouncement(companyId)
  const items = merchItemsForCompany(companyId)
  const productMeta = companyProducts[companyId] || {}
  const tone = TONES[productMeta.tone] || TONES.land

  if (!company || !announcement || items.length === 0) {
    return <Navigate to={company ? `/${companyId}` : '/'} replace />
  }

  const open = company.mosaic === false || isCompanySiteOpen(company.id, now)
  if (!open) return <Navigate to={`/${companyId}`} replace />

  return (
    <div
      className={`cs cs--${productMeta.tone || 'land'} cs-merch-page`}
      style={{
        '--cs-ink': tone.ink,
        '--cs-paper': tone.paper,
        '--cs-accent': tone.accent,
        '--cs-muted': tone.muted,
      }}
    >
      <header className="cs-merch-page__header">
        <div className="cs-merch-page__bar">
          <Link to={`/${companyId}`}>← {company.name}</Link>
          <Link to="/meridian">{t('merch.openMeridian')}</Link>
        </div>
        <p className="cs-kicker">{t('merch.kicker')}</p>
        <h1>{announcement.statement}</h1>
        <p>{announcement.body}</p>
        <p className="cs-about__note">{MERCH_STATUS}</p>
        <p className="cs-merch__posture">{MERCH_POSTURE}</p>
      </header>

      <main className="cs-merch-page__main">
        <ul className="cs-merch__grid cs-merch__grid--page">
          {items.map((item) => (
            <li key={item.id}>
              <MerchCard item={item} />
            </li>
          ))}
        </ul>

        <section id="reserve" className="cs-reserve">
          <EmailCapture
            title={t('merch.joinList')}
            hint={MERCH_POSTURE}
            source={`merch:${companyId}:shop`}
            companyId={companyId}
            audience="merch"
          />
        </section>
      </main>
    </div>
  )
}
