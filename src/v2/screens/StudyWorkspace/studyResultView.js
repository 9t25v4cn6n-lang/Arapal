// The single validated view model over a stored Study grading result.
//
// The live Study review must render the ACTUAL evaluator output and nothing it
// does not support (S3-002). This adapter is the one place that reads a stored
// result and exposes only fields the result genuinely carries — no fixture
// fallback, no success styling without evidence. A surface-check ("attempted")
// result, a sample result, or a null result yields an empty view: the review
// then shows honest absence rather than invented knowledge.

const EMPTY = Object.freeze([])

function arr(value) {
  return Array.isArray(value) ? value : EMPTY
}

/**
 * @param {object|null} result A stored result (schema.createResult) or null.
 * @returns {{
 *   hasGrade:boolean, graded:boolean, passed:boolean, score:number|null,
 *   bestTranslation:string|null, feedback:string|null,
 *   vocabulary:object[], guidance:object[], takeaways:object[],
 *   anchors:object[], blockingIssues:object[], topics:string[]
 * }}
 */
export function adaptStudyResult(result) {
  // Only a real AI grade is authoritative. A surface check or a sample result is
  // not evidence for feedback, a reference translation, vocabulary, or guidance.
  const graded = !!result && result.mode === 'ai' && result.isSample !== true
  if (!graded) {
    return {
      hasGrade: false, graded: false, passed: false, score: null,
      bestTranslation: null, feedback: null,
      vocabulary: EMPTY, guidance: EMPTY, takeaways: EMPTY,
      anchors: EMPTY, blockingIssues: EMPTY, topics: EMPTY,
    }
  }

  const passed = result.outcome === 'pass'
  const blockingIssues = arr(result.blockingIssues).length
    ? arr(result.blockingIssues)
    // Older results stored blocking issues inside notes; accept either shape.
    : arr(result.notes).filter((n) => n && n.kind === 'blocking')

  return {
    hasGrade: true,
    graded: true,
    passed,
    score: typeof result.score === 'number' ? result.score : null,
    // A best-in-class translation is shown ONLY on a genuine pass and only when
    // one is actually present (source §12).
    bestTranslation: passed && result.bestTranslation ? String(result.bestTranslation) : null,
    feedback: result.feedback ? String(result.feedback) : null,
    vocabulary: arr(result.vocabulary),
    guidance: arr(result.guidance),
    takeaways: arr(result.takeaways),
    anchors: arr(result.anchors),
    blockingIssues,
    topics: arr(result.topics).map(String),
  }
}
