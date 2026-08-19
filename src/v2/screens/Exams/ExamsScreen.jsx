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
  Target,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge, Chip, GhostButton } from '../../foundation/primitives/CompactControls'
import PrimaryCTA from '../../foundation/primitives/PrimaryCTA'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import { colors, radius, spacing, typography } from '../../foundation/tokens'
import layoutContract from './ExamsScreen.contract'
import {
  createExamRecord,
  evaluateAttempt,
  EXAM_CONTEXT_STORAGE_KEY,
  filterScopeItems,
  hydrateInitialExams,
  readPersistedAttempt,
  slugifyExamTitle,
  studyScopePool,
  writePersistedAttempt,
} from './examsModel'

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
  const restoredAttempt = useMemo(() => readPersistedAttempt(), [])
  const [view, setView] = useState(() => (restoredAttempt?.examId ? 'take' : 'library'))
  const [exams, setExams] = useState(() => hydrateInitialExams())
  const [scopeMode, setScopeMode] = useState('prefix')
  const [prefixValue, setPrefixValue] = useState('2')
  const [rangeStart, setRangeStart] = useState(2)
  const [rangeEnd, setRangeEnd] = useState(6)
  const [draftTitle, setDraftTitle] = useState('Focused checkpoint')
  const [activeExamId, setActiveExamId] = useState(restoredAttempt?.examId ?? null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(restoredAttempt?.currentQuestionIndex ?? 0)
  const [answers, setAnswers] = useState(restoredAttempt?.answers ?? {})
  const [autosaveState, setAutosaveState] = useState('Saved')
  const [reviewGrouping, setReviewGrouping] = useState('concept')
  const [activeResult, setActiveResult] = useState(null)
  const [attemptStartedAt, setAttemptStartedAt] = useState(restoredAttempt?.startedAt ?? null)
  const [nowMs, setNowMs] = useState(null)
  const autosaveTimerRef = useRef(null)

  const activeExam = useMemo(
    () => exams.find((exam) => exam.id === activeExamId) || null,
    [activeExamId, exams],
  )
  const scopePreview = useMemo(
    () => filterScopeItems(scopeMode, prefixValue, rangeStart, rangeEnd),
    [prefixValue, rangeEnd, rangeStart, scopeMode],
  )
  const currentQuestion = activeExam?.questions[currentQuestionIndex] ?? null
  const answeredCount = useMemo(
    () => Object.values(answers).filter((value) => value.trim()).length,
    [answers],
  )

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
    const ready = exams.filter((exam) => exam.status !== 'completed')
    const completed = exams.filter((exam) => exam.status === 'completed')
    const scored = completed.filter((exam) => typeof exam.lastScore === 'number')

    return {
      ready,
      completed,
      // The one aggregate that says something a list does not: how you are
      // doing. "Saved exams: 2" and "Ready to take: 1" were counters for a list
      // of two items sitting directly beneath them.
      averageScore: scored.length
        ? Math.round(scored.reduce((total, exam) => total + exam.lastScore, 0) / scored.length)
        : null,
      resumable: restoredAttempt?.examId
        ? exams.find((exam) => exam.id === restoredAttempt.examId) ?? null
        : null,
    }
  }, [exams, restoredAttempt])

  const groupedMisses = useMemo(() => {
    if (!activeResult) return []
    const misses = activeResult.questions.filter((question) => question.outcome !== 'pass')
    const map = new Map()
    misses.forEach((question) => {
      const key = reviewGrouping === 'concept' ? question.conceptLabel : question.segmentLabel
      map.set(key, [...(map.get(key) || []), question])
    })
    return Array.from(map.entries()).map(([title, items]) => ({ title, items }))
  }, [activeResult, reviewGrouping])

  const resetDraft = () => {
    setScopeMode('prefix')
    setPrefixValue('2')
    setRangeStart(2)
    setRangeEnd(6)
    setDraftTitle('Focused checkpoint')
  }

  const handleCreateExam = () => {
    if (!scopePreview.length) return
    const scopeLabel = scopeMode === 'prefix'
      ? `Prefix ${prefixValue.trim()}`
      : `Trackers ${Math.min(rangeStart, rangeEnd)}–${Math.max(rangeStart, rangeEnd)}`
    const created = createExamRecord({
      id: `exam-${slugifyExamTitle(draftTitle.trim() || 'New exam')}-${Date.now().toString(36)}`,
      title: draftTitle.trim() || 'New exam',
      scopeLabel,
      questionIds: scopePreview.map((item) => item.id),
    })
    setExams((current) => [created, ...current])
    setActiveExamId(created.id)
    setView('library')
    resetDraft()
  }

  const handleOpenTake = (examId) => {
    const exam = exams.find((item) => item.id === examId)
    if (!exam) return
    const startedAt = Date.now()
    setAttemptStartedAt(startedAt)
    setNowMs(startedAt)
    setActiveExamId(exam.id)
    setCurrentQuestionIndex(0)
    setAnswers(Object.fromEntries(exam.questions.map((question) => [question.id, ''])))
    setAutosaveState('Saved')
    setView('take')
  }

  const handleResumeAttempt = () => {
    if (!library.resumable) return
    setActiveExamId(library.resumable.id)
    setCurrentQuestionIndex(restoredAttempt?.currentQuestionIndex ?? 0)
    setAnswers(restoredAttempt?.answers ?? {})
    setAttemptStartedAt(restoredAttempt?.startedAt ?? Date.now())
    setView('take')
  }

  const handleSubmitExam = () => {
    if (!activeExam) return
    const result = evaluateAttempt(activeExam, answers)
    writePersistedAttempt(null)
    setActiveResult({ ...result, examId: activeExam.id, examTitle: activeExam.title })
    setExams((current) => current.map((exam) => (
      exam.id === activeExam.id
        ? { ...exam, status: 'completed', lastScore: result.score, lastResult: result }
        : exam
    )))
    setView('results')
  }

  /**
   * Review a completed attempt.
   *
   * A completed exam that carries a stored result reopens that result. The two
   * seeded exams predate any attempt and have only a score, so their review is
   * reconstructed from fixture answers — exactly as the legacy screen did it,
   * and marked here as fixture reconstruction rather than left to look like
   * recorded data.
   */
  const handleReviewResults = (exam) => {
    const result = exam.lastResult ?? evaluateAttempt(
      exam,
      Object.fromEntries(exam.questions.map((question, index) => [
        question.id,
        index % 3 === 0
          ? 'Short answer draft'
          : 'A fuller answer that holds the distinction more carefully and connects the ruling back to study context.',
      ])),
    )
    setActiveExamId(exam.id)
    setActiveResult({ ...result, examId: exam.id, examTitle: exam.title })
    setView('results')
  }

  const handleJumpToStudy = (question) => {
    if (typeof window === 'undefined') return
    window.sessionStorage.setItem(EXAM_CONTEXT_STORAGE_KEY, JSON.stringify({
      segmentId: question.id,
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
          />
        ) : null}

        {view === 'generate' ? (
          <GenerateView
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
            exam={activeExam}
            currentIndex={currentQuestionIndex}
            currentQuestion={currentQuestion}
            answers={answers}
            answeredCount={answeredCount}
            autosaveState={autosaveState}
            elapsedMinutes={elapsedMinutes}
            onSelectQuestion={setCurrentQuestionIndex}
            onAnswer={(value) => currentQuestion && setAnswers((current) => ({ ...current, [currentQuestion.id]: value }))}
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
          />
        ) : null}
      </>
    ),
  }

  return <V2ScreenFrame contract={layoutContract} route={route} shell={shell} screenSlots={screenSlots} />
}

// ── 1. take the next assessment · 2. manage the library ──────────────────────

function LibraryView({ library, onStart, onResume, onReview, onCreate }) {
  const [lead, ...rest] = library.ready

  return (
    <>
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
  draftTitle, onDraftTitle, scopeMode, onScopeMode, prefixValue, onPrefixValue,
  rangeStart, rangeEnd, onRangeStart, onRangeEnd, scopePreview, onCancel, onCreate,
}) {
  const conceptCount = new Set(scopePreview.map((item) => item.concept)).size
  const estimatedMinutes = Math.max(8, scopePreview.length * 6)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 0.9fr) minmax(0, 1.1fr)', gap: spacing[24], alignItems: 'start' }}>
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
              <input type="number" min="1" max={studyScopePool.length} style={inputStyle} value={rangeStart} aria-label="Range start" onChange={(event) => onRangeStart(Number(event.target.value))} />
              <input type="number" min="1" max={studyScopePool.length} style={inputStyle} value={rangeEnd} aria-label="Range end" onChange={(event) => onRangeEnd(Number(event.target.value))} />
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

function TakeView({
  exam, currentIndex, currentQuestion, answers, answeredCount,
  autosaveState, elapsedMinutes, onSelectQuestion, onAnswer, onSubmit,
}) {
  const isLast = currentIndex === exam.questions.length - 1

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 0.6fr) minmax(0, 2fr)', gap: spacing[24], alignItems: 'start' }}>
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
              <span style={{ ...typography.eyebrowLabel, color: answered ? colors.successStrong : colors.textFaint }}>
                {answered ? 'Answered' : `Question ${index + 1}`}
              </span>
              <span style={{ ...typography.supportSubtext, color: current ? colors.accentStrong : colors.textBody }}>
                {question.label}
              </span>
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

          <p style={{ ...typography.bodyText, margin: 0, padding: spacing[16], borderRadius: radius[12], background: colors.surfaceSoft, border: `1px solid ${colors.borderSoft}`, color: colors.textBody }}>
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

function ResultsView({ result, grouping, onGrouping, groups, onJumpToStudy, onDone }) {
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
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: spacing[16] }}>
          <span style={{ ...typography.displayTitle, color: colors.textStrong }}>{result.score}%</span>
          {/* Zero-count badges are noise: "0 worth reviewing" in review amber
              draws the eye to a state that does not exist. Only outcomes that
              actually occurred get a badge. */}
          <div style={{ display: 'inline-flex', gap: spacing[8], flexWrap: 'wrap' }}>
            {result.passCount ? <Badge tone="ready">{result.passCount} strong</Badge> : null}
            {result.reviewCount ? <Badge tone="review">{result.reviewCount} worth reviewing</Badge> : null}
            {result.missCount ? <Badge tone="critical">{result.missCount} misses</Badge> : null}
          </div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[12], flexWrap: 'wrap' }}>
          {firstRemediation ? (
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
                    <span style={{ ...typography.metaText, color: colors.textSoft }}>{item.segmentLabel}</span>
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
            <strong style={{ ...typography.sectionTitle, color: colors.textStrong }}>Nothing needs remediation</strong>
            <p style={{ ...typography.supportSubtext, margin: 0, color: colors.textSoft }}>Every answer in this attempt was strong.</p>
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
