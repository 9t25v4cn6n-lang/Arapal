// Internal design/QA surfaces live in their own module and are spread in only
// under import.meta.env.DEV, so a production build tree-shakes them — and their
// lazy chunks — out of the bundle entirely (IP-08). See devRoutes.ts.
import { buildDevRoutes } from './devRoutes'
import ProjectHomeScreen from '../screens/ProjectHome/ProjectHomeScreen'
import projectHomeLayoutContract from '../screens/ProjectHome/ProjectHomeScreen.contract'
import ExamsScreen from '../screens/Exams/ExamsScreen'
import examsLayoutContract from '../screens/Exams/ExamsScreen.contract'
import ProjectsScreen from '../screens/Projects/ProjectsScreen'
import projectsLayoutContract from '../screens/Projects/ProjectsScreen.contract'
import ProjectResearchScreen from '../screens/ProjectResearch/ProjectResearchScreen'
import projectResearchLayoutContract from '../screens/ProjectResearch/ProjectResearchScreen.contract'
import SegmentationPasteNextScreen from '../screens/SegmentationPasteNext/SegmentationPasteNextScreen'
import segmentationPasteNextLayoutContract from '../screens/SegmentationPasteNext/SegmentationPasteNextScreen.contract'
import SegmentationLoadingScreen from '../screens/SegmentationLoading/SegmentationLoadingScreen'
import segmentationLoadingLayoutContract from '../screens/SegmentationLoading/SegmentationLoadingScreen.contract'
import SegmentationReviewScreen from '../screens/SegmentationReview/SegmentationReviewScreen'
import segmentationReviewLayoutContract from '../screens/SegmentationReview/SegmentationReviewScreen.contract'
import StudyWorkspaceScreen from '../screens/StudyWorkspace/StudyWorkspaceScreen'
import studyWorkspaceLayoutContract from '../screens/StudyWorkspace/StudyWorkspaceScreen.contract'

export const routeRegistry = {
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
        // Its own glyph, not Projects'. The rail is icon-only by default, so two
        // adjacent destinations sharing Layers3 were indistinguishable — you could
        // not tell Projects from Project Research without expanding the rail.
        iconKey: 'projectResearch',
        order: 21,
        routeId: 'projectResearch',
      },
    },
  },
  segmentationPasteNext: {
    id: 'segmentationPasteNext',
    label: 'Add source',
    component: SegmentationPasteNextScreen,
    layoutContract: segmentationPasteNextLayoutContract,
    shell: {
      showRail: true,
      header: {
        modeLabel: 'Add source',
        description: 'Preserve a source and propose study segments',
      },
      // Source + Segmentation is an ACTION on a project (Add source, New project,
      // Re-segment), not a permanent global destination competing with Study,
      // Research and Exams. It is launched from those affordances and stays
      // routable, but it no longer occupies a primary rail slot (Programme 2).
      rail: {
        visible: false,
        groupId: 'segmentation',
        label: 'Add source',
        shortLabel: 'SG',
        iconKey: 'segmentation',
        order: 40,
        routeId: 'segmentationPasteNext',
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

  exams: {
    id: 'exams',
    label: 'Exams',
    component: ExamsScreen,
    layoutContract: examsLayoutContract,
    shell: {
      showRail: true,
      header: {
        modeLabel: 'Exams',
        description: 'Scoped assessment and remediation',
      },
      rail: {
        visible: true,
        groupId: 'exams',
        label: 'Exams',
        shortLabel: 'EX',
        iconKey: 'exams',
        order: 50,
        routeId: 'exams',
      },
    },
  },
}

// DEV-only design/QA boards (Labs, Quality Dashboard). Attached only in
// development. Vite folds `import.meta.env.DEV` to a literal `false` in a
// production build, so Rollup dead-code-eliminates this whole block at
// bundle time — which drops the `devRoutes` import and tree-shakes every lazy
// lab chunk out of `dist`, rather than emitting them and gating them at render
// (IP-08). An `if (false)` block is eliminated before chunk emission; a dead
// ternary branch is not, which is why this is a statement and not a spread.
if (import.meta.env.DEV) {
  Object.assign(routeRegistry, buildDevRoutes())
}

export const defaultRouteId = 'projectHome'

export function getPrimaryRailRoutes() {
  return Object.values(routeRegistry)
    .filter((route) => route.shell?.rail?.visible)
    .sort((left, right) => (left.shell?.rail?.order ?? 0) - (right.shell?.rail?.order ?? 0))
}
