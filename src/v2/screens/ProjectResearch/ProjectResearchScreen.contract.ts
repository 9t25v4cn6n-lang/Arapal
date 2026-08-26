import createScreenLayoutContract from '../../foundation/layout/createScreenLayoutContract'
import { spacing } from '../../foundation/tokens'

const layoutContract = createScreenLayoutContract({
  screenId: 'projectResearch',
  screenName: 'ProjectResearchScreen',
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
      name: 'Layer2_ProjectResearch_Root',
      layer: 'Layer2',
      parent: 'Layer1_Body_ScreenBodyField',
      semanticRole: 'project-research-workspace-root',
      display: 'grid',
      layoutMode: 'grid',
      gridTemplateRows: 'auto minmax(0, 1fr)',
      alignItems: 'stretch',
      justifyContent: 'stretch',
      padding: `clamp(${spacing[16]}, 2vw, ${spacing[24]})`,
      gap: spacing[16],
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
      // At mobile the fixed 1fr desk track was starved to ~0 height by the tall
      // stacked lens rail above it (S3-003). Normal-flow scroll instead: the
      // header, lenses, and desk each take real height and the page scrolls.
      mobile: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        gap: spacing[16],
      },
    },
  ],
  layer3: [
    {
      name: 'Layer3_ProjectResearch_Header',
      layer: 'Layer3',
      parent: 'Layer2_ProjectResearch_Root',
      semanticRole: 'project-research-header',
      display: 'flex',
      layoutMode: 'flex',
      alignItems: 'stretch',
      justifyContent: 'stretch',
      padding: '0',
      gap: '0',
      overflow: 'visible',
      textAlign: 'left',
      style: {
        minWidth: 0,
      },
      // Keep the masthead's full (stacked) height in the mobile flex column so
      // its Study-mode control doesn't overlap the lens panel below it (S3-003).
      mobile: { flexShrink: 0 },
    },
    {
      name: 'Layer3_ProjectResearch_Main',
      layer: 'Layer3',
      parent: 'Layer2_ProjectResearch_Root',
      semanticRole: 'project-research-main-workspace',
      display: 'grid',
      layoutMode: 'grid',
      gridTemplateColumns: 'minmax(188px, 216px) minmax(0, 1fr)',
      gridTemplateRows: 'minmax(0, 1fr)',
      // At 390px a 216px lens rail beside the workspace left both cut — the
      // title clipped inside its own block and the ledger pushed off the frame.
      // The lenses are a filter over the ledger, so on mobile the ledger gets the
      // width and the rail stacks above it rather than competing for it.
      // Flex column at mobile so the lens rail and the desk stack at their real
      // content height instead of fixed tracks that collapse the desk (S3-003).
      mobile: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
        gap: spacing[16],
      },
      alignItems: 'stretch',
      justifyContent: 'stretch',
      padding: '0',
      gap: spacing[16],
      overflow: 'hidden',
      textAlign: 'left',
      style: {
        minWidth: 0,
        minHeight: 0,
      },
    },
  ],
  layer4: [
    {
      name: 'Layer4_ProjectResearch_FilterRail',
      layer: 'Layer4',
      parent: 'Layer3_ProjectResearch_Main',
      semanticRole: 'project-knowledge-filter-rail',
      display: 'flex',
      layoutMode: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      padding: '0',
      gap: '0',
      overflow: 'hidden',
      textAlign: 'left',
      style: {
        minWidth: 0,
        minHeight: 0,
      },
      // Keep content height in the mobile flex column (S3-003).
      mobile: { flexShrink: 0, overflow: 'visible' },
    },
    {
      name: 'Layer4_ProjectResearch_ResultSurface',
      layer: 'Layer4',
      parent: 'Layer3_ProjectResearch_Main',
      semanticRole: 'project-knowledge-result-surface',
      display: 'flex',
      layoutMode: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      padding: '0',
      gap: '0',
      overflow: 'hidden',
      textAlign: 'left',
      style: {
        minWidth: 0,
        minHeight: 0,
      },
      // The desk must keep a real, usable height on its own — never collapse to
      // zero — so it stays a first-class work surface at mobile (S3-003).
      mobile: { flexShrink: 0, overflow: 'visible', minHeight: '70vh' },
    },
  ],
})

export default layoutContract
