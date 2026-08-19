export const controlSizing = {
  // Width of a collapsed navigation-rail control. The shell derives the rail's
  // horizontal padding from this so the lane can never be narrower than what it
  // holds — previously the two were chosen independently and every rail icon was
  // clipped by ~10px on every V2 route (visual-standard: container-undersized).
  navRailControlPx: 36,
  utilitySm: {
    hitAreaPx: 28,
    iconPx: 16,
  },
  utilityMd: {
    hitAreaPx: 32,
    iconPx: 18,
  },
}
