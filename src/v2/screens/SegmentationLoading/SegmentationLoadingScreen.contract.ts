import createScreenLayoutContract from '../../foundation/layout/createScreenLayoutContract'

export const layoutContract = createScreenLayoutContract({
  screenId: 'segmentationLoading',
  screenName: 'SegmentationLoadingScreen',
  bodyBackdrop: { preset: 'default' },
})

export default layoutContract
