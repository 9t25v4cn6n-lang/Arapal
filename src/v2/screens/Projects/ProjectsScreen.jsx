import { lazy, memo, Suspense, useCallback, useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  FolderOpen,
  ListChecks,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import UserText from '../../foundation/primitives/UserText'
import PrimaryCTA from '../../foundation/primitives/PrimaryCTA'
import { colors, elevation, motion, radius, spacing, typography } from '../../foundation/tokens'
import { compactControl } from '../../foundation/tokens/compactControl'
import layoutContract from './ProjectsScreen.contract'
import { useLiveLessons } from './liveProjectsData'
import { actions, navigation, select, useArchives } from '../../data'
import { setSegmentationIntent } from '../../foundation/primitives/segmentationFlowState'

const AdvancedOptionsPanel = lazy(() => import('./AdvancedOptionsPanel.jsx'))

const dashboardStyles = `
  .study-dashboard,
  .study-dashboard * {
    box-sizing: border-box;
  }

  .study-dashboard {
    min-width: 0;
    color: ${colors.textStrong};
    font-family: ${typography.bodyText.fontFamily};
  }

  .study-dashboard__eyebrow,
  .study-dashboard__metaLabel {
    margin: 0;
    font-family: ${typography.eyebrowLabel.fontFamily};
    font-size: ${typography.eyebrowLabel.fontSize};
    line-height: ${typography.eyebrowLabel.lineHeight};
    font-weight: ${typography.eyebrowLabel.fontWeight};
    letter-spacing: ${typography.eyebrowLabel.letterSpacing};
    text-transform: ${typography.eyebrowLabel.textTransform};
  }

  .study-dashboard__eyebrow {
    color: ${colors.accentStrong};
  }

  /* Hero mirrors the Figma composition: one editorial statement and one
     companion. The illustration owns no layout outside this container. */
  .study-dashboard__hero {
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(200px, 248px);
    align-items: center;
    gap: ${spacing[40]};
  }

  .study-dashboard__heroCopy {
    min-width: 0;
    display: grid;
    align-content: center;
    gap: ${spacing[8]};
  }

  .study-dashboard__heroTitle {
    margin: 0;
    font-family: ${typography.displayTitle.fontFamily};
    font-size: ${typography.displayTitle.fontSize};
    line-height: ${typography.displayTitle.lineHeight};
    font-weight: ${typography.displayTitle.fontWeight};
    letter-spacing: ${typography.displayTitle.letterSpacing};
    color: ${colors.textStrong};
  }

  .study-dashboard__heroSupport {
    max-width: 58ch;
    margin: 0;
    font-family: ${typography.supportSubtext.fontFamily};
    font-size: ${typography.supportSubtext.fontSize};
    line-height: ${typography.supportSubtext.lineHeight};
    color: ${colors.textSoft};
  }

  .study-dashboard__companionFrame {
    width: 100%;
    max-width: 248px;
    justify-self: center;
    transform-origin: center bottom;
    animation: arapal-companion-float 4.8s ease-in-out infinite;
    will-change: transform;
  }

  @keyframes arapal-companion-float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(-0.8deg); }
  }

  .study-dashboard__summaryGrid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${spacing[12]};
  }

  .study-dashboard__summaryMetric {
    min-height: 58px;
    display: flex;
    align-items: baseline;
    gap: ${spacing[12]};
    padding: ${spacing[12]} ${spacing[20]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[16]};
    background: ${colors.surfacePrimary};
  }

  .study-dashboard__summaryMetric strong {
    flex: 0 0 auto;
    font-family: ${typography.statValue.fontFamily};
    font-size: ${typography.statValue.fontSize};
    line-height: ${typography.statValue.lineHeight};
    font-weight: ${typography.statValue.fontWeight};
    color: ${colors.textStrong};
  }

  .study-dashboard__summaryMetric span {
    min-width: 0;
    font-family: ${typography.metaText.fontFamily};
    font-size: ${typography.metaText.fontSize};
    line-height: ${typography.metaText.lineHeight};
    color: ${colors.textSoft};
  }

  /* Left rail is one owner, matching the reference instead of cross-linking
     its rows to the detail column. This keeps content-driven height intact. */
  .study-dashboard__rail {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing[20]};
  }

  .study-dashboard__railHeader {
    min-width: 0;
    display: grid;
    gap: ${spacing[24]};
  }

  .study-dashboard__railIntro {
    display: grid;
    gap: ${spacing[8]};
  }

  .study-dashboard__railTitle,
  .study-dashboard__panelTitle {
    margin: 0;
    font-family: ${typography.sectionTitle.fontFamily};
    font-size: ${typography.sectionTitle.fontSize};
    line-height: ${typography.sectionTitle.lineHeight};
    font-weight: ${typography.sectionTitle.fontWeight};
    letter-spacing: ${typography.sectionTitle.letterSpacing};
    color: ${colors.textStrong};
  }

  .study-dashboard__supportText {
    margin: 0;
    font-family: ${typography.supportSubtext.fontFamily};
    font-size: ${typography.supportSubtext.fontSize};
    line-height: ${typography.supportSubtext.lineHeight};
    color: ${colors.textSoft};
  }

  .study-dashboard__search {
    min-height: 44px;
    display: flex;
    align-items: center;
    gap: ${spacing[12]};
    padding: 0 ${spacing[16]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[16]};
    background: ${colors.surfacePrimary};
    transition: border-color ${motion.micro}, box-shadow ${motion.micro};
  }

  .study-dashboard__search:focus-within {
    border-color: ${colors.lineStrong};
    box-shadow: 0 0 0 3px ${colors.accentWash};
  }

  .study-dashboard__search input {
    width: 100%;
    min-width: 0;
    align-self: stretch;
    border: 0;
    outline: 0;
    background: transparent;
    color: ${colors.textBody};
    font-family: ${typography.bodyText.fontFamily};
    font-size: ${typography.supportSubtext.fontSize};
  }

  .study-dashboard__search input::placeholder { color: ${colors.textSoft}; }

  .study-dashboard__lessonList {
    min-width: 0;
    display: grid;
    gap: ${spacing[12]};
  }

  .study-dashboard__lessonButton {
    width: 100%;
    min-width: 0;
    display: grid;
    gap: ${spacing[12]};
    padding: ${spacing[16]};
    border: 1px solid transparent;
    border-radius: ${radius[16]};
    background: rgba(255, 255, 255, 0.48);
    color: ${colors.textStrong};
    text-align: left;
    cursor: pointer;
    transition: border-color ${motion.micro}, box-shadow ${motion.panel}, background ${motion.micro}, transform ${motion.micro};
  }

  .study-dashboard__lessonButton:hover {
    border-color: ${colors.lineSoft};
    background: rgba(255, 255, 255, 0.82);
    transform: translateY(-1px);
  }

  .study-dashboard__lessonButton.is-active {
    border-color: ${colors.lineStrong};
    background: ${colors.surfacePrimary};
    box-shadow: ${elevation.rest};
  }

  .study-dashboard__lessonButton:focus-visible {
    outline: 2px solid ${colors.accentSoft};
    outline-offset: 2px;
  }

  .study-dashboard__lessonTop {
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: ${spacing[12]};
  }

  .study-dashboard__lessonText { min-width: 0; }

  .study-dashboard__lessonName {
    display: block;
    margin: 0 0 ${spacing[4]};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .study-dashboard__lessonSource,
  .study-dashboard__lessonMeta {
    display: block;
    margin: 0;
    font-family: ${typography.metaText.fontFamily};
    font-size: ${typography.metaText.fontSize};
    line-height: ${typography.metaText.lineHeight};
    color: ${colors.textSoft};
  }

  .study-dashboard__lessonSource {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .study-dashboard__statusDot {
    width: 8px;
    height: 8px;
    margin-top: ${spacing[4]};
    border-radius: ${radius.pill};
    background: ${colors.success};
  }

  .study-dashboard__statusDot.is-setup { background: ${colors.review}; }

  .study-dashboard__progressTrack,
  .study-dashboard__progressBar {
    height: 6px;
    overflow: hidden;
    border-radius: ${radius.pill};
    background: ${colors.accentMist};
  }

  .study-dashboard__progressFill,
  .study-dashboard__progressBar span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: ${colors.accentBase};
  }

  .study-dashboard__emptyResults {
    margin: 0;
    padding: ${spacing[20]} 0;
    color: ${colors.textSoft};
  }

  /* Detail is one self-contained vertical stack. Spacing mirrors the Figma
     hierarchy: title group -> 24px -> primary card -> 20px -> advanced. */
  .study-dashboard__detailStage {
    min-width: 0;
    display: grid;
    gap: ${spacing[20]};
  }

  .study-dashboard__primaryGroup {
    min-width: 0;
    display: grid;
    gap: ${spacing[24]};
  }

  .study-dashboard__intro {
    min-width: 0;
    display: grid;
    gap: ${spacing[8]};
  }

  .study-dashboard__title {
    margin: 0;
    color: ${colors.textStrong};
  }

  .study-dashboard__resumeCard {
    overflow: hidden;
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[24]};
    background: ${colors.surfacePrimary};
    box-shadow: ${elevation.rest};
  }

  .study-dashboard__resumeHero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: ${spacing[32]};
    padding: ${spacing[28]} ${spacing[28]} ${spacing[32]};
    background: radial-gradient(circle at 82% 18%, rgba(37, 99, 235, 0.08), transparent 34%);
  }

  .study-dashboard__resumeCopy {
    min-width: 0;
    display: grid;
    gap: ${spacing[16]};
  }

  .study-dashboard__readyPill,
  .study-dashboard__quietPill {
    width: fit-content;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing[8]};
    border-radius: ${radius.pill};
    font-family: ${typography.eyebrowLabel.fontFamily};
    font-size: ${typography.eyebrowLabel.fontSize};
    line-height: 1;
    font-weight: ${typography.eyebrowLabel.fontWeight};
    letter-spacing: ${typography.eyebrowLabel.letterSpacing};
    text-transform: ${typography.eyebrowLabel.textTransform};
    white-space: nowrap;
  }

  .study-dashboard__readyPill {
    min-height: ${compactControl.sm.heightPx}px;
    padding: 0 ${compactControl.sm.paddingXPx}px;
    background: rgba(22, 163, 74, 0.10);
    color: ${colors.successStrong};
  }

  .study-dashboard__readyPill.is-setup {
    background: rgba(217, 119, 6, 0.10);
    color: ${colors.reviewStrong};
  }

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
    max-width: 48ch;
    margin: ${spacing[8]} 0 0;
    font-family: ${typography.bodyText.fontFamily};
    font-size: ${typography.bodyText.fontSize};
    line-height: ${typography.bodyText.lineHeight};
    color: ${colors.textBody};
  }

  .study-dashboard__resumeAction {
    min-width: 0;
    display: grid;
    justify-items: end;
    gap: ${spacing[12]};
  }

  .study-dashboard__secondaryButton,
  .study-dashboard__ghostButton,
  .study-dashboard__historyButton {
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing[8]};
    padding: 0 ${spacing[16]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius.pill};
    background: ${colors.surfacePrimary};
    color: ${colors.textSoft};
    font-family: ${typography.controlLabel.fontFamily};
    font-size: ${typography.controlLabel.fontSize};
    line-height: ${typography.controlLabel.lineHeight};
    font-weight: ${typography.controlLabel.fontWeight};
    white-space: nowrap;
    cursor: pointer;
  }

  .study-dashboard__secondaryButton {
    min-height: 32px;
    padding-inline: ${spacing[8]};
    border-color: transparent;
    background: transparent;
  }

  .study-dashboard__secondaryButton:hover,
  .study-dashboard__ghostButton:hover,
  .study-dashboard__historyButton:hover {
    border-color: ${colors.lineStrong};
    color: ${colors.accentStrong};
  }

  .study-dashboard__resumeFooter {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border-top: 1px solid ${colors.lineSoft};
  }

  .study-dashboard__stat {
    min-width: 0;
    min-height: 96px;
    display: grid;
    align-content: center;
    gap: ${spacing[8]};
    padding: ${spacing[20]};
    border-right: 1px solid ${colors.lineSoft};
    background: rgba(255, 255, 255, 0.62);
  }

  .study-dashboard__stat:last-child { border-right: 0; }

  .study-dashboard__progressStat {
    display: grid;
    grid-template-columns: 54px minmax(0, 1fr);
    align-items: center;
    gap: ${spacing[16]};
  }

  .study-dashboard__progressRing {
    --progress: 0;
    position: relative;
    width: 54px;
    height: 54px;
    display: grid;
    place-items: center;
    border-radius: ${radius.pill};
    background: conic-gradient(${colors.accentBase} calc(var(--progress) * 1%), ${colors.accentMist} 0);
  }

  .study-dashboard__progressRing::before {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: inherit;
    background: ${colors.surfacePrimary};
  }

  .study-dashboard__progressRing span {
    position: relative;
    z-index: 1;
    font-family: ${typography.metaText.fontFamily};
    font-size: ${typography.metaText.fontSize};
    font-weight: 700;
    color: ${colors.textStrong};
  }

  .study-dashboard__metaLabel { color: ${colors.textSoft}; }

  .study-dashboard__statValue {
    margin: 0;
    font-family: ${typography.supportSubtext.fontFamily};
    font-size: ${typography.supportSubtext.fontSize};
    line-height: 1.4;
    font-weight: 600;
    color: ${colors.textBody};
  }

  .study-dashboard__disclosureCard {
    display: grid;
    gap: ${spacing[16]};
    padding: ${spacing[24]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[24]};
    background: rgba(255, 255, 255, 0.72);
  }

  .study-dashboard__disclosureHeader {
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[20]};
  }

  .study-dashboard__disclosureCopy {
    min-width: 0;
    display: grid;
    gap: ${spacing[4]};
  }

  .study-dashboard__advancedFallback {
    min-height: 94px;
    display: grid;
    place-items: center;
    border: 1px dashed ${colors.lineSoft};
    border-radius: ${radius[16]};
    color: ${colors.textSoft};
  }

  /* History drawer behavior remains the clean Git behavior. */
  .study-dashboard__historyRail {
    width: 100%;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .study-dashboard__historyRailButton {
    width: 54px;
    min-height: 220px;
    display: grid;
    place-items: center;
    gap: ${spacing[12]};
    padding: ${spacing[16]} ${spacing[8]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[32]};
    background: rgba(255, 255, 255, 0.82);
    color: ${colors.textSoft};
    cursor: pointer;
    transition: border-color ${motion.micro}, color ${motion.micro}, box-shadow ${motion.panel}, transform ${motion.micro};
  }

  .study-dashboard__historyRailButton:hover,
  .study-dashboard__historyRailButton:focus-visible {
    border-color: ${colors.lineStrong};
    color: ${colors.accentStrong};
    box-shadow: ${elevation.rest};
    transform: translateX(-2px);
    outline: none;
  }

  .study-dashboard__historyRailText {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-family: ${typography.eyebrowLabel.fontFamily};
    font-size: ${typography.eyebrowLabel.fontSize};
    line-height: 1;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: ${typography.eyebrowLabel.fontWeight};
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
    box-shadow: ${elevation.floating};
    backdrop-filter: blur(22px);
    transform: translateX(calc(100% + 32px));
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
    transition: transform ${motion.panel}, opacity ${motion.panel}, visibility ${motion.panel};
  }

  .study-dashboard__historyPanel.is-open {
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
    visibility: visible;
  }

  .study-dashboard__historyHeader {
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: ${spacing[16]};
    padding: ${spacing[20]} ${spacing[20]} ${spacing[16]};
    border-bottom: 1px solid ${colors.lineSoft};
  }

  .study-dashboard__historyHeading {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: ${spacing[12]};
  }

  .study-dashboard__historyIcon {
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${radius.pill};
    background: ${colors.accentWash};
    color: ${colors.accentStrong};
  }

  .study-dashboard__historyTitle {
    margin: 0;
    font-family: ${typography.sectionTitle.fontFamily};
    font-size: ${typography.sectionTitle.fontSize};
    line-height: ${typography.sectionTitle.lineHeight};
    font-weight: ${typography.sectionTitle.fontWeight};
    color: ${colors.textStrong};
  }

  .study-dashboard__historySubtitle {
    margin: ${spacing[4]} 0 0;
    color: ${colors.textSoft};
  }

  .study-dashboard__historySummary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${spacing[8]};
    padding: ${spacing[16]} ${spacing[20]};
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
    font-family: ${typography.statValue.fontFamily};
    font-size: ${typography.cardTitle.fontSize};
    line-height: 1;
    font-weight: ${typography.statValue.fontWeight};
    color: ${colors.textStrong};
  }

  .study-dashboard__historyStat span {
    font-family: ${typography.eyebrowLabel.fontFamily};
    font-size: ${typography.eyebrowLabel.fontSize};
    line-height: 1.1;
    letter-spacing: ${typography.eyebrowLabel.letterSpacing};
    text-transform: uppercase;
    color: ${colors.textSoft};
    font-weight: ${typography.eyebrowLabel.fontWeight};
  }

  .study-dashboard__historyBody {
    min-height: 0;
    padding: ${spacing[12]} ${spacing[12]} ${spacing[16]};
  }

  .study-dashboard__historyState {
    height: 100%;
    min-height: 120px;
    display: grid;
    place-items: center;
    gap: ${spacing[12]};
    padding: ${spacing[24]};
    text-align: center;
    color: ${colors.textSoft};
    font-family: ${typography.supportSubtext.fontFamily};
    font-size: ${typography.supportSubtext.fontSize};
    line-height: ${typography.supportSubtext.lineHeight};
  }

  .study-dashboard__virtualList {
    height: 100%;
    min-height: 0;
    overflow: auto;
    scrollbar-gutter: stable;
    position: relative;
  }

  .study-dashboard__virtualCanvas { position: relative; min-width: 0; }

  .study-dashboard__historyRow {
    position: absolute;
    left: 0;
    right: 0;
    min-height: 72px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: ${spacing[12]};
    align-items: center;
    margin: 0 ${spacing[4]};
    padding: ${spacing[12]};
    border: 1px solid transparent;
    border-radius: ${radius[16]};
    background: rgba(248, 251, 255, 0.72);
  }

  .study-dashboard__historyRow:hover {
    border-color: ${colors.lineSoft};
    background: rgba(255, 255, 255, 0.96);
  }

  .study-dashboard__historyRowTitle { display: block; margin: 0 0 ${spacing[4]}; color: ${colors.textStrong}; }
  .study-dashboard__historyRowCopy { display: block; margin: 0; color: ${colors.textSoft}; }
  .study-dashboard__rowMeta { min-width: 72px; display: grid; justify-items: end; gap: ${spacing[8]}; }

  .study-dashboard__quietPill {
    min-height: ${compactControl.sm.heightPx}px;
    padding: 0 ${compactControl.sm.paddingXPx}px;
    border: 1px solid ${colors.lineSoft};
    background: ${colors.surfacePrimary};
    color: ${colors.textSoft};
  }

  .study-dashboard__saveButton {
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius.pill};
    background: ${colors.surfacePrimary};
    color: ${colors.textFaint};
    cursor: pointer;
  }

  .study-dashboard__saveButton.is-saved { color: ${colors.accentStrong}; background: ${colors.accentWash}; }

  .study-dashboard__loadingCard {
    min-height: 260px;
    display: grid;
    place-items: center;
    gap: ${spacing[12]};
    padding: ${spacing[32]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[24]};
    background: rgba(255, 255, 255, 0.82);
    box-shadow: ${elevation.rest};
    text-align: center;
  }

  @media (prefers-reduced-motion: reduce) {
    .study-dashboard__companionFrame { animation: none; }
  }

  @media (max-width: 1180px) {
    .study-dashboard__resumeHero { grid-template-columns: 1fr; }
    .study-dashboard__resumeAction { justify-items: start; }
  }

  @media (max-width: 760px) {
    .study-dashboard__hero { grid-template-columns: 1fr; gap: ${spacing[20]}; }
    .study-dashboard__companionFrame { max-width: 180px; justify-self: start; }
    .study-dashboard__summaryGrid { grid-template-columns: 1fr; }
  }

  @media (max-width: 560px) {
    /* The companion is editorial decoration; at 390 it crowds the hero and has
       no room, so it steps aside like the history rail does. */
    .study-dashboard__companionFrame { display: none; }
    .study-dashboard__hero { gap: 0; }
    .study-dashboard__resumeHero { padding: ${spacing[24]}; }
    .study-dashboard__resumeFooter { grid-template-columns: 1fr; }
    .study-dashboard__stat { border-right: 0; border-bottom: 1px solid ${colors.lineSoft}; }
    .study-dashboard__stat:last-child { border-bottom: 0; }
    .study-dashboard__disclosureHeader { align-items: flex-start; flex-direction: column; }
    .study-dashboard__historyPanel {
      top: auto;
      left: 12px;
      right: 12px;
      bottom: 12px;
      width: auto;
      max-height: 78vh;
      border-radius: ${radius[24]};
      transform: translateY(calc(100% + 24px));
    }
    .study-dashboard__historyPanel.is-open { transform: translateY(0); }
  }
`

function getFilteredLessons(lessons, query) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return lessons

  return lessons.filter((lesson) => {
    const searchable = [lesson.title, lesson.sourceTitle, lesson.resumeLabel, ...(lesson.lessonTags ?? [])]
      .join(' ')
      .toLowerCase()
    return searchable.includes(normalizedQuery)
  })
}

function getSupportSummary(lesson) {
  const noteLabel = lesson.savedNoteCount === 1 ? 'note' : 'notes'
  const termLabel = lesson.savedVocabCount === 1 ? 'term' : 'terms'
  return `${lesson.savedNoteCount} ${noteLabel} / ${lesson.savedVocabCount} ${termLabel}`
}

// Projects is the find-and-manage library, not a second welcome screen — the
// mascot and the "Welcome back to your reading" ceremony are removed (Programme 2).
// Home owns returning; this header states what Projects is for.
function DashboardHero() {
  return (
    <section className="study-dashboard study-dashboard__hero" aria-label="Projects" data-debug-item="projects_hero">
      <div className="study-dashboard__heroCopy">
        <p className="study-dashboard__eyebrow">Projects</p>
        <h1 className="study-dashboard__heroTitle">Your projects.</h1>
        <p className="study-dashboard__heroSupport">Find a project and open it in Study, Research or Exams — or start a new source.</p>
      </div>
    </section>
  )
}

function LessonRail({ lessons, selectedLessonId, searchQuery, onSearchChange, onSelectLesson }) {
  const filteredLessons = useMemo(() => getFilteredLessons(lessons, searchQuery), [lessons, searchQuery])

  return (
    <aside className="study-dashboard study-dashboard__rail" data-debug-item="study_dashboard_lesson_rail">
      <div className="study-dashboard__railHeader">
        <div className="study-dashboard__railIntro">
          <div>
            <p className="study-dashboard__eyebrow">Library</p>
            <h2 className="study-dashboard__railTitle">Choose a project.</h2>
          </div>
          <p className="study-dashboard__supportText">Search your projects and open one to study, research or assess. Home is where you pick up where you left off.</p>
        </div>
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

      <nav className="study-dashboard__lessonList" aria-label="Lessons">
        {filteredLessons.map((lesson) => {
          const isActive = lesson.id === selectedLessonId
          return (
            <button
              key={lesson.id}
              type="button"
              className={`study-dashboard__lessonButton${isActive ? ' is-active' : ''}`}
              onClick={() => onSelectLesson(lesson.id)}
              aria-pressed={isActive}
            >
              <span className="study-dashboard__lessonTop">
                <span className="study-dashboard__lessonText">
                  <UserText className="study-dashboard__lessonName" text={lesson.title} />
                  <span className="study-dashboard__lessonSource">{lesson.sourceTitle}</span>
                </span>
                <span className={`study-dashboard__statusDot${lesson.status === 'setup' ? ' is-setup' : ''}`} aria-hidden="true" />
              </span>
              <span className="study-dashboard__lessonMeta">{lesson.resumeLabel}</span>
              <span className="study-dashboard__progressTrack" aria-hidden="true">
                <span className="study-dashboard__progressFill" style={{ width: `${lesson.progress}%` }} />
              </span>
            </button>
          )
        })}
        {!filteredLessons.length ? <p className="study-dashboard__emptyResults">No lessons match “{searchQuery}”.</p> : null}
      </nav>
    </aside>
  )
}

const ResumeStage = memo(function ResumeStage({ lesson, onResume, onBrowse }) {
  const primaryIcon = lesson.status === 'ready'
    ? <BookOpen size={16} strokeWidth={2} />
    : <ListChecks size={16} strokeWidth={2} />

  return (
    <section className="study-dashboard__resumeCard" data-debug-item="study_dashboard_resume_stage">
      <div className="study-dashboard__resumeHero">
        <div className="study-dashboard__resumeCopy">
          <span className={`study-dashboard__readyPill${lesson.status === 'ready' ? '' : ' is-setup'}`}>
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
            minWidth={250}
            height={54}
            icon={primaryIcon}
            endIcon={<ArrowRight size={16} strokeWidth={2.1} />}
            onClick={onResume}
            debugItem="study_dashboard_primary_resume"
          >
            {lesson.resumeLabel}
          </PrimaryCTA>
          <button type="button" className="study-dashboard__secondaryButton" onClick={onBrowse}>
            <FolderOpen size={15} strokeWidth={2} />
            Browse all work
          </button>
        </div>
      </div>

      <div className="study-dashboard__resumeFooter" aria-label="Lesson status">
        <div className="study-dashboard__stat study-dashboard__progressStat">
          <span className="study-dashboard__progressRing" style={{ '--progress': lesson.progress }} aria-hidden="true">
            <span>{lesson.progress}%</span>
          </span>
          <div>
            <p className="study-dashboard__metaLabel">Progress</p>
            <p className="study-dashboard__statValue">{lesson.progressLabel}</p>
          </div>
        </div>
        <div className="study-dashboard__stat">
          <p className="study-dashboard__metaLabel">Attention</p>
          <p className="study-dashboard__statValue">{lesson.suggestedReviewCount ? `${lesson.suggestedReviewCount} suggested checks` : 'No urgent checks'}</p>
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
          <p className="study-dashboard__supportText">{lesson.title} has source setup, segmentation, and preferences available when needed.</p>
        </div>
        <button type="button" className="study-dashboard__ghostButton" onClick={() => setIsOpen((current) => !current)}>
          <SlidersHorizontal size={15} strokeWidth={2} />
          {isOpen ? 'Hide advanced' : 'Show advanced'}
        </button>
      </div>

      {isOpen ? (
        <Suspense fallback={<div className="study-dashboard__advancedFallback">Loading advanced options...</div>}>
          <AdvancedOptionsPanel />
        </Suspense>
      ) : null}
    </section>
  )
}

function DashboardDetailIntro({ lesson }) {
  return (
    <section className="study-dashboard study-dashboard__intro" data-debug-item="study_dashboard_detail_intro">
      <p className="study-dashboard__eyebrow">{lesson.sourceTitle}</p>
      <UserText as="h1" className="study-dashboard__title" text={lesson.title} latinRole={typography.displayTitle} />
    </section>
  )
}

function DetailStage({ lesson, onResume, onBrowse, archiveCount = 0, onDelete, onRestore }) {
  return (
    <main className="study-dashboard study-dashboard__detailStage" data-debug-item="study_dashboard_workspace">
      <div className="study-dashboard__primaryGroup">
        <DashboardDetailIntro lesson={lesson} />
        <ResumeStage lesson={lesson} onResume={onResume} onBrowse={onBrowse} />
      </div>
      <AdvancedDisclosureContainer lesson={lesson} />
      <ProjectManageBar archiveCount={archiveCount} onDelete={onDelete} onRestore={onRestore} />
    </main>
  )
}

/**
 * The product-visible restore/delete policy (S3-001). Prior work replaced by a
 * re-segmentation is recoverable here, and any project — including the labelled
 * sample — can be deleted, honouring the first-run promise that the sample can
 * be removed at any time. Delete asks for confirmation because it is destructive.
 */
function ProjectManageBar({ archiveCount = 0, onDelete, onRestore }) {
  const [confirming, setConfirming] = useState(false)
  const linkStyle = {
    border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
    font: 'inherit', color: colors.textSoft, textDecoration: 'underline',
  }
  return (
    <div
      data-debug-item="project_manage_bar"
      style={{
        display: 'flex', alignItems: 'center', gap: spacing[16], flexWrap: 'wrap',
        marginTop: spacing[16], paddingTop: spacing[12],
        borderTop: `1px solid ${colors.borderSoft}`,
        ...typography.metaText,
      }}
    >
      {archiveCount > 0 ? (
        <button type="button" style={linkStyle} onClick={onRestore}>
          Restore previous work{archiveCount > 1 ? ` (${archiveCount} kept)` : ''}
        </button>
      ) : null}
      {confirming ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[12], color: colors.textBody }}>
          Delete this project and all its work?
          <button type="button" style={{ ...linkStyle, color: colors.critical, fontWeight: 600 }} onClick={onDelete}>Delete</button>
          <button type="button" style={linkStyle} onClick={() => setConfirming(false)}>Cancel</button>
        </span>
      ) : (
        <button type="button" style={linkStyle} onClick={() => setConfirming(true)}>Delete project</button>
      )}
    </div>
  )
}

export default function ProjectsScreen({ route, shell }) {
  const lessons = useLiveLessons()
  const [selectedLessonId, setSelectedLessonId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0] ?? null

  // Selecting a project in the library IS choosing the current project, so the
  // store follows the rail — otherwise Study/Research/Exams would open whatever
  // was current before, not what the user just picked here.
  const handleSelectLesson = useCallback((id) => {
    setSelectedLessonId(id)
    actions.selectProject(id)
  }, [])

  // Resume routes through the canonical handoff: select the project, then hand
  // Study the exact segment to open. A bare navigate (the previous behaviour)
  // dropped the identity and let Study fall back to segment 1.
  const handleResume = useCallback(() => {
    if (!selectedLesson) return
    actions.selectProject(selectedLesson.id)
    if (selectedLesson.status === 'ready') {
      const next = select.getProjectProgress(selectedLesson.id).nextSegment
      if (next) {
        navigation.resumeProject({ projectId: selectedLesson.id, segmentId: next.id, segmentRef: next.ref })
        return
      }
      shell.navigate('studyWorkspace')
      return
    }
    // A setup project resumes into re-segmentation of ITS OWN source, so mark
    // the intent (keeps this project's identity) — never a new project (S3-001).
    setSegmentationIntent('resegment')
    shell.navigate(selectedLesson.primaryRoute)
  }, [selectedLesson, shell])

  const handleBrowse = useCallback(() => {
    if (selectedLesson) actions.selectProject(selectedLesson.id)
    shell.navigate('projectResearch')
  }, [selectedLesson, shell])

  const archives = useArchives(selectedLesson?.id)
  const handleDelete = useCallback(() => {
    if (!selectedLesson) return
    actions.deleteProject(selectedLesson.id)
    setSelectedLessonId(null)
  }, [selectedLesson])
  const handleRestore = useCallback(() => {
    if (selectedLesson) actions.restoreArchive(selectedLesson.id)
  }, [selectedLesson])

  const screenSlots = {
    Layer4_Projects_Hero: <DashboardHero />,
    // Non-actionable aggregate metrics removed (Programme 2): counts that do not
    // change the next decision are noise above the library.
    Layer4_Projects_Summary: null,
    Layer4_Projects_LessonRail: lessons.length ? (
      <LessonRail
        lessons={lessons}
        selectedLessonId={selectedLesson?.id}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectLesson={handleSelectLesson}
      />
    ) : null,
    Layer4_Projects_DetailStage: selectedLesson ? (
      <DetailStage
        lesson={selectedLesson}
        onResume={handleResume}
        onBrowse={handleBrowse}
        archiveCount={archives.length}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />
    ) : (
      <EmptyLibrary
        onAddSource={() => { setSegmentationIntent('new'); shell.navigate('segmentationPasteNext') }}
        onGoHome={() => shell.navigate('projectHome')}
      />
    ),
    // Ephemeral Study History drawer removed (Programme 2): the durable study
    // record lives in Research; a second per-project history panel here had no
    // durable role.
    Layer4_Projects_History: null,
  }

  return (
    <>
      <style>{dashboardStyles}</style>
      <V2ScreenFrame contract={layoutContract} route={route} shell={shell} screenSlots={screenSlots} />
    </>
  )
}

/**
 * A genuinely empty library. The previous build had no such state: with no data
 * the detail stage showed a perpetual "Finding the next useful study action"
 * loader. An empty library is a real, common first-run condition and should say
 * so, with the one action that resolves it.
 */
function EmptyLibrary({ onAddSource, onGoHome }) {
  return (
    <section className="study-dashboard study-dashboard__loadingCard" data-debug-item="study_dashboard_empty">
      <FolderOpen size={24} strokeWidth={2} style={{ color: colors.accentStrong }} />
      <div style={{ display: 'grid', gap: spacing[8] }}>
        <p className="study-dashboard__eyebrow">No projects yet</p>
        <p className="study-dashboard__supportText" style={{ maxWidth: '46ch' }}>
          Add a source to create your first project, or return to Project Home to explore a labelled sample.
        </p>
        <div style={{ display: 'flex', gap: spacing[12], flexWrap: 'wrap', marginTop: spacing[8] }}>
          <PrimaryCTA onClick={onAddSource} minWidth={180}>Add a source</PrimaryCTA>
          <button type="button" className="study-dashboard__historyButton" onClick={onGoHome}>Project Home</button>
        </div>
      </div>
    </section>
  )
}
