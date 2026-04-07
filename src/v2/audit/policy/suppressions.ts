import type { AuditFinding, AuditLaneId, AuditSuppressionSummary } from './findingSchema.ts'

export interface AuditSuppression {
  id: string
  reason: string
  lane: AuditLaneId | null
  ruleId: string | null
  file: string | null
  fingerprint: string | null
}

export const auditSuppressions: AuditSuppression[] = []

export function validateSuppressions(suppressions: AuditSuppression[]) {
  return suppressions.map((suppression) => ({
    suppression,
    isValid:
      Boolean(suppression.id) &&
      Boolean(suppression.reason) &&
      (suppression.lane !== null || suppression.ruleId !== null || suppression.file !== null || suppression.fingerprint !== null),
  }))
}

export function matchesSuppression(finding: AuditFinding, suppression: AuditSuppression) {
  if (suppression.lane && suppression.lane !== finding.lane) {
    return false
  }

  if (suppression.ruleId && suppression.ruleId !== finding.ruleId) {
    return false
  }

  if (suppression.file && suppression.file !== finding.file) {
    return false
  }

  if (suppression.fingerprint && suppression.fingerprint !== finding.fingerprint) {
    return false
  }

  return true
}

export function applySuppressions(findings: AuditFinding[], suppressions: AuditSuppression[]) {
  return findings.map((finding) => {
    const matchingSuppression = suppressions.find((suppression) => matchesSuppression(finding, suppression))

    if (!matchingSuppression) {
      return finding
    }

    return {
      ...finding,
      suppressed: true,
      suppressionReason: matchingSuppression.reason,
    }
  })
}

function countByLane(findings: AuditFinding[]) {
  return findings.reduce<Record<string, number>>((summary, finding) => {
    summary[finding.lane] = (summary[finding.lane] ?? 0) + 1
    return summary
  }, {})
}

export function summarizeSuppressions({
  findings,
  suppressions,
  staleSuppressionIds = [],
}: {
  findings: AuditFinding[]
  suppressions: AuditSuppression[]
  staleSuppressionIds?: string[]
}): AuditSuppressionSummary {
  const validationResults = validateSuppressions(suppressions)
  const invalidIds = validationResults.filter((entry) => !entry.isValid).map((entry) => entry.suppression.id)
  const validSuppressions = validationResults.filter((entry) => entry.isValid).map((entry) => entry.suppression)
  const activeSuppressions = validSuppressions.filter((suppression) =>
    findings.some((finding) => matchesSuppression(finding, suppression)),
  )
  const suppressedFindings = findings.filter((finding) => finding.suppressed)

  return {
    configuredCount: suppressions.length,
    activeCount: new Set(activeSuppressions.map((suppression) => suppression.id)).size,
    suppressedFindingCount: suppressedFindings.length,
    staleCount: staleSuppressionIds.length,
    invalidCount: invalidIds.length,
    byLane: countByLane(suppressedFindings),
    staleIds: [...staleSuppressionIds].sort(),
    invalidIds: invalidIds.sort(),
  }
}
