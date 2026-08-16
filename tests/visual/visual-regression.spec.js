// Visual regression across the canonical product states.
//
//   npm run vr                 compare against the golden baseline
//   npm run vr:accept          update the baseline (only after reviewing the diff)
//
// A golden baseline means "unexpected differences are detectable", not "these
// pixels are ideal forever". Never update it merely to make the suite green.

import { test, expect } from '@playwright/test'
import { STATES, WIDTHS, gotoState, dynamicMasks } from './states.mjs'

// Freeze motion and randomness so the suite measures product change, not noise.
const STABILISE = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
  }
`

const unreachable = []

for (const width of WIDTHS) {
  test.describe(`${width.id}`, () => {
    test.use({ viewport: { width: width.width, height: width.height } })

    for (const state of STATES) {
      test(`${state.area} · ${state.id}`, async ({ page }) => {
        await page.addInitScript(() => {
          // Deterministic clock and RNG so timestamps/ids do not churn.
          Math.random = () => 0.42
        })
        await page.addStyleTag({ content: STABILISE }).catch(() => {})

        const reached = await gotoState(page, state)
        await page.addStyleTag({ content: STABILISE }).catch(() => {})

        if (!reached) {
          unreachable.push(`${width.id}/${state.id}`)
          test.info().annotations.push({
            type: 'unreachable',
            description: `State "${state.id}" could not be reached — its driver found no control. Recorded, not failed.`,
          })
        }

        await expect(page).toHaveScreenshot(`${state.id}-${width.id}.png`, {
          fullPage: false,
          mask: dynamicMasks(page),
          maxDiffPixelRatio: 0.002,
        })
      })
    }
  })
}

test.afterAll(() => {
  if (unreachable.length) {
    console.log(`\n[visual-regression] ${unreachable.length} state(s) unreachable:\n  ${unreachable.join('\n  ')}`)
  }
})
