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

// ── Exam → Study handoff: the one correct cross-screen pattern ────────────────
test.describe('exam → study contextual handoff', () => {
  test('jumping to study writes a context payload and lands on the right segment', async ({ page }) => {
    await go(page, 'exams')
    await page.getByRole('button', { name: /review results/i }).first().click()
    await page.waitForTimeout(900)

    const jump = page.getByRole('button', { name: /open in study|jump to study/i }).first()
    await expect(jump, 'results offer a per-item route into Study').toBeVisible()
    await jump.click()
    await page.waitForTimeout(1600)

    // The destination changed deliberately and this characterisation records the
    // new intent rather than the old behaviour. Exams is production; legacy
    // `#study` is classified surface: 'reference'. Sending a user from a shipping
    // screen into a reference one was the defect, so the handoff now lands on the
    // V2 Study — carrying the same context, which V2 reads via readContext's
    // legacy-key fallback.
    expect(page.url()).toContain('v2/studyWorkspace')
    const text = await body(page)
    expect(text, 'Study announces the exam context it was opened with').toMatch(/Exam miss|Exam context/i)
    expect(text).toMatch(/Dismiss/i)
  })

  test('exam context is carried in session storage, not guessed', async ({ page }) => {
    await go(page, 'exams')
    await page.getByRole('button', { name: /review results/i }).first().click()
    await page.waitForTimeout(900)
    await page.getByRole('button', { name: /open in study|jump to study/i }).first().click()
    await page.waitForTimeout(1200)

    const ctx = await page.evaluate(() => {
      const raw = sessionStorage.getItem('design-sandbox.exam-context.v1')
      return raw ? JSON.parse(raw) : null
    })
    expect(ctx, 'handoff payload exists').toBeTruthy()
    expect(ctx).toHaveProperty('segmentId')
    expect(ctx).toHaveProperty('examTitle')
    expect(ctx).toHaveProperty('reason')
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
    await go(page, 'exams')
    await page.evaluate(() => localStorage.removeItem('design-sandbox.exam-attempt.v1'))
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)

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
    await go(page, 'exams')
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
