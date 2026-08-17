import ScreenContractRenderer from '../layout/ScreenContractRenderer'
import { getDefaultBodySplitColumns, getLayer1BodyColumns } from '../layout/shellSizing'
import { colors, motion, spacing } from '../tokens'
import { HeaderBrand, HeaderCenter, HeaderMeta } from './HeaderBar'
import {
  getNavigationBrandAnchorStyle,
  getNavigationHeaderBandStyle,
  getNavigationUtilityAnchorStyle,
  NavigationRailBrand,
  NavigationRailItems,
  NavigationRailPinControl,
} from './NavigationRail'

function getShellContainerOverrides(shell, contract) {
  const contractContainerNames = new Set(contract?.containers?.map((container) => container.name) ?? [])
  const layer1BodyColumns = shell.showRail ? getLayer1BodyColumns({ isNavExpanded: shell.isNavExpanded }) : 'minmax(0, 1fr)'
  const defaultSplitColumns = shell.showRail ? getDefaultBodySplitColumns({ isNavExpanded: shell.isNavExpanded }) : 'minmax(0, 1fr)'

  const overrides = {
    Layer1_Body_Row: {
      style: {
        gridTemplateColumns: layer1BodyColumns,
        transition: `grid-template-columns ${motion.panel}`,
      },
    },
    Layer1_Body_NavigationRail: {
      style: shell.showRail
        ? {
            padding: shell.isNavExpanded ? `${spacing[20]} ${spacing[16]}` : `${spacing[20]} ${spacing[12]}`,
            transition: [
              `padding ${motion.panel}`,
              `background-color ${motion.micro}`,
              `border-color ${motion.micro}`,
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
    Layer1_Navigation_HeaderBand: {
      style: {
        ...getNavigationHeaderBandStyle(shell.isNavExpanded),
      },
    },
    Layer1_Navigation_BrandAnchor: {
      style: {
        ...getNavigationBrandAnchorStyle(shell.isNavExpanded),
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
      style: shell.showRail && shell.isNavExpanded
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
  const sharedSlots = {
    Layer1_Header_StartLane: shell.showRail ? null : <HeaderBrand />,
    Layer1_Header_CenterLane: <HeaderCenter route={route} />,
    Layer1_Header_EndLane: <HeaderMeta route={route} />,
    Layer1_Navigation_BrandAnchor: <NavigationRailBrand isExpanded={shell.isNavExpanded} />,
    Layer1_Navigation_UtilityAnchor: <NavigationRailPinControl shell={shell} />,
    Layer1_Navigation_PrimaryList: <NavigationRailItems shell={shell} />,
  }

  return (
    <ScreenContractRenderer
      contract={contract}
      slotContent={{
        ...sharedSlots,
        ...screenSlots,
      }}
      containerOverrides={mergeContainerOverrides(getShellContainerOverrides(shell, contract), containerOverrides)}
      debugTools={debugTools}
    />
  )
}
