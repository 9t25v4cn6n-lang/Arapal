#!/usr/bin/env node
// Read-only census: every hex literal in src/, its nearest token, and the
// perceptual distance between them. Run this before changing the mapping
// ceiling so the decision is made on evidence.
//
//   node scripts/codemod/analyse-colors.mjs [--ceiling=2.5]

import fs from 'node:fs'
import { sourceFiles, rel, REPO } from './lib/files.mjs'
import { loadPalette, TOKENS_FILE } from './lib/palette.mjs'
import { nearest, normaliseHex } from './lib/color.mjs'

const ceiling = Number(process.argv.find((a) => a.startsWith('--ceiling='))?.split('=')[1] ?? 2.5)
const palette = loadPalette()

const census = new Map()
for (const file of sourceFiles()) {
  if (file === TOKENS_FILE) continue
  const text = fs.readFileSync(file, 'utf8')
  for (const m of text.matchAll(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g)) {
    const hex = normaliseHex(m[0])
    if (!hex) continue
    const entry = census.get(hex) ?? { hex, count: 0, files: new Set() }
    entry.count += 1
    entry.files.add(rel(file))
    census.set(hex, entry)
  }
}

const rows = [...census.values()]
  .map((e) => ({ ...e, files: [...e.files], near: nearest(e.hex, palette) }))
  .sort((a, b) => a.near.deltaE - b.near.deltaE || b.count - a.count)

const within = rows.filter((r) => r.near.deltaE <= ceiling)
const outside = rows.filter((r) => r.near.deltaE > ceiling)

console.log(`palette: ${Object.keys(palette).length} tokens`)
console.log(`literals: ${rows.length} distinct, ${rows.reduce((a, b) => a + b.count, 0)} occurrences`)
console.log(`\nWITHIN ceiling ΔE<=${ceiling} — ${within.length} distinct / ${within.reduce((a, b) => a + b.count, 0)} occurrences`)
for (const r of within) {
  const exact = r.hex === r.near.value ? 'exact ' : `ΔE${r.near.deltaE.toFixed(2)}`
  console.log(`  ${r.hex} x${String(r.count).padStart(3)}  -> ${r.near.name.padEnd(16)} ${r.near.value}  ${exact}`)
}
console.log(`\nOUTSIDE ceiling — ${outside.length} distinct / ${outside.reduce((a, b) => a + b.count, 0)} occurrences (top 40 by usage)`)
for (const r of [...outside].sort((a, b) => b.count - a.count).slice(0, 40)) {
  console.log(`  ${r.hex} x${String(r.count).padStart(3)}  nearest ${r.near.name.padEnd(16)} ${r.near.value}  ΔE${r.near.deltaE.toFixed(1)}`)
}

if (process.argv.includes('--json')) {
  fs.writeFileSync(
    `${REPO}/artifacts/qa/codemod-color-census.json`,
    JSON.stringify({ ceiling, palette, within, outside }, null, 1),
  )
}
