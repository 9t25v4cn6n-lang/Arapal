import { useState } from 'react'
import { colors, motion, radius, spacing, typography } from '../tokens'
import { getIdentityBadgeStyle, identityBadgeChrome } from './identityBadgePresets'

/**
 * The Arapal mark: an arch over a stem over a dot, inside a soft blue badge.
 *
 * Drawn here once. It previously existed twice — as `NavigationRailBrandMark`
 * inside the rail and again as `.project-home__identityMark` in the legacy home
 * screen — with two sets of geometry constants that had already drifted apart
 * (14x7 arch here, 18x9 there). A product's identity is the one thing in a
 * design system that may not have two definitions.
 */
export function ArapalMark({ size = 32 }) {
  // Every part is a fraction of the badge, so the mark is one drawing at any
  // size rather than a new set of numbers per placement.
  const u = size / 36

  return (
    <span
      aria-hidden="true"
      style={{
        ...getIdentityBadgeStyle({
          size: `${size}px`,
          radiusValue: `${Math.round(12 * u)}px`,
          shadowValue: identityBadgeChrome.railSurfaceShadow,
        }),
        position: 'relative',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 6 * u,
          left: '50%',
          width: 14 * u,
          height: 7 * u,
          border: `${Math.max(1.5, 2 * u)}px solid currentColor`,
          borderBottom: 'none',
          borderRadius: '999px 999px 0 0',
          transform: 'translateX(-50%)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: 9 * u,
          left: '50%',
          width: Math.max(1.5, 2 * u),
          height: 13 * u,
          background: 'currentColor',
          borderRadius: radius.pill,
          transform: 'translateX(-50%)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          bottom: 6 * u,
          left: '50%',
          width: 5 * u,
          height: 5 * u,
          borderRadius: radius.pill,
          background: 'currentColor',
          transform: 'translateX(-50%)',
          boxShadow: identityBadgeChrome.railDotShadow,
        }}
      />
    </span>
  )
}

const appIdentityStyles = `
  /* Below the mobile breakpoint the header lane has to hold the identity, a
     back control and a three-step indicator in 390px. The mark alone still says
     whose product this is; the wordmark is the part that can go. Declared in a
     stylesheet rather than inline because an inline style beats a media query —
     the same trap the Source Intake brand label documents. */
  @media (max-width: 560px) {
    .app-identity__wordmark { display: none; }
  }
`

/**
 * Application identity, in the far-left of the application header.
 *
 * It used to sit at the top of the navigation rail, which conflated two
 * different things: what this product IS, and where you can go inside it. The
 * rail is a set of destinations; the identity is not one of them, and putting it
 * at the top of the list made it read like the first item. Moved to the header's
 * start lane, the header owns identity and the rail begins beneath it — the same
 * relationship every mature application shell uses.
 *
 * It is a control, not a graphic: it returns to Project Home, which is what a
 * user expects a product's logo to do and what the shell previously offered no
 * way to do from inside a workflow.
 */
export default function AppIdentity({ onClick, wordmark = 'Arapal' }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const raised = isHovered || isFocused

  return (
    <>
      <style>{appIdentityStyles}</style>
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      aria-label="Arapal — go to Project Home"
      data-debug-item="app_identity"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[12],
        // The product's name does not shrink. As a shrinkable flex item the
        // button's BOX narrowed while the nowrap wordmark inside it did not, so
        // at 1100px the text painted 25px outside its own bounds and sat on top
        // of the screen's Back pill. The deliberate degradation for narrow
        // frames is the media query below, which drops the wordmark entirely —
        // not a silently overflowing one.
        flex: '0 0 auto',
        minWidth: 0,
        // The identity is chrome that happens to be clickable, not a button that
        // happens to be the logo, so it carries no surface of its own.
        padding: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: raised ? colors.accentStrong : colors.accentBase,
        transition: `color ${motion.micro}`,
      }}
    >
      <ArapalMark size={32} />
      <span
        className="app-identity__wordmark"
        style={{
          ...typography.productIdentity,
          color: colors.textStrong,
          whiteSpace: 'nowrap',
          // Belt and braces: nowrap text can never paint outside its own box,
          // whatever a future layout does to the button around it.
          overflow: 'hidden',
        }}
      >
        {wordmark}
      </span>
    </button>
    </>
  )
}
