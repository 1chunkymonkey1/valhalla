import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { CASURF } from '../../data/casurf'
import CasurfPhoto from '../../components/casurf/CasurfPhoto'
import './casurf.css'

const LINKS = [
  { to: '/casurfberkeley', label: 'Home', end: true },
  { to: '/casurfberkeley/about', label: 'About' },
  { to: '/casurfberkeley/gallery', label: 'Gallery' },
  { to: '/casurfberkeley/team', label: 'Team' },
  { to: '/casurfberkeley/events', label: 'Events' },
  { to: '/casurfberkeley/contact', label: 'Contact' },
]

export default function CasurfLayout() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.title = 'CA-SURF Berkeley'
    const id = 'casurf-fonts'
    if (document.getElementById(id)) return undefined
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap'
    document.head.appendChild(link)
    const icon = document.createElement('link')
    icon.rel = 'icon'
    icon.href = '/casurf/logo.svg'
    document.head.appendChild(icon)
    return undefined
  }, [])

  return (
    <div className="cs-app">
      <nav className="cs-nav" aria-label="CA-SURF Berkeley">
        <Link to="/casurfberkeley" className="cs-nav__mark">
          <CasurfPhoto stem="/casurf/logo" alt="" className="cs-nav__logo" preferSvg />
          <span className="cs-nav__word">
            CA<em>-</em>SURF
          </span>
        </Link>
        <div className="cs-nav__links">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/casurfberkeley/contact" className="cs-nav__cta">
            Get involved
          </NavLink>
        </div>
        <button
          type="button"
          className="cs-nav__burger"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
      {open && (
        <div className="cs-drawer">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}

      <Outlet />

      <footer className="cs-foot">
        <div className="cs-foot__top">
          <Link to="/casurfberkeley" className="cs-nav__word" style={{ color: '#fff' }}>
            CA<em>-</em>SURF Berkeley
          </Link>
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ))}
          <a className="cs-ig" href={CASURF.instagramUrl} target="_blank" rel="noreferrer">
            @{CASURF.instagram}
          </a>
          <a href={CASURF.parentUrl} target="_blank" rel="noreferrer">
            Parent site · casurf.vote
          </a>
        </div>
        <p className="cs-foot__copy">
          © {new Date().getFullYear()} {CASURF.tagline}. UC Berkeley chapter. Donations are not
          collected on this site.
        </p>
      </footer>
    </div>
  )
}
