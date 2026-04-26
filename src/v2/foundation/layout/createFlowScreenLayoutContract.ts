import createScreenLayoutContract from './createScreenLayoutContract'
import { getDefaultBodySplitColumns } from './shellSizing'

export default function createFlowScreenLayoutContract({
  screenId,
  screenName,
}: {
  screenId: string
  screenName: string
}) {
  return createScreenLayoutContract({
    screenId,
    screenName,
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
        name: 'Layer3_SegmentationFlow_Page',
        layer: 'Layer3',
        parent: 'Layer2_Body_ContentSpanField',
        semanticRole: 'composition-owner',
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
          minHeight: '100%',
          width: '100%',
        },
      },
    ],
  })
}
