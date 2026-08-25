// Live project → Research view-model.
//
// Replaces projectResearchData's fixture (a 30-segment Al-Hidayah ledger with
// pre-written user/best translations, evaluations and vocabulary). Research is
// a browse/search surface over the CURRENT project's real segments, so this
// derives the same segment shape the desk renders from the live store.
//
// Honesty boundary: the fixture carried best-in-class translations, scholarly
// evaluations and vocabulary for every row. In the live model those only exist
// once a segment has been studied and graded by the real evaluator (IP-03),
// which is not wired yet — so they are empty here rather than invented. The
// desk must render "not evaluated yet", never a fabricated assessment.
//
// The reusable pure helpers (getResearchStats / getRevisionQueue /
// getFilterCount / getFilteredSegments) still operate on this shape, so they
// are imported unchanged; only the data feeding them changes.

import { useMemo } from 'react'
import { useCurrentProject, useSegments, useArapal, select, getSnapshot } from '../../data'

/** statusTone drives the filters/queue; keep it to the values helpers expect. */
function studyStatus(record) {
  if (!record || record.submissionState === 'draft') {
    return { status: 'Not started', statusTone: 'neutral' }
  }
  if (record.submissionState === 'submitted') {
    return { status: 'Completed', statusTone: 'ready' }
  }
  if (record.submissionState === 'attempted') {
    return { status: 'Attempted', statusTone: 'review' }
  }
  return { status: 'Needs revision', statusTone: 'weak' }
}

/**
 * Map one live segment (+ its draft/record) into the research row shape.
 * Every field is present with a safe default: the helpers call .length on the
 * arrays and .join on the strings, so undefined would leak "undefined" into
 * search text and crash the counters.
 */
function mapSegmentToResearchRow(seg, snapshot) {
  const draft = select.getDraft(seg.projectId, seg.id, snapshot)
  const record = select.getStudyRecord(seg.projectId, seg.id, snapshot)
  const { status, statusTone } = studyStatus(record)

  return {
    // Human ref for display and in-project selection; the stable id travels
    // separately so the Study handoff resolves the exact segment (R-018).
    id: seg.ref,
    segmentId: seg.id,
    chapter: seg.chapterLabel || '',
    // No separate sub-topic in the live model; leave empty rather than
    // duplicating the chapter label in the inspector meta line.
    topic: '',
    heading: seg.title || `Segment ${seg.ref}`,
    arabic: seg.text || '',
    userTranslation: draft?.text?.trim() || '',
    // Populated only by the real evaluator (IP-03); absent, not invented.
    bestTranslation: '',
    evaluation: '',
    status,
    statusTone,
    tags: seg.chapterLabel ? [seg.chapterLabel] : [],
    notes: [],
    vocabulary: [],
    relatedIds: [],
  }
}

/**
 * Live Research view-model for the current project. Reactive to segment, draft
 * and study-record changes without churning the reference (stable string key +
 * useMemo, as in ProjectHome/liveProjectsData).
 *
 * @returns {{ hasProject: boolean, projectSummary: {title:string,subtitle:string,projectMeta:string}, segments: object[] }}
 */
export function useLiveResearch() {
  const project = useCurrentProject()
  const segments = useSegments(project?.id)

  const derivedKey = useArapal((s) => {
    if (!project) return ''
    return select
      .listSegments(project.id, s)
      .map((seg) => {
        const rec = select.getStudyRecord(project.id, seg.id, s)
        const draft = select.getDraft(project.id, seg.id, s)
        return `${seg.id}:${rec?.submissionState ?? '-'}:${draft?.text ? 1 : 0}`
      })
      .join('|')
  })

  const mapped = useMemo(
    () => segments.map((seg) => mapSegmentToResearchRow(seg, getSnapshot())),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [segments, derivedKey],
  )

  const projectSummary = useMemo(
    () => ({
      title: project?.title || 'No project',
      subtitle: 'Project Research Workspace',
      projectMeta: project
        ? [project.subtitle, `${segments.length} segment${segments.length === 1 ? '' : 's'}`]
            .filter(Boolean)
            .join(' · ')
        : 'Select or create a project to research its segments',
    }),
    [project, segments.length],
  )

  return { hasProject: !!project, projectSummary, segments: mapped }
}
