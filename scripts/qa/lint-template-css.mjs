#!/usr/bin/env node
// A backtick inside a CSS comment terminates the template literal it lives in,
// which turns a comment into a syntax error and takes the whole app down. It is
// invisible in review and cost this project two blank-page incidents, so it is
// checked mechanically rather than remembered.
//
//   node scripts/qa/lint-template-css.mjs

import fs from 'node:fs'
import path from 'node:path'

const roots = ['src']
const offenders = []

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) { walk(full); continue }
    if (!/\.(jsx?|tsx?)$/.test(entry.name)) continue
    const source = fs.readFileSync(full, 'utf8')
    for (const match of source.matchAll(/\/\*[\s\S]*?\*\//g)) {
      if (!match[0].includes('`')) continue
      const line = source.slice(0, match.index).split('\n').length
      offenders.push(`${full}:${line}`)
    }
  }
}

roots.forEach((root) => fs.existsSync(root) && walk(root))

if (offenders.length) {
  console.error('Backtick inside a block comment — this terminates any enclosing template literal:')
  offenders.forEach((o) => console.error(`  ${o}`))
  console.error('\nUse straight quotes in comments instead.')
  process.exit(1)
}
console.log('template-literal CSS comments: clean')
