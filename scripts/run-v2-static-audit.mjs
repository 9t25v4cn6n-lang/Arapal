import { buildAuditFileInventory } from '../src/v2/audit/core/fileInventory.ts'
import { writeAuditJsonPair } from '../src/v2/audit/aggregate/publishAuditSuite.ts'
import { runStaticDoctrineLane } from '../src/v2/audit/lanes/static-doctrine/runStaticDoctrineLane.ts'
import { scopePolicy } from '../src/v2/audit/policy/scopePolicy.ts'

function summarizeByRule(findings) {
  return findings.reduce((summary, finding) => {
    summary[finding.ruleId] = (summary[finding.ruleId] ?? 0) + 1
    return summary
  }, {})
}

function toLegacyFinding(finding) {
  return {
    category: finding.ruleId,
    severity: finding.severity,
    file: finding.file,
    line: finding.line,
    column: finding.column,
    message: finding.message,
    excerpt: finding.evidence?.excerpt ?? null,
    screenId: finding.screenId ?? null,
    confidence: finding.confidence,
    classification: finding.classification,
  }
}

function buildScreenSummaries(findings) {
  return scopePolicy.liveProductScreenDirs.map((screenId) => {
    const screenFindings = findings.filter((finding) => finding.screenId === screenId)
    return {
      screenId,
      findingCount: screenFindings.length,
      categories: summarizeByRule(screenFindings),
      previewCount: Math.min(screenFindings.length, 24),
      previewLimit: 24,
      findings: screenFindings.slice(0, 24).map(toLegacyFinding),
      allFindings: screenFindings.map(toLegacyFinding),
    }
  })
}

function createCompatibilityReport(laneReport) {
  const allFindings = laneReport.findings.map(toLegacyFinding)
  const sharedFoundationFindings = laneReport.findings.filter((finding) => !finding.screenId)

  return {
    generatedAt: laneReport.generatedAt,
    scope: 'src/v2',
    compatibilityOutput: true,
    sourceOfTruth: 'static-doctrine-audit.json',
    summary: {
      fileCount: laneReport.auditedFiles.length,
      screenCount: scopePolicy.liveProductScreenDirs.length,
      findingCount: laneReport.findings.length,
      liveScreenFindingCount: laneReport.summary.liveScreenFindingCount,
      sharedFoundationFindingCount: laneReport.summary.sharedFoundationFindingCount,
      byCategory: laneReport.summary.byRule,
    },
    allFindings,
    screens: buildScreenSummaries(laneReport.findings),
    sharedFoundation: {
      findingCount: sharedFoundationFindings.length,
      byCategory: summarizeByRule(sharedFoundationFindings),
      previewCount: Math.min(sharedFoundationFindings.length, 80),
      previewLimit: 80,
      findings: sharedFoundationFindings.slice(0, 80).map(toLegacyFinding),
      allFindings: sharedFoundationFindings.map(toLegacyFinding),
    },
  }
}

async function main() {
  const inventory = await buildAuditFileInventory()
  const laneReport = await runStaticDoctrineLane({
    auditedFiles: inventory.auditedFiles,
    excludedFiles: inventory.excludedFiles,
  })

  const staticPaths = await writeAuditJsonPair('static-doctrine-audit.json', laneReport)
  const compatibilityPaths = await writeAuditJsonPair('static-audit.json', createCompatibilityReport(laneReport))

  console.log(staticPaths.artifactPath)
  console.log(staticPaths.publicPath)
  console.log(compatibilityPaths.artifactPath)
  console.log(compatibilityPaths.publicPath)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
