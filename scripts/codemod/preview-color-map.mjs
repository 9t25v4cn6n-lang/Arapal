#!/usr/bin/env node
// Show the exact substitution map the codemod would apply, grouped by the rule
// that authorised it, plus every literal it refuses to touch.

import fs from 'node:fs'
import { sourceFiles, rel } from './lib/files.mjs'
import { loadPalette, TOKENS_FILE } from './lib/palette.mjs'
import { normaliseHex, contrastRatio } from './lib/color.mjs'
import { resolve, chroma } from './lib/mapping.mjs'

const palette = loadPalette()
const census = new Map()
for (const file of sourceFiles()) {
  if (file === TOKENS_FILE) continue
  const text = fs.readFileSync(file, 'utf8')
  for (const m of text.matchAll(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g)) {
    const hex = normaliseHex(m[0])
    if (!hex) continue
    const e = census.get(hex) ?? { hex, count: 0, files: new Set() }
    e.count += 1
    e.files.add(rel(file))
    census.set(hex, e)
  }
}

const mapped = []
const unmapped = []
for (const e of census.values()) {
  const r = resolve(e.hex, palette)
  if (r) mapped.push({ ...e, files: [...e.files], ...r })
  else unmapped.push({ ...e, files: [...e.files], chroma: +chroma(e.hex).toFixed(1) })
}

const byRule = {}
for (const m of mapped) (byRule[m.rule] ??= []).push(m)

for (const [rule, items] of Object.entries(byRule)) {
  const n = items.reduce((a, b) => a + b.count, 0)
  console.log(`\n=== ${rule.toUpperCase()} — ${items.length} distinct / ${n} occurrences`)
  for (const i of items.sort((a, b) => b.count - a.count)) {
    // Report the contrast shift on white so a mapping cannot quietly darken or
    // lighten text past a threshold without it being visible here.
    const shift = (contrastRatio(i.value, '#ffffff') - contrastRatio(i.hex, '#ffffff')).toFixed(2)
    console.log(
      `  ${i.hex} x${String(i.count).padStart(3)} -> ${i.token.padEnd(15)} ${i.value}` +
        `  ΔE${i.deltaE.toFixed(2).padStart(5)}  contrast-on-white ${shift > 0 ? '+' : ''}${shift}`,
    )
  }
}

const totalMapped = mapped.reduce((a, b) => a + b.count, 0)
const totalUnmapped = unmapped.reduce((a, b) => a + b.count, 0)
console.log(`\n=== UNMAPPED — ${unmapped.length} distinct / ${totalUnmapped} occurrences`)
for (const u of unmapped.sort((a, b) => b.count - a.count).slice(0, 25)) {
  console.log(`  ${u.hex} x${String(u.count).padStart(3)}  chroma ${String(u.chroma).padStart(5)}  ${u.files[0]}${u.files.length > 1 ? ` +${u.files.length - 1}` : ''}`)
}
console.log(`\nmapped ${totalMapped} / unmapped ${totalUnmapped} (${((totalMapped / (totalMapped + totalUnmapped)) * 100).toFixed(0)}% coverage)`)
