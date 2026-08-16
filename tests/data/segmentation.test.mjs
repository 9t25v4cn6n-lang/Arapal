// Parity tests for the extracted segmentation logic.
//
// These pin the behaviour that must be identical to the legacy screen, so the
// 5,946-line original can be archived on evidence rather than hope. The one
// intended difference — Arabic sentence terminators — is asserted explicitly.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  splitIntoSentences, splitIntoParagraphs, chunkUnits, getChunkSize,
  generateMarkers, getReviewState, markersToChunks, DEFAULT_OPTIONS,
} from '../../src/v2/lib/segmentation.js'

const THREE = 'AUDITONE first sentence here. AUDITTWO second sentence here. AUDITTHREE third sentence here.'

// ── parity with the legacy implementation ────────────────────────────────────

test('sentence splitting matches legacy behaviour for Latin text', () => {
  assert.deepEqual(splitIntoSentences('One. Two! Three?'), ['One.', 'Two!', 'Three?'])
  assert.deepEqual(splitIntoSentences('  spaced   out.  '), ['spaced out.'])
  assert.deepEqual(splitIntoSentences(''), [])
})

test('trailing text without punctuation is still a sentence', () => {
  assert.deepEqual(splitIntoSentences('One. Two'), ['One.', 'Two'])
})

test('paragraph splitting requires a blank line', () => {
  assert.deepEqual(splitIntoParagraphs('a\n\nb'), ['a', 'b'])
  assert.deepEqual(splitIntoParagraphs('a\nb'), ['a\nb'])
})

test('chunk size follows granularity, not style', () => {
  assert.equal(getChunkSize('sentence', 'tight'), 1)
  assert.equal(getChunkSize('sentence', 'balanced'), 2)
  assert.equal(getChunkSize('sentence', 'broad'), 3)
  assert.equal(getChunkSize('meaning', 'balanced'), 2, 'legacy branched on style but returned identical values')
})

test('chunkUnits groups without dropping units', () => {
  assert.deepEqual(chunkUnits([1, 2, 3], 2), [[1, 2], [3]])
  assert.deepEqual(chunkUnits([], 2), [])
})

test('granularity changes the segment count — the observable behaviour the UI depends on', () => {
  assert.equal(generateMarkers(THREE, 'ai', 'sentence', 'tight').length, 3)
  assert.equal(generateMarkers(THREE, 'ai', 'sentence', 'balanced').length, 2)
  assert.equal(generateMarkers(THREE, 'ai', 'sentence', 'broad').length, 1)
})

test("the user's own text survives into the markers", () => {
  const markers = generateMarkers(THREE, 'ai', 'sentence', 'tight')
  assert.match(markers[0].text, /AUDITONE/)
  assert.match(markers[2].text, /AUDITTHREE/)
})

test('empty input yields no markers rather than one empty marker', () => {
  assert.deepEqual(generateMarkers('   ', 'ai', 'sentence', 'balanced'), [])
})

test('manual method suppresses review flags; ai method applies them', () => {
  const long = Array.from({ length: 60 }, (_, i) => `word${i}`).join(' ') + '.'
  assert.equal(generateMarkers(long, 'manual', 'sentence', 'balanced')[0].reviewState, null)
  assert.ok(generateMarkers(long, 'ai', 'sentence', 'balanced')[0].reviewState)
})

test('review state escalates by distance from the expected length', () => {
  const words = (n) => Array.from({ length: n }, (_, i) => `w${i}`).join(' ')
  // sentence/balanced: lower 4, upper 32; strong bounds 1 and round(32*1.35)=43.
  assert.equal(getReviewState(words(2), 'sentence', 'balanced', 3), 'second-look', 'short but not extreme')
  assert.equal(getReviewState(words(12), 'sentence', 'balanced', 3), null, 'comfortably in range')
  assert.equal(getReviewState(words(36), 'sentence', 'balanced', 3), 'second-look', 'over the soft upper bound')
  assert.equal(getReviewState(words(50), 'sentence', 'balanced', 3), 'needs-review', 'past the hard upper bound')
  assert.equal(getReviewState('', 'sentence', 'balanced', 3), null, 'empty text is not a finding')
})

test('LATENT DEFECT pinned: the single-overlong-segment branch is unreachable', () => {
  // Documents legacy behaviour rather than endorsing it. The final branch of
  // getReviewState can never execute, because anything above the upper bound
  // has already returned. Pinned so that fixing it is a visible, deliberate
  // change with its own review — not an accident during extraction.
  const words = (n) => Array.from({ length: n }, (_, i) => `w${i}`).join(' ')
  assert.equal(getReviewState(words(41), 'sentence', 'balanced', 1), 'second-look',
    'intent was needs-review; the branch is dead, so second-look is what ships')
  assert.equal(getReviewState(words(44), 'sentence', 'balanced', 1), 'needs-review',
    'needs-review only ever comes from the hard upper bound, never the single-segment rule')
})

test('markers carry ids, labels and monotonic positions', () => {
  const markers = generateMarkers(THREE, 'ai', 'sentence', 'tight')
  assert.deepEqual(markers.map((m) => m.id), ['1', '2', '3'])
  assert.deepEqual(markers.map((m) => m.label), ['Segment 1', 'Segment 2', 'Segment 3'])
  assert.ok(markers[1].position > markers[0].position)
})

// ── the intended correction ──────────────────────────────────────────────────

test('ARABIC FIX: Arabic sentence terminators split, where legacy produced one blob', () => {
  const arabic = 'الماء المطلق طهور. هل يجوز التيمم؟ نعم يجوز۔'
  const sentences = splitIntoSentences(arabic)
  assert.equal(sentences.length, 3, '؟ and ۔ terminate sentences just as .!? do in Latin')
})

test('ARABIC FIX: the Arabic comma does not terminate a sentence', () => {
  const arabic = 'الماء المطلق طهور، ولا يخرج عن الطهورية.'
  assert.equal(splitIntoSentences(arabic).length, 1, '، is a comma, not a full stop')
})

test('ARABIC FIX does not alter Latin splitting', () => {
  assert.deepEqual(splitIntoSentences('One. Two! Three?'), ['One.', 'Two!', 'Three?'])
  assert.equal(generateMarkers(THREE, 'ai', 'sentence', 'balanced').length, 2)
})

// ── handoff shape ────────────────────────────────────────────────────────────

test('markers convert to the shape publishSegments expects', () => {
  const chunks = markersToChunks(generateMarkers(THREE, 'ai', 'sentence', 'tight'), { chapterLabel: 'Chapter 1' })
  assert.equal(chunks.length, 3)
  assert.deepEqual(chunks.map((c) => c.ref), ['1.1', '1.2', '1.3'])
  assert.equal(chunks[0].chapterLabel, 'Chapter 1')
  assert.match(chunks[0].text, /AUDITONE/)
})

test('defaults match the legacy screen defaults', () => {
  assert.equal(DEFAULT_OPTIONS.method, 'ai')
  assert.equal(DEFAULT_OPTIONS.style, 'sentence')
  assert.equal(DEFAULT_OPTIONS.granularity, 'balanced')
})
