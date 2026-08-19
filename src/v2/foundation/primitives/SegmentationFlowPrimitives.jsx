import { useState } from 'react'
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Combine,
  Home,
  Merge,
  MoveHorizontal,
  PencilLine,
  Play,
  Redo2,
  Scissors,
  Sparkles,
  Trash2,
  Undo2,
} from 'lucide-react'
import BackPill from './BackPill'
import useIsMobileViewport from './useIsMobileViewport'
import { navigation } from '../../data'
import DockableToolbar, {
  DockableToolbarActionGroup,
  DockableToolbarDivider,
  DockableToolbarIconButton,
  DockableToolbarMenu,
  DockableToolbarMenuItem,
} from './DockableToolbar'
import PrimaryCTA from './PrimaryCTA'
import {
  getPostSegmentationRoute,
  readSegmentationFlowPreferences,
  saveSegmentationFlowPreferences,
} from './segmentationFlowState'
import StepBar, { StepNumberBadge } from './StepBar'
import {
  colors,
  elevation,
  motion,
  compactControl,
  radius,
  segmentationFlowChrome as flowChrome,
  segmentationFlowSteps,
  segmentationFlowMetrics as flowMetrics,
  segmentationFlowMotionStyles,
  segmentationFlowTypography as flowTypography,
  spacing,
  typography,
} from '../tokens'


const segmentationSourceText = `في بداية الربيع خرجت القافلة من المدينة قبل شروق الشمس.
وكانت السماء صافية والهواء بارداً على نحوٍ خفيف.
توقفت المجموعة عند البئر القديمة لتراجع المؤن وتتأكد من الطريق.`

const sourceBlocks = segmentationSourceText.split('\n')

const transitionSegments = [
  {
    id: '1',
    label: 'Segment 1',
    text: 'في بداية الربيع خرجت القافلة من المدينة قبل شروق الشمس.',
    reviewState: 'ready',
  },
  {
    id: '2',
    label: 'Segment 2',
    text: 'وكانت السماء صافية والهواء بارداً على نحوٍ خفيف.',
    reviewState: 'second-look',
  },
  {
    id: '3',
    label: 'Segment 3',
    text: 'توقفت المجموعة عند البئر القديمة لتراجع المؤن وتتأكد من الطريق.',
    reviewState: 'ready',
  },
]

const reviewSegments = [
  ...transitionSegments,
  {
    id: '4',
    label: 'Segment 4',
    text: 'ثم واصلوا السير عبر السهل الواسع حتى ظهرت أطراف الواحة.',
    reviewState: 'ready',
  },
  {
    id: '5',
    label: 'Segment 5',
    text: 'سجّل الكاتب أسماء الرفاق وعدد الدواب قبل أن يبرد النهار.',
    reviewState: 'needs-review',
  },
  {
    id: '6',
    label: 'Segment 6',
    text: 'كان الشيخ يشرح للفتية معنى الحذر في السفر الطويل.',
    reviewState: 'ready',
  },
  {
    id: '7',
    label: 'Segment 7',
    text: 'وعند الغروب اجتمعوا حول النار لتقسيم الحراسة.',
    reviewState: 'second-look',
  },
  {
    id: '8',
    label: 'Segment 8',
    text: 'قال الدليل إن الطريق آمن ما دامت النجوم واضحة.',
    reviewState: 'ready',
  },
  {
    id: '9',
    label: 'Segment 9',
    text: 'في الصباح التالي اتجهت القافلة نحو التلال البعيدة.',
    reviewState: 'ready',
  },
  {
    id: '10',
    label: 'Segment 10',
    text: 'وحمل كل واحد منهم نصيبه من الماء والتمر والكتب.',
    reviewState: 'ready',
  },
]

/**
 * Seed the review list. Prefers the segments the user actually just published;
 * falls back to the built-in proposal so the route stays inspectable on its own.
 */
export function createSegmentationReviewSegments(published) {
  if (published?.length) {
    return published.map((segment, index) => ({
      id: segment.id,
      label: segment.title || `Segment ${index + 1}`,
      text: segment.text,
      groupLabel: segment.chapterLabel || 'Proposed segments',
      reviewState: 'ready',
    }))
  }
  return reviewSegments.map((segment) => ({ ...segment }))
}

export function getSegmentationReviewSummary(segments) {
  const needsReview = segments.filter((segment) => segment.reviewState === 'needs-review').length
  const secondLook = segments.filter((segment) => segment.reviewState === 'second-look').length

  return {
    ready: segments.length - needsReview - secondLook,
    needsReview,
    secondLook,
    totalReview: needsReview + secondLook,
  }
}

const reviewSectionSize = 3

const reviewSectionTitles = [
  'Opening movement',
  'Route and supply check',
  'Camp rhythm',
  'Closing detail',
]

export function createSegmentationReviewGroupTitles() {
  return reviewSectionTitles.reduce((titles, title, index) => {
    titles[`meaning-group-${index + 1}`] = title
    return titles
  }, {})
}

function getReviewStateMeta(reviewState) {
  if (reviewState === 'needs-review') {
    return {
      label: 'Needs review',
      tone: 'review',
      description: 'AraPal marked this boundary or wording for a closer check.',
    }
  }

  if (reviewState === 'second-look') {
    return {
      label: 'Suggested check',
      tone: 'accent',
      description: 'Probably usable, but worth confirming before approval.',
    }
  }

  return {
    label: 'Ready',
    tone: 'success',
    description: 'No review flags on this segment.',
  }
}

function getReviewStateChrome(reviewState, selected = false) {
  if (reviewState === 'needs-review') {
    return {
      border: flowChrome.amberLine,
      background: flowChrome.amberTintSurface,
      headerBackground: flowChrome.amberTintStrong,
      // reviewStrong, not review: white on #D97706 measures 3.2:1, which is
      // below AA for an 11px badge number. On #B45309 it clears it.
      badgeBackground: colors.reviewStrong,
      badgeColor: colors.surfacePrimary,
      shadow: flowChrome.amberShadow,
    }
  }

  if (reviewState === 'second-look') {
    return {
      border: flowChrome.inspectionLine,
      background: flowChrome.inspectionTintSurface,
      headerBackground: flowChrome.inspectionTintStrong,
      badgeBackground: colors.accentWash,
      badgeColor: colors.accentStrong,
      shadow: flowChrome.badgeShadow,
    }
  }

  return {
    border: selected ? flowChrome.blueLineStrong : flowChrome.shellLine,
    background: colors.surfacePrimary,
    headerBackground: colors.surfaceSoft,
    badgeBackground: colors.accentBase,
    badgeColor: colors.surfacePrimary,
    shadow: flowChrome.none,
  }
}

function getSegmentationReviewGroups(segments, groupTitles = {}) {
  return segments.reduce((groups, segment, index) => {
    const sectionIndex = Math.floor(index / reviewSectionSize)
    const sectionNumber = sectionIndex + 1
    const itemNumber = (index % reviewSectionSize) + 1
    const groupId = `meaning-group-${sectionNumber}`

    if (!groups[sectionIndex]) {
      groups[sectionIndex] = {
        id: groupId,
        number: sectionNumber,
        title: groupTitles[groupId] ?? reviewSectionTitles[sectionIndex] ?? `Meaning group ${sectionNumber}`,
        segments: [],
      }
    }

    groups[sectionIndex].segments.push({
      ...segment,
      displayNumber: `${sectionNumber}.${itemNumber}`,
      stateMeta: getReviewStateMeta(segment.reviewState),
    })

    return groups
  }, [])
}

const flowType = {
  pageTitle: {
    margin: 0,
    color: colors.textStrong,
    fontFamily: typography.displayTitle.fontFamily,
    fontSize: flowTypography.pageTitleFontSize,
    lineHeight: typography.displayTitle.lineHeight,
    fontWeight: typography.displayTitle.fontWeight,
    letterSpacing: typography.displayTitle.letterSpacing,
    textWrap: 'balance',
  },
  ceremonialTitle: {
    margin: 0,
    color: colors.textStrong,
    fontFamily: typography.displayTitle.fontFamily,
    fontSize: flowTypography.ceremonialTitleFontSize,
    lineHeight: typography.displayTitle.lineHeight,
    fontWeight: typography.displayTitle.fontWeight,
    letterSpacing: typography.displayTitle.letterSpacing,
    textWrap: 'balance',
  },
  lead: {
    margin: 0,
    color: colors.textSoft,
    fontFamily: typography.supportSubtext.fontFamily,
    fontSize: typography.supportSubtext.fontSize,
    fontWeight: typography.supportSubtext.fontWeight,
    lineHeight: flowTypography.leadLineHeight,
    letterSpacing: '0.01em',
  },
  actionSummary: {
    margin: 0,
    color: colors.textSoft,
    fontFamily: typography.supportSubtext.fontFamily,
    fontSize: typography.supportSubtext.fontSize,
    fontWeight: typography.supportSubtext.fontWeight,
    lineHeight: typography.supportSubtext.lineHeight,
    letterSpacing: '0.01em',
  },
  panelHeaderTitle: {
    margin: 0,
    color: colors.textBody,
    fontFamily: typography.bodyText.fontFamily,
    fontSize: flowTypography.panelHeaderTitleFontSize,
    fontWeight: flowTypography.panelHeaderTitleWeight,
    lineHeight: typography.bodyText.lineHeight,
    letterSpacing: '0.02em',
  },
  arabicSourcePreview: {
    color: colors.textBody,
    fontFamily: typography.arabicSourceText.fontFamily,
    fontSize: flowTypography.sourcePreviewFontSize,
    lineHeight: flowTypography.sourcePreviewLineHeight,
  },
  arabicSegment: {
    color: colors.textBody,
    fontFamily: typography.arabicSourceText.fontFamily,
    fontSize: flowTypography.segmentCardFontSize,
    lineHeight: flowTypography.segmentCardLineHeight,
  },
  compactActionLabel: {
    ...typography.eyebrowLabel,
    fontSize: flowTypography.operationalMetaFontSize,
    lineHeight: 1.2,
    letterSpacing: '0.1em',
    fontWeight: flowTypography.compactActionWeight,
  },
  operationalMeta: {
    ...typography.eyebrowLabel,
    fontSize: flowTypography.operationalMetaFontSize,
    lineHeight: 1.2,
    letterSpacing: '0.1em',
    fontWeight: 650,
    // textMuted, and carried by the style rather than left to each call site.
    // Seven sites paired this style with textSoft, which clears 4.5:1 on white
    // and does not on the amber, blue and slate tinted panels these labels
    // actually sit on. Owning the colour here means the pairing is decided once.
    color: colors.textMuted,
  },
  toolbarSelection: {
    margin: 0,
    fontFamily: typography.bodyText.fontFamily,
    fontSize: flowTypography.toolbarSelectionFontSize,
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: '0.02em',
  },
  meta: {
    ...typography.eyebrowLabel,
    // textMuted for the same reason as operationalMeta: these labels sit on the
    // flow's tinted panels, where textSoft's 4.5:1-on-white becomes 4.4:1.
    color: colors.textMuted,
  },
}

/**
 * The flow's header: identity (from the shell) + Back, the step bar, nothing on
 * the end.
 *
 * The end lane used to carry a two-line "SOURCE INTAKE / SEGMENTATION NEXT"
 * badge. Two lines of tracked uppercase do not fit a 50px bar — the block ran
 * from 5px to 44px inside it, which is what reads as text colliding with the
 * lower boundary — and it was the fourth thing on the screen saying which mode
 * you were in, after the rail's highlighted destination, the step bar directly
 * beside it, and the page's own title. It said nothing and it did not fit.
 */
export function getSegmentationFlowHeaderSlots({
  shell,
  stepIndex,
  backRoute = 'segmentationPasteNext',
}) {
  return {
    Layer1_Header_StartLane: (
      <BackPill debugItem="back_pill" onClick={() => shell.navigate(backRoute)}>
        Back
      </BackPill>
    ),
    Layer1_Header_CenterLane: (
      <StepBar debugItem="step_bar" steps={segmentationFlowSteps} currentIndex={stepIndex} />
    ),
  }
}

function SectionPill({ children }) {
  return (
    <div
      data-debug-item="section_pill"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[8],
        width: 'max-content',
        maxWidth: '100%',
        minHeight: '26px',
        padding: `0 ${spacing[16]}`,
        borderRadius: radius.pill,
        background: flowChrome.sectionPillSurface,
        color: colors.accentBase,
        boxShadow: flowChrome.sectionPillShadow,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: '6px',
          height: '6px',
          borderRadius: radius.pill,
          background: colors.accentBase,
        }}
      />
      <span style={flowType.meta}>{children}</span>
    </div>
  )
}

function FlowPage({ children, centered = false, padded = true }) {
  return (
    <>
      <style>{segmentationFlowMotionStyles}</style>
      <section
        data-debug-item="segmentation_flow_page"
        style={{
          width: '100%',
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: centered ? 'center' : 'stretch',
          justifyContent: centered ? 'center' : 'flex-start',
          padding: padded ? flowMetrics.pagePadding : '0',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </section>
    </>
  )
}

/**
 * The flow's display type, stepped down at mobile.
 *
 * These roles are written inline, so a media query cannot reach them — which is
 * why "Paste your source text." rendered at its full desktop size in a 390px
 * frame and broke to one word per line, four lines tall, above a source editor
 * squeezed to a strip. The flow's stylesheet had no breakpoint at all.
 *
 * Width is an input here rather than a competing declaration, the same way
 * `useIsMobileViewport` is used everywhere else this file computes layout.
 */
function FlowTitle({ children, ceremonial = false, style = {} }) {
  const isMobile = useIsMobileViewport()
  const role = ceremonial ? flowType.ceremonialTitle : flowType.pageTitle

  return (
    <h1
      data-debug-item="flow_title"
      style={{
        ...role,
        ...(isMobile ? { fontSize: typography.pageTitle.fontSize, lineHeight: 1.15 } : null),
        ...style,
      }}
    >
      {children}
    </h1>
  )
}

function FlowLead({ children, style = {} }) {
  const isMobile = useIsMobileViewport()

  return (
    <p
      data-debug-item="flow_lead"
      style={{
        ...flowType.lead,
        ...(isMobile ? { fontSize: typography.bodyText.fontSize, lineHeight: 1.5 } : null),
        ...style,
      }}
    >
      {children}
    </p>
  )
}

function FlowSecondaryButton({ children, icon = null, onClick, variant = 'ghost', debugItem }) {
  const isPill = variant === 'pill'

  return (
    <button
      type="button"
      data-debug-item={debugItem}
      onClick={onClick}
      style={{
        border: isPill ? `1px solid ${flowChrome.shellLine}` : 'none',
        borderRadius: isPill ? radius.pill : 0,
        background: isPill ? flowChrome.whitePillSurface : 'transparent',
        color: colors.textSoft,
        // The ghost variant used to declare minHeight: 'auto', which rendered a
        // 13px-tall hit target — and because it was an inline style it also beat
        // the document-level 24px floor in index.css, so the one place that was
        // supposed to catch exactly this could not. 44px is the comfortable
        // target [DECISION]; the background is transparent, so the extra height
        // costs nothing visually and buys a target a person can actually hit.
        minHeight: isPill ? '48px' : '44px',
        minWidth: isPill ? '136px' : 0,
        padding: isPill ? `0 ${spacing[24]}` : '0',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[8],
        cursor: 'pointer',
        boxShadow: isPill ? flowChrome.secondaryButtonShadow : flowChrome.none,
        transition: `color ${motion.micro}, transform ${motion.micro}, border-color ${motion.micro}`,
        ...flowType.operationalMeta,
      }}
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}

function StatusPill({ children, value = null, tone = 'soft', size = 'default', debugItem }) {
  // successStrong/reviewStrong, not success/review: the token file records the
  // plain pair as "fills and icons only — both fail 4.5:1 as text", and this
  // pill's tone IS its text colour. "Needs review" was one of them.
  const toneColor = {
    success: colors.successStrong,
    review: colors.reviewStrong,
    accent: colors.accentStrong,
    soft: colors.textSoft,
  }[tone] ?? colors.textSoft
  const toneBorder = {
    review: flowChrome.amberLine,
    accent: flowChrome.inspectionLine,
  }[tone] ?? flowChrome.shellLine
  const toneBackground = {
    accent: flowChrome.inspectionTintSurface,
  }[tone] ?? flowChrome.whitePillSurface

  return (
    <span
      data-debug-item={debugItem}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[8],
        minHeight: size === 'compact' ? '24px' : flowMetrics.reviewSummaryPillMinHeight,
        padding: `0 ${spacing[12]}`,
        borderRadius: radius.pill,
        border: `1px solid ${toneBorder}`,
        background: toneBackground,
        boxShadow: flowChrome.badgeShadow,
        ...flowType.operationalMeta,
        color: toneColor,
      }}
    >
      {value !== null ? <strong>{value}</strong> : null}
      {children}
    </span>
  )
}

function WindowDots() {
  return (
    <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8] }}>
      {['close', 'minimize', 'zoom'].map((item) => (
        <span
          key={item}
          style={{
            width: item === 'zoom' ? '20px' : '8px',
            height: '8px',
            borderRadius: radius.pill,
            background: item === 'zoom' ? flowChrome.windowZoomDot : flowChrome.windowDot,
          }}
        />
      ))}
    </span>
  )
}

function FlowPanel({ title, barStart = null, barEnd = null, children, style = {}, bodyStyle = {}, debugItem }) {
  return (
    <section
      data-debug-item={debugItem}
      style={{
        border: `1px solid ${flowChrome.shellLine}`,
        borderRadius: radius[24],
        background: flowChrome.panelSurface,
        overflow: 'hidden',
        minWidth: 0,
        boxShadow: flowChrome.subtleShadow,
        ...style,
      }}
    >
      <div
        style={{
          minHeight: '52px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[12],
          padding: `${spacing[12]} ${spacing[20]}`,
          borderBottom: `1px solid ${flowChrome.panelLine}`,
          background: flowChrome.panelHeaderSurface,
        }}
      >
        {barStart ?? <span />}
        {title ? <span style={flowType.panelHeaderTitle}>{title}</span> : null}
        {barEnd ?? <span />}
      </div>
      <div style={bodyStyle}>{children}</div>
    </section>
  )
}

/**
 * The preserved source.
 *
 * This used to render the source as three separate cards even in the
 * "preserved" panel, which said the opposite of what the panel is for: the whole
 * promise is that the original is untouched and segmentation is a PROPOSAL
 * derived from it. Showing it pre-split meant the animation demonstrated the
 * source being transformed before the user had approved anything.
 *
 * It is now one continuous block, exactly as pasted. Where the proposal would
 * cut, a dashed rule and a marker sit ON the text — an annotation over the
 * original, which is what a proposed cut actually is. Nothing about the source
 * itself moves.
 */
function SourceParagraphs({ withMarkers = false }) {
  if (!withMarkers) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[16], padding: spacing[24] }}>
        {sourceBlocks.map((block, index) => (
          <div
            key={block}
            className="arapal-seg-flow__fadeUp"
            style={{
              padding: `${spacing[16]} ${spacing[20]}`,
              borderRadius: radius[16],
              border: `1px solid ${colors.lineSoft}`,
              background: flowChrome.insetSurface,
              minWidth: 0,
              animationDelay: flowMetrics.segmentRevealDelays[index] ?? flowMetrics.segmentRevealDelays[0],
            }}
          >
            <p dir="rtl" lang="ar" style={sourceParagraphStyle}>{block}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ padding: spacing[24] }}>
      <div
        style={{
          padding: `${spacing[16]} ${spacing[20]}`,
          borderRadius: radius[16],
          border: `1px solid ${colors.lineSoft}`,
          background: flowChrome.insetSurface,
          minWidth: 0,
        }}
      >
        {sourceBlocks.map((block, index) => (
          <div key={block} style={{ position: 'relative' }}>
            {index > 0 ? <ProposedCutRule delayIndex={index - 1} /> : null}
            <p
              dir="rtl"
              lang="ar"
              className="arapal-seg-flow__fadeUp"
              style={{
                ...sourceParagraphStyle,
                animationDelay: flowMetrics.segmentRevealDelays[index] ?? flowMetrics.segmentRevealDelays[0],
              }}
            >
              {block}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

const sourceParagraphStyle = {
  margin: 0,
  color: colors.textBody,
  fontFamily: typography.bodyText.fontFamily,
  fontSize: typography.bodyText.fontSize,
  lineHeight: flowTypography.sourceLineHeight,
  overflowWrap: 'anywhere',
}

/**
 * Where the proposal would cut — drawn ON the preserved text as an annotation.
 *
 * Dashed, because a proposed boundary is not a boundary yet. The marker sits
 * inside the panel rather than straddling its edge: at `right: -11px` it was
 * half-clipped by the panel's own `overflow: hidden`, so the affordance that was
 * meant to connect source to proposal rendered as a row of cut-off half-circles.
 */
function ProposedCutRule({ delayIndex }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: spacing[8],
        margin: `${spacing[12]} 0`,
      }}
    >
      <span style={{ flex: 1, borderTop: `1px dashed ${flowChrome.blueLineStrong}`, opacity: 0.7 }} />
      <span
        className="arapal-seg-flow__markerPulse"
        style={{
          width: '22px',
          height: '22px',
          flex: '0 0 auto',
          borderRadius: radius.pill,
          border: `1px solid ${flowChrome.blueLineStrong}`,
          background: flowChrome.whitePillSurface,
          color: colors.accentStrong,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: flowChrome.markerShadow,
          animationDelay: flowMetrics.markerPulseDelays[delayIndex] ?? flowMetrics.markerPulseDelays[0],
        }}
      >
        <Sparkles size={12} strokeWidth={1.9} />
      </span>
    </div>
  )
}

function TransitionBridge() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        minWidth: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '50%',
          right: '50%',
          width: '140px',
          height: '1px',
          background: flowChrome.bridgeBeam,
          transform: 'translateY(-50%)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '140px',
          height: '1px',
          background: flowChrome.bridgeBeam,
          transform: 'translateY(-50%)',
        }}
      />
      <div
        style={{
          position: 'relative',
          // Above the chips, so a chip crossing the core is OCCLUDED by it.
          // Chips and core were both centred in a 180px lane with a chip 112px
          // wide, so at rest all three sat on top of the core and read as a
          // collision rather than as motion. Passing behind is the same journey,
          // drawn with depth.
          zIndex: 2,
          width: '112px',
          height: '112px',
          borderRadius: radius.pill,
          border: `1px solid ${flowChrome.blueLineStrong}`,
          background: flowChrome.bridgeCore,
          color: colors.accentStrong,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: flowChrome.blueShadow,
        }}
      >
        <span
          className="arapal-seg-flow__bridgePulse"
          style={{
            position: 'absolute',
            inset: '-14px',
            borderRadius: radius.pill,
            border: `1px solid ${flowChrome.pulseLine}`,
          }}
        />
        <span
          className="arapal-seg-flow__bridgePulse"
          style={{
            position: 'absolute',
            inset: '-28px',
            borderRadius: radius.pill,
            border: `1px solid ${flowChrome.pulseLineFaint}`,
            animationDelay: flowMetrics.bridgePulseDelay,
          }}
        />
        <Sparkles size={26} strokeWidth={1.9} />
      </div>
      {/* Labelled from the SAME source as the proposal list, so the two can never
          drift apart again. They previously read "Segment 01" here and
          "Segment 1" three hundred pixels to the right, both on screen at once. */}
      {transitionSegments.map((segment, index) => (
        <span
          key={segment.id}
          className="arapal-seg-flow__chipFlight"
          style={{
            position: 'absolute',
            top: chipFlightTops[index] ?? chipFlightTops[0],
            // `left` only. A running animation's transform beats an inline one,
            // so a `translateX(-50%)` here was silently discarded the moment the
            // flight started — the chip was never centred, it just began at the
            // lane's midpoint and travelled right from there.
            left: 0,
            zIndex: 1,
            padding: `${spacing[8]} ${spacing[12]}`,
            borderRadius: radius.pill,
            border: `1px solid ${flowChrome.blueLineStrong}`,
            background: flowChrome.whitePillSurface,
            color: colors.accentStrong,
            textAlign: 'center',
            boxShadow: flowChrome.chipShadow,
            animationDelay: flowMetrics.chipFlightDelays[index] ?? flowMetrics.chipFlightDelays[0],
            ...flowType.meta,
          }}
        >
          {segment.label}
        </span>
      ))}
    </div>
  )
}

/** Spread wide enough that the three chips never stack on each other in flight. */
const chipFlightTops = ['22%', '46%', '70%']

function TransitionSegmentList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[16], padding: `${spacing[20]} ${spacing[20]}` }}>
      {transitionSegments.map((segment, index) => (
        <article
          key={segment.id}
          className="arapal-seg-flow__fadeUp"
          style={{
            borderRadius: radius[16],
            border: `1px solid ${flowChrome.blueLine}`,
            background: flowChrome.blueTintSurface,
            padding: `${spacing[16]} ${spacing[20]}`,
            minWidth: 0,
            animationDelay: flowMetrics.segmentRevealDelays[index] ?? flowMetrics.segmentRevealDelays[0],
          }}
        >
          {/* flowType.meta last would overwrite the colour, which is what had
              been happening: the chip title was meant to read as accent and
              rendered in the meta grey instead. */}
          <p style={{ margin: `0 0 ${spacing[8]}`, ...flowType.meta, color: colors.accentStrong }}>{segment.label}</p>
          <p
            dir="rtl"
            lang="ar"
            style={{
              margin: 0,
              color: colors.textBody,
              fontFamily: typography.bodyText.fontFamily,
              fontSize: typography.bodyText.fontSize,
              lineHeight: flowTypography.leadLineHeight,
              overflowWrap: 'anywhere',
            }}
          >
            {segment.text}
          </p>
        </article>
      ))}
    </div>
  )
}

/**
 * "Always skip this animation" is a PREFERENCE, not an action.
 *
 * It rendered as a ghost button — uppercase, letter-spaced, no border, no
 * surface — sitting beside a real Skip pill, so it read as explanatory text
 * describing the pill rather than as its own control. Nothing about it said it
 * could be clicked, and nothing said the choice would persist.
 *
 * A checkbox says both: it is obviously operable, and a checked box is
 * obviously a setting that stays checked. Skip remains the one-time action.
 */
function AlwaysSkipPreference({ checked, onChange }) {
  return (
    <label
      data-debug-item="always_skip_preference"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[8],
        minHeight: '44px',
        padding: `0 ${spacing[4]}`,
        color: colors.textSoft,
        cursor: 'pointer',
        ...flowType.operationalMeta,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        // Its own accessible name and its own hit area. Wrapping it in a <label>
        // gives it neither as far as the visual standard is concerned: the rule
        // measures the interactive element, and a 16px box inside a 44px label
        // is still a 16px target.
        aria-label="Always skip this animation"
        style={{
          width: `${compactControl.xs.heightPx}px`,
          height: `${compactControl.xs.heightPx}px`,
          flex: '0 0 auto',
          accentColor: colors.accentBase,
          cursor: 'pointer',
        }}
      />
      <span>Always skip this animation</span>
    </label>
  )
}

export function SegmentationTransitionView({ shell }) {
  const isMobile = useIsMobileViewport()
  const [alwaysSkip, setAlwaysSkip] = useState(
    () => readSegmentationFlowPreferences().showSegmentationTransition === false,
  )

  const handleAlwaysSkipChange = (nextChecked) => {
    setAlwaysSkip(nextChecked)
    const preferences = readSegmentationFlowPreferences()
    saveSegmentationFlowPreferences({
      ...preferences,
      showSegmentationTransition: !nextChecked,
    })
  }

  const handleSkip = () => {
    shell.navigate(getPostSegmentationRoute(readSegmentationFlowPreferences()))
  }

  return (
    <FlowPage centered>
      <div
        data-debug-item="transition_shell"
        style={{
          width: '100%',
          maxWidth: '1400px',
          border: `1px solid ${flowChrome.shellLine}`,
          borderRadius: radius[32],
          background: flowChrome.translucentShell,
          boxShadow: elevation.rest,
          // The page is the scroll owner; this shell must not be a second one.
          // `hidden` here meant that at 1366x768 and 1280x800 the shell cut 119px
          // off its own two panels while the page beneath it had room to scroll —
          // content hidden by a container that was only ever clipping to keep a
          // corner radius tidy. The radius still clips the shell's own gradient;
          // it no longer clips the panels inside it.
          overflow: 'visible',
          padding: flowMetrics.transitionShellPadding,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: spacing[24],
            flexWrap: 'wrap',
            marginBottom: spacing[40],
          }}
        >
          <div style={{ display: 'grid', gap: spacing[16], maxWidth: '640px', minWidth: 0 }}>
            <SectionPill>Segment</SectionPill>
            <div style={{ display: 'grid', gap: spacing[12] }}>
              <FlowTitle>Segmenting your text</FlowTitle>
              <FlowLead>
                AraPal is drafting a clean first pass so you can move straight into study or inspect the structure afterwards.
              </FlowLead>
            </div>
          </div>
          <div
            data-debug-item="transition_actions"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: spacing[16],
              flexWrap: 'wrap',
              paddingTop: spacing[4],
            }}
          >
            <AlwaysSkipPreference checked={alwaysSkip} onChange={handleAlwaysSkipChange} />
            <FlowSecondaryButton variant="pill" onClick={handleSkip} debugItem="skip_button">
              Skip
            </FlowSecondaryButton>
          </div>
        </div>

        <div
          data-debug-item="transition_visual"
          style={{
            display: 'grid',
            // The bridge lane must hold a chip plus its whole flight. At 144px it
            // could not, which is why the flight escaped into the next column.
            //
            // At mobile the three lanes cannot coexist at all: 176 + 320 of hard
            // minimums against a 390px frame squeezed the preserved-source panel
            // to a 0px track whose content kept its 152px and spilled. Source
            // over proposal, and the bridge — which only means anything as a
            // journey ACROSS — steps out.
            gridTemplateColumns: isMobile
              ? 'minmax(0, 1fr)'
              : 'minmax(0, 1.15fr) minmax(176px, 208px) minmax(320px, 0.95fr)',
            gap: spacing[32],
            alignItems: 'stretch',
          }}
        >
          <FlowPanel title="Preserved source" barStart={<WindowDots />} debugItem="preserved_source_panel">
            <SourceParagraphs withMarkers />
          </FlowPanel>
          {isMobile ? null : <TransitionBridge />}
          <FlowPanel
            title="AI proposal"
            barEnd={<Sparkles size={16} strokeWidth={1.9} color={colors.accentBase} />}
            debugItem="proposal_panel"
          >
            <TransitionSegmentList />
          </FlowPanel>
        </div>
      </div>
    </FlowPage>
  )
}

export function SegmentationLoadingView() {
  return (
    <FlowPage centered>
      <div
        data-debug-item="loading_content"
        className="arapal-seg-flow__scaleIn"
        style={{
          width: '100%',
          maxWidth: '820px',
          textAlign: 'center',
          display: 'grid',
          justifyItems: 'center',
          gap: spacing[24],
        }}
      >
        <div
          data-debug-item="loading_seal"
          className="arapal-seg-flow__spin"
          style={{
            width: '108px',
            height: '108px',
            borderRadius: radius.pill,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(180deg, ${colors.accentBase} 0%, ${colors.accentStrong} 100%)`,
            color: colors.surfacePrimary,
            boxShadow: flowChrome.loadingSealShadow,
          }}
        >
          <Sparkles size={40} strokeWidth={1.8} />
        </div>
        <div style={{ display: 'grid', gap: spacing[16], justifyItems: 'center' }}>
          <FlowTitle ceremonial style={{ fontSize: typography.displayTitle.fontSize }}>
            Preparing your segments
          </FlowTitle>
          <FlowLead style={{ maxWidth: '720px', textAlign: 'center', fontSize: typography.sectionTitle.fontSize }}>
            AraPal is preserving the structure and building a clean first pass for review.
          </FlowLead>
        </div>
      </div>
    </FlowPage>
  )
}

function CompactActionButton({ children, onClick, disabled = false, tone = 'default', debugItem }) {
  const isDanger = tone === 'danger'

  return (
    <button
      type="button"
      data-debug-item={debugItem}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation()
        onClick?.()
      }}
      style={{
        minHeight: flowMetrics.reviewToolButtonMinHeight,
        border: `1px solid ${isDanger ? flowChrome.amberLine : flowChrome.shellLine}`,
        borderRadius: radius.pill,
        background: disabled ? flowChrome.panelHeaderSurface : flowChrome.whitePillSurface,
        color: disabled ? colors.textFaint : isDanger ? colors.textSoft : colors.textBody,
        padding: `0 ${spacing[12]}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? flowChrome.none : flowChrome.badgeShadow,
        ...flowType.compactActionLabel,
      }}
    >
      {children}
    </button>
  )
}

function ProposalViewToggle({ value, onChange }) {
  return (
    <div
      data-debug-item="proposal_view_toggle"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[4],
        padding: spacing[4],
        border: `1px solid ${flowChrome.shellLine}`,
        borderRadius: radius.pill,
        background: flowChrome.whitePillSurface,
      }}
    >
      {['grid', 'list'].map((mode) => {
        const active = value === mode

        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange?.(mode)}
            style={{
              border: 'none',
              borderRadius: radius.pill,
              background: active ? colors.accentWash : flowChrome.transparent,
              color: active ? colors.accentStrong : colors.textSoft,
              padding: `${spacing[8]} ${spacing[12]}`,
              cursor: 'pointer',
              ...flowType.operationalMeta,
            }}
          >
            {mode}
          </button>
        )
      })}
    </div>
  )
}

function GroupTitleWarning() {
  const [open, setOpen] = useState(false)

  return (
    <span
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <button
        type="button"
        aria-label="Group title may need updating"
        onClick={(event) => {
          event.stopPropagation()
        }}
        style={{
          width: spacing[20],
          height: spacing[20],
          borderRadius: radius.pill,
          border: `1px solid ${flowChrome.amberLine}`,
          background: flowChrome.amberTintSurface,
          color: colors.review,
          cursor: 'help',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: typography.eyebrowLabel.fontFamily,
          fontSize: typography.eyebrowLabel.fontSize,
          fontWeight: typography.ctaLabel.fontWeight,
          lineHeight: typography.eyebrowLabel.lineHeight,
        }}
      >
        !
      </button>
      {open ? (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            top: `calc(100% + ${spacing[8]})`,
            left: 0,
            zIndex: 30,
            width: '220px',
            padding: spacing[12],
            borderRadius: radius[12],
            border: `1px solid ${flowChrome.amberLine}`,
            background: flowChrome.whitePillSurface,
            boxShadow: flowChrome.chipShadow,
            color: colors.textSoft,
            fontFamily: typography.supportSubtext.fontFamily,
            fontSize: typography.supportSubtext.fontSize,
            lineHeight: typography.supportSubtext.lineHeight,
            textTransform: 'none',
            letterSpacing: 0,
          }}
        >
          This title may no longer describe the merged segment range. Update it before approval.
        </span>
      ) : null}
    </span>
  )
}

// `compact` used to pick between a 150px and a 220px hardcoded width. Both are
// gone: the field and the label now take the width their row actually has, so
// there is nothing left for the caller to choose.
function GroupTitleInput({ group, stale = false, onChange }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(group.title)

  const commitTitle = () => {
    const nextTitle = draft.trim() || group.title

    setEditing(false)
    setDraft(nextTitle)

    if (nextTitle !== group.title) {
      onChange?.(group.id, nextTitle)
    }
  }

  const cancelEdit = () => {
    setEditing(false)
    setDraft(group.title)
  }

  return (
    <span
      data-debug-item="group_title_editor"
      style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8], minWidth: 0, flex: '1 1 auto' }}
    >
      <span style={{ ...flowType.operationalMeta, whiteSpace: 'nowrap' }}>
        {group.number}.
      </span>
      {editing ? (
        <input
          type="text"
          autoFocus
          value={draft}
          // The field had no accessible name and measured 200x21.4 — nameless to
          // a screen reader and under the 24px target floor.
          aria-label={`Rename meaning group ${group.number}`}
          data-debug-item="group_title_input"
          onClick={(event) => event.stopPropagation()}
          onFocus={(event) => event.target.select()}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitTitle}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              commitTitle()
            }

            if (event.key === 'Escape') {
              event.preventDefault()
              cancelEdit()
            }
          }}
          style={{
            minWidth: 0,
            // Was a fixed 150/220px. The field now takes the width the row
            // actually has, so editing a title cannot be narrower than reading
            // it, and neither is decided independently of the container.
            flex: '1 1 auto',
            width: 'auto',
            minHeight: spacing[24],
            border: `1px solid ${flowChrome.blueLine}`,
            borderRadius: radius[10],
            background: colors.surfacePrimary,
            color: colors.textBody,
            outline: 'none',
            padding: `${spacing[4]} ${spacing[8]}`,
            ...flowType.panelHeaderTitle,
          }}
        />
      ) : (
        <>
          <span
            data-debug-item="group_title_text"
            // The title is the user's own text, so an ellipsis is the design
            // once the row genuinely runs out — declared, not inferred.
            data-truncates=""
            style={{
              minWidth: 0,
              flex: '1 1 auto',
              color: colors.textBody,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              ...flowType.panelHeaderTitle,
            }}
          >
            {group.title}
          </span>
          <button
            type="button"
            aria-label={`Edit ${group.title} title`}
            title="Edit title"
            data-debug-item="group_title_edit_button"
            onClick={(event) => {
              event.stopPropagation()
              setDraft(group.title)
              setEditing(true)
            }}
            style={{
              // A hit target does not shrink. As a flex item with the default
              // shrink factor this 24px control resolved to 23px in a tight row
              // — one pixel under the floor, which is the whole difference
              // between a target and a near miss. Third instance of this in the
              // pass: the identity wordmark and Focus view both did it too.
              flex: '0 0 auto',
              width: spacing[24],
              height: spacing[24],
              border: `1px solid ${flowChrome.panelLine}`,
              borderRadius: radius.pill,
              background: flowChrome.whitePillSurface,
              color: colors.textSoft,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <PencilLine size={12} strokeWidth={1.9} />
          </button>
        </>
      )}
      {stale ? <GroupTitleWarning /> : null}
    </span>
  )
}

export function SegmentationReviewIntro({ summary }) {
  const segmentCount = summary.ready + summary.needsReview + summary.secondLook
  const checkLabel = summary.totalReview === 1 ? '1 suggested check' : `${summary.totalReview} suggested checks`

  return (
    <>
      <div style={{ display: 'grid', gap: spacing[16], maxWidth: '720px', minWidth: 0 }}>
        <SectionPill>Review</SectionPill>
        <div style={{ display: 'grid', gap: spacing[12] }}>
          <FlowTitle>Review & refine</FlowTitle>
          <FlowLead>
            Check AraPal’s proposed meaning groups, fix only the segments that need attention, then approve the structure for study.
          </FlowLead>
        </div>
        <span style={{ ...flowType.operationalMeta }}>
          Source preserved · {segmentCount} proposed segments · {checkLabel}
        </span>
      </div>

      <div
        data-debug-item="review_count_summary"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[12],
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
        }}
      >
        {/* Only states that actually occurred. A "0 NEEDS REVIEW" pill in review
            amber and a "0 SUGGESTED CHECK" pill in accent blue put two coloured
            markers on the screen for two things that are not happening — the eye
            goes to them and finds nothing. Same rule as the exam result summary. */}
        {[
          ['Ready', summary.ready, 'success'],
          ['Needs review', summary.needsReview, 'review'],
          ['Suggested check', summary.secondLook, 'accent'],
        ].filter(([, value]) => Number(value) > 0).map(([label, value, tone]) => (
          <StatusPill key={label} value={value} tone={tone}>
            {label}
          </StatusPill>
        ))}
      </div>
    </>
  )
}

export function SegmentationReviewSourceTray({ sourceMode, onSourceModeChange, onEditSource }) {
  return (
    <FlowPanel
      title={null}
      barStart={
        <span style={flowType.panelHeaderTitle}>
          Source text <span style={{ color: colors.textSoft }}>· 24 words</span>
        </span>
      }
      barEnd={
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[16], flexWrap: 'wrap' }}>
          <FlowSecondaryButton onClick={onEditSource}>Edit</FlowSecondaryButton>
          <FlowSecondaryButton
            onClick={() => onSourceModeChange(sourceMode === 'expanded' ? 'peek' : 'expanded')}
          >
            {sourceMode === 'expanded' ? 'Peek source' : sourceMode === 'collapsed' ? 'Show source' : 'Expand source'}
          </FlowSecondaryButton>
          {sourceMode !== 'collapsed' ? (
            <FlowSecondaryButton onClick={() => onSourceModeChange('collapsed')}>Hide</FlowSecondaryButton>
          ) : null}
        </div>
      }
      bodyStyle={{
        padding: sourceMode === 'collapsed' ? 0 : `${spacing[20]} ${spacing[24]}`,
      }}
      debugItem="source_preview_panel"
    >
      {sourceMode !== 'collapsed' ? (
        <div
          dir="rtl"
          lang="ar"
          style={{
            ...flowType.arabicSourcePreview,
            maxHeight:
              sourceMode === 'expanded'
                ? flowMetrics.expandedSourcePreviewMaxHeight
                : flowMetrics.compactSourcePreviewMaxHeight,
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
          }}
        >
          {segmentationSourceText}
        </div>
      ) : null}
    </FlowPanel>
  )
}

export function ReviewMarkerPanel({
  markers,
  selectedSegmentIds = [],
  groupTitles,
  staleGroupIds = [],
  onSelectSegment,
  onLabelChange,
  onGroupTitleChange,
  collapsedGroupIds,
  onToggleGroup,
}) {
  const groups = getSegmentationReviewGroups(markers, groupTitles)

  return (
    <FlowPanel
      title="Segment outline"
      barEnd={<span style={{ ...flowType.operationalMeta }}>{markers.length} segments</span>}
      bodyStyle={{ padding: `${spacing[16]} ${spacing[16]} ${spacing[20]}` }}
      style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}
      debugItem="marker_panel"
    >
      <div style={{ display: 'grid', gap: spacing[16] }}>
        {groups.map((group) => {
          const collapsed = collapsedGroupIds.includes(group.id)

          return (
            <section
              key={group.id}
              data-debug-item="review_outline_group"
              style={{
                display: 'grid',
                gap: spacing[8],
                paddingBottom: spacing[12],
                borderBottom: `1px solid ${flowChrome.panelLine}`,
              }}
            >
              <div
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: `0 0 ${spacing[4]}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: spacing[12],
                  color: colors.textSoft,
                  textAlign: 'left',
                }}
              >
                <GroupTitleInput
                  group={group}
                  stale={staleGroupIds.includes(group.id)}
                  onChange={onGroupTitleChange}
                />
                <button
                  type="button"
                  aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${group.title}`}
                  onClick={() => onToggleGroup(group.id)}
                  style={{
                    border: 'none',
                    background: flowChrome.transparent,
                    padding: spacing[4],
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // A 14px icon in 4px of padding measured 22x24 — two pixels
                    // under the WCAG 2.5.8 floor on all four chapter rows.
                    minWidth: spacing[24],
                    minHeight: spacing[24],
                    color: colors.textFaint,
                    cursor: 'pointer',
                  }}
                >
                  {collapsed ? <ChevronDown size={14} strokeWidth={1.9} /> : <ChevronUp size={14} strokeWidth={1.9} />}
                </button>
              </div>
              {collapsed ? null : (
                <div style={{ display: 'grid', gap: spacing[8] }}>
                  {group.segments.map((marker) => {
                    const flagged = marker.reviewState !== 'ready'
                    const selected = selectedSegmentIds.includes(marker.id)
                    const stateChrome = getReviewStateChrome(marker.reviewState, selected)

                    return (
                      <div
                        key={marker.id}
                        data-debug-item="review_marker_row"
                        data-segment-id={marker.id}
                        data-selected={selected ? 'true' : 'false'}
                        onClick={() => onSelectSegment(marker.id)}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: `${spacing[40]} minmax(0, 1fr)`,
                          alignItems: 'center',
                          gap: spacing[12],
                          border: `1px solid ${selected ? flowChrome.blueLineStrong : flowChrome.transparent}`,
                          borderRadius: radius[12],
                          background: selected ? flowChrome.blueTintSurface : flowChrome.insetSurface,
                          padding: `${spacing[8]} ${spacing[16]}`,
                          minHeight: flowMetrics.reviewMarkerRowMinHeight,
                          textAlign: 'left',
                          boxShadow: selected ? flowChrome.markerShadow : flowChrome.none,
                          cursor: 'pointer',
                        }}
                      >
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            onSelectSegment(marker.id)
                          }}
                          aria-label={`Select ${marker.displayNumber} ${marker.label}`}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            padding: 0,
                            display: 'inline-flex',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <StepNumberBadge
                            background={flagged ? stateChrome.badgeBackground : colors.accentWash}
                            color={flagged ? stateChrome.badgeColor : colors.accentStrong}
                            style={{ borderRadius: radius[12], width: spacing[40] }}
                          >
                            {marker.displayNumber}
                          </StepNumberBadge>
                        </button>
                        <input
                          type="text"
                          value={marker.label}
                          onChange={(event) => onLabelChange(marker.id, event.target.value)}
                          // Nameless to a screen reader, and 21.4px tall against
                          // the 24px target floor.
                          aria-label={`Rename segment ${marker.displayNumber ?? marker.id}`}
                          style={{
                            minWidth: 0,
                            minHeight: spacing[24],
                            border: 'none',
                            background: 'transparent',
                            color: colors.textBody,
                            fontFamily: typography.bodyText.fontFamily,
                            fontSize: flowTypography.markerInputFontSize,
                            fontWeight: flowTypography.markerInputWeight,
                            lineHeight: typography.bodyText.lineHeight,
                            outline: 'none',
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </FlowPanel>
  )
}

export function SegmentationReviewSelectedToolbar({
  selectedSegment,
  selectedSegments = [],
  selectedDisplayRange,
  activeTool,
  canUndo,
  canRedo,
  canSplitSelected,
  canMergeSelected,
  canMergeSelectedWithNext,
  canRemoveSelected,
  canRemoveToPrevious,
  canRemoveToNext,
  canMarkSelectedReady,
  removeMenuOpen,
  advancedEditMode,
  onToggleRemoveMenu,
  isFloating,
  onToggleFloating,
  onUndo,
  onRedo,
  onSplitSelected,
  onMergeSelected,
  onMergeSelectedWithNext,
  onAdjustBoundary,
  onMarkSelectedReady,
  onToggleAdvancedEdit,
  onRemoveSelected,
}) {
  const selectionCount = selectedSegments.length
  const hasSelection = selectionCount > 0
  const toolbarSubtitle = !hasSelection
    ? 'Select a continuous segment range'
    : selectionCount === 1
      ? `Editing ${selectedSegment.label}`
      : `Editing ${selectedDisplayRange} · ${selectionCount} segments`
  // Horizontal in both states. A vertical rail of nine unlabelled glyphs is the
  // shape that forced this palette out to the viewport edge in the first place;
  // laid along the axis the layout actually has spare, it fits above the work
  // and every action can carry its own name.
  const toolbarOrientation = 'horizontal'

  return (
    <DockableToolbar
      title="Resegment tools"
      subtitle={toolbarSubtitle}
      leading={
        <span
          style={{
            minWidth: spacing[40],
            minHeight: spacing[24],
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            // textFaint is icon-only; this span renders the selected range.
            color: hasSelection ? colors.accentBase : colors.textSoft,
            ...flowType.toolbarSelection,
          }}
        >
          {selectedDisplayRange ?? '—'}
        </span>
      }
      orientation={toolbarOrientation}
      isFloating={isFloating}
      onToggleFloating={onToggleFloating}
      debugItem="selected_segment_toolbar"
      style={isFloating ? undefined : {
        // Placement is the region's job now — it is fixed in the reserved gutter,
        // so there is no translateX here. The old transform existed to shunt a
        // sticky toolbar sideways into that gutter; keeping it would shift a
        // fixed element a second time.
        //
        // Height stays this element's concern: the tool list grows with what is
        // selected, so it fills the band the region grants and scrolls past it,
        // with the fade the standard requires so a cut list still says there is
        // more.
        height: '100%',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        maskImage: 'linear-gradient(to bottom, #000 calc(100% - 20px), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, #000 calc(100% - 20px), transparent 100%)',
      }}
    >
      <DockableToolbarActionGroup orientation={toolbarOrientation}>
        <DockableToolbarIconButton
          showLabel
          label="Undo"
          icon={<Undo2 size={15} strokeWidth={1.9} />}
          onClick={onUndo}
          disabled={!canUndo}
          debugItem="undo_button"
        />
        <DockableToolbarIconButton
          showLabel
          label="Redo"
          icon={<Redo2 size={15} strokeWidth={1.9} />}
          onClick={onRedo}
          disabled={!canRedo}
          debugItem="redo_button"
        />
      </DockableToolbarActionGroup>
      <DockableToolbarDivider orientation={toolbarOrientation} />
      <DockableToolbarActionGroup orientation={toolbarOrientation}>
        <DockableToolbarIconButton
          showLabel
          label="Split"
          icon={<Scissors size={15} strokeWidth={1.9} />}
          onClick={onSplitSelected}
          disabled={!canSplitSelected}
          active={activeTool === 'split'}
          debugItem="split_segment_button"
        />
        <DockableToolbarIconButton
          showLabel
          label="Merge selected"
          icon={<Combine size={15} strokeWidth={1.9} />}
          onClick={onMergeSelected}
          disabled={!canMergeSelected}
          debugItem="merge_selected_button"
        />
        <DockableToolbarIconButton
          showLabel
          label="Merge next"
          icon={<Merge size={15} strokeWidth={1.9} />}
          onClick={onMergeSelectedWithNext}
          disabled={!canMergeSelectedWithNext}
          debugItem="merge_segment_button"
        />
      </DockableToolbarActionGroup>
      <DockableToolbarDivider orientation={toolbarOrientation} />
      <DockableToolbarActionGroup orientation={toolbarOrientation}>
        <DockableToolbarIconButton
          showLabel
          label="Adjust boundary"
          icon={<MoveHorizontal size={15} strokeWidth={1.9} />}
          onClick={onAdjustBoundary}
          disabled={!hasSelection}
          active={activeTool === 'boundary'}
          debugItem="boundary_segment_button"
        />
        <DockableToolbarIconButton
          showLabel
          label="Mark ready"
          icon={<Check size={15} strokeWidth={2} />}
          onClick={onMarkSelectedReady}
          disabled={!canMarkSelectedReady}
          debugItem="mark_ready_button"
        />
        <DockableToolbarIconButton
          showLabel
          label={advancedEditMode ? 'Close editor' : 'Advanced edit'}
          icon={<PencilLine size={15} strokeWidth={1.9} />}
          onClick={onToggleAdvancedEdit}
          disabled={!hasSelection}
          active={activeTool === 'advanced'}
          debugItem="advanced_edit_button"
        />
      </DockableToolbarActionGroup>
      <DockableToolbarDivider orientation={toolbarOrientation} />
      <DockableToolbarActionGroup orientation={toolbarOrientation}>
        <DockableToolbarMenu
          showLabel
          label="Remove"
          icon={<Trash2 size={15} strokeWidth={1.9} />}
          open={removeMenuOpen}
          disabled={!canRemoveSelected}
          tone="danger"
          placement={isFloating ? 'bottom' : 'left'}
          onToggle={onToggleRemoveMenu}
          debugItem="remove_segment_marker_button"
        >
          <span
            data-debug-item="remove_options_group"
            style={{
              ...flowType.operationalMeta,
              color: colors.review,
              padding: `${spacing[4]} ${spacing[8]} ${spacing[8]}`,
              borderBottom: `1px solid ${flowChrome.amberLine}`,
            }}
          >
            Remove selected
          </span>
          <DockableToolbarMenuItem onClick={() => onRemoveSelected('delete')} tone="danger" debugItem="remove_delete_button">
            Delete completely
          </DockableToolbarMenuItem>
          <DockableToolbarMenuItem
            onClick={() => onRemoveSelected('previous')}
            disabled={!canRemoveToPrevious}
            debugItem="remove_to_previous_button"
          >
            Add to previous
          </DockableToolbarMenuItem>
          <DockableToolbarMenuItem
            onClick={() => onRemoveSelected('next')}
            disabled={!canRemoveToNext}
            debugItem="remove_to_next_button"
          >
            Add to next
          </DockableToolbarMenuItem>
        </DockableToolbarMenu>
      </DockableToolbarActionGroup>
    </DockableToolbar>
  )
}

function getSegmentWords(text) {
  return text.trim().split(/\s+/).filter(Boolean)
}

function getSplitChunks(text, splitPoints = []) {
  const words = text.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) {
    return []
  }

  const normalizedPoints = [...new Set(splitPoints)]
    .filter((point) => point > 0 && point < words.length)
    .sort((first, second) => first - second)
  const points = [...normalizedPoints, words.length]
  let start = 0

  return points.map((point) => {
    const chunk = words.slice(start, point).join(' ')
    start = point
    return chunk
  }).filter(Boolean)
}

function SegmentSplitPreview({ segment, splitPoints = [], onToggleSplitPoint, onApplySplit, onCancelSplit }) {
  const words = getSegmentWords(segment.text)
  const chunks = getSplitChunks(segment.text, splitPoints)

  return (
    <div
      data-debug-item="segment_split_preview"
      onClick={(event) => event.stopPropagation()}
      style={{
        margin: `${spacing[12]} ${spacing[20]} ${spacing[16]}`,
        padding: spacing[12],
        borderRadius: radius[16],
        border: `1px solid ${flowChrome.blueLine}`,
        background: flowChrome.blueTintSurface,
        display: 'grid',
        gap: spacing[12],
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12], flexWrap: 'wrap' }}>
          <span style={{ ...flowType.operationalMeta, color: colors.accentStrong }}>
          Split preview · click a word to place or remove a split after it
        </span>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8], flexWrap: 'wrap' }}>
          <CompactActionButton onClick={() => onCancelSplit?.()} debugItem="cancel_split_button">
            Cancel
          </CompactActionButton>
          <CompactActionButton onClick={() => onApplySplit?.(segment.id)} debugItem="apply_split_button">
            Apply split
          </CompactActionButton>
        </div>
      </div>
      <div
        dir="rtl"
        lang="ar"
        data-debug-item="split_word_picker"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          gap: spacing[8],
          padding: `${spacing[12]} ${spacing[16]}`,
          borderRadius: radius[12],
          border: `1px solid ${flowChrome.blueLine}`,
          background: flowChrome.whitePillSurface,
        }}
      >
        {words.map((word, index) => {
          const splitPoint = index + 1
          const canSplitAfter = splitPoint < words.length
          const selected = splitPoints.includes(splitPoint)

          return (
            <button
              key={`${segment.id}-${word}-${index}`}
              type="button"
              disabled={!canSplitAfter}
              onClick={() => onToggleSplitPoint?.(segment.id, splitPoint)}
              data-debug-item="split_word_button"
              data-split-selected={selected ? 'true' : 'false'}
              style={{
                position: 'relative',
                border: `1px solid ${selected ? flowChrome.blueLineStrong : flowChrome.transparent}`,
                borderRadius: radius[12],
                background: selected ? flowChrome.blueTintSurface : flowChrome.transparent,
                color: colors.textBody,
                padding: `${spacing[4]} ${spacing[8]}`,
                cursor: canSplitAfter ? 'pointer' : 'default',
                ...flowType.arabicSegment,
              }}
            >
              {word}
              {selected ? (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    bottom: '-4px',
                    left: '-5px',
                    width: '2px',
                    borderRadius: radius.pill,
                    background: colors.accentBase,
                    boxShadow: flowChrome.markerShadow,
                  }}
                />
              ) : null}
            </button>
          )
        })}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.max(1, chunks.length)}, minmax(0, 1fr))`,
          alignItems: 'stretch',
          gap: spacing[12],
        }}
      >
        {chunks.map((chunk, index) => (
          <p
            key={`${segment.id}-preview-${index}`}
            dir="rtl"
            lang="ar"
            style={{
              margin: 0,
              padding: `${spacing[12]} ${spacing[16]}`,
              borderRadius: radius[12],
              border: `1px solid ${flowChrome.blueLine}`,
              background: flowChrome.whitePillSurface,
              ...flowType.arabicSegment,
              overflowWrap: 'anywhere',
            }}
          >
            {chunk}
          </p>
        ))}
      </div>
      <span
        style={{
          ...flowType.operationalMeta,
          color: colors.textSoft,
        }}
      >
        {chunks.length} segments will be created from this split.
      </span>
    </div>
  )
}

function BoundaryAdjustPreview({ segment, nextSegment, onMoveBoundary, onCancelBoundary }) {
  return (
    <div
      data-debug-item="boundary_adjust_preview"
      onClick={(event) => event.stopPropagation()}
      style={{
        margin: `${spacing[12]} ${spacing[20]} ${spacing[16]}`,
        padding: spacing[12],
        borderRadius: radius[16],
        border: `1px solid ${flowChrome.blueLine}`,
        background: flowChrome.blueTintSurface,
        display: 'grid',
        gap: spacing[12],
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12], flexWrap: 'wrap' }}>
        <span style={{ ...flowType.operationalMeta, color: colors.accentStrong }}>Boundary adjustment</span>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8], flexWrap: 'wrap' }}>
          <CompactActionButton
            onClick={() => onMoveBoundary?.(segment.id, 'to-next')}
            disabled={!nextSegment}
            debugItem="move_boundary_to_next_button"
          >
            Move last word to next
          </CompactActionButton>
          <CompactActionButton
            onClick={() => onMoveBoundary?.(segment.id, 'from-next')}
            disabled={!nextSegment}
            debugItem="move_boundary_from_next_button"
          >
            Take first word from next
          </CompactActionButton>
          <CompactActionButton onClick={() => onCancelBoundary?.()} debugItem="cancel_boundary_button">
            Done
          </CompactActionButton>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: spacing[12] }}>
        {[segment, nextSegment].map((item, index) => (
          <div
            key={item?.id ?? 'missing-next'}
            style={{
              padding: `${spacing[12]} ${spacing[16]}`,
              borderRadius: radius[12],
              border: `1px solid ${flowChrome.blueLine}`,
              background: flowChrome.whitePillSurface,
              minWidth: 0,
            }}
          >
            <span style={{ ...flowType.operationalMeta }}>
              {index === 0 ? 'Selected segment' : 'Next segment'}
            </span>
            <p
              dir="rtl"
              lang="ar"
              style={{
                margin: `${spacing[8]} 0 0`,
                ...flowType.arabicSegment,
                overflowWrap: 'anywhere',
              }}
            >
              {item?.text ?? 'No next segment available.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SegmentAdvancedEditor({ segment, onTextChange, onClose }) {
  return (
    <div
      data-debug-item="segment_advanced_editor"
      onClick={(event) => event.stopPropagation()}
      style={{
        margin: `${spacing[12]} ${spacing[20]} ${spacing[16]}`,
        padding: spacing[12],
        borderRadius: radius[16],
        border: `1px solid ${flowChrome.blueLine}`,
        background: flowChrome.blueTintSurface,
        display: 'grid',
        gap: spacing[12],
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12], flexWrap: 'wrap' }}>
        <span style={{ ...flowType.operationalMeta, color: colors.accentStrong }}>Advanced text editor</span>
        <CompactActionButton onClick={() => onClose?.()} debugItem="close_advanced_editor_button">
          Done
        </CompactActionButton>
      </div>
      <textarea
        dir="rtl"
        lang="ar"
        value={segment.text}
        aria-label={`Edit the Arabic text of segment ${segment.displayNumber ?? segment.id}`}
        onChange={(event) => onTextChange?.(segment.id, event.target.value)}
        style={{
          width: '100%',
          minHeight: '120px',
          resize: 'vertical',
          boxSizing: 'border-box',
          padding: `${spacing[16]} ${spacing[20]}`,
          borderRadius: radius[12],
          border: `1px solid ${flowChrome.blueLine}`,
          background: flowChrome.whitePillSurface,
          color: colors.textBody,
          outline: 'none',
          ...flowType.arabicSegment,
        }}
      />
    </div>
  )
}

export function ReviewOutput({
  segments,
  selectedSegmentIds = [],
  boundaryFocusId,
  pendingSplitId,
  splitPointsBySegment = {},
  advancedEditId,
  onSelectSegment,
  onToggleSplitPoint,
  onApplySplit,
  onCancelSplit,
  onMoveBoundary,
  onCancelBoundary,
  onSegmentTextChange,
  onCloseAdvancedEdit,
  groupTitles,
  staleGroupIds = [],
  onGroupTitleChange,
  collapsedGroupIds,
  onToggleGroup,
  viewMode = 'grid',
  onViewModeChange,
}) {
  const groups = getSegmentationReviewGroups(segments, groupTitles)
  const isListMode = viewMode === 'list'

  return (
    <FlowPanel
      title="Segment proposal"
      barEnd={
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[12], flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span style={{ ...flowType.operationalMeta }}>{segments.length} segments</span>
          <ProposalViewToggle value={viewMode} onChange={onViewModeChange} />
        </div>
      }
      bodyStyle={{ padding: spacing[20] }}
      style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}
      debugItem="compiled_preview_panel"
    >
      <div style={{ display: 'grid', gap: spacing[20] }}>
        {groups.map((group) => {
          const collapsed = collapsedGroupIds.includes(group.id)

          return (
            <section key={group.id} data-debug-item="review_output_group" style={{ display: 'grid', gap: spacing[12] }}>
              <div
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: spacing[16],
                  color: colors.textSoft,
                  textAlign: 'left',
                }}
              >
                <GroupTitleInput
                  group={group}
                  stale={staleGroupIds.includes(group.id)}
                  onChange={onGroupTitleChange}
                />
                <button
                  type="button"
                  aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${group.title}`}
                  onClick={() => onToggleGroup(group.id)}
                  style={{
                    border: 'none',
                    background: flowChrome.transparent,
                    padding: spacing[4],
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: spacing[8],
                    // Carries a label, not just a chevron, so it takes the text
                    // tone rather than the icon one.
                    color: colors.textSoft,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ ...flowType.operationalMeta }}>{group.segments.length} segments</span>
                  {collapsed ? <ChevronDown size={14} strokeWidth={1.9} /> : <ChevronUp size={14} strokeWidth={1.9} />}
                </button>
              </div>
              {collapsed ? null : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isListMode
                      ? 'minmax(0, 1fr)'
                      : `repeat(auto-fit, minmax(${flowMetrics.reviewSegmentCardMinWidth}, 1fr))`,
                    gap: spacing[16],
                    alignItems: 'stretch',
                    paddingTop: spacing[8],
                    borderTop: `1px solid ${flowChrome.panelLine}`,
                  }}
                >
                  {group.segments.map((segment) => {
                    const segmentIndex = segments.findIndex((item) => item.id === segment.id)
                    const flagged = segment.reviewState !== 'ready'
                    const selected = selectedSegmentIds.includes(segment.id)
                    const splitActive = pendingSplitId === segment.id
                    const boundaryActive = boundaryFocusId === segment.id
                    const advancedEditActive = advancedEditId === segment.id
                    const stateMeta = segment.stateMeta
                    const stateChrome = getReviewStateChrome(segment.reviewState, selected)

                    return (
                      <article
                        key={segment.id}
                        data-debug-item="review_segment_card"
                        data-segment-id={segment.id}
                        data-selected={selected ? 'true' : 'false'}
                        onClick={() => onSelectSegment(segment.id)}
                        style={{
                          borderRadius: radius[16],
                          border: `1px solid ${selected ? flowChrome.blueLineStrong : stateChrome.border}`,
                          background: stateChrome.background,
                          overflow: 'hidden',
                          boxShadow: selected ? flowChrome.blueShadow : flagged ? stateChrome.shadow : flowChrome.none,
                          minWidth: 0,
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing[12],
                            padding: `${spacing[12]} ${spacing[16]}`,
                            borderBottom: `1px solid ${flagged ? stateChrome.border : flowChrome.panelLine}`,
                            background: selected
                              ? flowChrome.blueTintSurface
                              : stateChrome.headerBackground,
                          }}
                        >
                          <StepNumberBadge
                            background={stateChrome.badgeBackground}
                            color={stateChrome.badgeColor}
                            style={{ borderRadius: radius[12], width: spacing[32] }}
                          >
                            {segment.displayNumber}
                          </StepNumberBadge>
                          <span style={{ ...flowType.operationalMeta, minWidth: 0, flex: '1 1 auto' }}>
                            {segment.label}
                          </span>
                          {boundaryActive ? (
                            <StatusPill tone="accent" size="compact">
                              Boundary mode
                            </StatusPill>
                          ) : null}
                          {flagged ? (
                            <StatusPill tone={stateMeta.tone} size="compact">
                              {stateMeta.label}
                            </StatusPill>
                          ) : null}
                        </div>
                        <p
                          dir="rtl"
                          lang="ar"
                          style={{
                            margin: 0,
                            padding: `${spacing[16]} ${spacing[20]}`,
                            ...flowType.arabicSegment,
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {segment.text}
                        </p>
                        {splitActive ? (
                          <SegmentSplitPreview
                            segment={segment}
                            splitPoints={splitPointsBySegment[segment.id]}
                            onToggleSplitPoint={onToggleSplitPoint}
                            onApplySplit={onApplySplit}
                            onCancelSplit={onCancelSplit}
                          />
                        ) : null}
                        {boundaryActive ? (
                          <BoundaryAdjustPreview
                            segment={segment}
                            nextSegment={segments[segmentIndex + 1]}
                            onMoveBoundary={onMoveBoundary}
                            onCancelBoundary={onCancelBoundary}
                          />
                        ) : null}
                        {advancedEditActive ? (
                          <SegmentAdvancedEditor
                            segment={segment}
                            onTextChange={onSegmentTextChange}
                            onClose={onCloseAdvancedEdit}
                          />
                        ) : null}
                      </article>
                    )
                  })}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </FlowPanel>
  )
}

/**
 * The commit bar for Review, and it sticks to the bottom of the workspace.
 *
 * It used to be a centred block appended below the proposal list, which put
 * "Approve & Continue" at y=1575 on the canonical 900px-tall frame — 675px
 * below the fold, inside an inner scroll region, with nothing on screen saying
 * it existed. The screen's whole purpose is to approve a structure and the
 * approve action was invisible on arrival.
 *
 * R3 states this better and the design system was already waiting for it:
 * flowChrome.actionRegionWash has existed unused since the tokens were written,
 * which is a fade for exactly this kind of docked action region. Imported as a
 * decision, not as pixels — the tally reads from the live summary rather than
 * R3's fixture numbers, and the copy stays the codebase's own.
 */
export function SegmentationReviewActionRegion({
  segmentCount,
  reviewCount,
  readyCount,
  onApprove,
  onResegment,
}) {
  return (
    <div
      data-debug-item="review_action_panel"
      // Declares to the visual standard that this bar passes over the scroll
      // region on purpose. The trailing space that keeps the last card readable
      // is reserved by the workboard region, not by this bar.
      data-docked-chrome=""
      style={{
        width: '100%',
        marginTop: spacing[20],
        padding: `${spacing[16]} 0`,
        // The wash keeps the list legible as it passes under the bar instead of
        // ending at a hard line.
        background: flowChrome.actionRegionWash,
        display: 'flex',
        alignItems: 'center',
        // One statement, not two corners. `space-between` on a full-width bar put
        // "2 ready · 2 segments · source preserved" and "Approve & continue" some
        // 830px apart at 1440 — the state and the decision it justifies, filed at
        // opposite ends of the screen. They belong beside each other, because
        // reading one is how you decide about the other.
        justifyContent: 'flex-end',
        gap: spacing[24],
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'grid', gap: spacing[4], minWidth: 0 }}>
        <span style={{ ...flowType.operationalMeta }}>
          {/* successStrong / reviewStrong, not success / review: the token file
              records the plain pair as fills and icons only. The checker never
              caught these two because it cannot see an element scrolled out of
              its own region — which is exactly what this bar being below the
              fold did. */}
          <span style={{ color: colors.successStrong }}>{readyCount} ready</span>
          {reviewCount > 0 && (
            <>
              {' · '}
              <span style={{ color: colors.reviewStrong }}>{reviewCount} to check</span>
            </>
          )}
        </span>
        <span style={{ ...flowType.operationalMeta }}>
          {segmentCount} segments · source preserved
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[16] }}>
        {onResegment && (
          <FlowSecondaryButton onClick={onResegment} debugItem="resegment_button">
            Re-segment
          </FlowSecondaryButton>
        )}
        <PrimaryCTA
          icon={<Check size={16} strokeWidth={1.9} />}
          minWidth={260}
          height={52}
          onClick={onApprove}
          debugItem="approve_continue_cta"
        >
          Approve &amp; Continue
        </PrimaryCTA>
      </div>
    </div>
  )
}

export function SegmentationSuccessView({ shell, publishedSegments }) {
  // Report what was actually produced, not the fixture's length.
  const segmentCount = publishedSegments?.length ?? reviewSegments.length

  return (
    <FlowPage centered>
      <div
        data-debug-item="success_content"
        className="arapal-seg-flow__fadeUp"
        style={{
          width: '100%',
          maxWidth: '820px',
          textAlign: 'center',
          display: 'grid',
          justifyItems: 'center',
          gap: spacing[32],
        }}
      >
        <div
          data-debug-item="success_seal"
          style={{
            width: '132px',
            height: '132px',
            borderRadius: radius.pill,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(180deg, ${colors.accentBase} 0%, ${colors.accentStrong} 100%)`,
            color: colors.surfacePrimary,
            boxShadow: flowChrome.successSealShadow,
          }}
        >
          <CheckCircle2 size={64} strokeWidth={1.8} />
        </div>

        <div style={{ display: 'grid', gap: spacing[20], justifyItems: 'center' }}>
          <FlowTitle ceremonial>Segments Ready</FlowTitle>
          <FlowLead style={{ maxWidth: '620px', textAlign: 'center', fontSize: typography.sectionTitle.fontSize }}>
            Your study material has been successfully compiled
          </FlowLead>
          <div
            data-debug-item="segments_created_badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing[8],
              padding: `${spacing[8]} ${spacing[20]}`,
              borderRadius: radius.pill,
              border: `1px solid ${flowChrome.shellLine}`,
              background: flowChrome.whitePillSurface,
              color: colors.textBody,
              boxShadow: flowChrome.badgeShadow,
              fontFamily: typography.bodyText.fontFamily,
              fontSize: typography.bodyText.fontSize,
              lineHeight: typography.bodyText.lineHeight,
            }}
          >
            <Sparkles size={16} strokeWidth={1.9} color={colors.accentBase} />
            <span>
              <strong>{segmentCount}</strong> segments created
            </span>
          </div>
        </div>

        <div
          data-debug-item="success_actions"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[20],
            flexWrap: 'wrap',
          }}
        >
          <PrimaryCTA
            icon={<Play size={16} strokeWidth={1.9} />}
            minWidth={260}
            onClick={() => {
              // Tell Study why it was opened and which segment to start on,
              // instead of a bare route change that drops the context.
              const first = publishedSegments?.[0]
              if (first) {
                navigation.openPublishedSegmentation({
                  projectId: first.projectId,
                  segmentId: first.id,
                  segmentRef: first.ref,
                  count: publishedSegments.length,
                })
                return
              }
              shell.navigate('studyWorkspace')
            }}
            debugItem="start_studying_cta"
          >
            Start Studying
          </PrimaryCTA>
          <FlowSecondaryButton
            icon={<Home size={16} strokeWidth={1.9} />}
            variant="pill"
            onClick={() => shell.navigate('projectHome')}
            debugItem="return_home_button"
          >
            Return to Home
          </FlowSecondaryButton>
        </div>

        <FlowSecondaryButton
          icon={<ChevronRight size={14} strokeWidth={1.9} />}
          onClick={() => shell.navigate('segmentationReview')}
          debugItem="review_segments_link"
        >
          Review and edit segments
        </FlowSecondaryButton>

        <div
          data-debug-item="success_stats"
          style={{
            width: '100%',
            marginTop: spacing[16],
            paddingTop: spacing[32],
            borderTop: `1px solid ${colors.lineSoft}`,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: spacing[32],
          }}
        >
          {[
            ['Project', 'New project'],
            ['Batch ID', 'new'],
            ['Status', 'Live'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'grid', gap: spacing[12], justifyItems: 'center', minWidth: 0 }}>
              <span style={flowType.meta}>{label}</span>
              <span
                style={{
                  color: label === 'Status' ? colors.success : colors.textBody,
                  fontFamily: typography.bodyText.fontFamily,
                  fontSize: typography.sectionTitle.fontSize,
                  lineHeight: typography.bodyText.lineHeight,
                  fontWeight: flowTypography.successStatValueWeight,
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </FlowPage>
  )
}
