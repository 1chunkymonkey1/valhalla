import { useState } from 'react'
import {
  POKER_LESSONS,
  POKER_RANKS,
  cardLabel,
  cardRed,
  compareHands,
  evaluateHand,
  makeDeck,
  shuffle,
} from '../../lib/poker'

const STREETS = ['hole', 'flop', 'turn', 'river', 'show']

function dealHand() {
  const deck = shuffle(makeDeck())
  return {
    hero: [deck[0], deck[1]],
    vill: [deck[2], deck[3]],
    board: [deck[4], deck[5], deck[6], deck[7], deck[8]],
  }
}

function Card({ code, hidden }) {
  if (hidden) return <span className="vg-card vg-card--back" aria-label="Facedown card" />
  return (
    <span className={`vg-card ${cardRed(code) ? 'vg-card--red' : ''}`} aria-label={cardLabel(code)}>
      {cardLabel(code)}
    </span>
  )
}

export default function PokerPage() {
  const [hand, setHand] = useState(null)
  const [street, setStreet] = useState('idle')

  function start() {
    setHand(dealHand())
    setStreet('hole')
  }

  function nextStreet() {
    const i = STREETS.indexOf(street)
    if (i < STREETS.length - 1) setStreet(STREETS[i + 1])
  }

  const boardCount = street === 'hole' || street === 'idle' ? 0 : street === 'flop' ? 3 : street === 'turn' ? 4 : 5
  const showing = street === 'show'
  let result = null
  if (hand && showing) {
    const heroCards = [...hand.hero, ...hand.board]
    const villCards = [...hand.vill, ...hand.board]
    const cmp = compareHands(heroCards, villCards)
    result = {
      hero: evaluateHand(heroCards),
      vill: evaluateHand(villCards),
      cmp,
    }
  }

  return (
    <>
      <h1>Poker</h1>
      <p className="vg__lede">
        Texas Hold’em trainer. Practice only — no money, no rake, no accounts. You always go to
        showdown so the ranking is visible.
      </p>

      <section className="vg__section">
        <h2>Learn</h2>
        <ul className="vg__lessons">
          {POKER_LESSONS.map((lesson) => (
            <li key={lesson.id}>
              <strong>{lesson.title}</strong>
              <span>{lesson.body}</span>
            </li>
          ))}
        </ul>
        <ol className="vg-ranks">
          {POKER_RANKS.map((r) => (
            <li key={r.rank}>{r.name}</li>
          ))}
        </ol>
      </section>

      <section className="vg__section">
        <h2>Practice</h2>
        {!hand ? (
          <button type="button" className="vg-btn" onClick={start}>
            Deal a hand
          </button>
        ) : (
          <div className="vg-poker">
            <div className="vg-poker__row">
              <p>Opponent</p>
              <div className="vg-hand">
                {hand.vill.map((c) => (
                  <Card key={c} code={c} hidden={!showing} />
                ))}
              </div>
              {result ? <span className="vg-hand-name">{result.vill.name}</span> : null}
            </div>
            <div className="vg-poker__row">
              <p>Board</p>
              <div className="vg-hand">
                {hand.board.slice(0, boardCount).map((c) => (
                  <Card key={c} code={c} />
                ))}
              </div>
            </div>
            <div className="vg-poker__row">
              <p>You</p>
              <div className="vg-hand">
                {hand.hero.map((c) => (
                  <Card key={c} code={c} />
                ))}
              </div>
              {result ? <span className="vg-hand-name">{result.hero.name}</span> : null}
            </div>
            {result ? (
              <p className="vg-status">
                {result.cmp > 0 ? 'You win the showdown.' : result.cmp < 0 ? 'Opponent wins the showdown.' : 'Split pot.'}
              </p>
            ) : (
              <p className="vg-status">Street: {street}</p>
            )}
            <div className="vg-poker__actions">
              {street !== 'show' ? (
                <button type="button" className="vg-btn" onClick={nextStreet}>
                  {street === 'hole' ? 'Flop' : street === 'flop' ? 'Turn' : street === 'turn' ? 'River' : 'Showdown'}
                </button>
              ) : null}
              <button type="button" className="vg-btn vg-btn--ghost" onClick={start}>
                New hand
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
