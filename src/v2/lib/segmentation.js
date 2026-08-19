// Segmentation: the real splitting and options model.
//
// Extracted verbatim in behaviour from `src/screens/MakeSegmentationFlowScreen.jsx`
// (5,946 lines), which was the only place this logic existed. Extracting it is
// what allows that screen to be archived without losing capability.
//
// One deliberate correction is applied, marked ARABIC FIX below: the original
// sentence splitter recognised only `.`, `!` and `?`, so an Arabic source —
// the product's entire purpose — collapsed into a single segment whenever it
// used Arabic punctuation. Latin behaviour is unchanged, which is why the
// existing characterisation tests still pass.

export const METHODS = ['ai', 'manual']
export const STYLES = ['sentence', 'meaning', 'topic']
export const GRANULARITIES = ['tight', 'balanced', 'broad']

export const DEFAULT_OPTIONS = {
  method: 'ai',
  style: 'sentence',
  granularity: 'balanced',
  quickMode: false,
  showTransition: true,
}

// ARABIC FIX — Arabic question mark (؟), Arabic full stop / Urdu danda (۔),
// and the Arabic semicolon (؛) terminate sentences just as `.!?` do in Latin.
// The Arabic comma (،) deliberately does NOT terminate: it is a comma.
const SENTENCE_TERMINATORS = '.!?؟۔؛'
const SENTENCE_RE = new RegExp(`[^${SENTENCE_TERMINATORS}]+(?:[${SENTENCE_TERMINATORS}]+|$)`, 'g')

export function splitIntoSentences(text) {
  return (
    String(text)
      .replace(/\s+/g, ' ')
      .match(SENTENCE_RE)
      ?.map((sentence) => sentence.trim())
      .filter(Boolean) || []
  )
}

export function splitIntoParagraphs(text) {
  return String(text)
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

export function chunkUnits(units, size) {
  if (!units.length) return []
  const chunks = []
  for (let index = 0; index < units.length; index += size) {
    chunks.push(units.slice(index, index + size))
  }
  return chunks
}

/**
 * Units per segment. The original branched on 'style' but both branches
 * returned the same values; collapsed here without behavioural change.
 */
export function getChunkSize(style, granularity) {
  return granularity === 'tight' ? 1 : granularity === 'broad' ? 3 : 2
}

export function deriveTopicLabel(text, index) {
  const words = String(text).trim().split(/\s+/).filter(Boolean).slice(0, 4)
  return words.length ? words.join(' ') : `Theme ${index + 1}`
}

/**
 * Flags a proposed segment that is unusually short or long for the chosen
 * style and granularity. This is a heuristic on length only — it makes no claim
 * about meaning.
 */
export function getReviewState(text, style, granularity, totalCount) {
  const wordCount = String(text).trim().split(/\s+/).filter(Boolean).length
  if (!wordCount) return null

  const lowerBound = style === 'sentence' ? 4 : 8
  const upperBound = style === 'sentence'
    ? (granularity === 'tight' ? 22 : granularity === 'broad' ? 42 : 32)
    : (granularity === 'tight' ? 45 : granularity === 'broad' ? 110 : 72)

  const strongLowerBound = Math.max(1, lowerBound - 3)
  const strongUpperBound = Math.round(upperBound * 1.35)

  if (wordCount < strongLowerBound || wordCount > strongUpperBound) return 'needs-review'
  if (wordCount < lowerBound || wordCount > upperBound) return 'second-look'

  // LATENT DEFECT, ported faithfully: this branch is unreachable. To arrive
  // here wordCount must already be within [lowerBound, upperBound] — at most 32
  // for sentence style — so `wordCount > 40` can never be true. The intent was
  // to flag a single overlong segment ("you did not really segment this"), and
  // that check has never fired in the product.
  //
  // Left as-is deliberately: this is an extraction, and changing review flags
  // during a port would make parity unprovable. Fix it as its own change, with
  // its own visual-regression review of the Review screen.
  return totalCount === 1 && wordCount > 40 ? 'needs-review' : null
}

export function getReviewSignalLabel(reviewState) {
  if (reviewState === 'needs-review') return 'Needs review'
  if (reviewState === 'second-look') return 'Worth a look'
  return ''
}

/**
 * Produce segment proposals from raw source text.
 * @returns {Array<{id,position,label,text,topic,reviewState,needsReview}>}
 */
export function generateMarkers(text, method = 'ai', style = 'sentence', granularity = 'balanced') {
  const cleanText = String(text ?? '').trim()
  if (!cleanText) return []

  const paragraphs = splitIntoParagraphs(cleanText)
  const baseUnits = style === 'sentence'
    ? splitIntoSentences(cleanText)
    : (paragraphs.length > 1 ? paragraphs : splitIntoSentences(cleanText))

  const units = baseUnits.length ? baseUnits : [cleanText]
  const chunkSize = Math.max(1, getChunkSize(style, granularity))
  const grouped = chunkUnits(units, chunkSize)
  let position = 0

  return grouped.map((group, index) => {
    const segmentText = group.join(style === 'sentence' ? ' ' : '\n\n').trim()
    const topic = style === 'sentence' ? '' : deriveTopicLabel(segmentText, index)
    const reviewState = method === 'ai' ? getReviewState(segmentText, style, granularity, grouped.length) : null
    const marker = {
      id: String(index + 1),
      position,
      label: `Segment ${index + 1}`,
      text: segmentText,
      topic,
      reviewState,
      needsReview: Boolean(reviewState),
    }
    position += segmentText.length + 2
    return marker
  })
}

/** Shape markers for 'store.publishSegments'. */
export function markersToChunks(markers, { chapterLabel = '' } = {}) {
  return markers.map((marker, index) => ({
    text: marker.text,
    ref: `1.${index + 1}`,
    title: marker.topic || '',
    chapterLabel,
  }))
}

// ── option persistence ───────────────────────────────────────────────────────
// Keys are the ones already in use, so a user's existing preferences survive
// the port rather than silently resetting.

const KEYS = {
  method: 'arapal.segmentation.defaultMethod',
  style: 'arapal.segmentation.style',
  granularity: 'arapal.segmentation.granularity',
  quickMode: 'arapal.segmentation.quickMode',
  showTransition: 'arapal.segmentation.showTransition',
}

const readKey = (key, fallback, allowed) => {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    if (allowed) return allowed.includes(raw) ? raw : fallback
    return raw === 'true'
  } catch {
    return fallback
  }
}

export function readOptions() {
  return {
    method: readKey(KEYS.method, DEFAULT_OPTIONS.method, METHODS),
    style: readKey(KEYS.style, DEFAULT_OPTIONS.style, STYLES),
    granularity: readKey(KEYS.granularity, DEFAULT_OPTIONS.granularity, GRANULARITIES),
    quickMode: readKey(KEYS.quickMode, DEFAULT_OPTIONS.quickMode),
    showTransition: readKey(KEYS.showTransition, DEFAULT_OPTIONS.showTransition),
  }
}

export function writeOption(name, value) {
  if (typeof window === 'undefined' || !KEYS[name]) return
  try { window.localStorage.setItem(KEYS[name], String(value)) } catch { /* ignore */ }
}

export const OPTION_LABELS = {
  method: { ai: 'AI proposal', manual: 'Manual start' },
  style: { sentence: 'Sentence', meaning: 'Meaning groups', topic: 'Topic-led' },
  granularity: { tight: 'Tighter', balanced: 'Balanced', broad: 'Broader' },
}
