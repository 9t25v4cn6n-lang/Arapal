import createScreenLayoutContract from '../../foundation/layout/createScreenLayoutContract'

export const layoutContract = createScreenLayoutContract({
  screenId: 'segmentationPaste',
  screenName: 'SegmentationPasteScreen',
  bodyBackdrop: { preset: 'default' },
})

export default layoutContract
