import { useEffect } from 'react'
import {
  getSegmentationFlowHeaderSlots,
  SegmentationSuccessView,
} from '../../foundation/primitives/SegmentationFlowPrimitives'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import layoutContract from './SegmentationSuccessScreen.contract'
import { select, actions, getSnapshot, useArapal } from '../../data'

export default function SegmentationSuccessScreen({ route, shell }) {
  // Quick mode routes here without a manual Review step. Arriving with a pending
  // proposal means the user chose to auto-approve it (their Quick-mode toggle is
  // the approval), so publish it now — the canonical transaction happens exactly
  // once and Success always reflects real published segments (DECISIONS §5).
  // The manual path already published on Approve, so no proposal remains and this
  // is a no-op.
  useEffect(() => {
    const s = getSnapshot()
    const project = select.getCurrentProject(s)
    const proposal = project ? select.getProposal(project.id, s) : null
    if (project && proposal) {
      actions.publishSegments({ projectId: project.id, sourceId: proposal.sourceId, chunks: proposal.chunks })
    }
  }, [])

  const publishedSegments = useArapal((s) => {
    const project = select.getCurrentProject(s)
    return project ? select.listSegments(project.id, s) : null
  })

  const slots = {
    ...getSegmentationFlowHeaderSlots({
      shell,
      // Publish: the terminal step, so the indicator can say the flow is done.
      stepIndex: 2,
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
