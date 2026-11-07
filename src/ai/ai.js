export const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

// Bterjja3 {winner, line} aw null iza l la3be lessa mostamerre
export function getWinner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] }
    }
  }
  if (board.every(Boolean)) return { winner: 'draw', line: [] }
  return null
}

const emptyCells = (board) =>
  board.map((v, i) => (v ? null : i)).filter((i) => i !== null)

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

function findWinningMove(board, player) {
  for (const i of emptyCells(board)) {
    const copy = [...board]
    copy[i] = player
    if (getWinner(copy)?.winner === player) return i
  }
  return null
}

// Minimax ma3 alpha-beta pruning
function minimax(board, isMax, ai, human, alpha, beta, depth) {
  const r = getWinner(board)
  if (r) {
    if (r.winner === ai) return 10 - depth
    if (r.winner === human) return depth - 10
    return 0
  }
  if (isMax) {
    let best = -Infinity
    for (const i of emptyCells(board)) {
      board[i] = ai
      best = Math.max(best, minimax(board, false, ai, human, alpha, beta, depth + 1))
      board[i] = null
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  } else {
    let best = Infinity
    for (const i of emptyCells(board)) {
      board[i] = human
      best = Math.min(best, minimax(board, true, ai, human, alpha, beta, depth + 1))
      board[i] = null
      beta = Math.min(beta, best)
      if (beta <= alpha) break
    }
    return best
  }
}

function bestMove(board, ai, human) {
  const b = [...board]
  let bestScore = -Infinity
  let moves = []
  for (const i of emptyCells(b)) {
    b[i] = ai
    const score = minimax(b, false, ai, human, -Infinity, Infinity, 1)
    b[i] = null
    if (score > bestScore) {
      bestScore = score
      moves = [i]
    } else if (score === bestScore) {
      moves.push(i)
    }
  }
  return pick(moves) // random bein l a7san harakat la ykoun predictable
}

function mediumMove(board, ai, human) {
  const win = findWinningMove(board, ai)
  if (win !== null) return win
  const block = findWinningMove(board, human)
  if (block !== null) return block
  return pick(emptyCells(board))
}

export function getAIMove(board, level, ai, human) {
  switch (level) {
    case 'easy':
      return pick(emptyCells(board))
    case 'medium':
      return mediumMove(board, ai, human)
    case 'hard':
      // 25% ghalta 3an 2asd, l ba2i minimax
      return Math.random() < 0.25
        ? mediumMove(board, ai, human)
        : bestMove(board, ai, human)
    case 'extreme':
    default:
      return bestMove(board, ai, human)
  }
}