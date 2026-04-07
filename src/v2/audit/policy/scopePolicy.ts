import path from 'node:path'
import {
  coreProductRouteIds,
  coreProductScreenDirs,
  ignoredAuditScreenDirs,
  sharedFoundationExcludedPaths,
  sharedFoundationIncludeRoots,
} from '../../app/auditRegistry.js'
import type { AuditFileKind, AuditOwnerLayer, AuditScope } from './findingSchema.ts'

export const scopePolicy = {
  liveProductRouteIds: [...coreProductRouteIds],
  liveProductScreenDirs: [...coreProductScreenDirs],
  ignoredScreenDirs: [...ignoredAuditScreenDirs],
  sharedFoundationIncludeRoots: [...sharedFoundationIncludeRoots],
  sharedFoundationExcludedPaths: [...sharedFoundationExcludedPaths],
  topLevelFrameworkAdapterPaths: ['src/v2/AppV2.jsx'],
  dashboardRoots: ['src/v2/screens/QualityDashboard'],
  debugRoots: ['src/v2/foundation/debug'],
  labRoots: [
    'src/v2/foundation/lab-previews',
    'src/v2/screens/ControlsLab',
    'src/v2/screens/EditorPanelsLab',
    'src/v2/screens/FoundationLab',
    'src/v2/screens/MotionInteractionLab',
    'src/v2/screens/PatternLab',
    'src/v2/screens/TypographyTokensLab',
  ],
  labPaths: ['src/v2/foundation/primitives/LabBoard.jsx', 'src/v2/foundation/layout/createLabBoardContract.ts', 'src/v2/screens/labRoutes.ts'],
  toolingSupportRoots: ['src/v2/audit', 'scripts'],
  generatedPathFragments: ['/generated/', '/dist/'],
  frameworkAdapterPaths: [
    'src/v2/AppV2.jsx',
    'src/v2/foundation/layout/createScreenLayoutContract.ts',
    'src/v2/foundation/layout/ScreenContractRenderer.jsx',
    'src/v2/foundation/primitives/V2ScreenFrame.jsx',
    'src/v2/app/routeRegistry.ts',
    'src/v2/app/auditRegistry.js',
  ],
} as const

export type ScopePolicy = typeof scopePolicy

export function toProjectPath(repoRoot: string, absolutePath: string) {
  return path.relative(repoRoot, absolutePath).split(path.sep).join('/')
}

export function matchesProjectSubpath(projectPath: string, projectSubpath: string) {
  return projectPath === projectSubpath || projectPath.startsWith(`${projectSubpath}/`)
}

export function getScreenDirFromProjectPath(projectPath: string) {
  if (!projectPath.startsWith('src/v2/screens/')) {
    return null
  }

  const [, , , screenDir] = projectPath.split('/')
  return screenDir ?? null
}

export function isPathInSharedFoundationRoots(projectPath: string) {
  return scopePolicy.sharedFoundationIncludeRoots.some((prefix) => matchesProjectSubpath(projectPath, prefix))
}

export function isPathExplicitlyExcludedFromSharedFoundation(projectPath: string) {
  return scopePolicy.sharedFoundationExcludedPaths.some((prefix) => matchesProjectSubpath(projectPath, prefix))
}

export function classifyFileKind(projectPath: string): AuditFileKind {
  if (scopePolicy.generatedPathFragments.some((fragment) => projectPath.includes(fragment.replaceAll('\\', '/')))) {
    return 'generated'
  }

  if (scopePolicy.toolingSupportRoots.some((prefix) => matchesProjectSubpath(projectPath, prefix))) {
    return 'audit-suite'
  }

  if (scopePolicy.dashboardRoots.some((prefix) => matchesProjectSubpath(projectPath, prefix))) {
    return 'dashboard'
  }

  if (scopePolicy.debugRoots.some((prefix) => matchesProjectSubpath(projectPath, prefix))) {
    return 'debug'
  }

  if (
    scopePolicy.labRoots.some((prefix) => matchesProjectSubpath(projectPath, prefix)) ||
    scopePolicy.labPaths.some((candidate) => candidate === projectPath)
  ) {
    return 'lab'
  }

  const screenDir = getScreenDirFromProjectPath(projectPath)
  if (screenDir && scopePolicy.ignoredScreenDirs.includes(screenDir)) {
    return 'ignored'
  }

  if (screenDir && scopePolicy.liveProductScreenDirs.includes(screenDir)) {
    return projectPath.endsWith('.contract.ts') ? 'screen-contract' : 'live-screen'
  }

  if (scopePolicy.topLevelFrameworkAdapterPaths.some((candidate) => candidate === projectPath)) {
    return 'framework-adapter'
  }

  if (isPathExplicitlyExcludedFromSharedFoundation(projectPath)) {
    if (projectPath.includes('/debug/')) {
      return 'debug'
    }

    return 'lab'
  }

  if (matchesProjectSubpath(projectPath, 'src/v2/foundation/tokens') && isPathInSharedFoundationRoots(projectPath)) {
    return 'token-definition'
  }

  if (scopePolicy.frameworkAdapterPaths.some((candidate) => candidate === projectPath)) {
    return 'framework-adapter'
  }

  if (matchesProjectSubpath(projectPath, 'src/v2/foundation/layout') && isPathInSharedFoundationRoots(projectPath)) {
    return 'shared-layout'
  }

  if (matchesProjectSubpath(projectPath, 'src/v2/foundation/primitives') && isPathInSharedFoundationRoots(projectPath)) {
    return 'shared-primitive'
  }

  return 'unknown'
}

export function determineOwnerLayer(fileKind: AuditFileKind, projectPath: string): AuditOwnerLayer {
  switch (fileKind) {
    case 'live-screen':
      return 'screen'
    case 'screen-contract':
      return 'contract-layer'
    case 'shared-layout':
      return 'shared-layout'
    case 'shared-primitive':
      return 'shared-primitive'
    case 'token-definition':
      return 'token-layer'
    case 'framework-adapter':
      return projectPath.includes('/layout/') ? 'contract-layer' : 'shared-layout'
    case 'dashboard':
    case 'debug':
    case 'lab':
      return 'tooling-support'
    case 'audit-suite':
      return 'audit-framework'
    default:
      return 'unknown'
  }
}

export function determineScope(
  fileKind: AuditFileKind,
  options: { usedByLiveProduct?: boolean; projectPath?: string } = {},
): AuditScope {
  const usedByLiveProduct = options.usedByLiveProduct ?? false

  switch (fileKind) {
    case 'live-screen':
    case 'screen-contract':
      return 'live-product'
    case 'shared-layout':
    case 'shared-primitive':
    case 'token-definition':
    case 'framework-adapter':
      return usedByLiveProduct ? 'shared-product-foundation' : 'tooling-support'
    case 'dashboard':
      return 'dashboard'
    case 'debug':
      return 'debug'
    case 'lab':
      return 'lab'
    case 'generated':
      return 'generated'
    case 'ignored':
      return 'ignored'
    case 'audit-suite':
      return 'tooling-support'
    default:
      return 'unknown'
  }
}

export function isProductScope(scope: AuditScope) {
  return scope === 'live-product' || scope === 'shared-product-foundation'
}

export function resolveInventoryPolicy(projectPath: string, options: { usedByLiveProduct?: boolean } = {}) {
  const usedByLiveProduct = options.usedByLiveProduct ?? false
  const fileKind = classifyFileKind(projectPath)
  const scope = determineScope(fileKind, { usedByLiveProduct, projectPath })
  const ownerLayer = determineOwnerLayer(fileKind, projectPath)
  const included = scope !== 'generated' && scope !== 'ignored'

  let includeReason = `Unclassified file surfaced for review: ${projectPath}`

  switch (fileKind) {
    case 'live-screen':
    case 'screen-contract':
      includeReason = 'Included by live product screen policy.'
      break
    case 'shared-layout':
    case 'shared-primitive':
    case 'token-definition':
    case 'framework-adapter':
      includeReason = usedByLiveProduct
        ? 'Included by shared foundation policy and live-screen import closure.'
        : 'Visible to audit as shared/tooling support but not counted as product foundation.'
      break
    case 'dashboard':
      includeReason = 'Included as dashboard support scope.'
      break
    case 'debug':
      includeReason = 'Included as debug support scope.'
      break
    case 'lab':
      includeReason = 'Included as lab/tooling support scope.'
      break
    case 'audit-suite':
      includeReason = 'Included as audit framework support scope.'
      break
    case 'generated':
      includeReason = 'Excluded by generated-file policy.'
      break
    case 'ignored':
      includeReason = 'Excluded by explicit ignored-scope policy.'
      break
    default:
      includeReason = `Unclassified file surfaced for review by scope policy: ${projectPath}`
      break
  }

  return {
    fileKind,
    scope,
    ownerLayer,
    included,
    includeReason,
  }
}
