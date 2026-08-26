// Arapal AI service — the provider-neutral boundary.
//
// Every AI-backed capability (study grading now; discussion, summary, exam,
// segmentation later) goes through here. Screens and the store call these
// functions and never a provider SDK, so the provider is swappable and the
// "no provider configured" path is honest and central.
//
// Contract (DECISIONS §3): when AI is unavailable, return a structured
// { available:false } result. Callers MUST render an honest unavailable state
// and MUST NOT fabricate output. Nothing here ever invents a grade.

import { readAiConfig } from './config.js'
import { recordAiSuccess, recordAiFailure, normalizeAiError } from './health.js'
import { buildStudyGradingPrompt, parseStudyGradeResult } from './contracts/studyGrading.js'
import { buildExamGradingPrompt, parseExamGradeResult } from './contracts/examGrading.js'
import {
  buildDiscussionPrompt, parseDiscussionReply,
  buildDiscussionSummaryPrompt, parseDiscussionSummary,
} from './contracts/discussion.js'
import { buildResearchAskPrompt, parseResearchAnswer } from './contracts/research.js'
import { buildSegmentationPrompt, parseSegmentationResult } from './contracts/segmentation.js'
import { generateJson as geminiGenerateJson } from './providers/gemini.js'

export { isAiConfigured, readAiConfig, writeAiConfig, clearAiConfig } from './config.js'
export { getAiState, readAiHealth, resetAiHealth, normalizeAiError } from './health.js'

/** Provider registry. New providers register a generateJson(config, prompt). */
const PROVIDERS = {
  gemini: geminiGenerateJson,
}

/**
 * Dependency seam for tests: callers can pass an explicit `generate` function
 * (config, prompt) => Promise<object>, otherwise the configured provider is used.
 */
function resolveGenerate(explicit) {
  if (explicit) return explicit
  const config = readAiConfig()
  if (!config) return null
  const impl = PROVIDERS[config.provider]
  if (!impl) return null
  // Central seam: every real provider call updates the AI operational state and
  // surfaces only a NORMALISED error, so no service returns a raw transport
  // string and the verified/failed state is consistent everywhere (S3-005).
  return async (prompt) => {
    try {
      const out = await impl(config, prompt)
      recordAiSuccess()
      return out
    } catch (error) {
      recordAiFailure()
      throw new Error(normalizeAiError(error).message)
    }
  }
}

const unavailable = (reason, message = '') => ({ available: false, reason, message })

/**
 * Grade a study translation attempt.
 *
 * @returns {Promise<{available:true, result:object} | {available:false, reason:string, message?:string}>}
 */
export async function gradeStudyAttempt({ source, translation, attempt = 0, priorFeedback = '' }, { generate } = {}) {
  const run = resolveGenerate(generate)
  if (!run) return unavailable('no-provider', 'AI grading is not configured on this device.')
  if (!translation || !translation.trim()) return unavailable('empty', 'Nothing to grade.')

  try {
    const prompt = buildStudyGradingPrompt({ source, translation, attempt, priorFeedback })
    const raw = await run(prompt)
    const result = parseStudyGradeResult(raw)
    return { available: true, result }
  } catch (error) {
    // A provider/network/parse failure must not become a fabricated grade.
    return unavailable('error', error?.message || 'AI grading failed.')
  }
}

/**
 * Grade an exam attempt. Same honesty contract as study grading: unavailable
 * when no provider is configured or on failure, and the score is computed by the
 * application from the per-question results — never fabricated from answer length
 * or fixed question indexes (the R-016 exam defect).
 *
 * @returns {Promise<{available:true, result:object} | {available:false, reason:string, message?:string}>}
 */
export async function gradeExam({ questions, answers, sourceContext = '' }, { generate } = {}) {
  const run = resolveGenerate(generate)
  if (!run) return unavailable('no-provider', 'AI grading is not configured on this device.')
  if (!Array.isArray(questions) || questions.length === 0) return unavailable('empty', 'No questions to grade.')

  try {
    const prompt = buildExamGradingPrompt({ questions, answers, sourceContext })
    const raw = await run(prompt)
    const result = parseExamGradeResult(raw, questions)
    return { available: true, result }
  } catch (error) {
    return unavailable('error', error?.message || 'AI exam grading failed.')
  }
}

/**
 * Contextual Study discussion reply. Same honesty contract: unavailable without
 * a provider or on failure — never a fabricated reply.
 */
export async function discuss({ segmentText, segmentRef, messages, revealBestTranslation }, { generate } = {}) {
  const run = resolveGenerate(generate)
  if (!run) return unavailable('no-provider', 'Discussion needs an AI provider, which is not configured on this device.')
  const last = messages?.[messages.length - 1]
  if (!last || last.role !== 'user' || !last.text?.trim()) return unavailable('empty', 'Nothing to send.')

  try {
    const prompt = buildDiscussionPrompt({ segmentText, segmentRef, messages, revealBestTranslation })
    const raw = await run(prompt)
    const result = parseDiscussionReply(raw)
    return { available: true, result }
  } catch (error) {
    return unavailable('error', error?.message || 'The discussion reply failed.')
  }
}

/**
 * Answer a project-level question grounded in the project's own segments.
 * Honest-unavailable without a provider or on failure — never the old fixture
 * paragraph. Citations are constrained to refs that were actually supplied.
 */
export async function researchAsk({ question, segments = [] }, { generate } = {}) {
  const run = resolveGenerate(generate)
  if (!run) return unavailable('no-provider', 'The research companion needs an AI provider, which is not configured on this device.')
  if (!question || !question.trim()) return unavailable('empty', 'Ask a question first.')

  try {
    const prompt = buildResearchAskPrompt({ question, segments })
    const raw = await run(prompt)
    const result = parseResearchAnswer(raw, segments.map((s) => s.ref))
    return { available: true, result }
  } catch (error) {
    return unavailable('error', error?.message || 'The research answer failed.')
  }
}

/**
 * Provider-backed segmentation. Returns a NON-AUTHORITATIVE proposal (chunks)
 * compiled from validated marker anchors, or an honest unavailable/failed state
 * — never canonical segments and never a fabricated split. The application, not
 * this call, decides when a proposal becomes canonical (S3-001).
 */
export async function segmentText({ source, style = 'meaning', granularity = 'balanced' }, { generate } = {}) {
  const run = resolveGenerate(generate)
  if (!run) return unavailable('no-provider', 'AI segmentation needs an AI provider, which is not configured on this device.')
  if (!source || !source.trim()) return unavailable('empty', 'Paste some source text first.')

  try {
    const prompt = buildSegmentationPrompt({ source, style, granularity })
    const raw = await run(prompt)
    const result = parseSegmentationResult(raw, source)
    if (!result.chunks.length) return unavailable('error', 'The segmentation result was empty.')
    return { available: true, result }
  } catch (error) {
    return unavailable('error', error?.message || 'AI segmentation failed.')
  }
}

/** Distil a finished discussion into one durable note. */
export async function summariseDiscussion({ segmentText, segmentRef, messages }, { generate } = {}) {
  const run = resolveGenerate(generate)
  if (!run) return unavailable('no-provider', 'Summaries need an AI provider, which is not configured on this device.')
  if (!Array.isArray(messages) || messages.length === 0) return unavailable('empty', 'Nothing to summarise.')

  try {
    const prompt = buildDiscussionSummaryPrompt({ segmentText, segmentRef, messages })
    const raw = await run(prompt)
    const result = parseDiscussionSummary(raw)
    return { available: true, result }
  } catch (error) {
    return unavailable('error', error?.message || 'The summary failed.')
  }
}
