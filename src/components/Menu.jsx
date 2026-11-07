import { useState } from 'react'

const LEVELS = [
  { id: 'easy', label: 'Easy', icon: '🌱', color: '#3dff8b', desc: 'Random moves' },
  { id: 'medium', label: 'Medium', icon: '⚡', color: '#ffd23d', desc: 'Wins & blocks' },
  { id: 'hard', label: 'Hard', icon: '🔥', color: '#ff8a3d', desc: 'Smart, not perfect' },
  { id: 'extreme', label: 'Extreme', icon: '💀', color: '#ff2e63', desc: 'Unbeatable' },
]

export default function Menu({ onStart }) {
  const [mode, setMode] = useState('cpu')
  const [level, setLevel] = useState('medium')
  const [human, setHuman] = useState('X')

  return (
    <div className="card menu">
      <h1 className="logo">
        <span className="lx">X</span>
        <span className="lo">O</span> ARENA
      </h1>
      <p className="tagline">Pick your battle</p>

      <div className="row two">
        <button
          className={`pill ${mode === 'cpu' ? 'active' : ''}`}
          onClick={() => setMode('cpu')}
        >
          🤖 Vs Computer
        </button>
        <button
          className={`pill ${mode === 'pvp' ? 'active' : ''}`}
          onClick={() => setMode('pvp')}
        >
          👥 2 Players
        </button>
      </div>

      {mode === 'cpu' && (
        <>
          <h3 className="label">Difficulty</h3>
          <div className="levels">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                className={`level ${level === l.id ? 'active' : ''}`}
                style={{ '--c': l.color }}
                onClick={() => setLevel(l.id)}
              >
                <span className="icon">{l.icon}</span>
                <strong>{l.label}</strong>
                <small>{l.desc}</small>
              </button>
            ))}
          </div>

          <h3 className="label">You play as</h3>
          <div className="row two">
            <button
              className={`pill sym x ${human === 'X' ? 'active' : ''}`}
              onClick={() => setHuman('X')}
            >
              X
            </button>
            <button
              className={`pill sym o ${human === 'O' ? 'active' : ''}`}
              onClick={() => setHuman('O')}
            >
              O
            </button>
          </div>
        </>
      )}

      <button className="start" onClick={() => onStart({ mode, level, human })}>
        START GAME
      </button>
      <footer className="credit">
        Made By: <span>Hasan Younes</span>
      </footer>
    </div>
  )
}