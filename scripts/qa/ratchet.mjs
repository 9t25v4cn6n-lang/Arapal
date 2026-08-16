// The ratchet: accepted debt per route+rule, which may only ever decrease.
//
// A gate that fails on all 1,329 existing violations would be switched off
// within a day, which is how the previous checker died. This one fails only on
// violations that are NEW relative to the accepted baseline, and automatically
// lowers the baseline whenever a route improves. Debt can therefore only be
// paid down, never re-accrued.

import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.resolve(HERE, '../..')
export const BASELINE_PATH = path.join(REPO, 'artifacts', 'qa', 'baseline.json')

const key = (route, frame, ruleId) => `${route}::${frame}::${ruleId}`

export async function readBaseline() {
  try {
    return JSON.parse(await fs.readFile(BASELINE_PATH, 'utf8'))
  } catch {
    return { generatedAt: null, accepted: {}, total: 0 }
  }
}

export function countByRouteRule(findings, blockingRuleIds) {
  const counts = {}
  for (const f of findings) {
    if (!blockingRuleIds.has(f.ruleId)) continue
    const k = key(f.route, f.frame, f.ruleId)
    counts[k] = (counts[k] ?? 0) + 1
  }
  return counts
}

/**
 * Compare a run against the baseline.
 * Only routes present in `checkedRoutes` are judged, so a partial run cannot
 * be mistaken for an improvement everywhere else.
 */
export function compare(baseline, counts, checkedPairs) {
  const regressions = []
  const improvements = []
  // Only (route, frame) pairs actually exercised may be judged. Comparing a
  // single-frame run against a four-frame baseline previously read the three
  // unchecked frames as fixed and silently lowered the baseline by 1000.
  const scope = new Set(checkedPairs)

  const seen = new Set(Object.keys(counts))
  for (const [k, n] of Object.entries(counts)) {
    const [route, frame] = k.split('::')
    if (!scope.has(`${route}::${frame}`)) continue
    const accepted = baseline.accepted[k] ?? 0
    if (n > accepted) regressions.push({ key: k, was: accepted, now: n, delta: n - accepted })
    else if (n < accepted) improvements.push({ key: k, was: accepted, now: n, delta: accepted - n })
  }
  // Rules that vanished entirely from a checked route are improvements.
  for (const [k, accepted] of Object.entries(baseline.accepted)) {
    const [route, frame] = k.split('::')
    if (!scope.has(`${route}::${frame}`) || seen.has(k)) continue
    if (accepted > 0) improvements.push({ key: k, was: accepted, now: 0, delta: accepted })
  }
  return { regressions, improvements }
}

/** Write the baseline, applying improvements. Regressions are never absorbed. */
export async function ratchetDown(baseline, counts, checkedPairs, improvements) {
  const next = { ...baseline.accepted }
  for (const imp of improvements) next[imp.key] = imp.now
  // Record newly-seen route+rule pairs at their current level only on a full accept.
  const payload = {
    generatedAt: new Date().toISOString(),
    accepted: next,
    total: Object.values(next).reduce((a, b) => a + b, 0),
    note: 'Accepted visual-standard debt. May only decrease. Regenerate with: npm run qa:accept',
  }
  await fs.mkdir(path.dirname(BASELINE_PATH), { recursive: true })
  await fs.writeFile(BASELINE_PATH, JSON.stringify(payload, null, 1))
  return payload
}

/** Replace the baseline wholesale — used once to record the starting position. */
export async function seedBaseline(counts) {
  const payload = {
    generatedAt: new Date().toISOString(),
    accepted: counts,
    total: Object.values(counts).reduce((a, b) => a + b, 0),
    note: 'Accepted visual-standard debt. May only decrease. Regenerate with: npm run qa:accept',
  }
  await fs.mkdir(path.dirname(BASELINE_PATH), { recursive: true })
  await fs.writeFile(BASELINE_PATH, JSON.stringify(payload, null, 1))
  return payload
}
