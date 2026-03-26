import { BookOpen, Check, Maximize2, Pin, X } from 'lucide-react'
import { colors, radius, spacing, typography } from '../tokens'

function previewShell(background = 'rgba(255, 255, 255, 0.98)') {
  return {
    borderRadius: radius[16],
    border: `1px solid ${colors.lineSoft}`,
    background,
    padding: spacing[12],
  }
}

function toneMap() {
  return {
    lexicography: {
      headerBg: 'rgba(243, 232, 255, 0.92)',
      headerBorder: 'rgba(216, 180, 254, 0.96)',
      accent: '#7C3AED',
    },
    discussion: {
      headerBg: 'rgba(224, 231, 255, 0.92)',
      headerBorder: 'rgba(165, 180, 252, 0.96)',
      accent: '#4F46E5',
    },
    grade: {
      headerBg: 'rgba(220, 252, 231, 0.92)',
      headerBorder: 'rgba(134, 239, 172, 0.96)',
      accent: '#15803D',
    },
  }
}

export function EditorTopbarPreview() {
  return (
    <div style={previewShell()}>
      <div
        style={{
          minHeight: 56,
          borderRadius: radius[16],
          border: `1px solid rgba(15, 23, 42, 0.06)`,
          background: 'rgba(255, 255, 255, 0.96)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[12],
          padding: `0 ${spacing[16]}`,
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[12] }}>
          <div style={{ display: 'inline-flex', gap: spacing[8] }}>
            <span style={{ width: 8, height: 8, borderRadius: radius.pill, background: 'rgba(0,0,0,0.08)' }} />
            <span style={{ width: 8, height: 8, borderRadius: radius.pill, background: 'rgba(0,0,0,0.08)' }} />
            <span style={{ width: 18, height: 8, borderRadius: radius.pill, background: 'rgba(0,0,0,0.08)' }} />
          </div>
          <span style={{ ...typography.eyebrowLabel, color: 'rgba(15, 23, 42, 0.38)' }}>Arapal intake</span>
        </div>
        <span
          style={{
            minHeight: 28,
            padding: '0 12px',
            borderRadius: radius.pill,
            border: '1px solid rgba(37, 99, 235, 0.14)',
            background: 'rgba(239, 246, 255, 0.9)',
            color: 'rgba(37, 99, 235, 0.74)',
            display: 'inline-flex',
            alignItems: 'center',
            fontFamily: typography.bodyText.fontFamily,
            fontSize: 10,
            lineHeight: 1,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          Preserved source
        </span>
      </div>
    </div>
  )
}

export function EditorFooterPreview() {
  return (
    <div style={previewShell()}>
      <div
        style={{
          minHeight: 42,
          borderRadius: radius[16],
          border: `1px solid rgba(15, 23, 42, 0.06)`,
          background: 'rgba(255, 255, 255, 0.96)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[12],
          padding: `0 ${spacing[16]}`,
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8], color: 'rgba(15, 23, 42, 0.26)' }}>
          <span style={{ minWidth: 20, height: 20, border: '1px solid rgba(15,23,42,0.08)', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>⌘</span>
          <span style={{ minWidth: 20, height: 20, border: '1px solid rgba(15,23,42,0.08)', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>V</span>
          <span style={{ ...typography.bodyText, fontSize: 12, color: 'rgba(15, 23, 42, 0.3)' }}>to paste</span>
        </div>
        <span style={{ ...typography.monoMeta, color: colors.textSoft }}>482 words</span>
      </div>
    </div>
  )
}

export function PanelCornerCasingPreview() {
  return (
    <div style={{ ...previewShell('rgba(248, 251, 255, 0.98)'), padding: spacing[18] }}>
      <div
        style={{
          position: 'relative',
          minHeight: 120,
          borderRadius: radius[24],
          border: `1px solid rgba(15, 23, 42, 0.06)`,
          background: 'rgba(255,255,255,0.96)',
        }}
      >
        {[
          { top: 0, left: 16, borders: '1.5px 0 0 1.5px', borderTopLeftRadius: 14 },
          { top: 0, right: 16, borders: '1.5px 1.5px 0 0', borderTopRightRadius: 14 },
          { bottom: 0, left: 16, borders: '0 0 1.5px 1.5px', borderBottomLeftRadius: 14 },
          { bottom: 0, right: 16, borders: '0 1.5px 1.5px 0', borderBottomRightRadius: 14 },
        ].map((corner, index) => (
          <span
            key={index}
            style={{
              position: 'absolute',
              width: 16,
              height: 16,
              borderColor: 'rgba(37, 99, 235, 0.26)',
              borderStyle: 'solid',
              borderWidth: corner.borders,
              ...corner,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function OperationalPanelPreview() {
  return (
    <div style={previewShell()}>
      <div style={{ borderRadius: radius[24], border: `1px solid ${colors.lineSoft}`, overflow: 'hidden', background: '#fff' }}>
        <div
          style={{
            minHeight: 54,
            padding: `0 ${spacing[18]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing[12],
            background: 'rgba(248, 251, 255, 0.96)',
            borderBottom: `1px solid ${colors.lineSoft}`,
          }}
        >
          <div style={{ display: 'grid', gap: 4 }}>
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Operational panel</p>
            <p style={{ ...typography.bodyText, margin: 0, fontWeight: 600, color: colors.textStrong }}>Source review</p>
          </div>
          <span style={{ ...typography.monoMeta, color: colors.textSoft }}>Controlled</span>
        </div>
        <div style={{ padding: spacing[18], display: 'grid', gap: spacing[12] }}>
          <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
            Preserve source, inspect the proposal, and approve explicitly.
          </p>
          <div style={{ display: 'grid', gap: spacing[8] }}>
            <div style={{ minHeight: 38, borderRadius: radius[12], background: 'rgba(239, 246, 255, 0.72)', border: `1px solid rgba(191, 219, 254, 0.96)` }} />
            <div style={{ minHeight: 38, borderRadius: radius[12], background: 'rgba(248, 250, 252, 0.92)', border: `1px solid ${colors.lineSoft}` }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function OptionsPopoverPreview() {
  return (
    <div style={previewShell()}>
      <div
        style={{
          width: '100%',
          borderRadius: radius[24],
          border: '1px solid rgba(191, 219, 254, 0.92)',
          background: 'rgba(255, 255, 255, 0.96)',
          boxShadow: '0 20px 42px rgba(15, 23, 42, 0.12)',
          padding: spacing[16],
          display: 'grid',
          gap: spacing[14],
        }}
      >
        {[
          { title: 'Method', rows: ['AI proposal', 'Manual start'] },
          { title: 'Segmentation style', rows: ['Sentence', 'Meaning groups'] },
        ].map((section) => (
          <div key={section.title} style={{ display: 'grid', gap: spacing[10] }}>
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>{section.title}</p>
            {section.rows.map((row, index) => (
              <div
                key={row}
                style={{
                  borderRadius: radius[16],
                  border: index === 0 ? '1px solid rgba(147, 197, 253, 0.96)' : '1px solid transparent',
                  background: index === 0 ? 'rgba(239, 246, 255, 0.82)' : 'transparent',
                  padding: `${spacing[12]} ${spacing[14]}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: spacing[12],
                }}
              >
                <span style={{ ...typography.bodyText, fontWeight: 600, color: colors.textStrong }}>{row}</span>
                {index === 0 ? <Check size={15} strokeWidth={1.9} color={colors.accentStrong} /> : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function SupportCard({ title, tone = 'lexicography', children }) {
  const tones = toneMap()
  const current = tones[tone]

  return (
    <div style={{ borderRadius: radius[24], border: `1px solid ${colors.lineSoft}`, overflow: 'hidden', background: '#fff', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)' }}>
      <div
        style={{
          minHeight: 54,
          padding: `0 ${spacing[16]}`,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[10],
          background: current.headerBg,
          borderBottom: `1px solid ${current.headerBorder}`,
        }}
      >
        <BookOpen size={16} strokeWidth={1.8} color={current.accent} />
        <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>{title}</span>
          <button type="button" style={{ marginLeft: 'auto', width: 28, height: 28, borderRadius: radius.pill, border: 'none', background: 'rgba(255,255,255,0.84)', color: current.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Maximize2 size={14} strokeWidth={1.8} />
        </button>
      </div>
      <div style={{ padding: spacing[16], display: 'grid', gap: spacing[10] }}>{children}</div>
    </div>
  )
}

export function SupportPanelCardPreview() {
  return (
    <div style={previewShell()}>
      <SupportCard title="Support note" tone="discussion">
        <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
          Keep guidance attached to the active segment instead of sending the user elsewhere.
        </p>
      </SupportCard>
    </div>
  )
}

export function LexicographySupportCardPreview() {
  return (
    <div style={previewShell()}>
      <SupportCard title="Lexicography" tone="lexicography">
        <div style={{ display: 'grid', gap: spacing[8] }}>
          <LexicographyEntryRowPreview />
          <LexicographyEntryRowPreview term="miṣr jāmiʿ" gloss="Comprehensive city" />
        </div>
      </SupportCard>
    </div>
  )
}

export function SupportRailCardPreview() {
  return (
    <div style={{ ...previewShell(), display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: 76, minHeight: 164, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: spacing[10], boxShadow: '0 4px 10px rgba(15,23,42,0.05)' }}>
        <BookOpen size={20} strokeWidth={1.8} color="#7C3AED" />
        <span style={{ ...typography.eyebrowLabel, color: colors.textSoft, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Lexicography</span>
      </div>
    </div>
  )
}

export function FloatingSupportPreview() {
  return (
    <div style={previewShell('rgba(248, 251, 255, 0.98)')}>
      <div style={{ width: '100%', maxWidth: 340, borderRadius: radius[24], border: `1px solid ${colors.lineSoft}`, background: '#fff', boxShadow: '0 18px 42px rgba(15, 23, 42, 0.16)', overflow: 'hidden' }}>
        <FloatingPanelHeaderPreview />
        <div style={{ padding: spacing[16], display: 'grid', gap: spacing[12] }}>
          <FeedbackBlockPreview />
        </div>
        <div
          aria-hidden="true"
          style={{
            position: 'relative',
            marginLeft: 'auto',
            marginRight: spacing[12],
            marginBottom: spacing[12],
            width: 18,
            height: 18,
          }}
        >
          <span style={{ position: 'absolute', inset: 'auto 0 0 auto', width: 12, height: 1.5, background: 'rgba(148, 163, 184, 0.72)', transform: 'rotate(-45deg)', transformOrigin: 'right center' }} />
          <span style={{ position: 'absolute', inset: 'auto 2px 4px auto', width: 8, height: 1.5, background: 'rgba(148, 163, 184, 0.6)', transform: 'rotate(-45deg)', transformOrigin: 'right center' }} />
        </div>
      </div>
    </div>
  )
}

export function DimmedStageOverlayPreview() {
  return (
    <div style={{ ...previewShell('rgba(241, 245, 249, 0.96)'), padding: spacing[18] }}>
      <div style={{ minHeight: 180, borderRadius: radius[24], background: 'rgba(15, 23, 42, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: spacing[16] }}>
        <div style={{ width: 220, minHeight: 112, borderRadius: radius[16], background: 'rgba(255,255,255,0.94)', border: `1px solid ${colors.lineSoft}` }} />
      </div>
    </div>
  )
}

export function ExpandedFocusPanelPreview() {
  return (
    <div style={{ ...previewShell('rgba(241, 245, 249, 0.96)'), padding: spacing[18] }}>
      <div style={{ borderRadius: radius[24], background: 'rgba(15, 23, 42, 0.18)', padding: spacing[18] }}>
        <div style={{ margin: '0 auto', maxWidth: 420, borderRadius: radius[24], border: `1px solid ${colors.lineSoft}`, background: '#fff', overflow: 'hidden', boxShadow: '0 24px 54px rgba(15, 23, 42, 0.22)' }}>
          <div style={{ minHeight: 56, padding: `0 ${spacing[16]}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12], background: 'rgba(243, 232, 255, 0.92)', borderBottom: '1px solid rgba(216, 180, 254, 0.96)' }}>
            <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Lexicography</span>
            <div style={{ display: 'inline-flex', gap: spacing[8] }}>
              <button type="button" style={{ width: 28, height: 28, borderRadius: radius.pill, border: 'none', background: 'rgba(255,255,255,0.84)', color: '#7C3AED', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Pin size={14} strokeWidth={1.8} /></button>
              <button type="button" style={{ width: 28, height: 28, borderRadius: radius.pill, border: 'none', background: 'rgba(255,255,255,0.84)', color: '#7C3AED', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} strokeWidth={1.8} /></button>
            </div>
          </div>
          <div style={{ padding: spacing[18], display: 'grid', gap: spacing[12] }}>
            <p style={{ ...typography.supportSubtext, margin: 0, color: colors.textBody }}>Expanded support content takes temporary focus while the stage dims behind it.</p>
            <LexicographyEntryRowPreview />
          </div>
        </div>
      </div>
    </div>
  )
}

export function FloatingPanelHeaderPreview() {
  return (
    <div style={{ minHeight: 54, padding: `0 ${spacing[16]}`, display: 'flex', alignItems: 'center', gap: spacing[10], background: 'rgba(243, 232, 255, 0.92)', borderBottom: '1px solid rgba(216, 180, 254, 0.96)' }}>
      <BookOpen size={16} strokeWidth={1.8} color="#7C3AED" />
      <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Lexicography</span>
      <div style={{ marginLeft: 'auto', display: 'inline-flex', gap: spacing[8] }}>
        <button type="button" style={{ width: 28, height: 28, borderRadius: radius.pill, border: 'none', background: 'rgba(255,255,255,0.84)', color: '#7C3AED', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Maximize2 size={14} strokeWidth={1.8} /></button>
        <button type="button" style={{ width: 28, height: 28, borderRadius: radius.pill, border: 'none', background: 'rgba(255,255,255,0.84)', color: '#7C3AED', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Pin size={14} strokeWidth={1.8} /></button>
        <button type="button" style={{ width: 28, height: 28, borderRadius: radius.pill, border: 'none', background: 'rgba(255,255,255,0.84)', color: '#7C3AED', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} strokeWidth={1.8} /></button>
      </div>
    </div>
  )
}

export function FloatingResizeAffordancePreview() {
  return (
    <div style={previewShell()}>
      <div style={{ width: '100%', maxWidth: 260, minHeight: 120, marginLeft: 'auto', borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', position: 'relative' }}>
        <span style={{ position: 'absolute', right: 10, bottom: 10, width: 14, height: 1.5, background: 'rgba(148, 163, 184, 0.72)', transform: 'rotate(-45deg)', transformOrigin: 'right center' }} />
        <span style={{ position: 'absolute', right: 16, bottom: 16, width: 10, height: 1.5, background: 'rgba(148, 163, 184, 0.6)', transform: 'rotate(-45deg)', transformOrigin: 'right center' }} />
      </div>
    </div>
  )
}

export function FeedbackBlockPreview() {
  return (
    <div style={{ borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: 'rgba(248, 250, 252, 0.94)', padding: spacing[14], display: 'grid', gap: spacing[8] }}>
      <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Feedback</p>
      <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
        Strengthen the opening condition, then clarify attribution before expanding the ruling.
      </p>
    </div>
  )
}

export function NumberedTakeawayPreview() {
  return (
    <div style={{ borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', padding: spacing[14], display: 'flex', gap: spacing[12], alignItems: 'flex-start' }}>
      <span style={{ width: 28, height: 28, borderRadius: radius.pill, background: 'rgba(239, 246, 255, 0.96)', color: colors.accentStrong, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>1</span>
      <div style={{ display: 'grid', gap: 4 }}>
        <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.textStrong }}>Differing opinions</p>
        <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, color: colors.textSoft }}>Keep the main and secondary positions distinct and clearly attributed.</p>
      </div>
    </div>
  )
}

export function LexicographyEntryRowPreview({
  term = 'miṣr jāmiʿ',
  gloss = 'Comprehensive city with judge and ruler',
}) {
  return (
    <div style={{ borderRadius: radius[16], border: `1px solid rgba(216, 180, 254, 0.38)`, background: 'rgba(250, 245, 255, 0.9)', padding: `${spacing[12]} ${spacing[14]}`, display: 'grid', gap: 4 }}>
      <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.textStrong }}>{term}</p>
      <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, color: colors.textSoft }}>{gloss}</p>
    </div>
  )
}
