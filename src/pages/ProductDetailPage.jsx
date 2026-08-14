import { Link, Navigate, useParams } from 'react-router-dom'
import { getCompany } from '../lib/companies'
import { getProductDetail } from '../data/hallMatrices'
import { companyProducts } from '../data/companyProducts'
import { powertrainNoteForStencil } from '../data/powertrainTiers'
import ProductStencil from '../components/roadmap/ProductStencils'
import EmailCapture from '../components/EmailCapture'
import SiteMenu from '../components/layout/SiteMenu'
import { formatMatrixDate } from '../data/hallMatrices'
import { CORVUS_PHASES, corvusPromptPayLinks } from '../data/corvusPricing'
import { formatUsd } from '../data/payLinks'
import { resolveProductImage } from '../lib/productImages'

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

export default function ProductDetailPage({
  companyId: companyIdProp,
  productSlug: productSlugProp,
}) {
  const params = useParams()
  const companyId = companyIdProp || params.companyId
  const productSlug = productSlugProp || params.productSlug

  const company = getCompany(companyId)
  const detail = getProductDetail(companyId, productSlug)

  if (!company) return <Navigate to="/" replace />
  if (!detail) return <Navigate to={`/${companyId}`} replace />

  const { matrix, line, cell, displayName } = detail
  const productMeta = companyProducts[companyId] || {}
  const tone = TONES[productMeta.tone] || TONES.land
  const showPowertrain = Boolean(line.powertrain)
  const tiers = matrix.powertrainTiers || []
  const powerNote = powertrainNoteForStencil(line.stencil || line.vehicle)
  const benefits = cell.benefits?.length ? cell.benefits : line.benefits
  const savings = cell.savings?.length ? cell.savings : line.savings
  const addOns = cell.addOns?.length ? cell.addOns : line.addOns
  const highlights = cell.highlights || line.highlights || []
  const phases =
    cell.phases && matrix.phasesForLineId === line.id ? matrix.phases : null
  const heroImage = resolveProductImage(companyId, cell, line)

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
      <div className="cs-menu-slot">
        <SiteMenu tone="company" />
      </div>

      <header className="product-detail__header">
        <div className="product-detail__bar">
          <Link to={`/${companyId}`} className="product-detail__back">
            ← {company.name}
          </Link>
          <Link to={`/${companyId}#roadmap`} className="product-detail__matrix-link">
            Matrix
          </Link>
        </div>
        <p className="product-detail__kicker">{line.epithet}</p>
        <h1 className="product-detail__brand">{displayName}</h1>
        <p className="product-detail__naming">{line.naming}</p>
        {cell.status && (
          <p className="product-detail__status">
            {cell.status}
            {cell.targetDate ? ` · ${formatMatrixDate(cell.targetDate)}` : ''}
          </p>
        )}
      </header>

      <main className="product-detail__main">
        {heroImage && (
          <figure className="product-detail__hero">
            <img
              src={heroImage}
              alt={`${displayName} in the field`}
              loading="eager"
              decoding="async"
            />
          </figure>
        )}

        <section
          className={`product-detail__blueprint${
            heroImage ? ' product-detail__blueprint--copy-only' : ''
          }`}
        >
          {!heroImage && (
            <ProductStencil
              stencil={line.stencil || line.vehicle}
              hall={company.name}
            />
          )}
          <div className="product-detail__blueprint-copy">
            <h2>What it does</h2>
            <p>{cell.does || line.does || cell.description}</p>
            <p className="product-detail__overview">{line.overview}</p>
            {cell.description && cell.does && (
              <p className="product-detail__desc">{cell.description}</p>
            )}
          </div>
        </section>

        {highlights.length > 0 && (
          <section className="product-detail__section">
            <h2>Highlights</h2>
            <ul className="product-detail__cards">
              {highlights.map((h) => (
                <li key={h.title}>
                  <strong>{h.title}</strong>
                  <p>{h.text}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {benefits?.length > 0 && (
          <section className="product-detail__section">
            <h2>Benefits</h2>
            <ul>
              {benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        )}

        {savings?.length > 0 && (
          <section className="product-detail__section">
            <h2>Savings</h2>
            <ul>
              {savings.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        {addOns?.length > 0 && (
          <section className="product-detail__section">
            <h2>Value-adds / add-ons</h2>
            <ul className="product-detail__addons">
              {addOns.map((a) => (
                <li key={a.id || a.name}>
                  <strong>{a.name}</strong>
                  <p>{a.text}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {showPowertrain && tiers.length > 0 && (
          <section className="product-detail__section product-detail__tiers">
            <h2>Three-tier powertrain</h2>
            {powerNote && <p className="product-detail__tier-note">{powerNote}</p>}
            <ol>
              {tiers.map((t) => (
                <li key={t.id}>
                  <strong>{t.name}</strong>
                  <p>{t.summary}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {phases && (
          <section className="product-detail__section">
            <h2>Dire Wolf · rail phases</h2>
            <ol className="product-detail__phases">
              {phases.map((phase) => (
                <li key={phase.id}>
                  <strong>{phase.name}</strong>
                  <span className="product-detail__phase-window">{phase.window}</span>
                  <p>{phase.text}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {matrix.community && companyId === 'wolf' && (
          <section className="product-detail__section">
            <h2>{matrix.community.title}</h2>
            <p>{matrix.community.body}</p>
          </section>
        )}

        {cell.corvusPrompts && <CorvusPromptSummary />}

        <section id="reserve" className="product-detail__reserve">
          <EmailCapture
            source={`product:${companyId}:${cell.id}`}
            companyId={companyId}
            audience="roadmap"
          />
        </section>

        <footer className="product-detail__foot">
          <Link to={`/${companyId}#roadmap`}>← back to {company.name} matrix</Link>
          <Link to="/?demo=1">mosaic</Link>
        </footer>
      </main>
    </div>
  )
}

function CorvusPromptSummary() {
  return (
    <section className="product-detail__section">
      <h2>Raven OS · 21 prompts</h2>
      <p>
        First prompt $100, second $200, third $300. Phases rise to Prompt 21 at $21,000 with the
        Twenty-First Raven badge.
      </p>
      <div className="vh-corvus-price__phases">
        {CORVUS_PHASES.map((phase) => (
          <div key={phase.id} className="vh-corvus-price__phase">
            <p className="vh-corvus-price__phase-name">{phase.name}</p>
            <p className="vh-corvus-price__phase-blurb">{phase.blurb}</p>
            <ul>
              {phase.prompts.map((n) => {
                const tier = corvusPromptPayLinks[n - 1]
                return (
                  <li key={n}>
                    <span>
                      Prompt {String(n).padStart(2, '0')}
                      {n === 21 ? ' · badge' : ''}
                    </span>
                    <span>{formatUsd(tier.estimateUsd)}</span>
                    <span className="vh-corvus-price__stub">email</span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
