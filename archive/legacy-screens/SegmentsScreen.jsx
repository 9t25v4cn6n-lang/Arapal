import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  FolderGit2,
  GitBranch,
  Layers3,
  Search,
  Sparkles,
  SplitSquareVertical,
} from 'lucide-react';

const segmentScreenStyles = `

  .segments-screen,
  .segments-screen * {
    box-sizing: border-box;
  }

  .segments-screen {
    --segments-max-width: 1520px;
    --segments-card-pad: 24px;
    --segments-card-gap: 16px;
    --segments-card-focus-pad-y: 16px;
    --segments-card-focus-pad-x: 16px;
    --segments-text-strong: #0f172a;
    --segments-text-body: #334155;
    --segments-text-soft: #64748b;
    --segments-line: rgba(203, 213, 225, 0.92);
    --segments-glass: rgba(255, 255, 255, 0.62);
    --segments-glass-strong: rgba(255, 255, 255, 0.82);
    --segments-shadow-soft: 0 24px 60px rgba(15, 23, 42, 0.08);
    --segments-shadow-card: 0 30px 60px rgba(15, 23, 42, 0.12);
    --segments-radius-xl: 34px;
    --segments-radius-lg: 26px;
    --segments-radius-md: 20px;
    --segments-radius-sm: 16px;
    --segments-space-1: 8px;
    --segments-space-2: 12px;
    --segments-space-3: 16px;
    --segments-space-4: 20px;
    --segments-space-5: 24px;
    --segments-space-6: 28px;
    --segments-space-7: 36px;
    --segments-control-sm: 40px;
    --segments-control-md: 48px;
    position: relative;
    min-height: 100vh;
    background:
      radial-gradient(circle at 8% 10%, rgba(219, 234, 254, 0.8), transparent 26%),
      radial-gradient(circle at 88% 14%, rgba(226, 232, 240, 0.74), transparent 22%),
      linear-gradient(180deg, #f6f9fd 0%, #edf3f9 100%);
    color: var(--segments-text-strong);
    overflow-x: hidden;
    overflow-y: auto;
  }

  .segments-screen::before,
  .segments-screen::after {
    content: "";
    position: fixed;
    pointer-events: none;
    z-index: 0;
    opacity: 0.8;
  }

  .segments-screen::before {
    inset: -12vh auto auto -8vw;
    width: 30vw;
    height: 30vw;
    min-width: 320px;
    min-height: 320px;
    border-radius: 999px;
    background:
      radial-gradient(circle, rgba(191, 219, 254, 0.46) 0%, rgba(191, 219, 254, 0.12) 40%, rgba(191, 219, 254, 0) 74%);
    filter: blur(12px);
  }

  .segments-screen::after {
    top: auto;
    bottom: -10vh;
    right: -6vw;
    width: 24vw;
    height: 24vw;
    min-width: 260px;
    min-height: 260px;
    border-radius: 999px;
    background:
      radial-gradient(circle, rgba(226, 232, 240, 0.8) 0%, rgba(226, 232, 240, 0.16) 50%, rgba(226, 232, 240, 0) 76%);
    border: none;
    transform: none;
    backdrop-filter: blur(8px);
  }

  .segments-screen__layout {
    min-height: 100vh;
    display: grid;
    grid-template-columns: var(--segments-rail-width, 96px) minmax(0, 1fr);
    transition: grid-template-columns 0.24s ease;
  }

  .segments-screen__rail {
    padding: var(--segments-space-4) var(--segments-space-3);
    border-right: 1px solid var(--segments-line);
    background: rgba(255, 255, 255, 0.84);
    backdrop-filter: blur(18px);
    position: relative;
    z-index: 1;
    transition: padding 0.24s ease, background-color 0.24s ease;
  }

  .segments-screen__rail.is-expanded {
    padding-left: 14px;
    padding-right: 14px;
  }

  .segments-screen__railInner {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--segments-space-4);
    transition: align-items 0.24s ease, gap 0.24s ease;
  }

  .segments-screen__railInner.is-expanded {
    align-items: stretch;
    gap: 18px;
  }

  .segments-screen__brand {
    width: 100%;
    display: flex;
    justify-content: center;
    transition: justify-content 0.24s ease;
  }

  .segments-screen__brand.is-expanded {
    justify-content: flex-start;
  }

  .segments-screen__identity {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .segments-screen__identity.is-compact {
    width: 100%;
    flex-direction: column;
    gap: 10px;
  }

  .segments-screen__identity.is-hero {
    flex-direction: column;
    gap: 28px;
  }

  .segments-screen__identityMark {
    position: relative;
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    overflow: hidden;
    border-radius: 14px;
    border: 1px solid #bfdbfe;
    background: linear-gradient(180deg, rgba(239, 246, 255, 0.98) 0%, rgba(219, 234, 254, 0.98) 100%);
    color: #2563eb;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);
  }

  .segments-screen__identityMark::after {
    content: "";
    position: absolute;
    inset: -20%;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0) 34%, rgba(255, 255, 255, 0.72) 50%, rgba(255, 255, 255, 0) 66%);
    transform: translateX(-140%) rotate(10deg);
    opacity: 0;
    pointer-events: none;
  }

  .segments-screen__identityArc,
  .segments-screen__identityStem,
  .segments-screen__identityDot {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .segments-screen__identityArc {
    top: 8px;
    width: 18px;
    height: 9px;
    border: 2px solid currentColor;
    border-bottom: none;
    border-radius: 999px 999px 0 0;
  }

  .segments-screen__identityStem {
    top: 12px;
    width: 2px;
    height: 16px;
    background: currentColor;
    border-radius: 999px;
  }

  .segments-screen__identityDot {
    bottom: 8px;
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: currentColor;
    box-shadow: 10px 0 0 rgba(37, 99, 235, 0.28);
  }

  .segments-screen__identityText {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .segments-screen__identity.is-hero .segments-screen__identityText {
    align-items: center;
    text-align: center;
    gap: 8px;
  }

  .segments-screen__identityName {
    margin: 0;
    font-size: 22px;
    line-height: 1;
    font-weight: 600;
    letter-spacing: -0.04em;
    color: #0f172a;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  }

  .segments-screen__identityMeta {
    margin: 0;
    font-size: 10px;
    line-height: 14px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #64748b;
    font-family: "JetBrains Mono", monospace;
  }

  .segments-screen__identity.is-hero .segments-screen__identityMark {
    width: 96px;
    height: 96px;
    flex-basis: 96px;
    border-radius: 28px;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.92),
      0 22px 48px rgba(37, 99, 235, 0.18);
  }

  .segments-screen__identity.is-hero .segments-screen__identityMark::after {
    opacity: 0.7;
    animation: segments-mark-sweep 1.8s 0.28s ease both;
  }

  .segments-screen__identity.is-hero .segments-screen__identityArc {
    top: 19px;
    width: 40px;
    height: 20px;
    border-width: 3px;
  }

  .segments-screen__identity.is-hero .segments-screen__identityStem {
    top: 28px;
    width: 3px;
    height: 34px;
  }

  .segments-screen__identity.is-hero .segments-screen__identityDot {
    bottom: 17px;
    width: 10px;
    height: 10px;
    box-shadow: 18px 0 0 rgba(37, 99, 235, 0.24);
  }

  .segments-screen__identity.is-hero .segments-screen__identityName {
    font-size: clamp(64px, 9vw, 116px);
    color: #0f172a;
  }

  .segments-screen__identity.is-hero .segments-screen__identityMeta {
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.34em;
    color: #64748b;
  }

  .segments-screen__brand .segments-screen__identity {
    align-items: center;
  }

  .segments-screen__brand .segments-screen__identityMark {
    width: 48px;
    height: 48px;
    flex-basis: 48px;
    border-color: #bfdbfe;
    background: linear-gradient(180deg, rgba(239, 246, 255, 0.98) 0%, rgba(219, 234, 254, 0.98) 100%);
    color: #2563eb;
    box-shadow: 0 14px 30px rgba(37, 99, 235, 0.12);
  }

  .segments-screen__brand .segments-screen__identityDot {
    box-shadow: 10px 0 0 rgba(37, 99, 235, 0.24);
  }

  .segments-screen__brand .segments-screen__identityName {
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #475569;
    font-family: "JetBrains Mono", monospace;
  }

  .segments-screen__brand .segments-screen__identityMeta {
    display: none;
  }

  .segments-screen__railStack {
    display: flex;
    flex-direction: column;
    gap: var(--segments-space-2);
    width: 100%;
    align-items: center;
    transition: align-items 0.24s ease;
  }

  .segments-screen__railStack.is-expanded {
    align-items: stretch;
  }

  .segments-screen__railButton {
    width: 64px;
    min-height: 64px;
    border: none;
    border-radius: var(--segments-radius-md);
    background: transparent;
    color: #64748b;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 11px;
    line-height: 14px;
    font-weight: 700;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease, width 0.24s ease, padding 0.24s ease;
  }

  .segments-screen__railButton.is-expanded {
    width: 100%;
    min-height: 46px;
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
    padding: 0 14px;
    font-size: 13px;
  }

  .segments-screen__railButtonLabel {
    display: none;
  }

  .segments-screen__railButton.is-expanded .segments-screen__railButtonLabel {
    display: inline;
  }

  .segments-screen__railButton.is-active {
    background: linear-gradient(180deg, rgba(239, 246, 255, 0.98) 0%, rgba(219, 234, 254, 0.96) 100%);
    color: #1d4ed8;
    box-shadow: inset 0 0 0 1px rgba(191, 219, 254, 0.9), 0 14px 28px rgba(37, 99, 235, 0.14);
  }

  .segments-screen__railFooter {
    margin-top: auto;
    width: 42px;
    height: 42px;
    border-radius: var(--segments-radius-sm);
    background: #ffffff;
    color: #475569;
    border: 1px solid #dbe5f0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
  }

  .segments-screen__main {
    min-width: 0;
    padding: var(--segments-space-5);
    position: relative;
    z-index: 1;
  }

  .segments-screen__mainInner {
    max-width: var(--segments-max-width);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--segments-space-5);
  }

  .segments-screen__libraryShell {
    padding: 0;
    border-radius: 26px;
    border: 1px solid #cbd5e1;
    overflow: hidden;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 251, 255, 0.98) 100%);
    box-shadow: var(--segments-shadow-soft);
    backdrop-filter: blur(22px);
  }

  .segments-screen__libraryHeader {
    display: flex;
    flex-direction: column;
    gap: var(--segments-space-4);
    padding: 26px 28px 22px;
    border-bottom: 1px solid #e2e8f0;
    background: rgba(255, 255, 255, 0.78);
    backdrop-filter: blur(14px);
  }

  .segments-screen__libraryTop {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--segments-space-4);
    flex-wrap: wrap;
  }

  .segments-screen__libraryBrandRow {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  }

  .segments-screen__libraryBrandRow .segments-screen__identity {
    align-items: center;
  }

  .segments-screen__librarySummary {
    display: flex;
    align-items: stretch;
    gap: 12px;
    flex-wrap: wrap;
  }

  .segments-screen__libraryStat {
    min-width: 130px;
    padding: 14px 16px;
    border-radius: 18px;
    border: 1px solid #dbe5f0;
    background: rgba(248, 251, 255, 0.92);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .segments-screen__libraryStatValue {
    margin: 0;
    font-size: 22px;
    line-height: 1;
    font-weight: 600;
    color: #0f172a;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  }

  .segments-screen__libraryStatLabel {
    margin: 0;
    font-size: 10px;
    line-height: 14px;
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: #64748b;
    font-family: "JetBrains Mono", monospace;
  }

  .segments-screen__eyebrow {
    margin: 0;
    font-size: 12px;
    line-height: 16px;
    font-weight: 800;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
  }

  .segments-screen__libraryLead {
    margin: var(--segments-space-1) 0 0;
    font-size: clamp(34px, 3.4vw, 48px);
    line-height: 0.98;
    font-weight: 600;
    letter-spacing: -0.04em;
    color: #0f172a;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  }

  .segments-screen__librarySubtext {
    margin: var(--segments-space-1) 0 0;
    max-width: 700px;
    font-size: 15px;
    line-height: 1.75;
    color: #64748b;
  }

  .segments-screen__toolbar {
    display: flex;
    align-items: center;
    gap: var(--segments-space-2);
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .segments-screen__toolbar--filters {
    margin-bottom: 0;
  }

  .segments-screen__toggle {
    display: inline-flex;
    align-items: center;
    gap: var(--segments-space-1);
    padding: 6px;
    border-radius: 20px;
    border: 1px solid var(--segments-line);
    background: rgba(255, 255, 255, 0.86);
    backdrop-filter: blur(14px);
  }

  .segments-screen__toggleButton,
  .segments-screen__filter {
    border: 1px solid transparent;
    border-radius: var(--segments-radius-sm);
    background: transparent;
    color: #64748b;
    min-height: var(--segments-control-sm);
    padding: 0 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
  }

  .segments-screen__toggleButton.is-active,
  .segments-screen__filter.is-active {
    background: #ffffff;
    color: #0f172a;
    border-color: #bfdbfe;
    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.12);
  }

  .segments-screen__filter {
    background: rgba(255, 255, 255, 0.62);
    border-color: #dbe5f0;
    backdrop-filter: blur(12px);
  }

  .segments-screen__search {
    min-width: 280px;
    flex: 0 1 320px;
    height: var(--segments-control-md);
    padding: 0 16px;
    border-radius: var(--segments-radius-sm);
    border: 1px solid #dbe5f0;
    background: rgba(255, 255, 255, 0.92);
    display: flex;
    align-items: center;
    gap: 10px;
    backdrop-filter: blur(14px);
  }

  .segments-screen__searchInput {
    width: 100%;
    border: none;
    background: transparent;
    outline: none;
    color: #0f172a;
    font: inherit;
    font-size: 14px;
  }

  .segments-screen__searchInput::placeholder {
    color: #94a3b8;
  }

  .segments-screen__tableWrap {
    margin: 20px 22px 22px;
    border-radius: 22px;
    border: 1px solid #dbe5f0;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.92);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.94),
      0 14px 34px rgba(15, 23, 42, 0.04);
    backdrop-filter: blur(16px);
  }

  .segments-screen__table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .segments-screen__table th {
    padding: var(--segments-space-3) 20px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
    background: #f8fbff;
    font-size: 11px;
    line-height: 14px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #64748b;
    white-space: nowrap;
  }

  .segments-screen__table td {
    padding: 20px;
    border-bottom: 1px solid #edf2f7;
    vertical-align: top;
    font-size: 14px;
    line-height: 1.65;
    color: #475569;
  }

  .segments-screen__table tr:last-child td {
    border-bottom: none;
  }

  .segments-screen__table tbody tr {
    transition: background-color 0.18s ease;
  }

  .segments-screen__table tbody tr:hover {
    background: rgba(239, 246, 255, 0.56);
  }

  .segments-screen__table strong {
    color: #0f172a;
  }

  .segments-screen__pill {
    min-height: 30px;
    padding: 0 12px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.01em;
  }

  .segments-screen__pill.is-blue {
    background: linear-gradient(180deg, #e0f2fe 0%, #dbeafe 100%);
    color: #1d4ed8;
  }

  .segments-screen__pill.is-amber {
    background: linear-gradient(180deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
  }

  .segments-screen__pill.is-slate {
    background: linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%);
    color: #334155;
  }

  .segments-screen__rowAction {
    border: none;
    border-radius: var(--segments-radius-sm);
    background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
    color: #1d4ed8;
    min-height: var(--segments-control-sm);
    padding: 0 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  }

  .segments-screen__rowAction:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 16px rgba(37, 99, 235, 0.14);
  }

  .segments-screen__focusOverlay {
    position: fixed;
    inset: 0;
    background:
      radial-gradient(circle at top left, rgba(219, 234, 254, 0.5) 0%, transparent 28%),
      linear-gradient(180deg, rgba(241, 245, 249, 0.94) 0%, rgba(226, 232, 240, 0.94) 100%);
    backdrop-filter: blur(18px) saturate(1.02);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    overflow: auto;
    z-index: 20;
  }

  .segments-screen__focusOverlay.is-intro-active {
    overflow: hidden;
  }

  .segments-screen__focusOverlay::before,
  .segments-screen__focusOverlay::after {
    content: "";
    position: absolute;
    pointer-events: none;
    filter: blur(2px);
    opacity: 0.92;
  }

  .segments-screen__focusOverlay::before {
    width: 34vw;
    height: 34vw;
    min-width: 320px;
    min-height: 320px;
    left: -10vw;
    top: -14vh;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(191, 219, 254, 0.54) 0%, rgba(191, 219, 254, 0.12) 42%, rgba(191, 219, 254, 0) 72%);
  }

  .segments-screen__focusOverlay::after {
    width: 24vw;
    height: 24vw;
    min-width: 240px;
    min-height: 240px;
    right: -6vw;
    bottom: -6vh;
    border-radius: 999px;
    background:
      radial-gradient(circle, rgba(226, 232, 240, 0.84) 0%, rgba(226, 232, 240, 0.2) 50%, rgba(226, 232, 240, 0) 74%);
  }

  .segments-screen__focusStage {
    position: relative;
    width: min(1398px, calc(100vw - 48px));
    display: flex;
    flex-direction: column;
    margin: auto;
    border-radius: 26px;
    overflow: hidden;
    border: 1px solid rgba(203, 213, 225, 0.92);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 250, 252, 0.98) 100%);
    box-shadow:
      0 30px 90px rgba(15, 23, 42, 0.12),
      0 8px 24px rgba(15, 23, 42, 0.06);
    transition: opacity 0.72s ease, transform 0.72s ease, filter 0.72s ease;
  }

  .segments-screen__focusStage.is-muted {
    opacity: 0;
    transform: translateY(24px) scale(0.985);
    filter: blur(10px);
  }

  .segments-screen__focusStage.is-ready {
    opacity: 1;
    transform: none;
    filter: none;
  }

  .segments-screen__focusIntro {
    position: absolute;
    inset: 0;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    pointer-events: none;
    background:
      radial-gradient(circle at center, rgba(255, 255, 255, 0.82) 0%, rgba(241, 245, 249, 0.48) 34%, rgba(241, 245, 249, 0) 72%);
    transition: opacity 0.72s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .segments-screen__focusIntro.is-outro {
    opacity: 0;
    transform: scale(1.04);
  }

  .segments-screen__focusIntroCore {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    animation: segments-intro-rise 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .segments-screen__focusHeader {
    position: relative;
    display: flex;
    align-items: center;
    gap: 24px;
    min-height: 82px;
    padding: 0 22px;
    color: #0f172a;
    border-bottom: 1px solid rgba(219, 228, 239, 0.92);
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(14px);
  }

  .segments-screen__focusBrand {
    min-width: 260px;
  }

  .segments-screen__focusActions {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .segments-screen__focusKicker {
    margin: 0;
    max-width: 34%;
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: #64748b;
    font-family: "JetBrains Mono", monospace;
  }

  .segments-screen__focusTitle {
    margin: 0;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 22px;
    line-height: 24px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #0f172a;
    font-family: "Inter", sans-serif;
    text-align: center;
    white-space: nowrap;
  }

  .segments-screen__focusLead {
    display: none;
  }

  .segments-screen__focusUtility {
    border: none;
    background: transparent;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #0f172a;
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    font-family: "JetBrains Mono", monospace;
    cursor: pointer;
  }

  .segments-screen__focusReplay {
    min-height: 34px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid #cbd5e1;
    background: rgba(255, 255, 255, 0.82);
    color: #475569;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    line-height: 14px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-family: "JetBrains Mono", monospace;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  }

  .segments-screen__focusReplay:hover {
    background: #ffffff;
    border-color: #93c5fd;
    color: #1d4ed8;
  }

  .segments-screen__focusDeck {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0;
    align-items: stretch;
    background: #f8fbff;
  }

  .segments-screen__focusDeck.is-settled .segments-screen__projectCard {
    opacity: 0;
    transform: translateY(18px);
    animation: segments-card-settle 0.72s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .segments-screen__focusDeck.is-settled .segments-screen__projectCard:nth-child(1) {
    animation-delay: 0.08s;
  }

  .segments-screen__focusDeck.is-settled .segments-screen__projectCard:nth-child(2) {
    animation-delay: 0.14s;
  }

  .segments-screen__focusDeck.is-settled .segments-screen__projectCard:nth-child(3) {
    animation-delay: 0.2s;
  }

  .segments-screen__focusDeck.is-settled .segments-screen__projectCard:nth-child(4) {
    animation-delay: 0.26s;
  }

  .segments-screen__projectCard {
    --segments-project-height: 484px;
    position: relative;
    overflow: hidden;
    min-height: var(--segments-project-height);
    padding: 0;
    border: none;
    border-left: 1px solid rgba(219, 228, 239, 0.92);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(246, 249, 253, 0.96) 100%);
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    transition: transform 0.24s ease, box-shadow 0.24s ease, background 0.24s ease;
  }

  .segments-screen__projectCard:first-child {
    border-left: none;
  }

  .segments-screen__projectCard::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0)),
      radial-gradient(circle at top left, rgba(191, 219, 254, 0.2), transparent 36%);
    pointer-events: none;
    opacity: 0.7;
  }

  .segments-screen__projectCard::after {
    content: none;
  }

  .segments-screen__projectCard:hover {
    transform: translateY(-2px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.78),
      0 14px 32px rgba(15, 23, 42, 0.08);
  }

  .segments-screen__projectCard--study {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.68) 0%, rgba(246, 249, 253, 0.98) 100%);
  }

  .segments-screen__projectCard--review {
    background: linear-gradient(180deg, rgba(254, 255, 255, 0.68) 0%, rgba(244, 247, 251, 0.98) 100%);
  }

  .segments-screen__projectCard--start {
    background: linear-gradient(180deg, rgba(250, 252, 255, 0.74) 0%, rgba(240, 245, 251, 0.98) 100%);
  }

  .segments-screen__projectCard--create {
    background: linear-gradient(180deg, rgba(239, 244, 250, 0.96) 0%, rgba(229, 236, 244, 0.98) 100%);
  }

  .segments-screen__projectShell,
  .segments-screen__projectMeta,
  .segments-screen__projectHero,
  .segments-screen__projectDividerLane,
  .segments-screen__projectDetails,
  .segments-screen__projectDetailCell,
  .segments-screen__projectCreateBody,
  .segments-screen__projectCreateTitle {
    position: relative;
    z-index: 1;
  }

  .segments-screen__projectShell {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows:
      52px
      1fr
      34px
      auto;
    padding: 40px 24px 36px;
  }

  .segments-screen__projectMeta {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .segments-screen__projectMetaValue {
    padding-top: 4px;
    font-size: 10px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #64748b;
    font-family: "JetBrains Mono", monospace;
  }

  .segments-screen__projectHero {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 0;
    text-align: left;
  }

  .segments-screen__projectHero--recent {
    padding-top: 10px;
  }

  .segments-screen__projectDividerLane {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .segments-screen__projectDetails {
    display: grid;
    align-items: start;
    width: 100%;
    padding-top: 8px;
  }

  .segments-screen__projectDetails--recent {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 22px;
  }

  .segments-screen__projectDetailCell {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    text-align: left;
  }

  .segments-screen__projectTitle {
    margin: 0;
    max-width: 5ch;
    font-size: clamp(54px, 4vw, 68px);
    line-height: 0.88;
    font-weight: 600;
    letter-spacing: -0.04em;
    color: #0f172a;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  }

  .segments-screen__projectCard--create .segments-screen__projectTitle {
    display: none;
  }

  .segments-screen__projectTitleRule {
    width: 62px;
    height: 1px;
    background: #b8c5d6;
  }

  .segments-screen__projectLanguage {
    min-height: 30px;
    min-width: 40px;
    padding: 0 10px;
    border-radius: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #cdd8e5;
    background: rgba(255, 255, 255, 0.74);
    color: #475569;
    font-size: 11px;
    line-height: 14px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    box-shadow: none;
    font-family: "JetBrains Mono", monospace;
  }

  .segments-screen__projectBranchLabel {
    margin: 0;
    font-size: 11px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #7b8da6;
    font-family: "JetBrains Mono", monospace;
  }

  .segments-screen__projectBranchTitle {
    margin: 0;
    font-size: 22px;
    line-height: 1.16;
    font-weight: 500;
    color: #0f172a;
    font-family: "Inter", sans-serif;
  }

  .segments-screen__projectTime {
    margin: 0;
    font-size: 22px;
    line-height: 1.1;
    color: #1e293b;
    font-family: "JetBrains Mono", monospace;
    letter-spacing: 0.06em;
  }

  .segments-screen__projectNote {
    margin: 0;
    max-width: 25ch;
    font-size: 14px;
    line-height: 1.7;
    color: #64748b;
    text-align: center;
  }

  .segments-screen__projectCard--create .segments-screen__projectNote {
    max-width: 24ch;
    text-align: center;
  }

  .segments-screen__projectCreateBody {
    grid-row: 1 / -1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 28px;
    text-align: center;
  }

  .segments-screen__projectCreatePlus {
    margin: 0;
    font-size: 84px;
    line-height: 1;
    font-weight: 200;
    color: #94a3b8;
    font-family: "Inter", sans-serif;
  }

  .segments-screen__projectCreateTitle {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
    text-align: center;
  }

  .segments-screen__projectCreateLead,
  .segments-screen__projectCreateAccent {
    margin: 0;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    color: #0f172a;
    letter-spacing: -0.04em;
    line-height: 0.94;
  }

  .segments-screen__projectCreateLead {
    font-size: clamp(48px, 3vw, 58px);
    font-weight: 600;
  }

  .segments-screen__projectCreateAccent {
    font-size: clamp(48px, 3vw, 58px);
    font-style: italic;
    font-weight: 600;
  }

  .segments-screen__focusFooter {
    display: none;
  }

  .segments-screen__tableMeta {
    display: inline-flex;
    align-items: center;
    gap: var(--segments-space-1);
    min-height: 20px;
  }

  .segments-screen__libraryShell--workspace {
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(247, 250, 254, 0.98) 100%);
  }

  .segments-screen__workspaceCanvas {
    position: relative;
    padding: 22px;
  }

  .segments-screen__workspaceGrid {
    display: grid;
    grid-template-columns:
      var(--segments-work-nav-width, 290px)
      minmax(0, 1fr)
      var(--segments-work-inspector-width, 320px);
    gap: 18px;
    align-items: start;
  }

  .segments-screen__workspaceRail,
  .segments-screen__workspaceMain,
  .segments-screen__workspaceInspector {
    min-width: 0;
  }

  .segments-screen__workspaceMain {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .segments-screen__workspacePanel {
    border-radius: 22px;
    border: 1px solid #dbe5f0;
    background: rgba(255, 255, 255, 0.94);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.96),
      0 18px 36px rgba(15, 23, 42, 0.05);
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-width: 0;
  }

  .segments-screen__workspacePanel--sticky {
    position: sticky;
    top: 22px;
  }

  .segments-screen__workspacePanelHeader {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .segments-screen__workspacePanelEyebrow {
    margin: 0 0 6px;
    font-size: 10px;
    line-height: 14px;
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: #64748b;
    font-family: "JetBrains Mono", monospace;
  }

  .segments-screen__workspacePanelTitle {
    margin: 0;
    max-width: 34ch;
    font-size: 28px;
    line-height: 1;
    font-weight: 600;
    letter-spacing: -0.04em;
    color: #0f172a;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  }

  .segments-screen__workspacePanelAction,
  .segments-screen__workspacePrimary,
  .segments-screen__workspaceCollapsedButton,
  .segments-screen__workspaceFloatButton,
  .segments-screen__shortcutCard {
    border: 1px solid #dbe5f0;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.92);
    color: #334155;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    padding: 0 14px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, color 0.18s ease;
  }

  .segments-screen__workspacePrimary {
    border-color: #bfdbfe;
    background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
    color: #1d4ed8;
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.12);
  }

  .segments-screen__workspacePanelAction:hover,
  .segments-screen__workspacePrimary:hover,
  .segments-screen__workspaceCollapsedButton:hover,
  .segments-screen__workspaceFloatButton:hover,
  .segments-screen__shortcutCard:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
  }

  .segments-screen__workspaceSection {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .segments-screen__workspaceSectionLabel,
  .segments-screen__fieldLabel,
  .segments-screen__previewLabel {
    margin: 0;
    font-size: 10px;
    line-height: 14px;
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: #64748b;
    font-family: "JetBrains Mono", monospace;
  }

  .segments-screen__batchList,
  .segments-screen__branchTree,
  .segments-screen__segmentList,
  .segments-screen__shortcutList,
  .segments-screen__previewGrid,
  .segments-screen__stepList {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .segments-screen__batchCard,
  .segments-screen__segmentCard,
  .segments-screen__previewCard,
  .segments-screen__inspectorFact {
    border-radius: 18px;
    border: 1px solid #e2e8f0;
    background: rgba(248, 251, 255, 0.92);
    padding: 14px 16px;
  }

  .segments-screen__batchCard {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .segments-screen__batchCard.is-active {
    border-color: #bfdbfe;
    background: linear-gradient(180deg, #f8fbff 0%, #eff6ff 100%);
  }

  .segments-screen__batchTitle,
  .segments-screen__segmentCardTitle {
    margin: 0;
    font-size: 15px;
    line-height: 1.45;
    font-weight: 600;
    color: #0f172a;
  }

  .segments-screen__batchMeta,
  .segments-screen__segmentCardCode,
  .segments-screen__segmentCardMeta,
  .segments-screen__sourceBranch {
    margin: 0;
    font-size: 11px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7b8da6;
    font-family: "JetBrains Mono", monospace;
  }

  .segments-screen__branchButton {
    --segments-branch-indent: calc(var(--segments-branch-depth, 0) * 18px);
    width: 100%;
    padding: 14px 16px 14px calc(16px + var(--segments-branch-indent));
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    background: rgba(248, 251, 255, 0.92);
    color: #475569;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 12px;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.18s ease, background-color 0.18s ease, transform 0.18s ease;
  }

  .segments-screen__branchButton:hover,
  .segments-screen__segmentCard:hover {
    transform: translateY(-1px);
  }

  .segments-screen__branchButton.is-active,
  .segments-screen__segmentCard.is-active {
    border-color: #bfdbfe;
    background: linear-gradient(180deg, #f8fbff 0%, #eff6ff 100%);
    color: #1d4ed8;
  }

  .segments-screen__branchButtonCode {
    font-size: 12px;
    line-height: 16px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-family: "JetBrains Mono", monospace;
  }

  .segments-screen__branchButtonNote {
    min-width: 0;
    font-size: 14px;
    line-height: 1.45;
    font-weight: 600;
  }

  .segments-screen__segmentCard {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    text-align: left;
    cursor: pointer;
  }

  .segments-screen__workspaceCollapsedButton {
    width: 100%;
    min-height: 180px;
    padding: 18px 10px;
    flex-direction: column;
    gap: 10px;
    font-family: "JetBrains Mono", monospace;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #64748b;
  }

  .segments-screen__intakeGrid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 280px;
    gap: 18px;
    align-items: start;
  }

  .segments-screen__field {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
  }

  .segments-screen__field--full {
    grid-column: 1 / -1;
  }

  .segments-screen__fieldInput,
  .segments-screen__fieldTextarea {
    width: 100%;
    border: 1px solid #dbe5f0;
    border-radius: 18px;
    background: rgba(248, 251, 255, 0.92);
    padding: 16px 18px;
    color: #0f172a;
    font: inherit;
    font-size: 15px;
    line-height: 1.65;
    outline: none;
    resize: vertical;
  }

  .segments-screen__fieldTextarea {
    min-height: 190px;
  }

  .segments-screen__fieldTextarea--markers {
    min-height: 260px;
    font-family: "JetBrains Mono", monospace;
    font-size: 13px;
    line-height: 1.8;
  }

  .segments-screen__previewCard {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .segments-screen__previewValue,
  .segments-screen__successTitle,
  .segments-screen__stepTitle {
    margin: 0;
    font-size: 15px;
    line-height: 1.4;
    font-weight: 600;
    color: #0f172a;
  }

  .segments-screen__successBanner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    padding: 16px 18px;
    border-radius: 20px;
    border: 1px solid rgba(191, 219, 254, 0.92);
    background: linear-gradient(180deg, rgba(239, 246, 255, 0.94) 0%, rgba(248, 251, 255, 0.98) 100%);
  }

  .segments-screen__successCopy {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-width: 0;
    color: #1d4ed8;
  }

  .segments-screen__successText,
  .segments-screen__stepText,
  .segments-screen__activeSegmentText {
    margin: 4px 0 0;
    font-size: 14px;
    line-height: 1.7;
    color: #64748b;
  }

  .segments-screen__successActions,
  .segments-screen__workspacePager {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .segments-screen__proposalBanner {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 16px;
    border: 1px solid rgba(191, 219, 254, 0.92);
    background: rgba(239, 246, 255, 0.8);
    color: #1d4ed8;
    font-size: 13px;
    line-height: 1.6;
    font-weight: 600;
  }

  .segments-screen__proposalGrid {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
    gap: 18px;
  }

  .segments-screen__proposalColumn {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  .segments-screen__sourceViewer {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .segments-screen__sourceBlock {
    padding: 16px 18px;
    border-radius: 18px;
    border: 1px solid #e2e8f0;
    background: rgba(248, 251, 255, 0.92);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .segments-screen__sourceText {
    margin: 0;
    font-size: 18px;
    line-height: 1.85;
    color: #0f172a;
    direction: rtl;
    text-align: right;
  }

  .segments-screen__sourceMarker {
    align-self: flex-start;
    min-height: 30px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid rgba(191, 219, 254, 0.92);
    background: rgba(239, 246, 255, 0.84);
    display: inline-flex;
    align-items: center;
    font-size: 11px;
    line-height: 16px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #1d4ed8;
    font-family: "JetBrains Mono", monospace;
  }

  .segments-screen__proposalFooter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .segments-screen__proposalMeta {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .segments-screen__activeSegmentCard {
    border-radius: 20px;
    border: 1px solid #dbe5f0;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 251, 255, 0.98) 100%);
    padding: 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .segments-screen__activeSegmentMeta {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .segments-screen__activeSegmentTitle {
    margin: 0;
    font-size: 30px;
    line-height: 1;
    font-weight: 600;
    letter-spacing: -0.04em;
    color: #0f172a;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  }

  .segments-screen__inspectorFacts {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .segments-screen__inspectorFact {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .segments-screen__inspectorFact span {
    font-size: 11px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7b8da6;
    font-family: "JetBrains Mono", monospace;
  }

  .segments-screen__inspectorFact strong {
    font-size: 14px;
    line-height: 1.6;
    color: #0f172a;
  }

  .segments-screen__stepItem {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    background: rgba(248, 251, 255, 0.92);
  }

  .segments-screen__stepDot {
    width: 10px;
    height: 10px;
    margin-top: 6px;
    border-radius: 999px;
    background: #cbd5e1;
    box-shadow: 0 0 0 4px rgba(226, 232, 240, 0.56);
    flex: 0 0 auto;
  }

  .segments-screen__stepItem.is-complete .segments-screen__stepDot {
    background: #2563eb;
    box-shadow: 0 0 0 4px rgba(191, 219, 254, 0.56);
  }

  .segments-screen__shortcutCard {
    width: 100%;
    justify-content: space-between;
    padding: 0 14px;
  }

  .segments-screen__workspaceFloatButton {
    position: absolute;
    right: 28px;
    bottom: 28px;
    z-index: 2;
    box-shadow: 0 18px 34px rgba(15, 23, 42, 0.12);
  }

  @keyframes segments-intro-rise {
    0% {
      opacity: 0;
      transform: translateY(18px) scale(0.97);
      filter: blur(8px);
    }

    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }

  @keyframes segments-mark-sweep {
    0% {
      transform: translateX(-140%) rotate(10deg);
    }

    100% {
      transform: translateX(140%) rotate(10deg);
    }
  }

  @keyframes segments-card-settle {
    0% {
      opacity: 0;
      transform: translateY(18px);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .segments-screen__focusStage,
    .segments-screen__focusIntro,
    .segments-screen__focusIntroCore,
    .segments-screen__focusDeck.is-settled .segments-screen__projectCard,
    .segments-screen__identity.is-hero .segments-screen__identityMark::after,
    .segments-screen__projectCard {
      animation: none !important;
      transition: none !important;
      transform: none !important;
      filter: none !important;
      opacity: 1 !important;
    }
  }

  @media (max-width: 1480px) {
    .segments-screen__focusDeck {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .segments-screen__projectCard {
      min-height: 456px;
    }

    .segments-screen__workspaceGrid {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 1100px) {
    .segments-screen__layout {
      grid-template-columns: 1fr;
    }

    .segments-screen__rail {
      border-right: none;
      border-bottom: 1px solid var(--segments-line);
    }

    .segments-screen__railInner {
      height: auto;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .segments-screen__railStack {
      flex-direction: row;
      width: auto;
    }

    .segments-screen__railFooter {
      margin-top: 0;
    }

    .segments-screen__libraryTop {
      flex-direction: column;
      align-items: flex-start;
    }

    .segments-screen__libraryBrandRow {
      flex-direction: column;
      align-items: flex-start;
    }

    .segments-screen__librarySummary {
      width: 100%;
    }

    .segments-screen__libraryStat {
      flex: 1 1 0;
      min-width: 0;
    }

    .segments-screen__focusHeader {
      position: static;
      display: grid;
      grid-template-columns: 1fr;
      align-items: flex-start;
      gap: 12px;
      padding: 20px 22px;
      min-height: auto;
    }

    .segments-screen__focusTitle {
      position: static;
      left: auto;
      transform: none;
      font-size: 18px;
      line-height: 22px;
      white-space: normal;
      text-align: left;
    }

    .segments-screen__focusUtility {
      justify-self: start;
    }

    .segments-screen__focusActions {
      margin-left: 0;
      justify-self: start;
      flex-wrap: wrap;
    }

    .segments-screen__search {
      width: 100%;
      min-width: 0;
      flex-basis: auto;
    }

    .segments-screen__focusOverlay {
      padding: var(--segments-space-4);
    }

    .segments-screen__focusStage {
      width: min(100%, calc(100vw - 32px));
    }

    .segments-screen__intakeGrid,
    .segments-screen__proposalGrid {
      grid-template-columns: 1fr;
    }

    .segments-screen__focusIntro {
      padding: 32px;
    }

    .segments-screen__projectDetails--recent {
      grid-template-columns: 1fr;
      row-gap: 18px;
    }

    .segments-screen__workspaceCanvas {
      padding: 16px;
    }
  }

  @media (max-width: 720px) {
    .segments-screen__libraryShell {
      border-radius: 22px;
    }

    .segments-screen__libraryHeader {
      padding: 22px 20px 18px;
    }

    .segments-screen__librarySummary {
      flex-direction: column;
    }

    .segments-screen__tableWrap {
      margin: 16px;
    }

    .segments-screen__focusDeck {
      grid-template-columns: 1fr;
    }

    .segments-screen__projectCard {
      min-height: 420px;
    }

    .segments-screen__projectShell {
      padding: 32px 22px 28px;
    }

    .segments-screen__projectTitle {
      font-size: clamp(46px, 18vw, 60px);
    }

    .segments-screen__identity.is-hero {
      gap: 22px;
    }

    .segments-screen__identity.is-hero .segments-screen__identityMark {
      width: 78px;
      height: 78px;
      flex-basis: 78px;
      border-radius: 24px;
    }

    .segments-screen__identity.is-hero .segments-screen__identityArc {
      top: 15px;
      width: 32px;
      height: 16px;
    }

    .segments-screen__identity.is-hero .segments-screen__identityStem {
      top: 23px;
      height: 28px;
    }

    .segments-screen__identity.is-hero .segments-screen__identityDot {
      bottom: 14px;
      width: 8px;
      height: 8px;
      box-shadow: 14px 0 0 rgba(37, 99, 235, 0.24);
    }

    .segments-screen__workspacePanel {
      padding: 18px;
    }

    .segments-screen__workspaceFloatButton {
      right: 20px;
      bottom: 20px;
    }
  }
`;

const railItems = [
  { label: 'Home', icon: FolderGit2, screen: 'home' },
  { label: 'Projects', icon: Layers3, screen: 'projects' },
  { label: 'Segmentation', icon: SplitSquareVertical, screen: 'segmentation' },
  { label: 'Study', icon: BookOpen },
];

const focusProjects = [
  {
    id: 'jumuah',
    tone: 'study',
    language: 'AR',
    title: 'Jumuʿah',
    primaryLabel: 'Condition',
    branchLabel: '2.1.1',
    branchTitle: 'Legal Status',
    timeLabel: 'Logged',
    timeSpent: '03:20',
  },
  {
    id: 'purity',
    tone: 'review',
    language: 'AR',
    title: 'Purity',
    primaryLabel: 'Status',
    branchLabel: '1.3',
    branchTitle: 'Ghusl',
    timeLabel: 'Logged',
    timeSpent: '01:45',
  },
  {
    id: 'fasting',
    tone: 'start',
    language: 'AR',
    title: 'Fasting',
    primaryLabel: 'Source',
    branchLabel: 'BTC 03',
    branchTitle: 'Preserved Archive',
    timeLabel: 'Logged',
    timeSpent: '00:52',
  },
  {
    id: 'create',
    tone: 'create',
    title: 'Initiate',
    accentTitle: 'New Protocol',
    note: 'Deploy a pristine environment. Import initial parameters upon readiness.',
  },
];

const projectRows = [
  {
    project: 'Jumuʿah Conditions',
    source: 'Book of Prayer / Batch 02',
    branch: '2 → 2.1 → 2.1.1',
    state: 'In study',
    segments: '12 compiled',
    updated: '20 min ago',
    action: 'Open segmentation',
  },
  {
    project: 'Purity Terminology',
    source: 'Purification / Batch 01',
    branch: '1 → 1.3',
    state: 'Awaiting review',
    segments: '7 proposed',
    updated: 'Yesterday',
    action: 'Review markers',
  },
  {
    project: 'Fasting Openings',
    source: 'Fasting / Batch 03',
    branch: '3 → 3.1',
    state: 'Ready for markers',
    segments: 'Source saved',
    updated: '3 days ago',
    action: 'Start markers',
  },
  {
    project: 'Water Classifications',
    source: 'Purity / Batch 04',
    branch: '1 → 1.1',
    state: 'In study',
    segments: '9 compiled',
    updated: '1 week ago',
    action: 'Continue project',
  },
];

const projectFilters = ['All', 'In study', 'Awaiting review', 'Ready for markers'];

const sourceIntakeSeed =
  'فصل: ومن شروط الجمعة الوقت، والموضع، والجماعة. ولا تنعقد إلا في موضع الاستيطان، ولا تصح إلا بجماعةٍ يحصل بهم المقصود من الاجتماع. ثم ينظر فيمن تلزمه الجمعة، وفيمن تصح منه، وفيما يسبقها من الخطبتين، وما يتصل بأحكام النداء والسعي.';

const segmentationBatches = [
  {
    id: 'batch-jumuah-02',
    label: 'Batch 02 / Preserved Friday source',
    project: 'Jumuʿah',
    batchCode: '2.1.1',
    size: '3.8k chars',
    updated: '20 min ago',
    unusual: false,
  },
  {
    id: 'batch-purity-01',
    label: 'Batch 01 / Purity terminology',
    project: 'Purity',
    batchCode: '1.3',
    size: '5.1k chars',
    updated: 'Yesterday',
    unusual: true,
  },
  {
    id: 'batch-fasting-03',
    label: 'Batch 03 / Preserved opening source',
    project: 'Fasting',
    batchCode: 'BTC 03',
    size: '2.6k chars',
    updated: '3 days ago',
    unusual: false,
  },
];

const segmentationTree = [
  { id: '2', label: '2', depth: 0, note: 'Opening scope' },
  { id: '2.1', label: '2.1', depth: 1, note: 'Conditions' },
  { id: '2.1.1', label: '2.1.1', depth: 2, note: 'Legal status' },
  { id: '2.1.2', label: '2.1.2', depth: 2, note: 'Attendance' },
  { id: '2.2', label: '2.2', depth: 1, note: 'Call and approach' },
];

const compiledSegments = [
  {
    id: 'seg-2-01',
    branch: '2',
    title: 'Scope of the Friday obligation',
    summary: 'Opening framing before the legal preconditions are listed.',
    status: 'Ready',
  },
  {
    id: 'seg-21-01',
    branch: '2.1',
    title: 'The core conditions',
    summary: 'Introduces time, place, and congregation as the governing conditions.',
    status: 'Ready',
  },
  {
    id: 'seg-211-01',
    branch: '2.1.1',
    title: 'Settlement requirement',
    summary: 'Restricts validity to a place of settled residence.',
    status: 'Open now',
  },
  {
    id: 'seg-211-02',
    branch: '2.1.1',
    title: 'Congregational threshold',
    summary: 'Defines the minimum gathering needed for valid performance.',
    status: 'Next up',
  },
  {
    id: 'seg-212-01',
    branch: '2.1.2',
    title: 'Who the ruling applies to',
    summary: 'Separates those obliged from those for whom it may still count.',
    status: 'Ready',
  },
  {
    id: 'seg-22-01',
    branch: '2.2',
    title: 'Call, khutbah, and approach',
    summary: 'Moves to what precedes the prayer and the response it demands.',
    status: 'Ready',
  },
];

const sourceBlocks = [
  {
    id: 'block-1',
    branch: '2',
    marker: '2 // opening scope',
    text: 'فصل: ومن شروط الجمعة الوقت، والموضع، والجماعة.',
  },
  {
    id: 'block-2',
    branch: '2.1',
    marker: '2.1 // legal prerequisites',
    text: 'ولا تنعقد إلا في موضع الاستيطان، ولا تصح إلا بجماعةٍ يحصل بهم المقصود من الاجتماع.',
  },
  {
    id: 'block-3',
    branch: '2.1.1',
    marker: '2.1.1 // attendance and validity',
    text: 'ثم ينظر فيمن تلزمه الجمعة، وفيمن تصح منه، وما يتصل بحكم الجماعة في ذلك.',
  },
  {
    id: 'block-4',
    branch: '2.1.2',
    marker: '2.1.2 // khutbah sequence',
    text: 'ويذكر بعد ذلك ما يسبقها من الخطبتين، وما يتصل بأحكام النداء والسعي.',
  },
];

const markerDrafts = {
  ai: `2 // Opening scope before any precondition detail
2.1 // Conditions block begins
2.1.1 // Attendance and obligation threshold
2.1.2 // Khutbah sequence and call-to-prayer transition`,
  manual: `2 // Start with the umbrella ruling
2.1 // Split when the conditions begin
2.1.1 // Hold attendance and obligation together
2.1.2 // Break again at the khutbah and call-to-prayer material`,
};

function ArapalBrand({ compact = false, subtitle = '' }) {
  return (
    <div className={`segments-screen__identity${compact ? ' is-compact' : ''}`}>
      <div className="segments-screen__identityMark" aria-hidden="true">
        <span className="segments-screen__identityArc" />
        <span className="segments-screen__identityStem" />
        <span className="segments-screen__identityDot" />
      </div>
      <div className="segments-screen__identityText">
        <p className="segments-screen__identityName">Arapal</p>
        {subtitle ? <p className="segments-screen__identityMeta">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function ArapalHeroBrand({ subtitle = '' }) {
  return (
    <div className="segments-screen__identity is-hero">
      <div className="segments-screen__identityMark" aria-hidden="true">
        <span className="segments-screen__identityArc" />
        <span className="segments-screen__identityStem" />
        <span className="segments-screen__identityDot" />
      </div>
      <div className="segments-screen__identityText">
        <p className="segments-screen__identityName">Arapal</p>
        {subtitle ? <p className="segments-screen__identityMeta">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function FocusProjectCard({ project }) {
  if (project.id === 'create') {
    return (
      <article className={`segments-screen__projectCard segments-screen__projectCard--${project.tone}`}>
        <div className="segments-screen__projectShell">
          <div className="segments-screen__projectCreateBody">
            <p className="segments-screen__projectCreatePlus">+</p>
            <div className="segments-screen__projectCreateTitle">
              <p className="segments-screen__projectCreateLead">{project.title}</p>
              <p className="segments-screen__projectCreateAccent">{project.accentTitle}</p>
            </div>
            <p className="segments-screen__projectNote">{project.note}</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`segments-screen__projectCard segments-screen__projectCard--${project.tone}`}>
      <div className="segments-screen__projectShell">
        <div className="segments-screen__projectMeta">
          <span className="segments-screen__projectLanguage">{project.language}</span>
          <span className="segments-screen__projectMetaValue">{project.branchLabel}</span>
        </div>

        <div className="segments-screen__projectHero segments-screen__projectHero--recent">
          <h2 className="segments-screen__projectTitle">{project.title}</h2>
        </div>

        <div className="segments-screen__projectDividerLane">
          <div className="segments-screen__projectTitleRule" />
        </div>

        <div className="segments-screen__projectDetails segments-screen__projectDetails--recent">
          <div className="segments-screen__projectDetailCell">
            <p className="segments-screen__projectBranchLabel">{project.primaryLabel}</p>
            <p className="segments-screen__projectBranchTitle">{project.branchTitle}</p>
          </div>
          <div className="segments-screen__projectDetailCell">
            <p className="segments-screen__projectBranchLabel">{project.timeLabel}</p>
            <p className="segments-screen__projectTime">{project.timeSpent}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function ScreenToggle({ screen, setScreen }) {
  const items = [
    { id: 'home', label: 'Home', icon: FolderGit2 },
    { id: 'projects', label: 'Projects', icon: Layers3 },
    { id: 'segmentation', label: 'Segmentation', icon: SplitSquareVertical },
  ];

  return (
    <div className="segments-screen__toggle">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            className={`segments-screen__toggleButton${screen === item.id ? ' is-active' : ''}`}
            onClick={() => setScreen(item.id)}
          >
            <Icon size={14} strokeWidth={1.9} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function ProjectsSurface({ screen, setScreen, filter, setFilter, filteredRows, projectStats, onOpenSegmentation }) {
  return (
    <section className="segments-screen__libraryShell">
      <div className="segments-screen__libraryHeader">
        <div className="segments-screen__libraryBrandRow">
          <ArapalBrand subtitle="Projects Overview" />
          <div className="segments-screen__librarySummary">
            {projectStats.map((item) => (
              <div key={item.label} className="segments-screen__libraryStat">
                <p className="segments-screen__libraryStatValue">{item.value}</p>
                <p className="segments-screen__libraryStatLabel">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="segments-screen__libraryTop">
          <div>
            <p className="segments-screen__eyebrow">Projects // Portfolio Index</p>
            <h2 className="segments-screen__libraryLead">Track projects, preserved sources, and study readiness.</h2>
            <p className="segments-screen__librarySubtext">
              Keep orientation across active branches, reopen any batch that needs segmentation work, and move into study without losing the path you were following.
            </p>
          </div>

          <div className="segments-screen__toolbar">
            <ScreenToggle screen={screen} setScreen={setScreen} />

            <div className="segments-screen__search">
              <Search size={16} color="#94a3b8" strokeWidth={1.9} />
              <input
                type="search"
                className="segments-screen__searchInput"
                placeholder="Search project, source, branch, or segment..."
              />
            </div>
          </div>
        </div>

        <div className="segments-screen__toolbar segments-screen__toolbar--filters">
          {projectFilters.map((item) => (
            <button
              key={item}
              type="button"
              className={`segments-screen__filter${filter === item ? ' is-active' : ''}`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="segments-screen__tableWrap">
        <table className="segments-screen__table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Preserved source</th>
              <th>Branch path</th>
              <th>Status</th>
              <th>Study output</th>
              <th>Last activity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={`${row.project}-${row.branch}`}>
                <td>
                  <strong>{row.project}</strong>
                </td>
                <td>{row.source}</td>
                <td>{row.branch}</td>
                <td>
                  <span
                    className={`segments-screen__pill ${
                      row.state === 'In study' ? 'is-blue' : row.state === 'Awaiting review' ? 'is-amber' : 'is-slate'
                    }`}
                  >
                    {row.state}
                  </span>
                </td>
                <td>{row.segments}</td>
                <td>
                  <span className="segments-screen__tableMeta">
                    <Clock3 size={14} strokeWidth={1.9} color="#94a3b8" />
                    {row.updated}
                  </span>
                </td>
                <td>
                  <button type="button" className="segments-screen__rowAction" onClick={() => onOpenSegmentation('browse')}>
                    {row.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SegmentationSurface({
  screen,
  setScreen,
  sourceBatchLabel,
  setSourceBatchLabel,
  sourceDraftText,
  setSourceDraftText,
  sourcePreview,
  sourceSaved,
  onSaveSource,
  segmentationMode,
  onSetSegmentationMode,
  markerDraft,
  setMarkerDraft,
  compileComplete,
  onApproveStructure,
  visibleSourceBlocks,
  segmentationPath,
  setSegmentationPath,
  selectedBranch,
  setSelectedBranch,
  visibleSegments,
  activeSegment,
  activeSegmentIndex,
  onSelectSegment,
  onNextSegment,
  onPreviousSegment,
  navigatorCollapsed,
  setNavigatorCollapsed,
  inspectorCollapsed,
  setInspectorCollapsed,
  segmentationStats,
}) {
  return (
    <section className="segments-screen__libraryShell segments-screen__libraryShell--workspace">
      <div className="segments-screen__libraryHeader">
        <div className="segments-screen__libraryBrandRow">
          <ArapalBrand subtitle="Segmentation Workspace" />
          <div className="segments-screen__librarySummary">
            {segmentationStats.map((item) => (
              <div key={item.label} className="segments-screen__libraryStat">
                <p className="segments-screen__libraryStatValue">{item.value}</p>
                <p className="segments-screen__libraryStatLabel">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="segments-screen__libraryTop">
          <div>
            <p className="segments-screen__eyebrow">Segmentation // Intake, Markers, Compile</p>
            <h2 className="segments-screen__libraryLead">Preserve source, shape branches, and launch study-ready segments.</h2>
            <p className="segments-screen__librarySubtext">
              Source intake stays immutable, proposals only return markers, and branch navigation remains stable so a learner can resume exactly where they left off.
            </p>
          </div>

          <div className="segments-screen__toolbar">
            <ScreenToggle screen={screen} setScreen={setScreen} />
            <button type="button" className="segments-screen__filter" onClick={() => setScreen('home')}>
              Return to Project Home
            </button>
          </div>
        </div>

        <div className="segments-screen__toolbar segments-screen__toolbar--filters">
          <button
            type="button"
            className={`segments-screen__filter${segmentationPath === 'continue' ? ' is-active' : ''}`}
            onClick={() => setSegmentationPath('continue')}
          >
            Continue where I left off
          </button>
          <button
            type="button"
            className={`segments-screen__filter${segmentationPath === 'browse' ? ' is-active' : ''}`}
            onClick={() => setSegmentationPath('browse')}
          >
            Browse the tree
          </button>
          <button
            type="button"
            className={`segments-screen__filter${navigatorCollapsed ? '' : ' is-active'}`}
            onClick={() => setNavigatorCollapsed((current) => !current)}
          >
            {navigatorCollapsed ? 'Show navigator' : 'Collapse navigator'}
          </button>
          <button
            type="button"
            className={`segments-screen__filter${inspectorCollapsed ? '' : ' is-active'}`}
            onClick={() => setInspectorCollapsed((current) => !current)}
          >
            {inspectorCollapsed ? 'Show inspector' : 'Float inspector'}
          </button>
        </div>
      </div>

      <div className="segments-screen__workspaceCanvas">
        <div
          className="segments-screen__workspaceGrid"
          style={{
            '--segments-work-nav-width': navigatorCollapsed ? '82px' : '290px',
            '--segments-work-inspector-width': inspectorCollapsed ? '0px' : '320px',
          }}
        >
          <aside className={`segments-screen__workspaceRail${navigatorCollapsed ? ' is-collapsed' : ''}`}>
            {navigatorCollapsed ? (
              <button
                type="button"
                className="segments-screen__workspaceCollapsedButton"
                onClick={() => setNavigatorCollapsed(false)}
              >
                <GitBranch size={18} strokeWidth={1.9} />
                <span>Navigator</span>
              </button>
            ) : (
              <div className="segments-screen__workspacePanel">
                <div className="segments-screen__workspacePanelHeader">
                  <div>
                    <p className="segments-screen__workspacePanelEyebrow">J4 // Orientation</p>
                    <h3 className="segments-screen__workspacePanelTitle">Branch navigator</h3>
                  </div>
                  <button
                    type="button"
                    className="segments-screen__workspacePanelAction"
                    onClick={() => setNavigatorCollapsed(true)}
                  >
                    Collapse
                  </button>
                </div>

                <div className="segments-screen__workspaceSection">
                  <p className="segments-screen__workspaceSectionLabel">Preserved batches</p>
                  <div className="segments-screen__batchList">
                    {segmentationBatches.map((batch, index) => (
                      <div
                        key={batch.id}
                        className={`segments-screen__batchCard${index === 0 ? ' is-active' : ''}`}
                      >
                        <div>
                          <p className="segments-screen__batchTitle">{batch.label}</p>
                          <p className="segments-screen__batchMeta">
                            {batch.project} // {batch.batchCode}
                          </p>
                        </div>
                        <span className={`segments-screen__pill ${batch.unusual ? 'is-amber' : 'is-blue'}`}>
                          {batch.unusual ? 'Large batch' : 'Normal size'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="segments-screen__workspaceSection">
                  <p className="segments-screen__workspaceSectionLabel">Branch tree</p>
                  <div className="segments-screen__branchTree">
                    {segmentationTree.map((branch) => (
                      <button
                        key={branch.id}
                        type="button"
                        className={`segments-screen__branchButton${selectedBranch === branch.id ? ' is-active' : ''}`}
                        style={{ '--segments-branch-depth': branch.depth }}
                        onClick={() => {
                          setSegmentationPath('browse');
                          setSelectedBranch(branch.id);
                        }}
                      >
                        <span className="segments-screen__branchButtonCode">{branch.label}</span>
                        <span className="segments-screen__branchButtonNote">{branch.note}</span>
                        <ChevronRight size={14} strokeWidth={1.9} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="segments-screen__workspaceSection">
                  <p className="segments-screen__workspaceSectionLabel">Visible segments</p>
                  <div className="segments-screen__segmentList">
                    {visibleSegments.map((segment) => (
                      <button
                        key={segment.id}
                        type="button"
                        className={`segments-screen__segmentCard${activeSegment?.id === segment.id ? ' is-active' : ''}`}
                        onClick={() => onSelectSegment(segment.id)}
                      >
                        <div>
                          <p className="segments-screen__segmentCardCode">{segment.branch}</p>
                          <p className="segments-screen__segmentCardTitle">{segment.title}</p>
                        </div>
                        <p className="segments-screen__segmentCardMeta">{segment.status}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </aside>

          <div className="segments-screen__workspaceMain">
            <section className="segments-screen__workspacePanel">
              <div className="segments-screen__workspacePanelHeader">
                <div>
                  <p className="segments-screen__workspacePanelEyebrow">J2 // Source Intake</p>
                  <h3 className="segments-screen__workspacePanelTitle">Preserve the raw source before any processing.</h3>
                </div>
                <button type="button" className="segments-screen__workspacePrimary" onClick={onSaveSource}>
                  Save immutable source
                </button>
              </div>

              <div className="segments-screen__intakeGrid">
                <label className="segments-screen__field">
                  <span className="segments-screen__fieldLabel">Batch label</span>
                  <input
                    className="segments-screen__fieldInput"
                    value={sourceBatchLabel}
                    onChange={(event) => setSourceBatchLabel(event.target.value)}
                  />
                </label>

                <div className="segments-screen__previewGrid">
                  <div className="segments-screen__previewCard">
                    <p className="segments-screen__previewLabel">Preview name</p>
                    <p className="segments-screen__previewValue">{sourcePreview.name}</p>
                  </div>
                  <div className="segments-screen__previewCard">
                    <p className="segments-screen__previewLabel">Size</p>
                    <p className="segments-screen__previewValue">{sourcePreview.size}</p>
                  </div>
                  <div className="segments-screen__previewCard">
                    <p className="segments-screen__previewLabel">Scan</p>
                    <p className="segments-screen__previewValue">{sourcePreview.alert}</p>
                  </div>
                </div>

                <label className="segments-screen__field segments-screen__field--full">
                  <span className="segments-screen__fieldLabel">Raw source</span>
                  <textarea
                    className="segments-screen__fieldTextarea"
                    value={sourceDraftText}
                    onChange={(event) => setSourceDraftText(event.target.value)}
                  />
                </label>
              </div>

              {sourceSaved ? (
                <div className="segments-screen__successBanner">
                  <div className="segments-screen__successCopy">
                    <CheckCircle2 size={18} strokeWidth={1.9} />
                    <div>
                      <p className="segments-screen__successTitle">Immutable source version preserved.</p>
                      <p className="segments-screen__successText">
                        The raw batch is now locked as a stable input for marker work and later compile steps.
                      </p>
                    </div>
                  </div>
                  <div className="segments-screen__successActions">
                    <button type="button" className="segments-screen__rowAction" onClick={() => setSegmentationPath('browse')}>
                      Segment now
                    </button>
                    <button type="button" className="segments-screen__filter" onClick={() => setScreen('home')}>
                      Return to Project Home
                    </button>
                  </div>
                </div>
              ) : null}
            </section>

            <section className="segments-screen__workspacePanel">
              <div className="segments-screen__workspacePanelHeader">
                <div>
                  <p className="segments-screen__workspacePanelEyebrow">J3 // Proposal and Approval</p>
                  <h3 className="segments-screen__workspacePanelTitle">Review markers directly against the preserved source.</h3>
                </div>
                <div className="segments-screen__toolbar">
                  <button
                    type="button"
                    className={`segments-screen__filter${segmentationMode === 'ai' ? ' is-active' : ''}`}
                    onClick={() => onSetSegmentationMode('ai')}
                  >
                    <Sparkles size={14} strokeWidth={1.9} />
                    AI proposal
                  </button>
                  <button
                    type="button"
                    className={`segments-screen__filter${segmentationMode === 'manual' ? ' is-active' : ''}`}
                    onClick={() => onSetSegmentationMode('manual')}
                  >
                    <FileText size={14} strokeWidth={1.9} />
                    Manual start
                  </button>
                </div>
              </div>

              <div className="segments-screen__proposalBanner">
                <Sparkles size={16} strokeWidth={1.9} />
                {segmentationMode === 'ai'
                  ? 'AI returns markers only. The preserved source remains untouched while you refine the cut points.'
                  : 'Manual mode starts from an empty proposal style. You still approve markers before compile.'}
              </div>

              <div className="segments-screen__proposalGrid">
                <div className="segments-screen__proposalColumn">
                  <p className="segments-screen__workspaceSectionLabel">Preserved source</p>
                  <div className="segments-screen__sourceViewer">
                    {visibleSourceBlocks.map((block) => (
                      <div key={block.id} className="segments-screen__sourceBlock">
                        <p className="segments-screen__sourceBranch">{block.branch}</p>
                        <p className="segments-screen__sourceText">{block.text}</p>
                        <div className="segments-screen__sourceMarker">{block.marker}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="segments-screen__proposalColumn">
                  <p className="segments-screen__workspaceSectionLabel">Markers only</p>
                  <textarea
                    className="segments-screen__fieldTextarea segments-screen__fieldTextarea--markers"
                    value={markerDraft}
                    onChange={(event) => setMarkerDraft(event.target.value)}
                  />

                  <div className="segments-screen__proposalFooter">
                    <div className="segments-screen__proposalMeta">
                      <p className="segments-screen__previewLabel">Active branch filter</p>
                      <p className="segments-screen__previewValue">{selectedBranch}</p>
                    </div>

                    <button type="button" className="segments-screen__workspacePrimary" onClick={onApproveStructure}>
                      Approve structure and compile
                    </button>
                  </div>
                </div>
              </div>

              {compileComplete ? (
                <div className="segments-screen__successBanner">
                  <div className="segments-screen__successCopy">
                    <CheckCircle2 size={18} strokeWidth={1.9} />
                    <div>
                      <p className="segments-screen__successTitle">Study-ready segments compiled deterministically.</p>
                      <p className="segments-screen__successText">
                        {visibleSegments.length} visible segments are ready inside branch {selectedBranch}, and the compile path remains traceable to the preserved source.
                      </p>
                    </div>
                  </div>
                  <div className="segments-screen__successActions">
                    <button type="button" className="segments-screen__rowAction" onClick={() => setScreen('home')}>
                      Start studying
                    </button>
                    <button type="button" className="segments-screen__filter" onClick={() => setScreen('home')}>
                      Return to Home
                    </button>
                  </div>
                </div>
              ) : null}
            </section>

            <section className="segments-screen__workspacePanel">
              <div className="segments-screen__workspacePanelHeader">
                <div>
                  <p className="segments-screen__workspacePanelEyebrow">J4 // Open Segment</p>
                  <h3 className="segments-screen__workspacePanelTitle">Navigation respects the active branch until you change it.</h3>
                </div>
                <div className="segments-screen__workspacePager">
                  <button type="button" className="segments-screen__filter" onClick={onPreviousSegment}>
                    Previous
                  </button>
                  <button type="button" className="segments-screen__filter" onClick={onNextSegment}>
                    Next
                  </button>
                </div>
              </div>

              {activeSegment ? (
                <div className="segments-screen__activeSegmentCard">
                  <div className="segments-screen__activeSegmentMeta">
                    <span className="segments-screen__pill is-blue">{activeSegment.branch}</span>
                    <span className="segments-screen__previewLabel">
                      Segment {String(activeSegmentIndex + 1).padStart(2, '0')} of {String(visibleSegments.length).padStart(2, '0')}
                    </span>
                  </div>
                  <h4 className="segments-screen__activeSegmentTitle">{activeSegment.title}</h4>
                  <p className="segments-screen__activeSegmentText">{activeSegment.summary}</p>
                  <button type="button" className="segments-screen__rowAction">
                    Open segment workspace
                    <ArrowRight size={14} strokeWidth={1.9} />
                  </button>
                </div>
              ) : null}
            </section>
          </div>

          {!inspectorCollapsed ? (
            <aside className="segments-screen__workspaceInspector">
              <div className="segments-screen__workspacePanel segments-screen__workspacePanel--sticky">
                <div className="segments-screen__workspacePanelHeader">
                  <div>
                    <p className="segments-screen__workspacePanelEyebrow">Workflow memory</p>
                    <h3 className="segments-screen__workspacePanelTitle">Pipeline status</h3>
                  </div>
                  <button
                    type="button"
                    className="segments-screen__workspacePanelAction"
                    onClick={() => setInspectorCollapsed(true)}
                  >
                    Float
                  </button>
                </div>

                <div className="segments-screen__workspaceSection">
                  <p className="segments-screen__workspaceSectionLabel">Current batch</p>
                  <div className="segments-screen__inspectorFacts">
                    <div className="segments-screen__inspectorFact">
                      <span>Label</span>
                      <strong>{sourceBatchLabel}</strong>
                    </div>
                    <div className="segments-screen__inspectorFact">
                      <span>Size</span>
                      <strong>{sourcePreview.size}</strong>
                    </div>
                    <div className="segments-screen__inspectorFact">
                      <span>Branch filter</span>
                      <strong>{selectedBranch}</strong>
                    </div>
                  </div>
                </div>

                <div className="segments-screen__workspaceSection">
                  <p className="segments-screen__workspaceSectionLabel">Deterministic path</p>
                  <div className="segments-screen__stepList">
                    {[
                      ['Source intake', sourceSaved ? 'complete' : 'pending'],
                      ['Marker review', markerDraft.trim() ? 'complete' : 'pending'],
                      ['Compile', compileComplete ? 'complete' : 'pending'],
                    ].map(([label, state]) => (
                      <div key={label} className={`segments-screen__stepItem is-${state}`}>
                        <span className="segments-screen__stepDot" />
                        <div>
                          <p className="segments-screen__stepTitle">{label}</p>
                          <p className="segments-screen__stepText">
                            {state === 'complete' ? 'Locked and traceable.' : 'Awaiting confirmation.'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="segments-screen__workspaceSection">
                  <p className="segments-screen__workspaceSectionLabel">Resume shortcuts</p>
                  <div className="segments-screen__shortcutList">
                    <button type="button" className="segments-screen__shortcutCard" onClick={() => setSegmentationPath('continue')}>
                      <span>Continue branch memory</span>
                      <ChevronRight size={14} strokeWidth={1.9} />
                    </button>
                    <button type="button" className="segments-screen__shortcutCard" onClick={() => setSegmentationPath('browse')}>
                      <span>Browse branch tree</span>
                      <ChevronRight size={14} strokeWidth={1.9} />
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          ) : (
            <button
              type="button"
              className="segments-screen__workspaceFloatButton"
              onClick={() => setInspectorCollapsed(false)}
            >
              <Layers3 size={16} strokeWidth={1.9} />
              Show inspector
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default function SegmentsScreen() {
  const [screen, setScreen] = useState('home');
  const [filter, setFilter] = useState('All');
  const [isRailExpanded, setIsRailExpanded] = useState(false);
  const [introPhase, setIntroPhase] = useState('intro');
  const [sourceBatchLabel, setSourceBatchLabel] = useState('Jumuʿah // Batch 02 preserved source');
  const [sourceDraftText, setSourceDraftText] = useState(sourceIntakeSeed);
  const [sourceSaved, setSourceSaved] = useState(false);
  const [segmentationMode, setSegmentationMode] = useState('ai');
  const [markerDraft, setMarkerDraft] = useState(markerDrafts.ai);
  const [segmentationPath, setSegmentationPath] = useState('continue');
  const [selectedBranch, setSelectedBranch] = useState('2.1.1');
  const [activeSegmentId, setActiveSegmentId] = useState('seg-211-01');
  const [navigatorCollapsed, setNavigatorCollapsed] = useState(false);
  const [inspectorCollapsed, setInspectorCollapsed] = useState(false);
  const [compileComplete, setCompileComplete] = useState(false);
  const introTimersRef = useRef({ fade: null, finish: null });

  const clearIntroTimers = useCallback(() => {
    if (introTimersRef.current.fade) {
      window.clearTimeout(introTimersRef.current.fade);
    }

    if (introTimersRef.current.finish) {
      window.clearTimeout(introTimersRef.current.finish);
    }
  }, []);

  const startIntro = useCallback(() => {
    clearIntroTimers();
    setIntroPhase('intro');

    introTimersRef.current.fade = window.setTimeout(() => {
      setIntroPhase('outro');
    }, 1300);

    introTimersRef.current.finish = window.setTimeout(() => {
      setIntroPhase('done');
    }, 2100);
  }, [clearIntroTimers]);

  useEffect(() => {
    startIntro();

    return () => {
      clearIntroTimers();
    };
  }, [clearIntroTimers, startIntro]);

  const filteredRows = useMemo(() => {
    if (filter === 'All') {
      return projectRows;
    }

    return projectRows.filter((row) => row.state === filter);
  }, [filter]);

  const projectStats = useMemo(() => {
    const inStudyCount = projectRows.filter((row) => row.state === 'In study').length;
    const reviewCount = projectRows.filter((row) => row.state === 'Awaiting review').length;

    return [
      { label: 'Visible branches', value: String(filteredRows.length).padStart(2, '0') },
      { label: 'In study', value: String(inStudyCount).padStart(2, '0') },
      { label: 'Review queue', value: String(reviewCount).padStart(2, '0') },
    ];
  }, [filteredRows.length]);

  useEffect(() => {
    setSelectedBranch(segmentationPath === 'continue' ? '2.1.1' : '2');
  }, [segmentationPath]);

  const visibleSegments = useMemo(
    () => compiledSegments.filter((segment) => segment.branch === selectedBranch || segment.branch.startsWith(`${selectedBranch}.`)),
    [selectedBranch],
  );

  const visibleSourceBlocks = useMemo(
    () => sourceBlocks.filter((block) => block.branch === selectedBranch || block.branch.startsWith(`${selectedBranch}.`)),
    [selectedBranch],
  );

  useEffect(() => {
    if (!visibleSegments.length) {
      return;
    }

    const hasActiveSegment = visibleSegments.some((segment) => segment.id === activeSegmentId);
    if (!hasActiveSegment) {
      setActiveSegmentId(visibleSegments[0].id);
    }
  }, [activeSegmentId, visibleSegments]);

  const activeSegment = useMemo(
    () => visibleSegments.find((segment) => segment.id === activeSegmentId) ?? visibleSegments[0] ?? null,
    [activeSegmentId, visibleSegments],
  );

  const activeSegmentIndex = useMemo(
    () => visibleSegments.findIndex((segment) => segment.id === activeSegment?.id),
    [activeSegment, visibleSegments],
  );

  const sourcePreview = useMemo(() => {
    const characterCount = sourceDraftText.trim().length;
    const wordCount = sourceDraftText.trim().split(/\s+/).filter(Boolean).length;
    const isLarge = characterCount > 320;

    return {
      name: sourceBatchLabel || 'Unnamed source batch',
      size: `${wordCount} words / ${characterCount} chars`,
      alert: isLarge ? 'Unusually large' : 'Normal size',
    };
  }, [sourceBatchLabel, sourceDraftText]);

  const segmentationStats = useMemo(
    () => [
      { label: 'Source versions', value: String(segmentationBatches.length).padStart(2, '0') },
      { label: 'Active branch', value: selectedBranch },
      { label: 'Study-ready', value: String(compiledSegments.length).padStart(2, '0') },
    ],
    [selectedBranch],
  );

  const handleOpenSegmentation = useCallback((entryMode = 'continue') => {
    setScreen('segmentation');
    setSegmentationPath(entryMode);
  }, []);

  const handleSaveSource = useCallback(() => {
    setSourceSaved(true);
  }, []);

  const handleSetSegmentationMode = useCallback((mode) => {
    setSegmentationMode(mode);
    setMarkerDraft(markerDrafts[mode]);
    setCompileComplete(false);
  }, []);

  const handleApproveStructure = useCallback(() => {
    setSourceSaved(true);
    setCompileComplete(true);
  }, []);

  const handleNextSegment = useCallback(() => {
    if (activeSegmentIndex < 0 || activeSegmentIndex >= visibleSegments.length - 1) {
      return;
    }

    setActiveSegmentId(visibleSegments[activeSegmentIndex + 1].id);
  }, [activeSegmentIndex, visibleSegments]);

  const handlePreviousSegment = useCallback(() => {
    if (activeSegmentIndex <= 0) {
      return;
    }

    setActiveSegmentId(visibleSegments[activeSegmentIndex - 1].id);
  }, [activeSegmentIndex, visibleSegments]);

  const mainScreen = screen === 'home' ? 'projects' : screen;

  return (
    <>
      <style>{segmentScreenStyles}</style>
      <div className="segments-screen">
        <div
          className="segments-screen__layout"
          style={{ '--segments-rail-width': isRailExpanded ? '224px' : '96px' }}
        >
          <aside
            className={`segments-screen__rail${isRailExpanded ? ' is-expanded' : ''}`}
            onMouseEnter={() => setIsRailExpanded(true)}
            onMouseLeave={() => setIsRailExpanded(false)}
          >
            <div className={`segments-screen__railInner${isRailExpanded ? ' is-expanded' : ''}`}>
              <div className={`segments-screen__brand${isRailExpanded ? ' is-expanded' : ''}`}>
                <ArapalBrand compact={!isRailExpanded} />
              </div>

              <div className={`segments-screen__railStack${isRailExpanded ? ' is-expanded' : ''}`}>
                {railItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.screen ? item.screen === screen : false;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className={`segments-screen__railButton${isActive ? ' is-active' : ''}${isRailExpanded ? ' is-expanded' : ''}`}
                      onClick={() => {
                        if (item.screen) {
                          setScreen(item.screen);
                        }
                      }}
                    >
                      <Icon size={18} strokeWidth={1.9} />
                      <span className="segments-screen__railButtonLabel">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="segments-screen__railFooter">N</div>
            </div>
          </aside>

          <main className="segments-screen__main">
            <div className="segments-screen__mainInner">
              {mainScreen === 'projects' ? (
                <ProjectsSurface
                  screen={screen}
                  setScreen={setScreen}
                  filter={filter}
                  setFilter={setFilter}
                  filteredRows={filteredRows}
                  projectStats={projectStats}
                  onOpenSegmentation={handleOpenSegmentation}
                />
              ) : (
                <SegmentationSurface
                  screen={screen}
                  setScreen={setScreen}
                  sourceBatchLabel={sourceBatchLabel}
                  setSourceBatchLabel={setSourceBatchLabel}
                  sourceDraftText={sourceDraftText}
                  setSourceDraftText={setSourceDraftText}
                  sourcePreview={sourcePreview}
                  sourceSaved={sourceSaved}
                  onSaveSource={handleSaveSource}
                  segmentationMode={segmentationMode}
                  onSetSegmentationMode={handleSetSegmentationMode}
                  markerDraft={markerDraft}
                  setMarkerDraft={setMarkerDraft}
                  compileComplete={compileComplete}
                  onApproveStructure={handleApproveStructure}
                  visibleSourceBlocks={visibleSourceBlocks}
                  segmentationPath={segmentationPath}
                  setSegmentationPath={setSegmentationPath}
                  selectedBranch={selectedBranch}
                  setSelectedBranch={setSelectedBranch}
                  visibleSegments={visibleSegments}
                  activeSegment={activeSegment}
                  activeSegmentIndex={activeSegmentIndex}
                  onSelectSegment={setActiveSegmentId}
                  onNextSegment={handleNextSegment}
                  onPreviousSegment={handlePreviousSegment}
                  navigatorCollapsed={navigatorCollapsed}
                  setNavigatorCollapsed={setNavigatorCollapsed}
                  inspectorCollapsed={inspectorCollapsed}
                  setInspectorCollapsed={setInspectorCollapsed}
                  segmentationStats={segmentationStats}
                />
              )}
            </div>
          </main>
        </div>

        {screen === 'home' ? (
          <div className={`segments-screen__focusOverlay${introPhase !== 'done' ? ' is-intro-active' : ''}`}>
            {introPhase !== 'done' ? (
              <div className={`segments-screen__focusIntro${introPhase === 'outro' ? ' is-outro' : ''}`}>
                <div className="segments-screen__focusIntroCore">
                  <ArapalHeroBrand subtitle="Guided Translation Practice" />
                </div>
              </div>
            ) : null}

            <div className={`segments-screen__focusStage${introPhase === 'intro' ? ' is-muted' : ' is-ready'}`}>
              <div className="segments-screen__focusHeader">
                <div className="segments-screen__focusBrand">
                  <ArapalBrand subtitle="Projects // Path Recovery" />
                </div>
                <h1 className="segments-screen__focusTitle">Pick Up Where You Left Off</h1>
                <div className="segments-screen__focusActions">
                  <button type="button" className="segments-screen__focusReplay" onClick={startIntro}>
                    Replay intro
                  </button>
                  <button type="button" className="segments-screen__focusUtility" onClick={() => setScreen('projects')}>
                    <span>[ Projects ↗ ]</span>
                  </button>
                  <button type="button" className="segments-screen__focusUtility" onClick={() => handleOpenSegmentation('continue')}>
                    <span>[ Segmentation ↗ ]</span>
                  </button>
                </div>
              </div>

              <div className={`segments-screen__focusDeck${introPhase !== 'intro' ? ' is-settled' : ''}`}>
                {focusProjects.map((project) => (
                  <FocusProjectCard key={project.id} project={project} />
                ))}
              </div>

            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
