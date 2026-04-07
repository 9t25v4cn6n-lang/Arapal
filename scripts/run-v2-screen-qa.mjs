import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { chromium } from 'playwright'

const ALLOWED_SPACING_VALUES = new Set([0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64])
const FIXED_SIZE_EXCEPTIONS = {
  Layer1_Navigation_HeaderBand: new Set(['minHeight']),
  Layer1_Navigation_UtilityAnchor: new Set(['minWidth']),
}

const SCREEN_CONFIG = {
  segmentationPasteNext: {
    route: '#v2/segmentationPasteNext',
    primaryContainer: 'Layer4_SegmentationNext_WorkspaceBand',
    primaryWidthRange: [0.4, 0.61],
    centerContainer: 'Layer2_Body_ContentCenterField',
    compositionContainer: 'Layer3_SegmentationNext_OperationalStack',
    workspaceContainer: 'Layer4_SegmentationNext_WorkspaceBand',
    actionContainer: 'Layer4_SegmentationNext_ActionBand',
    requiredDebugItems: [
      'back_pill',
      'step_bar',
      'source_intake_brand',
      'mode_pill',
      'display_title',
      'support_subtext',
      'source_editor_surface',
      'editor_header',
      'source_textarea',
      'editor_footer',
      'cta_meta_row',
      'primary_cta',
      'split_cta_tail',
      'action_support_copy',
    ],
  },
}

const viewports = [
  { label: 'desktop-compact', width: 1366, height: 768 },
  { label: 'desktop-standard', width: 1440, height: 900 },
  { label: 'desktop-wide', width: 1920, height: 1080 },
]

const zoomStates = [
  { label: 'high-zoom', factor: 2 },
  { label: 'very-high-zoom', factor: 4 },
]

function formatGateStatus(pass) {
  return pass ? 'PASS' : 'FAIL'
}

function printSection(title) {
  console.log(`\n${title}`)
}

function summarizeValues(values) {
  return values.length > 0 ? values.join(', ') : 'none'
}

function summarizeReport(report) {
  const allRows = [
    ...report.viewportChecks.flatMap((check) => check.rows),
    ...report.zoomChecks.flatMap((check) => check.rows),
  ]
  const failingRows = allRows.filter((row) => !row.pass)
  const screenshotRefs = [
    ...report.viewportChecks.map((check) => check.screenshotPath).filter(Boolean),
    ...report.zoomChecks.map((check) => check.screenshotPath).filter(Boolean),
  ]

  return {
    screenId: report.screenId,
    route: report.route,
    generatedAt: report.generatedAt,
    status: failingRows.length === 0 ? 'pass' : 'fail',
    failingGateCount: failingRows.length,
    failingGates: failingRows.map((row) => row.gate),
    reportPath: `/v2-audit/runtime/${report.screenId}.json`,
    viewportCount: report.viewportChecks.length,
    viewportStressCount: report.zoomChecks.length,
    stressLabel: report.stressLabel ?? 'viewport-stress',
    stressMode: report.stressMode ?? 'css-zoom-approximation',
    screenshotCount: screenshotRefs.length,
    screenshotRefs,
  }
}

async function writeRuntimePublicOutputs(report) {
  const runtimeDir = path.join(process.cwd(), 'public', 'v2-audit', 'runtime')
  await fs.mkdir(runtimeDir, { recursive: true })

  const runtimeReportPath = path.join(runtimeDir, `${report.screenId}.json`)
  await fs.writeFile(runtimeReportPath, JSON.stringify(report, null, 2))

  const runtimeFiles = (await fs.readdir(runtimeDir))
    .filter((fileName) => fileName.endsWith('.json') && fileName !== 'index.json')
    .sort()

  const summaries = []
  for (const fileName of runtimeFiles) {
    const filePath = path.join(runtimeDir, fileName)
    const fileContents = await fs.readFile(filePath, 'utf8')
    const parsedReport = JSON.parse(fileContents)
    summaries.push(summarizeReport(parsedReport))
  }

  const runtimeIndex = {
    generatedAt: new Date().toISOString(),
    screens: summaries,
  }

  await fs.writeFile(path.join(runtimeDir, 'index.json'), JSON.stringify(runtimeIndex, null, 2))
}

async function collectMetrics(page, config, { zoomFactor = 1 } = {}) {
  const {
    primaryContainer,
    centerContainer,
    compositionContainer,
    workspaceContainer,
    actionContainer,
    requiredDebugItems = [],
  } = config

  return page.evaluate(
    ({
      primaryContainer,
      centerContainer,
      compositionContainer,
      workspaceContainer,
      actionContainer,
      requiredDebugItems,
      allowedSpacingValues,
      fixedSizeExceptions,
      zoomFactor,
    }) => {
      const allowedValues = new Set(allowedSpacingValues)
      const fixedSizeAllowlist = Object.fromEntries(
        Object.entries(fixedSizeExceptions).map(([containerName, properties]) => [containerName, new Set(properties)]),
      )

      function parsePx(value) {
        const parsed = Number.parseFloat(value)
        return Number.isFinite(parsed) ? parsed : 0
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

      function hasOwnMeaningfulText(node) {
        return Array.from(node.childNodes).some((child) => child.nodeType === Node.TEXT_NODE && child.textContent?.trim())
      }

      function hasMeaningfulTextContent(node) {
        return Boolean(node.innerText?.trim())
      }

      function getDebugLabel(node) {
        return node.dataset.debugName || node.dataset.debugItem || node.tagName.toLowerCase()
      }

      function parseLayerNumber(value) {
        const match = /^Layer(\d+)$/.exec(value ?? '')
        return match ? Number.parseInt(match[1], 10) : null
      }

      function isWrapperCandidate(node) {
        if (!(node instanceof HTMLElement) || !isVisibleElement(node)) {
          return false
        }

        if (node.dataset.debugName || node.dataset.debugItem) {
          return false
        }

        if (hasOwnMeaningfulText(node)) {
          return false
        }

        if (['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'IMG', 'SVG'].includes(node.tagName)) {
          return false
        }

        return getElementChildren(node).length === 1
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

      function intersects(rectA, rectB) {
        return (
          rectA.left < rectB.right &&
          rectA.right > rectB.left &&
          rectA.top < rectB.bottom &&
          rectA.bottom > rectB.top
        )
      }

      function containsRect(outer, inner) {
        return (
          outer.left <= inner.left &&
          outer.right >= inner.right &&
          outer.top <= inner.top &&
          outer.bottom >= inner.bottom
        )
      }

      function normalizeWidth(rectWidth) {
        return zoomFactor > 0 ? Math.round((rectWidth / zoomFactor) * 100) / 100 : rectWidth
      }

      function normalizeDistance(distance) {
        return zoomFactor > 0 ? Math.round((distance / zoomFactor) * 100) / 100 : distance
      }

      function getContentBoxRect(node) {
        const rect = node.getBoundingClientRect()
        const style = window.getComputedStyle(node)

        return {
          left: rect.left + parsePx(style.paddingLeft),
          right: rect.right - parsePx(style.paddingRight),
          top: rect.top + parsePx(style.paddingTop),
          bottom: rect.bottom - parsePx(style.paddingBottom),
        }
      }

      function isPositiveFixedPx(value) {
        if (typeof value !== 'string') {
          return false
        }

        const trimmed = value.trim()
        if (!trimmed.endsWith('px')) {
          return false
        }

        const parsed = Number.parseFloat(trimmed)
        return Number.isFinite(parsed) && parsed > 0
      }

      const root = document.querySelector('[data-debug-name="Layer1_Stage_ScreenShell"]')
      if (!(root instanceof HTMLElement)) {
        return { error: 'No V2 debug root found.' }
      }

      let totalElements = 0
      let maxDomDepth = 0
      let maxWrapperChain = 0
      let maxNestedSurfaceChain = 0

      function walk(node, depth = 0, wrapperChain = 0, surfaceChain = 0) {
        if (!(node instanceof HTMLElement) || !isVisibleElement(node)) {
          return
        }

        totalElements += 1
        maxDomDepth = Math.max(maxDomDepth, depth)

        const nextWrapperChain = isWrapperCandidate(node) ? wrapperChain + 1 : 0
        maxWrapperChain = Math.max(maxWrapperChain, nextWrapperChain)

        const nextSurfaceChain = isSurfaceOwner(node) ? surfaceChain + 1 : surfaceChain
        maxNestedSurfaceChain = Math.max(maxNestedSurfaceChain, nextSurfaceChain)

        getElementChildren(node).forEach((child) => walk(child, depth + 1, nextWrapperChain, nextSurfaceChain))
      }

      walk(root)

      const textLeaves = Array.from(root.querySelectorAll('*')).filter((node) => {
        if (!(node instanceof HTMLElement) || !isVisibleElement(node)) {
          return false
        }

        if (node.closest('[aria-hidden="true"]')) {
          return false
        }

        if (['TEXTAREA', 'INPUT', 'SELECT', 'OPTION'].includes(node.tagName)) {
          return false
        }

        if (getElementChildren(node).length > 0) {
          return false
        }

        return Boolean(node.textContent?.trim())
      })

      let minTextInset = Number.POSITIVE_INFINITY
      const insetIssues = []
      const readableInsetSkipRoles = new Set([
        'stage',
        'shell-header-band',
        'shell-safe-inset-lane',
        'shell-chrome',
        'breathing-band',
        'full-span-band',
      ])

      textLeaves.forEach((textNode) => {
        const surfaceOwner = findNearestSurfaceOwner(textNode, root)
        if (!(surfaceOwner instanceof HTMLElement)) {
          return
        }

        const textContent = textNode.textContent.trim()
        const surfaceRect = surfaceOwner.getBoundingClientRect()
        const surfaceLabel = getDebugLabel(surfaceOwner)
        const surfaceRole = surfaceOwner.dataset.debugSemanticRole

        if (textContent.length <= 2 || surfaceRect.height <= 48 || readableInsetSkipRoles.has(surfaceRole)) {
          return
        }

        const textRect = textNode.getBoundingClientRect()
        const inset = Math.min(
          textRect.left - surfaceRect.left,
          surfaceRect.right - textRect.right,
          textRect.top - surfaceRect.top,
          surfaceRect.bottom - textRect.bottom,
        )

        minTextInset = Math.min(minTextInset, inset)

        if (inset < 16) {
          insetIssues.push({
            text: textNode.textContent.trim().slice(0, 60),
            inset: Math.round(inset),
            surface: getDebugLabel(surfaceOwner),
          })
        }
      })

      const spacingValues = new Set()
      const invalidSpacingValues = new Set()
      const spacingAuditSkipRoles = new Set(['stage', 'shell-header-band', 'shell-safe-inset-lane', 'shell-chrome'])

      Array.from(root.querySelectorAll('[data-debug-name]')).forEach((node) => {
        if (!(node instanceof HTMLElement) || !isVisibleElement(node)) {
          return
        }

        if (spacingAuditSkipRoles.has(node.dataset.debugSemanticRole)) {
          return
        }

        const style = window.getComputedStyle(node)
        ;[
          style.paddingTop,
          style.paddingRight,
          style.paddingBottom,
          style.paddingLeft,
          style.gap,
          style.rowGap,
          style.columnGap,
        ]
          .map(parsePx)
          .filter((value) => value > 0)
          .forEach((value) => {
            const rounded = Math.round(value)
            spacingValues.add(rounded)
            if (!allowedValues.has(rounded)) {
              invalidSpacingValues.add(rounded)
            }
          })
      })

      const layerAncestryIssues = []
      const emptyContainers = []
      const passThroughContainers = []
      const containmentIssues = []
      const fixedSizeIssues = []

      const debugContainers = Array.from(root.querySelectorAll('[data-debug-name]')).filter((node) => isVisibleElement(node))
      const contractMeta = window.__ARAPAL_V2_CONTRACT_META__ ?? null
      const orphanOverrideKeys = Array.isArray(contractMeta?.unusedOverrideKeys) ? contractMeta.unusedOverrideKeys : []
      const missingRenderedContractContainers = Array.isArray(contractMeta?.missingRenderedContainers)
        ? contractMeta.missingRenderedContainers
        : []
      const extraRenderedContainers = Array.isArray(contractMeta?.extraRenderedContainers)
        ? contractMeta.extraRenderedContainers
        : []

      debugContainers.forEach((node) => {
        if (!(node instanceof HTMLElement)) {
          return
        }

        const childContainers = getElementChildren(node).filter(
          (child) => child instanceof HTMLElement && child.hasAttribute('data-debug-name') && isVisibleElement(child),
        )
        const nonContainerChildren = getElementChildren(node).filter(
          (child) => !(child instanceof HTMLElement && child.hasAttribute('data-debug-name')) && isVisibleElement(child),
        )
        const directText = hasOwnMeaningfulText(node)
        const hasDirectContent = nonContainerChildren.length > 0 || directText

        if (node !== root) {
          let ancestor = node.parentElement?.closest('[data-debug-name]') ?? null
          let hasLowerLayerAncestor = false
          const currentLayer = parseLayerNumber(node.dataset.debugLayer)

          while (ancestor) {
            const ancestorLayer = parseLayerNumber(ancestor.dataset.debugLayer)
            if (ancestorLayer !== null && currentLayer !== null && ancestorLayer < currentLayer) {
              hasLowerLayerAncestor = true
              break
            }
            ancestor = ancestor.parentElement?.closest('[data-debug-name]') ?? null
          }

          if (currentLayer !== null && currentLayer > 1 && !hasLowerLayerAncestor) {
            layerAncestryIssues.push({
              container: getDebugLabel(node),
              layer: node.dataset.debugLayer,
            })
          }
        }

        const allowEmpty = node.dataset.debugAllowEmpty === 'true'

        if (node !== root && childContainers.length === 0 && !hasDirectContent && !allowEmpty) {
          emptyContainers.push({
            container: getDebugLabel(node),
            layer: node.dataset.debugLayer ?? 'unknown',
          })
        }

        const explicitSizing = {
          width: node.style.width,
          height: node.style.height,
          minWidth: node.style.minWidth,
          minHeight: node.style.minHeight,
          maxWidth: node.style.maxWidth,
          maxHeight: node.style.maxHeight,
        }

        Object.entries(explicitSizing).forEach(([property, value]) => {
          if (!isPositiveFixedPx(value)) {
            return
          }

          const containerName = getDebugLabel(node)
          const allowedProperties = fixedSizeAllowlist[containerName]
          if (allowedProperties?.has(property)) {
            return
          }

          fixedSizeIssues.push({
            container: containerName,
            property,
            value,
          })
        })

        if (node !== root && childContainers.length === 1 && !hasDirectContent) {
          const semanticRole = node.dataset.debugSemanticRole
          const style = window.getComputedStyle(node)
          const nodeRect = node.getBoundingClientRect()
          const childRect = childContainers[0].getBoundingClientRect()
          const childOwnsNestedContainers = getElementChildren(childContainers[0]).some(
            (grandChild) => grandChild instanceof HTMLElement && grandChild.hasAttribute('data-debug-name') && isVisibleElement(grandChild),
          )
          const sameFootprint =
            Math.abs(nodeRect.left - childRect.left) <= 2 &&
            Math.abs(nodeRect.top - childRect.top) <= 2 &&
            Math.abs(nodeRect.right - childRect.right) <= 2 &&
            Math.abs(nodeRect.bottom - childRect.bottom) <= 2
          const hasStructuralContribution =
            parsePx(style.paddingTop) +
              parsePx(style.paddingRight) +
              parsePx(style.paddingBottom) +
              parsePx(style.paddingLeft) >
              0 ||
            parsePx(style.gap) > 0 ||
            parsePx(style.rowGap) > 0 ||
            parsePx(style.columnGap) > 0 ||
            parsePx(style.borderTopWidth) +
              parsePx(style.borderRightWidth) +
              parsePx(style.borderBottomWidth) +
              parsePx(style.borderLeftWidth) >
              0 ||
            !isTransparent(style.backgroundColor) ||
            style.boxShadow !== 'none'

          const isDeclaredStructuralOwner = semanticRole === 'composition-owner'

          if (sameFootprint && !hasStructuralContribution && !childOwnsNestedContainers && !isDeclaredStructuralOwner) {
            passThroughContainers.push({
              container: getDebugLabel(node),
              child: getDebugLabel(childContainers[0]),
            })
          }
        }

        const parentRect = node.getBoundingClientRect()
        getElementChildren(node).forEach((child) => {
          if (!(child instanceof HTMLElement) || !isVisibleElement(child)) {
            return
          }

          if (child.closest('[aria-hidden="true"]')) {
            return
          }

          const childStyle = window.getComputedStyle(child)
          if (childStyle.position === 'absolute' || childStyle.position === 'fixed') {
            return
          }

          const childRect = child.getBoundingClientRect()
          const isKnownNavigationListFalsePositive =
            getDebugLabel(node) === 'Layer1_Navigation_PrimaryList' && child.tagName === 'BUTTON'

          if (isKnownNavigationListFalsePositive) {
            return
          }

          const overflows =
            childRect.left < parentRect.left - 2 ||
            childRect.top < parentRect.top - 2 ||
            childRect.right > parentRect.right + 2 ||
            childRect.bottom > parentRect.bottom + 2

          if (overflows) {
            containmentIssues.push({
              container: getDebugLabel(node),
              child: getDebugLabel(child),
            })
          }
        })
      })

      const textOverlapCandidates = Array.from(root.querySelectorAll('*')).filter((node) => {
        if (!(node instanceof HTMLElement) || !isVisibleElement(node)) {
          return false
        }

        if (node.closest('[aria-hidden="true"]')) {
          return false
        }

        const tag = node.tagName
        const meaningfulLeaf = getElementChildren(node).length === 0 && hasMeaningfulTextContent(node)
        const interactive = ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(tag) && hasMeaningfulTextContent(node)
        const isNamedMeaningfulNode = Boolean(node.dataset.debugItem || node.dataset.debugName)

        return (meaningfulLeaf || interactive) && isNamedMeaningfulNode
      })

      const overlapIssues = []
      for (let index = 0; index < textOverlapCandidates.length; index += 1) {
        const left = textOverlapCandidates[index]
        const leftRect = left.getBoundingClientRect()
        if (leftRect.width === 0 || leftRect.height === 0) {
          continue
        }

        for (let compareIndex = index + 1; compareIndex < textOverlapCandidates.length; compareIndex += 1) {
          const right = textOverlapCandidates[compareIndex]

          if (left.contains(right) || right.contains(left)) {
            continue
          }

          const rightRect = right.getBoundingClientRect()
          if (rightRect.width === 0 || rightRect.height === 0) {
            continue
          }

          if (containsRect(leftRect, rightRect) || containsRect(rightRect, leftRect)) {
            continue
          }

          if (!intersects(leftRect, rightRect)) {
            continue
          }

          overlapIssues.push({
            left: getDebugLabel(left),
            right: getDebugLabel(right),
          })

          if (overlapIssues.length >= 8) {
            break
          }
        }

        if (overlapIssues.length >= 8) {
          break
        }
      }

      const primaryNode = primaryContainer
        ? root.querySelector(`[data-debug-name="${primaryContainer}"]`)
        : null
      const primaryCoverage = primaryNode instanceof HTMLElement
        ? Math.round((primaryNode.getBoundingClientRect().width / window.innerWidth) * 1000) / 1000
        : null
      const primaryCenterOffset =
        primaryNode instanceof HTMLElement
          ? normalizeDistance((primaryNode.getBoundingClientRect().left + primaryNode.getBoundingClientRect().right) / 2 - window.innerWidth / 2)
          : null
      const visibleDebugItems = Array.from(root.querySelectorAll('[data-debug-item]'))
        .filter((node) => isVisibleElement(node))
        .map((node) => node.dataset.debugItem)
      const visibleDebugItemSet = new Set(visibleDebugItems)
      const missingDebugItems = requiredDebugItems.filter((itemName) => !visibleDebugItemSet.has(itemName))

      const centerNode = centerContainer ? root.querySelector(`[data-debug-name="${centerContainer}"]`) : null
      const compositionNode = compositionContainer ? root.querySelector(`[data-debug-name="${compositionContainer}"]`) : null
      const workspaceNode = workspaceContainer ? root.querySelector(`[data-debug-name="${workspaceContainer}"]`) : null
      const actionNode = actionContainer ? root.querySelector(`[data-debug-name="${actionContainer}"]`) : null

      let compositionIntegrity = null
      if (
        centerNode instanceof HTMLElement &&
        compositionNode instanceof HTMLElement &&
        workspaceNode instanceof HTMLElement &&
        actionNode instanceof HTMLElement &&
        isVisibleElement(centerNode) &&
        isVisibleElement(compositionNode) &&
        isVisibleElement(workspaceNode) &&
        isVisibleElement(actionNode)
      ) {
        const centerContentRect = getContentBoxRect(centerNode)
        const compositionRect = compositionNode.getBoundingClientRect()
        const workspaceRect = workspaceNode.getBoundingClientRect()
        const actionRect = actionNode.getBoundingClientRect()

        compositionIntegrity = {
          fillsCenter:
            Math.abs(compositionRect.left - centerContentRect.left) <= 2 &&
            Math.abs(compositionRect.right - centerContentRect.right) <= 2 &&
            Math.abs(compositionRect.top - centerContentRect.top) <= 2 &&
            Math.abs(compositionRect.bottom - centerContentRect.bottom) <= 2,
          workspaceActionAttachment: Math.abs(workspaceRect.bottom - actionRect.top) <= 2,
        }
      }

      return {
        totalElements,
        maxDomDepth,
        maxWrapperChain,
        maxNestedSurfaceChain,
        minTextInset: Number.isFinite(minTextInset) ? Math.round(minTextInset) : null,
        insetIssues,
        spacingValues: Array.from(spacingValues).sort((a, b) => a - b),
        invalidSpacingValues: Array.from(invalidSpacingValues).sort((a, b) => a - b),
        layerAncestryIssues,
        emptyContainers,
        passThroughContainers,
        containmentIssues,
        fixedSizeIssues,
        overlapIssues,
        primaryCoverage,
        primaryCenterOffset,
        missingDebugItems,
        compositionIntegrity,
        contractAuditAvailable: Boolean(contractMeta),
        orphanOverrideKeys,
        missingRenderedContractContainers,
        extraRenderedContainers,
      }
    },
    {
      primaryContainer,
      centerContainer,
      compositionContainer,
      workspaceContainer,
      actionContainer,
      requiredDebugItems,
      allowedSpacingValues: Array.from(ALLOWED_SPACING_VALUES),
      fixedSizeExceptions: Object.fromEntries(
        Object.entries(FIXED_SIZE_EXCEPTIONS).map(([containerName, properties]) => [containerName, Array.from(properties)]),
      ),
      zoomFactor,
    },
  )
}

async function navigateToScreen(page, baseUrl, routeHash) {
  const normalizedHash = routeHash.replace(/^#/, '')
  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.evaluate((hashValue) => {
    window.location.hash = hashValue
  }, normalizedHash)
  await page.waitForFunction(
    (expectedHash) => window.location.hash.replace(/^#/, '') === expectedHash,
    normalizedHash,
  )
  await page.waitForTimeout(300)
}

function buildGateRows({ viewportLabel, metrics, config, baselineMetrics = null }) {
  const rows = []

  const wrapperPass = metrics.maxWrapperChain <= 5
  rows.push({
    gate: `${viewportLabel} wrapper depth`,
    pass: wrapperPass,
    detail: `max wrapper chain ${metrics.maxWrapperChain}`,
  })

  const overlapPass = metrics.overlapIssues.length === 0
  rows.push({
    gate: `${viewportLabel} overlap check`,
    pass: overlapPass,
    detail: overlapPass
      ? 'no text/control overlaps detected'
      : `${metrics.overlapIssues.length} overlaps: ${metrics.overlapIssues
          .slice(0, 3)
          .map((issue) => `${issue.left} ↔ ${issue.right}`)
          .join('; ')}`,
  })

  const layerAncestryPass = metrics.layerAncestryIssues.length === 0
  rows.push({
    gate: `${viewportLabel} layer ancestry`,
    pass: layerAncestryPass,
    detail: layerAncestryPass
      ? 'all latter-layer containers sit inside lower-layer ancestors'
      : `${metrics.layerAncestryIssues.length} ancestry issues: ${metrics.layerAncestryIssues
          .slice(0, 3)
          .map((issue) => issue.container)
          .join(', ')}`,
  })

  const emptyContainerPass = metrics.emptyContainers.length === 0
  rows.push({
    gate: `${viewportLabel} empty containers`,
    pass: emptyContainerPass,
    detail: emptyContainerPass
      ? 'no empty containers'
      : `${metrics.emptyContainers.length} empty containers: ${metrics.emptyContainers
          .slice(0, 3)
          .map((issue) => issue.container)
          .join(', ')}`,
  })

  const passThroughPass = metrics.passThroughContainers.length === 0
  rows.push({
    gate: `${viewportLabel} pass-through containers`,
    pass: passThroughPass,
    detail: passThroughPass
      ? 'no dead pass-through containers'
      : `${metrics.passThroughContainers.length} pass-through containers: ${metrics.passThroughContainers
          .slice(0, 3)
          .map((issue) => `${issue.container} -> ${issue.child}`)
          .join(', ')}`,
  })

  const containmentPass = metrics.containmentIssues.length === 0
  rows.push({
    gate: `${viewportLabel} child containment`,
    pass: containmentPass,
    detail: containmentPass
      ? 'all direct children fit inside their owners'
      : `${metrics.containmentIssues.length} containment issues: ${metrics.containmentIssues
          .slice(0, 3)
          .map((issue) => `${issue.child} outside ${issue.container}`)
          .join(', ')}`,
  })

  const fixedSizePass = metrics.fixedSizeIssues.length === 0
  rows.push({
    gate: `${viewportLabel} fixed structural sizing`,
    pass: fixedSizePass,
    detail: fixedSizePass
      ? 'no unapproved fixed positive width/height values on structural containers'
      : `${metrics.fixedSizeIssues.length} fixed-size issues: ${metrics.fixedSizeIssues
          .slice(0, 3)
          .map((issue) => `${issue.container} ${issue.property}=${issue.value}`)
          .join(', ')}`,
  })

  const insetPass = (metrics.minTextInset ?? 16) >= 16 && metrics.insetIssues.length === 0
  rows.push({
    gate: `${viewportLabel} readable inset`,
    pass: insetPass,
    detail: insetPass
      ? `min inset ${metrics.minTextInset ?? 'n/a'}px`
      : `${metrics.insetIssues.length} inset issues; min ${metrics.minTextInset ?? 'n/a'}px`,
  })

  const paddingPass = metrics.invalidSpacingValues.length === 0 && metrics.spacingValues.length <= 5
  rows.push({
    gate: `${viewportLabel} padding discipline`,
    pass: paddingPass,
    detail: `values ${summarizeValues(metrics.spacingValues)}${metrics.invalidSpacingValues.length ? `; invalid ${summarizeValues(metrics.invalidSpacingValues)}` : ''}`,
  })

  if (viewportLabel === 'desktop-standard' && metrics.primaryCoverage !== null) {
    const [minPrimary, maxPrimary] = config.primaryWidthRange
    const primaryPass = metrics.primaryCoverage >= minPrimary && metrics.primaryCoverage <= maxPrimary
    rows.push({
      gate: `${viewportLabel} primary width`,
      pass: primaryPass,
      detail: `coverage ${(metrics.primaryCoverage * 100).toFixed(1)}%`,
    })
  }

  if (viewportLabel === 'desktop-standard') {
    const orphanOverridePass = metrics.contractAuditAvailable && metrics.orphanOverrideKeys.length === 0
    rows.push({
      gate: `${viewportLabel} orphan overrides`,
      pass: orphanOverridePass,
      detail: metrics.contractAuditAvailable
        ? orphanOverridePass
          ? 'all container override keys map to declared contract containers'
          : `unused overrides: ${metrics.orphanOverrideKeys.join(', ')}`
        : 'contract audit metadata unavailable',
    })

    const contractMatchPass =
      metrics.contractAuditAvailable &&
      metrics.missingRenderedContractContainers.length === 0 &&
      metrics.extraRenderedContainers.length === 0
    rows.push({
      gate: `${viewportLabel} contract/container mismatch`,
      pass: contractMatchPass,
      detail: metrics.contractAuditAvailable
        ? contractMatchPass
          ? 'rendered debug containers match the declared contract'
          : [
              metrics.missingRenderedContractContainers.length
                ? `missing ${metrics.missingRenderedContractContainers.join(', ')}`
                : null,
              metrics.extraRenderedContainers.length
                ? `extra ${metrics.extraRenderedContainers.join(', ')}`
                : null,
            ]
              .filter(Boolean)
              .join('; ')
        : 'contract audit metadata unavailable',
    })
  }

  const debugCoveragePass = metrics.missingDebugItems.length === 0
  rows.push({
    gate: `${viewportLabel} debug coverage`,
    pass: debugCoveragePass,
    detail: debugCoveragePass
      ? 'all required meaningful items are named in debug'
      : `missing ${metrics.missingDebugItems.slice(0, 5).join(', ')}`,
  })

  const compositionPass =
    metrics.compositionIntegrity?.fillsCenter === true && metrics.compositionIntegrity?.workspaceActionAttachment === true
  rows.push({
    gate: `${viewportLabel} full-height composition`,
    pass: compositionPass,
    detail: compositionPass
      ? 'Layer3 fills the center field and workspace/action stay attached'
      : 'Layer3 does not fully fill the center field or workspace/action are detached',
  })

  if (baselineMetrics && viewportLabel.startsWith('zoom ') && metrics.primaryCoverage !== null) {
    const orderedYieldPass =
      Math.abs(metrics.primaryCenterOffset ?? 0) <= 16 &&
      baselineMetrics.primaryCoverage !== null &&
      metrics.primaryCoverage >= baselineMetrics.primaryCoverage - 0.01
    rows.push({
      gate: `${viewportLabel} ordered gutter yield`,
      pass: orderedYieldPass,
      detail: `center offset ${metrics.primaryCenterOffset ?? 'n/a'}px; coverage ${metrics.primaryCoverage !== null ? `${(metrics.primaryCoverage * 100).toFixed(1)}%` : 'n/a'} vs ${baselineMetrics.primaryCoverage !== null ? `${(baselineMetrics.primaryCoverage * 100).toFixed(1)}%` : 'n/a'}`,
    })
  }

  return rows
}

async function main() {
  const screenId = process.argv[2] ?? process.env.SCREEN ?? 'segmentationPasteNext'
  const config = SCREEN_CONFIG[screenId]

  if (!config) {
    console.error(`Unknown screen id "${screenId}". Known screens: ${Object.keys(SCREEN_CONFIG).join(', ')}`)
    process.exit(1)
  }

  const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4177'
  const browser = await chromium.launch({ headless: true })
  const targetDir = path.join(process.cwd(), 'artifacts', 'qa')
  await fs.mkdir(targetDir, { recursive: true })
  const report = {
    screenId,
    baseUrl,
    route: config.route,
    generatedAt: new Date().toISOString(),
    status: 'pass',
    failingGateCount: 0,
    failingGates: [],
    stressLabel: 'viewport-stress',
    stressMode: 'css-zoom-approximation',
    viewportChecks: [],
    zoomChecks: [],
    viewportStressChecks: [],
  }

  let hasFailures = false
  let baselineMetrics = null

  try {
    printSection(`Screen QA gates for ${screenId}`)
    console.log(`Base URL: ${baseUrl}`)
    console.log(`Route: ${config.route}`)

    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } })
      await navigateToScreen(page, baseUrl, config.route)

      const metrics = await collectMetrics(page, config)
      if (metrics.error) {
        throw new Error(metrics.error)
      }

      if (viewport.label === 'desktop-standard') {
        baselineMetrics = metrics
      }

      const rows = buildGateRows({ viewportLabel: viewport.label, metrics, config })
      const screenshotPath = `/artifacts/qa/${screenId}-${viewport.label}.png`
      report.viewportChecks.push({ viewport, metrics, rows, screenshotPath })
      await page.screenshot({ path: path.join(targetDir, `${screenId}-${viewport.label}.png`) })

      console.log(`\nViewport ${viewport.label} (${viewport.width}x${viewport.height})`)
      rows.forEach((row) => {
        console.log(`- ${formatGateStatus(row.pass)} ${row.gate}: ${row.detail}`)
        if (!row.pass) {
          hasFailures = true
        }
      })

      await page.close()
    }

    for (const zoomState of zoomStates) {
      const page = await browser.newPage({
        viewport: {
          width: Math.max(360, Math.round(1440 / zoomState.factor)),
          height: Math.max(240, Math.round(900 / zoomState.factor)),
        },
      })
      await navigateToScreen(page, baseUrl, config.route)
      await page.waitForTimeout(300)

      const metrics = await collectMetrics(page, config)
      if (metrics.error) {
        throw new Error(metrics.error)
      }

      const rows = buildGateRows({
        viewportLabel: `viewport-stress ${zoomState.label}`,
        metrics,
        config,
        baselineMetrics,
      }).filter(
        (row) =>
          row.gate.includes('overlap') ||
          row.gate.includes('readable inset') ||
          row.gate.includes('ordered gutter yield') ||
          row.gate.includes('full-height composition'),
      )

      const screenshotPath = `/artifacts/qa/${screenId}-zoom-${zoomState.label}.png`
      report.zoomChecks.push({ zoomState, metrics, rows, screenshotPath })
      report.viewportStressChecks.push({ zoomState, metrics, rows, screenshotPath })
      await page.screenshot({ path: path.join(targetDir, `${screenId}-zoom-${zoomState.label}.png`) })

      console.log(`\nViewport stress ${zoomState.label} (${zoomState.factor}x, CSS zoom approximation)`)
      rows.forEach((row) => {
        console.log(`- ${formatGateStatus(row.pass)} ${row.gate}: ${row.detail}`)
        if (!row.pass) {
          hasFailures = true
        }
      })

      await page.close()
    }
  } finally {
    await browser.close()
  }

  const reportPath = path.join(targetDir, `${screenId}.json`)
  const allRows = [...report.viewportChecks.flatMap((check) => check.rows), ...report.zoomChecks.flatMap((check) => check.rows)]
  const failingRows = allRows.filter((row) => !row.pass)
  report.status = failingRows.length === 0 ? 'pass' : 'fail'
  report.failingGateCount = failingRows.length
  report.failingGates = failingRows.map((row) => row.gate)
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2))
  await writeRuntimePublicOutputs(report)

  printSection('Report')
  console.log(reportPath)

  if (hasFailures) {
    console.error('\nScreen QA gates failed.')
    process.exit(1)
  }

  console.log('\nScreen QA gates passed.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
