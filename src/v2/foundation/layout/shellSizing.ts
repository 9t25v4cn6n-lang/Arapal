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

/**
 * The shell's left safe area, and the single vertical axis the chrome hangs on.
 *
 * The rail lane can never be narrower than its control plus both gutters, so the
 * control's centre is a FIXED distance from the viewport edge regardless of how
 * the proportional grid resolves. That axis — not the lane's nominal `0.5fr`
 * width — is what the header's identity must sit on.
 *
 * The header used to derive its own inset from `navigationRail.collapsedPx`, a
 * nominal 51.429px the rail itself overrides with a 60px floor. The identity
 * mark therefore centred on 25.7px while every rail icon below it centred on
 * 30px: 4.3px of misalignment, and a 9.7px gap that read as the mark being
 * clipped against the viewport edge.
 */
export const shellSafeArea = {
  /** Narrowest the rail lane can resolve to: the control plus both gutters. */
  railLaneFloorPx: controlSizing.navRailControlPx + RAIL_MIN_GUTTER_PX * 2,
  /** Distance from the viewport edge to the centre of every collapsed rail control. */
  get railControlCenterPx() {
    return this.railLaneFloorPx / 2
  },
  /**
   * How far the active indicator sits from the rail's own left edge. Small, but
   * deliberate: at 3px *inside* the 36px control it read as icon decoration
   * rather than as a marker belonging to the rail.
   */
  railActiveIndicatorInsetPx: 4,
  railActiveIndicatorWidthPx: 4,
}

/**
 * Left inset for a header lane holding a mark of `markPx`, so the mark centres
 * on the rail's control axis. Floored at the rail's own gutter so a narrow
 * viewport can tighten the composition but never breach the safe area.
 */
export function getHeaderIdentityInsetPx(markPx) {
  return Math.max(RAIL_MIN_GUTTER_PX, shellSafeArea.railControlCenterPx - markPx / 2)
}

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
  const railFloorPx = shellSafeArea.railLaneFloorPx

  return `minmax(${railFloorPx}px, ${railUnits}fr) minmax(0, ${bodyUnits}fr)`
}

export function getDefaultBodySplitColumns({ isNavExpanded = false } = {}) {
  const { startRailUnits, centerUnits, endRailUnits, expandedStartRailUnits, expandedEndRailUnits } =
    shellSizing.defaultBodySplit

  return isNavExpanded
    ? `minmax(0, ${expandedStartRailUnits}fr) minmax(0, ${centerUnits}fr) minmax(0, ${expandedEndRailUnits}fr)`
    : `minmax(0, ${startRailUnits}fr) minmax(0, ${centerUnits}fr) minmax(0, ${endRailUnits}fr)`
}
