import * as t from '@babel/types'
import type { AuditFinding } from '../../../policy/findingSchema.ts'
import {
  createStaticDoctrineFinding,
  expressionContainsIdentifier,
  expressionUsesOnlyAllowedRootsInScope,
  getNodeLocation,
  getObjectPropertyName,
  getScreenIdForRecord,
  getSourceExcerpt,
  isApplicableConsumerFileKind,
  isZeroLikeValue,
  templateLiteralContainsLiteralText,
  traverse,
} from '../ruleHelpers.ts'
import type { StaticDoctrineRuleContext } from '../types.ts'

const TYPOGRAPHY_PROPERTIES = new Set(['fontSize', 'lineHeight', 'fontWeight'])
const SPACING_PROPERTIES = new Set([
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'paddingInline',
  'paddingBlock',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginInline',
  'marginBlock',
  'gap',
  'rowGap',
  'columnGap',
])
const COLOR_PROPERTIES = new Set([
  'color',
  'background',
  'backgroundColor',
  'borderColor',
  'outlineColor',
  'fill',
  'stroke',
  'boxShadow',
  'textShadow',
])
const RADIUS_PROPERTIES = new Set([
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
])
const MOTION_PROPERTIES = new Set([
  'transition',
  'transitionDuration',
  'transitionTimingFunction',
  'transitionDelay',
  'animation',
  'animationDuration',
  'animationTimingFunction',
  'animationDelay',
])

const COLOR_LITERAL_PATTERN = /(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\()/
const SPACING_LITERAL_PATTERN = /(^|\s)(\d+(\.\d+)?)(px|rem|em|vh|vw|%)?($|\s)|\b(clamp|minmax|calc)\(/
const MOTION_LITERAL_PATTERN = /\b\d+(\.\d+)?m?s\b|cubic-bezier\(|ease\b|linear\b/

function allowKeywordValue(value: string) {
  return ['inherit', 'transparent', 'currentColor', 'none'].includes(value.trim())
}

function isTemplateWithAllowedTokensOnly(node: t.TemplateLiteral, allowedRoots: string[]) {
  return node.expressions.length > 0 && !templateLiteralContainsLiteralText(node) && node.expressions.every((expression) => expressionContainsIdentifier(expression, allowedRoots))
}

function shouldFlagTypography(node: t.Node, scope: any) {
  if (expressionUsesOnlyAllowedRootsInScope(node, ['typography'], scope) || expressionContainsIdentifier(node, ['typography'])) {
    if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
      return false
    }

    if (t.isTemplateLiteral(node) && isTemplateWithAllowedTokensOnly(node, ['typography'])) {
      return false
    }

    return !t.isIdentifier(node)
  }

  return t.isNumericLiteral(node) || t.isStringLiteral(node) || t.isTemplateLiteral(node)
}

function shouldFlagSpacing(node: t.Node, scope: any) {
  if (expressionUsesOnlyAllowedRootsInScope(node, ['spacing', 'surfacePadding'], scope)) {
    if (t.isTemplateLiteral(node)) {
      return !node.expressions.every((expression) =>
        expressionUsesOnlyAllowedRootsInScope(expression, ['spacing', 'surfacePadding'], scope),
      )
    }

    return false
  }

  if (isZeroLikeValue(node)) {
    return false
  }

  if (t.isNumericLiteral(node)) {
    return node.value !== 0
  }

  if (t.isStringLiteral(node)) {
    return SPACING_LITERAL_PATTERN.test(node.value) && !allowKeywordValue(node.value)
  }

  if (t.isTemplateLiteral(node)) {
    const raw = node.quasis.map((quasi) => quasi.value.cooked ?? '').join(' ')
    return SPACING_LITERAL_PATTERN.test(raw)
  }

  return false
}

function shouldFlagColor(node: t.Node, scope: any) {
  if (expressionUsesOnlyAllowedRootsInScope(node, ['colors', 'elevation'], scope)) {
    return false
  }

  if (t.isStringLiteral(node)) {
    return COLOR_LITERAL_PATTERN.test(node.value) && !allowKeywordValue(node.value)
  }

  if (t.isTemplateLiteral(node)) {
    const raw = node.quasis.map((quasi) => quasi.value.cooked ?? '').join(' ')
    return COLOR_LITERAL_PATTERN.test(raw)
  }

  return false
}

function shouldFlagRadius(node: t.Node, scope: any) {
  if (expressionUsesOnlyAllowedRootsInScope(node, ['radius'], scope)) {
    return false
  }

  if (isZeroLikeValue(node)) {
    return false
  }

  if (t.isStringLiteral(node)) {
    if (node.value.trim() === 'inherit') {
      return false
    }
    return true
  }

  if (t.isNumericLiteral(node)) {
    return node.value !== 0
  }

  if (t.isTemplateLiteral(node)) {
    const raw = node.quasis.map((quasi) => quasi.value.cooked ?? '').join(' ')
    return raw.trim() !== '' && raw.trim() !== 'inherit'
  }

  return false
}

function shouldFlagMotion(node: t.Node, scope: any) {
  if (expressionUsesOnlyAllowedRootsInScope(node, ['motion'], scope)) {
    return false
  }

  if (isZeroLikeValue(node)) {
    return false
  }

  if (t.isStringLiteral(node)) {
    return MOTION_LITERAL_PATTERN.test(node.value)
  }

  if (t.isTemplateLiteral(node)) {
    const raw = node.quasis.map((quasi) => quasi.value.cooked ?? '').join(' ')
    return MOTION_LITERAL_PATTERN.test(raw)
  }

  return false
}

export function runStyleLiteralRules(context: StaticDoctrineRuleContext) {
  const findings: AuditFinding[] = []

  if (
    context.parseResult.mode !== 'ast' ||
    !isApplicableConsumerFileKind(context.record.fileKind) ||
    context.record.fileKind === 'framework-adapter'
  ) {
    return findings
  }

  traverse(context.parseResult.ast, {
    ObjectProperty(path) {
      const propertyName = getObjectPropertyName(path.node)
      if (!propertyName || !t.isExpression(path.node.value)) {
        return
      }

      let ruleId: string | null = null

      if (TYPOGRAPHY_PROPERTIES.has(propertyName) && shouldFlagTypography(path.node.value, path.scope)) {
        ruleId =
          expressionUsesOnlyAllowedRootsInScope(path.node.value, ['typography'], path.scope) ||
          expressionContainsIdentifier(path.node.value, ['typography'])
            ? 'screen-local-bespoke-variant'
            : 'hardcoded-typography'
      } else if (SPACING_PROPERTIES.has(propertyName) && shouldFlagSpacing(path.node.value, path.scope)) {
        ruleId = 'hardcoded-spacing'
      } else if (COLOR_PROPERTIES.has(propertyName) && shouldFlagColor(path.node.value, path.scope)) {
        ruleId = 'hardcoded-color'
      } else if (RADIUS_PROPERTIES.has(propertyName) && shouldFlagRadius(path.node.value, path.scope)) {
        ruleId = 'hardcoded-radius'
      } else if (MOTION_PROPERTIES.has(propertyName) && shouldFlagMotion(path.node.value, path.scope)) {
        ruleId = 'hardcoded-motion'
      }

      if (!ruleId) {
        return
      }

      const loc = getNodeLocation(path.node)
      findings.push(
        createStaticDoctrineFinding(context, {
          ruleId,
          message: `${propertyName} should use a shared token or approved named variant.`,
          rationale: `${propertyName} is using a literal or bespoke expression in consumer code.`,
          file: context.record.file,
          fileKind: context.record.fileKind,
          scope: context.record.scope,
          ownerLayer: context.record.ownerLayer,
          screenId: context.record.scope === 'live-product' ? getScreenIdForRecord(context.record) : null,
          line: loc.line,
          column: loc.column,
          evidence: {
            excerpt: getSourceExcerpt(context.sourceText, path.node.value),
          },
          classification: ruleId === 'screen-local-bespoke-variant' ? 'doctrine-decision-needed' : 'real-code-fix',
        }),
      )
    },
  })

  return findings
}
