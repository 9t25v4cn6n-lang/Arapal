import createScreenLayoutContract from '../../foundation/layout/createScreenLayoutContract'

export const layoutContract = createScreenLayoutContract({
  screenId: 'segmentationReview',
  screenName: 'SegmentationReviewScreen',
  bodyBackdrop: { preset: 'default' },
})

export default layoutContract
