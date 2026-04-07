import path from 'node:path'
import test from 'node:test'
import assert from 'node:assert/strict'
import { runArchitectureLane } from '../../src/v2/audit/lanes/architecture/runArchitectureLane.ts'

const FIXTURE_ROOT = path.join(process.cwd(), 'tests', 'fixtures', 'audit', 'architecture')

function createRecord({
  fixturePath,
  file,
  fileKind,
  scope,
  ownerLayer,
  included = true,
  usedByLiveProduct = scope === 'live-product' || scope === 'shared-product-foundation',
}) {
  return {
    file,
    absolutePath: path.join(FIXTURE_ROOT, fixturePath),
    fileKind,
    scope,
    ownerLayer,
    included,
    includeReason: 'fixture',
    usedByLiveProduct,
  }
}

test('architecture lane flags forbidden import directions and product-tooling leakage without flagging same-screen contract wiring', async () => {
  const auditedFiles = [
    createRecord({
      fixturePath: 'screens/Projects/ProjectsScreen.jsx',
      file: '/src/v2/screens/Projects/ProjectsScreen.jsx',
      fileKind: 'live-screen',
      scope: 'live-product',
      ownerLayer: 'screen',
    }),
    createRecord({
      fixturePath: 'screens/Projects/ProjectsScreen.contract.ts',
      file: '/src/v2/screens/Projects/ProjectsScreen.contract.ts',
      fileKind: 'screen-contract',
      scope: 'live-product',
      ownerLayer: 'contract-layer',
    }),
    createRecord({
      fixturePath: 'screens/Projects/ImportsOtherScreen.jsx',
      file: '/src/v2/screens/Projects/ImportsOtherScreen.jsx',
      fileKind: 'live-screen',
      scope: 'live-product',
      ownerLayer: 'screen',
    }),
    createRecord({
      fixturePath: 'screens/Exams/ExamsScreen.jsx',
      file: '/src/v2/screens/Exams/ExamsScreen.jsx',
      fileKind: 'live-screen',
      scope: 'live-product',
      ownerLayer: 'screen',
    }),
    createRecord({
      fixturePath: 'shared-layout/SharedLayout.ts',
      file: '/src/v2/foundation/layout/SharedLayout.ts',
      fileKind: 'shared-layout',
      scope: 'shared-product-foundation',
      ownerLayer: 'shared-layout',
    }),
    createRecord({
      fixturePath: 'shared-primitive/ProductButton.ts',
      file: '/src/v2/foundation/primitives/ProductButton.ts',
      fileKind: 'shared-primitive',
      scope: 'shared-product-foundation',
      ownerLayer: 'shared-primitive',
    }),
    createRecord({
      fixturePath: 'labs/LabThing.tsx',
      file: '/src/v2/foundation/lab-previews/LabThing.tsx',
      fileKind: 'lab',
      scope: 'lab',
      ownerLayer: 'tooling-support',
      usedByLiveProduct: false,
    }),
  ]

  const report = await runArchitectureLane({
    auditedFiles,
    excludedFiles: [],
  })

  assert.equal(report.status, 'ready')
  assert.deepEqual(
    report.findings.map((finding) => finding.ruleId).sort(),
    ['product-tooling-leakage', 'screens-no-screen-imports', 'shared-generic-screen-knowledge'],
  )
  assert.equal(report.findings.filter((finding) => finding.ruleId === 'screens-no-screen-imports').length, 1)
  assert.equal(report.findings.filter((finding) => finding.ruleId === 'shared-generic-screen-knowledge').length, 1)
  assert.equal(report.findings.filter((finding) => finding.ruleId === 'product-tooling-leakage').length, 1)
  assert.equal(report.findings.some((finding) => finding.file === '/src/v2/screens/Projects/ProjectsScreen.jsx'), false)
})

test('architecture lane reports cycles, keeps cycle fingerprints stable, surfaces unknown file kinds, and exposes a dashboard-ready summary', async () => {
  const auditedFiles = [
    createRecord({
      fixturePath: 'cycles/CycleA.ts',
      file: '/src/v2/foundation/primitives/CycleA.ts',
      fileKind: 'shared-primitive',
      scope: 'shared-product-foundation',
      ownerLayer: 'shared-primitive',
    }),
    createRecord({
      fixturePath: 'cycles/CycleB.ts',
      file: '/src/v2/foundation/primitives/CycleB.ts',
      fileKind: 'shared-primitive',
      scope: 'shared-product-foundation',
      ownerLayer: 'shared-primitive',
    }),
    createRecord({
      fixturePath: 'unknown/MysteryHelper.ts',
      file: '/src/v2/misc/MysteryHelper.ts',
      fileKind: 'unknown',
      scope: 'unknown',
      ownerLayer: 'unknown',
      usedByLiveProduct: false,
    }),
  ]

  const first = await runArchitectureLane({ auditedFiles, excludedFiles: [] })
  const second = await runArchitectureLane({ auditedFiles, excludedFiles: [] })

  assert.equal(first.status, 'ready')
  assert.equal(first.summary.cycleCount, 1)
  assert.equal(first.summary.productFindingCount, 1)
  assert.equal(first.summary.toolingFindingCount, 1)
  assert.equal(first.raw.productVsTooling.product, 1)
  assert.equal(first.raw.productVsTooling.tooling, 1)
  assert.ok(first.summary.topFiles.length > 0)
  assert.ok(Array.isArray(first.cycles))
  assert.deepEqual(
    first.findings
      .filter((finding) => finding.ruleId === 'dependency-cycle')
      .map((finding) => finding.fingerprint),
    second.findings
      .filter((finding) => finding.ruleId === 'dependency-cycle')
      .map((finding) => finding.fingerprint),
  )
  assert.equal(first.findings.some((finding) => finding.ruleId === 'unknown-file-kind-architecture-risk'), true)
})

test('architecture lane degrades honestly when graph resolution is incomplete', async () => {
  const auditedFiles = [
    createRecord({
      fixturePath: 'unsupported/AliasConsumer.ts',
      file: '/src/v2/foundation/primitives/AliasConsumer.ts',
      fileKind: 'shared-primitive',
      scope: 'shared-product-foundation',
      ownerLayer: 'shared-primitive',
    }),
  ]

  const report = await runArchitectureLane({
    auditedFiles,
    excludedFiles: [],
  })

  assert.equal(report.status, 'degraded')
  assert.equal(report.raw.graph.unresolvedImportCount, 1)
  assert.equal(report.raw.graph.unresolvedImports[0].kind, 'unsupported-internal')
  assert.match(report.message ?? '', /unsupported non-relative forms/i)
})
