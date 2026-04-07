import type {
  AuditConfidence,
  AuditFinding,
  AuditLaneId,
  AuditScoreComponent,
  AuditScoreGroup,
  AuditSeverity,
  AuditSuiteScoresReport,
  LaneBreakdownItem,
} from '../policy/findingSchema.ts'
import { AUDIT_SCHEMA_VERSION } from '../policy/findingSchema.ts'
import type { AuditSuppressionSummary } from '../policy/findingSchema.ts'
import { isProductScope } from '../policy/scopePolicy.ts'

const severityWeights: Record<AuditSeverity, number> = {
  error: 7,
  warn: 3,
  info: 1,
}

const confidenceMultipliers: Record<AuditConfidence, number> = {
  high: 1,
  medium: 0.7,
  low: 0.4,
}

const suppressedFindingMultiplier = {
  productQuality: 0.35,
  auditTrust: 0.6,
}

const budgets = {
  'doctrine-hygiene': 325,
  'runtime-integrity': 55,
  'architecture-hygiene': 60,
  'dead-code-hygiene': 80,
  'duplication-hygiene': 28,
  'audit-trustworthiness': 90,
} as const

const productClassificationMultipliers: Record<AuditFinding['classification'], number> = {
  'real-code-fix': 1,
  'audit-rule-fix': 0.35,
  'doctrine-decision-needed': 0.75,
  'false-positive': 0.1,
  'low-confidence-review': 0.25,
}

const trustClassificationMultipliers: Record<AuditFinding['classification'], number> = {
  'real-code-fix': 0,
  'audit-rule-fix': 1,
  'doctrine-decision-needed': 0.15,
  'false-positive': 0.8,
  'low-confidence-review': 0.55,
}

function round(value: number) {
  return Math.round(value * 100) / 100
}

function averageScore(components: AuditScoreComponent[]) {
  if (components.length === 0) {
    return 100
  }

  return round(components.reduce((total, component) => total + component.score, 0) / components.length)
}

function calculateWeightedDebt(
  findings: AuditFinding[],
  mode: 'product-quality' | 'audit-trust',
) {
  const classificationMultipliers =
    mode === 'product-quality' ? productClassificationMultipliers : trustClassificationMultipliers
  const suppressedMultiplier =
    mode === 'product-quality' ? suppressedFindingMultiplier.productQuality : suppressedFindingMultiplier.auditTrust

  return findings.reduce((total, finding) => {
    const severityWeight = severityWeights[finding.severity]
    const confidenceMultiplier = confidenceMultipliers[finding.confidence]
    const classificationMultiplier = classificationMultipliers[finding.classification]
    const suppressionMultiplier = finding.suppressed ? suppressedMultiplier : 1
    const scopeMultiplier =
      mode === 'product-quality'
        ? isProductScope(finding.scope)
          ? 1
          : 0
        : isProductScope(finding.scope)
          ? 1
          : 0.75

    return total + severityWeight * confidenceMultiplier * classificationMultiplier * suppressionMultiplier * scopeMultiplier
  }, 0)
}

function buildComponent({
  id,
  label,
  findings,
  laneIds,
  budget,
  mode,
  notes = [],
  extraDebt = 0,
}: {
  id: string
  label: string
  findings: AuditFinding[]
  laneIds: AuditLaneId[]
  budget: number
  mode: 'product-quality' | 'audit-trust'
  notes?: string[]
  extraDebt?: number
}): AuditScoreComponent {
  const relevantFindings =
    mode === 'product-quality' ? findings.filter((finding) => isProductScope(finding.scope)) : findings
  const weightedDebt = round(calculateWeightedDebt(relevantFindings, mode) + extraDebt)
  const deduction =
    weightedDebt > 0 ? Math.min(100, Math.max(1, Math.round((weightedDebt / budget) * 100))) : 0

  return {
    id,
    label,
    score: Math.max(0, 100 - deduction),
    maxScore: 100,
    deduction,
    budget,
    weightedDebt,
    findingCount: relevantFindings.length,
    suppressedFindingCount: relevantFindings.filter((finding) => finding.suppressed).length,
    laneIds,
    notes,
  }
}

function findingsForLanes(findings: AuditFinding[], laneIds: AuditLaneId[]) {
  return findings.filter((finding) => laneIds.includes(finding.lane))
}

export function scoreAuditSuite({
  generatedAt,
  findings,
  laneBreakdown,
  suppressions,
}: {
  generatedAt: string
  findings: AuditFinding[]
  laneBreakdown: LaneBreakdownItem[]
  suppressions: AuditSuppressionSummary
}): AuditSuiteScoresReport {
  const degradedLaneCount = laneBreakdown.filter((lane) => lane.status !== 'ready').length
  const trustExtraDebt = suppressions.staleCount * 8 + suppressions.invalidCount * 10 + degradedLaneCount * 14

  const groups: AuditScoreGroup[] = [
    {
      id: 'product-quality',
      label: 'Product quality',
      maxScore: 100,
      score: 0,
      components: [
        buildComponent({
          id: 'doctrine-hygiene',
          label: 'Doctrine hygiene',
          findings: findingsForLanes(findings, ['static-doctrine']),
          laneIds: ['static-doctrine'],
          budget: budgets['doctrine-hygiene'],
          mode: 'product-quality',
          notes: ['Static doctrine findings are product-quality debt only when they land in live-product or shared-product-foundation scope.'],
        }),
        buildComponent({
          id: 'runtime-integrity',
          label: 'Runtime integrity',
          findings: findingsForLanes(findings, ['runtime-qa']),
          laneIds: ['runtime-qa'],
          budget: budgets['runtime-integrity'],
          mode: 'product-quality',
          notes: ['Rendered QA findings carry full product-quality weight because they reflect runtime truth.'],
        }),
        buildComponent({
          id: 'architecture-hygiene',
          label: 'Architecture hygiene',
          findings: findingsForLanes(findings, ['architecture']),
          laneIds: ['architecture'],
          budget: budgets['architecture-hygiene'],
          mode: 'product-quality',
          notes: ['Only product-scope architecture findings affect this component.'],
        }),
        buildComponent({
          id: 'dead-code-hygiene',
          label: 'Dead-code hygiene',
          findings: findingsForLanes(findings, ['dead-code']),
          laneIds: ['dead-code'],
          budget: budgets['dead-code-hygiene'],
          mode: 'product-quality',
          notes: ['Unused product code matters more here than tooling-only leftovers.'],
        }),
        buildComponent({
          id: 'duplication-hygiene',
          label: 'Duplication hygiene',
          findings: findingsForLanes(findings, ['duplication']),
          laneIds: ['duplication'],
          budget: budgets['duplication-hygiene'],
          mode: 'product-quality',
          notes: ['This component stays conservative and only reacts to high-signal duplication clusters.'],
        }),
      ],
    },
    {
      id: 'audit-trust',
      label: 'Audit trust',
      maxScore: 100,
      score: 0,
      components: [
        buildComponent({
          id: 'audit-trustworthiness',
          label: 'Audit trustworthiness',
          findings,
          laneIds: ['static-doctrine', 'runtime-qa', 'architecture', 'dead-code', 'duplication'],
          budget: budgets['audit-trustworthiness'],
          mode: 'audit-trust',
          extraDebt: trustExtraDebt,
          notes: [
            'Audit-rule-fix and low-confidence findings affect trust more than product quality.',
            `Stale suppressions (${suppressions.staleCount}), invalid suppressions (${suppressions.invalidCount}), and degraded lanes (${degradedLaneCount}) add direct trust debt.`,
          ],
        }),
      ],
    },
  ]

  groups.forEach((group) => {
    group.score = averageScore(group.components)
  })

  return {
    generatedAt,
    schemaVersion: AUDIT_SCHEMA_VERSION,
    scores: {
      productQuality: groups.find((group) => group.id === 'product-quality')?.score ?? 100,
      auditTrust: groups.find((group) => group.id === 'audit-trust')?.score ?? 100,
      groups,
    },
    metadata: {
      severityWeights,
      confidenceMultipliers,
      suppressedFindingMultiplier,
      budgets: { ...budgets },
    },
  }
}
