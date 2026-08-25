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
import useIsMobileViewport from '../../foundation/primitives/useIsMobileViewport'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import { motion } from '../../foundation/tokens'
import layoutContract from './StudyWorkspaceScreen.contract'
import {
  actions, select, useArapal, useNotes, navigation, SAMPLE_EVALUATION_NOTICE,
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

function readInitialSegmentId() {
  if (typeof window === 'undefined') {
    return '1.3'
  }

  const candidate = new URLSearchParams(window.location.search).get('studySegmentId')
  return candidate || '1.3'
}

// Stable empty, so an absent project does not churn the reference each render.
const EMPTY_SEGMENT_RECORDS = {}

function createInitialSegmentRecords() {
  const initialStudyState = readInitialStudyState()
  const initialSegmentId = readInitialSegmentId()

  return {
    ...defaultSegmentRecords,
    [initialSegmentId]: {
      submissionState: initialStudyState,
      attempts: (initialStudyState === 'draft' || initialStudyState === 'failed') ? 0 : 1,
    },
  }
}

function getWorkspaceColumns({ focusMode, segmentRailCollapsed, supportRailCollapsed, discussionMode = false, isMobile = false }) {
  // One column at mobile. The three-column workspace is 208px of segments plus
  // 308px of support before the work itself gets a pixel, which on a 390px frame
  // put the support rail's right edge at 576 — 186px outside the window, with no
  // way to scroll to it because the rail is chrome. Width is an input to this
  // function rather than a media query because these columns are written inline,
  // and inline styles beat stylesheets.
  if (isMobile) {
    // Zero-width rails, not one column. The three regions carry explicit
    // gridColumn assignments, so collapsing the track list to a single column
    // landed all three in column 1 and the lexicography row overlapped the
    // editor by 80px. Giving the rails 0px keeps every region in its own track
    // and lets the work column take the frame — the same shape focus mode uses,
    // which is what mobile wants anyway.
    return '0px minmax(0, 1fr) 0px'
  }

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

// Tablet range: above the mobile breakpoint (where rails go to 0px) but too
// narrow for three full columns. At 768 the expanded rails left ~130px for the
// work lane, so the Arabic wrapped one word per line and Submit/Discuss were
// unreachable (R-013). In this range the rails DEFAULT to collapsed (72px
// each), giving the work lane room; the user can still expand either.
const COMPACT_QUERY = '(min-width: 561px) and (max-width: 1024px)'
function isCompactViewport() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(COMPACT_QUERY).matches
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
    () => context?.segmentId ?? context?.segmentRef ?? readInitialSegmentId(),
  )
  const [segmentRailCollapsed, setSegmentRailCollapsed] = useState(isCompactViewport)
  const [supportRailCollapsed, setSupportRailCollapsed] = useState(isCompactViewport)

  // Resizing INTO the tablet range collapses the rails so the work lane stays
  // usable; the user keeps control after that (this fires only on the transition).
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const list = window.matchMedia(COMPACT_QUERY)
    const onChange = (e) => {
      if (e.matches) {
        setSegmentRailCollapsed(true)
        setSupportRailCollapsed(true)
      }
    }
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [])
  const [focusMode, setFocusMode] = useState(readInitialFocusMode)
  const [sourceFontScale, setSourceFontScale] = useState(1)
  const [discussionOpen, setDiscussionOpen] = useState(readInitialDiscussionOpen)
  const [discussionClosing, setDiscussionClosing] = useState(false)
  const [manualNotesBySegment, setManualNotesBySegment] = useState({})

  // The handoff's project takes precedence: arriving from Research or an Exam
  // miss for a segment in project A must open project A, not whatever happened to
  // be current. Without this, a cross-project handoff resolved the segment id
  // against the wrong project and silently fell back to segment 1 (R-018).
  useEffect(() => {
    if (context?.projectId && context.projectId !== select.getCurrentProject()?.id) {
      actions.selectProject(context.projectId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const showSandboxControls = readSandboxControlsEnabled()
  const isMobile = useIsMobileViewport()

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

  const resolvedIndex = activeSegments.findIndex((segment) => segment.id === currentSegmentId)
  const currentSegmentIndex = Math.max(0, resolvedIndex)
  const currentSegment = activeSegments[currentSegmentIndex] ?? activeSegments[0]

  // R-018: a handoff that named a segment which does not resolve in this project
  // must SAY so and land on a real segment, not silently pretend it opened the
  // requested one. (A normal in-project navigation never sets context.segmentId,
  // so this only fires for a genuinely stale/cross-context handoff.)
  const contextSegmentMissing =
    isLive && !!context?.segmentId && !contextDismissed &&
    activeSegments.length > 0 && resolvedIndex === -1 &&
    !activeSegments.some((segment) => segment.id === context.segmentId)

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
  // What to show back as "your translation" once submitted. The reference route
  // has no store to read, so it falls back to the fixture — but only there.
  const submittedTranslation = draftValue.trim() || userTranslation
  const [submitError, setSubmitError] = useState(null)
  const [grading, setGrading] = useState(false)
  // Honest message when a submission was saved as an attempt but not graded as a
  // pass (no AI provider, or grading failed). Never a fabricated result.
  const [gradeNotice, setGradeNotice] = useState(null)

  const activeSourceText = isLive ? (currentSegment?.text ?? '') : arabicSource

  const handleDraftChange = (text) => {
    setSubmitError(null)
    if (isLive) actions.saveDraft({ projectId: project.id, segmentId: currentSegment.id, text })
    else setLocalDraft(text)
  }
  // Notes are durable for a real project (persisted in the store, keyed by
  // segment) and fall back to local state only for the reference surface, which
  // has no project to attach them to (IP-05).
  const liveNotes = useNotes(project?.id, currentSegment?.id)
  const currentManualNotes = useMemo(
    () => (isLive ? liveNotes.map((note) => note.text) : (manualNotesBySegment[currentSegment.id] ?? [])),
    [isLive, liveNotes, manualNotesBySegment, currentSegment.id],
  )
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
      setGradeNotice(null)
      setDiscussionOpen(false)
      setDiscussionClosing(false)
      // The attempt is saved. Now grade it against the real study contract. A
      // pass (the only path to completion) or a fail comes back from the AI
      // boundary; when no provider is configured the segment stays 'attempted'
      // and we say so honestly — never a fabricated pass.
      setGrading(true)
      actions.gradeSegment({ projectId: project.id, segmentId: currentSegment.id })
        .then((res) => {
          setGradeNotice(res.graded
            ? null
            : (res.message || 'Your translation is saved as an attempt. Semantic grading needs an AI provider, so this is not a pass.'))
        })
        .catch(() => setGradeNotice('Grading could not complete. Your translation is saved; you can try again.'))
        .finally(() => setGrading(false))
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

  const addManualNote = (note, source = 'manual') => {
    if (isLive && project) {
      actions.addNote({ projectId: project.id, segmentId: currentSegment.id, text: note, source })
      return
    }
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
        gridTemplateColumns: getWorkspaceColumns({ focusMode, segmentRailCollapsed, supportRailCollapsed, discussionMode, isMobile }),
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
        // A percentage inset cannot be capped into behaving at mobile.
        //
        // 20% takes a fifth of the frame from each side at EVERY width, so on a
        // 390px phone it spent 132px of a 330px body on margin and left the work
        // column at 198px. min() does not help — 20% of 330 is 66, already below
        // any sensible cap — because the problem is not that the value gets too
        // large but that it stays proportional when it should stop. That is a
        // breakpoint, so it uses the breakpoint.
        padding:
          isMobile
            ? '16px 16px 24px'
            : discussionMode
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
    // The centre lane is "where you are", so the segment under work belongs
    // there. It used to sit in the start lane, where the application identity
    // goes — which is why Study was the one screen in the product with no
    // Arapal mark on it. The progress counter moves to the end lane beside
    // Focus view, where the screen's own controls live.
    Layer1_Header_CenterLane: (
      <StudyShellTitleBar
        // The live project's real title, not a fixed book name. Only the
        // reference/demo mode (no live project) falls back to the default.
        title={isLive ? project?.title || undefined : undefined}
        chapterLabel={segmentMeta.chapterLabel}
        segmentLabel={currentSegment.label}
      />
    ),
    Layer1_Header_EndLane: (
      <StudyShellMeta
        progress={(
          <StudyShellProgress
            routeLabel={route?.label ?? 'Study Workspace'}
            progressText={segmentMeta.progressText}
            progressStep={segmentMeta.progressStep}
            progressTotal={segmentMeta.progressTotal}
          />
        )}
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
              // Reference content belongs to the reference route. A live project
              // has no published reference translation, and inventing one is the
              // same untruth as inventing a grade.
              bestTranslation={isLive ? null : bestInClassTranslation}
              // The user's OWN words when there are any. This passed the module
              // fixture unconditionally, so after submitting a real translation
              // the panel headed "Your translation" showed a stranger's — the
              // same class of untruth as the invented grade, and on the one card
              // whose entire purpose is to reflect the user's work back to them.
              userTranslation={submittedTranslation}
              onDiscuss={() => {
                setDiscussionClosing(false)
                setDiscussionOpen(true)
              }}
              manualNotes={currentManualNotes}
              onAddManualNote={addManualNote}
            />
            <StudySubmissionNavigator onJumpTo={jumpToStudyAnchor} notesAvailable={currentManualNotes.length > 0} />
            {discussionVisible ? <StudyDiscussionCompanion onClose={closeDiscussion} segmentLabel={currentSegment?.label} segmentText={currentSegment?.text ?? ""} segmentRef={currentSegment?.ref ?? ""} passed={currentState === "submitted"} onSaveSummary={(text) => addManualNote(text, "discussion")} /> : null}
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
                // The editor's row now carries the workspace's leftover height
                // (capped), so the textarea fills the panel it is given rather
                // than opening at two lines inside a taller box.
                fillHeight
              />
            </div>
            <div className="study-v2__composerCompanion">
              {discussionVisible ? <StudyDiscussionCompanion onClose={closeDiscussion} segmentLabel={currentSegment?.label} segmentText={currentSegment?.text ?? ""} segmentRef={currentSegment?.ref ?? ""} passed={currentState === "submitted"} onSaveSummary={(text) => addManualNote(text, "discussion")} /> : null}
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
    Layer4_Study_ContextRegion:
      (context && !contextDismissed) || contextSegmentMissing || grading || gradeNotice || (isLive && lastResult?.isSample) ? (
        <div className="study-v2__contextStrip">
          {contextSegmentMissing ? (
            <p className="study-v2__sampleNotice" role="alert">
              The segment this link pointed to isn’t in the current project — showing the first segment instead.
            </p>
          ) : null}
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
          {grading ? (
            <p className="study-v2__sampleNotice" role="status">Grading your translation against the study rubric…</p>
          ) : gradeNotice ? (
            <p className="study-v2__sampleNotice" role="note">{gradeNotice}</p>
          ) : isLive && lastResult?.isSample ? (
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
        // The support content is written against the reference passage. With a
        // real project it does not describe the user's segment, so it must not
        // be presented as though it does.
        isReference={!isLive}
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
