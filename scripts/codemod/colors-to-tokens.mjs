#!/usr/bin/env node
// Literal -> token, in two passes that fail differently on purpose.
//
//   node scripts/codemod/colors-to-tokens.mjs --dry
//   node scripts/codemod/colors-to-tokens.mjs
//
// PASS A — canonicalise. Every literal that a token legally owns is rewritten to
//   that token's own hex. Context-free: a hex is valid wherever a hex was valid,
//   so this cannot break a render. It changes pixels, and visual regression is
//   the check.
//
// PASS B — tokenise. Inside CSS only (template-literal quasis and .css files),
//   the now-canonical hex becomes var(--arapal-*), backed by a :root block
//   generated from colors.ts. Pure indirection: visual regression must show a
//   PIXEL-IDENTICAL result, which is what proves pass B correct.
//
// Splitting them means a diff can always be attributed to the pass that caused
// it. JS string literals and JSX attributes keep canonical hexes — var() is not
// valid in an SVG presentation attribute, and a hex handed to a JS colour helper
// must stay parseable.

import fs from 'node:fs'
import path from 'node:path'
import { parse } from '@babel/parser'
import { REPO, rel, sourceFiles } from './lib/files.mjs'
import { ownedFiles } from './lib/scope.mjs'
import { loadPalette, cssVarName, TOKENS_FILE } from './lib/palette.mjs'
import { normaliseHex, contrastRatio } from './lib/color.mjs'
import { resolve, chroma, CEILINGS } from './lib/mapping.mjs'

const dry = process.argv.includes('--dry')
const HEX = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g
const palette = loadPalette()
const files = ownedFiles()

// ── build the substitution table ─────────────────────────────────────────────
const table = new Map() // literal -> { token, value, rule, deltaE }
const unmapped = new Map()

for (const file of sourceFiles()) {
  if (file === TOKENS_FILE) continue
  const text = fs.readFileSync(file, 'utf8')
  for (const m of text.matchAll(HEX)) {
    const hex = normaliseHex(m[0])
    if (!hex || table.has(hex) || unmapped.has(hex)) {
      if (unmapped.has(hex)) {
        const u = unmapped.get(hex)
        u.count += 1
        u.files.add(rel(file))
      }
      continue
    }
    const r = resolve(hex, palette)
    if (r) table.set(hex, r)
    else unmapped.set(hex, { hex, count: 1, files: new Set([rel(file)]), chroma: +chroma(hex).toFixed(1) })
  }
}
// second sweep for accurate counts on mapped entries
const counts = new Map()
for (const file of sourceFiles()) {
  if (file === TOKENS_FILE) continue
  for (const m of fs.readFileSync(file, 'utf8').matchAll(HEX)) {
    const hex = normaliseHex(m[0])
    if (hex) counts.set(hex, (counts.get(hex) ?? 0) + 1)
  }
}

// ── pass A: canonicalise ─────────────────────────────────────────────────────
let aFiles = 0
let aHits = 0
for (const file of files) {
  const before = fs.readFileSync(file, 'utf8')
  const after = before.replace(HEX, (raw) => {
    const hex = normaliseHex(raw)
    const hit = table.get(hex)
    if (!hit || hit.value === hex) return raw
    aHits += 1
    return hit.value
  })
  if (after !== before) {
    aFiles += 1
    if (!dry) fs.writeFileSync(file, after)
  }
}

// ── pass B: tokenise inside CSS ──────────────────────────────────────────────
/** Byte ranges of template-literal text in a JS/TS/JSX source. */
function cssRanges(file, text) {
  if (file.endsWith('.css')) return [[0, text.length]]
  let ast
  try {
    ast = parse(text, {
      sourceType: 'module',
      plugins: ['jsx', file.endsWith('.ts') || file.endsWith('.tsx') ? 'typescript' : null].filter(Boolean),
      errorRecovery: true,
    })
  } catch {
    return []
  }
  const ranges = []
  const visit = (node) => {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) return node.forEach(visit)
    if (node.type === 'TemplateElement' && node.start != null) ranges.push([node.start, node.end])
    for (const k of Object.keys(node)) {
      if (k === 'loc' || k === 'leadingComments' || k === 'trailingComments') continue
      visit(node[k])
    }
  }
  visit(ast.program)
  return ranges
}

/**
 * A hex only becomes var() in a CSS *value* position — after `:` or `,` or `(`
 * or whitespace inside a declaration. This keeps it away from anything that
 * merely happens to sit inside a template literal, such as a URL fragment.
 */
function inValuePosition(text, index) {
  const lineStart = text.lastIndexOf('\n', index) + 1
  const before = text.slice(lineStart, index)
  if (/=\s*["']?$/.test(before)) return false // attribute-ish
  return /[:,(]\s*[^;]*$/.test(before) || /^\s*$/.test(before)
}

let bFiles = 0
let bHits = 0
const varFor = new Map() // canonical hex -> var name (many tokens can share a value)
for (const [token, value] of Object.entries(palette)) {
  if (!varFor.has(value)) varFor.set(value, cssVarName(token))
}

for (const file of files) {
  if (file.endsWith('index.css')) continue // the definition site itself
  const text = fs.readFileSync(file, 'utf8')
  const ranges = cssRanges(file, text)
  if (!ranges.length) continue
  let out = ''
  let cursor = 0
  const inRange = (i) => ranges.some(([s, e]) => i >= s && i < e)
  for (const m of text.matchAll(HEX)) {
    const hex = normaliseHex(m[0])
    const name = varFor.get(hex)
    if (!name || !inRange(m.index) || !inValuePosition(text, m.index)) continue
    out += text.slice(cursor, m.index) + `var(${name})`
    cursor = m.index + m[0].length
    bHits += 1
  }
  if (cursor === 0) continue
  out += text.slice(cursor)
  bFiles += 1
  if (!dry) fs.writeFileSync(file, out)
}

// ── the :root definition site, generated from colors.ts ──────────────────────
const START = '/* --- arapal tokens: generated by scripts/codemod/colors-to-tokens.mjs --- */'
const END = '/* --- end arapal tokens --- */'
const block = [
  START,
  ':root {',
  ...Object.entries(palette).map(([t, v]) => `  ${cssVarName(t)}: ${v};`),
  '}',
  END,
].join('\n')

const indexCss = path.join(REPO, 'src/index.css')
let css = fs.readFileSync(indexCss, 'utf8')
const existing = new RegExp(`${START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
if (existing.test(css)) css = css.replace(existing, block)
else {
  const lastImport = css.lastIndexOf('@import')
  const insertAt = lastImport === -1 ? 0 : css.indexOf('\n', lastImport) + 1
  css = css.slice(0, insertAt) + '\n' + block + '\n' + css.slice(insertAt)
}
if (!dry) fs.writeFileSync(indexCss, css)

// ── report ───────────────────────────────────────────────────────────────────
const report = {
  generatedAt: new Date().toISOString(),
  ceilings: CEILINGS,
  rule:
    'A literal earns a token by exact match, by sub-JND distance, by joining the ' +
    'neutral ramp while holding its hue, or by rejoining its own hue family. ' +
    'Anything else is listed below and left alone — the palette has no home for it.',
  scope: files.map(rel),
  applied: {
    passA_canonicalise: { files: aFiles, occurrences: aHits },
    passB_tokenise: { files: bFiles, occurrences: bHits },
  },
  mapped: [...table.entries()]
    .map(([hex, r]) => ({
      hex,
      count: counts.get(hex) ?? 0,
      token: r.token,
      value: r.value,
      rule: r.rule,
      deltaE: +r.deltaE.toFixed(2),
      contrastShiftOnWhite: +(contrastRatio(r.value, '#ffffff') - contrastRatio(hex, '#ffffff')).toFixed(2),
    }))
    .sort((a, b) => b.count - a.count),
  unmapped: [...unmapped.values()]
    .map((u) => ({ ...u, files: [...u.files] }))
    .sort((a, b) => b.count - a.count),
}
report.summary = {
  distinctMapped: report.mapped.length,
  occurrencesMapped: report.mapped.reduce((a, b) => a + b.count, 0),
  distinctUnmapped: report.unmapped.length,
  occurrencesUnmapped: report.unmapped.reduce((a, b) => a + b.count, 0),
  unmappedFamilies:
    'The palette has no orange, purple, indigo, emerald or red family beyond the ' +
    'single review/success/critical pairs, so every literal in those hues is ' +
    'reported rather than forced onto a blue or a neutral.',
}

fs.mkdirSync(path.join(REPO, 'artifacts/qa'), { recursive: true })
fs.writeFileSync(path.join(REPO, 'artifacts/qa/codemod-unmapped.json'), JSON.stringify(report, null, 1))

console.log(`${dry ? 'DRY RUN — ' : ''}scope: ${files.length} owned files`)
console.log(`pass A canonicalise: ${aHits} occurrences in ${aFiles} files`)
console.log(`pass B tokenise:     ${bHits} occurrences in ${bFiles} files`)
console.log(`mapped ${report.summary.occurrencesMapped} / unmapped ${report.summary.occurrencesUnmapped} occurrences repo-wide`)
console.log(`report: artifacts/qa/codemod-unmapped.json`)
