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

  test('a submission is saved as an honest attempt, never a fabricated pass', async ({ page }) => {
    await openStudy(page)
    await editor(page).fill('The absolute water is purifying and does not lose its purifying quality.')
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /^submit$/i }).first().click()
    await page.waitForTimeout(900)

    // Without an AI provider the product states that honestly and does not
    // fabricate a grade (R-016 + DECISIONS §3).
    expect(await body(page), 'grading unavailability must be stated, not faked')
      .toMatch(/AI grading is not configured|not a pass/i)

    // The record is an ATTEMPT — a form-level check must not become a pass.
    const record = await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('arapal.v1.state'))
      return Object.values(s.studyRecords)[0]
    })
    expect(record.submissionState, 'a surface check must not be a semantic pass').toBe('attempted')
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

  // ── Parity with legacy Study ────────────────────────────────────────────────
  //
  // legacy-capabilities.spec.js pins three Study behaviours that had no V2
  // counterpart here, and its own doctrine is that parity is proved by BOTH
  // assertions passing rather than by swapping one for the other. These are the
  // missing halves. They are written against the V2 surface — accessible names
  // and the store — not by translating legacy selectors.

  test('parity: the support rail carries guidance, lexicography and phrasing', async ({ page }) => {
    await openStudy(page)
    const text = await body(page)
    // Legacy equivalent: 'support cards swap between pre- and post-submission sets'.
    // The pre-submission set is what parity requires; V2 additionally offers each
    // card floated or fullscreen, which legacy cannot do.
    expect(text).toMatch(/Guidance/i)
    expect(text).toMatch(/Lexicography/i)
    expect(text).toMatch(/Phrasing/i)

    for (const name of [/expand guidance/i, /float guidance/i, /open guidance fullscreen/i]) {
      await expect(
        page.getByRole('button', { name }),
        'V2 exposes support modes legacy has no equivalent for',
      ).toHaveCount(1)
    }
  })

  test('parity: the discussion companion opens and closes', async ({ page }) => {
    await openStudy(page)
    // Legacy equivalent: 'discussion panel opens docked and can be floated'.
    // Matched on the accessible name, because the control is LABELLED "Discuss
    // this segment" and RENDERS "Discuss" — the mismatch that made the visual
    // suite record this state as unreachable for weeks.
    await page.getByRole('button', { name: /discuss this segment/i }).click()
    await page.waitForTimeout(600)
    // The panel is titled for the SEGMENT it belongs to, not for the tool. It
    // used to read "Study Companion", which names the feature and never says the
    // conversation is attached to the segment in front of you — the scope the
    // narrow "Discuss" toggle has no room to carry.
    expect(await body(page)).toMatch(/discussion/i)

    // One action, one word. The panel offered "Close" while the editor's toggle
    // offered "Hide", which read as two different capabilities for one state.
    // Not a count — which composer is mounted varies — but no control may offer
    // a second verb for the same job.
    await expect(
      page.getByRole('button', { name: /close study companion/i }),
      'dismissing the discussion must not have two different names',
    ).toHaveCount(0)

    await page.getByRole('button', { name: /hide the discussion/i }).first().click()
    await page.waitForTimeout(600)
    expect(await body(page), 'the companion must be dismissible, not a one-way door')
      .not.toMatch(/start the conversation/i)
  })

  test('an attempt is recorded from the store and survives reload, but is not counted as a pass', async ({ page }) => {
    await openStudy(page)
    // The store — not a fixture — drives the rail, so a real attempt persists and
    // appears after reload (the original defect: the rail read a fixture and
    // finished work never appeared). But an attempt is NOT a pass: completion may
    // move only on a real grade (R-016).
    await editor(page).fill('Absolute water is purifying.')
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /^submit$/i }).click()
    await page.waitForTimeout(1200)

    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)

    const record = await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('arapal.v1.state'))
      return Object.values(s.studyRecords)[0]
    })
    expect(record?.submissionState, 'the attempt persists across reload from the store').toBe('attempted')

    const marked = await page.evaluate(() => {
      const row = [...document.querySelectorAll('.study-v2__segmentRow')]
        .find((r) => /First segment/.test(r.textContent))
      return String(row?.querySelector('.study-v2__segmentState')?.className ?? '')
    })
    expect(marked, 'an ungraded attempt must not be shown as a pass').not.toMatch(/is-submitted/)

    const progress = await page.evaluate(() => {
      const el = document.querySelector('[data-debug-item="study_segment_progress"]')
      return el ? el.innerText.replace(/\s+/g, ' ') : ''
    })
    expect(progress, 'completion must not move on an ungraded attempt').not.toMatch(/1 \/ 2/)
  })

  test('with no project the route still renders its reference content', async ({ page }) => {
    await page.goto('/?chrome=0#v2/studyWorkspace', { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear() })
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2400)
    expect(await body(page), 'the route stays inspectable standalone').toMatch(/Ghusl|Tayammum|Purity/)
  })
})
