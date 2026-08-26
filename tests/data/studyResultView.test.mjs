// The Study result view model (S3-002). It is the single authority that decides
// what the live review may render, so it must expose real fields only and never
// dress a non-grade as evidence.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { adaptStudyResult } from '../../src/v2/screens/StudyWorkspace/studyResultView.js'

const passResult = {
  outcome: 'pass', mode: 'ai', isSample: false, score: 9.1,
  bestTranslation: 'A faithful rendering.', feedback: 'Strong.',
  vocabulary: [{ term: 'x', gloss: 'y' }], guidance: [{ unit: 'u', rendering: 'r' }],
  takeaways: [{ note: 't' }], anchors: [{ anchor: 'a', status: 'covered', core: true }],
  blockingIssues: [], topics: ['topic'],
}

test('a real PASS exposes every evaluator field', () => {
  const v = adaptStudyResult(passResult)
  assert.equal(v.graded, true)
  assert.equal(v.passed, true)
  assert.equal(v.bestTranslation, 'A faithful rendering.')
  assert.equal(v.feedback, 'Strong.')
  assert.equal(v.vocabulary.length, 1)
  assert.equal(v.guidance.length, 1)
  assert.equal(v.takeaways.length, 1)
  assert.equal(v.anchors.length, 1)
})

test('a real FAIL exposes blocking issues and NEVER a best translation', () => {
  const v = adaptStudyResult({
    outcome: 'fail', mode: 'ai', isSample: false, score: 4,
    bestTranslation: 'should be withheld before pass', feedback: 'Needs work.',
    blockingIssues: [{ issueType: 'meaning', severity: 'critical', fix: 'Fix the ruling.' }],
    vocabulary: [], guidance: [], takeaways: [], anchors: [], topics: [],
  })
  assert.equal(v.graded, true)
  assert.equal(v.passed, false)
  assert.equal(v.bestTranslation, null, 'no best translation on a fail')
  assert.equal(v.blockingIssues.length, 1)
})

test('a surface-check ("attempted") result is NOT authoritative — empty view', () => {
  const v = adaptStudyResult({ outcome: 'attempted', mode: 'surface-check', isSample: true, feedback: 'x' })
  assert.equal(v.graded, false)
  assert.equal(v.hasGrade, false)
  assert.equal(v.bestTranslation, null)
  assert.equal(v.feedback, null)
  assert.deepEqual(v.vocabulary, [])
})

test('a sample result never drives the live review as evidence', () => {
  const v = adaptStudyResult({ outcome: 'pass', mode: 'ai', isSample: true, bestTranslation: 'x', feedback: 'y' })
  assert.equal(v.graded, false)
  assert.equal(v.bestTranslation, null)
})

test('a malformed grade (missing arrays) degrades to honest absence, never a crash', () => {
  const v = adaptStudyResult({ outcome: 'pass', mode: 'ai', isSample: false })
  assert.equal(v.graded, true)
  assert.deepEqual(v.vocabulary, [])
  assert.deepEqual(v.guidance, [])
  assert.deepEqual(v.anchors, [])
  assert.equal(v.bestTranslation, null)
})

test('a null result is an empty view', () => {
  const v = adaptStudyResult(null)
  assert.equal(v.graded, false)
  assert.equal(v.hasGrade, false)
})
