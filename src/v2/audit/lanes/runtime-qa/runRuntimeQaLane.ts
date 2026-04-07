import path from 'node:path'
import { coreProductRouteIds } from '../../../app/auditRegistry.js'
import { createFindingFingerprint, createFindingId } from '../../core/fingerprint.ts'
import { loadJsonFile } from '../../core/jsonLoad.ts'
import type { AuditFinding } from '../../policy/findingSchema.ts'
import { applySuppressions, auditSuppressions } from '../../policy/suppressions.ts'
import { getRuntimeQaGateDefinition } from './gateDefinitions.ts'
import type {
  RuntimeQaLaneReport,
  RuntimeQaRawGateRow,
  RuntimeQaRawIndex,
  RuntimeQaRawScreenReport,
  RuntimeQaScreenGateRow,
  RuntimeQaScreenSummary,
} from './types.ts'

const DEFAULT_RUNTIME_INDEX_PATH = path.join(process.cwd(), 'public', 'v2-audit', 'runtime', 'index.json')
const DEFAULT_RUNTIME_REPORTS_DIR = path.join(process.cwd(), 'public', 'v2-audit', 'runtime')

function validateRuntimeIndex(value: unknown) {
  if (!value || typeof value !== 'object') {
    return 'expected an object root'
  }

  if (!Array.isArray((value as RuntimeQaRawIndex).screens)) {
    return 'expected a screens array'
  }

  return null
}

function validateRuntimeReport(value: unknown) {
  if (!value || typeof value !== 'object') {
    return 'expected an object root'
  }

  const report = value as RuntimeQaRawScreenReport
  if (!Array.isArray(report.viewportChecks)) {
    return 'expected viewportChecks array'
  }

  if (!Array.isArray(report.zoomChecks) && !Array.isArray(report.viewportStressChecks)) {
    return 'expected zoomChecks or viewportStressChecks array'
  }

  return null
}

function normalizeScreenContext(screenId: string | null) {
  if (screenId && coreProductRouteIds.includes(screenId)) {
    return {
      scope: 'live-product' as const,
      fileKind: 'live-screen' as const,
      ownerLayer: 'runtime-qa' as const,
    }
  }

  return {
    scope: 'tooling-support' as const,
    fileKind: 'unknown' as const,
    ownerLayer: 'runtime-qa' as const,
  }
}

function normalizeGateLabel(rawGate: string, scopeLabel: string) {
  const scopedPrefix = `${scopeLabel} `
  if (rawGate.startsWith(scopedPrefix)) {
    return rawGate.slice(scopedPrefix.length).trim()
  }

  return rawGate.trim()
}

function buildFindingFromGateRow({
  screenId,
  scopeLabel,
  scopeType,
  gateRow,
  definition,
  generatedAt,
  screenContext,
}: {
  screenId: string | null
  scopeLabel: string
  scopeType: 'viewport' | 'viewport-stress'
  gateRow: RuntimeQaRawGateRow
  definition: ReturnType<typeof getRuntimeQaGateDefinition>
  generatedAt: string
  screenContext: ReturnType<typeof normalizeScreenContext>
}): AuditFinding {
  const classification =
    gateRow.detail.includes('metadata unavailable') || gateRow.detail.includes('contract audit metadata unavailable')
      ? 'audit-rule-fix'
      : definition.classification
  const confidence = classification === 'audit-rule-fix' ? 'medium' : definition.confidence
  const fingerprint = createFindingFingerprint([
    'runtime-qa',
    screenId,
    scopeType,
    scopeLabel,
    definition.ruleId,
    gateRow.detail,
  ])

  return {
    id: createFindingId('runtime-qa', fingerprint),
    lane: 'runtime-qa',
    ruleId: definition.ruleId,
    title: definition.title,
    category: definition.category,
    subcategory: definition.subcategory,
    severity: definition.severity,
    confidence,
    classification,
    file: null,
    line: null,
    column: null,
    screenId,
    fileKind: screenContext.fileKind,
    scope: screenContext.scope,
    ownerLayer: definition.ownerLayer,
    message: gateRow.detail,
    rationale: `Rendered runtime QA failed the "${definition.gateLabel}" gate for ${scopeLabel}.`,
    evidence: {
      excerpt: gateRow.detail,
      details: [`scopeLabel=${scopeLabel}`, `scopeType=${scopeType}`],
    },
    suggestedFix: definition.suggestedFix,
    suggestedActionType: definition.suggestedActionType,
    autofixable: false,
    suppressed: false,
    suppressionReason: null,
    tags: [screenId ?? 'unknown-screen', scopeType, definition.ruleId, 'runtime-qa'],
    fingerprint,
    firstSeenAt: null,
    lastSeenAt: generatedAt,
    status: 'current',
  }
}

function mapGateRow({
  scopeLabel,
  scopeType,
  gateRow,
  screenId,
  generatedAt,
}: {
  scopeLabel: string
  scopeType: 'viewport' | 'viewport-stress'
  gateRow: RuntimeQaRawGateRow
  screenId: string | null
  generatedAt: string
}): { finding: AuditFinding | null; gateSummary: RuntimeQaScreenGateRow } {
  const gateLabel = normalizeGateLabel(gateRow.gate, scopeLabel)
  const definition = getRuntimeQaGateDefinition(gateLabel)
  const screenContext = normalizeScreenContext(screenId)
  const fingerprint = createFindingFingerprint([
    'runtime-qa',
    screenId,
    scopeType,
    scopeLabel,
    definition.ruleId,
    gateRow.detail,
    gateRow.pass ? 'pass' : 'fail',
  ])
  const classification =
    gateRow.detail.includes('metadata unavailable') || gateRow.detail.includes('contract audit metadata unavailable')
      ? 'audit-rule-fix'
      : definition.classification

  return {
    finding: gateRow.pass
      ? null
      : buildFindingFromGateRow({
          screenId,
          scopeLabel,
          scopeType,
          gateRow,
          definition,
          generatedAt,
          screenContext,
        }),
    gateSummary: {
      scopeLabel,
      scopeType,
      gateLabel,
      ruleId: definition.ruleId,
      title: definition.title,
      category: definition.category,
      subcategory: definition.subcategory,
      pass: gateRow.pass,
      detail: gateRow.detail,
      severity: definition.severity,
      confidence: classification === 'audit-rule-fix' ? 'medium' : definition.confidence,
      classification,
      ownerLayer: definition.ownerLayer,
      evidence: {
        excerpt: gateRow.detail,
        details: [`scopeLabel=${scopeLabel}`, `scopeType=${scopeType}`],
      },
      fingerprint,
    },
  }
}

function countByRule(findings: AuditFinding[]) {
  return findings.reduce<Record<string, number>>((summary, finding) => {
    summary[finding.ruleId] = (summary[finding.ruleId] ?? 0) + 1
    return summary
  }, {})
}

function countByScreen(findings: AuditFinding[]) {
  return findings.reduce<Record<string, number>>((summary, finding) => {
    if (!finding.screenId) {
      return summary
    }

    summary[finding.screenId] = (summary[finding.screenId] ?? 0) + 1
    return summary
  }, {})
}

function countByStatus(screens: RuntimeQaScreenSummary[]) {
  return screens.reduce<Record<string, number>>((summary, screen) => {
    summary[screen.status] = (summary[screen.status] ?? 0) + 1
    return summary
  }, {})
}

function summarizeCoverage(screens: RuntimeQaScreenSummary[]) {
  return screens.reduce(
    (summary, screen) => {
      summary.viewportChecks += screen.coverage.viewportCount
      summary.viewportStressChecks += screen.coverage.viewportStressCount
      summary.screenshots += screen.screenshotRefs.length
      return summary
    },
    {
      viewportChecks: 0,
      viewportStressChecks: 0,
      screenshots: 0,
      stressLabel: 'viewport-stress',
      stressMode: 'css-zoom-approximation',
    },
  )
}

function createMissingScreenSummary(
  indexScreen: RuntimeQaRawIndex['screens'][number] | undefined,
  inputStatus: 'missing' | 'malformed' | 'invalid' | 'failed',
  inputStatusMessage: string | null,
) {
  const screenId = indexScreen?.screenId ?? null
  const screenContext = normalizeScreenContext(screenId)

  return {
    screenId: screenId ?? 'unknown-screen',
    route: indexScreen?.route ?? null,
    generatedAt: indexScreen?.generatedAt ?? null,
    status:
      inputStatus === 'missing'
        ? ('missing-input' as const)
        : inputStatus === 'malformed'
          ? ('malformed' as const)
          : inputStatus === 'invalid'
            ? ('invalid' as const)
            : ('failed' as const),
    scope: screenContext.scope,
    fileKind: screenContext.fileKind,
    ownerLayer: screenContext.ownerLayer,
    findingCount: 0,
    failingGateCount: 0,
    failingGates: [],
    gateRows: [],
    reportPath: indexScreen?.reportPath ?? null,
    screenshotRefs: [],
    coverage: {
      viewportCount: indexScreen?.viewportCount ?? 0,
      viewportStressCount: indexScreen?.viewportStressCount ?? 0,
      stressLabel: indexScreen?.stressLabel ?? 'viewport-stress',
      stressMode: indexScreen?.stressMode ?? 'css-zoom-approximation',
      },
      inputStatus: {
        report: inputStatus,
        message: inputStatusMessage,
      },
    }
}

export async function runRuntimeQaLane({
  runtimeIndexPath = DEFAULT_RUNTIME_INDEX_PATH,
  runtimeReportsDir = DEFAULT_RUNTIME_REPORTS_DIR,
}: {
  runtimeIndexPath?: string
  runtimeReportsDir?: string
} = {}): Promise<RuntimeQaLaneReport> {
  const indexResult = await loadJsonFile<RuntimeQaRawIndex>(runtimeIndexPath, {
    label: 'Runtime QA raw index',
    validate: validateRuntimeIndex,
  })

  const generatedAt = new Date().toISOString()

  if (indexResult.status !== 'ready' || !indexResult.data) {
    return {
      lane: 'runtime-qa',
      generatedAt,
      findings: [],
      auditedFiles: [],
      excludedFiles: [],
      summary: {
        findingCount: 0,
        screenCount: 0,
        byRule: {},
        byScreen: {},
        byStatus: {},
        viewportCoverage: {
          viewportChecks: 0,
          viewportStressChecks: 0,
          screenshots: 0,
          stressLabel: 'viewport-stress',
          stressMode: 'css-zoom-approximation',
        },
      },
      screens: [],
      raw: {
        source: {
          indexPath: runtimeIndexPath,
          reportsDir: runtimeReportsDir,
        },
        inputStatus: {
          index: {
            status: indexResult.status,
            message: indexResult.message,
          },
          reports: [],
        },
      },
      status: indexResult.status === 'missing' ? 'missing-input' : 'failed',
      message: indexResult.message,
    }
  }

  const rawIndex = indexResult.data
  const laneGeneratedAt = rawIndex.generatedAt ?? generatedAt
  const reportStatuses: RuntimeQaLaneReport['raw']['inputStatus']['reports'] = []
  const screens: RuntimeQaScreenSummary[] = []
  const findings: AuditFinding[] = []

  for (const indexScreen of rawIndex.screens ?? []) {
    const reportFileName = path.basename(indexScreen.reportPath ?? '')
    const reportPath = reportFileName ? path.join(runtimeReportsDir, reportFileName) : path.join(runtimeReportsDir, '')
    const reportResult = reportFileName
      ? await loadJsonFile<RuntimeQaRawScreenReport>(reportPath, {
          label: `Runtime QA raw report for ${indexScreen.screenId ?? reportFileName}`,
          validate: validateRuntimeReport,
        })
      : {
          status: 'missing' as const,
          data: null,
          message: `Runtime QA report path is missing for ${indexScreen.screenId ?? 'unknown screen'}.`,
        }

    reportStatuses.push({
      screenId: indexScreen.screenId ?? null,
      reportPath: indexScreen.reportPath ?? null,
      status: reportResult.status,
      message: reportResult.message,
    })

    if (reportResult.status !== 'ready' || !reportResult.data) {
      screens.push(createMissingScreenSummary(indexScreen, reportResult.status, reportResult.message))
      continue
    }

    const report = reportResult.data
    const screenId = report.screenId ?? indexScreen.screenId ?? null
    const screenContext = normalizeScreenContext(screenId)
    const stressChecks = report.viewportStressChecks ?? report.zoomChecks ?? []
    const stressLabel = report.stressLabel ?? 'viewport-stress'
    const stressMode = report.stressMode ?? 'css-zoom-approximation'
    const gateRows: RuntimeQaScreenGateRow[] = []

    for (const viewportCheck of report.viewportChecks ?? []) {
      const scopeLabel = viewportCheck.viewport?.label ?? 'unknown-viewport'
      for (const row of viewportCheck.rows ?? []) {
        const normalized = mapGateRow({
          scopeLabel,
          scopeType: 'viewport',
          gateRow: row,
          screenId,
          generatedAt: laneGeneratedAt,
        })
        gateRows.push(normalized.gateSummary)
        if (normalized.finding) {
          findings.push(normalized.finding)
        }
      }
    }

    for (const stressCheck of stressChecks) {
      const scopeLabel = `${stressLabel} ${stressCheck.zoomState?.label ?? 'unknown-stress'}`
      for (const row of stressCheck.rows ?? []) {
        const normalized = mapGateRow({
          scopeLabel,
          scopeType: 'viewport-stress',
          gateRow: row,
          screenId,
          generatedAt: laneGeneratedAt,
        })
        gateRows.push(normalized.gateSummary)
        if (normalized.finding) {
          findings.push(normalized.finding)
        }
      }
    }

    const screenshotRefs = [
      ...(report.viewportChecks ?? []).map((check) => check.screenshotPath).filter(Boolean),
      ...stressChecks.map((check) => check.screenshotPath).filter(Boolean),
    ] as string[]
    const failingGateRows = gateRows.filter((row) => !row.pass)

    screens.push({
      screenId: screenId ?? 'unknown-screen',
      route: report.route ?? indexScreen.route ?? null,
      generatedAt: report.generatedAt ?? indexScreen.generatedAt ?? null,
      status: failingGateRows.length > 0 ? 'fail' : 'pass',
      scope: screenContext.scope,
      fileKind: screenContext.fileKind,
      ownerLayer: screenContext.ownerLayer,
      findingCount: failingGateRows.length,
      failingGateCount: failingGateRows.length,
      failingGates: failingGateRows.map((row) => row.ruleId),
      gateRows,
      reportPath: indexScreen.reportPath ?? null,
      screenshotRefs,
      coverage: {
        viewportCount: (report.viewportChecks ?? []).length,
        viewportStressCount: stressChecks.length,
        stressLabel,
        stressMode,
      },
      inputStatus: {
        report: 'ready',
        message: null,
      },
    })
  }

  const normalizedFindings = applySuppressions(findings, auditSuppressions)
  const anyReportFailures = reportStatuses.some((reportStatus) => reportStatus.status !== 'ready')
  const laneStatus = anyReportFailures ? ('degraded' as const) : ('ready' as const)
  const laneMessages = reportStatuses.filter((status) => status.status !== 'ready').map((status) => status.message).filter(Boolean) as string[]

  return {
    lane: 'runtime-qa',
    generatedAt: laneGeneratedAt,
    findings: normalizedFindings,
    auditedFiles: [],
    excludedFiles: [],
    summary: {
      findingCount: normalizedFindings.length,
      screenCount: screens.length,
      byRule: countByRule(normalizedFindings),
      byScreen: countByScreen(normalizedFindings),
      byStatus: countByStatus(screens),
      viewportCoverage: summarizeCoverage(screens),
    },
    screens,
    raw: {
      source: {
        indexPath: runtimeIndexPath,
        reportsDir: runtimeReportsDir,
      },
      inputStatus: {
        index: {
          status: indexResult.status,
          message: indexResult.message,
        },
        reports: reportStatuses,
      },
    },
    status: laneStatus,
    message: laneMessages.length > 0 ? laneMessages.join(' ') : null,
  }
}
