import fs from 'node:fs/promises'
import path from 'node:path'
import type {
  AuditFinding,
  AuditSuiteDiffReport,
  AuditSuiteFindingsReport,
  AuditSuiteScoresReport,
  AuditSuiteSummary,
} from '../policy/findingSchema.ts'
import { AUDIT_SCHEMA_VERSION } from '../policy/findingSchema.ts'
import { REPO_ROOT, toPublicFilePath } from '../core/repoPaths.ts'
import { loadJsonFile } from '../core/jsonLoad.ts'
import { buildRuntimeQaIndexPayload } from '../lanes/runtime-qa/publishHelpers.ts'

const ARTIFACT_QA_DIR = path.join(process.cwd(), 'artifacts', 'qa')
const PUBLIC_AUDIT_DIR = path.join(process.cwd(), 'public', 'v2-audit')

export async function readPreviousAuditSuiteFindings(previousPath = path.join(PUBLIC_AUDIT_DIR, 'audit-suite-findings.json')) {
  const previousReportResult = await loadJsonFile<AuditSuiteFindingsReport>(previousPath, {
    label: 'Previous audit-suite findings report',
    validate(value) {
      if (!value || typeof value !== 'object') {
        return 'expected an object root'
      }

      if (!Array.isArray((value as AuditSuiteFindingsReport).findings)) {
        return 'expected a findings array'
      }

      return null
    },
  })

  if (previousReportResult.status !== 'ready' || !previousReportResult.data) {
    return {
      findings: null,
      status:
        previousReportResult.status === 'missing'
          ? ('missing' as const)
          : previousReportResult.status === 'malformed'
            ? ('malformed' as const)
            : previousReportResult.status === 'invalid'
              ? ('invalid' as const)
              : ('failed' as const),
      message: previousReportResult.message,
      previousGeneratedAt: null,
    }
  }

  return {
    findings: previousReportResult.data.findings ?? null,
    status: 'loaded' as const,
    message: null,
    previousGeneratedAt: previousReportResult.data.generatedAt ?? null,
  }
}

async function ensureOutputDirs() {
  await fs.mkdir(ARTIFACT_QA_DIR, { recursive: true })
  await fs.mkdir(PUBLIC_AUDIT_DIR, { recursive: true })
}

export async function writeAuditJsonPair(fileName: string, payload: unknown) {
  await ensureOutputDirs()
  const artifactPath = path.join(ARTIFACT_QA_DIR, fileName)
  const publicPath = path.join(PUBLIC_AUDIT_DIR, fileName)

  await fs.writeFile(artifactPath, JSON.stringify(payload, null, 2))
  await fs.writeFile(publicPath, JSON.stringify(sanitizePublicPayload(payload), null, 2))

  return { artifactPath, publicPath }
}

function sanitizePublicPayload(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizePublicPayload(item))
  }

  if (!value || typeof value !== 'object') {
    if (typeof value === 'string' && value.startsWith(REPO_ROOT)) {
      return toPublicFilePath(value)
    }
    return value
  }

  return Object.fromEntries(
    Object.entries(value).flatMap(([key, nextValue]) => {
      if (key === 'absolutePath') {
        return []
      }

      return [[key, sanitizePublicPayload(nextValue)]]
    }),
  )
}

export async function publishAuditSuiteOutputs({
  summary,
  scores,
  findings,
  diff,
  resolvedFindings,
  staticDoctrineLane,
  runtimeLane,
  deadCodeLane,
  architectureLane,
  duplicationLane,
  fileInventory,
}: {
  summary: AuditSuiteSummary
  scores: AuditSuiteScoresReport
  findings: AuditFinding[]
  diff: AuditSuiteSummary['diff']
  resolvedFindings: AuditFinding[]
  staticDoctrineLane: unknown
  runtimeLane: unknown
  deadCodeLane: unknown
  architectureLane: unknown
  duplicationLane: unknown
  fileInventory: AuditSuiteSummary['inventory']
}) {
  const findingsPayload: AuditSuiteFindingsReport = {
    generatedAt: summary.generatedAt,
    schemaVersion: AUDIT_SCHEMA_VERSION,
    findings,
    diff,
  }
  const diffPayload: AuditSuiteDiffReport = {
    generatedAt: summary.generatedAt,
    schemaVersion: AUDIT_SCHEMA_VERSION,
    summary: diff,
    resolvedFindings,
  }

  const summaryPaths = await writeAuditJsonPair('audit-suite-summary.json', summary)
  const findingsPaths = await writeAuditJsonPair('audit-suite-findings.json', findingsPayload)
  const diffPaths = await writeAuditJsonPair('audit-suite-diff.json', diffPayload)
  const scoresPaths = await writeAuditJsonPair('audit-suite-scores.json', scores)
  const filesPaths = await writeAuditJsonPair('audit-suite-files.json', fileInventory)
  const staticPaths = await writeAuditJsonPair('static-doctrine-audit.json', staticDoctrineLane)
  const runtimeLanePaths = await writeAuditJsonPair('runtime-qa-lane.json', runtimeLane)
  const runtimeIndexPaths = await writeAuditJsonPair('runtime-index.json', buildRuntimeQaIndexPayload(runtimeLane))
  const deadCodePaths = await writeAuditJsonPair('dead-code-audit.json', deadCodeLane)
  const architecturePaths = await writeAuditJsonPair('architecture-audit.json', architectureLane)
  const duplicationPaths = await writeAuditJsonPair('duplication-audit.json', duplicationLane)

  return {
    summaryPaths,
    findingsPaths,
    diffPaths,
    scoresPaths,
    filesPaths,
    staticPaths,
    runtimeLanePaths,
    runtimeIndexPaths,
    deadCodePaths,
    architecturePaths,
    duplicationPaths,
  }
}
