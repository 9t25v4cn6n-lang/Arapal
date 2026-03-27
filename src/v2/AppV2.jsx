import { defaultRouteId, getPrimaryRailRoutes, routeRegistry } from './app/routeRegistry'
import { shellSizing } from './foundation/layout/shellSizing'
import useNavigationRailState from './foundation/primitives/useNavigationRailState'

export default function AppV2({ routeId = defaultRouteId }) {
  const activeRoute = routeRegistry[routeId] ?? routeRegistry[defaultRouteId]
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
    ...navigationRailState,
  }

  return <ActiveScreen route={activeRoute} shell={shell} />
}
