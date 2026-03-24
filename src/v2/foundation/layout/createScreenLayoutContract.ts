import { getDefaultBodySplitContainers, getUniversalShellContainers, rootContainerName } from './universalShell'

function normalizeContainer(container) {
  return {
    as: 'div',
    display: 'flex',
    layoutMode: 'flex',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: '0',
    gap: '0',
    overflow: 'visible',
    textAlign: 'left',
    ...container,
  }
}

export function createScreenLayoutContract({
  screenId,
  screenName,
  includeDefaultBodySplit = true,
  bodyBackdrop = { preset: 'default' },
  layer3 = [],
  layer4 = [],
} = {}) {
  const containers = [
    ...getUniversalShellContainers(),
    ...(includeDefaultBodySplit ? getDefaultBodySplitContainers() : []),
    ...layer3,
    ...layer4,
  ].map(normalizeContainer)

  return {
    screenId,
    screenName,
    rootContainerName,
    bodyBackdrop: {
      preset: bodyBackdrop?.preset ?? 'default',
    },
    containers,
  }
}

export default createScreenLayoutContract
