#!/usr/bin/env node
// A numeric token key that is not declared resolves to `undefined`, and the
// browser then drops the ENTIRE declaration it appears in — `padding: 0
// undefined` is invalid CSS, not "padding: 0". Nothing throws, nothing logs, and
// the defect only ever surfaces as a screenshot where text touches a border.
//
// That is precisely how the Study History status pills lost their horizontal
// padding, and 33 other places on the production surface had the same silent
// hole. It is unreviewable by eye, so it is checked mechanically.
//
//   node scripts/qa/lint-tokens.mjs

import fs from 'node:fs'
import path from 'node:path'

const tokenFiles = {
  spacing: 'src/v2/foundation/tokens/spacing.ts',
  radius: 'src/v2/foundation/tokens/radius.ts',
}

/** Declared numeric keys of a token module, read from its source. */
function readDeclaredKeys(file) {
  const source = fs.readFileSync(file, 'utf8')
  const keys = new Set()
  for (const match of source.matchAll(/^\s{2}(\d+)\s*:/gm)) keys.add(match[1])
  return keys
}

const declared = Object.fromEntries(
  Object.entries(tokenFiles)
    .filter(([, file]) => fs.existsSync(file))
    .map(([name, file]) => [name, readDeclaredKeys(file)]),
)

const offenders = []

function scan(source, file) {
  const names = Object.keys(declared).join('|')
  if (!names) return
  const pattern = new RegExp(`\\b(${names})\\[(\\d+)\\]`, 'g')

  for (const match of source.matchAll(pattern)) {
    const [, token, key] = match
    if (declared[token].has(key)) continue
    const line = source.slice(0, match.index).split('\n').length
    offenders.push({ file, line, token, key })
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) { walk(full); continue }
    if (!/\.(jsx?|tsx?)$/.test(entry.name)) continue
    scan(fs.readFileSync(full, 'utf8'), full)
  }
}

if (fs.existsSync('src')) walk('src')

if (offenders.length) {
  console.error('Undeclared token keys — these resolve to `undefined` and the browser')
  console.error('silently drops the whole declaration they appear in:\n')
  for (const o of offenders) {
    const options = [...declared[o.token]].join(', ')
    console.error(`  ${o.file}:${o.line}  ${o.token}[${o.key}]  — declared: ${options}`)
  }
  console.error('\nAdd the step to the token file, or use a declared one.')
  process.exit(1)
}
console.log('token keys: clean')
