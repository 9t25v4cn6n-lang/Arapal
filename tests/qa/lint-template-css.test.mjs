// Acuity for the template-literal comment linter.
//
// This guard has caught three real blank-page incidents, so weakening it is
// worse than not having it: a silent linter and a clean codebase look identical.
// It was just made more precise (it no longer flags ordinary top-level JSDoc),
// and precision is exactly the change that can accidentally turn a guard off.
//
// So: prove it still fires on the dangerous shape, and prove it stays quiet on
// the safe one. Both directions, every time.
//
//   node --test tests/qa/lint-template-css.test.mjs

import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const LINTER = path.join(process.cwd(), 'scripts', 'qa', 'lint-template-css.mjs')

/** Run the linter against a throwaway tree containing one file. */
function lint(contents) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arapal-lint-'))
  fs.mkdirSync(path.join(dir, 'src'))
  fs.writeFileSync(path.join(dir, 'src', 'subject.jsx'), contents)
  try {
    const stdout = execFileSync('node', [LINTER], { cwd: dir, encoding: 'utf8' })
    return { ok: true, output: stdout }
  } catch (error) {
    return { ok: false, output: `${error.stdout ?? ''}${error.stderr ?? ''}` }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

// The backtick is assembled at runtime so this test file cannot trip its own
// linter, which would be a very silly way to fail.
const TICK = String.fromCharCode(96)

test('FIRES: a backtick in a comment inside a template literal', () => {
  const result = lint(
    `const css = ${TICK}\n`
    + '  .a { color: red }\n'
    + `  /* the ${TICK}inert${TICK} attribute says the same thing */\n`
    + '  .b { color: blue }\n'
    + `${TICK}\n`,
  )
  assert.equal(result.ok, false, `expected a failure, got:\n${result.output}`)
  assert.match(result.output, /subject\.jsx:3/, 'must name the line the comment starts on')
})

test('QUIET: a backtick in ordinary top-level JSDoc', () => {
  const result = lint(
    '/**\n'
    + ` * Accepts ${TICK}complete${TICK}, ${TICK}current${TICK} or ${TICK}pending${TICK}.\n`
    + ' */\n'
    + 'export const tones = {}\n',
  )
  assert.equal(
    result.ok,
    true,
    `a backtick in JSDoc outside any template literal is harmless Markdown, not a defect:\n${result.output}`,
  )
})

test('QUIET: a backtick-free comment inside a template literal', () => {
  const result = lint(
    `const css = ${TICK}\n`
    + '  /* plain prose, no backticks, entirely safe */\n'
    + '  .a { color: red }\n'
    + `${TICK}\n`,
  )
  assert.equal(result.ok, true, result.output)
})

test('FIRES: the comment is inside the SECOND of two template literals', () => {
  const result = lint(
    `const first = ${TICK}.a { color: red }${TICK}\n`
    + `const second = ${TICK}\n`
    + `  /* mentions ${TICK}gap${TICK} */\n`
    + '  .b { color: blue }\n'
    + `${TICK}\n`,
  )
  assert.equal(result.ok, false, `closing and reopening a literal must not lose track:\n${result.output}`)
  assert.match(result.output, /subject\.jsx:3/)
})

// The first version of the precise scanner passed every test above and still
// missed the real bug, because none of those fixtures contained a CSS rule
// block. The scanner tracked `{}` as JavaScript braces, so at any real
// declaration the top of its stack was a brace and it concluded it was not in a
// template literal at all. A fixture has to look like the code it guards.
test('FIRES: inside a CSS rule block, with substitutions, as the real files are', () => {
  const result = lint(
    `const css = ${TICK}\n`
    + '  .panel {\n'
    + '    color: ${colors.textStrong};\n'
    + '    padding: ${spacing[16]};\n'
    + '  }\n'
    + '\n'
    + '  .panel.is-open {\n'
    + `    /* the ${TICK}inert${TICK} attribute says the same thing */\n`
    + '    visibility: visible;\n'
    + '  }\n'
    + `${TICK}\n`,
  )
  assert.equal(
    result.ok,
    false,
    `a comment nested inside a CSS rule inside a template literal is still inside`
    + ` the literal — this is the shape that broke the app three times:\n${result.output}`,
  )
  assert.match(result.output, /subject\.jsx:8/)
})

test('QUIET: an apostrophe in CSS prose does not swallow a later comment', () => {
  const result = lint(
    `const css = ${TICK}\n`
    + "  /* shows the user's own text, so an ellipsis is by design */\n"
    + '  .title { color: ${colors.textSoft}; }\n'
    + '  /* still safe, and still no backticks anywhere */\n'
    + '  .meta { color: ${colors.textFaint}; }\n'
    + `${TICK}\n`,
  )
  assert.equal(result.ok, true, result.output)
})

test('QUIET: a backtick inside a substitution expression is ordinary JavaScript', () => {
  const result = lint(
    `const css = ${TICK}\n`
    + '  .a {\n'
    + `    font-family: \${${TICK}Inter, sans-serif${TICK}};\n`
    + '  }\n'
    + `${TICK}\n`,
  )
  assert.equal(
    result.ok,
    true,
    `a nested template literal inside a substitution is legal and common:\n${result.output}`,
  )
})

test('QUIET: a backtick inside a quoted string is not a literal boundary', () => {
  const result = lint(
    `const tick = "${TICK}"\n`
    + '/* ordinary JSDoc after it, with no template literal open */\n'
    + `const also = '${TICK}'\n`
    + `/* mentions ${TICK}code${TICK} and is still safe */\n`
    + 'export default tick\n',
  )
  assert.equal(
    result.ok,
    true,
    `a backtick in a quoted string does not open a template literal:\n${result.output}`,
  )
})
