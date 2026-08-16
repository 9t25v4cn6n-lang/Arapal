// Canonical product states for visual regression.
//
// A state is a route plus, where needed, the interaction that reaches it.
// Drivers must be tolerant: if a state cannot be reached the runner records it
// as UNREACHABLE rather than failing, because "this state does not exist yet"
// is itself Phase 1 evidence.
//
// Widths are chosen to expose real layout contracts, not to enumerate
// breakpoints: the build frame, the narrow desktop where the shell is tightest,
// and the wide frame where centring and max-widths show up.

export const WIDTHS = [
  { id: 'w1440', width: 1440, height: 900 },
  { id: 'w1280', width: 1280, height: 800 },
]

/**
 * Wait for the page to be genuinely still before capturing.
 *
 * Typefaces are requested from Google Fonts at runtime, so a screenshot taken
 * before they resolve renders in a fallback face and reads as a large diff.
 * That produced a suite where a different handful of states failed on each run
 * — flakiness that would have got the suite ignored. Waiting on document.fonts
 * removes the cause rather than hiding it behind a wider pixel tolerance.
 */
const settle = async (page, ms = 2400) => {
  await page.waitForTimeout(ms)
  await page.evaluate(() => document.fonts?.ready).catch(() => {})
  await page.waitForTimeout(250)
}

/** Click the first visible element whose text matches, return whether it worked. */
async function clickText(page, pattern, timeout = 4000) {
  const el = page.getByText(pattern).first()
  try {
    await el.waitFor({ state: 'visible', timeout })
    await el.click()
    return true
  } catch {
    return false
  }
}

async function fillFirst(page, selector, value) {
  const el = page.locator(selector).first()
  try {
    await el.waitFor({ state: 'visible', timeout: 4000 })
    await el.fill(value)
    return true
  } catch {
    return false
  }
}

export const STATES = [
  // ── Home / Projects ──────────────────────────────────────────────────────
  { id: 'home-returning', hash: 'home', area: 'home' },
  { id: 'projects-library', hash: 'v2/projects', area: 'projects' },
  {
    id: 'projects-advanced-open',
    hash: 'v2/projects',
    area: 'projects',
    async drive(page) {
      return clickText(page, /show advanced/i)
    },
  },

  // ── Segmentation ─────────────────────────────────────────────────────────
  { id: 'seg-paste-empty', hash: 'v2/segmentationPasteNext', area: 'segmentation' },
  {
    id: 'seg-paste-filled',
    hash: 'v2/segmentationPasteNext',
    area: 'segmentation',
    async drive(page) {
      return fillFirst(page, 'textarea', SAMPLE_SOURCE)
    },
  },
  {
    id: 'seg-options-open',
    hash: 'v2/segmentationPasteNext',
    area: 'segmentation',
    async drive(page) {
      await fillFirst(page, 'textarea', SAMPLE_SOURCE)
      const chevron = page.locator('[class*=splitButton], [class*=SplitButton]').first()
      try { await chevron.click({ timeout: 3000 }); return true } catch { return false }
    },
  },
  { id: 'seg-processing', hash: 'v2/segmentationTransition', area: 'segmentation' },
  { id: 'seg-loading', hash: 'v2/segmentationLoading', area: 'segmentation' },
  { id: 'seg-review', hash: 'v2/segmentationReview', area: 'segmentation' },
  {
    id: 'seg-review-active-edit',
    hash: 'v2/segmentationReview',
    area: 'segmentation',
    async drive(page) {
      const card = page.locator('article').first()
      try { await card.click({ timeout: 3000 }); return true } catch { return false }
    },
  },
  { id: 'seg-success', hash: 'v2/segmentationSuccess', area: 'segmentation' },

  // ── Study ────────────────────────────────────────────────────────────────
  { id: 'study-draft', hash: 'v2/studyWorkspace', area: 'study' },
  {
    id: 'study-draft-typed',
    hash: 'v2/studyWorkspace',
    area: 'study',
    async drive(page) {
      return fillFirst(page, 'textarea', 'The Friday prayer is valid only in a comprehensive city.')
    },
  },
  {
    id: 'study-submitted',
    hash: 'v2/studyWorkspace',
    area: 'study',
    async drive(page) {
      await fillFirst(page, 'textarea', 'The Friday prayer is valid only in a comprehensive city.')
      return clickText(page, /^submit$/i)
    },
  },
  {
    id: 'study-discussion',
    hash: 'v2/studyWorkspace',
    area: 'study',
    async drive(page) {
      return clickText(page, /discuss this segment/i)
    },
  },
  {
    id: 'study-support-collapsed',
    hash: 'v2/studyWorkspace',
    area: 'study',
    async drive(page) {
      const toggle = page.getByLabel(/collapse support/i).first()
      try { await toggle.click({ timeout: 3000 }); return true } catch { return false }
    },
  },
  { id: 'study-focus', hash: 'v2/studyWorkspace', area: 'study',
    async drive(page) { return clickText(page, /focus view/i) } },

  // ── Research ─────────────────────────────────────────────────────────────
  { id: 'research-browse', hash: 'v2/projectResearch', area: 'research' },
  {
    id: 'research-selected',
    hash: 'v2/projectResearch',
    area: 'research',
    async drive(page) {
      const row = page.locator('.project-research__resultRow').nth(2)
      try { await row.click({ timeout: 4000 }); return true } catch { return false }
    },
  },
  {
    id: 'research-no-results',
    hash: 'v2/projectResearch',
    area: 'research',
    async drive(page) {
      return fillFirst(page, 'input', 'zzqqxxnomatch')
    },
  },

  // ── Exams (legacy — the only working exam flow) ───────────────────────────
  { id: 'exams-library', hash: 'exams', area: 'exams' },
  {
    id: 'exams-builder',
    hash: 'exams',
    area: 'exams',
    async drive(page) { return clickText(page, /create exam/i) },
  },
  {
    id: 'exams-attempt',
    hash: 'exams',
    area: 'exams',
    async drive(page) { return clickText(page, /open exam/i) },
  },
  {
    id: 'exams-results',
    hash: 'exams',
    area: 'exams',
    async drive(page) { return clickText(page, /review results/i) },
  },

  // ── Legacy screens retained for behaviour, still part of the surface ──────
  { id: 'legacy-study-draft', hash: 'study', area: 'legacy' },
  { id: 'legacy-segmentation-paste', hash: 'segmentation', area: 'legacy' },
]

export const SAMPLE_SOURCE =
  'The Friday prayer is not valid except in a comprehensive city or in the prayer-ground of the city. ' +
  'It is not permitted in the villages. There is no eid prayer except in a comprehensive city.'

/**
 * Navigate to a state and settle it. Returns false when the driver could not
 * reach the state, which the caller records rather than treating as a failure.
 */
export async function gotoState(page, state) {
  await page.goto(`/?chrome=0#${state.hash}`, { waitUntil: 'domcontentloaded' })
  // Start every state from empty storage.
  //
  // The suite used to be isolated by accident: nothing persisted, so no state
  // could contaminate the next. Now that drafts, attempts and projects are
  // real, a leftover exam attempt shifted the whole Exams builder by ~30px and
  // read as a visual regression. Isolation has to be explicit.
  await page.evaluate(() => {
    try { localStorage.clear(); sessionStorage.clear() } catch { /* ignore */ }
  })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await settle(page)
  if (state.drive) {
    const reached = await state.drive(page)
    // Interactions start transitions (the discussion panel alone is 220ms, the
    // rails animate, panels re-layout). Settling too early was the main source
    // of a different handful of states failing on each run.
    await settle(page, 2000)
    return reached
  }
  return true
}

/**
 * Regions that legitimately change between runs and would otherwise produce
 * noise. Masked rather than tolerated, so real diffs stay visible.
 */
export function dynamicMasks(page) {
  return [
    page.locator('[data-dynamic]'),
    page.locator('text=/^\\d{2}:\\d{2}$/'),
    page.locator('text=/\\b\\d+ minutes?\\b/i'),
    page.locator('text=/\\b\\d+\\s*(s|sec|secs|seconds)\\b/i'),
    page.locator('text=/\\bElapsed\\b/i'),
    page.locator('text=/\\bJust now\\b/i'),
    page.locator('text=/\\bToday\\b/i'),
    page.locator('text=/Reviewed: /i'),
  ]
}
