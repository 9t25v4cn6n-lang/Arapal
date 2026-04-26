import {
  getSegmentationFlowHeaderSlots,
  SegmentationSuccessView,
} from '../../foundation/primitives/SegmentationFlowPrimitives'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import layoutContract from './SegmentationSuccessScreen.contract'

export default function SegmentationSuccessScreen({ route, shell }) {
  const slots = {
    ...getSegmentationFlowHeaderSlots({
      shell,
      stepIndex: 2,
      brandSubtitle: 'Ready',
      backRoute: 'segmentationReview',
    }),
    Layer3_SegmentationFlow_Page: <SegmentationSuccessView shell={shell} />,
  }

  return (
    <V2ScreenFrame
      contract={layoutContract}
      route={route}
      shell={shell}
      screenSlots={slots}
    />
  )
}
