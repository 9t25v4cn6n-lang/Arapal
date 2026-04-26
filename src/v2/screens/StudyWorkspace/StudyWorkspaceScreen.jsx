import { useMemo, useState } from 'react'
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

function getWorkspaceColumns({ focusMode, segmentRailCollapsed, supportRailCollapsed }) {
  if (focusMode) {
    return '0px minmax(0, 1fr) 0px'
  }

  const segmentColumn = segmentRailCollapsed ? '72px' : 'minmax(208px, 240px)'
  const supportColumn = supportRailCollapsed ? '72px' : 'minmax(308px, 340px)'

  return `${segmentColumn} minmax(0, 1fr) ${supportColumn}`
}

function getHeaderColumns() {
  return 'minmax(280px, 1fr) minmax(260px, 420px) minmax(280px, 1fr)'
}

export default function StudyWorkspaceScreen({ route, shell }) {
  const [segmentRecords, setSegmentRecords] = useState(createInitialSegmentRecords)
  const [currentSegmentId, setCurrentSegmentId] = useState('1.3')
  const [segmentRailCollapsed, setSegmentRailCollapsed] = useState(false)
  const [supportRailCollapsed, setSupportRailCollapsed] = useState(false)
  const [focusMode, setFocusMode] = useState(readInitialFocusMode)
  const [sourceFontScale, setSourceFontScale] = useState(1)
  const [discussionOpen, setDiscussionOpen] = useState(false)
  const [manualNotesBySegment, setManualNotesBySegment] = useState({})
  const showSandboxControls = readSandboxControlsEnabled()

  const currentSegmentIndex = fileSegments.findIndex((segment) => segment.id === currentSegmentId)
  const currentSegment = fileSegments[currentSegmentIndex] ?? fileSegments[0]
  const currentRecord = segmentRecords[currentSegment.id] ?? defaultSegmentRecords[currentSegment.id]
  const currentState = currentRecord.submissionState
  const currentManualNotes = manualNotesBySegment[currentSegment.id] ?? []
  const canGoPrevious = currentSegmentIndex > 0
  const canGoNext = currentSegmentIndex < fileSegments.length - 1

  const segmentMeta = useMemo(
    () => ({
      chapterLabel: currentSegment.chapterLabel,
      progressText: `Segment ${currentSegmentIndex + 1} of ${fileSegments.length}`,
      progressStep: currentSegmentIndex,
      progressTotal: fileSegments.length,
    }),
    [currentSegment, currentSegmentIndex],
  )

  const setCurrentSegmentSubmissionState = (submissionState, attempts) => {
    setDiscussionOpen(false)
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
    setDiscussionOpen(false)
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

  const goToPreviousSegment = () => {
    if (canGoPrevious) {
      setDiscussionOpen(false)
      setCurrentSegmentId(fileSegments[currentSegmentIndex - 1].id)
    }
  }

  const goToNextSegment = () => {
    if (canGoNext) {
      setDiscussionOpen(false)
      setCurrentSegmentId(fileSegments[currentSegmentIndex + 1].id)
    }
  }

  const selectSegment = (segmentId) => {
    setDiscussionOpen(false)
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
        gridTemplateColumns: getWorkspaceColumns({ focusMode, segmentRailCollapsed, supportRailCollapsed }),
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
        padding: '16px 20% 24px',
      },
    },
    ...(supportRailCollapsed && !focusMode
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
        nodes={segmentNodes}
        currentSegmentId={currentSegment.id}
        segmentRecords={segmentRecords}
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
        ].filter(Boolean).join(' ')}
        data-debug-item="study_primary_work_lane"
      >
        <div className="study-v2__studyStack">
          <StudySourceCard
            sourceText={arabicSource}
            onPrevious={goToPreviousSegment}
            onNext={goToNextSegment}
            canPrevious={canGoPrevious}
            canNext={canGoNext}
            showSegmentNavigation={currentState !== 'submitted'}
            fontScale={sourceFontScale}
            onDecreaseFont={() => setSourceFontScale((current) => Math.max(0.72, Number((current - 0.08).toFixed(2))))}
            onIncreaseFont={() => setSourceFontScale((current) => Math.min(1.44, Number((current + 0.08).toFixed(2))))}
          />
          {currentState === 'submitted' ? (
            <>
              <StudySubmittedStack
                bestTranslation={bestInClassTranslation}
                userTranslation={userTranslation}
                onDiscuss={() => setDiscussionOpen(true)}
                manualNotes={currentManualNotes}
                onAddManualNote={addManualNote}
              />
              <StudySubmissionNavigator onJumpTo={jumpToStudyAnchor} notesAvailable={currentManualNotes.length > 0} />
              {discussionOpen ? <StudyDiscussionCompanion onClose={() => setDiscussionOpen(false)} /> : null}
            </>
          ) : (
            <StudyQuickLexicography terms={lexicographyTerms} />
          )}
        </div>
      </div>
    ),
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
    ) : discussionOpen ? (
      <div className={['study-v2', 'study-v2__editorDock', focusMode ? 'is-focused' : ''].filter(Boolean).join(' ')}>
        <StudyTranslationEditor
          failed={currentState === 'failed'}
          onSubmit={handleSubmit}
          onDiscuss={() => setDiscussionOpen(true)}
          focusMode={focusMode}
          docked
        />
        <StudyDiscussionCompanion onClose={() => setDiscussionOpen(false)} />
      </div>
    ) : (
      <StudyTranslationEditor
        failed={currentState === 'failed'}
        onSubmit={handleSubmit}
        onDiscuss={() => setDiscussionOpen(true)}
        focusMode={focusMode}
      />
    ),
    Layer3_Study_SupportRail: (
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
