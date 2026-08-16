// Public surface of the Arapal data layer.
//
//   import { useProjects, useSegment, actions } from '../../data'
//
// Screens should import from here, not from the internals, so the storage and
// store implementations stay replaceable.

import { useEffect, useReducer, useRef } from 'react'
import * as store from './store.js'

/**
 * One level of structural comparison.
 *
 * Selectors that derive lists or objects return a fresh reference every call.
 * Handing those straight to useSyncExternalStore produced
 * "The result of getSnapshot should be cached to avoid an infinite loop"
 * followed by "Maximum update depth exceeded" — the screen rendered nothing.
 * Comparing by shape keeps the reference stable when the data has not changed.
 */
function shallowEqual(a, b) {
  if (Object.is(a, b)) return true
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) return false
  return aKeys.every((key) => Object.is(a[key], b[key]))
}

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

/**
 * Subscribe to a derived slice of the store.
 *
 * The selector is re-run on every render, so a selector that closes over props
 * (a projectId, a segmentId) stays correct when those change — no dependency
 * array to keep in sync. The returned reference only changes when the derived
 * value actually differs, which is what keeps React stable.
 */
export function useArapal(selector) {
  const selectorRef = useRef(selector)
  selectorRef.current = selector
  const [, forceRender] = useReducer((n) => n + 1, 0)
  const valueRef = useRef(undefined)
  const initialised = useRef(false)

  const next = selector(store.getSnapshot())
  if (!initialised.current || !shallowEqual(valueRef.current, next)) {
    valueRef.current = next
    initialised.current = true
  }

  useEffect(() => store.subscribe(forceRender), [])

  return valueRef.current
}

export const useProjects = () => useArapal(store.listProjects)
export const useCurrentProject = () => useArapal(store.getCurrentProject)

export const useSegments = (projectId) =>
  useArapal((s) => (projectId ? store.listSegments(projectId, s) : EMPTY_LIST))

export const useDraft = (projectId, segmentId) =>
  useArapal((s) => (projectId && segmentId ? store.getDraft(projectId, segmentId, s) : null))

export const useStudyRecord = (projectId, segmentId) =>
  useArapal((s) => (projectId && segmentId ? store.getStudyRecord(projectId, segmentId, s) : null))

export const useProjectProgress = (projectId) =>
  useArapal((s) => (projectId ? store.getProjectProgress(projectId, s) : EMPTY_PROGRESS))

/** True when writes are landing. Surface this rather than claiming "Saved". */
export const usePersistenceHealthy = () => useArapal(() => store.persistenceHealthy())

// Stable empties, so an absent project does not churn the reference each render.
const EMPTY_LIST = []
const EMPTY_PROGRESS = { total: 0, completed: 0, nextSegment: null }
