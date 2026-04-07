import createScreenLayoutContract from '../../foundation/layout/createScreenLayoutContract'

const layoutContract = createScreenLayoutContract({
  screenId: 'projects',
  screenName: 'ProjectsScreen',
  bodyBackdrop: { preset: 'default' },
})

export default layoutContract
