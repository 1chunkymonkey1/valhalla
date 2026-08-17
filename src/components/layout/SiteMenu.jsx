import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { DISCORD_INVITE } from '../../data/pressRelease'
import { useI18n } from '../../i18n/I18nProvider'
import { getLenis } from '../../lib/smoothScroll'

const LINK_DEFS = [
  { to: '/', key: 'nav.hub' },
  { to: '/investors', key: 'nav.investors' },
  { to: '/consumers', key: 'nav.consumers' },
  { to: '/partners', key: 'nav.partners' },
  { to: '/flow', key: 'nav.flow' },
  { to: '/roadmap', key: 'nav.roadmap' },
  { to: '/press', key: 'nav.press' },
    { to: '/meridian', key: 'nav.meridian' },
    { to: '/meridian/merch', key: 'merch.shop' },
    { to: '/music', key: 'music.shop' },
    { to: '/contact', key: 'nav.contact' },
  { href: DISCORD_INVITE, key: 'nav.discord', external: true },
]

export default function SiteMenu({ tone = 'hub' }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const { t } = useI18n()

  useEffect(() => {
    if (!open) return undefined
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    getLenis()?.stop()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      getLenis()?.start()
    }
  }, [open])

  return (
    <div className={`vh-menu vh-menu--${tone}`}>
      <button
        type="button"
        className="vh-menu__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="vh-menu__bars" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="vh-menu__sr">{t('nav.menu')}</span>
      </button>

      {open && (
        <div className="vh-menu__scrim" onClick={() => setOpen(false)} aria-hidden />
      )}

      <nav
        id={panelId}
        className={`vh-menu__panel ${open ? 'vh-menu__panel--open' : ''}`}
        aria-hidden={!open}
      >
        <p className="vh-menu__brand">Valhalla</p>
        <ul className="vh-menu__list">
          {LINK_DEFS.map((item) => (
            <li key={item.key}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                </a>
              ) : (
                <Link to={item.to} onClick={() => setOpen(false)}>
                  {t(item.key)}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <p className="vh-menu__fine">
          <Link to="/aphrodite" onClick={() => setOpen(false)}>
            Aphrodite
          </Link>
          <span aria-hidden="true"> · </span>
          <Link to="/team/login" onClick={() => setOpen(false)}>
            {t('nav.team')}
          </Link>
        </p>
      </nav>
    </div>
  )
}
