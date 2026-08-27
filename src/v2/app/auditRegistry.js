export const coreProductRouteIds = [
  'projectHome',
  'projects',
  'projectResearch',
  'segmentationPasteNext',
  'segmentationLoading',
  'segmentationReview',
  'studyWorkspace',
  'exams',
]

export const coreProductScreenDirs = [
  'ProjectHome',
  'Projects',
  'ProjectResearch',
  'SegmentationPasteNext',
  'SegmentationLoading',
  'SegmentationReview',
  'StudyWorkspace',
  'Exams',
]

export const ignoredAuditScreenDirs = [
  'AppLaunch',
  'ControlsLab',
  'EditorPanelsLab',
  'FoundationLab',
  'MotionInteractionLab',
  'PatternLab',
  'QualityDashboard',
  'SegmentationPaste',
  'TypographyTokensLab',
]

export const sharedFoundationIncludeRoots = [
  'src/v2/foundation/layout',
  'src/v2/foundation/primitives',
  'src/v2/foundation/tokens',
]

export const sharedFoundationExcludedPaths = [
  'src/v2/foundation/debug/',
  'src/v2/foundation/lab-previews/',
  'src/v2/foundation/primitives/LabBoard.jsx',
  'src/v2/foundation/layout/createLabBoardContract.ts',
]

export default {
  coreProductRouteIds,
  coreProductScreenDirs,
  ignoredAuditScreenDirs,
  sharedFoundationIncludeRoots,
  sharedFoundationExcludedPaths,
}
