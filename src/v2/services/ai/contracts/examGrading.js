// Exam grading — application contract.
//
// There is no standalone exam source prompt; the behavioural authority is the
// Study source prompt's §19 EXAM MODE (docs/ai/prompts/study/main-runtime-v6.txt)
// plus DECISIONS 2026-08-24 §2. Preserved rules:
//   - grade semantics and legal reasoning, not preferred English phrasing (§19.9)
//   - mark harshly on omitted operative conditions, evidences, rankings,
//     structural signals or derived consequences (§19.9)
//   - EXAM MARKING returns per-question result + why + minimal ideal points,
//     a weakness map and follow-up drills (§19.8)
//
// As with study grading, the APPLICATION computes the score and pass/miss set
// from the per-question results, so a lenient model cannot inflate an outcome,
// and misses carry the segment reference so remediation opens the exact segment.

export const QUESTION_RESULTS = Object.freeze(['correct', 'partial', 'incorrect'])
const RESULT_WEIGHT = { correct: 1, partial: 0.5, incorrect: 0 }

/**
 * @typedef {Object} ExamGradeResult
 * @property {number} score                 0..100, application-computed
 * @property {Array<{questionId:string,result:string,why:string,modelPoints:string,segmentRef:string,concept:string}>} questions
 * @property {string[]} weaknessMap
 * @property {string[]} followUpDrills
 * @property {number} correctCount
 * @property {number} missCount
 */

/**
 * Build the exam grading prompt. Application-native (not the source file); asks
 * for strict JSON with one entry per question, marked by semantics.
 */
export function buildExamGradingPrompt({ questions = [], answers = {}, sourceContext = '' }) {
  const items = questions.map((q, i) => ({
    questionId: q.id ?? String(i),
    prompt: q.prompt ?? q.label ?? '',
    concept: q.concept ?? '',
    segmentRef: q.segmentRef ?? q.ref ?? q.label ?? '',
    answer: (answers[q.id] ?? '').toString(),
  }))

  return [
    'You are a strict classical-Arabic (Ḥanafī fiqh) exam grader for al-Hidāyah study.',
    'Grade SEMANTICS and legal reasoning, not preferred English phrasing. Accept sound alternative wording.',
    'Mark harshly on omitted operative conditions, evidences, view-rankings, structural signals or derived consequences.',
    '',
    'For each question return: questionId, result (correct | partial | incorrect), why (brief), modelPoints (the minimal ideal answer points), and echo back segmentRef and concept.',
    'Also return weaknessMap[] (recurring weak areas) and followUpDrills[] (short practice prompts).',
    '',
    'Return ONE strict JSON object only, no prose: { questions:[{questionId,result,why,modelPoints,segmentRef,concept}], weaknessMap:[], followUpDrills:[] }.',
    '',
    sourceContext ? `STUDIED SOURCE CONTEXT:\n${sourceContext}\n` : '',
    'QUESTIONS AND ANSWERS (JSON):',
    JSON.stringify(items),
  ].filter(Boolean).join('\n')
}

/**
 * Validate a raw provider response into an ExamGradeResult and compute the score
 * from the per-question results (never trusting a model-supplied total).
 */
export function parseExamGradeResult(raw, questions = []) {
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw
  if (!data || typeof data !== 'object' || !Array.isArray(data.questions)) {
    throw new Error('exam grade response missing a questions array')
  }
  const byId = new Map(questions.map((q, i) => [q.id ?? String(i), q]))

  const graded = data.questions.map((entry, i) => {
    const source = byId.get(entry?.questionId) ?? questions[i] ?? {}
    return {
      questionId: entry?.questionId ?? source.id ?? String(i),
      result: QUESTION_RESULTS.includes(entry?.result) ? entry.result : 'incorrect',
      why: String(entry?.why ?? ''),
      modelPoints: String(entry?.modelPoints ?? ''),
      segmentRef: String(entry?.segmentRef ?? source.segmentRef ?? source.ref ?? source.label ?? ''),
      concept: String(entry?.concept ?? source.concept ?? ''),
    }
  })

  if (graded.length === 0) throw new Error('exam grade response graded no questions')

  const total = graded.length
  const earned = graded.reduce((sum, q) => sum + (RESULT_WEIGHT[q.result] ?? 0), 0)
  const score = Math.round((earned / total) * 100)
  const correctCount = graded.filter((q) => q.result === 'correct').length
  const missCount = graded.filter((q) => q.result === 'incorrect').length

  return {
    score,
    questions: graded,
    weaknessMap: Array.isArray(data.weaknessMap) ? data.weaknessMap.map(String) : [],
    followUpDrills: Array.isArray(data.followUpDrills) ? data.followUpDrills.map(String) : [],
    correctCount,
    missCount,
    isSample: false,
  }
}
