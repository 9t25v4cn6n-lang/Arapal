import type { LaneBreakdownItem } from '../policy/findingSchema.ts'
import type { DeadCodeLaneReport } from '../lanes/dead-code/types.ts'

export function summarizeDeadCodeLane(report: DeadCodeLaneReport): LaneBreakdownItem {
  return {
    lane: report.lane,
    findingCount: report.findings.length,
    auditedFileCount: report.auditedFiles.length,
    excludedFileCount: report.excludedFiles.length,
    status: report.status,
    message: report.message,
  }
}
