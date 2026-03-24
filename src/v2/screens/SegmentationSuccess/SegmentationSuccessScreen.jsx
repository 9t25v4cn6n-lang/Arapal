import ScreenScaffoldPlaceholder from '../../foundation/primitives/ScreenScaffoldPlaceholder'
import layoutContract from './SegmentationSuccessScreen.contract'

export default function SegmentationSuccessScreen({ route, shell }) {
  return (
    <ScreenScaffoldPlaceholder
      contract={layoutContract}
      route={route}
      shell={shell}
      screenName="SegmentationSuccessScreen"
    />
  )
}
