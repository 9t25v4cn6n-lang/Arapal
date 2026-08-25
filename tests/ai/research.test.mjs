// Project Research "Ask" contract + service. The companion previously rendered
// a fixed paragraph with fixture citations for every question; these assert the
// replacement is grounded in the project's own segments, honest without a
// provider, and cannot surface a hallucinated citation.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildResearchAskPrompt, parseResearchAnswer } from '../../src/v2/services/ai/contracts/research.js'
import { researchAsk } from '../../src/v2/services/ai/index.js'

const segments = [
  { ref: '1.1', heading: 'Pure water', text: 'الماء المطلق طهور' },
  { ref: '1.2', heading: 'Tayammum', text: 'والتيمم جائز عند عدم الماء' },
]

test('the prompt is grounded ONLY in the supplied segments and asks for cited refs', () => {
  const p = buildResearchAskPrompt({ question: 'What purifies?', segments })
  assert.match(p, /ONLY the project segments/i)
  assert.match(p, /\[1\.1\]/)
  assert.match(p, /الماء المطلق طهور/)
  assert.match(p, /answerMd/)
  assert.match(p, /say so plainly instead of inventing/i)
})

test('an answer without answerMd is rejected, never rendered', () => {
  assert.throws(() => parseResearchAnswer({ citations: ['1.1'] }), /answerMd/)
})

test('citations are filtered to refs that were actually supplied', () => {
  const parsed = parseResearchAnswer(
    { answerMd: 'Absolute water purifies.', citations: ['1.1', '9.9', '1.1'] },
    ['1.1', '1.2'],
  )
  assert.equal(parsed.answerMd, 'Absolute water purifies.')
  // 9.9 was never supplied (hallucinated) and the duplicate 1.1 is collapsed.
  assert.deepEqual(parsed.citations, ['1.1'])
})

test('research ask is honestly unavailable without a provider', async () => {
  const out = await researchAsk({ question: 'What purifies?', segments })
  assert.equal(out.available, false)
  assert.equal(out.reason, 'no-provider')
  assert.match(out.message, /not configured/i)
})

test('research ask refuses an empty question before any provider call', async () => {
  let called = false
  const out = await researchAsk(
    { question: '   ', segments },
    { generate: async () => { called = true; return { answerMd: 'x' } } },
  )
  assert.equal(out.available, false)
  assert.equal(out.reason, 'empty')
  assert.equal(called, false)
})

test('a valid provider response yields a grounded answer with constrained citations', async () => {
  const out = await researchAsk(
    { question: 'What purifies?', segments },
    { generate: async () => ({ answerMd: 'Absolute (muṭlaq) water purifies.', citations: ['1.1', 'nonexistent'] }) },
  )
  assert.equal(out.available, true)
  assert.equal(out.result.answerMd, 'Absolute (muṭlaq) water purifies.')
  assert.deepEqual(out.result.citations, ['1.1'])
})

test('a provider/parse failure is honest, never a fabricated answer', async () => {
  const out = await researchAsk(
    { question: 'What purifies?', segments },
    { generate: async () => ({ notAnswer: true }) },
  )
  assert.equal(out.available, false)
  assert.equal(out.reason, 'error')
})
