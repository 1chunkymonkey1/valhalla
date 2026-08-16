import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PhenixKenazGate from '../components/PhenixKenazGate'

export default function PrometheusPortalPage() {
  const [state, setState] = useState('checking')
  const [src, setSrc] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/api/hub/prometheus-gate', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data?.unlocked && data.redirectUrl) {
          setSrc(data.redirectUrl)
          setState('open')
        } else {
          setState('locked')
        }
      })
      .catch(() => {
        if (!cancelled) setState('locked')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="pm-portal">
      <header className="pm-portal__bar">
        <Link to="/phenix">← Phenix</Link>
        <span>Prometheus Defense</span>
        <Link to="/">mosaic</Link>
      </header>
      {state === 'checking' ? <p className="pm-portal__note">Opening the forge…</p> : null}
      {state === 'locked' ? (
        <div className="pm-portal__locked">
          <p>Kenaz is closed.</p>
          <PhenixKenazGate />
        </div>
      ) : null}
      {state === 'open' ? (
        <iframe className="pm-portal__frame" title="Prometheus Defense" src={src} />
      ) : null}
    </div>
  )
}
