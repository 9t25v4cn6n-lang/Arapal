import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Layers3,
  Play,
  Plus,
  Save,
  Sparkles,
  Target,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge, Chip, GhostButton } from '../../foundation/primitives/CompactControls'
import PrimaryCTA from '../../foundation/primitives/PrimaryCTA'
import UserText from '../../foundation/primitives/UserText'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import { colors, radius, spacing, typography } from '../../foundation/tokens'
import layoutContract from './ExamsScreen.contract'
import {
  createExamRecord,
  EXAM_CONTEXT_STORAGE_KEY,
  filterScopeItems,
  readPersistedAttempt,
  readPersistedExams,
  slugifyExamTitle,
  writePersistedAttempt,
  writePersistedExams,
} from './examsModel'
import { useLiveExamScope } from './liveExamScope'
import { gradeExam } from '../../services/ai'

/**
 * Exams.
 *
 * The library used to present the same assessment three times over: a "Next
 * assessment" card naming it, a "Ready to take: 1" counter counting it, and a
 * "Saved exams" list containing it again with a second button that did the same
 * thing. Plus a 72px "Build focused assessment loops" masthead — a marketing
 * hero on a screen you are meant to visit every week.
 *
 * It is now organised around the three jobs a user actually comes here for:
 *
 *   1. take the next useful assessment   — the library's first row, promoted
 *   2. create and manage assessments     — the same library, one list
 *   3. review what has been completed    — a section with the aggregate on it
 *
 * There is exactly one representation of each exam. The next assessment is the
 * first row of the library rendered larger, not a separate card duplicating it,
 * which is why nothing has to be reconciled by the reader.
 */
export default function ExamsScreen({ route, shell }) {
  // Questions come from the OPEN project's own canonical segments, never a
  // fixture. An empty project therefore has an empty pool, and the builder says
  // so instead of offering scope that maps to nothing (R-017).
  const { project, pool } = useLiveExamScope()
  const restoredAttempt = useMemo(() => readPersistedAttempt(), [])
  // Hydrate from the persisted list so a created assessment survives reload.
  // There are no fixture seeds: a project's library starts empty and is filled
  // by building assessments from that project's segments (R-017).
  const [exams, setExams] = useState(() => readPersistedExams() ?? [])
  // A restored attempt is only honoured if its exam STILL EXISTS. A stale/orphan
  // attempt must route to a recoverable Library message, never a blank Take shell
  // (S3-004). Validated once, against the persisted exam list, at mount.
  const restoredAttemptValid = useMemo(
    () => !!(restoredAttempt?.examId && (readPersistedExams() ?? []).some((e) => e.id === restoredAttempt.examId)),
    [restoredAttempt],
  )
  const [view, setView] = useState(() => (restoredAttemptValid ? 'take' : 'library'))
  const [staleAttempt, setStaleAttempt] = useState(() => !!(restoredAttempt?.examId && !restoredAttemptValid))
  const [scopeMode, setScopeMode] = useState('prefix')
  // Scope defaults track the real pool, so the first preview is never empty on a
  // project whose segments do not happen to start at the old fixture's "2".
  const [prefixValue, setPrefixValue] = useState(() => pool[0]?.prefix ?? '1')
  const [rangeStart, setRangeStart] = useState(1)
  const [rangeEnd, setRangeEnd] = useState(() => Math.max(1, pool.length))
  const [draftTitle, setDraftTitle] = useState('Focused checkpoint')
  const [activeExamId, setActiveExamId] = useState(restoredAttemptValid ? restoredAttempt.examId : null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(restoredAttemptValid ? (restoredAttempt.currentQuestionIndex ?? 0) : 0)
  const [answers, setAnswers] = useState(restoredAttemptValid ? (restoredAttempt.answers ?? {}) : {})
  const [autosaveState, setAutosaveState] = useState('Saved')
  const [reviewGrouping, setReviewGrouping] = useState('concept')
  const [activeResult, setActiveResult] = useState(null)
  const [attemptStartedAt, setAttemptStartedAt] = useState(restoredAttemptValid ? (restoredAttempt.startedAt ?? null) : null)
  const [nowMs, setNowMs] = useState(null)
  const autosaveTimerRef = useRef(null)
  // Refs mirror the attempt state so an explicit save boundary (Save and next,
  // submit, unload) flushes the LATEST answers synchronously — never a stale
  // closure and never waiting on the debounce (S3-004).
  const answersRef = useRef(restoredAttemptValid ? (restoredAttempt.answers ?? {}) : {})
  const indexRef = useRef(restoredAttemptValid ? (restoredAttempt.currentQuestionIndex ?? 0) : 0)
  const startedAtRef = useRef(restoredAttemptValid ? (restoredAttempt.startedAt ?? null) : null)

  const activeExam = useMemo(
    () => exams.find((exam) => exam.id === activeExamId) || null,
    [activeExamId, exams],
  )
  const scopePreview = useMemo(
    () => filterScopeItems(scopeMode, prefixValue, rangeStart, rangeEnd, pool),
    [prefixValue, rangeEnd, rangeStart, scopeMode, pool],
  )
  // Only the open project's assessments are shown. Records built over a
  // different project's segments stay filed against that project and never
  // surface here (R-017). Legacy records saved before project-tagging have no
  // projectId; they are shown so nothing a user built silently disappears.
  const projectExams = useMemo(
    () => exams.filter((exam) => !exam.projectId || exam.projectId === project?.id),
    [exams, project?.id],
  )
  const currentQuestion = activeExam?.questions[currentQuestionIndex] ?? null
  const answeredCount = useMemo(
    () => Object.values(answers).filter((value) => value.trim()).length,
    [answers],
  )

  // Persist the exam list whenever it changes, so created assessments survive a
  // reload and an autosaved attempt still resolves to a real exam (R-017).
  useEffect(() => {
    writePersistedExams(exams)
  }, [exams])

  // A stale attempt (its exam no longer exists) is discarded from storage on
  // mount so it cannot reopen a blank shell on the next visit either (S3-004).
  useEffect(() => {
    if (staleAttempt) writePersistedAttempt(null)
  }, [staleAttempt])

  // Write the current attempt to storage NOW, synchronously. Reads the refs so a
  // value typed a moment before an explicit boundary is included.
  const flushAttempt = (overrides = {}) => {
    if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current)
    const saved = writePersistedAttempt({
      examId: activeExamId,
      answers: answersRef.current,
      currentQuestionIndex: indexRef.current,
      startedAt: startedAtRef.current,
      updatedAt: new Date().toISOString(),
      ...overrides,
    })
    setAutosaveState(saved ? 'Saved' : 'Not saved')
    return saved
  }

  // An explicit boundary the user did not click — closing/reloading the tab —
  // must still not lose the current answer.
  useEffect(() => {
    if (view !== 'take') return undefined
    const onUnload = () => {
      writePersistedAttempt({
        examId: activeExamId, answers: answersRef.current,
        currentQuestionIndex: indexRef.current, startedAt: startedAtRef.current,
        updatedAt: new Date().toISOString(),
      })
    }
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [view, activeExamId])

  useEffect(() => {
    if (view !== 'take') return undefined
    if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- optimistic indicator, one render
    setAutosaveState('Saving')
    autosaveTimerRef.current = window.setTimeout(() => {
      const saved = writePersistedAttempt({
        examId: activeExamId,
        answers,
        currentQuestionIndex,
        startedAt: attemptStartedAt,
        updatedAt: new Date().toISOString(),
      })
      setAutosaveState(saved ? 'Saved' : 'Not saved')
    }, 600)

    return () => {
      if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current)
    }
  }, [answers, view, activeExamId, currentQuestionIndex, attemptStartedAt])

  useEffect(() => {
    if (view !== 'take' || attemptStartedAt === null) return undefined
    const tick = () => setNowMs(Date.now())
    const seed = window.setTimeout(tick, 0)
    const id = window.setInterval(tick, 15000)
    return () => {
      window.clearTimeout(seed)
      window.clearInterval(id)
    }
  }, [view, attemptStartedAt])

  const elapsedMinutes = Math.max(
    1,
    Math.floor(((nowMs ?? attemptStartedAt ?? 0) - (attemptStartedAt ?? 0)) / 60000),
  )

  const library = useMemo(() => {
    const isDone = (exam) => exam.status === 'graded' || exam.status === 'ungraded' || exam.status === 'completed'
    const ready = projectExams.filter((exam) => !isDone(exam))
    // Graded and ungraded are SEPARATE completion buckets, so an unscored attempt
    // is never presented among graded results (S3-004).
    const graded = projectExams.filter((exam) => exam.status === 'graded' || (exam.status === 'completed' && typeof exam.lastScore === 'number'))
    const ungraded = projectExams.filter((exam) => exam.status === 'ungraded' || (exam.status === 'completed' && typeof exam.lastScore !== 'number'))
    const scored = graded.filter((exam) => typeof exam.lastScore === 'number')

    return {
      ready,
      completed: graded,
      graded,
      ungraded,
      averageScore: scored.length
        ? Math.round(scored.reduce((total, exam) => total + exam.lastScore, 0) / scored.length)
        : null,
      // A resumable attempt must still exist AND belong to this project (S3-004).
      resumable: restoredAttemptValid
        ? projectExams.find((exam) => exam.id === restoredAttempt.examId) ?? null
        : null,
    }
  }, [projectExams, restoredAttempt, restoredAttemptValid])

  const groupedMisses = useMemo(() => {
    if (!activeResult) return []
    const misses = activeResult.questions.filter((question) => question.outcome === 'miss' || question.outcome === 'review')
    const map = new Map()
    misses.forEach((question) => {
      const key = reviewGrouping === 'concept' ? question.conceptLabel : question.segmentLabel
      map.set(key, [...(map.get(key) || []), question])
    })
    return Array.from(map.entries()).map(([title, items]) => ({ title, items }))
  }, [activeResult, reviewGrouping])

  const resetDraft = () => {
    setScopeMode('prefix')
    setPrefixValue(pool[0]?.prefix ?? '1')
    setRangeStart(1)
    setRangeEnd(Math.max(1, pool.length))
    setDraftTitle('Focused checkpoint')
  }

  const handleCreateExam = () => {
    if (!scopePreview.length) return
    const scopeLabel = scopeMode === 'prefix'
      ? `Prefix ${prefixValue.trim()}`
      : `Segments ${Math.min(rangeStart, rangeEnd)}–${Math.max(rangeStart, rangeEnd)}`
    const created = createExamRecord({
      id: `exam-${slugifyExamTitle(draftTitle.trim() || 'New exam')}-${Date.now().toString(36)}`,
      title: draftTitle.trim() || 'New exam',
      scopeLabel,
      questionIds: scopePreview.map((item) => item.id),
      pool,
      projectId: project?.id ?? null,
    })
    setExams((current) => [created, ...current])
    setActiveExamId(created.id)
    setView('library')
    resetDraft()
  }

  // Navigation IS a save boundary. The current answer is flushed synchronously
  // with the destination index before we move — reloading immediately after
  // "Save and next" cannot lose it (S3-004).
  const goToQuestion = (nextIndex) => {
    indexRef.current = nextIndex
    flushAttempt({ currentQuestionIndex: nextIndex })
    setCurrentQuestionIndex(nextIndex)
  }

  const handleOpenTake = (examId) => {
    const exam = exams.find((item) => item.id === examId)
    if (!exam) return
    const startedAt = Date.now()
    const freshAnswers = Object.fromEntries(exam.questions.map((question) => [question.id, '']))
    answersRef.current = freshAnswers
    indexRef.current = 0
    startedAtRef.current = startedAt
    setAttemptStartedAt(startedAt)
    setNowMs(startedAt)
    setActiveExamId(exam.id)
    setCurrentQuestionIndex(0)
    setAnswers(freshAnswers)
    setAutosaveState('Saved')
    setView('take')
    // Persist immediately so a reload right after opening resumes, not resets.
    writePersistedAttempt({ examId: exam.id, answers: freshAnswers, currentQuestionIndex: 0, startedAt, updatedAt: new Date().toISOString() })
  }

  const handleResumeAttempt = () => {
    if (!library.resumable) return
    const resumeAnswers = restoredAttempt?.answers ?? {}
    const resumeIndex = restoredAttempt?.currentQuestionIndex ?? 0
    const resumeStarted = restoredAttempt?.startedAt ?? Date.now()
    answersRef.current = resumeAnswers
    indexRef.current = resumeIndex
    startedAtRef.current = resumeStarted
    setActiveExamId(library.resumable.id)
    setCurrentQuestionIndex(resumeIndex)
    setAnswers(resumeAnswers)
    setAttemptStartedAt(resumeStarted)
    setView('take')
  }

  const handleSubmitExam = async () => {
    if (!activeExam) return
    // Grade the LATEST answers (the ref includes a value typed right before
    // Submit). The attempt is cleared only after the result is recorded.
    const finalAnswers = answersRef.current
    writePersistedAttempt(null)

    // Grade against the real exam contract. No provider → an honest UNGRADED
    // result, never a score fabricated from answer length or fixed question
    // indexes (the R-016 exam defect).
    const graded = await gradeExam({
      questions: activeExam.questions.map((q) => ({
        // The prompt IS the segment's own source text — the material the learner
        // is being assessed on — not just its label. Without it the grader has
        // nothing to grade against.
        id: q.id, prompt: q.source || q.label, concept: q.concept, segmentRef: q.id,
      })),
      answers: finalAnswers,
      sourceContext: activeExam.questions
        .map((q) => `${q.id} — ${q.concept}: ${q.source}`)
        .join('\n'),
    })

    let result
    if (graded.available) {
      const g = graded.result
      const outcomeOf = (r) => (r === 'correct' ? 'pass' : r === 'partial' ? 'review' : 'miss')
      const questions = g.questions.map((gq) => {
        const q = activeExam.questions.find((item) => item.id === gq.questionId) ?? {}
        return {
          ...q,
          answer: finalAnswers[gq.questionId] ?? '',
          outcome: outcomeOf(gq.result),
          conceptLabel: gq.concept || q.concept,
          segmentLabel: gq.segmentRef || q.label,
          remediationNote: gq.why || q.reviewNote,
          modelPoints: gq.modelPoints,
        }
      })
      result = {
        graded: true,
        score: g.score,
        passCount: g.correctCount,
        reviewCount: questions.filter((q) => q.outcome === 'review').length,
        missCount: g.missCount,
        weaknessMap: g.weaknessMap,
        questions,
        examId: activeExam.id,
        examTitle: activeExam.title,
      }
    } else {
      // Honest ungraded: the attempt is saved and its answers preserved, but no
      // score is invented.
      result = {
        graded: false,
        // Distinguish "no provider configured" from "a configured provider
        // failed", so Results can offer Setup AI vs Retry (S3-004).
        gradeReason: graded.reason === 'no-provider' ? 'unconfigured' : 'failed',
        gradeMessage: graded.reason === 'no-provider'
          ? 'AI grading is not configured, so this attempt is saved but not scored.'
          : (graded.message || 'Grading couldn’t complete, so this attempt is saved but not scored.'),
        score: null,
        passCount: 0,
        reviewCount: 0,
        missCount: 0,
        questions: activeExam.questions.map((q) => ({
          ...q,
          answer: finalAnswers[q.id] ?? '',
          outcome: 'ungraded',
          conceptLabel: q.concept,
          segmentLabel: q.label,
          remediationNote: q.reviewNote,
        })),
        examId: activeExam.id,
        examTitle: activeExam.title,
      }
    }

    setActiveResult(result)
    setExams((current) => current.map((exam) => (
      exam.id === activeExam.id
        // 'graded' vs 'ungraded' are distinct completion states, so the library
        // never files an unscored attempt under graded results (S3-004).
        ? { ...exam, status: result.graded ? 'graded' : 'ungraded', lastScore: result.graded ? result.score : null, lastResult: result }
        : exam
    )))
    setView('results')
  }

  // Re-grade an already-taken exam WITHOUT losing its recorded answers — the
  // recovery path from an ungraded/failed result once AI is set up (S3-004).
  const handleRetryGrading = async (exam) => {
    const target = exam ?? activeExam
    if (!target) return
    const recordedAnswers = Object.fromEntries((target.lastResult?.questions ?? []).map((q) => [q.id, q.answer ?? '']))
    answersRef.current = recordedAnswers
    setAnswers(recordedAnswers)
    setActiveExamId(target.id)
    await handleSubmitExam()
  }

  /**
   * Review a completed attempt.
   *
   * Only a real stored result is shown. Reviews are never reconstructed from
   * invented answers — a completed exam with no recorded result is shown as an
   * honest "not scored" outcome rather than fabricated data.
   */
  const handleReviewResults = (exam) => {
    const result = exam.lastResult ?? {
      graded: false,
      gradeMessage: 'This assessment has no recorded grade.',
      score: null,
      passCount: 0,
      reviewCount: 0,
      missCount: 0,
      questions: exam.questions.map((q) => ({
        ...q, answer: '', outcome: 'ungraded', conceptLabel: q.concept, segmentLabel: q.label,
      })),
    }
    setActiveExamId(exam.id)
    setActiveResult({ ...result, examId: exam.id, examTitle: exam.title })
    setView('results')
  }

  const handleJumpToStudy = (question) => {
    if (typeof window === 'undefined') return
    // Route by the canonical segment id — Study matches the handoff to a real
    // segment by identity, not by the "1.2" ref (which is not a store id). The
    // ref rides along as segmentRef for display and as a fallback.
    window.sessionStorage.setItem(EXAM_CONTEXT_STORAGE_KEY, JSON.stringify({
      segmentId: question.segmentId ?? question.id,
      segmentRef: question.id,
      examTitle: activeResult?.examTitle || activeExam?.title || 'Exam review',
      concept: question.conceptLabel,
      reason: question.outcome === 'miss' ? 'Exam miss' : 'Worth revisiting',
    }))
    shell.navigate('studyWorkspace')
  }

  const masthead = {
    library: {
      title: 'Assessments',
      lead: 'Scoped checks built from your own study range. Misses come back into study with their context.',
    },
    generate: { title: 'New assessment', lead: 'Choose the scope, check the preview, then save it into the library.' },
    take: { title: activeExam?.title ?? 'Attempt', lead: 'Answer inside the app. The attempt is saved as you work.' },
    results: { title: activeResult?.examTitle ?? 'Results', lead: 'Review what needs attention, then take it back into study.' },
  }[view]

  const screenSlots = {
    Layer3_Exams_Masthead: (
      <>
        <div style={{ display: 'grid', gap: spacing[8], minWidth: 0, maxWidth: '62ch' }}>
          <span style={{ ...typography.eyebrowLabel, color: colors.accentStrong }}>Exams</span>
          <h1 style={{ ...typography.pageTitle, margin: 0, color: colors.textStrong }}>{masthead.title}</h1>
          <p style={{ ...typography.supportSubtext, margin: 0, color: colors.textSoft }}>{masthead.lead}</p>
        </div>
        {view === 'library' ? (
          <GhostButton icon={<Plus size={16} strokeWidth={1.9} />} onClick={() => { resetDraft(); setView('generate') }}>
            New assessment
          </GhostButton>
        ) : (
          <GhostButton icon={<ArrowLeft size={16} strokeWidth={1.9} />} onClick={() => setView('library')}>
            Assessment library
          </GhostButton>
        )}
      </>
    ),

    Layer3_Exams_Body: (
      <>
        {view === 'library' ? (
          <LibraryView
            library={library}
            onStart={handleOpenTake}
            onResume={handleResumeAttempt}
            onReview={handleReviewResults}
            onCreate={() => { resetDraft(); setView('generate') }}
            staleAttempt={staleAttempt}
            onDismissStale={() => setStaleAttempt(false)}
          />
        ) : null}

        {view === 'generate' ? (
          <GenerateView
            isMobile={shell.isMobileViewport}
            poolSize={pool.length}
            draftTitle={draftTitle}
            onDraftTitle={setDraftTitle}
            scopeMode={scopeMode}
            onScopeMode={setScopeMode}
            prefixValue={prefixValue}
            onPrefixValue={setPrefixValue}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            onRangeStart={setRangeStart}
            onRangeEnd={setRangeEnd}
            scopePreview={scopePreview}
            onCancel={() => setView('library')}
            onCreate={handleCreateExam}
          />
        ) : null}

        {view === 'take' && activeExam ? (
          <TakeView
            isMobile={shell.isMobileViewport}
            exam={activeExam}
            currentIndex={currentQuestionIndex}
            currentQuestion={currentQuestion}
            answers={answers}
            answeredCount={answeredCount}
            autosaveState={autosaveState}
            elapsedMinutes={elapsedMinutes}
            onSelectQuestion={goToQuestion}
            onAnswer={(value) => {
              if (!currentQuestion) return
              setAnswers((current) => {
                const next = { ...current, [currentQuestion.id]: value }
                answersRef.current = next
                return next
              })
            }}
            onSubmit={handleSubmitExam}
          />
        ) : null}

        {view === 'results' && activeResult ? (
          <ResultsView
            result={activeResult}
            grouping={reviewGrouping}
            onGrouping={setReviewGrouping}
            groups={groupedMisses}
            onJumpToStudy={handleJumpToStudy}
            onDone={() => setView('library')}
            onSetupAi={() => shell.openAiConfig?.()}
            onRetryGrade={() => handleRetryGrading(activeExam)}
          />
        ) : null}
      </>
    ),
  }

  // At 390 the root is a fixed-height clipped viewport whose second row scrolls
  // inside it, and a card at the boundary gets cut while the region still holds
  // slack. Same rule as the Research desk: at this width the screen stops being
  // a viewport of its own and becomes a page that scrolls.
  const containerOverrides = shell.isMobileViewport
    ? {
      Layer2_Exams_Root: { style: { gridTemplateRows: 'auto auto', overflow: 'visible' } },
      Layer3_Exams_Body: { style: { minHeight: 0, overflow: 'visible' } },
    }
    : {}

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

// ── 1. take the next assessment · 2. manage the library ──────────────────────

function LibraryView({ library, onStart, onResume, onReview, onCreate, staleAttempt, onDismissStale }) {
  const [lead, ...rest] = library.ready

  return (
    <>
      {staleAttempt ? (
        <div style={{ ...surface, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[16], flexWrap: 'wrap', padding: spacing[16], borderColor: colors.review }}>
          <span style={{ ...typography.metaText, color: colors.textBody }}>
            An in-progress attempt couldn’t be resumed — its assessment no longer exists. It has been cleared so you can start fresh.
          </span>
          <GhostButton onClick={onDismissStale}>Dismiss</GhostButton>
        </div>
      ) : null}
      <Section
        title="Ready to take"
        count={library.ready.length}
        empty={!library.ready.length}
        emptyTitle="No assessment is waiting"
        emptyText="Build one from a study range and it will appear here."
        emptyAction={<GhostButton icon={<Plus size={16} strokeWidth={1.9} />} onClick={onCreate}>New assessment</GhostButton>}
      >
        {lead ? (
          <LeadExamRow
            exam={lead}
            resumable={library.resumable?.id === lead.id}
            onStart={() => onStart(lead.id)}
            onResume={onResume}
          />
        ) : null}
        {rest.map((exam) => (
          <ExamRow key={exam.id} exam={exam} onOpen={() => onStart(exam.id)} />
        ))}
      </Section>

      <Section
        title="Completed"
        count={library.completed.length}
        aside={library.averageScore !== null ? (
          <span style={{ ...typography.metaText, color: colors.textSoft }}>
            Average score <strong style={{ color: colors.textStrong }}>{library.averageScore}%</strong>
          </span>
        ) : null}
        empty={!library.completed.length}
        emptyTitle="Nothing completed yet"
        emptyText="Scores and remediation links appear here after your first attempt."
      >
        {library.completed.map((exam) => (
          <ExamRow
            key={exam.id}
            exam={exam}
            onOpen={() => onStart(exam.id)}
            onReview={() => onReview(exam)}
          />
        ))}
      </Section>

      {/* Attempted but NOT scored — kept distinct from graded results so the
          taxonomy is honest (S3-004). Review offers Setup AI / retry grading. */}
      {library.ungraded.length ? (
        <Section title="Attempted · not scored" count={library.ungraded.length}>
          {library.ungraded.map((exam) => (
            <ExamRow
              key={exam.id}
              exam={exam}
              onOpen={() => onStart(exam.id)}
              onReview={() => onReview(exam)}
            />
          ))}
        </Section>
      ) : null}
    </>
  )
}

/**
 * The next assessment. The SAME record as the library holds — promoted to the
 * first row and given the primary action, rather than copied into a card above
 * a list that then repeats it.
 */
function LeadExamRow({ exam, resumable, onStart, onResume }) {
  return (
    <article
      style={{
        ...surface,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: spacing[24],
        padding: spacing[24],
        borderColor: 'rgba(147, 197, 253, 0.7)',
        background: `linear-gradient(180deg, ${colors.accentWash} 0%, ${colors.surfacePrimary} 68%)`,
        // A tighter, bluer shadow than elevation.rest. The 44px-blur ambient
        // shadow printed a soft band the full width of the card underneath it,
        // which at a glance reads as a second card edge rather than as lift.
        boxShadow: '0 12px 28px rgba(37, 99, 235, 0.1)',
      }}
    >
      <div style={{ display: 'grid', gap: spacing[12], minWidth: 0, flex: '1 1 340px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8], flexWrap: 'wrap' }}>
          <Badge tone={resumable ? 'review' : 'ready'}>{resumable ? 'In progress' : 'Ready'}</Badge>
          <span style={{ ...typography.metaText, color: colors.textSoft }}>
            {exam.scopeLabel} · {exam.questions.length} questions · ~{Math.max(8, exam.questions.length * 6)} min
          </span>
        </div>
        <h2 style={{ ...typography.cardTitle, margin: 0, color: colors.textStrong }}>{exam.title}</h2>
        {/* What it covers. The promoted row has to earn its promotion with
            information, not with a larger button: "should I take this now?" is
            answered by the segments, not by the title. */}
        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[8], margin: 0, padding: 0, listStyle: 'none' }}>
          {exam.questions.map((question) => (
            <li key={question.id}>
              <Badge tone="quiet">{question.label}</Badge>
            </li>
          ))}
        </ul>
      </div>
      <PrimaryCTA
        icon={<Play size={16} strokeWidth={1.9} />}
        minWidth={220}
        height={48}
        onClick={resumable ? onResume : onStart}
      >
        {resumable ? 'Resume attempt' : 'Start exam'}
      </PrimaryCTA>
    </article>
  )
}

function ExamRow({ exam, onOpen, onReview = null }) {
  const completed = exam.status === 'completed'

  return (
    <article
      style={{
        ...surface,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: spacing[16],
        padding: `${spacing[16]} ${spacing[20]}`,
      }}
    >
      <div style={{ display: 'grid', gap: spacing[4], minWidth: 0, flex: '1 1 260px' }}>
        <strong style={{ ...typography.sectionTitle, color: colors.textStrong }}>{exam.title}</strong>
        <span style={{ ...typography.metaText, color: colors.textSoft }}>
          {exam.scopeLabel} · {exam.questions.length} questions · created {exam.createdAt.toLowerCase()}
        </span>
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[12] }}>
        {completed && typeof exam.lastScore === 'number' ? (
          <Badge tone={exam.lastScore >= 70 ? 'ready' : 'review'}>{exam.lastScore}%</Badge>
        ) : null}
        {/* Reviewing a completed attempt is the third of the three jobs this
            screen exists for, so it is the primary action on a completed row —
            retaking is the secondary one. */}
        {completed && onReview ? (
          <GhostButton size="sm" onClick={onReview}>Review results</GhostButton>
        ) : null}
        <GhostButton size="sm" onClick={onOpen}>{completed ? 'Retake' : 'Open exam'}</GhostButton>
      </div>
    </article>
  )
}

function Section({ title, count, children, empty, emptyTitle, emptyText, emptyAction, aside = null }) {
  return (
    <section style={{ display: 'grid', gap: spacing[12], minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12] }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8] }}>
          <h2 style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textMuted }}>{title}</h2>
          {count ? <Badge tone="quiet">{count}</Badge> : null}
        </span>
        {aside}
      </div>
      {empty ? (
        <div style={{ ...surface, display: 'grid', gap: spacing[8], justifyItems: 'start', padding: spacing[24] }}>
          <strong style={{ ...typography.sectionTitle, color: colors.textStrong }}>{emptyTitle}</strong>
          <p style={{ ...typography.supportSubtext, margin: 0, color: colors.textSoft, maxWidth: '52ch' }}>{emptyText}</p>
          {emptyAction}
        </div>
      ) : children}
    </section>
  )
}

// ── create ───────────────────────────────────────────────────────────────────

function GenerateView({
  isMobile = false,
  poolSize = 0,
  draftTitle, onDraftTitle, scopeMode, onScopeMode, prefixValue, onPrefixValue,
  rangeStart, rangeEnd, onRangeStart, onRangeEnd, scopePreview, onCancel, onCreate,
}) {
  const conceptCount = new Set(scopePreview.map((item) => item.concept)).size
  const estimatedMinutes = Math.max(8, scopePreview.length * 6)

  // An assessment can only cover segments the project actually has. With none
  // approved yet there is nothing to build from, and the builder says so rather
  // than presenting scope inputs that can only ever preview zero questions.
  if (!poolSize) {
    return (
      <div style={{ ...surface, display: 'grid', gap: spacing[8], justifyItems: 'start', padding: spacing[24], maxWidth: '60ch' }}>
        <strong style={{ ...typography.sectionTitle, color: colors.textStrong }}>No segments to assess yet</strong>
        <p style={{ ...typography.supportSubtext, margin: 0, color: colors.textSoft }}>
          Assessments are built from this project’s approved segments. Segment a
          source and approve it, then come back to build a checkpoint over it.
        </p>
        <GhostButton icon={<ArrowLeft size={16} strokeWidth={1.9} />} onClick={onCancel}>Back to library</GhostButton>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'minmax(320px, 0.9fr) minmax(0, 1.1fr)', gap: spacing[24], alignItems: 'start' }}>
      <section style={{ ...surface, display: 'grid', gap: spacing[20], padding: spacing[24] }}>
        <Field label="Assessment title">
          <input style={inputStyle} value={draftTitle} onChange={(event) => onDraftTitle(event.target.value)} />
        </Field>

        <Field label="Scope">
          <div style={{ display: 'inline-flex', gap: spacing[8] }}>
            <Chip active={scopeMode === 'prefix'} onClick={() => onScopeMode('prefix')} icon={<Layers3 size={14} strokeWidth={1.9} />}>
              Prefix
            </Chip>
            <Chip active={scopeMode === 'range'} onClick={() => onScopeMode('range')} icon={<Target size={14} strokeWidth={1.9} />}>
              Tracker range
            </Chip>
          </div>
        </Field>

        {scopeMode === 'prefix' ? (
          <Field label="Prefix">
            <input
              style={inputStyle}
              value={prefixValue}
              placeholder="Example: 2 or 2.1"
              onChange={(event) => onPrefixValue(event.target.value)}
            />
          </Field>
        ) : (
          <Field label="Tracker range">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[12] }}>
              <input type="number" min="1" max={poolSize} style={inputStyle} value={rangeStart} aria-label="Range start" onChange={(event) => onRangeStart(Number(event.target.value))} />
              <input type="number" min="1" max={poolSize} style={inputStyle} value={rangeEnd} aria-label="Range end" onChange={(event) => onRangeEnd(Number(event.target.value))} />
            </div>
          </Field>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12], flexWrap: 'wrap' }}>
          <GhostButton icon={<ArrowLeft size={16} strokeWidth={1.9} />} onClick={onCancel}>Cancel</GhostButton>
          <PrimaryCTA
            icon={<Save size={16} strokeWidth={1.9} />}
            minWidth={220}
            height={48}
            disabled={!scopePreview.length}
            onClick={onCreate}
          >
            Save assessment
          </PrimaryCTA>
        </div>
      </section>

      <section style={{ ...surface, display: 'grid', gap: spacing[16], padding: spacing[24] }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: spacing[12] }}>
          <h2 style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textMuted }}>Included</h2>
          <span style={{ ...typography.metaText, color: colors.textSoft }}>
            {scopePreview.length || '—'} questions · {conceptCount || '—'} concepts · ~{estimatedMinutes}m
          </span>
        </div>
        <div style={{ display: 'grid', gap: spacing[8] }}>
          {scopePreview.length ? scopePreview.map((item) => (
            <div key={item.id} style={{ display: 'grid', gap: spacing[4], padding: `${spacing[12]} ${spacing[16]}`, border: `1px solid ${colors.borderSoft}`, borderRadius: radius[12], background: colors.surfaceSoft }}>
              <strong style={{ ...typography.subsectionTitle, color: colors.textStrong }}>{item.label}</strong>
              <span style={{ ...typography.metaText, color: colors.textSoft }}>{item.concept}</span>
            </div>
          )) : (
            <p style={{ ...typography.supportSubtext, margin: 0, color: colors.textSoft }}>
              Choose a prefix or range that includes at least one segment.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'grid', gap: spacing[8] }}>
      <span style={{ ...typography.eyebrowLabel, color: colors.textMuted }}>{label}</span>
      {children}
    </label>
  )
}

// ── take ─────────────────────────────────────────────────────────────────────

// Every question states its task explicitly, so the user knows whether to
// translate, explain, analyse, or recall — not just an Arabic passage over a
// blank box (S3-004). Study-segment assessments are translation by default.
const TASK_INSTRUCTION = {
  translate: 'Translate the passage below into clear English.',
  explain: 'Explain the ruling in the passage below, in your own words.',
  analyse: 'Analyse the passage below — its structure, evidence, and legal frame.',
  recall: 'Answer the question below from memory.',
}
function questionTaskInstruction(task) {
  return TASK_INSTRUCTION[task] || TASK_INSTRUCTION.translate
}

function TakeView({
  isMobile = false,
  exam, currentIndex, currentQuestion, answers, answeredCount,
  autosaveState, elapsedMinutes, onSelectQuestion, onAnswer, onSubmit,
}) {
  const isLast = currentIndex === exam.questions.length - 1

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'minmax(220px, 0.6fr) minmax(0, 2fr)', gap: spacing[24], alignItems: 'start' }}>
      <nav style={{ ...surface, display: 'grid', gap: spacing[8], padding: spacing[16] }} aria-label="Questions">
        {exam.questions.map((question, index) => {
          const answered = Boolean((answers[question.id] || '').trim())
          const current = index === currentIndex
          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onSelectQuestion(index)}
              style={{
                display: 'grid',
                gap: spacing[4],
                minHeight: '52px',
                padding: `${spacing[8]} ${spacing[12]}`,
                textAlign: 'left',
                border: `1px solid ${current ? 'rgba(147, 197, 253, 0.8)' : 'transparent'}`,
                borderRadius: radius[12],
                background: current ? colors.accentWash : 'transparent',
                cursor: 'pointer',
              }}
            >
              <span style={{ ...typography.eyebrowLabel, color: answered ? colors.successStrong : colors.textSoft }}>
                {answered ? 'Answered' : `Question ${index + 1}`}
              </span>
              <UserText
                text={question.label}
                latinRole={typography.supportSubtext}
                style={{ color: current ? colors.accentStrong : colors.textBody }}
              />
            </button>
          )
        })}
      </nav>

      <section style={{ display: 'grid', gap: spacing[16] }}>
        <div style={{ ...surface, display: 'grid', gap: spacing[16], padding: spacing[24] }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[16], flexWrap: 'wrap' }}>
            <div style={{ display: 'grid', gap: spacing[4], minWidth: 0 }}>
              <span style={{ ...typography.eyebrowLabel, color: colors.textMuted }}>
                Question {currentIndex + 1} of {exam.questions.length}
              </span>
              <strong style={{ ...typography.sectionTitle, color: colors.textStrong }}>
                {currentQuestion?.label} · {currentQuestion?.concept}
              </strong>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8] }}>
              <Badge tone={autosaveState === 'Saved' ? 'ready' : autosaveState === 'Saving' ? 'quiet' : 'critical'} icon={<Save size={12} strokeWidth={1.9} />}>
                {autosaveState}
              </Badge>
              <Badge tone="quiet">{answeredCount} of {exam.questions.length} answered</Badge>
              <Badge tone="quiet">{elapsedMinutes} min elapsed</Badge>
            </div>
          </div>

          <div style={{ display: 'grid', gap: spacing[4] }}>
            <span style={{ ...typography.eyebrowLabel, color: colors.accentStrong }}>Your task</span>
            <strong style={{ ...typography.bodyText, color: colors.textStrong }}>
              {questionTaskInstruction(currentQuestion?.task)}
            </strong>
          </div>

          <p dir="rtl" lang="ar" style={{ ...typography.bodyText, margin: 0, padding: spacing[16], borderRadius: radius[12], background: colors.surfaceSoft, border: `1px solid ${colors.borderSoft}`, color: colors.textBody }}>
            {currentQuestion?.source}
          </p>

          <textarea
            aria-label={`Answer for ${currentQuestion?.label ?? 'this question'}`}
            value={answers[currentQuestion?.id] || ''}
            onChange={(event) => onAnswer(event.target.value)}
            placeholder="Write your answer here. Arapal saves your progress as you go."
            style={{
              width: '100%',
              minHeight: '260px',
              resize: 'vertical',
              padding: spacing[16],
              border: `1px solid ${colors.borderSoft}`,
              borderRadius: radius[12],
              background: colors.surfacePrimary,
              color: colors.textStrong,
              ...typography.bodyText,
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12], flexWrap: 'wrap' }}>
            <GhostButton
              icon={<ArrowLeft size={16} strokeWidth={1.9} />}
              disabled={currentIndex === 0}
              onClick={() => onSelectQuestion(Math.max(0, currentIndex - 1))}
            >
              Previous
            </GhostButton>
            {isLast ? (
              <PrimaryCTA icon={<Check size={16} strokeWidth={1.9} />} minWidth={220} height={48} onClick={onSubmit}>
                Submit for grading
              </PrimaryCTA>
            ) : (
              <PrimaryCTA
                endIcon={<ArrowRight size={16} strokeWidth={1.9} />}
                minWidth={220}
                height={48}
                onClick={() => onSelectQuestion(Math.min(exam.questions.length - 1, currentIndex + 1))}
              >
                Save and next
              </PrimaryCTA>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

// ── review ───────────────────────────────────────────────────────────────────

function ResultsView({ result, grouping, onGrouping, groups, onJumpToStudy, onDone, onSetupAi, onRetryGrade }) {
  // The page's own heading is "Needs attention", and every row's action is
  // "Open in study" — yet the one dominant blue control was "Back to
  // assessments", which is the action that ABANDONS the remediation the page
  // exists to start. The primary action now matches what the page is for, and
  // falls back to leaving only when there is genuinely nothing to remediate.
  //
  // That also settles the duplicated return: the header already offers
  // "Assessment library", so a second, louder copy of the same destination was
  // spending the page's most valuable control on its least valuable outcome.
  const remediationCount = groups.reduce((total, group) => total + group.items.length, 0)
  const firstRemediation = groups[0]?.items?.[0] ?? null
  return (
    <>
      <section style={{ ...surface, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[24], flexWrap: 'wrap', padding: spacing[24] }}>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: spacing[16], flexWrap: 'wrap', minWidth: 0 }}>
          {result.graded ? (
            <>
              <span style={{ ...typography.displayTitle, color: colors.textStrong }}>{result.score}%</span>
              {/* Zero-count badges are noise: "0 worth reviewing" in review amber
                  draws the eye to a state that does not exist. Only outcomes that
                  actually occurred get a badge. */}
              <div style={{ display: 'inline-flex', gap: spacing[8], flexWrap: 'wrap' }}>
                {result.passCount ? <Badge tone="ready">{result.passCount} strong</Badge> : null}
                {result.reviewCount ? <Badge tone="review">{result.reviewCount} worth reviewing</Badge> : null}
                {result.missCount ? <Badge tone="critical">{result.missCount} misses</Badge> : null}
              </div>
            </>
          ) : (
            // Honest ungraded: no fabricated score. The attempt is saved.
            <div style={{ display: 'grid', gap: spacing[4] }}>
              <span style={{ ...typography.sectionTitle, color: colors.textStrong }}>Attempt saved · not scored</span>
              <span style={{ ...typography.metaText, color: colors.textSoft, maxWidth: '52ch' }}>
                {result.gradeMessage}
              </span>
            </div>
          )}
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[12], flexWrap: 'wrap' }}>
          {!result.graded ? (
            // Ungraded recovery, answers preserved (S3-004): Setup AI when no
            // provider is configured, otherwise retry grading the saved answers.
            <>
              {result.gradeReason === 'unconfigured' ? (
                <>
                  <PrimaryCTA icon={<Sparkles size={16} strokeWidth={1.9} />} minWidth={200} height={48} onClick={onSetupAi}>
                    Set up AI
                  </PrimaryCTA>
                  <GhostButton size="md" onClick={onRetryGrade}>Retry grading</GhostButton>
                </>
              ) : (
                <PrimaryCTA icon={<Check size={16} strokeWidth={1.9} />} minWidth={200} height={48} onClick={onRetryGrade}>
                  Retry grading
                </PrimaryCTA>
              )}
              <GhostButton size="md" onClick={onDone}>Assessment library</GhostButton>
            </>
          ) : firstRemediation ? (
            <>
              <PrimaryCTA
                icon={<BookOpen size={16} strokeWidth={1.9} />}
                minWidth={220}
                height={48}
                onClick={() => onJumpToStudy(firstRemediation)}
              >
                Study what needs attention
              </PrimaryCTA>
              <GhostButton size="md" onClick={onDone}>Assessment library</GhostButton>
            </>
          ) : (
            <PrimaryCTA icon={<CheckCircle2 size={16} strokeWidth={1.9} />} minWidth={220} height={48} onClick={onDone}>
              Back to assessments
            </PrimaryCTA>
          )}
        </div>
      </section>

      <section style={{ display: 'grid', gap: spacing[12] }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12], flexWrap: 'wrap' }}>
          <h2 style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textMuted }}>
            Needs attention{remediationCount ? ` · ${remediationCount}` : ''}
          </h2>
          <div style={{ display: 'inline-flex', gap: spacing[8] }}>
            <Chip active={grouping === 'concept'} onClick={() => onGrouping('concept')}>By concept</Chip>
            <Chip active={grouping === 'segment'} onClick={() => onGrouping('segment')}>By segment</Chip>
          </div>
        </div>

        {groups.length ? groups.map((group) => (
          <div key={group.title} style={{ ...surface, display: 'grid', gap: spacing[12], padding: spacing[20] }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8] }}>
              <strong style={{ ...typography.sectionTitle, color: colors.textStrong }}>{group.title}</strong>
              <Badge tone="quiet">{group.items.length}</Badge>
            </div>
            {group.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[16], flexWrap: 'wrap', padding: `${spacing[12]} ${spacing[16]}`, border: `1px solid ${colors.borderSoft}`, borderRadius: radius[12], background: colors.surfaceSoft }}>
                <div style={{ display: 'grid', gap: spacing[4], minWidth: 0, flex: '1 1 320px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8], flexWrap: 'wrap' }}>
                    <Badge tone={item.outcome === 'miss' ? 'critical' : 'review'}>
                      {item.outcome === 'miss' ? 'Needs review' : 'Worth revisiting'}
                    </Badge>
                    <UserText text={item.segmentLabel} latinRole={typography.metaText} style={{ color: colors.textSoft }} />
                  </div>
                  <p style={{ ...typography.supportSubtext, margin: 0, color: colors.textBody }}>{item.remediationNote}</p>
                </div>
                <GhostButton size="sm" icon={<BookOpen size={14} strokeWidth={1.9} />} onClick={() => onJumpToStudy(item)}>
                  Open in study
                </GhostButton>
              </div>
            ))}
          </div>
        )) : (
          <div style={{ ...surface, display: 'grid', gap: spacing[8], padding: spacing[24] }}>
            <strong style={{ ...typography.sectionTitle, color: colors.textStrong }}>
              {result.graded ? 'Nothing needs remediation' : 'Not graded yet'}
            </strong>
            <p style={{ ...typography.supportSubtext, margin: 0, color: colors.textSoft }}>
              {result.graded
                ? 'Every answer in this attempt was strong.'
                : 'This attempt is saved but has not been graded, so there is nothing to remediate yet.'}
            </p>
          </div>
        )}
      </section>
    </>
  )
}

// ── shared surfaces ──────────────────────────────────────────────────────────

const surface = {
  border: `1px solid ${colors.borderSoft}`,
  borderRadius: radius[16],
  background: colors.surfacePrimary,
  minWidth: 0,
}

const inputStyle = {
  minHeight: '44px',
  padding: `0 ${spacing[16]}`,
  border: `1px solid ${colors.borderSoft}`,
  borderRadius: radius[12],
  background: colors.surfacePrimary,
  color: colors.textStrong,
  ...typography.bodyText,
}
