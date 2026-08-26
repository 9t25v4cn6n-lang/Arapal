import { useSyncExternalStore } from 'react'

/**
 * Is the viewport at or below the mobile breakpoint?
 *
 * Exists because several screens compute their column model in JavaScript from
 * runtime state — focus mode, which rails are collapsed, whether the discussion
 * companion is open — and write it out as an inline gridTemplateColumns. Inline
 * styles beat stylesheet rules, so a media query cannot collapse those layouts
 * no matter how it is written. Width has to be an input to the same function
 * that already takes the other state, not a competing declaration.
 *
 * matchMedia rather than a resize listener: it fires only when the answer
 * actually changes, so a drag across the breakpoint produces one update instead
 * of one per frame.
 */
export const MOBILE_BREAKPOINT_PX = 560

const QUERY = `(max-width: ${MOBILE_BREAKPOINT_PX}px)`

function subscribe(onChange) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const list = window.matchMedia(QUERY)
  list.addEventListener('change', onChange)
  return () => list.removeEventListener('change', onChange)
}

function getSnapshot() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(QUERY).matches
}

/** Server render has no viewport; assume desktop so nothing collapses on first paint. */
function getServerSnapshot() {
  return false
}

export default function useIsMobileViewport() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

// The tablet band sits ABOVE the mobile breakpoint and below the desktop
// three-pane width. A contract can restate layout here (`tablet` block) so a
// fixed desktop rail does not crush the primary detail at 768 (S3-003).
export const TABLET_MAX_PX = 1024
const TABLET_QUERY = `(min-width: ${MOBILE_BREAKPOINT_PX + 1}px) and (max-width: ${TABLET_MAX_PX}px)`

function subscribeTablet(onChange) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const list = window.matchMedia(TABLET_QUERY)
  list.addEventListener('change', onChange)
  return () => list.removeEventListener('change', onChange)
}
function getTabletSnapshot() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(TABLET_QUERY).matches
}

export function useIsTabletViewport() {
  return useSyncExternalStore(subscribeTablet, getTabletSnapshot, getServerSnapshot)
}
