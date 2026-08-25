/**
 * Exams — the model.
 *
 * Question content is not defined here. An exam covers the open project's own
 * canonical segments (see liveExamScope.js); this module keeps only the
 * persistence, identity, and scope-filtering mechanics, which all operate on a
 * pool the screen supplies. The previous fixed `studyScopePool` — eight items
 * with no relationship to any real project, plus two seeded exams that
 * referenced segments no project contained — was the R-017 defect and is gone.
 * Grading is likewise not here: the screen grades through the real AI contract
 * (`gradeExam`), never a length/answer-index heuristic.
 */

function buildQuestions(questionIds, pool) {
  if (!Array.isArray(pool)) return [];
  return questionIds
    .map((id) => pool.find((item) => item.id === id))
    .filter(Boolean)
    .map((item, index) => ({
      ...item,
      number: index + 1,
    }));
}

/** Stable, readable id derived from the title. */
function slugifyExamTitle(title) {
  return String(title ?? 'exam')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'exam';
}

function createExamRecord({
  id,
  title,
  scopeLabel,
  questionIds,
  pool,
  projectId = null,
  createdAt = 'Just now',
  status = 'ready',
  lastScore = null,
}) {
  return {
    // An id must survive a reload. Genuinely new exams get a slug from their
    // title plus the caller's uniqueness suffix; a persisted attempt then still
    // resolves to a real exam.
    id: id ?? `exam-${slugifyExamTitle(title)}`,
    // Which project this assessment belongs to. The library shows only the
    // current project's exams, so an assessment built over one project's
    // segments never appears while a different project is open (R-017).
    projectId,
    title,
    createdAt,
    scopeLabel,
    status,
    lastScore,
    questions: buildQuestions(questionIds, pool),
  };
}

function filterScopeItems(scopeMode, prefixValue, rangeStart, rangeEnd, pool) {
  if (!Array.isArray(pool) || !pool.length) {
    return [];
  }

  if (scopeMode === 'prefix') {
    const cleanPrefix = prefixValue.trim();
    if (!cleanPrefix) {
      return [];
    }

    return pool.filter((item) => item.id.startsWith(cleanPrefix));
  }

  const start = Math.min(rangeStart, rangeEnd);
  const end = Math.max(rangeStart, rangeEnd);
  return pool.filter((item) => item.tracker >= start && item.tracker <= end);
}

// The attempt was previously "autosaved" by a setTimeout that flipped a label
// from Saving to Saved and wrote nothing, so a reload lost the whole attempt
// while the UI claimed it was safe. This persists it for real; the indicator
// now reports the outcome of an actual write.
const ATTEMPT_STORAGE_KEY = 'design-sandbox.exam-attempt.v1';

function readPersistedAttempt() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(ATTEMPT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** @returns {boolean} whether the write actually landed. */
function writePersistedAttempt(attempt) {
  if (typeof window === 'undefined') return false;
  try {
    if (!attempt) {
      window.localStorage.removeItem(ATTEMPT_STORAGE_KEY);
      return true;
    }
    window.localStorage.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify(attempt));
    return true;
  } catch {
    return false;
  }
}

// A created assessment lived only in React state, so a reload dropped it and any
// autosaved attempt pointing at it reopened blank (R-017). The exam list now
// persists too, so a saved assessment and its attempt survive reload. Records
// carry a projectId; the screen filters to the open project.
const EXAMS_STORAGE_KEY = 'design-sandbox.exams.v1';

function readPersistedExams() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(EXAMS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writePersistedExams(exams) {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(exams));
    return true;
  } catch {
    return false;
  }
}

export const EXAM_CONTEXT_STORAGE_KEY = 'design-sandbox.exam-context.v1'

export {
  buildQuestions,
  createExamRecord,
  slugifyExamTitle,
  filterScopeItems,
  readPersistedAttempt,
  writePersistedAttempt,
  readPersistedExams,
  writePersistedExams,
};
