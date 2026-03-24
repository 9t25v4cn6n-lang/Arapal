import ScreenScaffoldPlaceholder from '../../foundation/primitives/ScreenScaffoldPlaceholder'
import layoutContract from './ProjectsScreen.contract'

export default function ProjectsScreen({ route, shell }) {
  return <ScreenScaffoldPlaceholder contract={layoutContract} route={route} shell={shell} screenName="ProjectsScreen" />
}
