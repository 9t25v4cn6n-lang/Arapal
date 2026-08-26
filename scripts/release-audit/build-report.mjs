// Reviewed render index for the release-evidence package (S3-006).
//
// Binds the index to the exact candidate (SHA + built-asset hash), separates the
// fail-closed REQUIRED tier from the recorded REFERENCE tier, flags any required
// failure in red, surfaces per-state page/request errors, and lists the external
// verification (deploy/smoke/rollback/monitoring/live-key) that this harness
// deliberately does not fabricate.

import fs from 'node:fs'
import path from 'node:path'

const root = process.argv[2] || 'artifacts/release-audit/evidence'
if (!fs.existsSync(root)) {
  console.log(`No evidence at ${root}`)
  process.exit(0)
}

const readJson = (p, fallback = null) => {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')) } catch { return fallback }
}
const walk = (dir) => (fs.existsSync(dir)
  ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })
  : [])

const candidate = readJson(path.join(root, 'candidate.json'))
const plan = readJson(path.join(root, 'capture-plan.json'))

const collect = (tier) => walk(path.join(root, tier))
  .filter((p) => p.endsWith('status.json'))
  .map((p) => ({ dir: path.dirname(path.relative(root, p)).replaceAll('\\', '/'), ...readJson(p, {}) }))

const required = collect('required')
const reference = collect('reference')

// Cross-check against the EXPECTED required matrix (journeys × viewports) from the
// capture plan. A required capture that threw before writing any status.json would
// otherwise be invisible; here it is surfaced as an explicit MISSING/RED row so
// the index can never look complete while a required capture never ran.
const expectedRequired = []
for (const j of plan?.requiredJourneys ?? []) {
  for (const v of plan?.requiredViewports ?? []) {
    expectedRequired.push({ journey: j.id, viewportId: v.id })
  }
}
const seen = new Set(required.map((s) => `${s.journey}::${s.viewport?.id}`))
for (const exp of expectedRequired) {
  if (!seen.has(`${exp.journey}::${exp.viewportId}`)) {
    required.push({
      dir: '', journey: exp.journey, viewport: { id: exp.viewportId },
      status: 'MISSING', reached: false, onOwnScreen: false, pageErrors: [], failedRequests: [],
    })
  }
}

// A required capture is GREEN only if it reached, stayed on its own screen, and
// raised no page/request errors. (The spec already fails the run on these; this
// re-derives the same verdict so the index cannot look green while the run was red.)
const requiredOk = (s) => s.status === 'CAPTURED' && s.onOwnScreen === true
  && (s.pageErrors?.length ?? 0) === 0 && (s.failedRequests?.length ?? 0) === 0
const requiredPass = required.filter(requiredOk)
const requiredFail = required.filter((s) => !requiredOk(s))

const refReached = reference.filter((s) => s.status === 'CAPTURED')
const refUnreachable = reference.filter((s) => s.status === 'UNREACHABLE')
const refWrongScreen = refReached.filter((s) => s.onOwnScreen === false)

const gateGreen = requiredFail.length === 0 && refWrongScreen.length === 0 && required.length > 0

const esc = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
const shot = (dir) => fs.existsSync(path.join(root, dir, 'screen.png')) ? `<a href="${dir}/screen.png">render</a>` : '—'
const runtimeLink = (dir) => fs.existsSync(path.join(root, dir, 'runtime.json')) ? ` · <a href="${dir}/runtime.json">runtime</a>` : ''

const requiredRow = (s) => {
  const ok = requiredOk(s)
  const problems = []
  if (!s.reached) problems.push('UNREACHABLE')
  if (s.onOwnScreen === false) problems.push(`wrong screen (#${esc(s.settledHash)})`)
  if (s.pageErrors?.length) problems.push(`${s.pageErrors.length} page error(s)`)
  if (s.failedRequests?.length) problems.push(`${s.failedRequests.length} failed request(s)`)
  return `<tr class="${ok ? 'ok' : 'bad'}">
    <td>${esc(s.journey)}</td><td>${esc(s.viewport?.id)}</td>
    <td>${ok ? 'GREEN' : 'RED'}</td>
    <td>${problems.length ? esc(problems.join('; ')) : 'reached · on-screen · error-free'}</td>
    <td>${shot(s.dir)}${runtimeLink(s.dir)}</td></tr>`
}

const referenceRow = (s) => {
  const cls = s.status === 'UNREACHABLE' ? 'warn' : (s.onOwnScreen === false ? 'bad' : '')
  return `<tr class="${cls}">
    <td>${esc(s.state)}</td><td>${esc(s.viewport?.id)}</td>
    <td>${esc(s.status)}${s.onOwnScreen === false ? ' · WRONG SCREEN' : ''}</td>
    <td>${s.status === 'CAPTURED' ? shot(s.dir) + runtimeLink(s.dir) : '—'}</td></tr>`
}

const g = candidate?.git ?? {}
const extList = (candidate?.externalVerificationStillRequired ?? []).map((x) => `<li>${esc(x)}</li>`).join('')

const html = `<!doctype html><meta charset="utf-8"><title>Arapal release evidence — ${esc(g.shortSha || 'candidate')}</title>
<style>
  body{font:14px/1.5 system-ui,sans-serif;margin:32px;color:#111827;max-width:1200px}
  h1{margin:0 0 4px} h2{margin-top:34px;border-bottom:1px solid #e5e7eb;padding-bottom:6px}
  .verdict{display:inline-block;padding:6px 14px;border-radius:6px;font-weight:700;color:#fff}
  .green{background:#16a34a} .red{background:#dc2626}
  table{border-collapse:collapse;width:100%;margin-top:10px}
  td,th{border:1px solid #d1d5db;padding:6px 8px;text-align:left;vertical-align:top}
  th{background:#f3f4f6;position:sticky;top:0}
  tr.ok td:nth-child(3){color:#16a34a;font-weight:700}
  tr.bad{background:#fef2f2} tr.bad td:nth-child(3){color:#dc2626;font-weight:700}
  tr.warn{background:#fffbeb}
  code{background:#f3f4f6;padding:1px 5px;border-radius:3px;font-size:12px;word-break:break-all}
  a{color:#1d4ed8} .meta{color:#6b7280}
  ul{margin:8px 0}
</style>
<h1>Arapal Release Evidence</h1>
<p><span class="verdict ${gateGreen ? 'green' : 'red'}">${gateGreen ? 'REQUIRED GATE GREEN' : 'REQUIRED GATE RED'}</span></p>

<h2>Candidate</h2>
<table>
  <tr><th>Commit</th><td><code>${esc(g.sha || 'unknown')}</code> (${esc(g.shortSha)}) on <code>${esc(g.branch)}</code>${g.dirty ? ` · <b style="color:#dc2626">working tree dirty (${g.dirtyFiles} file(s))</b>` : ' · clean tree'}</td></tr>
  <tr><th>Build hash</th><td><code>${esc(candidate?.buildHash || 'unknown')}</code></td></tr>
  <tr><th>Entry asset</th><td><code>${esc(candidate?.entryAsset || 'unknown')}</code> · ${candidate?.assetCount ?? '?'} built files</td></tr>
  <tr><th>Served from</th><td><code>${esc(candidate?.servedFrom || plan?.servedFrom || 'unknown')}</code> (built dist)</td></tr>
  <tr><th>Mode</th><td>${esc(candidate?.mode || 'full')} · captured ${esc(candidate?.generatedAt || '')}</td></tr>
</table>

<h2>Required journeys — fail-closed @ 390 / 768 / 1280 / 1440</h2>
<p class="meta">${requiredPass.length}/${required.length} green. Unreachable, wrong-route, page error, failed request, or timeout fails the run.</p>
<table><thead><tr><th>Journey</th><th>Width</th><th>Verdict</th><th>Checks</th><th>Evidence</th></tr></thead>
<tbody>${required.sort((a, b) => (a.journey + a.viewport?.id).localeCompare(b.journey + b.viewport?.id)).map(requiredRow).join('\n')}</tbody></table>

<h2>Reference surface — recorded</h2>
<p class="meta">${refReached.length} captured, ${refUnreachable.length} unreachable, ${refWrongScreen.length} wrong-screen. Recorded for completeness; a reached reference state that landed on the wrong screen still fails.</p>
<table><thead><tr><th>State</th><th>Width</th><th>Status</th><th>Evidence</th></tr></thead>
<tbody>${reference.sort((a, b) => (a.state + a.viewport?.id).localeCompare(b.state + b.viewport?.id)).map(referenceRow).join('\n')}</tbody></table>

<h2>Reviewed render checklist</h2>
<p class="meta">A green capture is a necessary, not sufficient, signal. Human product review of the required renders above is required before release: composition, hierarchy, copy honesty, and no fixture bleed at each width.</p>

<h2>External verification still required</h2>
<p class="meta">This harness certifies the built candidate in-process. It deliberately does not fabricate the following, which need a real deployed host / provider key:</p>
<ul>${extList || '<li>None recorded.</li>'}</ul>

<p class="meta"><a href="candidate.json">candidate.json</a> · <a href="capture-plan.json">capture-plan.json</a></p>`

fs.writeFileSync(path.join(root, 'index.html'), html)
fs.writeFileSync(path.join(root, 'coverage-summary.json'), JSON.stringify({
  generatedAt: new Date().toISOString(),
  candidate: candidate ? { sha: g.sha, buildHash: candidate.buildHash, mode: candidate.mode } : null,
  gateGreen,
  required: { total: required.length, green: requiredPass.length, red: requiredFail.length },
  reference: { captured: refReached.length, unreachable: refUnreachable.length, wrongScreen: refWrongScreen.length },
  requiredFailures: requiredFail.map((s) => ({ journey: s.journey, viewport: s.viewport?.id, reached: s.reached, onOwnScreen: s.onOwnScreen })),
}, null, 2))

console.log(`[build-report] required ${requiredPass.length}/${required.length} green · reference ${refReached.length} captured/${refUnreachable.length} unreachable · gate ${gateGreen ? 'GREEN' : 'RED'}`)
