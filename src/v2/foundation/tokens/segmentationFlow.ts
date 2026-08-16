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
  actionRegionWash:
    'linear-gradient(180deg, rgba(238, 244, 250, 0) 0%, rgba(238, 244, 250, 0.84) 24%, rgba(238, 244, 250, 0.98) 100%)',
} as const

export const segmentationFlowTypography = {
  pageTitleFontSize: `clamp(${typography.cardTitle.fontSize}, 3.3vw, ${typography.displayTitle.fontSize})`,
  ceremonialTitleFontSize: `clamp(${typography.displayTitle.fontSize}, 5vw, calc(${typography.displayTitle.fontSize} + ${spacing[16]}))`,
  actionTitleFontSize: `clamp(${typography.cardTitle.fontSize}, 3vw, ${typography.displayTitle.fontSize})`,
  panelHeaderTitleFontSize: '13px',
  panelHeaderTitleWeight: 650,
  operationalMetaFontSize: '11px', // raised to the 11px type floor
  toolbarSelectionFontSize: '14px',
  compactActionWeight: typography.ctaLabel.fontWeight,
  sourcePreviewFontSize: '17px',
  segmentCardFontSize: '16px',
  markerInputFontSize: '12.5px',
  leadLineHeight: 1.7,
  sourceLineHeight: 1.75,
  sourcePreviewLineHeight: 1.8,
  segmentCardLineHeight: 1.85,
  markerInputWeight: 600,
  successStatValueWeight: 500,
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

export const segmentationFlowMetrics = {
  centeredMargin: '0 auto',
  pagePadding: `clamp(${spacing[24]}, 5vh, ${spacing[64]}) clamp(${spacing[24]}, 4vw, ${spacing[48]})`,
  reviewPagePadding: `${spacing[16]} clamp(${spacing[24]}, 4vw, ${spacing[48]}) ${spacing[64]}`,
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
  reviewToolbarGutterGap: spacing[16],
  // Sticky top is relative to the body scrollport, whose top already sits below the shell header.
  reviewWorkspaceStickyTop: spacing[16],
  reviewCommandBarMaxWidth: '920px',
  reviewSelectedToolbarMinHeight: '52px',
  reviewSummaryPillMinHeight: '32px',
  reviewToolButtonMinHeight: '32px',
  reviewMarkerRailMinWidth: '240px',
  reviewMarkerRailMaxWidth: '320px',
  reviewToolbarRailWidth: '64px',
  reviewMarkerRowMinHeight: '40px',
  reviewSegmentCardMinWidth: '300px',
  bridgePulseDelay: '900ms',
  markerPulseDelays: ['0ms', '300ms', '600ms'],
  chipFlightDelays: ['0ms', '300ms', '600ms'],
  segmentRevealDelays: ['120ms', '200ms', '280ms'],
} as const
