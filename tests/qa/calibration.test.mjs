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
// Each case below was found by hand during the 2026-08-16 audit, then fixed.
// The assertion is that the checker can SEE the class of defect, not that the
// specific instance is still present. Where an instance has been fixed the test
// asserts the rule still fires somewhere, which is what proves acuity.

const has = (fn) => report.findings.some(fn)

test('ACUITY: detects elements overlapping each other', () => {
  assert.ok(
    has((f) => f.ruleId === 'overlap'),
    'The overlap rule fired nowhere. It was the rule the V2 contract required ' +
    '("no overlap, no gaps, end-to-end partitions only") and the one the old ' +
    'checker never enforced. If genuinely clean, delete this test deliberately.',
  )
})

test('ACUITY: detects a container smaller than the content it holds', () => {
  assert.ok(
    has((f) => f.ruleId === 'container-undersized'),
    'container-undersized fired nowhere. This is the class that clipped every ' +
    'V2 nav-rail icon by 10px on every route.',
  )
})

test('ACUITY: detects text below the contrast minimum', () => {
  assert.ok(has((f) => f.ruleId === 'contrast'))
})

test('ACUITY: detects text below the type floor', () => {
  assert.ok(has((f) => f.ruleId === 'type-floor'))
})

test('ACUITY: detects interactive targets below the minimum', () => {
  assert.ok(has((f) => f.ruleId === 'hit-target'))
})

test('ACUITY: detects a scroll region hiding the majority of its content', () => {
  assert.ok(
    has((f) => f.ruleId === 'scroll-hidden-majority'),
    'This is how 373 of 613px of the Study source text hid behind no affordance.',
  )
})

test('ACUITY: detects controls with no accessible name', () => {
  assert.ok(has((f) => f.ruleId === 'unnamed-control'))
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
