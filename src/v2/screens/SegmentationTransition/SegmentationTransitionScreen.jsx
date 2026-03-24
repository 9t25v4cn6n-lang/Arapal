import ScreenScaffoldPlaceholder from '../../foundation/primitives/ScreenScaffoldPlaceholder'
import layoutContract from './SegmentationTransitionScreen.contract'

export default function SegmentationTransitionScreen({ route, shell }) {
  return (
    <ScreenScaffoldPlaceholder
      contract={layoutContract}
      route={route}
      shell={shell}
      screenName="SegmentationTransitionScreen"
    />
  )
}
