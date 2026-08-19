// One-off script to build screenshot-reference/. Not part of the app build.
// Usage: node scripts/capture-reference.mjs [screenName]
import { chromium } from 'playwright'
import path from 'node:path'
import fs from 'node:fs/promises'

const BASE = 'http://localhost:5173'
const OUT = path.join(process.cwd(), 'screenshot-reference')
const VIEWPORT = { width: 1440, height: 900 }

const only = process.argv[2]

async function shot(page, dir, name) {
  const target = path.join(OUT, dir)
  await fs.mkdir(target, { recursive: true })
  const filePath = path.join(target, `${name}.png`)
  await page.screenshot({ path: filePath })
  console.log('saved', path.relative(OUT, filePath))
}

async function gotoRoute(page, hash, extraQuery = '') {
  await page.goto(`${BASE}/?chrome=0${extraQuery}#${hash}`, { waitUntil: 'networkidle' })
}

const scenarios = {
  async home(page) {
    // Intro splash — reload without intro=0 to see it
    await gotoRoute(page, 'home')
    await page.waitForTimeout(400)
    await shot(page, '01-home', '01-intro-splash')

    await page.waitForTimeout(2200) // let intro finish
    await shot(page, '01-home', '02-resting-deck')

    // Hover state on a card
    const card = page.locator('.project-home__card').first()
    await card.hover()
    await page.waitForTimeout(300)
    await shot(page, '01-home', '03-card-hover')
  },

  async study(page) {
    const dir = '02-study'
    await gotoRoute(page, 'study')
    await page.waitForTimeout(500)
    await shot(page, dir, '01-draft-default')

    // Far-left nav rail: pinned-open state
    await page.getByLabel('Expand navigation rail').click()
    await page.waitForTimeout(250)
    await shot(page, dir, '02-nav-rail-expanded')
    await page.getByLabel('Collapse navigation rail').click()
    await page.waitForTimeout(250)

    // Segment tree collapse
    await page.getByLabel('Collapse segments').click()
    await page.waitForTimeout(250)
    await shot(page, dir, '03-segment-tree-collapsed')
    await page.getByLabel('Expand segments').click()
    await page.waitForTimeout(250)

    // Support rail collapsed to icons
    await page.getByLabel('Collapse support panels').click()
    await page.waitForTimeout(250)
    await shot(page, dir, '04-support-rail-collapsed')

    // Hover-preview flyout from the collapsed rail
    await page.locator('.fg-right__railIcon').first().hover()
    await page.waitForTimeout(300)
    await shot(page, dir, '05-support-rail-hover-preview')

    // Re-expand, then open a support card as a full modal
    await page.mouse.move(600, 400)
    await page.getByLabel('Expand support panels').click()
    await page.waitForTimeout(250)
    await page.locator('.fg-right__expand').first().click()
    await page.waitForTimeout(250)
    await shot(page, dir, '06-support-card-expanded-modal')
    await page.locator('.fg-right__close').first().click()
    await page.waitForTimeout(200)

    // Discuss panel — docked
    await page.getByText('Discuss This Segment').first().click()
    await page.waitForTimeout(300)
    await shot(page, dir, '07-discuss-docked')

    // Discuss panel — floating
    await page.getByText('Float', { exact: true }).click()
    await page.waitForTimeout(300)
    await shot(page, dir, '08-discuss-floating')
    await page.getByLabel('Close discussion').click()
    await page.waitForTimeout(200)

    // Submit — this segment (1.3 Ghusl) is scripted to fail on first try
    await page.locator('.fg-center__editorShell .fg-center__primaryButton').click()
    await page.waitForTimeout(400)
    await shot(page, dir, '09-submit-failed')

    // Submit again — passes on second try
    await page.locator('.fg-center__editorShell .fg-center__primaryButton').click()
    await page.waitForTimeout(400)
    await shot(page, dir, '10-submit-passed')
  },

  async segmentation(page) {
    const dir = '03-segmentation'
    const sampleText =
      'This is a sample source passage about the conditions of prayer, used to demonstrate the AraPal segmentation workspace end to end. It spans a few sentences so the AI split has more than one segment to propose.'

    await gotoRoute(page, 'segmentation')
    await page.waitForTimeout(400)
    await shot(page, dir, '01-paste-empty')

    await page.locator('.make-seg__editorTextarea').fill(sampleText)
    await page.waitForTimeout(200)
    await shot(page, dir, '02-paste-with-text')

    // Options menu: method, style, granularity, quick-mode + animation toggles
    await page.locator('.make-seg__splitButton').click()
    await page.waitForTimeout(200)
    await shot(page, dir, '03-options-menu-open')

    // Turn quick mode OFF so this run stops at the Review step instead of skipping to Success
    await page.getByText('Quick mode').click()
    await page.locator('.make-seg__splitButton').click() // close menu
    await page.waitForTimeout(150)

    // Kick off the AI pass — compiling, then segmenting transition screens
    await page.locator('.make-seg__primaryButton.is-segmentation').click()
    await page.waitForTimeout(300)
    await shot(page, dir, '04-compiling')

    await page.waitForTimeout(1200)
    await shot(page, dir, '05-segmenting-transition')

    // Lands on Review (quick mode is off)
    await page.waitForTimeout(2400)
    await shot(page, dir, '06-review-segments')

    // Expand the source preview panel within Review
    await page.getByText('Expand source').click()
    await page.waitForTimeout(200)
    await shot(page, dir, '07-review-source-expanded')
    await page.getByText('Peek source').click()
    await page.waitForTimeout(150)

    // Approve and continue -> Success screen
    await page.getByText('Approve & continue').click()
    await page.waitForTimeout(400)
    await shot(page, dir, '08-success')

    // Second pass: default preferences (quick mode ON) skip Review entirely
    await page.evaluate(() => window.localStorage.clear())
    await gotoRoute(page, 'segmentation', '&run=2')
    await page.waitForTimeout(600)
    await page.locator('.make-seg__editorTextarea').fill(sampleText)
    await page.locator('.make-seg__primaryButton.is-segmentation').click()
    await page.waitForTimeout(1200 + 2200 + 400)
    await shot(page, dir, '09-quickmode-skips-to-success')
  },

  async exams(page) {
    const dir = '04-exams'
    await gotoRoute(page, 'exams')
    await page.waitForTimeout(500)
    await shot(page, dir, '01-list')

    await page.getByText('Create exam').first().click()
    await page.waitForTimeout(300)
    await shot(page, dir, '02-generate-scope')

    await page.getByText('Tracker range').click()
    await page.waitForTimeout(200)
    await shot(page, dir, '03-generate-range-mode')

    await page.getByText('Back to exams').click()
    await page.waitForTimeout(200)

    // Open an existing ready exam to take it
    await page.getByText('Open exam').first().click()
    await page.waitForTimeout(300)
    await shot(page, dir, '04-take-question')

    await page.getByText('Back to exam list').click()
    await page.waitForTimeout(200)

    // Review results on a completed exam
    const reviewButton = page.getByText('Review results').first()
    if (await reviewButton.count()) {
      await reviewButton.click()
      await page.waitForTimeout(300)
      await shot(page, dir, '05-results-review')
    }
  },

  async projects(page) {
    const dir = '05-projects'
    await gotoRoute(page, 'projects')
    await page.waitForTimeout(500)
    await shot(page, dir, '01-resting')

    await page.locator('.projects-screen__filter', { hasText: 'Ready to continue' }).click()
    await page.waitForTimeout(200)
    await shot(page, dir, '02-filter-ready-to-continue')

    await page.locator('.projects-screen__filter', { hasText: 'Needs setup' }).click()
    await page.waitForTimeout(200)
    await shot(page, dir, '03-filter-needs-setup')
  },
}

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setViewportSize(VIEWPORT)

const names = only ? [only] : Object.keys(scenarios)
for (const name of names) {
  if (!scenarios[name]) {
    console.error('unknown scenario', name)
    continue
  }
  console.log('--- capturing', name, '---')
  await scenarios[name](page)
}

await browser.close()
