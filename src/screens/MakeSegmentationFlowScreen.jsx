import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronUp,
  ChevronRight,
  Edit3,
  FileText,
  Home,
  Play,
  Plus,
  Save,
  Scissors,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react';

const makeSegmentationStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');

  .make-seg,
  .make-seg * {
    box-sizing: border-box;
  }

  .make-seg {
    --make-bg-top: #f6f9fd;
    --make-bg-bottom: #edf3f9;
    --make-surface: #ffffff;
    --make-surface-soft: #f8fbff;
    --make-surface-tint: #eff6ff;
    --make-surface-mist: #dbeafe;
    --make-text-strong: #0f172a;
    --make-text-body: #334155;
    --make-text-soft: #64748b;
    --make-text-faint: #94a3b8;
    --make-line: rgba(203, 213, 225, 0.92);
    --make-line-soft: #dbe5f0;
    --make-line-strong: #bfdbfe;
    --make-accent: #2563eb;
    --make-accent-strong: #1d4ed8;
    --make-accent-soft: #93c5fd;
    --make-accent-wash: #eff6ff;
    --make-accent-mist: #dbeafe;
    --make-feature-start: #0f172a;
    --make-feature-end: #1d4ed8;
    --make-shadow-soft: 0 24px 60px rgba(15, 23, 42, 0.08);
    --make-shadow-card: 0 30px 60px rgba(15, 23, 42, 0.12);
    --make-shadow-accent: 0 24px 44px rgba(37, 99, 235, 0.18);
    --make-shadow-accent-strong: 0 30px 56px rgba(37, 99, 235, 0.26);
    --make-success: #16a34a;
    --make-success-soft: rgba(22, 163, 74, 0.08);
    --make-attention: #1d4ed8;
    --make-attention-soft: rgba(37, 99, 235, 0.08);
    --make-attention-line: rgba(147, 197, 253, 0.46);
    --make-review-strong: #d97706;
    --make-review-strong-soft: rgba(217, 119, 6, 0.1);
    --make-review-strong-line: rgba(245, 158, 11, 0.32);
    --make-workspace-header-height: 84px;
    min-height: 100vh;
    background:
      radial-gradient(circle at 8% 10%, rgba(219, 234, 254, 0.78), transparent 28%),
      radial-gradient(circle at 88% 12%, rgba(226, 232, 240, 0.82), transparent 24%),
      linear-gradient(180deg, var(--make-bg-top) 0%, var(--make-bg-bottom) 100%);
    color: var(--make-text-body);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    overflow-x: clip;
  }

  .make-seg__page {
    min-height: 100vh;
  }

  .make-seg__header {
    position: sticky;
    top: 0;
    z-index: 20;
    border-bottom: 1px solid var(--make-line);
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(18px);
  }

  .make-seg__headerInner {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: 24px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .make-seg__headerInner.is-workspace {
    max-width: 1400px;
    padding: 20px 48px;
    position: relative;
  }

  .make-seg__brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .make-seg__brandMark {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    border: 1px solid var(--make-line-strong);
    background: linear-gradient(180deg, var(--make-accent-wash) 0%, var(--make-accent-mist) 100%);
    color: var(--make-accent);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92), 0 16px 28px rgba(37, 99, 235, 0.12);
    flex: 0 0 auto;
  }

  .make-seg__brandMark.is-small {
    width: 32px;
    height: 32px;
  }

  .make-seg__brandName {
    margin: 0 0 3px;
    font-size: 14px;
    line-height: 1;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--make-text-strong);
  }

  .make-seg__brandMeta {
    margin: 0;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--make-text-soft);
  }

  .make-seg__headerActions {
    display: inline-flex;
    align-items: center;
    gap: 24px;
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .make-seg__headerAside {
    display: inline-flex;
    align-items: center;
    gap: 18px;
    min-width: 0;
    margin-left: auto;
  }

  .make-seg__headerPill,
  .make-seg__ghostButton,
  .make-seg__primaryButton,
  .make-seg__choiceButton,
  .make-seg__actionButton {
    font: inherit;
  }

  .make-seg__headerPill {
    border: 1px solid var(--make-line-soft);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.92);
    color: var(--make-text-body);
    min-height: 38px;
    padding: 0 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  }

  .make-seg__headerPill:hover,
  .make-seg__ghostButton:hover,
  .make-seg__choiceButton:hover,
  .make-seg__actionButton:hover {
    transform: translateY(-1px);
    border-color: var(--make-line-strong);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  }

  .make-seg__main {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: 64px 48px 88px;
  }

  .make-seg__hero {
    margin: 0 0 80px;
    text-align: center;
    animation: make-seg-fade-up 0.6s ease both;
  }

  .make-seg__heroTitle,
  .make-seg__successTitle,
  .make-seg__sectionTitle {
    margin: 0;
    color: var(--make-text-strong);
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  }

  .make-seg__heroTitle {
    font-size: 72px;
    line-height: 0.95;
    margin-bottom: 24px;
  }

  .make-seg__heroText {
    margin: 0;
    color: var(--make-text-soft);
    letter-spacing: 0.05em;
  }

  .make-seg__cardGrid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;
  }

  .make-seg__projectCard,
  .make-seg__newProjectCard {
    min-height: 274px;
    border-radius: 24px;
    padding: 32px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
    animation: make-seg-fade-up 0.6s ease both;
  }

  .make-seg__projectCard:nth-child(1) { animation-delay: 0.08s; }
  .make-seg__projectCard:nth-child(2) { animation-delay: 0.14s; }
  .make-seg__projectCard:nth-child(3) { animation-delay: 0.2s; }
  .make-seg__newProjectCard { animation-delay: 0.26s; }

  .make-seg__projectCard {
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid var(--make-line-soft);
    box-shadow: var(--make-shadow-soft);
  }

  .make-seg__projectCard:hover {
    border-color: var(--make-line-strong);
    box-shadow: var(--make-shadow-accent);
    transform: translateY(-4px);
  }

  .make-seg__newProjectCard {
    background: linear-gradient(135deg, var(--make-feature-start) 0%, var(--make-feature-end) 100%);
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .make-seg__newProjectCard:hover {
    box-shadow: var(--make-shadow-accent-strong);
    transform: translateY(-4px);
  }

  .make-seg__projectMeta {
    margin-bottom: 64px;
  }

  .make-seg__chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 22px;
    padding: 0 12px;
    border: 1px solid var(--make-line-strong);
    border-radius: 4px;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--make-text-soft);
    background: var(--make-surface);
    margin-bottom: 20px;
  }

  .make-seg__projectCode {
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--make-text-soft);
  }

  .make-seg__projectTitle {
    margin: 0 0 42px;
    font-size: 32px;
    line-height: 1.1;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    color: var(--make-text-strong);
  }

  .make-seg__projectFooter {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--make-line);
  }

  .make-seg__metaAlignEnd {
    text-align: right;
  }

  .make-seg__projectLabel {
    margin: 0 0 6px;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--make-text-soft);
  }

  .make-seg__projectValue {
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
    color: var(--make-text-body);
  }

  .make-seg__arrowCue {
    margin-top: 14px;
    opacity: 0;
    transition: opacity 0.2s ease;
    color: var(--make-accent-strong);
  }

  .make-seg__projectCard:hover .make-seg__arrowCue {
    opacity: 1;
  }

  .make-seg__newProjectIcon {
    margin-bottom: 24px;
    opacity: 0.92;
    transition: transform 0.3s ease;
  }

  .make-seg__newProjectCard:hover .make-seg__newProjectIcon {
    transform: scale(1.1);
  }

  .make-seg__newProjectTitle {
    margin: 0 0 12px;
    font-size: 28px;
    line-height: 1.1;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  }

  .make-seg__newProjectText {
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    line-height: 1.6;
  }

  .make-seg__workspaceMain {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 80px 48px;
  }

  .make-seg__centerStage {
    text-align: center;
    padding: 80px 0;
    animation: make-seg-fade-up 0.6s ease both;
  }

  .make-seg__centerStage--workspaceIntro {
    padding-top: 0;
    padding-bottom: 16px;
  }

  .make-seg__centerStage--workspaceIntro .make-seg__sectionLead {
    max-width: 620px;
  }

  .make-seg__workspacePanel.is-intakeStage .make-seg__sectionPill {
    padding: 0;
    margin-bottom: 24px;
    background: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
    color: rgba(51, 65, 85, 0.68);
    letter-spacing: 0.22em;
  }

  .make-seg__workspacePanel.is-intakeStage .make-seg__sectionTitle {
    color: #08060d;
  }

  .make-seg__workspacePanel.is-intakeStage .make-seg__sectionLead {
    color: rgba(15, 23, 42, 0.32);
  }

  .make-seg__workspacePanel.is-intakeStage .make-seg__sectionPill.is-live {
    color: var(--make-accent-strong);
  }

  .make-seg__centerStage--choiceIntro {
    padding-top: 0;
    padding-bottom: 56px;
  }

  .make-seg__sectionPill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 999px;
    background: var(--make-accent-wash);
    margin-bottom: 32px;
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--make-accent-strong);
  }

  .make-seg__sectionDot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: currentColor;
  }

  .make-seg__sectionTitle {
    font-size: clamp(32px, 6vw, 72px);
    line-height: 0.95;
    margin-bottom: 24px;
  }

  .make-seg__sectionLead {
    margin: 0 auto;
    max-width: 540px;
    color: var(--make-text-soft);
    font-size: 18px;
    line-height: 1.7;
    letter-spacing: 0.02em;
  }

  .make-seg__intakeActions {
    margin-top: 30px;
    position: relative;
    z-index: 24;
    display: flex;
    justify-content: center;
  }

  .make-seg__ctaCluster {
    position: relative;
    display: inline-flex;
    align-items: stretch;
    justify-content: center;
    justify-self: center;
    filter: drop-shadow(0 26px 44px rgba(37, 99, 235, 0.16));
    transition: transform 0.25s ease;
  }

  .make-seg__ctaCluster:hover {
    transform: translateY(-2px);
  }

  .make-seg__primaryButton.is-segmentation {
    min-width: 360px;
    border-top-right-radius: 24px;
    border-bottom-right-radius: 24px;
    box-shadow: none;
  }

  .make-seg__primaryButton.is-segmentation:hover {
    transform: none;
  }

  .make-seg__splitButton {
    width: 72px;
    border: none;
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    border-top-right-radius: 999px;
    border-bottom-right-radius: 999px;
    background: linear-gradient(90deg, var(--make-accent) 0%, var(--make-accent-strong) 100%);
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: filter 0.25s ease;
  }

  .make-seg__splitButton:focus-visible {
    outline: 2px solid rgba(37, 99, 235, 0.35);
    outline-offset: 2px;
  }

  .make-seg__splitChevron {
    transition: transform 0.2s ease;
  }

  .make-seg__splitChevron.is-open {
    transform: scale(1.08);
  }

  .make-seg__splitMenu {
    position: absolute;
    right: 0;
    bottom: calc(100% + 16px);
    width: 320px;
    padding: 14px;
    border: 1px solid rgba(191, 219, 254, 0.88);
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(16px);
    box-shadow: 0 28px 56px rgba(15, 23, 42, 0.12);
    z-index: 80;
    animation: make-seg-fade-up 0.2s ease both;
  }

  .make-seg__splitMenuSection + .make-seg__splitMenuSection {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(226, 232, 240, 0.9);
  }

  .make-seg__splitMenuLabel {
    margin: 0 0 8px;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--make-text-faint);
  }

  .make-seg__splitMenuOption {
    width: 100%;
    min-height: 48px;
    padding: 0 14px;
    border: 1px solid transparent;
    border-radius: 16px;
    background: transparent;
    color: var(--make-text-body);
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
  }

  .make-seg__splitMenuOption:hover {
    transform: translateY(-1px);
    border-color: rgba(191, 219, 254, 0.88);
    background: rgba(239, 246, 255, 0.74);
  }

  .make-seg__splitMenuOption.is-selected {
    border-color: rgba(147, 197, 253, 0.92);
    background: rgba(239, 246, 255, 0.86);
    color: var(--make-accent-strong);
  }

  .make-seg__splitMenuOptionText {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    line-height: 1.4;
  }

  .make-seg__splitMenuOptionText.is-stacked {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }

  .make-seg__splitMenuOptionTitle {
    color: var(--make-text-strong);
    font-size: 13px;
    line-height: 1.2;
  }

  .make-seg__splitMenuOptionMeta {
    color: var(--make-text-soft);
    font-size: 12px;
    line-height: 1.4;
  }

  .make-seg__splitMenuToggle {
    width: 100%;
    min-height: 48px;
    padding: 0 14px;
    border: 1px solid transparent;
    border-radius: 16px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
  }

  .make-seg__splitMenuToggle:hover {
    transform: translateY(-1px);
    border-color: rgba(191, 219, 254, 0.88);
    background: rgba(239, 246, 255, 0.74);
  }

  .make-seg__splitMenuToggleText {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    text-align: left;
  }

  .make-seg__splitMenuToggleTitle {
    font-size: 13px;
    line-height: 1.2;
    color: var(--make-text-strong);
  }

  .make-seg__splitMenuToggleMeta {
    font-size: 12px;
    line-height: 1.4;
    color: var(--make-text-soft);
  }

  .make-seg__miniSwitch {
    width: 40px;
    height: 24px;
    padding: 2px;
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.24);
    display: inline-flex;
    align-items: center;
    transition: background-color 0.2s ease;
    flex: 0 0 auto;
  }

  .make-seg__miniSwitchThumb {
    width: 20px;
    height: 20px;
    border-radius: 999px;
    background: #ffffff;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.14);
    transition: transform 0.2s ease;
  }

  .make-seg__miniSwitch.is-active {
    background: linear-gradient(90deg, var(--make-accent-soft) 0%, var(--make-accent) 100%);
  }

  .make-seg__miniSwitch.is-active .make-seg__miniSwitchThumb {
    transform: translateX(16px);
  }

  .make-seg__fieldGroup {
    margin-bottom: 48px;
    text-align: left;
  }

  .make-seg__fieldGroup.is-offset {
    margin-top: 64px;
  }

  .make-seg__fieldLabel {
    display: block;
    margin-bottom: 16px;
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--make-text-soft);
  }

  .make-seg__fieldInput,
  .make-seg__fieldTextarea,
  .make-seg__markerInput {
    width: 100%;
    border: 2px solid var(--make-line-soft);
    border-radius: 24px;
    background: var(--make-surface);
    color: var(--make-text-strong);
    font: inherit;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    outline: none;
  }

  .make-seg__fieldInput:focus,
  .make-seg__fieldTextarea:focus,
  .make-seg__markerInput:focus {
    border-color: var(--make-accent-soft);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
  }

  .make-seg__fieldInput {
    min-height: 72px;
    padding: 0 32px;
    font-size: 18px;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  }

  .make-seg__fieldTextarea {
    min-height: 380px;
    padding: 28px 32px;
    resize: none;
    font-size: 16px;
    line-height: 1.9;
  }

  .make-seg__previewCard {
    margin-bottom: 48px;
    padding: 32px;
    border-radius: 24px;
    border: 1px solid var(--make-line-soft);
    background: var(--make-surface);
    text-align: left;
    animation: make-seg-expand 0.35s ease both;
  }

  .make-seg__previewHeader {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 24px;
  }

  .make-seg__previewTitle {
    margin: 0 0 10px;
    font-size: 13px;
    line-height: 1;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--make-text-soft);
  }

  .make-seg__previewStats {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
    font-size: 14px;
    color: var(--make-text-body);
  }

  .make-seg__previewStatLabel {
    color: var(--make-text-soft);
  }

  .make-seg__accentIcon {
    color: var(--make-accent-strong);
  }

  .make-seg__subtleText {
    color: var(--make-text-faint);
  }

  .make-seg__brandName.is-inline,
  .make-seg__previewTitle.is-inline {
    margin: 0;
  }

  .make-seg__choiceLink.is-subtle {
    color: var(--make-text-soft);
  }

  .make-seg__sectionPill.is-success {
    background: var(--make-success-soft);
    color: var(--make-success);
  }

  .make-seg__successStatValue.is-live {
    color: var(--make-success);
  }

  .make-seg__warning {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    border-radius: 16px;
    border: 1px solid #fde68a;
    background: #fffbeb;
    color: #78350f;
    font-size: 14px;
    line-height: 1.6;
  }

  .make-seg__actionsCentered {
    display: flex;
    justify-content: center;
  }

  .make-seg__primaryButton,
  .make-seg__ghostButton,
  .make-seg__actionButton {
    border: none;
    border-radius: 999px;
    min-height: 60px;
    padding: 0 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, opacity 0.25s ease;
  }

  .make-seg__primaryButton {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    background: linear-gradient(90deg, var(--make-accent) 0%, var(--make-accent-strong) 100%);
    color: #ffffff;
    box-shadow: var(--make-shadow-accent);
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .make-seg__primaryButton::before,
  .make-seg__primaryButton::after {
    content: "";
    position: absolute;
    pointer-events: none;
    transition: opacity 0.32s ease, transform 0.38s ease;
  }

  .make-seg__primaryButton::before {
    inset: 1px;
    border-radius: inherit;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.08) 34%, rgba(255, 255, 255, 0) 100%);
    opacity: 0.95;
  }

  .make-seg__primaryButton::after {
    top: -18%;
    bottom: -18%;
    left: -26%;
    width: 30%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.34) 48%, rgba(255, 255, 255, 0) 100%);
    opacity: 0;
    transform: translateX(-10px) skewX(-18deg);
  }

  .make-seg__primaryButton:hover,
  .make-seg__actionButton:hover {
    transform: translateY(-2px);
  }

  .make-seg__primaryButton:hover {
    box-shadow: 0 28px 54px rgba(37, 99, 235, 0.24);
    filter: saturate(1.02);
  }

  .make-seg__primaryButton:hover::after,
  .make-seg__primaryButton:focus-visible::after {
    opacity: 1;
    transform: translateX(260%) skewX(-18deg);
  }

  .make-seg__primaryButton:active {
    transform: translateY(0);
    box-shadow: 0 14px 28px rgba(37, 99, 235, 0.18);
  }

  .make-seg__primaryButton:disabled {
    opacity: 0.5;
    box-shadow: none;
    transform: none;
    cursor: not-allowed;
  }

  .make-seg__ghostButton {
    background: rgba(255, 255, 255, 0.92);
    color: var(--make-text-body);
    border: 2px solid var(--make-line-soft);
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .make-seg__ghostButton:hover {
    border-color: var(--make-line-strong);
  }

  .make-seg__savedState {
    text-align: center;
    padding: 80px 0;
    animation: make-seg-scale-in 0.45s ease both;
  }

  .make-seg__savedSeal,
  .make-seg__compilingSeal,
  .make-seg__successSeal {
    margin: 0 auto 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--make-shadow-accent);
  }

  .make-seg__savedSeal,
  .make-seg__compilingSeal {
    width: 80px;
    height: 80px;
    border-radius: 999px;
    background: linear-gradient(135deg, var(--make-accent) 0%, var(--make-accent-strong) 100%);
    color: #ffffff;
  }

  .make-seg__successSeal {
    width: 128px;
    height: 128px;
    border-radius: 999px;
    background: linear-gradient(135deg, var(--make-accent) 0%, var(--make-accent-strong) 100%);
    color: #ffffff;
    box-shadow: var(--make-shadow-accent-strong);
  }

  .make-seg__savedTitle,
  .make-seg__successTitle {
    margin: 0 0 24px;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  }

  .make-seg__savedTitle {
    font-size: 48px;
    line-height: 1.1;
  }

  .make-seg__savedText,
  .make-seg__successText {
    margin: 0 0 48px;
    color: var(--make-text-soft);
    font-size: 18px;
    line-height: 1.7;
  }

  .make-seg__buttonRow {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .make-seg__stepItem {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .make-seg__stepItem.is-current .make-seg__stepLabel {
    color: var(--make-text-strong);
  }

  .make-seg__stepItem.is-complete .make-seg__stepLabel {
    color: var(--make-accent-strong);
  }

  .make-seg__stepItem.is-pending .make-seg__stepLabel {
    color: var(--make-text-faint);
  }

  .make-seg__workspacePage {
    min-height: 100vh;
    overflow-x: clip;
    background:
      radial-gradient(circle at 8% 10%, rgba(219, 234, 254, 0.78), transparent 28%),
      radial-gradient(circle at 88% 12%, rgba(226, 232, 240, 0.82), transparent 24%),
      linear-gradient(180deg, var(--make-bg-top) 0%, var(--make-bg-bottom) 100%);
  }

  .make-seg__screenStage {
    position: relative;
    width: 100%;
    min-height: calc(100vh - var(--make-workspace-header-height));
  }

  .make-seg__stageAtmosphere {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }

  .make-seg__stageAtmosphereWord,
  .make-seg__stageAtmosphereLine {
    position: absolute;
    pointer-events: none;
  }

  .make-seg__stageAtmosphereWord {
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: clamp(120px, 15vw, 220px);
    line-height: 0.84;
    letter-spacing: -0.08em;
    color: rgba(37, 99, 235, 0.04);
    text-shadow: 0 0 32px rgba(37, 99, 235, 0.03);
  }

  .make-seg__stageAtmosphereWord.is-left {
    left: -28px;
    bottom: 3%;
  }

  .make-seg__stageAtmosphereWord.is-right {
    right: -18px;
    top: 7%;
  }

  .make-seg__stageAtmosphereLine {
    width: 2px;
    opacity: 0.96;
    transform-origin: top center;
  }

  .make-seg__stageAtmosphereLine.is-leftSoft {
    top: -4%;
    left: 8.4%;
    height: 124%;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.07) 18%, rgba(15, 23, 42, 0.11) 50%, rgba(15, 23, 42, 0.04) 82%, rgba(15, 23, 42, 0) 100%);
    transform: rotate(-18deg);
  }

  .make-seg__stageAtmosphereLine.is-leftStrong {
    top: -2%;
    left: 10.2%;
    height: 122%;
    background: linear-gradient(180deg, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.18) 16%, rgba(37, 99, 235, 0.32) 50%, rgba(37, 99, 235, 0.1) 84%, rgba(37, 99, 235, 0) 100%);
    transform: rotate(-18deg);
  }

  .make-seg__stageAtmosphereLine.is-rightSoft {
    top: -3%;
    right: 8.6%;
    height: 126%;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.06) 18%, rgba(15, 23, 42, 0.11) 48%, rgba(15, 23, 42, 0.04) 82%, rgba(15, 23, 42, 0) 100%);
    transform: rotate(17deg);
  }

  .make-seg__stageAtmosphereLine.is-rightStrong {
    top: -5%;
    right: 6.9%;
    height: 128%;
    background: linear-gradient(180deg, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.16) 16%, rgba(37, 99, 235, 0.34) 50%, rgba(37, 99, 235, 0.1) 84%, rgba(37, 99, 235, 0) 100%);
    transform: rotate(17deg);
  }

  .make-seg__screenStage.is-review-atmosphere .make-seg__stageAtmosphereLine.is-leftSoft {
    left: 3.2%;
  }

  .make-seg__screenStage.is-review-atmosphere .make-seg__stageAtmosphereLine.is-leftStrong {
    left: 5.2%;
  }

  .make-seg__screenStage.is-review-atmosphere .make-seg__stageAtmosphereLine.is-rightSoft {
    right: 3.4%;
  }

  .make-seg__screenStage.is-review-atmosphere .make-seg__stageAtmosphereLine.is-rightStrong {
    right: 5.1%;
  }

  .make-seg__screenStage.is-review-atmosphere .make-seg__stageAtmosphereWord.is-left {
    left: -42px;
    bottom: 10%;
    opacity: 0.8;
  }

  .make-seg__screenStage.is-review-atmosphere .make-seg__stageAtmosphereWord.is-right {
    right: -34px;
    top: 10%;
    opacity: 0.8;
  }

  .make-seg__screenStage.is-centered {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .make-seg__workspaceContent {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 48px 64px;
  }

  .make-seg__workspaceStepbar {
    display: none;
  }

  @media (min-width: 640px) {
    .make-seg__workspaceStepbar {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .make-seg__stepBullet {
    width: 24px;
    height: 24px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    line-height: 1;
    transition: all 0.2s ease;
  }

  .make-seg__stepBullet.is-current {
    background: var(--make-accent);
    color: #ffffff;
  }

  .make-seg__stepBullet.is-complete {
    background: rgba(37, 99, 235, 0.12);
    color: var(--make-accent-strong);
  }

  .make-seg__stepBullet.is-pending {
    background: rgba(148, 163, 184, 0.14);
    color: var(--make-text-faint);
  }

  .make-seg__stepLabel {
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--make-text-soft);
    white-space: nowrap;
    transition: color 0.2s ease;
  }

  .make-seg__stepLine {
    width: 32px;
    height: 1px;
    background: var(--make-line);
  }

  .make-seg__workspacePanel {
    position: relative;
    min-height: calc(100vh - var(--make-workspace-header-height));
    transition: all 0.7s ease;
  }

  .make-seg__workspacePanel.is-intakeStage {
    overflow: hidden;
    background:
      radial-gradient(circle at 18% 18%, rgba(219, 234, 254, 0.72), transparent 18%),
      radial-gradient(circle at 84% 16%, rgba(219, 234, 254, 0.5), transparent 16%),
      radial-gradient(circle at 78% 74%, rgba(239, 246, 255, 0.82), transparent 20%),
      linear-gradient(180deg, #fbfbfc 0%, #f7f8fb 100%);
  }

  .make-seg__workspacePanel.is-collapsed {
    background: transparent;
    border-bottom: none;
  }

  .make-seg__workspacePanelBg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .make-seg__blurCircle {
    position: absolute;
    border-radius: 999px;
    filter: blur(72px);
    pointer-events: none;
  }

  .make-seg__blurCircle.is-top {
    top: -160px;
    right: -160px;
    width: 600px;
    height: 600px;
    background: rgba(37, 99, 235, 0.05);
  }

  .make-seg__blurCircle.is-bottom {
    bottom: -80px;
    left: -80px;
    width: 400px;
    height: 400px;
    background: rgba(148, 163, 184, 0.14);
  }

  .make-seg__workspaceSection {
    position: relative;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 96px 48px 120px;
  }

  .make-seg__workspaceSection.is-intakeStage {
    max-width: 1080px;
    padding-top: 68px;
    padding-bottom: 88px;
  }

  .make-seg__workspaceSection.is-collapsed {
    padding-top: 32px;
    padding-bottom: 32px;
  }

  .make-seg__workspaceCompactRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .make-seg__workspaceCompactMeta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .make-seg__workspaceCompactCheck {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background: var(--make-accent-wash);
    color: var(--make-accent-strong);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .make-seg__workspaceCompactLabel {
    font-size: 14px;
    color: var(--make-text-soft);
  }

  .make-seg__workspaceCompactCount {
    font-size: 12px;
    color: var(--make-text-faint);
  }

  .make-seg__editorWrap {
    position: relative;
  }

  .make-seg__pasteCanvas {
    position: relative;
    max-width: 960px;
    margin: 0 auto;
    padding: 12px 32px 10px;
  }

  .make-seg__intakeWord,
  .make-seg__intakeLine {
    position: absolute;
    pointer-events: none;
  }

  .make-seg__intakeWord {
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: 160px;
    line-height: 0.9;
    letter-spacing: -0.08em;
    color: rgba(15, 23, 42, 0.032);
  }

  .make-seg__intakeWord.is-right {
    top: 18px;
    right: -24px;
  }

  .make-seg__intakeWord.is-left {
    left: -44px;
    bottom: -4px;
  }

  .make-seg__intakeLine {
    width: 2px;
    transform-origin: top center;
    opacity: 0.92;
  }

  .make-seg__intakeLine.is-rightStrong {
    top: 8px;
    right: 92px;
    height: 720px;
    background: linear-gradient(180deg, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.22) 22%, rgba(37, 99, 235, 0.34) 50%, rgba(37, 99, 235, 0.12) 72%, rgba(37, 99, 235, 0) 100%);
    transform: rotate(16deg);
  }

  .make-seg__intakeLine.is-rightSoft {
    top: 18px;
    right: 126px;
    height: 720px;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.06) 18%, rgba(15, 23, 42, 0.13) 50%, rgba(15, 23, 42, 0.05) 82%, rgba(15, 23, 42, 0) 100%);
    transform: rotate(16deg);
  }

  .make-seg__intakeLine.is-leftSoft {
    top: -8px;
    left: 184px;
    height: 620px;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.05) 18%, rgba(15, 23, 42, 0.1) 50%, rgba(15, 23, 42, 0.04) 84%, rgba(15, 23, 42, 0) 100%);
    transform: rotate(-18deg);
  }

  .make-seg__intakeLine.is-leftStrong {
    top: 12px;
    left: 214px;
    height: 612px;
    background: linear-gradient(180deg, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.12) 20%, rgba(37, 99, 235, 0.2) 52%, rgba(37, 99, 235, 0.06) 82%, rgba(37, 99, 235, 0) 100%);
    transform: rotate(-18deg);
  }

  .make-seg__pasteLayer,
  .make-seg__pasteAura {
    position: absolute;
    pointer-events: none;
  }

  .make-seg__pasteLayer {
    left: 50%;
    transform: translateX(-50%);
    border-radius: 32px;
    border: 1px solid rgba(255, 255, 255, 0.58);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.56) 0%, rgba(239, 246, 255, 0.26) 100%);
    backdrop-filter: blur(20px);
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.07);
  }

  .make-seg__pasteLayer.is-back {
    top: 18px;
    width: calc(100% - 24px);
    height: calc(100% - 46px);
    opacity: 0.42;
  }

  .make-seg__pasteLayer.is-mid {
    top: 42px;
    width: calc(100% - 72px);
    height: calc(100% - 72px);
    opacity: 0.68;
  }

  .make-seg__pasteAura {
    border-radius: 999px;
    filter: blur(22px);
  }

  .make-seg__pasteAura.is-left {
    left: 14px;
    bottom: 56px;
    width: 140px;
    height: 140px;
    background: rgba(219, 234, 254, 0.7);
  }

  .make-seg__pasteAura.is-right {
    top: 26px;
    right: 34px;
    width: 180px;
    height: 180px;
    background: rgba(191, 219, 254, 0.42);
  }

  .make-seg__pasteStageOrnament {
    position: absolute;
    pointer-events: none;
    opacity: 0.72;
  }

  .make-seg__pasteStageOrnament.is-left {
    left: -26px;
    bottom: 92px;
    width: 132px;
    height: 132px;
  }

  .make-seg__pasteStageOrnament.is-right {
    top: 86px;
    right: -18px;
    width: 156px;
    height: 156px;
  }

  .make-seg__pasteStageGrid {
    position: absolute;
    inset: auto 96px 10px;
    height: 128px;
    border-radius: 0 0 28px 28px;
    background:
      linear-gradient(180deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0.18) 100%),
      repeating-linear-gradient(
        90deg,
        rgba(148, 163, 184, 0.1) 0,
        rgba(148, 163, 184, 0.1) 1px,
        transparent 1px,
        transparent 10px
      );
    mask-image: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.92) 36%);
    pointer-events: none;
    opacity: 0.62;
  }

  .make-seg__panelCorner {
    position: absolute;
    width: 16px;
    height: 16px;
    border-color: rgba(37, 99, 235, 0.26);
    border-style: solid;
    pointer-events: none;
    z-index: 2;
  }

  .make-seg__panelCorner.is-topLeft {
    top: 0;
    left: 18px;
    border-width: 1.5px 0 0 1.5px;
    border-top-left-radius: 14px;
  }

  .make-seg__panelCorner.is-topRight {
    top: 0;
    right: 18px;
    border-width: 1.5px 1.5px 0 0;
    border-top-right-radius: 14px;
  }

  .make-seg__panelCorner.is-bottomLeft {
    bottom: 0;
    left: 18px;
    border-width: 0 0 1.5px 1.5px;
    border-bottom-left-radius: 14px;
  }

  .make-seg__panelCorner.is-bottomRight {
    bottom: 0;
    right: 18px;
    border-width: 0 1.5px 1.5px 0;
    border-bottom-right-radius: 14px;
  }

  .make-seg__editorWrap--feature {
    position: relative;
    z-index: 1;
  }

  .make-seg__editorGlow {
    position: absolute;
    inset: -4px;
    border-radius: 22px;
    background: linear-gradient(180deg, rgba(37, 99, 235, 0.18) 0%, rgba(37, 99, 235, 0.05) 50%, transparent 100%);
    opacity: 0;
    filter: blur(8px);
    transition: opacity 0.5s ease;
    pointer-events: none;
  }

  .make-seg__editorWrap:focus-within .make-seg__editorGlow {
    opacity: 1;
  }

  .make-seg__editorShell {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid var(--make-line-soft);
    background: var(--make-surface);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .make-seg__editorShell--feature {
    border-radius: 28px;
    border-color: rgba(15, 23, 42, 0.08);
    background: #ffffff;
    box-shadow: 0 2px 20px -4px rgba(0, 0, 0, 0.06);
  }

  .make-seg__editorShell--feature::before {
    content: "";
    position: absolute;
    inset: 0 0 auto;
    height: 120px;
    background: linear-gradient(180deg, rgba(37, 99, 235, 0.04) 0%, rgba(37, 99, 235, 0) 100%);
    pointer-events: none;
  }

  .make-seg__editorShell--feature::after {
    content: "";
    position: absolute;
    inset: auto 28px 22px;
    height: 1px;
    background: linear-gradient(90deg, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.16) 50%, rgba(37, 99, 235, 0) 100%);
    pointer-events: none;
  }

  .make-seg__editorWrap:focus-within .make-seg__editorShell {
    border-color: rgba(37, 99, 235, 0.3);
    box-shadow: 0 8px 40px -12px rgba(37, 99, 235, 0.15);
  }

  .make-seg__editorWrap:focus-within .make-seg__editorShell--feature {
    border-color: rgba(37, 99, 235, 0.2);
    box-shadow: 0 10px 40px rgba(37, 99, 235, 0.08);
  }

  .make-seg__editorTopbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 24px;
    border-bottom: 1px solid rgba(203, 213, 225, 0.54);
  }

  .make-seg__editorTopbar--feature {
    min-height: 72px;
    padding: 18px 24px;
    background: #ffffff;
    border-bottom-color: rgba(0, 0, 0, 0.05);
  }

  .make-seg__windowButtons {
    display: inline-flex;
    gap: 8px;
  }

  .make-seg__windowButtons span {
    height: 8px;
    border-radius: 999px;
    display: block;
  }

  .make-seg__windowButtons span:nth-child(1) {
    width: 8px;
    background: rgba(0, 0, 0, 0.08);
  }

  .make-seg__windowButtons span:nth-child(2) {
    width: 8px;
    background: rgba(0, 0, 0, 0.08);
  }

  .make-seg__windowButtons span:nth-child(3) {
    width: 18px;
    background: rgba(0, 0, 0, 0.08);
  }

  .make-seg__editorChrome {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  .make-seg__editorChromeText {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .make-seg__editorChromeEyebrow {
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.34);
  }

  .make-seg__editorSeal {
    min-height: 28px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid rgba(37, 99, 235, 0.14);
    background: rgba(239, 246, 255, 0.9);
    color: rgba(37, 99, 235, 0.72);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
  }

  .make-seg__editorChromeTitle {
    font-size: 13px;
    line-height: 1.2;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.35);
  }

  .make-seg__editorMeta {
    font-size: 11px;
    color: var(--make-text-faint);
    letter-spacing: 0.12em;
  }

  .make-seg__editorMetaPill {
    min-height: 36px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: rgba(255, 255, 255, 0.82);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.3);
    white-space: nowrap;
  }

  .make-seg__editorMetaPill.is-idle {
    color: rgba(0, 0, 0, 0.25);
  }

  .make-seg__editorTextarea {
    min-height: 380px;
    border: none;
    border-radius: 0;
  }

  .make-seg__editorTextarea--feature {
    min-height: 420px;
    padding: 34px 32px 36px;
    background: #ffffff;
    color: rgba(0, 0, 0, 0.8);
  }

  .make-seg__editorTextarea--feature::placeholder {
    color: rgba(0, 0, 0, 0.42);
  }

  .make-seg__continueStage {
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .make-seg__continueStage .make-seg__primaryButton {
    min-width: 560px;
    background: linear-gradient(90deg, var(--make-accent) 0%, var(--make-accent-strong) 100%);
    box-shadow: var(--make-shadow-accent);
  }

  .make-seg__editorFooter {
    min-height: 44px;
    padding: 0 24px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .make-seg__editorShortcut {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.2);
  }

  .make-seg__editorKey {
    min-width: 20px;
    height: 20px;
    padding: 0 4px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.25);
    font-size: 12px;
    line-height: 1;
  }

  .make-seg__editorFooterMeta {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.2);
    letter-spacing: 0.04em;
  }

  .make-seg__editorWatermark {
    position: absolute;
    right: 34px;
    bottom: 58px;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: 54px;
    line-height: 1;
    letter-spacing: -0.06em;
    color: rgba(37, 99, 235, 0.085);
    text-transform: none;
    text-shadow: 0 0 24px rgba(37, 99, 235, 0.06);
    pointer-events: none;
  }

  .make-seg__continueStage.is-ready {
    opacity: 1;
    transform: translateY(0);
  }

  .make-seg__continueStage.is-waiting {
    opacity: 0.35;
    transform: translateY(10px);
  }

  .make-seg__continueHint {
    font-size: 12px;
    color: var(--make-text-faint);
    letter-spacing: 0.02em;
  }

  .make-seg__continueHint.is-anchored {
    margin-top: -4px;
  }

  .make-seg__pasteDecisionBar {
    max-width: 960px;
    margin: 28px auto 0;
    padding: 18px 22px;
    border: 1px solid rgba(203, 213, 225, 0.72);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.74);
    backdrop-filter: blur(14px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    flex-wrap: wrap;
  }

  .make-seg__pasteDecisionText {
    margin: 0;
    flex: 1 1 360px;
    font-size: 14px;
    line-height: 1.7;
    color: var(--make-text-soft);
  }

  .make-seg__pasteDecisionActions {
    display: inline-flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
  }

  .make-seg__choiceSection {
    max-width: 1200px;
    margin: 0 auto;
    padding: 96px 48px;
  }

  .make-seg__choiceSection.is-collapsed {
    background: transparent;
    border-bottom: none;
    padding-top: 24px;
    padding-bottom: 20px;
  }

  .make-seg__choiceGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  .make-seg__choiceCard {
    position: relative;
    overflow: hidden;
    width: 100%;
    min-height: 320px;
    border-radius: 24px;
    border: 2px solid var(--make-line-soft);
    background: rgba(255, 255, 255, 0.94);
    padding: 40px;
    text-align: left;
    cursor: pointer;
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
    animation: make-seg-fade-up 0.5s ease both;
  }

  .make-seg__choiceCard.is-featured {
    background: linear-gradient(135deg, var(--make-feature-start) 0%, var(--make-feature-end) 100%);
    border-color: transparent;
    color: #ffffff;
  }

  .make-seg__choiceCard:hover {
    transform: translateY(-4px) scale(1.02);
    border-color: var(--make-line-strong);
    box-shadow: var(--make-shadow-accent);
  }

  .make-seg__choiceCard.is-featured:hover {
    box-shadow: var(--make-shadow-accent-strong);
  }

  .make-seg__choiceDecoration {
    position: absolute;
    border-radius: 999px;
    pointer-events: none;
  }

  .make-seg__choiceDecoration.is-featured {
    top: 0;
    right: 0;
    width: 160px;
    height: 160px;
    background: rgba(255, 255, 255, 0.06);
    transform: translate(34%, -50%);
    transition: transform 0.5s ease;
  }

  .make-seg__choiceDecoration.is-outline {
    bottom: 0;
    right: 0;
    width: 128px;
    height: 128px;
    background: rgba(37, 99, 235, 0.06);
    transform: translate(34%, 50%);
  }

  .make-seg__choiceCard:hover .make-seg__choiceDecoration.is-featured {
    transform: translate(34%, -50%) scale(1.25);
  }

  .make-seg__choiceIcon {
    position: relative;
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
    background: var(--make-accent-wash);
    color: var(--make-accent-strong);
    transition: background-color 0.3s ease;
  }

  .make-seg__choiceCard.is-featured .make-seg__choiceIcon {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
  }

  .make-seg__choiceCard:hover .make-seg__choiceIcon {
    background: var(--make-accent-mist);
  }

  .make-seg__choiceCard.is-featured:hover .make-seg__choiceIcon {
    background: rgba(255, 255, 255, 0.2);
  }

  .make-seg__choiceTitle {
    margin: 0 0 12px;
    font-size: 28px;
    line-height: 1.1;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  }

  .make-seg__choiceText {
    margin: 0 0 32px;
    font-size: 16px;
    line-height: 1.6;
    color: var(--make-text-soft);
  }

  .make-seg__choiceCard.is-featured .make-seg__choiceText {
    color: rgba(255, 255, 255, 0.7);
  }

  .make-seg__choiceLink {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    line-height: 1;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--make-accent-strong);
  }

  .make-seg__linkButton {
    border: none;
    background: transparent;
    padding: 0;
    font: inherit;
    cursor: pointer;
  }

  .make-seg__linkButton:focus-visible {
    outline: 2px solid var(--make-accent-soft);
    outline-offset: 4px;
    border-radius: 999px;
  }

  .make-seg__choiceCard.is-featured .make-seg__choiceLink {
    color: rgba(255, 255, 255, 0.9);
  }

  .make-seg__methodPreference {
    margin-top: 28px;
    padding: 22px 24px;
    border: 1px solid var(--make-line-soft);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  }

  .make-seg__methodPreferenceCopy {
    flex: 1 1 420px;
  }

  .make-seg__methodPreferenceTitle {
    margin: 0 0 8px;
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--make-accent-strong);
  }

  .make-seg__methodPreferenceText {
    margin: 0;
    color: var(--make-text-soft);
    line-height: 1.7;
  }

  .make-seg__miniToggle {
    border: none;
    background: transparent;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    color: var(--make-text-soft);
  }

  .make-seg__miniToggleLabel {
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .make-seg__miniToggleTrack {
    width: 46px;
    height: 28px;
    padding: 3px;
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.24);
    display: inline-flex;
    align-items: center;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
  }

  .make-seg__miniToggleThumb {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: #ffffff;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.14);
    transition: transform 0.2s ease;
  }

  .make-seg__miniToggle.is-active .make-seg__miniToggleTrack {
    background: linear-gradient(90deg, var(--make-accent-soft) 0%, var(--make-accent) 100%);
    box-shadow: inset 0 0 0 1px rgba(29, 78, 216, 0.08);
  }

  .make-seg__miniToggle.is-active .make-seg__miniToggleThumb {
    transform: translateX(18px);
  }

  .make-seg__reviewSection {
    max-width: 1400px;
    margin: 0 auto;
    padding: 48px 48px 128px;
    animation: make-seg-fade-up 0.5s ease both;
  }

  .make-seg__reviewHeader {
    margin-bottom: 28px;
  }

  .make-seg__sectionTitle.is-review {
    margin-top: 0;
    font-size: clamp(28px, 3.5vw, 48px);
  }

  .make-seg__reviewLead {
    margin: 10px 0 0;
    max-width: 640px;
    color: var(--make-text-soft);
    font-size: 16px;
    line-height: 1.7;
    letter-spacing: 0.01em;
  }

  .make-seg__reviewMetaRow {
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .make-seg__reviewMetaItem {
    font-size: 12px;
    line-height: 1.6;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--make-text-soft);
  }

  .make-seg__reviewMetaBadge {
    min-height: 28px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid var(--make-attention-line);
    background: rgba(239, 246, 255, 0.92);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--make-attention);
  }

  .make-seg__reviewMetaBadge.is-strong {
    border-color: var(--make-review-strong-line);
    background: rgba(255, 251, 235, 0.94);
    color: var(--make-review-strong);
  }

  .make-seg__sourcePreview {
    margin-bottom: 28px;
    border: 1px solid var(--make-line-soft);
    border-radius: 20px;
    background: var(--make-surface);
    padding: 18px 24px 20px;
  }

  .make-seg__sourcePreviewBar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 14px;
  }

  .make-seg__sourcePreviewBarMain {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  .make-seg__sourceSummaryLabel {
    font-size: 13px;
    line-height: 1.2;
    color: var(--make-text-body);
  }

  .make-seg__sourceSummaryCount {
    font-size: 12px;
    line-height: 1.2;
    color: var(--make-text-faint);
  }

  .make-seg__sourcePreviewActions {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .make-seg__sourceViewButton {
    border: none;
    border-radius: 0;
    background: transparent;
    min-height: auto;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--make-text-soft);
    cursor: pointer;
    transition: color 0.2s ease, opacity 0.2s ease;
  }

  .make-seg__sourceViewButton:hover {
    color: var(--make-text-body);
  }

  .make-seg__sourceViewButton.is-active {
    color: var(--make-accent-strong);
  }

  .make-seg__sourceViewButton.is-subtle {
    color: var(--make-text-soft);
  }

  .make-seg__sourceViewButton.is-quiet {
    color: var(--make-text-soft);
    opacity: 0.72;
  }

  .make-seg__sourceViewButton.is-quiet:hover {
    opacity: 1;
    color: var(--make-text-body);
  }

  .make-seg__sourcePreviewText {
    overflow-y: auto;
    padding: 22px 24px;
    border: 1px solid rgba(203, 213, 225, 0.48);
    border-radius: 18px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 251, 255, 0.9) 100%);
    color: var(--make-text-body);
    line-height: 1.8;
    white-space: pre-wrap;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.74);
  }

  .make-seg__sourcePreview.is-peek .make-seg__sourcePreviewText {
    max-height: 96px;
  }

  .make-seg__sourcePreview.is-expanded .make-seg__sourcePreviewText {
    max-height: 280px;
  }

  .make-seg__sourcePreview.is-collapsed .make-seg__sourcePreviewText {
    display: none;
  }

  .make-seg__reviewGrid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 28px;
    align-items: stretch;
  }

  @media (min-width: 1024px) {
    .make-seg__reviewGrid {
      grid-template-columns: minmax(280px, 0.92fr) minmax(0, 1.68fr);
    }
  }

  .make-seg__markerPanel {
    border: 1px solid var(--make-line-soft);
    border-radius: 20px;
    background: var(--make-surface);
    padding: 24px;
    min-height: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 18px 36px rgba(15, 23, 42, 0.04);
  }

  .make-seg__markerHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
  }

  .make-seg__markerHeaderTitle {
    margin: 0;
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--make-text-soft);
  }

  .make-seg__markerMeta {
    margin: 0 0 14px;
    font-size: 12px;
    line-height: 1.6;
    color: var(--make-text-faint);
  }

  .make-seg__iconButton {
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 10px;
    background: var(--make-accent-wash);
    color: var(--make-accent-strong);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .make-seg__iconButton:hover {
    background: var(--make-accent-mist);
  }

  .make-seg__markerList {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0 -12px;
    padding: 0 12px 2px;
  }

  .make-seg__markerRow {
    position: relative;
    padding: 16px 16px;
    border-radius: 16px;
    border: 1px solid transparent;
    transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
  }

  .make-seg__markerRow:hover {
    border-color: rgba(37, 99, 235, 0.14);
    background: rgba(37, 99, 235, 0.04);
  }

  .make-seg__markerRow.is-flagged {
    border-color: var(--make-attention-line);
    background: rgba(239, 246, 255, 0.82);
  }

  .make-seg__markerRow.is-strong-review {
    border-color: var(--make-review-strong-line);
    background: rgba(255, 251, 235, 0.92);
    box-shadow: 0 10px 24px rgba(217, 119, 6, 0.08);
  }

  .make-seg__markerRow.is-muted {
    opacity: 0.42;
  }

  .make-seg__markerRowInner {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .make-seg__markerBody {
    min-width: 0;
    flex: 1 1 auto;
  }

  .make-seg__markerLabelRow {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .make-seg__flagDot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--make-attention);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.14);
    flex: 0 0 auto;
  }

  .make-seg__markerIndex {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background: var(--make-accent-wash);
    color: var(--make-accent-strong);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    line-height: 1;
    flex: 0 0 auto;
  }

  .make-seg__markerRow.is-flagged .make-seg__markerIndex {
    background: rgba(239, 246, 255, 0.92);
    color: var(--make-attention);
  }

  .make-seg__markerInput {
    border: none;
    background: transparent;
    border-radius: 0;
    padding: 0;
    font-size: 14px;
    line-height: 1.4;
  }

  .make-seg__markerInput:focus {
    box-shadow: none;
  }

  .make-seg__markerTopic {
    margin-top: 6px;
    font-size: 11px;
    line-height: 1.4;
    color: var(--make-text-faint);
  }

  .make-seg__markerRemove {
    opacity: 0;
    border: none;
    background: transparent;
    color: rgba(0, 0, 0, 0.25);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.2s ease, color 0.2s ease;
    flex: 0 0 auto;
  }

  .make-seg__markerRow:hover .make-seg__markerRemove {
    opacity: 1;
  }

  .make-seg__markerRemove:hover {
    color: #f87171;
  }

  .make-seg__segmentStack {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .make-seg__reviewOutput {
    border-radius: 20px;
    border: 1px solid var(--make-line-soft);
    background: var(--make-surface);
    overflow: hidden;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 18px 36px rgba(15, 23, 42, 0.04);
  }

  .make-seg__reviewOutputBar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(203, 213, 225, 0.54);
    background: rgba(248, 251, 255, 0.92);
  }

  .make-seg__reviewOutputActions {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    justify-content: flex-end;
    flex-wrap: wrap;
    margin-left: auto;
  }

  .make-seg__reviewOutputBody {
    overflow: visible;
    padding: 20px;
    flex: 1 1 auto;
  }

  .make-seg__reviewOutputMeta {
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--make-text-faint);
  }

  .make-seg__segmentCard {
    border-radius: 16px;
    border: 1px solid var(--make-line-soft);
    overflow: hidden;
    background: var(--make-surface);
    animation: make-seg-fade-up 0.4s ease both;
  }

  .make-seg__segmentCardHeader {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    border-bottom: 1px solid rgba(203, 213, 225, 0.54);
    background: var(--make-surface-soft);
  }

  .make-seg__segmentCard.is-flagged {
    border-color: var(--make-attention-line);
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.08);
    background: rgba(239, 246, 255, 0.72);
  }

  .make-seg__segmentCard.is-flagged .make-seg__segmentCardHeader {
    background: rgba(239, 246, 255, 0.95);
    border-bottom-color: rgba(37, 99, 235, 0.14);
  }

  .make-seg__segmentCard.is-strong-review {
    border-color: var(--make-review-strong-line);
    background: rgba(255, 251, 235, 0.82);
    box-shadow: 0 12px 28px rgba(217, 119, 6, 0.1);
  }

  .make-seg__segmentCard.is-strong-review .make-seg__segmentCardHeader {
    background: rgba(255, 247, 237, 0.98);
    border-bottom-color: rgba(245, 158, 11, 0.18);
  }

  .make-seg__segmentHeaderText {
    min-width: 0;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .make-seg__segmentBullet {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background: var(--make-accent);
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    line-height: 1;
    flex: 0 0 auto;
  }

  .make-seg__segmentCard.is-flagged .make-seg__segmentBullet {
    background: var(--make-attention);
  }

  .make-seg__segmentSignal {
    min-height: 24px;
    padding: 0 10px;
    border-radius: 999px;
    border: 1px solid var(--make-attention-line);
    background: rgba(239, 246, 255, 0.96);
    color: var(--make-attention);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .make-seg__segmentSignal.is-strong {
    border-color: var(--make-review-strong-line);
    background: rgba(255, 251, 235, 0.96);
    color: var(--make-review-strong);
  }

  .make-seg__focusButton {
    min-height: 30px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid var(--make-line-soft);
    background: rgba(255, 255, 255, 0.9);
    color: var(--make-text-soft);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;
  }

  .make-seg__focusButton:hover {
    border-color: var(--make-line-strong);
    color: var(--make-text-body);
  }

  .make-seg__focusButton.is-active {
    border-color: var(--make-attention-line);
    background: rgba(239, 246, 255, 0.92);
    color: var(--make-attention);
  }

  .make-seg__segmentLabel {
    font-size: 12px;
    line-height: 1.2;
    letter-spacing: 0.08em;
    color: var(--make-text-soft);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .make-seg__segmentTopic {
    font-size: 11px;
    line-height: 1.3;
    color: var(--make-text-faint);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .make-seg__segmentText {
    padding: 20px 24px;
    color: var(--make-text-body);
    line-height: 1.85;
    margin: 0;
  }

  .make-seg__reviewActionArea {
    position: relative;
    z-index: 1;
    margin: 48px auto 0;
    width: min(100%, 560px);
    padding-top: 28px;
    border-top: 1px solid rgba(203, 213, 225, 0.72);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 14px;
    text-align: center;
  }

  .make-seg__reviewActionSummary {
    min-width: 0;
    text-align: center;
  }

  .make-seg__reviewActionEyebrow {
    margin: 0 0 12px;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--make-success);
  }

  .make-seg__reviewActionTitle {
    margin: 0 0 10px;
    font-size: clamp(26px, 3vw, 40px);
    line-height: 1;
    color: var(--make-text-strong);
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  }

  .make-seg__reviewActionText {
    margin: 0;
    color: var(--make-text-soft);
    line-height: 1.7;
    font-size: 16px;
    letter-spacing: 0.01em;
    max-width: 460px;
  }

  .make-seg__reviewActionArea .make-seg__primaryButton {
    min-width: 280px;
    justify-content: center;
  }

  @media (max-width: 900px) {
    .make-seg__reviewActionArea {
      width: min(100%, 420px);
    }

    .make-seg__reviewActionArea .make-seg__primaryButton {
      min-width: 0;
      width: 100%;
    }
  }

  .make-seg__transitionPage,
  .make-seg__readyPage {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 72px 48px 88px;
    animation: make-seg-fade-up 0.45s ease both;
  }

  .make-seg__transitionShell,
  .make-seg__readyShell {
    border: 1px solid var(--make-line-soft);
    border-radius: 32px;
    background: rgba(255, 255, 255, 0.78);
    backdrop-filter: blur(18px);
    box-shadow: var(--make-shadow-soft);
    overflow: hidden;
  }

  .make-seg__transitionShell {
    padding: 48px;
    background:
      radial-gradient(circle at 18% 18%, rgba(219, 234, 254, 0.68), transparent 22%),
      radial-gradient(circle at 82% 22%, rgba(191, 219, 254, 0.42), transparent 18%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(248, 251, 255, 0.88) 100%);
  }

  .make-seg__transitionHeader,
  .make-seg__readyHeader {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 36px;
  }

  .make-seg__transitionHeader .make-seg__sectionLead,
  .make-seg__readyHeader .make-seg__sectionLead {
    margin: 0;
    max-width: 620px;
  }

  .make-seg__transitionVisual {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) 180px minmax(320px, 0.95fr);
    gap: 28px;
    align-items: stretch;
  }

  .make-seg__transitionSource,
  .make-seg__transitionPreview,
  .make-seg__readyPreview,
  .make-seg__readySummary {
    border: 1px solid var(--make-line-soft);
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.9);
    overflow: hidden;
  }

  .make-seg__transitionPanelBar,
  .make-seg__readyPanelBar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(203, 213, 225, 0.54);
    background: rgba(248, 251, 255, 0.92);
  }

  .make-seg__transitionPanelTitle {
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--make-text-soft);
  }

  .make-seg__transitionSourceBody {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .make-seg__transitionSourceParagraph {
    position: relative;
    padding: 18px 20px;
    border-radius: 18px;
    background: rgba(248, 251, 255, 0.88);
    border: 1px solid rgba(226, 232, 240, 0.92);
    animation: make-seg-fade-up 0.4s ease both;
  }

  .make-seg__transitionSourceParagraph:nth-child(1) { animation-delay: 0.08s; }
  .make-seg__transitionSourceParagraph:nth-child(2) { animation-delay: 0.16s; }
  .make-seg__transitionSourceParagraph:nth-child(3) { animation-delay: 0.24s; }

  .make-seg__transitionSourceText {
    margin: 0;
    color: var(--make-text-body);
    line-height: 1.75;
  }

  .make-seg__transitionMarker {
    position: absolute;
    right: -12px;
    width: 22px;
    height: 22px;
    border-radius: 999px;
    border: 1px solid rgba(147, 197, 253, 0.84);
    background: rgba(239, 246, 255, 0.98);
    color: var(--make-accent-strong);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.12);
    animation: make-seg-marker-pulse 1.8s ease-in-out infinite;
  }

  .make-seg__transitionMarker.is-top { top: 20%; }
  .make-seg__transitionMarker.is-mid { top: 46%; animation-delay: 0.3s; }
  .make-seg__transitionMarker.is-bottom { top: 72%; animation-delay: 0.6s; }

  .make-seg__transitionBridge {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
  }

  .make-seg__transitionBridgeCore {
    position: relative;
    width: 112px;
    height: 112px;
    border-radius: 999px;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.96) 0%, rgba(219, 234, 254, 0.92) 24%, rgba(37, 99, 235, 0.16) 100%);
    border: 1px solid rgba(147, 197, 253, 0.92);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--make-accent-strong);
    box-shadow: 0 22px 48px rgba(37, 99, 235, 0.16);
  }

  .make-seg__transitionBridgePulse,
  .make-seg__transitionBridgePulse::after {
    content: "";
    position: absolute;
    inset: -14px;
    border-radius: 999px;
    border: 1px solid rgba(147, 197, 253, 0.34);
    animation: make-seg-bridge-pulse 2.4s ease-out infinite;
  }

  .make-seg__transitionBridgePulse::after {
    inset: -28px;
    animation-delay: 0.9s;
  }

  .make-seg__transitionBeam {
    position: absolute;
    top: 50%;
    width: 140px;
    height: 1px;
    background: linear-gradient(90deg, rgba(37, 99, 235, 0.18) 0%, rgba(37, 99, 235, 0.36) 50%, rgba(37, 99, 235, 0.18) 100%);
    opacity: 0.8;
  }

  .make-seg__transitionBeam.is-left {
    right: 50%;
    transform: translateY(-50%);
  }

  .make-seg__transitionBeam.is-right {
    left: 50%;
    transform: translateY(-50%);
  }

  .make-seg__transitionChip {
    position: absolute;
    left: 18px;
    min-width: 88px;
    padding: 10px 14px;
    border-radius: 999px;
    border: 1px solid rgba(147, 197, 253, 0.88);
    background: rgba(255, 255, 255, 0.94);
    color: var(--make-accent-strong);
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
    animation: make-seg-chip-flight 2.1s ease-in-out infinite;
  }

  .make-seg__transitionChip.is-two {
    top: 44%;
    animation-delay: 0.3s;
  }

  .make-seg__transitionChip.is-one {
    top: 28%;
  }

  .make-seg__transitionChip.is-three {
    top: 60%;
    animation-delay: 0.6s;
  }

  .make-seg__transitionSourceLine {
    height: 14px;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(148, 163, 184, 0.16) 0%, rgba(37, 99, 235, 0.2) 48%, rgba(148, 163, 184, 0.16) 100%);
    background-size: 220% 100%;
    animation: make-seg-shimmer 1.8s ease-in-out infinite;
  }

  .make-seg__transitionSourceLine.is-short {
    width: 62%;
  }

  .make-seg__transitionPreviewBody,
  .make-seg__readyPreviewBody {
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .make-seg__transitionSegment,
  .make-seg__readySegment {
    border-radius: 18px;
    border: 1px solid rgba(191, 219, 254, 0.72);
    background: rgba(239, 246, 255, 0.78);
    padding: 16px 18px;
    animation: make-seg-fade-up 0.45s ease both;
  }

  .make-seg__transitionSegment:nth-child(1) { animation-delay: 0.12s; }
  .make-seg__transitionSegment:nth-child(2) { animation-delay: 0.2s; }
  .make-seg__transitionSegment:nth-child(3) { animation-delay: 0.28s; }

  .make-seg__transitionSegmentLabel,
  .make-seg__readySegmentLabel {
    margin: 0 0 6px;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--make-accent-strong);
  }

  .make-seg__transitionSegmentText,
  .make-seg__readySegmentText {
    margin: 0;
    color: var(--make-text-body);
    line-height: 1.7;
  }

  .make-seg__transitionActions,
  .make-seg__readyActions {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .make-seg__readyShell {
    padding: 44px 44px 36px;
  }

  .make-seg__readyGrid {
    display: grid;
    grid-template-columns: minmax(320px, 0.95fr) minmax(0, 1.2fr);
    gap: 28px;
    align-items: start;
  }

  .make-seg__readySummary {
    padding: 28px;
  }

  .make-seg__readySummaryTitle {
    margin: 0 0 10px;
    font-size: clamp(28px, 3vw, 40px);
    line-height: 1;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    color: var(--make-text-strong);
  }

  .make-seg__readySummaryText {
    margin: 0 0 22px;
    color: var(--make-text-soft);
    line-height: 1.7;
  }

  .make-seg__readyStats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 28px;
  }

  .make-seg__readyStat {
    padding: 14px 16px;
    border-radius: 16px;
    background: rgba(248, 251, 255, 0.92);
    border: 1px solid var(--make-line-soft);
  }

  .make-seg__readyStatLabel {
    margin: 0 0 6px;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--make-text-soft);
  }

  .make-seg__readyStatValue {
    margin: 0;
    color: var(--make-text-strong);
    font-size: 16px;
    line-height: 1.3;
  }

  .make-seg__approveStage {
    margin-top: 64px;
    padding-top: 48px;
    border-top: 1px solid var(--make-line);
  }

  .make-seg__approveInner {
    max-width: 520px;
    margin: 0 auto;
    text-align: center;
    animation: make-seg-fade-up 0.45s ease both;
  }

  .make-seg__approvePill {
    margin-bottom: 24px;
  }

  .make-seg__approveTitle {
    margin: 0 0 12px;
    font-size: clamp(24px, 3vw, 36px);
    line-height: 1.1;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  }

  .make-seg__approveText {
    margin: 0 0 32px;
    color: var(--make-text-soft);
    line-height: 1.7;
  }

  .make-seg__compilingPage,
  .make-seg__successPage {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
  }

  .make-seg__compilingPage {
    min-height: calc(100vh - var(--make-workspace-header-height));
    width: 100%;
  }

  .make-seg__transitionPage {
    width: 100%;
    min-height: calc(100vh - var(--make-workspace-header-height));
    display: flex;
    align-items: center;
  }

  .make-seg__successPage {
    min-height: calc(100vh - var(--make-workspace-header-height));
    width: 100%;
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(circle at 16% 18%, rgba(219, 234, 254, 0.78), transparent 28%),
      linear-gradient(135deg, var(--make-bg-top) 0%, var(--make-surface-tint) 50%, var(--make-bg-bottom) 100%);
  }

  .make-seg__compilingInner,
  .make-seg__successInner {
    width: 100%;
    text-align: center;
  }

  .make-seg__compilingInner {
    animation: make-seg-scale-in 0.4s ease both;
  }

  .make-seg__successInner {
    max-width: 800px;
    animation: make-seg-fade-up 0.8s ease both;
    position: relative;
    z-index: 1;
  }

  .make-seg__successHero {
    margin-bottom: 64px;
  }

  .make-seg__compilingSeal {
    animation: make-seg-spin 1s linear infinite;
  }

  .make-seg__compilingTitle {
    margin: 0 0 16px;
    font-size: 48px;
    line-height: 1.1;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  }

  .make-seg__compilingText {
    margin: 0;
    color: var(--make-text-soft);
    font-size: 18px;
  }

  .make-seg__successTitle {
    font-size: 72px;
    line-height: 0.95;
  }

  .make-seg__successBadge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 999px;
    border: 1px solid var(--make-line-soft);
    background: rgba(255, 255, 255, 0.92);
    font-size: 14px;
  }

  .make-seg__successLink {
    border: none;
    background: transparent;
    color: var(--make-text-soft);
    font-size: 13px;
    line-height: 1;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: color 0.2s ease, transform 0.2s ease;
  }

  .make-seg__successLink:hover {
    color: var(--make-accent-strong);
    transform: translateY(-1px);
  }

  .make-seg__successSecondary {
    margin-top: 18px;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .make-seg__successSecondaryMeta {
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--make-text-faint);
  }

  .make-seg__successDivider {
    margin-top: 80px;
    padding-top: 40px;
    border-top: 1px solid var(--make-line);
  }

  .make-seg__successStats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 40px;
    text-align: center;
  }

  .make-seg__successStat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    min-height: 88px;
  }

  .make-seg__successStatLabel {
    margin: 0;
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--make-text-soft);
  }

  .make-seg__successStatValue {
    margin: 0;
    font-size: 18px;
    line-height: 1.2;
    font-weight: 500;
    color: var(--make-text-body);
  }

  .make-seg__staggerDelay-1 { animation-delay: 0.05s; }
  .make-seg__staggerDelay-2 { animation-delay: 0.1s; }
  .make-seg__staggerDelay-3 { animation-delay: 0.15s; }
  .make-seg__staggerDelay-4 { animation-delay: 0.2s; }
  .make-seg__staggerDelay-5 { animation-delay: 0.25s; }

  @keyframes make-seg-fade-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes make-seg-expand {
    from {
      opacity: 0;
      transform: scaleY(0.92);
      transform-origin: top;
    }

    to {
      opacity: 1;
      transform: scaleY(1);
    }
  }

  @keyframes make-seg-scale-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes make-seg-shimmer {
    from {
      background-position: 100% 0;
    }

    to {
      background-position: -100% 0;
    }
  }

  @keyframes make-seg-spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  @keyframes make-seg-chip-flight {
    0% {
      opacity: 0;
      transform: translate3d(0, 0, 0) scale(0.88);
    }

    18% {
      opacity: 1;
    }

    55% {
      opacity: 1;
      transform: translate3d(66px, 0, 0) scale(1);
    }

    100% {
      opacity: 0;
      transform: translate3d(128px, 0, 0) scale(0.92);
    }
  }

  @keyframes make-seg-bridge-pulse {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }

    18% {
      opacity: 0.55;
    }

    100% {
      opacity: 0;
      transform: scale(1.16);
    }
  }

  @keyframes make-seg-marker-pulse {
    0%,
    100% {
      transform: scale(1);
      box-shadow: 0 10px 24px rgba(37, 99, 235, 0.12);
    }

    50% {
      transform: scale(1.08);
      box-shadow: 0 14px 32px rgba(37, 99, 235, 0.2);
    }
  }

  @media (max-width: 1280px) {
    .make-seg__cardGrid,
    .make-seg__choiceGrid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 900px) {
    .make-seg__headerInner,
    .make-seg__headerInner.is-workspace,
    .make-seg__main,
    .make-seg__workspaceMain,
    .make-seg__workspaceContent,
    .make-seg__workspaceSection,
    .make-seg__choiceSection,
    .make-seg__reviewSection {
      padding-left: 24px;
      padding-right: 24px;
    }

    .make-seg__heroTitle,
    .make-seg__successTitle {
      font-size: 52px;
    }

    .make-seg__cardGrid,
    .make-seg__choiceGrid,
    .make-seg__successStats,
    .make-seg__readyStats {
      grid-template-columns: 1fr;
    }

    .make-seg__headerActions {
      gap: 12px;
    }

    .make-seg__headerAside {
      width: 100%;
      justify-content: space-between;
    }

    .make-seg__pasteStageOrnament {
      display: none;
    }

    .make-seg__stageAtmosphereWord {
      font-size: clamp(88px, 18vw, 132px);
    }

    .make-seg__pasteStageGrid {
      inset-inline: 36px;
    }

    .make-seg__pasteDecisionBar,
    .make-seg__methodPreference {
      padding: 18px;
    }

    .make-seg__transitionPage,
    .make-seg__readyPage {
      padding-left: 24px;
      padding-right: 24px;
    }

    .make-seg__transitionVisual,
    .make-seg__readyGrid {
      grid-template-columns: 1fr;
    }

    .make-seg__headerAside {
      justify-self: stretch;
    }

  }

  @media (max-width: 640px) {
    .make-seg__headerInner,
    .make-seg__headerInner.is-workspace {
      padding-top: 16px;
      padding-bottom: 16px;
    }

    .make-seg__heroTitle,
    .make-seg__successTitle,
    .make-seg__savedTitle,
    .make-seg__compilingTitle {
      font-size: 40px;
    }

    .make-seg__stageAtmosphereWord {
      display: none;
    }

    .make-seg__projectCard,
    .make-seg__newProjectCard {
      min-height: 240px;
      padding: 24px;
    }

    .make-seg__choiceCard {
      min-height: 280px;
      padding: 28px;
    }

    .make-seg__transitionShell,
    .make-seg__readyShell {
      padding: 24px;
    }

    .make-seg__primaryButton.is-segmentation {
      min-width: 0;
      width: calc(100vw - 144px);
    }

    .make-seg__splitMenu {
      width: min(320px, calc(100vw - 48px));
      right: 50%;
      transform: translateX(50%);
    }

    .make-seg__pasteCanvas {
      padding-inline: 12px;
    }

    .make-seg__pasteLayer.is-back,
    .make-seg__pasteLayer.is-mid,
    .make-seg__pasteStageGrid {
      display: none;
    }

    .make-seg__editorTopbar--feature {
      flex-direction: column;
      align-items: flex-start;
    }

    .make-seg__editorMetaPill {
      align-self: stretch;
      justify-content: flex-start;
    }

    .make-seg__pasteDecisionActions {
      width: 100%;
      justify-content: space-between;
    }

  }
`;

const homeProjects = [
  { id: '1', name: "Jumu'ah", segment: '2.1.1', status: 'Legal Status', logged: '03:20' },
  { id: '2', name: 'Purity', segment: '1.3', status: 'Ghusl', logged: '01:45' },
  { id: '3', name: 'Fasting', segment: 'BTC 03', status: 'Preserved Archive', logged: '00:52' },
];

const workspaceSeedByProject = {
  '1': '',
  '2': '',
  '3': '',
  new: '',
};

const savedMethodStorageKey = 'arapal.segmentation.defaultMethod';
const quickModeStorageKey = 'arapal.segmentation.quickMode';
const transitionPreferenceStorageKey = 'arapal.segmentation.showTransition';
const segmentationStyleStorageKey = 'arapal.segmentation.style';
const segmentationGranularityStorageKey = 'arapal.segmentation.granularity';
const workspaceSteps = [
  { id: 'paste', label: 'Source' },
  { id: 'segment', label: 'Segment' },
  { id: 'review', label: 'Review' },
];
const segmentationStyleOptions = [
  { id: 'sentence', label: 'Sentence', meta: 'Split close to sentence boundaries' },
  { id: 'meaning', label: 'Meaning groups', meta: 'Keep small ideas together' },
  { id: 'topic', label: 'Topic-led', meta: 'Group around sub-topic shifts' },
];
const segmentationGranularityOptions = [
  { id: 'tight', label: 'Tighter', meta: 'Smaller, more frequent segments' },
  { id: 'balanced', label: 'Balanced', meta: 'Default balance for most texts' },
  { id: 'broad', label: 'Broader', meta: 'Fewer, larger sections' },
];
const demoReviewMarkers = [
  {
    id: '1',
    position: 0,
    label: 'Opening appeal',
    text: 'The passage opens with a call to patience, reminding the reader that understanding grows through steady return rather than hurried completion.',
    topic: 'Opening',
    reviewState: null,
    needsReview: false,
  },
  {
    id: '2',
    position: 1,
    label: 'Market trust',
    text: 'It then shifts to the marketplace, where honest speech and accurate measures are presented as the foundation of public trust.',
    topic: 'Commerce',
    reviewState: null,
    needsReview: false,
  },
  {
    id: '3',
    position: 2,
    label: 'Public record',
    text: 'A dense legal aside explains that witnesses, contracts, and public record all exist to stop private gain from outrunning public responsibility when memory, distance, and authority begin to blur the truth.',
    topic: 'Contracts',
    reviewState: 'needs-review',
    needsReview: true,
  },
  {
    id: '4',
    position: 3,
    label: 'Early repair',
    text: 'The text pauses to note that small harms are easiest to repair when addressed early, quietly, and without humiliation.',
    topic: 'Repair',
    reviewState: null,
    needsReview: false,
  },
  {
    id: '5',
    position: 4,
    label: 'Traveller story',
    text: 'A short example about a traveller shows how generosity can preserve dignity without turning help into a visible debt.',
    topic: 'Travel',
    reviewState: null,
    needsReview: false,
  },
  {
    id: '6',
    position: 5,
    label: 'Teaching method',
    text: 'From there the author returns to teaching, saying wisdom is not only what one knows but how carefully it is divided and delivered.',
    topic: 'Teaching',
    reviewState: null,
    needsReview: false,
  },
  {
    id: '7',
    position: 6,
    label: 'Haste and clarity',
    text: 'A brief contrast between haste and clarity suggests that smaller units help the learner return without fear.',
    topic: 'Clarity',
    reviewState: null,
    needsReview: false,
  },
  {
    id: '8',
    position: 7,
    label: 'Boundary note',
    text: 'Boundary note: unresolved clause on inherited duties and unclear exceptions.',
    topic: 'Exception',
    reviewState: 'second-look',
    needsReview: true,
  },
  {
    id: '9',
    position: 8,
    label: 'Study order',
    text: 'The final movement gathers these ideas into a single instruction: separate what can be studied now from what should wait for deeper return.',
    topic: 'Study order',
    reviewState: null,
    needsReview: false,
  },
  {
    id: '10',
    position: 9,
    label: 'Closing reassurance',
    text: 'It closes by insisting that careful segmentation is not reduction, but the art of giving each idea enough room to be understood.',
    topic: 'Closing',
    reviewState: null,
    needsReview: false,
  },
];
const demoReviewText = demoReviewMarkers.map((marker) => marker.text).join('\n\n');

function createDemoReviewMarkers() {
  return demoReviewMarkers.map((marker) => ({ ...marker }));
}

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

function getMethodLabel(method) {
  return method === 'manual' ? 'Manual' : 'AI';
}

function getSegmentationStyleLabel(style) {
  return segmentationStyleOptions.find((option) => option.id === style)?.label || 'Meaning groups';
}

function getGranularityLabel(granularity) {
  return segmentationGranularityOptions.find((option) => option.id === granularity)?.label || 'Balanced';
}

function getProjectDisplayName(batchId) {
  if (!batchId || batchId === 'new') {
    return 'New project';
  }

  return homeProjects.find((project) => project.id === batchId)?.name || `Project ${batchId}`;
}

function readSavedMethod() {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem(savedMethodStorageKey);
  return stored === 'manual' || stored === 'ai' ? stored : null;
}

function writeSavedMethod(method) {
  if (typeof window === 'undefined') {
    return;
  }

  if (method) {
    window.localStorage.setItem(savedMethodStorageKey, method);
    return;
  }

  window.localStorage.removeItem(savedMethodStorageKey);
}

function readQuickModePreference() {
  if (typeof window === 'undefined') {
    return true;
  }

  const stored = window.localStorage.getItem(quickModeStorageKey);
  return stored === null ? true : stored === 'true';
}

function writeQuickModePreference(value) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(quickModeStorageKey, value ? 'true' : 'false');
}

function readTransitionPreference() {
  if (typeof window === 'undefined') {
    return true;
  }

  const stored = window.localStorage.getItem(transitionPreferenceStorageKey);
  return stored === null ? true : stored === 'true';
}

function writeTransitionPreference(value) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(transitionPreferenceStorageKey, value ? 'true' : 'false');
}

function readSegmentationStyle() {
  if (typeof window === 'undefined') {
    return 'meaning';
  }

  const stored = window.localStorage.getItem(segmentationStyleStorageKey);
  return segmentationStyleOptions.some((option) => option.id === stored) ? stored : 'meaning';
}

function writeSegmentationStyle(style) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(segmentationStyleStorageKey, style);
}

function readSegmentationGranularity() {
  if (typeof window === 'undefined') {
    return 'balanced';
  }

  const stored = window.localStorage.getItem(segmentationGranularityStorageKey);
  return segmentationGranularityOptions.some((option) => option.id === stored) ? stored : 'balanced';
}

function writeSegmentationGranularity(granularity) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(segmentationGranularityStorageKey, granularity);
}

function splitIntoSentences(text) {
  return (
    text
      .replace(/\s+/g, ' ')
      .match(/[^.!?]+(?:[.!?]+|$)/g)
      ?.map((sentence) => sentence.trim())
      .filter(Boolean) || []
  );
}

function splitIntoParagraphs(text) {
  return text
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function chunkUnits(units, size) {
  if (!units.length) {
    return [];
  }

  const chunks = [];
  for (let index = 0; index < units.length; index += size) {
    chunks.push(units.slice(index, index + size));
  }
  return chunks;
}

function getChunkSize(style, granularity) {
  if (style === 'sentence') {
    return granularity === 'tight' ? 1 : granularity === 'broad' ? 3 : 2;
  }

  return granularity === 'tight' ? 1 : granularity === 'broad' ? 3 : 2;
}

function deriveTopicLabel(text, index) {
  const words = text.trim().split(/\s+/).filter(Boolean).slice(0, 4);
  if (!words.length) {
    return `Theme ${index + 1}`;
  }

  return words.join(' ');
}

function getReviewState(text, style, granularity, totalCount) {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  if (!wordCount) {
    return null;
  }

  const lowerBound = style === 'sentence' ? 4 : 8;
  const upperBound =
    style === 'sentence'
      ? granularity === 'tight'
        ? 22
        : granularity === 'broad'
          ? 42
          : 32
      : granularity === 'tight'
        ? 45
        : granularity === 'broad'
          ? 110
          : 72;

  const strongLowerBound = Math.max(1, lowerBound - 3);
  const strongUpperBound = Math.round(upperBound * 1.35);

  if (wordCount < strongLowerBound || wordCount > strongUpperBound) {
    return 'needs-review';
  }

  if (wordCount < lowerBound || wordCount > upperBound) {
    return 'second-look';
  }

  return totalCount === 1 && wordCount > 40 ? 'needs-review' : null;
}

function getReviewSignalLabel(reviewState) {
  if (reviewState === 'needs-review') {
    return 'Needs review';
  }

  if (reviewState === 'second-look') {
    return 'Worth a look';
  }

  return '';
}

function generateMarkers(text, mode, style, granularity) {
  const cleanText = text.trim();
  if (!cleanText) {
    return [];
  }

  const baseUnits =
    style === 'sentence'
      ? splitIntoSentences(cleanText)
      : splitIntoParagraphs(cleanText).length > 1
        ? splitIntoParagraphs(cleanText)
        : splitIntoSentences(cleanText);

  const units = baseUnits.length ? baseUnits : [cleanText];
  const chunkSize = mode === 'manual' ? Math.max(1, getChunkSize(style, granularity)) : getChunkSize(style, granularity);
  const grouped = chunkUnits(units, chunkSize);
  let position = 0;

  return grouped.map((group, index) => {
    const segmentText = group.join(style === 'sentence' ? ' ' : '\n\n').trim();
    const topic = style === 'sentence' ? '' : deriveTopicLabel(segmentText, index);
    const reviewState = mode === 'ai' ? getReviewState(segmentText, style, granularity, grouped.length) : null;
    const marker = {
      id: String(index + 1),
      position,
      label: `Segment ${index + 1}`,
      text: segmentText,
      topic,
      reviewState,
      needsReview: Boolean(reviewState),
    };
    position += segmentText.length + 2;
    return marker;
  });
}

function SectionPill({ children, tone = 'default', className = '' }) {
  return (
    <div className={cn('make-seg__sectionPill', tone !== 'default' ? `is-${tone}` : '', className)}>
      <span className="make-seg__sectionDot" />
      {children}
    </div>
  );
}

function WindowButtons() {
  return (
    <div className="make-seg__windowButtons" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function InlineActionButton({ children, onClick, subtle = false }) {
  return (
    <button
      type="button"
      className={cn('make-seg__linkButton', 'make-seg__choiceLink', subtle ? 'is-subtle' : '')}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function PreviewStat({ label, value }) {
  return (
    <div>
      <span className="make-seg__previewStatLabel">{label}:</span> <strong>{value}</strong>
    </div>
  );
}

function StageAtmosphere() {
  return (
    <div className="make-seg__stageAtmosphere" aria-hidden="true">
      <div className="make-seg__stageAtmosphereLine is-leftSoft" />
      <div className="make-seg__stageAtmosphereLine is-leftStrong" />
      <div className="make-seg__stageAtmosphereLine is-rightSoft" />
      <div className="make-seg__stageAtmosphereLine is-rightStrong" />
      <div className="make-seg__stageAtmosphereWord is-left">Arapal</div>
      <div className="make-seg__stageAtmosphereWord is-right">Arapal</div>
    </div>
  );
}

function WorkspaceStage({ className = '', children }) {
  return (
    <section className={cn('make-seg__screenStage', className)}>
      <StageAtmosphere />
      {children}
    </section>
  );
}

function WorkspaceStepbar({ step }) {
  const progressStep =
    step === 'method'
      ? 'paste'
      : step === 'compiling' || step === 'segmenting'
        ? 'segment'
        : step === 'review'
          ? 'review'
          : step;
  const currentIndex = workspaceSteps.findIndex((item) => item.id === progressStep);

  return (
    <div className="make-seg__workspaceStepbar">
      {workspaceSteps.map((item, index) => {
        const state = currentIndex === index ? 'current' : currentIndex > index ? 'complete' : 'pending';

        return (
          <div key={item.id} className={`make-seg__stepItem is-${state}`}>
            <div className={`make-seg__stepBullet is-${state}`}>
              {state === 'complete' ? <Check size={12} strokeWidth={1.9} /> : index + 1}
            </div>
            {state === 'current' ? <span className="make-seg__stepLabel">{item.label}</span> : null}
            {index < workspaceSteps.length - 1 ? <div className="make-seg__stepLine" /> : null}
          </div>
        );
      })}
    </div>
  );
}

function PasteStageOrnament({ side }) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={`make-seg__pasteStageOrnament is-${side}`}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="80" cy="80" r="16" fill="rgba(37, 99, 235, 0.08)" stroke="rgba(37, 99, 235, 0.18)" />
      <circle cx="80" cy="80" r="34" stroke="rgba(148, 163, 184, 0.18)" />
      <circle cx="80" cy="80" r="56" stroke="rgba(191, 219, 254, 0.34)" strokeDasharray="4 8" />
      <circle cx="34" cy="42" r="5" fill="rgba(37, 99, 235, 0.22)" />
      <circle cx="126" cy="34" r="4" fill="rgba(148, 163, 184, 0.24)" />
      <circle cx="132" cy="118" r="6" fill="rgba(37, 99, 235, 0.14)" />
      <circle cx="28" cy="120" r="4" fill="rgba(148, 163, 184, 0.22)" />
      <path d="M80 80L34 42M80 80L126 34M80 80L132 118M80 80L28 120" stroke="rgba(148, 163, 184, 0.2)" />
    </svg>
  );
}

function HomeScreen({ onReplayIntro, onOpenProject, onOpenSourceIntake, onOpenProjects, onOpenWorkspace }) {
  return (
    <div className="make-seg__page">
      <header className="make-seg__header">
        <div className="make-seg__headerInner">
          <div className="make-seg__brand">
            <div className="make-seg__brandMark">
              <Sparkles size={18} strokeWidth={1.9} />
            </div>
            <div>
              <p className="make-seg__brandName">Arapal</p>
              <p className="make-seg__brandMeta">Segments</p>
            </div>
          </div>

          <div className="make-seg__headerActions">
            <button type="button" className="make-seg__headerPill" onClick={onReplayIntro}>
              Replay Intro
            </button>
            <button type="button" className="make-seg__headerPill" onClick={onOpenProjects}>
              Projects →
            </button>
            <button type="button" className="make-seg__headerPill" onClick={() => onOpenWorkspace('3')}>
              Segmentation →
            </button>
          </div>
        </div>
      </header>

      <main className="make-seg__main">
        <section className="make-seg__hero">
          <h1 className="make-seg__heroTitle">Pick up where you left off</h1>
          <p className="make-seg__heroText">Continue your segmentation journey or start something new</p>
        </section>

        <section className="make-seg__cardGrid">
          {homeProjects.map((project) => (
            <article key={project.id} className="make-seg__projectCard" onClick={() => onOpenProject(project.id)}>
              <div className="make-seg__projectMeta">
                <div className="make-seg__chip">AR</div>
                <div className="make-seg__projectCode">{project.segment}</div>
              </div>

              <h2 className="make-seg__projectTitle">{project.name}</h2>

              <div className="make-seg__projectFooter">
                <div>
                  <p className="make-seg__projectLabel">Status</p>
                  <p className="make-seg__projectValue">{project.status}</p>
                </div>
                <div className="make-seg__metaAlignEnd">
                  <p className="make-seg__projectLabel">Logged</p>
                  <p className="make-seg__projectValue">{project.logged}</p>
                </div>
              </div>

              <div className="make-seg__arrowCue">
                <ArrowRight size={16} strokeWidth={1.9} />
              </div>
            </article>
          ))}

          <article className="make-seg__newProjectCard" onClick={onOpenSourceIntake}>
            <div className="make-seg__newProjectIcon">
              <Plus size={48} strokeWidth={1.6} />
            </div>
            <h3 className="make-seg__newProjectTitle">Initiate New Protocol</h3>
            <p className="make-seg__newProjectText">
              Deploy a pristine environment. Import initial parameters upon readiness.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}

function SourceIntakeScreen({ initialBatchName = '', initialSourceText = '', onReturnHome, onSegmentNow }) {
  const [batchName, setBatchName] = useState(initialBatchName);
  const [sourceText, setSourceText] = useState(initialSourceText);
  const [isSaved, setIsSaved] = useState(false);

  const wordCount = useMemo(() => sourceText.trim().split(/\s+/).filter(Boolean).length, [sourceText]);
  const characterCount = sourceText.length;
  const isLarge = characterCount > 10000;

  const handleSave = () => {
    if (batchName && sourceText) {
      setIsSaved(true);
    }
  };

  return (
    <div className="make-seg__page">
      <header className="make-seg__header">
        <div className="make-seg__headerInner is-workspace">
          <button type="button" className="make-seg__headerPill" onClick={onReturnHome}>
            <ArrowLeft size={16} strokeWidth={1.9} />
            Return Home
          </button>

          <div className="make-seg__brand">
            <div className="make-seg__brandMark is-small">
              <Sparkles size={16} strokeWidth={1.9} />
            </div>
            <p className="make-seg__brandName is-inline">Source Intake</p>
          </div>
        </div>
      </header>

      <main className="make-seg__workspaceMain">
        {!isSaved ? (
          <div className="make-seg__centerStage">
            <SectionPill>Step 1</SectionPill>
            <h1 className="make-seg__sectionTitle">Preserve your source</h1>
            <p className="make-seg__sectionLead">
              Raw text, safely stored before any processing begins
            </p>

            <div className="make-seg__fieldGroup is-offset">
              <label className="make-seg__fieldLabel">Batch Label</label>
              <input
                type="text"
                value={batchName}
                onChange={(event) => setBatchName(event.target.value)}
                placeholder="Enter a memorable name for this batch..."
                className="make-seg__fieldInput"
              />
            </div>

            <div className="make-seg__fieldGroup">
              <label className="make-seg__fieldLabel">Raw Source Text</label>
              <textarea
                value={sourceText}
                onChange={(event) => setSourceText(event.target.value)}
                placeholder="Paste your text here. This will be preserved as an immutable source..."
                className="make-seg__fieldTextarea"
              />
            </div>

            {sourceText ? (
              <div className="make-seg__previewCard">
                <div className="make-seg__previewHeader">
                  <FileText size={20} strokeWidth={1.9} className="make-seg__accentIcon" />
                  <div>
                    <p className="make-seg__previewTitle">Preview</p>
                    <div className="make-seg__previewStats">
                      <PreviewStat label="Words" value={wordCount.toLocaleString()} />
                      <PreviewStat label="Characters" value={characterCount.toLocaleString()} />
                      <PreviewStat label="Name" value={batchName || 'Unnamed'} />
                    </div>
                  </div>
                </div>

                {isLarge ? (
                  <div className="make-seg__warning">
                    <AlertCircle size={16} strokeWidth={1.9} />
                    <div>This text appears unusually large. Processing may take longer than usual.</div>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="make-seg__actionsCentered">
              <button
                type="button"
                className="make-seg__primaryButton"
                disabled={!batchName || !sourceText}
                onClick={handleSave}
              >
                <Save size={16} strokeWidth={1.9} />
                Save Immutable Source
              </button>
            </div>
          </div>
        ) : (
          <div className="make-seg__savedState">
            <div className="make-seg__savedSeal">
              <Save size={40} strokeWidth={1.8} />
            </div>
            <h2 className="make-seg__savedTitle">Source Preserved</h2>
            <p className="make-seg__savedText">
              Your text is safely stored. What would you like to do next?
            </p>

            <div className="make-seg__buttonRow">
              <button
                type="button"
                className="make-seg__primaryButton"
                onClick={() => onSegmentNow({ batchId: 'new', batchName, sourceText })}
              >
                Segment Now
              </button>
              <button type="button" className="make-seg__ghostButton" onClick={onReturnHome}>
                Return to Home
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function SegmentationWorkspaceScreen({
  batchId,
  initialText = '',
  onBackHome,
  onStartStudying,
  onSegmentationComplete,
}) {
  const useDemoReviewSeed = !initialText.trim();
  const [rawText, setRawText] = useState(useDemoReviewSeed ? demoReviewText : initialText);
  const [step, setStep] = useState(useDemoReviewSeed ? 'review' : 'paste');
  const [markers, setMarkers] = useState(() => (useDemoReviewSeed ? createDemoReviewMarkers() : []));
  const [segmentMode, setSegmentMode] = useState('ai');
  const [sourcePanelMode, setSourcePanelMode] = useState('peek');
  const [savedMethod, setSavedMethod] = useState(() => readSavedMethod());
  const [quickMode, setQuickMode] = useState(() => readQuickModePreference());
  const [showSegmentationTransition, setShowSegmentationTransition] = useState(() => readTransitionPreference());
  const [segmentationStyle, setSegmentationStyle] = useState(() => readSegmentationStyle());
  const [segmentationGranularity, setSegmentationGranularity] = useState(() => readSegmentationGranularity());
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [focusReviewItems, setFocusReviewItems] = useState(false);
  const transitionTimerRef = useRef(null);

  useEffect(() => {
    const storedMethod = readSavedMethod();
    const storedQuickMode = readQuickModePreference();
    const storedTransitionPreference = readTransitionPreference();
    const storedStyle = readSegmentationStyle();
    const storedGranularity = readSegmentationGranularity();
    const shouldUseDemoReview = !initialText.trim();

    setRawText(shouldUseDemoReview ? demoReviewText : initialText);
    setStep(shouldUseDemoReview ? 'review' : 'paste');
    setMarkers(shouldUseDemoReview ? createDemoReviewMarkers() : []);
    setSegmentMode(storedMethod || 'ai');
    setSourcePanelMode('peek');
    setSavedMethod(storedMethod);
    setQuickMode(storedQuickMode);
    setShowSegmentationTransition(storedTransitionPreference);
    setSegmentationStyle(shouldUseDemoReview ? 'meaning' : storedStyle);
    setSegmentationGranularity(shouldUseDemoReview ? 'balanced' : storedGranularity);
    setIsActionMenuOpen(false);
    setFocusReviewItems(false);
  }, [batchId, initialText]);

  useEffect(() => {
    writeSavedMethod(savedMethod);
  }, [savedMethod]);

  useEffect(() => {
    writeQuickModePreference(quickMode);
  }, [quickMode]);

  useEffect(() => {
    writeTransitionPreference(showSegmentationTransition);
  }, [showSegmentationTransition]);

  useEffect(() => {
    writeSegmentationStyle(segmentationStyle);
  }, [segmentationStyle]);

  useEffect(() => {
    writeSegmentationGranularity(segmentationGranularity);
  }, [segmentationGranularity]);

  useEffect(() => {
    if (step !== 'compiling') {
      return undefined;
    }

    transitionTimerRef.current = window.setTimeout(() => {
      setStep(showSegmentationTransition ? 'segmenting' : segmentMode === 'manual' || !quickMode ? 'review' : 'success');
    }, 1200);

    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, [quickMode, segmentMode, showSegmentationTransition, step]);

  useEffect(() => {
    if (step !== 'segmenting') {
      return undefined;
    }

    transitionTimerRef.current = window.setTimeout(() => {
      setStep(segmentMode === 'manual' || !quickMode ? 'review' : 'success');
    }, 2200);

    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, [quickMode, segmentMode, step]);

  const wordCount = useMemo(() => rawText.split(/\s+/).filter(Boolean).length, [rawText]);
  const hasText = rawText.trim().length > 0;
  const defaultMethod = savedMethod || 'ai';
  const segments = useMemo(
    () =>
      markers
        .filter((marker) => marker.text?.trim())
        .map((marker) => ({
          marker,
          text: marker.text,
        })),
    [markers],
  );
  const worthCheckingCount = useMemo(
    () => markers.filter((marker) => marker.needsReview).length,
    [markers],
  );
  const needsReviewCount = useMemo(
    () => markers.filter((marker) => marker.reviewState === 'needs-review').length,
    [markers],
  );
  const secondLookCount = useMemo(
    () => markers.filter((marker) => marker.reviewState === 'second-look').length,
    [markers],
  );

  const visibleSegments = segments.filter((segment) => segment.text.trim()).slice(0, 3);
  const focusedSegments = useMemo(
    () => (focusReviewItems && worthCheckingCount ? segments.filter((segment) => segment.marker.needsReview) : segments),
    [focusReviewItems, segments, worthCheckingCount],
  );
  const transitionSourceBlocks = useMemo(() => {
    const source = rawText.trim();
    if (!source) {
      return [];
    }

    const chunks = source
      .replace(/\s+/g, ' ')
      .match(/.{1,120}(?:\s|$)/g)
      ?.map((chunk) => chunk.trim())
      .filter(Boolean)
      .slice(0, 3);

    return chunks || [source];
  }, [rawText]);

  const beginAiFlow = () => {
    const nextMarkers = generateMarkers(rawText, 'ai', segmentationStyle, segmentationGranularity);
    setSegmentMode('ai');
    setMarkers(nextMarkers);
    setStep('compiling');
  };

  const beginManualFlow = () => {
    const nextMarkers = generateMarkers(rawText, 'manual', segmentationStyle, segmentationGranularity);
    setSegmentMode('manual');
    setMarkers(nextMarkers);
    setStep('review');
  };

  const handlePrimaryAction = () => {
    if (!hasText) {
      return;
    }

    setIsActionMenuOpen(false);

    if (defaultMethod === 'manual') {
      beginManualFlow();
      return;
    }

    beginAiFlow();
  };

  const handleToggleActionMenu = () => {
    if (!hasText) {
      return;
    }

    setIsActionMenuOpen((current) => !current);
  };

  const handleSelectMethodOption = (mode) => {
    setSavedMethod(mode);
    setSegmentMode(mode);
  };

  const handleQuickModeToggle = () => {
    setQuickMode((current) => !current);
  };

  const handleTransitionPreferenceToggle = () => {
    setShowSegmentationTransition((current) => !current);
  };

  const handleChooseMode = (mode) => {
    setSavedMethod(mode);

    if (mode === 'manual') {
      beginManualFlow();
      return;
    }

    beginAiFlow();
  };

  const handleApprove = () => {
    onSegmentationComplete({
      batchId: batchId || 'NEW-001',
      segmentCount: markers.length,
      worthCheckingCount,
      segmentationStyle,
    });
  };

  const handleSkipTransition = () => {
    setStep(segmentMode === 'manual' || !quickMode ? 'review' : 'success');
  };

  const handleAlwaysSkipTransition = () => {
    setShowSegmentationTransition(false);
    setStep(segmentMode === 'manual' || !quickMode ? 'review' : 'success');
  };

  const handleToggleReviewFocus = () => {
    if (!worthCheckingCount) {
      return;
    }

    setFocusReviewItems((current) => !current);
  };

  const addMarker = () => {
    const nextId = String(markers.length + 1);
    setMarkers((current) => [
      ...current,
      {
        id: nextId,
        position: Math.floor(rawText.length / 2),
        label: `Segment ${nextId}`,
        text: '',
        topic: segmentationStyle === 'sentence' ? '' : `Theme ${nextId}`,
        reviewState: null,
        needsReview: false,
      },
    ]);
  };

  const removeMarker = (markerId) => {
    setMarkers((current) => current.filter((marker) => marker.id !== markerId));
  };

  const updateMarkerLabel = (markerId, label) => {
    setMarkers((current) =>
      current.map((marker) => (marker.id === markerId ? { ...marker, label } : marker)),
    );
  };

  return (
    <div className="make-seg__workspacePage">
      <header className="make-seg__header">
        <div className="make-seg__headerInner is-workspace">
          <button type="button" className="make-seg__headerPill" onClick={onBackHome}>
            <ArrowLeft size={16} strokeWidth={1.9} />
            Back
          </button>

          <WorkspaceStepbar step={step} />

          <div className="make-seg__headerAside">
            <div className="make-seg__brand">
              <div className="make-seg__brandMark is-small">
                <Scissors size={16} strokeWidth={1.9} />
              </div>
              <div className="make-seg__brandText">
                <p className="make-seg__brandName is-inline">Source Intake</p>
                <p className="make-seg__brandMeta">Segmentation</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {step === 'paste' ? (
        <WorkspaceStage className="make-seg__workspacePanel is-intakeStage">
          <div className="make-seg__workspacePanelBg">
            <div className="make-seg__blurCircle is-top" />
            <div className="make-seg__blurCircle is-bottom" />
          </div>

          <div className="make-seg__workspaceSection is-intakeStage">
            <div className="make-seg__centerStage make-seg__centerStage--workspaceIntro">
              <SectionPill className={hasText ? 'is-live' : ''}>Step 1</SectionPill>
              <h1 className="make-seg__sectionTitle">Paste your text</h1>
              <p className="make-seg__sectionLead">
                Drop in your raw source material. AraPal will turn it into clean, study-ready segments.
              </p>
            </div>

            <div className="make-seg__pasteCanvas">
              <div className="make-seg__panelCorner is-topLeft" />
              <div className="make-seg__panelCorner is-topRight" />
              <div className="make-seg__panelCorner is-bottomLeft" />
              <div className="make-seg__panelCorner is-bottomRight" />
              <div className="make-seg__pasteLayer is-back" />
              <div className="make-seg__pasteLayer is-mid" />
              <div className="make-seg__pasteAura is-left" />
              <div className="make-seg__pasteAura is-right" />
              <PasteStageOrnament side="left" />
              <PasteStageOrnament side="right" />
              <div className="make-seg__pasteStageGrid" />

              <div className="make-seg__editorWrap make-seg__editorWrap--feature">
                <div className="make-seg__editorGlow" />
                <div className="make-seg__editorShell make-seg__editorShell--feature">
                  <div className="make-seg__editorTopbar make-seg__editorTopbar--feature">
                    <div className="make-seg__editorChrome">
                      <WindowButtons />
                      <div className="make-seg__editorChromeText">
                        <span className="make-seg__editorChromeEyebrow">Arapal intake</span>
                      </div>
                    </div>
                    <div className="make-seg__editorSeal">Preserved source</div>
                  </div>

                  <textarea
                    value={rawText}
                    onChange={(event) => setRawText(event.target.value)}
                    placeholder={'Paste your source text here…\n\nThe workspace will analyze and segment your text into structured, study-ready sections.'}
                    className="make-seg__fieldTextarea make-seg__editorTextarea make-seg__editorTextarea--feature"
                  />
                  <div className="make-seg__editorWatermark">Arapal</div>

                  <div className="make-seg__editorFooter">
                    <div className="make-seg__editorShortcut">
                      <span className="make-seg__editorKey">⌘</span>
                      <span className="make-seg__editorKey">V</span>
                      <span>to paste</span>
                    </div>
                    {hasText ? <div className="make-seg__editorFooterMeta">{wordCount} words</div> : <div />}
                  </div>
                </div>
              </div>
            </div>

            {hasText ? (
              <div className="make-seg__intakeActions">
                <div className="make-seg__ctaCluster">
                  <button
                    type="button"
                    className="make-seg__primaryButton is-segmentation"
                    onClick={handlePrimaryAction}
                  >
                    {defaultMethod === 'manual' ? <Edit3 size={16} strokeWidth={1.9} /> : <Sparkles size={16} strokeWidth={1.9} />}
                    <span>{defaultMethod === 'manual' ? 'Manual review' : 'AI Segment Text'}</span>
                    <ArrowDown size={16} strokeWidth={1.9} />
                  </button>

                  <button
                    type="button"
                    className="make-seg__splitButton"
                    onClick={handleToggleActionMenu}
                    aria-haspopup="menu"
                    aria-expanded={isActionMenuOpen}
                    aria-label="Segmentation options"
                  >
                    <ChevronUp
                      size={18}
                      strokeWidth={1.9}
                      className={cn('make-seg__splitChevron', isActionMenuOpen ? 'is-open' : '')}
                    />
                  </button>

                  {isActionMenuOpen ? (
                    <div className="make-seg__splitMenu" role="menu" aria-label="Segmentation options">
                      <div className="make-seg__splitMenuSection">
                        <p className="make-seg__splitMenuLabel">Method</p>
                        <button
                          type="button"
                          className={cn('make-seg__splitMenuOption', defaultMethod === 'ai' ? 'is-selected' : '')}
                          onClick={() => handleSelectMethodOption('ai')}
                        >
                          <span className="make-seg__splitMenuOptionText">
                            <Sparkles size={15} strokeWidth={1.9} />
                            AI proposal
                          </span>
                          {defaultMethod === 'ai' ? <Check size={15} strokeWidth={1.9} /> : null}
                        </button>
                        <button
                          type="button"
                          className={cn('make-seg__splitMenuOption', defaultMethod === 'manual' ? 'is-selected' : '')}
                          onClick={() => handleSelectMethodOption('manual')}
                        >
                          <span className="make-seg__splitMenuOptionText">
                            <Edit3 size={15} strokeWidth={1.9} />
                            Manual start
                          </span>
                          {defaultMethod === 'manual' ? <Check size={15} strokeWidth={1.9} /> : null}
                        </button>
                      </div>

                      <div className="make-seg__splitMenuSection">
                        <p className="make-seg__splitMenuLabel">Segmentation style</p>
                        {segmentationStyleOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            className={cn('make-seg__splitMenuOption', segmentationStyle === option.id ? 'is-selected' : '')}
                            onClick={() => setSegmentationStyle(option.id)}
                          >
                            <span className="make-seg__splitMenuOptionText is-stacked">
                              <span className="make-seg__splitMenuOptionTitle">{option.label}</span>
                              <span className="make-seg__splitMenuOptionMeta">{option.meta}</span>
                            </span>
                            {segmentationStyle === option.id ? <Check size={15} strokeWidth={1.9} /> : null}
                          </button>
                        ))}
                      </div>

                      <div className="make-seg__splitMenuSection">
                        <p className="make-seg__splitMenuLabel">Granularity</p>
                        {segmentationGranularityOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            className={cn('make-seg__splitMenuOption', segmentationGranularity === option.id ? 'is-selected' : '')}
                            onClick={() => setSegmentationGranularity(option.id)}
                          >
                            <span className="make-seg__splitMenuOptionText is-stacked">
                              <span className="make-seg__splitMenuOptionTitle">{option.label}</span>
                              <span className="make-seg__splitMenuOptionMeta">{option.meta}</span>
                            </span>
                            {segmentationGranularity === option.id ? <Check size={15} strokeWidth={1.9} /> : null}
                          </button>
                        ))}
                      </div>

                      <div className="make-seg__splitMenuSection">
                        <p className="make-seg__splitMenuLabel">Preferences</p>
                        <button type="button" className="make-seg__splitMenuToggle" onClick={handleQuickModeToggle}>
                          <span className="make-seg__splitMenuToggleText">
                            <span className="make-seg__splitMenuToggleTitle">Quick mode</span>
                            <span className="make-seg__splitMenuToggleMeta">
                              {quickMode
                                ? 'Go straight to Segments Ready after the AI pass'
                                : 'Open review first before showing Segments Ready'}
                            </span>
                          </span>
                          <span className={cn('make-seg__miniSwitch', quickMode ? 'is-active' : '')}>
                            <span className="make-seg__miniSwitchThumb" />
                          </span>
                        </button>

                        <button
                          type="button"
                          className="make-seg__splitMenuToggle"
                          onClick={handleTransitionPreferenceToggle}
                        >
                          <span className="make-seg__splitMenuToggleText">
                            <span className="make-seg__splitMenuToggleTitle">Show segmentation animation</span>
                            <span className="make-seg__splitMenuToggleMeta">Let the text split visually before study</span>
                          </span>
                          <span className={cn('make-seg__miniSwitch', showSegmentationTransition ? 'is-active' : '')}>
                            <span className="make-seg__miniSwitchThumb" />
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </WorkspaceStage>
      ) : null}

      {step === 'method' ? (
        <WorkspaceStage>
          <section className="make-seg__choiceSection">
            <div className="make-seg__centerStage make-seg__centerStage--choiceIntro">
              <SectionPill>Choose method</SectionPill>
              <h2 className="make-seg__sectionTitle">How should AraPal start?</h2>
              <p className="make-seg__sectionLead">
                AI is best for most users. Manual exists for the cases where you want direct control from the first split.
              </p>
            </div>

            <div className="make-seg__choiceGrid">
              <button type="button" className="make-seg__choiceCard is-featured" onClick={() => handleChooseMode('ai')}>
                <div className="make-seg__choiceDecoration is-featured" />
                <div className="make-seg__choiceIcon">
                  <Wand2 size={28} strokeWidth={1.9} />
                </div>
                <h3 className="make-seg__choiceTitle">AI Proposal</h3>
                <p className="make-seg__choiceText">
                  Let AraPal create the first segmentation pass in the background, then decide whether to go straight to study or review the result.
                </p>
                <span className="make-seg__choiceLink">
                  Use AI
                  <ChevronRight size={16} strokeWidth={1.9} />
                </span>
              </button>

              <button type="button" className="make-seg__choiceCard" onClick={() => handleChooseMode('manual')}>
                <div className="make-seg__choiceIcon">
                  <Edit3 size={28} strokeWidth={1.9} />
                </div>
                <h3 className="make-seg__choiceTitle">Manual Start</h3>
                <p className="make-seg__choiceText">
                  Open Review & refine directly and place the segment boundaries yourself before continuing.
                </p>
                <span className="make-seg__choiceLink">
                  Start manually
                  <ChevronRight size={16} strokeWidth={1.9} />
                </span>
              </button>
            </div>
          </section>
        </WorkspaceStage>
      ) : null}

      {step === 'compiling' ? (
        <WorkspaceStage className="is-centered">
          <section className="make-seg__compilingPage">
            <div className="make-seg__compilingInner">
              <div className="make-seg__compilingSeal">
                <Sparkles size={40} strokeWidth={1.8} />
              </div>
              <h2 className="make-seg__compilingTitle">Preparing your segments</h2>
              <p className="make-seg__compilingText">
                AraPal is preserving the structure and building a clean first pass for review.
              </p>
            </div>
          </section>
        </WorkspaceStage>
      ) : null}

      {step === 'segmenting' ? (
        <WorkspaceStage>
          <section className="make-seg__transitionPage">
            <div className="make-seg__transitionShell">
              <div className="make-seg__transitionHeader">
                <div>
                  <SectionPill>Step 2</SectionPill>
                  <h2 className="make-seg__sectionTitle is-review">Segmenting your text</h2>
                  <p className="make-seg__sectionLead">
                    AraPal is drafting a clean first pass so you can move straight into study or inspect the structure afterwards.
                  </p>
                </div>

                <div className="make-seg__transitionActions">
                  <button type="button" className="make-seg__ghostButton" onClick={handleSkipTransition}>
                    Skip
                  </button>
                  {showSegmentationTransition ? (
                    <InlineActionButton onClick={handleAlwaysSkipTransition} subtle>
                      Always skip this animation
                    </InlineActionButton>
                  ) : null}
                </div>
              </div>

              <div className="make-seg__transitionVisual">
                <div className="make-seg__transitionSource">
                  <div className="make-seg__transitionPanelBar">
                    <WindowButtons />
                    <span className="make-seg__transitionPanelTitle">Preserved source</span>
                  </div>
                  <div className="make-seg__transitionSourceBody">
                    {transitionSourceBlocks.map((block, index) => (
                      <div key={`${block}-${index}`} className="make-seg__transitionSourceParagraph">
                        <p className="make-seg__transitionSourceText">{block}</p>
                      </div>
                    ))}
                    <div className="make-seg__transitionMarker is-top">
                      <Sparkles size={12} strokeWidth={1.9} />
                    </div>
                    <div className="make-seg__transitionMarker is-mid">
                      <Sparkles size={12} strokeWidth={1.9} />
                    </div>
                    <div className="make-seg__transitionMarker is-bottom">
                      <Sparkles size={12} strokeWidth={1.9} />
                    </div>
                  </div>
                </div>

                <div className="make-seg__transitionBridge" aria-hidden="true">
                  <div className="make-seg__transitionBeam is-left" />
                  <div className="make-seg__transitionBeam is-right" />
                  <div className="make-seg__transitionBridgeCore">
                    <div className="make-seg__transitionBridgePulse" />
                    <Sparkles size={26} strokeWidth={1.9} />
                  </div>
                  <div className="make-seg__transitionChip is-one">Segment 01</div>
                  <div className="make-seg__transitionChip is-two">Segment 02</div>
                  <div className="make-seg__transitionChip is-three">Segment 03</div>
                </div>

                <div className="make-seg__transitionPreview">
                  <div className="make-seg__transitionPanelBar">
                    <span className="make-seg__transitionPanelTitle">AI proposal</span>
                    <Sparkles size={16} strokeWidth={1.9} className="make-seg__accentIcon" />
                  </div>
                  <div className="make-seg__transitionPreviewBody">
                    {visibleSegments.map((segment) => (
                      <div key={segment.marker.id} className="make-seg__transitionSegment">
                        <p className="make-seg__transitionSegmentLabel">{segment.marker.label}</p>
                        <p className="make-seg__transitionSegmentText">{segment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </WorkspaceStage>
      ) : null}

      {step === 'review' ? (
        <WorkspaceStage className="is-review-atmosphere">
          <section className="make-seg__reviewSection">
            <div className="make-seg__reviewHeader">
              <SectionPill>Step 3</SectionPill>
              <h2 className="make-seg__sectionTitle is-review">Review & refine</h2>
              <p className="make-seg__reviewLead">
                The AI draft is ready. Only the amber items need a closer look before you approve and continue.
              </p>
              <div className="make-seg__reviewMetaRow">
                <span className="make-seg__reviewMetaItem">
                  {segmentMode === 'manual' ? 'Manual start' : 'AI proposal'} · {getSegmentationStyleLabel(segmentationStyle)} ·{' '}
                  {getGranularityLabel(segmentationGranularity)}
                </span>
              </div>
            </div>

            <div
              className={cn(
                'make-seg__sourcePreview',
                sourcePanelMode === 'collapsed' ? 'is-collapsed' : '',
                sourcePanelMode === 'expanded' ? 'is-expanded' : '',
                sourcePanelMode === 'peek' ? 'is-peek' : '',
              )}
            >
              <div className="make-seg__sourcePreviewBar">
                <div className="make-seg__sourcePreviewBarMain">
                  <span className="make-seg__sourceSummaryLabel">Source text</span>
                  <span className="make-seg__sourceSummaryCount">{wordCount} words</span>
                </div>

                <div className="make-seg__sourcePreviewActions">
                  <button type="button" className="make-seg__sourceViewButton" onClick={() => setStep('paste')}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className={cn('make-seg__sourceViewButton', sourcePanelMode === 'expanded' ? 'is-active' : '')}
                    onClick={() => {
                      if (sourcePanelMode === 'collapsed') {
                        setSourcePanelMode('peek');
                        return;
                      }

                      setSourcePanelMode(sourcePanelMode === 'expanded' ? 'peek' : 'expanded');
                    }}
                  >
                    {sourcePanelMode === 'collapsed'
                      ? 'Show source'
                      : sourcePanelMode === 'expanded'
                        ? 'Peek source'
                        : 'Expand source'}
                  </button>

                  {sourcePanelMode !== 'collapsed' ? (
                    <button
                      type="button"
                      className="make-seg__sourceViewButton is-quiet"
                      onClick={() => setSourcePanelMode('collapsed')}
                    >
                      Hide
                    </button>
                  ) : null}
                </div>
              </div>

              {sourcePanelMode !== 'collapsed' ? (
                <div className="make-seg__sourcePreviewText">{rawText}</div>
              ) : null}
            </div>

            <div className="make-seg__reviewGrid">
              <aside className="make-seg__markerPanel">
                <div className="make-seg__markerHeader">
                  <h3 className="make-seg__markerHeaderTitle">Segment markers · {markers.length}</h3>
                  <button type="button" className="make-seg__iconButton" onClick={addMarker}>
                    <Plus size={14} strokeWidth={1.9} />
                  </button>
                </div>

                <div className="make-seg__markerList">
                  {markers.map((marker, index) => (
                    <div
                      key={marker.id}
                      className={cn(
                        'make-seg__markerRow',
                        marker.needsReview ? 'is-flagged' : '',
                        marker.reviewState === 'needs-review' ? 'is-strong-review' : '',
                        focusReviewItems && worthCheckingCount && !marker.needsReview ? 'is-muted' : '',
                      )}
                    >
                      <div className="make-seg__markerRowInner">
                        <div className="make-seg__markerIndex">{index + 1}</div>
                        <div className="make-seg__markerBody">
                          <div className="make-seg__markerLabelRow">
                            {marker.needsReview ? <span className="make-seg__flagDot" aria-hidden="true" /> : null}
                            <input
                              type="text"
                              value={marker.label}
                              onChange={(event) => updateMarkerLabel(marker.id, event.target.value)}
                              className="make-seg__markerInput"
                            />
                          </div>
                          {segmentationStyle === 'topic' && marker.topic ? (
                            <div className="make-seg__markerTopic">{marker.topic}</div>
                          ) : null}
                        </div>
                        {markers.length > 1 ? (
                          <button type="button" className="make-seg__markerRemove" onClick={() => removeMarker(marker.id)}>
                            <X size={14} strokeWidth={1.9} />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </aside>

              <section className="make-seg__reviewOutput">
                <div className="make-seg__reviewOutputBar">
                  <span className="make-seg__markerHeaderTitle">Compiled preview</span>
                  <div className="make-seg__reviewOutputActions">
                    {needsReviewCount ? (
                      <span className="make-seg__reviewMetaBadge is-strong">{needsReviewCount} needs review</span>
                    ) : null}
                    {secondLookCount ? (
                      <span className="make-seg__reviewMetaBadge">{secondLookCount} worth a look</span>
                    ) : null}
                    {!worthCheckingCount ? <span className="make-seg__reviewOutputMeta">{segments.length} ready</span> : null}
                    {worthCheckingCount ? (
                      <button
                        type="button"
                        className={cn('make-seg__focusButton', focusReviewItems ? 'is-active' : '')}
                        onClick={handleToggleReviewFocus}
                      >
                        {focusReviewItems ? 'Show all' : 'Focus flagged'}
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="make-seg__reviewOutputBody">
                  <div className="make-seg__segmentStack">
                    {focusedSegments.map((segment, index) => (
                      <article
                        key={segment.marker.id}
                        className={cn(
                          'make-seg__segmentCard',
                          `make-seg__staggerDelay-${(index % 5) + 1}`,
                          segment.marker.needsReview ? 'is-flagged' : '',
                          segment.marker.reviewState === 'needs-review' ? 'is-strong-review' : '',
                        )}
                      >
                        <div className="make-seg__segmentCardHeader">
                          <div className="make-seg__segmentBullet">{segment.marker.id}</div>
                          <div className="make-seg__segmentHeaderText">
                            <span className="make-seg__segmentLabel">{segment.marker.label}</span>
                            {segmentationStyle === 'topic' && segment.marker.topic ? (
                              <span className="make-seg__segmentTopic">{segment.marker.topic}</span>
                            ) : null}
                          </div>
                          {segment.marker.needsReview ? (
                            <span
                              className={cn(
                                'make-seg__segmentSignal',
                                segment.marker.reviewState === 'needs-review' ? 'is-strong' : '',
                              )}
                            >
                              {getReviewSignalLabel(segment.marker.reviewState)}
                            </span>
                          ) : null}
                        </div>
                        <p className="make-seg__segmentText">{segment.text}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <div className="make-seg__reviewActionArea">
              <div className="make-seg__reviewActionSummary">
                <p className="make-seg__reviewActionEyebrow">Ready to continue</p>
                <h3 className="make-seg__reviewActionTitle">Approve structure</h3>
                <p className="make-seg__reviewActionText">
                  {markers.length} segments prepared
                  {needsReviewCount
                    ? `, with ${needsReviewCount} needing review${secondLookCount ? ` and ${secondLookCount} worth a look` : ''}.`
                    : secondLookCount
                      ? `, with ${secondLookCount} worth a look before study.`
                      : ' and ready to publish.'}
                </p>
              </div>
              <button type="button" className="make-seg__primaryButton" onClick={handleApprove}>
                <Check size={18} strokeWidth={1.9} />
                Approve & continue
              </button>
            </div>
          </section>
        </WorkspaceStage>
      ) : null}

      {step === 'success' ? (
        <SuccessScreen
          batchId={batchId}
          segmentCount={markers.length}
          worthCheckingCount={worthCheckingCount}
          segmentationStyle={segmentationStyle}
          onStartStudying={onStartStudying}
          onReturnHome={onBackHome}
          onReviewSegments={() => setStep('review')}
        />
      ) : null}
    </div>
  );
}

function SuccessScreen({
  batchId,
  segmentCount,
  projectName,
  onStartStudying,
  onReturnHome,
  onReviewSegments,
}) {
  return (
    <div className="make-seg__successPage">
      <StageAtmosphere />
      <div className="make-seg__successInner">
        <div className="make-seg__successSeal">
          <CheckCircle2 size={64} strokeWidth={1.8} />
        </div>

        <div className="make-seg__successHero">
          <h1 className="make-seg__successTitle">Segments Ready</h1>
          <p className="make-seg__successText">Your study material has been successfully compiled</p>
          <div className="make-seg__successBadge">
            <Sparkles size={16} strokeWidth={1.9} className="make-seg__accentIcon" />
            <span><strong>{segmentCount}</strong> segments created</span>
          </div>
        </div>

        <div className="make-seg__buttonRow">
          <button type="button" className="make-seg__primaryButton" onClick={onStartStudying}>
            <Play size={16} strokeWidth={1.9} />
            Start Studying
          </button>
          <button type="button" className="make-seg__ghostButton" onClick={onReturnHome}>
            <Home size={16} strokeWidth={1.9} />
            Return to Home
          </button>
        </div>

        {onReviewSegments ? (
          <div className="make-seg__successSecondary">
            <button type="button" className="make-seg__successLink" onClick={onReviewSegments}>
              Review and edit segments
            </button>
          </div>
        ) : null}

        <div className="make-seg__successDivider">
          <div className="make-seg__successStats">
            <div className="make-seg__successStat">
              <p className="make-seg__successStatLabel">Project</p>
              <p className="make-seg__successStatValue">{projectName || getProjectDisplayName(batchId)}</p>
            </div>
            <div className="make-seg__successStat">
              <p className="make-seg__successStatLabel">Batch ID</p>
              <p className="make-seg__successStatValue">{batchId || 'NEW-001'}</p>
            </div>
            <div className="make-seg__successStat">
              <p className="make-seg__successStatLabel">Status</p>
              <p className="make-seg__successStatValue is-live">Live</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MakeSegmentationFlowScreen() {
  const [route, setRoute] = useState('workspace');
  const [workspaceKey, setWorkspaceKey] = useState(0);
  const [activeBatchId, setActiveBatchId] = useState('new');
  const [workspaceText, setWorkspaceText] = useState('');
  const [successMeta, setSuccessMeta] = useState({
    batchId: 'NEW-001',
    segmentCount: 12,
    worthCheckingCount: 0,
    segmentationStyle: 'meaning',
    projectName: 'New project',
  });

  const openArchivedPickup = () => setRoute('home');
  const openProjects = () => window.location.hash = 'segments';
  const openStudy = () => window.location.hash = 'study';

  const openWorkspace = (batchId, initialText = '') => {
    setActiveBatchId(batchId);
    setWorkspaceText(initialText || workspaceSeedByProject[batchId] || '');
    setWorkspaceKey((current) => current + 1);
    setRoute('workspace');
  };

  const openSuccess = ({ batchId, segmentCount, worthCheckingCount = 0, segmentationStyle = 'meaning' }) => {
    setSuccessMeta({
      batchId: batchId || 'NEW-001',
      segmentCount,
      worthCheckingCount,
      segmentationStyle,
      projectName: getProjectDisplayName(batchId),
    });
    setRoute('success');
  };

  return (
    <>
      <style>{makeSegmentationStyles}</style>
      <div className="make-seg">
        {route === 'home' ? (
          <HomeScreen
            onReplayIntro={openArchivedPickup}
            onOpenProject={(projectId) => openWorkspace(projectId, workspaceSeedByProject[projectId] || '')}
            onOpenSourceIntake={() => openWorkspace('new', '')}
            onOpenProjects={openProjects}
            onOpenWorkspace={(projectId) => openWorkspace(projectId, workspaceSeedByProject[projectId] || '')}
          />
        ) : null}

        {route === 'source-intake' || route === 'workspace' ? (
          <SegmentationWorkspaceScreen
            key={workspaceKey}
            batchId={activeBatchId}
            initialText={workspaceText}
            onBackHome={openProjects}
            onStartStudying={openStudy}
            onSegmentationComplete={openSuccess}
          />
        ) : null}

        {route === 'success' ? (
          <SuccessScreen
            batchId={successMeta.batchId}
            segmentCount={successMeta.segmentCount}
            worthCheckingCount={successMeta.worthCheckingCount}
            projectName={successMeta.projectName}
            onStartStudying={openStudy}
            onReturnHome={openProjects}
          />
        ) : null}
      </div>
    </>
  );
}
