import { useState } from 'react'
import { getRoadmap, roadmapOpacity } from '../../data/roadmaps'
import EmailCapture from '../EmailCapture'
import { formatUsd, getCompanyPayLink } from '../../data/payLinks'
import { CORVUS_PHASES, corvusPromptPayLinks } from '../../data/corvusPricing'
import WolfProductMatrix from './WolfProductMatrix'

export default function ProductRoadmap({ companyId, companyName }) {
  const roadmap = getRoadmap(companyId)
  const [active, setActive] = useState(null)

  // Wolf uses the square product matrix; other halls keep oval tracks for now.
  if (companyId === 'wolf') {
    return <WolfProductMatrix />
  }

  if (!roadmap) return null

  const items = roadmap.items
  const activeItem = items.find((i) => i.id === active) || null
  const pay = getCompanyPayLink(companyId)

  return (
    <section className="vh-road" id="roadmap">
      <p className="vh-road__kicker">Product roadmap</p>
      <h2 className="vh-road__title">{companyName} path</h2>
      {roadmap.cascadeNote && <p className="vh-road__note">{roadmap.cascadeNote}</p>}

      <ol className="vh-road__track">
        {items.map((item, index) => {
          const opacity = roadmapOpacity(index, items.length)
          const isMystery = item.kind === 'mystery' || !item.clickable
          return (
            <li key={item.id} style={{ opacity }}>
              <button
                type="button"
                className={`vh-road__oval ${isMystery ? 'vh-road__oval--mystery' : ''} ${
                  active === item.id ? 'vh-road__oval--active' : ''
                }`}
                disabled={isMystery}
                aria-label={isMystery ? 'Mystery — unknown' : item.name}
                onClick={() => setActive(item.id === active ? null : item.id)}
              >
                <span className="vh-road__oval-name">
                  {isMystery ? '?' : item.name}
                </span>
                {!isMystery && item.status && (
                  <span className="vh-road__oval-status">{item.status}</span>
                )}
              </button>
            </li>
          )
        })}
      </ol>

      {activeItem && (
        <div className="vh-road__detail">
          <h3>{activeItem.name}</h3>
          <p>{activeItem.summary}</p>

          {activeItem.detail && (
            <div className="vh-road__megaproject">
              <p>
                <strong>{activeItem.detail.timelineYears}-year timeline</strong>
                {activeItem.detail.travelHours
                  ? ` · target ${activeItem.detail.travelHours} hour coast-to-coast`
                  : ''}
              </p>
              <p>{activeItem.detail.whyNation}</p>
              <ul>
                {activeItem.detail.objectives.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
          )}

          {activeItem.capture === 'pay' && pay && (
            <PayHoldCTA pay={pay} />
          )}

          {activeItem.capture === 'email' && (
            <EmailCapture
              title="Signal interest"
              hint="Theoretical / early concept — email only. No operational claim."
              source={`roadmap:${companyId}:${activeItem.id}`}
              companyId={companyId}
              audience="roadmap"
            />
          )}

          {companyId === 'corvus' && activeItem.id === 'raven-os' && (
            <CorvusPromptTable />
          )}
        </div>
      )}
    </section>
  )
}

function PayHoldCTA({ pay }) {
  const live = Boolean(pay.payUrl)
  return (
    <div className="vh-pay">
      <p className="vh-pay__label">Fully refundable hold</p>
      <p className="vh-pay__amount">{formatUsd(pay.estimateUsd)}</p>
      <p className="vh-pay__notes">{pay.notes}</p>
      {live ? (
        <a className="vh-pay__btn" href={pay.payUrl} target="_blank" rel="noreferrer">
          Continue to Squarespace Pay Link
        </a>
      ) : (
        <p className="vh-pay__pending">
          Pay Link pending — create in Squarespace and paste URL into{' '}
          <code>src/data/payLinks.js</code>.
        </p>
      )}
    </div>
  )
}

function CorvusPromptTable() {
  return (
    <div className="vh-corvus-price">
      <h4>Raven OS · 21 prompts</h4>
      <p>
        First prompt $100, second $200, third $300. Middle tiers rise through named phases.
        Prompt 21 is $21,000 and unlocks the Twenty-First Raven community badge.
      </p>
      <div className="vh-corvus-price__phases">
        {CORVUS_PHASES.map((phase) => (
          <div key={phase.id} className="vh-corvus-price__phase">
            <p className="vh-corvus-price__phase-name">{phase.name}</p>
            <p className="vh-corvus-price__phase-blurb">{phase.blurb}</p>
            <ul>
              {phase.prompts.map((n) => {
                const tier = corvusPromptPayLinks[n - 1]
                return (
                  <li key={n}>
                    <span>
                      Prompt {String(n).padStart(2, '0')}
                      {n === 21 ? ' · badge' : ''}
                    </span>
                    <span>{formatUsd(tier.estimateUsd)}</span>
                    {tier.payUrl ? (
                      <a href={tier.payUrl} target="_blank" rel="noreferrer">
                        Pay
                      </a>
                    ) : (
                      <span className="vh-corvus-price__stub">link stub</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
