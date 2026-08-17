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
    toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: 'disabled', caret: 'hide' },
  },
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? 'list' : [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'off',
    screenshot: 'off',
    launchOptions: {
      executablePath: localChromium(),
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  },
  snapshotPathTemplate: '{testDir}/visual/__golden__/{arg}{ext}',
})
