// The Arapal store.
//
// Plain JavaScript with a subscribe/getSnapshot pair, so it is usable from
// tests without React and bindable via useSyncExternalStore. Every mutation
// goes through an action, every action persists, and every persist reports
// whether it actually succeeded.

import * as storage from './storage.js'
import {
  createProject, createSource, createSegment, createDraft,
  createStudyRecord, createResult, createExam, createAttempt,
  createProposal, createNote, segmentKey,
} from './schema.js'
import { evaluateTranslation } from './evaluation.js'
import { gradeStudyAttempt } from '../services/ai/index.js'

let state = storage.read()
let lastWriteOk = true
const listeners = new Set()
// A single frozen empty array so a segment with no notes returns a stable
// reference — the selector cache treats an unchanged empty list as unchanged.
const EMPTY_NOTES = Object.freeze([])

function commit(next) {
  state = next
  lastWriteOk = storage.write(state)
  listeners.forEach((l) => l())
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const getSnapshot = () => state
export const persistenceHealthy = () => lastWriteOk

/** Test seam. Never called by product code. */
export function __resetForTests(seed = storage.emptyState()) {
  state = seed
  listeners.forEach((l) => l())
}

// ── selectors ────────────────────────────────────────────────────────────────

export const listProjects = (s = state) =>
  Object.values(s.projects).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

export const getProject = (projectId, s = state) => s.projects[projectId] ?? null

export const getCurrentProject = (s = state) =>
  s.currentProjectId ? s.projects[s.currentProjectId] ?? null : null

export const listSegments = (projectId, s = state) =>
  Object.values(s.segments)
    .filter((seg) => seg.projectId === projectId)
    .sort((a, b) => a.index - b.index)

export const getSegment = (segmentId, s = state) => s.segments[segmentId] ?? null

export const getDraft = (projectId, segmentId, s = state) =>
  s.drafts[segmentKey(projectId, segmentId)] ?? null

export const getStudyRecord = (projectId, segmentId, s = state) =>
  s.studyRecords[segmentKey(projectId, segmentId)] ?? null

export const listNotes = (projectId, segmentId, s = state) =>
  s.notes[segmentKey(projectId, segmentId)] ?? EMPTY_NOTES

export const getResult = (resultId, s = state) => (resultId ? s.results[resultId] ?? null : null)

export const listExams = (projectId, s = state) =>
  Object.values(s.exams).filter((e) => e.projectId === projectId)

export const getAttempt = (attemptId, s = state) => s.attempts[attemptId] ?? null

export const findOpenAttempt = (examId, s = state) =>
  Object.values(s.attempts).find((a) => a.examId === examId && !a.completedAt) ?? null

/** Progress for a project: how far through, and what to resume. */
export function getProjectProgress(projectId, s = state) {
  const segments = listSegments(projectId, s)
  const records = segments.map((seg) => getStudyRecord(projectId, seg.id, s))
  const completed = records.filter((r) => r?.submissionState === 'submitted').length
  const nextSegment =
    segments.find((seg) => getStudyRecord(projectId, seg.id, s)?.submissionState !== 'submitted') ??
    segments[0] ?? null
  return { total: segments.length, completed, nextSegment }
}

// ── project + source actions ─────────────────────────────────────────────────

export function addProject({ title, subtitle, reference } = {}) {
  const project = createProject({ title, subtitle, reference })
  commit({
    ...state,
    projects: { ...state.projects, [project.id]: project },
    currentProjectId: project.id,
  })
  return project
}

export function selectProject(projectId) {
  if (!state.projects[projectId]) return null
  commit({ ...state, currentProjectId: projectId })
  return state.projects[projectId]
}

export function deleteProject(projectId) {
  const next = { ...state, projects: { ...state.projects } }
  delete next.projects[projectId]
  // Cascade so nothing is orphaned and no stale key can resurface later.
  for (const collection of ['sources', 'segments', 'results', 'exams', 'attempts']) {
    next[collection] = Object.fromEntries(
      Object.entries(state[collection]).filter(([, v]) => v.projectId !== projectId))
  }
  for (const collection of ['drafts', 'studyRecords', 'notes']) {
    next[collection] = Object.fromEntries(
      Object.entries(state[collection]).filter(([k]) => !k.startsWith(`${projectId}::`)))
  }
  if (next.currentProjectId === projectId) {
    next.currentProjectId = Object.keys(next.projects)[0] ?? null
  }
  commit(next)
}

export function addSource({ projectId, rawText, label }) {
  const project = state.projects[projectId]
  if (!project) throw new Error(`addSource: unknown project ${projectId}`)
  const source = createSource({ projectId, rawText, label })
  commit({
    ...state,
    sources: { ...state.sources, [source.id]: source },
    projects: {
      ...state.projects,
      [projectId]: {
        ...project,
        sourceIds: [...project.sourceIds, source.id],
        updatedAt: new Date().toISOString(),
      },
    },
  })
  return source
}

// ── segmentation proposal (pre-approval) ─────────────────────────────────────

/**
 * Store a non-authoritative segmentation proposal for a project. This does NOT
 * publish canonical segments — Study still sees whatever was previously approved
 * (or nothing). The proposal exists to be reviewed/edited and then explicitly
 * approved (DECISIONS §5). Replaces the previous flow that published segments
 * before the user had reviewed anything (R-015).
 */
export function saveProposal({ projectId, sourceId, chunks, method, style, granularity }) {
  const project = state.projects[projectId]
  if (!project) throw new Error(`saveProposal: unknown project ${projectId}`)
  const proposal = createProposal({ projectId, sourceId, chunks, method, style, granularity })
  commit({ ...state, proposals: { ...state.proposals, [projectId]: proposal } })
  return proposal
}

export const getProposal = (projectId, s = state) => s.proposals[projectId] ?? null

export function clearProposal(projectId) {
  if (!state.proposals[projectId]) return
  const proposals = { ...state.proposals }
  delete proposals[projectId]
  commit({ ...state, proposals })
}

/**
 * Persist Review edits back onto the NON-AUTHORITATIVE proposal (still not
 * canonical). Without this, an edit made in Review lived only in component state
 * and vanished on reload before approval (S3-001). Publication remains the
 * explicit Approve action.
 */
export function updateProposal({ projectId, chunks }) {
  const existing = state.proposals[projectId]
  if (!existing) return null
  const proposal = { ...existing, chunks, updatedAt: new Date().toISOString() }
  commit({ ...state, proposals: { ...state.proposals, [projectId]: proposal } })
  return proposal
}

/** Prior canonical work kept when a project was re-segmented (DECISIONS §5). */
export const listArchives = (projectId, s = state) => s.archives[projectId] ?? EMPTY_LIST_ARCHIVES
const EMPTY_LIST_ARCHIVES = Object.freeze([])

/**
 * Restore the most recent archived segmentation as canonical, re-archiving the
 * CURRENT work so the restore is itself reversible. This is the product-visible
 * counterpart to non-destructive re-segmentation: replaced work is not lost, and
 * the user can bring it back (S3-001).
 */
export function restoreArchive(projectId) {
  const archives = state.archives[projectId]
  if (!archives || !archives.length) return null
  const archive = archives[archives.length - 1]

  const currentSegments = Object.values(state.segments).filter((seg) => seg.projectId === projectId)
  const currentIds = new Set(currentSegments.map((seg) => seg.id))
  const partitionKeyed = (coll) => {
    const removed = {}
    const kept = {}
    for (const [k, v] of Object.entries(coll)) {
      if (k.split('::')[0] === projectId) removed[k] = v
      else kept[k] = v
    }
    return { removed, kept }
  }
  const draftsPart = partitionKeyed(state.drafts)
  const recordsPart = partitionKeyed(state.studyRecords)
  const notesPart = partitionKeyed(state.notes)
  const currentResults = Object.fromEntries(
    Object.entries(state.results).filter(([, r]) => r.projectId === projectId && currentIds.has(r.segmentId)))
  const keptResults = Object.fromEntries(
    Object.entries(state.results).filter(([id]) => !currentResults[id]))
  const segmentsWithoutProject = Object.fromEntries(
    Object.entries(state.segments).filter(([, seg]) => seg.projectId !== projectId))
  const restoredSegments = Object.fromEntries((archive.segments ?? []).map((seg) => [seg.id, seg]))

  commit({
    ...state,
    segments: { ...segmentsWithoutProject, ...restoredSegments },
    drafts: { ...draftsPart.kept, ...(archive.drafts ?? {}) },
    studyRecords: { ...recordsPart.kept, ...(archive.studyRecords ?? {}) },
    notes: { ...notesPart.kept, ...(archive.notes ?? {}) },
    results: { ...keptResults, ...(archive.results ?? {}) },
    archives: {
      ...state.archives,
      [projectId]: [
        ...archives.slice(0, -1),
        {
          archivedAt: new Date().toISOString(),
          segments: currentSegments,
          drafts: draftsPart.removed,
          studyRecords: recordsPart.removed,
          notes: notesPart.removed,
          results: currentResults,
        },
      ],
    },
    projects: {
      ...state.projects,
      [projectId]: {
        ...state.projects[projectId],
        segmentIds: (archive.segments ?? []).map((seg) => seg.id),
        currentSegmentId: archive.segments?.[0]?.id ?? null,
        updatedAt: new Date().toISOString(),
      },
    },
  })
  return archive
}

/**
 * Publish a project's canonical segments — the explicit approval transaction.
 *
 * Non-destructive on re-segmentation (DECISIONS §5, RED-05): when the project
 * already has canonical segments, its prior segments/drafts/study-records/
 * results are ARCHIVED (kept, recoverable) rather than silently deleted before
 * approval. This is also the handoff the old flow discarded — it ended with a
 * bare hash change carrying no payload, so approved work vanished.
 */
export function publishSegments({ projectId, sourceId, chunks }) {
  const project = state.projects[projectId]
  if (!project) throw new Error(`publishSegments: unknown project ${projectId}`)

  const segments = chunks.map((chunk, index) =>
    createSegment({
      projectId,
      sourceId,
      index,
      text: typeof chunk === 'string' ? chunk : chunk.text,
      ref: typeof chunk === 'string' ? `1.${index + 1}` : chunk.ref ?? `1.${index + 1}`,
      title: typeof chunk === 'string' ? '' : chunk.title ?? '',
      chapterLabel: typeof chunk === 'string' ? '' : chunk.chapterLabel ?? '',
    }))

  const priorSegments = Object.values(state.segments).filter((seg) => seg.projectId === projectId)
  const staleIds = new Set(priorSegments.map((s) => s.id))
  const keptSegments = Object.fromEntries(
    Object.entries(state.segments).filter(([, seg]) => seg.projectId !== projectId))
  const partitionKeyed = (collection) => {
    const kept = {}
    const removed = {}
    for (const [k, v] of Object.entries(collection)) {
      const [pid, sid] = k.split('::')
      if (pid === projectId && staleIds.has(sid)) removed[k] = v
      else kept[k] = v
    }
    return { kept, removed }
  }
  const draftsPart = partitionKeyed(state.drafts)
  const recordsPart = partitionKeyed(state.studyRecords)
  const notesPart = partitionKeyed(state.notes)
  const priorResults = Object.fromEntries(
    Object.entries(state.results).filter(([, r]) => r.projectId === projectId && staleIds.has(r.segmentId)))

  // Only archive if there was real prior canonical work to preserve.
  const hadPriorWork =
    priorSegments.length > 0 &&
    (Object.keys(draftsPart.removed).length ||
      Object.values(recordsPart.removed).some((r) => r.submissionState !== 'draft') ||
      Object.keys(notesPart.removed).length ||
      Object.keys(priorResults).length)
  const nextArchives = hadPriorWork
    ? {
        ...state.archives,
        [projectId]: [
          ...(state.archives[projectId] ?? []),
          {
            archivedAt: new Date().toISOString(),
            segments: priorSegments,
            drafts: draftsPart.removed,
            studyRecords: recordsPart.removed,
            notes: notesPart.removed,
            results: priorResults,
          },
        ],
      }
    : state.archives

  commit({
    ...state,
    segments: { ...keptSegments, ...Object.fromEntries(segments.map((s) => [s.id, s])) },
    drafts: draftsPart.kept,
    studyRecords: recordsPart.kept,
    notes: notesPart.kept,
    archives: nextArchives,
    proposals: (() => { const p = { ...state.proposals }; delete p[projectId]; return p })(),
    projects: {
      ...state.projects,
      [projectId]: {
        ...project,
        segmentIds: segments.map((s) => s.id),
        currentSegmentId: segments[0]?.id ?? null,
        updatedAt: new Date().toISOString(),
      },
    },
  })
  return segments
}

// ── study actions ────────────────────────────────────────────────────────────

/**
 * Save a draft. Keyed by (projectId, segmentId) — the composite key is the
 * whole point: the previous editor was an uncontrolled textarea, so text typed
 * for one segment was still on screen after switching to another.
 */
export function saveDraft({ projectId, segmentId, text }) {
  const key = segmentKey(projectId, segmentId)
  commit({
    ...state,
    drafts: { ...state.drafts, [key]: { ...createDraft({ projectId, segmentId, text }) } },
  })
}

/**
 * Save a note against a segment. Notes were React-only state that a reload
 * discarded, so the companion's "save this summary" produced nothing durable.
 * Appends to the segment's note list and persists it (IP-05). Returns the note.
 */
export function addNote({ projectId, segmentId, text, source = 'manual' }) {
  const clean = String(text ?? '').trim()
  if (!projectId || !segmentId || !clean) return null
  const key = segmentKey(projectId, segmentId)
  const note = createNote({ projectId, segmentId, text: clean, source })
  commit({
    ...state,
    notes: { ...state.notes, [key]: [...(state.notes[key] ?? []), note] },
  })
  return note
}

export function setCurrentSegment({ projectId, segmentId }) {
  const project = state.projects[projectId]
  if (!project) return
  commit({
    ...state,
    projects: { ...state.projects, [projectId]: { ...project, currentSegmentId: segmentId } },
  })
}

/**
 * Submit the current draft. Refuses empty submissions: the previous build
 * accepted them and returned a grade and a review date for work it never read.
 *
 * This records an ATTEMPT and a mechanical surface check only. It never marks a
 * segment passed: a form-level check may support the workflow but must not
 * masquerade as semantic grading (DECISIONS §1, R-016). A pass comes only from
 * gradeSegment() below, which calls the real AI grading contract.
 */
export function submitSegment({ projectId, segmentId }) {
  const key = segmentKey(projectId, segmentId)
  const draft = state.drafts[key]
  const segment = state.segments[segmentId]
  const text = draft?.text?.trim() ?? ''

  if (!text) {
    return { ok: false, reason: 'empty', message: 'Write a translation before submitting.' }
  }

  const record = state.studyRecords[key] ?? createStudyRecord({ projectId, segmentId })
  const surface = evaluateTranslation({
    source: segment?.text ?? '',
    translation: text,
    attempt: record.attempts,
  })
  const result = createResult({
    projectId,
    segmentId,
    outcome: 'attempted',
    score: null,
    notes: surface.notes,
    isSample: true,
    mode: 'surface-check',
  })

  commit({
    ...state,
    results: { ...state.results, [result.id]: result },
    studyRecords: {
      ...state.studyRecords,
      [key]: {
        ...record,
        submissionState: 'attempted',
        attempts: record.attempts + 1,
        lastResultId: result.id,
        updatedAt: new Date().toISOString(),
      },
    },
  })
  return { ok: true, result, graded: false }
}

/**
 * Grade the current attempt against the real Study grading contract via the
 * provider-neutral AI boundary. On a genuine pass the segment becomes
 * 'submitted' (the only path to completion) and the review outputs are stored;
 * on a fail it becomes 'failed' with blocking issues; when no provider is
 * configured (or the call fails) the segment stays 'attempted' and this returns
 * an honest reason — it never invents a grade.
 */
export async function gradeSegment({ projectId, segmentId }, { grade = gradeStudyAttempt } = {}) {
  const key = segmentKey(projectId, segmentId)
  const draft = state.drafts[key]
  const segment = state.segments[segmentId]
  const text = draft?.text?.trim() ?? ''
  if (!text) return { ok: false, reason: 'empty' }

  const record = state.studyRecords[key] ?? createStudyRecord({ projectId, segmentId })
  const prior = record.lastResultId ? state.results[record.lastResultId] : null
  const priorFeedback = record.submissionState === 'failed' && prior?.mode === 'ai'
    ? prior.feedback || (prior.notes ?? []).map((n) => n.text).filter(Boolean).join('; ')
    : ''

  // `grade` defaults to the real provider-backed contract; tests inject a stub to
  // prove the full application path (submit → grade → completion → result)
  // deterministically without a live provider.
  const ai = await grade({
    source: segment?.text ?? '',
    translation: text,
    attempt: Math.max(record.attempts - 1, 0),
    priorFeedback,
  })
  if (!ai.available) {
    return { ok: true, graded: false, reason: ai.reason, message: ai.message }
  }

  const g = ai.result
  const passed = g.outcome === 'pass'
  const result = createResult({
    projectId,
    segmentId,
    outcome: g.outcome,
    score: g.grade,
    isSample: false,
    mode: 'ai',
    notes: passed
      ? []
      : (g.blockingIssues ?? []).map((b) => ({ kind: 'blocking', severity: b.severity || 'review', text: b.fix || b.issueType })),
    feedback: g.feedback,
    bestTranslation: g.bestTranslation,
    vocabulary: g.vocabulary,
    guidance: g.guidance,
    takeaways: g.takeaways,
    topics: g.topics,
  })

  commit({
    ...state,
    results: { ...state.results, [result.id]: result },
    studyRecords: {
      ...state.studyRecords,
      [key]: {
        ...record,
        submissionState: passed ? 'submitted' : 'failed',
        lastResultId: result.id,
        updatedAt: new Date().toISOString(),
      },
    },
  })
  return { ok: true, graded: true, result }
}

export function resetSegment({ projectId, segmentId }) {
  const key = segmentKey(projectId, segmentId)
  commit({
    ...state,
    studyRecords: { ...state.studyRecords, [key]: createStudyRecord({ projectId, segmentId }) },
  })
}

// ── exam actions ─────────────────────────────────────────────────────────────

export function addExam({ projectId, title, scope, questions }) {
  const exam = createExam({ projectId, title, scope, questions })
  commit({ ...state, exams: { ...state.exams, [exam.id]: exam } })
  return exam
}

/** Resume an open attempt rather than silently starting a second one. */
export function startAttempt({ projectId, examId }) {
  const open = findOpenAttempt(examId)
  if (open) return open
  const attempt = createAttempt({ projectId, examId })
  commit({ ...state, attempts: { ...state.attempts, [attempt.id]: attempt } })
  return attempt
}

/** Persist an answer immediately. The UI's "saved" indicator must mean this. */
export function saveAnswer({ attemptId, questionId, answer }) {
  const attempt = state.attempts[attemptId]
  if (!attempt) return
  commit({
    ...state,
    attempts: {
      ...state.attempts,
      [attemptId]: { ...attempt, answers: { ...attempt.answers, [questionId]: answer } },
    },
  })
}

export function setAttemptPosition({ attemptId, currentIndex }) {
  const attempt = state.attempts[attemptId]
  if (!attempt) return
  commit({ ...state, attempts: { ...state.attempts, [attemptId]: { ...attempt, currentIndex } } })
}

export function completeAttempt({ attemptId }) {
  const attempt = state.attempts[attemptId]
  if (!attempt) return null
  const exam = state.exams[attempt.examId]
  const graded = (exam?.questions ?? []).map((q) => {
    const answer = attempt.answers[q.id] ?? ''
    const evaluation = evaluateTranslation({ source: q.prompt ?? '', translation: answer, attempt: 0 })
    return { questionId: q.id, segmentRef: q.segmentRef, concept: q.concept, answer, outcome: evaluation.outcome }
  })
  const passCount = graded.filter((g) => g.outcome === 'pass').length
  const result = createResult({
    projectId: attempt.projectId,
    segmentId: null,
    outcome: passCount === graded.length ? 'pass' : 'review',
    score: graded.length ? Math.round((passCount / graded.length) * 100) : 0,
    notes: graded,
    isSample: true,
  })
  commit({
    ...state,
    results: { ...state.results, [result.id]: result },
    attempts: {
      ...state.attempts,
      [attemptId]: { ...attempt, completedAt: new Date().toISOString(), resultId: result.id },
    },
  })
  return result
}
