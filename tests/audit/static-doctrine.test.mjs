import path from 'node:path'
import test from 'node:test'
import assert from 'node:assert/strict'
import { runStaticDoctrineLane } from '../../src/v2/audit/lanes/static-doctrine/runStaticDoctrineLane.ts'

const REPO_ROOT = process.cwd()
const FIXTURE_ROOT = path.join(REPO_ROOT, 'tests', 'fixtures', 'audit', 'static-doctrine')

function createRecord({
  fixturePath,
  virtualFile,
  fileKind,
  scope,
  ownerLayer,
  usedByLiveProduct = true,
}) {
  return {
    file: virtualFile,
    absolutePath: path.join(FIXTURE_ROOT, fixturePath),
    fileKind,
    scope,
    ownerLayer,
    included: true,
    includeReason: 'Fixture record.',
    usedByLiveProduct,
  }
}

async function auditFixtureRecords(records) {
  return runStaticDoctrineLane({
    auditedFiles: records,
    excludedFiles: [],
  })
}

function getRuleFindings(report, ruleId) {
  return report.findings.filter((finding) => finding.ruleId === ruleId)
}

function getFileRuleFindings(report, virtualFile, ruleId) {
  return report.findings.filter((finding) => finding.file === virtualFile && finding.ruleId === ruleId)
}

test('token-definition fixture can define literals without hardcoded token findings', async () => {
  const report = await auditFixtureRecords([
    createRecord({
      fixturePath: 'tokens/typographyFixture.ts',
      virtualFile: '/src/v2/foundation/tokens/typographyFixture.ts',
      fileKind: 'token-definition',
      scope: 'shared-product-foundation',
      ownerLayer: 'token-layer',
    }),
  ])

  assert.equal(report.findings.length, 0)
})

test('typography doctrine family handles literal, tokenized, and named-variant boundary cases', async () => {
  const literalFile = '/src/v2/foundation/primitives/MultilineLiteralConsumer.jsx'
  const tokenizedFile = '/src/v2/foundation/primitives/TokenizedConsumer.jsx'
  const boundaryFile = '/src/v2/screens/Phase2Harness/TemplateBoundaryConsumer.jsx'

  const report = await auditFixtureRecords([
    createRecord({
      fixturePath: 'consumer/multilineLiteralConsumer.jsx',
      virtualFile: literalFile,
      fileKind: 'shared-primitive',
      scope: 'shared-product-foundation',
      ownerLayer: 'shared-primitive',
    }),
    createRecord({
      fixturePath: 'consumer/tokenizedConsumer.jsx',
      virtualFile: tokenizedFile,
      fileKind: 'shared-primitive',
      scope: 'shared-product-foundation',
      ownerLayer: 'shared-primitive',
    }),
    createRecord({
      fixturePath: 'consumer/templateBoundaryConsumer.jsx',
      virtualFile: boundaryFile,
      fileKind: 'live-screen',
      scope: 'live-product',
      ownerLayer: 'screen',
    }),
  ])

  assert.ok(getFileRuleFindings(report, literalFile, 'hardcoded-typography').length > 0)
  assert.equal(getFileRuleFindings(report, tokenizedFile, 'hardcoded-typography').length, 0)
  assert.equal(getFileRuleFindings(report, boundaryFile, 'hardcoded-typography').length, 0)
  assert.ok(getFileRuleFindings(report, boundaryFile, 'screen-local-bespoke-variant').length > 0)
})

test('spacing doctrine family handles numeric literals, tokenized member expressions, and token alias templates', async () => {
  const literalFile = '/src/v2/foundation/primitives/MultilineLiteralConsumer.jsx'
  const tokenizedFile = '/src/v2/foundation/primitives/TokenizedConsumer.jsx'
  const boundaryFile = '/src/v2/screens/Phase2Harness/TemplateBoundaryConsumer.jsx'

  const report = await auditFixtureRecords([
    createRecord({
      fixturePath: 'consumer/multilineLiteralConsumer.jsx',
      virtualFile: literalFile,
      fileKind: 'shared-primitive',
      scope: 'shared-product-foundation',
      ownerLayer: 'shared-primitive',
    }),
    createRecord({
      fixturePath: 'consumer/tokenizedConsumer.jsx',
      virtualFile: tokenizedFile,
      fileKind: 'shared-primitive',
      scope: 'shared-product-foundation',
      ownerLayer: 'shared-primitive',
    }),
    createRecord({
      fixturePath: 'consumer/templateBoundaryConsumer.jsx',
      virtualFile: boundaryFile,
      fileKind: 'live-screen',
      scope: 'live-product',
      ownerLayer: 'screen',
    }),
  ])

  assert.ok(getFileRuleFindings(report, literalFile, 'hardcoded-spacing').length > 0)
  assert.equal(getFileRuleFindings(report, tokenizedFile, 'hardcoded-spacing').length, 0)
  assert.equal(getFileRuleFindings(report, boundaryFile, 'hardcoded-spacing').length, 0)
})

test('color doctrine family handles literals, tokenized member expressions, and tokenized CSS-template color plumbing', async () => {
  const literalFile = '/src/v2/foundation/primitives/MultilineLiteralConsumer.jsx'
  const tokenizedFile = '/src/v2/foundation/primitives/TokenizedConsumer.jsx'
  const boundaryFile = '/src/v2/foundation/primitives/ColorTemplateBoundary.jsx'

  const report = await auditFixtureRecords([
    createRecord({
      fixturePath: 'consumer/multilineLiteralConsumer.jsx',
      virtualFile: literalFile,
      fileKind: 'shared-primitive',
      scope: 'shared-product-foundation',
      ownerLayer: 'shared-primitive',
    }),
    createRecord({
      fixturePath: 'consumer/tokenizedConsumer.jsx',
      virtualFile: tokenizedFile,
      fileKind: 'shared-primitive',
      scope: 'shared-product-foundation',
      ownerLayer: 'shared-primitive',
    }),
    createRecord({
      fixturePath: 'consumer/colorTemplateBoundary.jsx',
      virtualFile: boundaryFile,
      fileKind: 'shared-primitive',
      scope: 'shared-product-foundation',
      ownerLayer: 'shared-primitive',
    }),
  ])

  assert.ok(getFileRuleFindings(report, literalFile, 'hardcoded-color').length > 0)
  assert.equal(getFileRuleFindings(report, tokenizedFile, 'hardcoded-color').length, 0)
  assert.equal(getFileRuleFindings(report, boundaryFile, 'hardcoded-color').length, 0)
})

test('radius doctrine family handles numeric literals, inherit, and token-based usage', async () => {
  const literalFile = '/src/v2/foundation/primitives/MultilineLiteralConsumer.jsx'
  const tokenizedFile = '/src/v2/foundation/primitives/TokenizedConsumer.jsx'
  const boundaryFile = '/src/v2/screens/Phase2Harness/TemplateBoundaryConsumer.jsx'

  const report = await auditFixtureRecords([
    createRecord({
      fixturePath: 'consumer/multilineLiteralConsumer.jsx',
      virtualFile: literalFile,
      fileKind: 'shared-primitive',
      scope: 'shared-product-foundation',
      ownerLayer: 'shared-primitive',
    }),
    createRecord({
      fixturePath: 'consumer/tokenizedConsumer.jsx',
      virtualFile: tokenizedFile,
      fileKind: 'shared-primitive',
      scope: 'shared-product-foundation',
      ownerLayer: 'shared-primitive',
    }),
    createRecord({
      fixturePath: 'consumer/templateBoundaryConsumer.jsx',
      virtualFile: boundaryFile,
      fileKind: 'live-screen',
      scope: 'live-product',
      ownerLayer: 'screen',
    }),
  ])

  assert.ok(getFileRuleFindings(report, literalFile, 'hardcoded-radius').length > 0)
  assert.equal(getFileRuleFindings(report, tokenizedFile, 'hardcoded-radius').length, 0)
  assert.equal(getFileRuleFindings(report, boundaryFile, 'hardcoded-radius').length, 0)
})

test('motion doctrine family handles literals, tokenized usage, and token alias templates', async () => {
  const literalFile = '/src/v2/foundation/primitives/MultilineLiteralConsumer.jsx'
  const tokenizedFile = '/src/v2/foundation/primitives/TokenizedConsumer.jsx'
  const boundaryFile = '/src/v2/screens/Phase2Harness/TemplateBoundaryConsumer.jsx'

  const report = await auditFixtureRecords([
    createRecord({
      fixturePath: 'consumer/multilineLiteralConsumer.jsx',
      virtualFile: literalFile,
      fileKind: 'shared-primitive',
      scope: 'shared-product-foundation',
      ownerLayer: 'shared-primitive',
    }),
    createRecord({
      fixturePath: 'consumer/tokenizedConsumer.jsx',
      virtualFile: tokenizedFile,
      fileKind: 'shared-primitive',
      scope: 'shared-product-foundation',
      ownerLayer: 'shared-primitive',
    }),
    createRecord({
      fixturePath: 'consumer/templateBoundaryConsumer.jsx',
      virtualFile: boundaryFile,
      fileKind: 'live-screen',
      scope: 'live-product',
      ownerLayer: 'screen',
    }),
  ])

  assert.ok(getFileRuleFindings(report, literalFile, 'hardcoded-motion').length > 0)
  assert.equal(getFileRuleFindings(report, tokenizedFile, 'hardcoded-motion').length, 0)
  assert.equal(getFileRuleFindings(report, boundaryFile, 'hardcoded-motion').length, 0)
})

test('override and shell doctrine family distinguishes invalid live-screen shell drift from valid framework plumbing and low-confidence dynamic overrides', async () => {
  const contractFile = '/src/v2/screens/Phase2Harness/Phase2Harness.contract.ts'
  const invalidShellFile = '/src/v2/screens/Phase2Harness/InvalidShellOverrideScreen.jsx'
  const dynamicOverrideFile = '/src/v2/screens/Phase2Harness/DynamicOverrideScreen.jsx'
  const frameworkFile = '/src/v2/foundation/layout/FrameworkAdapterOverrides.jsx'

  const invalidShellReport = await auditFixtureRecords([
    createRecord({
      fixturePath: 'screens/ValidOverrideContract.contract.ts',
      virtualFile: contractFile,
      fileKind: 'screen-contract',
      scope: 'live-product',
      ownerLayer: 'contract-layer',
    }),
    createRecord({
      fixturePath: 'screens/InvalidShellOverrideScreen.jsx',
      virtualFile: invalidShellFile,
      fileKind: 'live-screen',
      scope: 'live-product',
      ownerLayer: 'screen',
    }),
  ])

  assert.ok(getFileRuleFindings(invalidShellReport, invalidShellFile, 'shell-override-touchpoint').length > 0)
  assert.ok(getFileRuleFindings(invalidShellReport, invalidShellFile, 'screen-local-shell-math-bypass').length > 0)

  const frameworkReport = await auditFixtureRecords([
    createRecord({
      fixturePath: 'framework/frameworkAdapterOverrides.jsx',
      virtualFile: frameworkFile,
      fileKind: 'framework-adapter',
      scope: 'shared-product-foundation',
      ownerLayer: 'shared-layout',
    }),
  ])

  assert.equal(getRuleFindings(frameworkReport, 'container-overrides-usage').length, 0)
  assert.equal(getRuleFindings(frameworkReport, 'shell-override-touchpoint').length, 0)

  const dynamicOverrideReport = await auditFixtureRecords([
    createRecord({
      fixturePath: 'screens/ValidOverrideContract.contract.ts',
      virtualFile: contractFile,
      fileKind: 'screen-contract',
      scope: 'live-product',
      ownerLayer: 'contract-layer',
    }),
    createRecord({
      fixturePath: 'screens/DynamicOverrideScreen.jsx',
      virtualFile: dynamicOverrideFile,
      fileKind: 'live-screen',
      scope: 'live-product',
      ownerLayer: 'screen',
    }),
  ])

  const dynamicFindings = getFileRuleFindings(dynamicOverrideReport, dynamicOverrideFile, 'container-overrides-usage')
  assert.ok(dynamicFindings.length > 0)
  assert.ok(dynamicFindings.every((finding) => finding.classification === 'low-confidence-review'))
})

test('contract doctrine family keeps valid contracts clean and flags missing parent, allowEmpty-without-role, and duplicate names', async () => {
  const validReport = await auditFixtureRecords([
    createRecord({
      fixturePath: 'contracts/ValidContract.contract.ts',
      virtualFile: '/src/v2/screens/ContractHarness/ContractHarness.contract.ts',
      fileKind: 'screen-contract',
      scope: 'live-product',
      ownerLayer: 'contract-layer',
    }),
  ])

  assert.equal(validReport.findings.length, 0)

  const missingParentReport = await auditFixtureRecords([
    createRecord({
      fixturePath: 'contracts/MissingParent.contract.ts',
      virtualFile: '/src/v2/screens/MissingParentHarness/MissingParentHarness.contract.ts',
      fileKind: 'screen-contract',
      scope: 'live-product',
      ownerLayer: 'contract-layer',
    }),
  ])
  assert.ok(getRuleFindings(missingParentReport, 'contract-missing-parent').length > 0)

  const allowEmptyReport = await auditFixtureRecords([
    createRecord({
      fixturePath: 'contracts/AllowEmptyNoRole.contract.ts',
      virtualFile: '/src/v2/screens/AllowEmptyHarness/AllowEmptyHarness.contract.ts',
      fileKind: 'screen-contract',
      scope: 'live-product',
      ownerLayer: 'contract-layer',
    }),
  ])
  assert.ok(getRuleFindings(allowEmptyReport, 'contract-allow-empty-without-role').length > 0)

  const duplicateReport = await auditFixtureRecords([
    createRecord({
      fixturePath: 'contracts/DuplicateContainer.contract.ts',
      virtualFile: '/src/v2/screens/DuplicateHarness/DuplicateHarness.contract.ts',
      fileKind: 'screen-contract',
      scope: 'live-product',
      ownerLayer: 'contract-layer',
    }),
  ])
  assert.ok(getRuleFindings(duplicateReport, 'contract-duplicate-container').length > 0)
})
