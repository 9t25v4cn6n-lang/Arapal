import ScreenContractRenderer from '../layout/ScreenContractRenderer'
import { getDefaultBodySplitColumns, getLayer1BodyColumns, shellSizing } from '../layout/shellSizing'
import { colors, elevation, motion, spacing } from '../tokens'
import AppIdentity from './AppIdentity'
import { HeaderCenter, HeaderMeta } from './HeaderBar'
import {
  getNavigationUtilityAnchorStyle,
  NavigationRailAiSetupControl,
  NavigationRailDataControl,
  NavigationRailItems,
  NavigationRailPinControl,
} from './NavigationRail'

/**
 * Navigation depth policy.
 *
 * Expanding the rail used to RESERVE its width from the grid, so simply moving
 * the pointer across the rail reflowed the entire workspace — and in Research it
 * took 248px away from the ledger, which is why a wide viewport still truncated
 * columns. Width is now reserved only when the user has PINNED the rail, which
 * is the one moment they have actually asked to trade canvas for labels.
 *
 * A hover therefore overlays: the rail floats above the body at its expanded
 * width and the layout underneath does not move. That is the same contract every
 * deep-workspace product uses, and it makes the policy one rule rather than a
 * per-screen judgement about how much width a workspace can spare.
 */
function getNavigationOverlayStyle(shell) {
  const isOverlaying = shell.showRail && shell.isNavExpanded && !shell.isNavPinned

  if (!isOverlaying) {
    return { position: 'relative', width: 'auto', boxShadow: 'none', zIndex: 'auto' }
  }

  return {
    position: 'absolute',
    insetBlock: 0,
    left: 0,
    width: shellSizing.navigationRail.expandedPx,
    zIndex: 40,
    boxShadow: elevation.raised,
  }
}

/**
 * Grid placement for the two body lanes.
 *
 * Explicit, because the overlaying rail is out of flow: an absolutely positioned
 * grid child takes no auto-placement slot, so the body field silently slid into
 * the rail's 60px column the moment a hover lifted the rail out. The screen did
 * not error — it rendered its entire workspace inside 60px and clipped it, which
 * is the kind of failure that only shows up in a screenshot.
 */
function getBodyLanePlacement(shell) {
  return shell.showRail
    ? { rail: { gridColumn: '1' }, body: { gridColumn: '2' } }
    : { rail: {}, body: { gridColumn: '1' } }
}

function getShellContainerOverrides(shell, contract) {
  const contractContainerNames = new Set(contract?.containers?.map((container) => container.name) ?? [])
  // Pinned, not expanded: a hover must not resize the workspace behind it.
  const reservesWidth = shell.showRail && shell.isNavPinned
  const layer1BodyColumns = shell.showRail ? getLayer1BodyColumns({ isNavExpanded: reservesWidth }) : 'minmax(0, 1fr)'
  const defaultSplitColumns = getDefaultBodySplitColumns({ isNavExpanded: reservesWidth && shell.showRail, isMobile: shell.isMobileViewport })

  const lanePlacement = getBodyLanePlacement(shell)

  const overrides = {
    Layer1_Body_ScreenBodyField: {
      style: { ...lanePlacement.body },
    },
    Layer1_Body_Row: {
      style: {
        gridTemplateColumns: layer1BodyColumns,
        transition: `grid-template-columns ${motion.panel}`,
        // Containing block for the overlaying rail.
        position: 'relative',
      },
    },
    Layer1_Body_NavigationRail: {
      style: shell.showRail
        ? {
            padding: shell.isNavExpanded ? `${spacing[20]} ${spacing[16]}` : `${spacing[20]} ${spacing[12]}`,
            ...lanePlacement.rail,
            ...getNavigationOverlayStyle(shell),
            transition: [
              `padding ${motion.panel}`,
              `width ${motion.panel}`,
              `background-color ${motion.micro}`,
              `border-color ${motion.micro}`,
              `box-shadow ${motion.panel}`,
            ].join(', '),
          }
        : {
            padding: '0',
            borderRight: 'none',
            background: 'transparent',
            backdropFilter: 'none',
            opacity: 0,
            pointerEvents: 'none',
          },
      onMouseEnter: shell.showRail ? shell.handleNavigationRailMouseEnter : undefined,
      onMouseLeave: shell.showRail ? shell.handleNavigationRailMouseLeave : undefined,
    },
    Layer2_Body_DefaultSplit: {
      style: {
        gridTemplateColumns: defaultSplitColumns,
        transition: `grid-template-columns ${motion.panel}`,
      },
    },
    Layer1_Navigation_UtilityAnchor: {
      style: {
        ...getNavigationUtilityAnchorStyle(shell.isNavExpanded),
      },
    },
    Layer1_Header_Row: {
      style: {
        boxShadow: `inset 0 -1px 0 ${colors.lineSoft}`,
      },
    },
  }

  if (contractContainerNames.has('Layer2_Body_ContentStartRail')) {
    overrides.Layer2_Body_ContentStartRail = {
      style: shell.showRail && shell.isNavPinned
        ? {
            width: '0px',
            minWidth: '0px',
            maxWidth: '0px',
            padding: '0',
            gap: '0',
            opacity: 0,
            pointerEvents: 'none',
          }
        : {
            padding: `${spacing[24]} ${spacing[20]}`,
            gap: spacing[20],
            opacity: 1,
            pointerEvents: 'auto',
            transition: [
              `width ${motion.panel}`,
              `min-width ${motion.panel}`,
              `max-width ${motion.panel}`,
              `padding ${motion.panel}`,
              `opacity ${motion.micro}`,
            ].join(', '),
          },
    }
  }

  return overrides
}

function mergeContainerOverrides(...sources) {
  return sources.reduce((merged, source) => {
    Object.entries(source || {}).forEach(([containerName, override]) => {
      const current = merged[containerName] ?? {}

      merged[containerName] = {
        ...current,
        ...override,
        style: {
          ...(current.style ?? {}),
          ...(override.style ?? {}),
        },
      }
    })

    return merged
  }, {})
}

export default function V2ScreenFrame({ contract, route, shell, screenSlots = {}, containerOverrides = {}, debugTools = null }) {
  // The start lane is COMPOSED, not replaced. Identity belongs to the shell and
  // appears on every screen; a screen may add a back control beside it but may
  // not decide whether the product has a name. Screens that used to own this
  // lane outright were how Study came to put its segment title where the logo
  // should be and Segmentation came to have no identity at all.
  const { Layer1_Header_StartLane: screenStartLane, ...remainingScreenSlots } = screenSlots

  const sharedSlots = {
    Layer1_Header_StartLane: (
      <>
        <AppIdentity onClick={() => shell.navigate('projectHome')} />
        {screenStartLane}
      </>
    ),
    Layer1_Header_CenterLane: <HeaderCenter route={route} />,
    Layer1_Header_EndLane: <HeaderMeta route={route} />,
    Layer1_Navigation_UtilityAnchor: (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8] }}>
        <NavigationRailAiSetupControl shell={shell} />
        <NavigationRailDataControl shell={shell} />
        <NavigationRailPinControl shell={shell} />
      </span>
    ),
    Layer1_Navigation_PrimaryList: <NavigationRailItems shell={shell} />,
  }

  return (
    <ScreenContractRenderer
      contract={contract}
      slotContent={{
        ...sharedSlots,
        ...remainingScreenSlots,
      }}
      containerOverrides={mergeContainerOverrides(getShellContainerOverrides(shell, contract), containerOverrides)}
      debugTools={debugTools}
    />
  )
}
