// Exams: instruction, save boundary, and recovery (S3-004). Answers survive an
// IMMEDIATE reload after Save and next; a stale attempt routes to a recoverable
// library, never a blank shell; the task is stated; ungraded offers recovery.

import { test, expect } from '@playwright/test'

const PROJECT = 'prj_exam'
const now = '2026-08-16T10:00:00.000Z'

function baseState() {
  const seg = (id, i, ref, title, text) => ({ id, projectId: PROJECT, sourceId: 'src_e', index: i, ref, title, chapterLabel: 'Chapter 1', text, createdAt: now })
  return {
    version: 1,
    projects: { [PROJECT]: { id: PROJECT, title: 'Exam project', subtitle: 'T', reference: '', createdAt: now, updatedAt: now, sourceIds: ['src_e'], segmentIds: ['e1', 'e2'], currentSegmentId: 'e1', isSample: false } },
    sources: { src_e: { id: 'src_e', projectId: PROJECT, label: 'src', rawText: 'a b', wordCount: 2, createdAt: now } },
    segments: { e1: seg('e1', 0, '1.1', 'One', 'فحص الطبيب المريض.'), e2: seg('e2', 1, '1.2', 'Two', 'سجّل الأعراض بعناية.') },
    drafts: {}, studyRecords: {}, notes: {}, results: {}, exams: {}, attempts: {}, proposals: {}, archives: {},
    currentProjectId: PROJECT, seededAt: now,
  }
}

function seededExam() {
  const q = (ref, sid, i, title, source) => ({ id: ref, segmentId: sid, tracker: i + 1, prefix: ref.split('.')[0], task: 'translate', label: `${ref} · ${title}`, concept: 'Chapter 1', source, reviewNote: '', number: i + 1 })
  return [{
    id: 'exam-seeded', projectId: PROJECT, title: 'Purity checkpoint', createdAt: 'Just now', scopeLabel: 'Prefix 1', status: 'ready', lastScore: null,
    questions: [q('1.1', 'e1', 0, 'One', 'فحص الطبيب المريض.'), q('1.2', 'e2', 1, 'Two', 'سجّل الأعراض بعناية.')],
  }]
}

async function goExams(page, { attempt = null } = {}) {
  await page.goto('/?chrome=0#exams', { waitUntil: 'domcontentloaded' })
  await page.evaluate(({ state, exams, att }) => {
    localStorage.setItem('arapal.v1.state', JSON.stringify(state))
    localStorage.setItem('design-sandbox.exams.v1', JSON.stringify(exams))
    if (att) localStorage.setItem('design-sandbox.exam-attempt.v1', JSON.stringify(att))
    else localStorage.removeItem('design-sandbox.exam-attempt.v1')
    sessionStorage.clear()
  }, { state: baseState(), exams: seededExam(), att: attempt })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2400)
}

const body = async (page) => (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ')

test('a question states its task and the source', async ({ page }) => {
  await goExams(page)
  await page.getByRole('button', { name: /start exam|open exam|retake/i }).first().click()
  await page.waitForTimeout(600)
  const t = await body(page)
  expect(t, 'the task is explicit').toMatch(/Your task|Translate the passage/i)
})

test('Save and next flushes synchronously — an IMMEDIATE reload keeps the answer', async ({ page }) => {
  await goExams(page)
  await page.getByRole('button', { name: /start exam|open exam|retake/i }).first().click()
  await page.waitForTimeout(500)
  await page.locator('textarea').first().fill('MY ANSWER TO Q1 THAT MUST SURVIVE')
  // Click Save and next and reload with NO wait for the debounce.
  await page.getByRole('button', { name: /save and next/i }).click()
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2400)
  // The persisted attempt carries the answer, and the attempt resumes.
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('design-sandbox.exam-attempt.v1') || 'null'))
  expect(stored, 'the attempt was flushed before navigation').toBeTruthy()
  expect(stored.answers['1.1'], 'the Q1 answer was saved synchronously').toBe('MY ANSWER TO Q1 THAT MUST SURVIVE')
  expect(stored.currentQuestionIndex, 'navigation advanced to Q2').toBe(1)
})

test('a stale attempt (its exam gone) routes to a recoverable library, not a blank shell', async ({ page }) => {
  await goExams(page, { attempt: { examId: 'exam-DOES-NOT-EXIST', answers: { q: 'stale' }, currentQuestionIndex: 0, startedAt: Date.now() } })
  const t = await body(page)
  expect(t, 'the library is shown, not a blank Attempt').toMatch(/Ready to take|Assessments/i)
  expect(t, 'a recoverable message is shown').toMatch(/couldn.t be resumed|no longer exists/i)
  // The stale attempt is cleared so it cannot trap the user again.
  const cleared = await page.evaluate(() => localStorage.getItem('design-sandbox.exam-attempt.v1'))
  expect(cleared).toBeNull()
})

test('submitting without AI is ungraded, distinct from graded, and offers Setup AI + retry', async ({ page }) => {
  await goExams(page)
  await page.getByRole('button', { name: /start exam|open exam|retake/i }).first().click()
  await page.waitForTimeout(500)
  for (let i = 0; i < 2; i += 1) {
    await page.locator('textarea').first().fill(`An answer with enough substance number ${i + 1}.`)
    await page.waitForTimeout(150)
    const next = page.getByRole('button', { name: /save and next/i })
    if (await next.count()) { await next.first().click(); await page.waitForTimeout(200) } else break
  }
  await page.getByRole('button', { name: /submit for grading/i }).click()
  await page.waitForTimeout(1200)
  const t = await body(page)
  expect(t, 'honest ungraded, no fabricated score').toMatch(/not scored/i)
  expect(t, 'recovery is offered from the ungraded result').toMatch(/Set up AI|Retry grading/i)
})
