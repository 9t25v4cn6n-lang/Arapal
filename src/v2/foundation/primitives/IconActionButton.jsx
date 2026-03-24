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
  const resolvedSize = resolveSize(size)
  const isHighlighted = active || isHovered
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
      style={{
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
    </button>
  )
}
