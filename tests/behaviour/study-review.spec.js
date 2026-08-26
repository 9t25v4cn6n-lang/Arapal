// The live Study review is driven ONLY by the stored grading result (S3-002).
// These seed representative results (the real read path) and assert the actual
// production UI renders every evaluator field — and, on an arbitrary source,
// shows no unrelated prayer/city fixture. Provider PASS with a real key is the
// external item; the render path is proven here with injected results.

import { test, expect } from '@playwright/test'

const PROJECT = 'prj_review'
const SEG = 'seg_review'
const now = '2026-08-16T10:00:00.000Z'
// Deliberately NOT a prayer/city passage — this is how the fixture leak shows.
const SOURCE = 'فحص الطبيب الماهر المريض عند الفجر وسجّل الأعراض بعناية.'

function stateWith(record, result) {
  const key = `${PROJECT}::${SEG}`
  return {
    version: 1,
    projects: { [PROJECT]: { id: PROJECT, title: 'Physician text', subtitle: 'T', reference: '', createdAt: now, updatedAt: now, sourceIds: ['src_r'], segmentIds: [SEG], currentSegmentId: SEG, isSample: false } },
    sources: { src_r: { id: 'src_r', projectId: PROJECT, label: 'src', rawText: SOURCE, wordCount: 9, createdAt: now } },
    segments: { [SEG]: { id: SEG, projectId: PROJECT, sourceId: 'src_r', index: 0, ref: '1.1', title: 'Physician', chapterLabel: 'Chapter 1', text: SOURCE, createdAt: now } },
    drafts: { [key]: { projectId: PROJECT, segmentId: SEG, text: 'The skilled physician examined the patient at dawn.', updatedAt: now } },
    studyRecords: { [key]: record },
    notes: {}, results: result ? { [result.id]: result } : {}, exams: {}, attempts: {}, proposals: {}, archives: {},
    currentProjectId: PROJECT, seededAt: now,
  }
}

async function openReview(page, record, result) {
  await page.goto('/?chrome=0#v2/studyWorkspace', { waitUntil: 'domcontentloaded' })
  await page.evaluate((s) => { localStorage.setItem('arapal.v1.state', JSON.stringify(s)); sessionStorage.clear() }, stateWith(record, result))
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2400)
}

const body = async (page) => (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ')

const RECORD_SUBMITTED = { projectId: PROJECT, segmentId: SEG, submissionState: 'submitted', attempts: 1, lastResultId: 'res_1', updatedAt: now }
const RECORD_FAILED = { projectId: PROJECT, segmentId: SEG, submissionState: 'failed', attempts: 1, lastResultId: 'res_1', updatedAt: now }

test.describe('Study review renders the stored grade (S3-002)', () => {
  test('an injected PASS renders every evaluator field, with no prayer/city fixture', async ({ page }) => {
    await openReview(page, RECORD_SUBMITTED, {
      id: 'res_1', projectId: PROJECT, segmentId: SEG, outcome: 'pass', score: 9.2, isSample: false, mode: 'ai',
      bestTranslation: 'The skilled physician examined the patient at dawn and recorded the symptoms carefully.',
      feedback: 'Accurate and complete; the causal link is well rendered.',
      vocabulary: [{ term: 'الطبيب', type: 'noun', gloss: 'the physician', why: 'agent' }],
      guidance: [{ unit: 'فحص', rendering: 'past-tense action' }],
      takeaways: [{ note: 'Keep the diagnostic sequence explicit.' }],
      anchors: [{ anchor: 'physician examined', status: 'covered', core: true, whatWentWrong: '' }],
      topics: ['medicine'], blockingIssues: [], notes: [],
    })
    const t = await body(page)
    expect(t, 'best-in-class from the result').toContain('recorded the symptoms carefully')
    expect(t, 'feedback from the result').toContain('Accurate and complete')
    expect(t, 'vocabulary from the result').toMatch(/الطبيب|the physician/)
    expect(t, 'guidance from the result').toContain('past-tense action')
    expect(t, 'takeaways from the result').toContain('diagnostic sequence')
    expect(t, 'criterion evidence from the result').toContain('physician examined')
    expect(t, 'NO unrelated prayer/city fixture leaks in').not.toMatch(/مصر جامع|Friday prayer|comprehensive city|أفنية|Tayammum/)
  })

  test('the injected PASS survives a reload and the segment stays completed', async ({ page }) => {
    await openReview(page, RECORD_SUBMITTED, {
      id: 'res_1', projectId: PROJECT, segmentId: SEG, outcome: 'pass', score: 9, isSample: false, mode: 'ai',
      bestTranslation: 'A durable best translation of the physician passage.', feedback: 'Solid.',
      vocabulary: [], guidance: [], takeaways: [], anchors: [], topics: [], blockingIssues: [], notes: [],
    })
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)
    expect(await body(page)).toContain('durable best translation')
  })

  test('an injected critical FAIL shows blocking issues and NO fabricated best-in-class', async ({ page }) => {
    await openReview(page, RECORD_FAILED, {
      id: 'res_1', projectId: PROJECT, segmentId: SEG, outcome: 'fail', score: 4, isSample: false, mode: 'ai',
      bestTranslation: '', feedback: 'The core ruling was mistranslated.',
      vocabulary: [], guidance: [], takeaways: [], anchors: [],
      blockingIssues: [{ issueType: 'meaning', severity: 'critical', fix: 'Correct the diagnostic clause.' }],
      topics: [], notes: [],
    })
    const t = await body(page)
    expect(t, 'the retry blocker is shown').toContain('Correct the diagnostic clause')
    expect(t, 'it is stated as not passed').toMatch(/didn.t pass|not a pass|Fix these/i)
    expect(t, 'no fabricated best-in-class on a fail').not.toContain('Best in Class Translation')
  })

  test('a malformed grade degrades to honest absence, not a crash or invented content', async ({ page }) => {
    await openReview(page, RECORD_SUBMITTED, {
      id: 'res_1', projectId: PROJECT, segmentId: SEG, outcome: 'pass', isSample: false, mode: 'ai',
      // Missing bestTranslation/feedback/arrays entirely.
    })
    const t = await body(page)
    expect(t, 'the review still renders').toMatch(/Your Translation/i)
    expect(t, 'honest absence of a reference translation').toMatch(/No reference translation/i)
    expect(t, 'no fixture leaked in to fill the gap').not.toMatch(/comprehensive city|Friday prayer/)
  })
})
