import type { File } from '@babel/types'
import type {
  AuditConfidence,
  AuditFileInventoryRecord,
  AuditFinding,
  AuditSeverity,
  FindingClassification,
} from '../../policy/findingSchema.ts'

export interface StaticDoctrineRuleDefinition {
  ruleId: string
  title: string
  category: string
  subcategory: string
  severity: AuditSeverity
  confidence: AuditConfidence
  suggestedFix: string
  suggestedActionType: string
}

export interface StaticDoctrineContractContainer {
  name: string
  parent: string | null
  allowEmpty: boolean
  semanticRole: string | null
  line: number | null
  column: number | null
}

export interface StaticDoctrineContractRegistryEntry {
  file: string
  screenId: string | null
  containers: StaticDoctrineContractContainer[]
}

export interface StaticDoctrineContractRegistry {
  sharedShellContainerNames: Set<string>
  contractByScreenId: Map<string, StaticDoctrineContractRegistryEntry>
}

export interface StaticDoctrineParseSuccess {
  mode: 'ast'
  ast: File
  error: null
}

export interface StaticDoctrineParseFailure {
  mode: 'fallback'
  ast: null
  error: string
}

export type StaticDoctrineParseResult = StaticDoctrineParseSuccess | StaticDoctrineParseFailure

export interface StaticDoctrineRuleContext {
  generatedAt: string
  record: AuditFileInventoryRecord
  sourceText: string
  parseResult: StaticDoctrineParseResult
  contractRegistry: StaticDoctrineContractRegistry
  relatedContract: StaticDoctrineContractRegistryEntry | null
}

export interface StaticDoctrineRuleFindingInput {
  ruleId: string
  message: string
  rationale: string
  file: string
  fileKind: AuditFinding['fileKind']
  scope: AuditFinding['scope']
  ownerLayer: AuditFinding['ownerLayer']
  screenId: string | null
  line: number | null
  column: number | null
  evidence: AuditFinding['evidence']
  classification?: FindingClassification
  confidence?: AuditConfidence
  severity?: AuditSeverity
  suggestedFix?: string | null
  suggestedActionType?: string | null
  tags?: string[]
}

export interface StaticDoctrineLaneReport {
  lane: 'static-doctrine'
  generatedAt: string
  findings: AuditFinding[]
  auditedFiles: AuditFileInventoryRecord[]
  excludedFiles: AuditFileInventoryRecord[]
  raw: {
    parserStats: {
      astParsedFileCount: number
      fallbackFileCount: number
      fallbackFiles: string[]
    }
    byRule: Record<string, number>
  }
  summary: {
    findingCount: number
    liveScreenFindingCount: number
    sharedFoundationFindingCount: number
    byRule: Record<string, number>
  }
  status: 'ready' | 'degraded' | 'failed'
  message: string | null
}
