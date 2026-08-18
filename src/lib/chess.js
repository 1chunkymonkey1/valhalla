/** Minimal chess rules: legal moves, check, castling, en passant, queen promotion. */

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

const DIRS = {
  n: [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ],
  b: [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ],
  r: [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ],
  q: [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ],
  k: [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ],
}

export function parseFen(fen = START_FEN) {
  const [place, turn, castle, ep] = fen.split(' ')
  const board = Array.from({ length: 8 }, () => Array(8).fill(null))
  place.split('/').forEach((row, r) => {
    let c = 0
    for (const ch of row) {
      if (/\d/.test(ch)) c += Number(ch)
      else {
        const t = ch.toLowerCase()
        board[r][c] = { t, c: ch === t ? 'b' : 'w' }
        c += 1
      }
    }
  })
  return {
    board,
    turn: turn || 'w',
    castle: {
      wK: castle?.includes('K'),
      wQ: castle?.includes('Q'),
      bK: castle?.includes('k'),
      bQ: castle?.includes('q'),
    },
    ep: ep && ep !== '-' ? algebraicToRc(ep) : null,
    winner: null,
  }
}

export function cloneGame(g) {
  return {
    board: g.board.map((row) => row.map((p) => (p ? { ...p } : null))),
    turn: g.turn,
    castle: { ...g.castle },
    ep: g.ep ? [...g.ep] : null,
    winner: g.winner,
  }
}

export function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8
}

export function findKing(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (p?.t === 'k' && p.c === color) return [r, c]
    }
  }
  return null
}

function squareAttacked(board, r, c, byColor) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const p = board[i][j]
      if (!p || p.c !== byColor) continue
      if (attacksFrom(board, i, j, p).some(([rr, cc]) => rr === r && cc === c)) return true
    }
  }
  return false
}

function attacksFrom(board, r, c, p) {
  const hits = []
  if (p.t === 'n') {
    for (const [dr, dc] of DIRS.n) {
      const rr = r + dr
      const cc = c + dc
      if (inBounds(rr, cc)) hits.push([rr, cc])
    }
    return hits
  }
  if (p.t === 'k') {
    for (const [dr, dc] of DIRS.k) {
      const rr = r + dr
      const cc = c + dc
      if (inBounds(rr, cc)) hits.push([rr, cc])
    }
    return hits
  }
  if (p.t === 'p') {
    const dir = p.c === 'w' ? -1 : 1
    for (const dc of [-1, 1]) {
      const rr = r + dir
      const cc = c + dc
      if (inBounds(rr, cc)) hits.push([rr, cc])
    }
    return hits
  }
  const rays = p.t === 'b' ? DIRS.b : p.t === 'r' ? DIRS.r : DIRS.q
  for (const [dr, dc] of rays) {
    let rr = r + dr
    let cc = c + dc
    while (inBounds(rr, cc)) {
      hits.push([rr, cc])
      if (board[rr][cc]) break
      rr += dr
      cc += dc
    }
  }
  return hits
}

export function inCheck(board, color) {
  const k = findKing(board, color)
  if (!k) return false
  return squareAttacked(board, k[0], k[1], color === 'w' ? 'b' : 'w')
}

function rawMoves(game, r, c) {
  const p = game.board[r][c]
  if (!p) return []
  const out = []
  const enemy = p.c === 'w' ? 'b' : 'w'

  if (p.t === 'n' || p.t === 'k') {
    for (const [dr, dc] of DIRS[p.t]) {
      const rr = r + dr
      const cc = c + dc
      if (!inBounds(rr, cc)) continue
      const t = game.board[rr][cc]
      if (!t || t.c === enemy) out.push({ from: [r, c], to: [rr, cc] })
    }
  } else if (p.t === 'p') {
    const dir = p.c === 'w' ? -1 : 1
    const start = p.c === 'w' ? 6 : 1
    const one = [r + dir, c]
    if (inBounds(...one) && !game.board[one[0]][one[1]]) {
      out.push({ from: [r, c], to: one })
      const two = [r + dir * 2, c]
      if (r === start && !game.board[two[0]][two[1]]) out.push({ from: [r, c], to: two })
    }
    for (const dc of [-1, 1]) {
      const rr = r + dir
      const cc = c + dc
      if (!inBounds(rr, cc)) continue
      const t = game.board[rr][cc]
      if (t?.c === enemy) out.push({ from: [r, c], to: [rr, cc] })
      if (game.ep && game.ep[0] === rr && game.ep[1] === cc) {
        out.push({ from: [r, c], to: [rr, cc], ep: true })
      }
    }
  } else {
    const rays = p.t === 'b' ? DIRS.b : p.t === 'r' ? DIRS.r : DIRS.q
    for (const [dr, dc] of rays) {
      let rr = r + dr
      let cc = c + dc
      while (inBounds(rr, cc)) {
        const t = game.board[rr][cc]
        if (!t) out.push({ from: [r, c], to: [rr, cc] })
        else {
          if (t.c === enemy) out.push({ from: [r, c], to: [rr, cc] })
          break
        }
        rr += dr
        cc += dc
      }
    }
  }

  if (p.t === 'k') {
    const home = p.c === 'w' ? 7 : 0
    if (r === home && c === 4 && !inCheck(game.board, p.c)) {
      if (game.castle[`${p.c}K`] && !game.board[home][5] && !game.board[home][6]) {
        if (!squareAttacked(game.board, home, 5, enemy) && !squareAttacked(game.board, home, 6, enemy)) {
          out.push({ from: [r, c], to: [home, 6], castle: 'K' })
        }
      }
      if (game.castle[`${p.c}Q`] && !game.board[home][1] && !game.board[home][2] && !game.board[home][3]) {
        if (!squareAttacked(game.board, home, 3, enemy) && !squareAttacked(game.board, home, 2, enemy)) {
          out.push({ from: [r, c], to: [home, 2], castle: 'Q' })
        }
      }
    }
  }
  return out
}

export function legalMoves(game, from = null) {
  const moves = []
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = game.board[r][c]
      if (!p || p.c !== game.turn) continue
      if (from && (from[0] !== r || from[1] !== c)) continue
      for (const m of rawMoves(game, r, c)) {
        const next = applyMove(game, m, true)
        if (!inCheck(next.board, game.turn)) moves.push(m)
      }
    }
  }
  return moves
}

export function applyMove(game, move, trial = false) {
  const next = cloneGame(game)
  const [fr, fc] = move.from
  const [tr, tc] = move.to
  const piece = next.board[fr][fc]
  next.board[fr][fc] = null
  if (move.ep) {
    const capR = piece.c === 'w' ? tr + 1 : tr - 1
    next.board[capR][tc] = null
  }
  if (move.castle === 'K') next.board[tr][5] = next.board[tr][7]
  if (move.castle === 'K') next.board[tr][7] = null
  if (move.castle === 'Q') next.board[tr][3] = next.board[tr][0]
  if (move.castle === 'Q') next.board[tr][0] = null
  let placed = piece
  if (piece.t === 'p' && (tr === 0 || tr === 7)) placed = { t: 'q', c: piece.c }
  next.board[tr][tc] = placed
  next.ep = null
  if (piece.t === 'p' && Math.abs(tr - fr) === 2) next.ep = [(fr + tr) / 2, fc]
  if (piece.t === 'k') {
    next.castle[`${piece.c}K`] = false
    next.castle[`${piece.c}Q`] = false
  }
  if (piece.t === 'r' && fc === 0) next.castle[`${piece.c}Q`] = false
  if (piece.t === 'r' && fc === 7) next.castle[`${piece.c}K`] = false
  if (!trial) {
    next.turn = game.turn === 'w' ? 'b' : 'w'
    const replies = legalMoves({ ...next, turn: next.turn })
    if (replies.length === 0) {
      next.winner = inCheck(next.board, next.turn) ? game.turn : 'draw'
    }
  }
  return next
}

export function randomMove(game) {
  const moves = legalMoves(game)
  if (!moves.length) return null
  const captures = moves.filter((m) => game.board[m.to[0]][m.to[1]])
  const pool = captures.length ? captures : moves
  return pool[Math.floor(Math.random() * pool.length)]
}

export function algebraicToRc(sq) {
  const c = sq.charCodeAt(0) - 97
  const r = 8 - Number(sq[1])
  return [r, c]
}

export const PIECE_GLYPH = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
}

export const LEARN_LESSONS = [
  {
    id: 'pawn',
    title: 'Pawn',
    body: 'Moves one square forward (two from its starting rank). Captures one square diagonally. Promotes on the last rank.',
  },
  {
    id: 'knight',
    title: 'Knight',
    body: 'Jumps in an L: two squares one way and one perpendicular. The only piece that leaps over others.',
  },
  {
    id: 'bishop',
    title: 'Bishop',
    body: 'Slides any number of squares diagonally. Stays on one color for the whole game.',
  },
  {
    id: 'rook',
    title: 'Rook',
    body: 'Slides any number of squares horizontally or vertically. Castles with the king.',
  },
  {
    id: 'queen',
    title: 'Queen',
    body: 'Combines rook and bishop. The most mobile piece.',
  },
  {
    id: 'king',
    title: 'King',
    body: 'Moves one square any direction. Cannot move into check. Castling: king two squares toward a rook if the path is clear and unattacked.',
  },
]
