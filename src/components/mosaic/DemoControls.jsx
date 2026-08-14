import {
  resetDemoSession,
  exitDemoToLive,
  getDemoRate,
  isDemoPaused,
  toggleDemoPause,
} from '../../lib/simulationClock'
import { useI18n } from '../../i18n/I18nProvider'

export default function DemoControls({ mode, rate, paused }) {
  const { t } = useI18n()
  if (mode !== 'demo') return null

  const displayRate = rate || getDemoRate()
  const isPaused = typeof paused === 'boolean' ? paused : isDemoPaused()

  function restart() {
    resetDemoSession()
    window.location.href = '/?demo=1'
  }

  function exitDemo() {
    exitDemoToLive()
    window.location.href = '/?demo=0'
  }

  function onPauseToggle() {
    toggleDemoPause()
  }

  return (
    <div className="vh-demo-controls">
      <span>
        {t('demo.strip', { rate: displayRate })}
        {isPaused ? t('demo.paused') : ''}
      </span>
      <button type="button" onClick={onPauseToggle}>
        {isPaused ? t('demo.resume') : t('demo.pause')}
      </button>
      <button type="button" onClick={restart}>
        {t('demo.restart')}
      </button>
      <button type="button" onClick={exitDemo}>
        {t('demo.live')}
      </button>
    </div>
  )
}
