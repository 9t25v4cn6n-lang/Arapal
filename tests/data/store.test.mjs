// Data-layer invariants.
//
// Each test below corresponds to a defect the audit measured in the running
// product. They are the reason the layer exists, so they are asserted directly
// rather than inferred from screen behaviour.
//
//   npm run test:data

import { test, before, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

// The store reads storage at module load, so the shim must exist first.
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
      _map: map,
    }
  }
  globalThis.window = { localStorage: make(), sessionStorage: make() }
  globalThis.localStorage = globalThis.window.localStorage
  globalThis.sessionStorage = globalThis.window.sessionStorage
}

let store, schema, storage

before(async () => {
  installStorageShim()
  store = await import('../../src/v2/data/store.js')
  schema = await import('../../src/v2/data/schema.js')
  storage = await import('../../src/v2/data/storage.js')
})

beforeEach(() => {
  globalThis.window.localStorage.clear()
  store.__resetForTests()
})

const seedProject = () => {
  const project = store.addProject({ title: 'Test project' })
  const source = store.addSource({ projectId: project.id, rawText: 'One. Two. Three.' })
  const segments = store.publishSegments({
    projectId: project.id,
    sourceId: source.id,
    chunks: ['First chunk.', 'Second chunk.'],
  })
  return { project, source, segments }
}

// ── the handoff that used to be discarded ────────────────────────────────────

test('segmentation output reaches the project instead of being discarded', () => {
  const { project, segments } = seedProject()
  assert.equal(segments.length, 2)
  const stored = store.listSegments(project.id)
  assert.equal(stored.length, 2)
  assert.equal(stored[0].text, 'First chunk.')
  assert.equal(store.getProject(project.id).currentSegmentId, stored[0].id)
})

test('re-segmentation replaces canonical segments but ARCHIVES prior work, never deletes it', () => {
  const { project, source, segments } = seedProject()
  store.saveDraft({ projectId: project.id, segmentId: segments[0].id, text: 'old draft' })

  store.publishSegments({ projectId: project.id, sourceId: source.id, chunks: ['Only one now.'] })

  // New canonical segmentation is in force…
  assert.equal(store.listSegments(project.id).length, 1)
  // …and the old draft no longer resolves against a segment that is gone…
  assert.equal(store.getDraft(project.id, segments[0].id), null)
  // …but it was preserved in the archive, not silently destroyed (DECISIONS §5).
  const archive = store.getSnapshot().archives[project.id]
  assert.ok(Array.isArray(archive) && archive.length === 1, 'prior work is archived')
  const archivedDraft = Object.values(archive[0].drafts).find((d) => d.text === 'old draft')
  assert.ok(archivedDraft, 'the archived draft text is recoverable')
})

// ── durable notes (IP-05) ─────────────────────────────────────────────────────

test('a saved note is persisted and survives a reload', () => {
  const { project, segments } = seedProject()
  const note = store.addNote({ projectId: project.id, segmentId: segments[0].id, text: 'keep this', source: 'discussion' })
  assert.ok(note && note.id, 'addNote returns the created note')
  assert.equal(store.listNotes(project.id, segments[0].id).length, 1)
  assert.equal(store.listNotes(project.id, segments[0].id)[0].text, 'keep this')
  assert.equal(store.listNotes(project.id, segments[0].id)[0].source, 'discussion')

  // A reload reads the persisted shape back; the note is still there.
  const reloaded = storage.read()
  const key = `${project.id}::${segments[0].id}`
  assert.ok(Array.isArray(reloaded.notes[key]), 'notes collection persisted for the segment')
  assert.equal(reloaded.notes[key][0].text, 'keep this')
})

test('an empty or whitespace-only note is refused, never stored', () => {
  const { project, segments } = seedProject()
  assert.equal(store.addNote({ projectId: project.id, segmentId: segments[0].id, text: '   ' }), null)
  assert.equal(store.listNotes(project.id, segments[0].id).length, 0)
})

test('re-segmentation archives notes rather than destroying them', () => {
  const { project, source, segments } = seedProject()
  store.addNote({ projectId: project.id, segmentId: segments[0].id, text: 'note on old segment' })

  store.publishSegments({ projectId: project.id, sourceId: source.id, chunks: ['Only one now.'] })

  assert.equal(store.listNotes(project.id, segments[0].id).length, 0, 'the old note no longer resolves against a gone segment')
  const archive = store.getSnapshot().archives[project.id]
  const archivedNote = Object.values(archive[0].notes).flat().find((n) => n.text === 'note on old segment')
  assert.ok(archivedNote, 'the note was archived, recoverable, not deleted')
})

test('deleting a project cascades to its notes', () => {
  const { project, segments } = seedProject()
  store.addNote({ projectId: project.id, segmentId: segments[0].id, text: 'note' })
  store.deleteProject(project.id)
  const key = `${project.id}::${segments[0].id}`
  assert.equal(store.getSnapshot().notes[key], undefined, 'no orphaned note key remains')
})

// ── proposal → approval authority (R-015 / DECISIONS §5) ──────────────────────

test('a proposal is not canonical: saving one publishes no segments', () => {
  const project = store.addProject({ title: 'Proposal project' })
  const source = store.addSource({ projectId: project.id, rawText: 'One. Two.' })
  store.saveProposal({
    projectId: project.id, sourceId: source.id,
    chunks: [{ text: 'One.' }, { text: 'Two.' }], method: 'ai',
  })
  // Before approval the authoritative segment count is zero.
  assert.equal(store.listSegments(project.id).length, 0)
  assert.ok(store.getProposal(project.id), 'the proposal is stored for review')
  assert.equal(store.getProjectProgress(project.id).total, 0)
})

test('approval publishes exactly the proposed chunks and clears the proposal', () => {
  const project = store.addProject({ title: 'Approve project' })
  const source = store.addSource({ projectId: project.id, rawText: 'One. Two.' })
  const proposal = store.saveProposal({
    projectId: project.id, sourceId: source.id,
    chunks: [{ text: 'One.', ref: '1.1' }, { text: 'Two.', ref: '1.2' }], method: 'ai',
  })

  store.publishSegments({ projectId: project.id, sourceId: source.id, chunks: proposal.chunks })

  const segs = store.listSegments(project.id)
  assert.equal(segs.length, 2)
  assert.equal(segs[0].text, 'One.')
  assert.equal(store.getProposal(project.id), null, 'the proposal is consumed on approval')
})

// ── the leak that put one segment's draft on another ─────────────────────────

test('drafts are keyed per segment and do not leak', () => {
  const { project, segments } = seedProject()
  store.saveDraft({ projectId: project.id, segmentId: segments[0].id, text: 'draft for one' })

  assert.equal(store.getDraft(project.id, segments[0].id).text, 'draft for one')
  assert.equal(
    store.getDraft(project.id, segments[1].id), null,
    'switching segments must not carry the previous draft',
  )
})

test('drafts do not leak between projects', () => {
  const a = seedProject()
  const b = seedProject()
  store.saveDraft({ projectId: a.project.id, segmentId: a.segments[0].id, text: 'project A' })
  store.saveDraft({ projectId: b.project.id, segmentId: b.segments[0].id, text: 'project B' })

  assert.equal(store.getDraft(a.project.id, a.segments[0].id).text, 'project A')
  assert.equal(store.getDraft(b.project.id, b.segments[0].id).text, 'project B')
})

test('an unscoped segment key is rejected rather than silently shared', () => {
  assert.throws(() => schema.segmentKey(null, 'seg_1'), /projectId/)
})

// ── the fabricated grade ─────────────────────────────────────────────────────

test('an empty translation is refused, not graded', () => {
  const { project, segments } = seedProject()
  const outcome = store.submitSegment({ projectId: project.id, segmentId: segments[0].id })
  assert.equal(outcome.ok, false)
  assert.equal(outcome.reason, 'empty')
  assert.equal(
    store.getStudyRecord(project.id, segments[0].id), null,
    'a refused submission must not create a study record',
  )
})

test('every result declares itself a sample and carries no invented score', () => {
  const { project, segments } = seedProject()
  store.saveDraft({ projectId: project.id, segmentId: segments[0].id, text: 'A full translation of the chunk.' })
  const { ok, result } = store.submitSegment({ projectId: project.id, segmentId: segments[0].id })

  assert.equal(ok, true)
  assert.equal(result.isSample, true, 'stub output must be labelled')
  assert.equal(result.score, null, 'a stub must not invent a numeric grade')
})

test('submitting records an ATTEMPT and never a pass from the surface check', () => {
  const { project, segments } = seedProject()
  store.saveDraft({ projectId: project.id, segmentId: segments[0].id, text: 'A full translation of the chunk.' })
  const out = store.submitSegment({ projectId: project.id, segmentId: segments[0].id })

  const record = store.getStudyRecord(project.id, segments[0].id)
  assert.equal(record.attempts, 1)
  // R-016: a form-level check must not masquerade as a semantic pass.
  assert.equal(record.submissionState, 'attempted')
  assert.equal(out.graded, false)
  assert.ok(record.lastResultId)
  // An attempt does not count toward project completion.
  assert.equal(store.getProjectProgress(project.id).completed, 0)
})

test('grading is honestly unavailable when no AI provider is configured', async () => {
  const { project, segments } = seedProject()
  store.saveDraft({ projectId: project.id, segmentId: segments[0].id, text: 'A full translation of the chunk.' })
  store.submitSegment({ projectId: project.id, segmentId: segments[0].id })

  const graded = await store.gradeSegment({ projectId: project.id, segmentId: segments[0].id })
  assert.equal(graded.ok, true)
  assert.equal(graded.graded, false)
  assert.equal(graded.reason, 'no-provider')
  // Still attempted, still not complete — no fabricated pass.
  assert.equal(store.getStudyRecord(project.id, segments[0].id).submissionState, 'attempted')
  assert.equal(store.getProjectProgress(project.id).completed, 0)
})

// ── persistence ──────────────────────────────────────────────────────────────

test('state round-trips through storage', async () => {
  const { project, segments } = seedProject()
  store.saveDraft({ projectId: project.id, segmentId: segments[0].id, text: 'survives reload' })

  // Simulate a reload: re-read persisted state into a fresh snapshot.
  const reloaded = storage.read()
  const key = schema.segmentKey(project.id, segments[0].id)
  assert.equal(reloaded.drafts[key].text, 'survives reload')
  assert.equal(Object.keys(reloaded.projects).length, 1)
  assert.equal(Object.keys(reloaded.segments).length, 2)
})

test('persistence reports failure honestly instead of claiming success', () => {
  const original = globalThis.window.localStorage.setItem
  globalThis.window.localStorage.setItem = () => { throw new Error('quota') }
  store.addProject({ title: 'will not persist' })
  assert.equal(store.persistenceHealthy(), false, 'a failed write must be reportable to the UI')
  globalThis.window.localStorage.setItem = original
})

test('corrupt storage does not brick the app', () => {
  globalThis.window.localStorage.setItem('arapal.v1.state', '{not json')
  const recovered = storage.read()
  assert.deepEqual(recovered.projects, {})
})

test('a wrong-shape persisted collection is quarantined, not thrown on (R-019)', () => {
  globalThis.window.localStorage.setItem('arapal.v1.state', JSON.stringify({ version: 1, projects: 'corrupt' }))
  const recovered = storage.read()
  assert.deepEqual(recovered.projects, {}, 'selectors get a clean empty collection, not a string')
  assert.ok(
    globalThis.window.localStorage.getItem('arapal.v1.state.quarantine'),
    'the corrupt state is kept aside for recovery, not deleted',
  )
})

test('a future-version persisted state is quarantined rather than guessed', () => {
  globalThis.window.localStorage.setItem('arapal.v1.state', JSON.stringify({ version: 99, projects: {} }))
  const recovered = storage.read()
  assert.equal(recovered.version, 1)
  assert.ok(globalThis.window.localStorage.getItem('arapal.v1.state.quarantine'))
})

// ── exams ────────────────────────────────────────────────────────────────────

test('attempt answers persist and the attempt resumes rather than duplicating', () => {
  const { project } = seedProject()
  const exam = store.addExam({
    projectId: project.id,
    title: 'Checkpoint',
    scope: 'prefix-1',
    questions: [{ id: 'q1', prompt: 'One.', segmentRef: '1.1' }, { id: 'q2', prompt: 'Two.', segmentRef: '1.2' }],
  })

  const attempt = store.startAttempt({ projectId: project.id, examId: exam.id })
  store.saveAnswer({ attemptId: attempt.id, questionId: 'q1', answer: 'my answer' })

  const resumed = store.startAttempt({ projectId: project.id, examId: exam.id })
  assert.equal(resumed.id, attempt.id, 'an open attempt must resume, not restart')
  assert.equal(store.getAttempt(attempt.id).answers.q1, 'my answer')

  const persisted = storage.read()
  assert.equal(
    persisted.attempts[attempt.id].answers.q1, 'my answer',
    'the AUTOSAVE indicator must correspond to a real write',
  )
})

test('completing an attempt produces a result and closes it', () => {
  const { project } = seedProject()
  const exam = store.addExam({
    projectId: project.id, title: 'Checkpoint', scope: 'prefix-1',
    questions: [{ id: 'q1', prompt: 'One.', segmentRef: '1.1' }],
  })
  const attempt = store.startAttempt({ projectId: project.id, examId: exam.id })
  store.saveAnswer({ attemptId: attempt.id, questionId: 'q1', answer: 'A complete answer to the question.' })
  const result = store.completeAttempt({ attemptId: attempt.id })

  assert.ok(result)
  assert.equal(result.isSample, true)
  assert.ok(store.getAttempt(attempt.id).completedAt)
  assert.equal(store.findOpenAttempt(exam.id), null)
})

// ── project lifecycle ────────────────────────────────────────────────────────

test('deleting a project cascades and leaves nothing orphaned', () => {
  const { project, segments } = seedProject()
  store.saveDraft({ projectId: project.id, segmentId: segments[0].id, text: 'doomed' })
  store.deleteProject(project.id)

  const s = store.getSnapshot()
  assert.equal(Object.keys(s.projects).length, 0)
  assert.equal(Object.values(s.segments).filter((x) => x.projectId === project.id).length, 0)
  assert.equal(Object.keys(s.drafts).length, 0)
})

test('project progress identifies what to resume', () => {
  const { project, segments } = seedProject()
  store.saveDraft({ projectId: project.id, segmentId: segments[0].id, text: 'A full translation of the chunk.' })
  store.submitSegment({ projectId: project.id, segmentId: segments[0].id })

  const progress = store.getProjectProgress(project.id)
  assert.equal(progress.total, 2)
  assert.ok(progress.nextSegment, 'there is always a next action while work remains')
})

// ── first run ────────────────────────────────────────────────────────────────

test('a fresh install is genuinely empty — no auto-seeded fake project', () => {
  assert.equal(store.listProjects().length, 0, 'first run must reach the real empty state')
})

test('the sample project is opt-in and idempotent', async () => {
  const { seedSampleProject } = await import('../../src/v2/data/seed.js')
  const first = seedSampleProject()
  const second = seedSampleProject()
  assert.equal(first.id, second.id, 'seeding twice must not duplicate')
  assert.equal(store.listProjects().length, 1)
  assert.match(first.title, /sample/i, 'sample content must be identifiable as such')
})
