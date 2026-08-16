#!/usr/bin/env node
// Arapal visual QA runner.
//
//   npm run qa                      all product routes, all frames
//   npm run qa -- --route=legacy-study
//   npm run qa -- --frame=1440x900
//   npm run qa -- --changed=src/screens/FigmaScreen.jsx    (used by the save hook)
//   npm run qa -- --json            machine output only
//
// Exit code 1 if any blocking rule is violated.

import { chromium } from 'playwright'
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { VIEWPORTS, ROUTES, THRESHOLDS, TYPE_RAMP, TEXT_COLOR_POLICY, REQUIRED_FONT_FAMILIES, RULES } from './standard.mjs'
import { evaluate } from './probe.mjs'
import { readBaseline, countByRouteRule, compare, ratchetDown, seedBaseline } from './ratchet.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.resolve(HERE, '../..')
const BASE = process.env.QA_BASE_URL ?? 'http://localhost:5173'
const REPORT = path.join(REPO, 'artifacts', 'qa', 'visual-standard.json')

// Playwright's bundled browser is not always downloadable in this environment;
// fall back to any locally installed chromium build.
async function resolveExecutable() {
  if (process.env.QA_CHROMIUM) return process.env.QA_CHROMIUM
  const cacheRoot = path.join(process.env.HOME ?? '', 'Library/Caches/ms-playwright')
  try {
    const entries = await fs.readdir(cacheRoot)
    const shells = entries.filter((e) => e.startsWith('chromium_headless_shell-')).sort()
    for (const shell of shells.reverse()) {
      const p = path.join(cacheRoot, shell, 'chrome-headless-shell-mac-arm64', 'chrome-headless-shell')
      try { await fs.access(p); return p } catch { /* keep looking */ }
    }
  } catch { /* no cache dir; let playwright resolve */ }
  return undefined
}

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  }),
)

/** Map a changed source file to the routes it can affect. Unknown files check everything. */
function routesForChangedFile(file) {
  const f = file.replace(/\\/g, '/')
  const hits = new Set()
  if (/src\/screens\/FigmaScreen|src\/components\/figma\//.test(f)) hits.add('legacy-study')
  if (/ProjectHomeScreen/.test(f)) hits.add('legacy-home')
  if (/MakeSegmentationFlowScreen/.test(f)) hits.add('legacy-segmentation')
  if (/screens\/ExamsScreen/.test(f)) hits.add('legacy-exams')
  if (/screens\/ProjectsScreen/.test(f)) hits.add('legacy-projects')
  if (/v2\/screens\/([A-Za-z]+)\//.test(f)) {
    const name = f.match(/v2\/screens\/([A-Za-z]+)\//)[1]
    ROUTES.filter((r) => r.hash.toLowerCase().includes(name.replace(/Screen$/, '').toLowerCase())).forEach((r) => hits.add(r.id))
  }
  // Shared foundation touches everything.
  if (/v2\/foundation\//.test(f)) return ROUTES.map((r) => r.id)
  return hits.size ? [...hits] : ROUTES.map((r) => r.id)
}

let routes = ROUTES
if (args.route) routes = ROUTES.filter((r) => r.id === args.route)
if (args.changed) {
  const ids = new Set(String(args.changed).split(',').flatMap(routesForChangedFile))
  routes = ROUTES.filter((r) => ids.has(r.id))
}
let frames = VIEWPORTS
if (args.frame) frames = VIEWPORTS.filter((v) => v.id === args.frame)
if (args.quick) frames = VIEWPORTS.filter((v) => v.tier === 'build')

const config = { THRESHOLDS, TYPE_RAMP, TEXT_COLOR_POLICY, REQUIRED_FONT_FAMILIES }
const probeSource = evaluate.toString()

const results = []
const consoleErrors = []
const blankRoutes = []

/** Below this, the page did not render and its result is meaningless. */
const MIN_RENDERED_ELEMENTS = 20

const browser = await chromium.launch({ executablePath: await resolveExecutable() })
const page = await (await browser.newContext()).newPage()
page.on('pageerror', (e) => consoleErrors.push(String(e).slice(0, 200)))

for (const frame of frames) {
  await page.setViewportSize({ width: frame.width, height: frame.height })
  for (const route of routes) {
    await page.goto(`${BASE}/?chrome=0#${route.hash}`, { waitUntil: 'domcontentloaded' })
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2600) // intro/transition animations settle
    const out = await page.evaluate(
      ([src, cfg]) => new Function('config', `return (${src})(config)`)(cfg),
      [probeSource, config],
    )
    // A page that failed to render has nothing to find, and "nothing to find"
    // must never be reported as "clean". A syntax error in a shared primitive
    // took the whole app down and this runner cheerfully reported 0 violations
    // across 13 routes — the same blindness the old dashboard had.
    if ((out.stats?.elements ?? 0) < MIN_RENDERED_ELEMENTS) {
      blankRoutes.push(`${route.id}@${frame.id} (${out.stats?.elements ?? 0} elements)`)
    }
    for (const f of out.findings) results.push({ route: route.id, app: route.app, frame: frame.id, ...f })
  }
}
await browser.close()

// ── report ───────────────────────────────────────────────────────────────────
const blocking = results.filter((r) => RULES[r.ruleId]?.blocking)
const advisory = results.filter((r) => !RULES[r.ruleId]?.blocking)

const byRule = {}
for (const r of blocking) (byRule[r.ruleId] ??= []).push(r)

const payload = {
  generatedAt: new Date().toISOString(),
  base: BASE,
  routes: routes.map((r) => r.id),
  frames: frames.map((f) => f.id),
  totals: {
    blocking: blocking.length,
    advisory: advisory.length,
    byRule: Object.fromEntries(Object.entries(byRule).map(([k, v]) => [k, v.length])),
    byRoute: Object.fromEntries(
      routes.map((r) => [r.id, blocking.filter((b) => b.route === r.id).length]),
    ),
  },
  findings: results,
  pageErrors: [...new Set(consoleErrors)],
  blankRoutes,
}

await fs.mkdir(path.dirname(REPORT), { recursive: true })
await fs.writeFile(REPORT, JSON.stringify(payload, null, 1))

// Also publish where the Quality Dashboard can read it. That dashboard still
// serves audit lanes last generated in April and reported productQuality 74.6 /
// auditTrust 98 while the checker behind it covered a single screen. Giving it a
// live, dated feed is what stops a stale number being mistaken for the truth.
const PUBLISHED = path.join(REPO, 'public', 'v2-audit', 'visual-standard.json')
await fs.mkdir(path.dirname(PUBLISHED), { recursive: true })
await fs.writeFile(PUBLISHED, JSON.stringify({
  generatedAt: payload.generatedAt,
  routes: payload.routes.length,
  frames: payload.frames.length,
  blocking: payload.totals.blocking,
  byRule: payload.totals.byRule,
  byRoute: payload.totals.byRoute,
  blankRoutes: payload.blankRoutes,
}, null, 1))

// ── ratchet ──────────────────────────────────────────────────────────────────
const blockingRuleIds = new Set(Object.entries(RULES).filter(([, r]) => r.blocking).map(([k]) => k))
const counts = countByRouteRule(results, blockingRuleIds)
const checkedPairs = routes.flatMap((r) => frames.map((f) => `${r.id}::${f.id}`))

let verdict = { regressions: [], improvements: [] }
if (args.accept) {
  await seedBaseline(counts)
  console.log(`Baseline seeded: ${blocking.length} accepted violations across ${routes.length} route(s) x ${frames.length} frame(s).`)
  process.exit(0)
}

const baseline = await readBaseline()
if (baseline.generatedAt) {
  verdict = compare(baseline, counts, checkedPairs)
  if (verdict.improvements.length && !args.json) {
    await ratchetDown(baseline, counts, checkedPairs, verdict.improvements)
  }
}
const gated =
  blankRoutes.length > 0 ||
  (baseline.generatedAt ? verdict.regressions.length > 0 : blocking.length > 0)

if (args.json) {
  console.log(JSON.stringify(payload.totals, null, 1))
} else {
  const pad = (s, n) => String(s).padEnd(n)
  console.log(`\nArapal visual standard — ${routes.length} route(s) × ${frames.length} frame(s)`)
  console.log('─'.repeat(78))
  if (blocking.length === 0) {
    console.log('PASS — no blocking violations.')
  } else {
    for (const [ruleId, items] of Object.entries(byRule).sort((a, b) => b[1].length - a[1].length)) {
      console.log(`\n${ruleId}  (${items.length})  — ${RULES[ruleId].title}`)
      const shown = items.slice(0, 8)
      for (const i of shown) {
        const extra = i.overlapPx ? `overlap ${i.overlapPx}`
          : i.hiddenPx !== undefined ? `hides ${i.hiddenPx}px of ${i.contentPx ?? '?'}px`
          : i.ratio !== undefined ? `${i.ratio}:1 (need ${i.required}) at ${i.sizePx}px`
          : i.sizePx !== undefined ? `${i.sizePx}px`
          : i.boxPx !== undefined ? i.boxPx
          : i.escapePx !== undefined ? `${i.escapePx}px outside`
          : i.family ? i.family
          : ''
        console.log(`  ${pad(i.route, 24)} ${pad(i.frame, 10)} ${pad(i.selector ?? i.family ?? '', 34)} ${extra}`)
        if (i.otherSelector) console.log(`  ${' '.repeat(35)} vs ${i.otherSelector}  "${i.otherLabel}"`)
      }
      if (items.length > shown.length) console.log(`  … ${items.length - shown.length} more`)
    }
  }
  if (advisory.length) {
    console.log(`\nadvisory (${advisory.length}):`)
    for (const a of advisory.slice(0, 3)) {
      if (a.offRampSizes) console.log(`  type-drift ${a.route}@${a.frame}: ${a.offRampSizes.length} off-ramp sizes → ${a.offRampSizes.join(', ')}`)
    }
  }
  if (blankRoutes.length) {
    console.log(`\nDID NOT RENDER (${blankRoutes.length}) — these results are meaningless, not clean:`)
    blankRoutes.forEach((r) => console.log(`  ${r}`))
  }
  console.log('\n' + '─'.repeat(78))
  console.log(`violations: ${blocking.length}   advisory: ${advisory.length}   report: artifacts/qa/visual-standard.json`)
  if (baseline.generatedAt) {
    if (verdict.regressions.length) {
      console.log(`\nNEW violations not in the accepted baseline (${verdict.regressions.length}):`)
      for (const r of verdict.regressions.slice(0, 12)) {
        const [route, frame, rule] = r.key.split('::')
        console.log(`  ${route.padEnd(26)} ${frame.padEnd(11)} ${rule.padEnd(24)} ${r.was} -> ${r.now}  (+${r.delta})`)
      }
    }
    if (verdict.improvements.length) {
      const paid = verdict.improvements.reduce((a, b) => a + b.delta, 0)
      console.log(`\nFIXED — baseline lowered by ${paid}:`)
      for (const r of verdict.improvements.slice(0, 12)) {
        const [route, frame, rule] = r.key.split('::')
        console.log(`  ${route.padEnd(26)} ${frame.padEnd(11)} ${rule.padEnd(24)} ${r.was} -> ${r.now}  (-${r.delta})`)
      }
    }
    if (!verdict.regressions.length && !verdict.improvements.length) console.log('\nNo change against the accepted baseline.')
  }
}

process.exit(gated ? 1 : 0)
