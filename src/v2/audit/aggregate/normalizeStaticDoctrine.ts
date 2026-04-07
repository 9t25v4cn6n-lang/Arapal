import path from 'node:path'
import type { AuditFileInventoryRecord, LaneBreakdownItem } from '../policy/findingSchema.ts'
import { loadJsonFile } from '../core/jsonLoad.ts'
import type { StaticDoctrineLaneReport } from '../lanes/static-doctrine/types.ts'

const STATIC_DOCTRINE_REPORT_PATH = path.join(process.cwd(), 'artifacts', 'qa', 'static-doctrine-audit.json')

function validateStaticDoctrineLaneReport(value: unknown) {
  if (!value || typeof value !== 'object') {
    return 'expected an object root'
  }

  const report = value as Record<string, unknown>
  if (report.lane !== 'static-doctrine') {
    return 'expected lane "static-doctrine"'
  }

  if (!Array.isArray(report.findings)) {
    return 'expected a findings array'
  }

  if (!Array.isArray(report.auditedFiles)) {
    return 'expected an auditedFiles array'
  }

  if (!Array.isArray(report.excludedFiles)) {
    return 'expected an excludedFiles array'
  }

  if (!report.summary || typeof report.summary !== 'object') {
    return 'expected a summary object'
  }

  if (!report.raw || typeof report.raw !== 'object') {
    return 'expected a raw object'
  }

  return null
}

export async function normalizeStaticDoctrineLane(_fileInventory: AuditFileInventoryRecord[]) {
  const laneReportResult = await loadJsonFile<StaticDoctrineLaneReport>(STATIC_DOCTRINE_REPORT_PATH, {
    label: 'Static doctrine lane report',
    validate: validateStaticDoctrineLaneReport,
  })

  if (laneReportResult.status !== 'ready' || !laneReportResult.data) {
    return {
      lane: 'static-doctrine' as const,
      generatedAt: new Date().toISOString(),
      findings: [],
      auditedFiles: [],
      excludedFiles: [],
      raw: null,
      summary: {
        findingCount: 0,
        liveScreenFindingCount: 0,
        sharedFoundationFindingCount: 0,
        byRule: {},
      },
      status: laneReportResult.status === 'missing' ? ('missing-input' as const) : ('failed' as const),
      message: laneReportResult.message,
    }
  }

  return laneReportResult.data
}

export function summarizeStaticDoctrineLane(report: Awaited<ReturnType<typeof normalizeStaticDoctrineLane>>): LaneBreakdownItem {
  return {
    lane: report.lane,
    findingCount: report.findings.length,
    auditedFileCount: report.auditedFiles.length,
    excludedFileCount: report.excludedFiles.length,
    status: report.status,
    message: report.message,
  }
}
