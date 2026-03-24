import { useMemo, useRef, useState } from 'react'
import V2DebugInspector from '../debug/V2DebugInspector'
import { colors, elevation } from '../tokens'
import { resolveBodyBackdropPreset } from './bodyBackdropPresets'

function readDebugInitiallyEnabled() {
  if (typeof window === 'undefined') {
    return false
  }

  return new URLSearchParams(window.location.search).get('v2Debug') === '1'
}

function collectLiveDetails(rootNode, containerMap, containerName) {
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

  return {
    name: containerName,
    layer: container?.layer ?? 'unknown',
    parent: container?.parent ?? null,
    width: rect.width,
    height: rect.height,
    padding: computed.padding,
    gap: computed.gap,
    overflow: `${computed.overflowX} / ${computed.overflowY}`,
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

function getContainerStyle(container, override, isActive) {
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

  if (isActive) {
    style.outline = `2px solid ${colors.accentBase}`
    style.outlineOffset = '-2px'
    style.boxShadow = style.boxShadow ? `${style.boxShadow}, ${elevation.raised}` : elevation.raised
  }

  return style
}

export default function ScreenContractRenderer({ contract, slotContent = {}, containerOverrides = {} }) {
  const rootRef = useRef(null)
  const [isDebugOpen, setIsDebugOpen] = useState(readDebugInitiallyEnabled)
  const [hoveredContainerName, setHoveredContainerName] = useState(null)
  const [lockedContainerName, setLockedContainerName] = useState(null)
  const debugEnabled = isDebugOpen

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
  const liveDetails = debugEnabled ? collectLiveDetails(rootRef.current, containerMap, activeContainerName) : null
  const BodyBackdropPreset = resolveBodyBackdropPreset(contract.bodyBackdrop?.preset)

  const renderContainer = (containerName) => {
    const container = containerMap.get(containerName)
    if (!container) {
      return null
    }

    const TagName = container.as || 'div'
    const override = containerOverrides[container.name] ?? null
    const slotNode =
      container.name === 'Layer2_Body_Backdrop'
        ? <BodyBackdropPreset />
        : slotContent[container.name] ?? null
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
        style={getContainerStyle(container, override, isActive)}
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
      <V2DebugInspector
        contract={contract}
        isOpen={isDebugOpen}
        activeContainerName={activeContainerName}
        lockedContainerName={lockedContainerName}
        liveDetails={liveDetails}
        onOpen={() => setIsDebugOpen(true)}
        onClose={() => {
          setIsDebugOpen(false)
          setHoveredContainerName(null)
          setLockedContainerName(null)
        }}
        onHoverContainer={setHoveredContainerName}
        onLeaveContainer={() => {
          if (!lockedContainerName) {
            setHoveredContainerName(null)
          }
        }}
        onToggleLock={(containerName) => {
          setLockedContainerName((current) => (current === containerName ? null : containerName))
        }}
      />
    </>
  )
}
