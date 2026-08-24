// Live projects → Lesson view-model.
//
// Replaces studyDashboardData's fixture backend (Jumu'ah / Purity / Fasting and
// a generator of 1,800 fake history rows). The Projects screen renders the
// `Lesson` shape; this module produces that exact shape from the real store, so
// the composition is untouched and only its data source changes.
//
// Reactivity note: useArapal compares one level with Object.is, so a selector
// that returns freshly-built Lesson objects hands back a new reference every
// call and spins React into "Maximum update depth exceeded" (ProjectHome's
// docstring records walking into this). The fix is to derive a stable STRING
// key from the store and build the objects in useMemo keyed on that string.

import { useMemo } from 'react'
import { useProjects, useArapal, select, getSnapshot } from '../../data'

/** Coarsest honest recency unit — the same policy Project Home uses. */
function formatLastActive(iso) {
  if (!iso) return ''
  const then = Date.parse(iso)
  if (Number.isNaN(then)) return ''
  const days = Math.floor((Date.now() - then) / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 28) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 28)}mo ago`
}

function statusOf(project) {
  if (project.segmentIds.length > 0) return 'ready'
  if (project.sourceIds.length > 0) return 'setup'
  return 'draft'
}

function setupChecklist(status) {
  if (status === 'ready') return ['Source preserved', 'Segments published', 'Study workspace ready']
  if (status === 'setup') return ['Source preserved', 'Segmentation awaiting approval', 'Study locked until approval']
  return ['Add a source', 'Segmentation not started', 'Study locked']
}

/**
 * @returns {Lesson-shaped object (see live view-model)}
 * Every count here is real. savedNote/savedVocab/suggestedReview are 0 rather
 * than invented because the store does not persist notes or vocabulary yet;
 * showing a fabricated number is the exact defect R-014 records.
 */
function mapProjectToLesson(project, snapshot) {
  const status = statusOf(project)
  const progress = select.getProjectProgress(project.id, snapshot)
  const total = progress.total
  const completed = progress.completed
  const next = progress.nextSegment
  const pct = total ? Math.round((completed / total) * 100) : 0

  const sourceLabel =
    project.sourceIds
      .map((id) => snapshot.sources[id]?.label)
      .find((label) => label && label !== 'Pasted source' && label !== 'Sample source') ||
    project.subtitle ||
    ''

  // Distinct chapter labels present in this project's segments — real structure,
  // not fixture tags.
  const chapters = []
  for (const seg of select.listSegments(project.id, snapshot)) {
    if (seg.chapterLabel && !chapters.includes(seg.chapterLabel)) chapters.push(seg.chapterLabel)
  }

  return {
    id: project.id,
    title: project.title,
    sourceTitle: sourceLabel,
    status,
    statusLabel: status === 'ready' ? 'Ready to study' : status === 'setup' ? 'Segmentation to approve' : 'Draft source',
    resumeLabel:
      status === 'ready'
        ? next
          ? `Resume segment ${next.ref}`
          : 'Open study'
        : status === 'setup'
          ? 'Review segmentation'
          : 'Add segmentation',
    resumeDetail:
      status === 'ready'
        ? 'Continue the study loop: read the source, write your translation, submit, then review support.'
        : status === 'setup'
          ? 'Approve the proposed segmentation once, then this becomes a normal study session.'
          : 'Add and segment a source to begin studying.',
    primaryRoute: status === 'ready' ? 'studyWorkspace' : status === 'setup' ? 'segmentationReview' : 'segmentationPasteNext',
    currentSegmentNumber: next ? next.index + 1 : Math.min(completed + 1, Math.max(total, 1)),
    completedSegments: completed,
    totalSegments: total,
    progress: pct,
    progressLabel: total ? `${completed} of ${total} segments` : 'No segments yet',
    savedNoteCount: 0,
    savedVocabCount: 0,
    suggestedReviewCount: 0,
    updatedAt: formatLastActive(project.updatedAt),
    lessonTags: chapters,
    setupChecklist: setupChecklist(status),
    isSample: !!project.isSample,
  }
}

/**
 * Live Lesson list for the Projects library. Reactive to project, source,
 * segment and study-record changes without churning the reference.
 */
export function useLiveLessons() {
  const projects = useProjects()

  // A single stable string encodes everything a Lesson derives from the store
  // beyond the (already stable) project objects: progress and the source label.
  const derivedKey = useArapal((s) =>
    projects
      .map((p) => {
        const pr = select.getProjectProgress(p.id, s)
        return `${p.id}:${p.updatedAt}:${pr.completed}:${pr.total}:${pr.nextSegment?.id ?? ''}:${p.sourceIds.join(',')}`
      })
      .join('|'))

  // useMemo runs during render, where the store snapshot is current.
  return useMemo(
    () => projects.map((p) => mapProjectToLesson(p, getSnapshot())),
    // derivedKey changes whenever any project's progress/source changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projects, derivedKey],
  )
}

/**
 * Real study activity for one project: one row per submitted or failed segment,
 * newest first. No fabricated backlog, no ephemeral "saved" claim.
 *
 * @returns {StudyHistoryEntry-shaped rows (see live view-model)}
 */
export function useLiveStudyHistory(projectId) {
  const key = useArapal((s) => {
    if (!projectId) return ''
    return select
      .listSegments(projectId, s)
      .map((seg) => {
        const rec = select.getStudyRecord(projectId, seg.id, s)
        return rec ? `${seg.id}:${rec.submissionState}:${rec.attempts}:${rec.updatedAt}` : ''
      })
      .filter(Boolean)
      .join('|')
  })

  return useMemo(() => {
    if (!projectId) return []
    const s = getSnapshot()
    const rows = []
    for (const seg of select.listSegments(projectId, s)) {
      const rec = select.getStudyRecord(projectId, seg.id, s)
      if (!rec || rec.submissionState === 'draft') continue
      const passed = rec.submissionState === 'submitted'
      rows.push({
        id: `${seg.id}-${rec.updatedAt}`,
        kind: 'completed-segment',
        label: `${passed ? 'Studied' : 'Attempted'} segment ${seg.ref}`,
        detail: seg.title || (passed ? 'Segment submitted.' : `Attempt ${rec.attempts} — not yet passed.`),
        status: passed ? 'done' : 'needs-review',
        timestamp: formatLastActive(rec.updatedAt),
        saved: false,
        segmentId: seg.id,
      })
    }
    return rows.sort((a, b) => b.id.localeCompare(a.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, key])
}
