import path from 'node:path'
import type { AuditFileInventoryRecord } from '../policy/findingSchema.ts'
import {
  getScreenDirFromProjectPath,
  isProductScope,
  resolveInventoryPolicy,
  scopePolicy,
} from '../policy/scopePolicy.ts'
import { REPO_ROOT, SCRIPTS_ROOT, V2_ROOT, toProjectPath, walkFiles } from './repoPaths.ts'
import { buildImportGraph, collectTransitiveDependencies } from './importGraph.ts'

const CODE_FILE_PATTERN = /\.(mjs|js|jsx|ts|tsx)$/

function isInside(absolutePath: string, rootPath: string) {
  return absolutePath === rootPath || absolutePath.startsWith(`${rootPath}${path.sep}`)
}

function shouldScanCodeFile(absolutePath: string) {
  if (!CODE_FILE_PATTERN.test(absolutePath)) {
    return false
  }

  if (isInside(absolutePath, path.join(REPO_ROOT, 'dist'))) {
    return false
  }

  return true
}

export async function buildAuditFileInventory() {
  const roots = [V2_ROOT, SCRIPTS_ROOT]
  const absolutePaths = (
    await Promise.all(
      roots.map(async (rootPath) => {
        try {
          return await walkFiles(rootPath)
        } catch {
          return []
        }
      }),
    )
  )
    .flat()
    .filter(shouldScanCodeFile)

  const projectPaths = absolutePaths.map((absolutePath) => toProjectPath(absolutePath))
  const absolutePathByProjectPath = new Map(projectPaths.map((projectPath, index) => [projectPath, absolutePaths[index]]))
  const importGraph = await buildImportGraph(absolutePaths)

  const liveEntryProjectPaths = projectPaths.filter((projectPath) => {
    const screenDir = getScreenDirFromProjectPath(projectPath)
    return Boolean(screenDir && scopePolicy.liveProductScreenDirs.includes(screenDir))
  })

  const liveDependencyClosure = collectTransitiveDependencies(liveEntryProjectPaths, importGraph.graph)

  const auditedFiles: AuditFileInventoryRecord[] = []
  const excludedFiles: AuditFileInventoryRecord[] = []

  for (const projectPath of projectPaths.sort()) {
    const absolutePath = absolutePathByProjectPath.get(projectPath)
    if (!absolutePath) {
      continue
    }

    const usedByLiveProduct =
      liveDependencyClosure.has(projectPath) ||
      Boolean(getScreenDirFromProjectPath(projectPath) && scopePolicy.liveProductScreenDirs.includes(getScreenDirFromProjectPath(projectPath)!))
    const { fileKind, scope, ownerLayer, included, includeReason } = resolveInventoryPolicy(projectPath, {
      usedByLiveProduct,
    })

    const record: AuditFileInventoryRecord = {
      file: `/${projectPath}`,
      absolutePath,
      fileKind,
      scope,
      ownerLayer,
      included,
      includeReason,
      usedByLiveProduct,
    }

    if (included) {
      auditedFiles.push(record)
    } else {
      excludedFiles.push(record)
    }
  }

  return {
    auditedFiles,
    excludedFiles,
    importGraph,
    liveDependencyClosure,
  }
}

export function summarizeInventoryByScope(records: AuditFileInventoryRecord[]) {
  return records.reduce<Record<string, number>>((summary, record) => {
    summary[record.scope] = (summary[record.scope] ?? 0) + 1
    return summary
  }, {})
}

export function summarizeInventoryProductVsTooling(records: AuditFileInventoryRecord[]) {
  return records.reduce(
    (summary, record) => {
      if (isProductScope(record.scope)) {
        summary.product += 1
      } else {
        summary.tooling += 1
      }
      return summary
    },
    { product: 0, tooling: 0 },
  )
}
