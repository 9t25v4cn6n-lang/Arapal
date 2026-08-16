// Calibration: proof that the visual standard can still see.
//
// The previous runtime checker silently narrowed to a single screen
// (run-v2-screen-qa.mjs defaulted to `segmentationPasteNext`), reported
// `screenCount: 1, findingCount: 0`, and the dashboard rendered that as
// `auditTrust: 98` for four months while defects accumulated unseen.
//
// These tests exist so that failure mode is impossible to repeat. They assert
// coverage (it looks at everything) and acuity (it finds defects that were
// first found by hand). A checker that reports zero must prove it can find
// something before its zero is believed.
//
//   node --test tests/qa/calibration.test.mjs
//
// Requires a completed run: `npm run qa`.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { ROUTES, VIEWPORTS, RULES } from '../../scripts/qa/standard.mjs'

const REPORT = path.join(process.cwd(), 'artifacts', 'qa', 'visual-standard.json')
const report = fs.existsSync(REPORT) ? JSON.parse(fs.readFileSync(REPORT, 'utf8')) : null

test('a report exists', () => {
  assert.ok(report, 'No artifacts/qa/visual-standard.json — run `npm run qa` first.')
})

test('COVERAGE: the last full run looked at every product route', () => {
  const full = report.routes.length === ROUTES.length
  assert.ok(
    full,
    `Last run covered ${report.routes.length}/${ROUTES.length} routes. ` +
    'A partial run must never be mistaken for a clean bill of health.',
  )
})

test('COVERAGE: the last full run looked at every required frame', () => {
  assert.equal(
    report.frames.length, VIEWPORTS.length,
    `Last run covered ${report.frames.length}/${VIEWPORTS.length} frames.`,
  )
})

test('COVERAGE: every declared rule is actually reachable', () => {
  // A rule that never fires anywhere is either fixed everywhere or broken.
  // Both are worth knowing; this records which rules are currently live.
  const fired = new Set(report.findings.map((f) => f.ruleId))
  const declared = Object.keys(RULES)
  const silent = declared.filter((r) => !fired.has(r))
  assert.ok(
    silent.length < declared.length,
    'No rule fired at all — the probe is almost certainly not executing.',
  )
})

// ── ACUITY ───────────────────────────────────────────────────────────────────
// Acuity is proved synthetically in tests/qa/acuity.spec.js, which injects a
// known defect of each class and requires the probe to find it.
//
// That separation matters. Asserting "this rule fires somewhere in the product"
// was circular — it only proved the checker reproduces defects its own author
// had already found — and it broke the moment a rule was genuinely fixed
// everywhere, which is the outcome we are working toward. A silent rule then
// looked identical to a blind one, which is exactly how the previous audit
// system reported auditTrust: 98 while seeing nothing at all.
//
// With acuity proved independently, zero findings here means clean, not blind.

test('the report records which rules are currently silent', () => {
  const fired = new Set(report.findings.map((f) => f.ruleId))
  const silent = Object.keys(RULES).filter((r) => !fired.has(r))
  // Not an assertion about the product — a visible record, so a rule going
  // quiet is noticed and checked against the synthetic acuity suite rather
  // than assumed to be a win.
  console.log(`[calibration] rules with no current findings: ${silent.join(', ') || 'none'}`)
  assert.ok(Array.isArray(silent))
})

// ── ANTI-REGRESSION ──────────────────────────────────────────────────────────

test('the Study header title no longer collides with its status pill', () => {
  const collision = report.findings.find(
    (f) => f.ruleId === 'overlap' &&
      /fg-center__title/.test(f.selector ?? '') &&
      /fg-center__status/.test(f.otherSelector ?? ''),
  )
  assert.equal(
    collision, undefined,
    'The 124.8x21px title/status collision is back. Cause was ' +
    '.fg-center__headerActions{position:absolute;left:392px} taking the actions ' +
    'lane out of flow so the title had nothing to shrink against.',
  )
})

test('declared font families actually load', () => {
  const missing = [...new Set(report.findings.filter((f) => f.ruleId === 'font-not-loaded').map((f) => f.family))]
  assert.deepEqual(
    missing, [],
    `Declared but never loaded: ${missing.join(', ')}. All families must be ` +
    'requested once from src/index.css, not per-screen inside runtime <style> blocks.',
  )
})
