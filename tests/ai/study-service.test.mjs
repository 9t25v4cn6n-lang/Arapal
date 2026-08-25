// AI service boundary — the honest-unavailable contract and the guard that a
// provider response is still decided by the application (DECISIONS §3, R-016).
// The provider network call is injected, so these run without a key or network.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { gradeStudyAttempt } from '../../src/v2/services/ai/index.js'

const passResponse = {
  grade: 9.1,
  criticalFails: [],
  anchors: [{ anchor: 'ruling', status: 'correct', core: true }],
  bestTranslation: 'The earned model translation.',
  feedback: 'Sound.',
}

test('with no provider configured, grading is honestly unavailable (never fabricated)', async () => {
  const out = await gradeStudyAttempt({ source: 's', translation: 'a real attempt' })
  assert.equal(out.available, false)
  assert.equal(out.reason, 'no-provider')
})

test('an empty translation is refused before any provider call', async () => {
  let called = false
  const out = await gradeStudyAttempt(
    { source: 's', translation: '   ' },
    { generate: async () => { called = true; return passResponse } },
  )
  assert.equal(out.available, false)
  assert.equal(out.reason, 'empty')
  assert.equal(called, false)
})

test('a valid provider response yields an application-decided pass', async () => {
  const out = await gradeStudyAttempt(
    { source: 'الماء المطلق طهور', translation: 'Absolute water is purifying.' },
    { generate: async () => passResponse },
  )
  assert.equal(out.available, true)
  assert.equal(out.result.outcome, 'pass')
  assert.equal(out.result.isSample, false)
  assert.equal(out.result.bestTranslation, 'The earned model translation.')
})

test('a provider claiming pass while reporting a critical fail is overridden to fail', async () => {
  const out = await gradeStudyAttempt(
    { source: 's', translation: 't' },
    { generate: async () => ({ ...passResponse, outcome: 'pass', criticalFails: ['ruling-inversion'] }) },
  )
  assert.equal(out.available, true)
  assert.equal(out.result.outcome, 'fail')
  assert.equal(out.result.bestTranslation, '') // withheld on fail
})

test('a provider/network/parse failure is unavailable, not a fabricated grade', async () => {
  const out = await gradeStudyAttempt(
    { source: 's', translation: 't' },
    { generate: async () => { throw new Error('network down') } },
  )
  assert.equal(out.available, false)
  assert.equal(out.reason, 'error')
  assert.match(out.message, /network down/)
})

test('a malformed provider response (no grade) is unavailable, not rendered', async () => {
  const out = await gradeStudyAttempt(
    { source: 's', translation: 't' },
    { generate: async () => ({ feedback: 'no grade here' }) },
  )
  assert.equal(out.available, false)
  assert.equal(out.reason, 'error')
})
