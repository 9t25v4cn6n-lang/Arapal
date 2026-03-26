import AppLaunchScreen from '../screens/AppLaunch/AppLaunchScreen'
import appLaunchLayoutContract from '../screens/AppLaunch/AppLaunchScreen.contract'
import FoundationLabScreen from '../screens/FoundationLab/FoundationLabScreen'
import foundationLabLayoutContract from '../screens/FoundationLab/FoundationLabScreen.contract'
import ProjectHomeScreen from '../screens/ProjectHome/ProjectHomeScreen'
import projectHomeLayoutContract from '../screens/ProjectHome/ProjectHomeScreen.contract'
import ProjectsScreen from '../screens/Projects/ProjectsScreen'
import projectsLayoutContract from '../screens/Projects/ProjectsScreen.contract'
import SegmentationPasteScreen from '../screens/SegmentationPaste/SegmentationPasteScreen'
import segmentationPasteLayoutContract from '../screens/SegmentationPaste/SegmentationPasteScreen.contract'
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
import ExamsScreen from '../screens/Exams/ExamsScreen'
import examsLayoutContract from '../screens/Exams/ExamsScreen.contract'

export const routeRegistry = {
  appLaunch: {
    id: 'appLaunch',
    label: 'App Launch',
    component: AppLaunchScreen,
    layoutContract: appLaunchLayoutContract,
    shell: {
      showRail: false,
      header: {
        modeLabel: 'App Launch',
        description: 'Fresh contract-driven build',
      },
      rail: {
        visible: false,
        groupId: 'appLaunch',
        label: 'App Launch',
        shortLabel: 'AL',
        order: 0,
        routeId: 'appLaunch',
      },
    },
  },
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
  projectHome: {
    id: 'projectHome',
    label: 'Project Home',
    component: ProjectHomeScreen,
    layoutContract: projectHomeLayoutContract,
    shell: {
      showRail: true,
      header: {
        modeLabel: 'Project Home',
        description: 'Command centre for active work',
      },
      rail: {
        visible: true,
        groupId: 'projectHome',
        label: 'Project Home',
        shortLabel: 'PH',
        iconKey: 'home',
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
  segmentationPaste: {
    id: 'segmentationPaste',
    label: 'Segmentation Paste',
    component: SegmentationPasteScreen,
    layoutContract: segmentationPasteLayoutContract,
    shell: {
      showRail: true,
      header: {
        modeLabel: 'Source + Segmentation',
        description: 'Preserve source and start proposal work',
      },
      rail: {
        visible: true,
        groupId: 'segmentation',
        label: 'Source + Segmentation',
        shortLabel: 'SG',
        iconKey: 'segmentation',
        order: 40,
        routeId: 'segmentationPaste',
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
  exams: {
    id: 'exams',
    label: 'Exams',
    component: ExamsScreen,
    layoutContract: examsLayoutContract,
    shell: {
      showRail: true,
      header: {
        modeLabel: 'Exams',
        description: 'Focused assessment and remediation',
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

export const defaultRouteId = 'appLaunch'

export function getPrimaryRailRoutes() {
  return Object.values(routeRegistry)
    .filter((route) => route.shell?.rail?.visible)
    .sort((left, right) => (left.shell?.rail?.order ?? 0) - (right.shell?.rail?.order ?? 0))
}
