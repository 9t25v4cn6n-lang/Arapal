import {
  getSegmentationFlowHeaderSlots,
  SegmentationSuccessView,
} from '../../foundation/primitives/SegmentationFlowPrimitives'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import layoutContract from './SegmentationSuccessScreen.contract'
import { select, getSnapshot } from '../../data'

export default function SegmentationSuccessScreen({ route, shell }) {
  const snapshot = getSnapshot()
  const project = select.getCurrentProject(snapshot)
  const publishedSegments = project ? select.listSegments(project.id, snapshot) : null

  const slots = {
    ...getSegmentationFlowHeaderSlots({
      shell,
      // Publish: the terminal step, so the indicator can say the flow is done.
      stepIndex: 2,
      brandSubtitle: 'Ready',
      backRoute: 'segmentationReview',
    }),
    Layer3_SegmentationFlow_Page: <SegmentationSuccessView shell={shell} publishedSegments={publishedSegments} />,
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
