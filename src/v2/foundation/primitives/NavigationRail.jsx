import { BookOpen, ClipboardList, Home, List, Pin, PinOff, SplitSquareVertical } from 'lucide-react'
import { useState } from 'react'
import { colors, motion, radius, spacing, typography } from '../tokens'
import IconActionButton from './IconActionButton'

const iconMap = {
  home: Home,
  projects: List,
  study: BookOpen,
  segmentation: SplitSquareVertical,
  exams: ClipboardList,
}

function getNavButtonStyle(isExpanded, isActive, isHovered) {
  const isHighlighted = isActive || isHovered

  return {
    position: 'relative',
    width: '100%',
    height: '40px',
    border: 'none',
    borderRadius: radius[12],
    background: isHighlighted ? 'rgba(239, 246, 255, 0.92)' : 'transparent',
    color: isHighlighted ? colors.accentStrong : '#A1AEC1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isExpanded ? 'flex-start' : 'center',
    gap: spacing[12],
    padding: isExpanded ? '0 12px' : '0',
    cursor: 'pointer',
    textAlign: 'left',
    transition: `background-color ${motion.micro}, color ${motion.micro}`,
  }
}

export function NavigationRailBrand() {
  return (
    <div
      aria-hidden="true"
      style={{
        fontFamily: '"Playfair Display", Georgia, serif',
        fontSize: '22px',
        lineHeight: 1,
        fontWeight: 700,
        color: colors.accentStrong,
        letterSpacing: '-0.03em',
      }}
    >
      A
    </div>
  )
}

export function NavigationRailPinControl({ shell }) {
  if (!shell?.showRail || !shell.isNavExpanded) {
    return null
  }

  return (
    <IconActionButton
      size="utility-sm"
      label={shell.isNavPinned ? 'Unpin navigation rail' : 'Pin navigation rail'}
      title={shell.isNavPinned ? 'Unpin navigation rail' : 'Pin navigation rail'}
      active={shell.isNavPinned}
      onClick={shell.toggleNavigationRailPin}
      icon={shell.isNavPinned ? <PinOff strokeWidth={1.8} /> : <Pin strokeWidth={1.8} />}
    />
  )
}

export function NavigationRailItems({ shell }) {
  const [hoveredRouteId, setHoveredRouteId] = useState(null)

  if (!shell?.showRail) {
    return null
  }

  return (
    <>
      {shell.railItems.map((route) => {
        const rail = route.shell?.rail
        const Icon = iconMap[rail?.iconKey] ?? List
        const isActive = shell.activeRailGroupId === rail?.groupId
        const isHovered = hoveredRouteId === route.id

        return (
          <button
            key={route.id}
            type="button"
            aria-label={rail?.label ?? route.label}
            onClick={() => shell.navigate(rail?.routeId ?? route.id)}
            onMouseEnter={() => setHoveredRouteId(route.id)}
            onMouseLeave={() => setHoveredRouteId(null)}
            style={getNavButtonStyle(shell.isNavExpanded, isActive, isHovered)}
          >
            {isActive ? (
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '4px',
                  bottom: '4px',
                  right: '-1px',
                  width: '4px',
                  borderRadius: '999px 0 0 999px',
                  background: colors.accentBase,
                  boxShadow: '0 0 0 1px rgba(37, 99, 235, 0.04)',
                }}
              />
            ) : null}

            <Icon size={18} strokeWidth={1.8} />

            {shell.isNavExpanded ? (
              <span
                style={{
                  ...typography.bodyText,
                  fontSize: '13px',
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: 'inherit',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {rail?.label ?? route.label}
              </span>
            ) : null}
          </button>
        )
      })}
    </>
  )
}
