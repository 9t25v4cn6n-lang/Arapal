import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  AlertTriangle,
  AlignCenter,
  AlignLeft,
  Award,
  Bold,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Info,
  Italic,
  Maximize2,
  Minimize2,
  MessageSquare,
  ScrollText,
  Send,
  Sparkles,
  Pin,
  Plus,
  Tag,
  X,
} from 'lucide-react'
import IconActionButton from './IconActionButton'
import PrimaryCTA from './PrimaryCTA'
import { colors, elevation, motion, radius, spacing, typography } from '../tokens'

const studyCss = `
  .study-v2,
  .study-v2 * {
    box-sizing: border-box;
  }

  .study-v2 {
    --study-accent: ${colors.accentBase};
    --study-accent-strong: ${colors.accentStrong};
    --study-accent-soft: ${colors.accentSoft};
    --study-accent-wash: ${colors.accentWash};
    --study-accent-mist: ${colors.accentMist};
    --study-surface: ${colors.surfacePrimary};
    --study-surface-soft: ${colors.surfaceSoft};
    --study-bg-top: ${colors.bgTop};
    --study-bg-bottom: ${colors.bgBottom};
    --study-text-strong: ${colors.textStrong};
    --study-text-body: ${colors.textBody};
    --study-text-soft: ${colors.textSoft};
    --study-text-faint: ${colors.textFaint};
    --study-line-soft: ${colors.lineSoft};
    --study-line-strong: ${colors.lineStrong};
    --study-success: ${colors.success};
    --study-review: ${colors.review};
    --study-radius-12: ${radius[12]};
    --study-radius-16: ${radius[16]};
    --study-radius-24: ${radius[24]};
    --study-pill: ${radius.pill};
    --study-space-4: ${spacing[4]};
    --study-space-8: ${spacing[8]};
    --study-space-12: ${spacing[12]};
    --study-space-16: ${spacing[16]};
    --study-space-20: ${spacing[20]};
    --study-space-24: ${spacing[24]};
    --study-space-28: 28px;
    --study-space-32: ${spacing[32]};
    --study-motion-micro: ${motion.micro};
    --study-motion-panel: ${motion.panel};
    --study-shadow-rest: ${elevation.rest};
    --study-shadow-raised: ${elevation.raised};
    --study-title-font: ${typography.studyPageTitle.fontFamily};
    --study-title-size: ${typography.studyPageTitle.fontSize};
    --study-title-line: ${typography.studyPageTitle.lineHeight};
    --study-title-weight: ${typography.studyPageTitle.fontWeight};
    --study-section-font: ${typography.studySectionTitle.fontFamily};
    --study-section-size: ${typography.studySectionTitle.fontSize};
    --study-section-line: ${typography.studySectionTitle.lineHeight};
    --study-section-weight: ${typography.studySectionTitle.fontWeight};
    --study-body-font: ${typography.studyBody.fontFamily};
    --study-body-size: ${typography.studyBody.fontSize};
    --study-body-line: ${typography.studyBody.lineHeight};
    --study-support-size: ${typography.studySupportText.fontSize};
    --study-support-line: ${typography.studySupportText.lineHeight};
    --study-arabic-font: ${typography.studyArabicSource.fontFamily};
    --study-arabic-size: ${typography.studyArabicSource.fontSize};
    --study-arabic-line: ${typography.studyArabicSource.lineHeight};
    --study-inline-arabic-size: ${typography.studyArabicInline.fontSize};
    --study-control-size: ${typography.studyControlLabel.fontSize};
    --study-control-line: ${typography.studyControlLabel.lineHeight};
    --study-control-weight: ${typography.studyControlLabel.fontWeight};
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    color: var(--study-text-strong);
    font-family: var(--study-body-font);
  }

  .study-v2__panel {
    height: auto;
    min-width: 0;
    min-height: 0;
    /* A card is a fixed header plus a body that gives way. Without this the
       panel kept its natural height, and when a parent compressed it the
       overflow:hidden below cut the content off instead of letting the body
       scroll. */
    display: flex;
    flex-direction: column;
    border: 1px solid var(--study-line-soft);
    border-radius: var(--study-radius-24);
    background: color-mix(in srgb, var(--study-surface) 96%, transparent);
    box-shadow:
      0 18px 44px var(--card-glow, color-mix(in srgb, var(--study-accent) 7%, transparent)),
      0 12px 34px color-mix(in srgb, var(--study-text-strong) 6%, transparent),
      0 3px 8px color-mix(in srgb, var(--study-text-strong) 4%, transparent),
      inset 0 0 0 1px color-mix(in srgb, var(--card-line, var(--study-line-soft)) 52%, transparent);
    overflow: hidden;
  }

  .study-v2__railPanel {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    border-radius: 0;
    border: 0;
    border-right: 1px solid var(--study-line-soft);
    background: color-mix(in srgb, var(--study-surface) 92%, transparent);
    backdrop-filter: blur(18px);
    overflow: hidden;
  }

  .study-v2__supportPanel {
    border-right: 0;
    border-left: 1px solid var(--study-line-soft);
    background: color-mix(in srgb, var(--study-surface-soft) 86%, transparent);
    position: relative;
  }

  .study-v2__supportPanel.is-collapsed,
  .study-v2__supportPanel.is-collapsed .study-v2__collapsedRailBody {
    overflow: visible;
  }

  .study-v2__railHeader,
  .study-v2__supportHeader {
    flex: 0 0 auto;
    min-height: calc(var(--study-space-24) + var(--study-space-24));
    padding: 0 var(--study-space-16);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--study-space-12);
    border-bottom: 1px solid color-mix(in srgb, var(--study-line-soft) 64%, transparent);
    color: var(--study-text-soft);
    font-size: var(--study-control-size);
    line-height: var(--study-control-line);
    font-weight: var(--study-control-weight);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .study-v2__railBody,
  .study-v2__supportBody {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    scrollbar-gutter: stable;
  }

  .study-v2__railBody {
    padding: var(--study-space-12) 0 var(--study-space-20);
  }

  .study-v2__supportBody {
    padding: var(--study-space-12);
    display: flex;
    flex-direction: column;
    gap: var(--study-space-16);
  }

  .study-v2__collapsedRailBody {
    padding: var(--study-space-12) var(--study-space-8);
    display: flex;
    flex-direction: column;
    gap: var(--study-space-12);
    align-items: center;
  }

  .study-v2__segmentRow,
  .study-v2__folderRow {
    width: 100%;
    min-width: 0;
    min-height: calc(var(--study-space-32) + var(--study-space-8));
    border: 0;
    background: transparent;
    color: var(--study-text-body);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: var(--study-space-8);
    padding: 0 var(--study-space-16);
    text-align: left;
    cursor: pointer;
    transition: background-color var(--study-motion-micro), color var(--study-motion-micro);
  }

  .study-v2__folderRow {
    margin-top: var(--study-space-4);
    color: var(--study-text-strong);
    font-weight: 700;
  }

  .study-v2__segmentRow:hover,
  .study-v2__folderRow:hover {
    background: color-mix(in srgb, var(--study-accent-wash) 54%, transparent);
  }

  .study-v2__segmentRow.is-active {
    background: color-mix(in srgb, var(--study-accent-wash) 86%, transparent);
    color: var(--study-accent-strong);
  }

  .study-v2__segmentState {
    width: var(--study-space-12);
    height: var(--study-space-12);
    border-radius: var(--study-pill);
    border: 1px solid color-mix(in srgb, var(--study-text-faint) 54%, transparent);
    background: var(--study-surface);
  }

  .study-v2__segmentState.is-active,
  .study-v2__segmentState.is-draft {
    border-color: var(--study-accent);
    background: var(--study-accent);
  }

  .study-v2__segmentState.is-submitted {
    border-color: var(--study-success);
    background: var(--study-success);
  }

  .study-v2__segmentState.is-failed {
    border-color: var(--study-review);
    background: var(--study-review);
  }

  .study-v2__segmentLabel {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--study-body-size);
    line-height: 1.2;
    font-weight: 500;
  }

  .study-v2__center {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    background: linear-gradient(180deg, color-mix(in srgb, var(--study-bg-top) 84%, transparent), color-mix(in srgb, var(--study-bg-bottom) 62%, transparent));
    overflow: hidden;
  }

  .study-v2__centerHeader {
    flex: 0 0 auto;
    min-width: 0;
    padding: var(--study-space-20) var(--study-space-24) var(--study-space-12);
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: var(--study-space-16);
    align-items: end;
    border-bottom: 1px solid color-mix(in srgb, var(--study-line-soft) 54%, transparent);
    background: color-mix(in srgb, var(--study-surface) 74%, transparent);
  }

  .study-v2__title {
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--study-space-12);
    min-width: 0;
    color: var(--study-text-strong);
    font-family: var(--study-title-font);
    font-size: var(--study-title-size);
    line-height: var(--study-title-line);
    font-weight: var(--study-title-weight);
    white-space: nowrap;
  }

  .study-v2__subtitleRow {
    margin-top: var(--study-space-8);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--study-space-12);
    padding-left: calc(var(--study-space-32) + var(--study-space-8));
  }

  .study-v2__subtext {
    margin: 0;
    color: var(--study-text-soft);
    font-size: var(--study-support-size);
    line-height: var(--study-support-line);
    font-weight: 500;
  }

  .study-v2__chip {
    min-height: calc(var(--study-space-24) + var(--study-space-4));
    border: 1px solid color-mix(in srgb, var(--study-line-soft) 76%, transparent);
    border-radius: var(--study-radius-12);
    background: color-mix(in srgb, var(--study-surface-soft) 90%, transparent);
    color: var(--study-text-body);
    display: inline-flex;
    align-items: center;
    gap: var(--study-space-8);
    padding: 0 var(--study-space-12);
    font-size: var(--study-control-size);
    line-height: var(--study-control-line);
    font-weight: 600;
  }

  .study-v2__shellContextBar {
    width: 100%;
    min-width: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0;
  }

  .study-v2__shellContextIdentity {
    min-width: 0;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: var(--study-space-16);
    justify-self: start;
  }

  .study-v2__shellBookMark {
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: var(--study-radius-14, 14px);
    background: color-mix(in srgb, var(--study-accent-wash) 52%, transparent);
    color: var(--study-accent-strong);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--study-accent-mist) 42%, transparent);
  }

  .study-v2__shellIdentity {
    min-width: 0;
    display: flex;
    align-items: center;
    min-height: 36px;
  }

  .study-v2__shellTitleLine {
    min-width: 0;
    display: flex;
    align-items: baseline;
    gap: var(--study-space-10, 10px);
  }

  .study-v2__shellTitleText {
    flex: 0 0 auto;
    color: var(--study-text-strong);
    font-family: var(--study-body-font);
    font-size: 19px;
    line-height: 1.08;
    font-weight: 845;
    letter-spacing: -0.024em;
    white-space: nowrap;
  }

  .study-v2__shellTitleDivider {
    width: 4px;
    height: 4px;
    border-radius: var(--study-pill);
    background: color-mix(in srgb, var(--study-text-faint) 72%, transparent);
    flex: 0 0 auto;
    transform: translateY(-2px);
  }

  .study-v2__shellProjectText {
    min-width: 0;
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    color: color-mix(in srgb, var(--study-text-body) 82%, var(--study-text-soft));
    font-family: var(--study-body-font);
    font-size: 14px;
    line-height: 1.14;
    font-weight: 635;
    letter-spacing: 0.01em;
    white-space: nowrap;
  }

  .study-v2__shellMetaLine {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: var(--study-space-8);
    color: var(--study-text-soft);
    font-size: var(--study-control-size);
    line-height: var(--study-control-line);
    font-weight: 650;
    white-space: nowrap;
    overflow: hidden;
  }

  .study-v2__shellMetaTag {
    display: inline-flex;
    align-items: center;
    gap: var(--study-space-6, 6px);
    min-width: 0;
  }

  .study-v2__shellMetaText {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .study-v2__shellDot {
    width: 3px;
    height: 3px;
    border-radius: var(--study-pill);
    background: color-mix(in srgb, var(--study-text-faint) 84%, transparent);
    flex: 0 0 auto;
  }

  .study-v2__shellMetaCluster {
    width: 100%;
    min-width: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--study-space-8);
  }

  .study-v2__shellRightInfo {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 2px;
    overflow: hidden;
  }

  .study-v2__shellRightMetaLine {
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--study-space-8);
    color: var(--study-text-soft);
    font-size: var(--study-control-size);
    line-height: 1.1;
    font-weight: 750;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .study-v2__shellCenterProgress {
    justify-self: center;
  }

  .study-v2__shellMetaCluster .study-v2__statusChip {
    background: transparent;
    border-color: transparent;
    box-shadow: none;
    padding: 0 var(--study-space-6, 6px);
  }

  .study-v2__shellProgress {
    width: 320px;
    max-width: 32vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--study-space-6, 6px);
    padding: 0;
    color: var(--study-text-body);
    white-space: nowrap;
  }

  .study-v2__shellProgressLabel {
    color: var(--study-text-body);
    font-size: var(--study-control-size);
    line-height: var(--study-control-line);
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .study-v2__shellProgressBars {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .study-v2__shellProgressBar {
    width: clamp(46px, 3.6vw, 54px);
    height: 6px;
    border-radius: var(--study-pill);
    background: color-mix(in srgb, var(--study-accent-mist) 38%, var(--study-line-soft));
    transition: background-color var(--study-motion-panel), transform var(--study-motion-panel), opacity var(--study-motion-panel);
  }

  .study-v2__shellProgressBar.is-active {
    background: linear-gradient(90deg, var(--study-accent), var(--study-accent-strong));
    transform: scaleY(1.06);
  }

  .study-v2__shellFocusButton {
    min-height: 36px;
    border: 1px solid color-mix(in srgb, var(--study-line-soft) 74%, transparent);
    border-radius: var(--study-radius-14, 14px);
    background: color-mix(in srgb, var(--study-surface) 72%, transparent);
    color: var(--study-text-body);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--study-space-8);
    padding: 0 var(--study-space-12);
    font-size: 13px;
    line-height: var(--study-control-line);
    font-weight: 720;
    cursor: pointer;
    white-space: nowrap;
    box-shadow: none;
    transition:
      background-color var(--study-motion-micro),
      border-color var(--study-motion-micro),
      color var(--study-motion-micro),
      box-shadow var(--study-motion-micro);
  }

  .study-v2__shellFocusButton:hover {
    border-color: color-mix(in srgb, var(--study-accent-mist) 82%, transparent);
    background: color-mix(in srgb, var(--study-accent-wash) 48%, var(--study-surface));
    color: var(--study-accent-strong);
  }

  .study-v2__shellFocusButton.is-active {
    background: var(--study-accent);
    border-color: var(--study-accent);
    color: #ffffff;
  }

  .study-v2__statusCluster {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: var(--study-space-8);
  }

  .study-v2__statusChip {
    min-height: calc(var(--study-space-24) + var(--study-space-8));
    border: 1px solid var(--status-border);
    border-radius: var(--study-pill);
    background: var(--status-bg);
    color: var(--status-text);
    display: inline-flex;
    align-items: center;
    gap: var(--study-space-8);
    padding: 0 var(--study-space-12);
    font-size: var(--study-control-size);
    line-height: var(--study-control-line);
    font-weight: var(--study-control-weight);
    white-space: nowrap;
  }

  .study-v2__debugCluster {
    display: inline-flex;
    align-items: center;
    gap: var(--study-space-4);
  }

  .study-v2__debugButton {
    min-height: calc(var(--study-space-24) + var(--study-space-4));
    border: 1px solid var(--study-line-soft);
    border-radius: var(--study-radius-12);
    background: var(--study-surface);
    color: var(--study-text-soft);
    padding: 0 var(--study-space-12);
    font-size: var(--study-control-size);
    font-weight: 700;
    cursor: pointer;
  }

  .study-v2__scroll {
    min-width: 0;
    min-height: 0;
    overflow: auto;
    padding: var(--study-space-16) 20% var(--study-space-24);
    scrollbar-gutter: stable;
  }

  .study-v2__workLane {
    width: 100%;
    max-width: 980px;
    min-height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--study-space-20);
    transition: max-width var(--study-motion-panel);
  }

  .study-v2__workLane.is-focused {
    width: 100%;
    max-width: 1180px;
  }

  .study-v2__workLane.is-discussing {
    width: 100%;
    max-width: 1400px;
  }

  .study-v2__studyStack {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--study-space-20);
  }

  .study-v2__composer {
    width: 100%;
    min-width: 0;
    display: grid;
    min-height: 100%;
    grid-template-columns: minmax(0, 1fr) 0px;
    /* The source and lexicography rows were auto-sized, so a long Arabic
       passage — which wraps to more lines as the centre column narrows — grew
       past the frame and pushed into its neighbours instead of the card
       scrolling. Both rows now have a floor of zero so they yield; the source
       card scrolls internally, which is what its scroll affordance is for. */
    grid-template-rows: minmax(0, auto) minmax(0, auto) minmax(0, 1fr) auto;
    grid-template-areas:
      "source companion"
      "lex companion"
      ". companion"
      "editor companion";
    align-items: stretch;
    column-gap: 0;
    row-gap: var(--study-space-20);
    transition:
      grid-template-columns var(--study-motion-panel),
      column-gap var(--study-motion-panel),
      row-gap var(--study-motion-panel);
  }

  .study-v2__composer.is-discussing {
    grid-template-columns: minmax(0, 1.18fr) minmax(340px, 0.82fr);
    grid-template-rows: auto minmax(360px, 1fr);
    grid-template-areas:
      "source source"
      "editor companion";
    min-height: clamp(690px, calc(100vh - 190px), 860px);
    column-gap: var(--study-space-20);
    align-items: stretch;
  }

  .study-v2__composerSource {
    grid-area: source;
    min-width: 0;
    min-height: 0;
    /* Clipping the wrapper only moved the problem: the card was cut instead of
       overflowing. The wrapper is a column so the card fits the row exactly and
       its own body does the scrolling. */
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .study-v2__composerSource > * {
    min-height: 0;
    flex: 1 1 auto;
    transition: transform var(--study-motion-panel), opacity var(--study-motion-panel);
  }

  .study-v2__composerLex {
    grid-area: lex;
    min-width: 0;
    overflow: hidden;
    max-height: 160px;
    opacity: 1;
    transform: translateY(0);
    transition:
      max-height 180ms cubic-bezier(0.4, 0, 0.2, 1),
      opacity 180ms cubic-bezier(0.4, 0, 0.2, 1),
      transform 180ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .study-v2__composer.is-discussing .study-v2__composerLex {
    display: none;
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
  }

  .study-v2__composerEditor {
    grid-area: editor;
    min-width: 0;
    min-height: 0;
    align-self: end;
    transition:
      transform var(--study-motion-panel),
      opacity var(--study-motion-panel);
  }

  .study-v2__composerCompanion {
    grid-area: companion;
    min-height: 0;
    min-width: 0;
    align-self: stretch;
    opacity: 0;
    transform: translateX(28px);
    pointer-events: none;
    transition:
      opacity 220ms cubic-bezier(0.2, 0.8, 0.2, 1) 70ms,
      transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1) 70ms;
  }

  .study-v2__composer.is-discussing .study-v2__composerCompanion {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
  }

  .study-v2__composerCompanion > .study-v2__discussion {
    height: 100%;
    min-height: 0;
  }

  .study-v2__composer.is-discussing .study-v2__composerEditor {
    align-self: stretch;
  }

  .study-v2__composer.is-discussion-closing .study-v2__composerCompanion {
    opacity: 0;
    transform: translateX(18px);
    transition-delay: 0ms;
  }

  .study-v2__sourceGroup {
    display: flex;
    flex-direction: column;
    gap: var(--study-space-4);
  }

  .study-v2__navRow {
    min-height: var(--study-space-32);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--study-space-4);
    margin-bottom: 0;
  }

  .study-v2__quietButton {
    min-height: var(--study-space-32);
    border: 0;
    background: transparent;
    color: var(--study-text-body);
    display: inline-flex;
    align-items: center;
    gap: var(--study-space-8);
    padding: var(--study-space-4);
    font-size: var(--study-control-size);
    font-weight: 600;
    cursor: pointer;
  }

  .study-v2__quietButton:disabled {
    opacity: 0.36;
    cursor: not-allowed;
  }

  .study-v2__cardHeader {
    /* The header keeps its size; the body is what yields. */
    flex: 0 0 auto;
    min-height: calc(var(--study-space-32) + var(--study-space-24));
    padding: 0 var(--study-space-24);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--study-space-16);
    border-bottom: 1px solid color-mix(in srgb, var(--card-line, var(--study-line-soft)) 70%, transparent);
    background: var(--card-bg, color-mix(in srgb, var(--study-accent-wash) 36%, var(--study-surface)));
  }

  .study-v2__cardTitleRow {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: var(--study-space-12);
  }

  .study-v2__badge {
    min-width: calc(var(--study-space-20) + var(--study-space-8));
    height: calc(var(--study-space-20) + var(--study-space-8));
    border-radius: var(--study-radius-12);
    background: var(--badge-bg, var(--study-accent-mist));
    color: var(--badge-text, var(--study-accent-strong));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 var(--study-space-8);
    flex: 0 0 auto;
    font-size: var(--study-control-size);
    line-height: var(--study-control-line);
    font-weight: 800;
  }

  .study-v2__sectionLabel {
    min-width: 0;
    color: var(--section-text, var(--study-text-body));
    font-size: var(--study-control-size);
    line-height: var(--study-control-line);
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .study-v2__actionRow {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--study-space-8);
    flex-wrap: wrap;
  }

  .study-v2__miniPill {
    min-height: calc(var(--study-space-24) + var(--study-space-8));
    border: 1px solid var(--study-line-soft);
    border-radius: var(--study-radius-12);
    background: var(--study-surface);
    color: var(--study-text-soft);
    display: inline-flex;
    align-items: center;
    gap: var(--study-space-8);
    padding: 0 var(--study-space-12);
    font-size: var(--study-control-size);
    line-height: var(--study-control-line);
    font-weight: 700;
    cursor: pointer;
    transition: border-color var(--study-motion-micro), color var(--study-motion-micro), background-color var(--study-motion-micro);
  }

  .study-v2__miniPill:hover {
    border-color: var(--study-accent-soft);
    color: var(--study-accent-strong);
    background: var(--study-accent-wash);
  }

  .study-v2__miniPill:disabled {
    opacity: 0.42;
    cursor: not-allowed;
  }

  .study-v2__cardBody {
    padding: var(--study-space-20) var(--study-space-24);
    background: var(--card-body-bg, var(--study-surface));
  }

  .study-v2__sourceBody {
    flex: 1 1 auto;
    min-height: 0;
    /* A fixed 294px cap ignored how much room the row actually had, so at
       shorter frames the Arabic passage escaped the card and printed over the
       lexicography row beneath it. Capping against the viewport as well lets
       the card give way and scroll, which is what its scroll edge is for. */
    max-height: min(294px, 34vh);
    overflow: auto;
    overscroll-behavior: contain;
  }

  .study-v2__arabicSource {
    margin: 0;
    color: var(--study-text-strong);
    direction: rtl;
    text-align: right;
    font-family: var(--study-arabic-font);
    font-size: var(--study-arabic-size);
    line-height: var(--study-arabic-line);
    font-weight: 400;
    text-rendering: optimizeLegibility;
  }

  .study-v2__bodyText {
    margin: 0;
    color: var(--study-text-body);
    font-size: var(--study-body-size);
    line-height: var(--study-body-line);
  }

  .study-v2__lexHeader {
    display: flex;
    align-items: center;
    gap: var(--study-space-8);
    color: color-mix(in srgb, var(--study-text-soft) 92%, var(--study-accent));
    font-size: var(--study-control-size);
    line-height: var(--study-control-line);
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .study-v2__lexStrip {
    display: flex;
    gap: var(--study-space-8);
    overflow-x: auto;
    padding-bottom: var(--study-space-4);
    scrollbar-width: none;
  }

  .study-v2__lexStrip::-webkit-scrollbar {
    display: none;
  }

  .study-v2__lexTerm {
    flex: 0 0 auto;
    min-height: calc(var(--study-space-32) + var(--study-space-8));
    border: 1px solid var(--study-line-soft);
    border-radius: var(--study-pill);
    background: var(--study-surface);
    box-shadow: 0 var(--study-space-4) var(--study-space-12) color-mix(in srgb, var(--study-text-strong) 5%, transparent);
    display: inline-flex;
    align-items: center;
    gap: var(--study-space-8);
    padding: 0 var(--study-space-16);
  }

  .study-v2__arabicInline {
    font-family: ${typography.studyArabicInline.fontFamily};
    font-size: var(--study-inline-arabic-size);
    line-height: ${typography.studyArabicInline.lineHeight};
    font-weight: ${typography.studyArabicInline.fontWeight};
    direction: rtl;
    unicode-bidi: isolate;
  }

  .study-v2__mono {
    color: color-mix(in srgb, var(--study-text-soft) 82%, var(--study-text-faint));
    font-family: ${typography.monoMeta.fontFamily};
    font-size: var(--study-control-size);
    letter-spacing: 0.06em;
  }

  .study-v2__editor {
    flex: 0 0 auto;
    padding: 0 20% var(--study-space-24);
    background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--study-bg-bottom) 70%, transparent));
  }

  .study-v2__editorLane {
    width: 100%;
    max-width: 980px;
    margin: 0 auto;
  }

  .study-v2__editorLane.is-focused {
    width: 100%;
    max-width: 1180px;
  }

  .study-v2__editor.is-docked {
    padding: 0;
    background: transparent;
    min-width: 0;
  }

  .study-v2__editor.is-docked .study-v2__editorLane {
    width: 100%;
    max-width: none;
  }

  .study-v2__editor.is-fillHeight,
  .study-v2__editor.is-fillHeight .study-v2__editorLane,
  .study-v2__editor.is-fillHeight .study-v2__panel {
    height: 100%;
    min-height: 0;
  }

  .study-v2__editor.is-fillHeight .study-v2__editorLane,
  .study-v2__editor.is-fillHeight .study-v2__panel {
    display: flex;
    flex-direction: column;
  }

  .study-v2__editor.is-fillHeight .study-v2__editorBody {
    flex: 1 1 auto;
    min-height: 0;
  }

  .study-v2__editor.is-fillHeight .study-v2__textarea {
    flex: 1 1 auto;
    min-height: 0;
    max-height: none;
    overflow: auto;
  }

  .study-v2__editor.is-expanded {
    position: fixed;
    inset: clamp(var(--study-space-24), 4vw, 64px);
    z-index: 95;
    width: auto;
    height: auto;
    min-height: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--study-bg-top) 70%, rgba(15, 23, 42, 0.18));
    backdrop-filter: blur(18px);
  }

  .study-v2__editor.is-expanded .study-v2__editorLane {
    width: min(1120px, 100%);
    max-width: 1120px;
    height: min(760px, 100%);
    display: flex;
  }

  .study-v2__editor.is-expanded .study-v2__panel,
  .study-v2__editor.is-expanded .study-v2__editorBody {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .study-v2__editor.is-expanded .study-v2__textarea {
    flex: 1 1 auto;
    min-height: 0;
    max-height: none;
    overflow: auto;
  }

  @media (max-width: 980px) {
    .study-v2__composer,
    .study-v2__composer.is-discussing {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto auto auto auto;
      grid-template-areas:
        "source"
        "lex"
        "editor"
        "companion";
      column-gap: 0;
    }
  }

  .study-v2__editorBody {
    padding: var(--study-space-18, 18px) var(--study-space-24);
    display: flex;
    flex-direction: column;
    gap: var(--study-space-12);
  }

  .study-v2__textarea {
    width: 100%;
    min-height: 106px;
    max-height: min(18vh, 152px);
    border: 0;
    outline: none;
    resize: none;
    overflow-y: hidden;
    background: transparent;
    color: var(--study-text-body);
    font-family: var(--study-body-font);
    font-size: var(--study-body-size);
    line-height: var(--study-body-line);
  }

  .study-v2__textarea::placeholder {
    color: var(--study-text-soft);
  }

  .study-v2__editor.is-fillHeight .study-v2__textarea,
  .study-v2__editor.is-expanded .study-v2__textarea {
    max-height: none;
    overflow: auto;
  }

  /* Provenance and honesty strip. Sits in its own contract lane above the
     workspace so it can never overlay content. */
  .study-v2__contextStrip {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]};
    padding: 0 0 ${spacing[12]};
  }

  .study-v2__contextBanner {
    display: flex;
    align-items: center;
    gap: ${spacing[12]};
    min-height: 44px;
    padding: 0 ${spacing[16]};
    border: 1px solid ${colors.accentSoft};
    border-radius: ${radius[12]};
    background: ${colors.accentWash};
  }

  .study-v2__contextLabel {
    flex: 0 0 auto;
    font-size: ${typography.eyebrowLabel.fontSize};
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${colors.accentStrong};
  }

  .study-v2__contextDetail {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: ${typography.bodyText.fontSize};
    color: ${colors.textBody};
  }

  .study-v2__contextDismiss {
    flex: 0 0 auto;
    min-height: 32px;
    padding: 0 ${spacing[12]};
    border: 1px solid ${colors.lineSoft};
    border-radius: 999px;
    background: ${colors.surfacePrimary};
    color: ${colors.textBody};
    font-size: ${typography.bodyText.fontSize};
    font-weight: 600;
    cursor: pointer;
  }

  .study-v2__contextDismiss:hover { border-color: ${colors.accentSoft}; color: ${colors.accentStrong}; }
  .study-v2__contextDismiss:focus-visible { outline: 2px solid ${colors.accentBase}; outline-offset: 2px; }

  /* The evaluation stub must announce itself wherever its output is shown. */
  .study-v2__sampleNotice {
    margin: 0;
    padding: ${spacing[8]} ${spacing[12]};
    border-left: 3px solid ${colors.review};
    background: ${colors.surfaceSoft};
    border-radius: ${radius[8]};
    font-size: ${typography.bodyText.fontSize};
    line-height: 1.5;
    color: ${colors.textSoft};
  }

  .study-v2__editorFooter {
    /* Was a rigid 3-column grid, so at narrow widths the hint and the Discuss
       button occupied the same pixels instead of reflowing. Wrapping lets the
       row give way; the actions stay together and the hint drops when there is
       genuinely not enough room for all three. */
    /* nowrap with a shrinkable hint. Flex items in a nowrap row cannot overlap
       as long as something is allowed to give, and the hint is that something —
       so the actions stay on one line at every width instead of stacking, and
       the original grid's collision is still impossible. */
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-end;
    gap: var(--study-space-12);
  }

  .study-v2__discussionFooter {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    gap: var(--study-space-12);
  }

  .study-v2__discussionFooter .study-v2__miniPill {
    min-height: 44px;
    justify-content: center;
  }

  .study-v2__hint {
    color: var(--study-text-soft);
    font-size: var(--study-control-size);
    font-weight: 600;
    /* flex-basis 0, not auto: the hint must claim no intrinsic width, so the
       actions stay on one row wherever they fit and the hint is what gives way.
       With '1 1 auto' it held its full width and pushed Submit onto a second
       row even at 1440, where there was ample room. */
    flex: 1 1 0;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .study-v2__secondaryAction {
    min-height: calc(var(--study-space-32) + var(--study-space-12));
    border: 1px solid var(--study-accent-mist);
    border-radius: var(--study-radius-12);
    background: var(--study-accent-wash);
    color: var(--study-accent-strong);
    display: inline-flex;
    align-items: center;
    gap: var(--study-space-8);
    padding: 0 var(--study-space-16);
    font-size: var(--study-body-size);
    font-weight: 700;
    cursor: pointer;
  }

  .study-v2__supportCard {
    flex: 0 0 auto;
    border: 1px solid var(--support-border, var(--study-line-soft));
    border-radius: var(--study-radius-16);
    background: var(--support-surface, var(--study-surface));
    box-shadow:
      0 var(--study-space-16) 34px var(--support-glow, color-mix(in srgb, var(--study-text-strong) 6%, transparent)),
      0 var(--study-space-8) 24px color-mix(in srgb, var(--study-text-strong) 5%, transparent);
    overflow: hidden;
  }

  .study-v2__supportCardHeader {
    min-height: calc(var(--study-space-32) + var(--study-space-12));
    padding: 0 var(--study-space-16);
    display: flex;
    align-items: center;
    gap: var(--study-space-12);
    border-bottom: 1px solid var(--support-border, var(--study-line-soft));
    background: var(--support-bg, var(--study-surface-soft));
  }

  .study-v2__supportIcon {
    color: var(--support-icon, var(--study-accent));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
  }

  .study-v2__supportTitle {
    margin: 0;
    min-width: 0;
    flex: 1 1 auto;
    color: var(--study-text-strong);
    font-size: var(--study-section-size);
    line-height: var(--study-section-line);
    font-weight: var(--study-section-weight);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .study-v2__supportExpand {
    margin-left: auto;
  }

  .study-v2__supportCardActions {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: var(--study-space-4, 4px);
    opacity: 0.72;
    transition: opacity var(--study-motion-micro);
  }

  .study-v2__supportCard:hover .study-v2__supportCardActions,
  .study-v2__supportCard:focus-within .study-v2__supportCardActions {
    opacity: 1;
  }

  .study-v2__supportCardHeader.is-draggable {
    cursor: grab;
    user-select: none;
    touch-action: none;
  }

  .study-v2__supportCardHeader.is-draggable:active {
    cursor: grabbing;
  }

  .study-v2__supportCardBody {
    padding: var(--study-space-20);
  }

  .study-v2__supportText {
    margin: 0;
    color: var(--study-text-body);
    font-size: var(--study-support-size);
    line-height: var(--study-support-line);
  }

  .study-v2__supportStack {
    display: flex;
    flex-direction: column;
    gap: var(--study-space-12);
  }

  .study-v2__supportEntry {
    padding-bottom: var(--study-space-12);
    border-bottom: 1px solid color-mix(in srgb, var(--study-line-soft) 58%, transparent);
  }

  .study-v2__supportEntry:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }

  .study-v2__supportEntryRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--study-space-12);
    margin-bottom: var(--study-space-8);
  }

  .study-v2__contextBox {
    margin-top: var(--study-space-8);
    padding: var(--study-space-12);
    border: 1px solid color-mix(in srgb, var(--study-line-soft) 72%, transparent);
    border-radius: var(--study-radius-12);
    background: color-mix(in srgb, var(--study-surface-soft) 92%, var(--study-surface));
    color: var(--study-text-body);
    font-size: var(--study-support-size);
    line-height: 1.5;
  }

  .study-v2__retryBanner {
    display: flex;
    gap: var(--study-space-12);
    align-items: flex-start;
    padding: var(--study-space-16);
    border: 1px solid color-mix(in srgb, var(--study-review) 48%, var(--study-line-soft));
    border-radius: var(--study-radius-16);
    background: color-mix(in srgb, var(--study-review) 9%, var(--study-surface));
    color: color-mix(in srgb, var(--study-review) 78%, var(--study-text-strong));
  }

  .study-v2__resultGrid {
    display: flex;
    flex-direction: column;
    gap: var(--study-space-16);
    padding-bottom: var(--study-space-16);
  }

  .study-v2__resultPanel .study-v2__cardBody {
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
  }

  .study-v2__discussionNotesBody {
    padding: var(--study-space-24);
  }

  .study-v2__discussionNotesEmpty {
    min-height: 184px;
    border: 2px dashed color-mix(in srgb, var(--study-line-soft) 82%, transparent);
    border-radius: var(--study-radius-16);
    background: color-mix(in srgb, var(--study-surface-soft) 54%, transparent);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--study-space-12);
    text-align: center;
    padding: var(--study-space-24);
  }

  .study-v2__discussionNotesEmptyActions {
    margin-top: var(--study-space-4);
    display: inline-flex;
    justify-content: center;
  }

  .study-v2__discussionNotesIcon {
    color: color-mix(in srgb, var(--study-text-faint) 70%, transparent);
  }

  .study-v2__manualNotesList {
    display: flex;
    flex-direction: column;
    gap: var(--study-space-12);
  }

  .study-v2__manualNote {
    padding: var(--study-space-16);
    border: 1px solid color-mix(in srgb, var(--study-review) 34%, var(--study-line-soft));
    border-radius: var(--study-radius-16);
    background: color-mix(in srgb, var(--study-review) 6%, var(--study-surface));
  }

  .study-v2__manualNoteLabel {
    margin: 0 0 var(--study-space-8);
    color: color-mix(in srgb, var(--study-review) 82%, var(--study-text-body));
    font-size: var(--study-control-size);
    line-height: var(--study-control-line);
    font-weight: 850;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .study-v2__manualNoteComposer {
    display: flex;
    flex-direction: column;
    gap: var(--study-space-12);
    padding: var(--study-space-16);
    border: 2px dashed color-mix(in srgb, var(--study-review) 38%, var(--study-line-soft));
    border-radius: var(--study-radius-16);
    background: color-mix(in srgb, var(--study-review) 5%, var(--study-surface));
  }

  .study-v2__manualNoteInput {
    width: 100%;
    min-height: 116px;
    border: 0;
    outline: none;
    resize: vertical;
    background: transparent;
    color: var(--study-text-body);
    font-family: var(--study-body-font);
    font-size: var(--study-body-size);
    line-height: var(--study-body-line);
  }

  .study-v2__manualNoteInput::placeholder {
    color: var(--study-text-soft);
  }

  .study-v2__manualNoteActions {
    display: flex;
    justify-content: flex-end;
    gap: var(--study-space-8);
  }

  .study-v2__emptyStateTitle {
    margin: 0;
    color: var(--study-text-body);
    font-size: var(--study-section-size);
    line-height: var(--study-section-line);
    font-weight: 800;
  }

  .study-v2__emptyStateText {
    max-width: 520px;
    margin: 0;
    color: color-mix(in srgb, var(--study-text-soft) 82%, var(--study-text-faint));
    font-size: var(--study-support-size);
    line-height: 1.65;
    font-weight: 500;
  }

  .study-v2__miniPill.is-muted,
  .study-v2__miniPill:disabled.is-muted {
    color: color-mix(in srgb, var(--study-text-faint) 70%, transparent);
    border-color: color-mix(in srgb, var(--study-line-soft) 72%, transparent);
    background: color-mix(in srgb, var(--study-surface) 82%, transparent);
    box-shadow: 0 var(--study-space-4) var(--study-space-8) color-mix(in srgb, var(--study-text-strong) 4%, transparent);
    opacity: 1;
  }

  .study-v2__bottomBar {
    flex: 0 0 auto;
    padding: var(--study-space-16) var(--study-space-24);
    border-top: 1px solid var(--study-line-soft);
    background: color-mix(in srgb, var(--study-surface) 94%, transparent);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--study-space-20);
  }

  .study-v2__submissionJump {
    position: static;
    align-self: center;
    z-index: 24;
    width: auto;
    height: auto;
    min-width: 0;
    min-height: 0;
    display: inline-flex;
    align-items: center;
    gap: var(--study-space-4);
    padding: var(--study-space-8);
    margin: 0 auto var(--study-space-8);
    border: 1px solid var(--study-line-soft);
    border-radius: var(--study-pill);
    background: color-mix(in srgb, var(--study-surface) 94%, transparent);
    box-shadow: 0 var(--study-space-12) 28px color-mix(in srgb, var(--study-text-strong) 12%, transparent);
    opacity: 0.58;
    transition: opacity var(--study-motion-panel), padding var(--study-motion-panel), gap var(--study-motion-panel);
  }

  .study-v2__submissionJump:hover,
  .study-v2__submissionJump:focus-within {
    opacity: 1;
    padding-inline: var(--study-space-16);
    gap: var(--study-space-8);
  }

  .study-v2__submissionJumpTitle,
  .study-v2__submissionJumpLabel {
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    white-space: nowrap;
    transition: max-width var(--study-motion-panel), opacity var(--study-motion-panel);
  }

  .study-v2__submissionJump:hover .study-v2__submissionJumpTitle,
  .study-v2__submissionJump:focus-within .study-v2__submissionJumpTitle {
    max-width: 96px;
    opacity: 1;
  }

  .study-v2__submissionJump:hover .study-v2__submissionJumpLabel,
  .study-v2__submissionJump:focus-within .study-v2__submissionJumpLabel {
    max-width: 132px;
    opacity: 1;
  }

  .study-v2__submissionJumpTitle {
    color: var(--study-text-faint);
    font-size: var(--study-control-size);
    line-height: var(--study-control-line);
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .study-v2__submissionJumpDivider {
    width: 1px;
    height: var(--study-space-20);
    background: var(--study-line-soft);
    flex: 0 0 auto;
  }

  .study-v2__submissionJumpButton {
    min-height: calc(var(--study-space-32) + var(--study-space-4));
    border: 0;
    border-radius: var(--study-pill);
    background: transparent;
    color: var(--jump-color, var(--study-text-body));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    padding: 0 var(--study-space-10, 10px);
    font-size: var(--study-control-size);
    line-height: var(--study-control-line);
    font-weight: 800;
    cursor: pointer;
    transition: background-color var(--study-motion-micro), color var(--study-motion-micro), gap var(--study-motion-panel);
  }

  .study-v2__submissionJump:hover .study-v2__submissionJumpButton,
  .study-v2__submissionJump:focus-within .study-v2__submissionJumpButton {
    gap: var(--study-space-8);
  }

  .study-v2__submissionJumpButton:hover {
    background: var(--jump-bg, var(--study-accent-wash));
    color: var(--jump-hover, var(--study-accent-strong));
  }

  .study-v2__submissionJumpButton:disabled {
    color: color-mix(in srgb, var(--study-text-faint) 62%, transparent);
    cursor: not-allowed;
  }

  .study-v2__submissionJumpButton:disabled:hover {
    background: transparent;
  }

  .study-v2__progress {
    min-width: 0;
    text-align: center;
  }

  .study-v2__progressText {
    margin: 0;
    color: var(--study-text-soft);
    font-size: var(--study-control-size);
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .study-v2__progressBars {
    margin-top: var(--study-space-8);
    display: flex;
    justify-content: center;
    gap: var(--study-space-4);
  }

  .study-v2__progressBar {
    width: var(--study-space-32);
    height: var(--study-space-4);
    border-radius: var(--study-pill);
    background: var(--study-line-soft);
  }

  .study-v2__supportOverlay {
    position: absolute;
    inset: var(--study-space-12);
    z-index: 4;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--support-border, var(--study-line-soft));
    border-radius: var(--study-radius-24);
    background: var(--support-surface, var(--study-surface));
    box-shadow: 0 24px 52px color-mix(in srgb, var(--study-text-strong) 14%, transparent);
    overflow: hidden;
    backdrop-filter: blur(18px);
  }

  .study-v2__supportOverlayHeader {
    min-height: calc(var(--study-space-32) + var(--study-space-16));
    padding: 0 var(--study-space-16);
    display: flex;
    align-items: center;
    gap: var(--study-space-12);
    border-bottom: 1px solid var(--support-border, var(--study-line-soft));
    background: var(--support-bg, var(--study-surface-soft));
  }

  .study-v2__supportOverlayBody {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: var(--study-space-16);
  }

  .study-v2__supportFullscreenBackdrop {
    position: fixed;
    inset: 0;
    z-index: 80;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(var(--study-space-24), 5vw, 80px);
    background: color-mix(in srgb, var(--study-bg-top) 72%, rgba(15, 23, 42, 0.2));
    backdrop-filter: blur(18px);
  }

  .study-v2__supportFullscreen {
    width: min(900px, 100%);
    min-height: min(620px, 100%);
    max-height: min(760px, 100%);
    border: 1px solid var(--support-border, var(--study-line-soft));
    border-radius: var(--study-radius-24);
    background: var(--support-surface, var(--study-surface));
    box-shadow: 0 32px 80px color-mix(in srgb, var(--study-text-strong) 18%, transparent);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .study-v2__supportFloating,
  .study-v2__supportPreview {
    width: min(380px, calc(100vw - 112px));
    z-index: 120;
  }

  .study-v2__supportFloating {
    position: fixed;
    top: calc(var(--study-space-64, 64px) + var(--study-space-24));
  }

  .study-v2__supportPreview {
    position: absolute;
    right: calc(100% + var(--study-space-16));
    pointer-events: auto;
    opacity: 0.98;
  }

  .study-v2__supportOverlayClose {
    margin-left: auto;
  }

  .study-v2__gradeValue {
    margin: 0;
    color: var(--study-text-strong);
    font-family: var(--study-title-font);
    font-size: calc(var(--study-title-size) - 1px);
    line-height: 1;
    font-weight: 700;
  }

  .study-v2__gradeBody {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--study-space-16);
    text-align: center;
  }

  .study-v2__gradeCircle {
    width: 104px;
    height: 104px;
    border-radius: var(--study-pill);
    border: 5px solid color-mix(in srgb, var(--study-success) 28%, transparent);
    background: color-mix(in srgb, var(--study-success) 10%, var(--study-surface));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: color-mix(in srgb, var(--study-success) 84%, var(--study-text-strong));
    font-family: var(--study-title-font);
    font-size: calc(var(--study-title-size) + 4px);
    line-height: 1;
    font-weight: 800;
  }

  .study-v2__gradeMeta {
    margin: 0;
    color: var(--study-text-soft);
    font-size: var(--study-support-size);
    line-height: 1.55;
  }

  .study-v2__gradeMeta strong {
    color: var(--study-text-strong);
  }

  .study-v2__insightBox {
    width: 100%;
    padding: var(--study-space-16);
    border: 1px solid var(--insight-border, var(--study-line-soft));
    border-radius: var(--study-radius-16);
    background: var(--insight-bg, var(--study-surface-soft));
    text-align: left;
  }

  .study-v2__insightBox.is-success {
    --insight-border: color-mix(in srgb, var(--study-success) 36%, var(--study-line-soft));
    --insight-bg: color-mix(in srgb, var(--study-success) 9%, var(--study-surface));
    --insight-color: color-mix(in srgb, var(--study-success) 82%, var(--study-text-strong));
  }

  .study-v2__insightBox.is-review {
    --insight-border: color-mix(in srgb, var(--study-review) 40%, var(--study-line-soft));
    --insight-bg: color-mix(in srgb, var(--study-review) 7%, var(--study-surface));
    --insight-color: color-mix(in srgb, var(--study-review) 86%, var(--study-text-strong));
  }

  .study-v2__insightBox.is-blue {
    --insight-border: color-mix(in srgb, var(--study-accent) 24%, var(--study-line-soft));
    --insight-bg: color-mix(in srgb, var(--study-accent-wash) 64%, var(--study-surface));
    --insight-color: var(--study-accent-strong);
  }

  .study-v2__insightTitle {
    margin: 0 0 var(--study-space-12);
    color: var(--insight-color, var(--study-text-strong));
    display: flex;
    align-items: center;
    gap: var(--study-space-8);
    font-size: var(--study-body-size);
    line-height: 1.2;
    font-weight: 850;
  }

  .study-v2__insightDot {
    width: 8px;
    height: 8px;
    border-radius: var(--study-pill);
    background: currentColor;
    flex: 0 0 auto;
  }

  .study-v2__takeawayList {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--study-space-16);
    list-style: none;
  }

  .study-v2__takeawayItem {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: var(--study-space-12);
    color: var(--study-text-body);
    font-size: var(--study-support-size);
    line-height: var(--study-support-line);
  }

  .study-v2__takeawayDot {
    width: 8px;
    height: 8px;
    border-radius: var(--study-pill);
    margin-top: 0.62em;
    background: var(--support-icon, var(--study-accent));
  }

  .study-v2__progressBar.is-active {
    background: var(--study-accent);
  }

  .study-v2__collapsedSupportButton {
    width: 100%;
    min-height: calc(var(--study-space-64) + var(--study-space-16));
    border: 1px solid var(--support-border, var(--study-line-soft));
    border-radius: var(--study-radius-16);
    background: var(--support-bg, var(--study-surface));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--support-icon, var(--study-accent));
    cursor: pointer;
    transition:
      transform var(--study-motion-micro),
      border-color var(--study-motion-micro),
      background-color var(--study-motion-micro),
      box-shadow var(--study-motion-micro);
  }

  .study-v2__collapsedSupportButton:hover {
    border-color: var(--support-icon, var(--study-accent));
    background: color-mix(in srgb, var(--support-bg, var(--study-accent-wash)) 90%, var(--study-surface));
    box-shadow:
      0 var(--study-space-12) 26px color-mix(in srgb, var(--support-icon, var(--study-accent)) 16%, transparent),
      inset 0 0 0 1px color-mix(in srgb, var(--support-icon, var(--study-accent)) 24%, transparent);
    transform: translateX(-3px);
  }

  .study-v2__collapsedSupportButton:focus-visible {
    outline: 2px solid var(--support-icon, var(--study-accent));
    outline-offset: 3px;
  }

  .study-v2__discussion {
    min-width: 0;
    min-height: 360px;
    display: flex;
    flex-direction: column;
  }

  .study-v2__discussionBody {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--study-space-16);
  }

  .study-v2__discussionInput {
    margin-top: auto;
    min-height: calc(var(--study-space-64) + var(--study-space-32));
    width: 100%;
    resize: vertical;
    border: 1px solid var(--study-line-soft);
    border-radius: var(--study-radius-16);
    padding: var(--study-space-16);
    color: var(--study-text-body);
    font-family: var(--study-body-font);
    font-size: var(--study-body-size);
    line-height: var(--study-body-line);
    background: var(--study-surface);
  }

  @media (max-width: 1180px) {
    .study-v2__centerHeader {
      grid-template-columns: minmax(0, 1fr);
      align-items: start;
    }

    .study-v2__statusCluster {
      justify-content: flex-start;
    }
  }

  @media (max-width: 1400px) {
    .study-v2__shellContextBar {
      width: 100%;
    }

    .study-v2__shellProjectText {
      max-width: 220px;
    }
  }

  @media (max-width: 1280px) {
    .study-v2__shellProgressLabelText {
      display: none;
    }
  }
`

const toneMap = {
  blue: {
    surface: '#ffffff',
    bg: 'rgba(243, 248, 255, 0.94)',
    border: 'rgba(191, 219, 254, 0.78)',
    icon: '#2563eb',
    badgeBg: '#dbeafe',
    badgeText: '#1d4ed8',
    glow: 'rgba(37, 99, 235, 0.08)',
  },
  slate: {
    surface: '#ffffff',
    bg: '#f8fafc',
    border: '#dfe8f4',
    icon: '#64748b',
    badgeBg: '#e2e8f0',
    badgeText: '#475569',
    glow: 'rgba(100, 116, 139, 0.08)',
  },
  purple: {
    surface: '#ffffff',
    bg: 'rgba(250, 245, 255, 0.94)',
    border: 'rgba(233, 213, 255, 0.82)',
    icon: '#9333ea',
    badgeBg: '#f3e8ff',
    badgeText: '#7e22ce',
    glow: 'rgba(147, 51, 234, 0.08)',
  },
  orange: {
    surface: '#ffffff',
    bg: 'rgba(255, 249, 240, 0.96)',
    border: 'rgba(254, 215, 170, 0.82)',
    icon: '#f97316',
    badgeBg: '#ffedd5',
    badgeText: '#ea580c',
    glow: 'rgba(249, 115, 22, 0.08)',
  },
  success: {
    surface: '#ffffff',
    bg: 'rgba(236, 253, 245, 0.82)',
    border: 'rgba(167, 243, 208, 0.85)',
    icon: '#059669',
    badgeBg: '#d1fae5',
    badgeText: '#047857',
    glow: 'rgba(5, 150, 105, 0.13)',
  },
  review: {
    surface: '#ffffff',
    bg: 'rgba(255, 247, 237, 0.92)',
    border: 'rgba(254, 215, 170, 0.85)',
    icon: '#ea580c',
    badgeBg: '#ffedd5',
    badgeText: '#ea580c',
    glow: 'rgba(234, 88, 12, 0.12)',
  },
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function createFloatingCardState(cardId) {
  if (typeof window === 'undefined') {
    return {
      id: cardId,
      left: 24,
      top: 96,
    }
  }

  const cardWidth = Math.min(380, Math.max(280, window.innerWidth - 112))
  const inset = 16
  const defaultLeft = window.innerWidth - cardWidth - 88
  const defaultTop = Math.round(window.innerHeight * 0.18)

  return {
    id: cardId,
    left: clamp(defaultLeft, inset, Math.max(inset, window.innerWidth - cardWidth - inset)),
    top: clamp(defaultTop, inset, Math.max(inset, window.innerHeight - 420)),
  }
}

function toneStyle(tone = 'blue') {
  const resolvedTone = toneMap[tone] ?? toneMap.blue

  return {
    '--support-bg': resolvedTone.bg,
    '--support-surface': resolvedTone.surface,
    '--support-border': resolvedTone.border,
    '--support-icon': resolvedTone.icon,
    '--support-glow': resolvedTone.glow,
    '--card-bg': resolvedTone.bg,
    '--card-line': resolvedTone.border,
    '--card-glow': resolvedTone.glow,
    '--badge-bg': resolvedTone.badgeBg,
    '--badge-text': resolvedTone.badgeText,
  }
}

export function StudyWorkspaceStyles() {
  return <style>{studyCss}</style>
}

export function StudyShellTitleBar({
  title = 'Al-Hidayah • The Book of Prayer',
  chapterLabel,
  segmentLabel,
}) {
  return (
    <div className="study-v2 study-v2__shellContextBar" data-debug-item="study_shell_context_bar">
      <div className="study-v2__shellContextIdentity">
        <span className="study-v2__shellBookMark" aria-hidden="true">
          <BookOpen size={19} strokeWidth={1.9} />
        </span>
        <div className="study-v2__shellIdentity">
          <div className="study-v2__shellTitleLine" aria-label={`${segmentLabel}, ${title}, ${chapterLabel}`}>
            <span className="study-v2__shellTitleText">{segmentLabel}</span>
            <span className="study-v2__shellTitleDivider" aria-hidden="true" />
            <span className="study-v2__shellProjectText">{title}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function StudyShellProgress({
  routeLabel = 'Study Workspace',
  progressText,
  progressStep = 0,
  progressTotal = 1,
}) {
  const progressCurrent = Math.min(progressTotal, progressStep + 1)
  const visibleBarCount = Math.min(progressTotal, 5)
  const activeBarIndex =
    visibleBarCount > 1 && progressTotal > 1
      ? Math.round((progressStep / Math.max(progressTotal - 1, 1)) * (visibleBarCount - 1))
      : 0

  return (
    <span
      className="study-v2 study-v2__shellProgress study-v2__shellCenterProgress"
      aria-label={`${routeLabel}: ${progressText}`}
    >
      <span className="study-v2__shellProgressLabel">
        <span className="study-v2__shellProgressLabelText">Segment </span>
        {progressCurrent} of {progressTotal}
      </span>
      <span className="study-v2__shellProgressBars" aria-hidden="true">
        {Array.from({ length: visibleBarCount }, (_, index) => (
          <span key={index} className={`study-v2__shellProgressBar${index === activeBarIndex ? ' is-active' : ''}`} />
        ))}
      </span>
    </span>
  )
}

export function StudyShellMeta({
  focusMode = false,
  onToggleFocus,
  showSandboxControls = false,
  onDraft,
  onFail,
  onPass,
}) {
  return (
    <div className="study-v2 study-v2__shellMetaCluster" data-debug-item="study_shell_meta_cluster">
      {showSandboxControls ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[4] }}>
          {[['Draft', onDraft], ['Fail', onFail], ['Pass', onPass]].map(([label, onClick]) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              style={{
                minHeight: '28px',
                padding: `0 ${spacing[10]}`,
                borderRadius: radius[12],
                border: `1px solid ${colors.lineSoft}`,
                background: 'rgba(255,255,255,0.86)',
                color: colors.textSoft,
                fontSize: typography.studyControlLabel.fontSize,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
      <button
        type="button"
        className={`study-v2__shellFocusButton${focusMode ? ' is-active' : ''}`}
        onClick={onToggleFocus}
        title={focusMode ? 'Exit focus mode' : 'Focus workspace'}
      >
        {focusMode ? <Minimize2 size={13} strokeWidth={1.9} /> : <Maximize2 size={13} strokeWidth={1.9} />}
        <span className="study-v2__shellFocusButtonText">{focusMode ? 'Exit focus' : 'Focus view'}</span>
      </button>
    </div>
  )
}

export function StudyStatusChip({ state, compact = false }) {
  const config = {
    submitted: {
      label: 'Submitted',
      compactLabel: 'Done',
      icon: <CheckCircle2 size={14} />,
      style: {
        '--status-text': 'var(--study-success)',
        '--status-bg': 'color-mix(in srgb, var(--study-success) 10%, var(--study-surface))',
        '--status-border': 'color-mix(in srgb, var(--study-success) 32%, var(--study-line-soft))',
      },
    },
    failed: {
      label: 'Needs revision',
      compactLabel: 'Revise',
      icon: <AlertTriangle size={14} />,
      style: {
        '--status-text': 'var(--study-review)',
        '--status-bg': 'color-mix(in srgb, var(--study-review) 10%, var(--study-surface))',
        '--status-border': 'color-mix(in srgb, var(--study-review) 34%, var(--study-line-soft))',
      },
    },
    draft: {
      label: 'Drafting phase',
      compactLabel: 'In progress',
      icon: <Sparkles size={14} />,
      style: {
        '--status-text': 'var(--study-accent-strong)',
        '--status-bg': 'var(--study-accent-wash)',
        '--status-border': 'var(--study-accent-mist)',
      },
    },
  }
  const resolved = config[state] ?? config.draft

  return (
    <span className="study-v2__statusChip" style={resolved.style}>
      {resolved.icon}
      {compact ? resolved.compactLabel : resolved.label}
    </span>
  )
}

export function StudyPaneToggle({ collapsed, label, onClick, side = 'left' }) {
  return (
    <IconActionButton
      size="utility-sm"
      label={label}
      title={label}
      onClick={onClick}
      icon={collapsed === (side === 'left') ? <ChevronsRight strokeWidth={1.8} /> : <ChevronsLeft strokeWidth={1.8} />}
    />
  )
}

export function StudySegmentNavigator({
  nodes,
  currentSegmentId,
  segmentRecords,
  collapsed,
  onToggleCollapsed,
  onSelectSegment,
}) {
  const [openFolders, setOpenFolders] = useState(() =>
    Object.fromEntries(nodes.filter((node) => node.type === 'folder').map((node) => [node.id, node.isOpenByDefault ?? true])),
  )

  const visibleFiles = nodes.filter((node) => node.type === 'file')

  if (collapsed) {
    return (
      <aside className="study-v2 study-v2__railPanel" data-debug-item="study_segment_navigator_collapsed">
        <div className="study-v2__railHeader" style={{ justifyContent: 'center', padding: 0 }}>
          <StudyPaneToggle collapsed={collapsed} side="left" label="Expand segments" onClick={onToggleCollapsed} />
        </div>
        <div className="study-v2__collapsedRailBody">
          {visibleFiles.map((node) => {
            const isActive = node.id === currentSegmentId
            return (
              <button
                key={node.id}
                type="button"
                className={`study-v2__collapsedSupportButton${isActive ? ' is-active' : ''}`}
                onClick={() => onSelectSegment(node.id)}
                aria-label={node.label}
                style={isActive ? toneStyle('blue') : toneStyle('slate')}
              >
                <span className={`study-v2__segmentState${isActive ? ' is-active' : ''}`} />
              </button>
            )
          })}
        </div>
      </aside>
    )
  }

  return (
    <aside className="study-v2 study-v2__railPanel" data-debug-item="study_segment_navigator">
      <div className="study-v2__railHeader">
        <span>Segments</span>
        <StudyPaneToggle collapsed={collapsed} side="left" label="Collapse segments" onClick={onToggleCollapsed} />
      </div>
      <div className="study-v2__railBody">
        {nodes.map((node) => {
          if (node.depth > 0 && openFolders[node.id.split('.')[0]] === false) {
            return null
          }

          if (node.type === 'folder') {
            const isOpen = openFolders[node.id] !== false
            return (
              <button
                key={node.id}
                type="button"
                className="study-v2__folderRow"
                onClick={() => setOpenFolders((current) => ({ ...current, [node.id]: !isOpen }))}
                style={{ paddingLeft: `calc(var(--study-space-16) + ${node.depth} * var(--study-space-16))` }}
              >
                {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                <span className="study-v2__segmentLabel">{node.label}</span>
              </button>
            )
          }

          const record = segmentRecords[node.id] ?? { submissionState: 'draft' }
          const isActive = node.id === currentSegmentId

          return (
            <button
              key={node.id}
              type="button"
              className={`study-v2__segmentRow${isActive ? ' is-active' : ''}`}
              onClick={() => onSelectSegment(node.id)}
              style={{ paddingLeft: `calc(var(--study-space-16) + ${node.depth} * var(--study-space-16))` }}
            >
              <span
                className={[
                  'study-v2__segmentState',
                  isActive ? 'is-active' : '',
                  record.submissionState === 'submitted' ? 'is-submitted' : '',
                  record.submissionState === 'failed' ? 'is-failed' : '',
                ].filter(Boolean).join(' ')}
              />
              <span className="study-v2__segmentLabel">{node.label}</span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

export function StudyHeader({
  chapterLabel,
  status,
  showSandboxControls = false,
  onDraft,
  onFail,
  onPass,
  onToggleWide,
  wide,
}) {
  return (
    <header className="study-v2 study-v2__centerHeader" data-debug-item="study_center_header">
      <div>
        <h1 className="study-v2__title">
          <BookOpen size={30} color="var(--study-accent)" strokeWidth={1.9} />
          <span>Al-Hidayah • The Book of Prayer</span>
        </h1>
        <div className="study-v2__subtitleRow">
          <p className="study-v2__subtext">{chapterLabel}</p>
          <span className="study-v2__chip">
            <Tag size={12} strokeWidth={1.9} />
            Fiqh Terminology
          </span>
        </div>
      </div>

      <div className="study-v2__statusCluster">
        <StudyStatusChip state={status} />
        {showSandboxControls ? (
          <div className="study-v2__debugCluster" aria-label="Sandbox state controls">
            <button type="button" className="study-v2__debugButton" onClick={onDraft}>Draft</button>
            <button type="button" className="study-v2__debugButton" onClick={onFail}>Fail</button>
            <button type="button" className="study-v2__debugButton" onClick={onPass}>Pass</button>
          </div>
        ) : null}
        <IconActionButton
          size="utility-md"
          label={wide ? 'Shrink workspace lane' : 'Widen workspace lane'}
          title={wide ? 'Shrink workspace lane' : 'Widen workspace lane'}
          active={wide}
          onClick={onToggleWide}
          icon={<Maximize2 strokeWidth={1.8} />}
        />
      </div>
    </header>
  )
}

function StudyPanel({ children, className = '', tone = 'blue', debugItem, anchor }) {
  return (
    <section
      className={`study-v2 study-v2__panel ${className}`}
      style={toneStyle(tone)}
      data-debug-item={debugItem}
      data-study-anchor={anchor}
    >
      {children}
    </section>
  )
}

function CardHeader({ badge, title, children, tone = 'blue' }) {
  return (
    <div className="study-v2__cardHeader" style={toneStyle(tone)}>
      <div className="study-v2__cardTitleRow">
        <span className="study-v2__badge">{badge}</span>
        <span className="study-v2__sectionLabel">{title}</span>
      </div>
      {children ? <div className="study-v2__actionRow">{children}</div> : null}
    </div>
  )
}

export function StudySourceCard({
  sourceText,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
  showSegmentNavigation = true,
  fontScale = 1,
  onDecreaseFont,
  onIncreaseFont,
}) {
  return (
    <section className="study-v2__sourceGroup">
      {showSegmentNavigation ? (
        <div className="study-v2__navRow">
          <button type="button" className="study-v2__quietButton" onClick={onPrevious} disabled={!canPrevious} title="Previous segment">
            <ChevronLeft size={15} />
            Previous
          </button>
          <button type="button" className="study-v2__quietButton" onClick={onNext} disabled={!canNext} title="Next segment">
            Next
            <ChevronRight size={15} />
          </button>
        </div>
      ) : null}
      <StudyPanel debugItem="study_source_card" anchor="source">
        <CardHeader badge="AR" title="Source Text">
          <button type="button" className="study-v2__miniPill" onClick={onDecreaseFont} disabled={fontScale <= 0.72} title="Decrease source text size">
            A-
          </button>
          <button type="button" className="study-v2__miniPill" onClick={onIncreaseFont} disabled={fontScale >= 1.44} title="Increase source text size">
            A+
          </button>
          <button type="button" className="study-v2__miniPill" title="Copy source text">
            <Copy size={14} />
            Copy
          </button>
        </CardHeader>
        <div className="study-v2__cardBody study-v2__sourceBody">
          <p
            className="study-v2__arabicSource"
            dir="rtl"
            style={{
              fontSize: `calc((var(--study-arabic-size) - 2px) * ${fontScale})`,
            }}
          >
            {sourceText}
          </p>
        </div>
      </StudyPanel>
    </section>
  )
}

export function StudyQuickLexicography({ terms }) {
  return (
    <section className="study-v2__studyStack" style={{ gap: 'var(--study-space-12)' }} data-debug-item="study_quick_lexicography">
      <div className="study-v2__lexHeader">
        <BookOpen size={13} strokeWidth={1.9} />
        Quick Lexicography
      </div>
      <div className="study-v2__lexStrip">
        {terms.map((term) => (
          <div key={term.transliteration} className="study-v2__lexTerm" title={term.description}>
            <span className="study-v2__arabicInline" dir="rtl">{term.arabic}</span>
            <span className="study-v2__mono">{term.transliteration}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function StudyRetryBanner() {
  return (
    <div className="study-v2__retryBanner" data-debug-item="study_retry_banner">
      <AlertTriangle size={20} />
      <div>
        <p className="study-v2__sectionLabel" style={{ margin: 0, color: 'currentColor' }}>Try again</p>
        <p className="study-v2__supportText" style={{ marginTop: 'var(--study-space-4)' }}>
          Tighten the legal condition and clarify attribution before resubmitting.
        </p>
      </div>
    </div>
  )
}

/**
 * Controlled translation editor.
 *
 * 'value'/'onChange' are required for the draft to belong to anything. This
 * component previously owned the draft in local state, which meant nothing read
 * what the user typed, the text was never persisted, and switching segments
 * left the previous segment's translation on screen — the caller could not fix
 * any of that from outside. An uncontrolled fallback is kept only so the
 * component still renders standalone in the labs.
 */
export function StudyTranslationEditor({
  value,
  onChange,
  onSubmit,
  failed,
  onDiscuss,
  discussionOpen = false,
  focusMode = false,
  docked = false,
  fillHeight = false,
  disabled = false,
  hint = null,
}) {
  const isControlled = typeof value === 'string'
  const [uncontrolledDraft, setUncontrolledDraft] = useState('')
  const draft = isControlled ? value : uncontrolledDraft
  const setDraft = (next) => (isControlled ? onChange?.(next) : setUncontrolledDraft(next))
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef(null)

  // useLayoutEffect, not useEffect: the height is measured from scrollHeight and
  // written back, so running it after paint made the editor visibly resize on
  // first render and made its captured height depend on when a screenshot
  // fired. Measuring before paint removes both the flicker and the flake.
  useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (!textarea || fillHeight || isExpanded) {
      return
    }

    textarea.style.height = 'auto'
    const maxHeight = Number.parseFloat(window.getComputedStyle(textarea).maxHeight)
    const nextHeight = Number.isFinite(maxHeight) ? Math.min(textarea.scrollHeight, maxHeight) : textarea.scrollHeight
    textarea.style.height = `${nextHeight}px`
    textarea.style.overflowY = Number.isFinite(maxHeight) && textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [draft, fillHeight, isExpanded])

  return (
    <div
      className={[
        'study-v2',
        'study-v2__editor',
        docked ? 'is-docked' : '',
        fillHeight ? 'is-fillHeight' : '',
        isExpanded ? 'is-expanded' : '',
      ].filter(Boolean).join(' ')}
      data-debug-item="study_translation_editor_region"
    >
      <div className={['study-v2__editorLane', focusMode ? 'is-focused' : ''].filter(Boolean).join(' ')}>
        {failed ? <StudyRetryBanner /> : null}
        <StudyPanel debugItem="study_translation_editor" tone={failed ? 'review' : 'blue'}>
          <CardHeader badge="EN" title="Translation" tone={failed ? 'review' : 'blue'}>
            <IconActionButton size="utility-sm" label="Bold" title="Bold" icon={<Bold strokeWidth={1.8} />} />
            <IconActionButton size="utility-sm" label="Italic" title="Italic" icon={<Italic strokeWidth={1.8} />} />
            <IconActionButton size="utility-sm" label="Align left" title="Align left" active icon={<AlignLeft strokeWidth={1.8} />} />
            <IconActionButton size="utility-sm" label="Align center" title="Align center" icon={<AlignCenter strokeWidth={1.8} />} />
            <IconActionButton
              size="utility-sm"
              label={isExpanded ? 'Collapse translation editor' : 'Expand translation editor'}
              title={isExpanded ? 'Collapse translation editor' : 'Expand translation editor'}
              onClick={() => setIsExpanded((current) => !current)}
              icon={isExpanded ? <Minimize2 strokeWidth={1.8} /> : <Maximize2 strokeWidth={1.8} />}
            />
          </CardHeader>
          <div className="study-v2__editorBody">
            <textarea
              ref={textareaRef}
              className="study-v2__textarea"
              placeholder="Write your translation here..."
              aria-label="Translation"
              disabled={disabled}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              // The footer has advertised this shortcut all along without
              // implementing it. Honour the affordance rather than remove it.
              onKeyDown={(event) => {
                if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault()
                  onSubmit?.()
                }
              }}
            />
            <div className="study-v2__editorFooter">
              <span className="study-v2__hint">{hint ?? '⌘ Enter to submit'}</span>
              <button
                type="button"
                className="study-v2__secondaryAction"
                onClick={onDiscuss}
                title={discussionOpen ? 'Hide study companion' : 'Discuss this segment'}
              >
                <MessageSquare size={15} strokeWidth={1.9} />
                {discussionOpen ? 'Hide discussion' : 'Discuss this segment'}
              </button>
              <PrimaryCTA minWidth={132} height={44} icon={<Send size={15} strokeWidth={1.9} />} onClick={onSubmit} title={failed ? 'Submit again' : 'Submit translation'}>
                {failed ? 'Submit again' : 'Submit'}
              </PrimaryCTA>
            </div>
          </div>
        </StudyPanel>
      </div>
    </div>
  )
}

export function StudyDiscussionCompanion({ onClose }) {
  return (
    <StudyPanel className="study-v2__discussion" tone="review" debugItem="study_discussion_companion">
      <CardHeader badge={<MessageSquare size={15} />} title="Study Companion" tone="review">
        <button type="button" className="study-v2__miniPill" onClick={onClose} title="Close study companion">Close</button>
      </CardHeader>
      <div className="study-v2__cardBody study-v2__discussionBody">
        <div className="study-v2__contextBox">
          <strong>Start the conversation</strong>
          <br />
          Ask a segment-specific question. The summary can be saved back to this segment later.
        </div>
        <p className="study-v2__supportText">
          Your companion can help unpack wording, compare views, and point out what needs revision without moving you away from the current segment.
        </p>
        <textarea className="study-v2__discussionInput" placeholder="Ask a segment-specific follow-up question..." />
        <div className="study-v2__discussionFooter">
          <button type="button" className="study-v2__miniPill" title="Summarise and save discussion">Summarise and save</button>
          <PrimaryCTA minWidth={112} height={44} icon={<Send size={15} strokeWidth={1.9} />} title="Send companion message">Send</PrimaryCTA>
        </div>
      </div>
    </StudyPanel>
  )
}

export function StudySubmittedStack({ bestTranslation, userTranslation, onDiscuss, manualNotes = [], onAddManualNote }) {
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [manualNoteDraft, setManualNoteDraft] = useState('')

  const saveManualNote = () => {
    const nextNote = manualNoteDraft.trim()

    if (!nextNote) {
      return
    }

    onAddManualNote?.(nextNote)
    setManualNoteDraft('')
    setIsAddingNote(false)
  }

  return (
    <div className="study-v2__resultGrid" data-debug-item="study_submitted_stack">
      <StudyPanel tone="success" className="study-v2__resultPanel" anchor="best">
        <CardHeader badge="✓" title="Best in Class Translation" tone="success">
          <button type="button" className="study-v2__miniPill" title="Copy best translation">
            <Copy size={14} />
            Copy
          </button>
        </CardHeader>
        <div className="study-v2__cardBody">
          <p className="study-v2__bodyText">{bestTranslation}</p>
        </div>
      </StudyPanel>
      <StudyPanel tone="slate" className="study-v2__resultPanel" anchor="translation">
        <CardHeader badge="EN" title="Your Translation" tone="slate">
          <button type="button" className="study-v2__miniPill" title="Copy your translation">
            <Copy size={14} />
            Copy
          </button>
        </CardHeader>
        <div className="study-v2__cardBody">
          <p className="study-v2__bodyText">{userTranslation}</p>
        </div>
      </StudyPanel>
      <StudyPanel tone="review" className="study-v2__resultPanel study-v2__notesPanel" anchor="notes">
        <CardHeader badge={<ScrollText size={15} />} title="Discussion Summary & Notes" tone="review">
          <button type="button" className="study-v2__miniPill is-muted" disabled title="Notes are already attached to this segment">
            <Pin size={14} />
            Pin
          </button>
          <button type="button" className="study-v2__miniPill" onClick={() => setIsAddingNote(true)} title="Add a manual note">
            <Plus size={14} />
            Add manual note
          </button>
        </CardHeader>
        <div className="study-v2__cardBody study-v2__discussionNotesBody">
          {manualNotes.length === 0 && !isAddingNote ? (
            <div className="study-v2__discussionNotesEmpty">
              <ScrollText className="study-v2__discussionNotesIcon" size={34} strokeWidth={1.8} />
              <p className="study-v2__emptyStateTitle">No discussion summary yet</p>
              <p className="study-v2__emptyStateText">
                Use “Discuss this segment” to start a conversation. When you summarise and save, it will appear here along with any manual notes you add.
              </p>
              <div className="study-v2__discussionNotesEmptyActions">
                <button type="button" className="study-v2__miniPill" onClick={onDiscuss} title="Discuss this segment">
                  <MessageSquare size={14} />
                  Discuss this segment
                </button>
              </div>
            </div>
          ) : null}
          {manualNotes.length > 0 ? (
            <div className="study-v2__manualNotesList">
              {manualNotes.map((note, index) => (
                <article key={`${note}-${index}`} className="study-v2__manualNote">
                  <p className="study-v2__manualNoteLabel">Manual note {index + 1}</p>
                  <p className="study-v2__bodyText">{note}</p>
                </article>
              ))}
            </div>
          ) : null}
          {isAddingNote ? (
            <div className="study-v2__manualNoteComposer">
            <ScrollText className="study-v2__discussionNotesIcon" size={34} strokeWidth={1.8} />
              <textarea
                className="study-v2__manualNoteInput"
                autoFocus
                value={manualNoteDraft}
                onChange={(event) => setManualNoteDraft(event.target.value)}
                placeholder="Write a note for this segment..."
              />
              <div className="study-v2__manualNoteActions">
                <button
                  type="button"
                  className="study-v2__miniPill"
                  title="Cancel manual note"
                  onClick={() => {
                    setManualNoteDraft('')
                    setIsAddingNote(false)
                  }}
                >
                  Cancel
                </button>
                <button type="button" className="study-v2__miniPill" onClick={saveManualNote} disabled={!manualNoteDraft.trim()} title="Save manual note">
                  Save note
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </StudyPanel>
    </div>
  )
}

export function StudySubmissionNavigator({ onJumpTo, notesAvailable = false }) {
  const jumpItems = [
    {
      id: 'source',
      label: 'Source',
      content: 'AR',
      available: true,
      style: {
        '--jump-color': 'var(--study-text-body)',
        '--jump-bg': 'var(--study-accent-wash)',
        '--jump-hover': 'var(--study-accent-strong)',
      },
    },
    {
      id: 'best',
      label: 'Best in Class',
      content: <CheckCircle2 size={15} strokeWidth={1.9} />,
      available: true,
      style: {
        '--jump-color': 'var(--study-success)',
        '--jump-bg': 'color-mix(in srgb, var(--study-success) 10%, var(--study-surface))',
        '--jump-hover': 'var(--study-success)',
      },
    },
    {
      id: 'translation',
      label: 'Your Translation',
      content: 'EN',
      available: true,
      style: {
        '--jump-color': 'var(--study-accent-strong)',
        '--jump-bg': 'var(--study-accent-wash)',
        '--jump-hover': 'var(--study-accent-strong)',
      },
    },
    {
      id: 'notes',
      label: 'Notes',
      content: <ScrollText size={15} strokeWidth={1.9} />,
      available: notesAvailable,
      style: {
        '--jump-color': 'var(--study-text-soft)',
        '--jump-bg': 'color-mix(in srgb, var(--study-text-faint) 9%, var(--study-surface))',
        '--jump-hover': 'var(--study-text-body)',
      },
    },
  ]

  return (
    <nav className="study-v2 study-v2__submissionJump" aria-label="Jump to study section">
      <span className="study-v2__submissionJumpTitle">Jump to</span>
      <span className="study-v2__submissionJumpDivider" aria-hidden="true" />
      {jumpItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className="study-v2__submissionJumpButton"
          style={item.style}
          onClick={() => item.available && onJumpTo(item.id)}
          disabled={!item.available}
          title={item.available ? `Jump to ${item.label}` : `${item.label} is not available yet`}
        >
          {item.content}
          <span className="study-v2__submissionJumpLabel">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export function StudySupportRail({ collapsed, onToggleCollapsed, state }) {
  const [expandedCardId, setExpandedCardId] = useState(null)
  const [fullscreenCardId, setFullscreenCardId] = useState(null)
  const [floatingCardState, setFloatingCardState] = useState(null)
  const [previewCardId, setPreviewCardId] = useState(null)
  const [previewTop, setPreviewTop] = useState(null)
  const previewCloseTimerRef = useRef(null)
  const floatingDragCleanupRef = useRef(null)
  const isSubmitted = state === 'submitted'
  const isFailed = state === 'failed'
  const cards = isSubmitted
    ? [
        { id: 'grade', title: 'Your Grade', tone: 'success', icon: <Award size={18} />, body: <GradeBody failed={false} /> },
        { id: 'takeaways', title: 'Key Takeaways', tone: 'blue', icon: <Sparkles size={18} />, body: <TakeawaysBody /> },
        { id: 'lexicography', title: 'Lexicography', tone: 'purple', icon: <BookOpen size={18} />, body: <LexicographyBody /> },
      ]
    : isFailed
      ? [
          { id: 'grade', title: 'Your Grade', tone: 'review', icon: <Award size={18} />, body: <GradeBody failed /> },
          { id: 'fix', title: 'Fix Steps', tone: 'orange', icon: <Sparkles size={18} />, body: <FixStepsBody /> },
          { id: 'lexicography', title: 'Lexicography', tone: 'purple', icon: <BookOpen size={18} />, body: <LexicographyBody /> },
        ]
      : [
          { id: 'guidance', title: 'Guidance', tone: 'blue', icon: <Info size={18} />, body: <GuidanceBody /> },
          { id: 'lexicography', title: 'Lexicography', tone: 'purple', icon: <BookOpen size={18} />, body: <LexicographyBody /> },
          { id: 'phrasing', title: 'Phrasing', tone: 'orange', icon: <ScrollText size={18} />, body: <PhrasingBody /> },
      ]

  const expandedCard = cards.find((card) => card.id === expandedCardId) ?? null
  const fullscreenCard = cards.find((card) => card.id === fullscreenCardId) ?? null
  const floatingCard = cards.find((card) => card.id === floatingCardState?.id) ?? null
  const previewCard = cards.find((card) => card.id === previewCardId) ?? null

  useEffect(() => {
    return () => {
      if (previewCloseTimerRef.current) {
        window.clearTimeout(previewCloseTimerRef.current)
      }
      floatingDragCleanupRef.current?.()
    }
  }, [])

  const cancelPreviewClose = () => {
    if (previewCloseTimerRef.current) {
      window.clearTimeout(previewCloseTimerRef.current)
      previewCloseTimerRef.current = null
    }
  }
  const openPreview = (cardId, anchorTop = null) => {
    cancelPreviewClose()
    if (anchorTop != null) {
      setPreviewTop(anchorTop)
    }
    setPreviewCardId(cardId)
  }
  const closePreview = () => {
    cancelPreviewClose()
    previewCloseTimerRef.current = window.setTimeout(() => {
      setPreviewCardId(null)
      setPreviewTop(null)
      previewCloseTimerRef.current = null
    }, 90)
  }

  const openExpandedCard = (cardId) => {
    setExpandedCardId(cardId)
    setFullscreenCardId(null)
    setFloatingCardState(null)
  }

  const openFullscreenCard = (cardId) => {
    setFullscreenCardId(cardId)
    setExpandedCardId(null)
    setFloatingCardState(null)
    setPreviewCardId(null)
  }

  const openFloatingCard = (cardId) => {
    setFloatingCardState((current) => (current?.id === cardId ? current : createFloatingCardState(cardId)))
    setExpandedCardId(null)
    setFullscreenCardId(null)
    setPreviewCardId(null)
  }

  const closeFloatingCard = () => {
    floatingDragCleanupRef.current?.()
    setFloatingCardState(null)
  }

  const startFloatingDrag = (event) => {
    if (event.button !== 0 || !floatingCardState) {
      return
    }

    if (event.target.closest('button')) {
      return
    }

    const floatingElement = event.currentTarget.closest('.study-v2__supportFloating')
    if (!floatingElement) {
      return
    }

    const rect = floatingElement.getBoundingClientRect()
    const startPointerX = event.clientX
    const startPointerY = event.clientY
    const startLeft = floatingCardState.left ?? rect.left
    const startTop = floatingCardState.top ?? rect.top
    const cardWidth = rect.width
    const cardHeight = rect.height
    const viewportInset = 16

    const handlePointerMove = (moveEvent) => {
      setFloatingCardState((current) => {
        if (!current) {
          return current
        }

        return {
          ...current,
          left: clamp(
            startLeft + (moveEvent.clientX - startPointerX),
            viewportInset,
            Math.max(viewportInset, window.innerWidth - cardWidth - viewportInset),
          ),
          top: clamp(
            startTop + (moveEvent.clientY - startPointerY),
            viewportInset,
            Math.max(viewportInset, window.innerHeight - cardHeight - viewportInset),
          ),
        }
      })
    }

    const cleanupDrag = () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', cleanupDrag)
      floatingDragCleanupRef.current = null
    }

    floatingDragCleanupRef.current?.()
    floatingDragCleanupRef.current = cleanupDrag

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', cleanupDrag)
  }

  const expandFromCollapsedPreview = (cardId) => {
    openExpandedCard(cardId)
    setPreviewCardId(null)
    onToggleCollapsed?.()
  }
  const openFullscreenFromCollapsedPreview = (cardId) => openFullscreenCard(cardId)
  const floatFromCollapsedPreview = (cardId) => openFloatingCard(cardId)

  if (collapsed) {
    return (
      <aside className="study-v2 study-v2__railPanel study-v2__supportPanel is-collapsed" data-debug-item="study_support_collapsed">
        <div className="study-v2__supportHeader" style={{ justifyContent: 'center', padding: 0 }}>
          <StudyPaneToggle collapsed={collapsed} side="right" label="Expand support" onClick={onToggleCollapsed} />
        </div>
        <div className="study-v2__collapsedRailBody">
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              className="study-v2__collapsedSupportButton"
              style={toneStyle(card.tone)}
              aria-label={card.title}
              title={`Open ${card.title}`}
              onMouseEnter={(event) => openPreview(card.id, Math.max(12, event.currentTarget.offsetTop - 8))}
              onMouseLeave={closePreview}
              onFocus={(event) => openPreview(card.id, Math.max(12, event.currentTarget.offsetTop - 8))}
              onBlur={closePreview}
              onClick={() => openFloatingCard(card.id)}
            >
              <span className="study-v2__supportIcon">{card.icon}</span>
            </button>
          ))}
        </div>
        {previewCard ? (
          <StudyDetachedSupportCard
            card={previewCard}
            className="study-v2__supportPreview"
            preview
            style={previewTop != null ? { top: `${previewTop}px` } : undefined}
            onPreviewEnter={() => openPreview(previewCard.id, previewTop)}
            onPreviewLeave={closePreview}
            onExpand={() => expandFromCollapsedPreview(previewCard.id)}
            onFullscreen={() => openFullscreenFromCollapsedPreview(previewCard.id)}
            onFloat={() => floatFromCollapsedPreview(previewCard.id)}
          />
        ) : null}
        {floatingCard ? (
          <StudyDetachedSupportCard
            card={floatingCard}
            className="study-v2__supportFloating"
            style={{
              left: `${floatingCardState.left}px`,
              top: `${floatingCardState.top}px`,
            }}
            draggable
            onDragStart={startFloatingDrag}
            onClose={closeFloatingCard}
            onFullscreen={() => openFullscreenCard(floatingCard.id)}
          />
        ) : null}
        {fullscreenCard ? <StudyFullscreenSupportCard card={fullscreenCard} onClose={() => setFullscreenCardId(null)} /> : null}
      </aside>
    )
  }

  return (
    <aside className="study-v2 study-v2__railPanel study-v2__supportPanel" data-debug-item="study_support_rail">
      <div className="study-v2__supportHeader">
        <span>Support</span>
        <StudyPaneToggle collapsed={collapsed} side="right" label="Collapse support" onClick={onToggleCollapsed} />
      </div>
      <div className="study-v2__supportBody">
        {cards.map((card) => (
          <StudySupportCard
            key={card.id}
            {...card}
            onExpand={() => openExpandedCard(card.id)}
            onFullscreen={() => openFullscreenCard(card.id)}
            onFloat={() => openFloatingCard(card.id)}
          />
        ))}
      </div>
      {expandedCard ? (
        <section className="study-v2__supportOverlay" style={toneStyle(expandedCard.tone)} data-debug-item="study_support_overlay">
          <div className="study-v2__supportOverlayHeader">
            <span className="study-v2__supportIcon">{expandedCard.icon}</span>
            <h3 className="study-v2__supportTitle">{expandedCard.title}</h3>
            <IconActionButton
              size="utility-sm"
              label={`Open ${expandedCard.title} fullscreen`}
              title={`Open ${expandedCard.title} fullscreen`}
              onClick={() => setFullscreenCardId(expandedCard.id)}
              icon={<Maximize2 strokeWidth={1.8} />}
            />
            <IconActionButton
              className="study-v2__supportOverlayClose"
              size="utility-sm"
              label={`Close ${expandedCard.title}`}
              title={`Close ${expandedCard.title}`}
              onClick={() => setExpandedCardId(null)}
              icon={<X strokeWidth={1.8} />}
            />
          </div>
          <div className="study-v2__supportOverlayBody">{expandedCard.body}</div>
        </section>
      ) : null}
      {floatingCard ? (
        <StudyDetachedSupportCard
          card={floatingCard}
          className="study-v2__supportFloating"
          style={{
            left: `${floatingCardState.left}px`,
            top: `${floatingCardState.top}px`,
          }}
          draggable
          onDragStart={startFloatingDrag}
          onClose={closeFloatingCard}
          onFullscreen={() => openFullscreenCard(floatingCard.id)}
        />
      ) : null}
      {fullscreenCard ? <StudyFullscreenSupportCard card={fullscreenCard} onClose={() => setFullscreenCardId(null)} /> : null}
    </aside>
  )
}

function StudySupportCard({ tone, icon, title, body, onExpand, onFullscreen, onFloat }) {
  return (
    <section className="study-v2__supportCard" style={toneStyle(tone)}>
      <div className="study-v2__supportCardHeader">
        <span className="study-v2__supportIcon">{icon}</span>
        <h3 className="study-v2__supportTitle">{title}</h3>
        <div className="study-v2__supportCardActions">
          <IconActionButton
            size="utility-sm"
            label={`Expand ${title} in support panel`}
            title={`Expand ${title} in support panel`}
            onClick={onExpand}
            icon={<ChevronsLeft strokeWidth={1.8} />}
          />
          <IconActionButton
            size="utility-sm"
            label={`Open ${title} fullscreen`}
            title={`Open ${title} fullscreen`}
            onClick={onFullscreen}
            icon={<Maximize2 strokeWidth={1.8} />}
          />
          <IconActionButton
            size="utility-sm"
            label={`Float ${title}`}
            title={`Float ${title}`}
            onClick={onFloat}
            icon={<Pin strokeWidth={1.8} />}
          />
        </div>
      </div>
      <div className="study-v2__supportCardBody">{body}</div>
    </section>
  )
}

function StudyDetachedSupportCard({
  card,
  className,
  style,
  onClose,
  onFullscreen,
  onExpand,
  onFloat,
  onDragStart,
  onPreviewEnter,
  onPreviewLeave,
  draggable = false,
  preview = false,
}) {
  return (
    <section
      className={`study-v2 ${className}`}
      data-debug-item={preview ? 'study_support_preview' : 'study_support_floating'}
      style={style}
      onMouseEnter={preview ? onPreviewEnter : undefined}
      onMouseLeave={preview ? onPreviewLeave : undefined}
    >
      <section className="study-v2__supportCard" style={toneStyle(card.tone)}>
        <div
          className={`study-v2__supportCardHeader${draggable ? ' is-draggable' : ''}`}
          onPointerDown={draggable ? onDragStart : undefined}
        >
          <span className="study-v2__supportIcon">{card.icon}</span>
          <h3 className="study-v2__supportTitle">{card.title}</h3>
          {preview && onExpand ? (
            <IconActionButton
              className="study-v2__supportExpand"
              size="utility-sm"
              label={`Expand ${card.title} in panel`}
              title={`Expand ${card.title} in panel`}
              onClick={onExpand}
              icon={<ChevronsLeft strokeWidth={1.8} />}
            />
          ) : null}
          {preview && onFullscreen ? (
            <IconActionButton
              size="utility-sm"
              label={`Open ${card.title} fullscreen`}
              title={`Open ${card.title} fullscreen`}
              onClick={onFullscreen}
              icon={<Maximize2 strokeWidth={1.8} />}
            />
          ) : null}
          {preview && onFloat ? (
            <IconActionButton
              size="utility-sm"
              label={`Float ${card.title}`}
              title={`Float ${card.title}`}
              onClick={onFloat}
              icon={<Pin strokeWidth={1.8} />}
            />
          ) : null}
          {!preview && onFullscreen ? (
            <IconActionButton
              className="study-v2__supportExpand"
              size="utility-sm"
              label={`Open ${card.title} fullscreen`}
              title={`Open ${card.title} fullscreen`}
              onClick={onFullscreen}
              icon={<Maximize2 strokeWidth={1.8} />}
            />
          ) : null}
          {!preview && onClose ? (
            <IconActionButton
              size="utility-sm"
              label={`Close ${card.title}`}
              title={`Close ${card.title}`}
              onClick={onClose}
              icon={<X strokeWidth={1.8} />}
            />
          ) : null}
        </div>
        <div className="study-v2__supportCardBody">{card.body}</div>
      </section>
    </section>
  )
}

function StudyFullscreenSupportCard({ card, onClose }) {
  const fullscreenCard = (
    <div className="study-v2 study-v2__supportFullscreenBackdrop" data-debug-item="study_support_fullscreen">
      <section className="study-v2__supportFullscreen" style={toneStyle(card.tone)}>
        <div className="study-v2__supportOverlayHeader">
          <span className="study-v2__supportIcon">{card.icon}</span>
          <h3 className="study-v2__supportTitle">{card.title}</h3>
          <IconActionButton
            className="study-v2__supportOverlayClose"
            size="utility-sm"
            label={`Close ${card.title}`}
            title={`Close ${card.title}`}
            onClick={onClose}
            icon={<X strokeWidth={1.8} />}
          />
        </div>
        <div className="study-v2__supportOverlayBody">{card.body}</div>
      </section>
    </div>
  )

  if (typeof document === 'undefined') {
    return fullscreenCard
  }

  return createPortal(fullscreenCard, document.body)
}

function GuidanceBody() {
  return (
    <p className="study-v2__supportText">
      Focus on accurately translating the conditions for Jumu&apos;ah validity. Pay close attention to the definition of{' '}
      <span className="study-v2__arabicInline" dir="rtl">مصر جامع</span> and distinguish the different opinions.
    </p>
  )
}

function LexicographyBody() {
  return (
    <div className="study-v2__supportStack">
      <div className="study-v2__supportEntry">
        <div className="study-v2__supportEntryRow">
          <span className="study-v2__arabicInline" dir="rtl">مصر جامع</span>
          <span className="study-v2__mono">misr jāmiʿ</span>
        </div>
        <p className="study-v2__supportText">Comprehensive city; a large urban center with civic amenities.</p>
        <div className="study-v2__contextBox">
          <strong>Context:</strong> In Hanafi fiqh, usually defined by a judge and ruler capable of enforcing law.
        </div>
      </div>
      <div className="study-v2__supportEntry">
        <div className="study-v2__supportEntryRow">
          <span className="study-v2__arabicInline" dir="rtl">أفنية</span>
          <span className="study-v2__mono">afniyah</span>
        </div>
        <p className="study-v2__supportText">Outskirts or immediate surrounding areas attached to the city.</p>
      </div>
    </div>
  )
}

function PhrasingBody() {
  return (
    <div className="study-v2__supportStack">
      <div className="study-v2__supportEntry">
        <div className="study-v2__supportEntryRow">
          <span className="study-v2__arabicInline" dir="rtl">لا تصح الجمعة إلا في مصر جامع</span>
          <span className="study-v2__mono">misr jamiʿ</span>
        </div>
        <p className="study-v2__supportText">Phrase this as a condition of validity, not a recommendation.</p>
      </div>
      <div className="study-v2__supportEntry">
        <div className="study-v2__supportEntryRow">
          <span className="study-v2__arabicInline" dir="rtl">بل تجوز في جميع أفنية المصر</span>
          <span className="study-v2__mono">afniyat al-miṣr</span>
        </div>
        <p className="study-v2__supportText">Preserve the argumentative turn: rather, it is permissible throughout the outskirts.</p>
      </div>
    </div>
  )
}

function FixStepsBody() {
  return (
    <div className="study-v2__supportStack">
      <p className="study-v2__supportText">State the opening rule as a firm validity condition.</p>
      <p className="study-v2__supportText">Separate the views so Abū Yūsuf and the secondary report are not blended.</p>
      <p className="study-v2__supportText">Keep the outskirts clause attached to the legal extension of the city.</p>
    </div>
  )
}

function TakeawaysBody() {
  return (
    <ul className="study-v2__takeawayList">
      <li className="study-v2__takeawayItem">
        <span className="study-v2__takeawayDot" aria-hidden="true" />
        <span>The term <span className="study-v2__arabicInline" dir="rtl">مصر جامع</span> sets the legal frame for Friday prayers.</span>
      </li>
      <li className="study-v2__takeawayItem">
        <span className="study-v2__takeawayDot" aria-hidden="true" />
        <span>Differing opinions should remain clearly attributed rather than blended.</span>
      </li>
      <li className="study-v2__takeawayItem">
        <span className="study-v2__takeawayDot" aria-hidden="true" />
        <span>The outskirts clause carries the same legal weight as the city centre.</span>
      </li>
    </ul>
  )
}

function GradeBody({ failed }) {
  return (
    <div className="study-v2__gradeBody">
      <div className="study-v2__gradeCircle">{failed ? '4.2' : '8.4'}</div>
      <p className="study-v2__gradeMeta">
        <strong>Reviewed:</strong> 15 Mar 2026
        <br />
        {failed ? 'Model review found structural issues to repair.' : 'Model evaluation with a scholar-facing rubric'}
      </p>
      <div className="study-v2__insightBox is-success">
        <p className="study-v2__insightTitle">
          <span className="study-v2__insightDot" aria-hidden="true" />
          Strengths
        </p>
        <p className="study-v2__supportText">
          Accurate treatment of the core city-condition terminology and the prayer-area distinction.
        </p>
      </div>
      <div className="study-v2__insightBox is-review">
        <p className="study-v2__insightTitle">
          <span className="study-v2__insightDot" aria-hidden="true" />
          Areas for improvement
        </p>
        <p className="study-v2__supportText">
          Add a little more context for the attributed opinions so the legal reasoning stays clear.
        </p>
      </div>
      <div className="study-v2__insightBox is-blue">
        <p className="study-v2__insightTitle">
          <span className="study-v2__insightDot" aria-hidden="true" />
          Suggestion
        </p>
        <p className="study-v2__supportText">
          Consider a brief explanatory note for the attached outskirts phrase.
        </p>
      </div>
    </div>
  )
}

export function StudyBottomBar({ progressText, progressStep, progressTotal, onPrevious, onNext, canPrevious, canNext }) {
  return (
    <footer className="study-v2 study-v2__bottomBar" data-debug-item="study_bottom_bar">
      <button type="button" className="study-v2__secondaryAction" onClick={onPrevious} disabled={!canPrevious}>
        <ChevronLeft size={16} />
        Previous segment
      </button>
      <div className="study-v2__progress">
        <p className="study-v2__progressText">{progressText}</p>
        <div className="study-v2__progressBars">
          {Array.from({ length: Math.min(progressTotal, 5) }, (_, index) => (
            <span key={index} className={`study-v2__progressBar${index === Math.min(progressStep, 4) ? ' is-active' : ''}`} />
          ))}
        </div>
      </div>
      <PrimaryCTA minWidth={172} height={44} endIcon={<ChevronRight size={16} />} onClick={onNext} disabled={!canNext}>
        Next segment
      </PrimaryCTA>
    </footer>
  )
}
