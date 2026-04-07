import path from 'node:path'
import test from 'node:test'
import assert from 'node:assert/strict'
import { runDeadCodeLane } from '../../src/v2/audit/lanes/dead-code/runDeadCodeLane.ts'
import { resolveInventoryPolicy } from '../../src/v2/audit/policy/scopePolicy.ts'

const FIXTURE_ROOT = path.join(process.cwd(), 'tests', 'fixtures', 'audit', 'dead-code')

function createRecord({
  fixturePath,
  file,
  usedByLiveProduct = false,
}) {
  const resolved = resolveInventoryPolicy(file.replace(/^\//, ''), { usedByLiveProduct })

  return {
    file,
    absolutePath: path.join(FIXTURE_ROOT, fixturePath),
    fileKind: resolved.fileKind,
    scope: resolved.scope,
    ownerLayer: resolved.ownerLayer,
    included: resolved.included,
    includeReason: resolved.includeReason,
    usedByLiveProduct,
  }
}

test('dead-code lane flags unused files and unused exports conservatively', async () => {
  const report = await runDeadCodeLane({
    auditedFiles: [
      createRecord({
        fixturePath: 'product/AppV2.jsx',
        file: '/src/v2/AppV2.jsx',
        usedByLiveProduct: true,
      }),
      createRecord({
        fixturePath: 'product/routeRegistry.ts',
        file: '/src/v2/app/routeRegistry.ts',
        usedByLiveProduct: true,
      }),
      createRecord({
        fixturePath: 'product/SharedHelper.ts',
        file: '/src/v2/foundation/primitives/SharedHelper.ts',
        usedByLiveProduct: true,
      }),
      createRecord({
        fixturePath: 'product/UnusedScreenHelper.ts',
        file: '/src/v2/screens/SegmentationPasteNext/UnusedScreenHelper.ts',
      }),
    ],
    excludedFiles: [],
  })

  assert.equal(report.status, 'ready')
  assert.equal(report.summary.findingCount, 2)
  assert.equal(report.findings.some((finding) => finding.ruleId === 'unused-file' && finding.file === '/src/v2/screens/SegmentationPasteNext/UnusedScreenHelper.ts'), true)
  assert.equal(report.findings.some((finding) => finding.ruleId === 'unused-export' && finding.file === '/src/v2/foundation/primitives/SharedHelper.ts' && finding.evidence.excerpt === 'spareThing'), true)
  assert.equal(report.findings.some((finding) => finding.file === '/src/v2/AppV2.jsx'), false)
})

test('dead-code lane reports stale suppressions that no longer match live findings', async () => {
  const report = await runDeadCodeLane({
    auditedFiles: [
      createRecord({
        fixturePath: 'product/PlainAppV2.jsx',
        file: '/src/v2/AppV2.jsx',
        usedByLiveProduct: true,
      }),
    ],
    excludedFiles: [],
    liveFindings: [],
    suppressions: [
      {
        id: 'stale-test-suppression',
        reason: 'old dead-code suppression',
        lane: 'static-doctrine',
        ruleId: 'hardcoded-spacing',
        file: '/src/v2/screens/SegmentationPasteNext/SegmentationPasteNextScreen.jsx',
        fingerprint: null,
      },
    ],
  })

  assert.equal(report.findings.filter((finding) => finding.ruleId === 'stale-suppression').length, 1)
  assert.equal(report.raw.staleSuppressions.includes('stale-test-suppression'), true)
})

test('dead-code lane separates product and tooling debt and exposes dashboard-ready summary data', async () => {
  const report = await runDeadCodeLane({
    auditedFiles: [
      createRecord({
        fixturePath: 'product/PlainAppV2.jsx',
        file: '/src/v2/AppV2.jsx',
        usedByLiveProduct: true,
      }),
      createRecord({
        fixturePath: 'tooling/QualityDashboardScreen.jsx',
        file: '/src/v2/screens/QualityDashboard/QualityDashboardScreen.jsx',
      }),
      createRecord({
        fixturePath: 'product/UnusedScreenHelper.ts',
        file: '/src/v2/screens/SegmentationPasteNext/UnusedScreenHelper.ts',
      }),
      createRecord({
        fixturePath: 'tooling/UnusedDebug.ts',
        file: '/src/v2/foundation/debug/UnusedDebug.ts',
      }),
    ],
    excludedFiles: [],
  })

  assert.equal(report.status, 'ready')
  assert.equal(report.summary.productFindingCount, 1)
  assert.equal(report.summary.toolingFindingCount, 1)
  assert.equal(report.raw.productVsTooling.product, 1)
  assert.equal(report.raw.productVsTooling.tooling, 1)
  assert.equal(Array.isArray(report.summary.topFiles), true)
  assert.equal(Array.isArray(report.raw.topCandidateFiles), true)
})

test('dead-code lane degrades honestly and lowers confidence when graph coverage is incomplete', async () => {
  const report = await runDeadCodeLane({
    auditedFiles: [
      createRecord({
        fixturePath: 'unsupported/AliasAppV2.jsx',
        file: '/src/v2/AppV2.jsx',
        usedByLiveProduct: true,
      }),
      createRecord({
        fixturePath: 'product/UnusedScreenHelper.ts',
        file: '/src/v2/screens/SegmentationPasteNext/UnusedScreenHelper.ts',
      }),
    ],
    excludedFiles: [],
  })

  assert.equal(report.status, 'degraded')
  assert.equal(report.raw.usage.unresolvedImportCount, 1)
  assert.equal(report.raw.usage.unresolvedImports[0].kind, 'unsupported-internal')
  assert.equal(report.findings.some((finding) => finding.ruleId === 'unused-file' && finding.classification === 'low-confidence-review'), true)
  assert.match(report.message ?? '', /unsupported non-relative forms/i)
})
