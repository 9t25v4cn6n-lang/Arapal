import type { LaneBreakdownItem } from '../policy/findingSchema.ts'
import type { ArchitectureLaneReport } from '../lanes/architecture/types.ts'

export function summarizeArchitectureLane(report: ArchitectureLaneReport): LaneBreakdownItem {
  return {
    lane: report.lane,
    findingCount: report.findings.length,
    auditedFileCount: report.auditedFiles.length,
    excludedFileCount: report.excludedFiles.length,
    status: report.status,
    message: report.message,
  }
}
