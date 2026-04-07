import type { LaneBreakdownItem } from '../policy/findingSchema.ts'
import type { DuplicationLaneReport } from '../lanes/duplication/types.ts'

export function summarizeDuplicationLane(report: DuplicationLaneReport): LaneBreakdownItem {
  return {
    lane: report.lane,
    findingCount: report.findings.length,
    auditedFileCount: report.auditedFiles.length,
    excludedFileCount: report.excludedFiles.length,
    status: report.status,
    message: report.message,
  }
}
