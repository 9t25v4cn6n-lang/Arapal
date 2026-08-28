import { BookOpen, ClipboardList, FolderGit2, Home, Layers3, Pin, PinOff, ShieldCheck, Sparkles, SplitSquareVertical, TextSearch } from 'lucide-react'
import { useState } from 'react'
import { colors, motion, radius, spacing, typography } from '../tokens'
import { RAIL_MIN_GUTTER_PX, shellSafeArea } from '../layout/shellSizing'
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
 * Horizontal padding of the rail lane in each state, which is what the active
 * indicator has to reach back across to land on the rail's own edge.
 *
 * These mirror `V2ScreenFrame`'s rail override. Kept as named constants rather
 * than repeated literals because the indicator's offset is only correct while it
 * agrees with the padding the lane actually renders.
 */
const railLanePaddingPx = {
  collapsed: RAIL_MIN_GUTTER_PX,
  expanded: 16,
}

/**
 * Where the active marker sits.
 *
 * It used to be `left: 3px` — three pixels inside the 36px control — so it read
 * as a decoration attached to the icon rather than as the rail saying which
 * destination you are in. It now sits a deliberate 4px off the rail's own left
 * edge in both states, which means reaching back out of the button by whatever
 * the lane's padding is. A full pill in both states, too: the half-pill was a
 * tab shape, and a tab only makes sense flush against an edge it is no longer
 * flush against.
 */
function getActiveIndicatorStyle(isExpanded) {
  const lanePadding = isExpanded ? railLanePaddingPx.expanded : railLanePaddingPx.collapsed

  return {
    position: 'absolute',
    top: '4px',
    bottom: '4px',
    left: `${shellSafeArea.railActiveIndicatorInsetPx - lanePadding}px`,
    width: `${shellSafeArea.railActiveIndicatorWidthPx}px`,
    borderRadius: radius.pill,
    background: colors.accentBase,
    boxShadow: navigationRailChrome.activeIndicatorShadow,
  }
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

/**
 * Three states, not two.
 *
 * `current` is the destination you are on. `context` is a sibling in the same
 * family — Project Research while you are in Projects, and the reverse — which
 * is real information the rail should carry, but it is NOT where you are.
 *
 * Both used to resolve from `groupId` alone and render identically, so Research
 * showed two rows lit blue with two active markers and the rail answered "where
 * am I?" with two answers. Context now reads as a raised text tone and nothing
 * else: no surface, no marker, no accent.
 */
function getNavState({ isCurrent, isInContext, isHovered }) {
  if (isCurrent) return 'current'
  if (isHovered) return 'hovered'
  if (isInContext) return 'context'
  return 'inactive'
}

function getNavButtonStyle(isExpanded, navState) {
  const hasSurface = navState === 'current' || navState === 'hovered'
  const color = {
    current: colors.accentStrong,
    hovered: colors.accentStrong,
    context: colors.textSoft,
    inactive: navigationRailMetrics.inactiveTone,
  }[navState]

  return {
    position: 'relative',
    width: isExpanded ? '100%' : navigationRailMetrics.collapsedWidth,
    height: navigationRailMetrics.rowHeight,
    border: 'none',
    borderRadius: radius[12],
    background: hasSurface ? navigationRailMetrics.highlightedSurface : 'transparent',
    color,
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

/**
 * Persistent, discoverable entry to BYO-key AI setup. It sits in the rail's
 * utility foot next to the pin, and like the pin it only shows while the rail is
 * expanded — a labelled control the user can find without hitting an
 * unavailable state first (IP-09).
 */
export function NavigationRailAiSetupControl({ shell }) {
  if (!shell?.showRail || !shell.isNavExpanded) {
    return null
  }

  return (
    <IconActionButton
      size="utility-sm"
      label="AI provider setup"
      title="AI provider setup"
      onClick={shell.openAiConfig}
      icon={<Sparkles strokeWidth={1.8} />}
    />
  )
}

/**
 * Data & privacy control — the local-first trust contract's discoverable entry
 * (Programme 8). Sits in the utility foot beside AI setup so backup/restore/
 * delete-all is reachable without a standalone Settings surface.
 */
export function NavigationRailDataControl({ shell }) {
  if (!shell?.showRail || !shell.isNavExpanded) {
    return null
  }

  return (
    <IconActionButton
      size="utility-sm"
      label="Data and privacy"
      title="Data and privacy"
      onClick={shell.openDataControls}
      icon={<ShieldCheck strokeWidth={1.8} />}
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
        const routeId = rail?.routeId ?? route.id
        const isCurrent = shell.activeRailRouteId === routeId
        const isInContext = !isCurrent && shell.activeRailGroupId === rail?.groupId
        const isHovered = hoveredRouteId === route.id
        const navState = getNavState({ isCurrent, isInContext, isHovered })

        return (
          <button
            key={route.id}
            type="button"
            aria-label={rail?.label ?? route.label}
            aria-current={isCurrent ? 'page' : undefined}
            onClick={() => (rail?.externalHash
              ? shell.navigateExternal(rail.externalHash)
              : shell.navigate(rail?.routeId ?? route.id))}
            onMouseEnter={() => setHoveredRouteId(route.id)}
            onMouseLeave={() => setHoveredRouteId(null)}
            style={getNavButtonStyle(shell.isNavExpanded, navState)}
          >
            {isCurrent ? (
              <span aria-hidden="true" style={getActiveIndicatorStyle(shell.isNavExpanded)} />
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
