// DEV-ONLY Study grade override — isolated and easily removable.
//
// Purpose: let the Study PASS and FAIL result screens be exercised and reviewed
// without a live AI provider, so the "what do those screens look like / how do
// they function" question can be answered during development.
//
// Activate (dev server only):
//   • URL query  ?v2GradeOverride=pass   (or =fail)
//   • or         localStorage['arapal.dev.gradeOverride'] = 'pass' | 'fail'
//
// Safety: inert in production builds. `import.meta.env.DEV` is folded to `false`
// by Vite in a `npm run build`, so `readDevGradeOverride()` always returns null
// there and this can NEVER fabricate a grade in the released product (the
// directive's "no production fixture fallback" invariant holds).
//
// To remove entirely: delete this file and the single guarded branch at the top
// of `gradeStudyAttempt` in ./index.js.

export function readDevGradeOverride() {
  // Optional chaining: under raw `node --test` (no Vite) import.meta.env is
  // undefined, and in a production build Vite folds DEV to false — both must
  // return null so the override is inert outside the dev server.
  if (!import.meta.env?.DEV) return null
  if (typeof window === 'undefined') return null
  try {
    const query = new URLSearchParams(window.location.search).get('v2GradeOverride')
    const value = query || window.localStorage.getItem('arapal.dev.gradeOverride')
    return value === 'pass' || value === 'fail' ? value : null
  } catch {
    return null
  }
}

// Canned provider responses shaped exactly like the study grading contract, so
// they flow through the REAL parse → compute-outcome → store → result-adapter
// pipeline. The only thing skipped is the network call to the provider.
export function buildDevGradeResponse(mode) {
  if (mode === 'pass') {
    return JSON.stringify({
      grade: 9.1,
      criticalFails: [],
      anchors: [
        { anchor: 'Core ruling conveyed', status: 'correct', core: true, whyItMatters: 'The obligation is the point of the segment.', whatWentWrong: '' },
        { anchor: 'Key term rendered', status: 'correct', core: true, whyItMatters: 'The technical term carries the legal sense.', whatWentWrong: '' },
      ],
      categoryScores: { meaning: 9, terminology: 9, fluency: 9 },
      blockingIssues: [],
      feedback: 'Accurate and fluent. The core ruling and its key term are rendered correctly.',
      vocabulary: [
        { term: 'الطهارة', type: 'noun', gloss: 'purity / ritual purity', why: 'The precondition the segment turns on.' },
        { term: 'واجبة', type: 'adjective', gloss: 'obligatory', why: 'Establishes the ruling’s force.' },
      ],
      guidance: [
        { unit: 'الصلاة', type: 'noun', functionHere: 'subject of the ruling', rendering: 'the prayer' },
      ],
      takeaways: [
        { function: 'ruling', anchor: 'obligation', weight: 'core', evidence: 'واجبة على كل مسلم', note: 'The obligation is universal for the qualified.' },
      ],
      topics: ['obligation', 'purity'],
      bestTranslation: 'Praise be to God, Lord of the worlds. Prayer is obligatory upon every sane, adult Muslim.',
    })
  }

  // fail — a low grade alone drives the outcome; blockers are the real,
  // actionable set the FAIL screen renders.
  return JSON.stringify({
    grade: 4.2,
    criticalFails: [],
    anchors: [
      { anchor: 'Core ruling conveyed', status: 'incorrect', core: true, whyItMatters: 'The obligation is the point of the segment.', whatWentWrong: 'The obligation was dropped from the translation.' },
      { anchor: 'Qualification rendered', status: 'partial', core: false, whyItMatters: 'It limits who the ruling binds.', whatWentWrong: 'Rendered loosely.' },
    ],
    categoryScores: { meaning: 4, terminology: 5, fluency: 6 },
    blockingIssues: [
      { issueType: 'meaning', text: 'The obligation (واجبة) is not reflected in the translation.', fix: 'State plainly that prayer is obligatory.' },
      { issueType: 'terminology', text: 'The qualification "sane, adult" (بالغ عاقل) is missing.', fix: 'Include the qualification of who is bound.' },
    ],
    feedback: 'The core ruling of obligation is not conveyed. Restore it and the qualification, then retry.',
    vocabulary: [],
    guidance: [],
    takeaways: [],
    topics: ['obligation'],
    bestTranslation: '',
  })
}
