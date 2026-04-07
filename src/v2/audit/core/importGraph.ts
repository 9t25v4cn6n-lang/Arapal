import fs from 'node:fs/promises'
import path from 'node:path'
import { REPO_ROOT, toProjectPath } from './repoPaths.ts'

const IMPORT_PATTERNS = [
  /\bimport\s+[^'"]*from\s*['"]([^'"]+)['"]/g,
  /\bexport\s+[^'"]*from\s*['"]([^'"]+)['"]/g,
  /\bimport\s*['"]([^'"]+)['"]/g,
]

const RESOLUTION_CANDIDATES = ['', '.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx', '/index.ts', '/index.tsx']

export interface ImportGraph {
  graph: Map<string, Set<string>>
  reverseGraph: Map<string, Set<string>>
}

function resolveRelativeImport(fromAbsolutePath: string, specifier: string, knownAbsolutePaths: Set<string>) {
  if (!specifier.startsWith('.')) {
    return null
  }

  const withoutExtension = path.resolve(path.dirname(fromAbsolutePath), specifier)

  for (const suffix of RESOLUTION_CANDIDATES) {
    const candidatePath = `${withoutExtension}${suffix}`
    if (candidatePath.startsWith(REPO_ROOT) && knownAbsolutePaths.has(candidatePath)) {
      return candidatePath
    }
  }

  return null
}

export async function buildImportGraph(absolutePaths: string[]) {
  const knownAbsolutePaths = new Set(absolutePaths)
  const graph = new Map<string, Set<string>>()
  const reverseGraph = new Map<string, Set<string>>()

  for (const absolutePath of absolutePaths) {
    graph.set(toProjectPath(absolutePath), new Set())
  }

  for (const absolutePath of absolutePaths) {
    const projectPath = toProjectPath(absolutePath)
    const sourceText = await fs.readFile(absolutePath, 'utf8')
    const dependencies = new Set<string>()

    for (const pattern of IMPORT_PATTERNS) {
      for (const match of sourceText.matchAll(pattern)) {
        const resolved = resolveRelativeImport(absolutePath, match[1], knownAbsolutePaths)
        if (!resolved) {
          continue
        }

        dependencies.add(toProjectPath(resolved))
      }
    }

    graph.set(projectPath, dependencies)

    for (const dependency of dependencies) {
      const reverseDependencies = reverseGraph.get(dependency) ?? new Set<string>()
      reverseDependencies.add(projectPath)
      reverseGraph.set(dependency, reverseDependencies)
    }
  }

  return { graph, reverseGraph } satisfies ImportGraph
}

export function collectTransitiveDependencies(entryProjectPaths: string[], graph: Map<string, Set<string>>) {
  const visited = new Set<string>()
  const queue = [...entryProjectPaths]

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current || visited.has(current)) {
      continue
    }

    visited.add(current)
    for (const dependency of graph.get(current) ?? []) {
      if (!visited.has(dependency)) {
        queue.push(dependency)
      }
    }
  }

  return visited
}
