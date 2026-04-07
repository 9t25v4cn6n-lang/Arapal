import { createFindingFingerprint, createFindingId } from '../../core/fingerprint.ts'
import { architecturePolicy } from '../../policy/architecturePolicy.ts'
import type {
  AuditFileInventoryRecord,
  AuditFinding,
  AuditScope,
  FindingClassification,
} from '../../policy/findingSchema.ts'
import { applySuppressions, auditSuppressions } from '../../policy/suppressions.ts'
import { getScreenDirFromProjectPath, isProductScope } from '../../policy/scopePolicy.ts'
import { findStronglyConnectedComponents } from './cycleDetection.ts'
import { buildArchitectureGraph } from './graphBuilder.ts'
import type { ArchitectureCycleCluster, ArchitectureLaneReport, ArchitectureLaneSummary, ArchitectureImportEdge } from './types.ts'

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((summary, value) => {
    summary[value] = (summary[value] ?? 0) + 1
    return summary
  }, {})
}

function getScreenIdForRecord(record: AuditFileInventoryRecord | null | undefined) {
  if (!record) {
    return null
  }

  return getScreenDirFromProjectPath(record.file.replace(/^\//, ''))
}

function sameScreenDir(left: AuditFileInventoryRecord, right: AuditFileInventoryRecord) {
  const leftScreenDir = getScreenIdForRecord(left)
  const rightScreenDir = getScreenIdForRecord(right)

  return Boolean(leftScreenDir && rightScreenDir && leftScreenDir === rightScreenDir)
}

function deriveFindingScope(records: AuditFileInventoryRecord[]) {
  if (records.some((record) => record.scope === 'live-product')) {
    return 'live-product' as const
  }

  if (records.some((record) => record.scope === 'shared-product-foundation')) {
    return 'shared-product-foundation' as const
  }

  return (records[0]?.scope ?? 'unknown') as AuditScope
}

function deriveCycleOwnerLayer(records: AuditFileInventoryRecord[]) {
  if (records.some((record) => record.ownerLayer === 'screen')) {
    return 'screen' as const
  }

  if (records.some((record) => record.ownerLayer === 'shared-primitive')) {
    return 'shared-primitive' as const
  }

  if (records.some((record) => record.ownerLayer === 'shared-layout')) {
    return 'shared-layout' as const
  }

  if (records.some((record) => record.ownerLayer === 'token-layer')) {
    return 'token-layer' as const
  }

  if (records.some((record) => record.ownerLayer === 'tooling-support')) {
    return 'tooling-support' as const
  }

  return records[0]?.ownerLayer ?? 'unknown'
}

function buildArchitectureFinding({
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
    'architecture',
    ruleId,
    file,
    line,
    column,
    screenId,
    ...tags,
    evidence.excerpt,
    ...(evidence.details ?? []),
  ])

  return {
    id: createFindingId('architecture', fingerprint),
    lane: 'architecture' as const,
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

function buildGraphMap(edges: ArchitectureImportEdge[]) {
  const graph = new Map<string, Set<string>>()

  for (const edge of edges) {
    const dependencies = graph.get(edge.from.file) ?? new Set<string>()
    dependencies.add(edge.to.file)
    graph.set(edge.from.file, dependencies)
    if (!graph.has(edge.to.file)) {
      graph.set(edge.to.file, new Set<string>())
    }
  }

  return graph
}

function edgeViolatesBoundary(edge: ArchitectureImportEdge) {
  if (
    architecturePolicy.sharedGenericScreenKnowledge.from.includes(edge.from.fileKind) &&
    architecturePolicy.sharedGenericScreenKnowledge.to.includes(edge.to.fileKind)
  ) {
    return true
  }

  return architecturePolicy.boundaries.some((boundary) => {
    if (!boundary.from.includes(edge.from.fileKind) || !boundary.disallow.includes(edge.to.fileKind)) {
      return false
    }

    if (boundary.allowSelfScreenDir && sameScreenDir(edge.from, edge.to)) {
      return false
    }

    return true
  })
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

export async function runArchitectureLane({
  auditedFiles,
  excludedFiles,
}: {
  auditedFiles: AuditFileInventoryRecord[]
  excludedFiles: AuditFileInventoryRecord[]
}): Promise<ArchitectureLaneReport> {
  const generatedAt = new Date().toISOString()

  if (auditedFiles.length === 0 && excludedFiles.length === 0) {
    return {
      lane: 'architecture',
      generatedAt,
      findings: [],
      auditedFiles,
      excludedFiles,
      cycles: [],
      summary: {
        findingCount: 0,
        productFindingCount: 0,
        toolingFindingCount: 0,
        byRule: {},
        byScope: {},
        cycleCount: 0,
        topFiles: [],
      },
      raw: {
        graph: {
          nodeCount: 0,
          edgeCount: 0,
          externalImportCount: 0,
          unresolvedImportCount: 0,
          unresolvedImports: [],
          parsedFileCount: 0,
          fallbackFileCount: 0,
          failedFileCount: 0,
          resolutionMode: architecturePolicy.graph.resolutionMode,
        },
        topViolatingFiles: [],
        productVsTooling: {
          product: 0,
          tooling: 0,
        },
        byRule: {},
      },
      status: 'missing-input',
      message: 'Architecture lane did not receive any inventory files.',
    }
  }

  const allRecords = [...auditedFiles, ...excludedFiles]
  const graphResult = await buildArchitectureGraph(allRecords)
  const findings: AuditFinding[] = []

  for (const boundary of architecturePolicy.boundaries) {
    const matchingEdges = graphResult.edges.filter(
      (edge) => boundary.from.includes(edge.from.fileKind) && boundary.disallow.includes(edge.to.fileKind),
    )

    for (const edge of matchingEdges) {
      if (boundary.allowSelfScreenDir && sameScreenDir(edge.from, edge.to)) {
        continue
      }

      if (
        architecturePolicy.sharedGenericScreenKnowledge.from.includes(edge.from.fileKind) &&
        architecturePolicy.sharedGenericScreenKnowledge.to.includes(edge.to.fileKind)
      ) {
        findings.push(
          buildArchitectureFinding({
            generatedAt,
            ruleId: architecturePolicy.sharedGenericScreenKnowledge.ruleId,
            title: architecturePolicy.sharedGenericScreenKnowledge.title,
            category: 'architecture-hygiene',
            subcategory: 'shared-generic-screen-knowledge',
            severity: architecturePolicy.sharedGenericScreenKnowledge.severity,
            confidence: edge.confidence,
            classification: architecturePolicy.sharedGenericScreenKnowledge.classification,
            file: edge.from.file,
            line: edge.line,
            column: edge.column,
            screenId: getScreenIdForRecord(edge.to),
            fileKind: edge.from.fileKind,
            scope: edge.from.scope,
            ownerLayer: edge.from.ownerLayer,
            message: `${edge.from.file} imports screen-local file ${edge.to.file}.`,
            rationale: architecturePolicy.sharedGenericScreenKnowledge.message,
            evidence: {
              excerpt: edge.specifier,
              details: [`from=${edge.from.file}`, `to=${edge.to.file}`],
            },
            suggestedFix: architecturePolicy.sharedGenericScreenKnowledge.suggestedFix,
            suggestedActionType: 'code-change',
            tags: ['architecture', 'shared-generic-screen-knowledge', edge.from.fileKind, edge.to.fileKind],
          }),
        )
        continue
      }

      findings.push(
        buildArchitectureFinding({
          generatedAt,
          ruleId: boundary.ruleId,
          title: boundary.title,
          category: 'architecture-hygiene',
          subcategory: 'forbidden-import-direction',
          severity: boundary.severity,
          confidence: edge.confidence,
          classification: boundary.classification,
          file: edge.from.file,
          line: edge.line,
          column: edge.column,
          screenId: getScreenIdForRecord(edge.from) ?? getScreenIdForRecord(edge.to),
          fileKind: edge.from.fileKind,
          scope: edge.from.scope,
          ownerLayer: edge.from.ownerLayer,
          message: `${edge.from.file} imports ${edge.to.file}, which violates ${boundary.ruleId}.`,
          rationale: boundary.message,
          evidence: {
            excerpt: edge.specifier,
            details: [`from=${edge.from.file}`, `to=${edge.to.file}`],
          },
          suggestedFix: boundary.suggestedFix,
          suggestedActionType: 'code-change',
          tags: ['architecture', 'forbidden-import-direction', boundary.ruleId, edge.from.fileKind, edge.to.fileKind],
        }),
      )
    }
  }

  const leakageRule = architecturePolicy.productToolingLeakage
  for (const edge of graphResult.edges) {
    if (edgeViolatesBoundary(edge)) {
      continue
    }
    if (!leakageRule.fromScopes.includes(edge.from.scope)) {
      continue
    }
    if (!leakageRule.disallowTargetKinds.includes(edge.to.fileKind)) {
      continue
    }

    findings.push(
      buildArchitectureFinding({
        generatedAt,
        ruleId: leakageRule.ruleId,
        title: leakageRule.title,
        category: 'architecture-hygiene',
        subcategory: 'product-tooling-leakage',
        severity: leakageRule.severity,
        confidence: edge.confidence,
        classification: leakageRule.classification,
        file: edge.from.file,
        line: edge.line,
        column: edge.column,
        screenId: getScreenIdForRecord(edge.from),
        fileKind: edge.from.fileKind,
        scope: edge.from.scope,
        ownerLayer: edge.from.ownerLayer,
        message: `${edge.from.file} pulls tooling-only path ${edge.to.file} into the product dependency graph.`,
        rationale: leakageRule.message,
        evidence: {
          excerpt: edge.specifier,
          details: [`from=${edge.from.file}`, `to=${edge.to.file}`],
        },
        suggestedFix: leakageRule.suggestedFix,
        suggestedActionType: 'code-change',
        tags: ['architecture', 'product-tooling-leakage', edge.from.scope, edge.to.scope],
      }),
    )
  }

  const unknownRule = architecturePolicy.unknownFileKindRisk
  for (const record of allRecords.filter((record) => record.fileKind === 'unknown')) {
    findings.push(
      buildArchitectureFinding({
        generatedAt,
        ruleId: unknownRule.ruleId,
        title: unknownRule.title,
        category: 'architecture-hygiene',
        subcategory: 'unknown-file-kind',
        severity: unknownRule.severity,
        confidence: unknownRule.confidence,
        classification: unknownRule.classification,
        file: record.file,
        line: null,
        column: null,
        screenId: getScreenIdForRecord(record),
        fileKind: record.fileKind,
        scope: record.scope,
        ownerLayer: record.ownerLayer,
        message: `${record.file} is still classified as unknown for architecture checks.`,
        rationale: unknownRule.message,
        evidence: {
          excerpt: record.includeReason,
          details: [`scope=${record.scope}`, `included=${record.included}`],
        },
        suggestedFix: unknownRule.suggestedFix,
        suggestedActionType: 'review',
        tags: ['architecture', 'unknown-file-kind', record.scope],
      }),
    )
  }

  const graph = buildGraphMap(graphResult.edges)
  const recordByFile = new Map(allRecords.map((record) => [record.file, record]))
  const cycleClusters: ArchitectureCycleCluster[] = findStronglyConnectedComponents(graph).map((members) => {
    const memberRecords = members.map((member) => recordByFile.get(member)).filter(Boolean) as AuditFileInventoryRecord[]
    return {
      fingerprint: createFindingFingerprint(['architecture', 'dependency-cycle', ...members]),
      members,
      scope: deriveFindingScope(memberRecords),
      productScope: memberRecords.some((record) => isProductScope(record.scope)),
    }
  })

  for (const cycle of cycleClusters) {
    const memberRecords = cycle.members.map((member) => recordByFile.get(member)).filter(Boolean) as AuditFileInventoryRecord[]
    const anchorRecord = memberRecords[0]
    const cycleRule = architecturePolicy.dependencyCycle
    findings.push(
      buildArchitectureFinding({
        generatedAt,
        ruleId: cycleRule.ruleId,
        title: cycleRule.title,
        category: 'architecture-hygiene',
        subcategory: 'dependency-cycle',
        severity: cycle.productScope ? 'error' : cycleRule.severity,
        confidence: cycleRule.confidence,
        classification: cycleRule.classification,
        file: anchorRecord?.file ?? cycle.members[0] ?? null,
        line: null,
        column: null,
        screenId: getScreenIdForRecord(anchorRecord),
        fileKind: anchorRecord?.fileKind ?? 'unknown',
        scope: cycle.scope,
        ownerLayer: deriveCycleOwnerLayer(memberRecords),
        message: `Dependency cycle detected across ${cycle.members.length} file(s).`,
        rationale: cycleRule.message,
        evidence: {
          excerpt: cycle.members.join(' -> '),
          details: cycle.members,
        },
        suggestedFix: cycleRule.suggestedFix,
        suggestedActionType: 'code-change',
        tags: ['architecture', 'dependency-cycle', cycle.productScope ? 'product' : 'tooling'],
      }),
    )
  }

  const normalizedFindings = applySuppressions(findings, auditSuppressions)
  const topFiles = summarizeTopFiles(normalizedFindings)
  const summary: ArchitectureLaneSummary = {
    findingCount: normalizedFindings.length,
    productFindingCount: normalizedFindings.filter((finding) => isProductScope(finding.scope)).length,
    toolingFindingCount: normalizedFindings.filter((finding) => !isProductScope(finding.scope)).length,
    byRule: countBy(normalizedFindings.map((finding) => finding.ruleId)),
    byScope: countBy(normalizedFindings.map((finding) => finding.scope)),
    cycleCount: cycleClusters.length,
    topFiles,
  }

  const raw = {
    graph: {
      nodeCount: graphResult.nodeCount,
      edgeCount: graphResult.edges.length,
      externalImportCount: graphResult.externalImportCount,
      unresolvedImportCount: graphResult.unresolvedImports.length,
      unresolvedImports: graphResult.unresolvedImports,
      parsedFileCount: graphResult.parsedFileCount,
      fallbackFileCount: graphResult.fallbackFileCount,
      failedFileCount: graphResult.failedFileCount,
      resolutionMode: architecturePolicy.graph.resolutionMode,
    },
    topViolatingFiles: topFiles,
    productVsTooling: {
      product: summary.productFindingCount,
      tooling: summary.toolingFindingCount,
    },
    byRule: summary.byRule,
  }

  return {
    lane: 'architecture',
    generatedAt,
    findings: normalizedFindings,
    auditedFiles,
    excludedFiles,
    cycles: cycleClusters,
    summary,
    raw,
    status: graphResult.status,
    message: graphResult.message,
  }
}
