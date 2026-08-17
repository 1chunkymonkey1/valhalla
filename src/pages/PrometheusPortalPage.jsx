import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PhenixKenazGate from '../components/PhenixKenazGate'
import PrometheusInterior from '../components/PrometheusInterior'

export default function PrometheusPortalPage() {
  const [state, setState] = useState('checking')

  useEffect(() => {
    let cancelled = false
    fetch('/api/hub/prometheus-gate', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setState(data?.unlocked ? 'open' : 'locked')
      })
      .catch(() => {
        if (!cancelled) setState('locked')
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function lock() {
    await fetch('/api/hub/prometheus-gate', { method: 'DELETE', credentials: 'include' })
    setState('locked')
  }

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
          <PhenixKenazGate placement="hall" onUnlocked={() => setState('open')} />
        </div>
      ) : null}
      {state === 'open' ? <PrometheusInterior onLock={lock} /> : null}
    </div>
  )
}
