import { Edit3, Sparkles, SplitSquareVertical } from 'lucide-react'
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
  readSegmentationIntent,
  clearSegmentationIntent,
} from '../../foundation/primitives/segmentationFlowState'
import SplitCTA from '../../foundation/primitives/SplitCTA'
import useIsMobileViewport from '../../foundation/primitives/useIsMobileViewport'
import { actions, select, getSnapshot } from '../../data'
import { generateMarkers, markersToChunks } from '../../lib/segmentation'
import StepBar from '../../foundation/primitives/StepBar'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import { colors, segmentationFlowSteps, spacing, typography } from '../../foundation/tokens'
import layoutContract from './SegmentationPasteNextScreen.contract'

// The flow's own step list, not a second copy of it. This screen kept its own
// and so kept saying "Segment" after the shared one had moved to
// Source -> Review -> Publish — the first screen of the flow disagreeing with
// the other four about what the flow is.
const workspaceSteps = segmentationFlowSteps

// Intake starts EMPTY: the user pastes their own source. It used to be
// pre-filled with a fixed passage, which is why the "empty" intake state was
// never actually reachable and a project could be created from demo text
// (R-015).
const initialText = ''

const centeredActionWidth = {
  width: '100%',
  maxWidth: '920px',
  margin: '0 auto',
}

// The start lane's inset is the shell's decision now — it is where the identity
// mark aligns to the navigation rail's spine, which is not something one screen
// of one flow gets a vote on. This used to restate paddingLeft: 4px.
const segmentationPasteNextContainerOverrides = {}

/** First few words of the source, so a project is recognisable in the library. */
function deriveProjectTitle(rawText) {
  const words = String(rawText).trim().split(/\s+/).filter(Boolean).slice(0, 6)
  return words.length ? words.join(' ') : 'Untitled source'
}

export default function SegmentationPasteNextScreen({ route, shell }) {
  const isMobile = useIsMobileViewport()
  const [rawText, setRawText] = useState(initialText)
  const [method, setMethod] = useState(() => readSegmentationFlowPreferences().method)
  // Seeded from the stored preferences like method is, rather than hard-coded.
  // These were literals, so the popover's own defaults won every mount and the
  // user's choice could not survive a reload even once the store carried it.
  const [style, setStyle] = useState(() => readSegmentationFlowPreferences().style)
  const [granularity, setGranularity] = useState(() => readSegmentationFlowPreferences().granularity)
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
    // Layer4_SegmentationNext_ModeBand is deliberately empty.
    //
    // It held a "SOURCE + SEGMENTATION" pill directly above a heading that says
    // "Paste your source text.", under a step bar reading Source · Review ·
    // Publish, beside a navigation rail with the Source + Segmentation
    // destination highlighted. Four statements of the same fact stacked
    // vertically. The three that carry orientation stay; the pill goes.
    Layer4_SegmentationNext_HeaderBand: (
      <h1
        data-debug-item="display_title"
        style={{
          margin: 0,
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          color: colors.textStrong,
          ...typography.heroTitle,
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
          ...typography.leadText,
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
            // flex + full width (not inline-flex) so the row FILLS the frame and
            // wraps within it — inline-flex sized to content and overran 390,
            // clipping the granularity label (S3-003).
            display: 'flex',
            width: '100%',
            maxWidth: '100%',
            alignItems: 'center',
            gap: spacing[8],
            flexWrap: 'wrap',
            justifyContent: 'center',
            // textFaint is declared DECORATIVE AND ICON USE ONLY in the token
            // file — text must be textSoft or darker. This is the segmentation
            // configuration: how the source is about to be cut, which is the one
            // fact a user needs before pressing the button underneath it. It was
            // the faintest text on the screen.
            color: colors.textSoft,
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
          label={
            selectedMethod.id === 'manual'
              ? (isMobile ? 'Manual' : 'Manual review')
              : selectedMethod.id === 'ai'
                ? (isMobile ? 'AI segment' : 'AI segmentation')
                : (isMobile ? 'Segment' : 'Segment on device')
          }
          icon={
            selectedMethod.id === 'manual'
              ? <Edit3 size={16} strokeWidth={1.9} />
              : selectedMethod.id === 'ai'
                ? <Sparkles size={16} strokeWidth={1.9} />
                : <SplitSquareVertical size={16} strokeWidth={1.9} />
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
              style,
              granularity,
              showSegmentationTransition,
            })

            // Two distinct intents. 'new' always creates a fresh project so a
            // "New source" can never silently overwrite another project's
            // canonical identity (S3-001). 'resegment' keeps the current
            // project's identity and re-proposes; re-segmentation stays
            // non-destructive (DECISIONS §5). NOTHING is published here: this
            // stores a NON-AUTHORITATIVE proposal only, and publication happens
            // exclusively when the user approves in Review.
            const intent = readSegmentationIntent()
            const existing = select.getCurrentProject(getSnapshot())
            const project = (intent === 'resegment' && existing)
              ? existing
              : actions.addProject({ title: deriveProjectTitle(rawText), subtitle: 'Pasted source' })
            const source = actions.addSource({ projectId: project.id, rawText, label: 'Pasted source' })
            clearSegmentationIntent()

            if (selectedMethod.id === 'ai') {
              // The provider proposes the split; the Loading screen performs the
              // async call and stores the resulting proposal (or shows an honest
              // unavailable/error state). Only the raw source is persisted now.
              shell.navigate('segmentationLoading')
              return
            }

            // Deterministic, on-device proposal. Manual starts from the whole
            // source as one segment for the user to split in Review.
            const chunks = selectedMethod.id === 'manual'
              ? [{ text: rawText.trim(), title: '', chapterLabel: 'Chapter 1' }]
              : markersToChunks(
                  generateMarkers(rawText, 'local', style, granularity),
                  { chapterLabel: 'Chapter 1' },
                )
            actions.saveProposal({
              projectId: project.id,
              sourceId: source.id,
              chunks,
              method: selectedMethod.id,
              style,
              granularity,
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
              showSegmentationTransition={showSegmentationTransition}
              onShowSegmentationTransitionChange={setShowSegmentationTransition}
            />
          }
        />
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
