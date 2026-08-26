/**
 * Exams, scoped to the project you are actually in.
 *
 * The screen used to build every assessment from `studyScopePool` — a fixed
 * eight-item fixture that had no relationship to the open project. You could sit
 * in a project whose only segments were 1.1–1.4 and the builder would still
 * offer "Prefix 3", and the two seeded exams referenced 2.1–2.3 which existed
 * nowhere in that project. This adapter replaces that fixture with the project's
 * own canonical segments, so an exam can only ever cover material the learner
 * has really approved (R-017).
 */
import { useMemo } from 'react'
import { useCurrentProject, useSegments } from '../../data'

/**
 * Map a canonical store segment onto the question shape the Exams screen and the
 * grading contract expect. The human `ref` (e.g. "1.2") is the stable id that
 * also carries the exam→study remediation handoff; the canonical store id rides
 * alongside it so a miss can route to the exact segment by identity, not by a
 * label that could drift.
 */
export function segmentToQuestion(seg) {
  const ref = String(seg.ref ?? seg.index + 1)
  const prefix = ref.split('.')[0]
  return {
    id: ref,
    segmentId: seg.id,
    tracker: seg.index + 1,
    prefix,
    // Study-segment assessments ask the learner to translate the segment; the
    // task is explicit so the Attempt view can state it (S3-004).
    task: 'translate',
    label: seg.title ? `${ref} · ${seg.title}` : ref,
    concept: seg.chapterLabel || seg.title || `Segment ${ref}`,
    source: seg.text,
    // No fabricated review note. When a real grader runs it supplies the actual
    // reason for a miss; without one, nothing is invented.
    reviewNote: '',
  }
}

/**
 * The current project and its canonical segments mapped to exam questions.
 * Returns raw store references for `project`/`segments` (stable across renders
 * so the store's shallow-equality cache holds), and derives the mapped `pool`
 * in a memo keyed on the segment list.
 */
export function useLiveExamScope() {
  const project = useCurrentProject()
  const segments = useSegments(project?.id)
  const pool = useMemo(() => segments.map(segmentToQuestion), [segments])
  return { project, segments, pool }
}
