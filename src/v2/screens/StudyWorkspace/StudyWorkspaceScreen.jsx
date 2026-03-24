import ScreenScaffoldPlaceholder from '../../foundation/primitives/ScreenScaffoldPlaceholder'
import layoutContract from './StudyWorkspaceScreen.contract'

export default function StudyWorkspaceScreen({ route, shell }) {
  return (
    <ScreenScaffoldPlaceholder
      contract={layoutContract}
      route={route}
      shell={shell}
      screenName="StudyWorkspaceScreen"
    />
  )
}
