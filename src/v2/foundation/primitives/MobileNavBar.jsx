import { BookOpen, ClipboardList, FolderGit2, Home, Layers3, SplitSquareVertical, TextSearch } from 'lucide-react'
import { colors, radius, spacing, typography } from '../tokens'

/**
 * Mobile global navigation.
 *
 * At ≤560px the shell hides the vertical navigation rail (it costs 60px of a
 * 390px frame), which left a mobile user with NO way to move between Project
 * Home, Projects, Research, Study, Segmentation and Exams (R-020). This fixed
 * bottom bar restores that: the same primary destinations, as a standard mobile
 * pattern, with a real accessibility landmark and aria-current on the active tab.
 */

// Keyed to routeRegistry's iconKey, matching the vertical rail's map.
const iconMap = {
  projectHome: Home,
  projects: Layers3,
  projectResearch: TextSearch,
  study: BookOpen,
  segmentation: SplitSquareVertical,
  exams: ClipboardList,
}

export const MOBILE_NAV_HEIGHT_PX = 60

export default function MobileNavBar({ items, activeRouteId, onNavigate }) {
  return (
    <nav aria-label="Primary" style={styles.bar}>
      {items.map((route) => {
        const rail = route.shell?.rail
        const routeId = rail?.routeId ?? route.id
        const Icon = iconMap[rail?.iconKey] ?? FolderGit2
        const isActive = routeId === activeRouteId
        return (
          <button
            key={route.id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            aria-label={rail?.label ?? routeId}
            onClick={() => onNavigate(routeId)}
            style={{ ...styles.item, ...(isActive ? styles.itemActive : null) }}
          >
            <Icon size={20} strokeWidth={1.9} />
            <span style={styles.label}>{rail?.shortLabel ?? rail?.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

const styles = {
  bar: {
    // In-flow flex item at the bottom of the app column (#root is a viewport-tall
    // flex column), NOT position:fixed. Fixed overlaid each screen's own scroll
    // container, which the stage padding could not reach, so content collided
    // with the tab buttons (QA overlap). In flow the bar takes real space and the
    // screen scrolls above it.
    flex: '0 0 auto',
    height: `${MOBILE_NAV_HEIGHT_PX}px`,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    gap: spacing[4],
    padding: `0 ${spacing[8]}`,
    background: colors.surfacePrimary,
    borderTop: `1px solid ${colors.borderSoft}`,
    boxShadow: '0 -6px 20px rgba(15, 23, 42, 0.06)',
  },
  item: {
    flex: '1 1 0',
    minWidth: 0,
    minHeight: '44px',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
    border: 'none',
    borderRadius: radius[12],
    background: 'transparent',
    color: colors.textSoft,
    cursor: 'pointer',
  },
  itemActive: {
    color: colors.accentStrong,
  },
  label: {
    // 11px is the smallest step of the type ramp (the QA type floor); anything
    // below it fails type-floor and reads as un-ramped drift.
    ...typography.eyebrowLabel,
    fontSize: '11px',
    lineHeight: 1,
    letterSpacing: '0.02em',
    textTransform: 'none',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}
