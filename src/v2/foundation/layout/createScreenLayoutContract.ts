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

function validateContract({ screenId, screenName, containers }) {
  const errors = []
  const containerNames = containers.map((container) => container.name)
  const containerNameSet = new Set()

  containerNames.forEach((name) => {
    if (containerNameSet.has(name)) {
      errors.push(`duplicate container name "${name}"`)
      return
    }

    containerNameSet.add(name)
  })

  const rootContainers = containers.filter((container) => container.parent === null)

  if (!containerNameSet.has(rootContainerName)) {
    errors.push(`missing required root container "${rootContainerName}"`)
  }

  if (rootContainers.length !== 1 || rootContainers[0]?.name !== rootContainerName) {
    errors.push(`contract must declare exactly one root container and it must be "${rootContainerName}"`)
  }

  containers.forEach((container) => {
    if (container.name !== rootContainerName && !container.parent) {
      errors.push(`container "${container.name}" is missing a parent`)
    }

    if (container.parent && !containerNameSet.has(container.parent)) {
      errors.push(`container "${container.name}" references missing parent "${container.parent}"`)
    }

    if (container.allowEmpty && !container.semanticRole) {
      errors.push(`allowEmpty container "${container.name}" must declare a semanticRole`)
    }
  })

  if (errors.length > 0) {
    throw new Error(
      [
        `Invalid layout contract for ${screenName || screenId || 'unknown screen'}:`,
        ...errors.map((error) => `- ${error}`),
      ].join('\n'),
    )
  }
}

function createScreenLayoutContract({
  screenId,
  screenName,
  includeDefaultBodySplit = true,
  bodyBackdrop = { preset: 'default' },
  layer2 = [],
  layer3 = [],
  layer4 = [],
} = {}) {
  const containers = [
    ...getUniversalShellContainers(),
    ...(includeDefaultBodySplit ? getDefaultBodySplitContainers() : []),
    ...layer2,
    ...layer3,
    ...layer4,
  ].map(normalizeContainer)

  validateContract({ screenId, screenName, containers })

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
