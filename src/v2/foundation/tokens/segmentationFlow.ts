import { spacing } from './spacing'
import { typography } from './typography'

export const segmentationFlowChrome = {
  translucentShell:
    'radial-gradient(circle at 18% 18%, rgba(219, 234, 254, 0.68), transparent 22%), radial-gradient(circle at 82% 22%, rgba(191, 219, 254, 0.42), transparent 18%), linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(248, 251, 255, 0.88) 100%)',
  shellSurface:
    'linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 251, 255, 0.86) 100%)',
  panelSurface: 'rgba(255, 255, 255, 0.9)',
  panelHeaderSurface: 'rgba(248, 251, 255, 0.92)',
  insetSurface:
    'linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 251, 255, 0.9) 100%)',
  blueTintSurface: 'rgba(239, 246, 255, 0.78)',
  blueTintStrong: 'rgba(239, 246, 255, 0.95)',
  inspectionTintSurface: 'rgba(239, 246, 255, 0.84)',
  inspectionTintStrong: 'rgba(219, 234, 254, 0.9)',
  amberTintSurface: 'rgba(255, 251, 235, 0.92)',
  amberTintStrong: 'rgba(255, 247, 237, 0.98)',
  whitePillSurface: 'rgba(255, 255, 255, 0.92)',
  shellLine: 'rgba(219, 228, 239, 0.96)',
  panelLine: 'rgba(203, 213, 225, 0.54)',
  blueLine: 'rgba(191, 219, 254, 0.72)',
  blueLineStrong: 'rgba(147, 197, 253, 0.92)',
  inspectionLine: 'rgba(37, 99, 235, 0.28)',
  pulseLine: 'rgba(147, 197, 253, 0.34)',
  pulseLineFaint: 'rgba(147, 197, 253, 0.2)',
  amberLine: 'rgba(245, 158, 11, 0.22)',
  sectionPillSurface: 'rgba(255, 255, 255, 0.62)',
  windowDot: 'rgba(148, 163, 184, 0.28)',
  windowZoomDot: 'rgba(148, 163, 184, 0.18)',
  transparent: 'transparent',
  none: 'none',
  subtleShadow: '0 18px 36px rgba(15, 23, 42, 0.04)',
  sectionPillShadow: '0 10px 28px rgba(37, 99, 235, 0.08)',
  markerShadow: '0 10px 24px rgba(37, 99, 235, 0.12)',
  chipShadow: '0 14px 28px rgba(15, 23, 42, 0.08)',
  blueShadow: '0 22px 48px rgba(37, 99, 235, 0.16)',
  loadingSealShadow: '0 24px 56px rgba(37, 99, 235, 0.22)',
  successSealShadow: '0 28px 64px rgba(37, 99, 235, 0.22)',
  badgeShadow: '0 10px 22px rgba(15, 23, 42, 0.05)',
  amberShadow: '0 12px 28px rgba(217, 119, 6, 0.1)',
  secondaryButtonShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 10px 22px rgba(15,23,42,0.05)',
  bridgeBeam:
    'linear-gradient(90deg, rgba(37, 99, 235, 0.18) 0%, rgba(37, 99, 235, 0.36) 50%, rgba(37, 99, 235, 0.18) 100%)',
  bridgeCore:
    'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.96) 0%, rgba(219, 234, 254, 0.92) 24%, rgba(37, 99, 235, 0.16) 100%)',
  // Reaches full opacity early and stays there. The first version held 0.84 at
  // 24% and 0.98 at the base, which on an 84px bar left the top third sheer
  // enough for the segment cards passing underneath to show through the tally
  // and the secondary action — so a deliberate dock read as a collision. A fade
  // is there to soften the entry, not to let two things share the same pixels.
  actionRegionWash:
    'linear-gradient(180deg, rgba(238, 244, 250, 0) 0%, rgba(238, 244, 250, 0.96) 16%, rgb(238, 244, 250) 38%, rgb(238, 244, 250) 100%)',
} as const

/**
 * Every size here is now a type ROLE rather than a viewport formula.
 *
 * The three title sizes used to be `clamp()` expressions whose middle terms were
 * vw units, so the flow's own headings rendered 43.2px, 47.52px and 66px at the
 * canonical 1440 frame — three sizes, none of them on the ramp, none of them
 * equal to the heading size of any other screen in the product. A screen title
 * is a role decision, not a function of window width; where a title genuinely
 * has to yield, the layout contract's mobile block is where it says so.
 */
export const segmentationFlowTypography = {
  pageTitleFontSize: typography.heroTitle.fontSize,
  ceremonialTitleFontSize: typography.displayTitle.fontSize,
  actionTitleFontSize: typography.heroTitle.fontSize,
  panelHeaderTitleFontSize: typography.subsectionTitle.fontSize,
  panelHeaderTitleWeight: typography.subsectionTitle.fontWeight,
  operationalMetaFontSize: typography.eyebrowLabel.fontSize,
  toolbarSelectionFontSize: typography.supportSubtext.fontSize,
  compactActionWeight: typography.ctaLabel.fontWeight,
  // The source is the principal object of this flow, so it reads at the Arabic
  // roles rather than at a size chosen to make a panel fit.
  sourcePreviewFontSize: typography.arabicCompact.fontSize,
  segmentCardFontSize: typography.arabicCompact.fontSize,
  markerInputFontSize: typography.supportSubtext.fontSize,
  leadLineHeight: 1.7,
  sourceLineHeight: 1.75,
  sourcePreviewLineHeight: typography.arabicCompact.lineHeight,
  segmentCardLineHeight: 1.85,
  markerInputWeight: typography.controlLabel.fontWeight,
  successStatValueWeight: typography.statValue.fontWeight,
} as const

export const segmentationFlowMotionStyles = `
  @keyframes arapal-seg-flow-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes arapal-seg-flow-scale-in {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes arapal-seg-flow-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes arapal-seg-flow-chip-flight {
    0% { opacity: 0; transform: translate3d(0, 0, 0) scale(0.88); }
    18% { opacity: 1; }
    55% { opacity: 1; transform: translate3d(66px, 0, 0) scale(1); }
    100% { opacity: 0; transform: translate3d(128px, 0, 0) scale(0.92); }
  }

  @keyframes arapal-seg-flow-bridge-pulse {
    0% { opacity: 0; transform: scale(0.9); }
    18% { opacity: 0.55; }
    100% { opacity: 0; transform: scale(1.16); }
  }

  @keyframes arapal-seg-flow-marker-pulse {
    0%, 100% { transform: scale(1); box-shadow: 0 10px 24px rgba(37, 99, 235, 0.12); }
    50% { transform: scale(1.08); box-shadow: 0 14px 32px rgba(37, 99, 235, 0.2); }
  }

  .arapal-seg-flow__fadeUp {
    animation: arapal-seg-flow-fade-up 450ms ease both;
  }

  .arapal-seg-flow__scaleIn {
    animation: arapal-seg-flow-scale-in 400ms ease both;
  }

  .arapal-seg-flow__spin {
    animation: arapal-seg-flow-spin 1000ms linear infinite;
  }

  .arapal-seg-flow__chipFlight {
    animation: arapal-seg-flow-chip-flight 2100ms ease-in-out infinite;
  }

  .arapal-seg-flow__bridgePulse {
    animation: arapal-seg-flow-bridge-pulse 2400ms ease-out infinite;
  }

  .arapal-seg-flow__markerPulse {
    animation: arapal-seg-flow-marker-pulse 1800ms ease-in-out infinite;
  }
`

// The docked review toolbar's rail plus the gap between it and the content.
// Declared once, above the metrics, because two things must agree on it: the page
// padding that reserves the space, and the toolbar that moves into it. They
// disagreeing is what put the toolbar on top of the content.
const REVIEW_TOOLBAR_RAIL_WIDTH = '64px'
const REVIEW_TOOLBAR_GUTTER_GAP = spacing[16]
const REVIEW_TOOLBAR_GUTTER = `calc(${REVIEW_TOOLBAR_RAIL_WIDTH} + ${REVIEW_TOOLBAR_GUTTER_GAP})`

// Named so the toolbar's height budget is readable arithmetic instead of a magic
// number. The action bar is a 52px CTA inside 16px of padding.
const SHELL_HEADER_HEIGHT = '50px'
const REVIEW_ACTION_BAR_HEIGHT = `calc(52px + ${spacing[16]} + ${spacing[16]})`

/**
 * Source -> Review -> Publish. The flow's step model, and the only copy of it.
 *
 * It lived in SegmentationFlowPrimitives with a second, drifting copy inside the
 * paste screen — which is how the first screen of the flow came to say "Segment"
 * while the other four said "Review". Constants belong with the other flow
 * constants, not exported from a module of components, which also keeps fast
 * refresh working.
 */
export const segmentationFlowSteps = [
  { id: 'source', label: 'Source' },
  { id: 'review', label: 'Review' },
  { id: 'publish', label: 'Publish' },
] as const

export const segmentationFlowMetrics = {
  centeredMargin: '0 auto',
  pagePadding: `clamp(${spacing[24]}, 5vh, ${spacing[64]}) clamp(${spacing[24]}, 4vw, ${spacing[48]})`,
  // Four values, because the inline-end inset is not the inline-start one: the
  // end reserves the docked toolbar's rail. Without that reservation the rail had
  // nowhere to be — the toolbar tried to escape into the page margin using a
  // translateX derived from (100vw - 1400px) / 2, which at the canonical 1440
  // viewport offers 20px against the 80px the rail needs, so it stayed put, on
  // top of the segment proposal's group headers and card edges. Reserved in the
  // layout rather than guessed from the viewport.
  reviewPagePadding: [
    spacing[16],
    `calc(clamp(${spacing[24]}, 4vw, ${spacing[48]}) + ${REVIEW_TOOLBAR_GUTTER})`,
    spacing[64],
    `clamp(${spacing[24]}, 4vw, ${spacing[48]})`,
  ].join(' '),
  transitionShellPadding: `clamp(${spacing[32]}, 4vw, ${spacing[48]})`,
  loadingAdvanceDelayMs: 1200,
  transitionAdvanceDelayMs: 2200,
  sectionPillHeight: '26px',
  sectionPillDotSize: '6px',
  windowDotSize: '8px',
  windowZoomDotWidth: '20px',
  markerNudgeRight: '-11px',
  transitionMarkerSize: '22px',
  transitionBridgeBeamWidth: '140px',
  transitionBridgeCoreSize: '112px',
  transitionChipMinWidth: '88px',
  loadingSealSize: '108px',
  successSealSize: '132px',
  compactSourcePreviewMaxHeight: `calc(${spacing[32]} + ${spacing[32]})`,
  expandedSourcePreviewMaxHeight: '220px',
  reviewWorkspaceMinHeight: '520px',
  reviewToolbarGutterGap: REVIEW_TOOLBAR_GUTTER_GAP,
  // Vertical chrome the docked toolbar shares its lane with, so its max height
  // can be derived rather than guessed: the shell header, the review page's top
  // inset, and the action bar plus the clearance beneath it.
  // Exported so the review contract can position the fixed toolbar under the
  // header without restating the number.
  shellHeaderHeight: SHELL_HEADER_HEIGHT,
  reviewToolbarViewportReserve: `calc(${SHELL_HEADER_HEIGHT} + ${spacing[16]} + ${REVIEW_ACTION_BAR_HEIGHT} + ${spacing[24]})`,
  // Trailing space under the review workboard so the last segment card can be
  // scrolled clear of the docked action bar.
  //
  // Only the shortfall, not the bar's full height: the proposal panel already
  // ends with its own padding, so reserving the whole 84px bar on top of that
  // left about 145px of dead background between the last card and the bar at
  // full scroll — clearance is the goal, a void is not.
  reviewActionBarClearance: spacing[24],
  // Sticky top is relative to the body scrollport, whose top already sits below the shell header.
  reviewWorkspaceStickyTop: spacing[16],
  reviewCommandBarMaxWidth: '920px',
  reviewSelectedToolbarMinHeight: '52px',
  reviewSummaryPillMinHeight: '32px',
  reviewToolButtonMinHeight: '32px',
  reviewMarkerRailMinWidth: '240px',
  reviewMarkerRailMaxWidth: '320px',
  reviewToolbarRailWidth: REVIEW_TOOLBAR_RAIL_WIDTH,
  // The reserved lane the docked toolbar occupies: rail + gap.
  reviewToolbarGutter: REVIEW_TOOLBAR_GUTTER,
  reviewMarkerRowMinHeight: '40px',
  reviewSegmentCardMinWidth: '300px',
  bridgePulseDelay: '900ms',
  markerPulseDelays: ['0ms', '300ms', '600ms'],
  chipFlightDelays: ['0ms', '300ms', '600ms'],
  segmentRevealDelays: ['120ms', '200ms', '280ms'],
} as const
