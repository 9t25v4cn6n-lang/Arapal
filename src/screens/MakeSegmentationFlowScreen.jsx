import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Eye,
  FileText,
  Home,
  Layers,
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
    min-height: 100vh;
    background:
      radial-gradient(circle at 8% 10%, rgba(219, 234, 254, 0.78), transparent 28%),
      radial-gradient(circle at 88% 12%, rgba(226, 232, 240, 0.82), transparent 24%),
      linear-gradient(180deg, var(--make-bg-top) 0%, var(--make-bg-bottom) 100%);
    color: var(--make-text-body);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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

  .make-seg__headerPill,
  .make-seg__ghostButton,
  .make-seg__primaryButton,
  .make-seg__choiceButton,
  .make-seg__toggleButton,
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
    background: rgba(255, 255, 255, 0.7);
    color: rgba(15, 23, 42, 0.4);
    border: 1px solid rgba(15, 23, 42, 0.08);
  }

  .make-seg__workspacePanel.is-intakeStage .make-seg__sectionTitle {
    color: #08060d;
  }

  .make-seg__workspacePanel.is-intakeStage .make-seg__sectionLead {
    color: rgba(15, 23, 42, 0.32);
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

  .make-seg__workspaceHeroMeta {
    margin-top: 20px;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
    color: var(--make-text-soft);
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .make-seg__workspaceHeroMetaDot {
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: var(--make-accent-soft);
    opacity: 0.9;
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
    background: linear-gradient(90deg, var(--make-accent) 0%, var(--make-accent-strong) 100%);
    color: #ffffff;
    box-shadow: var(--make-shadow-accent);
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .make-seg__primaryButton:hover,
  .make-seg__actionButton:hover {
    transform: translateY(-2px);
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

  .make-seg__workspacePage {
    min-height: 100vh;
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

  .make-seg__stepLine {
    width: 32px;
    height: 1px;
    background: var(--make-line);
  }

  .make-seg__workspacePanel {
    position: relative;
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
    background: rgba(255, 255, 255, 0.9);
    border-bottom: 1px solid var(--make-line);
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

  .make-seg__choiceSection {
    max-width: 1200px;
    margin: 0 auto;
    padding: 96px 48px;
  }

  .make-seg__choiceSection.is-collapsed {
    background: rgba(255, 255, 255, 0.9);
    border-bottom: 1px solid var(--make-line);
    padding-top: 32px;
    padding-bottom: 32px;
  }

  .make-seg__choiceGrid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
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

  .make-seg__reviewSection {
    max-width: 1400px;
    margin: 0 auto;
    padding: 48px 48px 64px;
    animation: make-seg-fade-up 0.5s ease both;
  }

  .make-seg__reviewHeader {
    margin-bottom: 40px;
  }

  .make-seg__sectionTitle.is-review {
    margin-top: 0;
    font-size: clamp(28px, 3.5vw, 48px);
  }

  .make-seg__reviewLead {
    margin: 16px 0 0;
    max-width: 560px;
    color: var(--make-text-soft);
    line-height: 1.7;
  }

  .make-seg__sourcePreview {
    margin-bottom: 40px;
    border: 1px solid var(--make-line-soft);
    border-radius: 16px;
    overflow: hidden;
    background: var(--make-surface);
  }

  .make-seg__sourcePreviewBar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-bottom: 1px solid rgba(203, 213, 225, 0.54);
    background: var(--make-surface-soft);
  }

  .make-seg__sourcePreviewText {
    max-height: 300px;
    overflow-y: auto;
    padding: 32px;
    color: var(--make-text-body);
    line-height: 1.85;
    white-space: pre-wrap;
  }

  .make-seg__reviewGrid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
  }

  @media (min-width: 1024px) {
    .make-seg__reviewGrid {
      grid-template-columns: 4fr 8fr;
    }
  }

  @media (min-width: 1280px) {
    .make-seg__reviewGrid {
      grid-template-columns: 3fr 9fr;
    }
  }

  .make-seg__markerPanel {
    border: 1px solid var(--make-line-soft);
    border-radius: 16px;
    background: var(--make-surface);
    padding: 24px;
  }

  @media (min-width: 1024px) {
    .make-seg__markerPanel {
      position: sticky;
      top: 96px;
    }
  }

  .make-seg__markerHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  .make-seg__markerHeaderTitle {
    margin: 0;
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--make-text-soft);
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
    gap: 8px;
    margin-bottom: 24px;
  }

  .make-seg__markerRow {
    position: relative;
    padding: 14px;
    border-radius: 14px;
    border: 1px solid transparent;
    transition: border-color 0.2s ease, background-color 0.2s ease;
  }

  .make-seg__markerRow:hover {
    border-color: rgba(37, 99, 235, 0.14);
    background: rgba(37, 99, 235, 0.04);
  }

  .make-seg__markerRowInner {
    display: flex;
    align-items: center;
    gap: 12px;
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

  .make-seg__toggleButton {
    width: 100%;
    min-height: 44px;
    border: none;
    border-radius: 12px;
    background: var(--make-surface-tint);
    color: var(--make-text-soft);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .make-seg__toggleButton.is-active {
    background: var(--make-accent-wash);
    color: var(--make-accent-strong);
  }

  .make-seg__segmentStack {
    display: flex;
    flex-direction: column;
    gap: 16px;
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

  .make-seg__segmentLabel {
    font-size: 12px;
    line-height: 1.2;
    letter-spacing: 0.08em;
    color: var(--make-text-soft);
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

  .make-seg__compiledPreview {
    border-radius: 16px;
    border: 1px solid var(--make-line-soft);
    background: var(--make-surface);
    padding: 32px 48px;
    animation: make-seg-fade-up 0.4s ease both;
  }

  .make-seg__compiledLabel {
    margin: 0 0 32px;
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--make-text-faint);
  }

  .make-seg__compiledBlock {
    margin-bottom: 32px;
  }

  .make-seg__compiledBlock:last-child {
    margin-bottom: 0;
  }

  .make-seg__compiledHeader {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .make-seg__compiledRule {
    width: 20px;
    height: 1px;
    background: rgba(37, 99, 235, 0.4);
  }

  .make-seg__compiledName {
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(29, 78, 216, 0.72);
  }

  .make-seg__segmentText.is-reset {
    padding: 0;
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
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
  }

  .make-seg__successPage {
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

  .make-seg__successDivider {
    margin-top: 80px;
    padding-top: 48px;
    border-top: 1px solid var(--make-line);
  }

  .make-seg__successStats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 32px;
    text-align: center;
  }

  .make-seg__successStatLabel {
    margin: 0 0 8px;
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--make-text-soft);
  }

  .make-seg__successStatValue {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
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

  @keyframes make-seg-spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
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
    .make-seg__successStats {
      grid-template-columns: 1fr;
    }

    .make-seg__headerActions {
      gap: 12px;
    }

    .make-seg__pasteStageOrnament {
      display: none;
    }

    .make-seg__pasteStageGrid {
      inset-inline: 36px;
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

    .make-seg__projectCard,
    .make-seg__newProjectCard {
      min-height: 240px;
      padding: 24px;
    }

    .make-seg__choiceCard {
      min-height: 280px;
      padding: 28px;
    }

    .make-seg__compiledPreview {
      padding: 24px;
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

const workspaceSteps = ['paste', 'choose', 'review'];

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

function generateMarkers(text, mode) {
  if (mode === 'ai') {
    const paragraphs = text.split(/\n\n+/);
    let pos = 0;
    return paragraphs
      .filter((paragraph) => paragraph.trim())
      .map((paragraph, index) => {
        const marker = {
          id: String(index + 1),
          position: pos,
          label: `${paragraph.trim().substring(0, 40)}${paragraph.trim().length > 40 ? '…' : ''}`,
        };
        pos += paragraph.length + 2;
        return marker;
      });
  }

  return [{ id: '1', position: 0, label: 'Segment 1' }];
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

function WorkspaceStepbar({ step }) {
  const currentIndex = workspaceSteps.indexOf(step);

  return (
    <div className="make-seg__workspaceStepbar">
      {workspaceSteps.map((label, index) => {
        const state = currentIndex === index ? 'current' : currentIndex > index ? 'complete' : 'pending';

        return (
          <div key={label} className="make-seg__stepItem">
            <div className={`make-seg__stepBullet is-${state}`}>
              {state === 'complete' ? <Check size={12} strokeWidth={1.9} /> : index + 1}
            </div>
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

function SegmentationWorkspaceScreen({ batchId, initialText = '', onBackHome, onComplete }) {
  const [rawText, setRawText] = useState(initialText);
  const [step, setStep] = useState('paste');
  const [markers, setMarkers] = useState([]);
  const [segmentMode, setSegmentMode] = useState(null);
  const [viewMode, setViewMode] = useState('guided');
  const [isCompiling, setIsCompiling] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const compileTimerRef = useRef(null);

  useEffect(() => {
    setRawText(initialText);
    setStep('paste');
    setMarkers([]);
    setSegmentMode(null);
    setViewMode('guided');
    setIsCompiling(false);
    setShowPreview(false);
  }, [batchId, initialText]);

  useEffect(() => {
    if (!isCompiling) {
      return undefined;
    }

    compileTimerRef.current = window.setTimeout(() => {
      onComplete({ batchId, segmentCount: markers.length || 1 });
    }, 2000);

    return () => {
      if (compileTimerRef.current) {
        window.clearTimeout(compileTimerRef.current);
      }
    };
  }, [batchId, isCompiling, markers.length, onComplete]);

  const wordCount = useMemo(() => rawText.split(/\s+/).filter(Boolean).length, [rawText]);
  const hasText = rawText.trim().length > 0;

  const handleProceed = () => {
    if (!rawText.trim()) {
      return;
    }

    setStep('choose');
  };

  const handleChooseMode = (mode) => {
    setSegmentMode(mode);
    setMarkers(generateMarkers(rawText, mode));
    setStep('review');
    setViewMode('guided');
  };

  const handleDetailedView = () => {
    setSegmentMode('ai');
    setMarkers(generateMarkers(rawText, 'ai'));
    setStep('review');
    setViewMode('detailed');
    setShowPreview(true);
  };

  const handleApprove = () => {
    setIsCompiling(true);
  };

  const addMarker = () => {
    const nextId = String(markers.length + 1);
    setMarkers((current) => [
      ...current,
      { id: nextId, position: Math.floor(rawText.length / 2), label: `Segment ${nextId}` },
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

  const segments = useMemo(() => {
    const paragraphs = rawText.split(/\n\n+/).filter((paragraph) => paragraph.trim());
    return markers.map((marker, index) => ({
      marker,
      text: paragraphs[index] || '',
    }));
  }, [markers, rawText]);

  if (isCompiling) {
    return (
      <div className="make-seg__compilingPage">
        <div className="make-seg__compilingInner">
          <div className="make-seg__compilingSeal">
            <Sparkles size={40} strokeWidth={1.9} />
          </div>
          <h2 className="make-seg__compilingTitle">Compiling segments…</h2>
          <p className="make-seg__compilingText">Your study material is being prepared</p>
        </div>
      </div>
    );
  }

  return (
    <div className="make-seg__workspacePage">
      <header className="make-seg__header">
        <div className="make-seg__headerInner is-workspace">
          <button type="button" className="make-seg__headerPill" onClick={onBackHome}>
            <ArrowLeft size={16} strokeWidth={1.9} />
            Back
          </button>

          <WorkspaceStepbar step={step} />

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
      </header>

      <section className={`make-seg__workspacePanel${step !== 'paste' ? ' is-collapsed' : ' is-intakeStage'}`}>
        {step === 'paste' ? (
          <div className="make-seg__workspacePanelBg">
            <div className="make-seg__blurCircle is-top" />
            <div className="make-seg__blurCircle is-bottom" />
            <div className="make-seg__intakeWord is-right">Arapal</div>
            <div className="make-seg__intakeWord is-left">Arapal</div>
            <div className="make-seg__intakeLine is-rightStrong" />
            <div className="make-seg__intakeLine is-rightSoft" />
            <div className="make-seg__intakeLine is-leftSoft" />
            <div className="make-seg__intakeLine is-leftStrong" />
          </div>
        ) : null}

        <div className={`make-seg__workspaceSection${step !== 'paste' ? ' is-collapsed' : ' is-intakeStage'}`}>
          {step === 'paste' ? (
            <>
              <div className="make-seg__centerStage make-seg__centerStage--workspaceIntro">
                <SectionPill>Step 1</SectionPill>
                <h1 className="make-seg__sectionTitle">Paste your text</h1>
                <p className="make-seg__sectionLead">
                  Drop in your raw source material. We'll help you transform it into structured, study-ready sections.
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

              <div className={cn('make-seg__continueStage', hasText ? 'is-ready' : 'is-waiting')}>
                {hasText ? (
                  <button type="button" className="make-seg__primaryButton" onClick={handleProceed}>
                    <span>Continue</span>
                    <ArrowDown size={16} strokeWidth={1.9} />
                  </button>
                ) : null}
              </div>
            </>
          ) : (
            <div className="make-seg__workspaceCompactRow">
              <div className="make-seg__workspaceCompactMeta">
                <span className="make-seg__workspaceCompactCheck">
                  <Check size={14} strokeWidth={1.9} />
                </span>
                <span className="make-seg__workspaceCompactLabel">Source Text</span>
                <span className="make-seg__workspaceCompactCount">{wordCount} words</span>
              </div>

              <InlineActionButton
                onClick={() => {
                  setStep('paste');
                  setMarkers([]);
                  setSegmentMode(null);
                  setShowPreview(false);
                }}
              >
                Edit
              </InlineActionButton>
            </div>
          )}
        </div>
      </section>

      {(step === 'choose' || (step === 'review' && viewMode === 'detailed')) ? (
        <section className={`make-seg__choiceSection${step === 'review' ? ' is-collapsed' : ''}`}>
          {step === 'choose' ? (
            <>
              <div className="make-seg__centerStage make-seg__centerStage--choiceIntro">
                <SectionPill>Step 2</SectionPill>
                <h2 className="make-seg__sectionTitle">Choose your approach</h2>
                <p className="make-seg__sectionLead">
                  Let AI propose markers, take full manual control, or jump straight into the detailed workspace.
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
                    Let AI analyze your text and suggest intelligent segmentation markers. Review and edit before approval.
                  </p>
                  <span className="make-seg__choiceLink">
                    Recommended
                    <ChevronRight size={16} strokeWidth={1.9} />
                  </span>
                </button>

                <button type="button" className="make-seg__choiceCard" onClick={() => handleChooseMode('manual')}>
                  <div className="make-seg__choiceIcon">
                    <Edit3 size={28} strokeWidth={1.9} />
                  </div>
                  <h3 className="make-seg__choiceTitle">Manual Control</h3>
                  <p className="make-seg__choiceText">
                    Start with a blank canvas and place markers exactly where you want them. Full control from the start.
                  </p>
                  <span className="make-seg__choiceLink">
                    Continue
                    <ChevronRight size={16} strokeWidth={1.9} />
                  </span>
                </button>

                <button type="button" className="make-seg__choiceCard" onClick={handleDetailedView}>
                  <div className="make-seg__choiceDecoration is-outline" />
                  <div className="make-seg__choiceIcon">
                    <Layers size={28} strokeWidth={1.9} />
                  </div>
                  <h3 className="make-seg__choiceTitle">Detailed View</h3>
                  <p className="make-seg__choiceText">
                    See everything at once — source text, markers, and preview on a single page. For power users.
                  </p>
                  <span className="make-seg__choiceLink is-subtle">
                    Advanced
                    <ChevronRight size={16} strokeWidth={1.9} />
                  </span>
                </button>
              </div>
            </>
          ) : (
            <div className="make-seg__workspaceCompactRow">
              <div className="make-seg__workspaceCompactMeta">
                <span className="make-seg__workspaceCompactCheck">
                  <Check size={14} strokeWidth={1.9} />
                </span>
                <span className="make-seg__workspaceCompactLabel">
                  {segmentMode === 'ai' ? 'AI Proposal' : 'Manual'}
                  {viewMode === 'detailed' ? ' · Detailed View' : ''}
                </span>
              </div>
              <InlineActionButton onClick={() => setStep('choose')}>
                Change
              </InlineActionButton>
            </div>
          )}
        </section>
      ) : null}

      {step === 'review' ? (
        <section className="make-seg__reviewSection">
          <div className="make-seg__reviewHeader">
            <SectionPill>{viewMode === 'detailed' ? 'Workspace' : 'Step 3'}</SectionPill>
            <h2 className="make-seg__sectionTitle is-review">
              Review & refine
            </h2>
            <p className="make-seg__reviewLead">
              {segmentMode === 'ai'
                ? 'AI proposed these segments. Edit labels, add or remove markers, then approve.'
                : 'Place your markers manually. Add segments as needed.'}
            </p>
          </div>

          {viewMode === 'detailed' ? (
            <div className="make-seg__sourcePreview">
              <div className="make-seg__sourcePreviewBar">
                <WindowButtons />
                <span className="make-seg__previewTitle make-seg__subtleText is-inline">
                  Source Text
                </span>
              </div>
              <div className="make-seg__sourcePreviewText">{rawText}</div>
            </div>
          ) : null}

          <div className="make-seg__reviewGrid">
            <aside className="make-seg__markerPanel">
              <div className="make-seg__markerHeader">
                <h3 className="make-seg__markerHeaderTitle">Markers · {markers.length}</h3>
                <button type="button" className="make-seg__iconButton" onClick={addMarker}>
                  <Plus size={14} strokeWidth={1.9} />
                </button>
              </div>

              <div className="make-seg__markerList">
                {markers.map((marker, index) => (
                  <div key={marker.id} className="make-seg__markerRow">
                    <div className="make-seg__markerRowInner">
                      <div className="make-seg__markerIndex">{index + 1}</div>
                      <input
                        type="text"
                        value={marker.label}
                        onChange={(event) => updateMarkerLabel(marker.id, event.target.value)}
                        className="make-seg__markerInput"
                      />
                      {markers.length > 1 ? (
                        <button type="button" className="make-seg__markerRemove" onClick={() => removeMarker(marker.id)}>
                          <X size={14} strokeWidth={1.9} />
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={`make-seg__toggleButton${showPreview ? ' is-active' : ''}`}
                onClick={() => setShowPreview((current) => !current)}
              >
                <Eye size={14} strokeWidth={1.9} />
                {showPreview ? 'Showing Preview' : 'Toggle Preview'}
              </button>
            </aside>

            <div>
              {!showPreview ? (
                <div className="make-seg__segmentStack">
                  {segments.map((segment, index) => (
                    <article key={segment.marker.id} className={`make-seg__segmentCard make-seg__staggerDelay-${(index % 5) + 1}`}>
                      <div className="make-seg__segmentCardHeader">
                        <div className="make-seg__segmentBullet">{index + 1}</div>
                        <span className="make-seg__segmentLabel">{segment.marker.label}</span>
                      </div>
                      <p className="make-seg__segmentText">{segment.text}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="make-seg__compiledPreview">
                  <p className="make-seg__compiledLabel">Compiled Preview</p>
                  {segments.map((segment) => (
                    <div key={segment.marker.id} className="make-seg__compiledBlock">
                      <div className="make-seg__compiledHeader">
                        <div className="make-seg__compiledRule" />
                        <span className="make-seg__compiledName">{segment.marker.label}</span>
                      </div>
                      <p className="make-seg__segmentText is-reset">{segment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="make-seg__approveStage">
            <div className="make-seg__approveInner">
              <SectionPill tone="success" className="make-seg__approvePill">Ready to compile</SectionPill>
              <h3 className="make-seg__approveTitle">Looks good?</h3>
              <p className="make-seg__approveText">
                Approve the structure to compile your {markers.length} segments into study-ready material.
              </p>
              <button type="button" className="make-seg__primaryButton" onClick={handleApprove}>
                <Check size={18} strokeWidth={1.9} />
                Approve & Compile
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SuccessScreen({ batchId, segmentCount, onStartStudying, onReturnHome }) {
  return (
    <div className="make-seg__successPage">
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

        <div className="make-seg__successDivider">
          <div className="make-seg__successStats">
            <div>
              <p className="make-seg__successStatLabel">Batch ID</p>
              <p className="make-seg__successStatValue">{batchId || 'NEW-001'}</p>
            </div>
            <div>
              <p className="make-seg__successStatLabel">Status</p>
              <p className="make-seg__successStatValue is-live">Live</p>
            </div>
            <div>
              <p className="make-seg__successStatLabel">Type</p>
              <p className="make-seg__successStatValue">Segmented</p>
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
  const [successMeta, setSuccessMeta] = useState({ batchId: 'NEW-001', segmentCount: 12 });

  const openArchivedPickup = () => setRoute('home');
  const openProjects = () => window.location.hash = 'segments';
  const openStudy = () => window.location.hash = 'study';

  const openWorkspace = (batchId, initialText = '') => {
    setActiveBatchId(batchId);
    setWorkspaceText(initialText || workspaceSeedByProject[batchId] || '');
    setWorkspaceKey((current) => current + 1);
    setRoute('workspace');
  };

  const handleWorkspaceComplete = ({ batchId, segmentCount }) => {
    setSuccessMeta({ batchId, segmentCount });
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
            onOpenSourceIntake={() => setRoute('source-intake')}
            onOpenProjects={openProjects}
            onOpenWorkspace={(projectId) => openWorkspace(projectId, workspaceSeedByProject[projectId] || '')}
          />
        ) : null}

        {route === 'source-intake' ? (
          <SourceIntakeScreen
            onReturnHome={openProjects}
            onSegmentNow={({ batchId, sourceText }) => openWorkspace(batchId, sourceText)}
          />
        ) : null}

        {route === 'workspace' ? (
          <SegmentationWorkspaceScreen
            key={workspaceKey}
            batchId={activeBatchId}
            initialText={workspaceText}
            onBackHome={openProjects}
            onComplete={handleWorkspaceComplete}
          />
        ) : null}

        {route === 'success' ? (
          <SuccessScreen
            batchId={successMeta.batchId}
            segmentCount={successMeta.segmentCount}
            onStartStudying={openStudy}
            onReturnHome={openProjects}
          />
        ) : null}
      </div>
    </>
  );
}
