import { applySuppressions, auditSuppressions } from '../../policy/suppressions.ts'
import type {
  AuditFileInventoryRecord,
  AuditFinding,
  FindingClassification,
} from '../../policy/findingSchema.ts'
import { isProductScope } from '../../policy/scopePolicy.ts'
import { duplicationPolicy } from './policy.ts'
import {
  analyzeDuplicationFile,
  isVariantEligibleOccurrence,
} from './collectors.ts'
import {
  buildDuplicationFinding,
  countTopFilesFromClusters,
  deriveClusterOwnerLayer,
  deriveClusterScope,
} from './signatureHelpers.ts'
import type {
  DuplicationClusterSummary,
  DuplicationLaneReport,
  DuplicationOccurrence,
  DuplicationQualityBucket,
} from './types.ts'

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((summary, value) => {
    summary[value] = (summary[value] ?? 0) + 1
    return summary
  }, {})
}

function partitionByScopeBucket(occurrences: DuplicationOccurrence[]) {
  const product = occurrences.filter((occurrence) => isProductScope(occurrence.scope))
  const tooling = occurrences.filter((occurrence) => !isProductScope(occurrence.scope))

  return [
    { bucket: 'product' as const, occurrences: product },
    { bucket: 'tooling' as const, occurrences: tooling },
  ].filter((entry) => new Set(entry.occurrences.map((occurrence) => occurrence.file)).size > 0)
}

function countDistinct(values: string[]) {
  return new Set(values).size
}

function summarizeCluster({
  ruleId,
  quality,
  occurrences,
}: {
  ruleId: DuplicationClusterSummary['ruleId']
  quality: DuplicationQualityBucket
  occurrences: DuplicationOccurrence[]
}): DuplicationClusterSummary {
  const files = [...new Set(occurrences.map((occurrence) => occurrence.file))].sort()

  return {
    ruleId,
    scope: deriveClusterScope(occurrences),
    quality,
    fileCount: files.length,
    occurrenceCount: occurrences.length,
    distinctSignatureCount: countDistinct(occurrences.map((occurrence) => occurrence.signature)),
    files,
    representativeFile: files[0] ?? null,
  }
}

function determineQuality(fileCount: number, ownerLayer: AuditFinding['ownerLayer']) {
  if ((ownerLayer === 'shared-primitive' || ownerLayer === 'shared-layout') && fileCount >= 3) {
    return 'likely-technical-debt' as const
  }

  return 'candidate-extraction' as const
}

function mapQualityToClassification(quality: DuplicationQualityBucket): FindingClassification {
  if (quality === 'likely-technical-debt') {
    return 'real-code-fix'
  }

  if (quality === 'candidate-extraction') {
    return 'doctrine-decision-needed'
  }

  return 'low-confidence-review'
}

function createClusterEvidence(cluster: DuplicationClusterSummary, occurrences: DuplicationOccurrence[], details: string[] = []) {
  return {
    excerpt: occurrences[0]?.excerpt ?? null,
    details: [
      `quality=${cluster.quality}`,
      `files=${cluster.fileCount}`,
      `occurrences=${cluster.occurrenceCount}`,
      `distinctSignatures=${cluster.distinctSignatureCount}`,
      ...cluster.files.slice(0, 6).map((file) => `file=${file}`),
      ...details,
    ],
  }
}

function maybePushExactClusterFindings({
  generatedAt,
  occurrences,
  minUniqueFiles,
  ruleId,
  title,
  category,
  subcategory,
  rationale,
  suggestedFix,
  findings,
  clusters,
}: {
  generatedAt: string
  occurrences: DuplicationOccurrence[]
  minUniqueFiles: number
  ruleId: DuplicationClusterSummary['ruleId']
  title: string
  category: string
  subcategory: string
  rationale: string
  suggestedFix: string
  findings: AuditFinding[]
  clusters: DuplicationClusterSummary[]
}) {
  const bySignature = new Map<string, DuplicationOccurrence[]>()
  for (const occurrence of occurrences) {
    const current = bySignature.get(occurrence.signature) ?? []
    current.push(occurrence)
    bySignature.set(occurrence.signature, current)
  }

  for (const clusterOccurrences of bySignature.values()) {
    for (const scoped of partitionByScopeBucket(clusterOccurrences)) {
      const uniqueFiles = [...new Set(scoped.occurrences.map((occurrence) => occurrence.file))]
      if (uniqueFiles.length < minUniqueFiles) {
        continue
      }

      const ownerLayer = deriveClusterOwnerLayer(scoped.occurrences)
      const quality = determineQuality(uniqueFiles.length, ownerLayer)
      const cluster = summarizeCluster({ ruleId, quality, occurrences: scoped.occurrences })
      clusters.push(cluster)

      findings.push(
        buildDuplicationFinding({
          generatedAt,
          ruleId,
          title,
          category,
          subcategory,
          severity: quality === 'likely-technical-debt' ? 'warn' : 'info',
          confidence: 'high',
          classification: mapQualityToClassification(quality),
          occurrences: scoped.occurrences,
          message: `${cluster.fileCount} files repeat the same ${cluster.occurrenceCount}-occurrence pattern.`,
          rationale,
          evidence: createClusterEvidence(cluster, scoped.occurrences, [
            `propertyNames=${[...new Set(scoped.occurrences.flatMap((occurrence) => occurrence.propertyNames))].join(',')}`,
          ]),
          suggestedFix,
          quality,
          tags: ['duplication', ruleId, quality, scoped.bucket],
        }),
      )
    }
  }
}

function maybePushVariantDriftFindings({
  generatedAt,
  styleOccurrences,
  findings,
  clusters,
}: {
  generatedAt: string
  styleOccurrences: DuplicationOccurrence[]
  findings: AuditFinding[]
  clusters: DuplicationClusterSummary[]
}) {
  const byFamily = new Map<string, DuplicationOccurrence[]>()

  for (const occurrence of styleOccurrences.filter(isVariantEligibleOccurrence)) {
    if (occurrence.propertyNames.length < duplicationPolicy.variantDrift.minPropertyCount) {
      continue
    }

    const current = byFamily.get(occurrence.familySignature) ?? []
    current.push(occurrence)
    byFamily.set(occurrence.familySignature, current)
  }

  for (const familyOccurrences of byFamily.values()) {
    for (const scoped of partitionByScopeBucket(familyOccurrences)) {
      const uniqueFiles = [...new Set(scoped.occurrences.map((occurrence) => occurrence.file))]
      const distinctSignatures = countDistinct(scoped.occurrences.map((occurrence) => occurrence.signature))
      if (
        uniqueFiles.length < duplicationPolicy.variantDrift.minUniqueFiles ||
        distinctSignatures < duplicationPolicy.variantDrift.minDistinctSignatures
      ) {
        continue
      }

      const quality =
        uniqueFiles.length >= 3 ? ('candidate-extraction' as const) : ('harmless-repetition' as const)
      const cluster = summarizeCluster({
        ruleId: 'shared-primitive-variant-drift',
        quality,
        occurrences: scoped.occurrences,
      })
      clusters.push(cluster)

      findings.push(
        buildDuplicationFinding({
          generatedAt,
          ruleId: 'shared-primitive-variant-drift',
          title: 'Shared primitive variant drift',
          category: 'duplication-hygiene',
          subcategory: 'variant-drift',
          severity: uniqueFiles.length >= 3 ? 'warn' : 'info',
          confidence: uniqueFiles.length >= 3 ? 'medium' : 'low',
          classification: uniqueFiles.length >= 3 ? 'doctrine-decision-needed' : 'low-confidence-review',
          occurrences: scoped.occurrences,
          message: `${uniqueFiles.length} shared foundation files use the same style family with ${distinctSignatures} bespoke literal bundles.`,
          rationale:
            'Shared foundation files should not solve the same presentational problem with slightly different bespoke bundles unless that variation is intentionally named.',
          evidence: createClusterEvidence(cluster, scoped.occurrences, [
            `distinctBundleCount=${distinctSignatures}`,
            `family=${scoped.occurrences[0]?.familySignature ?? 'unknown'}`,
          ]),
          suggestedFix: 'Either promote the family into a named shared variant or collapse the slightly different bundles into one documented preset.',
          quality,
          tags: ['duplication', 'shared-primitive-variant-drift', quality, scoped.bucket],
        }),
      )
    }
  }
}

export async function runDuplicationLane({
  auditedFiles,
  excludedFiles,
}: {
  auditedFiles: AuditFileInventoryRecord[]
  excludedFiles: AuditFileInventoryRecord[]
}): Promise<DuplicationLaneReport> {
  const generatedAt = new Date().toISOString()

  if (auditedFiles.length === 0 && excludedFiles.length === 0) {
    return {
      lane: 'duplication',
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
        clusterCount: 0,
        topFiles: [],
      },
      raw: {
        clusters: [],
        productVsTooling: {
          product: 0,
          tooling: 0,
        },
        byRule: {},
        topRepeatedFiles: [],
        parse: {
          parsedFileCount: 0,
          fallbackFileCount: 0,
          failedFileCount: 0,
        },
      },
      status: 'missing-input',
      message: 'Duplication lane did not receive any inventory files.',
    }
  }

  const analyses = await Promise.all(auditedFiles.map((record) => analyzeDuplicationFile(record)))
  const findings: AuditFinding[] = []
  const clusters: DuplicationClusterSummary[] = []
  const styleOccurrences = analyses.flatMap((analysis) => analysis.occurrences.filter((occurrence) => occurrence.ruleId === 'repeated-style-bundle'))
  const shellMathOccurrences = analyses.flatMap((analysis) =>
    analysis.occurrences.filter((occurrence) => occurrence.ruleId === 'repeated-shell-math'),
  )
  const contractOccurrences = analyses.flatMap((analysis) =>
    analysis.occurrences.filter((occurrence) => occurrence.ruleId === 'repeated-contract-fragment'),
  )

  maybePushExactClusterFindings({
    generatedAt,
    occurrences: styleOccurrences,
    minUniqueFiles: duplicationPolicy.styleBundle.minUniqueFiles,
    ruleId: 'repeated-style-bundle',
    title: 'Repeated style bundle',
    category: 'duplication-hygiene',
    subcategory: 'style-bundle',
    rationale:
      'When the same surface or chrome bundle appears across files, it usually wants a named variant, tokenized preset, or shared primitive treatment.',
    suggestedFix: 'Promote the repeated bundle into a named shared variant, tokenized preset, or shared primitive surface helper.',
    findings,
    clusters,
  })

  maybePushExactClusterFindings({
    generatedAt,
    occurrences: shellMathOccurrences,
    minUniqueFiles: duplicationPolicy.shellMath.minUniqueFiles,
    ruleId: 'repeated-shell-math',
    title: 'Repeated shell math',
    category: 'duplication-hygiene',
    subcategory: 'shell-math',
    rationale:
      'Repeated shell formulas usually mean the same layout ownership decision is being solved in multiple places instead of being owned once by shared layout code.',
    suggestedFix: 'Move the repeated formula into shared shell/layout ownership or collapse it into one named helper instead of repeating the bespoke math.',
    findings,
    clusters,
  })

  maybePushExactClusterFindings({
    generatedAt,
    occurrences: contractOccurrences,
    minUniqueFiles: duplicationPolicy.contractFragment.minUniqueFiles,
    ruleId: 'repeated-contract-fragment',
    title: 'Repeated contract fragment',
    category: 'duplication-hygiene',
    subcategory: 'contract-fragment',
    rationale:
      'When the same container fragment is copied across multiple contracts, it usually wants a shared contract helper or a more explicit generic container role.',
    suggestedFix: 'Extract the repeated contract fragment into a shared helper or promote the structural role into an existing generic contract helper.',
    findings,
    clusters,
  })

  maybePushVariantDriftFindings({
    generatedAt,
    styleOccurrences,
    findings,
    clusters,
  })

  const normalizedFindings = applySuppressions(findings, auditSuppressions)
  const parsedFileCount = analyses.filter((analysis) => analysis.parseMode === 'ast').length
  const fallbackFileCount = analyses.filter((analysis) => analysis.parseMode === 'fallback').length
  const failedFileCount = analyses.filter((analysis) => analysis.parseError && analysis.parseError !== 'Missing absolute path.').length
  const topFiles = countTopFilesFromClusters(clusters)
  const status = fallbackFileCount > 0 ? 'degraded' : 'ready'
  const message =
    fallbackFileCount > 0
      ? `Duplication lane fell back on ${fallbackFileCount} file(s); low-confidence coverage is in effect for those files.`
      : null

  return {
    lane: 'duplication',
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
      clusterCount: clusters.length,
      topFiles,
    },
    raw: {
      clusters,
      productVsTooling: {
        product: normalizedFindings.filter((finding) => isProductScope(finding.scope)).length,
        tooling: normalizedFindings.filter((finding) => !isProductScope(finding.scope)).length,
      },
      byRule: countBy(normalizedFindings.map((finding) => finding.ruleId)),
      topRepeatedFiles: topFiles,
      parse: {
        parsedFileCount,
        fallbackFileCount,
        failedFileCount,
      },
    },
    status,
    message,
  }
}
