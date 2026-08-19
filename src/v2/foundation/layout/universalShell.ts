import { colors, spacing } from '../tokens'
import { controlSizing } from '../tokens/controlSizing'
import { getDefaultBodySplitColumns, getHeaderIdentityInsetPx, getLayer1BodyColumns, shellSizing } from './shellSizing'

export const rootContainerName = 'Layer1_Stage_ScreenShell'

/** Size of the Arapal mark in the header. Must match AppIdentity's `ArapalMark`. */
export const IDENTITY_MARK_PX = 32

export function getUniversalShellContainers() {
  return [
    {
      name: rootContainerName,
      layer: 'Layer1',
      parent: null,
      semanticRole: 'stage',
      as: 'main',
      display: 'grid',
      layoutMode: 'grid',
      gridTemplateRows: `${shellSizing.header.heightPx} minmax(0, 1fr)`,
      alignItems: 'stretch',
      justifyContent: 'stretch',
      padding: '0',
      gap: '0',
      overflow: 'hidden',
      textAlign: 'left',
      style: {
        minHeight: '100vh',
        background: [
          'radial-gradient(circle at 8% 10%, rgba(219, 234, 254, 0.78), transparent 28%)',
          'radial-gradient(circle at 88% 12%, rgba(226, 232, 240, 0.82), transparent 24%)',
          `linear-gradient(180deg, ${colors.bgTop} 0%, ${colors.bgBottom} 100%)`,
        ].join(', '),
        color: colors.textStrong,
      },
    },
    {
      name: 'Layer1_Header_Row',
      layer: 'Layer1',
      parent: rootContainerName,
      semanticRole: 'shell-header-band',
      display: 'grid',
      layoutMode: 'grid',
      gridTemplateColumns: '6fr 18fr 6fr',
      alignItems: 'stretch',
      justifyContent: 'stretch',
      padding: '0',
      gap: '0',
      overflow: 'hidden',
      textAlign: 'left',
      style: {
        borderBottom: `1px solid ${colors.lineSoft}`,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(18px)',
      },
    },
    {
      name: 'Layer1_Header_StartLane',
      layer: 'Layer1',
      parent: 'Layer1_Header_Row',
      semanticRole: 'shell-safe-inset-lane',
      display: 'flex',
      layoutMode: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      // The identity mark centres on the same vertical spine as the rail's
      // icons, so the header and the navigation beneath it read as one edge
      // rather than two things that happen to be on the left. Derived from the
      // rail width and the mark, not chosen to look about right.
      //
      // The spine is the rail lane's FLOOR, not its nominal proportional width.
      // `navigationRail.collapsedPx` is 51.429px; the lane can never actually
      // resolve narrower than 60px, so deriving from the nominal value put the
      // mark 4.3px left of every icon it was supposed to align with, and left it
      // 9.7px off the viewport edge — close enough to read as clipped.
      padding: `0 ${spacing[16]} 0 ${getHeaderIdentityInsetPx(IDENTITY_MARK_PX)}px`,
      gap: spacing[16],
      overflow: 'visible',
      textAlign: 'left',
    },
    {
      name: 'Layer1_Header_CenterLane',
      layer: 'Layer1',
      parent: 'Layer1_Header_Row',
      semanticRole: 'shell-safe-inset-lane',
      display: 'flex',
      layoutMode: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `0 clamp(${spacing[12]}, 1.6vw, ${spacing[16]})`,
      gap: spacing[16],
      overflow: 'visible',
      textAlign: 'center',
    },
    {
      name: 'Layer1_Header_EndLane',
      layer: 'Layer1',
      parent: 'Layer1_Header_Row',
      semanticRole: 'shell-safe-inset-lane',
      display: 'flex',
      layoutMode: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: `0 clamp(${spacing[16]}, 2.2vw, ${spacing[32]})`,
      gap: spacing[16],
      overflow: 'visible',
      textAlign: 'right',
    },
    {
      name: 'Layer1_Body_Row',
      layer: 'Layer1',
      parent: rootContainerName,
      display: 'grid',
      layoutMode: 'grid',
      gridTemplateColumns: getLayer1BodyColumns(),
      alignItems: 'stretch',
      justifyContent: 'stretch',
      padding: '0',
      gap: '0',
      overflow: 'hidden',
      textAlign: 'left',
    },
    {
      name: 'Layer1_Body_NavigationRail',
      layer: 'Layer1',
      parent: 'Layer1_Body_Row',
      semanticRole: 'shell-chrome',
      display: 'flex',
      layoutMode: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      // Horizontal padding is derived from the control it holds, not chosen
      // alongside it, so the content lane always fits a rail control exactly.
      padding: `${spacing[20]} max(0px, calc((100% - ${controlSizing.navRailControlPx}px) / 2))`,
      gap: spacing[16],
      overflow: 'hidden',
      textAlign: 'left',
      style: {
        borderRight: `1px solid ${colors.lineSoft}`,
        background: 'rgba(255, 255, 255, 0.84)',
        backdropFilter: 'blur(18px)',
      },
    },
    // The rail is destinations, then utilities. It used to open with a brand
    // band holding the Arapal mark, which made the product's identity look like
    // the first item in a list of places to go. Identity moved to the header's
    // start lane, so the rail now begins with its first actual destination and
    // the pin control sits at the foot, out of the scanning path.
    {
      name: 'Layer1_Navigation_PrimaryList',
      layer: 'Layer1',
      parent: 'Layer1_Body_NavigationRail',
      semanticRole: 'shell-chrome',
      as: 'nav',
      display: 'flex',
      layoutMode: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      padding: '0',
      gap: spacing[12],
      // Visible so the active marker can sit on the RAIL's left edge rather than
      // inside the control it marks. The rail lane above still clips, so nothing
      // reaches the viewport edge; this only opens the 12px of lane padding the
      // marker needs to reach back across.
      overflow: 'visible',
      textAlign: 'left',
      style: {
        flex: 1,
      },
    },
    {
      name: 'Layer1_Navigation_UtilityAnchor',
      layer: 'Layer1',
      parent: 'Layer1_Body_NavigationRail',
      semanticRole: 'shell-chrome',
      display: 'flex',
      layoutMode: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      gap: '0',
      overflow: 'visible',
      textAlign: 'left',
      allowEmpty: true,
    },
    {
      name: 'Layer1_Body_ScreenBodyField',
      layer: 'Layer1',
      parent: 'Layer1_Body_Row',
      semanticRole: 'screen-body-field',
      display: 'grid',
      layoutMode: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr)',
      gridTemplateRows: 'minmax(0, 1fr)',
      alignItems: 'stretch',
      justifyContent: 'stretch',
      padding: '0',
      gap: '0',
      overflow: 'hidden',
      textAlign: 'left',
      style: {
        minWidth: 0,
        minHeight: 0,
      },
    },
  ]
}

export function getDefaultBodySplitContainers() {
  return [
    {
      name: 'Layer2_Body_Backdrop',
      layer: 'Layer2',
      parent: 'Layer1_Body_ScreenBodyField',
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
      style: {
        gridColumn: '1',
        gridRow: '1',
        minWidth: 0,
        minHeight: 0,
        position: 'relative',
        pointerEvents: 'none',
        background: [
          'radial-gradient(circle at 18% 16%, rgba(219, 234, 254, 0.7), transparent 24%)',
          'radial-gradient(circle at 84% 14%, rgba(226, 232, 240, 0.72), transparent 22%)',
          `linear-gradient(180deg, ${colors.surfaceSoft} 0%, rgba(255, 255, 255, 0.78) 100%)`,
        ].join(', '),
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
        minHeight: 0,
        position: 'relative',
        zIndex: 1,
      },
    },
    {
      name: 'Layer2_Body_ContentStartRail',
      layer: 'Layer2',
      parent: 'Layer2_Body_DefaultSplit',
      semanticRole: 'support-rail',
      display: 'flex',
      layoutMode: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      padding: `${spacing[24]} ${spacing[20]}`,
      gap: spacing[20],
      overflow: 'hidden',
      textAlign: 'left',
      style: {
        gridColumn: '1',
        gridRow: '1',
      },
    },
    {
      name: 'Layer2_Body_ContentCenterField',
      layer: 'Layer2',
      parent: 'Layer2_Body_DefaultSplit',
      semanticRole: 'content-owner',
      display: 'flex',
      layoutMode: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'stretch',
      padding: `${spacing[24]} ${spacing[24]} ${spacing[32]}`,
      gap: spacing[24],
      overflow: 'auto',
      textAlign: 'left',
      style: {
        gridColumn: '2',
        gridRow: '1',
        minWidth: 0,
        minHeight: 0,
        width: '100%',
      },
    },
    {
      name: 'Layer2_Body_ContentEndRail',
      layer: 'Layer2',
      parent: 'Layer2_Body_DefaultSplit',
      semanticRole: 'support-rail',
      display: 'flex',
      layoutMode: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      padding: `${spacing[24]} ${spacing[20]}`,
      gap: spacing[20],
      overflow: 'hidden',
      textAlign: 'left',
      style: {
        gridColumn: '3',
        gridRow: '1',
      },
    },
  ]
}
