export const labRoutes = [
  {
    id: 'foundationLab',
    label: 'Lab Index',
    title: 'Generics Review Boards',
    description: 'Jump into the category boards and review generics visually.',
  },
  {
    id: 'controlsLab',
    label: 'Controls',
    title: 'Controls Lab',
    description: 'Buttons, utility controls, pills, toggles, and action rows.',
  },
  {
    id: 'editorPanelsLab',
    label: 'Editor + Panels',
    title: 'Editor + Panels Lab',
    description: 'Editor family, operational panels, support panels, and casing.',
  },
  {
    id: 'typographyTokensLab',
    label: 'Typography + Tokens',
    title: 'Typography + Tokens Lab',
    description: 'Type roles, color roles, radius, elevation, and backdrop language.',
  },
  {
    id: 'motionInteractionLab',
    label: 'Motion + Interaction',
    title: 'Motion + Interaction Lab',
    description: 'Hover, focus, dismissal, open/close, and motion behavior.',
  },
  {
    id: 'patternLab',
    label: 'Patterns',
    title: 'Pattern Lab',
    description: 'Repeated screen patterns and mode-level building blocks.',
  },
  {
    id: 'qualityDashboard',
    label: 'Quality Dashboard',
    title: 'Quality Dashboard',
    description: 'Hybrid health view for static repo audit and rendered runtime QA.',
  },
]

export function getLabRoute(routeId) {
  return labRoutes.find((route) => route.id === routeId) ?? labRoutes[0]
}
