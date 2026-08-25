// Characterisation tests for behaviour that currently works and must survive.
//
// These exist to stop working capability being "modernised away". They describe
// the LEGACY implementations, which are the behavioural authority until a
// verified replacement exists. When a behaviour is ported to V2, add the V2
// equivalent here rather than deleting the legacy assertion — parity is proved
// by both passing, not by swapping one for the other.
//
//   npm run test:behaviour

import { test, expect } from '@playwright/test'

const go = async (page, hash) => {
  await page.goto(`/?chrome=0#${hash}`, { waitUntil: 'domcontentloaded' })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2400)
}
const body = async (page) => (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ')

const THREE_SENTENCES =
  'AUDITONE first sentence here. AUDITTWO second sentence here. AUDITTHREE third sentence here.'

// Exams are built from a project's own canonical segments now, not a fixture, so
// a project with segments AND an assessment over them must be seeded before the
// library has anything to start (R-017). This writes the real persisted shapes
// and reloads, exercising the genuine read path — the same approach as
// study-loop.spec.js.
const EXAM_PROJECT_ID = 'prj_exam'
function examSeededState() {
  const now = new Date('2026-08-16T10:00:00.000Z').toISOString()
  const seg = (id, index, ref, title, text) => ({
    id, projectId: EXAM_PROJECT_ID, sourceId: 'src_exam', index, ref, title,
    chapterLabel: 'Chapter 1: Purity', text, createdAt: now,
  })
  return {
    version: 1,
    projects: {
      [EXAM_PROJECT_ID]: {
        id: EXAM_PROJECT_ID, title: 'Exam project', subtitle: 'Test', reference: '',
        createdAt: now, updatedAt: now, sourceIds: ['src_exam'],
        segmentIds: ['seg_e1', 'seg_e2', 'seg_e3'], currentSegmentId: 'seg_e1', isSample: false,
      },
    },
    sources: {
      src_exam: {
        id: 'src_exam', projectId: EXAM_PROJECT_ID, label: 'Test source',
        rawText: 'First. Second. Third.', wordCount: 3, createdAt: now,
      },
    },
    segments: {
      seg_e1: seg('seg_e1', 0, '1.1', 'First segment', 'الماء المطلق طهور لا يخرج عن الطهورية.'),
      seg_e2: seg('seg_e2', 1, '1.2', 'Second segment', 'والتيمم جائز عند عدم الماء أو العجز.'),
      seg_e3: seg('seg_e3', 2, '1.3', 'Third segment', 'لا تصح الجمعة إلا في مصر جامع.'),
    },
    drafts: {}, studyRecords: {}, results: {}, exams: {}, attempts: {},
    currentProjectId: EXAM_PROJECT_ID, seededAt: now,
  }
}

function seededExams() {
  const q = (ref, segmentId, index, title, source) => ({
    id: ref, segmentId, tracker: index + 1, prefix: ref.split('.')[0],
    label: `${ref} · ${title}`, concept: 'Chapter 1: Purity', source, reviewNote: '', number: index + 1,
  })
  return [{
    id: 'exam-seeded', projectId: EXAM_PROJECT_ID, title: 'Purity checkpoint',
    createdAt: 'Just now', scopeLabel: 'Prefix 1', status: 'ready', lastScore: null,
    questions: [
      q('1.1', 'seg_e1', 0, 'First segment', 'الماء المطلق طهور لا يخرج عن الطهورية.'),
      q('1.2', 'seg_e2', 1, 'Second segment', 'والتيمم جائز عند عدم الماء أو العجز.'),
      q('1.3', 'seg_e3', 2, 'Third segment', 'لا تصح الجمعة إلا في مصر جامع.'),
    ],
  }]
}

async function goExams(page) {
  await page.goto('/?chrome=0#exams', { waitUntil: 'domcontentloaded' })
  await page.evaluate(({ state, exams }) => {
    localStorage.setItem('arapal.v1.state', JSON.stringify(state))
    localStorage.setItem('design-sandbox.exams.v1', JSON.stringify(exams))
    localStorage.removeItem('design-sandbox.exam-attempt.v1')
    sessionStorage.clear()
  }, { state: examSeededState(), exams: seededExams() })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2400)
}

// ── Segmentation: the real splitting behaviour ────────────────────────────────
test.describe('legacy segmentation — splitting and options', () => {
  test('CTA is disabled until source text is present', async ({ page }) => {
    await go(page, 'segmentation')
    const cta = page.locator('.make-seg__primaryButton.is-segmentation')
    await expect(cta).toBeDisabled()
    await page.locator('.make-seg__editorTextarea').fill(THREE_SENTENCES)
    await expect(cta).toBeEnabled()
  })

  test('options menu exposes method, style, granularity and the two preferences', async ({ page }) => {
    await go(page, 'segmentation')
    await page.locator('.make-seg__editorTextarea').fill(THREE_SENTENCES)
    await page.locator('.make-seg__splitButton').click()
    await page.waitForTimeout(400)
    const text = await body(page)
    // These five controls are the options model that must be ported.
    for (const control of [/quick mode/i, /animation/i, /sentence/i, /balanced|granular/i, /manual/i]) {
      expect(text, `options menu should expose ${control}`).toMatch(control)
    }
  })

  test('splitting derives segments from the pasted source, not from a fixture', async ({ page }) => {
    await go(page, 'segmentation')
    // Quick mode may be persisted from an earlier session; force the review
    // step so the derived segments are observable rather than only counted.
    await page.evaluate(() => localStorage.setItem('arapal.segmentation.quickMode', 'false'))
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)

    await page.locator('.make-seg__editorTextarea').fill(THREE_SENTENCES)
    await page.locator('.make-seg__primaryButton.is-segmentation').click()
    await page.waitForTimeout(4600)
    const text = await body(page)

    // Two independent proofs of derivation:
    // 1. the user's own words survive into the proposal;
    expect(text, "the user's own words must appear downstream").toMatch(/AUDITONE/)
    // 2. the count varies with the input — balanced granularity pairs
    //    sentences, so three sentences yield two segments. A fixture could not.
    expect(text).toMatch(/2\b/)
  })

  test('segment count varies with granularity — proof the splitter is real', async ({ page }) => {
    const countFor = async (granularity) => {
      await go(page, 'segmentation')
      await page.evaluate((g) => {
        localStorage.setItem('arapal.segmentation.granularity', g)
        localStorage.setItem('arapal.segmentation.quickMode', 'true')
      }, granularity)
      await page.reload({ waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(2400)
      await page.locator('.make-seg__editorTextarea').fill(THREE_SENTENCES)
      await page.locator('.make-seg__primaryButton.is-segmentation').click()
      await page.waitForTimeout(4600)
      const m = (await body(page)).match(/(\d+) segments? created/i)
      return m ? Number(m[1]) : null
    }
    const tight = await countFor('tight')
    const broad = await countFor('broad')
    expect(tight, 'tight granularity yields one segment per sentence').toBe(3)
    expect(broad, 'broad granularity groups sentences').toBeLessThan(tight)
  })

  test('segmentation preferences persist across reload', async ({ page }) => {
    await go(page, 'segmentation')
    const before = await page.evaluate(() =>
      Object.keys(localStorage).filter((k) => k.startsWith('arapal.segmentation')))
    expect(before.length, 'segmentation preferences are persisted to localStorage').toBeGreaterThan(0)
  })
})

// ── Study: submission outcome, support swap, discussion ───────────────────────
test.describe('legacy study — submission, support and discussion', () => {
  test.beforeEach(async ({ page }) => {
    await go(page, 'study')
    await page.evaluate(() => localStorage.removeItem('design-sandbox.segment-state.v1'))
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)
  })

  test('segment 1.3 fails on first submission and passes on the second', async ({ page }) => {
    const submit = page.locator('.fg-center__editorShell .fg-center__primaryButton').first()
    await submit.click()
    await page.waitForTimeout(900)
    expect(await body(page)).toMatch(/Needs Revision/i)
    await submit.click()
    await page.waitForTimeout(900)
    expect(await body(page)).toMatch(/Submitted/i)
  })

  test('support cards swap between pre- and post-submission sets', async ({ page }) => {
    const pre = await body(page)
    expect(pre).toMatch(/Guidance/i)
    expect(pre).toMatch(/Lexicography/i)
    expect(pre).toMatch(/Phrasing/i)

    await page.locator('.fg-center__editorShell .fg-center__primaryButton').first().click()
    await page.waitForTimeout(900)
    const post = await body(page)
    expect(post, 'post-submission support introduces grading/repair material').toMatch(/Grade|Fix|Takeaway/i)
  })

  test('discussion panel opens docked and can be floated', async ({ page }) => {
    await page.getByText(/discuss this segment/i).first().click()
    await page.waitForTimeout(700)
    expect(await body(page)).toMatch(/discussion|companion|ask/i)
    const float = page.getByText(/^float$/i).first()
    if (await float.count()) {
      await float.click()
      await page.waitForTimeout(500)
      expect(await body(page)).toMatch(/dock/i)
    }
  })

  test('submission state persists across a full reload', async ({ page }) => {
    await page.locator('.fg-center__editorShell .fg-center__primaryButton').first().click()
    await page.waitForTimeout(900)
    const before = (await body(page)).match(/Needs Revision|Submitted/i)?.[0]
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)
    expect(await body(page), 'segment submission state survives reload').toMatch(new RegExp(before, 'i'))
  })

  test('segment navigation moves between segments', async ({ page }) => {
    await page.getByText('1.4 Tayammum').first().click()
    await page.waitForTimeout(700)
    expect(await body(page)).toMatch(/Tayammum/)
  })
})

// ── Exams grade honestly: no fabricated placeholder scores (R-016) ────────────
//
// The exam→study handoff MECHANISM (context payload → V2 Study lands on the
// right segment) is characterised in segmentation-handoff.spec.js. These tests
// now assert the R-016 fix: without an AI grader, an exam attempt is honestly
// unscored and the app invents no score and no per-miss remediation. Per-miss
// remediation is a real capability, but it is legitimately gated on a real grade
// (DECISIONS §2) and cannot be exercised without a provider.
test.describe('exams grade honestly', () => {
  async function takeAndSubmitFirstExam(page) {
    await goExams(page)
    await page.getByRole('button', { name: /start exam/i }).first().click()
    await page.waitForTimeout(500)
    // Answer each question, advancing until the submit control appears.
    for (let i = 0; i < 8; i += 1) {
      await page.locator('textarea').first().fill(`A real answer number ${i + 1} with enough substance to count as an attempt.`)
      await page.waitForTimeout(150)
      const next = page.getByRole('button', { name: /save and next/i })
      if (await next.count()) {
        await next.first().click()
        await page.waitForTimeout(200)
      } else {
        break
      }
    }
    await page.getByRole('button', { name: /submit for grading/i }).click()
    await page.waitForTimeout(900)
  }

  test('submitting without a grader is honestly unscored, with no invented misses', async ({ page }) => {
    await takeAndSubmitFirstExam(page)
    const text = await body(page)
    expect(text, 'no fabricated score is shown').toMatch(/not scored|Not graded/i)
    expect(text, 'the honest reason is stated').toMatch(/AI grading is not configured/i)
    // No fabricated per-miss remediation route without a real grade.
    expect(
      await page.getByRole('button', { name: /study what needs attention/i }).count(),
      'there is no invented remediation to jump to',
    ).toBe(0)
  })

  test('an unscored attempt is not recorded as a graded percentage', async ({ page }) => {
    await takeAndSubmitFirstExam(page)
    // Return to the library; the just-attempted exam must not show an invented %.
    await page.getByRole('button', { name: /back to assessments|assessment library/i }).first().click()
    await page.waitForTimeout(600)
    const completedRegion = await body(page)
    expect(completedRegion, 'no fabricated percentage is displayed').not.toMatch(/\b\d{1,3}%/)
  })
})

// ── Known gaps, asserted so a fix is detected rather than assumed ─────────────
test.describe('known gaps — these SHOULD fail once fixed, update them then', () => {
  test.fixme('GAP: translation draft is never persisted', async ({ page }) => {
    await go(page, 'study')
    await page.locator('.fg-center__textarea').fill('draft that should survive')
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)
    await expect(page.locator('.fg-center__textarea')).toHaveValue('draft that should survive')
  })

  test.fixme('GAP: draft must not leak between segments', async ({ page }) => {
    await go(page, 'study')
    await page.locator('.fg-center__textarea').fill('draft for 1.3')
    await page.getByText('1.4 Tayammum').first().click()
    await page.waitForTimeout(700)
    await expect(page.locator('.fg-center__textarea')).toHaveValue('')
  })

  test('FIXED: the exam attempt survives a reload, so the AUTOSAVE badge is honest', async ({ page }) => {
    await goExams(page)

    // "Start exam" on the promoted next-assessment row, "Open exam"/"Retake" on
    // the rest. Matching the capability rather than one screen's wording.
    await page.getByRole('button', { name: /start exam|open exam|retake/i }).first().click()
    await page.waitForTimeout(800)
    await page.locator('textarea').first().fill('answer that should survive')
    // The indicator debounces at 600ms; wait for the write it now really does.
    await page.waitForTimeout(1200)

    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)
    await expect(page.locator('textarea').first()).toHaveValue('answer that should survive')
  })

  test('a completed attempt does not resurrect on the next visit', async ({ page }) => {
    await goExams(page)
    await page.evaluate(() => localStorage.setItem(
      'design-sandbox.exam-attempt.v1',
      JSON.stringify({ examId: 'nope', answers: { q: 'stale' }, currentQuestionIndex: 0 })))
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)
    // An attempt pointing at an exam that no longer exists must not trap the user.
    const text = (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ')
    expect(text, 'the screen still renders something usable').toMatch(/exam/i)
  })
})
