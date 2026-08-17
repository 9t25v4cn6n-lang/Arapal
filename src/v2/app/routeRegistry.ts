import { lazy } from 'react'
import controlsLabLayoutContract from '../screens/ControlsLab/ControlsLabScreen.contract'
import editorPanelsLabLayoutContract from '../screens/EditorPanelsLab/EditorPanelsLabScreen.contract'
import foundationLabLayoutContract from '../screens/FoundationLab/FoundationLabScreen.contract'
import motionInteractionLabLayoutContract from '../screens/MotionInteractionLab/MotionInteractionLabScreen.contract'
import patternLabLayoutContract from '../screens/PatternLab/PatternLabScreen.contract'
import qualityDashboardLayoutContract from '../screens/QualityDashboard/QualityDashboardScreen.contract'
import ProjectHomeScreen from '../screens/ProjectHome/ProjectHomeScreen'
import projectHomeLayoutContract from '../screens/ProjectHome/ProjectHomeScreen.contract'
import ProjectsScreen from '../screens/Projects/ProjectsScreen'
import projectsLayoutContract from '../screens/Projects/ProjectsScreen.contract'
import ProjectResearchScreen from '../screens/ProjectResearch/ProjectResearchScreen'
import projectResearchLayoutContract from '../screens/ProjectResearch/ProjectResearchScreen.contract'
import SegmentationPasteNextScreen from '../screens/SegmentationPasteNext/SegmentationPasteNextScreen'
import segmentationPasteNextLayoutContract from '../screens/SegmentationPasteNext/SegmentationPasteNextScreen.contract'
import SegmentationTransitionScreen from '../screens/SegmentationTransition/SegmentationTransitionScreen'
import segmentationTransitionLayoutContract from '../screens/SegmentationTransition/SegmentationTransitionScreen.contract'
import SegmentationLoadingScreen from '../screens/SegmentationLoading/SegmentationLoadingScreen'
import segmentationLoadingLayoutContract from '../screens/SegmentationLoading/SegmentationLoadingScreen.contract'
import SegmentationReviewScreen from '../screens/SegmentationReview/SegmentationReviewScreen'
import segmentationReviewLayoutContract from '../screens/SegmentationReview/SegmentationReviewScreen.contract'
import SegmentationSuccessScreen from '../screens/SegmentationSuccess/SegmentationSuccessScreen'
import segmentationSuccessLayoutContract from '../screens/SegmentationSuccess/SegmentationSuccessScreen.contract'
import StudyWorkspaceScreen from '../screens/StudyWorkspace/StudyWorkspaceScreen'
import studyWorkspaceLayoutContract from '../screens/StudyWorkspace/StudyWorkspaceScreen.contract'
import typographyTokensLabLayoutContract from '../screens/TypographyTokensLab/TypographyTokensLabScreen.contract'

const ControlsLabScreen = lazy(() => import('../screens/ControlsLab/ControlsLabScreen'))

const EditorPanelsLabScreen = lazy(() => import('../screens/EditorPanelsLab/EditorPanelsLabScreen'))

const FoundationLabScreen = lazy(() => import('../screens/FoundationLab/FoundationLabScreen'))

const MotionInteractionLabScreen = lazy(() => import('../screens/MotionInteractionLab/MotionInteractionLabScreen'))

const PatternLabScreen = lazy(() => import('../screens/PatternLab/PatternLabScreen'))

const TypographyTokensLabScreen = lazy(() => import('../screens/TypographyTokensLab/TypographyTokensLabScreen'))

const QualityDashboardScreen = lazy(() => import('../screens/QualityDashboard/QualityDashboardScreen'))

export const routeRegistry = {
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
  projectHome: {
    id: 'projectHome',
    label: 'Project Home',
    component: ProjectHomeScreen,
    layoutContract: projectHomeLayoutContract,
    shell: {
      showRail: true,
      header: {
        modeLabel: 'Project Home',
        description: 'Your work and one clear next action',
      },
      rail: {
        visible: true,
        groupId: 'projectHome',
        label: 'Project Home',
        shortLabel: 'PH',
        iconKey: 'projectHome',
        order: 10,
        routeId: 'projectHome',
      },
    },
  },

  projects: {
    id: 'projects',
    label: 'Projects',
    component: ProjectsScreen,
    layoutContract: projectsLayoutContract,
    shell: {
      showRail: true,
      header: {
        modeLabel: 'Projects',
        description: 'Project index and browsing',
      },
      rail: {
        visible: true,
        groupId: 'projects',
        label: 'Projects',
        shortLabel: 'PR',
        iconKey: 'projects',
        order: 20,
        routeId: 'projects',
      },
    },
  },
  projectResearch: {
    id: 'projectResearch',
    label: 'Project Research',
    component: ProjectResearchScreen,
    layoutContract: projectResearchLayoutContract,
    shell: {
      showRail: true,
      header: {
        modeLabel: 'Research Workspace',
        description: 'Search and inspect project knowledge',
      },
      rail: {
        visible: true,
        groupId: 'projects',
        label: 'Project Research',
        shortLabel: 'RX',
        iconKey: 'projects',
        order: 21,
        routeId: 'projectResearch',
      },
    },
  },
  segmentationPasteNext: {
    id: 'segmentationPasteNext',
    label: 'Segmentation Paste Next',
    component: SegmentationPasteNextScreen,
    layoutContract: segmentationPasteNextLayoutContract,
    shell: {
      showRail: true,
      header: {
        modeLabel: 'Source + Segmentation',
        description: 'Parallel rebuild review route',
      },
      rail: {
        visible: true,
        groupId: 'segmentation',
        label: 'Source + Segmentation',
        shortLabel: 'SG',
        iconKey: 'segmentation',
        order: 40,
        routeId: 'segmentationPasteNext',
      },
    },
  },
  segmentationTransition: {
    id: 'segmentationTransition',
    label: 'Segmentation Transition',
    component: SegmentationTransitionScreen,
    layoutContract: segmentationTransitionLayoutContract,
    shell: {
      showRail: true,
      header: {
        modeLabel: 'Source + Segmentation',
        description: 'Animate the handoff into processing',
      },
      rail: {
        visible: false,
        groupId: 'segmentation',
        label: 'Source + Segmentation',
        shortLabel: 'SG',
        iconKey: 'segmentation',
        order: 40,
        routeId: 'segmentationPaste',
      },
    },
  },
  segmentationLoading: {
    id: 'segmentationLoading',
    label: 'Segmentation Loading',
    component: SegmentationLoadingScreen,
    layoutContract: segmentationLoadingLayoutContract,
    shell: {
      showRail: true,
      header: {
        modeLabel: 'Source + Segmentation',
        description: 'Preparing the proposal workspace',
      },
      rail: {
        visible: false,
        groupId: 'segmentation',
        label: 'Source + Segmentation',
        shortLabel: 'SG',
        iconKey: 'segmentation',
        order: 40,
        routeId: 'segmentationPaste',
      },
    },
  },
  segmentationReview: {
    id: 'segmentationReview',
    label: 'Segmentation Review',
    component: SegmentationReviewScreen,
    layoutContract: segmentationReviewLayoutContract,
    shell: {
      showRail: true,
      header: {
        modeLabel: 'Source + Segmentation',
        description: 'Review and approve segmentation',
      },
      rail: {
        visible: false,
        groupId: 'segmentation',
        label: 'Source + Segmentation',
        shortLabel: 'SG',
        iconKey: 'segmentation',
        order: 40,
        routeId: 'segmentationPaste',
      },
    },
  },
  segmentationSuccess: {
    id: 'segmentationSuccess',
    label: 'Segmentation Success',
    component: SegmentationSuccessScreen,
    layoutContract: segmentationSuccessLayoutContract,
    shell: {
      showRail: true,
      header: {
        modeLabel: 'Source + Segmentation',
        description: 'Published and ready to continue',
      },
      rail: {
        visible: false,
        groupId: 'segmentation',
        label: 'Source + Segmentation',
        shortLabel: 'SG',
        iconKey: 'segmentation',
        order: 40,
        routeId: 'segmentationPaste',
      },
    },
  },
  studyWorkspace: {
    id: 'studyWorkspace',
    label: 'Study Workspace',
    component: StudyWorkspaceScreen,
    layoutContract: studyWorkspaceLayoutContract,
    shell: {
      showRail: true,
      header: {
        modeLabel: 'Study Workspace',
        description: 'Stable anchor for segment work',
      },
      rail: {
        visible: true,
        groupId: 'studyWorkspace',
        label: 'Study Workspace',
        shortLabel: 'SW',
        iconKey: 'study',
        order: 30,
        routeId: 'studyWorkspace',
      },
    },
  },

  /**
   * Exams — a rail destination with no V2 screen behind it, on purpose.
   *
   * Exams is production (§2.1 preserves the working legacy capability until a V2
   * replacement reaches parity) but exists only on the legacy hash. Nothing in
   * the V2 surface linked to it: no rail entry, no button, no link anywhere, so
   * the shipping assessment capability was reachable only by typing #exams. A
   * whole product area behind a URL nobody is told about is a dead end.
   *
   * `externalHash` sends the rail out to the legacy route. The entry carries no
   * component because there is no V2 Exams to render, and AppV2 treats a
   * component-less entry as unroutable so `#v2/exams` cannot resolve to it.
   * When V2 Exams exists this becomes an ordinary entry and externalHash goes.
   */
  exams: {
    id: 'exams',
    label: 'Exams',
    shell: {
      rail: {
        visible: true,
        groupId: 'exams',
        label: 'Exams',
        shortLabel: 'EX',
        iconKey: 'exams',
        order: 50,
        externalHash: 'exams',
      },
    },
  },
}

export const defaultRouteId = 'projectHome'

export function getPrimaryRailRoutes() {
  return Object.values(routeRegistry)
    .filter((route) => route.shell?.rail?.visible)
    .sort((left, right) => (left.shell?.rail?.order ?? 0) - (right.shell?.rail?.order ?? 0))
}
