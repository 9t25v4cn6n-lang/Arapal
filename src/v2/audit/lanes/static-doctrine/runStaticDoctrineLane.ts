import fs from 'node:fs/promises'
import { applySuppressions, auditSuppressions, validateSuppressions } from '../../policy/suppressions.ts'
import { getScreenIdForRecord } from './ruleHelpers.ts'
import { parseStaticDoctrineSource } from './parser.ts'
import { buildStaticDoctrineContractRegistry } from './contractRegistry.ts'
import { runFallbackScan } from './fallbackScan.ts'
import { runContainerOverrideRules, runContractRules } from './rules/overrideAndContractRules.ts'
import { runStyleLiteralRules } from './rules/styleLiteralRules.ts'
import { runTemplateLiteralRules } from './rules/templateLiteralRules.ts'
import type { AuditFileInventoryRecord, AuditFinding } from '../../policy/findingSchema.ts'
import type { StaticDoctrineLaneReport } from './types.ts'

function dedupeFindings(findings: AuditFinding[]) {
  const deduped = new Map<string, AuditFinding>()

  findings.forEach((finding) => {
    if (!deduped.has(finding.fingerprint)) {
      deduped.set(finding.fingerprint, finding)
    }
  })

  return [...deduped.values()]
}

function countByRule(findings: AuditFinding[]) {
  return findings.reduce<Record<string, number>>((summary, finding) => {
    summary[finding.ruleId] = (summary[finding.ruleId] ?? 0) + 1
    return summary
  }, {})
}

export async function runStaticDoctrineLane({
  auditedFiles,
  excludedFiles,
}: {
  auditedFiles: AuditFileInventoryRecord[]
  excludedFiles: AuditFileInventoryRecord[]
}): Promise<StaticDoctrineLaneReport> {
  const generatedAt = new Date().toISOString()
  const laneAuditedFiles = auditedFiles.filter((record) => record.fileKind !== 'audit-suite')
  const laneExcludedFiles = excludedFiles.filter((record) => record.fileKind !== 'audit-suite')
  const parserStats = {
    astParsedFileCount: 0,
    fallbackFileCount: 0,
    fallbackFiles: [] as string[],
  }
  const readFailures: string[] = []
  const invalidSuppressions = validateSuppressions(auditSuppressions).filter((entry) => !entry.isValid)

  let contractRegistry

  try {
    contractRegistry = await buildStaticDoctrineContractRegistry([...laneAuditedFiles, ...laneExcludedFiles])
  } catch (error) {
    return {
      lane: 'static-doctrine',
      generatedAt,
      findings: [],
      auditedFiles: laneAuditedFiles,
      excludedFiles: laneExcludedFiles,
      raw: {
        parserStats,
        byRule: {},
      },
      summary: {
        findingCount: 0,
        liveScreenFindingCount: 0,
        sharedFoundationFindingCount: 0,
        byRule: {},
      },
      status: 'failed',
      message: `Static doctrine contract registry failed to build: ${error instanceof Error ? error.message : 'unknown failure'}.`,
    }
  }

  const rawFindings: AuditFinding[] = []

  for (const record of laneAuditedFiles) {
    if (!record.absolutePath) {
      readFailures.push(`${record.file} has no absolute path.`)
      continue
    }

    let sourceText: string

    try {
      sourceText = await fs.readFile(record.absolutePath, 'utf8')
    } catch (error) {
      readFailures.push(`${record.file} could not be read: ${error instanceof Error ? error.message : 'unknown read failure'}.`)
      continue
    }

    const parseResult = parseStaticDoctrineSource(sourceText)
    if (parseResult.mode === 'ast') {
      parserStats.astParsedFileCount += 1
    } else {
      parserStats.fallbackFileCount += 1
      parserStats.fallbackFiles.push(record.file)
    }

    const screenId = getScreenIdForRecord(record)
    const context = {
      generatedAt,
      record,
      sourceText,
      parseResult,
      contractRegistry,
      relatedContract: screenId ? contractRegistry.contractByScreenId.get(screenId) ?? null : null,
    } as const

    rawFindings.push(...runStyleLiteralRules(context))
    rawFindings.push(...runTemplateLiteralRules(context))
    rawFindings.push(...runContainerOverrideRules(context))
    rawFindings.push(...runContractRules(context))
    rawFindings.push(...runFallbackScan(context))
  }

  const dedupedFindings = dedupeFindings(rawFindings)
  const findings = applySuppressions(dedupedFindings, auditSuppressions)
  const byRule = countByRule(findings)
  const messages: string[] = []

  if (parserStats.fallbackFileCount > 0) {
    messages.push(
      `Fallback text scanning was used for ${parserStats.fallbackFileCount} file${parserStats.fallbackFileCount === 1 ? '' : 's'}.`,
    )
  }

  if (readFailures.length > 0) {
    messages.push(`${readFailures.length} file read failure${readFailures.length === 1 ? '' : 's'} occurred.`)
  }

  if (invalidSuppressions.length > 0) {
    messages.push(`${invalidSuppressions.length} invalid suppression entr${invalidSuppressions.length === 1 ? 'y' : 'ies'} detected.`)
  }

  return {
    lane: 'static-doctrine',
    generatedAt,
    findings,
    auditedFiles: laneAuditedFiles,
    excludedFiles: laneExcludedFiles,
    raw: {
      parserStats,
      byRule,
    },
    summary: {
      findingCount: findings.length,
      liveScreenFindingCount: findings.filter((finding) => finding.scope === 'live-product').length,
      sharedFoundationFindingCount: findings.filter((finding) => finding.scope === 'shared-product-foundation').length,
      byRule,
    },
    status: parserStats.fallbackFileCount > 0 || readFailures.length > 0 || invalidSuppressions.length > 0 ? 'degraded' : 'ready',
    message: messages.length > 0 ? messages.join(' ') : null,
  }
}
