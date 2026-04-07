import type { LaneBreakdownItem } from '../policy/findingSchema.ts'
import { runRuntimeQaLane } from '../lanes/runtime-qa/runRuntimeQaLane.ts'

export async function normalizeRuntimeQaLane() {
  return runRuntimeQaLane()
}

export function summarizeRuntimeQaLane(report: Awaited<ReturnType<typeof normalizeRuntimeQaLane>>): LaneBreakdownItem {
  return {
    lane: report.lane,
    findingCount: report.findings.length,
    auditedFileCount: report.screens.length,
    excludedFileCount: 0,
    status: report.status,
    message: report.message,
  }
}
