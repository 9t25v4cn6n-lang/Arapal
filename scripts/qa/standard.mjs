// ─────────────────────────────────────────────────────────────────────────────
// THE ARAPAL VISUAL STANDARD — single source of truth.
//
// This file replaces prose governance. If a rule is not expressed here it is
// not enforced, and if it is expressed here it fails the build. Do not restate
// these rules in CLAUDE.md, in a contract document, or in a prompt.
//
// Provenance of every threshold below is recorded so the standard can be
// argued with on evidence rather than taste:
//   [WCAG]      WCAG 2.2 AA.
//   [DECISION]  Already ratified by the project in DECISIONS.md (2026-08-07)
//               for the Figma set and never applied to code.
//   [CONTRACT]  V2 Design Contract v1 (2026-03-24).
// ─────────────────────────────────────────────────────────────────────────────

/** Frames the product must hold. [CONTRACT] build frame + required validation frames. */
export const VIEWPORTS = [
  { id: '1440x900', width: 1440, height: 900, tier: 'build' },
  { id: '1366x768', width: 1366, height: 768, tier: 'validate' },
  { id: '1920x1080', width: 1920, height: 1080, tier: 'validate' },
  { id: '1280x800', width: 1280, height: 800, tier: 'validate' },
]

/**
 * Product routes. Dev labs are excluded from the product standard by design.
 *
 * `surface` encodes the plan's own §2.1 decision, so it is checkable rather than
 * argued in prose:
 *
 *   production — a screen a user is expected to reach in a release. Must be
 *                clean. This is what the release-candidate Floor gate means by
 *                "the current production surface".
 *   reference  — a legacy screen retained ONLY as a behaviour source until its
 *                behaviour is ported. Still measured, and its findings still
 *                reported, but they are debt against an implementation that is
 *                scheduled for deletion rather than release.
 *
 * The distinction is deliberately narrow. Exams is production: the plan says to
 * "preserve the working legacy capability until the V2 replacement has genuine
 * parity", which makes it the shipping Exams, not a reference copy.
 */
export const ROUTES = [
  // Legacy — retained as behaviour sources until their behaviour is ported.
  { id: 'legacy-home', hash: 'home', app: 'legacy', surface: 'reference' },
  { id: 'legacy-study', hash: 'study', app: 'legacy', surface: 'reference' },
  { id: 'legacy-segmentation', hash: 'segmentation', app: 'legacy', surface: 'reference' },
  // Production: this is the shipping Exams until a V2 replacement reaches parity.
  { id: 'legacy-exams', hash: 'exams', app: 'legacy', surface: 'production' },
  // V2 — the V1 product surface.
  { id: 'v2-projectHome', hash: 'v2/projectHome', app: 'v2', surface: 'production' },
  { id: 'v2-projects', hash: 'v2/projects', app: 'v2', surface: 'production' },
  { id: 'v2-projectResearch', hash: 'v2/projectResearch', app: 'v2', surface: 'production' },
  { id: 'v2-segmentationPasteNext', hash: 'v2/segmentationPasteNext', app: 'v2', surface: 'production' },
  // These two advance on a timer — loading after 1200ms, transition after
  // 2200ms — and the checker probes at 2600ms. Without the pause flag both were
  // measuring whatever they had navigated to, under the earlier route's name:
  // "v2-segmentationLoading" was reporting findings from the transition screen,
  // and the transition route was reporting the review screen's. Two of thirteen
  // routes silently pointed at the wrong thing, which is the same shape of
  // blindness as the old checker's screenCount: 1.
  { id: 'v2-segmentationTransition', hash: 'v2/segmentationTransition', app: 'v2', query: 'v2FlowPause=1', surface: 'production' },
  { id: 'v2-segmentationLoading', hash: 'v2/segmentationLoading', app: 'v2', query: 'v2FlowPause=1', surface: 'production' },
  { id: 'v2-segmentationReview', hash: 'v2/segmentationReview', app: 'v2', surface: 'production' },
  { id: 'v2-segmentationSuccess', hash: 'v2/segmentationSuccess', app: 'v2', surface: 'production' },
  { id: 'v2-studyWorkspace', hash: 'v2/studyWorkspace', app: 'v2', surface: 'production' },
]

export const THRESHOLDS = {
  /** Smallest permissible rendered text. [DECISION] "raises the type floor to 11px". */
  minFontSizePx: 11,

  /** Contrast minimums. [WCAG] 1.4.3. Large = >=24px, or >=18.66px at weight >=700. */
  contrastNormal: 4.5,
  contrastLarge: 3.0,

  /** Interactive target minimum. [WCAG] 2.5.8 Target Size (Minimum). */
  minTargetPx: 24,
  /** Comfortable target. [DECISION] "Build must give Md (36) and Sm (28) a 44px hit area." */
  preferredTargetPx: 44,

  /** Two rendered elements may not overlap by more than this. [CONTRACT] "no overlap". */
  maxOverlapPx: 2,

  /** A clipping container may not hide more than this much of its own content. */
  maxHiddenPx: 2,

  /** A scroll region must not hide more of its content than it shows without an affordance. */
  maxUnsignalledScrollRatio: 0.5,

  /** Nothing may sit outside the frame. [CONTRACT] "end-to-end partitions only". */
  maxViewportEscapePx: 2,

  /**
   * How much of a label may be cut before it counts as truncated.
   * [DECISION] A control's own label and a section's own title are authored,
   * finite strings — the layout is expected to hold them. User data (a project
   * title, a source extract) legitimately ellipsises and is exempt by selector,
   * not by tolerance, so this stays tight.
   */
  maxLabelClipPx: 1,

  /**
   * A scroll region below this overflow is not worth signalling — subpixel and
   * rounding overflow is not content the user needs to reach.
   */
  minSignallableOverflowPx: 8,
}

/**
 * Elements whose text is user data or source content, where an ellipsis is the
 * design rather than a defect. Everything else that clips a label is reported.
 * Kept as an explicit list so each exemption is a recorded decision.
 */
export const TRUNCATION_EXEMPT_SELECTORS = [
  '[data-truncates]',
  '.project-research__resultTitle',
  '.project-research__resultExtract',
  '.study-v2__segmentLabel',
  '.fg-center__textBlock',
]

/**
 * Approved type ramp, in px. Any rendered size outside this set is drift.
 * Derived from src/v2/foundation/tokens/typography.ts with the sub-floor steps
 * raised per [DECISION]. Kept explicit rather than imported so that correcting
 * the tokens is a deliberate act checked against this list.
 */
export const TYPE_RAMP = [11, 11.5, 12, 13, 14, 15, 16, 18, 20, 22.5, 23, 26, 32, 40, 50]

/**
 * Colours that may carry text, with their measured contrast on the app's two
 * surfaces. [DECISION] retuned textFaint and added the -strong semantic weights;
 * those retunes are recorded here and are what the tokens must become.
 */
export const TEXT_COLOR_POLICY = {
  // Permitted for text.
  allowed: ['#0F172A', '#334155', '#64748B', '#8496AE', '#15803D', '#B45309', '#FFFFFF'],
  // Present in the tokens today and NOT permitted for text (fills/icons only).
  decorativeOnly: ['#94A3B8', '#16A34A', '#D97706'],
}

/** Font families the product declares and must therefore actually load. */
export const REQUIRED_FONT_FAMILIES = ['Playfair Display', 'Inter', 'Amiri']

/**
 * Elements exempt from geometric rules. Decorative backdrops are marked
 * aria-hidden and are allowed to sit behind content; they are still checked
 * for viewport escape so they cannot force a scrollbar.
 */
export const DECORATIVE_SELECTOR = '[aria-hidden="true"]'

/** Rule registry. `blocking: true` means a violation fails the build. */
export const RULES = {
  overlap: { blocking: true, title: 'Rendered elements overlap' },
  'content-clipped': { blocking: true, title: 'Container clips its own content' },
  'container-undersized': { blocking: true, title: 'Container is smaller than the content it holds' },
  // RETIRED. It asked the same question as scroll-without-affordance and was a
  // strict subset of it: same overflow condition, plus a ratio. Two rules for
  // one defect double-counted it in the ratchet and made the totals read as
  // worse than the product was. The concern now lives in one rule with the
  // better name and the implementation that matches it.
  'viewport-escape': { blocking: true, title: 'Element sits outside the frame' },
  'type-floor': { blocking: true, title: 'Text below the minimum size' },
  contrast: { blocking: true, title: 'Text below the contrast minimum' },
  'hit-target': { blocking: true, title: 'Interactive target below the minimum' },
  'unnamed-control': { blocking: true, title: 'Interactive control has no accessible name' },
  'font-not-loaded': { blocking: true, title: 'Declared font family never loads' },
  // Both added after the checker reported "no change" on a Study frame where a
  // section title had ellipsised to "SOURCE T…", a button label had broken onto
  // three lines inside its own pill, and two scroll regions were slicing content
  // at a hard edge with their scrollbars hidden. Found by eye, which means they
  // were missing rules — see CLAUDE.md.
  'label-truncated': { blocking: true, title: 'A chrome label or control label is cut off by layout pressure' },
  'scroll-without-affordance': { blocking: true, title: 'Scroll region hides its scrollbar and gives no other signal' },
  // [WCAG] 2.4.7 Focus Visible. Tested by focusing the control, not by reading
  // CSS: a :focus-visible rule can exist and be overridden three stylesheets
  // away, and "declared" is not "rendered".
  'focus-invisible': { blocking: true, title: 'Control shows nothing when focused by keyboard' },
  'type-drift': { blocking: false, title: 'Rendered size outside the approved ramp' },
}
