import type { RuntimeQaLaneReport } from './types.ts'

export function buildRuntimeQaIndexPayload(runtimeLane: RuntimeQaLaneReport) {
  return {
    generatedAt: runtimeLane.generatedAt,
    status: runtimeLane.status,
    findingCount: runtimeLane.findings.length,
    screenCount: runtimeLane.screens.length,
    byStatus: runtimeLane.summary.byStatus,
    viewportCoverage: runtimeLane.summary.viewportCoverage,
    screens: runtimeLane.screens.map((screen) => ({
      screenId: screen.screenId,
      route: screen.route,
      generatedAt: screen.generatedAt,
      status: screen.status,
      scope: screen.scope,
      findingCount: screen.findingCount,
      failingGateCount: screen.failingGateCount,
      failingGates: screen.failingGates,
      reportPath: screen.reportPath,
      screenshotRefs: screen.screenshotRefs,
      coverage: screen.coverage,
      inputStatus: screen.inputStatus,
    })),
  }
}
