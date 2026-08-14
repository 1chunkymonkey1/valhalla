import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ReactLenis, useLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import {
  LENIS_OPTIONS,
  setLenis,
  shouldPreventLenis,
} from '../lib/smoothScroll'

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function LenisBridge() {
  const lenis = useLenis()
  const location = useLocation()

  useEffect(() => {
    setLenis(lenis ?? null)
    return () => setLenis(null)
  }, [lenis])

  // Instant jump on route change — tactile inertia shouldn't carry across pages.
  useEffect(() => {
    if (!lenis) {
      window.scrollTo(0, 0)
      return
    }
    lenis.scrollTo(0, { immediate: true })
  }, [location.pathname, lenis])

  return null
}

/**
 * Site-wide Lenis smooth scroll (same class of feel as ednacharge.com).
 * Uses root/window mode so `position: fixed` SiteChrome stays correct.
 * Touch stays native (syncTouch: false) for iOS.
 */
export default function SmoothScroll({ children }) {
  const [enabled, setEnabled] = useState(() => !prefersReducedMotion())

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setEnabled(!mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  if (!enabled) {
    return children
  }

  return (
    <ReactLenis
      root
      options={{
        ...LENIS_OPTIONS,
        prevent: shouldPreventLenis,
      }}
    >
      <LenisBridge />
      {children}
    </ReactLenis>
  )
}
