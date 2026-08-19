/**
 * Content measure — how wide a composition is allowed to get.
 *
 * The doctrine already sets a 1400px default for a major screen, and that is
 * right for a dense multi-pane workspace like Research or Study. It is wrong for
 * a single column of rows: at the canonical 1440 frame a full-width list row is
 * ~1,390px, so a title sits at one end, a control at the other, and the reader
 * has to traverse a metre of nothing between them. Two measures, chosen by what
 * the screen is, rather than one number applied to everything.
 */
export const measure = {
  /** A single column of rows, a form, a first-run composition. */
  readable: '1080px',
  /** A dense workspace that genuinely uses its panes. */
  wide: '1400px',
} as const
