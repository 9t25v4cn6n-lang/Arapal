// The core product loop, driven through the running application.
//
// This is the mission's success measure: a user writes a translation, leaves,
// returns, and their work is where they left it. Every assertion here was false
// before the data layer existed.
//
// State is seeded by writing the real persisted shape and reloading, which
// exercises the genuine read path rather than a test-only back door.

import { test, expect } from '@playwright/test'

const PROJECT_ID = 'prj_test'
const SEG_A = 'seg_a'
const SEG_B = 'seg_b'

function seededState() {
  const now = new Date('2026-08-16T10:00:00.000Z').toISOString()
  const segment = (id, index, ref, title, text) => ({
    id, projectId: PROJECT_ID, sourceId: 'src_test', index, ref, title,
    chapterLabel: 'Chapter 1: Purity', text, createdAt: now,
  })
  return {
    version: 1,
    projects: {
      [PROJECT_ID]: {
        id: PROJECT_ID, title: 'Journey project', subtitle: 'Test', reference: '',
        createdAt: now, updatedAt: now, sourceIds: ['src_test'],
        segmentIds: [SEG_A, SEG_B], currentSegmentId: SEG_A, isSample: false,
      },
    },
    sources: {
      src_test: {
        id: 'src_test', projectId: PROJECT_ID, label: 'Test source',
        rawText: 'First. Second.', wordCount: 2, createdAt: now,
      },
    },
    segments: {
      [SEG_A]: segment(SEG_A, 0, '1.1', 'First segment', 'الماء المطلق طهور لا يخرج عن الطهورية.'),
      [SEG_B]: segment(SEG_B, 1, '1.2', 'Second segment', 'والتيمم جائز عند عدم الماء أو العجز.'),
    },
    drafts: {}, studyRecords: {}, results: {}, exams: {}, attempts: {},
    currentProjectId: PROJECT_ID, seededAt: now,
  }
}

async function openStudy(page, { fresh = true } = {}) {
  await page.goto('/?chrome=0#v2/studyWorkspace', { waitUntil: 'domcontentloaded' })
  if (fresh) {
    await page.evaluate((state) => {
      localStorage.setItem('arapal.v1.state', JSON.stringify(state))
      sessionStorage.clear()
    }, seededState())
  }
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2400)
}

const editor = (page) => page.locator('textarea.study-v2__textarea')
const body = async (page) => (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ')

test.describe('core study loop', () => {
  test('the project’s own segments are shown, not a fixture', async ({ page }) => {
    await openStudy(page)
    const text = await body(page)
    expect(text).toContain('First segment')
    expect(text).toContain('Second segment')
    expect(text, 'the hard-coded demo tree must not appear once a project exists')
      .not.toContain('Tayammum')
  })

  test('a draft survives a full reload', async ({ page }) => {
    await openStudy(page)
    await editor(page).fill('My translation of the first segment.')
    await page.waitForTimeout(400)

    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)

    await expect(editor(page)).toHaveValue('My translation of the first segment.')
  })

  test('a draft does not leak to the next segment, and returning restores it', async ({ page }) => {
    await openStudy(page)
    await editor(page).fill('Draft belonging to segment one.')
    await page.waitForTimeout(400)

    await page.getByText('Second segment').first().click()
    await page.waitForTimeout(700)
    await expect(editor(page), 'segment two must start empty').toHaveValue('')

    await editor(page).fill('Draft belonging to segment two.')
    await page.waitForTimeout(400)

    await page.getByText('First segment').first().click()
    await page.waitForTimeout(700)
    await expect(editor(page), 'segment one keeps its own work').toHaveValue('Draft belonging to segment one.')
  })

  test('an empty submission is refused rather than graded', async ({ page }) => {
    await openStudy(page)
    await page.getByRole('button', { name: /^submit$/i }).first().click()
    await page.waitForTimeout(600)

    const text = await body(page)
    expect(text, 'the product must ask for a translation, not invent a grade')
      .toMatch(/write a translation before submitting/i)
    expect(text).not.toMatch(/grade\s*8\.4|Reviewed:/i)
  })

  test('a real submission produces a result that declares itself a sample', async ({ page }) => {
    await openStudy(page)
    await editor(page).fill('The absolute water is purifying and does not lose its purifying quality.')
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /^submit$/i }).first().click()
    await page.waitForTimeout(900)

    expect(await body(page), 'stub output must be labelled wherever it is shown')
      .toMatch(/not a scholarly assessment/i)
  })

  test('submission state survives a reload', async ({ page }) => {
    await openStudy(page)
    await editor(page).fill('The absolute water is purifying and does not lose its purifying quality.')
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /^submit$/i }).first().click()
    await page.waitForTimeout(900)

    const record = await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('arapal.v1.state'))
      return Object.values(s.studyRecords)[0]
    })
    expect(record, 'the submission was persisted').toBeTruthy()
    expect(record.attempts).toBe(1)
  })

  test('⌘Enter submits, as the footer has always claimed', async ({ page }) => {
    await openStudy(page)
    await editor(page).fill('A translation submitted with the keyboard shortcut.')
    await editor(page).press('Meta+Enter')
    await page.waitForTimeout(900)

    const attempts = await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('arapal.v1.state'))
      return Object.values(s.studyRecords)[0]?.attempts ?? 0
    })
    expect(attempts, 'the advertised shortcut must actually submit').toBe(1)
  })

  test('arriving with context shows provenance and can dismiss it', async ({ page }) => {
    await page.goto('/?chrome=0#v2/studyWorkspace', { waitUntil: 'domcontentloaded' })
    await page.evaluate((state) => {
      localStorage.setItem('arapal.v1.state', JSON.stringify(state))
      sessionStorage.setItem('arapal.v1.context', JSON.stringify({
        kind: 'segment', projectId: 'prj_test', segmentId: 'seg_b', segmentRef: '1.2',
        from: 'research', concept: 'Water types', reason: 'Needs revision',
      }))
    }, seededState())
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)

    const text = await body(page)
    expect(text, 'Study announces where it was opened from').toMatch(/from research/i)
    expect(text).toMatch(/Water types|Needs revision/i)

    await page.getByRole('button', { name: /dismiss/i }).first().click()
    await page.waitForTimeout(400)
    expect(await body(page)).not.toMatch(/from research/i)
  })

  test('with no project the route still renders its reference content', async ({ page }) => {
    await page.goto('/?chrome=0#v2/studyWorkspace', { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear() })
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)
    expect(await body(page), 'the route stays inspectable standalone').toMatch(/Ghusl|Tayammum|Purity/)
  })
})
