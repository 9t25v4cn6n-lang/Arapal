// Exam grading contract + service — the application computes the score from the
// per-question results (never answer length or fixed indexes, R-016), and is
// honestly unavailable without a provider (DECISIONS §2/§3).

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseExamGradeResult, buildExamGradingPrompt } from '../../src/v2/services/ai/contracts/examGrading.js'
import { gradeExam } from '../../src/v2/services/ai/index.js'

const questions = [
  { id: 'q1', prompt: 'State the ruling.', concept: 'ruling', segmentRef: '2.1' },
  { id: 'q2', prompt: 'Give the evidence.', concept: 'evidence', segmentRef: '2.2' },
  { id: 'q3', prompt: 'Name the condition.', concept: 'condition', segmentRef: '2.3' },
]

test('score is computed from per-question results, not answer length', () => {
  const r = parseExamGradeResult({
    questions: [
      { questionId: 'q1', result: 'correct' },
      { questionId: 'q2', result: 'partial' },
      { questionId: 'q3', result: 'incorrect' },
    ],
  }, questions)
  // (1 + 0.5 + 0) / 3 = 0.5 → 50
  assert.equal(r.score, 50)
  assert.equal(r.correctCount, 1)
  assert.equal(r.missCount, 1)
  assert.equal(r.isSample, false)
})

test('a miss carries its segment ref so remediation can open the exact segment', () => {
  const r = parseExamGradeResult({
    questions: [
      { questionId: 'q1', result: 'correct' },
      { questionId: 'q3', result: 'incorrect' },
    ],
  }, questions)
  const miss = r.questions.find((q) => q.result === 'incorrect')
  assert.equal(miss.segmentRef, '2.3')
  assert.equal(miss.concept, 'condition')
})

test('an unknown result value is treated as incorrect, not trusted', () => {
  const r = parseExamGradeResult({ questions: [{ questionId: 'q1', result: 'amazing' }] }, questions)
  assert.equal(r.questions[0].result, 'incorrect')
})

test('a response with no questions array is rejected, not rendered', () => {
  assert.throws(() => parseExamGradeResult({ score: 99 }, questions), /questions array/)
})

test('the prompt marks by semantics and returns strict JSON, no legacy scaffolding', () => {
  const p = buildExamGradingPrompt({ questions, answers: { q1: 'an answer' } })
  assert.match(p, /SEMANTICS/)
  assert.match(p, /JSON/)
  assert.doesNotMatch(p, /§EXAM§|SECTION EXAM|Ready\?/)
})

test('exam grading is honestly unavailable without a provider', async () => {
  const out = await gradeExam({ questions, answers: { q1: 'x' } })
  assert.equal(out.available, false)
  assert.equal(out.reason, 'no-provider')
})

test('a valid provider response yields an application-decided exam score', async () => {
  const out = await gradeExam(
    { questions, answers: { q1: 'a', q2: 'b', q3: 'c' } },
    { generate: async () => ({ questions: questions.map((q) => ({ questionId: q.id, result: 'correct' })) }) },
  )
  assert.equal(out.available, true)
  assert.equal(out.result.score, 100)
})

test('a provider/network failure is unavailable, not a fabricated score', async () => {
  const out = await gradeExam(
    { questions, answers: {} },
    { generate: async () => { throw new Error('boom') } },
  )
  assert.equal(out.available, false)
  assert.equal(out.reason, 'error')
})
