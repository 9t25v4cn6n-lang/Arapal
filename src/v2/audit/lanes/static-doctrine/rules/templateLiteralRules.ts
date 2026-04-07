import * as t from '@babel/types'
import type { AuditFinding } from '../../../policy/findingSchema.ts'
import {
  createStaticDoctrineFinding,
  expressionUsesOnlyAllowedRootsInScope,
  getNodeLocation,
  getScreenIdForRecord,
  getSourceExcerpt,
  isApplicableConsumerFileKind,
  isZeroLikeString,
  traverse,
} from '../ruleHelpers.ts'
import type { StaticDoctrineRuleContext } from '../types.ts'

const CSS_DECLARATION_PATTERN = /([a-z-]+)\s*:\s*([^;}{]+)\s*;/g
const EXPRESSION_PLACEHOLDER_PATTERN = /__EXPR_(\d+)__/g

const TYPOGRAPHY_PROPERTIES = new Set(['font-size', 'line-height', 'font-weight'])
const SPACING_PROPERTIES = new Set([
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'padding-inline',
  'padding-block',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'margin-inline',
  'margin-block',
  'gap',
  'row-gap',
  'column-gap',
])
const COLOR_PROPERTIES = new Set([
  'color',
  'background',
  'background-color',
  'border',
  'border-color',
  'outline',
  'outline-color',
  'fill',
  'stroke',
  'box-shadow',
  'text-shadow',
])
const RADIUS_PROPERTIES = new Set([
  'border-radius',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
])
const MOTION_PROPERTIES = new Set([
  'transition',
  'transition-duration',
  'transition-timing-function',
  'transition-delay',
  'animation',
  'animation-duration',
  'animation-timing-function',
  'animation-delay',
])

const TYPOGRAPHY_LITERAL_PATTERN = /\b\d+(\.\d+)?(px|rem|em|vh|vw|%)\b|\b(clamp|calc|min|max)\(/
const SPACING_LITERAL_PATTERN = /\b\d+(\.\d+)?(px|rem|em|vh|vw|%)\b|\b(clamp|calc|minmax)\(/
const COLOR_LITERAL_PATTERN = /(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\()/
const MOTION_LITERAL_PATTERN = /\b\d+(\.\d+)?m?s\b|cubic-bezier\(|\bease(-in|-out|-in-out)?\b|\blinear\b/

function renderTemplateLiteral(node: t.TemplateLiteral) {
  let rendered = ''

  node.quasis.forEach((quasi, index) => {
    rendered += quasi.value.cooked ?? ''
    if (index < node.expressions.length) {
      rendered += `__EXPR_${index}__`
    }
  })

  return rendered
}

function getValueExpressions(valueText: string, expressions: t.Expression[]) {
  const matches = [...valueText.matchAll(EXPRESSION_PLACEHOLDER_PATTERN)]
  return matches
    .map((match) => Number(match[1]))
    .filter((index) => Number.isInteger(index) && expressions[index])
    .map((index) => expressions[index]!)
}

function normalizeValueText(valueText: string) {
  return valueText.replace(EXPRESSION_PLACEHOLDER_PATTERN, ' ').replace(/\s+/g, ' ').trim()
}

function isCssLikeTemplate(path: { parent: t.Node | null }, rendered: string) {
  if (!rendered.includes(':') || !rendered.includes(';')) {
    return false
  }

  if (t.isTaggedTemplateExpression(path.parent)) {
    return true
  }

  if (t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)) {
    return /style|styles|css/i.test(path.parent.id.name)
  }

  if (t.isAssignmentExpression(path.parent) && t.isIdentifier(path.parent.left)) {
    return /style|styles|css/i.test(path.parent.left.name)
  }

  return rendered.includes('{') || rendered.includes('}')
}

function allExpressionsUseAllowedRoots(
  valueExpressions: t.Expression[],
  allowedRoots: string[],
  scope: { getBinding(name: string): any } | null | undefined,
) {
  return (
    valueExpressions.length > 0 &&
    valueExpressions.every((expression) => expressionUsesOnlyAllowedRootsInScope(expression, allowedRoots, scope))
  )
}

function shouldFlagTypographyValue(
  valueText: string,
  valueExpressions: t.Expression[],
  scope: { getBinding(name: string): any } | null | undefined,
) {
  const normalized = normalizeValueText(valueText)
  const tokenized = allExpressionsUseAllowedRoots(valueExpressions, ['typography'], scope)

  if (tokenized && !TYPOGRAPHY_LITERAL_PATTERN.test(normalized)) {
    return null
  }

  if (tokenized) {
    return 'screen-local-bespoke-variant'
  }

  if (TYPOGRAPHY_LITERAL_PATTERN.test(normalized) || valueExpressions.length === 0) {
    return 'hardcoded-typography'
  }

  return null
}

function shouldFlagSpacingValue(
  valueText: string,
  valueExpressions: t.Expression[],
  scope: { getBinding(name: string): any } | null | undefined,
) {
  const normalized = normalizeValueText(valueText)
  if (isZeroLikeString(normalized)) {
    return false
  }

  if (allExpressionsUseAllowedRoots(valueExpressions, ['spacing', 'surfacePadding'], scope)) {
    if (!normalized) {
      return false
    }

    return !normalized
      .split(/\s+/)
      .every((part) => ['0', 'auto', '/', ',', 'min-content', 'max-content'].includes(part))
  }

  return SPACING_LITERAL_PATTERN.test(normalized) || valueExpressions.length === 0
}

function shouldFlagColorValue(
  valueText: string,
  valueExpressions: t.Expression[],
  scope: { getBinding(name: string): any } | null | undefined,
) {
  const normalized = normalizeValueText(valueText)
  if (allExpressionsUseAllowedRoots(valueExpressions, ['colors', 'elevation'], scope)) {
    return COLOR_LITERAL_PATTERN.test(normalized)
  }

  return COLOR_LITERAL_PATTERN.test(normalized) || valueExpressions.length === 0
}

function shouldFlagRadiusValue(
  valueText: string,
  valueExpressions: t.Expression[],
  scope: { getBinding(name: string): any } | null | undefined,
) {
  const normalized = normalizeValueText(valueText)
  if (!normalized) {
    return !allExpressionsUseAllowedRoots(valueExpressions, ['radius'], scope)
  }

  if (normalized === 'inherit' || isZeroLikeString(normalized)) {
    return false
  }

  if (allExpressionsUseAllowedRoots(valueExpressions, ['radius'], scope)) {
    return false
  }

  return true
}

function shouldFlagMotionValue(
  valueText: string,
  valueExpressions: t.Expression[],
  scope: { getBinding(name: string): any } | null | undefined,
) {
  const normalized = normalizeValueText(valueText)
  if (isZeroLikeString(normalized)) {
    return false
  }

  if (allExpressionsUseAllowedRoots(valueExpressions, ['motion'], scope)) {
    return MOTION_LITERAL_PATTERN.test(normalized)
  }

  return MOTION_LITERAL_PATTERN.test(normalized) || valueExpressions.length === 0
}

export function runTemplateLiteralRules(context: StaticDoctrineRuleContext) {
  const findings: AuditFinding[] = []

  if (context.parseResult.mode !== 'ast' || !isApplicableConsumerFileKind(context.record.fileKind)) {
    return findings
  }

  traverse(context.parseResult.ast, {
    TemplateLiteral(path) {
      const rendered = renderTemplateLiteral(path.node)
      if (!isCssLikeTemplate(path, rendered)) {
        return
      }

      for (const match of rendered.matchAll(CSS_DECLARATION_PATTERN)) {
        const propertyName = match[1]?.trim().toLowerCase()
        const valueText = match[2]?.trim() ?? ''
        if (!propertyName) {
          continue
        }

        const valueExpressions = getValueExpressions(valueText, path.node.expressions)
        let ruleId: string | null = null

        if (TYPOGRAPHY_PROPERTIES.has(propertyName)) {
          ruleId = shouldFlagTypographyValue(valueText, valueExpressions, path.scope)
        } else if (SPACING_PROPERTIES.has(propertyName) && shouldFlagSpacingValue(valueText, valueExpressions, path.scope)) {
          ruleId = 'hardcoded-spacing'
        } else if (COLOR_PROPERTIES.has(propertyName) && shouldFlagColorValue(valueText, valueExpressions, path.scope)) {
          ruleId = 'hardcoded-color'
        } else if (RADIUS_PROPERTIES.has(propertyName) && shouldFlagRadiusValue(valueText, valueExpressions, path.scope)) {
          ruleId = 'hardcoded-radius'
        } else if (MOTION_PROPERTIES.has(propertyName) && shouldFlagMotionValue(valueText, valueExpressions, path.scope)) {
          ruleId = 'hardcoded-motion'
        }

        if (!ruleId) {
          continue
        }

        const loc = getNodeLocation(path.node)
        findings.push(
          createStaticDoctrineFinding(context, {
            ruleId,
            message: `${propertyName} should use a shared token or approved named variant.`,
            rationale: `${propertyName} is using a CSS-template literal value that bypasses a shared token or named variant.`,
            file: context.record.file,
            fileKind: context.record.fileKind,
            scope: context.record.scope,
            ownerLayer: context.record.ownerLayer,
            screenId: context.record.scope === 'live-product' ? getScreenIdForRecord(context.record) : null,
            line: loc.line,
            column: loc.column,
            evidence: {
              excerpt: valueText,
              details: [propertyName],
            },
            classification: ruleId === 'screen-local-bespoke-variant' ? 'doctrine-decision-needed' : 'real-code-fix',
          }),
        )
      }
    },
  })

  return findings
}
