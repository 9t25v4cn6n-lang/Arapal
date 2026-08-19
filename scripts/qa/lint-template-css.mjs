#!/usr/bin/env node
// A backtick inside a block comment that sits INSIDE a template literal
// terminates that literal, which turns a comment into a syntax error and takes
// the whole app down. It is invisible in review and has cost this project three
// blank-page incidents, so it is checked mechanically rather than remembered.
//
// The check used to flag a backtick in ANY block comment, including ordinary
// top-level JSDoc where a backtick is correct Markdown and entirely harmless.
// That is a false positive, and a gate that fires on safe code is a gate people
// learn to skip — the same way the previous audit system was skipped for four
// months. So the scanner now tracks whether it is actually inside a template
// literal, and only reports when it is.
//
//   node scripts/qa/lint-template-css.mjs

import fs from 'node:fs'
import path from 'node:path'

const roots = ['src']
const offenders = []

/**
 * Walk the source once, tracking just enough JavaScript lexical state to know
 * whether a given block comment is inside a template literal.
 *
 * Deliberately a scanner and not a parser: it needs to answer one question, and
 * a parser dependency for one question is a maintenance cost with its own bugs.
 * The states it distinguishes are the ones that can contain a backtick or hide
 * the start of a comment — strings, comments, regex-free template literals and
 * their `${}` substitutions.
 */
function findOffenders(source, file) {
  let i = 0
  let line = 1
  const stack = []

  /**
   * Are we inside template-literal TEXT right now?
   *
   * Answered by walking out to the innermost template-or-substitution marker,
   * not by reading the top of the stack. Reading the top was wrong in the one
   * shape that matters: CSS inside a template literal is full of rule braces,
   * so at any real declaration the top of the stack was 'brace' and the check
   * said "not in a template" — a false negative on the exact bug this file
   * exists to catch.
   */
  const inTemplate = () => {
    for (let k = stack.length - 1; k >= 0; k -= 1) {
      if (stack[k] === 'template') return true
      if (stack[k] === 'substitution') return false
    }
    return false
  }

  while (i < source.length) {
    const c = source[i]
    const next = source[i + 1]

    if (c === '\n') { line += 1; i += 1; continue }

    // ── line comment ─────────────────────────────────────────────────────────
    if (c === '/' && next === '/') {
      while (i < source.length && source[i] !== '\n') i += 1
      continue
    }

    // ── block comment ────────────────────────────────────────────────────────
    if (c === '/' && next === '*') {
      const startLine = line
      const insideTemplate = inTemplate()
      let body = ''
      i += 2
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) {
        if (source[i] === '\n') line += 1
        body += source[i]
        i += 1
      }
      i += 2
      if (insideTemplate && body.includes('`')) {
        offenders.push(`${file}:${startLine}`)
      }
      continue
    }

    // ── quoted strings ───────────────────────────────────────────────────────
    // Only outside template text. Inside CSS an apostrophe is prose ("the user's
    // own text"), not the start of a string, and treating it as one swallowed
    // everything up to the next quote.
    if (!inTemplate() && (c === '"' || c === "'")) {
      const quote = c
      i += 1
      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\') { i += 2; continue }
        if (source[i] === '\n') { line += 1; break } // unterminated; resync
        i += 1
      }
      i += 1
      continue
    }

    // ── template literal boundaries ──────────────────────────────────────────
    if (c === '`') {
      if (inTemplate()) stack.pop()
      else stack.push('template')
      i += 1
      continue
    }

    // A substitution inside a template literal is ordinary JavaScript again, so
    // a block comment within it is NOT protected by the surrounding literal —
    // but a backtick there still terminates nothing. Track it so nesting works.
    if (c === '$' && next === '{' && inTemplate()) {
      stack.push('substitution')
      i += 2
      continue
    }
    // Braces are tracked only where they are JavaScript — at the top level or
    // inside a substitution. A brace in CSS text is a character.
    if (!inTemplate()) {
      if (c === '{') { stack.push('brace'); i += 1; continue }
      if (c === '}') {
        const top = stack[stack.length - 1]
        if (top === 'substitution' || top === 'brace') stack.pop()
        i += 1
        continue
      }
    }

    i += 1
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) { walk(full); continue }
    if (!/\.(jsx?|tsx?)$/.test(entry.name)) continue
    findOffenders(fs.readFileSync(full, 'utf8'), full)
  }
}

roots.forEach((root) => fs.existsSync(root) && walk(root))

if (offenders.length) {
  console.error('Backtick inside a block comment that is inside a template literal —')
  console.error('this terminates the literal and breaks the file:')
  offenders.forEach((o) => console.error(`  ${o}`))
  console.error('\nUse straight quotes in that comment instead.')
  process.exit(1)
}
console.log('template-literal CSS comments: clean')
