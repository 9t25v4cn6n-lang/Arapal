import { ChevronDown, ChevronRight, MessageSquare, Minimize2, Pin, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { colors, motion, radius, spacing, typography } from '../tokens'
import { SplitCTAPreview } from './controls'
import { FloatingSupportPreview } from './editorPanels'

function previewShell() {
  return {
    borderRadius: radius[16],
    border: `1px solid ${colors.lineSoft}`,
    background: 'rgba(248, 251, 255, 0.96)',
    padding: spacing[12],
  }
}

export function OutsideClickDismissPreview() {
  const [isOpen, setIsOpen] = useState(true)
  const panelRef = useRef(null)

  useEffect(() => {
    function handlePointerDown(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  return (
    <div style={{ ...previewShell(), position: 'relative', minHeight: 220 }}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          minHeight: 34,
          padding: '0 14px',
          borderRadius: radius.pill,
          border: `1px solid ${colors.lineSoft}`,
          background: '#fff',
          color: colors.textSoft,
        }}
      >
        Open overlay
      </button>
      {isOpen ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: spacing[16] }}>
          <div
            ref={panelRef}
            style={{
              width: 250,
              borderRadius: radius[16],
              border: `1px solid rgba(191, 219, 254, 0.96)`,
              background: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0 18px 38px rgba(15, 23, 42, 0.14)',
              padding: spacing[14],
              display: 'grid',
              gap: spacing[10],
            }}
          >
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Overlay</p>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>Click anywhere outside this card and it should close.</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function EscapeDismissPreview() {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div style={{ ...previewShell(), minHeight: 180, display: 'grid', gap: spacing[12] }}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          justifySelf: 'flex-start',
          minHeight: 34,
          padding: '0 14px',
          borderRadius: radius.pill,
          border: `1px solid ${colors.lineSoft}`,
          background: '#fff',
          color: colors.textSoft,
        }}
      >
        Reopen panel
      </button>
      {isOpen ? (
        <div style={{ borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', padding: spacing[14] }}>
          <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>Press Escape to close this panel.</p>
        </div>
      ) : (
        <div style={{ borderRadius: radius[16], border: `1px dashed ${colors.lineSoft}`, background: 'rgba(255,255,255,0.7)', padding: spacing[14] }}>
          <p style={{ ...typography.bodyText, margin: 0, color: colors.textFaint }}>Closed via Escape.</p>
        </div>
      )}
    </div>
  )
}

export function SegmentTreeExpandPreview() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div style={{ ...previewShell(), display: 'grid', gap: spacing[8] }}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        style={{
          border: 'none',
          borderRadius: radius[12],
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: spacing[8],
          padding: `${spacing[8]} ${spacing[10]}`,
          color: colors.textStrong,
          textAlign: 'left',
        }}
      >
        {isOpen ? <ChevronDown size={16} strokeWidth={1.8} /> : <ChevronRight size={16} strokeWidth={1.8} />}
        <span style={{ ...typography.bodyText, fontWeight: 700 }}>Chapter 2: Prayer</span>
      </button>
      {isOpen ? (
        <div style={{ display: 'grid', gap: spacing[6], paddingLeft: spacing[24] }}>
          {['2.1 Times of Prayer', '2.2 Conditions', '2.3 Jumu’ah'].map((row) => (
            <div key={row} style={{ minHeight: 34, borderRadius: radius[12], background: 'rgba(255,255,255,0.92)', border: `1px solid ${colors.lineSoft}`, display: 'flex', alignItems: 'center', padding: `0 ${spacing[12]}` }}>
              <span style={{ ...typography.bodyText, fontSize: 14, color: colors.textBody }}>{row}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function SupportPanelCollapsePreview() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ ...previewShell(), display: 'flex', gap: spacing[12], alignItems: 'stretch' }}>
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        style={{
          width: 56,
          borderRadius: radius[16],
          border: `1px solid ${colors.lineSoft}`,
          background: '#fff',
          color: colors.textSoft,
        }}
      >
        {collapsed ? 'Open' : 'Fold'}
      </button>
      <div
        style={{
          flex: 1,
          minHeight: 132,
          borderRadius: radius[16],
          border: `1px solid ${colors.lineSoft}`,
          background: '#fff',
          overflow: 'hidden',
        }}
      >
        {collapsed ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ ...typography.eyebrowLabel, color: colors.textSoft }}>Collapsed support rail</span>
          </div>
        ) : (
          <div style={{ padding: spacing[14], display: 'grid', gap: spacing[10] }}>
            <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.textStrong }}>Support panels</p>
            <div style={{ minHeight: 34, borderRadius: radius[12], background: 'rgba(243, 232, 255, 0.56)' }} />
            <div style={{ minHeight: 34, borderRadius: radius[12], background: 'rgba(224, 231, 255, 0.56)' }} />
          </div>
        )}
      </div>
    </div>
  )
}

export function HoverPreviewPinDemo() {
  const [isPinned, setIsPinned] = useState(false)
  const [hovered, setHovered] = useState(false)
  const showPreview = hovered || isPinned

  return (
    <div style={{ ...previewShell(), display: 'flex', gap: spacing[12], alignItems: 'flex-start' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 72,
          minHeight: 160,
          borderRadius: radius[16],
          border: `1px solid ${colors.lineSoft}`,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          color: colors.textSoft,
          fontFamily: typography.bodyText.fontFamily,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Lexicography
      </div>
      {showPreview ? (
        <div style={{ width: 260, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', boxShadow: '0 16px 32px rgba(15,23,42,0.14)', overflow: 'hidden' }}>
          <div style={{ minHeight: 46, padding: `0 ${spacing[14]}`, display: 'flex', alignItems: 'center', gap: spacing[10], background: 'rgba(243, 232, 255, 0.9)', borderBottom: '1px solid rgba(216, 180, 254, 0.96)' }}>
            <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Preview</span>
            <button
              type="button"
              onClick={() => setIsPinned((value) => !value)}
              style={{
                marginLeft: 'auto',
                width: 28,
                height: 28,
                borderRadius: radius.pill,
                border: 'none',
                background: 'rgba(255,255,255,0.84)',
                color: '#7C3AED',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Pin size={14} strokeWidth={1.8} />
            </button>
          </div>
          <div style={{ padding: spacing[14], display: 'grid', gap: spacing[8] }}>
            <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, color: colors.textBody }}>Hover reveals the preview. Pin keeps it open.</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function FloatDockPreview() {
  const [mode, setMode] = useState('docked')

  const panel = (
    <div style={{ width: 220, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', boxShadow: mode === 'floating' ? '0 18px 36px rgba(15,23,42,0.16)' : 'none', overflow: 'hidden' }}>
      <div style={{ minHeight: 44, padding: `0 ${spacing[14]}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(224, 231, 255, 0.88)', borderBottom: '1px solid rgba(165, 180, 252, 0.96)' }}>
        <span style={{ ...typography.bodyText, fontSize: 14, fontWeight: 700, color: colors.textStrong }}>Discussion</span>
        <div style={{ display: 'inline-flex', gap: spacing[8] }}>
          <button type="button" onClick={() => setMode(mode === 'floating' ? 'docked' : 'floating')} style={{ width: 26, height: 26, border: 'none', borderRadius: radius.pill, background: 'rgba(255,255,255,0.84)', color: '#4F46E5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {mode === 'floating' ? <Minimize2 size={13} strokeWidth={1.8} /> : <MessageSquare size={13} strokeWidth={1.8} />}
          </button>
          <button type="button" style={{ width: 26, height: 26, border: 'none', borderRadius: radius.pill, background: 'rgba(255,255,255,0.84)', color: '#4F46E5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={13} strokeWidth={1.8} />
          </button>
        </div>
      </div>
      <div style={{ padding: spacing[14] }}>
        <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, color: colors.textBody }}>Discussion can stay docked or detach into a floating panel without losing context.</p>
      </div>
    </div>
  )

  return (
    <div style={{ ...previewShell(), minHeight: 220, position: 'relative' }}>
      <div style={{ minHeight: 180, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: 'rgba(255,255,255,0.7)', padding: spacing[12], display: 'flex', alignItems: 'flex-end', justifyContent: mode === 'floating' ? 'flex-start' : 'flex-end' }}>
        {mode === 'floating' ? (
          <div style={{ transform: 'translate(14px, -32px)', transition: `transform ${motion.panel}` }}>{panel}</div>
        ) : (
          panel
        )}
      </div>
    </div>
  )
}

export function FloatingDragResizePreview() {
  return (
    <div style={{ ...previewShell(), minHeight: 220, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: spacing[18] }}>
      <div style={{ width: 260, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', boxShadow: '0 18px 36px rgba(15,23,42,0.16)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ minHeight: 44, padding: `0 ${spacing[14]}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[10], background: 'rgba(243, 232, 255, 0.88)', borderBottom: '1px solid rgba(216, 180, 254, 0.96)', cursor: 'grab' }}>
          <span style={{ ...typography.bodyText, fontSize: 14, fontWeight: 700, color: colors.textStrong }}>Floating panel</span>
          <button type="button" style={{ width: 26, height: 26, border: 'none', borderRadius: radius.pill, background: 'rgba(255,255,255,0.84)', color: '#7C3AED', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pin size={13} strokeWidth={1.8} />
          </button>
        </div>
        <div style={{ padding: spacing[14], minHeight: 100 }}>
          <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, color: colors.textBody }}>Drag from the header. Resize from the lower-right affordance.</p>
        </div>
        <span style={{ position: 'absolute', right: 12, bottom: 12, width: 14, height: 1.5, background: 'rgba(148, 163, 184, 0.72)', transform: 'rotate(-45deg)', transformOrigin: 'right center' }} />
        <span style={{ position: 'absolute', right: 18, bottom: 18, width: 10, height: 1.5, background: 'rgba(148, 163, 184, 0.6)', transform: 'rotate(-45deg)', transformOrigin: 'right center' }} />
      </div>
    </div>
  )
}

export function EditorShortcutHintPreview() {
  return (
    <div style={previewShell()}>
      <div style={{ minHeight: 42, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12], padding: `0 ${spacing[16]}` }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8], color: 'rgba(15, 23, 42, 0.28)' }}>
          <span style={{ minWidth: 20, height: 20, border: '1px solid rgba(15,23,42,0.08)', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>⌘</span>
          <span style={{ minWidth: 20, height: 20, border: '1px solid rgba(15,23,42,0.08)', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>V</span>
          <span style={{ ...typography.bodyText, fontSize: 12, color: 'rgba(15, 23, 42, 0.3)' }}>to paste</span>
        </div>
        <span style={{ ...typography.monoMeta, color: colors.textSoft }}>Hint</span>
      </div>
    </div>
  )
}

export function SplitCTAInteractionPreview() {
  return <SplitCTAPreview showMenu />
}

export function HoverLiftPreview() {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={previewShell()}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          minHeight: 132,
          borderRadius: radius[24],
          border: `1px solid ${colors.lineSoft}`,
          background: '#fff',
          boxShadow: hovered ? '0 16px 34px rgba(15, 23, 42, 0.12)' : '0 8px 18px rgba(15, 23, 42, 0.06)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: `box-shadow ${motion.micro}, transform ${motion.micro}`,
          padding: spacing[16],
          display: 'grid',
          gap: spacing[8],
        }}
      >
        <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Primary surface</p>
        <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.textStrong }}>Hover lift should feel calm and precise.</p>
      </div>
    </div>
  )
}

export function MenuMotionPreview() {
  const [open, setOpen] = useState(false)

  return (
    <div style={previewShell()}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={{
          minHeight: 34,
          padding: '0 14px',
          borderRadius: radius.pill,
          border: `1px solid ${colors.lineSoft}`,
          background: '#fff',
          color: colors.textSoft,
        }}
      >
        Toggle menu
      </button>
      <div style={{ position: 'relative', minHeight: 160 }}>
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 0,
            width: 220,
            borderRadius: radius[16],
            border: `1px solid rgba(191, 219, 254, 0.96)`,
            background: 'rgba(255,255,255,0.98)',
            boxShadow: '0 18px 34px rgba(15,23,42,0.14)',
            padding: spacing[12],
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0)' : 'translateY(-8px)',
            pointerEvents: open ? 'auto' : 'none',
            transition: `opacity ${motion.panel}, transform ${motion.panel}`,
          }}
        >
          <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, color: colors.textBody }}>Menu and panel opening should clarify focus, not feel abrupt.</p>
        </div>
      </div>
    </div>
  )
}

export function ScreenIntroPreview() {
  const [entered, setEntered] = useState(false)

  return (
    <div style={previewShell()}>
      <button
        type="button"
        onClick={() => setEntered((value) => !value)}
        style={{
          minHeight: 34,
          padding: '0 14px',
          borderRadius: radius.pill,
          border: `1px solid ${colors.lineSoft}`,
          background: '#fff',
          color: colors.textSoft,
        }}
      >
        Replay intro
      </button>
      <div style={{ minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: 240,
            borderRadius: radius[24],
            border: `1px solid ${colors.lineSoft}`,
            background: '#fff',
            padding: spacing[18],
            opacity: entered ? 0.2 : 1,
            transform: entered ? 'translateY(18px) scale(0.98)' : 'translateY(0) scale(1)',
            filter: entered ? 'blur(4px)' : 'blur(0)',
            transition: `opacity ${motion.screen}, transform ${motion.screen}, filter ${motion.screen}`,
          }}
        >
          <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.textStrong }}>Stage intro</p>
        </div>
      </div>
    </div>
  )
}

export function SupportPreviewRevealMotion() {
  return <HoverPreviewPinDemo />
}

export function FocusedExpandMotionPreview() {
  return <FloatingSupportPreview />
}

export function ReducedMotionFallbackPreview() {
  return (
    <div style={previewShell()}>
      <div style={{ display: 'grid', gap: spacing[12] }}>
        <div style={{ minHeight: 46, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: 'rgba(255,255,255,0.98)', padding: `0 ${spacing[14]}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Motion</span>
          <span style={{ ...typography.eyebrowLabel, color: colors.textSoft }}>default</span>
        </div>
        <div style={{ minHeight: 46, borderRadius: radius[16], border: `1px dashed ${colors.lineSoft}`, background: 'rgba(248,250,252,0.92)', padding: `0 ${spacing[14]}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Reduced motion</span>
          <span style={{ ...typography.eyebrowLabel, color: colors.textSoft }}>fade / no sweep / no lift</span>
        </div>
      </div>
    </div>
  )
}
