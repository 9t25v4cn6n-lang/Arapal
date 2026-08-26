import { useEffect, useMemo, useRef, useState } from 'react'
import useIsMobileViewport, { useIsTabletViewport } from '../primitives/useIsMobileViewport'
import { colors, elevation } from '../tokens'
import { resolveBodyBackdropPreset } from './bodyBackdropPresets'

function readDebugInitiallyEnabled() {
  if (typeof window === 'undefined') {
    return false
  }

  return new URLSearchParams(window.location.search).get('v2Debug') === '1'
}

function collectLiveDetails(rootNode, containerMap, containerName, selectedItem) {
  if (!rootNode || !containerName) {
    return null
  }

  const node = rootNode.querySelector(`[data-debug-name="${containerName}"]`)
  if (!node) {
    return null
  }

  const container = containerMap.get(containerName)
  const rect = node.getBoundingClientRect()
  const computed = window.getComputedStyle(node)
  const itemNodes = Array.from(node.querySelectorAll('[data-debug-item]')).filter((itemNode) => itemNode instanceof HTMLElement)
  const items = itemNodes.map((itemNode) => {
    const itemRect = itemNode.getBoundingClientRect()
    const owner = itemNode.closest('[data-debug-name]')?.dataset.debugName ?? containerName
    const rawText = itemNode.innerText?.trim() || itemNode.textContent?.trim() || ''

    return {
      name: itemNode.dataset.debugItem,
      width: itemRect.width,
      height: itemRect.height,
      owner,
      tag: itemNode.tagName.toLowerCase(),
      text: rawText ? rawText.slice(0, 80) : null,
    }
  })
  const activeItem =
    selectedItem && selectedItem.containerName === containerName
      ? items.find((item) => item.name === selectedItem.itemName) ?? null
      : null

  return {
    name: containerName,
    layer: container?.layer ?? 'unknown',
    parent: container?.parent ?? null,
    width: rect.width,
    height: rect.height,
    padding: computed.padding,
    gap: computed.gap,
    overflow: `${computed.overflowX} / ${computed.overflowY}`,
    items,
    activeItem,
  }
}

function composeEventHandlers(...handlers) {
  return (event) => {
    handlers.forEach((handler) => {
      if (typeof handler === 'function') {
        handler(event)
      }
    })
  }
}

function buildRuntimeContractMeta(contract, containerOverrides, rootNode) {
  const contractContainerNames = contract.containers.map((container) => container.name)
  const contractContainerNameSet = new Set(contractContainerNames)
  const overrideKeys = Object.keys(containerOverrides ?? {})
  const unusedOverrideKeys = overrideKeys.filter((containerName) => !contractContainerNameSet.has(containerName))
  const renderedContainerNames = rootNode
    ? [
        rootNode.dataset.debugName,
        ...Array.from(rootNode.querySelectorAll('[data-debug-name]'))
          .map((node) => node.dataset.debugName)
          .filter(Boolean),
      ].filter(Boolean)
    : []
  const renderedContainerNameSet = new Set(renderedContainerNames)

  return {
    screenId: contract.screenId ?? null,
    screenName: contract.screenName ?? null,
    contractContainerNames,
    overrideKeys,
    unusedOverrideKeys,
    missingRenderedContainers: contractContainerNames.filter((containerName) => !renderedContainerNameSet.has(containerName)),
    extraRenderedContainers: renderedContainerNames.filter((containerName) => !contractContainerNameSet.has(containerName)),
  }
}

/**
 * @param isMobile  Merges the container's `mobile` block last, so a contract can
 *   restate any property at the mobile breakpoint.
 *
 * Contracts write their columns as INLINE styles, which is why this exists: no
 * stylesheet or media query can reach them, so a screen whose layout comes from
 * a contract had no way to respond to width at all. Study could collapse because
 * it computes its columns in a function that could take width as an argument;
 * Research could not, because its columns come from a static contract object.
 * A declarative `mobile` block keeps the contract the single description of the
 * layout rather than splitting it across a contract and a stylesheet that cannot
 * win.
 */
function getContainerStyle(container, override, isActive, isMobile, isTablet) {
  const style = {
    boxSizing: 'border-box',
    minWidth: 0,
    minHeight: 0,
    display: container.display,
    alignItems: container.alignItems,
    justifyContent: container.justifyContent,
    padding: container.padding,
    gap: container.gap,
    overflow: container.overflow,
    textAlign: container.textAlign,
    ...container.style,
  }

  if (container.layoutMode === 'grid') {
    if (container.gridTemplateColumns) style.gridTemplateColumns = container.gridTemplateColumns
    if (container.gridTemplateRows) style.gridTemplateRows = container.gridTemplateRows
  }

  if (container.layoutMode === 'flex') {
    style.flexDirection = container.flexDirection ?? 'row'
    if (container.flexWrap) style.flexWrap = container.flexWrap
  }

  Object.assign(style, override?.style)

  // Tablet first, then mobile last — so at ≤560 the mobile frame still wins over
  // any tablet restatement, and the tablet band (561–1024) gets its own layout
  // instead of inheriting a desktop rail that crushes the detail (S3-003).
  if (isTablet && container.tablet) {
    Object.assign(style, container.tablet)
  }
  if (isMobile && container.mobile) {
    Object.assign(style, container.mobile)
  }

  if (isActive) {
    style.outline = `2px solid ${colors.accentBase}`
    style.outlineOffset = '-2px'
    style.boxShadow = style.boxShadow ? `${style.boxShadow}, ${elevation.raised}` : elevation.raised
  }

  return style
}

export default function ScreenContractRenderer({ contract, slotContent = {}, containerOverrides = {}, debugTools = null }) {
  const isMobile = useIsMobileViewport()
  const isTablet = useIsTabletViewport()
  const rootRef = useRef(null)
  const [isDebugOpen, setIsDebugOpen] = useState(readDebugInitiallyEnabled)
  const [hoveredContainerName, setHoveredContainerName] = useState(null)
  const [lockedContainerName, setLockedContainerName] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const InspectorComponent = debugTools?.InspectorComponent ?? null
  const collectStructureAudit = debugTools?.collectStructureAudit ?? null
  const debugEnabled = Boolean(InspectorComponent) && isDebugOpen

  const containerMap = useMemo(
    () => new Map(contract.containers.map((container) => [container.name, container])),
    [contract.containers],
  )
  const childMap = useMemo(() => {
    const nextMap = new Map()

    contract.containers.forEach((container) => {
      if (!container.parent) {
        return
      }

      if (!nextMap.has(container.parent)) {
        nextMap.set(container.parent, [])
      }

      nextMap.get(container.parent).push(container.name)
    })

    return nextMap
  }, [contract.containers])

  const activeContainerName = lockedContainerName || hoveredContainerName
  const liveDetails = debugEnabled
    ? collectLiveDetails(rootRef.current, containerMap, activeContainerName, selectedItem)
    : null
  const structureAudit =
    debugEnabled && typeof collectStructureAudit === 'function'
      ? collectStructureAudit(rootRef.current, activeContainerName || contract.rootContainerName)
      : null
  const BodyBackdropPreset = resolveBodyBackdropPreset(contract.bodyBackdrop?.preset)

  useEffect(() => {
    if (!selectedItem) {
      return
    }

    if (!activeContainerName || selectedItem.containerName !== activeContainerName) {
      setSelectedItem(null)
    }
  }, [activeContainerName, selectedItem])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const runtimeMeta = buildRuntimeContractMeta(contract, containerOverrides, rootRef.current)
    window.__ARAPAL_V2_CONTRACT_META__ = runtimeMeta

    if (rootRef.current instanceof HTMLElement) {
      rootRef.current.dataset.debugScreenId = contract.screenId ?? ''
      rootRef.current.dataset.debugContractContainerCount = String(runtimeMeta.contractContainerNames.length)
      rootRef.current.dataset.debugUnusedOverrides = runtimeMeta.unusedOverrideKeys.join(',')
    }

    return () => {
      if (window.__ARAPAL_V2_CONTRACT_META__?.screenId === contract.screenId) {
        delete window.__ARAPAL_V2_CONTRACT_META__
      }
    }
  }, [contract, containerOverrides])

  const renderContainer = (containerName) => {
    const container = containerMap.get(containerName)
    if (!container) {
      return null
    }

    const TagName = container.as || 'div'
    const override = containerOverrides[container.name] ?? null
    // The backdrop is resolved by ROLE, not by one hard-coded container name.
    // It used to test `name === 'Layer2_Body_Backdrop'`, which is a container
    // that only exists in contracts using the default body split — so the two
    // screens that declare their own backdrop lane, Project Home and Exams,
    // rendered an empty div and no atmosphere at all. That is a large part of
    // why the product's front door reads as unfinished: every other screen has
    // the diagonal system and the watermark behind it and those two had a flat
    // gradient.
    const isBackdrop =
      container.semanticRole === 'body-backdrop' || container.name === 'Layer2_Body_Backdrop'
    const slotNode = isBackdrop ? <BodyBackdropPreset /> : slotContent[container.name] ?? null
    const childNames = childMap.get(container.name) ?? []
    const isActive = debugEnabled && activeContainerName === container.name
    const handleMouseEnter = composeEventHandlers(
      override?.onMouseEnter,
      debugEnabled ? () => setHoveredContainerName(container.name) : undefined,
    )
    const handleMouseLeave = composeEventHandlers(
      override?.onMouseLeave,
      debugEnabled && !lockedContainerName ? () => setHoveredContainerName(null) : undefined,
    )
    const shouldAttachMouseEnter = Boolean(override?.onMouseEnter || debugEnabled)
    const shouldAttachMouseLeave = Boolean(override?.onMouseLeave || debugEnabled)

    return (
      <TagName
        key={container.name}
        ref={container.name === contract.rootContainerName ? rootRef : undefined}
        data-debug-layer={container.layer}
        data-debug-name={container.name}
        data-debug-allow-empty={container.allowEmpty ? 'true' : undefined}
        data-debug-semantic-role={container.semanticRole ?? undefined}
        style={getContainerStyle(container, override, isActive, isMobile, isTablet)}
        onMouseEnter={shouldAttachMouseEnter ? handleMouseEnter : undefined}
        onMouseLeave={shouldAttachMouseLeave ? handleMouseLeave : undefined}
        onClick={override?.onClick}
      >
        {slotNode}
        {childNames.map(renderContainer)}
      </TagName>
    )
  }

  return (
    <>
      {renderContainer(contract.rootContainerName)}
      {InspectorComponent ? (
        <InspectorComponent
          contract={contract}
          isOpen={isDebugOpen}
          activeContainerName={activeContainerName}
          lockedContainerName={lockedContainerName}
          liveDetails={liveDetails}
          structureAudit={structureAudit}
          onOpen={() => setIsDebugOpen(true)}
          onClose={() => {
            setIsDebugOpen(false)
            setHoveredContainerName(null)
            setLockedContainerName(null)
            setSelectedItem(null)
          }}
          onHoverContainer={setHoveredContainerName}
          onLeaveContainer={() => {
            if (!lockedContainerName) {
              setHoveredContainerName(null)
            }
          }}
          onToggleLock={(containerName) => {
            setLockedContainerName((current) => (current === containerName ? null : containerName))
            setSelectedItem(null)
          }}
          activeItemName={selectedItem?.itemName ?? null}
          onSelectItem={(itemName) => {
            if (!activeContainerName || !itemName) {
              return
            }

            setSelectedItem((current) => {
              if (current?.containerName === activeContainerName && current.itemName === itemName) {
                return null
              }

              return {
                containerName: activeContainerName,
                itemName,
              }
            })
          }}
        />
      ) : null}
    </>
  )
}
