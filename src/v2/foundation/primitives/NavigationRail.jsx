import { BookOpen, ClipboardList, FolderGit2, Home, Layers3, Pin, PinOff, SplitSquareVertical, TextSearch } from 'lucide-react'
import { useState } from 'react'
import { colors, motion, radius, spacing, typography } from '../tokens'
import IconActionButton from './IconActionButton'

const iconMap = {
  // Keyed to match routeRegistry's iconKey exactly. This was `home` while the
  // registry asked for `projectHome`, so the lookup missed and Project Home
  // silently rendered the FolderGit2 fallback — a folder-with-git-nodes glyph
  // for the product's front door. The fallback is what hid it: an unresolved key
  // still draws something plausible.
  projectHome: Home,
  projects: Layers3,
  // Research is "search and inspect project knowledge" — its own screen says so.
  projectResearch: TextSearch,
  study: BookOpen,
  segmentation: SplitSquareVertical,
  exams: ClipboardList,
}

const navigationRailMetrics = {
  collapsedWidth: '36px',
  rowHeight: '40px',
  expandedPadding: '0 12px 0 16px',
  highlightedSurface: 'rgba(239, 246, 255, 0.92)',
  inactiveTone: '#A1AEC1',
}

const navigationRailChrome = {
  activeIndicatorShadow: '0 0 0 1px rgba(37, 99, 235, 0.04)',
}

/**
 * The rail's utility foot. It holds the pin control, and only while the rail is
 * expanded — a pin for a rail you cannot see the labels of has nothing to say.
 * `display: none` rather than a hidden 28px lane, so the destinations above it
 * do not shift when it appears.
 */
export function getNavigationUtilityAnchorStyle(isExpanded) {
  return isExpanded
    ? {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minWidth: '28px',
        paddingTop: spacing[12],
      }
    : {
        display: 'none',
      }
}

function getNavButtonStyle(isExpanded, isActive, isHovered) {
  const isHighlighted = isActive || isHovered

  return {
    position: 'relative',
    width: isExpanded ? '100%' : navigationRailMetrics.collapsedWidth,
    height: navigationRailMetrics.rowHeight,
    border: 'none',
    borderRadius: radius[12],
    background: isHighlighted ? navigationRailMetrics.highlightedSurface : 'transparent',
    color: isHighlighted ? colors.accentStrong : navigationRailMetrics.inactiveTone,
    display: 'flex',
    alignItems: 'center',
    justifyContent: isExpanded ? 'flex-start' : 'center',
    gap: isExpanded ? spacing[12] : 0,
    padding: isExpanded ? navigationRailMetrics.expandedPadding : '0',
    margin: isExpanded ? '0' : '0 auto',
    cursor: 'pointer',
    textAlign: 'left',
    transition: `background-color ${motion.micro}, color ${motion.micro}`,
  }
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
            onClick={() => (rail?.externalHash
              ? shell.navigateExternal(rail.externalHash)
              : shell.navigate(rail?.routeId ?? route.id))}
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
                  boxShadow: navigationRailChrome.activeIndicatorShadow,
                }}
              />
            ) : null}

            <Icon size={18} strokeWidth={1.8} />

            <span
              style={{
                ...typography.controlLabel,
                lineHeight: 1.2,
                display: 'block',
                flex: shell.isNavExpanded ? '1 1 auto' : '0 0 0px',
                minWidth: 0,
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
