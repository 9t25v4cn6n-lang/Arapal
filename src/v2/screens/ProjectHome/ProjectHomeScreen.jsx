import { ArrowRight, BookOpen, Plus, Sparkles } from 'lucide-react'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import PrimaryCTA from '../../foundation/primitives/PrimaryCTA'
import { colors, radius, spacing, typography } from '../../foundation/tokens'
import layoutContract from './ProjectHomeScreen.contract'
import {
  actions, navigation, seedSampleProject, useProjects, useCurrentProject, useArapal, select,
} from '../../data'

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
  // Completed count per project, so the list can say which one needs attention.
  // Only the current project's progress was read, which left every other row
  // showing a bare title and a segment count — a list you cannot triage from.
  //
  // NUMBERS, not progress objects. useArapal compares one level with Object.is,
  // so a map of freshly-derived objects is a new value on every call: getSnapshot
  // never looks cached and React spins into "Maximum update depth exceeded". The
  // hook's own docstring warns about exactly this and I walked into it anyway.
  // The total needs no selector at all — it is project.segmentIds.length.
  const completedByProject = useArapal((s) => {
    const out = {}
    for (const project of projects) out[project.id] = select.getProjectProgress(project.id, s).completed
    return out
  })
  const progress = useArapal((s) =>
    currentProject ? select.getProjectProgress(currentProject.id, s) : null)

  const hasWork = projects.length > 0

  const openSegmentation = () => shell.navigate('segmentationPasteNext')

  const resume = (project) => {
    const next = select.getProjectProgress(project.id).nextSegment
    actions.selectProject(project.id)
    if (next) {
      navigation.resumeProject({ projectId: project.id, segmentId: next.id, segmentRef: next.ref })
      return
    }
    shell.navigate('studyWorkspace')
  }

  const slots = {
    Layer3_Home_Lead: (
      <div style={{ display: 'grid', gap: spacing[8] }}>
        <span style={{ ...eyebrow }}>{hasWork ? 'Project home' : 'Welcome'}</span>
        <h1 style={{ ...display, margin: 0 }}>
          {hasWork ? 'Pick up where you left off.' : 'Add your first source.'}
        </h1>
        <p style={{ ...lead, margin: 0, maxWidth: '58ch' }}>
          {hasWork
            ? 'One project, one segment, one clear next action.'
            : 'Paste a text and Arapal will turn it into study-ready segments. Nothing is here yet — that is expected.'}
        </p>
      </div>
    ),

    Layer3_Home_Body: hasWork
      ? <ReturningState projects={projects} current={currentProject} progress={progress} completedByProject={completedByProject} onResume={resume} onNewSource={openSegmentation} />
      : <EmptyState onAddSource={openSegmentation} onUseSample={() => { seedSampleProject(); shell.navigate('studyWorkspace') }} />,
  }

  return <V2ScreenFrame contract={layoutContract} route={route} shell={shell} screenSlots={slots} />
}

// ── states ───────────────────────────────────────────────────────────────────

/**
 * The empty state states the invitation once.
 *
 * It used to wrap a card around a SECOND title and lead — "Start from a source /
 * Paste any Arabic text…" directly beneath the page's own "Add your first source.
 * / Paste a text and Arapal will turn it into study-ready segments." The same
 * thing said twice, ten pixels apart, on the screen whose own subtitle is "your
 * work and one clear next action".
 *
 * R3 states it once on the backdrop with a single action and no card, and that is
 * the better decision. The card and the duplicate copy are gone. The sample route
 * stays, because it is a real capability a first-time user wants and R3 simply
 * does not offer it — but it reads as secondary, and its caveat sits with it
 * rather than orphaned below a card.
 */
function EmptyState({ onAddSource, onUseSample }) {
  return (
    <div style={{ display: 'grid', gap: spacing[16], justifyItems: 'start', maxWidth: '640px' }}>
      <div style={{ display: 'flex', gap: spacing[12], flexWrap: 'wrap', alignItems: 'center' }}>
        <PrimaryCTA icon={<Plus size={16} strokeWidth={1.9} />} onClick={onAddSource} minWidth={168}>
          Add source
        </PrimaryCTA>
        <button type="button" style={{ ...ghostButton }} onClick={onUseSample}>
          <Sparkles size={15} strokeWidth={1.9} />
          Explore with a sample
        </button>
      </div>
      <p style={{ ...meta, margin: 0 }}>
        Sample content is clearly labelled and can be deleted at any time.
      </p>
    </div>
  )
}

function ReturningState({ projects, current, progress, completedByProject, onResume, onNewSource }) {
  const next = progress?.nextSegment
  return (
    <div style={{ display: 'grid', gap: spacing[24], alignContent: 'start' }}>
      {current ? (
        <div style={{ ...card, display: 'grid', gap: spacing[16] }}>
          <span style={{ ...eyebrow }}>Continue</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[16], flexWrap: 'wrap' }}>
            <div style={{ display: 'grid', gap: spacing[4], minWidth: 0, flex: '1 1 320px' }}>
              <strong style={{ ...cardTitle }}>
                {next ? `${next.ref} ${next.title}`.trim() : current.title}
              </strong>
              <span style={{ ...meta }}>{current.title}</span>
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

      <div style={{ display: 'grid', gap: spacing[12] }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[16] }}>
          <span style={{ ...eyebrow }}>Your projects</span>
          <button type="button" style={{ ...ghostButton }} onClick={onNewSource}>
            <Plus size={15} strokeWidth={1.9} />
            New source
          </button>
        </div>
        <div style={{ display: 'grid', gap: spacing[8] }}>
          {projects.map((project) => {
            const total = project.segmentIds.length
            const completed = completedByProject?.[project.id] ?? 0

            return (
              <button
                key={project.id}
                type="button"
                onClick={() => onResume(project)}
                style={{ ...row }}
              >
                <span style={{ display: 'grid', gap: spacing[8], minWidth: 0, textAlign: 'left', flex: '1 1 auto' }}>
                  <strong style={{ ...rowTitle }}>{project.title}</strong>
                  {/* What the row is for: telling projects apart. It used to read
                      "N segments", which is the one fact that does not help you
                      choose — every project has some. Progress and recency are
                      what say which one is waiting for you. */}
                  <span style={{ ...meta }}>
                    {completed} of {total} studied
                    {formatLastActive(project.updatedAt) ? ` · ${formatLastActive(project.updatedAt)}` : ''}
                  </span>
                  {total ? <ProgressBar completed={completed} total={total} /> : null}
                </span>
                <ArrowRight size={16} strokeWidth={1.9} />
              </button>
            )
          })}
        </div>
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
function formatLastActive(iso) {
  if (!iso) return null
  const then = Date.parse(iso)
  if (Number.isNaN(then)) return null
  const days = Math.floor((Date.now() - then) / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 28) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 28)}mo ago`
}

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

const eyebrow = {
  fontFamily: typography.eyebrowLabel.fontFamily,
  fontSize: typography.eyebrowLabel.fontSize,
  letterSpacing: typography.eyebrowLabel.letterSpacing,
  textTransform: 'uppercase',
  fontWeight: 700,
  color: colors.accentStrong,
}

const display = {
  fontFamily: typography.displayTitle.fontFamily,
  fontSize: typography.studyPageTitle.fontSize,
  lineHeight: 1.1,
  color: colors.textStrong,
}

const lead = {
  fontFamily: typography.bodyText.fontFamily,
  fontSize: typography.supportSubtext.fontSize,
  lineHeight: 1.55,
  color: colors.textBody,
}

const meta = {
  fontFamily: typography.bodyText.fontFamily,
  fontSize: typography.bodyText.fontSize,
  color: colors.textSoft,
}

const cardTitle = {
  fontFamily: typography.cardTitle.fontFamily,
  fontSize: typography.studySectionTitle?.fontSize ?? typography.cardTitle.fontSize,
  color: colors.textStrong,
}

const rowTitle = {
  fontFamily: typography.bodyText.fontFamily,
  fontSize: typography.supportSubtext.fontSize,
  fontWeight: 600,
  color: colors.textStrong,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
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
  minHeight: '56px',
  padding: `0 ${spacing[16]}`,
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
  fontFamily: typography.bodyText.fontFamily,
  fontSize: typography.bodyText.fontSize,
  fontWeight: 600,
  cursor: 'pointer',
}

