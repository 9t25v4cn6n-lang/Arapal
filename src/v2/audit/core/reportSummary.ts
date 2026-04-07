import type {
  AuditFinding,
  AuditSuiteDiffSummary,
  AuditSuiteScoreSummary,
  AuditSuiteSummary,
  AuditSuppressionSummary,
  LaneBreakdownItem,
} from '../policy/findingSchema.ts'
import { AUDIT_SCHEMA_VERSION } from '../policy/findingSchema.ts'
import { isProductScope } from '../policy/scopePolicy.ts'

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<string, number>>((summary, value) => {
    summary[value] = (summary[value] ?? 0) + 1
    return summary
  }, {})
}

export function summarizeFindingsByScreen(findings: AuditFinding[]) {
  return findings.reduce<Record<string, number>>((summary, finding) => {
    if (!finding.screenId) {
      return summary
    }

    summary[finding.screenId] = (summary[finding.screenId] ?? 0) + 1
    return summary
  }, {})
}

export function buildAuditSuiteSummary({
  generatedAt,
  laneBreakdown,
  findings,
  auditedFiles,
  excludedFiles,
  diff,
  scores,
  suppressions,
  baseline,
}: {
  generatedAt: string
  laneBreakdown: LaneBreakdownItem[]
  findings: AuditFinding[]
  auditedFiles: AuditSuiteSummary['inventory']['auditedFiles']
  excludedFiles: AuditSuiteSummary['inventory']['excludedFiles']
  diff: AuditSuiteDiffSummary
  scores: AuditSuiteScoreSummary
  suppressions: AuditSuppressionSummary
  baseline: {
    status: AuditSuiteSummary['baseline']['status']
    message: string | null
    previousGeneratedAt: string | null
  }
}): AuditSuiteSummary {
  const unsuppressedFindings = findings.filter((finding) => !finding.suppressed)
  const productDebtFindings = unsuppressedFindings.filter((finding) => isProductScope(finding.scope))
  const toolingDebtFindings = unsuppressedFindings.filter((finding) => !isProductScope(finding.scope))
  const productAuditedFiles = auditedFiles.filter((file) => isProductScope(file.scope))
  const toolingAuditedFiles = auditedFiles.filter((file) => !isProductScope(file.scope))

  return {
    generatedAt,
    schemaVersion: AUDIT_SCHEMA_VERSION,
    laneBreakdown,
    metadata: {
      inventoryMode: 'hybrid-path-plus-import-closure',
      importClosureMode: 'relative-import-only',
      publicPathsSanitized: true,
    },
    totals: {
      findings: findings.length,
      productDebtFindings: productDebtFindings.length,
      toolingDebtFindings: toolingDebtFindings.length,
      suppressedFindings: findings.filter((finding) => finding.suppressed).length,
      auditedFiles: auditedFiles.length,
      excludedFiles: excludedFiles.length,
    },
    bySeverity: countBy(findings.map((finding) => finding.severity)),
    byConfidence: countBy(findings.map((finding) => finding.confidence)),
    byClassification: countBy(findings.map((finding) => finding.classification)),
    byFileKind: countBy(findings.map((finding) => finding.fileKind)),
    byOwnerLayer: countBy(findings.map((finding) => finding.ownerLayer)),
    byScope: countBy(findings.map((finding) => finding.scope)),
    byScreen: summarizeFindingsByScreen(findings),
    productVsTooling: {
      product: {
        findings: productDebtFindings.length,
        auditedFiles: productAuditedFiles.length,
      },
      tooling: {
        findings: toolingDebtFindings.length,
        auditedFiles: toolingAuditedFiles.length,
      },
    },
    suppressions,
    scores,
    inventory: {
      auditedFiles,
      excludedFiles,
    },
    diff,
    baseline: {
      currentGeneratedAt: generatedAt,
      previousGeneratedAt: baseline.previousGeneratedAt,
      status: baseline.status,
      message: baseline.message,
    },
  }
}
