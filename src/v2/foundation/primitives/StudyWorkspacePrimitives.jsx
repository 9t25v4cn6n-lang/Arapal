import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  AlertCircle,
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
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  PictureInPicture2,
  Copy,
  GripVertical,
  Info,
  Italic,
  Maximize2,
  Minimize2,
  MessageSquare,
  ScrollText,
  Send,
  Sparkles,
  Plus,
  Tag,
  X,
} from 'lucide-react'
import IconActionButton from './IconActionButton'
import PrimaryCTA from './PrimaryCTA'
import { colors, containsArabic, elevation, motion, radius, spacing, typography } from '../tokens'

// Resolved once at module scope, not per render: the submit handler already
// accepts either modifier, so the label must name the one this machine uses.
// A constant also keeps the rendered width stable for screenshot comparison.
const IS_APPLE = typeof navigator !== 'undefined'
  && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || '')
const SUBMIT_SHORTCUT = IS_APPLE ? '⌘ ↵' : 'Ctrl ↵'
const SUBMIT_SHORTCUT_LABEL = IS_APPLE ? 'Command + Enter' : 'Ctrl + Enter'

/**
 * Scroll affordance for a region whose content is cut by its own edge.
 *
 * Both scroll regions in Study hid their scrollbars, so a half-sliced line of
 * Arabic and a half-visible lexicography chip read as clipping — a defect —
 * rather than as "there is more this way". This reports which edges still have
 * content beyond them so the caller can fade exactly those, and nothing when
 * everything already fits. One hook rather than two copies, because the defect
 * is a class: any hidden-scrollbar region has it.
 *
 * Children are observed as well as the region: a late-arriving webfont changes
 * scrollHeight without changing the region's own box.
 */
function useScrollAffordance(axis) {
  const ref = useRef(null)
  const [edges, setEdges] = useState({ start: false, end: false })

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const measure = () => {
      const size = axis === 'x' ? el.clientWidth : el.clientHeight
      const total = axis === 'x' ? el.scrollWidth : el.scrollHeight
      const position = axis === 'x' ? el.scrollLeft : el.scrollTop
      const next = { start: position > 1, end: total - size - position > 1 }
      // Same object when nothing changed, so a scroll event cannot spin renders.
      setEdges((previous) => (
        previous.start === next.start && previous.end === next.end ? previous : next
      ))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    for (const child of el.children) observer.observe(child)
    el.addEventListener('scroll', measure, { passive: true })
    return () => {
      observer.disconnect()
      el.removeEventListener('scroll', measure)
    }
  }, [axis])

  return [ref, { 'data-more-start': edges.start || undefined, 'data-more-end': edges.end || undefined }]
}

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
    --study-review-strong: ${colors.reviewStrong};
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

  /* After the base rule, not before it. At equal specificity the later
     declaration wins, so the first version of this sat above .study-v2__railPanel
     and was overridden by the very rule it meant to override.

     A 0px grid track is not the same as hidden: the panel's children keep their
     intrinsic widths and spill out of it, which is how the support rail's header
     and body escaped the frame. Six findings that read as separate escapes were
     one missing declaration. */
  @media (max-width: 560px) {
    .study-v2__railPanel { display: none; }
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

  /* R3 import: the tree now says how much is left, per chapter and overall.
     The live tree showed plain markers with no sense of progress at all. */
  .study-v2__chapterCount {
    justify-self: end;
    font-size: var(--study-control-size);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--study-text-soft);
  }

  .study-v2__srOnly {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .study-v2__railFooter {
    flex: 0 0 auto;
    display: grid;
    gap: var(--study-space-8);
    padding: var(--study-space-12) var(--study-space-16);
    border-top: 1px solid var(--study-line-soft);
  }

  .study-v2__railFooterLabel {
    font-size: var(--study-control-size);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--study-text-soft);
  }

  .study-v2__railProgress {
    display: block;
    height: 4px;
    border-radius: 999px;
    background: var(--study-accent-mist, rgba(219, 234, 254, 0.9));
    overflow: hidden;
  }

  .study-v2__railProgress > span {
    display: block;
    height: 100%;
    background: var(--study-accent);
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

  /* The collapsed support rail is a DOCK, not a leftover.
     ───────────────────────────────────────────────────
     It used to be three 40px icon buttons stacked against the top edge of an
     840px rail: the functionality survived collapsing and the architecture did
     not, so the strongest support panel in the product became three specks in a
     corner. The tiles now share the rail's height between them — each is
     flex: 1 with a floor and a ceiling, so three modules give three tall tiles
     and six give six shorter ones without the rule changing — and each carries
     its own name down its spine, so a module is identifiable without hovering
     it first. */
  .study-v2__collapsedRailBody {
    flex: 1 1 auto;
    min-height: 0;
    padding: var(--study-space-12) var(--study-space-8) var(--study-space-16);
    display: flex;
    flex-direction: column;
    gap: var(--study-space-8);
    align-items: stretch;
    /* The 240px cap on each tile stops three modules becoming three 300px slabs
       on a tall frame — but it left whatever it saved piled at the BOTTOM, so a
       deliberate cap read as a dead region under the last tile. Centring gives
       the leftover back as symmetric margin: the group still occupies the rail,
       and the slack is composition rather than remainder. */
    justify-content: center;
  }

  .study-v2__collapsedSupportLabel {
    writing-mode: vertical-rl;
    font-size: ${typography.eyebrowLabel.fontSize};
    line-height: 1;
    font-weight: ${typography.eyebrowLabel.fontWeight};
    letter-spacing: ${typography.eyebrowLabel.letterSpacing};
    text-transform: uppercase;
    color: var(--study-text-soft);
    /* The tile is 56px of usable height at worst; a long module name must clip
       rather than push the icon out of the tile. */
    min-height: 0;
    max-height: 100%;
    overflow: hidden;
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
    /* chevron · label · remaining count. Declared here rather than on the
       shared row rule so a segment row cannot grow a third column. */
    grid-template-columns: auto minmax(0, 1fr) auto;
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
    font-size: ${typography.sectionTitle.fontSize};
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
    font-size: ${typography.supportSubtext.fontSize};
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
    /* Status and actions are a deliberate pair with deliberate air between
       them, not two things that happened to end up adjacent. */
    gap: var(--study-space-16);
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

  /* Sized by its content and anchored to the actions beside it.
     It used to be a fixed 320px block that centred its own label inside itself,
     inside a cluster justified to flex-end — so "Segment 1 of 2" landed wherever
     160px of empty reserved width happened to put it, which read as an arbitrary
     position around four-fifths of the bar. And because it could not shrink
     below its content, at narrower widths it slid under Focus view instead of
     giving way. Its position is now a stable function of the actions it belongs
     with, and it is the thing that yields when the lane runs out. */
  .study-v2__shellProgress {
    flex: 0 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--study-space-6, 6px);
    padding: 0;
    color: var(--study-text-body);
    white-space: nowrap;
    overflow: hidden;
  }

  .study-v2__shellProgressLabel {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--study-text-body);
    font-size: var(--study-control-size);
    line-height: var(--study-control-line);
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .study-v2__shellFocusButton {
    /* Never the thing that shrinks. The lane's only real action outranks a
       status readout when width runs out. */
    flex: 0 0 auto;
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
    /* The slack belongs to the source, not to a void.

       There used to be a fourth row here whose area was "." — an empty 1fr
       spacer that swallowed every spare pixel and pushed the editor to the
       bottom of the lane. On the 1440x900 frame that put roughly 150px of blank
       background between the passage being read and the box it is typed into:
       dead space to look at, and a wasted eye journey on the one screen where
       source and translation should sit close together.

       The source row takes the slack instead and scrolls internally, which is
       what its scroll affordance already existed for, so a long Arabic passage
       gets MORE room rather than the void getting bigger. The editor sits
       directly under the lexicography and grows with what is typed into it. */
    /* Read at the top, write at the bottom.
       ─────────────────────────────────────
       Four arrangements have now been tried in this rule, and the argument each
       time was about where the leftover height should go.

         1. an empty 1fr spacer row  — a ~150px hole between the passage and the
            box it is typed into.
         2. the slack to the source  — the same hole, moved INSIDE the source
            card: 111px of white under a short passage.
         3. every row content-sized  — no hole, but the composer then floats
            directly under the lexicography with ~180px of unused canvas beneath
            it, which is what review saw as a top-heavy, underused workspace.

       The mistake common to all three was treating the leftover as something to
       park. It is not: this is a writing surface, and the one component that can
       spend extra height USEFULLY is the box you write the translation into.

       So the editor row takes the slack, the editor grows into it up to a cap,
       and it sits at the bottom of its row — which anchors the lower canvas
       without hard-coding where the bottom is. Any residue at very tall
       viewports lands above the editor as breathing room between reading and
       writing, and the cap is what keeps a tall frame from turning the writing
       area into an intimidating empty field. */
    grid-template-rows: auto auto minmax(var(--study-editor-min, 200px), 1fr);
    align-content: stretch;
    grid-template-areas:
      "source companion"
      "lex companion"
      "editor companion";
    align-items: stretch;
    column-gap: 0;
    row-gap: var(--study-space-20);
    transition:
      grid-template-columns var(--study-motion-panel),
      column-gap var(--study-motion-panel),
      row-gap var(--study-motion-panel);
  }

  /* Discussion mode reveals a column. It does not rearrange the screen.

     It used to re-flow into "source source / editor companion": the source went
     full width, and the editor and companion split the lower half. That produced
     the two things R3 avoids — a ~340px empty translation box, because the editor
     was stretched to match a half-height row, and a stubby companion card that
     had to be tall enough to hold a conversation. R3 keeps one composition and
     runs the companion full height beside both the passage and the editor, which
     is why its source can stay compact and its writing area still looks
     deliberate.

     So the areas here are the SAME three rows as the default state, with the
     companion spanning all of them. The forced min-height goes too: nothing needs
     to be stretched to a floor once no row is fighting for the leftover. */
  .study-v2__composer.is-discussing {
    grid-template-columns: minmax(0, 1fr) minmax(340px, 0.82fr);
    /* The SAME row model as the default state. Restating it as three auto rows
       here dropped the editor's floor, so on a 768px frame the companion,
       the retry banner and the source between them squeezed the writing area to
       about 180px and the third line of the user's own translation was cut at a
       hard edge. The floor is the point: whatever else is on this screen, there
       is always a usable box to write in, and the source card above it scrolls
       instead — which is what its scroll affordance is for. */
    grid-template-rows: auto auto minmax(240px, 1fr);
    grid-template-areas:
      "source companion"
      "lex companion"
      "editor companion";
    column-gap: var(--study-space-20);
    align-items: stretch;
  }

  /* The passage yields to the writing area in this mode, not the other way
     round. Discussion is where the centre column is narrowest and the retry
     banner is most likely to be present; with the source card free to take its
     full content height the editor was left about 90px and cut the user's own
     second line at a hard edge. The card scrolls — that is what its scroll
     affordance is for — and the full passage is one scroll away. */
  .study-v2__composer.is-discussing .study-v2__composerSource {
    max-height: 240px;
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

  /* Lexicography stays. It was hidden to buy vertical room for the old
     two-row discussion layout; the layout no longer needs that room, and the
     glossary is most useful precisely when you are discussing wording. R3 keeps
     it visible in this state too. */
  .study-v2__composer.is-discussing .study-v2__composerLex {
    display: block;
  }

  .study-v2__composerEditor {
    grid-area: editor;
    min-width: 0;
    min-height: 0;
    /* end + height: 100% + a cap. The height claims the row so the writing area
       actually grows; the cap stops a 1080px-tall frame producing a 600px empty
       field; end-alignment puts whatever is left over above the editor rather than
       below it, so the composer is the last thing in the canvas. */
    align-self: end;
    height: 100%;
    max-height: 420px;
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
    min-height: 0;
  }

  /* The passage panel takes the height the group is given.
     It defaulted to flex: 0 1 auto — able to shrink, never to grow — so the card
     held 111px of unused white at the bottom WHILE its scroller clipped the
     Arabic inside it. Spare room and cut text in the same card, for the same
     reason: nothing claimed the slack. min-height: 0 is what lets a flex child
     with its own scroll region actually shrink to the space rather than
     insisting on its content height. */
  .study-v2__sourceGroup > .study-v2__panel {
    flex: 1 1 auto;
    min-height: 0;
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
    /* 16, not 24: the body's inset is a reading measure, the header's is a
       control gutter. At the docked width 48px of a 382px header went to air
       while the title and the utility row fought over the remaining 334 and
       both lost — the title ellipsised to "SOURCE T…". */
    padding: 0 var(--study-space-16);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--study-space-16);
    /* The title outranks the utilities. The earlier fix widened the header's
       usable width, but the title and the utility row are still flex siblings
       and the utilities are three icon buttons that cannot meaningfully shrink —
       so every further narrowing came out of the title alone, which at 1100
       reached "SOU…". A card header that has to use two rows is fine; a card
       whose name is three letters and an ellipsis is not. */
    flex-wrap: wrap;
    row-gap: var(--study-space-8);
    border-bottom: 1px solid color-mix(in srgb, var(--card-line, var(--study-line-soft)) 70%, transparent);
    background: var(--card-bg, color-mix(in srgb, var(--study-accent-wash) 36%, var(--study-surface)));
  }

  .study-v2__cardTitleRow {
    min-width: 0;
    /* The header wraps BEFORE the title loses a single character. A fixed basis
       only moved the threshold — 12ch was enough for "Source text" to survive
       and not enough for "Best in class translation", so one card read in full
       and its neighbour still said "BEST IN CL…". Asking for the title's own
       width makes the rule the intent: these labels are short and known, and a
       two-row header costs nothing next to a card that cannot say its name. */
    flex: 1 1 auto;
    min-width: max-content;
    display: flex;
    align-items: center;
    gap: var(--study-space-12);
  }

  .study-v2__cardHeader .study-v2__actionRow {
    flex: 0 0 auto;
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
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* A card header's controls are one row. Wrapping let "Copy" drop below "A-/A+"
     and doubled the header height, which read as a broken header rather than as
     a reflow. The title is what yields instead — it ellipsises. */
  .study-v2__actionRow {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--study-space-8);
    flex-wrap: nowrap;
    flex: 0 0 auto;
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

  /* Scroll affordance. A cut edge with no scrollbar reads as clipping, so fade
     whichever edge still has content beyond it — and only that edge, so nothing
     is faded when everything already fits. Driven by useScrollAffordance. */
  .study-v2__lexStrip[data-more-end] {
    mask-image: linear-gradient(to right, #000 calc(100% - var(--study-space-32)), transparent 100%);
  }

  .study-v2__lexStrip[data-more-start] {
    mask-image: linear-gradient(to right, transparent 0, #000 var(--study-space-32));
  }

  .study-v2__lexStrip[data-more-start][data-more-end] {
    mask-image: linear-gradient(
      to right,
      transparent 0,
      #000 var(--study-space-32),
      #000 calc(100% - var(--study-space-32)),
      transparent 100%
    );
  }

  .study-v2__sourceBody[data-more-end] {
    mask-image: linear-gradient(to bottom, #000 calc(100% - var(--study-space-24)), transparent 100%);
  }

  .study-v2__sourceBody[data-more-start] {
    mask-image: linear-gradient(to bottom, transparent 0, #000 var(--study-space-24));
  }

  .study-v2__sourceBody[data-more-start][data-more-end] {
    mask-image: linear-gradient(
      to bottom,
      transparent 0,
      #000 var(--study-space-24),
      #000 calc(100% - var(--study-space-24)),
      transparent 100%
    );
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
    /* Starts at roughly two lines and grows with what is typed. It used to open
       at 106px — four lines of empty box on a screen where most translations
       begin as one sentence, which read as an unfilled form rather than an
       invitation. The growth is what makes a small starting size honest. */
    min-height: 64px;
    max-height: min(26vh, 220px);
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

  .study-v2__referenceAbsent {
    color: var(--study-text-soft);
    font-style: italic;
  }

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

  /* Two rows, because the footer carries two different kinds of thing and they
     have opposite needs. A submit error must be read in full, so it gets its
     own full-width row and is allowed to wrap. The shortcut affordance must
     never steal width from the actions, so it is a fixed-width keycap rather
     than a sentence that shrinks. The previous single row made the error
     shrinkable and the shortcut ellipsised to "⌘ Ente…" at the docked width. */
  .study-v2__editorFooter {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--study-space-8);
  }

  .study-v2__editorError {
    display: flex;
    align-items: flex-start;
    gap: var(--study-space-8);
    min-width: 0;
    color: var(--study-review-strong);
    font-size: var(--study-control-size);
    font-weight: 600;
    line-height: 1.4;
  }

  .study-v2__editorActions {
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

  .study-v2__shortcut {
    margin-right: auto;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    min-height: var(--study-space-24);
    padding: 0 var(--study-space-8);
    border: 1px solid var(--study-line-soft);
    border-radius: var(--study-radius-12);
    background: var(--study-surface-soft);
    color: var(--study-text-soft);
    font-family: inherit;
    font-size: var(--study-control-size);
    font-weight: 600;
    white-space: nowrap;
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
    /* A control's label is one line. Left to wrap, this one broke into three
       lines inside the pill at the docked width and squashed its own icon. */
    white-space: nowrap;
    flex: 0 0 auto;
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

  /* The header was draggable and nothing said so. A grip is the one glyph that
     means "this moves" without a tooltip having to explain it. */
  .study-v2__dragGrip {
    display: inline-flex;
    align-items: center;
    margin-inline-start: calc(-1 * var(--study-space-4));
    color: var(--study-text-faint);
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
    /* Yields by clipping, never by wrapping. At 1100 the middle column narrowed
       and "SEGMENT 1 OF 2" — uppercase, letter-spaced — stacked into a
       four-line tower beside a 172px button that cannot shrink, which grew the
       whole bar. Same rule as the top bar: the status readout is what gives way
       when the row runs out of width, and it gives way quietly. */
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
    /* Sized by its content, capped — not a fixed frame that content is poured
       into. A 620px min-height on a 900px-wide card meant Phrasing, which has
       two short items, opened as a 900x620 white rectangle with two lines at the
       top. Focusing something should give it room to be worked with; it should
       not enlarge the container and leave the content where it was.
       Now the card's size tells you how much there is: a two-item module opens
       compact, a long lexicography opens tall and scrolls. */
    width: min(720px, 100%);
    max-height: min(80vh, 760px);
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

  /* The review variant. The circle carries an outcome glyph now rather than an
     invented number, so it needs the review tone as well as the success one. */
  .study-v2__gradeCircle.is-review {
    border-color: color-mix(in srgb, var(--study-review) 30%, transparent);
    background: color-mix(in srgb, var(--study-review) 10%, var(--study-surface));
    color: var(--study-review-strong);
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
    /* An equal share of the rail, floored so it stays a comfortable target and
       capped so three modules on a 1080px frame do not become three 300px
       slabs. The distribution is the rule; the number of modules is an input. */
    flex: 1 1 0;
    min-height: calc(var(--study-space-64) + var(--study-space-24));
    max-height: 240px;
    border: 1px solid var(--support-border, var(--study-line-soft));
    border-radius: var(--study-radius-16);
    background: var(--support-bg, var(--study-surface));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--study-space-12);
    padding: var(--study-space-12) var(--study-space-4);
    color: var(--support-icon, var(--study-accent));
    cursor: pointer;
    transition:
      transform var(--study-motion-micro),
      border-color var(--study-motion-micro),
      background-color var(--study-motion-micro),
      box-shadow var(--study-motion-micro);
  }

  .study-v2__collapsedSupportButton:hover,
  .study-v2__collapsedSupportButton:focus-visible {
    border-color: var(--support-icon, var(--study-accent));
    background: color-mix(in srgb, var(--support-bg, var(--study-accent-wash)) 90%, var(--study-surface));
    box-shadow:
      0 var(--study-space-12) 26px color-mix(in srgb, var(--support-icon, var(--study-accent)) 16%, transparent),
      inset 0 0 0 1px color-mix(in srgb, var(--support-icon, var(--study-accent)) 24%, transparent);
    transform: translateX(-3px);
  }

  .study-v2__collapsedSupportButton:hover .study-v2__collapsedSupportLabel,
  .study-v2__collapsedSupportButton:focus-visible .study-v2__collapsedSupportLabel {
    color: var(--support-icon, var(--study-accent));
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
  /* Phrasing's own identity.
     It used to be `orange`, whose values were within a rounding error of
     `review` below — same border, same badge background, same badge text. So the
     product had one amber saying two opposite things: "this needs your
     attention" on a failed Surface check and a Needs-revision badge, and "this
     is the Phrasing module" on an ordinary support card. A reader cannot hold
     both meanings for one colour, so amber now means exactly one thing —
     corrective — and the identity modules are blue, purple and teal. */
  teal: {
    surface: '#ffffff',
    bg: 'rgba(240, 253, 250, 0.94)',
    border: 'rgba(153, 231, 220, 0.82)',
    icon: '#0d9488',
    badgeBg: '#ccfbf1',
    badgeText: '#0f766e',
    glow: 'rgba(13, 148, 136, 0.08)',
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

/** The resting presentation: everything docked in the rail. */
const DOCKED_PRESENTATION = { mode: 'docked' }

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

/** The resting geometry of a newly floated module. */
function createFloatingCardState(cardId) {
  if (typeof window === 'undefined') {
    return {
      cardId,
      left: 24,
      top: 96,
    }
  }

  const cardWidth = Math.min(380, Math.max(280, window.innerWidth - 112))
  const inset = 16
  const defaultLeft = window.innerWidth - cardWidth - 88
  const defaultTop = Math.round(window.innerHeight * 0.18)

  return {
    cardId,
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
            {/* The project and book name: the user's content. An ellipsis is
                the design for a fixed shell header, so it is declared. */}
            <span className="study-v2__shellProjectText" data-truncates="">{title}</span>
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

  return (
    <span
      className="study-v2 study-v2__shellProgress study-v2__shellCenterProgress"
      aria-label={`${routeLabel}: ${progressText}`}
    >
      <span className="study-v2__shellProgressLabel">
        <span className="study-v2__shellProgressLabelText">Segment </span>
        {progressCurrent} of {progressTotal}
      </span>
      {/* The dot row is gone.
          It was capped at five and mapped position proportionally, so on an
          eight-segment project it lit the second of five dots directly beside the
          words "Segment 3 of 8". Two readings of the same fact, side by side,
          disagreeing — and the dots were aria-hidden, so they carried nothing for
          assistive technology either. R3 states the count and shows nothing else,
          which is the better decision and removes the contradiction. */}
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
  progress = null,
}) {
  return (
    <div className="study-v2 study-v2__shellMetaCluster" data-debug-item="study_shell_meta_cluster">
      {progress}
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

/**
 * The pane toggle.
 *
 * It was a double chevron pointing in a direction, which tells you which way
 * something will move but not WHAT — the review note was that a user cannot
 * predict what the control does before pressing it. A panel glyph says it: a
 * frame with one edge filled, opening or closing on the side the pane is on.
 * The accessible name and the tooltip now name the panel too ("Expand support
 * panel"), so the affordance reads the same by sight, by hover and by
 * screen reader, without adding any explanatory UI to the rail.
 */
export function StudyPaneToggle({ collapsed, label, onClick, side = 'left' }) {
  const Icon = side === 'left'
    ? (collapsed ? PanelLeftOpen : PanelLeftClose)
    : (collapsed ? PanelRightOpen : PanelRightClose)

  return (
    <IconActionButton
      size="utility-sm"
      label={label}
      title={label}
      onClick={onClick}
      icon={<Icon strokeWidth={1.8} />}
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
  const isDone = (id) => (segmentRecords[id] ?? {}).submissionState === 'submitted'
  const studiedCount = visibleFiles.filter((node) => isDone(node.id)).length

  // Segments belonging to each chapter, so a folder can show how much is left.
  const chapterCounts = {}
  let currentChapter = null
  for (const node of nodes) {
    if (node.type === 'folder') { currentChapter = node.id; chapterCounts[currentChapter] = 0; continue }
    if (currentChapter && !isDone(node.id)) chapterCounts[currentChapter] += 1
  }

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
                {/* A finished chapter shows nothing: its segments already carry
                    green markers, so "0" would be noise, not information. */}
                {chapterCounts[node.id] ? (
                  <span className="study-v2__chapterCount">
                    {chapterCounts[node.id]}
                    <span className="study-v2__srOnly"> segments left</span>
                  </span>
                ) : null}
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
              // Finding 31: the rail truncates by design — it is 208px wide and
              // holds user-authored Arabic titles — but a truncated label with no
              // way to read it in full is a dead end. The full title is available
              // on hover and to assistive technology.
              title={node.label}
              aria-label={node.label}
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
              {/* Script-aware, with dir auto so an RTL title truncates from the
                  correct end. Arabic rendered in the Latin UI role crops its own
                  ascenders and diacritics; the product has an Arabic role with
                  the line-height Arabic needs, and these titles are user
                  content whose script is not known at design time. */}
              <span
                dir="auto"
                className="study-v2__segmentLabel"
                style={containsArabic(node.label)
                  ? { fontFamily: typography.arabicCompact.fontFamily, lineHeight: typography.arabicCompact.lineHeight }
                  : undefined}
              >
                {node.label}
              </span>
            </button>
          )
        })}
      </div>
      {visibleFiles.length ? (
        <div className="study-v2__railFooter" data-debug-item="study_segment_progress">
          <span className="study-v2__railFooterLabel">
            Studied {studiedCount} / {visibleFiles.length}
          </span>
          <span
            className="study-v2__railProgress"
            role="progressbar"
            aria-valuenow={studiedCount}
            aria-valuemin={0}
            aria-valuemax={visibleFiles.length}
            aria-label="Segments studied"
          >
            <span style={{ width: `${visibleFiles.length ? (studiedCount / visibleFiles.length) * 100 : 0}%` }} />
          </span>
        </div>
      ) : null}
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
  const [bodyRef, bodyEdges] = useScrollAffordance('y')

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
          {/* Icon-only, like every other control in a card-header utility row.
              The written label was the one text item in that row and cost ~46px
              of a header that had none to spare. */}
          <IconActionButton size="utility-sm" label="Copy source text" title="Copy source text" icon={<Copy strokeWidth={1.8} />} />
        </CardHeader>
        <div ref={bodyRef} className="study-v2__cardBody study-v2__sourceBody" {...bodyEdges}>
          <p
            className="study-v2__arabicSource"
            dir="rtl"
            style={{
              // The ramp step, scaled by the reader's own A-/A+ control. The
              // -2px was an untraceable adjustment that put the product's
              // primary reading size one point off its own ramp at rest.
              fontSize: `calc(var(--study-arabic-size) * ${fontScale})`,
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
  const [stripRef, stripEdges] = useScrollAffordance('x')

  return (
    <section className="study-v2__studyStack" style={{ gap: 'var(--study-space-12)' }} data-debug-item="study_quick_lexicography">
      <div className="study-v2__lexHeader">
        <BookOpen size={13} strokeWidth={1.9} />
        Quick Lexicography
      </div>
      <div ref={stripRef} className="study-v2__lexStrip" {...stripEdges}>
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
  error = null,
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
      return undefined
    }

    const fit = () => {
      textarea.style.height = 'auto'
      const maxHeight = Number.parseFloat(window.getComputedStyle(textarea).maxHeight)
      const capped = Number.isFinite(maxHeight)
      const nextHeight = capped ? Math.min(textarea.scrollHeight, maxHeight) : textarea.scrollHeight
      textarea.style.height = `${nextHeight}px`
      // Once the box stops growing the text must still be reachable. Leaving
      // this hidden meant the last lines of a long translation existed, were
      // saved, and could not be read back.
      textarea.style.overflowY = capped && textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
    }

    fit()

    // Re-fit when the metrics change rather than only when the text does.
    //
    // Measuring once on mount under-sized the box: the first pass ran before the
    // webfont applied, the text then reflowed taller, and nothing re-ran because
    // `draft` had not changed. The result was 19px of the user's own translation
    // hidden inside a control with overflow:hidden, on the screen whose whole
    // purpose is writing translations.
    document.fonts?.ready?.then(fit).catch(() => {})
    const observer = new ResizeObserver(fit)
    observer.observe(textarea)
    return () => observer.disconnect()
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
              {error ? (
                <p className="study-v2__editorError" role="alert">
                  <AlertCircle size={15} strokeWidth={2} style={{ flex: '0 0 auto', marginTop: '1px' }} />
                  {error}
                </p>
              ) : null}
              <div className="study-v2__editorActions">
                <kbd className="study-v2__shortcut" aria-hidden="true">{SUBMIT_SHORTCUT}</kbd>
                <button
                  type="button"
                  className="study-v2__secondaryAction"
                  onClick={onDiscuss}
                  // The visible label is what the docked width affords; the
                  // accessible name stays the full phrase so the control is not
                  // ambiguous to a screen reader or in a tooltip.
                  aria-label={discussionOpen ? 'Hide the discussion for this segment' : 'Discuss this segment'}
                  title={discussionOpen ? 'Hide the discussion for this segment' : 'Discuss this segment'}
                >
                  <MessageSquare size={15} strokeWidth={1.9} />
                  {discussionOpen ? 'Hide' : 'Discuss'}
                </button>
                <PrimaryCTA
                  minWidth={132}
                  height={44}
                  icon={<Send size={15} strokeWidth={1.9} />}
                  onClick={onSubmit}
                  title={`${failed ? 'Submit again' : 'Submit translation'} (${SUBMIT_SHORTCUT_LABEL})`}
                >
                  {failed ? 'Submit again' : 'Submit'}
                </PrimaryCTA>
              </div>
            </div>
          </div>
        </StudyPanel>
      </div>
    </div>
  )
}

/**
 * The discussion, and what it is about.
 *
 * Two things were unclear at once. The panel was titled "Study Companion", which
 * names the tool but never says the conversation is attached to the segment in
 * front of you — the scope the legacy build carried in "Discuss This Segment".
 * The title bar has room for that; a narrow toggle beside a Submit button does
 * not, which is why the scope had been dropped rather than shortened.
 *
 * And it offered "Close" while the editor's toggle offered "Hide" — one action,
 * two verbs, in two places, which reads as two different capabilities. Nothing
 * is discarded either way, so both say Hide.
 */
export function StudyDiscussionCompanion({ onClose, segmentLabel }) {
  return (
    <StudyPanel className="study-v2__discussion" tone="slate" debugItem="study_discussion_companion">
      <CardHeader
        badge={<MessageSquare size={15} />}
        title={segmentLabel ? `Discussion · ${segmentLabel}` : 'Discussion'}
        tone="slate"
      >
        <button type="button" className="study-v2__miniPill" onClick={onClose} title="Hide the discussion for this segment">Hide</button>
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
      {/* A reference translation is only shown when one EXISTS for this segment.
          It used to render a fixture unconditionally, so a real project about a
          caravan leaving at dawn was given an authoritative "best in class"
          rendering of an unrelated passage about Friday prayer — presented, with
          a tick and a success tone, as the standard the user's work should be
          measured against. An absent reference has to say it is absent. */}
      <StudyPanel tone="success" className="study-v2__resultPanel" anchor="best">
        <CardHeader badge="✓" title="Best in Class Translation" tone="success">
          <button type="button" className="study-v2__miniPill" title="Copy best translation" disabled={!bestTranslation}>
            <Copy size={14} />
            Copy
          </button>
        </CardHeader>
        <div className="study-v2__cardBody">
          {bestTranslation
            ? <p className="study-v2__bodyText">{bestTranslation}</p>
            : (
              <p className="study-v2__bodyText study-v2__referenceAbsent">
                No reference translation has been published for this segment yet.
                Nothing here is being compared against your work.
              </p>
            )}
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
      <StudyPanel tone="slate" className="study-v2__resultPanel study-v2__notesPanel" anchor="notes">
        <CardHeader badge={<ScrollText size={15} />} title="Discussion Summary & Notes" tone="slate">
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

/**
 * A support module that has nothing real to say about this segment.
 *
 * Guidance, Lexicography, Phrasing and Key Takeaways are written against the
 * reference passage. With a live project they were still rendered verbatim, so
 * a segment about a caravan leaving at dawn came with Key Takeaways asserting
 * that مصر جامع "sets the legal frame for Friday prayers" — a confident,
 * specific claim about text that does not contain it.
 *
 * This is the same failure as the invented grade, in a quieter voice: the
 * product stating things about the user's work that it has not established. An
 * empty support module is honest and costs the user nothing; a wrong one costs
 * them their trust in every other panel on the screen.
 */
function ReferenceOnlyBody() {
  // No module name in the sentence: the panel header already carries it, and
  // interpolating it produced "Key takeaways ... has not been prepared" — the
  // template could not agree with both singular and plural titles.
  return (
    <p className="study-v2__supportText study-v2__referenceAbsent">
      Not prepared for this segment yet, and nothing is standing in for it.
    </p>
  )
}

export function StudySupportRail({ collapsed, onToggleCollapsed, state, isReference = true }) {
  // ONE presentation, not four booleans kept in step by hand.
  //
  // A module is docked, expanded over the panel, fullscreen, or floating — and
  // it is exactly one of those at a time. That was already true of the product
  // but not of the code: four independent slots each had to remember to null the
  // other three, in four separate functions, and every new entry point was
  // another place to forget. Making the modes one discriminated value means the
  // exclusivity is structural rather than remembered.
  //
  //   { mode: 'docked' }
  //   { mode: 'expanded',   cardId }
  //   { mode: 'fullscreen', cardId }
  //   { mode: 'floating',   cardId, left, top }
  const [presentation, setPresentation] = useState(DOCKED_PRESENTATION)
  // Preview is not a presentation. It is a transient hover affordance on the
  // collapsed rail, so it lives outside the mode and is only ever consulted
  // while the rail is collapsed and nothing else is open.
  const [previewCardId, setPreviewCardId] = useState(null)
  const [previewTop, setPreviewTop] = useState(null)
  const previewCloseTimerRef = useRef(null)
  const floatingDragCleanupRef = useRef(null)
  const isSubmitted = state === 'submitted'
  const isFailed = state === 'failed'
  const cards = isSubmitted
    ? [
        { id: 'grade', title: 'Surface check', tone: 'success', icon: <Award size={18} />, body: <GradeBody failed={false} /> },
        { id: 'takeaways', title: 'Key Takeaways', tone: 'blue', icon: <Sparkles size={18} />, body: isReference ? <TakeawaysBody /> : <ReferenceOnlyBody /> },
        { id: 'lexicography', title: 'Lexicography', tone: 'purple', icon: <BookOpen size={18} />, body: isReference ? <LexicographyBody /> : <ReferenceOnlyBody /> },
      ]
    : isFailed
      ? [
          { id: 'grade', title: 'Surface check', tone: 'review', icon: <Award size={18} />, body: <GradeBody failed /> },
          { id: 'fix', title: 'Fix Steps', tone: 'review', icon: <Sparkles size={18} />, body: isReference ? <FixStepsBody /> : <ReferenceOnlyBody /> },
          { id: 'lexicography', title: 'Lexicography', tone: 'purple', icon: <BookOpen size={18} />, body: isReference ? <LexicographyBody /> : <ReferenceOnlyBody /> },
        ]
      : [
          { id: 'guidance', title: 'Guidance', tone: 'blue', icon: <Info size={18} />, body: isReference ? <GuidanceBody /> : <ReferenceOnlyBody /> },
          { id: 'lexicography', title: 'Lexicography', tone: 'purple', icon: <BookOpen size={18} />, body: isReference ? <LexicographyBody /> : <ReferenceOnlyBody /> },
          { id: 'phrasing', title: 'Phrasing', tone: 'teal', icon: <ScrollText size={18} />, body: isReference ? <PhrasingBody /> : <ReferenceOnlyBody /> },
      ]

  const cardInMode = (mode) => (
    presentation.mode === mode ? cards.find((card) => card.id === presentation.cardId) ?? null : null
  )
  const expandedCard = cardInMode('expanded')
  const fullscreenCard = cardInMode('fullscreen')
  const floatingCard = cardInMode('floating')
  const floatingCardState = presentation.mode === 'floating' ? presentation : null
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

  // Every transition goes through here, so a new entry point cannot introduce a
  // state nobody thought about.
  const present = (next) => {
    if (next.mode !== 'floating') {
      floatingDragCleanupRef.current?.()
    }
    setPresentation(next)
    setPreviewCardId(null)
  }

  const openExpandedCard = (cardId) => present({ mode: 'expanded', cardId })
  const openFullscreenCard = (cardId) => present({ mode: 'fullscreen', cardId })
  const openFloatingCard = (cardId) => {
    setPresentation((current) => (
      current.mode === 'floating' && current.cardId === cardId
        ? current
        : { mode: 'floating', ...createFloatingCardState(cardId) }
    ))
    setPreviewCardId(null)
  }
  const dockCard = () => present(DOCKED_PRESENTATION)
  const closeFloatingCard = dockCard

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
      setPresentation((current) => {
        if (current.mode !== 'floating') {
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
    onToggleCollapsed?.()
  }
  const openFullscreenFromCollapsedPreview = (cardId) => openFullscreenCard(cardId)
  const floatFromCollapsedPreview = (cardId) => openFloatingCard(cardId)

  if (collapsed) {
    return (
      <aside className="study-v2 study-v2__railPanel study-v2__supportPanel is-collapsed" data-debug-item="study_support_collapsed">
        <div className="study-v2__supportHeader" style={{ justifyContent: 'center', padding: 0 }}>
          <StudyPaneToggle collapsed={collapsed} side="right" label="Expand support panel" onClick={onToggleCollapsed} />
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
              // Expands the panel with this module open. It used to detach the
              // card into a floating window, which is a power feature reached
              // by an ordinary click on the most obvious control in the rail —
              // and it left the rail still collapsed, so the relationship
              // between the tile and the panel it belongs to was never shown.
              // Floating is still one click away, from the hover preview.
              onClick={() => expandFromCollapsedPreview(card.id)}
            >
              <span className="study-v2__supportIcon">{card.icon}</span>
              <span className="study-v2__collapsedSupportLabel">{card.title}</span>
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
        {fullscreenCard ? <StudyFullscreenSupportCard card={fullscreenCard} onClose={dockCard} /> : null}
      </aside>
    )
  }

  return (
    <aside className="study-v2 study-v2__railPanel study-v2__supportPanel" data-debug-item="study_support_rail">
      <div className="study-v2__supportHeader">
        <span>Support</span>
        <StudyPaneToggle collapsed={collapsed} side="right" label="Collapse support panel" onClick={onToggleCollapsed} />
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
              onClick={() => openFullscreenCard(expandedCard.id)}
              icon={<Maximize2 strokeWidth={1.8} />}
            />
            <IconActionButton
              className="study-v2__supportOverlayClose"
              size="utility-sm"
              label={`Close ${expandedCard.title}`}
              title={`Close ${expandedCard.title}`}
              onClick={dockCard}
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
      {fullscreenCard ? <StudyFullscreenSupportCard card={fullscreenCard} onClose={dockCard} /> : null}
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
            icon={<PanelRightOpen strokeWidth={1.8} />}
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
            icon={<PictureInPicture2 strokeWidth={1.8} />}
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
          {draggable ? (
            <span className="study-v2__dragGrip" aria-hidden="true" title="Drag to move">
              <GripVertical size={14} strokeWidth={1.8} />
            </span>
          ) : null}
          <span className="study-v2__supportIcon">{card.icon}</span>
          <h3 className="study-v2__supportTitle">{card.title}</h3>
          {preview && onExpand ? (
            <IconActionButton
              className="study-v2__supportExpand"
              size="utility-sm"
              label={`Expand ${card.title} in panel`}
              title={`Expand ${card.title} in panel`}
              onClick={onExpand}
              icon={<PanelRightOpen strokeWidth={1.8} />}
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
              icon={<PictureInPicture2 strokeWidth={1.8} />}
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
          {/* DOCK, not close. Floating had exactly one exit, labelled "Close"
              with an X, so returning a module to the rail looked like dismissing
              it — and there was no control at all that said "put this back".
              The action was always a dock; only its name and icon disagreed. */}
          {!preview && onClose ? (
            <IconActionButton
              size="utility-sm"
              label={`Return ${card.title} to the support panel`}
              title={`Return ${card.title} to the support panel`}
              onClick={onClose}
              icon={<PanelRightClose strokeWidth={1.8} />}
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

/**
 * The result of a submission, in the REFERENCE path.
 *
 * This used to render "Your Grade 8.4", "Reviewed: 15 Mar 2026" and "Model
 * evaluation with a scholar-facing rubric", followed by three paragraphs of
 * specific praise and criticism — "Accurate treatment of the core city-condition
 * terminology" — about a translation nothing had read. A reviewer submitted
 * `dsfdg` and was told their terminology was accurate.
 *
 * It did this on the same screen that says, in its own banner, that meaning and
 * accuracy are not evaluated. Two claims, opposite, twelve inches apart. That is
 * not a polish defect; it is the product lying about its own capability, and it
 * would have shipped attached to a study tool whose entire value is that you can
 * trust what it tells you about your work.
 *
 * `data/evaluation.js` already got this right — it returns `score: null`
 * deliberately, because "a number here would imply a measurement this stub
 * cannot make", and every note it emits is something a reader could verify
 * without knowing Arabic. This is that same contract, rendered. The composition
 * is unchanged; only the claims are gone.
 */
function GradeBody({ failed }) {
  return (
    <div className="study-v2__gradeBody">
      <div className={`study-v2__gradeCircle${failed ? ' is-review' : ''}`}>
        {failed
          ? <AlertTriangle size={40} strokeWidth={1.6} aria-hidden="true" />
          : <CheckCircle2 size={40} strokeWidth={1.6} aria-hidden="true" />}
      </div>
      <p className="study-v2__gradeMeta">
        <strong>{failed ? 'Needs another pass' : 'No issues found'}</strong>
        <br />
        Automated surface check — form and completeness only. Meaning and accuracy
        are not scored.
      </p>
      {failed ? (
        <div className="study-v2__insightBox is-review">
          <p className="study-v2__insightTitle">
            <span className="study-v2__insightDot" aria-hidden="true" />
            What the check found
          </p>
          <p className="study-v2__supportText">
            The translation is much shorter than the source. Check whether a clause
            has been dropped.
          </p>
        </div>
      ) : (
        <div className="study-v2__insightBox is-success">
          <p className="study-v2__insightTitle">
            <span className="study-v2__insightDot" aria-hidden="true" />
            What the check found
          </p>
          <p className="study-v2__supportText">
            No structural issues detected: length is proportionate to the source,
            nothing is left untranslated, and the text is punctuated.
          </p>
        </div>
      )}
      <div className="study-v2__insightBox is-blue">
        <p className="study-v2__insightTitle">
          <span className="study-v2__insightDot" aria-hidden="true" />
          What this does not cover
        </p>
        <p className="study-v2__supportText">
          Whether the meaning is right. Compare your work against the reference
          translation below, and use Discuss to question anything it asserts.
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
