import type {
  AuditConfidence,
  AuditFileInventoryRecord,
  AuditFinding,
  AuditScope,
  LaneStatus,
} from '../../policy/findingSchema.ts'

export type DuplicationRuleId =
  | 'repeated-style-bundle'
  | 'repeated-shell-math'
  | 'repeated-contract-fragment'
  | 'shared-primitive-variant-drift'

export type DuplicationQualityBucket = 'harmless-repetition' | 'candidate-extraction' | 'likely-technical-debt'

export interface DuplicationOccurrence {
  ruleId: DuplicationRuleId
  file: string
  line: number | null
  column: number | null
  fileKind: AuditFinding['fileKind']
  scope: AuditScope
  ownerLayer: AuditFinding['ownerLayer']
  screenId: string | null
  signature: string
  familySignature: string
  excerpt: string | null
  propertyNames: string[]
}

export interface DuplicationFileAnalysis {
  record: AuditFileInventoryRecord
  parseMode: 'ast' | 'fallback'
  parseError: string | null
  occurrences: DuplicationOccurrence[]
}

export interface DuplicationClusterSummary {
  ruleId: DuplicationRuleId
  scope: AuditScope
  quality: DuplicationQualityBucket
  fileCount: number
  occurrenceCount: number
  distinctSignatureCount: number
  files: string[]
  representativeFile: string | null
}

export interface DuplicationLaneSummary {
  findingCount: number
  productFindingCount: number
  toolingFindingCount: number
  byRule: Record<string, number>
  byScope: Record<string, number>
  clusterCount: number
  topFiles: Array<{ file: string; count: number }>
}

export interface DuplicationLaneReport {
  lane: 'duplication'
  generatedAt: string
  findings: AuditFinding[]
  auditedFiles: AuditFileInventoryRecord[]
  excludedFiles: AuditFileInventoryRecord[]
  summary: DuplicationLaneSummary
  raw: {
    clusters: DuplicationClusterSummary[]
    productVsTooling: {
      product: number
      tooling: number
    }
    byRule: Record<string, number>
    topRepeatedFiles: Array<{ file: string; count: number }>
    parse: {
      parsedFileCount: number
      fallbackFileCount: number
      failedFileCount: number
    }
  }
  status: LaneStatus
  message: string | null
}

export interface DuplicationRuleContext {
  generatedAt: string
  confidence: AuditConfidence
}
