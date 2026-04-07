import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import assert from 'node:assert/strict'
import { buildAuditSuiteSummary } from '../../src/v2/audit/core/reportSummary.ts'
import { diffFindings } from '../../src/v2/audit/aggregate/diffFindings.ts'
import { readPreviousAuditSuiteFindings } from '../../src/v2/audit/aggregate/publishAuditSuite.ts'
import { scoreAuditSuite } from '../../src/v2/audit/aggregate/scoreAuditSuite.ts'
import { summarizeSuppressions } from '../../src/v2/audit/policy/suppressions.ts'

function createFinding(overrides = {}) {
  return {
    id: overrides.id ?? `finding-${overrides.fingerprint ?? Math.random().toString(36).slice(2)}`,
    lane: overrides.lane ?? 'static-doctrine',
    ruleId: overrides.ruleId ?? 'hardcoded-spacing',
    title: overrides.title ?? 'Hardcoded spacing',
    category: overrides.category ?? 'doctrine',
    subcategory: overrides.subcategory ?? null,
    severity: overrides.severity ?? 'warn',
    confidence: overrides.confidence ?? 'high',
    classification: overrides.classification ?? 'real-code-fix',
    file: overrides.file ?? '/src/v2/screens/SegmentationPasteNext/SegmentationPasteNextScreen.jsx',
    line: overrides.line ?? 10,
    column: overrides.column ?? 2,
    screenId: overrides.screenId ?? 'segmentationPasteNext',
    fileKind: overrides.fileKind ?? 'live-screen',
    scope: overrides.scope ?? 'live-product',
    ownerLayer: overrides.ownerLayer ?? 'screen',
    message: overrides.message ?? 'Avoid hardcoded spacing in consumer code.',
    rationale: overrides.rationale ?? 'Spacing should stay tokenized and reviewable.',
    evidence: overrides.evidence ?? { excerpt: 'padding: 18', details: [] },
    suggestedFix: overrides.suggestedFix ?? 'Use spacing tokens.',
    suggestedActionType: overrides.suggestedActionType ?? 'tokenize',
    autofixable: overrides.autofixable ?? false,
    suppressed: overrides.suppressed ?? false,
    suppressionReason: overrides.suppressionReason ?? null,
    tags: overrides.tags ?? [],
    fingerprint: overrides.fingerprint ?? 'fingerprint-default',
    firstSeenAt: overrides.firstSeenAt ?? null,
    lastSeenAt: overrides.lastSeenAt ?? '2026-04-03T12:00:00.000Z',
    status: overrides.status ?? 'current',
    priorSeverity: overrides.priorSeverity ?? null,
    priorConfidence: overrides.priorConfidence ?? null,
    priorClassification: overrides.priorClassification ?? null,
    priorSuppressed: overrides.priorSuppressed ?? null,
  }
}

function createLaneBreakdown() {
  return [
    { lane: 'static-doctrine', findingCount: 0, auditedFileCount: 10, excludedFileCount: 0, status: 'ready' },
    { lane: 'runtime-qa', findingCount: 0, auditedFileCount: 1, excludedFileCount: 0, status: 'ready' },
    { lane: 'dead-code', findingCount: 0, auditedFileCount: 10, excludedFileCount: 0, status: 'ready' },
    { lane: 'architecture', findingCount: 0, auditedFileCount: 10, excludedFileCount: 0, status: 'ready' },
    { lane: 'duplication', findingCount: 0, auditedFileCount: 10, excludedFileCount: 0, status: 'ready' },
  ]
}

test('score model separates product-quality from audit-trust and downweights tooling debt', () => {
  const productFinding = createFinding({
    fingerprint: 'product-doctrine',
    lane: 'static-doctrine',
    severity: 'error',
    confidence: 'high',
    classification: 'real-code-fix',
    scope: 'live-product',
  })
  const toolingFinding = createFinding({
    fingerprint: 'tooling-dead',
    lane: 'dead-code',
    ruleId: 'unused-export',
    severity: 'warn',
    confidence: 'medium',
    classification: 'low-confidence-review',
    scope: 'tooling-support',
    fileKind: 'audit-suite',
    ownerLayer: 'audit-framework',
    screenId: null,
  })

  const productScores = scoreAuditSuite({
    generatedAt: '2026-04-03T12:00:00.000Z',
    findings: [productFinding],
    laneBreakdown: createLaneBreakdown(),
    suppressions: {
      configuredCount: 0,
      activeCount: 0,
      suppressedFindingCount: 0,
      staleCount: 0,
      invalidCount: 0,
      byLane: {},
      staleIds: [],
      invalidIds: [],
    },
  })
  const toolingScores = scoreAuditSuite({
    generatedAt: '2026-04-03T12:00:00.000Z',
    findings: [toolingFinding],
    laneBreakdown: createLaneBreakdown(),
    suppressions: {
      configuredCount: 0,
      activeCount: 0,
      suppressedFindingCount: 0,
      staleCount: 0,
      invalidCount: 0,
      byLane: {},
      staleIds: [],
      invalidIds: [],
    },
  })

  assert.ok(productScores.scores.productQuality < 100)
  assert.equal(toolingScores.scores.productQuality, 100)
  assert.ok(toolingScores.scores.auditTrust < 100)
  assert.equal(Array.isArray(productScores.scores.groups), true)
})

test('diffing marks new, resolved, persisted, and changed findings with stable history fields', () => {
  const previousFindings = [
    createFinding({
      id: 'persisted-prev',
      fingerprint: 'persisted',
      lastSeenAt: '2026-04-02T12:00:00.000Z',
      firstSeenAt: '2026-04-01T12:00:00.000Z',
      severity: 'warn',
    }),
    createFinding({
      id: 'changed-prev',
      fingerprint: 'changed',
      lastSeenAt: '2026-04-02T12:00:00.000Z',
      firstSeenAt: '2026-04-01T12:00:00.000Z',
      severity: 'warn',
      classification: 'real-code-fix',
    }),
    createFinding({
      id: 'resolved-prev',
      fingerprint: 'resolved',
      lastSeenAt: '2026-04-02T12:00:00.000Z',
      firstSeenAt: '2026-04-01T12:00:00.000Z',
      ruleId: 'legacy-rule',
    }),
  ]
  const currentFindings = [
    createFinding({
      id: 'persisted-now',
      fingerprint: 'persisted',
      lastSeenAt: '2026-04-03T12:00:00.000Z',
      severity: 'warn',
    }),
    createFinding({
      id: 'changed-now',
      fingerprint: 'changed',
      lastSeenAt: '2026-04-03T12:00:00.000Z',
      severity: 'error',
      classification: 'audit-rule-fix',
      suppressed: true,
    }),
    createFinding({
      id: 'new-now',
      fingerprint: 'new',
      lastSeenAt: '2026-04-03T12:00:00.000Z',
      ruleId: 'new-rule',
    }),
  ]

  const result = diffFindings(currentFindings, previousFindings, '2026-04-03T12:00:00.000Z', {
    status: 'loaded',
    message: null,
    previousGeneratedAt: '2026-04-02T12:00:00.000Z',
  })

  assert.equal(result.diff.status, 'ready')
  assert.equal(result.diff.new, 1)
  assert.equal(result.diff.resolved, 1)
  assert.equal(result.diff.persisted, 1)
  assert.equal(result.diff.changed, 1)
  assert.equal(result.diff.changedByField.severity, 1)
  assert.equal(result.diff.changedByField.classification, 1)
  assert.equal(result.diff.changedByField.suppression, 1)
  assert.equal(result.findings.find((finding) => finding.fingerprint === 'persisted')?.status, 'persisted')
  assert.equal(result.findings.find((finding) => finding.fingerprint === 'new')?.status, 'new')
  assert.equal(result.findings.find((finding) => finding.fingerprint === 'changed')?.priorSeverity, 'warn')
  assert.equal(result.findings.find((finding) => finding.fingerprint === 'changed')?.priorClassification, 'real-code-fix')
  assert.equal(result.resolvedFindings[0]?.status, 'resolved')
  assert.ok(result.diff.topRegressions.length >= 1)
  assert.ok(result.diff.topImprovements.length >= 1)
})

test('baseline loader and diff status stay honest for missing, malformed, and invalid baselines', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'audit-suite-phase7-'))

  try {
    const missing = await readPreviousAuditSuiteFindings(path.join(tempDir, 'missing.json'))
    assert.equal(missing.status, 'missing')

    const malformedPath = path.join(tempDir, 'malformed.json')
    await fs.writeFile(malformedPath, '{ nope')
    const malformed = await readPreviousAuditSuiteFindings(malformedPath)
    assert.equal(malformed.status, 'malformed')

    const invalidPath = path.join(tempDir, 'invalid.json')
    await fs.writeFile(invalidPath, JSON.stringify({ generatedAt: '2026-04-03T12:00:00.000Z' }, null, 2))
    const invalid = await readPreviousAuditSuiteFindings(invalidPath)
    assert.equal(invalid.status, 'invalid')

    const unavailableDiff = diffFindings(
      [createFinding({ fingerprint: 'only-current' })],
      null,
      '2026-04-03T12:00:00.000Z',
      {
        status: missing.status,
        message: missing.message,
        previousGeneratedAt: missing.previousGeneratedAt,
      },
    )

    assert.equal(unavailableDiff.diff.status, 'missing-baseline')
    assert.equal(unavailableDiff.diff.new, null)
    assert.equal(unavailableDiff.findings[0].status, 'current')
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true })
  }
})

test('suppression hygiene and suite summary keep suppressed and stale items visible', () => {
  const findings = [
    createFinding({
      fingerprint: 'suppressed-live',
      lane: 'static-doctrine',
      suppressed: true,
      suppressionReason: 'known temporary issue',
    }),
    createFinding({
      fingerprint: 'runtime-clean',
      lane: 'runtime-qa',
      ruleId: 'overlap',
      severity: 'error',
      scope: 'live-product',
    }),
  ]
  const suppressions = [
    {
      id: 'active-suppression',
      reason: 'temporary doctrine exception',
      lane: 'static-doctrine',
      ruleId: 'hardcoded-spacing',
      file: '/src/v2/screens/SegmentationPasteNext/SegmentationPasteNextScreen.jsx',
      fingerprint: null,
    },
    {
      id: 'invalid-suppression',
      reason: '',
      lane: null,
      ruleId: null,
      file: null,
      fingerprint: null,
    },
  ]

  const suppressionSummary = summarizeSuppressions({
    findings,
    suppressions,
    staleSuppressionIds: ['stale-suppression'],
  })
  const scores = scoreAuditSuite({
    generatedAt: '2026-04-03T12:00:00.000Z',
    findings,
    laneBreakdown: createLaneBreakdown(),
    suppressions: suppressionSummary,
  })
  const diff = diffFindings(findings, [], '2026-04-03T12:00:00.000Z', {
    status: 'loaded',
    message: null,
    previousGeneratedAt: '2026-04-02T12:00:00.000Z',
  }).diff
  const summary = buildAuditSuiteSummary({
    generatedAt: '2026-04-03T12:00:00.000Z',
    laneBreakdown: createLaneBreakdown(),
    findings,
    auditedFiles: [
      {
        file: '/src/v2/screens/SegmentationPasteNext/SegmentationPasteNextScreen.jsx',
        fileKind: 'live-screen',
        scope: 'live-product',
        ownerLayer: 'screen',
        included: true,
        includeReason: 'fixture',
        usedByLiveProduct: true,
      },
    ],
    excludedFiles: [],
    diff,
    scores: scores.scores,
    suppressions: suppressionSummary,
    baseline: {
      status: 'loaded',
      message: null,
      previousGeneratedAt: '2026-04-02T12:00:00.000Z',
    },
  })

  assert.equal(suppressionSummary.activeCount, 1)
  assert.equal(suppressionSummary.invalidCount, 1)
  assert.equal(suppressionSummary.staleCount, 1)
  assert.equal(summary.totals.suppressedFindings, 1)
  assert.equal(summary.suppressions.staleIds[0], 'stale-suppression')
  assert.equal(summary.scores.groups.length > 0, true)
  assert.equal(summary.diff.status, 'ready')
})
