import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Clock3,
  FolderOpen,
  History,
  ListChecks,
  Loader2,
  PanelRightClose,
  PanelRightOpen,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import useIsMobileViewport from '../../foundation/primitives/useIsMobileViewport'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import UserText from '../../foundation/primitives/UserText'
import PrimaryCTA from '../../foundation/primitives/PrimaryCTA'
import { colors, elevation, motion, radius, spacing, typography } from '../../foundation/tokens'
import { compactControl } from '../../foundation/tokens/compactControl'
import layoutContract from './ProjectsScreen.contract'
import { fetchLessons, fetchStudyHistory } from './studyDashboardData'
import { prefetchServerQuery, useServerQuery } from './useServerQuery'
import { useVirtualRows } from './useVirtualRows'

const AdvancedOptionsPanel = lazy(() => import('./AdvancedOptionsPanel.jsx'))

const dashboardStyles = `
  .study-dashboard,
  .study-dashboard * {
    box-sizing: border-box;
  }

  .study-dashboard {
    width: 100%;
    min-width: 0;
    min-height: 100%;
    color: ${colors.textStrong};
    font-family: ${typography.studyBody.fontFamily};
  }

  .study-dashboard__rail {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing[20]};
  }

  .study-dashboard__railHeader {
    display: grid;
    gap: ${spacing[12]};
    padding-bottom: ${spacing[16]};
    border-bottom: 1px solid ${colors.lineSoft};
  }

  .study-dashboard__eyebrow,
  .study-dashboard__metaLabel,
  .study-dashboard__smallLabel {
    margin: 0;
    font-family: ${typography.eyebrowLabel.fontFamily};
    letter-spacing: ${typography.eyebrowLabel.letterSpacing};
    text-transform: ${typography.eyebrowLabel.textTransform};
    font-weight: ${typography.eyebrowLabel.fontWeight};
  }

  .study-dashboard__eyebrow {
    font-size: ${typography.eyebrowLabel.fontSize};
    line-height: ${typography.eyebrowLabel.lineHeight};
    color: ${colors.accentBase};
  }

  .study-dashboard__railTitle,
  .study-dashboard__panelTitle,
  .study-dashboard__sectionTitle {
    margin: 0;
    font-family: ${typography.sectionTitle.fontFamily};
    font-weight: ${typography.sectionTitle.fontWeight};
    color: ${colors.textStrong};
  }

  .study-dashboard__railTitle {
    font-size: ${typography.sectionTitle.fontSize};
    line-height: ${typography.sectionTitle.lineHeight};
  }

  .study-dashboard__supportText,
  .study-dashboard__bodyText {
    margin: 0;
    font-family: ${typography.studySupportText.fontFamily};
    color: ${colors.textSoft};
  }

  .study-dashboard__supportText {
    font-size: 13px;
    line-height: 1.58;
  }

  .study-dashboard__bodyText {
    font-size: ${typography.supportSubtext.fontSize};
    line-height: ${typography.supportSubtext.lineHeight};
  }

  .study-dashboard__search {
    min-height: 44px;
    display: flex;
    align-items: center;
    gap: ${spacing[12]};
    padding: 0 ${spacing[16]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[24]};
    background: rgba(255, 255, 255, 0.82);
  }

  .study-dashboard__search input {
    width: 100%;
    min-width: 0;
    /* The whole 44px pill is the target, so the input has to BE the pill's
       height rather than a 23px line sitting inside it. Its height used to come
       from the inherited line-height, which meant the real hit area of the only
       search field in the product was a function of the document's default font
       size — it changed when that did. */
    align-self: stretch;
    height: auto;
    border: 0;
    outline: 0;
    background: transparent;
    color: ${colors.textBody};
    font-family: ${typography.bodyText.fontFamily};
    font-size: ${typography.supportSubtext.fontSize};
  }

  .study-dashboard__search input::placeholder {
    color: ${colors.textSoft};
  }

  .study-dashboard__lessonList {
    min-height: 0;
    overflow: auto;
    display: grid;
    gap: ${spacing[12]};
    padding-right: ${spacing[4]};
  }

  .study-dashboard__lessonButton {
    width: 100%;
    display: grid;
    gap: ${spacing[12]};
    padding: ${spacing[16]};
    border: 1px solid transparent;
    border-radius: ${radius[24]};
    background: rgba(255, 255, 255, 0.62);
    color: ${colors.textStrong};
    text-align: left;
    cursor: pointer;
    transition:
      border-color ${motion.panel},
      box-shadow ${motion.panel},
      background ${motion.panel},
      transform ${motion.micro};
  }

  .study-dashboard__lessonButton:hover,
  .study-dashboard__lessonButton.is-active {
    border-color: ${colors.lineStrong};
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 18px 38px rgba(15, 23, 42, 0.08);
    transform: translateY(-1px);
  }

  .study-dashboard__lessonTop {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: ${spacing[12]};
  }

  /* Layout only. The TYPE comes from UserText, because a lesson title is user
     content and its script is not known here. */
  .study-dashboard__lessonName {
    display: block;
    margin: 0 0 ${spacing[4]};
  }

  .study-dashboard__lessonSource,
  .study-dashboard__lessonMeta {
    display: block;
    margin: 0;
    font-family: ${typography.studySupportText.fontFamily};
    font-size: 12px;
    line-height: 1.45;
    color: ${colors.textSoft};
  }

  .study-dashboard__statusDot {
    width: 10px;
    height: 10px;
    border-radius: ${radius.pill};
    margin-top: 4px;
    background: ${colors.success};
    box-shadow: 0 0 0 6px rgba(22, 163, 74, 0.1);
  }

  .study-dashboard__statusDot.is-setup {
    background: ${colors.review};
    box-shadow: 0 0 0 6px rgba(217, 119, 6, 0.11);
  }

  .study-dashboard__progressTrack {
    height: 6px;
    overflow: hidden;
    border-radius: ${radius.pill};
    background: ${colors.accentMist};
  }

  .study-dashboard__progressFill {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, ${colors.accentBase}, ${colors.accentStrong});
  }

  .study-dashboard__stage {
    width: min(1120px, 100%);
    min-height: 100%;
    margin: 0 auto;
    display: grid;
    grid-template-rows: auto minmax(0, auto) auto;
    align-content: start;
    gap: ${spacing[20]};
  }

  .study-dashboard__intro {
    max-width: 760px;
    display: grid;
    gap: ${spacing[12]};
    padding-top: ${spacing[8]};
  }

  /* The detail pane's own heading, at the shared page-title role. It was a
     clamp resolving to 58px at the canonical frame: larger than the display
     size of any other screen in the product, for a line that said the same
     thing on every lesson. */
  .study-dashboard__title {
    margin: 0;
    color: ${colors.textStrong};
  }

  .study-dashboard__lead {
    max-width: 650px;
    margin: 0;
    font-family: ${typography.studyBody.fontFamily};
    font-size: 15px;
    line-height: 1.62;
    color: ${colors.textSoft};
  }

  .study-dashboard__resumeCard {
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[32]};
    background:
      radial-gradient(circle at 82% 18%, rgba(37, 99, 235, 0.1), transparent 34%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 251, 255, 0.92));
    box-shadow: ${elevation.rest};
    overflow: hidden;
  }

  /* After the base rule, because the base rule sets overflow: hidden and at equal
     specificity the later declaration wins. I placed this above it first and it
     did nothing — the same source-order mistake as the Study rail, made twice.

     The card is a grid item with overflow: hidden, so once its row is sized it
     cannot grow: at 390px it held 122px for 749px of in-flow content — the hero
     and the footer, including the resume action the card exists to offer — and
     hid 629px. Both children are static, so that is real content, not a
     decorative layer bleeding past its box. The clip keeps the gradient inside
     the rounded corners, which on a phone is worth less than the content. */
  @media (max-width: 560px) {
    .study-dashboard__resumeCard { overflow: visible; }
  }

  /* No min-height. It was 244px, chosen when the resume title rendered at 50px;
     once the title moved to the shared card-title role the floor stopped being
     a floor and became a void — 60px of empty card between the description and
     the stat row. A card's height is its content plus its padding. */
  .study-dashboard__resumeHero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: ${spacing[32]};
    padding: ${spacing[32]} ${spacing[32]} ${spacing[40]};
  }

  .study-dashboard__resumeCopy {
    display: grid;
    gap: ${spacing[16]};
    min-width: 0;
  }

  .study-dashboard__readyPill,
  .study-dashboard__quietPill {
    width: fit-content;
    display: inline-flex;
    align-items: center;
    gap: ${spacing[8]};
    border-radius: ${radius.pill};
    font-family: ${typography.eyebrowLabel.fontFamily};
    font-weight: ${typography.eyebrowLabel.fontWeight};
    letter-spacing: ${typography.eyebrowLabel.letterSpacing};
    text-transform: uppercase;
  }

  /* The compact-control sm step. It was a 36px pill — a height nothing else in
     the product uses — carrying an 11px label with 900 weight. */
  .study-dashboard__readyPill {
    min-height: ${compactControl.sm.heightPx}px;
    padding: 0 ${compactControl.sm.paddingXPx}px;
    background: ${colors.accentWash};
    color: ${colors.accentStrong};
    font-size: ${typography.eyebrowLabel.fontSize};
  }

  /* Subordinate to the pane title now that the pane has one. A 50px card title
     under a 58px page title was two display sizes competing inside one column;
     the card leads through its action and its accent, not through being large. */
  .study-dashboard__resumeTitle {
    margin: 0;
    font-family: ${typography.cardTitle.fontFamily};
    font-size: ${typography.cardTitle.fontSize};
    line-height: ${typography.cardTitle.lineHeight};
    font-weight: ${typography.cardTitle.fontWeight};
    letter-spacing: ${typography.cardTitle.letterSpacing};
    color: ${colors.textStrong};
  }

  .study-dashboard__resumeDetail {
    max-width: 640px;
    margin: 0;
    font-family: ${typography.bodyText.fontFamily};
    font-size: ${typography.bodyText.fontSize};
    line-height: ${typography.bodyText.lineHeight};
    color: ${colors.textBody};
  }

  .study-dashboard__resumeAction {
    display: grid;
    justify-items: end;
    gap: ${spacing[12]};
  }

  .study-dashboard__secondaryButton,
  .study-dashboard__ghostButton,
  .study-dashboard__historyButton {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing[8]};
    padding: 0 ${spacing[18]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius.pill};
    background: rgba(255, 255, 255, 0.88);
    color: ${colors.textSoft};
    font-family: ${typography.controlLabel.fontFamily};
    font-size: ${typography.controlLabel.fontSize};
    line-height: ${typography.controlLabel.lineHeight};
    font-weight: ${typography.controlLabel.fontWeight};
    /* A control's own label is an authored, finite string. "Show advanced" was
       breaking onto two lines inside its own pill. */
    white-space: nowrap;
    cursor: pointer;
    transition:
      border-color ${motion.micro},
      color ${motion.micro},
      box-shadow ${motion.micro},
      background ${motion.micro};
  }

  .study-dashboard__secondaryButton:hover,
  .study-dashboard__ghostButton:hover,
  .study-dashboard__historyButton:hover {
    border-color: ${colors.lineStrong};
    color: ${colors.accentStrong};
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  }

  /* Three cells, not four. The fourth was "Lesson · <lesson title>" — the same
     string the pane is now headed by, restated inside the card beneath it. */
  .study-dashboard__resumeFooter {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border-top: 1px solid ${colors.lineSoft};
  }

  .study-dashboard__stat {
    display: grid;
    gap: ${spacing[8]};
    padding: ${spacing[20]};
    border-right: 1px solid ${colors.lineSoft};
    background: rgba(255, 255, 255, 0.54);
  }

  .study-dashboard__stat:last-child {
    border-right: 0;
  }

  .study-dashboard__metaLabel {
    font-size: ${typography.eyebrowLabel.fontSize};
    line-height: 1.2;
    color: ${colors.textSoft};
  }

  .study-dashboard__statValue {
    margin: 0;
    font-family: ${typography.supportSubtext.fontFamily};
    font-size: ${typography.supportSubtext.fontSize};
    line-height: 1.35;
    font-weight: 600;
    color: ${colors.textBody};
  }

  .study-dashboard__progressBar {
    height: 8px;
    overflow: hidden;
    border-radius: ${radius.pill};
    background: ${colors.accentMist};
  }

  .study-dashboard__progressBar span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, ${colors.accentBase}, ${colors.accentStrong});
  }

  .study-dashboard__disclosureCard {
    display: grid;
    gap: ${spacing[18]};
    padding: ${spacing[24]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[24]};
    background: rgba(255, 255, 255, 0.78);
    box-shadow: 0 14px 34px rgba(15, 23, 42, 0.05);
  }

  .study-dashboard__disclosureHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[16]};
  }

  .study-dashboard__disclosureCopy {
    display: grid;
    gap: ${spacing[4]};
  }

  .study-dashboard__panelTitle {
    font-size: ${typography.supportSubtext.fontSize};
    line-height: 1.3;
  }

  .study-dashboard__advancedFallback {
    min-height: 94px;
    display: grid;
    place-items: center;
    border: 1px dashed ${colors.lineSoft};
    border-radius: ${radius[16]};
    color: ${colors.textSoft};
    font-family: ${typography.studySupportText.fontFamily};
    font-size: 13px;
  }

  .study-dashboard__historyRail {
    height: 100%;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* The history rail is a vertical tab pinned to the right edge. At 390px there
     is no edge to spare — it and its button pushed 36-50px outside the frame,
     and being chrome there was no scrolling to it. The history it opens is
     reachable from the dashboard itself, so on mobile the tab goes rather than
     the capability. */
  @media (max-width: 560px) {
    .study-dashboard__historyRail { display: none; }
  }

  .study-dashboard__historyRailButton {
    width: 58px;
    min-height: 240px;
    display: grid;
    place-items: center;
    gap: ${spacing[12]};
    padding: ${spacing[16]} ${spacing[8]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[32]};
    background: rgba(255, 255, 255, 0.82);
    color: ${colors.textSoft};
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
    cursor: pointer;
    transition:
      border-color ${motion.micro},
      color ${motion.micro},
      box-shadow ${motion.micro},
      transform ${motion.micro};
  }

  .study-dashboard__historyRailButton:hover,
  .study-dashboard__historyRailButton:focus-visible {
    border-color: ${colors.lineStrong};
    color: ${colors.accentStrong};
    box-shadow: 0 20px 42px rgba(37, 99, 235, 0.13);
    transform: translateX(-2px);
    outline: none;
  }

  .study-dashboard__historyRailText {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-family: ${typography.eyebrowLabel.fontFamily};
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 900;
  }

  .study-dashboard__historyPanel {
    position: fixed;
    z-index: 30;
    top: 88px;
    right: 24px;
    bottom: 24px;
    width: min(440px, calc(100vw - 48px));
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr);
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[32]};
    background: rgba(255, 255, 255, 0.96);
    box-shadow:
      0 26px 70px rgba(15, 23, 42, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.7) inset;
    backdrop-filter: blur(22px);
    transform: translateX(calc(100% + 32px));
    opacity: 0;
    pointer-events: none;
    /* The closed drawer was invisible but still laid out, still in the tab order
       and still in the accessibility tree — parked off-canvas by the transform.
       Tabbing past "Study history" walked a keyboard user into a drawer they
       could not see, with a Close button and a whole virtual list inside it. It
       was also the largest single block of viewport-escape findings in the
       product, 18 elements per frame, none of which were a layout fault.

       visibility, not display: it transitions discretely — flipping to visible
       at the start of the open and to hidden at the end of the close — so the
       panel animates exactly as before while genuinely leaving the page when
       shut. The inert attribute in the JSX states the same intent. */
    visibility: hidden;
    transition:
      transform ${motion.panel},
      opacity ${motion.panel},
      visibility ${motion.panel};
  }

  .study-dashboard__historyPanel.is-open {
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
    visibility: visible;
  }

  .study-dashboard__historyHeader {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: ${spacing[16]};
    padding: ${spacing[20]} ${spacing[20]} ${spacing[16]};
    border-bottom: 1px solid ${colors.lineSoft};
  }

  .study-dashboard__historyHeading {
    display: flex;
    align-items: center;
    gap: ${spacing[12]};
    min-width: 0;
  }

  .study-dashboard__historyIcon {
    width: 38px;
    height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${radius.pill};
    background: ${colors.accentWash};
    color: ${colors.accentStrong};
    flex: 0 0 auto;
  }

  .study-dashboard__historyTitle {
    margin: 0;
    font-family: ${typography.studySectionTitle.fontFamily};
    font-size: 16px;
    line-height: 1.25;
    color: ${colors.textStrong};
    font-weight: 800;
  }

  .study-dashboard__historySubtitle {
    margin: 2px 0 0;
    font-family: ${typography.studySupportText.fontFamily};
    font-size: 12px;
    line-height: 1.4;
    color: ${colors.textSoft};
  }

  .study-dashboard__historySummary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${spacing[8]};
    padding: ${spacing[14]} ${spacing[20]};
    border-bottom: 1px solid ${colors.lineSoft};
  }

  .study-dashboard__historyStat {
    display: grid;
    gap: ${spacing[4]};
    padding: ${spacing[12]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[16]};
    background: ${colors.surfaceSoft};
  }

  .study-dashboard__historyStat strong {
    font-family: ${typography.studySectionTitle.fontFamily};
    font-size: 18px;
    line-height: 1;
    color: ${colors.textStrong};
  }

  .study-dashboard__historyStat span {
    font-family: ${typography.eyebrowLabel.fontFamily};
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${colors.textSoft};
    font-weight: 900;
  }

  .study-dashboard__historyBody {
    min-height: 0;
    padding: ${spacing[12]} ${spacing[12]} ${spacing[16]};
  }

  .study-dashboard__historyState {
    height: 100%;
    display: grid;
    place-items: center;
    padding: ${spacing[24]};
    text-align: center;
    color: ${colors.textSoft};
    font-family: ${typography.studySupportText.fontFamily};
    font-size: 13px;
    line-height: 1.55;
  }

  .study-dashboard__virtualList {
    height: 100%;
    min-height: 0;
    overflow: auto;
    scrollbar-gutter: stable;
    position: relative;
  }

  .study-dashboard__virtualCanvas {
    position: relative;
    min-width: 0;
  }

  .study-dashboard__historyRow {
    position: absolute;
    left: 0;
    right: 0;
    min-height: 72px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: ${spacing[10]};
    align-items: center;
    margin: 0 ${spacing[4]};
    padding: ${spacing[12]} ${spacing[12]};
    border: 1px solid transparent;
    border-radius: ${radius[16]};
    background: rgba(248, 251, 255, 0.72);
  }

  .study-dashboard__historyRow:hover {
    border-color: ${colors.lineSoft};
    background: rgba(255, 255, 255, 0.96);
  }

  /* Layout and colour only; UserText owns the type. The size was also a
     hand-set 12.5px, off the ramp. */
  .study-dashboard__historyRowTitle {
    display: block;
    margin: 0 0 ${spacing[4]};
    color: ${colors.textStrong};
  }

  .study-dashboard__historyRowCopy {
    display: block;
    margin: 0;
    font-family: ${typography.studySupportText.fontFamily};
    font-size: 11.5px;
    line-height: 1.35;
    color: ${colors.textSoft};
  }

  .study-dashboard__rowMeta {
    display: grid;
    justify-items: end;
    gap: ${spacing[8]};
  }

  .study-dashboard__quietPill {
    min-height: 26px;
    padding: 0 ${spacing[10]};
    border: 1px solid ${colors.lineSoft};
    background: rgba(255, 255, 255, 0.82);
    color: ${colors.textSoft};
    font-size: 11px;
  }

  .study-dashboard__saveButton {
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius.pill};
    background: rgba(255, 255, 255, 0.82);
    color: ${colors.textFaint};
    cursor: pointer;
  }

  .study-dashboard__saveButton.is-saved {
    color: ${colors.accentStrong};
    background: ${colors.accentWash};
  }

  @media (max-width: 1080px) {
    .study-dashboard__resumeHero,
    .study-dashboard__resumeFooter {
      grid-template-columns: 1fr;
    }

    .study-dashboard__resumeAction {
      justify-items: start;
    }
  }

  @media (max-width: 760px) {
    .study-dashboard__stage {
      width: 100%;
    }

    .study-dashboard__title {
      font-size: 38px;
    }

    .study-dashboard__resumeHero {
      padding: ${spacing[24]};
    }

    .study-dashboard__historyPanel {
      top: auto;
      left: 12px;
      right: 12px;
      bottom: 12px;
      width: auto;
      max-height: 78vh;
      border-radius: ${radius[24]} ${radius[24]} ${radius[16]} ${radius[16]};
      transform: translateY(calc(100% + 24px));
    }

    .study-dashboard__historyPanel.is-open {
      transform: translateY(0);
    }
  }
`

const historyStatusLabels = {
  done: 'Done',
  'needs-review': 'Review',
}

function getFilteredLessons(lessons, query) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return lessons
  }

  return lessons.filter((lesson) => {
    const searchable = [lesson.title, lesson.sourceTitle, lesson.resumeLabel, ...lesson.lessonTags].join(' ').toLowerCase()
    return searchable.includes(normalizedQuery)
  })
}

function getSupportSummary(lesson) {
  const noteLabel = lesson.savedNoteCount === 1 ? 'note' : 'notes'
  const termLabel = lesson.savedVocabCount === 1 ? 'term' : 'terms'
  return `${lesson.savedNoteCount} ${noteLabel} / ${lesson.savedVocabCount} ${termLabel}`
}

function LessonRail({ lessons, selectedLessonId, searchQuery, onSearchChange, onSelectLesson }) {
  const filteredLessons = useMemo(() => getFilteredLessons(lessons, searchQuery), [lessons, searchQuery])

  return (
    <aside className="study-dashboard study-dashboard__rail" data-debug-item="study_dashboard_lesson_rail">
      <div className="study-dashboard__railHeader">
        <div>
          <p className="study-dashboard__eyebrow">Study dashboard</p>
          <h2 className="study-dashboard__railTitle">Pick up where you left off.</h2>
        </div>
        <p className="study-dashboard__supportText">
          Complexity stays out of the way. Choose a lesson, then resume the next useful study action.
        </p>
        <label className="study-dashboard__search">
          <Search size={16} strokeWidth={1.9} color={colors.textFaint} />
          <input
            aria-label="Search lessons"
            placeholder="Search lessons"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
      </div>

      <div className="study-dashboard__lessonList">
        {filteredLessons.map((lesson) => {
          const isActive = lesson.id === selectedLessonId

          return (
            <button
              key={lesson.id}
              type="button"
              className={`study-dashboard__lessonButton${isActive ? ' is-active' : ''}`}
              onClick={() => onSelectLesson(lesson.id)}
            >
              <span className="study-dashboard__lessonTop">
                <span>
                  <UserText className="study-dashboard__lessonName" text={lesson.title} />
                  <span className="study-dashboard__lessonSource">{lesson.sourceTitle}</span>
                </span>
                <span className={`study-dashboard__statusDot${lesson.status === 'setup' ? ' is-setup' : ''}`} />
              </span>
              <span className="study-dashboard__lessonMeta">{lesson.resumeLabel}</span>
              <span className="study-dashboard__progressTrack" aria-hidden="true">
                <span className="study-dashboard__progressFill" style={{ width: `${lesson.progress}%` }} />
              </span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

const ResumeStage = memo(function ResumeStage({ lesson, onResume, onBrowse }) {
  const primaryIcon = lesson.status === 'ready'
    ? <BookOpen size={17} strokeWidth={2} />
    : <ListChecks size={17} strokeWidth={2} />

  return (
    <section className="study-dashboard__resumeCard" data-debug-item="study_dashboard_resume_stage">
      <div className="study-dashboard__resumeHero">
        <div className="study-dashboard__resumeCopy">
          <span className="study-dashboard__readyPill">
            {lesson.status === 'ready' ? <CheckCircle2 size={14} strokeWidth={2} /> : <Clock3 size={14} strokeWidth={2} />}
            {lesson.statusLabel}
          </span>
          <div>
            <h2 className="study-dashboard__resumeTitle">{lesson.resumeLabel}</h2>
            <p className="study-dashboard__resumeDetail">{lesson.resumeDetail}</p>
          </div>
        </div>
        <div className="study-dashboard__resumeAction">
          <PrimaryCTA
            minWidth={260}
            height={58}
            icon={primaryIcon}
            endIcon={<ArrowRight size={17} strokeWidth={2.1} />}
            onClick={onResume}
            debugItem="study_dashboard_primary_resume"
          >
            {lesson.status === 'ready' ? 'Resume study' : 'Review setup'}
          </PrimaryCTA>
          <button type="button" className="study-dashboard__secondaryButton" onClick={onBrowse}>
            <FolderOpen size={15} strokeWidth={2} />
            Browse all work
          </button>
        </div>
      </div>

      {/* The "Lesson · <title>" cell is gone: the pane is headed by the lesson
          title now, so the card was restating it forty pixels below. */}
      <div className="study-dashboard__resumeFooter" aria-label="Lesson status">
        <div className="study-dashboard__stat">
          <p className="study-dashboard__metaLabel">Progress</p>
          <p className="study-dashboard__statValue">{lesson.progressLabel}</p>
          <span className="study-dashboard__progressBar" aria-hidden="true">
            <span style={{ width: `${lesson.progress}%` }} />
          </span>
        </div>
        <div className="study-dashboard__stat">
          <p className="study-dashboard__metaLabel">Attention</p>
          <p className="study-dashboard__statValue">
            {lesson.suggestedReviewCount ? `${lesson.suggestedReviewCount} suggested checks` : 'No urgent checks'}
          </p>
        </div>
        <div className="study-dashboard__stat">
          <p className="study-dashboard__metaLabel">Saved support</p>
          <p className="study-dashboard__statValue">{getSupportSummary(lesson)}</p>
        </div>
      </div>
    </section>
  )
})

function AdvancedDisclosureContainer({ lesson }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="study-dashboard__disclosureCard" data-debug-item="study_dashboard_advanced_disclosure">
      <div className="study-dashboard__disclosureHeader">
        <div className="study-dashboard__disclosureCopy">
          <p className="study-dashboard__eyebrow">Advanced options</p>
          <h2 className="study-dashboard__panelTitle">Setup details stay tucked away.</h2>
          <p className="study-dashboard__supportText">
            {lesson.title} has source setup, segmentation, and preferences available when needed.
          </p>
        </div>
        <button type="button" className="study-dashboard__ghostButton" onClick={() => setIsOpen((current) => !current)}>
          <SlidersHorizontal size={15} strokeWidth={2} />
          {isOpen ? 'Hide advanced' : 'Show advanced'}
        </button>
      </div>

      {isOpen ? (
        <Suspense
          fallback={(
            <div className="study-dashboard__advancedFallback">
              Loading advanced options only now...
            </div>
          )}
        >
          <AdvancedOptionsPanel />
        </Suspense>
      ) : null}
    </section>
  )
}

function StudyDashboardWorkspace({ lesson, shell }) {
  const handleResume = useCallback(() => {
    shell.navigate(lesson.primaryRoute)
  }, [lesson.primaryRoute, shell])

  const handleBrowse = useCallback(() => {
    shell.navigate('projectResearch')
  }, [shell])

  return (
    <main className="study-dashboard study-dashboard__stage" data-debug-item="study_dashboard_workspace">
      {/* The detail pane is headed by the LESSON, not by a slogan.
          It used to open with "YOUR STUDY TODAY / One clear next step." and
          three lines explaining the dashboard's own design philosophy — the
          same words whichever lesson was selected on the left. Two panes that
          never mention each other do not read as master and detail no matter
          how they are proportioned, which is why the split looked arbitrary:
          selecting a different lesson visibly changed nothing at the top of the
          pane that is supposed to be showing it. */}
      <section className="study-dashboard__intro">
        <p className="study-dashboard__eyebrow">{lesson.sourceTitle}</p>
        <UserText as="h1" className="study-dashboard__title" text={lesson.title} latinRole={typography.pageTitle} />
      </section>

      <ResumeStage lesson={lesson} onResume={handleResume} onBrowse={handleBrowse} />
      <AdvancedDisclosureContainer lesson={lesson} />
    </main>
  )
}

function VirtualizedHistoryTable({ rows, onToggleSaved }) {
  const listRef = useRef(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(420)
  const rowHeight = 78

  useEffect(() => {
    const node = listRef.current
    if (!node) {
      return undefined
    }

    const updateHeight = () => setViewportHeight(node.clientHeight)
    updateHeight()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateHeight)
      return () => window.removeEventListener('resize', updateHeight)
    }

    const observer = new ResizeObserver(updateHeight)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const virtualRows = useVirtualRows({
    itemCount: rows.length,
    rowHeight,
    viewportHeight,
    scrollTop,
    overscan: 8,
  })

  return (
    <div
      ref={listRef}
      className="study-dashboard__virtualList"
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      role="table"
      aria-rowcount={rows.length}
      aria-label="Study history"
    >
      <div className="study-dashboard__virtualCanvas" style={{ height: virtualRows.totalHeight }}>
        {virtualRows.items.map(({ index, offsetTop }) => {
          const row = rows[index]

          return (
            <article
              key={row.id}
              className="study-dashboard__historyRow"
              style={{ transform: `translateY(${offsetTop}px)` }}
              role="row"
              aria-rowindex={index + 1}
            >
              <div>
                <UserText className="study-dashboard__historyRowTitle" text={row.label} latinRole={typography.metaText} />
                <span className="study-dashboard__historyRowCopy">{row.detail}</span>
              </div>
              <div className="study-dashboard__rowMeta">
                <span className="study-dashboard__quietPill">
                  {historyStatusLabels[row.status]}
                </span>
                <button
                  type="button"
                  className={`study-dashboard__saveButton${row.saved ? ' is-saved' : ''}`}
                  aria-label={row.saved ? 'Unsave history item' : 'Save history item'}
                  onClick={() => onToggleSaved(row.id)}
                >
                  <Bookmark size={14} strokeWidth={2} fill={row.saved ? 'currentColor' : 'none'} />
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function StudyHistoryPanelContainer({ lesson }) {
  const [isOpen, setIsOpen] = useState(false)
  const historyQueryKey = useMemo(() => ['study-history', lesson.id], [lesson.id])
  const historyQueryFn = useCallback(() => fetchStudyHistory(lesson.id), [lesson.id])

  const prefetchHistory = useCallback(() => {
    prefetchServerQuery(historyQueryKey, historyQueryFn).catch(() => {})
  }, [historyQueryFn, historyQueryKey])

  const historyQuery = useServerQuery({
    queryKey: historyQueryKey,
    queryFn: historyQueryFn,
    enabled: isOpen,
  })

  const rows = historyQuery.data ?? []
  const completedCount = rows.filter((row) => row.kind === 'completed-segment').length
  const savedCount = rows.filter((row) => row.saved).length
  const reviewCount = rows.filter((row) => row.status === 'needs-review').length

  const openHistory = useCallback(() => {
    prefetchHistory()
    setIsOpen(true)
  }, [prefetchHistory])

  const closeHistory = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggleSaved = useCallback((rowId) => {
    historyQuery.updateData((currentRows = []) => currentRows.map((row) => (
      row.id === rowId ? { ...row, saved: !row.saved } : row
    )))
  }, [historyQuery])

  return (
    <aside className="study-dashboard study-dashboard__historyRail" data-debug-item="study_history_panel_container">
      <button
        type="button"
        className="study-dashboard__historyRailButton"
        onPointerEnter={prefetchHistory}
        onFocus={prefetchHistory}
        onClick={openHistory}
        aria-expanded={isOpen}
      >
        <History size={19} strokeWidth={2} />
        <span className="study-dashboard__historyRailText">Study history</span>
        <PanelRightOpen size={16} strokeWidth={2} />
      </button>

      <section
        className={`study-dashboard__historyPanel${isOpen ? ' is-open' : ''}`}
        aria-label="Study history panel"
        // Nothing inside a closed drawer is reachable — by keyboard, by screen
        // reader or by pointer. The CSS says the same thing; this says why.
        inert={!isOpen}
      >
        <header className="study-dashboard__historyHeader">
          <div className="study-dashboard__historyHeading">
            <span className="study-dashboard__historyIcon" aria-hidden="true">
              <History size={18} strokeWidth={2} />
            </span>
            <div>
              <h2 className="study-dashboard__historyTitle">Study history</h2>
              <UserText as="p" className="study-dashboard__historySubtitle" text={lesson.title} latinRole={typography.supportSubtext} />
            </div>
          </div>
          <button type="button" className="study-dashboard__historyButton" onClick={closeHistory}>
            <PanelRightClose size={15} strokeWidth={2} />
            Close
          </button>
        </header>

        <div className="study-dashboard__historySummary" aria-label="History summary">
          <div className="study-dashboard__historyStat">
            <strong>{completedCount}</strong>
            <span>Segments</span>
          </div>
          <div className="study-dashboard__historyStat">
            <strong>{savedCount}</strong>
            <span>Saved</span>
          </div>
          <div className="study-dashboard__historyStat">
            <strong>{reviewCount}</strong>
            <span>Review</span>
          </div>
        </div>

        <div className="study-dashboard__historyBody">
          {historyQuery.status === 'loading' ? (
            <div className="study-dashboard__historyState">
              <Loader2 size={22} strokeWidth={2} />
              Loading study history...
            </div>
          ) : historyQuery.status === 'error' ? (
            <div className="study-dashboard__historyState">
              History could not load. The dashboard remains usable; try opening this panel again.
            </div>
          ) : (
            <VirtualizedHistoryTable rows={rows} onToggleSaved={toggleSaved} />
          )}
        </div>
      </section>
    </aside>
  )
}

function LoadingDashboard() {
  return (
    <main className="study-dashboard study-dashboard__stage" data-debug-item="study_dashboard_loading">
      <section className="study-dashboard__intro">
        <p className="study-dashboard__eyebrow">Your study today</p>
        <h1 className="study-dashboard__title">Finding your next step.</h1>
        <p className="study-dashboard__lead">Loading the lightweight lesson state before any advanced data is requested.</p>
      </section>
      <section className="study-dashboard__disclosureCard">
        <div className="study-dashboard__historyState">
          <Loader2 size={22} strokeWidth={2} />
          Preparing dashboard...
        </div>
      </section>
    </main>
  )
}

export default function ProjectsScreen({ route, shell }) {
  const lessonsQueryKey = useMemo(() => ['lessons'], [])
  const lessonsQueryFn = useCallback(() => fetchLessons(), [])
  const lessonsQuery = useServerQuery({
    queryKey: lessonsQueryKey,
    queryFn: lessonsQueryFn,
    enabled: true,
  })

  const lessons = lessonsQuery.data ?? []
  const [selectedLessonId, setSelectedLessonId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0] ?? null
  const isMobile = useIsMobileViewport()

  const screenSlots = {
    Layer2_Body_ContentStartRail: lessons.length ? (
      <LessonRail
        lessons={lessons}
        selectedLessonId={selectedLesson?.id}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectLesson={setSelectedLessonId}
      />
    ) : null,
    Layer2_Body_ContentCenterField: selectedLesson ? (
      <StudyDashboardWorkspace lesson={selectedLesson} shell={shell} />
    ) : (
      <LoadingDashboard />
    ),
    Layer2_Body_ContentEndRail: selectedLesson ? <StudyHistoryPanelContainer key={selectedLesson.id} lesson={selectedLesson} /> : null,
  }

  const containerOverrides = {
    Layer2_Body_DefaultSplit: {
      // Master · detail · history.
      //
      // The master was minmax(300px, 3.2fr) against 8.2fr of detail — a ratio
      // of about 1:2.6, which is a sidebar next to a canvas, not two halves of
      // one relationship. The lesson index is the thing you navigate FROM and
      // it has to be scannable, so it gets a real floor (360px) and a bigger
      // share; the detail keeps the dominant share because it holds the primary
      // action, but no longer by so much that it reads as unrelated.
      //
      // A 360px master floor plus a 78px history rail does not fit a 390px
      // frame — the detail pane and the history rail were simply pushed off the
      // right edge, with no way to scroll to chrome. Below the mobile
      // breakpoint the master takes the frame and the other two collapse to
      // zero-width tracks, which is the same shape Study's mobile columns use.
      style: {
        gridTemplateColumns: isMobile
          ? 'minmax(0, 1fr) 0px 0px'
          : 'minmax(360px, 3.9fr) minmax(0, 7.4fr) minmax(78px, 0.7fr)',
      },
    },
    Layer2_Body_ContentStartRail: {
      style: {
        padding: `${spacing[24]} ${spacing[20]}`,
        overflow: 'hidden',
      },
    },
    // HIDDEN, not zero-width. A 0px grid track does not hide its children: they
    // keep their intrinsic widths and spill out of it, which is why the whole
    // dashboard rendered at x=430 — entirely off a 390px frame — while the
    // visible 390px lane held the master list. StudyWorkspacePrimitives records
    // this same lesson at its own mobile breakpoint; the rule did not travel.
    Layer2_Body_ContentCenterField: {
      style: isMobile
        ? { display: 'none' }
        : {
          padding: `${spacing[32]} ${spacing[40]} ${spacing[40]}`,
          overflow: 'auto',
        },
    },
    Layer2_Body_ContentEndRail: {
      style: isMobile
        ? { display: 'none' }
        : {
          padding: `${spacing[24]} ${spacing[12]}`,
          overflow: 'visible',
        },
    },
  }

  return (
    <>
      <style>{dashboardStyles}</style>
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
