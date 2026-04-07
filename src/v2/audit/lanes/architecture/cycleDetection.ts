export function findStronglyConnectedComponents(graph: Map<string, Set<string>>) {
  const indexByNode = new Map<string, number>()
  const lowLinkByNode = new Map<string, number>()
  const stack: string[] = []
  const stackSet = new Set<string>()
  const components: string[][] = []
  let nextIndex = 0

  function visit(node: string) {
    indexByNode.set(node, nextIndex)
    lowLinkByNode.set(node, nextIndex)
    nextIndex += 1
    stack.push(node)
    stackSet.add(node)

    for (const dependency of graph.get(node) ?? []) {
      if (!indexByNode.has(dependency)) {
        visit(dependency)
        lowLinkByNode.set(node, Math.min(lowLinkByNode.get(node)!, lowLinkByNode.get(dependency)!))
      } else if (stackSet.has(dependency)) {
        lowLinkByNode.set(node, Math.min(lowLinkByNode.get(node)!, indexByNode.get(dependency)!))
      }
    }

    if (lowLinkByNode.get(node) !== indexByNode.get(node)) {
      return
    }

    const component: string[] = []
    while (stack.length > 0) {
      const current = stack.pop()!
      stackSet.delete(current)
      component.push(current)
      if (current === node) {
        break
      }
    }

    components.push(component.sort())
  }

  for (const node of graph.keys()) {
    if (!indexByNode.has(node)) {
      visit(node)
    }
  }

  return components.filter((component) => {
    if (component.length > 1) {
      return true
    }

    const onlyNode = component[0]
    return Boolean(onlyNode && graph.get(onlyNode)?.has(onlyNode))
  })
}
