import * as t from '@babel/types'
import { getScreenIdForRecord, createStaticDoctrineFinding, getNodeLocation, getObjectPropertyName, getSourceExcerpt, traverse } from '../ruleHelpers.ts'
import type { AuditFinding } from '../../../policy/findingSchema.ts'
import type { StaticDoctrineContractContainer, StaticDoctrineRuleContext } from '../types.ts'

const SHELL_CONTAINER_PATTERN = /^Layer(1|2)_/
const SHELL_SIZING_PROPERTIES = new Set(['gridTemplateColumns', 'gridTemplateRows', 'width', 'minWidth', 'maxWidth', 'flexBasis'])
const SHELL_ALLOWED_IDENTIFIER_ROOTS = ['shellSizing', 'getDefaultBodySplitColumns', 'getLayer1BodyColumns']

function getRelatedContainerNames(context: StaticDoctrineRuleContext) {
  return new Set([
    ...context.contractRegistry.sharedShellContainerNames,
    ...(context.relatedContract?.containers.map((container) => container.name) ?? []),
  ])
}

function resolveObjectExpression(node: t.Node | null | undefined, objectBindings: Map<string, t.ObjectExpression>) {
  if (!node) {
    return null
  }

  if (t.isObjectExpression(node)) {
    return node
  }

  if (t.isIdentifier(node)) {
    return objectBindings.get(node.name) ?? null
  }

  return null
}

function objectExpressionHasSuspiciousShellSizing(objectExpression: t.ObjectExpression) {
  return objectExpression.properties.some((property) => {
    if (!t.isObjectProperty(property) || !t.isExpression(property.value)) {
      return false
    }

    const propertyName = getObjectPropertyName(property)
    if (!propertyName || !SHELL_SIZING_PROPERTIES.has(propertyName)) {
      return false
    }

    if (property.value.type === 'CallExpression' && property.value.callee.type === 'Identifier') {
      return !SHELL_ALLOWED_IDENTIFIER_ROOTS.includes(property.value.callee.name)
    }

    if (property.value.type === 'MemberExpression' && property.value.object.type === 'Identifier') {
      return !SHELL_ALLOWED_IDENTIFIER_ROOTS.includes(property.value.object.name)
    }

    return true
  })
}

function createOverrideFinding(
  context: StaticDoctrineRuleContext,
  ruleId: string,
  message: string,
  node: t.Node,
  classification: AuditFinding['classification'] = 'real-code-fix',
) {
  const loc = getNodeLocation(node)
  return createStaticDoctrineFinding(context, {
    ruleId,
    message,
    rationale: message,
    file: context.record.file,
    fileKind: context.record.fileKind,
    scope: context.record.scope,
    ownerLayer: context.record.ownerLayer,
    screenId: getScreenIdForRecord(context.record),
    line: loc.line,
    column: loc.column,
    evidence: {
      excerpt: getSourceExcerpt(context.sourceText, node),
    },
    classification,
  })
}

export function runContainerOverrideRules(context: StaticDoctrineRuleContext) {
  const findings: AuditFinding[] = []

  if (context.parseResult.mode !== 'ast' || context.record.fileKind !== 'live-screen') {
    return findings
  }

  const validContainerNames = getRelatedContainerNames(context)
  const objectBindings = new Map<string, t.ObjectExpression>()

  traverse(context.parseResult.ast, {
    VariableDeclarator(path) {
      if (t.isIdentifier(path.node.id) && t.isObjectExpression(path.node.init)) {
        objectBindings.set(path.node.id.name, path.node.init)
      }
    },
    JSXAttribute(path) {
      if (path.node.name.name !== 'containerOverrides') {
        return
      }

      const expression = t.isJSXExpressionContainer(path.node.value) ? path.node.value.expression : null
      const containerOverrides = resolveObjectExpression(expression, objectBindings)
      if (!containerOverrides) {
        findings.push(
          createOverrideFinding(
            context,
            'container-overrides-usage',
            'containerOverrides uses a non-literal shape; review whether this is necessary screen-specific drift.',
            path.node,
            'low-confidence-review',
          ),
        )
        return
      }

      containerOverrides.properties.forEach((property) => {
        if (!t.isObjectProperty(property)) {
          return
        }

        const containerName = getObjectPropertyName(property)
        if (!containerName) {
          return
        }

        const overrideValue = resolveObjectExpression(property.value, objectBindings)
        if (!validContainerNames.has(containerName)) {
          findings.push(
            createOverrideFinding(
              context,
              'override-key-missing-container',
              `containerOverrides references "${containerName}", but no matching contract or shared shell container was found.`,
              property,
            ),
          )
          return
        }

        if (!overrideValue) {
          findings.push(
            createOverrideFinding(
              context,
              'container-overrides-usage',
              `containerOverrides for "${containerName}" is not a direct object literal; review whether this is intentional.`,
              property,
              'doctrine-decision-needed',
            ),
          )
          return
        }

        if (SHELL_CONTAINER_PATTERN.test(containerName)) {
          findings.push(
            createOverrideFinding(
              context,
              'shell-override-touchpoint',
              `Screen-local containerOverrides is touching shell container "${containerName}".`,
              property,
            ),
          )

          if (objectExpressionHasSuspiciousShellSizing(overrideValue)) {
            findings.push(
              createOverrideFinding(
                context,
                'screen-local-shell-math-bypass',
                `Screen-local shell override for "${containerName}" appears to own shell sizing math.`,
                overrideValue,
              ),
            )
          }

          return
        }

        findings.push(
          createOverrideFinding(
            context,
            'container-overrides-usage',
            `Screen-local containerOverrides is altering "${containerName}"; confirm this belongs at screen level.`,
            property,
            'doctrine-decision-needed',
          ),
        )
      })
    },
  })

  return findings
}

function createContractFinding(
  context: StaticDoctrineRuleContext,
  container: StaticDoctrineContractContainer,
  ruleId: string,
  message: string,
) {
  return createStaticDoctrineFinding(context, {
    ruleId,
    message,
    rationale: message,
    file: context.record.file,
    fileKind: context.record.fileKind,
    scope: context.record.scope,
    ownerLayer: context.record.ownerLayer,
    screenId: getScreenIdForRecord(context.record),
    line: container.line,
    column: container.column,
    evidence: {
      excerpt: container.name,
    },
  })
}

export function runContractRules(context: StaticDoctrineRuleContext) {
  const findings: AuditFinding[] = []

  if (context.record.fileKind !== 'screen-contract' || !context.relatedContract) {
    return findings
  }

  const seenNames = new Set<string>()
  const knownParents = new Set([
    ...context.contractRegistry.sharedShellContainerNames,
    ...context.relatedContract.containers.map((container) => container.name),
  ])

  context.relatedContract.containers.forEach((container) => {
    if (seenNames.has(container.name)) {
      findings.push(
        createContractFinding(context, container, 'contract-duplicate-container', `Contract declares duplicate container "${container.name}".`),
      )
    }
    seenNames.add(container.name)

    if (container.parent && !knownParents.has(container.parent)) {
      findings.push(
        createContractFinding(context, container, 'contract-missing-parent', `Contract references missing parent "${container.parent}".`),
      )
    }

    if (container.allowEmpty && !container.semanticRole) {
      findings.push(
        createContractFinding(context, container, 'contract-allow-empty-without-role', `allowEmpty container "${container.name}" must declare a semanticRole.`),
      )
    }

  })

  return findings
}
