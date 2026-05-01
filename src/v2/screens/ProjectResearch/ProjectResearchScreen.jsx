import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  FileText,
  Layers3,
  ListFilter,
  MessageSquareText,
  PenTool,
  RotateCcw,
  Search,
  Sparkles,
} from 'lucide-react'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import PrimaryCTA from '../../foundation/primitives/PrimaryCTA'
import { colors, motion, radius, spacing, typography } from '../../foundation/tokens'
import layoutContract from './ProjectResearchScreen.contract'

const researchSegments = [
  {
    id: '1.3',
    chapter: 'Chapter 1: Purity',
    topic: 'Jumu’ah conditions',
    heading: 'Comprehensive city condition',
    arabic:
      'لا تصح الجمعة إلا في مصر جامع أو في مصلى المصر ولا تجوز في القرى لقوله ﷺ لا جمعة ولا تشريق ولا فطر ولا أضحى إلا في مصر جامع.',
    userTranslation:
      "Jumu'ah prayer is only valid in a comprehensive city or in the prayer area of the city. It is not permissible in villages.",
    bestTranslation:
      'The Friday prayer is only valid in a comprehensive city or in the city prayer-ground, not in villages. A comprehensive city is one with authority to establish judgments and public order.',
    evaluation:
      'Strong handling of the legal condition. Preserve the distinction between the main city and its attached outskirts, and keep attributed views clearly separated.',
    status: 'Needs revision',
    statusTone: 'review',
    tags: ['fiqh', 'validity', 'city-condition'],
    notes: ['Keep al-Karkhī and al-Thaljī views distinct.', 'Avoid making the ruling sound like a general recommendation.'],
    vocabulary: [
      { arabic: 'مصر جامع', transliteration: 'misr jāmiʿ', gloss: 'comprehensive city; a large urban centre with civic authority' },
      { arabic: 'أفنية', transliteration: 'afniyah', gloss: 'outskirts or attached surrounding areas' },
    ],
    relatedIds: ['1.2', '2.3'],
  },
  {
    id: '1.2',
    chapter: 'Chapter 1: Purity',
    topic: 'Water types',
    heading: 'Purifying water categories',
    arabic:
      'والماء الذي يجوز به الوضوء كل ماء نزل من السماء أو نبع من الأرض ما دام باقيا على أصل خلقته.',
    userTranslation:
      'Water that may be used for ablution is every water that descends from the sky or comes from the earth while remaining in its original nature.',
    bestTranslation:
      'Water valid for ablution is any water that falls from the sky or springs from the earth, so long as it remains upon its original created state.',
    evaluation:
      'Accurate overall. The phrase “original created state” should remain consistent across later water passages.',
    status: 'Completed',
    statusTone: 'ready',
    tags: ['purity', 'water', 'definition'],
    notes: ['Good candidate for a recurring terminology note.'],
    vocabulary: [
      { arabic: 'أصل خلقته', transliteration: 'aṣl khalqatih', gloss: 'its original created state' },
    ],
    relatedIds: ['1.1', '1.4'],
  },
  {
    id: '1.4',
    chapter: 'Chapter 1: Purity',
    topic: 'Tayammum',
    heading: 'Earth substitute when water is unavailable',
    arabic:
      'والتيمم جائز عند عدم الماء أو العجز عن استعماله بالصعيد الطاهر على الوجه المأمور به.',
    userTranslation:
      'Tayammum is permissible when water is absent or one cannot use it, with clean earth according to the instructed way.',
    bestTranslation:
      'Dry ablution is permitted when water is unavailable, or when one is unable to use it, using pure earth in the prescribed manner.',
    evaluation:
      'Readable and faithful. “Dry ablution” is user-friendly, but preserve the technical term in support notes where helpful.',
    status: 'Completed',
    statusTone: 'ready',
    tags: ['purity', 'substitution', 'tayammum'],
    notes: ['Consider surfacing this as a revision contrast with ablution passages.'],
    vocabulary: [
      { arabic: 'الصعيد الطاهر', transliteration: 'al-ṣaʿīd al-ṭāhir', gloss: 'pure earth or clean surface material' },
    ],
    relatedIds: ['1.2'],
  },
  {
    id: '2.1',
    chapter: 'Chapter 2: Prayer',
    topic: 'Prayer timing',
    heading: 'Beginning of the noon prayer window',
    arabic:
      'وأول وقت الظهر إذا زالت الشمس وآخره عند أبي حنيفة إذا صار ظل كل شيء مثليه سوى فيء الزوال.',
    userTranslation:
      'The first time of Zuhr is when the sun declines, and its end according to Abu Hanifa is when the shadow of everything is twice its length excluding the noon shadow.',
    bestTranslation:
      'The noon prayer begins when the sun passes its zenith. According to Abū Ḥanīfah, it ends when each object’s shadow reaches twice its length, excluding the zenith shadow.',
    evaluation:
      'Needs review around “zenith shadow”; the source distinguishes original shadow from the measured later shadow.',
    status: 'Weak area',
    statusTone: 'weak',
    tags: ['prayer', 'time', 'shadow'],
    notes: ['Repeated issue: technical measurements need a brief plain-English clarification.'],
    vocabulary: [
      { arabic: 'فيء الزوال', transliteration: 'fayʾ al-zawāl', gloss: 'the shadow present at zenith' },
    ],
    relatedIds: ['2.2'],
  },
  {
    id: '2.3',
    chapter: 'Chapter 2: Prayer',
    topic: 'Congregational conditions',
    heading: 'Public order and city authority',
    arabic:
      'والحكم غير مقصور على المصلى بل تجوز في جميع أفنية المصر لأنها بمنزلته في حوائج أهله.',
    userTranslation:
      'The ruling is not limited to the prayer area; rather, it is permissible throughout all the outskirts of the city because they are like it for the needs of its people.',
    bestTranslation:
      'The ruling is not confined to the prayer-ground; it applies throughout the city’s attached outskirts, because those areas share the city’s status in meeting the needs of its people.',
    evaluation:
      'This is a strong revision anchor for the Jumu’ah passage. It clarifies why attached outskirts can share the legal status of the city.',
    status: 'Completed',
    statusTone: 'ready',
    tags: ['fiqh', 'city-condition', 'related-ruling'],
    notes: ['Useful citation for explaining 1.3.'],
    vocabulary: [
      { arabic: 'حوائج أهله', transliteration: 'ḥawāʾij ahlih', gloss: 'the needs of its people' },
    ],
    relatedIds: ['1.3'],
  },
]

const researchFilters = [
  { id: 'all', label: 'All knowledge', icon: Layers3 },
  { id: 'segments', label: 'Segments', icon: FileText },
  { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen },
  { id: 'mistakes', label: 'Mistakes', icon: CircleAlert },
  { id: 'notes', label: 'Notes', icon: PenTool },
  { id: 'weak', label: 'Weak areas', icon: RotateCcw },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
]

const companionCitations = ['1.3', '2.3']

function getFilterCount(filterId) {
  if (filterId === 'all' || filterId === 'segments') {
    return researchSegments.length
  }

  if (filterId === 'vocabulary') {
    return researchSegments.reduce((total, segment) => total + segment.vocabulary.length, 0)
  }

  if (filterId === 'mistakes' || filterId === 'weak') {
    return researchSegments.filter((segment) => segment.statusTone === 'weak' || segment.statusTone === 'review').length
  }

  if (filterId === 'notes') {
    return researchSegments.reduce((total, segment) => total + segment.notes.length, 0)
  }

  if (filterId === 'completed') {
    return researchSegments.filter((segment) => segment.statusTone === 'ready').length
  }

  return 0
}

function normalizeSearchValue(value) {
  return value.trim().toLocaleLowerCase()
}

function getFilteredSegments(query, filterId) {
  const normalizedQuery = normalizeSearchValue(query)

  return researchSegments.filter((segment) => {
    const matchesFilter =
      filterId === 'all' ||
      filterId === 'segments' ||
      (filterId === 'vocabulary' && segment.vocabulary.length > 0) ||
      (filterId === 'mistakes' && segment.statusTone !== 'ready') ||
      (filterId === 'weak' && segment.statusTone !== 'ready') ||
      (filterId === 'notes' && segment.notes.length > 0) ||
      (filterId === 'completed' && segment.statusTone === 'ready')

    if (!matchesFilter) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    const searchable = [
      segment.id,
      segment.chapter,
      segment.topic,
      segment.heading,
      segment.arabic,
      segment.userTranslation,
      segment.bestTranslation,
      segment.evaluation,
      segment.status,
      ...segment.tags,
      ...segment.notes,
      ...segment.vocabulary.flatMap((term) => [term.arabic, term.transliteration, term.gloss]),
    ].join(' ')

    return normalizeSearchValue(searchable).includes(normalizedQuery)
  })
}

function getStatusClass(tone) {
  if (tone === 'ready') {
    return ' is-ready'
  }

  if (tone === 'weak') {
    return ' is-weak'
  }

  return ' is-review'
}

function ProjectResearchHeader({ selectedSegment, onOpenStudy }) {
  return (
    <header className="project-research__hero" data-debug-item="project_research_header">
      <div className="project-research__heroCopy">
        <p className="project-research__eyebrow">Research workspace</p>
        <h1 className="project-research__title">Al-Hidayah knowledge explorer</h1>
        <p className="project-research__lead">
          Search saved source, translations, notes, feedback, and recurring terms without leaving the project context.
        </p>
      </div>

      <div className="project-research__heroMeta" aria-label="Project research summary">
        <div className="project-research__metaCard">
          <strong>47</strong>
          <span>segments</span>
        </div>
        <div className="project-research__metaCard">
          <strong>12</strong>
          <span>vocabulary notes</span>
        </div>
        <div className="project-research__metaCard">
          <strong>3</strong>
          <span>weak areas</span>
        </div>
      </div>

      <div className="project-research__heroAction">
        <PrimaryCTA
          minWidth={184}
          height={48}
          icon={<BookOpen size={16} strokeWidth={2} />}
          endIcon={<ArrowRight size={16} strokeWidth={2.2} />}
          onClick={onOpenStudy}
          debugItem="project_research_open_study"
        >
          Study mode
        </PrimaryCTA>
        <p className="project-research__actionHint">Opens selected segment {selectedSegment?.id ?? ''}</p>
      </div>
    </header>
  )
}

function FilterRail({ activeFilter, onFilterChange }) {
  return (
    <aside className="project-research project-research__filterRail" data-debug-item="project_research_filter_rail">
      <section className="project-research__panel project-research__railPanel">
        <div className="project-research__panelHeader">
          <div>
            <p className="project-research__eyebrow">Project knowledge</p>
            <h2 className="project-research__panelTitle">Browse by intent.</h2>
          </div>
          <ListFilter size={18} strokeWidth={2} color={colors.accentStrong} />
        </div>

        <div className="project-research__filterList" role="list" aria-label="Research filters">
          {researchFilters.map((filter) => {
            const Icon = filter.icon
            const isActive = filter.id === activeFilter

            return (
              <button
                key={filter.id}
                type="button"
                className={`project-research__filterButton${isActive ? ' is-active' : ''}`}
                onClick={() => onFilterChange(filter.id)}
              >
                <span className="project-research__filterIcon">
                  <Icon size={15} strokeWidth={2} />
                </span>
                <span>{filter.label}</span>
                <strong>{getFilterCount(filter.id)}</strong>
              </button>
            )
          })}
        </div>
      </section>

      <section className="project-research__panel project-research__revisionPanel">
        <p className="project-research__eyebrow">Revision entry</p>
        <h2 className="project-research__panelTitle">Return to what needs attention.</h2>
        <div className="project-research__revisionStack">
          <button type="button" className="project-research__revisionButton">
            <span>
              <strong>Weak segments</strong>
              <small>3 saved review points</small>
            </span>
            <ArrowRight size={15} strokeWidth={2.2} />
          </button>
          <button type="button" className="project-research__revisionButton">
            <span>
              <strong>Recurring terms</strong>
              <small>City / validity / outskirts</small>
            </span>
            <ArrowRight size={15} strokeWidth={2.2} />
          </button>
          <button type="button" className="project-research__revisionButton">
            <span>
              <strong>Translation comparison</strong>
              <small>User vs best-in-class</small>
            </span>
            <ArrowRight size={15} strokeWidth={2.2} />
          </button>
        </div>
      </section>
    </aside>
  )
}

function SearchSurface({ query, activeFilter, rows, selectedSegmentId, onQueryChange, onFilterChange, onSelectSegment }) {
  return (
    <main className="project-research project-research__resultsPanel" data-debug-item="project_research_results">
      <section className="project-research__searchPanel">
        <div className="project-research__searchCopy">
          <p className="project-research__eyebrow">Project search</p>
          <h2>Find a passage, issue, term, or translation.</h2>
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
      </section>

      <div className="project-research__chipRow" aria-label="Fast filters">
        {researchFilters.slice(0, 6).map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`project-research__chip${activeFilter === filter.id ? ' is-active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <section className="project-research__tablePanel" aria-label="Saved project knowledge">
        <header className="project-research__tableHeader">
          <span>Segment</span>
          <span>Arabic extract</span>
          <span>Topic</span>
          <span>Translation preview</span>
          <span>Status</span>
          <span>Tags</span>
        </header>

        <div className="project-research__rowList">
          {rows.length ? rows.map((segment) => {
            const isSelected = segment.id === selectedSegmentId

            return (
              <button
                key={segment.id}
                type="button"
                className={`project-research__resultRow${isSelected ? ' is-selected' : ''}`}
                onClick={() => onSelectSegment(segment.id)}
              >
                <span className="project-research__segmentId">{segment.id}</span>
                <span className="project-research__arabicExtract" dir="rtl" lang="ar">{segment.arabic}</span>
                <span className="project-research__topicCell">
                  <strong>{segment.heading}</strong>
                  <small>{segment.chapter}</small>
                </span>
                <span className="project-research__translationPreview">{segment.bestTranslation}</span>
                <span className={`project-research__statusPill${getStatusClass(segment.statusTone)}`}>
                  {segment.status}
                </span>
                <span className="project-research__tagCell">
                  {segment.tags.slice(0, 2).map((tag) => (
                    <em key={tag}>{tag}</em>
                  ))}
                </span>
              </button>
            )
          }) : (
            <div className="project-research__emptyState">
              <FileText size={26} strokeWidth={1.8} />
              <strong>No matching project knowledge yet</strong>
              <span>Try a broader phrase, Arabic term, topic, or status filter.</span>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function DetailBlock({ label, children, tone = 'default', dir }) {
  return (
    <section className={`project-research__detailBlock is-${tone}`}>
      <p className="project-research__blockLabel">{label}</p>
      <div className="project-research__blockContent" dir={dir}>
        {children}
      </div>
    </section>
  )
}

function SegmentInspector({ segment, onSelectSegment, onOpenStudy }) {
  if (!segment) {
    return (
      <aside className="project-research project-research__inspectorPanel" data-debug-item="project_research_empty_inspector">
        <div className="project-research__emptyInspector">
          <Sparkles size={28} strokeWidth={1.8} />
          <h2>Select a segment to inspect.</h2>
          <p>Arabic source, translations, feedback, notes, and related records will appear here.</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="project-research project-research__inspectorPanel" data-debug-item="project_research_inspector">
      <section className="project-research__panel project-research__dossier">
        <header className="project-research__dossierHeader">
          <div>
            <p className="project-research__eyebrow">Selected segment</p>
            <h2 className="project-research__dossierTitle">{segment.id} · {segment.heading}</h2>
            <p className="project-research__dossierMeta">{segment.chapter} · {segment.topic}</p>
          </div>
          <span className={`project-research__statusPill${getStatusClass(segment.statusTone)}`}>{segment.status}</span>
        </header>

        <div className="project-research__dossierBody">
          <DetailBlock label="Arabic source" tone="source" dir="rtl">
            <p lang="ar" className="project-research__arabicFull">{segment.arabic}</p>
          </DetailBlock>

          <DetailBlock label="Your translation">
            <p>{segment.userTranslation}</p>
          </DetailBlock>

          <DetailBlock label="Best translation" tone="best">
            <p>{segment.bestTranslation}</p>
          </DetailBlock>

          <DetailBlock label="AI evaluation" tone="evaluation">
            <p>{segment.evaluation}</p>
          </DetailBlock>

          <section className="project-research__miniGrid">
            <div>
              <p className="project-research__blockLabel">Notes</p>
              <ul className="project-research__noteList">
                {segment.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="project-research__blockLabel">Vocabulary</p>
              <div className="project-research__vocabList">
                {segment.vocabulary.map((term) => (
                  <article key={term.arabic}>
                    <strong dir="rtl" lang="ar">{term.arabic}</strong>
                    <span>{term.transliteration}</span>
                    <p>{term.gloss}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section>
            <p className="project-research__blockLabel">Related segments</p>
            <div className="project-research__relatedRow">
              {segment.relatedIds.map((id) => (
                <button key={id} type="button" onClick={() => onSelectSegment(id)}>
                  {id}
                  <ExternalLink size={13} strokeWidth={2} />
                </button>
              ))}
            </div>
          </section>
        </div>

        <footer className="project-research__dossierActions">
          <button type="button" className="project-research__secondaryAction">
            <PenTool size={15} strokeWidth={2} />
            Create correction patch
          </button>
          <button type="button" className="project-research__secondaryAction" onClick={onOpenStudy}>
            <BookOpen size={15} strokeWidth={2} />
            Open in study
          </button>
        </footer>
      </section>
    </aside>
  )
}

function CompanionPanel({ selectedSegment, onSelectSegment }) {
  const [question, setQuestion] = useState('')
  const [hasAnswer, setHasAnswer] = useState(true)

  const submitQuestion = () => {
    if (question.trim()) {
      setHasAnswer(true)
      setQuestion('')
    }
  }

  return (
    <section className="project-research__panel project-research__companion" data-debug-item="project_research_companion">
      <header className="project-research__companionHeader">
        <span className="project-research__companionIcon" aria-hidden="true">
          <BrainCircuit size={18} strokeWidth={2} />
        </span>
        <div>
          <p className="project-research__eyebrow">Project companion</p>
          <h2>Ask across the whole project.</h2>
        </div>
      </header>

      <div className="project-research__companionBody">
        {hasAnswer ? (
          <article className="project-research__answerCard">
            <p>
              The city-condition issue appears in both the Jumu’ah condition passage and the later outskirts ruling.
              Treat <span dir="rtl" lang="ar">مصر جامع</span> as a legal status, not just a physical size.
            </p>
            <div className="project-research__citationRow" aria-label="Cited segments">
              {companionCitations.map((id) => (
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

        <label className="project-research__askBox">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask about this project’s saved knowledge..."
            rows={3}
          />
        </label>
        <button type="button" className="project-research__askButton" onClick={submitQuestion}>
          <Sparkles size={16} strokeWidth={2} />
          Ask companion
        </button>
      </div>
    </section>
  )
}

export default function ProjectResearchScreen({ route, shell }) {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedSegmentId, setSelectedSegmentId] = useState(researchSegments[0].id)

  const rows = useMemo(() => getFilteredSegments(query, activeFilter), [query, activeFilter])
  const selectedSegment = researchSegments.find((segment) => segment.id === selectedSegmentId) ?? rows[0] ?? null

  const selectSegment = (segmentId) => {
    setSelectedSegmentId(segmentId)
  }

  const openStudyMode = () => {
    shell.navigate('studyWorkspace')
  }

  const screenSlots = {
    Layer3_ProjectResearch_Header: (
      <ProjectResearchHeader selectedSegment={selectedSegment} onOpenStudy={openStudyMode} />
    ),
    Layer4_ProjectResearch_FilterRail: (
      <FilterRail activeFilter={activeFilter} onFilterChange={setActiveFilter} />
    ),
    Layer4_ProjectResearch_ResultSurface: (
      <SearchSurface
        query={query}
        activeFilter={activeFilter}
        rows={rows}
        selectedSegmentId={selectedSegment?.id}
        onQueryChange={setQuery}
        onFilterChange={setActiveFilter}
        onSelectSegment={selectSegment}
      />
    ),
    Layer4_ProjectResearch_DetailInspector: (
      <div className="project-research__rightStack">
        <SegmentInspector segment={selectedSegment} onSelectSegment={selectSegment} onOpenStudy={openStudyMode} />
        <CompanionPanel selectedSegment={selectedSegment} onSelectSegment={selectSegment} />
      </div>
    ),
  }

  const containerOverrides = {
    Layer2_ProjectResearch_Root: {
      style: {
        padding: `clamp(${spacing[16]}, 1.8vw, ${spacing[24]})`,
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

  .project-research__hero {
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) auto auto;
    align-items: center;
    gap: ${spacing[20]};
    padding: ${spacing[18]} ${spacing[20]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[32]};
    background:
      radial-gradient(circle at 72% 12%, rgba(37, 99, 235, 0.1), transparent 32%),
      linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(248, 251, 255, 0.82));
    box-shadow: 0 18px 46px rgba(15, 23, 42, 0.07);
  }

  .project-research__heroCopy {
    min-width: 0;
    display: grid;
    gap: ${spacing[8]};
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
    font-size: clamp(30px, 3vw, 44px);
    line-height: 0.98;
    letter-spacing: -0.035em;
    color: ${colors.textStrong};
  }

  .project-research__lead,
  .project-research__actionHint,
  .project-research__dossierMeta {
    margin: 0;
    color: ${colors.textSoft};
    font-family: ${typography.studySupportText.fontFamily};
  }

  .project-research__lead {
    max-width: 720px;
    font-size: 13.5px;
    line-height: 1.55;
  }

  .project-research__heroMeta {
    display: grid;
    grid-template-columns: repeat(3, minmax(92px, 1fr));
    gap: ${spacing[8]};
  }

  .project-research__metaCard {
    min-height: 62px;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: ${spacing[4]};
    padding: ${spacing[10]} ${spacing[12]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[24]};
    background: rgba(255, 255, 255, 0.72);
  }

  .project-research__metaCard strong {
    font-family: ${typography.studySectionTitle.fontFamily};
    font-size: 18px;
    line-height: 1;
    color: ${colors.textStrong};
  }

  .project-research__metaCard span,
  .project-research__actionHint {
    font-size: 11px;
    line-height: 1.35;
  }

  .project-research__heroAction {
    display: grid;
    justify-items: end;
    gap: ${spacing[8]};
  }

  .project-research__panel,
  .project-research__searchPanel,
  .project-research__tablePanel {
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[24]};
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.065);
  }

  .project-research__filterRail,
  .project-research__resultsPanel,
  .project-research__inspectorPanel,
  .project-research__rightStack {
    height: 100%;
    min-height: 0;
  }

  .project-research__filterRail,
  .project-research__rightStack {
    display: flex;
    flex-direction: column;
    gap: ${spacing[16]};
    overflow: hidden;
  }

  .project-research__railPanel,
  .project-research__revisionPanel,
  .project-research__dossier,
  .project-research__companion {
    min-height: 0;
    overflow: hidden;
  }

  .project-research__railPanel {
    flex: 1 1 55%;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
  }

  .project-research__revisionPanel {
    flex: 0 0 auto;
    display: grid;
    gap: ${spacing[14]};
    padding: ${spacing[18]};
  }

  .project-research__panelHeader {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${spacing[12]};
    padding: ${spacing[18]};
    border-bottom: 1px solid ${colors.lineSoft};
  }

  .project-research__panelTitle,
  .project-research__searchCopy h2,
  .project-research__companionHeader h2,
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
    gap: ${spacing[8]};
    padding: ${spacing[12]};
  }

  .project-research__filterButton,
  .project-research__revisionButton {
    width: 100%;
    border: 1px solid transparent;
    background: rgba(248, 251, 255, 0.66);
    color: ${colors.textBody};
    cursor: pointer;
    transition:
      border-color ${motion.micro},
      background ${motion.micro},
      color ${motion.micro},
      transform ${motion.micro};
  }

  .project-research__filterButton {
    min-height: 44px;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: ${spacing[10]};
    padding: ${spacing[10]} ${spacing[12]};
    border-radius: ${radius[16]};
    text-align: left;
    font-family: ${typography.studyControlLabel.fontFamily};
    font-size: 12.5px;
    line-height: 1;
    font-weight: 800;
  }

  .project-research__filterButton:hover,
  .project-research__filterButton.is-active,
  .project-research__revisionButton:hover {
    border-color: ${colors.lineStrong};
    background: ${colors.accentWash};
    color: ${colors.accentStrong};
    transform: translateY(-1px);
  }

  .project-research__filterIcon {
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${radius.pill};
    background: rgba(219, 234, 254, 0.7);
  }

  .project-research__filterButton strong {
    font-size: 11px;
    color: ${colors.textFaint};
  }

  .project-research__revisionStack {
    display: grid;
    gap: ${spacing[8]};
  }

  .project-research__revisionButton {
    min-height: 58px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: ${spacing[10]};
    padding: ${spacing[12]};
    border-radius: ${radius[16]};
    text-align: left;
  }

  .project-research__revisionButton span {
    display: grid;
    gap: ${spacing[4]};
  }

  .project-research__revisionButton strong {
    font-family: ${typography.studyControlLabel.fontFamily};
    font-size: 12.5px;
    line-height: 1.2;
  }

  .project-research__revisionButton small {
    color: ${colors.textSoft};
    font-size: 11.5px;
    line-height: 1.35;
  }

  .project-research__resultsPanel {
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr);
    gap: ${spacing[12]};
    overflow: hidden;
  }

  .project-research__searchPanel {
    display: grid;
    grid-template-columns: minmax(220px, 0.68fr) minmax(0, 1fr);
    align-items: center;
    gap: ${spacing[20]};
    padding: ${spacing[18]};
  }

  .project-research__searchCopy {
    display: grid;
    gap: ${spacing[4]};
  }

  .project-research__searchBox {
    min-height: 50px;
    display: flex;
    align-items: center;
    gap: ${spacing[12]};
    padding: 0 ${spacing[16]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius.pill};
    background: rgba(248, 251, 255, 0.92);
  }

  .project-research__searchBox input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: ${colors.textBody};
    font-family: ${typography.studyBody.fontFamily};
    font-size: 13.5px;
  }

  .project-research__searchBox input::placeholder {
    color: ${colors.textFaint};
  }

  .project-research__chipRow {
    min-width: 0;
    display: flex;
    gap: ${spacing[8]};
    overflow-x: auto;
    padding: 0 ${spacing[2]};
  }

  .project-research__chip,
  .project-research__secondaryAction,
  .project-research__relatedRow button,
  .project-research__promptRow button,
  .project-research__askButton {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing[8]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius.pill};
    background: rgba(255, 255, 255, 0.88);
    color: ${colors.textSoft};
    font-family: ${typography.studyControlLabel.fontFamily};
    font-size: 11.5px;
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
    min-height: 34px;
    padding: 0 ${spacing[14]};
    white-space: nowrap;
  }

  .project-research__chip:hover,
  .project-research__chip.is-active,
  .project-research__secondaryAction:hover,
  .project-research__relatedRow button:hover,
  .project-research__promptRow button:hover {
    border-color: ${colors.lineStrong};
    color: ${colors.accentStrong};
    background: ${colors.accentWash};
  }

  .project-research__tablePanel {
    min-height: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    overflow: hidden;
  }

  .project-research__tableHeader,
  .project-research__resultRow {
    display: grid;
    grid-template-columns: 64px minmax(180px, 1.05fr) minmax(150px, 0.72fr) minmax(190px, 1fr) minmax(110px, 0.52fr) minmax(116px, 0.58fr);
    gap: ${spacing[12]};
    align-items: center;
  }

  .project-research__tableHeader {
    padding: ${spacing[14]} ${spacing[16]};
    border-bottom: 1px solid ${colors.lineSoft};
    background: rgba(248, 251, 255, 0.88);
    color: ${colors.textFaint};
    font-family: ${typography.eyebrowLabel.fontFamily};
    font-size: 8.5px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 900;
  }

  .project-research__rowList {
    min-height: 0;
    overflow: auto;
    display: grid;
    align-content: start;
    padding: ${spacing[10]};
    gap: ${spacing[8]};
  }

  .project-research__resultRow {
    width: 100%;
    min-height: 88px;
    padding: ${spacing[12]};
    border: 1px solid transparent;
    border-radius: ${radius[16]};
    background: rgba(255, 255, 255, 0.64);
    color: ${colors.textBody};
    text-align: left;
    cursor: pointer;
    transition:
      background ${motion.micro},
      border-color ${motion.micro},
      box-shadow ${motion.micro},
      transform ${motion.micro};
  }

  .project-research__resultRow:hover,
  .project-research__resultRow.is-selected {
    background: rgba(239, 246, 255, 0.72);
    border-color: ${colors.lineStrong};
    box-shadow: 0 14px 32px rgba(37, 99, 235, 0.1);
  }

  .project-research__resultRow.is-selected {
    transform: translateY(-1px);
  }

  .project-research__segmentId {
    width: 42px;
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

  .project-research__arabicExtract {
    max-height: 52px;
    overflow: hidden;
    color: ${colors.textStrong};
    font-family: ${typography.studyArabicInline.fontFamily};
    font-size: 15.5px;
    line-height: 1.6;
    text-align: right;
  }

  .project-research__topicCell {
    min-width: 0;
    display: grid;
    gap: ${spacing[4]};
  }

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
    font-size: 11.5px;
    line-height: 1.45;
  }

  .project-research__translationPreview {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .project-research__statusPill {
    width: fit-content;
    min-height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 ${spacing[12]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius.pill};
    background: rgba(255, 255, 255, 0.84);
    color: ${colors.textSoft};
    font-family: ${typography.eyebrowLabel.fontFamily};
    font-size: 8.5px;
    line-height: 1;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 900;
    white-space: nowrap;
  }

  .project-research__statusPill.is-ready {
    border-color: rgba(22, 163, 74, 0.24);
    background: rgba(240, 253, 244, 0.9);
    color: ${colors.success};
  }

  .project-research__statusPill.is-review,
  .project-research__statusPill.is-weak {
    border-color: rgba(217, 119, 6, 0.26);
    background: rgba(255, 251, 235, 0.92);
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
    padding: 5px 8px;
    border-radius: ${radius.pill};
    background: rgba(219, 234, 254, 0.54);
    color: ${colors.textSoft};
    font-style: normal;
    font-size: 10.5px;
    line-height: 1;
  }

  .project-research__emptyState,
  .project-research__emptyInspector,
  .project-research__answerPlaceholder {
    min-height: 220px;
    display: grid;
    place-items: center;
    align-content: center;
    gap: ${spacing[10]};
    padding: ${spacing[24]};
    text-align: center;
    color: ${colors.textSoft};
  }

  .project-research__emptyState strong,
  .project-research__emptyInspector h2,
  .project-research__answerPlaceholder strong {
    color: ${colors.textStrong};
  }

  .project-research__inspectorPanel {
    overflow: hidden;
  }

  .project-research__dossier {
    flex: 1 1 58%;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
  }

  .project-research__dossierHeader,
  .project-research__companionHeader {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: ${spacing[14]};
    padding: ${spacing[18]};
    border-bottom: 1px solid ${colors.lineSoft};
    background: rgba(248, 251, 255, 0.82);
  }

  .project-research__dossierTitle {
    margin: ${spacing[4]} 0 0;
    font-family: ${typography.studySectionTitle.fontFamily};
    font-size: 16px;
    line-height: 1.25;
    color: ${colors.textStrong};
  }

  .project-research__dossierBody {
    min-height: 0;
    overflow: auto;
    display: grid;
    align-content: start;
    gap: ${spacing[12]};
    padding: ${spacing[14]};
  }

  .project-research__detailBlock {
    display: grid;
    gap: ${spacing[8]};
    padding: ${spacing[14]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[16]};
    background: rgba(255, 255, 255, 0.82);
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

  .project-research__arabicFull {
    color: ${colors.textStrong} !important;
    font-family: ${typography.studyArabicInline.fontFamily} !important;
    font-size: 17px !important;
    line-height: 1.8 !important;
    text-align: right;
  }

  .project-research__miniGrid {
    display: grid;
    gap: ${spacing[12]};
  }

  .project-research__noteList {
    margin: ${spacing[8]} 0 0;
    padding-inline-start: ${spacing[18]};
    color: ${colors.textBody};
    font-size: 12.5px;
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
    font-size: 12.5px;
    line-height: 1.45;
  }

  .project-research__relatedRow {
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing[8]};
    margin-top: ${spacing[8]};
  }

  .project-research__relatedRow button {
    min-height: 32px;
    padding: 0 ${spacing[12]};
  }

  .project-research__dossierActions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${spacing[8]};
    padding: ${spacing[14]};
    border-top: 1px solid ${colors.lineSoft};
    background: rgba(248, 251, 255, 0.82);
  }

  .project-research__secondaryAction {
    min-height: 40px;
    padding: 0 ${spacing[12]};
  }

  .project-research__companion {
    flex: 1 1 42%;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
  }

  .project-research__companionHeader {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
  }

  .project-research__companionIcon {
    width: 38px;
    height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${radius.pill};
    background: ${colors.accentWash};
    color: ${colors.accentStrong};
  }

  .project-research__companionBody {
    min-height: 0;
    overflow: auto;
    display: grid;
    align-content: start;
    gap: ${spacing[12]};
    padding: ${spacing[14]};
  }

  .project-research__answerCard {
    display: grid;
    gap: ${spacing[12]};
    padding: ${spacing[14]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[16]};
    background: linear-gradient(180deg, rgba(239, 246, 255, 0.86), rgba(255, 255, 255, 0.86));
  }

  .project-research__answerCard p {
    margin: 0;
    color: ${colors.textBody};
    font-size: 12.75px;
    line-height: 1.58;
  }

  .project-research__citationRow,
  .project-research__promptRow {
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing[8]};
  }

  .project-research__citationRow button,
  .project-research__promptRow button {
    min-height: 30px;
    padding: 0 ${spacing[10]};
  }

  .project-research__askBox {
    display: block;
  }

  .project-research__askBox textarea {
    width: 100%;
    min-height: 86px;
    resize: vertical;
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[16]};
    background: rgba(255, 255, 255, 0.9);
    color: ${colors.textBody};
    padding: ${spacing[12]};
    font-family: ${typography.studyBody.fontFamily};
    font-size: 13px;
    line-height: 1.45;
    outline: none;
  }

  .project-research__askBox textarea:focus {
    border-color: ${colors.lineStrong};
    box-shadow: 0 0 0 4px rgba(219, 234, 254, 0.72);
  }

  .project-research__askButton {
    min-height: 42px;
    color: ${colors.accentStrong};
    border-color: ${colors.lineStrong};
    background: ${colors.accentWash};
  }

  @media (max-width: 1280px) {
    .project-research__hero {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .project-research__heroMeta {
      display: none;
    }

    .project-research__tableHeader,
    .project-research__resultRow {
      grid-template-columns: 56px minmax(150px, 1fr) minmax(130px, 0.7fr) minmax(150px, 0.85fr) minmax(104px, 0.5fr);
    }

    .project-research__tableHeader span:last-child,
    .project-research__tagCell {
      display: none;
    }
  }
`
