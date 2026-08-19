// ─────────────────────────────────────────────────────────────────────────────
// THE ARAPAL TYPE SYSTEM — one ramp, addressed by semantic role.
//
// Before this file was rewritten there were two parallel ramps here (a base set
// and a `study*` set) and screens picked from whichever one happened to carry
// the number they wanted: Project Home built its page title out of
// `displayTitle.fontFamily` + `studyPageTitle.fontSize`, and its card title out
// of `cardTitle.fontFamily` + `studySectionTitle.fontSize`. Used that way a
// token is not a role, it is a bag of numbers, and the product rendered 24
// distinct sizes and 11 distinct weights across eight screens — which is what
// "different areas look like they were designed by different teams" actually
// is, measured.
//
// Two rules govern everything below:
//
//   1. A role names a JOB, not a size. Screens address roles. If a screen needs
//      a size that no role provides, the missing thing is a role, not a literal.
//   2. Every size comes from `scale`. Nothing may render at a size that is not
//      a step on it, so drift is detectable — `TYPE_RAMP` in
//      scripts/qa/standard.mjs is this ramp and fails the build when they part.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The ramp. Ten steps, roughly a minor-third through the display range and
 * tighter through the UI range where the eye needs finer distinctions.
 *
 * The steps this REPLACED, and why each went:
 *   11.5, 12.5, 14  — sat one point from 11, 13 and 15 and read as the same
 *                     size, which is the "almost the same" the doctrine forbids.
 *   16, 18, 19, 22  — accidental. 18 was the document default (see index.css),
 *                     inherited by anything that forgot to declare a size.
 *   22.5, 25, 32, 50 — one-screen display sizes that made every screen's title
 *                     a different size from every other screen's title.
 */
const scale = {
  micro: '11px',
  meta: '12px',
  small: '13px',
  base: '15px',
  large: '17px',
  title: '20px',
  arabic: '23px',
  page: '26px',
  hero: '34px',
  display: '44px',
} as const

const families = {
  display: '"Playfair Display", Georgia, serif',
  ui: 'Inter, ui-sans-serif, system-ui, sans-serif',
  arabic: '"Amiri", "Noto Naskh Arabic", "Geeza Pro", serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const

/**
 * The four Inter weights index.css actually loads. `font-synthesis: none` is set
 * globally, so a weight outside this set does not render heavier — it snaps to
 * the nearest loaded face. The product was asking for 635, 650, 720, 845, 850
 * and 900 in places and getting 400 or 700 anyway: six weights that existed only
 * in the source.
 */
export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const

export const typeScale = scale

export const typography = {
  // ── Identity ───────────────────────────────────────────────────────────────
  /** The product wordmark in the application header. One place, one size. */
  productIdentity: {
    fontFamily: families.display,
    fontSize: scale.large,
    lineHeight: 1,
    fontWeight: fontWeights.semibold,
    letterSpacing: '-0.01em',
  },

  // ── Display / headings ─────────────────────────────────────────────────────
  /** Ceremonial. A landing or a completed-stage moment. At most one per screen. */
  displayTitle: {
    fontFamily: families.display,
    fontSize: scale.display,
    lineHeight: 1.02,
    fontWeight: fontWeights.medium,
    letterSpacing: '-0.02em',
  },
  /** A workspace's own opening statement — Exams, Source Intake, Projects. */
  heroTitle: {
    fontFamily: families.display,
    fontSize: scale.hero,
    lineHeight: 1.06,
    fontWeight: fontWeights.medium,
    letterSpacing: '-0.018em',
  },
  /** The main heading of an operational screen. */
  pageTitle: {
    fontFamily: families.display,
    fontSize: scale.page,
    lineHeight: 1.12,
    fontWeight: fontWeights.medium,
    letterSpacing: '-0.012em',
  },
  /** The heading of a major card or panel. */
  cardTitle: {
    fontFamily: families.display,
    fontSize: scale.title,
    lineHeight: 1.18,
    fontWeight: fontWeights.medium,
    letterSpacing: '-0.008em',
  },
  /** A structural heading inside a screen. Sans, so it reads as chrome. */
  sectionTitle: {
    fontFamily: families.ui,
    fontSize: scale.base,
    lineHeight: 1.3,
    fontWeight: fontWeights.bold,
    letterSpacing: '-0.005em',
  },
  /** A heading inside a card or a dense row. */
  subsectionTitle: {
    fontFamily: families.ui,
    fontSize: scale.small,
    lineHeight: 1.35,
    fontWeight: fontWeights.bold,
  },

  // ── Reading copy ───────────────────────────────────────────────────────────
  /** The paragraph directly under a hero or page title. */
  leadText: {
    fontFamily: families.ui,
    fontSize: scale.large,
    lineHeight: 1.6,
    fontWeight: fontWeights.regular,
  },
  /** Primary reading copy. The document default (index.css) is this role. */
  bodyText: {
    fontFamily: families.ui,
    fontSize: scale.base,
    lineHeight: 1.6,
    fontWeight: fontWeights.regular,
  },
  /** Secondary copy: card bodies, explanations, captions with sentences in them. */
  supportSubtext: {
    fontFamily: families.ui,
    fontSize: scale.small,
    lineHeight: 1.55,
    fontWeight: fontWeights.regular,
  },
  /** Metadata and counts. Supportive, never a sentence you must read. */
  metaText: {
    fontFamily: families.ui,
    fontSize: scale.meta,
    lineHeight: 1.4,
    fontWeight: fontWeights.medium,
  },

  // ── Labels and controls ────────────────────────────────────────────────────
  /**
   * The uppercase letter-spaced label above a group. 11px is the type floor, so
   * this role carries weight 700 — at 400 it was the least legible text in the
   * product while doing the most orientation work.
   */
  eyebrowLabel: {
    fontFamily: families.ui,
    fontSize: scale.micro,
    lineHeight: 1.1,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontWeight: fontWeights.bold,
  },
  /** Any compact control's label: pill, chip, filter, tab, secondary button. */
  controlLabel: {
    fontFamily: families.ui,
    fontSize: scale.small,
    lineHeight: 1,
    fontWeight: fontWeights.semibold,
    letterSpacing: '-0.002em',
  },
  /** A primary call to action. Uppercase, so it reads as a commitment. */
  ctaLabel: {
    fontFamily: families.ui,
    fontSize: scale.small,
    lineHeight: 1,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontWeight: fontWeights.bold,
  },
  /** Status and count badges. Sentence case at the floor needs the weight. */
  badgeLabel: {
    fontFamily: families.ui,
    fontSize: scale.micro,
    lineHeight: 1,
    fontWeight: fontWeights.bold,
    letterSpacing: '0.005em',
  },
  /** A figure quoted on its own — a score, a total, a count in a stat cell. */
  statValue: {
    fontFamily: families.display,
    fontSize: scale.page,
    lineHeight: 1,
    fontWeight: fontWeights.medium,
    letterSpacing: '-0.012em',
  },
  /** Transliteration, route hashes, technical readouts. */
  monoMeta: {
    fontFamily: families.mono,
    fontSize: scale.micro,
    lineHeight: 1.3,
    fontWeight: fontWeights.regular,
  },

  // ── Arabic ─────────────────────────────────────────────────────────────────
  /**
   * Arabic runs optically smaller than Latin at the same em, so the source roles
   * sit one to two steps above their Latin counterparts by design. That is a
   * justified difference, not drift.
   */
  /** The segment under study: the principal object on the screen. */
  arabicSourceText: {
    fontFamily: families.arabic,
    fontSize: scale.arabic,
    lineHeight: 1.85,
    fontWeight: fontWeights.regular,
  },
  /** Arabic inside a dense list row, a preview or an intake field. */
  arabicCompact: {
    fontFamily: families.arabic,
    fontSize: scale.large,
    lineHeight: 1.75,
    fontWeight: fontWeights.regular,
  },
  /** An Arabic term quoted inside an English sentence. */
  arabicInline: {
    fontFamily: families.arabic,
    fontSize: scale.large,
    lineHeight: 1.45,
    fontWeight: fontWeights.bold,
  },

  // ── Retained call-site names ───────────────────────────────────────────────
  // Study was built against its own ramp before these roles existed. The names
  // stay so ~40 call sites in StudyWorkspacePrimitives keep reading naturally,
  // but they are now aliases onto the roles above rather than a second ramp —
  // there is exactly one set of numbers in this file.
  studyPageTitle: {
    fontFamily: families.display,
    fontSize: scale.page,
    lineHeight: 1.12,
    fontWeight: fontWeights.semibold,
    letterSpacing: '-0.012em',
  },
  studySectionTitle: {
    fontFamily: families.ui,
    fontSize: scale.base,
    lineHeight: 1.3,
    fontWeight: fontWeights.bold,
  },
  studyBody: {
    fontFamily: families.ui,
    fontSize: scale.base,
    lineHeight: 1.6,
    fontWeight: fontWeights.regular,
  },
  studySupportText: {
    fontFamily: families.ui,
    fontSize: scale.small,
    lineHeight: 1.55,
    fontWeight: fontWeights.regular,
  },
  studyArabicSource: {
    fontFamily: families.arabic,
    fontSize: scale.arabic,
    lineHeight: 1.85,
    fontWeight: fontWeights.regular,
  },
  studyArabicInline: {
    fontFamily: families.arabic,
    fontSize: scale.large,
    lineHeight: 1.45,
    fontWeight: fontWeights.bold,
  },
  studyControlLabel: {
    fontFamily: families.ui,
    fontSize: scale.small,
    lineHeight: 1,
    fontWeight: fontWeights.semibold,
  },
}

// ── script-aware roles ───────────────────────────────────────────────────────

/**
 * Arabic block ranges, including the presentation forms fonts substitute into.
 *
 * A single Arabic character is enough: a project titled "1.1 في بداية الربيع"
 * is Arabic content with a Latin prefix, not Latin content.
 */
const ARABIC_PATTERN = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/

export function containsArabic(text: unknown): boolean {
  return ARABIC_PATTERN.test(String(text ?? ''))
}

/**
 * Pick the type role that matches the script the text is actually in.
 *
 * The product has Arabic roles with the line-height Arabic needs — 1.75 and 1.85
 * against Latin's 1.3 — but user-authored strings were being rendered with a
 * fixed Latin role wherever they appeared. So an Arabic project title rendered
 * in the Latin UI face at line-height 1.3, and its ascenders and diacritics were
 * cropped by their own line box. Nothing overflowed a container, so no geometric
 * check could see it; it simply looked broken.
 *
 * Pair this with `dir="auto"` on the element so an RTL string also truncates and
 * aligns from the correct side.
 */
export function getScriptAwareRole<T>(text: unknown, roles: { latin: T, arabic: T }): T {
  return containsArabic(text) ? roles.arabic : roles.latin
}
