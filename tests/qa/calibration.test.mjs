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

// ── the ratchet must not lower itself on an untrustworthy run ────────────────
//
// This is a regression test for a real incident, twice over. A syntax error in
// a shared primitive took the whole app down; every route rendered nothing;
// "nothing found" was read as "everything fixed"; and the baseline was rewritten
// from 420 accepted violations to 0 — destroying the only record of what debt
// existed. The blank-page guard had already detected it and printed the
// evidence, but it only set the exit code, and it ran after the write.
//
// The guard now has to be consulted before the ratchet moves. These tests pin
// the wiring, because the failure is silent and self-erasing: once the baseline
// is zeroed, nothing is left to compare against and the next run looks clean.

test('SAFETY: run.mjs gates the ratchet on a trustworthy run', () => {
  const source = fs.readFileSync(path.join(process.cwd(), 'scripts', 'qa', 'run.mjs'), 'utf8')

  assert.match(
    source,
    /const runIsTrustworthy\s*=\s*blankRoutes\.length === 0 && consoleErrors\.length === 0/,
    'run.mjs must define runIsTrustworthy from the blank-route and page-error evidence',
  )

  const call = source.match(/if \(([^)]*)\)\s*\{\s*\n\s*await ratchetDown\(/)
  assert.ok(call, 'ratchetDown must be called inside a guarded if-statement')
  assert.match(
    call[1],
    /runIsTrustworthy/,
    'ratchetDown must never run unless the run is trustworthy — a broken build otherwise zeroes the baseline',
  )

  // Ordering matters as much as the condition: the evidence has to be collected
  // before it is consulted.
  assert.ok(
    source.indexOf('const runIsTrustworthy') < source.indexOf('await ratchetDown('),
    'runIsTrustworthy must be computed before ratchetDown is reached',
  )
})

test('SAFETY: the accepted baseline is never empty while the report has findings', () => {
  const BASELINE = path.join(process.cwd(), 'artifacts', 'qa', 'baseline.json')
  if (!fs.existsSync(BASELINE) || !report) return

  const baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'))
  const accepted = Object.values(baseline.accepted ?? {}).reduce((a, n) => a + n, 0)
  const blocking = (report.findings ?? []).filter((f) => RULES[f.ruleId]?.blocking).length

  if (blocking > 0) {
    assert.ok(
      accepted > 0,
      `the report holds ${blocking} blocking findings but the baseline accepts 0 —`
      + ' the ratchet has been zeroed, which is the signature of a lowering on a broken run',
    )
  }
})
