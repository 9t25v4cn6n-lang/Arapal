// Project Research "Ask across the whole project" — application contract.
//
// The Research companion previously rendered a single hard-coded paragraph for
// every question, with two fixture citations, and never called anything. That is
// exactly the fabricated-output failure the AI boundary exists to prevent: an
// answer presented as this project's own knowledge that the product never
// derived. This contract grounds a project-level question in the project's OWN
// canonical segments and asks for an answer plus the segment refs it relied on,
// so citations are real and checkable. There is no separate source prompt for
// this capability; it is application-native and deliberately conservative.

/**
 * Build the research-ask prompt. Grounded ONLY in the supplied segments; the
 * model is told to cite by the segment refs it was given and to say when the
 * project does not contain the answer rather than inventing one.
 */
export function buildResearchAskPrompt({ question, segments = [] }) {
  const corpus = segments
    .map((s) => `[${s.ref}] ${s.heading ? `${s.heading}: ` : ''}${s.text}`)
    .join('\n')

  return [
    "You are Arapal's project research companion for classical-Arabic (Ḥanafī fiqh) study.",
    'Answer the question using ONLY the project segments supplied below.',
    'Cite the segments you used by their bracketed ref (e.g. "1.2"). Only cite refs that appear below.',
    'If the supplied segments do not contain the answer, say so plainly instead of inventing one.',
    'Do NOT invent source text, doctrine, or segments that are not listed.',
    'Keep the answer precise and compact. Light markdown allowed.',
    '',
    'Return ONE strict JSON object only: { "answerMd": "...", "citations": ["1.2", ...] }',
    '',
    'PROJECT SEGMENTS:',
    corpus || '(this project has no segments)',
    '',
    `QUESTION: ${question}`,
  ].join('\n')
}

/**
 * Parse the research answer. Citations are filtered to refs that were actually
 * supplied to the model, so a hallucinated citation cannot reach the UI as a
 * clickable, authoritative-looking segment link.
 */
export function parseResearchAnswer(raw, allowedRefs = null) {
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw
  const answerMd = data && typeof data === 'object' ? data.answerMd : null
  if (!answerMd || typeof answerMd !== 'string' || !answerMd.trim()) {
    throw new Error('research answer missing answerMd')
  }

  const rawCitations = Array.isArray(data.citations) ? data.citations.map(String) : []
  const allow = allowedRefs ? new Set(allowedRefs.map(String)) : null
  const seen = new Set()
  const citations = rawCitations.filter((ref) => {
    if (allow && !allow.has(ref)) return false
    if (seen.has(ref)) return false
    seen.add(ref)
    return true
  })

  return { answerMd: answerMd.trim(), citations }
}
