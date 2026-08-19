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
        width: flowMetrics.reviewToolbarRailWidth,
        // Viewport space, because that is the space this palette actually needs.
        //
        // Two earlier attempts failed for the same underlying reason. As a
        // zero-height sticky anchor the toolbar overflowed downward from wherever
        // the anchor landed — 378px into the lane at 1280x800 — running 148px
        // past the fold with delete and float unpressable and sitting 84px on the
        // Approve bar. Giving the region a real band did not help either: sticky
        // lives in the document flow, so at rest the band still begins after the
        // intro and the source tray, leaving about 314px on a 768-tall frame for
        // 570px of tools. No height cap can fix a bad starting point.
        //
        // Fixed positioning is the right primitive for chrome that must stay
        // reachable: the band is the viewport, identical whether or not the page
        // is scrolled, so the arithmetic holds at every frame.
        position: 'fixed',
        top: `calc(${flowMetrics.shellHeaderHeight} + ${spacing[16]})`,
        // The page's own inline inset, which is where the reserved gutter's outer
        // edge sits. Deliberately NOT re-deriving the content box: that would mean
        // restating the shell's rail width and centring cap here, and a second
        // copy of shell arithmetic is what put this toolbar on top of the content
        // in the first place. Below ~1460px the container is not centred and this
        // lands exactly where the in-flow version did; above it the toolbar sits
        // further into the margin than the content — recorded in TODO.md.
        right: `clamp(${spacing[24]}, 4vw, ${spacing[48]})`,
        maxHeight: `calc(100vh - ${flowMetrics.reviewToolbarViewportReserve})`,
        zIndex: 32,
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
