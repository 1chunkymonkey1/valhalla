import { Link } from 'react-router-dom'
import EmailCapture from '../components/EmailCapture'
import { CONTACT_EMAIL, DISCORD_INVITE } from '../data/pressRelease'
import { useI18n } from '../i18n/I18nProvider'

function AudiencePage({ kind, title, lead, bullets }) {
  const { t } = useI18n()
  return (
    <div className="vh-page">
      <header className="vh-aud__hero">
        <p className="vh-aud__mark">Valhalla</p>
        <h1>{title}</h1>
        <p>{lead}</p>
      </header>
      <main className="vh-aud__main">
        <ul>
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <EmailCapture
          title={t('email.getUpdates')}
          hint={t('email.getUpdatesHint')}
          source={kind}
          audience={kind}
        />
        <p className="vh-aud__links">
          <Link to="/flow">{t('audience.networkFlow')}</Link>
          <a href={DISCORD_INVITE} target="_blank" rel="noreferrer">
            {t('nav.discord')}
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`}>{t('email.email')}</a>
        </p>
      </main>
    </div>
  )
}

export function InvestorsPage() {
  const { t } = useI18n()
  return (
    <AudiencePage
      kind="investors"
      title={t('audience.investorsTitle')}
      lead={t('audience.investorsLead')}
      bullets={[t('audience.investorsB1'), t('audience.investorsB2'), t('audience.investorsB3')]}
    />
  )
}

export function ConsumersPage() {
  const { t } = useI18n()
  return (
    <AudiencePage
      kind="consumers"
      title={t('audience.consumersTitle')}
      lead={t('audience.consumersLead')}
      bullets={[t('audience.consumersB1'), t('audience.consumersB2'), t('audience.consumersB3')]}
    />
  )
}

export function PartnersPage() {
  const { t } = useI18n()
  return (
    <AudiencePage
      kind="partners"
      title={t('audience.partnersTitle')}
      lead={t('audience.partnersLead')}
      bullets={[t('audience.partnersB1'), t('audience.partnersB2'), t('audience.partnersB3')]}
    />
  )
}

export function ContactPage() {
  const { t } = useI18n()
  return (
    <div className="vh-page">
      <header className="vh-aud__hero">
        <p className="vh-aud__mark">Valhalla</p>
        <h1>{t('audience.contactTitle')}</h1>
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <br />
          (209) 768-4306
        </p>
      </header>
      <main className="vh-aud__main">
        <EmailCapture source="contact" audience="contact" title={t('email.writeUs')} />
        <p className="vh-aud__links">
          <a href={DISCORD_INVITE} target="_blank" rel="noreferrer">
            {t('nav.discord')}
          </a>
          <Link to="/press">{t('audience.pressRelease')}</Link>
        </p>
      </main>
    </div>
  )
}

export function RoadmapIndexPage() {
  const { t } = useI18n()
  return (
    <div className="vh-page">
      <header className="vh-aud__hero">
        <p className="vh-aud__mark">Valhalla</p>
        <h1>{t('audience.roadmapTitle')}</h1>
        <p>
          Each hall has its own product path. Wolf’s later vision includes{' '}
          <strong>Dire Wolf</strong>, a phased SF→NYC railroad (complete by 2031).
        </p>
      </header>
      <main className="vh-aud__main">
        <p>
          Open a company from the <Link to="/">{t('common.mosaic')}</Link> or the{' '}
          <Link to="/flow">{t('nav.flow')}</Link> for its product sequence.
        </p>
      </main>
    </div>
  )
}
