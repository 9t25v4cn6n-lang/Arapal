// Public surface of the Arapal data layer.
//
//   import { useProjects, useSegment, actions } from '../../data'
//
// Screens should import from here, not from the internals, so the storage and
// store implementations stay replaceable.

import { useSyncExternalStore, useCallback } from 'react'
import * as store from './store.js'

export * as schema from './schema.js'
export * as navigation from './navigation.js'
export { evaluateTranslation, SAMPLE_EVALUATION_NOTICE, EVALUATION_MODE } from './evaluation.js'
export { seedSampleProject, SAMPLE_PROJECT_TITLE } from './seed.js'

/** Actions are grouped so call sites read as intent, not as plumbing. */
export const actions = {
  addProject: store.addProject,
  selectProject: store.selectProject,
  deleteProject: store.deleteProject,
  addSource: store.addSource,
  publishSegments: store.publishSegments,
  saveDraft: store.saveDraft,
  setCurrentSegment: store.setCurrentSegment,
  submitSegment: store.submitSegment,
  resetSegment: store.resetSegment,
  addExam: store.addExam,
  startAttempt: store.startAttempt,
  saveAnswer: store.saveAnswer,
  setAttemptPosition: store.setAttemptPosition,
  completeAttempt: store.completeAttempt,
}

export const select = {
  listProjects: store.listProjects,
  getProject: store.getProject,
  getCurrentProject: store.getCurrentProject,
  listSegments: store.listSegments,
  getSegment: store.getSegment,
  getDraft: store.getDraft,
  getStudyRecord: store.getStudyRecord,
  getResult: store.getResult,
  listExams: store.listExams,
  getAttempt: store.getAttempt,
  findOpenAttempt: store.findOpenAttempt,
  getProjectProgress: store.getProjectProgress,
}

export { subscribe, getSnapshot, persistenceHealthy, __resetForTests } from './store.js'

/** Subscribe to a derived slice. `selector` must be cheap and pure. */
export function useArapal(selector) {
  const getSelection = useCallback(() => selector(store.getSnapshot()), [selector])
  return useSyncExternalStore(store.subscribe, getSelection, getSelection)
}

export const useProjects = () => useArapal(store.listProjects)
export const useCurrentProject = () => useArapal(store.getCurrentProject)

export function useSegments(projectId) {
  const selector = useCallback((s) => (projectId ? store.listSegments(projectId, s) : []), [projectId])
  return useArapal(selector)
}

export function useDraft(projectId, segmentId) {
  const selector = useCallback(
    (s) => (projectId && segmentId ? store.getDraft(projectId, segmentId, s) : null),
    [projectId, segmentId],
  )
  return useArapal(selector)
}

export function useStudyRecord(projectId, segmentId) {
  const selector = useCallback(
    (s) => (projectId && segmentId ? store.getStudyRecord(projectId, segmentId, s) : null),
    [projectId, segmentId],
  )
  return useArapal(selector)
}

export function useProjectProgress(projectId) {
  const selector = useCallback(
    (s) => (projectId ? store.getProjectProgress(projectId, s) : { total: 0, completed: 0, nextSegment: null }),
    [projectId],
  )
  return useArapal(selector)
}

/** True when writes are landing. Surface this rather than claiming "Saved". */
export const usePersistenceHealthy = () => useArapal(() => store.persistenceHealthy())
