import ScreenScaffoldPlaceholder from '../../foundation/primitives/ScreenScaffoldPlaceholder'
import layoutContract from './SegmentationReviewScreen.contract'

export default function SegmentationReviewScreen({ route, shell }) {
  return (
    <ScreenScaffoldPlaceholder
      contract={layoutContract}
      route={route}
      shell={shell}
      screenName="SegmentationReviewScreen"
    />
  )
}
