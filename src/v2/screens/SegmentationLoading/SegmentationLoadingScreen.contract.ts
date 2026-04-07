import createScreenLayoutContract from '../../foundation/layout/createScreenLayoutContract'

const layoutContract = createScreenLayoutContract({
  screenId: 'segmentationLoading',
  screenName: 'SegmentationLoadingScreen',
  bodyBackdrop: { preset: 'default' },
})

export default layoutContract
