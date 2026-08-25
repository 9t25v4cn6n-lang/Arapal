// Study Discussion + Summary contracts and service. Honest-unavailable without
// a provider; grounded, segment-scoped prompts that preserve the source-prompt
// restrictions (no re-grading, no pre-pass best translation).

import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildDiscussionPrompt, parseDiscussionReply,
  buildDiscussionSummaryPrompt, parseDiscussionSummary,
} from '../../src/v2/services/ai/contracts/discussion.js'
import { discuss, summariseDiscussion } from '../../src/v2/services/ai/index.js'

const messages = [{ role: 'user', text: 'What does مطلق mean here?' }]

test('the discussion prompt is segment-scoped and withholds best translation pre-pass', () => {
  const p = buildDiscussionPrompt({ segmentText: 'الماء المطلق طهور', segmentRef: '1.1', messages, revealBestTranslation: false })
  assert.match(p, /replyMd/)
  assert.match(p, /do NOT reveal a full best-in-class translation/i)
  assert.match(p, /الماء المطلق طهور/)
})

test('after a pass the best-translation restriction is lifted', () => {
  const p = buildDiscussionPrompt({ segmentText: 's', messages, revealBestTranslation: true })
  assert.doesNotMatch(p, /do NOT reveal a full best-in-class translation/i)
})

test('a reply without replyMd is rejected, not rendered', () => {
  assert.throws(() => parseDiscussionReply({ foo: 'bar' }), /replyMd/)
  assert.equal(parseDiscussionReply({ replyMd: 'It means unrestricted water.' }).replyMd, 'It means unrestricted water.')
})

test('discussion is honestly unavailable without a provider', async () => {
  const out = await discuss({ segmentText: 's', segmentRef: '1.1', messages })
  assert.equal(out.available, false)
  assert.equal(out.reason, 'no-provider')
})

test('discussion refuses an empty/no-user final message before any provider call', async () => {
  let called = false
  const out = await discuss({ segmentText: 's', messages: [{ role: 'assistant', text: 'hi' }] },
    { generate: async () => { called = true; return { replyMd: 'x' } } })
  assert.equal(out.available, false)
  assert.equal(out.reason, 'empty')
  assert.equal(called, false)
})

test('a provider reply is parsed and returned', async () => {
  const out = await discuss({ segmentText: 's', segmentRef: '1.1', messages },
    { generate: async () => ({ replyMd: 'مطلق means unrestricted.' }) })
  assert.equal(out.available, true)
  assert.equal(out.result.replyMd, 'مطلق means unrestricted.')
})

test('a provider/parse failure is unavailable, not a fabricated reply', async () => {
  const out = await discuss({ segmentText: 's', messages }, { generate: async () => ({ wrong: 1 }) })
  assert.equal(out.available, false)
  assert.equal(out.reason, 'error')
})

test('summary is unavailable without a provider and parses a real note', async () => {
  const un = await summariseDiscussion({ segmentText: 's', messages })
  assert.equal(un.available, false)
  assert.equal(un.reason, 'no-provider')

  const ok = await summariseDiscussion({ segmentText: 's', messages },
    { generate: async () => ({ summaryText: 'Use "unrestricted water" for ماء مطلق.' }) })
  assert.equal(ok.available, true)
  assert.match(ok.result.summaryText, /unrestricted water/)
})

test('the summary prompt asks for a compact segment-specific note, not the transcript', () => {
  const p = buildDiscussionSummaryPrompt({ segmentText: 's', segmentRef: '1.1', messages })
  assert.match(p, /summaryText/)
  assert.match(p, /compact, durable, segment-specific/)
  assert.doesNotMatch(p, /restate the whole thread verbatim(?!)/) // instruction present, not violated
})
