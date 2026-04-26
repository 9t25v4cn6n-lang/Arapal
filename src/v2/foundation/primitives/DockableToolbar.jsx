import { useState } from 'react'
import { GripVertical, Pin, PinOff } from 'lucide-react'
import { colors, radius, spacing, typography } from '../tokens'

const dockableToolbarChrome = {
  surface:
    'linear-gradient(180deg, rgba(239, 246, 255, 0.96) 0%, rgba(255, 255, 255, 0.94) 100%)',
  floatingSurface:
    'linear-gradient(180deg, rgba(239, 246, 255, 0.98) 0%, rgba(255, 255, 255, 0.96) 100%)',
  border: 'rgba(147, 197, 253, 0.72)',
  divider: 'rgba(191, 219, 254, 0.72)',
  shadow: '0 14px 34px rgba(37, 99, 235, 0.12), 0 4px 16px rgba(15, 23, 42, 0.06)',
}

const dockableToolbarMetrics = {
  floatingMinWidth: 560,
  floatingVerticalWidth: 64,
  viewportInsetWidth: 48,
}

export function DockableToolbarActionGroup({ children, orientation = 'horizontal' }) {
  const isVertical = orientation === 'vertical'

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: 'center',
        gap: spacing[4],
        flexWrap: 'nowrap',
      }}
    >
      {children}
    </div>
  )
}

export function DockableToolbarDivider({ orientation = 'horizontal' }) {
  const isVertical = orientation === 'vertical'

  return (
    <span
      aria-hidden="true"
      style={isVertical
        ? { width: spacing[24], borderTop: `1px solid ${dockableToolbarChrome.divider}` }
        : { height: spacing[24], borderLeft: `1px solid ${dockableToolbarChrome.divider}` }}
    />
  )
}

export function DockableToolbarIconButton({
  label,
  icon,
  onClick,
  disabled = false,
  active = false,
  tone = 'default',
  debugItem,
}) {
  const danger = tone === 'danger'
  const activeDanger = active && danger

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      data-debug-item={debugItem}
      data-active={active ? 'true' : 'false'}
      style={{
        width: spacing[40],
        height: spacing[40],
        borderRadius: radius.pill,
        border: `1px solid ${
          activeDanger
            ? 'rgba(251, 146, 60, 0.72)'
            : active
              ? colors.accentBase
            : danger
              ? 'rgba(251, 146, 60, 0.56)'
              : dockableToolbarChrome.divider
        }`,
        background: activeDanger
          ? 'rgba(255, 247, 237, 0.98)'
          : active
            ? colors.accentBase
          : danger
            ? 'rgba(255, 247, 237, 0.92)'
            : colors.surfacePrimary,
        color: activeDanger
          ? colors.review
          : active
            ? colors.surfacePrimary
          : danger
            ? colors.review
            : colors.textBody,
        boxShadow: activeDanger
          ? '0 8px 18px rgba(217, 119, 6, 0.12)'
          : active
            ? '0 8px 18px rgba(37, 99, 235, 0.18)'
            : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.42 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
    >
      {icon}
    </button>
  )
}

export function DockableToolbarMenu({
  label,
  icon,
  open,
  disabled = false,
  tone = 'default',
  placement = 'bottom',
  onToggle,
  children,
  debugItem,
}) {
  const menuPlacementStyle = placement === 'left'
    ? {
        top: 0,
        right: `calc(100% + ${spacing[8]})`,
      }
    : {
        top: `calc(100% + ${spacing[8]})`,
        right: 0,
      }

  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <DockableToolbarIconButton
        label={label}
        icon={icon}
        disabled={disabled}
        active={open}
        tone={tone}
        onClick={onToggle}
        debugItem={debugItem}
      />
      {open ? (
        <span
          data-debug-item={debugItem ? `${debugItem}_menu` : undefined}
          style={{
            position: 'absolute',
            ...menuPlacementStyle,
            zIndex: 45,
            minWidth: '220px',
            padding: spacing[8],
            borderRadius: radius[16],
            border: `1px solid ${dangerBorder(tone)}`,
            background: colors.surfacePrimary,
            boxShadow: dockableToolbarChrome.shadow,
            display: 'grid',
            gap: spacing[4],
          }}
        >
          {children}
        </span>
      ) : null}
    </span>
  )
}

function dangerBorder(tone) {
  return tone === 'danger' ? 'rgba(251, 146, 60, 0.42)' : dockableToolbarChrome.divider
}

export function DockableToolbarMenuItem({ children, onClick, disabled = false, tone = 'default', debugItem }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      data-debug-item={debugItem}
      style={{
        width: '100%',
        minHeight: spacing[40],
        border: 'none',
        borderRadius: radius[12],
        background: 'transparent',
        color: tone === 'danger' ? colors.review : colors.textBody,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        padding: `0 ${spacing[12]}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: spacing[8],
        textAlign: 'left',
        fontFamily: typography.bodyText.fontFamily,
        fontSize: typography.supportSubtext.fontSize,
        fontWeight: typography.ctaLabel.fontWeight,
        lineHeight: typography.supportSubtext.lineHeight,
      }}
    >
      {children}
    </button>
  )
}

export default function DockableToolbar({
  title,
  subtitle,
  leading = null,
  orientation = 'horizontal',
  isFloating = false,
  onToggleFloating,
  children,
  debugItem,
  style = {},
  floatingStyle = {},
}) {
  const [floatingPosition, setFloatingPosition] = useState(null)
  const [dragStart, setDragStart] = useState(null)
  const isVertical = orientation === 'vertical'
  const toolbarLabel = subtitle ? `${title}: ${subtitle}` : title

  const handlePointerDown = (event) => {
    if (!isFloating) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const nextWidth = isVertical
      ? rect.width
      : Math.max(rect.width, dockableToolbarMetrics.floatingMinWidth)
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setDragStart({
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    })
    setFloatingPosition({
      left: rect.left,
      top: rect.top,
      width: nextWidth,
      height: rect.height,
    })
  }

  const handlePointerMove = (event) => {
    if (!isFloating || !dragStart) {
      return
    }

    setFloatingPosition((current) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const width = current?.width ?? rect.width
      const height = current?.height ?? rect.height
      const maxLeft = Math.max(24, window.innerWidth - width - 24)
      const maxTop = Math.max(64, window.innerHeight - height - 24)

      return {
        left: Math.min(maxLeft, Math.max(24, event.clientX - dragStart.offsetX)),
        top: Math.min(maxTop, Math.max(64, event.clientY - dragStart.offsetY)),
        width,
        height,
      }
    })
  }

  const handlePointerUp = (event) => {
    if (dragStart?.pointerId === event.pointerId) {
      event.currentTarget.releasePointerCapture?.(event.pointerId)
      setDragStart(null)
    }
  }

  return (
    <div
      role="toolbar"
      aria-label={toolbarLabel}
      data-debug-item={debugItem}
      style={{
        minHeight: isVertical ? 'auto' : '48px',
        width: isVertical ? dockableToolbarMetrics.floatingVerticalWidth : isFloating ? 'auto' : 'fit-content',
        minWidth: isVertical ? dockableToolbarMetrics.floatingVerticalWidth : undefined,
        maxWidth: isVertical ? dockableToolbarMetrics.floatingVerticalWidth : '100%',
        border: `1px solid ${dockableToolbarChrome.border}`,
        borderRadius: isVertical ? radius[32] : radius.pill,
        background: isFloating ? dockableToolbarChrome.floatingSurface : dockableToolbarChrome.surface,
        boxShadow: dockableToolbarChrome.shadow,
        padding: isVertical ? `${spacing[12]} ${spacing[8]}` : `${spacing[8]} ${spacing[12]}`,
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: isVertical ? 'flex-start' : 'flex-start',
        gap: spacing[8],
        flexWrap: isVertical || isFloating ? 'nowrap' : 'wrap',
        ...(isFloating
          ? {
              position: 'fixed',
              top: floatingPosition?.top ?? (isVertical ? `calc(${spacing[64]} + ${spacing[32]})` : spacing[64]),
              left: floatingPosition?.left ?? (isVertical ? 'auto' : 'clamp(88px, 8vw, 160px)'),
              right: floatingPosition ? 'auto' : isVertical ? spacing[24] : 'clamp(24px, 8vw, 160px)',
              width: floatingPosition?.width ?? (isVertical ? dockableToolbarMetrics.floatingVerticalWidth : 'max-content'),
              minWidth: isVertical ? dockableToolbarMetrics.floatingVerticalWidth : dockableToolbarMetrics.floatingMinWidth,
              maxWidth: isVertical
                ? dockableToolbarMetrics.floatingVerticalWidth
                : `calc(100vw - ${dockableToolbarMetrics.viewportInsetWidth}px)`,
              zIndex: 40,
              ...floatingStyle,
            }
          : null),
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          alignItems: 'center',
          gap: isVertical ? spacing[8] : spacing[12],
          minWidth: 0,
        }}
      >
        {leading}
        {isFloating && !isVertical ? (
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: colors.textFaint,
            }}
          >
            <GripVertical size={16} strokeWidth={1.8} />
          </span>
        ) : null}
        <div
          data-debug-item={debugItem ? `${debugItem}_drag_handle` : undefined}
          aria-label={isFloating ? 'Drag toolbar' : toolbarLabel}
          title={isFloating ? 'Drag toolbar' : toolbarLabel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            display: isVertical ? 'inline-flex' : 'grid',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[4],
            minWidth: 0,
            cursor: isFloating ? (dragStart ? 'grabbing' : 'grab') : 'default',
            touchAction: isFloating ? 'none' : 'auto',
            color: colors.textFaint,
          }}
        >
          {isVertical ? (
            <GripVertical size={16} strokeWidth={1.8} />
          ) : (
            <>
              <span
                style={{
                  margin: 0,
                  color: colors.textSoft,
                  fontFamily: typography.eyebrowLabel.fontFamily,
                  fontSize: '9.5px',
                  fontWeight: 650,
                  lineHeight: 1.2,
                  letterSpacing: '0.1em',
                  textTransform: typography.eyebrowLabel.textTransform,
                }}
              >
                {title}
              </span>
              {subtitle ? (
                <span
                  style={{
                    margin: 0,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: colors.textBody,
                    fontFamily: typography.bodyText.fontFamily,
                    fontSize: '12px',
                    fontWeight: typography.ctaLabel.fontWeight,
                    lineHeight: typography.bodyText.lineHeight,
                  }}
                >
                  {subtitle}
                </span>
              ) : null}
            </>
          )}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          alignItems: 'center',
          gap: spacing[8],
          flexWrap: isVertical || isFloating ? 'nowrap' : 'wrap',
        }}
      >
        {children}
        {onToggleFloating ? (
          <>
            <DockableToolbarDivider orientation={orientation} />
            <DockableToolbarIconButton
              label={isFloating ? 'Dock toolbar' : 'Float toolbar'}
              icon={isFloating ? <Pin size={15} strokeWidth={1.9} /> : <PinOff size={15} strokeWidth={1.9} />}
              onClick={() => onToggleFloating(!isFloating)}
              debugItem={debugItem ? `${debugItem}_float_button` : undefined}
            />
          </>
        ) : null}
      </div>
    </div>
  )
}
