import ScreenContractRenderer from '../layout/ScreenContractRenderer'
import { shellSizing } from '../layout/shellSizing'
import { colors, motion, spacing } from '../tokens'
import { HeaderBrand, HeaderCenter, HeaderMeta } from './HeaderBar'
import { NavigationRailBrand, NavigationRailItems, NavigationRailPinControl } from './NavigationRail'

function getShellContainerOverrides(shell) {
  const collapsedRailWidth = shell.showRail ? shellSizing.navigationRail.collapsedPx : '0px'
  const expandedRailWidth = shell.showRail ? shellSizing.navigationRail.expandedPx : '0px'
  const navigationRailWidth = shell.isNavExpanded ? expandedRailWidth : collapsedRailWidth

  return {
    Layer1_Body_Row: {
      style: {
        gridTemplateColumns: `${navigationRailWidth} minmax(0, 1fr)`,
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
    Layer1_Navigation_HeaderBand: {
      style: {
        gridTemplateColumns: shell.isNavExpanded ? 'minmax(0, 1fr) auto' : '1fr',
        justifyContent: shell.isNavExpanded ? 'stretch' : 'center',
      },
    },
    Layer1_Navigation_BrandAnchor: {
      style: {
        justifyContent: shell.isNavExpanded ? 'flex-start' : 'center',
      },
    },
    Layer1_Navigation_UtilityAnchor: {
      style: shell.isNavExpanded
        ? undefined
        : {
            display: 'none',
          },
    },
    Layer1_Header_Row: {
      style: {
        boxShadow: `inset 0 -1px 0 ${colors.lineSoft}`,
      },
    },
  }
}

export default function V2ScreenFrame({ contract, route, shell, screenSlots = {}, containerOverrides = {} }) {
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
      containerOverrides={{
        ...containerOverrides,
        ...getShellContainerOverrides(shell),
      }}
    />
  )
}
