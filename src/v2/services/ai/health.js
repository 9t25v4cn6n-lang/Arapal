// AI operational state + central error normalisation (S3-005).
//
// "A key is stored" is NOT the same as "AI works". This module is the single
// place that distinguishes the four states every AI surface must agree on:
//
//   absent      — no provider configured.
//   unverified  — a key is stored but no real call has succeeded yet.
//   verified    — a real provider call has succeeded on this device.
//   failed      — the most recent real provider call failed (bad key, quota,
//                 network, or a malformed response).
//
// It also normalises provider/network/HTTP/parse errors to user-facing messages,
// so a raw string like "gemini request failed: 400" never reaches a user.

import { isAiConfigured } from './config.js'

const HEALTH_KEY = 'arapal.ai.health'

const hasWindow = () => typeof window !== 'undefined' && !!window.localStorage

/** @returns {'verified'|'failed'|'unverified'} the recorded last-call outcome. */
export function readAiHealth() {
  if (!hasWindow()) return 'unverified'
  try {
    const raw = window.localStorage.getItem(HEALTH_KEY)
    return raw === 'verified' || raw === 'failed' ? raw : 'unverified'
  } catch {
    return 'unverified'
  }
}

function writeAiHealth(value) {
  if (!hasWindow()) return
  try {
    if (value) window.localStorage.setItem(HEALTH_KEY, value)
    else window.localStorage.removeItem(HEALTH_KEY)
  } catch { /* ignore */ }
}

export function recordAiSuccess() { writeAiHealth('verified') }
export function recordAiFailure() { writeAiHealth('failed') }
/** Reset to unverified — used when a new key is saved (its validity is unknown). */
export function resetAiHealth() { writeAiHealth(null) }

/**
 * The single AI operational state, consistent across Study, Discussion,
 * Research, and Exams.
 * @returns {'absent'|'unverified'|'verified'|'failed'}
 */
export function getAiState() {
  if (!isAiConfigured()) return 'absent'
  return readAiHealth()
}

/**
 * Map any provider/network/HTTP/parse error to a calm, user-facing message and
 * a coarse `kind`. Never returns the raw transport string.
 * @returns {{ message:string, kind:'auth'|'quota'|'network'|'parse'|'unknown' }}
 */
export function normalizeAiError(error) {
  const raw = String((error && error.message) || error || '')
  if (/\b400\b|\b401\b|\b403\b|api[_\s-]?key|invalid.*key|PERMISSION_DENIED|unauthenticated/i.test(raw)) {
    return { kind: 'auth', message: 'The AI provider rejected the request — check your API key in AI setup.' }
  }
  if (/\b429\b|quota|rate.?limit|RESOURCE_EXHAUSTED/i.test(raw)) {
    return { kind: 'quota', message: 'The AI provider is rate-limiting or out of quota. Try again shortly.' }
  }
  if (/network|failed to fetch|ENOTFOUND|ECONNREFUSED|timeout|ETIMEDOUT|dns/i.test(raw)) {
    return { kind: 'network', message: 'Couldn’t reach the AI provider. Check your connection and try again.' }
  }
  if (/json|parse|unexpected token|no text|contained no/i.test(raw)) {
    return { kind: 'parse', message: 'The AI provider returned an unexpected response. Try again.' }
  }
  return { kind: 'unknown', message: 'The AI request couldn’t be completed. Please try again.' }
}
