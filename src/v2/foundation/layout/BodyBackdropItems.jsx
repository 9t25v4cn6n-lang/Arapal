/**
 * The stage's atmosphere: two structural diagonals and one Arapal wordmark.
 *
 * It used to draw TWO wordmarks — one crossing the upper right, one the lower
 * left — at clamp(116px, 14.6vw, 216px), which at the canonical frame is a
 * 210px letterform. The same arrangement on every route, at that size, stops
 * being atmosphere: on Project Home the upper-right mark sat directly behind the
 * first-run composition, and on Source Intake the lower-left one ran under the
 * primary call to action. Identity is not supposed to be the largest object on
 * an operational screen.
 *
 * One mark, smaller, anchored to the corner furthest from where these screens
 * put their primary work, and a step fainter. The diagonals stay untouched:
 * they are 2px lines at low opacity and they read as structure, which is what
 * they are for.
 */

function wordStyle(position) {
  return {
    position: 'absolute',
    pointerEvents: 'none',
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: 'clamp(96px, 11vw, 168px)',
    lineHeight: 0.84,
    letterSpacing: '-0.08em',
    color: 'rgba(37, 99, 235, 0.035)',
    textShadow: '0 0 32px rgba(37, 99, 235, 0.025)',
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
      <div aria-hidden="true" style={wordStyle({ left: '-24px', bottom: '2%' })}>
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
