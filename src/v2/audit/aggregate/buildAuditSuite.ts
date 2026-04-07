import type { AuditFinding, LaneBreakdownItem } from '../policy/findingSchema.ts'
import { buildAuditFileInventory } from '../core/fileInventory.ts'
import { buildAuditSuiteSummary } from '../core/reportSummary.ts'
import { diffFindings } from './diffFindings.ts'
import { scoreAuditSuite } from './scoreAuditSuite.ts'
import { summarizeDeadCodeLane } from './normalizeDeadCode.ts'
import { summarizeDuplicationLane } from './normalizeDuplication.ts'
import { summarizeArchitectureLane } from './normalizeArchitecture.ts'
import { normalizeRuntimeQaLane, summarizeRuntimeQaLane } from './normalizeRuntimeQa.ts'
import { normalizeStaticDoctrineLane, summarizeStaticDoctrineLane } from './normalizeStaticDoctrine.ts'
import { runArchitectureLane } from '../lanes/architecture/runArchitectureLane.ts'
import { runDeadCodeLane } from '../lanes/dead-code/runDeadCodeLane.ts'
import { runDuplicationLane } from '../lanes/duplication/runDuplicationLane.ts'
import { auditSuppressions, summarizeSuppressions } from '../policy/suppressions.ts'
import { readPreviousAuditSuiteFindings } from './publishAuditSuite.ts'

function notImplementedLaneSummary(lane: LaneBreakdownItem['lane']): LaneBreakdownItem {
  return {
    lane,
    findingCount: 0,
    auditedFileCount: 0,
    excludedFileCount: 0,
    status: 'not-implemented',
  }
}

export async function buildAuditSuite() {
  const inventory = await buildAuditFileInventory()
  const staticDoctrineLane = await normalizeStaticDoctrineLane(inventory.auditedFiles)
  const runtimeLane = await normalizeRuntimeQaLane()
  const architectureLane = await runArchitectureLane({
    auditedFiles: inventory.auditedFiles,
    excludedFiles: inventory.excludedFiles,
  })
  const duplicationLane = await runDuplicationLane({
    auditedFiles: inventory.auditedFiles,
    excludedFiles: inventory.excludedFiles,
  })
  const deadCodeLane = await runDeadCodeLane({
    auditedFiles: inventory.auditedFiles,
    excludedFiles: inventory.excludedFiles,
    liveFindings: [
      ...staticDoctrineLane.findings,
      ...runtimeLane.findings,
      ...architectureLane.findings,
      ...duplicationLane.findings,
    ],
  })
  const generatedAt = new Date().toISOString()
  const previousFindingsResult = await readPreviousAuditSuiteFindings()
  const allFindings: AuditFinding[] = [
    ...staticDoctrineLane.findings,
    ...runtimeLane.findings,
    ...architectureLane.findings,
    ...deadCodeLane.findings,
    ...duplicationLane.findings,
  ]
  const suppressionSummary = summarizeSuppressions({
    findings: allFindings,
    suppressions: auditSuppressions,
    staleSuppressionIds: deadCodeLane.raw.staleSuppressions,
  })
  const diffResult = diffFindings(allFindings, previousFindingsResult.findings, generatedAt, {
    status: previousFindingsResult.status,
    message: previousFindingsResult.message,
    previousGeneratedAt: previousFindingsResult.previousGeneratedAt,
  })
  const laneBreakdown = [
    summarizeStaticDoctrineLane(staticDoctrineLane),
    summarizeRuntimeQaLane(runtimeLane),
    summarizeDeadCodeLane(deadCodeLane),
    summarizeArchitectureLane(architectureLane),
    summarizeDuplicationLane(duplicationLane),
  ]
  const scoresReport = scoreAuditSuite({
    generatedAt,
    findings: diffResult.findings,
    laneBreakdown,
    suppressions: suppressionSummary,
  })

  const summary = buildAuditSuiteSummary({
    generatedAt,
    laneBreakdown,
    findings: diffResult.findings,
    auditedFiles: inventory.auditedFiles,
    excludedFiles: inventory.excludedFiles,
    diff: diffResult.diff,
    scores: scoresReport.scores,
    suppressions: suppressionSummary,
    baseline: previousFindingsResult,
  })

  return {
    generatedAt,
    inventory,
    summary,
    scores: scoresReport,
    findings: diffResult.findings,
    diff: diffResult.diff,
    resolvedFindings: diffResult.resolvedFindings,
    staticDoctrineLane,
    runtimeLane,
    architectureLane,
    deadCodeLane,
    duplicationLane,
  }
}
