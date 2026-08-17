import { Suspense } from 'react'
import { defaultRouteId, getPrimaryRailRoutes, routeRegistry } from './app/routeRegistry'
import { shellSizing } from './foundation/layout/shellSizing'
import useNavigationRailState from './foundation/primitives/useNavigationRailState'

export default function AppV2({ routeId = defaultRouteId }) {
  // A registry entry is only routable if it can actually render. Rail entries
  // that point outside V2 — Exams lives on the legacy hash — carry navigation
  // metadata and no component, and `#v2/exams` typed by hand would otherwise
  // resolve to that entry and render undefined.
  const requested = routeRegistry[routeId]
  const activeRoute = requested?.component ? requested : routeRegistry[defaultRouteId]
  const ActiveScreen = activeRoute.component
  const navigationRailState = useNavigationRailState()

  const railItems = getPrimaryRailRoutes()
  const { isNavPinned, isNavHovered, isNavExpanded } = navigationRailState
  const activeRailGroupId = activeRoute.shell?.rail?.groupId ?? activeRoute.id
  const showRail = activeRoute.shell?.showRail !== false

  const shell = {
    activeRoute,
    activeRailGroupId,
    showRail,
    railItems,
    isNavPinned,
    isNavHovered,
    isNavExpanded,
    navigationRail: shellSizing.navigationRail,
    navigate(nextRouteId) {
      if (!nextRouteId) {
        return
      }

      if (!isNavPinned) {
        navigationRailState.handleNavigationRailMouseLeave()
      }

      window.location.hash = `v2/${nextRouteId}`
    },
    /**
     * Navigate to a route outside the V2 surface.
     *
     * navigate() prefixes `v2/` unconditionally, so it could not express a
     * legacy destination at all — and Exams only exists as a legacy route. The
     * consequence was a dead end: nothing anywhere in V2 linked to Exams, so the
     * shipping assessment capability was reachable only by typing #exams. The
     * hash is already the boundary RootApp switches on; this states that
     * explicitly instead of leaving the surface with no way out.
     */
    navigateExternal(hash) {
      if (!hash) {
        return
      }

      if (!isNavPinned) {
        navigationRailState.handleNavigationRailMouseLeave()
      }

      window.location.hash = hash
    },
    ...navigationRailState,
  }

  return <Suspense fallback={null}><ActiveScreen route={activeRoute} shell={shell} /></Suspense>
}
