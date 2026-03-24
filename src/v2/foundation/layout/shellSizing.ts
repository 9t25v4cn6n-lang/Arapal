const FRAME_WIDTH_PX = 1440
const FRAME_WIDTH_UNITS = 30
const FRAME_UNIT_PX = FRAME_WIDTH_PX / FRAME_WIDTH_UNITS

function unitsToPx(units) {
  return `${Number((units * FRAME_UNIT_PX).toFixed(2))}px`
}

export const shellSizing = {
  frame: {
    widthPx: FRAME_WIDTH_PX,
    widthUnits: FRAME_WIDTH_UNITS,
    unitPx: FRAME_UNIT_PX,
  },
  header: {
    heightPx: '72px',
  },
  navigationRail: {
    collapsedUnits: 1.5,
    expandedUnits: 5.7,
    collapsedPx: unitsToPx(1.5),
    expandedPx: unitsToPx(5.7),
  },
  defaultBodySplit: {
    startRailUnits: 5.7,
    centerUnits: 17.1,
    endRailUnits: 5.7,
    startRailPx: unitsToPx(5.7),
    endRailPx: unitsToPx(5.7),
  },
}

export function getDefaultBodySplitColumns() {
  return `${shellSizing.defaultBodySplit.startRailPx} minmax(0, 1fr) ${shellSizing.defaultBodySplit.endRailPx}`
}

export default shellSizing
