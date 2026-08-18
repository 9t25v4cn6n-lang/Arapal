import { useState } from 'react'
import {
  BookOpen,
  BrainCircuit,
  ChevronRight,
  ExternalLink,
  FileText,
  MessageSquareText,
  PenTool,
  Search,
  Sparkles,
  Tags,
  X,
} from 'lucide-react'
import { colors } from '../../foundation/tokens'
import { Badge, Chip } from '../../foundation/primitives/CompactControls'

/**
 * Research states three kinds of fact about a segment and used to draw each one
 * with its own local CSS: a status pill, a tag `<em>`, and a quick-refinement
 * chip. All three are now the shared compact-control family, so a Research
 * status badge and an Exams status badge are the same object.
 */
const researchStatusTone = { ready: 'ready', weak: 'critical', review: 'review' }

export function StatusBadge({ tone = 'review', children }) {
  return <Badge tone={researchStatusTone[tone] ?? 'review'}>{children}</Badge>
}

export function StatusPill(props) {
  return <StatusBadge {...props} />
}

export function LensSpine({ filters, activeFilter, getFilterCount, revisionEntries, onFilterChange, onRevisionSelect }) {
  return (
    <aside className="project-research project-research__filterRail" data-debug-item="project_research_filter_rail">
      <section className="project-research__panel project-research__railPanel">
        <div className="project-research__panelHeader">
          <div>
            <p className="project-research__eyebrow">Project knowledge</p>
            <h2 className="project-research__panelTitle">Research lenses</h2>
          </div>
          <Tags size={17} strokeWidth={2} color={colors.accentStrong} />
        </div>

        <div className="project-research__filterList" role="list" aria-label="Research filters">
          {filters.map((filter) => {
            const Icon = filter.icon
            const isActive = filter.id === activeFilter
            const filterCount = getFilterCount(filter.id)

            return (
              <button
                key={filter.id}
                type="button"
                aria-label={`${filter.label}: ${filterCount}`}
                className={`project-research__filterButton${isActive ? ' is-active' : ''}`}
                onClick={() => onFilterChange(filter.id)}
              >
                <span className="project-research__filterIcon">
                  <Icon size={15} strokeWidth={2} />
                </span>
                <span className="project-research__filterLabel">{filter.shortLabel}</span>
                <strong>{filterCount}</strong>
              </button>
            )
          })}
        </div>
      </section>

      <section className="project-research__panel project-research__revisionPanel">
        <p className="project-research__eyebrow">Revision queue</p>
        <h2 className="project-research__panelTitle">Return to what needs attention</h2>
        <div className="project-research__revisionStack">
          {revisionEntries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="project-research__revisionButton"
              onClick={() => onRevisionSelect({ filter: entry.filter, query: entry.query })}
            >
              <span>
                <strong>{entry.label}</strong>
                <small>{entry.detail}</small>
              </span>
              <ChevronRight size={15} strokeWidth={2.2} />
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}

export function ResearchSearchCommand({
  query,
  resultCount,
  activeFilterLabel,
  quickRefinements,
  activeQuick,
  onQueryChange,
  onQuickSelect,
}) {
  return (
    <section className="project-research__deskToolbar" data-debug-item="project_research_primary_search">
      <div className="project-research__searchTopline">
        <div className="project-research__searchCopy">
          <p className="project-research__eyebrow">Project search</p>
          <h2>Find project knowledge</h2>
        </div>
        <label className="project-research__searchBox">
          <Search size={18} strokeWidth={2} color={colors.textFaint} />
          <input
            aria-label="Search project knowledge"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search Arabic, English, topics, notes, mistakes, roots..."
          />
        </label>
      </div>

      <div className="project-research__searchMeta">
        <div className="project-research__chipRow" aria-label="Quick refinements">
          {/* These four were the clearest evidence in the product that the
              compact-control family had no single definition: the base
              stylesheet gave the chip 11px/850 at 30px, then two later override
              blocks in the same file restated it and the last one declared no
              type at all — so the filters inherited the document's 18px and
              rendered larger than any other control on the screen. */}
          {quickRefinements.map((refinement) => (
            <Chip
              key={refinement.id}
              active={activeQuick === refinement.id}
              onClick={() => onQuickSelect(activeQuick === refinement.id ? null : refinement.id)}
            >
              {refinement.label}
            </Chip>
          ))}
        </div>
        <span className="project-research__resultCount">{resultCount} visible · {activeFilterLabel}</span>
      </div>
    </section>
  )
}

export function KnowledgeLedger({ rows, selectedSegmentId, onSelectSegment }) {
  return (
    <section className="project-research__ledgerPane" aria-label="Saved project knowledge">
      <div className="project-research__ledgerHeader">
        <span>Segment ledger</span>
        <small>Arabic extract · Translation signal · Status</small>
      </div>
      <div className="project-research__rowList">
        {rows.length ? rows.map((segment) => (
          <KnowledgeLedgerRow
            key={segment.id}
            segment={segment}
            isSelected={segment.id === selectedSegmentId}
            onSelectSegment={onSelectSegment}
          />
        )) : (
          <div className="project-research__emptyState">
            <FileText size={26} strokeWidth={1.8} />
            <strong>No matching project knowledge yet</strong>
            <span>Try a broader phrase, Arabic term, topic, or status filter.</span>
          </div>
        )}
      </div>
    </section>
  )
}

export function KnowledgeLedgerRow({ segment, isSelected, onSelectSegment }) {
  return (
    <button
      type="button"
      className={`project-research__resultRow${isSelected ? ' is-selected' : ''}`}
      onClick={() => onSelectSegment(segment.id)}
    >
      <span className="project-research__segmentId">{segment.id}</span>
      <span className="project-research__resultArabic">
        <span className="project-research__arabicExtract" dir="rtl" lang="ar">{segment.arabic}</span>
      </span>
      <span className="project-research__resultTranslation">
        <span className="project-research__translationPreview">{segment.bestTranslation}</span>
      </span>
      <span className="project-research__resultMeta">
        <span className="project-research__topicCell">
          {/* The segment's own heading. One line with an ellipsis is the design
              for a ledger row, so the truncation is declared rather than left
              for the visual standard to read as a defect. */}
          <strong data-truncates="">{segment.heading}</strong>
          <small>{segment.chapter} · {segment.topic}</small>
          <span className="project-research__translationPreview project-research__translationPreview--inline">
            {segment.bestTranslation}
          </span>
        </span>
        <span className="project-research__tagCell">
          {segment.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} tone="quiet">{tag}</Badge>
          ))}
        </span>
      </span>
      <span className="project-research__resultStatus">
        <StatusBadge tone={segment.statusTone}>{segment.status}</StatusBadge>
      </span>
    </button>
  )
}

export function SegmentInspectorBlock({ label, children, tone = 'default', dir }) {
  return (
    <section className={`project-research__detailBlock is-${tone}`}>
      <p className="project-research__blockLabel">{label}</p>
      <div className="project-research__blockContent" dir={dir}>
        {children}
      </div>
    </section>
  )
}

export function SourceReaderBlock(props) {
  return <SegmentInspectorBlock {...props} />
}

export function SegmentInspector({ segment, onSelectSegment, onOpenStudy, onClearSelection }) {
  if (!segment) {
    return (
      <div className="project-research__sourceView" data-debug-item="project_research_empty_source_reader">
        <div className="project-research__emptyInspector">
          <Sparkles size={28} strokeWidth={1.8} />
          <h2>Select a segment to inspect</h2>
          <p>Full Arabic source, translation comparison, evaluation, notes, vocabulary, and related segments will appear here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="project-research__sourceView" data-debug-item="project_research_source_reader">
      <div className="project-research__sourceBody">
        <SegmentInspectorBlock label="Arabic source" tone="source" dir="rtl">
          <p lang="ar" className="project-research__arabicFull">{segment.arabic}</p>
        </SegmentInspectorBlock>

        <section className="project-research__comparisonGrid">
          <SegmentInspectorBlock label="Your translation">
            <p>{segment.userTranslation || 'No user translation saved yet. Use this segment for a future translation attempt or comparison drill.'}</p>
          </SegmentInspectorBlock>

          <SegmentInspectorBlock label="Best translation" tone="best">
            <p>{segment.bestTranslation}</p>
          </SegmentInspectorBlock>
        </section>

        <SegmentInspectorBlock label="AI evaluation" tone="evaluation">
          <p>{segment.evaluation}</p>
        </SegmentInspectorBlock>

        <SegmentInspectorBlock label="Notes" tone="notes">
          {segment.notes.length ? (
            <ul className="project-research__noteList">
              {segment.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : (
            <p className="project-research__quietText">No notes saved for this segment yet.</p>
          )}
        </SegmentInspectorBlock>

        <SegmentInspectorBlock label="Vocabulary" tone="vocabulary">
          {segment.vocabulary.length ? (
            <div className="project-research__vocabList">
              {segment.vocabulary.map((term) => (
                <article key={`${segment.id}-${term.arabic}`}>
                  <strong dir="rtl" lang="ar">{term.arabic}</strong>
                  <span>{term.transliteration}</span>
                  <p>{term.gloss}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="project-research__quietText">No vocabulary notes saved for this segment yet.</p>
          )}
        </SegmentInspectorBlock>

        <SegmentInspectorBlock label="Related segments" tone="related">
          <div className="project-research__relatedRow">
            {segment.relatedIds.map((id) => (
              <button key={id} type="button" onClick={() => onSelectSegment(id)}>
                Segment {id}
                <ExternalLink size={13} strokeWidth={2} />
              </button>
            ))}
          </div>
        </SegmentInspectorBlock>
      </div>

      <footer className="project-research__sourceActions">
        <button type="button" className="project-research__secondaryAction">
          <PenTool size={15} strokeWidth={2} />
          Create patch
        </button>
        <button type="button" className="project-research__secondaryAction is-muted" onClick={onClearSelection}>
          <X size={14} strokeWidth={2} />
          Clear selection
        </button>
        <button type="button" className="project-research__secondaryAction is-primary" onClick={onOpenStudy}>
          <BookOpen size={15} strokeWidth={2} />
          Open in study
        </button>
      </footer>
    </div>
  )
}

export function SourceReader(props) {
  return <SegmentInspector {...props} />
}

export function AskCompanion({ selectedSegment, citations, onSelectSegment }) {
  const [question, setQuestion] = useState('')
  const [hasAnswer, setHasAnswer] = useState(true)

  const submitQuestion = () => {
    if (question.trim()) {
      setHasAnswer(true)
      setQuestion('')
    }
  }

  return (
    <div className="project-research__companionView" data-debug-item="project_research_companion">
      <div className="project-research__companionBody">
        {hasAnswer ? (
          <article className="project-research__answerCard">
            <p>
              The city-condition issue appears in the Jumu’ah passage and the later outskirts ruling.
              Treat <span dir="rtl" lang="ar">مصر جامع</span> as a legal status, not just physical size.
            </p>
            <div className="project-research__citationRow" aria-label="Cited segments">
              {citations.map((id) => (
                <button key={id} type="button" onClick={() => onSelectSegment(id)}>
                  Segment {id}
                </button>
              ))}
            </div>
          </article>
        ) : (
          <div className="project-research__answerPlaceholder">
            <MessageSquareText size={24} strokeWidth={1.8} />
            <strong>Start with a project-level question.</strong>
            <span>Ask about a word, issue, mistake pattern, or translation choice.</span>
          </div>
        )}

        <div className="project-research__promptRow">
          <button type="button" onClick={() => setQuestion('Where did I struggle with city-condition terminology?')}>
            Weak terminology
          </button>
          <button type="button" onClick={() => setQuestion(`Explain segment ${selectedSegment?.id ?? '1.3'} in context.`)}>
            Explain selected
          </button>
        </div>

        <div className="project-research__askRow">
          <label className="project-research__askBox">
            <textarea
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value)
                if (!event.target.value.trim()) {
                  setHasAnswer(false)
                }
              }}
              placeholder="Ask about this project’s saved knowledge..."
              rows={2}
            />
          </label>
          <button type="button" className="project-research__askButton" onClick={submitQuestion}>
            <Sparkles size={15} strokeWidth={2} />
            Ask
          </button>
        </div>
      </div>
    </div>
  )
}

export function SourceReaderPanel({
  mode,
  selectedSegment,
  citations,
  onModeChange,
  onSelectSegment,
  onOpenStudy,
  onClearSelection,
}) {
  const openCitedSegment = (segmentId) => {
    onSelectSegment(segmentId)
    onModeChange('source')
  }

  return (
    <aside className="project-research project-research__rightWorkspace" data-debug-item="project_research_right_workspace">
      <section className={`project-research__panel project-research__rightPanel is-${mode}`}>
        <header className="project-research__rightHeader">
          <div className="project-research__rightTitleGroup">
            <div className="project-research__inspectorLabelRow">
              <p className="project-research__eyebrow">
                {mode === 'ask' ? 'Project companion' : 'Segment inspector'}
              </p>
              {mode === 'source' && selectedSegment ? (
                <StatusBadge tone={selectedSegment.statusTone}>{selectedSegment.status}</StatusBadge>
              ) : null}
            </div>
            <h2 className="project-research__sourceTitle">
              {mode === 'ask'
                ? 'Ask across the whole project'
                : selectedSegment
                  ? `${selectedSegment.id} · ${selectedSegment.heading}`
                  : 'No segment selected'}
            </h2>
            {mode === 'source' && selectedSegment ? (
              <p className="project-research__sourceMeta">{selectedSegment.chapter} · {selectedSegment.topic}</p>
            ) : (
              <p className="project-research__sourceMeta">Answers use saved project knowledge and cited segments.</p>
            )}
          </div>

          <div className="project-research__rightHeaderActions">
            {mode === 'ask' ? (
              <span className="project-research__companionIcon" aria-hidden="true">
                <BrainCircuit size={17} strokeWidth={2} />
              </span>
            ) : null}
            <div className="project-research__modeSwitch" aria-label="Right panel mode">
              <button
                type="button"
                className={mode === 'source' ? 'is-active' : ''}
                onClick={() => onModeChange('source')}
              >
                Details
              </button>
              <button
                type="button"
                className={mode === 'ask' ? 'is-active' : ''}
                onClick={() => onModeChange('ask')}
              >
                Ask
              </button>
            </div>
          </div>
        </header>

        <div className="project-research__rightBody">
          {mode === 'ask' ? (
            <AskCompanion selectedSegment={selectedSegment} citations={citations} onSelectSegment={openCitedSegment} />
          ) : (
            <SegmentInspector
              segment={selectedSegment}
              onSelectSegment={onSelectSegment}
              onOpenStudy={onOpenStudy}
              onClearSelection={onClearSelection}
            />
          )}
        </div>
      </section>
    </aside>
  )
}
