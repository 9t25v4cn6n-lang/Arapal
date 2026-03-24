import createScreenLayoutContract from '../../foundation/layout/createScreenLayoutContract'

export const layoutContract = createScreenLayoutContract({
  screenId: 'studyWorkspace',
  screenName: 'StudyWorkspaceScreen',
  bodyBackdrop: { preset: 'default' },
})

export default layoutContract
