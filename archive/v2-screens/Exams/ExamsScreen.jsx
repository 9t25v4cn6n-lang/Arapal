import ScreenScaffoldPlaceholder from '../../foundation/primitives/ScreenScaffoldPlaceholder'
import layoutContract from './ExamsScreen.contract'

export default function ExamsScreen({ route, shell }) {
  return <ScreenScaffoldPlaceholder contract={layoutContract} route={route} shell={shell} screenName="ExamsScreen" />
}
