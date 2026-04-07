import path from 'node:path'
import test from 'node:test'
import assert from 'node:assert/strict'
import { runDuplicationLane } from '../../src/v2/audit/lanes/duplication/runDuplicationLane.ts'
import { resolveInventoryPolicy } from '../../src/v2/audit/policy/scopePolicy.ts'

const FIXTURE_ROOT = path.join(process.cwd(), 'tests', 'fixtures', 'audit', 'duplication')

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

test('duplication lane detects repeated style bundles, shell math, and repeated contract fragments', async () => {
  const auditedFiles = [
    createRecord({ fixturePath: 'product/SurfaceA.jsx', file: '/src/v2/foundation/primitives/SurfaceA.jsx', usedByLiveProduct: true }),
    createRecord({ fixturePath: 'product/SurfaceB.jsx', file: '/src/v2/foundation/primitives/SurfaceB.jsx', usedByLiveProduct: true }),
    createRecord({ fixturePath: 'product/ShellMathA.jsx', file: '/src/v2/screens/Projects/ShellMathA.jsx' }),
    createRecord({ fixturePath: 'product/ShellMathB.jsx', file: '/src/v2/screens/Exams/ShellMathB.jsx' }),
    createRecord({ fixturePath: 'product/ContractA.contract.ts', file: '/src/v2/screens/Projects/ContractA.contract.ts' }),
    createRecord({ fixturePath: 'product/ContractB.contract.ts', file: '/src/v2/screens/Exams/ContractB.contract.ts' }),
    createRecord({ fixturePath: 'product/ContractC.contract.ts', file: '/src/v2/screens/ProjectHome/ContractC.contract.ts' }),
  ]

  const report = await runDuplicationLane({ auditedFiles, excludedFiles: [] })

  assert.equal(report.status, 'ready')
  assert.equal(report.findings.some((finding) => finding.ruleId === 'repeated-style-bundle'), true)
  assert.equal(report.findings.some((finding) => finding.ruleId === 'repeated-shell-math'), true)
  assert.equal(report.findings.some((finding) => finding.ruleId === 'repeated-contract-fragment'), true)
})

test('duplication lane stays conservative below threshold and keeps fingerprints stable', async () => {
  const auditedFiles = [
    createRecord({ fixturePath: 'product/SurfaceA.jsx', file: '/src/v2/foundation/primitives/SurfaceA.jsx', usedByLiveProduct: true }),
    createRecord({ fixturePath: 'product/SurfaceB.jsx', file: '/src/v2/foundation/primitives/SurfaceB.jsx', usedByLiveProduct: true }),
    createRecord({ fixturePath: 'product/SparseA.jsx', file: '/src/v2/foundation/primitives/SparseA.jsx', usedByLiveProduct: true }),
    createRecord({ fixturePath: 'product/SparseB.jsx', file: '/src/v2/foundation/primitives/SparseB.jsx', usedByLiveProduct: true }),
  ]

  const first = await runDuplicationLane({ auditedFiles, excludedFiles: [] })
  const second = await runDuplicationLane({ auditedFiles, excludedFiles: [] })

  assert.equal(first.findings.some((finding) => finding.file?.includes('Sparse')), false)
  assert.deepEqual(
    first.findings.map((finding) => finding.fingerprint).sort(),
    second.findings.map((finding) => finding.fingerprint).sort(),
  )
})

test('duplication lane separates product and tooling findings and exposes low-confidence variant drift', async () => {
  const auditedFiles = [
    createRecord({ fixturePath: 'product/VariantA.jsx', file: '/src/v2/foundation/primitives/VariantA.jsx', usedByLiveProduct: true }),
    createRecord({ fixturePath: 'product/VariantB.jsx', file: '/src/v2/foundation/primitives/VariantB.jsx', usedByLiveProduct: true }),
    createRecord({ fixturePath: 'tooling/DashboardA.jsx', file: '/src/v2/screens/QualityDashboard/DashboardA.jsx' }),
    createRecord({ fixturePath: 'tooling/DashboardB.jsx', file: '/src/v2/screens/QualityDashboard/DashboardB.jsx' }),
  ]

  const report = await runDuplicationLane({ auditedFiles, excludedFiles: [] })

  assert.equal(report.summary.productFindingCount > 0, true)
  assert.equal(report.summary.toolingFindingCount > 0, true)
  assert.equal(report.raw.productVsTooling.product, report.summary.productFindingCount)
  assert.equal(report.raw.productVsTooling.tooling, report.summary.toolingFindingCount)
  assert.equal(
    report.findings.some((finding) => finding.ruleId === 'shared-primitive-variant-drift' && finding.classification === 'low-confidence-review'),
    true,
  )
  assert.equal(Array.isArray(report.summary.topFiles), true)
})

test('duplication lane degrades honestly when parsing falls back', async () => {
  const auditedFiles = [
    createRecord({ fixturePath: 'tooling/BrokenHelper.ts', file: '/src/v2/audit/lanes/duplication/BrokenHelper.ts' }),
    createRecord({ fixturePath: 'tooling/DashboardA.jsx', file: '/src/v2/screens/QualityDashboard/DashboardA.jsx' }),
    createRecord({ fixturePath: 'tooling/DashboardB.jsx', file: '/src/v2/screens/QualityDashboard/DashboardB.jsx' }),
  ]

  const report = await runDuplicationLane({ auditedFiles, excludedFiles: [] })

  assert.equal(report.status, 'degraded')
  assert.equal(report.raw.parse.fallbackFileCount, 1)
  assert.match(report.message ?? '', /fell back on 1 file/i)
})
