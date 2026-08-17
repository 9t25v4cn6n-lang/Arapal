import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  FileText,
  Layers3,
  PenTool,
  RotateCcw,
} from 'lucide-react'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import { colors, motion, radius, spacing, typography } from '../../foundation/tokens'
import layoutContract from './ProjectResearchScreen.contract'
import {
  KnowledgeLedger,
  LensSpine,
  ResearchSearchCommand,
  SourceReaderPanel,
} from './ProjectResearchPrimitives'
import {
  getFilteredSegments,
  getFilterCount,
  getResearchStats,
  getRevisionQueue,
  projectSummary,
  quickRefinements,
  researchSegments,
} from './projectResearchData'

const researchFilters = [
  { id: 'all', label: 'All knowledge', shortLabel: 'All', icon: Layers3 },
  { id: 'segments', label: 'Segments', shortLabel: 'Segments', icon: FileText },
  { id: 'vocabulary', label: 'Vocabulary', shortLabel: 'Vocabulary', icon: BookOpen },
  { id: 'mistakes', label: 'Mistakes', shortLabel: 'Mistakes', icon: CircleAlert },
  { id: 'notes', label: 'Notes', shortLabel: 'Notes', icon: PenTool },
  { id: 'weak', label: 'Weak areas', shortLabel: 'Weak', icon: RotateCcw },
  { id: 'completed', label: 'Completed', shortLabel: 'Completed', icon: CheckCircle2 },
]

const companionCitations = ['1.3', '2.3']

function ProjectResearchHeader({ stats, onOpenStudy }) {
  const metrics = [
    { value: stats.totalSegments, label: 'segments' },
    { value: stats.vocabularyNotes, label: 'vocab notes' },
    { value: stats.needsAttention, label: 'review points' },
  ]

  return (
    <header className="project-research__masthead" data-debug-item="project_research_header">
      <div className="project-research__titleGroup">
        <p className="project-research__eyebrow">{projectSummary.subtitle}</p>
        <h1 className="project-research__title">{projectSummary.title} knowledge explorer</h1>
        <p className="project-research__lead">
          <span>{projectSummary.projectMeta}</span> · Search saved source, translations, feedback, notes, and recurring terms.
        </p>
      </div>

      <div className="project-research__headerAside" aria-label="Project research summary">
        <div className="project-research__metricStrip">
          {metrics.map((metric) => (
            <div key={metric.label} className="project-research__metricPill">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
        <button type="button" className="project-research__studyLink" onClick={onOpenStudy}>
          <BookOpen size={15} strokeWidth={2} />
          Study mode
          <ArrowRight size={15} strokeWidth={2.2} />
        </button>
      </div>
    </header>
  )
}

function ResearchDesk({
  query,
  activeFilter,
  activeQuick,
  rows,
  selectedSegmentId,
  selectedSegment,
  rightMode,
  onQueryChange,
  onQuickSelect,
  onSelectSegment,
  onModeChange,
  onOpenStudy,
  onClearSelection,
}) {
  const activeFilterLabel = researchFilters.find((filter) => filter.id === activeFilter)?.label ?? 'All knowledge'

  return (
    <main className="project-research project-research__desk" data-debug-item="project_research_desk">
      <ResearchSearchCommand
        query={query}
        resultCount={rows.length}
        activeFilterLabel={activeFilterLabel}
        quickRefinements={quickRefinements}
        activeQuick={activeQuick}
        onQueryChange={onQueryChange}
        onQuickSelect={onQuickSelect}
      />

      <div className={`project-research__deskBody${selectedSegment ? '' : ' is-browse'}`}>
        <KnowledgeLedger
          rows={rows}
          selectedSegmentId={selectedSegmentId}
          onSelectSegment={onSelectSegment}
        />

        {selectedSegment ? <SourceReaderPanel
          mode={rightMode}
          selectedSegment={selectedSegment}
          citations={companionCitations}
          onModeChange={onModeChange}
          onSelectSegment={onSelectSegment}
          onOpenStudy={onOpenStudy}
          onClearSelection={onClearSelection}
        /> : null}
      </div>
    </main>
  )
}

export default function ProjectResearchScreen({ route, shell }) {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeQuick, setActiveQuick] = useState(null)
  // Browse is the entry state. Pre-selecting the first row meant the inspector
  // was always open, so the screen never showed the wide ledger it was designed
  // around and a user arrived already committed to a segment they had not
  // chosen.
  const [selectedSegmentId, setSelectedSegmentId] = useState(null)
  const [rightMode, setRightMode] = useState('source')

  const stats = useMemo(() => getResearchStats(researchSegments), [])
  const revisionEntries = useMemo(() => getRevisionQueue(researchSegments), [])
  const rows = useMemo(
    () => getFilteredSegments({ query, filterId: activeFilter, quickId: activeQuick }, researchSegments),
    [activeFilter, activeQuick, query],
  )
  const selectedSegment = useMemo(
    () => researchSegments.find((segment) => segment.id === selectedSegmentId) ?? null,
    [selectedSegmentId],
  )

  const selectSegment = (segmentId) => {
    setSelectedSegmentId(segmentId)
    setRightMode('source')
  }

  const openStudyMode = () => {
    shell.navigate('studyWorkspace')
  }

  const updateFilter = (filterId) => {
    setActiveFilter(filterId)
    setActiveQuick(null)
  }

  const handleRevisionSelect = ({ filter, query: nextQuery }) => {
    setActiveFilter(filter)
    setActiveQuick(null)
    setQuery(nextQuery)
  }

  const screenSlots = {
    Layer3_ProjectResearch_Header: (
      <ProjectResearchHeader stats={stats} onOpenStudy={openStudyMode} />
    ),
    Layer4_ProjectResearch_FilterRail: (
      <LensSpine
        filters={researchFilters}
        activeFilter={activeFilter}
        getFilterCount={(filterId) => getFilterCount(filterId, researchSegments)}
        revisionEntries={revisionEntries}
        onFilterChange={updateFilter}
        onRevisionSelect={handleRevisionSelect}
      />
    ),
    Layer4_ProjectResearch_ResultSurface: (
      <ResearchDesk
        query={query}
        activeFilter={activeFilter}
        activeQuick={activeQuick}
        rows={rows}
        selectedSegmentId={selectedSegmentId}
        selectedSegment={selectedSegment}
        rightMode={rightMode}
        onQueryChange={setQuery}
        onQuickSelect={setActiveQuick}
        onSelectSegment={selectSegment}
        onModeChange={setRightMode}
        onOpenStudy={openStudyMode}
        onClearSelection={() => setSelectedSegmentId(null)}
      />
    ),
  }

  const containerOverrides = {
    Layer2_ProjectResearch_Root: {
      style: {
        width: '100%',
        maxWidth: '1800px',
        justifySelf: 'center',
        padding: `clamp(${spacing[12]}, 1.35vw, ${spacing[20]})`,
      },
    },
  }

  return (
    <>
      <style>{researchStyles}</style>
      <V2ScreenFrame
        contract={layoutContract}
        route={route}
        shell={shell}
        screenSlots={screenSlots}
        containerOverrides={containerOverrides}
      />
    </>
  )
}

const researchStyles = `
  .project-research,
  .project-research * {
    box-sizing: border-box;
  }

  .project-research {
    width: 100%;
    min-width: 0;
    color: ${colors.textStrong};
    font-family: ${typography.studyBody.fontFamily};
  }

  .project-research button,
  .project-research input,
  .project-research textarea {
    font: inherit;
  }

  .project-research button:focus-visible,
  .project-research input:focus-visible,
  .project-research textarea:focus-visible {
    outline: 2px solid ${colors.accentBase};
    outline-offset: 2px;
  }

  .project-research__masthead {
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(360px, auto);
    align-items: center;
    gap: ${spacing[16]};
    padding: ${spacing[12]} ${spacing[20]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[24]};
    background:
      radial-gradient(circle at 72% 0%, rgba(147, 197, 253, 0.18), transparent 34%),
      linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(248, 251, 255, 0.86));
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
  }

  .project-research__titleGroup {
    min-width: 0;
    display: grid;
    gap: ${spacing[4]};
  }

  .project-research__eyebrow,
  .project-research__blockLabel {
    margin: 0;
    font-family: ${typography.eyebrowLabel.fontFamily};
    font-size: ${typography.eyebrowLabel.fontSize};
    line-height: ${typography.eyebrowLabel.lineHeight};
    letter-spacing: ${typography.eyebrowLabel.letterSpacing};
    text-transform: ${typography.eyebrowLabel.textTransform};
    font-weight: 900;
    color: ${colors.accentStrong};
  }

  .project-research__title {
    margin: 0;
    font-family: ${typography.displayTitle.fontFamily};
    font-size: 34px;
    line-height: 1;
    letter-spacing: 0;
    color: ${colors.textStrong};
  }

  .project-research__lead,
  .project-research__actionHint,
  .project-research__dossierMeta,
  .project-research__sourceMeta {
    margin: 0;
    color: ${colors.textSoft};
    font-family: ${typography.studySupportText.fontFamily};
  }

  .project-research__lead {
    max-width: 760px;
    font-size: 13px;
    line-height: 1.52;
  }

  .project-research__lead span {
    color: ${colors.textBody};
    font-weight: 760;
  }

  .project-research__headerAside {
    min-width: 0;
    display: grid;
    justify-items: end;
    gap: ${spacing[8]};
  }

  .project-research__metricStrip {
    min-width: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(88px, 1fr));
    gap: ${spacing[8]};
  }

  .project-research__metricPill {
    min-height: 52px;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: ${spacing[4]};
    padding: ${spacing[8]} ${spacing[12]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[24]};
    background: rgba(255, 255, 255, 0.74);
  }

  .project-research__metricPill strong {
    font-family: ${typography.studySectionTitle.fontFamily};
    font-size: 18px;
    line-height: 1;
    color: ${colors.textStrong};
  }

  .project-research__metricPill span,
  .project-research__actionHint {
    font-size: 11px;
    line-height: 1.35;
  }

  .project-research__studyLink {
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing[8]};
    padding: 0 ${spacing[16]};
    border: 1px solid ${colors.lineStrong};
    border-radius: ${radius.pill};
    background: rgba(255, 255, 255, 0.88);
    color: ${colors.accentStrong};
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.09);
    font-family: ${typography.ctaLabel.fontFamily};
    font-size: 12px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      border-color ${motion.micro},
      box-shadow ${motion.micro},
      background ${motion.micro};
  }

  .project-research__studyLink:hover {
    border-color: ${colors.accentSoft};
    box-shadow: 0 16px 34px rgba(37, 99, 235, 0.14);
    background: ${colors.accentWash};
  }

  .project-research__panel,
  .project-research__searchPanel,
  .project-research__tablePanel {
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[24]};
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.045);
  }

  .project-research__filterRail,
  .project-research__resultsPanel,
  .project-research__rightWorkspace {
    height: 100%;
    min-height: 0;
  }

  .project-research__filterRail {
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    gap: ${spacing[12]};
    overflow: hidden;
  }

  .project-research__railPanel,
  .project-research__revisionPanel,
  .project-research__rightPanel {
    min-height: 0;
    overflow: hidden;
  }

  .project-research__railPanel {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
  }

  .project-research__revisionPanel {
    display: grid;
    gap: ${spacing[8]};
    padding: ${spacing[12]};
    background: rgba(255, 255, 255, 0.82);
  }

  .project-research__panelHeader {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${spacing[12]};
    padding: ${spacing[16]};
    border-bottom: 1px solid ${colors.lineSoft};
  }

  .project-research__panelTitle,
  .project-research__searchCopy h2,
  .project-research__rightHeader h2,
  .project-research__emptyInspector h2 {
    margin: 0;
    font-family: ${typography.studySectionTitle.fontFamily};
    font-size: 15px;
    line-height: 1.25;
    font-weight: 850;
    color: ${colors.textStrong};
  }

  .project-research__filterList {
    min-height: 0;
    overflow: auto;
    display: grid;
    align-content: start;
    gap: ${spacing[4]};
    padding: ${spacing[12]};
  }

  .project-research__filterButton,
  .project-research__revisionButton {
    width: 100%;
    border: 1px solid transparent;
    background: rgba(248, 251, 255, 0.68);
    color: ${colors.textBody};
    cursor: pointer;
    transition:
      border-color ${motion.micro},
      background ${motion.micro},
      color ${motion.micro},
      box-shadow ${motion.micro};
  }

  .project-research__filterButton {
    min-height: 42px;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: ${spacing[8]};
    padding: ${spacing[8]} ${spacing[12]};
    border-radius: ${radius[16]};
    text-align: left;
    font-family: ${typography.studyControlLabel.fontFamily};
    font-size: 12px;
    line-height: 1;
    font-weight: 800;
  }

  .project-research__filterButton:hover,
  .project-research__filterButton.is-active,
  .project-research__revisionButton:hover {
    border-color: ${colors.lineStrong};
    background: ${colors.accentWash};
    color: ${colors.accentStrong};
    box-shadow: inset 3px 0 0 ${colors.accentBase};
  }

  .project-research__filterIcon {
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${radius.pill};
    background: rgba(219, 234, 254, 0.72);
  }

  .project-research__filterLabel {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .project-research__filterButton strong {
    justify-self: end;
    font-size: 11px;
    color: ${colors.textFaint};
  }

  .project-research__revisionStack {
    display: grid;
    gap: ${spacing[8]};
  }

  .project-research__revisionButton {
    min-height: 44px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: ${spacing[8]};
    padding: ${spacing[8]} ${spacing[12]};
    border-radius: ${radius[16]};
    text-align: left;
  }

  .project-research__revisionButton span {
    min-width: 0;
    display: grid;
    gap: ${spacing[4]};
  }

  .project-research__revisionButton strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: ${typography.studyControlLabel.fontFamily};
    font-size: 12px;
    line-height: 1.2;
  }

  .project-research__revisionButton small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${colors.textSoft};
    font-size: 10px;
    line-height: 1.35;
  }

  .project-research__resultsPanel {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    gap: ${spacing[12]};
    overflow: hidden;
  }

  .project-research__searchPanel {
    display: grid;
    gap: ${spacing[8]};
    padding: ${spacing[12]};
  }

  .project-research__searchTopline {
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(160px, 0.32fr) minmax(0, 1fr);
    align-items: center;
    gap: ${spacing[12]};
  }

  .project-research__searchCopy {
    min-width: 0;
    display: grid;
    gap: ${spacing[4]};
  }

  .project-research__searchBox {
    min-height: 42px;
    display: flex;
    align-items: center;
    gap: ${spacing[12]};
    padding: 0 ${spacing[16]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius.pill};
    background: rgba(248, 251, 255, 0.94);
  }

  .project-research__searchBox input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: ${colors.textBody};
    font-family: ${typography.studyBody.fontFamily};
    font-size: 14px;
  }

  .project-research__searchBox input::placeholder {
    color: ${colors.textFaint};
  }

  .project-research__chipRow {
    min-width: 0;
    display: flex;
    gap: ${spacing[8]};
    overflow-x: auto;
    padding: 0;
  }

  .project-research__searchMeta {
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: ${spacing[12]};
  }

  .project-research__resultCount {
    color: ${colors.textFaint};
    font-family: ${typography.monoMeta.fontFamily};
    font-size: 10px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: nowrap;
  }

  .project-research__chip,
  .project-research__secondaryAction,
  .project-research__relatedRow button,
  .project-research__promptRow button,
  .project-research__askButton,
  .project-research__citationRow button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing[8]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius.pill};
    background: rgba(255, 255, 255, 0.9);
    color: ${colors.textSoft};
    font-family: ${typography.studyControlLabel.fontFamily};
    font-size: 11px;
    line-height: 1;
    font-weight: 850;
    cursor: pointer;
    transition:
      border-color ${motion.micro},
      color ${motion.micro},
      background ${motion.micro},
      box-shadow ${motion.micro};
  }

  .project-research__chip {
    min-height: 30px;
    padding: 0 ${spacing[12]};
    white-space: nowrap;
  }

  .project-research__chip:hover,
  .project-research__chip.is-active,
  .project-research__secondaryAction:hover,
  .project-research__relatedRow button:hover,
  .project-research__promptRow button:hover,
  .project-research__citationRow button:hover {
    border-color: ${colors.lineStrong};
    color: ${colors.accentStrong};
    background: ${colors.accentWash};
  }

  .project-research__tablePanel {
    min-height: 0;
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    overflow: hidden;
  }

  .project-research__rowList {
    min-height: 0;
    overflow: auto;
    display: grid;
    align-content: start;
    padding: ${spacing[12]};
    gap: ${spacing[8]};
  }

  .project-research__resultRow {
    width: 100%;
    min-height: 112px;
    display: grid;
    grid-template-columns: 48px minmax(260px, 1fr) minmax(240px, 0.86fr) minmax(104px, auto);
    align-items: center;
    gap: ${spacing[12]};
    padding: ${spacing[12]};
    border: 1px solid transparent;
    border-radius: ${radius[16]};
    background: rgba(255, 255, 255, 0.7);
    color: ${colors.textBody};
    text-align: left;
    cursor: pointer;
    transition:
      background ${motion.micro},
      border-color ${motion.micro},
      box-shadow ${motion.micro};
  }

  .project-research__resultRow:hover,
  .project-research__resultRow.is-selected {
    background: rgba(239, 246, 255, 0.62);
    border-color: ${colors.lineStrong};
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.06);
  }

  .project-research__resultRow.is-selected {
    box-shadow:
      inset 3px 0 0 ${colors.accentBase},
      0 8px 20px rgba(37, 99, 235, 0.08);
  }

  .project-research__segmentId {
    width: 40px;
    min-height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${radius.pill};
    background: ${colors.accentWash};
    color: ${colors.accentStrong};
    font-family: ${typography.studyControlLabel.fontFamily};
    font-size: 12px;
    font-weight: 900;
  }

  .project-research__resultRow.is-selected .project-research__segmentId {
    background: ${colors.accentBase};
    color: ${colors.surfacePrimary};
  }

  .project-research__resultPrimary,
  .project-research__resultSecondary,
  .project-research__topicCell {
    min-width: 0;
    display: grid;
    gap: ${spacing[8]};
  }

  .project-research__arabicExtract {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: ${colors.textStrong};
    font-family: ${typography.studyArabicInline.fontFamily};
    font-size: 15.5px;
    line-height: 1.58;
    text-align: right;
  }

  /* The topic is the segment's own title — the user's content, not chrome — so
     one line with an ellipsis is the design for a ledger row. The element
     carries data-truncates to declare that to the visual standard. */
  .project-research__topicCell strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: ${typography.studySectionTitle.fontFamily};
    font-size: 13px;
    line-height: 1.25;
    color: ${colors.textStrong};
  }

  .project-research__topicCell small,
  .project-research__translationPreview {
    color: ${colors.textSoft};
    font-family: ${typography.studySupportText.fontFamily};
    font-size: 12px;
    line-height: 1.45;
  }

  .project-research__translationPreview {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .project-research__translationPreview--inline {
    display: none;
  }

  .project-research__resultStatus {
    display: grid;
    justify-items: end;
    gap: ${spacing[8]};
    color: ${colors.textFaint};
  }

  .project-research__statusPill {
    width: fit-content;
    min-height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 ${spacing[12]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius.pill};
    background: rgba(255, 255, 255, 0.72);
    color: ${colors.textSoft};
    font-family: ${typography.eyebrowLabel.fontFamily};
    font-size: 8px;
    line-height: 1;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 900;
    white-space: nowrap;
  }

  .project-research__statusPill.is-ready {
    border-color: rgba(22, 163, 74, 0.18);
    background: rgba(240, 253, 244, 0.68);
    color: ${colors.success};
  }

  .project-research__statusPill.is-review,
  .project-research__statusPill.is-weak {
    border-color: rgba(217, 119, 6, 0.2);
    background: rgba(255, 251, 235, 0.72);
    color: ${colors.review};
  }

  .project-research__tagCell {
    min-width: 0;
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing[4]};
  }

  .project-research__tagCell em {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: ${spacing[4]} ${spacing[8]};
    border-radius: ${radius.pill};
    background: rgba(219, 234, 254, 0.42);
    color: ${colors.textSoft};
    font-style: normal;
    font-size: 10px;
    line-height: 1;
  }

  .project-research__emptyState,
  .project-research__emptyInspector,
  .project-research__answerPlaceholder {
    min-height: 220px;
    display: grid;
    place-items: center;
    align-content: center;
    gap: ${spacing[8]};
    padding: ${spacing[24]};
    text-align: center;
    color: ${colors.textSoft};
  }

  .project-research__emptyState strong,
  .project-research__emptyInspector h2,
  .project-research__answerPlaceholder strong {
    color: ${colors.textStrong};
  }

  .project-research__emptyState span,
  .project-research__emptyInspector p,
  .project-research__answerPlaceholder span {
    margin: 0;
    max-width: 280px;
    color: ${colors.textSoft};
    font-size: 12px;
    line-height: 1.5;
  }

  .project-research__rightWorkspace,
  .project-research__rightPanel,
  .project-research__rightBody,
  .project-research__dossierView,
  .project-research__sourceView,
  .project-research__companionView {
    min-height: 0;
  }

  .project-research__rightWorkspace {
    overflow: hidden;
  }

  .project-research__rightPanel {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
  }

  .project-research__rightPanel.is-dossier,
  .project-research__rightPanel.is-source {
    box-shadow:
      inset 3px 0 0 ${colors.accentBase},
      0 14px 30px rgba(15, 23, 42, 0.045);
  }

  .project-research__rightHeader {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
    gap: ${spacing[12]};
    padding: ${spacing[16]};
    border-bottom: 1px solid ${colors.lineSoft};
    background: rgba(248, 251, 255, 0.84);
  }

  .project-research__rightTitleGroup {
    min-width: 0;
    display: grid;
    gap: ${spacing[4]};
  }

  .project-research__rightHeaderActions {
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[8]};
  }

  .project-research__modeSwitch {
    display: inline-flex;
    align-items: center;
    padding: ${spacing[4]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius.pill};
    background: rgba(255, 255, 255, 0.8);
  }

  .project-research__modeSwitch button {
    min-height: 26px;
    border: 0;
    border-radius: ${radius.pill};
    background: transparent;
    color: ${colors.textSoft};
    padding: 0 ${spacing[8]};
    font-family: ${typography.studyControlLabel.fontFamily};
    font-size: 10px;
    line-height: 1;
    font-weight: 850;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    cursor: pointer;
  }

  .project-research__modeSwitch button.is-active {
    background: ${colors.accentWash};
    color: ${colors.accentStrong};
    box-shadow: inset 0 0 0 1px ${colors.lineStrong};
  }

  .project-research__dossierTitle,
  .project-research__sourceTitle {
    margin: ${spacing[4]} 0 0;
    font-family: ${typography.studySectionTitle.fontFamily};
    font-size: 16px;
    line-height: 1.25;
    color: ${colors.textStrong};
  }

  .project-research__rightBody {
    overflow: hidden;
    display: grid;
    min-height: 0;
  }

  .project-research__dossierView,
  .project-research__sourceView {
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    overflow: hidden;
  }

  .project-research__dossierBody,
  .project-research__sourceBody {
    min-height: 0;
    overflow: auto;
    display: grid;
    align-content: start;
    gap: ${spacing[12]};
    padding: ${spacing[12]};
  }

  .project-research__detailBlock {
    display: grid;
    gap: ${spacing[8]};
    padding: ${spacing[12]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[16]};
    background: rgba(255, 255, 255, 0.84);
  }

  .project-research__detailBlock.is-source {
    overflow: visible;
    background: linear-gradient(180deg, rgba(248, 251, 255, 0.96), rgba(255, 255, 255, 0.9));
  }

  .project-research__detailBlock.is-best {
    border-color: rgba(22, 163, 74, 0.24);
    background: rgba(240, 253, 244, 0.72);
  }

  .project-research__detailBlock.is-evaluation {
    border-color: rgba(217, 119, 6, 0.24);
    background: rgba(255, 251, 235, 0.72);
  }

  .project-research__blockContent p {
    margin: 0;
    color: ${colors.textBody};
    font-family: ${typography.studySupportText.fontFamily};
    font-size: 13px;
    line-height: 1.6;
  }

  .project-research__blockContent .project-research__arabicFull {
    color: ${colors.textStrong};
    font-family: ${typography.studyArabicSource.fontFamily};
    font-size: 20px;
    line-height: 1.8;
    text-align: right;
  }

  .project-research__comparisonGrid,
  .project-research__knowledgeGrid {
    display: grid;
    gap: ${spacing[12]};
  }

  .project-research__comparisonGrid {
    grid-template-columns: minmax(0, 1fr);
  }

  .project-research__noteList {
    margin: ${spacing[8]} 0 0;
    padding-inline-start: ${spacing[20]};
    color: ${colors.textBody};
    font-size: 12px;
    line-height: 1.55;
  }

  .project-research__vocabList {
    display: grid;
    gap: ${spacing[8]};
    margin-top: ${spacing[8]};
  }

  .project-research__vocabList article {
    display: grid;
    gap: ${spacing[4]};
    padding: ${spacing[12]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[12]};
    background: rgba(248, 251, 255, 0.78);
  }

  .project-research__vocabList strong {
    color: ${colors.textStrong};
    font-family: ${typography.studyArabicInline.fontFamily};
    font-size: 17px;
    line-height: 1.35;
  }

  .project-research__vocabList span {
    color: ${colors.textFaint};
    font-family: ${typography.monoMeta.fontFamily};
    font-size: 11px;
  }

  .project-research__vocabList p {
    margin: 0;
    color: ${colors.textBody};
    font-size: 12px;
    line-height: 1.45;
  }

  .project-research__relatedRow {
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing[8]};
    margin-top: ${spacing[8]};
  }

  .project-research__relatedRow button {
    min-height: 30px;
    padding: 0 ${spacing[12]};
  }

  .project-research__dossierActions,
  .project-research__sourceActions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    gap: ${spacing[8]};
    padding: ${spacing[12]};
    border-top: 1px solid ${colors.lineSoft};
    background: rgba(248, 251, 255, 0.84);
  }

  .project-research__secondaryAction {
    min-height: 38px;
    padding: 0 ${spacing[12]};
    white-space: nowrap;
  }

  .project-research__secondaryAction.is-primary {
    border-color: ${colors.lineStrong};
    color: ${colors.accentStrong};
    background: ${colors.accentWash};
  }

  .project-research__companionIcon {
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${radius.pill};
    background: ${colors.accentWash};
    color: ${colors.accentStrong};
  }

  .project-research__companionView {
    display: grid;
    overflow: hidden;
  }

  .project-research__companionBody {
    min-height: 0;
    overflow: hidden;
    display: grid;
    grid-template-rows: minmax(120px, 1fr) auto auto;
    align-content: stretch;
    gap: ${spacing[12]};
    padding: ${spacing[12]};
  }

  .project-research__answerCard {
    min-height: 0;
    overflow: auto;
    display: grid;
    gap: ${spacing[8]};
    padding: ${spacing[8]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[16]};
    background: linear-gradient(180deg, rgba(239, 246, 255, 0.88), rgba(255, 255, 255, 0.9));
  }

  .project-research__answerCard p {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    margin: 0;
    color: ${colors.textBody};
    font-size: 11.5px;
    line-height: 1.45;
  }

  .project-research__citationRow {
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing[8]};
  }

  .project-research__promptRow {
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing[8]};
  }

  .project-research__citationRow button,
  .project-research__promptRow button {
    min-height: 30px;
    padding: 0 ${spacing[12]};
  }

  .project-research__askRow {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 76px;
    align-items: stretch;
    gap: ${spacing[8]};
  }

  .project-research__askBox {
    display: block;
    min-width: 0;
  }

  .project-research__askBox textarea {
    width: 100%;
    min-height: 48px;
    max-height: 96px;
    resize: vertical;
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[16]};
    background: rgba(255, 255, 255, 0.92);
    color: ${colors.textBody};
    padding: ${spacing[12]};
    font-family: ${typography.studyBody.fontFamily};
    font-size: 13px;
    line-height: 1.4;
    outline: none;
  }

  .project-research__askBox textarea:focus {
    border-color: ${colors.lineStrong};
    box-shadow: 0 0 0 4px rgba(219, 234, 254, 0.72);
  }

  .project-research__askButton {
    min-width: 0;
    min-height: 48px;
    padding: 0 ${spacing[12]};
    border-radius: ${radius[16]};
    color: ${colors.accentStrong};
    border-color: ${colors.lineStrong};
    background: ${colors.accentWash};
  }

  @media (max-width: 1500px) {
    .project-research__title {
      font-size: 32px;
    }

    .project-research__resultRow {
      grid-template-columns: 48px minmax(224px, 1fr) minmax(168px, 0.72fr) minmax(96px, auto);
    }
  }

  @media (max-width: 1380px) {
    .project-research__masthead {
      padding: ${spacing[12]} ${spacing[16]};
      gap: ${spacing[12]};
    }

    .project-research__title {
      font-size: 30px;
    }

    .project-research__lead {
      font-size: 13px;
    }

    .project-research__metricStrip {
      display: none;
    }

    .project-research__searchPanel {
      gap: ${spacing[12]};
      padding: ${spacing[12]};
    }

    .project-research__searchTopline,
    .project-research__searchMeta {
      grid-template-columns: minmax(0, 1fr);
    }

    .project-research__searchBox {
      min-height: 44px;
    }

    .project-research__chip {
      min-height: 30px;
    }

    .project-research__rightHeader {
      padding: ${spacing[12]};
    }

    .project-research__dossierTitle,
    .project-research__sourceTitle {
      font-size: 15px;
    }

    .project-research__dossierMeta,
    .project-research__sourceMeta {
      font-size: 13px;
      line-height: 1.35;
    }

    .project-research__blockContent .project-research__arabicFull {
      font-size: 18px;
      line-height: 1.65;
    }

    .project-research__answerCard p {
      -webkit-line-clamp: 3;
    }

    .project-research__companionBody {
      padding: ${spacing[8]};
      gap: ${spacing[8]};
    }

    .project-research__resultRow {
      grid-template-columns: 48px minmax(0, 1fr) auto;
      min-height: 112px;
    }

    .project-research__resultSecondary {
      display: none;
    }

    .project-research__resultPrimary,
    .project-research__topicCell {
      gap: ${spacing[4]};
    }

    .project-research__arabicExtract {
      -webkit-line-clamp: 1;
      font-size: 14.5px;
      line-height: 1.45;
    }

    .project-research__topicCell small {
      display: none;
    }

    .project-research__translationPreview--inline {
      display: -webkit-box;
      -webkit-line-clamp: 1;
    }
  }

  /* Bold research-desk redesign overrides. These keep layout ownership on the shell,
     desk, ledger, and dossier containers rather than individual content cells. */

  .project-research__masthead {
    min-height: 58px;
    grid-template-columns: minmax(0, 1fr) auto;
    padding: ${spacing[12]} ${spacing[16]};
    border-radius: ${radius[20]};
    border-color: rgba(148, 163, 184, 0.28);
    background:
      linear-gradient(90deg, rgba(15, 23, 42, 0.96) 0, rgba(30, 41, 59, 0.94) 34%, rgba(255, 255, 255, 0.92) 34.1%, rgba(248, 251, 255, 0.88) 100%);
    box-shadow: 0 18px 38px rgba(15, 23, 42, 0.1);
    overflow: hidden;
  }

  .project-research__titleGroup {
    grid-template-columns: minmax(0, 1fr);
    align-items: baseline;
    column-gap: ${spacing[12]};
    row-gap: ${spacing[4]};
  }

  .project-research__titleGroup .project-research__eyebrow {
    display: none;
  }

  .project-research__title {
    color: ${colors.surfacePrimary};
    font-size: 25px;
    line-height: 1;
  }

  .project-research__lead {
    display: none;
  }

  .project-research__lead span {
    color: ${colors.textStrong};
  }

  .project-research__headerAside {
    grid-template-columns: auto auto;
    align-items: center;
    justify-items: end;
    gap: ${spacing[12]};
  }

  .project-research__metricStrip {
    display: flex;
    align-items: center;
    gap: ${spacing[4]};
  }

  .project-research__metricPill {
    min-height: 32px;
    min-width: 0;
    grid-template-columns: auto auto;
    align-items: baseline;
    justify-items: start;
    gap: ${spacing[4]};
    padding: ${spacing[4]} ${spacing[8]};
    border-radius: ${radius[12]};
    background: rgba(255, 255, 255, 0.72);
    box-shadow: none;
  }

  .project-research__metricPill strong {
    font-size: 14px;
  }

  .project-research__metricPill span,
  .project-research__actionHint {
    font-size: 10px;
  }

  .project-research__actionHint {
    display: none;
  }

  .project-research__studyLink {
    min-height: 34px;
    background: rgba(255, 255, 255, 0.78);
    border-color: rgba(37, 99, 235, 0.24);
    color: ${colors.accentStrong};
    box-shadow: none;
  }

  .project-research__filterRail {
    gap: ${spacing[12]};
  }

  .project-research__filterRail .project-research__panel {
    border-color: rgba(255, 255, 255, 0.1);
    background:
      radial-gradient(circle at 16% 4%, rgba(147, 197, 253, 0.2), transparent 26%),
      linear-gradient(180deg, #101827 0%, #172033 100%);
    color: rgba(241, 245, 249, 0.94);
    box-shadow: 0 18px 44px rgba(15, 23, 42, 0.18);
  }

  .project-research__filterRail .project-research__eyebrow,
  .project-research__filterRail .project-research__panelTitle {
    color: rgba(241, 245, 249, 0.96);
  }

  .project-research__panelHeader {
    padding: ${spacing[16]};
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .project-research__filterList {
    gap: ${spacing[8]};
    padding: ${spacing[12]};
  }

  .project-research__filterButton,
  .project-research__revisionButton {
    color: rgba(226, 232, 240, 0.84);
    background: transparent;
  }

  .project-research__filterButton {
    min-height: 44px;
    border-radius: ${radius[12]};
  }

  .project-research__filterIcon {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(219, 234, 254, 0.92);
  }

  .project-research__filterButton strong,
  .project-research__revisionButton small {
    color: rgba(203, 213, 225, 0.66);
  }

  .project-research__filterButton:hover,
  .project-research__filterButton.is-active,
  .project-research__revisionButton:hover {
    border-color: rgba(147, 197, 253, 0.36);
    background: rgba(239, 246, 255, 0.1);
    color: ${colors.surfacePrimary};
    box-shadow: inset 3px 0 0 ${colors.accentSoft};
  }

  .project-research__filterButton.is-active .project-research__filterIcon {
    background: ${colors.surfacePrimary};
    color: ${colors.accentStrong};
  }

  .project-research__revisionPanel {
    gap: ${spacing[12]};
  }

  .project-research__desk {
    height: 100%;
    min-height: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    overflow: hidden;
    border: 1px solid rgba(15, 23, 42, 0.14);
    border-radius: 28px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.94));
    box-shadow: 0 28px 72px rgba(15, 23, 42, 0.13);
  }

  .project-research__deskToolbar {
    display: grid;
    gap: ${spacing[12]};
    padding: ${spacing[16]} ${spacing[20]};
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.98), rgba(239, 246, 255, 0.66));
  }

  .project-research__searchTopline {
    grid-template-columns: minmax(180px, 0.26fr) minmax(0, 1fr);
  }

  .project-research__searchCopy h2 {
    font-size: 17px;
  }

  .project-research__searchBox {
    min-height: 44px;
    border-color: rgba(15, 23, 42, 0.12);
    border-radius: ${radius[16]};
    background: ${colors.surfacePrimary};
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.8);
  }

  .project-research__chip {
    min-height: 28px;
    border-color: rgba(15, 23, 42, 0.1);
    background: transparent;
  }

  .project-research__chip.is-active {
    background: #111827;
    border-color: #111827;
    color: ${colors.surfacePrimary};
  }

  .project-research__deskBody {
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(424px, 472px);
    overflow: hidden;
  }

  /* Browse gives the ledger the whole width and drops the inspector entirely.
     The inspector lane was reserved whether or not anything was selected, so
     headings truncated to "Pure water as ori..." beside 470px of empty panel.
     This is the R2 Research treatment, kept in preference to R3's, which
     retains the reserved lane. */
  .project-research__deskBody.is-browse {
    grid-template-columns: minmax(0, 1fr);
  }

  .project-research__ledgerPane {
    min-height: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    overflow: hidden;
    background: rgba(255, 255, 255, 0.72);
  }

  .project-research__ledgerHeader {
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[12]};
    padding: ${spacing[12]} ${spacing[20]};
    border-bottom: 1px solid rgba(15, 23, 42, 0.07);
    color: ${colors.textSoft};
    font-family: ${typography.studyControlLabel.fontFamily};
    font-size: 11px;
    font-weight: 850;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .project-research__ledgerHeader span {
    color: ${colors.textStrong};
  }

  .project-research__ledgerHeader small {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${colors.textFaint};
    font-size: 10px;
  }

  .project-research__rowList {
    padding: ${spacing[8]} ${spacing[12]} ${spacing[12]};
    gap: ${spacing[4]};
  }

  .project-research__resultRow {
    min-height: 104px;
    grid-template-columns: 48px minmax(260px, 1fr) minmax(220px, 0.76fr) minmax(96px, auto);
    gap: ${spacing[12]};
    padding: ${spacing[12]};
    border: 1px solid transparent;
    border-radius: ${radius[12]};
    background: transparent;
    box-shadow: none;
  }

  .project-research__resultRow + .project-research__resultRow {
    border-top-color: rgba(15, 23, 42, 0.06);
  }

  .project-research__resultRow:hover {
    background: rgba(248, 250, 252, 0.9);
    border-color: rgba(37, 99, 235, 0.14);
    box-shadow: none;
  }

  .project-research__resultRow.is-selected {
    background:
      linear-gradient(90deg, #111827 0, #111827 8px, rgba(239, 246, 255, 0.94) 8px, rgba(255, 255, 255, 0.94) 100%);
    border-color: rgba(37, 99, 235, 0.46);
    box-shadow:
      inset -1px 0 0 ${colors.accentBase},
      0 16px 34px rgba(37, 99, 235, 0.12);
  }

  .project-research__segmentId {
    width: 42px;
    min-height: 42px;
    border-radius: ${radius[12]};
    background: rgba(15, 23, 42, 0.08);
    color: ${colors.textStrong};
  }

  .project-research__resultRow.is-selected .project-research__segmentId {
    background: ${colors.accentBase};
    color: ${colors.surfacePrimary};
  }

  .project-research__arabicExtract {
    font-size: 16px;
    line-height: 1.65;
  }

  .project-research__topicCell strong {
    font-size: 13.5px;
  }

  .project-research__translationPreview {
    color: ${colors.textBody};
  }

  .project-research__tagCell em {
    background: rgba(15, 23, 42, 0.06);
  }

  .project-research__rightWorkspace {
    height: 100%;
    min-height: 0;
    overflow: hidden;
    border-left: 1px solid rgba(15, 23, 42, 0.12);
    background: #f8fbff;
  }

  .project-research__rightPanel {
    height: 100%;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  .project-research__rightPanel.is-dossier,
  .project-research__rightPanel.is-source {
    box-shadow: inset 4px 0 0 ${colors.accentBase};
  }

  .project-research__rightHeader {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: ${spacing[16]};
    padding: ${spacing[16]} ${spacing[20]};
    border-bottom: 0;
    background:
      radial-gradient(circle at 92% 8%, rgba(147, 197, 253, 0.22), transparent 30%),
      linear-gradient(180deg, #101827, #172033);
  }

  .project-research__rightHeader .project-research__eyebrow,
  .project-research__rightHeader .project-research__dossierTitle,
  .project-research__rightHeader .project-research__sourceTitle {
    color: ${colors.surfacePrimary};
  }

  .project-research__rightHeader .project-research__sourceTitle {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .project-research__rightHeader .project-research__dossierMeta,
  .project-research__rightHeader .project-research__sourceMeta {
    color: rgba(226, 232, 240, 0.74);
  }

  .project-research__rightHeaderActions {
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    max-width: 190px;
  }

  .project-research__modeSwitch {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.08);
  }

  .project-research__modeSwitch button {
    color: rgba(226, 232, 240, 0.72);
  }

  .project-research__modeSwitch button.is-active {
    background: ${colors.surfacePrimary};
    color: ${colors.accentStrong};
    box-shadow: none;
  }

  .project-research__rightBody {
    background: #f8fbff;
  }

  .project-research__dossierBody,
  .project-research__sourceBody {
    gap: ${spacing[16]};
    padding: ${spacing[16]} ${spacing[20]};
  }

  .project-research__detailBlock {
    gap: ${spacing[8]};
    padding: ${spacing[16]};
    border-color: rgba(15, 23, 42, 0.1);
    border-radius: ${radius[16]};
    background: ${colors.surfacePrimary};
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.045);
  }

  .project-research__detailBlock.is-source {
    background:
      linear-gradient(180deg, ${colors.surfacePrimary}, rgba(248, 250, 252, 0.96));
  }

  .project-research__blockContent .project-research__arabicFull {
    font-size: 21px;
    line-height: 1.9;
  }

  .project-research__dossierActions,
  .project-research__sourceActions {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    padding: ${spacing[12]} ${spacing[20]};
    background: ${colors.surfacePrimary};
  }

  .project-research__secondaryAction.is-primary {
    border-color: ${colors.accentBase};
    background: ${colors.accentBase};
    color: ${colors.surfacePrimary};
  }

  .project-research__companionBody {
    grid-template-rows: minmax(180px, 1fr) auto auto;
    padding: ${spacing[20]};
  }

  .project-research__answerCard {
    padding: ${spacing[16]};
    background: ${colors.surfacePrimary};
  }

  .project-research__answerCard p {
    -webkit-line-clamp: unset;
    font-size: 13px;
    line-height: 1.6;
  }

  @media (max-width: 1500px) {
    .project-research__deskBody {
      grid-template-columns: minmax(0, 1fr) minmax(396px, 432px);
    }

    .project-research__resultRow {
      grid-template-columns: 48px minmax(224px, 1fr) minmax(156px, 0.68fr) minmax(96px, auto);
    }
  }

  @media (max-width: 1380px) {
    .project-research__masthead {
      grid-template-columns: minmax(0, 1fr) auto;
      min-height: 60px;
    }

    .project-research__titleGroup {
      grid-template-columns: minmax(0, 1fr);
    }

    .project-research__titleGroup .project-research__eyebrow,
    .project-research__lead {
      display: none;
    }

    .project-research__title {
      font-size: 24px;
    }

    .project-research__deskToolbar {
      padding: ${spacing[12]} ${spacing[16]};
    }

    .project-research__filterRail {
      gap: ${spacing[8]};
    }

    .project-research__filterRail .project-research__panelHeader {
      padding: ${spacing[12]};
    }

    .project-research__filterList {
      gap: ${spacing[4]};
      padding: ${spacing[8]};
    }

    .project-research__filterButton {
      min-height: 36px;
      gap: ${spacing[8]};
      padding: ${spacing[4]} ${spacing[8]};
      font-size: 11px;
    }

    .project-research__filterIcon {
      width: 24px;
      height: 24px;
    }

    .project-research__revisionPanel {
      gap: ${spacing[8]};
      padding: ${spacing[8]};
    }

    .project-research__revisionButton {
      min-height: 36px;
      padding: ${spacing[4]} ${spacing[8]};
    }

    .project-research__revisionButton small {
      display: none;
    }

    .project-research__deskBody {
      grid-template-columns: minmax(0, 1fr) minmax(360px, 388px);
    }

    .project-research__rowList {
      padding: ${spacing[8]};
    }

    .project-research__resultRow {
      min-height: 104px;
      grid-template-columns: 48px minmax(0, 1fr) auto;
    }

    .project-research__rightHeader,
    .project-research__dossierBody,
    .project-research__sourceBody,
    .project-research__companionBody {
      padding: ${spacing[12]};
    }

    .project-research__blockContent .project-research__arabicFull {
      font-size: 18.5px;
    }
  }

  /* Focused master-detail cleanup: the ledger owns scanning, the inspector supports the selected segment. */

  .project-research__deskToolbar {
    gap: ${spacing[8]};
    padding: ${spacing[12]} ${spacing[20]};
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.98), rgba(248, 251, 255, 0.9));
  }

  .project-research__searchTopline {
    grid-template-columns: minmax(160px, 0.22fr) minmax(0, 1fr);
  }

  .project-research__searchMeta {
    align-items: center;
  }

  .project-research__chip {
    min-height: 32px;
    border-color: rgba(148, 163, 184, 0.3);
    background: rgba(255, 255, 255, 0.82);
    color: ${colors.textBody};
  }

  .project-research__chip:hover {
    border-color: rgba(37, 99, 235, 0.28);
    background: rgba(239, 246, 255, 0.76);
    color: ${colors.accentStrong};
  }

  .project-research__chip.is-active {
    border-color: rgba(37, 99, 235, 0.28);
    background: ${colors.accentWash};
    color: ${colors.accentStrong};
    box-shadow: inset 0 0 0 1px rgba(147, 197, 253, 0.38);
  }

  .project-research__ledgerHeader {
    padding: ${spacing[12]} ${spacing[20]};
    letter-spacing: 0.06em;
  }

  .project-research__rowList {
    padding: ${spacing[8]} ${spacing[12]} ${spacing[32]};
    gap: ${spacing[4]};
  }

  .project-research__resultRow {
    min-height: 104px;
    grid-template-columns:
      44px
      minmax(168px, 1.05fr)
      minmax(128px, 0.72fr)
      minmax(132px, 0.7fr)
      minmax(84px, auto);
    grid-template-areas: "id arabic translation meta status";
    gap: ${spacing[12]};
    align-items: center;
    padding: ${spacing[16]};
    border-radius: ${radius[12]};
    border-color: transparent;
    background: transparent;
    box-shadow: none;
  }

  .project-research__resultRow + .project-research__resultRow {
    border-top: 1px solid rgba(15, 23, 42, 0.06);
  }

  .project-research__resultRow:hover {
    background: rgba(248, 250, 252, 0.94);
    border-color: rgba(148, 163, 184, 0.22);
    box-shadow: none;
  }

  .project-research__resultRow.is-selected {
    background: linear-gradient(90deg, rgba(37, 99, 235, 0.08), rgba(239, 246, 255, 0.74));
    border-color: rgba(37, 99, 235, 0.32);
    box-shadow:
      inset 4px 0 0 ${colors.accentBase},
      0 12px 28px rgba(37, 99, 235, 0.08);
  }

  .project-research__segmentId {
    grid-area: id;
    width: 40px;
    min-height: 40px;
    border-radius: ${radius[12]};
    background: rgba(15, 23, 42, 0.07);
    color: ${colors.textStrong};
  }

  .project-research__resultRow.is-selected .project-research__segmentId {
    background: ${colors.accentBase};
    color: ${colors.surfacePrimary};
    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.18);
  }

  .project-research__resultArabic,
  .project-research__resultTranslation,
  .project-research__resultMeta,
  .project-research__topicCell {
    min-width: 0;
    display: grid;
    gap: ${spacing[4]};
  }

  .project-research__resultArabic {
    grid-area: arabic;
  }

  .project-research__resultTranslation {
    grid-area: translation;
  }

  .project-research__resultMeta {
    grid-area: meta;
  }

  .project-research__resultMeta {
    gap: ${spacing[8]};
  }

  .project-research__arabicExtract {
    -webkit-line-clamp: 2;
    font-size: 15.5px;
    line-height: 1.62;
  }

  .project-research__translationPreview {
    -webkit-line-clamp: 2;
    color: ${colors.textBody};
    font-size: 12px;
    line-height: 1.45;
  }

  .project-research__topicCell strong {
    font-size: 13px;
    line-height: 1.25;
  }

  .project-research__topicCell small {
    color: ${colors.textSoft};
  }

  .project-research__tagCell {
    gap: ${spacing[4]};
  }

  .project-research__tagCell em {
    background: rgba(15, 23, 42, 0.055);
    color: ${colors.textSoft};
  }

  .project-research__resultStatus {
    grid-area: status;
    align-self: center;
    justify-items: end;
  }

  .project-research__statusPill {
    min-height: 24px;
    padding: 0 ${spacing[8]};
    border-color: rgba(148, 163, 184, 0.32);
    background: rgba(255, 255, 255, 0.78);
    color: ${colors.textSoft};
    font-size: 10px;
    letter-spacing: 0.02em;
    text-transform: none;
    font-weight: 850;
  }

  .project-research__statusPill.is-ready {
    border-color: rgba(22, 163, 74, 0.16);
    background: rgba(240, 253, 244, 0.46);
    color: ${colors.success};
  }

  .project-research__statusPill.is-review,
  .project-research__statusPill.is-weak {
    border-color: rgba(217, 119, 6, 0.22);
    background: rgba(255, 251, 235, 0.58);
    color: ${colors.review};
  }

  .project-research__rightWorkspace {
    background: rgba(248, 251, 255, 0.92);
  }

  .project-research__rightPanel.is-source {
    box-shadow: inset 3px 0 0 rgba(37, 99, 235, 0.36);
  }

  .project-research__rightHeader {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: ${spacing[12]};
    padding: ${spacing[16]} ${spacing[20]};
    border-bottom: 1px solid rgba(148, 163, 184, 0.22);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 251, 255, 0.9));
  }

  .project-research__rightTitleGroup {
    gap: ${spacing[8]};
  }

  .project-research__inspectorLabelRow {
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[8]};
  }

  .project-research__inspectorLabelRow .project-research__statusPill {
    flex: 0 0 auto;
  }

  .project-research__rightHeader .project-research__eyebrow,
  .project-research__rightHeader .project-research__sourceTitle {
    color: ${colors.textStrong};
  }

  .project-research__rightHeader .project-research__eyebrow {
    color: ${colors.accentStrong};
    text-transform: none;
    letter-spacing: 0.02em;
    font-size: 12px;
    font-weight: 900;
  }

  .project-research__rightHeader .project-research__sourceTitle {
    margin-top: 0;
    font-size: 18px;
    line-height: 1.3;
  }

  .project-research__rightHeader .project-research__sourceMeta {
    color: ${colors.textSoft};
  }

  .project-research__rightHeaderActions {
    max-width: none;
    justify-content: flex-end;
    align-self: start;
  }

  .project-research__modeSwitch {
    border-color: rgba(148, 163, 184, 0.28);
    background: rgba(255, 255, 255, 0.8);
  }

  .project-research__modeSwitch button {
    color: ${colors.textSoft};
    letter-spacing: 0.04em;
  }

  .project-research__modeSwitch button.is-active {
    background: ${colors.accentWash};
    color: ${colors.accentStrong};
    box-shadow: inset 0 0 0 1px rgba(147, 197, 253, 0.42);
  }

  .project-research__rightBody {
    background: rgba(248, 251, 255, 0.92);
  }

  .project-research__sourceBody {
    min-height: 0;
    display: grid;
    align-content: start;
    gap: ${spacing[16]};
    padding: ${spacing[16]} ${spacing[20]} ${spacing[32]};
    overflow: auto;
  }

  .project-research__detailBlock {
    min-width: 0;
    overflow: visible;
    display: grid;
    align-content: start;
    gap: ${spacing[8]};
    border-color: rgba(148, 163, 184, 0.22);
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.035);
  }

  .project-research__detailBlock.is-source {
    padding: ${spacing[20]};
    background:
      linear-gradient(180deg, ${colors.surfacePrimary}, rgba(248, 251, 255, 0.96));
    border-color: rgba(37, 99, 235, 0.18);
    box-shadow:
      inset 0 0 0 1px rgba(147, 197, 253, 0.14),
      0 10px 24px rgba(37, 99, 235, 0.055);
  }

  .project-research__detailBlock.is-notes,
  .project-research__detailBlock.is-vocabulary,
  .project-research__detailBlock.is-related {
    background: rgba(255, 255, 255, 0.82);
  }

  .project-research__blockContent {
    min-width: 0;
    display: grid;
    gap: ${spacing[8]};
    overflow-wrap: anywhere;
  }

  .project-research__blockContent .project-research__arabicFull {
    direction: rtl;
    max-width: 100%;
    overflow-wrap: anywhere;
    font-size: 22px;
    line-height: 1.95;
    text-align: right;
  }

  .project-research__noteList,
  .project-research__vocabList,
  .project-research__relatedRow {
    margin-top: 0;
  }

  .project-research__sourceActions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: center;
    gap: ${spacing[12]};
    padding: ${spacing[12]} ${spacing[20]};
    background: rgba(255, 255, 255, 0.96);
  }

  .project-research__secondaryAction {
    min-width: 0;
    min-height: 40px;
    padding: 0 ${spacing[16]};
  }

  .project-research__secondaryAction.is-muted {
    color: ${colors.textSoft};
    background: transparent;
    border-color: rgba(148, 163, 184, 0.24);
  }

  .project-research__secondaryAction.is-primary {
    order: -1;
    grid-column: 1 / -1;
    justify-self: stretch;
    border-color: ${colors.accentBase};
    background: ${colors.accentBase};
    color: ${colors.surfacePrimary};
    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.16);
  }

  @media (max-width: 1500px) {
    .project-research__resultRow {
      grid-template-columns:
        44px
        minmax(152px, 1fr)
        minmax(112px, 0.62fr)
        minmax(124px, 0.62fr)
        minmax(78px, auto);
    }
  }

  @media (max-width: 1380px) {
    .project-research__searchTopline,
    .project-research__searchMeta {
      grid-template-columns: minmax(0, 1fr);
    }

    .project-research__rowList {
      padding: ${spacing[8]} ${spacing[8]} ${spacing[32]};
    }

    .project-research__resultRow {
      min-height: 104px;
      grid-template-columns: 44px minmax(0, 1fr) minmax(78px, auto);
      grid-template-areas:
        "id arabic status"
        "id meta status";
    }

    .project-research__resultTranslation {
      display: none;
    }

    .project-research__resultMeta {
      gap: ${spacing[4]};
    }

    .project-research__resultStatus {
      align-self: start;
      padding-top: ${spacing[4]};
    }

    .project-research__tagCell {
      display: none;
    }

    .project-research__translationPreview--inline {
      display: -webkit-box;
      -webkit-line-clamp: 1;
    }

    .project-research__rightHeader {
      grid-template-columns: minmax(0, 1fr) auto;
      padding: ${spacing[12]};
    }

    .project-research__rightHeaderActions {
      gap: ${spacing[8]};
    }

    .project-research__sourceBody {
      padding: ${spacing[12]} ${spacing[12]} ${spacing[32]};
    }

    .project-research__blockContent .project-research__arabicFull {
      font-size: 19px;
      line-height: 1.8;
    }

    .project-research__sourceActions {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      padding: ${spacing[12]};
    }

    .project-research__secondaryAction,
    .project-research__secondaryAction.is-primary {
      justify-self: stretch;
    }
  }
`
