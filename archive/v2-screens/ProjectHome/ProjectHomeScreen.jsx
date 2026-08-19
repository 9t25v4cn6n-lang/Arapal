import ScreenScaffoldPlaceholder from '../../foundation/primitives/ScreenScaffoldPlaceholder'
import layoutContract from './ProjectHomeScreen.contract'

export default function ProjectHomeScreen({ route, shell }) {
  return <ScreenScaffoldPlaceholder contract={layoutContract} route={route} shell={shell} screenName="ProjectHomeScreen" />
}
