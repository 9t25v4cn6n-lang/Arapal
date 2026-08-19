function roundPx(value) {
  return `${Math.round(value * 1000) / 1000}px`
}

const canonicalViewport = {
  widthPx: 1440,
  heightPx: 900,
}

const normalizedFrame = {
  widthUnits: 14,
  heightUnits: 9,
}

const widthUnitPx = canonicalViewport.widthPx / normalizedFrame.widthUnits
const heightUnitPx = canonicalViewport.heightPx / normalizedFrame.heightUnits

import { controlSizing } from '../tokens/controlSizing'

/**
 * Breathing room either side of a collapsed rail control.
 *
 * This must match the rail lane's own horizontal padding, otherwise the floor
 * reserves less than the padding consumes and the control is clipped anyway —
 * which is exactly how the original 0.5fr lane failed.
 */
export const RAIL_MIN_GUTTER_PX = 12

export const shellSizing = {
  canonicalViewport,
  normalizedFrame,
  header: {
    heightUnits: 0.5,
    heightPx: roundPx(heightUnitPx * 0.5),
  },
  layer1: {
    widthUnitPx,
    heightUnitPx,
    headerHeightPx: roundPx(heightUnitPx * 0.5),
    collapsedRailWidthPx: roundPx(widthUnitPx * 0.5),
  },
  navigationRail: {
    collapsedUnits: 0.5,
    expandedUnits: 3,
    collapsedPx: roundPx(widthUnitPx * 0.5),
    expandedPx: roundPx(widthUnitPx * 3),
  },
  defaultBodySplit: {
    totalUnits: 13.5,
    startRailUnits: 3.5,
    centerUnits: 6.5,
    endRailUnits: 3.5,
    expandedStartRailUnits: 1.25,
    expandedEndRailUnits: 1.25,
    startRailPx: roundPx(widthUnitPx * 3.5),
    centerPx: roundPx(widthUnitPx * 6.5),
    endRailPx: roundPx(widthUnitPx * 3.5),
    expandedStartRailPx: roundPx(widthUnitPx * 1.25),
    expandedEndRailPx: roundPx(widthUnitPx * 1.25),
  },
}

export function getLayer1BodyColumns({ isNavExpanded = false } = {}) {
  const railUnits = isNavExpanded ? shellSizing.navigationRail.expandedUnits : shellSizing.navigationRail.collapsedUnits
  const bodyUnits = shellSizing.normalizedFrame.widthUnits - railUnits

  // The rail lane was purely proportional (0.5fr of a 30-unit frame) while the
  // control it holds is a fixed 36px, so the lane shrank with the viewport and
  // clipped every rail icon — by 10px at 1440, 12px at 1366, 15px at 1280. The
  // floor makes the lane derive from its content: it can still grow with the
  // frame, but it can never be narrower than the control plus its gutters.
  const railFloorPx = controlSizing.navRailControlPx + RAIL_MIN_GUTTER_PX * 2

  return `minmax(${railFloorPx}px, ${railUnits}fr) minmax(0, ${bodyUnits}fr)`
}

export function getDefaultBodySplitColumns({ isNavExpanded = false } = {}) {
  const { startRailUnits, centerUnits, endRailUnits, expandedStartRailUnits, expandedEndRailUnits } =
    shellSizing.defaultBodySplit

  return isNavExpanded
    ? `minmax(0, ${expandedStartRailUnits}fr) minmax(0, ${centerUnits}fr) minmax(0, ${expandedEndRailUnits}fr)`
    : `minmax(0, ${startRailUnits}fr) minmax(0, ${centerUnits}fr) minmax(0, ${endRailUnits}fr)`
}
