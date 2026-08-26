// Context provenance + AI operational state (S3-005). Contextual surfaces derive
// from the active project, and no AI surface leaks a raw provider/transport
// string; the user's input is preserved with a Retry.

import { test, expect } from '@playwright/test'

const now = '2026-08-16T10:00:00.000Z'

function seedArbitraryProject() {
  const seg = (id, i, ref, title, text) => ({ id, projectId: 'prj_x', sourceId: 'src_x', index: i, ref, title, chapterLabel: 'Chapter 1', text, createdAt: now })
  return {
    version: 1,
    projects: { prj_x: { id: 'prj_x', title: 'Physician research', subtitle: 'T', reference: '', createdAt: now, updatedAt: now, sourceIds: ['src_x'], segmentIds: ['x1', 'x2'], currentSegmentId: 'x1', isSample: false } },
    sources: { src_x: { id: 'src_x', projectId: 'prj_x', label: 'src', rawText: 'a b', wordCount: 2, createdAt: now } },
    segments: { x1: seg('x1', 0, '1.1', 'Physician', 'فحص الطبيب المريض.'), x2: seg('x2', 1, '1.2', 'Symptoms', 'سجّل الأعراض بعناية.') },
    drafts: {}, studyRecords: {}, notes: {}, results: {}, exams: {}, attempts: {}, proposals: {}, archives: {},
    currentProjectId: 'prj_x', seededAt: now,
  }
}

const body = async (page) => (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ')

test('Research derives refinements from the active project — no City-terms fixture', async ({ page }) => {
  await page.goto('/?chrome=0#v2/projectResearch', { waitUntil: 'domcontentloaded' })
  await page.evaluate((s) => { localStorage.setItem('arapal.v1.state', JSON.stringify(s)); localStorage.removeItem('arapal.ai.config') }, seedArbitraryProject())
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2400)

  const t = await body(page)
  expect(t, 'the fixture "City terms" chip is gone').not.toContain('City terms')
  expect(t, 'no "N city-condition links" fixture entry').not.toMatch(/city-condition links/)
  expect(t, 'the revision queue is derived from real segment data').toMatch(/Weak segments|Vocabulary notes|Translation comparison/)
  expect(t, 'no unrelated prayer/city fixture').not.toMatch(/مصر جامع|Friday prayer|comprehensive city/)
})

test('a configured-but-invalid key surfaces a NORMALISED error (no raw provider string) and preserves input', async ({ page }) => {
  await page.goto('/?chrome=0#v2/studyWorkspace', { waitUntil: 'domcontentloaded' })
  await page.evaluate((s) => {
    localStorage.setItem('arapal.v1.state', JSON.stringify(s))
    localStorage.setItem('arapal.ai.config', JSON.stringify({ provider: 'gemini', apiKey: 'INVALID_TEST_KEY', model: 'gemini-2.0-flash' }))
    localStorage.removeItem('arapal.ai.health')
  }, seedArbitraryProject())
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2400)

  await page.locator('button:has-text("Discuss")').first().click()
  const input = page.locator('.study-v2__discussionInput')
  await input.waitFor({ state: 'visible', timeout: 10000 })
  await input.fill('What does الطبيب mean here?')
  await page.locator('.study-v2__discussionFooter button:has-text("Send")').first().click()
  // Wait for the real provider call to fail and normalise.
  await page.waitForTimeout(7000)

  const notice = page.locator('.study-v2__discussion .study-v2__sampleNotice')
  const noticeText = (await notice.innerText()).trim()
  expect(noticeText, 'a calm normalised message is shown').not.toMatch(/gemini request failed|\b400\b|ETIMEDOUT|failed to fetch/i)
  expect(noticeText.length, 'some normalised message is present').toBeGreaterThan(0)
  // The typed question is preserved for Retry.
  await expect(input, 'the question survives a failed send').toHaveValue('What does الطبيب mean here?')
  // The AI operational state records the failure — not silently "verified".
  const health = await page.evaluate(() => localStorage.getItem('arapal.ai.health'))
  expect(health).toBe('failed')
})
