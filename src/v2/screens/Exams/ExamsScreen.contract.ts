import createScreenLayoutContract from '../../foundation/layout/createScreenLayoutContract'

export const layoutContract = createScreenLayoutContract({
  screenId: 'exams',
  screenName: 'ExamsScreen',
  bodyBackdrop: { preset: 'default' },
})

export default layoutContract
