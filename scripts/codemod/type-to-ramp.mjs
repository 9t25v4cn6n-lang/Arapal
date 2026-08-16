#!/usr/bin/env node
// Snap authored font sizes onto the approved type ramp.
//
//   node scripts/codemod/type-to-ramp.mjs --dry
//   node scripts/codemod/type-to-ramp.mjs
//
// The ramp is imported from scripts/qa/standard.mjs, never redefined here — the
// checker and the codemod must not be able to disagree about what the ramp is.
//
// A size snaps only if the nearest step is within TOLERANCE_PX. Anything further
// is a deliberate size that the ramp does not contain, and it is reported rather
// than dragged. Sizes already on the ramp are left untouched.
//
// One exception, and it is not a guess: the bottom of the ramp is a ratified
// hard floor, so a size below it is a defect rather than an intentional choice
// the ramp happens to lack. Those are raised to the floor whatever the distance.

import fs from 'node:fs'
import path from 'node:path'
import { TYPE_RAMP } from '../qa/standard.mjs'
import { REPO, rel } from './lib/files.mjs'
import { ownedFiles } from './lib/scope.mjs'

const dry = process.argv.includes('--dry')
const TOLERANCE_PX = 1.5
const FLOOR_PX = Math.min(...TYPE_RAMP)

// fontSize: '13.5px' | font-size: 13.5px | fontSize: 13.5 (numeric px in JS)
const PATTERNS = [
  { id: 'css', re: /(font-size:\s*)([0-9]*\.?[0-9]+)px/g },
  { id: 'jsFontSizeString', re: /(fontSize:\s*['"])([0-9]*\.?[0-9]+)(px['"])/g },
  { id: 'jsFontSizeNumber', re: /(fontSize:\s*)([0-9]*\.?[0-9]+)(\s*[,}])/g },
]

const nearest = (v) =>
  TYPE_RAMP.reduce((best, step) => (Math.abs(step - v) < Math.abs(best - v) ? step : best), TYPE_RAMP[0])

const snapped = []
const refused = new Map()
let changedFiles = 0

for (const file of ownedFiles()) {
  const before = fs.readFileSync(file, 'utf8')
  let after = before
  for (const { id, re } of PATTERNS) {
    after = after.replace(re, (whole, pre, num, post = '') => {
      const v = Number(num)
      if (!Number.isFinite(v) || v <= 0) return whole
      const belowFloor = v < FLOOR_PX
      const step = belowFloor ? FLOOR_PX : nearest(v)
      const distance = Math.abs(step - v)
      if (distance === 0) return whole
      if (!belowFloor && distance > TOLERANCE_PX) {
        const key = `${v}`
        const entry = refused.get(key) ?? { sizePx: v, nearestStep: step, distance: +distance.toFixed(2), count: 0, files: new Set() }
        entry.count += 1
        entry.files.add(rel(file))
        refused.set(key, entry)
        return whole
      }
      snapped.push({ file: rel(file), from: v, to: step, pattern: id })
      const rendered = id === 'jsFontSizeNumber' ? `${step}` : `${step}`
      return `${pre}${rendered}${id === 'css' ? 'px' : post}`
    })
  }
  if (after !== before) {
    changedFiles += 1
    if (!dry) fs.writeFileSync(file, after)
  }
}

const byMove = {}
for (const s of snapped) {
  const k = `${s.from} -> ${s.to}`
  byMove[k] = (byMove[k] ?? 0) + 1
}

const report = {
  generatedAt: new Date().toISOString(),
  ramp: TYPE_RAMP,
  tolerancePx: TOLERANCE_PX,
  rampSource: 'scripts/qa/standard.mjs',
  snapped: { total: snapped.length, files: changedFiles, moves: byMove },
  refused: [...refused.values()].map((r) => ({ ...r, files: [...r.files] })).sort((a, b) => b.count - a.count),
}
fs.writeFileSync(path.join(REPO, 'artifacts/qa/codemod-type-refused.json'), JSON.stringify(report, null, 1))

console.log(`${dry ? 'DRY RUN — ' : ''}snapped ${snapped.length} declarations in ${changedFiles} files`)
for (const [move, n] of Object.entries(byMove).sort((a, b) => b[1] - a[1])) console.log(`  ${move.padEnd(18)} x${n}`)
console.log(`\nrefused (>${TOLERANCE_PX}px from any ramp step): ${report.refused.length} distinct`)
for (const r of report.refused.slice(0, 20)) {
  console.log(`  ${String(r.sizePx).padStart(6)}px x${String(r.count).padStart(3)}  nearest ${r.nearestStep} (${r.distance}px away)  ${r.files[0]}`)
}
console.log('\nreport: artifacts/qa/codemod-type-refused.json')
