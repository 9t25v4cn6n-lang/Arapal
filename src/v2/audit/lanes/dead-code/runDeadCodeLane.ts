import fs from 'node:fs/promises'
import path from 'node:path'
import { buildArchitectureGraph } from '../architecture/graphBuilder.ts'
import { createFindingFingerprint, createFindingId } from '../../core/fingerprint.ts'
import { architecturePolicy } from '../../policy/architecturePolicy.ts'
import type {
  AuditFileInventoryRecord,
  AuditFinding,
  FindingClassification,
} from '../../policy/findingSchema.ts'
import type { AuditSuppression } from '../../policy/suppressions.ts'
import { applySuppressions, auditSuppressions, matchesSuppression } from '../../policy/suppressions.ts'
import { getScreenDirFromProjectPath, isProductScope, scopePolicy } from '../../policy/scopePolicy.ts'
import { analyzeDeadCodeFiles, buildImportedNameUsage } from './usageCollector.ts'
import { deadCodePolicy, isStandaloneAllowed } from './policy.ts'
import type { DeadCodeLaneReport, DeadCodeScopeUsage } from './types.ts'

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((summary, value) => {
    summary[value] = (summary[value] ?? 0) + 1
    return summary
  }, {})
}

function collectClosure(entryRoots: Set<string>, outgoing: Map<string, import('../architecture/types.ts').ArchitectureImportEdge[]>) {
  const visited = new Set<string>()
  const queue = [...entryRoots]

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current || visited.has(current)) {
      continue
    }

    visited.add(current)
    for (const edge of outgoing.get(current) ?? []) {
      if (!visited.has(edge.to.file)) {
        queue.push(edge.to.file)
      }
    }
  }

  return visited
}

function getScreenId(record: AuditFileInventoryRecord | null | undefined) {
  if (!record) {
    return null
  }

  return getScreenDirFromProjectPath(record.file.replace(/^\//, ''))
}

function createDeadCodeFinding({
  generatedAt,
  ruleId,
  title,
  category,
  subcategory,
  severity,
  confidence,
  classification,
  file,
  line,
  column,
  screenId,
  fileKind,
  scope,
  ownerLayer,
  message,
  rationale,
  evidence,
  suggestedFix,
  suggestedActionType,
  tags,
}: {
  generatedAt: string
  ruleId: string
  title: string
  category: string
  subcategory: string | null
  severity: AuditFinding['severity']
  confidence: AuditFinding['confidence']
  classification: FindingClassification
  file: string | null
  line: number | null
  column: number | null
  screenId: string | null
  fileKind: AuditFinding['fileKind']
  scope: AuditFinding['scope']
  ownerLayer: AuditFinding['ownerLayer']
  message: string
  rationale: string
  evidence: AuditFinding['evidence']
  suggestedFix: string | null
  suggestedActionType: string | null
  tags: string[]
}) {
  const fingerprint = createFindingFingerprint([
    'dead-code',
    ruleId,
    file,
    line,
    column,
    ...tags,
    evidence.excerpt,
    ...(evidence.details ?? []),
  ])

  return {
    id: createFindingId('dead-code', fingerprint),
    lane: 'dead-code' as const,
    ruleId,
    title,
    category,
    subcategory,
    severity,
    confidence,
    classification,
    file,
    line,
    column,
    screenId,
    fileKind,
    scope,
    ownerLayer,
    message,
    rationale,
    evidence,
    suggestedFix,
    suggestedActionType,
    autofixable: false,
    suppressed: false,
    suppressionReason: null,
    tags,
    fingerprint,
    firstSeenAt: null,
    lastSeenAt: generatedAt,
    status: 'current' as const,
  }
}

function summarizeTopFiles(findings: AuditFinding[]) {
  return Object.entries(
    findings.reduce<Record<string, number>>((summary, finding) => {
      if (finding.file) {
        summary[finding.file] = (summary[finding.file] ?? 0) + 1
      }
      return summary
    }, {}),
  )
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 8)
    .map(([file, count]) => ({ file, count }))
}

async function configuredPathExists(projectPath: string) {
  const normalized = projectPath.startsWith('/') ? projectPath.slice(1) : projectPath
  try {
    await fs.access(path.join(process.cwd(), normalized))
    return true
  } catch {
    return false
  }
}

async function findStaleConfigPaths() {
  const candidates = new Set<string>()

  scopePolicy.liveProductScreenDirs.forEach((screenDir) => candidates.add(`src/v2/screens/${screenDir}`))
  scopePolicy.ignoredScreenDirs.forEach((screenDir) => candidates.add(`src/v2/screens/${screenDir}`))
  scopePolicy.sharedFoundationIncludeRoots.forEach((entry) => candidates.add(entry))
  scopePolicy.sharedFoundationExcludedPaths.forEach((entry) => candidates.add(entry.replace(/\/$/, '')))
  scopePolicy.topLevelFrameworkAdapterPaths.forEach((entry) => candidates.add(entry))
  scopePolicy.dashboardRoots.forEach((entry) => candidates.add(entry))
  scopePolicy.debugRoots.forEach((entry) => candidates.add(entry))
  scopePolicy.labRoots.forEach((entry) => candidates.add(entry))
  scopePolicy.labPaths.forEach((entry) => candidates.add(entry))
  scopePolicy.toolingSupportRoots.forEach((entry) => candidates.add(entry))
  scopePolicy.frameworkAdapterPaths.forEach((entry) => candidates.add(entry))

  const missingPaths: string[] = []
  for (const candidate of [...candidates].sort()) {
    if (!(await configuredPathExists(candidate))) {
      missingPaths.push(`/${candidate}`)
    }
  }

  return missingPaths
}

function createScopeUsage({
  auditedFiles,
  outgoing,
}: {
  auditedFiles: AuditFileInventoryRecord[]
  outgoing: Map<string, import('../architecture/types.ts').ArchitectureImportEdge[]>
}): DeadCodeScopeUsage {
  const auditedFileSet = new Set(auditedFiles.map((record) => record.file))
  const productRoots = new Set(deadCodePolicy.productEntryPaths.filter((file) => auditedFileSet.has(file)))
  const toolingRoots = new Set(deadCodePolicy.toolingEntryPaths.filter((file) => auditedFileSet.has(file)))
  const productClosure = collectClosure(productRoots, outgoing)
  const toolingClosure = collectClosure(toolingRoots, outgoing)
  const combinedClosure = new Set([...productClosure, ...toolingClosure])

  return {
    productRoots,
    toolingRoots,
    productClosure,
    toolingClosure,
    combinedClosure,
  }
}

export async function runDeadCodeLane({
  auditedFiles,
  excludedFiles,
  liveFindings = [],
  suppressions = auditSuppressions,
}: {
  auditedFiles: AuditFileInventoryRecord[]
  excludedFiles: AuditFileInventoryRecord[]
  liveFindings?: AuditFinding[]
  suppressions?: AuditSuppression[]
}): Promise<DeadCodeLaneReport> {
  const generatedAt = new Date().toISOString()

  if (auditedFiles.length === 0 && excludedFiles.length === 0) {
    return {
      lane: 'dead-code',
      generatedAt,
      findings: [],
      auditedFiles,
      excludedFiles,
      summary: {
        findingCount: 0,
        productFindingCount: 0,
        toolingFindingCount: 0,
        byRule: {},
        byScope: {},
        topFiles: [],
      },
      raw: {
        usage: {
          entryRoots: {
            product: [],
            tooling: [],
          },
          closure: {
            product: [],
            tooling: [],
            combined: [],
          },
          graphStatus: 'missing-input',
          resolutionMode: architecturePolicy.graph.resolutionMode,
          unresolvedImportCount: 0,
          unresolvedImports: [],
          parsedFileCount: 0,
          fallbackFileCount: 0,
          failedFileCount: 0,
        },
        staleSuppressions: [],
        staleConfig: [],
        productVsTooling: {
          product: 0,
          tooling: 0,
        },
        byRule: {},
        topCandidateFiles: [],
      },
      status: 'missing-input',
      message: 'Dead-code lane did not receive any inventory files.',
    }
  }

  const allRecords = [...auditedFiles, ...excludedFiles]
  const graphResult = await buildArchitectureGraph(allRecords)
  const usage = createScopeUsage({
    auditedFiles,
    outgoing: graphResult.outgoing,
  })
  const analyses = await analyzeDeadCodeFiles(auditedFiles)
  const importedNameUsage = buildImportedNameUsage(graphResult.edges)
  const findings: AuditFinding[] = []
  const graphDegraded = graphResult.status !== 'ready'
  const coverageConfidence = graphDegraded ? 'medium' : 'high'
  const unusedFileCandidates = new Set<string>()

  for (const record of auditedFiles) {
    if (deadCodePolicy.skipUnusedFileKinds.includes(record.fileKind as any)) {
      continue
    }
    if (isStandaloneAllowed(record.file)) {
      continue
    }

    const isUsed = usage.combinedClosure.has(record.file) || usage.productRoots.has(record.file) || usage.toolingRoots.has(record.file)
    if (isUsed) {
      continue
    }

    unusedFileCandidates.add(record.file)
    findings.push(
      createDeadCodeFinding({
        generatedAt,
        ruleId: 'unused-file',
        title: 'Unused file candidate',
        category: 'dead-code-hygiene',
        subcategory: 'unused-file',
        severity: isProductScope(record.scope) ? 'warn' : 'info',
        confidence: coverageConfidence,
        classification: graphDegraded ? 'low-confidence-review' : 'real-code-fix',
        file: record.file,
        line: null,
        column: null,
        screenId: getScreenId(record),
        fileKind: record.fileKind,
        scope: record.scope,
        ownerLayer: record.ownerLayer,
        message: `${record.file} is not reachable from the configured product or tooling entry roots.`,
        rationale: 'Dead files create misleading repo noise and make the system harder to trust.',
        evidence: {
          excerpt: record.includeReason,
          details: [`scope=${record.scope}`, `usedByLiveProduct=${String(record.usedByLiveProduct)}`],
        },
        suggestedFix: 'Delete the file if it is truly unused, or wire it into an explicit entry/closure if it is intentionally standalone.',
        suggestedActionType: 'review',
        tags: ['dead-code', 'unused-file', record.scope, record.fileKind],
      }),
    )
  }

  for (const analysis of analyses.values()) {
    const record = analysis.record
    if (deadCodePolicy.skipUnusedExportKinds.includes(record.fileKind as any)) {
      continue
    }
    if (unusedFileCandidates.has(record.file)) {
      continue
    }
    if (usage.productRoots.has(record.file) || usage.toolingRoots.has(record.file)) {
      continue
    }
    if (!usage.combinedClosure.has(record.file)) {
      continue
    }
    if (analysis.parseMode !== 'ast' || analysis.exports.length === 0 || analysis.hasWildcardExport || analysis.hasReExportFromSource) {
      continue
    }

    const importUsage = importedNameUsage.get(record.file)
    if (!importUsage || importUsage.hasWildcardUsage || importUsage.hasSideEffectUsage) {
      continue
    }

    const importedNames = importUsage.importedNames
    for (const exported of analysis.exports) {
      if (importedNames.has(exported.name)) {
        continue
      }

      findings.push(
        createDeadCodeFinding({
          generatedAt,
          ruleId: 'unused-export',
          title: 'Unused export candidate',
          category: 'dead-code-hygiene',
          subcategory: 'unused-export',
          severity: isProductScope(record.scope) ? 'warn' : 'info',
          confidence: coverageConfidence,
          classification: graphDegraded ? 'low-confidence-review' : 'real-code-fix',
          file: record.file,
          line: exported.line,
          column: exported.column,
          screenId: getScreenId(record),
          fileKind: record.fileKind,
          scope: record.scope,
          ownerLayer: record.ownerLayer,
          message: `Export "${exported.name}" from ${record.file} is never imported by the audited repo graph.`,
          rationale: 'Unused exports make shared files look busier than they really are and hide real ownership.',
          evidence: {
            excerpt: exported.name,
            details: [`importers=${importUsage.importerFiles.size}`, `parseMode=${analysis.parseMode}`],
          },
          suggestedFix: 'Remove the unused export or move it behind a file that is explicitly meant to be standalone.',
          suggestedActionType: 'review',
          tags: ['dead-code', 'unused-export', record.scope, exported.kind],
        }),
      )
    }
  }

  for (const suppression of suppressions) {
    if (liveFindings.some((finding) => matchesSuppression(finding, suppression))) {
      continue
    }

    findings.push(
      createDeadCodeFinding({
        generatedAt,
        ruleId: 'stale-suppression',
        title: 'Stale suppression',
        category: 'dead-code-hygiene',
        subcategory: 'stale-suppression',
        severity: 'warn',
        confidence: 'high',
        classification: 'audit-rule-fix',
        file: suppression.file ?? '/src/v2/audit/policy/suppressions.ts',
        line: null,
        column: null,
        screenId: null,
        fileKind: 'audit-suite',
        scope: 'tooling-support',
        ownerLayer: 'audit-framework',
        message: `Suppression "${suppression.id}" no longer matches any current finding.`,
        rationale: 'Stale suppressions hide audit drift and make the suite harder to trust.',
        evidence: {
          excerpt: suppression.reason,
          details: [
            `lane=${suppression.lane ?? '*'}`,
            `ruleId=${suppression.ruleId ?? '*'}`,
            `fingerprint=${suppression.fingerprint ?? '*'}`,
          ],
        },
        suggestedFix: 'Delete the stale suppression or retarget it to a current finding if it is still needed.',
        suggestedActionType: 'config-change',
        tags: ['dead-code', 'stale-suppression'],
      }),
    )
  }

  const staleConfigPaths = await findStaleConfigPaths()
  for (const missingPath of staleConfigPaths) {
    findings.push(
      createDeadCodeFinding({
        generatedAt,
        ruleId: 'stale-audit-config',
        title: 'Stale audit config path',
        category: 'dead-code-hygiene',
        subcategory: 'stale-config',
        severity: 'warn',
        confidence: 'high',
        classification: 'audit-rule-fix',
        file: deadCodePolicy.staleConfigPath,
        line: null,
        column: null,
        screenId: null,
        fileKind: 'audit-suite',
        scope: 'tooling-support',
        ownerLayer: 'audit-framework',
        message: `${missingPath} is still referenced by executable audit scope config but no longer exists.`,
        rationale: 'Dead config paths create misleading audit behavior and stale review assumptions.',
        evidence: {
          excerpt: missingPath,
          details: ['source=scopePolicy'],
        },
        suggestedFix: 'Remove the stale path from audit scope config or restore the target if it is still intentional.',
        suggestedActionType: 'config-change',
        tags: ['dead-code', 'stale-audit-config'],
      }),
    )
  }

  const normalizedFindings = applySuppressions(findings, suppressions)
  const topFiles = summarizeTopFiles(normalizedFindings)

  return {
    lane: 'dead-code',
    generatedAt,
    findings: normalizedFindings,
    auditedFiles,
    excludedFiles,
    summary: {
      findingCount: normalizedFindings.length,
      productFindingCount: normalizedFindings.filter((finding) => isProductScope(finding.scope)).length,
      toolingFindingCount: normalizedFindings.filter((finding) => !isProductScope(finding.scope)).length,
      byRule: countBy(normalizedFindings.map((finding) => finding.ruleId)),
      byScope: countBy(normalizedFindings.map((finding) => finding.scope)),
      topFiles,
    },
    raw: {
      usage: {
        entryRoots: {
          product: [...usage.productRoots].sort(),
          tooling: [...usage.toolingRoots].sort(),
        },
        closure: {
          product: [...usage.productClosure].sort(),
          tooling: [...usage.toolingClosure].sort(),
          combined: [...usage.combinedClosure].sort(),
        },
        graphStatus: graphResult.status,
        resolutionMode: architecturePolicy.graph.resolutionMode,
        unresolvedImportCount: graphResult.unresolvedImports.length,
        unresolvedImports: graphResult.unresolvedImports.map((issue) => ({
          file: issue.file,
          specifier: issue.specifier,
          kind: issue.kind,
          message: issue.message,
        })),
        parsedFileCount: graphResult.parsedFileCount,
        fallbackFileCount: graphResult.fallbackFileCount,
        failedFileCount: graphResult.failedFileCount,
      },
      staleSuppressions: suppressions
        .filter((suppression) => !liveFindings.some((finding) => matchesSuppression(finding, suppression)))
        .map((suppression) => suppression.id),
      staleConfig: staleConfigPaths,
      productVsTooling: {
        product: normalizedFindings.filter((finding) => isProductScope(finding.scope)).length,
        tooling: normalizedFindings.filter((finding) => !isProductScope(finding.scope)).length,
      },
      byRule: countBy(normalizedFindings.map((finding) => finding.ruleId)),
      topCandidateFiles: topFiles,
    },
    status: graphResult.status,
    message: graphResult.message,
  }
}
