import { Bug, GripHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import IconActionButton from '../primitives/IconActionButton'
import { colors, elevation, motion, radius, spacing, typography } from '../tokens'

function clampPanelOffset(nextOffset) {
  return {
    x: Math.max(-900, Math.min(900, nextOffset.x)),
    y: Math.max(-520, Math.min(520, nextOffset.y)),
  }
}

function formatRect(value) {
  if (!value) {
    return 'n/a'
  }

  return `${Math.round(value)}px`
}

function sortLayerEntries(containersByLayer) {
  return Object.entries(containersByLayer).sort(([left], [right]) => {
    const leftOrder = Number.parseInt(String(left).replace(/\D/g, ''), 10)
    const rightOrder = Number.parseInt(String(right).replace(/\D/g, ''), 10)

    if (Number.isNaN(leftOrder) || Number.isNaN(rightOrder)) {
      return String(left).localeCompare(String(right))
    }

    return leftOrder - rightOrder
  })
}

export default function V2DebugInspector({
  contract,
  isOpen,
  activeContainerName,
  activeItemName,
  lockedContainerName,
  liveDetails,
  structureAudit,
  onOpen,
  onClose,
  onHoverContainer,
  onLeaveContainer,
  onSelectItem,
  onToggleLock,
}) {
  const [panelOffset, setPanelOffset] = useState({ x: 0, y: 0 })
  const dragStateRef = useRef(null)
  const dragCleanupRef = useRef(() => {})

  const containersByLayer = useMemo(() => {
    return contract.containers.reduce((groups, container) => {
      if (!groups[container.layer]) {
        groups[container.layer] = []
      }

      groups[container.layer].push(container)
      return groups
    }, {})
  }, [contract.containers])

  const sortedLayerEntries = useMemo(() => sortLayerEntries(containersByLayer), [containersByLayer])

  useEffect(() => {
    return () => {
      dragCleanupRef.current()
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      dragCleanupRef.current()
    }
  }, [isOpen])

  function handleDragStart(event) {
    dragCleanupRef.current()
    dragStateRef.current = {
      start: { x: event.clientX, y: event.clientY },
      origin: panelOffset,
    }

    function handlePointerMove(moveEvent) {
      if (!dragStateRef.current) {
        return
      }

      const nextOffset = clampPanelOffset({
        x: dragStateRef.current.origin.x + (moveEvent.clientX - dragStateRef.current.start.x),
        y: dragStateRef.current.origin.y + (moveEvent.clientY - dragStateRef.current.start.y),
      })

      setPanelOffset(nextOffset)
    }

    function handlePointerUp() {
      dragStateRef.current = null
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    dragCleanupRef.current = () => {
      dragStateRef.current = null
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }

  const launcherStyle = {
    position: 'fixed',
    right: '18px',
    bottom: '18px',
    zIndex: 99998,
    minHeight: '42px',
    padding: `0 ${spacing[16]}`,
    border: `1px solid ${colors.accentMist}`,
    borderRadius: radius.pill,
    background: 'rgba(255, 255, 255, 0.96)',
    boxShadow: elevation.raised,
    backdropFilter: 'blur(14px)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[8],
    color: colors.accentStrong,
    cursor: 'pointer',
    transition: [
      `background-color ${motion.micro}`,
      `border-color ${motion.micro}`,
      `box-shadow ${motion.micro}`,
      `transform ${motion.micro}`,
    ].join(', '),
  }

  const shellStyle = {
    position: 'fixed',
    right: '18px',
    bottom: '18px',
    zIndex: 99998,
    width: 'min(360px, calc(100vw - 36px))',
    maxHeight: 'min(760px, calc(100vh - 36px))',
    border: `1px solid ${colors.lineSoft}`,
    borderRadius: radius[24],
    background: 'rgba(255, 255, 255, 0.96)',
    boxShadow: elevation.floating,
    backdropFilter: 'blur(18px)',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateRows: 'auto minmax(0, 1fr)',
    transform: `translate(${panelOffset.x}px, ${panelOffset.y}px)`,
  }

  const toolbarStyle = {
    padding: `${spacing[12]} ${spacing[16]}`,
    borderBottom: `1px solid ${colors.lineSoft}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[12],
  }

  const moveHandleStyle = {
    minHeight: '32px',
    padding: `0 ${spacing[12]}`,
    border: `1px solid ${colors.lineSoft}`,
    borderRadius: radius.pill,
    background: colors.surfaceSoft,
    color: colors.textSoft,
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[8],
    cursor: 'grab',
  }

  const bodyStyle = {
    minHeight: 0,
    overflowY: 'auto',
    padding: spacing[16],
    display: 'grid',
    gap: spacing[16],
  }

  const layerCardStyle = {
    border: `1px solid ${colors.lineSoft}`,
    borderRadius: radius[16],
    background: colors.surfaceSoft,
    padding: spacing[12],
    display: 'grid',
    gap: spacing[8],
  }

  const itemButtonBase = {
    width: '100%',
    border: `1px solid ${colors.lineSoft}`,
    borderRadius: radius[12],
    background: colors.surfacePrimary,
    padding: `${spacing[12]} ${spacing[12]}`,
    textAlign: 'left',
    transition: `background-color ${motion.micro}, border-color ${motion.micro}, box-shadow ${motion.micro}`,
    cursor: 'pointer',
  }

  if (!isOpen) {
    return (
      <button type="button" style={launcherStyle} onClick={onOpen}>
        <Bug size={16} strokeWidth={1.8} />
        <span style={{ ...typography.eyebrowLabel, margin: 0, color: colors.accentStrong }}>Open Debug</span>
      </button>
    )
  }

  return (
    <aside style={shellStyle}>
      <div style={toolbarStyle}>
        <div>
          <p style={{ ...typography.eyebrowLabel, margin: `0 0 ${spacing[4]}`, color: colors.accentBase }}>
            V2 Debug
          </p>
          <h2
            style={{
              margin: 0,
              fontFamily: typography.cardTitle.fontFamily,
              fontSize: '24px',
              lineHeight: 1.1,
              color: colors.textStrong,
            }}
          >
            {contract.screenName}
          </h2>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8] }}>
          <button type="button" style={moveHandleStyle} onPointerDown={handleDragStart}>
            <GripHorizontal size={14} strokeWidth={1.8} />
            <span style={{ ...typography.monoMeta, color: colors.textSoft }}>Move</span>
          </button>
          <IconActionButton size="md" label="Collapse debug panel" icon={<X strokeWidth={1.8} />} onClick={onClose} />
        </div>
      </div>

      <div style={bodyStyle}>
        {sortedLayerEntries.map(([layerName, containers]) => (
          <section key={layerName} style={layerCardStyle}>
            <p
              style={{
                ...typography.eyebrowLabel,
                margin: 0,
                color: colors.textSoft,
              }}
            >
              {layerName}
            </p>

            {containers.map((container) => {
              const isActive = activeContainerName === container.name
              const isLocked = lockedContainerName === container.name

              return (
                <button
                  key={container.name}
                  type="button"
                  style={{
                    ...itemButtonBase,
                    borderColor: isLocked || isActive ? colors.accentSoft : colors.lineSoft,
                    background: isLocked || isActive ? colors.accentWash : colors.surfacePrimary,
                    boxShadow: isLocked ? elevation.raised : 'none',
                  }}
                  onMouseEnter={() => onHoverContainer(container.name)}
                  onMouseLeave={onLeaveContainer}
                  onClick={() => onToggleLock(container.name)}
                >
                  <div
                    style={{
                      ...typography.monoMeta,
                      color: colors.accentStrong,
                      marginBottom: spacing[4],
                    }}
                  >
                    {container.name}
                  </div>
                  <div
                    style={{
                      ...typography.bodyText,
                      fontSize: '14px',
                      lineHeight: 1.5,
                      color: colors.textSoft,
                    }}
                  >
                    {container.layoutMode} • {container.display}
                  </div>
                </button>
              )
            })}
          </section>
        ))}

        <section style={layerCardStyle}>
          <p
            style={{
              ...typography.eyebrowLabel,
              margin: 0,
              color: colors.textSoft,
            }}
          >
            Live Details
          </p>

          {liveDetails ? (
            <div style={{ display: 'grid', gap: spacing[8] }}>
              <div style={{ ...typography.monoMeta, color: colors.accentStrong }}>{liveDetails.name}</div>
              {liveDetails.items?.length ? (
                <div style={{ ...typography.bodyText, fontSize: '14px', color: colors.textBody }}>
                  Items: {liveDetails.items.map((item) => item.name).join(', ')}
                </div>
              ) : null}
              <div style={{ ...typography.bodyText, fontSize: '14px', color: colors.textBody }}>
                Layer: {liveDetails.layer}
              </div>
              <div style={{ ...typography.bodyText, fontSize: '14px', color: colors.textBody }}>
                Parent: {liveDetails.parent || 'none'}
              </div>
              <div style={{ ...typography.bodyText, fontSize: '14px', color: colors.textBody }}>
                Rect: {formatRect(liveDetails.width)} × {formatRect(liveDetails.height)}
              </div>
              <div style={{ ...typography.bodyText, fontSize: '14px', color: colors.textBody }}>
                Padding: {liveDetails.padding}
              </div>
              <div style={{ ...typography.bodyText, fontSize: '14px', color: colors.textBody }}>
                Gap: {liveDetails.gap}
              </div>
              <div style={{ ...typography.bodyText, fontSize: '14px', color: colors.textBody }}>
                Overflow: {liveDetails.overflow}
              </div>
              {liveDetails.items?.length ? (
                <div style={{ display: 'grid', gap: spacing[6], marginTop: spacing[4] }}>
                  <div style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Named Items</div>
                  {liveDetails.items.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => onSelectItem(item.name)}
                      style={{
                        ...itemButtonBase,
                        padding: `${spacing[8]} ${spacing[12]}`,
                        display: 'grid',
                        gap: spacing[4],
                        borderColor: activeItemName === item.name ? colors.accentSoft : colors.lineSoft,
                        background: activeItemName === item.name ? colors.accentWash : colors.surfacePrimary,
                        boxShadow: activeItemName === item.name ? elevation.raised : 'none',
                      }}
                    >
                      <div style={{ ...typography.monoMeta, color: colors.accentStrong }}>{item.name}</div>
                      <div style={{ ...typography.bodyText, fontSize: '13px', color: colors.textSoft }}>
                        {item.tag} • {item.owner}
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
              {liveDetails.activeItem ? (
                <div style={{ display: 'grid', gap: spacing[6], marginTop: spacing[4] }}>
                  <div style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Selected Item</div>
                  <div
                    style={{
                      border: `1px solid ${colors.lineSoft}`,
                      borderRadius: radius[12],
                      background: colors.surfacePrimary,
                      padding: `${spacing[10]} ${spacing[12]}`,
                      display: 'grid',
                      gap: spacing[4],
                    }}
                  >
                    <div style={{ ...typography.monoMeta, color: colors.accentStrong }}>
                      {liveDetails.activeItem.name}
                    </div>
                    <div style={{ ...typography.bodyText, fontSize: '13px', color: colors.textBody }}>
                      Owner: {liveDetails.activeItem.owner}
                    </div>
                    <div style={{ ...typography.bodyText, fontSize: '13px', color: colors.textBody }}>
                      Rect: {formatRect(liveDetails.activeItem.width)} × {formatRect(liveDetails.activeItem.height)}
                    </div>
                    <div style={{ ...typography.bodyText, fontSize: '13px', color: colors.textBody }}>
                      Tag: {liveDetails.activeItem.tag}
                    </div>
                    {liveDetails.activeItem.text ? (
                      <div style={{ ...typography.bodyText, fontSize: '13px', color: colors.textSoft }}>
                        Text: {liveDetails.activeItem.text}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <p
              style={{
                ...typography.bodyText,
                margin: 0,
                fontSize: '14px',
                color: colors.textSoft,
              }}
            >
              Open the panel, then hover a container or lock one from the list to inspect live DOM values.
            </p>
          )}
        </section>

        <section style={layerCardStyle}>
          <p
            style={{
              ...typography.eyebrowLabel,
              margin: 0,
              color: colors.textSoft,
            }}
          >
            Structure Audit
          </p>

          {structureAudit ? (
            <div style={{ display: 'grid', gap: spacing[8] }}>
              <div style={{ ...typography.monoMeta, color: colors.accentStrong }}>{structureAudit.rootLabel}</div>
              <div style={{ ...typography.bodyText, fontSize: '14px', color: colors.textBody }}>
                Elements: {structureAudit.totalElements}
              </div>
              <div style={{ ...typography.bodyText, fontSize: '14px', color: colors.textBody }}>
                DOM depth: {structureAudit.maxDomDepth}
              </div>
              <div style={{ ...typography.bodyText, fontSize: '14px', color: colors.textBody }}>
                Wrapper chain: {structureAudit.maxWrapperChain}
              </div>
              <div style={{ ...typography.bodyText, fontSize: '14px', color: colors.textBody }}>
                Nested surfaces: {structureAudit.maxNestedSurfaceChain}
              </div>
              <div style={{ ...typography.bodyText, fontSize: '14px', color: colors.textBody }}>
                Min text inset: {structureAudit.minTextInset === null ? 'n/a' : `${structureAudit.minTextInset}px`}
              </div>

              {structureAudit.findings.length > 0 ? (
                <div style={{ display: 'grid', gap: spacing[6], marginTop: spacing[4] }}>
                  {structureAudit.findings.map((finding) => (
                    <div
                      key={finding}
                      style={{
                        ...typography.bodyText,
                        fontSize: '13px',
                        lineHeight: 1.45,
                        color: '#b45309',
                        padding: `${spacing[8]} ${spacing[10]}`,
                        borderRadius: radius[12],
                        border: '1px solid rgba(253, 230, 138, 0.96)',
                        background: 'rgba(255, 251, 235, 0.96)',
                      }}
                    >
                      {finding}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    ...typography.bodyText,
                    fontSize: '13px',
                    lineHeight: 1.45,
                    color: '#047857',
                    padding: `${spacing[8]} ${spacing[10]}`,
                    borderRadius: radius[12],
                    border: '1px solid rgba(167, 243, 208, 0.96)',
                    background: 'rgba(236, 253, 245, 0.96)',
                  }}
                >
                  No structural findings for the audited container.
                </div>
              )}

              {structureAudit.insetIssues.length > 0 ? (
                <div style={{ display: 'grid', gap: spacing[6], marginTop: spacing[4] }}>
                  {structureAudit.insetIssues.map((issue) => (
                    <div
                      key={`${issue.text}-${issue.surface}`}
                      style={{
                        ...typography.bodyText,
                        fontSize: '13px',
                        lineHeight: 1.45,
                        color: colors.textBody,
                        padding: `${spacing[8]} ${spacing[10]}`,
                        borderRadius: radius[12],
                        border: `1px solid ${colors.lineSoft}`,
                        background: colors.surfacePrimary,
                      }}
                    >
                      <strong>{issue.text}</strong> sits at {issue.inset}px inside <strong>{issue.surface}</strong>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <p
              style={{
                ...typography.bodyText,
                margin: 0,
                fontSize: '14px',
                color: colors.textSoft,
              }}
            >
              Hover or lock a container to audit wrapper complexity, nested surfaces, and readable inset issues.
            </p>
          )}
        </section>
      </div>
    </aside>
  )
}
