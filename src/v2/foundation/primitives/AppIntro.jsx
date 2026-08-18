import { useCallback, useEffect, useState } from 'react'
import { ArapalMark } from './AppIdentity'
import { colors, typography } from '../tokens'

/**
 * The Arapal entry animation.
 *
 * It existed, and it was lost. The original is still in the legacy home screen
 * (src/screens/ProjectHomeScreen.jsx, `.project-home__intro`): the mark and
 * wordmark held large and centred over a radial wash with a light sweep running
 * across the mark, ~1300ms, then an outro that faded and scaled the overlay away
 * over 720–900ms while the application settled up from translateY(24px)
 * scale(0.985) and un-blurred. That screen is a legacy route the V2 product
 * surface never reaches, so the whole surface shipped with no entry moment at
 * all — which is why it read as "regressed" rather than "removed".
 *
 * Restored at the SHELL, not on one screen, because it belongs to the
 * application, not to Project Home. Four rules govern it:
 *
 *   once per session   sessionStorage, so ordinary navigation between routes
 *                      never replays it. A reload is a new arrival and does.
 *   never blocking     the overlay is pointer-events: none from the first frame
 *                      and any pointer or key input ends it immediately. It can
 *                      delay a screenshot; it cannot delay a user.
 *   reduced motion     prefers-reduced-motion renders nothing and sets the flag,
 *                      so the app is simply there. No fade, no delay.
 *   deterministic      an ?intro=0 escape hatch, which is what the visual
 *                      standard's capture uses so a 1.1s animation cannot make
 *                      the suite non-deterministic.
 */

const INTRO_SESSION_KEY = 'arapal.v2.intro-played'
const HOLD_MS = 1100
const OUTRO_MS = 720

const introStyles = `
  @keyframes arapal-intro-sweep {
    0% { transform: translateX(-140%) rotate(10deg); opacity: 0; }
    22% { opacity: 0.85; }
    100% { transform: translateX(140%) rotate(10deg); opacity: 0; }
  }

  @keyframes arapal-intro-rise {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .arapal-intro {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.94) 0%,
      rgba(241, 245, 249, 0.72) 34%,
      rgba(241, 245, 249, 0) 74%
    );
    transition: opacity ${OUTRO_MS}ms ease, transform ${OUTRO_MS + 180}ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .arapal-intro.is-leaving {
    opacity: 0;
    transform: scale(1.04);
  }

  .arapal-intro__core {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 22px;
    animation: arapal-intro-rise 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  /* The sweep is a highlight travelling across the mark, clipped to it. */
  .arapal-intro__mark {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    border-radius: 28px;
  }

  .arapal-intro__mark::after {
    content: "";
    position: absolute;
    inset: -20%;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 34%,
      rgba(255, 255, 255, 0.72) 50%,
      rgba(255, 255, 255, 0) 66%
    );
    animation: arapal-intro-sweep 1500ms 240ms ease both;
    pointer-events: none;
  }

  /* The stage settles up behind the overlay. Only motion lives here; the
     wrapper's own layout is declared inline in AppV2 so it survives this
     stylesheet unmounting with the overlay. */
  .arapal-intro-stage {
    transition:
      opacity ${OUTRO_MS}ms ease,
      transform ${OUTRO_MS}ms ease,
      filter ${OUTRO_MS}ms ease;
  }

  .arapal-intro-stage > * {
    flex: 1 1 auto;
    min-height: 0;
  }

  .arapal-intro-stage.is-muted {
    opacity: 0;
    transform: translateY(20px) scale(0.99);
    filter: blur(8px);
  }
`

function shouldSkipIntro() {
  if (typeof window === 'undefined') return true
  if (new URLSearchParams(window.location.search).get('intro') === '0') return true
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return true
  try {
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) === '1'
  } catch {
    // A blocked storage API must not mean the animation plays on every route
    // change; treat it as already played.
    return true
  }
}

/**
 * @returns {['intro'|'outro'|'done', React.ReactNode]} the phase the stage
 *   should render itself in, and the overlay to mount beside it.
 */
export function useAppIntro() {
  const [phase, setPhase] = useState(() => (shouldSkipIntro() ? 'done' : 'intro'))

  const finish = useCallback(() => {
    setPhase((current) => (current === 'done' ? current : 'outro'))
  }, [])

  useEffect(() => {
    if (phase === 'done') {
      return undefined
    }

    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    } catch { /* storage unavailable; the session flag is a nicety, not a gate */ }

    if (phase === 'intro') {
      const hold = window.setTimeout(finish, HOLD_MS)
      // Any input ends it. The overlay never takes pointer events, so this is
      // the user reaching the product early rather than dismissing a dialog.
      window.addEventListener('pointerdown', finish, { once: true })
      window.addEventListener('keydown', finish, { once: true })
      return () => {
        window.clearTimeout(hold)
        window.removeEventListener('pointerdown', finish)
        window.removeEventListener('keydown', finish)
      }
    }

    const settle = window.setTimeout(() => setPhase('done'), OUTRO_MS)
    return () => window.clearTimeout(settle)
  }, [phase, finish])

  const overlay = phase === 'done' ? null : (
    <>
      <style>{introStyles}</style>
      <div className={`arapal-intro${phase === 'outro' ? ' is-leaving' : ''}`} aria-hidden="true">
        <div className="arapal-intro__core">
          <span className="arapal-intro__mark">
            <ArapalMark size={96} />
          </span>
          <span
            style={{
              ...typography.displayTitle,
              fontSize: '38px',
              color: colors.textStrong,
            }}
          >
            Arapal
          </span>
          <span
            style={{
              ...typography.eyebrowLabel,
              color: colors.textSoft,
            }}
          >
            Guided translation practice
          </span>
        </div>
      </div>
    </>
  )

  return [phase, overlay]
}
