import { ChevronDown, ChevronUp } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, radius } from '../tokens'
import { ctaChrome } from './ctaChromePresets'
import PrimaryCTA from './PrimaryCTA'

const splitCtaMetrics = {
  tailWidth: 72,
  glowInset: '16px 36px -8px',
  glowOpacity: 0.72,
}

const splitCtaMotion = {
  chromeTransition: `box-shadow ${motion.panel}, filter ${motion.micro}, transform ${motion.micro}`,
  overlayTransition: `opacity ${motion.panel}`,
}

const splitCtaStyles = `
  /* The options menu opened upward from the action with no height limit, so at
     1440 it grew ~750px, covered the page title and the entire source editor,
     and still clipped off the top of the viewport. A user configuring HOW their
     source will be cut could not see the source.

     Opening it beside the action instead is right — the flow centres a ~630px
     column on a 1380px body, so there is ~375px of gutter doing nothing — but it
     cannot be done in place: the menu sits inside the column's own scroll
     container AND a clipping wrapper, which between them cut 234px off it. So it
     PORTALS to the body and is positioned from the button's measured rect, the
     same escape the fullscreen support card already uses.

     Placement prefers the gutter, falls back to above the action when there is
     none, and is clamped to the viewport in both axes. Height is capped and the
     panel scrolls inside rather than growing past the frame. */
  .split-cta__menu {
    position: fixed;
    z-index: 60;
    overflow: auto;
    overscroll-behavior: contain;
  }
`

/** Menu geometry, measured rather than assumed. */
const SPLIT_CTA_MENU_WIDTH = 320
const SPLIT_CTA_VIEWPORT_INSET = 16

function clampToViewport(value, size, viewport) {
  return Math.max(
    SPLIT_CTA_VIEWPORT_INSET,
    Math.min(value, Math.max(SPLIT_CTA_VIEWPORT_INSET, viewport - size - SPLIT_CTA_VIEWPORT_INSET)),
  )
}

/**
 * Where the menu goes, given where its button is.
 *
 * Beside the action if the gutter can hold it, otherwise above it. Never past
 * the viewport on any edge, and never taller than the room it has.
 */
function getSplitCtaMenuPosition(anchorRect) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const gap = SPLIT_CTA_VIEWPORT_INSET
  const rightGutter = vw - anchorRect.right
  const leftGutter = anchorRect.left

  let left
  if (rightGutter >= SPLIT_CTA_MENU_WIDTH + gap * 2) {
    left = anchorRect.right + gap
  } else if (leftGutter >= SPLIT_CTA_MENU_WIDTH + gap * 2) {
    left = anchorRect.left - SPLIT_CTA_MENU_WIDTH - gap
  } else {
    left = anchorRect.right - SPLIT_CTA_MENU_WIDTH
  }

  const besideFits = rightGutter >= SPLIT_CTA_MENU_WIDTH + gap * 2 || leftGutter >= SPLIT_CTA_MENU_WIDTH + gap * 2
  const maxHeight = besideFits
    ? vh - gap * 2
    : Math.max(200, anchorRect.top - gap * 2)

  const bottom = besideFits ? vh - anchorRect.bottom : vh - anchorRect.top + gap

  return {
    left: clampToViewport(left, SPLIT_CTA_MENU_WIDTH, vw),
    bottom: Math.max(gap, Math.min(bottom, vh - gap)),
    width: `${SPLIT_CTA_MENU_WIDTH}px`,
    maxHeight: `${Math.round(maxHeight)}px`,
  }
}

export default function SplitCTA({
  label,
  icon = null,
  disabled = false,
  onPrimaryClick,
  menu = null,
  minWidth = 340,
  height = 56,
  splitButtonLabel = 'Open action options',
  menuOffset = 16,
  primaryDebugItem,
  tailDebugItem,
  primaryButtonStyle = {},
  primaryContentStyle = {},
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSplitHovered, setIsSplitHovered] = useState(false)
  const [isSplitFocused, setIsSplitFocused] = useState(false)
  const clusterRef = useRef(null)
  const tailRef = useRef(null)
  const [menuPosition, setMenuPosition] = useState(null)

  // Re-measured on open and on anything that can move the button underneath it.
  const measureMenu = useCallback(() => {
    if (!tailRef.current) return
    setMenuPosition(getSplitCtaMenuPosition(tailRef.current.getBoundingClientRect()))
  }, [])

  useLayoutEffect(() => {
    if (!isMenuOpen) return undefined
    measureMenu()
    window.addEventListener('resize', measureMenu)
    window.addEventListener('scroll', measureMenu, true)
    return () => {
      window.removeEventListener('resize', measureMenu)
      window.removeEventListener('scroll', measureMenu, true)
    }
  }, [isMenuOpen, measureMenu])

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined
    }

    function handlePointerDown(event) {
      // The menu is portalled to the body, so it is no longer a DOM descendant
      // of the cluster. Without this every click INSIDE the menu counted as a
      // click outside it and closed it — the options panel would have become
      // unusable the moment it started escaping its scroll container.
      if (clusterRef.current?.contains(event.target)) {
        return
      }

      if (event.target.closest?.('.split-cta__menu')) {
        return
      }

      setIsMenuOpen(false)
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  const showActiveChrome = !disabled && (isMenuOpen || isSplitHovered || isSplitFocused)

  return (
    <div
      ref={clusterRef}
      style={{
        position: 'relative',
        display: 'inline-grid',
        // The lead track asks for `minWidth` but must be allowed to give it back.
        // At 390 the cluster resolved to 412px — a 340px lead plus a 72px tail —
        // with `width: max-content` and no ceiling, so the action ran 66px past
        // the frame and took the meta row above it along. A minimum is a
        // preference, not a promise the viewport has to keep.
        gridTemplateColumns: `minmax(0, ${minWidth}px) ${splitCtaMetrics.tailWidth}px`,
        alignItems: 'stretch',
        justifyContent: 'center',
        width: 'max-content',
        maxWidth: '100%',
        height,
        isolation: 'isolate',
        zIndex: 3,
      }}
    >
      <style>{splitCtaStyles}</style>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: splitCtaMetrics.glowInset,
          borderRadius: radius.pill,
          background: ctaChrome.splitGlow,
          filter: 'blur(16px)',
          opacity: splitCtaMetrics.glowOpacity,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      <PrimaryCTA
        icon={icon}
        disabled={disabled}
        onClick={onPrimaryClick}
        forceActiveChrome={isMenuOpen}
        minWidth={minWidth}
        height={height}
        shape="splitLead"
        style={primaryButtonStyle}
        contentStyle={primaryContentStyle}
        debugItem={primaryDebugItem}
      >
        <span>{label}</span>
      </PrimaryCTA>

      <button
        type="button"
        ref={tailRef}
        data-debug-item={tailDebugItem}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        aria-label={splitButtonLabel}
        disabled={disabled}
        onClick={() => setIsMenuOpen((current) => !current)}
        onMouseEnter={() => setIsSplitHovered(true)}
        onMouseLeave={() => setIsSplitHovered(false)}
        onFocus={() => setIsSplitFocused(true)}
        onBlur={() => setIsSplitFocused(false)}
        style={{
          position: 'relative',
          isolation: 'isolate',
          overflow: 'hidden',
          width: splitCtaMetrics.tailWidth,
          minHeight: height,
          height,
          border: 'none',
          borderLeft: ctaChrome.splitDivider,
          borderTopRightRadius: radius.pill,
          borderBottomRightRadius: radius.pill,
          background: disabled ? ctaChrome.disabledSurface : ctaChrome.tailSurface,
          color: disabled ? ctaChrome.disabledTone : ctaChrome.activeTone,
          boxShadow: disabled
            ? ctaChrome.disabledShadow
            : showActiveChrome
              ? ctaChrome.activeShadow
              : ctaChrome.idleShadow,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          filter: disabled ? 'saturate(0.68)' : showActiveChrome ? 'saturate(1.02)' : 'none',
          outline: isSplitFocused ? ctaChrome.focusOutline : 'none',
          outlineOffset: '2px',
          transition: splitCtaMotion.chromeTransition,
        }}
      >
        <span
          aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 1,
          borderRadius: 'inherit',
          background: ctaChrome.tailSheen,
          opacity: disabled ? 0.34 : showActiveChrome ? 0.42 : 0.34,
          pointerEvents: 'none',
          transition: splitCtaMotion.overlayTransition,
        }}
      />
        <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          {isMenuOpen ? <ChevronUp size={18} strokeWidth={1.9} /> : <ChevronDown size={18} strokeWidth={1.9} />}
        </span>
      </button>

      {isMenuOpen && menu && menuPosition && typeof document !== 'undefined'
        ? createPortal(
          <div className="split-cta__menu" style={menuPosition} data-debug-item="split_cta_menu">
            {menu}
          </div>,
          document.body,
        )
        : null}
    </div>
  )
}
