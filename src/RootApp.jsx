import { useEffect, useState } from 'react'
import App from './App'
import AppV2 from './v2/AppV2'
import { defaultRouteId } from './v2/app/routeRegistry'

/**
 * Legacy hashes that now belong to a V2 screen.
 *
 * Resolved HERE, at read time, rather than by assigning `window.location.hash`
 * inside the legacy app's render. That assignment raced its own listener: on a
 * reload of `#exams` the rewrite fired before RootApp's `hashchange` effect had
 * registered, the event was missed, and the app rendered the legacy preview
 * shell with no screen in it — a blank page, reproducibly, on the route the
 * navigation rail points at. Routing must not depend on an event that can be
 * dispatched before anyone is listening.
 */
const LEGACY_ROUTE_ALIASES = {
  projects: 'projects',
  exams: 'exams',
}

function readHash() {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.location.hash.replace(/^#/, '')
}

// The legacy app is a REFERENCE surface (surface: 'reference' in
// scripts/qa/standard.mjs), reachable only at these explicit hashes. Everything
// else — the empty production root and any unknown route — is the V2 product.
// Previously any non-`v2` hash, including the bare root, fell through to the
// legacy app, so the public entry opened an incompatible second home (R-021).
const LEGACY_REFERENCE_HASHES = new Set(['home', 'study', 'segmentation', 'exams-legacy'])

function readV2RouteFromHash() {
  const hashValue = readHash()

  const aliased = LEGACY_ROUTE_ALIASES[hashValue]
  if (aliased) {
    return aliased
  }

  if (hashValue.startsWith('v2')) {
    const [, routeId] = hashValue.split('/')
    return routeId || defaultRouteId
  }

  // Explicit legacy reference surfaces stay on the legacy app.
  if (LEGACY_REFERENCE_HASHES.has(hashValue)) {
    return null
  }

  // The production root and any unknown route resolve to the V2 product home,
  // never the legacy app. This is what makes V2 the production entry point.
  return defaultRouteId
}

export default function RootApp() {
  const [v2RouteId, setV2RouteId] = useState(readV2RouteFromHash)

  useEffect(() => {
    const handleLocationChange = () => {
      setV2RouteId(readV2RouteFromHash())
    }

    window.addEventListener('hashchange', handleLocationChange)
    window.addEventListener('popstate', handleLocationChange)
    // Re-read once on mount: a hash that changed between the initial render and
    // this effect would otherwise be missed for the life of the page.
    handleLocationChange()
    return () => {
      window.removeEventListener('hashchange', handleLocationChange)
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  // Cosmetic only — the route is already resolved above. Rewriting the alias in
  // an effect keeps the address bar honest without routing depending on it.
  useEffect(() => {
    const hashValue = readHash()
    if (LEGACY_ROUTE_ALIASES[hashValue]) {
      window.location.replace(`#v2/${LEGACY_ROUTE_ALIASES[hashValue]}`)
    }
  }, [v2RouteId])

  if (v2RouteId) {
    return <AppV2 routeId={v2RouteId} />
  }

  return <App />
}
