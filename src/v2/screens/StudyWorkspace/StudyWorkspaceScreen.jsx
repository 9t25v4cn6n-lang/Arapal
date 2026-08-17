import { useEffect, useMemo, useState } from 'react'
import {
  StudyBottomBar,
  StudyDiscussionCompanion,
  StudyQuickLexicography,
  StudySegmentNavigator,
  StudyShellMeta,
  StudyShellProgress,
  StudyShellTitleBar,
  StudySourceCard,
  StudySubmittedStack,
  StudySubmissionNavigator,
  StudySupportRail,
  StudyTranslationEditor,
  StudyWorkspaceStyles,
} from '../../foundation/primitives/StudyWorkspacePrimitives'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import { motion } from '../../foundation/tokens'
import layoutContract from './StudyWorkspaceScreen.contract'
import {
  actions, select, useArapal, navigation, SAMPLE_EVALUATION_NOTICE,
} from '../../data'

const segmentNodes = [
  { id: '1', label: 'Chapter 1: Purity', type: 'folder', depth: 0, isOpenByDefault: true },
  { id: '1.1', label: '1.1 Types of Water', type: 'file', depth: 1, chapterLabel: 'Chapter 1: Purity', defaultOutcome: 'submitted' },
  { id: '1.2', label: '1.2 Ablution (Wudu)', type: 'file', depth: 1, chapterLabel: 'Chapter 1: Purity', defaultOutcome: 'submitted' },
  { id: '1.3', label: '1.3 Ghusl', type: 'file', depth: 1, chapterLabel: 'Chapter 1: Purity', defaultOutcome: 'failed-first' },
  { id: '1.4', label: '1.4 Tayammum', type: 'file', depth: 1, chapterLabel: 'Chapter 1: Purity', defaultOutcome: 'submitted' },
  { id: '2', label: 'Chapter 2: Prayer', type: 'folder', depth: 0, isOpenByDefault: true },
  { id: '2.1', label: '2.1 Times of Prayer', type: 'file', depth: 1, chapterLabel: 'Chapter 2: Prayer', defaultOutcome: 'submitted' },
  { id: '2.2', label: '2.2 Conditions', type: 'file', depth: 1, chapterLabel: 'Chapter 2: Prayer', defaultOutcome: 'failed-first' },
  { id: '2.3', label: "2.3 Jumu'ah", type: 'file', depth: 1, chapterLabel: 'Chapter 2: Prayer', defaultOutcome: 'submitted' },
  { id: '3', label: 'Chapter 3: Fasting', type: 'folder', depth: 0, isOpenByDefault: false },
  { id: '3.1', label: '3.1 Opening Intentions', type: 'file', depth: 1, chapterLabel: 'Chapter 3: Fasting', defaultOutcome: 'submitted' },
]

const fileSegments = segmentNodes.filter((node) => node.type === 'file')

const defaultSegmentRecords = Object.fromEntries(
  fileSegments.map((segment) => [
    segment.id,
    {
      submissionState: 'draft',
      attempts: 0,
    },
  ]),
)

const arabicSource = 'لا تصح الجمعة إلا في مصر جامع أو في مصلى المصر ولا تجوز في القرى لقوله ﷺ "لا جمعة ولا تشريق ولا فطر ولا أضحى إلا في مصر جامع" والمصر الجامع كل موضع له أمير وقاض ينفذ الأحكام ويقيم الحدود وهذا عند أبي يوسف رحمه الله وعنه أنهم إذا اجتمعوا في أكبر مساجدهم لم يسعهم والأول اختيار الكرخي وهو الظاهر والثاني اختيار الثلجي والحكم غير مقصور على المصلي بل تجوز في جميع أفنية المصر لأنها بمنزلته في حوائج أهله'

const bestInClassTranslation = 'The Friday prayer is only valid in a comprehensive city or in the prayer area of the city, and it is not permissible in villages. A comprehensive city is any place that has a ruler and a judge who enforces judgments and establishes legal punishments. The ruling is not confined to the prayer area alone; rather, it extends throughout the attached outskirts of the city.'

const userTranslation = "Jumu'ah prayer is only valid in a comprehensive city or in the prayer area of the city. It is not permissible in villages..."

const lexicographyTerms = [
  {
    arabic: 'مصر جامع',
    transliteration: 'misr jāmiʿ',
    description: 'A comprehensive city with civic authority.',
  },
  {
    arabic: 'أفنية',
    transliteration: 'afniyah',
    description: 'Outskirts or courtyards attached to the city.',
  },
  {
    arabic: 'مصلى',
    transliteration: 'musallā',
    description: 'A prayer area or prayer ground.',
  },
]

function readSandboxControlsEnabled() {
  if (typeof window === 'undefined') {
    return false
  }

  return new URLSearchParams(window.location.search).get('studyDebug') === '1'
}

function readInitialStudyState() {
  if (typeof window === 'undefined') {
    return 'draft'
  }

  const candidate = new URLSearchParams(window.location.search).get('studyState')
  return ['draft', 'failed', 'submitted'].includes(candidate) ? candidate : 'draft'
}

function readInitialFocusMode() {
  if (typeof window === 'undefined') {
    return false
  }

  return new URLSearchParams(window.location.search).get('studyFocus') === '1'
}

function readInitialDiscussionOpen() {
  if (typeof window === 'undefined') {
    return false
  }

  return new URLSearchParams(window.location.search).get('studyDiscuss') === '1'
}

// Stable empty, so an absent project does not churn the reference each render.
const EMPTY_SEGMENT_RECORDS = {}

function createInitialSegmentRecords() {
  const initialStudyState = readInitialStudyState()

  return {
    ...defaultSegmentRecords,
    '1.3': {
      submissionState: initialStudyState,
      attempts: initialStudyState === 'draft' ? 0 : 1,
    },
  }
}

function getWorkspaceColumns({ focusMode, segmentRailCollapsed, supportRailCollapsed, discussionMode = false }) {
  if (focusMode) {
    return '0px minmax(0, 1fr) 0px'
  }

  const segmentColumn = segmentRailCollapsed ? '72px' : 'minmax(208px, 240px)'
  const supportColumn = discussionMode ? '0px' : supportRailCollapsed ? '72px' : 'minmax(308px, 340px)'

  return `${segmentColumn} minmax(0, 1fr) ${supportColumn}`
}

function getHeaderColumns() {
  return 'minmax(0, 1fr) auto minmax(0, 1fr)'
}

const DISCUSSION_TRANSITION_MS = 220

export default function StudyWorkspaceScreen({ route, shell }) {
  // The screen works in two modes. With a real project it reads segments,
  // drafts and results from the store, so work persists and belongs to
  // something. With no project it falls back to the built-in reference content
  // so the route stays inspectable on its own — which is how the golden
  // baseline and the labs use it.
  const project = useArapal(select.getCurrentProject)
  const storeSegments = useArapal((s) => (project ? select.listSegments(project.id, s) : []))
  const isLive = Boolean(project && storeSegments.length)

  const [context] = useState(() => navigation.readContext())
  const [contextDismissed, setContextDismissed] = useState(false)

  const [segmentRecords, setSegmentRecords] = useState(createInitialSegmentRecords)
  const [currentSegmentId, setCurrentSegmentId] = useState(
    () => context?.segmentId ?? context?.segmentRef ?? '1.3',
  )
  const [segmentRailCollapsed, setSegmentRailCollapsed] = useState(false)
  const [supportRailCollapsed, setSupportRailCollapsed] = useState(false)
  const [focusMode, setFocusMode] = useState(readInitialFocusMode)
  const [sourceFontScale, setSourceFontScale] = useState(1)
  const [discussionOpen, setDiscussionOpen] = useState(readInitialDiscussionOpen)
  const [discussionClosing, setDiscussionClosing] = useState(false)
  const [manualNotesBySegment, setManualNotesBySegment] = useState({})
  const showSandboxControls = readSandboxControlsEnabled()

  // One list, whichever mode we are in, so everything below is written once.
  const activeSegments = isLive
    ? storeSegments.map((segment) => ({
        id: segment.id,
        label: `${segment.ref} ${segment.title}`.trim(),
        ref: segment.ref,
        text: segment.text,
        chapterLabel: segment.chapterLabel || 'Segments',
        type: 'file',
        depth: 1,
      }))
    : fileSegments

  // Group the active segments into the chapter/file tree the navigator wants.
  const activeNodes = isLive
    ? (() => {
        const nodes = []
        let lastChapter = null
        activeSegments.forEach((segment) => {
          if (segment.chapterLabel !== lastChapter) {
            lastChapter = segment.chapterLabel
            nodes.push({ id: `ch_${nodes.length}`, label: segment.chapterLabel, type: 'folder', depth: 0, isOpenByDefault: true })
          }
          nodes.push({ ...segment, type: 'file', depth: 1 })
        })
        return nodes
      })()
    : segmentNodes

  const currentSegmentIndex = Math.max(
    0, activeSegments.findIndex((segment) => segment.id === currentSegmentId))
  const currentSegment = activeSegments[currentSegmentIndex] ?? activeSegments[0]

  const storeRecord = useArapal((s) =>
    isLive && currentSegment ? select.getStudyRecord(project.id, currentSegment.id, s) : null)

  /**
   * Every segment's record, for the rail's markers and the STUDIED counter.
   *
   * These read `segmentRecords` below, which is local state seeded from the
   * reference fixture and keyed '1.1'/'1.3'. In live mode those keys cannot match
   * a real segment id, and nothing ever wrote the store's records into it — so a
   * user could submit every segment and the rail would show three empty circles
   * and STUDIED 0 / 3 forever. The current segment looked right only because
   * `currentRecord` reads the store directly, which is what hid it.
   *
   * The wrapper object is rebuilt per call and that is fine: the record values
   * inside it are the store's own stable references, so useArapal's shallowEqual
   * sees no change until a record actually changes.
   */
  const liveSegmentRecords = useArapal((s) => {
    if (!isLive || !project) return EMPTY_SEGMENT_RECORDS
    const out = {}
    for (const segment of activeSegments) {
      const record = select.getStudyRecord(project.id, segment.id, s)
      if (record) out[segment.id] = record
    }
    return out
  })
  const storeDraft = useArapal((s) =>
    isLive && currentSegment ? select.getDraft(project.id, currentSegment.id, s) : null)
  const lastResult = useArapal((s) =>
    storeRecord?.lastResultId ? select.getResult(storeRecord.lastResultId, s) : null)

  const currentRecord = isLive
    ? (storeRecord ?? { submissionState: 'draft', attempts: 0 })
    : (segmentRecords[currentSegment.id] ?? defaultSegmentRecords[currentSegment.id])
  const currentState = currentRecord.submissionState

  // The draft belongs to (project, segment). Switching segments therefore
  // shows that segment's own work rather than the previous one's.
  const [localDraft, setLocalDraft] = useState('')
  const draftValue = isLive ? (storeDraft?.text ?? '') : localDraft
  const [submitError, setSubmitError] = useState(null)

  const activeSourceText = isLive ? (currentSegment?.text ?? '') : arabicSource

  const handleDraftChange = (text) => {
    setSubmitError(null)
    if (isLive) actions.saveDraft({ projectId: project.id, segmentId: currentSegment.id, text })
    else setLocalDraft(text)
  }
  const currentManualNotes = manualNotesBySegment[currentSegment.id] ?? []
  const canGoPrevious = currentSegmentIndex > 0
  const canGoNext = currentSegmentIndex < activeSegments.length - 1
  const discussionVisible = discussionOpen || discussionClosing
  const discussionMode = discussionVisible && currentState !== 'submitted'

  useEffect(() => {
    if (!discussionClosing) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setDiscussionClosing(false)
    }, DISCUSSION_TRANSITION_MS)

    return () => window.clearTimeout(timer)
  }, [discussionClosing])

  // The mount effect that used to sit here re-set the exact values the two
  // useState initialisers above already produce, costing a second render pass
  // on every load of the screen for no change in state.

  const segmentMeta = useMemo(
    () => ({
      chapterLabel: currentSegment.chapterLabel,
      progressText: `Segment ${currentSegmentIndex + 1} of ${activeSegments.length}`,
      progressStep: currentSegmentIndex,
      progressTotal: activeSegments.length,
    }),
    [currentSegment, currentSegmentIndex, activeSegments.length],
  )

  const setCurrentSegmentSubmissionState = (submissionState, attempts) => {
    setDiscussionOpen(false)
    setDiscussionClosing(false)
    setSegmentRecords((current) => ({
      ...current,
      [currentSegment.id]: {
        ...(current[currentSegment.id] ?? defaultSegmentRecords[currentSegment.id]),
        submissionState,
        attempts,
      },
    }))
  }

  const handleSubmit = () => {
    // The refusal is a property of submitting a translation, not a property of
    // the live store. Guarding only the live branch meant the fixture route —
    // the one the demo and every visual state actually run — still accepted an
    // empty box and marked the segment submitted.
    if (!draftValue.trim()) {
      setSubmitError('Write a translation before submitting.')
      return
    }

    if (isLive) {
      const outcome = actions.submitSegment({ projectId: project.id, segmentId: currentSegment.id })
      if (!outcome.ok) {
        // Refused rather than graded. The previous build accepted an empty box
        // and returned a grade and a review date for work it never read.
        setSubmitError(outcome.message)
        return
      }
      setSubmitError(null)
      setDiscussionOpen(false)
      setDiscussionClosing(false)
      return
    }

    setDiscussionOpen(false)
    setDiscussionClosing(false)
    setSegmentRecords((current) => {
      const existingRecord = current[currentSegment.id] ?? defaultSegmentRecords[currentSegment.id]
      const nextAttempts = (existingRecord.attempts ?? 0) + 1
      const shouldFailFirst = currentSegment.defaultOutcome === 'failed-first' && (existingRecord.attempts ?? 0) === 0

      return {
        ...current,
        [currentSegment.id]: {
          submissionState: shouldFailFirst ? 'failed' : 'submitted',
          attempts: nextAttempts,
        },
      }
    })
  }

  const addManualNote = (note) => {
    setManualNotesBySegment((current) => ({
      ...current,
      [currentSegment.id]: [...(current[currentSegment.id] ?? []), note],
    }))
  }

  const toggleDiscussion = () => {
    if (discussionOpen) {
      setDiscussionOpen(false)
      setDiscussionClosing(true)
      return
    }

    setDiscussionClosing(false)
    setDiscussionOpen(true)
  }

  const closeDiscussionImmediately = () => {
    setDiscussionOpen(false)
    setDiscussionClosing(false)
  }

  const closeDiscussion = () => {
    setDiscussionOpen(false)
    setDiscussionClosing(true)
  }

  const goToPreviousSegment = () => {
    if (canGoPrevious) {
      closeDiscussionImmediately()
      setCurrentSegmentId(activeSegments[currentSegmentIndex - 1].id)
    }
  }

  const goToNextSegment = () => {
    if (canGoNext) {
      closeDiscussionImmediately()
      setCurrentSegmentId(activeSegments[currentSegmentIndex + 1].id)
    }
  }

  const selectSegment = (segmentId) => {
    closeDiscussionImmediately()
    setCurrentSegmentId(segmentId)
  }

  const jumpToStudyAnchor = (anchorName) => {
    if (typeof document === 'undefined') {
      return
    }

    document
      .querySelector(`[data-study-anchor="${anchorName}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const containerOverrides = {
    Layer1_Header_Row: {
      style: {
        gridTemplateColumns: getHeaderColumns(),
        boxShadow: 'inset 0 -1px 0 rgba(203, 213, 225, 0.9)',
      },
    },
    Layer2_Study_WorkspaceRoot: {
      style: {
        gridTemplateColumns: getWorkspaceColumns({ focusMode, segmentRailCollapsed, supportRailCollapsed, discussionMode }),
        transition: `grid-template-columns ${motion.panel}`,
      },
    },
    Layer3_Study_CenterWorkspace: {
      style: {
        position: 'relative',
      },
    },
    Layer4_Study_PrimaryScroll: {
      style: {
        padding:
          discussionMode
            ? '16px clamp(16px, 3vw, 40px) 24px'
            : '16px 20% 24px',
        transition: `padding ${motion.panel}`,
      },
    },
    ...(supportRailCollapsed && !focusMode && !discussionMode
      ? {
          Layer3_Study_SupportRail: {
            style: {
              overflow: 'visible',
              zIndex: 18,
            },
          },
        }
      : {}),
    ...(focusMode
      ? {
          Layer1_Body_Row: {
            style: {
              gridTemplateColumns: '0px minmax(0, 1fr)',
              transition: `grid-template-columns ${motion.panel}`,
            },
          },
          Layer1_Body_NavigationRail: {
            style: {
              padding: '0',
              borderRight: 'none',
              background: 'transparent',
              backdropFilter: 'none',
              opacity: 0,
              pointerEvents: 'none',
            },
          },
          Layer3_Study_SegmentNavigator: {
            style: {
              opacity: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
            },
          },
          Layer3_Study_SupportRail: {
            style: {
              opacity: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
            },
          },
        }
      : {}),
  }

  const screenSlots = {
    Layer2_Study_WorkspaceRoot: <StudyWorkspaceStyles />,
    Layer1_Header_StartLane: (
      <StudyShellTitleBar
        chapterLabel={segmentMeta.chapterLabel}
        segmentLabel={currentSegment.label}
      />
    ),
    Layer1_Header_CenterLane: (
      <StudyShellProgress
        routeLabel={route?.label ?? 'Study Workspace'}
        progressText={segmentMeta.progressText}
        progressStep={segmentMeta.progressStep}
        progressTotal={segmentMeta.progressTotal}
      />
    ),
    Layer1_Header_EndLane: (
      <StudyShellMeta
        focusMode={focusMode}
        onToggleFocus={() => setFocusMode((current) => !current)}
        showSandboxControls={showSandboxControls}
        onDraft={() => setCurrentSegmentSubmissionState('draft', 0)}
        onFail={() => setCurrentSegmentSubmissionState('failed', 1)}
        onPass={() => setCurrentSegmentSubmissionState('submitted', 2)}
      />
    ),
    Layer3_Study_SegmentNavigator: (
      <StudySegmentNavigator
        nodes={activeNodes}
        currentSegmentId={currentSegment.id}
        segmentRecords={isLive ? liveSegmentRecords : segmentRecords}
        collapsed={segmentRailCollapsed}
        onToggleCollapsed={() => setSegmentRailCollapsed((current) => !current)}
        onSelectSegment={selectSegment}
      />
    ),
    Layer4_Study_CenterHeader: null,
    Layer4_Study_PrimaryScroll: (
      <div
        className={[
          'study-v2',
          'study-v2__workLane',
          focusMode ? 'is-focused' : '',
          discussionMode ? 'is-discussing' : '',
          discussionClosing ? 'is-discussion-closing' : '',
        ].filter(Boolean).join(' ')}
        data-debug-item="study_primary_work_lane"
      >
        {currentState === 'submitted' ? (
          <div className="study-v2__studyStack">
            <StudySourceCard
              sourceText={activeSourceText}
              onPrevious={goToPreviousSegment}
              onNext={goToNextSegment}
              canPrevious={canGoPrevious}
              canNext={canGoNext}
              showSegmentNavigation
              fontScale={sourceFontScale}
              onDecreaseFont={() => setSourceFontScale((current) => Math.max(0.72, Number((current - 0.08).toFixed(2))))}
              onIncreaseFont={() => setSourceFontScale((current) => Math.min(1.44, Number((current + 0.08).toFixed(2))))}
            />
            <StudySubmittedStack
              bestTranslation={bestInClassTranslation}
              userTranslation={userTranslation}
              onDiscuss={() => {
                setDiscussionClosing(false)
                setDiscussionOpen(true)
              }}
              manualNotes={currentManualNotes}
              onAddManualNote={addManualNote}
            />
            <StudySubmissionNavigator onJumpTo={jumpToStudyAnchor} notesAvailable={currentManualNotes.length > 0} />
            {discussionVisible ? <StudyDiscussionCompanion onClose={closeDiscussion} /> : null}
          </div>
        ) : (
          <div
            className={[
              'study-v2__composer',
              discussionMode ? 'is-discussing' : '',
              discussionClosing ? 'is-discussion-closing' : '',
            ].filter(Boolean).join(' ')}
            data-debug-item="study_discussion_composer"
          >
            <div className="study-v2__composerSource">
              <StudySourceCard
                sourceText={activeSourceText}
                onPrevious={goToPreviousSegment}
                onNext={goToNextSegment}
                canPrevious={canGoPrevious}
                canNext={canGoNext}
                showSegmentNavigation
                fontScale={sourceFontScale}
                onDecreaseFont={() => setSourceFontScale((current) => Math.max(0.72, Number((current - 0.08).toFixed(2))))}
                onIncreaseFont={() => setSourceFontScale((current) => Math.min(1.44, Number((current + 0.08).toFixed(2))))}
              />
            </div>
            <div className="study-v2__composerLex">
              <StudyQuickLexicography terms={lexicographyTerms} />
            </div>
            <div className="study-v2__composerEditor">
              <StudyTranslationEditor
                value={draftValue}
                onChange={handleDraftChange}
                error={submitError ?? undefined}
                failed={currentState === 'failed'}
                onSubmit={handleSubmit}
                onDiscuss={toggleDiscussion}
                discussionOpen={discussionVisible}
                focusMode={focusMode}
                docked
                // Not stretched in discussion mode any more. fillHeight existed to
                // make the editor match a half-height companion card; now the
                // companion is a full-height column and the editor sits in a
                // content-sized row, so stretching it only recreated the ~340px
                // empty box. It grows with what is typed, in both modes.
                fillHeight={false}
              />
            </div>
            <div className="study-v2__composerCompanion">
              {discussionVisible ? <StudyDiscussionCompanion onClose={closeDiscussion} /> : null}
            </div>
          </div>
        )}
      </div>
    ),
    // Provenance does not depend on having a live project. The banner says "you
    // arrived here from an exam miss", which is equally true in reference mode —
    // and gating it on isLive meant redirecting Exams to the V2 Study silently
    // dropped the handoff for anyone without a project, which is exactly the
    // audience most likely to be exploring from Exams.
    Layer4_Study_ContextRegion: (context && !contextDismissed) || (isLive && lastResult?.isSample) ? (
      <div className="study-v2__contextStrip">
        {context && !contextDismissed ? (
          <div className="study-v2__contextBanner" role="status">
            <span className="study-v2__contextLabel">
              {navigation.describeContext(context)?.label}
            </span>
            <span className="study-v2__contextDetail">
              {navigation.describeContext(context)?.detail}
            </span>
            <button
              type="button"
              className="study-v2__contextDismiss"
              onClick={() => { setContextDismissed(true); navigation.clearContext() }}
            >
              Dismiss
            </button>
          </div>
        ) : null}
        {isLive && lastResult?.isSample ? (
          <p className="study-v2__sampleNotice" role="note">{SAMPLE_EVALUATION_NOTICE}</p>
        ) : null}
      </div>
    ) : null,
    Layer4_Study_ActionRegion: currentState === 'submitted' ? (
      <StudyBottomBar
        progressText={segmentMeta.progressText}
        progressStep={segmentMeta.progressStep}
        progressTotal={segmentMeta.progressTotal}
        onPrevious={goToPreviousSegment}
        onNext={goToNextSegment}
        canPrevious={canGoPrevious}
        canNext={canGoNext}
      />
    ) : null,
    Layer3_Study_SupportRail: discussionMode ? null : (
      <StudySupportRail
        state={currentState}
        collapsed={supportRailCollapsed}
        onToggleCollapsed={() => setSupportRailCollapsed((current) => !current)}
      />
    ),
  }

  return (
    <V2ScreenFrame
      contract={layoutContract}
      route={route}
      shell={shell}
      screenSlots={screenSlots}
      containerOverrides={containerOverrides}
    />
  )
}
