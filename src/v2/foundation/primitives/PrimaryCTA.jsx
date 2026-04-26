import { useState } from 'react'
import { motion, radius, spacing, typography } from '../tokens'
import { ctaChrome } from './ctaChromePresets'

const primaryCtaMetrics = {
  horizontalPadding: `0 ${spacing[24]}`,
  contentGap: spacing[12],
  strongLabelWeight: 700,
}

const primaryCtaMotion = {
  chromeTransition: `box-shadow ${motion.panel}, filter ${motion.micro}, transform ${motion.micro}`,
  overlayTransition: `opacity ${motion.panel}`,
  sweepTransition: `opacity ${motion.screen}, transform ${motion.screen}`,
}

function getShapeRadii(shape) {
  if (shape === 'splitLead') {
    return {
      borderTopLeftRadius: radius.pill,
      borderBottomLeftRadius: radius.pill,
      borderTopRightRadius: radius[24],
      borderBottomRightRadius: radius[24],
    }
  }

  return {
    borderRadius: radius.pill,
  }
}

export default function PrimaryCTA({
  children,
  icon = null,
  endIcon = null,
  onClick,
  disabled = false,
  forceActiveChrome = false,
  minWidth = 340,
  height = 56,
  shape = 'pill',
  style = {},
  contentStyle = {},
  debugItem,
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const showActiveChrome = !disabled && (forceActiveChrome || isHovered || isFocused)

  return (
    <button
      type="button"
      data-debug-item={debugItem}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        minWidth,
        minHeight: height,
        height,
        border: 'none',
        background: disabled ? ctaChrome.disabledSurface : ctaChrome.leadSurface,
        color: disabled ? ctaChrome.disabledTone : ctaChrome.activeTone,
        boxShadow: disabled
          ? ctaChrome.disabledShadow
          : showActiveChrome
            ? ctaChrome.activeShadow
            : ctaChrome.idleShadow,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: primaryCtaMetrics.horizontalPadding,
        cursor: disabled ? 'not-allowed' : 'pointer',
        filter: disabled ? 'saturate(0.68)' : showActiveChrome ? 'saturate(1.02)' : 'none',
        outline: isFocused ? ctaChrome.focusOutline : 'none',
        outlineOffset: '2px',
        transition: primaryCtaMotion.chromeTransition,
        ...getShapeRadii(shape),
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 1,
          borderRadius: 'inherit',
          background: ctaChrome.leadSheen,
          opacity: disabled ? 0.34 : showActiveChrome ? 0.44 : 0.38,
          transition: primaryCtaMotion.overlayTransition,
          pointerEvents: 'none',
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-18%',
          bottom: '-18%',
          left: '-26%',
          width: '30%',
          background: ctaChrome.sweep,
          opacity: disabled ? 0 : showActiveChrome ? 1 : 0,
          transform: showActiveChrome ? 'translateX(260%) skewX(-18deg)' : 'translateX(-10px) skewX(-18deg)',
          transition: primaryCtaMotion.sweepTransition,
          pointerEvents: 'none',
        }}
      />
      <span
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: primaryCtaMetrics.contentGap,
          fontFamily: typography.ctaLabel.fontFamily,
          fontSize: typography.ctaLabel.fontSize,
          fontWeight: primaryCtaMetrics.strongLabelWeight,
          lineHeight: typography.ctaLabel.lineHeight,
          letterSpacing: typography.ctaLabel.letterSpacing,
          textTransform: typography.ctaLabel.textTransform,
          ...contentStyle,
        }}
      >
        {icon}
        <span>{children}</span>
        {endIcon}
      </span>
    </button>
  )
}
