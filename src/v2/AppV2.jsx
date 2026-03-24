import { useState } from 'react'
import { defaultRouteId, getPrimaryRailRoutes, routeRegistry } from './app/routeRegistry'
import { shellSizing } from './foundation/layout/shellSizing'

export default function AppV2({ routeId = defaultRouteId }) {
  const activeRoute = routeRegistry[routeId] ?? routeRegistry[defaultRouteId]
  const ActiveScreen = activeRoute.component
  const [isNavPinned, setIsNavPinned] = useState(false)
  const [isNavHovered, setIsNavHovered] = useState(false)

  const railItems = getPrimaryRailRoutes()
  const isNavExpanded = isNavPinned || isNavHovered
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
        setIsNavHovered(false)
      }

      window.location.hash = `v2/${nextRouteId}`
    },
    pinNavigationRail() {
      setIsNavPinned(true)
    },
    unpinNavigationRail() {
      setIsNavPinned(false)
    },
    toggleNavigationRailPin() {
      setIsNavPinned((current) => !current)
    },
    handleNavigationRailMouseEnter() {
      if (!isNavPinned) {
        setIsNavHovered(true)
      }
    },
    handleNavigationRailMouseLeave() {
      if (!isNavPinned) {
        setIsNavHovered(false)
      }
    },
  }

  return <ActiveScreen route={activeRoute} shell={shell} />
}
