import { Edit3, Scissors, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import BackPill from '../../foundation/primitives/BackPill'
import EditorSurface from '../../foundation/primitives/EditorSurface'
import SegmentationOptionsPopover, {
  segmentationGranularityOptions as granularityOptions,
  segmentationMethodOptions as methodOptions,
  segmentationStyleOptions as styleOptions,
} from '../../foundation/primitives/SegmentationOptionsPopover'
import {
  readSegmentationFlowPreferences,
  saveSegmentationFlowPreferences,
} from '../../foundation/primitives/segmentationFlowState'
import SourceIntakeBrand from '../../foundation/primitives/SourceIntakeBrand'
import SplitCTA from '../../foundation/primitives/SplitCTA'
import StepBar from '../../foundation/primitives/StepBar'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import { colors, radius, spacing, typography } from '../../foundation/tokens'
import layoutContract from './SegmentationPasteNextScreen.contract'

const workspaceSteps = [
  { id: 'source', label: 'Source' },
  { id: 'segment', label: 'Segment' },
  { id: 'review', label: 'Review' },
]

const initialText = `في بداية الربيع خرجت القافلة من المدينة قبل شروق الشمس.
وكانت السماء صافية والهواء بارداً على نحوٍ خفيف.
توقفت المجموعة عند البئر القديمة لتراجع المؤن وتتأكد من الطريق.`

const centeredActionWidth = {
  width: '100%',
  maxWidth: '920px',
  margin: '0 auto',
}

const segmentationModePillChrome = {
  border: '1px solid rgba(37, 99, 235, 0.12)',
  surface: 'rgba(255, 255, 255, 0.76)',
  insetHighlight: 'inset 0 1px 0 rgba(255,255,255,0.9)',
}

const segmentationPasteNextContainerOverrides = {
  Layer1_Header_StartLane: {
    style: {
      paddingLeft: spacing[4],
      paddingRight: spacing[16],
    },
  },
}

export default function SegmentationPasteNextScreen({ route, shell }) {
  const [rawText, setRawText] = useState(initialText)
  const [method, setMethod] = useState(() => readSegmentationFlowPreferences().method)
  const [style, setStyle] = useState('meaning')
  const [granularity, setGranularity] = useState('balanced')
  const [quickMode, setQuickMode] = useState(() => readSegmentationFlowPreferences().quickMode)
  const [showSegmentationTransition, setShowSegmentationTransition] = useState(
    () => readSegmentationFlowPreferences().showSegmentationTransition,
  )

  const hasText = rawText.trim().length > 0
  const wordCount = hasText ? rawText.trim().split(/\s+/).length : 0
  const selectedMethod = useMemo(
    () => methodOptions.find((option) => option.id === method) ?? methodOptions[0],
    [method],
  )
  const selectedStyle = useMemo(
    () => styleOptions.find((option) => option.id === style) ?? styleOptions[0],
    [style],
  )
  const selectedGranularity = useMemo(
    () => granularityOptions.find((option) => option.id === granularity) ?? granularityOptions[0],
    [granularity],
  )

  const slots = {
    Layer1_Header_StartLane: (
      <BackPill debugItem="back_pill" onClick={() => shell.navigate('projectHome')}>
        Back
      </BackPill>
    ),
    Layer1_Header_CenterLane: <StepBar debugItem="step_bar" steps={workspaceSteps} currentIndex={0} />,
    Layer1_Header_EndLane: (
      <SourceIntakeBrand
        title="Source Intake"
        subtitle="Segmentation Next"
        icon={<Scissors size={16} strokeWidth={1.9} />}
        debugItem="source_intake_brand"
      />
    ),
    Layer4_SegmentationNext_ModeBand: (
      <div
        data-debug-item="mode_pill"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: spacing[8],
          padding: `0 ${spacing[12]}`,
          minHeight: '32px',
          border: segmentationModePillChrome.border,
          borderRadius: radius.pill,
          background: segmentationModePillChrome.surface,
          color: colors.accentBase,
          boxShadow: segmentationModePillChrome.insetHighlight,
        }}
      >
        <span style={{ ...typography.eyebrowLabel, color: colors.accentBase }}>Source + Segmentation</span>
      </div>
    ),
    Layer4_SegmentationNext_HeaderBand: (
      <h1
        data-debug-item="display_title"
        style={{
          margin: 0,
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          color: colors.textStrong,
          fontFamily: typography.cardTitle.fontFamily,
          fontSize: `clamp(${typography.cardTitle.fontSize}, 3vw, ${typography.displayTitle.fontSize})`,
          lineHeight: typography.cardTitle.lineHeight,
          textAlign: 'center',
          textWrap: 'balance',
          overflowWrap: 'anywhere',
        }}
      >
        Paste your source text.
      </h1>
    ),
    Layer4_SegmentationNext_ContextBand: (
      <p
        data-debug-item="support_subtext"
        style={{
          margin: 0,
          width: '100%',
          maxWidth: '640px',
          color: colors.textSoft,
          ...typography.supportSubtext,
          fontSize: `clamp(${typography.eyebrowLabel.fontSize}, 1.2vw, ${typography.supportSubtext.fontSize})`,
          letterSpacing: '0.01em',
          textAlign: 'center',
        }}
      >
        Preserve the raw source safely, then choose how AraPal should propose study-ready segments for review.
      </p>
    ),
    Layer4_SegmentationNext_WorkspaceBand: (
      <EditorSurface
        value={rawText}
        onChange={setRawText}
        placeholder={
          'Paste your source text here...\n\nAraPal will keep the original intact, prepare a proposal, and take you into review.'
        }
        eyebrow="Arapal intake"
        seal="Preserved source"
        watermark="Arapal"
        shortcutLabel="to paste"
        footerMeta={hasText ? `${wordCount} words` : ''}
        surfaceDebugItem="source_editor_surface"
        textareaDebugItem="source_textarea"
        minHeight={0}
        fillHeight
      />
    ),
    Layer4_SegmentationNext_ActionBand: (
      <div
        style={{
          ...centeredActionWidth,
          display: 'grid',
          justifyItems: 'center',
          gap: spacing[12],
          textAlign: 'center',
        }}
      >
        <div
          data-debug-item="cta_meta_row"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[8],
            flexWrap: 'wrap',
            justifyContent: 'center',
            color: colors.textFaint,
            ...typography.eyebrowLabel,
          }}
        >
          <span>{selectedMethod.label}</span>
          <span aria-hidden="true">•</span>
          <span>{selectedStyle.label}</span>
          <span aria-hidden="true">•</span>
          <span>{selectedGranularity.label}</span>
        </div>

        <SplitCTA
          label={selectedMethod.id === 'manual' ? 'Manual review' : 'AI Segment Text'}
          icon={
            selectedMethod.id === 'manual'
              ? <Edit3 size={16} strokeWidth={1.9} />
              : <Sparkles size={16} strokeWidth={1.9} />
          }
          primaryContentStyle={{
            fontSize: typography.ctaLabel.fontSize,
            fontWeight: typography.ctaLabel.fontWeight,
            letterSpacing: typography.ctaLabel.letterSpacing,
          }}
          disabled={!hasText}
          onPrimaryClick={() => {
            if (!hasText) {
              return
            }

            saveSegmentationFlowPreferences({
              method: selectedMethod.id,
              quickMode,
              showSegmentationTransition,
            })

            shell.navigate(selectedMethod.id === 'manual' ? 'segmentationReview' : 'segmentationLoading')
          }}
          primaryDebugItem="primary_cta"
          tailDebugItem="split_cta_tail"
          menu={
            <SegmentationOptionsPopover
              role="menu"
              ariaLabel="Segmentation options"
              methodOptions={methodOptions}
              method={method}
              onMethodChange={setMethod}
              styleOptions={styleOptions}
              selectedStyle={style}
              onStyleChange={setStyle}
              granularityOptions={granularityOptions}
              granularity={granularity}
              onGranularityChange={setGranularity}
              quickMode={quickMode}
              onQuickModeChange={setQuickMode}
              quickModeMeta={
                quickMode
                  ? 'Go straight to Segments Ready after the AI pass'
                  : 'Open review first before showing Segments Ready'
              }
              showSegmentationTransition={showSegmentationTransition}
              onShowSegmentationTransitionChange={setShowSegmentationTransition}
            />
          }
        />

        <p
          data-debug-item="action_support_copy"
          style={{
            margin: 0,
            maxWidth: '52ch',
            color: colors.textSoft,
            ...typography.bodyText,
            textAlign: 'center',
          }}
        >
          The preserved source remains untouched. The next step generates a proposal that you can review before it
          becomes study truth.
        </p>
      </div>
    ),
  }

  return (
    <V2ScreenFrame
      contract={layoutContract}
      route={route}
      shell={shell}
      screenSlots={slots}
      containerOverrides={segmentationPasteNextContainerOverrides}
    />
  )
}
