/**
 * @typedef {Object} BackendSegmentationLabel
 * @property {string} label_id
 * @property {string} technical_kind
 * @property {string} display_hint
 */

/**
 * Raw backend shape. Screen components must not consume this directly.
 *
 * @typedef {Object} BackendProjectEntity
 * @property {string} project_id
 * @property {string} display_name
 * @property {string} source_title
 * @property {string} current_segment_id
 * @property {number} completed_segments
 * @property {number} total_segments
 * @property {BackendSegmentationLabel[]} segmentation_labels
 * @property {'published' | 'needs-segmentation-review' | 'source-draft'} setup_status
 * @property {number} saved_note_count
 * @property {number} saved_vocab_count
 * @property {number} suggested_review_count
 * @property {string} updated_at_label
 */

/**
 * Consumer-facing lesson state. UI components only receive this simplified
 * shape so database and segmentation terminology stay behind the mapping seam.
 *
 * @typedef {Object} Lesson
 * @property {string} id
 * @property {string} title
 * @property {string} sourceTitle
 * @property {'ready' | 'setup' | 'draft'} status
 * @property {string} statusLabel
 * @property {string} resumeLabel
 * @property {string} resumeDetail
 * @property {string} primaryRoute
 * @property {number} currentSegmentNumber
 * @property {number} completedSegments
 * @property {number} totalSegments
 * @property {number} progress
 * @property {string} progressLabel
 * @property {number} savedNoteCount
 * @property {number} savedVocabCount
 * @property {number} suggestedReviewCount
 * @property {string} updatedAt
 * @property {string[]} lessonTags
 * @property {string[]} setupChecklist
 */

/**
 * @typedef {Object} StudyHistoryEntry
 * @property {string} id
 * @property {'completed-segment' | 'saved-note' | 'vocabulary-saved' | 'phrasing-reviewed'} kind
 * @property {string} label
 * @property {string} detail
 * @property {'done' | 'needs-review'} status
 * @property {string} timestamp
 * @property {boolean} saved
 * @property {string} segmentId
 */

/** @type {BackendProjectEntity[]} */
const backendProjects = [
  {
    project_id: 'jumuah',
    display_name: "Jumu'ah Conditions",
    source_title: 'Al-Hidayah - The Book of Prayer',
    current_segment_id: '1.3',
    completed_segments: 12,
    total_segments: 47,
    segmentation_labels: [
      { label_id: 'legal-condition', technical_kind: 'semantic-segment', display_hint: 'Legal condition' },
      { label_id: 'city-validity', technical_kind: 'meaning-group', display_hint: 'City validity' },
      { label_id: 'attribution', technical_kind: 'source-attribution', display_hint: 'Attribution' },
    ],
    setup_status: 'published',
    saved_note_count: 1,
    saved_vocab_count: 8,
    suggested_review_count: 2,
    updated_at_label: '2h ago',
  },
  {
    project_id: 'purity',
    display_name: 'Purity Terminology',
    source_title: 'Mukhtasar al-Quduri - Purification',
    current_segment_id: 'setup',
    completed_segments: 4,
    total_segments: 19,
    segmentation_labels: [
      { label_id: 'water-types', technical_kind: 'semantic-segment', display_hint: 'Water types' },
      { label_id: 'ritual-state', technical_kind: 'meaning-group', display_hint: 'Ritual state' },
      { label_id: 'labels-pending', technical_kind: 'qa-flag', display_hint: 'Labels pending' },
    ],
    setup_status: 'needs-segmentation-review',
    saved_note_count: 0,
    saved_vocab_count: 3,
    suggested_review_count: 3,
    updated_at_label: 'Yesterday',
  },
  {
    project_id: 'fasting',
    display_name: 'Fasting Openings',
    source_title: 'Book of Fasting - Opening intentions',
    current_segment_id: '3.1',
    completed_segments: 9,
    total_segments: 24,
    segmentation_labels: [
      { label_id: 'attribution', technical_kind: 'source-attribution', display_hint: 'Attribution' },
      { label_id: 'intention', technical_kind: 'meaning-group', display_hint: 'Intention' },
      { label_id: 'timing', technical_kind: 'semantic-segment', display_hint: 'Timing' },
    ],
    setup_status: 'published',
    saved_note_count: 2,
    saved_vocab_count: 5,
    suggested_review_count: 1,
    updated_at_label: '3d ago',
  },
]

const historyKinds = [
  'completed-segment',
  'saved-note',
  'vocabulary-saved',
  'phrasing-reviewed',
]

const historyKindLabels = {
  'completed-segment': 'Completed segment',
  'saved-note': 'Saved note',
  'vocabulary-saved': 'Vocabulary saved',
  'phrasing-reviewed': 'Phrasing reviewed',
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function getCurrentSegmentNumber(segmentId) {
  const parsed = Number.parseFloat(segmentId)
  return Number.isFinite(parsed) ? parsed : 1
}

function getSetupChecklist(status) {
  if (status === 'published') {
    return ['Source preserved', 'Segments published', 'Study workspace ready']
  }

  if (status === 'needs-segmentation-review') {
    return ['Source preserved', 'Segmentation needs review', 'Study locked until approval']
  }

  return ['Source draft saved', 'Segmentation not started', 'Study locked']
}

/**
 * @param {BackendProjectEntity} entity
 * @returns {Lesson}
 */
export function mapProjectEntityToLesson(entity) {
  const isPublished = entity.setup_status === 'published'
  const isSetupReview = entity.setup_status === 'needs-segmentation-review'
  const progress = Math.round((entity.completed_segments / entity.total_segments) * 100)

  return {
    id: entity.project_id,
    title: entity.display_name,
    sourceTitle: entity.source_title,
    status: isPublished ? 'ready' : isSetupReview ? 'setup' : 'draft',
    statusLabel: isPublished ? 'Ready to study' : isSetupReview ? 'Setup needs review' : 'Draft source',
    resumeLabel: isPublished ? `Resume segment ${entity.current_segment_id}` : 'Finish setup',
    resumeDetail: isPublished
      ? 'Continue the simple study loop: read the source, write your translation, submit, then review support.'
      : 'Review the proposed structure once, then AraPal will turn this into a normal study session.',
    primaryRoute: isPublished ? 'studyWorkspace' : 'segmentationReview',
    currentSegmentNumber: getCurrentSegmentNumber(entity.current_segment_id),
    completedSegments: entity.completed_segments,
    totalSegments: entity.total_segments,
    progress,
    progressLabel: `${entity.completed_segments} of ${entity.total_segments} segments`,
    savedNoteCount: entity.saved_note_count,
    savedVocabCount: entity.saved_vocab_count,
    suggestedReviewCount: entity.suggested_review_count,
    updatedAt: entity.updated_at_label,
    lessonTags: entity.segmentation_labels.map((label) => label.display_hint),
    setupChecklist: getSetupChecklist(entity.setup_status),
  }
}

export async function fetchLessons() {
  await delay(120)
  return backendProjects.map(mapProjectEntityToLesson)
}

/**
 * This simulates a large server-backed history dataset. The dashboard panel
 * fetches it only on prefetch/open and renders it through windowing.
 *
 * @param {string} lessonId
 * @returns {Promise<StudyHistoryEntry[]>}
 */
export async function fetchStudyHistory(lessonId) {
  await delay(180)
  const project = backendProjects.find((item) => item.project_id === lessonId) ?? backendProjects[0]

  return Array.from({ length: 1800 }, (_, index) => {
    const itemNumber = index + 1
    const kind = historyKinds[index % historyKinds.length]
    const segmentId = ((index % project.total_segments) + 1).toString()

    return {
      id: `${project.project_id}-history-${itemNumber}`,
      kind,
      label: kind === 'vocabulary-saved' ? 'misr jami' : `${historyKindLabels[kind]} ${segmentId}`,
      detail:
        kind === 'saved-note'
          ? 'Discussion summary saved for later review.'
          : kind === 'vocabulary-saved'
            ? 'Term saved with source context.'
            : kind === 'phrasing-reviewed'
              ? 'A phrasing card was reviewed against the source.'
              : 'Study state updated cleanly.',
      status: index % 11 === 0 ? 'needs-review' : 'done',
      timestamp: itemNumber < 7 ? `${itemNumber}h ago` : `${Math.ceil(itemNumber / 24)}d ago`,
      saved: kind === 'saved-note' || kind === 'vocabulary-saved',
      segmentId,
    }
  })
}
