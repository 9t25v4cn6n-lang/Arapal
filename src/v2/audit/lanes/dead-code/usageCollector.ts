import fs from 'node:fs/promises'
import traverseModule from '@babel/traverse'
import * as t from '@babel/types'
import type { AuditFileInventoryRecord } from '../../policy/findingSchema.ts'
import { parseArchitectureSource } from '../architecture/parser.ts'
import type { ArchitectureImportEdge } from '../architecture/types.ts'
import type { DeadCodeExportRecord, DeadCodeFileAnalysis } from './types.ts'

const traverse = (traverseModule as any).default ?? traverseModule

function getLoc(node: { loc?: { start: { line: number; column: number } } } | null | undefined) {
  if (!node?.loc) {
    return { line: null, column: null }
  }

  return {
    line: node.loc.start.line,
    column: node.loc.start.column + 1,
  }
}

function extractDeclaredNames(node: t.Node | null | undefined): string[] {
  if (!node) {
    return []
  }

  if (t.isIdentifier(node)) {
    return [node.name]
  }

  if (t.isObjectPattern(node)) {
    return node.properties.flatMap((property) => {
      if (t.isRestElement(property)) {
        return extractDeclaredNames(property.argument)
      }

      return extractDeclaredNames(property.value)
    })
  }

  if (t.isArrayPattern(node)) {
    return node.elements.flatMap((element) => extractDeclaredNames(element))
  }

  if (t.isAssignmentPattern(node)) {
    return extractDeclaredNames(node.left)
  }

  if (t.isRestElement(node)) {
    return extractDeclaredNames(node.argument)
  }

  return []
}

function collectExportsFromAst(ast: t.File): {
  exports: DeadCodeExportRecord[]
  hasWildcardExport: boolean
  hasReExportFromSource: boolean
} {
  const exports: DeadCodeExportRecord[] = []
  let hasWildcardExport = false
  let hasReExportFromSource = false

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const loc = getLoc(path.node)
      exports.push({
        name: 'default',
        kind: 'default',
        line: loc.line,
        column: loc.column,
      })
    },
    ExportAllDeclaration() {
      hasWildcardExport = true
    },
    ExportNamedDeclaration(path) {
      if (path.node.source) {
        hasReExportFromSource = true
      }

      if (path.node.declaration) {
        const declaration = path.node.declaration
        if (t.isFunctionDeclaration(declaration) || t.isClassDeclaration(declaration)) {
          if (declaration.id) {
            const loc = getLoc(declaration.id)
            exports.push({
              name: declaration.id.name,
              kind: 'named',
              line: loc.line,
              column: loc.column,
            })
          }
          return
        }

        if (t.isVariableDeclaration(declaration)) {
          for (const declarator of declaration.declarations) {
            const loc = getLoc(declarator.id)
            for (const name of extractDeclaredNames(declarator.id)) {
              exports.push({
                name,
                kind: 'named',
                line: loc.line,
                column: loc.column,
              })
            }
          }
        }
        return
      }

      for (const specifier of path.node.specifiers) {
        if (!t.isExportSpecifier(specifier)) {
          continue
        }

        const exportedName =
          t.isIdentifier(specifier.exported)
            ? specifier.exported.name
            : t.isStringLiteral(specifier.exported)
              ? specifier.exported.value
              : null

        if (!exportedName) {
          continue
        }

        const loc = getLoc(specifier.exported)
        exports.push({
          name: exportedName,
          kind: exportedName === 'default' ? 'default' : 'named',
          line: loc.line,
          column: loc.column,
        })
      }
    },
  })

  return {
    exports,
    hasWildcardExport,
    hasReExportFromSource,
  }
}

export async function analyzeDeadCodeFiles(records: AuditFileInventoryRecord[]) {
  const analyses = new Map<string, DeadCodeFileAnalysis>()

  for (const record of records.filter((candidate) => candidate.absolutePath)) {
    const absolutePath = record.absolutePath!
    let sourceText = ''

    try {
      sourceText = await fs.readFile(absolutePath, 'utf8')
    } catch (error) {
      analyses.set(record.file, {
        record,
        parseMode: 'fallback',
        parseError: error instanceof Error ? error.message : 'unknown read failure',
        exports: [],
        hasWildcardExport: false,
        hasReExportFromSource: false,
      })
      continue
    }

    const parseResult = parseArchitectureSource(sourceText)
    if (parseResult.mode !== 'ast') {
      analyses.set(record.file, {
        record,
        parseMode: 'fallback',
        parseError: parseResult.error,
        exports: [],
        hasWildcardExport: false,
        hasReExportFromSource: false,
      })
      continue
    }

    const collected = collectExportsFromAst(parseResult.ast)
    analyses.set(record.file, {
      record,
      parseMode: 'ast',
      parseError: null,
      exports: collected.exports,
      hasWildcardExport: collected.hasWildcardExport,
      hasReExportFromSource: collected.hasReExportFromSource,
    })
  }

  return analyses
}

export function buildImportedNameUsage(edges: ArchitectureImportEdge[]) {
  const usage = new Map<
    string,
    {
      importedNames: Set<string>
      hasWildcardUsage: boolean
      hasSideEffectUsage: boolean
      importerFiles: Set<string>
    }
  >()

  for (const edge of edges) {
    const entry = usage.get(edge.to.file) ?? {
      importedNames: new Set<string>(),
      hasWildcardUsage: false,
      hasSideEffectUsage: false,
      importerFiles: new Set<string>(),
    }

    edge.importedNames.forEach((name) => entry.importedNames.add(name))
    if (edge.usesNamespaceImport) {
      entry.hasWildcardUsage = true
    }
    if (edge.usesSideEffectImport) {
      entry.hasSideEffectUsage = true
    }
    entry.importerFiles.add(edge.from.file)
    usage.set(edge.to.file, entry)
  }

  return usage
}
