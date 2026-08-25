/**
 * Exams — the model.
 *
 * Lifted verbatim from the legacy screen (src/screens/ExamsScreen.jsx) so the
 * V2 screen is a re-presentation of working behaviour rather than a rewrite of
 * it: the same scope pool, the same seeds, the same attempt persistence and the
 * same grading. Only the presentation was the problem.
 */
const studyScopePool = [
  {
    id: '1.1',
    tracker: 1,
    prefix: '1',
    label: '1.1 Types of Water',
    concept: 'Purity foundations',
    source: 'Classify the kinds of water that retain ritual purity and explain the condition that causes them to lose it.',
    reviewNote: 'The answer tended to collapse the legal distinction between pure, purifying, and merely clean.',
  },
  {
    id: '1.2',
    tracker: 2,
    prefix: '1',
    label: '1.2 Ablution (Wudu)',
    concept: 'Preparation before prayer',
    source: 'Describe the sequence of ablution and the intention that gives the act devotional coherence.',
    reviewNote: 'Misses usually happen around order, intention, and the difference between pillars and sunnah acts.',
  },
  {
    id: '1.3',
    tracker: 3,
    prefix: '1',
    label: '1.3 Ghusl',
    concept: 'Major purification',
    source: 'Explain when ghusl becomes necessary and how completeness differs from bare validity.',
    reviewNote: 'This segment often needs remediation because students conflate the triggers with the method.',
  },
  {
    id: '1.4',
    tracker: 4,
    prefix: '1',
    label: '1.4 Tayammum',
    concept: 'Substitute purification',
    source: 'State when dry ablution replaces water and what conditions restore the obligation to use water again.',
    reviewNote: 'The common weakness is forgetting the conditions that invalidate the substitute.',
  },
  {
    id: '2.1',
    tracker: 5,
    prefix: '2',
    label: '2.1 Times of Prayer',
    concept: 'Prayer timings',
    source: 'Summarise the opening and closing windows of the daily prayers and how certainty is established.',
    reviewNote: 'Students can miss the relationship between observation, certainty, and beginning windows.',
  },
  {
    id: '2.2',
    tracker: 6,
    prefix: '2',
    label: '2.2 Conditions',
    concept: 'Prayer conditions',
    source: 'List the preconditions for valid prayer and explain why each is treated as a gateway rather than an internal act.',
    reviewNote: 'This is a high-value remediation segment because several conditions are easy to merge together.',
  },
  {
    id: '2.3',
    tracker: 7,
    prefix: '2',
    label: "2.3 Jumu'ah",
    concept: 'Congregational practice',
    source: 'Outline what distinguishes Jumu’ah from the normal midday prayer in obligation, attendance, and khutbah structure.',
    reviewNote: 'Confusion often appears around attendance obligation and the role of the khutbah.',
  },
  {
    id: '3.1',
    tracker: 8,
    prefix: '3',
    label: '3.1 Opening Intentions',
    concept: 'Fasting intentions',
    source: 'Explain the role of intention at the opening of the fast and why delayed intention changes the legal frame.',
    reviewNote: 'Learners often blur intention timing with the later invalidators of the fast.',
  },
];

const initialExamSeeds = [
  {
    id: 'exam-1',
    title: 'Prayer foundations checkpoint',
    createdAt: 'Today',
    scopeLabel: 'Prefix 2',
    status: 'ready',
    questionIds: ['2.1', '2.2', '2.3'],
    lastScore: null,
  },
  {
    id: 'exam-2',
    title: 'Purity recall sprint',
    createdAt: 'Yesterday',
    scopeLabel: 'Trackers 1–4',
    // No fabricated score: this seed has never been attempted, so it is 'ready'
    // and unscored rather than showing an invented 82% (R-016).
    status: 'ready',
    questionIds: ['1.1', '1.2', '1.3', '1.4'],
    lastScore: null,
  },
];

function buildQuestions(questionIds) {
  return questionIds
    .map((id) => studyScopePool.find((item) => item.id === id))
    .filter(Boolean)
    .map((item, index) => ({
      ...item,
      number: index + 1,
    }));
}

function createExamRecord({ id, title, scopeLabel, questionIds, createdAt = 'Just now', status = 'ready', lastScore = null }) {
  return {
    // An id must survive a reload. These were regenerated on every load, so a
    // persisted attempt pointed at an exam that no longer existed and could
    // never be resumed. Seeded exams get a stable id from their title; only
    // genuinely new exams get a random one.
    id: id ?? `exam-${slugifyExamTitle(title)}`,
    title,
    createdAt,
    scopeLabel,
    status,
    lastScore,
    questions: buildQuestions(questionIds),
  };
}

/** Stable, readable id derived from the title. */
function slugifyExamTitle(title) {
  return String(title ?? 'exam')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'exam';
}

function hydrateInitialExams() {
  return initialExamSeeds.map((seed) => createExamRecord(seed));
}

function filterScopeItems(scopeMode, prefixValue, rangeStart, rangeEnd) {
  if (scopeMode === 'prefix') {
    const cleanPrefix = prefixValue.trim();
    if (!cleanPrefix) {
      return [];
    }

    return studyScopePool.filter((item) => item.id.startsWith(cleanPrefix));
  }

  const start = Math.min(rangeStart, rangeEnd);
  const end = Math.max(rangeStart, rangeEnd);
  return studyScopePool.filter((item) => item.tracker >= start && item.tracker <= end);
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
// persists too, so a saved assessment and its attempt survive reload.
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

function evaluateAttempt(exam, answers) {
  const gradedQuestions = exam.questions.map((question, index) => {
    const answer = answers[question.id] ?? '';
    const trimmed = answer.trim();
    let outcome = 'pass';

    if (!trimmed || trimmed.length < 40) {
      outcome = 'miss';
    } else if (index === 2 || index === 5) {
      outcome = 'miss';
    } else if (trimmed.length < 85 || index === 1) {
      outcome = 'review';
    }

    return {
      ...question,
      answer,
      outcome,
      segmentLabel: question.label,
      conceptLabel: question.concept,
      remediationNote: question.reviewNote,
    };
  });

  const passCount = gradedQuestions.filter((question) => question.outcome === 'pass').length;
  const reviewCount = gradedQuestions.filter((question) => question.outcome === 'review').length;
  const missCount = gradedQuestions.filter((question) => question.outcome === 'miss').length;
  const score = Math.round(((passCount + reviewCount * 0.5) / gradedQuestions.length) * 100);

  return {
    score,
    passCount,
    reviewCount,
    missCount,
    questions: gradedQuestions,
  };
}


export const EXAM_CONTEXT_STORAGE_KEY = 'design-sandbox.exam-context.v1'

export {
  studyScopePool,
  initialExamSeeds,
  buildQuestions,
  createExamRecord,
  slugifyExamTitle,
  hydrateInitialExams,
  filterScopeItems,
  readPersistedAttempt,
  writePersistedAttempt,
  readPersistedExams,
  writePersistedExams,
  evaluateAttempt,
}
