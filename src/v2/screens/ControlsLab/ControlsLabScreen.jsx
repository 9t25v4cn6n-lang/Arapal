import { ArrowLeft, Pin, Sparkles } from 'lucide-react'
import layoutContract from './ControlsLabScreen.contract'
import PrimaryCTA from '../../foundation/primitives/PrimaryCTA'
import IconActionButton from '../../foundation/primitives/IconActionButton'
import { LabGenericCard, LabPlaceholderCard, LabScaffold, LabSection } from '../../foundation/primitives/LabBoard'
import { colors, radius, spacing, typography } from '../../foundation/tokens'

function UtilityControlPreview() {
  return (
    <div
      style={{
        display: 'flex',
        gap: spacing[12],
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: spacing[12],
        borderRadius: radius[16],
        background: 'rgba(239, 246, 255, 0.68)',
        border: `1px solid ${colors.lineSoft}`,
      }}
    >
      <IconActionButton
        size="utility-sm"
        label="Back"
        icon={<ArrowLeft size={16} strokeWidth={1.9} />}
      />
      <IconActionButton
        size="utility-sm"
        label="Pin"
        active
        icon={<Pin size={16} strokeWidth={1.9} />}
      />
      <IconActionButton
        size="utility-sm"
        label="Spark"
        icon={<Sparkles size={16} strokeWidth={1.9} />}
        style={{
          background: 'rgba(239, 246, 255, 0.96)',
          borderColor: 'rgba(191, 219, 254, 0.96)',
          color: colors.accentStrong,
        }}
      />
    </div>
  )
}

export default function ControlsLabScreen({ route, shell }) {
  const content = (
    <>
      <LabSection
        title="Calls to action"
        description="These are the primary action families for the app. We approve their feel here before they appear in product screens."
      >
        <LabGenericCard
          title="Primary CTA"
          status="Active extraction"
          note="Premium default state, with the sheen and hover simply sharpening it."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[12], alignItems: 'flex-start' }}>
            <PrimaryCTA icon={<Sparkles size={16} strokeWidth={1.9} />}>AI segment text</PrimaryCTA>
            <PrimaryCTA icon={<Sparkles size={16} strokeWidth={1.9} />} disabled>
              AI segment text
            </PrimaryCTA>
          </div>
        </LabGenericCard>
        <LabPlaceholderCard
          title="Split CTA"
          note="Must inherit the same premium family as the primary CTA, not become a bespoke screen-local treatment."
        />
      </LabSection>

      <LabSection
        title="Small controls"
        description="These mini controls should all belong to one family: back, pin, expand, collapse, and close."
      >
        <LabGenericCard
          title="Utility icon control"
          status="Active extraction"
          note="Hover should reveal the box cleanly without making the icon feel oversized."
          minHeight={130}
        >
          <UtilityControlPreview />
        </LabGenericCard>
        <LabPlaceholderCard
          title="Back pill"
          note="Operational header control for segmentation and other controlled workflows."
        />
      </LabSection>

      <LabSection
        title="Rows + toggles"
        description="These lower-level controls should feel like members of the same family rather than isolated one-offs."
      >
        <LabPlaceholderCard title="Preference toggle row" note="Used in advanced menus and settings-style overlays." />
        <LabPlaceholderCard title="Status chip / badge" note="Shared semantic chip for state, not a per-screen embellishment." />
        <LabPlaceholderCard title="Navigation rail row" note="Shared row treatment for the main app modes." />
        <LabPlaceholderCard title="Step bar" note="Multi-step operational flow progress pattern." />
      </LabSection>
    </>
  )

  const rightRail = (
    <>
      <div
        style={{
          border: `1px solid ${colors.lineSoft}`,
          borderRadius: radius[24],
          background: 'rgba(255, 255, 255, 0.96)',
          padding: spacing[18],
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[10],
        }}
      >
        <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Current board</p>
        <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
          Approve the CTA family and mini-control family before building more operational screens.
        </p>
      </div>
    </>
  )

  return (
    <LabScaffold
      contract={layoutContract}
      route={route}
      shell={shell}
      eyebrow="Controls"
      title="Buttons and control families."
      intro="Judge these by feel, scale, state, and consistency. If they don’t feel like one family here, they won’t feel coherent in the app."
      content={content}
      rightRail={rightRail}
    />
  )
}
