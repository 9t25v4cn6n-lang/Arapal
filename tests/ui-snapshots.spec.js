import fs from 'node:fs/promises'
import path from 'node:path'
import { test } from '@playwright/test'

const screenRoutes = {
  study: '#study',
  home: '#home',
  projects: '#projects',
  exams: '#exams',
  segmentation: '#segmentation',
}

const viewports = [
  { name: 'desktop-compact', width: 1366, height: 768 },
  { name: 'desktop-standard', width: 1440, height: 900 },
  { name: 'desktop-wide', width: 1920, height: 1080 },
]

const selectedScreen = process.env.SCREEN ?? 'all'
const targetScreens =
  selectedScreen === 'all'
    ? Object.entries(screenRoutes)
    : Object.entries(screenRoutes).filter(([name]) => name === selectedScreen)

for (const [screenName, route] of targetScreens) {
  test.describe(screenName, () => {
    for (const viewport of viewports) {
      test(`${screenName} @ ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })

        const targetDir = path.join(process.cwd(), 'artifacts', 'ui-snapshots')
        await fs.mkdir(targetDir, { recursive: true })

        await page.goto(`/?chrome=0${route}`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(screenName === 'home' ? 2600 : 600)

        const filePath = path.join(targetDir, `${screenName}-${viewport.name}.png`)
        await page.screenshot({ path: filePath, fullPage: true })
      })
    }
  })
}
