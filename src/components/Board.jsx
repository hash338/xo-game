function Mark({ type }) {
  return type === 'X' ? (
    <svg viewBox="0 0 100 100" className="mark x">
      <line x1="22" y1="22" x2="78" y2="78" />
      <line x1="78" y1="22" x2="22" y2="78" />
    </svg>
  ) : (
    <svg viewBox="0 0 100 100" className="mark o">
      <circle cx="50" cy="50" r="30" />
    </svg>
  )
}

export default function Board({ board, onPlay, winLine, disabled, turn }) {
  return (
    <div className="board">
      {board.map((cell, i) => (
        <button
          key={i}
          className={`cell ${winLine.includes(i) ? 'win' : ''} ${
            !cell && !disabled ? `hint-${turn}` : ''
          }`}
          onClick={() => onPlay(i)}
          disabled={disabled || !!cell}
          aria-label={`cell ${i + 1}`}
        >
          {cell && <Mark type={cell} />}
        </button>
      ))}
    </div>
  )
}