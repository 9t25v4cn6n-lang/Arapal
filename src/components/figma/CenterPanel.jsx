import { useEffect, useRef, useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  Bold,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  Italic,
  MessageSquare,
  Maximize2,
  Minimize2,
  Pin,
  PinOff,
  Plus,
  ScrollText,
  Send,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';

const centerPanelStyles = `
  .fg-center,
  .fg-center * {
    box-sizing: border-box;
  }

  .fg-center {
    width: 100%;
    height: 100%;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-self: stretch;
    position: relative;
    overflow: hidden;
    background: #f6f9fd;
    color: #0f172a;
  }

  .fg-center__header {
    height: 126px;
    padding: 0 32px;
    border-bottom: 1px solid #f1f5f9;
    background: #ffffff;
    position: relative;
    z-index: 10;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .fg-center__headerRow {
    width: 100%;
    max-width: none;
    margin: 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    min-width: 0;
  }

  .fg-center__headerMain {
    flex: 0 1 auto;
    min-width: 0;
  }

  .fg-center__title {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 38px;
    line-height: 42px;
    font-weight: 700;
    color: #0f172b;
    font-family: Georgia, "Times New Roman", serif;
    white-space: nowrap;
  }

  .fg-center__subRow {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    margin-top: 14px;
    margin-left: 30px;
  }

  .fg-center__subtext {
    margin: 0;
    font-size: 14.5px;
    line-height: 20px;
    font-weight: 500;
    color: #66778d;
  }

  .fg-center__dot {
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: #cbd5e1;
  }

  .fg-center__chip {
    min-height: 28px;
    border: none;
    border-radius: 0;
    padding: 4px 12px;
    background: #f1f5f9;
    color: #45556c;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .fg-center__chip:hover {
    background: #e2e8f0;
  }

  .fg-center__headerActions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 10px;
    flex-shrink: 0;
    margin-left: auto;
  }

  .fg-center__status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 14px;
    height: 36px;
    border-radius: 0;
    border: 1px solid var(--status-border);
    background: var(--status-bg);
    color: var(--status-text);
    font-size: 13px;
    line-height: 18px;
    font-weight: 600;
  }

  .fg-center__content {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    background: #f6f9fd;
  }

  .fg-center__scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-top: 24px;
    padding-bottom: var(--scroll-padding-bottom);
    background: #f6f9fd;
  }

  .fg-center__contentWrap {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 0 18px;
    padding-bottom: var(--content-wrap-padding-bottom, 0px);
    min-height: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .fg-center__inner {
    width: 50%;
    max-width: 760px;
    margin: 0 auto;
    padding: 0;
    min-height: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .fg-center__topStack {
    display: flex;
    flex-direction: column;
  }

  .fg-center__topStack--scrollable {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding-bottom: 20px;
  }

  .fg-center__card {
    position: relative;
    background: #ffffff;
    border: 1px solid var(--card-border, #dbeafe);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.07), 0 2px 4px rgba(15, 23, 42, 0.05);
    transition: box-shadow 0.2s ease;
  }

  .fg-center__card:hover {
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.09), 0 4px 8px rgba(15, 23, 42, 0.06);
  }

  .fg-center__cardHeader {
    min-height: var(--card-header-height, 59.333px);
    padding: 0 var(--card-header-padding-x, 24px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    border-bottom: 1px solid var(--card-header-border, #e2e8f0);
    background: var(--card-header-bg, #f8fafc);
  }

  .fg-center__cardTitleRow {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .fg-center__badge {
    width: 28px;
    height: 28px;
    padding: 0;
    border-radius: 0;
    background: var(--badge-bg, #dbeafe);
    color: var(--badge-text, #1d4ed8);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 13px;
    font-weight: 700;
  }

  .fg-center__sectionLabel {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--section-text, #314158);
  }

  .fg-center__actionRow {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 8px;
  }

  .fg-center__actionRow--subtle .fg-center__pillButton {
    opacity: 0.36;
  }

  .fg-center__actionRow--subtle .fg-center__pillButton:hover {
    opacity: 1;
  }

  .fg-center__pillButton {
    min-height: 34px;
    border: 1px solid var(--button-border, #e2e8f0);
    border-radius: 0;
    background: #ffffff;
    color: var(--button-text, #475569);
    padding: 0 14px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1);
    opacity: var(--button-opacity, 1);
    transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  }

  .fg-center__pillButton:hover {
    color: var(--button-hover-text, #2563eb);
    border-color: var(--button-hover-border, #bfdbfe);
    background: var(--button-hover-bg, #eff6ff);
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
    opacity: 1;
  }

  .fg-center__textBlock {
    padding: var(--card-body-padding, 34px 38px 44px);
    background: var(--card-body-bg, #ffffff);
  }

  .fg-center__textBlock--source {
    max-height: 398px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .fg-center__arabic {
    margin: 0;
    font-size: var(--arabic-size, 24px);
    line-height: 2.62;
    color: var(--arabic-color, #172033);
    text-align: right;
    cursor: text;
    font-family: "Amiri", "Noto Naskh Arabic", "Geeza Pro", serif;
    font-weight: 400;
    text-rendering: optimizeLegibility;
    font-kerning: normal;
    font-synthesis: none;
  }

  .fg-center__paragraph {
    margin: 0;
    font-size: 16px;
    line-height: 1.75;
    color: #1e293b;
  }

  .fg-center__sectionSpacing {
    margin-top: 24px;
  }

  .fg-center__sectionSpacing--tight {
    margin-top: 24px;
  }

  .fg-center__lexHeader {
    margin: 0 0 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    font-weight: 700;
    line-height: 18px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #90a1b9;
  }

  .fg-center__lexStrip {
    display: flex;
    gap: 14px;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: visible;
    padding: 4px 2px 8px;
    margin: 0;
    scrollbar-width: none;
  }

  .fg-center__lexStrip::-webkit-scrollbar {
    display: none;
  }

  .fg-center__lexTerm {
    position: relative;
    flex-shrink: 0;
  }

  .fg-center__lexChip {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 50px;
    padding: 0 19px;
    border: 1px solid #dfe7f2;
    border-radius: 999px;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.045), 0 1px 2px rgba(15, 23, 42, 0.03);
    cursor: help;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .fg-center__lexTerm:hover .fg-center__lexChip {
    background: #eff6ff;
    border-color: #93c5fd;
  }

  .fg-center__arabicWord {
    font-family: "Amiri", "Noto Naskh Arabic", "Geeza Pro", serif;
    font-weight: 700;
    color: #0f172a;
    font-size: 19px;
  }

  .fg-center__mono {
    font-family: "SFMono-Regular", "JetBrains Mono", "Menlo", monospace;
    font-size: 13px;
    color: #74839a;
  }

  .fg-center__tooltip {
    position: absolute;
    left: 50%;
    bottom: calc(100% + 12px);
    transform: translate(-50%, 8px);
    width: 256px;
    padding: 16px;
    border-radius: 16px;
    background: #0f172a;
    color: #ffffff;
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.28);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
    z-index: 20;
  }

  .fg-center__tooltip--small {
    width: 224px;
  }

  .fg-center__lexTerm:hover .fg-center__tooltip {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, 0);
  }

  .fg-center__tooltipTitle {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 600;
  }

  .fg-center__tooltipText {
    margin: 0;
    font-size: 12px;
    line-height: 1.5;
    color: #cbd5e1;
  }

  .fg-center__tooltipArrow {
    position: absolute;
    left: 50%;
    bottom: -6px;
    width: 12px;
    height: 12px;
    background: #0f172a;
    transform: translateX(-50%) rotate(45deg);
  }

  .fg-center__editorShell {
    flex-shrink: 0;
    margin-top: 0;
    padding: 24px 0 40px;
    position: relative;
    z-index: 10;
    background: #f6f9fd;
  }

  .fg-center__navRow {
    margin-bottom: 14px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .fg-center__tinyButton {
    border: none;
    background: transparent;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #62748e;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .fg-center__tinyButton:hover {
    color: #2563eb;
  }

  .fg-center__editorCard {
    background: #ffffff;
    border: 1px solid #dbeafe;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.07), 0 2px 4px rgba(15, 23, 42, 0.05);
    transition: box-shadow 0.2s ease;
  }

  .fg-center__editorCard:hover {
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.09), 0 4px 8px rgba(15, 23, 42, 0.06);
  }

  .fg-center__editorHeader {
    padding: 0 32px;
    min-height: 74px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    border-bottom: 1px solid rgba(219, 234, 254, 0.5);
    background: rgba(239, 246, 255, 0.4);
  }

  .fg-center__toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    opacity: 0.88;
    transition: opacity 0.2s ease;
  }

  .fg-center__toolbar:hover {
    opacity: 1;
  }

  .fg-center__iconButton {
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--icon-color, #94a3b8);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color 0.2s ease, background-color 0.2s ease;
  }

  .fg-center__iconButton:hover {
    color: var(--icon-hover-color, #2563eb);
    background: var(--icon-hover-bg, #eff6ff);
  }

  .fg-center__iconButton.is-active {
    color: #2563eb;
    background: #eff6ff;
  }

  .fg-center__toolbarDivider {
    width: 1px;
    height: 16px;
    margin: 0 4px;
    background: #e2e8f0;
  }

  .fg-center__editorBody {
    position: relative;
    min-height: 210px;
    padding: 42px 34px 68px;
    transition: background-color 0.2s ease;
  }

  .fg-center__editorBody:focus-within {
    background: rgba(239, 246, 255, 0.18);
  }

  .fg-center__textarea {
    width: 100%;
    min-height: 28px;
    padding: 0;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    color: #1d293d;
    font-size: 16px;
    line-height: 1.68;
    font-family: inherit;
  }

  .fg-center__textarea::placeholder {
    color: #46566c;
    opacity: 0.86;
  }

  .fg-center__submitRow {
    position: absolute;
    right: 34px;
    bottom: 16px;
    display: flex;
    align-items: center;
    gap: 18px;
    justify-content: flex-end;
  }

  .fg-center__hintText {
    font-size: 12.5px;
    font-weight: 500;
    color: #90a1b9;
  }

  .fg-center__primaryButton {
    border: none;
    border-radius: 12px;
    background: #2563eb;
    color: #ffffff;
    height: 44px;
    min-width: 124px;
    padding: 0 26px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.18), 0 2px 4px rgba(15, 23, 42, 0.08);
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
  }

  .fg-center__primaryButton:hover {
    background: #1d4ed8;
    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.22);
  }

  .fg-center__jump {
    position: absolute;
    left: 50%;
    bottom: 96px;
    transform: translateX(-50%);
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px;
    border: 1px solid #e2e8f0;
    border-radius: 999px;
    background: #ffffff;
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
    opacity: 0.45;
    transition: opacity 0.3s ease, padding 0.3s ease, gap 0.3s ease;
  }

  .fg-center__jump:hover {
    opacity: 1;
    padding: 8px 16px;
    gap: 8px;
  }

  .fg-center__jumpTitle,
  .fg-center__jumpHiddenDivider,
  .fg-center__jumpLabel {
    max-width: 0;
    overflow: hidden;
    opacity: 0;
    white-space: nowrap;
    transition: max-width 0.3s ease, opacity 0.3s ease;
  }

  .fg-center__jump:hover .fg-center__jumpTitle {
    max-width: 100px;
    opacity: 1;
  }

  .fg-center__jump:hover .fg-center__jumpHiddenDivider {
    max-width: 1px;
    opacity: 1;
  }

  .fg-center__jump:hover .fg-center__jumpLabel {
    max-width: 120px;
    opacity: 1;
  }

  .fg-center__jumpTitle {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #94a3b8;
  }

  .fg-center__jumpDivider {
    width: 1px;
    height: 16px;
    background: #e2e8f0;
    flex-shrink: 0;
  }

  .fg-center__jumpButton {
    border: none;
    border-radius: 999px;
    background: transparent;
    color: var(--jump-color, #475569);
    padding: 8px;
    display: inline-flex;
    align-items: center;
    gap: 0;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease, gap 0.3s ease;
  }

  .fg-center__jump:hover .fg-center__jumpButton {
    gap: 8px;
  }

  .fg-center__jumpButton:hover {
    background: var(--jump-bg, #eff6ff);
    color: var(--jump-hover-color, var(--jump-color, #2563eb));
  }

  .fg-center__jumpButton:disabled {
    color: #cbd5e1;
    cursor: not-allowed;
  }

  .fg-center__submissionToggle {
    position: absolute;
    left: 50%;
    bottom: 116px;
    transform: translateX(-50%);
    z-index: 24;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px;
    border: 1px solid #e2e8f0;
    border-radius: 999px;
    background: #ffffff;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
    opacity: 0.7;
    transition: opacity 0.24s ease, padding 0.24s ease, gap 0.24s ease;
  }

  .fg-center__submissionToggle:hover {
    opacity: 1;
    gap: 10px;
    padding-left: 14px;
    padding-right: 14px;
  }

  .fg-center__submissionToggleButton {
    min-width: 34px;
    height: 32px;
    border: none;
    background: transparent;
    color: #64748b;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0 10px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
  }

  .fg-center__submissionToggleButton.is-active {
    color: #155dfc;
  }

  .fg-center__submissionToggleButton.is-success {
    color: #059669;
  }

  .fg-center__submissionToggleButton.is-disabled {
    color: #cbd5e1;
    cursor: not-allowed;
  }

  .fg-center__submissionToggleDivider {
    width: 1px;
    height: 16px;
    background: #e2e8f0;
  }

  .fg-center__submissionToggleTitle,
  .fg-center__submissionToggleLabel {
    max-width: 0;
    overflow: hidden;
    white-space: nowrap;
    opacity: 0;
    transition: max-width 0.24s ease, opacity 0.24s ease;
  }

  .fg-center__submissionToggle:hover .fg-center__submissionToggleTitle {
    max-width: 88px;
    opacity: 1;
  }

  .fg-center__submissionToggle:hover .fg-center__submissionToggleLabel {
    max-width: 160px;
    opacity: 1;
  }

  .fg-center__submissionToggleTitle {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #94a3b8;
  }

  .fg-center__bottomBar {
    position: relative;
    z-index: 20;
    flex-shrink: 0;
    padding: 20px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    border-top: 1px solid #e2e8f0;
    background: #ffffff;
  }

  .fg-center__secondaryButton {
    border: none;
    border-radius: 14px;
    background: #f1f5f9;
    color: #334155;
    padding: 14px 24px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
    transition: background-color 0.2s ease;
  }

  .fg-center__secondaryButton:hover {
    background: #e2e8f0;
  }

  .fg-center__progress {
    text-align: center;
  }

  .fg-center__progressText {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #64748b;
  }

  .fg-center__progressBarRow {
    margin-top: 8px;
    display: flex;
    gap: 4px;
  }

  .fg-center__progressBar {
    width: 32px;
    height: 4px;
    border-radius: 999px;
    background: #e2e8f0;
  }

  .fg-center__progressBar.is-active {
    background: #3b82f6;
  }

  .fg-center__overlay {
    position: absolute;
    right: 40px;
    bottom: 100px;
    z-index: 30;
    display: flex;
    flex-direction: column;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    background: #ffffff;
    box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
    transform-origin: bottom right;
    overflow: hidden;
    min-width: 360px;
    min-height: 720px;
    max-width: min(720px, calc(100% - 80px));
    max-height: calc(100% - 96px);
    resize: both;
    transition: width 0.3s ease, height 0.3s ease, top 0.3s ease, bottom 0.3s ease;
  }

  .fg-center__overlay--modal {
    position: relative;
    right: auto;
    bottom: auto;
    width: min(860px, calc(100vw - 96px));
    height: min(780px, calc(100vh - 88px));
    max-width: calc(100vw - 96px);
    max-height: calc(100vh - 88px);
    box-shadow: 0 28px 56px rgba(15, 23, 42, 0.24);
    resize: none;
  }

  .fg-center__overlayBackdrop {
    position: fixed;
    inset: 0;
    z-index: 34;
    padding: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.42);
  }

  .fg-center__overlayHeader {
    padding: 20px 24px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .fg-center__overlayKicker {
    margin: 0 0 2px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #64748b;
  }

  .fg-center__overlayTitle {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
  }

  .fg-center__overlayActions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .fg-center__textButton {
    border: none;
    background: transparent;
    padding: 0;
    color: #475569;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .fg-center__textButton:hover {
    color: #0f172a;
  }

  .fg-center__closeButton {
    border: none;
    background: transparent;
    padding: 0;
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .fg-center__closeButton:hover {
    color: #64748b;
  }

  .fg-center__overlayBody {
    flex: 1;
    overflow-y: auto;
    padding: 18px 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: #ffffff;
  }

  .fg-center__contextBox {
    padding: 20px 22px;
    border: 2px dashed #e2e8f0;
    border-radius: 18px;
    background: rgba(248, 250, 252, 0.45);
  }

  .fg-center__contextTitle {
    margin: 0 0 12px;
    font-size: 14px;
    font-weight: 700;
    color: #1e2336;
  }

  .fg-center__contextText {
    margin: 0;
    font-size: 14px;
    line-height: 1.7;
    color: #64748b;
  }

  .fg-center__inputShell {
    position: relative;
    flex: 1;
    min-height: 340px;
    padding: 18px;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .fg-center__inputShell:focus-within {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }

  .fg-center__overlayTextarea {
    width: 100%;
    height: 100%;
    min-height: 280px;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    color: #1e2336;
    font-size: 15px;
    font-family: inherit;
  }

  .fg-center__overlayTextarea::placeholder {
    color: #94a3b8;
  }

  .fg-center__cornerMark {
    position: absolute;
    right: 12px;
    bottom: 12px;
    opacity: 0.3;
  }

  .fg-center__overlayNote {
    margin: 0;
    font-size: 14px;
    color: #64748b;
  }

  .fg-center__overlayFooter {
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .fg-center__overlayResizeHandle {
    position: absolute;
    right: 10px;
    bottom: 10px;
    width: 18px;
    height: 18px;
    opacity: 0.46;
    cursor: nwse-resize;
    color: #94a3b8;
    z-index: 6;
  }

  .fg-center__ghostButton {
    border: 1px solid #cbd5e1;
    border-radius: 14px;
    background: #ffffff;
    color: #1e2336;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .fg-center__ghostButton:hover {
    background: #f8fafc;
  }

  .fg-center__emptyState {
    padding: 40px 32px;
    border: 2px dashed #e2e8f0;
    border-radius: 18px;
    background: rgba(248, 250, 252, 0.45);
    text-align: center;
  }

  .fg-center__emptyStateTitle {
    margin: 0 0 8px;
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
  }

  .fg-center__emptyStateText {
    max-width: 420px;
    margin: 0 auto;
    font-size: 12px;
    line-height: 1.6;
    color: #94a3b8;
  }

  .fg-center__noteComposer {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 18px;
    border: 1px solid #f5d58c;
    border-radius: 18px;
    background: #fffaf0;
  }

  .fg-center__noteComposerTextarea {
    width: 100%;
    min-height: 108px;
    border: 1px solid #fde68a;
    border-radius: 14px;
    background: #ffffff;
    padding: 14px 16px;
    resize: vertical;
    outline: none;
    font: inherit;
    font-size: 14px;
    line-height: 1.7;
    color: #334155;
  }

  .fg-center__noteComposerTextarea:focus {
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12);
  }

  .fg-center__noteComposerActions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
  }

  .fg-center__noteList {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .fg-center__noteCard {
    padding: 18px 20px;
    border: 1px solid #e8edf5;
    border-radius: 16px;
    background: #f8fafc;
    box-shadow: 0 3px 10px rgba(15, 23, 42, 0.04);
  }

  .fg-center__noteMeta {
    margin: 0 0 8px;
    font-size: 13px;
    font-weight: 700;
    color: #64748b;
  }

  .fg-center__noteBody {
    margin: 0;
    font-size: 14px;
    line-height: 1.7;
    color: #334155;
  }

  @media (max-width: 1100px) {
    .fg-center__header {
      height: auto;
      min-height: 94.667px;
      padding: 20px 16px;
    }

    .fg-center__contentWrap {
      max-width: none;
      padding: 0 20px;
    }

    .fg-center__inner {
      width: 100%;
      max-width: none;
    }

    .fg-center__bottomBar {
      padding: 16px 24px;
    }

  }
`;

const tones = {
  blue: {
    text: '#2563eb',
    border: '#bfdbfe',
    hoverBg: '#eff6ff',
  },
  emerald: {
    text: '#059669',
    border: '#a7f3d0',
    hoverBg: '#ecfdf5',
  },
  amber: {
    text: '#d97706',
    border: '#fde68a',
    hoverBg: '#fff7ed',
  },
  slate: {
    text: '#64748b',
    border: '#e2e8f0',
    hoverBg: '#f8fafc',
  },
};

const quickLexicography = [
  {
    arabic: 'مصر جامع',
    transliteration: 'miṣr jāmiʿ',
    title: 'Comprehensive city',
    description: 'A large urban center with civic amenities, typically defined by having a judge and a ruler.',
    compact: false,
  },
  {
    arabic: 'أفنية',
    transliteration: 'afniyah',
    title: 'Outskirts / Courtyards',
    description: 'Immediate surrounding areas attached to the city.',
    compact: true,
  },
  {
    arabic: 'مصلى',
    transliteration: 'muṣallā',
    title: 'Prayer area',
    description: 'An open space designated for communal prayers, especially Eid.',
    compact: true,
  },
];

function QuickLexTerm({ arabic, transliteration, title, description, compact }) {
  return (
    <div className="fg-center__lexTerm">
      <div className="fg-center__lexChip">
        <span className="fg-center__arabicWord" dir="rtl">
          {arabic}
        </span>
        <span
          style={{
            width: 4,
            height: 4,
            borderRadius: '999px',
            background: '#cbd5e1',
            display: 'inline-block',
          }}
        />
        <span className="fg-center__mono">{transliteration}</span>
      </div>

      <div className={`fg-center__tooltip${compact ? ' fg-center__tooltip--small' : ''}`}>
        <p className="fg-center__tooltipTitle">{title}</p>
        <p className="fg-center__tooltipText">{description}</p>
        <div className="fg-center__tooltipArrow" />
      </div>
    </div>
  );
}

function ActionPill({ tone, active = false, icon, children, onClick }) {
  return (
    <button
      type="button"
      className="fg-center__pillButton"
      onClick={onClick}
      style={{
        '--button-hover-text': tone.text,
        '--button-hover-border': tone.border,
        '--button-hover-bg': tone.hoverBg,
        '--button-border': active ? tone.border : '#e2e8f0',
        '--button-text': active ? tone.text : '#475569',
      }}
    >
      {icon}
      {children}
    </button>
  );
}

export default function CenterPanel({ isSubmitted = false, onSubmit } = {}) {
  const [showDiscuss, setShowDiscuss] = useState(false);
  const [discussExpanded, setDiscussExpanded] = useState(false);
  const [showTashkeel, setShowTashkeel] = useState(true);
  const [pinnedCard, setPinnedCard] = useState(null);
  const [sourceFontSize, setSourceFontSize] = useState(24);
  const [isAddingManualNote, setIsAddingManualNote] = useState(false);
  const [manualNoteDraft, setManualNoteDraft] = useState('');
  const [manualNotes, setManualNotes] = useState([]);
  const [discussSize, setDiscussSize] = useState({ width: 420, height: 820 });
  const [discussResizeState, setDiscussResizeState] = useState(null);

  const sourceRef = useRef(null);
  const bestInClassRef = useRef(null);
  const yourTranslationRef = useRef(null);
  const discussionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const handleSubmit = onSubmit ?? (() => {});

  const adjustSourceFontSize = (delta) => {
    setSourceFontSize((current) => Math.min(40, Math.max(18, current + delta)));
  };

  const removeTashkeel = (text) => text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const arabicSource = `لا تصح الجمعة إلا في مصر جامع أو في مصلى المصر ولا تجوز في القرى لقوله ﷺ "لا جمعة ولا تشريق ولا فطر ولا أضحى إلا في مصر جامع" والمصر الجامع كل موضع له أمير وقاض ينفذ الأحكام ويقيم الحدود وهذا عند أبي يوسف رحمه الله وعنه أنهم إذا اجتمعوا في أكبر مساجدهم لم يسعهم والأول اختيار الكرخي وهو الظاهر والثاني اختيار الثلجي والحكم غير مقصور على المصلي بل تجوز في جميع أفنية المصر لأنها بمنزلته في حوائج أهله`;
  const displayedArabicText = showTashkeel ? arabicSource : removeTashkeel(arabicSource);

  const bestInClassTranslation = `The Friday prayer is only valid in a comprehensive city (miṣr jāmiʿ) or in the prayer area of the city, and it is not permissible in villages. This is based on the saying of the Prophet ﷺ: "There is no Friday prayer, nor meat-drying, nor Eid al-Fitr, nor Eid al-Adha except in a comprehensive city." A comprehensive city is any place that has a ruler and a judge who enforces judgments and establishes legal punishments. This is according to Abū Yūsuf, may Allah have mercy on him. Another opinion from him states that if people gather in their largest mosque and it cannot accommodate them [then it is considered a comprehensive city]. The first opinion is the choice of al-Karkhī and is the apparent position, while the second is the choice of al-Thaljī. The ruling is not confined to the prayer area alone; rather, it is permissible throughout all the outskirts of the city because they are in the same status as the city regarding the needs of its people.`;
  const userTranslation = `Jumu'ah prayer is only valid in a comprehensive city (misr jami') or in the prayer area (musalla) of the city. It is not permissible in villages...`;

  const saveManualNote = () => {
    const trimmed = manualNoteDraft.trim();
    if (!trimmed) {
      return;
    }

    setManualNotes((current) => [
      ...current,
      {
        id: `manual-${Date.now()}`,
        author: 'Manual Note',
        body: trimmed,
      },
    ]);
    setManualNoteDraft('');
    setIsAddingManualNote(false);
  };

  const beginDiscussResize = (event) => {
    event.preventDefault();
    setDiscussResizeState({
      startX: event.clientX,
      startY: event.clientY,
      startWidth: discussSize.width,
      startHeight: discussSize.height,
    });
  };

  const sourceCardTone = isSubmitted
      ? {
        border: '#e2e8f0',
        headerBg: 'rgba(248, 250, 252, 0.8)',
        headerBorder: '#f1f5f9',
        badgeBg: '#f1f5f9',
        badgeText: '#62748e',
        sectionText: '#314158',
        bodyBg: 'rgba(248, 250, 252, 0.35)',
        arabicColor: '#62748e',
        arabicSize: `${sourceFontSize}px`,
      }
    : {
        border: '#dbeafe',
        headerBg: 'rgba(239, 246, 255, 0.4)',
        headerBorder: 'rgba(219, 234, 254, 0.5)',
        badgeBg: '#dbeafe',
        badgeText: '#1447e6',
        sectionText: '#314158',
        bodyBg: '#ffffff',
        arabicColor: '#0f172b',
        arabicSize: `${sourceFontSize}px`,
      };

  const pinnedStyle = (cardName) =>
    pinnedCard === cardName
      ? {
          position: 'sticky',
          top: 8,
          zIndex: 10,
        }
      : undefined;

  const discussFloatingStyle = {
    width: discussSize.width,
    height: discussSize.height,
    bottom: 92,
    maxWidth: 'calc(100% - 80px)',
  };

  useEffect(() => {
    if (!discussResizeState) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      setDiscussSize({
        width: Math.max(360, Math.min(720, discussResizeState.startWidth + (event.clientX - discussResizeState.startX))),
        height: Math.max(720, Math.min(window.innerHeight - 48, discussResizeState.startHeight + (event.clientY - discussResizeState.startY))),
      });
    };

    const stopResize = () => setDiscussResizeState(null);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopResize);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopResize);
    };
  }, [discussResizeState]);

  return (
    <>
      <style>{centerPanelStyles}</style>
      <div className="fg-center">
        <div className="fg-center__header">
          <div className="fg-center__headerRow">
            <div className="fg-center__headerMain">
              <h1 className="fg-center__title">
                <BookOpen size={30} color="#2563eb" strokeWidth={1.9} />
                Al-Hidayah • The Book of Prayer
              </h1>
              <div className="fg-center__subRow">
                <p className="fg-center__subtext">Chapter 4: Jumu&apos;ah (Friday Prayer)</p>
                <span className="fg-center__dot" />
                <button className="fg-center__chip" type="button">
                  <Tag size={12} strokeWidth={1.9} />
                  Fiqh Terminology
                </button>
              </div>
            </div>

            <div className="fg-center__headerActions">
              {isSubmitted && (
                <button
                  type="button"
                  className="fg-center__primaryButton"
                  onClick={() => setShowDiscuss(!showDiscuss)}
                  style={{ padding: '10px 20px' }}
                >
                  <MessageSquare size={16} />
                  Discuss This Segment
                </button>
              )}

              <span
                className="fg-center__status"
                style={
                  isSubmitted
                    ? {
                        '--status-text': '#047857',
                        '--status-bg': '#ecfdf5',
                        '--status-border': '#d1fae5',
                      }
                    : {
                        '--status-text': '#1447e6',
                        '--status-bg': '#eff6ff',
                        '--status-border': '#dbeafe',
                      }
                }
              >
                {isSubmitted ? <CheckCircle2 size={14} /> : <Sparkles size={14} />}
                {isSubmitted ? 'Submitted' : 'Drafting Phase'}
              </span>
            </div>
          </div>
        </div>

        <div className="fg-center__content">
          <div
            ref={scrollContainerRef}
            className="fg-center__scroll"
            style={{
              '--scroll-padding-bottom': '0px',
              overflowY: isSubmitted ? 'auto' : 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              className="fg-center__contentWrap"
              style={{
                '--content-wrap-padding-bottom': isSubmitted ? '92px' : '0px',
              }}
            >
              <div className="fg-center__inner">
                <div className={`fg-center__topStack${!isSubmitted ? ' fg-center__topStack--scrollable' : ''}`}>
                  {!isSubmitted && (
                    <div className="fg-center__navRow">
                      <button type="button" className="fg-center__tinyButton">
                        <ChevronLeft size={15} strokeWidth={1.9} />
                        <span>Previous</span>
                      </button>

                      <button type="button" className="fg-center__tinyButton">
                        <span>Next</span>
                        <ChevronRight size={15} strokeWidth={1.9} />
                      </button>
                    </div>
                  )}

                  <div
                    ref={sourceRef}
                    className="fg-center__card"
                    style={{
                      '--card-border': sourceCardTone.border,
                      '--card-header-bg': sourceCardTone.headerBg,
                      '--card-header-border': sourceCardTone.headerBorder,
                      '--card-header-height': '74px',
                      '--card-header-padding-x': '32px',
                      '--badge-bg': sourceCardTone.badgeBg,
                      '--badge-text': sourceCardTone.badgeText,
                      '--section-text': sourceCardTone.sectionText,
                      '--card-body-bg': sourceCardTone.bodyBg,
                      '--card-body-padding': isSubmitted ? '48px 40px 46px' : '48px 40px 68px',
                      ...pinnedStyle('source'),
                    }}
                  >
                    <div className="fg-center__cardHeader">
                      <div className="fg-center__cardTitleRow">
                        <span className="fg-center__badge">AR</span>
                        <span className="fg-center__sectionLabel">Source Text</span>
                      </div>

                      <div className="fg-center__actionRow fg-center__actionRow--subtle">
                        <ActionPill tone={tones.slate} onClick={() => adjustSourceFontSize(-2)}>
                          A-
                        </ActionPill>

                        <ActionPill tone={tones.slate} onClick={() => adjustSourceFontSize(2)}>
                          A+
                        </ActionPill>

                        {isSubmitted && (
                          <>
                            <ActionPill
                              tone={tones.blue}
                              active={pinnedCard === 'source'}
                              onClick={() => setPinnedCard(pinnedCard === 'source' ? null : 'source')}
                              icon={pinnedCard === 'source' ? <PinOff size={14} /> : <Pin size={14} />}
                            >
                              {pinnedCard === 'source' ? 'Unpin' : 'Pin'}
                            </ActionPill>

                            <ActionPill
                              tone={tones.blue}
                              onClick={() => setShowTashkeel(!showTashkeel)}
                              icon={showTashkeel ? <EyeOff size={14} /> : <Eye size={14} />}
                            >
                              {showTashkeel ? 'Hide' : 'Show'} Tashkeel
                            </ActionPill>
                          </>
                        )}

                        <ActionPill tone={tones.blue} icon={<Copy size={14} />}>
                          Copy
                        </ActionPill>
                      </div>
                    </div>

                    <div className="fg-center__textBlock fg-center__textBlock--source">
                      <p
                        className="fg-center__arabic"
                        dir="rtl"
                        style={{
                          '--arabic-color': sourceCardTone.arabicColor,
                          '--arabic-size': sourceCardTone.arabicSize,
                        }}
                      >
                        {displayedArabicText}
                      </p>
                    </div>
                  </div>

                  {!isSubmitted && (
                    <div className="fg-center__sectionSpacing fg-center__sectionSpacing--tight">
                      <div className="fg-center__lexHeader">
                        <BookOpen size={13} strokeWidth={1.9} />
                        Quick Lexicography
                      </div>

                      <div className="fg-center__lexStrip">
                        {quickLexicography.map((item) => (
                          <QuickLexTerm key={item.transliteration} {...item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {isSubmitted && (
                    <div
                      ref={bestInClassRef}
                      className="fg-center__card fg-center__sectionSpacing"
                      style={{
                        '--card-border': '#a7f3d0',
                        '--card-header-bg': 'rgba(236, 253, 245, 0.75)',
                        '--card-header-border': 'rgba(167, 243, 208, 0.8)',
                        '--badge-bg': '#d1fae5',
                        '--badge-text': '#047857',
                        '--section-text': '#334155',
                        ...pinnedStyle('bestInClass'),
                      }}
                    >
                      <div className="fg-center__cardHeader">
                        <div className="fg-center__cardTitleRow">
                          <span className="fg-center__badge">✓</span>
                          <span className="fg-center__sectionLabel">Best in Class Translation</span>
                        </div>

                        <div className="fg-center__actionRow fg-center__actionRow--subtle">
                          <ActionPill
                            tone={tones.emerald}
                            active={pinnedCard === 'bestInClass'}
                            onClick={() =>
                              setPinnedCard(pinnedCard === 'bestInClass' ? null : 'bestInClass')
                            }
                            icon={pinnedCard === 'bestInClass' ? <PinOff size={14} /> : <Pin size={14} />}
                          >
                            {pinnedCard === 'bestInClass' ? 'Unpin' : 'Pin'}
                          </ActionPill>

                          <ActionPill tone={tones.emerald} icon={<Copy size={14} />}>
                            Copy
                          </ActionPill>
                        </div>
                      </div>

                      <div className="fg-center__textBlock">
                        <p className="fg-center__paragraph">{bestInClassTranslation}</p>
                      </div>
                    </div>
                  )}

                  {isSubmitted && (
                    <div
                      ref={yourTranslationRef}
                      className="fg-center__card fg-center__sectionSpacing"
                      style={{
                        '--card-border': '#bfdbfe',
                        '--card-header-bg': 'rgba(239, 246, 255, 0.72)',
                        '--card-header-border': 'rgba(191, 219, 254, 0.8)',
                        '--badge-bg': '#dbeafe',
                        '--badge-text': '#1d4ed8',
                        '--section-text': '#334155',
                        ...pinnedStyle('yourTranslation'),
                      }}
                    >
                      <div className="fg-center__cardHeader">
                        <div className="fg-center__cardTitleRow">
                          <span className="fg-center__badge">EN</span>
                          <span className="fg-center__sectionLabel">Your Translation</span>
                        </div>

                        <div className="fg-center__actionRow fg-center__actionRow--subtle">
                          <ActionPill
                            tone={tones.blue}
                            active={pinnedCard === 'yourTranslation'}
                            onClick={() =>
                              setPinnedCard(pinnedCard === 'yourTranslation' ? null : 'yourTranslation')
                            }
                            icon={pinnedCard === 'yourTranslation' ? <PinOff size={14} /> : <Pin size={14} />}
                          >
                            {pinnedCard === 'yourTranslation' ? 'Unpin' : 'Pin'}
                          </ActionPill>

                          <ActionPill tone={tones.blue} icon={<Copy size={14} />}>
                            Copy
                          </ActionPill>
                        </div>
                      </div>

                      <div className="fg-center__textBlock">
                        <p className="fg-center__paragraph">{userTranslation}</p>
                      </div>
                    </div>
                  )}

                  {isSubmitted && (
                    <div
                      ref={discussionRef}
                      className="fg-center__card fg-center__sectionSpacing"
                      style={{
                        '--card-border': '#fde68a',
                        '--card-header-bg': 'rgba(255, 247, 237, 0.82)',
                        '--card-header-border': 'rgba(253, 230, 138, 0.78)',
                        '--section-text': '#334155',
                        ...pinnedStyle('discussion'),
                      }}
                    >
                      <div className="fg-center__cardHeader">
                        <div className="fg-center__cardTitleRow">
                          <ScrollText size={16} color="#f59e0b" />
                          <span className="fg-center__sectionLabel">Discussion Summary &amp; Notes</span>
                        </div>

                        <div className="fg-center__actionRow fg-center__actionRow--subtle">
                          <ActionPill
                            tone={tones.amber}
                            active={pinnedCard === 'discussion'}
                            onClick={() => setPinnedCard(pinnedCard === 'discussion' ? null : 'discussion')}
                            icon={pinnedCard === 'discussion' ? <PinOff size={14} /> : <Pin size={14} />}
                          >
                            {pinnedCard === 'discussion' ? 'Unpin' : 'Pin'}
                          </ActionPill>

                          <ActionPill
                            tone={tones.slate}
                            icon={<Plus size={14} />}
                            onClick={() => setIsAddingManualNote(true)}
                          >
                            Add Manual Note
                          </ActionPill>
                        </div>
                      </div>

                      <div className="fg-center__textBlock">
                        {isAddingManualNote && (
                          <div className="fg-center__noteComposer" style={{ marginBottom: 16 }}>
                            <textarea
                              className="fg-center__noteComposerTextarea"
                              placeholder="Add a note about wording, grammar, or a discussion takeaway..."
                              value={manualNoteDraft}
                              onChange={(event) => setManualNoteDraft(event.target.value)}
                            />
                            <div className="fg-center__noteComposerActions">
                              <button
                                type="button"
                                className="fg-center__ghostButton"
                                onClick={() => {
                                  setIsAddingManualNote(false);
                                  setManualNoteDraft('');
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="fg-center__primaryButton"
                                style={{ padding: '12px 26px' }}
                                onClick={saveManualNote}
                              >
                                <Send size={14} />
                                Save Note
                              </button>
                            </div>
                          </div>
                        )}

                        {manualNotes.length === 0 ? (
                          <div className="fg-center__emptyState">
                            <ScrollText size={32} color="#cbd5e1" style={{ marginBottom: 12 }} />
                            <p className="fg-center__emptyStateTitle">No discussion summary yet</p>
                            <p className="fg-center__emptyStateText">
                              Click &quot;Discuss This Segment&quot; above to start a conversation. When you summarize and
                              save, it will appear here along with any manual notes you add.
                            </p>
                          </div>
                        ) : (
                          <div className="fg-center__noteList">
                            {manualNotes.map((note) => (
                              <div key={note.id} className="fg-center__noteCard">
                                <p className="fg-center__noteMeta">{note.author}</p>
                                <p className="fg-center__noteBody">{note.body}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {!isSubmitted && (
                  <div className="fg-center__editorShell">
                    <div className="fg-center__editorCard">
                      <div className="fg-center__editorHeader">
                        <div className="fg-center__cardTitleRow">
                          <span
                            className="fg-center__badge"
                            style={{
                              '--badge-bg': '#dbeafe',
                              '--badge-text': '#1d4ed8',
                            }}
                          >
                            EN
                          </span>
                          <span className="fg-center__sectionLabel" style={{ '--section-text': '#334155' }}>
                            Translation
                          </span>
                        </div>

                        <div className="fg-center__toolbar">
                          <button
                            type="button"
                            className="fg-center__iconButton"
                            style={{
                              '--icon-color': '#94a3b8',
                              '--icon-hover-color': '#2563eb',
                              '--icon-hover-bg': '#eff6ff',
                            }}
                          >
                            <Bold size={16} strokeWidth={1.9} />
                          </button>
                          <button
                            type="button"
                            className="fg-center__iconButton"
                            style={{
                              '--icon-color': '#94a3b8',
                              '--icon-hover-color': '#2563eb',
                              '--icon-hover-bg': '#eff6ff',
                            }}
                          >
                            <Italic size={16} strokeWidth={1.9} />
                          </button>
                          <div className="fg-center__toolbarDivider" />
                          <button type="button" className="fg-center__iconButton is-active">
                            <AlignLeft size={16} strokeWidth={1.9} />
                          </button>
                          <button
                            type="button"
                            className="fg-center__iconButton"
                            style={{
                              '--icon-color': '#94a3b8',
                              '--icon-hover-color': '#2563eb',
                              '--icon-hover-bg': '#eff6ff',
                            }}
                          >
                            <AlignCenter size={16} strokeWidth={1.9} />
                          </button>
                        </div>
                      </div>

                      <div className="fg-center__editorBody">
                        <textarea
                          className="fg-center__textarea"
                          placeholder="Write your translation here..."
                        />

                        <div className="fg-center__submitRow">
                          <span className="fg-center__hintText">⌘ Enter to submit</span>
                          <button type="button" className="fg-center__primaryButton" onClick={handleSubmit}>
                            <Send size={15} strokeWidth={1.9} />
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {isSubmitted && (
          <div className="fg-center__submissionToggle">
            <span className="fg-center__submissionToggleTitle">Jump to</span>
            <div className="fg-center__submissionToggleDivider" />
            <button
              type="button"
              className="fg-center__submissionToggleButton"
              onClick={() => scrollToSection(sourceRef)}
            >
              AR
              <span className="fg-center__submissionToggleLabel">Source</span>
            </button>
            <div className="fg-center__submissionToggleDivider" />
            <button
              type="button"
              className="fg-center__submissionToggleButton is-success"
              onClick={() => scrollToSection(bestInClassRef)}
            >
              <CheckCircle2 size={14} color="#10b981" />
              <span className="fg-center__submissionToggleLabel">Best in Class</span>
            </button>
            <button
              type="button"
              className="fg-center__submissionToggleButton is-active"
              onClick={() => scrollToSection(yourTranslationRef)}
            >
              EN
              <span className="fg-center__submissionToggleLabel">Your Translation</span>
            </button>
            <button
              type="button"
              className={`fg-center__submissionToggleButton${manualNotes.length === 0 ? ' is-disabled' : ''}`}
              onClick={() => {
                if (manualNotes.length > 0) {
                  scrollToSection(discussionRef);
                }
              }}
              disabled={manualNotes.length === 0}
            >
              <ScrollText size={14} />
              <span className="fg-center__submissionToggleLabel">Discussion</span>
            </button>
          </div>
        )}

        {isSubmitted && (
          <div className="fg-center__bottomBar">
            <button type="button" className="fg-center__secondaryButton">
              <ChevronLeft size={18} />
              <span>Previous Segment</span>
            </button>

            <div className="fg-center__progress">
              <p className="fg-center__progressText">Segment 12 of 47</p>
              <div className="fg-center__progressBarRow">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className={`fg-center__progressBar${index === 2 ? ' is-active' : ''}`}
                  />
                ))}
              </div>
            </div>

            <button type="button" className="fg-center__primaryButton" style={{ padding: '14px 24px' }}>
              <span>Next Segment</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {showDiscuss &&
          (discussExpanded ? (
            <div className="fg-center__overlayBackdrop">
              <div className="fg-center__overlay fg-center__overlay--modal">
                <div className="fg-center__overlayHeader">
                  <div>
                    <p className="fg-center__overlayKicker">Discussion</p>
                    <h3 className="fg-center__overlayTitle">Segment discussion</h3>
                  </div>

                  <div className="fg-center__overlayActions">
                    <button
                      type="button"
                      className="fg-center__closeButton"
                      onClick={() => setDiscussExpanded(false)}
                      aria-label="Minimize discussion"
                    >
                      <Minimize2 size={18} />
                    </button>
                    <button
                      type="button"
                      className="fg-center__closeButton"
                      onClick={() => setShowDiscuss(false)}
                      aria-label="Close discussion"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="fg-center__overlayBody">
                  <div className="fg-center__contextBox">
                    <h4 className="fg-center__contextTitle">Start the conversation</h4>
                    <p className="fg-center__contextText">
                      Ask the first segment-specific question here. The summary will be saved when the session closes.
                    </p>
                  </div>

                  <div className="fg-center__inputShell">
                    <textarea
                      className="fg-center__overlayTextarea"
                      placeholder="Ask a segment-specific follow-up question..."
                    />
                  </div>

                  <p className="fg-center__overlayNote">
                    Discussion stays separate from the authoritative study record until the summary is saved.
                  </p>

                  <div className="fg-center__overlayFooter">
                    <button type="button" className="fg-center__primaryButton" style={{ padding: '12px 32px' }}>
                      Send
                    </button>
                    <button type="button" className="fg-center__ghostButton">
                      Summarise and save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="fg-center__overlay" style={discussFloatingStyle}>
              <div className="fg-center__overlayHeader">
                <div>
                  <p className="fg-center__overlayKicker">Discussion</p>
                  <h3 className="fg-center__overlayTitle">Segment discussion</h3>
                </div>

                <div className="fg-center__overlayActions">
                  <button
                    type="button"
                    className="fg-center__closeButton"
                    onClick={() => setDiscussExpanded(true)}
                    aria-label="Expand discussion"
                  >
                    <Maximize2 size={18} />
                  </button>
                  <button
                    type="button"
                    className="fg-center__closeButton"
                    onClick={() => setShowDiscuss(false)}
                    aria-label="Close discussion"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="fg-center__overlayBody">
                <div className="fg-center__contextBox">
                  <h4 className="fg-center__contextTitle">Start the conversation</h4>
                  <p className="fg-center__contextText">
                    Ask the first segment-specific question here. The summary will be saved when the session closes.
                  </p>
                </div>

                <div className="fg-center__inputShell">
                  <textarea
                    className="fg-center__overlayTextarea"
                    placeholder="Ask a segment-specific follow-up question..."
                  />
                </div>

                <p className="fg-center__overlayNote">
                  Discussion stays separate from the authoritative study record until the summary is saved.
                </p>

                <div className="fg-center__overlayFooter">
                  <button type="button" className="fg-center__primaryButton" style={{ padding: '12px 32px' }}>
                    Send
                  </button>
                  <button type="button" className="fg-center__ghostButton">
                    Summarise and save
                  </button>
                </div>
              </div>

              <div className="fg-center__overlayResizeHandle" onPointerDown={beginDiscussResize}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M16 0v16H0L16 0Z" />
                </svg>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
