import { defineConfig } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

// Playwright's pinned browser build is not always downloadable in this
// environment; fall back to whatever chromium headless shell is installed.
function localChromium() {
  if (process.env.QA_CHROMIUM) return process.env.QA_CHROMIUM
  const root = path.join(process.env.HOME ?? '', 'Library/Caches/ms-playwright')
  try {
    const shells = fs.readdirSync(root).filter((e) => e.startsWith('chromium_headless_shell-')).sort().reverse()
    for (const shell of shells) {
      const p = path.join(root, shell, 'chrome-headless-shell-mac-arm64', 'chrome-headless-shell')
      if (fs.existsSync(p)) return p
    }
  } catch { /* let playwright resolve */ }
  return undefined
}

export default defineConfig({
  testDir: './tests',
  timeout: 90000,
  expect: {
    // Pixel tolerance is deliberately tight. Noisy diffs are solved by
    // stabilising the input (animation, fixtures, masks), never by widening
    // this until regressions stop being visible.
    //
    // maxDiffPixelRatio is measured, not chosen. With fonts self-hosted, motion
    // frozen and layout settled, real run-to-run noise on the product states is
    // 399-753 pixels, so 0.0008 sits just above the observed ceiling. That is
    // 2.5x tighter than the 0.002 it replaces, which allowed 2,592 pixels — a
    // 51x51 block, a whole icon button.
    //
    // Proven rather than asserted: a 40x40 solid block injected into the Study
    // header produces 1,856 differing pixels. It fails here and would have passed
    // at 0.002.
    //
    // `threshold`, the per-PIXEL colour sensitivity, is left at its default on
    // purpose. Tightening it to 0.1 raises the counted noise on untouched states
    // to 900-1,900 pixels, which swamps the signal this ratio is tuned to catch;
    // there is no setting that separates them, so a tighter threshold would only
    // make the gate flap. The residual risk is therefore recorded rather than
    // tuned away: a LOW-CONTRAST change — pale decoration on a near-white
    // surface — may not register as different at any pixel count. Structural
    // changes are covered by `npm run qa`, which measures elements, not pixels.
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.0008,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? 'list' : [['list']],
  use: {
    // Release evidence renders against the BUILT dist served by the orchestrator
    // (scripts/release-audit/run.mjs), which sets ARAPAL_BASE_URL to its preview
    // origin. The dev VR/behaviour loops keep the default dev server.
    baseURL: process.env.ARAPAL_BASE_URL || 'http://localhost:5173',
    trace: 'off',
    screenshot: 'off',
    launchOptions: {
      executablePath: localChromium(),
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  },
  snapshotPathTemplate: '{testDir}/visual/__golden__/{arg}{ext}',
})
