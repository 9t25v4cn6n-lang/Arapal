// Study Discussion + Discussion Summary — application contracts.
//
// Derived from docs/ai/prompts/discussion/default.txt and
// docs/ai/prompts/discussion-summary/default.txt (left unchanged). Preserved
// behaviour: the discussion is a contextual sidecar to ONE segment; it explains
// wording, juristic signals, structural distinctions and answers follow-ups, but
// must NOT re-grade the attempt, invent source text, or reveal a best translation
// before the segment has passed. The summary distils a finished discussion into
// one compact, segment-specific note — not the whole transcript.

/**
 * Build the discussion reply prompt. Grounded in the current segment and the
 * prior turns; `revealBestTranslation` gates the source prompt's "do not reveal
 * best translation before pass" rule at the application level.
 */
export function buildDiscussionPrompt({ segmentText, segmentRef = '', messages = [], revealBestTranslation = false }) {
  const history = messages
    .map((m) => `${m.role === 'user' ? 'STUDENT' : 'TUTOR'}: ${m.text}`)
    .join('\n')

  return [
    "You are Arapal's segment discussion sidecar for classical-Arabic (Ḥanafī fiqh) study.",
    'Use ONLY the supplied segment and thread history. Stay on THIS segment.',
    'You may: explain wording, juristic signals, structural/evidentiary distinctions, and answer the follow-up directly.',
    'You must NOT: re-grade the attempt as the evaluator, invent source text, fabricate a record, or drift into unrelated tutoring.',
    revealBestTranslation ? '' : 'The segment has NOT been passed, so do NOT reveal a full best-in-class translation.',
    'Keep the reply precise, compact and useful. Light markdown allowed.',
    '',
    'Return ONE strict JSON object only: { "replyMd": "..." }',
    '',
    `SEGMENT ${segmentRef}:`,
    segmentText,
    '',
    history ? `THREAD SO FAR:\n${history}` : 'THREAD SO FAR: (none)',
  ].filter(Boolean).join('\n')
}

export function parseDiscussionReply(raw) {
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw
  const replyMd = data && typeof data === 'object' ? data.replyMd : null
  if (!replyMd || typeof replyMd !== 'string' || !replyMd.trim()) {
    throw new Error('discussion reply missing replyMd')
  }
  return { replyMd: replyMd.trim() }
}

/**
 * Build the discussion-summary prompt: distil the finished thread into one
 * compact, durable, segment-specific note. Preserves the key clarification /
 * correction / takeaway; does not re-grade, invent doctrine, or restate the
 * whole thread.
 */
export function buildDiscussionSummaryPrompt({ segmentText, segmentRef = '', messages = [] }) {
  const thread = messages
    .map((m) => `${m.role === 'user' ? 'STUDENT' : 'TUTOR'}: ${m.text}`)
    .join('\n')

  return [
    "You are Arapal's discussion-summary writer.",
    'Summarise this single-segment discussion into a compact, durable, segment-specific note.',
    'Preserve the key clarification, the important distinction or correction, and any durable takeaway.',
    'Do NOT re-grade, create a new best translation, restate the whole thread verbatim, or invent doctrine.',
    '',
    'Return ONE strict JSON object only: { "summaryText": "..." }',
    '',
    `SEGMENT ${segmentRef}:`,
    segmentText,
    '',
    `DISCUSSION:\n${thread}`,
  ].join('\n')
}

export function parseDiscussionSummary(raw) {
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw
  const summaryText = data && typeof data === 'object' ? data.summaryText : null
  if (!summaryText || typeof summaryText !== 'string' || !summaryText.trim()) {
    throw new Error('discussion summary missing summaryText')
  }
  return { summaryText: summaryText.trim() }
}
