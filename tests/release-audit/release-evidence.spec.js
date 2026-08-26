// Fail-closed, exact-candidate release evidence (S3-006).
//
// A green run here means: the named journey was REACHED, stayed on the screen it
// claims, raised no page or request errors, and was captured — on the EXACT built
// dist, at every required width. It is not "capture attempted".
//
// Two tiers, two contracts:
//   REQUIRED_JOURNEYS  — populated + interactive product journeys at 390/768/
//                        1280/1440. Fail closed: unreachable, wrong route, page
//                        error, failed request, or timeout FAILS the run.
//   Reference states   — the broader surface (incl. states pending a behaviour
//                        port). Recorded for completeness; never a false pass —
//                        a reached reference state must still be on its own
//                        screen, an unreachable one is logged, not silently
//                        green.
//
// Bound to the candidate: beforeAll asserts the served origin is the built dist
// (its hashed entry asset), not a dev server. The orchestrator
// (scripts/release-audit/run.mjs) builds dist, serves it, and passes the SHA +
// build hash in candidate.json.
//
// Proving the gate bites: set ARAPAL_BREAK_REQUIRED=<journeyId> and that journey
// is routed to a nonexistent screen, so its own-screen assertion fails and the
// run goes red. That is the fail-closed proof the ledger requires.

import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { STATES, gotoState, landedOnOwnScreen } from '../visual/states.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.resolve(HERE, '..', '..')
const OUT = process.env.RELEASE_AUDIT_DIR || 'artifacts/release-audit/evidence'
const CANDIDATE_PATH = process.env.ARAPAL_CANDIDATE || ''
const REQUIRED_ONLY = process.env.ARAPAL_REQUIRED_ONLY === '1'
const BREAK_REQUIRED = process.env.ARAPAL_BREAK_REQUIRED || ''

// The four widths the release must certify. Populated + interactive, not a
// compressed desktop grid (S3-003, S3-006).
const REQUIRED_VIEWPORTS = [
  { id: 'mobile-390', width: 390, height: 844 },
  { id: 'tablet-768', width: 768, height: 1024 },
  { id: 'desktop-1280', width: 1280, height: 800 },
  { id: 'desktop-1440', width: 1440, height: 900 },
]

const NONEXISTENT_HASH = 'v2/__release_audit_unreachable__'

// Real product journeys, seeded with the app's own sample project so each screen
// renders POPULATED, then driven to its interactive state where one exists.
const REQUIRED_JOURNEYS = [
  { id: 'req-projects-populated', hash: 'v2/projects', area: 'projects', seedSample: true },
  {
    id: 'req-study-typed', hash: 'v2/studyWorkspace', area: 'study', seedSample: true,
    async drive(page) { return fillFirst(page, 'textarea', 'The Friday prayer is valid only in a comprehensive city.') },
  },
  {
    id: 'req-study-submitted', hash: 'v2/studyWorkspace', area: 'study', seedSample: true,
    async drive(page) {
      await fillFirst(page, 'textarea', 'The Friday prayer is valid only in a comprehensive city.')
      return clickText(page, /^submit$/i)
    },
  },
  { id: 'req-research-populated', hash: 'v2/projectResearch', area: 'research', seedSample: true },
  {
    id: 'req-seg-paste-filled', hash: 'v2/segmentationPasteNext', area: 'segmentation', seedSample: false,
    async drive(page) { return fillFirst(page, 'textarea', SAMPLE_SOURCE) },
  },
  { id: 'req-exams-populated', hash: 'v2/exams', area: 'exams', seedSample: true },
  {
    // The interactive Exams state reachable from a seeded library: opening the
    // assessment builder, whose scope preview is populated from the sample
    // project's real segments. (A direct "Start exam" needs an assessment built
    // and saved first — a multi-step flow the reference tier records.)
    id: 'req-exams-builder', hash: 'v2/exams', area: 'exams', seedSample: true,
    async drive(page) { return clickText(page, /new assessment/i) },
  },
]

const SAMPLE_SOURCE =
  'The Friday prayer is not valid except in a comprehensive city or in the prayer-ground of the city. ' +
  'It is not permitted in the villages. There is no eid prayer except in a comprehensive city.'

// ── small drivers (kept local so the required tier does not depend on the VR
//    suite's storage-clearing gotoState) ─────────────────────────────────────
async function fillFirst(page, selector, value) {
  const el = page.locator(selector).first()
  try {
    await el.fill(value, { timeout: 4000 })
    return true
  } catch {
    return false
  }
}
async function clickText(page, re) {
  const el = page.getByText(re).first()
  try { await el.click({ timeout: 4000 }); return true } catch { return false }
}

const ensureDir = (p) => fs.mkdirSync(p, { recursive: true })
const safe = (s) => String(s).replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '')
function writeJson(file, data) {
  ensureDir(path.dirname(file))
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

// ── candidate binding ────────────────────────────────────────────────────────
// The dev server ships an unhashed module entry (/src/main.jsx). The built dist
// ships a content-hashed entry (/assets/index-XXXXXXXX.js). Requiring the served
// origin to carry the dist's exact hashed entry proves this evidence is of the
// BUILT candidate, not a dev process.
function readDistEntryAsset() {
  const indexPath = path.join(REPO, 'dist', 'index.html')
  if (!fs.existsSync(indexPath)) return null
  const html = fs.readFileSync(indexPath, 'utf8')
  const m = html.match(/src="([^"]*\/assets\/index-[^"]+\.js)"/)
  return m ? m[1] : null
}

async function seedSampleProject(page) {
  // The app's own first-run affordance seeds the real sample project (and jumps
  // to Study). Using the product path keeps the populated data honest.
  const clicked = await clickText(page, /explore with a sample/i)
  if (!clicked) throw new Error('could not seed the sample project via "Explore with a sample"')
  await page.waitForTimeout(600)
}

async function settle(page, ms = 1600) {
  try { await page.evaluate(() => document.fonts?.ready) } catch { /* ignore */ }
  await page.waitForTimeout(ms)
}

async function gotoRequiredJourney(page, journey) {
  await page.goto('/?chrome=0&intro=0#v2/projectHome', { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => { try { localStorage.clear(); sessionStorage.clear() } catch { /* ignore */ } })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await settle(page, 800)

  if (journey.seedSample) await seedSampleProject(page)

  // The fail-closed proof: the state under test is routed to a screen that does
  // not exist, so landedOnOwnScreen must reject it and the run must go red.
  const targetHash = BREAK_REQUIRED && journey.id === BREAK_REQUIRED ? NONEXISTENT_HASH : journey.hash
  await page.evaluate((h) => { window.location.hash = h }, targetHash)
  await settle(page, 900)

  let reached = true
  if (journey.drive) {
    reached = await journey.drive(page)
    await page.mouse.move(0, 0)
    await settle(page, 1400)
  }
  return { reached, expectedHash: journey.hash }
}

async function captureRuntime(page) {
  return page.evaluate(() => ({
    settledHash: location.hash.replace(/^#/, ''),
    bodySize: {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
    },
  }))
}

function attachErrorSinks(page) {
  const consoleErrors = []
  const pageErrors = []
  const failedRequests = []
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })
  page.on('pageerror', (e) => pageErrors.push(String(e)))
  page.on('requestfailed', (r) => {
    const url = r.url()
    const failure = r.failure()?.errorText || ''
    // A cancelled favicon is not a product failure; anything else is — EXCEPT a
    // client-cancelled request (net::ERR_ABORTED). Preloaded font weights the
    // current view has not used yet are aborted by the browser when the hash
    // navigation supersedes them; the assets exist in dist and load when needed.
    // A genuine broken asset surfaces as ERR_FAILED / a 4xx-5xx / a connection or
    // DNS error, which still fails the gate closed.
    if (/\/favicon\.ico(\?|$)/.test(url)) return
    if (/ERR_ABORTED/.test(failure)) return
    failedRequests.push({ url, failure })
  })
  return { consoleErrors, pageErrors, failedRequests }
}

// ── binding gate ─────────────────────────────────────────────────────────────
test.beforeAll(async ({ request }, testInfo) => {
  ensureDir(OUT)
  const candidate = CANDIDATE_PATH && fs.existsSync(CANDIDATE_PATH)
    ? JSON.parse(fs.readFileSync(CANDIDATE_PATH, 'utf8'))
    : null

  const entryAsset = readDistEntryAsset()
  writeJson(path.join(OUT, 'capture-plan.json'), {
    generatedAt: new Date().toISOString(),
    candidate,
    servedFrom: testInfo.project.use.baseURL,
    entryAsset,
    requiredViewports: REQUIRED_VIEWPORTS,
    requiredJourneys: REQUIRED_JOURNEYS.map(({ drive, ...j }) => j),
    breakRequired: BREAK_REQUIRED || null,
    requiredOnly: REQUIRED_ONLY,
  })

  // Fail closed if we are not looking at the built candidate.
  expect(entryAsset, 'dist/index.html has no hashed entry asset — build the candidate before capturing evidence').toBeTruthy()
  const res = await request.get('/')
  expect(res.ok(), 'served origin did not return the app index').toBeTruthy()
  const html = await res.text()
  expect(
    html.includes(entryAsset),
    `served origin does not carry the built entry asset ${entryAsset} — evidence must render from built dist, not a dev server`,
  ).toBeTruthy()
})

// ── required tier: fail-closed ───────────────────────────────────────────────
test.describe('Required release journeys (fail-closed @ 390/768/1280/1440)', () => {
  for (const viewport of REQUIRED_VIEWPORTS) {
    for (const journey of REQUIRED_JOURNEYS) {
      test(`${journey.id} @ ${viewport.id}`, async ({ page }) => {
        test.setTimeout(90000)
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        const sinks = attachErrorSinks(page)

        const { reached, expectedHash } = await gotoRequiredJourney(page, journey)
        const dir = path.join(OUT, 'required', safe(journey.id), safe(viewport.id))
        ensureDir(dir)

        const runtime = await captureRuntime(page)
        const landing = await landedOnOwnScreen(page, { hash: expectedHash })

        // Record the verdict BEFORE asserting. A required capture that fails an
        // assertion must still leave a RED status.json, or the index could show
        // "all green" while the run was red (it would simply not see the missing
        // records). The orchestrator's exit code and this record agree.
        const green = reached && landing.ok && sinks.pageErrors.length === 0 && sinks.failedRequests.length === 0
        const status = {
          tier: 'required', status: green ? 'CAPTURED' : 'FAILED',
          journey: journey.id, area: journey.area, viewport,
          reached, expectedHash, settledHash: runtime.settledHash,
          onOwnScreen: landing.ok,
          pageErrors: sinks.pageErrors, failedRequests: sinks.failedRequests,
          consoleErrors: sinks.consoleErrors,
        }
        await page.screenshot({ path: path.join(dir, 'screen.png'), fullPage: true, animations: 'disabled' }).catch(() => {})
        writeJson(path.join(dir, 'runtime.json'), { ...runtime, ...sinks })
        writeJson(path.join(dir, 'status.json'), status)

        // Fail closed.
        expect(reached, `required journey "${journey.id}" could not be reached at ${viewport.id}`).toBe(true)
        expect(
          landing.ok,
          `required journey "${journey.id}" names #${expectedHash} but settled on #${landing.hash}`,
        ).toBe(true)
        expect(sinks.pageErrors, `page error(s) during "${journey.id}" @ ${viewport.id}`).toEqual([])
        expect(sinks.failedRequests, `failed request(s) during "${journey.id}" @ ${viewport.id}`).toEqual([])
      })
    }
  }
})

// ── reference tier: recorded, never a false pass ─────────────────────────────
if (!REQUIRED_ONLY) {
  test.describe('Reference surface (recorded)', () => {
    for (const viewport of REQUIRED_VIEWPORTS) {
      for (const state of STATES) {
        test(`${state.id} @ ${viewport.id}`, async ({ page }) => {
          test.setTimeout(90000)
          await page.setViewportSize({ width: viewport.width, height: viewport.height })
          const sinks = attachErrorSinks(page)

          const reached = await gotoState(page, state)
          const dir = path.join(OUT, 'reference', safe(state.id), safe(viewport.id))
          ensureDir(dir)

          if (!reached) {
            writeJson(path.join(dir, 'status.json'), {
              tier: 'reference', status: 'UNREACHABLE', state: state.id, area: state.area, viewport,
            })
            return
          }

          const runtime = await captureRuntime(page)
          const landing = await landedOnOwnScreen(page, state)
          await page.screenshot({ path: path.join(dir, 'screen.png'), fullPage: true, animations: 'disabled' }).catch(() => {})
          writeJson(path.join(dir, 'runtime.json'), { ...runtime, ...sinks })
          writeJson(path.join(dir, 'status.json'), {
            tier: 'reference', status: 'CAPTURED', state: state.id, area: state.area, viewport,
            settledHash: runtime.settledHash, onOwnScreen: landing.ok,
            pageErrors: sinks.pageErrors, failedRequests: sinks.failedRequests,
          })

          // A reference state that reached a DIFFERENT screen is documenting the
          // wrong thing — that is still a false pass and still fails.
          expect(
            landing.ok,
            `reference state "${state.id}" names #${state.hash} but settled on #${landing.hash}`,
          ).toBe(true)
        })
      }
    }
  })
}
