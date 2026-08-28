// Local-first trust contract: versioned export, validated restore, delete-all
// (Programme 8). These are data-loss-adjacent operations, so the invariants are
// asserted directly on the store.
//
//   npm run test:data

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
      get length() { return map.size },
      key: (i) => [...map.keys()][i] ?? null,
    }
  }
  globalThis.window = { localStorage: make(), sessionStorage: make() }
  globalThis.localStorage = globalThis.window.localStorage
  globalThis.sessionStorage = globalThis.window.sessionStorage
}

let store

before(async () => {
  installStorageShim()
  store = await import('../../src/v2/data/store.js')
})

beforeEach(() => {
  globalThis.window.localStorage.clear()
  store.__resetForTests()
})

const seed = () => {
  const project = store.addProject({ title: 'Kitab al-Tahara' })
  const source = store.addSource({ projectId: project.id, rawText: 'One. Two.' })
  store.publishSegments({ projectId: project.id, sourceId: source.id, chunks: ['First.', 'Second.'] })
  return project
}

test('exportBackup captures a versioned, kinded snapshot of the current data', () => {
  const project = seed()
  const backup = store.exportBackup()
  assert.equal(backup.kind, 'arapal-backup')
  assert.equal(typeof backup.version, 'number')
  assert.ok(backup.exportedAt)
  assert.ok(backup.state.projects[project.id], 'the project is in the backup')
})

test('deleteAllData clears every project and returns ok', () => {
  seed()
  assert.equal(store.listProjects().length, 1)
  const res = store.deleteAllData()
  assert.equal(res.ok, true)
  assert.equal(store.listProjects().length, 0)
})

test('export → delete-all → import restores the exact data', () => {
  const project = seed()
  const backup = store.exportBackup()
  store.deleteAllData()
  assert.equal(store.listProjects().length, 0)

  const res = store.importBackup(backup)
  assert.equal(res.ok, true)
  assert.equal(store.listProjects().length, 1)
  assert.equal(store.getProject(project.id).title, 'Kitab al-Tahara')
  assert.equal(store.listSegments(project.id).length, 2)
})

test('importBackup round-trips through a JSON string', () => {
  seed()
  const json = JSON.stringify(store.exportBackup())
  store.deleteAllData()
  const res = store.importBackup(json)
  assert.equal(res.ok, true)
  assert.equal(store.listProjects().length, 1)
})

test('importBackup rejects a non-Arapal file without touching current data', () => {
  const project = seed()
  const res = store.importBackup({ hello: 'world' })
  assert.equal(res.ok, false)
  assert.match(res.error, /not an Arapal backup/i)
  assert.equal(store.getProject(project.id).title, 'Kitab al-Tahara', 'current data untouched')
})

test('importBackup rejects a future-version backup', () => {
  seed()
  const res = store.importBackup({ kind: 'arapal-backup', version: 999, state: {} })
  assert.equal(res.ok, false)
  assert.match(res.error, /newer version/i)
})

test('importBackup rejects a malformed backup (bad collection shape)', () => {
  seed()
  const res = store.importBackup({ kind: 'arapal-backup', version: 1, state: { projects: [] } })
  assert.equal(res.ok, false)
  assert.match(res.error, /malformed/i)
})

// ── source-entry draft (Programme 1 / AC-01) ─────────────────────────────────

test('saveSourceDraft persists the raw text; getSourceDraft reads it back', () => {
  store.saveSourceDraft({ text: 'الحمد لله', title: 'Al-Hamd' })
  const draft = store.getSourceDraft()
  assert.equal(draft.text, 'الحمد لله')
  assert.equal(draft.title, 'Al-Hamd')
  assert.ok(draft.updatedAt)
})

test('saveSourceDraft with empty text clears the draft (no phantom draft)', () => {
  store.saveSourceDraft({ text: 'something' })
  assert.ok(store.getSourceDraft())
  store.saveSourceDraft({ text: '   ' })
  assert.equal(store.getSourceDraft(), null)
})

test('clearSourceDraft removes the draft after a source is committed', () => {
  store.saveSourceDraft({ text: 'draft text' })
  assert.ok(store.getSourceDraft())
  store.clearSourceDraft()
  assert.equal(store.getSourceDraft(), null)
})

test('the source draft is not a collection and does not break import/export', () => {
  store.saveSourceDraft({ text: 'in-progress' })
  const backup = store.exportBackup()
  assert.equal(backup.state.sourceDraft.text, 'in-progress')
  store.deleteAllData()
  assert.equal(store.getSourceDraft(), null)
  const res = store.importBackup(backup)
  assert.equal(res.ok, true)
  assert.equal(store.getSourceDraft().text, 'in-progress')
})
