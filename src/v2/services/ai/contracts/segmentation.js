// Provider-backed segmentation — application contract.
//
// Derived from docs/ai/prompts/segmentation/default.txt (left unchanged). The
// AI proposes marker boundaries only; it never publishes canonical segments,
// deletes Study data, or bypasses Review/approval — the application compiles the
// markers into a NON-AUTHORITATIVE proposal, exactly as the local on-device
// splitter does, and nothing becomes canonical until the user approves in Review
// (S3-001 / DECISIONS §5). Every marker anchor is validated against the real
// source, so a hallucinated boundary cannot enter the proposal.

const STYLE_HINT = {
  sentence: 'Prefer smaller units close to sentence boundaries.',
  meaning: 'Group by coherent meaning units; keep a small idea together.',
  topic: 'Group around substantive topic shifts; one main ruling-topic per segment.',
}
const GRANULARITY_HINT = {
  tight: 'Favour more, smaller segments.',
  balanced: 'Favour a balanced number of segments for study.',
  broad: 'Favour fewer, larger sections.',
}

export function buildSegmentationPrompt({ source, style = 'meaning', granularity = 'balanced' }) {
  return [
    'You are segmenting a classical Arabic fiqh text for study. Output marker proposals only.',
    'Do NOT rewrite, paraphrase, summarise, translate, or regenerate the source text.',
    'Each marker represents the START of one substantive fiqh study segment (one main ruling-topic, not every evidence or micro-ruling). The legal frame overrides surface syntax.',
    'Each marker\'s insertBeforeAnchor MUST be a short substring copied EXACTLY from the source, at the point a new segment should begin, so the application can split deterministically.',
    STYLE_HINT[style] || STYLE_HINT.meaning,
    GRANULARITY_HINT[granularity] || GRANULARITY_HINT.balanced,
    'The proposal is NOT authoritative; the user reviews and approves it. Do not invent anchors that are not present verbatim.',
    '',
    'Return ONE strict JSON object only: { "markers": [ { "insertBeforeAnchor": "...", "topicTitle": "...", "sectionLabel": "..." } ] }.',
    'topicTitle is concise and specific; sectionLabel is an optional chapter/section label.',
    '',
    'SOURCE:',
    String(source ?? ''),
  ].join('\n')
}

/**
 * Compile validated markers into proposal chunks by splitting the source at each
 * anchor. Deterministic and application-owned: the AI only proposed WHERE to cut.
 * Anchors that do not appear verbatim in the source are dropped.
 *
 * @returns {{text:string,title:string,chapterLabel:string}[]}
 */
export function compileSegmentationMarkers(source, markers) {
  const text = String(source ?? '')
  if (!text.trim()) return []

  const located = (Array.isArray(markers) ? markers : [])
    .map((m) => ({
      anchor: String(m?.insertBeforeAnchor ?? ''),
      title: String(m?.topicTitle ?? '').trim(),
      section: String(m?.sectionLabel ?? '').trim(),
      pos: m?.insertBeforeAnchor ? text.indexOf(String(m.insertBeforeAnchor)) : -1,
    }))
    .filter((m) => m.pos >= 0)
    .sort((a, b) => a.pos - b.pos)

  // Boundary cut points: always start at 0, then each located anchor position.
  const cutPoints = [0]
  for (const m of located) {
    if (m.pos > 0 && cutPoints[cutPoints.length - 1] !== m.pos) cutPoints.push(m.pos)
  }

  const chunks = []
  for (let i = 0; i < cutPoints.length; i += 1) {
    const start = cutPoints[i]
    const end = i + 1 < cutPoints.length ? cutPoints[i + 1] : text.length
    const slice = text.slice(start, end).trim()
    if (!slice) continue
    const opener = located.find((m) => m.pos === start)
    chunks.push({
      text: slice,
      title: opener?.title || '',
      chapterLabel: opener?.section || '',
    })
  }

  // A degenerate proposal (no usable anchors) is the whole source as one segment,
  // never an empty proposal — the user can still split it in Review.
  if (!chunks.length) {
    return [{ text: text.trim(), title: '', chapterLabel: '' }]
  }
  return chunks
}

/**
 * Parse + validate the model's segmentation, then compile against the real
 * source. Throws on a structurally invalid response so the service returns an
 * honest failure instead of a broken proposal.
 */
export function parseSegmentationResult(raw, source) {
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw
  const markers = data && typeof data === 'object' ? data.markers : null
  if (!Array.isArray(markers)) {
    throw new Error('segmentation result missing markers[]')
  }
  const chunks = compileSegmentationMarkers(source, markers)
  return { chunks }
}
