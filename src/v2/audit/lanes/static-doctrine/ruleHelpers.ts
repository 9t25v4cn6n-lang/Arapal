import traverseModule from '@babel/traverse'
import * as t from '@babel/types'
import { getScreenDirFromProjectPath } from '../../policy/scopePolicy.ts'
import { createFindingFingerprint, createFindingId } from '../../core/fingerprint.ts'
import type { AuditFileInventoryRecord, AuditFinding } from '../../policy/findingSchema.ts'
import { staticDoctrineRuleDefinitions } from './ruleDefinitions.ts'
import type { StaticDoctrineRuleContext, StaticDoctrineRuleFindingInput } from './types.ts'

export const traverse = (traverseModule as any).default ?? traverseModule

export function getScreenIdForRecord(record: AuditFileInventoryRecord) {
  return getScreenDirFromProjectPath(record.file.replace(/^\//, ''))
}

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

export function getStringLiteralValue(node: t.Node | null | undefined): string | null {
  if (!node) {
    return null
  }
  if (t.isStringLiteral(node)) {
    return node.value
  }
  if (t.isTemplateLiteral(node) && node.expressions.length === 0) {
    return node.quasis.map((quasi) => quasi.value.cooked ?? '').join('')
  }

  return null
}

export function expressionContainsIdentifier(node: t.Node | null | undefined, allowedRoots: string[]) {
  if (!node) {
    return false
  }

  let matched = false

  function visit(nextNode: t.Node | null | undefined) {
    if (!nextNode || matched) {
      return
    }

    if (t.isIdentifier(nextNode)) {
      if (allowedRoots.includes(nextNode.name)) {
        matched = true
      }
      return
    }

    if (t.isMemberExpression(nextNode)) {
      visit(nextNode.object)
      if (t.isIdentifier(nextNode.property)) {
        visit(nextNode.property)
      }
      return
    }

    if (t.isOptionalMemberExpression(nextNode)) {
      visit(nextNode.object)
      if (t.isIdentifier(nextNode.property)) {
        visit(nextNode.property)
      }
      return
    }

    if (t.isTemplateLiteral(nextNode)) {
      nextNode.expressions.forEach((expression) => visit(expression))
      return
    }

    if (t.isBinaryExpression(nextNode) || t.isLogicalExpression(nextNode)) {
      visit(nextNode.left)
      visit(nextNode.right)
      return
    }

    if (t.isConditionalExpression(nextNode)) {
      visit(nextNode.test)
      visit(nextNode.consequent)
      visit(nextNode.alternate)
      return
    }

    if (t.isCallExpression(nextNode) || t.isOptionalCallExpression(nextNode)) {
      visit(nextNode.callee)
      nextNode.arguments.forEach((argument) => {
        if (t.isExpression(argument)) {
          visit(argument)
        }
      })
      return
    }

    if (t.isArrayExpression(nextNode)) {
      nextNode.elements.forEach((element) => {
        if (element && t.isExpression(element)) {
          visit(element)
        }
      })
      return
    }

    if (t.isObjectExpression(nextNode)) {
      nextNode.properties.forEach((property) => {
        if (t.isObjectProperty(property) && t.isExpression(property.value)) {
          visit(property.value)
        }
      })
    }
  }

  visit(node)
  return matched
}

export function getExpressionRootIdentifiers(node: t.Node | null | undefined) {
  const identifiers = new Set<string>()

  function visit(nextNode: t.Node | null | undefined) {
    if (!nextNode) {
      return
    }

    if (t.isIdentifier(nextNode)) {
      identifiers.add(nextNode.name)
      return
    }

    if (t.isMemberExpression(nextNode) || t.isOptionalMemberExpression(nextNode)) {
      visit(nextNode.object)
      return
    }

    if (t.isTemplateLiteral(nextNode)) {
      nextNode.expressions.forEach((expression) => visit(expression))
      return
    }

    if (t.isBinaryExpression(nextNode) || t.isLogicalExpression(nextNode)) {
      visit(nextNode.left)
      visit(nextNode.right)
      return
    }

    if (t.isConditionalExpression(nextNode)) {
      visit(nextNode.test)
      visit(nextNode.consequent)
      visit(nextNode.alternate)
      return
    }

    if (t.isCallExpression(nextNode) || t.isOptionalCallExpression(nextNode)) {
      visit(nextNode.callee)
      nextNode.arguments.forEach((argument) => {
        if (t.isExpression(argument)) {
          visit(argument)
        }
      })
      return
    }

    if (t.isArrayExpression(nextNode)) {
      nextNode.elements.forEach((element) => {
        if (element && t.isExpression(element)) {
          visit(element)
        }
      })
      return
    }

    if (t.isObjectExpression(nextNode)) {
      nextNode.properties.forEach((property) => {
        if (t.isObjectProperty(property) && t.isExpression(property.value)) {
          visit(property.value)
        }
      })
    }
  }

  visit(node)
  return identifiers
}

export function expressionUsesOnlyAllowedRoots(node: t.Node | null | undefined, allowedRoots: string[]) {
  const identifiers = [...getExpressionRootIdentifiers(node)]
  if (identifiers.length === 0) {
    return false
  }

  return identifiers.every((identifier) => allowedRoots.includes(identifier))
}

export function expressionUsesOnlyAllowedRootsInScope(
  node: t.Node | null | undefined,
  allowedRoots: string[],
  scope: { getBinding(name: string): any } | null | undefined,
) {
  const identifiers = new Set<string>()
  const resolving = new Set<string>()

  function visit(nextNode: t.Node | null | undefined, nextScope: { getBinding(name: string): any } | null | undefined) {
    if (!nextNode) {
      return
    }

    if (t.isIdentifier(nextNode)) {
      const identifierName = nextNode.name
      if (resolving.has(identifierName)) {
        identifiers.add(identifierName)
        return
      }

      const binding = nextScope?.getBinding?.(identifierName) ?? null
      const init = binding?.path?.node?.init
      if (init && init !== nextNode) {
        resolving.add(identifierName)
        visit(init, binding.path.scope ?? nextScope)
        resolving.delete(identifierName)
        return
      }

      identifiers.add(identifierName)
      return
    }

    if (t.isMemberExpression(nextNode) || t.isOptionalMemberExpression(nextNode)) {
      visit(nextNode.object, nextScope)
      return
    }

    if (t.isTemplateLiteral(nextNode)) {
      nextNode.expressions.forEach((expression) => visit(expression, nextScope))
      return
    }

    if (t.isBinaryExpression(nextNode) || t.isLogicalExpression(nextNode)) {
      visit(nextNode.left, nextScope)
      visit(nextNode.right, nextScope)
      return
    }

    if (t.isConditionalExpression(nextNode)) {
      visit(nextNode.test, nextScope)
      visit(nextNode.consequent, nextScope)
      visit(nextNode.alternate, nextScope)
      return
    }

    if (t.isCallExpression(nextNode) || t.isOptionalCallExpression(nextNode)) {
      visit(nextNode.callee, nextScope)
      nextNode.arguments.forEach((argument) => {
        if (t.isExpression(argument)) {
          visit(argument, nextScope)
        }
      })
      return
    }

    if (t.isArrayExpression(nextNode)) {
      nextNode.elements.forEach((element) => {
        if (element && t.isExpression(element)) {
          visit(element, nextScope)
        }
      })
      return
    }

    if (t.isObjectExpression(nextNode)) {
      nextNode.properties.forEach((property) => {
        if (t.isObjectProperty(property) && t.isExpression(property.value)) {
          visit(property.value, nextScope)
        }
      })
    }
  }

  visit(node, scope)
  return identifiers.size > 0 && [...identifiers].every((identifier) => allowedRoots.includes(identifier))
}

export function getSourceExcerpt(sourceText: string, node: { start?: number | null; end?: number | null } | null | undefined) {
  if (node?.start == null || node.end == null) {
    return null
  }

  return sourceText.slice(node.start, node.end)
}

export function isZeroLikeString(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return false
  }

  return trimmed
    .split(/\s+/)
    .every((part) => ['0', '0px', '0%', '0rem', '0em', 'none', 'transparent', 'inherit'].includes(part))
}

export function isZeroLikeValue(node: t.Node | null | undefined) {
  if (!node) {
    return false
  }

  if (t.isNumericLiteral(node)) {
    return node.value === 0
  }

  const stringValue = getStringLiteralValue(node)
  if (stringValue !== null) {
    return isZeroLikeString(stringValue)
  }

  return false
}

export function templateLiteralContainsLiteralText(node: t.TemplateLiteral) {
  return node.quasis.some((quasi) => (quasi.value.cooked ?? '').trim().length > 0)
}

export function createStaticDoctrineFinding(
  context: StaticDoctrineRuleContext,
  input: StaticDoctrineRuleFindingInput,
): AuditFinding {
  const ruleDefinition = staticDoctrineRuleDefinitions[input.ruleId]
  const fingerprint = createFindingFingerprint([
    'static-doctrine',
    input.ruleId,
    input.file,
    input.line,
    input.column,
    input.message,
    input.evidence.excerpt,
  ])

  return {
    id: createFindingId('static-doctrine', fingerprint),
    lane: 'static-doctrine',
    ruleId: input.ruleId,
    title: ruleDefinition.title,
    category: ruleDefinition.category,
    subcategory: ruleDefinition.subcategory,
    severity: input.severity ?? ruleDefinition.severity,
    confidence: input.confidence ?? ruleDefinition.confidence,
    classification: input.classification ?? 'real-code-fix',
    file: input.file,
    line: input.line,
    column: input.column,
    screenId: input.screenId,
    fileKind: input.fileKind,
    scope: input.scope,
    ownerLayer: input.ownerLayer,
    message: input.message,
    rationale: input.rationale,
    evidence: input.evidence,
    suggestedFix: input.suggestedFix ?? ruleDefinition.suggestedFix,
    suggestedActionType: input.suggestedActionType ?? ruleDefinition.suggestedActionType,
    autofixable: false,
    suppressed: false,
    suppressionReason: null,
    tags: input.tags ?? [input.ruleId, context.record.fileKind, context.record.scope, context.record.ownerLayer],
    fingerprint,
    firstSeenAt: null,
    lastSeenAt: context.generatedAt,
    status: 'current',
  }
}

export function isApplicableConsumerFileKind(fileKind: AuditFinding['fileKind']) {
  return !['screen-contract', 'token-definition', 'generated', 'ignored', 'audit-suite'].includes(fileKind)
}
