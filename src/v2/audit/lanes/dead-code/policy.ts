export const deadCodePolicy = {
  productEntryPaths: ['/src/v2/AppV2.jsx', '/src/v2/app/routeRegistry.ts'],
  toolingEntryPaths: [
    '/src/v2/screens/QualityDashboard/QualityDashboardScreen.jsx',
    '/src/v2/screens/labRoutes.ts',
    '/scripts/run-v2-audit-suite.mjs',
    '/scripts/run-v2-static-audit.mjs',
    '/scripts/run-v2-screen-qa.mjs',
  ],
  standaloneAllowedPaths: ['/src/v2/app/auditRegistry.js'],
  skipUnusedFileKinds: ['generated', 'ignored'] as const,
  skipUnusedExportKinds: ['generated', 'ignored', 'unknown'] as const,
  staleConfigPath: '/src/v2/audit/policy/scopePolicy.ts',
} as const

export function isStandaloneAllowed(file: string) {
  return deadCodePolicy.standaloneAllowedPaths.includes(file)
}
