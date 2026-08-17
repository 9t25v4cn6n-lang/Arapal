const flowPreferenceKey = 'arapal:v2:segmentation-flow'

// Mirrors the ids in SegmentationOptionsPopover. Kept as explicit lists so a
// stored value from an older build, or a hand-edited one, cannot put the splitter
// into a state it has no branch for.
const VALID_STYLES = ['sentence', 'meaning', 'topic']
const VALID_GRANULARITIES = ['tight', 'balanced', 'broad']

const defaultFlowPreferences = {
  method: 'ai',
  // Style and granularity belong here for the same reason method does: they
  // change what the splitter produces. Granularity alone takes a five-sentence
  // source from three segments to five. They were absent, and the read below
  // whitelists fields, so choosing "Tighter" and reloading silently returned you
  // to Balanced and re-segmented differently — the legacy screen persists its
  // equivalents, so this was a parity gap as well as a surprise.
  style: 'meaning',
  granularity: 'balanced',
  quickMode: true,
  showSegmentationTransition: true,
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
      method: parsed?.method === 'manual' ? 'manual' : 'ai',
      style: VALID_STYLES.includes(parsed?.style) ? parsed.style : defaultFlowPreferences.style,
      granularity: VALID_GRANULARITIES.includes(parsed?.granularity)
        ? parsed.granularity
        : defaultFlowPreferences.granularity,
      quickMode: typeof parsed?.quickMode === 'boolean' ? parsed.quickMode : defaultFlowPreferences.quickMode,
      showSegmentationTransition:
        typeof parsed?.showSegmentationTransition === 'boolean'
          ? parsed.showSegmentationTransition
          : defaultFlowPreferences.showSegmentationTransition,
    }
  } catch {
    return defaultFlowPreferences
  }
}

export function getPostSegmentationRoute(preferences = readSegmentationFlowPreferences()) {
  return preferences.method === 'manual' || !preferences.quickMode ? 'segmentationReview' : 'segmentationSuccess'
}

export function getLoadingAdvanceRoute(preferences = readSegmentationFlowPreferences()) {
  if (preferences.method !== 'manual' && preferences.showSegmentationTransition) {
    return 'segmentationTransition'
  }

  return getPostSegmentationRoute(preferences)
}

export function shouldPauseSegmentationFlowTimers() {
  if (typeof window === 'undefined') {
    return false
  }

  return new URLSearchParams(window.location.search).get('v2FlowPause') === '1'
}
