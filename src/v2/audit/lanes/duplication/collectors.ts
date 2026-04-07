import fs from 'node:fs/promises'
import * as t from '@babel/types'
import { duplicationPolicy } from './policy.ts'
import {
  collapseWhitespace,
  getNodeLocation,
  getObjectPropertyName,
  getScreenIdForRecord,
  getSourceExcerpt,
  serializeExpression,
  traverse,
} from './signatureHelpers.ts'
import type { DuplicationFileAnalysis, DuplicationOccurrence } from './types.ts'
import type { AuditFileInventoryRecord } from '../../policy/findingSchema.ts'
import { parseArchitectureSource } from '../architecture/parser.ts'

const stylePropertyNames = new Set(duplicationPolicy.styleBundle.signatureProperties)
const styleSurfaceProperties = new Set(duplicationPolicy.styleBundle.surfaceProperties)
const shellPropertyNames = new Set(duplicationPolicy.shellMath.propertyNames)
const contractSelectedFields = new Set(duplicationPolicy.contractFragment.selectedFields)
const duplicationIgnoredKinds = new Set(duplicationPolicy.ignoredFileKinds)
const variantEligibleKinds = new Set(duplicationPolicy.variantDrift.eligibleFileKinds)

function getVariableName(path: any) {
  const variableDeclarator = path.findParent((candidate: any) => candidate.isVariableDeclarator?.())
  const id = variableDeclarator?.node?.id
  return t.isIdentifier(id) ? id.name : null
}

function getFunctionName(path: any) {
  const functionPath = path.findParent(
    (candidate: any) =>
      candidate.isFunctionDeclaration?.() || candidate.isFunctionExpression?.() || candidate.isArrowFunctionExpression?.(),
  )

  const id = functionPath?.node?.id
  if (t.isIdentifier(id)) {
    return id.name
  }

  const parent = functionPath?.parentPath?.node
  if (t.isVariableDeclarator(parent) && t.isIdentifier(parent.id)) {
    return parent.id.name
  }

  return null
}

function getParentObjectPropertyName(path: any) {
  const objectPropertyPath = path.findParent((candidate: any) => candidate.isObjectProperty?.())
  if (!objectPropertyPath) {
    return null
  }

  return getObjectPropertyName(objectPropertyPath.node)
}

function getObjectExpressionContext(path: any) {
  const parentPath = path.parentPath
  if (!parentPath) {
    return null
  }

  if (parentPath.isJSXExpressionContainer?.() && parentPath.parentPath?.isJSXAttribute?.()) {
    const attributeName = parentPath.parentPath.node.name
    if (t.isJSXIdentifier(attributeName) && attributeName.name === 'style') {
      return 'jsx-style'
    }
  }

  if (parentPath.isObjectProperty?.()) {
    const propertyName = getObjectPropertyName(parentPath.node)
    if (propertyName === 'style') {
      return 'style-property'
    }
  }

  const variableName = getVariableName(path)
  if (variableName && duplicationPolicy.styleBundle.contextNamePattern.test(variableName)) {
    return 'style-variable'
  }

  const functionName = getFunctionName(path)
  if (functionName && duplicationPolicy.styleBundle.contextNamePattern.test(functionName)) {
    return 'style-function'
  }

  return null
}

function collectStyleBundleOccurrence(path: any, record: AuditFileInventoryRecord, sourceText: string) {
  if (duplicationIgnoredKinds.has(record.fileKind)) {
    return null
  }

  const context = getObjectExpressionContext(path)
  if (!context) {
    return null
  }

  const entries: Array<{ key: string; value: string }> = []
  let surfacePropertyCount = 0

  for (const property of path.node.properties) {
    if (!t.isObjectProperty(property)) {
      continue
    }

    const propertyName = getObjectPropertyName(property)
    if (!propertyName || !stylePropertyNames.has(propertyName)) {
      continue
    }

    const serializedValue = serializeExpression(property.value, path.scope)
    if (!serializedValue) {
      continue
    }

    const normalizedValue = collapseWhitespace(serializedValue)
    entries.push({ key: propertyName, value: normalizedValue })
    if (styleSurfaceProperties.has(propertyName)) {
      surfacePropertyCount += 1
    }
  }

  if (
    entries.length < duplicationPolicy.styleBundle.minPropertyCount ||
    surfacePropertyCount < duplicationPolicy.styleBundle.minSurfacePropertyCount
  ) {
    return null
  }

  entries.sort((left, right) => left.key.localeCompare(right.key) || left.value.localeCompare(right.value))
  const location = getNodeLocation(path.node)

  return {
    ruleId: 'repeated-style-bundle',
    file: record.file,
    line: location.line,
    column: location.column,
    fileKind: record.fileKind,
    scope: record.scope,
    ownerLayer: record.ownerLayer,
    screenId: getScreenIdForRecord(record),
    signature: entries.map((entry) => `${entry.key}=${entry.value}`).join(';'),
    familySignature: entries.map((entry) => entry.key).join('|'),
    excerpt: getSourceExcerpt(sourceText, path.node),
    propertyNames: entries.map((entry) => entry.key),
  } satisfies DuplicationOccurrence
}

function normalizeFormulaText(value: string) {
  return collapseWhitespace(value)
    .replace(/^['"]|['"]$/g, '')
    .replace(/\$\{[^}]+\}/g, '${expr}')
    .replace(/\b\d+(?:\.\d+)?px\b/g, '<px>')
    .replace(/\b\d+(?:\.\d+)?fr\b/g, '<fr>')
}

function isInterestingShellFormula(value: string) {
  if (!duplicationPolicy.shellMath.strongPattern.test(value)) {
    return false
  }

  if (
    value.includes('minmax(') &&
    !duplicationPolicy.shellMath.interestingMinmaxPattern.test(value)
  ) {
    return false
  }

  return !duplicationPolicy.shellMath.ignoredExactFormulas.includes(value)
}

function findFormulaContext(path: any) {
  const propertyName = getParentObjectPropertyName(path)
  if (propertyName && shellPropertyNames.has(propertyName)) {
    return propertyName
  }

  const variableName = getVariableName(path)
  if (variableName && duplicationPolicy.shellMath.namePattern.test(variableName)) {
    return variableName
  }

  const functionName = getFunctionName(path)
  if (functionName && duplicationPolicy.shellMath.namePattern.test(functionName)) {
    return functionName
  }

  return null
}

function createFormulaOccurrence(path: any, record: AuditFileInventoryRecord, sourceText: string) {
  const contextName = findFormulaContext(path)
  if (!contextName || duplicationIgnoredKinds.has(record.fileKind)) {
    return null
  }

  const serialized = serializeExpression(path.node, path.scope)
  if (!serialized) {
    return null
  }

  const normalized = normalizeFormulaText(serialized)
  if (!isInterestingShellFormula(normalized)) {
    return null
  }

  const location = getNodeLocation(path.node)

  return {
    ruleId: 'repeated-shell-math',
    file: record.file,
    line: location.line,
    column: location.column,
    fileKind: record.fileKind,
    scope: record.scope,
    ownerLayer: record.ownerLayer,
    screenId: getScreenIdForRecord(record),
    signature: normalized,
    familySignature: contextName,
    excerpt: getSourceExcerpt(sourceText, path.node),
    propertyNames: [contextName],
  } satisfies DuplicationOccurrence
}

function collectContractFragmentOccurrence(path: any, record: AuditFileInventoryRecord, sourceText: string) {
  if (record.fileKind !== 'screen-contract') {
    return null
  }

  const objectProperties = path.node.properties.filter((property: t.Node) => t.isObjectProperty(property))
  const fieldMap = new Map<string, string>()
  let styleFieldCount = 0
  let hasSemanticRole = false

  for (const property of objectProperties) {
    const propertyName = getObjectPropertyName(property as t.ObjectProperty)
    if (!propertyName) {
      continue
    }

    if (propertyName === 'name' || propertyName === 'parent' || propertyName === 'layer') {
      continue
    }

    if (propertyName === 'style' && t.isObjectExpression((property as t.ObjectProperty).value)) {
      for (const styleProperty of (property as t.ObjectProperty).value.properties) {
        if (!t.isObjectProperty(styleProperty)) {
          continue
        }

        const styleName = getObjectPropertyName(styleProperty)
        const styleValue = serializeExpression(styleProperty.value, path.scope)
        if (!styleName || !styleValue) {
          continue
        }

        fieldMap.set(`style.${styleName}`, collapseWhitespace(styleValue))
        styleFieldCount += 1
      }
      continue
    }

    if (!contractSelectedFields.has(propertyName)) {
      continue
    }

    const serialized = serializeExpression((property as t.ObjectProperty).value, path.scope)
    if (!serialized) {
      continue
    }

    if (propertyName === 'semanticRole') {
      hasSemanticRole = true
    }

    fieldMap.set(propertyName, collapseWhitespace(serialized))
  }

  if (fieldMap.size < duplicationPolicy.contractFragment.minFieldCount) {
    return null
  }

  if (!hasSemanticRole && styleFieldCount < 2) {
    return null
  }

  const signatureEntries = [...fieldMap.entries()].sort((left, right) => left[0].localeCompare(right[0]))
  const location = getNodeLocation(path.node)

  return {
    ruleId: 'repeated-contract-fragment',
    file: record.file,
    line: location.line,
    column: location.column,
    fileKind: record.fileKind,
    scope: record.scope,
    ownerLayer: record.ownerLayer,
    screenId: getScreenIdForRecord(record),
    signature: signatureEntries.map(([key, value]) => `${key}=${value}`).join(';'),
    familySignature: signatureEntries.map(([key]) => key).join('|'),
    excerpt: getSourceExcerpt(sourceText, path.node),
    propertyNames: signatureEntries.map(([key]) => key),
  } satisfies DuplicationOccurrence
}

export async function analyzeDuplicationFile(record: AuditFileInventoryRecord): Promise<DuplicationFileAnalysis> {
  if (!record.absolutePath) {
    return {
      record,
      parseMode: 'fallback',
      parseError: 'Missing absolute path.',
      occurrences: [],
    }
  }

  let sourceText = ''

  try {
    sourceText = await fs.readFile(record.absolutePath!, 'utf8')
  } catch (error) {
    return {
      record,
      parseMode: 'fallback',
      parseError: error instanceof Error ? error.message : 'unknown read failure',
      occurrences: [],
    }
  }

  const parseResult = parseArchitectureSource(sourceText)
  if (parseResult.mode !== 'ast') {
    return {
      record,
      parseMode: 'fallback',
      parseError: parseResult.error,
      occurrences: [],
    }
  }

  const occurrences: DuplicationOccurrence[] = []

  traverse(parseResult.ast, {
    ObjectExpression(path) {
      const styleOccurrence = collectStyleBundleOccurrence(path, record, sourceText)
      if (styleOccurrence) {
        occurrences.push(styleOccurrence)
      }

      const contractOccurrence = collectContractFragmentOccurrence(path, record, sourceText)
      if (contractOccurrence) {
        occurrences.push(contractOccurrence)
      }
    },
    StringLiteral(path) {
      const formulaOccurrence = createFormulaOccurrence(path, record, sourceText)
      if (formulaOccurrence) {
        occurrences.push(formulaOccurrence)
      }
    },
    TemplateLiteral(path) {
      const formulaOccurrence = createFormulaOccurrence(path, record, sourceText)
      if (formulaOccurrence) {
        occurrences.push(formulaOccurrence)
      }
    },
  })

  return {
    record,
    parseMode: 'ast',
    parseError: null,
    occurrences,
  }
}

export function isVariantEligibleOccurrence(occurrence: DuplicationOccurrence) {
  return variantEligibleKinds.has(occurrence.fileKind as any) && occurrence.ruleId === 'repeated-style-bundle'
}
