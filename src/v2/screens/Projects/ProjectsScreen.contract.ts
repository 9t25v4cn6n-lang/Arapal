import createScreenLayoutContract from '../../foundation/layout/createScreenLayoutContract'

export const layoutContract = createScreenLayoutContract({
  screenId: 'projects',
  screenName: 'ProjectsScreen',
  bodyBackdrop: { preset: 'default' },
})

export default layoutContract
