import createScreenLayoutContract from '../../foundation/layout/createScreenLayoutContract'
import { measure, spacing } from '../../foundation/tokens'

/**
 * Exams, on the shared shell.
 *
 * Exams was the last screen in the product still rendering in the legacy app:
 * its own header bar, its own atmosphere layer, its own 1,167-line stylesheet
 * that never adopted a token, and — because the legacy app draws a screen
 * switcher over the top of whatever it is showing — a development nav bar
 * sitting on top of its own header. It was reviewed as "a different visual
 * language" because it was literally a different application.
 *
 * masthead · body. The body is the single scroll owner; the masthead does not
 * move, so the aggregate score and the mode stay legible while the library
 * scrolls.
 */
const layoutContract = createScreenLayoutContract({
  screenId: 'exams',
  screenName: 'ExamsScreen',
  includeDefaultBodySplit: false,
  bodyBackdrop: { preset: 'default' },
  layer2: [
    {
      name: 'Layer2_Exams_Backdrop',
      layer: 'Layer2',
      parent: 'Layer1_Body_ScreenBodyField',
      // The role is what makes the renderer fill this lane with the product's
      // atmosphere. Declaring the lane was never enough.
      semanticRole: 'body-backdrop',
      display: 'flex',
      layoutMode: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'stretch',
      padding: '0',
      gap: '0',
      overflow: 'hidden',
      textAlign: 'left',
      style: { gridColumn: '1', gridRow: '1', minWidth: 0, minHeight: 0, position: 'relative', pointerEvents: 'none', overflow: 'hidden' },
    },
    {
      name: 'Layer2_Exams_Root',
      layer: 'Layer2',
      parent: 'Layer1_Body_ScreenBodyField',
      semanticRole: 'primary-work-pane',
      display: 'grid',
      layoutMode: 'grid',
      gridTemplateRows: 'auto minmax(0, 1fr)',
      gridTemplateColumns: 'minmax(0, 1fr)',
      alignItems: 'stretch',
      justifyContent: 'stretch',
      padding: `${spacing[32]} clamp(${spacing[24]}, 3vw, ${spacing[40]}) 0`,
      gap: spacing[24],
      overflow: 'hidden',
      textAlign: 'left',
      style: {
        gridColumn: '1',
        gridRow: '1',
        minWidth: 0,
        minHeight: 0,
        position: 'relative',
        zIndex: 1,
        // A library of two rows stretched across 1,330px is a row with a title
        // at one end and a button at the other and a void between them. The
        // measure is what a list of assessments actually wants; the frame is
        // then filled by the backdrop, deliberately, the way the segmentation
        // flow's centred composition already does it.
        width: '100%',
        maxWidth: measure.readable,
        marginInline: 'auto',
      },
    },
  ],
  layer3: [
    {
      name: 'Layer3_Exams_Masthead',
      layer: 'Layer3',
      parent: 'Layer2_Exams_Root',
      semanticRole: 'header-zone',
      display: 'flex',
      layoutMode: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      padding: '0',
      gap: spacing[24],
      overflow: 'visible',
      textAlign: 'left',
      style: { gridRow: '1', minWidth: 0, flex: '0 0 auto', flexWrap: 'wrap' },
      mobile: { flexDirection: 'column', alignItems: 'flex-start' },
    },
    {
      name: 'Layer3_Exams_Body',
      layer: 'Layer3',
      parent: 'Layer2_Exams_Root',
      semanticRole: 'primary-work-pane',
      allowEmpty: true,
      display: 'flex',
      layoutMode: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      // The bottom inset lives on the scroll owner, not on the page: page
      // padding above a scroller reserves space the scroller then scrolls past,
      // which is how a "generous" bottom margin becomes a gap you cannot reach.
      padding: `0 0 ${spacing[40]}`,
      gap: spacing[32],
      overflow: 'auto',
      textAlign: 'left',
      style: { gridRow: '2', minWidth: 0, minHeight: 0 },
    },
  ],
})

export default layoutContract
