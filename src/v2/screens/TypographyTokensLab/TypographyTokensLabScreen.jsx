import layoutContract from './TypographyTokensLabScreen.contract'
import BodyBackdropItems from '../../foundation/layout/BodyBackdropItems'
import PrimaryCTA from '../../foundation/primitives/PrimaryCTA'
import {
  ProjectHomeDestinationCardPreview,
} from '../../foundation/lab-previews/patterns'
import { LabGenericCard, LabScaffold, LabSection } from '../../foundation/primitives/LabBoard'
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

function PanelSurfaceLanguagePreview() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: spacing[12] }}>
      {[
        { label: 'Rest', shadow: elevation.flat, bg: '#fff' },
        { label: 'Raised', shadow: elevation.raised, bg: 'rgba(255,255,255,0.98)' },
        { label: 'Floating', shadow: elevation.floating, bg: 'rgba(255,255,255,0.98)' },
      ].map((panel) => (
        <div key={panel.label} style={{ minHeight: 116, borderRadius: radius[24], border: `1px solid ${colors.lineSoft}`, background: panel.bg, boxShadow: panel.shadow, padding: spacing[16], display: 'grid', alignContent: 'space-between' }}>
          <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>{panel.label}</p>
          <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.textStrong }}>Panel family</p>
        </div>
      ))}
    </div>
  )
}

function SupportToneSystemPreview() {
  const tones = [
    { label: 'Lexicography', bg: 'rgba(243, 232, 255, 0.92)', border: 'rgba(216, 180, 254, 0.96)', color: '#7C3AED' },
    { label: 'Discussion', bg: 'rgba(224, 231, 255, 0.92)', border: 'rgba(165, 180, 252, 0.96)', color: '#4F46E5' },
    { label: 'Grade', bg: 'rgba(220, 252, 231, 0.92)', border: 'rgba(134, 239, 172, 0.96)', color: '#15803D' },
  ]

  return (
    <div style={{ display: 'grid', gap: spacing[10] }}>
      {tones.map((tone) => (
        <div key={tone.label} style={{ minHeight: 42, borderRadius: radius[16], border: `1px solid ${tone.border}`, background: tone.bg, display: 'flex', alignItems: 'center', padding: `0 ${spacing[14]}`, color: tone.color, fontWeight: 700 }}>
          {tone.label}
        </div>
      ))}
    </div>
  )
}

function EditorChromeOpacityPreview() {
  return (
    <div style={{ display: 'grid', gap: spacing[10] }}>
      {[
        { label: 'Topbar chrome', opacity: 0.34 },
        { label: 'Footer hint', opacity: 0.28 },
        { label: 'Watermark', opacity: 0.085 },
      ].map((row) => (
        <div key={row.label} style={{ minHeight: 42, borderRadius: radius[12], border: `1px solid ${colors.lineSoft}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${spacing[14]}` }}>
          <span style={{ ...typography.bodyText, fontSize: 14, color: colors.textBody }}>{row.label}</span>
          <span style={{ ...typography.monoMeta, color: colors.textSoft }}>opacity {row.opacity}</span>
        </div>
      ))}
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
        <LabGenericCard title="Blue/slate semantic palette" status="Locked" note="Blue/slate semantic palette is the current V2 standard.">
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
          title="Editor watermark treatment"
          status="Candidate"
          note="This is a distinct generic from the stage backdrop and should be judged inside the editor family too."
          minHeight={0}
        >
          <EditorWatermarkPreview />
        </LabGenericCard>
        <LabGenericCard title="Panel border / radius / shadow language" status="Candidate" note="Needs stronger central implementation rather than local styling." minHeight={0}>
          <PanelSurfaceLanguagePreview />
        </LabGenericCard>
        <LabGenericCard title="Primary CTA sheen / highlight language" status="Candidate" note="This should read as system polish, not a local gimmick." minHeight={0}>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <PrimaryCTA>AI segment text</PrimaryCTA>
          </div>
        </LabGenericCard>
        <LabGenericCard title="Support panel tone system" status="Candidate" note="Study support tones should be intentional and limited." minHeight={0}>
          <SupportToneSystemPreview />
        </LabGenericCard>
        <LabGenericCard title="Editor chrome opacity rules" status="Candidate" note="Recent drift showed how easy this family is to over-ink." minHeight={0}>
          <EditorChromeOpacityPreview />
        </LabGenericCard>
        <LabGenericCard title="Home hero / door card treatment" status="Candidate" note="Project Home’s destination surfaces should be judged here too." minHeight={0}>
          <ProjectHomeDestinationCardPreview />
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
