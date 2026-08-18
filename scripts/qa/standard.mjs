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
  // Mobile. [DECISION 2026-08-16] "A 390px version is required for V1, built
  // after the desktop surface is correct." The desktop surface is correct, so
  // the frame is declared — a scope item that nothing measures is a scope item
  // nobody can finish.
  { id: '390x844', width: 390, height: 844, tier: 'mobile' },
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
 * The distinction is deliberately narrow. Exams was the last entry on the
 * production side of that line: §2.1 kept the legacy screen shipping "until the
 * V2 replacement has genuine parity". The V2 replacement now exists on the
 * shared shell, so every production route is V2 and every legacy route is a
 * behaviour source. That is the line the plan was always aiming at.
 */
export const ROUTES = [
  // Legacy — retained as behaviour sources until their behaviour is ported.
  { id: 'legacy-home', hash: 'home', app: 'legacy', surface: 'reference' },
  { id: 'legacy-study', hash: 'study', app: 'legacy', surface: 'reference' },
  { id: 'legacy-segmentation', hash: 'segmentation', app: 'legacy', surface: 'reference' },
  // The V2 replacement exists, so legacy Exams is a behaviour source like the
  // other three. It is reachable only at #exams-legacy now; #exams redirects.
  { id: 'legacy-exams', hash: 'exams-legacy', app: 'legacy', surface: 'reference' },
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
  { id: 'v2-exams', hash: 'v2/exams', app: 'v2', surface: 'production' },
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

  /**
   * Unused space in a container that is simultaneously clipping its own content.
   * Below this it is ordinary rounding and trailing padding; above it the
   * container is refusing height it already has.
   */
  maxSlackBesideClippedPx: 24,
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
 * This is `scale` in src/v2/foundation/tokens/typography.ts. Kept explicit
 * rather than imported so that correcting the tokens is a deliberate act
 * checked against this list.
 *
 * It used to hold fifteen steps including 11.5, 12.5, 14, 16, 18, 22.5 and 25 —
 * pairs one point apart that no eye can distinguish and that therefore licensed
 * every screen to sit one step away from every other. Ten steps, each visibly
 * different from its neighbours, is a ramp you can actually hold a product to.
 */
export const TYPE_RAMP = [11, 12, 13, 15, 17, 20, 23, 26, 34, 44]

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

/**
 * Chrome that is deliberately docked over a scroll region and therefore allowed
 * to pass over content: a bottom action bar, a sticky header. Marked with an
 * attribute rather than detected from position:sticky, because sticky alone does
 * not mean "intended" — the worst overlap this standard has caught was a sticky
 * toolbar permanently covering a group header. Each use is a recorded decision.
 */
export const DOCKED_CHROME_SELECTOR = '[data-docked-chrome]'

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
  'viewport-escape': { blocking: true, title: 'Element sits outside the frame (horizontal)' },
  // Vertical reachability, which viewport-escape never measured.
  'control-unreachable': { blocking: true, title: 'Control lies outside the frame and cannot be scrolled into view' },
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
  // Added after the Study source card was found holding 111px of unused white at
  // the bottom WHILE its own scroller clipped the Arabic passage inside it. Spare
  // room and cut text in the same component, for the same reason: the panel was
  // flex: 0 1 auto, so nothing claimed the slack. Found by eye, which per
  // CLAUDE.md means it was a missing rule.
  'slack-beside-clipped-content': { blocking: true, title: 'Container leaves unused space while its own content is clipped' },
  // [WCAG] 2.4.7 Focus Visible. Tested by focusing the control, not by reading
  // CSS: a :focus-visible rule can exist and be overridden three stylesheets
  // away, and "declared" is not "rendered".
  'focus-invisible': { blocking: true, title: 'Control shows nothing when focused by keyboard' },
  'type-drift': { blocking: false, title: 'Rendered size outside the approved ramp' },
}
