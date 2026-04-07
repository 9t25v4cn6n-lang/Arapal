import type { AuditFileInventoryRecord, AuditFinding, LaneStatus } from '../../policy/findingSchema.ts'

export interface RuntimeQaRawGateRow {
  gate: string
  pass: boolean
  detail: string
}

export interface RuntimeQaRawViewportCheck {
  viewport?: {
    label?: string
    width?: number
    height?: number
  }
  metrics?: Record<string, unknown>
  rows?: RuntimeQaRawGateRow[]
  screenshotPath?: string | null
}

export interface RuntimeQaRawStressCheck {
  zoomState?: {
    label?: string
    factor?: number
  }
  metrics?: Record<string, unknown>
  rows?: RuntimeQaRawGateRow[]
  screenshotPath?: string | null
}

export interface RuntimeQaRawScreenReport {
  screenId?: string
  route?: string
  generatedAt?: string
  status?: 'pass' | 'fail'
  failingGateCount?: number
  failingGates?: string[]
  stressLabel?: string
  stressMode?: string
  viewportChecks?: RuntimeQaRawViewportCheck[]
  zoomChecks?: RuntimeQaRawStressCheck[]
  viewportStressChecks?: RuntimeQaRawStressCheck[]
}

export interface RuntimeQaRawIndexScreen {
  screenId?: string
  route?: string
  generatedAt?: string
  status?: string
  failingGateCount?: number
  failingGates?: string[]
  reportPath?: string
  viewportCount?: number
  viewportStressCount?: number
  stressLabel?: string
  stressMode?: string
  screenshotCount?: number
}

export interface RuntimeQaRawIndex {
  generatedAt?: string
  status?: string
  screens?: RuntimeQaRawIndexScreen[]
  findingCount?: number
}

export interface RuntimeQaScreenGateRow {
  scopeLabel: string
  scopeType: 'viewport' | 'viewport-stress'
  gateLabel: string
  ruleId: string
  title: string
  category: string
  subcategory: string | null
  pass: boolean
  detail: string
  severity: AuditFinding['severity']
  confidence: AuditFinding['confidence']
  classification: AuditFinding['classification']
  ownerLayer: AuditFinding['ownerLayer']
  evidence: AuditFinding['evidence']
  fingerprint: string
}

export interface RuntimeQaScreenSummary {
  screenId: string
  route: string | null
  generatedAt: string | null
  status: 'pass' | 'fail' | 'missing-input' | 'malformed' | 'invalid' | 'failed' | 'degraded'
  scope: AuditFinding['scope']
  fileKind: AuditFinding['fileKind']
  ownerLayer: AuditFinding['ownerLayer']
  findingCount: number
  failingGateCount: number
  failingGates: string[]
  gateRows: RuntimeQaScreenGateRow[]
  reportPath: string | null
  screenshotRefs: string[]
  coverage: {
    viewportCount: number
    viewportStressCount: number
    stressLabel: string
    stressMode: string
  }
  inputStatus: {
    report: 'ready' | 'missing' | 'malformed' | 'invalid' | 'failed'
    message: string | null
  }
}

export interface RuntimeQaLaneReport {
  lane: 'runtime-qa'
  generatedAt: string
  findings: AuditFinding[]
  auditedFiles: AuditFileInventoryRecord[]
  excludedFiles: AuditFileInventoryRecord[]
  summary: {
    findingCount: number
    screenCount: number
    byRule: Record<string, number>
    byScreen: Record<string, number>
    byStatus: Record<string, number>
    viewportCoverage: {
      viewportChecks: number
      viewportStressChecks: number
      screenshots: number
      stressLabel: string
      stressMode: string
    }
  }
  screens: RuntimeQaScreenSummary[]
  raw: {
    source: {
      indexPath: string
      reportsDir: string
    }
    inputStatus: {
      index: {
        status: 'ready' | 'missing' | 'malformed' | 'invalid' | 'failed'
        message: string | null
      }
      reports: Array<{
        screenId: string | null
        reportPath: string | null
        status: 'ready' | 'missing' | 'malformed' | 'invalid' | 'failed'
        message: string | null
      }>
    }
  }
  status: LaneStatus
  message: string | null
}
