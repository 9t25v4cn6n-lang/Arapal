import {
  getSegmentationFlowHeaderSlots,
  SegmentationSuccessView,
} from '../../foundation/primitives/SegmentationFlowPrimitives'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import layoutContract from './SegmentationSuccessScreen.contract'
import { select, useArapal } from '../../data'

export default function SegmentationSuccessScreen({ route, shell }) {
  // Success NEVER publishes. Publication is the explicit Approve action in Review
  // and nowhere else; this screen only REPORTS the canonical segments that
  // approval produced. The removed auto-publish "safety path" was exactly how the
  // proposal became canonical without the user approving it (S3-001).
  const publishedSegments = useArapal((s) => {
    const project = select.getCurrentProject(s)
    return project ? select.listSegments(project.id, s) : null
  })
  const projectTitle = useArapal((s) => select.getCurrentProject(s)?.title ?? '')

  const slots = {
    ...getSegmentationFlowHeaderSlots({
      shell,
      // Publish: the terminal step, so the indicator can say the flow is done.
      stepIndex: 2,
      backRoute: 'segmentationReview',
    }),
    Layer3_SegmentationFlow_Page: <SegmentationSuccessView shell={shell} publishedSegments={publishedSegments} projectTitle={projectTitle} />,
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
