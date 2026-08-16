// The evaluation boundary.
//
// This is a STUB and says so in every result it produces. It exists to make the
// seam explicit and replaceable, not to simulate assessment.
//
// What it replaces: the previous build decided pass/fail from a hard-coded
// `defaultOutcome` per segment and an attempt counter, never reading the
// translation at all. Submitting an empty box returned
// "Grade 8.4 · Reviewed: 15 Mar 2026". Presenting invented feedback as a real
// assessment of work the product never read is a truthfulness failure, not a
// missing feature — so this module refuses to invent a numeric grade, refuses
// to invent a reviewer or a review date, and marks every result `isSample`.
//
// To make evaluation real, replace `evaluateTranslation` with a call to the
// grading service and set `isSample: false`. Nothing else needs to change.

export const EVALUATION_MODE = 'heuristic-stub'

/**
 * Notes are observations a reader could verify, not judgements about meaning.
 * Anything requiring comprehension of Arabic is out of scope for a stub and is
 * deliberately absent rather than faked.
 */
function observe(source, translation) {
  const notes = []
  const words = translation.trim().split(/\s+/).filter(Boolean)
  const sourceWords = source.trim().split(/\s+/).filter(Boolean)

  if (sourceWords.length && words.length < sourceWords.length * 0.4) {
    notes.push({
      kind: 'length',
      severity: 'review',
      text: 'The translation is much shorter than the source. Check whether a clause has been dropped.',
    })
  }
  if (sourceWords.length && words.length > sourceWords.length * 2.5) {
    notes.push({
      kind: 'length',
      severity: 'review',
      text: 'The translation is considerably longer than the source. Check for added explanation.',
    })
  }
  if (!/[.!?]$/.test(translation.trim())) {
    notes.push({
      kind: 'form',
      severity: 'minor',
      text: 'The translation does not end with sentence punctuation.',
    })
  }
  if (/[؀-ۿ]/.test(translation)) {
    notes.push({
      kind: 'form',
      severity: 'review',
      text: 'The translation still contains Arabic characters — some source text may be untranslated.',
    })
  }
  return notes
}

/**
 * @returns {{outcome:'pass'|'review', score:null, notes:Array, isSample:true, mode:string}}
 *   'score' is deliberately null. A number here would imply a measurement this
 *   stub cannot make.
 */
export function evaluateTranslation({ source = '', translation = '', attempt = 0 } = {}) {
  const text = String(translation ?? '').trim()

  if (!text) {
    return {
      outcome: 'review',
      score: null,
      isSample: true,
      mode: EVALUATION_MODE,
      notes: [{ kind: 'empty', severity: 'blocking', text: 'No translation was submitted.' }],
    }
  }

  const notes = observe(String(source ?? ''), text)
  const blocking = notes.some((n) => n.severity === 'review')

  return {
    outcome: blocking ? 'review' : 'pass',
    score: null,
    isSample: true,
    mode: EVALUATION_MODE,
    attempt,
    notes: notes.length ? notes : [{
      kind: 'ok',
      severity: 'info',
      text: 'No structural issues detected. This is an automated surface check, not an assessment of meaning.',
    }],
  }
}

/** UI copy for the sample banner. One place, so it cannot drift per screen. */
export const SAMPLE_EVALUATION_NOTICE =
  'Automated surface check — not a scholarly assessment. Meaning and accuracy are not evaluated yet.'
