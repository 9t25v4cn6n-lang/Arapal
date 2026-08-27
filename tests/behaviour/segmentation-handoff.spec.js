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

// The default method is truthful on-device splitting, so the primary CTA reads
// "Segment on device" (never "AI ..."). Clicking it stores a NON-AUTHORITATIVE
// proposal and routes to Review — it does NOT publish (S3-001).
const PRIMARY_CTA = 'button:has-text("Segment on device")'

async function pasteToProposal(page, source = SOURCE) {
  await openPaste(page)
  await page.locator('textarea').first().fill(source)
  await page.waitForTimeout(300)
  await page.locator(PRIMARY_CTA).first().click()
}

// The full transaction: paste → proposal → Review → EXPLICIT approval → canonical.
async function pasteAndApprove(page, source = SOURCE) {
  await pasteToProposal(page, source)
  await page.waitForURL(/segmentationReview/, { timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(1500)
  await page.getByRole('button', { name: /approve & continue|^approve/i }).first().click()
  // Approval publishes and enters Study directly — no ceremonial Success route
  // (Stage 2 fold: Source → Review → Study).
  await page.waitForURL(/studyWorkspace/, { timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(1200)
}

test.describe('segmentation → study handoff', () => {
  test('granularity and style survive a reload, because they change the output', async ({ page }) => {
    await openPaste(page)

    // Intake starts empty now, and the action menu lives on the primary CTA,
    // which is disabled until there is source text — so paste first, then adjust
    // options. Granularity is not cosmetic: on a five-sentence source it takes
    // the result from three segments to five. It was omitted from the preference
    // store AND hard-coded at mount, so choosing Tighter and coming back silently
    // re-segmented the next source differently.
    await page.locator('textarea').first().fill(SOURCE)
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /open action options/i }).first().click()
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: /tighter/i }).first().click()
    await page.waitForTimeout(300)

    await page.locator(PRIMARY_CTA).first().click()
    await page.waitForTimeout(4000)

    const stored = await page.evaluate(() => localStorage.getItem('arapal:v2:segmentation-flow'))
    expect(JSON.parse(stored).granularity, 'granularity is persisted').toBe('tight')

    await page.goto('/?chrome=0#v2/segmentationPasteNext', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)
    // The action menu lives on the CTA, disabled until there is text — so type
    // before opening it to read back the persisted granularity.
    await page.locator('textarea').first().fill(SOURCE)
    await page.waitForTimeout(300)
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

  test('a proposal is stored on segment, and canonical segments appear ONLY after approval', async ({ page }) => {
    await pasteToProposal(page)
    await page.waitForTimeout(1500)

    // After segmenting: a project + source exist, a NON-AUTHORITATIVE proposal
    // is stored, and NOTHING is canonical yet (S3-001).
    let state = await page.evaluate(() => JSON.parse(localStorage.getItem('arapal.v1.state')))
    expect(Object.keys(state.projects), 'a project was created').toHaveLength(1)
    expect(Object.keys(state.sources), 'the source was kept').toHaveLength(1)
    const projectId = Object.keys(state.projects)[0]
    expect(state.proposals[projectId]?.chunks?.length, 'a proposal was stored').toBeGreaterThan(0)
    expect(Object.keys(state.segments), 'nothing is canonical before approval').toHaveLength(0)

    // Approve in Review — the only canonical publish.
    await page.waitForURL(/segmentationReview/, { timeout: 15000 })
    await page.waitForTimeout(1000)
    await page.getByRole('button', { name: /approve & continue|^approve/i }).first().click()
    await page.waitForTimeout(1500)

    state = await page.evaluate(() => JSON.parse(localStorage.getItem('arapal.v1.state')))
    const segments = Object.values(state.segments)
    expect(segments.length, 'segments are canonical after approval').toBeGreaterThan(0)
    expect(
      segments.map((s) => s.text).join(' '),
      "the user's own words are what got segmented",
    ).toContain(MARKER)
  })

  test('the project is named after the source, not "Untitled"', async ({ page }) => {
    await openPaste(page)
    await page.locator('textarea').first().fill(SOURCE)
    await page.waitForTimeout(300)
    await page.locator(PRIMARY_CTA).first().click()
    await page.waitForTimeout(1500)

    const title = await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('arapal.v1.state'))
      return Object.values(s.projects)[0].title
    })
    expect(title).toContain(MARKER)
  })

  test('Study opens the approved source, not a fixture', async ({ page }) => {
    await pasteAndApprove(page)

    await page.goto('/?chrome=0#v2/studyWorkspace', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)

    const text = await body(page)
    expect(text, 'the work survived the handoff').toContain(MARKER)
    expect(text, 'the hard-coded demo project must not reappear').not.toContain('Tayammum')
  })

  test('the approved work survives a reload', async ({ page }) => {
    await pasteAndApprove(page)

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
    const primary = page.locator('button:has-text("Segment on device")').first()
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
    await pasteAndApprove(page)

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

    // Approval now lands on Study directly, so the page is already at
    // #v2/studyWorkspace — a goto to the same URL is a no-op that would not
    // remount and re-read the exam context. In production the handoff arrives
    // from Exams (a real route change); here a reload reproduces that fresh entry.
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)

    expect(await body(page), 'provenance from the exam is shown').toMatch(/Exam miss/i)
    const strip = page.locator('.study-v2__contextStrip, .study-v2__contextBanner').first()
    await expect(strip, 'the context strip renders rather than the context being dropped').toBeVisible()
  })
})

test.describe('review and publish handoff enters Study directly', () => {
  test('Review edits the user’s own proposal, not a fixture', async ({ page }) => {
    await pasteToProposal(page)
    await page.waitForTimeout(1000)
    await page.goto('/?chrome=0#v2/segmentationReview', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2600)
    expect(await body(page), 'the review list shows the pasted source').toContain(MARKER)
  })

  test('Approval publishes canonical segments and lands in Study', async ({ page }) => {
    await pasteAndApprove(page)

    // The fold: approval goes straight to Study, no Success ceremony in between.
    expect(page.url(), 'approval enters Study directly').toContain('studyWorkspace')

    const store = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('arapal.v1.state')))
    const segmentCount = Object.keys(store.segments).length
    expect(segmentCount, 'approval produced canonical segments').toBeGreaterThan(0)

    // Study opens the first canonical segment (publish set project.currentSegmentId).
    const project = Object.values(store.projects).find((p) => p.segmentIds?.length)
    expect(project?.currentSegmentId, 'the first canonical segment is the active one')
      .toBe(project.segmentIds[0])
  })

  test('Publishing shows the provenance banner and the first segment', async ({ page }) => {
    await pasteAndApprove(page)
    await page.waitForTimeout(1200)

    const text = await body(page)
    // Confirmation/provenance banner instead of a ceremonial Success screen.
    expect(text, 'Study confirms what was just published').toMatch(/segments? published|saved on this device/i)
    expect(text, 'the published source is what Study shows').toContain(MARKER)

    // The one-shot provenance note is consumed (cleared) once shown.
    const stillThere = await page.evaluate(() =>
      window.sessionStorage.getItem('arapal:v2:publish-provenance'))
    expect(stillThere, 'the provenance note is one-shot').toBeNull()
  })
})
