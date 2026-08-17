import { ChevronDown, ChevronRight, MessageSquare, Minimize2, Pin, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import IconActionButton from '../primitives/IconActionButton'
import PrimaryCTA from '../primitives/PrimaryCTA'
import { colors, motion, radius, spacing, surfacePadding, typography } from '../tokens'
import { SplitCTAPreview } from './controls'
import { FloatingSupportPreview } from './editorPanels'

function previewShell() {
  return {
    borderRadius: radius[16],
    border: `1px solid ${colors.lineSoft}`,
    background: 'rgba(248, 251, 255, 0.96)',
    padding: surfacePadding.standard,
  }
}

function useAutoToggle(initialValue = false, intervalMs = 1800) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setValue((current) => !current)
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [intervalMs])

  return [value, setValue]
}

function stateLabelStyle() {
  return {
    ...typography.eyebrowLabel,
    color: colors.textSoft,
    textAlign: 'center',
  }
}

function demoStateColumn(label, child) {
  return (
    <div style={{ display: 'grid', gap: spacing[8], alignItems: 'start' }}>
      <span style={stateLabelStyle()}>{label}</span>
      {child}
    </div>
  )
}

export function OutsideClickDismissPreview() {
  const openState = (
    <div style={{ position: 'relative', minHeight: 180, borderRadius: radius[16], border: `1px dashed ${colors.lineSoft}`, background: 'rgba(255,255,255,0.42)' }}>
      <div style={{ position: 'absolute', right: spacing[16], bottom: spacing[16], width: 220, borderRadius: radius[16], border: `1px solid rgba(191, 219, 254, 0.96)`, background: 'rgba(255, 255, 255, 0.98)', boxShadow: '0 18px 38px rgba(15, 23, 42, 0.14)', padding: spacing[16], display: 'grid', gap: spacing[12] }}>
        <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Overlay</p>
        <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>Open state anchored above the stage.</p>
      </div>
    </div>
  )

  const dismissedState = (
    <div style={{ minHeight: 180, borderRadius: radius[16], border: `1px dashed ${colors.lineSoft}`, background: 'rgba(255,255,255,0.42)', padding: spacing[16], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ ...typography.bodyText, margin: 0, color: colors.textFaint }}>Closed after clicking the stage.</p>
    </div>
  )

  return (
    <div style={previewShell()}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: spacing[16] }}>
        {demoStateColumn('Open', openState)}
        {demoStateColumn('After outside click', dismissedState)}
      </div>
    </div>
  )
}

export function EscapeDismissPreview() {
  const openState = (
    <div style={{ borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', padding: spacing[16], minHeight: 104, display: 'grid', alignContent: 'center' }}>
      <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>Press Escape to close this panel.</p>
    </div>
  )

  const dismissedState = (
    <div style={{ borderRadius: radius[16], border: `1px dashed ${colors.lineSoft}`, background: 'rgba(255,255,255,0.7)', padding: spacing[16], minHeight: 104, display: 'grid', alignContent: 'center' }}>
      <p style={{ ...typography.bodyText, margin: 0, color: colors.textFaint }}>Closed via Escape.</p>
    </div>
  )

  return (
    <div style={{ ...previewShell(), display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: spacing[16] }}>
      {demoStateColumn('Open', openState)}
      {demoStateColumn('After Escape', dismissedState)}
    </div>
  )
}

export function SegmentTreeExpandPreview() {
  const row = (isOpen) => (
    <div style={{ display: 'grid', gap: spacing[8] }}>
      <div
        style={{
          borderRadius: radius[12],
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: spacing[8],
          padding: `${spacing[8]} ${spacing[12]}`,
          color: colors.textStrong,
          textAlign: 'left',
        }}
      >
        {isOpen ? <ChevronDown size={16} strokeWidth={1.8} /> : <ChevronRight size={16} strokeWidth={1.8} />}
        <span style={{ ...typography.bodyText, fontWeight: 700 }}>Chapter 2: Prayer</span>
      </div>
      {isOpen ? (
        <div style={{ display: 'grid', gap: spacing[6], paddingLeft: spacing[24] }}>
          {['2.1 Times of Prayer', '2.2 Conditions', '2.3 Jumu’ah'].map((rowLabel) => (
            <div key={rowLabel} style={{ minHeight: 34, borderRadius: radius[12], background: 'rgba(255,255,255,0.92)', border: `1px solid ${colors.lineSoft}`, display: 'flex', alignItems: 'center', padding: `0 ${spacing[12]}` }}>
              <span style={{ ...typography.bodyText, fontSize: 14, color: colors.textBody }}>{rowLabel}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )

  return (
    <div style={{ ...previewShell(), display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: spacing[16] }}>
      {demoStateColumn('Collapsed', row(false))}
      {demoStateColumn('Expanded', row(true))}
    </div>
  )
}

export function SupportPanelCollapsePreview() {
  const expanded = (
    <div style={{ minHeight: 132, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', overflow: 'hidden' }}>
      <div style={{ padding: spacing[16], display: 'grid', gap: spacing[12] }}>
        <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.textStrong }}>Support panels</p>
        <div style={{ minHeight: 34, borderRadius: radius[12], background: 'rgba(243, 232, 255, 0.56)' }} />
        <div style={{ minHeight: 34, borderRadius: radius[12], background: 'rgba(224, 231, 255, 0.56)' }} />
      </div>
    </div>
  )

  const collapsed = (
    <div style={{ minHeight: 132, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ ...typography.eyebrowLabel, color: colors.textSoft }}>Collapsed support rail</span>
    </div>
  )

  return (
    <div style={{ ...previewShell(), display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: spacing[16] }}>
      {demoStateColumn('Expanded', expanded)}
      {demoStateColumn('Collapsed', collapsed)}
    </div>
  )
}

export function HoverPreviewPinDemo() {
  const rail = (
    <div style={{ width: 72, minHeight: 160, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: colors.textSoft, fontFamily: typography.bodyText.fontFamily, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      Lexicography
    </div>
  )

  const previewCard = (pinned = false) => (
    <div style={{ width: 220, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', boxShadow: '0 16px 32px rgba(15,23,42,0.14)', overflow: 'hidden' }}>
      <div style={{ minHeight: 46, padding: `0 ${spacing[16]}`, display: 'flex', alignItems: 'center', gap: spacing[12], background: 'rgba(243, 232, 255, 0.9)', borderBottom: '1px solid rgba(216, 180, 254, 0.96)' }}>
        <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Preview</span>
        <button
          type="button"
          style={{
            marginLeft: 'auto',
            width: 28,
            height: 28,
            borderRadius: radius.pill,
            border: 'none',
            background: pinned ? 'rgba(237, 246, 255, 0.98)' : 'rgba(255,255,255,0.84)',
            color: pinned ? colors.accentStrong : '#7C3AED',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Pin size={14} strokeWidth={1.8} />
        </button>
      </div>
      <div style={{ padding: spacing[16], display: 'grid', gap: spacing[8] }}>
        <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, color: colors.textBody }}>
          {pinned ? 'Pinned preview remains open after hover leaves.' : 'Hover reveals the preview temporarily.'}
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ ...previewShell(), display: 'grid', gap: spacing[20] }}>
      {demoStateColumn('Rest', rail)}
      {demoStateColumn('Hover reveal', <div style={{ display: 'flex', gap: spacing[12], alignItems: 'flex-start' }}>{rail}{previewCard(false)}</div>)}
      {demoStateColumn('Pinned open', <div style={{ display: 'flex', gap: spacing[12], alignItems: 'flex-start' }}>{rail}{previewCard(true)}</div>)}
    </div>
  )
}

export function FloatDockPreview() {
  const panel = (mode) => (
    <div style={{ width: 220, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', boxShadow: mode === 'floating' ? '0 18px 36px rgba(15,23,42,0.16)' : 'none', overflow: 'hidden' }}>
      <div style={{ minHeight: 44, padding: `0 ${spacing[16]}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(224, 231, 255, 0.88)', borderBottom: '1px solid rgba(165, 180, 252, 0.96)' }}>
        <span style={{ ...typography.bodyText, fontSize: 14, fontWeight: 700, color: colors.textStrong }}>Discussion</span>
        <div style={{ display: 'inline-flex', gap: spacing[8] }}>
          <button type="button" style={{ width: 26, height: 26, border: 'none', borderRadius: radius.pill, background: 'rgba(255,255,255,0.84)', color: '#4F46E5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {mode === 'floating' ? <Minimize2 size={13} strokeWidth={1.8} /> : <MessageSquare size={13} strokeWidth={1.8} />}
          </button>
          <button type="button" style={{ width: 26, height: 26, border: 'none', borderRadius: radius.pill, background: 'rgba(255,255,255,0.84)', color: '#4F46E5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={13} strokeWidth={1.8} />
          </button>
        </div>
      </div>
      <div style={{ padding: spacing[16] }}>
        <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, color: colors.textBody }}>Discussion can stay docked or detach into a floating panel without losing context.</p>
      </div>
    </div>
  )

  return (
    <div style={{ ...previewShell(), display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: spacing[16] }}>
      {demoStateColumn('Docked', <div style={{ minHeight: 180, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: 'rgba(255,255,255,0.7)', padding: spacing[12], display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>{panel('docked')}</div>)}
      {demoStateColumn('Floating', <div style={{ minHeight: 180, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: 'rgba(255,255,255,0.7)', padding: spacing[12], display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start' }}><div style={{ transform: 'translate(16px, -32px)' }}>{panel('floating')}</div></div>)}
    </div>
  )
}

export function FloatingDragResizePreview() {
  const [shifted] = useAutoToggle(false, 1800)

  return (
    <div style={{ ...previewShell(), minHeight: 220, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: spacing[20] }}>
      <div
        style={{
          width: shifted ? 300 : 260,
          transform: shifted ? 'translate(18px, -6px)' : 'translate(0, 0)',
          borderRadius: radius[16],
          border: `1px solid ${colors.lineSoft}`,
          background: '#fff',
          boxShadow: '0 18px 36px rgba(15,23,42,0.16)',
          overflow: 'hidden',
          position: 'relative',
          transition: `width ${motion.panel}, transform ${motion.panel}`,
        }}
      >
        <div style={{ minHeight: 44, padding: `0 ${spacing[16]}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12], background: 'rgba(243, 232, 255, 0.88)', borderBottom: '1px solid rgba(216, 180, 254, 0.96)', cursor: 'grab' }}>
          <span style={{ ...typography.bodyText, fontSize: 14, fontWeight: 700, color: colors.textStrong }}>Floating panel</span>
          <button type="button" style={{ width: 26, height: 26, border: 'none', borderRadius: radius.pill, background: 'rgba(255,255,255,0.84)', color: '#7C3AED', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pin size={13} strokeWidth={1.8} />
          </button>
        </div>
        <div style={{ padding: spacing[16], minHeight: 100 }}>
          <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, color: colors.textBody }}>This preview auto-cycles between rest and dragged/resized states.</p>
        </div>
        <span style={{ position: 'absolute', right: 12, bottom: 12, width: 14, height: 1.5, background: 'rgba(148, 163, 184, 0.72)', transform: 'rotate(-45deg)', transformOrigin: 'right center' }} />
        <span style={{ position: 'absolute', right: 18, bottom: 18, width: 10, height: 1.5, background: 'rgba(148, 163, 184, 0.6)', transform: 'rotate(-45deg)', transformOrigin: 'right center' }} />
      </div>
    </div>
  )
}

export function EditorShortcutHintPreview() {
  const [revealed] = useAutoToggle(false, 1800)

  return (
    <div style={previewShell()}>
      <div style={{ minHeight: 42, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12], padding: `0 ${spacing[16]}` }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[8],
            color: revealed ? 'rgba(15, 23, 42, 0.42)' : 'rgba(15, 23, 42, 0.22)',
            opacity: revealed ? 1 : 0.7,
            transform: revealed ? 'translateY(0)' : 'translateY(2px)',
            transition: `opacity ${motion.micro}, color ${motion.micro}, transform ${motion.micro}`,
          }}
        >
          <span style={{ minWidth: 20, height: 20, border: '1px solid rgba(15,23,42,0.08)', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>⌘</span>
          <span style={{ minWidth: 20, height: 20, border: '1px solid rgba(15,23,42,0.08)', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>V</span>
          <span style={{ ...typography.bodyText, fontSize: 12, color: revealed ? 'rgba(15, 23, 42, 0.38)' : 'rgba(15, 23, 42, 0.26)' }}>to paste</span>
        </div>
        <span style={{ ...typography.monoMeta, color: colors.textSoft }}>{revealed ? 'Visible' : 'Subtle'}</span>
      </div>
    </div>
  )
}

export function SplitCTAInteractionPreview() {
  return (
    <div style={previewShell()}>
      <div style={{ display: 'grid', gap: spacing[16] }}>
        <div style={{ display: 'grid', gap: spacing[20], alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: spacing[8], justifyItems: 'center' }}>
            <span style={stateLabelStyle()}>Closed</span>
            <SplitCTAPreview />
          </div>
          <div style={{ display: 'grid', gap: spacing[8], justifyItems: 'center' }}>
            <span style={stateLabelStyle()}>Open</span>
            <SplitCTAPreview showMenu />
          </div>
          <div style={{ display: 'grid', gap: spacing[8], justifyItems: 'center' }}>
            <span style={stateLabelStyle()}>Selected</span>
            <SplitCTAPreview showMenu initialMethod="manual" initialStyle="sentence" />
          </div>
        </div>
        <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, color: colors.textSoft, textAlign: 'center' }}>
          Review the sequence as one composed control: closed, open, select, then return to the button state.
        </p>
      </div>
    </div>
  )
}

export function HoverLiftPreview() {
  return (
    <div style={previewShell()}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: spacing[16] }}>
        {[
          { label: 'Rest', lifted: false },
          { label: 'Hover', lifted: true },
        ].map((state) => (
          <div
            key={state.label}
            style={{
              minHeight: 132,
              borderRadius: radius[24],
              border: `1px solid ${colors.lineSoft}`,
              background: '#fff',
              boxShadow: state.lifted ? '0 16px 34px rgba(15, 23, 42, 0.12)' : '0 8px 18px rgba(15, 23, 42, 0.06)',
              transform: state.lifted ? 'translateY(-2px)' : 'translateY(0)',
              transition: `box-shadow ${motion.micro}, transform ${motion.micro}`,
              padding: spacing[16],
              display: 'grid',
              gap: spacing[8],
            }}
          >
            <p style={{ ...stateLabelStyle(), margin: 0, textAlign: 'left' }}>{state.label}</p>
            <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.textStrong }}>Primary surface</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HoverFocusMicroMotionPreview() {
  return (
    <div style={previewShell()}>
      <div style={{ display: 'grid', gap: spacing[16] }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: spacing[20], flexWrap: 'wrap' }}>
          <div style={{ display: 'grid', justifyItems: 'center', gap: spacing[8] }}>
            <IconActionButton icon={<Pin size={16} strokeWidth={1.9} />} label="Rest" size="utility-sm" />
            <span style={{ ...typography.eyebrowLabel, color: colors.textSoft }}>Rest</span>
          </div>
          <div style={{ display: 'grid', justifyItems: 'center', gap: spacing[8] }}>
            <IconActionButton icon={<Pin size={16} strokeWidth={1.9} />} label="Hover" size="utility-sm" active />
            <span style={{ ...typography.eyebrowLabel, color: colors.textSoft }}>Hover</span>
          </div>
          <div style={{ display: 'grid', justifyItems: 'center', gap: spacing[8] }}>
            <IconActionButton
              icon={<Pin size={16} strokeWidth={1.9} />}
              label="Focus"
              size="utility-sm"
              active
              style={{ boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.16)' }}
            />
            <span style={{ ...typography.eyebrowLabel, color: colors.textSoft }}>Focus</span>
          </div>
        </div>
        <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, color: colors.textBody, textAlign: 'center' }}>
          Small-control motion should sharpen and clarify state without feeling flashy.
        </p>
      </div>
    </div>
  )
}

export function MenuMotionPreview() {
  const [open, setOpen] = useAutoToggle(false, 2000)

  return (
    <div style={previewShell()}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={{
          minHeight: 34,
          padding: `0 ${spacing[16]}`,
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
            padding: spacing[16],
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
  const [entered, setEntered] = useAutoToggle(false, 2200)

  return (
    <div style={previewShell()}>
      <button
        type="button"
        onClick={() => setEntered((value) => !value)}
        style={{
          minHeight: 34,
          padding: `0 ${spacing[16]}`,
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
            padding: spacing[20],
            opacity: entered ? 0.2 : 1,
            transform: entered ? 'translateY(20px) scale(0.98)' : 'translateY(0) scale(1)',
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
  const [revealed] = useAutoToggle(false, 1800)

  return (
    <div style={{ ...previewShell(), minHeight: 220, position: 'relative' }}>
      <div style={{ width: 72, minHeight: 160, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: colors.textSoft, fontFamily: typography.bodyText.fontFamily, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Lexicography
      </div>
      <div
        style={{
          position: 'absolute',
          top: spacing[20],
          left: 92,
          width: 260,
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateX(0) scale(1)' : 'translateX(-10px) scale(0.98)',
          transition: `opacity ${motion.panel}, transform ${motion.panel}`,
        }}
      >
        <div style={{ width: 260, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', boxShadow: '0 16px 32px rgba(15,23,42,0.14)', overflow: 'hidden' }}>
          <div style={{ minHeight: 46, padding: `0 ${spacing[16]}`, display: 'flex', alignItems: 'center', background: 'rgba(243, 232, 255, 0.9)', borderBottom: '1px solid rgba(216, 180, 254, 0.96)' }}>
            <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Preview reveal</span>
          </div>
          <div style={{ padding: spacing[16], display: 'grid', gap: spacing[8] }}>
            <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, color: colors.textBody }}>The reveal should feel attached and informative, not like a random popover.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FocusedExpandMotionPreview() {
  const [expanded] = useAutoToggle(false, 2200)

  return (
    <div style={{ ...previewShell(), minHeight: 260, position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.42)',
          opacity: expanded ? 1 : 0,
          transition: `opacity ${motion.screen}`,
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 220,
        }}
      >
        <div
          style={{
            width: expanded ? 420 : 300,
            transform: expanded ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.94)',
            opacity: expanded ? 1 : 0.78,
            transition: `width ${motion.screen}, transform ${motion.screen}, opacity ${motion.screen}`,
          }}
        >
          <FloatingSupportPreview />
        </div>
      </div>
    </div>
  )
}

export function CTASheenPreview() {
  const [active] = useAutoToggle(false, 2000)

  return (
    <div style={previewShell()}>
      <div style={{ display: 'grid', gap: spacing[12], justifyItems: 'center' }}>
        <PrimaryCTA forceActiveChrome={active}>AI segment text</PrimaryCTA>
        <span style={stateLabelStyle()}>{active ? 'Hover sweep' : 'Rest state'}</span>
      </div>
    </div>
  )
}

export function ReducedMotionFallbackPreview() {
  return (
    <div style={previewShell()}>
      <div style={{ display: 'grid', gap: spacing[12] }}>
        <div style={{ minHeight: 46, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: 'rgba(255,255,255,0.98)', padding: `0 ${spacing[16]}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Motion</span>
          <span style={{ ...typography.eyebrowLabel, color: colors.textSoft }}>default</span>
        </div>
        <div style={{ minHeight: 46, borderRadius: radius[16], border: `1px dashed ${colors.lineSoft}`, background: 'rgba(248,250,252,0.92)', padding: `0 ${spacing[16]}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Reduced motion</span>
          <span style={{ ...typography.eyebrowLabel, color: colors.textSoft }}>fade / no sweep / no lift</span>
        </div>
      </div>
    </div>
  )
}
