import createScreenLayoutContract from '../../foundation/layout/createScreenLayoutContract'

export const layoutContract = createScreenLayoutContract({
  screenId: 'projectHome',
  screenName: 'ProjectHomeScreen',
  bodyBackdrop: { preset: 'default' },
})

export default layoutContract
