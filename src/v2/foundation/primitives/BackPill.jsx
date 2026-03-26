import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { colors, motion, radius, spacing, typography } from '../tokens'

export default function BackPill({ onClick, children = 'Back', icon = <ArrowLeft size={16} strokeWidth={1.9} />, style = {} }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const showActiveChrome = isHovered || isFocused

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        border: `1px solid ${colors.lineSoft}`,
        borderRadius: radius.pill,
        background: showActiveChrome
          ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 55%), linear-gradient(90deg, #2D6BF0 0%, #2563EB 42%, #1D4ED8 100%)'
          : 'rgba(255, 255, 255, 0.92)',
        color: showActiveChrome ? '#ffffff' : colors.textSoft,
        minHeight: '42px',
        padding: '0 22px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[8],
        cursor: 'pointer',
        fontFamily: typography.bodyText.fontFamily,
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        boxShadow: showActiveChrome
          ? 'inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -10px 18px rgba(22,78,199,0.16), 0 18px 34px rgba(37,99,235,0.18), 0 8px 18px rgba(29,78,216,0.08)'
          : '0 1px 0 rgba(255, 255, 255, 0.6) inset',
        outline: isFocused ? '2px solid rgba(37, 99, 235, 0.32)' : 'none',
        outlineOffset: '2px',
        transition: `background ${motion.panel}, border-color ${motion.micro}, box-shadow ${motion.panel}, color ${motion.micro}, transform ${motion.micro}`,
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
          opacity: showActiveChrome ? 0.42 : 0,
          transition: `opacity ${motion.panel}`,
          pointerEvents: 'none',
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-24%',
          bottom: '-24%',
          left: '-30%',
          width: '32%',
          background:
            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.34) 48%, rgba(255,255,255,0) 100%)',
          opacity: showActiveChrome ? 1 : 0,
          transform: showActiveChrome ? 'translateX(250%) skewX(-18deg)' : 'translateX(-12px) skewX(-18deg)',
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
          gap: spacing[8],
        }}
      >
        {icon}
        {children}
      </span>
    </button>
  )
}
