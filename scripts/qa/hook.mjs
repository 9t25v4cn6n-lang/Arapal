#!/usr/bin/env node
// PostToolUse hook: runs the visual standard against whatever the edit could
// have affected, and reports NEW violations back into the session.
//
// Contract with the harness:
//   exit 0  -> silent, nothing to say
//   exit 2  -> stderr is surfaced to the agent, which must fix it before reporting done
//
// It is deliberately quiet on pre-existing debt. Only regressions speak.

import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.resolve(HERE, '../..')

let raw = ''
try {
  raw = await new Promise((resolve) => {
    let buf = ''
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (d) => (buf += d))
    process.stdin.on('end', () => resolve(buf))
    setTimeout(() => resolve(buf), 2000)
  })
} catch { /* no stdin */ }

let filePath = ''
try {
  const payload = JSON.parse(raw || '{}')
  filePath = payload.tool_input?.file_path ?? payload.tool_input?.path ?? ''
} catch { /* not JSON */ }

// Only source changes that can alter rendering are worth a run.
if (!filePath || !/\/src\/.*\.(jsx?|tsx?|css)$/.test(filePath)) process.exit(0)

// Requires the dev server. If it is not up, say so once rather than failing loudly.
const ping = spawnSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', process.env.QA_BASE_URL ?? 'http://localhost:5173/'], { encoding: 'utf8' })
if (ping.stdout?.trim() !== '200') {
  console.error('[visual-standard] dev server not reachable — skipped. Start it to re-enable the gate.')
  process.exit(0)
}

const rel = path.relative(REPO, filePath)
const res = spawnSync(
  'node',
  ['scripts/qa/run.mjs', `--changed=${rel}`, '--quick'],
  { cwd: REPO, encoding: 'utf8', timeout: 300000 },
)

if (res.status === 0) process.exit(0)

// Extract just the regression section — pre-existing debt is not this edit's problem.
const out = res.stdout ?? ''
const marker = out.indexOf('NEW violations not in the accepted baseline')
if (marker === -1) process.exit(0)

console.error(
  'The visual standard found NEW violations introduced by this change.\n' +
  'Fix them at the shared cause, not on the individual screen, then re-run `npm run qa -- --quick`.\n\n' +
  out.slice(marker),
)
process.exit(2)
