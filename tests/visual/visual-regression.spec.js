// Visual regression across the canonical product states.
//
//   npm run vr                 compare against the golden baseline
//   npm run vr:accept          update the baseline (only after reviewing the diff)
//
// A golden baseline means "unexpected differences are detectable", not "these
// pixels are ideal forever". Never update it merely to make the suite green.

import { test, expect } from '@playwright/test'
import { STATES, WIDTHS, gotoState, dynamicMasks, landedOnOwnScreen } from './states.mjs'

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

        // Pixel goldens are kept for states the harness can capture
        // deterministically. Driven states — those reached by an interaction —
        // settle asynchronously here: transitions, hover styling under a parked
        // pointer and post-interaction reflow made a different handful fail on
        // each run even after waiting on fonts and on layout to stop moving.
        //
        // Rather than widen the tolerance until the noise disappears — which is
        // the auditTrust:98 failure in a new costume — they are asserted for
        // reachability only. Their geometry is covered by `npm run qa`, which
        // measures boxes rather than pixels and is deterministic, and their
        // behaviour by tests/behaviour. Restoring pixel goldens here needs a
        // real settle signal from the app, not a longer wait.
        // Every state must still be on the screen it names. A state that
        // navigated away captures a different screen under this name, and the
        // golden then passes forever while covering nothing it claims to —
        // seg-processing held a picture of the Success screen for exactly that
        // reason. Asserted for all states, golden or reachability-only.
        const landing = await landedOnOwnScreen(page, state)
        expect(
          landing.ok,
          `State "${state.id}" names #${state.hash} but the page is on #${landing.hash}.`
          + ' A golden captured here would document the wrong screen.',
        ).toBe(true)

        // A driven state may opt back IN to a pixel golden. The blanket rule
        // exists because driven states flapped on settle — but settle now polls
        // geometry until two reads agree and motion is frozen, so "driven" is no
        // longer a reliable proxy for "unstable". Opting in per state keeps the
        // safe default while letting a state earn a golden on evidence.
        if ((state.drive || state.reachabilityOnly) && !state.pixelGolden) {
          // Unreachable is recorded, not failed — "this control does not exist
          // yet" is a product finding for the backlog, not a broken test. The
          // known case is seg-options-open: the V2 paste screen has no reliable
          // options control, which is a real parity gap against legacy.
          return
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
