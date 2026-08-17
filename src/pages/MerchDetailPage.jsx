import { Link, Navigate, useParams } from 'react-router-dom'
import { getCompany } from '../lib/companies'
import { isCompanySiteOpen } from '../lib/launchSchedule'
import { useSimulationClock } from '../hooks/useSimulationClock'
import { MERCH_POSTURE, MERCH_STATUS, getMerchItem } from '../data/meridianMerch'
import { companyProducts } from '../data/companyProducts'
import EmailCapture from '../components/EmailCapture'
import GarmentMark from '../components/GarmentMark'
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

export default function MerchDetailPage({
  companyId: companyIdProp,
  sku: skuProp,
}) {
  const { t } = useI18n()
  const params = useParams()
  const { now } = useSimulationClock()
  const companyId = companyIdProp || params.companyId
  const sku = skuProp || params.sku
  const company = getCompany(companyId)
  const item = getMerchItem(companyId, sku)
  const productMeta = companyProducts[companyId] || {}
  const tone = TONES[productMeta.tone] || TONES.land

  if (!company) return <Navigate to="/" replace />
  const open = company.mosaic === false || isCompanySiteOpen(company.id, now)
  if (!open) return <Navigate to={`/${companyId}`} replace />
  if (!item) return <Navigate to={`/${companyId}/merch`} replace />

  return (
    <div
      className={`cs cs--${productMeta.tone || 'land'} product-detail`}
      style={{
        '--cs-ink': tone.ink,
        '--cs-paper': tone.paper,
        '--cs-accent': tone.accent,
        '--cs-muted': tone.muted,
      }}
    >
      <header className="product-detail__header">
        <div className="product-detail__bar">
          <Link to={`/${companyId}`} className="product-detail__back">
            ← {company.name}
          </Link>
          <Link to={`/${companyId}/merch`} className="product-detail__matrix-link">
            {t('merch.shop')}
          </Link>
        </div>
        <p className="product-detail__kicker">{t('merch.madeBy')}</p>
        <h1 className="product-detail__brand">{item.name}</h1>
        <p className="product-detail__naming">{item.statement}</p>
        <p className="product-detail__status">{MERCH_STATUS}</p>
      </header>

      <main className="product-detail__main">
        <figure className="product-detail__hero cs-merch-hero">
          <img src={item.imageSrc} alt="" aria-hidden="true" />
          <GarmentMark piece={item.piece} />
        </figure>

        <section className="product-detail__blueprint product-detail__blueprint--copy-only">
          <div className="product-detail__blueprint-copy">
            <h2>{item.garment}</h2>
            <p>{item.does}</p>
            <p className="product-detail__overview">{item.material}</p>
            <p className="product-detail__desc">{MERCH_POSTURE}</p>
          </div>
        </section>

        <section id="reserve" className="product-detail__reserve">
          <EmailCapture
            title={t('merch.joinList')}
            hint={MERCH_POSTURE}
            source={`merch:${companyId}:${item.sku}`}
            companyId={companyId}
            audience="merch"
          />
        </section>

        <footer className="product-detail__foot">
          <Link to={`/${companyId}/merch`}>{t('merch.backToMerch')}</Link>
          <Link to="/meridian">{t('merch.openMeridian')}</Link>
        </footer>
      </main>
    </div>
  )
}
