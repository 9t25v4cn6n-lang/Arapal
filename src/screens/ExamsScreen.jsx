import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Layers3,
  Play,
  Plus,
  Save,
  Sparkles,
  Target,
} from 'lucide-react';

const EXAM_CONTEXT_STORAGE_KEY = 'design-sandbox.exam-context.v1';

const examsStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');

  .exams-screen,
  .exams-screen * {
    box-sizing: border-box;
  }

  .exams-screen {
    --exams-bg-top: #f6f9fd;
    --exams-bg-bottom: #edf3f9;
    --exams-surface: #ffffff;
    --exams-surface-soft: #f8fbff;
    --exams-surface-tint: #eff6ff;
    --exams-surface-mist: #dbeafe;
    --exams-text-strong: #0f172a;
    --exams-text-body: #334155;
    --exams-text-soft: #64748b;
    --exams-text-faint: #94a3b8;
    --exams-line: rgba(203, 213, 225, 0.92);
    --exams-line-soft: #dbe5f0;
    --exams-line-strong: #bfdbfe;
    --exams-accent: #2563eb;
    --exams-accent-strong: #1d4ed8;
    --exams-accent-soft: #93c5fd;
    --exams-accent-wash: #eff6ff;
    --exams-accent-mist: #dbeafe;
    --exams-success: #16a34a;
    --exams-success-soft: rgba(22, 163, 74, 0.08);
    --exams-warning: #d97706;
    --exams-warning-soft: rgba(217, 119, 6, 0.12);
    --exams-warning-line: rgba(245, 158, 11, 0.32);
    --exams-shadow-soft: 0 24px 60px rgba(15, 23, 42, 0.08);
    --exams-shadow-card: 0 20px 40px rgba(15, 23, 42, 0.08);
    --exams-shadow-accent: 0 24px 44px rgba(37, 99, 235, 0.18);
    min-height: 100vh;
    background:
      radial-gradient(circle at 8% 10%, rgba(219, 234, 254, 0.78), transparent 28%),
      radial-gradient(circle at 88% 12%, rgba(226, 232, 240, 0.82), transparent 24%),
      linear-gradient(180deg, var(--exams-bg-top) 0%, var(--exams-bg-bottom) 100%);
    color: var(--exams-text-body);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    overflow-x: clip;
  }

  .exams-screen__header {
    position: sticky;
    top: 0;
    z-index: 20;
    border-bottom: 1px solid var(--exams-line);
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(18px);
  }

  .exams-screen__headerInner {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px 48px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 24px;
  }

  .exams-screen__headerActions,
  .exams-screen__headerTabs {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .exams-screen__headerTabs {
    justify-content: center;
  }

  .exams-screen__headerContext {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 36px;
    padding: 0 14px;
    border-radius: 999px;
    background: rgba(239, 246, 255, 0.92);
    border: 1px solid rgba(191, 219, 254, 0.92);
    color: var(--exams-accent-strong);
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 700;
    white-space: nowrap;
  }

  .exams-screen__headerContextDot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: currentColor;
  }

  .exams-screen__headerPill,
  .exams-screen__tabButton,
  .exams-screen__ghostButton,
  .exams-screen__primaryButton,
  .exams-screen__chipButton,
  .exams-screen__scopeButton,
  .exams-screen__linkButton {
    font: inherit;
  }

  .exams-screen__headerPill,
  .exams-screen__tabButton,
  .exams-screen__ghostButton,
  .exams-screen__chipButton,
  .exams-screen__scopeButton {
    border: 1px solid var(--exams-line-soft);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.92);
    color: var(--exams-text-body);
    min-height: 42px;
    padding: 0 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease, background-color 0.2s ease;
  }

  .exams-screen__headerPill:hover,
  .exams-screen__tabButton:hover,
  .exams-screen__ghostButton:hover,
  .exams-screen__chipButton:hover,
  .exams-screen__scopeButton:hover,
  .exams-screen__primaryButton:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  }

  .exams-screen__tabButton.is-active,
  .exams-screen__scopeButton.is-active,
  .exams-screen__chipButton.is-active {
    border-color: var(--exams-line-strong);
    background: var(--exams-accent-wash);
    color: var(--exams-accent-strong);
  }

  .exams-screen__brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    justify-self: end;
  }

  .exams-screen__brandMark {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    border: 1px solid var(--exams-line-strong);
    background: linear-gradient(180deg, var(--exams-accent-wash) 0%, var(--exams-accent-mist) 100%);
    color: var(--exams-accent);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92), 0 16px 28px rgba(37, 99, 235, 0.12);
    flex: 0 0 auto;
  }

  .exams-screen__brandName {
    margin: 0 0 3px;
    font-size: 14px;
    line-height: 1;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--exams-text-strong);
  }

  .exams-screen__brandMeta {
    margin: 0;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--exams-text-soft);
  }

  .exams-screen__stage {
    position: relative;
    width: 100%;
    min-height: calc(100vh - 82px);
  }

  .exams-screen__stage.is-centered {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .exams-screen__atmosphere {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }

  .exams-screen__atmosphereWord,
  .exams-screen__atmosphereLine {
    position: absolute;
    pointer-events: none;
  }

  .exams-screen__atmosphereWord {
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: clamp(120px, 15vw, 220px);
    line-height: 0.84;
    letter-spacing: -0.08em;
    color: rgba(37, 99, 235, 0.04);
    text-shadow: 0 0 32px rgba(37, 99, 235, 0.03);
  }

  .exams-screen__atmosphereWord.is-left {
    left: -28px;
    bottom: 3%;
  }

  .exams-screen__atmosphereWord.is-right {
    right: -18px;
    top: 7%;
  }

  .exams-screen__atmosphereLine {
    width: 2px;
    opacity: 0.96;
    transform-origin: top center;
  }

  .exams-screen__atmosphereLine.is-leftSoft {
    top: -4%;
    left: 8.4%;
    height: 124%;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.07) 18%, rgba(15, 23, 42, 0.11) 50%, rgba(15, 23, 42, 0.04) 82%, rgba(15, 23, 42, 0) 100%);
    transform: rotate(-18deg);
  }

  .exams-screen__atmosphereLine.is-leftStrong {
    top: -2%;
    left: 10.2%;
    height: 122%;
    background: linear-gradient(180deg, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.18) 16%, rgba(37, 99, 235, 0.32) 50%, rgba(37, 99, 235, 0.1) 84%, rgba(37, 99, 235, 0) 100%);
    transform: rotate(-18deg);
  }

  .exams-screen__atmosphereLine.is-rightSoft {
    top: -3%;
    right: 8.6%;
    height: 126%;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.06) 18%, rgba(15, 23, 42, 0.11) 48%, rgba(15, 23, 42, 0.04) 82%, rgba(15, 23, 42, 0) 100%);
    transform: rotate(17deg);
  }

  .exams-screen__atmosphereLine.is-rightStrong {
    top: -5%;
    right: 6.9%;
    height: 128%;
    background: linear-gradient(180deg, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.16) 16%, rgba(37, 99, 235, 0.34) 50%, rgba(37, 99, 235, 0.1) 84%, rgba(37, 99, 235, 0) 100%);
    transform: rotate(17deg);
  }

  .exams-screen__content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 56px 48px 88px;
  }

  .exams-screen__hero {
    margin-bottom: 36px;
  }

  .exams-screen__hero.is-compact {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 24px;
  }

  .exams-screen__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 22px;
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--exams-accent-strong);
  }

  .exams-screen__eyebrowDot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: currentColor;
  }

  .exams-screen__title {
    margin: 0 0 16px;
    color: var(--exams-text-strong);
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: clamp(38px, 6vw, 72px);
    line-height: 0.95;
  }

  .exams-screen__lead {
    margin: 0;
    max-width: 740px;
    color: var(--exams-text-soft);
    font-size: 18px;
    line-height: 1.75;
  }

  .exams-screen__hero.is-compact .exams-screen__eyebrow {
    margin-bottom: 12px;
  }

  .exams-screen__hero.is-compact .exams-screen__title {
    margin-bottom: 10px;
    font-size: clamp(30px, 4.4vw, 44px);
    line-height: 1;
  }

  .exams-screen__hero.is-compact .exams-screen__lead {
    max-width: 580px;
    font-size: 16px;
    line-height: 1.7;
  }

  .exams-screen__heroMeta {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    padding: 0 18px;
    border-radius: 999px;
    border: 1px solid rgba(191, 219, 254, 0.92);
    background: rgba(255, 255, 255, 0.92);
    color: var(--exams-text-body);
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 700;
    box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
  }

  .exams-screen__statRow {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
    margin-bottom: 40px;
  }

  .exams-screen__statCard,
  .exams-screen__panel {
    border-radius: 24px;
    border: 1px solid var(--exams-line-soft);
    background: rgba(255, 255, 255, 0.92);
    box-shadow: var(--exams-shadow-card);
  }

  .exams-screen__statCard {
    padding: 24px;
  }

  .exams-screen__statLabel {
    margin: 0 0 10px;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--exams-text-soft);
  }

  .exams-screen__statValue {
    margin: 0;
    color: var(--exams-text-strong);
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: 32px;
    line-height: 1;
  }

  .exams-screen__statMeta {
    margin: 8px 0 0;
    color: var(--exams-text-faint);
    font-size: 13px;
    line-height: 1.5;
  }

  .exams-screen__listGrid {
    display: grid;
    grid-template-columns: minmax(280px, 0.95fr) minmax(0, 1.65fr);
    gap: 24px;
    align-items: start;
  }

  .exams-screen__featureCard {
    padding: 28px;
    min-height: 100%;
  }

  .exams-screen__featureIcon {
    width: 56px;
    height: 56px;
    border-radius: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--exams-accent-wash);
    color: var(--exams-accent-strong);
    margin-bottom: 28px;
  }

  .exams-screen__featureTitle {
    margin: 0 0 12px;
    color: var(--exams-text-strong);
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: 34px;
    line-height: 1.05;
  }

  .exams-screen__featureText {
    margin: 0 0 28px;
    color: var(--exams-text-soft);
    line-height: 1.7;
  }

  .exams-screen__primaryButton {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    border: none;
    border-radius: 999px;
    min-height: 60px;
    padding: 0 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    cursor: pointer;
    background: linear-gradient(90deg, var(--exams-accent) 0%, var(--exams-accent-strong) 100%);
    color: #ffffff;
    box-shadow: var(--exams-shadow-accent);
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
  }

  .exams-screen__primaryButton::before,
  .exams-screen__primaryButton::after {
    content: "";
    position: absolute;
    pointer-events: none;
    transition: opacity 0.32s ease, transform 0.38s ease;
  }

  .exams-screen__primaryButton::before {
    inset: 1px;
    border-radius: inherit;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.08) 34%, rgba(255, 255, 255, 0) 100%);
    opacity: 0.95;
  }

  .exams-screen__primaryButton::after {
    top: -18%;
    bottom: -18%;
    left: -26%;
    width: 30%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.34) 48%, rgba(255, 255, 255, 0) 100%);
    opacity: 0;
    transform: translateX(-10px) skewX(-18deg);
  }

  .exams-screen__primaryButton:hover::after,
  .exams-screen__primaryButton:focus-visible::after {
    opacity: 1;
    transform: translateX(260%) skewX(-18deg);
  }

  .exams-screen__primaryButton:hover {
    box-shadow: 0 28px 54px rgba(37, 99, 235, 0.24);
    filter: saturate(1.02);
  }

  .exams-screen__primaryButton:active {
    transform: translateY(0);
    box-shadow: 0 14px 28px rgba(37, 99, 235, 0.18);
  }

  .exams-screen__ghostButton {
    border: 2px solid var(--exams-line-soft);
    background: rgba(255, 255, 255, 0.94);
    color: var(--exams-text-body);
  }

  .exams-screen__listPanel {
    padding: 18px;
  }

  .exams-screen__listHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 10px 10px 18px;
  }

  .exams-screen__listTitle {
    margin: 0;
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--exams-text-soft);
  }

  .exams-screen__examList {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .exams-screen__examCard {
    padding: 22px 24px;
    border-radius: 20px;
    border: 1px solid var(--exams-line-soft);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 251, 255, 0.92) 100%);
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) auto;
    gap: 18px;
    align-items: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .exams-screen__examCard:hover {
    transform: translateY(-2px);
    border-color: var(--exams-line-strong);
    box-shadow: 0 18px 32px rgba(15, 23, 42, 0.08);
  }

  .exams-screen__examTitle {
    margin: 0 0 10px;
    color: var(--exams-text-strong);
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: 28px;
    line-height: 1.05;
  }

  .exams-screen__examMeta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }

  .exams-screen__metaPill {
    min-height: 28px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid var(--exams-line-soft);
    background: rgba(255, 255, 255, 0.92);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--exams-text-soft);
  }

  .exams-screen__metaPill.is-success {
    border-color: rgba(22, 163, 74, 0.22);
    background: var(--exams-success-soft);
    color: var(--exams-success);
  }

  .exams-screen__metaPill.is-warning {
    border-color: var(--exams-warning-line);
    background: rgba(255, 251, 235, 0.96);
    color: var(--exams-warning);
  }

  .exams-screen__examText {
    margin: 0;
    color: var(--exams-text-soft);
    line-height: 1.6;
  }

  .exams-screen__examActions {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .exams-screen__formGrid {
    display: grid;
    grid-template-columns: minmax(300px, 0.92fr) minmax(0, 1.4fr);
    gap: 24px;
    align-items: start;
  }

  .exams-screen__formPanel,
  .exams-screen__previewPanel {
    padding: 28px;
  }

  .exams-screen__panelHeader {
    margin-bottom: 24px;
  }

  .exams-screen__panelTitle {
    margin: 0 0 10px;
    color: var(--exams-text-strong);
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: 34px;
    line-height: 1.05;
  }

  .exams-screen__panelLead {
    margin: 0;
    color: var(--exams-text-soft);
    line-height: 1.7;
  }

  .exams-screen__fieldGroup {
    margin-bottom: 24px;
  }

  .exams-screen__fieldLabel {
    display: block;
    margin-bottom: 12px;
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--exams-text-soft);
  }

  .exams-screen__fieldInput {
    width: 100%;
    min-height: 58px;
    padding: 0 20px;
    border-radius: 18px;
    border: 1px solid var(--exams-line-soft);
    background: rgba(255, 255, 255, 0.96);
    color: var(--exams-text-strong);
    font: inherit;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .exams-screen__fieldInput:focus {
    border-color: var(--exams-line-strong);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
  }

  .exams-screen__scopeRow {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .exams-screen__scopeSplit {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .exams-screen__previewSummary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 24px;
  }

  .exams-screen__summaryCard {
    padding: 18px;
    border-radius: 18px;
    border: 1px solid var(--exams-line-soft);
    background: rgba(248, 251, 255, 0.92);
  }

  .exams-screen__summaryValue {
    margin: 0 0 8px;
    color: var(--exams-text-strong);
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: 28px;
    line-height: 1;
  }

  .exams-screen__summaryLabel {
    margin: 0;
    color: var(--exams-text-soft);
    font-size: 12px;
    line-height: 1.5;
  }

  .exams-screen__previewList {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }

  .exams-screen__previewItem {
    padding: 18px;
    border-radius: 18px;
    border: 1px solid var(--exams-line-soft);
    background: rgba(255, 255, 255, 0.96);
  }

  .exams-screen__previewItemTitle {
    margin: 0 0 8px;
    color: var(--exams-text-strong);
    font-size: 16px;
    line-height: 1.35;
    font-weight: 600;
  }

  .exams-screen__previewItemText,
  .exams-screen__previewItemMeta {
    margin: 0;
    color: var(--exams-text-soft);
    line-height: 1.6;
  }

  .exams-screen__previewItemMeta {
    margin-top: 8px;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .exams-screen__workspace {
    display: grid;
    grid-template-columns: minmax(220px, 0.72fr) minmax(0, 1.5fr) minmax(260px, 0.82fr);
    gap: 22px;
    align-items: start;
  }

  .exams-screen__sidebar,
  .exams-screen__workspacePanel,
  .exams-screen__aside {
    padding: 24px;
  }

  .exams-screen__questionList {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 18px;
  }

  .exams-screen__questionRow {
    padding: 14px 16px;
    border-radius: 16px;
    border: 1px solid transparent;
    background: rgba(248, 251, 255, 0.84);
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
  }

  .exams-screen__questionRow:hover {
    transform: translateY(-1px);
    border-color: var(--exams-line-strong);
  }

  .exams-screen__questionRow.is-current {
    border-color: var(--exams-line-strong);
    background: rgba(239, 246, 255, 0.92);
  }

  .exams-screen__questionRow.is-answered {
    background: rgba(248, 251, 255, 0.96);
  }

  .exams-screen__questionRowLabel {
    margin: 0 0 8px;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--exams-text-faint);
  }

  .exams-screen__questionRowTitle {
    margin: 0;
    color: var(--exams-text-body);
    line-height: 1.5;
    font-size: 14px;
  }

  .exams-screen__questionCard {
    padding: 28px;
  }

  .exams-screen__questionSource {
    padding: 22px 24px;
    border-radius: 20px;
    border: 1px solid var(--exams-line-soft);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 251, 255, 0.92) 100%);
    margin-bottom: 20px;
  }

  .exams-screen__questionPrompt {
    margin: 0 0 16px;
    color: var(--exams-text-soft);
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .exams-screen__questionSourceText {
    margin: 0;
    color: var(--exams-text-strong);
    font-size: 18px;
    line-height: 1.8;
  }

  .exams-screen__answerField {
    width: 100%;
    min-height: 320px;
    padding: 24px;
    border-radius: 20px;
    border: 1px solid var(--exams-line-soft);
    background: rgba(255, 255, 255, 0.98);
    color: var(--exams-text-strong);
    font: inherit;
    font-size: 16px;
    line-height: 1.8;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .exams-screen__answerField:focus {
    border-color: var(--exams-line-strong);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
  }

  .exams-screen__questionActions {
    margin-top: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .exams-screen__asideMeta {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 22px;
  }

  .exams-screen__asideBlock {
    padding: 18px;
    border-radius: 18px;
    border: 1px solid var(--exams-line-soft);
    background: rgba(248, 251, 255, 0.92);
  }

  .exams-screen__asideBlockTitle {
    margin: 0 0 8px;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--exams-text-soft);
  }

  .exams-screen__asideBlockValue {
    margin: 0;
    color: var(--exams-text-strong);
    font-size: 16px;
    line-height: 1.5;
  }

  .exams-screen__autosave {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 28px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid rgba(22, 163, 74, 0.18);
    background: rgba(22, 163, 74, 0.08);
    color: var(--exams-success);
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .exams-screen__resultsSummary {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 24px;
    align-items: end;
    margin-bottom: 28px;
  }

  .exams-screen__resultsHeaderMeta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 16px;
  }

  .exams-screen__groupToggle {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .exams-screen__resultsGrid {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.82fr);
    gap: 24px;
    align-items: start;
  }

  .exams-screen__groupStack {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .exams-screen__groupCard {
    padding: 22px 24px;
  }

  .exams-screen__groupHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }

  .exams-screen__groupTitle {
    margin: 0;
    color: var(--exams-text-strong);
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: 28px;
    line-height: 1.05;
  }

  .exams-screen__missList {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .exams-screen__missCard {
    padding: 18px;
    border-radius: 18px;
    border: 1px solid var(--exams-line-soft);
    background: rgba(255, 255, 255, 0.96);
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 16px;
    align-items: start;
  }

  .exams-screen__missTitle {
    margin: 0 0 8px;
    color: var(--exams-text-strong);
    font-size: 16px;
    line-height: 1.4;
    font-weight: 600;
  }

  .exams-screen__missText {
    margin: 0;
    color: var(--exams-text-soft);
    line-height: 1.6;
  }

  .exams-screen__missBadges {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 12px;
  }

  .exams-screen__missPill {
    min-height: 26px;
    padding: 0 10px;
    border-radius: 999px;
    border: 1px solid var(--exams-warning-line);
    background: rgba(255, 251, 235, 0.96);
    color: var(--exams-warning);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .exams-screen__resultsAside {
    padding: 28px;
  }

  .exams-screen__resultsScore {
    margin: 0 0 16px;
    color: var(--exams-text-strong);
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: 64px;
    line-height: 0.92;
  }

  .exams-screen__resultsScoreText {
    margin: 0 0 28px;
    color: var(--exams-text-soft);
    line-height: 1.7;
  }

  .exams-screen__linkButton {
    border: none;
    background: transparent;
    padding: 0;
    color: var(--exams-accent-strong);
    cursor: pointer;
    font-size: 13px;
    line-height: 1;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  @media (max-width: 1180px) {
    .exams-screen__listGrid,
    .exams-screen__formGrid,
    .exams-screen__resultsGrid,
    .exams-screen__workspace {
      grid-template-columns: 1fr;
    }

    .exams-screen__resultsSummary {
      grid-template-columns: 1fr;
      align-items: start;
    }

    .exams-screen__hero.is-compact {
      align-items: start;
      flex-direction: column;
    }
  }

  @media (max-width: 900px) {
    .exams-screen__headerInner,
    .exams-screen__content {
      padding-left: 24px;
      padding-right: 24px;
    }

    .exams-screen__headerInner {
      grid-template-columns: 1fr;
      justify-items: start;
    }

    .exams-screen__headerTabs {
      justify-content: flex-start;
    }

    .exams-screen__brand {
      justify-self: start;
    }

    .exams-screen__statRow,
    .exams-screen__previewSummary {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .exams-screen__title {
      font-size: 44px;
    }

    .exams-screen__atmosphereWord {
      display: none;
    }

    .exams-screen__questionActions {
      flex-direction: column;
      align-items: stretch;
    }
  }
`;

const studyScopePool = [
  {
    id: '1.1',
    tracker: 1,
    prefix: '1',
    label: '1.1 Types of Water',
    concept: 'Purity foundations',
    source: 'Classify the kinds of water that retain ritual purity and explain the condition that causes them to lose it.',
    reviewNote: 'The answer tended to collapse the legal distinction between pure, purifying, and merely clean.',
  },
  {
    id: '1.2',
    tracker: 2,
    prefix: '1',
    label: '1.2 Ablution (Wudu)',
    concept: 'Preparation before prayer',
    source: 'Describe the sequence of ablution and the intention that gives the act devotional coherence.',
    reviewNote: 'Misses usually happen around order, intention, and the difference between pillars and sunnah acts.',
  },
  {
    id: '1.3',
    tracker: 3,
    prefix: '1',
    label: '1.3 Ghusl',
    concept: 'Major purification',
    source: 'Explain when ghusl becomes necessary and how completeness differs from bare validity.',
    reviewNote: 'This segment often needs remediation because students conflate the triggers with the method.',
  },
  {
    id: '1.4',
    tracker: 4,
    prefix: '1',
    label: '1.4 Tayammum',
    concept: 'Substitute purification',
    source: 'State when dry ablution replaces water and what conditions restore the obligation to use water again.',
    reviewNote: 'The common weakness is forgetting the conditions that invalidate the substitute.',
  },
  {
    id: '2.1',
    tracker: 5,
    prefix: '2',
    label: '2.1 Times of Prayer',
    concept: 'Prayer timings',
    source: 'Summarise the opening and closing windows of the daily prayers and how certainty is established.',
    reviewNote: 'Students can miss the relationship between observation, certainty, and beginning windows.',
  },
  {
    id: '2.2',
    tracker: 6,
    prefix: '2',
    label: '2.2 Conditions',
    concept: 'Prayer conditions',
    source: 'List the preconditions for valid prayer and explain why each is treated as a gateway rather than an internal act.',
    reviewNote: 'This is a high-value remediation segment because several conditions are easy to merge together.',
  },
  {
    id: '2.3',
    tracker: 7,
    prefix: '2',
    label: "2.3 Jumu'ah",
    concept: 'Congregational practice',
    source: 'Outline what distinguishes Jumu’ah from the normal midday prayer in obligation, attendance, and khutbah structure.',
    reviewNote: 'Confusion often appears around attendance obligation and the role of the khutbah.',
  },
  {
    id: '3.1',
    tracker: 8,
    prefix: '3',
    label: '3.1 Opening Intentions',
    concept: 'Fasting intentions',
    source: 'Explain the role of intention at the opening of the fast and why delayed intention changes the legal frame.',
    reviewNote: 'Learners often blur intention timing with the later invalidators of the fast.',
  },
];

const initialExamSeeds = [
  {
    id: 'exam-1',
    title: 'Prayer foundations checkpoint',
    createdAt: 'Today',
    scopeLabel: 'Prefix 2',
    status: 'ready',
    questionIds: ['2.1', '2.2', '2.3'],
    lastScore: null,
  },
  {
    id: 'exam-2',
    title: 'Purity recall sprint',
    createdAt: 'Yesterday',
    scopeLabel: 'Trackers 1–4',
    status: 'completed',
    questionIds: ['1.1', '1.2', '1.3', '1.4'],
    lastScore: 82,
  },
];

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

function buildQuestions(questionIds) {
  return questionIds
    .map((id) => studyScopePool.find((item) => item.id === id))
    .filter(Boolean)
    .map((item, index) => ({
      ...item,
      number: index + 1,
    }));
}

function createExamRecord({ title, scopeLabel, questionIds, createdAt = 'Just now', status = 'ready', lastScore = null }) {
  return {
    id: `exam-${Math.random().toString(36).slice(2, 8)}`,
    title,
    createdAt,
    scopeLabel,
    status,
    lastScore,
    questions: buildQuestions(questionIds),
  };
}

function hydrateInitialExams() {
  return initialExamSeeds.map((seed) => createExamRecord(seed));
}

function filterScopeItems(scopeMode, prefixValue, rangeStart, rangeEnd) {
  if (scopeMode === 'prefix') {
    const cleanPrefix = prefixValue.trim();
    if (!cleanPrefix) {
      return [];
    }

    return studyScopePool.filter((item) => item.id.startsWith(cleanPrefix));
  }

  const start = Math.min(rangeStart, rangeEnd);
  const end = Math.max(rangeStart, rangeEnd);
  return studyScopePool.filter((item) => item.tracker >= start && item.tracker <= end);
}

function evaluateAttempt(exam, answers) {
  const gradedQuestions = exam.questions.map((question, index) => {
    const answer = answers[question.id] ?? '';
    const trimmed = answer.trim();
    let outcome = 'pass';

    if (!trimmed || trimmed.length < 40) {
      outcome = 'miss';
    } else if (index === 2 || index === 5) {
      outcome = 'miss';
    } else if (trimmed.length < 85 || index === 1) {
      outcome = 'review';
    }

    return {
      ...question,
      answer,
      outcome,
      segmentLabel: question.label,
      conceptLabel: question.concept,
      remediationNote: question.reviewNote,
    };
  });

  const passCount = gradedQuestions.filter((question) => question.outcome === 'pass').length;
  const reviewCount = gradedQuestions.filter((question) => question.outcome === 'review').length;
  const missCount = gradedQuestions.filter((question) => question.outcome === 'miss').length;
  const score = Math.round(((passCount + reviewCount * 0.5) / gradedQuestions.length) * 100);

  return {
    score,
    passCount,
    reviewCount,
    missCount,
    questions: gradedQuestions,
  };
}

function StageAtmosphere() {
  return (
    <div className="exams-screen__atmosphere" aria-hidden="true">
      <div className="exams-screen__atmosphereLine is-leftSoft" />
      <div className="exams-screen__atmosphereLine is-leftStrong" />
      <div className="exams-screen__atmosphereLine is-rightSoft" />
      <div className="exams-screen__atmosphereLine is-rightStrong" />
      <div className="exams-screen__atmosphereWord is-left">Arapal</div>
      <div className="exams-screen__atmosphereWord is-right">Arapal</div>
    </div>
  );
}

function HeaderPill({ children, onClick }) {
  return (
    <button type="button" className="exams-screen__headerPill" onClick={onClick}>
      {children}
    </button>
  );
}

function SummaryCard({ label, value, meta }) {
  return (
    <div className="exams-screen__summaryCard">
      <p className="exams-screen__summaryValue">{value}</p>
      <p className="exams-screen__summaryLabel">{label}</p>
      {meta ? <p className="exams-screen__summaryLabel">{meta}</p> : null}
    </div>
  );
}

function ExamsScreen() {
  const [view, setView] = useState('list');
  const [exams, setExams] = useState(() => hydrateInitialExams());
  const [scopeMode, setScopeMode] = useState('prefix');
  const [prefixValue, setPrefixValue] = useState('2');
  const [rangeStart, setRangeStart] = useState(2);
  const [rangeEnd, setRangeEnd] = useState(6);
  const [draftTitle, setDraftTitle] = useState('Focused checkpoint');
  const [activeExamId, setActiveExamId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [autosaveState, setAutosaveState] = useState('Saved');
  const [reviewGrouping, setReviewGrouping] = useState('concept');
  const [activeResult, setActiveResult] = useState(null);
  const autosaveTimerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const activeExam = useMemo(
    () => exams.find((exam) => exam.id === activeExamId) || null,
    [activeExamId, exams],
  );

  const scopePreview = useMemo(
    () => filterScopeItems(scopeMode, prefixValue, rangeStart, rangeEnd),
    [prefixValue, rangeEnd, rangeStart, scopeMode],
  );

  const questionCount = scopePreview.length;
  const conceptCount = useMemo(() => new Set(scopePreview.map((item) => item.concept)).size, [scopePreview]);
  const estimatedMinutes = Math.max(8, scopePreview.length * 6);
  const currentQuestion = activeExam?.questions[currentQuestionIndex] ?? null;
  const answeredCount = useMemo(
    () => Object.values(answers).filter((value) => value.trim()).length,
    [answers],
  );

  useEffect(() => {
    if (view !== 'take') {
      return undefined;
    }

    if (autosaveTimerRef.current) {
      window.clearTimeout(autosaveTimerRef.current);
    }

    setAutosaveState('Saving');
    autosaveTimerRef.current = window.setTimeout(() => {
      setAutosaveState('Saved');
    }, 600);

    return () => {
      if (autosaveTimerRef.current) {
        window.clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [answers, view]);

  const elapsedMinutes = Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 60000));

  const listStats = useMemo(() => {
    const readyCount = exams.filter((exam) => exam.status === 'ready').length;
    const completedExams = exams.filter((exam) => typeof exam.lastScore === 'number');
    const averageScore = completedExams.length
      ? Math.round(completedExams.reduce((total, exam) => total + exam.lastScore, 0) / completedExams.length)
      : 0;

    return {
      readyCount,
      totalCount: exams.length,
      averageScore,
    };
  }, [exams]);

  const groupedMisses = useMemo(() => {
    if (!activeResult) {
      return [];
    }

    const misses = activeResult.questions.filter((question) => question.outcome !== 'pass');
    const map = new Map();

    misses.forEach((question) => {
      const key = reviewGrouping === 'concept' ? question.conceptLabel : question.segmentLabel;
      const existing = map.get(key) || [];
      existing.push(question);
      map.set(key, existing);
    });

    return Array.from(map.entries()).map(([title, items]) => ({
      title,
      items,
    }));
  }, [activeResult, reviewGrouping]);

  const resetDraft = () => {
    setScopeMode('prefix');
    setPrefixValue('2');
    setRangeStart(2);
    setRangeEnd(6);
    setDraftTitle('Focused checkpoint');
  };

  const handleCreateExam = () => {
    if (!scopePreview.length) {
      return;
    }

    const scopeLabel =
      scopeMode === 'prefix'
        ? `Prefix ${prefixValue.trim()}`
        : `Trackers ${Math.min(rangeStart, rangeEnd)}–${Math.max(rangeStart, rangeEnd)}`;

    const created = createExamRecord({
      title: draftTitle.trim() || 'New exam',
      scopeLabel,
      questionIds: scopePreview.map((item) => item.id),
    });

    setExams((current) => [created, ...current]);
    setActiveExamId(created.id);
    setView('list');
    resetDraft();
  };

  const handleOpenGenerate = () => {
    resetDraft();
    setView('generate');
  };

  const handleOpenTake = (examId) => {
    const exam = exams.find((item) => item.id === examId);
    if (!exam) {
      return;
    }

    startTimeRef.current = Date.now();
    setActiveExamId(exam.id);
    setCurrentQuestionIndex(0);
    setAnswers(Object.fromEntries(exam.questions.map((question) => [question.id, ''])));
    setAutosaveState('Saved');
    setView('take');
  };

  const handleAnswerChange = (value) => {
    if (!currentQuestion) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: value,
    }));
  };

  const handleSubmitExam = () => {
    if (!activeExam) {
      return;
    }

    const result = evaluateAttempt(activeExam, answers);
    setActiveResult({
      ...result,
      examId: activeExam.id,
      examTitle: activeExam.title,
    });

    setExams((current) =>
      current.map((exam) =>
        exam.id === activeExam.id
          ? {
              ...exam,
              status: 'completed',
              lastScore: result.score,
            }
          : exam,
      ),
    );
    setView('results');
  };

  const handleJumpToStudy = (question) => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        EXAM_CONTEXT_STORAGE_KEY,
        JSON.stringify({
          segmentId: question.id,
          examTitle: activeResult?.examTitle || activeExam?.title || 'Exam review',
          concept: question.conceptLabel,
          reason: question.outcome === 'miss' ? 'Exam miss' : 'Worth revisiting',
        }),
      );
      window.location.hash = 'study';
    }
  };

  return (
    <>
      <style>{examsStyles}</style>
      <div className="exams-screen">
        <header className="exams-screen__header">
          <div className="exams-screen__headerInner">
            <div className="exams-screen__headerActions">
              <HeaderPill onClick={() => (window.location.hash = 'home')}>
                <ArrowLeft size={16} strokeWidth={1.9} />
                Project Home
              </HeaderPill>
              {view === 'take' ? (
                <span className="exams-screen__headerContext">
                  <span className="exams-screen__headerContextDot" />
                  Attempt in progress
                </span>
              ) : null}
              {view === 'results' ? (
                <span className="exams-screen__headerContext">
                  <span className="exams-screen__headerContextDot" />
                  Exam results
                </span>
              ) : null}
            </div>

            <div className="exams-screen__headerTabs">
              <button
                type="button"
                className={cn('exams-screen__tabButton', view === 'list' ? 'is-active' : '')}
                onClick={() => setView('list')}
              >
                Exams
              </button>
              <button
                type="button"
                className={cn('exams-screen__tabButton', view === 'generate' ? 'is-active' : '')}
                onClick={handleOpenGenerate}
              >
                Generate
              </button>
            </div>

            <div className="exams-screen__brand">
              <div className="exams-screen__brandMark">
                <ClipboardList size={18} strokeWidth={1.9} />
              </div>
              <div>
                <p className="exams-screen__brandName">Arapal</p>
                <p className="exams-screen__brandMeta">Exams</p>
              </div>
            </div>
          </div>
        </header>

        {view === 'list' ? (
          <section className="exams-screen__stage">
            <StageAtmosphere />
            <div className="exams-screen__content">
              <div className="exams-screen__hero">
                <p className="exams-screen__eyebrow">
                  <span className="exams-screen__eyebrowDot" />
                  Exams
                </p>
                <h1 className="exams-screen__title">Build focused assessment loops</h1>
                <p className="exams-screen__lead">
                  Create scoped exams from meaningful study ranges, take them without leaving the app, and send misses back into study with context intact.
                </p>
              </div>

              <div className="exams-screen__statRow">
                <div className="exams-screen__statCard">
                  <p className="exams-screen__statLabel">Saved exams</p>
                  <p className="exams-screen__statValue">{listStats.totalCount}</p>
                  <p className="exams-screen__statMeta">Active assessment library</p>
                </div>
                <div className="exams-screen__statCard">
                  <p className="exams-screen__statLabel">Ready to take</p>
                  <p className="exams-screen__statValue">{listStats.readyCount}</p>
                  <p className="exams-screen__statMeta">Prepared and waiting</p>
                </div>
                <div className="exams-screen__statCard">
                  <p className="exams-screen__statLabel">Recent score</p>
                  <p className="exams-screen__statValue">{listStats.averageScore ? `${listStats.averageScore}%` : '—'}</p>
                  <p className="exams-screen__statMeta">Average across completed attempts</p>
                </div>
              </div>

              <div className="exams-screen__listGrid">
                <div className="exams-screen__panel exams-screen__featureCard">
                  <div className="exams-screen__featureIcon">
                    <Plus size={28} strokeWidth={1.9} />
                  </div>
                  <h2 className="exams-screen__featureTitle">Generate a new exam</h2>
                  <p className="exams-screen__featureText">
                    Scope by prefix or tracker range, preview the included material, and save the exam before anyone starts answering.
                  </p>
                  <button type="button" className="exams-screen__primaryButton" onClick={handleOpenGenerate}>
                    <Sparkles size={16} strokeWidth={1.9} />
                    Create exam
                  </button>
                </div>

                <div className="exams-screen__panel exams-screen__listPanel">
                  <div className="exams-screen__listHeader">
                    <p className="exams-screen__listTitle">Saved exams</p>
                    <button type="button" className="exams-screen__ghostButton" onClick={handleOpenGenerate}>
                      <Plus size={16} strokeWidth={1.9} />
                      New
                    </button>
                  </div>

                  <div className="exams-screen__examList">
                    {exams.map((exam) => (
                      <article key={exam.id} className="exams-screen__examCard">
                        <div>
                          <div className="exams-screen__examMeta">
                            <span className={cn('exams-screen__metaPill', exam.status === 'completed' ? 'is-success' : '')}>
                              {exam.status === 'completed' ? 'Completed' : 'Ready'}
                            </span>
                            <span className="exams-screen__metaPill">{exam.scopeLabel}</span>
                            <span className="exams-screen__metaPill">{exam.questions.length} questions</span>
                          </div>
                          <h3 className="exams-screen__examTitle">{exam.title}</h3>
                          <p className="exams-screen__examText">
                            Created {exam.createdAt}. {exam.lastScore ? `Last score ${exam.lastScore}%.` : 'No attempt yet.'}
                          </p>
                        </div>

                        <div className="exams-screen__examActions">
                          {exam.status === 'completed' ? (
                            <button
                              type="button"
                              className="exams-screen__ghostButton"
                              onClick={() => {
                                setActiveExamId(exam.id);
                                const result = evaluateAttempt(
                                  exam,
                                  Object.fromEntries(exam.questions.map((question, index) => [
                                    question.id,
                                    index % 3 === 0 ? 'Short answer draft' : 'A fuller answer that holds the distinction more carefully and connects the ruling back to study context.',
                                  ])),
                                );
                                setActiveResult({
                                  ...result,
                                  examId: exam.id,
                                  examTitle: exam.title,
                                });
                                setView('results');
                              }}
                            >
                              Review results
                            </button>
                          ) : null}
                          <button type="button" className="exams-screen__primaryButton" onClick={() => handleOpenTake(exam.id)}>
                            <Play size={16} strokeWidth={1.9} />
                            {exam.status === 'completed' ? 'Retake exam' : 'Open exam'}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {view === 'generate' ? (
          <section className="exams-screen__stage">
            <StageAtmosphere />
            <div className="exams-screen__content">
              <div className="exams-screen__hero">
                <p className="exams-screen__eyebrow">
                  <span className="exams-screen__eyebrowDot" />
                  Generate exam
                </p>
                <h1 className="exams-screen__title">Build an exam from a meaningful scope</h1>
                <p className="exams-screen__lead">
                  Preview matters here. Choose the scope first, check what will be included, then save the exam into the project library.
                </p>
              </div>

              <div className="exams-screen__formGrid">
                <div className="exams-screen__panel exams-screen__formPanel">
                  <div className="exams-screen__panelHeader">
                    <h2 className="exams-screen__panelTitle">Scope selection</h2>
                    <p className="exams-screen__panelLead">Set the exam name, choose a scope model, and let the preview show the exact study surface before you commit.</p>
                  </div>

                  <div className="exams-screen__fieldGroup">
                    <label className="exams-screen__fieldLabel">Exam title</label>
                    <input
                      type="text"
                      className="exams-screen__fieldInput"
                      value={draftTitle}
                      onChange={(event) => setDraftTitle(event.target.value)}
                    />
                  </div>

                  <div className="exams-screen__fieldGroup">
                    <label className="exams-screen__fieldLabel">Scope type</label>
                    <div className="exams-screen__scopeRow">
                      <button
                        type="button"
                        className={cn('exams-screen__scopeButton', scopeMode === 'prefix' ? 'is-active' : '')}
                        onClick={() => setScopeMode('prefix')}
                      >
                        <Layers3 size={16} strokeWidth={1.9} />
                        Prefix
                      </button>
                      <button
                        type="button"
                        className={cn('exams-screen__scopeButton', scopeMode === 'range' ? 'is-active' : '')}
                        onClick={() => setScopeMode('range')}
                      >
                        <Target size={16} strokeWidth={1.9} />
                        Tracker range
                      </button>
                    </div>
                  </div>

                  {scopeMode === 'prefix' ? (
                    <div className="exams-screen__fieldGroup">
                      <label className="exams-screen__fieldLabel">Prefix</label>
                      <input
                        type="text"
                        className="exams-screen__fieldInput"
                        value={prefixValue}
                        onChange={(event) => setPrefixValue(event.target.value)}
                        placeholder="Example: 2 or 2.1"
                      />
                    </div>
                  ) : (
                    <div className="exams-screen__fieldGroup">
                      <label className="exams-screen__fieldLabel">Tracker range</label>
                      <div className="exams-screen__scopeSplit">
                        <input
                          type="number"
                          min="1"
                          max={studyScopePool.length}
                          className="exams-screen__fieldInput"
                          value={rangeStart}
                          onChange={(event) => setRangeStart(Number(event.target.value))}
                        />
                        <input
                          type="number"
                          min="1"
                          max={studyScopePool.length}
                          className="exams-screen__fieldInput"
                          value={rangeEnd}
                          onChange={(event) => setRangeEnd(Number(event.target.value))}
                        />
                      </div>
                    </div>
                  )}

                  <div className="exams-screen__questionActions">
                    <button type="button" className="exams-screen__ghostButton" onClick={() => setView('list')}>
                      <ArrowLeft size={16} strokeWidth={1.9} />
                      Back to exams
                    </button>
                    <button
                      type="button"
                      className="exams-screen__primaryButton"
                      disabled={!scopePreview.length}
                      onClick={handleCreateExam}
                    >
                      <Save size={16} strokeWidth={1.9} />
                      Create and save exam
                    </button>
                  </div>
                </div>

                <div className="exams-screen__panel exams-screen__previewPanel">
                  <div className="exams-screen__panelHeader">
                    <h2 className="exams-screen__panelTitle">Preview</h2>
                    <p className="exams-screen__panelLead">Preview the scope before saving so the exam never feels opaque or error-prone.</p>
                  </div>

                  <div className="exams-screen__previewSummary">
                    <SummaryCard label="Questions" value={questionCount || '—'} />
                    <SummaryCard label="Concepts" value={conceptCount || '—'} />
                    <SummaryCard label="Estimated time" value={`${estimatedMinutes}m`} />
                  </div>

                  <div className="exams-screen__previewList">
                    {scopePreview.length ? (
                      scopePreview.map((item) => (
                        <div key={item.id} className="exams-screen__previewItem">
                          <h3 className="exams-screen__previewItemTitle">{item.label}</h3>
                          <p className="exams-screen__previewItemText">{item.source}</p>
                          <p className="exams-screen__previewItemMeta">{item.concept}</p>
                        </div>
                      ))
                    ) : (
                      <div className="exams-screen__previewItem">
                        <h3 className="exams-screen__previewItemTitle">No matching study scope yet</h3>
                        <p className="exams-screen__previewItemText">Choose a prefix or range that includes at least one segment so the exam preview can resolve clearly.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {view === 'take' && activeExam ? (
          <section className="exams-screen__stage">
            <StageAtmosphere />
            <div className="exams-screen__content">
              <div className="exams-screen__hero is-compact">
                <div>
                  <p className="exams-screen__eyebrow">
                    <span className="exams-screen__eyebrowDot" />
                    Take exam
                  </p>
                  <h1 className="exams-screen__title">{activeExam.title}</h1>
                  <p className="exams-screen__lead">Stay in the flow, answer inside the app, and let autosave keep the attempt safe while you work.</p>
                </div>
                <div className="exams-screen__heroMeta">
                  <Save size={12} strokeWidth={1.9} />
                  {activeExam.questions.length} questions · autosave on
                </div>
              </div>

              <div className="exams-screen__workspace">
                <aside className="exams-screen__panel exams-screen__sidebar">
                  <p className="exams-screen__listTitle">Questions</p>
                  <div className="exams-screen__questionList">
                    {activeExam.questions.map((question, index) => {
                      const hasAnswer = Boolean((answers[question.id] || '').trim());
                      return (
                        <button
                          key={question.id}
                          type="button"
                          className={cn(
                            'exams-screen__questionRow',
                            currentQuestionIndex === index ? 'is-current' : '',
                            hasAnswer ? 'is-answered' : '',
                          )}
                          onClick={() => setCurrentQuestionIndex(index)}
                        >
                          <p className="exams-screen__questionRowLabel">Question {index + 1}</p>
                          <p className="exams-screen__questionRowTitle">{question.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </aside>

                <section className="exams-screen__panel exams-screen__workspacePanel">
                  {currentQuestion ? (
                    <>
                      <div className="exams-screen__panelHeader">
                        <h2 className="exams-screen__panelTitle">Question {currentQuestionIndex + 1}</h2>
                        <p className="exams-screen__panelLead">{currentQuestion.label} · {currentQuestion.concept}</p>
                      </div>

                      <div className="exams-screen__questionSource">
                        <p className="exams-screen__questionPrompt">Prompt</p>
                        <p className="exams-screen__questionSourceText">{currentQuestion.source}</p>
                      </div>

                      <textarea
                        className="exams-screen__answerField"
                        value={answers[currentQuestion.id] || ''}
                        onChange={(event) => handleAnswerChange(event.target.value)}
                        placeholder="Write your answer here. AraPal will autosave your progress as you go."
                      />

                      <div className="exams-screen__questionActions">
                        <button
                          type="button"
                          className="exams-screen__ghostButton"
                          onClick={() => setCurrentQuestionIndex((current) => Math.max(0, current - 1))}
                          disabled={currentQuestionIndex === 0}
                        >
                          <ArrowLeft size={16} strokeWidth={1.9} />
                          Previous
                        </button>
                        {currentQuestionIndex < activeExam.questions.length - 1 ? (
                          <button
                            type="button"
                            className="exams-screen__primaryButton"
                            onClick={() => setCurrentQuestionIndex((current) => Math.min(activeExam.questions.length - 1, current + 1))}
                          >
                            Save & next
                            <ArrowRight size={16} strokeWidth={1.9} />
                          </button>
                        ) : (
                          <button type="button" className="exams-screen__primaryButton" onClick={handleSubmitExam}>
                            <Check size={16} strokeWidth={1.9} />
                            Submit for grading
                          </button>
                        )}
                      </div>
                    </>
                  ) : null}
                </section>

                <aside className="exams-screen__panel exams-screen__aside">
                  <div className="exams-screen__asideMeta">
                    <div className="exams-screen__asideBlock">
                      <p className="exams-screen__asideBlockTitle">Autosave</p>
                      <div className="exams-screen__autosave">
                        <Save size={12} strokeWidth={1.9} />
                        {autosaveState}
                      </div>
                    </div>
                    <div className="exams-screen__asideBlock">
                      <p className="exams-screen__asideBlockTitle">Progress</p>
                      <p className="exams-screen__asideBlockValue">{answeredCount} of {activeExam.questions.length} answered</p>
                    </div>
                    <div className="exams-screen__asideBlock">
                      <p className="exams-screen__asideBlockTitle">Elapsed</p>
                      <p className="exams-screen__asideBlockValue">{elapsedMinutes} minutes</p>
                    </div>
                    <div className="exams-screen__asideBlock">
                      <p className="exams-screen__asideBlockTitle">Scope</p>
                      <p className="exams-screen__asideBlockValue">{activeExam.scopeLabel}</p>
                    </div>
                  </div>

                  <button type="button" className="exams-screen__ghostButton" onClick={() => setView('list')}>
                    Back to exam list
                  </button>
                </aside>
              </div>
            </div>
          </section>
        ) : null}

        {view === 'results' && activeResult ? (
          <section className="exams-screen__stage">
            <StageAtmosphere />
            <div className="exams-screen__content">
              <div className="exams-screen__resultsSummary">
                <div>
                  <p className="exams-screen__eyebrow">
                    <span className="exams-screen__eyebrowDot" />
                    Exam results
                  </p>
                  <h1 className="exams-screen__title">{activeResult.examTitle}</h1>
                  <p className="exams-screen__lead">Review misses by concept or segment, then jump directly into the affected study material with context preserved.</p>
                  <div className="exams-screen__resultsHeaderMeta">
                    <span className="exams-screen__metaPill is-warning">{activeResult.missCount} misses</span>
                    <span className="exams-screen__metaPill">{activeResult.reviewCount} worth reviewing</span>
                    <span className="exams-screen__metaPill is-success">{activeResult.passCount} strong</span>
                  </div>
                </div>

                <div className="exams-screen__groupToggle">
                  <button
                    type="button"
                    className={cn('exams-screen__chipButton', reviewGrouping === 'concept' ? 'is-active' : '')}
                    onClick={() => setReviewGrouping('concept')}
                  >
                    Group by concept
                  </button>
                  <button
                    type="button"
                    className={cn('exams-screen__chipButton', reviewGrouping === 'segment' ? 'is-active' : '')}
                    onClick={() => setReviewGrouping('segment')}
                  >
                    Group by segment
                  </button>
                </div>
              </div>

              <div className="exams-screen__resultsGrid">
                <div className="exams-screen__groupStack">
                  {groupedMisses.map((group) => (
                    <div key={group.title} className="exams-screen__panel exams-screen__groupCard">
                      <div className="exams-screen__groupHeader">
                        <h2 className="exams-screen__groupTitle">{group.title}</h2>
                        <span className="exams-screen__metaPill">{group.items.length} items</span>
                      </div>

                      <div className="exams-screen__missList">
                        {group.items.map((item) => (
                          <div key={item.id} className="exams-screen__missCard">
                            <div>
                              <h3 className="exams-screen__missTitle">{item.segmentLabel}</h3>
                              <p className="exams-screen__missText">{item.remediationNote}</p>
                              <div className="exams-screen__missBadges">
                                <span className="exams-screen__missPill">{item.outcome === 'miss' ? 'Needs review' : 'Worth revisiting'}</span>
                                <span className="exams-screen__metaPill">{item.conceptLabel}</span>
                              </div>
                            </div>
                            <button type="button" className="exams-screen__ghostButton" onClick={() => handleJumpToStudy(item)}>
                              <BookOpen size={16} strokeWidth={1.9} />
                              Jump to study
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <aside className="exams-screen__panel exams-screen__resultsAside">
                  <p className="exams-screen__resultsScore">{activeResult.score}%</p>
                  <p className="exams-screen__resultsScoreText">
                    The attempt is saved. Use this panel to decide whether to jump into the misses now or return to the exam library and keep the remediation path for later.
                  </p>

                  <div className="exams-screen__asideMeta">
                    <div className="exams-screen__asideBlock">
                      <p className="exams-screen__asideBlockTitle">Misses</p>
                      <p className="exams-screen__asideBlockValue">{activeResult.missCount}</p>
                    </div>
                    <div className="exams-screen__asideBlock">
                      <p className="exams-screen__asideBlockTitle">Worth reviewing</p>
                      <p className="exams-screen__asideBlockValue">{activeResult.reviewCount}</p>
                    </div>
                    <div className="exams-screen__asideBlock">
                      <p className="exams-screen__asideBlockTitle">Strong answers</p>
                      <p className="exams-screen__asideBlockValue">{activeResult.passCount}</p>
                    </div>
                  </div>

                  <div className="exams-screen__questionActions">
                    <button type="button" className="exams-screen__primaryButton" onClick={() => setView('list')}>
                      <CheckCircle2 size={16} strokeWidth={1.9} />
                      Return to exams
                    </button>
                    <button
                      type="button"
                      className="exams-screen__ghostButton"
                      onClick={() => handleJumpToStudy(activeResult.questions.find((question) => question.outcome !== 'pass') || activeResult.questions[0])}
                    >
                      <BookOpen size={16} strokeWidth={1.9} />
                      Resume in study
                    </button>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}

export default ExamsScreen;
