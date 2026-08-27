import { ArrowRight, BookOpen, ClipboardPaste, Plus, SplitSquareVertical, Sparkles } from 'lucide-react'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import PrimaryCTA from '../../foundation/primitives/PrimaryCTA'
import { colors, getScriptAwareRole, radius, spacing, surfacePadding, typography } from '../../foundation/tokens'
import layoutContract from './ProjectHomeScreen.contract'
import {
  actions, navigation, seedSampleProject, useProjects, useCurrentProject, useArapal, select,
} from '../../data'
import { setSegmentationIntent } from '../../foundation/primitives/segmentationFlowState'

/**
 * Project Home.
 *
 * Replaces a route that was an empty "V2 SCAFFOLD" placeholder while still
 * being a live destination in the navigation rail.
 *
 * Two states, both from R3 ('259:2533' returning, '259:2559' empty):
 *  - a first run has no project at all, and says so honestly rather than
 *    showing a populated-looking fixture. The audit recorded the absence of a
 *    real empty state as a missing capability across four screens.
 *  - a returning run leads with one specific next action, not a deck of equal
 *    cards, so there is never ambiguity about where to resume.
 *
 * Composition is taken from R3; every dimension is derived from tokens.
 */
export default function ProjectHomeScreen({ route, shell }) {
  const projects = useProjects()
  const currentProject = useCurrentProject()
  const progress = useArapal((s) =>
    currentProject ? select.getProjectProgress(currentProject.id, s) : null)

  // Genuinely actionable attention (Programme 2): segments in the ACTIVE project
  // whose last validated result was a fail — the real "needs another pass" set,
  // never a count derived from a presentation tone. Primitives only (a number and
  // a string id), because useArapal compares one level with Object.is and a fresh
  // object every render spins React into an update loop.
  const attentionCount = useArapal((s) => {
    if (!currentProject) return 0
    return select.listSegments(currentProject.id, s)
      .filter((seg) => select.getStudyRecord(currentProject.id, seg.id, s)?.submissionState === 'failed').length
  })
  const attentionSegmentId = useArapal((s) => {
    if (!currentProject) return null
    const seg = select.listSegments(currentProject.id, s)
      .find((seg) => select.getStudyRecord(currentProject.id, seg.id, s)?.submissionState === 'failed')
    return seg?.id ?? null
  })

  const hasWork = projects.length > 0

  // "Add source" and "New source" both start a BRAND-NEW project, so a new paste
  // can never silently overwrite an existing project's canonical identity
  // (S3-001). Re-segmenting a project is a separate, explicitly-intent action.
  const openSegmentation = () => { setSegmentationIntent('new'); shell.navigate('segmentationPasteNext') }

  const resume = (project) => {
    const next = select.getProjectProgress(project.id).nextSegment
    actions.selectProject(project.id)
    if (next) {
      navigation.resumeProject({ projectId: project.id, segmentId: next.id, segmentRef: next.ref })
      return
    }
    shell.navigate('studyWorkspace')
  }

  // Home links to Projects for browsing/managing the library rather than
  // reproducing it (Programme 2). Attention opens the exact failed segment.
  const openProjects = () => shell.navigate('projects')
  const reviewAttention = () => {
    if (!currentProject || !attentionSegmentId) return
    actions.selectProject(currentProject.id)
    navigation.resumeProject({ projectId: currentProject.id, segmentId: attentionSegmentId })
  }

  const slots = {
    Layer3_Home_Lead: (
      <div style={{ display: 'grid', gap: spacing[8], justifyItems: hasWork ? 'start' : 'center' }}>
        <span style={{ ...eyebrow }}>{hasWork ? 'Project home' : 'Welcome to Arapal'}</span>
        <h1 style={{ ...display, margin: 0, textAlign: hasWork ? 'left' : 'center' }}>
          {hasWork ? 'Pick up where you left off.' : 'Add your first source.'}
        </h1>
        <p style={{ ...lead, margin: 0, maxWidth: '54ch', textAlign: hasWork ? 'left' : 'center' }}>
          {hasWork
            ? 'One project, one segment, one clear next action.'
            : 'Paste any Arabic text. Arapal preserves it exactly, proposes study-ready segments, and takes you into the translation loop.'}
        </p>
      </div>
    ),

    Layer3_Home_Body: hasWork
      ? <ReturningState current={currentProject} progress={progress} projectCount={projects.length} attentionCount={attentionCount} onResume={resume} onNewSource={openSegmentation} onOpenProjects={openProjects} onReviewAttention={reviewAttention} />
      : <FirstRunState onAddSource={openSegmentation} onUseSample={() => { seedSampleProject(); shell.navigate('studyWorkspace') }} />,
  }

  // First run is a COMPOSITION, not a paragraph in the corner. The returning
  // state is a working list and belongs at the top of the frame; the first run
  // has one thing to say and the whole canvas to say it in, so it is centred.
  // Two arrangements of one contract, chosen by state — not two screens.
  const containerOverrides = hasWork ? {
    // A short list should be COMPOSED in the frame, not hung from its top edge.
    // With one project the meaningful content ended at 58% of a 900px viewport
    // and left 380px of nothing under it, which reads as a page that has not
    // finished loading rather than as a product with one project in it.
    //
    // `safe center` is the whole trick: it centres while the content is shorter
    // than the frame, and falls back to start the moment it is not — so a long
    // list still begins at the top and scrolls, instead of having its first rows
    // cut off above the scroll origin, which is what plain `center` would do.
    Layer2_Home_Root: {
      style: {
        gridTemplateRows: 'auto auto',
        alignContent: 'safe center',
        gap: spacing[32],
      },
    },
    Layer3_Home_Lead: { style: { gridRow: 'auto' } },
    Layer3_Home_Body: { style: { gridRow: 'auto', overflow: 'visible' } },
  } : {
    Layer2_Home_Root: {
      style: {
        // Both rows sized by content and the pair centred in the frame. The
        // contract's working arrangement is `auto minmax(0, 1fr)`, which is
        // right for a list — but here it made the lead row absorb the slack and
        // opened 250px of nothing between the invitation and its own button.
        gridTemplateRows: 'auto auto',
        alignContent: 'center',
        justifyItems: 'center',
        gap: spacing[32],
        padding: spacing[40],
        overflow: 'auto',
      },
    },
    Layer3_Home_Lead: { style: { gridRow: 'auto', width: '100%', maxWidth: '760px', alignItems: 'center' } },
    Layer3_Home_Body: { style: { gridRow: 'auto', width: '100%', overflow: 'visible', alignItems: 'center' } },
  }

  return (
    <V2ScreenFrame
      contract={layoutContract}
      route={route}
      shell={shell}
      screenSlots={slots}
      containerOverrides={containerOverrides}
    />
  )
}

// ── states ───────────────────────────────────────────────────────────────────

const firstRunJourney = [
  {
    icon: ClipboardPaste,
    title: 'Paste a source',
    text: 'Arapal keeps the original exactly as you gave it. Nothing is rewritten.',
  },
  {
    icon: SplitSquareVertical,
    title: 'Approve the segments',
    text: 'Review the proposed meaning groups before any of it becomes study material.',
  },
  {
    icon: BookOpen,
    title: 'Study and get feedback',
    text: 'Translate segment by segment, with lexicography and phrasing beside you.',
  },
]

/**
 * The first run.
 *
 * It used to be an invitation and two buttons in the top-left corner of a
 * 1,389 x 850 canvas, which reads as a screen whose content failed to load
 * rather than as a product waiting for you. The fix is not a bigger heading: it
 * is saying enough about what happens next that the first action is worth
 * taking, and composing it in the frame rather than against its corner.
 *
 * The three steps are the product's actual pipeline — Source, Review, Study —
 * the same one the segmentation flow's step bar names. That makes them
 * orientation, not decoration, and it is why there are no invented metrics or
 * dashboard cards here: a first-run screen has no data to report and should not
 * pretend otherwise.
 */
function FirstRunState({ onAddSource, onUseSample }) {
  return (
    <div style={{ display: 'grid', gap: spacing[40], justifyItems: 'center', width: '100%', maxWidth: '880px' }}>
      <div style={{ display: 'grid', gap: spacing[12], justifyItems: 'center' }}>
        <div style={{ display: 'flex', gap: spacing[12], flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          <PrimaryCTA icon={<Plus size={16} strokeWidth={1.9} />} onClick={onAddSource} minWidth={200}>
            Add source
          </PrimaryCTA>
          <button type="button" style={{ ...ghostButton }} onClick={onUseSample}>
            <Sparkles size={15} strokeWidth={1.9} />
            Explore with a sample
          </button>
        </div>
        <p style={{ ...meta, margin: 0, textAlign: 'center' }}>
          Sample content is clearly labelled and can be deleted at any time.
        </p>
      </div>

      <ol
        aria-label="How Arapal works"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: spacing[24],
          width: '100%',
          margin: 0,
          padding: `${spacing[24]} 0 0`,
          listStyle: 'none',
          borderTop: `1px solid ${colors.borderSoft}`,
        }}
      >
        {firstRunJourney.map((step, index) => (
          <li key={step.title} style={{ display: 'grid', gap: spacing[8], alignContent: 'start', minWidth: 0 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8], color: colors.accentBase }}>
              <step.icon size={16} strokeWidth={1.9} />
              <span style={{ ...typography.eyebrowLabel, color: colors.textSoft }}>Step {index + 1}</span>
            </span>
            <strong style={{ ...typography.sectionTitle, color: colors.textStrong }}>{step.title}</strong>
            <p style={{ ...typography.supportSubtext, margin: 0, color: colors.textSoft }}>{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

// Home owns RETURNING to the active project — one Continue, genuinely actionable
// attention, and new-source — and links to Projects for the library rather than
// reproducing it (Programme 2). The full project list lived here and duplicated
// Projects; that made Home and Projects read as the same screen.
function ReturningState({ current, progress, projectCount, attentionCount, onResume, onNewSource, onOpenProjects, onReviewAttention }) {
  const next = progress?.nextSegment
  const continueTitle = next ? `${next.ref} ${next.title}`.trim() : current?.title
  return (
    <div style={{ display: 'grid', gap: spacing[24], alignContent: 'start' }}>
      {current ? (
        <div style={{ ...card, display: 'grid', gap: spacing[16] }}>
          <span style={{ ...eyebrow }}>Continue</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[16], flexWrap: 'wrap' }}>
            <div style={{ display: 'grid', gap: spacing[4], minWidth: 0, flex: '1 1 320px' }}>
              <strong dir="auto" style={getCardTitleStyle(continueTitle)}>
                {continueTitle}
              </strong>
              <span dir="auto" style={{ ...meta }}>{current.title}</span>
            </div>
            <PrimaryCTA
              icon={<BookOpen size={16} strokeWidth={1.9} />}
              onClick={() => onResume(current)}
              minWidth={196}
            >
              {next ? 'Resume study' : 'Open study'}
            </PrimaryCTA>
          </div>
          {progress?.total ? (
            <div style={{ display: 'grid', gap: spacing[8] }}>
              <span style={{ ...meta }}>
                {progress.completed} of {progress.total} segments submitted
              </span>
              <ProgressBar completed={progress.completed} total={progress.total} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Actionable attention, shown only when there is something to act on —
          segments the evaluator actually failed, never an empty or invented card. */}
      {attentionCount > 0 ? (
        <button type="button" onClick={onReviewAttention} style={{ ...row }}>
          <span style={{ display: 'grid', gap: spacing[4], minWidth: 0, textAlign: 'left', flex: '1 1 auto' }}>
            <strong style={{ ...typography.sectionTitle, color: colors.textStrong, margin: 0 }}>
              {attentionCount} segment{attentionCount === 1 ? '' : 's'} need another pass
            </strong>
            <span style={{ ...meta }}>Review the segments that didn’t pass and try again.</span>
          </span>
          <ArrowRight size={16} strokeWidth={1.9} />
        </button>
      ) : null}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[16], flexWrap: 'wrap' }}>
        <button type="button" style={{ ...ghostButton }} onClick={onNewSource}>
          <Plus size={15} strokeWidth={1.9} />
          New source
        </button>
        <button type="button" style={{ ...ghostButton }} onClick={onOpenProjects}>
          Browse all projects{projectCount ? ` (${projectCount})` : ''}
          <ArrowRight size={15} strokeWidth={1.9} />
        </button>
      </div>
    </div>
  )
}

/**
 * Recency in the coarsest honest unit.
 *
 * Deliberately not "2 minutes ago": this is a study tool where the useful
 * question is whether you touched something today, this week, or long enough ago
 * to have lost the thread. Returns null rather than a guess when the timestamp is
 * missing or unparseable, so the row simply omits it.
 */
function ProgressBar({ completed, total }) {
  const pct = total ? Math.round((completed / total) * 100) : 0
  return (
    <div
      role="progressbar"
      aria-valuenow={completed}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label="Segments submitted"
      style={{ height: '6px', borderRadius: radius.pill, background: colors.accentMist, overflow: 'hidden' }}
    >
      <div style={{ width: `${pct}%`, height: '100%', background: colors.accentBase }} />
    </div>
  )
}

// ── local style objects, all derived from tokens ─────────────────────────────

// Each of these is a type ROLE plus a colour, nothing else. They used to be
// assembled from parts of two different roles — `displayTitle.fontFamily` with
// `studyPageTitle.fontSize`, `cardTitle.fontFamily` with
// `studySectionTitle.fontSize` — which is how the product's front door came to
// have the smallest heading of any screen in it.
const eyebrow = {
  ...typography.eyebrowLabel,
  color: colors.accentStrong,
}

const display = {
  ...typography.heroTitle,
  color: colors.textStrong,
}

const lead = {
  ...typography.leadText,
  color: colors.textBody,
}

const meta = {
  ...typography.metaText,
  color: colors.textSoft,
}

function getCardTitleStyle(text) {
  return {
    ...getScriptAwareRole(text, { latin: typography.cardTitle, arabic: typography.arabicCompact }),
    color: colors.textStrong,
  }
}

const card = {
  padding: `${spacing[24]}`,
  border: `1px solid ${colors.borderSoft}`,
  borderRadius: `${radius[16]}`,
  background: colors.surfacePrimary,
}

const row = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing[16],
  // A floor for the single-line case, not the padding. This row stacks a title,
  // a metadata line and a progress bar, and with `padding: 0 16px` the bar sat
  // hard on the card's bottom border while the title touched the top.
  minHeight: '56px',
  padding: surfacePadding.compactRowStacked,
  border: `1px solid ${colors.borderSoft}`,
  borderRadius: `${radius[12]}`,
  background: colors.surfacePrimary,
  color: colors.textBody,
  cursor: 'pointer',
}

const ghostButton = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[8],
  minHeight: '44px',
  padding: `0 ${spacing[16]}`,
  border: `1px solid ${colors.borderSoft}`,
  borderRadius: radius.pill,
  background: colors.surfacePrimary,
  color: colors.textBody,
  ...typography.controlLabel,
  cursor: 'pointer',
}

