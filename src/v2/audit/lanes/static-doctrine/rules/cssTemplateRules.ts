import * as t from '@babel/types'
import { createStaticDoctrineFinding, getScreenIdForRecord, traverse } from '../ruleHelpers.ts'
import type { AuditFinding } from '../../../policy/findingSchema.ts'
import type { StaticDoctrineRuleContext } from '../types.ts'

const DECLARATION_PATTERN = /([a-zA-Z-]+)\s*:\s*([^;]+);/g
const PLACEHOLDER_PATTERN = /__EXPR_(\d+)__/g
const COLOR_LITERAL_PATTERN = /(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\()/
const SPACING_LITERAL_PATTERN = /(^|\s)(\d+(\.\d+)?)(px|rem|em|vh|vw|%)?($|\s)|\b(clamp|minmax|calc)\(/
const MOTION_LITERAL_PATTERN = /\b\d+(\.\d+)?m?s\b|cubic-bezier\(|ease\b|linear\b/

const TYPOGRAPHY_PROPERTIES = new Set(['font-size', 'line-height', 'font-weight'])
const SPACING_PROPERTIES = new Set([
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'gap',
  'row-gap',
  'column-gap',
])
const COLOR_PROPERTIES = new Set(['color', 'background', 'background-color', 'border-color', 'outline-color', 'fill', 'stroke', 'box-shadow', 'text-shadow'])
const RADIUS_PROPERTIES = new Set(['border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius'])
const MOTION_PROPERTIES = new Set(['transition', 'transition-duration', 'transition-timing-function', 'transition-delay', 'animation', 'animation-duration', 'animation-timing-function', 'animation-delay'])

function getTemplateLiteralText(node: t.TemplateLiteral) {
  return node.quasis.reduce((text, quasi, index) => {
    const placeholder = index < node.expressions.length ? `__EXPR_${index}__` : ''
    return text + (quasi.value.cooked ?? '') + placeholder
  }, '')
}

function expressionUsesRoot(node: t.Node, roots: string[]) {
  let matched = false

  function visit(nextNode: t.Node | null | undefined) {
    if (!nextNode || matched) {
      return
    }

    if (t.isIdentifier(nextNode)) {
      if (roots.includes(nextNode.name)) {
        matched = true
      }
      return
    }

    if (t.isMemberExpression(nextNode) || t.isOptionalMemberExpression(nextNode)) {
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

    if (t.isCallExpression(nextNode) || t.isOptionalCallExpression(nextNode)) {
      visit(nextNode.callee)
      nextNode.arguments.forEach((argument) => {
        if (t.isExpression(argument)) {
          visit(argument)
        }
      })
      return
    }
  }

  visit(node)
  return matched
}

function getDeclarationLocation(sourceText: string, templateNode: t.TemplateLiteral, matchIndex: number) {
  const offset = (templateNode.start ?? 0) + matchIndex
  const before = sourceText.slice(0, offset)
  const lines = before.split('\n')

  return {
    line: lines.length,
    column: lines.at(-1)?.length ? lines.at(-1)!.length + 1 : 1,
  }
}

function shouldFlagCssValue(propertyName: string, valueText: string, expressionNodes: t.Expression[]) {
  const expressionsUse = {
    typography: expressionNodes.every((node) => expressionUsesRoot(node, ['typography'])),
    spacing: expressionNodes.every((node) => expressionUsesRoot(node, ['spacing', 'surfacePadding'])),
    color: expressionNodes.every((node) => expressionUsesRoot(node, ['colors', 'elevation'])),
    radius: expressionNodes.every((node) => expressionUsesRoot(node, ['radius'])),
    motion: expressionNodes.every((node) => expressionUsesRoot(node, ['motion'])),
  }

  if (TYPOGRAPHY_PROPERTIES.has(propertyName)) {
    if (expressionNodes.length > 0 && expressionsUse.typography && !/\d/.test(valueText.replace(PLACEHOLDER_PATTERN, ''))) {
      return null
    }
    if (/\d/.test(valueText) || expressionNodes.length > 0) {
      return expressionNodes.length > 0 && expressionsUse.typography ? 'screen-local-bespoke-variant' : 'hardcoded-typography'
    }
  }

  if (SPACING_PROPERTIES.has(propertyName)) {
    if (expressionNodes.length > 0 && expressionsUse.spacing) {
      return null
    }
    if (SPACING_LITERAL_PATTERN.test(valueText) && !/^\s*0(?:px|%)?\s*$/.test(valueText.trim())) {
      return 'hardcoded-spacing'
    }
  }

  if (COLOR_PROPERTIES.has(propertyName)) {
    if (expressionNodes.length > 0 && expressionsUse.color) {
      return null
    }
    if (COLOR_LITERAL_PATTERN.test(valueText)) {
      return 'hardcoded-color'
    }
  }

  if (RADIUS_PROPERTIES.has(propertyName)) {
    if (expressionNodes.length > 0 && expressionsUse.radius) {
      return null
    }
    if (valueText.trim() === 'inherit') {
      return null
    }
    if (/\d/.test(valueText)) {
      return 'hardcoded-radius'
    }
  }

  if (MOTION_PROPERTIES.has(propertyName)) {
    if (expressionNodes.length > 0 && expressionsUse.motion) {
      return null
    }
    if (MOTION_LITERAL_PATTERN.test(valueText)) {
      return 'hardcoded-motion'
    }
  }

  return null
}

export function runCssTemplateRules(context: StaticDoctrineRuleContext) {
  const findings: AuditFinding[] = []

  if (context.parseResult.mode !== 'ast' || context.record.fileKind === 'token-definition') {
    return findings
  }

  traverse(context.parseResult.ast, {
    TemplateLiteral(path) {
      const text = getTemplateLiteralText(path.node)
      if (!text.includes(':') || !text.includes(';')) {
        return
      }

      for (const match of text.matchAll(DECLARATION_PATTERN)) {
        const propertyName = match[1].toLowerCase()
        const valueText = match[2]
        const placeholderIndexes = [...valueText.matchAll(PLACEHOLDER_PATTERN)].map((placeholder) => Number(placeholder[1]))
        const expressionNodes = placeholderIndexes
          .map((index) => path.node.expressions[index])
          .filter((expression): expression is t.Expression => Boolean(expression))
        const ruleId = shouldFlagCssValue(propertyName, valueText, expressionNodes)

        if (!ruleId) {
          continue
        }

        const loc = getDeclarationLocation(context.sourceText, path.node, match.index ?? 0)
        findings.push(
          createStaticDoctrineFinding(context, {
            ruleId,
            message: `${propertyName} in a CSS template should use a shared token or approved named variant.`,
            rationale: `${propertyName} inside a CSS template is using a literal or bespoke expression.`,
            file: context.record.file,
            fileKind: context.record.fileKind,
            scope: context.record.scope,
            ownerLayer: context.record.ownerLayer,
            screenId: getScreenIdForRecord(context.record),
            line: loc.line,
            column: loc.column,
            evidence: {
              excerpt: `${propertyName}: ${valueText};`,
            },
            classification: ruleId === 'screen-local-bespoke-variant' ? 'doctrine-decision-needed' : 'low-confidence-review',
            confidence: 'low',
          }),
        )
      }
    },
  })

  return findings
}
