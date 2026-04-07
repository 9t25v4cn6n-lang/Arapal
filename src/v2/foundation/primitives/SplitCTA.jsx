import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined
    }

    function handlePointerDown(event) {
      if (clusterRef.current?.contains(event.target)) {
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
        gridTemplateColumns: `minmax(${minWidth}px, auto) ${splitCtaMetrics.tailWidth}px`,
        alignItems: 'stretch',
        justifyContent: 'center',
        width: 'max-content',
        height,
        isolation: 'isolate',
        zIndex: 3,
      }}
    >
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

      {isMenuOpen && menu ? (
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: `calc(100% + ${menuOffset}px)`,
            zIndex: 20,
          }}
        >
          {menu}
        </div>
      ) : null}
    </div>
  )
}
