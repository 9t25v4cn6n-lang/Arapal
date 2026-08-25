// AI provider configuration — local, user-supplied, never bundled.
//
// DECISIONS 2026-08-24 §3: AI is a real service behind a provider-neutral
// boundary; "a shared provider API secret must not be embedded in a publicly
// distributed browser bundle." Arapal V1 is local-first and single-user, so the
// only interpretation consistent with all of those is a BYO-key model: the user
// supplies their own provider key, stored locally, and when none is configured
// the app is honestly UNAVAILABLE — it never fabricates AI output.

const KEY = 'arapal.ai.config'

const hasWindow = () => typeof window !== 'undefined' && !!window.localStorage

/** @returns {{provider:string, apiKey:string, model:string}|null} */
export function readAiConfig() {
  if (!hasWindow()) {
    // Allow a server/test-injected env key without ever shipping one in the
    // bundle. import.meta.env values are build-time; a real deployment does not
    // define this, so the browser default remains "unconfigured".
    return null
  }
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.provider || !parsed?.apiKey) return null
    return { provider: parsed.provider, apiKey: parsed.apiKey, model: parsed.model || defaultModelFor(parsed.provider) }
  } catch {
    return null
  }
}

export function writeAiConfig({ provider, apiKey, model }) {
  if (!hasWindow()) return false
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ provider, apiKey, model: model || defaultModelFor(provider) }))
    return true
  } catch {
    return false
  }
}

export function clearAiConfig() {
  if (!hasWindow()) return
  try { window.localStorage.removeItem(KEY) } catch { /* ignore */ }
}

export function isAiConfigured() {
  return readAiConfig() !== null
}

function defaultModelFor(provider) {
  if (provider === 'gemini') return 'gemini-2.0-flash'
  return ''
}
