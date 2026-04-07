import type { AuditFinding, AuditSuiteDiffSummary } from '../policy/findingSchema.ts'

function toFindingMap(findings: AuditFinding[]) {
  return new Map(findings.map((finding) => [finding.fingerprint, finding]))
}

function countBy(findings: AuditFinding[], getKey: (finding: AuditFinding) => string) {
  return findings.reduce<Record<string, number>>((summary, finding) => {
    const key = getKey(finding)
    summary[key] = (summary[key] ?? 0) + 1
    return summary
  }, {})
}

function buildDeltaItems({
  kind,
  current,
  previous,
}: {
  kind: 'lane' | 'rule'
  current: Record<string, number>
  previous: Record<string, number>
}) {
  const keys = new Set([...Object.keys(current), ...Object.keys(previous)])

  return [...keys]
    .sort((left, right) => left.localeCompare(right))
    .map((key) => ({
      kind,
      key,
      label: key,
      current: current[key] ?? 0,
      previous: previous[key] ?? 0,
      delta: (current[key] ?? 0) - (previous[key] ?? 0),
    }))
}

function createUnavailableDiffSummary({
  currentGeneratedAt,
  status,
  message,
  previousGeneratedAt,
}: {
  currentGeneratedAt: string
  status: AuditSuiteDiffSummary['status']
  message: string | null
  previousGeneratedAt: string | null
}): AuditSuiteDiffSummary {
  return {
    status,
    baselineFound: false,
    comparedAt: currentGeneratedAt,
    previousGeneratedAt,
    currentGeneratedAt,
    new: null,
    resolved: null,
    persisted: null,
    changed: null,
    changedByField: {
      severity: 0,
      confidence: 0,
      classification: 0,
      suppression: 0,
    },
    laneDeltas: [],
    ruleDeltas: [],
    topRegressions: [],
    topImprovements: [],
    message,
  }
}

export function diffFindings(
  currentFindings: AuditFinding[],
  previousFindings: AuditFinding[] | null,
  currentGeneratedAt: string,
  baseline: {
    status: 'loaded' | 'missing' | 'malformed' | 'invalid' | 'failed'
    message: string | null
    previousGeneratedAt: string | null
  },
) {
  if (!previousFindings || baseline.status !== 'loaded') {
    const markedFindings = currentFindings.map((finding) => ({
      ...finding,
      firstSeenAt: finding.firstSeenAt ?? currentGeneratedAt,
      lastSeenAt: currentGeneratedAt,
      status: 'current' as const,
      priorSeverity: null,
      priorConfidence: null,
      priorClassification: null,
      priorSuppressed: null,
    }))

    return {
      findings: markedFindings,
      diff: createUnavailableDiffSummary({
        currentGeneratedAt,
        status:
          baseline.status === 'missing'
            ? 'missing-baseline'
            : baseline.status === 'malformed'
              ? 'malformed-baseline'
              : baseline.status === 'invalid'
                ? 'invalid-baseline'
                : 'failed',
        message: baseline.message,
        previousGeneratedAt: baseline.previousGeneratedAt,
      }),
      resolvedFindings: [],
    }
  }

  const previousByFingerprint = toFindingMap(previousFindings)
  const currentByFingerprint = toFindingMap(currentFindings)
  const resolvedFindings = previousFindings
    .filter((finding) => !currentByFingerprint.has(finding.fingerprint))
    .map((finding) => ({
      ...finding,
      firstSeenAt: finding.firstSeenAt ?? finding.lastSeenAt ?? currentGeneratedAt,
      lastSeenAt: finding.lastSeenAt ?? baseline.previousGeneratedAt ?? currentGeneratedAt,
      status: 'resolved' as const,
      priorSeverity: null,
      priorConfidence: null,
      priorClassification: null,
      priorSuppressed: null,
    }))
  let newCount = 0
  let persistedCount = 0
  let changedCount = 0
  const changedByField = {
    severity: 0,
    confidence: 0,
    classification: 0,
    suppression: 0,
  }

  const findings = currentFindings.map((finding) => {
    const previous = previousByFingerprint.get(finding.fingerprint)

    if (!previous) {
      newCount += 1
      return {
        ...finding,
        firstSeenAt: currentGeneratedAt,
        lastSeenAt: currentGeneratedAt,
        status: 'new' as const,
        priorSeverity: null,
        priorConfidence: null,
        priorClassification: null,
        priorSuppressed: null,
      }
    }

    const severityChanged = previous.severity !== finding.severity
    const confidenceChanged = previous.confidence !== finding.confidence
    const classificationChanged = previous.classification !== finding.classification
    const suppressionChanged = previous.suppressed !== finding.suppressed
    const changed = severityChanged || confidenceChanged || classificationChanged || suppressionChanged

    if (changed) {
      changedCount += 1
      changedByField.severity += severityChanged ? 1 : 0
      changedByField.confidence += confidenceChanged ? 1 : 0
      changedByField.classification += classificationChanged ? 1 : 0
      changedByField.suppression += suppressionChanged ? 1 : 0
      return {
        ...finding,
        firstSeenAt: previous.firstSeenAt ?? previous.lastSeenAt ?? currentGeneratedAt,
        lastSeenAt: currentGeneratedAt,
        status: 'changed' as const,
        priorSeverity: previous.severity,
        priorConfidence: previous.confidence,
        priorClassification: previous.classification,
        priorSuppressed: previous.suppressed,
      }
    }

    persistedCount += 1
    return {
      ...finding,
      firstSeenAt: previous.firstSeenAt ?? previous.lastSeenAt ?? currentGeneratedAt,
      lastSeenAt: currentGeneratedAt,
      status: 'persisted' as const,
      priorSeverity: null,
      priorConfidence: null,
      priorClassification: null,
      priorSuppressed: null,
    }
  })

  const laneDeltas = buildDeltaItems({
    kind: 'lane',
    current: countBy(currentFindings, (finding) => finding.lane),
    previous: countBy(previousFindings, (finding) => finding.lane),
  })
  const ruleDeltas = buildDeltaItems({
    kind: 'rule',
    current: countBy(currentFindings, (finding) => finding.ruleId),
    previous: countBy(previousFindings, (finding) => finding.ruleId),
  })
  const deltaItems = [...laneDeltas, ...ruleDeltas]
  const topRegressions = deltaItems
    .filter((item) => item.delta > 0)
    .sort((left, right) => right.delta - left.delta || left.label.localeCompare(right.label))
    .slice(0, 8)
  const topImprovements = deltaItems
    .filter((item) => item.delta < 0)
    .sort((left, right) => left.delta - right.delta || left.label.localeCompare(right.label))
    .slice(0, 8)

  return {
    findings,
    diff: {
      status: 'ready',
      baselineFound: true,
      comparedAt: currentGeneratedAt,
      previousGeneratedAt: baseline.previousGeneratedAt ?? previousFindings[0]?.lastSeenAt ?? null,
      currentGeneratedAt,
      new: newCount,
      resolved: resolvedFindings.length,
      persisted: persistedCount,
      changed: changedCount,
      changedByField,
      laneDeltas,
      ruleDeltas,
      topRegressions,
      topImprovements,
      message: null,
    } satisfies AuditSuiteDiffSummary,
    resolvedFindings,
  }
}
