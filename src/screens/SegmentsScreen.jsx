import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Clock3, FolderGit2, Layers3, Plus, Search, SplitSquareVertical, X } from 'lucide-react';

const segmentScreenStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Playfair+Display:wght@600;700&display=swap');

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
    --segments-text-strong: #231f1a;
    --segments-text-body: #4d4336;
    --segments-text-soft: #786b5a;
    --segments-line: rgba(204, 191, 173, 0.56);
    --segments-glass: rgba(255, 250, 241, 0.58);
    --segments-glass-strong: rgba(255, 251, 245, 0.78);
    --segments-shadow-soft: 0 22px 48px rgba(24, 17, 9, 0.12);
    --segments-shadow-card: 0 30px 60px rgba(20, 15, 10, 0.18);
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
      radial-gradient(circle at 18% 12%, rgba(248, 228, 193, 0.26), transparent 20%),
      radial-gradient(circle at 78% 18%, rgba(203, 210, 228, 0.18), transparent 22%),
      radial-gradient(circle at 50% 84%, rgba(146, 132, 110, 0.18), transparent 26%),
      linear-gradient(180deg, #161514 0%, #23201d 34%, #2a2622 100%);
    color: var(--segments-text-strong);
    overflow: hidden;
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
    inset: auto auto -12vh 28vw;
    width: 34vw;
    height: 34vw;
    min-width: 320px;
    min-height: 320px;
    border-radius: 999px;
    background:
      radial-gradient(circle, rgba(225, 199, 151, 0.22) 0%, rgba(225, 199, 151, 0.08) 38%, rgba(225, 199, 151, 0) 72%);
    filter: blur(12px);
  }

  .segments-screen::after {
    top: 10vh;
    right: -8vw;
    width: 26vw;
    height: 36vw;
    min-width: 260px;
    min-height: 340px;
    border-radius: 36px;
    background:
      linear-gradient(180deg, rgba(255, 249, 240, 0.06) 0%, rgba(214, 198, 174, 0.14) 100%);
    border: 1px solid rgba(255, 246, 232, 0.14);
    transform: rotate(18deg);
    backdrop-filter: blur(8px);
  }

  .segments-screen__layout {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 104px minmax(0, 1fr);
  }

  .segments-screen__rail {
    padding: var(--segments-space-4) var(--segments-space-3);
    border-right: 1px solid var(--segments-line);
    background: linear-gradient(180deg, rgba(34, 30, 26, 0.84) 0%, rgba(30, 27, 24, 0.92) 100%);
    backdrop-filter: blur(18px);
    position: relative;
    z-index: 1;
  }

  .segments-screen__railInner {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--segments-space-4);
  }

  .segments-screen__brand {
    width: 56px;
    height: 56px;
    border-radius: var(--segments-radius-md);
    background: linear-gradient(135deg, #d4b990 0%, #9a7d54 100%);
    color: #fff8ef;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;
    box-shadow: 0 18px 34px rgba(59, 130, 246, 0.22);
  }

  .segments-screen__railStack {
    display: flex;
    flex-direction: column;
    gap: var(--segments-space-2);
    width: 100%;
    align-items: center;
  }

  .segments-screen__railButton {
    width: 64px;
    min-height: 64px;
    border: none;
    border-radius: var(--segments-radius-md);
    background: transparent;
    color: #d7c8b0;
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
  }

  .segments-screen__railButton.is-active {
    background: linear-gradient(180deg, rgba(255, 247, 232, 0.92) 0%, rgba(240, 226, 201, 0.86) 100%);
    color: #493723;
    box-shadow: inset 0 0 0 1px rgba(221, 201, 170, 0.88), 0 14px 28px rgba(21, 15, 10, 0.18);
  }

  .segments-screen__railFooter {
    margin-top: auto;
    width: 42px;
    height: 42px;
    border-radius: var(--segments-radius-sm);
    background: #161311;
    color: #f7ede0;
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
    padding: var(--segments-space-6);
    border-radius: var(--segments-radius-xl);
    border: 1px solid var(--segments-line);
    background:
      radial-gradient(circle at top right, rgba(230, 211, 182, 0.14), transparent 22%),
      linear-gradient(180deg, rgba(255, 251, 245, 0.78) 0%, rgba(248, 242, 233, 0.68) 100%);
    box-shadow: var(--segments-shadow-soft);
    backdrop-filter: blur(22px);
  }

  .segments-screen__libraryTop {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--segments-space-4);
    flex-wrap: wrap;
    margin-bottom: var(--segments-space-4);
  }

  .segments-screen__eyebrow {
    margin: 0;
    font-size: 12px;
    line-height: 16px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #866948;
  }

  .segments-screen__libraryLead {
    margin: var(--segments-space-1) 0 0;
    font-size: 22px;
    line-height: 28px;
    font-weight: 800;
    color: var(--segments-text-strong);
  }

  .segments-screen__librarySubtext {
    margin: var(--segments-space-1) 0 0;
    max-width: 700px;
    font-size: 14px;
    line-height: 1.7;
    color: var(--segments-text-soft);
  }

  .segments-screen__toolbar {
    display: flex;
    align-items: center;
    gap: var(--segments-space-2);
    flex-wrap: wrap;
  }

  .segments-screen__toolbar--filters {
    margin-bottom: var(--segments-space-3);
  }

  .segments-screen__toggle {
    display: inline-flex;
    align-items: center;
    gap: var(--segments-space-1);
    padding: 6px;
    border-radius: 20px;
    border: 1px solid var(--segments-line);
    background: rgba(255, 255, 255, 0.74);
    backdrop-filter: blur(14px);
  }

  .segments-screen__toggleButton,
  .segments-screen__filter {
    border: none;
    border-radius: var(--segments-radius-sm);
    background: transparent;
    color: var(--segments-text-soft);
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
    color: var(--segments-text-strong);
    box-shadow: 0 6px 16px rgba(148, 163, 184, 0.14);
  }

  .segments-screen__search {
    min-width: 280px;
    flex: 0 1 320px;
    height: var(--segments-control-md);
    padding: 0 16px;
    border-radius: var(--segments-radius-sm);
    border: 1px solid var(--segments-line);
    background: rgba(255, 255, 255, 0.82);
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
    color: var(--segments-text-strong);
    font: inherit;
    font-size: 14px;
  }

  .segments-screen__tableWrap {
    border-radius: var(--segments-radius-lg);
    border: 1px solid var(--segments-line);
    overflow: hidden;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(16px);
  }

  .segments-screen__table {
    width: 100%;
    border-collapse: collapse;
  }

  .segments-screen__table th {
    padding: var(--segments-space-3) 18px;
    text-align: left;
    border-bottom: 1px solid rgba(221, 230, 241, 0.92);
    background: rgba(248, 251, 255, 0.92);
    font-size: 11px;
    line-height: 14px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #6b7b92;
    white-space: nowrap;
  }

  .segments-screen__table td {
    padding: 18px;
    border-bottom: 1px solid rgba(241, 245, 249, 0.96);
    vertical-align: top;
    font-size: 14px;
    line-height: 1.65;
    color: var(--segments-text-body);
  }

  .segments-screen__table tr:last-child td {
    border-bottom: none;
  }

  .segments-screen__table strong {
    color: var(--segments-text-strong);
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
    background: linear-gradient(180deg, #f6ecdc 0%, #ecd9bb 100%);
    color: #6a5233;
  }

  .segments-screen__pill.is-amber {
    background: linear-gradient(180deg, #efe3cd 0%, #e6d0aa 100%);
    color: #835728;
  }

  .segments-screen__pill.is-slate {
    background: linear-gradient(180deg, #f7f0e4 0%, #eee2cf 100%);
    color: #655a4c;
  }

  .segments-screen__rowAction {
    border: none;
    border-radius: var(--segments-radius-sm);
    background: linear-gradient(180deg, #f4ead8 0%, #e8d4b5 100%);
    color: #5e4628;
    min-height: var(--segments-control-sm);
    padding: 0 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  .segments-screen__focusOverlay {
    position: fixed;
    inset: 0;
    background:
      radial-gradient(circle at 50% 12%, rgba(214, 221, 240, 0.42), transparent 20%),
      linear-gradient(180deg, rgba(240, 236, 228, 0.78) 0%, rgba(224, 219, 210, 0.86) 100%);
    backdrop-filter: blur(14px) saturate(0.98);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--segments-space-7);
    z-index: 20;
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
    width: 28vw;
    height: 28vw;
    min-width: 320px;
    min-height: 320px;
    left: 6vw;
    bottom: -10vh;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(184, 164, 132, 0.28) 0%, rgba(184, 164, 132, 0.1) 42%, rgba(184, 164, 132, 0) 72%);
  }

  .segments-screen__focusOverlay::after {
    width: 20vw;
    height: 28vw;
    min-width: 220px;
    min-height: 320px;
    right: 4vw;
    top: 8vh;
    border-radius: 28px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(190, 192, 203, 0.14) 100%);
    border: 1px solid rgba(255, 255, 255, 0.22);
    transform: rotate(12deg);
  }

  .segments-screen__focusStage {
    position: relative;
    width: min(var(--segments-max-width), calc(100vw - 120px));
    display: flex;
    flex-direction: column;
    gap: var(--segments-space-6);
    padding: 42px 40px 40px;
    border-radius: 36px;
    border: 1px solid rgba(217, 206, 186, 0.8);
    background:
      linear-gradient(180deg, rgba(252, 248, 242, 0.94) 0%, rgba(239, 232, 221, 0.92) 100%);
    box-shadow:
      inset 0 0 0 1px rgba(255, 252, 246, 0.88),
      0 34px 68px rgba(62, 48, 24, 0.14);
  }

  .segments-screen__focusStage::before {
    content: "";
    position: absolute;
    inset: 16px;
    border-radius: 28px;
    border: 1px solid rgba(209, 194, 169, 0.44);
    pointer-events: none;
  }

  .segments-screen__focusClose {
    position: absolute;
    top: 18px;
    right: 18px;
    width: var(--segments-control-md);
    height: var(--segments-control-md);
    border: 1px solid rgba(205, 191, 165, 0.74);
    border-radius: 16px;
    background: rgba(247, 241, 231, 0.86);
    color: #544734;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    backdrop-filter: blur(12px);
    box-shadow: 0 18px 38px rgba(15, 23, 42, 0.14);
  }

  .segments-screen__focusHeader {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: var(--segments-space-4);
    min-height: 82px;
    color: #2d261d;
  }

  .segments-screen__focusKicker {
    margin: 0;
    font-size: 11px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(112, 94, 70, 0.86);
    font-family: "JetBrains Mono", monospace;
  }

  .segments-screen__focusTitle {
    margin: 0;
    font-size: 13px;
    line-height: 16px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #241d16;
    font-family: "Inter", sans-serif;
    justify-self: center;
  }

  .segments-screen__focusLead {
    display: none;
  }

  .segments-screen__focusUtility {
    justify-self: end;
    border: none;
    background: transparent;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: rgba(84, 69, 51, 0.92);
    font-size: 11px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    font-family: "JetBrains Mono", monospace;
    cursor: pointer;
  }

  .segments-screen__focusDeck {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    align-items: stretch;
    border-top: none;
    border-bottom: none;
  }

  .segments-screen__projectCard {
    position: relative;
    overflow: hidden;
    min-height: 520px;
    padding: 28px 28px 28px;
    border-radius: 28px;
    border: 1px solid rgba(209, 194, 169, 0.68);
    background:
      linear-gradient(180deg, rgba(255, 250, 242, 0.96) 0%, rgba(242, 235, 224, 0.94) 100%);
    box-shadow:
      inset 0 0 0 1px rgba(255, 252, 246, 0.84),
      0 24px 48px rgba(73, 57, 31, 0.12);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 0;
    backdrop-filter: blur(10px) saturate(0.92);
  }

  .segments-screen__projectCard::before {
    content: "";
    position: absolute;
    inset: 14px;
    border-radius: 22px;
    border: 1px solid rgba(208, 192, 167, 0.28);
    pointer-events: none;
  }

  .segments-screen__projectCard::after {
    content: none;
  }

  .segments-screen__projectCard--study {
    background: linear-gradient(180deg, rgba(255, 250, 243, 0.97) 0%, rgba(244, 236, 224, 0.94) 100%);
  }

  .segments-screen__projectCard--review {
    background: linear-gradient(180deg, rgba(255, 248, 239, 0.97) 0%, rgba(243, 234, 220, 0.94) 100%);
  }

  .segments-screen__projectCard--start {
    background: linear-gradient(180deg, rgba(255, 249, 241, 0.97) 0%, rgba(241, 234, 223, 0.94) 100%);
  }

  .segments-screen__projectCard--create {
    position: relative;
    background: linear-gradient(180deg, rgba(245, 239, 229, 0.96) 0%, rgba(234, 226, 213, 0.94) 100%);
    opacity: 0.9;
  }

  .segments-screen__projectCard--create:hover {
    opacity: 1;
  }

  .segments-screen__projectCard--create::after {
    content: "";
    position: absolute;
    left: -7px;
    top: 10%;
    height: 80%;
    width: 1px;
    background: linear-gradient(180deg, rgba(209, 194, 169, 0) 0%, rgba(209, 194, 169, 0.7) 18%, rgba(209, 194, 169, 0.7) 82%, rgba(209, 194, 169, 0) 100%);
    pointer-events: none;
  }

  .segments-screen__projectCard--create .segments-screen__projectTop--studyway {
    justify-content: flex-start;
    gap: var(--segments-space-3);
  }

  .segments-screen__projectCard--create .segments-screen__projectTop {
    position: static;
  }

  .segments-screen__projectTop,
  .segments-screen__projectMiddle,
  .segments-screen__projectBottom {
    position: relative;
    z-index: 1;
  }

  .segments-screen__projectTop {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 18px;
    width: 100%;
    min-height: 156px;
  }

  .segments-screen__projectTop--studyway {
    text-align: left;
  }

  .segments-screen__projectMetaRow {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--segments-space-3);
    min-height: 38px;
  }

  .segments-screen__projectMetaValue {
    font-size: 10px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(123, 103, 74, 0.72);
    font-family: "JetBrains Mono", monospace;
  }

  .segments-screen__projectMiddle {
    width: 100%;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 24px;
    text-align: left;
  }

  .segments-screen__projectMiddle--recent {
    margin-block: auto;
    padding: 18px 0 24px;
  }

  .segments-screen__projectMiddle--create {
    margin-block: auto;
    align-items: center;
    justify-content: center;
    gap: 24px;
    text-align: center;
  }

  .segments-screen__projectBottom {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    gap: 20px;
    width: 100%;
    min-height: 178px;
  }

  .segments-screen__projectBottom--recent {
    min-height: 112px;
    gap: 18px;
  }

  .segments-screen__projectBottom--create {
    min-height: 120px;
    align-items: center;
  }

  .segments-screen__projectGlyphWrap {
    display: none;
  }

  .segments-screen__projectGlyphWrap {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    pointer-events: none;
  }

  .segments-screen__projectTitle {
    margin: 0;
    font-size: clamp(58px, 4vw, 78px);
    line-height: 0.94;
    font-weight: 700;
    letter-spacing: -0.04em;
    color: #2a221a;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  }

  .segments-screen__projectCard--create .segments-screen__projectTitle {
    max-width: 9ch;
    margin-top: 0;
  }

  .segments-screen__projectTitleRule {
    width: 68px;
    height: 1px;
    background: rgba(166, 138, 103, 0.7);
  }

  .segments-screen__projectLanguage {
    min-height: 38px;
    min-width: 44px;
    padding: 0 12px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(177, 156, 124, 0.54);
    background: rgba(255, 250, 243, 0.76);
    color: rgba(95, 77, 52, 0.9);
    font-size: 10px;
    line-height: 14px;
    font-weight: 600;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    box-shadow: none;
    font-family: "JetBrains Mono", monospace;
  }

  .segments-screen__projectFocus {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    align-items: flex-start;
    text-align: left;
  }

  .segments-screen__projectInfoColumn {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }

  .segments-screen__projectBranchLabel {
    margin: 0;
    font-size: 10px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(123, 103, 74, 0.72);
    font-family: "JetBrains Mono", monospace;
  }

  .segments-screen__projectBranchTitle {
    margin: 0;
    font-size: 24px;
    line-height: 1.16;
    font-weight: 600;
    color: #2e261e;
    font-family: "Inter", sans-serif;
  }

  .segments-screen__projectTime {
    margin: 0;
    font-size: 20px;
    line-height: 1.1;
    color: rgba(94, 79, 60, 0.82);
    font-family: "JetBrains Mono", monospace;
    letter-spacing: 0.06em;
  }

  .segments-screen__projectNote {
    margin: 0;
    max-width: 30ch;
    font-size: 13px;
    line-height: 1.7;
    color: rgba(102, 86, 64, 0.82);
    text-align: left;
  }

  .segments-screen__projectCard--create .segments-screen__projectNote {
    max-width: 34ch;
    text-align: center;
  }

  .segments-screen__projectActionRow {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .segments-screen__projectAction {
    border: none;
    background: transparent;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: rgba(84, 69, 51, 0.92);
    font-size: 10px;
    line-height: 14px;
    font-weight: 600;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    font-family: "JetBrains Mono", monospace;
    cursor: pointer;
  }

  .segments-screen__projectGlyph {
    width: 120px;
    height: 120px;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #907450;
  }

  .segments-screen__projectGlyph::before,
  .segments-screen__projectGlyph::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 34px;
    height: 1px;
    background: linear-gradient(90deg, rgba(186, 162, 126, 0) 0%, rgba(186, 162, 126, 0.82) 100%);
  }

  .segments-screen__projectGlyph::before {
    left: 0;
    transform: translateY(-50%);
  }

  .segments-screen__projectGlyph::after {
    right: 0;
    transform: translateY(-50%) scaleX(-1);
  }

  .segments-screen__projectGlyphMark {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    border: 1px solid rgba(186, 162, 126, 0.62);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #8f6f46;
    background: rgba(255, 250, 243, 0.58);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
  }

  .segments-screen__projectGlyphMark--create {
    width: auto;
    height: auto;
    border-radius: 0;
    font-size: 82px;
    font-weight: 200;
    line-height: 1;
    border: none;
    color: rgba(143, 116, 79, 0.9);
    background: transparent;
    box-shadow: none;
  }

  .segments-screen__projectCard--create .segments-screen__projectGlyph::before,
  .segments-screen__projectCard--create .segments-screen__projectGlyph::after {
    content: none;
  }

  .segments-screen__projectCard--create .segments-screen__projectMiddle {
    align-items: center;
    justify-content: center;
    gap: 26px;
    text-align: center;
  }

  .segments-screen__button {
    border: 1px solid rgba(174, 152, 119, 0.62);
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(192, 159, 104, 0.96) 0%, rgba(164, 128, 73, 0.94) 100%);
    color: #fffaf3;
    min-height: 48px;
    padding: 0 20px 0 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow:
      inset 0 1px 0 rgba(255, 246, 227, 0.36),
      0 14px 28px rgba(116, 87, 45, 0.16);
    transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  }

  .segments-screen__button:hover {
    transform: translateY(-1px);
    background: linear-gradient(180deg, rgba(200, 167, 111, 0.98) 0%, rgba(173, 137, 80, 0.96) 100%);
    border-color: rgba(174, 152, 119, 0.76);
    box-shadow:
      inset 0 1px 0 rgba(255, 246, 227, 0.42),
      0 18px 32px rgba(116, 87, 45, 0.2);
  }

  .segments-screen__button--ghost {
    background: rgba(255, 250, 243, 0.72);
    color: rgba(86, 69, 46, 0.92);
    border: 1px solid rgba(203, 187, 160, 0.82);
    box-shadow: none;
    backdrop-filter: blur(10px);
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

  @media (max-width: 1480px) {
    .segments-screen__focusDeck {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .segments-screen__projectCard {
      min-height: 350px;
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

    .segments-screen__search {
      width: 100%;
      min-width: 0;
      flex-basis: auto;
    }

    .segments-screen__focusOverlay {
      padding: var(--segments-space-4);
    }

    .segments-screen__focusStage {
      width: min(100%, calc(100vw - 40px));
    }
  }
`;

const railItems = [
  { label: 'Home', icon: FolderGit2 },
  { label: 'Source', icon: Plus },
  { label: 'Segments', icon: SplitSquareVertical, active: true },
  { label: 'Study', icon: BookOpen },
];

const focusProjects = [
  {
    id: 'jumuah',
    tone: 'study',
    label: 'Continue study',
    language: 'AR',
    title: 'Jumuʿah',
    text: 'Return to the stream you were last inhabiting and reopen the study room exactly where you left it.',
    branchLabel: '2.1.1',
    branchTitle: 'Legal condition',
    timeSpent: '3h 20m studied',
    note: 'The branch filter will already be in place when you reopen the room.',
    cta: 'Open project',
  },
  {
    id: 'purity',
    tone: 'review',
    label: 'Review branch',
    language: 'AR',
    title: 'Purity',
    text: 'Re-enter this project at its current branch and decide whether you want to continue study or inspect the preparation work.',
    branchLabel: '1.3',
    branchTitle: 'Ghusl',
    timeSpent: '1h 45m reviewed',
    note: 'One unpublished branch remains in preparation.',
    cta: 'Open project',
  },
  {
    id: 'fasting',
    tone: 'start',
    label: 'Begin segmentation',
    language: 'AR',
    title: 'Fasting',
    text: 'Resume this stream from its latest state, whether that means study, preparation, or simply finding your bearings again.',
    branchLabel: 'Batch 03',
    branchTitle: 'Preserved source',
    timeSpent: '52m prepared',
    note: 'Segmentation has not yet been approved into study.',
    cta: 'Open project',
  },
  {
    id: 'create',
    tone: 'create',
    label: 'New project',
    title: 'Create New Project',
    text: 'Open a fresh study stream and move straight into source intake without walking through anything else first.',
    note: 'Start with a clean project shell, then bring in the first source batch when you are ready.',
    cta: 'Create project',
  },
];

const detailedRows = [
  {
    project: 'Jumuʿah Conditions',
    source: 'Book of Prayer / Batch 02',
    branch: '2 → 2.1 → 2.1.1',
    state: 'In study',
    segments: '12 compiled',
    updated: '20 min ago',
    action: 'Open study',
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
    action: 'Continue',
  },
];

export default function SegmentsScreen() {
  const [view, setView] = useState('focus');
  const [filter, setFilter] = useState('All');

  const filteredRows = useMemo(() => {
    if (filter === 'All') {
      return detailedRows;
    }

    return detailedRows.filter((row) => row.state === filter);
  }, [filter]);

  return (
    <>
      <style>{segmentScreenStyles}</style>
      <div className="segments-screen">
        <div className="segments-screen__layout">
          <aside className="segments-screen__rail">
            <div className="segments-screen__railInner">
              <div className="segments-screen__brand">A</div>

              <div className="segments-screen__railStack">
                {railItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className={`segments-screen__railButton${item.active ? ' is-active' : ''}`}
                    >
                      <Icon size={18} strokeWidth={1.9} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="segments-screen__railFooter">N</div>
            </div>
          </aside>

          <main className="segments-screen__main">
            <div className="segments-screen__mainInner">
              <section className="segments-screen__libraryShell">
                <div className="segments-screen__libraryTop">
                  <div>
                    <p className="segments-screen__eyebrow">Segment library</p>
                    <h2 className="segments-screen__libraryLead">Browse branches, source batches, and publishing state.</h2>
                    <p className="segments-screen__librarySubtext">
                      This is the full library view. It stays behind the curtain until the user asks for more detail.
                    </p>
                  </div>

                  <div className="segments-screen__toolbar">
                    <div className="segments-screen__toggle">
                      <button
                        type="button"
                        className={`segments-screen__toggleButton${view === 'focus' ? ' is-active' : ''}`}
                        onClick={() => setView('focus')}
                      >
                        <BookOpen size={14} strokeWidth={1.9} />
                        Focus
                      </button>
                      <button
                        type="button"
                        className={`segments-screen__toggleButton${view === 'detailed' ? ' is-active' : ''}`}
                        onClick={() => setView('detailed')}
                      >
                        <Layers3 size={14} strokeWidth={1.9} />
                        Detailed
                      </button>
                    </div>

                    <div className="segments-screen__search">
                      <Search size={16} color="#94a3b8" strokeWidth={1.9} />
                      <input className="segments-screen__searchInput" placeholder="Search project, source, branch, or segment..." />
                    </div>
                  </div>
                </div>

                <div className="segments-screen__toolbar segments-screen__toolbar--filters">
                  {['All', 'In study', 'Awaiting review', 'Ready for markers'].map((item) => (
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

                <div className="segments-screen__tableWrap">
                  <table className="segments-screen__table">
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Source batch</th>
                        <th>Branch</th>
                        <th>State</th>
                        <th>Segments</th>
                        <th>Updated</th>
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
                                row.state === 'In study'
                                  ? 'is-blue'
                                  : row.state === 'Awaiting review'
                                    ? 'is-amber'
                                    : 'is-slate'
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
                            <button type="button" className="segments-screen__rowAction">
                              {row.action}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </main>
        </div>

        {view === 'focus' ? (
          <div className="segments-screen__focusOverlay">
            <div className="segments-screen__focusStage">
              <button type="button" className="segments-screen__focusClose" onClick={() => setView('detailed')}>
                <X size={18} strokeWidth={2} />
              </button>

              <div className="segments-screen__focusHeader">
                <p className="segments-screen__focusKicker">Segments</p>
                <h1 className="segments-screen__focusTitle">Pick up where you left off.</h1>
                <button type="button" className="segments-screen__focusUtility" onClick={() => setView('detailed')}>
                  <span>[ Library ↗ ]</span>
                </button>
              </div>

              <div className="segments-screen__focusDeck">
                {focusProjects.map((project) => (
                  (() => {
                    return (
                      <article
                        key={project.id}
                        className={`segments-screen__projectCard segments-screen__projectCard--${project.tone}`}
                      >
                        {project.id !== 'create' ? (
                          <>
                            <div className="segments-screen__projectTop segments-screen__projectTop--studyway">
                              <div className="segments-screen__projectMetaRow">
                                {project.language ? (
                                  <span className="segments-screen__projectLanguage">{project.language}</span>
                                ) : <span />}
                                <span className="segments-screen__projectMetaValue">{project.branchLabel}</span>
                              </div>
                            </div>

                            <div className="segments-screen__projectMiddle segments-screen__projectMiddle--recent">
                              <h2 className="segments-screen__projectTitle">{project.title}</h2>
                              <div className="segments-screen__projectTitleRule" />
                            </div>

                            <div className="segments-screen__projectBottom segments-screen__projectBottom--recent">
                              <div className="segments-screen__projectFocus">
                                <div className="segments-screen__projectInfoColumn">
                                  <p className="segments-screen__projectBranchLabel">
                                    {project.id === 'jumuah' ? 'Condition' : project.id === 'purity' ? 'Status' : 'Source'}
                                  </p>
                                  <p className="segments-screen__projectBranchTitle">{project.branchTitle}</p>
                                </div>
                                <div className="segments-screen__projectInfoColumn">
                                  <p className="segments-screen__projectBranchLabel">Logged</p>
                                  <p className="segments-screen__projectTime">{project.timeSpent.replace(/ studied| reviewed| prepared/g, '')}</p>
                                </div>
                              </div>

                              <div className="segments-screen__projectActionRow">
                                <button type="button" className="segments-screen__projectAction">
                                  <span>{project.cta}</span>
                                  <ArrowRight size={16} strokeWidth={1.9} />
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="segments-screen__projectTop segments-screen__projectTop--studyway" />

                            <div className="segments-screen__projectMiddle segments-screen__projectMiddle--create">
                              <div className="segments-screen__projectGlyphWrap">
                                <div className="segments-screen__projectGlyph">
                                  <div className="segments-screen__projectGlyphMark segments-screen__projectGlyphMark--create">
                                    +
                                  </div>
                                </div>
                              </div>
                              <h2 className="segments-screen__projectTitle">{project.title}</h2>
                              <p className="segments-screen__projectNote">{project.note}</p>
                            </div>

                            <div className="segments-screen__projectBottom segments-screen__projectBottom--create" />
                          </>
                        )}
                      </article>
                    );
                  })()
                ))}
              </div>

            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
