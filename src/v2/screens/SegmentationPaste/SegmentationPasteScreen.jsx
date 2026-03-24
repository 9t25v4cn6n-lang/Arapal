import ScreenScaffoldPlaceholder from '../../foundation/primitives/ScreenScaffoldPlaceholder'
import layoutContract from './SegmentationPasteScreen.contract'

export default function SegmentationPasteScreen({ route, shell }) {
  return (
    <ScreenScaffoldPlaceholder
      contract={layoutContract}
      route={route}
      shell={shell}
      screenName="SegmentationPasteScreen"
    />
  )
}
