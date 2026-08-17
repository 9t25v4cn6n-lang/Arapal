// Cross-product integration: the production surface must be closed.
//
// "Closed" means a user on a production screen is never handed an exit into a
// REFERENCE screen — one of the legacy implementations retained only as a
// behaviour source until its behaviour is ported. Those screens are scheduled
// for deletion; a link into one is a link into a dead end.
//
// This is a static assertion on purpose. The equivalent browser check needs one
// page load per route and can only see destinations by clicking them, whereas the
// thing that actually goes wrong is someone writing `hash = 'study'` in V2 code.
// Catching that costs a regex.
//
//   node --test tests/qa/integration-surface.test.mjs

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROUTES } from '../../scripts/qa/standard.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.resolve(HERE, '../..')

/** Hashes belonging to screens the standard marks as reference-only. */
const REFERENCE_HASHES = ROUTES
  .filter((route) => route.surface === 'reference')
  .map((route) => route.hash)

function sourceFiles(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full))
    else if (/\.(jsx?|ts)$/.test(entry)) out.push(full)
  }
  return out
}

/**
 * Strip comments before scanning.
 *
 * Two files describe a past bug by quoting the exact line it was fixed from —
 * `window.location.hash = 'study'` — and matching prose about a fix as if it were
 * the fix's absence is how a guard earns a reputation for crying wolf.
 */
function code(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
}

test('reference hashes are actually declared, or this test proves nothing', () => {
  assert.ok(
    REFERENCE_HASHES.length > 0,
    'standard.mjs must mark some routes surface: "reference" for this to have teeth',
  )
})

test('no V2 source navigates into a reference screen', () => {
  const offenders = []
  for (const file of sourceFiles(path.join(REPO, 'src', 'v2'))) {
    const body = code(readFileSync(file, 'utf8'))
    for (const hash of REFERENCE_HASHES) {
      // `hash = 'study'` and navigateExternal('study') are the two ways to do it.
      const pattern = new RegExp(`(hash\\s*=\\s*|navigateExternal\\s*\\(\\s*)['"\`]${hash}['"\`]`)
      if (pattern.test(body)) {
        offenders.push(`${path.relative(REPO, file)} -> #${hash}`)
      }
    }
  }
  assert.deepEqual(
    offenders,
    [],
    'V2 must not link into a screen retained only as a behaviour source:\n  '
    + offenders.join('\n  '),
  )
})

test('Exams is reachable from the V2 rail, and returns into V2', () => {
  const registry = readFileSync(
    path.join(REPO, 'src/v2/app/routeRegistry.ts'), 'utf8',
  )
  assert.match(
    registry,
    /externalHash:\s*'exams'/,
    'Exams is production but has no V2 screen, so the rail needs an external entry —'
    + ' without it the whole assessment area is reachable only by typing #exams',
  )

  const exams = code(readFileSync(path.join(REPO, 'src/screens/ExamsScreen.jsx'), 'utf8'))
  assert.match(
    exams,
    /navigateToHash\('v2\/projectHome'\)/,
    'Exams must return to the production Home, not the legacy one — otherwise'
    + ' entering from the V2 rail drops the user into the reference product',
  )
})

test('every production route in the standard has somewhere to come back to', () => {
  // A production route with no rail entry and no external entry can only be
  // reached by typing its hash, which is how Exams was lost.
  const registry = readFileSync(path.join(REPO, 'src/v2/app/routeRegistry.ts'), 'utf8')
  const unreachable = ROUTES
    .filter((route) => route.surface !== 'reference' && route.app === 'v2')
    .filter((route) => {
      const id = route.hash.replace(/^v2\//, '')
      // Either it is a rail destination itself, or it is a step inside a flow
      // that a rail destination leads into.
      return !registry.includes(`routeId: '${id}'`) && !registry.includes(`id: '${id}'`)
    })
    .map((route) => route.id)

  assert.deepEqual(
    unreachable,
    [],
    `production routes absent from the route registry entirely: ${unreachable.join(', ')}`,
  )
})
