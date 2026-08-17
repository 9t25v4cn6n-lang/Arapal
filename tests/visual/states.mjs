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
 * Typefaces are requested from Google Fonts at runtime. `document.fonts.ready`
 * alone is not enough: it resolves for the faces in use at that moment, and an
 * interaction can introduce a new weight (an active card, a selected row) whose
 * request starts afterwards. Capturing then renders that text in a fallback
 * face and reads as a whole-page diff.
 *
 * So we poll until the font set has been idle for two consecutive checks rather
 * than trusting a single promise — and we fix the cause instead of widening the
 * pixel tolerance until the noise disappears.
 */
const settle = async (page, ms = 2400) => {
  await page.waitForTimeout(ms)
  await page.evaluate(async () => {
    const idle = async () => {
      await document.fonts?.ready
      return document.fonts?.status === 'loaded'
    }
    for (let attempt = 0; attempt < 20; attempt += 1) {
      if (await idle() && await idle()) return
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }).catch(() => {})

  // Wait for the layout itself to stop moving, not just for a timer to expire.
  // Interactions start transitions that finish at their own pace, and a fixed
  // delay was the reason only *driven* states flapped while every static route
  // stayed rock solid. Sample the geometry until two consecutive reads agree.
  await page.evaluate(async () => {
    const fingerprint = () => {
      const nodes = document.querySelectorAll('body *')
      let acc = `${document.body.scrollHeight}:${nodes.length}`
      for (let i = 0; i < nodes.length; i += Math.max(1, Math.floor(nodes.length / 40))) {
        const r = nodes[i].getBoundingClientRect()
        acc += `|${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.width)},${Math.round(r.height)}`
      }
      return acc
    }
    let previous = fingerprint()
    for (let attempt = 0; attempt < 30; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 120))
      const next = fingerprint()
      if (next === previous) return
      previous = next
    }
  }).catch(() => {})
  await page.waitForTimeout(150)
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

/**
 * Click a control by its ACCESSIBLE NAME rather than its visible text.
 *
 * Needed because the two differ, and matching the wrong one produces a silent
 * false negative rather than a failure. study-discussion was recorded unreachable
 * for exactly that reason: the Study Companion toggle is labelled "Discuss this
 * segment" for assistive technology and renders the word "Discuss", so a
 * visible-text matcher never found it and the suite concluded the state did not
 * exist. It does, it always did, and the state went uncovered while the project
 * carried it as a parity gap.
 */
async function clickControl(page, pattern, timeout = 4000) {
  const el = page.getByRole('button', { name: pattern }).first()
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
  // The V2 home in both its states. Storage is cleared per state, so the
  // default capture is genuinely the first-run empty state.
  { id: 'v2-home-empty', hash: 'v2/projectHome', area: 'home' },
  {
    id: 'v2-home-returning',
    hash: 'v2/projectHome',
    area: 'home',
    // "Explore with a sample" seeds the sample AND navigates to Study — that is
    // the button's job. So this state, named for the returning Project Home,
    // was capturing the Study Workspace. It had no pixel golden to give it away
    // (driven states are reachability-only), and nothing else asked which screen
    // it had actually reached. Seed, then come back to the screen it names.
    async drive(page) {
      const seeded = await clickText(page, /explore with a sample/i)
      if (!seeded) return false
      await page.evaluate(() => { window.location.hash = 'v2/projectHome' })
      return true
    },
  },
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
    // Was recorded unreachable against a class selector — [class*=splitButton] —
    // that matches nothing, because the control is inline-styled and carries no
    // className at all. It has always been there, named "Open action options".
    // Two of this suite's recorded parity gaps were this same mistake: a driver
    // looking for the wrong handle, reported as a missing product capability.
    async drive(page) {
      await fillFirst(page, 'textarea', SAMPLE_SOURCE)
      return clickControl(page, /open action options/i)
    },
  },
  // seg-processing and seg-loading are the two screens that advance on their own
  // — loading after 1200ms, the transition after 2200ms — and gotoState settles
  // for 2400ms before capturing. So the golden checked in under the name
  // "seg-processing" was a picture of the Success screen: a duplicate of
  // seg-success under the wrong name, while the transition screen it claimed to
  // cover had no coverage at all. Nobody noticed, because a wrong-but-stable
  // golden passes forever.
  //
  // Both are held to reachability only, with the pause flag so they at least stay
  // on the screen they name. Pixels are the wrong instrument here: every element
  // on both screens carries an infinite animation — a spinning seal, flying
  // chips, a pulsing bridge — so a pixel golden would either flap or need every
  // moving part masked, which is a golden of the gaps between the content.
  // Geometry is covered by `npm run qa`, which freezes motion and now asserts it
  // measured the route it asked for.
  { id: 'seg-processing', hash: 'v2/segmentationTransition', area: 'segmentation', query: 'v2FlowPause=1', reachabilityOnly: true },
  { id: 'seg-loading', hash: 'v2/segmentationLoading', area: 'segmentation', query: 'v2FlowPause=1', reachabilityOnly: true },
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
      return clickControl(page, /discuss this segment/i)
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
  const query = state.query ? `&${state.query}` : ''
  await page.goto(`/?chrome=0${query}#${state.hash}`, { waitUntil: 'domcontentloaded' })
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
    // After a click the pointer stays where it landed, so the element keeps its
    // hover styling and whether that transition has finished varies per run.
    // Park the pointer off-content before settling.
    await page.mouse.move(0, 0)
    // Interactions start transitions (the discussion panel alone is 220ms, the
    // rails animate, panels re-layout). Settling too early was the main source
    // of a different handful of states failing on each run.
    await settle(page, 2000)
    return reached
  }
  return true
}

/**
 * Did the page stay on the screen the state names?
 *
 * A state that navigates away captures a different screen under this state's
 * name, and the golden then passes forever while covering nothing it claims to.
 * That is exactly what happened to seg-processing. Cheap to check, so checked.
 */
export async function landedOnOwnScreen(page, state) {
  const hash = (await page.evaluate(() => location.hash)).replace(/^#/, '')
  return { ok: hash === state.hash, hash }
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
    // Progress indicators advance on their own; their value is not a product
    // change. Kept narrow and role-based: matching on class substrings hit a
    // varying number of elements per run and made the suite less stable, not
    // more.
    page.locator('[role="progressbar"]'),
    page.locator('text=/Reviewed: /i'),
  ]
}
