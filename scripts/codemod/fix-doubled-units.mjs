#!/usr/bin/env node
// spacing and radius tokens already carry their unit ('24px'), so interpolating
// them as `${spacing[24]}px` yields "24pxpx" — an invalid declaration the
// browser drops silently. The affected padding, gap and radius rules have
// therefore been doing nothing at all, which is invisible in review and looks
// like a design problem rather than a bug.
//
//   node scripts/codemod/fix-doubled-units.mjs [--dry]

import fs from 'node:fs'
import path from 'node:path'

const DRY = process.argv.includes('--dry')
const PATTERNS = [
  /(\$\{spacing\[[0-9]+\]\})px/g,
  /(\$\{radius\[[A-Za-z0-9]+\]\})px/g,
  /(\$\{radius\.[A-Za-z0-9]+\})px/g,
]

let changed = 0
let occurrences = 0

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (['node_modules', 'dist'].includes(entry.name)) continue
      walk(full)
      continue
    }
    if (!/\.(jsx?|tsx?)$/.test(entry.name)) continue
    const before = fs.readFileSync(full, 'utf8')
    let after = before
    for (const re of PATTERNS) after = after.replace(re, '$1')
    if (after === before) continue
    occurrences += (before.match(/\$\{(spacing\[[0-9]+\]|radius[.[][A-Za-z0-9\]]*)\}px/g) ?? []).length
    changed += 1
    if (!DRY) fs.writeFileSync(full, after)
    console.log(`${DRY ? 'would fix' : 'fixed'}: ${full}`)
  }
}

walk('src')
console.log(`\n${changed} file(s), ~${occurrences} declaration(s) that were invalid and doing nothing.`)
