// AI operational-state + central error normalisation (S3-005). Key presence is
// not verification, and no raw transport string is ever surfaced.

import { test, before, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

function installStorageShim() {
  const make = () => {
    const map = new Map()
    return {
      getItem: (k) => (map.has(k) ? map.get(k) : null),
      setItem: (k, v) => map.set(k, String(v)),
      removeItem: (k) => map.delete(k),
      clear: () => map.clear(),
    }
  }
  globalThis.window = { localStorage: make() }
  globalThis.localStorage = globalThis.window.localStorage
}

let health, config
before(async () => {
  installStorageShim()
  health = await import('../../src/v2/services/ai/health.js')
  config = await import('../../src/v2/services/ai/config.js')
})
beforeEach(() => { globalThis.window.localStorage.clear() })

test('state is "absent" with no configuration', () => {
  assert.equal(health.getAiState(), 'absent')
})

test('a saved key is "unverified" — never silently "verified"', () => {
  config.writeAiConfig({ provider: 'gemini', apiKey: 'k', model: 'm' })
  assert.equal(health.getAiState(), 'unverified')
})

test('a real success marks "verified"; a real failure marks "failed"', () => {
  config.writeAiConfig({ provider: 'gemini', apiKey: 'k', model: 'm' })
  health.recordAiSuccess()
  assert.equal(health.getAiState(), 'verified')
  health.recordAiFailure()
  assert.equal(health.getAiState(), 'failed')
  health.resetAiHealth()
  assert.equal(health.getAiState(), 'unverified')
})

test('provider/HTTP/network/parse errors normalise to calm, non-raw messages', () => {
  const cases = [
    ['gemini request failed: 400', 'auth'],
    ['gemini request failed: 401', 'auth'],
    ['API_KEY_INVALID', 'auth'],
    ['gemini request failed: 429', 'quota'],
    ['RESOURCE_EXHAUSTED quota', 'quota'],
    ['failed to fetch', 'network'],
    ['ETIMEDOUT', 'network'],
    ['Unexpected token < in JSON', 'parse'],
    ['gemini response contained no text', 'parse'],
    ['something weird', 'unknown'],
  ]
  for (const [raw, kind] of cases) {
    const n = health.normalizeAiError(new Error(raw))
    assert.equal(n.kind, kind, `kind for "${raw}"`)
    assert.doesNotMatch(n.message, /\b400\b|\b401\b|\b429\b|gemini request failed|ETIMEDOUT|JSON/i,
      `normalised message must not leak the raw transport string for "${raw}"`)
    assert.ok(n.message.length > 0)
  }
})
