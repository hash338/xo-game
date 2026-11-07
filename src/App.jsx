import { useState, useEffect } from 'react'
import Menu from './components/Menu'
import Board from './components/Board'
import { getWinner, getAIMove } from './ai/ai'

const EMPTY = Array(9).fill(null)
const COLORS = ['#00e5ff', '#ff3d9a', '#ffd23d', '#3dff8b', '#b967ff']

function Shell({ children }) {
  return (
    <>
      <div className="bg">
        <i className="blob b1" />
        <i className="blob b2" />
        <i className="blob b3" />
        <div className="grid-floor" />
      </div>
      <main className="app">{children}</main>
    </>
  )
}

function makePieces() {
  return Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    dur: 2 + Math.random() * 2,
    color: COLORS[i % 5],
    size: 6 + Math.random() * 8,
  }))
}

function Confetti() {
  const [pieces] = useState(makePieces)
  return (
    <div className="confetti">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function App() {
  const [config, setConfig] = useState(null)
  const [board, setBoard] = useState(EMPTY)
  const [turn, setTurn] = useState('X')
  const [starter, setStarter] = useState('X')
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 })

  const result = getWinner(board)
  const over = !!result
  const ai =
    config?.mode === 'cpu' ? (config.human === 'X' ? 'O' : 'X') : null

  const play = (i) => {
    if (board[i] || over) return
    const next = [...board]
    next[i] = turn
    setBoard(next)
    setTurn(turn === 'X' ? 'O' : 'X')

    // L score byetzid hon, mara wahde lakel jawle
    const r = getWinner(next)
    if (r) setScores((s) => ({ ...s, [r.winner]: s[r.winner] + 1 }))
  }

  // Dor l computer
  useEffect(() => {
    if (!config || !ai || over || turn !== ai) return
    const t = setTimeout(() => {
      const move = getAIMove(board, config.level, ai, config.human)
      if (move !== undefined && move !== null) play(move)
    }, 600)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, board, config, over])

  const start = (cfg) => {
    setConfig(cfg)
    setBoard(EMPTY)
    setTurn('X')
    setStarter('X')
    setScores({ X: 0, O: 0, draw: 0 })
  }

  const nextRound = () => {
    const ns = starter === 'X' ? 'O' : 'X'
    setStarter(ns)
    setTurn(ns)
    setBoard(EMPTY)
  }

  const backToMenu = () => setConfig(null)

  if (!config) {
    return (
      <Shell>
        <Menu onStart={start} />
      </Shell>
    )
  }

  let status
  if (result) {
    if (result.winner === 'draw') status = "It's a draw 🤝"
    else if (ai) status = result.winner === ai ? 'CPU wins 🤖' : 'You win 🎉'
    else status = `${result.winner} wins 🎉`
  } else if (ai) {
    status = turn === ai ? 'CPU is thinking…' : 'Your turn'
  } else {
    status = `${turn}'s turn`
  }

  const humanWon =
    result && result.winner !== 'draw' && (!ai || result.winner !== ai)

  return (
    <Shell>
      {humanWon && <Confetti />}
      <div className="card game">
        <div className="topbar">
          <button className="ghost" onClick={backToMenu}>← Menu</button>
          {ai && <span className={`badge ${config.level}`}>{config.level}</span>}
        </div>

        <div className="scoreboard">
          <div className={`score x ${!over && turn === 'X' ? 'on' : ''}`}>
            <b>X</b>
            <span>{scores.X}</span>
            <small>{ai ? (ai === 'X' ? 'CPU' : 'YOU') : 'P1'}</small>
          </div>
          <div className="score d">
            <b>=</b>
            <span>{scores.draw}</span>
            <small>DRAW</small>
          </div>
          <div className={`score o ${!over && turn === 'O' ? 'on' : ''}`}>
            <b>O</b>
            <span>{scores.O}</span>
            <small>{ai ? (ai === 'O' ? 'CPU' : 'YOU') : 'P2'}</small>
          </div>
        </div>

        <p className={`status ${over ? 'over' : ''}`}>{status}</p>

        <Board
          board={board}
          onPlay={play}
          winLine={result?.line ?? []}
          disabled={over || (ai && turn === ai)}
          turn={turn}
        />

        <button className="start small" onClick={nextRound} disabled={!over}>
          {over ? 'NEXT ROUND ▶' : 'Playing…'}
        </button>
      </div>
    </Shell>
  )
}