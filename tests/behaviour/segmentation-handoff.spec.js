// The handoff that used to lose the user's work.
//
// Journey A: paste a source, segment it, arrive in Study and find *that* source
// there. Previously the flow ended with a bare hash change carrying nothing, so
// Study reopened a hard-coded fixture and the approved segmentation vanished.

import { test, expect } from '@playwright/test'

const MARKER = 'AUDITMARKERALPHA'
const SOURCE =
  `${MARKER} the Friday prayer is not valid except in a comprehensive city. ` +
  'AUDITMARKERBETA it is not permitted in the villages. ' +
  'AUDITMARKERGAMMA there is no eid prayer except in a comprehensive city.'

const body = async (page) => (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ')

async function openPaste(page) {
  await page.goto('/?chrome=0#v2/segmentationPasteNext', { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear() })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2400)
}

test.describe('segmentation → study handoff', () => {
  test('granularity and style survive a reload, because they change the output', async ({ page }) => {
    await openPaste(page)

    // Granularity is not a cosmetic preference: on a five-sentence source it
    // takes the result from three segments to five. It was omitted from the
    // preference store AND hard-coded at mount, so choosing Tighter and coming
    // back silently re-segmented the next source differently.
    await page.getByRole('button', { name: /open action options/i }).first().click()
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: /tighter/i }).first().click()
    await page.waitForTimeout(300)

    await page.locator('textarea').first().fill(SOURCE)
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /segment text/i }).first().click()
    await page.waitForTimeout(4000)

    const stored = await page.evaluate(() => localStorage.getItem('arapal:v2:segmentation-flow'))
    expect(JSON.parse(stored).granularity, 'granularity is persisted').toBe('tight')

    await page.goto('/?chrome=0#v2/segmentationPasteNext', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)
    await page.getByRole('button', { name: /open action options/i }).first().click()
    await page.waitForTimeout(400)

    const tighterSelected = await page.evaluate(() => {
      const rows = [...document.querySelectorAll('button')].filter((b) => /Tighter/.test(b.textContent))
      return rows.some((b) => b.getAttribute('aria-pressed') === 'true'
        || b.getAttribute('aria-checked') === 'true'
        || /is-selected|is-active/.test(String(b.className)))
    })
    expect(tighterSelected, 'the reloaded screen re-selects the stored granularity').toBe(true)
  })

  test('the pasted source becomes a real project with real segments', async ({ page }) => {
    await openPaste(page)
    await page.locator('textarea').first().fill(SOURCE)
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /segment text/i }).first().click()
    await page.waitForTimeout(1500)

    const state = await page.evaluate(() => JSON.parse(localStorage.getItem('arapal.v1.state')))
    expect(Object.keys(state.projects), 'a project was created').toHaveLength(1)
    expect(Object.keys(state.sources), 'the source was kept').toHaveLength(1)

    const segments = Object.values(state.segments)
    expect(segments.length, 'segments were derived from the source').toBeGreaterThan(0)
    expect(
      segments.map((s) => s.text).join(' '),
      "the user's own words are what got segmented",
    ).toContain(MARKER)
  })

  test('the project is named after the source, not "Untitled"', async ({ page }) => {
    await openPaste(page)
    await page.locator('textarea').first().fill(SOURCE)
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /segment text/i }).first().click()
    await page.waitForTimeout(1500)

    const title = await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('arapal.v1.state'))
      return Object.values(s.projects)[0].title
    })
    expect(title).toContain(MARKER)
  })

  test('Study opens the segmented source, not a fixture', async ({ page }) => {
    await openPaste(page)
    await page.locator('textarea').first().fill(SOURCE)
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /segment text/i }).first().click()
    await page.waitForTimeout(1500)

    await page.goto('/?chrome=0#v2/studyWorkspace', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)

    const text = await body(page)
    expect(text, 'the work survived the handoff').toContain(MARKER)
    expect(text, 'the hard-coded demo project must not reappear').not.toContain('Tayammum')
  })

  test('the segmented work survives a reload', async ({ page }) => {
    await openPaste(page)
    await page.locator('textarea').first().fill(SOURCE)
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /segment text/i }).first().click()
    await page.waitForTimeout(1500)

    await page.goto('/?chrome=0#v2/studyWorkspace', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)

    expect(await body(page)).toContain(MARKER)
  })

  test('an empty source cannot create a project', async ({ page }) => {
    await openPaste(page)
    // The screen ships with sample source prefilled, so "empty" has to be
    // reached deliberately — clearing it is a real user's first action.
    await page.locator('textarea').first().fill('')
    await page.waitForTimeout(300)

    // getByRole picks up the split tail (the options chevron) first, which
    // stays operable by design; target the primary control itself.
    const primary = page.locator('button:has-text("Segment Text")').first()
    await expect(primary, 'the primary CTA is disabled with no source').toBeDisabled()

    const projects = await page.evaluate(() => {
      const raw = localStorage.getItem('arapal.v1.state')
      return raw ? Object.keys(JSON.parse(raw).projects).length : 0
    })
    expect(projects, 'nothing was created').toBe(0)
  })
})

test.describe('exam → study handoff across the product boundary', () => {
  test('a legacy exam context lands in V2 Study, on the right segment', async ({ page }) => {
    await openPaste(page)
    await page.locator('textarea').first().fill(SOURCE)
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /segment text/i }).first().click()
    await page.waitForTimeout(4000)

    // Exams is production but still runs in the legacy shell, so it writes the
    // legacy context shape. writeContext published both keys and readContext read
    // only its own, which made the bridge one-way: the handoff §2.3 protects
    // arrived at V2 Study carrying nothing.
    const targetSegment = await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('arapal.v1.state'))
      const project = Object.values(state.projects)[0]
      const segmentId = project.segmentIds[project.segmentIds.length - 1]
      sessionStorage.setItem('design-sandbox.exam-context.v1', JSON.stringify({
        segmentId, examTitle: 'Prayer foundations checkpoint', concept: 'Jumuah validity', reason: 'Exam miss',
      }))
      return segmentId
    })
    expect(targetSegment).toBeTruthy()

    await page.goto('/?chrome=0#v2/studyWorkspace', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)

    expect(await body(page), 'provenance from the exam is shown').toMatch(/Exam miss/i)
    const strip = page.locator('.study-v2__contextStrip, .study-v2__contextBanner').first()
    await expect(strip, 'the context strip renders rather than the context being dropped').toBeVisible()
  })
})

test.describe('review and success reflect the published segmentation', () => {
  const publish = async (page) => {
    await openPaste(page)
    await page.locator('textarea').first().fill(SOURCE)
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /segment text/i }).first().click()
    await page.waitForTimeout(1500)
  }

  test('Review edits the user’s own proposal, not a fixture', async ({ page }) => {
    await publish(page)
    await page.goto('/?chrome=0#v2/segmentationReview', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2600)
    expect(await body(page), 'the review list shows the pasted source').toContain(MARKER)
  })

  test('Success reports the real segment count', async ({ page }) => {
    await publish(page)
    const expected = await page.evaluate(() =>
      Object.keys(JSON.parse(localStorage.getItem('arapal.v1.state')).segments).length)

    await page.goto('/?chrome=0#v2/segmentationSuccess', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2600)
    expect(await body(page)).toMatch(new RegExp(`\\b${expected}\\b`))
  })

  test('Start Studying carries context into Study', async ({ page }) => {
    await publish(page)
    await page.goto('/?chrome=0#v2/segmentationSuccess', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2600)
    await page.getByRole('button', { name: /start studying/i }).first().click()
    await page.waitForTimeout(1800)

    expect(page.url()).toContain('studyWorkspace')
    const ctx = await page.evaluate(() => {
      const raw = sessionStorage.getItem('arapal.v1.context')
      return raw ? JSON.parse(raw) : null
    })
    expect(ctx, 'a context payload was written').toBeTruthy()
    expect(ctx.kind).toBe('published')
    expect(ctx.segmentId, 'it names the segment to open').toBeTruthy()

    const text = await body(page)
    expect(text, 'Study announces where it came from').toMatch(/from segmentation/i)
    expect(text).toContain(MARKER)
  })
})
