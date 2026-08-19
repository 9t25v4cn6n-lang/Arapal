import { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Home,
  Info,
  LayoutGrid,
  Maximize2,
  MessageSquare,
  Plus,
  ScrollText,
  Send,
  Sparkles,
  Star,
  Tag,
} from 'lucide-react';

const galleryStyles = `
  @keyframes restyleFloatIn {
    from {
      opacity: 0;
      transform: translateY(18px) scale(0.985);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes restyleFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes restyleGlowDrift {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
    }
    50% {
      transform: translate3d(0, -1.5%, 0) scale(1.04);
    }
    100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  .restyle-gallery,
  .restyle-gallery * {
    box-sizing: border-box;
  }

  .restyle-gallery {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    color: var(--text-main);
    background: var(--page-bg);
    font-family: var(--body-font);
  }

  .restyle-gallery__wash {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(circle at 10% 10%, var(--wash-one) 0%, transparent 34%),
      radial-gradient(circle at 90% 0%, var(--wash-two) 0%, transparent 32%),
      radial-gradient(circle at 50% 100%, var(--wash-three) 0%, transparent 42%);
    opacity: 0.9;
    animation: restyleGlowDrift 18s ease-in-out infinite;
    will-change: transform;
  }

  .restyle-gallery__grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 32px 32px;
    mix-blend-mode: soft-light;
    opacity: var(--grid-opacity);
  }

  .restyle-gallery__shell {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .restyle-gallery__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 22px;
    border-radius: 28px;
    border: 1px solid var(--shell-border);
    background: var(--shell-bg);
    box-shadow: var(--shell-shadow);
    backdrop-filter: blur(20px);
    animation: restyleFloatIn 560ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .restyle-gallery__toolbarMain {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .restyle-gallery__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-soft);
  }

  .restyle-gallery__title {
    margin: 0;
    font-family: var(--display-font);
    font-size: clamp(26px, 2vw, 34px);
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: var(--text-strong);
  }

  .restyle-gallery__subtext {
    margin: 0;
    max-width: 72ch;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-soft);
  }

  .restyle-gallery__controls {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .restyle-gallery__pillRow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 999px;
    border: 1px solid var(--shell-border);
    background: rgba(255,255,255,0.32);
    backdrop-filter: blur(14px);
  }

  .restyle-gallery__pillButton {
    border: 1px solid transparent;
    background: transparent;
    color: var(--text-soft);
    min-height: 38px;
    padding: 0 16px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.18s ease, background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
  }

  .restyle-gallery__pillButton:hover {
    transform: translateY(-1px);
    color: var(--text-strong);
    background: rgba(255,255,255,0.52);
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
  }

  .restyle-gallery__pillButton.is-active {
    color: var(--text-strong);
    background: var(--accent-soft);
    border-color: var(--accent-border);
    box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
  }

  .restyle-gallery__note {
    padding: 10px 14px;
    border-radius: 16px;
    background: rgba(255,255,255,0.22);
    border: 1px solid var(--shell-border);
    color: var(--text-soft);
    font-size: 12px;
    line-height: 1.5;
  }

  .restyle-gallery__conceptBoard {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
    animation: restyleFadeIn 420ms ease both;
  }

  .restyle-gallery__conceptCard {
    min-height: 0;
    border-radius: 32px;
    border: 1px solid var(--shell-border);
    background: rgba(255,255,255,0.36);
    box-shadow: var(--shell-shadow);
    backdrop-filter: blur(18px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: restyleFloatIn 620ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .restyle-gallery__conceptHeader {
    padding: 22px 22px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.2);
  }

  .restyle-gallery__conceptKicker {
    margin: 0 0 8px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-soft);
  }

  .restyle-gallery__conceptTitle {
    margin: 0 0 8px;
    font-family: var(--display-font);
    font-size: 26px;
    line-height: 1.04;
    letter-spacing: -0.03em;
    color: var(--text-strong);
  }

  .restyle-gallery__conceptText {
    margin: 0;
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-main);
  }

  .restyle-gallery__conceptBody {
    padding: 20px 22px 24px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .restyle-gallery__conceptPreview {
    aspect-ratio: 0.73;
    border-radius: 28px;
    overflow: hidden;
    background: var(--concept-page);
    border: 1px solid var(--concept-border);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.34), 0 18px 34px rgba(15, 23, 42, 0.12);
    display: grid;
    grid-template-columns: 44px 110px 1fr 120px;
    position: relative;
  }

  .restyle-gallery__conceptPreview::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--concept-overlay);
    pointer-events: none;
  }

  .restyle-gallery__conceptRail {
    border-right: 1px solid var(--concept-border);
    background: var(--concept-rail);
    position: relative;
  }

  .restyle-gallery__conceptRail::before {
    content: "";
    position: absolute;
    top: 18px;
    left: 14px;
    width: 16px;
    height: 16px;
    border-radius: 6px;
    background: var(--concept-accent);
    opacity: 0.9;
  }

  .restyle-gallery__conceptSegments {
    border-right: 1px solid var(--concept-border);
    background: var(--concept-segments);
    padding: 18px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .restyle-gallery__conceptSegmentLine {
    height: 8px;
    border-radius: 999px;
    background: rgba(17, 24, 39, 0.14);
  }

  .restyle-gallery__conceptSegmentLine.is-short {
    width: 62%;
  }

  .restyle-gallery__conceptSegmentLine.is-active {
    background: var(--concept-accent);
    width: 74%;
  }

  .restyle-gallery__conceptMain {
    position: relative;
    padding: 20px 16px 18px;
    background: var(--concept-main);
  }

  .restyle-gallery__conceptMainTop {
    height: 34px;
    border-radius: 12px;
    margin-bottom: 18px;
    background: rgba(255,255,255,0.42);
  }

  .restyle-gallery__conceptDoc {
    border-radius: 22px;
    border: 1px solid var(--concept-border);
    background: var(--concept-sheet);
    padding: 18px 18px 20px;
    box-shadow: var(--concept-sheet-shadow);
  }

  .restyle-gallery__conceptDocHeader {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
  }

  .restyle-gallery__conceptDocBadge {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background: var(--concept-accent-soft);
  }

  .restyle-gallery__conceptDocLabel {
    height: 8px;
    width: 82px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.18);
  }

  .restyle-gallery__conceptTextLine {
    height: 10px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.1);
    margin-bottom: 8px;
  }

  .restyle-gallery__conceptTextLine.is-arabic {
    height: 14px;
    background: rgba(15, 23, 42, 0.18);
  }

  .restyle-gallery__conceptTextLine.is-long {
    width: 100%;
  }

  .restyle-gallery__conceptTextLine.is-medium {
    width: 76%;
  }

  .restyle-gallery__conceptTextLine.is-short {
    width: 58%;
  }

  .restyle-gallery__conceptLex {
    display: flex;
    gap: 8px;
    margin-top: 14px;
  }

  .restyle-gallery__conceptLexChip {
    width: 58px;
    height: 24px;
    border-radius: 999px;
    background: rgba(255,255,255,0.88);
    border: 1px solid var(--concept-border);
  }

  .restyle-gallery__conceptBottom {
    margin-top: 16px;
    border-radius: 20px;
    border: 1px solid var(--concept-border);
    background: var(--concept-sheet);
    min-height: 88px;
  }

  .restyle-gallery__conceptRight {
    border-left: 1px solid var(--concept-border);
    background: var(--concept-right);
    padding: 18px 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .restyle-gallery__conceptMarginCard {
    border-radius: 16px;
    background: var(--concept-sheet);
    border: 1px solid var(--concept-border);
    min-height: 66px;
    padding: 12px;
  }

  .restyle-gallery__conceptMarginCard.is-tall {
    min-height: 110px;
  }

  .restyle-gallery__conceptBullets {
    margin: 0;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .restyle-gallery__conceptBullets li {
    font-size: 14px;
    line-height: 1.55;
    color: var(--text-main);
  }

  .restyle-gallery__frame {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: 78px 270px minmax(0, 1fr) 360px;
    gap: 18px;
    animation: restyleFadeIn 420ms ease both;
  }

  .restyle-gallery__panel {
    min-height: 0;
    border-radius: var(--panel-radius);
    border: 1px solid var(--panel-border);
    background: var(--panel-bg);
    box-shadow: var(--panel-shadow);
    backdrop-filter: blur(var(--panel-blur));
    overflow: hidden;
    animation: restyleFloatIn 620ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .restyle-gallery__rail {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 14px;
    gap: 14px;
  }

  .restyle-gallery__railMark {
    width: 40px;
    height: 40px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    font-family: var(--display-font);
    font-size: 20px;
    font-weight: 700;
    color: var(--accent);
    background: rgba(255,255,255,0.66);
    border: 1px solid rgba(255,255,255,0.5);
  }

  .restyle-gallery__railNav {
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .restyle-gallery__railButton {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--rail-icon);
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  }

  .restyle-gallery__railButton:hover,
  .restyle-gallery__railButton.is-active {
    color: var(--accent);
    background: rgba(255,255,255,0.56);
    transform: translateY(-1px);
    box-shadow: 0 10px 18px rgba(15, 23, 42, 0.08);
  }

  .restyle-gallery__railFooter {
    margin-top: auto;
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: var(--primary);
    color: #ffffff;
    display: grid;
    place-items: center;
    font-weight: 700;
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.18);
  }

  .restyle-gallery__left {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .restyle-gallery__leftHeader,
  .restyle-gallery__rightHeader {
    min-height: 54px;
    padding: 0 18px;
    border-bottom: 1px solid var(--edge);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-soft);
  }

  .restyle-gallery__leftScroll,
  .restyle-gallery__rightScroll {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 18px;
    scrollbar-gutter: stable;
  }

  .restyle-gallery__chapter {
    margin-bottom: 18px;
  }

  .restyle-gallery__chapterTitle {
    margin: 0 0 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 800;
    color: var(--text-main);
  }

  .restyle-gallery__segmentList {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .restyle-gallery__segmentRow {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 38px;
    padding: 0 12px;
    border-radius: 14px;
    color: var(--text-soft);
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
  }

  .restyle-gallery__segmentRow:hover {
    transform: translateX(2px);
    background: rgba(255,255,255,0.42);
  }

  .restyle-gallery__segmentRow.is-active {
    background: var(--accent-soft);
    color: var(--accent);
    box-shadow: inset 3px 0 0 var(--accent);
  }

  .restyle-gallery__segmentDot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    border: 1.5px solid currentColor;
    opacity: 0.85;
  }

  .restyle-gallery__segmentDot.is-solid {
    background: currentColor;
  }

  .restyle-gallery__center {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .restyle-gallery__centerHeader {
    min-height: 106px;
    padding: 22px 28px;
    border-bottom: 1px solid var(--edge);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
  }

  .restyle-gallery__bookTitle {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--display-font);
    font-size: 30px;
    line-height: 1.06;
    letter-spacing: -0.03em;
    color: var(--text-strong);
  }

  .restyle-gallery__bookMeta {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: var(--text-soft);
  }

  .restyle-gallery__metaChip {
    min-height: 30px;
    padding: 0 12px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.48);
    border: 1px solid var(--edge);
    color: var(--text-soft);
  }

  .restyle-gallery__status {
    min-height: 40px;
    padding: 0 16px;
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--accent);
    border: 1px solid var(--accent-border);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
    box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
  }

  .restyle-gallery__status.is-success {
    background: var(--success-soft);
    color: var(--success);
    border-color: var(--success-border);
  }

  .restyle-gallery__centerScroll {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 22px 28px 118px;
    display: flex;
    justify-content: center;
    background: var(--workspace-bg);
  }

  .restyle-gallery__centerInner {
    width: min(100%, 900px);
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .restyle-gallery__card {
    border-radius: var(--card-radius);
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    box-shadow: var(--card-shadow);
    overflow: hidden;
    animation: restyleFloatIn 620ms cubic-bezier(0.22, 1, 0.36, 1) both;
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  }

  .restyle-gallery__card:hover {
    transform: translateY(-2px);
    box-shadow: 0 26px 48px rgba(15, 23, 42, 0.12);
  }

  .restyle-gallery__cardHeader {
    min-height: 64px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    border-bottom: 1px solid var(--edge);
    background: var(--card-header-bg);
  }

  .restyle-gallery__cardTitleRow {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .restyle-gallery__badge {
    min-width: 34px;
    height: 34px;
    padding: 0 10px;
    border-radius: 12px;
    background: var(--accent-soft);
    color: var(--accent);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 800;
  }

  .restyle-gallery__label {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-soft);
  }

  .restyle-gallery__actionRow {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .restyle-gallery__ghost {
    border: 1px solid var(--edge);
    background: rgba(255,255,255,0.72);
    color: var(--text-soft);
    min-height: 34px;
    padding: 0 14px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    font-weight: 700;
    transition: transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
  }

  .restyle-gallery__ghost:hover {
    transform: translateY(-1px);
    background: rgba(255,255,255,0.92);
    border-color: var(--accent-border);
    color: var(--text-strong);
  }

  .restyle-gallery__cardBody {
    padding: 26px 28px 30px;
  }

  .restyle-gallery__arabic {
    margin: 0;
    font-family: "Amiri", "Noto Naskh Arabic", "Geeza Pro", serif;
    font-size: 25px;
    line-height: 2.25;
    text-align: right;
    color: var(--text-strong);
  }

  .restyle-gallery__bodyText {
    margin: 0;
    font-size: 16px;
    line-height: 1.75;
    color: var(--text-main);
  }

  .restyle-gallery__emptyState {
    padding: 34px 24px;
    border-radius: 20px;
    border: 2px dashed var(--edge);
    background: rgba(255,255,255,0.4);
    text-align: center;
    color: var(--text-soft);
  }

  .restyle-gallery__lexHeader {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-soft);
  }

  .restyle-gallery__lexStrip {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 6px;
    scrollbar-width: none;
  }

  .restyle-gallery__lexStrip::-webkit-scrollbar {
    display: none;
  }

  .restyle-gallery__lexChip {
    flex-shrink: 0;
    min-height: 48px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1px solid var(--edge);
    background: rgba(255,255,255,0.84);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
    transition: transform 0.18s ease, border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
  }

  .restyle-gallery__lexChip:hover {
    transform: translateY(-2px);
    border-color: var(--accent-border);
    background: rgba(255,255,255,0.96);
    box-shadow: 0 14px 28px rgba(15, 23, 42, 0.09);
  }

  .restyle-gallery__chipArabic {
    font-family: "Amiri", "Noto Naskh Arabic", "Geeza Pro", serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--text-strong);
  }

  .restyle-gallery__mono {
    font-family: "SFMono-Regular", "JetBrains Mono", "Menlo", monospace;
    font-size: 12px;
    color: var(--text-soft);
  }

  .restyle-gallery__editor {
    min-height: 230px;
    border-radius: var(--card-radius);
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    box-shadow: var(--card-shadow);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .restyle-gallery__editorBody {
    flex: 1;
    min-height: 0;
    padding: 26px 28px 78px;
    position: relative;
  }

  .restyle-gallery__placeholder {
    font-size: 16px;
    color: var(--text-soft);
  }

  .restyle-gallery__submitRow {
    position: absolute;
    right: 24px;
    bottom: 22px;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .restyle-gallery__hint {
    font-size: 12px;
    color: var(--text-soft);
  }

  .restyle-gallery__primary {
    border: none;
    min-height: 46px;
    padding: 0 22px;
    border-radius: 999px;
    background: var(--primary);
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 800;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.16);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
  }

  .restyle-gallery__primary:hover {
    transform: translateY(-2px);
    filter: saturate(1.04);
    box-shadow: 0 18px 34px rgba(15, 23, 42, 0.2);
  }

  .restyle-gallery__footer {
    position: absolute;
    left: 28px;
    right: 28px;
    bottom: 24px;
    min-height: 88px;
    border-radius: 24px;
    border: 1px solid var(--panel-border);
    background: var(--footer-bg);
    box-shadow: var(--footer-shadow);
    backdrop-filter: blur(14px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 18px 22px;
  }

  .restyle-gallery__progress {
    text-align: center;
  }

  .restyle-gallery__progressLabel {
    margin: 0 0 8px;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-soft);
  }

  .restyle-gallery__progressBars {
    display: flex;
    gap: 6px;
    justify-content: center;
  }

  .restyle-gallery__progressBar {
    width: 42px;
    height: 5px;
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.22);
  }

  .restyle-gallery__progressBar.is-active {
    background: var(--accent);
  }

  .restyle-gallery__supportCard {
    border-radius: var(--card-radius);
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    box-shadow: var(--card-shadow);
    overflow: hidden;
    animation: restyleFloatIn 620ms cubic-bezier(0.22, 1, 0.36, 1) both;
    transition: transform 0.22s ease, box-shadow 0.22s ease;
  }

  .restyle-gallery__supportCard:hover {
    transform: translateY(-2px);
    box-shadow: 0 24px 42px rgba(15, 23, 42, 0.12);
  }

  .restyle-gallery__supportHeader {
    min-height: 54px;
    padding: 0 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid var(--edge);
    background: var(--tint-bg);
  }

  .restyle-gallery__supportTitle {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 800;
    color: var(--text-strong);
  }

  .restyle-gallery__supportBody {
    padding: 18px 18px 22px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .restyle-gallery__gradeCircle {
    width: 122px;
    height: 122px;
    border-radius: 999px;
    border: 5px solid rgba(110, 231, 183, 0.8);
    background: linear-gradient(145deg, rgba(209, 250, 229, 0.9), rgba(236, 253, 245, 0.6));
    display: grid;
    place-items: center;
    margin: 6px auto 2px;
    font-size: 44px;
    font-weight: 800;
    color: var(--success);
  }

  .restyle-gallery__gradeMeta {
    margin: 0;
    text-align: center;
    font-size: 12px;
    line-height: 1.5;
    color: var(--text-soft);
  }

  .restyle-gallery__feedback {
    padding: 16px 16px 18px;
    border-radius: 18px;
    border: 1px solid var(--feedback-border);
    background: var(--feedback-bg);
  }

  .restyle-gallery__feedbackTitle {
    margin: 0 0 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 800;
    color: var(--feedback-title);
  }

  .restyle-gallery__feedbackText {
    margin: 0;
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-main);
  }

  .restyle-gallery__rightEntry {
    padding-bottom: 16px;
    border-bottom: 1px solid var(--edge);
  }

  .restyle-gallery__rightEntry:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  .restyle-gallery__rightRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
  }

  .restyle-gallery__contextBox {
    padding: 14px 16px;
    border-radius: 14px;
    background: rgba(248,250,252,0.74);
    border: 1px solid var(--edge);
    color: var(--text-main);
    line-height: 1.55;
    font-size: 12px;
  }

  .restyle-gallery__bulletList {
    margin: 0;
    padding-left: 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    color: var(--text-main);
  }

  .restyle-gallery__bulletList li {
    font-size: 15px;
    line-height: 1.7;
  }

  @media (max-width: 1380px) {
    .restyle-gallery__frame {
      grid-template-columns: 72px 238px minmax(0, 1fr) 320px;
    }

    .restyle-gallery__centerInner {
      width: min(100%, 780px);
    }
  }

  @media (max-width: 1260px) {
    .restyle-gallery__conceptBoard {
      grid-template-columns: 1fr;
    }
  }
`;

const segments = [
  {
    title: 'Chapter 1: Purity',
    items: ['1.1 Types of Water', '1.2 Ablution (Wudu)', '1.3 Ghusl', '1.4 Tayammum'],
    active: '1.3 Ghusl',
  },
  {
    title: 'Chapter 2: Prayer',
    items: ['2.1 Times of Prayer', '2.2 Conditions', "2.3 Jumu'ah"],
    active: null,
  },
  {
    title: 'Chapter 3: Fasting',
    items: [],
    active: null,
  },
];

const quickLex = [
  { arabic: 'مصر جامع', mono: 'miṣr jāmiʿ' },
  { arabic: 'أفنية', mono: 'afniyah' },
  { arabic: 'مصلى', mono: 'muṣallā' },
];

const sourceText = `لا تصح الجمعة إلا في مصر جامع أو في مصلى المصر ولا تجوز في القرى لقوله ﷺ "لا جمعة ولا تشريق ولا فطر ولا أضحى إلا في مصر جامع" والمصر الجامع كل موضع له أمير وقاض ينفذ الأحكام ويقيم الحدود وهذا عند أبي يوسف رحمه الله وعنه أنهم إذا اجتمعوا في أكبر مساجدهم لم يسعهم والأول اختيار الكرخي وهو الظاهر والثاني اختيار الثلجي والحكم غير مقصور على المصلي بل تجوز في جميع أفنية المصر لأنها بمنزلته في حوائج أهله`;

const bestInClassTranslation = `The Friday prayer is only valid in a comprehensive city (miṣr jāmiʿ) or in the prayer area of the city, and it is not permissible in villages. This is based on the saying of the Prophet ﷺ: "There is no Friday prayer, nor meat-drying, nor Eid al-Fitr, nor Eid al-Adha except in a comprehensive city."`;

const userTranslation = `Jumu'ah prayer is only valid in a comprehensive city (misr jami') or in the prayer area (musalla) of the city. It is not permissible in villages...`;

const themes = {
  editorial: {
    id: 'editorial',
    name: 'Monograph Luxe',
    tagline: 'A quiet, editorial luxury treatment with vellum surfaces, sharp hierarchy, and a museum-book confidence.',
    vars: {
      '--page-bg': 'linear-gradient(180deg, #f6efe2 0%, #efe7d8 100%)',
      '--wash-one': 'rgba(35, 74, 172, 0.12)',
      '--wash-two': 'rgba(189, 150, 86, 0.12)',
      '--wash-three': 'rgba(255, 255, 255, 0.4)',
      '--grid-opacity': '0.14',
      '--shell-bg': 'rgba(255, 250, 244, 0.72)',
      '--shell-border': 'rgba(162, 140, 104, 0.2)',
      '--shell-shadow': '0 24px 60px rgba(84, 60, 20, 0.12)',
      '--panel-bg': 'rgba(255, 252, 247, 0.8)',
      '--panel-border': 'rgba(160, 142, 112, 0.22)',
      '--panel-shadow': '0 16px 36px rgba(87, 65, 29, 0.08)',
      '--panel-blur': '14px',
      '--footer-bg': 'rgba(255, 252, 247, 0.88)',
      '--footer-shadow': '0 16px 38px rgba(87, 65, 29, 0.1)',
      '--workspace-bg': 'linear-gradient(180deg, rgba(255,252,247,0.34), rgba(248,241,230,0.54))',
      '--card-bg': '#fffdfa',
      '--card-border': '#e5d9c9',
      '--card-shadow': '0 20px 38px rgba(87, 65, 29, 0.08)',
      '--card-header-bg': 'rgba(249, 244, 236, 0.84)',
      '--panel-radius': '28px',
      '--card-radius': '28px',
      '--accent': '#1847b7',
      '--accent-soft': 'rgba(31, 74, 188, 0.1)',
      '--accent-border': 'rgba(31, 74, 188, 0.18)',
      '--success': '#0f8c63',
      '--success-soft': 'rgba(15, 140, 99, 0.1)',
      '--success-border': 'rgba(15, 140, 99, 0.2)',
      '--primary': 'linear-gradient(135deg, #2c63e0 0%, #1847b7 100%)',
      '--text-strong': '#1f2430',
      '--text-main': '#3d4657',
      '--text-soft': '#7d899d',
      '--edge': 'rgba(137, 148, 168, 0.18)',
      '--rail-icon': '#8f98a8',
      '--display-font': '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif',
      '--body-font': '"Avenir Next", "Segoe UI", sans-serif',
    },
  },
  glass: {
    id: 'glass',
    name: 'Signal Glass',
    tagline: 'A cinematic learning lab with frosted glass planes, electric blue highlights, and luminous depth.',
    vars: {
      '--page-bg': 'radial-gradient(circle at 12% 12%, #1d4f90 0%, #081423 36%, #03060c 100%)',
      '--wash-one': 'rgba(44, 212, 255, 0.22)',
      '--wash-two': 'rgba(86, 97, 255, 0.18)',
      '--wash-three': 'rgba(255, 255, 255, 0.08)',
      '--grid-opacity': '0.24',
      '--shell-bg': 'rgba(9, 18, 33, 0.62)',
      '--shell-border': 'rgba(138, 196, 255, 0.14)',
      '--shell-shadow': '0 28px 64px rgba(2, 8, 23, 0.44)',
      '--panel-bg': 'rgba(9, 18, 33, 0.58)',
      '--panel-border': 'rgba(129, 181, 255, 0.16)',
      '--panel-shadow': '0 20px 48px rgba(2, 8, 23, 0.42)',
      '--panel-blur': '24px',
      '--footer-bg': 'rgba(8, 16, 28, 0.76)',
      '--footer-shadow': '0 18px 40px rgba(2, 8, 23, 0.42)',
      '--workspace-bg': 'linear-gradient(180deg, rgba(8,16,28,0.24), rgba(5,10,18,0.56))',
      '--card-bg': 'rgba(11, 20, 34, 0.82)',
      '--card-border': 'rgba(143, 193, 255, 0.18)',
      '--card-shadow': '0 24px 48px rgba(2, 8, 23, 0.34)',
      '--card-header-bg': 'rgba(15, 28, 48, 0.92)',
      '--panel-radius': '30px',
      '--card-radius': '30px',
      '--accent': '#52c8ff',
      '--accent-soft': 'rgba(82, 200, 255, 0.14)',
      '--accent-border': 'rgba(82, 200, 255, 0.22)',
      '--success': '#6ee7b7',
      '--success-soft': 'rgba(110, 231, 183, 0.12)',
      '--success-border': 'rgba(110, 231, 183, 0.24)',
      '--primary': 'linear-gradient(135deg, #2ed3ff 0%, #3467ff 100%)',
      '--text-strong': '#f4f8ff',
      '--text-main': '#d0d9ec',
      '--text-soft': '#91a1bd',
      '--edge': 'rgba(148, 163, 184, 0.18)',
      '--rail-icon': '#92a8ca',
      '--display-font': '"Avenir Next", "Trebuchet MS", "Segoe UI", sans-serif',
      '--body-font': '"Avenir Next", "Segoe UI", sans-serif',
    },
  },
  atelier: {
    id: 'atelier',
    name: 'Sunlit Atelier',
    tagline: 'A warm, tactile studio language with sculpted panels, sun-baked color, and approachable premium softness.',
    vars: {
      '--page-bg': 'linear-gradient(180deg, #f7efe5 0%, #f1e4d5 48%, #ead8c5 100%)',
      '--wash-one': 'rgba(230, 120, 70, 0.14)',
      '--wash-two': 'rgba(56, 107, 92, 0.12)',
      '--wash-three': 'rgba(255, 255, 255, 0.28)',
      '--grid-opacity': '0.1',
      '--shell-bg': 'rgba(255, 248, 240, 0.68)',
      '--shell-border': 'rgba(171, 132, 101, 0.18)',
      '--shell-shadow': '0 26px 62px rgba(115, 73, 35, 0.12)',
      '--panel-bg': 'rgba(255, 250, 244, 0.76)',
      '--panel-border': 'rgba(168, 129, 99, 0.2)',
      '--panel-shadow': '0 18px 40px rgba(115, 73, 35, 0.08)',
      '--panel-blur': '12px',
      '--footer-bg': 'rgba(255, 251, 246, 0.88)',
      '--footer-shadow': '0 18px 38px rgba(115, 73, 35, 0.1)',
      '--workspace-bg': 'linear-gradient(180deg, rgba(255,250,244,0.4), rgba(246,237,226,0.78))',
      '--card-bg': '#fffaf4',
      '--card-border': '#ebdac7',
      '--card-shadow': '0 18px 34px rgba(115, 73, 35, 0.08)',
      '--card-header-bg': 'rgba(252, 243, 232, 0.92)',
      '--panel-radius': '32px',
      '--card-radius': '32px',
      '--accent': '#c8633d',
      '--accent-soft': 'rgba(200, 99, 61, 0.11)',
      '--accent-border': 'rgba(200, 99, 61, 0.18)',
      '--success': '#1f8d69',
      '--success-soft': 'rgba(31, 141, 105, 0.1)',
      '--success-border': 'rgba(31, 141, 105, 0.18)',
      '--primary': 'linear-gradient(135deg, #de7a44 0%, #c8633d 100%)',
      '--text-strong': '#263039',
      '--text-main': '#4b5563',
      '--text-soft': '#8b7f77',
      '--edge': 'rgba(157, 133, 111, 0.18)',
      '--rail-icon': '#977d6d',
      '--display-font': '"Charter", "Iowan Old Style", Georgia, serif',
      '--body-font': '"Optima", "Avenir Next", "Segoe UI", sans-serif',
    },
  },
};

const conceptMockups = [
  {
    id: 'study-desk',
    title: 'Study Desk',
    kicker: 'North Star Concept',
    text: 'Treat the center as a real desk surface: one primary sheet, compact reference tools beneath, and support materials arranged like objects placed within reach.',
    bullets: [
      'Center card becomes a sheet on a desk, not a generic SaaS card',
      'Lexicography feels like slips and study tools rather than chips',
      'Overall emotional tone shifts toward craft, concentration, and ritual',
    ],
    style: {
      '--concept-page': 'linear-gradient(180deg, #efe4d1 0%, #e8dcc7 100%)',
      '--concept-overlay': 'radial-gradient(circle at 20% 10%, rgba(255,255,255,0.38), transparent 34%)',
      '--concept-border': 'rgba(141, 119, 88, 0.2)',
      '--concept-rail': 'rgba(253, 248, 240, 0.82)',
      '--concept-segments': 'rgba(255, 250, 244, 0.84)',
      '--concept-main': 'rgba(244, 236, 223, 0.92)',
      '--concept-right': 'rgba(255, 248, 240, 0.88)',
      '--concept-sheet': '#fffaf1',
      '--concept-sheet-shadow': '0 16px 30px rgba(92, 65, 24, 0.1)',
      '--concept-accent': '#1b4db8',
      '--concept-accent-soft': 'rgba(27, 77, 184, 0.14)',
    },
  },
  {
    id: 'marginalia',
    title: 'Manuscript + Commentary',
    kicker: 'North Star Concept',
    text: 'Use the historical logic of text and commentary: the Arabic becomes the anchor object, and the right side reads as marginalia rather than product cards.',
    bullets: [
      'Arabic dominates as the artifact under study',
      'Support panels feel like commentary margins and scholia',
      'Most UI chrome is stripped back so the page feels textual first',
    ],
    style: {
      '--concept-page': 'linear-gradient(180deg, #eef2ff 0%, #e4ebff 100%)',
      '--concept-overlay': 'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06))',
      '--concept-border': 'rgba(114, 132, 196, 0.18)',
      '--concept-rail': 'rgba(247, 249, 255, 0.84)',
      '--concept-segments': 'rgba(249, 250, 255, 0.88)',
      '--concept-main': 'rgba(239, 243, 255, 0.9)',
      '--concept-right': 'rgba(247, 249, 255, 0.9)',
      '--concept-sheet': '#ffffff',
      '--concept-sheet-shadow': '0 18px 30px rgba(74, 94, 152, 0.1)',
      '--concept-accent': '#4f46e5',
      '--concept-accent-soft': 'rgba(79, 70, 229, 0.12)',
    },
  },
  {
    id: 'instrument',
    title: 'Scholar’s Instrument',
    kicker: 'North Star Concept',
    text: 'A more severe, precision-led direction where the product feels like an instrument of study rather than a collaboration dashboard.',
    bullets: [
      'Typography leads more than color or decoration',
      'Progress and evaluation feel like mastery signals',
      'The structure stays familiar, but the product reads as a serious tool',
    ],
    style: {
      '--concept-page': 'linear-gradient(180deg, #f5f6f8 0%, #eceef2 100%)',
      '--concept-overlay': 'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.02))',
      '--concept-border': 'rgba(100, 116, 139, 0.18)',
      '--concept-rail': 'rgba(252, 252, 253, 0.86)',
      '--concept-segments': 'rgba(250, 251, 252, 0.88)',
      '--concept-main': 'rgba(241, 244, 248, 0.92)',
      '--concept-right': 'rgba(250, 251, 252, 0.92)',
      '--concept-sheet': '#ffffff',
      '--concept-sheet-shadow': '0 16px 28px rgba(15, 23, 42, 0.08)',
      '--concept-accent': '#0f172a',
      '--concept-accent-soft': 'rgba(15, 23, 42, 0.08)',
    },
  },
];

function toneFor(theme, kind) {
  const map = {
    blue: {
      bg: theme.id === 'glass' ? 'rgba(37, 99, 235, 0.18)' : 'rgba(219, 234, 254, 0.7)',
      border: theme.id === 'glass' ? 'rgba(82, 200, 255, 0.22)' : 'rgba(191, 219, 254, 0.8)',
      color: theme.vars['--accent'],
    },
    emerald: {
      bg: 'rgba(209, 250, 229, 0.52)',
      border: 'rgba(167, 243, 208, 0.82)',
      color: theme.vars['--success'],
    },
    purple: {
      bg: theme.id === 'glass' ? 'rgba(92, 103, 255, 0.16)' : 'rgba(243, 232, 255, 0.72)',
      border: theme.id === 'glass' ? 'rgba(160, 132, 255, 0.22)' : 'rgba(233, 213, 255, 0.82)',
      color: theme.id === 'glass' ? '#a78bfa' : '#9333ea',
    },
    orange: {
      bg: theme.id === 'glass' ? 'rgba(245, 158, 11, 0.16)' : 'rgba(255, 237, 213, 0.8)',
      border: theme.id === 'glass' ? 'rgba(251, 191, 36, 0.24)' : 'rgba(253, 186, 116, 0.8)',
      color: theme.id === 'atelier' ? '#c8633d' : '#ea580c',
    },
    indigo: {
      bg: theme.id === 'glass' ? 'rgba(99, 102, 241, 0.18)' : 'rgba(224, 231, 255, 0.76)',
      border: theme.id === 'glass' ? 'rgba(129, 140, 248, 0.22)' : 'rgba(199, 210, 254, 0.82)',
      color: theme.id === 'glass' ? '#8ab4ff' : '#4f46e5',
    },
  };
  return map[kind];
}

function SupportCard({ theme, toneKey, icon, title, children }) {
  const tone = toneFor(theme, toneKey);
  return (
    <div className="restyle-gallery__supportCard">
      <div className="restyle-gallery__supportHeader" style={{ '--tint-bg': tone.bg }}>
        <h3 className="restyle-gallery__supportTitle" style={{ color: theme.vars['--text-strong'] }}>
          {icon}
          {title}
        </h3>
        <Maximize2 size={15} color={tone.color} />
      </div>
      <div className="restyle-gallery__supportBody">{children}</div>
    </div>
  );
}

function ConceptMockupCard({ concept }) {
  return (
    <div className="restyle-gallery__conceptCard" style={concept.style}>
      <div className="restyle-gallery__conceptHeader">
        <p className="restyle-gallery__conceptKicker">{concept.kicker}</p>
        <h2 className="restyle-gallery__conceptTitle">{concept.title}</h2>
        <p className="restyle-gallery__conceptText">{concept.text}</p>
      </div>

      <div className="restyle-gallery__conceptBody">
        <div className="restyle-gallery__conceptPreview">
          <div className="restyle-gallery__conceptRail" />

          <div className="restyle-gallery__conceptSegments">
            <div className="restyle-gallery__conceptSegmentLine is-short" />
            <div className="restyle-gallery__conceptSegmentLine" />
            <div className="restyle-gallery__conceptSegmentLine is-active" />
            <div className="restyle-gallery__conceptSegmentLine" />
            <div className="restyle-gallery__conceptSegmentLine is-short" />
            <div className="restyle-gallery__conceptSegmentLine" />
          </div>

          <div className="restyle-gallery__conceptMain">
            <div className="restyle-gallery__conceptMainTop" />
            <div className="restyle-gallery__conceptDoc">
              <div className="restyle-gallery__conceptDocHeader">
                <div className="restyle-gallery__conceptDocBadge" />
                <div className="restyle-gallery__conceptDocLabel" />
              </div>

              <div className="restyle-gallery__conceptTextLine is-arabic is-long" />
              <div className="restyle-gallery__conceptTextLine is-arabic is-medium" />
              <div className="restyle-gallery__conceptTextLine is-arabic is-long" />
              <div className="restyle-gallery__conceptTextLine is-arabic is-short" />

              <div className="restyle-gallery__conceptLex">
                <div className="restyle-gallery__conceptLexChip" />
                <div className="restyle-gallery__conceptLexChip" />
                <div className="restyle-gallery__conceptLexChip" />
              </div>
            </div>

            <div className="restyle-gallery__conceptBottom" />
          </div>

          <div className="restyle-gallery__conceptRight">
            <div className="restyle-gallery__conceptMarginCard is-tall" />
            <div className="restyle-gallery__conceptMarginCard" />
            <div className="restyle-gallery__conceptMarginCard" />
          </div>
        </div>

        <ul className="restyle-gallery__conceptBullets">
          {concept.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RightSidebar({ theme, isSubmitted }) {
  return (
    <div className="restyle-gallery__panel" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div className="restyle-gallery__rightHeader">
        <span>Support</span>
        <LayoutGrid size={14} />
      </div>
      <div className="restyle-gallery__rightScroll">
        {!isSubmitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <SupportCard theme={theme} toneKey="blue" icon={<Info size={18} color={toneFor(theme, 'blue').color} />} title="Guidance">
              <p className="restyle-gallery__bodyText">
                Focus on accurately translating the conditions for Jumu&apos;ah validity. Pay close attention to the definition of <strong>مصر جامع</strong> (comprehensive city) and its components.
              </p>
            </SupportCard>

            <SupportCard theme={theme} toneKey="purple" icon={<BookOpen size={18} color={toneFor(theme, 'purple').color} />} title="Lexicography">
              <div className="restyle-gallery__rightEntry">
                <div className="restyle-gallery__rightRow">
                  <span className="restyle-gallery__chipArabic">مصر جامع</span>
                  <span className="restyle-gallery__mono">miṣr jāmiʿ</span>
                </div>
                <p className="restyle-gallery__bodyText">Comprehensive city; a large urban center with civic amenities.</p>
                <div className="restyle-gallery__contextBox">
                  <strong>Context:</strong> In Hanafi fiqh, typically defined by having a judge and a ruler capable of enforcing laws.
                </div>
              </div>

              <div className="restyle-gallery__rightEntry">
                <div className="restyle-gallery__rightRow">
                  <span className="restyle-gallery__chipArabic">أفنية</span>
                  <span className="restyle-gallery__mono">afniyah</span>
                </div>
                <p className="restyle-gallery__bodyText">Outskirts, courtyards, or immediate surrounding areas attached to the city.</p>
              </div>
            </SupportCard>

            <SupportCard theme={theme} toneKey="orange" icon={<ScrollText size={18} color={toneFor(theme, 'orange').color} />} title="Phrasing">
              <p className="restyle-gallery__bodyText">Phrase the ruling as a condition of validity, not as a recommendation or best practice.</p>
            </SupportCard>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <SupportCard theme={theme} toneKey="emerald" icon={<Award size={18} color={toneFor(theme, 'emerald').color} />} title="Your Grade">
              <div className="restyle-gallery__gradeCircle">8.4</div>
              <p className="restyle-gallery__gradeMeta">
                Reviewed 15 Mar 2026
                <br />
                Scholar-facing rubric
              </p>

              <div
                className="restyle-gallery__feedback"
                style={{
                  '--feedback-bg': 'rgba(209, 250, 229, 0.45)',
                  '--feedback-border': 'rgba(167, 243, 208, 0.9)',
                  '--feedback-title': '#047857',
                }}
              >
                <p className="restyle-gallery__feedbackTitle"><span style={{ width: 8, height: 8, borderRadius: 999, background: '#059669', display: 'inline-block' }} />Strengths</p>
                <p className="restyle-gallery__feedbackText">Excellent accuracy in translating technical terminology, particularly "miṣr jāmiʿ" and the attribution to Abū Yūsuf.</p>
              </div>

              <div
                className="restyle-gallery__feedback"
                style={{
                  '--feedback-bg': 'rgba(254, 243, 199, 0.46)',
                  '--feedback-border': 'rgba(253, 230, 138, 0.9)',
                  '--feedback-title': '#b45309',
                }}
              >
                <p className="restyle-gallery__feedbackTitle"><span style={{ width: 8, height: 8, borderRadius: 999, background: '#d97706', display: 'inline-block' }} />Areas for Improvement</p>
                <p className="restyle-gallery__feedbackText">Consider providing more context for "al-Karkhī" and "al-Thaljī" to help readers unfamiliar with Hanafi scholarship.</p>
              </div>

              <div
                className="restyle-gallery__feedback"
                style={{
                  '--feedback-bg': 'rgba(219, 234, 254, 0.52)',
                  '--feedback-border': 'rgba(191, 219, 254, 0.92)',
                  '--feedback-title': '#1d4ed8',
                }}
              >
                <p className="restyle-gallery__feedbackTitle"><span style={{ width: 8, height: 8, borderRadius: 999, background: '#2563eb', display: 'inline-block' }} />Suggestion</p>
                <p className="restyle-gallery__feedbackText">The phrase "meat-drying" for "تشريق" is accurate but may benefit from a brief explanatory note in brackets.</p>
              </div>
            </SupportCard>

            <SupportCard theme={theme} toneKey="indigo" icon={<Sparkles size={18} color={toneFor(theme, 'indigo').color} />} title="Key Takeaways">
              <ul className="restyle-gallery__bulletList">
                <li>The term <strong>مصر جامع</strong> requires careful breakdown as it sets the legal precedent for Friday prayers.</li>
                <li>Differing opinions (al-Karkhī vs al-Thaljī) should be clearly attributed.</li>
                <li>The physical expansion of the city (<strong>أفنية</strong>) carries the same legal weight as the center.</li>
              </ul>
            </SupportCard>

            <SupportCard theme={theme} toneKey="purple" icon={<BookOpen size={18} color={toneFor(theme, 'purple').color} />} title="Lexicography">
              <div className="restyle-gallery__rightEntry">
                <div className="restyle-gallery__rightRow">
                  <span className="restyle-gallery__chipArabic">مصر جامع</span>
                  <span className="restyle-gallery__mono">miṣr jāmiʿ</span>
                </div>
                <p className="restyle-gallery__bodyText">Comprehensive city; a large urban center with civic amenities.</p>
                <div className="restyle-gallery__contextBox">
                  <strong>Context:</strong> In Hanafi fiqh, typically defined by having a judge and a ruler capable of enforcing laws.
                </div>
              </div>

              <div className="restyle-gallery__rightEntry">
                <div className="restyle-gallery__rightRow">
                  <span className="restyle-gallery__chipArabic">أفنية</span>
                  <span className="restyle-gallery__mono">afniyah</span>
                </div>
                <p className="restyle-gallery__bodyText">Outskirts, courtyards, or immediate surrounding areas attached to the city.</p>
              </div>
            </SupportCard>
          </div>
        )}
      </div>
    </div>
  );
}

function LeftSidebar() {
  return (
    <div className="restyle-gallery__panel restyle-gallery__left">
      <div className="restyle-gallery__leftHeader">
        <span>Segments</span>
        <ChevronLeft size={14} />
      </div>
      <div className="restyle-gallery__leftScroll">
        {segments.map((chapter) => (
          <div className="restyle-gallery__chapter" key={chapter.title}>
            <h3 className="restyle-gallery__chapterTitle">
              <ChevronRight size={14} style={{ transform: chapter.items.length ? 'rotate(90deg)' : 'rotate(0deg)' }} />
              {chapter.title}
            </h3>
            {chapter.items.length > 0 && (
              <div className="restyle-gallery__segmentList">
                {chapter.items.map((item) => {
                  const isActive = chapter.active === item;
                  const isCompleted = item !== chapter.active;
                  return (
                    <div className={`restyle-gallery__segmentRow${isActive ? ' is-active' : ''}`} key={item}>
                      <span className={`restyle-gallery__segmentDot${isCompleted ? '' : ' is-solid'}`} />
                      <span>{item}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NavigationRail({ theme }) {
  const accent = theme.vars['--accent'];
  return (
    <div className="restyle-gallery__panel restyle-gallery__rail">
      <div className="restyle-gallery__railMark">A</div>
      <div className="restyle-gallery__railNav">
        <button className="restyle-gallery__railButton is-active" type="button"><BookOpen size={18} /></button>
        <button className="restyle-gallery__railButton" type="button"><Home size={18} /></button>
        <button className="restyle-gallery__railButton" type="button"><Star size={18} /></button>
        <button className="restyle-gallery__railButton" type="button"><Plus size={18} /></button>
      </div>
      <div className="restyle-gallery__railFooter" style={{ background: theme.vars['--primary'], boxShadow: `0 12px 28px ${accent}40` }}>
        N
      </div>
    </div>
  );
}

function CenterStage({ theme, isSubmitted, onSubmit, onReset }) {
  const accent = theme.vars['--accent'];
  const success = theme.vars['--success'];
  return (
    <div className="restyle-gallery__panel restyle-gallery__center" style={{ position: 'relative' }}>
      <div className="restyle-gallery__centerHeader">
        <div>
          <h1 className="restyle-gallery__bookTitle">
            <BookOpen size={24} color={accent} />
            Al-Hidayah • The Book of Prayer
          </h1>
          <div className="restyle-gallery__bookMeta">
            <span>Chapter 4: Jumu&apos;ah (Friday Prayer)</span>
            <span style={{ width: 4, height: 4, borderRadius: 999, background: theme.vars['--text-soft'] }} />
            <span className="restyle-gallery__metaChip"><Tag size={12} /> Fiqh Terminology</span>
          </div>
        </div>

        {!isSubmitted ? (
          <span className="restyle-gallery__status">
            <Sparkles size={14} />
            Drafting Phase
          </span>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="restyle-gallery__primary" type="button">
              <MessageSquare size={15} />
              Discuss This Segment
            </button>
            <span className="restyle-gallery__status is-success">
              <CheckCircle2 size={14} />
              Submitted
            </span>
          </div>
        )}
      </div>

      <div className="restyle-gallery__centerScroll">
        <div className="restyle-gallery__centerInner">
          <div className="restyle-gallery__card">
            <div className="restyle-gallery__cardHeader">
              <div className="restyle-gallery__cardTitleRow">
                <span className="restyle-gallery__badge">AR</span>
                <span className="restyle-gallery__label">Source Text</span>
              </div>
              <div className="restyle-gallery__actionRow">
                {!isSubmitted && (
                  <>
                    <span className="restyle-gallery__ghost">A-</span>
                    <span className="restyle-gallery__ghost">A+</span>
                  </>
                )}
                <span className="restyle-gallery__ghost"><Copy size={14} /> Copy</span>
              </div>
            </div>
            <div className="restyle-gallery__cardBody">
              <p className="restyle-gallery__arabic" dir="rtl">{sourceText}</p>
            </div>
          </div>

          {!isSubmitted ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="restyle-gallery__lexHeader">
                  <BookOpen size={13} />
                  Quick Lexicography
                </div>
                <div className="restyle-gallery__lexStrip">
                  {quickLex.map((term) => (
                    <div className="restyle-gallery__lexChip" key={term.mono}>
                      <span className="restyle-gallery__chipArabic" dir="rtl">{term.arabic}</span>
                      <span style={{ width: 4, height: 4, borderRadius: 999, background: theme.vars['--text-soft'], opacity: 0.45 }} />
                      <span className="restyle-gallery__mono">{term.mono}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="restyle-gallery__editor">
                <div className="restyle-gallery__cardHeader">
                  <div className="restyle-gallery__cardTitleRow">
                    <span className="restyle-gallery__badge">EN</span>
                    <span className="restyle-gallery__label">Translation</span>
                  </div>
                  <div className="restyle-gallery__actionRow">
                    <span className="restyle-gallery__ghost">B</span>
                    <span className="restyle-gallery__ghost" style={{ fontStyle: 'italic' }}>I</span>
                  </div>
                </div>
                <div className="restyle-gallery__editorBody">
                  <p className="restyle-gallery__placeholder">Write your translation here...</p>
                  <div className="restyle-gallery__submitRow">
                    <span className="restyle-gallery__hint">⌘ Enter to submit</span>
                    <button className="restyle-gallery__primary" type="button" onClick={onSubmit}>
                      <Send size={15} />
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="restyle-gallery__card" style={{ borderColor: 'rgba(167, 243, 208, 0.9)' }}>
                <div className="restyle-gallery__cardHeader" style={{ background: 'rgba(236, 253, 245, 0.82)' }}>
                  <div className="restyle-gallery__cardTitleRow">
                    <span className="restyle-gallery__badge" style={{ background: 'rgba(209, 250, 229, 0.86)', color: success }}>✓</span>
                    <span className="restyle-gallery__label">Best in Class Translation</span>
                  </div>
                  <div className="restyle-gallery__actionRow">
                    <span className="restyle-gallery__ghost">Pin</span>
                    <span className="restyle-gallery__ghost"><Copy size={14} /> Copy</span>
                  </div>
                </div>
                <div className="restyle-gallery__cardBody">
                  <p className="restyle-gallery__bodyText">{bestInClassTranslation}</p>
                </div>
              </div>

              <div className="restyle-gallery__card">
                <div className="restyle-gallery__cardHeader">
                  <div className="restyle-gallery__cardTitleRow">
                    <span className="restyle-gallery__badge">EN</span>
                    <span className="restyle-gallery__label">Your Translation</span>
                  </div>
                  <div className="restyle-gallery__actionRow">
                    <span className="restyle-gallery__ghost">Pin</span>
                    <span className="restyle-gallery__ghost"><Copy size={14} /> Copy</span>
                  </div>
                </div>
                <div className="restyle-gallery__cardBody">
                  <p className="restyle-gallery__bodyText">{userTranslation}</p>
                </div>
              </div>

              <div className="restyle-gallery__card" style={{ borderColor: 'rgba(253, 230, 138, 0.9)' }}>
                <div className="restyle-gallery__cardHeader" style={{ background: 'rgba(255, 247, 237, 0.86)' }}>
                  <div className="restyle-gallery__cardTitleRow">
                    <ScrollText size={16} color={theme.id === 'atelier' ? '#c8633d' : '#f59e0b'} />
                    <span className="restyle-gallery__label">Discussion Summary &amp; Notes</span>
                  </div>
                  <div className="restyle-gallery__actionRow">
                    <span className="restyle-gallery__ghost">Pin</span>
                    <span className="restyle-gallery__ghost"><Plus size={14} /> Add Manual Note</span>
                  </div>
                </div>
                <div className="restyle-gallery__cardBody">
                  <div className="restyle-gallery__emptyState">
                    <ScrollText size={30} color={theme.vars['--text-soft']} style={{ marginBottom: 12, opacity: 0.35 }} />
                    <p style={{ margin: '0 0 8px', fontWeight: 700, fontSize: 15 }}>No discussion summary yet</p>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}>Click “Discuss This Segment” above to start a conversation. Manual notes and summaries will appear here.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="restyle-gallery__footer">
        <button className="restyle-gallery__ghost" type="button" onClick={isSubmitted ? onReset : undefined} style={{ minHeight: 50, paddingInline: 18 }}>
          <ChevronLeft size={16} />
          {isSubmitted ? 'Back to Practice' : 'Previous Segment'}
        </button>

        <div className="restyle-gallery__progress">
          <p className="restyle-gallery__progressLabel">Segment 12 of 47</p>
          <div className="restyle-gallery__progressBars">
            {[0, 1, 2, 3, 4].map((index) => (
              <span key={index} className={`restyle-gallery__progressBar${index === 2 ? ' is-active' : ''}`} />
            ))}
          </div>
        </div>

        <button className="restyle-gallery__primary" type="button">
          <span>{isSubmitted ? 'Next Segment' : 'Skip Ahead'}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default function RestyleGalleryScreen() {
  const [activeVariant, setActiveVariant] = useState('editorial');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [galleryMode, setGalleryMode] = useState('concepts');

  const theme = useMemo(() => themes[activeVariant], [activeVariant]);
  const frameKey = `${activeVariant}-${isSubmitted ? 'review' : 'practice'}`;

  return (
    <div className="restyle-gallery" style={theme.vars}>
      <style>{galleryStyles}</style>
      <div className="restyle-gallery__wash" />
      <div className="restyle-gallery__grid" />

      <div className="restyle-gallery__shell">
        <div className="restyle-gallery__toolbar">
          <div className="restyle-gallery__toolbarMain">
            <span className="restyle-gallery__eyebrow">
              <Sparkles size={14} />
              2026 Award Mode
            </span>
            <h1 className="restyle-gallery__title">Three coded visual restyles from the locked translation baseline</h1>
            <p className="restyle-gallery__subtext">
              Same information architecture, same three-column learning flow, same product concept. Only the visual language changes. The locked master remains preserved on commit <strong>a68467a</strong>.
            </p>
          </div>

          <div className="restyle-gallery__controls">
            <div className="restyle-gallery__pillRow">
              <button
                type="button"
                className={`restyle-gallery__pillButton${galleryMode === 'concepts' ? ' is-active' : ''}`}
                onClick={() => setGalleryMode('concepts')}
              >
                Light Mockups
              </button>
              <button
                type="button"
                className={`restyle-gallery__pillButton${galleryMode === 'restyles' ? ' is-active' : ''}`}
                onClick={() => setGalleryMode('restyles')}
              >
                Full Restyles
              </button>
            </div>

            <div className="restyle-gallery__pillRow">
              {Object.values(themes).map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  className={`restyle-gallery__pillButton${activeVariant === variant.id ? ' is-active' : ''}`}
                  onClick={() => setActiveVariant(variant.id)}
                >
                  {variant.name}
                </button>
              ))}
            </div>

            <div className="restyle-gallery__pillRow">
              <button
                type="button"
                className={`restyle-gallery__pillButton${!isSubmitted ? ' is-active' : ''}`}
                onClick={() => setIsSubmitted(false)}
              >
                Practice
              </button>
              <button
                type="button"
                className={`restyle-gallery__pillButton${isSubmitted ? ' is-active' : ''}`}
                onClick={() => setIsSubmitted(true)}
              >
                Review
              </button>
            </div>

            <div className="restyle-gallery__note">
              {galleryMode === 'concepts' ? (
                <>
                  <strong>Round 2 mockups</strong>
                  <br />
                  Faster north-star ideas, less fidelity, more product identity
                </>
              ) : (
                <>
                  <strong>{theme.name}</strong>
                  <br />
                  {theme.tagline}
                </>
              )}
            </div>
          </div>
        </div>

        {galleryMode === 'concepts' ? (
          <div className="restyle-gallery__conceptBoard">
            {conceptMockups.map((concept) => (
              <ConceptMockupCard key={concept.id} concept={concept} />
            ))}
          </div>
        ) : (
          <div className="restyle-gallery__frame" key={frameKey}>
            <div style={{ animationDelay: '40ms' }}>
              <NavigationRail theme={theme} />
            </div>
            <div style={{ animationDelay: '90ms' }}>
              <LeftSidebar />
            </div>
            <div style={{ animationDelay: '140ms' }}>
              <CenterStage theme={theme} isSubmitted={isSubmitted} onSubmit={() => setIsSubmitted(true)} onReset={() => setIsSubmitted(false)} />
            </div>
            <div style={{ animationDelay: '190ms' }}>
              <RightSidebar theme={theme} isSubmitted={isSubmitted} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
