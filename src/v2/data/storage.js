// Versioned persistence.
//
// Extends the pattern that already worked (`design-sandbox.segment-state.v1`
// round-tripped correctly) rather than inventing a new mechanism. Adds the
// parts that were missing: a namespace, a version, migration from the old keys,
// and a write path that cannot throw into the render tree.

const NS = 'arapal.v1'
const KEY = `${NS}.state`

/** Legacy keys we migrate from, then leave in place rather than destroying. */
const LEGACY_SEGMENT_STATE = 'design-sandbox.segment-state.v1'
export const LEGACY_EXAM_CONTEXT = 'design-sandbox.exam-context.v1'

const hasWindow = () => typeof window !== 'undefined' && !!window.localStorage

export const emptyState = () => ({
  version: 1,
  projects: {},
  sources: {},
  segments: {},
  drafts: {},        // keyed projectId::segmentId
  studyRecords: {},  // keyed projectId::segmentId
  results: {},
  exams: {},
  attempts: {},
  proposals: {},     // keyed projectId — non-authoritative segmentation, pre-approval
  archives: {},      // keyed projectId — prior canonical study data kept on re-segmentation
  currentProjectId: null,
  seededAt: null,
})

/** Collections that MUST be plain objects for selectors not to throw. */
const COLLECTIONS = ['projects', 'sources', 'segments', 'drafts', 'studyRecords', 'results', 'exams', 'attempts', 'proposals', 'archives']
const QUARANTINE_KEY = `${KEY}.quarantine`

const isPlainObject = (v) => !!v && typeof v === 'object' && !Array.isArray(v)

/**
 * Move an unusable persisted state aside (recoverable) rather than deleting it,
 * then continue from a clean empty state. This is what stops a wrong-shape or
 * future-version state from throwing a selector TypeError and blanking the app
 * (R-019). The quarantined copy is kept so nothing is silently destroyed.
 */
function quarantine(raw, reason) {
  try {
    window.localStorage.setItem(QUARANTINE_KEY, JSON.stringify({ at: new Date().toISOString(), reason, raw }))
    window.localStorage.removeItem(KEY)
  } catch { /* best effort */ }
}

export function read() {
  if (!hasWindow()) return emptyState()
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return migrateLegacy(emptyState())
    const parsed = JSON.parse(raw)
    if (!isPlainObject(parsed)) {
      quarantine(raw, 'not-an-object')
      return emptyState()
    }
    // A state written by a NEWER build may have a shape this build cannot read.
    // Quarantine rather than guess.
    if (typeof parsed.version === 'number' && parsed.version > emptyState().version) {
      quarantine(raw, `future-version-${parsed.version}`)
      return emptyState()
    }
    // Merge onto a fresh shape so a state that lacks a collection cannot produce
    // undefined lookups, then validate every collection is the right shape.
    const merged = { ...emptyState(), ...parsed }
    if (!COLLECTIONS.every((key) => isPlainObject(merged[key]))) {
      quarantine(raw, 'malformed-collection')
      return emptyState()
    }
    return merged
  } catch {
    // Corrupt or unreadable storage must not brick the app.
    return emptyState()
  }
}

export function write(state) {
  if (!hasWindow()) return false
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state))
    return true
  } catch {
    // Quota or private-mode failure. Report false so callers can surface an
    // honest "not saved" state instead of claiming success.
    return false
  }
}

export function clear() {
  if (!hasWindow()) return
  try { window.localStorage.removeItem(KEY) } catch { /* ignore */ }
}

/**
 * Carry forward the one piece of state the old build genuinely persisted:
 * per-segment submission state. Anything else in the old key is not
 * reconstructible and is deliberately dropped rather than guessed.
 */
function migrateLegacy(state) {
  if (!hasWindow()) return state
  try {
    const raw = window.localStorage.getItem(LEGACY_SEGMENT_STATE)
    if (!raw) return state
    const legacy = JSON.parse(raw)
    if (!legacy?.segmentRecords) return state
    state.migratedFrom = LEGACY_SEGMENT_STATE
    state.legacySegmentRecords = legacy.segmentRecords
    state.legacyCurrentSegmentId = legacy.currentSegmentId ?? null
  } catch { /* legacy state is best-effort */ }
  return state
}

// ── cross-screen context ─────────────────────────────────────────────────────
// sessionStorage, deliberately: a handoff is scoped to the current visit and
// should not resurrect days later. This generalises the exam→study payload,
// which is the one cross-screen handoff the previous build got right.

const CONTEXT_KEY = `${NS}.context`

export function writeContext(context) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(CONTEXT_KEY, JSON.stringify(context))
    // Keep the legacy key in sync so the surviving legacy Study screen still
    // receives context until it is retired.
    if (context?.segmentRef) {
      window.sessionStorage.setItem(LEGACY_EXAM_CONTEXT, JSON.stringify({
        segmentId: context.segmentRef,
        examTitle: context.title ?? 'Review',
        concept: context.concept ?? '',
        reason: context.reason ?? '',
      }))
    }
  } catch { /* ignore */ }
}

export function readContext() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(CONTEXT_KEY)
    if (raw) return JSON.parse(raw)

    // Fall back to the legacy key. writeContext already publishes BOTH keys so a
    // legacy screen can receive context; reading only one made that bridge
    // one-way. Exams is the live producer — it writes the legacy shape when
    // sending a missed answer back to study — so without this the handoff §2.3
    // names as a protected behaviour arrives at V2 Study with no context at all.
    const legacy = window.sessionStorage.getItem(LEGACY_EXAM_CONTEXT)
    if (!legacy) return null
    const parsed = JSON.parse(legacy)
    return {
      segmentRef: parsed?.segmentId ?? null,
      title: parsed?.examTitle ?? 'Review',
      concept: parsed?.concept ?? '',
      reason: parsed?.reason ?? '',
    }
  } catch {
    return null
  }
}

export function clearContext() {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(CONTEXT_KEY)
    window.sessionStorage.removeItem(LEGACY_EXAM_CONTEXT)
  } catch { /* ignore */ }
}
