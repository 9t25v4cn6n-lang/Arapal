import { useEffect, useRef, useState } from 'react';
import { Award, Book, ChevronsLeft, ChevronsRight, Info, Maximize2, Minimize2, Move, ScrollText, Sparkles, X } from 'lucide-react';

const rightPanelStyles = `
  .fg-right,
  .fg-right * {
    box-sizing: border-box;
  }

  .fg-right {
    width: 100%;
    height: 100%;
    min-height: 0;
    flex: 0 0 auto;
    align-self: stretch;
    position: relative;
    z-index: 5;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #dde6f1;
    background: #fbfcfe;
    overflow-x: hidden;
    overflow-y: hidden;
  }

  .fg-right__header {
    height: 48px;
    padding: 0 14px 0 16px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #62748e;
    flex-shrink: 0;
    background: #fbfcfe;
  }

  .fg-right__toggle {
    border: none;
    background: transparent;
    color: #94a3b8;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s ease;
  }

  .fg-right__toggle:hover {
    color: #1e293b;
  }

  .fg-right__body {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .fg-right__rail {
    width: 100%;
    height: 100%;
    padding: 16px 10px 18px;
    position: relative;
  }

  .fg-right__railScroll {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .fg-right__railScroll::-webkit-scrollbar {
    display: none;
  }

  .fg-right__railList {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
    gap: 14px;
  }

  .fg-right__railIcon {
    width: 100%;
    min-height: var(--rail-height, 88px);
    border: 1px solid #dfe8f4;
    border-radius: 12px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .fg-right__railIcon:hover {
    background: #f8fbff;
    border-color: #c7d8ee;
  }

  .fg-right__railFade {
    position: absolute;
    left: 10px;
    right: 10px;
    height: 20px;
    pointer-events: none;
    z-index: 2;
    transition: opacity 0.2s ease;
  }

  .fg-right__railFade--top {
    top: 16px;
    background: linear-gradient(180deg, rgba(251, 252, 254, 0.96) 0%, rgba(251, 252, 254, 0) 100%);
  }

  .fg-right__railFade--bottom {
    bottom: 18px;
    background: linear-gradient(0deg, rgba(251, 252, 254, 0.96) 0%, rgba(251, 252, 254, 0) 100%);
  }

  .fg-right__railIndicator {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 24px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid #dfe8f4;
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
  }

  .fg-right__railIndicator--top {
    top: 16px;
  }

  .fg-right__railIndicator--bottom {
    bottom: 18px;
  }

  .fg-right__floating {
    position: fixed;
    z-index: 40;
    width: 360px;
    min-width: 320px;
    max-width: min(360px, calc(100vw - 120px));
    min-height: 220px;
    max-height: min(78vh, 760px);
    border: 1px solid #dfe8f4;
    border-radius: 18px;
    background: #ffffff;
    overflow: auto;
    box-shadow: 0 18px 42px rgba(15, 23, 42, 0.16), 0 6px 18px rgba(15, 23, 42, 0.08);
    resize: both;
    display: flex;
    flex-direction: column;
  }

  .fg-right__floatingHeader {
    min-height: 52px;
    padding: 0 16px 0 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid var(--panel-border, #e2e8f0);
    background: var(--panel-bg, #f8fafc);
    cursor: grab;
  }

  .fg-right__floatingHeader:active {
    cursor: grabbing;
  }

  .fg-right__floatingActions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fg-right__floatingPin {
    border: none;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.84);
    color: #475569;
    min-height: 28px;
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .fg-right__floatingPin:hover {
    background: #ffffff;
    color: #0f172a;
  }

  .fg-right__floatingClose {
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.84);
    color: #64748b;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .fg-right__floatingClose:hover {
    background: #ffffff;
    color: #0f172a;
  }

  .fg-right__floatingBody {
    flex: 1;
    min-height: 0;
    padding: 18px 18px 32px;
    background: #ffffff;
    overflow: auto;
  }

  .fg-right__content {
    height: 100%;
    padding: 14px 14px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
    scrollbar-gutter: stable;
  }

  .fg-right__card {
    margin-top: 0;
    position: relative;
    flex-shrink: 0;
    z-index: 1;
    border: 1px solid #dfe8f4;
    border-radius: 18px;
    background: #ffffff;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.05);
  }

  .fg-right__cardHeader {
    min-height: 46px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid var(--panel-border, #e2e8f0);
    background: var(--panel-bg, #f8fafc);
  }

  .fg-right__cardTitle {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #1d293d;
  }

  .fg-right__expand {
    margin-left: auto;
    width: 22px;
    height: 22px;
    border: none;
    border-radius: 0;
    background: transparent;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .fg-right__expand:hover {
    background: var(--expand-bg, #eff6ff);
    color: var(--expand-color, #2563eb);
  }

  .fg-right__cardBody {
    padding: 14px 16px 18px;
  }

  .fg-right__centered {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fg-right__circleGrade {
    width: 96px;
    height: 96px;
    border: 4px solid #bbf7d0;
    border-radius: 999px;
    background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fg-right__circleGradeLarge {
    width: 128px;
    height: 128px;
    border: 4px solid #bbf7d0;
    border-radius: 999px;
    background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 18px 32px rgba(5, 150, 105, 0.16);
  }

  .fg-right__gradeValue {
    font-size: 30px;
    font-weight: 700;
    color: #047857;
  }

  .fg-right__gradeValueLarge {
    font-size: 48px;
    font-weight: 700;
    color: #047857;
  }

  .fg-right__stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .fg-right__feedbackBlock {
    padding: 12px;
    border: 1px solid var(--feedback-border, #e2e8f0);
    border-radius: 12px;
    background: var(--feedback-bg, #f8fafc);
  }

  .fg-right__feedbackBlockLarge {
    padding: 24px;
    border: 1px solid var(--feedback-border, #e2e8f0);
    border-radius: 16px;
    background: var(--feedback-bg, #f8fafc);
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
  }

  .fg-right__feedbackTitle {
    margin: 0 0 6px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    color: var(--feedback-title, #334155);
  }

  .fg-right__feedbackTitleLarge {
    margin: 0 0 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
    color: var(--feedback-title, #334155);
  }

  .fg-right__dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: currentColor;
    display: inline-block;
  }

  .fg-right__smallDot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: currentColor;
    display: inline-block;
  }

  .fg-right__text {
    margin: 0;
    font-size: 14px;
    line-height: 1.58;
    color: #415268;
  }

  .fg-right__textLarge {
    margin: 0;
    font-size: 16px;
    line-height: 1.75;
    color: #374151;
  }

  .fg-right__muted {
    color: #45556c;
  }

  .fg-right__arabic {
    font-family: "Amiri", "Noto Naskh Arabic", "Geeza Pro", serif;
    font-weight: 700;
    color: #111827;
    font-size: 16px;
    line-height: 1.4;
  }

  .fg-right__inlineArabic {
    font-family: "Amiri", "Noto Naskh Arabic", "Geeza Pro", serif;
    font-weight: 700;
    color: #111827;
    font-size: 1em;
    line-height: inherit;
    display: inline-block;
    direction: rtl;
    unicode-bidi: isolate;
    vertical-align: middle;
    transform: translateY(1px);
  }

  .fg-right__mono {
    font-family: "SFMono-Regular", "JetBrains Mono", "Menlo", monospace;
    font-size: 12px;
    line-height: 1.2;
    display: inline-flex;
    align-items: center;
    color: #74839a;
  }

  .fg-right__bulletList {
    margin: 0;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: #374151;
  }

  .fg-right__takeawayList {
    display: grid;
    gap: 24px;
  }

  .fg-right__takeawayItem {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 24px;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
  }

  .fg-right__takeawayNumber {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    background: #e0e7ff;
    color: #4f46e5;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 18px;
    font-weight: 700;
    margin-top: 4px;
  }

  .fg-right__takeawayTitle {
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: 700;
    color: #111827;
  }

  .fg-right__takeawayText {
    margin: 0;
    font-size: 16px;
    line-height: 1.75;
    color: #374151;
  }

  .fg-right__listRow {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .fg-right__listDot {
    width: 6px;
    height: 6px;
    margin-top: 8px;
    border-radius: 999px;
    background: #6366f1;
    flex-shrink: 0;
  }

  .fg-right__entry {
    padding-bottom: 12px;
    border-bottom: 1px solid #f3f4f6;
  }

  .fg-right__entry:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  .fg-right__entryRow {
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .fg-right__contextBox {
    margin-top: 10px;
    padding: 12px 14px;
    border: 1px solid #f3f4f6;
    border-radius: 8px;
    background: #f9fafb;
    font-size: 12px;
    line-height: 1.58;
    color: #45556c;
  }

  .fg-right__scrollFrame {
    max-height: var(--scroll-max-height, none);
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 8px;
    padding-bottom: 18px;
    scrollbar-gutter: stable;
  }

  .fg-right__scrollFrame--soft {
    padding-right: 10px;
  }

  .fg-right__meta {
    margin: 0 0 18px;
    text-align: center;
    font-size: 12px;
    line-height: 1.5;
    color: #64748b;
  }

  .fg-right__meta strong {
    color: #1f2937;
  }

  .fg-right__emptyBlock {
    padding: 16px 18px;
    border: 1px dashed #dbe4ef;
    border-radius: 14px;
    background: rgba(248, 250, 252, 0.72);
  }

  .fg-right__emptyTitle {
    margin: 0 0 6px;
    font-size: 13px;
    font-weight: 700;
    color: #64748b;
  }

  .fg-right__emptyText {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: #94a3b8;
  }

  .fg-right__modalBackdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    padding: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
  }

  .fg-right__modal {
    width: 100%;
    max-width: 1120px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    background: #ffffff;
    overflow: hidden;
    box-shadow: 0 28px 56px rgba(15, 23, 42, 0.24);
  }

  .fg-right__modalHeader {
    padding: 20px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    border-bottom: 1px solid #e5e7eb;
    background: var(--panel-bg, #f8fafc);
  }

  .fg-right__modalTitleRow {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .fg-right__modalTitle {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #111827;
  }

  .fg-right__modalActions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fg-right__close {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .fg-right__close:hover {
    background: var(--expand-bg, #eff6ff);
    color: var(--expand-color, #2563eb);
  }

  .fg-right__modalBody {
    flex: 1;
    overflow: auto;
    background: #ffffff;
  }

  .fg-right__modalSection {
    padding: 32px;
  }

  .fg-right__modalCentered {
    min-height: 400px;
    padding: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #6b7280;
  }

  .fg-right__modalHeading {
    margin: 0 0 24px;
    font-size: 24px;
    font-weight: 700;
    color: #111827;
  }

  .fg-right__modalLead {
    margin: 0 0 24px;
    font-size: 18px;
    line-height: 1.75;
    color: #374151;
  }

  .fg-right__tableWrap {
    padding: 32px;
    overflow: auto;
  }

  .fg-right__table {
    width: 100%;
    border-collapse: collapse;
  }

  .fg-right__table th {
    padding: 12px 16px;
    border-bottom: 2px solid #d1d5db;
    text-align: left;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #374151;
    vertical-align: top;
  }

  .fg-right__table td {
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
    vertical-align: top;
    font-size: 14px;
    line-height: 1.65;
    color: #374151;
  }

  .fg-right__tableRow:hover {
    background: rgba(250, 245, 255, 0.5);
  }

  .fg-right__tableFooter {
    padding: 16px 32px;
    border-top: 1px solid #e5e7eb;
    background: #f9fafb;
    font-size: 12px;
    color: #6b7280;
  }

  .fg-right__thread {
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
  }

  .fg-right__message {
    padding: 24px;
    display: flex;
    gap: 16px;
    border-bottom: 1px solid #f3f4f6;
  }

  .fg-right__message:last-child {
    border-bottom: none;
  }

  .fg-right__message.is-alt {
    background: #f8fafc;
  }

  .fg-right__avatar {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-weight: 700;
  }

  .fg-right__avatar.is-reviewer {
    background: #e2e8f0;
    color: #475569;
  }

  .fg-right__avatar.is-user {
    background: #bfdbfe;
    color: #1d4ed8;
  }

  .fg-right__messageMeta {
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fg-right__messageAuthor {
    font-weight: 700;
    color: #111827;
  }

  .fg-right__messageTime {
    font-size: 14px;
    color: #6b7280;
  }

  .fg-right__emptyIcon {
    margin-bottom: 24px;
  }

  .fg-right__variant--guidance .fg-right__cardHeader {
    background: #f3f7ff;
  }

  .fg-right__variant--lexicography .fg-right__cardHeader {
    background: #faf5ff;
  }

  .fg-right__variant--summary .fg-right__cardHeader {
    background: #ecfdf5;
  }

  .fg-right__variant--discussion .fg-right__cardHeader {
    background: #fff7ed;
  }

  .fg-right__variant--phrasing .fg-right__cardHeader {
    background: #fff7ed;
  }
`;

const tones = {
  rose: {
    panelBg: 'rgba(254, 242, 242, 0.94)',
    panelBorder: 'rgba(252, 165, 165, 0.86)',
    expandBg: '#fee2e2',
    expandColor: '#dc2626',
    iconColor: '#dc2626',
  },
  emerald: {
    panelBg: 'rgba(236, 253, 245, 0.82)',
    panelBorder: 'rgba(167, 243, 208, 0.85)',
    expandBg: '#d1fae5',
    expandColor: '#059669',
    iconColor: '#059669',
  },
  blue: {
    panelBg: 'rgba(239, 246, 255, 0.82)',
    panelBorder: 'rgba(191, 219, 254, 0.85)',
    expandBg: '#dbeafe',
    expandColor: '#2563eb',
    iconColor: '#2563eb',
  },
  indigo: {
    panelBg: 'rgba(238, 242, 255, 0.9)',
    panelBorder: 'rgba(199, 210, 254, 0.85)',
    expandBg: '#e0e7ff',
    expandColor: '#4f46e5',
    iconColor: '#4f46e5',
  },
  purple: {
    panelBg: 'rgba(250, 245, 255, 0.92)',
    panelBorder: 'rgba(233, 213, 255, 0.85)',
    expandBg: '#f3e8ff',
    expandColor: '#9333ea',
    iconColor: '#9333ea',
  },
  orange: {
    panelBg: 'rgba(255, 247, 237, 0.92)',
    panelBorder: 'rgba(254, 215, 170, 0.85)',
    expandBg: '#ffedd5',
    expandColor: '#ea580c',
    iconColor: '#ea580c',
  },
};

function toneVars(tone) {
  return {
    '--panel-bg': tone.panelBg,
    '--panel-border': tone.panelBorder,
    '--expand-bg': tone.expandBg,
    '--expand-color': tone.expandColor,
  };
}

function PanelCard({ tone, icon, title, expandLabel, onExpand, children, bodyStyle }) {
  return (
    <div className={`fg-right__card fg-right__variant--${title.toLowerCase().split(' ')[0]}`}>
      <div className="fg-right__cardHeader" style={toneVars(tone)}>
        {icon}
        <h3 className="fg-right__cardTitle">{title}</h3>
        <button className="fg-right__expand" type="button" aria-label={expandLabel} onClick={onExpand} style={toneVars(tone)}>
          <Maximize2 size={15} strokeWidth={1.9} />
        </button>
      </div>
      <div className="fg-right__cardBody" style={bodyStyle}>{children}</div>
    </div>
  );
}

function SummaryIcon({ color = '#059669', size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 7H17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 11H17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 15H13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <rect x="4.5" y="4.5" width="13" height="15" rx="2.2" stroke={color} strokeWidth="1.8" />
      <path d="M17.5 9.5H19.5C20.6046 9.5 21.5 10.3954 21.5 11.5V18.5C21.5 19.6046 20.6046 20.5 19.5 20.5H10.5C9.39543 20.5 8.5 19.6046 8.5 18.5V19.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DiscussionIcon({ color = '#ea580c', size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 7.5H17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 11.5H14" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 16.5H10.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 4.5H18C19.1046 4.5 20 5.39543 20 6.5V15.5C20 16.6046 19.1046 17.5 18 17.5H11.5L7 20.5V17.5H6C4.89543 17.5 4 16.6046 4 15.5V6.5C4 5.39543 4.89543 4.5 6 4.5Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export default function RightPanel({
  submissionState = 'draft',
  isCollapsed = false,
  onToggleCollapse,
} = {}) {
  const isSubmitted = submissionState === 'submitted';
  const isFailed = submissionState === 'failed';
  const [expandedCard, setExpandedCard] = useState(null);
  const [hoveredPreviewId, setHoveredPreviewId] = useState(null);
  const [pinnedPreviewId, setPinnedPreviewId] = useState(null);
  const [floatingPosition, setFloatingPosition] = useState({ x: 1040, y: 124 });
  const [dragState, setDragState] = useState(null);
  const [railScrollState, setRailScrollState] = useState({ canScrollUp: false, canScrollDown: false });
  const closePreviewTimeoutRef = useRef(null);
  const railScrollRef = useRef(null);
  const isExpanded = !isCollapsed;

  const collapsedCards = isSubmitted
    ? [
        { id: 'grade', tone: tones.emerald, railHeight: 104, icon: <Award size={18} color={tones.emerald.iconColor} strokeWidth={1.9} /> },
        { id: 'takeaways', tone: tones.indigo, railHeight: 156, icon: <Sparkles size={18} color={tones.indigo.iconColor} strokeWidth={1.9} /> },
        { id: 'lexicography', tone: tones.purple, railHeight: 186, icon: <Book size={18} color={tones.purple.iconColor} strokeWidth={1.9} /> },
      ]
    : isFailed
      ? [
          { id: 'grade', tone: tones.rose, railHeight: 120, icon: <Award size={18} color={tones.rose.iconColor} strokeWidth={1.9} /> },
          { id: 'fixsteps', tone: tones.orange, railHeight: 176, icon: <Sparkles size={18} color={tones.orange.iconColor} strokeWidth={1.9} /> },
          { id: 'lexicography', tone: tones.purple, railHeight: 186, icon: <Book size={18} color={tones.purple.iconColor} strokeWidth={1.9} /> },
        ]
    : [
        { id: 'guidance', tone: tones.blue, railHeight: 132, icon: <Info size={18} color={tones.blue.iconColor} strokeWidth={1.9} /> },
        { id: 'lexicography', tone: tones.purple, railHeight: 220, icon: <Book size={18} color={tones.purple.iconColor} strokeWidth={1.9} /> },
        { id: 'phrasing', tone: tones.orange, railHeight: 180, icon: <ScrollText size={18} color={tones.orange.iconColor} strokeWidth={1.9} /> },
      ];

  const syncRailScrollState = () => {
    const node = railScrollRef.current;
    if (!node) {
      return;
    }

    setRailScrollState({
      canScrollUp: node.scrollTop > 6,
      canScrollDown: node.scrollTop + node.clientHeight < node.scrollHeight - 6,
    });
  };

  useEffect(() => {
    if (!dragState) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      setFloatingPosition({
        x: Math.max(240, Math.min(window.innerWidth - 380, event.clientX - dragState.offsetX)),
        y: Math.max(88, Math.min(window.innerHeight - 220, event.clientY - dragState.offsetY)),
      });
    };

    const stopDragging = () => setDragState(null);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopDragging);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopDragging);
    };
  }, [dragState]);

  useEffect(() => {
    if (isExpanded) {
      setHoveredPreviewId(null);
      setPinnedPreviewId(null);
      setDragState(null);
    }
  }, [isExpanded]);

  useEffect(() => () => {
    if (closePreviewTimeoutRef.current) {
      window.clearTimeout(closePreviewTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isExpanded) {
      syncRailScrollState();
      const handleResize = () => syncRailScrollState();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }

    return undefined;
  }, [isExpanded, collapsedCards.length]);

  const clearPendingClose = () => {
    if (closePreviewTimeoutRef.current) {
      window.clearTimeout(closePreviewTimeoutRef.current);
      closePreviewTimeoutRef.current = null;
    }
  };

  const openPreview = (cardId, anchorRect) => {
    clearPendingClose();
    setHoveredPreviewId(cardId);
    if (!pinnedPreviewId) {
      const previewWidth = cardId === 'discussion' ? 392 : cardId === 'lexicography' ? 380 : 360;
      const previewHeight = cardId === 'discussion' ? 460 : cardId === 'lexicography' ? 420 : 360;
      const nextLeft = anchorRect
        ? Math.max(240, Math.min(window.innerWidth - previewWidth - 20, anchorRect.left - previewWidth - 18))
        : Math.max(240, window.innerWidth - 456);
      const nextTop = anchorRect
        ? Math.max(88, Math.min(window.innerHeight - previewHeight - 24, anchorRect.top + (anchorRect.height / 2) - (previewHeight / 2)))
        : 112;

      setFloatingPosition({
        x: nextLeft,
        y: nextTop,
      });
    }
  };

  const closePreview = () => {
    clearPendingClose();
    if (!pinnedPreviewId) {
      closePreviewTimeoutRef.current = window.setTimeout(() => {
        setHoveredPreviewId(null);
        closePreviewTimeoutRef.current = null;
      }, 120);
    }
  };

  const renderGuidanceBody = () => (
    <p className="fg-right__text">
      Focus on accurately translating the conditions for Jumu&apos;ah validity. Pay close attention to the definition of{' '}
      <span className="fg-right__inlineArabic" dir="rtl">مصر جامع</span> (comprehensive city) and its components.
      Distinguish between the different opinions and their attributions.
    </p>
  );

  const renderTakeawaysBody = () => (
    <div className="fg-right__stack" style={{ gap: 18 }}>
      <div className="fg-right__listRow">
        <span className="fg-right__listDot" />
        <p className="fg-right__text">
          The term <span className="fg-right__inlineArabic" dir="rtl">مصر جامع</span> requires careful breakdown as it
          sets the legal precedent for Friday prayers.
        </p>
      </div>
      <div className="fg-right__listRow">
        <span className="fg-right__listDot" />
        <p className="fg-right__text">Differing opinions (al-Karkhī vs al-Thaljī) should be clearly attributed.</p>
      </div>
      <div className="fg-right__listRow">
        <span className="fg-right__listDot" />
        <p className="fg-right__text">
          The physical expansion of the city (<span className="fg-right__inlineArabic" dir="rtl">أفنية</span>) carries
          the same legal weight as the center.
        </p>
      </div>
    </div>
  );

  const renderFixStepsBody = () => (
    <div className="fg-right__stack" style={{ gap: 18 }}>
      <div className="fg-right__listRow">
        <span className="fg-right__listDot" style={{ background: '#f97316' }} />
        <p className="fg-right__text">State the Friday prayer ruling as a condition of validity, not a recommendation.</p>
      </div>
      <div className="fg-right__listRow">
        <span className="fg-right__listDot" style={{ background: '#f97316' }} />
        <p className="fg-right__text">Clarify who holds each opinion so Abū Yūsuf and the secondary view are not blended together.</p>
      </div>
      <div className="fg-right__listRow">
        <span className="fg-right__listDot" style={{ background: '#f97316' }} />
        <p className="fg-right__text">Keep <span className="fg-right__inlineArabic" dir="rtl">أفنية</span> tied to the legal extension of the city, not just its geography.</p>
      </div>
    </div>
  );

  const renderLexicographyBody = () => (
    <div
      className="fg-right__stack fg-right__scrollFrame fg-right__scrollFrame--soft"
      style={{ gap: 14, '--scroll-max-height': '220px' }}
    >
      <div className="fg-right__entry">
        <div className="fg-right__entryRow">
          <span className="fg-right__arabic" dir="rtl">مصر جامع</span>
          <span className="fg-right__mono">miṣr jāmiʿ</span>
        </div>
        <p className="fg-right__text">Comprehensive city; a large urban center with civic amenities.</p>
        <div className="fg-right__contextBox">
          <strong>Context:</strong> In Hanafi fiqh, typically defined by having a judge (qadi) and a ruler (amir)
          capable of enforcing laws.
        </div>
      </div>

      <div className="fg-right__entry">
        <div className="fg-right__entryRow">
          <span className="fg-right__arabic" dir="rtl">أفنية</span>
          <span className="fg-right__mono">afniyah</span>
        </div>
        <p className="fg-right__text">Outskirts, courtyards, or immediate surrounding areas attached to the city.</p>
      </div>
    </div>
  );

  const gradeSections = [
    {
      key: 'strengths',
      title: 'Strengths',
      titleColor: '#047857',
      dotColor: '#059669',
      background: '#ecfdf5',
      border: '#d1fae5',
      text:
        'Excellent accuracy in translating technical terminology, particularly "miṣr jāmiʿ" and the attribution to Abū Yūsuf.',
    },
    {
      key: 'improvements',
      title: 'Areas for Improvement',
      titleColor: '#b45309',
      dotColor: '#d97706',
      background: '#fffbeb',
      border: '#fde68a',
      text:
        'Consider providing more context for "al-Karkhī" and "al-Thaljī" to help readers unfamiliar with Hanafi scholarship.',
    },
    {
      key: 'suggestion',
      title: 'Suggestion',
      titleColor: '#1d4ed8',
      dotColor: '#2563eb',
      background: '#eff6ff',
      border: '#dbeafe',
      text:
        'The phrase "meat-drying" for "تشريق" is accurate but may benefit from a brief explanatory note in brackets.',
    },
  ];

  const renderFeedbackSection = (section, large = false) => {
    const blockClass = large ? 'fg-right__feedbackBlockLarge' : 'fg-right__feedbackBlock';
    const titleClass = large ? 'fg-right__feedbackTitleLarge' : 'fg-right__feedbackTitle';
    const textClass = large ? 'fg-right__textLarge' : 'fg-right__text';

    if (!section.text) {
      return (
        <div
          className={blockClass}
          style={{
            '--feedback-bg': '#f8fafc',
            '--feedback-border': '#dbe4ef',
            '--feedback-title': '#64748b',
          }}
        >
          <h4 className={titleClass}>{section.title}</h4>
          <div className="fg-right__emptyBlock">
            <p className="fg-right__emptyTitle">Nothing saved yet</p>
            <p className="fg-right__emptyText">This section will populate once discussion feedback is generated.</p>
          </div>
        </div>
      );
    }

    return (
      <div
        className={blockClass}
        style={{
          '--feedback-bg': section.background,
          '--feedback-border': section.border,
          '--feedback-title': section.titleColor,
        }}
      >
        <h4 className={titleClass}>
          <span className={large ? 'fg-right__smallDot' : 'fg-right__dot'} style={{ color: section.dotColor }} />
          {section.title}
        </h4>
        <p className={textClass}>{section.text}</p>
      </div>
    );
  };

  const renderPhrasingBody = () => (
    <div className="fg-right__stack" style={{ gap: 16 }}>
      <div className="fg-right__entry">
        <div className="fg-right__entryRow">
          <span className="fg-right__arabic" dir="rtl">لا تصح الجمعة إلا في مصر جامع</span>
          <span className="fg-right__mono">miṣr jamiʿ</span>
        </div>
        <p className="fg-right__text">
          Phrase this as a condition of validity, not a recommendation: &quot;The Friday prayer is only valid in a comprehensive
          city.&quot;
        </p>
      </div>

      <div className="fg-right__entry">
        <div className="fg-right__entryRow">
          <span className="fg-right__arabic" dir="rtl">بل تجوز في جميع أفنية المصر</span>
          <span className="fg-right__mono">afniyat al-miṣr</span>
        </div>
        <p className="fg-right__text">
          Preserve the argumentative turn here: &quot;rather, it is permissible throughout all the outskirts of the city.&quot;
        </p>
      </div>
    </div>
  );

  const renderSummaryBody = () => (
    <div className="fg-right__stack">
      <p className="fg-right__text" style={{ color: '#6b7280', fontStyle: 'italic', paddingBottom: 6 }}>
        Summary generation is pending for this segment.
      </p>
    </div>
  );

  const renderDiscussionNotesBody = () => (
    <div
      className="fg-right__feedbackBlock"
      style={{
        '--feedback-bg': '#f8fafc',
        '--feedback-border': '#e8edf5',
        '--feedback-title': '#64748b',
        paddingBottom: 18,
      }}
    >
      <h4 className="fg-right__feedbackTitle">Reviewer A</h4>
      <p className="fg-right__text">
        Ensure we consistently translate &quot;مصر&quot; as &quot;city&quot; rather than &quot;town&quot; to reflect the Hanafi stipulation
        of size and amenities.
      </p>
    </div>
  );

  const renderGradeBody = () => (
    <>
      <div className="fg-right__centered" style={{ marginBottom: 16 }}>
        <div
          className="fg-right__circleGrade"
          style={
            isFailed
              ? {
                  borderColor: '#fca5a5',
                  background: 'linear-gradient(135deg, #fee2e2 0%, #fff1f2 100%)',
                }
              : undefined
          }
        >
          <span className="fg-right__gradeValue" style={isFailed ? { color: '#dc2626' } : undefined}>
            {isFailed ? '4.2' : '8.4'}
          </span>
        </div>
      </div>

      <p className="fg-right__meta">
        <strong>Reviewed:</strong> 15 Mar 2026
        <br />
        {isFailed ? 'This attempt needs revision before it can pass.' : 'Model evaluation with a scholar-facing rubric'}
      </p>

      <div className="fg-right__stack">
        {(isFailed
          ? [
              {
                key: 'issue',
                title: 'Why it failed',
                titleColor: '#b91c1c',
                dotColor: '#dc2626',
                background: '#fef2f2',
                border: '#fecaca',
                text:
                  'The legal condition is not firm enough, and the attribution of the opinions is still too loose for a passing translation.',
              },
              {
                key: 'what-to-fix',
                title: 'What to fix first',
                titleColor: '#c2410c',
                dotColor: '#f97316',
                background: '#fff7ed',
                border: '#fed7aa',
                text:
                  'Rewrite the opening clause and make the difference between the primary and secondary opinions explicit before resubmitting.',
              },
            ]
          : gradeSections).map((section) => (
          <div key={section.key}>{renderFeedbackSection(section)}</div>
        ))}
      </div>
    </>
  );

  const visibleCards = isSubmitted
    ? [
        { id: 'grade', title: 'Your Grade', tone: tones.emerald, icon: <Award size={18} color={tones.emerald.iconColor} strokeWidth={1.9} />, body: renderGradeBody() },
        { id: 'takeaways', title: 'Key Takeaways', tone: tones.indigo, icon: <Sparkles size={18} color={tones.indigo.iconColor} strokeWidth={1.9} />, body: renderTakeawaysBody() },
        { id: 'lexicography', title: 'Lexicography', tone: tones.purple, icon: <Book size={18} color={tones.purple.iconColor} strokeWidth={1.9} />, body: renderLexicographyBody() },
      ]
    : isFailed
      ? [
          { id: 'grade', title: 'Your Grade', tone: tones.rose, icon: <Award size={18} color={tones.rose.iconColor} strokeWidth={1.9} />, body: renderGradeBody() },
          { id: 'fixsteps', title: 'Fix Steps', tone: tones.orange, icon: <Sparkles size={18} color={tones.orange.iconColor} strokeWidth={1.9} />, body: renderFixStepsBody() },
          { id: 'lexicography', title: 'Lexicography', tone: tones.purple, icon: <Book size={18} color={tones.purple.iconColor} strokeWidth={1.9} />, body: renderLexicographyBody() },
        ]
    : [
        { id: 'guidance', title: 'Guidance', tone: tones.blue, icon: <Info size={18} color={tones.blue.iconColor} strokeWidth={1.9} />, body: renderGuidanceBody() },
        { id: 'lexicography', title: 'Lexicography', tone: tones.purple, icon: <Book size={18} color={tones.purple.iconColor} strokeWidth={1.9} />, body: renderLexicographyBody() },
        { id: 'phrasing', title: 'Phrasing', tone: tones.orange, icon: <ScrollText size={18} color={tones.orange.iconColor} strokeWidth={1.9} />, body: renderPhrasingBody() },
      ];

  const activePreviewId = pinnedPreviewId || hoveredPreviewId;
  const previewCard = visibleCards.find((card) => card.id === activePreviewId);

  const renderExpandedModal = () => {
    if (!expandedCard) {
      return null;
    }

    let title = '';
    let tone = tones.blue;
    let icon = null;
    let content = null;

    switch (expandedCard) {
      case 'grade':
        title = 'Your Grade';
        tone = isFailed ? tones.rose : tones.emerald;
        icon = <Award size={20} color={tone.iconColor} />;
        content = (
          <div className="fg-right__modalSection">
            <div className="fg-right__centered" style={{ marginBottom: 32 }}>
              <div
                className="fg-right__circleGradeLarge"
                style={
                  isFailed
                    ? {
                        borderColor: '#fca5a5',
                        background: 'linear-gradient(135deg, #fee2e2 0%, #fff1f2 100%)',
                        boxShadow: '0 18px 32px rgba(220, 38, 38, 0.16)',
                      }
                    : undefined
                }
              >
                <span className="fg-right__gradeValueLarge" style={isFailed ? { color: '#dc2626' } : undefined}>
                  {isFailed ? '4.2' : '8.4'}
                </span>
              </div>
            </div>

            <p className="fg-right__meta" style={{ marginBottom: 28 }}>
              <strong>Reviewed:</strong> 15 Mar 2026
              <br />
              {isFailed ? 'This attempt needs revision before it can pass.' : 'Model evaluation with a scholar-facing rubric'}
            </p>

            <div className="fg-right__stack" style={{ gap: 24, maxWidth: 960, margin: '0 auto' }}>
              {(isFailed
                ? [
                    {
                      key: 'issue-large',
                      title: 'Why it failed',
                      titleColor: '#b91c1c',
                      dotColor: '#dc2626',
                      background: '#fef2f2',
                      border: '#fecaca',
                      text:
                        'The translation still softens a legal condition into a general statement and does not cleanly separate the attributed views.',
                    },
                    {
                      key: 'fix-large',
                      title: 'Fix first',
                      titleColor: '#c2410c',
                      dotColor: '#f97316',
                      background: '#fff7ed',
                      border: '#fed7aa',
                      text:
                        'Strengthen the opening condition, then clarify attribution before expanding the ruling to the outskirts of the city.',
                    },
                  ]
                : gradeSections).map((section) => (
                <div key={section.key}>{renderFeedbackSection(section, true)}</div>
              ))}
            </div>
          </div>
        );
        break;

      case 'guidance':
        title = 'Guidance';
        tone = tones.blue;
        icon = <Info size={20} color={tone.iconColor} />;
        content = (
          <div className="fg-right__modalSection" style={{ maxWidth: 960, margin: '0 auto' }}>
            <h3 className="fg-right__modalHeading" style={{ fontSize: 32, marginBottom: 24 }}>
              Translation Approach
            </h3>
            <p className="fg-right__modalLead">
              Focus on accurately translating the conditions for Jumu&apos;ah validity. Pay close attention to the
              definition of <span className="fg-right__arabic" dir="rtl">مصر جامع</span> (comprehensive city) and its
              components. Distinguish between the different opinions and their attributions.
            </p>

            <div
              className="fg-right__feedbackBlockLarge"
              style={{
                '--feedback-bg': '#f8fafc',
                '--feedback-border': '#e2e8f0',
                '--feedback-title': '#334155',
                marginTop: 32,
              }}
            >
              <h4 className="fg-right__feedbackTitleLarge">Key Focus Areas:</h4>
              <ul className="fg-right__bulletList">
                <li>Identify the primary condition for Jumu&apos;ah (the comprehensive city).</li>
                <li>Ensure the legal definitions set by Abu Yusuf are captured clearly.</li>
                <li>Differentiate the opinions of al-Karkhi and al-Thalji without causing confusion in the English flow.</li>
              </ul>
            </div>
          </div>
        );
        break;

      case 'takeaways':
      case 'fixsteps':
        title = isFailed ? 'Fix Steps' : 'Key Takeaways';
        tone = isFailed ? tones.orange : tones.indigo;
        icon = <Sparkles size={20} color={tone.iconColor} />;
        content = (
          <div className="fg-right__modalSection" style={{ maxWidth: 960, margin: '0 auto' }}>
            {isFailed ? (
              <div className="fg-right__takeawayList">
                <div className="fg-right__takeawayItem">
                  <div className="fg-right__takeawayNumber" style={{ background: '#ffedd5', color: '#c2410c' }}>1</div>
                  <div>
                    <h4 className="fg-right__takeawayTitle">Reframe the rule</h4>
                    <p className="fg-right__takeawayText">Make the first sentence read like a legal condition of validity, not an observation.</p>
                  </div>
                </div>
                <div className="fg-right__takeawayItem">
                  <div className="fg-right__takeawayNumber" style={{ background: '#ffedd5', color: '#c2410c' }}>2</div>
                  <div>
                    <h4 className="fg-right__takeawayTitle">Separate the views</h4>
                    <p className="fg-right__takeawayText">Show that the main position and the secondary opinion are distinct, and attribute both clearly.</p>
                  </div>
                </div>
                <div className="fg-right__takeawayItem">
                  <div className="fg-right__takeawayNumber" style={{ background: '#ffedd5', color: '#c2410c' }}>3</div>
                  <div>
                    <h4 className="fg-right__takeawayTitle">Preserve the extension</h4>
                    <p className="fg-right__takeawayText">Keep the final clause as an extension of the legal ruling to the city outskirts.</p>
                  </div>
                </div>
              </div>
            ) : (
            <div className="fg-right__takeawayList">
              <div className="fg-right__takeawayItem">
                <div className="fg-right__takeawayNumber">1</div>
                <div>
                  <h4 className="fg-right__takeawayTitle">Legal Precedent</h4>
                  <p className="fg-right__takeawayText">
                    The term <span className="fg-right__arabic" dir="rtl">مصر جامع</span> requires careful breakdown as
                    it sets the legal precedent for Friday prayers.
                  </p>
                </div>
              </div>

              <div className="fg-right__takeawayItem">
                <div className="fg-right__takeawayNumber">2</div>
                <div>
                  <h4 className="fg-right__takeawayTitle">Differing Opinions</h4>
                  <p className="fg-right__takeawayText">
                    Differing opinions (al-Karkhī vs al-Thaljī) should be clearly attributed to avoid conflating the
                    primary stance with secondary views.
                  </p>
                </div>
              </div>

              <div className="fg-right__takeawayItem">
                <div className="fg-right__takeawayNumber">3</div>
                <div>
                  <h4 className="fg-right__takeawayTitle">Spatial Extension</h4>
                  <p className="fg-right__takeawayText">
                    The physical expansion of the city (<span className="fg-right__arabic" dir="rtl">أفنية</span>)
                    carries the same legal weight as the center, which is a critical nuance in Hanafi fiqh.
                  </p>
                </div>
              </div>
            </div>
            )}
          </div>
        );
        break;

      case 'phrasing':
        title = 'Phrasing';
        tone = tones.orange;
        icon = <ScrollText size={20} color={tone.iconColor} />;
        content = (
          <div className="fg-right__modalSection" style={{ maxWidth: 960, margin: '0 auto' }}>
            <div className="fg-right__stack" style={{ gap: 18 }}>
              <div className="fg-right__entry">
                <div className="fg-right__entryRow">
                  <span className="fg-right__arabic" dir="rtl">لا تصح الجمعة إلا في مصر جامع</span>
                  <span className="fg-right__mono">la taṣiḥḥ al-jumuʿah illa fi miṣr jamiʿ</span>
                </div>
                <p className="fg-right__text">
                  Keep this phrasing firm and legal in tone: &quot;The Friday prayer is only valid in a comprehensive
                  city.&quot;
                </p>
                <div className="fg-right__contextBox">
                  <strong>Tip:</strong> Avoid softer paraphrases like &quot;usually valid&quot; or &quot;best performed&quot;.
                  The Arabic is stating a condition of validity, not a recommendation.
                </div>
              </div>

              <div className="fg-right__entry">
                <div className="fg-right__entryRow">
                  <span className="fg-right__arabic" dir="rtl">الحكم غير مقصور على المصلى</span>
                  <span className="fg-right__mono">al-ḥukm ghayr maqṣur ʿala al-muṣalla</span>
                </div>
                <p className="fg-right__text">
                  Translate this as a legal extension of the ruling, not a physical description of the place.
                </p>
                <div className="fg-right__contextBox">
                  <strong>Tip:</strong> &quot;The ruling is not confined to the prayer area&quot; is stronger and cleaner than
                  &quot;the judgment is not restricted to the musalla only,&quot; which reads more literally.
                </div>
              </div>

              <div className="fg-right__entry">
                <div className="fg-right__entryRow">
                  <span className="fg-right__arabic" dir="rtl">بل تجوز في جميع أفنية المصر</span>
                  <span className="fg-right__mono">bal tajuzu fi jamiʿ afniyat al-miṣr</span>
                </div>
                <p className="fg-right__text">
                  This clause widens the scope of permissibility, so the English should feel like an expansion rather than
                  a restatement.
                </p>
                <div className="fg-right__contextBox">
                  <strong>Tip:</strong> Use &quot;rather, it is permissible throughout all the outskirts of the city&quot; to preserve
                  the argumentative flow.
                </div>
              </div>
            </div>
          </div>
        );
        break;

      case 'lexicography':
        title = 'Lexicography Details';
        tone = tones.purple;
        icon = <Book size={20} color={tone.iconColor} />;
        content = (
          <>
            <div className="fg-right__tableWrap">
              <table className="fg-right__table">
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Type</th>
                    <th>Root/Pattern or Class</th>
                    <th>Core Meaning/Function Source</th>
                    <th>Direct English</th>
                    <th>Context</th>
                    <th>Why Included</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="fg-right__tableRow">
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span className="fg-right__arabic" dir="rtl">مصر جامع</span>
                        <span className="fg-right__mono">miṣr jāmiʿ</span>
                      </div>
                    </td>
                    <td>Compound Noun</td>
                    <td>
                      <div className="fg-right__arabic" dir="rtl">م-ص-ر + ج-م-ع</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>فَعْل + فَاعِل</div>
                    </td>
                    <td>Large settlement + gathering/comprehensive</td>
                    <td>Comprehensive city</td>
                    <td>Hanafi fiqh: defined by having a judge (qāḍī) and ruler (amīr)</td>
                    <td>Central legal term defining jurisdiction for Friday prayer</td>
                  </tr>

                  <tr className="fg-right__tableRow">
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span className="fg-right__arabic" dir="rtl">أفنية</span>
                        <span className="fg-right__mono">afniyah</span>
                      </div>
                    </td>
                    <td>Plural Noun</td>
                    <td>
                      <div className="fg-right__arabic" dir="rtl">ف-ن-ي</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>أَفْعِلَة (broken plural)</div>
                    </td>
                    <td>Open spaces, courtyards</td>
                    <td>Outskirts / Courtyards</td>
                    <td>Immediate surrounding areas attached to the city</td>
                    <td>Clarifies spatial extension of legal ruling beyond city center</td>
                  </tr>

                  <tr className="fg-right__tableRow">
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span className="fg-right__arabic" dir="rtl">مصلى</span>
                        <span className="fg-right__mono">muṣallā</span>
                      </div>
                    </td>
                    <td>Noun (Place)</td>
                    <td>
                      <div className="fg-right__arabic" dir="rtl">ص-ل-ي</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>مَفْعَل (place noun)</div>
                    </td>
                    <td>Place of prayer</td>
                    <td>Prayer area / Prayer ground</td>
                    <td>Open space designated for communal prayers, especially Eid</td>
                    <td>Distinguishes permissible Friday prayer location from regular mosque</td>
                  </tr>

                  <tr className="fg-right__tableRow">
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span className="fg-right__arabic" dir="rtl">تشريق</span>
                        <span className="fg-right__mono">tashrīq</span>
                      </div>
                    </td>
                    <td>Verbal Noun</td>
                    <td>
                      <div className="fg-right__arabic" dir="rtl">ش-ر-ق</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>تَفْعِيل</div>
                    </td>
                    <td>Drying meat in the sun (from sharq = east/sunrise)</td>
                    <td>Meat-drying / Drying sacrificial meat</td>
                    <td>Refers to the days after Eid al-Adha when meat is dried</td>
                    <td>Unusual term requiring cultural context for accurate translation</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="fg-right__tableFooter">
              Lexicographical analysis based on classical Arabic dictionaries and Hanafi legal terminology.
            </div>
          </>
        );
        break;

      default:
        return null;
    }

    return (
      <div className="fg-right__modalBackdrop">
        <div className="fg-right__modal">
          <div className="fg-right__modalHeader" style={toneVars(tone)}>
            <div className="fg-right__modalTitleRow">
              {icon}
              <h2 className="fg-right__modalTitle">{title}</h2>
            </div>

            <div className="fg-right__modalActions">
              <button
                className="fg-right__close"
                type="button"
                onClick={() => setExpandedCard(null)}
                aria-label={`Minimize ${title}`}
                style={toneVars(tone)}
              >
                <Minimize2 size={18} />
              </button>
              <button
                className="fg-right__close"
                type="button"
                onClick={() => setExpandedCard(null)}
                aria-label={`Close ${title}`}
                style={toneVars(tone)}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="fg-right__modalBody">{content}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{rightPanelStyles}</style>
      <div className="fg-right">
        <div
          className="fg-right__header"
          style={{ justifyContent: isExpanded ? 'space-between' : 'center' }}
        >
          {isExpanded ? (
            <>
              <button
                className="fg-right__toggle"
                type="button"
                onClick={onToggleCollapse}
                aria-label={isCollapsed ? 'Expand support panels' : 'Collapse support panels'}
              >
                {isCollapsed ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
              </button>
              <span style={{ marginRight: 'auto', marginLeft: 12 }}>Support</span>
            </>
          ) : (
            <button
              className="fg-right__toggle"
              type="button"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand support panels' : 'Collapse support panels'}
            >
              {isCollapsed ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
            </button>
          )}
        </div>

        <div className="fg-right__body">
          {!isExpanded ? (
            <div className="fg-right__rail">
              {railScrollState.canScrollUp && (
                <>
                  <div className="fg-right__railFade fg-right__railFade--top" />
                  <div className="fg-right__railIndicator fg-right__railIndicator--top">
                    <ChevronsLeft size={14} style={{ transform: 'rotate(90deg)' }} />
                  </div>
                </>
              )}

              {railScrollState.canScrollDown && (
                <>
                  <div className="fg-right__railFade fg-right__railFade--bottom" />
                  <div className="fg-right__railIndicator fg-right__railIndicator--bottom">
                    <ChevronsLeft size={14} style={{ transform: 'rotate(-90deg)' }} />
                  </div>
                </>
              )}

              <div className="fg-right__railScroll" ref={railScrollRef} onScroll={syncRailScrollState}>
                <div className="fg-right__railList">
                  {collapsedCards.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      className="fg-right__railIcon"
                      aria-label={`Open ${card.id}`}
                      onMouseEnter={(event) => openPreview(card.id, event.currentTarget.getBoundingClientRect())}
                      onMouseLeave={closePreview}
                      style={{
                        '--rail-height': `${card.railHeight}px`,
                        background: card.tone.panelBg,
                        borderColor: card.tone.panelBorder,
                      }}
                    >
                      {card.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="fg-right__content">
              {visibleCards.map((card) => (
                <PanelCard
                  key={card.id}
                  tone={card.tone}
                  icon={card.icon}
                  title={card.title}
                  expandLabel={`Expand ${card.title}`}
                  onExpand={() => setExpandedCard(card.id)}
                  bodyStyle={card.id === 'grade' ? { paddingBottom: 18 } : undefined}
                >
                  {card.body}
                </PanelCard>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isExpanded && previewCard && (
        <div
          className="fg-right__floating"
          style={{
            left: floatingPosition.x,
            top: floatingPosition.y,
            width: previewCard.id === 'discussion' ? 392 : previewCard.id === 'lexicography' ? 380 : 360,
            minHeight: previewCard.id === 'discussion' ? 460 : previewCard.id === 'lexicography' ? 400 : 220,
          }}
          onMouseEnter={() => {
            clearPendingClose();
            setHoveredPreviewId(previewCard.id);
          }}
          onMouseLeave={() => {
            closePreview();
          }}
        >
          <div
            className="fg-right__floatingHeader"
            style={toneVars(previewCard.tone)}
            onPointerDown={(event) => {
              setDragState({
                offsetX: event.clientX - floatingPosition.x,
                offsetY: event.clientY - floatingPosition.y,
              });
            }}
          >
            {previewCard.icon}
            <h3 className="fg-right__cardTitle">{previewCard.title}</h3>
            <div className="fg-right__floatingActions">
              <button
                type="button"
                className="fg-right__floatingClose"
                aria-label={`Expand ${previewCard.title}`}
                onClick={() => setExpandedCard(previewCard.id)}
              >
                <Maximize2 size={14} />
              </button>
              {!pinnedPreviewId && (
                <button
                  type="button"
                  className="fg-right__floatingPin"
                  onClick={() => {
                    clearPendingClose();
                    setPinnedPreviewId(previewCard.id);
                  }}
                >
                  <Move size={14} />
                  Float
                </button>
              )}
              <button
                type="button"
                className="fg-right__floatingClose"
                onClick={() => {
                  clearPendingClose();
                  setPinnedPreviewId(null);
                  setHoveredPreviewId(null);
                }}
                aria-label={`Close ${previewCard.title} preview`}
              >
                <X size={14} />
              </button>
            </div>
          </div>
          <div className="fg-right__floatingBody">{previewCard.body}</div>
        </div>
      )}

      {renderExpandedModal()}
    </>
  );
}
