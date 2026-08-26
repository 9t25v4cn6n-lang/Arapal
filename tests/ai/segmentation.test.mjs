// Provider-backed segmentation contract + service. The AI proposes marker
// anchors only; the application compiles them deterministically against the real
// source, drops hallucinated anchors, and never publishes canonical segments
// (S3-001). Honest-unavailable without a provider.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildSegmentationPrompt,
  compileSegmentationMarkers,
  parseSegmentationResult,
} from '../../src/v2/services/ai/contracts/segmentation.js'
import { segmentText } from '../../src/v2/services/ai/index.js'

const SOURCE = 'الماء المطلق طهور لا يخرج عن الطهورية. والتيمم جائز عند عدم الماء أو العجز عنه.'

test('the prompt forbids rewriting and demands verbatim anchors + JSON markers', () => {
  const p = buildSegmentationPrompt({ source: SOURCE, style: 'topic', granularity: 'broad' })
  assert.match(p, /marker proposals only/i)
  assert.match(p, /NOT authoritative/i)
  assert.match(p, /insertBeforeAnchor/)
  assert.match(p, /الماء المطلق طهور/)
})

test('compile splits the source at each real anchor and names each segment', () => {
  const chunks = compileSegmentationMarkers(SOURCE, [
    { insertBeforeAnchor: 'والتيمم', topicTitle: 'Tayammum', sectionLabel: 'Purity' },
  ])
  assert.equal(chunks.length, 2)
  assert.match(chunks[0].text, /الماء المطلق طهور/)
  assert.match(chunks[1].text, /والتيمم/)
  assert.equal(chunks[1].title, 'Tayammum')
})

test('hallucinated anchors (absent from the source) are dropped, not trusted', () => {
  const chunks = compileSegmentationMarkers(SOURCE, [
    { insertBeforeAnchor: 'THIS TEXT IS NOT IN THE SOURCE', topicTitle: 'Bogus' },
  ])
  // No usable anchor → the whole source as one segment, never a fabricated split.
  assert.equal(chunks.length, 1)
  assert.equal(chunks[0].text, SOURCE)
})

test('parse rejects a structurally invalid result', () => {
  assert.throws(() => parseSegmentationResult({ notMarkers: true }, SOURCE), /markers/)
})

test('segmentText is honestly unavailable without a provider — never a fabricated split', async () => {
  const out = await segmentText({ source: SOURCE })
  assert.equal(out.available, false)
  assert.equal(out.reason, 'no-provider')
})

test('segmentText refuses empty source before any provider call', async () => {
  let called = false
  const out = await segmentText({ source: '   ' }, { generate: async () => { called = true; return {} } })
  assert.equal(out.available, false)
  assert.equal(out.reason, 'empty')
  assert.equal(called, false)
})

test('a valid provider response yields a compiled, non-authoritative proposal', async () => {
  const out = await segmentText(
    { source: SOURCE },
    { generate: async () => ({ markers: [{ insertBeforeAnchor: 'والتيمم', topicTitle: 'Tayammum' }] }) },
  )
  assert.equal(out.available, true)
  assert.equal(out.result.chunks.length, 2)
})
