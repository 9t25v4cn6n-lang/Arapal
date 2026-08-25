// Study grading — application contract.
//
// DERIVED from the proven Study source prompt
// (docs/ai/prompts/study/main-runtime-v6.txt), which stays unchanged and is the
// behavioural authority. This module encodes the parts the application needs and
// deliberately drops the legacy chat scaffolding (the §GO§/§NEXT§ state machine,
// the ⟦HS⟧ sentinel envelope, the "paste into a Project chat" wrapper). Those
// were ChatGPT-transcript machinery, not grading rules.
//
// The grading RULES are preserved verbatim in intent and are the single source
// of truth for pass/fail in the app. They MUST NOT be re-invented elsewhere:
//
//   Pass threshold (source §15.3):
//     - no critical fail gate triggered (§15.2)
//     - no CORE anchor missing (§15.3)
//     - weighted anchor coverage >= 85%
//     - final grade >= 8.25 / 10
//
//   Category weights (§15.4) sum to 10.00.
//   No-moving-target retry rule (§15.7): once meaning is sound, later retries
//   are not failed for new stylistic objections.

/** Source §15.4 — the five weighted grading categories. */
export const CATEGORY_WEIGHTS = Object.freeze({
  conceptualAccuracy: 3.25, // fiqh meaning and legal consequence
  structuralParsing: 2.5, // ruling/evidence/reasoning/dissent layers
  arabicGrammar: 1.75, // tense, subject, pronoun-reference, clause attachment
  translationPrecision: 1.5, // accurate English expression
  completeness: 1.0, // omission, addition, marker/source fidelity
})

export const TOTAL_WEIGHT = 10.0 // must remain the sum of CATEGORY_WEIGHTS

/** Source §15.3 pass gates. */
export const PASS_GRADE = 8.25
export const PASS_COVERAGE = 0.85

/**
 * Source §15.2 — any of these forces ATTEMPT FAIL regardless of arithmetic.
 * These are the machine-checkable gate identifiers the model is asked to report.
 */
export const CRITICAL_FAIL_GATES = Object.freeze([
  'omitted-source',
  'added-meaning',
  'ruling-inversion',
  'view-inversion',
  'lost-legal-condition',
  'fabricated-inference',
  'wrong-evidence-attribution',
  'strength-signal-misread',
  'ruling-evidence-confusion',
  'subject-reference-error',
  'source-lock-violation',
])

/** Anchor grading statuses (source §15.3). */
export const ANCHOR_STATUSES = Object.freeze(['correct', 'partial', 'incorrect', 'missing'])

/** Weight applied to each anchor status when computing weighted coverage. */
const ANCHOR_STATUS_WEIGHT = { correct: 1, partial: 0.5, incorrect: 0, missing: 0 }

/**
 * The structured result the app expects back from the grading service. This is
 * the shape the runtime prompt asks the provider to return as JSON, and the
 * shape the Study UI renders.
 *
 * @typedef {Object} StudyGradeResult
 * @property {number} grade                 x.xx / 10
 * @property {'pass'|'fail'} outcome        computed, never trusted from the model alone
 * @property {string[]} criticalFails       subset of CRITICAL_FAIL_GATES actually triggered
 * @property {Array<{anchor:string,status:string,core:boolean,whyItMatters:string,whatWentWrong:string}>} anchors
 * @property {Object} categoryScores        { conceptualAccuracy, structuralParsing, arabicGrammar, translationPrecision, completeness } each 0..weight
 * @property {Array<{issueType:string,severity:string,fix:string}>} blockingIssues  (fail only)
 * @property {string} bestTranslation       (pass only; source §12) — never shown before pass
 * @property {string} feedback              user-facing summary
 * @property {Array<{term:string,type:string,gloss:string,why:string}>} vocabulary  (source §9)
 * @property {Array<{unit:string,type:string,functionHere:string,rendering:string}>} guidance (source §10)
 * @property {Array<{function:string,anchor:string,weight:string,evidence:string,note:string}>} takeaways (source §13)
 * @property {string[]} topics              (source §18)
 */

/**
 * Compute the authoritative outcome from a graded result. The MODEL proposes an
 * outcome; the APPLICATION decides it, so a provider that returns a lenient
 * "pass" while reporting a critical fail or missing core anchor cannot leak a
 * false pass into study progress. This is the guard R-016 requires.
 *
 * @returns {{ outcome:'pass'|'fail', weightedCoverage:number, reasons:string[] }}
 */
export function computeOutcome(result) {
  const reasons = []
  const criticalFails = Array.isArray(result?.criticalFails) ? result.criticalFails : []
  const anchors = Array.isArray(result?.anchors) ? result.anchors : []
  const grade = Number(result?.grade)

  if (criticalFails.length > 0) reasons.push(`critical fail: ${criticalFails.join(', ')}`)

  const missingCore = anchors.filter((a) => a?.core && a?.status === 'missing')
  if (missingCore.length > 0) reasons.push(`${missingCore.length} core anchor(s) missing`)

  const weightedCoverage = anchors.length
    ? anchors.reduce((sum, a) => sum + (ANCHOR_STATUS_WEIGHT[a?.status] ?? 0), 0) / anchors.length
    : 0
  if (anchors.length && weightedCoverage < PASS_COVERAGE) {
    reasons.push(`anchor coverage ${(weightedCoverage * 100).toFixed(0)}% < ${PASS_COVERAGE * 100}%`)
  }

  if (!Number.isFinite(grade) || grade < PASS_GRADE) {
    reasons.push(`grade ${Number.isFinite(grade) ? grade.toFixed(2) : 'n/a'} < ${PASS_GRADE}`)
  }

  return { outcome: reasons.length === 0 ? 'pass' : 'fail', weightedCoverage, reasons }
}

/**
 * Validate and normalise a raw provider response into a StudyGradeResult, then
 * stamp the APPLICATION-decided outcome over whatever the model claimed.
 * Throws on structurally unusable input so the caller can surface an honest
 * error rather than render a malformed grade.
 */
export function parseStudyGradeResult(raw) {
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw
  if (!data || typeof data !== 'object') throw new Error('grade response is not an object')
  if (data.grade == null || !Number.isFinite(Number(data.grade))) {
    throw new Error('grade response missing a numeric grade')
  }

  const anchors = Array.isArray(data.anchors)
    ? data.anchors.map((a) => ({
        anchor: String(a?.anchor ?? ''),
        status: ANCHOR_STATUSES.includes(a?.status) ? a.status : 'incorrect',
        core: !!a?.core,
        whyItMatters: String(a?.whyItMatters ?? ''),
        whatWentWrong: String(a?.whatWentWrong ?? ''),
      }))
    : []

  const criticalFails = Array.isArray(data.criticalFails)
    ? data.criticalFails.filter((g) => CRITICAL_FAIL_GATES.includes(g))
    : []

  const base = {
    grade: Number(data.grade),
    criticalFails,
    anchors,
    categoryScores: data.categoryScores && typeof data.categoryScores === 'object' ? data.categoryScores : {},
    blockingIssues: Array.isArray(data.blockingIssues) ? data.blockingIssues : [],
    feedback: String(data.feedback ?? ''),
    vocabulary: Array.isArray(data.vocabulary) ? data.vocabulary : [],
    guidance: Array.isArray(data.guidance) ? data.guidance : [],
    takeaways: Array.isArray(data.takeaways) ? data.takeaways : [],
    topics: Array.isArray(data.topics) ? data.topics : [],
  }

  const decided = computeOutcome(base)
  return {
    ...base,
    outcome: decided.outcome,
    weightedCoverage: decided.weightedCoverage,
    outcomeReasons: decided.reasons,
    // Source §16.3 / §12: the model translation is revealed only on a pass. The
    // application enforces this rather than trusting the model to withhold it.
    bestTranslation: decided.outcome === 'pass' ? String(data.bestTranslation ?? '') : '',
    isSample: false,
  }
}

/**
 * Build the runtime grading prompt. This is the application-native instruction,
 * NOT the source file: it states the preserved grading rules compactly and asks
 * for a single strict JSON object. `priorFeedback` carries the no-moving-target
 * rule (§15.7) into retries.
 */
export function buildStudyGradingPrompt({ source, translation, attempt = 0, priorFeedback = '' }) {
  const retryClause = attempt > 0 && priorFeedback
    ? `\nThis is retry attempt ${attempt}. Prior blocking feedback was:\n${priorFeedback}\nDo NOT introduce new stylistic objections if the meaning is now sound (no-moving-target rule). Only fail for a genuinely new blocking error.`
    : ''

  return [
    'You are a strict classical-Arabic (Ḥanafī fiqh) translation grader for al-Hidāyah study.',
    'Grade SEMANTICS first, phrasing second. Sound alternative English wording is not a failure.',
    '',
    'Break the passage into anchor meaning-units (ruling, condition, exception, dissent, evidence, reasoning, preference, consequence). Mark each: correct | partial | incorrect | missing, and whether it is a CORE anchor.',
    '',
    'Trigger a criticalFail (from this exact list) if present: ' + CRITICAL_FAIL_GATES.join(', ') + '.',
    '',
    'Score five categories (each 0..weight): conceptualAccuracy(3.25), structuralParsing(2.5), arabicGrammar(1.75), translationPrecision(1.5), completeness(1.0). grade = their sum, 0..10.',
    'On a PASS also return: bestTranslation, vocabulary[], guidance[], takeaways[], topics[]. On a FAIL do NOT return bestTranslation; return blockingIssues[] instead.',
    retryClause,
    '',
    'Return ONE strict JSON object only, no prose, with keys: grade, criticalFails[], anchors[{anchor,status,core,whyItMatters,whatWentWrong}], categoryScores{...}, blockingIssues[{issueType,severity,fix}], bestTranslation, feedback, vocabulary[{term,type,gloss,why}], guidance[{unit,type,functionHere,rendering}], takeaways[{function,anchor,weight,evidence,note}], topics[].',
    '',
    'SOURCE (Arabic):',
    source,
    '',
    "STUDENT'S TRANSLATION:",
    translation,
  ].join('\n')
}
