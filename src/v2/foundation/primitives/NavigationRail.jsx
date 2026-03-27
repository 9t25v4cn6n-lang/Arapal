import { BookOpen, ClipboardList, FolderGit2, Home, Layers3, Pin, PinOff, SplitSquareVertical } from 'lucide-react'
import { useState } from 'react'
import { colors, motion, radius, spacing, typography } from '../tokens'
import IconActionButton from './IconActionButton'

const iconMap = {
  home: Home,
  projects: Layers3,
  study: BookOpen,
  segmentation: SplitSquareVertical,
  exams: ClipboardList,
}

export function getNavigationHeaderBandStyle(isExpanded) {
  return {
    display: 'grid',
    gridTemplateColumns: isExpanded ? 'minmax(0, 1fr) auto' : '1fr',
    alignItems: 'start',
    justifyContent: isExpanded ? 'stretch' : 'center',
    gap: spacing[12],
    minHeight: '32px',
  }
}

export function getNavigationBrandAnchorStyle(isExpanded) {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isExpanded ? 'flex-start' : 'center',
  }
}

export function getNavigationUtilityAnchorStyle(isExpanded) {
  return isExpanded
    ? {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minWidth: '28px',
      }
    : {
        display: 'none',
      }
}

function getNavButtonStyle(isExpanded, isActive, isHovered) {
  const isHighlighted = isActive || isHovered

  return {
    position: 'relative',
    width: isExpanded ? '100%' : '36px',
    height: '40px',
    border: 'none',
    borderRadius: radius[12],
    background: isHighlighted ? 'rgba(239, 246, 255, 0.92)' : 'transparent',
    color: isHighlighted ? colors.accentStrong : '#A1AEC1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isExpanded ? 'flex-start' : 'center',
    gap: isExpanded ? spacing[12] : 0,
    padding: isExpanded ? '0 12px 0 16px' : '0',
    margin: isExpanded ? '0' : '0 auto',
    cursor: 'pointer',
    textAlign: 'left',
    transition: `background-color ${motion.micro}, color ${motion.micro}`,
  }
}

function NavigationRailBrandMark() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        width: 36,
        height: 36,
        flex: '0 0 36px',
        overflow: 'hidden',
        borderRadius: 12,
        border: '1px solid rgba(191, 219, 254, 0.96)',
        background: 'linear-gradient(180deg, rgba(239, 246, 255, 0.98) 0%, rgba(219, 234, 254, 0.98) 100%)',
        color: colors.accentBase,
        boxShadow: '0 12px 24px rgba(37, 99, 235, 0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 6,
          left: '50%',
          width: 14,
          height: 7,
          border: '2px solid currentColor',
          borderBottom: 'none',
          borderRadius: '999px 999px 0 0',
          transform: 'translateX(-50%)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: 9,
          left: '50%',
          width: 2,
          height: 13,
          background: 'currentColor',
          borderRadius: 999,
          transform: 'translateX(-50%)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          bottom: 6,
          left: '50%',
          width: 5,
          height: 5,
          borderRadius: 999,
          background: 'currentColor',
          transform: 'translateX(-50%)',
          boxShadow: '8px 0 0 rgba(37, 99, 235, 0.24)',
        }}
      />
    </div>
  )
}

export function NavigationRailBrand({ isExpanded = false }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: isExpanded ? 'flex-start' : 'center',
        minWidth: 0,
        marginLeft: isExpanded ? 8 : 0,
      }}
    >
      <NavigationRailBrandMark />
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
        const Icon = iconMap[rail?.iconKey] ?? FolderGit2
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
                  left: shell.isNavExpanded ? '-1px' : '3px',
                  width: '4px',
                  borderRadius: shell.isNavExpanded ? '0 999px 999px 0' : '999px',
                  background: colors.accentBase,
                  boxShadow: '0 0 0 1px rgba(37, 99, 235, 0.04)',
                }}
              />
            ) : null}

            <Icon size={18} strokeWidth={1.8} />

            <span
              style={{
                ...typography.bodyText,
                display: 'block',
                flex: shell.isNavExpanded ? '1 1 auto' : '0 0 0px',
                minWidth: 0,
                fontSize: '13px',
                fontWeight: 600,
                lineHeight: 1.2,
                color: 'inherit',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: shell.isNavExpanded ? '100%' : '0px',
                opacity: shell.isNavExpanded ? 1 : 0,
                transform: shell.isNavExpanded ? 'translateX(0)' : 'translateX(-4px)',
                transition: [
                  `max-width ${motion.panel}`,
                  `opacity ${motion.micro}`,
                  `transform ${motion.micro}`,
                ].join(', '),
              }}
            >
              {rail?.label ?? route.label}
            </span>
          </button>
        )
      })}
    </>
  )
}
