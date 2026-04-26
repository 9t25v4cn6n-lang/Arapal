import { useEffect } from 'react'
import {
  getSegmentationFlowHeaderSlots,
  SegmentationTransitionView,
} from '../../foundation/primitives/SegmentationFlowPrimitives'
import {
  getPostSegmentationRoute,
  shouldPauseSegmentationFlowTimers,
} from '../../foundation/primitives/segmentationFlowState'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import { segmentationFlowMetrics as flowMetrics } from '../../foundation/tokens'
import layoutContract from './SegmentationTransitionScreen.contract'

export default function SegmentationTransitionScreen({ route, shell }) {
  useEffect(() => {
    if (shouldPauseSegmentationFlowTimers()) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      shell.navigate(getPostSegmentationRoute())
    }, flowMetrics.transitionAdvanceDelayMs)

    return () => window.clearTimeout(timer)
  }, [shell])

  const slots = {
    ...getSegmentationFlowHeaderSlots({
      shell,
      stepIndex: 1,
      brandSubtitle: 'Segmenting',
      backRoute: 'segmentationPasteNext',
    }),
    Layer3_SegmentationFlow_Page: <SegmentationTransitionView shell={shell} />,
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
