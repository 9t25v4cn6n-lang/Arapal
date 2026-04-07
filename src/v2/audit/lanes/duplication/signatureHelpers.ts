import traverseModule from '@babel/traverse'
import * as t from '@babel/types'
import { createFindingFingerprint, createFindingId } from '../../core/fingerprint.ts'
import { getScreenDirFromProjectPath, isProductScope } from '../../policy/scopePolicy.ts'
import type { AuditFileInventoryRecord, AuditFinding, FindingClassification } from '../../policy/findingSchema.ts'
import type { DuplicationOccurrence, DuplicationQualityBucket } from './types.ts'

export const traverse = (traverseModule as any).default ?? traverseModule

export function getNodeLocation(node: { loc?: { start: { line: number; column: number } } } | null | undefined) {
  if (!node?.loc) {
    return { line: null, column: null }
  }

  return {
    line: node.loc.start.line,
    column: node.loc.start.column + 1,
  }
}

export function getObjectPropertyName(node: t.ObjectProperty | t.ObjectMethod | t.SpreadElement | null | undefined) {
  if (!node || node.type === 'SpreadElement') {
    return null
  }

  const key = node.key
  if (t.isIdentifier(key)) {
    return key.name
  }
  if (t.isStringLiteral(key) || t.isNumericLiteral(key)) {
    return String(key.value)
  }

  return null
}

function getMemberPropertyText(node: t.MemberExpression | t.OptionalMemberExpression) {
  if (node.computed) {
    return `[${serializeExpression(node.property, null)}]`
  }

  if (t.isIdentifier(node.property)) {
    return `.${node.property.name}`
  }

  if (t.isStringLiteral(node.property)) {
    return `.${node.property.value}`
  }

  return '.<computed>'
}

export function serializeExpression(
  node: t.Node | null | undefined,
  scope: { getBinding?(name: string): any } | null | undefined,
  resolving = new Set<string>(),
): string | null {
  if (!node) {
    return null
  }

  if (t.isStringLiteral(node)) {
    return JSON.stringify(node.value)
  }

  if (t.isNumericLiteral(node) || t.isBooleanLiteral(node)) {
    return String(node.value)
  }

  if (t.isNullLiteral(node)) {
    return 'null'
  }

  if (t.isIdentifier(node)) {
    const binding = scope?.getBinding?.(node.name) ?? null
    const init = binding?.path?.node?.init
    if (init && !resolving.has(node.name)) {
      resolving.add(node.name)
      const resolved = serializeExpression(init, binding.path.scope ?? scope, resolving)
      resolving.delete(node.name)
      if (resolved) {
        return resolved
      }
    }

    return node.name
  }

  if (t.isTemplateLiteral(node)) {
    const parts: string[] = []
    node.quasis.forEach((quasi, index) => {
      const cooked = quasi.value.cooked ?? ''
      if (cooked) {
        parts.push(cooked)
      }

      const expression = node.expressions[index]
      if (expression) {
        parts.push(`\${${serializeExpression(expression, scope, resolving) ?? 'expr'}}`)
      }
    })

    return collapseWhitespace(parts.join(''))
  }

  if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
    const base = serializeExpression(node.object, scope, resolving) ?? '<member>'
    return `${base}${getMemberPropertyText(node)}`
  }

  if (t.isUnaryExpression(node)) {
    return `${node.operator}${serializeExpression(node.argument, scope, resolving) ?? 'expr'}`
  }

  if (t.isBinaryExpression(node) || t.isLogicalExpression(node)) {
    const left = serializeExpression(node.left, scope, resolving)
    const right = serializeExpression(node.right, scope, resolving)
    if (!left || !right) {
      return null
    }
    return collapseWhitespace(`(${left} ${node.operator} ${right})`)
  }

  if (t.isConditionalExpression(node)) {
    const test = serializeExpression(node.test, scope, resolving)
    const consequent = serializeExpression(node.consequent, scope, resolving)
    const alternate = serializeExpression(node.alternate, scope, resolving)
    if (!test || !consequent || !alternate) {
      return null
    }
    return collapseWhitespace(`(${test} ? ${consequent} : ${alternate})`)
  }

  if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) {
    const callee = serializeExpression(node.callee, scope, resolving)
    if (!callee) {
      return null
    }

    const argumentsText = node.arguments
      .map((argument) => (t.isExpression(argument) ? serializeExpression(argument, scope, resolving) : 'spread'))
      .filter(Boolean)
      .join(', ')

    return collapseWhitespace(`${callee}(${argumentsText})`)
  }

  if (t.isArrayExpression(node)) {
    const elements = node.elements
      .map((element) => (element && t.isExpression(element) ? serializeExpression(element, scope, resolving) : null))
      .filter(Boolean)
      .join(', ')

    return `[${elements}]`
  }

  if (t.isObjectExpression(node)) {
    const properties = node.properties
      .map((property) => {
        if (!t.isObjectProperty(property)) {
          return null
        }

        const name = getObjectPropertyName(property)
        const value = serializeExpression(property.value, scope, resolving)
        if (!name || !value) {
          return null
        }

        return `${name}:${value}`
      })
      .filter(Boolean)
      .join(';')

    return `{${properties}}`
  }

  return null
}

export function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

export function getSourceExcerpt(sourceText: string, node: { start?: number | null; end?: number | null } | null | undefined) {
  if (node?.start == null || node.end == null) {
    return null
  }

  return collapseWhitespace(sourceText.slice(node.start, node.end))
}

export function getScreenIdForRecord(record: AuditFileInventoryRecord | null | undefined) {
  if (!record) {
    return null
  }

  return getScreenDirFromProjectPath(record.file.replace(/^\//, ''))
}

export function deriveClusterScope(occurrences: DuplicationOccurrence[]) {
  if (occurrences.some((occurrence) => occurrence.scope === 'live-product')) {
    return 'live-product' as const
  }

  if (occurrences.some((occurrence) => occurrence.scope === 'shared-product-foundation')) {
    return 'shared-product-foundation' as const
  }

  return (occurrences[0]?.scope ?? 'unknown') as AuditFinding['scope']
}

export function deriveClusterOwnerLayer(occurrences: DuplicationOccurrence[]) {
  if (occurrences.some((occurrence) => occurrence.ownerLayer === 'shared-primitive')) {
    return 'shared-primitive' as const
  }
  if (occurrences.some((occurrence) => occurrence.ownerLayer === 'shared-layout')) {
    return 'shared-layout' as const
  }
  if (occurrences.some((occurrence) => occurrence.ownerLayer === 'screen')) {
    return 'screen' as const
  }
  if (occurrences.some((occurrence) => occurrence.ownerLayer === 'contract-layer')) {
    return 'contract-layer' as const
  }
  if (occurrences.some((occurrence) => occurrence.ownerLayer === 'tooling-support')) {
    return 'tooling-support' as const
  }

  return occurrences[0]?.ownerLayer ?? 'unknown'
}

export function deriveRepresentativeScreenId(occurrences: DuplicationOccurrence[]) {
  const screenIds = [...new Set(occurrences.map((occurrence) => occurrence.screenId).filter(Boolean))]
  return screenIds.length === 1 ? (screenIds[0] ?? null) : null
}

export function countTopFilesFromClusters(clusters: Array<{ files: string[] }>) {
  return Object.entries(
    clusters.reduce<Record<string, number>>((summary, cluster) => {
      for (const file of cluster.files) {
        summary[file] = (summary[file] ?? 0) + 1
      }
      return summary
    }, {}),
  )
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 8)
    .map(([file, count]) => ({ file, count }))
}

export function isToolingOnlyOccurrences(occurrences: DuplicationOccurrence[]) {
  return !occurrences.some((occurrence) => isProductScope(occurrence.scope))
}

export function buildDuplicationFinding({
  generatedAt,
  ruleId,
  title,
  category,
  subcategory,
  severity,
  confidence,
  classification,
  occurrences,
  message,
  rationale,
  evidence,
  suggestedFix,
  quality,
  tags,
}: {
  generatedAt: string
  ruleId: AuditFinding['ruleId']
  title: string
  category: string
  subcategory: string | null
  severity: AuditFinding['severity']
  confidence: AuditFinding['confidence']
  classification: FindingClassification
  occurrences: DuplicationOccurrence[]
  message: string
  rationale: string
  evidence: AuditFinding['evidence']
  suggestedFix: string | null
  quality: DuplicationQualityBucket
  tags: string[]
}) {
  const sortedFiles = [...new Set(occurrences.map((occurrence) => occurrence.file))].sort()
  const representative = [...occurrences].sort((left, right) => {
    if (left.file !== right.file) {
      return left.file.localeCompare(right.file)
    }
    return (left.line ?? 0) - (right.line ?? 0)
  })[0]
  const fingerprint = createFindingFingerprint([
    'duplication',
    ruleId,
    quality,
    ...sortedFiles,
    evidence.excerpt,
    ...(evidence.details ?? []),
  ])

  return {
    id: createFindingId('duplication', fingerprint),
    lane: 'duplication' as const,
    ruleId,
    title,
    category,
    subcategory,
    severity,
    confidence,
    classification,
    file: representative?.file ?? null,
    line: representative?.line ?? null,
    column: representative?.column ?? null,
    screenId: deriveRepresentativeScreenId(occurrences),
    fileKind: representative?.fileKind ?? 'unknown',
    scope: deriveClusterScope(occurrences),
    ownerLayer: deriveClusterOwnerLayer(occurrences),
    message,
    rationale,
    evidence,
    suggestedFix,
    suggestedActionType: 'review',
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
