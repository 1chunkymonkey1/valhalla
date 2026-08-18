import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  aphroditeFetch,
  getAphroditeSession,
  getDemoAccessToken,
  isAphroditeAuthConfigured,
  signOutAphrodite,
  syncAphroditeSession,
} from '../../lib/aphroditeClient'

function injectAphroditePwa() {
  const head = document.head
  const ensure = (selector, create) => {
    if (head.querySelector(selector)) return
    head.appendChild(create())
  }
  ensure('link[rel="manifest"][href="/aphrodite.webmanifest"]', () => {
    const link = document.createElement('link')
    link.rel = 'manifest'
    link.href = '/aphrodite.webmanifest'
    return link
  })
  ensure('meta[name="apple-mobile-web-app-capable"]', () => {
    const meta = document.createElement('meta')
    meta.name = 'apple-mobile-web-app-capable'
    meta.content = 'yes'
    return meta
  })
  ensure('meta[name="apple-mobile-web-app-title"]', () => {
    const meta = document.createElement('meta')
    meta.name = 'apple-mobile-web-app-title'
    meta.content = 'Aphrodite'
    return meta
  })
  document.title = 'Aphrodite'
}

export default function AphroditeLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [boot, setBoot] = useState({ loading: true, profile: null, subscribed: false })

  useEffect(() => {
    injectAphroditePwa()
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        if (isAphroditeAuthConfigured()) {
          const session = await getAphroditeSession()
          if (!session) {
            if (!cancelled) setBoot({ loading: false, profile: null, subscribed: false })
            return
          }
          const data = await syncAphroditeSession()
          if (!cancelled) {
            setBoot({
              loading: false,
              profile: data.profile,
              subscribed: Boolean(data.subscribed),
            })
          }
          return
        }

        if (getDemoAccessToken()) {
          const data = await aphroditeFetch('me')
          if (!cancelled) {
            setBoot({
              loading: false,
              profile: data.profile,
              subscribed: Boolean(data.subscribed),
            })
          }
          return
        }

        if (!cancelled) setBoot({ loading: false, profile: null, subscribed: false })
      } catch {
        if (!cancelled) setBoot({ loading: false, profile: null, subscribed: false })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [location.pathname])

  async function onSignOut() {
    await signOutAphrodite()
    setBoot({ loading: false, profile: null, subscribed: false })
    navigate('/aphrodite')
  }

  async function refreshMe() {
    try {
      const data = await aphroditeFetch('me')
      setBoot((b) => ({
        ...b,
        profile: data.profile,
        subscribed: Boolean(data.subscribed),
      }))
      return data
    } catch {
      return null
    }
  }

  return (
    <div className="aph">
      <header className="aph__top">
        <Link to="/aphrodite" className="aph__mark">
          <img src="/brand-mark.png" alt="" width={28} height={28} />
          <span>Aphrodite</span>
        </Link>
        <nav className="aph__nav" aria-label="Aphrodite">
          <NavLink to="/aphrodite" end>
            Home
          </NavLink>
          {boot.profile ? (
            <>
              <NavLink to="/aphrodite/matches">Matches</NavLink>
              <NavLink to="/aphrodite/profile">Profile</NavLink>
              <NavLink to="/aphrodite/settings">Settings</NavLink>
              {!boot.subscribed && (
                <NavLink to="/aphrodite/subscribe" className="aph__nav-cta">
                  Join · $20
                </NavLink>
              )}
              <button type="button" className="aph__text-btn" onClick={onSignOut}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/aphrodite/sign-in">Sign in</NavLink>
              <NavLink to="/aphrodite/sign-up" className="aph__nav-cta">
                Join
              </NavLink>
            </>
          )}
        </nav>
      </header>

      <main className="aph__main">
        <Outlet
          context={{
            boot,
            setBoot,
            refreshMe,
            loading: boot.loading,
            profile: boot.profile,
            subscribed: boot.subscribed,
          }}
        />
      </main>

      <footer className="aph__foot">
        <p>
          Aphrodite · 18+ · Valhalla ecosystem ·{' '}
          <Link to="/aphrodite/privacy">Privacy</Link>
          {' · '}
          <Link to="/aphrodite/terms">Terms</Link>
          {' · '}
          <Link to="/aphrodite/safety">Safety</Link>
          {' · '}
          <Link to="/">valhallaco.org</Link>
        </p>
      </footer>
    </div>
  )
}
