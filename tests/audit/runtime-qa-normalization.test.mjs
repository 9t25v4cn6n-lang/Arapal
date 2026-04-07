import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import assert from 'node:assert/strict'
import { runRuntimeQaLane } from '../../src/v2/audit/lanes/runtime-qa/runRuntimeQaLane.ts'
import { buildRuntimeQaIndexPayload } from '../../src/v2/audit/lanes/runtime-qa/publishHelpers.ts'

const FIXTURE_ROOT = path.join(process.cwd(), 'tests', 'fixtures', 'audit', 'runtime-qa')

async function withTempRuntimeDir(setup, run) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'runtime-qa-fixture-'))
  const runtimeDir = path.join(tempDir, 'runtime')
  await fs.mkdir(runtimeDir, { recursive: true })

  try {
    await setup({ tempDir, runtimeDir })
    return await run({ tempDir, runtimeDir })
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true })
  }
}

async function copyFixture(fileName, destinationPath) {
  const sourcePath = path.join(FIXTURE_ROOT, fileName)
  await fs.copyFile(sourcePath, destinationPath)
}

test('runtime lane maps gate failures into normalized findings and preserves truthful viewport-stress metadata', async () => {
  const report = await withTempRuntimeDir(
    async ({ tempDir, runtimeDir }) => {
      await copyFixture('valid-index.json', path.join(tempDir, 'index.json'))
      await copyFixture('product-report.json', path.join(runtimeDir, 'segmentationPasteNext.json'))
      await copyFixture('tooling-report.json', path.join(runtimeDir, 'qualityDashboard.json'))
    },
    async ({ tempDir, runtimeDir }) =>
      runRuntimeQaLane({
        runtimeIndexPath: path.join(tempDir, 'index.json'),
        runtimeReportsDir: runtimeDir,
      }),
  )

  assert.equal(report.status, 'ready')
  assert.equal(report.findings.length, 2)
  assert.deepEqual(report.findings.map((finding) => finding.ruleId), ['overlap', 'ordered-gutter-yield'])
  assert.ok(report.findings.every((finding) => finding.lane === 'runtime-qa'))
  assert.ok(report.findings.every((finding) => finding.scope === 'live-product'))
  assert.equal(report.summary.findingCount, 2)
  assert.equal(report.summary.byRule.overlap, 1)
  assert.equal(report.summary.byRule['ordered-gutter-yield'], 1)
  assert.equal(report.summary.viewportCoverage.stressLabel, 'viewport-stress')
  assert.equal(report.summary.viewportCoverage.stressMode, 'css-zoom-approximation')
  assert.equal(report.summary.viewportCoverage.screenshots, 3)
  assert.equal(report.screens.length, 2)
  assert.equal(report.screens[0].coverage.stressLabel, 'viewport-stress')
  assert.equal(report.screens[0].screenshotRefs.length, 2)
  assert.equal(report.screens[1].scope, 'tooling-support')

  const runtimeIndexPayload = buildRuntimeQaIndexPayload(report)
  assert.equal(runtimeIndexPayload.findingCount, report.findings.length)
  assert.equal(runtimeIndexPayload.screenCount, report.screens.length)
  assert.equal(runtimeIndexPayload.screens[0].coverage.stressMode, 'css-zoom-approximation')
})

test('runtime lane fingerprints stay stable for the same runtime fixtures', async () => {
  await withTempRuntimeDir(
    async ({ tempDir, runtimeDir }) => {
      await copyFixture('valid-index.json', path.join(tempDir, 'index.json'))
      await copyFixture('product-report.json', path.join(runtimeDir, 'segmentationPasteNext.json'))
      await copyFixture('tooling-report.json', path.join(runtimeDir, 'qualityDashboard.json'))
    },
    async ({ tempDir, runtimeDir }) => {
      const first = await runRuntimeQaLane({
        runtimeIndexPath: path.join(tempDir, 'index.json'),
        runtimeReportsDir: runtimeDir,
      })
      const second = await runRuntimeQaLane({
        runtimeIndexPath: path.join(tempDir, 'index.json'),
        runtimeReportsDir: runtimeDir,
      })

      assert.deepEqual(
        first.findings.map((finding) => finding.fingerprint),
        second.findings.map((finding) => finding.fingerprint),
      )
    },
  )
})

test('runtime lane reports missing input truthfully', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'runtime-qa-missing-'))
  try {
    const report = await runRuntimeQaLane({
      runtimeIndexPath: path.join(tempDir, 'missing-index.json'),
      runtimeReportsDir: path.join(tempDir, 'runtime'),
    })

    assert.equal(report.status, 'missing-input')
    assert.equal(report.raw.inputStatus.index.status, 'missing')
    assert.equal(report.findings.length, 0)
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true })
  }
})

test('runtime lane distinguishes malformed index and invalid report shape from a clean pass', async () => {
  await withTempRuntimeDir(
    async ({ tempDir, runtimeDir }) => {
      await fs.writeFile(path.join(tempDir, 'malformed-index.json'), '{ not-json')
      await fs.writeFile(
        path.join(tempDir, 'invalid-index.json'),
        JSON.stringify({ generatedAt: '2026-04-03T12:00:00.000Z', screens: [{ screenId: 'segmentationPasteNext', reportPath: '/v2-audit/runtime/segmentationPasteNext.json' }] }, null, 2),
      )
      await fs.writeFile(path.join(runtimeDir, 'segmentationPasteNext.json'), JSON.stringify({ screenId: 'segmentationPasteNext', route: '#v2/segmentationPasteNext' }, null, 2))
    },
    async ({ tempDir, runtimeDir }) => {
      const malformedIndexReport = await runRuntimeQaLane({
        runtimeIndexPath: path.join(tempDir, 'malformed-index.json'),
        runtimeReportsDir: runtimeDir,
      })
      assert.equal(malformedIndexReport.status, 'failed')
      assert.equal(malformedIndexReport.raw.inputStatus.index.status, 'malformed')

      const invalidReportLane = await runRuntimeQaLane({
        runtimeIndexPath: path.join(tempDir, 'invalid-index.json'),
        runtimeReportsDir: runtimeDir,
      })
      assert.equal(invalidReportLane.status, 'degraded')
      assert.equal(invalidReportLane.raw.inputStatus.reports[0].status, 'invalid')
      assert.equal(invalidReportLane.screens[0].inputStatus.report, 'invalid')
    },
  )
})

test('runtime lane maps metadata-unavailable failures as audit-rule-fix findings', async () => {
  await withTempRuntimeDir(
    async ({ tempDir, runtimeDir }) => {
      await fs.writeFile(
        path.join(tempDir, 'index.json'),
        JSON.stringify(
          {
            generatedAt: '2026-04-03T12:00:00.000Z',
            status: 'ready',
            screens: [
              {
                screenId: 'segmentationPasteNext',
                route: '#v2/segmentationPasteNext',
                generatedAt: '2026-04-03T12:00:00.000Z',
                status: 'fail',
                reportPath: '/v2-audit/runtime/segmentationPasteNext.json',
              },
            ],
          },
          null,
          2,
        ),
      )
      await fs.writeFile(
        path.join(runtimeDir, 'segmentationPasteNext.json'),
        JSON.stringify(
          {
            screenId: 'segmentationPasteNext',
            route: '#v2/segmentationPasteNext',
            generatedAt: '2026-04-03T12:00:00.000Z',
            status: 'fail',
            stressLabel: 'viewport-stress',
            stressMode: 'css-zoom-approximation',
            viewportChecks: [
              {
                viewport: { label: 'desktop-standard', width: 1440, height: 900 },
                rows: [
                  {
                    gate: 'desktop-standard contract/container mismatch',
                    pass: false,
                    detail: 'contract audit metadata unavailable',
                  },
                ],
              },
            ],
            zoomChecks: [],
            viewportStressChecks: [],
          },
          null,
          2,
        ),
      )
    },
    async ({ tempDir, runtimeDir }) => {
      const report = await runRuntimeQaLane({
        runtimeIndexPath: path.join(tempDir, 'index.json'),
        runtimeReportsDir: runtimeDir,
      })

      assert.equal(report.findings.length, 1)
      assert.equal(report.findings[0].ruleId, 'contract-render-mismatch')
      assert.equal(report.findings[0].classification, 'audit-rule-fix')
      assert.equal(report.findings[0].confidence, 'medium')
    },
  )
})
