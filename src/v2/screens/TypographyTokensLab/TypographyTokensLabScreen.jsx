import layoutContract from './TypographyTokensLabScreen.contract'
import BodyBackdropItems from '../../foundation/layout/BodyBackdropItems'
import { LabGenericCard, LabScaffold, LabSection } from '../../foundation/primitives/LabBoard'
import { colors, elevation, radius, spacing, surfacePadding, typography } from '../../foundation/tokens'

function Swatch({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[12], padding: `0 ${surfacePadding.minimumReadableInset}px 0 0` }}>
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: radius[12],
          background: value,
          border: `1px solid ${colors.lineSoft}`,
          flexShrink: 0,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ ...typography.bodyText, color: colors.textBody }}>{label}</span>
        <span style={{ ...typography.monoMeta, color: colors.textSoft }}>{value}</span>
      </div>
    </div>
  )
}

function BackdropPreview() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 220,
        overflow: 'hidden',
        borderRadius: radius[24],
        border: `1px solid ${colors.lineSoft}`,
        background:
          `radial-gradient(circle at 8% 10%, rgba(219, 234, 254, 0.72), transparent 24%), ` +
          `radial-gradient(circle at 88% 14%, rgba(226, 232, 240, 0.72), transparent 22%), ` +
          `linear-gradient(180deg, ${colors.bgTop} 0%, ${colors.bgBottom} 100%)`,
      }}
    >
      <BodyBackdropItems />
    </div>
  )
}

function PanelSurfaceLanguagePreview() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: spacing[12] }}>
      {[
        { label: 'Rest', shadow: elevation.flat, bg: '#fff' },
        { label: 'Raised', shadow: elevation.raised, bg: 'rgba(255,255,255,0.98)' },
        { label: 'Floating', shadow: elevation.floating, bg: 'rgba(255,255,255,0.98)' },
      ].map((panel) => (
        <div key={panel.label} style={{ minHeight: 116, borderRadius: radius[24], border: `1px solid ${colors.lineSoft}`, background: panel.bg, boxShadow: panel.shadow, padding: surfacePadding.standard, display: 'grid', alignContent: 'space-between' }}>
          <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>{panel.label}</p>
          <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.textStrong }}>Panel family</p>
        </div>
      ))}
    </div>
  )
}

function PaddingDisciplinePreview() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: spacing[12] }}>
      {[
        { label: 'Card', text: 'Titles and body copy must sit inside a clear readable inset.' },
        { label: 'Panel row', text: 'Labels, metadata, and actions share the same minimum edge safety.' },
        { label: 'Support surface', text: 'No text block should ever visually crowd the corner radius.' },
      ].map((item) => (
        <div
          key={item.label}
          style={{
            minHeight: 132,
            borderRadius: radius[24],
            border: `1px solid ${colors.lineSoft}`,
            background: '#fff',
            boxShadow: elevation.flat,
            padding: surfacePadding.comfortable,
            display: 'grid',
            alignContent: 'start',
            gap: spacing[10],
          }}
        >
          <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>{item.label}</p>
          <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.textStrong }}>Minimum readable inset</p>
          <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, lineHeight: 1.5, color: colors.textBody }}>
            {item.text}
          </p>
        </div>
      ))}
    </div>
  )
}

function SupportToneSystemPreview() {
  const tones = [
    {
      label: 'Lexicography',
      bg: 'rgba(243, 232, 255, 0.92)',
      border: 'rgba(216, 180, 254, 0.96)',
      color: '#7C3AED',
      meta: 'Reference-heavy support with scholarly emphasis.',
    },
    {
      label: 'Discussion',
      bg: 'rgba(224, 231, 255, 0.92)',
      border: 'rgba(165, 180, 252, 0.96)',
      color: '#4F46E5',
      meta: 'Attached explanatory or reflective support.',
    },
    {
      label: 'Manual notes',
      bg: 'rgba(254, 249, 195, 0.92)',
      border: 'rgba(253, 224, 71, 0.96)',
      color: '#A16207',
      meta: 'User-authored notes and annotations.',
    },
    {
      label: 'Raw text',
      bg: 'rgba(241, 245, 249, 0.96)',
      border: 'rgba(203, 213, 225, 0.96)',
      color: '#475569',
      meta: 'Quiet source or low-emphasis preserved content.',
    },
    {
      label: 'Repair / fail',
      bg: 'rgba(254, 226, 226, 0.94)',
      border: 'rgba(252, 165, 165, 0.96)',
      color: '#B91C1C',
      meta: 'Bounded correction or fail-state emphasis.',
    },
    {
      label: 'Ready / pass',
      bg: 'rgba(220, 252, 231, 0.92)',
      border: 'rgba(134, 239, 172, 0.96)',
      color: '#15803D',
      meta: 'Confirmed success and ready-to-proceed states.',
    },
  ]

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: spacing[12] }}>
      {tones.map((tone) => (
        <ToneSystemRow key={tone.label} tone={tone} />
      ))}
    </div>
  )
}

function EditorChromeOpacityPreview() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: spacing[12] }}>
      {[
        { label: 'Topbar chrome', opacity: 0.34 },
        { label: 'Footer hint', opacity: 0.28 },
        { label: 'Watermark', opacity: 0.085 },
      ].map((row) => (
        <ChromeOpacityRow key={row.label} row={row} />
      ))}
    </div>
  )
}

function ToneSystemRow({ tone }) {
  return (
    <div
      style={{
        width: '100%',
        minHeight: 92,
        borderRadius: radius[16],
        border: `1px solid ${tone.border}`,
        background: tone.bg,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          minHeight: 92,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: spacing[8],
          paddingTop: surfacePadding.roundedRowBlock,
          paddingBottom: surfacePadding.roundedRowBlock,
          paddingLeft: surfacePadding.roundedRowInline,
          paddingRight: surfacePadding.roundedRowInline,
          boxSizing: 'border-box',
        }}
      >
        <span style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: tone.color }}>{tone.label}</span>
        <span style={{ ...typography.bodyText, margin: 0, fontSize: 13, lineHeight: 1.4, color: tone.color }}>
          {tone.meta}
        </span>
      </div>
    </div>
  )
}

function ChromeOpacityRow({ row }) {
  return (
    <div
      style={{
        width: '100%',
        minHeight: 60,
        borderRadius: radius[12],
        border: `1px solid ${colors.lineSoft}`,
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          minHeight: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[16],
          paddingLeft: surfacePadding.roundedRowInline,
          paddingRight: surfacePadding.roundedRowInline,
          boxSizing: 'border-box',
        }}
      >
        <span style={{ ...typography.bodyText, fontSize: 14, color: colors.textBody }}>{row.label}</span>
        <span style={{ ...typography.monoMeta, color: colors.textSoft }}>opacity {row.opacity}</span>
      </div>
    </div>
  )
}

export default function TypographyTokensLabScreen({ route, shell }) {
  const content = (
    <>
      <LabSection
        title="Type roles"
        description="These should feel like one restrained system, not a bag of screen-local decisions."
      >
        <LabGenericCard title="Typography role system" status="Locked" note="Current V2 type roles are locked conceptually.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[12], padding: surfacePadding.comfortable }}>
            <h2 style={{ ...typography.displayTitle, margin: 0, fontSize: '56px', color: colors.textStrong }}>Display title</h2>
            <h3 style={{ ...typography.sectionTitle, margin: 0, fontSize: '38px', color: colors.textStrong }}>Section title</h3>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>Body text should feel neutral, readable, and calm.</p>
          </div>
        </LabGenericCard>
        <LabGenericCard title="Support / meta / mono / Arabic" status="Locked" note="Secondary roles should support the main hierarchy, never compete with it.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[12], padding: surfacePadding.comfortable }}>
            <p style={{ ...typography.supportSubtext, margin: 0, color: colors.textBody }}>Support subtext</p>
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Eyebrow label</p>
            <p style={{ ...typography.monoMeta, margin: 0, color: colors.textSoft }}>mono_meta / token_value</p>
            <p style={{ ...typography.arabicSourceText, margin: 0, color: colors.textStrong }} dir="rtl">لا تصح الجمعة إلا في مصر جامع</p>
          </div>
        </LabGenericCard>
      </LabSection>

      <LabSection
        title="Tokens"
        description="These define the visual language. We judge them as families rather than on individual screens."
        columns="repeat(3, minmax(0, 1fr))"
      >
        <LabGenericCard title="Blue/slate semantic palette" status="Locked" note="Blue/slate semantic palette is the current V2 standard.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[10], padding: surfacePadding.standard }}>
            <Swatch label="accentBase" value={colors.accentBase} />
            <Swatch label="accentStrong" value={colors.accentStrong} />
            <Swatch label="surfacePrimary" value={colors.surfacePrimary} />
            <Swatch label="textStrong" value={colors.textStrong} />
          </div>
        </LabGenericCard>
        <LabGenericCard title="Radius + elevation" status="Locked" note="Current V2 defaults are on lock unless a real system gap appears.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[12], padding: surfacePadding.standard }}>
            <div style={{ display: 'flex', gap: spacing[12], flexWrap: 'wrap' }}>
              {[radius[12], radius[16], radius[24], radius[32], radius.pill].map((item) => (
                <div key={item} style={{ padding: `${spacing[12]}px ${spacing[16]}px`, borderRadius: item, background: colors.surfacePrimary, border: `1px solid ${colors.lineSoft}` }}>
                  {item}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: spacing[12], flexWrap: 'wrap' }}>
              {Object.entries(elevation).map(([key, shadow]) => (
                <div
                  key={key}
                  style={{
                    padding: `${spacing[12]}px ${spacing[16]}px`,
                    borderRadius: radius[16],
                    background: colors.surfacePrimary,
                    border: `1px solid ${colors.lineSoft}`,
                    boxShadow: shadow,
                  }}
                >
                  {key}
                </div>
              ))}
            </div>
          </div>
        </LabGenericCard>
        <LabGenericCard
          title="Stage backdrop / watermark treatment"
          status="Locked"
          note="Shared atmosphere and watermark treatment from the shell."
          minHeight={0}
        >
          <BackdropPreview />
        </LabGenericCard>
      </LabSection>

      <LabSection
        title="Atmosphere"
        description="These are still judged visually, even if they already exist in the shell."
      >
        <LabGenericCard
          title="Readable inset / padding discipline"
          status="Locked"
          note="Every text-bearing card, row, and panel must preserve the minimum readable inset from edge to text."
          minHeight={0}
        >
          <PaddingDisciplinePreview />
        </LabGenericCard>
        <LabGenericCard title="Panel border / radius / shadow language" status="Candidate" note="Needs stronger central implementation rather than local styling." minHeight={0} displayMode="stretch">
          <PanelSurfaceLanguagePreview />
        </LabGenericCard>
        <LabGenericCard title="Semantic surface tone palette" status="Locked" note="Tone primarily affects surface, border, shadow, icon, and occasionally short titles; body and support text remain neutral by default." minHeight={0} displayMode="stretch">
          <SupportToneSystemPreview />
        </LabGenericCard>
        <LabGenericCard title="Editor chrome opacity rules" status="Locked" note="Shared standard values prevent editor chrome from drifting heavier or louder across screens." minHeight={0} displayMode="stretch">
          <EditorChromeOpacityPreview />
        </LabGenericCard>
      </LabSection>
    </>
  )

  return (
    <LabScaffold
      contract={layoutContract}
      route={route}
      shell={shell}
      eyebrow="Typography + tokens"
      title="Type, color, and surface language."
      intro="These are the quiet system-wide decisions that make the app feel like one product rather than many one-off screens."
      content={content}
    />
  )
}
