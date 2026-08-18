import { useEffect, useMemo, useState } from 'react'
import {
  LEARN_LESSONS,
  PIECE_GLYPH,
  applyMove,
  legalMoves,
  parseFen,
  randomMove,
} from '../../lib/chess'

const TIME_PRESETS = [
  { id: '1', label: '1 min', ms: 60_000 },
  { id: '3', label: '3 min', ms: 180_000 },
  { id: '5', label: '5 min', ms: 300_000 },
  { id: '10', label: '10 min', ms: 600_000 },
]

function formatClock(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

export default function ChessPage() {
  const [baseMs, setBaseMs] = useState(180_000)
  const [game, setGame] = useState(() => parseFen())
  const [selected, setSelected] = useState(null)
  const [vsAi, setVsAi] = useState(true)
  const [clocks, setClocks] = useState({ w: 180_000, b: 180_000 })
  const [ticking, setTicking] = useState(false)

  const moves = useMemo(() => legalMoves(game, selected), [game, selected])
  const destSet = useMemo(
    () => new Set(moves.map((m) => `${m.to[0]}-${m.to[1]}`)),
    [moves],
  )

  function reset(ms = baseMs) {
    setGame(parseFen())
    setSelected(null)
    setClocks({ w: ms, b: ms })
    setTicking(false)
  }

  function play(move) {
    setGame(applyMove(game, move))
    setSelected(null)
    setTicking(true)
  }

  function onSquare(r, c) {
    if (game.winner) return
    if (vsAi && game.turn === 'b') return
    const hit = moves.find((m) => m.to[0] === r && m.to[1] === c)
    if (selected && hit) {
      play(hit)
      return
    }
    const piece = game.board[r][c]
    if (piece && piece.c === game.turn) setSelected([r, c])
    else setSelected(null)
  }

  useEffect(() => {
    if (!vsAi || game.turn !== 'b' || game.winner) return
    const id = setTimeout(() => {
      const m = randomMove(game)
      if (!m) return
      setGame(applyMove(game, m))
      setSelected(null)
      setTicking(true)
    }, 380)
    return () => clearTimeout(id)
  }, [game, vsAi])

  useEffect(() => {
    if (!ticking || game.winner) return
    const id = setInterval(() => {
      setClocks((c) => {
        const key = game.turn
        const next = Math.max(0, c[key] - 250)
        if (next === 0) {
          setGame((g) => ({ ...g, winner: key === 'w' ? 'b' : 'w' }))
          setTicking(false)
        }
        return { ...c, [key]: next }
      })
    }, 250)
    return () => clearInterval(id)
  }, [ticking, game.turn, game.winner])

  const status = game.winner
    ? game.winner === 'draw'
      ? 'Draw'
      : game.winner === 'w'
        ? 'White wins'
        : 'Black wins'
    : game.turn === 'w'
      ? 'White to move'
      : 'Black to move'

  return (
    <>
      <h1>Chess</h1>
      <p className="vg__lede">
        Learn the six pieces, then play. Clocks are local only. The computer takes random legal
        captures when it can — it is a sparring partner, not a rated engine.
      </p>

      <section className="vg__section">
        <h2>Learn</h2>
        <ul className="vg__lessons">
          {LEARN_LESSONS.map((lesson) => (
            <li key={lesson.id}>
              <strong>{lesson.title}</strong>
              <span>{lesson.body}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="vg__section">
        <h2>Play</h2>
        <div className="vg-chess">
          <div className="vg-chess__tools">
            <div className="vg-clocks" aria-label="Chess timer">
              <p className={game.turn === 'b' && ticking ? 'is-live' : ''}>
                Black <time>{formatClock(clocks.b)}</time>
              </p>
              <p className={game.turn === 'w' && ticking ? 'is-live' : ''}>
                White <time>{formatClock(clocks.w)}</time>
              </p>
            </div>
            <p className="vg-status">{status}</p>
            <fieldset className="vg-fieldset">
              <legend>Timer</legend>
              {TIME_PRESETS.map((p) => (
                <label key={p.id}>
                  <input
                    type="radio"
                    name="chess-time"
                    checked={baseMs === p.ms}
                    onChange={() => {
                      setBaseMs(p.ms)
                      reset(p.ms)
                    }}
                  />
                  {p.label}
                </label>
              ))}
            </fieldset>
            <label className="vg-check">
              <input type="checkbox" checked={vsAi} onChange={(e) => setVsAi(e.target.checked)} />
              Play against the computer (Black)
            </label>
            <button type="button" className="vg-btn" onClick={() => reset()}>
              New game
            </button>
          </div>
          <div className="vg-board" role="grid" aria-label="Chessboard">
            {game.board.map((row, r) =>
              row.map((piece, c) => {
                const dark = (r + c) % 2 === 1
                const sel = selected && selected[0] === r && selected[1] === c
                const dest = destSet.has(`${r}-${c}`)
                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    role="gridcell"
                    className={`vg-sq ${dark ? 'vg-sq--dark' : 'vg-sq--light'}${sel ? ' vg-sq--sel' : ''}${dest ? ' vg-sq--move' : ''}`}
                    onClick={() => onSquare(r, c)}
                    aria-label={`${String.fromCharCode(97 + c)}${8 - r}${piece ? ` ${piece.c}${piece.t}` : ''}`}
                  >
                    {piece ? PIECE_GLYPH[piece.c][piece.t] : ''}
                  </button>
                )
              }),
            )}
          </div>
        </div>
      </section>
    </>
  )
}
