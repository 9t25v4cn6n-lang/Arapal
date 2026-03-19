import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  FolderOpen,
  Layers3,
  PenTool,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

const projectScreenStyles = `
  .projects-screen,
  .projects-screen * {
    box-sizing: border-box;
  }

  .projects-screen {
    min-height: 100vh;
    background:
      radial-gradient(circle at top right, rgba(96, 165, 250, 0.18), transparent 24%),
      radial-gradient(circle at bottom center, rgba(125, 211, 252, 0.12), transparent 28%),
      linear-gradient(180deg, #f7f9fe 0%, #eef3fb 100%);
    color: #14213a;
  }

  .projects-screen__testNav {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 9999;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px;
    border: 1px solid rgba(203, 213, 225, 0.9);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(14px);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
  }

  .projects-screen__testNavButton {
    border: none;
    border-radius: 999px;
    min-height: 34px;
    padding: 0 14px;
    background: transparent;
    color: #475569;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.18s ease, color 0.18s ease;
  }

  .projects-screen__testNavButton.is-active {
    background: #0f172a;
    color: #ffffff;
  }

  .projects-screen__layout {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 288px minmax(0, 1fr);
  }

  .projects-screen__sidebar {
    position: relative;
    padding: 26px 22px 28px;
    border-right: 1px solid rgba(209, 219, 236, 0.9);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.86) 0%, rgba(248, 251, 255, 0.92) 100%);
    backdrop-filter: blur(18px);
    overflow: hidden;
  }

  .projects-screen__sidebar::after {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 1px;
    background: linear-gradient(180deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0) 100%);
  }

  .projects-screen__sidebarInner {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .projects-screen__workspaceCard {
    padding: 18px;
    border: 1px solid rgba(191, 219, 254, 0.9);
    border-radius: 28px;
    background:
      radial-gradient(circle at top right, rgba(59, 130, 246, 0.18), transparent 36%),
      linear-gradient(160deg, rgba(255, 255, 255, 0.98) 0%, rgba(239, 246, 255, 0.88) 100%);
    box-shadow: 0 18px 36px rgba(37, 99, 235, 0.08);
  }

  .projects-screen__workspaceRow {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .projects-screen__avatar {
    width: 52px;
    height: 52px;
    border-radius: 18px;
    background: linear-gradient(135deg, #2563eb 0%, #6366f1 100%);
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;
    box-shadow: 0 12px 24px rgba(59, 130, 246, 0.24);
    flex-shrink: 0;
  }

  .projects-screen__workspaceKicker {
    margin: 0 0 4px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #2563eb;
  }

  .projects-screen__workspaceTitle {
    margin: 0;
    font-size: 22px;
    line-height: 28px;
    font-weight: 700;
    color: #0f172a;
    font-family: Georgia, "Times New Roman", serif;
  }

  .projects-screen__workspaceText {
    margin: 16px 0 0;
    font-size: 15px;
    line-height: 1.7;
    color: #516178;
  }

  .projects-screen__sectionLabel {
    margin: 0 0 12px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #3358d4;
  }

  .projects-screen__navGroup {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .projects-screen__navButton {
    width: 100%;
    border: none;
    border-radius: 18px;
    background: transparent;
    color: #6b7b92;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 14px;
    font-size: 15px;
    line-height: 20px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
  }

  .projects-screen__navButton:hover {
    transform: translateX(3px);
    background: rgba(255, 255, 255, 0.68);
    color: #0f172a;
  }

  .projects-screen__navButton.is-active {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(237, 243, 255, 0.94) 100%);
    color: #1e3a8a;
    box-shadow: inset 0 0 0 1px rgba(191, 219, 254, 0.9), 0 10px 24px rgba(148, 163, 184, 0.12);
  }

  .projects-screen__navButton.is-active .projects-screen__navBadge {
    background: #dbeafe;
    color: #1d4ed8;
  }

  .projects-screen__navBadge {
    min-width: 32px;
    height: 28px;
    border-radius: 999px;
    background: rgba(226, 232, 240, 0.82);
    color: #64748b;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    font-size: 12px;
    font-weight: 700;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .projects-screen__sidebarFooter {
    margin-top: auto;
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.74);
    border: 1px solid rgba(221, 230, 241, 0.86);
    box-shadow: 0 10px 24px rgba(148, 163, 184, 0.08);
  }

  .projects-screen__sidebarFooterTitle {
    margin: 0 0 8px;
    font-size: 15px;
    line-height: 20px;
    font-weight: 700;
    color: #0f172a;
  }

  .projects-screen__sidebarFooterText {
    margin: 0 0 14px;
    font-size: 14px;
    line-height: 1.65;
    color: #64748b;
  }

  .projects-screen__sidebarLink {
    border: none;
    background: transparent;
    color: #2563eb;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }

  .projects-screen__main {
    min-width: 0;
    padding: 24px;
  }

  .projects-screen__mainInner {
    min-width: 0;
    max-width: 1640px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .projects-screen__hero {
    position: relative;
    overflow: hidden;
    padding: 28px 30px;
    border: 1px solid rgba(207, 223, 245, 0.94);
    border-radius: 30px;
    background:
      radial-gradient(circle at top right, rgba(96, 165, 250, 0.22), transparent 22%),
      radial-gradient(circle at left center, rgba(59, 130, 246, 0.08), transparent 22%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(241, 248, 255, 0.96) 100%);
    box-shadow: 0 24px 46px rgba(148, 163, 184, 0.12);
  }

  .projects-screen__hero::after {
    content: "";
    position: absolute;
    inset: -20% auto auto 58%;
    width: 420px;
    height: 420px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(186, 230, 253, 0.34) 0%, rgba(186, 230, 253, 0) 68%);
    pointer-events: none;
  }

  .projects-screen__heroRow {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
  }

  .projects-screen__heroText {
    max-width: 920px;
  }

  .projects-screen__heroTitle {
    margin: 0;
    font-size: clamp(40px, 4vw, 56px);
    line-height: 0.98;
    font-weight: 700;
    letter-spacing: -0.04em;
    color: #0f172a;
    font-family: Georgia, "Times New Roman", serif;
  }

  .projects-screen__heroLead {
    margin: 16px 0 0;
    max-width: 760px;
    font-size: 17px;
    line-height: 1.7;
    color: #5f718a;
  }

  .projects-screen__heroActions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .projects-screen__button {
    border: none;
    border-radius: 18px;
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
    color: #ffffff;
    min-height: 52px;
    padding: 0 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 18px 34px rgba(59, 130, 246, 0.22);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .projects-screen__button:hover {
    transform: translateY(-1px);
    box-shadow: 0 22px 40px rgba(59, 130, 246, 0.28);
  }

  .projects-screen__button--ghost {
    border: 1px solid rgba(191, 219, 254, 0.94);
    background: rgba(255, 255, 255, 0.82);
    color: #2563eb;
    box-shadow: none;
  }

  .projects-screen__heroMetrics {
    position: relative;
    z-index: 1;
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  .projects-screen__metric {
    padding: 18px 18px 16px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.82);
    border: 1px solid rgba(219, 234, 254, 0.88);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);
  }

  .projects-screen__metricLabel {
    margin: 0 0 12px;
    font-size: 11px;
    line-height: 14px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #64748b;
  }

  .projects-screen__metricValue {
    margin: 0;
    font-size: 32px;
    line-height: 34px;
    font-weight: 700;
    color: #0f172a;
    font-family: Georgia, "Times New Roman", serif;
  }

  .projects-screen__metricMeta {
    margin: 10px 0 0;
    font-size: 14px;
    line-height: 20px;
    color: #64748b;
  }

  .projects-screen__panel {
    padding: 22px;
    border-radius: 28px;
    border: 1px solid rgba(221, 230, 241, 0.92);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 18px 36px rgba(148, 163, 184, 0.08);
    backdrop-filter: blur(18px);
  }

  .projects-screen__panelHeader {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 18px;
  }

  .projects-screen__panelTitle {
    margin: 0;
    font-size: 12px;
    line-height: 16px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #3358d4;
  }

  .projects-screen__panelLead {
    margin: 6px 0 0;
    font-size: 22px;
    line-height: 28px;
    font-weight: 700;
    color: #0f172a;
  }

  .projects-screen__panelSubtext {
    margin: 4px 0 0;
    font-size: 14px;
    line-height: 20px;
    color: #64748b;
  }

  .projects-screen__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }

  .projects-screen__filters {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px;
    border-radius: 20px;
    background: #f1f5f9;
    border: 1px solid rgba(221, 230, 241, 0.92);
  }

  .projects-screen__filter {
    border: none;
    border-radius: 14px;
    background: transparent;
    color: #64748b;
    height: 38px;
    padding: 0 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
  }

  .projects-screen__filter.is-active {
    background: #ffffff;
    color: #0f172a;
    box-shadow: 0 6px 16px rgba(148, 163, 184, 0.16);
  }

  .projects-screen__search {
    min-width: 280px;
    flex: 0 1 340px;
    height: 46px;
    padding: 0 16px;
    border-radius: 16px;
    border: 1px solid rgba(221, 230, 241, 0.92);
    background: #ffffff;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);
  }

  .projects-screen__searchInput {
    width: 100%;
    border: none;
    background: transparent;
    outline: none;
    color: #0f172a;
    font: inherit;
    font-size: 14px;
  }

  .projects-screen__projectsGrid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .projects-screen__projectCard {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-height: 312px;
    padding: 20px;
    border-radius: 24px;
    border: 1px solid rgba(221, 230, 241, 0.92);
    background:
      radial-gradient(circle at top right, rgba(191, 219, 254, 0.22), transparent 26%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(247, 250, 255, 0.98) 100%);
    box-shadow: 0 16px 34px rgba(148, 163, 184, 0.08);
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  }

  .projects-screen__projectCard:hover {
    transform: translateY(-4px);
    border-color: rgba(147, 197, 253, 0.92);
    box-shadow: 0 24px 40px rgba(148, 163, 184, 0.12);
  }

  .projects-screen__projectTop {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .projects-screen__projectTitle {
    margin: 0;
    font-size: 24px;
    line-height: 28px;
    font-weight: 700;
    color: #0f172a;
    font-family: Georgia, "Times New Roman", serif;
  }

  .projects-screen__projectMeta {
    margin: 8px 0 0;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .projects-screen__badge {
    min-height: 30px;
    padding: 0 12px;
    border-radius: 999px;
    background: #eff6ff;
    color: #1d4ed8;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
  }

  .projects-screen__badge.is-soft {
    background: #f1f5f9;
    color: #64748b;
  }

  .projects-screen__projectButton {
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
    color: #ffffff;
    height: 42px;
    padding: 0 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    flex-shrink: 0;
    box-shadow: 0 14px 24px rgba(37, 99, 235, 0.2);
  }

  .projects-screen__sourceCard {
    padding: 16px 16px 14px;
    border-radius: 18px;
    background: #f8fbff;
    border: 1px solid rgba(219, 234, 254, 0.94);
  }

  .projects-screen__sourceLabel {
    margin: 0 0 10px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #64748b;
  }

  .projects-screen__sourceText {
    margin: 0;
    font-size: 16px;
    line-height: 1.55;
    font-weight: 600;
    color: #14213a;
  }

  .projects-screen__projectStats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  .projects-screen__projectStat {
    padding: 12px 12px 10px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.76);
    border: 1px solid rgba(226, 232, 240, 0.94);
  }

  .projects-screen__projectStatLabel {
    margin: 0 0 6px;
    font-size: 11px;
    line-height: 14px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #94a3b8;
  }

  .projects-screen__projectStatValue {
    margin: 0;
    font-size: 14px;
    line-height: 18px;
    font-weight: 700;
    color: #1e293b;
  }

  .projects-screen__projectFooter {
    margin-top: auto;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
  }

  .projects-screen__projectNext {
    margin: 0;
    max-width: 320px;
    font-size: 14px;
    line-height: 1.65;
    color: #5f718a;
  }

  .projects-screen__projectNext strong {
    color: #1e293b;
  }

  .projects-screen__miniPanels {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 18px;
  }

  .projects-screen__laneGrid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .projects-screen__laneCard {
    padding: 18px;
    border-radius: 22px;
    border: 1px solid rgba(221, 230, 241, 0.92);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 255, 0.98) 100%);
  }

  .projects-screen__laneTitle {
    margin: 0 0 10px;
    font-size: 18px;
    line-height: 22px;
    font-weight: 700;
    color: #0f172a;
  }

  .projects-screen__laneList {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .projects-screen__laneItem {
    padding: 12px 14px;
    border-radius: 16px;
    background: #f8fbff;
    border: 1px solid rgba(219, 234, 254, 0.9);
  }

  .projects-screen__laneItemTitle {
    margin: 0 0 4px;
    font-size: 14px;
    line-height: 18px;
    font-weight: 700;
    color: #14213a;
  }

  .projects-screen__laneItemMeta {
    margin: 0;
    font-size: 13px;
    line-height: 18px;
    color: #64748b;
  }

  .projects-screen__activity {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .projects-screen__activityRow {
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 12px;
    align-items: start;
  }

  .projects-screen__activityIcon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: #eff6ff;
    color: #2563eb;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .projects-screen__activityTitle {
    margin: 0 0 4px;
    font-size: 14px;
    line-height: 18px;
    font-weight: 700;
    color: #0f172a;
  }

  .projects-screen__activityText {
    margin: 0;
    font-size: 13px;
    line-height: 1.65;
    color: #64748b;
  }

  @media (max-width: 1480px) {
    .projects-screen__projectsGrid,
    .projects-screen__laneGrid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .projects-screen__heroMetrics,
    .projects-screen__projectStats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .projects-screen__miniPanels {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 1120px) {
    .projects-screen__layout {
      grid-template-columns: 1fr;
    }

    .projects-screen__sidebar {
      border-right: none;
      border-bottom: 1px solid rgba(209, 219, 236, 0.9);
    }

    .projects-screen__projectsGrid,
    .projects-screen__laneGrid,
    .projects-screen__heroMetrics,
    .projects-screen__projectStats {
      grid-template-columns: 1fr;
    }

    .projects-screen__heroRow,
    .projects-screen__panelHeader,
    .projects-screen__toolbar {
      flex-direction: column;
      align-items: flex-start;
    }

    .projects-screen__search {
      width: 100%;
      min-width: 0;
      flex-basis: auto;
    }
  }
`;

const projects = [
  {
    id: 'p-1',
    title: 'Jumuʿah Conditions',
    status: 'ready',
    source: 'Al-Hidayah · Book of Prayer',
    excerpt: 'Current source: "لا تصح الجمعة إلا في مصر جامع..."',
    next: 'Continue at segment 1.3 · refine legal condition phrasing',
    segments: '12/47',
    mode: 'Deep study',
    updated: '2h ago',
  },
  {
    id: 'p-2',
    title: 'Purity Terminology',
    status: 'setup',
    source: 'Mukhtaṣar al-Qudūrī · Purification',
    excerpt: 'Current source: chapter on water types and ritual states',
    next: 'Finish segment labels before study review opens',
    segments: '4/19',
    mode: 'Needs setup',
    updated: 'Yesterday',
  },
  {
    id: 'p-3',
    title: 'Fasting Openings',
    status: 'ready',
    source: 'Book of Fasting · Opening intentions',
    excerpt: 'Current source: intention, timing, and disputed formulations',
    next: 'Resume at segment 3.1 · compare two attributed readings',
    segments: '9/24',
    mode: 'Ready to continue',
    updated: '3 days ago',
  },
];

const navGroups = [
  {
    label: 'Main',
    items: [
      { label: 'Projects', badge: '3', active: true },
      { label: 'Home' },
      { label: 'Study' },
    ],
  },
  {
    label: 'Prepare',
    items: [
      { label: 'Add source' },
      { label: 'Segmentation' },
    ],
  },
  {
    label: 'Review',
    items: [
      { label: 'Corrections' },
      { label: 'Exams' },
    ],
  },
];

const laneCards = [
  {
    title: 'Ready to continue',
    items: [
      { title: 'Jumuʿah Conditions', meta: 'Open next segment · 1.3 Ghusl logic' },
      { title: 'Fasting Openings', meta: 'Resume terminology check · segment 3.1' },
    ],
  },
  {
    title: 'Needs setup',
    items: [
      { title: 'Purity Terminology', meta: 'Segment labels still in progress' },
      { title: 'Prayer Timings', meta: 'Source intake imported, awaiting split' },
    ],
  },
  {
    title: 'Recently reviewed',
    items: [
      { title: 'Friday Khutbah Notes', meta: 'Grade improved from 7.2 to 8.4' },
      { title: 'Water Classifications', meta: 'Discussion summary saved yesterday' },
    ],
  },
];

const activityItems = [
  {
    icon: <PenTool size={18} strokeWidth={1.9} />,
    title: 'Your strongest streak is commentary work',
    text: 'Four study sessions this week ended with saved discussion notes and revision passes.',
  },
  {
    icon: <Layers3 size={18} strokeWidth={1.9} />,
    title: 'Two projects are close to completion',
    text: 'Both are already segmented and only need final translation passes across the remaining segments.',
  },
  {
    icon: <CheckCircle2 size={18} strokeWidth={1.9} />,
    title: 'Last review threshold improved',
    text: 'Your most recent pass came through on attribution clarity and consistent legal terminology.',
  },
];

export default function ProjectsScreen() {
  const [activeFilter, setActiveFilter] = useState('All projects');
  const activeHash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : 'projects';

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All projects') {
      return projects;
    }

    if (activeFilter === 'Ready to continue') {
      return projects.filter((project) => project.status === 'ready');
    }

    return projects.filter((project) => project.status === 'setup');
  }, [activeFilter]);

  return (
    <>
      <style>{projectScreenStyles}</style>
      <div className="projects-screen">
        <div className="projects-screen__testNav">
          {[
            { label: 'Home', hash: 'home' },
            { label: 'Projects', hash: 'projects' },
            { label: 'Segmentation', hash: 'segments' },
            { label: 'Study', hash: 'study' },
          ].map((item) => (
            <button
              key={item.hash}
              type="button"
              className={`projects-screen__testNavButton${activeHash === item.hash || (item.hash === 'projects' && !activeHash) ? ' is-active' : ''}`}
              onClick={() => {
                window.location.hash = item.hash;
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="projects-screen__layout">
          <aside className="projects-screen__sidebar">
            <div className="projects-screen__sidebarInner">
              <div className="projects-screen__workspaceCard">
                <div className="projects-screen__workspaceRow">
                  <div className="projects-screen__avatar">A</div>
                  <div>
                    <p className="projects-screen__workspaceKicker">Arapal</p>
                    <h2 className="projects-screen__workspaceTitle">Deep study</h2>
                  </div>
                </div>
                <p className="projects-screen__workspaceText">
                  One project, one segment, one clear next action. Your workspace should always feel ready.
                </p>
              </div>

              {navGroups.map((group) => (
                <div key={group.label}>
                  <p className="projects-screen__sectionLabel">{group.label}</p>
                  <div className="projects-screen__navGroup">
                    {group.items.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        className={`projects-screen__navButton${item.active ? ' is-active' : ''}`}
                      >
                        <span>{item.label}</span>
                        {item.badge ? (
                          <span className="projects-screen__navBadge">{item.badge}</span>
                        ) : (
                          <ChevronRight size={16} color="#94a3b8" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="projects-screen__sidebarFooter">
                <p className="projects-screen__sidebarFooterTitle">What this screen is for</p>
                <p className="projects-screen__sidebarFooterText">
                  Start where you left off, scan what needs setup, and jump straight into the next useful action.
                </p>
                <button type="button" className="projects-screen__sidebarLink">
                  Open workflow notes
                  <ArrowRight size={15} strokeWidth={1.9} />
                </button>
              </div>
            </div>
          </aside>

          <main className="projects-screen__main">
            <div className="projects-screen__mainInner">
              <section className="projects-screen__hero">
                <div className="projects-screen__heroRow">
                  <div className="projects-screen__heroText">
                    <p className="projects-screen__sectionLabel" style={{ marginBottom: 10 }}>Projects</p>
                    <h1 className="projects-screen__heroTitle">Return to the exact point your study left off.</h1>
                    <p className="projects-screen__heroLead">
                      Open an active project in one click, start a new source intake, or scan which texts are ready for a serious next pass.
                    </p>
                  </div>

                  <div className="projects-screen__heroActions">
                    <button type="button" className="projects-screen__button projects-screen__button--ghost">
                      <Sparkles size={16} strokeWidth={1.9} />
                      Review workflow
                    </button>
                    <button type="button" className="projects-screen__button">
                      <Plus size={16} strokeWidth={1.9} />
                      Create new project
                    </button>
                  </div>
                </div>

                <div className="projects-screen__heroMetrics">
                  <div className="projects-screen__metric">
                    <p className="projects-screen__metricLabel">Active projects</p>
                    <p className="projects-screen__metricValue">03</p>
                    <p className="projects-screen__metricMeta">Each with a clearly staged next step.</p>
                  </div>
                  <div className="projects-screen__metric">
                    <p className="projects-screen__metricLabel">Ready to continue</p>
                    <p className="projects-screen__metricValue">02</p>
                    <p className="projects-screen__metricMeta">Open directly into the next segment.</p>
                  </div>
                  <div className="projects-screen__metric">
                    <p className="projects-screen__metricLabel">Needs setup</p>
                    <p className="projects-screen__metricValue">01</p>
                    <p className="projects-screen__metricMeta">Segmentation or metadata is still pending.</p>
                  </div>
                  <div className="projects-screen__metric">
                    <p className="projects-screen__metricLabel">Study rhythm</p>
                    <p className="projects-screen__metricValue">4d</p>
                    <p className="projects-screen__metricMeta">Current weekly streak across deep study sessions.</p>
                  </div>
                </div>
              </section>

              <section className="projects-screen__panel">
                <div className="projects-screen__panelHeader">
                  <div>
                    <p className="projects-screen__panelTitle">Recent projects</p>
                    <h2 className="projects-screen__panelLead">Continue, review, or prepare the next source.</h2>
                    <p className="projects-screen__panelSubtext">
                      The cards below are arranged for immediate action rather than archive browsing.
                    </p>
                  </div>
                </div>

                <div className="projects-screen__toolbar">
                  <div className="projects-screen__filters">
                    {['All projects', 'Ready to continue', 'Needs setup'].map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        className={`projects-screen__filter${activeFilter === filter ? ' is-active' : ''}`}
                        onClick={() => setActiveFilter(filter)}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <div className="projects-screen__search">
                    <Search size={16} color="#94a3b8" strokeWidth={1.9} />
                    <input
                      className="projects-screen__searchInput"
                      placeholder="Search projects, sources, or segments..."
                    />
                    <SlidersHorizontal size={16} color="#94a3b8" strokeWidth={1.9} />
                  </div>
                </div>

                <div className="projects-screen__projectsGrid">
                  {filteredProjects.map((project) => (
                    <article key={project.id} className="projects-screen__projectCard">
                      <div className="projects-screen__projectTop">
                        <div>
                          <h3 className="projects-screen__projectTitle">{project.title}</h3>
                          <div className="projects-screen__projectMeta">
                            <span className="projects-screen__badge">{project.mode}</span>
                            <span className="projects-screen__badge is-soft">{project.updated}</span>
                          </div>
                        </div>

                        <button type="button" className="projects-screen__projectButton">
                          Open next segment
                          <ArrowRight size={14} strokeWidth={1.9} />
                        </button>
                      </div>

                      <div className="projects-screen__sourceCard">
                        <p className="projects-screen__sourceLabel">{project.source}</p>
                        <p className="projects-screen__sourceText">{project.excerpt}</p>
                      </div>

                      <div className="projects-screen__projectStats">
                        <div className="projects-screen__projectStat">
                          <p className="projects-screen__projectStatLabel">Segments</p>
                          <p className="projects-screen__projectStatValue">{project.segments}</p>
                        </div>
                        <div className="projects-screen__projectStat">
                          <p className="projects-screen__projectStatLabel">Mode</p>
                          <p className="projects-screen__projectStatValue">{project.status === 'ready' ? 'Study' : 'Setup'}</p>
                        </div>
                        <div className="projects-screen__projectStat">
                          <p className="projects-screen__projectStatLabel">Recent state</p>
                          <p className="projects-screen__projectStatValue">{project.status === 'ready' ? 'Resume' : 'Prepare'}</p>
                        </div>
                      </div>

                      <div className="projects-screen__projectFooter">
                        <p className="projects-screen__projectNext">
                          <strong>What next:</strong> {project.next}
                        </p>
                        <FolderOpen size={22} color="#94a3b8" strokeWidth={1.9} />
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="projects-screen__miniPanels">
                <div className="projects-screen__panel">
                  <div className="projects-screen__panelHeader">
                    <div>
                      <p className="projects-screen__panelTitle">Study lanes</p>
                      <h2 className="projects-screen__panelLead">See where every project lives in the workflow.</h2>
                    </div>
                  </div>

                  <div className="projects-screen__laneGrid">
                    {laneCards.map((lane) => (
                      <div key={lane.title} className="projects-screen__laneCard">
                        <h3 className="projects-screen__laneTitle">{lane.title}</h3>
                        <div className="projects-screen__laneList">
                          {lane.items.map((item) => (
                            <div key={item.title} className="projects-screen__laneItem">
                              <p className="projects-screen__laneItemTitle">{item.title}</p>
                              <p className="projects-screen__laneItemMeta">{item.meta}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="projects-screen__panel">
                  <div className="projects-screen__panelHeader">
                    <div>
                      <p className="projects-screen__panelTitle">Project pulse</p>
                      <h2 className="projects-screen__panelLead">A quick read on what matters this week.</h2>
                    </div>
                  </div>

                  <div className="projects-screen__activity">
                    {activityItems.map((item) => (
                      <div key={item.title} className="projects-screen__activityRow">
                        <div className="projects-screen__activityIcon">{item.icon}</div>
                        <div>
                          <p className="projects-screen__activityTitle">{item.title}</p>
                          <p className="projects-screen__activityText">{item.text}</p>
                        </div>
                      </div>
                    ))}

                    <div className="projects-screen__laneCard" style={{ marginTop: 6 }}>
                      <h3 className="projects-screen__laneTitle">Next best action</h3>
                      <p className="projects-screen__activityText" style={{ marginBottom: 14 }}>
                        Resume <strong>Jumuʿah Conditions</strong> from segment 1.3, then save a short discussion note while the legal terminology is still fresh.
                      </p>
                      <button type="button" className="projects-screen__button" style={{ width: '100%' }}>
                        <BookOpen size={16} strokeWidth={1.9} />
                        Open the study workspace
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
