import type {
  AuditConfidence,
  AuditFileInventoryRecord,
  AuditFinding,
  AuditScope,
  LaneStatus,
} from '../../policy/findingSchema.ts'

export interface DeadCodeExportRecord {
  name: string
  kind: 'named' | 'default'
  line: number | null
  column: number | null
}

export interface DeadCodeFileAnalysis {
  record: AuditFileInventoryRecord
  parseMode: 'ast' | 'fallback'
  parseError: string | null
  exports: DeadCodeExportRecord[]
  hasWildcardExport: boolean
  hasReExportFromSource: boolean
}

export interface DeadCodeLaneSummary {
  findingCount: number
  productFindingCount: number
  toolingFindingCount: number
  byRule: Record<string, number>
  byScope: Record<string, number>
  topFiles: Array<{ file: string; count: number }>
}

export interface DeadCodeLaneReport {
  lane: 'dead-code'
  generatedAt: string
  findings: AuditFinding[]
  auditedFiles: AuditFileInventoryRecord[]
  excludedFiles: AuditFileInventoryRecord[]
  summary: DeadCodeLaneSummary
  raw: {
    usage: {
      entryRoots: {
        product: string[]
        tooling: string[]
      }
      closure: {
        product: string[]
        tooling: string[]
        combined: string[]
      }
      graphStatus: LaneStatus
      resolutionMode: string
      unresolvedImportCount: number
      unresolvedImports: Array<{
        file: string
        specifier: string
        kind: string
        message: string
      }>
      parsedFileCount: number
      fallbackFileCount: number
      failedFileCount: number
    }
    staleSuppressions: string[]
    staleConfig: string[]
    productVsTooling: {
      product: number
      tooling: number
    }
    byRule: Record<string, number>
    topCandidateFiles: Array<{ file: string; count: number }>
  }
  status: LaneStatus
  message: string | null
}

export interface DeadCodeScopeUsage {
  productRoots: Set<string>
  toolingRoots: Set<string>
  productClosure: Set<string>
  toolingClosure: Set<string>
  combinedClosure: Set<string>
}

export interface DeadCodeRuleContext {
  generatedAt: string
  graphStatus: LaneStatus
  coverageConfidence: AuditConfidence
  productUsage: DeadCodeScopeUsage
}
