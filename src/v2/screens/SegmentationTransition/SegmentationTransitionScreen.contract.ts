import createScreenLayoutContract from '../../foundation/layout/createScreenLayoutContract'

export const layoutContract = createScreenLayoutContract({
  screenId: 'segmentationTransition',
  screenName: 'SegmentationTransitionScreen',
  bodyBackdrop: { preset: 'default' },
})

export default layoutContract
