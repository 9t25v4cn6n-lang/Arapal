import { spacing } from './spacing'

/**
 * ROW AND CARD RULE.
 *
 * A row's `min-height` is a FLOOR for the single-line case. It is not a
 * substitute for block padding, and treating it as one is how the Project Home
 * project row came to be `padding: 0 16px`: fine while the row was one line and
 * `align-items: center` did the work, and flush against both edges the moment it
 * stacked a title over metadata over a progress bar.
 *
 * So: every row declares block padding. `compactRow` is for a row whose content
 * is a single line; `compactRowStacked` is for one that stacks. The stacked step
 * matches the Advanced Options card, which is the composition this family is
 * meant to resemble.
 */
export const surfacePadding = {
  compactRow: `${spacing[12]} ${spacing[16]}`,
  compactRowStacked: `${spacing[16]} ${spacing[16]}`,
  minimumReadableInset: spacing[16],
  compact: spacing[16],
  standard: spacing[20],
  comfortable: spacing[24],
  modal: spacing[32],
  roundedRowInline: spacing[32],
  roundedRowBlock: spacing[16],
  compactShell: spacing[16],
  displayStage: spacing[20],
  labCard: spacing[20],
  labSection: spacing[20],
  panelHeaderX: spacing[16],
  panelBody: `${spacing[20]} ${spacing[20]} ${spacing[24]}`,
  panelBodyComfortable: `${spacing[24]} ${spacing[24]} ${spacing[32]}`,
  popoverBody: spacing[16],
  editorFrame: spacing[24],
  editorHeaderX: spacing[24],
  editorBody: `${spacing[24]} ${spacing[24]} ${spacing[32]}`,
  editorFooterX: spacing[24],
  modalBody: spacing[32],
  railShell: `${spacing[16]} ${spacing[12]} ${spacing[20]}`,
}
