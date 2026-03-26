import { ArrowLeft, Pin } from 'lucide-react'
import layoutContract from './MotionInteractionLabScreen.contract'
import IconActionButton from '../../foundation/primitives/IconActionButton'
import PrimaryCTA from '../../foundation/primitives/PrimaryCTA'
import { LabGenericCard, LabPlaceholderCard, LabScaffold, LabSection } from '../../foundation/primitives/LabBoard'
import { colors, radius, spacing, typography } from '../../foundation/tokens'

export default function MotionInteractionLabScreen({ route, shell }) {
  const content = (
    <>
      <LabSection
        title="Interaction rules"
        description="These items should behave consistently across the app, even if they appear in different modes."
      >
        <LabGenericCard title="Utility hover reveal" status="Active extraction" note="Hover the mini controls to check the reveal box and sizing.">
          <div
            style={{
              display: 'flex',
              gap: spacing[12],
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
          </div>
        </LabGenericCard>
        <LabPlaceholderCard title="Split CTA open/select/close" note="Needs a real interactive demo board once SplitCTA is extracted." />
        <LabPlaceholderCard title="Outside-click dismissal" note="Should be standard for overlays unless pinned." />
        <LabPlaceholderCard title="Escape-to-close overlays" note="Same rule family as outside-click dismissal." />
        <LabPlaceholderCard title="Hover preview + pin to keep open" note="Study-shell support rail behavior with a broader reuse question." />
        <LabPlaceholderCard title="Float / dock support panel" note="Detaching a support surface from its docked state without losing context." />
        <LabPlaceholderCard title="Floating panel drag / resize" note="Needs a deliberate system call on when this is allowed and how it should feel." />
      </LabSection>

      <LabSection
        title="Motion language"
        description="Motion should clarify state and hierarchy, not decorate for its own sake."
      >
        <LabGenericCard title="CTA sheen" status="Candidate" note="Hover the button to assess the sheen sweep and lift feel.">
          <PrimaryCTA>AI segment text</PrimaryCTA>
        </LabGenericCard>
        <LabPlaceholderCard title="Menu / panel open motion" note="Needs reusable implementation helpers, not screen-local animation." />
        <LabPlaceholderCard title="Screen intro / transition motion" note="Documented, but not yet proven as a reusable motion family." />
        <LabPlaceholderCard title="Focused expand with dim backdrop" note="Used when a support surface expands into a central, temporary focus state." />
        <LabPlaceholderCard title="Support preview reveal motion" note="Hover reveal from the collapsed support rail should feel informative, not jumpy." />
        <LabPlaceholderCard title="Reduced motion fallback" note="Must be defined before we call the motion system finished." />
      </LabSection>
    </>
  )

  const rightRail = (
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
      <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Board note</p>
      <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
        Judge whether the motion clarifies the control. If it feels ornamental or game-like, it fails.
      </p>
    </div>
  )

  return (
    <LabScaffold
      contract={layoutContract}
      route={route}
      shell={shell}
      eyebrow="Motion + interaction"
      title="Behavior before choreography."
      intro="We review interactions and motion as system language here, not as local screen flourishes."
      content={content}
      rightRail={rightRail}
    />
  )
}
