import { Link } from 'react-router-dom'
import NextDoor from './NextDoor'
import ReservationForm from './ReservationForm'
import ProductRoadmap from './roadmap/ProductRoadmap'
import SiteMenu from './layout/SiteMenu'
import { companyProducts } from '../data/companyProducts'
import { formatUsd, getCompanyPayLink } from '../data/payLinks'
import { DISCORD_INVITE } from '../data/pressRelease'

const TONES = {
  land: {
    ink: '#14201a',
    paper: '#f3f1eb',
    accent: '#2f5c45',
    muted: 'rgba(20, 32, 26, 0.62)',
    heroInk: '#f7f4ee',
    heroMuted: 'rgba(247, 244, 238, 0.78)',
    wash: 'linear-gradient(180deg, rgba(12, 22, 16, 0.55) 0%, rgba(12, 22, 16, 0.28) 42%, rgba(12, 22, 16, 0.72) 100%)',
  },
  water: {
    ink: '#0b1a2a',
    paper: '#eef2f6',
    accent: '#1a4a6e',
    muted: 'rgba(11, 26, 42, 0.62)',
    heroInk: '#f2f6fa',
    heroMuted: 'rgba(242, 246, 250, 0.78)',
    wash: 'linear-gradient(180deg, rgba(6, 16, 28, 0.55) 0%, rgba(6, 16, 28, 0.25) 40%, rgba(6, 16, 28, 0.78) 100%)',
  },
  air: {
    ink: '#1c2833',
    paper: '#f4f7fa',
    accent: '#4a7fa0',
    muted: 'rgba(28, 40, 51, 0.58)',
    heroInk: '#f7fafc',
    heroMuted: 'rgba(247, 250, 252, 0.8)',
    wash: 'linear-gradient(180deg, rgba(28, 40, 51, 0.42) 0%, rgba(28, 40, 51, 0.18) 38%, rgba(28, 40, 51, 0.68) 100%)',
  },
  space: {
    ink: '#f4efe8',
    paper: '#0c0c0c',
    accent: '#e07030',
    muted: 'rgba(244, 239, 232, 0.62)',
    heroInk: '#f4efe8',
    heroMuted: 'rgba(244, 239, 232, 0.78)',
    wash: 'linear-gradient(180deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.2) 40%, rgba(0, 0, 0, 0.82) 100%)',
  },
}

export default function CompanySite({ company, now }) {
  const product = companyProducts[company.slug] || {
    product: company.name,
    headline: company.name,
    support: '',
    body: '',
    tone: 'land',
    gallery: [],
    interestGroups: ['General interest'],
  }

  const tone = TONES[product.tone] || TONES.land
  const hero = product.gallery[0] || {
    src: company.imageSrc || company.placeholderSrc,
    alt: company.name,
  }
  const strip = product.gallery.slice(1)
  const pay = getCompanyPayLink(company.slug)

  return (
    <div
      className={`cs cs--${product.tone}`}
      style={{
        '--cs-ink': tone.ink,
        '--cs-paper': tone.paper,
        '--cs-accent': tone.accent,
        '--cs-muted': tone.muted,
        '--cs-hero-ink': tone.heroInk,
        '--cs-hero-muted': tone.heroMuted,
        '--cs-wash': tone.wash,
      }}
    >
      <div className="cs-menu-slot">
        <SiteMenu tone="company" />
      </div>

      <header className="cs-hero">
        <img className="cs-hero__media" src={hero.src} alt="" aria-hidden="true" />
        <div className="cs-hero__wash" aria-hidden />

        <div className="cs-hero__bar">
          <Link to="/?demo=1" className="cs-hero__hub">
            Valhalla
          </Link>
          <span className="cs-hero__meta">
            {company.domain} · {company.pillar}
          </span>
        </div>

        <div className="cs-hero__copy">
          <h1 className="cs-hero__brand">{company.name}</h1>
          <p className="cs-hero__headline">{product.headline}</p>
          <p className="cs-hero__support">{product.support}</p>
          <div className="cs-hero__cta">
            <a href="#reserve" className="cs-btn cs-btn--solid">
              Hold a reservation
            </a>
            <a href="#roadmap" className="cs-btn cs-btn--ghost">
              Product path
            </a>
          </div>
        </div>
      </header>

      <main>
        <section id="about" className="cs-about">
          <p className="cs-kicker">{product.product}</p>
          <h2 className="cs-about__title">What this is</h2>
          <p className="cs-about__body">{product.body}</p>
          <p className="cs-about__note">Fully refundable reservations</p>
        </section>

        {pay && (
          <section className="cs-payband" aria-label="Refundable pay hold">
            <p className="cs-kicker">Squarespace pay hold</p>
            <h2 className="cs-about__title">{formatUsd(pay.estimateUsd)} estimated hold</h2>
            <p className="cs-about__body">{pay.notes}</p>
            {pay.payUrl ? (
              <a className="cs-btn cs-btn--solid" href={pay.payUrl} target="_blank" rel="noreferrer">
                Continue to Pay Link
              </a>
            ) : (
              <p className="cs-about__note">Pay Link URL pending in config</p>
            )}
          </section>
        )}

        {strip.length > 0 && (
          <section className="cs-gallery" aria-label={`${company.name} atmosphere`}>
            {strip.map((shot, i) => (
              <figure
                key={shot.src}
                className={`cs-gallery__shot ${i === 0 ? 'cs-gallery__shot--lead' : ''}`}
              >
                <img src={shot.src} alt={shot.alt} loading="lazy" />
              </figure>
            ))}
          </section>
        )}

        <ProductRoadmap companyId={company.slug} companyName={company.name} />

        <section id="reserve" className="cs-reserve">
          <ReservationForm
            companyId={company.slug}
            companyName={company.name}
            productName={product.product}
            interestGroups={product.interestGroups}
            accent={tone.accent}
            estimateUsd={pay?.estimateUsd}
            payUrl={pay?.payUrl || ''}
          />
        </section>

        <div className="cs-next">
          <NextDoor company={company} now={now} />
        </div>

        <footer className="cs-foot">
          <Link to="/?demo=1">← mosaic</Link>
          <a href={DISCORD_INVITE} target="_blank" rel="noreferrer">
            Discord
          </a>
          <Link to="/flow">Flow</Link>
        </footer>
      </main>
    </div>
  )
}
