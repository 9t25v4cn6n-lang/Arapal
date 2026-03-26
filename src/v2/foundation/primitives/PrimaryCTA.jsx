import { useState } from 'react'
import { colors, motion, radius, typography } from '../tokens'

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
  minWidth = 340,
  height = 56,
  shape = 'pill',
  style = {},
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const showActiveChrome = !disabled && (isHovered || isFocused)

  return (
    <button
      type="button"
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
        background: disabled
          ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.04) 55%), linear-gradient(90deg, rgba(96, 165, 250, 0.95) 0%, rgba(59, 130, 246, 0.94) 42%, rgba(37, 99, 235, 0.92) 100%)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 55%), linear-gradient(90deg, #2D6BF0 0%, #2563EB 42%, #1D4ED8 100%)',
        color: disabled ? 'rgba(255, 255, 255, 0.9)' : '#ffffff',
        boxShadow: disabled
          ? 'inset 0 1px 0 rgba(255,255,255,0.16), 0 10px 22px rgba(37,99,235,0.12)'
          : showActiveChrome
            ? 'inset 0 1px 0 rgba(255,255,255,0.24), inset 0 -12px 18px rgba(22,78,199,0.18), 0 28px 54px rgba(37,99,235,0.24), 0 12px 28px rgba(29,78,216,0.12)'
            : 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -10px 18px rgba(22,78,199,0.16), 0 24px 52px rgba(37,99,235,0.22), 0 10px 24px rgba(29,78,216,0.1)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        filter: disabled ? 'saturate(0.82)' : showActiveChrome ? 'saturate(1.02)' : 'none',
        outline: isFocused ? '2px solid rgba(37, 99, 235, 0.35)' : 'none',
        outlineOffset: '2px',
        transition: `box-shadow ${motion.panel}, filter ${motion.micro}, transform ${motion.micro}`,
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
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 34%, rgba(255,255,255,0) 100%)',
          opacity: disabled ? 0.24 : showActiveChrome ? 0.44 : 0.38,
          transition: `opacity ${motion.panel}`,
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
          background:
            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.34) 48%, rgba(255,255,255,0) 100%)',
          opacity: disabled ? 0 : showActiveChrome ? 1 : 0,
          transform: showActiveChrome ? 'translateX(260%) skewX(-18deg)' : 'translateX(-10px) skewX(-18deg)',
          transition: `opacity ${motion.screen}, transform ${motion.screen}`,
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
          gap: 12,
          fontFamily: typography.bodyText.fontFamily,
          fontSize: 12,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        {icon}
        <span>{children}</span>
        {endIcon}
      </span>
    </button>
  )
}
