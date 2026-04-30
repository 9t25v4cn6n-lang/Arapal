import { cloneElement, isValidElement, useState } from 'react'
import { colors, controlSizing, motion, radius } from '../tokens'

const sizeMap = {
  sm: controlSizing.utilitySm.hitAreaPx,
  md: controlSizing.utilityMd.hitAreaPx,
  'utility-sm': controlSizing.utilitySm.hitAreaPx,
  'utility-md': controlSizing.utilityMd.hitAreaPx,
}

function resolveSize(size) {
  if (typeof size === 'number') {
    return size
  }

  return sizeMap[size] ?? sizeMap.md
}

export default function IconActionButton({
  icon,
  label,
  title,
  active = false,
  size = 'md',
  onClick,
  style,
  ...buttonProps
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const resolvedSize = resolveSize(size)
  const isHighlighted = active || isHovered
  const showTooltip = title && (isHovered || isFocused)
  const iconSize =
    resolvedSize === controlSizing.utilitySm.hitAreaPx
      ? controlSizing.utilitySm.iconPx
      : resolvedSize === controlSizing.utilityMd.hitAreaPx
        ? controlSizing.utilityMd.iconPx
        : Math.max(14, resolvedSize - 12)

  return (
    <button
      type="button"
      aria-label={label}
      title={title ?? label}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        position: 'relative',
        width: `${resolvedSize}px`,
        height: `${resolvedSize}px`,
        border: `1px solid ${isHighlighted ? colors.accentMist : 'transparent'}`,
        borderRadius: radius[12],
        background: isHighlighted ? colors.accentWash : 'transparent',
        color: isHighlighted ? colors.accentStrong : colors.textFaint,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: [
          `background-color ${motion.micro}`,
          `border-color ${motion.micro}`,
          `color ${motion.micro}`,
          `box-shadow ${motion.micro}`,
        ].join(', '),
        ...style,
      }}
      {...buttonProps}
    >
      {isValidElement(icon) ? cloneElement(icon, { size: icon.props.size ?? iconSize }) : icon}
      {showTooltip ? (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: `calc(100% + 8px)`,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 40,
            maxWidth: '180px',
            padding: '6px 8px',
            border: `1px solid ${colors.lineSoft}`,
            borderRadius: radius[12],
            background: 'rgba(255,255,255,0.96)',
            boxShadow: '0 12px 28px rgba(15,23,42,0.12)',
            color: colors.textBody,
            fontSize: '11px',
            lineHeight: 1.15,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {title}
        </span>
      ) : null}
    </button>
  )
}
