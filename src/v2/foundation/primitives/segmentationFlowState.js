const flowPreferenceKey = 'arapal:v2:segmentation-flow'
const intentKey = 'arapal:v2:segmentation-intent'

// Mirrors the ids in SegmentationOptionsPopover. Kept as explicit lists so a
// stored value from an older build, or a hand-edited one, cannot put the splitter
// into a state it has no branch for.
const VALID_METHODS = ['local', 'ai', 'manual']
const VALID_STYLES = ['sentence', 'meaning', 'topic']
const VALID_GRANULARITIES = ['tight', 'balanced', 'broad']

// The intake serves two distinct intents that must never be confused:
//   'new'       — create a brand-new project from the pasted source.
//   'resegment' — re-propose segmentation for the CURRENT project, keeping its
//                 identity (non-destructive per DECISIONS §5).
// "New source" silently replacing a project's canonical identity was S3-001.
export function setSegmentationIntent(intent) {
  if (typeof window === 'undefined') return
  try { window.sessionStorage.setItem(intentKey, intent === 'resegment' ? 'resegment' : 'new') } catch { /* ignore */ }
}

export function readSegmentationIntent() {
  if (typeof window === 'undefined') return 'new'
  try { return window.sessionStorage.getItem(intentKey) === 'resegment' ? 'resegment' : 'new' } catch { return 'new' }
}

export function clearSegmentationIntent() {
  if (typeof window === 'undefined') return
  try { window.sessionStorage.removeItem(intentKey) } catch { /* ignore */ }
}

const defaultFlowPreferences = {
  // Default to on-device splitting, which is truthful and works without an AI
  // provider. The old default called deterministic local splitting "AI" (S3-001).
  method: 'local',
  // Style and granularity belong here for the same reason method does: they
  // change what the splitter produces. Granularity alone takes a five-sentence
  // source from three segments to five. They were absent, and the read below
  // whitelists fields, so choosing "Tighter" and reloading silently returned you
  // to Balanced and re-segmented differently — the legacy screen persists its
  // equivalents, so this was a parity gap as well as a surprise.
  style: 'meaning',
  granularity: 'balanced',
}

export function saveSegmentationFlowPreferences(preferences = {}) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    flowPreferenceKey,
    JSON.stringify({
      ...defaultFlowPreferences,
      ...preferences,
    }),
  )
}

export function readSegmentationFlowPreferences() {
  if (typeof window === 'undefined') {
    return defaultFlowPreferences
  }

  try {
    const stored = window.localStorage.getItem(flowPreferenceKey)

    if (!stored) {
      return defaultFlowPreferences
    }

    const parsed = JSON.parse(stored)

    return {
      method: VALID_METHODS.includes(parsed?.method) ? parsed.method : defaultFlowPreferences.method,
      style: VALID_STYLES.includes(parsed?.style) ? parsed.style : defaultFlowPreferences.style,
      granularity: VALID_GRANULARITIES.includes(parsed?.granularity)
        ? parsed.granularity
        : defaultFlowPreferences.granularity,
    }
  } catch {
    return defaultFlowPreferences
  }
}

// A proposal is NEVER published without an explicit approval in Review, so every
// method lands on Review — never straight to Success. Success is reached only by
// the Approve action in Review (S3-001). The old code routed the quick path to
// Success, publishing before the user had seen the proposal.
export function getPostSegmentationRoute() {
  return 'segmentationReview'
}

// Processing advances straight to Review. The separate timer-only transition
// screen was ceremony between two real states and has been removed (Programme 3):
// the customer flow is Source → Review → Study.
export function getLoadingAdvanceRoute() {
  return getPostSegmentationRoute()
}

// Publishing enters Study directly with a concise confirmation/provenance banner
// instead of a ceremonial Success route (Programme 3). Approval records a one-shot
// provenance note that Study reads and clears on arrival — it is confirmation, not
// identity, so a visit-scoped session flag is the right home for it.
const publishProvenanceKey = 'arapal:v2:publish-provenance'

export function setPublishProvenance({ projectId, segmentCount, sourceLabel = '' } = {}) {
  if (typeof window === 'undefined' || !projectId) return
  try {
    window.sessionStorage.setItem(
      publishProvenanceKey,
      JSON.stringify({ projectId, segmentCount, sourceLabel, at: Date.now() }),
    )
  } catch { /* ignore */ }
}

export function readAndClearPublishProvenance(projectId) {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(publishProvenanceKey)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Only the project that was just published may consume its own banner, so a
    // stale note can never surface on an unrelated project (context isolation).
    if (parsed?.projectId !== projectId) return null
    window.sessionStorage.removeItem(publishProvenanceKey)
    return parsed
  } catch { return null }
}

export function shouldPauseSegmentationFlowTimers() {
  if (typeof window === 'undefined') {
    return false
  }

  return new URLSearchParams(window.location.search).get('v2FlowPause') === '1'
}
