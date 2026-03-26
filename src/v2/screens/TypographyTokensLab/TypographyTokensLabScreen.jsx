import layoutContract from './TypographyTokensLabScreen.contract'
import BodyBackdropItems from '../../foundation/layout/BodyBackdropItems'
import { LabGenericCard, LabPlaceholderCard, LabScaffold, LabSection } from '../../foundation/primitives/LabBoard'
import { colors, elevation, radius, spacing, typography } from '../../foundation/tokens'

function Swatch({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[12] }}>
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

function EditorWatermarkPreview() {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: 180,
        overflow: 'hidden',
        borderRadius: radius[24],
        border: `1px solid ${colors.lineSoft}`,
        background: 'rgba(255,255,255,0.98)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.03) 0%, rgba(37, 99, 235, 0) 52%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 28,
          bottom: 20,
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: 56,
          lineHeight: 1,
          letterSpacing: '-0.06em',
          color: 'rgba(37, 99, 235, 0.085)',
          textShadow: '0 0 24px rgba(37, 99, 235, 0.06)',
          pointerEvents: 'none',
        }}
      >
        Arapal
      </div>
      <div style={{ padding: spacing[24], display: 'grid', gap: spacing[12] }}>
        <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Editor watermark</p>
        <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody, maxWidth: '34ch' }}>
          The watermark should sit at the edge of perception. It is part of the editor family, not a random decorative layer.
        </p>
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
        <LabGenericCard title="Display / page / section" status="Locked" note="Current V2 type roles are locked conceptually.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[12] }}>
            <h2 style={{ ...typography.displayTitle, margin: 0, fontSize: '56px', color: colors.textStrong }}>Display title</h2>
            <h3 style={{ ...typography.sectionTitle, margin: 0, fontSize: '38px', color: colors.textStrong }}>Section title</h3>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>Body text should feel neutral, readable, and calm.</p>
          </div>
        </LabGenericCard>
        <LabGenericCard title="Support / meta / mono / Arabic" status="Locked" note="Secondary roles should support the main hierarchy, never compete with it.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[12] }}>
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
        <LabGenericCard title="Color roles" status="Locked" note="Blue/slate semantic palette is the current V2 standard.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[10] }}>
            <Swatch label="accentBase" value={colors.accentBase} />
            <Swatch label="accentStrong" value={colors.accentStrong} />
            <Swatch label="surfacePrimary" value={colors.surfacePrimary} />
            <Swatch label="textStrong" value={colors.textStrong} />
          </div>
        </LabGenericCard>
        <LabGenericCard title="Radius + elevation" status="Locked" note="Current V2 defaults are on lock unless a real system gap appears.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[12] }}>
            <div style={{ display: 'flex', gap: spacing[12], flexWrap: 'wrap' }}>
              {[radius[12], radius[16], radius[24], radius[32], radius.pill].map((item) => (
                <div key={item} style={{ padding: `${spacing[12]} ${spacing[16]}`, borderRadius: item, background: colors.surfacePrimary, border: `1px solid ${colors.lineSoft}` }}>
                  {item}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: spacing[12], flexWrap: 'wrap' }}>
              {Object.entries(elevation).map(([key, shadow]) => (
                <div
                  key={key}
                  style={{
                    padding: `${spacing[12]} ${spacing[16]}`,
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
          title="Stage backdrop"
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
          title="Editor watermark treatment"
          status="Candidate"
          note="This is a distinct generic from the stage backdrop and should be judged inside the editor family too."
          minHeight={0}
        >
          <EditorWatermarkPreview />
        </LabGenericCard>
        <LabPlaceholderCard title="Panel border / shadow language" note="Needs stronger central implementation rather than local styling." />
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
