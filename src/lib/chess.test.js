import assert from 'node:assert/strict'
import test from 'node:test'
import { applyMove, legalMoves, parseFen } from './chess.js'

test('white knight on b1 jumps to a3 and c3', () => {
  const game = parseFen()
  const moves = legalMoves(game, [7, 1])
  const dests = moves.map((m) => m.to.join(','))
  assert.ok(dests.includes('5,0'))
  assert.ok(dests.includes('5,2'))
})

test('white pawn on e2 can step to e3 or e4', () => {
  const game = parseFen()
  const moves = legalMoves(game, [6, 4])
  const dests = moves.map((m) => m.to.join(','))
  assert.ok(dests.includes('5,4'))
  assert.ok(dests.includes('4,4'))
})

test('e2-e4 is legal and flips the turn', () => {
  const game = parseFen()
  const move = legalMoves(game, [6, 4]).find((m) => m.to[0] === 4 && m.to[1] === 4)
  const next = applyMove(game, move)
  assert.equal(next.turn, 'b')
  assert.equal(next.board[4][4].t, 'p')
  assert.equal(next.board[6][4], null)
})
