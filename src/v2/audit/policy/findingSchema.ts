export const auditLaneIds = [
  'static-doctrine',
  'runtime-qa',
  'dead-code',
  'duplication',
  'architecture',
  'audit-suite',
] as const

export const auditSeverities = ['error', 'warn', 'info'] as const
export const auditConfidences = ['high', 'medium', 'low'] as const
export const findingClassifications = [
  'real-code-fix',
  'audit-rule-fix',
  'doctrine-decision-needed',
  'false-positive',
  'low-confidence-review',
] as const

export const auditFileKinds = [
  'live-screen',
  'screen-contract',
  'shared-layout',
  'shared-primitive',
  'token-definition',
  'framework-adapter',
  'dashboard',
  'debug',
  'lab',
  'generated',
  'ignored',
  'unknown',
  'audit-suite',
] as const

export const auditScopes = [
  'live-product',
  'shared-product-foundation',
  'tooling-support',
  'dashboard',
  'debug',
  'lab',
  'generated',
  'ignored',
  'unknown',
] as const

export const auditOwnerLayers = [
  'screen',
  'shared-primitive',
  'shared-layout',
  'token-layer',
  'contract-layer',
  'runtime-qa',
  'audit-framework',
  'architecture-policy',
  'tooling-support',
  'unknown',
] as const

export const findingStatuses = ['current', 'new', 'resolved', 'persisted', 'changed'] as const
export const laneStatuses = ['ready', 'missing-input', 'degraded', 'failed', 'not-implemented'] as const
export const diffStatuses = ['ready', 'missing-baseline', 'malformed-baseline', 'invalid-baseline', 'failed'] as const
export const auditScoreGroupIds = ['product-quality', 'audit-trust'] as const

export type AuditLaneId = (typeof auditLaneIds)[number]
export type AuditSeverity = (typeof auditSeverities)[number]
export type AuditConfidence = (typeof auditConfidences)[number]
export type FindingClassification = (typeof findingClassifications)[number]
export type AuditFileKind = (typeof auditFileKinds)[number]
export type AuditScope = (typeof auditScopes)[number]
export type AuditOwnerLayer = (typeof auditOwnerLayers)[number]
export type FindingStatus = (typeof findingStatuses)[number]
export type LaneStatus = (typeof laneStatuses)[number]
export type DiffStatus = (typeof diffStatuses)[number]
export type AuditScoreGroupId = (typeof auditScoreGroupIds)[number]

export interface AuditEvidence {
  excerpt: string | null
  details?: string[] | null
}

export interface AuditFinding {
  id: string
  lane: AuditLaneId
  ruleId: string
  title: string
  category: string
  subcategory: string | null
  severity: AuditSeverity
  confidence: AuditConfidence
  classification: FindingClassification
  file: string | null
  line: number | null
  column: number | null
  screenId: string | null
  fileKind: AuditFileKind
  scope: AuditScope
  ownerLayer: AuditOwnerLayer
  message: string
  rationale: string
  evidence: AuditEvidence
  suggestedFix: string | null
  suggestedActionType: string | null
  autofixable: boolean
  suppressed: boolean
  suppressionReason: string | null
  tags: string[]
  fingerprint: string
  firstSeenAt: string | null
  lastSeenAt: string
  status: FindingStatus
  priorSeverity?: AuditSeverity | null
  priorConfidence?: AuditConfidence | null
  priorClassification?: FindingClassification | null
  priorSuppressed?: boolean | null
}

export interface AuditFileInventoryRecord {
  file: string
  absolutePath?: string | null
  fileKind: AuditFileKind
  scope: AuditScope
  ownerLayer: AuditOwnerLayer
  included: boolean
  includeReason: string
  usedByLiveProduct: boolean
}

export interface LaneBreakdownItem {
  lane: AuditLaneId
  findingCount: number
  auditedFileCount: number
  excludedFileCount: number
  status: LaneStatus
  message?: string | null
}

export interface AuditDiffDeltaItem {
  kind: 'lane' | 'rule'
  key: string
  label: string
  current: number
  previous: number
  delta: number
}

export interface AuditSuiteDiffSummary {
  status: DiffStatus
  baselineFound: boolean
  comparedAt: string
  previousGeneratedAt: string | null
  currentGeneratedAt: string
  new: number | null
  resolved: number | null
  persisted: number | null
  changed: number | null
  changedByField: {
    severity: number
    confidence: number
    classification: number
    suppression: number
  }
  laneDeltas: AuditDiffDeltaItem[]
  ruleDeltas: AuditDiffDeltaItem[]
  topRegressions: AuditDiffDeltaItem[]
  topImprovements: AuditDiffDeltaItem[]
  message: string | null
}

export interface AuditSuiteDiffReport {
  generatedAt: string
  schemaVersion: number
  summary: AuditSuiteDiffSummary
  resolvedFindings: AuditFinding[]
}

export interface AuditScoreComponent {
  id: string
  label: string
  score: number
  maxScore: number
  deduction: number
  budget: number
  weightedDebt: number
  findingCount: number
  suppressedFindingCount: number
  laneIds: AuditLaneId[]
  notes: string[]
}

export interface AuditScoreGroup {
  id: AuditScoreGroupId
  label: string
  score: number
  maxScore: number
  components: AuditScoreComponent[]
}

export interface AuditSuiteScoreSummary {
  productQuality: number
  auditTrust: number
  groups: AuditScoreGroup[]
}

export interface AuditSuiteScoresReport {
  generatedAt: string
  schemaVersion: number
  scores: AuditSuiteScoreSummary
  metadata: {
    severityWeights: Record<AuditSeverity, number>
    confidenceMultipliers: Record<AuditConfidence, number>
    suppressedFindingMultiplier: {
      productQuality: number
      auditTrust: number
    }
    budgets: Record<string, number>
  }
}

export interface AuditSuppressionSummary {
  configuredCount: number
  activeCount: number
  suppressedFindingCount: number
  staleCount: number
  invalidCount: number
  byLane: Record<string, number>
  staleIds: string[]
  invalidIds: string[]
}

export interface AuditSuiteSummary {
  generatedAt: string
  schemaVersion: number
  laneBreakdown: LaneBreakdownItem[]
  metadata: {
    inventoryMode: string
    importClosureMode: string
    publicPathsSanitized: boolean
  }
  totals: {
    findings: number
    productDebtFindings: number
    toolingDebtFindings: number
    suppressedFindings: number
    auditedFiles: number
    excludedFiles: number
  }
  bySeverity: Record<string, number>
  byConfidence: Record<string, number>
  byClassification: Record<string, number>
  byFileKind: Record<string, number>
  byOwnerLayer: Record<string, number>
  byScope: Record<string, number>
  byScreen: Record<string, number>
  productVsTooling: {
    product: {
      findings: number
      auditedFiles: number
    }
    tooling: {
      findings: number
      auditedFiles: number
    }
  }
  suppressions: AuditSuppressionSummary
  scores: AuditSuiteScoreSummary
  inventory: {
    auditedFiles: AuditFileInventoryRecord[]
    excludedFiles: AuditFileInventoryRecord[]
  }
  diff: AuditSuiteDiffSummary
  baseline: {
    currentGeneratedAt: string
    previousGeneratedAt: string | null
    status: 'loaded' | 'missing' | 'malformed' | 'invalid' | 'failed'
    message: string | null
  }
}

export interface AuditSuiteFindingsReport {
  generatedAt: string
  schemaVersion: number
  findings: AuditFinding[]
  diff: AuditSuiteDiffSummary
}

export const AUDIT_SCHEMA_VERSION = 2
