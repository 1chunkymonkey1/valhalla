import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { EXTRA_COMPANY_ROUTES, GRID_ORDER } from '../../lib/companies'
import { resolveProductHost } from '../../lib/productHost'
import { HIDDEN_PORTAL_PATHS } from '../../data/hiddenPortals'
import SiteMenu from './SiteMenu'

const COMPANY_PATH_IDS = [...GRID_ORDER, ...EXTRA_COMPANY_ROUTES]

function isCompanyPath(pathname) {
  return COMPANY_PATH_IDS.some(
    (id) => pathname === `/${id}` || pathname.startsWith(`/${id}/`),
  )
}

/**
 * Persistent public chrome: brand mark (home) top-left, hamburger top-right.
 * Landing mosaic (`/`) hides the corner mark; Valhalla is spelled in-page instead.
 */
export default function SiteChrome() {
  const location = useLocation()
  const hostProduct = useMemo(
    () =>
      resolveProductHost(
        typeof window !== 'undefined' ? window.location.hostname : '',
      ),
    [],
  )
  if (location.pathname === '/capital') return null
  if (location.pathname.startsWith('/aphrodite')) return null
  if (location.pathname.startsWith('/phenix/prometheus')) return null
  if (HIDDEN_PORTAL_PATHS.includes(location.pathname) && location.pathname !== '/eason') {
    return null
  }

  const isHome = location.pathname === '/'
  const tone =
    hostProduct || isCompanyPath(location.pathname) ? 'company' : 'hub'

  return (
    <div className={`vh-chrome vh-chrome--${tone}`} aria-label="Site chrome">
      {!isHome && (
        <Link to="/" className="vh-chrome__brand" aria-label="Valhalla home">
          <img
            src="/brand-mark.png"
            alt=""
            width={32}
            height={32}
            decoding="async"
          />
        </Link>
      )}
      <SiteMenu tone={tone} />
    </div>
  )
}
