import ScreenScaffoldPlaceholder from '../../foundation/primitives/ScreenScaffoldPlaceholder'
import layoutContract from './SegmentationLoadingScreen.contract'

export default function SegmentationLoadingScreen({ route, shell }) {
  return (
    <ScreenScaffoldPlaceholder
      contract={layoutContract}
      route={route}
      shell={shell}
      screenName="SegmentationLoadingScreen"
    />
  )
}
