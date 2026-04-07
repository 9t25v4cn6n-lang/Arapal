import { buildAuditSuite } from '../src/v2/audit/aggregate/buildAuditSuite.ts'
import { publishAuditSuiteOutputs } from '../src/v2/audit/aggregate/publishAuditSuite.ts'

async function main() {
  const suite = await buildAuditSuite()
  const published = await publishAuditSuiteOutputs({
    summary: suite.summary,
    scores: suite.scores,
    findings: suite.findings,
    diff: suite.diff,
    resolvedFindings: suite.resolvedFindings,
    staticDoctrineLane: suite.staticDoctrineLane,
    runtimeLane: suite.runtimeLane,
    deadCodeLane: suite.deadCodeLane,
    architectureLane: suite.architectureLane,
    duplicationLane: suite.duplicationLane,
    fileInventory: suite.summary.inventory,
  })

  console.log(published.summaryPaths.artifactPath)
  console.log(published.summaryPaths.publicPath)
  console.log(published.findingsPaths.artifactPath)
  console.log(published.findingsPaths.publicPath)
  console.log(published.scoresPaths.artifactPath)
  console.log(published.scoresPaths.publicPath)
  console.log(published.deadCodePaths.artifactPath)
  console.log(published.deadCodePaths.publicPath)
  console.log(published.architecturePaths.artifactPath)
  console.log(published.architecturePaths.publicPath)
  console.log(published.duplicationPaths.artifactPath)
  console.log(published.duplicationPaths.publicPath)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
