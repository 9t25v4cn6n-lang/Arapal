/**
 * Shared V2 body atmosphere.
 *
 * `BodyBackdropItems` preserves the current single-wordmark default used by the
 * rest of V2. `DualWordmarkBodyBackdropItems` reuses the same atmosphere and
 * line system but opts into a second, safely inset wordmark. Screens select the
 * variant explicitly through their layout contract; no route-specific CSS is
 * required in the screen itself.
 */

const defaultWordmarkStyle = {
  position: 'absolute',
  pointerEvents: 'none',
  fontFamily: '"Playfair Display", Georgia, serif',
  fontSize: 'clamp(96px, 11vw, 168px)',
  lineHeight: 0.84,
  letterSpacing: '-0.08em',
  color: 'rgba(37, 99, 235, 0.035)',
  textShadow: '0 0 32px rgba(37, 99, 235, 0.025)',
  whiteSpace: 'nowrap',
}

const dualWordmarkStyle = {
  ...defaultWordmarkStyle,
  fontSize: 'clamp(88px, 9.5vw, 148px)',
  lineHeight: 0.9,
  color: 'rgba(37, 99, 235, 0.032)',
  textShadow: '0 0 32px rgba(37, 99, 235, 0.022)',
}

function wordStyle(position, variant = 'default') {
  return {
    ...(variant === 'dual' ? dualWordmarkStyle : defaultWordmarkStyle),
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

function StructuralLines() {
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
    </>
  )
}

function SharedAtmosphere() {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 42%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 54%)',
          opacity: 0.8,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.22)',
          opacity: 0.5,
        }}
      />
    </>
  )
}

function BackdropComposition({ dualWordmark = false }) {
  return (
    <>
      <StructuralLines />
      {dualWordmark ? (
        <>
          <div aria-hidden="true" style={wordStyle({ left: '2%', bottom: '3%' }, 'dual')}>Arapal</div>
          <div aria-hidden="true" style={wordStyle({ right: '2%', top: '4%', textAlign: 'right' }, 'dual')}>Arapal</div>
        </>
      ) : (
        <div aria-hidden="true" style={wordStyle({ left: '-24px', bottom: '2%' })}>Arapal</div>
      )}
      <SharedAtmosphere />
    </>
  )
}

export default function BodyBackdropItems() {
  return <BackdropComposition />
}

export function DualWordmarkBodyBackdropItems() {
  return <BackdropComposition dualWordmark />
}
