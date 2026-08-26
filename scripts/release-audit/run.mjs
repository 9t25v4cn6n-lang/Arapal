// Fail-closed, exact-candidate release evidence orchestrator (S3-006).
//
// One immutable candidate package: build the dist, bind every artifact to the
// candidate SHA + built-asset hash, serve the BUILT dist, and capture the
// required journeys against it with the fail-closed spec. The process exit code
// IS the release signal.
//
//   node scripts/release-audit/run.mjs                 full capture (required + reference)
//   node scripts/release-audit/run.mjs --required-only  required journeys only (fast gate)
//   node scripts/release-audit/run.mjs --prove-fail-closed
//        deliberately routes one required journey to a screen that does not
//        exist and asserts the gate goes RED. Exit 0 means "the gate bites";
//        exit 1 means the gate failed to catch an unreachable required state.
//
// It deliberately does NOT fabricate deploy/smoke/rollback/monitoring evidence:
// those require a real deployed host and are recorded as external verification
// still required, not asserted here.

import { spawn } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.resolve(HERE, '..', '..')
const OUT = process.env.RELEASE_AUDIT_DIR || path.join('artifacts', 'release-audit', 'evidence')
const OUT_ABS = path.isAbsolute(OUT) ? OUT : path.join(REPO, OUT)
const PORT = Number(process.env.ARAPAL_PREVIEW_PORT || 4183)
const BASE_URL = `http://127.0.0.1:${PORT}`

const args = new Set(process.argv.slice(2))
const PROVE = args.has('--prove-fail-closed')
const REQUIRED_ONLY = PROVE || args.has('--required-only')
const BREAK_JOURNEY = 'req-projects-populated' // the journey deliberately broken in prove mode

const log = (...m) => console.log('[release-audit]', ...m)
const ensureDir = (p) => fs.mkdirSync(p, { recursive: true })

function run(cmd, argv, opts = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, argv, { cwd: REPO, stdio: 'inherit', ...opts })
    child.on('exit', (code) => resolve(code ?? 1))
    child.on('error', () => resolve(1))
  })
}

function sha256File(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })
}

async function gitInfo() {
  const { execFileSync } = await import('node:child_process')
  const git = (a) => {
    try { return execFileSync('git', a, { cwd: REPO }).toString().trim() } catch { return '' }
  }
  const sha = git(['rev-parse', 'HEAD'])
  const shortSha = git(['rev-parse', '--short', 'HEAD'])
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'])
  const status = git(['status', '--porcelain'])
  return { sha, shortSha, branch, dirty: status.length > 0, dirtyFiles: status ? status.split('\n').length : 0 }
}

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.ok) return true
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500))
  }
  return false
}

function computeBuildHash(distDir) {
  const files = walk(distDir).sort()
  const perFile = files.map((f) => ({
    path: path.relative(distDir, f).replaceAll('\\', '/'),
    bytes: fs.statSync(f).size,
    sha256: sha256File(f),
  }))
  const rollup = crypto.createHash('sha256')
  for (const f of perFile) rollup.update(`${f.path}:${f.sha256}\n`)
  return { buildHash: rollup.digest('hex'), assets: perFile }
}

async function main() {
  // Start from a clean evidence tree so a renamed/removed journey can never leave
  // a stale capture behind that the index would still count.
  fs.rmSync(OUT_ABS, { recursive: true, force: true })
  ensureDir(OUT_ABS)
  ensureDir(path.join(path.dirname(OUT_ABS), 'logs'))

  // 1. Identity of the exact candidate.
  const git = await gitInfo()
  log(`candidate ${git.shortSha} on ${git.branch}${git.dirty ? ` (working tree dirty: ${git.dirtyFiles} file(s))` : ''}`)

  // 2. Build the dist that will actually be served.
  log('building dist …')
  const buildCode = await run('npm', ['run', 'build'])
  if (buildCode !== 0) {
    log('build FAILED — no candidate to certify')
    process.exit(1)
  }
  const distDir = path.join(REPO, 'dist')
  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    log('dist/index.html missing after build')
    process.exit(1)
  }
  const { buildHash, assets } = computeBuildHash(distDir)
  const entryMatch = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8').match(/src="([^"]*\/assets\/index-[^"]+\.js)"/)
  const candidate = {
    generatedAt: new Date().toISOString(),
    git,
    buildHash,
    entryAsset: entryMatch ? entryMatch[1] : null,
    servedFrom: BASE_URL,
    mode: PROVE ? 'prove-fail-closed' : (REQUIRED_ONLY ? 'required-only' : 'full'),
    node: process.version,
    assetCount: assets.length,
    assets,
    externalVerificationStillRequired: [
      'Deploy the exact build hash to the production host and record the deployed URL.',
      'Post-deploy smoke of every required journey against the deployed origin.',
      'Documented rollback drill from this build hash to the previous one.',
      'Runtime monitoring / error reporting attached to the deployed origin.',
      'Live-provider (Gemini) valid-key Study PASS against a real key.',
    ],
  }
  const candidatePath = path.join(OUT_ABS, 'candidate.json')
  fs.writeFileSync(candidatePath, JSON.stringify(candidate, null, 2))
  log(`built ✓  buildHash ${buildHash.slice(0, 16)}…  entry ${candidate.entryAsset}`)

  // 3. Serve the BUILT dist (not a dev server).
  log(`serving dist at ${BASE_URL} …`)
  const preview = spawn('npm', ['run', 'preview', '--', '--port', String(PORT), '--host', '127.0.0.1', '--strictPort'], {
    cwd: REPO,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  const previewLog = fs.createWriteStream(path.join(path.dirname(OUT_ABS), 'logs', 'preview.log'))
  preview.stdout.pipe(previewLog)
  preview.stderr.pipe(previewLog)

  const stopPreview = () => { try { preview.kill('SIGTERM') } catch { /* ignore */ } }
  process.on('exit', stopPreview)

  const up = await waitForServer(BASE_URL)
  if (!up) {
    log('preview server did not become ready')
    stopPreview()
    process.exit(1)
  }

  // 4. Capture. Fail closed.
  const env = {
    ...process.env,
    ARAPAL_BASE_URL: BASE_URL,
    ARAPAL_CANDIDATE: candidatePath,
    RELEASE_AUDIT_DIR: OUT_ABS,
    ...(REQUIRED_ONLY ? { ARAPAL_REQUIRED_ONLY: '1' } : {}),
    ...(PROVE ? { ARAPAL_BREAK_REQUIRED: BREAK_JOURNEY } : {}),
  }
  if (PROVE) log(`PROVE mode: routing "${BREAK_JOURNEY}" to a nonexistent screen; the gate MUST go red`)

  const captureCode = await run(
    'npx',
    ['playwright', 'test', 'tests/release-audit/release-evidence.spec.js'],
    { env },
  )

  stopPreview()

  // 5. Build the reviewed render index (bound to the candidate).
  await run('node', ['scripts/release-audit/build-report.mjs', OUT_ABS])

  // 6. Exit contract.
  if (PROVE) {
    if (captureCode !== 0) {
      log('✅ fail-closed PROVEN: a deliberately-unreachable required state made the gate exit non-zero')
      process.exit(0)
    }
    log('❌ fail-closed BROKEN: an unreachable required state did NOT fail the gate')
    process.exit(1)
  }

  if (captureCode !== 0) {
    log('release evidence FAILED (gate is red)')
    process.exit(1)
  }
  log('release evidence complete — every required journey reached, on-screen, error-free, captured on the built candidate')
  log(`index: ${path.join(OUT_ABS, 'index.html')}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
