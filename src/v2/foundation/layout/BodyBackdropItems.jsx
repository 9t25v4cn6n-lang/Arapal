import { colors } from '../tokens'

function wordStyle(position) {
  return {
    position: 'absolute',
    pointerEvents: 'none',
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: 'clamp(116px, 14.6vw, 216px)',
    lineHeight: 0.84,
    letterSpacing: '-0.08em',
    color: 'rgba(37, 99, 235, 0.04)',
    textShadow: '0 0 32px rgba(37, 99, 235, 0.03)',
    ...position,
  }
}

function lineStyle(position, gradient, rotation) {
  return {
    position: 'absolute',
    pointerEvents: 'none',
    width: '2px',
    opacity: 0.96,
    transformOrigin: 'top center',
    background: gradient,
    transform: `rotate(${rotation})`,
    ...position,
  }
}

export default function BodyBackdropItems() {
  return (
    <>
      <div
        aria-hidden="true"
        style={lineStyle(
          { top: '-3%', left: '9.6%', height: '124%' },
          'linear-gradient(180deg, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.18) 16%, rgba(37, 99, 235, 0.32) 50%, rgba(37, 99, 235, 0.1) 84%, rgba(37, 99, 235, 0) 100%)',
          '-18deg',
        )}
      />
      <div
        aria-hidden="true"
        style={lineStyle(
          { top: '-4%', right: '7.4%', height: '126%' },
          'linear-gradient(180deg, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.16) 16%, rgba(37, 99, 235, 0.34) 50%, rgba(37, 99, 235, 0.1) 84%, rgba(37, 99, 235, 0) 100%)',
          '17deg',
        )}
      />
      <div aria-hidden="true" style={wordStyle({ left: '-28px', bottom: '3%' })}>
        Arapal
      </div>
      <div aria-hidden="true" style={wordStyle({ right: '-18px', top: '7%', color: `rgba(37, 99, 235, 0.05)` })}>
        Arapal
      </div>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 50% 42%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 54%)',
          opacity: 0.8,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          border: `1px solid rgba(255, 255, 255, 0.12)`,
          boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.22)`,
          opacity: 0.5,
        }}
      />
    </>
  )
}
