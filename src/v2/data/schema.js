// Entity shapes for Arapal.
//
// The product previously had no entities at all: every screen owned a
// module-level constant, and navigation was a bare hash change carrying no
// identifiers. That is why approved segmentation output was discarded on
// handoff and why a draft written on one segment appeared on the next.
//
// Two invariants drive every shape below:
//   1. Everything a user creates belongs to exactly one project.
//   2. Anything keyed per-segment is keyed by (projectId, segmentId), never by
//      segmentId alone, so two projects cannot contaminate each other.

let counter = 0

/** Stable-enough id. Deterministic within a session for testability. */
export function newId(prefix) {
  counter += 1
  const stamp = Date.now().toString(36)
  return `${prefix}_${stamp}${counter.toString(36)}`
}

/** Composite key for anything owned by a segment within a project. */
export function segmentKey(projectId, segmentId) {
  if (!projectId) throw new Error('segmentKey requires a projectId — unscoped segment state leaks between projects')
  if (!segmentId) throw new Error('segmentKey requires a segmentId')
  return `${projectId}::${segmentId}`
}

// 'attempted' is load-bearing: a translation the user submitted and which passed
// the mechanical surface check but has NOT been semantically graded (no AI
// provider, or grading is still running/failed). It is deliberately NOT a pass —
// only a real AI grade meeting the Study contract yields 'submitted'. This is
// what stops a form-only check from masquerading as completion (R-016).
export const SUBMISSION_STATES = ['draft', 'attempted', 'submitted', 'failed']

export function createProject({ title, subtitle = '', reference = '' } = {}) {
  const now = new Date().toISOString()
  return {
    id: newId('prj'),
    title: title || 'Untitled project',
    subtitle,
    reference,
    createdAt: now,
    updatedAt: now,
    sourceIds: [],
    segmentIds: [],
    currentSegmentId: null,
    isSample: false,
  }
}

export function createSource({ projectId, rawText, label = 'Pasted source' }) {
  const text = String(rawText ?? '')
  return {
    id: newId('src'),
    projectId,
    label,
    rawText: text,
    wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
    createdAt: new Date().toISOString(),
  }
}

/**
 * A segment of a source. 'ref' is the human label (e.g. "1.3"); 'id' is the
 * stable machine identity. Screens must key on 'id', never on 'ref', because
 * refs are renumbered whenever segmentation is re-run.
 */
export function createSegment({ projectId, sourceId, index, text, ref, chapterLabel = '', title = '' }) {
  return {
    id: newId('seg'),
    projectId,
    sourceId,
    index,
    ref: ref ?? String(index + 1),
    title,
    chapterLabel,
    text: String(text ?? '').trim(),
    createdAt: new Date().toISOString(),
  }
}

/** A user's translation in progress. Keyed by (projectId, segmentId). */
export function createDraft({ projectId, segmentId, text = '' }) {
  return {
    projectId,
    segmentId,
    text,
    updatedAt: new Date().toISOString(),
  }
}

/** Study progress for one segment. */
export function createStudyRecord({ projectId, segmentId }) {
  return {
    projectId,
    segmentId,
    submissionState: 'draft',
    attempts: 0,
    lastResultId: null,
    updatedAt: new Date().toISOString(),
  }
}

/**
 * The outcome of an evaluation. 'isSample' is load-bearing, not decorative:
 * until a real evaluator exists, every result carries it and the UI must
 * surface it. Presenting generated feedback as a real assessment of work the
 * product never read is the defect this flag prevents.
 */
export function createResult({
  projectId, segmentId, outcome, score, notes = [], isSample = true,
  // Real review outputs from the AI grading contract (source prompt §12/§9/§10/
  // §13/§18). Present only on a genuine pass; empty/absent otherwise, never
  // fabricated. mode records which evaluator produced this result.
  bestTranslation = '', feedback = '', vocabulary = [], guidance = [],
  takeaways = [], topics = [], mode = 'surface-check',
}) {
  return {
    id: newId('res'),
    projectId,
    segmentId,
    outcome,
    score,
    notes,
    isSample,
    mode,
    bestTranslation,
    feedback,
    vocabulary,
    guidance,
    takeaways,
    topics,
    createdAt: new Date().toISOString(),
  }
}

export function createExam({ projectId, title, scope, questions = [] }) {
  return {
    id: newId('exm'),
    projectId,
    title: title || 'Untitled assessment',
    scope,
    questions,
    status: 'ready',
    createdAt: new Date().toISOString(),
  }
}

/** An in-progress or completed attempt. Answers persist; that is the point. */
export function createAttempt({ projectId, examId }) {
  return {
    id: newId('att'),
    projectId,
    examId,
    answers: {},
    currentIndex: 0,
    startedAt: new Date().toISOString(),
    completedAt: null,
    resultId: null,
  }
}
