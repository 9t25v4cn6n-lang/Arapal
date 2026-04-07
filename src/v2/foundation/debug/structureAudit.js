import { surfacePadding } from '../tokens'

function parsePx(value) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function isTransparent(color) {
  if (!color || color === 'transparent') {
    return true
  }

  if (color.startsWith('rgba(')) {
    const parts = color
      .replace('rgba(', '')
      .replace(')', '')
      .split(',')
      .map((part) => part.trim())

    return Number.parseFloat(parts[3] ?? '1') === 0
  }

  return false
}

function hasMeaningfulOwnText(node) {
  return Array.from(node.childNodes).some((child) => child.nodeType === Node.TEXT_NODE && child.textContent?.trim())
}

function isVisibleElement(node) {
  if (!(node instanceof HTMLElement)) {
    return false
  }

  const style = window.getComputedStyle(node)
  const rect = node.getBoundingClientRect()

  return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0
}

function getElementChildren(node) {
  return Array.from(node.children).filter((child) => child instanceof HTMLElement)
}

function isWrapperCandidate(node) {
  if (!(node instanceof HTMLElement) || !isVisibleElement(node)) {
    return false
  }

  if (node.dataset.debugName || node.dataset.debugItem) {
    return false
  }

  if (hasMeaningfulOwnText(node)) {
    return false
  }

  if (['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'IMG', 'SVG'].includes(node.tagName)) {
    return false
  }

  return getElementChildren(node).length === 1
}

function isSurfaceOwner(node) {
  if (!(node instanceof HTMLElement) || !isVisibleElement(node)) {
    return false
  }

  const style = window.getComputedStyle(node)
  const borderWidth =
    parsePx(style.borderTopWidth) +
    parsePx(style.borderRightWidth) +
    parsePx(style.borderBottomWidth) +
    parsePx(style.borderLeftWidth)
  const paddingWidth =
    parsePx(style.paddingTop) +
    parsePx(style.paddingRight) +
    parsePx(style.paddingBottom) +
    parsePx(style.paddingLeft)
  const radiusWidth =
    parsePx(style.borderTopLeftRadius) +
    parsePx(style.borderTopRightRadius) +
    parsePx(style.borderBottomRightRadius) +
    parsePx(style.borderBottomLeftRadius)

  return (
    borderWidth > 0 ||
    paddingWidth > 0 ||
    radiusWidth > 0 ||
    !isTransparent(style.backgroundColor) ||
    style.boxShadow !== 'none'
  )
}

function getDebugLabel(node) {
  if (!(node instanceof HTMLElement)) {
    return 'unknown'
  }

  return node.dataset.debugName || node.dataset.debugItem || node.tagName.toLowerCase()
}

function getTextLeaves(rootNode) {
  return Array.from(rootNode.querySelectorAll('*')).filter((node) => {
    if (!(node instanceof HTMLElement) || !isVisibleElement(node)) {
      return false
    }

    if (getElementChildren(node).length > 0) {
      return false
    }

    return Boolean(node.textContent?.trim())
  })
}

function findNearestSurfaceOwner(node, boundaryRoot) {
  let current = node

  while (current && boundaryRoot.contains(current)) {
    if (isSurfaceOwner(current)) {
      return current
    }
    current = current.parentElement
  }

  return boundaryRoot
}

export function collectStructureAudit(rootNode, containerName) {
  if (!rootNode) {
    return null
  }

  const auditRoot = containerName
    ? rootNode.querySelector(`[data-debug-name="${containerName}"]`)
    : rootNode

  if (!(auditRoot instanceof HTMLElement)) {
    return null
  }

  let totalElements = 0
  let maxDomDepth = 0
  let maxWrapperChain = 0
  let maxNestedSurfaceChain = 0
  const wrapperFindings = []

  function walk(node, depth = 0, wrapperChain = 0, surfaceChain = 0) {
    if (!(node instanceof HTMLElement) || !isVisibleElement(node)) {
      return
    }

    totalElements += 1
    maxDomDepth = Math.max(maxDomDepth, depth)

    const nextWrapperChain = isWrapperCandidate(node) ? wrapperChain + 1 : 0
    maxWrapperChain = Math.max(maxWrapperChain, nextWrapperChain)

    if (nextWrapperChain >= 3) {
      wrapperFindings.push({
        label: getDebugLabel(node),
        depth: nextWrapperChain,
      })
    }

    const isCurrentSurface = isSurfaceOwner(node)
    const nextSurfaceChain = isCurrentSurface ? surfaceChain + 1 : surfaceChain
    maxNestedSurfaceChain = Math.max(maxNestedSurfaceChain, nextSurfaceChain)

    getElementChildren(node).forEach((child) => walk(child, depth + 1, nextWrapperChain, nextSurfaceChain))
  }

  walk(auditRoot, 0, 0, 0)

  let minInset = Number.POSITIVE_INFINITY
  const insetIssues = []
  const textLeaves = getTextLeaves(auditRoot)

  textLeaves.forEach((textNode) => {
    const surfaceOwner = findNearestSurfaceOwner(textNode, auditRoot)
    if (!(surfaceOwner instanceof HTMLElement)) {
      return
    }

    const textRect = textNode.getBoundingClientRect()
    const surfaceRect = surfaceOwner.getBoundingClientRect()
    const inset = Math.min(
      textRect.left - surfaceRect.left,
      surfaceRect.right - textRect.right,
      textRect.top - surfaceRect.top,
      surfaceRect.bottom - textRect.bottom,
    )

    minInset = Math.min(minInset, inset)

    if (inset < surfacePadding.minimumReadableInset) {
      insetIssues.push({
        text: textNode.textContent.trim().slice(0, 48),
        inset: Math.round(inset),
        surface: getDebugLabel(surfaceOwner),
      })
    }
  })

  const findings = []

  if (maxWrapperChain >= 3) {
    findings.push(`Wrapper chain reaches ${maxWrapperChain} levels`)
  }

  if (maxNestedSurfaceChain >= 3) {
    findings.push(`Nested surface chain reaches ${maxNestedSurfaceChain} layers`)
  }

  if (insetIssues.length > 0) {
    findings.push(`${insetIssues.length} text nodes sit below the ${surfacePadding.minimumReadableInset}px readable inset`)
  }

  return {
    rootLabel: getDebugLabel(auditRoot),
    totalElements,
    maxDomDepth,
    maxWrapperChain,
    maxNestedSurfaceChain,
    minTextInset: Number.isFinite(minInset) ? Math.round(minInset) : null,
    insetIssues: insetIssues.slice(0, 5),
    wrapperFindings: wrapperFindings.slice(0, 5),
    findings,
  }
}

export default collectStructureAudit
