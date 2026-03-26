import layoutContract from './TypographyTokensLabScreen.contract'
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
      </LabSection>

      <LabSection
        title="Atmosphere"
        description="These are still judged visually, even if they already exist in the shell."
      >
        <LabPlaceholderCard title="Backdrop / watermark treatment" note="Shared stage backdrop and watermark presets." />
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
