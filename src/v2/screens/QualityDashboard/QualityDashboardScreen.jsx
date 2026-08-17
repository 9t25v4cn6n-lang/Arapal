import { useEffect, useMemo, useState } from 'react'
import { coreProductRouteIds } from '../../app/auditRegistry'
import { LabScaffold, LabSection } from '../../foundation/primitives/LabBoard'
import { colors, elevation, radius, spacing, typography } from '../../foundation/tokens'
import layoutContract from './QualityDashboardScreen.contract'

function statusTone(status) {
  switch (status) {
    case 'pass':
      return {
        background: 'rgba(236, 253, 245, 0.96)',
        border: 'rgba(167, 243, 208, 0.96)',
        color: '#047857',
      }
    case 'fail':
      return {
        background: 'rgba(255, 247, 237, 0.96)',
        border: 'rgba(254, 215, 170, 0.96)',
        color: '#c2410c',
      }
    default:
      return {
        background: 'rgba(248, 250, 252, 0.96)',
        border: 'rgba(226, 232, 240, 0.96)',
        color: colors.textSoft,
      }
  }
}

function StatusChip({ status, label = status }) {
  const tone = statusTone(status)

  return (
    <span
      style={{
        borderRadius: radius.pill,
        border: `1px solid ${tone.border}`,
        background: tone.background,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[4],
      }}
    >
      <span
        style={{
          minHeight: 20,
          padding: `0 ${spacing[10]}`,
          borderRadius: radius.pill,
          color: tone.color,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...typography.eyebrowLabel,
        }}
      >
        {label}
      </span>
    </span>
  )
}

function StatCard({ label, value, note }) {
  return (
    <div
      style={{
        border: `1px solid ${colors.lineSoft}`,
        borderRadius: radius[24],
        background: 'rgba(255, 255, 255, 0.98)',
        boxShadow: elevation.flat,
        padding: spacing[6],
      }}
    >
      <div
        style={{
          borderRadius: radius[20],
          padding: spacing[16],
          display: 'grid',
          gap: spacing[10],
        }}
      >
        <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>{label}</p>
        <p style={{ ...typography.cardTitle, margin: 0, color: colors.textStrong }}>{value}</p>
        {note ? <p style={{ ...typography.bodyText, margin: 0, color: colors.textSoft }}>{note}</p> : null}
      </div>
    </div>
  )
}

function displayMetric(value, isLoaded) {
  return isLoaded ? String(value) : '—'
}

function displayOptionalMetric(value, isLoaded) {
  return isLoaded && value !== null && value !== undefined ? String(value) : '—'
}

function scoreStatus(score) {
  if (typeof score !== 'number') {
    return 'unknown'
  }

  if (score >= 85) {
    return 'pass'
  }

  if (score >= 65) {
    return 'unknown'
  }

  return 'fail'
}

function formatDeltaLabel(entry) {
  if (!entry) {
    return '—'
  }

  const prefix = entry.delta > 0 ? '+' : ''
  return `${entry.label}: ${prefix}${entry.delta}`
}

function SurfaceCard({ children, tone = 'default' }) {
  return (
    <div
      style={{
        border: `1px solid ${tone === 'warning' ? 'rgba(254, 215, 170, 0.96)' : colors.lineSoft}`,
        borderRadius: radius[24],
        background: tone === 'warning' ? 'rgba(255, 247, 237, 0.86)' : 'rgba(255, 255, 255, 0.98)',
        boxShadow: elevation.flat,
        padding: spacing[6],
      }}
    >
      <div
        style={{
          borderRadius: radius[20],
          padding: spacing[16],
          display: 'grid',
          gap: spacing[12],
        }}
      >
        {children}
      </div>
    </div>
  )
}

function countBy(findings, getKey) {
  return findings.reduce((summary, finding) => {
    const key = getKey(finding)
    if (!key) {
      return summary
    }

    summary[key] = (summary[key] ?? 0) + 1
    return summary
  }, {})
}

function groupStaticScreenFindings(findings) {
  const groups = new Map()

  findings
    .filter((finding) => finding.lane === 'static-doctrine' && finding.scope === 'live-product' && finding.screenId)
    .forEach((finding) => {
      const current = groups.get(finding.screenId) ?? {
        screenId: finding.screenId,
        findingCount: 0,
        categories: {},
        findings: [],
      }

      current.findingCount += 1
      current.categories[finding.ruleId] = (current.categories[finding.ruleId] ?? 0) + 1
      current.findings.push(finding)
      groups.set(finding.screenId, current)
    })

  return [...groups.values()].sort((left, right) => left.screenId.localeCompare(right.screenId))
}

function getSharedFoundationSummary(findings) {
  const sharedFindings = findings.filter(
    (finding) => finding.lane === 'static-doctrine' && finding.scope === 'shared-product-foundation',
  )

  return {
    findingCount: sharedFindings.length,
    byCategory: countBy(sharedFindings, (finding) => finding.ruleId),
    findings: sharedFindings,
  }
}

async function fetchJson(url, { label, required = true } = {}) {
  const response = await fetch(url)

  if (!response.ok) {
    if (!required && response.status === 404) {
      return null
    }

    throw new Error(`${label ?? url} request failed with ${response.status}.`)
  }

  try {
    return await response.json()
  } catch (error) {
    throw new Error(`${label ?? url} returned malformed JSON: ${error instanceof Error ? error.message : 'unknown parse failure'}.`)
  }
}

function useAuditData() {
  const [visualStandard, setVisualStandard] = useState(null)
  const [runtimeLane, setRuntimeLane] = useState(null)
  const [deadCodeLane, setDeadCodeLane] = useState(null)
  const [duplicationLane, setDuplicationLane] = useState(null)
  const [architectureLane, setArchitectureLane] = useState(null)
  const [suiteSummary, setSuiteSummary] = useState(null)
  const [suiteFindings, setSuiteFindings] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isDisposed = false

    async function load() {
      try {
        const [visualStandardJson, suiteSummaryJson, suiteFindingsJson, runtimeLaneJson, deadCodeLaneJson, duplicationLaneJson, architectureLaneJson] = await Promise.all([
          fetchJson('/v2-audit/visual-standard.json', { label: 'Visual standard (live)', required: false }),
          fetchJson('/v2-audit/audit-suite-summary.json', { label: 'Audit suite summary' }),
          fetchJson('/v2-audit/audit-suite-findings.json', { label: 'Audit suite findings' }),
          fetchJson('/v2-audit/runtime-qa-lane.json', { label: 'Runtime QA lane', required: false }),
          fetchJson('/v2-audit/dead-code-audit.json', { label: 'Dead-code lane', required: false }),
          fetchJson('/v2-audit/duplication-audit.json', { label: 'Duplication lane', required: false }),
          fetchJson('/v2-audit/architecture-audit.json', { label: 'Architecture lane', required: false }),
        ])
        const filteredRuntimeScreens = (runtimeLaneJson?.screens ?? []).filter((screen) =>
          coreProductRouteIds.includes(screen.screenId),
        )

        if (!isDisposed) {
          setVisualStandard(visualStandardJson ?? null)
          setRuntimeLane({
            ...(runtimeLaneJson ?? { screens: [] }),
            screens: filteredRuntimeScreens,
          })
          setDeadCodeLane(
            deadCodeLaneJson ?? {
              status: 'missing-input',
              message: 'Dead-code lane output is missing.',
              findings: [],
              summary: {
                findingCount: 0,
                productFindingCount: 0,
                toolingFindingCount: 0,
                byRule: {},
                byScope: {},
                topFiles: [],
              },
              raw: {
                usage: {
                  entryRoots: {
                    product: [],
                    tooling: [],
                  },
                  closure: {
                    product: [],
                    tooling: [],
                    combined: [],
                  },
                  graphStatus: 'missing-input',
                  resolutionMode: 'relative-import-only',
                  unresolvedImportCount: 0,
                  unresolvedImports: [],
                  parsedFileCount: 0,
                  fallbackFileCount: 0,
                  failedFileCount: 0,
                },
                staleSuppressions: [],
                staleConfig: [],
                productVsTooling: {
                  product: 0,
                  tooling: 0,
                },
                byRule: {},
                topCandidateFiles: [],
              },
            },
          )
          setDuplicationLane(
            duplicationLaneJson ?? {
              status: 'missing-input',
              message: 'Duplication lane output is missing.',
              findings: [],
              summary: {
                findingCount: 0,
                productFindingCount: 0,
                toolingFindingCount: 0,
                byRule: {},
                byScope: {},
                clusterCount: 0,
                topFiles: [],
              },
              raw: {
                clusters: [],
                productVsTooling: {
                  product: 0,
                  tooling: 0,
                },
                byRule: {},
                topRepeatedFiles: [],
                parse: {
                  parsedFileCount: 0,
                  fallbackFileCount: 0,
                  failedFileCount: 0,
                },
              },
            },
          )
          setArchitectureLane(
            architectureLaneJson ?? {
              status: 'missing-input',
              message: 'Architecture lane output is missing.',
              findings: [],
              cycles: [],
              summary: {
                findingCount: 0,
                productFindingCount: 0,
                toolingFindingCount: 0,
                byRule: {},
                byScope: {},
                cycleCount: 0,
                topFiles: [],
              },
              raw: {
                graph: {
                  nodeCount: 0,
                  edgeCount: 0,
                  externalImportCount: 0,
                  unresolvedImportCount: 0,
                  unresolvedImports: [],
                  parsedFileCount: 0,
                  fallbackFileCount: 0,
                  failedFileCount: 0,
                  resolutionMode: 'relative-import-only',
                },
                topViolatingFiles: [],
                productVsTooling: {
                  product: 0,
                  tooling: 0,
                },
                byRule: {},
              },
            },
          )
          setSuiteSummary(suiteSummaryJson)
          setSuiteFindings(suiteFindingsJson)
        }
      } catch (nextError) {
        if (!isDisposed) {
          setError(nextError instanceof Error ? nextError.message : 'Unable to load audit data.')
        }
      }
    }

    load()

    return () => {
      isDisposed = true
      }
    }, [])

  return { visualStandard, runtimeLane, deadCodeLane, duplicationLane, architectureLane, suiteSummary, suiteFindings, error }
}

export default function QualityDashboardScreen({ route, shell }) {
  const { visualStandard, runtimeLane, deadCodeLane, duplicationLane, architectureLane, suiteSummary, suiteFindings, error } = useAuditData()
  const isLoading = !error && (!runtimeLane || !deadCodeLane || !duplicationLane || !architectureLane || !suiteSummary || !suiteFindings)

  const runtimeScreens = runtimeLane?.screens ?? []
  const allFindings = suiteFindings?.findings ?? []
  const staticScreens = useMemo(() => groupStaticScreenFindings(allFindings), [allFindings])
  const sharedFoundation = useMemo(() => getSharedFoundationSummary(allFindings), [allFindings])

  const runtimeFailureCount = useMemo(
    () => runtimeScreens.reduce((total, screen) => total + (screen.failingGateCount ?? 0), 0),
    [runtimeScreens],
  )
  const scoreSummary = suiteSummary?.scores ?? null
  const diffSummary = suiteSummary?.diff ?? null
  const suppressionSummary = suiteSummary?.suppressions ?? null
  const totalFindingCount = suiteSummary?.totals?.findings ?? 0
  const productDebtFindingCount = suiteSummary?.totals?.productDebtFindings ?? 0
  const toolingDebtFindingCount = suiteSummary?.totals?.toolingDebtFindings ?? 0
  const productQualityScore = scoreSummary?.productQuality ?? null
  const auditTrustScore = scoreSummary?.auditTrust ?? null
  const staleSuppressionCount = suppressionSummary?.staleCount ?? 0
  const suppressedFindingCount = suppressionSummary?.suppressedFindingCount ?? 0
  const activeSuppressionCount = suppressionSummary?.activeCount ?? 0
  const invalidSuppressionCount = suppressionSummary?.invalidCount ?? 0
  const liveScreenFindingCount = staticScreens.reduce((total, screen) => total + screen.findingCount, 0)
  const sharedFoundationFindingCount = sharedFoundation.findingCount
  const staticDoctrineFindings = allFindings.filter((finding) => finding.lane === 'static-doctrine')
  const architectureFindings = allFindings.filter((finding) => finding.lane === 'architecture')
  const deadCodeFindings = allFindings.filter((finding) => finding.lane === 'dead-code')
  const duplicationFindings = allFindings.filter((finding) => finding.lane === 'duplication')
  const bespokeCategories = countBy(staticDoctrineFindings, (finding) => finding.ruleId)
  const deadCodeCategories = countBy(deadCodeFindings, (finding) => finding.ruleId)
  const duplicationCategories = countBy(duplicationFindings, (finding) => finding.ruleId)
  const architectureCategories = countBy(architectureFindings, (finding) => finding.ruleId)
  const generatedAtLabel = suiteSummary?.generatedAt
    ? new Date(suiteSummary.generatedAt).toLocaleString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  const content = (
    <>
      <LabSection
        title="Hybrid Health"
        description="This board combines repo-truth from static audit with rendered-truth from runtime QA. The goal is to catch drift before it spreads across future screens."
        columns="repeat(4, minmax(0, 1fr))"
      >
        <StatCard
          label="Runtime screens"
          value={displayMetric(runtimeScreens.length, !isLoading)}
          note={isLoading ? 'Loading audit data.' : 'Generated by rendered screen QA and normalized into the audit suite.'}
        />
        <StatCard
          label="Runtime failing gates"
          value={displayMetric(runtimeFailureCount, !isLoading)}
          note={isLoading ? 'Loading audit data.' : 'Should trend to zero.'}
        />
        <StatCard
          label="Total audit findings"
          value={displayMetric(totalFindingCount, !isLoading)}
          note={isLoading ? 'Loading audit data.' : 'Combined normalized findings from the audit suite source of truth.'}
        />
        <StatCard
          label="Product debt findings"
          value={displayMetric(productDebtFindingCount, !isLoading)}
          note={isLoading ? 'Loading audit data.' : 'Live product screens plus shared product foundation only.'}
        />
        <StatCard
          label="Tooling debt findings"
          value={displayMetric(toolingDebtFindingCount, !isLoading)}
          note={isLoading
            ? 'Loading audit data.'
            : 'Dashboard, debug, lab and audit-framework findings, kept separate from product debt. Lane data below is historical — the live gate is the visual standard above.'}
        />
        <StatCard
          label="Visual standard (live)"
          value={visualStandard ? String(visualStandard.blocking) : '—'}
          note={visualStandard
            ? `${visualStandard.routes} routes x ${visualStandard.frames} frames, ${new Date(visualStandard.generatedAt).toLocaleDateString()}. Run: npm run qa`
            : 'Run npm run qa to publish a current result.'}
        />
        <StatCard
          label="Product-quality score"
          value={displayOptionalMetric(productQualityScore, !isLoading)}
          note={isLoading ? 'Loading audit data.' : 'Decomposed from doctrine, runtime, architecture, dead-code, and duplication hygiene.'}
        />
        <StatCard
          label="Audit-trust score"
          value={displayOptionalMetric(auditTrustScore, !isLoading)}
          note={isLoading ? 'Loading audit data.' : 'Tracks audit-rule debt, degraded lanes, and suppression hygiene separately from product quality.'}
        />
        <StatCard
          label="Stale suppressions"
          value={displayOptionalMetric(suppressionSummary?.staleCount ?? null, !isLoading)}
          note={isLoading ? 'Loading audit data.' : 'These lower audit trust and should not remain silently configured.'}
        />
        <StatCard
          label="Live screen findings"
          value={displayMetric(liveScreenFindingCount, !isLoading)}
          note={isLoading ? 'Loading audit data.' : 'Static audit findings on live/core screens only.'}
        />
        <StatCard
          label="Shared generics findings"
          value={displayMetric(sharedFoundationFindingCount, !isLoading)}
          note={isLoading ? 'Loading audit data.' : 'Reusable primitives, layout, tokens, and contracts used to build live screens.'}
        />
        <StatCard
          label="Top bespoke category"
          value={
            isLoading
              ? '—'
              : Object.entries(bespokeCategories).sort((left, right) => right[1] - left[1])[0]?.[0]?.replace(/-/g, ' ') ??
                'none'
          }
          note={isLoading ? 'Loading audit data.' : 'This is where doctrine drift is currently loudest.'}
        />
      </LabSection>

      <LabSection
        title="Trust + Trend"
        description="Scores, baseline diffing, and suppression hygiene stay secondary to raw findings, but they should make the suite explainable and trendable over time."
        columns="repeat(3, minmax(0, 1fr))"
      >
        <SurfaceCard tone={scoreStatus(productQualityScore) === 'fail' ? 'warning' : 'default'}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12] }}>
            <div style={{ display: 'grid', gap: spacing[6] }}>
              <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Scores</p>
              <p style={{ ...typography.bodyText, margin: 0, color: colors.textStrong }}>
                Product quality {displayOptionalMetric(productQualityScore, !isLoading)} / audit trust {displayOptionalMetric(auditTrustScore, !isLoading)}
              </p>
            </div>
            <StatusChip status={scoreStatus(productQualityScore)} label="product" />
          </div>

          <div style={{ display: 'grid', gap: spacing[8] }}>
            {(scoreSummary?.groups ?? []).map((group) => (
              <div
                key={group.id}
                style={{
                  border: `1px solid ${colors.lineSoft}`,
                  borderRadius: radius[16],
                  background: 'rgba(248, 251, 255, 0.86)',
                  padding: spacing[12],
                  display: 'grid',
                  gap: spacing[8],
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[8] }}>
                  <p style={{ ...typography.bodyText, margin: 0, color: colors.textStrong }}>{group.label}</p>
                  <StatusChip status={scoreStatus(group.score)} label={String(group.score)} />
                </div>
                <div style={{ display: 'grid', gap: spacing[6] }}>
                  {group.components.map((component) => (
                    <div key={component.id} style={{ display: 'grid', gap: spacing[4] }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[8] }}>
                        <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>{component.label}</p>
                        <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>
                          {component.score} / 100
                        </p>
                      </div>
                      <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>
                        debt {component.weightedDebt} vs budget {component.budget}, findings {component.findingCount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {!isLoading && (scoreSummary?.groups ?? []).length === 0 ? (
              <p style={{ ...typography.bodyText, margin: 0, color: colors.textSoft }}>No score data yet.</p>
            ) : null}
          </div>
        </SurfaceCard>

        <SurfaceCard tone={diffSummary?.status === 'ready' ? 'default' : 'warning'}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12] }}>
            <div style={{ display: 'grid', gap: spacing[6] }}>
              <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Baseline diff</p>
              <p style={{ ...typography.bodyText, margin: 0, color: colors.textStrong }}>
                {diffSummary?.status === 'ready' ? 'Compared against the previous suite baseline.' : 'No clean comparison baseline available yet.'}
              </p>
            </div>
            <StatusChip status={diffSummary?.status === 'ready' ? 'pass' : 'unknown'} label={diffSummary?.status ?? 'loading'} />
          </div>

          <div style={{ display: 'grid', gap: spacing[8] }}>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textSoft }}>
              New {displayOptionalMetric(diffSummary?.new ?? null, !isLoading)}, resolved {displayOptionalMetric(diffSummary?.resolved ?? null, !isLoading)}, persisted {displayOptionalMetric(diffSummary?.persisted ?? null, !isLoading)}, changed {displayOptionalMetric(diffSummary?.changed ?? null, !isLoading)}
            </p>
            <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>
              Changed fields: severity {displayOptionalMetric(diffSummary?.changedByField?.severity ?? null, !isLoading)}, confidence {displayOptionalMetric(diffSummary?.changedByField?.confidence ?? null, !isLoading)}, classification {displayOptionalMetric(diffSummary?.changedByField?.classification ?? null, !isLoading)}, suppression {displayOptionalMetric(diffSummary?.changedByField?.suppression ?? null, !isLoading)}
            </p>
            {diffSummary?.message ? (
              <p style={{ ...typography.bodyText, margin: 0, color: colors.accentBase }}>{diffSummary.message}</p>
            ) : null}
          </div>

          <div style={{ display: 'grid', gap: spacing[8] }}>
            <div style={{ display: 'grid', gap: spacing[6] }}>
              <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Biggest regressions</p>
              {(diffSummary?.topRegressions ?? []).slice(0, 4).map((entry) => (
                <StatusChip key={`${entry.kind}:${entry.key}`} status="fail" label={formatDeltaLabel(entry)} />
              ))}
              {!isLoading && (diffSummary?.topRegressions ?? []).length === 0 ? (
                <p style={{ ...typography.bodyText, margin: 0, color: colors.textSoft }}>No regression deltas surfaced.</p>
              ) : null}
            </div>
            <div style={{ display: 'grid', gap: spacing[6] }}>
              <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Biggest improvements</p>
              {(diffSummary?.topImprovements ?? []).slice(0, 4).map((entry) => (
                <StatusChip key={`${entry.kind}:${entry.key}`} status="pass" label={formatDeltaLabel(entry)} />
              ))}
              {!isLoading && (diffSummary?.topImprovements ?? []).length === 0 ? (
                <p style={{ ...typography.bodyText, margin: 0, color: colors.textSoft }}>No improvement deltas surfaced.</p>
              ) : null}
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard tone={staleSuppressionCount > 0 || invalidSuppressionCount > 0 ? 'warning' : 'default'}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12] }}>
            <div style={{ display: 'grid', gap: spacing[6] }}>
              <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Suppression hygiene</p>
              <p style={{ ...typography.bodyText, margin: 0, color: colors.textStrong }}>
                Configured {displayOptionalMetric(suppressionSummary?.configuredCount ?? null, !isLoading)}, active {displayOptionalMetric(activeSuppressionCount, !isLoading)}, suppressed findings {displayOptionalMetric(suppressedFindingCount, !isLoading)}
              </p>
            </div>
            <StatusChip
              status={staleSuppressionCount > 0 || invalidSuppressionCount > 0 ? 'fail' : 'pass'}
              label={`${displayOptionalMetric(staleSuppressionCount + invalidSuppressionCount, !isLoading)} issues`}
            />
          </div>

          <div style={{ display: 'grid', gap: spacing[8] }}>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textSoft }}>
              Stale suppressions {displayOptionalMetric(staleSuppressionCount, !isLoading)}, invalid suppressions {displayOptionalMetric(invalidSuppressionCount, !isLoading)}
            </p>
            <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>
              Suppressed by lane: {Object.entries(suppressionSummary?.byLane ?? {})
                .map(([lane, count]) => `${lane}=${count}`)
                .join(', ') || 'none'}
            </p>
            {(suppressionSummary?.staleIds ?? []).slice(0, 4).map((id) => (
              <StatusChip key={id} status="fail" label={id} />
            ))}
            {!isLoading && (suppressionSummary?.staleIds ?? []).length === 0 ? (
              <p style={{ ...typography.bodyText, margin: 0, color: colors.textSoft }}>No stale suppressions surfaced in the current suite run.</p>
            ) : null}
          </div>
        </SurfaceCard>
      </LabSection>

      <LabSection
        title="Dead Code"
        description="Conservative repo hygiene checks for unused files, unused exports, stale suppressions, and stale audit config. This lane is confidence-aware and stays separate from doctrine and architecture."
        columns="repeat(2, minmax(0, 1fr))"
      >
        {isLoading ? (
          <SurfaceCard tone="warning">
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Loading dead-code lane</p>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
              Waiting for dead-code lane JSON before showing unused/stale candidates.
            </p>
          </SurfaceCard>
        ) : deadCodeLane ? (
          <>
            <SurfaceCard tone={deadCodeLane.status === 'ready' ? 'default' : 'warning'}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12] }}>
                <div style={{ display: 'grid', gap: spacing[6] }}>
                  <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Dead-code lane</p>
                  <p style={{ ...typography.bodyText, margin: 0, color: colors.textStrong }}>
                    {deadCodeLane.summary.findingCount} finding(s), product vs tooling {deadCodeLane.summary.productFindingCount} /{' '}
                    {deadCodeLane.summary.toolingFindingCount}
                  </p>
                </div>
                <StatusChip status={deadCodeLane.status === 'ready' ? 'pass' : 'fail'} label={deadCodeLane.status} />
              </div>

              <div style={{ display: 'grid', gap: spacing[6] }}>
                <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>
                  {deadCodeLane.raw.usage.closure.combined.length} reachable file(s), resolution mode {deadCodeLane.raw.usage.resolutionMode}
                </p>
                <p style={{ ...typography.bodyText, margin: 0, color: colors.textSoft }}>
                  Unresolved imports: {deadCodeLane.raw.usage.unresolvedImportCount}, stale suppressions: {deadCodeLane.raw.staleSuppressions.length}, stale config paths: {deadCodeLane.raw.staleConfig.length}
                </p>
                {deadCodeLane.message ? (
                  <p style={{ ...typography.bodyText, margin: 0, color: colors.accentBase }}>{deadCodeLane.message}</p>
                ) : null}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[8] }}>
                {Object.entries(deadCodeCategories)
                  .sort((left, right) => right[1] - left[1])
                  .slice(0, 6)
                  .map(([category, count]) => (
                    <StatusChip key={category} status="unknown" label={`${category}: ${count}`} />
                  ))}
              </div>
            </SurfaceCard>

            <SurfaceCard tone={deadCodeLane.summary.findingCount > 0 ? 'warning' : 'default'}>
              <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Top candidate files</p>
              <div style={{ display: 'grid', gap: spacing[8] }}>
                {(deadCodeLane.summary.topFiles ?? []).slice(0, 5).map((entry) => (
                  <div
                    key={entry.file}
                    style={{
                      border: `1px solid ${colors.lineSoft}`,
                      borderRadius: radius[16],
                      background: 'rgba(248, 251, 255, 0.86)',
                      padding: spacing[12],
                      display: 'grid',
                      gap: spacing[6],
                    }}
                  >
                    <p style={{ ...typography.bodyText, margin: 0, color: colors.textStrong }}>{entry.file}</p>
                    <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>{entry.count} finding(s)</p>
                  </div>
                ))}
                {deadCodeLane.summary.topFiles.length === 0 ? (
                  <p style={{ ...typography.bodyText, margin: 0, color: colors.textSoft }}>No current dead-code findings.</p>
                ) : null}
              </div>
            </SurfaceCard>
          </>
        ) : (
          <SurfaceCard tone="warning">
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Missing dead-code lane</p>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
              Run `npm run audit:suite` to regenerate dead-code-audit JSON for this board.
            </p>
          </SurfaceCard>
        )}
      </LabSection>

      <LabSection
        title="Architecture"
        description="Policy-backed import hygiene for layer boundaries, product-tooling leakage, cycles, and unknown architecture risk. This stays separate from doctrine and rendered QA."
        columns="repeat(2, minmax(0, 1fr))"
      >
        {isLoading ? (
          <SurfaceCard tone="warning">
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Loading architecture lane</p>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
              Waiting for architecture lane JSON before showing dependency hygiene.
            </p>
          </SurfaceCard>
        ) : architectureLane ? (
          <>
            <SurfaceCard tone={architectureLane.status === 'ready' ? 'default' : 'warning'}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12] }}>
                <div style={{ display: 'grid', gap: spacing[6] }}>
                  <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Architecture lane</p>
                  <p style={{ ...typography.bodyText, margin: 0, color: colors.textStrong }}>
                    {architectureLane.summary.findingCount} findings, {architectureLane.summary.cycleCount} cycle cluster
                    {architectureLane.summary.cycleCount === 1 ? '' : 's'}
                  </p>
                </div>
                <StatusChip status={architectureLane.status === 'ready' ? 'pass' : 'fail'} label={architectureLane.status} />
              </div>

              <div style={{ display: 'grid', gap: spacing[6] }}>
                <p style={{ ...typography.bodyText, margin: 0, color: colors.textSoft }}>
                  Product vs tooling: {architectureLane.summary.productFindingCount} / {architectureLane.summary.toolingFindingCount}
                </p>
                <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>
                  {architectureLane.raw.graph.nodeCount} nodes, {architectureLane.raw.graph.edgeCount} edges, resolution mode{' '}
                  {architectureLane.raw.graph.resolutionMode}
                </p>
                {architectureLane.message ? (
                  <p style={{ ...typography.bodyText, margin: 0, color: colors.accentBase }}>{architectureLane.message}</p>
                ) : null}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[8] }}>
                {Object.entries(architectureCategories)
                  .sort((left, right) => right[1] - left[1])
                  .slice(0, 6)
                  .map(([category, count]) => (
                    <StatusChip key={category} status="unknown" label={`${category}: ${count}`} />
                  ))}
              </div>
            </SurfaceCard>

            <SurfaceCard tone={architectureLane.summary.findingCount > 0 ? 'warning' : 'default'}>
              <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Top violating files</p>
              <div style={{ display: 'grid', gap: spacing[8] }}>
                {(architectureLane.summary.topFiles ?? []).slice(0, 5).map((entry) => (
                  <div
                    key={entry.file}
                    style={{
                      border: `1px solid ${colors.lineSoft}`,
                      borderRadius: radius[16],
                      background: 'rgba(248, 251, 255, 0.86)',
                      padding: spacing[12],
                      display: 'grid',
                      gap: spacing[6],
                    }}
                  >
                    <p style={{ ...typography.bodyText, margin: 0, color: colors.textStrong }}>{entry.file}</p>
                    <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>{entry.count} finding(s)</p>
                  </div>
                ))}
                {architectureLane.summary.topFiles.length === 0 ? (
                  <p style={{ ...typography.bodyText, margin: 0, color: colors.textSoft }}>No current architecture findings.</p>
                ) : null}
              </div>
            </SurfaceCard>
          </>
        ) : (
          <SurfaceCard tone="warning">
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Missing architecture lane</p>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
              Run `npm run audit:suite` to regenerate architecture-audit JSON for this board.
            </p>
          </SurfaceCard>
        )}
      </LabSection>

      <LabSection
        title="Duplication"
        description="High-signal repeated-pattern checks for repeated surface bundles, shell math, contract fragments, and shared primitive variant drift."
        columns="repeat(2, minmax(0, 1fr))"
      >
        {isLoading ? (
          <SurfaceCard tone="warning">
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Loading duplication lane</p>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
              Waiting for duplication lane JSON before showing repeated-pattern clusters.
            </p>
          </SurfaceCard>
        ) : duplicationLane ? (
          <>
            <SurfaceCard tone={duplicationLane.status === 'ready' ? 'default' : 'warning'}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12] }}>
                <div style={{ display: 'grid', gap: spacing[6] }}>
                  <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Duplication lane</p>
                  <p style={{ ...typography.bodyText, margin: 0, color: colors.textStrong }}>
                    {duplicationLane.summary.findingCount} findings, {duplicationLane.summary.clusterCount} cluster
                    {duplicationLane.summary.clusterCount === 1 ? '' : 's'}
                  </p>
                </div>
                <StatusChip status={duplicationLane.status === 'ready' ? 'pass' : 'fail'} label={duplicationLane.status} />
              </div>

              <div style={{ display: 'grid', gap: spacing[6] }}>
                <p style={{ ...typography.bodyText, margin: 0, color: colors.textSoft }}>
                  Product vs tooling: {duplicationLane.summary.productFindingCount} / {duplicationLane.summary.toolingFindingCount}
                </p>
                <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>
                  Parsed {duplicationLane.raw.parse.parsedFileCount} file(s), fallback {duplicationLane.raw.parse.fallbackFileCount}
                </p>
                {duplicationLane.message ? (
                  <p style={{ ...typography.bodyText, margin: 0, color: colors.accentBase }}>{duplicationLane.message}</p>
                ) : null}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[8] }}>
                {Object.entries(duplicationCategories)
                  .sort((left, right) => right[1] - left[1])
                  .slice(0, 6)
                  .map(([category, count]) => (
                    <StatusChip key={category} status="unknown" label={`${category}: ${count}`} />
                  ))}
              </div>
            </SurfaceCard>

            <SurfaceCard tone={duplicationLane.summary.findingCount > 0 ? 'warning' : 'default'}>
              <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Top repeated files</p>
              <div style={{ display: 'grid', gap: spacing[8] }}>
                {(duplicationLane.summary.topFiles ?? []).slice(0, 5).map((entry) => (
                  <div
                    key={entry.file}
                    style={{
                      border: `1px solid ${colors.lineSoft}`,
                      borderRadius: radius[16],
                      background: 'rgba(248, 251, 255, 0.86)',
                      padding: spacing[12],
                      display: 'grid',
                      gap: spacing[6],
                    }}
                  >
                    <p style={{ ...typography.bodyText, margin: 0, color: colors.textStrong }}>{entry.file}</p>
                    <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>{entry.count} cluster(s)</p>
                  </div>
                ))}
                {duplicationLane.summary.topFiles.length === 0 ? (
                  <p style={{ ...typography.bodyText, margin: 0, color: colors.textSoft }}>No current duplication findings.</p>
                ) : null}
              </div>
            </SurfaceCard>
          </>
        ) : (
          <SurfaceCard tone="warning">
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Missing duplication lane</p>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
              Run `npm run audit:suite` to regenerate duplication-audit JSON for this board.
            </p>
          </SurfaceCard>
        )}
      </LabSection>

      <LabSection
        title="Runtime QA"
        description="Rendered screen truth at canonical desktop frames and viewport-stress states. These rows should be the final behavioral check before approving a screen."
        columns="repeat(2, minmax(0, 1fr))"
      >
        {isLoading ? (
          <SurfaceCard tone="warning">
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Loading runtime data</p>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
              Waiting for runtime QA and static audit JSON to load before rendering metrics.
            </p>
          </SurfaceCard>
        ) : runtimeScreens.length > 0 ? (
          runtimeScreens.map((screen) => (
            <button
              key={screen.screenId}
              type="button"
              onClick={() => shell.navigate(screen.screenId)}
              style={{
                border: `1px solid ${colors.lineSoft}`,
                borderRadius: radius[24],
                background: 'rgba(255, 255, 255, 0.98)',
                boxShadow: elevation.flat,
                padding: spacing[6],
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  borderRadius: radius[20],
                  padding: spacing[16],
                  display: 'grid',
                  gap: spacing[12],
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12] }}>
                  <div style={{ display: 'grid', gap: spacing[6] }}>
                    <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Runtime screen</p>
                    <p style={{ ...typography.bodyText, margin: 0, color: colors.textStrong }}>{screen.screenId}</p>
                  </div>
                  <StatusChip status={screen.status} />
                </div>

                <div style={{ display: 'grid', gap: spacing[6] }}>
                  <p style={{ ...typography.bodyText, margin: 0, color: colors.textSoft }}>
                    {screen.coverage.viewportCount} viewports, {screen.coverage.viewportStressCount} viewport-stress states
                  </p>
                  <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>
                    {screen.coverage.stressLabel} via {screen.coverage.stressMode}
                  </p>
                  {screen.inputStatus?.report && screen.inputStatus.report !== 'ready' ? (
                    <p style={{ ...typography.bodyText, margin: 0, color: colors.accentBase }}>
                      Runtime input {screen.inputStatus.report}: {screen.inputStatus.message ?? 'no detail'}
                    </p>
                  ) : null}
                </div>

                <div
                  style={{
                    border: `1px solid ${colors.lineSoft}`,
                    borderRadius: radius[16],
                    overflow: 'hidden',
                    background: 'rgba(248, 251, 255, 0.86)',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '160px 88px minmax(0, 1fr)',
                      padding: `${spacing[8]} ${spacing[12]}`,
                      gap: spacing[12],
                      borderBottom: `1px solid ${colors.lineSoft}`,
                    }}
                  >
                    <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Check</p>
                    <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Status</p>
                    <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Note</p>
                  </div>

                  {screen.gateRows.map((row, index, rows) => (
                    <div
                      key={`${screen.screenId}-${row.scopeLabel}-${row.ruleId}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '160px 88px minmax(0, 1fr)',
                        padding: `${spacing[10]} ${spacing[12]}`,
                        gap: spacing[12],
                        borderBottom: index < rows.length - 1 ? `1px solid ${colors.lineSoft}` : 'none',
                        alignItems: 'start',
                      }}
                    >
                      <div style={{ display: 'grid', gap: spacing[4] }}>
                        <p style={{ ...typography.bodyText, margin: 0, color: colors.textStrong }}>{row.title}</p>
                        <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>{row.scopeLabel}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <StatusChip status={row.pass ? 'pass' : 'fail'} label={row.pass ? 'Pass' : 'Fail'} />
                      </div>
                      <p style={{ ...typography.bodyText, margin: 0, color: colors.textSoft }}>{row.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </button>
          ))
        ) : (
          <SurfaceCard tone="warning">
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Missing runtime data</p>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
              Run `npm run qa:screen -- segmentationPasteNext` and then `npm run audit:suite` to refresh the normalized runtime lane for this board.
            </p>
          </SurfaceCard>
        )}
      </LabSection>

      <LabSection
        title="Static Audit"
        description="Normalized static-doctrine findings for live/core product screens only. This section now reads from audit-suite outputs rather than the legacy static audit payload."
        columns="repeat(2, minmax(0, 1fr))"
      >
        {isLoading ? (
          <SurfaceCard tone="warning">
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Loading static audit</p>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
              Waiting for static audit JSON to load before showing live screen findings.
            </p>
          </SurfaceCard>
        ) : staticScreens.length > 0 ? (
          staticScreens.map((screen) => (
            <SurfaceCard key={screen.screenId} tone={screen.findingCount > 0 ? 'warning' : 'default'}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12] }}>
                <div style={{ display: 'grid', gap: spacing[6] }}>
                  <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Static screen audit</p>
                  <p style={{ ...typography.bodyText, margin: 0, color: colors.textStrong }}>{screen.screenId}</p>
                </div>
                <StatusChip status={screen.findingCount > 0 ? 'fail' : 'pass'} label={`${screen.findingCount} findings`} />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[8] }}>
                {Object.entries(screen.categories).length > 0 ? (
                  Object.entries(screen.categories)
                    .sort((left, right) => right[1] - left[1])
                    .slice(0, 6)
                    .map(([category, count]) => <StatusChip key={category} status="unknown" label={`${category}: ${count}`} />)
                ) : (
                  <StatusChip status="pass" label="clean" />
                )}
              </div>

              {screen.findings.length > 0 ? (
                <div style={{ display: 'grid', gap: spacing[8] }}>
                  {screen.findings.slice(0, 3).map((finding) => (
                    <div
                      key={`${finding.file}:${finding.line}:${finding.ruleId}`}
                      style={{
                        border: `1px solid ${colors.lineSoft}`,
                        borderRadius: radius[16],
                        background: 'rgba(248, 251, 255, 0.86)',
                        padding: spacing[12],
                        display: 'grid',
                        gap: spacing[6],
                      }}
                    >
                      <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.accentBase }}>{finding.ruleId}</p>
                      <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>{finding.message}</p>
                      <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>
                        {finding.file}:{finding.line}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </SurfaceCard>
          ))
        ) : (
          <SurfaceCard tone="warning">
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Missing static audit</p>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
              Run `npm run audit:static` to generate the repo-inspected audit JSON for this board.
            </p>
          </SurfaceCard>
        )}
      </LabSection>

      <LabSection
        title="Shared Generics"
        description="This is the reusable implementation layer that feeds live screens directly: shared primitives, layout, tokens, and contracts. The counts and findings here come from the normalized suite outputs."
        columns="repeat(2, minmax(0, 1fr))"
      >
        <SurfaceCard tone={sharedFoundationFindingCount > 0 ? 'warning' : 'default'}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12] }}>
            <div style={{ display: 'grid', gap: spacing[6] }}>
              <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Generic-layer audit</p>
              <p style={{ ...typography.bodyText, margin: 0, color: colors.textStrong }}>Shared primitives, layout, tokens, contracts</p>
            </div>
            <StatusChip
              status={sharedFoundationFindingCount > 0 ? 'fail' : 'pass'}
              label={`${sharedFoundationFindingCount} findings`}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[8] }}>
            {Object.entries(sharedFoundation.byCategory ?? {})
              .sort((left, right) => right[1] - left[1])
              .slice(0, 6)
              .map(([category, count]) => (
                <StatusChip key={category} status="unknown" label={`${category}: ${count}`} />
              ))}
          </div>

          <div style={{ display: 'grid', gap: spacing[8] }}>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textSoft }}>
              {isLoading
                ? 'Waiting for shared generic audit data.'
                : `Showing the first ${Math.min((sharedFoundation.findings ?? []).length, 4)} of ${sharedFoundationFindingCount} shared findings.`}
            </p>
            {!isLoading &&
              (sharedFoundation.findings ?? []).slice(0, 4).map((finding) => (
              <div
                key={`${finding.file}:${finding.line}:${finding.ruleId}`}
                style={{
                  border: `1px solid ${colors.lineSoft}`,
                  borderRadius: radius[16],
                  background: 'rgba(248, 251, 255, 0.86)',
                  padding: spacing[12],
                  display: 'grid',
                  gap: spacing[6],
                }}
              >
                <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.accentBase }}>{finding.ruleId}</p>
                <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>{finding.message}</p>
                <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>
                  {finding.file}:{finding.line}
                </p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </LabSection>

      {error ? (
        <LabSection title="Load Error" description="The board could not load generated audit data." columns="minmax(0, 1fr)">
          <SurfaceCard tone="warning">
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>{error}</p>
          </SurfaceCard>
        </LabSection>
      ) : null}
    </>
  )

  const rightRail = (
    <>
      <SurfaceCard>
        <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Health model</p>
        <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
          Static audit inspects repo code directly. Runtime QA checks rendered behavior. This board audits live/core
          product screens plus the shared generic layer that those screens actually implement.
        </p>
        {generatedAtLabel ? (
          <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>Generated: {generatedAtLabel}</p>
        ) : null}
        {!isLoading ? (
          <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>
            Product vs tooling: {productDebtFindingCount} / {toolingDebtFindingCount}
          </p>
        ) : null}
        {!isLoading ? (
          <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>
            Scores: {displayOptionalMetric(productQualityScore, true)} product / {displayOptionalMetric(auditTrustScore, true)} trust
          </p>
        ) : null}
      </SurfaceCard>
      <SurfaceCard>
        <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Required closure</p>
        <div style={{ display: 'grid', gap: spacing[8] }}>
          {['Build pass', 'Runtime QA pass', 'Zero orphan overrides', 'Zero contract/container mismatches'].map((item) => (
            <p key={item} style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
              {item}
            </p>
          ))}
        </div>
        {!isLoading ? (
          <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>
            Baseline: {suiteSummary?.baseline?.status ?? 'unknown'}, stale suppressions: {staleSuppressionCount}
          </p>
        ) : null}
      </SurfaceCard>
    </>
  )

  return (
    <LabScaffold
      contract={layoutContract}
      route={route}
      shell={shell}
      eyebrow="Hybrid quality"
      title="Audit screens from repo truth and rendered truth."
      intro="This board is our engineering support surface. It should tell us which screens pass, where bespoke debt exists, and whether contracts and rendered containers still agree."
      content={content}
      rightRail={rightRail}
    />
  )
}
