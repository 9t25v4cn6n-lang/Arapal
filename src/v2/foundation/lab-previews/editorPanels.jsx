import { useState } from 'react'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  BookOpen,
  ClipboardList,
  Home,
  Italic,
  Minimize2,
  Maximize2,
  Move,
  Scissors,
  Strikethrough,
  Underline,
  Wrench,
  X,
} from 'lucide-react'
import SegmentationOptionsPopover, {
  segmentationGranularityOptions,
  segmentationMethodOptions,
  segmentationStyleOptions,
} from '../primitives/SegmentationOptionsPopover'
import { colors, radius, spacing, surfacePadding, typography } from '../tokens'
import SourceIntakeBrand from '../primitives/SourceIntakeBrand'

function previewShell(background = 'rgba(255, 255, 255, 0.98)') {
  return {
    borderRadius: radius[16],
    border: `1px solid ${colors.lineSoft}`,
    background,
    padding: surfacePadding.compactShell,
  }
}

function toneMap() {
  return {
    lexicography: {
      headerBg: '#faf5ff',
      headerBorder: 'rgba(233, 213, 255, 0.85)',
      accent: '#9333ea',
    },
    discussion: {
      headerBg: '#f3f7ff',
      headerBorder: 'rgba(191, 219, 254, 0.85)',
      accent: '#2563eb',
    },
  }
}

function lexEntry({ arabic, mono, text, context }) {
  return (
    <div
      style={{
        paddingBottom: spacing[12],
        borderBottom: '1px solid #f3f4f6',
      }}
    >
      <div
        style={{
          marginBottom: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[12],
        }}
      >
        <span
          style={{
            fontFamily: '"Amiri", "Noto Naskh Arabic", "Geeza Pro", serif',
            fontWeight: 700,
            color: '#111827',
            fontSize: 16,
            lineHeight: 1.4,
          }}
          dir="rtl"
        >
          {arabic}
        </span>
        <span
          style={{
            fontFamily: '"SFMono-Regular", "JetBrains Mono", "Menlo", monospace',
            fontSize: 12,
            lineHeight: 1.2,
            display: 'inline-flex',
            alignItems: 'center',
            color: '#74839a',
            flexShrink: 0,
          }}
        >
          {mono}
        </span>
      </div>
      {text ? (
        <p
          style={{
            ...typography.bodyText,
            margin: 0,
            fontSize: 14,
            lineHeight: 1.58,
            color: '#415268',
            overflowWrap: 'anywhere',
          }}
        >
          {text}
        </p>
      ) : null}
      {context ? (
        <div
          style={{
            marginTop: spacing[12],
            padding: `${spacing[12]}px ${spacing[16]}px`,
            border: '1px solid #f3f4f6',
            borderRadius: radius[12],
            background: '#f9fafb',
            fontSize: 12,
            lineHeight: 1.58,
            color: '#45556c',
            overflowWrap: 'anywhere',
          }}
        >
          {context}
        </div>
      ) : null}
    </div>
  )
}

function SupportCard({ title, tone = 'lexicography', children }) {
  const tones = toneMap()
  const current = tones[tone]

  return (
    <div
      style={{
        minHeight: 220,
        borderRadius: 18,
        border: '1px solid #dfe8f4',
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 3px 10px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.05)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          minHeight: 46,
          padding: `0 ${surfacePadding.panelHeaderX}px`,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[12],
          borderBottom: `1px solid ${current.headerBorder}`,
          background: current.headerBg,
        }}
      >
        <BookOpen size={16} strokeWidth={1.8} color={current.accent} />
        <span style={{ ...typography.bodyText, fontSize: 14, fontWeight: 600, color: '#1d293d' }}>{title}</span>
        <button
          type="button"
          style={{
            marginLeft: 'auto',
            width: 22,
            height: 22,
            borderRadius: 0,
            border: 'none',
            background: 'transparent',
            color: '#6b7280',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Maximize2 size={14} strokeWidth={1.8} />
        </button>
      </div>
      <div style={{ padding: surfacePadding.panelBody, display: 'grid', gap: spacing[10], flex: 1 }}>{children}</div>
    </div>
  )
}

function toolbarButton(content, { active = false, compact = false } = {}) {
  return (
    <button
      type="button"
      style={{
        minWidth: compact ? 30 : 34,
        height: 30,
        padding: compact ? '0 8px' : '0 10px',
        borderRadius: 10,
        border: `1px solid ${active ? 'rgba(147, 197, 253, 0.92)' : 'rgba(226, 232, 240, 0.96)'}`,
        background: active ? 'rgba(239, 246, 255, 0.9)' : 'rgba(255, 255, 255, 0.96)',
        color: active ? colors.accentStrong : colors.textSoft,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: active ? 'inset 0 1px 0 rgba(255,255,255,0.92)' : 'none',
        fontFamily: typography.bodyText.fontFamily,
        fontSize: 13,
        fontWeight: 600,
        lineHeight: 1,
      }}
    >
      {content}
    </button>
  )
}

export function ModeSurfaceMarksPreview() {
  const items = [
    { icon: Home, title: 'Project Home', subtitle: 'Command centre' },
    { icon: Scissors, title: 'Source Intake', subtitle: 'Segmentation' },
    { icon: BookOpen, title: 'Study Workspace', subtitle: 'Segment work' },
    { icon: Wrench, title: 'Patching', subtitle: 'Controlled fixes' },
    { icon: ClipboardList, title: 'Exams', subtitle: 'Assessment' },
  ]

  return (
    <div style={previewShell()}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: spacing[16] }}>
        {items.map((item) => (
          <div
            key={item.title}
            style={{
              borderRadius: radius[16],
              border: `1px solid ${colors.lineSoft}`,
              background: 'rgba(255, 255, 255, 0.96)',
              padding: surfacePadding.panelBody,
              minWidth: 0,
            }}
          >
            <SourceIntakeBrand
              title={item.title}
              subtitle={item.subtitle}
              icon={<item.icon size={16} strokeWidth={1.9} />}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function EditorFormattingToolbarPreview() {
  return (
    <div style={previewShell()}>
      <div
        style={{
          width: '100%',
          borderRadius: radius[16],
          border: `1px solid ${colors.lineSoft}`,
          background: 'rgba(255, 255, 255, 0.98)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            minHeight: 54,
            padding: `0 ${spacing[16]}px`,
            display: 'flex',
            alignItems: 'center',
            gap: spacing[12],
            borderBottom: `1px solid ${colors.lineSoft}`,
          }}
        >
          <span
            style={{
              minWidth: 28,
              height: 28,
              borderRadius: 8,
              background: 'rgba(239, 246, 255, 0.92)',
              color: colors.accentStrong,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            EN
          </span>
          <span
            style={{
              ...typography.bodyText,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: colors.textStrong,
            }}
          >
            Translation
          </span>
          <div style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: spacing[8], flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {toolbarButton(<Bold size={14} strokeWidth={2} />, { compact: true })}
            {toolbarButton(<Italic size={14} strokeWidth={2} />, { compact: true })}
            {toolbarButton(<Underline size={14} strokeWidth={2} />, { compact: true })}
            {toolbarButton(<Strikethrough size={14} strokeWidth={2} />, { compact: true })}
            <span style={{ width: 1, height: 18, background: 'rgba(226, 232, 240, 0.96)' }} />
            {toolbarButton(<AlignLeft size={14} strokeWidth={1.9} />, { compact: true })}
            {toolbarButton(<AlignCenter size={14} strokeWidth={1.9} />, { compact: true, active: true })}
            {toolbarButton(<AlignRight size={14} strokeWidth={1.9} />, { compact: true })}
            {toolbarButton(<AlignJustify size={14} strokeWidth={1.9} />, { compact: true })}
            <span style={{ width: 1, height: 18, background: 'rgba(226, 232, 240, 0.96)' }} />
            {toolbarButton('Aa')}
            {toolbarButton('Ω')}
            {toolbarButton('NBSP', { compact: true })}
            {toolbarButton('QA', { compact: true })}
          </div>
        </div>
      </div>
    </div>
  )
}

export function OptionsPopoverPreview() {
  return (
    <div style={previewShell()}>
      <SegmentationOptionsPopover
        methodOptions={segmentationMethodOptions}
        method="ai"
        styleOptions={segmentationStyleOptions}
        selectedStyle="meaning"
        granularityOptions={segmentationGranularityOptions}
        granularity="balanced"
        quickMode
        quickModeMeta="Go straight to Segments Ready after the AI pass"
        showSegmentationTransition={false}
      />
    </div>
  )
}

export function SupportCardFamilyPreview() {
  return (
    <div style={previewShell()}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: spacing[12], alignItems: 'stretch' }}>
        <SupportCard title="Guidance" tone="discussion">
          <p style={{ ...typography.bodyText, margin: 0, color: '#415268', lineHeight: 1.58 }}>
            Keep guidance attached to the active segment instead of sending the user elsewhere.
          </p>
        </SupportCard>
        <SupportCard title="Lexicography" tone="lexicography">
          <div style={{ display: 'grid', gap: spacing[12] }}>
            {lexEntry({
              arabic: 'مصر جامع',
              mono: 'miṣr jāmiʿ',
              text: 'Comprehensive city; a large urban center with civic amenities.',
              context: (
                <>
                  <strong>Context:</strong> In Hanafi fiqh, typically defined by having a judge and a ruler capable of enforcing laws.
                </>
              ),
            })}
            <div style={{ paddingBottom: 0, borderBottom: 'none' }}>
              {lexEntry({
                arabic: 'أفنية',
                mono: 'afniyah',
                text: 'Outskirts, courtyards, or immediate surrounding areas attached to the city.',
              })}
            </div>
          </div>
        </SupportCard>
      </div>
    </div>
  )
}

export function SupportRailCardPreview() {
  const [hoveredIndex, setHoveredIndex] = useState(1)
  const cards = [
    {
      id: 'guidance',
      height: 104,
      accent: '#15803D',
      accentStrong: '#166534',
      accentSoft: 'rgba(220, 252, 231, 0.92)',
      shadow: 'rgba(21, 128, 61, 0.18)',
    },
    {
      id: 'discussion',
      height: 156,
      accent: '#4F46E5',
      accentStrong: '#4338CA',
      accentSoft: 'rgba(224, 231, 255, 0.92)',
      shadow: 'rgba(79, 70, 229, 0.18)',
    },
    {
      id: 'lexicography',
      height: 186,
      accent: '#9333EA',
      accentStrong: '#7E22CE',
      accentSoft: 'rgba(243, 232, 255, 0.92)',
      shadow: 'rgba(147, 51, 234, 0.18)',
    },
  ]

  return (
    <div style={{ ...previewShell(), display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          width: 92,
          padding: surfacePadding.railShell,
          borderRadius: radius[16],
          border: `1px solid ${colors.lineSoft}`,
          background: 'rgba(248, 251, 255, 0.98)',
        }}
      >
        <div style={{ display: 'grid', gap: 14 }}>
          {cards.map((item, index) => {
            const isHovered = hoveredIndex === index

            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  position: 'relative',
                  isolation: 'isolate',
                  overflow: 'hidden',
                  width: '100%',
                  minHeight: item.height,
                  border: `1px solid ${isHovered ? 'rgba(255,255,255,0.08)' : '#dfe8f4'}`,
                  borderRadius: 12,
                  background: isHovered
                    ? `linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 55%), linear-gradient(180deg, ${item.accent} 0%, ${item.accentStrong} 100%)`
                    : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isHovered
                    ? `inset 0 1px 0 rgba(255,255,255,0.26), inset 0 -10px 18px ${item.shadow}, 0 18px 34px ${item.shadow}, 0 8px 18px rgba(15, 23, 42, 0.08)`
                    : '0 2px 8px rgba(15, 23, 42, 0.04)',
                  transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
                  transition: 'border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 1,
                    borderRadius: 11,
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 34%, rgba(255,255,255,0) 100%)',
                    opacity: isHovered ? 0.42 : 0,
                    transition: 'opacity 0.22s ease',
                    pointerEvents: 'none',
                  }}
                />
                <BookOpen
                  size={18}
                  strokeWidth={1.9}
                  color={isHovered ? '#ffffff' : item.accent}
                  style={{ position: 'relative', zIndex: 1, transition: 'color 0.22s ease' }}
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function FloatingSupportPreview() {
  return (
    <div style={previewShell('rgba(248, 251, 255, 0.98)')}>
      <div
        style={{
          width: '100%',
          maxWidth: 360,
          borderRadius: 18,
          border: '1px solid #dfe8f4',
          background: '#fff',
          overflow: 'hidden',
          boxShadow: '0 18px 42px rgba(15, 23, 42, 0.16), 0 6px 18px rgba(15, 23, 42, 0.08)',
        }}
      >
        <div
          style={{
            minHeight: 52,
            padding: '0 16px 0 18px',
            display: 'flex',
            alignItems: 'center',
            gap: spacing[12],
            borderBottom: '1px solid rgba(233, 213, 255, 0.85)',
            background: 'rgba(250, 245, 255, 0.92)',
          }}
        >
          <BookOpen size={16} strokeWidth={1.8} color="#9333ea" />
          <span style={{ ...typography.bodyText, fontSize: 14, fontWeight: 600, color: '#1d293d' }}>Lexicography</span>
          <div style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: spacing[8] }}>
            <button type="button" style={{ width: 28, height: 28, border: 'none', borderRadius: radius.pill, background: 'rgba(255, 255, 255, 0.84)', color: '#475569', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Maximize2 size={14} strokeWidth={1.8} />
            </button>
            <button type="button" style={{ minHeight: 28, padding: `0 ${spacing[12]}px`, border: 'none', borderRadius: radius.pill, background: 'rgba(255, 255, 255, 0.84)', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}>
              <Move size={14} strokeWidth={1.8} />
              Float
            </button>
            <button type="button" style={{ width: 28, height: 28, border: 'none', borderRadius: radius.pill, background: 'rgba(255, 255, 255, 0.84)', color: '#64748b', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={14} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div style={{ padding: surfacePadding.panelBodyComfortable, display: 'grid', gap: spacing[12] }}>
          {lexEntry({
            arabic: 'مصر جامع',
            mono: 'miṣr jāmiʿ',
            text: 'Comprehensive city; a large urban center with civic amenities.',
            context: (
              <>
                <strong>Context:</strong> In Hanafi fiqh, typically defined by having a judge and a ruler capable of enforcing laws.
              </>
            ),
          })}
          <div style={{ paddingBottom: 0, borderBottom: 'none' }}>
            {lexEntry({
              arabic: 'أفنية',
              mono: 'afniyah',
              text: 'Outskirts, courtyards, or immediate surrounding areas attached to the city.',
            })}
          </div>
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

export function ExpandedFocusPanelPreview() {
  return (
    <div style={{ ...previewShell('rgba(241, 245, 249, 0.96)'), padding: surfacePadding.compactShell }}>
      <div style={{ borderRadius: radius[24], background: 'rgba(0, 0, 0, 0.5)', padding: spacing[32] }}>
        <div
          style={{
            width: '100%',
            maxWidth: 1120,
            margin: '0 auto',
            borderRadius: 20,
            background: '#fff',
            overflow: 'hidden',
            boxShadow: '0 28px 56px rgba(15, 23, 42, 0.24)',
          }}
        >
          <div
            style={{
              padding: '20px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing[16],
              borderBottom: '1px solid #e5e7eb',
              background: '#faf5ff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[12] }}>
              <BookOpen size={20} strokeWidth={1.8} color="#9333ea" />
              <span style={{ ...typography.bodyText, fontSize: 18, fontWeight: 700, color: '#111827' }}>Lexicography Details</span>
            </div>
            <div style={{ display: 'inline-flex', gap: spacing[8] }}>
              <button type="button" style={{ width: 36, height: 36, border: 'none', borderRadius: 10, background: 'transparent', color: '#6b7280', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Minimize2 size={18} strokeWidth={1.8} />
              </button>
              <button type="button" style={{ width: 36, height: 36, border: 'none', borderRadius: 10, background: 'transparent', color: '#6b7280', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>
          </div>

          <div style={{ background: '#fff' }}>
            <div style={{ padding: '32px', overflow: 'auto' }}>
              <table style={{ width: '100%', minWidth: 1080, borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {[
                      'Term',
                      'Type',
                      'Root/Pattern or Class',
                      'Core Meaning/Function Source',
                      'Direct English',
                      'Context',
                      'Why Included',
                    ].map((cell) => (
                      <th key={cell} style={{ padding: '12px 16px', borderBottom: '2px solid #d1d5db', textAlign: 'left', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#374151', verticalAlign: 'top' }}>
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      termArabic: 'مصر جامع',
                      termMono: 'miṣr jāmiʿ',
                      type: 'Compound Noun',
                      root: 'م-ص-ر + ج-م-ع',
                      pattern: 'فَعْل + فَاعِل',
                      meaning: 'Large settlement + gathering/comprehensive',
                      english: 'Comprehensive city',
                      context: 'Hanafi fiqh: defined by having a judge (qāḍī) and ruler (amīr)',
                      why: 'Central legal term defining jurisdiction for Friday prayer',
                    },
                    {
                      termArabic: 'أفنية',
                      termMono: 'afniyah',
                      type: 'Plural Noun',
                      root: 'ف-ن-ي',
                      pattern: 'أَفْعِلَة (broken plural)',
                      meaning: 'Open spaces, courtyards',
                      english: 'Outskirts / Courtyards',
                      context: 'Immediate surrounding areas attached to the city',
                      why: 'Clarifies spatial extension of legal ruling beyond city center',
                    },
                    {
                      termArabic: 'مصلى',
                      termMono: 'muṣallā',
                      type: 'Noun (Place)',
                      root: 'ص-ل-ي',
                      pattern: 'مَفْعَل (place noun)',
                      meaning: 'Place of prayer',
                      english: 'Prayer area / Prayer ground',
                      context: 'Open space designated for communal prayers, especially Eid',
                      why: 'Distinguishes permissible Friday prayer location from regular mosque',
                    },
                    {
                      termArabic: 'تشريق',
                      termMono: 'tashrīq',
                      type: 'Verbal Noun',
                      root: 'ش-ر-ق',
                      pattern: 'تَفْعِيل',
                      meaning: 'Drying meat in the sun (from sharq = east/sunrise)',
                      english: 'Meat-drying / Drying sacrificial meat',
                      context: 'Refers to the days after Eid al-Adha when meat is dried',
                      why: 'Unusual term requiring cultural context for accurate translation',
                    },
                  ].map((row) => (
                    <tr key={row.termMono} style={{ transition: 'background-color 0.2s ease' }}>
                      <td style={{ padding: spacing[16], borderBottom: '1px solid #e5e7eb', verticalAlign: 'top', fontSize: 14, lineHeight: 1.65, color: '#374151' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", "Geeza Pro", serif', fontSize: 18, lineHeight: 1.3, color: '#111827' }} dir="rtl">
                            {row.termArabic}
                          </span>
                          <span style={{ fontFamily: '"SFMono-Regular", "JetBrains Mono", "Menlo", monospace', fontSize: 12, color: '#6b7280' }}>
                            {row.termMono}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: spacing[16], borderBottom: '1px solid #e5e7eb', verticalAlign: 'top', fontSize: 14, lineHeight: 1.65, color: '#374151' }}>{row.type}</td>
                      <td style={{ padding: spacing[16], borderBottom: '1px solid #e5e7eb', verticalAlign: 'top', fontSize: 14, lineHeight: 1.65, color: '#374151' }}>
                        <div dir="rtl">{row.root}</div>
                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{row.pattern}</div>
                      </td>
                      <td style={{ padding: spacing[16], borderBottom: '1px solid #e5e7eb', verticalAlign: 'top', fontSize: 14, lineHeight: 1.65, color: '#374151' }}>{row.meaning}</td>
                      <td style={{ padding: spacing[16], borderBottom: '1px solid #e5e7eb', verticalAlign: 'top', fontSize: 14, lineHeight: 1.65, color: '#374151' }}>{row.english}</td>
                      <td style={{ padding: spacing[16], borderBottom: '1px solid #e5e7eb', verticalAlign: 'top', fontSize: 14, lineHeight: 1.65, color: '#374151' }}>{row.context}</td>
                      <td style={{ padding: spacing[16], borderBottom: '1px solid #e5e7eb', verticalAlign: 'top', fontSize: 14, lineHeight: 1.65, color: '#374151' }}>{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '16px 32px', borderTop: '1px solid #e5e7eb', background: '#f9fafb', fontSize: 12, color: '#6b7280' }}>
              Lexicographical analysis based on classical Arabic dictionaries and Hanafi legal terminology.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NumberedTakeawayPreview() {
  return (
    <div
      style={{
        borderRadius: radius[16],
        border: '1px solid #e2e8f0',
        background: '#fff',
        padding: spacing[24],
        display: 'flex',
        gap: spacing[16],
        alignItems: 'flex-start',
        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.05)',
      }}
    >
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.pill,
          background: '#e0e7ff',
          color: '#4f46e5',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 18,
          fontWeight: 700,
          marginTop: 4,
        }}
      >
        1
      </span>
      <div>
        <h4 style={{ margin: `0 0 ${spacing[8]}`, fontSize: 18, fontWeight: 700, color: '#111827' }}>Differing opinions</h4>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: '#374151' }}>
          Keep the main and secondary positions distinct and clearly attributed.
        </p>
      </div>
    </div>
  )
}

export function LexicographyEntryRowPreview() {
  return lexEntry({
    arabic: 'مصر جامع',
    mono: 'miṣr jāmiʿ',
    text: 'Comprehensive city; a large urban center with civic amenities.',
    context: (
      <>
        <strong>Context:</strong> In Hanafi fiqh, typically defined by having a judge and a ruler capable of enforcing laws.
      </>
    ),
  })
}
