import { lazy } from 'react'
import controlsLabLayoutContract from '../screens/ControlsLab/ControlsLabScreen.contract'
import editorPanelsLabLayoutContract from '../screens/EditorPanelsLab/EditorPanelsLabScreen.contract'
import foundationLabLayoutContract from '../screens/FoundationLab/FoundationLabScreen.contract'
import motionInteractionLabLayoutContract from '../screens/MotionInteractionLab/MotionInteractionLabScreen.contract'
import patternLabLayoutContract from '../screens/PatternLab/PatternLabScreen.contract'
import qualityDashboardLayoutContract from '../screens/QualityDashboard/QualityDashboardScreen.contract'
import typographyTokensLabLayoutContract from '../screens/TypographyTokensLab/TypographyTokensLabScreen.contract'

/**
 * Internal design/QA review surfaces.
 *
 * Built ONLY when `import.meta.env.DEV` (see routeRegistry.ts). This is a
 * FUNCTION, not a top-level object, on purpose: the `lazy(() => import(...))`
 * calls must not run at module-evaluation time, or Rollup treats them as a
 * module side effect and keeps the module — and every lab chunk — in the
 * production bundle even though nothing routable references it. Deferring them
 * into a function body that the production build never calls lets Rollup
 * tree-shake this module (and its lazy chunks) out of `dist` entirely. The Labs
 * and Quality Dashboard are therefore not shipped at all in production, not
 * merely gated at render (R-012 / R-021 / IP-08).
 */
export function buildDevRoutes() {
  const ControlsLabScreen = lazy(() => import('../screens/ControlsLab/ControlsLabScreen'))
  const EditorPanelsLabScreen = lazy(() => import('../screens/EditorPanelsLab/EditorPanelsLabScreen'))
  const FoundationLabScreen = lazy(() => import('../screens/FoundationLab/FoundationLabScreen'))
  const MotionInteractionLabScreen = lazy(() => import('../screens/MotionInteractionLab/MotionInteractionLabScreen'))
  const PatternLabScreen = lazy(() => import('../screens/PatternLab/PatternLabScreen'))
  const TypographyTokensLabScreen = lazy(() => import('../screens/TypographyTokensLab/TypographyTokensLabScreen'))
  const QualityDashboardScreen = lazy(() => import('../screens/QualityDashboard/QualityDashboardScreen'))

  return {
  foundationLab: {
    id: 'foundationLab',
    label: 'Foundation Lab',
    component: FoundationLabScreen,
    layoutContract: foundationLabLayoutContract,
    shell: {
      showRail: false,
      header: {
        modeLabel: 'Foundation Lab',
        description: 'Internal review surface for V2 generics',
      },
      rail: {
        visible: false,
        groupId: 'foundationLab',
        label: 'Foundation Lab',
        shortLabel: 'FL',
        order: 5,
        routeId: 'foundationLab',
      },
    },
  },
  controlsLab: {
    id: 'controlsLab',
    label: 'Controls Lab',
    component: ControlsLabScreen,
    layoutContract: controlsLabLayoutContract,
    shell: {
      showRail: false,
      header: {
        modeLabel: 'Controls Lab',
        description: 'Visual review board for buttons, controls, and action rows',
      },
      rail: {
        visible: false,
        groupId: 'foundationLab',
        label: 'Controls Lab',
        shortLabel: 'CL',
        order: 6,
        routeId: 'controlsLab',
      },
    },
  },
  editorPanelsLab: {
    id: 'editorPanelsLab',
    label: 'Editor + Panels Lab',
    component: EditorPanelsLabScreen,
    layoutContract: editorPanelsLabLayoutContract,
    shell: {
      showRail: false,
      header: {
        modeLabel: 'Editor + Panels Lab',
        description: 'Visual review board for editor, panel, and casing families',
      },
      rail: {
        visible: false,
        groupId: 'foundationLab',
        label: 'Editor + Panels Lab',
        shortLabel: 'EP',
        order: 7,
        routeId: 'editorPanelsLab',
      },
    },
  },
  typographyTokensLab: {
    id: 'typographyTokensLab',
    label: 'Typography + Tokens Lab',
    component: TypographyTokensLabScreen,
    layoutContract: typographyTokensLabLayoutContract,
    shell: {
      showRail: false,
      header: {
        modeLabel: 'Typography + Tokens Lab',
        description: 'Visual review board for type, color, surface, and backdrop language',
      },
      rail: {
        visible: false,
        groupId: 'foundationLab',
        label: 'Typography + Tokens Lab',
        shortLabel: 'TT',
        order: 8,
        routeId: 'typographyTokensLab',
      },
    },
  },
  motionInteractionLab: {
    id: 'motionInteractionLab',
    label: 'Motion + Interaction Lab',
    component: MotionInteractionLabScreen,
    layoutContract: motionInteractionLabLayoutContract,
    shell: {
      showRail: false,
      header: {
        modeLabel: 'Motion + Interaction Lab',
        description: 'Visual review board for motion language and behavior rules',
      },
      rail: {
        visible: false,
        groupId: 'foundationLab',
        label: 'Motion + Interaction Lab',
        shortLabel: 'MI',
        order: 9,
        routeId: 'motionInteractionLab',
      },
    },
  },
  patternLab: {
    id: 'patternLab',
    label: 'Pattern Lab',
    component: PatternLabScreen,
    layoutContract: patternLabLayoutContract,
    shell: {
      showRail: false,
      header: {
        modeLabel: 'Pattern Lab',
        description: 'Visual review board for repeated mode-level compositions',
      },
      rail: {
        visible: false,
        groupId: 'foundationLab',
        label: 'Pattern Lab',
        shortLabel: 'PL',
        order: 10,
        routeId: 'patternLab',
      },
    },
  },
  qualityDashboard: {
    id: 'qualityDashboard',
    label: 'Quality Dashboard',
    component: QualityDashboardScreen,
    layoutContract: qualityDashboardLayoutContract,
    shell: {
      showRail: false,
      header: {
        modeLabel: 'Quality Dashboard',
        description: 'Hybrid health board for static repo audit and rendered QA',
      },
      rail: {
        visible: false,
        groupId: 'foundationLab',
        label: 'Quality Dashboard',
        shortLabel: 'QD',
        order: 11,
        routeId: 'qualityDashboard',
      },
    },
    },
  }
}
