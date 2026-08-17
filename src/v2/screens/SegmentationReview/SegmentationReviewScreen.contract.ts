import createScreenLayoutContract from '../../foundation/layout/createScreenLayoutContract'
import { getDefaultBodySplitColumns } from '../../foundation/layout/shellSizing'
import { segmentationFlowMetrics as flowMetrics, spacing } from '../../foundation/tokens'

const layoutContract = createScreenLayoutContract({
  screenId: 'segmentationReview',
  screenName: 'SegmentationReviewScreen',
  includeDefaultBodySplit: false,
  bodyBackdrop: { preset: 'default' },
  layer2: [
    {
      name: 'Layer2_Body_Backdrop',
      layer: 'Layer2',
      parent: 'Layer1_Body_ScreenBodyField',
      display: 'flex',
      layoutMode: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'stretch',
      padding: '0',
      gap: '0',
      overflow: 'hidden',
      textAlign: 'left',
      style: {
        gridColumn: '1',
        gridRow: '1',
        minWidth: 0,
        minHeight: 0,
        position: 'relative',
        pointerEvents: 'none',
      },
    },
    {
      name: 'Layer2_Body_DefaultSplit',
      layer: 'Layer2',
      parent: 'Layer1_Body_ScreenBodyField',
      semanticRole: 'body-split',
      display: 'grid',
      layoutMode: 'grid',
      gridTemplateColumns: getDefaultBodySplitColumns(),
      alignItems: 'stretch',
      justifyContent: 'stretch',
      padding: '0',
      gap: '0',
      overflow: 'hidden',
      textAlign: 'left',
      style: {
        gridColumn: '1',
        gridRow: '1',
        minWidth: 0,
        minHeight: 0,
        position: 'relative',
        zIndex: 1,
      },
    },
    {
      name: 'Layer2_Body_ContentSpanField',
      layer: 'Layer2',
      parent: 'Layer2_Body_DefaultSplit',
      semanticRole: 'primary-scroll-owner',
      display: 'flex',
      layoutMode: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      padding: '0',
      gap: '0',
      overflow: 'auto',
      textAlign: 'left',
      style: {
        gridColumn: '1 / -1',
        gridRow: '1',
        minWidth: 0,
        minHeight: 0,
        width: '100%',
      },
    },
  ],
  layer3: [
    {
      name: 'Layer3_Review_CenteredStageStack',
      layer: 'Layer3',
      parent: 'Layer2_Body_ContentSpanField',
      semanticRole: 'centered-stage-stack',
      display: 'flex',
      layoutMode: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      padding: flowMetrics.reviewPagePadding,
      gap: spacing[20],
      overflow: 'visible',
      textAlign: 'left',
      style: {
        width: '100%',
        maxWidth: '1400px',
        minWidth: 0,
        minHeight: '100%',
        flex: '0 0 auto',
        margin: flowMetrics.centeredMargin,
        // paddingBottom removed: reviewPagePadding already sets the same 64px as
        // its bottom value, and declaring both made React warn about mixing a
        // shorthand with its own longhand on every rerender of this screen.
      },
    },
  ],
  layer4: [
    {
      name: 'Layer4_Review_IntroRegion',
      layer: 'Layer4',
      parent: 'Layer3_Review_CenteredStageStack',
      semanticRole: 'header-zone',
      display: 'flex',
      layoutMode: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      padding: '0',
      gap: spacing[24],
      overflow: 'visible',
      textAlign: 'left',
      style: {
        flex: '0 0 auto',
      },
    },
    {
      name: 'Layer4_Review_SourceTrayRegion',
      layer: 'Layer4',
      parent: 'Layer3_Review_CenteredStageStack',
      semanticRole: 'source-reference-zone',
      display: 'flex',
      layoutMode: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      padding: '0',
      gap: '0',
      overflow: 'visible',
      textAlign: 'left',
      style: {
        flex: '0 0 auto',
      },
    },
    {
      name: 'Layer4_Review_SelectedToolbarRegion',
      layer: 'Layer4',
      parent: 'Layer3_Review_CenteredStageStack',
      semanticRole: 'toolbar',
      display: 'flex',
      layoutMode: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '0',
      gap: '0',
      overflow: 'visible',
      textAlign: 'left',
      style: {
        alignSelf: 'flex-end',
        width: flowMetrics.reviewToolbarRailWidth,
        // A real band, not a zero-height anchor.
        //
        // This was height: 0, so the toolbar inside simply overflowed downward
        // from wherever the anchor happened to land — 378px down the lane at
        // 1280x800 — and ran 148px past the fold with delete and float
        // unpressable, sitting 84px on top of the Approve bar. Capping the
        // toolbar's own max-height could not fix that: the toolbar was already
        // shorter than the cap. The problem was where it started, not how tall it
        // was.
        //
        // Giving the region the height it is actually allowed to occupy means
        // sticky pins a band, the toolbar starts at the top of that band, and the
        // reserve keeps its bottom clear of the docked action bar.
        height: `calc(100vh - ${flowMetrics.reviewToolbarViewportReserve})`,
        position: 'sticky',
        top: flowMetrics.reviewWorkspaceStickyTop,
        zIndex: 12,
        minWidth: 0,
      },
    },
    {
      name: 'Layer4_Review_WorkboardRegion',
      layer: 'Layer4',
      parent: 'Layer3_Review_CenteredStageStack',
      semanticRole: 'main-work-zone',
      display: 'grid',
      layoutMode: 'grid',
      gridTemplateColumns: `minmax(${flowMetrics.reviewMarkerRailMinWidth}, ${flowMetrics.reviewMarkerRailMaxWidth}) minmax(0, 1fr)`,
      alignItems: 'flex-start',
      justifyContent: 'stretch',
      padding: '0',
      gap: spacing[24],
      overflow: 'visible',
      textAlign: 'left',
      style: {
        minHeight: flowMetrics.reviewWorkspaceMinHeight,
        flex: '0 0 auto',
        alignContent: 'start',
        gridAutoRows: 'max-content',
        // Clearance for the docked action bar. Without it the final segment card
        // scrolls to the bottom and stops underneath the bar, so the one card the
        // user scrolled all that way to reach is the one they cannot read.
        // Docking chrome over content is only honest if the content can get out
        // from under it.
        paddingBottom: flowMetrics.reviewActionBarClearance,
      },
    },
    {
      name: 'Layer4_Review_MarkerRail',
      layer: 'Layer4',
      parent: 'Layer4_Review_WorkboardRegion',
      semanticRole: 'support-rail',
      display: 'flex',
      layoutMode: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      padding: '0',
      gap: '0',
      overflow: 'visible',
      textAlign: 'left',
      style: {
        minWidth: 0,
      },
    },
    {
      name: 'Layer4_Review_CompiledPreview',
      layer: 'Layer4',
      parent: 'Layer4_Review_WorkboardRegion',
      semanticRole: 'primary-work-pane',
      display: 'flex',
      layoutMode: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      padding: '0',
      gap: '0',
      overflow: 'visible',
      textAlign: 'left',
      style: {
        minWidth: 0,
      },
    },
    {
      name: 'Layer4_Review_ActionRegion',
      layer: 'Layer4',
      parent: 'Layer3_Review_CenteredStageStack',
      semanticRole: 'action-region',
      display: 'flex',
      layoutMode: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      padding: '0',
      gap: spacing[24],
      overflow: 'visible',
      textAlign: 'left',
      style: {
        flex: '0 0 auto',
        zIndex: 14,
        // Docked, so the approve action is on screen the moment the screen is.
        //
        // Sticky resolves against the nearest scrollport but can only travel
        // within its own parent's box, which is why declaring it on the bar
        // itself did nothing: the bar's own wrapper is 104px tall and sits at
        // the very end of 1648px of scroll, so it only "stuck" once you had
        // already scrolled to the bottom. Declared here instead, on the region
        // that IS a direct child of the full-height stage stack, so the travel
        // range is the whole scroll.
        position: 'sticky',
        bottom: 0,
      },
    },
  ],
})

export default layoutContract
