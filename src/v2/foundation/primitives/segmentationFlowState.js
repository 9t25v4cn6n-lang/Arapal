const flowPreferenceKey = 'arapal:v2:segmentation-flow'

const defaultFlowPreferences = {
  method: 'ai',
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
