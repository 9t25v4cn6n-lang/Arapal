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
  segmentKey,
} from './schema.js'
import { evaluateTranslation } from './evaluation.js'
import { gradeStudyAttempt } from '../services/ai/index.js'

let state = storage.read()
let lastWriteOk = true
const listeners = new Set()

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
  for (const collection of ['drafts', 'studyRecords']) {
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

/**
 * Replace a project's segments with the output of segmentation.
 *
 * This is the handoff that was previously discarded: the old flow ended with
 * 'window.location.hash = 'study'' and no payload, so Study reopened a fixture
 * and the user's approved work vanished.
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

  // Drop the project's previous segments and everything keyed to them, so a
  // re-run cannot leave orphaned drafts pointing at segments that no longer exist.
  const keptSegments = Object.fromEntries(
    Object.entries(state.segments).filter(([, seg]) => seg.projectId !== projectId))
  const staleIds = new Set(
    Object.values(state.segments).filter((s) => s.projectId === projectId).map((s) => s.id))
  const pruneKeyed = (collection) => Object.fromEntries(
    Object.entries(collection).filter(([k]) => {
      const [pid, sid] = k.split('::')
      return pid !== projectId || !staleIds.has(sid)
    }))

  commit({
    ...state,
    segments: { ...keptSegments, ...Object.fromEntries(segments.map((s) => [s.id, s])) },
    drafts: pruneKeyed(state.drafts),
    studyRecords: pruneKeyed(state.studyRecords),
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
export async function gradeSegment({ projectId, segmentId }) {
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

  const ai = await gradeStudyAttempt({
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
