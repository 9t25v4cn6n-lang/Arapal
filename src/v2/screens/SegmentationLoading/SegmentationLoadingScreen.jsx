import { useEffect } from 'react'
import {
  getSegmentationFlowHeaderSlots,
  SegmentationLoadingView,
} from '../../foundation/primitives/SegmentationFlowPrimitives'
import {
  getLoadingAdvanceRoute,
  shouldPauseSegmentationFlowTimers,
} from '../../foundation/primitives/segmentationFlowState'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import { segmentationFlowMetrics as flowMetrics } from '../../foundation/tokens'
import layoutContract from './SegmentationLoadingScreen.contract'

export default function SegmentationLoadingScreen({ route, shell }) {
  useEffect(() => {
    if (shouldPauseSegmentationFlowTimers()) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      shell.navigate(getLoadingAdvanceRoute())
    }, flowMetrics.loadingAdvanceDelayMs)

    return () => window.clearTimeout(timer)
  }, [shell])

  const slots = {
    ...getSegmentationFlowHeaderSlots({
      shell,
      stepIndex: 1,
      backRoute: 'segmentationPasteNext',
    }),
    Layer3_SegmentationFlow_Page: <SegmentationLoadingView />,
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
