// Contextual navigation.
//
// Generalises the one cross-screen handoff the previous build got right: Exams
// wrote {segmentId, examTitle, concept, reason} to sessionStorage, Study read
// it, jumped to that segment and showed a dismissible banner. Everywhere else
// navigation was a bare `window.location.hash = 'study'` carrying nothing,
// which is why approved segmentation output was lost on the way to Study.
//
// Rule: if a destination needs to know why it was opened, it travels here.

import * as storage from './storage.js'

export function navigate(routeId, context = null) {
  if (context) storage.writeContext({ ...context, at: new Date().toISOString() })
  else storage.clearContext()
  if (typeof window !== 'undefined') window.location.hash = `v2/${routeId}`
}

/** Read the context this screen was opened with, if any. */
export const readContext = storage.readContext
export const clearContext = storage.clearContext

/** Open a specific segment in Study, saying where the user came from. */
export function openSegmentInStudy({ projectId, segmentId, segmentRef, from, reason = '', concept = '', title = '' }) {
  navigate('studyWorkspace', {
    kind: 'segment',
    projectId,
    segmentId,
    segmentRef,
    from,
    reason,
    concept,
    title,
  })
}

/** Open Study on the segment a project should resume at. */
export function resumeProject({ projectId, segmentId, segmentRef }) {
  navigate('studyWorkspace', { kind: 'resume', projectId, segmentId, segmentRef, from: 'projects' })
}

/** Hand a freshly published segmentation to Study. */
export function openPublishedSegmentation({ projectId, segmentId, segmentRef, count }) {
  navigate('studyWorkspace', {
    kind: 'published',
    projectId,
    segmentId,
    segmentRef,
    from: 'segmentation',
    reason: `${count} segment${count === 1 ? '' : 's'} ready`,
  })
}

/** Human-readable provenance for the banner a destination shows. */
export function describeContext(context) {
  if (!context) return null
  switch (context.kind) {
    case 'published':
      return { label: 'From segmentation', detail: context.reason }
    case 'resume':
      return { label: 'Resumed', detail: context.segmentRef ? `Segment ${context.segmentRef}` : '' }
    case 'segment':
      return {
        label: context.from === 'research' ? 'From research' : context.from === 'exam' ? 'From exam review' : 'Opened directly',
        detail: [context.concept, context.reason].filter(Boolean).join(' · '),
      }
    default:
      return { label: 'Context', detail: context.reason ?? '' }
  }
}
