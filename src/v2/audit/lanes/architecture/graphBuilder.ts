import fs from 'node:fs/promises'
import path from 'node:path'
import traverseModule from '@babel/traverse'
import * as t from '@babel/types'
import { architecturePolicy } from '../../policy/architecturePolicy.ts'
import type { AuditFileInventoryRecord } from '../../policy/findingSchema.ts'
import type { ArchitectureGraphBuildResult, ArchitectureImportEdge, ArchitectureImportIssue } from './types.ts'
import { parseArchitectureSource } from './parser.ts'

const traverse = (traverseModule as any).default ?? traverseModule
const RESOLUTION_CANDIDATES = ['', '.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx', '/index.ts', '/index.tsx']
const FALLBACK_IMPORT_PATTERNS = [
  /\bimport\s+[^'"]*from\s*['"]([^'"]+)['"]/g,
  /\bexport\s+[^'"]*from\s*['"]([^'"]+)['"]/g,
  /\bimport\s*['"]([^'"]+)['"]/g,
]

function getLoc(node: { loc?: { start: { line: number; column: number } } } | null | undefined) {
  if (!node?.loc) {
    return { line: null, column: null }
  }

  return {
    line: node.loc.start.line,
    column: node.loc.start.column + 1,
  }
}

function isInternalSpecifier(specifier: string) {
  return architecturePolicy.graph.internalSpecifierPrefixes.some((prefix) => specifier.startsWith(prefix))
}

function supportsSpecifierResolution(specifier: string) {
  return architecturePolicy.graph.supportedInternalPrefixes.some((prefix) => specifier.startsWith(prefix))
}

function resolveRelativeSpecifier(
  fromAbsolutePath: string,
  specifier: string,
  knownAbsolutePaths: Set<string>,
) {
  const withoutExtension = path.resolve(path.dirname(fromAbsolutePath), specifier)

  for (const suffix of RESOLUTION_CANDIDATES) {
    const candidate = `${withoutExtension}${suffix}`
    if (knownAbsolutePaths.has(candidate)) {
      return candidate
    }
  }

  return null
}

function pushEdge(
  edge: ArchitectureImportEdge,
  edges: ArchitectureImportEdge[],
  outgoing: Map<string, ArchitectureImportEdge[]>,
  incoming: Map<string, ArchitectureImportEdge[]>,
) {
  edges.push(edge)

  const outgoingEdges = outgoing.get(edge.from.file) ?? []
  outgoingEdges.push(edge)
  outgoing.set(edge.from.file, outgoingEdges)

  const incomingEdges = incoming.get(edge.to.file) ?? []
  incomingEdges.push(edge)
  incoming.set(edge.to.file, incomingEdges)
}

function pushIssue(
  issue: ArchitectureImportIssue,
  unresolvedImports: ArchitectureImportIssue[],
) {
  unresolvedImports.push(issue)
}

function collectFallbackSpecifiers(sourceText: string) {
  const specifiers = new Set<string>()

  for (const pattern of FALLBACK_IMPORT_PATTERNS) {
    for (const match of sourceText.matchAll(pattern)) {
      if (match[1]) {
        specifiers.add(match[1])
      }
    }
  }

  return [...specifiers]
}

function extractImportNames(specifiers: t.ImportDeclaration['specifiers']) {
  return specifiers.map((specifierNode) => {
    if (t.isImportDefaultSpecifier(specifierNode)) {
      return 'default'
    }

    if (t.isImportNamespaceSpecifier(specifierNode)) {
      return '*'
    }

    if (t.isIdentifier(specifierNode.imported)) {
      return specifierNode.imported.name
    }

    return specifierNode.imported.value
  })
}

export async function buildArchitectureGraph(records: AuditFileInventoryRecord[]): Promise<ArchitectureGraphBuildResult> {
  const recordsWithPaths = records.filter((record) => Boolean(record.absolutePath))
  const knownAbsolutePaths = new Set(recordsWithPaths.map((record) => record.absolutePath!))
  const recordByAbsolutePath = new Map(recordsWithPaths.map((record) => [record.absolutePath!, record]))
  const edges: ArchitectureImportEdge[] = []
  const outgoing = new Map<string, ArchitectureImportEdge[]>()
  const incoming = new Map<string, ArchitectureImportEdge[]>()
  const unresolvedImports: ArchitectureImportIssue[] = []

  let parsedFileCount = 0
  let fallbackFileCount = 0
  let failedFileCount = 0
  let externalImportCount = 0

  for (const record of recordsWithPaths) {
    const absolutePath = record.absolutePath!
    let sourceText = ''

    try {
      sourceText = await fs.readFile(absolutePath, 'utf8')
    } catch (error) {
      failedFileCount += 1
      pushIssue(
        {
          file: record.file,
          specifier: '<read-failure>',
          kind: 'read-failure',
          line: null,
          column: null,
          message: `Could not read ${record.file}: ${error instanceof Error ? error.message : 'unknown read failure'}.`,
        },
        unresolvedImports,
      )
      continue
    }

    const parseResult = parseArchitectureSource(sourceText)
    if (parseResult.mode === 'ast') {
      parsedFileCount += 1

      traverse(parseResult.ast, {
        ImportDeclaration(path) {
          const specifier = path.node.source.value
          handleResolvedImport({
            fromRecord: record,
            specifier,
            importedNames: extractImportNames(path.node.specifiers),
            usesNamespaceImport: path.node.specifiers.some((specifierNode) => t.isImportNamespaceSpecifier(specifierNode)),
            usesSideEffectImport: path.node.specifiers.length === 0,
            line: path.node.source.loc?.start.line ?? path.node.loc?.start.line ?? null,
            column: path.node.source.loc ? path.node.source.loc.start.column + 1 : path.node.loc ? path.node.loc.start.column + 1 : null,
            viaFallback: false,
          })
        },
        ExportAllDeclaration(path) {
          const specifier = path.node.source?.value
          if (!specifier) {
            return
          }

          handleResolvedImport({
            fromRecord: record,
            specifier,
            importedNames: ['*'],
            usesNamespaceImport: true,
            usesSideEffectImport: false,
            line: path.node.source?.loc?.start.line ?? path.node.loc?.start.line ?? null,
            column: path.node.source?.loc ? path.node.source.loc.start.column + 1 : path.node.loc ? path.node.loc.start.column + 1 : null,
            viaFallback: false,
          })
        },
        ExportNamedDeclaration(path) {
          const specifier = path.node.source?.value
          if (!specifier) {
            return
          }

          handleResolvedImport({
            fromRecord: record,
            specifier,
            importedNames:
              path.node.specifiers.length > 0
                ? path.node.specifiers.map((specifierNode) =>
                    t.isExportSpecifier(specifierNode)
                      ? t.isIdentifier(specifierNode.local)
                        ? specifierNode.local.name
                        : t.isStringLiteral(specifierNode.local)
                          ? specifierNode.local.value
                          : '*'
                      : '*',
                  )
                : ['*'],
            usesNamespaceImport: path.node.specifiers.length === 0,
            usesSideEffectImport: false,
            line: path.node.source?.loc?.start.line ?? path.node.loc?.start.line ?? null,
            column: path.node.source?.loc ? path.node.source.loc.start.column + 1 : path.node.loc ? path.node.loc.start.column + 1 : null,
            viaFallback: false,
          })
        },
        CallExpression(path) {
          if (!t.isImport(path.node.callee)) {
            return
          }

          const firstArgument = path.node.arguments[0]
          if (!t.isStringLiteral(firstArgument)) {
            return
          }

          handleResolvedImport({
            fromRecord: record,
            specifier: firstArgument.value,
            importedNames: ['*'],
            usesNamespaceImport: true,
            usesSideEffectImport: false,
            ...getLoc(firstArgument),
            viaFallback: false,
          })
        },
      })
      continue
    }

    fallbackFileCount += 1
    for (const specifier of collectFallbackSpecifiers(sourceText)) {
      handleResolvedImport({
        fromRecord: record,
        specifier,
        importedNames: ['*'],
        usesNamespaceImport: true,
        usesSideEffectImport: false,
        line: null,
        column: null,
        viaFallback: true,
      })
    }
  }

  const degraded =
    failedFileCount > 0 ||
    (architecturePolicy.graph.fallbackParseDegradesLane && fallbackFileCount > 0) ||
    (architecturePolicy.graph.unresolvedRelativeImportsDegradeLane &&
      unresolvedImports.some((issue) => issue.kind === 'unresolved-relative')) ||
    (architecturePolicy.graph.unsupportedInternalImportsDegradeLane &&
      unresolvedImports.some((issue) => issue.kind === 'unsupported-internal'))

  return {
    status: failedFileCount === recordsWithPaths.length && recordsWithPaths.length > 0 ? 'failed' : degraded ? 'degraded' : 'ready',
    message: buildGraphMessage({ fallbackFileCount, failedFileCount, unresolvedImports }),
    edges,
    outgoing,
    incoming,
    unresolvedImports,
    parsedFileCount,
    fallbackFileCount,
    failedFileCount,
    externalImportCount,
    nodeCount: recordsWithPaths.length,
  }

  function handleResolvedImport({
    fromRecord,
    specifier,
    importedNames,
    usesNamespaceImport,
    usesSideEffectImport,
    line,
    column,
    viaFallback,
  }: {
    fromRecord: AuditFileInventoryRecord
    specifier: string
    importedNames: string[]
    usesNamespaceImport: boolean
    usesSideEffectImport: boolean
    line: number | null
    column: number | null
    viaFallback: boolean
  }) {
    if (!isInternalSpecifier(specifier)) {
      externalImportCount += 1
      return
    }

    if (!supportsSpecifierResolution(specifier)) {
      pushIssue(
        {
          file: fromRecord.file,
          specifier,
          kind: 'unsupported-internal',
          line,
          column,
          message: `Unsupported internal import form "${specifier}" in ${fromRecord.file}.`,
        },
        unresolvedImports,
      )
      return
    }

    const resolvedAbsolutePath = resolveRelativeSpecifier(fromRecord.absolutePath!, specifier, knownAbsolutePaths)
    if (!resolvedAbsolutePath) {
      pushIssue(
        {
          file: fromRecord.file,
          specifier,
          kind: 'unresolved-relative',
          line,
          column,
          message: `Could not resolve relative import "${specifier}" from ${fromRecord.file}.`,
        },
        unresolvedImports,
      )
      return
    }

    const targetRecord = recordByAbsolutePath.get(resolvedAbsolutePath)
    if (!targetRecord) {
      pushIssue(
        {
          file: fromRecord.file,
          specifier,
          kind: 'unresolved-relative',
          line,
          column,
          message: `Resolved ${specifier} from ${fromRecord.file} to an unknown inventory target.`,
        },
        unresolvedImports,
      )
      return
    }

    pushEdge(
      {
        from: fromRecord,
        to: targetRecord,
        specifier,
        importedNames,
        usesNamespaceImport,
        usesSideEffectImport,
        line,
        column,
        viaFallback,
        confidence: viaFallback ? 'medium' : 'high',
      },
      edges,
      outgoing,
      incoming,
    )
  }
}

function buildGraphMessage({
  fallbackFileCount,
  failedFileCount,
  unresolvedImports,
}: {
  fallbackFileCount: number
  failedFileCount: number
  unresolvedImports: ArchitectureImportIssue[]
}) {
  const parts: string[] = []

  if (fallbackFileCount > 0) {
    parts.push(`${fallbackFileCount} file(s) required regex fallback import extraction`)
  }

  if (failedFileCount > 0) {
    parts.push(`${failedFileCount} file(s) could not be read`)
  }

  const unresolvedRelativeCount = unresolvedImports.filter((issue) => issue.kind === 'unresolved-relative').length
  if (unresolvedRelativeCount > 0) {
    parts.push(`${unresolvedRelativeCount} relative import(s) could not be resolved`)
  }

  const unsupportedInternalCount = unresolvedImports.filter((issue) => issue.kind === 'unsupported-internal').length
  if (unsupportedInternalCount > 0) {
    parts.push(`${unsupportedInternalCount} internal import(s) use unsupported non-relative forms`)
  }

  return parts.length > 0 ? `${parts.join('; ')}.` : null
}
