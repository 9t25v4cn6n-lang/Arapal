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
