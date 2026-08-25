// Study grading contract — encodes the authoritative pass rules from
// docs/ai/prompts/study/main-runtime-v6.txt §15. These tests are the evidence
// that the application decides pass/fail by the source prompt's thresholds and
// cannot be talked into a false pass by a lenient model response (R-016).

import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  computeOutcome,
  parseStudyGradeResult,
  buildStudyGradingPrompt,
  PASS_GRADE,
  PASS_COVERAGE,
  CATEGORY_WEIGHTS,
  TOTAL_WEIGHT,
} from '../../src/v2/services/ai/contracts/studyGrading.js'

const anchors = (n, status = 'correct', core = false) =>
  Array.from({ length: n }, (_, i) => ({ anchor: `a${i}`, status, core, whyItMatters: '', whatWentWrong: '' }))

test('category weights sum to the declared total (source §15.4)', () => {
  const sum = Object.values(CATEGORY_WEIGHTS).reduce((a, b) => a + b, 0)
  assert.equal(Math.round(sum * 100) / 100, TOTAL_WEIGHT)
})

test('a clean high grade with all anchors correct passes', () => {
  const r = computeOutcome({ grade: 9.1, criticalFails: [], anchors: anchors(6, 'correct', true) })
  assert.equal(r.outcome, 'pass')
  assert.equal(r.weightedCoverage, 1)
})

test('a critical fail gate forces fail even with a high grade (source §15.5)', () => {
  const r = computeOutcome({ grade: 9.8, criticalFails: ['ruling-inversion'], anchors: anchors(6, 'correct', true) })
  assert.equal(r.outcome, 'fail')
  assert.match(r.reasons.join(' '), /critical fail/)
})

test('a missing CORE anchor forces fail (source §15.3)', () => {
  const a = anchors(5, 'correct', true).concat([{ anchor: 'x', status: 'missing', core: true }])
  const r = computeOutcome({ grade: 9.0, criticalFails: [], anchors: a })
  assert.equal(r.outcome, 'fail')
  assert.match(r.reasons.join(' '), /core anchor/)
})

test('weighted anchor coverage below 85% fails even at grade threshold', () => {
  // 3 correct + 3 incorrect = 50% coverage
  const a = anchors(3, 'correct').concat(anchors(3, 'incorrect'))
  const r = computeOutcome({ grade: PASS_GRADE, criticalFails: [], anchors: a })
  assert.equal(r.outcome, 'fail')
  assert.ok(r.weightedCoverage < PASS_COVERAGE)
})

test('partial anchors count as half toward coverage', () => {
  const a = anchors(2, 'correct').concat(anchors(2, 'partial')) // (2 + 1)/4 = 0.75
  const r = computeOutcome({ grade: 9, criticalFails: [], anchors: a })
  assert.equal(r.weightedCoverage, 0.75)
  assert.equal(r.outcome, 'fail') // 0.75 < 0.85
})

test('grade just below threshold fails; at threshold with full coverage passes', () => {
  assert.equal(computeOutcome({ grade: 8.24, criticalFails: [], anchors: anchors(4) }).outcome, 'fail')
  assert.equal(computeOutcome({ grade: 8.25, criticalFails: [], anchors: anchors(4) }).outcome, 'pass')
})

test('the application overrides a model that claims pass while reporting a critical fail', () => {
  const parsed = parseStudyGradeResult({
    grade: 9.5,
    outcome: 'pass', // model lies
    criticalFails: ['omitted-source'],
    anchors: anchors(5, 'correct', true),
    bestTranslation: 'a polished translation the student did not earn',
  })
  assert.equal(parsed.outcome, 'fail')
  // best translation is withheld on a fail (source §16.3 — no model translation on fail)
  assert.equal(parsed.bestTranslation, '')
})

test('best translation is revealed on a genuine pass', () => {
  const parsed = parseStudyGradeResult({
    grade: 9.0,
    criticalFails: [],
    anchors: anchors(5, 'correct', true),
    bestTranslation: 'The earned model translation.',
  })
  assert.equal(parsed.outcome, 'pass')
  assert.equal(parsed.bestTranslation, 'The earned model translation.')
  assert.equal(parsed.isSample, false)
})

test('unknown critical-fail identifiers are dropped, not trusted', () => {
  const parsed = parseStudyGradeResult({ grade: 9, criticalFails: ['made-up-gate'], anchors: anchors(4) })
  assert.deepEqual(parsed.criticalFails, [])
  assert.equal(parsed.outcome, 'pass')
})

test('a response with no numeric grade is rejected, not rendered', () => {
  assert.throws(() => parseStudyGradeResult({ feedback: 'nice try' }), /numeric grade/)
})

test('the runtime prompt states the rules and never embeds sentinel scaffolding', () => {
  const p = buildStudyGradingPrompt({ source: 'الماء المطلق طهور', translation: 'Absolute water is pure.', attempt: 0 })
  assert.match(p, /JSON/)
  assert.match(p, /criticalFails/)
  assert.doesNotMatch(p, /§GO§|⟦HS⟧|Ready\?/) // no legacy chat machinery
})

test('retry prompt carries the no-moving-target rule (source §15.7)', () => {
  const p = buildStudyGradingPrompt({ source: 's', translation: 't', attempt: 1, priorFeedback: 'lost the exception clause' })
  assert.match(p, /no-moving-target/i)
  assert.match(p, /lost the exception clause/)
})
