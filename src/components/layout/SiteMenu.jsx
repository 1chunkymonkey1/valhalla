import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { DISCORD_INVITE } from '../../data/pressRelease'

const LINKS = [
  { to: '/', label: 'Hub' },
  { to: '/investors', label: 'Investors' },
  { to: '/consumers', label: 'Consumers' },
  { to: '/partners', label: 'Partners' },
  { to: '/flow', label: 'Flow' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/press', label: 'Press' },
  { to: '/contact', label: 'Contact' },
  { href: DISCORD_INVITE, label: 'Discord', external: true },
]

export default function SiteMenu({ tone = 'hub' }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  useEffect(() => {
    if (!open) return undefined
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
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
        <span className="vh-menu__sr">Menu</span>
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
          {LINKS.map((item) => (
            <li key={item.label}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link to={item.to} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <p className="vh-menu__fine">
          <Link to="/team/login" onClick={() => setOpen(false)}>
            Team
          </Link>
          {' · '}
          <Link to="/admin" onClick={() => setOpen(false)}>
            Admin
          </Link>
        </p>
      </nav>
    </div>
  )
}
