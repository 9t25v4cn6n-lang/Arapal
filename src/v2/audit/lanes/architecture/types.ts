import type {
  AuditConfidence,
  AuditFileInventoryRecord,
  AuditFinding,
  AuditScope,
  LaneStatus,
} from '../../policy/findingSchema.ts'

export interface ArchitectureImportIssue {
  file: string
  specifier: string
  kind: 'unresolved-relative' | 'unsupported-internal' | 'read-failure'
  line: number | null
  column: number | null
  message: string
}

export interface ArchitectureImportEdge {
  from: AuditFileInventoryRecord
  to: AuditFileInventoryRecord
  specifier: string
  importedNames: string[]
  usesNamespaceImport: boolean
  usesSideEffectImport: boolean
  line: number | null
  column: number | null
  viaFallback: boolean
  confidence: AuditConfidence
}

export interface ArchitectureGraphBuildResult {
  status: LaneStatus
  message: string | null
  edges: ArchitectureImportEdge[]
  outgoing: Map<string, ArchitectureImportEdge[]>
  incoming: Map<string, ArchitectureImportEdge[]>
  unresolvedImports: ArchitectureImportIssue[]
  parsedFileCount: number
  fallbackFileCount: number
  failedFileCount: number
  externalImportCount: number
  nodeCount: number
}

export interface ArchitectureCycleCluster {
  fingerprint: string
  members: string[]
  scope: AuditScope
  productScope: boolean
}

export interface ArchitectureLaneSummary {
  findingCount: number
  productFindingCount: number
  toolingFindingCount: number
  byRule: Record<string, number>
  byScope: Record<string, number>
  cycleCount: number
  topFiles: Array<{ file: string; count: number }>
}

export interface ArchitectureLaneReport {
  lane: 'architecture'
  generatedAt: string
  findings: AuditFinding[]
  auditedFiles: AuditFileInventoryRecord[]
  excludedFiles: AuditFileInventoryRecord[]
  cycles: ArchitectureCycleCluster[]
  summary: ArchitectureLaneSummary
  raw: {
    graph: {
      nodeCount: number
      edgeCount: number
      externalImportCount: number
      unresolvedImportCount: number
      unresolvedImports: ArchitectureImportIssue[]
      parsedFileCount: number
      fallbackFileCount: number
      failedFileCount: number
      resolutionMode: string
    }
    topViolatingFiles: Array<{ file: string; count: number }>
    productVsTooling: {
      product: number
      tooling: number
    }
    byRule: Record<string, number>
  }
  status: LaneStatus
  message: string | null
}
