import { Suspense } from 'react'
import { defaultRouteId, getPrimaryRailRoutes, routeRegistry } from './app/routeRegistry'
import { shellSizing } from './foundation/layout/shellSizing'
import { useAppIntro } from './foundation/primitives/AppIntro'
import useNavigationRailState from './foundation/primitives/useNavigationRailState'
import useIsMobileViewport from './foundation/primitives/useIsMobileViewport'

// Internal design/QA surfaces. They stay reachable in development but must not
// be routable in a production build — a hand-typed `#v2/patternLab` on the live
// site resolved straight to them (R-012 / R-021).
const DEV_ONLY_ROUTES = new Set([
  'foundationLab', 'controlsLab', 'editorPanelsLab', 'typographyTokensLab',
  'motionInteractionLab', 'patternLab', 'qualityDashboard',
])

export default function AppV2({ routeId = defaultRouteId }) {
  // A registry entry is only routable if it can actually render. Rail entries
  // that point outside V2 — Exams lives on the legacy hash — carry navigation
  // metadata and no component, and `#v2/exams` typed by hand would otherwise
  // resolve to that entry and render undefined.
  const requested = routeRegistry[routeId]
  const routable = requested?.component && !(DEV_ONLY_ROUTES.has(routeId) && import.meta.env.PROD)
  const activeRoute = routable ? requested : routeRegistry[defaultRouteId]
  const ActiveScreen = activeRoute.component
  const navigationRailState = useNavigationRailState()
  const [introPhase, introOverlay] = useAppIntro()

  const railItems = getPrimaryRailRoutes()
  const { isNavPinned, isNavHovered, isNavExpanded } = navigationRailState
  const activeRailGroupId = activeRoute.shell?.rail?.groupId ?? activeRoute.id
  // The rail needs BOTH: which family you are in, and which destination you are
  // actually on. Projects and Project Research deliberately share a group, so
  // group alone lit two rows identically and the rail could not say where you
  // were. The route id is the difference between context and current.
  const activeRailRouteId = activeRoute.shell?.rail?.routeId ?? activeRoute.id
  // The rail is chrome, and at 390px chrome that costs 60px of a 390px frame is
  // the difference between a workspace and a strip. Study already hid its own
  // rails at this breakpoint via a stylesheet; the GLOBAL rail could not be
  // hidden the same way because the shell writes its geometry as inline styles
  // from the contract, and an inline style beats a media query. So width is an
  // input here, the same way `useIsMobileViewport` was built for.
  const isMobileViewport = useIsMobileViewport()
  const showRail = activeRoute.shell?.showRail !== false && !isMobileViewport

  const shell = {
    activeRoute,
    isMobileViewport,
    activeRailGroupId,
    activeRailRouteId,
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

  return (
    <>
      {/* The stage is muted only while the intro is on top of it, and the class
          is applied to a wrapper rather than to the screen so no screen has to
          know the animation exists. */}
      <div
        className={`arapal-intro-stage${introPhase === 'intro' ? ' is-muted' : ''}`}
        // Sizing is inline because the class's stylesheet unmounts with the
        // overlay: the wrapper must lay out identically whether the intro is
        // playing, leaving, or was never there.
        style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}
      >
        <Suspense fallback={null}><ActiveScreen route={activeRoute} shell={shell} /></Suspense>
      </div>
      {introOverlay}
    </>
  )
}
