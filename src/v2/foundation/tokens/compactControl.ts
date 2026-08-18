import { radius } from './radius'
import { typography } from './typography'

/**
 * COMPACT CONTROLS — the one size scale for every pill, chip, badge, filter,
 * tab, counter and secondary action in the product.
 *
 * Measured before it was written. Across eight screens the product was rendering
 * compact controls at twelve different heights (19, 24, 26, 28, 29.2, 32, 34,
 * 36, 40, 42, 44, 48), four radii, four type sizes, eight font weights and eight
 * horizontal paddings. That is why a Research filter and an Exams tab and a
 * Study badge read as three unrelated component families: they were three
 * unrelated component families.
 *
 * Four steps, and everything else derives from the step:
 *
 *   xs  24  inline badges, counts, tags — things you read, never press
 *   sm  32  chips, filters, status pills in a control row
 *   md  40  secondary actions, tabs, toolbar buttons
 *   lg  48  a screen's secondary-primary action
 *
 * (A screen's true primary action is PrimaryCTA at 56 and is deliberately one
 * step above this scale — it is the only control that should be.)
 *
 * SHAPE RULE. A compact control is a pill when it stands free on a surface, and
 * `soft` (radius 12) when it sits inside a track, grid or list that a pill would
 * fight — a navigation rail row, a segment-id cell, a segmented selector. That
 * is the whole rule; there is no third shape and no per-screen exception.
 */
export const compactControl = {
  xs: {
    heightPx: 24,
    paddingXPx: 8,
    gapPx: 6,
    iconPx: 12,
    type: typography.badgeLabel,
  },
  sm: {
    heightPx: 32,
    paddingXPx: 12,
    gapPx: 8,
    iconPx: 14,
    type: typography.controlLabel,
  },
  md: {
    heightPx: 40,
    paddingXPx: 16,
    gapPx: 8,
    iconPx: 16,
    type: typography.controlLabel,
  },
  lg: {
    heightPx: 48,
    paddingXPx: 20,
    gapPx: 12,
    iconPx: 18,
    type: typography.ctaLabel,
  },
} as const

export const compactControlShape = {
  pill: radius.pill,
  soft: radius[12],
} as const

export type CompactControlSize = keyof typeof compactControl
