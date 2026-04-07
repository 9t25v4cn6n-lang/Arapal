import { BookOpen, ClipboardList, FolderGit2, Home, Layers3, Pin, PinOff, SplitSquareVertical } from 'lucide-react'
import { useState } from 'react'
import { colors, motion, radius, spacing, typography } from '../tokens'
import IconActionButton from './IconActionButton'
import { getIdentityBadgeStyle, identityBadgeChrome } from './identityBadgePresets'

const iconMap = {
  home: Home,
  projects: Layers3,
  study: BookOpen,
  segmentation: SplitSquareVertical,
  exams: ClipboardList,
}

const navigationRailMetrics = {
  collapsedWidth: '36px',
  rowHeight: '40px',
  expandedPadding: '0 12px 0 16px',
  brandMarkSize: 36,
  brandMarkFlex: '0 0 36px',
  brandMarkRadius: radius[12],
  brandArchTop: 6,
  brandArchWidth: 14,
  brandArchHeight: 7,
  brandArchRadius: '999px 999px 0 0',
  brandStemTop: 9,
  brandStemWidth: 2,
  brandStemHeight: 13,
  brandStemRadius: radius.pill,
  brandDotBottom: 6,
  brandDotSize: 5,
  brandDotRadius: radius.pill,
  labelFontSize: '13px',
  labelFontWeight: 600,
  labelLineHeight: 1.2,
  highlightedSurface: 'rgba(239, 246, 255, 0.92)',
  inactiveTone: '#A1AEC1',
}

const navigationRailChrome = {
  activeIndicatorShadow: '0 0 0 1px rgba(37, 99, 235, 0.04)',
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

function NavigationRailBrandMark() {
  return (
    <div
      aria-hidden="true"
      style={{
        ...getIdentityBadgeStyle({
          size: navigationRailMetrics.brandMarkSize,
          radiusValue: navigationRailMetrics.brandMarkRadius,
          shadowValue: identityBadgeChrome.railSurfaceShadow,
          flexValue: navigationRailMetrics.brandMarkFlex,
        }),
        position: 'relative',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: navigationRailMetrics.brandArchTop,
          left: '50%',
          width: navigationRailMetrics.brandArchWidth,
          height: navigationRailMetrics.brandArchHeight,
          border: '2px solid currentColor',
          borderBottom: 'none',
          borderRadius: navigationRailMetrics.brandArchRadius,
          transform: 'translateX(-50%)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: navigationRailMetrics.brandStemTop,
          left: '50%',
          width: navigationRailMetrics.brandStemWidth,
          height: navigationRailMetrics.brandStemHeight,
          background: 'currentColor',
          borderRadius: navigationRailMetrics.brandStemRadius,
          transform: 'translateX(-50%)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          bottom: navigationRailMetrics.brandDotBottom,
          left: '50%',
          width: navigationRailMetrics.brandDotSize,
          height: navigationRailMetrics.brandDotSize,
          borderRadius: navigationRailMetrics.brandDotRadius,
          background: 'currentColor',
          transform: 'translateX(-50%)',
          boxShadow: identityBadgeChrome.railDotShadow,
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
                  boxShadow: navigationRailChrome.activeIndicatorShadow,
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
                fontSize: navigationRailMetrics.labelFontSize,
                fontWeight: navigationRailMetrics.labelFontWeight,
                lineHeight: navigationRailMetrics.labelLineHeight,
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
